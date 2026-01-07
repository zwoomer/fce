document.addEventListener("DOMContentLoaded", () => {
const startBaselineBtn = document.getElementById("startBaselineBtn");
const startCheckBtn = document.getElementById("startCheckBtn");
const baselineInfo = document.getElementById("baselineInfo");
const clearBaselineBtn = document.getElementById("clearBaselineBtn");
const baselineList = document.getElementById("baselineList");

const BASELINE_KEY = "fce_baseline_reaction_v1";

const resetBtn = document.getElementById("resetBtn");
const testArea = document.getElementById("testArea");

const trialCountInput = document.getElementById("trialCount");
const progress = document.getElementById("progress");
const trialList = document.getElementById("trialList");
const summary = document.getElementById("summary");

let mode = null; // "baseline" | "check"

let startTime = null;
let timeoutId = null;

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

  if (!startTime) {
    // false start (clicked too early)
    clearTimeout(timeoutId);
    recordResult(null);
    nextTrial();
    return;
  }

  const rt = Math.round(performance.now() - startTime);
  recordResult(rt);
  nextTrial();
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
  trialIndex++;

  if (trialIndex > totalTrials) {
    endSession();
    return;
  }

  updateProgress();

  testArea.style.background = "red";
  testArea.textContent = "Wait...";

  const delay = Math.random() * 2000 + 1000; // 1–3 seconds
  timeoutId = setTimeout(() => {
    testArea.style.background = "green";
    testArea.textContent = "CLICK!";
    startTime = performance.now();
  }, delay);
}

function recordResult(value) {
  results.push(value);

  const li = document.createElement("li");
  const n = results.length;

  if (value === null) {
    li.textContent = `Trial ${n}: false start (too early)`;
  } else {
    li.textContent = `Trial ${n}: ${value} ms`;
  }

  trialList.appendChild(li);
}

function endSession() {
  inSession = false;

  testArea.classList.add("hidden");
  testArea.textContent = "";

  trialCountInput.disabled = false;
  startBaselineBtn.disabled = false;
  startCheckBtn.disabled = false;

  updateProgress(true);

  const valid = results.filter(x => typeof x === "number");
  if (valid.length === 0) {
    summary.textContent = "Session invalid (no valid trials).";
    return;
  }

  const sessionMean = mean(valid);
  const sessionSD = stddev(valid);

  if (mode === "baseline") {
    const sessions = loadBaseline();
    sessions.push({
      mean: sessionMean,
      sd: sessionSD,
      trials: valid.length,
      timestamp: new Date().toISOString()
    });
    saveBaseline(sessions);
    updateBaselineInfo();

    summary.textContent =
      `Baseline session saved. Mean: ${sessionMean.toFixed(0)} ms | ` +
      `SD: ${sessionSD.toFixed(0)} ms`;

  } else if (mode === "check") {
    renderCheckResult(sessionMean, sessionSD);
  }

  mode = null;
}

function renderCheckResult(todayMean, todaySD) {
    const sessions = loadBaseline();
  
    if (sessions.length < 3) {
      summary.textContent =
        "Not enough baseline sessions. Please record at least 3 baseline sessions.";
      return;
    }
  
    const baselineMean = mean(sessions.map(s => s.mean));
    const baselineSD = mean(sessions.map(s => s.sd));
  
    let status;
    if (todayMean <= baselineMean + baselineSD) {
      status = "Within normal range";
    } else if (todayMean <= baselineMean + 2 * baselineSD) {
      status = "Slightly below normal";
    } else {
      status = "Significantly below normal";
    }
  
    summary.textContent =
      `Today mean: ${todayMean.toFixed(0)} ms | ` +
      `Baseline mean: ${baselineMean.toFixed(0)} ms | ` +
      `Baseline SD: ${baselineSD.toFixed(0)} ms | ` +
      `Status: ${status}`;
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
    const raw = localStorage.getItem(BASELINE_KEY);
    return raw ? JSON.parse(raw) : [];
  }
  
  function saveBaseline(sessions) {
    localStorage.setItem(BASELINE_KEY, JSON.stringify(sessions));
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