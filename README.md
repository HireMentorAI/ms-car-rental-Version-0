# Jain Ventures — Website

A simple, modern, and professional one-page car rental website built with **pure HTML, CSS, and vanilla JavaScript**. No build step. No dependencies.

## ✨ Features

- Clean, sober, trustworthy design
- Fully responsive (desktop, tablet, mobile)
- Sticky navbar with mobile hamburger menu
- Fleet cards with enquiry shortcuts for each vehicle
- Rental services & "Why Choose Us" sections
- Tourism and transportation services with enquiry shortcuts
- 3-step "How It Works"
- Contact form that emails rental enquiries through Web3Forms
- SEO meta tags + Open Graph
- Loads instantly — no framework overhead

## 📁 Project Structure

```
ms-car-rental/
├── index.html    ← Page structure
├── style.css     ← All styling
├── script.js     ← Business info + logic  ← EDIT THIS
├── api/
│   └── contact.js ← Validates enquiries and securely forwards them to Web3Forms
├── vercel.json   ← Security headers
├── .env.example  ← Required server-side environment variables
└── README.md
```

## ✏️ How to Customize

**Open `script.js` and edit the top section:**

```js
const BUSINESS = {
  name: "Jain Ventures",
  location: "N 11 D Sector Ravi Nagar, Hudco T.V center road, Chhatrapati Sambhaji Nagar MH India 431003",
};

const FLEET = [ ... ];            // add/remove cars
const SERVICES = [ ... ];         // rental services
const TOURISM_SERVICES = [ ... ]; // tourism and transportation services
const WHY_US = [ ... ];           // trust points
```

Everything on the page updates automatically — no need to touch `index.html`.

## ✉️ Contact Enquiry Setup

The form sends JSON to the same-origin `/api/contact` route. The server validates
all fields, accepts an optional email, enforces the configured passenger cap,
rejects past or malformed dates and markup, checks service/car allowlists,
verifies Cloudflare Turnstile, applies an Upstash per-IP rate limit, and
deduplicates matching submissions for two minutes. The contact endpoint allows
five submissions per IP per 15 minutes; the public form-config endpoint has its
own 60 requests per IP per minute limit. Both endpoints are same-origin only,
reject unexpected query parameters, and return non-cacheable responses. Structured
security events are written to Vercel function logs with event names and request
IDs only; rate counters and duplicate fingerprints do not contain raw IPs or
enquiry details. It forwards only the
necessary enquiry fields to Web3Forms and does not save customer data in this
project. A public `/api/form-config` route returns only the Turnstile site key
and passenger limit; secret values are never returned to the browser.

Configure every variable in `.env.example` in Vercel. Create a Cloudflare
Turnstile widget for the production hostname and set its site and secret keys.
Set `ALLOWED_ORIGINS` to the exact comma-separated HTTPS origins permitted to
submit, and create a random `ENQUIRY_HASH_SECRET` of at least 32 characters.
The form fails closed if required protections are not configured. `MAX_PASSENGERS`
defaults to 40 (allowed configuration range 1–100); rate limiting defaults to
five submissions per IP per 15 minutes. For local development, add the exact
localhost origin to `ALLOWED_ORIGINS` and use separate development credentials
and a Turnstile test widget/key.

## 🚀 Run Locally

The enquiry API routes must run for the secure form to initialize. Opening
`index.html` directly or using a static-only server such as Python's
`http.server` cannot run the routes and will not submit enquiries.

Run the project through Vercel's local runtime:

```bash
npx vercel login
npx vercel link
npx vercel env pull .env.local
npx vercel dev
```

Open the local URL printed by `vercel dev` (usually
`http://localhost:3000`). Configure the Development environment variables in
Vercel before pulling them. Alternatively, create `.env.local` from
`.env.example` and enter the values there. `.env.local` is ignored by Git.

Local form operation requires working Web3Forms and Upstash development
credentials, Turnstile test site/secret keys, and an `ENQUIRY_HASH_SECRET` of
at least 32 random characters. Set `ALLOWED_ORIGINS` to the exact local origin,
for example `http://localhost:3000` (and the `127.0.0.1` origin only if you
will use it). Do not use production credentials for local testing when
separate development credentials are available. The API intentionally fails
closed if required security services are missing or unavailable.

## ☁️ Deploy to Vercel (Free)

1. Push the project files to a **GitHub repository**.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. Vercel auto-detects a static site. Click **Deploy**.
4. Add your custom domain in **Settings → Domains**.

> No build command needed. Vercel serves `index.html` and the serverless routes
> in `api/`. Configure all server-side environment variables before accepting
> enquiries.

This protected form requires Vercel serverless routes in `api/`. A static-only
deployment will not include server validation, rate limiting, deduplication, or
CAPTCHA verification and must not be used for production enquiries.

## 🧪 Final Checklist

- ✅ All navigation links scroll smoothly
- ✅ Mobile hamburger menu opens/closes
- ✅ Fleet enquiry shortcuts select the requested vehicle in the form
- ✅ Tourism service cards link to the enquiry form and preselect their service
- ✅ Enquiry submissions include the selected tourism service
- ✅ Contact form validates in the browser and serverless route
- ✅ Contact submissions require Turnstile and Upstash protection
- ✅ Submission loading, success, and error states are accessible
- ✅ Responsive on mobile/tablet/desktop
- ✅ No fake claims, prices, ratings, or awards
- ✅ Zero dependencies — pure HTML/CSS/JS

---

© 2026 Jain Ventures. All Rights Reserved.
