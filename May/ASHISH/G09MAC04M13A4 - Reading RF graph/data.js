(() => {
  let CURRENT_LANGUAGE =
    typeof window !== "undefined" && window.APP_LANGUAGE ? window.APP_LANGUAGE : "en";

  const trialsData = [
    { trial: 1, rf: "1", heads: 1, outcome: "H", change: "+ 1", outcomeId: "A", changeId: "+ 1" },
    { trial: 2, rf: "0.5", heads: 1, outcome: "not H", change: "0", outcomeId: "bukan A", changeId: "0" },
    { trial: 3, rf: "0.66", heads: 2, outcome: "H", change: "+ 1", outcomeId: "A", changeId: "+ 1" },
    { trial: 4, rf: "0.5", heads: 2, outcome: "not H", change: "0", outcomeId: "bukan A", changeId: "0" },
    { trial: 5, rf: "0.6", heads: 3, outcome: "H", change: "+ 1", outcomeId: "A", changeId: "+ 1" },
  ];

  const frac = (num, den) =>
    `<span class="vfrac"><span class="vfrac-num">${num}</span><span class="vfrac-bar"></span><span class="vfrac-den">${den}</span></span>`;

  const steps = [
    { id: "intro", type: "intro" },
    { id: "tableIntro", type: "tableIntro" },
    { id: "pointsInteraction", type: "pointsInteraction" },
    { id: "formulaQuiz", type: "formulaQuiz" },
    { id: "deduceOutcomes", type: "deduceOutcomes" },
    { id: "recordChange", type: "recordChange" },
    { id: "summary", type: "summary" },
  ];

  const common = {
    images: {
      background: "./assets/DarkBG2.jpg",
      hand_cursor: "./assets/fingerTap.gif",
    },
    sfx: {
      click: "./assets/sfx/click.mp3",
      correct: "./assets/sfx/correct.mp3",
      wrong: "./assets/sfx/wrong.mp3",
      split: "./assets/sfx/split.mp3",
      zoom: "./assets/sfx/zoom.mp3",
      swoosh: "./assets/sfx/swoosh.mp3",
      tick: "./assets/sfx/tick.mp3",
    },
    trialsData,
    steps,
  };

  const appData = {
    en: {
      ...common,
      html_title: "Outcomes From a Relative Frequency Graph",
      ui: {
        welcomeTitle: "Outcomes From a Relative Frequency Graph",
        welcomeMessage:
          "When we have the relative frequency graph,<br>we can deduce the outcomes of different trials of an experiment.<br><br>Notice how the change in relative frequency actually<br>tells us a story of the outcomes appearing in each trial.",
        tapStartToBegin: "Tap START to begin!",
        startButton: "START",
        nextButton: "»",
        backButton: "«",
        startOverButton: "START OVER",
        trialLabel: "Number of trials",
        rfLabel: "Relative frequency of heads",
        introPrompt:
          'This <span class="hl-yellow">line graph</span> represents the relative frequency of getting heads in 5 trials of coin tosses.',
        tableIntroPrompt:
          'The <span class="hl-yellow">relative frequency table</span> records the number of trials, f(H), and f<sub>r</sub>(H).',
        seeTablePrompt: "Tap ‘»’ to see our relative frequency table.",
        tableFillPrompt: "Tap ‘»’ to fill the relative frequency table.",
        tapPointsPrompt: "Tap the highlighted points on the graph.",
        recordDataPrompt: "Record the information given in the graph in the table.",
        recordedAllPrompt:
          'We have recorded all the data from the graph.<br>Let’s use this to deduce the <span class="hl-yellow">outcomes in each trial.</span>',
        deducePrompt: "Let’s use this to deduce the outcomes in each trial.",
        tapNextOutcome: "Tap » to find each outcome.",
        colTrials: "Trials (n)",
        colRf: "f<sub>r</sub>(H)",
        colHeads: "f(H)",
        colHeadsSub: "f<sub>r</sub>(H) × n",
        colChange: "change in<br>f(H)",
        colOutcome: "outcome",
        weKnow: "We know",
        relativeFrequency: "Relative Frequency",
        weGet: "We get",
        knownFormula: `f<sub>r</sub>(H) = ${frac("f(H)", "n")}`,
        resultFormula: "f<sub>r</sub>(H) × n = f(H)",
        formulaQuestion: "Which formula will give us f(H)?",
        formulaOption1: frac("f<sub>r</sub>(H)", "n"),
        formulaOption2: "f<sub>r</sub>(H) × n",
        correctOptionFeedback:
          "Correct! Multiply the relative frequency by the number of trials to get the frequency of heads.",
        wrongOptionFeedback:
          `Not quite. Remember: f<sub>r</sub>(H) = ${frac("f(H)", "n")}, so rearrange to find f(H).`,
        tapCorrectOption: "Tap the correct option.",
        tapRevealHeads: "Tap ‘Reveal’ to show all f(H) values.",
        whatDoesThisTellUsButton: "What does this<br>tell us?",
        tapWhatDoesThisTellUs: "Tap the button to find out what this tells us.",
        revealButton: "Reveal",
        trialOutcomes: "outcome",
        trial1OutcomeMsg:
          "After the first trial, the frequency of HEADS is <span class='hl-yellow'>1</span>.<br>This means the outcome of Trial 1 was HEADS!",
        trial2OutcomeMsg:
          "After the second trial, the frequency of HEADS is still <span class='hl-yellow'>1</span>.<br>This means we did not get another HEADS!",
        trial3OutcomeMsg:
          "After the third trial, the frequency of HEADS changed to <span class='hl-yellow'>2</span>.<br>This means we got another HEADS as outcome!",
        trial4OutcomeMsg:
          "After the fourth trial, the frequency of HEADS stayed the same, <span class='hl-yellow'>2</span>.<br>This means we did not get HEADS!",
        trial5OutcomeMsg:
          "After the fifth trial, the frequency of HEADS changed to <span class='hl-yellow'>3</span>.<br>This means we got another HEADS as outcome!",
        tapNextExplore: "Tap » to explore more",
        tapNextPattern: "Tap » to identify the pattern",
        changeIntroMsg:
          "<span class='hl-gold'>f(H)</span> only changes when the outcome is <span class='hl-gold'>HEADS</span>,<br>otherwise it stays the same.<br><span class='formula-pink'>Change = Current f(H) − Previous f(H)</span>",
        changeIntroMsgRecording:
          "f(H) only changes when the outcome is HEADS, otherwise it stays the same. Let us record that change in the table.<br><span class='formula-pink'>Change = Current f(H) − Previous f(H)</span>",
        tapNextRecordChange: "Tap » to record the change.",
        tapNextWrap: "Tap » to wrap up.",
        tapNextSummarize: "Tap » to summarize.",
        changeLabel: "Change",
        summaryTitle: "Well Done!",
        summaryText1: "If the outcome is HEADS, the change is always + 1.",
        summaryText2: "If the outcome is NOT HEADS, the change is always 0.",
        endTitle: "A relative frequency graph can tell you what happened in each trial",
        endTeachLine: "Turn relative frequency into the real frequency using:",
        endFormula: "f(H) = f<sub>r</sub>(H) × n",
        endWatchLine: "Then watch how the frequency changes each trial:",
        endRuleUp: 'goes up by <span class="hl-yellow">1</span> → that outcome was the event',
        endRuleSame: 'stays <span class="hl-yellow">0</span> → that outcome was not the event',
        endBigRule: "The big rule: the change in frequency can only be 0 or + 1 — never anything else.",
        endMessage: "A relative frequency graph can tell you what happened in each trial.",
        instructionStartOver: "Tap START OVER to repeat this activity.",
        instructionTapContinue: "Tap » to continue.",
      },
    },
    id: {
      ...common,
      html_title: "Hasil dari Grafik Frekuensi Relatif",
      ui: {
        welcomeTitle: "Hasil dari Grafik Frekuensi Relatif",
        welcomeMessage:
          "Ketika kita memiliki grafik frekuensi relatif,<br>kita dapat menyimpulkan hasil dari berbagai uji coba eksperimen.<br><br>Perhatikan bagaimana perubahan frekuensi relatif sebenarnya<br>menceritakan kisah hasil yang muncul pada setiap uji coba.",
        tapStartToBegin: "Ketuk MULAI untuk memulai!",
        startButton: "MULAI",
        nextButton: "»",
        backButton: "«",
        startOverButton: "MULAI LAGI",
        trialLabel: "Banyak uji coba",
        rfLabel: "Frekuensi relatif angka",
        introPrompt:
          'Grafik <span class="hl-yellow">garis</span> ini menunjukkan frekuensi relatif munculnya angka dalam 5 kali pelemparan koin.',
        tableIntroPrompt:
          '<span class="hl-yellow">Tabel frekuensi relatif</span> mencatat banyak uji coba, f(A), dan f<sub>r</sub>(A).',
        seeTablePrompt: "Ketuk ‘»’ untuk melihat tabel frekuensi relatif.",
        tableFillPrompt: "Ketuk ‘»’ untuk mengisi tabel frekuensi relatif.",
        tapPointsPrompt: "Ketuk titik-titik yang disorot pada grafik.",
        recordDataPrompt: "Catat informasi yang diberikan dalam grafik ke dalam tabel.",
        recordedAllPrompt:
          'Kita telah mencatat semua data dari grafik.<br>Mari kita gunakan ini untuk menyimpulkan <span class="hl-yellow">hasil pada setiap uji coba.</span>',
        deducePrompt: "Mari kita gunakan ini untuk menyimpulkan hasil pada setiap uji coba.",
        tapNextOutcome: "Ketuk » untuk mencari hasil setiap uji coba.",
        colTrials: "Uji coba (n)",
        colRf: "f<sub>r</sub>(A)",
        colHeads: "f(A)",
        colHeadsSub: "f<sub>r</sub>(A) × n",
        colChange: "perubahan<br>f(A)",
        colOutcome: "hasil",
        weKnow: "Kita tahu",
        relativeFrequency: "Frekuensi Relatif",
        weGet: "Kita dapatkan",
        knownFormula: `f<sub>r</sub>(A) = ${frac("f(A)", "n")}`,
        resultFormula: "f<sub>r</sub>(A) × n = f(A)",
        formulaQuestion: "Rumus mana yang akan memberi kita f(A)?",
        formulaOption1: frac("f<sub>r</sub>(A)", "n"),
        formulaOption2: "f<sub>r</sub>(A) × n",
        correctOptionFeedback:
          "Tepat! Kalikan frekuensi relatif dengan banyak uji coba untuk mendapatkan frekuensi angka.",
        wrongOptionFeedback:
          `Belum tepat. Ingat: f<sub>r</sub>(A) = ${frac("f(A)", "n")}, jadi susun ulang untuk mencari f(A).`,
        tapCorrectOption: "Ketuk pilihan yang benar.",
        tapRevealHeads: "Ketuk ‘Buka’ untuk menampilkan semua nilai f(A).",
        whatDoesThisTellUsButton: "Apa yang<br>ini beri tahu?",
        tapWhatDoesThisTellUs: "Ketuk tombol untuk mencari tahu apa yang ini beri tahu.",
        revealButton: "Buka",
        trialOutcomes: "hasil",
        trial1OutcomeMsg:
          "Setelah uji coba pertama, frekuensi ANGKA adalah <span class='hl-yellow'>1</span>.<br>Ini berarti hasil dari Uji Coba 1 adalah ANGKA!",
        trial2OutcomeMsg:
          "Setelah uji coba kedua, frekuensi ANGKA tetap <span class='hl-yellow'>1</span>.<br>Ini berarti kita tidak mendapatkan ANGKA lagi!",
        trial3OutcomeMsg:
          "Setelah uji coba ketiga, frekuensi ANGKA berubah menjadi <span class='hl-yellow'>2</span>.<br>Ini berarti kita mendapatkan ANGKA lagi!",
        trial4OutcomeMsg:
          "Setelah uji coba keempat, frekuensi ANGKA tetap sama yaitu <span class='hl-yellow'>2</span>.<br>Ini berarti kita tidak mendapatkan ANGKA!",
        trial5OutcomeMsg:
          "Setelah uji coba kelima, frekuensi ANGKA berubah menjadi <span class='hl-yellow'>3</span>.<br>Ini berarti kita mendapatkan ANGKA lagi!",
        tapNextExplore: "Ketuk » untuk mempelajari lebih lanjut",
        tapNextPattern: "Ketuk » untuk menemukan pola",
        changeIntroMsg:
          "<span class='hl-gold'>f(A)</span> hanya berubah ketika hasilnya <span class='hl-gold'>ANGKA</span>,<br>jika tidak, nilainya tetap sama.<br><span class='formula-pink'>Perubahan = f(A) saat ini − f(A) sebelumnya</span>",
        changeIntroMsgRecording:
          "f(A) hanya berubah ketika hasilnya ANGKA, jika tidak, nilainya tetap sama. Mari kita catat perubahan itu di tabel.<br><span class='formula-pink'>Perubahan = f(A) saat ini − f(A) sebelumnya</span>",
        tapNextRecordChange: "Ketuk » untuk mencatat perubahan.",
        tapNextWrap: "Ketuk » untuk merangkum.",
        tapNextSummarize: "Ketuk » untuk melihat ringkasan.",
        changeLabel: "Perubahan",
        summaryTitle: "Bagus Sekali!",
        summaryText1: "Jika hasilnya ANGKA, perubahannya selalu + 1.",
        summaryText2: "Jika hasilnya BUKAN ANGKA, perubahannya selalu 0.",
        endTitle: "Grafik frekuensi relatif dapat memberi tahu kamu apa yang terjadi pada setiap uji coba",
        endTeachLine: "Ubah frekuensi relatif menjadi frekuensi sebenarnya menggunakan:",
        endFormula: "f(A) = f<sub>r</sub>(A) × n",
        endWatchLine: "Lalu perhatikan bagaimana frekuensi berubah pada setiap uji coba:",
        endRuleUp: 'naik <span class="hl-yellow">1</span> → hasil itu adalah kejadian',
        endRuleSame: 'tetap <span class="hl-yellow">0</span> → hasil itu bukan kejadian',
        endBigRule: "Aturan utama: perubahan frekuensi hanya bisa 0 atau + 1 — tidak pernah selain itu.",
        endMessage: "Grafik frekuensi relatif dapat memberi tahu kamu apa yang terjadi pada setiap uji coba.",
        instructionStartOver: "Ketuk MULAI LAGI untuk mengulang aktivitas.",
        instructionTapContinue: "Ketuk » untuk melanjutkan.",
      },
    },
  };

  window.getChallengeConfig = () => ({
    trialsData,
    steps,
    totalSteps: steps.length,
    endStep: steps.length,
  });

  const SKIPPED_STEP_TYPES = new Set(["calculateHeads"]);

  window.getNavigableStep = (currentStep, direction) => {
    const navigable = steps
      .map((stepDef, index) => ({ type: stepDef.type, index }))
      .filter((entry) => !SKIPPED_STEP_TYPES.has(entry.type));

    const position = navigable.findIndex((entry) => entry.index === currentStep);
    if (position === -1) return null;

    if (direction === "prev") {
      return position > 0 ? navigable[position - 1].index : null;
    }

    if (direction === "next") {
      return position < navigable.length - 1 ? navigable[position + 1].index : null;
    }

    return currentStep;
  };

  window.getCompletedStepState = (stepIndex) => {
    if (stepIndex < 0 || stepIndex >= steps.length) return null;

    const state = {
      tappedPoints: [],
      quizAnswer: null,
      quizFeedback: "",
      quizBlinkWrong: false,
      formulaFlyDone: false,
      headsRevealed: 0,
      revealTriggered: false,
      headsExplored: 0,
      outcomesRevealed: 0,
      changesRecorded: 0,
    };

    for (let i = 0; i <= stepIndex; i++) {
      const stepType = steps[i].type;
      if (stepType === "pointsInteraction") {
        state.tappedPoints = [1, 2, 3, 4, 5];
      } else if (stepType === "formulaQuiz") {
        state.tappedPoints = [1, 2, 3, 4, 5];
        state.quizAnswer = "option2";
        state.quizFeedback = appData[CURRENT_LANGUAGE].ui.correctOptionFeedback;
        state.formulaFlyDone = true;
        state.headsRevealed = 5;
        state.revealTriggered = true;
      } else if (stepType === "deduceOutcomes") {
        state.outcomesRevealed = 5;
      } else if (stepType === "recordChange") {
        state.changesRecorded = 5;
      }
    }

    return state;
  };

  window.getStepConfig = (globalStep) => {
    const config = window.getChallengeConfig();
    if (globalStep >= config.endStep) {
      return { step: globalStep, type: "end", stepData: null };
    }
    return { step: globalStep, type: config.steps[globalStep].type, stepData: config.steps[globalStep] };
  };

  window.T = appData[CURRENT_LANGUAGE];
  window.setLanguage = (lang) => {
    CURRENT_LANGUAGE = lang;
    if (appData[CURRENT_LANGUAGE]) {
      Object.assign(window.T, appData[CURRENT_LANGUAGE]);
    }
  };
})();
