**Release date:** 2026-06-12  
**Status:** Stable

---

## Overview

FCE v0.4.1 is a **release-hardening pass** on the live instrument: clearer session and baseline output, full local **backup/import** UX, a **canonical v2 store** contract for export and import preview, structured **check summaries** that guard invalid and not-usable sessions, and **i18n fixes** for precision History labels (EN/NO/LT).

No change to core measurement philosophy or comparison math. **Human interpretation remains primary.**

---

## 💾 Backup, import, and canonical v2 store

### History backup / import UX

- **Full FCE store backup** export (`.json`) with EN/NO/LT button, reminder, and success/empty feedback
- **Last full backup** timestamp near export/import controls
- **Import preview (dry run)** before apply, with validation messaging and a separate confirm step
- **Post-import feedback** after reload (keys written, replaced, skipped)

### Canonical v2 contract

- **`validateCanonicalV2StoreShape` / `isCanonicalV2Store`** used across load/save, backup export, and import validation/preview/apply
- **Import preview summary** for v2 files: store format, schema version, contained sessions/baseline profiles, browser keys to write (not legacy key-count noise)
- **Overwrite warning** for canonical imports: single `fce_store_v2` key replacement called out explicitly (EN/NO/LT)
- Legacy envelope imports still supported for backward compatibility

---

## 📋 Session output and interpretation clarity

### Baseline and session panel hierarchy

- Clearer **baseline panel** status (none / building / ready), guidance, and integrity lines (strength, consistency)
- **Structured session summaries** with interpretation, metrics, detail, status, system, and completion lines
- **Baseline saved** and **check complete** copy separated from comparison signals

### Unusable / invalid check summaries

- **Not comparable** headline when a check is invalid or not usable for comparison
- **No baseline comparison leak** in primary interpretation line for execution failure, insufficient data, or excess noise paths
- **`invalidSessionNoAggregate`:** avoids misleading `0 ms` when there is no valid aggregate
- Optional supporting stats in detail line when partial data exists (without foreground comparison copy)
- **Remedy / next-step** lines aligned with refusal codes per test type

### History, home preview, and trend

- Invalid and not-usable sessions suppress compare blocks and trend deltas consistently
- Precision invalid history uses localized **Not usable** chip and reason lines

---

## 🌐 Internationalization (release audit fixes)

### Merged `history.precision` translations

- **Fixed duplicate `history.precision` object** in EN, NO, and LT that caused the second block to overwrite labels/comparison keys
- Precision History labels (`Accuracy`, `Execution`, etc.) now resolve from locale files instead of English `getPrecisionFallback()`

### Lithuanian precision invalid label

- **`history.precision.notUsable`:** `"Nebenaudojama"` → **`"Netinkama"`** (aligned with `quality.not_usable`; means *not usable*, not *deprecated*)

---

## 📝 Technical details

### Changed files

- **`app.js`** — backup/import UX, canonical v2 validation, structured summaries, invalid-session guards, merged precision i18n
- **`index.html`** — History backup/import controls, import preview panel, baseline integrity UI
- **`style.css`** — structured summary lines, import preview panel, baseline integrity styling

### New files

- `RELEASE_v0.4.1.md` (this note)

### Planning & readme

- `README.md` — latest release v0.4.1, changelog section
- `docs/next-steps.md` — v0.4.1 shipped, v0.4.x next
- `docs/roadmap.md` — v0.4.1 shipped

---

## 🔄 Backward compatibility

- **Sessions and baselines:** Existing local data remains valid; canonical v2 is the primary store format; legacy import envelope still accepted
- **Privacy model:** Unchanged (local-first, no accounts)

---

## 🚀 Next steps (v0.4.x)

Still open (non-binding):

- Multi-task / multi-session overview at a glance (non-diagnostic)
- Richer trend visualization
- Metadata filtering / grouping (descriptive only)
- Printable single-session report
- Restore or relocate mark SVG assets if needed
- Optional polish: home History “OK” badge vs deviation labels; canonical-specific import confirm copy

v0.4.x continues to exclude accounts, cloud sync, diagnostics, and automated decisions.
