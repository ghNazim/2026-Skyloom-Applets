const DATA = {
  en: {
    app: {
      start: {
        heading: "Three Checks to Identify a Representative Sample!",
        text:
          "A representative sample should pass three tests:<br>" +
          "<y>1. Shape</y> - The shape pattern should match the population<br>" +
          "<y>2. Centre</y> - The mean should be close to the population mean<br>" +
          "<y>3. Spread</y> - The sample range should be similar to the population range<br><br>" +
          "Let us see how to check any sample for these three tests.<br><br>" +
          "Tap ‘Start’ to begin.",
        buttonText: "START",
      },
      introBoxText:
        "A school recorded how many times 60 students visit the library per week.<br><br>Two samples of 15 students each were also collected.",
      sample1Label: "Sample 1:",
      sample2Label: "Sample 2:",
      buttons: {
        shape: "Shape",
        centre: "Centre",
        spread: "Spread",
        shapeWithColon: "Shape:",
        spreadWithColon: "Spread:",
        centreWithColon: "Centre:",
        meanPopulation: "Mean of<br>Population",
        meanSample1: "Mean of<br>Sample 1",
        meanSample2: "Mean of<br>Sample 2",
        meanNumerator: "Sum of (𝑥<sub>i</sub> × 𝑓<sub>i</sub>)",
        meanDenominator: "Sum of (𝑓<sub>i</sub>)",
        drawPopulation: "Draw shape of<br>Population",
        drawSample1: "Draw shape of<br>Sample 1",
        drawSample2: "Draw shape of<br>Sample 2",
        rangePopulation: "Range of<br>Population",
        rangeSample1: "Range of<br>Sample 1",
        rangeSample2: "Range of<br>Sample 2",
        highestValue: "Highest<br>value",
        lowestValue: "Lowest<br>value",
        pass: "Pass 👍",
        fail: "Fail 👎",
        s1Fail: "S1: 👎",
        s2Pass: "S2: 👍",
      },
      steps: {
        1: {
          questionText:
            "The data of population and samples are shown in the bar diagrams.",
          navText: "Tap » to check which sample is representative.",
        },
        2: {
          questionText:
            "The data of population and samples are shown in the bar diagrams.",
          navText: " ",
          afterAnimQuestion: "Choose a test you wish to check for…",
          afterAnimNav: "Tap Shape or Centre or Spread.",
        },
        A1: {
          questionText: "Check both samples for shape…",
          navText: "",
          afterButtonsNav: "Tap ‘Draw…’ to draw shape pattern.",
          afterAllDrawnQuestion: "Check both samples for shape…",
          afterAllDrawnNav: "Tap » to find which sample passes the Shape test",
        },
        A2: {
          questionText: "Does Sample 1 pass or fail the Shape test?",
          questionTextS2: "Does Sample 2 pass or fail the Shape test?",
          navText: "Tap the correct option for each sample.",
          feedbackS1:
            "Carefully look at the population and the sample’s shape pattern. The rise, peak, and fall are not the same.",
          feedbackS2:
            "Carefully look at the population and the sample’s shape pattern. The rise, peak, and fall are almost the same.",
          afterBothQuestion:
            "Sample 1 fails and sample 2 passes the Shape test.",
          afterBothNav: "Tap » to continue with other tests.",
        },
        A3: {
          questionText: "Shape test done. Let’s check samples for other tests.",
          navCentreOrSpread: "Tap Centre or Spread.",
          navCentreOnly: "Tap Centre.",
          navSpreadOnly: "Tap Spread.",
          navShapeOrCentre: "Tap Shape or Centre.",
          navShapeOnly: "Tap Shape.",
          navShapeOrSpread: "Tap Shape or Spread.",
        },
        C1: {
          questionText: "Check both samples for Spread (Range)…",
          navText: "",
          afterButtonsNav: "Tap ‘Range…’ to find the spread of each.",
          navHighest: "Tap ‘Highest value’.",
          navLowest: "Tap ‘Lowest value’.",
          navReveal: "Tap ? to reveal the final answer.",
          navRemaining:
            "Tap ‘Range…’ to find the spread of remaining diagrams.",
          afterAllNav: "Tap » to find which sample passes the Spread test.",
        },
        B1: {
          questionText: "Check both samples for Centre (Mean)…",
          navText: "",
          afterButtonsNav: "Tap ‘Mean…’ to find centre of each diagram.",
          navNumerator:
            "Tap the highlighted button to find the sum of all values.",
          navDenominator:
            "Tap the highlighted button to find the sum of frequencies.",
          navReveal: "Tap ? to reveal the final answer.",
          navRemaining: "Tap ‘Mean…’ to find the centre of remaining diagrams.",
          afterAllNav: "Tap » to find which sample passes the Centre test.",
        },
        B2: {
          questionText: "Does Sample 1 pass or fail the Centre test?",
          questionTextS2: "Does Sample 2 pass or fail the Centre test?",
          navText: "Tap the correct option for each sample.",
          feedbackS1:
            "Carefully look at the population and the sample’s mean. They are not close to each other.",
          feedbackS2:
            "Carefully look at the population and the sample’s mean. They are close to each other.",
          afterBothQuestion:
            "Sample 1 fails and sample 2 passes the Centre test.",
          afterBothNav: "Tap » to continue with other tests.",
        },
        B3: {
          questionText:
            "Centre test done. Let’s check samples for other tests.",
          navCentreOrSpread: "Tap Centre or Spread.",
          navCentreOnly: "Tap Centre.",
          navSpreadOnly: "Tap Spread.",
          navShapeOrCentre: "Tap Shape or Centre.",
          navShapeOnly: "Tap Shape.",
          navShapeOrSpread: "Tap Shape or Spread.",
        },
        C2: {
          questionText: "Does Sample 1 pass or fail the Spread test?",
          questionTextS2: "Does Sample 2 pass or fail the Spread test?",
          navText: "Tap the correct option for each sample.",
          feedbackS1:
            "Carefully look at the population and the sample’s range. They are not close to each other.",
          feedbackS2:
            "Carefully look at the population and the sample’s range. They are close to each other.",
          afterBothQuestion:
            "Sample 1 fails and sample 2 passes the Spread test.",
          afterBothNav: "Tap » to continue with other tests.",
        },
        C3: {
          questionText:
            "Spread test done. Let’s check samples for other tests.",
          navCentreOrSpread: "Tap Centre or Spread.",
          navCentreOnly: "Tap Centre.",
          navSpreadOnly: "Tap Spread.",
          navShapeOrCentre: "Tap Shape or Centre.",
          navShapeOnly: "Tap Shape.",
          navShapeOrSpread: "Tap Shape or Spread.",
        },
        3: {
          questionText: "Which sample is a representative sample?",
          navText: "Tap the correct sample.",
          wrongS1Feedback:
            "Not quite!\nSample 1 fails all three tests. Its shape, mean, and spread are not close to population.",
          correctS2Feedback:
            "Spot on! Sample 2 passes all three tests. So, it is the representative sample.",
          afterCorrectQuestion:
            "Great job! Sample 2 is the representative sample as it passes all three tests.",
          afterCorrectNav: "Tap \u00BB to summarize.",
          allDoneNav:
            "All tests done. Tap \u00BB to choose the representative sample.",
        },
        4: {
          heading: "Well Done!",
          text:
            "You learnt how to check samples for Shape, Centre, and Spread for a given population.<br><br>" +
            "A sample is representative when its <y>shape, centre, and spread</y> are almost the same as the population.<br><br>" +
            "Tap \u2018Start Over\u2019 to repeat this activity.",
          buttonText: "Start Over",
        },
      },
    },
  },
  id: {
    app: {
      start: {
        heading:
          "Tiga Pemeriksaan untuk Mengidentifikasi Sampel Representatif!",
        text:
          "Sampel representatif harus lolos tiga tes:<br>" +
          "<y>1. Bentuk</y> - Pola bentuk harus sesuai dengan populasi<br>" +
          "<y>2. Pusat</y> - Rata-rata harus dekat dengan rata-rata populasi<br>" +
          "<y>3. Sebaran</y> - Jangkauan sampel harus mirip dengan jangkauan populasi<br><br>" +
          "Mari kita lihat cara memeriksa sampel mana pun untuk ketiga tes ini.<br><br>" +
          "Ketuk ‘Mulai’ untuk memulai.",
        buttonText: "MULAI",
      },
      introBoxText:
        "Sebuah sekolah mencatat berapa kali 60 siswa mengunjungi perpustakaan per minggu.<br><br>Dua sampel masing-masing 15 siswa juga dikumpulkan.",
      sample1Label: "Sampel 1:",
      sample2Label: "Sampel 2:",
      buttons: {
        shape: "Bentuk",
        centre: "Pusat",
        spread: "Sebaran",
        shapeWithColon: "Bentuk:",
        spreadWithColon: "Sebaran:",
        centreWithColon: "Pusat:",
        meanPopulation: "Rata-rata<br>Populasi",
        meanSample1: "Rata-rata<br>Sampel 1",
        meanSample2: "Rata-rata<br>Sampel 2",
        meanNumerator: "Jumlah (𝑥<sub>i</sub> × 𝑓<sub>i</sub>)",
        meanDenominator: "Jumlah (𝑓<sub>i</sub>)",
        drawPopulation: "Gambar bentuk<br>Populasi",
        drawSample1: "Gambar bentuk<br>Sampel 1",
        drawSample2: "Gambar bentuk<br>Sampel 2",
        rangePopulation: "Jangkauan<br>Populasi",
        rangeSample1: "Jangkauan<br>Sampel 1",
        rangeSample2: "Jangkauan<br>Sampel 2",
        highestValue: "Nilai<br>tertinggi",
        lowestValue: "Nilai<br>terendah",
        pass: "Lolos 👍",
        fail: "Gagal 👎",
        s1Fail: "S1: 👎",
        s2Pass: "S2: 👍",
      },
      steps: {
        1: {
          questionText:
            "Data populasi dan sampel ditampilkan dalam diagram batang.",
          navText: "Ketuk » untuk memeriksa sampel mana yang representatif.",
        },
        2: {
          questionText:
            "Data populasi dan sampel ditampilkan dalam diagram batang.",
          navText: " ",
          afterAnimQuestion: "Pilih tes yang ingin kamu periksa…",
          afterAnimNav: "Ketuk Bentuk atau Pusat atau Sebaran.",
        },
        A1: {
          questionText: "Periksa kedua sampel untuk bentuk…",
          navText: "",
          afterButtonsNav: "Ketuk ‘Gambar…’ untuk menggambar pola bentuk.",
          afterAllDrawnQuestion: "Periksa kedua sampel untuk bentuk…",
          afterAllDrawnNav:
            "Ketuk » untuk menemukan sampel mana yang lolos tes Bentuk",
        },
        A2: {
          questionText: "Apakah Sampel 1 lolos atau gagal dalam tes Bentuk?",
          questionTextS2: "Apakah Sampel 2 lolos atau gagal dalam tes Bentuk?",
          navText: "Ketuk opsi yang benar untuk setiap sampel.",
          feedbackS1:
            "Perhatikan dengan saksama pola bentuk populasi dan sampel. Kenaikan, puncak, dan penurunannya tidak sama.",
          feedbackS2:
            "Perhatikan dengan saksama pola bentuk populasi dan sampel. Kenaikan, puncak, dan penurunannya hampir sama.",
          afterBothQuestion: "Sampel 1 gagal dan sampel 2 lolos tes Bentuk.",
          afterBothNav: "Ketuk » untuk melanjutkan dengan tes lainnya.",
        },
        A3: {
          questionText:
            "Tes bentuk selesai. Mari periksa sampel untuk tes lainnya.",
          navCentreOrSpread: "Ketuk Pusat atau Sebaran.",
          navCentreOnly: "Ketuk Pusat.",
          navSpreadOnly: "Ketuk Sebaran.",
          navShapeOrCentre: "Ketuk Bentuk atau Pusat.",
          navShapeOnly: "Ketuk Bentuk.",
          navShapeOrSpread: "Ketuk Bentuk atau Sebaran.",
        },
        C1: {
          questionText: "Periksa kedua sampel untuk Sebaran (Jangkauan)…",
          navText: "",
          afterButtonsNav:
            "Ketuk ‘Jangkauan…’ untuk menemukan sebaran masing-masing.",
          navHighest: "Ketuk ‘Nilai tertinggi’.",
          navLowest: "Ketuk ‘Nilai terendah’.",
          navReveal: "Ketuk ? untuk menampilkan jawaban akhir.",
          navRemaining:
            "Ketuk ‘Jangkauan…’ untuk menemukan sebaran diagram yang tersisa.",
          afterAllNav:
            "Ketuk » untuk menemukan sampel mana yang lolos tes Sebaran.",
        },
        B1: {
          questionText: "Periksa kedua sampel untuk Pusat (Rata-rata)…",
          navText: "",
          afterButtonsNav:
            "Ketuk ‘Rata-rata…’ untuk menemukan pusat setiap diagram.",
          navNumerator:
            "Ketuk tombol yang disorot untuk menemukan jumlah semua nilai.",
          navDenominator:
            "Ketuk tombol yang disorot untuk menemukan jumlah frekuensi.",
          navReveal: "Ketuk ? untuk menampilkan jawaban akhir.",
          navRemaining:
            "Ketuk ‘Rata-rata…’ untuk menemukan pusat diagram yang tersisa.",
          afterAllNav:
            "Ketuk » untuk menemukan sampel mana yang lolos tes Pusat.",
        },
        B2: {
          questionText: "Apakah Sampel 1 lolos atau gagal dalam tes Pusat?",
          questionTextS2: "Apakah Sampel 2 lolos atau gagal dalam tes Pusat?",
          navText: "Ketuk opsi yang benar untuk setiap sampel.",
          feedbackS1:
            "Perhatikan dengan saksama rata-rata populasi dan sampel. Keduanya tidak berdekatan.",
          feedbackS2:
            "Perhatikan dengan saksama rata-rata populasi dan sampel. Keduanya berdekatan.",
          afterBothQuestion: "Sampel 1 gagal dan sampel 2 lolos tes Pusat.",
          afterBothNav: "Ketuk » untuk melanjutkan dengan tes lainnya.",
        },
        B3: {
          questionText:
            "Tes pusat selesai. Mari periksa sampel untuk tes lainnya.",
          navCentreOrSpread: "Ketuk Pusat atau Sebaran.",
          navCentreOnly: "Ketuk Pusat.",
          navSpreadOnly: "Ketuk Sebaran.",
          navShapeOrCentre: "Ketuk Bentuk atau Pusat.",
          navShapeOnly: "Ketuk Bentuk.",
          navShapeOrSpread: "Ketuk Bentuk atau Sebaran.",
        },
        C2: {
          questionText: "Apakah Sampel 1 lolos atau gagal dalam tes Sebaran?",
          questionTextS2: "Apakah Sampel 2 lolos atau gagal dalam tes Sebaran?",
          navText: "Ketuk opsi yang benar untuk setiap sampel.",
          feedbackS1:
            "Perhatikan dengan saksama jangkauan populasi dan sampel. Keduanya tidak berdekatan.",
          feedbackS2:
            "Perhatikan dengan saksama jangkauan populasi dan sampel. Keduanya berdekatan.",
          afterBothQuestion: "Sampel 1 gagal dan sampel 2 lolos tes Sebaran.",
          afterBothNav: "Ketuk » untuk melanjutkan dengan tes lainnya.",
        },
        C3: {
          questionText:
            "Tes sebaran selesai. Mari periksa sampel untuk tes lainnya.",
          navCentreOrSpread: "Ketuk Pusat atau Sebaran.",
          navCentreOnly: "Ketuk Pusat.",
          navSpreadOnly: "Ketuk Sebaran.",
          navShapeOrCentre: "Ketuk Bentuk atau Pusat.",
          navShapeOnly: "Ketuk Bentuk.",
          navShapeOrSpread: "Ketuk Bentuk atau Sebaran.",
        },
        3: {
          questionText: "Sampel mana yang merupakan sampel representatif?",
          navText: "Ketuk sampel yang benar.",
          wrongS1Feedback:
            "Belum tepat!\nSampel 1 gagal di ketiga tes. Bentuk, rata-rata, dan sebarannya tidak mendekati populasi.",
          correctS2Feedback:
            "Tepat! Sampel 2 lolos ketiga tes. Jadi, sampel ini adalah sampel representatif.",
          afterCorrectQuestion:
            "Kerja bagus! Sampel 2 adalah sampel representatif karena lolos ketiga tes.",
          afterCorrectNav: "Ketuk \u00BB untuk merangkum.",
          allDoneNav:
            "Semua tes selesai. Ketuk \u00BB untuk memilih sampel representatif.",
        },
        4: {
          heading: "Bagus Sekali!",
          text:
            "Kamu belajar cara memeriksa sampel untuk Bentuk, Pusat, dan Sebaran dari populasi tertentu.<br><br>" +
            "Sampel representatif adalah ketika <y>bentuk, pusat, dan sebaran</y>-nya hampir sama dengan populasi.<br><br>" +
            "Ketuk \u2018Mulai Ulang\u2019 untuk mengulangi aktivitas ini.",
          buttonText: "Mulai Ulang",
        },
      },
    },
  },
};

