/* ============================================================
   CSN CAR RENTAL — Configuration & Logic
   ============================================================ */

/* ------------------------------------------------------------
   1. BUSINESS INFO — EDIT THIS
   ------------------------------------------------------------ */
const BUSINESS = {
  name: "CSN CAR RENTAL",
  tagline: "Reliable Cars. Comfortable Journeys.",
  phone: "+91 XXXXX XXXXX",           // Display text
  phoneLink: "+91XXXXXXXXXX",         // For tel: link (no spaces)
  whatsapp: "91XXXXXXXXXX",           // For wa.me link (country code, no +)
  email: "example@email.com",
  location: "City, Maharashtra",
};

/* ------------------------------------------------------------
   2. FLEET — CATEGORIES AVAILABLE
   ------------------------------------------------------------ */
const FLEET = [
  {
    id: 1,
    name: "Innova Crysta",
    type: "SUV",
    seats: "6 / 7 Seater",
    transmission: "Manual / Automatic",
    fuel: "Diesel / Petrol",
    image: "https://cdn-s3.autocarindia.com/Maruti-Suzuki/wagonr-flex-fuel/New_Crysta.png?w=728&q=75&fm=auto",
    alt: "Toyota Innova Crysta SUV available for rental",
  },
  {
    id: 2,
    name: "Swift",
    type: "Sedan",
    seats: "5 Seater",
    transmission: "Manual",
    fuel: "Petrol",
    image: "https://spn-sta.spinny.com/blog/20240509161023/new-Maruti-Swift-1160x653.webp?compress=true&quality=80&w=1200&dpr=1.3",
    alt: "Maruti Suzuki Swift sedan available for rental",
  },
  {
    id: 3,
    name: "Aura",
    type: "Sedan",
    seats: "5 Seater",
    transmission: "Manual / Automatic",
    fuel: "Petrol / CNG",
    image: "https://stimg.cardekho.com/images/car-images/930x620/Hyundai/Aura/10126/1694588903385/221_typhoon-silver_b4b9c4.jpg",
    alt: "Hyundai Aura sedan available for rental",
  },
  {
    id: 4,
    name: "Ciaz",
    type: "Sedan",
    seats: "5 Seater",
    transmission: "Manual / Automatic",
    fuel: "Petrol / Diesel",
    image: "https://stimg.cardekho.com/images/car-images/930x620/Maruti/Ciaz/7407/1655790491978/222_Pearl-Metallic-Dignity-Brown-_482d19.jpg",
    alt: "Maruti Suzuki Ciaz sedan available for rental",
  },
  {
    id: 5,
    name: "Force Urbania",
    type: "Urbania",
    seats: "17 Seater",
    transmission: "Manual",
    fuel: "Diesel",
    image: "https://stimg.cardekho.com/images/carexteriorimages/930x620/Force/Urbania/11849/1763466348855/front-left-side-47.jpg",
    alt: "Force Urbania 17 seater van available for rental",
  },
  {
    id: 6,
    name: "Tempo Traveller",
    type: "Tempo Traveller",
    seats: "12 / 17 Seater",
    transmission: "Manual",
    fuel: "Diesel",
    image: "https://www.prabutourstravels.com/assets/images/fleet/force-14-seater-traveller.webp",
    alt: "Tempo Traveller van available for rental",
  },
  {
    id: 7,
    name: "Mini Bus",
    type: "Mini Bus",
    seats: "20 / 25 Seater",
    transmission: "Manual",
    fuel: "Diesel",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR62-1dAZsCeqLUprH1YDQb-AC2binpfEnUSkjmjKMwsA&s=10",
    alt: "Mini bus available for group travel rental",
  },
  {
    id: 8,
    name: "45 Seater Bus",
    type: "45 Seater Bus",
    seats: "45 Seater • AC",
    transmission: "Manual",
    fuel: "Diesel",
    image: "https://www.chennaitourstravelss.com/images/car/detail/40seater-ac-volvo.webp",
    alt: "45 seater AC bus available for large group rental",
  },
];

