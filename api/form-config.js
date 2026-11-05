function respond(res, status, body) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  return res.status(status).json(body);
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
  if (typeof host !== "string") return false;
  // This read-only endpoint returns public limits and the current date only.
  if (origin === undefined) return true;
  if (typeof origin !== "string") return false;
  try {
    const url = new URL(origin);
    const localHttp = process.env.NODE_ENV !== "production" &&
      url.protocol === "http:" && /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(url.host);
    return url.host === host && (url.protocol === "https:" || localHttp);
  } catch {
    return false;
  }
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

module.exports = function formConfig(req, res) {
  try {
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return respond(res, 405, { error: "Method not allowed." });
    }
    if (hasQueryParameters(req) || !isSameOrigin(req)) {
      return respond(res, 403, { error: "This request is not allowed." });
    }
    const max = Number(process.env.MAX_PASSENGERS);
    const maxPassengers = Number.isInteger(max) && max >= 1 && max <= 100 ? max : 40;
    return respond(res, 200, { maxPassengers, today: todayInIndia() });
  } catch {
    return respond(res, 500, { error: "Form configuration is temporarily unavailable." });
  }
};
