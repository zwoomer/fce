document.addEventListener("DOMContentLoaded", () => {
// Language system
const LANG_KEY = "fce_lang_v1";
let currentLang = localStorage.getItem(LANG_KEY) || "en";

const I18N = {
  en: {
    ui: {
      test: "Test",
      trials: "Trials",
      addBaseline: "Add Baseline Session",
      runCheck: "Run Functional Check",
      reset: "Reset",
      clearBaseline: "Clear baseline",
    },
    status: {
      within: "Within normal range",
      slightly: "Slightly below normal",
      significantly: "Significantly below normal",
      noBaseline: "No baseline yet — add baseline sessions first.",
    },
    baseline: {
      noSessions: "No baseline sessions recorded.",
      sessions: "sessions",
      økter: "sessions",
    },
  },
  no: {
    ui: {
      test: "Test",
      trials: "Forsøk",
      addBaseline: "Legg til baseline-økt",
      runCheck: "Kjør funksjonssjekk",
      reset: "Nullstill",
      clearBaseline: "Slett baseline",
    },
    status: {
      within: "Innenfor normalområdet",
      slightly: "Litt under normalområdet",
      significantly: "Betydelig under normalområdet",
      noBaseline: "Ingen baseline ennå — legg til baseline-økter først.",
    },
    baseline: {
      noSessions: "Ingen baseline-økter er registrert.",
      sessions: "økter",
      økter: "økter",
    },
  },
};

function t(path) {
  const [group, key] = path.split(".");
  return (I18N[currentLang] && I18N[currentLang][group] && I18N[currentLang][group][key]) || path;
}

// Helper functions for bilingual trial and session strings
function getTrialProgress(current, total, completed) {
  if (currentLang === "no") {
    return `Forsøk ${current}/${total} (fullført: ${completed})`;
  }
  return `Trial ${current}/${total} (completed: ${completed})`;
}

function getSessionComplete(done, total) {
  if (currentLang === "no") {
    return `Økt fullført (${done}/${total} forsøk).`;
  }
  return `Session complete (${done}/${total} trials).`;
}

function getTrialText(n, entry, testType) {
  if (currentLang === "no") {
    if (testType === "reaction") {
      if (entry.type === "false_start") {
        return `Forsøk ${n}: feilstart (for tidlig)`;
      } else {
        return `Forsøk ${n}: ${entry.rt} ms`;
      }
    }
    // Go/No-Go
    switch (entry.type) {
      case "go":
        return `Forsøk ${n}: GO-respons — ${entry.rt} ms`;
      case "miss":
        return `Forsøk ${n}: GO bom (ingen klikk)`;
      case "correct_reject":
        return `Forsøk ${n}: NO-GO korrekt (ingen klikk)`;
      case "false_alarm":
        return `Forsøk ${n}: NO-GO inhibisjonsfeil — ${entry.rt} ms`;
      case "false_start":
        return `Forsøk ${n}: feilstart (klikket under ventetid)`;
      default:
        return `Forsøk ${n}: ukjent`;
    }
  } else {
    // English
    if (testType === "reaction") {
      if (entry.type === "false_start") {
        return `Trial ${n}: false start (too early)`;
      } else {
        return `Trial ${n}: ${entry.rt} ms`;
      }
    }
    // Go/No-Go
    switch (entry.type) {
      case "go":
        return `Trial ${n}: GO response — ${entry.rt} ms`;
      case "miss":
        return `Trial ${n}: GO miss (no click)`;
      case "correct_reject":
        return `Trial ${n}: NO-GO correct (no click)`;
      case "false_alarm":
        return `Trial ${n}: NO-GO inhibitory error — ${entry.rt} ms`;
      case "false_start":
        return `Trial ${n}: false start (clicked during wait)`;
      default:
        return `Trial ${n}: unknown`;
    }
  }
}

// Helper functions for bilingual session summary strings
function getSessionInvalidNoReaction() {
  return currentLang === "no" 
    ? "Økt ugyldig (ingen gyldige reaksjonstidforsøk)."
    : "Session invalid (no valid reaction time trials).";
}

function getSessionInvalidNoGo() {
  return currentLang === "no"
    ? "Økt ugyldig (ingen GO-responser registrert)."
    : "Session invalid (no GO responses recorded).";
}

function getBaselineNotSaved() {
  return currentLang === "no"
    ? "Baseline-økt ikke lagret: for få gyldige GO-responser. Øk antall forsøk for stabile resultater."
    : "Baseline session not saved: too few valid GO responses. Increase trials for stable results.";
}

function getNotEnoughBaseline() {
  return currentLang === "no"
    ? "Ikke nok baseline-økter. Vennligst registrer minst 3 baseline-økter."
    : "Not enough baseline sessions. Please record at least 3 baseline sessions.";
}

function getBaselineSavedReaction(mean, sd, falseStarts, qualityNote) {
  const falseStartsText = falseStarts 
    ? (currentLang === "no" ? ` | Feilstarter: ${falseStarts}` : ` | False starts: ${falseStarts}`)
    : "";
  if (currentLang === "no") {
    return `Baseline-økt lagret. Gjennomsnitt: ${mean.toFixed(0)} ms | SD: ${sd.toFixed(0)} ms${falseStartsText}${qualityNote}`;
  }
  return `Baseline session saved. Mean: ${mean.toFixed(0)} ms | SD: ${sd.toFixed(0)} ms${falseStartsText}${qualityNote}`;
}

function getBaselineSavedGoNoGo(mean, sd, misses, falseAlarms, falseStarts, qualityNote) {
  const falseStartsText = falseStarts
    ? (currentLang === "no" ? ` | Feilstarter: ${falseStarts}` : ` | False starts: ${falseStarts}`)
    : "";
  if (currentLang === "no") {
    return `Baseline-økt lagret. GO-gjennomsnitt: ${mean.toFixed(0)} ms | SD: ${sd.toFixed(0)} ms | Bom: ${misses} | Inhibisjonsfeil: ${falseAlarms}${falseStartsText}${qualityNote}`;
  }
  return `Baseline session saved. GO mean: ${mean.toFixed(0)} ms | SD: ${sd.toFixed(0)} ms | Misses: ${misses} | Inhibitory errors: ${falseAlarms}${falseStartsText}${qualityNote}`;
}

function getCheckReaction(mean, baselineMean, baselineSD, status, falseStarts, qualityNote) {
  const falseStartsText = falseStarts
    ? (currentLang === "no" ? ` | Feilstarter: ${falseStarts}` : ` | False starts: ${falseStarts}`)
    : "";
  if (currentLang === "no") {
    return `Dagens gjennomsnitt: ${mean.toFixed(0)} ms | Baseline-gjennomsnitt: ${baselineMean.toFixed(0)} ms | Baseline SD: ${baselineSD.toFixed(0)} ms | Status: ${status}${falseStartsText}${qualityNote}`;
  }
  return `Today mean: ${mean.toFixed(0)} ms | Baseline mean: ${baselineMean.toFixed(0)} ms | Baseline SD: ${baselineSD.toFixed(0)} ms | Status: ${status}${falseStartsText}${qualityNote}`;
}

function getCheckGoNoGo(mean, baselineMean, baselineSD, status, misses, baselineMissAvg, falseAlarms, baselineFAAvg, falseStarts, qualityNote) {
  const falseStartsText = falseStarts
    ? (currentLang === "no" ? ` | Feilstarter: ${falseStarts}` : ` | False starts: ${falseStarts}`)
    : "";
  if (currentLang === "no") {
    return `Dagens GO-gjennomsnitt: ${mean.toFixed(0)} ms | Baseline-gjennomsnitt: ${baselineMean.toFixed(0)} ms | Baseline SD: ${baselineSD.toFixed(0)} ms | Status: ${status} | Bom: ${misses} (baseline snitt ${baselineMissAvg.toFixed(1)}) | Inhibisjonsfeil: ${falseAlarms} (baseline snitt ${baselineFAAvg.toFixed(1)})${falseStartsText}${qualityNote}`;
  }
  return `Today GO mean: ${mean.toFixed(0)} ms | Baseline mean: ${baselineMean.toFixed(0)} ms | Baseline SD: ${baselineSD.toFixed(0)} ms | Status: ${status} | Misses: ${misses} (baseline avg ${baselineMissAvg.toFixed(1)}) | Inhibitory errors: ${falseAlarms} (baseline avg ${baselineFAAvg.toFixed(1)})${falseStartsText}${qualityNote}`;
}

function reRenderTrialList() {
  // Re-render all trials with current language
  if (results.length === 0) return;
  
  trialList.innerHTML = "";
  results.forEach((entry, idx) => {
    if (!entry) return;
    const li = document.createElement("li");
    const n = idx + 1;
    li.textContent = getTrialText(n, entry, testType.value);
    trialList.appendChild(li);
  });
}

function applyLangUI() {
  // 1) Toggle docs language blocks
  document.querySelectorAll(".lang-en").forEach(el => el.classList.toggle("hidden", currentLang !== "en"));
  document.querySelectorAll(".lang-no").forEach(el => el.classList.toggle("hidden", currentLang !== "no"));

  // 2) Update any elements that opt-in via data-i18n (C-lite)
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });

  // 3) Toggle active state on buttons
  const enBtn = document.getElementById("langEnBtn");
  const noBtn = document.getElementById("langNoBtn");
  if (enBtn && noBtn) {
    enBtn.classList.toggle("active", currentLang === "en");
    noBtn.classList.toggle("active", currentLang === "no");
  }

  // 4) Re-render trial list and progress if in session or has results
  if (inSession || results.length > 0) {
    reRenderTrialList();
    updateProgress(results.length === totalTrials);
  }
  
  // 5) Update summary if it exists and is not empty
  if (summary && summary.textContent) {
    // Summary is dynamically generated, so we need to re-generate it
    // This happens automatically when endSession is called, but if we're viewing
    // a completed session, we'd need to re-run endSession logic - for now,
    // we'll leave summary as-is since it requires full session data to regenerate
  }
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_KEY, currentLang);
  applyLangUI();
}