/* ------------------------------------------------------------
   3. SERVICES — WHAT WE OFFER
   ------------------------------------------------------------ */
const SERVICES = [
  {
    icon: "🚙",
    title: "SUV",
    text: "Innova Crysta — spacious and comfortable for family and business trips.",
  },
  {
    icon: "🚗",
    title: "Sedan",
    text: "Swift, Aura, Ciaz — smooth and economical for city and highway travel.",
  },
  {
    icon: "🚐",
    title: "Urbania",
    text: "Force Urbania, 17 Seater — premium group travel with extra comfort.",
  },
  {
    icon: "🚐",
    title: "Tempo Traveller",
    text: "Reliable option for medium-sized groups and outstation journeys.",
  },
  {
    icon: "🚌",
    title: "Mini Bus",
    text: "Comfortable group transport for tours, events, and family functions.",
  },
  {
    icon: "🚌",
    title: "45 Seater Bus",
    text: "AC Available — ideal for large groups, tours, and corporate travel.",
  },
];

/* ------------------------------------------------------------
   4. WHY CHOOSE US
   ------------------------------------------------------------ */
const WHY_US = [
  {
    icon: "✨",
    title: "Clean & Comfortable Vehicles",
    text: "Well-presented vehicles for a comfortable journey.",
  },
  {
    icon: "📱",
    title: "Easy Booking",
    text: "Simple enquiry and booking process.",
  },
  {
    icon: "🚙",
    title: "Flexible Options",
    text: "From sedans to 45-seater buses — for every group size.",
  },
  {
    icon: "☎️",
    title: "Friendly Support",
    text: "Easy communication through phone and WhatsApp.",
  },
];

/* ============================================================
   INJECT BUSINESS INFO INTO PAGE
   ============================================================ */
function applyBusinessInfo() {
  document.querySelectorAll("[data-name]").forEach((el) => {
    el.textContent = BUSINESS.name;
  });
  document.querySelectorAll("[data-tagline]").forEach((el) => {
    el.textContent = BUSINESS.tagline;
  });
  document.querySelectorAll("[data-phone]").forEach((el) => {
    if (el.tagName === "A" && !el.textContent.includes("📞")) {
      el.textContent = BUSINESS.phone;
    } else if (el.tagName !== "A") {
      el.textContent = BUSINESS.phone;
    }
    if (el.tagName === "A") el.href = `tel:${BUSINESS.phoneLink}`;
  });
  document.querySelectorAll("[data-email]").forEach((el) => {
    if (el.tagName === "A") {
      el.href = `mailto:${BUSINESS.email}`;
      el.textContent = BUSINESS.email;
    } else {
      el.textContent = BUSINESS.email;
    }
  });
  document.querySelectorAll("[data-location]").forEach((el) => {
    el.textContent = BUSINESS.location;
  });
  document.querySelectorAll("[data-whatsapp-link]").forEach((el) => {
    el.href = `https://wa.me/${BUSINESS.whatsapp}`;
  });

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ============================================================
   RENDER FLEET
   ============================================================ */
function renderFleet() {
  const grid = document.getElementById("fleetGrid");
  if (!grid) return;

  grid.innerHTML = FLEET.map(
    (car) => `
    <div class="car-card">
      <div class="car-image">
        <img src="${car.image}" alt="${car.alt || car.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1000&q=75'" />
      </div>
      <div class="car-body">
        <div class="car-name">${car.name}</div>
        <div class="car-type">${car.type}</div>
        <div class="car-specs">
          <span class="spec">${car.seats}</span>
          <span class="spec">${car.transmission}</span>
          <span class="spec">${car.fuel}</span>
        </div>
        <button class="btn btn-outline btn-block" data-enquire="${car.name}">
          Enquire Now
        </button>
      </div>
    </div>
  `
  ).join("");

  grid.querySelectorAll("[data-enquire]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const carName = btn.getAttribute("data-enquire");
      const msg = `Hello ${BUSINESS.name}, I would like to enquire about the ${carName}. Please share availability and rental details.`;
      window.open(
        `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(msg)}`,
        "_blank"
      );
    });
  });
}

