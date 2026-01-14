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

## Documentation expansion & utilities (completed)

Major documentation improvements:

**New pages:**
- Concept page (`concept.html`) — Core concepts and system properties
- Scope & Limits page (`scope.html`) — Explicit boundaries and interpretation rules

**Navigation consolidation:**
- Consistent menu navigation across all docs pages (canonical sequence)
- Updated bottom navigation (docs-nav) to follow consistent sequence
- Added Concept and Scope & Limits to index.html menu
- Fixed I18N_PAGES mappings and added accessibility attributes

**Content improvements:**
- Updated "functional execution signals" description (added response stability)
- Added clarifying sentence about execution vs intelligence/aptitude
- Updated Scope & limits section in concept.html to point to scope.html
- Removed obsolete "not present" notes
- Fixed Norwegian translations

**Navigation enhancements:**
- Styled "Learn more" button as topbar CTA (pill button)
- Smart redirect for "Learn more" button (tracks last visited docs page)
- All doc pages track `fce_last_docs_page` for navigation continuity

**Documentation utilities:**
- Created shared copy-to-clipboard utility (`docs.js`) with double-binding protection
- Added copy-ready blocks to Concept and About pages (EN/NO)
- Standardized utility-header pattern across all copy blocks
- Deduplicated copy logic: removed duplicate code, now uses shared docs.js
- All doc pages updated to include docs.js script

This work expands documentation coverage, improves navigation consistency, and provides reusable patterns for future copy-ready content blocks.

---

## v0.2.7 — Explanatory clarity & visual documentation (completed)

Shipped improvements:
- Baseline-relative visual explanation page (`baseline-relative.html`) with diagram
- Variability & recovery interpretation notes added to baseline-relative page
- Documentation navigation consolidation (contextual links from Concept, About, Norwegian Context)
- Copy-ready summaries with shared utility (docs.js)
- Diagram improvements: micro-labels, time direction clarity, visual anchoring
- No changes to measurement logic or scoring

Tagged as **v0.2.7**.

---

## v0.2.8 — Language support, UX improvements & bug fixes (completed)

Shipped improvements:

**Language support:**
- Added Lithuanian (LT) language support across core UI and all documentation pages
- Complete translation coverage: Home, History, all documentation pages, error messages, and session summaries
- Language selector updated to include LT option

**Session panel improvements:**
- Session panel now maintains fixed height and never expands as trials increase
- Trial list uses internal scrolling with visual emphasis on last 5 trials
- Fade overlay effect for older trials (still visible when scrolling)
- Auto-scroll only when user is near bottom (prevents interrupting manual scrolling)
- Home panel reordering: History preview now appears between Session and Baseline panels
- Smooth scroll for History panel on narrow screens when it becomes visible

**Navigation enhancements:**
- History back button: floating position with responsive breakpoints
- Button positioned in left gutter beside container on desktop/tablet
- Falls back to inline position on mobile (≤640px)
- Button remains visible and accessible while scrolling
- Robust back navigation even when history is cleared

**Test type defaults:**
- Go/No-Go test type now defaults to 20 trials when selected (recommended for stable results)
- Reaction Time and Divided Attention remain at 10 trials
- Users can still manually adjust trial count

**Bug fixes:**
- Fix extra trial bug: prevent recording more than totalTrials trials (was recording 11 instead of 10 on rapid clicks)
- Fix button state after invalid sessions: ensure 'Run Functional Check' button correctly disabled
- Fix Training mode summary display: Divided Attention Training no longer shows summary (consistent with other test types)
- Fix language selector consistency: LT option now appears in HTML across all pages, selector syncs correctly after fallback, localStorage key unified (`fce_lang`) between index.html and docs pages

Tagged as **v0.2.8**.

---

## v0.2.9 — UX improvements, History enhancements, and onboarding (completed)

Shipped improvements:

**First-time onboarding:**
- Onboarding overlay dialog asking "Have you used FCE before?"
- No → navigate to how-tests-work.html, Yes → hide overlay and scroll to instrument
- Reset onboarding button in footer
- State persistence using localStorage

**Per-test hints:**
- "What to do" panel above controls with dynamic test-specific instructions
- Updates automatically when test type or language changes
- Complete EN/NO/LT translation support

**New documentation page:**
- how-tests-work.html with procedural instructions for each test type
- Includes error definitions, practice recommendations
- Menu item added to all pages

**History card enhancements:**
- Expandable summary + details pattern with click/keyboard toggle
- Semantic chip coloring (avg, SD, trials) based on status
- Mode-aware badges: Check sessions show status colors, Baseline/Training show neutral
- Quality displayed as colored badge
- Per-trial breakdown with Show/Hide trials button
- Lightweight trialLog stored in session records
- Preserve expanded state across language changes

**Navigation improvements:**
- Home history preview: clicking item navigates to History with card expanded
- History back button: restores previous view and exact scroll position

**Translation completeness:**
- Complete Lithuanian translation coverage for all UI elements
- Add missing translations: baseline info, history messages, trial outcomes
- Fix modeLabel() to use translation system
- Fix badge text to use translation system

