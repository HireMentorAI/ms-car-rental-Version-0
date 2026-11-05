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

The contact form sends JSON to the same-origin `/api/contact` route. The server
validates every field, checks service/car allowlists, enforces same-origin
requests, uses a honeypot, applies a best-effort five-per-IP limit per 15 minutes,
and rejects duplicate enquiries for two minutes. It forwards enquiries to
Web3Forms without saving customer data in this project. The API delivery key
stays server-side in `WEB3FORMS_ACCESS_KEY` and is never included in browser code.

Field rules: names contain only letters and spaces (3–80 characters); phones
contain exactly 10 digits; email is required and validated; travel date must be
today or later; passengers must be 1–45; pickup location must be at least 3
characters; message must be 10–500 characters. The form also requires a valid
service and car selection.

The in-memory rate limit is best-effort across serverless instances. A shared
rate-limit service or CAPTCHA can be added later if stronger bot protection is
needed.

## 🚀 Run Locally

The API route must run for enquiry delivery. Double-clicking `index.html` or
using a static-only server does not run the route.

```bash
npx vercel dev
```

Set `WEB3FORMS_ACCESS_KEY` in `.env.local` (copy `.env.example` and replace the
placeholder) or pull the Vercel Development environment after linking the
project. `.env.local` is ignored by Git. Open the local URL printed by Vercel.

## ☁️ Deploy to Vercel (Free)

1. Push the project files to a **GitHub repository**.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. Vercel auto-detects a static site. Click **Deploy**.
4. Add your custom domain in **Settings → Domains**.

> No build command needed. Vercel serves `index.html` directly. Verify the
> destination email inbox in Web3Forms before relying on email submissions. Set
> `WEB3FORMS_ACCESS_KEY` in Vercel's Production environment and redeploy.

This form requires the serverless route in `api/`. Static-only hosting platforms
do not run that route and cannot deliver enquiries.

## 🧪 Final Checklist

- ✅ All navigation links scroll smoothly
- ✅ Mobile hamburger menu opens/closes
- ✅ Fleet enquiry shortcuts select the requested vehicle in the form
- ✅ Tourism service cards link to the enquiry form and preselect their service
- ✅ Enquiry submissions include the selected tourism service
- ✅ Contact form validates and emails enquiries through Web3Forms
- ✅ Submission loading, success, and error states are accessible
- ✅ Responsive on mobile/tablet/desktop
- ✅ No fake claims, prices, ratings, or awards
- ✅ Zero dependencies — pure HTML/CSS/JS

---

© 2026 Jain Ventures. All Rights Reserved.
