/* ==========================================================================
   MotorSport — main.js
   Vanilla JavaScript only. Beginner-friendly, commented, no frameworks.
   This file powers: loading screen, sticky nav, mobile menu, scroll reveal,
   animated counters, the drivers slider and the "back to top" button.
   Every function checks that its elements exist before running, so this
   single file can be safely included on every page of the site.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  initLoader();
  initWelcomeGreeting();
  initMenu();
  initScrollReveal();
  initCounters();
  initSliders();
  initBackToTop();
  initActiveNavLink();
  initYear();
  initModal();
});

/* ---------------------------------------------------------------------- 
   1) LOADING SCREEN
   Hides the #loader element shortly after the page has finished loading,
   so the visitor sees a brief branded animation instead of a blank page.
------------------------------------------------------------------------- */
function initLoader() {
  var loader = document.getElementById("loader");
  if (!loader) return;

  window.addEventListener("load", function () {
    setTimeout(function () {
      loader.classList.add("hidden");
    }, 350);
  });

  // Safety net: if "load" already fired before this script ran, hide anyway.
  setTimeout(function () {
    loader.classList.add("hidden");
  }, 2000);
}

/* ---------------------------------------------------------------------- 
   2) FLOATING MENU
   A single circular button toggles a full-screen animated menu overlay.
   The same behaviour is used on every screen size — there is no separate
   "desktop nav bar", just this one floating control everywhere.
------------------------------------------------------------------------- */
function initMenu() {
  var toggle = document.getElementById("menuToggle");
  var overlay = document.getElementById("menuOverlay");
  if (!toggle || !overlay) return;

  function openMenu() {
    overlay.classList.add("open");
    toggle.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    overlay.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  toggle.addEventListener("click", function () {
    if (overlay.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Clicking the dark backdrop (but not the menu content itself) closes it.
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeMenu();
  });

  // Close the menu whenever a link inside it is clicked.
  overlay.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeMenu();
  });
}

/* ---------------------------------------------------------------------- 
   3) SCROLL REVEAL ANIMATIONS
   Any element with the class ".reveal" fades and slides into place the
   first time it enters the viewport. Uses IntersectionObserver, which
   is efficient and beginner-friendly to reason about.
------------------------------------------------------------------------- */
function initScrollReveal() {
  var items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    // Fallback for very old browsers: just show everything.
    items.forEach(function (el) { el.classList.add("in-view"); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach(function (el) { observer.observe(el); });
}

/* ---------------------------------------------------------------------- 
   5) ANIMATED COUNTERS
   Elements like <span class="stat-num" data-count="247"></span> count up
   from 0 to the target number once they scroll into view.
------------------------------------------------------------------------- */
function initCounters() {
  var counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var duration = 1600; // milliseconds
    var start = null;

    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      // Ease-out for a smooth "settle" at the end.
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.floor(eased * target);
      el.textContent = value.toLocaleString("uk-UA");
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString("uk-UA");
      }
    }
    requestAnimationFrame(step);
  }

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animateCounter);
    return;
  }

  var counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach(function (el) { counterObserver.observe(el); });
}

/* ---------------------------------------------------------------------- 
   6) DRIVERS / CONTENT SLIDERS
   Any ".slider" block with left/right buttons scrolls its ".slider-track"
   horizontally by roughly one card width per click.
------------------------------------------------------------------------- */
function initSliders() {
  var sliders = document.querySelectorAll(".slider");
  sliders.forEach(function (slider) {
    var track = slider.querySelector(".slider-track");
    var prevBtn = slider.querySelector(".slider-prev");
    var nextBtn = slider.querySelector(".slider-next");
    if (!track) return;

    var scrollAmount = 300;

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        track.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        track.scrollBy({ left: scrollAmount, behavior: "smooth" });
      });
    }
  });
}

/* ---------------------------------------------------------------------- 
   7) BACK TO TOP BUTTON
------------------------------------------------------------------------- */
function initBackToTop() {
  var btn = document.getElementById("backToTop");
  if (!btn) return;

  window.addEventListener("scroll", function () {
    if (window.scrollY > 600) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  });

  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------------------------------------------------------------------- 
   8) ACTIVE NAV LINK
   Adds the "active" class to the nav link matching the current page,
   based on the file name in the URL.
------------------------------------------------------------------------- */
function initActiveNavLink() {
  var links = document.querySelectorAll(".menu-links a");
  if (!links.length) return;

  var current = window.location.pathname.split("/").pop() || "index.html";

  links.forEach(function (link) {
    var href = link.getAttribute("href") || "";
    var page = href.split("/").pop();
    if (page === current) {
      link.classList.add("active");
    }
  });
}

/* ---------------------------------------------------------------------- 
   9) FOOTER YEAR
   Fills in the current year automatically inside <span id="year"></span>.
------------------------------------------------------------------------- */
function initYear() {
  var yearEl = document.getElementById("year");
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear();
}

