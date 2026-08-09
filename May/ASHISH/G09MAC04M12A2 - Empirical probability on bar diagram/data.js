(() => {
  let CURRENT_LANGUAGE =
    typeof window !== "undefined" && window.APP_LANGUAGE ? window.APP_LANGUAGE : "en";

  const diceFirstRolls = [4, 2, 4, 1, 5];
  const diceFinalFreq = { 1: 6, 2: 11, 3: 8, 4: 8, 5: 10, 6: 7 };
  const diceTotalTrials = 50;

  const spinnerFreq = { A: 11, B: 7, C: 2, D: 10 };
  const spinnerTotalTrials = 30;
  const spinnerSections = ["A", "B", "C", "D"];

  const diceEvents = {
    A: { id: "A", faces: [5], freqs: [10], sum: 10, flyBar: 5 },
    B: { id: "B", faces: [1, 3, 5], freqs: [6, 8, 10], sum: 24, flyBar: 1 },
    C: { id: "C", faces: [2, 4, 6], freqs: [11, 8, 7], sum: 26, flyBar: 2 },
  };

  const shuffleArray = (items) => {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const buildQuizOptions = (correct, distractors) => shuffleArray([correct, ...distractors]);

  const spinnerQuizzes = [
    {
      id: "event1",
      section: "B",
      highlight: "B",
      numerator: 7,
      denominator: 30,
      correct: "7/30",
      options: buildQuizOptions("7/30", ["2/30", "10/30", "11/30"]),
    },
    {
      id: "event2",
      labelParts: ["C", "D"],
      highlight: ["C", "D"],
      numerator: 12,
      denominator: 30,
      correct: "12/30",
      options: buildQuizOptions("12/30", ["7/30", "11/30", "18/30"]),
    },
    {
      id: "event3",
      labelParts: ["A", "B"],
      highlight: ["A", "B"],
      numerator: 18,
      denominator: 30,
      correct: "18/30",
      options: buildQuizOptions("18/30", ["2/30", "10/30", "12/30"]),
    },
  ];

  const buildBatchRolls = () => {
    const start = { 1: 1, 2: 1, 3: 0, 4: 2, 5: 1, 6: 0 };
    const remaining = {};
    Object.keys(diceFinalFreq).forEach((face) => {
      remaining[face] = diceFinalFreq[face] - (start[face] || 0);
    });
    const rolls = [];
    Object.keys(remaining).forEach((face) => {
      for (let i = 0; i < remaining[face]; i += 1) rolls.push(parseInt(face, 10));
    });
    return shuffleArray(rolls);
  };

  const steps = [
    { id: "diceRollManual", type: "diceRoll" },
    { id: "rollBatch", type: "diceRollBatch" },
    { id: "eventA", type: "diceEventCalc", eventKey: "A" },
    { id: "eventB", type: "diceEventCalc", eventKey: "B" },
    { id: "eventC", type: "diceEventCalc", eventKey: "C" },
    { id: "spinnerBridge", type: "spinnerBridge" },
    { id: "spinnerOverview", type: "spinnerOverview" },
    { id: "enterA", type: "spinnerEnter", section: "A" },
    { id: "enterB", type: "spinnerEnter", section: "B" },
    { id: "enterC", type: "spinnerEnter", section: "C" },
    { id: "enterD", type: "spinnerEnter", section: "D" },
    { id: "spinnerSum", type: "spinnerSum" },
    { id: "spinnerSumDone", type: "spinnerSumDone" },
    { id: "quiz1", type: "spinnerQuiz", quizIndex: 0 },
    { id: "quiz2", type: "spinnerQuiz", quizIndex: 1 },
    { id: "quiz3", type: "spinnerQuiz", quizIndex: 2 },
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
    },
    diceFirstRolls,
    diceFinalFreq,
    diceTotalTrials,
    diceBatchRolls: buildBatchRolls(),
    diceEvents,
    spinnerFreq,
    spinnerTotalTrials,
    spinnerSections,
    spinnerQuizzes,
    steps,
    chartMax: 12,
  };

  const appData = {
    en: {
      ...common,
      html_title: "Relative Frequency on Bar Diagram",
      ui: {
        welcomeTitle: "Relative Frequency on Bar Diagram",
        welcomeMessage:
          "Let us conduct an experiment and draw bar diagram for each trial.<br>We will find <span class='hl-yellow'>relative frequency</span> of each event using bar diagram.",
        tapStartToBegin: "Tap 'Start' to begin.",
        startButton: "START",
        nextButton: "»",
        backButton: "«",
        continueButton: "Continue",
        bridgeContinue: "CONTINUE",
        startOverButton: "START OVER",

        diceRecordTitle: "Let's record the outcome of rolling a die on bar diagram.",
        diceRecordedTitle: "The outcomes of each trial of rolling a die on bar diagram is recorded.",
        rollOnce: "Roll die 1 time",
        rollMany: "Roll die 45 times",
        outcomesMany: "Outcomes of 50 trials…",
        totalTrials: "Total trials",
        frequency: "Frequency",
        dieFaces: "Die Faces",
        spinnerSection: "Spinner Section",

        eventA: "Event A: Getting a <span class='hl-yellow'>5</span>.",
        eventB: "Event B: Getting an <span class='hl-yellow'>odd</span> number.",
        eventC: "Event C: Getting an <span class='hl-yellow'>even</span> number.",
        event1: "Event 1: Getting a <span class='hl-yellow'>B</span>.",
        event2: "Event 2: Getting a <span class='hl-yellow'>C</span> or <span class='hl-yellow'>D</span>.",
        event3: "Event 3: Getting a <span class='hl-yellow'>A</span> or <span class='hl-yellow'>B</span>.",

        formulaGeneral:
          "<span class='formula-var'>f</span><sub class='formula-sub'>r</sub> = <span class='formula-fraction'><span class='formula-num'>Frequency of the event</span><span class='formula-den'>Total number of trials</span></span>",
        freqOfEvent: "Frequency of the event",
        totalTrialsWord: "Total number of trials",
        freqSymbolA: "f(A)",
        freqSymbolB: "f(B)",
        freqSymbolC: "f(C)",
        totalSymbol: "n",

        spinnerBridge1:
          "A bar diagram shows the frequency of each event. Using these frequencies, we can easily find the relative frequency of any event.",
        spinnerBridge2:
          "Now, let us now apply the same and find the relative frequency of events of an experiment.",
        spinnerOverviewTitle: "The bar diagram shows the results of repeated rotation of the spinner.",
        spinnerOverviewBody: "We will first find the frequency of each outcome and thus, the total trials.",
        spinnerEnterTitle: "Find the frequencies of each event from bar diagram.",
        spinnerSumTitle: "Find the total trials (sum of all frequencies).",
        spinnerQuizTitle: "Find the relative frequencies of each event.",
        spinnerSumDone: "We found the frequency of each outcome and the total trials.",
        freqOfSection: "Frequency of {section} =",
        totalTrialsExpr: "Total trials =",

        instructionRoll: "Tap 'Roll…' to run a trial.",
        instructionRollAgain: "Tap 'Roll…' to run another trial.",
        instructionRollAll: "Tap 'Roll…' to run all trials.",
        instructionDiceRecorded: "Tap » to continue.",
        instructionSpinnerBridgeContinue: "Tap 'Continue' to proceed.",
        instructionEventAFreq: "Tap f(A) to find the frequency of event A.",
        instructionEventATotal: "Tap n to find the total number of trials.",
        instructionEventBFreq: "Tap f(B) to find the frequency of event B.",
        instructionEventBSum: "Tap ? to find the sum of numerator.",
        instructionEventCFreq: "Tap f(C) to find the frequency of event C.",
        instructionEventCSum: "Tap ? to find the sum of numerator.",
        instructionEventNext: "Tap » for the next event.",
        instructionEventCNext: "Tap » to continue exploring.",
        instructionSpinnerBridge: "Tap 'Continue' to proceed.",
        instructionSpinnerOverview: "Tap » to start finding frequencies of each event.",
        instructionSpinnerEnter: "Enter the correct frequency of '{section}'.",
        instructionSpinnerSum: "Tap the total trials expression to find the total number of trials.",
        instructionSpinnerSumAnimating: "Watch the frequencies add up to give the total trials.",
        instructionSpinnerSumDone: "Tap » to start finding the relative frequency.",
        instructionSpinnerQuiz: "Tap the correct answer.",
        instructionSpinnerQuizNext: "Tap » for the next event.",
        instructionSpinnerQuizSummary: "Tap » to summarize.",
        instructionTapContinue: "Tap » to continue.",
        instructionStartOver: "Tap 'Start Over' to repeat this activity.",

        endTitle: "Well Done!",
        endMessage:
          "You learnt how to use the <span class='hl-yellow'>bar diagram</span> to find the <span class='hl-yellow'>frequency of each event</span>. Then used the frequencies to <span class='hl-yellow'>find the total trials</span> and thus, calculate the <span class='hl-yellow'>relative frequency</span>.",
        endTap: "Tap 'Start Over' to repeat this activity.",

        wrongFreq: "Not quite! Read the height of the bar from the bar diagram.",
        wrongQuiz: "Not quite! Use the frequency of the event and the total trials.",
      },
    },
    id: {
      ...common,
      html_title: "Frekuensi Relatif pada Diagram Batang",
      ui: {
        welcomeTitle: "Frekuensi Relatif pada Diagram Batang",
        welcomeMessage:
          "Mari kita melakukan percobaan dan menggambar diagram batang untuk setiap percobaan.<br>Kita akan menemukan <span class='hl-yellow'>frekuensi relatif</span> setiap kejadian menggunakan diagram batang.",
        tapStartToBegin: "Ketuk 'Mulai' untuk memulai.",
        startButton: "MULAI",
        nextButton: "»",
        backButton: "«",
        continueButton: "Lanjutkan",
        bridgeContinue: "LANJUTKAN",
        startOverButton: "MULAI LAGI",

        diceRecordTitle: "Mari kita catat hasil pelemparan dadu pada diagram batang.",
        diceRecordedTitle: "Hasil setiap percobaan pelemparan dadu dicatat pada diagram batang.",
        rollOnce: "Lempar dadu 1 kali",
        rollMany: "Lempar dadu 45 kali",
        outcomesMany: "Hasil 50 percobaan…",
        totalTrials: "Total percobaan",
        frequency: "Frekuensi",
        dieFaces: "Sisi Dadu",
        spinnerSection: "Bagian Spinner",

        eventA: "Kejadian A: Mendapat angka <span class='hl-yellow'>5</span>.",
        eventB: "Kejadian B: Mendapat angka <span class='hl-yellow'>ganjil</span>.",
        eventC: "Kejadian C: Mendapat angka <span class='hl-yellow'>genap</span>.",
        event1: "Kejadian 1: Mendapat <span class='hl-yellow'>B</span>.",
        event2: "Kejadian 2: Mendapat <span class='hl-yellow'>C</span> atau <span class='hl-yellow'>D</span>.",
        event3: "Kejadian 3: Mendapat <span class='hl-yellow'>A</span> atau <span class='hl-yellow'>B</span>.",

        formulaGeneral:
          "<span class='formula-var'>f</span><sub class='formula-sub'>r</sub> = <span class='formula-fraction'><span class='formula-num'>Frekuensi kejadian</span><span class='formula-den'>Total percobaan</span></span>",
        freqOfEvent: "Frekuensi kejadian",
        totalTrialsWord: "Total percobaan",
        freqSymbolA: "f(A)",
        freqSymbolB: "f(B)",
        freqSymbolC: "f(C)",
        totalSymbol: "n",

        spinnerBridge1:
          "Diagram batang menunjukkan frekuensi setiap kejadian. Dengan frekuensi ini, kita dapat dengan mudah menemukan frekuensi relatif setiap kejadian.",
        spinnerBridge2:
          "Sekarang, mari kita terapkan hal yang sama dan temukan frekuensi relatif kejadian dari suatu percobaan.",
        spinnerOverviewTitle: "Diagram batang menunjukkan hasil putaran berulang spinner.",
        spinnerOverviewBody: "Kita akan mencari frekuensi setiap hasil dan total percobaan.",
        spinnerEnterTitle: "Temukan frekuensi setiap kejadian dari diagram batang.",
        spinnerSumTitle: "Temukan total percobaan (jumlah semua frekuensi).",
        spinnerQuizTitle: "Temukan frekuensi relatif setiap kejadian.",
        spinnerSumDone: "Kita telah menemukan frekuensi setiap hasil dan total percobaan.",
        freqOfSection: "Frekuensi {section} =",
        totalTrialsExpr: "Total percobaan =",

        instructionRoll: "Ketuk 'Lempar…' untuk menjalankan percobaan.",
        instructionRollAgain: "Ketuk 'Lempar…' untuk menjalankan percobaan lagi.",
        instructionRollAll: "Ketuk 'Lempar…' untuk menjalankan semua percobaan.",
        instructionDiceRecorded: "Ketuk » untuk melanjutkan.",
        instructionSpinnerBridgeContinue: "Ketuk 'Lanjutkan' untuk melanjutkan.",
        instructionEventAFreq: "Ketuk f(A) untuk menemukan frekuensi kejadian A.",
        instructionEventATotal: "Ketuk n untuk menemukan total percobaan.",
        instructionEventBFreq: "Ketuk f(B) untuk menemukan frekuensi kejadian B.",
        instructionEventBSum: "Ketuk ? untuk menemukan jumlah pembilang.",
        instructionEventCFreq: "Ketuk f(C) untuk menemukan frekuensi kejadian C.",
        instructionEventCSum: "Ketuk ? untuk menemukan jumlah pembilang.",
        instructionEventNext: "Ketuk » untuk kejadian berikutnya.",
        instructionEventCNext: "Ketuk » untuk melanjutkan.",
        instructionSpinnerBridge: "Ketuk 'Lanjutkan' untuk melanjutkan.",
        instructionSpinnerOverview: "Ketuk » untuk mulai mencari frekuensi setiap kejadian.",
        instructionSpinnerEnter: "Masukkan frekuensi yang benar untuk '{section}'.",
        instructionSpinnerSum: "Ketuk ekspresi total percobaan untuk menemukan total percobaan.",
        instructionSpinnerSumAnimating: "Perhatikan frekuensi dijumlahkan untuk mendapatkan total percobaan.",
        instructionSpinnerSumDone: "Ketuk » untuk mulai mencari frekuensi relatif.",
        instructionSpinnerQuiz: "Ketuk jawaban yang benar.",
        instructionSpinnerQuizNext: "Ketuk » untuk kejadian berikutnya.",
        instructionSpinnerQuizSummary: "Ketuk » untuk merangkum.",
        instructionTapContinue: "Ketuk » untuk melanjutkan.",
        instructionStartOver: "Ketuk 'Mulai Lagi' untuk mengulang aktivitas.",

        endTitle: "Bagus Sekali!",
        endMessage:
          "Kamu belajar menggunakan <span class='hl-yellow'>diagram batang</span> untuk menemukan <span class='hl-yellow'>frekuensi setiap kejadian</span>. Lalu menggunakan frekuensi untuk <span class='hl-yellow'>menemukan total percobaan</span> dan menghitung <span class='hl-yellow'>frekuensi relatif</span>.",
        endTap: "Ketuk 'Mulai Lagi' untuk mengulang aktivitas.",

        wrongFreq: "Belum tepat! Baca tinggi batang dari diagram batang.",
        wrongQuiz: "Belum tepat! Gunakan frekuensi kejadian dan total percobaan.",
      },
    },
  };

  window.getChallengeConfig = () => ({
    ...common,
    totalSteps: steps.length,
    endStep: steps.length,
  });

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
