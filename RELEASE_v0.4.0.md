**Release date:** 2026-04-06  
**Status:** Stable

---

## Overview

FCE v0.4.0 is an **interpretation, history clarity, and documentation architecture release**. It tightens how baseline-relative signals are explained in the instrument (History home preview, Trend panel, and shared comparison logic), improves first-run and returning-user onboarding scroll targets, reorganizes the static documentation site around **Core Docs** vs **Context & Development**, and adds new doc pages for **What FCE Measures**, **Applications / Use Contexts**, and **Validation / Research** (validation stance and research directions, EN/NO/LT).

Repository housekeeping moves older release notes under `docs/releases/` and removes the canonical SVG mark files from the repository root (see **Repository housekeeping**).

v0.4.0 maintains full backward compatibility for stored sessions and baselines. No change to core measurement philosophy: **human interpretation remains primary**.

---

## 🧭 Interpretation layer & History clarity

### Shared comparison logic

- **Single source of truth:** Home History preview, History cards, and the Trend view use aligned baseline loading, valid-session filtering, and deviation-based status where applicable.
- **Precision-aware units:** Reaction, Go/No-Go, and Divided Attention use milliseconds; Precision uses normalized error (no `ms` suffix) consistently in summaries and trend copy.
- **Status labels:** Home preview and trend listings prefer stored `statusText` when present; otherwise recompute from baseline mean/SD when a valid baseline exists.

### Trend panel (History view)

- **Readable baseline header:** Explains “typical” value, variation (±SD when available), and short interpretive guidance (localized EN/NO/LT).
- **Recent checks list:** Lists recent check sessions with status aligned to the same compare logic used elsewhere.
- **Empty and edge states:** Clear messaging when no baseline exists yet or no checks are available.

### Internationalization

- **Trend strings:** Expanded `trend.*` keys for baseline header, typical labels per test type, variation line, guide text, invalid/ok badges, and footer note (EN/NO/LT).

### Styling

- **History / trend UI:** Supporting CSS for trend list, home history preview layout, and related chips (see `style.css`).

---

## 🏠 Onboarding & instrument entry

- **Copy:** First-run onboarding messaging clarified (EN/NO/LT).
- **Scroll targets:** After returning-user onboarding, the view scrolls to **`#instruction`** first; deep-link alignment with **`#instrument`** preserved where applicable.
- **`index.html`:** Structure updates to support instruction anchor and onboarding flow.

---

## 📚 Documentation site architecture

### Grouped hamburger menu

- **Sections:** Top-level **Home** and **History** unchanged; **Core Docs** and **Context & Development** are expandable groups (not links).
- **Core Docs:** About, Concept, What FCE Measures, Scope & Limits, How to Use, How the tests work, FAQ.
- **Context & Development:** Why this exists, Applications / Use Contexts, Validation / Research.
- **Behavior:** Sections collapsed by default; the section containing the current page opens automatically. Section toggles update **`aria-expanded`**. Language switching (EN/NO/LT) applies to section titles and nested labels.
- **`menu-sections.js`:** Shared, idempotent initializer for toggles and initial open state.

### New and updated pages

- **`what-fce-measures.html`:** Integrated into the Core Docs reading order and navigation.
- **`applications.html`:** Full content describing use contexts, boundaries, and institutional constraints (EN/NO/LT).
- **`validation-research.html`:** Validation stance, defined constructs, threshold limitations, ecological validity (including limits of cross-context “functional readiness” criteria), and research directions (EN/NO/LT), with consistent chrome.

### Readme alignment

- **`README.md`:** Under **What FCE measures**, adds **Deviation signals and validation** — deviation thresholds (e.g. 1SD / 2SD) as practical change signals, not calibrated real-world capability indicators; FCE not yet validated against real-world performance outcomes.

### Docs bottom navigation (`docs-nav`)

- **Reading order:** FAQ → **Why this exists** → **Applications / Use Contexts** → **Validation / Research** (forward); instrument link remains centered.
- **Long labels:** Buttons allow text wrap; narrow viewports stack full-width to avoid overlap (e.g. Lithuanian strings).

### Footers

- **Attribution:** All doc footers and both `index.html` footers include **Designed and built by Zwoomer** under the FCE tagline.
- **Simplified tagline:** Footer no longer duplicates a link to Why (menu covers that path).

### Instrument menu & deep links

- **`index.html`:** Canonical docs list extended for Learn-more / last-page behavior to include new doc filenames where applicable.

---

## 🗂️ Repository housekeeping

### Release note archives

- **Moved:** `RELEASE_v0.2.9.md`, `RELEASE_v0.3.0.md`, and `RELEASE_v0.3.1.md` → `docs/releases/` (same content, clearer layout).
- **`RELEASE_v0.3.3.md`:** Minor maintenance edits.

### SVG mark files and preview page removed from root

- **Removed from repository root:** `fce-mark.svg`, `fce-icon.svg`, `fce-mark-state.svg` (superseded / relocated outside this tree in this revision).
- **`svg-preview.html`:** Removed from the repository in the same hygiene pass (it only referenced the deleted root SVGs). Restore marks + a preview page, or host favicon/mark assets elsewhere, if you need them again.

---

## 📝 Technical details

### Changed files (high level)

- **`app.js`:** Interpretation/trend/home-preview logic, i18n additions, onboarding scroll behavior.
- **`index.html`:** Onboarding, instruction anchor, History trend card, footers, grouped menu, canonical doc list.
- **`style.css`:** Trend/home history styles; docs-nav flex/wrap/stack rules; footer attribution line.
- **Doc HTML:** Menu sections, `menu-sections.js` script tag, docs-nav, footers across pages; `validation-research.html` expanded with full validation stance copy (EN/NO/LT).
- **Removed:** `svg-preview.html` (depended on root SVG marks).

### New files

- `menu-sections.js`
- `applications.html`
- `validation-research.html`
- `RELEASE_v0.4.0.md` (this note)

### Planning & readme

- `README.md` — latest release, v0.4.0 changelog section, History & trends note, planned development
- `docs/next-steps.md` — v0.3.x closure, v0.4.0 shipped, v0.4.x next
- `docs/roadmap.md` — v0.3.x complete, v0.4.0 shipped, v0.4.x planned

---

## 🔄 Backward compatibility

- **Sessions and baselines:** Existing local data remains valid; no migration required.
- **Privacy model:** Unchanged (local-first, no accounts).

---

## 🚀 Next steps

Further v0.4.x work may include:

- Restoring or relocating canonical SVG marks and optional mark preview page if needed
- Extending **Validation / Research** with empirical results or citations when available
- Deeper multi-test synthesis views (if aligned with non-diagnostic, human-led interpretation)
- Optional printable / export-oriented reporting (CSV already shipped in v0.3.3)

v0.4.x continues to exclude accounts, cloud sync, diagnostics, and automated decisions.
