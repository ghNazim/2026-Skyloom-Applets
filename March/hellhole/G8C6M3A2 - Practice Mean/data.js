const PLANT_VISUAL_EN = {
  studentCount: 12,
  studentImageSingle: "assets/plant.png",
  studentSizesPattern: [
    "medium",
    "full",
    "small",
    "full",
    "medium",
    "full",
    "small",
    "medium",
    "small",
    "full",
    "full",
    "medium",
  ],
  totalValue: "?",
  meanImage: "assets/plant.png",
  meanValue: "24 cm",
};

const BAGS_VISUAL_Q3_EN = {
  layout: "q3Bags",
  bagImage: "assets/bag.png",
  meanImage: "assets/bagGrey.png",
  totalValue: "360",
  meanValue: "12 kg",
  finalBagCount: 30,
  q3Slots: [
    { label: "1", bagSize: "small" },
    { label: "2", bagSize: "large" },
    { label: "3", bagSize: "medium" },
    { label: "...", type: "ellipsis" },
    { label: "n", bagSize: "medium", isN: true },
  ],
};

const MISSING_VALUE_VISUAL_Q4_EN = {
  layout: "q4Slots",
  slotLabels: ["1", "2", "3", "4", "5"],
  slotValues: ["4", "6", "x", "5", "5"],
  missingSlotIndex: 2,
  meanImage: "assets/mean1.png",
  meanValue: "6",
  totalValue: "?",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Mean: Practice",
        textTop: "We know how to find the mean of a dataset.",
        formulaLead: "Mean (<span class='x-overline'>x</span>) = ",
        formulaSumNumerator: "Sum of all values",
        formulaSumDenominator: "Number of data values",
        formulaExpandedNumerator:
          "x<sub>1</sub> + x<sub>2</sub> + &ctdot; + x<sub>n</sub>",
        formulaExpandedDenominator: "n",
        textBottom: "Tap 'Start' to solve some questions using this formula.",
        buttonText: "Start",
      },
      terms: {
        mean: "Mean",
        meanEquals: "Mean =",
        total: "Total",
        sumOfAllValues: "Sum of all values",
        numberOfDataValues: "Number of data values",
        sumShort: "Sum",
        numberShort: "Number",
        values: "Values",
        formulaExpandedNumerator:
          "x<sub>1</sub> + x<sub>2</sub> + &ctdot; + x<sub>n</sub>",
        formulaExpandedDenominator: "n",
      },
      end: {
        heading: "Well Done!",
        textTop:
          "Every mean problem is the same three-part puzzle: <y>sum of data values, number of data values, and mean.</y><br>Two are given, one is missing.<br>You practiced all three versions of the missing piece.",
        textBottom: "Tap 'Start Over' to repeat this activity.",
        buttonText: "Start Over",
      },
      labels: {
        givenTitle: "Given:",
        toFindTitle: "To Find:",
        total: "Total",
        mean: "Mean",
      },
      questions: [
        {
          steps: {
            1: {
              questionText: "Read the question carefully.",
              navText: "Tap » to identify the 'given' and 'to find' data.",
              statement:
                "In a test, 8 students scored<br>a total of 600 marks.<br>What is the mean score?",
            },
            2: {
              keysOrder: ["students", "total", "mean"],
              givenHighlightsAnyOrder: true,
              revealHintUntilPriorDone: true,
              questionText: "What does the question tell you?",
              questionText2: "What else does the question tell you?",
              questionText3: "What is the question asking for?",
              questionTextComplete:
                "We found all the 'given' and 'to find' data.",
              questionTextWrong:
                "That's wrong! Try again. What does the question tell you?",
              navText: "Tap the 'given' data from the question.",
              navTextToFind: "Tap the data 'to find'",
              navTextDone: "Tap » to solve the question now.",
              statementTemplate:
                "In a test, <span class='qs-highlight highlight-given' data-key='students'>8 students</span> scored<br>a <span class='qs-highlight highlight-given' data-key='total'>total of 600 marks</span>.<br>What is the <span class='qs-highlight highlight-find' data-key='mean'>mean score</span>?",
              givenN: "n = 8",
              givenTotal: "Total = 600",
              toFindMean: "Mean = ?",
              revealHint: "Tap the given information to reveal",
              visual: {
                studentCount: 8,
                studentImagePrefix: "assets/student",
                studentImageSuffix: ".png",
                totalValue: "600",
                meanImage: "assets/mean1.png",
                meanValue: "?",
              },
            },
            3: {
              questionText:
                "Which equation puts each value in its right place?",
              navText: "Tap the correct equation.",
              navTextDone: "Tap » to continue with the next challenge.",
              questionTextDone: "Great! The mean score is 75.",
              answerSlot: "mean",
              finalAnswer: "75",
              phases: [
                {
                  q: "Which equation puts each value in its right place?",
                  qWrong: "That's wrong! Try again.",
                  options: [
                    {
                      lhs: "<ol>x</ol>",
                      rhsFraction: {
                        numerator: "600",
                        denominator: "8",
                      },
                    },
                    {
                      lhs: "<ol>x</ol>",
                      rhsFraction: {
                        numerator: "8",
                        denominator: "600",
                      },
                    },
                    {
                      lhs: "600",
                      rhsFraction: {
                        numerator: "8",
                        denominator: "<ol>x</ol>",
                      },
                    },
                  ],
                  correct: 0,
                  exp1: {
                    type: "mean_formula",
                    left: "Mean =",
                    numerator: "Sum of all values",
                    denominator: "Number of data values",
                  },
                  implies1: false,
                  implies2: true,
                },
                {
                  q: "Great, Now solve for <ol>x</ol>. What does (600/8) gives us.",
                  qWrong: "That's wrong! Try again.",
                  qCorrect:
                    "That's right! The mean of the score is, <ol>x</ol> = 75.",
                  options: [
                    { lhs: "<ol>x</ol>", rhs: "65" },
                    { lhs: "<ol>x</ol>", rhs: "75" },
                    { lhs: "<ol>x</ol>", rhs: "70" },
                  ],
                  correct: 1,
                  exp1FromPrevious: true,
                  implies1: true,
                  implies2: true,
                },
              ],
              visual: {
                studentCount: 8,
                studentImagePrefix: "assets/student",
                studentImageSuffix: ".png",
                totalValue: "600",
                meanImage: "assets/mean1.png",
                meanValue: "?",
              },
            },
          },
        },
        {
          steps: {
            1: {
              questionText:
                "Read the question carefully. A twist — this time the mean is given.",
              navText: "Tap » to identify the 'given' and 'to find' data.",
              statement:
                "12 plants have a<br>mean height of 24 cm.<br>What is their total height?",
            },
            2: {
              keysOrder: ["students", "mean", "total"],
              givenHighlightsAnyOrder: true,
              revealHintUntilPriorDone: true,
              questionText: "What does the question tell you?",
              questionText2: "What else does the question tell you?",
              questionText3: "What is the question asking for?",
              questionTextComplete:
                "We found all the 'given' and 'to find' data.",
              questionTextWrong:
                "That's wrong! Try again. What does the question tell you?",
              navText: "Tap the 'given' data from the question.",
              navTextToFind: "Tap the data 'to find'",
              navTextDone: "Tap » to solve the question now.",
              statementTemplate:
                "<span class='qs-highlight highlight-given' data-key='students'>12 plants</span> have a<br><span class='qs-highlight highlight-given' data-key='mean'>mean height of 24 cm</span>.<br>What is their <span class='qs-highlight highlight-find' data-key='total'>total height</span>?",
              givenN: "n = 12",
              givenMean: "Mean = 24 cm",
              toFindTotal: "Total = ?",
              revealHint: "Tap the given information to reveal",
              visual: PLANT_VISUAL_EN,
            },
            3: {
              questionText:
                "Which equation has the sum (total) in the right place?",
              navText: "Tap the correct equation.",
              navTextDone: "Tap » to continue with the next challenge.",
              questionTextDone: "Great! Total height is 288 cm.",
              answerSlot: "total",
              finalAnswer: "288",
              phases: [
                {
                  q: "Which equation has the sum (total) in the right place?",
                  qWrong: "That's wrong! Try again.",
                  options: [
                    {
                      lhs: "12",
                      rhsFraction: {
                        numerator: "Total",
                        denominator: "24",
                      },
                    },
                    {
                      lhs: "Total",
                      rhsFraction: {
                        numerator: "12",
                        denominator: "24",
                      },
                    },
                    {
                      lhs: "24",
                      rhsFraction: {
                        numerator: "Total",
                        denominator: "12",
                      },
                    },
                  ],
                  correct: 2,
                  exp1: {
                    type: "mean_formula",
                    left: "Mean =",
                    numerator: "Sum of all values",
                    denominator: "Number of data values",
                  },
                  implies1: false,
                  implies2: true,
                },
                {
                  q: "To get Total alone, undo the division by 12.",
                  qWrong: "That's wrong! Try again.",
                  options: [
                    { lhs: "Total", rhs: "24 × 12" },
                    { lhs: "Total", rhs: "24 + 12" },
                    {
                      lhs: "Total",
                      rhsFraction: {
                        numerator: "24",
                        denominator: "12",
                      },
                    },
                  ],
                  correct: 0,
                  exp1FromPrevious: true,
                  implies1: true,
                  implies2: true,
                },
                {
                  q: "Now compute 24 ×12.",
                  qWrong: "That's wrong! Try again.",
                  qCorrect: "That's right! Total height = 288 cm.",
                  options: [
                    { lhs: "Total", rhs: "280" },
                    { lhs: "Total", rhs: "228" },
                    { lhs: "Total", rhs: "288" },
                  ],
                  correct: 2,
                  exp1FromPrevious: true,
                  implies1: true,
                  implies2: true,
                },
              ],
              visual: PLANT_VISUAL_EN,
            },
          },
        },
        {
          steps: {
            1: {
              questionText:
                "Another twist — this time the number of items is missing.",
              navText: "Tap » to identify the 'given' and 'to find' data.",
              statement:
                "A group of bags has<br>a total weight of 360 kg.<br>The mean weight is 12 kg per bag.<br>How many bags are there?",
            },
            2: {
              keysOrder: ["total", "mean", "bags"],
              givenHighlightsAnyOrder: true,
              revealHintUntilPriorDone: true,
              questionText: "What does the question tell you?",
              questionText2: "What else does the question tell you?",
              questionText3: "What is the question asking for?",
              questionTextComplete:
                "We found all the 'given' and 'to find' data.",
              questionTextWrong:
                "That's wrong! Try again. What does the question tell you?",
              navText: "Tap the 'given' data from the question.",
              navTextToFind: "Tap the data 'to find'",
              navTextDone: "Tap » to solve the question now.",
              statementTemplate:
                "A group of bags has<br>a <span class='qs-highlight highlight-given' data-key='total'>total weight of 360 kg</span>.<br>The <span class='qs-highlight highlight-given' data-key='mean'>mean weight is 12 kg </span> per bag.<br><span class='qs-highlight highlight-find' data-key='bags'>How many bags </span> are there?",
              givenTotal: "Total = 360 kg",
              givenMean: "Mean = 12 kg",
              toFindN: "n = ?",
              revealHint: "Tap the given information to reveal",
              visual: BAGS_VISUAL_Q3_EN,
            },
            3: {
              questionText: "Which equation places each value correctly?",
              navText: "Tap the correct equation.",
              navTextDone: "Tap » for the next challenge.",
              questionTextDone: "Great! There are 30 bags in the group.",
              answerSlot: "n",
              finalAnswer: "30",
              phases: [
                {
                  q: "Which equation places each value correctly?",
                  qWrong: "That's wrong! Try again.",
                  options: [
                    {
                      lhs: "12",
                      rhsFraction: {
                        numerator: "360",
                        denominator: "n",
                      },
                    },
                    {
                      lhs: "12",
                      rhsFraction: {
                        numerator: "n",
                        denominator: "360",
                      },
                    },
                    {
                      lhs: "n",
                      rhsFraction: {
                        numerator: "12",
                        denominator: "360",
                      },
                    },
                  ],
                  correct: 0,
                  exp1: {
                    type: "mean_formula",
                    left: "Mean =",
                    numerator: "Sum of all values",
                    denominator: "Number of data values",
                  },
                  implies1: false,
                  implies2: true,
                },
                {
                  q: "To get n alone, undo the division.",
                  qWrong: "That's wrong! Try again.",
                  options: [
                    {
                      lhs: "n",
                      rhsFraction: {
                        numerator: "360",
                        denominator: "12",
                      },
                    },
                    { lhs: "n", rhs: "360 × 12" },
                    { lhs: "n", rhs: "360 − 12" },
                  ],
                  correct: 0,
                  exp1FromPrevious: true,
                  implies1: true,
                  implies2: true,
                },
                {
                  q: "Now compute 360 ÷ 12.",
                  qWrong: "That's wrong! Try again.",
                  qCorrect: "That's right! n = 30.",
                  options: [
                    { lhs: "n", rhs: "3" },
                    { lhs: "n", rhs: "30" },
                    { lhs: "n", rhs: "300" },
                  ],
                  correct: 1,
                  exp1FromPrevious: true,
                  implies1: true,
                  implies2: true,
                },
              ],
              visual: BAGS_VISUAL_Q3_EN,
            },
          },
        },
        {
          steps: {
            1: {
              questionText:
                "Now, the hardest pattern — one data value is missing.",
              navText: "Tap » to identify the 'given' and 'to find' data.",
              statement:
                "Five friends recorded the<br>number of books they read:  4,  6,  x,  5,  5.<br>The mean is 6 books.<br>Find the missing value, x.",
            },
            2: {
              keysOrder: ["students", "dataset", "mean", "missing"],
              givenHighlightsAnyOrder: true,
              revealHintUntilPriorDone: true,
              questionText: "What does the question tell you?",
              questionText2: "What else does the question tell you?",
              questionText3: "What else does the question tell you?",
              questionText4: "What is the question asking for?",
              questionTextComplete:
                "We found all the 'given' and 'to find' data.",
              questionTextWrong:
                "That's wrong! Try again. What does the question tell you?",
              navText: "Tap the 'given' data from the question.",
              navTextToFind: "Tap the data 'to find'",
              navTextDone: "Tap » to solve the question now.",
              statementTemplate:
                "<span class='qs-highlight highlight-given' data-key='students'>Five friends</span> recorded the<br>number of books they read: <span class='qs-highlight highlight-given' data-key='dataset'> 4,  6,  x,  5,  5.</span><br>The <span class='qs-highlight highlight-given' data-key='mean'>mean is 6</span> books.<br><span class='qs-highlight highlight-find' data-key='missing'>Find the missing value, x</span>.",
              givenN: "n = 5",
              givenValues: "Values = 4, 6, x, 5, 5",
              givenMean: "Mean = 6",
              toFindX: "x = ?",
              revealHint: "Tap the given information to reveal",
              visual: MISSING_VALUE_VISUAL_Q4_EN,
            },
            3: {
              questionText: "Plug each value into its position in the formula.",
              navText: "Tap the correct equation.",
              navTextDone: "Tap » to wrap up.",
              questionTextDone: "Great! The missing value is x = 10.",
              answerSlot: "xSlot",
              finalAnswer: "10",
              phases: [
                {
                  q: "Plug each value into its position in the formula.",
                  qWrong: "That's wrong! Try again.",
                  options: [
                    {
                      lhs: "6",
                      rhsFraction: {
                        numerator: "4 + 6 + x + 5 + 5",
                        denominator: "5",
                      },
                    },
                    {
                      lhs: "5",
                      rhsFraction: {
                        numerator: "4 + 6 + x + 5 + 5",
                        denominator: "6",
                      },
                    },
                    {
                      lhs: "6",
                      rhs: "(4 + 6 + x + 5 + 5) × 5",
                    },
                  ],
                  correct: 0,
                  exp1: {
                    type: "html",
                    useTermsFormula: true,
                  },
                  implies1: false,
                  implies2: true,
                },
                {
                  q: "Multiply both sides by 5 to clear the denominator.",
                  qWrong: "That's wrong! Try again.",
                  options: [
                    { lhs: "11", rhs: "4 + 6 + x + 5 + 5" },
                    { lhs: "30", rhs: "4 + 6 + x + 5 + 5" },
                    { lhs: "6", rhs: "4 + 6 + x + 5 + 5 − 5" },
                  ],
                  correct: 1,
                  exp1FromPrevious: true,
                  implies1: true,
                  implies2: true,
                },
                {
                  q: "Add the known values on the right.",
                  qWrong: "That's wrong! Try again.",
                  options: [
                    { lhs: "30", rhs: "20 + x" },
                    { lhs: "30", rhs: "10 + x" },
                    { lhs: "30", rhs: "4 + 6 + 5 + 5 + x" },
                  ],
                  correct: 0,
                  exp1FromPrevious: true,
                  implies1: true,
                  implies2: true,
                },
                {
                  q: "Subtract 20 from both sides to isolate x.",
                  qWrong: "That's wrong! Try again.",
                  qCorrect: "That's right! x = 10.",
                  options: [
                    { lhs: "x", rhs: "50" },
                    { lhs: "x", rhs: "30" },
                    { lhs: "x", rhs: "10" },
                  ],
                  correct: 2,
                  exp1FromPrevious: true,
                  implies1: true,
                  implies2: true,
                },
              ],
              visual: MISSING_VALUE_VISUAL_Q4_EN,
            },
          },
        },
      ],
    },
  },
  id: {
    app: {
      start: {
        heading: "Mean: Latihan",
        textTop:
          "Kita sudah tahu cara mencari nilai rata-rata suatu kumpulan data.",
        formulaLead: "Rata-rata (<span class='x-overline'>x</span>) = ",
        formulaSumNumerator: "Jumlah semua nilai",
        formulaSumDenominator: "Banyaknya nilai data",
        formulaExpandedNumerator:
          "x<sub>1</sub> + x<sub>2</sub> + &ctdot; + x<sub>n</sub>",
        formulaExpandedDenominator: "n",
        textBottom:
          "Ketuk 'Mulai' untuk menyelesaikan beberapa soal dengan rumus ini.",
        buttonText: "Mulai",
      },
      terms: {
        mean: "Rata-rata",
        meanEquals: "Rata-rata =",
        total: "Jumlah",
        sumOfAllValues: "Jumlah semua nilai",
        numberOfDataValues: "Banyaknya nilai data",
        sumShort: "Jumlah",
        numberShort: "Banyaknya",
        values: "Nilai",
        formulaExpandedNumerator:
          "x<sub>1</sub> + x<sub>2</sub> + &ctdot; + x<sub>n</sub>",
        formulaExpandedDenominator: "n",
      },
      end: {
        heading: "Bagus sekali!",
        textTop:
          "Setiap soal nilai rata-rata adalah teka-teki tiga bagian yang sama: <y>jumlah nilai data, banyaknya nilai data, dan nilai rata-rata.</y><br>Dua diketahui, satu belum diketahui.<br>Kamu sudah berlatih ketiga bentuk bagian yang belum diketahui itu.",
        textBottom: "Ketuk 'Mulai Lagi' untuk mengulang aktivitas ini.",
        buttonText: "Mulai Lagi",
      },
      labels: {
        givenTitle: "Diketahui:",
        toFindTitle: "Ditanya:",
        total: "Jumlah",
        mean: "Rata-rata",
      },
      questions: [
        {
          steps: {
            1: {
              questionText: "Baca soal dengan teliti.",
              navText:
                "Ketuk » untuk mengenali data yang 'diketahui' dan 'ditanya'.",
              statement:
                "Dalam suatu tes, 8 siswa memperoleh<br>jumlah nilai 600.<br>Berapa nilai rata-ratanya?",
            },
            2: {
              keysOrder: ["students", "total", "mean"],
              givenHighlightsAnyOrder: true,
              revealHintUntilPriorDone: true,
              questionText: "Apa yang diberitahukan soal kepadamu?",
              questionText2: "Apa lagi yang diberitahukan soal?",
              questionText3: "Apa yang ditanyakan soal?",
              questionTextComplete:
                "Kita sudah menemukan semua data yang diketahui dan yang ditanya.",
              questionTextWrong:
                "Salah! Coba lagi. Apa yang diberitahukan soal kepadamu?",
              navText: "Ketuk data yang diketahui dari soal.",
              navTextToFind: "Ketuk data yang ditanya",
              navTextDone: "Ketuk » untuk menyelesaikan soal sekarang.",
              statementTemplate:
                "Dalam suatu tes, <span class='qs-highlight highlight-given' data-key='students'>8 siswa</span> memperoleh<br><span class='qs-highlight highlight-given' data-key='total'>jumlah nilai 600</span>.<br>Berapa <span class='qs-highlight highlight-find' data-key='mean'>nilai rata-rata</span>-nya?",
              givenN: "n = 8",
              givenTotal: "Jumlah = 600",
              toFindMean: "Rata-rata = ?",
              revealHint: "Ketuk informasi yang diketahui untuk menampilkannya",
              visual: {
                studentCount: 8,
                studentImagePrefix: "assets/student",
                studentImageSuffix: ".png",
                totalValue: "600",
                meanImage: "assets/mean1.png",
                meanValue: "?",
              },
            },
            3: {
              questionText:
                "Persamaan manakah yang menempatkan setiap nilai pada tempat yang benar?",
              navText: "Ketuk persamaan yang benar.",
              navTextDone: "Ketuk » untuk melanjutkan ke tantangan berikutnya.",
              questionTextDone: "Bagus! Nilai rata-ratanya adalah 75.",
              answerSlot: "mean",
              finalAnswer: "75",
              phases: [
                {
                  q: "Persamaan manakah yang menempatkan setiap nilai pada tempat yang benar?",
                  qWrong: "Salah! Coba lagi.",
                  options: [
                    {
                      lhs: "<ol>x</ol>",
                      rhsFraction: {
                        numerator: "600",
                        denominator: "8",
                      },
                    },
                    {
                      lhs: "<ol>x</ol>",
                      rhsFraction: {
                        numerator: "8",
                        denominator: "600",
                      },
                    },
                    {
                      lhs: "600",
                      rhsFraction: {
                        numerator: "8",
                        denominator: "<ol>x</ol>",
                      },
                    },
                  ],
                  correct: 0,
                  exp1: {
                    type: "mean_formula",
                    left: "Rata-rata =",
                    numerator: "Jumlah semua nilai",
                    denominator: "Banyaknya nilai data",
                  },
                  implies1: false,
                  implies2: true,
                },
                {
                  q: "Bagus, sekarang selesaikan untuk <ol>x</ol>. Berapa hasil (600/8)?",
                  qWrong: "Salah! Coba lagi.",
                  qCorrect: "Benar! Rata-rata nilainya adalah <ol>x</ol> = 75.",
                  options: [
                    { lhs: "<ol>x</ol>", rhs: "65" },
                    { lhs: "<ol>x</ol>", rhs: "75" },
                    { lhs: "<ol>x</ol>", rhs: "70" },
                  ],
                  correct: 1,
                  exp1FromPrevious: true,
                  implies1: true,
                  implies2: true,
                },
              ],
              visual: {
                studentCount: 8,
                studentImagePrefix: "assets/student",
                studentImageSuffix: ".png",
                totalValue: "600",
                meanImage: "assets/mean1.png",
                meanValue: "?",
              },
            },
          },
        },
        {
          steps: {
            1: {
              questionText:
                "Baca soal dengan teliti. Sekarang ada twist — rata-rata sudah diketahui.",
              navText:
                "Ketuk » untuk mengenali data yang 'diketahui' dan 'ditanya'.",
              statement:
                "12 tanaman mempunyai<br>tinggi rata-rata 24 cm.<br>Berapa jumlah tingginya?",
            },
            2: {
              keysOrder: ["students", "mean", "total"],
              givenHighlightsAnyOrder: true,
              revealHintUntilPriorDone: true,
              questionText: "Apa yang diberitahukan soal kepadamu?",
              questionText2: "Apa lagi yang diberitahukan soal?",
              questionText3: "Apa yang ditanyakan soal?",
              questionTextComplete:
                "Kita sudah menemukan semua data yang diketahui dan yang ditanya.",
              questionTextWrong:
                "Salah! Coba lagi. Apa yang diberitahukan soal kepadamu?",
              navText: "Ketuk data yang diketahui dari soal.",
              navTextToFind: "Ketuk data yang ditanya",
              navTextDone: "Ketuk » untuk menyelesaikan soal sekarang.",
              statementTemplate:
                "<span class='qs-highlight highlight-given' data-key='students'>12 tanaman</span> mempunyai<br><span class='qs-highlight highlight-given' data-key='mean'>tinggi rata-rata 24 cm</span>.<br>Berapa <span class='qs-highlight highlight-find' data-key='total'>jumlah tinggi</span>-nya?",
              givenN: "n = 12",
              givenMean: "Rata-rata = 24 cm",
              toFindTotal: "Jumlah = ?",
              revealHint: "Ketuk informasi yang diketahui untuk menampilkannya",
              visual: PLANT_VISUAL_EN,
            },
            3: {
              questionText:
                "Persamaan manakah yang menempatkan jumlah pada tempat yang benar?",
              navText: "Ketuk persamaan yang benar.",
              navTextDone: "Ketuk » untuk melanjutkan ke tantangan berikutnya.",
              questionTextDone: "Bagus! Jumlah tingginya = 288 cm.",
              answerSlot: "total",
              finalAnswer: "288",
              phases: [
                {
                  q: "Persamaan manakah yang menempatkan jumlah pada tempat yang benar?",
                  qWrong: "Salah! Coba lagi.",
                  options: [
                    {
                      lhs: "12",
                      rhsFraction: {
                        numerator: "Jumlah",
                        denominator: "24",
                      },
                    },
                    {
                      lhs: "Jumlah",
                      rhsFraction: {
                        numerator: "12",
                        denominator: "24",
                      },
                    },
                    {
                      lhs: "24",
                      rhsFraction: {
                        numerator: "Jumlah",
                        denominator: "12",
                      },
                    },
                  ],
                  correct: 2,
                  exp1: {
                    type: "mean_formula",
                    left: "Rata-rata =",
                    numerator: "Jumlah semua nilai",
                    denominator: "Banyaknya nilai data",
                  },
                  implies1: false,
                  implies2: true,
                },
                {
                  q: "Untuk mendapatkan Jumlah saja, batalkan pembagian dengan 12.",
                  qWrong: "Salah! Coba lagi.",
                  options: [
                    { lhs: "Jumlah", rhs: "24 × 12" },
                    { lhs: "Jumlah", rhs: "24 + 12" },
                    {
                      lhs: "Jumlah",
                      rhsFraction: {
                        numerator: "24",
                        denominator: "12",
                      },
                    },
                  ],
                  correct: 0,
                  exp1FromPrevious: true,
                  implies1: true,
                  implies2: true,
                },
                {
                  q: "Sekarang hitung 24 × 12.",
                  qWrong: "Salah! Coba lagi.",
                  qCorrect: "Benar! Jumlah tingginya = 288 cm.",
                  options: [
                    { lhs: "Jumlah", rhs: "280" },
                    { lhs: "Jumlah", rhs: "228" },
                    { lhs: "Jumlah", rhs: "288" },
                  ],
                  correct: 2,
                  exp1FromPrevious: true,
                  implies1: true,
                  implies2: true,
                },
              ],
              visual: PLANT_VISUAL_EN,
            },
          },
        },
        {
          steps: {
            1: {
              questionText:
                "Twist lagi — kali ini banyaknya benda belum diketahui.",
              navText:
                "Ketuk » untuk mengenali data yang 'diketahui' dan 'ditanya'.",
              statement:
                "Sekelompok tas mempunyai<br>jumlah berat 360 kg.<br>Berat rata-rata per tas 12 kg.<br>Berapa banyak tasnya?",
            },
            2: {
              keysOrder: ["total", "mean", "bags"],
              givenHighlightsAnyOrder: true,
              revealHintUntilPriorDone: true,
              questionText: "Apa yang diberitahukan soal kepadamu?",
              questionText2: "Apa lagi yang diberitahukan soal?",
              questionText3: "Apa yang ditanyakan soal?",
              questionTextComplete:
                "Kita sudah menemukan semua data yang diketahui dan yang ditanya.",
              questionTextWrong:
                "Salah! Coba lagi. Apa yang diberitahukan soal kepadamu?",
              navText: "Ketuk data yang diketahui dari soal.",
              navTextToFind: "Ketuk data yang ditanya",
              navTextDone: "Ketuk » untuk menyelesaikan soal sekarang.",
              statementTemplate:
                "Sekelompok tas mempunyai<br><span class='qs-highlight highlight-given' data-key='total'>jumlah berat 360 kg</span>.<br><span class='qs-highlight highlight-given' data-key='mean'>Berat rata-rata per tas 12 kg</span>.<br><span class='qs-highlight highlight-find' data-key='bags'>Berapa banyak tasnya?</span>",
              givenTotal: "Jumlah = 360 kg",
              givenMean: "Rata-rata = 12 kg",
              toFindN: "n = ?",
              revealHint: "Ketuk informasi yang diketahui untuk menampilkannya",
              visual: BAGS_VISUAL_Q3_EN,
            },
            3: {
              questionText:
                "Persamaan manakah yang menempatkan setiap nilai dengan benar?",
              navText: "Ketuk persamaan yang benar.",
              navTextDone: "Ketuk » untuk melanjutkan ke tantangan berikutnya.",
              questionTextDone: "Bagus! Ada 30 tas dalam kelompok itu.",
              answerSlot: "n",
              finalAnswer: "30",
              phases: [
                {
                  q: "Persamaan manakah yang menempatkan setiap nilai dengan benar?",
                  qWrong: "Salah! Coba lagi.",
                  options: [
                    {
                      lhs: "12",
                      rhsFraction: {
                        numerator: "360",
                        denominator: "n",
                      },
                    },
                    {
                      lhs: "12",
                      rhsFraction: {
                        numerator: "n",
                        denominator: "360",
                      },
                    },
                    {
                      lhs: "n",
                      rhsFraction: {
                        numerator: "12",
                        denominator: "360",
                      },
                    },
                  ],
                  correct: 0,
                  exp1: {
                    type: "mean_formula",
                    left: "Rata-rata =",
                    numerator: "Jumlah semua nilai",
                    denominator: "Banyaknya nilai data",
                  },
                  implies1: false,
                  implies2: true,
                },
                {
                  q: "Untuk mendapatkan n saja, batalkan pembagian.",
                  qWrong: "Salah! Coba lagi.",
                  options: [
                    {
                      lhs: "n",
                      rhsFraction: {
                        numerator: "360",
                        denominator: "12",
                      },
                    },
                    { lhs: "n", rhs: "360 × 12" },
                    { lhs: "n", rhs: "360 − 12" },
                  ],
                  correct: 0,
                  exp1FromPrevious: true,
                  implies1: true,
                  implies2: true,
                },
                {
                  q: "Sekarang hitung 360 ÷ 12.",
                  qWrong: "Salah! Coba lagi.",
                  qCorrect: "Benar! n = 30.",
                  options: [
                    { lhs: "n", rhs: "3" },
                    { lhs: "n", rhs: "30" },
                    { lhs: "n", rhs: "300" },
                  ],
                  correct: 1,
                  exp1FromPrevious: true,
                  implies1: true,
                  implies2: true,
                },
              ],
              visual: BAGS_VISUAL_Q3_EN,
            },
          },
        },
        {
          steps: {
            1: {
              questionText:
                "Sekarang pola yang paling sulit — satu nilai data belum diketahui.",
              navText:
                "Ketuk » untuk mengenali data yang 'diketahui' dan 'ditanya'.",
              statement:
                "Lima teman mencatat<br>banyak buku yang mereka baca:  4,  6,  x,  5,  5.<br>Rata-ratanya 6 buku.<br>Tentukan nilai yang hilang, x.",
            },
            2: {
              keysOrder: ["students", "dataset", "mean", "missing"],
              givenHighlightsAnyOrder: true,
              revealHintUntilPriorDone: true,
              questionText: "Apa yang diberitahukan soal kepadamu?",
              questionText2: "Apa lagi yang diberitahukan soal?",
              questionText3: "Apa lagi yang diberitahukan soal?",
              questionText4: "Apa yang ditanyakan soal?",
              questionTextComplete:
                "Kita sudah menemukan semua data yang diketahui dan yang ditanya.",
              questionTextWrong:
                "Salah! Coba lagi. Apa yang diberitahukan soal kepadamu?",
              navText: "Ketuk data yang diketahui dari soal.",
              navTextToFind: "Ketuk data yang ditanya",
              navTextDone: "Ketuk » untuk menyelesaikan soal sekarang.",
              statementTemplate:
                "<span class='qs-highlight highlight-given' data-key='students'>Lima teman</span> mencatat<br>banyak buku yang mereka baca: <span class='qs-highlight highlight-given' data-key='dataset'> 4,  6,  x,  5,  5.</span><br><span class='qs-highlight highlight-given' data-key='mean'>Rata-ratanya 6</span> buku.<br><span class='qs-highlight highlight-find' data-key='missing'>Tentukan nilai yang hilang, x</span>.",
              givenN: "n = 5",
              givenValues: "Nilai = 4, 6, x, 5, 5",
              givenMean: "Rata-rata = 6",
              toFindX: "x = ?",
              revealHint: "Ketuk informasi yang diketahui untuk menampilkannya",
              visual: MISSING_VALUE_VISUAL_Q4_EN,
            },
            3: {
              questionText: "Masukkan setiap nilai ke tempatnya dalam rumus.",
              navText: "Ketuk persamaan yang benar.",
              navTextDone: "Ketuk » untuk menyelesaikan.",
              questionTextDone: "Bagus! Nilai yang hilang adalah x = 10.",
              answerSlot: "xSlot",
              finalAnswer: "10",
              phases: [
                {
                  q: "Masukkan setiap nilai ke tempatnya dalam rumus.",
                  qWrong: "Salah! Coba lagi.",
                  options: [
                    {
                      lhs: "6",
                      rhsFraction: {
                        numerator: "4 + 6 + x + 5 + 5",
                        denominator: "5",
                      },
                    },
                    {
                      lhs: "5",
                      rhsFraction: {
                        numerator: "4 + 6 + x + 5 + 5",
                        denominator: "6",
                      },
                    },
                    {
                      lhs: "6",
                      rhs: "(4 + 6 + x + 5 + 5) × 5",
                    },
                  ],
                  correct: 0,
                  exp1: {
                    type: "html",
                    useTermsFormula: true,
                  },
                  implies1: false,
                  implies2: true,
                },
                {
                  q: "Kalikan kedua ruas dengan 5 untuk menghilangkan penyebut.",
                  qWrong: "Salah! Coba lagi.",
                  options: [
                    { lhs: "11", rhs: "4 + 6 + x + 5 + 5" },
                    { lhs: "30", rhs: "4 + 6 + x + 5 + 5" },
                    { lhs: "6", rhs: "4 + 6 + x + 5 + 5 − 5" },
                  ],
                  correct: 1,
                  exp1FromPrevious: true,
                  implies1: true,
                  implies2: true,
                },
                {
                  q: "Jumlahkan nilai yang sudah diketahui di ruas kanan.",
                  qWrong: "Salah! Coba lagi.",
                  options: [
                    { lhs: "30", rhs: "20 + x" },
                    { lhs: "30", rhs: "10 + x" },
                    { lhs: "30", rhs: "4 + 6 + 5 + 5 + x" },
                  ],
                  correct: 0,
                  exp1FromPrevious: true,
                  implies1: true,
                  implies2: true,
                },
                {
                  q: "Kurangi 20 dari kedua ruas agar x berdiri sendiri.",
                  qWrong: "Salah! Coba lagi.",
                  qCorrect: "Benar! x = 10.",
                  options: [
                    { lhs: "x", rhs: "50" },
                    { lhs: "x", rhs: "30" },
                    { lhs: "x", rhs: "10" },
                  ],
                  correct: 2,
                  exp1FromPrevious: true,
                  implies1: true,
                  implies2: true,
                },
              ],
              visual: MISSING_VALUE_VISUAL_Q4_EN,
            },
          },
        },
      ],
    },
  },
};

const APP_DATA = DATA[current_language].app;
