/* Sofund — interactions (no libraries) */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.documentElement.classList.add("js");

  /* ---------- scroll reveal ---------- */
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -50px 0px" });
    document.querySelectorAll(".sr").forEach(function (el) { observer.observe(el); });
  } else {
    document.querySelectorAll(".sr").forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- nav scroll state ---------- */
  var nav = document.getElementById("nav");
  if (nav) {
    var syncNav = function () {
      nav.classList.toggle("scrolled", window.scrollY > 60);
    };
    window.addEventListener("scroll", syncNav, { passive: true });
    syncNav();
  }

  /* ---------- mobile nav ---------- */
  var toggle = document.getElementById("navToggle");
  var drawer = document.getElementById("navDrawer");
  if (toggle && drawer) {
    toggle.addEventListener("click", function () {
      var open = drawer.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    drawer.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        drawer.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- rotating hero words ---------- */
  var rotator = document.getElementById("rotator");
  if (rotator && !prefersReducedMotion) {
    var words = rotator.querySelectorAll(".hero-word:not(.hero-word-long)");
    var current = 0;
    setInterval(function () {
      var leaving = words[current];
      leaving.classList.remove("active");
      leaving.classList.add("leaving");
      current = (current + 1) % words.length;
      words[current].classList.add("active");
      setTimeout(function () {
        leaving.classList.remove("leaving");
      }, 650);
    }, 2400);
  }


  /* ---------- product blocks: activate on entry (no scroll hold) ---------- */
  var fundSlidesAll = document.querySelectorAll(".fund-slide");
  if ("IntersectionObserver" in window) {
    var slideIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("active");
          slideIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    fundSlidesAll.forEach(function (s) { slideIO.observe(s); });
  } else {
    fundSlidesAll.forEach(function (s) { s.classList.add("active"); });
  }

  /* ---------- what we fund intro: treatments (preview via ?mask=) ---------- */
  var maskSection = document.querySelector(".mask-reveal");
  var maskOverlay = document.getElementById("maskOverlay");
  var maskContent = document.getElementById("maskContent");
  var MASK_VARIANTS = [
    ["disc-white", "White disc"],
    ["disc-blue", "Blue disc"],
    ["type", "Type scrub"],
    ["ghost", "Ghost 04"],
    ["ledger", "Ledger preview"]
  ];

  function currentMaskVariant() {
    var root = document.documentElement;
    for (var i = MASK_VARIANTS.length - 1; i >= 0; i--) {
      if (root.classList.contains("mask-v-" + MASK_VARIANTS[i][0])) { return MASK_VARIANTS[i][0]; }
    }
    return "disc-white";
  }

  var maskProgress = 0;
  function syncMaskWith(progress) {
    if (!maskSection || !maskContent) { return; }
    maskSection.style.setProperty("--p", progress.toFixed(4));
    maskContent.classList.toggle("visible", progress > 0.12);

    var variant = currentMaskVariant();
    if (variant === "disc-white" || variant === "disc-blue") {
      var topOrigin = variant === "disc-blue";
      var oy = window.innerHeight * (topOrigin ? 0.15 : 0.85);
      var ref = Math.hypot(window.innerWidth, window.innerHeight) / Math.SQRT2;
      var cx = window.innerWidth * 0.85;
      var cy = oy;
      var cr = document.getElementById("mask-heading").getBoundingClientRect();
      var px = Math.max(cr.left, Math.min(cx, cr.right));
      var py = Math.max(cr.top, Math.min(cy, cr.bottom));
      var capPct = Math.max(6, (Math.hypot(cx - px, cy - py) / ref) * 100 * 0.97);
      var radius = Math.min(progress * 160, capPct);
      maskOverlay.style.clipPath = "circle(" + radius + "% at 85% " + (topOrigin ? "15%" : "85%") + ")";
    }
  }

  function applyMaskVariant(name) {
    var root = document.documentElement;
    MASK_VARIANTS.forEach(function (v) { root.classList.remove("mask-v-" + v[0]); });
    if (name !== "disc-white") { root.classList.add("mask-v-" + name); }
    var label = document.getElementById("maskVariantName");
    var entry = MASK_VARIANTS.filter(function (v) { return v[0] === name; })[0] || MASK_VARIANTS[0];
    if (label) { label.textContent = entry[1]; }
    try {
      var url = new URL(window.location.href);
      if (name === "disc-white") { url.searchParams.delete("mask"); } else { url.searchParams.set("mask", name); }
      window.history.replaceState(null, "", url);
    } catch (e) { /* ignore */ }
    syncMaskWith(maskProgress);
  }

  if (maskSection && !prefersReducedMotion) {
    // entrance ramp: animate progress 0 -> 1 once, on entry (no scroll hold)
    var runRamp = function () {
      var t0 = null, DUR = 1400;
      var step = function (now) {
        if (t0 === null) { t0 = now; }
        var p = Math.min((now - t0) / DUR, 1);
        maskProgress = 1 - Math.pow(1 - p, 3);
        syncMaskWith(maskProgress);
        if (p < 1) { window.requestAnimationFrame(step); }
      };
      window.requestAnimationFrame(step);
    };
    if ("IntersectionObserver" in window) {
      var maskIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { runRamp(); maskIO.unobserve(e.target); }
        });
      }, { threshold: 0.35 });
      maskIO.observe(maskSection);
    } else { runRamp(); }
    // initial variant from URL
    var initialMask = "disc-white";
    try {
      var mp = new URL(window.location.href).searchParams.get("mask");
      if (mp && MASK_VARIANTS.some(function (v) { return v[0] === mp; })) { initialMask = mp; }
    } catch (e) { /* ignore */ }
    applyMaskVariant(initialMask);

    var maskPill = document.createElement("div");
    maskPill.className = "switcher-pill";
    maskPill.setAttribute("role", "group");
    maskPill.setAttribute("aria-label", "What we fund treatment preview");
    maskPill.innerHTML =
      '<button type="button" id="maskPrev" aria-label="Previous treatment">&#8249;</button>' +
      '<span id="maskVariantName"></span>' +
      '<button type="button" id="maskNext" aria-label="Next treatment">&#8250;</button>';
    document.body.appendChild(maskPill);
    function maskCycle(dir) {
      var names = MASK_VARIANTS.map(function (v) { return v[0]; });
      applyMaskVariant(names[(names.indexOf(currentMaskVariant()) + dir + names.length) % names.length]);
    }
    document.getElementById("maskPrev").addEventListener("click", function () { maskCycle(-1); });
    document.getElementById("maskNext").addEventListener("click", function () { maskCycle(1); });
  } else if (maskContent) {
    maskContent.classList.add("visible");
  }


  /* ---------- application form: validate, then submit natively ---------- */
  var form = document.getElementById("applyForm");

  function fieldError(input, hasError) {
    var error = document.getElementById("err-" + input.id);
    if (error) { error.hidden = !hasError; }
    input.setAttribute("aria-invalid", String(hasError));
  }

  function validateField(input) {
    var valid = input.checkValidity();
    if (input.type === "email") {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    }
    fieldError(input, !valid);
    return valid;
  }

  if (form) {
    var fields = form.querySelectorAll("input:not([type=hidden]), select");

    fields.forEach(function (field) {
      field.addEventListener("input", function () {
        if (field.getAttribute("aria-invalid") === "true") {
          validateField(field);
        }
      });
    });

    form.addEventListener("submit", function (e) {
      var allValid = true;
      var firstInvalid = null;
      fields.forEach(function (field) {
        var valid = validateField(field);
        if (!valid && !firstInvalid) { firstInvalid = field; }
        allValid = allValid && valid;
      });

      if (!allValid) {
        e.preventDefault();
        firstInvalid.focus();
        return;
      }
      // valid: let the browser submit natively to the form action (FormSubmit endpoint)
    });
  }
})();