**Styling:**
- Semantic chip variants (.chip.ok, .chip.warn, .chip.bad, .chip.na)
- Trial list styling with monospace outcome display
- Improved badge.na opacity

**Post-release fixes:**
- Onboarding: Added language selector to overlay for language change before committing
- Documentation: Fixed canonical navigation order (How to Use → How the tests work → FAQ)
- History: Fixed expanded state preservation across language changes for all test types (Go/No-Go and Divided Attention now work correctly)

Tagged as **v0.2.9**.

---

## v0.3.0 — Precision (Target Pointing) test (completed)

Shipped improvements:

**New test type:**
- Precision (Target Pointing) test implementation
- Fullscreen test environment with consensual fullscreen request
- Prep overlay with language selector
- Random target placement with variable sizes
- Trial-by-trial feedback (hit/miss/timeout)
- HUD with trial counter, feedback messages, exit button
- Baseline and check mode support
- Training mode support
- Full History integration with per-trial breakdown

**Fullscreen UX:**
- Consensual fullscreen with prep overlay
- Graceful fallback to windowed mode
- Clear fullscreen notices (unavailable, exited)
- Single Esc key press exits fullscreen and resets test
- Cross-browser fullscreen API support

**Event handling:**
- Fixed pointer handler attachment after reset (event delegation on document)
- Fixed handler not working after language changes
- Fixed Esc key race condition (single press now works)
- Proper event listener cleanup to prevent memory leaks
- Fixed target visibility issues after reset

**Internationalization:**
- Complete Precision test translations (EN/NO/LT)
- Fullscreen notices, feedback messages, invalid session messages
- Comprehensive History section translations
- Quality badge language-safety (key-based mapping)
- Lithuanian translations for baseline quality warnings

Tagged as **v0.3.0**.

---

## v0.3.1 — Precision refinements and UX improvements (completed)

Shipped improvements:
- **Trial count defaults:** Baseline mode defaults to 25 trials, Check/Training default to 15
- **Trend display:** Removed "ms" unit from Precision trend delta lines (error distance is unitless)
- **Target placement safety:** Exit button exclusion zone prevents targets near exit button
- **Divided Attention legend:** Moved to "What to do" panel with color coding
- **Translation fixes:** Fixed Lithuanian "NESPĮKITE" → "NESPAUSKITE"

Tagged as **v0.3.1**.

---

## v0.3.2 — Unified navigation and Precision history polish (completed)

Shipped improvements:
- **Unified topbar brand link:** Clickable "FCE" with hover text swap to localized "To the instrument"
- **Scroll position restoration:** Canonical doc pages remember and restore scroll position
- **Precision history polish:** 3-chip summary (Accuracy, Consistency SD, Hits), grouped details sections, explicit baseline comparison text
- **Topbar layout fixes:** Centered page title, prevented purple visited links, overlay-based text swap (no reflow)
- **Hamburger menu enhancements:** Hover/active affordances with subtle press feedback
- **Tightened hover condition:** Brand link text swap only on true hover devices (desktop), completely hidden on touch devices
- **"Why this exists" page:** New documentation page explaining FCE's philosophy
- **Learn More restriction:** Only redirects to canonical doc pages (excludes why.html)
- **Learn More first-time redirect:** First-time visitors always directed to About page for proper onboarding
- **Precision documentation:** Added Precision test documentation to how-tests-work.html, faq.html, and about.html
- **Small screen optimization:** Learn More button hidden on screens ≤480px to prevent topbar crowding
- **Precision trial count fix:** Fixed default trial count (now 25 instead of 10 when switching test types)
- **GitHub Pages optimization:** Added `.nojekyll` file for faster deployment

Tagged as **v0.3.2**.

---

## v0.3.x — Refinements (in progress)

Scope: stabilization, clarity, and robustness of existing functionality.
No new paradigms are introduced in this version line.

Planned focus areas:
- Precision test refinements:
  - Consistent hit-radius and timeout handling
  - Minor HUD clarity improvements
- UX refinements:
  - Clearer invalid-session explanations
  - Small wording improvements in summaries and quality labels
- Performance and reliability:
  - Event handling cleanup
  - Minor performance optimizations
- Export improvements:
  - Optional CSV export (same schema as JSON)
  - Clearer timestamp labeling

v0.3.x is considered complete when Precision behavior is stable across devices
and no usability regressions remain.

---

## v0.4 — Synthesis & interpretation layer (planned)

Purpose: improve readability, interpretation, and usefulness of existing data,
without changing the underlying measurement philosophy.

Planned directions (non-binding):
- Multi-task overview:
  - At-a-glance summary of all tests in a session
  - Optional composite indicator (explicitly non-diagnostic)
- Trend visualization:
  - Baseline stability over time
  - Check vs baseline comparison across sessions
- Context-aware review:
  - Filtering and grouping by sleep, stress, or other metadata
  - Metadata remains descriptive only (no scoring impact)
- Export & sharing:
  - Structured CSV export
  - Printable single-session report (HTML-first)

v0.4 does not introduce accounts, cloud storage, diagnostics,
or automated decision-making.