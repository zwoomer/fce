**Release date:** 2026-01-15  
**Status:** Stable

---

## Overview

FCE v0.3.3 is a **stability, formatting, and documentation clarity release** focusing on Precision test robustness, CSV export functionality, standardized Quality+Note formatting, improved invalid session reason display, comprehensive documentation additions, and visual identity system.

This release significantly improves Precision test consistency across devices, adds CSV export capability, standardizes summary formatting across all test types, adds extensive boundary clarification across documentation, and establishes a canonical visual mark system.

v0.3.3 maintains full backward compatibility. All existing sessions and baselines remain valid.

---

## 🎯 Precision stability improvements

### Input coordinate normalization

- **CSS pixel normalization:** Pointer coordinates normalized to CSS pixels (device-independent)
- **Consistent hit radius:** Hit radius calculations now consistent across all devices, display pixel ratios, and zoom levels
- **Multi-input support:** Handles Pointer Events, touch events, and mouse events with unified coordinate system
- **Device independence:** Same hit radius behavior on high-DPI displays, tablets, and standard monitors

### Timeout handling

- **Per-trial resolution guard:** Prevents late taps after timeout from being recorded
- **Single outcome guarantee:** Ensures exactly one outcome per trial (hit, miss, or timeout)
- **Timeout priority:** Timeout fires first, late taps are ignored
- **Clean state management:** Proper cleanup of timeout timers and event handlers

### Fullscreen tracking

- **Achievement tracking:** Tracks whether fullscreen was successfully achieved for each Precision session
- **Non-blocking feedback:** Shows note in session summary when fullscreen was not achieved (does not affect scoring)
- **Session record:** Fullscreen achievement status stored in session record for reference
- **User awareness:** Clear indication when input consistency may be reduced due to windowed mode

---

## 📊 CSV export

### Export functionality

- **CSV export button:** New "Export CSV" button next to existing JSON export
- **Same data scope:** Exports same sessions as JSON export (test-type filtered)
- **Flattened schema:** All session data flattened into columns (metadata, metrics, quality, flags, device info)
- **Proper escaping:** RFC 4180 compliant CSV escaping (quotes, commas, newlines)
- **Stable column order:** Fixed column order for consistent parsing

### Timestamp clarity

- **Deterministic format:** Local timestamps in `YYYY-MM-DD HH:mm` format (24-hour, locale-independent)
- **Timezone offset:** New `timezoneOffsetMin` column for reference (minutes behind UTC)
- **No locale dependency:** Timestamps consistent regardless of browser locale settings
- **Clear labeling:** Explicit column headers for timestamp and timezone information

### Filename format

- **Pattern:** `fce_<testType>history<YYYY-MM-DD><HHmm><lang>.csv`
- **Example:** `fce_reactionhistory2026-01-151430en.csv`
- **Language suffix:** Includes current language code (en/no/lt)
- **Date/time stamp:** Includes export date and time for versioning

---

## ✨ Quality+Note formatting standardization

### Consistent formatting

- **Helper function:** New `formatQualityWithOptionalNote()` helper for consistent formatting across all tests
- **Two-line format:** Quality label on one line, Note on new line (when note exists)
- **Prefix stripping:** Automatically strips duplicate "Note:" / "Merknad:" / "Pastaba:" prefixes
- **Localized labels:** Uses `quality.label` and `ui.noteLabel` i18n keys for all languages

### Implementation

- **All test types:** Applied to Reaction Time, Go/No-Go, Divided Attention, and Precision
- **Session summary:** Live session summaries use standardized format
- **History summaries:** Regenerated summaries use same formatting
- **Language switching:** Formatting updates correctly when language changes

### Example output

```
Quality: Mixed
Note: This session had many false starts — consider retaking for better baseline quality.
```

---

## 🔍 Invalid session reason display

### Compact history display

- **Reason-only text:** History/details now show compact "Reason: <reason>" instead of full refusal messages
- **No duplication:** Full explanation + remedy + quality only shown in session summary panel
- **Test coverage:** Applied to Precision, Go/No-Go, and Divided Attention
- **Backward compatible:** Old sessions without refusalCode still work via fallback parsing

### Implementation

- **i18n keys:** New `history.reasonText.<code>` keys for reason-only text (no "Session not usable:" prefix)
- **Helper function:** `getRefusalReasonText()` helper avoids colon parsing for known refusal codes
- **Fallback parsing:** Unknown codes or old sessions use colon parsing as fallback
- **Consistent format:** All languages use same "Reason: <reason>" pattern

### Example

**History/details:**
```
Reason: execution failure (no valid responses recorded).
```

**Session summary:**
```
Session not usable: execution failure (no valid responses recorded). | Next step: run again and respond to the GO cue. | Quality: Not usable
```

---

## 🐛 Bug fixes

### Summary visibility

