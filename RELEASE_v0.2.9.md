**Release date:** 2026-01-13  
**Status:** Stable

---

## Overview

FCE v0.2.9 is a **UX improvements, History enhancements, and onboarding release**.

This release adds a first-time onboarding experience, per-test hints, significant History card improvements with semantic styling and per-trial details, complete translation coverage, and enhanced navigation with scroll position restoration.

v0.2.9 maintains full backward compatibility and does not alter any test logic, scoring algorithms, or data storage.

---

## 🎓 First-time onboarding

### Onboarding overlay

- **Overlay dialog** appears on first visit asking "Have you used FCE before?"
- **No option:** Navigates to `how-tests-work.html` (new procedural documentation page)
- **Yes option:** Hides overlay, scrolls to instrument, marks onboarding complete
- **Reset button:** Added "Reset onboarding" button in footer to clear flag and re-show overlay
- **State persistence:** Uses `localStorage` flag (`fce_onboarding_done`) to remember completion
- **Accessibility:** Proper ARIA attributes, keyboard navigation support

The onboarding gate ensures new users understand how to use the instrument before their first session.

---

## 💡 Per-test hints panel

### "What to do" panel

- **Dynamic hints panel** appears above controls on Home view
- **Test-specific instructions:** Shows procedural instructions for the currently selected test type
- **Language-aware:** All hints translated (EN/NO/LT)
- **Auto-updates:** Hints change automatically when test type or language changes
- **Always visible:** Panel remains visible to guide users through each test type

Supports all three test types:
- **Reaction Time:** Click when the circle turns green
- **Go/No-Go:** Click on GO, don't click on NO-GO
- **Divided Attention:** GO/NO-GO rules + count blue flashes

---

## 📄 New documentation page

### How the tests work (`how-tests-work.html`)

New comprehensive procedural documentation page:

- **Introduction:** What to do overview
- **Test-specific sections:** Detailed instructions for each test type (Reaction Time, Go/No-Go, Divided Attention)
- **Error definitions:** Explanation of false starts, misses, false alarms, flash errors
- **Practice recommendation:** Encourages practice before baseline
- **Navigation:** "Open instrument" and "Back to How to Use" buttons
- **Full translation:** Complete EN/NO/LT support

**Menu integration:** "How the tests work" menu item added to all pages under "How to Use"

**Quick start callout:** Added to `how-to-use.html` linking to the new page

---

## 📊 History card enhancements

### Expandable summary + details pattern

- **Clickable cards:** Cards are now interactive with keyboard support (Enter/Space)
- **Summary view:** Compact view with key metrics as colored chips
  - Average reaction time
  - Standard deviation (SD)
  - Trial count
  - False alarms (Go/No-Go, Divided Attention)
  - Flash errors (Divided Attention)
- **Details view:** Expandable section showing:
  - Best/worst reaction times
  - Error counts and types
  - Baseline comparison
  - Context tags (sleep, stress)
  - Quality badge
  - Invalid reason (if applicable)
  - Per-trial breakdown
- **State preservation:** Expanded state persists across language changes

### Semantic chip coloring

Chips now reflect status with color coding:

- **Average chip:**
  - `bad` (red) if session is invalid
  - Status-based for check sessions (ok/warn/bad/na)
  - `na` (neutral) for baseline/training
- **SD chip:**
  - `ok` (green) if ≤ baseline SD × 1.25
  - `warn` (yellow) if ≤ baseline SD × 1.75
  - `bad` (red) if > baseline SD × 1.75
  - `na` (neutral) if no baseline SD available
- **Trials chip:**
  - `ok` if ≥ expected trials
  - `warn` if < expected trials
  - `na` if missing

### Mode-aware badges

- **Check sessions:**
  - Show status-based colors (`ok`/`warn`/`bad`) with status text
  - Compute badge from delta percentage when statusText missing
  - Never show random grey "OK" for check sessions
- **Baseline/Training sessions:**
  - Show neutral `na` badge with mode label
- **Invalid sessions:**
  - Always show `bad` class with "Invalid" text

### Quality badge

- Quality ("Good", "Mixed", "Poor") now displayed as colored badge:
  - `ok` (green) for "Good"
  - `warn` (yellow) for "Mixed"
  - `bad` (red) for "Poor"

### Per-trial breakdown

