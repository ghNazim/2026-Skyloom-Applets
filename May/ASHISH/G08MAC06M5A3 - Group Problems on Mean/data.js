(() => {
  const language = window.APP_LANGUAGE || "en";

  const lesson = {
    groups: {
      add: {
        operator: "+",
        a: { count: 4, total: 20, mean: 5, piles: [5, 5, 5, 5] },
        b: { count: 2, total: 4, mean: 2, piles: [2, 2] },
        result: { count: 6, total: 24, mean: 4, piles: [4, 4, 4, 4, 4, 4] },
      },
      subtract: {
        operator: "−",
        a: { count: 8, total: 40, mean: 5 },
        b: { count: 3, total: 12, mean: 4 },
        result: { count: 5, total: 28, mean: "5.6" },
      },
    },
    problems: [
      {
        id: "classes",
        highlights: ["5", "150", "10", "160"],
        values: { aN: 5, aTotal: 750, aMean: 150, bN: 10, bTotal: 1600, bMean: 160, finalN: 15, finalTotal: 2350, finalMean: "156.67" },
        classify: [
          { field: "aN", answer: "5", kind: "given" }, { field: "aTotal", answer: "notGiven", kind: "notGiven" },
          { field: "aMean", answer: "150", kind: "given" }, { field: "bN", answer: "10", kind: "given" },
          { field: "bTotal", answer: "notGiven", kind: "notGiven" }, { field: "bMean", answer: "160", kind: "given" },
          { field: "finalN", answer: "notGiven", kind: "notGiven" }, { field: "finalTotal", answer: "notGiven", kind: "notGiven" },
          { field: "finalMean", answer: "toFind", kind: "toFind" },
        ],
        solve: [
          { field: "aTotal", formula: "aMean × aN", display: "150 × 5", answer: "750" },
          { field: "bTotal", formula: "bMean × bN", display: "160 × 10", answer: "1600" },
          { field: "finalN", formula: "aN + bN", display: "5 + 10", answer: "15" },
          { field: "finalTotal", formula: "aTotal + bTotal", display: "750 + 1600", answer: "2350" },
          { field: "finalMean", formula: "finalTotal ÷ finalN", display: "2350 ÷ 15", answer: "156.67" },
        ],
      },
      {
        id: "children",
        highlights: ["12", "166", "6", "167"],
        values: { aN: 12, aTotal: 1992, aMean: 166, bN: 6, bTotal: 1014, bMean: 169, finalN: 18, finalTotal: 3006, finalMean: 167 },
        classify: [
          { field: "aN", answer: "12", kind: "given" }, { field: "aTotal", answer: "notGiven", kind: "notGiven" },
          { field: "aMean", answer: "166", kind: "given" }, { field: "bN", answer: "6", kind: "given" },
          { field: "bTotal", answer: "notGiven", kind: "notGiven" }, { field: "bMean", answer: "toFind", kind: "toFind" },
          { field: "finalN", answer: "notGiven", kind: "notGiven" }, { field: "finalTotal", answer: "notGiven", kind: "notGiven" },
          { field: "finalMean", answer: "167", kind: "given" },
        ],
        solve: [
          { field: "aTotal", formula: "aMean × aN", display: "166 × 12", answer: "1992" },
          { field: "finalN", formula: "aN + bN", display: "12 + 6", answer: "18" },
          { field: "finalTotal", formula: "finalMean × finalN", display: "167 × 18", answer: "3006" },
          { field: "bTotal", formula: "finalTotal − aTotal", display: "3006 − 1992", answer: "1014" },
          { field: "bMean", formula: "bTotal ÷ bN", display: "1014 ÷ 6", answer: "169" },
        ],
      },
      {
        id: "domi",
        highlights: ["9", "56", "56.7"],
        values: { aN: 9, aTotal: 504, aMean: 56, bN: 1, bTotal: 63, bMean: 63, finalN: 10, finalTotal: 567, finalMean: "56.7" },
        classify: [
          { field: "aN", answer: "9", kind: "given" }, { field: "aTotal", answer: "notGiven", kind: "notGiven" },
          { field: "aMean", answer: "56", kind: "given" },
          { field: "bN", answer: "notGiven", kind: "notGiven" },
          { field: "bTotal", answer: "toFind", kind: "toFind" },
          { field: "bMean", answer: "notGiven", kind: "notGiven" },
          { field: "finalN", answer: "notGiven", kind: "notGiven" }, { field: "finalTotal", answer: "notGiven", kind: "notGiven" },
          { field: "finalMean", answer: "56.7", kind: "given" },
        ],
        solve: [
          { field: "aTotal", formula: "aMean × aN", display: "56 × 9", answer: "504" },
          { field: "finalN", formula: "aN + bN", display: "9 + 1", answer: "10" },
          { field: "finalTotal", formula: "finalMean × finalN", display: "56.7 × 10", answer: "567" },
          { field: "bTotal", formula: "finalTotal − aTotal", display: "567 − 504", answer: "63" },
        ],
      },
    ],
  };

  const shared = {
    lesson,
    images: { background: "./assets/DarkBG2.jpg", hand_cursor: "./assets/fingerTap.gif", coin: "./assets/coin.png" },
    sfx: {
      click: "./assets/sfx/click.mp3",
      correct: "./assets/sfx/correct.mp3",
      wrong: "./assets/sfx/wrong.mp3",
      split: "./assets/sfx/split.mp3",
      confetti: "./assets/sfx/confetti.mp3",
      tick: "./assets/sfx/tick.mp3",
      zoom: "./assets/sfx/zoom.mp3",
      swoosh: "./assets/sfx/swoosh.mp3",
    },
  };

  const appData = {
    en: { ...shared, html_title: "Group Mean Problems", ui: {
      welcomeTitle: "Group Mean Problems", welcomeMessage: 'You will be given two or more groups of data. These groups can be added or subtracted to form a final group.<br/><br/>The goal is to find any unknown from any group.<br/><br/>We will apply the same formula: <span class="hl-orange">Mean (x̄) = <span class="formula-fraction"><span class="num">Total sum of all values</span><span class="den">Number of data values</span></span></span><br/>to solve these problems.<br/><br/>Tap ‘Start’ to solve.', tapStartToBegin: "", startButton: "Start", startOverButton: "Start Over", nextButton: "»", backButton: "«",
      phaseBuild: "Build a group problem", phaseRules: "The group rule", phaseProblems: "Solve group problems", progress: "Problem {current} of {total}",
      buildAddTitle: "Before solving a problem, let’s build a combined group.", buildSubtractTitle: "The same idea works when one group is removed.", tapGroupA: "Tap Group 1.", tapGroupB: "Tap Group 2 to combine it with Group 1.", tapGroupBSubtract: "Tap Group 2 to remove it from Group 1.", tapFinal: "Tap Final Group to reveal the combined group.", tapFinalSubtract: "Tap Final Group.", tapCount: "Tap n to reveal the number of data points.", tapTotal: "Tap Total to reveal the total.", tapMean: "Tap Mean to reveal the mean.", continuePrompt: "Tap » to continue.", groupA: "Group 1", groupB: "Group 2", finalGroup: "Final Group", count: "n", total: "Total", mean: "Mean", dataPoints: "data points", pile: "Pile", combinedInsight: "The final group uses all data points and all values from both groups.", subtractionInsight: "For subtraction, subtract both the count and the total before finding the new mean.",
      groupAStory: "Group 1 has 4 number of data points with 5 as mean.", groupBStory: "Group 2 has 2 number of data points with 2 as mean.", finalGroupStory: "The final group is a combination of Group A and Group B. Let’s see how the final group is made.", finalCountStory: "The number of data points of the final group is the sum of the data points of each group: n = n₁ + n₂.", finalTotalStory: "The total of the final group is the sum of the totals of each group: Total = Total₁ + Total₂.", finalMeanStory: "The mean of the final group is calculated using the same old formula: <span class='title-formula'>Mean = Total ÷ n</span>",
      ruleTitle: "The same count-and-total rule works for any number of groups.", ruleInstruction: "Drag the slider at least twice to change the number of groups.", groupsLabel: "Groups", ruleAdd: "Combine groups: add their counts and totals.", ruleSubtract: "Remove a group: subtract its count and total.", sliderReady: "Nice. Tap » to solve some questions.",
      readCarefully: "Read the question carefully", questionLabel: "Q:", decimalSeparator: ".", identifyPrompt: "Tap » to identify the ‘given’ and ‘to find’ data.", identifyField: "From the question, determine <span class='hl-yellow'>{field}</span>.", chooseOption: "Tap the correct option.", classificationCompletePrompt: "Tap » to continue.", given: "Given", notGiven: "Not given", toFind: "To find", incorrect: "Look again at the wording and choose the matching value or status.", correct: "Correct!", understandNeed: "Carefully look at what we need to find and understand how it can be found.", startFinding: "Tap » to start finding what we need.", findFieldPrompt: "Let us first find the data that is <span class='hl-blue'>{status}</span> – starting with <span class='hl-yellow'>{field}.</span>", findFieldPromptNext: "Let us now find the next data which is <span class='hl-blue'>{status}</span> – <span class='hl-yellow'>{field}.</span>", rememberFormula: "Remember, <span class='hl-yellow'>{equation}</span>.", correctFormulaTitle: "That’s right! <span class='hl-yellow'>{equation}</span> = {formula}.", revealedFormulaTitle: "<span class='hl-yellow'>{equation}</span> = {formula} = {value}.", solvePrompt: "Choose the equation for {field}.", revealPrompt: "Tap {equation} to reveal its value.", wrongFormula: "That equation does not connect the known values to {field}. Try again.", formulaReady: "Good equation—tap it to reveal the result.", solvedProblem: "The answer is {answer}.", nextProblem: "Tap » to continue.",
      groupAName: "Group A", groupBName: "Group B", combinedName: "Combined", panelTitles_classes: ["Class A", "Class B", "Combined"], panelTitles_children: ["Before adding 6 children", "6 children", "After adding 6 children"], panelTitles_domi: ["Before adding Domi", "Domi", "After adding Domi"], field_aN: "n<sub>A</sub>", field_aTotal: "Total<sub>A</sub>", field_aMean: "Mean<sub>A</sub>", field_bN: "n<sub>B</sub>", field_bTotal: "Total<sub>B</sub>", field_bMean: "Mean<sub>B</sub>", field_finalN: "n", field_finalTotal: "Total", field_finalMean: "Mean", blank: "—", question_classes: "The average height of 5 students is 150 cm in Class A. The average height of 10 students is 160 cm in Class B. What is the combined mean height of both classes?", question_children: "The average height of 12 children is 166 cm. After adding 6 more children, the average becomes 167 cm. What is the average height of the 6 children?", question_domi: "The average weight of 9 children is 56 kg. After Domi joins the group, the average becomes 56.7 kg. Find Domi’s weight.",
      explain_classes: "To find the <span class='hl-yellow'>Mean of the combined group</span>, we need to know the <span class='hl-yellow'>Total and count, n of the combined group</span>. And to find the total and n, we <span class='hl-yellow'>need to know the total and count of each group</span>.",
      explain_children: "To find the <span class='hl-yellow'>Mean of the 6 children</span>, we need the <span class='hl-yellow'>count, n which is already given</span> and their <span class='hl-yellow'>Total height</span>. To find the unknown total, we <span class='hl-yellow'>need the Total of each group</span>.",
      explain_domi: "To find <span class='hl-yellow'>Domi's weight</span>, we <span class='hl-yellow'>subtract the Total weight before he joined from the Total weight after he joined</span>. And to find those totals, we <span class='hl-yellow'>need the Mean and count of each group</span>.",
      answer_classes: "The <span class='hl-yellow'>combined mean height</span> is 156.67 cm.", answer_children: "The <span class='hl-yellow'>average height of the 6 children</span> is 169 cm.", answer_domi: "<span class='hl-yellow'>Domi’s weight</span> is 63 kg.", formulaChoice1: "{left} × {right}", formulaChoice2: "{left} + {right}", formulaChoice3: "{left} − {right}", formulaChoice4: "{left} ÷ {right}",
      equationValue: "{label} = {value}", revealEquation: "{label} = {equation} = ?", endTitle: "Well Done!", endMessage: "You successfully understood and solved the group mean problems.<br/><br/>You now know the different kinds of questions that can be asked about mean.", endRemember: "Tap ‘Start over’ to repeat this activity.", instructionStartOver: "Tap ‘Start over’ to repeat this activity.", screenReaderWorkspace: "Interactive lesson workspace",
    }},
    id: { ...shared, html_title: "Soal Kelompok tentang Rata-rata", ui: {
      welcomeTitle: "Soal Kelompok tentang Rata-rata", welcomeMessage: 'Dua atau lebih kelompok data dapat digabungkan atau dikurangi untuk membentuk kelompok akhir.<br/><br/>Tujuannya adalah mencari nilai yang belum diketahui dari kelompok data.<br/><br/>Gunakan rumus: <span class="hl-orange">Rata-rata (x̄) = <span class="formula-fraction"><span class="num">Jumlah Nilai</span><span class="den">Banyak Data</span></span></span><br/><br/>Ketuk ‘Mulai’ untuk memulai.', tapStartToBegin: "", startButton: "Mulai", startOverButton: "Mulai Lagi", nextButton: "»", backButton: "«",
      phaseBuild: "Membangun soal kelompok", phaseRules: "Aturan kelompok", phaseProblems: "Menyelesaikan soal", progress: "Soal {current} dari {total}",
      buildAddTitle: "Mari kita bangun kelompok gabungan terlebih dahulu.", buildSubtractTitle: "Aturan yang sama berlaku jika satu kelompok dikurangi.", tapGroupA: "Ketuk Kelompok 1.", tapGroupB: "Ketuk Kelompok 2 untuk menggabungkan.", tapGroupBSubtract: "Ketuk Kelompok 2 untuk menguranginya dari Kelompok 1.", tapFinal: "Ketuk Kelompok Akhir.", tapFinalSubtract: "Ketuk Kelompok Akhir.", tapCount: "Ketuk n untuk melihat banyak data.", tapTotal: "Ketuk Total untuk melihat jumlahnya.", tapMean: "Ketuk Rata-rata untuk melihat hasilnya.", continuePrompt: "Ketuk » untuk melanjutkan.", groupA: "Kelompok 1", groupB: "Kelompok 2", finalGroup: "Kelompok Akhir", count: "n", total: "Total", mean: "Rata-rata", dataPoints: "data", pile: "Tumpukan", combinedInsight: "Kelompok akhir memuat semua data dan nilai dari kedua kelompok.", subtractionInsight: "Untuk pengurangan, kurangi banyak data dan total sebelum mencari rata-rata baru.",
      groupAStory: "Kelompok 1 memiliki 4 data dengan rata-rata 5.", groupBStory: "Kelompok 2 memiliki 2 data dengan rata-rata 2.", finalGroupStory: "Kelompok akhir adalah gabungan Kelompok 1 dan Kelompok 2.", finalCountStory: "Banyak data kelompok akhir: n = n₁ + n₂.", finalTotalStory: "Total kelompok akhir: Total = Total₁ + Total₂.", finalMeanStory: "Rata-rata kelompok akhir dihitung dengan rumus yang sama: <span class='title-formula'>Rata-rata = Total ÷ n</span>",
      ruleTitle: "Aturan n dan total berlaku untuk berapa pun jumlah kelompok.", ruleInstruction: "Geser penggeser setidaknya dua kali.", groupsLabel: "Kelompok", ruleAdd: "Gabung kelompok: jumlahkan n dan total.", ruleSubtract: "Kurangi kelompok: kurangkan n dan total.", sliderReady: "Bagus. Ketuk » untuk mulai mengerjakan soal.",
      readCarefully: "Baca soal dengan teliti.", questionLabel: "S:", decimalSeparator: ",", identifyPrompt: "Ketuk » untuk mengidentifikasi data yang ‘diketahui’ dan ‘dicari’.", identifyField: "Dari soal, tentukan <span class='hl-yellow'>{field}</span>.", chooseOption: "Ketuk pilihan yang benar.", classificationCompletePrompt: "Ketuk » untuk melanjutkan.", given: "Diketahui", notGiven: "Tidak diketahui", toFind: "Dicari", incorrect: "Baca kembali soal dan pilih nilai yang sesuai.", correct: "Benar!", understandNeed: "Perhatikan apa yang perlu dicari dan pahami cara menemukannya.", startFinding: "Ketuk » untuk mulai mencari.", findFieldPrompt: "Mari kita cari dulu data yang <span class='hl-blue'>{status}</span> – mulai dari <span class='hl-yellow'>{field}.</span>", findFieldPromptNext: "Mari sekarang cari data berikutnya yang <span class='hl-blue'>{status}</span> – <span class='hl-yellow'>{field}.</span>", rememberFormula: "Ingat, <span class='hl-yellow'>{equation}</span>.", correctFormulaTitle: "Benar! <span class='hl-yellow'>{equation}</span> = {formula}.", revealedFormulaTitle: "<span class='hl-yellow'>{equation}</span> = {formula} = {value}.", solvePrompt: "Pilih persamaan untuk {field}.", revealPrompt: "Ketuk {equation} untuk melihat nilainya.", wrongFormula: "Persamaan tersebut belum tepat. Coba lagi.", formulaReady: "Persamaan benar—ketuk untuk melihat hasil.", solvedProblem: "Jawabannya adalah {answer}.", nextProblem: "Ketuk » untuk melanjutkan.",
      groupAName: "Kelompok A", groupBName: "Kelompok B", combinedName: "Gabungan", panelTitles_classes: ["Kelas A", "Kelas B", "Gabungan"], panelTitles_children: ["Sebelum menambahkan 6 anak", "6 anak", "Setelah menambahkan 6 anak"], panelTitles_domi: ["Sebelum Domi bergabung", "Domi", "Setelah Domi bergabung"], field_aN: "n<sub>A</sub>", field_aTotal: "Total<sub>A</sub>", field_aMean: "Rata-rata<sub>A</sub>", field_bN: "n<sub>B</sub>", field_bTotal: "Total<sub>B</sub>", field_bMean: "Rata-rata<sub>B</sub>", field_finalN: "n", field_finalTotal: "Total", field_finalMean: "Rata-rata", blank: "—", question_classes: "Rata-rata tinggi 5 siswa di Kelas A adalah 150 cm. Rata-rata tinggi 10 siswa di Kelas B adalah 160 cm. Berapa rata-rata tinggi gabungan kedua kelas?", question_children: "Rata-rata tinggi 12 anak adalah 166 cm. Setelah 6 anak ditambahkan, rata-ratanya menjadi 167 cm. Berapa rata-rata tinggi 6 anak itu?", question_domi: "Rata-rata berat 9 anak adalah 56 kg. Setelah Domi bergabung, rata-ratanya menjadi 56,7 kg. Berapa berat Domi?",
      explain_classes: "Untuk mencari <span class='hl-yellow'>Rata-rata gabungan</span>, kita perlu <span class='hl-yellow'>Total dan n gabungan</span>. Untuk itu, kita perlu <span class='hl-yellow'>Total dan n tiap kelompok</span>.",
      explain_children: "Untuk mencari <span class='hl-yellow'>Rata-rata 6 anak</span>, kita butuh <span class='hl-yellow'>n yang diketahui</span> dan <span class='hl-yellow'>Total tinggi</span>. Untuk itu, kita perlu <span class='hl-yellow'>Total tiap kelompok</span>.",
      explain_domi: "Untuk mencari <span class='hl-yellow'>berat Domi</span>, kita <span class='hl-yellow'>kurangi Total berat sesudah dan sebelum bergabung</span>. Untuk itu, kita perlu <span class='hl-yellow'>Rata-rata dan n tiap kelompok</span>.",
      answer_classes: "<span class='hl-yellow'>Rata-rata tinggi gabungan</span> adalah 156,67 cm.", answer_children: "<span class='hl-yellow'>Rata-rata tinggi 6 anak</span> adalah 169 cm.", answer_domi: "<span class='hl-yellow'>Berat Domi</span> adalah 63 kg.", formulaChoice1: "{left} × {right}", formulaChoice2: "{left} + {right}", formulaChoice3: "{left} − {right}", formulaChoice4: "{left} ÷ {right}",
      equationValue: "{label} = {value}", revealEquation: "{label} = {equation} = ?", endTitle: "Hebat!", endMessage: "Kamu berhasil memahami dan menyelesaikan soal kelompok tentang rata-rata.<br/><br/>Sekarang kamu memahami berbagai jenis soal tentang rata-rata.", endRemember: "Ketuk ‘Mulai lagi’ untuk mengulang.", instructionStartOver: "Ketuk ‘Mulai lagi’ untuk mengulang aktivitas ini.", screenReaderWorkspace: "Area pelajaran interaktif",
    }},
  };

  window.T = appData[appData[language] ? language : "en"];
  window.localizeNumberText = (value) => {
    const text = String(value ?? "");
    return window.T.ui.decimalSeparator === "," ? text.replace(/(\d)\.(\d)/g, "$1,$2") : text;
  };
  window.formatText = (template, values) => Object.keys(values || {}).reduce((text, key) => text.replaceAll(`{${key}}`, values[key]), template);
})();
