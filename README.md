# FCE — Functional Cognition & Execution

FCE is a **baseline-relative functional assessment instrument** for measuring cognitive and execution performance over time.

Rather than comparing users to population averages, FCE compares performance **against the individual’s own baseline**, under consistent conditions, on the same device.

FCE is designed to support **human interpretation**, not automated judgment.

---

## Current status

**Latest release:** v0.3.2  
**Status:** Stable (documentation & explanation complete)

---

## What FCE measures (v0.3.x)

### 1) Reaction Time
Measures simple response speed and consistency.

- Average reaction time (ms)
- Variability (SD)
- False starts
- Personal baseline and deviation-based status

---

### 2) Go / No-Go
Measures inhibitory control under time pressure.

- GO response speed (avg / SD)
- Misses
- False alarms
- False starts
- Baseline-relative evaluation

---

### 3) Divided Attention (dual-task)
Measures execution quality under split attention.

Primary task:
- Go / No-Go execution (speed + inhibition)

Secondary task:
- Visual count (brief blue flashes during trials)

Evaluation combines:
- Reaction speed
- Inhibitory control
- Attention accuracy

The overall status reflects the **worst deviation** among these signals.

---

### 4) Precision (Target Pointing)
Measures fine motor control and spatial accuracy.

- Error distance (normalized)
- Mean error and standard deviation
- Reaction time
- Hit/miss/timeout rates
- Baseline-relative evaluation

---

## Modes of use

FCE supports three explicit session modes:

- **Baseline** — establish personal normal performance
- **Check** — compare current performance to baseline
- **Training** — practice only (never updates baseline)

**Mode is determined solely by the action button clicked**, not by settings or context.

---

## Context metadata

Optional context fields are saved with each session:

- Sleep
- Stress
- Note

Context is **metadata only** and **does not affect scoring or comparison**.  
It exists to support later human interpretation.

---

## Integrity & clarity (v0.2.1)

- Standardized refusal codes (why a session is not usable)
- Session quality labels (Good / Mixed / Not usable)
- Non-blocking device consistency warnings for check-mode

No changes to scoring philosophy.

---

## UI polish (v0.2.2)

- Calmer, smoother UI (cards, buttons, chips/badges)
- Improved dark-theme readability (select/options)
- CSS-only changes (no logic changes)

---

## Documentation & navigation (v0.2.3)

- Documentation split into standalone pages:
  - About
  - Norwegian Context
  - How to Use
  - FAQ
- Hybrid navigation:
  - Instrument remains SPA (Home + History)
  - Docs are normal HTML pages
- Direct History deep-linking (`index.html?view=history`)
- Shared language preference across all pages
- Cleaner, smaller `index.html` focused only on the instrument

---

## Refinement-only UX polish (v0.2.4)

- Performance micro-optimization: add `defer` to app.js script tag
- Context panel: pre-action metadata behavior (visible before session, hidden during)
- Navigation clarity: menu toggle on all docs pages, close button, accessibility improvements
- Topbar enhancements: page labels (Home/History/docs), scroll-based hiding on docs pages
- Language selector: dropdown (replacing toggle buttons) for better UX and scalability
- Menu translations: all menu items translated (Home, History, About, etc.)
- History menu availability: context-aware across all pages based on selected test type
- Home page updates: title/description, "Learn more" moved to topbar
- Internal cleanup: consistent language handling, CSS organization, accessibility attributes

No test logic changes.

---

## Critical bug fixes (v0.2.5)

- Fix race condition in session completion (prevent duplicate sessions from rapid clicks)
- Fix extra trial registration (11 instead of 10 when clicking rapidly)
- Fix training mode button state update (ensure 'Run Functional Check' button correctly disabled after training)

---

## Documentation expansion & utilities (v0.2.6)

### New documentation pages
- **Concept page** (`concept.html`) — Core concepts, baseline-relative measurement, system properties
- **Scope & Limits page** (`scope.html`) — Explicit boundaries, interpretation rules, institutional constraints

### Navigation consolidation
- Consolidated menu navigation across all documentation pages (canonical sequence: About → Concept → Scope → Norwegian Context → How to Use → FAQ)
- Added Concept and Scope & Limits to index.html menu
- Updated bottom navigation (docs-nav) to follow consistent sequence
- Fixed I18N_PAGES mappings for all pages
- Added `aria-current="page"` attributes for accessibility

### Content improvements
- Updated "functional execution signals" description (added response stability)
- Added clarifying sentence separating FCE from intelligence/aptitude assessments
- Updated Scope & limits section in concept.html to point to scope.html
- Removed obsolete "not present" notes from all documentation pages
- Fixed Norwegian translations (e.g., "Lære mer" → "Les mer")

### Navigation enhancements
- Styled "Learn more" button as topbar CTA (pill button with hover effects and arrow)
- Implemented smart redirect for "Learn more" button (tracks last visited docs page)
- All doc pages track `fce_last_docs_page` for navigation continuity

### Documentation utilities
- Shared copy-to-clipboard utility (`docs.js`) for all documentation pages
- Copy-ready blocks added to Concept and About pages (EN/NO)
- Standardized utility-header pattern with tooltip, icon, and status feedback
- Code deduplication: removed duplicate copy logic from individual pages

---

## Explanatory clarity & visual documentation (v0.2.7)

- Baseline-relative visual explanation page (`baseline-relative.html`) with diagram
- Variability & recovery interpretation notes
- Documentation navigation consolidation (contextual links from Concept, About, Norwegian Context)
- Copy-ready summaries with shared utility
- Diagram improvements: micro-labels, time direction clarity, visual anchoring
- No changes to measurement logic or scoring

