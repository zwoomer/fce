# Next Steps (v0.1) — Week 3 Focus: History + Context Tags

This document turns the roadmap into a practical build checklist.
Goal: make FCE feel like an **instrument** (not just tests) by adding
**session history**, **context tags**, and a simple **trend view**.

---

## Guiding principles (keep it clean)
- No accounts / logins
- Local-first (localStorage only)
- No legal/medical claims in UI
- Prefer small commits with visible progress
- Keep data model versioned (v1) so future migrations are easy

---

## Phase B — History + Tags (recommended next)

### B1) Data model for session history (per test type)
**Goal:** store *every completed session* (baseline + check), not just baseline summaries.

**Create a new storage key:**
- `fce_history_v1_<testType>`
  - e.g. `fce_history_v1_reaction`
  - e.g. `fce_history_v1_gonogo`

**Session record shape (example):**
```js
{
  id: "2026-01-08T12:34:56.789Z",   // ISO timestamp is fine as unique id
  createdAt: "2026-01-08T12:34:56.789Z",
  testType: "reaction" | "gonogo",
  mode: "baseline" | "check" | "training",

  // results summary (test-specific)
  metrics: {
    avgMs: 276,
    sdMs: 24,
    bestMs: 255,
    worstMs: 321,
    trials: 5,

    // gonogo extras (optional)
    hits: 10,
    misses: 1,
    falseAlarms: 2,
    correctRejects: 4,
    falseStarts: 0
  },

  // lightweight integrity / quality flags
  flags: {
    invalid: false,
    reason: "" // e.g. "too many false starts"
  },

  // context tags (optional)
  tags: {
    sleep: 0,   // 0–5 (0 = not set)
    stress: 0,  // 0–5 (0 = not set)
    note: ""    // optional short note
  },

  // environment hints (optional)
  device: {
    isTouch: true,
    userAgentHint: "mobile" // keep minimal
  }
}

Acceptance criteria

A completed session adds one history record.

Baseline sessions and check sessions both appear.

History is stored separately per test type.

Commit suggestion

Add history storage model for sessions

B2) “History” page (UI shell)

Goal: add a docs-style page that lists past sessions.

Menu

Add a new menu item: History

Empty state

If no sessions exist: show “No history yet” + guidance.

Filters (simple)

Test type: Reaction / Go-No-Go

Mode: All / Baseline / Check / Training

Acceptance criteria

Page exists and routing works.

Empty state shows correctly.

Commit suggestion

Add History page shell and navigation

B3) Render session list

Goal: show a clear list of sessions with key metrics.

Display fields

Timestamp (formatted)

Mode label (baseline/check/training)

Average + SD (reaction and gonogo)

Errors (gonogo): misses, false alarms, false starts

Tags summary (sleep/stress if set)

Sorting

Newest first

Acceptance criteria

List renders.

Filters work.

Language toggle updates labels.

Commit suggestion

Render session history list with filters

B4) Add tags UI (sleep/stress/context)

Goal: allow adding optional context tags before saving a session.

Minimal UI (recommended)

Context dropdown: baseline / check / training

Sleep 0–5

Stress 0–5

Note (optional short text)

Where to place

Near the start controls (small “Context (optional)” panel)

Acceptance criteria

Tags are saved into history record.

Tags are shown in History list.

Commit suggestion

Add optional context tags to sessions

B5) Add a simple trend visualization (minimal)

Goal: show “baseline band + check points” (very high credibility boost).

Minimum viable chart

Show baseline mean (and maybe ±1 SD band)

Plot check sessions as points/values over time

If you want ultra-minimal

No chart yet: show a compact “Recent checks” list

avgMs vs baselineAvgMs (+delta)

Acceptance criteria

Non-technical readers can see “stable vs drifting” at a glance.

Commit suggestion

Add baseline vs check trend view (minimal)

Optional safety improvements (small wins)

Translate all remaining dynamic status strings through i18n

Confirm dialog for “Clear history”

Add “Export (copy JSON)” button (optional placeholder)

Add “Device warning” (mobile vs desktop baseline differences)

Suggested small commit sequence (recommended)

History storage model (save sessions)

History page shell + navigation

Render session list + filters

Add context tags UI + persistence

Minimal trend view (baseline band vs checks)

Done definition for Week 3

Week 3 is considered done when:

History exists and shows sessions

Sessions have optional tags

You can demonstrate “baseline → checks over time”

The UI stays calm and non-judgmental (no “fail”)