const startBaselineBtn = document.getElementById("startBaselineBtn");
const startCheckBtn = document.getElementById("startCheckBtn");
const baselineInfo = document.getElementById("baselineInfo");
const clearBaselineBtn = document.getElementById("clearBaselineBtn");
const baselineList = document.getElementById("baselineList");
const baselineProgress = document.getElementById("baselineProgress");
const baselineGuidance = document.getElementById("baselineGuidance");
const testType = document.getElementById("testType");

const resetBtn = document.getElementById("resetBtn");
const testArea = document.getElementById("testArea");

const trialCountInput = document.getElementById("trialCount");
const progress = document.getElementById("progress");
const trialList = document.getElementById("trialList");
const summary = document.getElementById("summary");

const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");
const menuOverlay = document.getElementById("menuOverlay");
const menuItems = document.querySelectorAll(".menu-item");
const views = document.querySelectorAll(".view");

function openMenu() {
  menu.classList.add("open");
  menuOverlay.classList.remove("hidden");
  document.body.classList.add("menu-open");
}

function closeMenu() {
  menu.classList.remove("open");
  menuOverlay.classList.add("hidden");
  document.body.classList.remove("menu-open");
}

menuBtn.addEventListener("click", () => {
  if (menu.classList.contains("open")) closeMenu();
  else openMenu();
});