---

## Language support, UX improvements & bug fixes (v0.2.8)

- **Lithuanian language support:** Complete translation coverage across core UI and all documentation pages
- **Session panel improvements:** Fixed-height scrolling, visual emphasis on recent trials, fade overlay for older trials
- **Home panel reordering:** History preview now appears between Session and Baseline panels
- **Navigation enhancements:** Floating History back button with responsive positioning (desktop/tablet/mobile)
- **Test type defaults:** Go/No-Go defaults to 20 trials when selected (recommended for stable results)
- **Bug fixes:** Extra trial recording prevention, button state consistency after invalid sessions, Training mode summary display consistency
- **Language selector consistency:** LT option appears in HTML across all pages, selector correctly syncs after fallback scenarios, unified localStorage key (`fce_lang`) ensures language preference persists correctly between index.html and docs pages

---

## UX improvements, History enhancements, and onboarding (v0.2.9)

- **First-time onboarding:** Overlay dialog asking "Have you used FCE before?" with Yes/No options and reset button
  - Language selector added to overlay so users can change language before committing
- **Per-test hints:** Dynamic "What to do" panel above controls with test-specific instructions (EN/NO/LT)
- **New documentation page:** how-tests-work.html with comprehensive procedural instructions for each test type
- **History card enhancements:**
  - Expandable summary + details pattern with click/keyboard toggle
  - Semantic chip coloring based on status (avg, SD, trials)
  - Mode-aware badges: Check sessions show status colors, Baseline/Training show neutral
  - Quality displayed as colored badge
  - Per-trial breakdown with Show/Hide trials button
  - **Fixed expanded state preservation across language changes for all test types**
- **Navigation improvements:**
  - Home history preview: clicking item navigates to History with card expanded and scrolled into view
  - History back button: restores previous view and exact scroll position
  - **Fixed canonical documentation navigation order:** How to Use → How the tests work → FAQ
  - Added "How the tests work" links to About page in all language versions
- **Translation completeness:** Complete Lithuanian translation coverage, fix modeLabel() and badge text to use translation system
- **Styling:** Semantic chip variants, trial list styling with monospace outcomes, improved badge visibility

---

## Precision (Target Pointing) test (v0.3.0)

- **New test type:** Precision (Target Pointing) test with fullscreen UX
- **Fullscreen test environment:** Consensual fullscreen request with prep overlay
- **Random target placement:** Targets appear at random positions with variable sizes
- **Trial-by-trial feedback:** Immediate visual feedback (hit/miss/timeout)
- **HUD display:** Trial counter, feedback messages, exit button
- **Baseline-relative evaluation:** Baseline, Check, and Training mode support
- **Comprehensive i18n:** Complete translations for EN/NO/LT
- **History integration:** Full History card rendering with per-trial breakdown

---

## Precision refinements and UX improvements (v0.3.1)

- **Trial count defaults:** Baseline mode defaults to 25 trials, Check/Training default to 15
- **Trend display:** Removed "ms" unit from Precision trend delta lines (error distance is unitless)
- **Target placement safety:** Exit button exclusion zone prevents targets near exit button
- **Divided Attention legend:** Moved to "What to do" panel with color coding
- **Translation fixes:** Fixed Lithuanian "NESPĮKITE" → "NESPAUSKITE"

---

## Unified navigation and Precision history polish (v0.3.2)

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

---

## History & trends

- Per-test session history
- Mode-aware filtering (Baseline / Check / Training)
- Clear handling of invalid or low-quality sessions
- Minimal trend view showing:
  - Baseline band (±1 SD)
  - Recent check sessions

---

## Data & privacy

- Local-only storage (no accounts, no servers)
- Manual JSON export only
- Exported data is raw session data — no conclusions generated

---

## Non-goals

FCE is **not**:

- A medical or legal diagnostic tool
- A substance detection system
- A population-norm assessment
- A decision engine

Interpretation and decisions remain human-led.

---

## Intended use

FCE is suitable for:

- Functional self-monitoring
- Performance and fatigue research
- Traffic and workplace safety discussions
- Pilot studies and institutional evaluation

---

## Versioning

- v0.1 — core baseline-relative instrument
- v0.2.0 — Divided Attention & mode coherence
- v0.2.1 — Integrity & clarity pass
- v0.2.2 — UI polish (CSS-only)
- v0.2.3 — Documentation & navigation split
- v0.2.4 — Refinement-only UX polish
- v0.2.5 — Critical bug fixes
- v0.2.6 — Documentation expansion & utilities
- v0.2.7 — Explanatory clarity & visual documentation
- v0.2.8 — Language support, UX improvements & bug fixes
- v0.2.9 — UX improvements, History enhancements, and onboarding
- v0.3.0 — Precision (Target Pointing) test with fullscreen UX
- v0.3.1 — Precision refinements and UX improvements
- v0.3.2 — Unified navigation and Precision history polish

---

## Planned development

Future development will proceed in two stages:

### v0.3.x — Refinement
Short-term focus on stabilizing the Precision test, improving clarity,
and polishing UX without adding new paradigms.

### v0.4 — Interpretation & trends
Medium-term focus on synthesis, trend visualization, and improved export/reporting,
while preserving FCE's baseline-relative and privacy-first design.

No future version will introduce:
- Accounts or cloud storage
- Medical or legal claims
- Automated judgments or decisions
