# FCE Roadmap (MVP v0.1)

## Status summary (what exists now)
You have a working web prototype with:
- Reaction Time module (baseline + check, session stats, baseline list + clear)
- Go / No-Go module (baseline + check, inhibition/error metrics)
- Local persistence (localStorage)
- Basic integrity signals (false starts, misses, error patterns; baseline gating)
- In-app documentation + navigation (Home/About/How to Use/FAQ/Norwegian Context)
- Language toggle (EN/NO) for UI + docs
- Session history with context tags
- Local JSON export
- Trend view (baseline band + recent checks)

---

## Goal (v0.1)
Demonstrate the core FCE loop:
1) Create a baseline under normal functioning conditions (3–5 sessions)
2) Run a short check (2–4 min)
3) Compare "today vs baseline" in a clear, neutral way
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
- ✅ "Within normal range"
- ✅ "Slightly below normal"
- ✅ "Significantly below normal"
Based on deviation from baseline (no population averages).

### 4) Integrity (basic)
- ✅ False start detection
- ✅ Go/No-Go error types (miss / false alarm / correct reject)
- ⏳ Add lightweight "quality flags":
  - extreme inconsistency
  - repeated low-effort patterns
  - too many invalid trials

### 5) History
- ✅ History view (per test type)
- ✅ Optional tags per session (sleep, stress, note)
- ✅ Simple trend visualization (baseline band + recent checks)
- ✅ Local JSON export (manual, user-controlled)

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

### Week 3 (COMPLETED — "Instrument feel achieved")
**Completed:**
- ✅ Session history model
- ✅ History page with filters
- ✅ Context tags
- ✅ Export (copy JSON)
- ✅ Trend view (baseline band + checks)

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

## v0.2 (Not started)

Focus areas to be evaluated:
- One additional test module
- Pilot feedback integration
- Documentation for institutional pilots

No timeline committed.
