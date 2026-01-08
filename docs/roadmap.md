# FCE Roadmap (MVP v0.1)

## Status summary (what exists now)
You have a working web prototype with:
- Reaction Time module (baseline + check, session stats, baseline list + clear)
- Go / No-Go module (baseline + check, inhibition/error metrics)
- Local persistence (localStorage)
- Basic integrity signals (false starts, misses, error patterns; baseline gating)
- In-app documentation + navigation (Home/About/How to Use/FAQ/Norwegian Context)
- Language toggle (EN/NO) for UI + docs

---

## Goal (v0.1)
Demonstrate the core FCE loop:
1) Create a sober baseline (3–5 sessions)
2) Run a short check (2–4 min)
3) Compare “today vs baseline” in a clear, neutral way
4) Show basic history trends

## Non-goals (v0.1)
- No legal claims / no medical device positioning
- No cannabis-specific messaging
- No complex anti-cheat ML (only basic integrity checks)
- No accounts, payments, or public release

---

## MVP Modules (v0.1)

### 1) Test battery (2–4 min total)
- ✅ Simple Reaction Time
- ✅ Go / No-Go (inhibitory control)
- ⏳ Divided Attention (dual-task)
- ⏳ Precision taps (speed + accuracy)

### 2) Baseline engine
- ✅ Collect 3–5 baseline sessions per test
- ✅ Compute baseline stats per test:
  - average
  - variability (consistency / SD)
- ✅ Store baseline locally
- ⏳ Baseline hygiene:
  - prevent flagged sessions from updating baseline (expand rules)

### 3) Scoring (relative to the user)
- ✅ “Within normal range”
- ✅ “Slightly below normal”
- ✅ “Significantly below normal”
Based on deviation from baseline (no population averages).

### 4) Integrity (basic)
- ✅ False start detection
- ✅ Go/No-Go error types (miss / false alarm / correct reject)
- ⏳ Add lightweight “quality flags”:
  - extreme inconsistency
  - repeated low-effort patterns
  - too many invalid trials

### 5) History
- ⏳ History view (per test type)
- ⏳ Optional tags per session (sleep, stress, context)
- ⏳ Simple trend visualization (baseline band + check points)

---

## Milestones (updated)

### Week 1–2 (DONE)
- ✅ Repo + docs foundation
- ✅ Web prototype platform
- ✅ Reaction Time module
- ✅ Go/No-Go module
- ✅ Baseline storage + check scoring
- ✅ UI/UX: topbar + menu + docs pages
- ✅ EN/NO language toggle (UI + docs)

### Week 3 (NEXT: “Make it feel like an instrument”)
**Priority: History + tags**
- ⏳ Add session history model (store each session result, not only baseline)
- ⏳ Add “History” page (filter by test type + baseline/check)
- ⏳ Add optional tags: sleep (0–5), stress (0–5), context (baseline/check/training)
- ⏳ Add export placeholder (copy JSON) — optional

### Week 4 (NEXT after History)
**Priority: one more module**
- ⏳ Divided Attention (simple dual-task)
- ⏳ Polish UX for demo (copy, tooltips, consistency warnings)

---

## Deliverable for NAV / partners
A clickable demo + short concept note:
- What it is (function testing, baseline-relative)
- Not substance-specific
- Why it matters (traffic, workplace, performance)
- What exists now (prototype + bilingual docs)
- Next steps (pilot + validation)

---

## Suggested next 5 commits (small + safe)
1) Add “History” view shell (empty state + routing)
2) Persist each completed session to localStorage (per test type)
3) Render session list (date, avg, SD, errors) + filters
4) Add optional tags UI + store tags
5) Add simple trend chart OR baseline band + check points (minimal)