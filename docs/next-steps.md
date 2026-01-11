# Next steps

## v0.2.3 — Completed (frozen)

Shipped features across v0.2.0–v0.2.3:
- Divided Attention (dual-task) module
- Clear mode authority (Baseline / Check / Training via action buttons)
- Context treated as metadata only (sleep, stress, note)
- Consistent baseline filtering (invalid sessions excluded everywhere)
- Session quality labels + refusal codes
- Device consistency warning (non-blocking)
- UI polish pass (CSS-only)
- Documentation split into standalone HTML pages
- Hybrid navigation (SPA instrument + doc pages)
- Direct History deep-linking
- Shared language preference across all pages

This version line is frozen and tagged up to **v0.2.3**.

---

## v0.2.4 — Refinement-only UX polish (completed)

Shipped improvements:
- Performance micro-optimization: add `defer` to app.js script tag
- Context panel: pre-action metadata behavior (visible before session, hidden during)
- Navigation clarity: menu toggle on all docs pages, close button, accessibility improvements
- Topbar enhancements: page labels (Home/History/docs), scroll-based hiding on docs pages
- Language selector: dropdown (replacing toggle buttons) for better UX and scalability
- Menu translations: all menu items translated (Home, History, About, etc.)
- History menu availability: context-aware across all pages based on selected test type
- Home page updates: title/description, "Learn more" moved to topbar
- Internal cleanup: consistent language handling, CSS organization, accessibility attributes

No test logic changes. This version line is frozen and tagged up to **v0.2.4**.

---

## v0.2.5 — Critical bug fixes (completed)

Shipped bug fixes:
- Fix race condition in session completion (prevent duplicate sessions from rapid clicks)
- Fix extra trial registration (11 instead of 10 when clicking rapidly)
- Fix training mode button state update (ensure 'Run Functional Check' button correctly disabled after training)

These fixes address critical data integrity issues and UI state consistency problems. Tagged as **v0.2.5**.

---

## v0.3 — Exploratory (future)

Potential directions (not commitments):
- Additional attention or switching paradigms
- Expanded trend visualizations
- Export schema stabilization
- Research-oriented documentation

All future work remains baseline-relative and human-interpreted.
