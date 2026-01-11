(function () {
  async function copyTextFromSelector(selector) {
    const el = document.querySelector(selector);
    if (!el) return false;
    const text = (el.innerText || el.textContent || "").trim();
    if (!text) return false;

    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.top = "-1000px";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
      } catch {
        return false;
      }
    }
  }

  function setCopyStatus(lang, msg) {
    const status = document.querySelector(`[data-copy-status="${lang}"]`);
    if (!status) return;
    status.textContent = msg;
    clearTimeout(status._t);
    status._t = setTimeout(() => { status.textContent = ""; }, 1800);
  }

  function detectLangFromContext(el) {
    if (el.closest(".lang-lt")) return "lt";
    if (el.closest(".lang-no")) return "no";
    return "en";
  }

  function setTempCopiedState(btn, lang) {
    const icon = btn.querySelector(".copy-icon");
    const label = btn.querySelector(".copy-label");

    const origIcon = icon ? icon.textContent : null;
    const origLabel = label ? label.textContent : null;

    btn.classList.add("is-copied");
    if (icon) icon.textContent = "✅";
    if (label) {
      if (lang === "no") label.textContent = "Kopiert";
      else if (lang === "lt") label.textContent = "Kopijuota";
      else label.textContent = "Copied";
    }

    clearTimeout(btn._copyT);
    btn._copyT = setTimeout(() => {
      btn.classList.remove("is-copied");
      if (icon && origIcon != null) icon.textContent = origIcon;
      if (label && origLabel != null) label.textContent = origLabel;
    }, 1500);
  }

  // Prevent double-binding if docs.js is included twice by mistake
  if (window.__FCE_COPY_BINDINGS__) return;
  window.__FCE_COPY_BINDINGS__ = true;

  document.querySelectorAll("[data-copy-target]").forEach(btn => {
    // Avoid binding twice to same element
    if (btn.dataset.copyBound === "1") return;
    btn.dataset.copyBound = "1";

    btn.addEventListener("click", async () => {
      const target = btn.getAttribute("data-copy-target");
      const lang = detectLangFromContext(btn);

      const ok = await copyTextFromSelector(target);
      if (ok) {
        setTempCopiedState(btn, lang);
        if (lang === "no") setCopyStatus(lang, "Kopiert.");
        else if (lang === "lt") setCopyStatus(lang, "Kopijuota.");
        else setCopyStatus(lang, "Copied.");
      } else {
        if (lang === "no") setCopyStatus(lang, "Kunne ikke kopiere.");
        else if (lang === "lt") setCopyStatus(lang, "Nepavyko nukopijuoti.");
        else setCopyStatus(lang, "Could not copy.");
      }
    });
  });
})();