const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

// Master data structure for Milk Cartons Volume Word Problem
const DATA = {
  en: {
    app: {
      start_over: "Restart",

      altMilkCartons: "Milk cartons",
      altSummaryVisual: "Summary visual",
      altVisualRepresentation: "Visual representation",

      // Question text for display
      questionText: "Look at the picture carefully. What is the total volume of the three milk cartons in liters?",

      // Comprehend step data (Step 1)
      comprehend: {
        sectionTitle: "INFORMATION ANALYSIS",
        images: [
          "assets/compre1.png",
          "assets/compre2.png",
          "assets/compre3.png",
          "assets/compre4.png"
        ],
        given: {
          title: "Given,",
          data: [
            "Large milk carton: 1,000 mL",
            "Medium milk carton: 250 mL",
            "Small milk carton: 200 mL"
          ],
          highlights: [null, null, null]
        },
        toFind: {
          title: "To Find",
          data: [
            "Total volume of the three cartons in liters."
          ],
          highlights: [
            "total volume of the three milk cartons in liters"
          ]
        },
      },

      // Splash screens data
      splash: {
        step2: {
          image: "assets/compre4.png",
          text: "<blue>✓ Information gathered from the figure.</blue><br><yellow>Next - Find the total volume of the three milk cartons.</yellow>"
        }
      },

      // Step 3: Drag drop layout with equation-label only (no draggables/dropzones)
      dragDropSetup: {
        equationLabel: "Total volume of milk = Volume of three milk cartons",
        showEquationOnly: true,
        findingsSections: [
          { title: "Given", list: ["Large milk carton: 1,000 mL", "Medium milk carton: 250 mL", "Small milk carton: 200 mL"] },
          { title: "To Find", list: ["Total volume of the three cartons in liters."] }
        ]
      },

      // Step 4: Drag and Drop - equation with two plus dropzones
      dragDrop1: {
        equationLabel: "Total volume of milk = Volume of three milk cartons",
        equationLineFormat: "valuesWithPlusZones", // 1,000 mL [+] 250 mL [+] 200 mL
        fixedParts: ["1,000 mL", "250 mL", "200 mL"],
        dropZones: [
          { id: "zone1", correctAnswer: "+", placeholder: "[+]" },
          { id: "zone2", correctAnswer: "+", placeholder: "[+]" }
        ],
        draggables: [
          { id: "drag1", text: "-" },
          { id: "drag2", text: "+" },
          { id: "drag3", text: "–" },
          { id: "drag4", text: "×" },
          { id: "drag5", text: "÷" },
          { id: "drag6", text: "+" },
          { id: "drag7", text: "-" }
        ],
        findingsTitle: "Given",
        findingsList: [
          "Large milk carton: 1,000 mL",
          "Medium milk carton: 250 mL",
          "Small milk carton: 200 mL"
        ]
      },

      // Calculation data for Steps 5-8 (all strings here so non-coders can edit)
      calculation1: {
        initialEquation: [
          "Total volume of milk = Volume of three milk cartons",
          "Total volume of milk = 1,000 mL + 250 mL + 200 mL",
          "Total volume of milk = [box] mL"
        ],
        numpadRow: {
          prefix: "Total volume of milk = ",
          suffix: " mL"
        },
        numpad: {
          answer: "1450",
          maxLength: 5
        }
      },
      findingsAfterNumpad: ["Total volume of milk = 1450 mL"],
      findingsAfterMcq: ["Total volume of milk = 1450 mL", "1000 mL = 1 L"],
      findingsDefault: ["Total volume of milk = 1450 mL"],
      conversionRow: {
        prefix: "Total volume = ",
        initialBoxLabel: "Volume in mL",
        suffix: " ÷ 1000",
        substitutedValue: "1450 mL"
      },
      conversionResult: {
        line1: "Total volume = 1450 mL ÷ 1000",
        line2Prefix: "Total volume = ",
        line2Highlight: "1.45",
        line2Suffix: " liters"
      },

      // MCQ for step 6 (mL to L conversion)
      conversionMcq: {
        title: "How do we convert mL to L?",
        options: [
          "Multiply the mL value by 1,000",
          "Divide the mL value by 1,000",
          "Multiply the mL value by 100",
          "Divide the mL value by 100"
        ],
        answerIndex: 1
      },

      // Final answer
      finalAnswer: "So, the total volume of the three milk cartons is 1.45 liters.",

      // Steps configuration (steps 0-8)
      steps: {
        0: {
          questionText: "Read the question and identify 'given' and 'to find'.",
          navText: "Tap » to identify 'given' information.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        1: {
          questionText: "Look at the picture carefully. What is the total volume of the three milk cartons in liters?",
          navText: "Tap » to identify 'given' information.",
          navToFind:"Tap » to identify what we need 'to find'",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre1.png",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false
        },
        2: {
          questionText: "",
          navText: "Tap » to continue.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true
        },
        3: {
          questionText: "Set up the equation for total volume of milk.",
          navText: "Tap » to continue.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre4.png",
          isDragDropSetup: true,
          nextEnabled: true
        },
        4: {
          questionText: "Build a mathematical sentence to find the total volume.",
          navText: "Drag the correct buttons to the correct spot in the sentence.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre4.png",
          isDragDrop: true,
          dragDropKey: "dragDrop1",
          nextEnabled: false
        },
        5: {
          questionText: "Let’s find the total volume.",
          navText: "Use the numpad to fill the answer and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre4.png",
          isNumpad: true,
          calcKey: "calc1",
          nextEnabled: false
        },
        6: {
          questionText: "Convert the total volume to liters.",
          navText: "Tap the correct answer.",
          navTextInteractiveBox: "Tap the highlighted box to substitute the value.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre4.png",
          isMcq: true,
          nextEnabled: false
        },
        7: {
          questionText: "Convert the total volume to liters.",
          navText: "Tap » to continue.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre4.png",
          isInteractiveBoxConversion: true,
          nextEnabled: true
        },
        8: {
          questionText: "Activity Completed!",
          navText: "Tap 'Restart' to restart the activity",
          image: "assets/compre4.png",
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
      altMilkCartons: "Karton susu",
      altSummaryVisual: "Visual ringkasan",
      altVisualRepresentation: "Representasi visual",
      questionText: "Lihat gambar dengan saksama. Berapa total volume tiga karton susu dalam liter?",
      comprehend: {
        sectionTitle: "ANALISIS INFORMASI",
        images: ["assets/compre1.png", "assets/compre2.png", "assets/compre3.png", "assets/compre4.png"],
        given: {
          title: "Diketahui,",
          data: ["Karton susu besar: 1.000 mL", "Karton susu sedang: 250 mL", "Karton susu kecil: 200 mL"],
          highlights: [null, null, null]
        },
        toFind: {
          title: "Ditanyakan",
          data: ["Total volume tiga karton dalam liter."],
          highlights: ["total volume tiga karton susu dalam liter"]
        },
      },
      splash: {
        step2: {
          image: "assets/compre4.png",
          text: "<blue>✓ Informasi dikumpulkan dari gambar.</blue><br><yellow>Selanjutnya - Temukan total volume tiga karton susu.</yellow>"
        }
      },
      dragDropSetup: {
        equationLabel: "Total volume susu = Volume tiga karton susu",
        showEquationOnly: true,
        findingsSections: [
          { title: "Diketahui", list: ["Karton susu besar: 1.000 mL", "Karton susu sedang: 250 mL", "Karton susu kecil: 200 mL"] },
          { title: "Ditanyakan", list: ["Total volume tiga karton dalam liter."] }
        ]
      },
      dragDrop1: {
        equationLabel: "Total volume susu = Volume tiga karton susu",
        equationLineFormat: "valuesWithPlusZones",
        fixedParts: ["1.000 mL", "250 mL", "200 mL"],
        dropZones: [
          { id: "zone1", correctAnswer: "+", placeholder: "[+]" },
          { id: "zone2", correctAnswer: "+", placeholder: "[+]" }
        ],
        draggables: [
          { id: "drag1", text: "-" }, { id: "drag2", text: "+" }, { id: "drag3", text: "–" },
          { id: "drag4", text: "×" }, { id: "drag5", text: "÷" }, { id: "drag6", text: "+" }, { id: "drag7", text: "-" }
        ],
        findingsTitle: "Diketahui",
        findingsList: ["Karton susu besar: 1.000 mL", "Karton susu sedang: 250 mL", "Karton susu kecil: 200 mL"]
      },
      calculation1: {
        initialEquation: [
          "Total volume susu = Volume tiga karton susu",
          "Total volume susu = 1.000 mL + 250 mL + 200 mL",
          "Total volume susu = [box] mL"
        ],
        numpadRow: {
          prefix: "Total volume susu = ",
          suffix: " mL"
        },
        numpad: { answer: "1450", maxLength: 5 }
      },
      findingsAfterNumpad: ["Total volume susu = 1450 mL"],
      findingsAfterMcq: ["Total volume susu = 1450 mL", "1000 mL = 1 L"],
      findingsDefault: ["Total volume susu = 1450 mL"],
      conversionRow: {
        prefix: "Total volume = ",
        initialBoxLabel: "Volume dalam mL",
        suffix: " ÷ 1000",
        substitutedValue: "1450 mL"
      },
      conversionResult: {
        line1: "Total volume = 1450 mL ÷ 1000",
        line2Prefix: "Total volume = ",
        line2Highlight: "1.45",
        line2Suffix: " liter"
      },
      conversionMcq: {
        title: "Bagaimana cara mengubah mL ke L?",
        options: [
          "A. Kalikan nilai mL dengan 1.000",
          "B. Bagi nilai mL dengan 1.000",
          "C. Kalikan nilai mL dengan 100",
          "D. Bagi nilai mL dengan 100"
        ],
        answerIndex: 1
      },
      finalAnswer: "Jadi, total volume tiga karton susu adalah 1,45 liter.",
      steps: {
        0: { questionText: "Lihat gambar dengan saksama.", navText: "Ketuk » untuk mengidentifikasi informasi 'diketahui'.", isComprehendQuestion: true, nextEnabled: true, hideVisualPanel: true },
        1: { questionText: "Lihat gambar dengan saksama. Berapa total volume tiga karton susu dalam liter?", navText: "Ketuk » untuk mengidentifikasi informasi 'diketahui'.", navToFind: "Ketuk » untuk mengidentifikasi apa yang perlu 'ditanyakan'.", navTextCorrect: "Ketuk » untuk melanjutkan.", image: "assets/compre1.png", isComprehend: true, isSubstepComprehend: true, nextEnabled: false },
        2: { questionText: "", navText: "Ketuk » untuk melanjutkan.", isSplash: true, splashKey: "step2", nextEnabled: true },
        3: { questionText: "Susun persamaan untuk total volume susu.", navText: "Ketuk » untuk melanjutkan.", navTextCorrect: "Ketuk » untuk melanjutkan.", image: "assets/compre4.png", isDragDropSetup: true, nextEnabled: true },
        4: { questionText: "Lengkapi persamaan dengan menyeret operator yang benar.", navText: "Seret tanda plus ke tempat yang benar.", navTextCorrect: "Ketuk » untuk melanjutkan.", image: "assets/compre4.png", isDragDrop: true, dragDropKey: "dragDrop1", nextEnabled: false },
        5: { questionText: "Temukan total volume susu dalam mililiter.", navText: "Gunakan numpad untuk mengisi jawaban dan klik ✓.", navTextCorrect: "Ketuk » untuk melanjutkan.", image: "assets/compre4.png", isNumpad: true, calcKey: "calc1", nextEnabled: false },
        6: { questionText: "Ubah total volume ke liter.", navText: "Ketuk jawaban yang benar.", navTextInteractiveBox: "Ketuk kotak yang disorot untuk mengganti nilai.", navTextCorrect: "Ketuk » untuk melanjutkan.", image: "assets/compre4.png", isMcq: true, nextEnabled: false },
        7: { questionText: "Selesaikan konversi ke liter.", navText: "Ketuk kotak yang disorot untuk mengganti nilai.", navTextCorrect: "Ketuk » untuk melanjutkan.", image: "assets/compre4.png", isInteractiveBoxConversion: true, nextEnabled: false },
        8: { questionText: "Aktivitas Selesai!", navText: "Ketuk 'Mulai Ulang' untuk memulai kembali", image: "assets/compre4.png", isFinalStep: true, nextEnabled: true }
      },
      labels: { given: "Diketahui", toFind: "Ditanyakan", findings: "Temuan" },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
