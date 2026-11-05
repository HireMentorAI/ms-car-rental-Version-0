const { createHash } = require("node:crypto");
const { isIP } = require("node:net");

const WEB3FORMS_URL = "https://api.web3forms.com/submit";
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const DUPLICATE_WINDOW_MS = 2 * 60 * 1000;
const RATE_WINDOWS = new Map();
const DUPLICATE_WINDOWS = new Map();
const PRUNE_TIMES = new WeakMap();
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

module.exports.config = { api: { bodyParser: { sizeLimit: "10kb" } } };

function respond(res, status, body) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  return res.status(status).json(body);
}

function pruneExpired(map, now) {
  if (now - (PRUNE_TIMES.get(map) || 0) < 60000 && map.size < 10000) return;
  PRUNE_TIMES.set(map, now);
  for (const [key, value] of map) if (value.expiresAt <= now) map.delete(key);
  while (map.size > 10000) map.delete(map.keys().next().value);
}

function getText(value, maxLength) {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text && text.length <= maxLength ? text : null;
}

function isValidName(value) {
  return value.length >= 3 && value.length <= 80 && /^\p{L}+(?: +\p{L}+)*$/u.test(value);
}

function isValidEmail(value) {
  const local = value.split("@")[0];
  return value.length <= 254 && local.length <= 64 &&
    /^(?!.*\.\.)[A-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,63}$/i.test(value);
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
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day &&
    value >= todayInIndia();
}

function getValidatedOrigin(req) {
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (typeof origin !== "string" || typeof host !== "string") return false;
  try {
    const parsed = new URL(origin);
    const localHttp = process.env.NODE_ENV !== "production" &&
      parsed.protocol === "http:" && /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
    return parsed.host === host && (parsed.protocol === "https:" || localHttp);
  } catch {
    return false;
  }
}

function digest(value) {
  return createHash("sha256").update(value).digest("hex");
}

function allowByRate(req) {
  const rawIp = req.headers["x-real-ip"] ||
    (process.env.NODE_ENV !== "production" ? req.socket?.remoteAddress : "");
  if (typeof rawIp !== "string" || rawIp.length > 64 || !isIP(rawIp.trim())) return null;
  const now = Date.now();
  pruneExpired(RATE_WINDOWS, now);
  const key = digest(rawIp.trim());
  const current = RATE_WINDOWS.get(key);
  if (!current || current.expiresAt <= now) {
    RATE_WINDOWS.set(key, { count: 1, expiresAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (current.count >= RATE_LIMIT) return false;
  current.count += 1;
  return true;
}

function reserveDuplicate(values) {
  const now = Date.now();
  pruneExpired(DUPLICATE_WINDOWS, now);
  const key = digest(JSON.stringify(values));
  const existing = DUPLICATE_WINDOWS.get(key);
  if (existing && existing.expiresAt > now) return false;
  DUPLICATE_WINDOWS.set(key, { expiresAt: now + DUPLICATE_WINDOW_MS });
  return true;
}

module.exports = async function contact(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return respond(res, 405, { error: "Method not allowed." });
    }
    if (!/^application\/json(?:\s*;|$)/i.test(req.headers["content-type"] || "")) {
      return respond(res, 415, { error: "Please submit the form again." });
    }
    if (!getValidatedOrigin(req)) return respond(res, 403, { error: "This request is not allowed." });

    const rateAllowed = allowByRate(req);
    if (rateAllowed === null) return respond(res, 503, { error: "Enquiry submission is temporarily unavailable." });
    if (!rateAllowed) return respond(res, 429, { error: "Too many enquiries. Please wait before trying again." });

    const input = req.body;
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      return respond(res, 400, { error: "Please check the required fields and try again." });
    }
    const allowedFields = new Set([
      "name", "phone", "email", "service", "car", "date", "passengers",
      "pickup", "message", "botcheck",
    ]);
    if (Object.keys(input).some((key) => !allowedFields.has(key)) ||
        (input.botcheck !== undefined && (typeof input.botcheck !== "string" || input.botcheck.trim()))) {
      return respond(res, 400, { error: "Please check the required fields and try again." });
    }

    const name = getText(input.name, 80);
    const phone = getText(input.phone, 10);
    const email = getText(input.email, 254);
    const service = getText(input.service, 80);
    const car = getText(input.car, 80);
    const date = getText(input.date, 10);
    const passengers = getText(input.passengers, 2);
    const pickup = getText(input.pickup, 160);
    const message = getText(input.message, 500);
    const unsafeText = /[<>\u0000-\u001F\u007F]/;

    if (!name || !isValidName(name) || !phone || !/^\d{10}$/.test(phone) ||
        !email || !isValidEmail(email) || !TOURISM_SERVICES.includes(service) ||
        !CARS.includes(car) || !date || !isValidDate(date) || !passengers ||
        !/^\d{1,2}$/.test(passengers) || Number(passengers) < 1 || Number(passengers) > 45 ||
        !pickup || pickup.length < 3 || unsafeText.test(pickup) ||
        !message || message.length < 10 || unsafeText.test(message)) {
      return respond(res, 400, { error: "Please check the required fields and try again." });
    }

    const accessKey = process.env.WEB3FORMS_ACCESS_KEY?.trim();
    if (!accessKey || accessKey.startsWith("your_")) {
      return respond(res, 503, { error: "Enquiry delivery is not configured yet." });
    }

    const values = { name, phone, email, service, car, date, passengers, pickup, message };
    if (!reserveDuplicate(values)) {
      return respond(res, 409, { error: "This enquiry was just submitted. Please wait before retrying." });
    }

    const providerResponse = await fetch(WEB3FORMS_URL, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        subject: "New car rental enquiry",
        form_name: "Car Rental Enquiry",
        ...values,
        botcheck: "",
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!providerResponse.ok || (await providerResponse.json()).success !== true) {
      return respond(res, 502, { error: "We couldn't send your enquiry. Please try again shortly." });
    }
    return respond(res, 200, { success: true });
  } catch {
    return respond(res, 500, { error: "Enquiry submission is temporarily unavailable." });
  }
};
