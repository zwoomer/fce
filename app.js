const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const testArea = document.getElementById("testArea");

const trialCountInput = document.getElementById("trialCount");
const progress = document.getElementById("progress");
const trialList = document.getElementById("trialList");
const summary = document.getElementById("summary");

let startTime = null;
let timeoutId = null;

let inSession = false;
let totalTrials = 5;
let trialIndex = 0;
let results = []; // stores reaction times (ms); null for false start

startBtn.addEventListener("click", () => {
  if (inSession) return;

  totalTrials = clampInt(parseInt(trialCountInput.value, 10), 3, 20);
  trialCountInput.value = totalTrials;

  inSession = true;
  trialIndex = 0;
  results = [];

  trialList.innerHTML = "";
  summary.textContent = "";
  testArea.classList.remove("hidden");

  startBtn.disabled = true;
  trialCountInput.disabled = true;

  nextTrial();
});

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
  startBtn.disabled = false;
  trialCountInput.disabled = false;

  testArea.classList.add("hidden");
  testArea.textContent = "";

  updateProgress(true);
  renderSummary();
}

function renderSummary() {
  const valid = results.filter((x) => typeof x === "number");

  const falseStarts = results.length - valid.length;

  if (valid.length === 0) {
    summary.textContent = `Session finished. All attempts were false starts.`;
    return;
  }

  const avg = mean(valid);
  const best = Math.min(...valid);
  const worst = Math.max(...valid);
  const sd = stddev(valid);

  summary.textContent =
    `Average: ${avg.toFixed(0)} ms | Best: ${best} ms | Worst: ${worst} ms | ` +
    `Consistency (SD): ${sd.toFixed(0)} ms` +
    (falseStarts > 0 ? ` | False starts: ${falseStarts}` : "");
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

  startBtn.disabled = false;
  trialCountInput.disabled = false;
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