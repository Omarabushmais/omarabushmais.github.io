// portfolio.js - small scripts for the normal mode and the switch between modes.
// Loaded after room.js. Plain JavaScript, no libraries.

// ---- Mode switch: "Try 3D mode" / "Back to normal mode" (#3d in the address), nav scrolling, copy-email buttons ----
(function () {
  var B = document.body,
    CL = document.getElementById("classic");
  function set3d(on, push) {
    B.classList.toggle("m3d", on);
    if (push !== false) {
      try {
        history.replaceState(
          null,
          "",
          on ? "#3d" : location.pathname + location.search,
        );
      } catch (e) {
        try {
          location.hash = on ? "3d" : "";
        } catch (_) {}
      }
    }
    if (!on) CL.scrollTop = CL.scrollTop;
  }
  window.__set3d = set3d;
  if (location.hash === "#3d") B.classList.add("m3d");
  addEventListener("hashchange", function () {
    B.classList.toggle("m3d", location.hash === "#3d");
  });
  CL.querySelectorAll("[data-3d]").forEach(function (b) {
    b.addEventListener("click", function () {
      set3d(true);
    });
  });
  var bk = document.getElementById("back");
  if (bk)
    bk.addEventListener("click", function () {
      set3d(false);
    });
  CL.querySelectorAll("[data-go]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var id = a.getAttribute("data-go");
      var el =
        id === "top"
          ? CL
          : document.getElementById(id === "top" ? "ktop" : "k-" + id);
      if (id === "top") CL.scrollTo({ top: 0, behavior: "smooth" });
      else if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  var EMAIL = "omarabushmais@gmail.com";
  function flash(b, t) {
    var o = b.getAttribute("data-o") || b.textContent;
    b.setAttribute("data-o", o);
    b.textContent = t;
    setTimeout(function () {
      b.textContent = o;
    }, 1600);
  }
  function copy(b) {
    var done = function () {
      flash(b, "Copied");
    };
    var fb = function () {
      var r = document.createRange();
      r.selectNodeContents(document.getElementById("kmail"));
      var s = getSelection();
      s.removeAllRanges();
      s.addRange(r);
      flash(b, "Selected, press copy");
    };
    try {
      navigator.clipboard.writeText(EMAIL).then(done, fb);
    } catch (e) {
      fb();
    }
  }
  ["kcopyTop", "kcopyMail"].forEach(function (id) {
    var b = document.getElementById(id);
    if (b)
      b.addEventListener("click", function () {
        copy(b);
      });
  });
})();

// ---- Copy buttons that carry their own text (data-copy), e.g. the phone number ----
(function () {
  document.querySelectorAll("#classic [data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-copy"),
        o = b.getAttribute("data-o") || b.textContent;
      b.setAttribute("data-o", o);
      var done = function () {
        b.textContent = "Copied";
        setTimeout(function () {
          b.textContent = o;
        }, 1600);
      };
      var fb = function () {
        var e = b.parentNode.querySelector("b"),
          r = document.createRange();
        r.selectNodeContents(e);
        var x = getSelection();
        x.removeAllRanges();
        x.addRange(r);
        b.textContent = "Selected";
        setTimeout(function () {
          b.textContent = o;
        }, 1600);
      };
      try {
        navigator.clipboard.writeText(v).then(done, fb);
      } catch (e) {
        fb();
      }
    });
  });
})();

// ---- Highlight the "Edit room" button until it is clicked ----
(function () {
  var b = document.getElementById("eb");
  if (b)
    b.addEventListener("click", function () {
      b.classList.remove("hint");
      b.style.cssText = "";
    });
})();

// ---- Scroll reveal: cards fade in as you scroll the normal page ----
(function () {
  var CL = document.getElementById("classic");
  if (
    !CL ||
    !("IntersectionObserver" in window) ||
    matchMedia("(prefers-reduced-motion:reduce)").matches
  )
    return;
  var els = CL.querySelectorAll(".kfeat,.kpc2,.ksc,.kgd,.kcc,.kti,.kstat,.ksh");
  var io = new IntersectionObserver(
    function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          var t = e.target;
          t.classList.add("kin");
          io.unobserve(t);
          setTimeout(function () {
            t.classList.remove("kr", "kin");
            t.style.transitionDelay = "";
          }, 800);
        }
      });
    },
    { root: CL, threshold: 0.08 },
  );
  els.forEach(function (el, i) {
    el.classList.add("kr");
    el.style.transitionDelay = (i % 3) * 70 + "ms";
    io.observe(el);
  });
})();

// ---- Phones: block 3D mode and show the "open on a desktop" message ----
(function () {
  var B = document.body,
    co = matchMedia("(pointer:coarse)");
  function chk() {
    B.classList.toggle(
      "pp",
      co.matches && Math.min(innerWidth, innerHeight) < 600,
    );
  }
  addEventListener("resize", chk);
  addEventListener("orientationchange", chk);
  chk();
  var bk = document.getElementById("rbk");
  if (bk)
    bk.addEventListener("click", function () {
      if (window.__set3d) window.__set3d(false);
    });
})();