menuOverlay.addEventListener("click", closeMenu);

menuItems.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.view;

    views.forEach(v => {
      v.classList.add("hidden");
      v.classList.remove("active");
    });

    const activeView = document.getElementById(`view-${target}`);
    if (activeView) {
      activeView.classList.remove("hidden");
      activeView.classList.add("active");
    }

    closeMenu();
    window.scrollTo(0, 0);
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

let mode = null; // "baseline" | "check"

let startTime = null;
let timeoutId = null;

let currentStim = null; // "go" | "nogo"
let responded = false;

let inSession = false;
let totalTrials = 5;
let trialIndex = 0;
let results = []; // stores reaction times (ms); null for false start
let trialToken = 0;
let windowTimeoutId = null;

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
    const maxTrials = testType.value === "gonogo" ? 60 : 40;
    totalTrials = clampInt(parseInt(trialCountInput.value, 10), 3, maxTrials);
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
    resetBtn.style.display = "";
  
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
      setTimeout(nextTrial, 250);
      return;
    }
  
    // Mark responded so auto-window doesn't also record
    responded = true;
  
    if (windowTimeoutId) {
      clearTimeout(windowTimeoutId);
      windowTimeoutId = null;
    }
  
    const rt = Math.round(performance.now() - startTime);
  
    if (testType.value === "reaction") {
      recordResult({ type: "rt", rt });
      setTimeout(nextTrial, 250);
      return;
    }
  
    // Go/No-Go
    if (currentStim === "go") {
      recordResult({ type: "go", rt });
    } else {
      // clicked on NO-GO => false alarm
      recordResult({ type: "false_alarm", rt });
    }
  
    setTimeout(nextTrial, 250);
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
  
    trialToken++;
    const myToken = trialToken;
  
    // cancel any previous window timer
    if (windowTimeoutId) {
      clearTimeout(windowTimeoutId);
      windowTimeoutId = null;
    }
  
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
      const windowMs = 1400;
      windowTimeoutId = setTimeout(() => {
        // ignore if a new trial has started
        if (!inSession || myToken !== trialToken) return;
        if (responded) return;
  
        if (currentStim === "go") {
          // Miss: didn't click in time
          recordResult({ type: "miss" });
        } else {
          // Correct inhibition (no click)
          recordResult({ type: "correct_reject" });
        }
  
        windowTimeoutId = null;
        setTimeout(nextTrial, 250);
      }, windowMs);
    }, delay);
  }  

  function recordResult(entry) {
    results.push(entry);
  
    const li = document.createElement("li");
    const n = results.length;
    li.textContent = getTrialText(n, entry, testType.value);
  
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
    resetBtn.style.display = "none";
  
    updateProgress(true);
  
    const isReaction = testType.value === "reaction";
  
    // ---- Compute session metrics depending on test ----
    let sessionPayload;
  
    if (isReaction) {
      const rts = results.filter(e => e && e.type === "rt").map(e => e.rt);
      const falseStarts = results.filter(e => e && e.type === "false_start").length;
  
      if (rts.length === 0) {
        summary.textContent = getSessionInvalidNoReaction();
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
        summary.textContent = getSessionInvalidNoGo();
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
      // Go/No-Go baseline validity rule: require ≥ 10 valid GO responses
      if (testType.value === "gonogo") {
        const goHits = results.filter(e => e && e.type === "go").length;

        if (goHits < 10) {
          summary.textContent = getBaselineNotSaved();
          mode = null;
          return;
        }
      }

      const sessions = loadBaseline();

      sessions.push({
        ...sessionPayload,
        timestamp: new Date().toISOString()
      });
  
      saveBaseline(sessions);
      updateBaselineInfo();
  
      const qualityNote = checkSessionQuality(sessionPayload, totalTrials, isReaction);
      
      if (isReaction) {
        summary.textContent = getBaselineSavedReaction(
          sessionPayload.mean,
          sessionPayload.sd,
          sessionPayload.falseStarts,
          qualityNote
        );
      } else {
        summary.textContent = getBaselineSavedGoNoGo(
          sessionPayload.mean,
          sessionPayload.sd,
          sessionPayload.misses,
          sessionPayload.falseAlarms,
          sessionPayload.falseStarts,
          qualityNote
        );
      }
  
      mode = null;
      return;
    }
  
    // ---- Check mode: compare to baseline ----
    if (mode === "check") {
      const sessions = loadBaseline();
  
      if (sessions.length < 3) {
        summary.textContent = getNotEnoughBaseline();
        mode = null;
        return;
      }
  
      const baselineMean = mean(sessions.map(s => s.mean));
      const baselineSD = mean(sessions.map(s => s.sd));
  
      let status;
      if (sessionPayload.mean <= baselineMean + baselineSD) {
        status = t("status.within");
      } else if (sessionPayload.mean <= baselineMean + 2 * baselineSD) {
        status = t("status.slightly");
      } else {
        status = t("status.significantly");
      }
  
      const qualityNote = checkSessionQuality(sessionPayload, totalTrials, isReaction);
      
      if (isReaction) {
        summary.textContent = getCheckReaction(
          sessionPayload.mean,
          baselineMean,
          baselineSD,
          status,
          sessionPayload.falseStarts,
          qualityNote
        );
      } else {
        // For Go/No-Go, also show error counts clearly.
        // Optional: compare errors vs baseline averages (simple, explainable)
        const baselineMissAvg = mean(sessions.map(s => (typeof s.misses === "number" ? s.misses : 0)));
        const baselineFAAvg = mean(sessions.map(s => (typeof s.falseAlarms === "number" ? s.falseAlarms : 0)));

        summary.textContent = getCheckGoNoGo(
          sessionPayload.mean,
          baselineMean,
          baselineSD,
          status,
          sessionPayload.misses,
          baselineMissAvg,
          sessionPayload.falseAlarms,
          baselineFAAvg,
          sessionPayload.falseStarts,
          qualityNote
        );
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
    progress.textContent = getSessionComplete(done, total);
  } else {
    progress.textContent = getTrialProgress(Math.min(trialIndex, total), total, done);
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
  resetBtn.style.display = "none";

  updateBaselineInfo();
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

    const minSessions = minBaselineSessions();
    const recTrials = recommendedTrialsPerSession();
    const isGoNoGo = testType.value === "gonogo";

    // Guidance text (always shown) - update both language spans
    const guidanceEn = baselineGuidance.querySelector(".lang-en");
    const guidanceNo = baselineGuidance.querySelector(".lang-no");
    if (guidanceEn) {
      guidanceEn.textContent = isGoNoGo
        ? `Recommended: ≥${minSessions} baseline sessions, ≥${recTrials} trials per session (Go/No-Go needs more trials for stable results).`
        : `Recommended: ≥${minSessions} baseline sessions, ≥${recTrials} trials per session.`;
    }
    if (guidanceNo) {
      guidanceNo.textContent = isGoNoGo
        ? `Anbefalt: ≥${minSessions} baseline-økter, ≥${recTrials} forsøk per økt (Go/No-Go trenger flere forsøk for stabile resultater).`
        : `Anbefalt: ≥${minSessions} baseline-økter, ≥${recTrials} forsøk per økt.`;
    }

    // Progress + button gating - update both language spans
    const progressEn = baselineProgress.querySelector(".lang-en");
    const progressNo = baselineProgress.querySelector(".lang-no");
    if (progressEn) {
      progressEn.textContent = `Baseline progress: ${sessions.length}/${minSessions} sessions (minimum).`;
    }
    if (progressNo) {
      progressNo.textContent = `Baseline-fremgang: ${sessions.length}/${minSessions} økter (minimum).`;
    }
    startCheckBtn.disabled = sessions.length < minSessions;

    if (sessions.length === 0) {
      // Update both language spans in baselineInfo
      const infoEn = baselineInfo.querySelector(".lang-en");
      const infoNo = baselineInfo.querySelector(".lang-no");
      if (infoEn) infoEn.textContent = "No baseline sessions recorded.";
      if (infoNo) infoNo.textContent = "Ingen baseline-økter er registrert.";
      clearBaselineBtn.style.display = "none";
      return;
    }

    clearBaselineBtn.style.display = "";

    const means = sessions.map(s => s.mean);
    const sds = sessions.map(s => s.sd);

    const meanAvg = mean(means);
    const sdAvg = mean(sds);

    // Update both language spans in baselineInfo
    const infoEn = baselineInfo.querySelector(".lang-en");
    const infoNo = baselineInfo.querySelector(".lang-no");
    const prefix = isGoNoGo ? "GO " : "";
    if (infoEn) {
      infoEn.textContent =
        `${sessions.length} sessions | ` +
        `${prefix}Baseline mean: ${meanAvg.toFixed(0)} ms | ` +
        `${prefix}Baseline SD: ${sdAvg.toFixed(0)} ms`;
    }
    if (infoNo) {
      infoNo.textContent =
        `${sessions.length} økter | ` +
        `${prefix}Baseline-gjennomsnitt: ${meanAvg.toFixed(0)} ms | ` +
        `${prefix}Baseline SD: ${sdAvg.toFixed(0)} ms`;
    }
  
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

function minBaselineSessions() {
  return 3;
}

function recommendedTrialsPerSession() {
  return testType.value === "gonogo" ? 20 : 5;
}

function checkSessionQuality(sessionPayload, totalTrials, isReaction) {
  const falseStartRate = (sessionPayload.falseStarts || 0) / totalTrials;
  const validHitRate = sessionPayload.trials / totalTrials;
  
  const issues = [];
  if (falseStartRate > 0.2) {
    issues.push(currentLang === "no" ? "mange feilstarter" : "many false starts");
  }
  if (validHitRate < 0.5) {
    issues.push(currentLang === "no" ? "få gyldige treff" : "few valid hits");
  }
  
  if (issues.length > 0) {
    if (currentLang === "no") {
      return ` Merknad: Denne økten hadde ${issues.join(" og ")} — vurder å gjennomføre på nytt for bedre baseline-kvalitet.`;
    }
    return ` Note: This session had ${issues.join(" and ")} — consider retaking for better baseline quality.`;
  }
  return "";
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

// Hide Reset button initially (only show during active session)
resetBtn.style.display = "none";

// Language toggle
document.getElementById("langEnBtn")?.addEventListener("click", () => setLang("en"));
document.getElementById("langNoBtn")?.addEventListener("click", () => setLang("no"));

// Apply language on startup
applyLangUI();

// Sync topbar height for fixed positioning
function syncTopbarHeight() {
  const topbar = document.querySelector('.topbar');
  if (!topbar) return;
  document.documentElement.style.setProperty('--topbar-h', `${topbar.offsetHeight}px`);
}

window.addEventListener('load', syncTopbarHeight);
window.addEventListener('resize', syncTopbarHeight);
// Call immediately in case DOM is already loaded
syncTopbarHeight();
});