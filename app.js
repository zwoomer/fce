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

  // 6) Re-render history if visible
  if (historyListEl) {
    renderHistory();
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

// Context (optional)
const contextMode = document.getElementById("contextMode");
const sleepRating = document.getElementById("sleepRating");
const stressRating = document.getElementById("stressRating");
const contextNote = document.getElementById("contextNote");

// History view
const historyTest = document.getElementById("historyTest");
const historyMode = document.getElementById("historyMode");
const historyEmpty = document.getElementById("historyEmpty");
const historyListEl = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

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

    if (target === "history") {
      // Keep history default test aligned with current selection
      if (historyTest) historyTest.value = testType.value;
      renderHistory();
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
    if (contextMode) contextMode.value = "baseline";
    mode = "baseline";
    beginSession();
  });
  
  startCheckBtn.addEventListener("click", () => {
    if (inSession) return;
    if (contextMode) contextMode.value = "check";
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
    // Keep history filter aligned with current test by default
    if (historyTest) {
      historyTest.value = testType.value;
      renderHistory();
    }
  });

if (historyTest) {
  historyTest.value = testType.value;
  historyTest.addEventListener("change", renderHistory);
}
if (historyMode) {
  historyMode.addEventListener("change", renderHistory);
}

if (clearHistoryBtn) {
  clearHistoryBtn.addEventListener("click", () => {
    const tt = (historyTest && historyTest.value) ? historyTest.value : testType.value;
    const sessions = loadHistory(tt);
    if (!sessions.length) return;
    const ok = confirm(currentLang === "no" ? "Slett all historikk for denne testen?" : "Clear all history for this test?");
    if (!ok) return;
    saveHistory(tt, []);
    renderHistory();
  });
}

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

// ----------------------------
// History model (local-first)
// ----------------------------
function historyKeyFor(testType) {
  return `fce_history_v1_${testType}`;
}