const GRAPH_DATA = {
  population: [1, 2, 4, 6, 8, 10, 8, 6, 6, 4, 3, 2],
  sample1: [0, 0, 0, 0, 0, 4, 3, 3, 2, 1, 1, 1],
  sample2: [0, 1, 0, 1, 2, 3, 3, 2, 1, 1, 0, 1],
  popXRange: { min: 0, max: 12, step: 1, labelFrom: 1, labelTo: 12 },
  popYRange: { min: 0, max: 12, step: 2 },
  sampleXRange: { min: 0, max: 12, step: 1, labelFrom: 1, labelTo: 12 },
  sampleYRange: { min: 0, max: 4, step: 1 },
};

const GRAPH_COLORS = {
  popBar: "#2E75B6",
  popFill: "rgba(91,155,213,0.7)",
  popStroke: "rgba(145,195,245,1)",
  s1Bar: "#F05461",
  s1Fill: "rgba(255,105,180,0.7)",
  s1Stroke: "rgb(232, 75, 143)",
  s2Bar: "#F2C94C",
  s2Fill: "rgba(241,196,15,0.65)",
  s2Stroke: "rgb(255, 220, 90)",
  blinkGreen: "#7CFC00",
  blinkRed: "#ff5252",
  pathStrokeWidth: 11.25,
};

const APP_DATA = DATA[current_language].app;
