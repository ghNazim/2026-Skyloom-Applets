const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

// Question 1: Triangle – perimeter 89, third side 20 cm, b = 2a, find a and b
const DATA1 = {
  en: {
    app: {
      start_over: "»",
      givenLabel: "Given:",
      findingsLabel: "Findings:",
      toFindLabel: "To Find:",
      altQuestionFigure: "Question figure",
      altComputeImage: "Figure",
      altVisual: "Visual representation",
      altSplash: "Summary visual",

      questionText: "In the given triangle, the length of side b is twice the length of side a. If the perimeter of the triangle is 89 cm and the third side measures 20 cm, find the lengths of sides a and b.",
      questionImage: "assets/question1.svg",

      findingDivInstances: [
        {
          givenList: ["Third side = 20 cm", "Perimeter = 89 cm", "b is twice the length of side a."]
        },
        {
          givenList: ["Third side = 20 cm", "Perimeter = 89 cm", "b = 2a"],
          findingsList: ["Perimeter = sum of all its side lengths"]
        },
        {
          givenList: ["Third side = 20 cm", "Perimeter = 89 cm", "b = 2a"],
          findingsList: ["a = 23"]
        },
        {
          givenList: ["<y>b = 2a</y>"],
          findingsList: ["a = 23"]
        },
        {
          givenList: ["b = 2a"],
          findingsList: ["a = 23", "b = 46"]
        }
      ],

      comprehend: {
        sectionTitle: "INFORMATION ANALYSIS",
        images: [
          "assets/q1compre1.svg",
          "assets/q1compre2.svg",
          "assets/q1compre3.svg",
          "assets/q1compre4.svg",
        ],
        given: {
          title: "Given,",
          data: [
            "Perimeter = 89 cm",
            "b is twice the length of side a.",
            "Third side = 20 cm",
          ],
          highlights: [
            "the perimeter of the triangle is 89 cm",
            "the length of side b is twice the length of side a",
            "the third side measures 20 cm"
          ]
        },
        toFind: {
          title: "To Find",
          data: ["Lengths of sides a and b."],
          highlights: ["lengths of sides a and b"]
        },
      },

      splash: {
        step2: {
          image: "assets/q1compre4.svg",
          text: "<blue>✓ Information gathered from the figure.</blue><br><yellow>Next - Find the lengths of sides a and b.</yellow>"
        }
      },

      mcqs: [
        {
          title: "Which statement correctly represents the relationship between a and b?",
          options: [
            "a = 2b",
            "b = a + 2",
            "b = 2a",
            "a = b + 2"
          ],
          answerIndex: 2,
          formulaRow: "Perimeter = sum of all its side lengths"
        }
      ],

      // Step 4: blank calculation rows (no interaction)
      blankCalcRows: [
        "Perimeter = sum of all its side lengths",
        "Perimeter = a + b + 20"
      ],

      // Step 5: drag and drop
      dragDrop1: {
        equationLabel: "Perimeter = sum of all its side lengths",
        equationLineSegments: ["", " = a + ", " + 20"],
        dropZones: [
          { id: "dz1", placeholder: "Perimeter", correctAnswer: "89" },
          { id: "dz2", placeholder: "b", correctAnswer: "2a" }
        ],
        draggables: [
          { id: "d1", text: "2a" },
          { id: "d2", text: "2b" },
          { id: "d3", text: "2c" },
          { id: "d4", text: "20" },
          { id: "d5", text: "89" }
        ]
      },

      // Step 6: find side length a
      calcStep6: {
        initialRows: [
          "Perimeter = sum of all its side lengths",
          "89 = a + 2a + 20"
        ],
        calcRows: [
          { text: "89 = 3a + 20" },
          { text: "3a = 89 - 20" },
          { text: "3a = [box]", answers: ["69"] },
          { text: "a = 69 ÷ 3 = [box] cm", answers: ["23"] }
        ]
      },

      // Step 7: find side length b
      calcStep7: {
        initialRows: [
          "<y>From the given, we know that,</y>",
        ],
        calcRows: [
          { text: "b is twice the length of side a." },
          { text: "⇒ b = 2a" },
          { text: "⇒ b = 2 × 23 = [box] cm", answers: ["46"] }
        ]
      },

      finalAnswer: "So, side length a = 23 cm and side length b = 46 cm.",

      steps: {
        0: {
          questionText: "Read the question and identify 'given' and 'to find'",
          navText: "Tap » to identify 'given' information.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        1: {
          questionText: "Read the question and identify 'given' and 'to find'",
          navText: "Tap » to identify the 'given' information.",          
          navToFind: "Tap » to identify what do we need 'to find'.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/question1.svg",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false,
          statementInVisual: "In the given triangle, the length of side b is twice the length of side a. If the perimeter of the triangle is 89 cm and the third side measures 20 cm, find the lengths of sides a and b."
        },
        2: {
          questionText: "",
          navText: "Tap » to continue.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true
        },
        3: {
          questionText: "Let's define the perimeter.",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q1connect1.svg",
          imageAnswered: "assets/q1connect1ans.svg",
          isCalculation: true,
          isMcqStep: true,
          mcqStartIndex: 0,
          mcqEndIndex: 1,
          nextEnabled: false,
          findingDivInstanceIndex: 0
        },
        4: {
          questionText: "Let's write a mathematical sentence for the perimeter.",
          navText: "Tap » to continue.",
          isCalculation: true,
          isBlankCalcStep: true,
          nextEnabled: true,
          image: "assets/q1compute1.svg",
          findingDivInstanceIndex: 0
        },
        5: {
          questionText: "Let's substitute the values for the perimeter and 'b'.",
          navText: "Drag and drop the correct values into the equation.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q1compute1.svg",
          isDragDropStep: true,
          dragDropKey: "dragDrop1",
          nextEnabled: false,
          findingDivInstanceIndex: 1
        },
        6: {
          questionText: "Let's find the side length a.",
          navText: "Use the numpad to fill the box and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q1compute1.svg",
          isCalculation: true,
          isCalcStep: true,
          calcStepKey: 6,
          nextEnabled: false,
          findingDivInstanceIndex: 1
        },
        7: {
          questionText: "Let's find the side length b.",
          navText: "Use the numpad to fill the box and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q1compute2.svg",
          isCalculation: true,
          isCalcStep: true,
          calcStepKey: 7,
          nextEnabled: false,
          findingDivInstanceIndex: 3
        },
        8: {
          questionText: "Let's state the final answer.",
          navText: "Tap » for the next question.",
          image: "assets/q1computeAns.svg",
          isFinalStep: true,
          nextEnabled: true,
          findingDivInstanceIndex: 4
        }
      },
      labels: {
        given: "Given",
        toFind: "To Find",
        findings: "Findings"
      },
    },
  },
  id: {
    app: {
      start_over: "»",
      givenLabel: "Diberikan:",
      findingsLabel: "Temuan:",
      toFindLabel: "Yang ditanyakan:",
      altQuestionFigure: "Gambar soal",
      altComputeImage: "Gambar",
      altVisual: "Representasi visual",
      altSplash: "Ringkasan visual",

      questionText: "Pada segitiga yang diberikan, panjang sisi b adalah dua kali panjang sisi a. Jika keliling segitiga 89 cm dan sisi ketiga 20 cm, tentukan panjang sisi a dan b.",
      questionImage: "assets/question1.svg",

      findingDivInstances: [
        { givenList: ["Sisi ketiga = 20 cm", "Keliling = 89 cm", "b dua kali panjang sisi a."] },
        { givenList: ["Sisi ketiga = 20 cm", "Keliling = 89 cm", "b = 2a"], findingsList: ["Keliling = jumlah panjang semua sisinya"] },
        { givenList: ["Sisi ketiga = 20 cm", "Keliling = 89 cm", "b = 2a"], findingsList: ["a = 23"] },
        { givenList: ["<y>b = 2a</y>"], findingsList: ["a = 23"] },
        { givenList: ["b = 2a"], findingsList: ["a = 23", "b = 46"] }
      ],

      comprehend: {
        sectionTitle: "ANALISIS INFORMASI",
        images: ["assets/q1compre1.svg", "assets/q1compre2.svg", "assets/q1compre3.svg", "assets/q1compre4.svg"],
        given: {
          title: "Diberikan,",
          data: ["Keliling = 89 cm", "b dua kali panjang sisi a.", "Sisi ketiga = 20 cm"],
          highlights: ["keliling segitiga 89 cm", "panjang sisi b dua kali panjang sisi a", "sisi ketiga 20 cm"]
        },
        toFind: {
          title: "Yang ditanyakan",
          data: ["Panjang sisi a dan b."],
          highlights: ["panjang sisi a dan b"]
        },
      },

      splash: {
        step2: {
          image: "assets/q1compre4.svg",
          text: "<blue>✓ Informasi dikumpulkan dari gambar.</blue><br><yellow>Lanjut - Tentukan panjang sisi a dan b.</yellow>"
        }
      },

      mcqs: [
        {
          title: "Pernyataan mana yang benar menyatakan hubungan antara a dan b?",
          options: ["a = 2b", "b = a + 2", "b = 2a", "a = b + 2"],
          answerIndex: 2,
          formulaRow: "Keliling = jumlah panjang semua sisinya"
        }
      ],

      blankCalcRows: [
        "Keliling = jumlah panjang semua sisinya",
        "Keliling = a + b + 20"
      ],

      dragDrop1: {
        equationLabel: "Keliling = jumlah panjang semua sisinya",
        equationLineSegments: ["", " = a + ", " + 20"],
        dropZones: [
          { id: "dz1", placeholder: "Keliling", correctAnswer: "89" },
          { id: "dz2", placeholder: "b", correctAnswer: "2a" }
        ],
        draggables: [
          { id: "d1", text: "2a" }, { id: "d2", text: "2b" }, { id: "d3", text: "2c" }, { id: "d4", text: "20" }, { id: "d5", text: "89" }
        ]
      },

      calcStep6: {
        initialRows: ["Keliling = jumlah panjang semua sisinya", "89 = a + 2a + 20"],
        calcRows: [
          { text: "89 = 3a + 20" },
          { text: "3a = 89 - 20" },
          { text: "3a = [box]", answers: ["69"] },
          { text: "a = 69 ÷ 3 = [box] cm", answers: ["23"] }
        ]
      },

      calcStep7: {
        initialRows: ["<y>Dari yang diberikan, kita tahu bahwa,</y>"],
        calcRows: [
          { text: "b dua kali panjang sisi a." },
          { text: "⇒ b = 2a" },
          { text: "⇒ b = 2 × 23 = [box] cm", answers: ["46"] }
        ]
      },

      finalAnswer: "Jadi, panjang sisi a = 23 cm dan panjang sisi b = 46 cm.",

      steps: {
        0: { questionText: "Baca soal dan identifikasi 'diberikan' dan 'yang ditanyakan'", navText: "Ketuk » untuk mengidentifikasi informasi 'diberikan'.", isComprehendQuestion: true, nextEnabled: true, hideVisualPanel: true },
        1: { questionText: "Baca soal dan identifikasi 'diberikan' dan 'yang ditanyakan'", navText: "Ketuk » untuk mengidentifikasi informasi 'diberikan'.", navToFind: "Ketuk » untuk mengidentifikasi 'yang ditanyakan'.", navTextCorrect: "Ketuk » untuk lanjut.", image: "assets/question1.svg", isComprehend: true, isSubstepComprehend: true, nextEnabled: false, statementInVisual: "Pada segitiga yang diberikan, panjang sisi b adalah dua kali panjang sisi a. Jika keliling segitiga 89 cm dan sisi ketiga 20 cm, tentukan panjang sisi a dan b." },
        2: { questionText: "", navText: "Ketuk » untuk lanjut.", isSplash: true, splashKey: "step2", nextEnabled: true },
        3: { questionText: "Mari kita definisikan keliling.", navText: "Ketuk jawaban yang benar.", navTextCorrect: "Ketuk » untuk lanjut.", image: "assets/q1connect1.svg", imageAnswered: "assets/q1connect1ans.svg", isCalculation: true, isMcqStep: true, mcqStartIndex: 0, mcqEndIndex: 1, nextEnabled: false, findingDivInstanceIndex: 0 },
        4: { questionText: "Mari kita tulis kalimat matematika untuk keliling.", navText: "Ketuk » untuk lanjut.", isCalculation: true, isBlankCalcStep: true, nextEnabled: true, image: "assets/q1compute1.svg", findingDivInstanceIndex: 0 },
        5: { questionText: "Mari kita substitusi nilai untuk keliling dan 'b'.", navText: "Seret dan lepas nilai yang benar ke persamaan.", navTextCorrect: "Ketuk » untuk lanjut.", image: "assets/q1compute1.svg", isDragDropStep: true, dragDropKey: "dragDrop1", nextEnabled: false, findingDivInstanceIndex: 1 },
        6: { questionText: "Mari kita cari panjang sisi a.", navText: "Gunakan numpad untuk mengisi kotak dan ketuk ✓ untuk memeriksa.", navTextCorrect: "Ketuk » untuk lanjut.", image: "assets/q1compute1.svg", isCalculation: true, isCalcStep: true, calcStepKey: 6, nextEnabled: false, findingDivInstanceIndex: 1 },
        7: { questionText: "Mari kita cari panjang sisi b.", navText: "Gunakan numpad untuk mengisi kotak dan ketuk ✓ untuk memeriksa.", navTextCorrect: "Ketuk » untuk lanjut.", image: "assets/q1compute2.svg", isCalculation: true, isCalcStep: true, calcStepKey: 7, nextEnabled: false, findingDivInstanceIndex: 3 },
        8: { questionText: "Mari kita nyatakan jawaban akhir.", navText: "Ketuk » untuk soal berikutnya.", image: "assets/q1computeAns.svg", isFinalStep: true, nextEnabled: true, findingDivInstanceIndex: 4 }
      },
      labels: { given: "Diberikan", toFind: "Yang ditanyakan", findings: "Temuan" },
    },
  },
};

