# Gosavi Ventures — Website

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
  name: "Gosavi Ventures",
  location: "City, Maharashtra",
};

const FLEET = [ ... ];            // add/remove cars
const SERVICES = [ ... ];         // rental services
const TOURISM_SERVICES = [ ... ]; // tourism and transportation services
const WHY_US = [ ... ];           // trust points
```

Everything on the page updates automatically — no need to touch `index.html`.

## ✉️ Contact Enquiry Setup

The contact form posts directly to `https://api.web3forms.com/submit` using the
provided Web3Forms access key in a hidden form field. This is a static HTML site
with no build-time environment-variable support, so the access key is visible in
the browser source by design. Use only a Web3Forms form access key, never a
private backend credential. If the key needs to be rotated, update the hidden
`access_key` field in `index.html`.

In Web3Forms, verify the destination email inbox for the access key before
expecting notifications. The form includes name, phone, email, service,
car, travel date, passenger count, pickup location, message, subject, form/page
metadata, and a submission timestamp. The service selection includes Jain Tirth
Yatra, Ashtavinayak Darshan, Jyotirling Darshan, Char Dham Yatra, Airport
Transfers, Corporate Travel, and Custom Itinerary Planning. It uses the
supported honeypot field, validates inputs, reports request/API errors, prevents
duplicate submits, and resets only after a successful API response.
Names must be 2–80 letters with supported name punctuation; Indian mobile
numbers are normalized to `+91` plus 10 digits; email is required and validated;
car, travel date, passenger count (1–40), pickup location, and message are also
required.

The original `/api/contact` serverless endpoint remains available for any
separate integrations that use it; the website form no longer depends on that
endpoint or its rate-limiter environment variables.

## 🚀 Run Locally

Double-clicking `index.html` opens a static preview only; browser security
prevents form submissions from a `file://` URL. Run a local web server or use
the deployed website to submit enquiries.

Or run a local server (optional):

```bash
# Python 3
python -m http.server 3000

# Node (if installed)
npx serve .
```

Open [http://localhost:3000](http://localhost:3000)

## ☁️ Deploy to Vercel (Free)

1. Push the project files to a **GitHub repository**.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. Vercel auto-detects a static site. Click **Deploy**.
4. Add your custom domain in **Settings → Domains**.

> No build command needed. Vercel serves `index.html` directly. Verify the
> destination email inbox in Web3Forms before relying on email submissions.

### Deploy static files to Netlify (drag & drop)

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag the entire `ms-car-rental` folder onto the page.
3. The static site can submit directly to Web3Forms; verify its recipient inbox
   before relying on email submissions.

### Deploy static files to Cloudflare Pages

1. Push to GitHub.
2. Go to **Cloudflare Pages** → **Create project** → connect repo.
3. Leave build command blank, output directory = `/` (root).
4. The static site can submit directly to Web3Forms; verify its recipient inbox
   before relying on email submissions.

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

© 2026 Gosavi Ventures. All Rights Reserved.