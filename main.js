/* Zap Funds — interactions (no libraries) */
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

  /* ---------- stat count-ups: any [data-count] animates on entry ---------- */
  var countEls = document.querySelectorAll("[data-count]");
  if (countEls.length && !prefersReducedMotion && "IntersectionObserver" in window) {
    var runCount = function (el) {
      var target = parseFloat(el.getAttribute("data-count")) || 0;
      var pre = el.getAttribute("data-prefix") || "";
      var suf = el.getAttribute("data-suffix") || "";
      var render = function (v) { el.textContent = pre + Math.round(v) + suf; };
      var t0 = null, DUR = 1400;
      var step = function (now) {
        if (t0 === null) { t0 = now; }
        var pr = Math.min((now - t0) / DUR, 1);
        render(target * (1 - Math.pow(1 - pr, 3)));
        if (pr < 1) { window.requestAnimationFrame(step); }
      };
      render(0);
      window.requestAnimationFrame(step);
    };
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCount(e.target); countIO.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    countEls.forEach(function (el) { countIO.observe(el); });
  }

  /* ---------- zoom reveals for imagery ---------- */
  var rvEls = document.querySelectorAll(".rv");
  if (rvEls.length && !prefersReducedMotion && "IntersectionObserver" in window) {
    var rvIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("rv-in"); rvIO.unobserve(e.target); }
      });
    }, { threshold: 0.2 });
    rvEls.forEach(function (el) { rvIO.observe(el); });
  } else {
    rvEls.forEach(function (el) { el.classList.add("rv-in"); });
  }

  /* ---------- scroll progress bar ---------- */
  if (!prefersReducedMotion) {
    var spBar = document.createElement("div");
    spBar.className = "scroll-progress";
    spBar.setAttribute("aria-hidden", "true");
    document.body.appendChild(spBar);
    var spTick = function () {
      var root = document.documentElement;
      var max = root.scrollHeight - root.clientHeight;
      spBar.style.transform = "scaleX(" + (max > 0 ? root.scrollTop / max : 0) + ")";
    };
    window.addEventListener("scroll", spTick, { passive: true });
    spTick();
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





  /* ---------- what we fund: white disc that never touches the heading ---------- */
  var maskSection = document.querySelector(".mask-reveal");
  var maskOverlay = document.getElementById("maskOverlay");
  var maskContent = document.getElementById("maskContent");

  if (maskSection && maskOverlay && !prefersReducedMotion) {
    var maskProgress = 0;
    var syncMask = function () {
      var progress = maskProgress;

      // disc grows from the bottom-right; cap the radius just short of every
      // visible block of copy, measured in the overlay's own box (the painted
      // clip-path %s resolve there, not in the viewport)
      var ob = maskOverlay.getBoundingClientRect();
      var ref = Math.hypot(ob.width, ob.height) / Math.SQRT2;
      var cx = ob.left + ob.width * 0.85;
      var cy = ob.top + ob.height * 0.85;
      var cr = null;
      for (var k = 0; k < maskContent.children.length; k++) {
        var rc = maskContent.children[k].getBoundingClientRect();
        if (!rc.width && !rc.height) { continue; }
        if (!cr) { cr = { left: rc.left, top: rc.top, right: rc.right, bottom: rc.bottom }; }
        else {
          cr.left = Math.min(cr.left, rc.left);
          cr.top = Math.min(cr.top, rc.top);
          cr.right = Math.max(cr.right, rc.right);
          cr.bottom = Math.max(cr.bottom, rc.bottom);
        }
      }
      if (!cr) { cr = { left: cx, top: cy, right: cx, bottom: cy }; }
      var px = Math.max(cr.left, Math.min(cx, cr.right));
      var py = Math.max(cr.top, Math.min(cy, cr.bottom));
      var capPct = Math.max(6, (Math.hypot(cx - px, cy - py) / ref) * 100 * 0.97);
      var radius = Math.min(progress * 160, capPct);

      maskOverlay.style.clipPath = "circle(" + radius + "% at 85% 85%)";
      maskContent.classList.toggle("visible", progress > 0.12);
    };
    var runRamp = function () {
      var t0 = null, DUR = 1400;
      var step = function (now) {
        if (t0 === null) { t0 = now; }
        var p = Math.min((now - t0) / DUR, 1);
        maskProgress = 1 - Math.pow(1 - p, 3);
        syncMask();
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
