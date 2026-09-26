// ============================================================
// TODO: paste your deployed Google Apps Script Web App URL here.
// See apps-script/Code.gs + README.md for setup steps.
// ============================================================
const APPS_SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
const WHATSAPP_NUMBER = "919487887871"; // +91 94878 87871, wa.me format (no + or spaces)

// This file is shared by every page that has an enquiry form
// (catalog.html, contact.html). Each piece below guards on the elements
// it needs existing, so it's safe to include even on pages that only have
// some of them (e.g. contact.html has no product filter bar).

const catalogEl = document.getElementById("catalog");
const filterBar = document.getElementById("filterBar");
const productSelect = document.getElementById("f-product");
const form = document.getElementById("enquiryForm");
const submitBtn = document.getElementById("submitBtn");
const formStatus = document.getElementById("formStatus");
const toastEl = document.getElementById("toast");
const lightboxEl = document.getElementById("lightbox");

function formatPrice(price) {
  return price == null ? "On enquiry" : `₹${price}`;
}

function placeholderMarkup(name) {
  const initial = name.trim().charAt(0).toUpperCase();
  return `
    <div class="placeholder">
      <span class="ph-mark">${initial}</span>
      <span class="ph-label">Photo coming soon</span>
    </div>`;
}

const shareIconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.7l7.6-4.4M8.2 13.3l7.6 4.4"/></svg>`;

function cardMarkup(product) {
  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
  const variantRow = hasVariants
    ? `<div class="variant-block">
        <span class="variant-label">Choose a scent</span>
        <div class="variant-row" data-variants>
          ${product.variants
            .map(
              (v, i) =>
                `<button type="button" class="variant-chip${i === 0 ? " active" : ""}" data-image="${v.image}" data-label="${v.label}" style="--swatch:${v.swatch || "var(--terracotta)"}">
                  <span class="chip-dot"></span>${v.label}
                </button>`
            )
            .join("")}
        </div>
      </div>`
    : "";

  return `
    <article class="card" id="${product.id}" data-id="${product.id}" data-category="${product.category}">
      <div class="card-media">
        <img src="${product.image}" alt="${product.name}" loading="lazy" decoding="async" class="zoomable" />
        ${product.tag ? `<span class="card-tag">${product.tag}</span>` : ""}
        <button type="button" class="card-share" data-share="${product.name}" aria-label="Share ${product.name} on WhatsApp">${shareIconSvg}</button>
      </div>
      <div class="card-body">
        <span class="card-category">${product.category}</span>
        <h3 class="card-title">${product.name}</h3>
        <p class="card-desc">${product.description}</p>
        ${variantRow}
        <div class="card-footer">
          <div class="price-tag">
            <span class="price-amount">${formatPrice(product.price)}</span>
            ${product.size ? `<span class="price-unit">${product.size}</span>` : ""}
          </div>
          <a href="catalog.html#enquire" class="card-enquire" data-enquire="${product.name}">Enquire</a>
        </div>
      </div>
    </article>`;
}

function renderCatalog(filter = "All") {
  if (!catalogEl || typeof PRODUCTS === "undefined") return;
  const items = PRODUCTS.filter((p) => filter === "All" || p.category === filter);
  catalogEl.innerHTML = items.map(cardMarkup).join("");
  wireImageFallbacks();
  wireVariantSwitchers();
  wireEnquireButtons();
  wireShareButtons();
  wireLightbox();
}

// Swap any broken product <img> for a branded placeholder block.
function wireImageFallbacks() {
  if (!catalogEl) return;
  catalogEl.querySelectorAll(".card-media img").forEach((img) => {
    img.addEventListener("error", function handler() {
      img.removeEventListener("error", handler);
      const div = document.createElement("div");
      div.innerHTML = placeholderMarkup(img.alt || "Product");
      img.replaceWith(div.firstElementChild);
    });
  });
}

function wireVariantSwitchers() {
  if (!catalogEl) return;
  catalogEl.querySelectorAll("[data-variants]").forEach((row) => {
    row.querySelectorAll(".variant-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        row.querySelectorAll(".variant-chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        const card = row.closest(".card");
        const img = card.querySelector(".card-media img");
        if (img) img.src = chip.dataset.image;
        const enquireBtn = card.querySelector("[data-enquire]");
        if (enquireBtn) {
          const baseName = enquireBtn.dataset.enquire.split(" — ")[0];
          enquireBtn.dataset.enquire = `${baseName} — ${chip.dataset.label}`;
        }
        const shareBtn = card.querySelector("[data-share]");
        if (shareBtn) {
          const baseName = shareBtn.dataset.share.split(" — ")[0];
          shareBtn.dataset.share = `${baseName} — ${chip.dataset.label}`;
        }
      });
    });
  });
}

function wireEnquireButtons() {
  if (!catalogEl || !productSelect) return;
  catalogEl.querySelectorAll("[data-enquire]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.dataset.enquire;
      if ([...productSelect.options].some((o) => o.value === value)) {
        productSelect.value = value;
      }
    });
  });
}

