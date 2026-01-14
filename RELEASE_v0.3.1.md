**Release date:** 2026-01-14  
**Status:** Stable

---

## Overview

FCE v0.3.1 is a **refinement release** focusing on Precision test UX improvements, trial count defaults, and minor bug fixes. This release improves the user experience without changing core measurement logic.

v0.3.1 maintains full backward compatibility. All existing sessions and baselines remain valid.

---

## 🎯 Precision test refinements

### Trial count defaults by mode

- **Baseline mode:** Defaults to 25 trials (was 15)
- **Check mode:** Defaults to 15 trials
- **Training mode:** Defaults to 15 trials (only if input is empty)
- **Mode-aware defaults:** Trial count now corresponds to the session type being started
- **Clamp enforcement:** All changes respect the 10-40 trial range

### Trend display improvements

- **Precision delta labels:** Removed "ms" unit from Precision trend delta lines (error distance is unitless)
- **Baseline line cleanup:** Removed hacky `.replace(" ms", "")` calls, built baseline line without "ms" for Precision tests
- **Consistent formatting:** Non-precision tests continue to show "ms" as expected

### Target placement safety

- **Exit button exclusion:** Precision targets never appear near the Exit button
- **Collision detection:** Retry loop ensures targets are placed with safety margin
- **Small screen support:** Prevents accidental exits on mobile devices

---

## 🎨 UX improvements

### Divided Attention legend

- **New location:** Legend moved to "What to do" panel (task hint panel)
- **Color coding:** Subtle visual emphasis for GO, NO-GO, and "blue" words
- **Language-aware styling:** Color coding adapts to current language (EN/NO/LT)
- **Improved hierarchy:** Legend now appears in context with instructions

### Translation fixes

- **Lithuanian correction:** Fixed "NESPĮKITE" → "NESPAUSKITE" (NO-GO instruction)
- **Consistency:** Updated across all Divided Attention translations

---

## 🐛 Bug fixes

- **Trial count persistence:** Fixed issue where trial count would reset to 15 when changing test type
- **Default behavior:** Trial count now only changes when starting a session, not when selecting test type
- **Visual consistency:** Improved trend and baseline line rendering for Precision tests

---

## 📊 Technical details

### Code changes

- Modified `startBaselineBtn`, `startCheckBtn`, `startTrainingBtn` click handlers to set mode-specific defaults
- Removed forced `trialCountInput.value = 15` from `testType.addEventListener("change", ...)`
- Updated `renderTrendFor()` to handle Precision delta and baseline lines correctly
- Added `nextPrecisionTrial()` exclusion zone logic for Exit button
- Refactored `updateDividedLegend()` to use new `#taskLegendSlot` and `decorateDividedLegend()` helper

### Files changed

- `app.js` — Trial defaults, trend rendering, target placement, legend updates
- `index.html` — Added `#taskLegendSlot` for Divided Attention legend
- `style.css` — Added Divided Attention legend styling (color coding)

---

## 🔖 Versioning

- v0.3.1 is a **patch release** (refinements and fixes)
- Builds on: v0.3.0 — Precision (Target Pointing) test
- Focus: UX improvements and bug fixes without changing measurement logic
