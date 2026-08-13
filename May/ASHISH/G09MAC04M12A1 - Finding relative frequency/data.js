(() => {
  let CURRENT_LANGUAGE =
    typeof window !== "undefined" && window.APP_LANGUAGE ? window.APP_LANGUAGE : "en";

  const marbleSequence = ["red", "yellow", "yellow", "blue", "red", "red", "yellow", "red", "blue", "red"];
  const spinnerSequence = ["yellow", "red", "blue", "yellow", "green", "red", "blue", "yellow"];

  const marbleFinal = { red: 5, yellow: 3, blue: 2 };
  const spinnerFinal = { red: 2, green: 1, yellow: 3, blue: 2 };

  const marbleColors = ["red", "yellow", "blue"];
  const spinnerColors = ["red", "green", "yellow", "blue"];

  const steps = [
    { id: "marbleDraw", type: "marbleDraw" },
    { id: "eventA", type: "relativeEvent", experiment: "marble", eventKey: "A" },
    { id: "eventB", type: "relativeEvent", experiment: "marble", eventKey: "B" },
    { id: "eventC", type: "relativeEvent", experiment: "marble", eventKey: "C" },
    { id: "eventD", type: "relativeEvent", experiment: "marble", eventKey: "D" },
    { id: "spinnerSpin", type: "spinnerSpin" },
    { id: "spinnerA", type: "relativeEvent", experiment: "spinner", eventKey: "A" },
    { id: "spinnerB", type: "relativeEvent", experiment: "spinner", eventKey: "B" },
    { id: "spinnerC", type: "relativeEvent", experiment: "spinner", eventKey: "C" },
  ];

  const common = {
    images: {
      background: "./assets/DarkBG2.jpg",
      hand_cursor: "./assets/fingerTap.gif",
    },
    sfx: {
      click: "./assets/sfx/click.mp3",
      correct: "./assets/sfx/correct.mp3",
      split: "./assets/sfx/split.mp3",
      swoosh: "./assets/sfx/cut.mp3",
    },
    marbleSequence,
    spinnerSequence,
    marbleColors,
    spinnerColors,
    marbleFinal,
    spinnerFinal,
    steps,
  };

  const appData = {
    en: {
      ...common,
      html_title: "Finding Relative Frequency",
      ui: {
        welcomeTitle: "Finding Relative Frequency!",
        welcomeMessage:
          "You've seen what relative frequency (<span class='math-symbol'>f<sub>r</sub></span>) is.<br>Let us perform some experiments and find the relative frequency of each.",
        tapStartToBegin: "Tap 'Start' to begin.",
        startButton: "START",
        nextButton: "»",
        backButton: "«",
        startOverButton: "START OVER",

        drawTitle: "Draw marbles to collect data.",
        fillButton: "FILL",
        drawButton: "DRAW",
        spinTitle: "Spin the spinner to collect data.",
        spinButton: "SPIN",
        frequency: "Frequency",
        marbleColor: "Marble Color",
        spinnerColor: "Spinner Color",
        total: "Total",
        totalTrials: "Total trials",
        outcomes10: "You found outcomes of 10 trials.",
        outcomes8: "You found outcomes of 8 trials.",
        formulaTitlePrefix: "Find relative frequency",
        formulaTitleSuffix: "of the given event.",
        formulaGeneral:
          "<span class='formula-var'>f</span><sub>r</sub> = <span class='formula-fraction'><span>Frequency of the event</span><span>Total number of trials</span></span>",
        decimal: "Decimal",
        percentage: "Percentage",

        instructionFillMachine: "Tap 'Fill' to fill the machine with marbles.",
        instructionDrawFirst: "Tap 'Draw' to pull out a marble.",
        instructionDrawNext: "Tap 'Draw' to pull out another marble.",
        instructionMarbleReady: "Tap » to find relative frequency.",
        instructionEventFreq: "Tap f({event}) to find the frequency of event {event}.",
        instructionEventTotal: "Tap n to find the total number of trials.",
        instructionEventSameTotal: "Total number of trials, n, is the same for this experiment.",
        instructionEventSum: "Tap ? to find the sum of the numerator.",
        instructionEventDecimal: "Tap ? to reveal fᵣ in decimal form.",
        instructionEventPercent: "Tap ? to reveal fᵣ in percentage.",
        shoutOut: "SHOUT OUT LOUD",
        instructionEventNext: "Tap » to find the next relative frequency.",
        instructionSpinnerFirst: "Tap spinner to spin it and find an outcome.",
        instructionSpinnerNext: "Tap spinner to spin it again and record the color.",
        instructionSpinnerReady: "Tap » to find relative frequency of a given event.",
        instructionContinueExperiment: "Tap » to continue with another experiment.",
        instructionStartOver: "Tap 'Start Over' to repeat this activity.",

        marbleEvents: {
          A: { label: "Event A: Getting <span class='hl-red'>red</span> marble.", labels: ["red"], numerator: 5, denominator: 10, decimal: "0.5", percentage: "50%" },
          B: { label: "Event B: Getting <span class='hl-yellow'>yellow</span> marble.", labels: ["yellow"], numerator: 3, denominator: 10, decimal: "0.3", percentage: "30%" },
          C: { label: "Event C: Getting <span class='hl-blue'>blue</span> marble.", labels: ["blue"], numerator: 2, denominator: 10, decimal: "0.2", percentage: "20%" },
          D: { label: "Event D: Getting <span class='hl-red'>red</span> or <span class='hl-blue'>blue</span> marble.", labels: ["red", "blue"], parts: [5, 2], numerator: 7, denominator: 10, decimal: "0.7", percentage: "70%" },
        },
        spinnerEvents: {
          A: { label: "Event A: Getting <span class='hl-red'>red</span> color.", labels: ["red"], numerator: 2, denominator: 8, decimal: "0.25", percentage: "25%" },
          B: { label: "Event B: Getting <span class='hl-yellow'>yellow</span> color.", labels: ["yellow"], numerator: 3, denominator: 8, decimal: "0.375", percentage: "37.5%" },
          C: { label: "Event C: Getting <span class='hl-green'>green</span> or <span class='hl-blue'>blue</span> color.", labels: ["green", "blue"], parts: [1, 2], numerator: 3, denominator: 8, decimal: "0.375", percentage: "37.5%" },
        },

        endTitle: "Well Done!",
        endMessage:
          "You've found relative frequency of each experiment. The same way you can find <span class='hl-yellow'>relative frequency of any event</span>, you only need to know the <span class='hl-yellow'>total trials</span> and the <span class='hl-yellow'>frequency of the event</span>.",
        endTap: "Tap 'Start Over' to repeat this activity.",
      },
    },
    id: {
      ...common,
      html_title: "Menemukan Frekuensi Relatif",
      ui: {
        welcomeTitle: "Menemukan Frekuensi Relatif!",
        welcomeMessage:
          "Kamu sudah melihat apa itu frekuensi relatif (<span class='math-symbol'>f<sub>r</sub></span>).<br>Mari lakukan beberapa percobaan dan temukan frekuensi relatifnya.",
        tapStartToBegin: "Ketuk 'Mulai' untuk memulai.",
        startButton: "MULAI",
        nextButton: "»",
        backButton: "«",
        startOverButton: "MULAI LAGI",

        drawTitle: "Ambil kelereng untuk mengumpulkan data.",
        fillButton: "ISI",
        drawButton: "AMBIL",
        spinTitle: "Putar spinner untuk mengumpulkan data.",
        spinButton: "PUTAR",
        frequency: "Frekuensi",
        marbleColor: "Warna Kelereng",
        spinnerColor: "Warna Spinner",
        total: "Total",
        totalTrials: "Total percobaan",
        outcomes10: "Kamu menemukan hasil dari 10 percobaan.",
        outcomes8: "Kamu menemukan hasil dari 8 percobaan.",
        formulaTitlePrefix: "Temukan frekuensi relatif",
        formulaTitleSuffix: "dari kejadian berikut.",
        formulaGeneral:
          "<span class='formula-var'>f</span><sub>r</sub> = <span class='formula-fraction'><span>Frekuensi kejadian</span><span>Total percobaan</span></span>",
        decimal: "Desimal",
        percentage: "Persentase",

        instructionFillMachine: "Ketuk 'Isi' untuk mengisi mesin dengan kelereng.",
        instructionDrawFirst: "Ketuk 'Ambil' untuk mengeluarkan kelereng.",
        instructionDrawNext: "Ketuk 'Ambil' untuk mengeluarkan kelereng lagi.",
        instructionMarbleReady: "Ketuk » untuk menemukan frekuensi relatif.",
        instructionEventFreq: "Ketuk f({event}) untuk menemukan frekuensi kejadian {event}.",
        instructionEventTotal: "Ketuk n untuk menemukan total percobaan.",
        instructionEventSameTotal: "Total percobaan, n, sama untuk percobaan ini.",
        instructionEventSum: "Ketuk ? untuk menemukan jumlah pembilang.",
        instructionEventDecimal: "Ketuk ? untuk menampilkan fᵣ dalam bentuk desimal.",
        instructionEventPercent: "Ketuk ? untuk menampilkan fᵣ dalam persen.",
        shoutOut: "UCAPKAN KERAS",
        instructionEventNext: "Ketuk » untuk mencari frekuensi relatif berikutnya.",
        instructionSpinnerFirst: "Ketuk spinner untuk memutarnya dan menemukan hasil.",
        instructionSpinnerNext: "Ketuk spinner untuk memutar lagi dan mencatat warnanya.",
        instructionSpinnerReady: "Ketuk » untuk menemukan frekuensi relatif kejadian.",
        instructionContinueExperiment: "Ketuk » untuk melanjutkan ke percobaan lain.",
        instructionStartOver: "Ketuk 'Mulai Lagi' untuk mengulang aktivitas.",

        marbleEvents: {
          A: { label: "Kejadian A: Mendapat kelereng <span class='hl-red'>merah</span>.", labels: ["red"], numerator: 5, denominator: 10, decimal: "0,5", percentage: "50%" },
          B: { label: "Kejadian B: Mendapat kelereng <span class='hl-yellow'>kuning</span>.", labels: ["yellow"], numerator: 3, denominator: 10, decimal: "0,3", percentage: "30%" },
          C: { label: "Kejadian C: Mendapat kelereng <span class='hl-blue'>biru</span>.", labels: ["blue"], numerator: 2, denominator: 10, decimal: "0,2", percentage: "20%" },
          D: { label: "Kejadian D: Mendapat kelereng <span class='hl-red'>merah</span> atau <span class='hl-blue'>biru</span>.", labels: ["red", "blue"], parts: [5, 2], numerator: 7, denominator: 10, decimal: "0,7", percentage: "70%" },
        },
        spinnerEvents: {
          A: { label: "Kejadian A: Mendapat warna <span class='hl-red'>merah</span>.", labels: ["red"], numerator: 2, denominator: 8, decimal: "0,25", percentage: "25%" },
          B: { label: "Kejadian B: Mendapat warna <span class='hl-yellow'>kuning</span>.", labels: ["yellow"], numerator: 3, denominator: 8, decimal: "0,375", percentage: "37,5%" },
          C: { label: "Kejadian C: Mendapat warna <span class='hl-green'>hijau</span> atau <span class='hl-blue'>biru</span>.", labels: ["green", "blue"], parts: [1, 2], numerator: 3, denominator: 8, decimal: "0,375", percentage: "37,5%" },
        },

        endTitle: "Bagus Sekali!",
        endMessage:
          "Kamu telah menemukan frekuensi relatif dari setiap percobaan. Dengan cara yang sama kamu dapat menemukan <span class='hl-yellow'>frekuensi relatif kejadian apa pun</span>, kamu hanya perlu mengetahui <span class='hl-yellow'>total percobaan</span> dan <span class='hl-yellow'>frekuensi kejadian</span>.",
        endTap: "Ketuk 'Mulai Lagi' untuk mengulang aktivitas.",
      },
    },
  };

  window.getChallengeConfig = () => ({ ...common, totalSteps: steps.length, endStep: steps.length });
  window.getStepConfig = (globalStep) => {
    const config = window.getChallengeConfig();
    if (globalStep >= config.endStep) return { step: globalStep, type: "end", stepData: null };
    return { step: globalStep, type: config.steps[globalStep].type, stepData: config.steps[globalStep] };
  };
  window.T = appData[CURRENT_LANGUAGE];
  window.setLanguage = (lang) => {
    CURRENT_LANGUAGE = lang;
    if (appData[CURRENT_LANGUAGE]) Object.assign(window.T, appData[CURRENT_LANGUAGE]);
  };
})();
