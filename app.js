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
      runTraining: "Run Training",
      reset: "Reset",
      clearBaseline: "Clear baseline",
      testType: {
        reaction: "Reaction Time",
        gonogo: "Go / No-Go",
        divided: "Divided Attention",
      },
      mode: {
        baseline: "Baseline",
        check: "Check",
        training: "Training",
        all: "All",
      },
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
    },
    export: {
      btn: "Export (Copy JSON)",
      copied: "Copied to clipboard.",
      empty: "No history to export.",
      failed: "Copy failed — showing text below.",
    },
    trend: {
      baselineLine: "Baseline: mean {mean} ms | SD {sd} ms | Band: {lo}–{hi} ms (±1 SD)",
      noBaseline: "No baseline yet — trend uses baseline sessions.",
      noChecks: "No check sessions yet.",
      checkLabel: "Check",
      delta: "Δ {delta} ms",
      status: "Status: {status}",
      ok: "OK",
      invalid: "INVALID",
    },
    history: {
      avg: "avg",
      mean: "mean",
      sd: "SD",
      trials: "trials",
      best: "best",
      worst: "worst",
      falseStarts: "false starts",
      misses: "misses",
      falseAlarms: "false alarms",
      baseline: "baseline",
    },
    stimulus: {
      ready: "Ready…",
      reaction: {
        go: "CLICK!",
      },
      gonogo: {
        go: "GO (click)",
        nogo: "NO-GO (don't click)",
      },
      divided: {
        go: "TAP",
        nogo: "NO TAP",
        legend: "TAP = respond · NO TAP = wait · Count blue flashes",
      },
    },
  },
  no: {
    ui: {
      test: "Test",
      trials: "Forsøk",
      addBaseline: "Legg til baseline-økt",
      runCheck: "Kjør funksjonssjekk",
      runTraining: "Kjør trening",
      reset: "Nullstill",
      clearBaseline: "Slett baseline",
      testType: {
        reaction: "Reaksjonstid",
        gonogo: "Go / No-Go",
        divided: "Delt oppmerksomhet",
      },
      mode: {
        baseline: "Baseline",
        check: "Sjekk",
        training: "Trening",
        all: "Alle",
      },
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
    export: {
      btn: "Eksporter (kopier JSON)",
      copied: "Kopiert til utklippstavlen.",
      empty: "Ingen historikk å eksportere.",
      failed: "Kopiering feilet — viser tekst under.",
    },
    trend: {
      baselineLine: "Baseline: snitt {mean} ms | SD {sd} ms | Bånd: {lo}–{hi} ms (±1 SD)",
      noBaseline: "Ingen baseline ennå — trend bruker baseline-økter.",
      noChecks: "Ingen sjekk-økter ennå.",
      checkLabel: "Sjekk",
      delta: "Δ {delta} ms",
      status: "Status: {status}",
      ok: "OK",
      invalid: "UGYLDIG",
    },
    history: {
      avg: "gj.snitt",
      mean: "gjennomsnitt",
      sd: "SD",
      trials: "forsøk",
      best: "best",
      worst: "verst",
      falseStarts: "feilstarter",
      misses: "bom",
      falseAlarms: "inhibisjonsfeil",
      baseline: "baseline",
    },
    stimulus: {
      ready: "Klar…",
      reaction: {
        go: "KLIKK!",
      },
      gonogo: {
        go: "GO (klikk)",
        nogo: "NO-GO (ikke klikk)",
      },
      divided: {
        go: "TRYKK",
        nogo: "IKKE",
        legend: "TRYKK = svar · IKKE = vent · Tell blå blink",
      },
    },
  },
};

