# MS Car Rental — Website

A simple, modern, and professional one-page car rental website built with **pure HTML, CSS, and vanilla JavaScript**. No build step. No dependencies.

## ✨ Features

- Clean, sober, trustworthy design
- Fully responsive (desktop, tablet, mobile)
- Sticky navbar with mobile hamburger menu
- Fleet cards with WhatsApp "Enquire Now" per vehicle
- Rental services & "Why Choose Us" sections
- 3-step "How It Works"
- Contact form that generates a WhatsApp enquiry (no backend needed)
- SEO meta tags + Open Graph
- Loads instantly — no framework overhead

## 📁 Project Structure

```
ms-car-rental/
├── index.html    ← Page structure
├── style.css     ← All styling
├── script.js     ← Business info + logic  ← EDIT THIS
└── README.md
```

## ✏️ How to Customize

**Open `script.js` and edit the top section:**

```js
const BUSINESS = {
  name: "MS CAR RENTAL",
  phone: "+91 XXXXX XXXXX",
  phoneLink: "+91XXXXXXXXXX",   // no spaces
  whatsapp: "91XXXXXXXXXX",     // country code, no +
  email: "example@email.com",
  location: "City, Maharashtra",
};

const FLEET = [ ... ];      // add/remove cars
const SERVICES = [ ... ];   // add/remove services
const WHY_US = [ ... ];     // trust points
```

Everything on the page updates automatically — no need to touch `index.html`.

## 🚀 Run Locally

Just **double-click `index.html`** — it opens in your browser. That's it.

Or run a local server (optional):

```bash
# Python 3
python -m http.server 3000

# Node (if installed)
npx serve .
```

Open [http://localhost:3000](http://localhost:3000)

## ☁️ Deploy to Vercel (Free)

1. Push the three files to a **GitHub repository**.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. Vercel auto-detects a static site. Click **Deploy**.
4. Add your custom domain in **Settings → Domains**.

> No build command needed. Vercel serves `index.html` directly.

### Deploy to Netlify (drag & drop)

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag the entire `ms-car-rental` folder onto the page.
3. Done — you get a free live URL instantly.

### Deploy to Cloudflare Pages

1. Push to GitHub.
2. Go to **Cloudflare Pages** → **Create project** → connect repo.
3. Leave build command blank, output directory = `/` (root).
4. Deploy.

## 🧪 Final Checklist

- ✅ All navigation links scroll smoothly
- ✅ Mobile hamburger menu opens/closes
- ✅ WhatsApp buttons open with pre-filled messages
- ✅ Phone (`tel:`) and Email (`mailto:`) links work
- ✅ Fleet "Enquire Now" includes vehicle name
- ✅ Contact form validates and generates WhatsApp message
- ✅ Success message shown after submit
- ✅ Responsive on mobile/tablet/desktop
- ✅ No fake claims, prices, ratings, or awards
- ✅ Zero dependencies — pure HTML/CSS/JS

---

© 2026 MS Car Rental. All Rights Reserved.