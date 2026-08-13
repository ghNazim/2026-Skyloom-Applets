(() => {
  let CURRENT_LANGUAGE =
    typeof window !== "undefined" && window.APP_LANGUAGE ? window.APP_LANGUAGE : "en";

  const datasets = {
    population: {
      id: "population",
      labelKey: "populationLabel",
      count: 60,
      color: "#3B93CF",
      shapeColor: "#5CB1E5",
      bars: [
        { value: 1, frequency: 1 },
        { value: 2, frequency: 2 },
        { value: 3, frequency: 4 },
        { value: 4, frequency: 6 },
        { value: 5, frequency: 8 },
        { value: 6, frequency: 10 },
        { value: 7, frequency: 8 },
        { value: 8, frequency: 6 },
        { value: 9, frequency: 6 },
        { value: 10, frequency: 4 },
        { value: 11, frequency: 3 },
        { value: 12, frequency: 2 },
      ],
      mean: "6.6",
      range: "11",
      rangeHigh: "12",
      rangeLow: "1",
      numerator: "396",
      denominator: "60",
    },
    sample1: {
      id: "sample1",
      labelKey: "sample1Label",
      count: 15,
      color: "#EE4E6B",
      shapeColor: "#F1738B",
      bars: [
        { value: 1, frequency: 0 },
        { value: 2, frequency: 0 },
        { value: 3, frequency: 0 },
        { value: 4, frequency: 0 },
        { value: 5, frequency: 0 },
        { value: 6, frequency: 0 },
        { value: 7, frequency: 3 },
        { value: 8, frequency: 3 },
        { value: 9, frequency: 2 },
        { value: 10, frequency: 0 },
        { value: 11, frequency: 1 },
        { value: 12, frequency: 1 },
      ],
      mean: "8",
      range: "5",
      rangeHigh: "12",
      rangeLow: "7",
      numerator: "80",
      denominator: "10",
    },
    sample2: {
      id: "sample2",
      labelKey: "sample2Label",
      count: 15,
      color: "#DFB612",
      shapeColor: "#E1B816",
      bars: [
        { value: 1, frequency: 0 },
        { value: 2, frequency: 1 },
        { value: 3, frequency: 0 },
        { value: 4, frequency: 1 },
        { value: 5, frequency: 2 },
        { value: 6, frequency: 3 },
        { value: 7, frequency: 3 },
        { value: 8, frequency: 2 },
        { value: 9, frequency: 1 },
        { value: 10, frequency: 1 },
        { value: 11, frequency: 0 },
        { value: 12, frequency: 1 },
      ],
      mean: "6.8",
      range: "10",
      rangeHigh: "12",
      rangeLow: "2",
      numerator: "102",
      denominator: "15",
    },
  };

  const testResults = {
    shape: { sample1: false, sample2: true },
    centre: { sample1: false, sample2: true },
    spread: { sample1: false, sample2: true },
  };

  const steps = [
    { id: "data", type: "charts" },
    { id: "chooseShape", type: "choose", test: "shape" },
    { id: "shapeDraw", type: "draw", test: "shape" },
    { id: "shapeQuiz1", type: "quiz", test: "shape", sample: "sample1" },
    { id: "shapeQuiz2", type: "quiz", test: "shape", sample: "sample2" },
    { id: "shapeDone", type: "testDone", test: "shape" },
    { id: "chooseCentre", type: "choose", test: "centre" },
    { id: "meanPopulation", type: "mean", dataset: "population" },
    { id: "meanSample1", type: "mean", dataset: "sample1" },
    { id: "meanSample2", type: "mean", dataset: "sample2" },
    { id: "centreQuiz1", type: "quiz", test: "centre", sample: "sample1" },
    { id: "centreQuiz2", type: "quiz", test: "centre", sample: "sample2" },
    { id: "centreDone", type: "testDone", test: "centre" },
    { id: "chooseSpread", type: "choose", test: "spread" },
    { id: "rangePopulation", type: "range", dataset: "population" },
    { id: "rangeSample1", type: "range", dataset: "sample1" },
    { id: "rangeSample2", type: "range", dataset: "sample2" },
    { id: "spreadQuiz1", type: "quiz", test: "spread", sample: "sample1" },
    { id: "spreadQuiz2", type: "quiz", test: "spread", sample: "sample2" },
    { id: "spreadDone", type: "testDone", test: "spread" },
    { id: "finalChoice", type: "finalChoice" },
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
    datasets,
    testResults,
    steps,
  };

  const appData = {
    en: {
      ...common,
      html_title: "Three Checks to Identify a Representative Sample!",
      ui: {
        welcomeTitle: "Three Checks to Identify a Representative Sample!",
        welcomeMessage:
          "A representative sample should pass three tests:<br><span class='hl-yellow'>1. Shape</span> - The shape pattern should match the population<br><span class='hl-yellow'>2. Centre</span> - The mean should be close to the population mean<br><span class='hl-yellow'>3. Spread</span> - The sample range should be similar to the population range<br><br>Let us see how to check any sample for these three tests.",
        tapStartToBegin: "Tap START to begin!",
        startButton: "START",
        nextButton: "»",
        backButton: "«",
        pass: "Pass",
        fail: "Fail",
        passShort: "Pass",
        failShort: "Fail",
        sample1Name: "Sample 1",
        sample2Name: "Sample 2",
        sample1Short: "S1",
        sample2Short: "S2",
        populationName: "Population",
        meanWord: "Mean",
        rangeWord: "Range",
        meanMarker: "M",
        rangeMarker: "R",
        populationLabel: "Population (60 students)",
        sample1Label: "Sample 1 (15 students)",
        sample2Label: "Sample 2 (15 students)",
        scenario:
          "A school recorded how many times 60 students visit the library per week.<br><br>Two samples of 15 students each were also collected.",
        dataTitle: "The data of population and samples are shown in the bar diagrams.",
        introTitle: "A representative sample should pass three tests.",
        chooseTitle: "Choose a test you wish to check for...",
        chooseShapePrompt: "Tap Shape or Centre or Spread.",
        chooseCentrePrompt: "One test is done. Choose another test.",
        chooseSpreadPrompt: "Two tests are done. Choose the last test.",
        shape: "Shape",
        centre: "Centre",
        spread: "Spread",
        shapeTitle: "Check both samples for Shape.",
        centreTitle: "Check both samples for Centre (Mean).",
        spreadTitle: "Check both samples for Spread (Range).",
        shapeInstruction: "Tap 'Draw...' to draw shape pattern.",
        drawPopulation: "Draw shape of Population",
        drawSample1: "Draw shape of Sample 1",
        drawSample2: "Draw shape of Sample 2",
        shapeReady: "Tap » to find which sample passes the Shape test.",
        meanPopulation: "Mean of Population",
        meanSample1: "Mean of Sample 1",
        meanSample2: "Mean of Sample 2",
        rangePopulation: "Range of Population",
        rangeSample1: "Range of Sample 1",
        rangeSample2: "Range of Sample 2",
        tapMean: "Tap the highlighted part of the equation to complete the mean.",
        tapRange: "Tap Highest value, Lowest value, then ? in the equation.",
        sumValues: "sum of all values",
        totalValues: "total number of values",
        highestValue: "Highest value",
        lowestValue: "Lowest value",
        revealAnswer: "?",
        quizInstruction: "Tap the correct option.",
        shapeQuiz1: "Does Sample 1 pass or fail the Shape test?",
        shapeQuiz2: "Does Sample 2 pass or fail the Shape test?",
        centreQuiz1: "Does Sample 1 pass or fail the Centre (Mean) test?",
        centreQuiz2: "Does Sample 2 pass or fail the Centre (Mean) test?",
        spreadQuiz1: "Does Sample 1 pass or fail the Spread (Range) test?",
        spreadQuiz2: "Does Sample 2 pass or fail the Spread (Range) test?",
        wrongShape1:
          "Carefully look at the population and the sample's shape pattern. The rise, peak, and fall are not the same.",
        wrongShape2:
          "Carefully look at the population and the sample's shape pattern. The rise, peak, and fall are almost the same.",
        wrongCentre1:
          "Carefully look at the population and the sample's mean. They are not close to each other.",
        wrongCentre2:
          "Carefully look at the population and the sample's mean. They are close to each other.",
        wrongSpread1:
          "Carefully look at the population and the sample's range. They are not close to each other.",
        wrongSpread2:
          "Carefully look at the population and the sample's range. They are close to each other.",
        shapeDone: "Sample 1 fails and sample 2 passes the Shape test.",
        centreDone: "Sample 1 fails and Sample 2 passes the Centre (Mean) test.",
        spreadDone: "Sample 1 fails and Sample 2 passes the Spread (Range) test.",
        finalQuestion: "Which sample is a representative sample?",
        finalSuccessTitle:
          "Great job! Sample 2 is the representative sample as it passes all three tests.",
        finalInstruction: "Tap the correct sample.",
        finalWrong:
          "Not quite! Sample 1 fails all three tests. Its shape, mean, and spread are not close to the population.",
        finalCorrect:
          "Spot on! Sample 2 passes all three tests. So, it is the representative sample.",
        summaryTitle: "Well Done!",
        summaryMessage:
          "You learnt how to check samples for Shape, Centre, and Spread for a given population.",
        summaryRemember:
          "A sample is representative when its <span class='hl-yellow'>shape, centre, and spread are almost the same as the population</span>.",
        instructionTapContinue: "Tap » to continue.",
        instructionData: "Tap » to check which sample is representative.",
        instructionChoose: "Tap Shape or Centre or Spread.",
        instructionDraw: "Tap 'Draw...' to draw shape pattern.",
        instructionQuiz: "Tap the correct option.",
        instructionFinal: "Tap Sample 1 or Sample 2.",
        instructionFinalWrong:
          "That's wrong, try again! Tap the correct sample.",
        instructionSummarize: "Tap » to summarize.",
        instructionOtherTests: "Tap » to continue with other tests.",
        instructionRemainingTests: "Tap » to continue with the remaining test.",
        instructionChooseRepresentative:
          "All tests done. Tap » to choose the representative sample.",
        instructionStartOver: "Tap START OVER to repeat this activity.",
        endTitle: "Activity Completed!",
        endMessage:
          "Sample 2 is representative because it passes the Shape, Centre, and Spread checks.",
        endRemember:
          "<span class='hl-yellow'>Remember:</span> check shape first, then compare centre and spread.",
        startOverButton: "START OVER",
      },
    },
    id: {
      ...common,
      html_title: "Tiga Pemeriksaan untuk Menentukan Sampel Representatif!",
      ui: {
        welcomeTitle: "Tiga Pemeriksaan untuk Menentukan Sampel Representatif!",
        welcomeMessage:
          "Sampel representatif harus lolos tiga pemeriksaan:<br><span class='hl-yellow'>Bentuk</span> - pola sesuai populasi<br><span class='hl-yellow'>Pusat</span> - rata-rata dekat dengan rata-rata populasi<br><span class='hl-yellow'>Sebaran</span> - jangkauan mirip dengan jangkauan populasi",
        tapStartToBegin: "Ketuk MULAI untuk memulai!",
        startButton: "MULAI",
        nextButton: "»",
        backButton: "«",
        pass: "Lolos",
        fail: "Gagal",
        passShort: "Lolos",
        failShort: "Gagal",
        sample1Name: "Sampel 1",
        sample2Name: "Sampel 2",
        sample1Short: "S1",
        sample2Short: "S2",
        populationName: "Populasi",
        meanWord: "Rata-rata",
        rangeWord: "Jangkauan",
        meanMarker: "R",
        rangeMarker: "J",
        populationLabel: "Populasi (60 siswa)",
        sample1Label: "Sampel 1 (15 siswa)",
        sample2Label: "Sampel 2 (15 siswa)",
        scenario:
          "Sebuah sekolah mencatat berapa kali 60 siswa mengunjungi perpustakaan per minggu.<br><br>Dua sampel yang masing-masing berisi 15 siswa juga dikumpulkan.",
        dataTitle: "Data populasi dan sampel ditampilkan pada diagram batang.",
        introTitle: "Sampel representatif harus lolos tiga pemeriksaan.",
        chooseTitle: "Pilih pemeriksaan yang ingin kamu cek...",
        chooseShapePrompt: "Ketuk Bentuk untuk memulai tiga pemeriksaan.",
        chooseCentrePrompt: "Satu pemeriksaan selesai. Pilih pemeriksaan lain.",
        chooseSpreadPrompt: "Dua pemeriksaan selesai. Pilih pemeriksaan terakhir.",
        shape: "Bentuk",
        centre: "Pusat",
        spread: "Sebaran",
        shapeTitle: "Periksa Bentuk untuk kedua sampel.",
        centreTitle: "Periksa Pusat (Rata-rata) untuk kedua sampel.",
        spreadTitle: "Periksa Sebaran (Jangkauan) untuk kedua sampel.",
        shapeInstruction: "Ketuk Gambar untuk menggambar setiap pola bentuk.",
        drawPopulation: "Gambar bentuk Populasi",
        drawSample1: "Gambar bentuk Sampel 1",
        drawSample2: "Gambar bentuk Sampel 2",
        shapeReady: "Ketuk » untuk mengetahui sampel mana yang lolos pemeriksaan Bentuk.",
        meanPopulation: "Rata-rata Populasi",
        meanSample1: "Rata-rata Sampel 1",
        meanSample2: "Rata-rata Sampel 2",
        rangePopulation: "Jangkauan Populasi",
        rangeSample1: "Jangkauan Sampel 1",
        rangeSample2: "Jangkauan Sampel 2",
        tapMean: "Ketuk bagian persamaan yang disorot untuk melengkapi rata-rata.",
        tapRange: "Ketuk Nilai tertinggi, Nilai terendah, lalu ? pada persamaan.",
        sumValues: "jumlah semua nilai",
        totalValues: "banyaknya nilai",
        highestValue: "Nilai tertinggi",
        lowestValue: "Nilai terendah",
        revealAnswer: "?",
        quizInstruction: "Ketuk pilihan yang benar.",
        shapeQuiz1: "Apakah Sampel 1 lolos atau gagal pada pemeriksaan Bentuk?",
        shapeQuiz2: "Apakah Sampel 2 lolos atau gagal pada pemeriksaan Bentuk?",
        centreQuiz1: "Apakah Sampel 1 lolos atau gagal pada pemeriksaan Pusat (Rata-rata)?",
        centreQuiz2: "Apakah Sampel 2 lolos atau gagal pada pemeriksaan Pusat (Rata-rata)?",
        spreadQuiz1: "Apakah Sampel 1 lolos atau gagal pada pemeriksaan Sebaran (Jangkauan)?",
        spreadQuiz2: "Apakah Sampel 2 lolos atau gagal pada pemeriksaan Sebaran (Jangkauan)?",
        wrongShape1:
          "Perhatikan pola bentuk populasi dan sampel. Kenaikan, puncak, dan penurunannya tidak sama.",
        wrongShape2:
          "Perhatikan pola bentuk populasi dan sampel. Kenaikan, puncak, dan penurunannya hampir sama.",
        wrongCentre1:
          "Perhatikan rata-rata populasi dan sampel. Keduanya tidak dekat.",
        wrongCentre2:
          "Perhatikan rata-rata populasi dan sampel. Keduanya dekat.",
        wrongSpread1:
          "Perhatikan jangkauan populasi dan sampel. Keduanya tidak dekat.",
        wrongSpread2:
          "Perhatikan jangkauan populasi dan sampel. Keduanya dekat.",
        shapeDone: "Sampel 1 gagal dan Sampel 2 lolos pemeriksaan Bentuk.",
        centreDone: "Sampel 1 gagal dan Sampel 2 lolos pemeriksaan Pusat (Rata-rata).",
        spreadDone: "Sampel 1 gagal dan Sampel 2 lolos pemeriksaan Sebaran (Jangkauan).",
        finalQuestion: "Sampel mana yang merupakan sampel representatif?",
        finalSuccessTitle:
          "Bagus! Sampel 2 adalah sampel representatif karena lolos ketiga pemeriksaan.",
        finalInstruction: "Ketuk sampel yang benar.",
        finalWrong:
          "Belum tepat! Sampel 1 gagal pada ketiga pemeriksaan. Bentuk, rata-rata, dan sebarannya tidak dekat dengan populasi.",
        finalCorrect:
          "Tepat! Sampel 2 lolos ketiga pemeriksaan. Jadi, Sampel 2 adalah sampel representatif.",
        summaryTitle: "Bagus Sekali!",
        summaryMessage:
          "Kamu telah belajar memeriksa sampel berdasarkan Bentuk, Pusat, dan Sebaran untuk suatu populasi.",
        summaryRemember:
          "Sampel representatif memiliki <span class='hl-yellow'>bentuk, pusat, dan sebaran yang hampir sama dengan populasi</span>.",
        instructionTapContinue: "Ketuk » untuk melanjutkan.",
        instructionData: "Ketuk » untuk memeriksa sampel mana yang representatif.",
        instructionChoose: "Ketuk Bentuk, Pusat, atau Sebaran.",
        instructionDraw: "Ketuk setiap tombol Gambar.",
        instructionQuiz: "Ketuk Lolos atau Gagal.",
        instructionFinal: "Ketuk Sampel 1 atau Sampel 2.",
        instructionFinalWrong:
          "Belum tepat, coba lagi! Ketuk sampel yang benar.",
        instructionSummarize: "Ketuk » untuk melihat rangkuman.",
        instructionOtherTests:
          "Ketuk » untuk melanjutkan ke pemeriksaan lainnya.",
        instructionRemainingTests:
          "Ketuk » untuk melanjutkan ke pemeriksaan terakhir.",
        instructionChooseRepresentative:
          "Semua pemeriksaan selesai. Ketuk » untuk memilih sampel representatif.",
        instructionStartOver: "Ketuk MULAI LAGI untuk mengulang aktivitas.",
        endTitle: "Aktivitas Selesai!",
        endMessage:
          "Sampel 2 representatif karena lolos pemeriksaan Bentuk, Pusat, dan Sebaran.",
        endRemember:
          "<span class='hl-yellow'>Ingat:</span> periksa bentuk dahulu, lalu bandingkan pusat dan sebaran.",
        startOverButton: "MULAI LAGI",
      },
    },
  };

  window.getChallengeConfig = () => ({
    datasets,
    testResults,
    steps,
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
