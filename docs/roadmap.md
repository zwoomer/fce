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

## v0.3.x — Refinements (completed)

Closed at **v0.3.3**: Precision stability, CSV export, formatting, invalid-session UX, documentation boundaries, visual marks, mobile History layout. No new test paradigms in this line.

Status: ✅ Complete (tag **v0.3.3**)

---

## v0.4.0 — Interpretation layer & documentation IA (completed)

Focus: clearer interpretation copy in the instrument, grouped docs navigation, new doc pages, and repo hygiene.

**Shipped:**
- Shared compare logic across home History preview, History, and Trend; readable baseline + recent-checks trend UI (EN/NO/LT)
- Onboarding copy and scroll targets (`#instruction` / `#instrument` alignment)
- Grouped hamburger menu (Core vs Context), `menu-sections.js`, `applications.html`, `validation-research.html` (validation / research page), **What FCE Measures** in IA
- Docs-nav flow and responsive long-label layout; footer attribution
- **`docs/summary.md`** shareable concise overview; README intro cross-link
- Release notes archived under `docs/releases/` for older versions; root SVG marks removed (follow-up: preview/favicon paths)

**Still local-only, baseline-relative, human-interpreted.**

Status: ✅ Shipped (see `RELEASE_v0.4.0.md`)

---

## v0.4.1 — Instrument UX hardening & backup/import (completed)

Focus: structured session output, local backup/import UX, canonical v2 store contract, invalid-session summary guards, precision History i18n.

**Shipped:**
- Full FCE store backup + import preview/apply; last-backup line; canonical v2 validation and preview summary
- Structured check/baseline summaries; baseline integrity panel copy
- Invalid/not-usable checks do not foreground baseline comparison; trend/history guards aligned
- Merged `history.precision` translations (EN/NO/LT); LT not-usable label fix

**Still local-only, baseline-relative, human-interpreted.**

Status: ✅ Shipped (see `RELEASE_v0.4.1.md`)

---

## v0.4.x — Synthesis & trends (planned)

Focus: deeper longitudinal insight and reporting, without automated judgment.

- Multi-task or cross-session summary views (non-diagnostic)
- Richer trend visualization (baseline stability, check comparisons over time)
- Metadata filtering / grouping (sleep, stress, notes — descriptive only)
- Printable session report; optional export polish (CSV exists since v0.3.3)
- Restore or relocate mark SVG assets if required for deployment

Status: 🧭 Next
