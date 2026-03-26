const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start_over: "Restart",
      questionText:
        "Hendra has a rectangular sheet of paper measuring 27 cm × 20 cm. From this sheet, he draws a trapezoid with the dimensions shown in the picture and cuts it out exactly along its outline. What is the area of the remaining paper?",
      questionImage: "assets/question.svg",
      comprehend: {
        sectionTitle: "INFORMATION ANALYSIS",
        images: [
          "assets/compre1.svg",
          "assets/compre2.svg",
          "assets/compre3.svg",
          "assets/compre4.svg",
        ],
        given: {
          title: "Given:",
          data: [
            "Dimensions of the rectangular sheet = 27 cm × 20 cm",
            null,
            null,
          ],
          highlights: [
            "rectangular sheet of paper measuring 27 cm × 20 cm",
            "he draws a trapezoid with the dimensions shown in the picture",
            "cuts it out exactly along its outline",
          ],
        },
        toFind: {
          title: "To Find:",
          data: ["Area of the remaining paper"],
          highlights: ["What is the area of the remaining paper"],
        },
        // Substep index (after intro -1): third given = "cuts it out…" — video + cutter interaction
        cutSubstepIndex: 2,
        cutAnimation: {
          videoSrc: "assets/animate.mp4",
          cutterSrc: "assets/cutter.png",
          navTapCutter:
            "Tap <img src='assets/cutter.png' alt='cutter' class='cutter-image-nav' /> to cut.",
        },
      },
      splash: {
        step2: {
          image: "assets/compre3.svg",
          text: "<blue>✓ We identified the given information and what to find.</blue><br><yellow>Next - build the correct math sentence for the remaining area.</yellow>",
        },
      },
      dragDrop1: {
        equationLabel: "",
        dropZones: [
          {
            id: "zone1",
            correctAnswer: "Remaining area",
            placeholder: "[Remaining area]",
          },
          { id: "zone2", correctAnswer: "=", placeholder: "=", isStatic: true },
          {
            id: "zone3",
            correctAnswer: "Area of rectangle",
            placeholder: "[Area of rectangle]",
          },
          { id: "zone4", correctAnswer: "-", placeholder: "[-]" },
          {
            id: "zone5",
            correctAnswer: "Area of trapezoid",
            placeholder: "[Area of trapezoid]",
          },
        ],
        draggables: [
          { id: "drag1", text: "Area of rectangle" },
          { id: "drag2", text: "Area of trapezoid" },
          { id: "drag3", text: "Remaining area" },
          { id: "drag4", text: "×" },
          { id: "drag5", text: "÷" },
          { id: "drag6", text: "-" },
          { id: "drag7", text: "+" },
        ],
        showPlaceholder: false,
      },
      dragDrop2: {
        equationLabel: "",
        showPlaceholder: true,
        dropZones: [
          {
            id: "zone1",
            correctAnswer: "Remaining area",
            placeholder: "Remaining area",
            isStatic: true,
          },
          { id: "zone2", correctAnswer: "=", placeholder: "=", isStatic: true },
          {
            id: "zone3",
            correctAnswer: "Area of rectangle",
            placeholder: "Area of rectangle",
          },
          { id: "zone4", correctAnswer: "-", placeholder: "-", isStatic: true },
          {
            id: "zone5",
            correctAnswer: "Area of trapezoid",
            placeholder: "Area of trapezoid",
          },
        ],
        draggables: [
          { id: "drag1", text: "Length × Breadth" },
          { id: "drag2", text: "½ × base × height" },
          { id: "drag3", text: "½ × (base 1 + base 2) × height" },
        ],
        zoneMap: {
          zone3: "Length × Breadth",
          zone5: "½ × (base 1 + base 2) × height",
        },
      },
      calculation1: {
        initialEquation: [
          "Remaining area = [[Length × Breadth]] - [[½ × (base 1 + base 2) × height]]",
        ],
        values: {
          boxReplacements: ["<or>27 × 20</or>", "<bl>½ × (12 + 24) × 18</bl>"],
        },
      },
      calculation2: {
        initialEquation: [
          "Remaining area = [[<or>27 × 20</or>]] - [[<bl>½ × (12 + 24) × 18</bl>]]",
        ],
        values: {
          boxReplacements: ["<or>486 cm²</or>", "<bl>324 cm²</bl>"],
        },
      },
      calculationFinal: {
        equation: "Remaining area = ",
        prompt: "Find 486 - 324",
        numpad: {
          answer: "162",
          maxLength: 3,
          unit: " cm²",
        },
      },
      calculation: {
        altTexts: {
          riceField: "Paper cut figure",
        },
      },
      finalAnswer: "So, the remaining area of the sheet is 162 cm².",
      steps: {
        0: {
          questionText: "Read the question carefully.",
          navText: "Tap » to identify the given and to find information.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true,
        },
        1: {
          questionText:
            "Hendra has a rectangular sheet of paper measuring 27 cm × 20 cm. From this sheet, he draws a trapezoid with the dimensions shown in the picture and cuts it out exactly along its outline. What is the area of the remaining paper?",
          navText: "Tap » to identify 'given' information.",
          navToFind: "Tap » to identify what we need 'to find'.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre1.svg",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false,
        },
        2: {
          questionText: "",
          navText: "Tap » to continue.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true,
        },
        3: {
          questionText:
            "Let's build the math sentence to find the remaining area.",
          navText:
            "Drag the correct buttons to the correct spot in the sentence.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/calc.svg",
          isDragDrop: true,
          dragDropKey: "dragDrop1",
          nextEnabled: false,
        },
        4: {
          questionText: "Let's identify the correct formula to find the area.",
          navText: "Drag the correct formulas to complete the sentence.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/calc.svg",
          isDragDrop: true,
          dragDropKey: "dragDrop2",
          nextEnabled: false,
        },
        5: {
          questionText: "Let's substitute the values in the formula.",
          navText: "Tap the highlighted box.",
          navTextSecondBox: "Tap the highlighted box.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/rect.svg",
          imageSecondActive: "assets/trap.svg",
          imageBothDone: "assets/calc.svg",
          isInteractiveBoxes: true,
          calcKey: "calculation1",
          nextEnabled: false,
        },
        6: {
          questionText: "Now calculate each area and substitute the values.",
          questionTextFirstBox: "Now calculate the area of the rectangle.",
          questionTextSecondBox: "Now calculate the area of trapezoid.",
          navText: "Tap the highlighted box.",
          navTextSecondBox: "Tap the highlighted box.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/rect.svg",
          imageSecondActive: "assets/trap.svg",
          imageBothDone: "assets/calc.svg",
          isInteractiveBoxes: true,
          calcKey: "calculation2",
          nextEnabled: false,
        },
        7: {
          questionText: "Lastly find the remaining area of the sheet.",
          navText: "Use the numpad to fill the answer and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/calc.svg",
          isNumpad: true,
          calcKey: "calculationFinal",
          nextEnabled: false,
        },
        8: {
          questionText: "Activity Completed!",
          navText: "Tap 'Restart' to restart the activity.",
          image: "assets/calc.svg",
          isFinalStep: true,
          nextEnabled: true,
        },
      },
      labels: {
        given: "Given",
        toFind: "To Find",
        findings: "Findings",
      },
    },
  },
  id: {
    app: {
      start_over: "Mulai ulang",
      questionText:
        "Hendra memiliki lembar kertas berbentuk persegi panjang berukuran 27 cm × 20 cm. Dari lembar ini, ia menggambar sebuah trapesium dengan ukuran seperti pada gambar dan memotongnya persis mengikuti garis luarnya. Berapa luas kertas yang tersisa?",
      questionImage: "assets/question.svg",
      comprehend: {
        sectionTitle: "ANALISIS INFORMASI",
        images: [
          "assets/compre1.svg",
          "assets/compre2.svg",
          "assets/compre3.svg",
          "assets/compre4.svg",
        ],
        given: {
          title: "Diketahui:",
          data: ["Ukuran lembar persegi panjang = 27 cm × 20 cm", null, null],
          highlights: [
            "lembar kertas berbentuk persegi panjang berukuran 27 cm × 20 cm",
            "ia menggambar sebuah trapesium dengan ukuran seperti pada gambar",
            "memotongnya persis mengikuti garis luarnya",
          ],
        },
        toFind: {
          title: "Ditanyakan:",
          data: ["Luas kertas yang tersisa"],
          highlights: ["Berapa luas kertas yang tersisa"],
        },
        cutSubstepIndex: 2,
        cutAnimation: {
          videoSrc: "assets/animate.mp4",
          cutterSrc: "assets/cutter.png",
          navTapCutter:
            "Ketuk <img src='assets/cutter.png' alt='pemotong' class='cutter-image-nav' /> untuk memotong.",
        },
      },
      splash: {
        step2: {
          image: "assets/compre3.svg",
          text: "<blue>✓ Kita telah mengidentifikasi informasi yang diketahui dan yang ditanyakan.</blue><br><yellow>Selanjutnya - susun kalimat matematika yang benar untuk luas tersisa.</yellow>",
        },
      },
      dragDrop1: {
        equationLabel: "",
        dropZones: [
          {
            id: "zone1",
            correctAnswer: "Luas tersisa",
            placeholder: "[Luas tersisa]",
          },
          { id: "zone2", correctAnswer: "=", placeholder: "=", isStatic: true },
          {
            id: "zone3",
            correctAnswer: "Luas persegi panjang",
            placeholder: "[Luas persegi panjang]",
          },
          { id: "zone4", correctAnswer: "-", placeholder: "[-]" },
          {
            id: "zone5",
            correctAnswer: "Luas trapesium",
            placeholder: "[Luas trapesium]",
          },
        ],
        draggables: [
          { id: "drag1", text: "Luas persegi panjang" },
          { id: "drag2", text: "Luas trapesium" },
          { id: "drag3", text: "Luas tersisa" },
          { id: "drag4", text: "×" },
          { id: "drag5", text: "÷" },
          { id: "drag6", text: "-" },
          { id: "drag7", text: "+" },
        ],
        showPlaceholder: false,
      },
      dragDrop2: {
        equationLabel: "",
        showPlaceholder: true,
        dropZones: [
          {
            id: "zone1",
            correctAnswer: "Luas tersisa",
            placeholder: "Luas tersisa",
            isStatic: true,
          },
          { id: "zone2", correctAnswer: "=", placeholder: "=", isStatic: true },
          {
            id: "zone3",
            correctAnswer: "Luas persegi panjang",
            placeholder: "Luas persegi panjang",
          },
          { id: "zone4", correctAnswer: "-", placeholder: "-", isStatic: true },
          {
            id: "zone5",
            correctAnswer: "Luas trapesium",
            placeholder: "Luas trapesium",
          },
        ],
        draggables: [
          { id: "drag1", text: "Panjang × Lebar" },
          { id: "drag2", text: "½ × alas × tinggi" },
          { id: "drag3", text: "½ × (alas 1 + alas 2) × tinggi" },
        ],
        zoneMap: {
          zone3: "Panjang × Lebar",
          zone5: "½ × (alas 1 + alas 2) × tinggi",
        },
      },
      calculation1: {
        initialEquation: [
          "Luas tersisa = [[Panjang × Lebar]] - [[½ × (alas 1 + alas 2) × tinggi]]",
        ],
        values: {
          boxReplacements: ["<or>27 × 20</or>", "<bl>½ × (12 + 24) × 18</bl>"],
        },
      },
      calculation2: {
        initialEquation: [
          "Luas tersisa = [[<or>27 × 20</or>]] - [[<bl>½ × (12 + 24) × 18</bl>]]",
        ],
        values: {
          boxReplacements: ["<or>486 cm²</or>", "<bl>324 cm²</bl>"],
        },
      },
      calculationFinal: {
        equation: "Luas tersisa = ",
        prompt: "Hitung 486 − 324",
        numpad: {
          answer: "162",
          maxLength: 3,
          unit: " cm²",
        },
      },
      calculation: {
        altTexts: {
          riceField: "Gambar pemotongan kertas",
        },
      },
      finalAnswer: "Jadi, luas kertas yang tersisa adalah 162 cm².",
      steps: {
        0: {
          questionText: "Baca soal dengan teliti.",
          navText: "Ketuk » untuk mengidentifikasi diketahui dan ditanyakan.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true,
        },
        1: {
          questionText:
            "Hendra memiliki lembar kertas berbentuk persegi panjang berukuran 27 cm × 20 cm. Dari lembar ini, ia menggambar sebuah trapesium dengan ukuran seperti pada gambar dan memotongnya persis mengikuti garis luarnya. Berapa luas kertas yang tersisa?",
          navText: "Ketuk » untuk mengidentifikasi informasi 'diketahui'.",
          navToFind:
            "Ketuk » untuk mengidentifikasi apa yang perlu 'ditanyakan'.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compre1.svg",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false,
        },
        2: {
          questionText: "",
          navText: "Ketuk » untuk melanjutkan.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true,
        },
        3: {
          questionText:
            "Mari susun kalimat matematika untuk mencari luas tersisa.",
          navText:
            "Seret tombol yang benar ke tempat yang tepat dalam kalimat.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/calc.svg",
          isDragDrop: true,
          dragDropKey: "dragDrop1",
          nextEnabled: false,
        },
        4: {
          questionText:
            "Mari identifikasi rumus yang benar untuk mencari luas.",
          navText: "Seret rumus yang benar untuk melengkapi kalimat.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/calc.svg",
          isDragDrop: true,
          dragDropKey: "dragDrop2",
          nextEnabled: false,
        },
        5: {
          questionText: "Mari substitusikan nilai ke dalam rumus.",
          navText: "Ketuk kotak yang disorot.",
          navTextSecondBox: "Ketuk kotak yang disorot.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/rect.svg",
          imageSecondActive: "assets/trap.svg",
          imageBothDone: "assets/calc.svg",
          isInteractiveBoxes: true,
          calcKey: "calculation1",
          nextEnabled: false,
        },
        6: {
          questionText: "Sekarang hitung tiap luas dan substitusikan nilainya.",
          questionTextFirstBox: "Sekarang hitung luas persegi panjang.",
          questionTextSecondBox: "Sekarang hitung luas trapesium.",
          navText: "Ketuk kotak yang disorot.",
          navTextSecondBox: "Ketuk kotak yang disorot.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/rect.svg",
          imageSecondActive: "assets/trap.svg",
          imageBothDone: "assets/calc.svg",
          isInteractiveBoxes: true,
          calcKey: "calculation2",
          nextEnabled: false,
        },
        7: {
          questionText: "Terakhir, cari luas tersisa pada lembar tersebut.",
          navText:
            "Gunakan papan angka untuk mengisi jawaban dan ketuk ✓ untuk memeriksa.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/calc.svg",
          isNumpad: true,
          calcKey: "calculationFinal",
          nextEnabled: false,
        },
        8: {
          questionText: "Aktivitas selesai!",
          navText: "Ketuk 'Mulai ulang' untuk mengulang aktivitas.",
          image: "assets/calc.svg",
          isFinalStep: true,
          nextEnabled: true,
        },
      },
      labels: {
        given: "Diketahui",
        toFind: "Ditanyakan",
        findings: "Temuan",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
