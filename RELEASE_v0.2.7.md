**Release date:** 2026-01-11  
**Status:** Stable

---

## Overview

FCE v0.2.7 is an **explanatory clarity and visual documentation release**.

The core functional assessment instrument remains unchanged.  
This release adds visual explanations, clarifies baseline-relative measurement concepts, and improves documentation discoverability through contextual navigation.

v0.2.7 maintains full backward compatibility and does not alter any test logic, scoring algorithms, or data storage.

---

## 📊 Visual explanation page

### Baseline-relative measurement diagram (`baseline-relative.html`)

A new standalone page explaining baseline-relative measurement through a visual diagram:

- **Pure HTML + CSS diagram** — no canvas, no SVG, no JavaScript
- **Clear time direction** — "Earlier" → "Later" without arrows
- **Explicit labels** — what dots represent (baseline measurements vs single later measurement)
- **Visual anchoring** — normal range band visually derived from baseline
- **Variability & recovery notes** — interpretation guidance for pattern-based assessment

The diagram uses micro-labels to explain the relationship between baseline sessions, the normal range band, and later check sessions.

---

## 🧭 Documentation navigation improvements

### Contextual links to visual explanation

- **Concept page** — added link after "Why baseline-relative measurement matters" section
- **About page** — added to "Start here" and "Quick links" sections (between Concept and Norwegian Context)
- **Norwegian Context page** — added inline link after baseline-relative reference

All links use restrained, contextual wording ("visual explanation") and position the page as a supporting explainer, not a core policy document.

---

## ✏️ Content improvements

### Variability & recovery section

Added interpretation notes on the baseline-relative page:

- Short-term variability is normal part of human performance
- Interpretation focuses on patterns over time, not isolated points
- How performance returns toward baseline can be more informative than single deviation

Clarifies that this describes interpretation within a baseline-relative framework, not causes of change.

---

## 🎨 Diagram improvements

### Micro-labels for comprehension

- Added time direction labels ("Earlier" / "Later" / "Tidligere" / "Senere")
- Explicit descriptions of what dots represent
- Middle label explains normal range band derivation
- Responsive layout: labels stack on mobile (max-width: 640px)

### Visual anchoring

- Band positioning adjusted (18% left/right instead of 15%) to feel more anchored to baseline
- Band opacity increased slightly (0.10 instead of 0.08) for better visibility while remaining subtle
- Enhanced contrast for single later measurement dot (0.90 opacity instead of 0.85)

### Mobile optimization

- 4th baseline dot hidden on narrow screens (max-width: 520px) to prevent crowding
- Micro-labels stack vertically on mobile for better readability

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

FCE v0.2.7 does **not**:
- Add new tests or assessment paradigms
- Modify scoring or interpretation logic
- Change data storage format
- Alter existing session data
- Change instrument behavior or workflows
- Add numbers, scales, or pass/fail indicators to diagrams

This release focuses on **explanatory clarity and visual documentation** — not on the core instrument.

---

## 🔖 Versioning

- v0.2.7 is a **minor release** in the v0.2 series
- Builds on:
  - v0.2.6 — Documentation expansion & utilities
- Adds visual explanations and interpretation guidance

Future work continues under **v0.2.x** and **v0.3 planning**.

---