const { createHmac } = require("node:crypto");

const WEB3FORMS_URL = "https://api.web3forms.com/submit";
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TOURISM_SERVICES = [
  "Jain Tirth Yatra",
  "Ashtavinayak Darshan",
  "Jyotirling Darshan",
  "Char Dham Yatra",
  "Airport Transfers",
  "Corporate Travel",
  "Custom Itinerary Planning",
];
const CARS = [
  "Innova Crysta",
  "Swift",
  "Aura",
  "Ciaz",
  "Force Urbania",
  "Tempo Traveller",
  "Mini Bus",
  "45 Seater Bus",
  "Other",
];
const SAFE_ERROR = "We couldn't send your enquiry. Please review the form and try again.";

module.exports.config = {
  api: { bodyParser: { sizeLimit: "10kb" } },
};

function respond(res, status, body) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  return res.status(status).json(body);
}

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

const lastSecurityLogAt = new Map();

function hasQueryParameters(req) {
  try {
    return new URL(req.url || "/", "https://local.invalid").searchParams.size > 0;
  } catch {
    return true;
  }
}

function getLimit(name, fallback, maximum) {
  const value = Number(process.env[name]);
  return Number.isInteger(value) && value >= 1 && value <= maximum ? value : fallback;
}

function getAllowedOrigins() {
  return (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => {
      try {
        const url = new URL(value);
        return url.protocol === "https:" ||
          (process.env.NODE_ENV !== "production" && url.protocol === "http:" &&
            /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(url.host))
          ? url.origin
          : null;
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function getText(value, maximum, optional = false) {
  if (optional && (value === undefined || value === null)) return "";
  if (typeof value !== "string") return null;
  const text = value.trim();
  if (optional && text === "") return "";
  if (!text || text.length > maximum) return null;
  return text;
}

const NAME_PATTERN = /^\p{L}[\p{L}\p{M}]*(?:(?:[ '\u2019-]\p{L}[\p{L}\p{M}]*)|(?:\.\s?\p{L}[\p{L}\p{M}]*))*\.?$/u;
const EMAIL_PATTERN = /^(?!.*\.\.)[A-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,63}$/i;
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

function normalizePhone(value) {
  if (!value || !/^[+0-9\s().-]+$/.test(value)) return null;
  let compact = value.replace(/[\s().-]/g, "");
  if (compact.startsWith("00")) compact = `+${compact.slice(2)}`;
  if (compact.startsWith("+")) {
    return /^\+[1-9]\d{7,14}$/.test(compact) ? compact : null;
  }
  if (/^[6-9]\d{9}$/.test(compact)) return `+91${compact}`;
  if (/^0[6-9]\d{9}$/.test(compact)) return `+91${compact.slice(1)}`;
  return null;
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

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day &&
    value >= todayInIndia();
}

function containsMarkup(value) {
  return /[<>]/.test(value) || CONTROL_CHARS.test(value);
}

function getClientIp(req) {
  const value = req.headers["x-real-ip"] ||
    (process.env.NODE_ENV !== "production" ? req.socket?.remoteAddress : "");
  return typeof value === "string" && value.length <= 64 ? value.trim() : "";
}

function digest(value) {
  return createHmac("sha256", process.env.ENQUIRY_HASH_SECRET).update(value).digest("hex");
}

async function redisCommand(args) {
  const url = new URL(process.env.UPSTASH_REDIS_REST_URL || "");
  if (url.protocol !== "https:" || !url.hostname.endsWith(".upstash.io") || url.username || url.password) {
    throw new Error("Rate limit service configuration is invalid");
  }
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error("Rate limit service request failed");
  const body = await response.json();
  if (body.error) throw new Error("Rate limit service request failed");
  return body.result;
}

async function enforceRateLimit(req) {
  const ip = getClientIp(req);
  if (!ip) throw new Error("Client address is unavailable");
  const max = getLimit("RATE_LIMIT_MAX", 5, 100);
  const windowSeconds = getLimit("RATE_LIMIT_WINDOW_SECONDS", 900, 86400);
  const key = `contact:rate:${digest(ip)}`;
  const script = "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]); end; return n";
  const count = await redisCommand(["EVAL", script, "1", key, String(windowSeconds)]);
  if (!Number.isInteger(count)) throw new Error("Rate limit response is invalid");
  return count <= max;
}

async function reserveDuplicateWindow(values) {
  const fingerprint = digest(JSON.stringify([
    values.name,
    values.phone,
    values.email,
    values.service,
    values.car,
    values.date,
    values.passengers,
    values.pickup,
    values.message,
  ]));
  const result = await redisCommand([
    "SET",
    `contact:dedupe:${fingerprint}`,
    "1",
    "EX",
    "120",
    "NX",
  ]);
  return result === "OK";
}

async function verifyTurnstile(token, req, allowedOrigins) {
  const values = new URLSearchParams({
    secret: process.env.TURNSTILE_SECRET_KEY,
    response: token,
  });
  const ip = getClientIp(req);
  if (ip) values.set("remoteip", ip);

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: values,
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) return false;
  const result = await response.json();
  const allowedHosts = new Set(allowedOrigins.map((origin) => new URL(origin).hostname));
  return result.success === true &&
    typeof result.hostname === "string" &&
    allowedHosts.has(result.hostname);
}

async function handleContact(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return respond(res, 405, { error: "Method not allowed." });
  }
  if (hasQueryParameters(req)) {
    return respond(res, 400, { error: "Please submit the form again." });
  }
  if (!/^application\/json(?:\s*;|$)/i.test(req.headers["content-type"] || "")) {
    return respond(res, 415, { error: "Please submit the form again." });
  }

  const allowedOrigins = getAllowedOrigins();
  const origin = req.headers.origin;
  if (!allowedOrigins.length || typeof origin !== "string" ||
      !allowedOrigins.includes(origin) || new URL(origin).host !== req.headers.host) {
    if (Math.random() < 0.05) logSecurityEvent("contact_origin_rejected", req);
    return respond(res, 403, { error: "This form submission is not allowed." });
  }

  const input = req.body;
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return respond(res, 400, { error: SAFE_ERROR });
  }
  const allowedFields = new Set([
    "name", "phone", "email", "service", "car", "date", "passengers",
    "pickup", "message", "turnstileToken", "website",
  ]);
  if (Object.keys(input).some((key) => !allowedFields.has(key))) {
    return respond(res, 400, { error: SAFE_ERROR });
  }
  if (input.website !== undefined &&
      (typeof input.website !== "string" || input.website.trim())) {
    return respond(res, 400, { error: SAFE_ERROR });
  }

  const name = getText(input.name, 80);
  const phoneText = getText(input.phone, 40);
  const phone = phoneText === null ? null : normalizePhone(phoneText);
  const email = getText(input.email, 254, true);
  const service = getText(input.service, 80);
  const car = getText(input.car, 80);
  const date = getText(input.date, 10);
  const passengers = getText(input.passengers, 3);
  const pickup = getText(input.pickup, 160);
  const message = getText(input.message, 3000);
  const maxPassengers = getLimit("MAX_PASSENGERS", 40, 100);

  if (!name || name.length < 2 || !NAME_PATTERN.test(name) ||
      !phone || email === null || (email && (email.length > 254 ||
        email.split("@")[0].length > 64 || !EMAIL_PATTERN.test(email))) ||
      !TOURISM_SERVICES.includes(service) || !CARS.includes(car) ||
      !date || !isValidDate(date) || passengers === null ||
      !/^\d{1,3}$/.test(passengers) || Number(passengers) < 1 ||
      Number(passengers) > maxPassengers || !pickup || containsMarkup(pickup) ||
      !message || containsMarkup(message) || !input.turnstileToken ||
      typeof input.turnstileToken !== "string" || input.turnstileToken.length > 2048) {
    return respond(res, 400, { error: SAFE_ERROR });
  }

  const requiredConfig = [
    process.env.WEB3FORMS_ACCESS_KEY,
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN,
    process.env.TURNSTILE_SECRET_KEY,
    process.env.ENQUIRY_HASH_SECRET,
  ];
  if (requiredConfig.some((value) => !value) || process.env.ENQUIRY_HASH_SECRET.length < 32) {
    return respond(res, 503, { error: "Secure enquiry submission is temporarily unavailable." });
  }

  try {
    if (!await enforceRateLimit(req)) {
      logSecurityEvent("contact_rate_limited", req);
      return respond(res, 429, { error: "Too many enquiries. Please wait before trying again." });
    }
  } catch {
    logSecurityEvent("contact_rate_limit_unavailable", req);
    return respond(res, 503, { error: "Secure enquiry submission is temporarily unavailable." });
  }

  try {
    if (!await verifyTurnstile(input.turnstileToken, req, allowedOrigins)) {
      logSecurityEvent("contact_turnstile_rejected", req);
      return respond(res, 400, { error: "Security verification expired. Please complete it again." });
    }
  } catch {
    logSecurityEvent("contact_turnstile_unavailable", req);
    return respond(res, 503, { error: "Security verification is temporarily unavailable. Please try again." });
  }

  const values = { name, phone, email, service, car, date, passengers, pickup, message };
  try {
    if (!await reserveDuplicateWindow(values)) {
      logSecurityEvent("contact_duplicate_rejected", req);
      return respond(res, 409, { error: "This enquiry was just submitted. Please wait a moment before retrying." });
    }
  } catch {
    logSecurityEvent("contact_deduplication_unavailable", req);
    return respond(res, 503, { error: "Secure enquiry submission is temporarily unavailable." });
  }

  try {
    const formData = {
      access_key: process.env.WEB3FORMS_ACCESS_KEY,
      subject: "New car rental enquiry",
      form_name: "Car Rental Enquiry",
      name,
      phone,
      service,
      car,
      date,
      passengers,
      pickup,
      message,
    };
    if (email) formData.email = email;
    const providerResponse = await fetch(WEB3FORMS_URL, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      signal: AbortSignal.timeout(10000),
    });
    if (!providerResponse.ok) {
      logSecurityEvent("contact_provider_rejected", req);
      return respond(res, 502, { error: "We couldn't send your enquiry. Please try again shortly." });
    }
    const providerResult = await providerResponse.json();
    if (providerResult.success !== true) {
      logSecurityEvent("contact_provider_rejected", req);
      return respond(res, 502, { error: "We couldn't send your enquiry. Please try again shortly." });
    }
    return respond(res, 200, { success: true });
  } catch {
    logSecurityEvent("contact_provider_unavailable", req);
    return respond(res, 502, { error: "We couldn't send your enquiry. Please try again shortly." });
  }
}

module.exports = async function contact(req, res) {
  try {
    return await handleContact(req, res);
  } catch {
    logSecurityEvent("contact_unhandled_error", req);
    return respond(res, 500, { error: "Secure enquiry submission is temporarily unavailable." });
  }
};
