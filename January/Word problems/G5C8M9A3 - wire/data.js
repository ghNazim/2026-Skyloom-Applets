const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

// Master data structure for Triangle Wire Word Problem
const DATA = {
  en: {
    app: {
      start_over: "Restart",
      
      // Question text for display
      questionText: "Look at the following two triangles. A 2-meter wire is used to make two equilateral triangles with the side lengths shown in the figure below. If the remaining length of the wire is 68 cm, what is the length of a side of triangle B?",
      
      // Comprehend step data (Step 1)
      comprehend: {
        sectionTitle: "INFORMATION ANALYSIS",
        images: [
          "assets/compre1.png",
          "assets/compre2.png",
          "assets/compre3.png",
          "assets/compre4.png",
          
        ],
        given: {
          title: "Given,",
          data: [
            "Total wire length = 2 m",
            "Triangle A: An equilateral triangle with side length 18 cm\nTriangle B: An equilateral triangle",
            "Remaining wire length = 68 cm"
          ],
          highlights: [
            "A 2-meter wire",
            "two equilateral triangles",
            "remaining length of the wire is 68 cm"
          ]
        },
        toFind: {
          title: "To Find",
          data: [
            "The length of one side of triangle B"
          ],
          highlights: [
            "what is the length of a side of triangle B"
          ]
        },
      },
      
      // Splash screen data
      splash: {
        step2: {
          image: "assets/compre4.png",
          text: "<blue>✓ Information gathered from the problem.</blue><br><yellow>Next - Let's recall the perimeter formula for an equilateral triangle.</yellow>"
        }
      },
      
      // MCQ for Step 3 - What to find first
      mcqStep3: {
        title: "To find the side length of triangle B, what do we need to find first?",
        options: [
          "A. The area of triangle B",
          "B. The height of triangle B",
          "C. The perimeter of triangle B",
          "D. The remaining length of the wire"
        ],
        answerIndex: 2
      },
      
      // Drag and Drop data for Step 4
      dragDrop1: {
        equationLabel: "Total length of wire used",
        dropZones: [
          { id: "zone1", correctAnswer: "Total length of wire used", placeholder: "?" },
          { id: "zone2", correctAnswers: ["Perimeter of A", "Perimeter of B", "Remaining wire length"], placeholder: "?" },
          { id: "zone3", correctAnswer: "+", placeholder: "?" },
          { id: "zone4", correctAnswers: ["Perimeter of A", "Perimeter of B", "Remaining wire length"], placeholder: "?" },
          { id: "zone5", correctAnswer: "+", placeholder: "?" },
          { id: "zone6", correctAnswers: ["Perimeter of A", "Perimeter of B", "Remaining wire length"], placeholder: "?" }
        ],
        draggables: [
          { id: "drag1", text: "Total length of wire used" },
          { id: "drag2", text: "Perimeter of A" },
          { id: "drag3", text: "Perimeter of B" },
          { id: "drag4", text: "Remaining wire length" },
          { id: "drag5", text: "+" },
          { id: "drag6", text: "–" },
          { id: "drag7", text: "×" },
          { id: "drag8", text: "÷" },
          { id: "drag9", text: "+" },
          { id: "drag10", text: "–" },
          { id: "drag11", text: "×" },
          { id: "drag12", text: "÷" }
        ]
      },
      
      // MCQ for Step 6 - Perimeter formula
      mcqStep6: {
        title: "What is the formula to find the perimeter of an equilateral triangle?",
        options: [
          "A. Perimeter = side length + 2",
          "B. Perimeter = 2 × side length",
          "C. Perimeter = 3 × side length",
          "D. Perimeter = side length × side length"
        ],
        answerIndex: 2
      },
      
      // MCQ for Step 11 - Side length formula
      mcqStep11: {
        title: "To find the side of an equilateral triangle, which formula will you use?",
        options: [
          "A. Side length = Perimeter × 3",
          "B. Side length = Perimeter − 3",
          "C. Side length = Perimeter ÷ 3",
          "D. Side length = Perimeter + 3"
        ],
        answerIndex: 2
      },
      
      // Calculation display strings
      calculation: {
        units: {
          cm: "cm",
          m: "m"
        },
        rows: {
          // Step 5
          step5Row: "Total length of wire used = Perimeter of A + Perimeter of B + Remaining wire length",
          step5HighlightText: "Perimeter of A",
          
          // Step 6
          step6CalcRow: "Perimeter of triangle A = 3 × ",
          step6SideLengthBox: "Side length",
          step6ResultRow: "= ",
          
          // Step 7
          step7CalcRow: " = Perimeter of A + Perimeter of B + Remaining wire length",
          step7Box1Text: "Total length of wire used",
          step7Box2Text: "Perimeter of A",
          step7Box3Text: "Remaining wire length",
          step7PerimeterBText: "Perimeter of B",
          step7Values: {
            totalWire: "2 m",
            perimeterA: "54 cm",
            remaining: "68 cm"
          },
          
          // Step 8
          step8CalcRow: " = 54 cm + Perimeter of B + 68 cm",
          step8BoxText: "2 m",
          step8SubstituteValue: "200 cm",
          
          // Step 9
          step9CalcRow1: "200 cm = 54 cm + Perimeter of B + 68 cm",
          step9CalcRow2: "Perimeter of B = 200 cm - (54 cm + 68 cm)",
          step9BoxText: "Perimeter of B",
          
          // Step 10
          step10CalcRow1: "Perimeter of B = 200 cm - (54 cm + 68 cm)",
          step10CalcRow2: "Perimeter of B = 200 cm - ",
          step10CalcRow3: "= ",
          
          // Step 11
          step11CalcRow: "Side length of B = Perimeter of B ÷ 3",
          
          // Step 12
          step12CalcRow1: "Side length of B = ",
          step12CalcRow2: " ÷ 3",
          step12BoxText: "Perimeter of B",
          step12SubstituteValue: "78 cm",
          step12ResultRow: "Side length of B = "
        },
        numpad: {
          step6Answer: "54",
          step6MaxLength: 3,
          step10Answer1: "122",
          step10MaxLength1: 3,
          step10Answer2: "78",
          step10MaxLength2: 3,
          step12Answer: "26",
          step12MaxLength: 3
        },
        altTexts: {
          triangles: "Two triangles"
        }
      },
      
      // Findings data
      findings: {
        perimeterA: "Perimeter of triangle A = 54 cm",
        perimeterB: "Perimeter of triangle B = 78 cm"
      },
      
      // To Find data
      toFindData: {
        title: "To Find",
        list: ["The length of one side of triangle B"]
      },
      
      // Final answer
      finalAnswer: "Side length of B is 26 cm.",
      
      // Steps configuration
      steps: {
        // Step 0: Initial comprehend - question display only
        0: {
          questionText: "Read the question and identify 'given' and 'to find'.",
          navText: "Tap » to identify 'given' information.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true,
          questionImage: "assets/question.png"
        },
        // Step 1: Comprehend with substeps (Given/To Find)
        1: {
          questionText: "Look at the following two triangles. A 2-meter wire is used to make two equilateral triangles with the side lengths shown in the figure below. If the remaining length of the wire is 68 cm, what is the length of a side of triangle B?",
          navText: "Tap » to identify 'given' information.",
          navToFind: "Tap » to identify what we need 'to find'.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre1.png",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false
        },
        // Step 2: Splash screen
        2: {
          questionText: "",
          navText: "Tap » to continue.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true
        },
        // Step 3: MCQ - What to find first
        3: {
          questionText: "Let's recall the perimeter of the equilateral triangle.",
          navText: "Tap the correct option.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compute1.png",
          isMcqStep3: true,
          nextEnabled: false
        },
        // Step 4: Drag and Drop
        4: {
          questionText: "Let's build the math sentence for the given problem.",
          navText: "Drag the correct buttons to the correct spot in the sentence.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compute1.png",
          isDragDrop: true,
          dragDropKey: "dragDrop1",
          nextEnabled: false
        },
        // Step 5: Show equation with highlighted Perimeter of A
        5: {
          questionText: "Let's first find the perimeter of A.",
          navText: "Tap » to continue.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compute1.png",
          isStep5Display: true,
          nextEnabled: true
        },
        // Step 6: MCQ for perimeter formula + calculation
        6: {
          questionText: "Let's recall the perimeter of the equilateral triangle.",
          navText: "Tap the correct option.",
          navTextNumpad: "Use the numpad to fill the answer and click ✓ .",
          navTextBox: "Tap the highlighted box.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compute1.png",
          isMcqStep6: true,
          nextEnabled: false
        },
        // Step 7: Substitute values in equation
        7: {
          questionText: "Let's substitute the given values in the math sentence.",
          navText: "Tap the highlighted box.",
          navTextCorrect: "Tap » to continue.",
          images: ["assets/wireh.png", "assets/Ah.png", "assets/remh.png", "assets/compute2.png"],
          isStep7Interactive: true,
          nextEnabled: false
        },
        // Step 8: Convert 2m to cm
        8: {
          questionText: "Convert 2 m to centimeters. 2 m = 2 × 100 cm",
          navText: "Tap the highlighted box.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compute2.png",
          isStep8Convert: true,
          nextEnabled: false
        },
        // Step 9: Find perimeter of B - setup
        9: {
          questionText: "Now, find the perimeter of B.",
          navText: "Tap the highlighted box.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compute2.png",
          isStep9Setup: true,
          nextEnabled: false
        },
        // Step 10: Find perimeter of B - numpad
        10: {
          questionText: "Now, find the perimeter of B.",
          navText: "Use the numpad to fill the answer and click ✓ .",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compute2.png",
          isStep10Numpad: true,
          nextEnabled: false
        },
        // Step 11: MCQ for side length formula
        11: {
          questionText: "Let's find one side of triangle B.",
          navText: "Tap the correct option.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compute2.png",
          isMcqStep11: true,
          nextEnabled: false
        },
        // Step 12: Calculate side length
        12: {
          questionText: "Let's find one side of triangle B.",
          navText: "Tap the highlighted box.",
          navTextNumpad: "Use the numpad to fill the answer and click ✓ .",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compute2.png",
          isStep12Calc: true,
          nextEnabled: false
        },
        // Step 13: Final answer
        13: {
          questionText: "Activity Completed!",
          navText: "Tap 'Restart' to restart the activity.",
          image: "assets/compute2.png",
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
      
      questionText: "Lihat dua segitiga berikut. Kawat sepanjang 2 meter digunakan untuk membuat dua segitiga sama sisi dengan panjang sisi seperti yang ditunjukkan pada gambar di bawah ini. Jika sisa panjang kawat adalah 68 cm, berapa panjang sisi segitiga B?",
      
      comprehend: {
        sectionTitle: "ANALISIS INFORMASI",
        images: [
          "assets/compre1.png",
          "assets/compre2.png",
          "assets/compre3.png",
          "assets/compre4.png",
          "assets/compre5.png"
        ],
        given: {
          title: "Diketahui,",
          data: [
            "Panjang kawat total = 2 m",
            "Segitiga A: Segitiga sama sisi dengan panjang sisi 18 cm",
            "Segitiga B: Segitiga sama sisi",
            "Sisa panjang kawat = 68 cm"
          ],
          highlights: [
            "Kawat sepanjang 2 meter",
            "panjang sisi seperti yang ditunjukkan pada gambar",
            "dua segitiga sama sisi",
            "sisa panjang kawat adalah 68 cm"
          ]
        },
        toFind: {
          title: "Ditanyakan",
          data: [
            "Panjang sisi segitiga B"
          ],
          highlights: [
            "berapa panjang sisi segitiga B"
          ]
        },
      },
      
      splash: {
        step2: {
          image: "assets/compre5.png",
          text: "<blue>✓ Informasi dikumpulkan dari soal.</blue><br><yellow>Selanjutnya - Mari ingat rumus keliling segitiga sama sisi.</yellow>"
        }
      },
      
      mcqStep3: {
        title: "Untuk menemukan panjang sisi segitiga B, apa yang perlu kita cari terlebih dahulu?",
        options: [
          "A. Luas segitiga B",
          "B. Tinggi segitiga B",
          "C. Keliling segitiga B",
          "D. Sisa panjang kawat"
        ],
        answerIndex: 2
      },
      
      dragDrop1: {
        equationLabel: "Panjang kawat yang digunakan",
        dropZones: [
          { id: "zone1", correctAnswer: "Panjang kawat yang digunakan", placeholder: "?" },
          { id: "zone2", correctAnswers: ["Keliling A", "Keliling B", "Sisa panjang kawat"], placeholder: "?" },
          { id: "zone3", correctAnswer: "+", placeholder: "?" },
          { id: "zone4", correctAnswers: ["Keliling A", "Keliling B", "Sisa panjang kawat"], placeholder: "?" },
          { id: "zone5", correctAnswer: "+", placeholder: "?" },
          { id: "zone6", correctAnswers: ["Keliling A", "Keliling B", "Sisa panjang kawat"], placeholder: "?" }
        ],
        draggables: [
          { id: "drag1", text: "Panjang kawat yang digunakan" },
          { id: "drag2", text: "Keliling A" },
          { id: "drag3", text: "Keliling B" },
          { id: "drag4", text: "Sisa panjang kawat" },
          { id: "drag5", text: "+" },
          { id: "drag6", text: "–" },
          { id: "drag7", text: "×" },
          { id: "drag8", text: "÷" },
          { id: "drag9", text: "+" },
          { id: "drag10", text: "–" },
          { id: "drag11", text: "×" },
          { id: "drag12", text: "÷" }
        ]
      },
      
      mcqStep6: {
        title: "Apa rumus untuk mencari keliling segitiga sama sisi?",
        options: [
          "A. Keliling = panjang sisi + 2",
          "B. Keliling = 2 × panjang sisi",
          "C. Keliling = 3 × panjang sisi",
          "D. Keliling = panjang sisi × panjang sisi"
        ],
        answerIndex: 2
      },
      
      mcqStep11: {
        title: "Untuk mencari sisi segitiga sama sisi, rumus apa yang akan kamu gunakan?",
        options: [
          "A. Panjang sisi = Keliling × 3",
          "B. Panjang sisi = Keliling − 3",
          "C. Panjang sisi = Keliling ÷ 3",
          "D. Panjang sisi = Keliling + 3"
        ],
        answerIndex: 2
      },
      
      calculation: {
        units: {
          cm: "cm",
          m: "m"
        },
        rows: {
          step5Row: "Panjang kawat yang digunakan = Keliling A + Keliling B + Sisa panjang kawat",
          step5HighlightText: "Keliling A",
          
          step6CalcRow: "Keliling segitiga A = 3 × ",
          step6SideLengthBox: "Panjang sisi",
          step6ResultRow: "= ",
          
          step7CalcRow: " = Keliling A + Keliling B + Sisa panjang kawat",
          step7Box1Text: "Panjang kawat yang digunakan",
          step7Box2Text: "Keliling A",
          step7Box3Text: "Sisa panjang kawat",
          step7PerimeterBText: "Keliling B",
          step7Values: {
            totalWire: "2 m",
            perimeterA: "54 cm",
            remaining: "68 cm"
          },
          
          step8CalcRow: " = 54 cm + Keliling B + 68 cm",
          step8BoxText: "2 m",
          step8SubstituteValue: "200 cm",
          
          step9CalcRow1: "2 m = 54 cm + Keliling B + 68 cm",
          step9CalcRow2: "Keliling B = 200 cm - (54 cm + 68 cm)",
          step9BoxText: "Keliling B",
          
          step10CalcRow1: "Keliling B = 200 cm - (54 cm + 68 cm)",
          step10CalcRow2: "Keliling B = 200 cm - ",
          step10CalcRow3: "= ",
          
          step11CalcRow: "Panjang sisi B = Keliling B ÷ 3",
          
          step12CalcRow1: "Panjang sisi B = ",
          step12CalcRow2: " ÷ 3",
          step12BoxText: "Keliling B",
          step12SubstituteValue: "78 cm",
          step12ResultRow: "Panjang sisi B = "
        },
        numpad: {
          step6Answer: "54",
          step6MaxLength: 3,
          step10Answer1: "122",
          step10MaxLength1: 3,
          step10Answer2: "78",
          step10MaxLength2: 3,
          step12Answer: "26",
          step12MaxLength: 3
        },
        altTexts: {
          triangles: "Dua segitiga"
        }
      },
      
      findings: {
        perimeterA: "Keliling segitiga A = 54 cm",
        perimeterB: "Keliling segitiga B = 78 cm"
      },
      
      toFindData: {
        title: "Ditanyakan",
        list: ["Panjang sisi segitiga B"]
      },
      
      finalAnswer: "Panjang sisi B adalah 26 cm.",
      
      steps: {
        0: {
          questionText: "Baca pertanyaan dan identifikasi 'diketahui' dan 'ditanyakan'.",
          navText: "Ketuk » untuk mengidentifikasi informasi 'diketahui'.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true,
          questionImage: "assets/question.png"
        },
        1: {
          questionText: "Lihat dua segitiga berikut. Kawat sepanjang 2 meter digunakan untuk membuat dua segitiga sama sisi dengan panjang sisi seperti yang ditunjukkan pada gambar di bawah ini. Jika sisa panjang kawat adalah 68 cm, berapa panjang sisi segitiga B?",
          navText: "Ketuk » untuk mengidentifikasi informasi 'diketahui'.",
          navToFind: "Ketuk » untuk mengidentifikasi apa yang perlu 'ditanyakan'.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compre1.png",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false
        },
        2: {
          questionText: "",
          navText: "Ketuk » untuk melanjutkan.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true
        },
        3: {
          questionText: "Mari ingat keliling segitiga sama sisi.",
          navText: "Ketuk opsi yang benar.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compute1.png",
          isMcqStep3: true,
          nextEnabled: false
        },
        4: {
          questionText: "Mari buat kalimat matematika untuk soal yang diberikan.",
          navText: "Seret tombol yang benar ke tempat yang tepat dalam kalimat.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compute1.png",
          isDragDrop: true,
          dragDropKey: "dragDrop1",
          nextEnabled: false
        },
        5: {
          questionText: "Mari temukan keliling A terlebih dahulu.",
          navText: "Ketuk » untuk melanjutkan.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compute1.png",
          isStep5Display: true,
          nextEnabled: true
        },
        6: {
          questionText: "Mari ingat keliling segitiga sama sisi.",
          navText: "Ketuk opsi yang benar.",
          navTextNumpad: "Gunakan numpad untuk mengisi jawaban dan klik ✓ .",
          navTextBox: "Ketuk kotak yang disorot.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compute2.png",
          isMcqStep6: true,
          nextEnabled: false
        },
        7: {
          questionText: "Mari substitusi nilai-nilai yang diketahui dalam kalimat matematika.",
          navText: "Ketuk kotak yang disorot.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          images: ["assets/wireh.png", "assets/Ah.png", "assets/remh.png", "assets/compute2.png"],
          isStep7Interactive: true,
          nextEnabled: false
        },
        8: {
          questionText: "Ubah 2 m ke sentimeter. 2 m = 2 × 100 cm",
          navText: "Ketuk kotak yang disorot.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compute2.png",
          isStep8Convert: true,
          nextEnabled: false
        },
        9: {
          questionText: "Sekarang, temukan keliling B.",
          navText: "Ketuk kotak yang disorot.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compute2.png",
          isStep9Setup: true,
          nextEnabled: false
        },
        10: {
          questionText: "Sekarang, temukan keliling B.",
          navText: "Gunakan numpad untuk mengisi jawaban dan klik ✓ .",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compute2.png",
          isStep10Numpad: true,
          nextEnabled: false
        },
        11: {
          questionText: "Mari temukan satu sisi segitiga B.",
          navText: "Ketuk opsi yang benar.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compute2.png",
          isMcqStep11: true,
          nextEnabled: false
        },
        12: {
          questionText: "Mari temukan satu sisi segitiga B.",
          navText: "Ketuk kotak yang disorot.",
          navTextNumpad: "Gunakan numpad untuk mengisi jawaban dan klik ✓ .",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compute2.png",
          isStep12Calc: true,
          nextEnabled: false
        },
        13: {
          questionText: "Aktivitas Selesai!",
          navText: "Ketuk 'Mulai Ulang' untuk memulai kembali aktivitas.",
          image: "assets/compute2.png",
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

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