/* ---------------------------------------------------------------------- 
   10) WELCOME GREETING (homepage only)
   Shows a short, time-of-day-aware greeting right after the loader has
   hidden. Only runs if the page actually has a #welcome element — every
   other page simply skips this.
------------------------------------------------------------------------- */
function initWelcomeGreeting() {
  var el = document.getElementById("welcome");
  if (!el) return;

  var textEl = el.querySelector(".welcome-text");
  if (textEl) {
    var hour = new Date().getHours();
    var greeting;
    if (hour >= 5 && hour < 12) {
      greeting = "Доброго ранку";
    } else if (hour >= 12 && hour < 18) {
      greeting = "Доброго дня";
    } else if (hour >= 18 && hour < 23) {
      greeting = "Доброго вечора";
    } else {
      greeting = "Доброї ночі";
    }
    textEl.innerHTML = greeting + ', <span>ласкаво просимо до MotorSport</span>';
  }

  window.addEventListener("load", function () {
    setTimeout(function () { el.classList.add("show"); }, 500);
    setTimeout(function () { el.classList.remove("show"); el.classList.add("done"); }, 2700);
  });

  // Safety net if "load" already fired before this script ran.
  setTimeout(function () {
    el.classList.add("show");
    setTimeout(function () {
      el.classList.remove("show");
      el.classList.add("done");
    }, 2200);
  }, 2200);
}

