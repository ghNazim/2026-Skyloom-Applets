
const decimal = {
  en: ".",
  id: ",",
};

// Question 1: Scalene triangle – perimeter 54, sides 18 and 16, find missing side
const DATA1 = {
  en: {
    app: {
      start_over: "Restart",

      questionText: "Find the missing side length of the triangle below.",
      questionImage: "assets/question1.svg",
      alts: {
        questionFigure: "Question figure",
        triangleImage: "Triangle",
        visualImage: "Visual representation",
        splashImage: "Summary visual"
      },

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
            "Two sides of the triangle are 18 cm and 16 cm.",
            "Perimeter of the triangle = 54 cm",
          ],
          highlights: ["null", "null"]
        },
        toFind: {
          title: "To Find",
          data: ["Missing side length"],
          highlights: ["missing side length"]
        },
      },

      splash: {
        step2: {
          image: "assets/q1compre3.svg",
          text: "<blue>✓ Information gathered from the figure.</blue><br><yellow>Next - Find the missing side length of the triangle.</yellow>"
        }
      },

      findingsFormat: {
        title: "",
        givenLabel: "Given:",
        givenList: [
          "Sides of the triangle are 18 cm and 16 cm.",
          "Perimeter of the triangle = 54 cm"
        ],
        toFindLabel: "To Find:",
        toFindList: ["Missing side length"]
      },

      mcqs: [
        {
          title: "Which of the following represents the perimeter of a triangle?",
          options: [
            "The length of one side of the triangle",
            "The sum of the lengths of any two sides",
            "The sum of the lengths of all three sides",
            "The area enclosed by the triangle"
          ],
          answerIndex: 2,
          formulaRow: "Perimeter = The sum of the lengths of all 3 sides"
        }
      ],
      calcRowMargin: "4vw",
      calcRows: [
        { text: "[box] = 16 + 18 + a", answers: ["54"] },
        { text: "54 = [box] + a", answers: ["34"] },
        { text: "a = 54 - 34" },
        { text: "a = [box]", answers: ["20"] }
      ],

      finalAnswer: "The missing side length of the triangle is 20 cm.",

      steps: {
        0: {
          questionText: "Find the missing side length of the triangle below.",
          navText: "Tap » to identify 'given' information.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        1: {
          questionText: "Find the missing side length of the triangle below.",
          navText: "Tap » to identify the 'given' information.",          
          navToFind: "Tap » to identify what do we need 'to find'.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/question1.svg",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false,
          statementInVisual: "Find the missing side length of the triangle below."
        },
        2: {
          questionText: "",
          navText: "Tap » to continue.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true
        },
        3: {
          questionText: "Let's label the missing side as 'a'.",
          navText: "Tap » to continue.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q1compute1.svg",
          isCalculation: true,
          isCalculationIntro: true,
          nextEnabled: true
        },
        4: {
          questionText: "Answer the question below.",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q1compute2.svg",
          isCalculation: true,
          isMcqStep: true,
          nextEnabled: false
        },
        5: {
          questionText: "Let's find the missing side.",
          navText: "Use the numpad to fill the box and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q1compute2.svg",
          isCalculation: true,
          isCalcStep: true,
          nextEnabled: false
        },
        6: {
          questionText: "You have solved the question!",
          navText: "Tap » for the next question.",
          image: "assets/q1compute2.svg",
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
      start_over: "Mulai ulang",

      questionText: "Temukan panjang sisi yang hilang pada segitiga di bawah ini.",
      questionImage: "assets/question1_x.svg",
      alts: {
        questionFigure: "Gambar soal",
        triangleImage: "Segitiga",
        visualImage: "Representasi visual",
        splashImage: "Ringkasan visual"
      },

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
            "Dua sisi segitiga panjangnya 18 cm dan 16 cm.",
            "Keliling segitiga = 54 cm",
          ],
          highlights: ["null", "null"]
        },
        toFind: {
          title: "Ditanyakan",
          data: ["Panjang sisi yang hilang"],
          highlights: ["panjang sisi yang hilang"]
        },
      },

      splash: {
        step2: {
          image: "assets/q1compre3_x.svg",
          text: "<blue>✓ Informasi dikumpulkan dari gambar.</blue><br><yellow>Selanjutnya - Temukan panjang sisi yang hilang pada segitiga.</yellow>"
        }
      },

      findingsFormat: {
        title: "",
        givenLabel: "Diketahui:",
        givenList: [
          "Sisi-sisi segitiga adalah 18 cm dan 16 cm.",
          "Keliling segitiga = 54 cm"
        ],
        toFindLabel: "Ditanyakan:",
        toFindList: ["Panjang sisi yang hilang"]
      },

      mcqs: [
        {
          title: "Manakah yang menunjukkan keliling segitiga?",
          options: [
            "Panjang salah satu sisi segitiga",
            "Jumlah panjang dua sisi mana pun",
            "Jumlah panjang ketiga sisi",
            "Luas daerah yang dibatasi segitiga"
          ],
          answerIndex: 2,
          formulaRow: "Keliling = jumlah panjang ketiga sisi"
        }
      ],
      calcRowMargin: "4vw",
      calcRows: [
        { text: "[box] = 16 + 18 + a", answers: ["54"] },
        { text: "54 = [box] + a", answers: ["34"] },
        { text: "a = 54 - 34" },
        { text: "a = [box]", answers: ["20"] }
      ],

      finalAnswer: "Panjang sisi yang hilang pada segitiga adalah 20 cm.",

      steps: {
        0: {
          questionText: "Temukan panjang sisi yang hilang pada segitiga di bawah ini.",
          navText: "Ketuk » untuk mengidentifikasi informasi yang 'diketahui'.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        1: {
          questionText: "Temukan panjang sisi yang hilang pada segitiga di bawah ini.",
          navText: "Ketuk » untuk mengidentifikasi informasi yang 'diketahui'.",
          navToFind: "Ketuk » untuk mengidentifikasi apa yang harus 'ditanyakan'.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/question1_x.svg",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false,
          statementInVisual: "Temukan panjang sisi yang hilang pada segitiga di bawah ini."
        },
        2: {
          questionText: "",
          navText: "Ketuk » untuk melanjutkan.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true
        },
        3: {
          questionText: "Mari beri nama sisi yang hilang sebagai 'a'.",
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
          image: "assets/q1compute2_x.svg",
          isCalculation: true,
          isMcqStep: true,
          nextEnabled: false
        },
        5: {
          questionText: "Mari temukan sisi yang hilang.",
          navText: "Gunakan papan angka untuk mengisi kotak lalu ketuk ✓ untuk memeriksa.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/q1compute2_x.svg",
          isCalculation: true,
          isCalcStep: true,
          nextEnabled: false
        },
        6: {
          questionText: "Kamu sudah menyelesaikan soal!",
          navText: "Ketuk » untuk soal berikutnya.",
          image: "assets/q1compute2_x.svg",
          isFinalStep: true,
          nextEnabled: true
        }
      },
      labels: {
        given: "Diketahui",
        toFind: "Ditanyakan",
        findings: "Temuan"
      },
    },
  },
};