- **Show/Hide trials button:** Toggle per-trial details
- **Trial list:** Displays each trial with:
  - Trial number (#1, #2, etc.)
  - Outcome label (translated): Hit, GO, Miss, False Alarm, Correct Reject, False Start
  - Reaction time (ms) or "—" if not applicable
- **Empty state:** Shows "No trial data available" (translated) for old sessions without trial logs
- **Event handling:** Button click doesn't trigger card toggle (proper event propagation control)

### Trial log storage

- **Lightweight trial log:** Each session record now includes `trialLog` array
- **Compact format:** Stores trial number, outcome, and reaction time
- **Normalized outcomes:** Consistent outcome labels across all test types

---

## 🌐 Translation completeness

### Lithuanian translation fixes

- **Baseline info:** "No baseline sessions recorded", "No baseline available for comparison"
- **History messages:** "No history yet", "No trial data available"
- **Mode labels:** Baseline, Training mode names now use translation system
- **Quality issues:** "Many false starts", "Few valid hits"
- **Context tags:** Sleep, Stress labels
- **Reason label:** "Reason:" prefix
- **Trial outcomes:** Complete translation of all outcome labels (hit, go, miss, false_alarm, correct_reject, false_start, unknown)
- **Chip labels:** FA (False Alarms), Flash err (Flash Error) abbreviations
- **Flashes line:** "Flashes", "Target", "Answer", "Error" in history details

### Translation system improvements

- **modeLabel():** Now uses translation system instead of hardcoded strings
- **Badge text:** Uses `t("trend.ok")` and `t("trend.invalid")` instead of hardcoded text
- **Status messages:** All status text now properly translated

---

## 🧭 Navigation enhancements

### History preview → History navigation

- **Clickable items:** Home history preview items now navigate to History view
- **Auto-expand:** Clicked session card automatically expands with details visible
- **Auto-scroll:** Scrolls to the expanded card with proper topbar offset
- **Smooth experience:** Uses `data-session-id` attributes for reliable matching

### History back button improvements

- **Scroll restoration:** Back button now restores exact scroll position from previous view
- **View restoration:** Returns to the previous view (typically Home) at the scroll position where user left off
- **State persistence:** Uses `sessionStorage` to remember navigation state
- **Smooth restoration:** Uses `requestAnimationFrame` for proper timing
- **Works like docs pages:** Similar scroll restoration behavior as documentation pages

---

## 🎨 Styling improvements

### Semantic chip variants

- `.chip.ok` — Green border and background (good status)
- `.chip.warn` — Yellow border and background (warning status)
- `.chip.bad` — Red border and background (bad status)
- `.chip.na` — Neutral styling with reduced opacity

### Trial list styling

- **Monospace font:** Trial outcome labels use monospace for consistency
- **Grid layout:** Trial number, outcome, and reaction time in organized columns
- **Subtle borders:** Clean separation between trials
- **Accessible:** Proper spacing and contrast

### Badge improvements

- `.badge.na` opacity improved (0.7 → 0.8) for better visibility

---

## 🐛 Bug fixes

### Badge rendering

- Fixed badge class format: Changed from `badge-ok`/`badge-bad` to space-separated `badge ok`/`badge bad`/`badge na`
- Fixed badge text to use translation system instead of hardcoded "OK"
- Updated `clampBadgeClass()` to recognize Lithuanian status text

### Language switching

- Fixed history affordance text ("Click to view details") to update on language change
- Fixed trial toggle button text to update correctly without re-rendering entire history
- **Fixed expanded state preservation**: Changed from language-dependent timestamp matching to language-independent `data-session-id` attribute matching
  - Go/No-Go and Divided Attention cards now correctly preserve expanded state when language changes
  - All test types (Reaction Time, Go/No-Go, Divided Attention) now consistently preserve expanded state

### Event handling

- Fixed trial toggle button to prevent card re-rendering when toggling trial list
- Proper event propagation control (stopImmediatePropagation) to prevent unintended card toggles

### Onboarding

- Added language selector to onboarding overlay so users can change language before committing to Yes/No
- Language selector syncs with main language system and updates overlay text immediately

### Documentation navigation

- Fixed canonical navigation order: How to Use → How the tests work → FAQ
- Updated navigation links to follow correct sequential order across all pages
- Added "How the tests work" links to About page in all language versions

---

## 🔐 Safety & compatibility

- No changes to:
  - Test logic or scoring algorithms
  - Baseline computation or thresholds
  - History storage schema (trialLog is additive)
  - Existing data or records (backward compatible with old sessions)
  - Session modes or workflows

Backward compatibility is fully preserved.  
All existing sessions and baselines remain valid and unchanged.  
Old sessions without `trialLog` gracefully show "No trial data available".

---

## 🚫 Explicit non-goals

FCE v0.2.9 does **not**:
- Add new tests or assessment paradigms
- Modify scoring or interpretation logic
- Change data storage format (trialLog is additive)
- Alter existing session data
- Change instrument behavior or workflows

This release focuses on **UX improvements, History enhancements, and onboarding** — not on the core instrument.

---

## 🔖 Versioning

- v0.2.9 is a **minor release** in the v0.2 series
- Builds on:
  - v0.2.8 — Language support, UX improvements & bug fixes
- Adds first-time onboarding, per-test hints, History card enhancements, complete translation coverage, and navigation improvements
- **Post-release fixes:**
  - Onboarding language selector for language change before committing
  - Fixed documentation navigation order (How to Use → How the tests work → FAQ)
  - Fixed expanded state preservation across language changes for all test types

Future work continues under **v0.2.x** and **v0.3 planning**.