- **CSS :empty rule fix:** Invalid session summaries now immediately visible (override CSS rule that hides empty elements)
- **Explicit display:** Summary element explicitly shown when content exists
- **All invalid types:** Fix applies to all invalid session types (no reaction, no go, missing answer, etc.)

---

## 🌐 Internationalization

### New i18n keys

- **CSV export:** Complete translations for export button, status messages, and empty state (EN/NO/LT)
- **Note labels:** `ui.noteLabel` key for localized note labels (EN: "Note", NO: "Merk", LT: "Pastaba")
- **Reason text:** `history.reasonText.R1_INVALID_EXECUTION`, `R2_INSUFFICIENT_DATA`, `R3_EXCESS_NOISE` for all languages
- **Remedy strings:** Complete remedy translations for all invalid session types (EN/NO/LT)

---

## 🎨 Visual identity system

### Canonical mark system

- **Canonical mark (`fce-mark.svg`):** Single source of truth for all mark variants
  - Rounded square frame (path-based, not rect)
  - Corner radius: 9 units (optimized for favicon rendering)
  - Stroke width: 4 units (favicon-safe)
  - Stroke linejoin: miter (prevents bulbous corners)
  - Stroke linecap: butt (technical aesthetic)
  - Intentional gap on top edge near right corner (~10 units)
  - Uses `currentColor` for stroke
  - No fill, no text, no symbols
  - Clean, flat vector design optimized for small sizes

- **Favicon/logo variant (`fce-icon.svg`):** Derived from canonical mark
  - Same geometry and proportions
  - Optimized for 16×16 and larger sizes
  - Maintains legibility at small sizes

- **In-app state mark (`fce-mark-state.svg`):** Expresses system state
  - Same frame geometry as icon variant (radius 9, stroke 4)
  - Interior fill using `currentColor` at ~18% opacity
  - Miter joins and butt caps for crisp rendering
  - Represents held containment state (readiness, not progress)
  - Optional commented threshold state interruption (disabled by default)

### Geometry refinement (post-initial release)

- **Favicon-safe rendering:** Reduced stroke width from 6 to 4 units and corner radius from 14 to 9 units
- **Crisp corners:** Changed stroke-linejoin from round to miter to prevent bulbous corners
- **Technical aesthetic:** Changed stroke-linecap from round to butt for cleaner, more institutional appearance
- **Small-size optimization:** Mark renders cleanly at 16×16px favicon size without ornamental artifacts
- **Gap preservation:** Intentional gap remains visible and clear at all sizes
- **Consistency:** All three variants (canonical, icon, state) updated with matching geometry
- **Verification:** Added `svg-preview.html` for visual verification at multiple sizes (16px, 24px, 32px, 64px, 128px)

### Design philosophy

- **Containment field metaphor:** Mark represents a containment field with conditional access
- **Intentional gap:** Gap signifies controlled entry/exit, not damage or incompleteness
- **Calm, disciplined aesthetic:** Institutional feel without being clinical
- **Flat vector only:** No animations, gradients, or shadows
- **Comment structure:** SVG files include detailed comments for future variant development

---

## 📚 Documentation clarity and boundary reinforcement

### About page additions

**"Why repeated use matters" section:**
- Emphasizes that FCE is designed for comparison across time
- Explains how repeated use under varying conditions builds pattern awareness
- Clarifies that FCE does not interpret results or explain causes
- User-led pattern recognition through comparison, not instruction

**"What FCE reflects (without medical claims)" section:**
- Grounding explanation of functional performance
- Describes how performance reflects combined state of multiple body systems
- Clarifies that FCE measures observable execution, not systems directly
- Maintains non-medical framing

### Concept page additions

**"Baseline comparison and pattern recognition" section:**
- Explains how repeated comparison supports pattern awareness
- Describes increased sensitivity to changes in execution patterns
- Emphasizes that effect does not depend on feedback or scoring labels
- Clarifies that interpretation remains outside instrument scope

**"Why performance can change day to day" section:**
- Lists interacting factors affecting execution (sleep, workload, stress, recovery, illness, environment)
- Explains that influences affect attention, inhibition, and motor control
- Notes that changes can occur without obvious subjective warning signs
- Reinforces that FCE measures outcome, not causes

### How to Use page additions

**"How to read results over time" section:**
- Emphasizes comparison across sessions, not single-run conclusions
- Explains that meaningful use comes from observing trends
- Recommends retesting under similar conditions if result looks unusual
- Placed after Baseline/Check/Training explanation, before interpretation tips

### FAQ page additions

**"Can using FCE help me understand myself better?" entry:**
- Clarifies that FCE does not interpret results or provide explanations
- Notes that some users find repeated use helps notice changes
- Emphasizes that any reflection is user-led
- FCE does not guide interpretation or suggest meaning

