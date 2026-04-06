/**
 * Expandable hamburger menu sections (Core Docs / Context & Development).
 * Collapsed by default; opens the section that contains the current page.
 */
(function () {
  if (window.__FCE_MENU_SECTIONS__) return;
  window.__FCE_MENU_SECTIONS__ = true;
  function currentPageFile() {
    let p = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (!p || p === "") p = "index.html";
    return p;
  }

  var CORE_PAGES = {
    "about.html": true,
    "concept.html": true,
    "what-fce-measures.html": true,
    "scope.html": true,
    "how-to-use.html": true,
    "how-tests-work.html": true,
    "faq.html": true,
    "baseline-relative.html": true
  };

  var CONTEXT_PAGES = {
    "why.html": true,
    "applications.html": true,
    "validation-research.html": true,
    "norwegian-context.html": true
  };

  function setSectionOpen(sectionEl, open) {
    if (!sectionEl) return;
    var toggle = sectionEl.querySelector(".menu-section-toggle");
    sectionEl.classList.toggle("is-open", !!open);
    if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function init() {
    document.querySelectorAll(".menu-section").forEach(function (section) {
      var toggle = section.querySelector(".menu-section-toggle");
      if (!toggle) return;
      toggle.addEventListener("click", function () {
        var open = !section.classList.contains("is-open");
        setSectionOpen(section, open);
      });
    });

    var p = currentPageFile();
    if (CORE_PAGES[p]) {
      setSectionOpen(document.getElementById("menuSectionCore"), true);
    }
    if (CONTEXT_PAGES[p]) {
      setSectionOpen(document.getElementById("menuSectionContext"), true);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