function t(path) {
  const parts = path.split(".");
  let value = I18N[currentLang];
  for (const part of parts) {
    if (!value || typeof value !== "object") return path;
    value = value[part];
  }
  return value !== undefined ? value : path;
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
    // Go/No-Go and Divided Attention (same trial types)
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
    // Go/No-Go and Divided Attention (same trial types)
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

function getBaselineNotSavedDivided() {
  return currentLang === "no"
    ? "Baseline-økt ikke lagret: for få gyldige GO-responser (minimum 80% av forsøk, minst 8). Øk antall forsøk for stabile resultater."
    : "Baseline session not saved: too few valid GO responses (minimum 80% of trials, at least 8). Increase trials for stable results.";
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

function getBaselineSavedDivided(mean, sd, misses, falseAlarms, falseStarts, flashTargetCount, flashAbsError, qualityNote) {
  const falseStartsText = falseStarts
    ? (currentLang === "no" ? ` | Feilstarter: ${falseStarts}` : ` | False starts: ${falseStarts}`)
    : "";
  const flashText = flashTargetCount > 0
    ? (currentLang === "no" 
        ? ` | Flash-feil snitt: ${flashAbsError.toFixed(1)} (målt: ${flashTargetCount})`
        : ` | Flash error avg: ${flashAbsError.toFixed(1)} (target: ${flashTargetCount})`)
    : "";
  if (currentLang === "no") {
    return `Baseline-økt lagret. GO-gjennomsnitt: ${mean.toFixed(0)} ms | SD: ${sd.toFixed(0)} ms | Bom: ${misses} | Inhibisjonsfeil: ${falseAlarms}${flashText}${falseStartsText}${qualityNote}`;
  }
  return `Baseline session saved. GO mean: ${mean.toFixed(0)} ms | SD: ${sd.toFixed(0)} ms | Misses: ${misses} | Inhibitory errors: ${falseAlarms}${flashText}${falseStartsText}${qualityNote}`;
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

// Divided Attention status comparison (avgMs, falseAlarmsRate, flashAbsError)
function getDividedAttentionStatus(sessionPayload, baselineSessions) {
  const baselineMean = mean(baselineSessions.map(s => s.mean));
  const baselineSD = mean(baselineSessions.map(s => s.sd));
  
  // False alarm rate: falseAlarms / NO-GO trial count (not total trials)
  const baselineFAAvg = mean(baselineSessions.map(s => {
    if (typeof s.falseAlarms === "number" && typeof s.nogoCount === "number" && s.nogoCount > 0) {
      return s.falseAlarms / s.nogoCount;
    }
    return 0;
  }));
  const baselineFlashErrorAvg = mean(baselineSessions.map(s => (typeof s.flashAbsError === "number" ? s.flashAbsError : 0)));
  
  // Current false alarm rate: use NO-GO trial count as denominator
  const nogoCount = sessionPayload.nogoCount || 0;
  const currentFARate = nogoCount > 0 ? (sessionPayload.falseAlarms || 0) / nogoCount : 0;
  const currentFlashError = sessionPayload.flashAbsError || 0;
  
  // Compare avgMs
  let avgMsStatus = t("status.within");
  if (sessionPayload.mean > baselineMean + 2 * baselineSD) {
    avgMsStatus = t("status.significantly");
  } else if (sessionPayload.mean > baselineMean + baselineSD) {
    avgMsStatus = t("status.slightly");
  }
  
  // Compare falseAlarmsRate (worse if higher than baseline)
  let faStatus = t("status.within");
  if (baselineFAAvg > 0) {
    const faRatio = currentFARate / baselineFAAvg;
    if (faRatio > 2) {
      faStatus = t("status.significantly");
    } else if (faRatio > 1.5) {
      faStatus = t("status.slightly");
    }
  } else if (currentFARate > 0.2) {
    // No baseline false alarms, but current has >20% false alarm rate
    faStatus = t("status.significantly");
  } else if (currentFARate > 0.1) {
    faStatus = t("status.slightly");
  }
  
  // Compare flashAbsError (worse if higher than baseline)
  let flashStatus = t("status.within");
  if (baselineFlashErrorAvg > 0) {
    const flashRatio = currentFlashError / baselineFlashErrorAvg;
    if (flashRatio > 2) {
      flashStatus = t("status.significantly");
    } else if (flashRatio > 1.5) {
      flashStatus = t("status.slightly");
    }
  } else if (currentFlashError > 3) {
    // No baseline flash error, but current has >3 error
    flashStatus = t("status.significantly");
  } else if (currentFlashError > 2) {
    flashStatus = t("status.slightly");
  }
  
  // Overall status: worst of the three
  if (avgMsStatus === t("status.significantly") || faStatus === t("status.significantly") || flashStatus === t("status.significantly")) {
    return t("status.significantly");
  } else if (avgMsStatus === t("status.slightly") || faStatus === t("status.slightly") || flashStatus === t("status.slightly")) {
    return t("status.slightly");
  }
  return t("status.within");
}

function getCheckDividedAttention(mean, baselineMean, baselineSD, status, falseAlarmsRate, baselineFARate, flashAbsError, baselineFlashError, falseStarts, qualityNote) {
  const falseStartsText = falseStarts > 0
    ? (currentLang === "no" ? ` | Feilstarter: ${falseStarts}` : ` | False starts: ${falseStarts}`)
    : "";
  if (currentLang === "no") {
    return `Dagens GO-gjennomsnitt: ${mean.toFixed(0)} ms | Baseline-gjennomsnitt: ${baselineMean.toFixed(0)} ms | Baseline SD: ${baselineSD.toFixed(0)} ms | Status: ${status} | Inhibisjonsfeil-rate: ${(falseAlarmsRate * 100).toFixed(1)}% (baseline ${(baselineFARate * 100).toFixed(1)}%) | Flash-feil: ${flashAbsError} (baseline snitt ${baselineFlashError.toFixed(1)})${falseStartsText}${qualityNote}`;
  }
  return `Today GO mean: ${mean.toFixed(0)} ms | Baseline mean: ${baselineMean.toFixed(0)} ms | Baseline SD: ${baselineSD.toFixed(0)} ms | Status: ${status} | False alarm rate: ${(falseAlarmsRate * 100).toFixed(1)}% (baseline ${(baselineFARate * 100).toFixed(1)}%) | Flash error: ${flashAbsError} (baseline avg ${baselineFlashError.toFixed(1)})${falseStartsText}${qualityNote}`;
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

// Helper function to generate flash info string for summaries
function getFlashInfoString(target, user, error) {
  if (target === undefined && user === undefined && error === undefined) return "";
  
  const tgt = target || 0;
  const usr = user || 0;
  const err = error || 0;
  
  return currentLang === "no"
    ? ` | Flashes: mål ${tgt}, svar ${usr}, feil ${err}`
    : ` | Flashes: target ${tgt}, answer ${usr}, error ${err}`;
}

// Helper function to set summary text and store data for language switching
function setSummary(type, dataObj, testTypeParam = null, modeParam = null) {
  if (!summary) return;
  
  // Store data for regeneration (testTypeParam is already a string value, not an element)
  lastSummaryData = { type, testType: testTypeParam || testType.value || null, mode: modeParam, data: dataObj };
  
  // Generate summary text based on type
  switch (type) {
    case "training_divided":
      const flashInfo = getFlashInfoString(dataObj.flashTargetCount, dataObj.flashUserCount, dataObj.flashAbsError);
      summary.textContent = (currentLang === "no"
        ? `Økt fullført. GO-gjennomsnitt: ${dataObj.mean.toFixed(0)} ms | SD: ${dataObj.sd.toFixed(0)} ms`
        : `Session complete. GO mean: ${dataObj.mean.toFixed(0)} ms | SD: ${dataObj.sd.toFixed(0)} ms`) + flashInfo;
      break;
      
    case "baseline_saved_reaction":
      summary.textContent = getBaselineSavedReaction(dataObj.mean, dataObj.sd, dataObj.falseStarts, dataObj.qualityNote || "");
      break;
      
    case "baseline_saved_gonogo":
      summary.textContent = getBaselineSavedGoNoGo(dataObj.mean, dataObj.sd, dataObj.misses, dataObj.falseAlarms, dataObj.falseStarts, dataObj.qualityNote || "");
      break;
      
    case "baseline_saved_divided":
      summary.textContent = getBaselineSavedDivided(dataObj.mean, dataObj.sd, dataObj.misses, dataObj.falseAlarms, dataObj.falseStarts, dataObj.flashTargetCount || 0, dataObj.flashAbsError || 0, dataObj.qualityNote || "");
      break;
      
    case "check_reaction":
      summary.textContent = getCheckReaction(dataObj.mean, dataObj.baselineMean, dataObj.baselineSD, dataObj.status, dataObj.falseStarts, dataObj.qualityNote || "");
      break;
      
    case "check_gonogo":
      summary.textContent = getCheckGoNoGo(dataObj.mean, dataObj.baselineMean, dataObj.baselineSD, dataObj.status, dataObj.misses, dataObj.baselineMissAvg, dataObj.falseAlarms, dataObj.baselineFAAvg, dataObj.falseStarts, dataObj.qualityNote || "");
      break;
      
    case "check_divided":
      summary.textContent = getCheckDividedAttention(dataObj.mean, dataObj.baselineMean, dataObj.baselineSD, dataObj.status, dataObj.falseAlarmsRate, dataObj.baselineFARate, dataObj.flashAbsError, dataObj.baselineFlashError, dataObj.falseStarts, dataObj.qualityNote || "");
      break;
      
    case "invalid_no_reaction":
      summary.textContent = getSessionInvalidNoReaction();
      break;
      
    case "invalid_no_go":
      summary.textContent = getSessionInvalidNoGo();
      break;
      
    case "not_enough_baseline":
      summary.textContent = getNotEnoughBaseline();
      break;
      
    case "baseline_not_saved":
      summary.textContent = getBaselineNotSaved();
      break;
      
    case "baseline_not_saved_divided":
      const flashInfo2 = getFlashInfoString(dataObj.flashTarget, dataObj.flashUser, dataObj.flashError);
      summary.textContent = getBaselineNotSavedDivided() + flashInfo2;
      break;
      
    case "invalid_missing_answer":
      summary.textContent = currentLang === "no"
        ? "Kan ikke sammenlignes: mangler svar"
        : "Session not usable for comparison: missing answer";
      break;
      
    case "invalid_no_go_responses_divided":
      summary.textContent = currentLang === "no"
        ? "Økt ugyldig: ingen GO-responser."
        : "Session invalid: no GO responses.";
      break;
      
    default:
      // Unknown type, just set text directly
      break;
  }
}

// Regenerate summary text based on stored data and current language
function regenerateSummary() {
  if (!lastSummaryData || !summary) return;
  
  // Simply call setSummary with stored data - it will regenerate the text with current language
  const { type, testType: tt, mode: m, data } = lastSummaryData;
  setSummary(type, data, tt, m);
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
  if (summary && summary.textContent && lastSummaryData) {
    regenerateSummary();
  }

  // 6) Re-render history if visible
  if (historyListEl) {
    renderHistory();
  }

  // 7) Update select options for modes and test types
  updateSelectOptions();
  
  // 8) Update divided attention legend if applicable
  updateDividedLegend();
}

// Helper function to populate select options
function populateSelectOptions(selectEl, options, defaultValue) {
  if (!selectEl) return;
  const selectedValue = selectEl.value || defaultValue;
  selectEl.innerHTML = "";
  options.forEach(opt => {
    const optionEl = document.createElement("option");
    optionEl.value = opt.value;
    optionEl.textContent = opt.text;
    selectEl.appendChild(optionEl);
  });
  selectEl.value = selectedValue;
}

function updateSelectOptions() {
  // Update testType select options
  const testTypeSelect = document.getElementById("testType");
  if (testTypeSelect) {
    populateSelectOptions(testTypeSelect, [
      { value: "reaction", text: t("ui.testType.reaction") },
      { value: "gonogo", text: t("ui.testType.gonogo") },
      { value: "divided", text: t("ui.testType.divided") }
    ], "reaction");
  }

  // Update historyTest select options
  const historyTestSelect = document.getElementById("historyTest");
  if (historyTestSelect) {
    populateSelectOptions(historyTestSelect, [
      { value: "reaction", text: t("ui.testType.reaction") },
      { value: "gonogo", text: t("ui.testType.gonogo") },
      { value: "divided", text: t("ui.testType.divided") }
    ], "reaction");
  }

  // Update contextMode select options
  const contextModeSelect = document.getElementById("contextMode");
  if (contextModeSelect) {
    populateSelectOptions(contextModeSelect, [
      { value: "baseline", text: t("ui.mode.baseline") },
      { value: "check", text: t("ui.mode.check") },
      { value: "training", text: t("ui.mode.training") }
    ], "baseline");
  }

  // Update historyMode select options
  const historyModeSelect = document.getElementById("historyMode");
  if (historyModeSelect) {
    populateSelectOptions(historyModeSelect, [
      { value: "all", text: t("ui.mode.all") },
      { value: "baseline", text: t("ui.mode.baseline") },
      { value: "check", text: t("ui.mode.check") },
      { value: "training", text: t("ui.mode.training") }
    ], "all");
  }
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_KEY, currentLang);
  applyLangUI();
}

const startBaselineBtn = document.getElementById("startBaselineBtn");
const startCheckBtn = document.getElementById("startCheckBtn");
const startTrainingBtn = document.getElementById("startTrainingBtn");
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

// Store last summary generation data for language switching
let lastSummaryData = null;

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

let mode = null; // "baseline" | "check" | "training" (set by button click, never by dropdown)

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

// Divided Attention state
let dividedPlan = null; // { trialTypes, flashTrialIndices, flashTargetCount }
let dividedFlashAnswer = null; // User's answer to flash count question
let flashOverlayTimeoutId = null; // For flash overlay timing

// Test configuration constants
const TEST_CONFIG = {
  reaction: {
    maxTrials: 40,
    delayMin: 600,
    delayMax: 1800,
  },
  gonogo: {
    maxTrials: 60,
    delayMin: 600,
    delayMax: 1800,
    goRatio: 0.7, // 70% GO, 30% NO-GO
    windowMs: 1400,
  },
  divided: {
    maxTrials: 50, // placeholder - adjust as needed
    goRatio: 0.8, // 80% GO, 20% NO-GO
    stimulusDuration: 600, // ms
    isiMin: 650, // ms - inter-stimulus interval minimum
    isiMax: 1400, // ms - inter-stimulus interval maximum
    flashDuration: 150, // ms
    flashCounts: {
      baseline: 8, // flashes per trial in baseline mode
      check: 6, // flashes per trial in check mode
      training: 10, // flashes per trial in training mode
    },
    // Note: Flash scheduling done by trial indices, not ms spacing
  },
};

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

  if (startTrainingBtn) {
    startTrainingBtn.addEventListener("click", () => {
      if (inSession) return;
      if (contextMode) contextMode.value = "training";
      mode = "training";
      beginSession();
    });
  }

  function baselineKey() {
    return baselineKeyFor(testType.value);
  }

  function beginSession() {
    const tt = testType.value;
    const config = TEST_CONFIG[tt] || TEST_CONFIG.reaction;
    const maxTrials = config.maxTrials || 40;
    totalTrials = clampInt(parseInt(trialCountInput.value, 10), 3, maxTrials);
    trialCountInput.value = totalTrials;
  
    inSession = true;
    trialIndex = 0;
    results = [];
    
    // Initialize divided attention plan if needed
    if (tt === "divided") {
      // Mode must come from button click; fallback to "check" only if somehow undefined
      dividedPlan = buildDividedPlan(totalTrials, mode || "check");
      dividedFlashAnswer = null; // Reset flash answer
    } else {
      dividedPlan = null;
      dividedFlashAnswer = null;
    }
  
    trialList.innerHTML = "";
    summary.textContent = "";
    testArea.classList.remove("hidden");
  
    trialCountInput.disabled = true;
    startBaselineBtn.disabled = true;
    startCheckBtn.disabled = true;
    if (startTrainingBtn) startTrainingBtn.disabled = true;
    resetBtn.style.display = "";
  
    nextTrial();
  }

resetBtn.addEventListener("click", () => {
  hardReset();
});

testArea.addEventListener("click", (e) => {
    if (!inSession) return;
    
    // Don't process clicks if flash question is showing (for divided attention)
    if (testType.value === "divided" && trialIndex > totalTrials) return;
    
    const tt = testType.value;
    
    // Route divided attention to dedicated handler
    if (tt === "divided") {
      handleDividedClick();
      return;
    }
  
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
  
    if (tt === "reaction") {
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

// Helper function to update trialCountInput max based on test type
function updateTrialCountMax() {
  if (!trialCountInput || !testType) return;
  const tt = testType.value;
  const config = TEST_CONFIG[tt] || TEST_CONFIG.reaction;
  const maxTrials = config.maxTrials || 40;
  // Clamp to 40 max to match HTML attribute
  const clampedMax = Math.min(maxTrials, 40);
  trialCountInput.setAttribute("max", clampedMax);
  // Clamp current value if it exceeds new max
  if (parseInt(trialCountInput.value, 10) > clampedMax) {
    trialCountInput.value = clampedMax;
  }
}

testType.addEventListener("change", () => {
    hardReset();
    updateTrialCountMax();
    updateBaselineInfo();
    updateDividedLegend();
    // Keep history filter aligned with current test by default
    if (historyTest) {
      historyTest.value = testType.value;
      renderHistory();
    }
  });

// Show/hide divided attention legend based on test type
function updateDividedLegend() {
  const instructionEl = document.getElementById("instruction");
  if (!instructionEl) return;
  
  // Remove existing legend if any
  const existingLegend = document.getElementById("dividedLegend");
  if (existingLegend) {
    existingLegend.remove();
  }
  
  // Add legend if divided attention is selected
  if (testType && testType.value === "divided") {
    const legend = document.createElement("p");
    legend.id = "dividedLegend";
    legend.className = "divided-legend muted";
    legend.style.marginTop = "8px";
    legend.style.fontSize = "13px";
    legend.style.opacity = "0.85";
    
    const legendEn = document.createElement("span");
    legendEn.className = "lang lang-en";
    legendEn.textContent = I18N.en.stimulus.divided.legend;
    legend.appendChild(legendEn);
    
    const legendNo = document.createElement("span");
    legendNo.className = "lang lang-no";
    legendNo.textContent = I18N.no.stimulus.divided.legend;
    legend.appendChild(legendNo);
    
    instructionEl.appendChild(legend);
    // Update visibility based on current language (applyLangUI will also handle this, but set initial state correctly)
    if (currentLang === "no") {
      legendEn.classList.add("hidden");
      legendNo.classList.remove("hidden");
    } else {
      legendEn.classList.remove("hidden");
      legendNo.classList.add("hidden");
    }
  }
}

// Initialize trialCountInput max on page load
updateTrialCountMax();

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

// Export history functionality
const exportHistoryBtn = document.getElementById("exportHistoryBtn");
const exportStatus = document.getElementById("exportStatus");

function setExportStatus(msg) {
  if (!exportStatus) return;
  exportStatus.textContent = msg;
  if (msg) setTimeout(() => (exportStatus.textContent = ""), 2500);
}

async function copyTextToClipboard(text) {
  // Works on HTTPS (GitHub Pages) and localhost. Fallback if blocked.
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function showExportFallback(text) {
  // Minimal, non-fancy fallback: put a textarea under the button.
  let box = document.getElementById("exportFallbackBox");
  if (!box) {
    box = document.createElement("textarea");
    box.id = "exportFallbackBox";
    box.rows = 10;
    box.style.width = "100%";
    box.style.marginTop = "10px";
    box.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    box.style.fontSize = "12px";
    // Put it near the button
    exportHistoryBtn.parentElement.appendChild(box);
  }
  box.value = text;
  box.focus();
  box.select();
}

function exportHistoryFor(testType) {
  const sessions = loadHistory(testType);

  if (!sessions.length) return { ok: false, reason: "empty" };

  const payload = {
    schema: "fce-history-export-v1",
    exportedAt: new Date().toISOString(),
    testType,
    sessions
  };

  return { ok: true, text: JSON.stringify(payload, null, 2) };
}

if (exportHistoryBtn) {
  exportHistoryBtn.addEventListener("click", async () => {
    // Use your existing UI selector for current test type:
    // likely `historyTest.value` or your history filter's selected test.
    const currentTest = (historyTest && historyTest.value)
      ? historyTest.value
      : (testType && testType.value ? testType.value : "reaction"); // fallback

    const res = exportHistoryFor(currentTest);

    if (!res.ok) {
      setExportStatus(t("export.empty"));
      return;
    }

    const copied = await copyTextToClipboard(res.text);
    if (copied) {
      setExportStatus(t("export.copied"));
    } else {
      setExportStatus(t("export.failed"));
      showExportFallback(res.text);
    }
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
      // For divided attention, show flash count question before ending session
      if (testType.value === "divided") {
        showDividedFlashQuestion();
        return;
      }
      endSession();
      return;
    }
  
    updateProgress();
  
    testArea.style.background = "red";
    testArea.textContent = t("stimulus.ready"); // "Ready…" (EN) / "Klar…" (NO)
    
    // Clear any flash overlay
    const existingFlash = document.getElementById("flashOverlay");
    if (existingFlash) {
      existingFlash.remove();
      if (flashOverlayTimeoutId) {
        clearTimeout(flashOverlayTimeoutId);
        flashOverlayTimeoutId = null;
      }
    }
  
    const tt = testType.value;
    const config = TEST_CONFIG[tt] || TEST_CONFIG.reaction;
    
    // ISI (Inter-Stimulus Interval): randomized 650-1400ms for divided attention
    let delay;
    if (tt === "divided") {
      const isiRange = (config.isiMax || 1400) - (config.isiMin || 650);
      delay = Math.random() * isiRange + (config.isiMin || 650);
    } else {
      const delayRange = (config.delayMax || 1800) - (config.delayMin || 600);
      delay = Math.random() * delayRange + (config.delayMin || 600);
    }
  
    timeoutId = setTimeout(() => {
      const tt = testType.value;
      
      if (tt === "reaction") {
        // Reaction Time: always GO
        testArea.style.background = "green";
        testArea.textContent = t("stimulus.reaction.go"); // "CLICK!" (EN) / "KLIKK!" (NO)
        startTime = performance.now();
        currentStim = "go";
        return;
      }
      
      if (tt === "divided") {
        // Divided Attention: route to dedicated handler
        runDividedAttention();
        return;
      }
  
      // Go/No-Go: 70% GO, 30% NO-GO
      const config = TEST_CONFIG.gonogo;
      const isGo = Math.random() < config.goRatio;
      currentStim = isGo ? "go" : "nogo";
  
      testArea.style.background = isGo ? "green" : "red";
      testArea.textContent = isGo ? t("stimulus.gonogo.go") : t("stimulus.gonogo.nogo");
  
      startTime = performance.now();
  
      // Auto-finish trial after window (miss detection)
      const windowMs = config.windowMs || 1400;
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

  // Divided Attention: Plan generator
  function buildDividedPlan(trials, mode) {
    const config = TEST_CONFIG.divided;
    const flashCount = config.flashCounts[mode] || config.flashCounts.check;
    
    // 1. Generate trialTypes array (80/20 GO/NO-GO distribution)
    const trialTypes = [];
    const goRatio = config.goRatio; // 0.8
    
    // First 2 trials must be GO
    for (let i = 0; i < 2 && i < trials; i++) {
      trialTypes.push("go");
    }
    
    // Remaining trials with 80/20 distribution
    let nogoCount = 0;
    for (let i = 2; i < trials; i++) {
      const targetNogoCount = Math.floor((i + 1) * (1 - goRatio));
      const canBeNogo = (nogoCount < targetNogoCount) && (trialTypes[i - 1] !== "nogo" || trialTypes[i - 2] !== "nogo");
      
      if (canBeNogo && Math.random() < (1 - goRatio)) {
        trialTypes.push("nogo");
        nogoCount++;
      } else {
        trialTypes.push("go");
      }
    }
    
    // 2. Generate flashTrialIndices
    // No flashes in first 2 trials
    // Spacing: min 2 trials apart, max 6 trials apart
    const flashTrialIndices = [];
    let lastFlashIndex = 1; // Start after first 2 trials
    
    for (let i = 0; i < flashCount; i++) {
      // Find next valid position (min 2 apart, max 6 apart from last flash, and after first 2 trials)
      const minNextIndex = lastFlashIndex + 2;
      const maxNextIndex = Math.min(lastFlashIndex + 6, trials - 1);
      
      if (minNextIndex >= trials) break; // Can't fit more flashes
      
      // Random position within valid range
      const nextIndex = minNextIndex + Math.floor(Math.random() * (maxNextIndex - minNextIndex + 1));
      flashTrialIndices.push(nextIndex);
      lastFlashIndex = nextIndex;
    }
    
    // Warn if we couldn't fit all requested flashes (due to small trial count)
    const actualFlashCount = flashTrialIndices.length;
    // Note: If actualFlashCount < flashCount, we silently adjust to actual count
    // This can happen with small trial counts (< 10-12) where spacing constraints prevent all flashes
    
    return {
      trialTypes,
      flashTrialIndices,
      flashTargetCount: actualFlashCount  // Use actual count, not requested
    };
  }

  // Divided Attention test handler
  function runDividedAttention() {
    if (!dividedPlan) {
      // Initialize plan on first trial
      // Mode must come from button click; fallback to "check" only if somehow undefined
      dividedPlan = buildDividedPlan(totalTrials, mode || "check");
    }
    
    const myToken = trialToken; // Capture token for timeout closure
    
    const config = TEST_CONFIG.divided;
    const currentTrialIdx = trialIndex - 1; // trialIndex is already incremented
    
    // Explicitly block flashes in first 2 trials (defensive check - plan generation should prevent this)
    if (currentTrialIdx < 2 && dividedPlan.flashTrialIndices.includes(currentTrialIdx)) {
      // Silently skip flash if somehow scheduled in first 2 trials
      return;
    }
    
    const isGo = dividedPlan.trialTypes[currentTrialIdx] === "go";
    
    // Show stimulus
    testArea.style.background = isGo ? "green" : "red";
    testArea.textContent = isGo ? t("stimulus.divided.go") : t("stimulus.divided.nogo");
    // "TAP" / "NO TAP" (EN) or "TRYKK" / "IKKE" (NO)
    startTime = performance.now();
    currentStim = isGo ? "go" : "nogo";
    
    // Show flash overlay if this is a flash trial (and not in first 2 trials)
    if (currentTrialIdx >= 2 && dividedPlan.flashTrialIndices.includes(currentTrialIdx)) {
      showFlashOverlay();
    }
    
    // Stimulus window: 600ms (GO missed if no click in window)
    const windowMs = config.stimulusDuration || 600;
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
  }
  
  // Flash overlay: show blue dot for 150ms
  function showFlashOverlay() {
    // Clear any existing flash overlay
    const existing = document.getElementById("flashOverlay");
    if (existing) {
      existing.remove();
      if (flashOverlayTimeoutId) {
        clearTimeout(flashOverlayTimeoutId);
      }
    }
    
    // Create flash overlay element
    const flashOverlay = document.createElement("div");
    flashOverlay.id = "flashOverlay";
    flashOverlay.className = "flash-overlay";
    testArea.appendChild(flashOverlay);
    
    // Remove after 150ms
    flashOverlayTimeoutId = setTimeout(() => {
      if (flashOverlay && flashOverlay.parentNode) {
        flashOverlay.remove();
      }
      flashOverlayTimeoutId = null;
    }, TEST_CONFIG.divided.flashDuration || 150);
  }
  
  // Show flash count question after last trial
  function showDividedFlashQuestion() {
    // Ensure test area is visible (not hidden)
    testArea.classList.remove("hidden");
    
    // Clear test area and show question UI
    testArea.style.background = "#1a1a1a";
    testArea.innerHTML = "";
    
    const questionDiv = document.createElement("div");
    questionDiv.className = "divided-question";
    
    const prompt = document.createElement("p");
    prompt.textContent = currentLang === "no" 
      ? "Hvor mange blå blink så du?" 
      : "How many blue flashes did you see?";
    prompt.style.marginBottom = "12px";
    prompt.style.textAlign = "center";
    questionDiv.appendChild(prompt);
    
    const selectContainer = document.createElement("div");
    selectContainer.style.display = "flex";
    selectContainer.style.gap = "10px";
    selectContainer.style.alignItems = "center";
    selectContainer.style.justifyContent = "center";
    
    const select = document.createElement("select");
    select.id = "flashCountSelect";
    for (let i = 0; i <= 20; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      if (i === 0) option.selected = true;
      select.appendChild(option);
    }
    // Prevent clicks on dropdown from triggering testArea click handler
    select.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    select.addEventListener("change", (e) => {
      e.stopPropagation();
    });
    selectContainer.appendChild(select);
    
    const confirmBtn = document.createElement("button");
    confirmBtn.textContent = currentLang === "no" ? "Bekreft" : "Confirm";
    confirmBtn.className = "primary";
    confirmBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent triggering testArea click handler
      const answer = parseInt(select.value, 10);
      if (isNaN(answer)) {
        alert(currentLang === "no" ? "Velg et tall før du fortsetter." : "Please select a number before continuing.");
        return;
      }
      dividedFlashAnswer = answer;
      endSession();
    });
    selectContainer.appendChild(confirmBtn);
    
    questionDiv.appendChild(selectContainer);
    testArea.appendChild(questionDiv);
  }

  // Divided Attention click handler
  function handleDividedClick() {
    if (!inSession) return;
    
    // Don't process clicks if we're past the last trial (showing flash question)
    if (trialIndex > totalTrials) return;
    
    const currentTrialIdx = trialIndex - 1;
    const currentTrialType = dividedPlan ? dividedPlan.trialTypes[currentTrialIdx] : "go";
    
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
    
    // Handle GO vs NO-GO response
    if (currentTrialType === "go") {
      // GO hit: record reaction time
      recordResult({ type: "go", rt });
    } else {
      // NO-GO false alarm: clicked when shouldn't have
      recordResult({ type: "false_alarm", rt });
    }
    
    setTimeout(nextTrial, 250);
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
    if (startTrainingBtn) startTrainingBtn.disabled = false;
    resetBtn.style.display = "none";
  
    updateProgress(true);
  
    const tt = testType.value;
    const isReaction = tt === "reaction";
    const isGoNoGo = tt === "gonogo";
    const isDivided = tt === "divided";
  
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
          mode: mode || "", // Mode must come from button click, not dropdown
          metrics: { avgMs: 0, sdMs: 0, bestMs: 0, worstMs: 0, trials: 0, falseStarts },
          flags,
          tags,
          device
        });
        renderHistory();
        setSummary("invalid_no_reaction", {}, "reaction", mode);
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
    } else if (isGoNoGo) {
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
          mode: mode || "", // Mode must come from button click, not dropdown
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
        setSummary("invalid_no_go", {}, "gonogo", mode);
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
    } else if (isDivided) {
      // Divided Attention metrics
      const goHits = results.filter(e => e && e.type === "go").map(e => e.rt);
      const misses = results.filter(e => e && e.type === "miss").length;
      const falseAlarms = results.filter(e => e && e.type === "false_alarm").length;
      const falseStarts = results.filter(e => e && e.type === "false_start").length;
      
      // Check for missing flash answer
      if (dividedFlashAnswer === null || dividedFlashAnswer === undefined) {
        flags = { invalid: true, reason: "missing_secondary_answer" };
        pushHistoryRecord({
          id: createdAt,
          createdAt,
          testType: "divided",
          mode: mode || "", // Mode must come from button click, not dropdown
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
            falseStarts,
            flashTargetCount: dividedPlan ? dividedPlan.flashTargetCount : 0,
            flashUserCount: 0,
            flashAbsError: 0
          },
          flags,
          tags,
          device
        });
        renderHistory();
        setSummary("invalid_missing_answer", {}, "divided", mode);
        mode = null;
        dividedPlan = null;
        dividedFlashAnswer = null;
        return;
      }
      
      if (goHits.length === 0) {
        flags = { invalid: true, reason: "no_go_responses" };
        pushHistoryRecord({
          id: createdAt,
          createdAt,
          testType: "divided",
          mode: mode || "", // Mode must come from button click, not dropdown
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
            falseStarts,
            flashTargetCount: dividedPlan ? dividedPlan.flashTargetCount : 0,
            flashUserCount: dividedFlashAnswer || 0,
            flashAbsError: dividedPlan ? Math.abs((dividedFlashAnswer || 0) - dividedPlan.flashTargetCount) : 0
          },
          flags,
          tags,
          device
        });
        renderHistory();
        setSummary("invalid_no_go_responses_divided", {}, "divided", mode);
        mode = null;
        dividedPlan = null;
        dividedFlashAnswer = null;
        return;
      }
      
      const flashTargetCount = dividedPlan ? dividedPlan.flashTargetCount : 0;
      const flashUserCount = dividedFlashAnswer || 0;
      const flashAbsError = Math.abs(flashUserCount - flashTargetCount);
      
      // Track hits explicitly (number of GO hits, not total trials)
      const hits = goHits.length;
      
      // Count NO-GO trials for false alarm rate calculation
      const nogoCount = dividedPlan ? dividedPlan.trialTypes.filter(t => t === "nogo").length : 0;
      
      sessionPayload = {
        mean: mean(goHits),      // mean RT on GO hits
        sd: stddev(goHits),      // consistency on GO hits
        trials: totalTrials,     // total trials in session
        hits,                    // number of GO hits
        nogoCount,               // number of NO-GO trials
        best: Math.min(...goHits),
        worst: Math.max(...goHits),
        misses,
        falseAlarms,
        falseStarts,
        flashTargetCount,
        flashUserCount,
        flashAbsError
      };
    }

    // Always write session record (even if baseline refuses saving later)
    const sessionRecord = {
      id: createdAt,
      createdAt,
      testType: tt, // Use actual testType value
      mode: mode || "", // Mode must come from button click, never from dropdown
      metrics: isReaction
        ? {
            avgMs: sessionPayload.mean,
            sdMs: sessionPayload.sd,
            bestMs: sessionPayload.best,
            worstMs: sessionPayload.worst,
            trials: sessionPayload.trials,
            falseStarts: sessionPayload.falseStarts
          }
        : isDivided
        ? {
            avgMs: sessionPayload.mean,
            sdMs: sessionPayload.sd,
            bestMs: sessionPayload.best,
            worstMs: sessionPayload.worst,
            trials: sessionPayload.trials,
            hits: sessionPayload.hits,  // Use explicit hits count, not trials
            nogoCount: sessionPayload.nogoCount,  // Store NO-GO trial count for false alarm rate calculation
            misses: sessionPayload.misses,
            falseAlarms: sessionPayload.falseAlarms,
            correctRejects: results.filter(e => e && e.type === "correct_reject").length,
            falseStarts: sessionPayload.falseStarts,
            flashTargetCount: sessionPayload.flashTargetCount,
            flashUserCount: sessionPayload.flashUserCount,
            flashAbsError: sessionPayload.flashAbsError
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
    // Defensive guard: only update baseline if mode is baseline AND session is valid
    // Training mode and invalid sessions should never update baseline (but can still be saved to history)
    const canUpdateBaseline = (mode === "baseline") && !(flags && flags.invalid);
    
    if (canUpdateBaseline) {
      // Go/No-Go and Divided Attention baseline validity rule: require minimum valid GO responses
      if (isGoNoGo || isDivided) {
        const goHits = results.filter(e => e && e.type === "go").length;
        
        // Different thresholds based on test type:
        // - Go/No-Go (70% GO ratio): require ≥10 GO responses (fixed threshold)
        // - Divided Attention (80% GO ratio): require ≥80% of trials as GO responses, minimum 8
        let minGoHits;
        if (isDivided) {
          // For Divided Attention: proportional threshold (80% of trials, minimum 8)
          minGoHits = Math.max(8, Math.ceil(totalTrials * 0.8));
        } else {
          // For Go/No-Go: fixed threshold of 10
          minGoHits = 10;
        }

        if (goHits < minGoHits) {
          // Mark latest history record as invalid (baseline refused)
          sessionRecord.flags = { invalid: true, reason: "baseline_refused_too_few_go" };
          const hs = loadHistory(tt);
          hs[hs.length - 1] = sessionRecord;
          saveHistory(tt, hs);
          renderHistory();
          // Use divided-attention specific message if applicable, with flash info if available
          if (isDivided) {
            // Try to get flash info from sessionPayload first, fallback to sessionRecord metrics
            const flashTarget = sessionPayload?.flashTargetCount ?? sessionRecord?.metrics?.flashTargetCount ?? 0;
            const flashUser = sessionPayload?.flashUserCount ?? sessionRecord?.metrics?.flashUserCount ?? 0;
            const flashError = sessionPayload?.flashAbsError ?? sessionRecord?.metrics?.flashAbsError ?? 0;
            
            setSummary("baseline_not_saved_divided", {
              flashTarget: flashTarget > 0 || flashUser > 0 ? flashTarget : undefined,
              flashUser: flashTarget > 0 || flashUser > 0 ? flashUser : undefined,
              flashError: flashTarget > 0 || flashUser > 0 ? flashError : undefined
            }, tt, mode);
          } else {
            setSummary("baseline_not_saved", {}, tt, mode);
          }
          mode = null;
          if (isDivided) {
            dividedPlan = null;
            dividedFlashAnswer = null;
          }
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
        setSummary("baseline_saved_reaction", {
          mean: sessionPayload.mean,
          sd: sessionPayload.sd,
          falseStarts: sessionPayload.falseStarts,
          qualityNote
        }, tt, mode);
      } else if (isDivided) {
        setSummary("baseline_saved_divided", {
          mean: sessionPayload.mean,
          sd: sessionPayload.sd,
          misses: sessionPayload.misses,
          falseAlarms: sessionPayload.falseAlarms,
          falseStarts: sessionPayload.falseStarts,
          flashTargetCount: sessionPayload.flashTargetCount || 0,
          flashAbsError: sessionPayload.flashAbsError || 0,
          qualityNote
        }, tt, mode);
      } else if (isGoNoGo) {
        setSummary("baseline_saved_gonogo", {
          mean: sessionPayload.mean,
          sd: sessionPayload.sd,
          misses: sessionPayload.misses,
          falseAlarms: sessionPayload.falseAlarms,
          falseStarts: sessionPayload.falseStarts,
          qualityNote
        }, tt, mode);
      }

      mode = null;
      if (isDivided) {
        dividedPlan = null;
        dividedFlashAnswer = null;
      }
      return;
    }

    // ---- Training mode (or any other mode): show summary if divided attention ----
    if (isDivided && mode && mode !== "baseline" && mode !== "check") {
      // For training mode or any other mode, show a summary with flash info
      setSummary("training_divided", {
        mean: sessionPayload.mean,
        sd: sessionPayload.sd,
        flashTargetCount: sessionPayload.flashTargetCount,
        flashUserCount: sessionPayload.flashUserCount,
        flashAbsError: sessionPayload.flashAbsError
      }, tt, mode);
      mode = null;
      dividedPlan = null;
      dividedFlashAnswer = null;
      // Update baseline info to ensure button states are correct (training doesn't update baseline, so button should be disabled if no baseline exists)
      updateBaselineInfo();
      return;
    }
  
    // ---- Check mode: compare to baseline ----
    if (mode === "check") {
      const sessionsRaw = loadBaseline();
      const sessions = filterValidBaselineSessions(sessionsRaw);
  
      if (sessions.length < minBaselineSessions()) {
        // Mark latest history record as invalid (check cannot compare)
        // tt already defined above
        sessionRecord.flags = { invalid: true, reason: "not_enough_baseline" };
        const hs = loadHistory(tt);
        hs[hs.length - 1] = sessionRecord;
        saveHistory(tt, hs);
        renderHistory();
        setSummary("not_enough_baseline", {}, tt, mode);
        mode = null;
        if (isDivided) {
          dividedPlan = null;
          dividedFlashAnswer = null;
        }
        return;
      }
  
      // Calculate baseline stats once (used for status and summary)
      const baselineMean = mean(sessions.map(s => s.mean));
      const baselineSD = mean(sessions.map(s => s.sd));
      
      let status;
      
      if (isDivided) {
        // Divided Attention: compare avgMs, falseAlarmsRate, and flashAbsError
        status = getDividedAttentionStatus(sessionPayload, sessions);
      } else {
        // Reaction Time and Go/No-Go: compare avgMs only
        if (sessionPayload.mean <= baselineMean + baselineSD) {
          status = t("status.within");
        } else if (sessionPayload.mean <= baselineMean + 2 * baselineSD) {
          status = t("status.slightly");
        } else {
          status = t("status.significantly");
        }
      }

      const qualityNote = checkSessionQuality(sessionPayload, totalTrials, isReaction);
      
      if (isReaction) {
        setSummary("check_reaction", {
          mean: sessionPayload.mean,
          baselineMean,
          baselineSD,
          status,
          falseStarts: sessionPayload.falseStarts,
          qualityNote
        }, tt, mode);
      } else if (isDivided) {
        // Divided Attention check summary
        // False alarm rate: use NO-GO trial count as denominator
        const baselineFARate = mean(sessions.map(s => {
          if (typeof s.falseAlarms === "number" && typeof s.nogoCount === "number" && s.nogoCount > 0) {
            return s.falseAlarms / s.nogoCount;
          }
          return 0;
        }));
        const baselineFlashError = mean(sessions.map(s => (typeof s.flashAbsError === "number" ? s.flashAbsError : 0)));
        const nogoCount = sessionPayload.nogoCount || 0;
        const currentFARate = nogoCount > 0 ? (sessionPayload.falseAlarms || 0) / nogoCount : 0;
        
        setSummary("check_divided", {
          mean: sessionPayload.mean,
          baselineMean,
          baselineSD,
          status,
          falseAlarmsRate: currentFARate,
          baselineFARate,
          flashAbsError: sessionPayload.flashAbsError,
          baselineFlashError,
          falseStarts: sessionPayload.falseStarts,
          qualityNote
        }, tt, mode);
      } else {
        // For Go/No-Go, also show error counts clearly.
        // Optional: compare errors vs baseline averages (simple, explainable)
        const baselineMissAvg = mean(sessions.map(s => (typeof s.misses === "number" ? s.misses : 0)));
        const baselineFAAvg = mean(sessions.map(s => (typeof s.falseAlarms === "number" ? s.falseAlarms : 0)));

        setSummary("check_gonogo", {
          mean: sessionPayload.mean,
          baselineMean,
          baselineSD,
          status,
          misses: sessionPayload.misses,
          baselineMissAvg,
          falseAlarms: sessionPayload.falseAlarms,
          baselineFAAvg,
          falseStarts: sessionPayload.falseStarts,
          qualityNote
        }, tt, mode);
      }
  
      mode = null;
      if (isDivided) {
        dividedPlan = null;
        dividedFlashAnswer = null;
      }
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
  // Clear divided attention state on reset
  dividedPlan = null;
  dividedFlashAnswer = null;
  if (flashOverlayTimeoutId) {
    clearTimeout(flashOverlayTimeoutId);
    flashOverlayTimeoutId = null;
  }
  clearTimeout(timeoutId);

  inSession = false;
  startTime = null;
  results = [];
  trialIndex = 0;

  testArea.classList.add("hidden");
  testArea.textContent = "";
  testArea.style.background = "red";
  testArea.innerHTML = ""; // Clear any flash overlay or question UI

  trialList.innerHTML = "";
  summary.textContent = "";
  lastSummaryData = null; // Clear summary data on reset
  progress.textContent = "";


  trialCountInput.disabled = false;
  startBaselineBtn.disabled = false;
  startCheckBtn.disabled = false;
  if (startTrainingBtn) startTrainingBtn.disabled = false;
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
    const sessionsRaw = loadBaseline();
    const sessions = filterValidBaselineSessions(sessionsRaw);

    // Clear list UI
    baselineList.innerHTML = "";

    const minSessions = minBaselineSessions();
    const recTrials = recommendedTrialsPerSession();
    const tt = testType.value;
    const isGoNoGo = tt === "gonogo";
    const isDivided = tt === "divided";

    // Guidance text (always shown) - update both language spans
    const guidanceEn = baselineGuidance.querySelector(".lang-en");
    const guidanceNo = baselineGuidance.querySelector(".lang-no");
    if (guidanceEn) {
      if (isGoNoGo) {
        guidanceEn.textContent = `Recommended: ≥${minSessions} baseline sessions, ≥${recTrials} trials per session (Go/No-Go needs more trials for stable results).`;
      } else if (isDivided) {
        guidanceEn.textContent = `Recommended: ≥${minSessions} baseline sessions, ≥${recTrials} trials per session (Divided Attention needs more trials for flash counting).`;
      } else {
        guidanceEn.textContent = `Recommended: ≥${minSessions} baseline sessions, ≥${recTrials} trials per session.`;
      }
    }
    if (guidanceNo) {
      if (isGoNoGo) {
        guidanceNo.textContent = `Anbefalt: ≥${minSessions} baseline-økter, ≥${recTrials} forsøk per økt (Go/No-Go trenger flere forsøk for stabile resultater).`;
      } else if (isDivided) {
        guidanceNo.textContent = `Anbefalt: ≥${minSessions} baseline-økter, ≥${recTrials} forsøk per økt (Delt oppmerksomhet trenger flere forsøk for flash-telling).`;
      } else {
        guidanceNo.textContent = `Anbefalt: ≥${minSessions} baseline-økter, ≥${recTrials} forsøk per økt.`;
      }
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
    const prefix = (isGoNoGo || isDivided) ? "GO " : "";
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
        `${formatTime(s.timestamp)} — ${t("history.mean")} ${s.mean.toFixed(0)} ms, ${t("history.sd")} ${s.sd.toFixed(0)} ms (${s.trials} ${t("history.trials")})`;
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

// Helper to get baseline key for a given test type (module scope)
function baselineKeyFor(tt) {
  if (tt === "gonogo") return "fce_baseline_gonogo_v1";
  if (tt === "divided") return "fce_baseline_divided_v1";
  return "fce_baseline_reaction_v1";
}

function minBaselineSessions() {
  return 3;
}

// Helper to filter valid baseline sessions (excludes invalid/malformed entries)
function filterValidBaselineSessions(sessions) {
  if (!Array.isArray(sessions)) return [];
  return sessions.filter(s => {
    if (!s) return false;
    // Check if it has required fields (mean, sd) and they are valid numbers
    if (typeof s.mean !== "number" || typeof s.sd !== "number") return false;
    if (Number.isNaN(s.mean) || Number.isNaN(s.sd) || !Number.isFinite(s.mean) || !Number.isFinite(s.sd)) return false;
    // Check if it's not marked as invalid (safety check)
    if (s.flags && s.flags.invalid === true) return false;
    return true;
  });
}

function recommendedTrialsPerSession() {
  const tt = testType.value;
  if (tt === "gonogo") return 20;
  if (tt === "divided") return 10; // Divided attention needs enough trials for flashes
  return 5; // Reaction Time
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

function fmt(n, digits = 0) {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return n.toFixed(digits);
}

function formatDateTime(iso) {
  try {
    const d = new Date(iso);

    const locale = currentLang === "no" ? "nb-NO" : undefined;

    // NO: 24h clock; EN: system default (often 12h)
    const opts = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: currentLang === "no" ? false : undefined
    };

    return d.toLocaleString(locale, opts);
  } catch {
    return iso || "—";
  }
}

function clampBadgeClass(statusText) {
  // Map your existing status strings to badges.
  // Adjust if your exact labels differ.
  const s = (statusText || "").toLowerCase();
  if (s.includes("within") || s.includes("innenfor")) return "ok";
  if (s.includes("slightly") || s.includes("litt")) return "warn";
  if (s.includes("significantly") || s.includes("betydelig")) return "bad";
  return "na";
}

// Compute baseline mean/sd from baseline sessions (excluding invalid)
function computeBaselineFromHistory(sessions) {
  const base = sessions
    .filter(s => s && s.mode === "baseline" && s.flags && s.flags.invalid === false)
    .map(s => s.metrics && typeof s.metrics.avgMs === "number" ? s.metrics.avgMs : null)
    .filter(v => typeof v === "number" && !Number.isNaN(v));

  if (base.length < 1) return null;

  // reuse your mean/stddev if you already have them; otherwise:
  const m = base.reduce((a, b) => a + b, 0) / base.length;
  const variance = base.length > 1
    ? base.reduce((acc, x) => acc + Math.pow(x - m, 2), 0) / (base.length - 1)
    : 0;

  const sd = Math.sqrt(variance);
  return { mean: m, sd, n: base.length };
}

function statusLabelFromCompare(meanMs, baselineMean, baselineSD) {
  if (!Number.isFinite(baselineMean) || !Number.isFinite(baselineSD)) return "";
  if (meanMs <= baselineMean + baselineSD) return t("status.within");
  if (meanMs <= baselineMean + 2 * baselineSD) return t("status.slightly");
  return t("status.significantly");
}

function renderTrendFor(testType) {
  const baselineLine = document.getElementById("trendBaselineLine");
  const recentChecksEl = document.getElementById("trendRecentChecks");
  const emptyNote = document.getElementById("trendEmptyNote");

  if (!baselineLine || !recentChecksEl || !emptyNote) return;

  // Use your existing history loader
  const sessions = loadHistory(testType);

  recentChecksEl.innerHTML = "";
  emptyNote.textContent = "";

  const baseline = computeBaselineFromHistory(sessions);

  if (!baseline) {
    baselineLine.textContent = t("trend.noBaseline");
  } else {
    const lo = baseline.mean - baseline.sd;
    const hi = baseline.mean + baseline.sd;
    baselineLine.textContent = t("trend.baselineLine")
      .replace("{mean}", fmt(baseline.mean, 0))
      .replace("{sd}", fmt(baseline.sd, 0))
      .replace("{lo}", fmt(lo, 0))
      .replace("{hi}", fmt(hi, 0));
  }

  // Recent CHECK sessions (exclude invalid if you prefer; I recommend *including* but marking)
  const checks = sessions
    .filter(s => s && s.mode === "check")
    .sort((a, b) => (b.createdAt || b.id || "").localeCompare(a.createdAt || a.id || ""))
    .slice(0, 10);

  if (checks.length === 0) {
    emptyNote.textContent = t("trend.noChecks");
    return;
  }

  checks.forEach(s => {
    const avg = s?.metrics?.avgMs;
    const isInvalid = !!(s?.flags?.invalid);
    const when = formatDateTime(s?.createdAt || s?.id);
    const delta = (baseline && typeof avg === "number") ? (avg - baseline.mean) : null;

    // Use your existing check status logic if you have it.
    // If you already store s.statusText, prefer that:
    let statusText = s?.statusText || "";
    if (!statusText && baseline && typeof avg === "number" && typeof baseline.sd === "number") {
      // Use existing statusLabelFromCompare function
      statusText = statusLabelFromCompare(avg, baseline.mean, baseline.sd);
    }

    const badgeClass = isInvalid ? "na" : clampBadgeClass(statusText);

    const li = document.createElement("li");
    li.className = "trend-item";

    const left = document.createElement("div");
    left.className = "trend-left";

    const badgeText = isInvalid ? t("trend.invalid") : t("trend.ok");
    const title = document.createElement("div");
    title.innerHTML = `<span class="badge ${badgeClass}">${badgeText}</span> <strong>${t("trend.checkLabel")}</strong> — ${when}`;
    left.appendChild(title);

    const sub = document.createElement("div");
    sub.className = "muted";
    sub.textContent = statusText ? t("trend.status").replace("{status}", statusText) : "";
    left.appendChild(sub);

    const right = document.createElement("div");
    right.className = "trend-right";

    const avgLine = document.createElement("div");
    avgLine.innerHTML = `<strong>${fmt(avg, 0)}</strong> ms`;
    right.appendChild(avgLine);

    const deltaLine = document.createElement("div");
    deltaLine.className = "muted";
    deltaLine.textContent = (delta === null) ? "" : t("trend.delta").replace("{delta}", fmt(delta, 0));
    right.appendChild(deltaLine);

    li.appendChild(left);
    li.appendChild(right);
    recentChecksEl.appendChild(li);
  });
}

function renderHistory() {
  if (!historyListEl || !historyEmpty || !historyTest || !historyMode) return;

  const tt = historyTest.value || "reaction";
  const modeFilter = historyMode.value || "all";

  let sessions = loadHistory(tt);
  sessions = sessions.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

  // Render trend panel (needs all sessions, not filtered)
  renderTrendFor(tt);

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
  const baselineSessionsRaw = (() => {
    try {
      // Use baselineKeyFor() to get correct key for test type
      const key = baselineKeyFor(tt);
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  })();

  // Filter out invalid baseline sessions before using them
  const baselineSessions = filterValidBaselineSessions(baselineSessionsRaw);

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
    const modeValue = s.mode || "";
    meta.textContent = modeValue ? t(`ui.mode.${modeValue}`) || modeValue : "";
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
    line1.textContent = `${t("history.avg")} ${Number.isFinite(avg) ? avg.toFixed(0) : "—"} ms · ${t("history.sd")} ${Number.isFinite(sd) ? sd.toFixed(0) : "—"} · ${t("history.trials")} ${Number.isFinite(trials) ? trials : "—"}`;
    body.appendChild(line1);

    const line2 = document.createElement("div");
    line2.className = "history-line muted";
    line2.textContent = `${t("history.best")} ${Number.isFinite(best) ? best.toFixed(0) : "—"} · ${t("history.worst")} ${Number.isFinite(worst) ? worst.toFixed(0) : "—"}`;
    body.appendChild(line2);

    if (tt === "gonogo") {
      const errs = document.createElement("div");
      errs.className = "history-line";
      errs.textContent = `${t("history.misses")} ${m.misses ?? 0} · ${t("history.falseAlarms")} ${m.falseAlarms ?? 0} · ${t("history.falseStarts")} ${m.falseStarts ?? 0}`;
      body.appendChild(errs);
    } else if (tt === "divided") {
      // Show errors for divided attention
      const errs = document.createElement("div");
      errs.className = "history-line";
      errs.textContent = `${t("history.misses")} ${m.misses ?? 0} · ${t("history.falseAlarms")} ${m.falseAlarms ?? 0} · ${t("history.falseStarts")} ${m.falseStarts ?? 0}`;
      body.appendChild(errs);
      
      // Show flash metrics for divided attention
      if (typeof m.flashTargetCount === "number" && typeof m.flashUserCount === "number" && typeof m.flashAbsError === "number") {
        const flashLine = document.createElement("div");
        flashLine.className = "history-line muted";
        const flashLabel = currentLang === "no" ? "Flashes" : "Flashes";
        flashLine.textContent = `${flashLabel}: ${currentLang === "no" ? "mål" : "target"} ${m.flashTargetCount} · ${currentLang === "no" ? "svar" : "answer"} ${m.flashUserCount} · ${currentLang === "no" ? "feil" : "error"} ${m.flashAbsError}`;
        body.appendChild(flashLine);
      }
    } else {
      // Reaction Time: only false starts
      const fs = document.createElement("div");
      fs.className = "history-line";
      fs.textContent = `${t("history.falseStarts")} ${m.falseStarts ?? 0}`;
      body.appendChild(fs);
    }

    // Compare-to-baseline hint for check sessions
    if (s.mode === "check" && baselineSessions.length) {
      let status;
      // For divided attention, use multi-metric comparison if available; otherwise use avgMs only
      if (tt === "divided" && m.nogoCount !== undefined && m.flashAbsError !== undefined) {
        // Use multi-metric status comparison for divided attention
        const sessionPayloadMock = {
          mean: avg,
          falseAlarms: m.falseAlarms || 0,
          trials: m.trials || 0,
          nogoCount: m.nogoCount || 0,
          flashAbsError: m.flashAbsError || 0
        };
        status = getDividedAttentionStatus(sessionPayloadMock, baselineSessions);
      } else {
        // For reaction and gonogo, use avgMs only (existing behavior)
        status = statusLabelFromCompare(avg, baselineMean, baselineSD);
      }
      const delta = Number.isFinite(avg) && Number.isFinite(baselineMean) ? (avg - baselineMean) : NaN;
      const cmp = document.createElement("div");
      cmp.className = "history-compare";
      cmp.textContent = `${status} · Δ ${Number.isFinite(delta) ? (delta >= 0 ? "+" : "") + delta.toFixed(0) : "—"} ms (${t("history.baseline")} ${baselineMean.toFixed(0)} ± ${baselineSD.toFixed(0)} (±2 SD))`;
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
updateDividedLegend();

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