/* ============================================================
   RENDER SERVICES
   ============================================================ */
function renderServices() {
  const grid = document.getElementById("servicesGrid");
  if (!grid) return;

  grid.innerHTML = SERVICES.map(
    (s) => `
    <div class="service-card">
      <div class="service-icon">${s.icon}</div>
      <h3>${s.title}</h3>
      <p>${s.text}</p>
    </div>
  `
  ).join("");
}

/* ============================================================
   RENDER WHY US
   ============================================================ */
function renderWhyUs() {
  const grid = document.getElementById("whyGrid");
  if (!grid) return;

  grid.innerHTML = WHY_US.map(
    (w) => `
    <div class="why-card">
      <div class="why-icon">${w.icon}</div>
      <h3>${w.title}</h3>
      <p>${w.text}</p>
    </div>
  `
  ).join("");
}

/* ============================================================
   POPULATE CAR SELECT DROPDOWN
   ============================================================ */
function populateCarSelect() {
  const select = document.getElementById("carSelect");
  if (!select) return;

  FLEET.forEach((car) => {
    const opt = document.createElement("option");
    opt.value = car.name;
    opt.textContent = `${car.name} (${car.type})`;
    select.insertBefore(opt, select.lastElementChild);
  });
}

/* ============================================================
   MOBILE NAVIGATION
   ============================================================ */
function setupNav() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    toggle.classList.toggle("open");
    links.classList.toggle("open");
    toggle.setAttribute(
      "aria-expanded",
      toggle.classList.contains("open") ? "true" : "false"
    );
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      toggle.classList.remove("open");
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ============================================================
   ENQUIRY FORM HANDLER
   ============================================================ */
function setupForm() {
  const form = document.getElementById("enquiryForm");
  const success = document.getElementById("formSuccess");
  if (!form) return;

  const showError = (field, msg) => {
    const el = form.querySelector(`[data-error="${field}"]`);
    if (el) el.textContent = msg;
  };
  const clearErrors = () => {
    form.querySelectorAll("[data-error]").forEach((el) => (el.textContent = ""));
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();
    success.classList.remove("show");

    const data = new FormData(form);
    const values = Object.fromEntries(data.entries());

    let valid = true;
    if (!values.name || !values.name.trim()) {
      showError("name", "Please enter your name");
      valid = false;
    }
    if (!values.phone || !values.phone.trim()) {
      showError("phone", "Please enter your phone number");
      valid = false;
    } else if (!/^[+\d\s\-()]{7,15}$/.test(values.phone.trim())) {
      showError("phone", "Please enter a valid phone number");
      valid = false;
    }
    if (!values.pickup || !values.pickup.trim()) {
      showError("pickup", "Please enter a pickup location");
      valid = false;
    }
    if (!valid) return;

    const lines = [
      `Hello ${BUSINESS.name},`,
      "",
      "I would like to enquire about a car rental.",
      "",
      `Name: ${values.name}`,
      `Phone: ${values.phone}`,
      `Car Required: ${values.car || "Not specified"}`,
      `Travel Date: ${values.date || "Not specified"}`,
      `Passengers: ${values.passengers || "Not specified"}`,
      `Pickup Location: ${values.pickup}`,
    ];
    if (values.message && values.message.trim()) {
      lines.push(`Message: ${values.message}`);
    }
    lines.push("", "Please share availability and rental details.", "", "Thank you.");

    const text = lines.join("\n");
    window.open(
      `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`,
      "_blank"
    );

    success.classList.add("show");
    form.reset();
    setTimeout(() => success.classList.remove("show"), 6000);
  });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  applyBusinessInfo();
  renderFleet();
  renderServices();
  renderWhyUs();
  populateCarSelect();
  setupNav();
  setupForm();
});