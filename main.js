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

  /* ---------- product blocks: activate as they enter view (no scroll trapping) ---------- */
  var fundSlides = document.querySelectorAll(".fund-slide");
  if ("IntersectionObserver" in window) {
    var fio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("active");
          fio.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    fundSlides.forEach(function (s) { fio.observe(s); });
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
