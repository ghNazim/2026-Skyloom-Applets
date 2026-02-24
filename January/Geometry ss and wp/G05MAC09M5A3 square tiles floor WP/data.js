// const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

// Master data structure for Square Floor (Mr. Budi) Word Problem
const DATA = {
  en: {
    app: {
      start_over: "Restart",

      // Question text for display
      questionText: "Mr. Budi wants to install flooring in a traditional square shaped house. Each side is 6 meters long. What is the total area of the floor to install?",

      // Comprehend step data (Step 1) - images compre 1 to 3
      comprehend: {
        sectionTitle: "INFORMATION ANALYSIS",
        showFloorButtonLabel: "Show Floor",
        navTextShowFloor: "Tap 'Show Floor' to view the floor of the house.",
        videoSrc: "assets/animate.mp4",
        imageAfterVideo: "assets/animate3.png",
        images: [
          "assets/compre1.png",
          "assets/compre2.png",
          "assets/compre3.png"
        ],
        given: {
          title: "Given:",
          data: [
            "Mr. Budi has a square-shaped house.",
            "Side length of the square floor = 6 m"
          ],
          highlights: [
            "square shaped house",
            "Each side is 6 meters long"
          ]
        },
        toFind: {
          title: "To Find:",
          data: [
            "Area of the square floor"
          ],
          highlights: [
            "What is the total area of the floor to install"
          ]
        },
      },

      // Splash screens data (Step 2)
      splash: {
        step2: {
          image: "assets/compre3.png",
          text: "<blue>✓ Information gathered from the figure.</blue><br><yellow>Next - Build the formula for the area of the square floor.</yellow>"
        }
      },

      // Drag and Drop data for Step 3 - 4 drop zones, "=" as static text
      dragDrop1: {
        equationLabel: "",
        dropZones: [
          { id: "zone1", correctAnswer: "Area of the square floor", placeholder: "Area of the square floor" },
          { id: "zoneEq", correctAnswer: "=", placeholder: " = ", isStatic: true },
          { id: "zone2", correctAnswers: ["Side Length", "Side length"], placeholder: "Side Length" },
          { id: "zone3", correctAnswer: "×", placeholder: "×" },
          { id: "zone4", correctAnswers: ["Side Length", "Side length"], placeholder: "Side Length" }
        ],
        draggables: [
          { id: "drag1", text: "Area of the square floor" },
          { id: "drag2", text: "Breadth" },
          { id: "drag3", text: "Length" },
          { id: "drag4", text: "Side Length" },
          { id: "drag5", text: "Side length" },
          { id: "drag6", text: "×" },
          { id: "drag7", text: "÷" },
          { id: "drag8", text: "-" },
          { id: "drag9", text: "+" }
        ],
        findingsTitle: "Given",
        findingsList: [
          "Mr. Budi has a square-shaped house.",
          "Side length of the square floor = 6 m"
        ]
      },

      // Calculation data for Steps 4-5 (one interactive box, then numpad)
      calculation1: {
        initialEquation: [
          "Area of the square floor = [[Side length × Side length]]"
        ],
        values: {
          singleBoxReplacement: "6 m × 6 m"
        },
        numpad: {
          answer: "36",
          maxLength: 3,
          unit: " m²"
        },
        findings: {
          areaFinding: "Area of the square floor = Side length × Side length"
        }
      },

      // Calculation display strings
      calculation: {
        units: {
          m: "m",
          "m²": "m²"
        },
        rows: {
          calc1Label: "Area of the square floor",
          calc1Equation: "= Side length × Side length",
          finalResult: "The total area of the floor to install = 36 m²"
        },
        altTexts: {
          squareFloor: "Square floor"
        }
      },

      // Final answer (Step 6)
      finalAnswer: "The total area of the floor to install = 36 m²",

      // Steps configuration (0-6, no MCQ)
      steps: {
        0: {
          questionText: "Read the question and identify 'given' and 'to find'.",
          navText: "Tap » to identify 'given' information.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        1: {
          questionText: "Mr. Budi wants to install flooring in a traditional square shaped house. Each side is 6 meters long. What is the total area of the floor to install?",
          navText: "Tap » to identify 'given' information.",
          navToFind: "Tap » to identify what we need 'to find'.",
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
          questionText: "Build a mathematical sentence to find the area of the square floor.",
          navText: "Drag the correct buttons to the correct spot in the sentence.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre3.png",
          isDragDrop: true,
          dragDropKey: "dragDrop1",
          nextEnabled: false
        },
        4: {
          questionText: "Let's find the area of the square floor.",
          navText: "Tap the highlighted box.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre3.png",
          isInteractiveBoxes: true,
          calcKey: "calc1",
          nextEnabled: false
        },
        5: {
          questionText: "Let's find the area of the square floor.",
          navText: "Use the numpad to fill the answer and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre3.png",
          isNumpad: true,
          calcKey: "calc1",
          nextEnabled: false
        },
        6: {
          questionText: "Activity Completed!",
          navText: "Tap 'Restart' to restart the activity",
          image: "assets/compre3.png",
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

      questionText: "Pak Budi ingin memasang lantai di rumah tradisional berbentuk persegi. Setiap sisinya panjangnya 6 meter. Berapa total luas lantai yang harus dipasang?",

      comprehend: {
        sectionTitle: "ANALISIS INFORMASI",
        showFloorButtonLabel: "Tampilkan Lantai",
        navTextShowFloor: "Ketuk 'Tampilkan Lantai' untuk melihat lantai rumah.",
        videoSrc: "assets/animate.mp4",
        imageAfterVideo: "assets/animate3.png",
        images: [
          "assets/compre1.png",
          "assets/compre2.png",
          "assets/compre3.png"
        ],
        given: {
          title: "Diketahui:",
          data: [
            "Pak Budi memiliki rumah berbentuk persegi.",
            "Panjang sisi lantai persegi = 6 m"
          ],
          highlights: [
            "Pak Budi memiliki rumah berbentuk persegi.",
            "Setiap sisinya panjangnya 6 meter"
          ]
        },
        toFind: {
          title: "Ditanyakan:",
          data: [
            "Luas lantai persegi"
          ],
          highlights: [
            "Berapa total luas lantai yang harus dipasang"
          ]
        },
      },

      splash: {
        step2: {
          image: "assets/compre3.png",
          text: "<blue>✓ Informasi dikumpulkan dari gambar.</blue><br><yellow>Selanjutnya - Bangun rumus luas lantai persegi.</yellow>"
        }
      },

      dragDrop1: {
        equationLabel: "",
        dropZones: [
          { id: "zone1", correctAnswer: "Luas lantai persegi", placeholder: "Luas lantai persegi" },
          { id: "zoneEq", correctAnswer: "=", placeholder: " = ", isStatic: true },
          { id: "zone2", correctAnswers: ["Panjang Sisi", "Panjang sisi"], placeholder: "Panjang Sisi" },
          { id: "zone3", correctAnswer: "×", placeholder: "×" },
          { id: "zone4", correctAnswers: ["Panjang Sisi", "Panjang sisi"], placeholder: "Panjang Sisi" }
        ],
        draggables: [
          { id: "drag1", text: "Luas lantai persegi" },
          { id: "drag2", text: "Lebar" },
          { id: "drag3", text: "Panjang" },
          { id: "drag4", text: "Panjang Sisi" },
          { id: "drag5", text: "Panjang sisi" },
          { id: "drag6", text: "×" },
          { id: "drag7", text: "÷" },
          { id: "drag8", text: "-" },
          { id: "drag9", text: "+" }
        ],
        findingsTitle: "Diketahui",
        findingsList: [
          "Pak Budi memiliki rumah berbentuk persegi.",
          "Panjang sisi lantai persegi = 6 m"
        ]
      },

      calculation1: {
        initialEquation: [
          "Luas lantai persegi = [[Panjang sisi × Panjang sisi]]"
        ],
        values: {
          singleBoxReplacement: "6 m × 6 m"
        },
        numpad: {
          answer: "36",
          maxLength: 3,
          unit: " m²"
        },
        findings: {
          areaFinding: "Luas lantai persegi = Panjang sisi × Panjang sisi"
        }
      },

      calculation: {
        units: {
          m: "m",
          "m²": "m²"
        },
        rows: {
          calc1Label: "Luas lantai persegi",
          calc1Equation: "= Panjang sisi × Panjang sisi",
          finalResult: "Total luas lantai yang harus dipasang = 36 m²"
        },
        altTexts: {
          squareFloor: "Lantai persegi"
        }
      },

      finalAnswer: "Total luas lantai yang harus dipasang = 36 m²",

      steps: {
        0: {
          questionText: "Baca pertanyaan dan identifikasi 'diketahui' dan 'ditanyakan'.",
          navText: "Ketuk » untuk mengidentifikasi informasi 'diketahui'.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        1: {
          questionText: "Pak Budi ingin memasang lantai di rumah tradisional berbentuk persegi. Setiap sisinya panjangnya 6 meter. Berapa total luas lantai yang harus dipasang?",
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
          questionText: "Bangun kalimat matematika untuk menemukan luas lantai persegi.",
          navText: "Seret tombol yang benar ke tempat yang tepat dalam kalimat.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compre3.png",
          isDragDrop: true,
          dragDropKey: "dragDrop1",
          nextEnabled: false
        },
        4: {
          questionText: "Mari temukan luas lantai persegi.",
          navText: "Ketuk kotak yang disorot.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compre3.png",
          isInteractiveBoxes: true,
          calcKey: "calc1",
          nextEnabled: false
        },
        5: {
          questionText: "Mari temukan luas lantai persegi.",
          navText: "Gunakan numpad untuk mengisi jawaban dan klik ✓ untuk memeriksa.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compre3.png",
          isNumpad: true,
          calcKey: "calc1",
          nextEnabled: false
        },
        6: {
          questionText: "Aktivitas Selesai!",
          navText: "Ketuk 'Mulai Ulang' untuk memulai kembali aktivitas",
          image: "assets/compre3.png",
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
