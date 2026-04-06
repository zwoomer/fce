**Release date:** 2026-01-13  
**Status:** Stable

---

## Overview

FCE v0.3.0 is a **major feature release** introducing the **Precision (Target Pointing) test** — a new assessment paradigm for measuring fine motor control and spatial accuracy.

This release adds a complete fourth test type with fullscreen UX, comprehensive internationalization, and full integration with the existing baseline-relative assessment framework.

v0.3.0 maintains full backward compatibility. Existing sessions and baselines remain valid and unchanged.

---

## 🎯 Precision (Target Pointing) test

### New test type

FCE now includes **four assessment paradigms**:

1. **Reaction Time** — Simple response speed and consistency
2. **Go / No-Go** — Inhibitory control under time pressure
3. **Divided Attention** — Execution quality under split attention
4. **Precision (Target Pointing)** — Fine motor control and spatial accuracy ⭐ **NEW**

### Test mechanics

- **Fullscreen test environment:** Consensual fullscreen request with prep overlay
- **Random target placement:** Targets appear at random positions on screen
- **Variable target sizes:** Target radius adapts based on screen size
- **Trial-by-trial feedback:** Immediate visual feedback (hit/miss/timeout)
- **HUD display:** Trial counter, feedback messages, exit button
- **Timeout handling:** Trials automatically timeout if no response

### Metrics measured

- **Error distance (errN):** Normalized distance from target center to click point
- **Mean error:** Average error distance across all trials
- **Standard deviation:** Variability in error distance
- **Reaction time:** Time from target appearance to click
- **Hit rate:** Percentage of successful hits within target radius
- **Miss rate:** Percentage of clicks outside target radius
- **Timeout rate:** Percentage of trials that timed out

### Baseline-relative evaluation

- **Baseline mode:** Establishes personal normal performance for Precision
- **Check mode:** Compares current performance to baseline with deviation-based status
- **Training mode:** Practice sessions that never update baseline
- **Quality assessment:** Session quality labels (Good / Mixed / Not usable)
- **History integration:** Full History card rendering with per-trial breakdown

---

## 🖥️ Fullscreen UX

### Consensual fullscreen

- **Prep overlay:** Users must explicitly confirm before entering fullscreen
- **Language-aware:** Prep overlay fully translated (EN/NO/LT)
- **Accessibility:** Proper ARIA attributes and keyboard navigation
- **Exit options:** Exit button in HUD, Esc key support

### Fullscreen handling

- **Graceful fallback:** If fullscreen unavailable, test runs in windowed mode
- **Notice system:** Clear messaging when fullscreen is unavailable or exited
- **State management:** Proper handling of fullscreen enter/exit events
- **Cross-browser support:** Vendor-prefixed fullscreen APIs for compatibility

### Event handling

- **Esc key behavior:** Single Esc press exits fullscreen and resets test
- **Pointer events:** Responsive click detection using pointerdown events
- **Event delegation:** Robust event handling that survives DOM changes
- **Memory management:** Proper cleanup of event listeners to prevent leaks

---

## 🌐 Comprehensive internationalization

### Precision test translations

- **Test type name:** "Precision (Target Pointing)" in EN/NO/LT
- **Fullscreen notices:** Unavailable and exited messages
- **Feedback messages:** Hit, miss, timeout outcomes
- **Invalid session messages:** Quality-related warnings
- **UI elements:** All buttons, labels, and instructions

### History section translations

- **Empty history message:** "No history yet" in all languages
- **Baseline labels:** "No baseline", "No baseline for comparison"
- **Precision-specific strings:** Hit, reaction time, error, responded, misses, timeouts
- **Divided attention labels:** Flashes, target, answer, error
- **Context tags:** Sleep, stress labels
- **Action labels:** Reason, Show trials, Hide trials
- **Abbreviations:** False alarms (FA/IF/SK), Flash error

### Quality badge language-safety

- **Key-based mapping:** Quality badges now check raw keys ("good", "mixed", "not_usable") instead of translated text
- **Consistent behavior:** Badge colors work correctly regardless of language
- **Baseline quality warnings:** Complete Lithuanian translation added

---

## 🐛 Bug fixes and improvements

### Precision test fixes

- **Target visibility:** Fixed targets not appearing after reset or language change
- **Event handler attachment:** Fixed pointer handler not working after reset (event delegation on document)
- **Esc key handling:** Fixed race condition requiring two Esc presses (now single press exits and resets)
- **Language switching:** Fixed handler not working after language changes (event delegation)
- **Memory leaks:** Cleaned up event listeners with proper capture phase matching

### Code quality

- **Event listener cleanup:** Ensured all listeners removed with matching capture flags
- **Debug code removal:** Removed debug styling and console.log statements
- **State management:** Improved precision-specific state variable initialization and cleanup

---

## 🔐 Safety & compatibility

- **Backward compatible:** All existing sessions and baselines remain valid
- **No breaking changes:** Existing test types (Reaction Time, Go/No-Go, Divided Attention) unchanged
- **Data storage:** Precision sessions use same storage schema as other test types
- **History rendering:** Old sessions without Precision data gracefully handled

---

## 📊 Technical details

### New functions

- `startPrecisionSession()` — Initialize Precision test session
- `nextPrecisionTrial()` — Generate and display next target
- `showPrecisionFeedback()` — Display trial outcome feedback
- `endPrecisionSession()` — Clean up and save session
- `showPrecisionPrep()` / `hidePrecisionPrep()` — Prep overlay management
- `handlePrecisionFullscreenChange()` — Fullscreen event handling
- `updatePrecisionNotice()` — Fullscreen notice updates
- `handlePrecisionResize()` — Window resize handling
- `runPrecisionResetOnce()` — Reset coordination
- `isAnyFullscreenActive()` — Fullscreen state detection
- `getBaselineSavedPrecision()` — Baseline summary rendering
- `getCheckPrecision()` — Check mode summary rendering

### New HTML elements

- `<div id="precisionStage">` — Fullscreen test stage
- `<div id="precisionTarget">` — Clickable target circle
- `<div id="precisionPrepOverlay">` — Prep overlay dialog
- Precision HUD elements (counter, feedback, exit button, fullscreen notice)

### New CSS

- `.precision-stage` — Fullscreen stage styling
- `.precision-target` — Target circle with show/hide animations
- `.precision-hud` — HUD layout and positioning
- Fullscreen handling and body class management
- ~124 lines of new CSS

---

## 🔖 Versioning

- v0.3.0 is a **major release** (new test type)
- Builds on:
  - v0.2.9 — UX improvements, History enhancements, and onboarding
- Adds complete Precision (Target Pointing) test implementation with fullscreen UX and comprehensive i18n

Future work continues under **v0.3.x** for refinements and **v0.4 planning** for additional features.
