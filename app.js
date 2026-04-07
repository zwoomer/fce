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
    } else if (tt === "precision") {
      // Precision: hit, miss, timeout
      outcome = type;
    }

    // For precision, include errN
    if (tt === "precision") {
      const errN = Number.isFinite(e?.errN) ? e.errN : null;
      return { i: idx + 1, outcome, rt, errN };
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
        precision: "Precision (Target Pointing)",
      },
      mode: {
        baseline: "Baseline",
        check: "Check",
        training: "Training",
        all: "All",
      },
      noteLabel: "Note",
    },
    status: {
      within: "Within your usual range",
      slightly: "Slightly below your usual range",
      significantly: "Significantly below your usual range",
      noBaseline: "No baseline yet — add baseline sessions first.",
    },
    baseline: {
      noSessions: "No baseline sessions recorded.",
      sessions: "sessions",
      statusLabel: "Baseline status",
      statusBuilding: "building",
      statusReady: "ready",
      lastSessionLabel: "Last session",
    },
    export: {
      btn: "Export (Copy JSON)",
      btnCsv: "Export CSV",
      backupBtn: "Export full backup (.json)",
      backupReminder:
        "Your data is stored only in this browser. Export regularly to keep a backup.",
      lastBackupLabel: "Last full backup",
      lastBackupNever: "never",
      copied: "Copied to clipboard.",
      csvExported: "CSV exported.",
      backupOk: "Backup exported successfully.",
      backupEmpty: "No FCE data found in local storage to export.",
      empty: "No history to export.",
      failed: "Copy failed — showing text below.",
    },
    importPreview: {
      btn: "Preview import (.json)",
      title: "Import preview (dry run)",
      valid: "Valid — file matches FCE backup rules.",
      invalid: "Invalid — see errors below.",
      schemaVersion: "Schema version",
      keyCount: "Keys in localStorageSnapshot",
      groupsHeader: "Keys per group (from groups, if present)",
      warnings: "Warnings",
      errors: "Errors",
      wouldRestore: "Would restore (localStorage keys)",
      summaryJson: "Summary (for tooling)",
      dryRunNote:
        "Preview does not change storage. Import runs only after you confirm, using the button below.",
      noWarnings: "None",
      noErrors: "None",
      readError: "Could not read the file.",
      parseError: "File is not valid JSON.",
      importBtn: "Import data",
      overwriteWarning:
        "Warning: {overwrite} of {total} key(s) already exist in local storage and will be replaced. {fresh} key(s) are new.",
      confirmImport:
        "Import this backup into local storage on this device?\n\nTotal keys: {total}\nWill overwrite existing: {overwrite}\nNew keys: {fresh}\n\nYou cannot undo this. Continue?",
      importSuccessNoSkip:
        "Imported {written} key(s): {replaced} replaced, {fresh} new.",
      importSuccessWithSkip:
        "Imported {written} key(s): {replaced} replaced, {fresh} new, {skipped} skipped.",
      importUpdatedMeaning:
        "Local FCE data on this browser was updated from the imported backup.",
      importAborted: "Import cancelled.",
      importNothing: "No keys could be written. Check the backup file.",
    },
    trend: {
      title: "Change over time (relative to your baseline)",
      subtitle: "This view shows how each check compares to your own usual performance over time.",
      baselineHeader: "Your baseline (long-term):",
      typical: {
        reaction: "Typical reaction time:",
        gonogo: "Typical response pattern:",
        divided: "Typical divided-attention performance:",
        precision: "Typical precision accuracy:",
      },
      variation: "Typical day-to-day variation:",
      guideHelp: "The shaded area shows where your results usually fall when conditions are similar.",
      guideBand: "Visual guide band:",
      noBaseline: "No baseline yet — trend uses baseline sessions.",
      noChecks: "No check sessions yet.",
      checkLabel: "Check",
      delta: "Difference from baseline: {delta}",
      result: "Result:",
      footerNote: "This view visualizes change. It does not decide readiness, fitness, or permission.",
      ok: "OK",
      invalid: "INVALID",
    },
    session: {
      chip: {
        avg: "Average",
        consistency: "Consistency (this session)",
        trials: "Trials",
      },
      detail: {
        avg: "Average",
        consistency: "Consistency",
        trials: "Trials",
        compare: {
          line1: "This result differs by {delta} from your baseline.",
          line2: {
            within: "Given how much you usually vary, this difference is still typical for you.",
            slightly: "Given how much you usually vary, this difference is less typical, but still within a reasonable range.",
            significantly: "Given how much you usually vary, this difference is not typical for you.",
          },
        },
      },
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
      empty: "No history yet.",
      noBaseline: "No baseline",
      noBaselineForComparison: "No baseline available for comparison.",
      clickToViewDetails: "Click to view details",
      showTrials: "Show trials",
      hideTrials: "Hide trials",
      precision: {
        hit: "hit",
        rt: "rt",
        err: "err",
        responded: "responded",
        misses: "misses",
        timeouts: "timeouts",
        labels: {
          accuracy: "Accuracy",
          consistency: "Consistency",
          execution: "Execution",
          hits: "Hits",
          misses: "Misses",
          timeouts: "Timeouts",
          avgRt: "Average RT",
          variability: "Variability (SD)",
          sd: "SD",
        },
        comparison: {
          within: "Accuracy within normal range",
          slightly: "Accuracy slightly worse than baseline",
          significantly: "Accuracy significantly worse than baseline",
        },
      },
      gonogo: {
        nogoTrials: "NO-GO trials",
        errors: {
          none: "Errors: none",
          present: "Errors: present",
        },
      },
      divided: {
        flashes: "Flashes",
        flashesFormat: "Flashes: {answered}/{target}",
        target: "target",
        answer: "answer",
        error: "error",
        flashMismatch: "flash mismatch (answered {answered} of {target})",
        errors: {
          none: "Errors: none",
          present: "Errors: present",
          summaryNone: "Errors: none (no misses, false alarms, or flash errors)",
          summaryPresent: "Errors: present — flash mismatch (answered {answered} of {target}); misses: {misses}; false alarms: {fa}",
        },
      },
      tags: {
        sleep: "sleep",
        stress: "stress",
      },
      reason: "Reason: ",
      reasonText: {
        R1_INVALID_EXECUTION: "execution failure (no valid responses recorded).",
        R2_INSUFFICIENT_DATA: "insufficient data (too few valid responses).",
        R3_EXCESS_NOISE: "excessive errors (too many false starts or inhibitory errors).",
      },
      precision: {
        notUsable: "Not usable",
        reasonPrefix: "Reason:",
        reasonGeneric: "too many execution errors to measure precision reliably.",
      },
      falseAlarmsAbbr: "FA",
    },
    trialOutcome: {
      hit: "Hit",
      go: "GO",
      miss: "Miss",
      false_alarm: "False alarm",
      correct_reject: "Correct",
      false_start: "False start",
      timeout: "Timeout",
      unknown: "Unknown",
    },
    quality: {
      good: "Good",
      mixed: "Mixed",
      not_usable: "Not usable",
      label: "Quality",
      warning: {
        manyFalseStarts: "many false starts",
        fewValidHits: "few valid hits",
        note: "Note: This session had {issues} — consider retaking for better baseline quality.",
        joiner: "and",
      },
    },
    refusal: {
      R1_INVALID_EXECUTION: "Session not usable: execution failure (no valid responses recorded).",
      R2_INSUFFICIENT_DATA: "Session not usable: insufficient data (too few valid responses).",
      R3_EXCESS_NOISE: "Session not usable: excessive errors (too many false starts or inhibitory errors).",
    },
    remedy: {
      invalid_no_reaction: "Next step: run again and respond to the GO cue.",
      invalid_no_go: "Next step: run again and respond on GO trials.",
      invalid_missing_answer: "Next step: enter your flash count before finishing.",
      invalid_no_go_responses_divided: "Next step: run again and respond on GO trials.",
      invalid_precision_no_responses: "Next step: run again and respond to targets.",
      invalid_precision_insufficient: "Next step: run again and complete enough taps to produce usable data.",
      invalid_precision_excess_noise: "Next step: rest briefly and re-run with steady input (avoid rushed or missed taps).",
      invalid_precision_exit: "Next step: run again and complete the session.",
      not_enough_baseline: "Next step: complete more baseline sessions before using Check.",
      baseline_not_saved: "Next step: complete a valid Baseline run to start comparisons.",
      baseline_not_saved_divided: "Next step: complete a valid Baseline run to start comparisons.",
    },
    stimulus: {
      ready: "Ready…",
      reaction: {
        go: "CLICK!",
      },
      gonogo: {
        go: "GO (click)",
        nogo: "NO-GO (don't click)",
        nogoTrials: "NO-GO trials",
        errors: {
          none: "Errors: none",
          present: "Errors: present",
        },
      },
      divided: {
        go: "TAP",
        nogo: "NO TAP",
        legend: "TAP = respond · NO TAP = wait · Count blue flashes",
      },
    },
    precision: {
      feedback: {
        hit: "Hit",
        miss: "Miss",
        timeout: "Timeout",
      },
      fullscreen: {
        unavailable: "Fullscreen unavailable — running windowed.",
        exited: "Fullscreen exited — continuing windowed.",
      },
      invalid: "Precision test invalid.",
      noFullscreenNote: "Note: This Precision session ran without fullscreen. Input consistency may be reduced.",
    },
    op: {
      title: "What happens after a test?",
      note: "Advisory only. This does not diagnose or decide readiness.",
      tiers: {
        baseline_needed_title: "Baseline needed",
        proceed_title: "Proceed",
        proceed_caution_title: "Proceed with caution",
        pause_retest_title: "Pause and retest",
        rest_retest_later_title: "Rest and retest later",
        not_usable_title: "Not usable session",
      },
      common: {
        retest_now: "Retest now in a calm, consistent setup.",
        retest_later: "Rest and recheck later if performance stays below baseline.",
        take_break: "Take a short break, then re-run a check in a consistent setup.",
        reduce_load: "Consider lowering intensity and rechecking if needed.",
        check_conditions: "Check your setup and conditions before retesting.",
        consider_context: "If this matches your baseline, it's reasonable to continue as planned.",
        if_symptoms: "If you feel symptoms or fatigue, prioritize rest.",
      },
      byTest: {
        reaction: {
          oneLine: "This measures alertness and attention. False starts may indicate rushing or setup issues.",
          bullet1: "Alertness and attention are key factors in reaction time.",
          bullet2: "False starts often reflect rushing or inconsistent setup.",
        },
        gonogo: {
          oneLine: "This measures inhibition control. False alarms or misses may indicate attention or inhibition issues.",
          bullet1: "Inhibition control helps manage responses appropriately.",
          bullet2: "False alarms or misses may reflect attention or inhibition challenges.",
        },
        divided: {
          oneLine: "This measures multi-demand load. Flash errors or inhibitory errors may indicate attention capacity limits.",
          bullet1: "Multi-demand tasks require managing multiple attention streams.",
          bullet2: "Flash errors or inhibitory errors may reflect attention capacity limits.",
        },
        precision: {
          oneLine: "This measures fine motor control. Fullscreen and device consistency affect results.",
          bullet1: "Fine motor control requires steady, consistent input.",
          bullet2: "Fullscreen and device consistency are important for reliable results.",
        },
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
        precision: "Presisjon (målpunkt)",
      },
      mode: {
        baseline: "Baseline",
        check: "Sjekk",
        training: "Trening",
        all: "Alle",
      },
      noteLabel: "Merk",
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
      statusLabel: "Baseline-status",
      statusBuilding: "under oppbygging",
      statusReady: "klar",
      lastSessionLabel: "Siste økt",
    },
    export: {
      btn: "Eksporter (kopier JSON)",
      btnCsv: "Eksporter CSV",
      backupBtn: "Eksporter full sikkerhetskopi (.json)",
      backupReminder:
        "Dataene dine lagres kun i denne nettleseren. Eksporter jevnlig for å ha en sikkerhetskopi.",
      lastBackupLabel: "Siste fullstendige sikkerhetskopi",
      lastBackupNever: "aldri",
      copied: "Kopiert til utklippstavlen.",
      csvExported: "CSV eksportert.",
      backupOk: "Sikkerhetskopien ble eksportert.",
      backupEmpty: "Fant ingen FCE-data i lokal lagring å eksportere.",
      empty: "Ingen historikk å eksportere.",
      failed: "Kopiering feilet — viser tekst under.",
    },
    importPreview: {
      btn: "Forhåndsvis import (.json)",
      title: "Importforhåndsvisning (kun lesing)",
      valid: "Gyldig — filen følger FCE-sikkerhetskopireglene.",
      invalid: "Ugyldig — se feil under.",
      schemaVersion: "Skjemaversjon",
      keyCount: "Nøkler i localStorageSnapshot",
      groupsHeader: "Nøkler per gruppe (fra groups, hvis til stede)",
      warnings: "Advarsler",
      errors: "Feil",
      wouldRestore: "Ville gjenopprettet (localStorage-nøkler)",
      summaryJson: "Sammendrag (for verktøy)",
      dryRunNote:
        "Forhåndsvisning endrer ikke lagring. Import skjer først etter at du bekrefter, med knappen under.",
      noWarnings: "Ingen",
      noErrors: "Ingen",
      readError: "Kunne ikke lese filen.",
      parseError: "Filen er ikke gyldig JSON.",
      importBtn: "Importer data",
      overwriteWarning:
        "Advarsel: {overwrite} av {total} nøkler finnes allerede lokalt og blir erstattet. {fresh} nøkler er nye.",
      confirmImport:
        "Importere denne sikkerhetskopien til lokal lagring på denne enheten?\n\nTotalt antall nøkler: {total}\nVil overskrive eksisterende: {overwrite}\nNye nøkler: {fresh}\n\nDette kan ikke angres. Fortsette?",
      importSuccessNoSkip:
        "Importerte {written} nøkler: {replaced} erstattet, {fresh} nye.",
      importSuccessWithSkip:
        "Importerte {written} nøkler: {replaced} erstattet, {fresh} nye, {skipped} hoppet over.",
      importUpdatedMeaning:
        "Lokale FCE-data i denne nettleseren ble oppdatert fra den importerte sikkerhetskopien.",
      importAborted: "Import avbrutt.",
      importNothing: "Ingen nøkler kunne skrives. Sjekk sikkerhetskopifilen.",
    },
    trend: {
      title: "Endring over tid (i forhold til din baseline)",
      subtitle: "Denne visningen viser hvordan hver sjekk sammenlignes med din egen vanlige ytelse over tid.",
      baselineHeader: "Din baseline (langsiktig):",
      typical: {
        reaction: "Typisk reaksjonstid:",
        gonogo: "Typisk responsmønster:",
        divided: "Typisk delt-oppmerksomhet ytelse:",
        precision: "Typisk presisjonsnøyaktighet:",
      },
      variation: "Typisk dag-til-dag variasjon:",
      guideHelp: "Det skyggelagte området viser hvor resultatene dine vanligvis faller når forholdene er like.",
      guideBand: "Visuell guide-bånd:",
      noBaseline: "Ingen baseline ennå — trend bruker baseline-økter.",
      noChecks: "Ingen sjekk-økter ennå.",
      checkLabel: "Sjekk",
      delta: "Forskjell fra baseline: {delta}",
      result: "Resultat:",
      footerNote: "Denne visningen visualiserer endring. Den avgjør ikke klarhet, form eller tillatelse.",
      ok: "OK",
      invalid: "UGYLDIG",
    },
    session: {
      chip: {
        avg: "Gjennomsnitt",
        consistency: "Konsistens (denne økten)",
        trials: "Forsøk",
      },
      detail: {
        avg: "Gjennomsnitt",
        consistency: "Konsistens",
        trials: "Forsøk",
        compare: {
          line1: "Dette resultatet avviker med {delta} fra din baseline.",
          line2: {
            within: "Gitt hvor mye du vanligvis varierer, er denne forskjellen fortsatt typisk for deg.",
            slightly: "Gitt hvor mye du vanligvis varierer, er denne forskjellen mindre typisk, men fortsatt innenfor et rimelig område.",
            significantly: "Gitt hvor mye du vanligvis varierer, er denne forskjellen ikke typisk for deg.",
          },
        },
      },
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
      empty: "Ingen historikk ennå.",
      noBaseline: "Ingen baseline",
      noBaselineForComparison: "Ingen baseline tilgjengelig for sammenligning.",
      clickToViewDetails: "Trykk for detaljer",
      showTrials: "Vis forsøk",
      hideTrials: "Skjul forsøk",
      precision: {
        hit: "treff",
        rt: "rt",
        err: "feil",
        responded: "svart",
        misses: "bom",
        timeouts: "tidsavbrudd",
        labels: {
          accuracy: "Nøyaktighet",
          consistency: "Konsistens",
          execution: "Utførelse",
          hits: "Treff",
          misses: "Bom",
          timeouts: "Tidsavbrudd",
          avgRt: "Gjennomsnittlig RT",
          variability: "Variabilitet (SD)",
          sd: "SD",
        },
        comparison: {
          within: "Nøyaktighet innenfor normalområdet",
          slightly: "Nøyaktighet noe dårligere enn baseline",
          significantly: "Nøyaktighet betydelig dårligere enn baseline",
        },
      },
      gonogo: {
        nogoTrials: "NO-GO forsøk",
        errors: {
          none: "Feil: ingen",
          present: "Feil: til stede",
        },
      },
      divided: {
        flashes: "Blink",
        flashesFormat: "Blink: {answered}/{target}",
        target: "mål",
        answer: "svar",
        error: "feil",
        flashMismatch: "blink mismatch (svarte {answered} av {target})",
        errors: {
          none: "Feil: ingen",
          present: "Feil: til stede",
          summaryNone: "Feil: ingen (ingen bom, inhibisjonsfeil eller blinkfeil)",
          summaryPresent: "Feil: til stede — blink mismatch (svarte {answered} av {target}); bom: {misses}; inhibisjonsfeil: {fa}",
        },
      },
      tags: {
        sleep: "søvn",
        stress: "stress",
      },
      reason: "Årsak: ",
      reasonText: {
        R1_INVALID_EXECUTION: "utførelsesfeil (ingen gyldige responser registrert).",
        R2_INSUFFICIENT_DATA: "utilstrekkelige data (for få gyldige responser).",
        R3_EXCESS_NOISE: "for mange feil (for mange feilstarter eller inhibisjonsfeil).",
      },
      precision: {
        notUsable: "Ikke brukbar",
        reasonPrefix: "Årsak:",
        reasonGeneric: "for mange utførelsesfeil til å måle presisjon pålitelig.",
      },
      falseAlarmsAbbr: "IF",
    },
    trialOutcome: {
      hit: "Treff",
      go: "GO",
      miss: "Bom",
      false_alarm: "Inhibisjonsfeil",
      correct_reject: "Korrekt",
      false_start: "Feilstart",
      timeout: "Tidsavbrudd",
      unknown: "Ukjent",
    },
    quality: {
      good: "God",
      mixed: "Blandet",
      not_usable: "Ikke brukbar",
      label: "Kvalitet",
      warning: {
        manyFalseStarts: "mange feilstarter",
        fewValidHits: "få gyldige treff",
        note: " Merknad: Denne økten hadde {issues} — vurder å gjennomføre på nytt for bedre baseline-kvalitet.",
        joiner: "og",
      },
    },
    refusal: {
      R1_INVALID_EXECUTION: "Økt ikke brukbar: utførelsesfeil (ingen gyldige responser registrert).",
      R2_INSUFFICIENT_DATA: "Økt ikke brukbar: utilstrekkelige data (for få gyldige responser).",
      R3_EXCESS_NOISE: "Økt ikke brukbar: for mange feil (for mange feilstarter eller inhibisjonsfeil).",
    },
    remedy: {
      invalid_no_reaction: "Neste steg: kjør på nytt og responder på GO-signalet.",
      invalid_no_go: "Neste steg: kjør på nytt og responder på GO-forsøk.",
      invalid_missing_answer: "Neste steg: skriv inn antall blink før du avslutter.",
      invalid_no_go_responses_divided: "Neste steg: kjør på nytt og responder på GO-forsøk.",
      invalid_precision_no_responses: "Neste steg: kjør på nytt og responder på målene.",
      invalid_precision_insufficient: "Neste steg: kjør på nytt og fullfør nok trykk for å produsere brukbare data.",
      invalid_precision_excess_noise: "Neste steg: hvil kort og kjør på nytt med jevn inndata (unngå forhastede eller bommende trykk).",
      invalid_precision_exit: "Neste steg: kjør på nytt og fullfør økten.",
      not_enough_baseline: "Neste steg: fullfør flere baseline-økter før du bruker Sjekk.",
      baseline_not_saved: "Neste steg: fullfør en gyldig Baseline-kjøring for å starte sammenligninger.",
      baseline_not_saved_divided: "Neste steg: fullfør en gyldig Baseline-kjøring for å starte sammenligninger.",
    },
    stimulus: {
      ready: "Klar…",
      reaction: {
        go: "KLIKK!",
      },
      gonogo: {
        go: "GO (klikk)",
        nogo: "NO-GO (ikke klikk)",
        nogoTrials: "NO-GO forsøk",
        errors: {
          none: "Feil: ingen",
          present: "Feil: til stede",
        },
      },
      divided: {
        go: "TRYKK",
        nogo: "IKKE",
        legend: "TRYKK = svar · IKKE = vent · Tell blå blink",
      },
    },
      precision: {
        feedback: {
          hit: "Treff",
          miss: "Bom",
          timeout: "Tidsavbrudd",
        },
        fullscreen: {
          unavailable: "Fullskjerm utilgjengelig — kjører i vindu.",
          exited: "Fullskjerm avsluttet — fortsetter i vindu.",
        },
        invalid: "Presisjonstest ugyldig.",
        noFullscreenNote: "Merk: Denne presisjonsøkten kjørte uten fullskjerm. Inndata-konsistens kan være redusert.",
      },
    op: {
      title: "Hva skjer etter en test?",
      note: "Kun rådgivende. Dette diagnostiserer ikke eller avgjør ikke klarhet.",
      tiers: {
        baseline_needed_title: "Baseline nødvendig",
        proceed_title: "Fortsett",
        proceed_caution_title: "Fortsett med forsiktighet",
        pause_retest_title: "Pause og test på nytt",
        rest_retest_later_title: "Hvil og test senere",
        not_usable_title: "Ikke brukbar økt",
      },
      common: {
        retest_now: "Test på nytt nå i en rolig, konsistent oppsett.",
        retest_later: "Hvil og sjekk senere hvis ytelsen forblir under baseline.",
        take_break: "Ta en kort pause, deretter kjør en sjekk på nytt i et konsistent oppsett.",
        reduce_load: "Vurder å redusere intensitet og sjekke på nytt hvis nødvendig.",
        check_conditions: "Sjekk oppsettet og forholdene før du tester på nytt.",
        consider_context: "Hvis dette matcher din baseline, er det rimelig å fortsette som planlagt.",
        if_symptoms: "Hvis du føler symptomer eller tretthet, prioriter hvile.",
      },
      byTest: {
        reaction: {
          oneLine: "Dette måler oppmerksomhet og reaksjon. Feilstarter kan indikere hastverk eller oppsettsproblemer.",
          bullet1: "Oppmerksomhet og reaksjon er nøkkelfaktorer i reaksjonstid.",
          bullet2: "Feilstarter reflekterer ofte hastverk eller inkonsistent oppsett.",
        },
        gonogo: {
          oneLine: "Dette måler inhibisjonskontroll. Inhibisjonsfeil eller bom kan indikere oppmerksomhets- eller inhibisjonsproblemer.",
          bullet1: "Inhibisjonskontroll hjelper med å håndtere responser passende.",
          bullet2: "Inhibisjonsfeil eller bom kan reflektere oppmerksomhets- eller inhibisjonsutfordringer.",
        },
        divided: {
          oneLine: "Dette måler multi-demand belastning. Blinkfeil eller inhibisjonsfeil kan indikere oppmerksomhetskapasitetsgrenser.",
          bullet1: "Multi-demand oppgaver krever håndtering av flere oppmerksomhetsstrømmer.",
          bullet2: "Blinkfeil eller inhibisjonsfeil kan reflektere oppmerksomhetskapasitetsgrenser.",
        },
        precision: {
          oneLine: "Dette måler finmotorisk kontroll. Fullskjerm og enhetskonsistens påvirker resultatene.",
          bullet1: "Finmotorisk kontroll krever jevn, konsistent inndata.",
          bullet2: "Fullskjerm og enhetskonsistens er viktig for pålitelige resultater.",
        },
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
        precision: "Tikslumas (taikinio nukreipimas)",
      },
      mode: {
        baseline: "Bazinis lygis",
        check: "Patikra",
        training: "Treniruotė",
        all: "Visi",
      },
      noteLabel: "Pastaba",
    },
    status: {
      within: "Jūsų įprastame diapazone",
      slightly: "Šiek tiek žemiau jūsų įprasto diapazono",
      significantly: "Reikšmingai žemiau jūsų įprasto diapazono",
      noBaseline: "Dar nėra bazinio lygio — pirmiausia pridėkite bazinio lygio sesijas.",
    },
    baseline: {
      noSessions: "Nėra užregistruotų bazinio lygio sesijų.",
      sessions: "sesijos",
      statusLabel: "Bazinio lygio būsena",
      statusBuilding: "kuriama",
      statusReady: "paruošta",
      lastSessionLabel: "Paskutinė sesija",
    },
    export: {
      btn: "Eksportuoti (kopijuoti JSON)",
      btnCsv: "Eksportuoti CSV",
      backupBtn: "Eksportuoti pilną atsarginę kopiją (.json)",
      backupReminder:
        "Jūsų duomenys saugomi tik šioje naršyklėje. Reguliariai eksportuokite, kad turėtumėte atsarginę kopiją.",
      lastBackupLabel: "Paskutinė pilna atsarginė kopija",
      lastBackupNever: "niekada",
      copied: "Kopijuota į iškarpinę.",
      csvExported: "CSV eksportuotas.",
      backupOk: "Atsarginė kopija sėkmingai eksportuota.",
      backupEmpty: "Vietinėje saugykloje nerasta FCE duomenų eksportavimui.",
      empty: "Nėra istorijos eksportavimui.",
      failed: "Kopijavimas nepavyko — rodomas tekstas žemiau.",
    },
    importPreview: {
      btn: "Peržiūrėti importą (.json)",
      title: "Importo peržiūra (tik skaitymas)",
      valid: "Galioja — failas atitinka FCE atsarginės kopijos taisykles.",
      invalid: "Negalioja — žr. klaidas žemiau.",
      schemaVersion: "Schemos versija",
      keyCount: "Raktai localStorageSnapshot",
      groupsHeader: "Raktai pagal grupę (iš groups, jei yra)",
      warnings: "Įspėjimai",
      errors: "Klaidos",
      wouldRestore: "Būtų atkurti (localStorage raktai)",
      summaryJson: "Santrauka (įrankiams)",
      dryRunNote:
        "Peržiūra nekeičia saugyklos. Importas vyksta tik po patvirtinimo mygtuku žemiau.",
      noWarnings: "Nėra",
      noErrors: "Nėra",
      readError: "Nepavyko perskaityti failo.",
      parseError: "Failas nėra tinkamas JSON.",
      importBtn: "Importuoti duomenis",
      overwriteWarning:
        "Įspėjimas: {overwrite} iš {total} raktų jau yra vietinėje saugykloje ir bus pakeisti. {fresh} raktai yra nauji.",
      confirmImport:
        "Importuoti šią atsarginę kopiją į šio įrenginio vietinę saugyklą?\n\nIš viso raktų: {total}\nPerrašys esamus: {overwrite}\nNauji raktai: {fresh}\n\nAtšaukti negalėsite. Tęsti?",
      importSuccessNoSkip:
        "Importuota {written} raktų: {replaced} pakeisti, {fresh} nauji.",
      importSuccessWithSkip:
        "Importuota {written} raktų: {replaced} pakeisti, {fresh} nauji, {skipped} praleista.",
      importUpdatedMeaning:
        "Vietiniai FCE duomenys šioje naršyklėje buvo atnaujinti iš importuotos atsarginės kopijos.",
      importAborted: "Importas atšauktas.",
      importNothing: "Nepavyko įrašyti raktų. Patikrinkite atsarginės kopijos failą.",
    },
    trend: {
      title: "Pokytis laikui bėgant (palyginti su jūsų baziniu lygiu)",
      subtitle: "Ši peržiūra rodo, kaip kiekviena patikra lyginama su jūsų įprastu veikimu laikui bėgant.",
      baselineHeader: "Jūsų bazinis lygis (ilgalaikis):",
      typical: {
        reaction: "Tipinis reakcijos laikas:",
        gonogo: "Tipinis atsako modelis:",
        divided: "Tipinis padalintos dėmesio veikla:",
        precision: "Tipinis tikslumo tikslumas:",
      },
      variation: "Tipinis dienos dieną kintamumas:",
      guideHelp: "Užtamsinta sritis rodo, kur jūsų rezultatai paprastai patenka, kai sąlygos panašios.",
      guideBand: "Vizualus gidavimo diapazonas:",
      noBaseline: "Dar nėra bazinio lygio — tendencija naudoja bazinio lygio sesijas.",
      noChecks: "Dar nėra patikros sesijų.",
      checkLabel: "Patikra",
      delta: "Skirtumas nuo bazinio lygio: {delta}",
      result: "Rezultatas:",
      footerNote: "Ši peržiūra vizualizuoja pokytį. Ji nesprendžia pasirengimo, tinkamumo ar leidimo.",
      ok: "Gerai",
      invalid: "NETINKAMA",
    },
    session: {
      chip: {
        avg: "Vidurkis",
        consistency: "Nuoseklumas (ši sesija)",
        trials: "Bandymai",
      },
      detail: {
        avg: "Vidurkis",
        consistency: "Nuoseklumas",
        trials: "Bandymai",
        compare: {
          line1: "Šis rezultatas skiriasi {delta} nuo jūsų bazinio lygio.",
          line2: {
            within: "Atsižvelgiant į tai, kiek jūs paprastai kintate, šis skirtumas vis tiek yra tipiškas jums.",
            slightly: "Atsižvelgiant į tai, kiek jūs paprastai kintate, šis skirtumas yra mažiau tipiškas, bet vis tiek yra pagrįstame diapazone.",
            significantly: "Atsižvelgiant į tai, kiek jūs paprastai kintate, šis skirtumas nėra tipiškas jums.",
          },
        },
      },
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
      empty: "Dar nėra istorijos.",
      noBaseline: "Nėra bazinio lygio",
      noBaselineForComparison: "Nėra bazinio lygio palyginimui.",
      clickToViewDetails: "Spustelėkite dėl detalių",
      showTrials: "Rodyti bandymus",
      hideTrials: "Slėpti bandymus",
      precision: {
        hit: "pataikymas",
        rt: "rt",
        err: "klaida",
        responded: "atsakė",
        misses: "praleistai",
        timeouts: "laiko baigtys",
        labels: {
          accuracy: "Tikslumas",
          consistency: "Nuoseklumas",
          execution: "Vykdymas",
          hits: "Pataikymai",
          misses: "Nepataikymai",
          timeouts: "Laiko pabaigos",
          avgRt: "Vidutinis RT",
          variability: "Kintamumas (SD)",
          sd: "SD",
        },
        comparison: {
          within: "Tikslumas normos ribose",
          slightly: "Tikslumas šiek tiek prastesnis nei bazė",
          significantly: "Tikslumas ženkliai prastesnis nei bazė",
        },
      },
      gonogo: {
        nogoTrials: "NO-GO bandymai",
        errors: {
          none: "Klaidos: nėra",
          present: "Klaidos: yra",
        },
      },
      divided: {
        flashes: "Blyksniai",
        flashesFormat: "Blyksniai: {answered}/{target}",
        target: "tikslas",
        answer: "atsakymas",
        error: "klaida",
        flashMismatch: "blyksnių neatitikimas (atsakyta {answered} iš {target})",
        errors: {
          none: "Klaidos: nėra",
          present: "Klaidos: yra",
          summaryNone: "Klaidos: nėra (nėra praleistų, slopinimo klaidų ar blyksnių klaidų)",
          summaryPresent: "Klaidos: yra — blyksnių neatitikimas (atsakyta {answered} iš {target}); praleistai: {misses}; slopinimo klaidos: {fa}",
        },
      },
      tags: {
        sleep: "miegas",
        stress: "stresas",
      },
      reason: "Priežastis: ",
      reasonText: {
        R1_INVALID_EXECUTION: "vykdymo klaida (nėra užregistruotų galiojančių atsakų).",
        R2_INSUFFICIENT_DATA: "nepakanka duomenų (per mažai galiojančių atsakų).",
        R3_EXCESS_NOISE: "per daug klaidų (per daug klaidingų startų arba slopinimo klaidų).",
      },
      precision: {
        notUsable: "Nebenaudojama",
        reasonPrefix: "Priežastis:",
        reasonGeneric: "per daug vykdymo klaidų, kad būtų galima patikimai išmatuoti tikslumą.",
      },
      falseAlarmsAbbr: "SK",
    },
    trialOutcome: {
      hit: "Pataikymas",
      go: "GO",
      miss: "Praleistas",
      false_alarm: "Slopinimo klaida",
      correct_reject: "Teisingai",
      false_start: "Klaidingas startas",
      timeout: "Laiko baigtis",
      unknown: "Nežinoma",
    },
    quality: {
      good: "Gera",
      mixed: "Mišri",
      not_usable: "Netinkama",
      label: "Kokybė",
      warning: {
        manyFalseStarts: "daug klaidingų startų",
        fewValidHits: "mažai galiojančių atsakų",
        note: " Pastaba: ši sesija turėjo {issues} — apsvarstykite pakartojimą dėl geresnės bazinės kokybės.",
        joiner: "ir",
      },
    },
    refusal: {
      R1_INVALID_EXECUTION: "Sesija netinkama: vykdymo klaida (nėra užregistruotų galiojančių atsakų).",
      R2_INSUFFICIENT_DATA: "Sesija netinkama: nepakanka duomenų (per mažai galiojančių atsakų).",
      R3_EXCESS_NOISE: "Sesija netinkama: per daug klaidų (per daug klaidingų startų arba slopinimo klaidų).",
    },
    remedy: {
      invalid_no_reaction: "Kitas žingsnis: paleiskite dar kartą ir reaguokite į GO signalą.",
      invalid_no_go: "Kitas žingsnis: paleiskite dar kartą ir reaguokite į GO bandymus.",
      invalid_missing_answer: "Kitas žingsnis: įveskite suskaičiuotų blyksnių skaičių prieš baigiant.",
      invalid_no_go_responses_divided: "Kitas žingsnis: paleiskite dar kartą ir reaguokite į GO bandymus.",
      invalid_precision_no_responses: "Kitas žingsnis: paleiskite dar kartą ir reaguokite į taikinius.",
      invalid_precision_insufficient: "Kitas žingsnis: paleiskite dar kartą ir atlikite pakankamai bakstelėjimų, kad būtų gauti naudojami duomenys.",
      invalid_precision_excess_noise: "Kitas žingsnis: trumpai pailsėkite ir paleiskite dar kartą su pastoviu įvedimu (venkite skubotų arba praleistų bakstelėjimų).",
      invalid_precision_exit: "Kitas žingsnis: paleiskite dar kartą ir užbaikite sesiją.",
      not_enough_baseline: "Kitas žingsnis: užbaikite daugiau bazinio lygio sesijų prieš naudojant Patikrą.",
      baseline_not_saved: "Kitas žingsnis: užbaikite galiojančią Bazinio lygio sesiją, kad pradėtumėte palyginimus.",
      baseline_not_saved_divided: "Kitas žingsnis: užbaikite galiojančią Bazinio lygio sesiją, kad pradėtumėte palyginimus.",
    },
    stimulus: {
      ready: "Pasiruošti…",
      reaction: {
        go: "SPAUSKITE!",
      },
      gonogo: {
        go: "GO (spauskite)",
        nogo: "NO-GO (nespauskite)",
        nogoTrials: "NO-GO bandymai",
        errors: {
          none: "Klaidos: nėra",
          present: "Klaidos: yra",
        },
      },
      divided: {
        go: "SPAUSKITE",
        nogo: "NESPAUSKITE",
        legend: "SPAUSKITE = atsakyti · NESPAUSKITE = laukti · Suskaičiuokite mėlynus blyksnius",
      },
    },
      precision: {
        feedback: {
          hit: "Pataikymas",
          miss: "Praleistas",
          timeout: "Laiko baigtis",
        },
        fullscreen: {
          unavailable: "Visas ekranas neprieinamas — veikia lange.",
          exited: "Visas ekranas uždarytas — tęsiame lange.",
        },
        invalid: "Tikslumo testas netinkamas.",
        noFullscreenNote: "Pastaba: Ši tikslumo sesija vyko be viso ekrano. Įvesties pastovumas gali būti mažesnis.",
      },
    op: {
      title: "Kas atsitinka po testo?",
      note: "Tik patariamasis. Tai nediagnozuoja ir nesprendžia pasirengimo.",
      tiers: {
        baseline_needed_title: "Reikalingas bazinis lygis",
        proceed_title: "Tęsti",
        proceed_caution_title: "Tęsti atsargiai",
        pause_retest_title: "Pristabdyti ir pakartoti testą",
        rest_retest_later_title: "Pailsėti ir pakartoti vėliau",
        not_usable_title: "Netinkama sesija",
      },
      common: {
        retest_now: "Pakartokite testą dabar ramioje, nuoseklioje aplinkoje.",
        retest_later: "Pailsėkite ir pakartokite vėliau, jei veikla išlieka žemiau bazinio lygio.",
        take_break: "Trumpai pailsėkite, tada pakartokite patikrą nuoseklioje aplinkoje.",
        reduce_load: "Apsvarstykite sumažinti intensyvumą ir pakartoti patikrą, jei reikia.",
        check_conditions: "Patikrinkite savo aplinką ir sąlygas prieš pakartojant testą.",
        consider_context: "Jei tai atitinka jūsų bazinį lygį, pagrįsta tęsti kaip planuota.",
        if_symptoms: "Jei jaučiate simptomus ar nuovargį, pirmiausia pailsėkite.",
      },
      byTest: {
        reaction: {
          oneLine: "Tai matuoja budrumą ir dėmesį. Klaidingi startai gali rodyti skubėjimą arba aplinkos problemas.",
          bullet1: "Budrumas ir dėmesys yra pagrindiniai reakcijos laiko veiksniai.",
          bullet2: "Klaidingi startai dažnai atspindi skubėjimą arba nenuoseklų aplinką.",
        },
        gonogo: {
          oneLine: "Tai matuoja slopinimo kontrolę. Slopinimo klaidos arba praleidimai gali rodyti dėmesio arba slopinimo problemas.",
          bullet1: "Slopinimo kontrolė padeda tinkamai valdyti atsakus.",
          bullet2: "Slopinimo klaidos arba praleidimai gali atspindėti dėmesio arba slopinimo iššūkius.",
        },
        divided: {
          oneLine: "Tai matuoja daugiafunkcinę apkrovą. Blyksnių klaidos arba slopinimo klaidos gali rodyti dėmesio talpos ribas.",
          bullet1: "Daugiafunkcinės užduotys reikalauja valdyti kelias dėmesio sroves.",
          bullet2: "Blyksnių klaidos arba slopinimo klaidos gali atspindėti dėmesio talpos ribas.",
        },
        precision: {
          oneLine: "Tai matuoja smulkųjį motorinį valdymą. Visas ekranas ir įrenginio nuoseklumas veikia rezultatus.",
          bullet1: "Smulkusis motorinis valdymas reikalauja pastovaus, nuoseklaus įvedimo.",
          bullet2: "Visas ekranas ir įrenginio nuoseklumas yra svarbūs patikimiems rezultatams.",
        },
      },
    },
  },
};

