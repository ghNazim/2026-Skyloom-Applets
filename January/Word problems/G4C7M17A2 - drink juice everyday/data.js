const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

// Master data structure for Juice Volume Word Problem
const DATA = {
  en: {
    app: {
      start_over: "Restart",
      
      // Question text for display
      questionText: "Olivia bought 3 L 250 mL of juice on Monday, 2 L 750 mL on Tuesday, and 3 L 500 mL on Wednesday. She consumed 1 L and 700 mL on Thursday afternoon. How much juice is left?",
      
      // Comprehend step data (Step 1)
      comprehend: {
        sectionTitle: "INFORMATION ANALYSIS",
        given: {
          title: "Given,",
          // Nested structure: each item can have subitems
          data: [
            {
              label: "Volume of juice bought:",
              subitems: [
                "on Monday = 3 L 250 mL",
                "on Tuesday = 2 L 750 mL",
                "on Wednesday = 3 L 500 mL"
              ]
            },
            {
              label: "Volume of juice used:",
              subitems: [
                "on Thursday = 1 L 700 mL"
              ]
            }
          ],
          highlights: [
            "3 L 250 mL of juice on Monday",
            "2 L 750 mL on Tuesday",
            "3 L 500 mL on Wednesday",
            "1 L and 700 mL on Thursday"
          ]
        },
        toFind: {
          title: "To Find",
          data: [
            "Volume of juice left"
          ],
          highlights: [
            "How much juice is left"
          ]
        },
      },
      
      // Splash screens data
      splash: {
        step2: {
          text: "<blue>✓ Information gathered from the question.</blue><br><yellow>Next - Let's solve the problem step by step.</yellow>"
        }
      },
      
      // MCQ for step 3 (L to mL relationship)
      relationshipMcq: {
        title: "Which statement correctly shows the relationship between liters (L) and milliliters (mL)?",
        options: [
          "1 mL = 1000 L",
          "1 L = 100 mL",
          "1 L = 1000 mL",
          "1 mL = 10 L"
        ],
        answerIndex: 2,
        findingOnCorrect: "1 L = 1000 mL"
      },
      
      // Drag and Drop data for Step 9 (Total volume bought - addition)
      dragDrop1: {
        equationLabel: "Total volume of juice bought",
        isVerticalLayout: true,
        dropZones: [
          { id: "zone1", correctAnswers: ["Volume of juice bought on Monday", "Volume of juice bought on Tuesday", "Volume of juice bought on Wednesday"], placeholder: "Volume of juice bought on Monday" },
          { id: "zone2", correctAnswer: "+", placeholder: "+" },
          { id: "zone3", correctAnswers: ["Volume of juice bought on Monday", "Volume of juice bought on Tuesday", "Volume of juice bought on Wednesday"], placeholder: "Volume of juice bought on Tuesday" },
          { id: "zone4", correctAnswer: "+", placeholder: "+" },
          { id: "zone5", correctAnswers: ["Volume of juice bought on Monday", "Volume of juice bought on Tuesday", "Volume of juice bought on Wednesday"], placeholder: "Volume of juice bought on Wednesday" }
        ],
        draggables: [
          { id: "drag1", text: "Volume of juice bought on Monday" },
          { id: "drag2", text: "Volume of juice bought on Tuesday" },
          { id: "drag3", text: "Volume of juice bought on Wednesday" },
          { id: "drag4", text: "Volume of juice used on Thursday" },
          { id: "drag5", text: "+" },
          { id: "drag6", text: "-" },
          { id: "drag7", text: "×" },
          { id: "drag8", text: "÷" },
          { id: "drag9", text: "+" },
          { id: "drag10", text: "-" }
        ],
        hideFindings: true
      },
      
      // Drag and Drop data for Step 11 (Volume left - subtraction)
      dragDrop2: {
        equationLabel: "Volume of juice left",
        isVerticalLayout: true,
        dropZones: [
          { id: "zone1", correctAnswer: "Total volume of juice bought", placeholder: "Total volume of juice bought" },
          { id: "zone2", correctAnswer: "-", placeholder: "-" },
          { id: "zone3", correctAnswer: "Volume of juice used on Thursday", placeholder: "Volume of juice used on Thursday" }
        ],
        draggables: [
          { id: "drag1", text: "Volume of juice bought on Monday" },
          { id: "drag2", text: "Volume of juice used on Thursday" },
          { id: "drag3", text: "Total volume of juice bought" },
          { id: "drag4", text: "+" },
          { id: "drag5", text: "-" },
          { id: "drag6", text: "×" },
          { id: "drag7", text: "÷" }
        ],
        hideFindings: true
      },
      
      // Calculation data for Step 3 (initial intro - day label and initial line only)
      calcStep3: {
        dayLabel: "Monday:",
        initialLine: "3 L 250 mL = 3 L + 250 mL",
      },
      
      // Calculation data for Step 4 (Monday conversion)
      calcStep4: {
        dayLabel: "Monday:",
        initialLine: "3 L 250 mL = 3 L + 250 mL",
        inputLine: "= [box] × 1000 + [box] mL",
        boxes: [
          { answer: "3", maxLength: 1 },
          { answer: "250", maxLength: 3 }
        ]
      },
      
      // Calculation data for Step 5 (Monday result)
      calcStep5: {
        inputLine: "[box] mL",
        box: { answer: "3250", maxLength: 4 },
        findingOnCorrect: "Volume of juice bought on Monday = 3250 mL"
      },
      
      // Calculation data for Step 6 (Tuesday)
      calcStep6: {
        dayLabel: "Tuesday:",
        initialLine: "2 L 750 mL = (2 × 1000) + 750",
        inputLine: "= [box] mL",
        box: { answer: "2750", maxLength: 4 },
        findingOnCorrect: "Volume of juice bought on Tuesday = 2750 mL"
      },
      
      // Calculation data for Step 7 (Wednesday)
      calcStep7: {
        dayLabel: "Wednesday:",
        initialLine: "3 L 500 mL = (3 × 1000) + 500",
        inputLine: "= [box] mL",
        box: { answer: "3500", maxLength: 4 },
        findingOnCorrect: "Volume of juice bought on Wednesday = 3500 mL"
      },
      
      // Calculation data for Step 8 (Thursday)
      calcStep8: {
        dayLabel: "Thursday:",
        initialLine: "1 L 700 mL = (1 × 1000) + 700",
        inputLine: "= [box] mL",
        box: { answer: "1700", maxLength: 4 },
        findingOnCorrect: "Volume of juice used on Thursday = 1700 mL"
      },
      
      // Calculation data for Step 10 (Total volume addition)
      calcStep10: {
        label: "Total volume of juice bought",
        values: ["3250 mL", "2750 mL", "3500 mL"],
        operator: "+",
        box: { answer: "9500", maxLength: 5 },
        findingOnCorrect: "Total volume of juice bought = 9500 mL"
      },
      
      // Calculation data for Step 12 (Volume left subtraction)
      calcStep12: {
        label: "Volume of juice left",
        values: ["9500 mL", "1700 mL"],
        operator: "-",
        box: { answer: "7800", maxLength: 4 }
      },
      
      // MCQ for step 13 (conversion)
      conversionMcq: {
        title: "How will you convert 7800 mL to L?",
        options: [
          "Multiply the value in mL by 10",
          "Multiply the value in mL by 100",
          "Divide the value in mL by 100",
          "Divide the value in mL by 1000"
        ],
        answerIndex: 3,
        firstLine: "Volume of juice left = 7800 mL",
        postMcqLines: [
          "Volume of juice left = 7800 mL ÷ 1000",
          "Volume of juice left = [box] L [box] mL"
        ],
        finalLinePrefix: "Volume of juice left = ",
        boxes: [
          { answer: "7", maxLength: 1 },
          { answer: "800", maxLength: 3 }
        ]
      },
      
      // Final answer
      finalAnswer: "So, the volume of juice left is 7 L 800 mL.",
      
      // Steps configuration
      steps: {
        // Step 0: Initial comprehend - question display only
        0: {
          questionText: "Read the question and identify 'given' and 'to find'.",
          navText: "Tap » to identify 'given' information.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        // Step 1: Comprehend with substeps (Given/To Find) - LeftQuestion component
        1: {
          questionText: "Read the question and identify 'given' and 'to find' in this step.",
          navText: "Tap » to identify 'given' information.",
          navToFind: "Tap » to identify what we need 'to find'.",
          navTextCorrect: "Tap » to continue.",
          isComprehend: true,
          isSubstepComprehend: true,
          hasLeftQuestion: true,
          nextEnabled: false
        },
        // Step 2: Splash screen with question text
        2: {
          questionText: "",
          navText: "Tap » to continue.",
          isSplash: true,
          splashKey: "step2",
          splashWithQuestion: true,
          nextEnabled: true
        },
        // Step 3: MCQ for L-mL relationship
        3: {
          questionTextInitial: "Let's convert each day's purchase and use to mL.",
          navTextInitial: "Tap » to continue.",
          questionText: "Let's understand the relationship between L and mL.",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to continue.",
          isMcqStep: true,
          mcqKey: "relationshipMcq",
          showEmptyFindings: true,
          nextEnabled: false
        },
        // Step 4: Monday conversion - two boxes
        4: {
          questionText: "Let's convert each day's purchase and use to mL.",
          navText: "Use the numpad to fill the boxes click ✓ to check your answer.",
          navTextCorrect: "Tap » to continue.",
          isCalcStep: true,
          calcKey: "calcStep4",
          nextEnabled: false
        },
        // Step 5: Monday result - one box
        5: {
          questionText: "Let's convert each day's purchase and use to mL.",
          navText: "Use the numpad to fill the answer click ✓ to check your answer.",
          navTextCorrect: "Tap » to continue.",
          isCalcStep: true,
          calcKey: "calcStep5",
          continuesFrom: "calcStep4",
          nextEnabled: false
        },
        // Step 6: Tuesday conversion
        6: {
          questionText: "Let's convert each day's purchase and use to mL.",
          navText: "Use the numpad to fill the answer click ✓ to check your answer.",
          navTextCorrect: "Tap » to continue.",
          isCalcStep: true,
          calcKey: "calcStep6",
          nextEnabled: false
        },
        // Step 7: Wednesday conversion
        7: {
          questionText: "Let's convert each day's purchase and use to mL.",
          navText: "Use the numpad to fill the answer click ✓ to check your answer.",
          navTextCorrect: "Tap » to continue.",
          isCalcStep: true,
          calcKey: "calcStep7",
          nextEnabled: false
        },
        // Step 8: Thursday conversion
        8: {
          questionText: "Let's convert each day's purchase and use to mL.",
          navText: "Use the numpad to fill the answer click ✓ to check your answer.",
          navTextCorrect: "Tap » to continue.",
          isCalcStep: true,
          calcKey: "calcStep8",
          nextEnabled: false
        },
        // Step 9: Drag and Drop (Total volume bought)
        9: {
          questionText: "Build a mathematical sentence to find the total volume of juice Olivia bought.",
          navText: "Drag the correct buttons to the correct spot in the sentence.",
          navTextCorrect: "Tap » to continue.",
          isDragDrop: true,
          dragDropKey: "dragDrop1",
          showQuestionInLeft: true,
          nextEnabled: false
        },
        // Step 10: Addition calculation
        10: {
          questionText: "Let's calculate the total volume of juice bought.",
          navText: "Use the numpad to fill the answer click ✓ to check your answer.",
          navTextCorrect: "Tap » to continue.",
          isCalcStep: true,
          calcKey: "calcStep10",
          isAdditionFormat: true,
          showEmptyFindings: true,
          nextEnabled: false
        },
        // Step 11: Drag and Drop (Volume left - subtraction)
        11: {
          questionText: "Build a mathematical sentence to find the volume of juice left.",
          navText: "Drag the correct buttons to the correct spot in the sentence.",
          navTextCorrect: "Tap » to continue.",
          isDragDrop: true,
          dragDropKey: "dragDrop2",
          showQuestionInLeft: true,
          nextEnabled: false
        },
        // Step 12: Subtraction calculation
        12: {
          questionText: "Let's calculate the volume of juice left.",
          navText: "Use the numpad to fill the answer click ✓ to check your answer.",
          navTextCorrect: "Tap » to continue.",
          isCalcStep: true,
          calcKey: "calcStep12",
          isAdditionFormat: true,
          findingsList: ["Total volume of juice bought = 9500 mL"],
          nextEnabled: false
        },
        // Step 13: MCQ + final conversion
        13: {
          questionText: "Convert the volume to liters.",
          navText: "Tap the correct answer.",
          navTextNumpad: "Use the numpad to fill the answer click ✓ to check your answer.",
          navTextCorrect: "Tap » to continue.",
          isCalcStep: true,
          isMcqThenCalc: true,
          mcqKey: "conversionMcq",
          calcKey: "conversionMcq",
          nextEnabled: false
        },
        // Step 14: Final step
        14: {
          questionText: "Activity Completed!",
          navText: "Tap 'Restart' to restart the activity",
          isFinalStep: true,
          nextEnabled: true
        }
      },
      labels: {
        given: "Given",
        toFind: "To Find",
        findings: "Findings",
        unitL: " L ",
        unitMl: " mL",
        altSummaryVisual: "Summary visual",
        altVisualRepresentation: "Visual representation"
      },
    },
  },
  id: {
    app: {
      start_over: "Mulai Ulang",
      
      questionText: "Olivia membeli 3 L 250 mL jus pada hari Senin, 2 L 750 mL pada hari Selasa, dan 3 L 500 mL pada hari Rabu. Dia mengkonsumsi 1 L dan 700 mL pada Kamis sore. Berapa banyak jus yang tersisa?",
      
      comprehend: {
        sectionTitle: "ANALISIS INFORMASI",
        given: {
          title: "Diketahui,",
          data: [
            {
              label: "Volume jus yang dibeli:",
              subitems: [
                "pada Senin = 3 L 250 mL",
                "pada Selasa = 2 L 750 mL",
                "pada Rabu = 3 L 500 mL"
              ]
            },
            {
              label: "Volume jus yang digunakan:",
              subitems: [
                "pada Kamis = 1 L 700 mL"
              ]
            }
          ],
          highlights: [
            "3 L 250 mL jus pada hari Senin",
            "2 L 750 mL pada hari Selasa",
            "3 L 500 mL pada hari Rabu",
            "1 L dan 700 mL pada Kamis"
          ]
        },
        toFind: {
          title: "Ditanyakan",
          data: [
            "Volume jus yang tersisa"
          ],
          highlights: [
            "Berapa banyak jus yang tersisa"
          ]
        },
      },
      
      splash: {
        step2: {
          text: "<blue>✓ Informasi dikumpulkan dari pertanyaan.</blue><br><yellow>Selanjutnya - Mari pahami hubungan antara liter dan mililiter.</yellow>"
        }
      },
      
      relationshipMcq: {
        title: "Pernyataan mana yang benar menunjukkan hubungan antara liter (L) dan mililiter (mL)?",
        options: [
          "1 mL = 1000 L",
          "1 L = 100 mL",
          "1 L = 1000 mL",
          "1 mL = 10 L"
        ],
        answerIndex: 2,
        findingOnCorrect: "1 L = 1000 mL"
      },
      
      dragDrop1: {
        equationLabel: "Total volume jus yang dibeli",
        isVerticalLayout: true,
        dropZones: [
          { id: "zone1", correctAnswers: ["Volume jus yang dibeli pada Senin", "Volume jus yang dibeli pada Selasa", "Volume jus yang dibeli pada Rabu"], placeholder: "Volume jus yang dibeli pada Senin" },
          { id: "zone2", correctAnswer: "+", placeholder: "+" },
          { id: "zone3", correctAnswers: ["Volume jus yang dibeli pada Senin", "Volume jus yang dibeli pada Selasa", "Volume jus yang dibeli pada Rabu"], placeholder: "Volume jus yang dibeli pada Selasa" },
          { id: "zone4", correctAnswer: "+", placeholder: "+" },
          { id: "zone5", correctAnswers: ["Volume jus yang dibeli pada Senin", "Volume jus yang dibeli pada Selasa", "Volume jus yang dibeli pada Rabu"], placeholder: "Volume jus yang dibeli pada Rabu" }
        ],
        draggables: [
          { id: "drag1", text: "Volume jus yang dibeli pada Senin" },
          { id: "drag2", text: "Volume jus yang dibeli pada Selasa" },
          { id: "drag3", text: "Volume jus yang dibeli pada Rabu" },
          { id: "drag4", text: "Volume jus yang digunakan pada Kamis" },
          { id: "drag5", text: "+" },
          { id: "drag6", text: "-" },
          { id: "drag7", text: "×" },
          { id: "drag8", text: "÷" },
          { id: "drag9", text: "+" },
          { id: "drag10", text: "-" }
        ],
        hideFindings: true
      },
      
      dragDrop2: {
        equationLabel: "Volume jus yang tersisa",
        isVerticalLayout: true,
        dropZones: [
          { id: "zone1", correctAnswer: "Total volume jus yang dibeli", placeholder: "Total volume jus yang dibeli" },
          { id: "zone2", correctAnswer: "-", placeholder: "-" },
          { id: "zone3", correctAnswer: "Volume jus yang digunakan pada Kamis", placeholder: "Volume jus yang digunakan pada Kamis" }
        ],
        draggables: [
          { id: "drag1", text: "Volume jus yang dibeli pada Senin" },
          { id: "drag2", text: "Volume jus yang digunakan pada Kamis" },
          { id: "drag3", text: "Total volume jus yang dibeli" },
          { id: "drag4", text: "+" },
          { id: "drag5", text: "-" },
          { id: "drag6", text: "×" },
          { id: "drag7", text: "÷" }
        ],
        hideFindings: true
      },
      
      calcStep3: {
        dayLabel: "Senin:",
        initialLine: "3 L 250 mL = 3 L + 250 mL",
      },
      
      calcStep4: {
        dayLabel: "Senin:",
        initialLine: "3 L 250 mL = 3 L + 250 mL",
        inputLine: "= [box] × 1000 + [box] mL",
        boxes: [
          { answer: "3", maxLength: 1 },
          { answer: "250", maxLength: 3 }
        ]
      },
      
      calcStep5: {
        inputLine: "[box] mL",
        box: { answer: "3250", maxLength: 4 },
        findingOnCorrect: "Volume jus yang dibeli: pada Senin = 3250 mL"
      },
      
      calcStep6: {
        dayLabel: "Selasa:",
        initialLine: "2 L 750 mL = (2 × 1000) + 750",
        inputLine: "= [box] mL",
        box: { answer: "2750", maxLength: 4 },
        findingOnCorrect: "pada Selasa = 2750 mL"
      },
      
      calcStep7: {
        dayLabel: "Rabu:",
        initialLine: "3 L 500 mL = (3 × 1000) + 500",
        inputLine: "= [box] mL",
        box: { answer: "3500", maxLength: 4 },
        findingOnCorrect: "pada Rabu = 3500 mL"
      },
      
      calcStep8: {
        dayLabel: "Kamis:",
        initialLine: "1 L 700 mL = (1 × 1000) + 700",
        inputLine: "= [box] mL",
        box: { answer: "1700", maxLength: 4 },
        findingOnCorrect: "Volume jus yang digunakan pada Kamis = 1700 mL"
      },
      
      calcStep10: {
        label: "Total volume jus yang dibeli",
        values: ["3250 mL", "2750 mL", "3500 mL"],
        operator: "+",
        box: { answer: "9500", maxLength: 5 },
        findingOnCorrect: "Total volume jus yang dibeli = 9500 mL"
      },
      
      calcStep12: {
        label: "Volume jus yang tersisa",
        values: ["9500 mL", "1700 mL"],
        operator: "-",
        box: { answer: "7800", maxLength: 4 }
      },
      
      conversionMcq: {
        title: "Bagaimana cara mengubah 7800 mL ke L?",
        options: [
          "Kalikan nilai dalam mL dengan 10",
          "Kalikan nilai dalam mL dengan 100",
          "Bagi nilai dalam mL dengan 100",
          "Bagi nilai dalam mL dengan 1000"
        ],
        answerIndex: 3,
        firstLine: "Volume jus yang tersisa = 7800 mL",
        postMcqLines: [
          "Volume jus yang tersisa = 7800 mL ÷ 1000",
          "Volume jus yang tersisa = [box] L [box] mL"
        ],
        finalLinePrefix: "Volume jus yang tersisa = ",
        boxes: [
          { answer: "7", maxLength: 1 },
          { answer: "800", maxLength: 3 }
        ]
      },
      
      finalAnswer: "Jadi, volume jus yang tersisa adalah 7 L 800 mL.",
      
      steps: {
        0: {
          questionText: "Baca pertanyaan dan identifikasi 'diketahui' dan 'ditanyakan'.",
          navText: "Ketuk » untuk mengidentifikasi informasi 'diketahui'.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        1: {
          questionText: "Baca pertanyaan dan identifikasi 'diketahui' dan 'ditanyakan' pada langkah ini.",
          navText: "Ketuk » untuk melanjutkan.",
          navToFind: "Ketuk » untuk mengidentifikasi 'ditanyakan'.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          isComprehend: true,
          isSubstepComprehend: true,
          hasLeftQuestion: true,
          nextEnabled: false
        },
        2: {
          questionText: "",
          navText: "Ketuk » untuk melanjutkan.",
          isSplash: true,
          splashKey: "step2",
          splashWithQuestion: true,
          nextEnabled: true
        },
        3: {
          questionTextInitial: "Mari konversi pembelian dan penggunaan setiap hari ke mL.",
          navTextInitial: "Ketuk » untuk melanjutkan.",
          questionText: "Mari pahami hubungan antara L dan mL.",
          navText: "Ketuk jawaban yang benar.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          isMcqStep: true,
          mcqKey: "relationshipMcq",
          showEmptyFindings: true,
          nextEnabled: false
        },
        4: {
          questionText: "Mari konversi pembelian dan penggunaan setiap hari ke mL.",
          navText: "Gunakan numpad untuk mengisi kotak.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          isCalcStep: true,
          calcKey: "calcStep4",
          nextEnabled: false
        },
        5: {
          questionText: "Mari konversi pembelian dan penggunaan setiap hari ke mL.",
          navText: "Gunakan numpad untuk mengisi jawaban.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          isCalcStep: true,
          calcKey: "calcStep5",
          continuesFrom: "calcStep4",
          nextEnabled: false
        },
        6: {
          questionText: "Mari konversi pembelian dan penggunaan setiap hari ke mL.",
          navText: "Gunakan numpad untuk mengisi jawaban.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          isCalcStep: true,
          calcKey: "calcStep6",
          nextEnabled: false
        },
        7: {
          questionText: "Mari konversi pembelian dan penggunaan setiap hari ke mL.",
          navText: "Gunakan numpad untuk mengisi jawaban.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          isCalcStep: true,
          calcKey: "calcStep7",
          nextEnabled: false
        },
        8: {
          questionText: "Mari konversi pembelian dan penggunaan setiap hari ke mL.",
          navText: "Gunakan numpad untuk mengisi jawaban.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          isCalcStep: true,
          calcKey: "calcStep8",
          nextEnabled: false
        },
        9: {
          questionText: "Bangun kalimat matematika untuk menemukan total volume jus yang dibeli Olivia.",
          navText: "Seret tombol yang benar ke tempat yang tepat dalam kalimat.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          isDragDrop: true,
          dragDropKey: "dragDrop1",
          showQuestionInLeft: true,
          nextEnabled: false
        },
        10: {
          questionText: "Mari hitung total volume jus yang dibeli.",
          navText: "Gunakan numpad untuk mengisi jawaban.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          isCalcStep: true,
          calcKey: "calcStep10",
          isAdditionFormat: true,
          showEmptyFindings: true,
          nextEnabled: false
        },
        11: {
          questionText: "Bangun kalimat matematika untuk menemukan volume jus yang tersisa.",
          navText: "Seret tombol yang benar ke tempat yang tepat dalam kalimat.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          isDragDrop: true,
          dragDropKey: "dragDrop2",
          showQuestionInLeft: true,
          nextEnabled: false
        },
        12: {
          questionText: "Mari hitung volume jus yang tersisa.",
          navText: "Gunakan numpad untuk mengisi jawaban.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          isCalcStep: true,
          calcKey: "calcStep12",
          isAdditionFormat: true,
          findingsList: ["Total volume jus yang dibeli = 9500 mL"],
          nextEnabled: false
        },
        13: {
          questionText: "Ubah volume ke liter.",
          navText: "Ketuk jawaban yang benar.",
          navTextNumpad: "Gunakan numpad untuk mengisi jawaban.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          isCalcStep: true,
          isMcqThenCalc: true,
          mcqKey: "conversionMcq",
          calcKey: "conversionMcq",
          nextEnabled: false
        },
        14: {
          questionText: "Aktivitas Selesai!",
          navText: "Ketuk 'Mulai Ulang' untuk memulai kembali aktivitas",
          isFinalStep: true,
          nextEnabled: true
        }
      },
      labels: {
        given: "Diketahui",
        toFind: "Ditanyakan",
        findings: "Temuan",
        unitL: " L ",
        unitMl: " mL",
        altSummaryVisual: "Visual ringkasan",
        altVisualRepresentation: "Representasi visual"
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
