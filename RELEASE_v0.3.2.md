**Release date:** 2026-01-14  
**Status:** Stable

---

## Overview

FCE v0.3.2 is a **UX and navigation release** introducing unified topbar branding, scroll position restoration, Precision history rendering polish, and a new "Why this exists" documentation page.

This release significantly improves navigation consistency, documentation accessibility, and Precision test result interpretation.

v0.3.2 maintains full backward compatibility. All existing sessions and baselines remain valid.

---

## 🎨 Unified topbar brand link

### Consistent navigation

- **Clickable brand:** "FCE" title is now clickable across all pages (index + all docs)
- **Hover text swap:** On desktop hover, "FCE" smoothly transitions to localized "To the instrument" label
- **Overlay-based swap:** Text swap uses absolute positioning (no layout reflow)
- **Language-aware:** Hover label adapts to current language (EN/NO/LT)
- **Accessibility:** Proper ARIA labels and focus-visible styles

### Topbar layout improvements

- **Centered page title:** Page title now absolutely centered (no movement when brand text swaps)
- **No purple visited links:** Topbar links inherit color, preventing purple visited styling
- **Hamburger affordances:** Enhanced menu button with hover/active states and subtle press feedback
- **Tightened hover condition:** Brand link text swap only triggers on true hover devices (desktop mouse/trackpad), completely hidden on touch devices
- **Small screen optimization:** "Learn More" button hidden on screens ≤480px to prevent topbar crowding (accessible via hamburger menu)

---

## 📜 Scroll position restoration

### Smart navigation

- **Scroll memory:** Canonical doc pages now remember scroll position when navigating away
- **Learn More restoration:** Clicking "Learn More" returns to last visited doc page at previous scroll position
- **Storage system:** Uses localStorage to persist scroll positions per page
- **Clean URLs:** Hash-based restoration that removes itself after scroll

### Implementation

- Scroll position stored on `visibilitychange` and `beforeunload` events
- Restoration triggered by `#restore-scroll` hash in URL
- Works seamlessly with existing baseline-relative.html scroll restoration

---

## 📊 Precision history rendering polish

### Summary chips (3-chip design)

- **Accuracy:** Average error (2 decimals)
- **Consistency SD:** Standard deviation of error (2 decimals)
- **Hits:** Hit rate percentage (integer)
- **Removed:** RT, trials, misses, timeouts from primary chips (moved to support line)

### Muted support line

- **Secondary metrics:** Hit rate %, misses, timeouts, avg RT, trials displayed in muted line under chips
- **Localized formatting:** Proper language-specific formatting (EN/NO/LT)

### Grouped details sections

- **Accuracy section:** Average error, Best, Worst
- **Consistency section:** Variability (SD)
- **Execution section:** Hits %, Misses, Timeouts, Average RT, SD RT
- **Clear hierarchy:** Bold section labels with muted detail lines

### Baseline comparison text

- **Explicit phrasing:** "Accuracy within normal range" / "Accuracy slightly worse than baseline (+0.11)" / "Accuracy significantly worse than baseline (+0.29)"
- **Localized:** Complete translations for EN/NO/LT
- **Clearer interpretation:** Makes comparison status immediately understandable

---

## 📄 Documentation

### "Why this exists" page

- **New page:** `why.html` explaining FCE's philosophy and purpose
- **Footer links:** Added "Why this exists" link to all page footers
- **Standalone access:** Accessible via footer, not part of canonical doc flow
- **Fully translated:** Complete EN/NO/LT support

### Learn More button

- **Canonical docs only:** "Learn More" button now only redirects to canonical doc pages
- **Excludes why.html:** why.html accessible only via footer link
- **Smart redirect:** Returns to last visited canonical doc page with scroll restoration

---

## 🎨 Link styling

### Footer links

- **Subtle styling:** Inherit muted text color with opacity transitions
- **Hover states:** Brighten on hover/focus with border-bottom emphasis
- **Accessibility:** Focus-visible styles with box-shadow

### Docs page links

- **Dark theme friendly:** Light gray links (no bright blue/purple)
- **No purple visited:** Visited links stay light gray
- **Consistent styling:** Border-bottom emphasis, smooth transitions

---

## 🐛 Bug fixes and improvements

### Topbar fixes

- **Layout stability:** Page title centered, no movement on brand hover
- **Text swap:** Overlay-based implementation prevents layout reflow
- **Visited links:** Prevented purple styling on topbar links

### Precision history

- **Readability:** 3-chip summary makes key metrics immediately visible
- **Grouped details:** Organized sections improve information hierarchy
- **Explicit comparisons:** Baseline comparison text is clearer and more actionable
- **Trial count default:** Fixed Precision defaulting to 10 trials when switching test types; now defaults to 25 (Baseline default) when switching from HTML default

---

## 📊 Technical details

### New I18N keys

- `history.precision.labels.*` — Accuracy, Consistency, Execution, Hits, Misses, Timeouts, Average RT, Variability
- `history.precision.comparison.*` — Within, Slightly worse, Significantly worse
- Complete EN/NO/LT parity

### Code changes

- Unified brand link HTML structure across all pages
- Scroll position storage/restoration system for canonical docs
- Precision history rendering refactor (chips, support line, grouped details)
- Topbar CSS improvements (centered title, overlay text swap, visited link prevention)
- Hamburger button hover/active affordances
- Brand link hover condition tightened: `.brand-long` hidden by default (`display: none`), only shown on hover-capable devices

### Files changed

- `index.html` — Brand link structure, Learn More logic, scroll restoration
- `why.html` — New documentation page
- All canonical doc pages — Brand link, scroll storage/restoration
- `app.js` — Precision history rendering, I18N keys
- `style.css` — Topbar fixes, brand link hover, hamburger affordances, link styling
- `.nojekyll` — Skip Jekyll processing for faster GitHub Pages deployment

---

## 🚀 Deployment

- **GitHub Pages optimization:** Added `.nojekyll` file to skip Jekyll processing
- **Faster deployments:** Static file copying instead of build process
- **Timeout prevention:** Eliminates deployment timeout issues

---

## 🔖 Versioning

- v0.3.2 is a **minor release** (UX improvements and new documentation)
- Builds on: v0.3.1 — Precision refinements and UX improvements
- Focus: Navigation consistency, documentation, Precision history clarity
