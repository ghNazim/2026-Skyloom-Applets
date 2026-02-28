// const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

// Master data structure for Rice Field Word Problem
const DATA = {
  en: {
    app: {
      start_over: "Restart",
      
      // Question text for display
      questionText: "Pak Ahmad has a rice field in Cianjur. The length of the field is 25 meters and its width is 15 meters. What is the total area his rice field?",
      
      // Comprehend step data (Step 1)
      comprehend: {
        sectionTitle: "INFORMATION ANALYSIS",
        images: [
          "assets/compre1.svg",
          "assets/compre2.svg",
          "assets/compre3.svg",
          "assets/compre4.svg"
        ],
        given: {
          title: "Given:",
          data: [
            "A rice field in Cianjur.",
            "Length of the field = 25 m",
            "Width of the field = 15 m"
          ],
          highlights: [
            "rice field in Cianjur.",
            "The length of the field is 25 meters",
            "its width is 15 meters"
          ]
        },
        toFind: {
          title: "To Find:",
          data: [
            "Area of the field"
          ],
          highlights: [
            "What is the total area his rice field"
          ]
        },
      },
      
      // Splash screens data
      splash: {
        step2: {
          image: "assets/compre4.svg",
          text: "<blue>✓ Information gathered from the figure.</blue><br><yellow>Next - Identify what the area of the rice field represents.</yellow>"
        }
      },
      
      // MCQ data for Step 3
      mcq: {
        title: "What does the area of the rice field represent?",
        options: [
          "The area of a rectangle",
          "The perimeter of the rectangle",
          "The perimeter of a square",
          "The perimeter of a rectangle"
        ],
        answerIndex: 0,
        findingsTitle: "Given",
        findingsList: [
          "A rice field in Cianjur.",
          "Length of the field = 25 m",
          "Width of the field = 15 m"
        ]
      },
      
      // Drag and Drop data for Step 4
      dragDrop1: {
        equationLabel: "Area of the field",
        dropZones: [
          { id: "zone1", correctAnswer: "Area of the field", placeholder: "Area of the field" },
          { id: "zone2", correctAnswer: "=", placeholder: "=", isStatic: true },
          { id: "zone3", correctAnswers: ["Length", "Breadth"], placeholder: "Length" },
          { id: "zone4", correctAnswer: "×", placeholder: "×" },
          { id: "zone5", correctAnswers: ["Length", "Breadth"], placeholder: "Breadth" }
        ],
        draggables: [
          { id: "drag1", text: "Area of the field" },
          { id: "drag2", text: "Length" },
          { id: "drag3", text: "Breadth" },
          { id: "drag4", text: "-" },
          { id: "drag5", text: "+" },
          { id: "drag6", text: "×" },
          { id: "drag7", text: "÷" }
        ],
        findingsTitle: "Given",
        findingsList: [
          "A rice field in Cianjur.",
          "Length of the field = 25 m",
          "Width of the field = 15 m"
        ]
      },
      
      
      // Calculation data for Steps 5-6
      calculation1: {
        initialEquation: [
          "Area of the field = [[Length]] × [[Breadth]]"
        ],
        values: {
          initialBox1: "Length",
          initialBox2: "Breadth",
          lengthFinal: "25 m",
          breadthFinal: "15 m"
        },
        inputBoxes: [
          { answer: "25", placeholder: "Length", unit: " m" },
          { answer: "15", placeholder: "Breadth", unit: " m" }
        ],
        numpad: {
          answer: "375",
          maxLength: 4,
          unit: " m²"
        },
        findings: {
          areaFinding: "Area of the field = Area of Rectangle"
        }
      },
      
      
      // Calculation display strings
      calculation: {
        units: {
          m: "m",
          "m²": "m²"
        },
        rows: {
          calc1Label: "Area of the field",
          calc1Equation: "= Length × Breadth",
          finalResult: "Area of Pak Ahmad's rice field = 375 m²"
        },
        altTexts: {
          riceField: "Rice field"
        }
      },
      
      // Final answer
      finalAnswer: "Area of Pak Ahmad's rice field = 375 m²",
      
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
          questionText: "Pak Ahmad has a rice field in Cianjur. The length of the field is 25 meters and\n its width is 15 meters. What is the total area his rice field?",
          navText: "Tap » to identify 'given' information.",
          navToFind:"Tap » to identify what we need 'to find'.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre1.svg",
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
        // Step 3: MCQ step
        3: {
          questionText: "What does the area of the rice field represent?",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre4.svg",
          isMcq: true,
          nextEnabled: false
        },
        // Step 4: Drag and Drop
        4: {
          questionText: "Build a mathematical sentence to find the area of the field.",
          navText: "Drag the correct buttons to the correct spot in the sentence.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre4.svg",
          isDragDrop: true,
          dragDropKey: "dragDrop1",
          nextEnabled: false
        },
        // Step 5: Calculation step with interactive boxes
        5: {
          questionText: "Let's find the area of the field.",
          navText: "Tap the highlighted box.",
          navTextSecondBox: "Tap the highlighted box.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre4.svg",
          isInteractiveBoxes: true,
          calcKey: "calc1",
          nextEnabled: false
        },
        // Step 6: Numpad step
        6: {
          questionText: "Let's find the area of the field.",
          navText: "Use the numpad to fill the answer and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre4.svg",
          isNumpad: true,
          calcKey: "calc1",
          nextEnabled: false
        },
        // Step 7: Final step
        7: {
          questionText: "Activity Completed!",
          navText: "Tap 'Restart' to restart the activity",
          image: "assets/compre4.svg",
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
      
      questionText: "Pak Ahmad memiliki sawah di Cianjur. Panjang sawah adalah 25 meter dan lebarnya adalah 15 meter. Berapa total luas sawahnya?",
      
      comprehend: {
        sectionTitle: "ANALISIS INFORMASI",
        images: [
          "assets/compre1.svg",
          "assets/compre2.svg",
          "assets/compre3.svg",
          "assets/compre4id.svg"
        ],
        given: {
          title: "Diketahui -",
          data: [
            "Sawah di Cianjur.",
            "Panjang sawah = 25 m",
            "Lebar sawah = 15 m"
          ],
          highlights: [
            "sawah di Cianjur.",
            "Panjang sawah adalah 25 meter",
            "lebarnya adalah 15 meter"
          ]
        },
        toFind: {
          title: "Ditanyakan -",
          data: [
            "Luas sawah"
          ],
          highlights: [
            "Berapa total luas sawahnya"
          ]
        },
      },
      
      splash: {
        step2: {
          image: "assets/compre4id.svg",
          text: "<blue>✓ Informasi dikumpulkan dari gambar.</blue><br><yellow>Selanjutnya - Identifikasi apa yang diwakili oleh luas sawah.</yellow>"
        }
      },
      
      // MCQ data for Step 3
      mcq: {
        title: "Apa yang diwakili oleh luas sawah?",
        options: [
          "Luas persegi panjang",
          "Keliling persegi panjang",
          "Keliling persegi",
          "Keliling persegi panjang"
        ],
        answerIndex: 0,
        findingsTitle: "Diketahui",
        findingsList: [
          "Sawah di Cianjur.",
          "Panjang sawah = 25 m",
          "Lebar sawah = 15 m"
        ]
      },
      
      dragDrop1: {
        equationLabel: "Luas sawah",
        dropZones: [
          { id: "zone1", correctAnswer: "Luas sawah", placeholder: "Luas sawah" },
          { id: "zone2", correctAnswer: "=", placeholder: "=", isStatic: true },
          { id: "zone3", correctAnswers: ["Panjang", "Lebar"], placeholder: "Panjang" },
          { id: "zone4", correctAnswer: "×", placeholder: "×" },
          { id: "zone5", correctAnswers: ["Panjang", "Lebar"], placeholder: "Lebar" }
        ],
        draggables: [
          { id: "drag1", text: "Luas sawah" },
          { id: "drag2", text: "Panjang" },
          { id: "drag3", text: "Lebar" },
          { id: "drag4", text: "-" },
          { id: "drag5", text: "+" },
          { id: "drag6", text: "×" },
          { id: "drag7", text: "÷" }
        ],
        findingsTitle: "Diketahui",
        findingsList: [
          "Sawah di Cianjur.",
          "Panjang sawah = 25 m",
          "Lebar sawah = 15 m"
        ]
      },
      
      calculation1: {
        initialEquation: [
          "Luas sawah = [[Panjang]] × [[Lebar]]"
        ],
        values: {
          initialBox1: "Panjang",
          initialBox2: "Lebar",
          lengthFinal: "25 m",
          breadthFinal: "15 m"
        },
        inputBoxes: [
          { answer: "25", placeholder: "Panjang", unit: " m" },
          { answer: "15", placeholder: "Lebar", unit: " m" }
        ],
        numpad: {
          answer: "375",
          maxLength: 4,
          unit: " m²"
        },
        findings: {
          areaFinding: "Luas sawah = Luas Persegi Panjang"
        }
      },
      
      // Calculation display strings
      calculation: {
        units: {
          m: "m",
          "m²": "m²"
        },
        rows: {
          calc1Label: "Luas sawah",
          calc1Equation: "= Panjang × Lebar",
          finalResult: "Luas sawah Pak Ahmad = 375 m²"
        },
        altTexts: {
          riceField: "Sawah"
        }
      },
      
      finalAnswer: "Luas sawah Pak Ahmad = 375 m²",
      
      steps: {
        0: {
          questionText: "Baca pertanyaan dan identifikasi 'diketahui' dan 'ditanyakan'.",
          navText: "Ketuk » untuk mengidentifikasi informasi 'diketahui'.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        1: {
          questionText: "Pak Ahmad memiliki sawah di Cianjur. Panjang sawah adalah 25 meter dan\n lebarnya adalah 15 meter. Berapa total luas sawahnya?",
          navText: "Ketuk » untuk mengidentifikasi informasi 'diketahui'.",
          navToFind:"Ketuk » untuk mengidentifikasi apa yang perlu 'ditanyakan'.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compre1.svg",
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
          questionText: "Apa yang diwakili oleh luas sawah?",
          navText: "Ketuk jawaban yang benar.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compre4id.svg",
          isMcq: true,
          nextEnabled: false
        },
        4: {
          questionText: "Bangun kalimat matematika untuk menemukan luas sawah.",
          navText: "Seret tombol yang benar ke tempat yang tepat dalam kalimat.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compre4id.svg",
          isDragDrop: true,
          dragDropKey: "dragDrop1",
          nextEnabled: false
        },
        5: {
          questionText: "Mari temukan luas sawah.",
          navText: "Ketuk kotak yang disorot.",
          navTextSecondBox: "Ketuk kotak yang disorot.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compre4id.svg",
          isInteractiveBoxes: true,
          calcKey: "calc1",
          nextEnabled: false
        },
        6: {
          questionText: "Mari temukan luas sawah.",
          navText: "Gunakan numpad untuk mengisi jawaban dan klik ✓ untuk memeriksa.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compre4id.svg",
          isNumpad: true,
          calcKey: "calc1",
          nextEnabled: false
        },
        7: {
          questionText: "Aktivitas Selesai!",
          navText: "Ketuk 'Mulai Ulang' untuk memulai kembali aktivitas",
          image: "assets/compre4id.svg",
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