// Share a product straight to WhatsApp with a link back to that exact card.
function wireShareButtons() {
  if (!catalogEl) return;
  catalogEl.querySelectorAll("[data-share]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const card = btn.closest(".card");
      const productUrl = `${location.origin}${location.pathname}#${card.id}`;
      const text = `Check out ${btn.dataset.share} from Sparism — ${productUrl}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    });
  });
}

// Tap a product photo to see it full-screen.
function wireLightbox() {
  if (!catalogEl || !lightboxEl) return;
  const lightboxImg = lightboxEl.querySelector("img");
  const lightboxCaption = lightboxEl.querySelector(".lightbox-caption");

  catalogEl.querySelectorAll(".zoomable").forEach((img) => {
    img.addEventListener("click", () => {
      const card = img.closest(".card");
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      if (lightboxCaption) lightboxCaption.textContent = card ? card.querySelector(".card-title").textContent : "";
      lightboxEl.classList.add("open");
      lightboxEl.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });
}

function closeLightbox() {
  if (!lightboxEl) return;
  lightboxEl.classList.remove("open");
  lightboxEl.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

if (lightboxEl) {
  lightboxEl.addEventListener("click", (e) => {
    if (e.target === lightboxEl || e.target.closest("[data-lightbox-close]")) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}

function populateProductSelect() {
  if (!productSelect || typeof PRODUCTS === "undefined") return;
  PRODUCTS.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.name;
    opt.textContent = p.name;
    productSelect.appendChild(opt);
  });
}

function wireFilters() {
  if (!filterBar) return;
  filterBar.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      filterBar.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      renderCatalog(chip.dataset.filter);
    });
  });
}

function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add("show");
  toastEl.setAttribute("aria-hidden", "false");
  setTimeout(() => {
    toastEl.classList.remove("show");
    toastEl.setAttribute("aria-hidden", "true");
  }, 3500);
}

// A small on-brand sparkle burst — reuses the logo's four-point star shape.
const SPARKLE_SVG = `<svg viewBox="0 0 24 24"><path d="M12 0c0 6-2 10-2 10s-4 2-10 2c6 0 10 2 10 2s2 4 2 10c0-6 2-10 2-10s4-2 10-2c-6 0-10-2-10-2s-2-4-2-10Z"/></svg>`;
const SPARKLE_COLORS = ["#4a2545", "#c97b52", "#c98a8a"];

function spawnSparkles(originEl) {
  if (!originEl || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rect = originEl.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  const count = 14;

  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "sparkle-particle";
    el.innerHTML = SPARKLE_SVG;
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const distance = 60 + Math.random() * 70;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    const size = 8 + Math.random() * 10;
    const color = SPARKLE_COLORS[i % SPARKLE_COLORS.length];
    const duration = 700 + Math.random() * 500;

    el.style.left = `${originX}px`;
    el.style.top = `${originY}px`;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.color = color;
    el.style.setProperty("--dx", `${dx}px`);
    el.style.setProperty("--dy", `${dy}px`);
    el.style.animationDuration = `${duration}ms`;

    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}

function isValidIndianPhone(value) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 13;
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    formStatus.textContent = "";
    formStatus.className = "form-status";

    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.name.trim() || !data.phone.trim() || !data.address.trim()) {
      formStatus.textContent = "Please fill in your name, phone and address.";
      formStatus.classList.add("error");
      return;
    }
    if (!isValidIndianPhone(data.phone)) {
      formStatus.textContent = "Please enter a valid phone number.";
      formStatus.classList.add("error");
      return;
    }

    if (APPS_SCRIPT_URL.includes("PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE")) {
      formStatus.textContent =
        "Form isn't connected yet — set APPS_SCRIPT_URL in script.js (see README.md).";
      formStatus.classList.add("error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting…";

    const payload = {
      timestamp: new Date().toISOString(),
      name: data.name.trim(),
      phone: data.phone.trim(),
      address: data.address.trim(),
      email: (data.email || "").trim(),
      product: data.product || "General enquiry",
      message: (data.message || "").trim(),
    };

    try {
      // Apps Script web apps don't return CORS headers, so the response body
      // can't be read from the browser. We fire the request in "no-cors" mode
      // and treat a network-level success (no thrown error) as delivered.
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      formStatus.textContent = "Thank you! We've received your enquiry and will reach out shortly.";
      formStatus.classList.add("success");
      showToast("Enquiry submitted — we'll be in touch!");
      spawnSparkles(submitBtn);
      form.reset();
    } catch (err) {
      formStatus.textContent = "Something went wrong. Please call/WhatsApp us instead.";
      formStatus.classList.add("error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Enquiry";
    }
  });
}

populateProductSelect();
wireFilters();
renderCatalog();

// Open a product's card directly if the page was loaded with a #product-id
// link (e.g. from a WhatsApp share).
if (catalogEl && location.hash) {
  const target = document.querySelector(location.hash);
  if (target) setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "center" }), 300);
}
