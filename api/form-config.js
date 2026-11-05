const { createHmac } = require("node:crypto");

const CONFIG_RATE_LIMIT = 60;
const CONFIG_RATE_WINDOW_SECONDS = 60;
const UPSTASH_RATE_SCRIPT = "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]); end; return n";

function respond(res, status, body) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  return res.status(status).json(body);
}

const lastSecurityLogAt = new Map();

function logSecurityEvent(event, req) {
  if (lastSecurityLogAt.has(event) && Date.now() - lastSecurityLogAt.get(event) < 60000) return;
  lastSecurityLogAt.set(event, Date.now());
  const requestId = req?.headers?.["x-vercel-id"];
  const record = { event, at: new Date().toISOString() };
  if (typeof requestId === "string" && /^[A-Za-z0-9:-]{1,128}$/.test(requestId)) {
    record.requestId = requestId;
  }
  console.warn(JSON.stringify(record));
}

function hasQueryParameters(req) {
  try {
    return new URL(req.url || "/", "https://local.invalid").searchParams.size > 0;
  } catch {
    return true;
  }
}

function isAllowedOrigin(origin) {
  if (typeof origin !== "string") return true;
  return (process.env.ALLOWED_ORIGINS || "").split(",").some((configured) => {
    try {
      const allowed = new URL(configured.trim());
      const protocolAllowed = allowed.protocol === "https:" ||
        (process.env.NODE_ENV !== "production" && allowed.protocol === "http:" &&
          /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(allowed.host));
      return protocolAllowed && allowed.origin === origin;
    } catch {
      return false;
    }
  });
}

function todayInIndia() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const fields = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${fields.year}-${fields.month}-${fields.day}`;
}

async function enforceConfigRateLimit(req) {
  const ip = req.headers["x-real-ip"] ||
    (process.env.NODE_ENV !== "production" ? req.socket?.remoteAddress : "");
  if (typeof ip !== "string" || !ip.trim() || ip.length > 64) {
    throw new Error("Client address is unavailable");
  }
  const redisUrl = new URL(process.env.UPSTASH_REDIS_REST_URL || "");
  if (redisUrl.protocol !== "https:" || !redisUrl.hostname.endsWith(".upstash.io") ||
      redisUrl.username || redisUrl.password) {
    throw new Error("Rate limiter configuration is invalid");
  }
  const ipHash = createHmac("sha256", process.env.ENQUIRY_HASH_SECRET)
    .update(ip.trim())
    .digest("hex");
  const response = await fetch(redisUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      "EVAL",
      UPSTASH_RATE_SCRIPT,
      "1",
      `contact:config:${ipHash}`,
      String(CONFIG_RATE_WINDOW_SECONDS),
    ]),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error("Rate limiter request failed");
  const result = await response.json();
  if (!Number.isInteger(result.result)) throw new Error("Rate limiter response is invalid");
  return result.result <= CONFIG_RATE_LIMIT;
}

async function getFormConfig(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return respond(res, 405, { error: "Method not allowed." });
  }
  if (req.body && (typeof req.body !== "object" || Array.isArray(req.body) || Object.keys(req.body).length)) {
    return respond(res, 400, { error: "Invalid request." });
  }
  if (hasQueryParameters(req)) {
    return respond(res, 400, { error: "Invalid request." });
  }
  const origin = req.headers.origin;
  if (!isAllowedOrigin(origin) ||
      (typeof origin === "string" && new URL(origin).host !== req.headers.host)) {
    if (Math.random() < 0.05) logSecurityEvent("form_config_origin_rejected", req);
    return respond(res, 403, { error: "This request is not allowed." });
  }

  const configured = [
    process.env.TURNSTILE_SITE_KEY,
    process.env.TURNSTILE_SECRET_KEY,
    process.env.WEB3FORMS_ACCESS_KEY,
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN,
    process.env.ENQUIRY_HASH_SECRET,
    process.env.ALLOWED_ORIGINS,
  ].every((value) => typeof value === "string" && value.trim());
  if (!configured || process.env.ENQUIRY_HASH_SECRET.length < 32) {
    return respond(res, 503, { error: "Secure enquiry submission is temporarily unavailable." });
  }

  try {
    if (!await enforceConfigRateLimit(req)) {
      logSecurityEvent("form_config_rate_limited", req);
      return respond(res, 429, { error: "Please wait before trying again." });
    }
  } catch {
    logSecurityEvent("form_config_rate_limit_unavailable", req);
    return respond(res, 503, { error: "Secure enquiry submission is temporarily unavailable." });
  }

  const max = Number(process.env.MAX_PASSENGERS);
  const maxPassengers = Number.isInteger(max) && max >= 1 && max <= 100 ? max : 40;
  return respond(res, 200, {
    siteKey: process.env.TURNSTILE_SITE_KEY,
    maxPassengers,
    today: todayInIndia(),
  });
}

module.exports = function formConfig(req, res) {
  try {
    return getFormConfig(req, res);
  } catch {
    logSecurityEvent("form_config_unhandled_error", req);
    return respond(res, 500, { error: "Secure enquiry submission is temporarily unavailable." });
  }
};
