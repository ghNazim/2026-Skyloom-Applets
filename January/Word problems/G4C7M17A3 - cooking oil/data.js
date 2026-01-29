const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

// Master data structure for Cooking Oil Word Problem
const DATA = {
  en: {
    app: {
      start_over: "Restart",
      
      // Question text for display
      questionText: "Mother bought several bottles of cooking oil in various sizes. As many as 5 bottles of 20000 cm³ each, 4 bottles of 50000 cm³ each, and 2 bottles of 100000 cm³. All the oil will be transferred to a jerry can with a capacity of 1 m³. How many jerry cans should you prepare?",
      
      // Comprehend step data (Step 1)
      comprehend: {
        sectionTitle: "INFORMATION ANALYSIS",
        images: [
          "assets/compre0.png",
          "assets/compre1.png",
          "assets/compre2.png",
          "assets/compre2.png",
          "assets/compre2.png"
        ],
        given: {
          title: "Given,",
          data: [
            "5 bottles of 20000 cm³",
            "4 bottles of 50000 cm³",
            "2 bottles of 100000 cm³",
            "Capacity of jerry can = 1 m³"
          ],
          highlights: [
            "5 bottles of 20000 cm³ each",
            "4 bottles of 50000 cm³ each",
            "2 bottles of 100000 cm³",
            "capacity of 1 m³"
          ]
        },
        toFind: {
          title: "To Find",
          data: [
            "Number of jerry cans needed"
          ],
          highlights: [
            "How many jerry cans should you prepare"
          ]
        },
      },
      
      // Splash screens data
      splash: {
        step2: {
          image: "assets/compre2.png",
          text: "<blue>✓ Information gathered from the question.</blue><br><yellow>Next - Build a formula to find the number of jerry cans needed.</yellow>"
        }
      },
      
      // Drag and Drop data for Step 3
      dragDrop1: {
        equationLabel: "Number of jerry cans needed",
        dropZones: [
          { id: "zone1", correctAnswer: "Total volume of oil", placeholder: "Total volume of oil" },
          { id: "zone2", correctAnswer: "÷", placeholder: "÷" },
          { id: "zone3", correctAnswer: "Capacity of one jerry can", placeholder: "Capacity of one jerry can" }
        ],
        draggables: [
          { id: "drag1", text: "Capacity of one jerry can" },
          { id: "drag2", text: "Total volume of oil" },
          { id: "drag3", text: "+" },
          { id: "drag4", text: "-" },
          { id: "drag5", text: "×" },
          { id: "drag6", text: "÷" }
        ],
        findingsTitle: "Given",
        findingsList: [
          "5 bottles of 20000 cm³",
          "4 bottles of 50000 cm³",
          "2 bottles of 100000 cm³",
          "Capacity of jerry can = 1 m³"
        ]
      },
      
      // Step 4 data - Show total volume breakdown
      step4Data: {
        equationRows: [
          { type: "label", text: "Number of jerry cans needed" },
          { type: "equation", text: "= Total volume of oil ÷ Capacity of one jerry can", highlight: "Total volume of oil" }
        ],
        volumeBreakdown: {
          label: "Total volume of oil = ",
          items: [
            "  5 bottles of 20000 cm³",
            "+ 4 bottles of 50000 cm³",
            "+ 2 bottles of 100000 cm³"
          ]
        }
      },
      
      // Step 5 data - Calculate total volume
      step5Data: {
        volumeCalculation: {
          label: "Total volume of oil = ",
          items: [
            "100000 cm³",
            "+ 200000 cm³",
            "+ 200000 cm³"
          ]
        },
        numpad: {
          answer: "500000",
          maxLength: 6
        }
      },
      
      // Step 6 data - Convert jerry can volume
      step6Data: {
        equationRows: [
          { type: "label", text: "Number of jerry cans needed" },
          { type: "equation", text: "= Total volume of oil ÷ Capacity of one jerry can", highlight: "Capacity of one jerry can" },
          { type: "info", text: "Capacity of one jerry can = 1 m³" },
          { type: "conversion", text: "1 m³ = ", inputSuffix: " cm³" }
        ],
        numpad: {
          answer: "1000000",
          maxLength: 7
        }
      },
      
      // Step 7 data - Substitute values and calculate
      step7Data: {
        equationRows: [
          { type: "label", text: "Number of jerry cans needed" },
          { type: "equation", text: "= Total volume of oil ÷ Capacity of one jerry can" }
        ],
        interactiveRow: {
          box1ValueInitial: "Total volume of oil",
          box2ValueInitial: "Capacity of one jerry can",
          prefix: "= ",
          box1Value: "500000",
          operator: " ÷ ",
          box2Value: "1000000"
        },
        finalCalculation: {
          prefix: "= "
        },
        numpad: {
          answer: "0.5",
          altAnswer: ".5",
          maxLength: 3,
          showDecimal: true
        }
      },
      
      // Final answer
      finalAnswer: "That means the oil fills half a jerry can, but you still need one jerry can to store it. So, you should prepare one jerry can.",
      
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
        // Step 1: Comprehend with substeps (Given/To Find)
        1: {
          questionText: "Mother bought several bottles of cooking oil in various sizes. As many as 5 bottles of 20000 cm³ each, 4 bottles of 50000 cm³ each, and 2 bottles of 100000 cm³. All the oil will be transferred to a jerry can with a capacity of 1 m³. How many jerry cans should you prepare?",
          navText: "Tap » to continue.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre0.png",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false,
          smallerFont: true
        },
        // Step 2: Splash screen
        2: {
          questionText: "",
          navText: "Tap » to continue.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true
        },
        // Step 3: Drag and Drop
        3: {
          questionText: "Build a mathematical sentence to find the number of jerry cans needed.",
          navText: "Drag the correct buttons to the correct spot in the sentence.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre2.png",
          isDragDrop: true,
          dragDropKey: "dragDrop1",
          nextEnabled: false
        },
        // Step 4: Show volume breakdown (no interaction)
        4: {
          questionText: "Let's first find the total volume of oil.",
          navText: "Tap » to continue.",
          image: "assets/compre2.png",
          isStep4Calc: true,
          nextEnabled: true
        },
        // Step 5: Calculate total volume with numpad
        5: {
          questionText: "Calculate the total volume of oil.",
          navText: "Use the numpad to fill the answer and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre2.png",
          isStep5Calc: true,
          nextEnabled: false
        },
        // Step 6: Convert jerry can volume
        6: {
          questionText: "Convert jerry can volume to cm³.",
          navText: "Use the numpad to fill the answer and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          isStep6Calc: true,
          nextEnabled: false
        },
        // Step 7: Substitute values and calculate
        7: {
          questionText: "Now, let's substitute the given values in the formula.",
          questionTextAfterBoxes: "Let's find the number of jerry cans needed.",
          navText: "Tap the highlighted boxes to substitute the values.",
          navTextAfterBoxes: "Use the numpad to fill the answer and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          isStep7Calc: true,
          nextEnabled: false
        },
        // Step 8: Final step
        8: {
          questionText: "Activity Completed!",
          navText: "Tap 'Restart' to restart the activity",
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
      
      questionText: "Ibu membeli beberapa botol minyak goreng dalam berbagai ukuran. Sebanyak 5 botol berukuran 20000 cm³, 4 botol berukuran 50000 cm³, dan 2 botol berukuran 100000 cm³. Semua minyak akan dipindahkan ke jerigen dengan kapasitas 1 m³. Berapa jerigen yang harus disiapkan?",
      
      comprehend: {
        sectionTitle: "ANALISIS INFORMASI",
        images: [
          "assets/compre0.png",
          "assets/compre1.png",
          "assets/compre2.png",
          "assets/compre2.png",
          "assets/compre2.png"
        ],
        given: {
          title: "Diketahui,",
          data: [
            "5 botol berukuran 20000 cm³",
            "4 botol berukuran 50000 cm³",
            "2 botol berukuran 100000 cm³",
            "Kapasitas jerigen = 1 m³"
          ],
          highlights: [
            "5 botol berukuran 20000 cm³",
            "4 botol berukuran 50000 cm³",
            "2 botol berukuran 100000 cm³",
            "kapasitas 1 m³"
          ]
        },
        toFind: {
          title: "Ditanyakan",
          data: [
            "Jumlah jerigen yang dibutuhkan"
          ],
          highlights: [
            "Berapa jerigen yang harus disiapkan"
          ]
        },
      },
      
      splash: {
        step2: {
          image: "assets/compre2.png",
          text: "<blue>✓ Informasi dikumpulkan dari pertanyaan.</blue><br><yellow>Selanjutnya - Buat rumus untuk menemukan jumlah jerigen yang dibutuhkan.</yellow>"
        }
      },
      
      dragDrop1: {
        equationLabel: "Jumlah jerigen yang dibutuhkan",
        dropZones: [
          { id: "zone1", correctAnswer: "Total volume minyak", placeholder: "Total volume minyak" },
          { id: "zone2", correctAnswer: "÷", placeholder: "÷" },
          { id: "zone3", correctAnswer: "Kapasitas satu jerigen", placeholder: "Kapasitas satu jerigen" }
        ],
        draggables: [
          { id: "drag1", text: "Kapasitas satu jerigen" },
          { id: "drag2", text: "Total volume minyak" },
          { id: "drag3", text: "+" },
          { id: "drag4", text: "-" },
          { id: "drag5", text: "×" },
          { id: "drag6", text: "÷" }
        ],
        findingsTitle: "Diketahui",
        findingsList: [
          "5 botol berukuran 20000 cm³",
          "4 botol berukuran 50000 cm³",
          "2 botol berukuran 100000 cm³",
          "Kapasitas jerigen = 1 m³"
        ]
      },
      
      step4Data: {
        equationRows: [
          { type: "label", text: "Jumlah jerigen yang dibutuhkan" },
          { type: "equation", text: "= Total volume minyak ÷ Kapasitas satu jerigen", highlight: "Total volume minyak" }
        ],
        volumeBreakdown: {
          label: "Total volume minyak = ",
          items: [
            "5 botol × 20000 cm³",
            "+ 4 botol × 50000 cm³",
            "+ 2 botol × 100000 cm³"
          ]
        }
      },
      
      step5Data: {
        volumeCalculation: {
          label: "Total volume minyak = ",
          items: [
            "100000 cm³",
            "+ 200000 cm³",
            "+ 200000 cm³"
          ]
        },
        numpad: {
          answer: "500000",
          maxLength: 6
        }
      },
      
      step6Data: {
        equationRows: [
          { type: "label", text: "Jumlah jerigen yang dibutuhkan" },
          { type: "equation", text: "= Total volume minyak ÷ Kapasitas satu jerigen", highlight: "Kapasitas satu jerigen" },
          { type: "info", text: "Kapasitas satu jerigen = 1 m³" },
          { type: "conversion", text: "1 m³ = ", inputSuffix: " cm³" }
        ],
        numpad: {
          answer: "1000000",
          maxLength: 7
        }
      },
      
      step7Data: {
        equationRows: [
          { type: "label", text: "Jumlah jerigen yang dibutuhkan" },
          { type: "equation", text: "= Total volume minyak ÷ Kapasitas satu jerigen" }
        ],
        interactiveRow: {
          prefix: "= ",
          box1Value: "500000",
          operator: " ÷ ",
          box2Value: "1000000"
        },
        finalCalculation: {
          prefix: "= "
        },
        numpad: {
          answer: "0,5",
          altAnswer: ",5",
          maxLength: 3,
          showDecimal: true
        }
      },
      
      finalAnswer: "Artinya minyak mengisi setengah jerigen, tetapi Anda tetap membutuhkan satu jerigen untuk menyimpannya. Jadi, Anda harus menyiapkan satu jerigen.",
      
      steps: {
        0: {
          questionText: "Baca pertanyaan dan identifikasi 'diketahui' dan 'ditanyakan'.",
          navText: "Ketuk » untuk mengidentifikasi informasi 'diketahui'.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        1: {
          questionText: "Ibu membeli beberapa botol minyak goreng dalam berbagai ukuran. Sebanyak 5 botol berukuran 20000 cm³, 4 botol berukuran 50000 cm³, dan 2 botol berukuran 100000 cm³. Semua minyak akan dipindahkan ke jerigen dengan kapasitas 1 m³. Berapa jerigen yang harus disiapkan?",
          navText: "Ketuk » untuk melanjutkan.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compre0.png",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false,
          smallerFont: true
        },
        2: {
          questionText: "",
          navText: "Ketuk » untuk melanjutkan.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true
        },
        3: {
          questionText: "Bangun kalimat matematika untuk menemukan jumlah jerigen yang dibutuhkan.",
          navText: "Seret tombol yang benar ke tempat yang tepat dalam kalimat.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compre2.png",
          isDragDrop: true,
          dragDropKey: "dragDrop1",
          nextEnabled: false
        },
        4: {
          questionText: "Mari pertama temukan total volume minyak.",
          navText: "Ketuk » untuk melanjutkan.",
          image: "assets/compre2.png",
          isStep4Calc: true,
          nextEnabled: true
        },
        5: {
          questionText: "Hitung total volume minyak.",
          navText: "Gunakan numpad untuk mengisi jawaban dan klik ✓ untuk memeriksa.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compre2.png",
          isStep5Calc: true,
          nextEnabled: false
        },
        6: {
          questionText: "Ubah volume jerigen ke cm³.",
          navText: "Gunakan numpad untuk mengisi jawaban dan klik ✓ untuk memeriksa.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          isStep6Calc: true,
          nextEnabled: false
        },
        7: {
          questionText: "Sekarang, mari substitusi nilai yang diberikan ke dalam rumus.",
          questionTextAfterBoxes: "Mari temukan jumlah jerigen yang dibutuhkan.",
          navText: "Ketuk kotak yang disorot untuk mensubstitusi nilai.",
          navTextAfterBoxes: "Gunakan numpad untuk mengisi jawaban dan klik ✓ untuk memeriksa.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          isStep7Calc: true,
          nextEnabled: false
        },
        8: {
          questionText: "Aktivitas Selesai!",
          navText: "Ketuk 'Mulai Ulang' untuk memulai kembali aktivitas",
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
