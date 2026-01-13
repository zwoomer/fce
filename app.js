document.addEventListener("DOMContentLoaded", () => {
// Language system
const LANG_KEY = "fce_lang";
const ONBOARDING_KEY = "fce_onboarding_done";
// Check for new key first, then migrate from old key if present
let currentLang = localStorage.getItem(LANG_KEY);
if (!currentLang) {
  // Migrate from old key for backward compatibility
  const oldLang = localStorage.getItem("fce_lang_v1");
  if (oldLang) {
    currentLang = oldLang;
    localStorage.setItem(LANG_KEY, currentLang);
  } else {
    currentLang = "en";
  }
}

// Test type persistence
const TEST_TYPE_KEY = "fce_test_type_v1";

// Build lightweight trial log for display
function buildTrialLog(tt, results) {
  if (!Array.isArray(results)) return [];
  // Store minimal info per trial for UI display only
  return results.map((e, idx) => {
    const type = e?.type || "unknown";
    const rt = Number.isFinite(e?.rt) ? Math.round(e.rt) : null;

    // Normalize outcome labels for display
    let outcome = type;
    if (tt === "reaction") {
      outcome = (type === "rt") ? "hit" : (type === "false_start" ? "false_start" : type);
    } else if (tt === "gonogo" || tt === "divided") {
      // Possible: go, miss, false_alarm, correct_reject, false_start
      outcome = type;
    }

    return { i: idx + 1, outcome, rt };
  });
}

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
      history: "History",
      historyDisabled: "History (available after first run)",
      home: "Home",
      about: "About",
      howToUse: "How to use",
      faq: "FAQ",
      norwegianContext: "Norwegian Context",
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
      noTrialData: "No trial data available",
    },
    trialOutcome: {
      hit: "Hit",
      go: "GO",
      miss: "Miss",
      false_alarm: "False alarm",
      correct_reject: "Correct",
      false_start: "False start",
      unknown: "Unknown",
    },
    quality: {
      good: "Good",
      mixed: "Mixed",
      not_usable: "Not usable",
      label: "Quality",
    },
    refusal: {
      R1_INVALID_EXECUTION: "Session not usable: execution failure (no valid responses recorded).",
      R2_INSUFFICIENT_DATA: "Session not usable: insufficient data (too few valid responses).",
      R3_EXCESS_NOISE: "Session not usable: excessive errors (too many false starts or inhibitory errors).",
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
      history: "Historikk",
      historyDisabled: "Historikk (tilgjengelig etter første kjøring)",
      home: "Hjem",
      about: "Om",
      howToUse: "Hvordan bruke",
      faq: "FAQ",
      norwegianContext: "Norsk kontekst",
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
      noTrialData: "Ingen forsøksdata tilgjengelig",
    },
    trialOutcome: {
      hit: "Treff",
      go: "GO",
      miss: "Bom",
      false_alarm: "Inhibisjonsfeil",
      correct_reject: "Korrekt",
      false_start: "Feilstart",
      unknown: "Ukjent",
    },
    quality: {
      good: "God",
      mixed: "Blandet",
      not_usable: "Ikke brukbar",
      label: "Kvalitet",
    },
    refusal: {
      R1_INVALID_EXECUTION: "Økt ikke brukbar: utførelsesfeil (ingen gyldige responser registrert).",
      R2_INSUFFICIENT_DATA: "Økt ikke brukbar: utilstrekkelige data (for få gyldige responser).",
      R3_EXCESS_NOISE: "Økt ikke brukbar: for mange feil (for mange feilstarter eller inhibisjonsfeil).",
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
  lt: {
    ui: {
      test: "Testas",
      trials: "Bandymai",
      addBaseline: "Pridėti bazinio lygio sesiją",
      runCheck: "Atlikti funkcinę patikrą",
      runTraining: "Paleisti treniruotę",
      reset: "Atstatyti",
      clearBaseline: "Išvalyti bazinį lygį",
      history: "Istorija",
      historyDisabled: "Istorija (prieinama po pirmo paleidimo)",
      home: "Pradžia",
      about: "Apie",
      howToUse: "Kaip naudoti",
      faq: "DUK",
      norwegianContext: "Norvegiškas kontekstas",
      testType: {
        reaction: "Reakcijos laikas",
        gonogo: "Spausk / Nespausk",
        divided: "Padalinta dėmesys",
      },
      mode: {
        baseline: "Bazinis lygis",
        check: "Patikra",
        training: "Treniruotė",
        all: "Visi",
      },
    },
    status: {
      within: "Įprastame diapazone",
      slightly: "Šiek tiek žemiau įprasto",
      significantly: "Reikšmingai žemiau įprasto",
      noBaseline: "Dar nėra bazinio lygio — pirmiausia pridėkite bazinio lygio sesijas.",
    },
    baseline: {
      noSessions: "Nėra užregistruotų bazinio lygio sesijų.",
      sessions: "sesijos",
    },
    export: {
      btn: "Eksportuoti (kopijuoti JSON)",
      copied: "Kopijuota į iškarpinę.",
      empty: "Nėra istorijos eksportavimui.",
      failed: "Kopijavimas nepavyko — rodomas tekstas žemiau.",
    },
    trend: {
      baselineLine: "Bazinis lygis: vidurkis {mean} ms | SD {sd} ms | Diapazonas: {lo}–{hi} ms (±1 SD)",
      noBaseline: "Dar nėra bazinio lygio — tendencija naudoja bazinio lygio sesijas.",
      noChecks: "Dar nėra patikros sesijų.",
      checkLabel: "Patikra",
      delta: "Δ {delta} ms",
      status: "Būsena: {status}",
      ok: "Gerai",
      invalid: "NETINKAMA",
    },
    history: {
      avg: "vid.",
      mean: "vidurkis",
      sd: "SD",
      trials: "bandymai",
      best: "geriausias",
      worst: "blogiausias",
      falseStarts: "klaidingi startai",
      misses: "praleistai",
      falseAlarms: "slopinimo klaidos",
      baseline: "bazinis lygis",
      noTrialData: "Nėra bandymų duomenų",
    },
    trialOutcome: {
      hit: "Pataikymas",
      go: "GO",
      miss: "Praleistas",
      false_alarm: "Slopinimo klaida",
      correct_reject: "Teisingai",
      false_start: "Klaidingas startas",
      unknown: "Nežinoma",
    },
    quality: {
      good: "Gera",
      mixed: "Mišri",
      not_usable: "Netinkama",
      label: "Kokybė",
    },
    refusal: {
      R1_INVALID_EXECUTION: "Sesija netinkama: vykdymo klaida (nėra užregistruotų galiojančių atsakų).",
      R2_INSUFFICIENT_DATA: "Sesija netinkama: nepakanka duomenų (per mažai galiojančių atsakų).",
      R3_EXCESS_NOISE: "Sesija netinkama: per daug klaidų (per daug klaidingų startų arba slopinimo klaidų).",
    },
    stimulus: {
      ready: "Pasiruošti…",
      reaction: {
        go: "SPAUSKITE!",
      },
      gonogo: {
        go: "GO (spauskite)",
        nogo: "NO-GO (nespauskite)",
      },
      divided: {
        go: "SPAUSKITE",
        nogo: "NESPĮKITE",
        legend: "SPAUSKITE = atsakyti · NESPĮKITE = laukti · Suskaičiuokite mėlynus blyksnius",
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
  if (currentLang === "lt") {
    return `Bandymas ${current}/${total} (baigta: ${completed})`;
  }
  return `Trial ${current}/${total} (completed: ${completed})`;
}

function getSessionComplete(done, total) {
  if (currentLang === "no") {
    return `Økt fullført (${done}/${total} forsøk).`;
  }
  if (currentLang === "lt") {
    return `Sesija baigta (${done}/${total} bandymų).`;
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
  } else if (currentLang === "lt") {
    if (testType === "reaction") {
      if (entry.type === "false_start") {
        return `Bandymas ${n}: klaidingas startas (per anksti)`;
      } else {
        return `Bandymas ${n}: ${entry.rt} ms`;
      }
    }
    // Go/No-Go and Divided Attention (same trial types)
    switch (entry.type) {
      case "go":
        return `Bandymas ${n}: GO atsakas — ${entry.rt} ms`;
      case "miss":
        return `Bandymas ${n}: GO praleistas (nėra paspaudimo)`;
      case "correct_reject":
        return `Bandymas ${n}: NO-GO teisingai (nėra paspaudimo)`;
      case "false_alarm":
        return `Bandymas ${n}: NO-GO slopinimo klaida — ${entry.rt} ms`;
      case "false_start":
        return `Bandymas ${n}: klaidingas startas (paspausta laukiant)`;
      default:
        return `Bandymas ${n}: nežinomas`;
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
  if (currentLang === "no") {
    return "Økt ugyldig (ingen gyldige reaksjonstidforsøk).";
  }
  if (currentLang === "lt") {
    return "Sesija netinkama (nėra galiojančių reakcijos laiko bandymų).";
  }
  return "Session invalid (no valid reaction time trials).";
}

function getSessionInvalidNoGo() {
  if (currentLang === "no") {
    return "Økt ugyldig (ingen GO-responser registrert).";
  }
  if (currentLang === "lt") {
    return "Sesija netinkama (nėra užregistruotų GO atsakų).";
  }
  return "Session invalid (no GO responses recorded).";
}

function getBaselineNotSaved() {
  if (currentLang === "no") {
    return "Baseline-økt ikke lagret: for få gyldige GO-responser. Øk antall forsøk for stabile resultater.";
  }
  if (currentLang === "lt") {
    return "Bazinio lygio sesija neišsaugota: per mažai galiojančių GO atsakų. Padidinkite bandymų skaičių, kad gautumėte stabilūs rezultatai.";
  }
  return "Baseline session not saved: too few valid GO responses. Increase trials for stable results.";
}

function getBaselineNotSavedDivided() {
  if (currentLang === "no") {
    return "Baseline-økt ikke lagret: for få gyldige GO-responser (minimum 80% av forsøk, minst 8). Øk antall forsøk for stabile resultater.";
  }
  if (currentLang === "lt") {
    return "Bazinio lygio sesija neišsaugota: per mažai galiojančių GO atsakų (mažiausiai 80% bandymų, bent 8). Padidinkite bandymų skaičių, kad gautumėte stabilūs rezultatai.";
  }
  return "Baseline session not saved: too few valid GO responses (minimum 80% of trials, at least 8). Increase trials for stable results.";
}

function getNotEnoughBaseline() {
  if (currentLang === "no") {
    return "Ikke nok baseline-økter. Vennligst registrer minst 3 baseline-økter.";
  }
  if (currentLang === "lt") {
    return "Nepakanka bazinio lygio sesijų. Prašome užregistruoti bent 3 bazinio lygio sesijas.";
  }
  return "Not enough baseline sessions. Please record at least 3 baseline sessions.";
}

function getBaselineSavedReaction(mean, sd, falseStarts, qualityNote, quality, deviceWarning) {
  const falseStartsText = falseStarts 
    ? (currentLang === "no" ? ` | Feilstarter: ${falseStarts}` : currentLang === "lt" ? ` | Klaidingi startai: ${falseStarts}` : ` | False starts: ${falseStarts}`)
    : "";
  const qualityText = quality ? (currentLang === "no" ? ` | Kvalitet: ${t(`quality.${quality}`)}` : currentLang === "lt" ? ` | Kokybė: ${t(`quality.${quality}`)}` : ` | Quality: ${t(`quality.${quality}`)}`) : "";
  const warningText = deviceWarning || "";
  if (currentLang === "no") {
    return `Baseline-økt lagret. Gjennomsnitt: ${mean.toFixed(0)} ms | SD: ${sd.toFixed(0)} ms${falseStartsText}${qualityText}${qualityNote}${warningText}`;
  }
  if (currentLang === "lt") {
    return `Bazinio lygio sesija išsaugota. Vidurkis: ${mean.toFixed(0)} ms | SD: ${sd.toFixed(0)} ms${falseStartsText}${qualityText}${qualityNote}${warningText}`;
  }
  return `Baseline session saved. Mean: ${mean.toFixed(0)} ms | SD: ${sd.toFixed(0)} ms${falseStartsText}${qualityText}${qualityNote}${warningText}`;
}

function getBaselineSavedGoNoGo(mean, sd, misses, falseAlarms, falseStarts, qualityNote, quality, deviceWarning) {
  const falseStartsText = falseStarts
    ? (currentLang === "no" ? ` | Feilstarter: ${falseStarts}` : currentLang === "lt" ? ` | Klaidingi startai: ${falseStarts}` : ` | False starts: ${falseStarts}`)
    : "";
  const qualityText = quality ? (currentLang === "no" ? ` | Kvalitet: ${t(`quality.${quality}`)}` : currentLang === "lt" ? ` | Kokybė: ${t(`quality.${quality}`)}` : ` | Quality: ${t(`quality.${quality}`)}`) : "";
  const warningText = deviceWarning || "";
  if (currentLang === "no") {
    return `Baseline-økt lagret. GO-gjennomsnitt: ${mean.toFixed(0)} ms | SD: ${sd.toFixed(0)} ms | Bom: ${misses} | Inhibisjonsfeil: ${falseAlarms}${falseStartsText}${qualityText}${qualityNote}${warningText}`;
  }
  if (currentLang === "lt") {
    return `Bazinio lygio sesija išsaugota. GO vidurkis: ${mean.toFixed(0)} ms | SD: ${sd.toFixed(0)} ms | Praleistai: ${misses} | Slopinimo klaidos: ${falseAlarms}${falseStartsText}${qualityText}${qualityNote}${warningText}`;
  }
  return `Baseline session saved. GO mean: ${mean.toFixed(0)} ms | SD: ${sd.toFixed(0)} ms | Misses: ${misses} | Inhibitory errors: ${falseAlarms}${falseStartsText}${qualityText}${qualityNote}${warningText}`;
}

function getBaselineSavedDivided(mean, sd, misses, falseAlarms, falseStarts, flashTargetCount, flashAbsError, qualityNote, quality, deviceWarning) {
  const falseStartsText = falseStarts
    ? (currentLang === "no" ? ` | Feilstarter: ${falseStarts}` : currentLang === "lt" ? ` | Klaidingi startai: ${falseStarts}` : ` | False starts: ${falseStarts}`)
    : "";
  const flashText = flashTargetCount > 0
    ? (currentLang === "no" 
        ? ` | Flash-feil snitt: ${flashAbsError.toFixed(1)} (målt: ${flashTargetCount})`
        : currentLang === "lt"
          ? ` | Blyksnių klaida vid.: ${flashAbsError.toFixed(1)} (tikslas: ${flashTargetCount})`
          : ` | Flash error avg: ${flashAbsError.toFixed(1)} (target: ${flashTargetCount})`)
    : "";
  const qualityText = quality ? (currentLang === "no" ? ` | Kvalitet: ${t(`quality.${quality}`)}` : currentLang === "lt" ? ` | Kokybė: ${t(`quality.${quality}`)}` : ` | Quality: ${t(`quality.${quality}`)}`) : "";
  const warningText = deviceWarning || "";
  if (currentLang === "no") {
    return `Baseline-økt lagret. GO-gjennomsnitt: ${mean.toFixed(0)} ms | SD: ${sd.toFixed(0)} ms | Bom: ${misses} | Inhibisjonsfeil: ${falseAlarms}${flashText}${falseStartsText}${qualityText}${qualityNote}${warningText}`;
  }
  if (currentLang === "lt") {
    return `Bazinio lygio sesija išsaugota. GO vidurkis: ${mean.toFixed(0)} ms | SD: ${sd.toFixed(0)} ms | Praleistai: ${misses} | Slopinimo klaidos: ${falseAlarms}${flashText}${falseStartsText}${qualityText}${qualityNote}${warningText}`;
  }
  return `Baseline session saved. GO mean: ${mean.toFixed(0)} ms | SD: ${sd.toFixed(0)} ms | Misses: ${misses} | Inhibitory errors: ${falseAlarms}${flashText}${falseStartsText}${qualityText}${qualityNote}${warningText}`;
}

function getCheckReaction(mean, baselineMean, baselineSD, status, falseStarts, qualityNote, quality, deviceWarning) {
  const falseStartsText = falseStarts
    ? (currentLang === "no" ? ` | Feilstarter: ${falseStarts}` : currentLang === "lt" ? ` | Klaidingi startai: ${falseStarts}` : ` | False starts: ${falseStarts}`)
    : "";
  const qualityText = quality ? (currentLang === "no" ? ` | Kvalitet: ${t(`quality.${quality}`)}` : currentLang === "lt" ? ` | Kokybė: ${t(`quality.${quality}`)}` : ` | Quality: ${t(`quality.${quality}`)}`) : "";
  const warningText = deviceWarning || "";
  if (currentLang === "no") {
    return `Dagens gjennomsnitt: ${mean.toFixed(0)} ms | Baseline-gjennomsnitt: ${baselineMean.toFixed(0)} ms | Baseline SD: ${baselineSD.toFixed(0)} ms | Status: ${status}${falseStartsText}${qualityText}${qualityNote}${warningText}`;
  }
  if (currentLang === "lt") {
    return `Šiandienos vidurkis: ${mean.toFixed(0)} ms | Bazinio lygio vidurkis: ${baselineMean.toFixed(0)} ms | Bazinio lygio SD: ${baselineSD.toFixed(0)} ms | Būsena: ${status}${falseStartsText}${qualityText}${qualityNote}${warningText}`;
  }
  return `Today mean: ${mean.toFixed(0)} ms | Baseline mean: ${baselineMean.toFixed(0)} ms | Baseline SD: ${baselineSD.toFixed(0)} ms | Status: ${status}${falseStartsText}${qualityText}${qualityNote}${warningText}`;
}

function getCheckGoNoGo(mean, baselineMean, baselineSD, status, misses, baselineMissAvg, falseAlarms, baselineFAAvg, falseStarts, qualityNote, quality, deviceWarning) {
  const falseStartsText = falseStarts
    ? (currentLang === "no" ? ` | Feilstarter: ${falseStarts}` : currentLang === "lt" ? ` | Klaidingi startai: ${falseStarts}` : ` | False starts: ${falseStarts}`)
    : "";
  const qualityText = quality ? (currentLang === "no" ? ` | Kvalitet: ${t(`quality.${quality}`)}` : currentLang === "lt" ? ` | Kokybė: ${t(`quality.${quality}`)}` : ` | Quality: ${t(`quality.${quality}`)}`) : "";
  const warningText = deviceWarning || "";
  if (currentLang === "no") {
    return `Dagens GO-gjennomsnitt: ${mean.toFixed(0)} ms | Baseline-gjennomsnitt: ${baselineMean.toFixed(0)} ms | Baseline SD: ${baselineSD.toFixed(0)} ms | Status: ${status} | Bom: ${misses} (baseline snitt ${baselineMissAvg.toFixed(1)}) | Inhibisjonsfeil: ${falseAlarms} (baseline snitt ${baselineFAAvg.toFixed(1)})${falseStartsText}${qualityText}${qualityNote}${warningText}`;
  }
  if (currentLang === "lt") {
    return `Šiandienos GO vidurkis: ${mean.toFixed(0)} ms | Bazinio lygio vidurkis: ${baselineMean.toFixed(0)} ms | Bazinio lygio SD: ${baselineSD.toFixed(0)} ms | Būsena: ${status} | Praleistai: ${misses} (bazinio lygio vid. ${baselineMissAvg.toFixed(1)}) | Slopinimo klaidos: ${falseAlarms} (bazinio lygio vid. ${baselineFAAvg.toFixed(1)})${falseStartsText}${qualityText}${qualityNote}${warningText}`;
  }
  return `Today GO mean: ${mean.toFixed(0)} ms | Baseline mean: ${baselineMean.toFixed(0)} ms | Baseline SD: ${baselineSD.toFixed(0)} ms | Status: ${status} | Misses: ${misses} (baseline avg ${baselineMissAvg.toFixed(1)}) | Inhibitory errors: ${falseAlarms} (baseline avg ${baselineFAAvg.toFixed(1)})${falseStartsText}${qualityText}${qualityNote}${warningText}`;
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

function getCheckDividedAttention(mean, baselineMean, baselineSD, status, falseAlarmsRate, baselineFARate, flashAbsError, baselineFlashError, falseStarts, qualityNote, quality, deviceWarning) {
  const falseStartsText = falseStarts > 0
    ? (currentLang === "no" ? ` | Feilstarter: ${falseStarts}` : currentLang === "lt" ? ` | Klaidingi startai: ${falseStarts}` : ` | False starts: ${falseStarts}`)
    : "";
  const qualityText = quality ? (currentLang === "no" ? ` | Kvalitet: ${t(`quality.${quality}`)}` : currentLang === "lt" ? ` | Kokybė: ${t(`quality.${quality}`)}` : ` | Quality: ${t(`quality.${quality}`)}`) : "";
  const warningText = deviceWarning || "";
  if (currentLang === "no") {
    return `Dagens GO-gjennomsnitt: ${mean.toFixed(0)} ms | Baseline-gjennomsnitt: ${baselineMean.toFixed(0)} ms | Baseline SD: ${baselineSD.toFixed(0)} ms | Status: ${status} | Inhibisjonsfeil-rate: ${(falseAlarmsRate * 100).toFixed(1)}% (baseline ${(baselineFARate * 100).toFixed(1)}%) | Flash-feil: ${flashAbsError} (baseline snitt ${baselineFlashError.toFixed(1)})${falseStartsText}${qualityText}${qualityNote}${warningText}`;
  }
  if (currentLang === "lt") {
    return `Šiandienos GO vidurkis: ${mean.toFixed(0)} ms | Bazinio lygio vidurkis: ${baselineMean.toFixed(0)} ms | Bazinio lygio SD: ${baselineSD.toFixed(0)} ms | Būsena: ${status} | Slopinimo klaidų dažnis: ${(falseAlarmsRate * 100).toFixed(1)}% (bazinis lygis ${(baselineFARate * 100).toFixed(1)}%) | Blyksnių klaida: ${flashAbsError} (bazinio lygio vid. ${baselineFlashError.toFixed(1)})${falseStartsText}${qualityText}${qualityNote}${warningText}`;
  }
  return `Today GO mean: ${mean.toFixed(0)} ms | Baseline mean: ${baselineMean.toFixed(0)} ms | Baseline SD: ${baselineSD.toFixed(0)} ms | Status: ${status} | False alarm rate: ${(falseAlarmsRate * 100).toFixed(1)}% (baseline ${(baselineFARate * 100).toFixed(1)}%) | Flash error: ${flashAbsError} (baseline avg ${baselineFlashError.toFixed(1)})${falseStartsText}${qualityText}${qualityNote}${warningText}`;
}

function applyTrialEmphasis(trialListEl) {
  if (!trialListEl) return;
  const items = Array.from(trialListEl.children);
  const n = items.length;

  items.forEach((li) => {
    li.classList.remove("is-latest", "is-2nd", "is-3rd", "is-4th", "is-5th", "is-older");
  });

  items.forEach((li, idx) => {
    const fromEnd = (n - 1) - idx; // 0 = newest
    if (fromEnd === 0) li.classList.add("is-latest");
    else if (fromEnd === 1) li.classList.add("is-2nd");
    else if (fromEnd === 2) li.classList.add("is-3rd");
    else if (fromEnd === 3) li.classList.add("is-4th");
    else if (fromEnd === 4) li.classList.add("is-5th");
    else li.classList.add("is-older");
  });
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
  
  // Auto-scroll only during active run (important after language re-render)
  if (isRunActive) {
    try {
      trialList.scrollTop = trialList.scrollHeight;
    } catch (e) {}
  }
  applyTrialEmphasis(trialList);
}

// Helper function to generate flash info string for summaries
function getFlashInfoString(target, user, error) {
  if (target === undefined && user === undefined && error === undefined) return "";
  
  const tgt = target || 0;
  const usr = user || 0;
  const err = error || 0;
  
  if (currentLang === "no") {
    return ` | Flashes: mål ${tgt}, svar ${usr}, feil ${err}`;
  }
  if (currentLang === "lt") {
    return ` | Blyksniai: tikslas ${tgt}, atsakas ${usr}, klaida ${err}`;
  }
  return ` | Flashes: target ${tgt}, answer ${usr}, error ${err}`;
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
      const qualityTextTraining = dataObj.quality ? (currentLang === "no" ? ` | Kvalitet: ${t(`quality.${dataObj.quality}`)}` : currentLang === "lt" ? ` | Kokybė: ${t(`quality.${dataObj.quality}`)}` : ` | Quality: ${t(`quality.${dataObj.quality}`)}`) : "";
      let trainingText = "";
      if (currentLang === "no") {
        trainingText = `Økt fullført. GO-gjennomsnitt: ${dataObj.mean.toFixed(0)} ms | SD: ${dataObj.sd.toFixed(0)} ms`;
      } else if (currentLang === "lt") {
        trainingText = `Sesija baigta. GO vidurkis: ${dataObj.mean.toFixed(0)} ms | SD: ${dataObj.sd.toFixed(0)} ms`;
      } else {
        trainingText = `Session complete. GO mean: ${dataObj.mean.toFixed(0)} ms | SD: ${dataObj.sd.toFixed(0)} ms`;
      }
      summary.textContent = trainingText + flashInfo + qualityTextTraining;
      break;
      
    case "baseline_saved_reaction":
      summary.textContent = getBaselineSavedReaction(dataObj.mean, dataObj.sd, dataObj.falseStarts, dataObj.qualityNote || "", dataObj.quality, dataObj.deviceWarning || "");
      break;
      
    case "baseline_saved_gonogo":
      summary.textContent = getBaselineSavedGoNoGo(dataObj.mean, dataObj.sd, dataObj.misses, dataObj.falseAlarms, dataObj.falseStarts, dataObj.qualityNote || "", dataObj.quality, dataObj.deviceWarning || "");
      break;
      
    case "baseline_saved_divided":
      summary.textContent = getBaselineSavedDivided(dataObj.mean, dataObj.sd, dataObj.misses, dataObj.falseAlarms, dataObj.falseStarts, dataObj.flashTargetCount || 0, dataObj.flashAbsError || 0, dataObj.qualityNote || "", dataObj.quality, dataObj.deviceWarning || "");
      break;
      
    case "check_reaction":
      summary.textContent = getCheckReaction(dataObj.mean, dataObj.baselineMean, dataObj.baselineSD, dataObj.status, dataObj.falseStarts, dataObj.qualityNote || "", dataObj.quality, dataObj.deviceWarning || "");
      break;
      
    case "check_gonogo":
      summary.textContent = getCheckGoNoGo(dataObj.mean, dataObj.baselineMean, dataObj.baselineSD, dataObj.status, dataObj.misses, dataObj.baselineMissAvg, dataObj.falseAlarms, dataObj.baselineFAAvg, dataObj.falseStarts, dataObj.qualityNote || "", dataObj.quality, dataObj.deviceWarning || "");
      break;
      
    case "check_divided":
      summary.textContent = getCheckDividedAttention(dataObj.mean, dataObj.baselineMean, dataObj.baselineSD, dataObj.status, dataObj.falseAlarmsRate, dataObj.baselineFARate, dataObj.flashAbsError, dataObj.baselineFlashError, dataObj.falseStarts, dataObj.qualityNote || "", dataObj.quality, dataObj.deviceWarning || "");
      break;
      
    case "invalid_no_reaction":
      const refusalMsg1 = dataObj.refusalCode ? t(`refusal.${dataObj.refusalCode}`) : getSessionInvalidNoReaction();
      const qualityText1 = dataObj.quality ? (currentLang === "no" ? ` | Kvalitet: ${t(`quality.${dataObj.quality}`)}` : currentLang === "lt" ? ` | Kokybė: ${t(`quality.${dataObj.quality}`)}` : ` | Quality: ${t(`quality.${dataObj.quality}`)}`) : "";
      summary.textContent = refusalMsg1 + qualityText1;
      break;
      
    case "invalid_no_go":
      const refusalMsg2 = dataObj.refusalCode ? t(`refusal.${dataObj.refusalCode}`) : getSessionInvalidNoGo();
      const qualityText2 = dataObj.quality ? (currentLang === "no" ? ` | Kvalitet: ${t(`quality.${dataObj.quality}`)}` : currentLang === "lt" ? ` | Kokybė: ${t(`quality.${dataObj.quality}`)}` : ` | Quality: ${t(`quality.${dataObj.quality}`)}`) : "";
      summary.textContent = refusalMsg2 + qualityText2;
      break;
      
    case "not_enough_baseline":
      const refusalMsg3 = dataObj.refusalCode ? t(`refusal.${dataObj.refusalCode}`) : getNotEnoughBaseline();
      const qualityText3 = dataObj.quality ? (currentLang === "no" ? ` | Kvalitet: ${t(`quality.${dataObj.quality}`)}` : currentLang === "lt" ? ` | Kokybė: ${t(`quality.${dataObj.quality}`)}` : ` | Quality: ${t(`quality.${dataObj.quality}`)}`) : "";
      summary.textContent = refusalMsg3 + qualityText3;
      break;
      
    case "baseline_not_saved":
      const refusalMsg4 = dataObj.refusalCode ? t(`refusal.${dataObj.refusalCode}`) : getBaselineNotSaved();
      const qualityText4 = dataObj.quality ? (currentLang === "no" ? ` | Kvalitet: ${t(`quality.${dataObj.quality}`)}` : currentLang === "lt" ? ` | Kokybė: ${t(`quality.${dataObj.quality}`)}` : ` | Quality: ${t(`quality.${dataObj.quality}`)}`) : "";
      summary.textContent = refusalMsg4 + qualityText4;
      break;
      
    case "baseline_not_saved_divided":
      const flashInfo2 = getFlashInfoString(dataObj.flashTarget, dataObj.flashUser, dataObj.flashError);
      const refusalMsg5 = dataObj.refusalCode ? t(`refusal.${dataObj.refusalCode}`) : getBaselineNotSavedDivided();
      const qualityText5 = dataObj.quality ? (currentLang === "no" ? ` | Kvalitet: ${t(`quality.${dataObj.quality}`)}` : currentLang === "lt" ? ` | Kokybė: ${t(`quality.${dataObj.quality}`)}` : ` | Quality: ${t(`quality.${dataObj.quality}`)}`) : "";
      summary.textContent = refusalMsg5 + flashInfo2 + qualityText5;
      break;
      
    case "invalid_missing_answer":
      let refusalMsg6 = "";
      if (dataObj.refusalCode) {
        refusalMsg6 = t(`refusal.${dataObj.refusalCode}`);
      } else if (currentLang === "no") {
        refusalMsg6 = "Kan ikke sammenlignes: mangler svar";
      } else if (currentLang === "lt") {
        refusalMsg6 = "Sesija netinkama palyginimui: trūksta atsako";
      } else {
        refusalMsg6 = "Session not usable for comparison: missing answer";
      }
      const qualityText6 = dataObj.quality ? (currentLang === "no" ? ` | Kvalitet: ${t(`quality.${dataObj.quality}`)}` : currentLang === "lt" ? ` | Kokybė: ${t(`quality.${dataObj.quality}`)}` : ` | Quality: ${t(`quality.${dataObj.quality}`)}`) : "";
      summary.textContent = refusalMsg6 + qualityText6;
      break;
      
    case "invalid_no_go_responses_divided":
      let refusalMsg7 = "";
      if (dataObj.refusalCode) {
        refusalMsg7 = t(`refusal.${dataObj.refusalCode}`);
      } else if (currentLang === "no") {
        refusalMsg7 = "Økt ugyldig: ingen GO-responser.";
      } else if (currentLang === "lt") {
        refusalMsg7 = "Sesija netinkama: nėra GO atsakų.";
      } else {
        refusalMsg7 = "Session invalid: no GO responses.";
      }
      const qualityText7 = dataObj.quality ? (currentLang === "no" ? ` | Kvalitet: ${t(`quality.${dataObj.quality}`)}` : currentLang === "lt" ? ` | Kokybė: ${t(`quality.${dataObj.quality}`)}` : ` | Quality: ${t(`quality.${dataObj.quality}`)}`) : "";
      summary.textContent = refusalMsg7 + qualityText7;
      break;
      
    default:
      // Unknown type, just set text directly
      break;
  }
  
  // After summary is set, scroll to status on mobile (with delay to ensure DOM is updated)
  setTimeout(() => {
    scrollToSessionStatusIfMobile();
  }, 100);
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
  document.querySelectorAll(".lang-lt").forEach(el => el.classList.toggle("hidden", currentLang !== "lt"));

  // 2) Update any elements that opt-in via data-i18n (C-lite)
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });

  // 3) Toggle active state on buttons and ensure LT option exists (selector parity across pages)
  const langSelect = document.getElementById("langSelect");
  if (langSelect) {
    // Ensure LT option exists (safety check in case markup drifts)
    const hasLtOption = Array.from(langSelect.options).some(opt => opt.value === "lt");
    if (!hasLtOption) {
      const ltOption = document.createElement("option");
      ltOption.value = "lt";
      ltOption.textContent = "LT";
      langSelect.appendChild(ltOption);
    }
    langSelect.value = currentLang;
  }
  
  // 3b) Sync onboarding language selector if it exists (when overlay is open)
  const onboardingLangSelect = document.getElementById("onboardingLangSelect");
  if (onboardingLangSelect) {
    onboardingLangSelect.value = currentLang;
  }

  // 4) Update History menu item text (it has dynamic text based on state)
  updateHistoryMenuState();

  // 5) Update task hints when language changes
  updateTaskHint();

  // 5) Update topbar page label based on current view
  const topbarPage = document.getElementById("topbarPage");
  if (topbarPage) {
    const activeView = document.querySelector(".view.active");
    if (activeView) {
      const viewId = activeView.id;
      if (viewId === "view-home") {
        topbarPage.textContent = t("ui.home");
      } else if (viewId === "view-history") {
        topbarPage.textContent = t("ui.history");
      }
    }
  }

  // 6) Re-render trial list and progress if in session or has results
  if (inSession || results.length > 0) {
    reRenderTrialList();
    updateProgress(results.length === totalTrials);
  }
  
  // 7) Update summary if it exists and is not empty
  if (summary && summary.textContent && lastSummaryData) {
    regenerateSummary();
  }

  // 8) Re-render history if visible
  if (historyListEl) {
    renderHistory();
  }

  // 9) Update select options for modes and test types
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
  updateTaskHint();
}

// Task hint mapping
function getTaskHint(lang, testType) {
  const H = {
    en: {
      reaction: "Reaction Time: Wait for the signal, then respond as quickly as possible. Early inputs count as false starts.",
      gonogo: "Go / No-Go: Respond only to the GO signal. Do nothing on NO-GO. Wrong responses count as errors.",
      divided: "Divided Attention: Track the main task while responding to brief flashes. Misses and false alarms are recorded."
    },
    no: {
      reaction: "Reaksjonstid: Vent på signalet, og responder så raskt som mulig. Tidlige trykk teller som feilstart.",
      gonogo: "Go / No-Go: Responder kun på GO-signalet. Ikke gjør noe på NO-GO. Feil respons teller som feil.",
      divided: "Delt oppmerksomhet: Følg hovedoppgaven samtidig som du reagerer på korte flash. Bom og feil registreres."
    },
    lt: {
      reaction: "Reakcijos laikas: Laukite signalo ir reaguokite kuo greičiau. Per ankstyvi paspaudimai laikomi klaidingu startu.",
      gonogo: "Go / No-Go: Reaguokite tik į GO signalą. Į NO-GO nereaguokite. Neteisingi veiksmai laikomi klaidomis.",
      divided: "Dalyta dėmesio užduotis: Atlikite pagrindinę užduotį ir reaguokite į trumpus blyksnius. Praleidimai ir klaidingi atsakai registruojami."
    }
  };

  const L = H[lang] ? lang : "en";
  return (H[L][testType] || H.en.reaction);
}

function updateTaskHint() {
  const panel = document.getElementById("taskHintPanel");
  const text = document.getElementById("taskHintText");
  const sel = document.getElementById("testType");
  if (!panel || !text || !sel) return;

  let lang = (typeof currentLang !== "undefined" && currentLang) ? currentLang : (localStorage.getItem("fce_lang") || "en");
  const testType = sel.value;

  panel.style.display = "block";
  text.textContent = getTaskHint(lang, testType);
}

// Expose to window for inline scripts (e.g., index.html scrollToInstrument)
window.updateTaskHint = updateTaskHint;

// Onboarding gate initialization
function initOnboardingGate() {
  const overlay = document.getElementById("onboardingOverlay");
  const yesBtn = document.getElementById("onboardingYesBtn");
  const noBtn = document.getElementById("onboardingNoBtn");
  const resetBtn = document.getElementById("resetOnboardingBtn");
  const onboardingLangSelect = document.getElementById("onboardingLangSelect");
  if (!overlay || !yesBtn || !noBtn) return;

  function show() {
    overlay.classList.remove("hidden");
    document.body.classList.add("onboarding-open");
    // Sync onboarding language selector with current language when shown
    if (onboardingLangSelect) {
      onboardingLangSelect.value = currentLang;
    }
  }

  function hide() {
    overlay.classList.add("hidden");
    document.body.classList.remove("onboarding-open");
  }

  // Wire up onboarding language selector to sync with main language system
  if (onboardingLangSelect) {
    // Sync with current language on load
    onboardingLangSelect.value = currentLang;
    
    // When onboarding selector changes, update language system (which will update overlay text via applyLangUI)
    onboardingLangSelect.addEventListener("change", (e) => {
      const newLang = e.target.value;
      setLang(newLang);
      // Also sync main language selector if it exists
      const mainLangSelect = document.getElementById("langSelect");
      if (mainLangSelect && mainLangSelect.value !== newLang) {
        mainLangSelect.value = newLang;
      }
    });
  }

  const done = localStorage.getItem(ONBOARDING_KEY) === "1";
  if (!done) show();

  noBtn.addEventListener("click", () => {
    try { localStorage.setItem(ONBOARDING_KEY, "1"); } catch {}
    window.location.href = "how-tests-work.html";
  });

  yesBtn.addEventListener("click", () => {
    try { localStorage.setItem(ONBOARDING_KEY, "1"); } catch {}
    hide();
    // Small delay to ensure overlay is hidden before scrolling
    setTimeout(() => {
      // Ensure task hint panel is visible
      updateTaskHint();
      // Scroll to "What to do" panel, positioned right below topbar (same as docs pages)
      const taskHintPanel = document.getElementById("taskHintPanel");
      if (taskHintPanel) {
        // Get actual topbar height (use CSS variable or fallback to 64)
        const topbar = document.querySelector('.topbar');
        const topbarHeight = topbar ? topbar.offsetHeight : 64;
        const targetY = taskHintPanel.getBoundingClientRect().top + window.pageYOffset - topbarHeight - 20;
        window.scrollTo({ top: targetY, behavior: "smooth" });
        setTimeout(() => {
          const firstActionBtn = document.querySelector(".action-row button");
          if (firstActionBtn) firstActionBtn.focus();
        }, 300);
        } else {
        // Fallback to action-row if panel not found
        const actionRow = document.querySelector(".action-row");
        if (actionRow) {
          const topbar = document.querySelector('.topbar');
          const topbarHeight = topbar ? topbar.offsetHeight : 64;
          const targetY = actionRow.getBoundingClientRect().top + window.pageYOffset - topbarHeight - 20;
          window.scrollTo({ top: targetY, behavior: "smooth" });
          setTimeout(() => {
            const firstActionBtn = document.querySelector(".action-row button");
            if (firstActionBtn) firstActionBtn.focus();
          }, 300);
        }
      }
    }, 100);
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      try { localStorage.removeItem(ONBOARDING_KEY); } catch {}
      show();
    });
  }
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

// Context (optional) - sleep, stress, note only (mode is determined by action button clicked)
const sleepRating = document.getElementById("sleepRating");
const stressRating = document.getElementById("stressRating");
const contextNote = document.getElementById("contextNote");

// History view
const historyTest = document.getElementById("historyTest");
const historyMode = document.getElementById("historyMode");
const historyEmpty = document.getElementById("historyEmpty");
const historyListEl = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

// Home history preview
const homeHistoryListEl = document.getElementById("homeHistoryList");
const homeHistoryEmptyEl = document.getElementById("homeHistoryEmpty");

const resetBtn = document.getElementById("resetBtn");
const testArea = document.getElementById("testArea");

const trialCountInput = document.getElementById("trialCount");
const progress = document.getElementById("progress");
const trialList = document.getElementById("trialList");
const summary = document.getElementById("summary");
const sessionPanel = document.getElementById("sessionPanel");

// Ensure session panel classes exist even if markup drifts
if (sessionPanel) sessionPanel.classList.add("session-panel");
if (trialList) trialList.classList.add("session-trials");

// Store last summary generation data for language switching
let lastSummaryData = null;

const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");
const menuOverlay = document.getElementById("menuOverlay");
const closeMenuBtn = document.getElementById("closeMenuBtn");
const menuItems = document.querySelectorAll(".menu-item");
const views = document.querySelectorAll(".view");

function openMenu() {
  menu.classList.add("open");
  menuOverlay.classList.remove("hidden");
  document.body.classList.add("menu-open");
  if (menuBtn) menuBtn.setAttribute("aria-expanded", "true");
}

function closeMenu() {
  menu.classList.remove("open");
  menuOverlay.classList.add("hidden");
  document.body.classList.remove("menu-open");
  if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
}

// Update History menu item state (enabled/disabled)
function updateHistoryMenuState() {
  const historyBtn = document.getElementById("menuHistoryBtn");
  const homeHistoryPanel = document.getElementById("homeHistoryPanel");
  const homeHistoryBtn = document.getElementById("homeHistoryBtn");
  
  const hasHistoryData = hasHistory();
  
  if (historyBtn) {
    const langEn = historyBtn.querySelector(".lang-en");
    const langNo = historyBtn.querySelector(".lang-no");
    const langLt = historyBtn.querySelector(".lang-lt");
    
    if (hasHistoryData) {
      historyBtn.classList.remove("is-disabled");
      historyBtn.removeAttribute("tabindex");
      
      // Update text using language spans with respective translations
      if (langEn) langEn.textContent = I18N.en.ui.history;
      if (langNo) langNo.textContent = I18N.no.ui.history;
      if (langLt) langLt.textContent = I18N.lt.ui.history;
    } else {
      historyBtn.classList.add("is-disabled");
      historyBtn.setAttribute("tabindex", "-1");
      historyBtn.removeAttribute("aria-current");
      
      // Update text using language spans with respective translations
      if (langEn) langEn.textContent = I18N.en.ui.historyDisabled;
      if (langNo) langNo.textContent = I18N.no.ui.historyDisabled;
      if (langLt) langLt.textContent = I18N.lt.ui.historyDisabled;
    }
  }
  
  // Show/hide History panel on Home view
  if (homeHistoryPanel) {
    const wasHidden = homeHistoryPanel.style.display === "none" || homeHistoryPanel.style.display === "";
    homeHistoryPanel.style.display = hasHistoryData ? "block" : "none";
    
    // Smooth scroll into view on narrow screens when panel becomes visible
    if (wasHidden && hasHistoryData && window.matchMedia("(max-width: 640px)").matches) {
      requestAnimationFrame(() => {
        homeHistoryPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  // Keep Home preview in sync
  renderHomeHistoryPreview();
}

// Reusable function to switch views (used by menu buttons and URL params)
function switchView(target) {
  if (!target) return;
  
  // Prevent switching to history if no data exists
  if (target === "history" && !hasHistory()) {
    return;
  }

  // Store previous view and scroll position BEFORE switching views (only when going to History)
  if (target === "history") {
    try {
      let previousView = "home";
      const activeViewEl = document.querySelector(".view.active");
      if (activeViewEl && activeViewEl.id) {
        const viewId = activeViewEl.id.replace("view-", "");
        if (viewId && viewId !== "history") {
          previousView = viewId;
        }
      }
      const scrollPosition = window.pageYOffset || window.scrollY || 0;
      sessionStorage.setItem("fce_prev_view", previousView);
      sessionStorage.setItem("fce_prev_scroll", String(scrollPosition));
    } catch {}
  }

  // Hide all views first
  views.forEach(v => {
    v.classList.add("hidden");
    v.classList.remove("active");
  });

  // Show the target view
  const activeView = document.getElementById(`view-${target}`);
  if (!activeView) {
    console.warn(`switchView: View "view-${target}" not found, defaulting to home`);
    // Fallback to home if target view not found
    const homeView = document.getElementById("view-home");
    if (homeView) {
      homeView.classList.remove("hidden");
      homeView.classList.add("active");
    }
    return;
  }
  activeView.classList.remove("hidden");
  activeView.classList.add("active");

  // Update aria-current on menu items
  document.querySelectorAll('.menu-item[data-view]').forEach(item => {
    if (item.classList.contains("is-disabled")) {
      item.removeAttribute("aria-current");
    } else if (item.dataset.view === target) {
      item.setAttribute("aria-current", "page");
    } else {
      item.removeAttribute("aria-current");
    }
  });

  // Update topbar page label
  const topbarPage = document.getElementById("topbarPage");
  if (topbarPage) {
    topbarPage.textContent = target === "history" ? t("ui.history") : t("ui.home");
  }

  if (target === "history") {
    
    // Keep history default test aligned with current selection
    if (historyTest) historyTest.value = testType.value;
    renderHistory();
    
    // Reset scroll to top when entering History view
    window.scrollTo({ top: 0, behavior: "instant" });
  } else {
    // For non-history views, check if we're restoring scroll position
    // (scroll restoration happens in back button handler, so only scroll to top if not restoring)
    const isRestoringScroll = sessionStorage.getItem("fce_restoring_scroll") === "true";
    if (!isRestoringScroll) {
      window.scrollTo(0, 0);
    }
  }
}

menuBtn.addEventListener("click", () => {
  if (menu.classList.contains("open")) closeMenu();
  else openMenu();
});

if (closeMenuBtn) {
  closeMenuBtn.addEventListener("click", closeMenu);
}

menuOverlay.addEventListener("click", closeMenu);

menuItems.forEach(item => {
  item.addEventListener("click", (e) => {
    // If it's a link (<a>), let it navigate normally (don't preventDefault)
    if (item.tagName === "A") {
      // Close menu on link click, but allow navigation to proceed
      closeMenu();
      return; // Let the browser handle navigation
    }
    
    // Skip disabled items
    if (item.classList.contains("is-disabled")) {
      return;
    }
    
    // For buttons with data-view (Home/History), handle SPA-style navigation
    const target = item.dataset.view;
    if (target) {
      switchView(target);
      closeMenu();
    }
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menu.classList.contains("open")) closeMenu();
});

let mode = null; // "baseline" | "check" | "training" (set by action button click - this is the source of truth)

let startTime = null;
let timeoutId = null;

let currentStim = null; // "go" | "nogo"
let responded = false;

let inSession = false;
let isRunActive = false; // Track if run is actively executing (for auto-scroll)
let totalTrials = 5;
let trialIndex = 0;
let results = []; // stores reaction times (ms); null for false start
let trialToken = 0;
let windowTimeoutId = null;

// Live trial log trimming and auto-scroll
const LIVE_TRIAL_MAX_ROWS = 50;

function autoScrollLiveTrials(trialsContainer) {
  if (!trialsContainer) return;
  trialsContainer.scrollTop = trialsContainer.scrollHeight;
}

function trimLiveTrials(trialsContainer) {
  if (!trialsContainer) return;
  const children = trialsContainer.children;
  const extra = children.length - LIVE_TRIAL_MAX_ROWS;
  if (extra > 0) {
    for (let i = 0; i < extra; i++) {
      trialsContainer.removeChild(children[0]);
    }
  }
}

// Scroll to session status after session ends (center on all screen sizes)
function scrollToSessionStatusIfMobile() {
  const statusEl = document.getElementById("summary");
  if (!statusEl) return;
  statusEl.scrollIntoView({ behavior: "smooth", block: "center" });
}

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
    // Mode is determined by the action button clicked - this is the source of truth
    mode = "baseline";
    beginSession();
  });
  
  startCheckBtn.addEventListener("click", () => {
    if (inSession) return;
    // Mode is determined by the action button clicked - this is the source of truth
    mode = "check";
    beginSession();
  });

  if (startTrainingBtn) {
    startTrainingBtn.addEventListener("click", () => {
      if (inSession) return;
      // Mode is determined by the action button clicked - this is the source of truth
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
    isRunActive = true; // Set run active flag for auto-scroll
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
    // Remove session-ended class when starting new session
    if (trialList) {
      trialList.classList.remove("session-ended");
    }
    testArea.classList.remove("hidden");
  
    // Scroll test area into view (center it)
    setTimeout(() => {
      testArea.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  
    trialCountInput.disabled = true;
    startBaselineBtn.disabled = true;
    startCheckBtn.disabled = true;
    if (startTrainingBtn) startTrainingBtn.disabled = true;
    resetBtn.style.display = "";
  
    // Hide context panel when session starts
    const contextPanel = document.getElementById("contextPanel");
    if (contextPanel) {
      contextPanel.classList.add("is-hidden");
    }
  
    nextTrial();
  }

resetBtn.addEventListener("click", () => {
  hardReset();
});

testArea.addEventListener("click", (e) => {
    if (!inSession) return;
    
    // Don't process clicks if we've completed all trials (prevents race conditions)
    // Note: trialIndex is incremented in nextTrial() BEFORE the check, so we use >
    // to block clicks that would result in trialIndex > totalTrials
    if (trialIndex > totalTrials) return;
    
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
      // Check if we've already completed all trials before recording
      if (results.length >= totalTrials) return;
      recordResult({ type: "rt", rt });
      // Only queue nextTrial if we haven't completed all trials
      if (results.length < totalTrials) {
        setTimeout(nextTrial, 250);
      } else {
        // All trials complete - end session immediately
        endSession();
      }
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
  updateTaskHint();
    // Store selected test type in localStorage
    try {
      localStorage.setItem(TEST_TYPE_KEY, testType.value);
    } catch (_) {}
    
    hardReset();
    updateTrialCountMax();
    
    // Set default trial count based on test type
    if (testType.value === "gonogo") {
      trialCountInput.value = 20;
    } else {
      // Reaction Time and Divided Attention default to 10
      trialCountInput.value = 10;
    }
    
    updateBaselineInfo();
    updateDividedLegend();
    updateHistoryMenuState();
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
    
    const legendLt = document.createElement("span");
    legendLt.className = "lang lang-lt";
    legendLt.textContent = I18N.lt.stimulus.divided.legend;
    legend.appendChild(legendLt);
    
    instructionEl.appendChild(legend);
    // Update visibility based on current language (applyLangUI will also handle this, but set initial state correctly)
    if (currentLang === "no") {
      legendEn.classList.add("hidden");
      legendNo.classList.remove("hidden");
      legendLt.classList.add("hidden");
    } else if (currentLang === "lt") {
      legendEn.classList.add("hidden");
      legendNo.classList.add("hidden");
      legendLt.classList.remove("hidden");
    } else {
      legendEn.classList.remove("hidden");
      legendNo.classList.add("hidden");
      legendLt.classList.add("hidden");
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
    let confirmMsg = "";
    if (currentLang === "no") {
      confirmMsg = "Slett all historikk for denne testen?";
    } else if (currentLang === "lt") {
      confirmMsg = "Išvalyti visą šio testo istoriją?";
    } else {
      confirmMsg = "Clear all history for this test?";
    }
    const ok = confirm(confirmMsg);
    if (!ok) return;
    saveHistory(tt, []);
    renderHistory();
    updateHistoryMenuState();
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
  
    let confirmMsg = "";
    if (currentLang === "no") {
      confirmMsg = "Slett alle baseline-økter? Dette kan ikke angres.";
    } else if (currentLang === "lt") {
      confirmMsg = "Išvalyti visas bazinio lygio sesijas? To negalima atšaukti.";
    } else {
      confirmMsg = "Clear all baseline sessions? This cannot be undone.";
    }
    const ok = confirm(confirmMsg);
    if (!ok) return;
  
    saveBaseline([]);
    updateBaselineInfo();
    updateHistoryMenuState();
  });

  function nextTrial() {
    // Guard: prevent processing if session already ended
    if (!inSession) return;
    
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
    if (currentLang === "no") {
      prompt.textContent = "Hvor mange blå blink så du?";
    } else if (currentLang === "lt") {
      prompt.textContent = "Kiek mėlynų blyksnių matei?";
    } else {
      prompt.textContent = "How many blue flashes did you see?";
    }
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
    if (currentLang === "no") {
      confirmBtn.textContent = "Bekreft";
    } else if (currentLang === "lt") {
      confirmBtn.textContent = "Patvirtinti";
    } else {
      confirmBtn.textContent = "Confirm";
    }
    confirmBtn.className = "primary";
    confirmBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent triggering testArea click handler
      const answer = parseInt(select.value, 10);
      if (isNaN(answer)) {
        let alertMsg = "";
        if (currentLang === "no") {
          alertMsg = "Velg et tall før du fortsetter.";
        } else if (currentLang === "lt") {
          alertMsg = "Pasirinkite skaičių prieš tęsdami.";
        } else {
          alertMsg = "Please select a number before continuing.";
        }
        alert(alertMsg);
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
    // Prevent recording if we've already completed all trials
    if (results.length >= totalTrials) return;
    
    results.push(entry);

    const li = document.createElement("li");
    const n = results.length;
    li.textContent = getTrialText(n, entry, testType.value);

    trialList.appendChild(li);
    
    // Auto-scroll only during active run
    if (isRunActive) {
      requestAnimationFrame(() => {
        if (!trialList) return;
        trialList.scrollTop = trialList.scrollHeight;
      });
    }
    
    // Apply visual emphasis to recent trials
    applyTrialEmphasis(trialList);
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

// Check if stored records exist for a specific test type (history or baseline)
function hasHistoryForTestType(testTypeValue) {
  const tt = testTypeValue || "reaction";
  
  // Check history
  try {
    const historyRaw = localStorage.getItem(historyKeyFor(tt));
    if (historyRaw) {
      const history = JSON.parse(historyRaw);
      if (Array.isArray(history) && history.length > 0) {
        return true;
      }
    }
  } catch (_) {}
  
  // Check baseline
  try {
    const baselineRaw = localStorage.getItem(baselineKeyFor(tt));
    if (baselineRaw) {
      const baseline = JSON.parse(baselineRaw);
      if (Array.isArray(baseline) && baseline.length > 0) {
        return true;
      }
    }
  } catch (_) {}
  
  return false;
}

// Check if stored records exist for the current test type (history or baseline)
function hasHistory() {
  const tt = testType ? testType.value : "reaction";
  return hasHistoryForTestType(tt);
}

function saveHistory(tt, sessions) {
  localStorage.setItem(historyKeyFor(tt), JSON.stringify(sessions));
}

// Get context tags (metadata only - sleep, stress, note)
// These are saved with each session but do not affect scoring or logic
// Mode is determined separately by which action button was clicked
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
  renderHomeHistoryPreview();
  updateHistoryMenuState();
}

  function endSession() {
    // Guard against duplicate calls (race condition protection)
    if (!inSession) return;
    
    inSession = false;
    isRunActive = false; // Stop auto-scroll
  
    // Hide test area
    testArea.classList.add("hidden");
    testArea.textContent = "";
  
    // Re-enable controls
    trialCountInput.disabled = false;
    startBaselineBtn.disabled = false;
    startCheckBtn.disabled = false;
    if (startTrainingBtn) startTrainingBtn.disabled = false;
    resetBtn.style.display = "none";
  
    // Show context panel when session ends
    const contextPanel = document.getElementById("contextPanel");
    if (contextPanel) {
      contextPanel.classList.remove("is-hidden");
    }
    
    // Mark session as ended to enable scrolling while keeping panel size fixed
    if (trialList) {
      trialList.classList.add("session-ended");
    }
    
    // Re-apply trial emphasis
    applyTrialEmphasis(trialList);
  
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
        flags = { invalid: true, reason: "no_valid_trials", refusalCode: "R1_INVALID_EXECUTION" };
        // Store invalid session in history
        const invalidRecord = {
          id: createdAt,
          createdAt,
          testType: "reaction",
          mode: mode || "", // Mode is determined by which action button was clicked (baseline/check/training)
          metrics: { avgMs: 0, sdMs: 0, bestMs: 0, worstMs: 0, trials: 0, falseStarts },
          flags,
          tags,
          device,
          trialLog: buildTrialLog(tt, results)
        };
        invalidRecord.quality = computeSessionQuality(invalidRecord);
        pushHistoryRecord(invalidRecord);
        renderHistory();
        setSummary("invalid_no_reaction", {
          refusalCode: flags.refusalCode,
          quality: invalidRecord.quality
        }, "reaction", mode);
        mode = null;
        updateBaselineInfo(); // Ensure button state is correct
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
        flags = { invalid: true, reason: "no_go_responses", refusalCode: "R1_INVALID_EXECUTION" };
        const invalidRecord = {
          id: createdAt,
          createdAt,
          testType: "gonogo",
          mode: mode || "", // Mode is determined by which action button was clicked (baseline/check/training)
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
          device,
          trialLog: buildTrialLog(tt, results)
        };
        invalidRecord.quality = computeSessionQuality(invalidRecord);
        pushHistoryRecord(invalidRecord);
        renderHistory();
        setSummary("invalid_no_go", {
          refusalCode: flags.refusalCode,
          quality: invalidRecord.quality
        }, "gonogo", mode);
        mode = null;
        updateBaselineInfo(); // Ensure button state is correct
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
        flags = { invalid: true, reason: "missing_secondary_answer", refusalCode: "R1_INVALID_EXECUTION" };
        const invalidRecord = {
          id: createdAt,
          createdAt,
          testType: "divided",
          mode: mode || "", // Mode is determined by which action button was clicked (baseline/check/training)
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
          device,
          trialLog: buildTrialLog(tt, results)
        };
        invalidRecord.quality = computeSessionQuality(invalidRecord);
        pushHistoryRecord(invalidRecord);
        renderHistory();
        setSummary("invalid_missing_answer", {
          refusalCode: flags.refusalCode,
          quality: invalidRecord.quality
        }, "divided", mode);
        mode = null;
        dividedPlan = null;
        dividedFlashAnswer = null;
        updateBaselineInfo(); // Ensure button state is correct
        return;
      }
      
      if (goHits.length === 0) {
        flags = { invalid: true, reason: "no_go_responses", refusalCode: "R1_INVALID_EXECUTION" };
        const invalidRecord = {
          id: createdAt,
          createdAt,
          testType: "divided",
          mode: mode || "", // Mode is determined by which action button was clicked (baseline/check/training)
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
          device,
          trialLog: buildTrialLog(tt, results)
        };
        invalidRecord.quality = computeSessionQuality(invalidRecord);
        pushHistoryRecord(invalidRecord);
        renderHistory();
        setSummary("invalid_no_go_responses_divided", {
          refusalCode: flags.refusalCode,
          quality: invalidRecord.quality
        }, "divided", mode);
        mode = null;
        dividedPlan = null;
        dividedFlashAnswer = null;
        updateBaselineInfo(); // Ensure button state is correct
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

    // Check for R3_EXCESS_NOISE (high error rates) - but only mark invalid if extreme
    // This is a quality issue, but we still allow baseline updates if thresholds are met
    // We'll mark as "mixed" quality rather than invalid unless error rates are extreme
    const falseStartRate = totalTrials > 0 ? (sessionPayload.falseStarts || 0) / totalTrials : 0;
    const missRate = totalTrials > 0 ? (sessionPayload.misses || 0) / totalTrials : 0;
    const falseAlarmRate = totalTrials > 0 && sessionPayload.nogoCount > 0 
      ? (sessionPayload.falseAlarms || 0) / sessionPayload.nogoCount 
      : 0;
    
    // Only mark as R3_INVALID if error rates are extremely high (>50% false starts or >60% miss/false alarm rate)
    // Otherwise, quality will be "mixed" but session is still valid
    if (!flags.invalid && (falseStartRate > 0.5 || missRate > 0.6 || falseAlarmRate > 0.6)) {
      flags = { invalid: true, reason: "excess_noise", refusalCode: "R3_EXCESS_NOISE" };
    }
    
    // Always write session record (even if baseline refuses saving later)
    const sessionRecord = {
      id: createdAt,
      createdAt,
      testType: tt, // Use actual testType value
      mode: mode || "", // Mode is determined by which action button was clicked (baseline/check/training)
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
      device,
      trialLog: buildTrialLog(tt, results)
    };
    
    // Compute and store quality
    sessionRecord.quality = computeSessionQuality(sessionRecord);
    
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
          sessionRecord.flags = { invalid: true, reason: "baseline_refused_too_few_go", refusalCode: "R2_INSUFFICIENT_DATA" };
          // Recompute quality with updated flags
          sessionRecord.quality = computeSessionQuality(sessionRecord);
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
              flashError: flashTarget > 0 || flashUser > 0 ? flashError : undefined,
              refusalCode: sessionRecord.flags.refusalCode,
              quality: sessionRecord.quality
            }, tt, mode);
          } else {
            setSummary("baseline_not_saved", {
              refusalCode: sessionRecord.flags.refusalCode,
              quality: sessionRecord.quality
            }, tt, mode);
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

      // Store device info with baseline session for consistency (used for device comparison warnings)
      sessions.push({
        ...sessionPayload,
        timestamp: new Date().toISOString(),
        device: device // Store device info with baseline for device consistency checking
      });
  
      saveBaseline(sessions);
      updateBaselineInfo();
      updateHistoryMenuState();
  
      const qualityNote = checkSessionQuality(sessionPayload, totalTrials, isReaction);
      
      if (isReaction) {
        setSummary("baseline_saved_reaction", {
          mean: sessionPayload.mean,
          sd: sessionPayload.sd,
          falseStarts: sessionPayload.falseStarts,
          qualityNote,
          quality: sessionRecord.quality || "good",
          deviceWarning: ""
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
          qualityNote,
          quality: sessionRecord.quality || "good",
          deviceWarning: ""
        }, tt, mode);
      } else if (isGoNoGo) {
        setSummary("baseline_saved_gonogo", {
          mean: sessionPayload.mean,
          sd: sessionPayload.sd,
          misses: sessionPayload.misses,
          falseAlarms: sessionPayload.falseAlarms,
          falseStarts: sessionPayload.falseStarts,
          qualityNote,
          quality: sessionRecord.quality || "good",
          deviceWarning: ""
        }, tt, mode);
      }

      mode = null;
      if (isDivided) {
        dividedPlan = null;
        dividedFlashAnswer = null;
      }
      return;
    }

    // ---- Training mode: no summary shown (consistent across all test types) ----
    if (mode === "training") {
      // Training mode doesn't update baseline, so ensure button states are correct
      updateBaselineInfo();
      mode = null;
      if (isDivided) {
        dividedPlan = null;
        dividedFlashAnswer = null;
      }
      return;
    }
  
    // ---- Check mode: compare to baseline ----
    if (mode === "check") {
      const sessionsRaw = loadBaseline();
      const sessions = filterValidBaselineSessions(sessionsRaw);
  
      if (sessions.length < minBaselineSessions()) {
        // Mark latest history record as invalid (check cannot compare)
        // tt already defined above
        sessionRecord.flags = { invalid: true, reason: "not_enough_baseline", refusalCode: "R2_INSUFFICIENT_DATA" };
        // Recompute quality with updated flags
        sessionRecord.quality = computeSessionQuality(sessionRecord);
        const hs = loadHistory(tt);
        hs[hs.length - 1] = sessionRecord;
        saveHistory(tt, hs);
        renderHistory();
        setSummary("not_enough_baseline", {
          refusalCode: sessionRecord.flags.refusalCode,
          quality: sessionRecord.quality
        }, tt, mode);
        mode = null;
        if (isDivided) {
          dividedPlan = null;
          dividedFlashAnswer = null;
        }
        return;
      }
  
      // Device consistency check (non-blocking warning)
      // Get device info from history records (baseline sessions in history)
      const historySessions = loadHistory(tt);
      const baselineHistorySessions = historySessions.filter(s => s && s.mode === "baseline" && s.device);
      const baselineDevices = baselineHistorySessions.map(s => s.device).filter(d => d);
      const currentDevice = getDeviceHints();
      let deviceWarning = "";
      
      if (baselineDevices.length > 0) {
        // Check if baseline devices differ from current device
        const baselineTouchCount = baselineDevices.filter(d => d.isTouch === true).length;
        const baselineMobileCount = baselineDevices.filter(d => d.userAgentHint === "mobile").length;
        
        // Check for mismatch (most common device type in baseline vs current)
        const mostCommonBaselineIsTouch = baselineTouchCount > baselineDevices.length / 2;
        const mostCommonBaselineIsMobile = baselineMobileCount > baselineDevices.length / 2;
        
        const hasDeviceMismatch = (mostCommonBaselineIsTouch !== currentDevice.isTouch) || 
                                   (mostCommonBaselineIsMobile !== (currentDevice.userAgentHint === "mobile"));
        
        if (hasDeviceMismatch) {
          deviceWarning = currentLang === "no"
            ? " Advarsel: Baselinesøkter ble utført på en annen enhetstype (mobil vs desktop). Sammenligning kan være mindre pålitelig."
            : " Warning: Baseline sessions were performed on a different device type (mobile vs desktop). Comparison may be less reliable.";
        }
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
          qualityNote,
          quality: sessionRecord.quality || "good",
          deviceWarning: deviceWarning || ""
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
          qualityNote,
          quality: sessionRecord.quality || "good",
          deviceWarning: deviceWarning || ""
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
          qualityNote,
          quality: sessionRecord.quality || "good",
          deviceWarning: deviceWarning || ""
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
  // Remove session-ended class when resetting
  if (trialList) {
    trialList.classList.remove("session-ended");
  }
  // Clear divided attention state on reset
  dividedPlan = null;
  dividedFlashAnswer = null;
  if (flashOverlayTimeoutId) {
    clearTimeout(flashOverlayTimeoutId);
    flashOverlayTimeoutId = null;
  }
  clearTimeout(timeoutId);

  inSession = false;
  isRunActive = false; // Stop auto-scroll
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

  // Show context panel when reset to idle
  const contextPanel = document.getElementById("contextPanel");
  if (contextPanel) {
    contextPanel.classList.remove("is-hidden");
  }


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
      const infoLt = baselineInfo.querySelector(".lang-lt");
      if (infoEn) infoEn.textContent = "No baseline sessions recorded.";
      if (infoNo) infoNo.textContent = "Ingen baseline-økter er registrert.";
      if (infoLt) infoLt.textContent = "Nėra užregistruotų bazinio lygio sesijų.";
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

// Map invalid reason to standardized refusal code
function reasonToRefusalCode(reason) {
  if (!reason) return null;
  
  // R1: Invalid execution - execution failures (no valid responses)
  if (reason === "no_valid_trials" || reason === "no_go_responses" || reason === "missing_secondary_answer") {
    return "R1_INVALID_EXECUTION";
  }
  
  // R2: Insufficient data - not enough valid data
  if (reason === "not_enough_baseline" || reason === "baseline_refused_too_few_go") {
    return "R2_INSUFFICIENT_DATA";
  }
  
  // R3: Excess noise - high error rates (will be set based on error thresholds)
  // This is handled separately in computeSessionQuality
  return null;
}

// Compute session quality classification: "good" | "mixed" | "not_usable"
function computeSessionQuality(session) {
  if (!session) return "not_usable";
  
  // If explicitly marked invalid, return "not_usable"
  if (session.flags && session.flags.invalid === true) {
    return "not_usable";
  }
  
  const metrics = session.metrics || {};
  const totalTrials = metrics.trials || 0;
  
  if (totalTrials === 0) return "not_usable";
  
  // Calculate error rates
  const falseStarts = metrics.falseStarts || 0;
  const misses = metrics.misses || 0;
  const falseAlarms = metrics.falseAlarms || 0;
  const hits = metrics.hits || metrics.trials || 0;
  const nogoCount = metrics.nogoCount || 0;
  
  const falseStartRate = totalTrials > 0 ? falseStarts / totalTrials : 0;
  const missRate = totalTrials > 0 ? misses / totalTrials : 0;
  // False alarm rate: use NO-GO count as denominator if available, otherwise use totalTrials as fallback
  const falseAlarmRate = nogoCount > 0 ? falseAlarms / nogoCount : (totalTrials > 0 ? falseAlarms / totalTrials : 0);
  const validHitRate = totalTrials > 0 ? hits / totalTrials : 0;
  
  // Thresholds for "mixed" quality
  // High error rates indicate mixed quality
  const hasHighFalseStartRate = falseStartRate > 0.2;
  const hasLowValidHitRate = validHitRate < 0.5;
  const hasHighMissRate = missRate > 0.3;
  const hasHighFalseAlarmRate = falseAlarmRate > 0.3;
  
  // If multiple issues or severe issues, mark as "mixed"
  if (hasHighFalseStartRate || hasLowValidHitRate || hasHighMissRate || hasHighFalseAlarmRate) {
    return "mixed";
  }
  
  // Otherwise "good"
  return "good";
}

function checkSessionQuality(sessionPayload, totalTrials, isReaction) {
  const falseStartRate = (sessionPayload.falseStarts || 0) / totalTrials;
  const validHitRate = sessionPayload.trials / totalTrials;
  
  const issues = [];
  if (falseStartRate > 0.2) {
    issues.push(currentLang === "no" ? "mange feilstarter" : currentLang === "lt" ? "daug klaidingų startų" : "many false starts");
  }
  if (validHitRate < 0.5) {
    issues.push(currentLang === "no" ? "få gyldige treff" : currentLang === "lt" ? "mažai galiojančių atsakų" : "few valid hits");
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
  if (s.includes("within") || s.includes("innenfor") || s.includes("įprastame")) return "ok";
  if (s.includes("slightly") || s.includes("litt") || s.includes("šiek")) return "warn";
  if (s.includes("significantly") || s.includes("betydelig") || s.includes("reikšmingai")) return "bad";
  return "na";
}

function qualityToBadgeClass(q) {
  // q is already something like "good" / "mixed" / "poor" etc
  if (!q) return "na";
  const v = String(q).toLowerCase();
  if (v.includes("good")) return "ok";
  if (v.includes("mix")) return "warn";
  if (v.includes("poor") || v.includes("bad")) return "bad";
  return "na";
}

function expectedTrialsFor(tt) {
  if (tt === "gonogo") return 20;
  return 10;
}

function sdChipClass(sd, baselineSD) {
  if (!Number.isFinite(sd) || !Number.isFinite(baselineSD) || baselineSD <= 0) return "na";
  if (sd <= baselineSD * 1.25) return "ok";
  if (sd <= baselineSD * 1.75) return "warn";
  return "bad";
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

// Small helper: human-friendly mode label (EN/NO via current language)
function modeLabel(mode) {
  const m = String(mode).toLowerCase();
  // Use translation system for consistency
  return t(`ui.mode.${m}`) || mode;
}

function renderHomeHistoryPreview() {
  if (!homeHistoryListEl) return;

  const tt = (testType && testType.value) ? testType.value : "reaction";
  let sessions = loadHistory(tt) || [];
  sessions = sessions
    .filter(s => s && (s.createdAt || s.id))
    .sort((a, b) => String(b.createdAt || b.id).localeCompare(String(a.createdAt || a.id)));

  const recent = sessions.slice(0, 3);

  homeHistoryListEl.innerHTML = "";

  // Empty state (per-test)
  if (homeHistoryEmptyEl) {
    homeHistoryEmptyEl.style.display = recent.length ? "none" : "block";
  }

  if (!recent.length) return;

  recent.forEach(s => {
    const isInvalid = !!(s?.flags?.invalid);
    const when = formatDateTime(s?.createdAt || s?.id);

    // Metrics (kept calm + minimal)
    const avg = s?.metrics?.avgMs;
    const trials = s?.metrics?.trials ?? s?.trials;
    const mode = s?.mode || "";

    // Prefer stored statusText; else compute if baseline exists
    let statusText = s?.statusText || "";
    if (!statusText && typeof avg === "number") {
      // Load baseline sessions and compute mean/sd (same pattern as renderHistory)
      const baselineSessionsRaw = (() => {
        try {
          const key = baselineKeyFor(tt);
          const raw = localStorage.getItem(key);
          return raw ? JSON.parse(raw) : [];
        } catch {
          return [];
        }
      })();
      const baselineSessions = filterValidBaselineSessions(baselineSessionsRaw);
      if (baselineSessions.length > 0) {
        const baselineMean = mean(baselineSessions.map(s => s.mean));
        const baselineSD = mean(baselineSessions.map(s => s.sd));
        if (Number.isFinite(baselineMean) && Number.isFinite(baselineSD)) {
          statusText = statusLabelFromCompare(avg, baselineMean, baselineSD);
        }
      }
    }

    const badgeClass = isInvalid ? "na" : clampBadgeClass(statusText);
    const badgeText = isInvalid ? t("trend.invalid") : t("trend.ok");

    const li = document.createElement("li");
    li.className = `home-history-item ${isInvalid ? "is-invalid" : "is-valid"}`;
    li.setAttribute("role", "button");
    li.setAttribute("tabindex", "0");

    // Top row
    const top = document.createElement("div");
    top.className = "home-history-top";

    const title = document.createElement("div");
    title.className = "home-history-title";
    title.innerHTML = `
      <span class="badge ${badgeClass}">${badgeText}</span>
      <strong>${mode ? modeLabel(mode) : ""}</strong>
    `;

    const rightWhen = document.createElement("div");
    rightWhen.className = "home-history-when muted";
    rightWhen.textContent = when;

    top.appendChild(title);
    top.appendChild(rightWhen);

    // Sub row
    const sub = document.createElement("div");
    sub.className = "home-history-sub";

    const metrics = document.createElement("div");
    metrics.className = "home-history-metrics muted";

    const avgStr = (typeof avg === "number") ? `${fmt(avg, 0)} ms` : "—";
    const trialsStr = (typeof trials === "number") ? `${trials}` : "—";

    metrics.innerHTML = `
      <span><strong>${avgStr}</strong></span>
      <span>${t("history.trials")}: <strong>${trialsStr}</strong></span>
    `;

    const status = document.createElement("div");
    status.className = "muted";
    status.textContent = statusText ? t("trend.status").replace("{status}", statusText) : "";

    sub.appendChild(metrics);
    sub.appendChild(status);

    li.appendChild(top);
    li.appendChild(sub);

    // Open History view on click (already wired by switchView)
    const open = () => {
      if (historyTest) historyTest.value = tt;
      if (historyMode) historyMode.value = "all";
      // Store session ID to expand after navigation
      const sessionId = s.createdAt || s.id;
      if (sessionId) {
        try {
          localStorage.setItem("fce_expand_session", String(sessionId));
        } catch {}
      }
      switchView("history");
    };

    li.addEventListener("click", open);
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });

    homeHistoryListEl.appendChild(li);
  });
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

  // Collect expanded card states before clearing (to preserve on language change)
  // Match by timestamp against ALL sessions (before filtering)
  const expandedSessions = new Set();
  if (historyListEl) {
    const existingCards = historyListEl.querySelectorAll(".history-card.is-open");
    existingCards.forEach(card => {
      const tsEl = card.querySelector(".history-ts");
      if (tsEl) {
        const tsText = tsEl.textContent.trim();
        // Find matching session in all loaded sessions (before filtering)
        const matchingSession = sessions.find(s => {
          const sessionTs = formatTs(s.createdAt || s.id);
          return sessionTs === tsText;
        });
        if (matchingSession) {
          // Use session ID (createdAt or id) as unique identifier
          expandedSessions.add(matchingSession.createdAt || matchingSession.id);
        }
      }
    });
  }
  
  // Check if a session was requested to be expanded from home preview
  let sessionToExpand = null;
  try {
    const storedId = localStorage.getItem("fce_expand_session");
    if (storedId) {
      // Find matching session
      const matching = sessions.find(s => String(s.createdAt || s.id) === storedId);
      if (matching) {
        sessionToExpand = String(matching.createdAt || matching.id);
        expandedSessions.add(sessionToExpand);
        // Clear the stored ID after using it
        localStorage.removeItem("fce_expand_session");
      } else {
        // Session not found, clear anyway
        localStorage.removeItem("fce_expand_session");
      }
    }
  } catch {}

  // Render trend panel (needs all sessions, not filtered)
  renderTrendFor(tt);

  if (modeFilter !== "all") {
    sessions = sessions.filter(s => s && s.mode === modeFilter);
  }

  historyListEl.innerHTML = "";

  if (!sessions.length) {
    historyEmpty.textContent = currentLang === "no" ? "Ingen historikk ennå." : currentLang === "lt" ? "Dar nėra istorijos." : "No history yet.";
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
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-expanded", "false");
    // Store session ID as data attribute for easier matching
    const cardSessionId = String(s.createdAt || s.id);
    card.setAttribute("data-session-id", cardSessionId);

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

    // Get metrics early for status text computation
    const m = s.metrics || {};
    const avg = Number(m.avgMs);
    const sd = Number(m.sdMs);
    const best = Number(m.bestMs);
    const worst = Number(m.worstMs);
    const trials = Number(m.trials);

    // Compute status text for badge color (for check sessions with baseline)
    let statusText = s?.statusText || "";
    if (!statusText && s.mode === "check" && baselineSessions.length && Number.isFinite(avg)) {
      // For divided attention, use multi-metric comparison if available; otherwise use avgMs only
      if (tt === "divided" && m.nogoCount !== undefined && m.flashAbsError !== undefined) {
        const sessionPayloadMock = {
          mean: avg,
          falseAlarms: m.falseAlarms || 0,
          trials: m.trials || 0,
          nogoCount: m.nogoCount || 0,
          flashAbsError: m.flashAbsError || 0
        };
        statusText = getDividedAttentionStatus(sessionPayloadMock, baselineSessions);
      } else {
        // For reaction and gonogo, use avgMs only
        statusText = statusLabelFromCompare(avg, baselineMean, baselineSD);
      }
    }

    // Mode-aware badge logic
    const badge = document.createElement("span");
    const isInvalid = !!(s.flags && s.flags.invalid);
    let badgeClass;
    let badgeText;

    if (isInvalid) {
      // Invalid sessions: always bad class
      badgeClass = "bad";
      badgeText = t("trend.invalid");
    } else if (s.mode === "check") {
      // Check sessions: use status-based coloring
      if (statusText) {
        // Prefer existing statusText
        badgeClass = clampBadgeClass(statusText);
        badgeText = statusText; // Use statusText directly (it's already localized)
      } else if (baselineSessions.length && Number.isFinite(avg) && Number.isFinite(baselineMean) && baselineMean > 0) {
        // Compute from delta percentage if statusText missing
        const deltaPct = Math.abs((avg - baselineMean) / baselineMean * 100);
        if (deltaPct <= 10) {
          badgeClass = "ok";
          badgeText = t("status.within");
        } else if (deltaPct <= 25) {
          badgeClass = "warn";
          badgeText = t("status.slightly");
        } else {
          badgeClass = "bad";
          badgeText = t("status.significantly");
        }
      } else {
        // No baseline available
        badgeClass = "na";
        badgeText = currentLang === "no" ? "Ingen baseline" : currentLang === "lt" ? "Nėra bazinio lygio" : "No baseline";
      }
      
      // Fallback: if badgeClass is still "na" and we have statusText, try again
      if (badgeClass === "na" && statusText) {
        badgeClass = clampBadgeClass(statusText);
        badgeText = statusText;
      }
    } else {
      // Baseline or Training sessions: neutral badge
      badgeClass = "na";
      if (s.mode === "baseline") {
        badgeText = t("ui.mode.baseline");
      } else if (s.mode === "training") {
        badgeText = t("ui.mode.training");
      } else {
        // Fallback for unknown modes
        badgeText = s.mode || "—";
      }
    }

    badge.className = `badge ${badgeClass}`;
    badge.textContent = badgeText;
    right.appendChild(badge);

    header.appendChild(left);
    header.appendChild(right);
    card.appendChild(header);

    // Summary section with chips
    const summary = document.createElement("div");
    summary.className = "history-summary";
    const chips = document.createElement("div");
    chips.className = "chips";
    
    // Determine chip classes semantically
    const avgClass = isInvalid ? "bad" : (s.mode === "check" && baselineSessions.length && statusText ? clampBadgeClass(statusText) : "na");
    const sdClass = s.mode === "check" && baselineSessions.length && Number.isFinite(sd) ? sdChipClass(sd, baselineSD) : "na";
    const expectedTrials = expectedTrialsFor(tt);
    const trialsClass = Number.isFinite(trials) ? (trials < expectedTrials ? "warn" : "ok") : "na";

    // Always show: Avg, SD, Trials
    if (Number.isFinite(avg)) {
      const chip = document.createElement("span");
      chip.className = `chip ${avgClass}`;
      chip.textContent = `${t("history.avg")} ${avg.toFixed(0)}ms`;
      chips.appendChild(chip);
    }
    if (Number.isFinite(sd)) {
      const chip = document.createElement("span");
      chip.className = `chip ${sdClass}`;
      chip.textContent = `${t("history.sd")} ${sd.toFixed(0)}ms`;
      chips.appendChild(chip);
    }
    if (Number.isFinite(trials)) {
      const chip = document.createElement("span");
      chip.className = `chip ${trialsClass}`;
      chip.textContent = `${t("history.trials")} ${trials}`;
      chips.appendChild(chip);
    }
    
    // Test-specific metrics
    if (tt === "gonogo") {
      if (typeof m.falseAlarms === "number") {
        const chip = document.createElement("span");
        chip.className = "chip";
        // Use abbreviated form: FA in EN, but full translation for NO/LT if preferred
        const faLabel = currentLang === "no" ? "IF" : currentLang === "lt" ? "SK" : "FA"; // IF = inhibisjonsfeil, SK = slopinimo klaidos
        chip.textContent = `${faLabel} ${m.falseAlarms}`;
        chips.appendChild(chip);
      }
    } else if (tt === "divided") {
      if (typeof m.falseAlarms === "number") {
        const chip = document.createElement("span");
        chip.className = "chip";
        const faLabel = currentLang === "no" ? "IF" : currentLang === "lt" ? "SK" : "FA";
        chip.textContent = `${faLabel} ${m.falseAlarms}`;
        chips.appendChild(chip);
      }
      if (typeof m.flashAbsError === "number" && Number.isFinite(m.flashAbsError)) {
        const chip = document.createElement("span");
        chip.className = "chip";
        // Use localized flash error label (flashAbsError is a count, not milliseconds)
        const flashLabel = currentLang === "no" ? "Flash-feil" : currentLang === "lt" ? "Blyksn. klaida" : "Flash err";
        chip.textContent = `${flashLabel} ${m.flashAbsError}`;
        chips.appendChild(chip);
      }
    }
    
    summary.appendChild(chips);
    
    // Affordance text
    const affordance = document.createElement("div");
    affordance.className = "history-affordance";
    const langEn = document.createElement("span");
    langEn.className = `lang lang-en${currentLang !== "en" ? " hidden" : ""}`;
    langEn.textContent = "Click to view details";
    const langNo = document.createElement("span");
    langNo.className = `lang lang-no${currentLang !== "no" ? " hidden" : ""}`;
    langNo.textContent = "Trykk for detaljer";
    const langLt = document.createElement("span");
    langLt.className = `lang lang-lt${currentLang !== "lt" ? " hidden" : ""}`;
    langLt.textContent = "Spustelėkite dėl detalių";
    affordance.appendChild(langEn);
    affordance.appendChild(langNo);
    affordance.appendChild(langLt);
    summary.appendChild(affordance);
    card.appendChild(summary);

    // Details section (collapsed by default)
    const details = document.createElement("div");
    details.className = "history-details";

    // Detailed lines in details section
    const line1 = document.createElement("div");
    line1.className = "history-line";
    line1.textContent = `${t("history.avg")} ${Number.isFinite(avg) ? avg.toFixed(0) : "—"} ms · ${t("history.sd")} ${Number.isFinite(sd) ? sd.toFixed(0) : "—"} · ${t("history.trials")} ${Number.isFinite(trials) ? trials : "—"}`;
    details.appendChild(line1);

    const line2 = document.createElement("div");
    line2.className = "history-line muted";
    line2.textContent = `${t("history.best")} ${Number.isFinite(best) ? best.toFixed(0) : "—"} · ${t("history.worst")} ${Number.isFinite(worst) ? worst.toFixed(0) : "—"}`;
    details.appendChild(line2);

    if (tt === "gonogo") {
      const errs = document.createElement("div");
      errs.className = "history-line";
      errs.textContent = `${t("history.misses")} ${m.misses ?? 0} · ${t("history.falseAlarms")} ${m.falseAlarms ?? 0} · ${t("history.falseStarts")} ${m.falseStarts ?? 0}`;
      details.appendChild(errs);
    } else if (tt === "divided") {
      // Show errors for divided attention
      const errs = document.createElement("div");
      errs.className = "history-line";
      errs.textContent = `${t("history.misses")} ${m.misses ?? 0} · ${t("history.falseAlarms")} ${m.falseAlarms ?? 0} · ${t("history.falseStarts")} ${m.falseStarts ?? 0}`;
      details.appendChild(errs);
      
      // Show flash metrics for divided attention
      if (typeof m.flashTargetCount === "number" && typeof m.flashUserCount === "number" && typeof m.flashAbsError === "number") {
        const flashLine = document.createElement("div");
        flashLine.className = "history-line muted";
        let flashLabel, targetLabel, answerLabel, errorLabel;
        if (currentLang === "no") {
          flashLabel = "Flashes";
          targetLabel = "mål";
          answerLabel = "svar";
          errorLabel = "feil";
        } else if (currentLang === "lt") {
          flashLabel = "Blyksniai";
          targetLabel = "tikslas";
          answerLabel = "atsakymas";
          errorLabel = "klaida";
        } else {
          flashLabel = "Flashes";
          targetLabel = "target";
          answerLabel = "answer";
          errorLabel = "error";
        }
        flashLine.textContent = `${flashLabel}: ${targetLabel} ${m.flashTargetCount} · ${answerLabel} ${m.flashUserCount} · ${errorLabel} ${m.flashAbsError}`;
        details.appendChild(flashLine);
      }
    } else {
      // Reaction Time: only false starts
      const fs = document.createElement("div");
      fs.className = "history-line";
      fs.textContent = `${t("history.falseStarts")} ${m.falseStarts ?? 0}`;
      details.appendChild(fs);
    }

    // Compare-to-baseline hint for check sessions
    if (s.mode === "check" && baselineSessions.length) {
      // Reuse statusText computed earlier for badge (or compute if not already computed)
      const status = statusText || (() => {
        if (tt === "divided" && m.nogoCount !== undefined && m.flashAbsError !== undefined) {
          const sessionPayloadMock = {
            mean: avg,
            falseAlarms: m.falseAlarms || 0,
            trials: m.trials || 0,
            nogoCount: m.nogoCount || 0,
            flashAbsError: m.flashAbsError || 0
          };
          return getDividedAttentionStatus(sessionPayloadMock, baselineSessions);
        } else {
          return statusLabelFromCompare(avg, baselineMean, baselineSD);
        }
      })();
      const delta = Number.isFinite(avg) && Number.isFinite(baselineMean) ? (avg - baselineMean) : NaN;
      const cmp = document.createElement("div");
      cmp.className = "history-compare";
      cmp.textContent = `${status} · Δ ${Number.isFinite(delta) ? (delta >= 0 ? "+" : "") + delta.toFixed(0) : "—"} ms (${t("history.baseline")} ${baselineMean.toFixed(0)} ± ${baselineSD.toFixed(0)} (±2 SD))`;
      details.appendChild(cmp);
    } else if (s.mode === "check" && !baselineSessions.length) {
      const cmp = document.createElement("div");
      cmp.className = "history-compare muted";
      cmp.textContent = currentLang === "no" ? "Ingen baseline for sammenligning." : currentLang === "lt" ? "Nėra bazinio lygio palyginimui." : "No baseline available for comparison.";
      details.appendChild(cmp);
    }

    // Tags
    const tags = s.tags || {};
    const hasTags = (tags.sleep || tags.stress || (tags.note && String(tags.note).trim()));
    if (hasTags) {
      const tagLine = document.createElement("div");
      tagLine.className = "history-tags";
      const parts = [];
      if (tags.sleep) {
        const sleepLabel = currentLang === "no" ? "søvn" : currentLang === "lt" ? "miegas" : "sleep";
        parts.push(`${sleepLabel} ${tags.sleep}/5`);
      }
      if (tags.stress) {
        const stressLabel = currentLang === "no" ? "stress" : currentLang === "lt" ? "stresas" : "stress";
        parts.push(`${stressLabel} ${tags.stress}/5`);
      }
      if (tags.note && String(tags.note).trim()) parts.push(`"${String(tags.note).trim()}"`);
      tagLine.textContent = parts.join(" · ");
      details.appendChild(tagLine);
    }

    // Quality label (always show) - display as colored badge
    const sessionQuality = s.quality || computeSessionQuality(s);
    if (sessionQuality) {
      const qualityLine = document.createElement("div");
      qualityLine.className = "history-line muted";
      const qc = qualityToBadgeClass(sessionQuality);
      qualityLine.innerHTML = `${t("quality.label")}: <span class="badge ${qc}">${t(`quality.${sessionQuality}`)}</span>`;
      details.appendChild(qualityLine);
    }
    
    // Invalid reason / refusal code (if present)
    if (isInvalid && s.flags) {
      const why = document.createElement("div");
      why.className = "history-reason";
      let reasonText = "";
      if (s.flags.refusalCode) {
        // Use standardized refusal message
        reasonText = t(`refusal.${s.flags.refusalCode}`);
      } else if (s.flags.reason) {
        // Fallback to old reason format (for backward compatibility)
        const reasonLabel = currentLang === "no" ? "Årsak: " : currentLang === "lt" ? "Priežastis: " : "Reason: ";
        reasonText = reasonLabel + String(s.flags.reason);
      }
      if (reasonText) {
        why.textContent = reasonText;
        details.appendChild(why);
      }
    }

    // Per-trial breakdown (collapsed by default)
    // Show button even if log is empty (for old sessions without trialLog)
    const log = Array.isArray(s.trialLog) ? s.trialLog : [];
    if (true) { // Always show button, even for old sessions
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-small trial-toggle";
      const btnEn = document.createElement("span");
      btnEn.className = `lang lang-en${currentLang !== "en" ? " hidden" : ""}`;
      btnEn.textContent = "Show trials";
      const btnNo = document.createElement("span");
      btnNo.className = `lang lang-no${currentLang !== "no" ? " hidden" : ""}`;
      btnNo.textContent = "Vis forsøk";
      const btnLt = document.createElement("span");
      btnLt.className = `lang lang-lt${currentLang !== "lt" ? " hidden" : ""}`;
      btnLt.textContent = "Rodyti bandymus";
      btn.appendChild(btnEn);
      btn.appendChild(btnNo);
      btn.appendChild(btnLt);

      const list = document.createElement("div");
      list.className = "trial-list hidden";

      if (log.length > 0) {
        list.innerHTML = log.map(row => {
          const rt = row.rt == null ? "—" : `${row.rt} ms`;
          // Translate outcome labels
          const outcomeText = t(`trialOutcome.${row.outcome}`) || row.outcome;
          return `<div class="trial-row"><span class="trial-i">#${row.i}</span><span class="trial-outcome">${outcomeText}</span><span class="trial-rt">${rt}</span></div>`;
        }).join("");
      } else {
        const noDataText = t("history.noTrialData");
        list.innerHTML = `<div class="trial-row"><span class="trial-i">—</span><span class="trial-outcome">${noDataText}</span><span class="trial-rt">—</span></div>`;
      }

      // Attach button listener with capture phase to prevent card toggle
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        const isHidden = list.classList.contains("hidden");
        if (isHidden) {
          // Show the list
          list.classList.remove("hidden");
          btnEn.textContent = "Hide trials";
          btnNo.textContent = "Skjul forsøk";
          btnLt.textContent = "Slėpti bandymus";
        } else {
          // Hide the list
          list.classList.add("hidden");
          btnEn.textContent = "Show trials";
          btnNo.textContent = "Vis forsøk";
          btnLt.textContent = "Rodyti bandymus";
        }
        // Manually toggle language visibility without calling applyLangUI (which re-renders)
        const currentLangValue = currentLang || (localStorage.getItem("fce_lang") || "en");
        btn.querySelectorAll(".lang").forEach(span => {
          span.classList.toggle("hidden", !span.classList.contains(`lang-${currentLangValue}`));
        });
        return false;
      }, true); // Use capture phase

      details.appendChild(btn);
      details.appendChild(list);
    }

    card.appendChild(details);
    
    // Restore expanded state if this session was expanded before re-render
    const sessionId = s.createdAt || s.id;
    if (expandedSessions.has(sessionId)) {
      card.classList.add("is-open");
      card.setAttribute("aria-expanded", "true");
    }
    
    // Toggle functionality
    const toggleCard = (e) => {
      // Don't toggle if clicking on buttons or links
      if (e.target.closest('button') || e.target.closest('a')) return;
      
      const isOpen = card.classList.contains("is-open");
      if (isOpen) {
        card.classList.remove("is-open");
        card.setAttribute("aria-expanded", "false");
      } else {
        card.classList.add("is-open");
        card.setAttribute("aria-expanded", "true");
      }
    };
    
    card.addEventListener("click", toggleCard);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleCard(e);
      }
    });
    
    historyListEl.appendChild(card);
  }
  
  // If a session was requested to be expanded from home preview, scroll to it
  if (sessionToExpand) {
    // Use requestAnimationFrame to ensure DOM is fully rendered
    requestAnimationFrame(() => {
      // Find the card by data-session-id attribute
      const targetCard = historyListEl.querySelector(`[data-session-id="${sessionToExpand}"]`);
      
      if (targetCard && targetCard.classList.contains("is-open")) {
        // Calculate topbar height dynamically
        const topbar = document.querySelector(".topbar");
        const topbarHeight = topbar ? topbar.offsetHeight : 64;
        const offset = topbarHeight + 20;
        
        // Small delay to ensure expanded content is rendered
        setTimeout(() => {
          // Scroll to card with offset
          const cardTop = targetCard.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: cardTop - offset,
            behavior: "smooth"
          });
          
          // Focus the card for accessibility (after scroll completes)
          setTimeout(() => {
            targetCard.focus();
          }, 300);
        }, 50);
      }
    });
  }
}

updateBaselineInfo();
updateDividedLegend();

// Hide Reset button initially (only show during active session)
resetBtn.style.display = "none";

// Apply language on startup
applyLangUI();

// Initialize onboarding gate
initOnboardingGate();

// Initialize task hints
updateTaskHint();

// Load and restore test type from localStorage
if (testType) {
  try {
    const savedTestType = localStorage.getItem(TEST_TYPE_KEY);
    if (savedTestType && (savedTestType === "reaction" || savedTestType === "gonogo" || savedTestType === "divided")) {
      testType.value = savedTestType;
      // Trigger change handlers to update UI
      updateTrialCountMax();
      updateBaselineInfo();
      updateDividedLegend();
    }
  } catch (_) {}
}

// Handle URL parameters for initial view selection (after all initialization)
const params = new URLSearchParams(location.search);
if (params.get("home") === "1") {
  // Force Home view (existing behavior)
  switchView("home");
} else if (params.get("view") === "history") {
  // Switch to History view (same as clicking the History menu button)
  switchView("history");
} else {
  // Default: Home view (already set by HTML class="active" on view-home)
  // Initialize aria-current and topbar page label for default view
  document.querySelectorAll('.menu-item[data-view]').forEach(item => {
    if (item.dataset.view === "home") {
      item.setAttribute("aria-current", "page");
    } else {
      item.removeAttribute("aria-current");
    }
  });
  const topbarPage = document.getElementById("topbarPage");
  if (topbarPage) {
    topbarPage.textContent = t("ui.home");
  }
}

// Initialize History menu state
updateHistoryMenuState();

// Home History button click handler
const homeHistoryBtn = document.getElementById("homeHistoryBtn");
if (homeHistoryBtn) {
  homeHistoryBtn.addEventListener("click", () => {
    switchView("history");
  });
}

// Language select change handler
const langSelect = document.getElementById("langSelect");
if (langSelect) {
  langSelect.addEventListener("change", (e) => {
    setLang(e.target.value);
  });
}

// Back button handler for History view
function safeBack(fallbackUrl) {
  try {
    const ref = document.referrer || "";
    const sameOrigin = ref.startsWith(window.location.origin);
    // If referrer is same-origin and history exists, go back
    if (sameOrigin && window.history.length > 1) {
      window.history.back();
      return;
    }
  } catch (e) {
    // Fall through to fallback
  }
  // Always use fallback if no valid history or referrer
  window.location.href = fallbackUrl;
}

const backBtnHistory = document.getElementById("backBtnHistory");
if (backBtnHistory) {
  backBtnHistory.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Restore previous view (default to "home")
    let prevView = "home";
    try {
      const stored = sessionStorage.getItem("fce_prev_view");
      if (stored && stored.trim()) {
        prevView = stored.trim();
      }
    } catch {}
    
    // Ensure prevView is valid (fallback to "home")
    if (prevView !== "home" && prevView !== "history") {
      prevView = "home";
    }
    
    // Store scroll position before switching
    let scrollPos = null;
    try {
      const stored = sessionStorage.getItem("fce_prev_scroll");
      if (stored) {
        const pos = parseInt(stored, 10);
        if (!isNaN(pos) && pos >= 0) {
          scrollPos = pos;
          // Set a flag so switchView knows not to scroll to top
          sessionStorage.setItem("fce_restoring_scroll", "true");
        }
      }
    } catch {}
    
    // Clear navigation state (but keep restoring flag)
    try {
      sessionStorage.removeItem("fce_prev_view");
      sessionStorage.removeItem("fce_prev_scroll");
    } catch {}
    
    // Switch to previous view (always go back to home from history)
    // Even if stored view was something else, we should go to home since history back button means "go home"
    if (prevView === "history") {
      prevView = "home";
    }
    switchView(prevView);
    
    // Restore scroll position after view is rendered
    if (scrollPos !== null) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: scrollPos, behavior: "instant" });
          // Clear the restoring flag
          try {
            sessionStorage.removeItem("fce_restoring_scroll");
          } catch {}
        });
      });
    }
  });
}

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
