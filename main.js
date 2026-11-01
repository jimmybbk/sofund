/* Sofund — interactions (no libraries) */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.documentElement.classList.add("js");

  /* ---------- palette themes (preview switcher) ---------- */
  var THEMES = {
    mono: { label: "Mono", tokens: {} }, // defaults from styles.css
    "navy-gold": {
      label: "Midnight Gold",
      tokens: {
        "--white": "#0A1830", "--black": "#F4F7FB", "--ink": "#F4F7FB",
        "--gray-700": "#C7D2E6", "--gray-500": "#A9B8D4", "--gray-400": "#8FA3C2",
        "--gray-200": "#22355A", "--gray-100": "#0F2242",
        "--accent": "#F5B301", "--accent-hover": "#FFC42E", "--on-accent": "#1A1205",
        "--espresso": "#071022", "--on-dark": "#F4F7FB",
        "--on-dark-muted": "rgba(244,247,251,0.62)", "--on-dark-faint": "rgba(244,247,251,0.4)",
        "--on-dark-label": "rgba(244,247,251,0.7)", "--on-dark-body": "rgba(244,247,251,0.75)",
        "--on-dark-legal": "rgba(244,247,251,0.32)", "--on-dark-link": "rgba(244,247,251,0.45)",
        "--dark-card": "rgba(244,247,251,0.05)", "--dark-border": "rgba(244,247,251,0.14)",
        "--dark-input-bg": "rgba(244,247,251,0.06)", "--dark-input-hover": "rgba(244,247,251,0.35)",
        "--nav-blur-bg": "rgba(10,24,48,0.9)",
        "--danger-border": "#FFD9A8", "--danger-text": "#FFD9A8"
      }
    },
    ocean: {
      label: "Ocean Blue",
      tokens: {
        "--white": "#FFFFFF", "--black": "#0B1F3A", "--ink": "#0B1F3A",
        "--gray-700": "#33475F", "--gray-500": "#4A637F", "--gray-400": "#8CA3BC",
        "--gray-200": "#E2E8F0", "--gray-100": "#F2F6FA",
        "--accent": "#0F62FE", "--accent-hover": "#1558B8", "--on-accent": "#FFFFFF",
        "--espresso": "#0B1F3A", "--on-dark": "#EAF1FB",
        "--on-dark-muted": "rgba(234,241,251,0.66)", "--on-dark-faint": "rgba(234,241,251,0.45)",
        "--on-dark-label": "rgba(234,241,251,0.72)", "--on-dark-body": "rgba(234,241,251,0.78)",
        "--on-dark-legal": "rgba(234,241,251,0.34)", "--on-dark-link": "rgba(234,241,251,0.48)",
        "--dark-card": "rgba(234,241,251,0.05)", "--dark-border": "rgba(234,241,251,0.15)",
        "--dark-input-bg": "rgba(234,241,251,0.06)", "--dark-input-hover": "rgba(234,241,251,0.36)",
        "--nav-blur-bg": "rgba(255,255,255,0.92)",
        "--danger-border": "#FF9B8A", "--danger-text": "#FFB3A5"
      }
    },
    emerald: {
      label: "Emerald",
      tokens: {
        "--white": "#FFFFFF", "--black": "#0C2B21", "--ink": "#0C2B21",
        "--gray-700": "#33473F", "--gray-500": "#4E665B", "--gray-400": "#8AA79A",
        "--gray-200": "#DFE9E4", "--gray-100": "#F0F6F2",
        "--accent": "#0E8A5F", "--accent-hover": "#0B7350", "--on-accent": "#FFFFFF",
        "--espresso": "#0B241C", "--on-dark": "#ECF5F0",
        "--on-dark-muted": "rgba(236,245,240,0.66)", "--on-dark-faint": "rgba(236,245,240,0.45)",
        "--on-dark-label": "rgba(236,245,240,0.72)", "--on-dark-body": "rgba(236,245,240,0.78)",
        "--on-dark-legal": "rgba(236,245,240,0.34)", "--on-dark-link": "rgba(236,245,240,0.48)",
        "--dark-card": "rgba(236,245,240,0.05)", "--dark-border": "rgba(236,245,240,0.15)",
        "--dark-input-bg": "rgba(236,245,240,0.06)", "--dark-input-hover": "rgba(236,245,240,0.36)",
        "--nav-blur-bg": "rgba(255,255,255,0.92)",
        "--danger-border": "#FF9B8A", "--danger-text": "#FFB3A5"
      }
    },
    electric: {
      label: "Electric Night",
      tokens: {
        "--white": "#0B0B0E", "--black": "#F2F2F5", "--ink": "#F2F2F5",
        "--gray-700": "#B9B9C4", "--gray-500": "#9A9AA8", "--gray-400": "#74747F",
        "--gray-200": "#26262E", "--gray-100": "#14141A",
        "--accent": "#3D6BFF", "--accent-hover": "#5C82FF", "--on-accent": "#FFFFFF",
        "--espresso": "#060609", "--on-dark": "#F2F2F5",
        "--on-dark-muted": "rgba(242,242,245,0.62)", "--on-dark-faint": "rgba(242,242,245,0.4)",
        "--on-dark-label": "rgba(242,242,245,0.7)", "--on-dark-body": "rgba(242,242,245,0.75)",
        "--on-dark-legal": "rgba(242,242,245,0.32)", "--on-dark-link": "rgba(242,242,245,0.45)",
        "--dark-card": "rgba(242,242,245,0.05)", "--dark-border": "rgba(242,242,245,0.14)",
        "--dark-input-bg": "rgba(242,242,245,0.06)", "--dark-input-hover": "rgba(242,242,245,0.35)",
        "--nav-blur-bg": "rgba(11,11,14,0.9)",
        "--danger-border": "#FF9B9B", "--danger-text": "#FFB3B3"
      }
    },
    ember: {
      label: "Ember",
      tokens: {
        "--white": "#171412", "--black": "#F5EFE8", "--ink": "#F5EFE8",
        "--gray-700": "#CFC6BC", "--gray-500": "#AF9F91", "--gray-400": "#8D7F72",
        "--gray-200": "#332C27", "--gray-100": "#1F1B18",
        "--accent": "#E8A33D", "--accent-hover": "#F5B856", "--on-accent": "#201408",
        "--espresso": "#100D0B", "--on-dark": "#F5EFE8",
        "--on-dark-muted": "rgba(245,239,232,0.62)", "--on-dark-faint": "rgba(245,239,232,0.4)",
        "--on-dark-label": "rgba(245,239,232,0.7)", "--on-dark-body": "rgba(245,239,232,0.75)",
        "--on-dark-legal": "rgba(245,239,232,0.32)", "--on-dark-link": "rgba(245,239,232,0.45)",
        "--dark-card": "rgba(245,239,232,0.05)", "--dark-border": "rgba(245,239,232,0.14)",
        "--dark-input-bg": "rgba(245,239,232,0.06)", "--dark-input-hover": "rgba(245,239,232,0.35)",
        "--nav-blur-bg": "rgba(23,20,18,0.9)",
        "--danger-border": "#FFC48F", "--danger-text": "#FFD4AE"
      }
    }
  };

  var THEME_TOKENS = [
    "--white", "--black", "--ink", "--gray-700", "--gray-500", "--gray-400",
    "--gray-200", "--gray-100", "--accent", "--accent-hover", "--on-accent",
    "--espresso", "--on-dark", "--on-dark-muted", "--on-dark-faint",
    "--on-dark-label", "--on-dark-body", "--on-dark-legal", "--on-dark-link",
    "--dark-card", "--dark-border", "--dark-input-bg", "--dark-input-hover",
    "--nav-blur-bg", "--danger-border", "--danger-text"
  ];

  var themeNames = Object.keys(THEMES);

  function applyTheme(name) {
    if (!THEMES[name]) { name = "mono"; }
    var root = document.documentElement;
    THEME_TOKENS.forEach(function (t) { root.style.removeProperty(t); });
    var tokens = THEMES[name].tokens;
    Object.keys(tokens).forEach(function (t) { root.style.setProperty(t, tokens[t]); });
    var label = document.getElementById("themeName");
    if (label) { label.textContent = THEMES[name].label; }
    try {
      var url = new URL(window.location.href);
      if (name === "mono") { url.searchParams.delete("theme"); } else { url.searchParams.set("theme", name); }
      window.history.replaceState(null, "", url);
    } catch (e) { /* ignore */ }
  }

  // initial theme from URL (?theme=navy-gold etc.)
  var initialTheme = "mono";
  try {
    var param = new URL(window.location.href).searchParams.get("theme");
    if (param && THEMES[param]) { initialTheme = param; }
  } catch (e) { /* ignore */ }
  if (initialTheme !== "mono") { applyTheme(initialTheme); }

  // floating switcher (arrow keys also work when it has focus)
  var switcher = document.createElement("div");
  switcher.className = "theme-switcher";
  switcher.setAttribute("role", "group");
  switcher.setAttribute("aria-label", "Colour palette preview");
  switcher.innerHTML =
    '<button type="button" id="themePrev" aria-label="Previous palette">&#8249;</button>' +
    '<span id="themeName">' + THEMES[initialTheme].label + "</span>" +
    '<button type="button" id="themeNext" aria-label="Next palette">&#8250;</button>';
  document.body.appendChild(switcher);

  function cycle(dir) {
    var current = "mono";
    try {
      var p = new URL(window.location.href).searchParams.get("theme");
      if (p && THEMES[p]) { current = p; }
    } catch (e) { /* ignore */ }
    var idx = themeNames.indexOf(current);
    applyTheme(themeNames[(idx + dir + themeNames.length) % themeNames.length]);
  }
  document.getElementById("themePrev").addEventListener("click", function () { cycle(-1); });
  document.getElementById("themeNext").addEventListener("click", function () { cycle(1); });

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

  /* ---------- circle mask reveal ---------- */
  var maskSection = document.querySelector(".mask-reveal");
  var maskOverlay = document.getElementById("maskOverlay");
  var maskContent = document.getElementById("maskContent");

  if (maskSection && maskOverlay && !prefersReducedMotion) {
    var syncMask = function () {
      var rect = maskSection.getBoundingClientRect();
      var span = maskSection.offsetHeight - window.innerHeight;
      var progress = span > 0 ? Math.max(0, Math.min(1, -rect.top / span)) : 1;
      maskOverlay.style.clipPath = "circle(" + (progress * 150) + "% at 50% 50%)";
      maskContent.classList.toggle("visible", progress > 0.4);
    };
    window.addEventListener("scroll", syncMask, { passive: true });
    window.addEventListener("resize", syncMask, { passive: true });
    syncMask();
  } else if (maskContent) {
    maskContent.classList.add("visible");
  }

  /* ---------- scroll-driven fund slides ---------- */
  var fundSection = document.querySelector(".fund-slides");
  var fundSlides = document.querySelectorAll(".fund-slide");

  if (fundSection && fundSlides.length && !prefersReducedMotion) {
    var currentSlide = 0;
    fundSlides[0].classList.add("active");

    var syncSlides = function () {
      var rect = fundSection.getBoundingClientRect();
      var span = fundSection.offsetHeight - window.innerHeight;
      var scrolled = span > 0 ? -rect.top / span : 1;
      if (scrolled >= 0 && scrolled <= 1) {
        var total = fundSlides.length;
        var activeIndex = Math.min(Math.floor(scrolled * total), total - 1);
        if (activeIndex !== currentSlide) {
          fundSlides[currentSlide].classList.remove("active");
          fundSlides[activeIndex].classList.add("active");
          currentSlide = activeIndex;
        }
      } else if (scrolled < 0 && currentSlide !== 0) {
        fundSlides[currentSlide].classList.remove("active");
        fundSlides[0].classList.add("active");
        currentSlide = 0;
      }
    };
    window.addEventListener("scroll", syncSlides, { passive: true });
    window.addEventListener("resize", syncSlides, { passive: true });
    syncSlides();
  } else {
    fundSlides.forEach(function (s) { s.classList.add("active"); });
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