**"Does FCE measure the nervous system, hormones, or the endocannabinoid system?" entry:**
- Explicit "No" answer
- Clarifies that FCE measures functional execution, not biological systems
- Explains that outcomes can reflect combined influence of underlying systems
- Reinforces function-first approach with human-led interpretation

### Scope & Limits page additions

**"Not interpretive" boundary:**
- Added to limits list as final safeguard
- States that FCE does not guide reflection, suggest meaning, or infer personal circumstances

**"Physiology boundary (explicit)" section:**
- Explicit statement that FCE does not measure neurological function, hormonal status, substance presence, or physiological systems
- Measures observable task execution only
- Results are not medical conclusions

### How the tests work page additions

**"What it reflects" descriptions:**
- Added to each test section (Reaction Time, Go/No-Go, Divided Attention, Precision)
- Clarifies what each test measures without medical claims
- Placed near top of each test section for immediate context

### Internationalization

- **Complete translation coverage:** All new content sections translated to Norwegian (NO) and Lithuanian (LT)
- **Consistent terminology:** Maintains non-medical, non-diagnostic framing in all translations
- **Boundary language:** Clear boundary statements in all languages
- **Translation quality:** Preserves emphasis on user-led interpretation across all languages

### Content philosophy

All additions emphasize:
- **Function-first approach:** FCE measures observable execution, not underlying systems
- **User-led interpretation:** Any reflection or pattern recognition is user-initiated
- **Explicit boundaries:** Clear statements about what FCE does not do
- **Non-medical framing:** Avoids medical claims while acknowledging functional performance
- **Comparison over time:** Emphasis on trends and repeated use, not single sessions
- **Human interpretation:** Results require human interpretation, not automated judgment

---

## 📝 Technical details

### Code changes

- **Helper functions:** `formatQualityWithOptionalNote()`, `getRefusalReasonText()`, `getInputPoint()`
- **CSV functions:** `escapeCsvField()`, `sessionToCsvRow()`, `exportHistoryCsvFor()`, `downloadCsv()`
- **Precision state:** Added `precisionTrialResolved` flag for per-trial resolution guard
- **Summary rendering:** Updated all `setSummary()` cases to use standardized formatting

### New files

- `fce-mark.svg` — Canonical mark (single source of truth)
- `fce-icon.svg` — Favicon/logo variant
- `fce-mark-state.svg` — In-app state mark variant
- `svg-preview.html` — Visual verification page for mark rendering at multiple sizes

### Documentation files modified

- `about.html` — Two new sections (EN/NO/LT)
- `concept.html` — Two new sections (EN/NO/LT)
- `how-to-use.html` — One new section (EN/NO/LT), removed developer notes
- `faq.html` — Two new Q&A entries (EN/NO/LT), removed developer notes
- `scope.html` — One new bullet point, one new section (EN/NO/LT)
- `how-tests-work.html` — Four "What it reflects" lines (EN/NO/LT)

### Backward compatibility

- **Old sessions:** Sessions without refusalCode still work via fallback parsing
- **Unknown codes:** Unknown refusal codes fall back to colon parsing
- **Data format:** No changes to session data structure or storage format
- **Baselines:** All existing baselines remain valid

---

## 🎯 Impact

### User experience

- **Precision consistency:** More reliable Precision test results across different devices
- **Export flexibility:** CSV export enables easier data analysis in spreadsheet applications
- **Clearer summaries:** Standardized formatting makes Quality+Note information easier to read
- **Reduced duplication:** Compact reason display in history reduces information overload
- **Clearer boundaries:** Users have explicit guidance on what FCE does and does not do
- **Interpretation guidance:** Multiple sections help users understand how to use FCE safely
- **Pattern awareness:** Content emphasizes comparison over time, not single sessions
- **Reduced confusion:** Explicit answers to common questions about scope

### Developer experience

- **Maintainable code:** Centralized formatting helpers reduce code duplication
- **i18n structure:** Reason-only text keys make translations easier to maintain
- **Type safety:** Helper functions provide consistent formatting guarantees

### Documentation quality

- **Comprehensive coverage:** All major boundary questions addressed
- **Consistent messaging:** Same themes reinforced across multiple pages
- **Translation completeness:** All new content available in all supported languages
- **Visual identity:** Canonical mark system provides foundation for future branding

---

## 🔄 Migration notes

No migration required. All existing sessions and baselines remain valid.

---

## 📚 Documentation

- Updated `README.md` with v0.3.3 changes
- Updated `docs/next-steps.md` with v0.3.3 completion status
- Updated `docs/roadmap.md` with v0.3.x progress
- Comprehensive documentation additions across all pages (EN/NO/LT)
- Visual identity system established with canonical SVG marks

---

## 🚀 Next steps

v0.3.x refinements continue with focus on:
- Minor HUD clarity improvements for Precision
- Additional UX consistency improvements
- Performance optimizations

---

**Full changelog:** See commit history from v0.3.2 to v0.3.3
