/* ============================================================
   HAH — A Home Away From Home  |  shared behavior
   ============================================================ */

/* ----- Shared SVG icons ----- */
const HOUSE_HEART_SVG = `
<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M8 30 L32 10 L56 30"/>
  <path d="M14 26 V52 H50 V26"/>
  <path d="M32 44c-4-3.4-8-6.2-8-10a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 3.8-4 6.6-8 10z" fill="currentColor" stroke="none"/>
</svg>`;

/* ----- Inject shared header ----- */
function buildHeader() {
  const page = document.body.dataset.page || "";
  const links = [
    ["index.html", "Home", "home"],
    ["foundation.html", "The Foundation", "foundation"],
    ["what-we-do.html", "What We Do", "what-we-do"],
    ["referral.html", "Referral", "referral"],
    ["resources.html", "Resources", "resources"],
    ["contact.html", "Contact", "contact"],
  ];

  const nav = links
    .map(
      ([href, label, id]) =>
        `<li><a href="${href}" class="${id === page ? "active" : ""}" ${
          id === page ? 'aria-current="page"' : ""
        }>${label}</a></li>`
    )
    .join("");

  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <div class="container header-inner">
      <a class="brand" href="index.html" aria-label="HAH — A Home Away From Home, home page">
        <span class="brand-mark" style="color:var(--orange)">${HOUSE_HEART_SVG}</span>
        <span class="brand-text">
          <span class="brand-name">HAH</span><br>
          <span class="brand-tag">A Home Away From Home</span>
        </span>
      </a>
      <button class="nav-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Toggle navigation">
        <span></span><span></span><span></span>
      </button>
      <nav class="main-nav" id="main-nav" aria-label="Main">
        <ul>${nav}</ul>
      </nav>
      <a href="referral.html" class="btn btn-orange header-cta">Refer a Child</a>
    </div>`;
  document.body.prepend(header);

  const toggle = header.querySelector(".nav-toggle");
  const menu = header.querySelector(".main-nav");
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

/* ----- Inject shared CTA band + footer ----- */
function buildFooter() {
  const wrap = document.createElement("div");
  wrap.innerHTML = `
  <section class="cta-band" aria-labelledby="cta-title">
    <div class="container cta-inner">
      <div class="cta-icon">${HOUSE_HEART_SVG}</div>
      <div class="cta-text">
        <h2 id="cta-title">Together, We Can Change a Life.</h2>
        <p>Thank you to our partners and supporters for helping us create a safe place and a stronger tomorrow.</p>
      </div>
      <div class="cta-actions">
        <a href="referral.html" class="btn btn-orange">Refer a Child</a>
        <a href="contact.html" class="btn btn-outline-light">Contact Us</a>
      </div>
    </div>
  </section>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <h3>A Home Away From Home</h3>
        <p style="max-width:38ch;font-size:.93rem">
          Short-term respite care for children in foster care — a safe, stable,
          home-like environment serving families across North Carolina.
        </p>
      </div>
      <div>
        <h3>Explore</h3>
        <a href="index.html">Home</a>
        <a href="foundation.html">The Foundation</a>
        <a href="what-we-do.html">What We Do</a>
        <a href="referral.html">Referral</a>
      </div>
      <div>
        <h3>Connect</h3>
        <a href="resources.html">Resources</a>
        <a href="contact.html">Contact</a>
        <a href="referral.html">Refer a Child</a>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>© ${new Date().getFullYear()} HAH — A Home Away From Home. All rights reserved.</span>
      <span>Serving children &amp; families in North Carolina</span>
    </div>
  </footer>`;
  while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
}

/* ----- Scroll reveal ----- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((el) => io.observe(el));
}

/* ----- Simple client-side form validation ----- */
function initForms() {
  document.querySelectorAll("form[data-validate]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;

      form.querySelectorAll(".field").forEach((field) => {
        const input = field.querySelector("input, select, textarea");
        if (!input) return;
        let valid = true;

        if (input.hasAttribute("required") && !input.value.trim()) valid = false;
        if (valid && input.type === "email" && input.value.trim()) {
          valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        }
        field.classList.toggle("invalid", !valid);
        if (!valid) ok = false;
      });

      const success = form.querySelector(".form-success");
      if (ok) {
        form.reset();
        if (success) {
          success.classList.add("show");
          success.focus?.();
          setTimeout(() => success.classList.remove("show"), 8000);
        }
      } else {
        const firstInvalid = form.querySelector(".field.invalid input, .field.invalid select, .field.invalid textarea");
        firstInvalid?.focus();
      }
    });

    // clear error state while typing
    form.addEventListener("input", (e) => {
      const field = e.target.closest(".field");
      if (field) field.classList.remove("invalid");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  buildHeader();
  buildFooter();
  initReveal();
  initForms();
});
