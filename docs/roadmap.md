# FCE Roadmap (MVP v0.1)

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

## MVP Modules

### 1) Test battery (2–4 min total)
- Simple Reaction Time
- Go / No-Go (inhibitory control)
- Divided Attention (dual-task)
- Precision taps (speed + accuracy)

### 2) Baseline engine
- Collect 3–5 baseline sessions
- Compute baseline stats per test:
  - average
  - error rate
  - variability (consistency)
- Store baseline locally

### 3) Scoring (relative to the user)
- “Within normal range”
- “Slightly below normal”
- “Significantly below normal”
Based on deviation from baseline (no population averages).

### 4) Integrity (basic)
- Flag sessions with extreme inconsistency or obviously low-effort patterns
- Prevent flagged sessions from updating baseline

### 5) History
- Simple timeline of sessions
- Optional tags (sleep, stress, alcohol, medication, etc.)

---

## Milestones

### Week 1
- Repo + docs foundation
- Decide prototype platform (web first)
- Implement Reaction Time test

### Week 2
- Add Go/No-Go
- Add basic baseline storage (local)

### Week 3
- Add scoring + “today vs baseline” summary screen

### Week 4
- Add history view + tags
- Polish UX for demo

---

## Deliverable for NAV / partners
A clickable demo + short concept note:
- What it is (function testing)
- Not substance-specific
- Why it matters (traffic, workplace, performance)
- What exists now (prototype)
- Next steps (pilot + validation)