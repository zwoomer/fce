**Release date:** 2026-01-11  
**Status:** Stable

---

## Overview

FCE v0.2.6 is a **documentation expansion and utilities release**.

The core functional assessment instrument remains unchanged.  
This release expands documentation coverage with new pages, improves navigation consistency, and introduces reusable utilities for copy-ready content blocks.

v0.2.6 maintains full backward compatibility and does not alter any test logic, scoring algorithms, or data storage.

---

## 📚 New documentation pages

### Concept page (`concept.html`)

A new standalone page explaining the core concepts of FCE:

- What FCE is and what problem it solves
- Why baseline-relative measurement matters
- How FCE works at a high level
- Integrity and refusal logic
- System properties and scope boundaries

Includes a copy-ready concept summary (EN/NO).

---

### Scope & Limits page (`scope.html`)

A new standalone page providing explicit boundaries and interpretation rules:

- What FCE does and does not do (explicit non-goals)
- Interpretation rules (history-first, device consistency, context matters)
- Refusal and integrity logic
- Institutional use constraints
- Copy-ready disclaimer statements (EN/NO)

---

## 🧭 Navigation consolidation

### Consistent menu navigation

- All documentation pages now follow the same menu order:
  - About → Concept → Scope & Limits → Norwegian Context → How to Use → FAQ
- Menu items added to index.html to match documentation structure
- Added `aria-current="page"` attributes for accessibility

### Bottom navigation (docs-nav)

- Updated to follow canonical sequence across all pages
- Consistent left/right navigation flow
- "Open instrument" button remains in center position

### I18N_PAGES mappings

- Fixed and standardized page title mappings for all documentation pages
- Corrected Norwegian translation for "Scope & Limits" (Omfang & begrensninger)
- Ensured consistent language switching across all pages

---

## ✏️ Content improvements

### Updated descriptions

- **"Functional execution signals"**: Added "response stability" to the list of measured aspects
- **Execution vs intelligence**: Added clarifying sentence separating FCE from intelligence/aptitude assessments
- **Scope & limits**: Updated concept.html section to point to scope.html instead of duplicating content

### Translation fixes

- Fixed Norwegian translation: "Lære mer" → "Les mer" (Learn more)
- Removed obsolete "not present" notes from all documentation pages

---

## 🎯 Navigation enhancements

### "Learn more" button

- Styled as topbar CTA (pill button with hover effects and arrow)
- Smart redirect: tracks last visited documentation page
- Redirects to last docs page, falls back to About page
- All documentation pages track `fce_last_docs_page` for navigation continuity

### Page tracking

- Dedicated `fce_last_docs_page` localStorage key for documentation pages
- Separates documentation navigation from general page tracking
- Supports smart redirect for "Learn more" button

---

## 🔧 Documentation utilities

### Shared copy-to-clipboard utility (`docs.js`)

- Centralized copy-to-clipboard functionality for all documentation pages
- Double-binding protection (`window.__FCE_COPY_BINDINGS__`)
- Per-element binding guard to prevent duplicate event listeners
- Supports modern Clipboard API with fallback for older browsers

### Copy-ready blocks

- Standardized utility-header pattern (`.card.copy-block`, `.card-utility`)
- Copy buttons with tooltip, icon (📋), and label ("Copy"/"Kopier")
- Visual feedback: ✅ icon and "Copied"/"Kopiert" label on success
- Status text with auto-clear after 1.8 seconds
- Accessible: `aria-label`, `aria-live="polite"` status spans

### Copy-ready content blocks

- **Concept page**: "Short concept summary" (EN/NO)
- **About page**: "One-paragraph overview" (EN/NO)
- **Scope page**: "Short disclaimer" (EN/NO, already present)

All copy blocks use the same reusable pattern and can be easily added to future pages.

---

## 🎨 Styling updates

### Copy button utility styles

- `.card-utility`: Flex layout for title + action button
- `.copy-btn`: Pill button with hover/active states, tooltip support
- `.copy-status`: Status text with muted styling
- `.is-copied`: Temporary visual feedback state

Styles are reusable across all documentation pages.

---

## 🔐 Safety & compatibility

- No changes to:
  - Test logic or scoring algorithms
  - Baseline computation or thresholds
  - History storage schema
  - Existing data or records
  - User workflows or session modes
  - Instrument functionality (`app.js`)

Backward compatibility is fully preserved.  
All existing sessions and baselines remain valid and unchanged.

---

## 🚫 Explicit non-goals

FCE v0.2.6 does **not**:
- Add new tests or assessment paradigms
- Modify scoring or interpretation logic
- Change data storage format
- Alter existing session data
- Change instrument behavior or workflows

This release focuses on **documentation, navigation, and utilities** — not on the core instrument.

---

## 🔖 Versioning

- v0.2.6 is a **minor release** in the v0.2 series
- Builds on:
  - v0.2.5 — Critical bug fixes
- Expands documentation coverage and improves maintainability

Future work continues under **v0.2.x** and **v0.3 planning**.

---