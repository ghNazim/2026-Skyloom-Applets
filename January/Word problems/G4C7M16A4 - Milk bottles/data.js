const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

// Master data structure for Milk Bottles Word Problem
const DATA = {
  en: {
    app: {
      start_over: "Restart",
      
      // Question text for display
      questionText: "In the refrigerator, there are 17 bottles of milk of 500 mL each. The milk will be poured evenly into 5 big bottles for a party. How many liters of milk will be in each big bottle?",
      
      // Comprehend step data (Step 1)
      comprehend: {
        sectionTitle: "INFORMATION ANALYSIS",
        images: [
          "assets/compre0.png",
          "assets/compre1.png",
          "assets/compre2.png",
          "assets/compre3.png"
        ],
        given: {
          title: "Given,",
          data: [
            "Number of bottles = 17",
            "Volume of milk in each bottle = 500 mL",
            "Number of big bottles = 5"
          ],
          highlights: [
            "there are 17 bottles",
            "of 500 mL each.",
            "into 5 big bottles"
          ]
        },
        toFind: {
          title: "To Find",
          data: [
            "Volume of milk (in L) in each big bottle"
          ],
          highlights: [
            "How many liters of milk will be in each big bottle"
          ]
        },
      },
      
      // Splash screens data
      splash: {
        step2: {
          image: "assets/compre4.png",
          text: "<blue>✓ Information gathered from the figure.</blue><br><yellow>Next - Find the total amount of milk in 17 small bottles.</yellow>"
        }
      },
      
      // Drag and Drop data for Step 3 (First calculation - Total volume)
      dragDrop1: {
        equationLabel: "Total volume of milk in the small bottles",
        dropZones: [
          { id: "zone1", correctAnswers: ["Number of small bottles", "Volume of milk in each bottle"], placeholder: "Number of small bottles" },
          { id: "zone2", correctAnswer: "×", placeholder: "×" },
          { id: "zone3", correctAnswers: ["Number of small bottles", "Volume of milk in each bottle"], placeholder: "Volume of milk in each bottle" }
        ],
        draggables: [
          { id: "drag1", text: "Number of small bottles" },
          { id: "drag2", text: "Volume of milk in each bottle" },
          { id: "drag3", text: "+" },
          { id: "drag4", text: "-" },
          { id: "drag5", text: "×" },
          { id: "drag6", text: "÷" }
        ],
        findingsTitle: "Given",
        findingsList: [
          "Number of bottles = 17",
          "Volume of milk in each bottle = 500 mL",
          "Number of big bottles = 5"
        ]
      },
      
      // Drag and Drop data for Step 6 (Second calculation - Volume per big bottle)
      dragDrop2: {
        equationLabel: "Volume of milk in each big bottle",
        dropZones: [
          { id: "zone1", correctAnswer: "Total volume of milk", placeholder: "Total volume of milk" },
          { id: "zone2", correctAnswer: "÷", placeholder: "÷" },
          { id: "zone3", correctAnswer: "Number of big bottles", placeholder: "Number of big bottles" }
        ],
        draggables: [
          { id: "drag1", text: "Number of small bottles" },
          { id: "drag2", text: "Total volume of milk" },
          { id: "drag3", text: "Number of big bottles" },
          { id: "drag4", text: "+" },
          { id: "drag5", text: "-" },
          { id: "drag6", text: "×" },
          { id: "drag7", text: "÷" }
        ],
        findingsTitle: "Findings",
        findingsList: [
          "Total volume of milk in the small bottles = 8500 mL"
        ]
      },
      
      // Calculation data for Steps 4-5 (First calculation)
      calculation1: {
        initialEquation: [
          "Total volume of milk in the small bottles",
          "= Number of small bottles × Volume of milk in each bottle"
        ],
        values: {
          initialBox1: "Number of small bottles",
          initialBox2: "Volume of milk in each bottle",
          smallBottleCount: "17",
          eachVolume: "500 mL"
        },
        inputBoxes: [
          { answer: "17", placeholder: "Number of small bottles", unit: "" },
          { answer: "500", placeholder: "Volume (mL) in each bottle", unit: "mL" }
        ],
        numpad: {
          answer: "8500",
          maxLength: 5
        },
        findings: {
          totalVolume: "Total volume of milk in the small bottles = 8500 mL"
        }
      },
      
      // Calculation data for Steps 7-8 (Second calculation)
      calculation2: {
        initialEquation: [
          "Volume of milk in each big bottle",
          "= Total volume of milk ÷ Number of big bottles"
        ],
        values: {
          initialBox1: "Total volume of milk",
          initialBox2: "Number of big bottles",
          totalVolume: "8500 mL",
          bigBottleCount: "5"
        },
        inputBoxes: [
          { answer: "8500", placeholder: "Total volume (mL)", unit: "mL" },
          { answer: "5", placeholder: "Number of big bottles", unit: "" }
        ],
        numpad: {
          answer: "1700",
          maxLength: 4
        },
        findings: {
          volumePerBottle: "Volume of milk in each big bottle = 1700 mL"
        }
      },
      
      // MCQ for step 9 (conversion)
      conversionMcq: {
        title: "How will you convert 1700 mL to L?",
        options: [
          "Multiply the value in mL by 10",
          "Multiply the value in mL by 100",
          "Divide the value in mL by 100",
          "Divide the value in mL by 1000"
        ],
        answerIndex: 3,
        conversionFinding: "1000 mL = 1 L"
      },
      
      // Calculation display strings
      calculation: {
        units: {
          mL: "mL",
          L: "L"
        },
        rows: {
          calc1Label: "Total volume of milk in the small bottles",
          calc1Equation: "= Number of small bottles × Volume of milk in each bottle",
          calc2Label: "Volume of milk in each big bottle",
          calc2Equation: "= Total volume of milk ÷ Number of big bottles",
          calc2FinalLabel: "Volume of milk (in L) in each big bottle",
          summaryRow: "Volume of milk in each big bottle = 1700 mL",
          conversionRow: "= (1700 ÷ 1000) L",
          finalResult: "= 1.7 L"
        },
        altTexts: {
          milkBottles: "Milk bottles"
        }
      },
      
      // Final answer
      finalAnswer: "So, each big bottle will have 1.7 liters of milk.",
      
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
          questionText: "In the refrigerator, there are 17 bottles of milk of 500 mL each. The milk will be poured evenly into 5 big bottles for a party. How many liters of milk will be in each big bottle?",
          navText: "Tap » to identify 'given' information.",
          navToFind:"Tap » to identify what we need 'to find'.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre0.png",
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
        // Step 3: Drag and Drop (First calculation setup)
        3: {
          questionText: "Build a mathematical sentence to find the total volume of milk.",
          navText: "Drag the correct buttons to the correct spot in the sentence.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compute1.png",
          isDragDrop: true,
          dragDropKey: "dragDrop1",
          nextEnabled: false
        },
        // Step 4: Numpad input boxes (First calculation - two values)
        4: {
          questionText: "Let's find the required volume.",
          navText: "Use the numpad to fill the first box and click ✓ to check.",
          navTextSecondBox: "Use the numpad to fill the second box and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compute1.png",
          isInteractiveBoxes: true,
          calcKey: "calc1",
          nextEnabled: false
        },
        // Step 5: Numpad (First calculation result)
        5: {
          questionText: "Let's find the required volume.",
          navText: "Use the numpad to fill the answer and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compute1.png",
          isNumpad: true,
          calcKey: "calc1",
          nextEnabled: false
        },
        // Step 6: Drag and Drop (Second calculation setup)
        6: {
          questionText: "Build a mathematical sentence to find the volume in each big bottle.",
          navText: "Drag the correct buttons to the correct spot in the sentence.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compute2.png",
          isDragDrop: true,
          dragDropKey: "dragDrop2",
          nextEnabled: false
        },
        // Step 7: Numpad input boxes (Second calculation - two values)
        7: {
          questionText: "Let's find the volume of milk in each big bottle.",
          navText: "Use the numpad to fill the first box and click ✓ to check.",
          navTextSecondBox: "Use the numpad to fill the second box and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compute2.png",
          isInteractiveBoxes: true,
          calcKey: "calc2",
          nextEnabled: false
        },
        // Step 8: Numpad (Second calculation result)
        8: {
          questionText: "Let's find the volume of milk in each big bottle.",
          navText: "Use the numpad to fill the answer and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compute2.png",
          isNumpad: true,
          calcKey: "calc2",
          nextEnabled: false
        },
        // Step 9: MCQ for conversion
        9: {
          questionText: "Convert the volume to liters.",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compute2.png",
          isMcq: true,
          nextEnabled: false
        },
        // Step 10: Final step
        10: {
          questionText: "Activity Completed!",
          navText: "Tap 'Restart' to restart the activity",
          image: "assets/compute2Final.png",
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
      
      questionText: "Di dalam lemari es, terdapat 17 botol susu masing-masing 500 mL. Susu akan dituang secara merata ke dalam 5 botol besar untuk pesta. Berapa liter susu yang akan ada di setiap botol besar?",
      
      comprehend: {
        sectionTitle: "ANALISIS INFORMASI",
        images: [
          "assets/compre0.png",
          "assets/compre1.png",
          "assets/compre2.png",
          "assets/compre3.png"
        ],
        given: {
          title: "Diketahui,",
          data: [
            "Jumlah botol = 17",
            "Volume susu di setiap botol = 500 mL",
            "Jumlah botol besar = 5"
          ],
          highlights: [
            " terdapat 17 botol",
            " masing-masing 500 mL.",
            " ke dalam 5 botol besar"
          ]
        },
        toFind: {
          title: "Ditanyakan",
          data: [
            "Volume susu (dalam L) di setiap botol besar"
          ],
          highlights: [
            " Berapa liter susu yang akan ada di setiap botol besar"
          ]
        },
      },
      
      splash: {
        step2: {
          image: "assets/compre3.png",
          text: "<blue>✓ Informasi dikumpulkan dari gambar.</blue><br><yellow>Selanjutnya - Temukan total jumlah susu dalam 17 botol kecil.</yellow>"
        }
      },
      
      dragDrop1: {
        equationLabel: "Total volume susu dalam botol kecil",
        dropZones: [
          { id: "zone1", correctAnswers: ["Jumlah botol kecil", "Volume susu di setiap botol"], placeholder: "Jumlah botol kecil" },
          { id: "zone2", correctAnswer: "×", placeholder: "×" },
          { id: "zone3", correctAnswers: ["Jumlah botol kecil", "Volume susu di setiap botol"], placeholder: "Volume susu di setiap botol" }
        ],
        draggables: [
          { id: "drag1", text: "Jumlah botol kecil" },
          { id: "drag2", text: "Volume susu di setiap botol" },
          { id: "drag3", text: "+" },
          { id: "drag4", text: "-" },
          { id: "drag5", text: "×" },
          { id: "drag6", text: "÷" }
        ],
        findingsTitle: "Diketahui",
        findingsList: [
          "Jumlah botol = 17",
          "Volume susu di setiap botol = 500 mL",
          "Jumlah botol besar = 5"
        ]
      },
      
      dragDrop2: {
        equationLabel: "Volume susu di setiap botol besar",
        dropZones: [
          { id: "zone1", correctAnswer: "Total volume susu", placeholder: "Total volume susu" },
          { id: "zone2", correctAnswer: "÷", placeholder: "÷" },
          { id: "zone3", correctAnswer: "Jumlah botol besar", placeholder: "Jumlah botol besar" }
        ],
        draggables: [
          { id: "drag1", text: "Jumlah botol kecil" },
          { id: "drag2", text: "Total volume susu" },
          { id: "drag3", text: "Jumlah botol besar" },
          { id: "drag4", text: "+" },
          { id: "drag5", text: "-" },
          { id: "drag6", text: "×" },
          { id: "drag7", text: "÷" }
        ],
        findingsTitle: "Temuan",
        findingsList: [
          "Total volume susu dalam botol kecil = 8500 mL"
        ]
      },
      
      calculation1: {
        initialEquation: [
          "Total volume susu dalam botol kecil",
          "= Jumlah botol kecil × Volume susu di setiap botol"
        ],
        values: {
          initialBox1: "Jumlah botol kecil",
          initialBox2: "Volume susu di setiap botol",
          smallBottleCount: "17",
          eachVolume: "500 mL"
        },
        inputBoxes: [
          { answer: "17", placeholder: "Jumlah botol kecil", unit: "" },
          { answer: "500", placeholder: "Volume (mL) di setiap botol", unit: "mL" }
        ],
        numpad: {
          answer: "8500",
          maxLength: 5
        },
        findings: {
          totalVolume: "Total volume susu dalam botol kecil = 8500 mL"
        }
      },
      
      calculation2: {
        initialEquation: [
          "Volume susu di setiap botol besar",
          "= Total volume susu ÷ Jumlah botol besar"
        ],
        values: {
          initialBox1: "Total volume susu",
          initialBox2: "Jumlah botol besar",
          totalVolume: "8500 mL",
          bigBottleCount: "5"
        },
        inputBoxes: [
          { answer: "8500", placeholder: "Total volume (mL)", unit: "mL" },
          { answer: "5", placeholder: "Jumlah botol besar", unit: "" }
        ],
        numpad: {
          answer: "1700",
          maxLength: 4
        },
        findings: {
          volumePerBottle: "Volume susu di setiap botol besar = 1700 mL"
        }
      },
      
      conversionMcq: {
        title: "Bagaimana cara mengubah 1700 mL ke L?",
        options: [
          "Kalikan nilai dalam mL dengan 10",
          "Kalikan nilai dalam mL dengan 100",
          "Bagi nilai dalam mL dengan 100",
          "Bagi nilai dalam mL dengan 1000"
        ],
        answerIndex: 3,
        conversionFinding: "1000 mL = 1 L"
      },
      
      // Calculation display strings
      calculation: {
        units: {
          mL: "mL",
          L: "L"
        },
        rows: {
          calc1Label: "Total volume susu dalam botol kecil",
          calc1Equation: "= Jumlah botol kecil × Volume susu di setiap botol",
          calc2Label: "Volume susu di setiap botol besar",
          calc2Equation: "= Total volume susu ÷ Jumlah botol besar",
          calc2FinalLabel: "Volume susu (dalam L) di setiap botol besar",
          summaryRow: "Volume susu di setiap botol besar = 1700 mL",
          conversionRow: "= (1700 ÷ 1000) L",
          finalResult: "= 1,7 L"
        },
        altTexts: {
          milkBottles: "Botol susu"
        }
      },
      
      finalAnswer: "Jadi, setiap botol besar akan memiliki 1,7 liter susu.",
      
      steps: {
        0: {
          questionText: "Baca pertanyaan dan identifikasi 'diketahui' dan 'ditanyakan'.",
          navText: "Ketuk » untuk mengidentifikasi informasi 'diketahui'.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        1: {
          questionText: "Di dalam lemari es, terdapat 17 botol susu masing-masing 500 mL. Susu akan dituang secara merata ke dalam 5 botol besar untuk pesta. Berapa liter susu yang akan ada di setiap botol besar?",
          navText: "Ketuk » untuk melanjutkan.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compre0.png",
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
          questionText: "Bangun kalimat matematika untuk menemukan total volume susu.",
          navText: "Seret tombol yang benar ke tempat yang tepat dalam kalimat.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compute1.png",
          isDragDrop: true,
          dragDropKey: "dragDrop1",
          nextEnabled: false
        },
        4: {
          questionText: "Mari temukan volume yang diperlukan.",
          navText: "Gunakan numpad untuk mengisi kotak pertama dan klik ✓ untuk memeriksa.",
          navTextSecondBox: "Gunakan numpad untuk mengisi kotak kedua dan klik ✓ untuk memeriksa.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compute1.png",
          isInteractiveBoxes: true,
          calcKey: "calc1",
          nextEnabled: false
        },
        5: {
          questionText: "Mari temukan volume yang diperlukan.",
          navText: "Gunakan numpad untuk mengisi jawaban dan klik ✓ untuk memeriksa.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compute1.png",
          isNumpad: true,
          calcKey: "calc1",
          nextEnabled: false
        },
        6: {
          questionText: "Bangun kalimat matematika untuk menemukan volume di setiap botol besar.",
          navText: "Seret tombol yang benar ke tempat yang tepat dalam kalimat.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compute2.png",
          isDragDrop: true,
          dragDropKey: "dragDrop2",
          nextEnabled: false
        },
        7: {
          questionText: "Mari temukan volume susu di setiap botol besar.",
          navText: "Gunakan numpad untuk mengisi kotak pertama dan klik ✓ untuk memeriksa.",
          navTextSecondBox: "Gunakan numpad untuk mengisi kotak kedua dan klik ✓ untuk memeriksa.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compute2.png",
          isInteractiveBoxes: true,
          calcKey: "calc2",
          nextEnabled: false
        },
        8: {
          questionText: "Mari temukan volume susu di setiap botol besar.",
          navText: "Gunakan numpad untuk mengisi jawaban dan klik ✓ untuk memeriksa.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compute2.png",
          isNumpad: true,
          calcKey: "calc2",
          nextEnabled: false
        },
        9: {
          questionText: "Ubah volume ke liter.",
          navText: "Ketuk jawaban yang benar.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compute2.png",
          isMcq: true,
          nextEnabled: false
        },
        10: {
          questionText: "Aktivitas Selesai!",
          navText: "Ketuk 'Mulai Ulang' untuk memulai kembali aktivitas",
          image: "assets/compute2Final.png",
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