function t(path) {
  const parts = path.split(".");
  let value = I18N[currentLang];
  // Navigate through the object path
  for (const part of parts) {
    if (!value || typeof value !== "object") {
      // Path broken, try English fallback
      if (currentLang !== "en") {
        let fallbackValue = I18N.en;
        for (const fallbackPart of parts) {
          if (!fallbackValue || typeof fallbackValue !== "object") {
            // Fallback also broken, return human-readable fallback for common Precision keys
            return getPrecisionFallback(path);
          }
          fallbackValue = fallbackValue[fallbackPart];
        }
        if (fallbackValue !== undefined && typeof fallbackValue === "string") {
          return fallbackValue;
        }
      }
      return getPrecisionFallback(path);
    }
    value = value[part];
  }
  // Found value in current language
  if (value !== undefined && typeof value === "string") {
    return value;
  }
  // Value missing or wrong type, try English fallback
  if (currentLang !== "en") {
    let fallbackValue = I18N.en;
    for (const part of parts) {
      if (!fallbackValue || typeof fallbackValue !== "object") {
        return getPrecisionFallback(path);
      }
      fallbackValue = fallbackValue[part];
    }
    if (fallbackValue !== undefined && typeof fallbackValue === "string") {
      return fallbackValue;
    }
  }
  return getPrecisionFallback(path);
}

// Safe fallback for Precision labels to prevent raw keys from appearing
function getPrecisionFallback(path) {
  const fallbacks = {
    "history.precision.labels.accuracy": "Accuracy",
    "history.precision.labels.consistency": "Consistency",
    "history.precision.labels.execution": "Execution",
    "history.precision.labels.hits": "Hits",
    "history.precision.labels.misses": "Misses",
    "history.precision.labels.timeouts": "Timeouts",
    "history.precision.labels.avgRt": "Average RT",
    "history.precision.labels.variability": "Variability (SD)",
    "history.precision.labels.sd": "SD",
    "history.precision.responded": "responded",
    "history.precision.rt": "rt",
    "history.precision.misses": "misses",
    "history.precision.timeouts": "timeouts",
    "history.precision.err": "err",
  };
  return fallbacks[path] || path;
}

// Helper functions for bilingual trial and session strings
function getTrialProgress(current, total, completed) {
  if (currentLang === "no") return `Forsøk ${current} / ${total}`;
  if (currentLang === "lt") return `Bandymas ${current} / ${total}`;
  return `Trial ${current} / ${total}`;
}

function getSessionComplete(done, total) {
  if (currentLang === "no") return "Økt fullført";
  if (currentLang === "lt") return "Sesija baigta";
  return "Session complete";
}

function getCompletedSessionLabel() {
  if (currentLang === "no") return "Økt fullført";
  if (currentLang === "lt") return "Sesija baigta";
  return "Session complete";
}

function getBaselineSavedLabel() {
  if (currentLang === "no") return "Baseline-økt lagret";
  if (currentLang === "lt") return "Bazinio lygio sesija išsaugota";
  return "Baseline session saved";
}

function getTrainingCompleteLabel() {
  if (currentLang === "no") return "Treningsøkt fullført";
  if (currentLang === "lt") return "Treniruotės sesija baigta";
  return "Training session complete";
}

function getCheckCompleteLabel() {
  if (currentLang === "no") return "Funksjonssjekk fullført";
  if (currentLang === "lt") return "Funkcinė patikra baigta";
  return "Functional check complete";
}

function getStatusLabel() {
  if (currentLang === "no") return "Status";
  if (currentLang === "lt") return "Būsena";
  return "Status";
}

