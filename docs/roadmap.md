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
- Language selector consistency: LT option in HTML across all pages, selector sync after fallback, unified localStorage key (`fce_lang`) for proper persistence between index.html and docs pages

Status: ✅ Shipped

---

## v0.2.9 — UX improvements, History enhancements, and onboarding (completed)
- First-time onboarding: overlay dialog with Yes/No options, reset button, language selector
- Per-test hints: dynamic "What to do" panel with test-specific instructions
- New documentation page: how-tests-work.html with procedural instructions
- History card enhancements: expandable summary/details, semantic chip coloring, mode-aware badges
- Per-trial breakdown: Show/Hide trials button with trial log display
- Navigation: Home history preview → History with auto-expand, back button scroll restoration
- Translation completeness: complete Lithuanian coverage, fix modeLabel() and badge text
- Styling: semantic chip variants, trial list styling, badge improvements
- Post-release: Fixed expanded state preservation across language changes for all test types
- Post-release: Fixed canonical documentation navigation order (How to Use → How the tests work → FAQ)

Status: ✅ Shipped

---

## v0.3.0 — Precision (Target Pointing) test (completed)
- Precision test implementation with fullscreen UX
- Consensual fullscreen with prep overlay
- Trial-by-trial feedback (hit/miss/timeout)
- Baseline and check mode support
- Comprehensive i18n (EN/NO/LT)
- History integration with per-trial breakdown
- Event handling fixes and memory leak prevention

Status: ✅ Shipped

---

## v0.3.1 — Precision refinements and UX improvements (completed)
- Trial count defaults: Baseline 25, Check/Training 15
- Trend display: Removed "ms" unit from Precision delta lines
- Target placement safety: Exit button exclusion zone
- Divided Attention legend: Moved to task hint panel with color coding
- Translation fixes: Lithuanian "NESPĮKITE" → "NESPAUSKITE"

Status: ✅ Shipped

---

## v0.3.2 — Unified navigation and Precision history polish (completed)
- Unified topbar brand link with hover text swap
- Scroll position restoration for canonical doc pages
- Precision history rendering polish (3-chip summary, grouped details)
- Topbar layout fixes (centered title, no purple visited links)
- Hamburger menu enhancements
- Tightened hover condition: brand link swap only on true hover devices
- "Why this exists" documentation page
- Learn More first-time visitor redirect (always About page on first visit)
- Precision test documentation updates (how-tests-work, faq, about pages)
- Small screen optimization (Learn More hidden on ≤480px)
- Precision trial count default fix (25 instead of 10)
- GitHub Pages deployment optimization (.nojekyll)

Status: ✅ Shipped

---

## v0.3.x — Refinements (in progress)

Focus: stabilization and tightening of existing functionality.

- ✅ Precision test calibration and edge-case handling (v0.3.3: input normalization, timeout handling)
- ✅ Pointer/touch robustness in fullscreen mode (v0.3.3: CSS pixel normalization)
- ✅ Clearer quality and invalid-session messaging (v0.3.3: standardized formatting, compact reason display)
- ✅ Minor UX consistency improvements (v0.3.3: Quality+Note formatting, summary visibility)
- ✅ Optional CSV export (v0.3.3: CSV export with deterministic timestamps)
- ✅ Documentation clarity and boundary reinforcement (v0.3.3: comprehensive content additions across all pages)
- ✅ Visual identity system (v0.3.3: canonical SVG marks, geometry optimized for favicon rendering)

No new tests or paradigms are introduced in v0.3.x.

Status: 🔄 In progress

---

## v0.4 — Synthesis & trends (planned)

Focus: interpretation, readability, and longitudinal insight.

- Multi-task session overview (summary-level interpretation)
- Visual trend graphs for baseline stability and check comparisons
- Session metadata filtering (sleep, stress, notes)
- Export and reporting improvements
- Documentation updates aligned with new views

v0.4 remains local-only, baseline-relative, and human-interpreted.

Status: 🧭 Exploratory