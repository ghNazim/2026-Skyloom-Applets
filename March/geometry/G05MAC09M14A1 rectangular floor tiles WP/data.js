
const decimal = {
  en: ".",
  id: ",",
};

// Master data structure for Classroom Floor Tiling Word Problem
const DATA = {
  en: {
    app: {
      start_over: "Restart",
      questionText:
        "The floor of a rectangular room is 8 m long and 6 m wide. If the floor will be covered with tiles measuring 20 cm × 20 cm, how many tiles are needed?",
      comprehend: {
        sectionTitle: "INFORMATION ANALYSIS",
        images: [
          "assets/compre0.svg",
          "assets/compre1.svg",
          "assets/compre2.svg",
          "assets/compre3.svg",
        ],
        imageSubstep2Before: "assets/compre2.svg",
        videoSubstep2: "assets/scale.mp4",
        navSubstep2TapTile: "Tap on the tile to magnify.",
        substep2InitialHighlight: "covered with tiles",
        given: {
          title: "Given:",
          data: [
            null,
            "Length of the room = 8 m and\nWidth of the room = 6 m",
            "Tile size = 20 cm × 20 cm",
          ],
          highlights: [
            "The floor of a rectangular room",
            "rectangular room is 8 m long and 6 m wide",
            "tiles measuring 20 cm × 20 cm",
          ],
        },
        toFind: {
          title: "To find:",
          data: ["Number of tiles required to cover the floor."],
          highlights: ["how many tiles are needed"],
        },
      },
      splash: {
        step2: {
          image: "assets/compre3.svg",
          text: "<blue>✓ Information gathered from the figure.</blue><br><yellow>Next - Let's solve step by step to find the number of tiles.</yellow>",
        },
      },
      dragDrop1: {
        hideEquationLabel: true,
        dropZones: [
          {
            id: "zone1",
            correctAnswer: "Number of tiles",
            placeholder: "Number of tiles",
          },
          {
            id: "zone2",
            correctAnswer: "Area of floor",
            placeholder: "Area of floor",
          },
          { id: "zone3", correctAnswer: "÷", placeholder: "÷" },
          {
            id: "zone4",
            correctAnswer: "Area of one tile",
            placeholder: "Area of one tile",
          },
        ],
        draggables: [
          { id: "drag1", text: "Area of floor" },
          { id: "drag2", text: "Number of tiles" },
          { id: "drag3", text: "Area of one tile" },
          { id: "drag4", text: "×" },
          { id: "drag5", text: "÷" },
          { id: "drag6", text: "-" },
          { id: "drag7", text: "+" },
        ],
        showFindings: false,
      },
      step4Calc: {
        questionText: "Step 1: Find the area of floor.",
        rowPrefix: "Number of tiles = ",
        interactiveLabel: "Area of floor",
        rowSuffix: " ÷ Area of one tile",
        placeholder: "8 m × 6 m",
        answer: "48",
        answerWithUnit: "48 m²",
        navTapVariable: "Tap the highlighted text.",
        navUseNumpad: "Use the numpad to fill the answer and click ✓.",
        navTapContinue: "Tap » to continue.",
      },
      step5Calc: {
        questionText: "Step 2: Find the area of one tile.",
        rowPrefix: "Number of tiles = 48 m² ÷ ",
        interactiveLabel: "Area of one tile",
        placeholder: "20 cm × 20 cm",
        answer: "400",
        answerWithUnit: "400 cm²",
        navTapVariable: "Tap the highlighted text.",
        navUseNumpad: "Use the numpad to fill the answer and click ✓.",
        navTapContinue: "Tap » to continue.",
      },
      step6Calc: {
        questionText: "Step 3: Convert the bigger units to smaller units.",
        calcRow: "Number of tiles = 48 m² ÷ 400 cm²",
        mcqQuestion: "Which conversion sentence is correct?",
        mcqOptions: [
          "1 m² = 100 cm²",
          "1 m² = 1,000 cm²",
          "1 m² = 10,000 cm²",
          "1 m² = 1,000,000 cm²",
        ],
        mcqAnswerIndex: 2,
        navTapOption: "Tap the correct option.",
        navTapContinue: "Tap » to continue.",
      },
      step7Calc: {
        questionText: "Step 3: Convert the bigger units to smaller units.",
        questionTextAfterAnswer:
          "Step 4: Simplify to find the required answer.",
        existingRow: "Number of tiles = 48 m² ÷ 400 cm²",
        rowBeforeBoxPrefix: "Number of tiles = 48 × ",
        rowBeforeBoxSuffix: " cm² ÷ 400 cm²",
        rowAfterSimplify: "Number of tiles = 480000 cm² ÷ 400 cm²",
        numpadAnswer: "10000",
        numpadMaxLength: 5,
        simplifyButtonLabel: "Simplify",
        findings: {
          title: "Findings",
          items: ["1 m² = 10,000 cm²"],
        },
        navUseNumpad: "Use the numpad to fill the answer and click ✓.",
        navTapSimplify: "Tap ‘Simplify’.",
        navTapContinue: "Tap » to continue.",
      },
      step8Calc: {
        questionText: "Step 4: Simplify to find the required answer.",
        prevRow1: "Number of tiles = 48 m² ÷ 400 cm²",
        prevRow2: "Number of tiles = 480000 cm² ÷ 400 cm²",
        answerRowPrefix: "Number of tiles = ",
        numpadAnswer: "1200",
        numpadMaxLength: 4,
        navUseNumpad: "Use the numpad to fill the answer and click ✓.",
        navTapContinue: "Tap » to continue.",
      },
      step9Final: {
        finalAnswerText:
          "So, 1200 tiles are required to cover the rectangular floor.",
      },
      labels: {
        findings: "Findings",
      },
      altTexts: {
        classroom: "Rectangular floor",
        diagram: "Diagram",
        visualRepresentation: "Visual representation",
        magnifyTile: "Magnify tile",
        splashImage: "Summary visual",
      },
      steps: {
        0: {
          questionText: "Read the question and identify 'given' and 'to find'.",
          navText: "Tap » to identify 'given' information.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true,
        },
        1: {
          questionText:
            "The floor of a rectangular room is 8 m long and 6 m wide. If the floor will be covered with tiles measuring 20 cm × 20 cm, how many tiles are needed?",
          navText: "Tap » to identify 'given' information.",
          navToFind: "Tap » to identify what we need 'to find'.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre0.svg",
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
            "Let’s build the math sentence to find the number of tiles.",
          navText:
            "Drag the correct buttons to the correct spot in the sentence.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre3.svg",
          isDragDrop: true,
          dragDropKey: "dragDrop1",
          showFindings: false,
          nextEnabled: false,
        },
        4: {
          questionText: "Step 1: Find the area of floor.",
          navText: "Tap the highlighted text.",
          image: "assets/compre3.svg",
          isInteractiveBoxes: true,
          nextEnabled: false,
        },
        5: {
          questionText: "Step 2: Find the area of one tile.",
          navText: "Tap the highlighted text.",
          image: "assets/compre3.svg",
          isInteractiveBoxes: true,
          nextEnabled: false,
        },
        6: {
          questionText: "Step 3: Convert the bigger units to smaller units.",
          navText: "Tap the correct option.",
          image: "assets/compre3.svg",
          isConversionMcq: true,
          nextEnabled: false,
        },
        7: {
          questionText: "Step 3: Convert the bigger units to smaller units.",
          navText: "Use the numpad to fill the answer and click ✓.",
          image: "assets/compre3.svg",
          isNumpad: true,
          nextEnabled: false,
        },
        8: {
          questionText: "Step 4: Simplify to find the required answer.",
          navText: "Use the numpad to fill the answer and click ✓.",
          image: "assets/compre3.svg",
          isNumpad: true,
          nextEnabled: false,
        },
        9: {
          questionText: "Activity Completed!",
          navText: "Tap 'Restart' to restart the activity",
          image: "assets/compre3.svg",
          isFinalStep: true,
          nextEnabled: true,
        },
      },
    },
  },
  id: {
    app: {
      start_over: "Mulai Ulang",
      questionText:
        "Lantai sebuah ruangan berbentuk persegi panjang memiliki panjang 8 m dan lebar 6 m. Jika lantai akan ditutup dengan ubin berukuran 20 cm × 20 cm, berapa banyak ubin yang dibutuhkan?",
      comprehend: {
        sectionTitle: "ANALISIS INFORMASI",
        images: [
          "assets/compre0.svg",
          "assets/compre1.svg",
          "assets/compre2.svg",
          "assets/compre3id.svg",
        ],
        imageSubstep2Before: "assets/compre2.svg",
        videoSubstep2: "assets/scale.mp4",
        navSubstep2TapTile: "Ketuk ubin untuk memperbesar.",
        substep2InitialHighlight: "ditutup dengan ubin",
        given: {
          title: "Diketahui:",
          data: [
            null,
            "Panjang ruangan = 8 m dan\nLebar ruangan = 6 m",
            "Ukuran ubin = 20 cm × 20 cm",
          ],
          highlights: [
            "Lantai sebuah ruangan berbentuk persegi panjang",
            "persegi panjang memiliki panjang 8 m dan lebar 6 m",
            "ubin berukuran 20 cm × 20 cm",
          ],
        },
        toFind: {
          title: "Ditanyakan:",
          data: ["Banyak ubin yang diperlukan untuk menutup lantai."],
          highlights: ["berapa banyak ubin yang dibutuhkan"],
        },
      },
      splash: {
        step2: {
          image: "assets/compre3id.svg",
          text: "<blue>✓ Informasi sudah dikumpulkan dari gambar.</blue><br><yellow>Berikutnya - Mari selesaikan langkah demi langkah untuk menemukan jumlah ubin.</yellow>",
        },
      },
      dragDrop1: {
        hideEquationLabel: true,
        dropZones: [
          {
            id: "zone1",
            correctAnswer: "Jumlah ubin",
            placeholder: "Jumlah ubin",
          },
          {
            id: "zone2",
            correctAnswer: "Luas lantai",
            placeholder: "Luas lantai",
          },
          { id: "zone3", correctAnswer: "÷", placeholder: "÷" },
          {
            id: "zone4",
            correctAnswer: "Luas satu ubin",
            placeholder: "Luas satu ubin",
          },
        ],
        draggables: [
          { id: "drag1", text: "Luas lantai" },
          { id: "drag2", text: "Jumlah ubin" },
          { id: "drag3", text: "Luas satu ubin" },
          { id: "drag4", text: "×" },
          { id: "drag5", text: "÷" },
          { id: "drag6", text: "-" },
          { id: "drag7", text: "+" },
        ],
        showFindings: false,
      },
      step4Calc: {
        questionText: "Langkah 1: Cari luas lantai.",
        rowPrefix: "Jumlah ubin = ",
        interactiveLabel: "Luas lantai",
        rowSuffix: " ÷ Luas satu ubin",
        placeholder: "8 m × 6 m",
        answer: "48",
        answerWithUnit: "48 m²",
        navTapVariable: "Ketuk teks yang disorot.",
        navUseNumpad: "Gunakan numpad untuk mengisi jawaban dan klik ✓.",
        navTapContinue: "Ketuk » untuk melanjutkan.",
      },
      step5Calc: {
        questionText: "Langkah 2: Cari luas satu ubin.",
        rowPrefix: "Jumlah ubin = 48 m² ÷ ",
        interactiveLabel: "Luas satu ubin",
        placeholder: "20 cm × 20 cm",
        answer: "400",
        answerWithUnit: "400 cm²",
        navTapVariable: "Ketuk teks yang disorot.",
        navUseNumpad: "Gunakan numpad untuk mengisi jawaban dan klik ✓.",
        navTapContinue: "Ketuk » untuk melanjutkan.",
      },
      step6Calc: {
        questionText: "Langkah 3: Ubah satuan yang lebih besar ke satuan yang lebih kecil.",
        calcRow: "Jumlah ubin = 48 m² ÷ 400 cm²",
        mcqQuestion: "Kalimat konversi manakah yang benar?",
        mcqOptions: [
          "1 m² = 100 cm²",
          "1 m² = 1.000 cm²",
          "1 m² = 10.000 cm²",
          "1 m² = 1.000.000 cm²",
        ],
        mcqAnswerIndex: 2,
        navTapOption: "Ketuk pilihan yang benar.",
        navTapContinue: "Ketuk » untuk melanjutkan.",
      },
      step7Calc: {
        questionText: "Langkah 3: Ubah satuan yang lebih besar ke satuan yang lebih kecil.",
        questionTextAfterAnswer:
          "Langkah 4: Sederhanakan untuk menemukan jawaban yang diminta.",
        existingRow: "Jumlah ubin = 48 m² ÷ 400 cm²",
        rowBeforeBoxPrefix: "Jumlah ubin = 48 × ",
        rowBeforeBoxSuffix: " cm² ÷ 400 cm²",
        rowAfterSimplify: "Jumlah ubin = 480000 cm² ÷ 400 cm²",
        numpadAnswer: "10000",
        numpadMaxLength: 5,
        simplifyButtonLabel: "Sederhanakan",
        findings: {
          title: "Temuan",
          items: ["1 m² = 10.000 cm²"],
        },
        navUseNumpad: "Gunakan numpad untuk mengisi jawaban dan klik ✓.",
        navTapSimplify: "Ketuk 'Sederhanakan'.",
        navTapContinue: "Ketuk » untuk melanjutkan.",
      },
      step8Calc: {
        questionText: "Langkah 4: Sederhanakan untuk menemukan jawaban yang diminta.",
        prevRow1: "Jumlah ubin = 48 m² ÷ 400 cm²",
        prevRow2: "Jumlah ubin = 480000 cm² ÷ 400 cm²",
        answerRowPrefix: "Jumlah ubin = ",
        numpadAnswer: "1200",
        numpadMaxLength: 4,
        navUseNumpad: "Gunakan numpad untuk mengisi jawaban dan klik ✓.",
        navTapContinue: "Ketuk » untuk melanjutkan.",
      },
      step9Final: {
        finalAnswerText:
          "Jadi, diperlukan 1200 ubin untuk menutup lantai persegi panjang.",
      },
      labels: {
        findings: "Temuan",
      },
      altTexts: {
        classroom: "Lantai persegi panjang",
        diagram: "Diagram",
        visualRepresentation: "Representasi visual",
        magnifyTile: "Perbesar ubin",
        splashImage: "Visual ringkasan",
      },
      steps: {
        0: {
          questionText: "Baca soal dan identifikasi 'diketahui' serta 'ditanyakan'.",
          navText: "Ketuk » untuk mengidentifikasi informasi 'diketahui'.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true,
        },
        1: {
          questionText:
            "Lantai sebuah ruangan berbentuk persegi panjang memiliki panjang 8 m dan lebar 6 m. Jika lantai akan ditutup dengan ubin berukuran 20 cm × 20 cm, berapa banyak ubin yang dibutuhkan?",
          navText: "Ketuk » untuk mengidentifikasi informasi 'diketahui'.",
          navToFind: "Ketuk » untuk mengidentifikasi apa yang perlu 'ditanyakan'.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compre0.svg",
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
            "Mari susun kalimat matematika untuk mencari jumlah ubin.",
          navText:
            "Seret tombol yang benar ke posisi yang tepat pada kalimat.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compre3id.svg",
          isDragDrop: true,
          dragDropKey: "dragDrop1",
          showFindings: false,
          nextEnabled: false,
        },
        4: {
          questionText: "Langkah 1: Cari luas lantai.",
          navText: "Ketuk teks yang disorot.",
          image: "assets/compre3id.svg",
          isInteractiveBoxes: true,
          nextEnabled: false,
        },
        5: {
          questionText: "Langkah 2: Cari luas satu ubin.",
          navText: "Ketuk teks yang disorot.",
          image: "assets/compre3id.svg",
          isInteractiveBoxes: true,
          nextEnabled: false,
        },
        6: {
          questionText: "Langkah 3: Ubah satuan yang lebih besar ke satuan yang lebih kecil.",
          navText: "Ketuk pilihan yang benar.",
          image: "assets/compre3id.svg",
          isConversionMcq: true,
          nextEnabled: false,
        },
        7: {
          questionText: "Langkah 3: Ubah satuan yang lebih besar ke satuan yang lebih kecil.",
          navText: "Gunakan numpad untuk mengisi jawaban dan klik ✓.",
          image: "assets/compre3id.svg",
          isNumpad: true,
          nextEnabled: false,
        },
        8: {
          questionText: "Langkah 4: Sederhanakan untuk menemukan jawaban yang diminta.",
          navText: "Gunakan numpad untuk mengisi jawaban dan klik ✓.",
          image: "assets/compre3id.svg",
          isNumpad: true,
          nextEnabled: false,
        },
        9: {
          questionText: "Aktivitas Selesai!",
          navText: "Ketuk 'Mulai Ulang' untuk mengulang aktivitas",
          image: "assets/compre3id.svg",
          isFinalStep: true,
          nextEnabled: true,
        },
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
