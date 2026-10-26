const { createHash } = require("node:crypto");

const WEB3FORMS_URL = "https://api.web3forms.com/submit";
const RATE_LIMIT = 5;
const RATE_WINDOW_SECONDS = 900;
const TOURISM_SERVICES = [
  "Jain Tirth Yatra",
  "Ashtavinayak Darshan",
  "Jyotirling Darshan",
  "Char Dham Yatra",
  "Airport Transfers",
  "Corporate Travel",
  "Custom Itinerary Planning",
];
const RATE_LIMIT_SCRIPT =
  "local count=redis.call('INCR',KEYS[1]); if count==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]); end; return count";

module.exports.config = {
  api: {
    bodyParser: {
      sizeLimit: "10kb",
    },
  },
};

function respond(res, status, body) {
  res.status(status).json(body);
}

function getText(value, maxLength) {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text.length <= maxLength ? text : null;
}

function isValidName(value) {
  return value.length >= 2 &&
    value.length <= 80 &&
    /^\p{L}+(?:(?:[ '-]\p{L}+)|(?:\.\s?\p{L}+))*(?:\.)?$/u.test(value);
}

function normalizeIndianPhone(value) {
  if (!/^(?:\+91[\s-]?)?[6-9](?:[\s-]?\d){9}$/.test(value)) return null;

  const digits = value.replace(/[\s-]/g, "").replace(/^\+91/, "");
  return /^[6-9]\d{9}$/.test(digits) ? `+91${digits}` : null;
}

function isValidEmail(value) {
  if (!value) return true;
  const localPart = value.split("@")[0];
  return value.length <= 254 &&
    localPart.length <= 64 &&
    /^(?!.*\.\.)[A-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,63}$/i.test(value);
}

function isValidDate(value) {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;
}

function getValidatedOrigin(req) {
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (typeof origin !== "string" || typeof host !== "string") return false;

  try {
    const parsedOrigin = new URL(origin);
    return parsedOrigin.host === host &&
      (parsedOrigin.protocol === "https:" ||
        (parsedOrigin.protocol === "http:" && /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)));
  } catch {
    return false;
  }
}

async function isRateLimited(req) {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const clientIp = req.headers["x-real-ip"];

  if (!redisUrl || !redisToken || typeof clientIp !== "string" || !clientIp.trim()) {
    throw new Error("Rate limiting is not configured");
  }

  const parsedRedisUrl = new URL(redisUrl);
  if (parsedRedisUrl.protocol !== "https:") {
    throw new Error("Rate limiting URL must use HTTPS");
  }

  const ipHash = createHash("sha256").update(clientIp.trim()).digest("hex");
  const redisResponse = await fetch(parsedRedisUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${redisToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      "EVAL",
      RATE_LIMIT_SCRIPT,
      "1",
      `contact:rate:${ipHash}`,
      String(RATE_WINDOW_SECONDS),
    ]),
    signal: AbortSignal.timeout(5000),
  });
  if (!redisResponse.ok) throw new Error("Rate limit service request failed");

  const result = await redisResponse.json();
  if (!Number.isInteger(result.result)) {
    throw new Error("Rate limit service returned an invalid response");
  }
  return result.result > RATE_LIMIT;
}

module.exports = async function contact(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return respond(res, 405, { error: "Method not allowed." });
  }
  if (!getValidatedOrigin(req)) {
    return respond(res, 403, { error: "Request origin is not allowed." });
  }
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    return respond(res, 400, { error: "Please submit a valid enquiry." });
  }

  const input = req.body;
  if (typeof input.website === "string" && input.website.trim()) {
    return respond(res, 400, { error: "Please submit a valid enquiry." });
  }
  if (input.botcheck) {
    return respond(res, 400, { error: "Please submit a valid enquiry." });
  }

  const name = getText(input.name, 80);
  const email = getText(input.email, 254);
  const phoneInput = getText(input.phone, 40);
  const phone = phoneInput === null ? null : normalizeIndianPhone(phoneInput);
  const service = getText(input.service, 80);
  const car = getText(input.car, 80);
  const date = getText(input.date, 10);
  const passengers = getText(input.passengers, 3);
  const pickup = getText(input.pickup, 160);
  const message = getText(input.message, 3000);

  if (
    !name ||
    !isValidName(name) ||
    !email ||
    !isValidEmail(email) ||
    !phone ||
    !TOURISM_SERVICES.includes(service) ||
    !pickup ||
    !message ||
    !car ||
    !date ||
    passengers === null ||
    !isValidDate(date) ||
    !/^\d{1,3}$/.test(passengers) ||
    Number(passengers) < 1 ||
    Number(passengers) > 40
  ) {
    return respond(res, 400, { error: "Please check the required fields and try again." });
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    return respond(res, 503, {
      error: "Email enquiries are not configured. The site owner must set WEB3FORMS_ACCESS_KEY after obtaining a key at https://web3forms.com/.",
    });
  }
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return respond(res, 503, {
      error: "The enquiry rate limiter is not configured. The site owner must set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.",
    });
  }

  let rateLimited;
  try {
    rateLimited = await isRateLimited(req);
  } catch {
    return respond(res, 503, {
      error: "The enquiry rate limiter is unavailable. Please try again later or contact the site owner.",
    });
  }
  if (rateLimited) {
    return respond(res, 429, { error: "Too many enquiries. Please try again later." });
  }

  try {
    const providerResponse = await fetch(WEB3FORMS_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: "New car rental enquiry",
        form_name: "Car Rental Enquiry",
        page: "Contact & Enquiry section",
        submitted_at: new Date().toISOString(),
        name,
        email,
        phone,
        service,
        car,
        date,
        passengers,
        pickup,
        message,
        botcheck: "",
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!providerResponse.ok) {
      return respond(res, 502, { error: "We couldn't send your enquiry. Please try again." });
    }

    const providerResult = await providerResponse.json();
    if (providerResult.success !== true) {
      return respond(res, 502, { error: "We couldn't send your enquiry. Please try again." });
    }
    return respond(res, 200, { success: true });
  } catch {
    return respond(res, 502, { error: "We couldn't send your enquiry. Please try again." });
  }
};