/** Structured summary rendering for system-generated strings only (no user-provided HTML). */
function renderStructuredSummary({ metricsLine = "", statusLine = "", systemLine = "" }) {
  if (!summary) return;
  summary.innerHTML = "";
  const addLine = (cls, text) => {
    if (!text) return;
    const el = document.createElement("div");
    el.className = cls;
    el.textContent = text;
    summary.appendChild(el);
  };
  addLine("summary-metrics", metricsLine);
  addLine("summary-status", statusLine);
  addLine("summary-system", systemLine);
  summary.style.display = "";
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
    if (testType === "precision") {
      if (entry.type === "hit") {
        const errN = Number.isFinite(entry.errN) ? entry.errN.toFixed(2) : "—";
        const rt = Number.isFinite(entry.rt) ? `${entry.rt} ms` : "—";
        return `Forsøk ${n}: treff — feil ${errN}, RT ${rt}`;
      } else if (entry.type === "miss") {
        const errN = Number.isFinite(entry.errN) ? entry.errN.toFixed(2) : "—";
        const rt = Number.isFinite(entry.rt) ? `${entry.rt} ms` : "—";
        return `Forsøk ${n}: bom — feil ${errN}, RT ${rt}`;
      } else if (entry.type === "timeout") {
        return `Forsøk ${n}: timeout (ingen respons)`;
      } else {
        return `Forsøk ${n}: ukjent`;
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
    if (testType === "precision") {
      if (entry.type === "hit") {
        const errN = Number.isFinite(entry.errN) ? entry.errN.toFixed(2) : "—";
        const rt = Number.isFinite(entry.rt) ? `${entry.rt} ms` : "—";
        return `Bandymas ${n}: pataikymas — klaida ${errN}, RT ${rt}`;
      } else if (entry.type === "miss") {
        const errN = Number.isFinite(entry.errN) ? entry.errN.toFixed(2) : "—";
        const rt = Number.isFinite(entry.rt) ? `${entry.rt} ms` : "—";
        return `Bandymas ${n}: praleistas — klaida ${errN}, RT ${rt}`;
      } else if (entry.type === "timeout") {
        return `Bandymas ${n}: laikas baigėsi (nėra atsako)`;
      } else {
        return `Bandymas ${n}: nežinomas`;
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
    if (testType === "precision") {
      if (entry.type === "hit") {
        const errN = Number.isFinite(entry.errN) ? entry.errN.toFixed(2) : "—";
        const rt = Number.isFinite(entry.rt) ? `${entry.rt} ms` : "—";
        return `Trial ${n}: hit — error ${errN}, RT ${rt}`;
      } else if (entry.type === "miss") {
        const errN = Number.isFinite(entry.errN) ? entry.errN.toFixed(2) : "—";
        const rt = Number.isFinite(entry.rt) ? `${entry.rt} ms` : "—";
        return `Trial ${n}: miss — error ${errN}, RT ${rt}`;
      } else if (entry.type === "timeout") {
        return `Trial ${n}: timeout (no response)`;
      } else {
        return `Trial ${n}: unknown`;
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

// Helper function to format quality label with optional note
// Strips leading "Note:" / "Merknad:" / "Pastaba:" prefixes to avoid duplication
// Returns formatted string with quality on one line and note on new line if present
function formatQualityWithOptionalNote(qualityLabel, qualityNote) {
  if (!qualityLabel) return "";
  
  const qualityLabelText = t("quality.label"); // "Quality" / "Kvalitet" / "Kokybė"
  
  if (!qualityNote) {
    return `${qualityLabelText}: ${qualityLabel}`;
  }
  
  // Strip leading "Note:" / "Merknad:" / "Pastaba:" prefixes (with optional leading whitespace)
  let cleanNote = qualityNote.trim();
  const noteLabel = t("ui.noteLabel");
  const notePrefixPattern = new RegExp(`^\\s*${noteLabel}:\\s*`, "i");
  if (notePrefixPattern.test(cleanNote)) {
    cleanNote = cleanNote.replace(notePrefixPattern, "").trim();
  }
  // Also check for English "Note:" in case of language mismatch
  if (/^\s*Note:\s*/i.test(cleanNote)) {
    cleanNote = cleanNote.replace(/^\s*Note:\s*/i, "").trim();
  }
  // Also check for Norwegian "Merknad:" (with optional leading space)
  if (/^\s*Merknad:\s*/i.test(cleanNote)) {
    cleanNote = cleanNote.replace(/^\s*Merknad:\s*/i, "").trim();
  }
  // Also check for Lithuanian "Pastaba:" (with optional leading space)
  if (/^\s*Pastaba:\s*/i.test(cleanNote)) {
    cleanNote = cleanNote.replace(/^\s*Pastaba:\s*/i, "").trim();
  }
  
  return `${qualityLabelText}: ${qualityLabel}\n${noteLabel}: ${cleanNote}`;
}

// Helper function to get reason-only text from refusal code (for history/details display)
// Returns just the reason clause without the "Session not usable:" prefix
// Falls back to full refusal message if reason-only key doesn't exist
function getRefusalReasonText(refusalCode) {
  if (!refusalCode) return "";
  
  // Try to get reason-only text from history.reasonText.<code>
  const reasonKey = `history.reasonText.${refusalCode}`;
  const reasonText = t(reasonKey);
  
  // If we got a valid translation (not the key itself), use it
  if (reasonText && reasonText !== reasonKey) {
    return reasonText;
  }
  
  // Fallback: return full refusal message (caller can parse if needed)
  return t(`refusal.${refusalCode}`);
}

function getBaselineSavedReaction(mean, sd, falseStarts, qualityNote, quality, deviceWarning) {
  const falseStartsText = falseStarts 
    ? (currentLang === "no" ? ` | Feilstarter: ${falseStarts}` : currentLang === "lt" ? ` | Klaidingi startai: ${falseStarts}` : ` | False starts: ${falseStarts}`)
    : "";
  const qualityLabel = quality ? t(`quality.${quality}`) : "";
  const qualityBlock = formatQualityWithOptionalNote(qualityLabel, qualityNote || "");
  const qualityText = qualityBlock ? ` | ${qualityBlock}` : "";
  const warningText = deviceWarning || "";
  if (currentLang === "no") {
    return `Baseline-økt lagret. Gjennomsnitt: ${mean.toFixed(0)} ms | SD: ${sd.toFixed(0)} ms${falseStartsText}${qualityText}${warningText}`;
  }
  if (currentLang === "lt") {
    return `Bazinio lygio sesija išsaugota. Vidurkis: ${mean.toFixed(0)} ms | SD: ${sd.toFixed(0)} ms${falseStartsText}${qualityText}${warningText}`;
  }
  return `Baseline session saved. Mean: ${mean.toFixed(0)} ms | SD: ${sd.toFixed(0)} ms${falseStartsText}${qualityText}${warningText}`;
}

function getBaselineSavedGoNoGo(mean, sd, misses, falseAlarms, falseStarts, qualityNote, quality, deviceWarning) {
  const falseStartsText = falseStarts
    ? (currentLang === "no" ? ` | Feilstarter: ${falseStarts}` : currentLang === "lt" ? ` | Klaidingi startai: ${falseStarts}` : ` | False starts: ${falseStarts}`)
    : "";
  const qualityLabel = quality ? t(`quality.${quality}`) : "";
  const qualityBlock = formatQualityWithOptionalNote(qualityLabel, qualityNote || "");
  const qualityText = qualityBlock ? ` | ${qualityBlock}` : "";
  const warningText = deviceWarning || "";
  if (currentLang === "no") {
    return `Baseline-økt lagret. GO-gjennomsnitt: ${mean.toFixed(0)} ms | SD: ${sd.toFixed(0)} ms | Bom: ${misses} | Inhibisjonsfeil: ${falseAlarms}${falseStartsText}${qualityText}${warningText}`;
  }
  if (currentLang === "lt") {
    return `Bazinio lygio sesija išsaugota. GO vidurkis: ${mean.toFixed(0)} ms | SD: ${sd.toFixed(0)} ms | Praleistai: ${misses} | Slopinimo klaidos: ${falseAlarms}${falseStartsText}${qualityText}${warningText}`;
  }
  return `Baseline session saved. GO mean: ${mean.toFixed(0)} ms | SD: ${sd.toFixed(0)} ms | Misses: ${misses} | Inhibitory errors: ${falseAlarms}${falseStartsText}${qualityText}${warningText}`;
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
  const qualityLabel = quality ? t(`quality.${quality}`) : "";
  const qualityBlock = formatQualityWithOptionalNote(qualityLabel, qualityNote || "");
  const qualityText = qualityBlock ? ` | ${qualityBlock}` : "";
  const warningText = deviceWarning || "";
  if (currentLang === "no") {
    return `Baseline-økt lagret. GO-gjennomsnitt: ${mean.toFixed(0)} ms | SD: ${sd.toFixed(0)} ms | Bom: ${misses} | Inhibisjonsfeil: ${falseAlarms}${flashText}${falseStartsText}${qualityText}${warningText}`;
  }
  if (currentLang === "lt") {
    return `Bazinio lygio sesija išsaugota. GO vidurkis: ${mean.toFixed(0)} ms | SD: ${sd.toFixed(0)} ms | Praleistai: ${misses} | Slopinimo klaidos: ${falseAlarms}${flashText}${falseStartsText}${qualityText}${warningText}`;
  }
  return `Baseline session saved. GO mean: ${mean.toFixed(0)} ms | SD: ${sd.toFixed(0)} ms | Misses: ${misses} | Inhibitory errors: ${falseAlarms}${flashText}${falseStartsText}${qualityText}${warningText}`;
}

function getBaselineSavedPrecision(meanErrN, sdErrN, meanRtMs, qualityNote, quality, deviceWarning, fullscreenNote) {
  const rtText = meanRtMs > 0 ? (currentLang === "no" ? ` | RT: ${meanRtMs.toFixed(0)} ms` : currentLang === "lt" ? ` | RT: ${meanRtMs.toFixed(0)} ms` : ` | RT: ${meanRtMs.toFixed(0)} ms`) : "";
  const qualityLabel = quality ? t(`quality.${quality}`) : "";
  const qualityBlock = formatQualityWithOptionalNote(qualityLabel, qualityNote || "");
  const qualityText = qualityBlock ? ` | ${qualityBlock}` : "";
  const warningText = deviceWarning || "";
  const fullscreenNoteText = fullscreenNote || "";
  if (currentLang === "no") {
    return `Baseline-økt lagret. Feil: ${meanErrN.toFixed(2)} | SD: ${sdErrN.toFixed(2)}${rtText}${qualityText}${warningText}${fullscreenNoteText}`;
  }
  if (currentLang === "lt") {
    return `Bazinio lygio sesija išsaugota. Klaida: ${meanErrN.toFixed(2)} | SD: ${sdErrN.toFixed(2)}${rtText}${qualityText}${warningText}${fullscreenNoteText}`;
  }
  return `Baseline session saved. Error: ${meanErrN.toFixed(2)} | SD: ${sdErrN.toFixed(2)}${rtText}${qualityText}${warningText}${fullscreenNoteText}`;
}

function getCheckReaction(mean, baselineMean, baselineSD, status, falseStarts, qualityNote, quality, deviceWarning) {
  const falseStartsText = falseStarts
    ? (currentLang === "no" ? ` | Feilstarter: ${falseStarts}` : currentLang === "lt" ? ` | Klaidingi startai: ${falseStarts}` : ` | False starts: ${falseStarts}`)
    : "";
  const qualityLabel = quality ? t(`quality.${quality}`) : "";
  const qualityBlock = formatQualityWithOptionalNote(qualityLabel, qualityNote || "");
  const qualityText = qualityBlock ? ` | ${qualityBlock}` : "";
  const warningText = deviceWarning || "";
  if (currentLang === "no") {
    return `Dagens gjennomsnitt: ${mean.toFixed(0)} ms | Baseline-gjennomsnitt: ${baselineMean.toFixed(0)} ms | Baseline SD: ${baselineSD.toFixed(0)} ms | Status: ${status}${falseStartsText}${qualityText}${warningText}`;
  }
  if (currentLang === "lt") {
    return `Šiandienos vidurkis: ${mean.toFixed(0)} ms | Bazinio lygio vidurkis: ${baselineMean.toFixed(0)} ms | Bazinio lygio SD: ${baselineSD.toFixed(0)} ms | Būsena: ${status}${falseStartsText}${qualityText}${warningText}`;
  }
  return `Today mean: ${mean.toFixed(0)} ms | Baseline mean: ${baselineMean.toFixed(0)} ms | Baseline SD: ${baselineSD.toFixed(0)} ms | Status: ${status}${falseStartsText}${qualityText}${warningText}`;
}

function getCheckGoNoGo(mean, baselineMean, baselineSD, status, misses, baselineMissAvg, falseAlarms, baselineFAAvg, falseStarts, qualityNote, quality, deviceWarning) {
  const falseStartsText = falseStarts
    ? (currentLang === "no" ? ` | Feilstarter: ${falseStarts}` : currentLang === "lt" ? ` | Klaidingi startai: ${falseStarts}` : ` | False starts: ${falseStarts}`)
    : "";
  const qualityLabel = quality ? t(`quality.${quality}`) : "";
  const qualityBlock = formatQualityWithOptionalNote(qualityLabel, qualityNote || "");
  const qualityText = qualityBlock ? ` | ${qualityBlock}` : "";
  const warningText = deviceWarning || "";
  if (currentLang === "no") {
    return `Dagens GO-gjennomsnitt: ${mean.toFixed(0)} ms | Baseline-gjennomsnitt: ${baselineMean.toFixed(0)} ms | Baseline SD: ${baselineSD.toFixed(0)} ms | Status: ${status} | Bom: ${misses} (baseline snitt ${baselineMissAvg.toFixed(1)}) | Inhibisjonsfeil: ${falseAlarms} (baseline snitt ${baselineFAAvg.toFixed(1)})${falseStartsText}${qualityText}${warningText}`;
  }
  if (currentLang === "lt") {
    return `Šiandienos GO vidurkis: ${mean.toFixed(0)} ms | Bazinio lygio vidurkis: ${baselineMean.toFixed(0)} ms | Bazinio lygio SD: ${baselineSD.toFixed(0)} ms | Būsena: ${status} | Praleistai: ${misses} (bazinio lygio vid. ${baselineMissAvg.toFixed(1)}) | Slopinimo klaidos: ${falseAlarms} (bazinio lygio vid. ${baselineFAAvg.toFixed(1)})${falseStartsText}${qualityText}${warningText}`;
  }
  return `Today GO mean: ${mean.toFixed(0)} ms | Baseline mean: ${baselineMean.toFixed(0)} ms | Baseline SD: ${baselineSD.toFixed(0)} ms | Status: ${status} | Misses: ${misses} (baseline avg ${baselineMissAvg.toFixed(1)}) | Inhibitory errors: ${falseAlarms} (baseline avg ${baselineFAAvg.toFixed(1)})${falseStartsText}${qualityText}${warningText}`;
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
  const qualityLabel = quality ? t(`quality.${quality}`) : "";
  const qualityBlock = formatQualityWithOptionalNote(qualityLabel, qualityNote || "");
  const qualityText = qualityBlock ? ` | ${qualityBlock}` : "";
  const warningText = deviceWarning || "";
  if (currentLang === "no") {
    return `Dagens GO-gjennomsnitt: ${mean.toFixed(0)} ms | Baseline-gjennomsnitt: ${baselineMean.toFixed(0)} ms | Baseline SD: ${baselineSD.toFixed(0)} ms | Status: ${status} | Inhibisjonsfeil-rate: ${(falseAlarmsRate * 100).toFixed(1)}% (baseline ${(baselineFARate * 100).toFixed(1)}%) | Flash-feil: ${flashAbsError} (baseline snitt ${baselineFlashError.toFixed(1)})${falseStartsText}${qualityText}${warningText}`;
  }
  if (currentLang === "lt") {
    return `Šiandienos GO vidurkis: ${mean.toFixed(0)} ms | Bazinio lygio vidurkis: ${baselineMean.toFixed(0)} ms | Bazinio lygio SD: ${baselineSD.toFixed(0)} ms | Būsena: ${status} | Slopinimo klaidų dažnis: ${(falseAlarmsRate * 100).toFixed(1)}% (bazinis lygis ${(baselineFARate * 100).toFixed(1)}%) | Blyksnių klaida: ${flashAbsError} (bazinio lygio vid. ${baselineFlashError.toFixed(1)})${falseStartsText}${qualityText}${warningText}`;
  }
  return `Today GO mean: ${mean.toFixed(0)} ms | Baseline mean: ${baselineMean.toFixed(0)} ms | Baseline SD: ${baselineSD.toFixed(0)} ms | Status: ${status} | False alarm rate: ${(falseAlarmsRate * 100).toFixed(1)}% (baseline ${(baselineFARate * 100).toFixed(1)}%) | Flash error: ${flashAbsError} (baseline avg ${baselineFlashError.toFixed(1)})${falseStartsText}${qualityText}${warningText}`;
}

function getCheckPrecision(meanErrN, baselineMeanErrN, baselineSDErrN, status, meanRtMs, quality, deviceWarning, fullscreenNote) {
  const qualityLabel = quality ? t(`quality.${quality}`) : "";
  const qualityBlock = formatQualityWithOptionalNote(qualityLabel, "");
  const qualityText = qualityBlock ? ` | ${qualityBlock}` : "";
  const warningText = deviceWarning || "";
  const fullscreenNoteText = fullscreenNote || "";
  const rtText = meanRtMs > 0 ? (currentLang === "no" ? ` | RT: ${meanRtMs.toFixed(0)} ms` : currentLang === "lt" ? ` | RT: ${meanRtMs.toFixed(0)} ms` : ` | RT: ${meanRtMs.toFixed(0)} ms`) : "";
  if (currentLang === "no") {
    return `Dagens feil: ${meanErrN.toFixed(2)} | Baseline-feil: ${baselineMeanErrN.toFixed(2)} | Baseline SD: ${baselineSDErrN.toFixed(2)} | Status: ${status}${rtText}${qualityText}${warningText}${fullscreenNoteText}`;
  }
  if (currentLang === "lt") {
    return `Šiandienos klaida: ${meanErrN.toFixed(2)} | Bazinio lygio klaida: ${baselineMeanErrN.toFixed(2)} | Bazinio lygio SD: ${baselineSDErrN.toFixed(2)} | Būsena: ${status}${rtText}${qualityText}${warningText}${fullscreenNoteText}`;
  }
  return `Today error: ${meanErrN.toFixed(2)} | Baseline error: ${baselineMeanErrN.toFixed(2)} | Baseline SD: ${baselineSDErrN.toFixed(2)} | Status: ${status}${rtText}${qualityText}${warningText}${fullscreenNoteText}`;
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
      const qualityLabelTraining = dataObj.quality ? t(`quality.${dataObj.quality}`) : "";
      const qualityBlockTraining = formatQualityWithOptionalNote(qualityLabelTraining, dataObj.qualityNote || "");
      const qualityTextTraining = qualityBlockTraining ? ` | ${qualityBlockTraining}` : "";
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
      renderStructuredSummary({
        metricsLine: `${currentLang === "no" ? "Gjennomsnitt" : currentLang === "lt" ? "Vidurkis" : "Mean"}: ${dataObj.mean.toFixed(0)} ms | ${t("history.sd")}: ${dataObj.sd.toFixed(0)} ms`,
        statusLine: dataObj.quality ? `${t("quality.label")}: ${t(`quality.${dataObj.quality}`)}` : "",
        systemLine: getBaselineSavedLabel(),
      });
      break;
      
    case "baseline_saved_gonogo":
      renderStructuredSummary({
        metricsLine: `${currentLang === "no" ? "Gjennomsnitt" : currentLang === "lt" ? "Vidurkis" : "Mean"}: ${dataObj.mean.toFixed(0)} ms | ${t("history.sd")}: ${dataObj.sd.toFixed(0)} ms`,
        statusLine: dataObj.quality ? `${t("quality.label")}: ${t(`quality.${dataObj.quality}`)}` : "",
        systemLine: getBaselineSavedLabel(),
      });
      break;
      
    case "baseline_saved_divided":
      renderStructuredSummary({
        metricsLine: `${currentLang === "no" ? "Gjennomsnitt" : currentLang === "lt" ? "Vidurkis" : "Mean"}: ${dataObj.mean.toFixed(0)} ms | ${t("history.sd")}: ${dataObj.sd.toFixed(0)} ms`,
        statusLine: dataObj.quality ? `${t("quality.label")}: ${t(`quality.${dataObj.quality}`)}` : "",
        systemLine: getBaselineSavedLabel(),
      });
      break;
      
    case "baseline_saved_precision":
      renderStructuredSummary({
        metricsLine: `${currentLang === "no" ? "Gjennomsnitt" : currentLang === "lt" ? "Vidurkis" : "Mean"}: ${dataObj.meanErrN.toFixed(2)} | ${t("history.sd")}: ${dataObj.sdErrN.toFixed(2)}`,
        statusLine: dataObj.quality ? `${t("quality.label")}: ${t(`quality.${dataObj.quality}`)}` : "",
        systemLine: getBaselineSavedLabel(),
      });
      break;
      
    case "check_reaction":
      renderStructuredSummary({
        metricsLine:
          `${currentLang === "no" ? "Gjennomsnitt" : currentLang === "lt" ? "Vidurkis" : "Mean"}: ${dataObj.mean.toFixed(0)} ms | ` +
          `${currentLang === "no" ? "Baseline-gjennomsnitt" : currentLang === "lt" ? "Bazinio lygio vidurkis" : "Baseline mean"}: ${dataObj.baselineMean.toFixed(0)} ms | ` +
          `${currentLang === "no" ? "Baseline SD" : currentLang === "lt" ? "Bazinio lygio SD" : "Baseline SD"}: ${dataObj.baselineSD.toFixed(0)} ms`,
        statusLine: `${getStatusLabel()}: ${dataObj.status || "—"}`,
        systemLine: getCheckCompleteLabel(),
      });
      break;
      
    case "check_gonogo":
      renderStructuredSummary({
        metricsLine:
          `${currentLang === "no" ? "GO " : ""}${currentLang === "no" ? "Gjennomsnitt" : currentLang === "lt" ? "Vidurkis" : "Mean"}: ${dataObj.mean.toFixed(0)} ms | ` +
          `${currentLang === "no" ? "Baseline-gjennomsnitt" : currentLang === "lt" ? "Bazinio lygio vidurkis" : "Baseline mean"}: ${dataObj.baselineMean.toFixed(0)} ms | ` +
          `${currentLang === "no" ? "Baseline SD" : currentLang === "lt" ? "Bazinio lygio SD" : "Baseline SD"}: ${dataObj.baselineSD.toFixed(0)} ms`,
        statusLine: `${getStatusLabel()}: ${dataObj.status || "—"}`,
        systemLine: getCheckCompleteLabel(),
      });
      break;
      
    case "check_divided":
      renderStructuredSummary({
        metricsLine:
          `${currentLang === "no" ? "GO " : ""}${currentLang === "no" ? "Gjennomsnitt" : currentLang === "lt" ? "Vidurkis" : "Mean"}: ${dataObj.mean.toFixed(0)} ms | ` +
          `${currentLang === "no" ? "Baseline-gjennomsnitt" : currentLang === "lt" ? "Bazinio lygio vidurkis" : "Baseline mean"}: ${dataObj.baselineMean.toFixed(0)} ms | ` +
          `${currentLang === "no" ? "Baseline SD" : currentLang === "lt" ? "Bazinio lygio SD" : "Baseline SD"}: ${dataObj.baselineSD.toFixed(0)} ms`,
        statusLine: `${getStatusLabel()}: ${dataObj.status || "—"}`,
        systemLine: getCheckCompleteLabel(),
      });
      break;
      
    case "check_precision":
      renderStructuredSummary({
        metricsLine:
          `${currentLang === "no" ? "Feil" : currentLang === "lt" ? "Klaida" : "Error"}: ${dataObj.meanErrN.toFixed(2)} | ` +
          `${currentLang === "no" ? "Baseline-feil" : currentLang === "lt" ? "Bazinio lygio klaida" : "Baseline error"}: ${dataObj.baselineMeanErrN.toFixed(2)} | ` +
          `${currentLang === "no" ? "Baseline SD" : currentLang === "lt" ? "Bazinio lygio SD" : "Baseline SD"}: ${dataObj.baselineSDErrN.toFixed(2)}`,
        statusLine: `${getStatusLabel()}: ${dataObj.status || "—"}`,
        systemLine: getCheckCompleteLabel(),
      });
      break;
      
    case "invalid_no_reaction":
      const refusalMsg1 = dataObj.refusalCode ? t(`refusal.${dataObj.refusalCode}`) : getSessionInvalidNoReaction();
      const remedyText1 = ` | ${t("remedy.invalid_no_reaction")}`;
      const qualityLabel1 = dataObj.quality ? t(`quality.${dataObj.quality}`) : "";
      const qualityBlock1 = formatQualityWithOptionalNote(qualityLabel1, "");
      const qualityText1 = qualityBlock1 ? ` | ${qualityBlock1}` : "";
      const summaryText1 = refusalMsg1 + remedyText1 + qualityText1;
      summary.textContent = summaryText1;
      // Ensure summary is visible (CSS :empty rule might hide it if text is empty)
      if (summaryText1) {
        summary.style.display = "";
      }
      break;
      
    case "invalid_no_go":
      const refusalMsg2 = dataObj.refusalCode ? t(`refusal.${dataObj.refusalCode}`) : getSessionInvalidNoGo();
      const remedyText2 = ` | ${t("remedy.invalid_no_go")}`;
      const qualityLabel2 = dataObj.quality ? t(`quality.${dataObj.quality}`) : "";
      const qualityBlock2 = formatQualityWithOptionalNote(qualityLabel2, "");
      const qualityText2 = qualityBlock2 ? ` | ${qualityBlock2}` : "";
      summary.textContent = refusalMsg2 + remedyText2 + qualityText2;
      break;
      
    case "not_enough_baseline":
      const refusalMsg3 = dataObj.refusalCode ? t(`refusal.${dataObj.refusalCode}`) : getNotEnoughBaseline();
      const remedyText3 = ` | ${t("remedy.not_enough_baseline")}`;
      const qualityLabel3 = dataObj.quality ? t(`quality.${dataObj.quality}`) : "";
      const qualityBlock3 = formatQualityWithOptionalNote(qualityLabel3, "");
      const qualityText3 = qualityBlock3 ? ` | ${qualityBlock3}` : "";
      summary.textContent = refusalMsg3 + remedyText3 + qualityText3;
      break;
      
    case "baseline_not_saved":
      const refusalMsg4 = dataObj.refusalCode ? t(`refusal.${dataObj.refusalCode}`) : getBaselineNotSaved();
      const remedyText4 = ` | ${t("remedy.baseline_not_saved")}`;
      const qualityLabel4 = dataObj.quality ? t(`quality.${dataObj.quality}`) : "";
      const qualityBlock4 = formatQualityWithOptionalNote(qualityLabel4, "");
      const qualityText4 = qualityBlock4 ? ` | ${qualityBlock4}` : "";
      summary.textContent = refusalMsg4 + remedyText4 + qualityText4;
      break;
      
    case "baseline_not_saved_divided":
      const flashInfo2 = getFlashInfoString(dataObj.flashTarget, dataObj.flashUser, dataObj.flashError);
      const refusalMsg5 = dataObj.refusalCode ? t(`refusal.${dataObj.refusalCode}`) : getBaselineNotSavedDivided();
      const remedyText5 = ` | ${t("remedy.baseline_not_saved_divided")}`;
      const qualityLabel5 = dataObj.quality ? t(`quality.${dataObj.quality}`) : "";
      const qualityBlock5 = formatQualityWithOptionalNote(qualityLabel5, "");
      const qualityText5 = qualityBlock5 ? ` | ${qualityBlock5}` : "";
      summary.textContent = refusalMsg5 + flashInfo2 + remedyText5 + qualityText5;
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
      const remedyText6 = ` | ${t("remedy.invalid_missing_answer")}`;
      const qualityLabel6 = dataObj.quality ? t(`quality.${dataObj.quality}`) : "";
      const qualityBlock6 = formatQualityWithOptionalNote(qualityLabel6, "");
      const qualityText6 = qualityBlock6 ? ` | ${qualityBlock6}` : "";
      summary.textContent = refusalMsg6 + remedyText6 + qualityText6;
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
      const remedyText7 = ` | ${t("remedy.invalid_no_go_responses_divided")}`;
      const qualityLabel7 = dataObj.quality ? t(`quality.${dataObj.quality}`) : "";
      const qualityBlock7 = formatQualityWithOptionalNote(qualityLabel7, "");
      const qualityText7 = qualityBlock7 ? ` | ${qualityBlock7}` : "";
      summary.textContent = refusalMsg7 + remedyText7 + qualityText7;
      break;
      
    case "invalid_precision_no_responses":
    case "invalid_precision_insufficient":
    case "invalid_precision_excess_noise":
    case "invalid_precision_exit":
      let refusalMsg8 = "";
      if (dataObj.refusalCode) {
        refusalMsg8 = t(`refusal.${dataObj.refusalCode}`);
      } else {
        refusalMsg8 = t("precision.invalid");
      }
      // Determine remedy key based on case type
      let remedyKey8 = "invalid_precision_exit";
      if (type === "invalid_precision_no_responses") {
        remedyKey8 = "invalid_precision_no_responses";
      } else if (type === "invalid_precision_insufficient") {
        remedyKey8 = "invalid_precision_insufficient";
      } else if (type === "invalid_precision_excess_noise") {
        remedyKey8 = "invalid_precision_excess_noise";
      }
      const remedyText8 = ` | ${t(`remedy.${remedyKey8}`)}`;
      const qualityLabel8 = dataObj.quality ? t(`quality.${dataObj.quality}`) : "";
      const qualityBlock8 = formatQualityWithOptionalNote(qualityLabel8, "");
      const qualityText8 = qualityBlock8 ? ` | ${qualityBlock8}` : "";
      summary.textContent = refusalMsg8 + remedyText8 + qualityText8;
      break;
      
    default:
      // Unknown type, just set text directly
      break;
  }
  
  // Ensure summary is visible after setting text (CSS :empty rule might hide it if text was previously empty)
  if (summary.textContent && summary.textContent.trim()) {
    summary.style.display = "";
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

// Compute advice tier from session outcomes (pure mapping, no new decisions)
function computeAdviceTier({ mode, refusalCode, statusText, summaryType }) {
  // refusalCode present => not_usable
  if (refusalCode) return "not_usable";

  // If summary type is "not_enough_baseline" => baseline_needed
  if (summaryType === "not_enough_baseline") return "baseline_needed";

  // For baseline mode: "proceed" but remind to collect multiple baselines
  if (mode === "baseline") return "proceed";

  // For training mode: keep it minimal (do not imply readiness). Use proceed_caution.
  if (mode === "training") return "proceed_caution";

  // For check mode: map existing status strings:
  // status.within => proceed
  // status.slightly => proceed_caution
  // status.significantly => pause_retest
  if (statusText === t("status.within")) return "proceed";
  if (statusText === t("status.slightly")) return "proceed_caution";
  if (statusText === t("status.significantly")) return "pause_retest";

  return "proceed_caution";
}

function setOperationalAdvice(adviceObj) {
  const wrap = document.getElementById("opAdvice");
  const body = document.getElementById("opAdviceBody");
  if (!wrap || !body) return;

  lastAdviceData = adviceObj;

  if (!adviceObj) {
    wrap.classList.add("hidden");
    body.innerHTML = "";
    return;
  }

  // Build HTML (simple, safe)
  // Use a short title + one-line + bullets
  // Avoid rendering raw user input as HTML; only use your own strings and numbers.
  const { tier, testType, mode, quality, deviceMismatch, extra } = adviceObj;

  const tierTitleKey = `op.tiers.${tier}_title`;
  const tierTitle = t(tierTitleKey);

  const oneLine = t(`op.byTest.${testType}.oneLine`);
  const b1 = t(`op.byTest.${testType}.bullet1`);
  const b2 = t(`op.byTest.${testType}.bullet2`);

  // Common actions by tier (map tier -> 2–3 common items)
  const items = [];
  if (tier === "baseline_needed") {
    items.push(t("op.common.check_conditions"));
  } else if (tier === "proceed") {
    items.push(t("op.common.consider_context"));
  } else if (tier === "proceed_caution") {
    items.push(t("op.common.reduce_load"), t("op.common.consider_context"));
  } else if (tier === "pause_retest") {
    items.push(t("op.common.take_break"), t("op.common.retest_now"));
  } else if (tier === "rest_retest_later") {
    items.push(t("op.common.retest_later"), t("op.common.if_symptoms"));
  } else if (tier === "not_usable") {
    items.push(t("op.common.check_conditions"), t("op.common.retest_now"));
  }

  // Optional warnings
  const warnParts = [];
  if (quality && quality !== "good") warnParts.push(`${t("quality.label")}: ${t(`quality.${quality}`)}`);
  if (deviceMismatch) warnParts.push(currentLang === "no"
    ? "Enhetsvarsel: sammenlignbarhet kan være lavere."
    : currentLang === "lt"
      ? "Įrenginio įspėjimas: palyginamumas gali būti mažesnis."
      : "Device warning: comparability may be lower."
  );

  const warnLine = warnParts.length ? `<div class="note">${warnParts.join(" · ")}</div>` : "";

  body.innerHTML = `
    <div><strong>${tierTitle}</strong></div>
    <div class="muted" style="margin-top:6px;">${oneLine}</div>
    <ul>
      <li>${b1}</li>
      <li>${b2}</li>
      ${items.map(x => `<li>${x}</li>`).join("")}
    </ul>
    ${warnLine}
  `;

  wrap.classList.remove("hidden");
}

function regenerateOperationalAdvice() {
  if (!lastAdviceData) return;
  setOperationalAdvice(lastAdviceData);
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

  // 7b) Update operational advice if it exists
  regenerateOperationalAdvice();

  // 8) Re-render history if visible
  if (historyListEl) {
    renderHistory();
  }
  updateBaselineInfo();
  renderLastFullBackupLine();

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
      { value: "divided", text: t("ui.testType.divided") },
      { value: "precision", text: t("ui.testType.precision") }
    ], "reaction");
  }

  // Update historyTest select options
  const historyTestSelect = document.getElementById("historyTest");
  if (historyTestSelect) {
    populateSelectOptions(historyTestSelect, [
      { value: "reaction", text: t("ui.testType.reaction") },
      { value: "gonogo", text: t("ui.testType.gonogo") },
      { value: "divided", text: t("ui.testType.divided") },
      { value: "precision", text: t("ui.testType.precision") }
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
      divided: "Divided Attention: Track the main task while responding to brief flashes. Misses and false alarms are recorded.",
      precision: "Precision: Tap the center of each target as accurately as you can. Accuracy matters more than speed."
    },
    no: {
      reaction: "Reaksjonstid: Vent på signalet, og responder så raskt som mulig. Tidlige trykk teller som feilstart.",
      gonogo: "Go / No-Go: Responder kun på GO-signalet. Ikke gjør noe på NO-GO. Feil respons teller som feil.",
      divided: "Delt oppmerksomhet: Følg hovedoppgaven samtidig som du reagerer på korte flash. Bom og feil registreres.",
      precision: "Presisjon: Trykk på sentrum av hvert mål så nøyaktig som mulig. Nøyaktighet teller mer enn hastighet."
    },
    lt: {
      reaction: "Reakcijos laikas: Laukite signalo ir reaguokite kuo greičiau. Per ankstyvi paspaudimai laikomi klaidingu startu.",
      gonogo: "Go / No-Go: Reaguokite tik į GO signalą. Į NO-GO nereaguokite. Neteisingi veiksmai laikomi klaidomis.",
      divided: "Dalyta dėmesio užduotis: Atlikite pagrindinę užduotį ir reaguokite į trumpus blyksnius. Praleidimai ir klaidingi atsakai registruojami.",
      precision: "Tikslumas: Bakstelėkite kiekvieno taikinio centrą kuo tiksliau. Tikslumas svarbesnis nei greitis."
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
      updateTaskHint();
      const topbar = document.querySelector(".topbar");
      const topbarHeight = topbar ? topbar.offsetHeight : 64;
      const scrollToEl = (el) => {
        if (!el) return false;
        const targetY = el.getBoundingClientRect().top + window.pageYOffset - topbarHeight - 20;
        window.scrollTo({ top: targetY, behavior: "smooth" });
        return true;
      };
      // Prefer the top instruction block (first-use workflow text); task hint is often hidden until a test is active
      const instructionEl = document.getElementById("instruction");
      const taskHintPanel = document.getElementById("taskHintPanel");
      let scrolled = scrollToEl(instructionEl);
      if (!scrolled && taskHintPanel && taskHintPanel.offsetParent !== null) {
        scrolled = scrollToEl(taskHintPanel);
      }
      if (!scrolled) {
        const actionRow = document.querySelector("#instrument .action-row") || document.querySelector(".action-row");
        scrollToEl(actionRow);
      }
      setTimeout(() => {
        const firstActionBtn = document.querySelector("#instrument .action-row button");
        if (firstActionBtn) firstActionBtn.focus();
      }, 300);
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
const baselineGuidance = document.getElementById("baselineGuidance");
const baselineStatusInfo = document.getElementById("baselineStatusInfo");
const baselineLastUpdateInfo = document.getElementById("baselineLastUpdateInfo");
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

// Precision test elements
const precisionPrepOverlay = document.getElementById("precisionPrepOverlay");
const precisionPrepStartBtn = document.getElementById("precisionPrepStartBtn");
const precisionPrepCancelBtn = document.getElementById("precisionPrepCancelBtn");
const precisionStage = document.getElementById("precisionStage");
const precisionTarget = document.getElementById("precisionTarget");
const precisionCounter = document.getElementById("precisionTrialCounter");
const precisionFeedback = document.getElementById("precisionFeedback");
const precisionNotice = document.getElementById("precisionFullscreenNotice");
const precisionExitBtn = document.getElementById("exitPrecisionTestBtn");

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
let lastAdviceData = null;

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
function switchView(target, options) {
  if (!target) return;
  const forceHistory =
    options && typeof options === "object" && options.forceHistory === true;

  // Prevent switching to history if no data exists (post-import restore may force)
  if (target === "history" && !hasHistory() && !forceHistory) {
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

// Precision test state
let precisionTargetRadius = 0;
let precisionTargetX = 0;
let precisionTargetY = 0;
let precisionTrialStartTime = null;
let precisionTrialActive = false;
let precisionTrialResolved = false; // Per-trial resolution guard: prevents late taps after timeout
let precisionResizeHandler = null;
let precisionKeyHandler = null;
let precisionShouldResetOnFullscreenExit = false;
let precisionEscPressTime = 0; // Timestamp of last Esc press
let precisionResetIntent = false; // Flag indicating Esc was pressed with intent to reset
let precisionResetRan = false; // Guard to prevent double-reset
let precisionGlobalEscDetected = false; // Global Esc detection (set before fullscreen change)
let precisionGlobalEscDetector = null; // Reference to global Esc detector handler
let precisionPointerHandler = null; // Reference to pointerdown handler for cleanup
let precisionTrialTimeoutId = null;
let precisionFullscreenElement = null;
let precisionIsFullscreen = false;
let precisionFullscreenAchieved = false; // Track if fullscreen was actually achieved for this session

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
  precision: {
    maxTrials: 40,
    windowMs: 3000,
  },
};

startBaselineBtn.addEventListener("click", () => {
    if (inSession) return;
    // Mode is determined by the action button clicked - this is the source of truth
    mode = "baseline";
    if (testType.value === "precision") {
      // Set default to 25 for Baseline mode (or if currently set to Check default of 15)
      const currentValue = trialCountInput.value.trim();
      if (!currentValue || currentValue === "15") {
        trialCountInput.value = 25;
      }
      // Ensure value respects precision clamp (10-40)
      const clamped = clampInt(parseInt(trialCountInput.value, 10), 10, 40);
      trialCountInput.value = clamped;
      showPrecisionPrep();
    } else {
      beginSession();
    }
  });
  
  startCheckBtn.addEventListener("click", () => {
    if (inSession) return;
    // Mode is determined by the action button clicked - this is the source of truth
    mode = "check";
    if (testType.value === "precision") {
      // Set default to 15 for Check mode
      const currentValue = trialCountInput.value.trim();
      if (!currentValue || currentValue === "25") {
        trialCountInput.value = 15;
      }
      // Ensure value respects precision clamp (10-40)
      const clamped = clampInt(parseInt(trialCountInput.value, 10), 10, 40);
      trialCountInput.value = clamped;
      showPrecisionPrep();
    } else {
      beginSession();
    }
  });

  if (startTrainingBtn) {
    startTrainingBtn.addEventListener("click", () => {
      if (inSession) return;
      // Mode is determined by the action button clicked - this is the source of truth
      mode = "training";
      if (testType.value === "precision") {
        // Set default to 15 for Training mode
        const currentValue = trialCountInput.value.trim();
        if (!currentValue || currentValue === "25") {
          trialCountInput.value = 15;
        }
        // Ensure value respects precision clamp (10-40)
        const clamped = clampInt(parseInt(trialCountInput.value, 10), 10, 40);
        trialCountInput.value = clamped;
        showPrecisionPrep();
      } else {
        beginSession();
      }
    });
  }

  function baselineKey() {
    return baselineKeyFor(testType.value);
  }

  // Precision prep overlay handlers
  function showPrecisionPrep() {
    if (!precisionPrepOverlay) return;
    precisionPrepOverlay.classList.remove("hidden");
    document.body.classList.add("precision-prep-open");
    document.documentElement.classList.add("precision-prep-open");
    if (precisionPrepStartBtn) precisionPrepStartBtn.focus();
  }

  function hidePrecisionPrep() {
    if (!precisionPrepOverlay) return;
    precisionPrepOverlay.classList.add("hidden");
    document.body.classList.remove("precision-prep-open");
    document.documentElement.classList.remove("precision-prep-open");
  }

  if (precisionPrepStartBtn) {
    precisionPrepStartBtn.addEventListener("click", () => {
      hidePrecisionPrep();
      startPrecisionSession(mode);
    });
  }

  if (precisionPrepCancelBtn) {
    precisionPrepCancelBtn.addEventListener("click", () => {
      hidePrecisionPrep();
      mode = null;
    });
  }

  // Precision test session management
  function startPrecisionSession(sessionMode) {
    const config = TEST_CONFIG.precision;
    const maxTrials = config.maxTrials || 40;
    totalTrials = clampInt(parseInt(trialCountInput.value, 10), 10, 40);
    trialCountInput.value = totalTrials;

    // Reset precision-specific state
    precisionTrialActive = false;
    precisionTrialResolved = false;
    precisionTrialStartTime = null;
    precisionTargetRadius = 0;
    precisionTargetX = 0;
    precisionTargetY = 0;
    precisionShouldResetOnFullscreenExit = false; // Reset flag
    precisionEscPressTime = 0; // Reset Esc timestamp
    precisionResetIntent = false; // Reset intent flag
    precisionResetRan = false; // Reset guard flag
    precisionGlobalEscDetected = false; // Reset global Esc flag
    precisionFullscreenAchieved = false; // Reset fullscreen achievement tracking
    if (precisionTrialTimeoutId) {
      clearTimeout(precisionTrialTimeoutId);
      precisionTrialTimeoutId = null;
    }
    // Clear target state - remove class and reset dimensions
    if (precisionTarget) {
      precisionTarget.classList.remove("show");
      precisionTarget.style.width = "";
      precisionTarget.style.height = "";
      precisionTarget.style.left = "";
      precisionTarget.style.top = "";
    }

    inSession = true;
    isRunActive = true;
    trialIndex = 0;
    results = [];

    trialList.innerHTML = "";
    summary.textContent = "";
    if (trialList) {
      trialList.classList.remove("session-ended");
    }

    trialCountInput.disabled = true;
    startBaselineBtn.disabled = true;
    startCheckBtn.disabled = true;
    if (startTrainingBtn) startTrainingBtn.disabled = true;
    resetBtn.style.display = "";

    const contextPanel = document.getElementById("contextPanel");
    if (contextPanel) {
      contextPanel.classList.add("is-hidden");
    }

    // Show precision stage
    if (precisionStage) {
      precisionStage.classList.remove("hidden");
      document.body.classList.add("precision-open");
    }

    // Try fullscreen (precisionFullscreenAchieved already reset in startPrecisionSession)
    if (precisionStage) {
      const fullscreenPromise = precisionStage.requestFullscreen 
        ? precisionStage.requestFullscreen()
        : precisionStage.webkitRequestFullscreen
        ? precisionStage.webkitRequestFullscreen()
        : precisionStage.mozRequestFullScreen
        ? precisionStage.mozRequestFullScreen()
        : precisionStage.msRequestFullscreen
        ? precisionStage.msRequestFullscreen()
        : Promise.reject(new Error("Fullscreen not supported"));
      
      fullscreenPromise.then(() => {
        precisionIsFullscreen = true;
        precisionFullscreenElement = precisionStage;
        precisionFullscreenAchieved = true; // Mark as achieved when promise resolves
        updatePrecisionNotice("");
      }).catch(() => {
        precisionIsFullscreen = false;
        precisionFullscreenAchieved = false; // Mark as not achieved on failure
        updatePrecisionNotice(t("precision.fullscreen.unavailable"));
      });
    } else {
      precisionIsFullscreen = false;
      precisionFullscreenAchieved = false; // Mark as not achieved if stage missing
      updatePrecisionNotice(t("precision.fullscreen.unavailable"));
    }

    // Listen for fullscreen changes
    document.addEventListener("fullscreenchange", handlePrecisionFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handlePrecisionFullscreenChange);
    document.addEventListener("mozfullscreenchange", handlePrecisionFullscreenChange);
    document.addEventListener("MSFullscreenChange", handlePrecisionFullscreenChange);

    // Listen for resize/orientation changes
    precisionResizeHandler = () => handlePrecisionResize();
    window.addEventListener("resize", precisionResizeHandler);
    window.addEventListener("orientationchange", precisionResizeHandler);

    // Global Esc detector - runs before precision-specific handler
    // This catches Esc even if fullscreen change fires before our handler
    precisionGlobalEscDetector = (e) => {
      if (e.key === "Escape" && inSession && testType.value === "precision") {
        // Set global flag immediately - this happens before fullscreen change event
        precisionGlobalEscDetected = true;
        precisionEscPressTime = performance.now();
      }
    };
    document.addEventListener("keydown", precisionGlobalEscDetector, true); // Capture phase - runs first
    
    // Listen for Esc key to reset (like reset button in other tests)
    // Use capture phase and set flags IMMEDIATELY before browser processes Esc
    precisionKeyHandler = (e) => {
      if (e.key === "Escape" && inSession && testType.value === "precision") {
        // Set flags immediately - before preventDefault, before anything else
        // This ensures fullscreen change handler sees them
        precisionResetIntent = true;
        precisionResetRan = false;
        precisionEscPressTime = performance.now();
        precisionShouldResetOnFullscreenExit = true;
        precisionGlobalEscDetected = true;
        
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        // Check if fullscreen is active using reliable detection
        const wasFullscreen = isAnyFullscreenActive();
        
        if (wasFullscreen) {
          // Browser will exit fullscreen automatically on Esc - we can't prevent it
          // The fullscreen change handler will detect our flags and reset
          // Set backup timers in case fullscreen change handler doesn't fire
          setTimeout(() => {
            if (precisionResetIntent && !precisionResetRan && testType.value === "precision") {
              runPrecisionResetOnce();
            }
          }, 10);
          
          setTimeout(() => {
            if (precisionResetIntent && !precisionResetRan && testType.value === "precision") {
              runPrecisionResetOnce();
            }
          }, 100);
          
          setTimeout(() => {
            if (precisionResetIntent && !precisionResetRan && testType.value === "precision") {
              runPrecisionResetOnce();
            }
          }, 300);
        } else {
          // Not in fullscreen, reset immediately
          runPrecisionResetOnce();
        }
      }
    };
    document.addEventListener("keydown", precisionKeyHandler, true); // Capture phase - runs before other handlers

    // Exit button handler - reset like Esc, don't save as invalid
    if (precisionExitBtn) {
      precisionExitBtn.onclick = () => {
        // Just reset - hardReset will clean up fullscreen
        hardReset();
      };
    }

    // Precision stage pointerdown handler (more responsive than click)
    // Use event delegation on document to avoid issues with DOM changes (e.g., language changes)
    // Remove any existing handler first to prevent duplicates
    if (precisionPointerHandler) {
      document.removeEventListener("pointerdown", precisionPointerHandler, { passive: false, capture: true });
      precisionPointerHandler = null;
    }
    
    // Helper: Normalize input coordinates to CSS pixels
    // Prefers Pointer Events API, falls back to touch/mouse events
    // Returns { x, y } in CSS pixels relative to target element
    // CSS pixels are independent of devicePixelRatio, ensuring consistent hit radius
    function getInputPoint(e, targetElement) {
      if (!targetElement) return null;
      
      const rect = targetElement.getBoundingClientRect();
      let clientX, clientY;
      
      // Prefer Pointer Events API (works for mouse, touch, pen)
      if (e.pointerId !== undefined && typeof e.clientX === "number") {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      // Fallback to touch events
      else if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
      // Fallback to mouse events
      else if (typeof e.clientX === "number") {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      else {
        return null;
      }
      
      // Convert to CSS pixels relative to target element
      // getBoundingClientRect() already returns CSS pixels, so no DPR conversion needed
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }
    
    // Precision stage pointerdown handler (stored for cleanup)
    precisionPointerHandler = (e) => {
      // Only handle events on the precision stage
      const stage = document.getElementById("precisionStage");
      if (!stage || (!stage.contains(e.target) && e.target !== stage)) return;
      
      if (!inSession || testType.value !== "precision") return;
      if (trialIndex > totalTrials) return;
      if (!precisionTrialStartTime) return;
      if (!precisionTrialActive) return; // Guard against double submissions
      if (precisionTrialResolved) return; // Guard: ignore late taps after timeout

      // Prevent default to avoid any browser behaviors
      e.preventDefault();
      e.stopPropagation();

      // Get fresh stage reference
      const currentStage = document.getElementById("precisionStage");
      if (!currentStage) return;

      // Get pointer position in CSS pixels (normalized for DPR/zoom)
      const point = getInputPoint(e, currentStage);
      if (!point) return;
      const pointerX = point.x;
      const pointerY = point.y;

      // Calculate distance from target center (both in CSS pixels)
      // precisionTargetRadius and coordinates are in CSS pixels, ensuring consistent hit radius
      const distPx = Math.hypot(pointerX - precisionTargetX, pointerY - precisionTargetY);
      const errN = distPx / precisionTargetRadius;
      const errNClamped = Math.min(errN, 3);
      const outcome = errN <= 1.0 ? "hit" : "miss";
      const rt = Math.round(performance.now() - precisionTrialStartTime);

      // Mark trial as resolved and inactive immediately to prevent double submissions and late taps
      precisionTrialActive = false;
      precisionTrialResolved = true;

      // Clear timeout safely
      if (precisionTrialTimeoutId) {
        clearTimeout(precisionTrialTimeoutId);
        precisionTrialTimeoutId = null;
      }

      // Record result
      recordResult({ type: outcome, rt, errN: errNClamped });

      // Show feedback
      showPrecisionFeedback(outcome);

      // Hide target with smooth fade
      if (precisionTarget) {
        precisionTarget.classList.remove("show");
      }

      precisionTrialStartTime = null;

      // Next trial after delay
      setTimeout(() => {
        if (inSession && testType.value === "precision") {
          nextPrecisionTrial();
        }
      }, 200);
    };
    
    // Attach handler to document using event delegation - this survives DOM changes
    document.addEventListener("pointerdown", precisionPointerHandler, { passive: false, capture: true });

    // Start first trial
    setTimeout(() => {
      nextPrecisionTrial();
    }, 500);
  }

  // Helper to detect fullscreen reliably
  function isAnyFullscreenActive() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
  }

  // Helper to run reset once (prevents double-reset)
  function runPrecisionResetOnce() {
    if (precisionResetRan) return;
    precisionResetRan = true;
    precisionResetIntent = false;
    precisionShouldResetOnFullscreenExit = false;
    precisionEscPressTime = 0;
    hardReset();
  }

  function handlePrecisionFullscreenChange() {
    const isFullscreen = isAnyFullscreenActive();
    if (!isFullscreen && precisionIsFullscreen) {
      precisionIsFullscreen = false;
      
      // Check if Esc was pressed - use global flag OR recent timestamp
      const escWasRecent = precisionEscPressTime > 0 && (performance.now() - precisionEscPressTime) < 500;
      
      // If Esc was pressed (any indicator), reset immediately
      if (precisionResetIntent || precisionShouldResetOnFullscreenExit || precisionGlobalEscDetected || escWasRecent) {
        precisionGlobalEscDetected = false;
        runPrecisionResetOnce();
        return;
      }
      
      // If session is no longer active, something else already reset - do nothing
      if (!inSession || testType.value !== "precision") {
        return;
      }
      
      // If fullscreen exits during active precision session, it's likely Esc was pressed
      // Use a short delay to let Esc handler set flags if it's running
      setTimeout(() => {
        // Re-check flags after a brief delay (Esc handler should have set them by now)
        const escWasRecentNow = precisionEscPressTime > 0 && (performance.now() - precisionEscPressTime) < 1000;
        if (precisionResetIntent || precisionShouldResetOnFullscreenExit || precisionGlobalEscDetected || escWasRecentNow) {
          precisionGlobalEscDetected = false;
          runPrecisionResetOnce();
          return;
        }
        // If still in session after delay, assume it was Esc and reset
        if (inSession && testType.value === "precision") {
          runPrecisionResetOnce();
        }
      }, 50);
    }
  }

  function updatePrecisionNotice(text) {
    if (precisionNotice) {
      precisionNotice.textContent = text || "";
      // Only use class, don't set inline display (CSS handles it)
      if (text) {
        precisionNotice.classList.remove("hidden");
      } else {
        precisionNotice.classList.add("hidden");
      }
    }
  }

  function nextPrecisionTrial() {
    if (!inSession || testType.value !== "precision") return;

    trialIndex++;
    updatePrecisionCounter();

    if (trialIndex > totalTrials) {
      endPrecisionSession(false);
      return;
    }

    updateProgress();

    // Calculate target radius and position
    const stage = precisionStage;
    if (!stage) {
      endPrecisionSession(false);
      return;
    }

    const w = stage.clientWidth || window.innerWidth;
    const h = stage.clientHeight || window.innerHeight;
    const shortSide = Math.min(w, h);
    // Calculate radius in CSS pixels (independent of devicePixelRatio)
    // This ensures consistent hit radius across all devices and zoom levels
    const r = clampInt(Math.round(shortSide * 0.055), 18, 44);
    const padding = Math.round(r * 1.5);

    // Calculate Exit button exclusion zone
    let exitButtonExclusion = { x: 0, y: 0, width: 0, height: 0 };
    if (precisionExitBtn) {
      const exitRect = precisionExitBtn.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      // Calculate button position relative to stage
      const exitX = exitRect.left - stageRect.left;
      const exitY = exitRect.top - stageRect.top;
      const exitWidth = exitRect.width;
      const exitHeight = exitRect.height;
      // Add safety margin around button (at least the target radius + some padding)
      const margin = Math.max(r * 2, 80); // Minimum 80px margin, or 2x target radius
      exitButtonExclusion = {
        x: exitX - margin,
        y: exitY - margin,
        width: exitWidth + margin * 2,
        height: exitHeight + margin * 2
      };
    }

    precisionTargetRadius = r;
    
    // Place target, avoiding Exit button area
    let attempts = 0;
    let targetX, targetY;
    do {
      targetX = padding + Math.random() * (w - 2 * padding);
      targetY = padding + Math.random() * (h - 2 * padding);
      attempts++;
    } while (
      attempts < 50 && // Safety limit to prevent infinite loop
      exitButtonExclusion.width > 0 &&
      targetX >= exitButtonExclusion.x &&
      targetX <= exitButtonExclusion.x + exitButtonExclusion.width &&
      targetY >= exitButtonExclusion.y &&
      targetY <= exitButtonExclusion.y + exitButtonExclusion.height
    );
    
    precisionTargetX = targetX;
    precisionTargetY = targetY;

    // Render target
    if (precisionTarget) {
      // Remove show class first to reset animation state
      precisionTarget.classList.remove("show");
      // Set dimensions - use regular assignment since CSS no longer has width/height
      precisionTarget.style.width = `${r * 2}px`;
      precisionTarget.style.height = `${r * 2}px`;
      precisionTarget.style.left = `${precisionTargetX - r}px`;
      precisionTarget.style.top = `${precisionTargetY - r}px`;
      // Force reflow to ensure dimensions are applied
      void precisionTarget.offsetWidth;
      // Use setTimeout to ensure browser has fully applied styles before animation
      setTimeout(() => {
        if (precisionTarget && inSession && testType.value === "precision") {
          precisionTarget.classList.add("show");
        }
      }, 10);
    }

    precisionTrialStartTime = performance.now();
    precisionTrialActive = true;
    precisionTrialResolved = false; // Reset resolution guard for new trial

    // Set timeout for trial
    const config = TEST_CONFIG.precision;
    if (precisionTrialTimeoutId) {
      clearTimeout(precisionTrialTimeoutId);
    }
    precisionTrialTimeoutId = setTimeout(() => {
      if (!inSession || testType.value !== "precision") return;
      // Guard: if trial already resolved (user tapped), ignore timeout
      if (precisionTrialResolved) return;
      
      // Timeout - no response
      // Mark as resolved first to prevent late taps from being processed
      precisionTrialResolved = true;
      precisionTrialActive = false;
      recordResult({ type: "timeout", rt: null, errN: null });
      showPrecisionFeedback("timeout");
      if (precisionTarget) {
        precisionTarget.classList.remove("show");
      }
      setTimeout(() => {
        if (inSession && testType.value === "precision") {
          nextPrecisionTrial();
        }
      }, 200);
    }, config.windowMs || 3000);
  }

  function updatePrecisionCounter() {
    if (precisionCounter) {
      precisionCounter.textContent = `${trialIndex} / ${totalTrials}`;
    }
  }

  function showPrecisionFeedback(outcome) {
    if (!precisionFeedback) return;
    const text = t(`precision.feedback.${outcome}`);
    precisionFeedback.textContent = text;
    precisionFeedback.classList.add("show");
    
    // Optional: subtle vibration on miss/timeout (guarded)
    if ((outcome === "miss" || outcome === "timeout") && navigator.vibrate) {
      try {
        navigator.vibrate(10);
      } catch (_) {
        // Ignore vibration errors
      }
    }
    
    // Auto-clear after ~350ms
    setTimeout(() => {
      if (precisionFeedback) {
        precisionFeedback.classList.remove("show");
        precisionFeedback.textContent = "";
      }
    }, 350);
  }

  function handlePrecisionResize() {
    if (!inSession || testType.value !== "precision" || !precisionStage) return;
    if (!precisionTrialActive || precisionTargetRadius === 0) return; // Only adjust if target is visible
    
    const w = precisionStage.clientWidth || window.innerWidth;
    const h = precisionStage.clientHeight || window.innerHeight;
    const shortSide = Math.min(w, h);
    const r = clampInt(Math.round(shortSide * 0.055), 18, 44);
    const padding = Math.round(r * 1.5);
    
    // Update radius
    precisionTargetRadius = r;
    
    // Clamp current target position within new bounds
    const maxX = w - padding;
    const maxY = h - padding;
    precisionTargetX = Math.max(padding, Math.min(precisionTargetX, maxX));
    precisionTargetY = Math.max(padding, Math.min(precisionTargetY, maxY));
    
    // Update target size and position
    if (precisionTarget) {
      precisionTarget.style.width = `${r * 2}px`;
      precisionTarget.style.height = `${r * 2}px`;
      precisionTarget.style.left = `${precisionTargetX - r}px`;
      precisionTarget.style.top = `${precisionTargetY - r}px`;
    }
  }

  function endPrecisionSession(userExitedEarly) {
    if (!inSession || testType.value !== "precision") return;

    // Clean up fullscreen listeners
    document.removeEventListener("fullscreenchange", handlePrecisionFullscreenChange);
    document.removeEventListener("webkitfullscreenchange", handlePrecisionFullscreenChange);
    document.removeEventListener("mozfullscreenchange", handlePrecisionFullscreenChange);
    document.removeEventListener("MSFullscreenChange", handlePrecisionFullscreenChange);

    // Clean up resize/orientation listeners
    if (precisionResizeHandler) {
      window.removeEventListener("resize", precisionResizeHandler);
      window.removeEventListener("orientationchange", precisionResizeHandler);
      precisionResizeHandler = null;
    }

    // Clean up Esc key listeners
    if (precisionKeyHandler) {
      document.removeEventListener("keydown", precisionKeyHandler, true);
      precisionKeyHandler = null;
    }
    if (precisionGlobalEscDetector) {
      document.removeEventListener("keydown", precisionGlobalEscDetector, true);
      precisionGlobalEscDetector = null;
    }

    // Clean up pointerdown listener (attached to document)
    if (precisionPointerHandler) {
      document.removeEventListener("pointerdown", precisionPointerHandler, { passive: false, capture: true });
      precisionPointerHandler = null;
    }

    // Exit fullscreen if active
    if (precisionIsFullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen().catch(() => {});
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen().catch(() => {});
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen().catch(() => {});
      }
      precisionIsFullscreen = false;
    }

    // Hide precision stage
    if (precisionStage) {
      precisionStage.classList.add("hidden");
      document.body.classList.remove("precision-open");
    }

    if (precisionTarget) {
      precisionTarget.classList.remove("show");
    }

    if (precisionTrialTimeoutId) {
      clearTimeout(precisionTrialTimeoutId);
      precisionTrialTimeoutId = null;
    }

    // If user exited early, mark as invalid and set inSession = false before returning
    if (userExitedEarly) {
      inSession = false;
      isRunActive = false;
      
      // Re-enable controls
      trialCountInput.disabled = false;
      startBaselineBtn.disabled = false;
      startCheckBtn.disabled = false;
      if (startTrainingBtn) startTrainingBtn.disabled = false;
      resetBtn.style.display = "none";

      const contextPanel = document.getElementById("contextPanel");
      if (contextPanel) {
        contextPanel.classList.remove("is-hidden");
      }

      if (trialList) {
        trialList.classList.add("session-ended");
      }

      applyTrialEmphasis(trialList);
      updateProgress(true);

      const createdAt = new Date().toISOString();
      const tags = getContextTags();
      const device = getDeviceHints();
      const flags = { invalid: true, reason: "user_exited_early", refusalCode: "R1_INVALID_EXECUTION" };
      const invalidRecord = {
        id: createdAt,
        createdAt,
        testType: "precision",
        mode: mode || "",
        metrics: {
          avgErrN: 0,
          sdErrN: 0,
          bestErrN: 0,
          worstErrN: 0,
          meanRtMs: 0,
          sdRtMs: 0,
          trials: totalTrials,
          respondedTrials: 0,
          hits: 0,
          misses: 0,
          timeouts: 0
        },
        flags,
        tags,
        device,
        trialLog: buildTrialLog("precision", results)
      };
      invalidRecord.quality = computeSessionQuality(invalidRecord);
      pushHistoryRecord(invalidRecord);
      renderHistory();
      setSummary("invalid_precision_exit", {
        refusalCode: flags.refusalCode,
        quality: invalidRecord.quality
      }, "precision", mode);
      const tier20 = computeAdviceTier({ mode, refusalCode: flags.refusalCode, statusText: null, summaryType: "invalid_precision_exit" });
      setOperationalAdvice({
        tier: tier20,
        testType: "precision",
        mode,
        quality: invalidRecord.quality || "good",
        deviceMismatch: false,
        extra: {}
      });
      mode = null;
      updateBaselineInfo();
      return;
    }

    // Process results and compute metrics
    // NOTE: Do NOT set inSession = false here - let endSession() handle it
    // endSession() has a guard that checks inSession, so it must still be true
    endSession();
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
    } else if (testType.value === "precision") {
      // Clamp min to 10, max to 40 for precision
      trialCountInput.setAttribute("min", "10");
      trialCountInput.setAttribute("max", "40");
      // Set default to 25 (Baseline default) if currently at HTML default of 10
      const currentValue = parseInt(trialCountInput.value, 10);
      if (currentValue === 10) {
        trialCountInput.value = 25;
      }
      // Ensure value respects precision clamp
      const clamped = clampInt(parseInt(trialCountInput.value, 10), 10, 40);
      trialCountInput.value = clamped;
    } else {
      // Reaction Time and Divided Attention default to 10
      trialCountInput.value = 10;
      // Reset min to default (3) for non-precision tests
      trialCountInput.setAttribute("min", "3");
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

// Helper function to decorate divided legend with color coding
function decorateDividedLegend(lang, raw) {
  const go = I18N[lang]?.stimulus?.divided?.go || "";
  const nogo = I18N[lang]?.stimulus?.divided?.nogo || "";

  let out = raw;

  // Emphasize GO / NO-GO words using the translated labels
  if (go) out = out.replace(go, `<span class="legend-go">${go}</span>`);
  if (nogo) out = out.replace(nogo, `<span class="legend-nogo">${nogo}</span>`);

  // Emphasize "blue" word (language-specific)
  if (lang === "en") out = out.replace("blue", `<span class="legend-blue">blue</span>`);
  if (lang === "no") out = out.replace("blå", `<span class="legend-blue">blå</span>`);
  if (lang === "lt") out = out.replace("mėlynus", `<span class="legend-blue">mėlynus</span>`);

  return out;
}

// Show/hide divided attention legend based on test type
function updateDividedLegend() {
  const slot = document.getElementById("taskLegendSlot");
  if (!slot) return;

  // Clear slot
  slot.innerHTML = "";
  slot.style.display = "none";

  // Only show when Divided Attention is selected
  if (!(testType && testType.value === "divided")) return;

  const wrap = document.createElement("div");
  wrap.id = "dividedLegendInner";

  const en = document.createElement("span");
  en.className = "lang lang-en";
  en.innerHTML = decorateDividedLegend("en", I18N.en.stimulus.divided.legend);
  wrap.appendChild(en);

  const no = document.createElement("span");
  no.className = "lang lang-no";
  no.innerHTML = decorateDividedLegend("no", I18N.no.stimulus.divided.legend);
  wrap.appendChild(no);

  const lt = document.createElement("span");
  lt.className = "lang lang-lt";
  lt.innerHTML = decorateDividedLegend("lt", I18N.lt.stimulus.divided.legend);
  wrap.appendChild(lt);

  slot.appendChild(wrap);
  slot.style.display = "block";

  // Ensure correct language visibility immediately
  if (currentLang === "no") {
    en.classList.add("hidden"); no.classList.remove("hidden"); lt.classList.add("hidden");
  } else if (currentLang === "lt") {
    en.classList.add("hidden"); no.classList.add("hidden"); lt.classList.remove("hidden");
  } else {
    en.classList.remove("hidden"); no.classList.add("hidden"); lt.classList.add("hidden");
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
const FCE_IMPORT_RESULT_MESSAGE_KEY = "fce_import_result_message";
const FCE_LAST_FULL_BACKUP_AT_KEY = "fce_last_full_backup_at";

function setExportStatus(msg) {
  if (!exportStatus) return;
  exportStatus.textContent = msg;
  if (msg) setTimeout(() => (exportStatus.textContent = ""), 2500);
}

function renderLastFullBackupLine() {
  const lineEl = document.getElementById("lastFullBackupLine");
  if (!lineEl) return;

  const label = t("export.lastBackupLabel");
  const neverText = t("export.lastBackupNever");
  let lastRaw = null;
  try {
    lastRaw = localStorage.getItem(FCE_LAST_FULL_BACKUP_AT_KEY);
  } catch {}

  let valueText = neverText;
  if (lastRaw) {
    const d = new Date(lastRaw);
    if (!Number.isNaN(d.getTime())) {
      try {
        valueText = d.toLocaleString();
      } catch {
        const Y = d.getFullYear();
        const M = String(d.getMonth() + 1).padStart(2, "0");
        const D = String(d.getDate()).padStart(2, "0");
        const h = String(d.getHours()).padStart(2, "0");
        const m = String(d.getMinutes()).padStart(2, "0");
        valueText = `${Y}-${M}-${D} ${h}:${m}`;
      }
    }
  }

  lineEl.textContent = `${label}: ${valueText}`;
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

// CSV export: escape field for CSV (handles commas, quotes, newlines)
function escapeCsvField(value) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  // If contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// CSV export: flatten session record to CSV row
function sessionToCsvRow(session, testType) {
  const row = [];
  
  // Metadata
  row.push(escapeCsvField(session.id || ""));
  row.push(escapeCsvField(session.createdAt || ""));
  // Local timestamp string (format: YYYY-MM-DD HH:mm) - deterministic, locale-independent
  let timezoneOffsetMin = "";
  if (session.createdAt) {
    try {
      const date = new Date(session.createdAt);
      // Get local time components (not UTC)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const localStr = `${year}-${month}-${day} ${hours}:${minutes}`;
      row.push(escapeCsvField(localStr));
      // Timezone offset in minutes (behind UTC)
      timezoneOffsetMin = String(date.getTimezoneOffset());
    } catch {
      row.push("");
    }
  } else {
    row.push("");
  }
  row.push(escapeCsvField(timezoneOffsetMin));
  row.push(escapeCsvField(session.mode || ""));
  row.push(escapeCsvField(session.testType || testType || ""));
  row.push(escapeCsvField(session.version || ""));
  
  // Metrics (flatten based on test type)
  const metrics = session.metrics || {};
  if (testType === "reaction") {
    row.push(escapeCsvField(metrics.avgMs || ""));
    row.push(escapeCsvField(metrics.sdMs || ""));
    row.push(escapeCsvField(metrics.bestMs || ""));
    row.push(escapeCsvField(metrics.worstMs || ""));
    row.push(escapeCsvField(metrics.trials || ""));
    row.push(escapeCsvField(metrics.falseStarts || ""));
    // Non-applicable fields for reaction
    row.push(""); // hits
    row.push(""); // misses
    row.push(""); // falseAlarms
    row.push(""); // correctRejects
    row.push(""); // nogoCount
    row.push(""); // flashTargetCount
    row.push(""); // flashUserCount
    row.push(""); // flashAbsError
    row.push(""); // avgErrN
    row.push(""); // sdErrN
    row.push(""); // bestErrN
    row.push(""); // worstErrN
    row.push(""); // meanRtMs
    row.push(""); // sdRtMs
    row.push(""); // respondedTrials
    row.push(""); // timeouts
  } else if (testType === "gonogo") {
    row.push(escapeCsvField(metrics.avgMs || ""));
    row.push(escapeCsvField(metrics.sdMs || ""));
    row.push(escapeCsvField(metrics.bestMs || ""));
    row.push(escapeCsvField(metrics.worstMs || ""));
    row.push(escapeCsvField(metrics.trials || ""));
    row.push(escapeCsvField(metrics.falseStarts || ""));
    row.push(escapeCsvField(metrics.hits || ""));
    row.push(escapeCsvField(metrics.misses || ""));
    row.push(escapeCsvField(metrics.falseAlarms || ""));
    row.push(escapeCsvField(metrics.correctRejects || ""));
    row.push(escapeCsvField(metrics.nogoCount || ""));
    // Non-applicable fields for gonogo
    row.push(""); // flashTargetCount
    row.push(""); // flashUserCount
    row.push(""); // flashAbsError
    row.push(""); // avgErrN
    row.push(""); // sdErrN
    row.push(""); // bestErrN
    row.push(""); // worstErrN
    row.push(""); // meanRtMs
    row.push(""); // sdRtMs
    row.push(""); // respondedTrials
    row.push(""); // timeouts
  } else if (testType === "divided") {
    row.push(escapeCsvField(metrics.avgMs || ""));
    row.push(escapeCsvField(metrics.sdMs || ""));
    row.push(escapeCsvField(metrics.bestMs || ""));
    row.push(escapeCsvField(metrics.worstMs || ""));
    row.push(escapeCsvField(metrics.trials || ""));
    row.push(escapeCsvField(metrics.falseStarts || ""));
    row.push(escapeCsvField(metrics.hits || ""));
    row.push(escapeCsvField(metrics.misses || ""));
    row.push(escapeCsvField(metrics.falseAlarms || ""));
    row.push(escapeCsvField(metrics.correctRejects || ""));
    row.push(escapeCsvField(metrics.nogoCount || ""));
    row.push(escapeCsvField(metrics.flashTargetCount || ""));
    row.push(escapeCsvField(metrics.flashUserCount || ""));
    row.push(escapeCsvField(metrics.flashAbsError || ""));
    // Non-applicable fields for divided
    row.push(""); // avgErrN
    row.push(""); // sdErrN
    row.push(""); // bestErrN
    row.push(""); // worstErrN
    row.push(""); // meanRtMs
    row.push(""); // sdRtMs
    row.push(""); // respondedTrials
    row.push(""); // timeouts
  } else if (testType === "precision") {
    // Non-applicable fields for precision
    row.push(""); // avgMs
    row.push(""); // sdMs
    row.push(""); // bestMs
    row.push(""); // worstMs
    row.push(escapeCsvField(metrics.trials || ""));
    row.push(""); // falseStarts
    row.push(escapeCsvField(metrics.hits || ""));
    row.push(escapeCsvField(metrics.misses || ""));
    row.push(""); // falseAlarms
    row.push(""); // correctRejects
    row.push(""); // nogoCount
    row.push(""); // flashTargetCount
    row.push(""); // flashUserCount
    row.push(""); // flashAbsError
    row.push(escapeCsvField(metrics.avgErrN || ""));
    row.push(escapeCsvField(metrics.sdErrN || ""));
    row.push(escapeCsvField(metrics.bestErrN || ""));
    row.push(escapeCsvField(metrics.worstErrN || ""));
    row.push(escapeCsvField(metrics.meanRtMs || ""));
    row.push(escapeCsvField(metrics.sdRtMs || ""));
    row.push(escapeCsvField(metrics.respondedTrials || ""));
    row.push(escapeCsvField(metrics.timeouts || ""));
  } else {
    // Unknown test type - fill all with empty
    for (let i = 0; i < 23; i++) row.push("");
  }
  
  // Quality
  row.push(escapeCsvField(session.quality || ""));
  row.push(escapeCsvField(session.qualityNote || ""));
  
  // Flags
  const flags = session.flags || {};
  row.push(escapeCsvField(flags.invalid ? "true" : "false"));
  row.push(escapeCsvField(flags.reason || ""));
  row.push(escapeCsvField(flags.refusalCode || ""));
  
  // Device
  const device = session.device || {};
  row.push(escapeCsvField(device.userAgent || ""));
  row.push(escapeCsvField(device.isTouch ? "true" : "false"));
  row.push(escapeCsvField(device.userAgentHint || ""));
  row.push(escapeCsvField(device.precisionFullscreenSupported ? "true" : "false"));
  row.push(escapeCsvField(device.precisionFullscreenAchieved ? "true" : "false"));
  
  return row.join(",");
}

// CSV export: generate CSV content from sessions
function exportHistoryCsvFor(testType) {
  const sessions = loadHistory(testType);

  if (!sessions.length) return { ok: false, reason: "empty" };

  // Define CSV headers (fixed order)
  const headers = [
    "id",
    "timestamp",
    "localTimestamp",
    "timezoneOffsetMin",
    "mode",
    "testType",
    "version",
    // Metrics (all test types, blanks for non-applicable)
    "avgMs",
    "sdMs",
    "bestMs",
    "worstMs",
    "trials",
    "falseStarts",
    "hits",
    "misses",
    "falseAlarms",
    "correctRejects",
    "nogoCount",
    "flashTargetCount",
    "flashUserCount",
    "flashAbsError",
    "avgErrN",
    "sdErrN",
    "bestErrN",
    "worstErrN",
    "meanRtMs",
    "sdRtMs",
    "respondedTrials",
    "timeouts",
    // Quality
    "quality",
    "qualityNote",
    // Flags
    "invalid",
    "reason",
    "refusalCode",
    // Device
    "deviceUserAgent",
    "deviceIsTouch",
    "deviceUserAgentHint",
    "devicePrecisionFullscreenSupported",
    "devicePrecisionFullscreenAchieved"
  ];

  // Build CSV content
  const lines = [headers.join(",")];
  for (const session of sessions) {
    lines.push(sessionToCsvRow(session, testType));
  }

  return { ok: true, text: lines.join("\n") };
}

// CSV export: download CSV file
function downloadCsv(content, filename) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** All FCE app keys on this origin use the `fce_` prefix (instrument, baselines, history, UI prefs). */
function collectFceLocalStorageKeys() {
  const keys = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("fce_")) keys.push(k);
    }
  } catch {
    return keys;
  }
  keys.sort();
  return keys;
}

function fceBackupFilename() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const YYYY = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const DD = pad(d.getDate());
  const HH = pad(d.getHours());
  const mm = pad(d.getMinutes());
  const ss = pad(d.getSeconds());
  return `fce-backup-${YYYY}-${MM}-${DD}T${HH}-${mm}-${ss}.json`;
}

/** Preference-like keys (language, onboarding, instrument nav); order checked after history/baseline/docsState. */
const FCE_BACKUP_PREFERENCE_KEYS = new Set([
  "fce_lang",
  "fce_lang_v1",
  "fce_onboarding_done",
  "fce_test_type_v1",
  "fce_last_page",
  "fce_learn_more_clicked",
  "fce_resume_last",
]);

function fceBackupGroupForKey(key) {
  if (key.startsWith("fce_history_")) return "history";
  if (key.startsWith("fce_baseline_")) return "baselines";
  if (key === "fce_last_docs_page" || key.startsWith("fce_doc_scroll_")) return "docsState";
  if (FCE_BACKUP_PREFERENCE_KEYS.has(key)) return "preferences";
  return "otherFceKeys";
}

function buildFullBackupJsonString() {
  const keys = collectFceLocalStorageKeys();
  if (!keys.length) return { ok: false, reason: "empty" };

  const localStorageSnapshot = {};
  const includedKeys = [];
  for (const key of keys) {
    let raw;
    try {
      raw = localStorage.getItem(key);
    } catch {
      continue;
    }
    if (raw === null) continue;
    includedKeys.push(key);
    try {
      localStorageSnapshot[key] = { type: "json", value: JSON.parse(raw) };
    } catch {
      localStorageSnapshot[key] = { type: "raw", value: raw };
    }
  }

  if (!includedKeys.length) return { ok: false, reason: "empty" };

  const groups = {
    history: {},
    baselines: {},
    preferences: {},
    docsState: {},
    otherFceKeys: {},
  };
  for (const key of includedKeys) {
    const bucket = fceBackupGroupForKey(key);
    groups[bucket][key] = localStorageSnapshot[key];
  }

  const backup = {
    format: "fce-export",
    schemaVersion: 2,
    exportedAt: new Date().toISOString(),
    appVersion: "unknown",
    summary: {
      includedKeys,
      keyCount: includedKeys.length,
      approxBytes: 0,
    },
    groups,
    localStorageSnapshot,
  };

  for (let i = 0; i < 4; i++) {
    const json = JSON.stringify(backup);
    backup.summary.approxBytes = new TextEncoder().encode(json).length;
  }
  return { ok: true, json: JSON.stringify(backup) };
}

function downloadJsonFile(content, filename) {
  const blob = new Blob([content], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const KNOWN_FCE_BACKUP_SCHEMA_VERSIONS = [1, 2];
const FCE_IMPORT_PREVIEW_GROUP_NAMES = ["history", "baselines", "preferences", "docsState", "otherFceKeys"];

/** Last successfully validated backup object (same reference as preview); cleared after import or invalid preview. */
let importPreviewStagedParsed = null;

function fceI18nReplace(template, vars) {
  if (template == null || typeof template !== "string") return "";
  let out = template;
  for (const [k, v] of Object.entries(vars)) {
    out = out.split(`{${k}}`).join(String(v));
  }
  return out;
}

function computeImportOverwriteStats(snap) {
  const keys = Object.keys(snap && typeof snap === "object" && !Array.isArray(snap) ? snap : {});
  let overwrite = 0;
  let fresh = 0;
  for (const k of keys) {
    try {
      if (localStorage.getItem(k) !== null) overwrite++;
      else fresh++;
    } catch {
      fresh++;
    }
  }
  return { total: keys.length, overwrite, fresh };
}

function serializeFceSnapshotEntry(entry) {
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
  if (entry.type === "json") {
    try {
      return JSON.stringify(entry.value);
    } catch {
      return null;
    }
  }
  if (entry.type === "raw") {
    if (entry.value === undefined || entry.value === null) return "";
    return String(entry.value);
  }
  return null;
}

/** Writes only localStorageSnapshot entries; does not use groups. Returns counts for UI. */
function applyFceBackupLocalStorageSnapshot(snap) {
  if (!snap || typeof snap !== "object" || Array.isArray(snap)) {
    return { written: 0, skipped: 0, replaced: 0, fresh: 0 };
  }
  let written = 0;
  let skipped = 0;
  let replaced = 0;
  let fresh = 0;
  for (const [key, entry] of Object.entries(snap)) {
    let existed = false;
    try {
      existed = localStorage.getItem(key) !== null;
    } catch {
      existed = false;
    }
    const serialized = serializeFceSnapshotEntry(entry);
    if (serialized === null) {
      skipped++;
      continue;
    }
    try {
      localStorage.setItem(key, serialized);
      written++;
      if (existed) replaced++;
      else fresh++;
    } catch {
      skipped++;
    }
  }
  return { written, skipped, replaced, fresh };
}

function emptyImportPreviewGroupCounts() {
  return {
    history: 0,
    baselines: 0,
    preferences: 0,
    docsState: 0,
    otherFceKeys: 0,
  };
}

/** Dry-run validation only — does not read or write localStorage. */
function validateFceBackupImportPreview(parsed) {
  const errors = [];
  const warnings = [];
  const groupCounts = emptyImportPreviewGroupCounts();
  let schemaVersion = null;
  let keyCount = 0;

  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    errors.push("Root must be a JSON object.");
    return { valid: false, schemaVersion, keyCount, groups: groupCounts, warnings, errors };
  }

  if (parsed.format !== "fce-export") {
    errors.push('format must be exactly "fce-export".');
  }

  if (typeof parsed.schemaVersion !== "number" || !Number.isFinite(parsed.schemaVersion)) {
    errors.push("schemaVersion must be a finite number.");
  } else {
    schemaVersion = parsed.schemaVersion;
    if (!KNOWN_FCE_BACKUP_SCHEMA_VERSIONS.includes(schemaVersion)) {
      warnings.push(
        `schemaVersion ${schemaVersion} is not in the known set (${KNOWN_FCE_BACKUP_SCHEMA_VERSIONS.join(", ")}); import may require migration later.`
      );
    }
  }

  const snap = parsed.localStorageSnapshot;
  if (snap === null || typeof snap !== "object" || Array.isArray(snap)) {
    errors.push("localStorageSnapshot must be a non-null object.");
  } else {
    keyCount = Object.keys(snap).length;
    for (const [k, v] of Object.entries(snap)) {
      if (v === null || typeof v !== "object" || Array.isArray(v)) {
        warnings.push(`Snapshot key "${k}": expected an object with { type, value }.`);
      } else if (v.type !== "json" && v.type !== "raw") {
        warnings.push(`Snapshot key "${k}": type should be "json" or "raw".`);
      }
    }
  }

  const groups = parsed.groups;
  if (typeof parsed.schemaVersion === "number" && parsed.schemaVersion >= 2) {
    if (!groups || typeof groups !== "object" || Array.isArray(groups)) {
      warnings.push("schemaVersion ≥ 2 backups usually include a structured groups object.");
    }
  }

  if (groups && typeof groups === "object" && !Array.isArray(groups)) {
    for (const name of FCE_IMPORT_PREVIEW_GROUP_NAMES) {
      if (!(name in groups)) {
        warnings.push(`Missing expected group bucket: groups.${name}`);
      } else if (groups[name] !== null && typeof groups[name] === "object" && !Array.isArray(groups[name])) {
        groupCounts[name] = Object.keys(groups[name]).length;
      } else {
        warnings.push(`groups.${name} should be an object.`);
      }
    }

    if (snap && typeof snap === "object" && !Array.isArray(snap)) {
      const snapKeys = new Set(Object.keys(snap));
      const groupedKeys = new Set();
      let anyGrouped = false;
      for (const name of FCE_IMPORT_PREVIEW_GROUP_NAMES) {
        const b = groups[name];
        if (b && typeof b === "object" && !Array.isArray(b)) {
          if (Object.keys(b).length) anyGrouped = true;
          for (const k of Object.keys(b)) groupedKeys.add(k);
        }
      }
      if (anyGrouped) {
        if (groupedKeys.size !== snapKeys.size) {
          warnings.push(
            `Group key count (${groupedKeys.size}) does not match localStorageSnapshot key count (${snapKeys.size}).`
          );
        }
        for (const k of groupedKeys) {
          if (!snapKeys.has(k)) {
            warnings.push(`Key "${k}" appears in groups but not in localStorageSnapshot.`);
          }
        }
        for (const k of snapKeys) {
          if (!groupedKeys.has(k)) {
            warnings.push(`Key "${k}" is in localStorageSnapshot but not found in any group bucket.`);
          }
        }
      }
    }
  }

  const structurallyOk =
    parsed.format === "fce-export" &&
    typeof parsed.schemaVersion === "number" &&
    Number.isFinite(parsed.schemaVersion) &&
    snap !== null &&
    typeof snap === "object" &&
    !Array.isArray(snap);

  const valid = structurallyOk && errors.length === 0;

  return { valid, schemaVersion, keyCount, groups: groupCounts, warnings, errors };
}

function renderImportPreviewFromParsed(parsed, parseStageError) {
  const panel = document.getElementById("importPreviewPanel");
  if (!panel) return;

  const groupCountsEmpty = emptyImportPreviewGroupCounts();
  let validation;
  if (parseStageError) {
    validation = {
      valid: false,
      schemaVersion: null,
      keyCount: 0,
      groups: groupCountsEmpty,
      warnings: [],
      errors: [parseStageError],
    };
  } else {
    validation = validateFceBackupImportPreview(parsed);
  }

  const snap =
    parsed &&
    parsed.localStorageSnapshot &&
    typeof parsed.localStorageSnapshot === "object" &&
    !Array.isArray(parsed.localStorageSnapshot)
      ? parsed.localStorageSnapshot
      : null;
  const restoreKeys = snap ? Object.keys(snap).sort() : [];

  panel.classList.remove("hidden");

  const validityEl = document.getElementById("importPreviewValidity");
  if (validityEl) {
    validityEl.textContent = validation.valid ? t("importPreview.valid") : t("importPreview.invalid");
    validityEl.className =
      "import-preview-validity " + (validation.valid ? "import-preview-ok" : "import-preview-bad");
  }

  const meta = document.getElementById("importPreviewMeta");
  if (meta) {
    meta.innerHTML = "";
    const dt1 = document.createElement("dt");
    dt1.textContent = t("importPreview.schemaVersion");
    meta.appendChild(dt1);
    const dd1 = document.createElement("dd");
    dd1.textContent =
      validation.schemaVersion !== null && validation.schemaVersion !== undefined
        ? String(validation.schemaVersion)
        : "—";
    meta.appendChild(dd1);
    const dt2 = document.createElement("dt");
    dt2.textContent = t("importPreview.keyCount");
    meta.appendChild(dt2);
    const dd2 = document.createElement("dd");
    dd2.textContent = String(validation.keyCount);
    meta.appendChild(dd2);
  }

  const gcUl = document.getElementById("importPreviewGroupCounts");
  if (gcUl) {
    gcUl.innerHTML = "";
    for (const name of FCE_IMPORT_PREVIEW_GROUP_NAMES) {
      const li = document.createElement("li");
      li.textContent = `${name}: ${validation.groups[name]}`;
      gcUl.appendChild(li);
    }
  }

  function fillList(ul, items, emptyKey) {
    if (!ul) return;
    ul.innerHTML = "";
    if (!items.length) {
      const li = document.createElement("li");
      li.className = "muted";
      li.textContent = t(emptyKey);
      ul.appendChild(li);
      return;
    }
    for (const line of items) {
      const li = document.createElement("li");
      li.textContent = line;
      ul.appendChild(li);
    }
  }

  fillList(document.getElementById("importPreviewWarnings"), validation.warnings, "importPreview.noWarnings");
  fillList(document.getElementById("importPreviewErrors"), validation.errors, "importPreview.noErrors");

  const keysEl = document.getElementById("importPreviewKeys");
  if (keysEl) {
    keysEl.textContent = restoreKeys.length ? restoreKeys.join("\n") : "—";
  }

  const summaryForJson = {
    valid: validation.valid,
    schemaVersion: validation.schemaVersion,
    keyCount: validation.keyCount,
    groups: {
      history: validation.groups.history,
      baselines: validation.groups.baselines,
      preferences: validation.groups.preferences,
      docsState: validation.groups.docsState,
      otherFceKeys: validation.groups.otherFceKeys,
    },
    warnings: validation.warnings,
    errors: validation.errors,
  };
  const jsonEl = document.getElementById("importPreviewSummaryJson");
  if (jsonEl) {
    jsonEl.textContent = JSON.stringify(summaryForJson, null, 2);
  }

  if (validation.valid && snap && parsed && !parseStageError) {
    importPreviewStagedParsed = parsed;
  } else {
    importPreviewStagedParsed = null;
  }

  const actions = document.getElementById("importDataActions");
  const warnEl = document.getElementById("importOverwriteWarning");
  const importBtn = document.getElementById("importDataBtn");
  if (actions && warnEl && importBtn) {
    if (validation.valid && snap) {
      actions.classList.remove("hidden");
      importBtn.disabled = false;
      const stats = computeImportOverwriteStats(snap);
      if (stats.overwrite > 0) {
        warnEl.classList.remove("hidden");
        warnEl.textContent = fceI18nReplace(t("importPreview.overwriteWarning"), stats);
      } else {
        warnEl.classList.add("hidden");
        warnEl.textContent = "";
      }
    } else {
      actions.classList.add("hidden");
      warnEl.classList.add("hidden");
      warnEl.textContent = "";
    }
  }
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

// CSV export button handler
const exportCsvBtn = document.getElementById("exportCsvBtn");
if (exportCsvBtn) {
  exportCsvBtn.addEventListener("click", () => {
    const currentTest = (historyTest && historyTest.value)
      ? historyTest.value
      : (testType && testType.value ? testType.value : "reaction"); // fallback

    const res = exportHistoryCsvFor(currentTest);

    if (!res.ok) {
      setExportStatus(t("export.empty"));
      return;
    }

    // Generate filename: fce_<testType>history<YYYY-MM-DD><HHmm><lang>.csv
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const timeStr = String(now.getHours()).padStart(2, "0") + String(now.getMinutes()).padStart(2, "0");
    const lang = currentLang || "en";
    const filename = `fce_${currentTest}history${dateStr}${timeStr}${lang}.csv`;

    downloadCsv(res.text, filename);
    setExportStatus(t("export.csvExported"));
  });
}

const exportFullBackupBtn = document.getElementById("exportFullBackupBtn");
if (exportFullBackupBtn) {
  exportFullBackupBtn.addEventListener("click", () => {
    const res = buildFullBackupJsonString();
    if (!res.ok) {
      setExportStatus(t("export.backupEmpty"));
      return;
    }
    downloadJsonFile(res.json, fceBackupFilename());
    try {
      localStorage.setItem(FCE_LAST_FULL_BACKUP_AT_KEY, new Date().toISOString());
    } catch {}
    renderLastFullBackupLine();
    setExportStatus(t("export.backupOk"));
  });
}

const importPreviewBtn = document.getElementById("importPreviewBtn");
const importPreviewFileInput = document.getElementById("importPreviewFileInput");
if (importPreviewBtn && importPreviewFileInput) {
  importPreviewBtn.addEventListener("click", () => {
    importPreviewFileInput.value = "";
    importPreviewFileInput.click();
  });
  importPreviewFileInput.addEventListener("change", () => {
    const file = importPreviewFileInput.files && importPreviewFileInput.files[0];
    if (!file) return;
    setExportStatus("");
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || "");
        const parsed = JSON.parse(text);
        renderImportPreviewFromParsed(parsed, null);
      } catch {
        renderImportPreviewFromParsed(null, t("importPreview.parseError"));
      }
    };
    reader.onerror = () => {
      renderImportPreviewFromParsed(null, t("importPreview.readError"));
    };
    reader.readAsText(file, "utf-8");
  });
}

const importDataBtn = document.getElementById("importDataBtn");
if (importDataBtn) {
  importDataBtn.addEventListener("click", () => {
    const staged = importPreviewStagedParsed;
    if (!staged) return;
    const v = validateFceBackupImportPreview(staged);
    if (!v.valid || v.errors.length > 0) {
      setExportStatus(t("importPreview.invalid"));
      return;
    }
    const snap = staged.localStorageSnapshot;
    if (!snap || typeof snap !== "object" || Array.isArray(snap)) return;

    const stats = computeImportOverwriteStats(snap);
    const msg = fceI18nReplace(t("importPreview.confirmImport"), stats);
    const ok = confirm(msg);
    if (!ok) {
      setExportStatus(t("importPreview.importAborted"));
      return;
    }

    importDataBtn.disabled = true;
    const { written, skipped, replaced, fresh } = applyFceBackupLocalStorageSnapshot(snap);

    if (written === 0) {
      setExportStatus(t("importPreview.importNothing"));
      importDataBtn.disabled = false;
      return;
    }

    importPreviewStagedParsed = null;

    const statusMsgCore =
      skipped > 0
        ? fceI18nReplace(t("importPreview.importSuccessWithSkip"), {
            written,
            replaced,
            fresh,
            skipped,
          })
        : fceI18nReplace(t("importPreview.importSuccessNoSkip"), {
            written,
            replaced,
            fresh,
          });
    const statusMsg = `${statusMsgCore} ${t("importPreview.importUpdatedMeaning")}`;
    try {
      sessionStorage.setItem(FCE_IMPORT_RESULT_MESSAGE_KEY, statusMsg);
    } catch {}
    setExportStatus(statusMsg);
    setTimeout(() => {
      location.reload();
    }, 1200);
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
  
  const deviceHints = { isTouch, userAgentHint };
  
  // Include Precision fullscreen tracking if this is a Precision session
  if (testType && testType.value === "precision") {
    const precisionFullscreenSupported = !!(document.documentElement.requestFullscreen || 
      document.documentElement.webkitRequestFullscreen || 
      document.documentElement.mozRequestFullScreen || 
      document.documentElement.msRequestFullscreen);
    deviceHints.precisionFullscreenSupported = precisionFullscreenSupported;
    deviceHints.precisionFullscreenAchieved = precisionFullscreenAchieved || false;
  }
  
  return deviceHints;
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
    const isPrecision = tt === "precision";
  
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
        const tier1 = computeAdviceTier({ mode, refusalCode: flags.refusalCode, statusText: null, summaryType: "invalid_no_reaction" });
        setOperationalAdvice({
          tier: tier1,
          testType: "reaction",
          mode,
          quality: invalidRecord.quality || "good",
          deviceMismatch: false,
          extra: {}
        });
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
        const tier2 = computeAdviceTier({ mode, refusalCode: flags.refusalCode, statusText: null, summaryType: "invalid_no_go" });
        setOperationalAdvice({
          tier: tier2,
          testType: "gonogo",
          mode,
          quality: invalidRecord.quality || "good",
          deviceMismatch: false,
          extra: {}
        });
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
        const tier3 = computeAdviceTier({ mode, refusalCode: flags.refusalCode, statusText: null, summaryType: "invalid_missing_answer" });
        setOperationalAdvice({
          tier: tier3,
          testType: "divided",
          mode,
          quality: invalidRecord.quality || "good",
          deviceMismatch: false,
          extra: {}
        });
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
        const tier4 = computeAdviceTier({ mode, refusalCode: flags.refusalCode, statusText: null, summaryType: "invalid_no_go_responses_divided" });
        setOperationalAdvice({
          tier: tier4,
          testType: "divided",
          mode,
          quality: invalidRecord.quality || "good",
          deviceMismatch: false,
          extra: {}
        });
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
    } else if (isPrecision) {
      // Precision metrics
      const respondedTrials = results.filter(e => e && (e.type === "hit" || e.type === "miss"));
      const timeouts = results.filter(e => e && e.type === "timeout").length;
      const hits = results.filter(e => e && e.type === "hit").length;
      const misses = results.filter(e => e && e.type === "miss").length;

      // Refusal logic
      if (respondedTrials.length === 0) {
        flags = { invalid: true, reason: "no_valid_responses", refusalCode: "R1_INVALID_EXECUTION" };
        const invalidRecord = {
          id: createdAt,
          createdAt,
          testType: "precision",
          mode: mode || "",
          metrics: {
            avgErrN: 0,
            sdErrN: 0,
            bestErrN: 0,
            worstErrN: 0,
            meanRtMs: 0,
            sdRtMs: 0,
            trials: totalTrials,
            respondedTrials: 0,
            hits: 0,
            misses: 0,
            timeouts
          },
          flags,
          tags,
          device,
          trialLog: buildTrialLog(tt, results)
        };
        invalidRecord.quality = computeSessionQuality(invalidRecord);
        pushHistoryRecord(invalidRecord);
        renderHistory();
        setSummary("invalid_precision_no_responses", {
          refusalCode: flags.refusalCode,
          quality: invalidRecord.quality
        }, "precision", mode);
        const tier5 = computeAdviceTier({ mode, refusalCode: flags.refusalCode, statusText: null, summaryType: "invalid_precision_no_responses" });
        setOperationalAdvice({
          tier: tier5,
          testType: "precision",
          mode,
          quality: invalidRecord.quality || "good",
          deviceMismatch: false,
          extra: {}
        });
        mode = null;
        updateBaselineInfo();
        return;
      }

      const minRespondedTrials = Math.max(10, Math.ceil(totalTrials * 0.80));
      if (respondedTrials.length < minRespondedTrials) {
        flags = { invalid: true, reason: "insufficient_data", refusalCode: "R2_INSUFFICIENT_DATA" };
        const invalidRecord = {
          id: createdAt,
          createdAt,
          testType: "precision",
          mode: mode || "",
          metrics: {
            avgErrN: 0,
            sdErrN: 0,
            bestErrN: 0,
            worstErrN: 0,
            meanRtMs: 0,
            sdRtMs: 0,
            trials: totalTrials,
            respondedTrials: respondedTrials.length,
            hits,
            misses,
            timeouts
          },
          flags,
          tags,
          device,
          trialLog: buildTrialLog(tt, results)
        };
        invalidRecord.quality = computeSessionQuality(invalidRecord);
        pushHistoryRecord(invalidRecord);
        renderHistory();
        setSummary("invalid_precision_insufficient", {
          refusalCode: flags.refusalCode,
          quality: invalidRecord.quality
        }, "precision", mode);
        const tier6 = computeAdviceTier({ mode, refusalCode: flags.refusalCode, statusText: null, summaryType: "invalid_precision_insufficient" });
        setOperationalAdvice({
          tier: tier6,
          testType: "precision",
          mode,
          quality: invalidRecord.quality || "good",
          deviceMismatch: false,
          extra: {}
        });
        mode = null;
        updateBaselineInfo();
        return;
      }

      // Check R3: excessive timeouts or misses
      const timeoutRate = totalTrials > 0 ? timeouts / totalTrials : 0;
      const missRate = respondedTrials.length > 0 ? misses / respondedTrials.length : 0;
      if (timeoutRate > 0.20 || missRate > 0.35) {
        flags = { invalid: true, reason: "excess_noise", refusalCode: "R3_EXCESS_NOISE" };
        const invalidRecord = {
          id: createdAt,
          createdAt,
          testType: "precision",
          mode: mode || "",
          metrics: {
            avgErrN: 0,
            sdErrN: 0,
            bestErrN: 0,
            worstErrN: 0,
            meanRtMs: 0,
            sdRtMs: 0,
            trials: totalTrials,
            respondedTrials: respondedTrials.length,
            hits,
            misses,
            timeouts
          },
          flags,
          tags,
          device,
          trialLog: buildTrialLog(tt, results)
        };
        invalidRecord.quality = computeSessionQuality(invalidRecord);
        pushHistoryRecord(invalidRecord);
        renderHistory();
        setSummary("invalid_precision_excess_noise", {
          refusalCode: flags.refusalCode,
          quality: invalidRecord.quality
        }, "precision", mode);
        const tier7 = computeAdviceTier({ mode, refusalCode: flags.refusalCode, statusText: null, summaryType: "invalid_precision_excess_noise" });
        setOperationalAdvice({
          tier: tier7,
          testType: "precision",
          mode,
          quality: invalidRecord.quality || "good",
          deviceMismatch: false,
          extra: {}
        });
        mode = null;
        updateBaselineInfo();
        return;
      }

      // Compute metrics from responded trials only
      const errNValues = respondedTrials.filter(e => e.errN !== null && e.errN !== undefined).map(e => e.errN);
      const rtValues = respondedTrials.filter(e => e.rt !== null && e.rt !== undefined).map(e => e.rt);

      sessionPayload = {
        meanErrN: errNValues.length > 0 ? mean(errNValues) : 0,
        sdErrN: errNValues.length > 1 ? stddev(errNValues) : 0,
        bestErrN: errNValues.length > 0 ? Math.min(...errNValues) : 0,
        worstErrN: errNValues.length > 0 ? Math.max(...errNValues) : 0,
        meanRtMs: rtValues.length > 0 ? mean(rtValues) : 0,
        sdRtMs: rtValues.length > 1 ? stddev(rtValues) : 0,
        trials: totalTrials,
        respondedTrials: respondedTrials.length,
        hits,
        misses,
        timeouts
      };
    }

    // Check for R3_EXCESS_NOISE (high error rates) - but only mark invalid if extreme
    // Note: Precision R3 is handled above, this is for other test types
    // This is a quality issue, but we still allow baseline updates if thresholds are met
    // We'll mark as "mixed" quality rather than invalid unless error rates are extreme
    if (!isPrecision) {
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
        : isPrecision
        ? {
            avgErrN: sessionPayload.meanErrN,
            sdErrN: sessionPayload.sdErrN,
            bestErrN: sessionPayload.bestErrN,
            worstErrN: sessionPayload.worstErrN,
            meanRtMs: sessionPayload.meanRtMs,
            sdRtMs: sessionPayload.sdRtMs,
            trials: sessionPayload.trials,
            respondedTrials: sessionPayload.respondedTrials,
            hits: sessionPayload.hits,
            misses: sessionPayload.misses,
            timeouts: sessionPayload.timeouts
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
            const tier8 = computeAdviceTier({ mode, refusalCode: sessionRecord.flags.refusalCode, statusText: null, summaryType: "baseline_not_saved_divided" });
            setOperationalAdvice({
              tier: tier8,
              testType: tt,
              mode,
              quality: sessionRecord.quality || "good",
              deviceMismatch: false,
              extra: {}
            });
          } else {
            setSummary("baseline_not_saved", {
              refusalCode: sessionRecord.flags.refusalCode,
              quality: sessionRecord.quality
            }, tt, mode);
            const tier9 = computeAdviceTier({ mode, refusalCode: sessionRecord.flags.refusalCode, statusText: null, summaryType: "baseline_not_saved" });
            setOperationalAdvice({
              tier: tier9,
              testType: tt,
              mode,
              quality: sessionRecord.quality || "good",
              deviceMismatch: false,
              extra: {}
            });
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
      // For precision, store meanErrN, sdErrN, meanRtMs, sdRtMs, trials
      const baselinePayload = isPrecision
        ? {
            meanErrN: sessionPayload.meanErrN,
            sdErrN: sessionPayload.sdErrN,
            meanRtMs: sessionPayload.meanRtMs,
            sdRtMs: sessionPayload.sdRtMs,
            trials: sessionPayload.trials,
            timestamp: new Date().toISOString(),
            device: device
          }
        : {
            ...sessionPayload,
            timestamp: new Date().toISOString(),
            device: device
          };
      sessions.push(baselinePayload);
  
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
      } else if (isPrecision) {
        // Add fullscreen note if fullscreen was not achieved (baseline/check only, not training)
        const fullscreenNote = (mode === "baseline" || mode === "check") && !precisionFullscreenAchieved
          ? ` ${t("precision.noFullscreenNote")}`
          : "";
        setSummary("baseline_saved_precision", {
          meanErrN: sessionPayload.meanErrN,
          sdErrN: sessionPayload.sdErrN,
          meanRtMs: sessionPayload.meanRtMs,
          qualityNote,
          quality: sessionRecord.quality || "good",
          deviceWarning: "",
          fullscreenNote
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
      // Show advisory advice for training mode
      const tierTraining = computeAdviceTier({ mode: "training", refusalCode: null, statusText: null, summaryType: null });
      setOperationalAdvice({
        tier: tierTraining,
        testType: tt,
        mode: "training",
        quality: sessionRecord.quality || "good",
        deviceMismatch: false,
        extra: {}
      });
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
        const tier14 = computeAdviceTier({ mode, refusalCode: sessionRecord.flags.refusalCode, statusText: null, summaryType: "not_enough_baseline" });
        setOperationalAdvice({
          tier: tier14,
          testType: tt,
          mode,
          quality: sessionRecord.quality || "good",
          deviceMismatch: false,
          extra: {}
        });
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
      let status;
      
      if (isPrecision) {
        // Precision: compare meanErrN
        const baselineMeanErrN = mean(sessions.map(s => s.meanErrN || 0));
        const baselineSDErrN = mean(sessions.map(s => s.sdErrN || 0));
        if (sessionPayload.meanErrN <= baselineMeanErrN + baselineSDErrN) {
          status = t("status.within");
        } else if (sessionPayload.meanErrN <= baselineMeanErrN + 2 * baselineSDErrN) {
          status = t("status.slightly");
        } else {
          status = t("status.significantly");
        }
        const baselineMean = baselineMeanErrN;
        const baselineSD = baselineSDErrN;
        const qualityNote = ""; // Precision doesn't use checkSessionQuality
        // Add fullscreen note if fullscreen was not achieved (baseline/check only, not training)
        const fullscreenNote = (mode === "baseline" || mode === "check") && !precisionFullscreenAchieved
          ? ` ${t("precision.noFullscreenNote")}`
          : "";
        setSummary("check_precision", {
          meanErrN: sessionPayload.meanErrN,
          baselineMeanErrN: baselineMean,
          baselineSDErrN: baselineSD,
          status,
          meanRtMs: sessionPayload.meanRtMs,
          quality: sessionRecord.quality || "good",
          deviceWarning: deviceWarning || "",
          fullscreenNote
        }, tt, mode);
        mode = null;
        return;
      }
      
      const baselineMean = mean(sessions.map(s => s.mean));
      const baselineSD = mean(sessions.map(s => s.sd));
      
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
        const tier16 = computeAdviceTier({ mode, refusalCode: null, statusText: status, summaryType: "check_reaction" });
        setOperationalAdvice({
          tier: tier16,
          testType: "reaction",
          mode,
          quality: sessionRecord.quality || "good",
          deviceMismatch: !!deviceWarning,
          extra: {}
        });
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
        const tier17 = computeAdviceTier({ mode, refusalCode: null, statusText: status, summaryType: "check_divided" });
        setOperationalAdvice({
          tier: tier17,
          testType: "divided",
          mode,
          quality: sessionRecord.quality || "good",
          deviceMismatch: !!deviceWarning,
          extra: {}
        });
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
    if (progress) progress.classList.remove("is-complete");
    if (sessionPanel) sessionPanel.classList.remove("session-result-ready");
    return;
  }

  const done = results.length;
  const total = totalTrials;

  if (isDone) {
    progress.textContent = getSessionComplete(done, total);
    if (progress) progress.classList.add("is-complete");
    if (sessionPanel) sessionPanel.classList.add("session-result-ready");
  } else {
    progress.textContent = getTrialProgress(Math.min(trialIndex, total), total, done);
    if (progress) progress.classList.remove("is-complete");
    if (sessionPanel) sessionPanel.classList.remove("session-result-ready");
  }
}

function hardReset() {
  // Clear precision reset flags at the beginning (so future sessions are clean)
  precisionResetIntent = false;
  precisionResetRan = false;
  precisionShouldResetOnFullscreenExit = false;
  precisionEscPressTime = 0;
  precisionGlobalEscDetected = false;
  
  // Remove session-ended class when resetting
  if (trialList) {
    trialList.classList.remove("session-ended");
  }
  if (progress) progress.classList.remove("is-complete");
  if (sessionPanel) sessionPanel.classList.remove("session-result-ready");
  // Clear divided attention state on reset
  dividedPlan = null;
  dividedFlashAnswer = null;
  if (flashOverlayTimeoutId) {
    clearTimeout(flashOverlayTimeoutId);
    flashOverlayTimeoutId = null;
  }
  
  // Clear precision state on reset
  if (precisionTrialTimeoutId) {
    clearTimeout(precisionTrialTimeoutId);
    precisionTrialTimeoutId = null;
  }
  precisionTargetRadius = 0;
  precisionTargetX = 0;
  precisionTargetY = 0;
  precisionTrialStartTime = null;
  precisionTrialActive = false;
  precisionTrialResolved = false;
  if (precisionResizeHandler) {
    window.removeEventListener("resize", precisionResizeHandler);
    window.removeEventListener("orientationchange", precisionResizeHandler);
    precisionResizeHandler = null;
  }
  if (precisionKeyHandler) {
    document.removeEventListener("keydown", precisionKeyHandler, true);
    precisionKeyHandler = null;
  }
  if (precisionGlobalEscDetector) {
    document.removeEventListener("keydown", precisionGlobalEscDetector, true);
    precisionGlobalEscDetector = null;
  }
  // Clean up pointerdown listener (attached to document)
  if (precisionPointerHandler) {
    document.removeEventListener("pointerdown", precisionPointerHandler, { passive: false, capture: true });
    precisionPointerHandler = null;
  }
  // Exit fullscreen if active (for precision)
  if (precisionIsFullscreen) {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {
        precisionShouldResetOnFullscreenExit = false;
      });
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen().catch(() => {
        precisionShouldResetOnFullscreenExit = false;
      });
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen().catch(() => {
        precisionShouldResetOnFullscreenExit = false;
      });
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen().catch(() => {
        precisionShouldResetOnFullscreenExit = false;
      });
    }
    precisionIsFullscreen = false;
  } else {
    precisionShouldResetOnFullscreenExit = false;
  }
  if (precisionStage) {
    precisionStage.classList.add("hidden");
    document.body.classList.remove("precision-open");
  }
  if (precisionTarget) {
      precisionTarget.classList.remove("show");
  }
  clearTimeout(timeoutId);

  inSession = false;
  isRunActive = false; // Stop auto-scroll
  startTime = null;
  results = [];
  trialIndex = 0;

  testArea.classList.add("hidden");
  testArea.textContent = "";
  testArea.style.background = "";
  testArea.innerHTML = ""; // Clear any flash overlay or question UI

  trialList.innerHTML = "";
  summary.textContent = "";
  lastSummaryData = null; // Clear summary data on reset
  lastAdviceData = null; // Clear advice data on reset
  setOperationalAdvice(null); // Hide advice block
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
    const isPrecision = tt === "precision";

    // Guidance text (always shown) - update all language spans
    const guidanceEn = baselineGuidance.querySelector(".lang-en");
    const guidanceNo = baselineGuidance.querySelector(".lang-no");
    const guidanceLt = baselineGuidance.querySelector(".lang-lt");
    if (guidanceEn) {
      if (isGoNoGo) {
        guidanceEn.textContent = `Recommended: ≥${minSessions} baseline sessions, ≥${recTrials} trials per session (Go/No-Go needs more trials for stable results).`;
      } else if (isDivided) {
        guidanceEn.textContent = `Recommended: ≥${minSessions} baseline sessions, ≥${recTrials} trials per session (Divided Attention needs more trials for flash counting).`;
      } else if (isPrecision) {
        guidanceEn.textContent = `Recommended: ≥${minSessions} baseline sessions, ≥${recTrials} trials per session (Precision needs more trials for stable accuracy measurement).`;
      } else {
        guidanceEn.textContent = `Recommended: ≥${minSessions} baseline sessions, ≥${recTrials} trials per session.`;
      }
    }
    if (guidanceNo) {
      if (isGoNoGo) {
        guidanceNo.textContent = `Anbefalt: ≥${minSessions} baseline-økter, ≥${recTrials} forsøk per økt (Go/No-Go trenger flere forsøk for stabile resultater).`;
      } else if (isDivided) {
        guidanceNo.textContent = `Anbefalt: ≥${minSessions} baseline-økter, ≥${recTrials} forsøk per økt (Delt oppmerksomhet trenger flere forsøk for flash-telling).`;
      } else if (isPrecision) {
        guidanceNo.textContent = `Anbefalt: ≥${minSessions} baseline-økter, ≥${recTrials} forsøk per økt (Presisjon trenger flere forsøk for stabil nøyaktighetsmåling).`;
      } else {
        guidanceNo.textContent = `Anbefalt: ≥${minSessions} baseline-økter, ≥${recTrials} forsøk per økt.`;
      }
    }
    if (guidanceLt) {
      if (isGoNoGo) {
        guidanceLt.textContent = `Rekomenduojama: ≥${minSessions} bazinio lygio sesijos, ≥${recTrials} bandymai per sesiją (Spausk/Nespausk reikalauja daugiau bandymų dėl stabilaus rezultato).`;
      } else if (isDivided) {
        guidanceLt.textContent = `Rekomenduojama: ≥${minSessions} bazinio lygio sesijos, ≥${recTrials} bandymai per sesiją (Padalinta dėmesys reikalauja daugiau bandymų dėl blyksnių skaičiavimo).`;
      } else if (isPrecision) {
        guidanceLt.textContent = `Rekomenduojama: ≥${minSessions} bazinio lygio sesijos, ≥${recTrials} bandymai per sesiją (Tikslumas reikalauja daugiau bandymų dėl stabilaus tikslumo matavimo).`;
      } else {
        guidanceLt.textContent = `Rekomenduojama: ≥${minSessions} bazinio lygio sesijos, ≥${recTrials} bandymai per sesiją.`;
      }
    }

    // Button gating based on minimum baseline sessions
    startCheckBtn.disabled = sessions.length < minSessions;

    // Small metadata lines: shown only when a baseline exists
    if (baselineStatusInfo) baselineStatusInfo.textContent = "";
    if (baselineLastUpdateInfo) baselineLastUpdateInfo.textContent = "";

    if (sessions.length === 0) {
      // Update both language spans in baselineInfo
      const infoEn = baselineInfo.querySelector(".lang-en");
      const infoNo = baselineInfo.querySelector(".lang-no");
      const infoLt = baselineInfo.querySelector(".lang-lt");
      if (infoEn) infoEn.textContent = "No baseline sessions recorded.";
      if (infoNo) infoNo.textContent = "Ingen baseline-økter er registrert.";
      if (infoLt) infoLt.textContent = "Nėra užregistruotų bazinio lygio sesijų.";
      if (baselineStatusInfo) baselineStatusInfo.style.display = "none";
      if (baselineLastUpdateInfo) baselineLastUpdateInfo.style.display = "none";
      clearBaselineBtn.style.display = "none";
      return;
    }

    if (baselineStatusInfo) baselineStatusInfo.style.display = "";
    if (baselineLastUpdateInfo) baselineLastUpdateInfo.style.display = "";
    clearBaselineBtn.style.display = "";

    // For precision, use meanErrN/sdErrN; for others, use mean/sd
    const isPrecisionType = tt === "precision";
    let meanAvg, sdAvg;
    if (isPrecisionType) {
      const meanErrNs = sessions.map(s => s.meanErrN || 0).filter(v => Number.isFinite(v));
      const sdErrNs = sessions.map(s => s.sdErrN || 0).filter(v => Number.isFinite(v));
      meanAvg = meanErrNs.length > 0 ? mean(meanErrNs) : 0;
      sdAvg = sdErrNs.length > 0 ? mean(sdErrNs) : 0;
    } else {
      const means = sessions.map(s => s.mean || 0).filter(v => Number.isFinite(v));
      const sds = sessions.map(s => s.sd || 0).filter(v => Number.isFinite(v));
      meanAvg = means.length > 0 ? mean(means) : 0;
      sdAvg = sds.length > 0 ? mean(sds) : 0;
    }

    // Update both language spans in baselineInfo
    const infoEn = baselineInfo.querySelector(".lang-en");
    const infoNo = baselineInfo.querySelector(".lang-no");
    const infoLt = baselineInfo.querySelector(".lang-lt");
    const prefix = (isGoNoGo || isDivided) ? "GO " : "";
    if (infoEn) {
      const enSessionWord = sessions.length === 1 ? "session" : "sessions";
      if (isPrecisionType) {
        infoEn.textContent =
          `${sessions.length} ${enSessionWord} | ` +
          `Mean error: ${meanAvg.toFixed(2)} | ` +
          `SD: ${sdAvg.toFixed(2)}`;
      } else {
        infoEn.textContent =
          `${sessions.length} ${enSessionWord} | ` +
          `${prefix}Mean: ${meanAvg.toFixed(0)} ms | ` +
          `${prefix}SD: ${sdAvg.toFixed(0)} ms`;
      }
    }
    if (infoNo) {
      if (isPrecisionType) {
        infoNo.textContent =
          `${sessions.length} økter | ` +
          `Baseline-feil: ${meanAvg.toFixed(2)} | ` +
          `Baseline SD: ${sdAvg.toFixed(2)}`;
      } else {
        infoNo.textContent =
          `${sessions.length} økter | ` +
          `${prefix}Baseline-gjennomsnitt: ${meanAvg.toFixed(0)} ms | ` +
          `${prefix}Baseline SD: ${sdAvg.toFixed(0)} ms`;
      }
    }
    if (infoLt) {
      if (isPrecisionType) {
        infoLt.textContent =
          `${sessions.length} sesijos | ` +
          `Bazinio lygio klaida: ${meanAvg.toFixed(2)} | ` +
          `Bazinio lygio SD: ${sdAvg.toFixed(2)}`;
      } else {
        infoLt.textContent =
          `${sessions.length} sesijos | ` +
          `${prefix}Bazinio lygio vidurkis: ${meanAvg.toFixed(0)} ms | ` +
          `${prefix}Bazinio lygio SD: ${sdAvg.toFixed(0)} ms`;
      }
    }

    if (baselineStatusInfo) {
      if (sessions.length >= 3) {
        baselineStatusInfo.textContent = `${t("baseline.statusLabel")}: ${t("baseline.statusReady")}`;
      } else {
        baselineStatusInfo.textContent = `${t("baseline.statusLabel")}: ${t("baseline.statusBuilding")} (${sessions.length}/3)`;
      }
    }
    if (baselineLastUpdateInfo) {
      const latestSession = sessions.reduce((latest, s) => {
        const ts = Date.parse(s && s.timestamp ? s.timestamp : "");
        if (!Number.isFinite(ts)) return latest;
        if (!latest) return s;
        const prevTs = Date.parse(latest.timestamp || "");
        if (!Number.isFinite(prevTs) || ts > prevTs) return s;
        return latest;
      }, null);
      let timeText = "-";
      if (latestSession && latestSession.timestamp) {
        timeText = formatTs(latestSession.timestamp);
      }
      baselineLastUpdateInfo.textContent = `${t("baseline.lastSessionLabel")}: ${timeText}`;
    }
  
    // Render newest first
    const newestFirst = [...sessions].reverse();
  
    for (const s of newestFirst) {
      const li = document.createElement("li");
      const tt = testType.value;
      if (tt === "precision" && typeof s.meanErrN === "number" && typeof s.sdErrN === "number") {
        li.textContent =
          `${formatTime(s.timestamp)} — err ${s.meanErrN.toFixed(2)}, SD ${s.sdErrN.toFixed(2)} (${s.trials} ${t("history.trials")})`;
      } else if (typeof s.mean === "number" && typeof s.sd === "number") {
        li.textContent =
          `${formatTime(s.timestamp)} — ${t("history.mean")} ${s.mean.toFixed(0)} ms, ${t("history.sd")} ${s.sd.toFixed(0)} ms (${s.trials} ${t("history.trials")})`;
      } else {
        // Fallback for malformed entries
        li.textContent = `${formatTime(s.timestamp)} — ${t("history.trials")} ${s.trials || 0}`;
      }
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
  if (tt === "precision") return "fce_baseline_precision_v1";
  return "fce_baseline_reaction_v1";
}

// Get baseline statistics used for comparison (single source of truth)
// Returns the same mean/SD used by statusLabelFromCompare and getDividedAttentionStatus
// For precision: uses meanErrN/sdErrN; for others: uses mean/sd
// This is the mean of per-session SDs (not stddev of session means)
function getBaselineForCompare(testType) {
  try {
    const key = baselineKeyFor(testType);
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    
    const baselineSessionsRaw = JSON.parse(raw);
    const baselineSessions = filterValidBaselineSessions(baselineSessionsRaw);
    
    if (baselineSessions.length === 0) return null;
    
    const isPrecision = testType === "precision";
    
    if (isPrecision) {
      const baselineMean = mean(baselineSessions.map(s => s.meanErrN || 0));
      const baselineSD = mean(baselineSessions.map(s => s.sdErrN || 0));
      return {
        mean: baselineMean,
        sd: baselineSD,
        n: baselineSessions.length,
        isPrecision: true
      };
    } else {
      const baselineMean = mean(baselineSessions.map(s => s.mean || 0));
      const baselineSD = mean(baselineSessions.map(s => s.sd || 0));
      return {
        mean: baselineMean,
        sd: baselineSD,
        n: baselineSessions.length,
        isPrecision: false
      };
    }
  } catch {
    return null;
  }
}

function minBaselineSessions() {
  return 3;
}

// Helper to filter valid baseline sessions (excludes invalid/malformed entries)
function filterValidBaselineSessions(sessions) {
  if (!Array.isArray(sessions)) return [];
  return sessions.filter(s => {
    if (!s) return false;
    // For precision, check meanErrN/sdErrN; for others, check mean/sd
    const hasPrecisionMetrics = typeof s.meanErrN === "number" && typeof s.sdErrN === "number";
    const hasStandardMetrics = typeof s.mean === "number" && typeof s.sd === "number";
    
    if (!hasPrecisionMetrics && !hasStandardMetrics) return false;
    
    if (hasPrecisionMetrics) {
      if (Number.isNaN(s.meanErrN) || Number.isNaN(s.sdErrN) || !Number.isFinite(s.meanErrN) || !Number.isFinite(s.sdErrN)) return false;
    }
    if (hasStandardMetrics) {
      if (Number.isNaN(s.mean) || Number.isNaN(s.sd) || !Number.isFinite(s.mean) || !Number.isFinite(s.sd)) return false;
    }
    
    // Check if it's not marked as invalid (safety check)
    if (s.flags && s.flags.invalid === true) return false;
    return true;
  });
}

function recommendedTrialsPerSession() {
  const tt = testType.value;
  if (tt === "gonogo") return 20;
  if (tt === "divided") return 10; // Divided attention needs enough trials for flashes
  if (tt === "precision") return 25; // Precision baseline default
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
  const tt = session.testType || testType?.value || "reaction";
  const isPrecision = tt === "precision";
  
  if (totalTrials === 0) return "not_usable";
  
  // Precision-specific quality calculation
  if (isPrecision) {
    const respondedTrials = metrics.respondedTrials || 0;
    const timeouts = metrics.timeouts || 0;
    const misses = metrics.misses || 0;
    const hits = metrics.hits || 0;
    
    if (respondedTrials === 0) return "not_usable";
    
    const timeoutRate = totalTrials > 0 ? timeouts / totalTrials : 0;
    const missRate = respondedTrials > 0 ? misses / respondedTrials : 0;
    const hitRate = respondedTrials > 0 ? hits / respondedTrials : 0;
    
    // Thresholds for "mixed" quality for precision
    const hasHighTimeoutRate = timeoutRate > 0.20;
    const hasHighMissRate = missRate > 0.35;
    const hasLowHitRate = hitRate < 0.50;
    
    if (hasHighTimeoutRate || hasHighMissRate || hasLowHitRate) {
      return "mixed";
    }
    
    return "good";
  }
  
  // Calculate error rates for other test types
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
    issues.push(t("quality.warning.manyFalseStarts"));
  }
  if (validHitRate < 0.5) {
    issues.push(t("quality.warning.fewValidHits"));
  }
  
  if (issues.length > 0) {
    const joiner = t("quality.warning.joiner");
    const issuesText = issues.join(` ${joiner} `);
    return t("quality.warning.note").replace("{issues}", issuesText);
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
  // q is a quality key: "good", "mixed", "poor", "not_usable", "na", or undefined
  // Check the key directly (language-safe) rather than translated text
  if (!q) return "na";
  const key = String(q).toLowerCase().trim();
  // Exact key matching (language-safe)
  if (key === "good") return "ok";
  if (key === "mixed") return "warn";
  if (key === "poor" || key === "bad" || key === "not_usable") return "bad";
  if (key === "na") return "na";
  return "na";
}

function expectedTrialsFor(tt) {
  if (tt === "gonogo") return 20;
  if (tt === "precision") return 25; // Baseline default
  return 10;
}

function sdChipClass(sd, baselineSD) {
  if (!Number.isFinite(sd) || !Number.isFinite(baselineSD) || baselineSD <= 0) return "na";
  if (sd <= baselineSD * 1.25) return "ok";
  if (sd <= baselineSD * 1.75) return "warn";
  return "bad";
}

// Compute baseline mean/sd from baseline sessions (excluding invalid)
// NOTE: This function computes SD as stddev of baseline session means (variance of means).
// This gives a small number (e.g., ±2 ms) representing variability BETWEEN sessions.
// DO NOT use this SD for "typical day-to-day variation" in Trend - it's different from
// the comparison SD (mean of per-session SDs, e.g., ±37 ms) used by statusLabelFromCompare.
// Use getBaselineForCompare() instead for Trend display and status comparisons.
function computeBaselineFromHistory(sessions) {
  // Determine test type from first session or current selection
  const firstSession = sessions.find(s => s && s.mode === "baseline");
  const tt = firstSession?.testType || testType?.value || "reaction";
  const isPrecision = tt === "precision";
  
  const base = sessions
    .filter(s => s && s.mode === "baseline" && s.flags && s.flags.invalid === false)
    .map(s => {
      if (isPrecision) {
        return s.metrics && typeof s.metrics.avgErrN === "number" ? s.metrics.avgErrN : null;
      } else {
        return s.metrics && typeof s.metrics.avgMs === "number" ? s.metrics.avgMs : null;
      }
    })
    .filter(v => typeof v === "number" && !Number.isNaN(v));

  if (base.length < 1) return null;

  // Compute mean and stddev of baseline session means (variance of means)
  // This SD represents variability BETWEEN sessions, not within-session variation
  const m = base.reduce((a, b) => a + b, 0) / base.length;
  const variance = base.length > 1
    ? base.reduce((acc, x) => acc + Math.pow(x - m, 2), 0) / (base.length - 1)
    : 0;

  const sd = Math.sqrt(variance);
  return { mean: m, sd, n: base.length, isPrecision };
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

// Helper: get unit string for delta/avg display based on test type
function getUnitForTest(testType) {
  const tt = String(testType || "").toLowerCase();
  if (tt === "reaction") return "ms";
  if (tt === "gonogo") return "ms";
  if (tt === "divided") return "ms"; // Divided attention uses avgMs for comparison
  if (tt === "precision") return ""; // Precision uses normalized error, no unit
  return "ms"; // Default fallback
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
    const isPrecision = tt === "precision";
    const avg = isPrecision ? s?.metrics?.avgErrN : s?.metrics?.avgMs;
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
        let baselineMean, baselineSD;
        if (isPrecision) {
          baselineMean = mean(baselineSessions.map(bs => bs.meanErrN || 0));
          baselineSD = mean(baselineSessions.map(bs => bs.sdErrN || 0));
        } else {
          baselineMean = mean(baselineSessions.map(bs => bs.mean || 0));
          baselineSD = mean(baselineSessions.map(bs => bs.sd || 0));
        }
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

    let avgStr;
    if (isPrecision) {
      avgStr = (typeof avg === "number") ? `${fmt(avg, 2)}` : "—";
    } else {
      avgStr = (typeof avg === "number") ? `${fmt(avg, 0)} ms` : "—";
    }
    const trialsStr = (typeof trials === "number") ? `${trials}` : "—";

    metrics.innerHTML = `
      <span><strong>${avgStr}</strong></span>
      <span>${t("history.trials")}: <strong>${trialsStr}</strong></span>
    `;

    const status = document.createElement("div");
    status.className = "muted";
    status.textContent = statusText || "";

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

  // Get baseline for comparison (same SD used in statusLabelFromCompare)
  // This uses mean of per-session SDs, not stddev of session means
  const compareBaseline = getBaselineForCompare(testType);

  if (!compareBaseline) {
    baselineLine.innerHTML = `<p class="muted">${t("trend.noBaseline")}</p>`;
  } else {
    const isPrecision = compareBaseline.isPrecision || testType === "precision";
    
    // Build new human-readable baseline header
    const header = document.createElement("div");
    header.className = "muted";
    header.style.marginBottom = "8px";
    header.textContent = t("trend.baselineHeader");
    
    const typicalLine = document.createElement("div");
    typicalLine.className = "muted";
    typicalLine.style.marginTop = "4px";
    // Use test-type-specific typical label
    const typicalKey = `trend.typical.${testType}`;
    const typicalLabel = t(typicalKey) || (isPrecision ? t("trend.typical.precision") : t("trend.typical.reaction"));
    typicalLine.textContent = `${typicalLabel} ${fmt(compareBaseline.mean, isPrecision ? 2 : 0)}${isPrecision ? "" : " ms"}`;
    
    // Only show variation if SD is valid and positive
    const variationLine = document.createElement("div");
    variationLine.className = "muted";
    variationLine.style.marginTop = "4px";
    if (Number.isFinite(compareBaseline.sd) && compareBaseline.sd > 0) {
      variationLine.textContent = `${t("trend.variation")} ±${fmt(compareBaseline.sd, isPrecision ? 2 : 0)}${isPrecision ? "" : " ms"}`;
    } else {
      variationLine.textContent = `${t("trend.variation")} —`;
    }
    
    const guideLine = document.createElement("div");
    guideLine.className = "muted";
    guideLine.style.marginTop = "8px";
    guideLine.style.fontSize = "13px";
    guideLine.textContent = t("trend.guideHelp");
    
    baselineLine.innerHTML = "";
    baselineLine.appendChild(header);
    baselineLine.appendChild(typicalLine);
    baselineLine.appendChild(variationLine);
    baselineLine.appendChild(guideLine);
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
    const isPrecision = testType === "precision" || s?.testType === "precision";
    const avg = isPrecision ? s?.metrics?.avgErrN : s?.metrics?.avgMs;
    const isInvalid = !!(s?.flags?.invalid);
    const when = formatDateTime(s?.createdAt || s?.id);
    // Use compareBaseline.mean for delta calculation (same as used for status)
    const delta = (compareBaseline && typeof avg === "number" && Number.isFinite(compareBaseline.mean)) 
      ? (avg - compareBaseline.mean) 
      : null;

    // Compute status using same logic as renderHistory (single source of truth)
    let statusText = s?.statusText || "";
    if (!statusText && !isInvalid && Number.isFinite(avg)) {
      // Load baseline sessions the same way as renderHistory
      const baselineSessionsRaw = (() => {
        try {
          const key = baselineKeyFor(testType);
          const raw = localStorage.getItem(key);
          return raw ? JSON.parse(raw) : [];
        } catch {
          return [];
        }
      })();
      const baselineSessions = filterValidBaselineSessions(baselineSessionsRaw);
      
      if (baselineSessions.length > 0) {
        if (testType === "divided") {
          // For divided attention, use multi-metric comparison
          const m = s.metrics || {};
          const sessionPayloadMock = {
            mean: avg,
            falseAlarms: m.falseAlarms || 0,
            trials: m.trials || 0,
            nogoCount: m.nogoCount || 0,
            flashAbsError: m.flashAbsError || 0
          };
          statusText = getDividedAttentionStatus(sessionPayloadMock, baselineSessions);
        } else if (isPrecision) {
          // Precision: compare meanErrN
          const baselineMeanErrN = mean(baselineSessions.map(bs => bs.meanErrN || 0));
          const baselineSDErrN = mean(baselineSessions.map(bs => bs.sdErrN || 0));
          statusText = statusLabelFromCompare(avg, baselineMeanErrN, baselineSDErrN);
        } else {
          // For reaction and gonogo, use avgMs
          const baselineMean = mean(baselineSessions.map(bs => bs.mean || 0));
          const baselineSD = mean(baselineSessions.map(bs => bs.sd || 0));
          statusText = statusLabelFromCompare(avg, baselineMean, baselineSD);
        }
      }
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
    sub.textContent = statusText ? `${t("trend.result")} ${statusText}` : "";
    left.appendChild(sub);

    const right = document.createElement("div");
    right.className = "trend-right";

    const avgLine = document.createElement("div");
    if (isPrecision) {
      avgLine.innerHTML = `<strong>${fmt(avg, 2)}</strong>`;
    } else {
      avgLine.innerHTML = `<strong>${fmt(avg, 0)}</strong> ms`;
    }
    right.appendChild(avgLine);

    const deltaLine = document.createElement("div");
    deltaLine.className = "muted";
    if (delta !== null && Number.isFinite(delta)) {
      const deltaSigned = delta >= 0 ? `+${fmt(delta, isPrecision ? 2 : 0)}` : fmt(delta, isPrecision ? 2 : 0);
      const unit = getUnitForTest(testType);
      const deltaWithUnit = unit ? `${deltaSigned} ${unit}` : deltaSigned;
      deltaLine.textContent = t("trend.delta").replace("{delta}", deltaWithUnit);
    } else {
      deltaLine.textContent = "";
    }
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
  // Match by data-session-id attribute (language-independent)
  const expandedSessions = new Set();
  if (historyListEl) {
    const existingCards = historyListEl.querySelectorAll(".history-card.is-open");
    existingCards.forEach(card => {
      // Use data-session-id attribute instead of formatted timestamp
      // This is language-independent and won't break when language changes
      const sessionId = card.getAttribute("data-session-id");
      if (sessionId) {
        expandedSessions.add(sessionId);
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
    historyEmpty.textContent = t("history.empty");
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

  // For precision, use meanErrN/sdErrN; for others, use mean/sd
  const baselineMean = baselineSessions.length 
    ? (tt === "precision" 
        ? mean(baselineSessions.map(s => s.meanErrN || 0))
        : mean(baselineSessions.map(s => s.mean || 0)))
    : NaN;
  const baselineSD = baselineSessions.length 
    ? (tt === "precision"
        ? mean(baselineSessions.map(s => s.sdErrN || 0))
        : mean(baselineSessions.map(s => s.sd || 0)))
    : NaN;

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
    // Precision uses different metric names
    const avg = tt === "precision" ? Number(m.avgErrN) : Number(m.avgMs);
    const sd = tt === "precision" ? Number(m.sdErrN) : Number(m.sdMs);
    const best = tt === "precision" ? Number(m.bestErrN) : Number(m.bestMs);
    const worst = tt === "precision" ? Number(m.worstErrN) : Number(m.worstMs);
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
      } else if (tt === "precision") {
        // Precision: compare meanErrN
        const baselineMeanErrN = mean(baselineSessions.map(bs => bs.meanErrN || 0));
        const baselineSDErrN = mean(baselineSessions.map(bs => bs.sdErrN || 0));
        statusText = statusLabelFromCompare(avg, baselineMeanErrN, baselineSDErrN);
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
        badgeText = t("history.noBaseline");
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

    // Precision: chips depend on validity
    if (tt === "precision") {
      if (isInvalid) {
        // Invalid sessions: show "Not usable" chip only
        const chip = document.createElement("span");
        chip.className = "chip bad";
        chip.textContent = t("history.precision.notUsable");
        chips.appendChild(chip);
      } else {
        // Valid sessions: show Accuracy, Consistency SD, Hits
        // 1) Accuracy
        if (Number.isFinite(avg)) {
          const chip = document.createElement("span");
          chip.className = `chip ${avgClass}`;
          chip.textContent = `${t("history.precision.labels.accuracy")} ${avg.toFixed(2)}`;
          chips.appendChild(chip);
        }
        // 2) Consistency SD
        if (Number.isFinite(sd)) {
          const chip = document.createElement("span");
          chip.className = `chip ${sdClass}`;
          chip.textContent = `${t("session.chip.consistency")} ${sd.toFixed(2)}`;
          chips.appendChild(chip);
        }
        // 3) Hits
        const hits = m.hits || 0;
        const respondedTrials = m.respondedTrials || 0;
        if (respondedTrials > 0) {
          const hitRate = Math.round((hits / respondedTrials) * 100);
          const chip = document.createElement("span");
          chip.className = "chip";
          chip.textContent = `${t("history.precision.labels.hits")} ${hitRate}%`;
          chips.appendChild(chip);
        }
      }
    } else {
      // Other tests: Always show: Avg, SD, Trials
      if (Number.isFinite(avg)) {
        const chip = document.createElement("span");
        chip.className = `chip ${avgClass}`;
        chip.textContent = `${t("session.chip.avg")} ${avg.toFixed(0)}ms`;
        chips.appendChild(chip);
      }
      if (Number.isFinite(sd)) {
        const chip = document.createElement("span");
        chip.className = `chip ${sdClass}`;
        chip.textContent = `${t("session.chip.consistency")} ${sd.toFixed(0)}ms`;
        chips.appendChild(chip);
      }
      if (Number.isFinite(trials)) {
        const chip = document.createElement("span");
        chip.className = `chip ${trialsClass}`;
        chip.textContent = `${t("session.chip.trials")} ${trials}`;
        chips.appendChild(chip);
      }
    }
    
    // Test-specific metrics (non-precision)
    if (tt !== "precision") {
      if (tt === "gonogo") {
        // Compact error indicator: single chip instead of individual error pills
        const misses = m.misses ?? 0;
        const falseAlarms = m.falseAlarms ?? 0;
        const falseStarts = m.falseStarts ?? 0;
        const hasErrors = misses > 0 || falseAlarms > 0 || falseStarts > 0;
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.textContent = hasErrors ? t("history.gonogo.errors.present") : t("history.gonogo.errors.none");
        chips.appendChild(chip);
      } else if (tt === "divided") {
        // Compact error indicator: single chip instead of multiple
        const misses = m.misses ?? 0;
        const falseAlarms = m.falseAlarms ?? 0;
        const flashAbsError = (typeof m.flashAbsError === "number" && Number.isFinite(m.flashAbsError)) ? m.flashAbsError : 0;
        const hasErrors = misses > 0 || falseAlarms > 0 || flashAbsError > 0;
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.textContent = hasErrors ? t("history.divided.errors.present") : t("history.divided.errors.none");
        chips.appendChild(chip);
      }
    }
    
    summary.appendChild(chips);
    
    // Muted support line for go/no-go (under chips) - show NO-GO context and error breakdown if present
    if (tt === "gonogo") {
      const nogoCount = (typeof m.nogoCount === "number" && Number.isFinite(m.nogoCount)) ? m.nogoCount : 0;
      const misses = m.misses ?? 0;
      const falseAlarms = m.falseAlarms ?? 0;
      const falseStarts = m.falseStarts ?? 0;
      
      // Show NO-GO trials context if available
      if (nogoCount > 0) {
        const nogoLine = document.createElement("div");
        nogoLine.className = "muted";
        nogoLine.style.marginTop = "8px";
        nogoLine.style.fontSize = "13px";
        nogoLine.textContent = `${t("history.gonogo.nogoTrials")}: ${nogoCount}`;
        summary.appendChild(nogoLine);
      }
      
      // Show error breakdown if errors present (only non-zero values)
      const parts = [];
      if (falseAlarms > 0) {
        parts.push(`${t("history.falseAlarms")}: ${falseAlarms}`);
      }
      if (misses > 0) {
        parts.push(`${t("history.misses")}: ${misses}`);
      }
      if (falseStarts > 0) {
        parts.push(`${t("history.falseStarts")}: ${falseStarts}`);
      }
      
      if (parts.length > 0) {
        const supportLine = document.createElement("div");
        supportLine.className = "muted";
        supportLine.style.marginTop = "4px";
        supportLine.style.fontSize = "13px";
        supportLine.textContent = parts.join(" · ");
        summary.appendChild(supportLine);
      }
    }
    
    // Muted support line for divided attention (under chips) - show flash context and error breakdown if present
    if (tt === "divided") {
      const ft = (typeof m.flashTargetCount === "number" && Number.isFinite(m.flashTargetCount)) ? m.flashTargetCount : 0;
      const fa = (typeof m.flashUserCount === "number" && Number.isFinite(m.flashUserCount)) ? m.flashUserCount : 0;
      const flashMismatch = (Number.isFinite(ft) && Number.isFinite(fa) && ft !== fa);
      const falseAlarms = m.falseAlarms ?? 0;
      const misses = m.misses ?? 0;
      
      // Show flash context if target is available
      if (Number.isFinite(ft) && ft > 0) {
        const flashLine = document.createElement("div");
        flashLine.className = "muted";
        flashLine.style.marginTop = "8px";
        flashLine.style.fontSize = "13px";
        flashLine.textContent = t("history.divided.flashesFormat")
          .replace("{answered}", fa)
          .replace("{target}", ft);
        summary.appendChild(flashLine);
      }
      
      // Show error breakdown if errors present
      const parts = [];
      if (flashMismatch) {
        parts.push(t("history.divided.flashMismatch")
          .replace("{answered}", fa)
          .replace("{target}", ft));
      }
      if (falseAlarms > 0) {
        parts.push(`${t("history.falseAlarms")}: ${falseAlarms}`);
      }
      if (misses > 0) {
        parts.push(`${t("history.misses")}: ${misses}`);
      }
      
      if (parts.length > 0) {
        const supportLine = document.createElement("div");
        supportLine.className = "muted";
        supportLine.style.marginTop = "4px";
        supportLine.style.fontSize = "13px";
        supportLine.textContent = parts.join("; ");
        summary.appendChild(supportLine);
      }
    }
    
    // Muted support line for precision (under chips)
    if (tt === "precision") {
      if (isInvalid) {
        // Invalid sessions: show "Not usable" and reason
        const supportLine = document.createElement("div");
        supportLine.className = "muted";
        supportLine.style.marginTop = "8px";
        supportLine.style.fontSize = "13px";
        const refusalCode = s.flags?.refusalCode;
        const reasonText = refusalCode ? getRefusalReasonText(refusalCode) : t("history.precision.reasonGeneric");
        supportLine.textContent = `${t("history.precision.notUsable")} — ${t("history.precision.reasonPrefix")} ${reasonText}`;
        summary.appendChild(supportLine);
      } else {
        // Valid sessions: show execution metrics
        const hits = m.hits || 0;
        const respondedTrials = m.respondedTrials || 0;
        const misses = m.misses || 0;
        const timeouts = m.timeouts || 0;
        const meanRtMs = m.meanRtMs || 0;
        const supportLine = document.createElement("div");
        supportLine.className = "muted";
        supportLine.style.marginTop = "8px";
        supportLine.style.fontSize = "13px";
        
        const parts = [];
        if (respondedTrials > 0) {
          const hitRate = Math.round((hits / respondedTrials) * 100);
          parts.push(`${hitRate}% ${t("history.precision.labels.hits")}`);
        }
        if (misses > 0) {
          parts.push(`${misses} ${t("history.precision.misses")}`);
        }
        if (timeouts > 0) {
          parts.push(`${timeouts} ${t("history.precision.timeouts")}`);
        }
        if (Number.isFinite(meanRtMs) && meanRtMs > 0) {
          const rtLabel = currentLang === "no" ? `snitt ${t("history.precision.rt")}` : currentLang === "lt" ? `vid. ${t("history.precision.rt")}` : `avg ${t("history.precision.rt")}`;
          parts.push(`${rtLabel} ${Math.round(meanRtMs)} ms`);
        }
        if (Number.isFinite(trials)) {
          parts.push(`${trials} ${t("history.trials")}`);
        }
        
        supportLine.textContent = parts.join(" · ");
        summary.appendChild(supportLine);
      }
    }
    
    // Affordance text
    const affordance = document.createElement("div");
    affordance.className = "history-affordance";
    affordance.textContent = t("history.clickToViewDetails");
    summary.appendChild(affordance);
    card.appendChild(summary);

    // Details section (collapsed by default)
    const details = document.createElement("div");
    details.className = "history-details";

    // Detailed lines in details section
    if (tt === "precision") {
      // Precision: grouped sections
      if (isInvalid) {
        // Invalid sessions: show Execution block only
        const executionSection = document.createElement("div");
        executionSection.className = "history-line";
        executionSection.innerHTML = `<strong>${t("history.precision.labels.execution")}</strong>`;
        details.appendChild(executionSection);
        
        const executionLine = document.createElement("div");
        executionLine.className = "history-line muted";
        const hits = m.hits || 0;
        const respondedTrials = m.respondedTrials || 0;
        const misses = m.misses || 0;
        const timeouts = m.timeouts || 0;
        const falseStarts = m.falseStarts || 0;
        const meanRtMs = m.meanRtMs || 0;
        const sdRtMs = m.sdRtMs || 0;
        
        const execParts = [];
        if (respondedTrials > 0) {
          const hitRate = Math.round((hits / respondedTrials) * 100);
          execParts.push(`${t("history.precision.labels.hits")}: ${hitRate}% (${respondedTrials} ${t("history.precision.responded")})`);
        }
        execParts.push(`${t("history.precision.labels.misses")}: ${misses}`);
        if (falseStarts > 0) {
          execParts.push(`${t("history.falseStarts")}: ${falseStarts}`);
        }
        execParts.push(`${t("history.precision.labels.timeouts")}: ${timeouts}`);
        if (Number.isFinite(meanRtMs) && meanRtMs > 0) {
          execParts.push(`${t("history.precision.labels.avgRt")}: ${Math.round(meanRtMs)} ms`);
          if (Number.isFinite(sdRtMs) && sdRtMs > 0) {
            execParts.push(`${t("history.precision.labels.sd")}: ${Math.round(sdRtMs)} ms`);
          }
        }
        executionLine.textContent = execParts.join(" · ");
        details.appendChild(executionLine);
      } else {
        // Valid sessions: show full breakdown (Accuracy, Consistency, Execution)
        // SECTION: Accuracy
        const accuracySection = document.createElement("div");
        accuracySection.className = "history-line";
        accuracySection.innerHTML = `<strong>${t("history.precision.labels.accuracy")}</strong>`;
        details.appendChild(accuracySection);
        
        const accuracyLine = document.createElement("div");
        accuracyLine.className = "history-line muted";
        const avgErrN = Number.isFinite(avg) ? avg.toFixed(2) : "—";
        const bestErrN = Number.isFinite(best) ? best.toFixed(2) : "—";
        const worstErrN = Number.isFinite(worst) ? worst.toFixed(2) : "—";
        accuracyLine.textContent = `${t("session.detail.avg")}: ${avgErrN} · ${t("history.best")}: ${bestErrN} · ${t("history.worst")}: ${worstErrN}`;
        details.appendChild(accuracyLine);
        
        // SECTION: Consistency
        const consistencySection = document.createElement("div");
        consistencySection.className = "history-line";
        consistencySection.innerHTML = `<strong>${t("history.precision.labels.consistency")}</strong>`;
        details.appendChild(consistencySection);
        
        const consistencyLine = document.createElement("div");
        consistencyLine.className = "history-line muted";
        const sdErrN = Number.isFinite(sd) ? sd.toFixed(2) : "—";
        consistencyLine.textContent = `${t("history.precision.labels.variability")}: ${sdErrN}`;
        details.appendChild(consistencyLine);
        
        // SECTION: Execution
        const executionSection = document.createElement("div");
        executionSection.className = "history-line";
        executionSection.innerHTML = `<strong>${t("history.precision.labels.execution")}</strong>`;
        details.appendChild(executionSection);
        
        const executionLine = document.createElement("div");
        executionLine.className = "history-line muted";
        const hits = m.hits || 0;
        const respondedTrials = m.respondedTrials || 0;
        const misses = m.misses || 0;
        const timeouts = m.timeouts || 0;
        const meanRtMs = m.meanRtMs || 0;
        const sdRtMs = m.sdRtMs || 0;
        
        const execParts = [];
        if (respondedTrials > 0) {
          const hitRate = Math.round((hits / respondedTrials) * 100);
          execParts.push(`${t("history.precision.labels.hits")}: ${hitRate}% (${respondedTrials} ${t("history.precision.responded")})`);
        }
        execParts.push(`${t("history.precision.labels.misses")}: ${misses}`);
        execParts.push(`${t("history.precision.labels.timeouts")}: ${timeouts}`);
        if (Number.isFinite(meanRtMs) && meanRtMs > 0) {
          execParts.push(`${t("history.precision.labels.avgRt")}: ${Math.round(meanRtMs)} ms`);
          if (Number.isFinite(sdRtMs) && sdRtMs > 0) {
            execParts.push(`${t("history.precision.labels.sd")}: ${Math.round(sdRtMs)} ms`);
          }
        }
        executionLine.textContent = execParts.join(" · ");
        details.appendChild(executionLine);
      }
    } else {
      // Other tests: original format
      const line1 = document.createElement("div");
      line1.className = "history-line";
      line1.textContent = `${t("session.detail.avg")} ${Number.isFinite(avg) ? avg.toFixed(0) : "—"} ms · ${t("session.detail.consistency")} ${Number.isFinite(sd) ? sd.toFixed(0) : "—"} ms · ${t("session.detail.trials")} ${Number.isFinite(trials) ? trials : "—"}`;
      details.appendChild(line1);

      const line2 = document.createElement("div");
      line2.className = "history-line muted";
      line2.textContent = `${t("history.best")} ${Number.isFinite(best) ? best.toFixed(0) : "—"} · ${t("history.worst")} ${Number.isFinite(worst) ? worst.toFixed(0) : "—"}`;
      details.appendChild(line2);
    }

    if (tt === "gonogo") {
      // Go/No-Go: NO-GO context and error breakdown are shown in summary section
      // Expanded details section shows only additional info (best/worst, comparison, tags, quality, trials)
      // No duplicate error breakdown here - summary already provides complete high-level explanation
    } else if (tt === "divided") {
      // Divided Attention: flash context and error breakdown are shown in summary section
      // Expanded details section shows only additional info (comparison, tags, quality, trials)
      // No duplicate lines here - summary already provides complete high-level explanation
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
        } else if (tt === "precision") {
          const baselineMeanErrN = mean(baselineSessions.map(bs => bs.meanErrN || 0));
          const baselineSDErrN = mean(baselineSessions.map(bs => bs.sdErrN || 0));
          return statusLabelFromCompare(avg, baselineMeanErrN, baselineSDErrN);
        } else {
          return statusLabelFromCompare(avg, baselineMean, baselineSD);
        }
      })();
      let delta, baselineValue, baselineSDValue;
      if (tt === "precision") {
        const baselineMeanErrN = mean(baselineSessions.map(bs => bs.meanErrN || 0));
        const baselineSDErrN = mean(baselineSessions.map(bs => bs.sdErrN || 0));
        delta = Number.isFinite(avg) && Number.isFinite(baselineMeanErrN) ? (avg - baselineMeanErrN) : NaN;
        baselineValue = baselineMeanErrN;
        baselineSDValue = baselineSDErrN;
      } else {
        delta = Number.isFinite(avg) && Number.isFinite(baselineMean) ? (avg - baselineMean) : NaN;
        baselineValue = baselineMean;
        baselineSDValue = baselineSD;
      }
      // Add a single divider before comparison section
      // Check if there's already content in details (metrics lines) - if so, add divider
      const hasPreviousContent = details.children.length > 0;
      if (hasPreviousContent) {
        const divider = document.createElement("div");
        divider.style.borderTop = "1px solid rgba(255, 255, 255, 0.1)";
        divider.style.marginTop = "8px";
        divider.style.paddingTop = "0";
        divider.style.height = "0";
        details.appendChild(divider);
      }
      
      const cmp = document.createElement("div");
      // Remove border-top from container to avoid double divider
      cmp.className = "history-compare";
      cmp.style.borderTop = "none";
      cmp.style.marginTop = "0";
      cmp.style.paddingTop = "10px";
      // Replace legacy SD-heavy comparison with two clean sentences for all test types
      const deltaSigned = Number.isFinite(delta) 
        ? (delta >= 0 ? "+" : "") + (tt === "precision" ? delta.toFixed(2) : delta.toFixed(0))
        : "—";
      const unit = getUnitForTest(tt);
      const deltaWithUnit = unit ? `${deltaSigned} ${unit}` : deltaSigned;
      const line1 = document.createElement("div");
      line1.className = "history-compare";
      line1.style.borderTop = "none";
      line1.style.paddingTop = "0";
      line1.style.marginTop = "0";
      line1.textContent = t("session.detail.compare.line1").replace("{delta}", deltaWithUnit);
      cmp.appendChild(line1);
      // Always show line2 with status-specific explanation
      const line2 = document.createElement("div");
      line2.className = "history-compare muted";
      line2.style.marginTop = "4px";
      // Determine which line2 variant to use based on status
      let line2Key = "session.detail.compare.line2.within"; // default
      if (status === t("status.slightly")) {
        line2Key = "session.detail.compare.line2.slightly";
      } else if (status === t("status.significantly")) {
        line2Key = "session.detail.compare.line2.significantly";
      }
      line2.textContent = t(line2Key);
      cmp.appendChild(line2);
      details.appendChild(cmp);
    } else if (s.mode === "check" && !baselineSessions.length) {
      const cmp = document.createElement("div");
      cmp.className = "history-compare muted";
      cmp.textContent = t("history.noBaselineForComparison");
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
        const sleepLabel = t("history.tags.sleep");
        parts.push(`${sleepLabel} ${tags.sleep}/5`);
      }
      if (tags.stress) {
        const stressLabel = t("history.tags.stress");
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
        // For Precision, Go/No-Go, and Divided Attention: use reason-only text for compact display
        // For Reaction Time: show full refusal message (if it uses refusal codes)
        if (tt === "precision" || tt === "gonogo" || tt === "divided") {
          // Use helper to get reason-only text (avoids colon parsing for known codes)
          const reasonOnly = getRefusalReasonText(s.flags.refusalCode);
          const fullMessage = t(`refusal.${s.flags.refusalCode}`);
          // Check if helper returned reason-only text (different from full message)
          if (reasonOnly && reasonOnly !== fullMessage) {
            // Got reason-only text from i18n key
            reasonText = t("history.reason") + reasonOnly;
          } else {
            // Fallback: parse full message (for backward compatibility with old sessions or unknown codes)
            const colonIndex = fullMessage.indexOf(":");
            if (colonIndex >= 0) {
              reasonText = t("history.reason") + fullMessage.substring(colonIndex + 1).trim();
            } else {
              // Fallback: use full message if no colon found
              reasonText = t("history.reason") + fullMessage;
            }
          }
        } else {
          // Reaction Time: show full refusal message
          reasonText = t(`refusal.${s.flags.refusalCode}`);
        }
      } else if (s.flags.reason) {
        // Fallback to old reason format (for backward compatibility with old sessions)
        const reasonLabel = t("history.reason");
        // For Precision, Go/No-Go, and Divided: show reason with label
        if (tt === "precision" || tt === "gonogo" || tt === "divided") {
          reasonText = reasonLabel + String(s.flags.reason);
        } else {
          reasonText = reasonLabel + String(s.flags.reason);
        }
      } else if ((tt === "precision" || tt === "gonogo" || tt === "divided") && isInvalid) {
        // Invalid but no refusalCode/reason: use generic message (Precision only has precision.invalid)
        if (tt === "precision") {
          reasonText = t("history.reason") + t("precision.invalid");
        }
        // Go/No-Go and Divided don't have generic invalid messages, so skip
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
      btn.textContent = t("history.showTrials");

      const list = document.createElement("div");
      list.className = "trial-list hidden";

      if (log.length > 0) {
        list.innerHTML = log.map(row => {
          if (tt === "precision") {
            const rt = row.rt == null ? "—" : `${row.rt} ms`;
            const errN = row.errN == null ? "—" : row.errN.toFixed(2);
            // Translate outcome labels
            const outcomeText = t(`trialOutcome.${row.outcome}`) || row.outcome;
            return `<div class="trial-row"><span class="trial-i">#${row.i}</span><span class="trial-outcome">${outcomeText}</span><span class="trial-err">${t("history.precision.err")} ${errN}</span><span class="trial-rt">${rt}</span></div>`;
          }
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
          btn.textContent = t("history.hideTrials");
        } else {
          // Hide the list
          list.classList.add("hidden");
          btn.textContent = t("history.showTrials");
        }
        return false;
      }, true); // Use capture phase

      details.appendChild(btn);
      details.appendChild(list);
    }

    card.appendChild(details);
    
    // Restore expanded state if this session was expanded before re-render
    // Convert to string to match the format in data-session-id attribute
    const sessionId = String(s.createdAt || s.id);
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
    if (savedTestType && (savedTestType === "reaction" || savedTestType === "gonogo" || savedTestType === "divided" || savedTestType === "precision")) {
      testType.value = savedTestType;
      // Set default trial count and min/max based on test type (same logic as change handler)
      // Do this BEFORE updateTrialCountMax() to ensure values are set correctly
      if (savedTestType === "gonogo") {
        trialCountInput.value = 20;
        trialCountInput.setAttribute("min", "3");
      } else if (savedTestType === "precision") {
        trialCountInput.value = 15;
        trialCountInput.setAttribute("min", "10");
        trialCountInput.setAttribute("max", "40");
      } else {
        trialCountInput.value = 10;
        trialCountInput.setAttribute("min", "3");
      }
      // Trigger change handlers to update UI (after setting trial count)
      updateTrialCountMax();
      updateBaselineInfo();
      updateDividedLegend();
      updateTaskHint();
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

const FCE_IMPORT_RESULT_RESTORE_MS = 7000;
try {
  const pendingImportStatus = sessionStorage.getItem(FCE_IMPORT_RESULT_MESSAGE_KEY);
  if (pendingImportStatus != null && pendingImportStatus !== "") {
    sessionStorage.removeItem(FCE_IMPORT_RESULT_MESSAGE_KEY);
    switchView("history", { forceHistory: true });
    if (exportStatus) {
      exportStatus.textContent = pendingImportStatus;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          exportStatus.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      });
      setTimeout(() => {
        if (exportStatus && exportStatus.textContent === pendingImportStatus) {
          exportStatus.textContent = "";
        }
      }, FCE_IMPORT_RESULT_RESTORE_MS);
    }
  }
} catch {}

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
