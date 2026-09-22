/* ============================================================
   MS CAR RENTAL — Configuration & Logic
   ============================================================ */

/* ------------------------------------------------------------
   1. BUSINESS INFO — EDIT THIS
   ------------------------------------------------------------ */
const BUSINESS = {
  name: "MS CAR RENTAL",
  tagline: "Reliable Cars. Comfortable Journeys.",
  phone: "+91 XXXXX XXXXX",           // Display text
  phoneLink: "+91XXXXXXXXXX",         // For tel: link (no spaces)
  whatsapp: "91XXXXXXXXXX",           // For wa.me link (country code, no +)
  email: "example@email.com",
  location: "City, Maharashtra",
};

/* ------------------------------------------------------------
   2. FLEET — ADD / REMOVE CARS HERE
   ------------------------------------------------------------ */
const FLEET = [
  {
    id: 1,
    name: "Maruti Suzuki Swift",
    type: "Hatchback",
    seats: "5 Seater",
    transmission: "Manual",
    fuel: "Petrol",
    image:
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=70",
  },
  {
    id: 2,
    name: "Hyundai Creta",
    type: "SUV",
    seats: "5 Seater",
    transmission: "Manual / Automatic",
    fuel: "Petrol / Diesel",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=70",
  },
  {
    id: 3,
    name: "Toyota Innova",
    type: "MPV",
    seats: "7 Seater",
    transmission: "Manual / Automatic",
    fuel: "Diesel",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=70",
  },
  {
    id: 4,
    name: "Mahindra Scorpio",
    type: "SUV",
    seats: "7 Seater",
    transmission: "Manual",
    fuel: "Diesel",
    image:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=70",
  },
];

/* ------------------------------------------------------------
   3. SERVICES — ADD / REMOVE HERE
   ------------------------------------------------------------ */
const SERVICES = [
  {
    icon: "🚗",
    title: "Local Car Rental",
    text: "Convenient cars for city travel and daily requirements.",
  },
  {
    icon: "🛣️",
    title: "Outstation Travel",
    text: "Comfortable vehicles for longer journeys and trips.",
  },
  {
    icon: "👨‍👩‍👧",
    title: "Family Travel",
    text: "Spacious and comfortable cars for family journeys.",
  },
  {
    icon: "💼",
    title: "Business Travel",
    text: "Professional and reliable transportation for business requirements.",
  },
  {
    icon: "✈️",
    title: "Airport / Station Pickup",
    text: "Convenient transportation for airport or railway station travel.",
  },
  {
    icon: "🔑",
    title: "Self Drive / With Driver",
    text: "Flexible options to suit your travel preference.",
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
    text: "Different vehicle options for different travel needs.",
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
    // Only replace text if element is not a link with icon
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

  // Footer year
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
        <img src="${car.image}" alt="${car.name}" loading="lazy" />
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

  // Attach WhatsApp enquiry handlers
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

  // Keep first "Select a car" and add fleet before "Other"
  FLEET.forEach((car) => {
    const opt = document.createElement("option");
    opt.value = car.name;
    opt.textContent = car.name;
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

  // Close on link click
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

    // Validation
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

    // Build WhatsApp message
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