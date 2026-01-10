# FCE — Functional Cognition & Execution

FCE is a **baseline-relative functional assessment instrument** for measuring cognitive and execution performance over time.

Rather than comparing users to population averages, FCE compares performance **against the individual’s own baseline**, under consistent conditions, on the same device.

FCE is designed to support **human interpretation**, not automated judgment.

---

## Current status

**Latest release:** v0.2.0  
**Status:** Stable (frozen)

---

## What FCE measures (v0.2.0)

### 1) Reaction Time
Measures simple response speed and consistency.

- Average reaction time (ms)
- Variability (SD)
- False starts
- Personal baseline and deviation-based status

---

### 2) Go / No-Go
Measures inhibitory control under time pressure.

- GO response speed (avg / SD)
- Misses
- False alarms
- False starts
- Baseline-relative evaluation

---

### 3) Divided Attention (dual-task)
Measures execution quality under split attention.

Primary task:
- Go / No-Go execution (speed + inhibition)

Secondary task:
- Visual count (brief blue flashes during trials)

Evaluation combines:
- Reaction speed
- Inhibitory control
- Attention accuracy

The overall status reflects the **worst deviation** among these signals.

---

## Modes of use

FCE supports three explicit session modes:

- **Baseline** — establish personal normal performance
- **Check** — compare current performance to baseline
- **Training** — practice only (never updates baseline)

**Mode is determined solely by the action button clicked**, not by settings or context.

---

## Context metadata

Optional context fields are saved with each session:

- Sleep
- Stress
- Note

Context is **metadata only** and **does not affect scoring or comparison**.  
It exists to support later human interpretation.

---

## History & trends

- Per-test session history
- Mode-aware filtering (Baseline / Check / Training)
- Clear handling of invalid or low-quality sessions
- Minimal trend view showing:
  - Baseline band (±1 SD)
  - Recent check sessions

---

## Data & privacy

- Local-only storage (browser)
- No accounts, no servers
- Manual JSON export only
- Exported data is raw session data — no conclusions generated

---

## Non-goals

FCE is **not**:

- A medical or legal diagnostic tool
- A substance detection system
- A population-norm assessment
- A decision engine

Interpretation and decisions remain human-led.

---

## Intended use

FCE is suitable for:

- Functional self-monitoring
- Performance and fatigue research
- Traffic and workplace safety discussions
- Pilot studies and institutional evaluation

---

## Versioning

- v0.1 — core baseline-relative instrument
- v0.2.0 — Divided Attention module + mode coherence + baseline integrity

Future work will continue under v0.2.x and v0.3 planning.