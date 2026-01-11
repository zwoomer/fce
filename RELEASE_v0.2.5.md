**Release date:** 2026-01-11  
**Status:** Stable

---

## Overview

FCE v0.2.5 is a **critical bug fix release**.

The core functional assessment instrument remains unchanged.  
This release addresses **data integrity issues and UI state consistency problems** discovered in v0.2.4 — ensuring that sessions are recorded accurately and UI state reflects actual data availability.

v0.2.5 maintains full backward compatibility and does not alter any existing data or scoring logic.

---

## 🐛 Bug fixes in v0.2.5

### 🔒 Race condition in session completion

Fixed a critical race condition that could cause duplicate session records when users clicked rapidly during trial completion:

- Added guard in click handler to prevent processing clicks after all trials complete
- Added guard in `endSession()` to prevent duplicate execution
- Added guard in `nextTrial()` to prevent processing after session ends

**Impact:** Prevents duplicate session entries in history and ensures accurate trial counts.

---

### 📊 Extra trial registration fix

Fixed an issue where rapid clicking could register 11 trials instead of the intended 10 (or any configured trial count):

- Click handler now correctly checks `trialIndex > totalTrials` before processing
- Trial counting is now atomic and protected from race conditions

**Impact:** Ensures trial counts match configured session parameters exactly.

---

### 🎯 Training mode button state correction

Fixed an issue where the "Run Functional Check" button could appear enabled after completing a training session, even when no baseline existed:

- Added `updateBaselineInfo()` call after non-divided training sessions complete
- Ensures button state correctly reflects baseline availability
- Matches existing behavior for divided attention training mode

**Impact:** UI state now accurately reflects data availability across all session modes.

---

## 📚 Documentation updates

- Updated README.md to reflect v0.2.5 as latest release
- Added v0.2.5 section to roadmap.md
- Added v0.2.5 section to next-steps.md
- Completed v0.2.4 documentation content updates (about.html, how-to-use.html, faq.html, norwegian-context.html)

All documentation now accurately reflects the current state of the instrument.

---

## 🔐 Safety & compatibility

- No changes to:
  - Test logic or scoring algorithms
  - Baseline computation or thresholds
  - History storage schema
  - Existing data or records
  - User workflows or session modes

Backward compatibility is fully preserved.  
All existing sessions and baselines remain valid and unchanged.

---

## 🚫 Explicit non-goals

FCE v0.2.5 does **not**:
- Add new tests or features
- Modify scoring or interpretation
- Change data storage format
- Alter existing session data
- Introduce new UI features

This release is about **correctness and reliability, not expansion**.

---

## 🔖 Versioning

- v0.2.5 is a **patch release** in the v0.2 series
- Builds on:
  - v0.2.4 — Refinement-only UX polish
- Fixes critical bugs while maintaining feature parity

Future work continues under **v0.2.x** and **v0.3 planning**.

---
