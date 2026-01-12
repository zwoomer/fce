**Release date:** 2026-01-12  
**Status:** Stable

---

## Overview

FCE v0.2.8 is a **language support, UX improvements, and bug fixes release**.

This release adds Lithuanian language support, improves session panel usability, enhances navigation, and fixes several bugs affecting data integrity and UI consistency.

v0.2.8 maintains full backward compatibility and does not alter any test logic, scoring algorithms, or data storage.

---

## 🌐 Language support

### Lithuanian (LT) language support

Complete translation coverage across the entire application:

- **Core UI:** All buttons, labels, messages, and session summaries
- **Documentation:** All documentation pages (About, Concept, Scope, Norwegian Context, How to Use, FAQ)
- **Baseline-relative page:** Visual explanation page with Lithuanian translations
- **Error messages:** All refusal codes and validation messages
- **Session feedback:** Trial text, progress indicators, and quality labels

Language selector updated to include LT option alongside EN and NO. The selector now appears consistently across all pages (index.html and all documentation pages), with proper synchronization between pages via shared localStorage key.

---

## 🎨 Session panel improvements

### Fixed-height scrolling

- Session panel now maintains fixed height and **never expands** as trials increase
- Trial list uses internal scrolling with visual emphasis on the last ~5 trials
- Older trials fade but remain visible when scrolling
- Panel remains stable during and after sessions

### Visual emphasis

- Latest trial: bold, full opacity
- 2nd–5th latest: gradually fading opacity (0.95 → 0.42)
- Older trials: dimmed (0.25 opacity) but accessible via scrolling
- Subtle fade overlay at top of list

### Auto-scroll behavior

- Auto-scrolls to newest trial only when user is near bottom (within 40px)
- Prevents interrupting manual scrolling when user is reviewing older trials
- Works consistently during active sessions and after completion

---

## 📋 Home panel reordering

- History preview panel now appears **between Session and Baseline** panels
- Improved information hierarchy: Session → History → Baseline
- History preview automatically appears after sessions complete
- Smooth scroll on narrow screens (≤640px) when History panel becomes visible

---

## 🧭 Navigation enhancements

### History back button improvements

- **Desktop/tablet:** Floating button in left gutter beside container (stays visible while scrolling)
- **Mobile (≤640px):** Inline position above content (no overlap)
- Button remains accessible even when history is cleared
- Robust navigation: falls back gracefully if browser history is unavailable
- Responsive breakpoints prevent overlap with content at any screen size

---

## ⚙️ Test type defaults

- **Go/No-Go:** Defaults to 20 trials when selected (recommended for stable results)
- **Reaction Time:** Defaults to 10 trials (unchanged)
- **Divided Attention:** Defaults to 10 trials (unchanged)
- Users can still manually adjust trial count after selection

This aligns with the baseline guidance that recommends ≥20 trials per session for Go/No-Go.

---

## 🐛 Bug fixes

### Extra trial recording

- Fixed bug where rapid clicking could record 11 trials instead of 10
- Added guards to prevent recording more than `totalTrials` trials
- Prevents race conditions in trial recording logic

### Button state consistency

- Fixed issue where "Run Functional Check" button could become enabled after invalid sessions
- `updateBaselineInfo()` now called in all `endSession()` return paths
- Ensures button states are correctly updated after invalid sessions

### Training mode summary display

- Fixed inconsistency where Divided Attention Training showed a summary
- Training mode now consistently shows **no summary** across all test types (Reaction Time, Go/No-Go, Divided Attention)
- Aligns with instruction text: "Training runs the same tasks without comparison"

### Language selector consistency

- **Language selector parity:** LT option now appears consistently in HTML across all pages (index.html and all docs pages)
- **Selector sync:** Language selector dropdown now correctly reflects the applied language, including after fallback scenarios
- **localStorage synchronization:** Fixed mismatch where index.html used `fce_lang_v1` while docs pages used `fce_lang`
  - All pages now use `fce_lang` as the primary key
  - Language selection now persists correctly between index.html and docs pages
  - Backward compatibility maintained with migration from `fce_lang_v1` to `fce_lang`
- **Safety checks:** Added non-conditional safety checks to ensure LT option exists even if markup drifts

---

## 🔐 Safety & compatibility

- No changes to:
  - Test logic or scoring algorithms
  - Baseline computation or thresholds
  - History storage schema
  - Existing data or records
  - Session modes or workflows

Backward compatibility is fully preserved.  
All existing sessions and baselines remain valid and unchanged.

---

## 🚫 Explicit non-goals

FCE v0.2.8 does **not**:
- Add new tests or assessment paradigms
- Modify scoring or interpretation logic
- Change data storage format
- Alter existing session data
- Change instrument behavior or workflows

This release focuses on **language support, UX improvements, and bug fixes** — not on the core instrument.

---

## 🔖 Versioning

- v0.2.8 is a **minor release** in the v0.2 series
- Builds on:
  - v0.2.7 — Explanatory clarity & visual documentation
- Adds Lithuanian language support, session panel improvements, navigation enhancements, and critical bug fixes

Future work continues under **v0.2.x** and **v0.3 planning**.
