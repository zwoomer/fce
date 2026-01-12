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

## Documentation expansion & utilities (completed)
- New documentation pages: Concept (`concept.html`) and Scope & Limits (`scope.html`)
- Navigation consolidation: consistent menu and bottom navigation across all docs pages
- Content improvements: updated descriptions, added clarifications, fixed translations
- Navigation enhancements: styled "Learn more" CTA, smart redirect, page tracking
- Documentation utilities: shared copy-to-clipboard utility (`docs.js`), copy-ready blocks, standardized patterns

Status: ✅ Shipped

---

## v0.2.7 — Explanatory clarity & visual documentation (completed)
- Baseline-relative visual explanation page (`baseline-relative.html`) with diagram
- Variability & recovery interpretation notes
- Documentation navigation consolidation (contextual links)
- Copy-ready summaries with shared utility
- Diagram improvements: micro-labels, time direction clarity, visual anchoring
- No changes to measurement logic or scoring

Status: ✅ Shipped

---

## v0.2.8 — Language support, UX improvements & bug fixes (completed)
- Lithuanian (LT) language support: complete translation coverage across UI and documentation
- Session panel improvements: fixed-height scrolling, visual emphasis on recent trials, fade overlay
- Home panel reordering: History preview between Session and Baseline
- Navigation enhancements: floating History back button with responsive positioning
- Test type defaults: Go/No-Go defaults to 20 trials, others remain at 10
- Bug fixes: extra trial recording, button state after invalid sessions, Training mode summary consistency

Status: ✅ Shipped

---

## v0.3 — Research expansion (exploratory)
- Additional paradigms
- Deeper trend analysis
- Export and documentation enhancements

Status: 🧭 Exploratory