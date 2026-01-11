# FCE Roadmap

## v0.1 — Baseline instrument (completed)
- Reaction Time
- Go / No-Go
- Baseline → Check → History → Trend loop
- Context tags
- Local-only data model

Status: ✅ Shipped (frozen)

---

## v0.2.0 — Divided Attention & coherence (completed)
- Divided Attention (dual-task, visual count)
- Explicit mode authority via action buttons
- Training mode (non-baseline)
- Baseline integrity fixes
- History clarity improvements
- Translation and UX consistency

Status: ✅ Shipped

---

## v0.2.1 — Integrity & clarity (completed)
- Session quality labels (Good / Mixed / Not usable)
- Standardized refusal semantics
- Device consistency warning (baseline vs check, non-blocking)

Status: ✅ Shipped

---

## v0.2.2 — UI polish pass (completed)
- Card/panel visual polish
- Buttons: hover/active/disabled + focus-visible
- Chips/badges with tabular numbers
- Calmer invalid-session styling
- Dark-theme select readability improvements

Status: ✅ Shipped (CSS-only)

---

## v0.2.3 — Documentation & navigation (completed)
- Standalone documentation pages
- Hybrid SPA + normal link navigation
- Direct History deep-linking
- Language preference sync across all pages
- Cleaned and reduced `index.html`

Status: ✅ Shipped

---

## v0.2.4 — Refinement-only UX polish (completed)
- Performance micro-optimization: add `defer` to app.js script tag
- Context panel: pre-action metadata behavior (visible before session, hidden during)
- Navigation clarity: menu toggle on all docs pages, close button, accessibility improvements
- Topbar enhancements: page labels (Home/History/docs), scroll-based hiding on docs pages
- Language selector: dropdown (replacing toggle buttons) for better UX and scalability
- Menu translations: all menu items translated (Home, History, About, etc.)
- History menu availability: context-aware across all pages based on selected test type
- Home page updates: title/description, "Learn more" moved to topbar
- Internal cleanup: consistent language handling, CSS organization, accessibility attributes

Status: ✅ Shipped

---

## v0.2.5 — Critical bug fixes (completed)
- Fix race condition in session completion (prevent duplicate sessions from rapid clicks)
- Fix extra trial registration (11 instead of 10 when clicking rapidly)
- Fix training mode button state update (ensure 'Run Functional Check' button correctly disabled after training)

Status: ✅ Shipped

---

## v0.3 — Research expansion (exploratory)
- Additional paradigms
- Deeper trend analysis
- Export and documentation enhancements

Status: 🧭 Exploratory