// Question 2: Farrel runs around equilateral triangle park – total 3000 m in 5 laps, find side length
const DATA2 = {
  en: {
    app: {
      start_over: "Restart",
      givenLabel: "Given:",
      findingsLabel: "Findings:",
      toFindLabel: "To Find:",
      altQuestionFigure: "Question figure",
      altComputeImage: "Figure",
      altVisual: "Visual representation",
      altSplash: "Summary visual",

      questionText: "Farrel runs around a park that is shaped like an equilateral triangle. He runs 5 laps around the park. If Farrel has run a total distance of 3,000 meters, determine the length of one side of the park.",
      questionImage: "assets/question2.svg",

      findingDivInstances: [
        {
          givenList: [
            "The park is shaped like an equilateral triangle.",
            "Farrel ran 5 laps.",
            "Total distance run = 3,000 m"
          ]
        },
        {
          givenList: [
            "The park is shaped like an equilateral triangle.",
            "Farrel ran 5 laps.",
            "Total distance run = 3,000 m"
          ],
          findingsList: ["1 lap = perimeter of equilateral triangle"]
        },
        {
          findingsList: ["The perimeter of the triangle = 600 m"]
        }
      ],

      comprehend: {
        sectionTitle: "INFORMATION ANALYSIS",
        images: [
          "assets/q2compre1.svg",
          "assets/q2compre2.svg",
          "assets/q2compre3.svg",
          "assets/q2compre4.svg",
        ],
        given: {
          title: "Given,",
          data: [
            "The park is shaped like an equilateral triangle.",
            "Farrel ran 5 laps.",
            "Total distance run = 3,000 m",
          ],
          highlights: [
            "shaped like an equilateral triangle",
            "5 laps",
            "total distance of 3,000 meters"
          ]
        },
        toFind: {
          title: "To Find",
          data: ["Length of one side of the park."],
          highlights: ["length of one side of the park"]
        },
      },

      splash: {
        step2: {
          image: "assets/q2compre4.svg",
          text: "<blue>✓ Information gathered from the figure.</blue><br><yellow>Next - Determine the length of one side of the park.</yellow>"
        }
      },

      mcqs: [
        {
          title: "Farrel is running around a park shaped like an equilateral triangle. What does one lap represent?",
          options: [
            "The length of one side of the triangle",
            "The height of the triangle",
            "The area of the triangle",
            "The perimeter of the triangle"
          ],
          answerIndex: 3,
          formulaRow: null
        },
        {
          title: "Farrel ran a total distance of 3000 m in 5 laps. How much does he cover in one lap?",
          options: [
            "Distance in 1 lap = Total distance × 5",
            "Distance in 1 lap = Total distance + 5",
            "Distance in 1 lap = Total distance ÷ 5",
            "Distance in 1 lap = 5 ÷ Total distance"
          ],
          answerIndex: 2,
          formulaRow: "Distance in 1 lap = Total distance ÷ 5"
        },
        {
          title: "Which formula gives the perimeter of an equilateral triangle using side lengths?",
          options: [
            "Side length × 3",
            "Side ÷ 3",
            "Side length + 3"
          ],
          answerIndex: 0,
          formulaRow: "Perimeter = Side length of the equilateral triangle × 3"
        }
      ],

      calcStep4: {
        initialRows: ["Distance in 1 lap = Total distance ÷ 5"],
        calcRows: [
          { text: "Distance in 1 lap = [box] ÷ 5", answers: ["3000"] },
          { text: "Distance in 1 lap = [box] m", answers: ["600"] },
          { text: "So, perimeter of equilateral triangle = 600 m" }
        ]
      },

      calcStep6: {
        initialRows: ["Perimeter = Side length of the equilateral triangle × 3"],
        calcRows: [
          { text: "Side length of the equilateral triangle = Perimeter ÷ 3" },
          { text: "Side length of the equilateral triangle = [box] ÷ 3", answers: ["600"] },
          { text: "Side length of the equilateral triangle = [box] m", answers: ["200"] }
        ]
      },

      finalAnswer: "The length of each side of the park is 200 meters.",

      steps: {
        0: {
          questionText: "Read the question and identify 'given' and 'to find'",
          navText: "Tap » to identify 'given' information.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        1: {
          questionText: "Read the question and identify 'given' and 'to find'",
          navText: "Tap » to identify the 'given' information.",
          navToFind: "Tap » to identify what we need 'to find'.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q2compre0.svg",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false,
          statementInVisual: "Farrel runs around a park that is shaped like an equilateral triangle. He runs 5 laps around the park. If Farrel has run a total distance of 3,000 meters, determine the length of one side of the park."
        },
        2: {
          questionText: "",
          navText: "Tap » to continue.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true
        },
        3: {
          questionText: "Let's understand what one lap represents.",
          questionTextPerMcq: ["Let's understand what one lap represents.", "Let's find the distance covered in 1 lap."],
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q2compute1.svg",
          isCalculation: true,
          isMcqStep: true,
          mcqStartIndex: 0,
          mcqEndIndex: 2,
          nextEnabled: false,
          findingDivInstanceIndex: 0,
          findingDivInstanceIndexPerMcq: [0, 1]
        },
        4: {
          questionText: "Let's find the distance covered in 1 lap.",
          navText: "Use the numpad to fill the box and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q2compute1.svg",
          isCalculation: true,
          isCalcStep: true,
          calcStepKey: 4,
          nextEnabled: false,
          findingDivInstanceIndex: 1
        },
        5: {
          questionText: "Let's see if we can break down perimeter into lengths of sides.",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q2compute1.svg",
          isCalculation: true,
          isMcqStep: true,
          mcqStartIndex: 2,
          mcqEndIndex: 3,
          nextEnabled: false,
          findingDivInstanceIndex: 2
        },
        6: {
          questionText: "Let's find the side length of the park.",
          navText: "Use the numpad to fill the box and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q2compute2.svg",
          isCalculation: true,
          isCalcStep: true,
          calcStepKey: 6,
          nextEnabled: false,
          findingDivInstanceIndex: 2
        },
        7: {
          questionText: "Let's state the final answer.",
          navText: "Tap 'Restart' to start over.",
          image: "assets/q2computeAns.svg",
          isFinalStep: true,
          nextEnabled: true,
          findingDivInstanceIndex: 2
        }
      },
      labels: {
        given: "Given",
        toFind: "To Find",
        findings: "Findings"
      },
    },
  },
  id: {
    app: {
      start_over: "Mulai ulang",
      givenLabel: "Diberikan:",
      findingsLabel: "Temuan:",
      toFindLabel: "Yang ditanyakan:",
      altQuestionFigure: "Gambar soal",
      altComputeImage: "Gambar",
      altVisual: "Representasi visual",
      altSplash: "Ringkasan visual",

      questionText: "Farrel berlari mengelilingi taman berbentuk segitiga sama sisi. Ia berlari 5 putaran. Jika total jarak yang ditempuh 3.000 meter, tentukan panjang satu sisi taman.",
      questionImage: "assets/question2.svg",

      findingDivInstances: [
        { givenList: ["Taman berbentuk segitiga sama sisi.", "Farrel berlari 5 putaran.", "Total jarak = 3.000 m"] },
        { givenList: ["Taman berbentuk segitiga sama sisi.", "Farrel berlari 5 putaran.", "Total jarak = 3.000 m"], findingsList: ["1 putaran = keliling segitiga sama sisi"] },
        { findingsList: ["Keliling segitiga = 600 m"] }
      ],

      comprehend: {
        sectionTitle: "ANALISIS INFORMASI",
        images: ["assets/q2compre1.svg", "assets/q2compre2.svg", "assets/q2compre3.svg", "assets/q2compre4.svg"],
        given: {
          title: "Diberikan,",
          data: ["Taman berbentuk segitiga sama sisi.", "Farrel berlari 5 putaran.", "Total jarak = 3.000 m"],
          highlights: ["berbentuk segitiga sama sisi", "5 putaran", "total jarak 3.000 meter"]
        },
        toFind: {
          title: "Yang ditanyakan",
          data: ["Panjang satu sisi taman."],
          highlights: ["panjang satu sisi taman"]
        },
      },

      splash: {
        step2: {
          image: "assets/q2compre4.svg",
          text: "<blue>✓ Informasi dikumpulkan dari gambar.</blue><br><yellow>Lanjut - Tentukan panjang satu sisi taman.</yellow>"
        }
      },

      mcqs: [
        { title: "Farrel berlari mengelilingi taman berbentuk segitiga sama sisi. Satu putaran mewakili apa?", options: ["Panjang satu sisi segitiga", "Tinggi segitiga", "Luas segitiga", "Keliling segitiga"], answerIndex: 3, formulaRow: null },
        { title: "Farrel berlari total 3000 m dalam 5 putaran. Berapa jarak dalam 1 putaran?", options: ["Jarak 1 putaran = Total jarak × 5", "Jarak 1 putaran = Total jarak + 5", "Jarak 1 putaran = Total jarak ÷ 5", "Jarak 1 putaran = 5 ÷ Total jarak"], answerIndex: 2, formulaRow: "Jarak 1 putaran = Total jarak ÷ 5" },
        { title: "Rumus mana yang memberi keliling segitiga sama sisi dari panjang sisi?", options: ["Panjang sisi × 3", "Sisi ÷ 3", "Panjang sisi + 3"], answerIndex: 0, formulaRow: "Keliling = Panjang sisi segitiga sama sisi × 3" }
      ],

      calcStep4: {
        initialRows: ["Jarak 1 putaran = Total jarak ÷ 5"],
        calcRows: [
          { text: "Jarak 1 putaran = [box] ÷ 5", answers: ["3000"] },
          { text: "Jarak 1 putaran = [box] m", answers: ["600"] },
          { text: "Jadi, keliling segitiga sama sisi = 600 m" }
        ]
      },

      calcStep6: {
        initialRows: ["Keliling = Panjang sisi segitiga sama sisi × 3"],
        calcRows: [
          { text: "Panjang sisi segitiga sama sisi = Keliling ÷ 3" },
          { text: "Panjang sisi segitiga sama sisi = [box] ÷ 3", answers: ["600"] },
          { text: "Panjang sisi segitiga sama sisi = [box] m", answers: ["200"] }
        ]
      },

      finalAnswer: "Panjang setiap sisi taman adalah 200 meter.",

      steps: {
        0: { questionText: "Baca soal dan identifikasi 'diberikan' dan 'yang ditanyakan'", navText: "Ketuk » untuk mengidentifikasi informasi 'diberikan'.", isComprehendQuestion: true, nextEnabled: true, hideVisualPanel: true },
        1: { questionText: "Baca soal dan identifikasi 'diberikan' dan 'yang ditanyakan'", navText: "Ketuk » untuk mengidentifikasi informasi 'diberikan'.", navToFind: "Ketuk » untuk mengidentifikasi 'yang ditanyakan'.", navTextCorrect: "Ketuk » untuk lanjut.", image: "assets/q2compre0.svg", isComprehend: true, isSubstepComprehend: true, nextEnabled: false, statementInVisual: "Farrel berlari mengelilingi taman berbentuk segitiga sama sisi. Ia berlari 5 putaran. Jika total jarak 3.000 meter, tentukan panjang satu sisi taman." },
        2: { questionText: "", navText: "Ketuk » untuk lanjut.", isSplash: true, splashKey: "step2", nextEnabled: true },
        3: { questionText: "Mari kita pahami apa yang diwakili satu putaran.", questionTextPerMcq: ["Mari kita pahami apa yang diwakili satu putaran.", "Mari kita cari jarak dalam 1 putaran."], navText: "Ketuk jawaban yang benar.", navTextCorrect: "Ketuk » untuk lanjut.", image: "assets/q2compute1.svg", isCalculation: true, isMcqStep: true, mcqStartIndex: 0, mcqEndIndex: 2, nextEnabled: false, findingDivInstanceIndex: 0, findingDivInstanceIndexPerMcq: [0, 1] },
        4: { questionText: "Mari kita cari jarak dalam 1 putaran.", navText: "Gunakan numpad untuk mengisi kotak dan ketuk ✓ untuk memeriksa.", navTextCorrect: "Ketuk » untuk lanjut.", image: "assets/q2compute1.svg", isCalculation: true, isCalcStep: true, calcStepKey: 4, nextEnabled: false, findingDivInstanceIndex: 1 },
        5: { questionText: "Mari kita lihat apakah keliling bisa dipecah menjadi panjang sisi.", navText: "Ketuk jawaban yang benar.", navTextCorrect: "Ketuk » untuk lanjut.", image: "assets/q2compute1.svg", isCalculation: true, isMcqStep: true, mcqStartIndex: 2, mcqEndIndex: 3, nextEnabled: false, findingDivInstanceIndex: 2 },
        6: { questionText: "Mari kita cari panjang sisi taman.", navText: "Gunakan numpad untuk mengisi kotak dan ketuk ✓ untuk memeriksa.", navTextCorrect: "Ketuk » untuk lanjut.", image: "assets/q2compute2.svg", isCalculation: true, isCalcStep: true, calcStepKey: 6, nextEnabled: false, findingDivInstanceIndex: 2 },
        7: { questionText: "Mari kita nyatakan jawaban akhir.", navText: "Ketuk 'Mulai ulang' untuk mulai dari awal.", image: "assets/q2computeAns.svg", isFinalStep: true, nextEnabled: true, findingDivInstanceIndex: 2 }
      },
      labels: { given: "Diberikan", toFind: "Yang ditanyakan", findings: "Temuan" },
    },
  },
};



const questions = [DATA1, DATA2];

// Current question data: APP_DATA = questions[question_idx][current_language].app
// Set by App.js based on question_idx; fallback for components that read before mount
const APP_DATA = questions[0][current_language].app;
const decimalSymbol = decimal[current_language];
