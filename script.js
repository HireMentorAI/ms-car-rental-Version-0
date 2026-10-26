/* ============================================================
   Gosavi Ventures — Configuration & Logic
   ============================================================ */

/* ------------------------------------------------------------
   1. BUSINESS INFO — EDIT THIS
   ------------------------------------------------------------ */
const BUSINESS = {
  name: "Gosavi Ventures",
  tagline: "Reliable Cars. Comfortable Journeys.",
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

const TOURISM_SERVICES = [
  {
    title: "Jain Tirth Yatra",
    text: "Comfortable travel to Jain pilgrimage sites, planned around your group and schedule.",
    image: "https://images.openai.com/static-rsc-4/EZm6J5nkuDjVYp5Hvy43g-C3i75h6gdcmn3Sf8Gx7TPRYxn5orkLDMIOlsrpZO1WM-Ta20APwzB2kaQEKzUOl4UyrL8DKu7kocmqyNarTNHVSOKcDd1uKAais6aaVagLqtG2va-5HvRgNR1cZba-mdCCLlYDj95o-s6yDKIHKsDx5nDeh1wRQeOAD288nAFd?purpose=fullsize",
    alt: "Temple architecture for a Jain pilgrimage journey",
    icon: "🙏",
  },
  {
    title: "Ashtavinayak Darshan",
    text: "Visit Maharashtra's eight revered Ganpati temples with a journey arranged for you.",
    image: "https://images.openai.com/static-rsc-4/mEP4viylYdbRYOf09NLtUVKALt7wSNDDZZM4k66kiH-cDKRt-Jl0ynXu0Fq1heSrpUsBlfwPEqId8oXOLi9jFMl52XR9Yi6SQgGOmvvo6N2gKrp1syqPOmVKK6qJ3IEPhm5xJU7qHe9017Pi7UzStOJvnVHscGFky88e12pBpuqmqJk1UZEcKWS_d-eafsOq?purpose=fullsize",
    alt: "Temple visited during an Ashtavinayak pilgrimage",
    icon: "🛕",
  },
  {
    title: "Jyotirling Darshan",
    text: "Plan a pilgrimage to the Jyotirlinga shrines with transport for your itinerary.",
    image: "https://images.openai.com/static-rsc-4/YtdkohYgekoXh3jUGz_YpPjC43JDX6i-NlKCIffOR75OffhQ_gOMpW-Lg5yhED2xXzcF6YbX4EikV7T203LIwaeigyMuDhzdfHpEkO5JWFQ8QcNNqzMCN-8EK3iiWm67qcuaq5JCRtrWBTSaW4VPt2VU9g6VufrNF9d4QO45cv3YLdroVUjecHP2G7W4XQGf?purpose=fullsize",
    alt: "Historic Indian temple architecture",
    icon: "🔱",
  },
  {
    title: "Char Dham Yatra",
    text: "Arrange transport for your Char Dham pilgrimage and the route that suits your plans.",
    image: "https://images.openai.com/static-rsc-4/9zbUcfzAgpDb58__nNY5RETwb-z-yym5flUV7Ksr6cBuJ6UWAqsHYhKIBrC4gzIZ_BgTALFxjWs2aD92fET8wfHxNa1qBUpEbQH6FDJmlHj0dk-On3Ol7xEUfNsaODIyARJPnlatV8OavFZedFUjr33ayYQmi-Qlb6gZqqz8DQ4Lzqm4-wIkshkD8mpysltf?purpose=fullsize",
    alt: "Mountain landscape along a Himalayan pilgrimage route",
    icon: "🏔️",
  },
  {
    title: "Airport Transfers",
    text: "Book a convenient pickup or drop-off for your airport journey.",
    image: "https://images.openai.com/static-rsc-4/9i_ClRz2cilk2DIFlw1TrpkVl6AqLRXaI-fzEMZVJPuHogHhIJxkw-sPmYmOub7bpPNCsQYsJCLmVUpr00qwDJlcT9lnYgvSNutlicQECUxmqN_8GkhQ1ikv-tLvd6bvtPXSTvKQpCRxMzKMci6mryTb0n0zRKLRVH0KPC5lFbT-iXnDnSfizzSxCevzQjxC?purpose=fullsize",
    alt: "Passenger airplane ready for an airport journey",
    icon: "✈️",
  },
  {
    title: "Corporate Travel",
    text: "Transport options for business trips, meetings, and team travel.",
    image: "https://images.openai.com/static-rsc-4/Da1IXe-o5nlaomcoCBfhPt3TIpitshPwWF-b4NHkFaP_S8zth0fKDAyPHnlngYidT8U75Q2fmhxXD33ROzZdRQY5LzctGLr47zebdianeANVxH33NshKxLYb1G_zM80OSy2IikFIT9baA_Q6QlNM7GGZJtroOfSf-w2bYF1jmGjvx8ZSZGPhw69Y5oQH7nFL?purpose=fullsize",
    alt: "Modern office building for corporate travel",
    icon: "💼",
  },
  {
    title: "Custom Itinerary Planning",
    text: "Share your destinations and preferences, and plan a trip around your schedule.",
    image: "https://images.openai.com/static-rsc-4/bbjTgZUn9y26mkM7PYKeBMj7DU_KgpkqR9-UaWWa3G-XcqHgVxGNBNWuOTtksmqzROMq7tlbOty6U2sIyRe6_5AvemA5PbgxHzeBnZcYduPERLvzEZH_EMZrvKd8CBQ1FuPoksHnk1iDZLl5NYQVsfp5gSDWVj-198b93L5BOqVQTE_N7BTtMVX2WeyLy8w1?purpose=fullsize",
    alt: "Open road through a scenic landscape",
    icon: "🗺️",
  },
];

const NAME_PATTERN = /^\p{L}+(?:(?:[ '-]\p{L}+)|(?:\.\s?\p{L}+))*(?:\.)?$/u;
const EMAIL_PATTERN = /^(?!.*\.\.)[A-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,63}$/i;

function normalizeIndianPhone(value) {
  const phone = value.trim();
  if (!/^(?:\+91[\s-]?)?[6-9](?:[\s-]?\d){9}$/.test(phone)) return null;

  const digits = phone.replace(/[\s-]/g, "").replace(/^\+91/, "");
  return /^[6-9]\d{9}$/.test(digits) ? `+91${digits}` : null;
}

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
    icon: "📩",
    title: "Friendly Support",
    text: "Support for your rental enquiry.",
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
  document.querySelectorAll("[data-location]").forEach((el) => {
    el.textContent = BUSINESS.location;
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
      const carSelect = document.getElementById("carSelect");
      const nameInput = document.getElementById("enquiryName");
      if (carSelect) carSelect.value = carName;
      document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
      if (nameInput) nameInput.focus({ preventScroll: true });
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

function renderTourismServices() {
  const grid = document.getElementById("tourismGrid");
  if (!grid) return;

  grid.innerHTML = TOURISM_SERVICES.map(
    (service) => `
    <article class="tourism-card">
      <div class="tourism-image">
        <img src="${service.image}" alt="${service.alt}" loading="lazy" />
        <span class="tourism-icon" aria-hidden="true">${service.icon}</span>
      </div>
      <div class="tourism-card-body">
        <h3>${service.title}</h3>
        <p>${service.text}</p>
        <button type="button" class="btn btn-outline btn-block" data-enquire-service="${service.title}">
          Send Enquiry
        </button>
      </div>
    </article>
  `
  ).join("");

  grid.querySelectorAll("[data-enquire-service]").forEach((button) => {
    button.addEventListener("click", () => {
      const serviceSelect = document.getElementById("serviceSelect");
      const nameInput = document.getElementById("enquiryName");
      if (serviceSelect) serviceSelect.value = button.getAttribute("data-enquire-service");
      document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
      if (nameInput) nameInput.focus({ preventScroll: true });
    });
  });
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

function populateTourismServiceSelect() {
  const select = document.getElementById("serviceSelect");
  if (!select) return;

  TOURISM_SERVICES.forEach((service) => {
    const option = document.createElement("option");
    option.value = service.title;
    option.textContent = service.title;
    select.appendChild(option);
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
  const status = document.getElementById("formStatus");
  if (!form || !status) return;
  let isSubmitting = false;

  const showError = (field, msg) => {
    const el = form.querySelector(`[data-error="${field}"]`);
    if (el) el.textContent = msg;
    const input = form.elements.namedItem(field);
    if (input instanceof HTMLElement) input.setAttribute("aria-invalid", "true");
  };
  const clearErrors = () => {
    form.querySelectorAll("[data-error]").forEach((el) => (el.textContent = ""));
    form.querySelectorAll("[aria-invalid='true']").forEach((el) => el.removeAttribute("aria-invalid"));
  };
  const showStatus = (message, isError = false) => {
    status.textContent = message;
    status.classList.toggle("error", isError);
    status.classList.add("show");
    status.setAttribute("role", isError ? "alert" : "status");
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    clearErrors();
    status.textContent = "";
    status.classList.remove("show", "error");

    const data = new FormData(form);
    const values = Object.fromEntries(data.entries());

    values.name = values.name.trim();
    values.phone = values.phone.trim();
    values.email = values.email.trim();
    values.car = values.car.trim();
    values.date = values.date.trim();
    values.pickup = values.pickup.trim();
    values.message = values.message.trim();

    let valid = true;
    if (!values.name) {
      showError("name", "Please enter your name");
      valid = false;
    } else if (
      values.name.length < 2 ||
      values.name.length > 80 ||
      !NAME_PATTERN.test(values.name)
    ) {
      showError("name", "Enter a valid name using 2–80 letters, spaces, periods, apostrophes, or hyphens");
      valid = false;
    }
    const normalizedPhone = values.phone ? normalizeIndianPhone(values.phone) : null;
    if (!values.phone) {
      showError("phone", "Please enter your phone number");
      valid = false;
    } else if (!normalizedPhone) {
      showError("phone", "Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9");
      valid = false;
    }
    if (!values.email) {
      showError("email", "Please enter your email address");
      valid = false;
    } else if (
      values.email.length > 254 ||
      values.email.split("@")[0].length > 64 ||
      !EMAIL_PATTERN.test(values.email)
    ) {
      showError("email", "Please enter a valid email address");
      valid = false;
    }
    if (!TOURISM_SERVICES.some((service) => service.title === values.service)) {
      showError("service", "Please select a service");
      valid = false;
    }
    if (!FLEET.some((car) => car.name === values.car) && values.car !== "Other") {
      showError("car", "Please select a car");
      valid = false;
    }
    if (!values.date || !form.elements.namedItem("date").validity.valid) {
      showError("date", "Please select a valid travel date");
      valid = false;
    }
    if (!values.passengers) {
      showError("passengers", "Please enter the number of passengers");
      valid = false;
    } else if (!/^\d{1,3}$/.test(values.passengers) ||
      Number(values.passengers) < 1 ||
      Number(values.passengers) > 40) {
      showError("passengers", "Enter a whole number of passengers between 1 and 40");
      valid = false;
    }
    if (!values.pickup) {
      showError("pickup", "Please enter a pickup location");
      valid = false;
    }
    if (!values.message) {
      showError("message", "Please enter a message");
      valid = false;
    }
    if (!valid) {
      const firstInvalid = form.querySelector("[aria-invalid='true']");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    data.set("name", values.name);
    data.set("phone", normalizedPhone);
    data.set("email", values.email);
    data.set("message", values.message);
    data.set("pickup", values.pickup);

    if (window.location.protocol === "file:") {
      showStatus(
        "This page is open as a local file. Open the website from its deployed URL or a local web server to submit the enquiry.",
        true
      );
      return;
    }

    const submitButton = form.querySelector("button[type='submit']");
    const originalButtonText = submitButton.textContent;
    isSubmitting = true;
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    const submittedAtValue = new Date().toISOString();
    const submittedAt = form.elements.namedItem("submitted_at");
    if (submittedAt instanceof HTMLInputElement) {
      submittedAt.value = submittedAtValue;
    }
    data.set("submitted_at", submittedAtValue);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
        signal: controller.signal,
      });
      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error("The enquiry service returned an unexpected response. Please try again.");
      }
      if (!response.ok || !result || result.success !== true) {
        const apiMessage = result && (
          (typeof result.message === "string" && result.message) ||
          (result.body && typeof result.body.message === "string" && result.body.message) ||
          (typeof result.error === "string" && result.error)
        );
        throw new Error(
          apiMessage
            ? apiMessage
            : "Web3Forms couldn't send your enquiry. Please check the access key and try again."
        );
      }

      showStatus("Your enquiry was sent successfully. We will get back to you soon.");
      form.reset();
    } catch (error) {
      const message = error instanceof Error && error.name === "AbortError"
        ? "Web3Forms did not respond within 30 seconds. Delivery is unconfirmed; check your inbox before retrying to avoid sending a duplicate enquiry."
        : error instanceof TypeError
          ? "We couldn't connect to Web3Forms. Check your internet connection, VPN, or firewall. Delivery is unconfirmed; check your inbox before retrying."
          : error instanceof Error
            ? error.message
            : "We couldn't send your enquiry. Please try again.";
      showStatus(
        message,
        true
      );
    } finally {
      window.clearTimeout(timeoutId);
      isSubmitting = false;
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  applyBusinessInfo();
  renderFleet();
  renderServices();
  renderTourismServices();
  renderWhyUs();
  populateCarSelect();
  populateTourismServiceSelect();
  setupNav();
  setupForm();
});