// Question 2: Isosceles triangle – perimeter 77, two equal sides 27, find base
const DATA2 = {
  en: {
    app: {
      start_over: "Restart",

      questionText: "Find the missing side length of the triangle below.",
      questionImage: "assets/question2.svg",
      alts: {
        questionFigure: "Question figure",
        triangleImage: "Triangle",
        visualImage: "Visual representation",
        splashImage: "Summary visual"
      },

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
            "Two sides of the triangle are equal",
            "Third side length = 27 cm",
            "Perimeter of the triangle = 77 cm",
          ],
          highlights: ["null", "null"]
        },
        toFind: {
          title: "To Find",
          data: ["Length of the marked side"],
          highlights: ["missing side length"]
        },
      },

      splash: {
        step2: {
          image: "assets/q2compre3.svg",
          text: "<blue>✓ Information gathered from the figure.</blue><br><yellow>Next - Find the missing side length of the triangle.</yellow>"
        }
      },

      findingsFormat: {
        title: "",
        givenLabel: "Given:",
        givenList: [
          "Two sides have same length and third side = 27 cm.",
          "Perimeter of the triangle = 77 cm"
        ],
        toFindLabel: "To Find:",
        toFindList: ["Length of the marked side"]
      },

      mcqs: [
        {
          title: "What is the name of a triangle that has two sides equal in length?",
          options: [
            "Scalene triangle",
            "Isosceles triangle",
            "Right triangle",
            "Equilateral triangle"
          ],
          answerIndex: 1,
          formulaRow: null
        },
        {
          title: "What is the formula to calculate the perimeter of an isosceles triangle?",
          options: [
            "Side × Side",
            "2 × equal side + third side",
            "3 × side",
            "Equal side + third side"
          ],
          answerIndex: 1,
          formulaRow: "Perimeter of isosceles triangle = 2 × equal side + third side"
        }
      ],
      calcRowMargin: "18vw",
      calcRows: [
        { text: "[box] = 2 × a + [box]", answers: ["77", "27"] },
        { text: "2 × a = 77 - 27" },
        { text: "2 × a = [box]", answers: ["50"] },
        { text: "a = 50 ÷ 2 = [box]", answers: ["25"] }
      ],

      finalAnswer: "The missing side length of the triangle is 25 cm.",

      steps: {
        0: {
          questionText: "Find the missing side length of the triangle below.",
          navText: "Tap » to identify 'given' information.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        1: {
          questionText: "Find the missing side length of the triangle below.",
          navText: "Tap » to identify the 'given' information.",
          navToFind: "Tap » to identify what do we need 'to find'.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/question2.svg",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false,
          statementInVisual: "Find the missing side length of the triangle below."
        },
        2: {
          questionText: "",
          navText: "Tap » to continue.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true
        },
        3: {
          questionText: "Let's label the missing side as 'a'.",
          navText: "Tap » to continue.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q2compute1.svg",
          isCalculation: true,
          isCalculationIntro: true,
          nextEnabled: true
        },
        4: {
          questionText: "Answer the question below.",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q2compute2.svg",
          isCalculation: true,
          isMcqStep: true,
          nextEnabled: false
        },
        5: {
          questionText: "Let's find the missing side.",
          navText: "Use the numpad to fill the box and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q2compute2.svg",
          isCalculation: true,
          isCalcStep: true,
          nextEnabled: false
        },
        6: {
          questionText: "You have solved the question!",
          navText: "Tap » for the next question.",
          image: "assets/q2compute2.svg",
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
      start_over: "Mulai ulang",

      questionText: "Temukan panjang sisi yang hilang pada segitiga di bawah ini.",
      questionImage: "assets/question2_x.svg",
      alts: {
        questionFigure: "Gambar soal",
        triangleImage: "Segitiga",
        visualImage: "Representasi visual",
        splashImage: "Ringkasan visual"
      },

      comprehend: {
        sectionTitle: "ANALISIS INFORMASI",
        images: [
          "assets/q2compre1_x.svg",
          "assets/q2compre2_x.svg",
          "assets/q2compre3_x.svg",
          "assets/q2compre4_x.svg",
        ],
        given: {
          title: "Diketahui,",
          data: [
            "Dua sisi segitiga sama panjang",
            "Alas = 27 cm",
            "Keliling segitiga = 77 cm",
          ],
          highlights: ["null", "null"]
        },
        toFind: {
          title: "Ditanyakan",
          data: ["Panjang sisi yang ditandai"],
          highlights: ["panjang sisi yang hilang"]
        },
      },

      splash: {
        step2: {
          image: "assets/q2compre3_x.svg",
          text: "<blue>✓ Informasi dikumpulkan dari gambar.</blue><br><yellow>Selanjutnya - Temukan panjang sisi yang hilang pada segitiga.</yellow>"
        }
      },

      findingsFormat: {
        title: "",
        givenLabel: "Diketahui:",
        givenList: [
          "Dua sisi sama panjang dan alas = 27 cm.",
          "Keliling segitiga = 77 cm"
        ],
        toFindLabel: "Ditanyakan:",
        toFindList: ["Panjang sisi yang ditandai"]
      },

      mcqs: [
        {
          title: "Apa nama segitiga yang memiliki dua sisi sama panjang?",
          options: [
            "Segitiga sembarang",
            "Segitiga sama kaki",
            "Segitiga siku-siku",
            "Segitiga sama sisi"
          ],
          answerIndex: 1,
          formulaRow: null
        },
        {
          title: "Apa rumus untuk menghitung keliling segitiga sama kaki?",
          options: [
            "Sisi × Sisi",
            "2 × sisi yang sama + alas",
            "3 × sisi",
            "Sisi yang sama + alas"
          ],
          answerIndex: 1,
          formulaRow: "Keliling segitiga sama kaki = 2 × sisi yang sama + alas"
        }
      ],

      calcRowMargin: "18vw",
      calcRows: [
        { text: "[box] = 2 × a + [box]", answers: ["77", "27"] },
        { text: "2 × a = 77 - 27" },
        { text: "2 × a = [box]", answers: ["50"] },
        { text: "a = 50 ÷ 2 = [box]", answers: ["25"] }
      ],

      finalAnswer: "Panjang sisi yang hilang pada segitiga adalah 25 cm.",

      steps: {
        0: {
          questionText: "Temukan panjang sisi yang hilang pada segitiga di bawah ini.",
          navText: "Ketuk » untuk mengidentifikasi informasi yang 'diketahui'.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        1: {
          questionText: "Temukan panjang sisi yang hilang pada segitiga di bawah ini.",
          navText: "Ketuk » untuk mengidentifikasi informasi yang 'diketahui'.",
          navToFind: "Ketuk » untuk mengidentifikasi apa yang harus 'ditanyakan'.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/question2_x.svg",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false,
          statementInVisual: "Temukan panjang sisi yang hilang pada segitiga di bawah ini."
        },
        2: {
          questionText: "",
          navText: "Ketuk » untuk melanjutkan.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true
        },
        3: {
          questionText: "Mari beri nama sisi yang hilang sebagai 'a'.",
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
          image: "assets/q2compute2_x.svg",
          isCalculation: true,
          isMcqStep: true,
          nextEnabled: false
        },
        5: {
          questionText: "Mari temukan sisi yang hilang.",
          navText: "Gunakan papan angka untuk mengisi kotak lalu ketuk ✓ untuk memeriksa.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/q2compute2_x.svg",
          isCalculation: true,
          isCalcStep: true,
          nextEnabled: false
        },
        6: {
          questionText: "Kamu sudah menyelesaikan soal!",
          navText: "Ketuk » untuk soal berikutnya.",
          image: "assets/q2compute2_x.svg",
          isFinalStep: true,
          nextEnabled: true
        }
      },
      labels: {
        given: "Diketahui",
        toFind: "Ditanyakan",
        findings: "Temuan"
      },
    },
  },
};

