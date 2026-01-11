# FCE — Functional Cognition & Execution

FCE is a **baseline-relative functional assessment instrument** for measuring cognitive and execution performance over time.

Rather than comparing users to population averages, FCE compares performance **against the individual’s own baseline**, under consistent conditions, on the same device.

FCE is designed to support **human interpretation**, not automated judgment.

---

## Current status

**Latest release:** v0.2.7  
**Status:** Stable (documentation & explanation complete)

---

## What FCE measures (v0.2.x)

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

## Explanatory clarity & visual documentation (v0.2.7)

- Baseline-relative visual explanation page (`baseline-relative.html`) with diagram
- Variability & recovery interpretation notes
- Documentation navigation consolidation (contextual links from Concept, About, Norwegian Context)
- Copy-ready summaries with shared utility
- Diagram improvements: micro-labels, time direction clarity, visual anchoring
- No changes to measurement logic or scoring

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

Future work will continue under v0.2.x and v0.3 planning.
