const { createHash } = require("node:crypto");
const { isIP } = require("node:net");

const WEB3FORMS_URL = "https://api.web3forms.com/submit";
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
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const DUPLICATE_WINDOW_MS = 2 * 60 * 1000;
const rateWindows = new Map();
const duplicateWindows = new Map();
const lastSecurityLogAt = new Map();
const lastMapPruneAt = new WeakMap();

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

function pruneExpired(map, now) {
  if (now - (lastMapPruneAt.get(map) || 0) < 60000 && map.size < 10000) return;
  lastMapPruneAt.set(map, now);
  for (const [key, value] of map) {
    if (value.expiresAt <= now) map.delete(key);
  }
  while (map.size > 10000) map.delete(map.keys().next().value);
}

function hasQueryParameters(req) {
  try {
    return new URL(req.url || "/", "https://local.invalid").searchParams.size > 0;
  } catch {
    return true;
  }
}

function isSameOrigin(req) {
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (typeof origin !== "string" || typeof host !== "string") return false;
  try {
    const url = new URL(origin);
    const localHttp = process.env.NODE_ENV !== "production" &&
      url.protocol === "http:" && /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(url.host);
    return url.host === host && (url.protocol === "https:" || localHttp);
  } catch {
    return false;
  }
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
  if (compact.startsWith("+")) return /^\+[1-9]\d{7,14}$/.test(compact) ? compact : null;
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
  return typeof value === "string" && value.length <= 64 && isIP(value.trim()) ? value.trim() : "";
}

function digest(value) {
  return createHash("sha256").update(value).digest("hex");
}

function enforceRateLimit(req) {
  const ip = getClientIp(req);
  if (!ip) return null;
  const now = Date.now();
  pruneExpired(rateWindows, now);
  const key = digest(ip);
  const current = rateWindows.get(key);
  if (!current || current.expiresAt <= now) {
    rateWindows.set(key, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (current.count >= RATE_LIMIT_MAX) return false;
  current.count += 1;
  return true;
}

function reserveDuplicateWindow(values) {
  const now = Date.now();
  pruneExpired(duplicateWindows, now);
  const fingerprint = digest(JSON.stringify([
    values.name, values.phone, values.email, values.service, values.car,
    values.date, values.passengers, values.pickup, values.message,
  ]));
  const existing = duplicateWindows.get(fingerprint);
  if (existing && existing.expiresAt > now) return false;
  duplicateWindows.set(fingerprint, { expiresAt: now + DUPLICATE_WINDOW_MS });
  return true;
}

async function handleContact(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return respond(res, 405, { error: "Method not allowed." });
  }
  if (hasQueryParameters(req)) return respond(res, 400, { error: "Please submit the form again." });
  if (!/^application\/json(?:\s*;|$)/i.test(req.headers["content-type"] || "")) {
    return respond(res, 415, { error: "Please submit the form again." });
  }
  if (!isSameOrigin(req)) {
    logSecurityEvent("contact_origin_rejected", req);
    return respond(res, 403, { error: "This form submission is not allowed." });
  }

  const rateAllowed = enforceRateLimit(req);
  if (rateAllowed === null) {
    logSecurityEvent("contact_client_ip_unavailable", req);
    return respond(res, 503, { error: "Enquiry submission is temporarily unavailable." });
  }
  if (!rateAllowed) {
    logSecurityEvent("contact_rate_limited", req);
    return respond(res, 429, { error: "Too many enquiries. Please wait before trying again." });
  }

  const input = req.body;
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return respond(res, 400, { error: SAFE_ERROR });
  }
  const allowedFields = new Set([
    "name", "phone", "email", "service", "car", "date", "passengers",
    "pickup", "message", "website",
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
  const max = Number(process.env.MAX_PASSENGERS);
  const maxPassengers = Number.isInteger(max) && max >= 1 && max <= 100 ? max : 40;

  if (!name || name.length < 2 || !NAME_PATTERN.test(name) ||
      !phone || email === null || (email && (email.split("@")[0].length > 64 || !EMAIL_PATTERN.test(email))) ||
      !TOURISM_SERVICES.includes(service) || !CARS.includes(car) ||
      !date || !isValidDate(date) || passengers === null ||
      !/^\d{1,3}$/.test(passengers) || Number(passengers) < 1 ||
      Number(passengers) > maxPassengers || !pickup || containsMarkup(pickup) ||
      !message || containsMarkup(message)) {
    return respond(res, 400, { error: SAFE_ERROR });
  }

  if (!process.env.WEB3FORMS_ACCESS_KEY?.trim()) {
    logSecurityEvent("contact_provider_configuration_missing", req);
    return respond(res, 503, { error: "Enquiry submission is temporarily unavailable." });
  }

  const values = { name, phone, email, service, car, date, passengers, pickup, message };
  if (!reserveDuplicateWindow(values)) {
    logSecurityEvent("contact_duplicate_rejected", req);
    return respond(res, 409, { error: "This enquiry was just submitted. Please wait before retrying." });
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
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: new URLSearchParams(formData),
      signal: AbortSignal.timeout(10000),
    });
    let providerResult;
    try {
      providerResult = await providerResponse.json();
    } catch {
      providerResult = null;
    }
    if (!providerResponse.ok || providerResult?.success !== true) {
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
    return respond(res, 500, { error: "Enquiry submission is temporarily unavailable." });
  }
};