/* ---------------------------------------------------------------------- 
   11) MODAL WINDOW SYSTEM
   Powers every "Детальніше" button on the site. Content comes from the
   MODAL_CONTENT object defined in content.js — this function only
   handles opening, closing and rendering it into the shared modal
   markup that every page includes once near the end of <body>.
------------------------------------------------------------------------- */
function initModal() {
  var overlay = document.getElementById("modalOverlay");
  if (!overlay) return;

  var closeBtn = document.getElementById("modalClose");
  var badgeEl = document.getElementById("modalBadge");
  var titleEl = document.getElementById("modalTitle");
  var subtitleEl = document.getElementById("modalSubtitle");
  var bodyEl = document.getElementById("modalBody");
  var mediaEl = document.getElementById("modalMedia");
  var lastFocused = null;

  function buildMediaHTML(type, slug) {
    var folderMap = { driver: "drivers", team: "teams", track: "tracks" };
    var folder = folderMap[type];
    if (!folder) return "";
    var inPages = window.location.pathname.indexOf("/pages/") !== -1;
    var prefix = inPages ? "../" : "";
    var src = prefix + "images/" + folder + "/" + slug + ".jpg";
    return '<img src="' + src + '" alt="" loading="lazy" onerror="this.parentElement.style.display=\'none\'">';
  }

  function buildTimelineHTML(stats) {
    if (!stats || !stats.length) return "";
    // Reuses whichever stat rows look like a year or year range
    // (e.g. "1991–2012", "1929", "2015 (17 років)") to build a compact
    // visual timeline without needing separately authored data.
    var points = [];
    stats.forEach(function (pair) {
      var label = pair[0], value = pair[1];
      var match = value.match(/(\d{4})/g);
      if (match) points.push({ year: match[0], label: label });
    });
    if (points.length < 2) return "";
    var html = '<p style="margin-top:22px;font-weight:700;color:var(--c-white);">Хронологія</p><div class="modal-timeline">';
    points.forEach(function (p) {
      html += '<div class="modal-timeline-item"><span class="modal-timeline-year">' + p.year + '</span><span>' + p.label + '</span></div>';
    });
    html += "</div>";
    return html;
  }

  function buildStatsHTML(stats) {
    if (!stats || !stats.length) return "";
    var html = '<div class="modal-stats">';
    stats.forEach(function (pair) {
      html += '<div class="modal-stat"><b>' + pair[1] + '</b><span>' + pair[0] + '</span></div>';
    });
    html += "</div>";
    return html;
  }

  function buildFactsHTML(facts) {
    if (!facts || !facts.length) return "";
    var html = '<p style="margin-top:22px;font-weight:700;color:var(--c-white);">Цікаві факти</p><ul class="modal-facts">';
    facts.forEach(function (fact) {
      html += "<li>" + fact + "</li>";
    });
    html += "</ul>";
    return html;
  }

  // Track slugs that are on the current F1 calendar — for these we can
  // pull the fastest lap of the 2026 season live from a public API.
  // Other tracks (Le Mans, Nürburgring, Daytona, Fuji, Laguna Seca) simply
  // don't get this block since they aren't F1 circuits.
  var F1_CIRCUITS = { monza: "monza", spa: "spa", silverstone: "silverstone", monaco: "monaco", suzuka: "suzuka" };

  function loadFastestLap(slug) {
    var holder = document.getElementById("modalFastestLap");
    if (!holder) return;
    var circuitId = F1_CIRCUITS[slug];

    fetch("https://api.jolpi.ca/ergast/f1/2026/circuits/" + circuitId + "/results/")
      .then(function (r) { if (!r.ok) throw new Error("bad response"); return r.json(); })
      .then(function (data) {
        var races = data.MRData.RaceTable.Races;
        if (!races || !races.length) throw new Error("no race yet");
        var results = races[races.length - 1].Results;
        var fastest = results.find(function (r) { return r.FastestLap && r.FastestLap.rank === "1"; });
        if (!fastest) throw new Error("no fastest lap data");
        var name = fastest.Driver.givenName + " " + fastest.Driver.familyName;
        var time = fastest.FastestLap.Time.time;
        holder.innerHTML =
          '<div class="modal-lap-box"><span class="modal-lap-label">Найшвидше коло сезону 2026 (дані оновлюються автоматично)</span>' +
          '<span class="modal-lap-time">' + time + "</span>" +
          '<span class="modal-lap-driver">' + name + "</span></div>";
      })
      .catch(function () {
        holder.innerHTML =
          '<p class="section-sub" style="margin-top:14px;">Дані про найшвидше коло 2026 року поки що недоступні (потрібен інтернет або гонка ще не відбулась).</p>';
      });
  }

  function buildCarHTML(type, slug, driversNow) {
    // Only teams have a "latest car/bike" photo. The image is a local
    // file the site owner adds (images/teams/<slug>-car.jpg) — if it's
    // missing, the block quietly hides itself instead of showing a
    // broken image icon.
    if (type !== "team") return "";
    var inPages = window.location.pathname.indexOf("/pages/") !== -1;
    var prefix = inPages ? "../" : "";
    var src = prefix + "images/teams/" + slug + "-car.jpg";
    var caption = driversNow ? "<p class=\"modal-car-caption\">Хто наразі виступає за команду: " + driversNow + "</p>" : "";
    return (
      '<div class="modal-car">' +
      '<p style="margin-top:22px;font-weight:700;color:var(--c-white);">Найновіший болід/мотоцикл команди</p>' +
      '<div class="modal-car-media"><img src="' + src + '" alt="" loading="lazy" ' +
      'onerror="this.closest(\'.modal-car\').style.display=\'none\'"></div>' +
      caption +
      "</div>"
    );
  }

  function buildStaticLapHTML(recordTime, recordDriver, recordNote) {
    if (!recordTime) return "";
    return (
      '<div class="modal-lap-box"><span class="modal-lap-label">Рекорд кола траси (актуальний, не оновлюється автоматично)</span>' +
      '<span class="modal-lap-time">' + recordTime + "</span>" +
      '<span class="modal-lap-driver">' + recordDriver + (recordNote ? " — " + recordNote : "") + "</span></div>"
    );
  }

  function openModal(type, slug, extra) {
    extra = extra || {};
    if (typeof MODAL_CONTENT === "undefined" || !MODAL_CONTENT[type] || !MODAL_CONTENT[type][slug]) {
      return;
    }
    var data = MODAL_CONTENT[type][slug];

    if (mediaEl) mediaEl.innerHTML = buildMediaHTML(type, slug);
    badgeEl.textContent = data.badge || "";
    titleEl.textContent = data.title || "";
    subtitleEl.textContent = data.subtitle || "";

    var html = "";
    (data.paragraphs || []).forEach(function (p) {
      html += "<p>" + p + "</p>";
    });
    html += buildStatsHTML(data.stats);
    html += buildTimelineHTML(data.stats);
    html += buildFactsHTML(data.facts);
    html += buildCarHTML(type, slug, extra.driversNow);

    var isLiveTrack = type === "track" && F1_CIRCUITS[slug];
    if (isLiveTrack) {
      html += '<div id="modalFastestLap"><p class="section-sub" style="margin-top:14px;">Завантаження даних про коло 2026 року…</p></div>';
    } else if (type === "track" && extra.recordTime) {
      html += buildStaticLapHTML(extra.recordTime, extra.recordDriver, extra.recordNote);
    }
    bodyEl.innerHTML = html;

    if (isLiveTrack) {
      loadFastestLap(slug);
    }

    lastFocused = document.activeElement;
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeModal() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  // Event delegation: works for any button added anywhere on the page,
  // including inside dynamically rendered cards.
  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-modal-type]");
    if (trigger) {
      e.preventDefault();
      openModal(
        trigger.getAttribute("data-modal-type"),
        trigger.getAttribute("data-modal-slug"),
        {
          driversNow: trigger.getAttribute("data-drivers-now"),
          recordTime: trigger.getAttribute("data-record-time"),
          recordDriver: trigger.getAttribute("data-record-driver"),
          recordNote: trigger.getAttribute("data-record-note")
        }
      );
    }
  });

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
  });
}
