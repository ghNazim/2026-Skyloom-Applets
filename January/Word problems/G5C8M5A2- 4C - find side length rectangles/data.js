
const decimal = {
  en: ".",
  id: ",",
};

// Question 1: Rectangle – perimeter 120 cm, AB = 45 cm, find AD
const DATA1 = {
  en: {
    app: {
      start_over: "Restart",

      questionText: "The perimeter of the rectangle is 120 cm. \nIf AB = 45 cm, find the length of AD.",
      questionImage: "assets/question1.svg",

      comprehend: {
        sectionTitle: "INFORMATION ANALYSIS",
        images: [
          "assets/q1compre1.svg",
          "assets/q1compre2.svg",
          "assets/q1compre3.svg",
        ],
        given: {
          title: "Given,",
          data: [
            "The perimeter of the rectangle = 120 cm.",
            "Length = AB = 45 cm.",
          ],
          highlights: ["perimeter of the rectangle is 120 cm", "AB = 45 cm"]
        },
        toFind: {
          title: "To Find",
          data: ["Length of AD"],
          highlights: ["length of AD"]
        },
      },

      splash: {
        step2: {
          image: "assets/q1compre3.svg",
          text: "<blue>✓ Information gathered from the figure.</blue><br><yellow>Next - Find the length of AD.</yellow>"
        }
      },

      findingsFormat: {
        title: "",
        givenLabel: "Given:",
        givenList: [
          "The perimeter of the rectangle = 120 cm.",
          "Length = AB = 45 cm."
        ],
        toFindLabel: "To Find:",
        toFindList: ["Length of AD"]
      },

      mcqs: [
        {
          title: "What is the formula for the perimeter of a rectangle?",
          options: [
            "length + breadth",
            "2 × length + breadth",
            "2 × (length + breadth)",
            "length × breadth"
          ],
          answerIndex: 2,
          formulaRow: "Perimeter of Rectangle = 2 × (length + breadth)"
        }
      ],

      calcRows: [
        { text: "[box] = 2 × ([box] + AD)", answers: ["120", "45"] },
        { text: "2 × (45 + AD) = 120" },
        { text: "(45 + AD) = 120 ÷ 2" },
        { text: "(45 + AD) = [box]", answers: ["60"] },
        { text: "AD = 60 – 45" },
        { text: "AD = [box] cm", answers: ["15"] }
      ],
      questionTextsWithCalcRows:["Let’s substitute the values for perimeter and length.","Let’s rewrite the math sentence.","Let’s simplify the math sentence.","Let’s simplify the math sentence.","Let’s rewrite the math sentence.","Let’s find the side length AD."],

      finalAnswer: "So, the length of AD = 15 cm",

      steps: {
        0: {
          questionText: "Read the question and identify 'given' and 'to find'.",
          navText: "Tap » to identify 'given' information.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        1: {
          questionText: "Read the question and identify 'given' and 'to find'.",
          navText: "Tap » to identify the 'given' information.",
          navToFind: "Tap » to identify what do we need 'to find'.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q1compre0.svg",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false,
          statementInVisual: "The perimeter of the rectangle is 120 cm.\n If AB = 45 cm, find the length of AD."
        },
        2: {
          questionText: "",
          navText: "Tap » to continue.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true
        },
        3: {
          questionText: "Let's use the formula to find AD.",
          navText: "Tap » to continue.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q1compute1.svg",
          isCalculation: true,
          isCalculationIntro: true,
          nextEnabled: true
        },
        4: {
          questionText: "Answer the questions below.",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q1compute1.svg",
          isCalculation: true,
          isMcqStep: true,
          nextEnabled: false
        },
        5: {
          questionText: "Let's find the length of AD.",
          navText: "Use the numpad to fill the box and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q1compute1.svg",
          isCalculation: true,
          isCalcStep: true,
          nextEnabled: false
        },
        6: {
          questionText: "You have solved the question!",
          navText: "Tap » for the next question.",
          image: "assets/q1computeFinal.svg",
          isFinalStep: true,
          nextEnabled: true
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
      start_over: "Mulai Ulang",

      questionText: "Keliling persegi panjang adalah 120 cm.\nJika AB = 45 cm, tentukan panjang AD.",
      questionImage: "assets/question1_x.svg",

      comprehend: {
        sectionTitle: "ANALISIS INFORMASI",
        images: [
          "assets/q1compre1_x.svg",
          "assets/q1compre2_x.svg",
          "assets/q1compre3_x.svg",
        ],
        given: {
          title: "Diketahui,",
          data: [
            "Keliling persegi panjang = 120 cm.",
            "Panjang = AB = 45 cm.",
          ],
          highlights: ["keliling persegi panjang adalah 120 cm", "AB = 45 cm"]
        },
        toFind: {
          title: "Yang Ditanyakan",
          data: ["Panjang AD"],
          highlights: ["panjang AD"]
        },
      },

      splash: {
        step2: {
          image: "assets/q1compre3_x.svg",
          text: "<blue>✓ Informasi dikumpulkan dari gambar.</blue><br><yellow>Lanjut - Tentukan panjang AD.</yellow>"
        }
      },

      findingsFormat: {
        title: "",
        givenLabel: "Diketahui:",
        givenList: [
          "Keliling persegi panjang = 120 cm.",
          "Panjang = AB = 45 cm."
        ],
        toFindLabel: "Yang Ditanyakan:",
        toFindList: ["Panjang AD"]
      },

      mcqs: [
        {
          title: "Apa rumus keliling persegi panjang?",
          options: [
            "panjang + lebar",
            "2 × panjang + lebar",
            "2 × (panjang + lebar)",
            "panjang × lebar"
          ],
          answerIndex: 2,
          formulaRow: "Keliling Persegi Panjang = 2 × (panjang + lebar)"
        }
      ],

      calcRows: [
        { text: "[box] = 2 × ([box] + AD)", answers: ["120", "45"] },
        { text: "2 × (45 + AD) = 120" },
        { text: "(45 + AD) = 120 ÷ 2" },
        { text: "(45 + AD) = [box]", answers: ["60"] },
        { text: "AD = 60 – 45" },
        { text: "AD = [box] cm", answers: ["15"] }
      ],
      questionTextsWithCalcRows: ["Mari substitusi nilai keliling dan panjang.", "Mari tulis ulang kalimat matematikanya.", "Mari sederhanakan kalimat matematikanya.", "Mari sederhanakan kalimat matematikanya.", "Mari tulis ulang kalimat matematikanya.", "Mari tentukan panjang sisi AD."],

      finalAnswer: "Jadi, panjang AD = 15 cm",

      steps: {
        0: {
          questionText: "Baca soal dan identifikasi 'diketahui' dan 'yang ditanyakan'.",
          navText: "Ketuk » untuk mengidentifikasi informasi 'diketahui'.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        1: {
          questionText: "Baca soal dan identifikasi 'diketahui' dan 'yang ditanyakan'.",
          navText: "Ketuk » untuk mengidentifikasi informasi 'diketahui'.",
          navToFind: "Ketuk » untuk mengidentifikasi 'yang ditanyakan'.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/q1compre0_x.svg",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false,
          statementInVisual: "Keliling persegi panjang adalah 120 cm.\n Jika AB = 45 cm, tentukan panjang AD."
        },
        2: {
          questionText: "",
          navText: "Ketuk » untuk melanjutkan.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true
        },
        3: {
          questionText: "Mari gunakan rumus untuk mencari AD.",
          navText: "Ketuk » untuk melanjutkan.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/q1compute1_x.svg",
          isCalculation: true,
          isCalculationIntro: true,
          nextEnabled: true
        },
        4: {
          questionText: "Jawab pertanyaan di bawah ini.",
          navText: "Ketuk jawaban yang benar.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/q1compute1_x.svg",
          isCalculation: true,
          isMcqStep: true,
          nextEnabled: false
        },
        5: {
          questionText: "Mari tentukan panjang AD.",
          navText: "Gunakan numpad untuk mengisi kotak dan ketuk ✓ untuk memeriksa.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/q1compute1_x.svg",
          isCalculation: true,
          isCalcStep: true,
          nextEnabled: false
        },
        6: {
          questionText: "Kamu telah menyelesaikan soal!",
          navText: "Ketuk » untuk soal berikutnya.",
          image: "assets/q1computeFinal_x.svg",
          isFinalStep: true,
          nextEnabled: true
        }
      },
      labels: {
        given: "Diketahui",
        toFind: "Yang Ditanyakan",
        findings: "Temuan"
      },
    },
  },
};

// Question 2: Square – perimeter 92 cm, find side length
const DATA2 = {
  en: {
    app: {
      start_over: "Restart",

      questionText: "The perimeter of the square is 92 cm. Determine the length of its side.",
      questionImage: "assets/question2.svg",

      comprehend: {
        sectionTitle: "INFORMATION ANALYSIS",
        images: [
          "assets/q2compre1.svg",
          "assets/q2compre2.svg",
        
        ],
        given: {
          title: "Given,",
          data: [
            "The perimeter of the square = 92 cm.",
          ],
          highlights: ["perimeter of the square is 92 cm"]
        },
        toFind: {
          title: "To Find",
          data: ["Side length of the square"],
          highlights: ["length of its side"]
        },
      },

      splash: {
        step2: {
          image: "assets/q2compre2.svg",
          text: "<blue>✓ Information gathered from the figure.</blue><br><yellow>Next - Determine the length of its side.</yellow>"
        }
      },

      findingsFormat: {
        title: "",
        givenLabel: "Given:",
        givenList: [
          "The perimeter of the square = 92 cm."
        ],
        toFindLabel: "To Find:",
        toFindList: ["Side length of the square"]
      },

      mcqs: [
        {
          title: "What is the formula for the perimeter of a square?",
          options: [
            "side + side",
            "2 × side",
            "4 × side",
            "side × side"
          ],
          answerIndex: 2,
          formulaRow: "Perimeter of Square = 4 × Side length"
        }
      ],

      calcRows: [
        { text: "[box] = 4 × AB", answers: ["92"] },
        { text: "4 × AB = 92" },
        { text: "AB = 92 ÷ 4" },
        { text: "AB = [box] cm", answers: ["23"] }
      ],
      questionTextsWithCalcRows:["Let’s substitute the value for perimeter.","Let’s rewrite the math sentence.","Let’s simplify the math sentence.","Let’s find the side length."],


      finalAnswer: "The side length of the square is 23 cm.",

      steps: {
        0: {
          questionText: "Read the question and identify 'given' and 'to find'.",
          navText: "Tap » to identify 'given' information.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        1: {
          questionText: "Read the question and identify 'given' and 'to find'.",
          navText: "Tap » to identify the 'given' information.",
          navToFind: "Tap » to identify what do we need 'to find'.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q2compre0.svg",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false,
          statementInVisual: "The perimeter of the square is 92 cm. Determine the length of its side."
        },
        2: {
          questionText: "",
          navText: "Tap » to continue.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true
        },
        3: {
          questionText: "Let's label the side length as 'AB'.",
          navText: "Tap » to continue.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q2compute1.svg",
          isCalculation: true,
          isCalculationIntro: true,
          nextEnabled: true
        },
        4: {
          questionText: "Answer the questions below.",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q2compute1.svg",
          isCalculation: true,
          isMcqStep: true,
          nextEnabled: false
        },
        5: {
          questionText: "Let's find the side length.",
          navText: "Use the numpad to fill the box and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q2compute1.svg",
          isCalculation: true,
          isCalcStep: true,
          nextEnabled: false
        },
        6: {
          questionText: "You have solved the question!",
          navText: "Tap 'Restart' to restart the activity",
          image: "assets/q2computeFinal.svg",
          isFinalStep: true,
          nextEnabled: true
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
      start_over: "Mulai Ulang",

      questionText: "Keliling persegi adalah 92 cm. Tentukan panjang sisinya.",
      questionImage: "assets/question2_x.svg",

      comprehend: {
        sectionTitle: "ANALISIS INFORMASI",
        images: [
          "assets/q2compre1_x.svg",
          "assets/q2compre2_x.svg",
        ],
        given: {
          title: "Diketahui,",
          data: [
            "Keliling persegi = 92 cm.",
          ],
          highlights: ["keliling persegi adalah 92 cm"]
        },
        toFind: {
          title: "Yang Ditanyakan",
          data: ["Panjang sisi persegi"],
          highlights: ["panjang sisinya"]
        },
      },

      splash: {
        step2: {
          image: "assets/q2compre2_x.svg",
          text: "<blue>✓ Informasi dikumpulkan dari gambar.</blue><br><yellow>Lanjut - Tentukan panjang sisinya.</yellow>"
        }
      },

      findingsFormat: {
        title: "",
        givenLabel: "Diketahui:",
        givenList: [
          "Keliling persegi = 92 cm."
        ],
        toFindLabel: "Yang Ditanyakan:",
        toFindList: ["Panjang sisi persegi"]
      },

      mcqs: [
        {
          title: "Apa rumus keliling persegi?",
          options: [
            "sisi + sisi",
            "2 × sisi",
            "4 × sisi",
            "sisi × sisi"
          ],
          answerIndex: 2,
          formulaRow: "Keliling Persegi = 4 × Panjang sisi"
        }
      ],

      calcRows: [
        { text: "[box] = 4 × AB", answers: ["92"] },
        { text: "4 × AB = 92" },
        { text: "AB = 92 ÷ 4" },
        { text: "AB = [box] cm", answers: ["23"] }
      ],
      questionTextsWithCalcRows: ["Mari substitusi nilai keliling.", "Mari tulis ulang kalimat matematikanya.", "Mari sederhanakan kalimat matematikanya.", "Mari tentukan panjang sisi."],

      finalAnswer: "Panjang sisi persegi adalah 23 cm.",

      steps: {
        0: {
          questionText: "Baca soal dan identifikasi 'diketahui' dan 'yang ditanyakan'.",
          navText: "Ketuk » untuk mengidentifikasi informasi 'diketahui'.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        1: {
          questionText: "Baca soal dan identifikasi 'diketahui' dan 'yang ditanyakan'.",
          navText: "Ketuk » untuk mengidentifikasi informasi 'diketahui'.",
          navToFind: "Ketuk » untuk mengidentifikasi 'yang ditanyakan'.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/q2compre0_x.svg",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false,
          statementInVisual: "Keliling persegi adalah 92 cm. Tentukan panjang sisinya."
        },
        2: {
          questionText: "",
          navText: "Ketuk » untuk melanjutkan.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true
        },
        3: {
          questionText: "Mari beri label panjang sisi sebagai 'AB'.",
          navText: "Ketuk » untuk melanjutkan.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/q2compute1_x.svg",
          isCalculation: true,
          isCalculationIntro: true,
          nextEnabled: true
        },
        4: {
          questionText: "Jawab pertanyaan di bawah ini.",
          navText: "Ketuk jawaban yang benar.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/q2compute1_x.svg",
          isCalculation: true,
          isMcqStep: true,
          nextEnabled: false
        },
        5: {
          questionText: "Mari tentukan panjang sisi.",
          navText: "Gunakan numpad untuk mengisi kotak dan ketuk ✓ untuk memeriksa.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/q2compute1_x.svg",
          isCalculation: true,
          isCalcStep: true,
          nextEnabled: false
        },
        6: {
          questionText: "Kamu telah menyelesaikan soal!",
          navText: "Ketuk 'Mulai Ulang' untuk mengulang aktivitas",
          image: "assets/q2computeFinal_x.svg",
          isFinalStep: true,
          nextEnabled: true
        }
      },
      labels: {
        given: "Diketahui",
        toFind: "Yang Ditanyakan",
        findings: "Temuan"
      },
    },
  },
};

const questions = [DATA1, DATA2];

// Current question data: APP_DATA = questions[question_idx][current_language].app
// Set by App.js based on question_idx; fallback for components that read before mount
const APP_DATA = questions[0][current_language].app;
const decimalSymbol = decimal[current_language];
