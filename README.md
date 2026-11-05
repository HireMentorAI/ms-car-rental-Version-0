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
all fields, enforces the passenger cap, rejects past dates and markup, checks
service and car allowlists, applies a five-per-IP request limit per 15 minutes,
and rejects duplicate enquiries for two minutes. It also uses same-origin checks
and a honeypot field. The rate limit and duplicate window are held in each warm
serverless instance, so they are best-effort and less robust than a shared store.
Security logs contain event names and request IDs only. Enquiry data is forwarded
to Web3Forms and is not saved by this project.

Only `WEB3FORMS_ACCESS_KEY` is required for delivery. Keep it in `.env.local` for
local development and in Vercel Project Settings for production; never place it
in browser code. `MAX_PASSENGERS` is optional and defaults to 40 (allowed range
1–100). Same-origin checks are based on the request host, so no origin allowlist
or CAPTCHA provider configuration is needed.

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

Local delivery requires a working Web3Forms key in `.env.local`. You can copy
`.env.example` to `.env.local` and add the key, or pull your Vercel Development
variables after linking the project. The file is ignored by Git.

## ☁️ Deploy to Vercel (Free)

1. Push the project files to a **GitHub repository**.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. Vercel auto-detects a static site. Click **Deploy**.
4. Add your custom domain in **Settings → Domains**.

> No build command needed. Vercel serves `index.html` and the serverless routes
> in `api/`. Configure `WEB3FORMS_ACCESS_KEY` before accepting
> enquiries.

This protected form requires Vercel serverless routes in `api/`. A static-only
deployment will not include server validation, same-origin checks, rate limiting,
or duplicate checks and must not be used for production enquiries.

## 🧪 Final Checklist

- ✅ All navigation links scroll smoothly
- ✅ Mobile hamburger menu opens/closes
- ✅ Fleet enquiry shortcuts select the requested vehicle in the form
- ✅ Tourism service cards link to the enquiry form and preselect their service
- ✅ Enquiry submissions include the selected tourism service
- ✅ Contact form validates in the browser and serverless route
- ✅ Contact submissions use server-side validation, same-origin checks, a honeypot, and best-effort rate limiting
- ✅ Submission loading, success, and error states are accessible
- ✅ Responsive on mobile/tablet/desktop
- ✅ No fake claims, prices, ratings, or awards
- ✅ Zero dependencies — pure HTML/CSS/JS

---

© 2026 Jain Ventures. All Rights Reserved.