// Question 3: Equilateral triangle – perimeter 114, find side length
const DATA3 = {
  en: {
    app: {
      start_over: "Restart",

      questionText: "Find the length of the side of the triangle below.",
      questionImage: "assets/question3.svg",
      alts: {
        questionFigure: "Question figure",
        triangleImage: "Triangle",
        visualImage: "Visual representation",
        splashImage: "Summary visual"
      },

      comprehend: {
        sectionTitle: "INFORMATION ANALYSIS",
        images: [
          "assets/q3compre1.svg",
          "assets/q3compre2.svg",
          "assets/q3compre3.svg",
        ],
        given: {
          title: "Given,",
          data: [
            "The triangle has all 3 sides of equal length.",
            "Perimeter of the triangle = 114 cm",
          ],
          highlights: ["null", "null"]
        },
        toFind: {
          title: "To Find",
          data: ["Side length of the triangle"],
          highlights: ["length of the side"]
        },
      },

      splash: {
        step2: {
          image: "assets/q3compre3.svg",
          text: "<blue>✓ Information gathered from the figure.</blue><br><yellow>Next - Find the length of the side of the triangle.</yellow>"
        }
      },

      findingsFormat: {
        title: "",
        givenLabel: "Given:",
        givenList: [
          "The triangle has all 3 sides of equal length.",
          "Perimeter of the triangle = 114 cm"
        ],
        toFindLabel: "To Find:",
        toFindList: ["Side length of the triangle"]
      },

      mcqs: [
        {
          title: "What is the name of a triangle that has all sides equal in length?",
          options: [
            "A. Scalene triangle",
            "B. Isosceles triangle",
            "C. Right triangle",
            "D. Equilateral triangle"
          ],
          answerIndex: 3,
          formulaRow: null
        },
        {
          title: "What is the formula to calculate the perimeter of an equilateral triangle?",
          options: [
            "Side + Side",
            "2 × Side",
            "3 × Side",
            "Side × Side"
          ],
          answerIndex: 2,
          formulaRow: "Perimeter of equilateral triangle = 3 × Side"
        }
      ],
      calcRowMargin: "18vw",
      calcRows: [
        { text: "[box] = 3 × a", answers: ["114"] },
        { text: "a = 114 ÷ 3" },
        { text: "a = [box]", answers: ["38"] }
      ],

      finalAnswer: "The side length of the triangle is 38 cm.",

      steps: {
        0: {
          questionText: "Find the length of the side of the triangle below.",
          navText: "Tap » to identify 'given' information.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        1: {
          questionText: "Find the length of the side of the triangle below.",
          navText: "Tap » to identify the 'given' information.",
          navToFind: "Tap » to identify what do we need 'to find'.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/question3.svg",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false,
          statementInVisual: "Find the length of the side of the triangle below."
        },
        2: {
          questionText: "",
          navText: "Tap » to continue.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true
        },
        3: {
          questionText: "Let's label the missing side as 'a'.",
          navText: "Tap » to continue.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q3compute1.svg",
          isCalculation: true,
          isCalculationIntro: true,
          nextEnabled: true
        },
        4: {
          questionText: "Answer the question below.",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q3compute2.svg",
          isCalculation: true,
          isMcqStep: true,
          nextEnabled: false
        },
        5: {
          questionText: "Let's find the side length.",
          navText: "Use the numpad to fill the box and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q3compute2.svg",
          isCalculation: true,
          isCalcStep: true,
          nextEnabled: false
        },
        6: {
          questionText: "Activity Completed!",
          navText: "Tap 'Restart' to restart the activity",
          image: "assets/q3compute2.svg",
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
      start_over: "Mulai ulang",

      questionText: "Temukan panjang sisi segitiga di bawah ini.",
      questionImage: "assets/question3_x.svg",
      alts: {
        questionFigure: "Gambar soal",
        triangleImage: "Segitiga",
        visualImage: "Representasi visual",
        splashImage: "Ringkasan visual"
      },

      comprehend: {
        sectionTitle: "ANALISIS INFORMASI",
        images: [
          "assets/q3compre1_x.svg",
          "assets/q3compre2_x.svg",
          "assets/q3compre3_x.svg",
        ],
        given: {
          title: "Diketahui,",
          data: [
            "Segitiga memiliki 3 sisi dengan panjang yang sama.",
            "Keliling segitiga = 114 cm",
          ],
          highlights: ["null", "null"]
        },
        toFind: {
          title: "Ditanyakan",
          data: ["Panjang sisi segitiga"],
          highlights: ["panjang sisi"]
        },
      },

      splash: {
        step2: {
          image: "assets/q3compre3_x.svg",
          text: "<blue>✓ Informasi dikumpulkan dari gambar.</blue><br><yellow>Selanjutnya - Temukan panjang sisi segitiga.</yellow>"
        }
      },

      findingsFormat: {
        title: "",
        givenLabel: "Diketahui:",
        givenList: [
          "Segitiga memiliki 3 sisi dengan panjang yang sama.",
          "Keliling segitiga = 114 cm"
        ],
        toFindLabel: "Ditanyakan:",
        toFindList: ["Panjang sisi segitiga"]
      },

      mcqs: [
        {
          title: "Apa nama segitiga yang semua sisinya sama panjang?",
          options: [
            "Segitiga sembarang",
            "Segitiga sama kaki",
            "Segitiga siku-siku",
            "Segitiga sama sisi"
          ],
          answerIndex: 3,
          formulaRow: null
        },
        {
          title: "Apa rumus untuk menghitung keliling segitiga sama sisi?",
          options: [
            "Sisi + Sisi",
            "2 × Sisi",
            "3 × Sisi",
            "Sisi × Sisi"
          ],
          answerIndex: 2,
          formulaRow: "Keliling segitiga sama sisi = 3 × Sisi"
        }
      ],

      calcRowMargin: "18vw",
      calcRows: [
        { text: "[box] = 3 × a", answers: ["114"] },
        { text: "a = 114 ÷ 3" },
        { text: "a = [box]", answers: ["38"] }
      ],

      finalAnswer: "Panjang sisi segitiga adalah 38 cm.",

      steps: {
        0: {
          questionText: "Temukan panjang sisi segitiga di bawah ini.",
          navText: "Ketuk » untuk mengidentifikasi informasi yang 'diketahui'.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        1: {
          questionText: "Temukan panjang sisi segitiga di bawah ini.",
          navText: "Ketuk » untuk mengidentifikasi informasi yang 'diketahui'.",
          navToFind: "Ketuk » untuk mengidentifikasi apa yang harus 'ditanyakan'.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/question3_x.svg",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false,
          statementInVisual: "Temukan panjang sisi segitiga di bawah ini."
        },
        2: {
          questionText: "",
          navText: "Ketuk » untuk melanjutkan.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true
        },
        3: {
          questionText: "Mari beri nama sisi yang hilang sebagai 'a'.",
          navText: "Ketuk » untuk melanjutkan.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/q3compute1_x.svg",
          isCalculation: true,
          isCalculationIntro: true,
          nextEnabled: true
        },
        4: {
          questionText: "Jawab pertanyaan di bawah ini.",
          navText: "Ketuk jawaban yang benar.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/q3compute2_x.svg",
          isCalculation: true,
          isMcqStep: true,
          nextEnabled: false
        },
        5: {
          questionText: "Mari temukan panjang sisi.",
          navText: "Gunakan papan angka untuk mengisi kotak lalu ketuk ✓ untuk memeriksa.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/q3compute2_x.svg",
          isCalculation: true,
          isCalcStep: true,
          nextEnabled: false
        },
        6: {
          questionText: "Aktivitas selesai!",
          navText: "Ketuk 'Mulai ulang' untuk memulai ulang aktivitas",
          image: "assets/q3compute2_x.svg",
          isFinalStep: true,
          nextEnabled: true
        }
      },
      labels: {
        given: "Diketahui",
        toFind: "Ditanyakan",
        findings: "Temuan"
      },
    },
  },
};

const questions = [DATA1, DATA2, DATA3];

// Current question data: APP_DATA = questions[question_idx][current_language].app
// Set by App.js based on question_idx; fallback for components that read before mount
const APP_DATA = questions[0][current_language].app;
const decimalSymbol = decimal[current_language];