function loadHistory(tt = testType.value) {
  try {
    const raw = localStorage.getItem(historyKeyFor(tt));
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function saveHistory(tt, sessions) {
  localStorage.setItem(historyKeyFor(tt), JSON.stringify(sessions));
}

function getContextTags() {
  const safeInt = (v) => {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : 0;
  };
  return {
    sleep: sleepRating ? safeInt(sleepRating.value) : 0,
    stress: stressRating ? safeInt(stressRating.value) : 0,
    note: contextNote ? String(contextNote.value || "").slice(0, 140) : ""
  };
}

function getDeviceHints() {
  const isTouch = ("ontouchstart" in window) || (navigator.maxTouchPoints > 0);
  const ua = (navigator.userAgent || "").toLowerCase();
  const userAgentHint = /mobi|android|iphone|ipad/.test(ua) ? "mobile" : "desktop";
  return { isTouch, userAgentHint };
}

function pushHistoryRecord(record) {
  const tt = record.testType;
  const sessions = loadHistory(tt);
  sessions.push(record);
  saveHistory(tt, sessions);
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
  
    const createdAt = new Date().toISOString();
    const tags = getContextTags();
    const device = getDeviceHints();

    // ---- Compute session metrics depending on test ----
    let sessionPayload;
    let flags = { invalid: false, reason: "" };
  
    if (isReaction) {
      const rts = results.filter(e => e && e.type === "rt").map(e => e.rt);
      const falseStarts = results.filter(e => e && e.type === "false_start").length;
  
      if (rts.length === 0) {
        flags = { invalid: true, reason: "no_valid_trials" };
        // Store invalid session in history
        pushHistoryRecord({
          id: createdAt,
          createdAt,
          testType: "reaction",
          mode: mode || (contextMode ? contextMode.value : ""),
          metrics: { avgMs: 0, sdMs: 0, bestMs: 0, worstMs: 0, trials: 0, falseStarts },
          flags,
          tags,
          device
        });
        renderHistory();
        summary.textContent = getSessionInvalidNoReaction();
        mode = null;
        return;
      }
  
      sessionPayload = {
        mean: mean(rts),
        sd: stddev(rts),
        trials: rts.length,
        falseStarts,
        best: Math.min(...rts),
        worst: Math.max(...rts)
      };
    } else {
      // Go/No-Go metrics
      const goHits = results.filter(e => e && e.type === "go").map(e => e.rt);
      const misses = results.filter(e => e && e.type === "miss").length;
      const falseAlarms = results.filter(e => e && e.type === "false_alarm").length;
      const falseStarts = results.filter(e => e && e.type === "false_start").length;
  
      if (goHits.length === 0) {
        flags = { invalid: true, reason: "no_go_responses" };
        pushHistoryRecord({
          id: createdAt,
          createdAt,
          testType: "gonogo",
          mode: mode || (contextMode ? contextMode.value : ""),
          metrics: {
            avgMs: 0,
            sdMs: 0,
            bestMs: 0,
            worstMs: 0,
            trials: 0,
            hits: 0,
            misses,
            falseAlarms,
            correctRejects: results.filter(e => e && e.type === "correct_reject").length,
            falseStarts
          },
          flags,
          tags,
          device
        });
        renderHistory();
        summary.textContent = getSessionInvalidNoGo();
        mode = null;
        return;
      }
  
      sessionPayload = {
        mean: mean(goHits),      // mean RT on GO hits
        sd: stddev(goHits),      // consistency on GO hits
        trials: goHits.length,
        best: Math.min(...goHits),
        worst: Math.max(...goHits),
        misses,
        falseAlarms,
        falseStarts
      };
    }

    // Always write session record (even if baseline refuses saving later)
    const sessionRecord = {
      id: createdAt,
      createdAt,
      testType: isReaction ? "reaction" : "gonogo",
      mode: mode,
      metrics: isReaction
        ? {
            avgMs: sessionPayload.mean,
            sdMs: sessionPayload.sd,
            bestMs: sessionPayload.best,
            worstMs: sessionPayload.worst,
            trials: sessionPayload.trials,
            falseStarts: sessionPayload.falseStarts
          }
        : {
            avgMs: sessionPayload.mean,
            sdMs: sessionPayload.sd,
            bestMs: sessionPayload.best,
            worstMs: sessionPayload.worst,
            trials: sessionPayload.trials,
            hits: sessionPayload.trials,
            misses: sessionPayload.misses,
            falseAlarms: sessionPayload.falseAlarms,
            correctRejects: results.filter(e => e && e.type === "correct_reject").length,
            falseStarts: sessionPayload.falseStarts
          },
      flags,
      tags,
      device
    };
    pushHistoryRecord(sessionRecord);
    renderHistory();
  
    // ---- Baseline mode: store payload ----
    if (mode === "baseline") {
      // Go/No-Go baseline validity rule: require ≥ 10 valid GO responses
      if (testType.value === "gonogo") {
        const goHits = results.filter(e => e && e.type === "go").length;

        if (goHits < 10) {
          // Mark latest history record as invalid (baseline refused)
          sessionRecord.flags = { invalid: true, reason: "baseline_refused_too_few_go" };
          const hs = loadHistory("gonogo");
          hs[hs.length - 1] = sessionRecord;
          saveHistory("gonogo", hs);
          renderHistory();
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
        // Mark latest history record as invalid (check cannot compare)
        const tt = isReaction ? "reaction" : "gonogo";
        sessionRecord.flags = { invalid: true, reason: "not_enough_baseline" };
        const hs = loadHistory(tt);
        hs[hs.length - 1] = sessionRecord;
        saveHistory(tt, hs);
        renderHistory();
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

// ----------------------------
// History UI (Phase 1.5)
// ----------------------------
function formatTs(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

function statusLabelFromCompare(meanMs, baselineMean, baselineSD) {
  if (!Number.isFinite(baselineMean) || !Number.isFinite(baselineSD)) return "";
  if (meanMs <= baselineMean + baselineSD) return t("status.within");
  if (meanMs <= baselineMean + 2 * baselineSD) return t("status.slightly");
  return t("status.significantly");
}

function renderHistory() {
  if (!historyListEl || !historyEmpty || !historyTest || !historyMode) return;

  const tt = historyTest.value || "reaction";
  const modeFilter = historyMode.value || "all";

  let sessions = loadHistory(tt);
  sessions = sessions.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

  if (modeFilter !== "all") {
    sessions = sessions.filter(s => s && s.mode === modeFilter);
  }

  historyListEl.innerHTML = "";

  if (!sessions.length) {
    historyEmpty.textContent = currentLang === "no" ? "Ingen historikk ennå." : "No history yet.";
    return;
  }

  historyEmpty.textContent = "";

  // Baseline reference for compare cards (if available)
  const baselineSessions = (() => {
    try {
      const key = tt === "gonogo" ? "fce_baseline_gonogo_v1" : "fce_baseline_reaction_v1";
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  })();

  const baselineMean = baselineSessions.length ? mean(baselineSessions.map(s => s.mean)) : NaN;
  const baselineSD = baselineSessions.length ? mean(baselineSessions.map(s => s.sd)) : NaN;

  for (const s of sessions) {
    const card = document.createElement("div");
    card.className = "history-card";

    const header = document.createElement("div");
    header.className = "history-header";

    const left = document.createElement("div");
    left.className = "history-left";
    const ts = document.createElement("div");
    ts.className = "history-ts";
    ts.textContent = formatTs(s.createdAt || s.id);
    const meta = document.createElement("div");
    meta.className = "history-meta";
    meta.textContent = `${s.mode || ""}`.trim();
    left.appendChild(ts);
    left.appendChild(meta);

    const right = document.createElement("div");
    right.className = "history-right";

    const badge = document.createElement("span");
    const isInvalid = !!(s.flags && s.flags.invalid);
    badge.className = `badge ${isInvalid ? "badge-bad" : "badge-ok"}`;
    badge.textContent = isInvalid ? (currentLang === "no" ? "UGYLDIG" : "INVALID") : (currentLang === "no" ? "OK" : "OK");
    right.appendChild(badge);

    header.appendChild(left);
    header.appendChild(right);
    card.appendChild(header);

    const body = document.createElement("div");
    body.className = "history-body";

    const m = s.metrics || {};
    const avg = Number(m.avgMs);
    const sd = Number(m.sdMs);
    const best = Number(m.bestMs);
    const worst = Number(m.worstMs);
    const trials = Number(m.trials);

    const line1 = document.createElement("div");
    line1.className = "history-line";
    line1.textContent = `avg ${Number.isFinite(avg) ? avg.toFixed(0) : "—"} ms · SD ${Number.isFinite(sd) ? sd.toFixed(0) : "—"} · trials ${Number.isFinite(trials) ? trials : "—"}`;
    body.appendChild(line1);

    const line2 = document.createElement("div");
    line2.className = "history-line muted";
    line2.textContent = `best ${Number.isFinite(best) ? best.toFixed(0) : "—"} · worst ${Number.isFinite(worst) ? worst.toFixed(0) : "—"}`;
    body.appendChild(line2);

    if (tt === "gonogo") {
      const errs = document.createElement("div");
      errs.className = "history-line";
      errs.textContent = `misses ${m.misses ?? 0} · false alarms ${m.falseAlarms ?? 0} · false starts ${m.falseStarts ?? 0}`;
      body.appendChild(errs);
    } else {
      const fs = document.createElement("div");
      fs.className = "history-line";
      fs.textContent = `false starts ${m.falseStarts ?? 0}`;
      body.appendChild(fs);
    }

    // Compare-to-baseline hint for check sessions
    if (s.mode === "check" && baselineSessions.length) {
      const status = statusLabelFromCompare(avg, baselineMean, baselineSD);
      const delta = Number.isFinite(avg) && Number.isFinite(baselineMean) ? (avg - baselineMean) : NaN;
      const cmp = document.createElement("div");
      cmp.className = "history-compare";
      cmp.textContent = `${status} · Δ ${Number.isFinite(delta) ? (delta >= 0 ? "+" : "") + delta.toFixed(0) : "—"} ms (baseline ${baselineMean.toFixed(0)} ± ${baselineSD.toFixed(0)})`;
      body.appendChild(cmp);
    } else if (s.mode === "check" && !baselineSessions.length) {
      const cmp = document.createElement("div");
      cmp.className = "history-compare muted";
      cmp.textContent = currentLang === "no" ? "Ingen baseline for sammenligning." : "No baseline available for comparison.";
      body.appendChild(cmp);
    }

    // Tags
    const tags = s.tags || {};
    const hasTags = (tags.sleep || tags.stress || (tags.note && String(tags.note).trim()));
    if (hasTags) {
      const tagLine = document.createElement("div");
      tagLine.className = "history-tags";
      const parts = [];
      if (tags.sleep) parts.push(`${currentLang === "no" ? "søvn" : "sleep"} ${tags.sleep}/5`);
      if (tags.stress) parts.push(`${currentLang === "no" ? "stress" : "stress"} ${tags.stress}/5`);
      if (tags.note && String(tags.note).trim()) parts.push(`“${String(tags.note).trim()}”`);
      tagLine.textContent = parts.join(" · ");
      body.appendChild(tagLine);
    }

    // Invalid reason (if present)
    if (isInvalid && s.flags && s.flags.reason) {
      const why = document.createElement("div");
      why.className = "history-reason";
      why.textContent = (currentLang === "no" ? "Årsak: " : "Reason: ") + String(s.flags.reason);
      body.appendChild(why);
    }

    card.appendChild(body);
    historyListEl.appendChild(card);
  }
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