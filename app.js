document.addEventListener("DOMContentLoaded", () => {
const startBaselineBtn = document.getElementById("startBaselineBtn");
const startCheckBtn = document.getElementById("startCheckBtn");
const baselineInfo = document.getElementById("baselineInfo");
const clearBaselineBtn = document.getElementById("clearBaselineBtn");
const baselineList = document.getElementById("baselineList");
const testType = document.getElementById("testType");

const resetBtn = document.getElementById("resetBtn");
const testArea = document.getElementById("testArea");

const trialCountInput = document.getElementById("trialCount");
const progress = document.getElementById("progress");
const trialList = document.getElementById("trialList");
const summary = document.getElementById("summary");

let mode = null; // "baseline" | "check"

let startTime = null;
let timeoutId = null;

let currentStim = null; // "go" | "nogo"
let responded = false;

let inSession = false;
let totalTrials = 5;
let trialIndex = 0;
let results = []; // stores reaction times (ms); null for false start

startBaselineBtn.addEventListener("click", () => {
    if (inSession) return;
    mode = "baseline";
    beginSession();
  });
  
  startCheckBtn.addEventListener("click", () => {
    if (inSession) return;
    mode = "check";
    beginSession();
  });

  function baselineKey() {
    return testType.value === "gonogo"
      ? "fce_baseline_gonogo_v1"
      : "fce_baseline_reaction_v1";
  }

  function beginSession() {
    totalTrials = clampInt(parseInt(trialCountInput.value, 10), 3, 20);
    trialCountInput.value = totalTrials;
  
    inSession = true;
    trialIndex = 0;
    results = [];
  
    trialList.innerHTML = "";
    summary.textContent = "";
    testArea.classList.remove("hidden");
  
    trialCountInput.disabled = true;
    startBaselineBtn.disabled = true;
    startCheckBtn.disabled = true;
  
    nextTrial();
  }

resetBtn.addEventListener("click", () => {
  hardReset();
});

testArea.addEventListener("click", () => {
    if (!inSession) return;
  
    // If we haven't started stimulus yet, it's a false start
    if (!startTime) {
      clearTimeout(timeoutId);
      recordResult({ type: "false_start" });
      nextTrial();
      return;
    }
  
    // Mark responded so auto-window doesn't also record
    responded = true;
  
    const rt = Math.round(performance.now() - startTime);
  
    if (testType.value === "reaction") {
      recordResult({ type: "rt", rt });
      nextTrial();
      return;
    }
  
    // Go/No-Go
    if (currentStim === "go") {
      recordResult({ type: "go", rt });
    } else {
      // clicked on NO-GO => false alarm
      recordResult({ type: "false_alarm", rt });
    }
  
    nextTrial();
  });  

testType.addEventListener("change", () => {
    hardReset();
    updateBaselineInfo();
  });

clearBaselineBtn.addEventListener("click", () => {
    const sessions = loadBaseline();
    if (sessions.length === 0) return;
  
    const ok = confirm("Clear all baseline sessions? This cannot be undone.");
    if (!ok) return;
  
    saveBaseline([]);
    updateBaselineInfo();
  });

  function nextTrial() {
    startTime = null;
    currentStim = null;
    responded = false;
  
    trialIndex++;
  
    if (trialIndex > totalTrials) {
      endSession();
      return;
    }
  
    updateProgress();
  
    testArea.style.background = "red";
    testArea.textContent = "Wait...";
  
    const delay = Math.random() * 1200 + 600; // 0.6–1.8 sec (faster for go/no-go)
  
    timeoutId = setTimeout(() => {
      if (testType.value === "reaction") {
        // Reaction Time: always GO
        testArea.style.background = "green";
        testArea.textContent = "CLICK!";
        startTime = performance.now();
        currentStim = "go";
        return;
      }
  
      // Go/No-Go: 70% GO, 30% NO-GO
      const isGo = Math.random() < 0.7;
      currentStim = isGo ? "go" : "nogo";
  
      testArea.style.background = isGo ? "green" : "red";
      testArea.textContent = isGo ? "GO (click)" : "NO-GO (don’t click)";
  
      startTime = performance.now();
  
      // Auto-finish trial after window (miss detection)
      const windowMs = 900;
      setTimeout(() => {
        if (!inSession) return;
        if (responded) return;
  
        if (currentStim === "go") {
          // Miss: didn't click in time
          recordResult({ type: "miss" });
        } else {
          // Correct inhibition (no click)
          recordResult({ type: "correct_reject" });
        }
        nextTrial();
      }, windowMs);
    }, delay);
  }  

  function recordResult(entry) {
    results.push(entry);
  
    const li = document.createElement("li");
    const n = results.length;
  
    if (testType.value === "reaction") {
      if (entry.type === "false_start") {
        li.textContent = `Trial ${n}: false start (too early)`;
      } else {
        li.textContent = `Trial ${n}: ${entry.rt} ms`;
      }
      trialList.appendChild(li);
      return;
    }
  
    // Go/No-Go display
    switch (entry.type) {
      case "go":
        li.textContent = `Trial ${n}: GO hit — ${entry.rt} ms`;
        break;
      case "miss":
        li.textContent = `Trial ${n}: GO miss (no click)`;
        break;
      case "correct_reject":
        li.textContent = `Trial ${n}: NO-GO correct (no click)`;
        break;
      case "false_alarm":
        li.textContent = `Trial ${n}: NO-GO false alarm — ${entry.rt} ms`;
        break;
      case "false_start":
        li.textContent = `Trial ${n}: false start (clicked during wait)`;
        break;
      default:
        li.textContent = `Trial ${n}: unknown`;
    }
  
    trialList.appendChild(li);
  }  

  function endSession() {
    inSession = false;
  
    // Hide test area
    testArea.classList.add("hidden");
    testArea.textContent = "";
  
    // Re-enable controls
    trialCountInput.disabled = false;
    startBaselineBtn.disabled = false;
    startCheckBtn.disabled = false;
  
    updateProgress(true);
  
    const isReaction = testType.value === "reaction";
  
    // ---- Compute session metrics depending on test ----
    let sessionPayload;
  
    if (isReaction) {
      const rts = results.filter(e => e && e.type === "rt").map(e => e.rt);
      const falseStarts = results.filter(e => e && e.type === "false_start").length;
  
      if (rts.length === 0) {
        summary.textContent = "Session invalid (no valid reaction time trials).";
        mode = null;
        return;
      }
  
      sessionPayload = {
        mean: mean(rts),
        sd: stddev(rts),
        trials: rts.length,
        falseStarts
      };
    } else {
      // Go/No-Go metrics
      const goHits = results.filter(e => e && e.type === "go").map(e => e.rt);
      const misses = results.filter(e => e && e.type === "miss").length;
      const falseAlarms = results.filter(e => e && e.type === "false_alarm").length;
      const falseStarts = results.filter(e => e && e.type === "false_start").length;
  
      if (goHits.length === 0) {
        summary.textContent = "Session invalid (no GO hits recorded).";
        mode = null;
        return;
      }
  
      sessionPayload = {
        mean: mean(goHits),      // mean RT on GO hits
        sd: stddev(goHits),      // consistency on GO hits
        trials: goHits.length,
        misses,
        falseAlarms,
        falseStarts
      };
    }
  
    // ---- Baseline mode: store payload ----
    if (mode === "baseline") {
      const sessions = loadBaseline();
  
      sessions.push({
        ...sessionPayload,
        timestamp: new Date().toISOString()
      });
  
      saveBaseline(sessions);
      updateBaselineInfo();
  
      if (isReaction) {
        summary.textContent =
          `Baseline session saved. Mean: ${sessionPayload.mean.toFixed(0)} ms | ` +
          `SD: ${sessionPayload.sd.toFixed(0)} ms` +
          (sessionPayload.falseStarts ? ` | False starts: ${sessionPayload.falseStarts}` : "");
      } else {
        summary.textContent =
          `Baseline session saved. GO mean: ${sessionPayload.mean.toFixed(0)} ms | ` +
          `SD: ${sessionPayload.sd.toFixed(0)} ms` +
          ` | Misses: ${sessionPayload.misses} | False alarms: ${sessionPayload.falseAlarms}` +
          (sessionPayload.falseStarts ? ` | False starts: ${sessionPayload.falseStarts}` : "");
      }
  
      mode = null;
      return;
    }
  
    // ---- Check mode: compare to baseline ----
    if (mode === "check") {
      const sessions = loadBaseline();
  
      if (sessions.length < 3) {
        summary.textContent =
          "Not enough baseline sessions. Please record at least 3 baseline sessions.";
        mode = null;
        return;
      }
  
      const baselineMean = mean(sessions.map(s => s.mean));
      const baselineSD = mean(sessions.map(s => s.sd));
  
      let status;
      if (sessionPayload.mean <= baselineMean + baselineSD) {
        status = "Within normal range";
      } else if (sessionPayload.mean <= baselineMean + 2 * baselineSD) {
        status = "Slightly below normal";
      } else {
        status = "Significantly below normal";
      }
  
      if (isReaction) {
        summary.textContent =
          `Today mean: ${sessionPayload.mean.toFixed(0)} ms | ` +
          `Baseline mean: ${baselineMean.toFixed(0)} ms | ` +
          `Baseline SD: ${baselineSD.toFixed(0)} ms | ` +
          `Status: ${status}` +
          (sessionPayload.falseStarts ? ` | False starts: ${sessionPayload.falseStarts}` : "");
      } else {
        // For Go/No-Go, also show error counts clearly.
        // Optional: compare errors vs baseline averages (simple, explainable)
        const baselineMissAvg = mean(sessions.map(s => (typeof s.misses === "number" ? s.misses : 0)));
        const baselineFAAvg = mean(sessions.map(s => (typeof s.falseAlarms === "number" ? s.falseAlarms : 0)));
  
        summary.textContent =
          `Today GO mean: ${sessionPayload.mean.toFixed(0)} ms | ` +
          `Baseline mean: ${baselineMean.toFixed(0)} ms | ` +
          `Baseline SD: ${baselineSD.toFixed(0)} ms | ` +
          `Status: ${status} | ` +
          `Misses: ${sessionPayload.misses} (baseline avg ${baselineMissAvg.toFixed(1)}) | ` +
          `False alarms: ${sessionPayload.falseAlarms} (baseline avg ${baselineFAAvg.toFixed(1)})` +
          (sessionPayload.falseStarts ? ` | False starts: ${sessionPayload.falseStarts}` : "");
      }
  
      mode = null;
      return;
    }
  
    // Fallback
    mode = null;
}  

function updateProgress(isDone = false) {
  if (!inSession && !isDone) {
    progress.textContent = "";
    return;
  }

  const done = results.length;
  const total = totalTrials;

  if (isDone) {
    progress.textContent = `Session complete (${done}/${total} trials).`;
  } else {
    progress.textContent = `Trial ${Math.min(trialIndex, total)}/${total} (completed: ${done})`;
  }
}

function hardReset() {
  clearTimeout(timeoutId);

  inSession = false;
  startTime = null;
  results = [];
  trialIndex = 0;

  testArea.classList.add("hidden");
  testArea.textContent = "";
  testArea.style.background = "red";

  trialList.innerHTML = "";
  summary.textContent = "";
  progress.textContent = "";


  trialCountInput.disabled = false;
  startBaselineBtn.disabled = false;
  startCheckBtn.disabled = false;
}

function loadBaseline() {
    const raw = localStorage.getItem(baselineKey());
    return raw ? JSON.parse(raw) : [];
  }
  
  function saveBaseline(sessions) {
    localStorage.setItem(baselineKey(), JSON.stringify(sessions));
  }
  
  function updateBaselineInfo() {
    const sessions = loadBaseline();
  
    // Clear list UI
    baselineList.innerHTML = "";
  
    if (sessions.length === 0) {
      baselineInfo.textContent = "No baseline sessions recorded.";
      clearBaselineBtn.disabled = true;
      return;
    }
  
    clearBaselineBtn.disabled = false;
  
    const means = sessions.map(s => s.mean);
    const sds = sessions.map(s => s.sd);
  
    const meanAvg = mean(means);
    const sdAvg = mean(sds);
  
    baselineInfo.textContent =
      `${sessions.length} sessions | ` +
      `Baseline mean: ${meanAvg.toFixed(0)} ms | ` +
      `Baseline SD: ${sdAvg.toFixed(0)} ms`;
  
    // Render newest first
    const newestFirst = [...sessions].reverse();
  
    for (const s of newestFirst) {
      const li = document.createElement("li");
      li.textContent =
        `${formatTime(s.timestamp)} — mean ${s.mean.toFixed(0)} ms, SD ${s.sd.toFixed(0)} ms (${s.trials} trials)`;
      baselineList.appendChild(li);
    }
  }
  
  function formatTime(iso) {
    // Example output: "2026-01-07 21:13"
    const d = new Date(iso);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  }  

function clampInt(n, min, max) {
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function mean(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function stddev(arr) {
  const m = mean(arr);
  const variance = arr.reduce((sum, x) => sum + (x - m) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

updateBaselineInfo();
});