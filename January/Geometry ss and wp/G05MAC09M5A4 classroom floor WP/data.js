
const decimal = {
  en: ".",
  id: ",",
};

// Master data structure for Classroom Floor Tiling Word Problem
const DATA = {
  en: {
    app: {
      start_over: "Restart",

      questionText: "A school in Bandung plans to install ceramic tiles in their classroom. The classroom is rectangular with a length of 12 meters and width of 9 meters. Each ceramic tile is 40 cm × 40 cm and costs Rp 25,000 per piece. How much will it cost to tile the entire classroom floor?",

      comprehend: {
        sectionTitle: "INFORMATION ANALYSIS",
        images: [
          "assets/compre1.png",
          "assets/compre2.png",
          "assets/compre3.png",
          "assets/compre4.png",
          "assets/compre5.png",
          "assets/compre6.png"
        ],
        showFloorButtonLabel: "Show Floor",
        navSubstep0ShowFloor: "Tap 'Show Floor' to view the floor of the classroom.",
        videoShowFloor: "assets/animate.mp4",
        imageAfterVideo: "assets/animEnd.png",
        imageSubstep3Before: "assets/compre4in.png",
        navSubstep3TapTile: "Tap on the tile to magnify.",
        given: {
          title: "Given:",
          data: [
            "A school plans to install tiles in the classrooms.",
            "Length of the floor = 12 m",
            "Width of the floor = 9 m",
            "Tile size = 40 cm × 40 cm",
            "Cost per piece = Rp 25,000"
          ],
          highlights: [
            "A school in Bandung plans to install ceramic tiles in their classroom",
            "length of 12 meters",
            "width of 9 meters",
            "40 cm × 40 cm",
            "Rp 25,000 per piece"
          ]
        },
        toFind: {
          title: "To find:",
          data: [
            "Total cost of tiles needed for the floor."
          ],
          highlights: [
            "How much will it cost to tile the entire classroom floor"
          ]
        },
      },

      splash: {
        step4: {
          image: "assets/compre6.png",
          textKey: "step4SplashText"
        }
      },
      splashText: {
        step4SplashText: "<blue>✓ Information gathered from the figure.</blue><br><yellow>Next - Let's solve the problem step by step</yellow>"
      },

      dragDrop1: {
        hideEquationLabel: true,
        dropZones: [
          { id: "zone1", correctAnswer: "Total cost", placeholder: "Total cost" },
          { id: "zone2", correctAnswers: ["Number of tiles", "Cost of one tile"], placeholder: "Number of tiles" },
          { id: "zone3", correctAnswer: "×", placeholder: "×" },
          { id: "zone4", correctAnswers: ["Number of tiles", "Cost of one tile"], placeholder: "Cost of one tile" }
        ],
        draggables: [
          { id: "drag1", text: "Total cost" },
          { id: "drag2", text: "Area of School" },
          { id: "drag3", text: "Number of tiles" },
          { id: "drag4", text: "Area of one tile" },
          { id: "drag5", text: "Cost of one tile" },
          { id: "drag6", text: "+" },
          { id: "drag7", text: "×" },
          { id: "drag8", text: "÷" },
          { id: "drag9", text: "-" }
        ],
        showFindings: false
      },

      // Step 3: Calc + MCQ + interactive box (rewrite division as fraction)
      step3Calc: {
        initialCalcRow: "Total cost = Number of tiles × Cost of one tile",
        mcqQuestion: "How can you find the number of tiles needed to cover the floor?",
        mcqOptions: [
          "Perimeter of floor ÷ Perimeter of one tile",
          "Area of floor ÷ Area of one tile",
          "Area of floor + Area of one tile",
          "Length of floor × Cost of one tile"
        ],
        mcqAnswerIndex: 1,
        afterMcqCalcRowLabel: "Total cost = ",
        interactiveBoxLabel: "Area of floor ÷ Area of one tile",
        afterTapCalcRow: "Total cost = fraction(Area of floor / Area of one tile) × Cost of one tile",
        navTapOption: "Tap the correct option.",
        navTapHighlighted: "Tap the highlighted text to rewrite division.",
        navTapContinue: "Tap » to continue.",
        areaOfFloor: "Area of floor",
        areaOfOneTile: "Area of one tile",
        costOfOneTile: "Cost of one tile"
      },

      // Step 5: Three variables – tap interactive box to reveal, then numpad (var 0,1) or direct value (var 2)
      step5Calc: {
        givenTitle: "Given",
        givenList: [
          "Length of the floor = 12 m",
          "Width of the floor = 9 m",
          "Tile size = 40 cm × 40 cm",
          "Cost per piece = Rp 25,000"
        ],
        variables: [
          { key: "areaOfFloor", label: "Area of floor", expression: "12 m × 9 m", answer: "108", unit: " m²", questionKey: "q1", needsNumpad: true },
          { key: "areaOfOneTile", label: "Area of one tile", expression: "40 cm × 40 cm", answer: "1600", unit: " cm²", questionKey: "q2", needsNumpad: true },
          { key: "costOfOneTile", label: "Cost of one tile", expression: "25000", answer: "25000", unit: "", questionKey: "q3", needsNumpad: false }
        ],
        step5Images: ["assets/h1.png", "assets/h2.png", "assets/h3.png"],
        questions: {
          q1: "Step 1: Find the area of floor.",
          q2: "Step 2: Find the area of one tile.",
          q3: "Step 3: Substitute the cost of one tile."
        },
        navUseNumpad: "Use the numpad to fill the box and click ✓ to check.",
        navTapContinue: "Tap » to continue.",
        navTapVariable: "Tap the highlighted text to substitute."
      },

      // Step 6: Unit conversion MCQ
      step6Calc: {
        questionText: "Step 4: Convert the bigger units to smaller units.",
        calcRow: "Total cost = fraction(108 m² / 1600 cm²) × 25000",
        mcqQuestion: "Which conversion sentence is correct?",
        mcqOptions: [
          "A. 1 m² = 100 cm²",
          "B. 1 m² = 1,000 cm²",
          "C. 1 m² = 10,000 cm²",
          "D. 1 m² = 1,000,000 cm²"
        ],
        mcqAnswerIndex: 2,
        navTapOption: "Tap the correct option.",
        navTapContinue: "Tap » to continue."
      },

      // Step 7: Append row with numpad box (10000)
      step7Calc: {
        findingsTitle: "Findings",
        findingsList: ["1 m² = 10,000 cm²"],
        existingRow: "Total cost = fraction(108 m² / 1600 cm²) × 25000",
        newRowNumerator: "108 × box cm²",
        newRowDenom: "1600 cm²",
        numpadAnswer: "10000",
        numpadMaxLength: 5,
        navUseNumpad: "Use the numpad to fill the box and click ✓ to check.",
        navTapContinue: "Tap » to continue."
      },

      // Step 8: Simplify button, then 675 × 25000, then numpad for final cost
      step8Calc: {
        questionText: "Step 4: Calculate the total cost",
        findingsTitle: "Findings",
        findingsList: ["1 m² = 10,000 cm²"],
        simplifyButtonLabel: "Simplify",
        navTapSimplify: "Tap 'Simplify'.",
        rowAfterSimplify1: "Total cost = 675 × 25000",
        rowAfterSimplify2: "Total cost = ",
        numpadAnswer: "16875000",
        numpadMaxLength: 8,
        navUseNumpad: "Use the numpad to fill the answer and click ✓ to check.",
        navTapContinue: "Tap » to continue."
      },

      // Step 9: Final answer
      step9Final: {
        finalAnswerText: "So, It will cost Rp 16,875,000 to tile the entire classroom floor."
      },

      labels: {
        given: "Given",
        toFind: "To Find",
        findings: "Findings",
        areaOfFloor: "Area of floor",
        areaOfOneTile: "Area of one tile",
        costOfOneTile: "Cost of one tile",
        simplifyButton: "Simplify",
        totalCost: "Total cost"
      },

      altTexts: {
        classroom: "Classroom floor",
        diagram: "Diagram",
        visualRepresentation: "Visual representation",
        magnifyTile: "Magnify tile",
        splashImage: "Summary visual"
      },

      steps: {
        0: {
          questionText: "Read the question and identify 'given' and 'to find'.",
          navText: "Tap » to identify 'given' information.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        1: {
          questionText: "A school in Bandung plans to install ceramic tiles in their classroom. The classroom is rectangular with a length of 12 meters and width of 9 meters. Each ceramic tile is 40 cm × 40 cm and costs Rp 25,000 per piece. How much will it cost to tile the entire classroom floor?",
          navText: "Tap » to identify 'given' information.",
          navToFind: "Tap » to identify what we need 'to find'.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre1.png",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false
        },
        2: {
          questionText: "Build a mathematical sentence for the total cost.",
          navText: "Drag the correct buttons to the correct spot in the sentence.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre6.png",
          isDragDrop: true,
          dragDropKey: "dragDrop1",
          showFindings: false,
          nextEnabled: false
        },
        3: {
          questionText: "Let’s build the math sentence to find the total cost.",
          navText: "Tap the correct option.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre6.png",
          isCalcWithMcqAndBox: true,
          nextEnabled: false
        },
        4: {
          questionText: "",
          navText: "Tap » to continue.",
          isSplash: true,
          splashKey: "step4",
          nextEnabled: true
        },
        5: {
          questionText: "Step 1: Find the area of floor.",
          navText: "Use the numpad to fill the box and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre6.png",
          isInteractiveBoxes: true,
          calcKey: "step5",
          nextEnabled: false
        },
        6: {
          questionText: "Step 4: Convert the bigger units to smaller units.",
          navText: "Tap the correct option.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre6.png",
          isConversionMcq: true,
          nextEnabled: false
        },
        7: {
          questionText: "Step 4: Convert the bigger units to smaller units.",
          navText: "Use the numpad to fill the box and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre6.png",
          isNumpad: true,
          calcKey: "step7",
          hideImage: true,
          nextEnabled: false
        },
        8: {
          questionText: "Step 4: Calculate the total cost",
          navText: "Tap 'Simplify'.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre6.png",
          isSimplifyNumpad: true,
          hideImage: true,
          nextEnabled: false
        },
        9: {
          questionText: "Activity Completed!",
          navText: "Tap 'Restart' to restart the activity",
          image: "assets/compre6.png",
          isFinalStep: true,
          hideImage: true,
          nextEnabled: true
        }
      },
    },
  },
  id: {
    app: {
      start_over: "Mulai Ulang",
      questionText: "Sekolah di Bandung berencana memasang ubin keramik di kelas. Ruang kelas berbentuk persegi panjang dengan panjang 12 meter dan lebar 9 meter. Setiap ubin keramik berukuran 40 cm × 40 cm dan berharga Rp 25.000 per buah. Berapa biaya yang dibutuhkan untuk memasang ubin di seluruh lantai kelas?",
      comprehend: {
        sectionTitle: "ANALISIS INFORMASI",
        images: [
          "assets/compre1.png",
          "assets/compre2.png",
          "assets/compre3.png",
          "assets/compre4.png",
          "assets/compre5.png",
          "assets/compre6.png"
        ],
        showFloorButtonLabel: "Tampilkan Lantai",
        navSubstep0ShowFloor: "Ketuk 'Tampilkan Lantai' untuk melihat lantai kelas.",
        videoShowFloor: "assets/animate.mp4",
        imageAfterVideo: "assets/animEnd.png",
        imageSubstep3Before: "assets/compre4in.png",
        navSubstep3TapTile: "Ketuk ubin untuk memperbesar.",
        given: {
          title: "Diketahui:",
          data: [
            "Panjang lantai = 12 m",
            "Lebar lantai = 9 m",
            "Ukuran ubin = 40 cm × 40 cm",
            "Biaya per ubin = Rp 25.000"
          ],
          highlights: [
            "panjang 12 meter",
            "lebar 9 meter",
            "40 cm × 40 cm",
            "Rp 25.000 per ubin"
          ]
        },
        toFind: {
          title: "Ditanyakan:",
          data: ["Total biaya ubin yang dibutuhkan untuk lantai."],
          highlights: ["Berapa biaya untuk memasang ubin di seluruh lantai kelas"]
        },
      },
      splash: { step4: { image: "assets/compre6.png", textKey: "step4SplashText" } },
      splashText: { step4SplashText: "<blue>✓ Informasi dikumpulkan dari gambar.</blue><br><yellow>Selanjutnya - Mari selesaikan masalah langkah demi langkah</yellow>" },
      dragDrop1: {
        hideEquationLabel: true,
        dropZones: [
          { id: "zone1", correctAnswer: "Total biaya", placeholder: "Total biaya" },
          { id: "zone2", correctAnswers: ["Jumlah ubin", "Biaya satu ubin"], placeholder: "Jumlah ubin" },
          { id: "zone3", correctAnswer: "×", placeholder: "×" },
          { id: "zone4", correctAnswers: ["Jumlah ubin", "Biaya satu ubin"], placeholder: "Biaya satu ubin" }
        ],
        draggables: [
          { id: "drag1", text: "Total biaya" },
          { id: "drag2", text: "Luas Sekolah" },
          { id: "drag3", text: "Jumlah ubin" },
          { id: "drag4", text: "Luas satu ubin" },
          { id: "drag5", text: "Biaya satu ubin" },
          { id: "drag6", text: "+" },
          { id: "drag7", text: "×" },
          { id: "drag8", text: "÷" },
          { id: "drag9", text: "-" }
        ],
        showFindings: false
      },
      step3Calc: {
        initialCalcRow: "Total biaya = Jumlah ubin × Biaya satu ubin",
        mcqQuestion: "Bagaimana cara mencari jumlah ubin yang dibutuhkan untuk menutupi lantai?",
        mcqOptions: [
          "Keliling lantai ÷ Keliling satu ubin",
          "Luas lantai ÷ Luas satu ubin",
          "Luas lantai + Luas satu ubin",
          "Panjang lantai × Biaya satu ubin"
        ],
        mcqAnswerIndex: 1,
        afterMcqCalcRowLabel: "Total biaya = ",
        interactiveBoxLabel: "Luas lantai ÷ Luas satu ubin",
        afterTapCalcRow: "Total biaya = pecahan(Luas lantai / Luas satu ubin) × Biaya satu ubin",
        navTapOption: "Ketuk opsi yang benar.",
        navTapHighlighted: "Ketuk teks yang disorot untuk menulis ulang pembagian.",
        navTapContinue: "Ketuk » untuk melanjutkan.",
        areaOfFloor: "Luas lantai",
        areaOfOneTile: "Luas satu ubin",
        costOfOneTile: "Biaya satu ubin"
      },
      step5Calc: {
        givenTitle: "Diketahui",
        givenList: ["Panjang lantai = 12 m", "Lebar lantai = 9 m", "Ukuran ubin = 40 cm × 40 cm", "Biaya per ubin = Rp 25.000"],
        variables: [
          { key: "areaOfFloor", label: "Luas lantai", expression: "12 m × 9 m", answer: "108", unit: " m²", questionKey: "q1", needsNumpad: true },
          { key: "areaOfOneTile", label: "Luas satu ubin", expression: "40 cm × 40 cm", answer: "1600", unit: " cm²", questionKey: "q2", needsNumpad: true },
          { key: "costOfOneTile", label: "Biaya satu ubin", expression: "25000", answer: "25000", unit: "", questionKey: "q3", needsNumpad: false }
        ],
        step5Images: ["assets/h1.png", "assets/h2.png", "assets/h3.png"],
        questions: { q1: "Langkah 1: Cari luas lantai.", q2: "Langkah 2: Cari luas satu ubin.", q3: "Langkah 3: Substitusi biaya satu ubin." },
        navUseNumpad: "Gunakan numpad untuk mengisi kotak dan klik ✓ untuk memeriksa.",
        navTapContinue: "Ketuk » untuk melanjutkan.",
        navTapVariable: "Ketuk teks yang disorot untuk mengganti."
      },
      step6Calc: {
        questionText: "Langkah 4: Ubah satuan besar ke satuan kecil.",
        calcRow: "Total biaya = pecahan(108 m² / 1600 cm²) × 25000",
        mcqQuestion: "Kalimat konversi mana yang benar?",
        mcqOptions: ["A. 1 m² = 100 cm²", "B. 1 m² = 1.000 cm²", "C. 1 m² = 10.000 cm²", "D. 1 m² = 1.000.000 cm²"],
        mcqAnswerIndex: 2,
        navTapOption: "Ketuk opsi yang benar.",
        navTapContinue: "Ketuk » untuk melanjutkan."
      },
      step7Calc: {
        findingsTitle: "Temuan",
        findingsList: ["1 m² = 10.000 cm²"],
        existingRow: "Total biaya = pecahan(108 m² / 1600 cm²) × 25000",
        newRowNumerator: "108 × kotak cm²",
        newRowDenom: "1600 cm²",
        numpadAnswer: "10000",
        numpadMaxLength: 5,
        navUseNumpad: "Gunakan numpad untuk mengisi kotak dan klik ✓ untuk memeriksa.",
        navTapContinue: "Ketuk » untuk melanjutkan."
      },
      step8Calc: {
        questionText: "Langkah 4: Hitung total biaya",
        findingsTitle: "Temuan",
        findingsList: ["1 m² = 10.000 cm²"],
        simplifyButtonLabel: "Sederhanakan",
        navTapSimplify: "Ketuk 'Sederhanakan'.",
        rowAfterSimplify1: "Total biaya = 675 × 25000",
        rowAfterSimplify2: "Total biaya = ",
        numpadAnswer: "16875000",
        numpadMaxLength: 8,
        navUseNumpad: "Gunakan numpad untuk mengisi jawaban dan klik ✓ untuk memeriksa.",
        navTapContinue: "Ketuk » untuk melanjutkan."
      },
      step9Final: { finalAnswerText: "Jadi, Biaya untuk memasang ubin di seluruh lantai kelas adalah Rp 16.875.000." },
      labels: { given: "Diketahui", toFind: "Ditanyakan", findings: "Temuan", areaOfFloor: "Luas lantai", areaOfOneTile: "Luas satu ubin", costOfOneTile: "Biaya satu ubin", simplifyButton: "Sederhanakan", totalCost: "Total biaya" },
      altTexts: { classroom: "Lantai kelas", diagram: "Diagram", visualRepresentation: "Representasi visual", magnifyTile: "Perbesar ubin", splashImage: "Ringkasan visual" },
      steps: {
        0: { questionText: "Baca pertanyaan dan identifikasi 'diketahui' dan 'ditanyakan'.", navText: "Ketuk » untuk mengidentifikasi informasi 'diketahui'.", isComprehendQuestion: true, nextEnabled: true, hideVisualPanel: true },
        1: { questionText: "Sekolah di Bandung berencana memasang ubin keramik di kelas. Ruang kelas berbentuk persegi panjang dengan panjang 12 meter dan lebar 9 meter. Setiap ubin keramik berukuran 40 cm × 40 cm dan berharga Rp 25.000 per buah. Berapa biaya yang dibutuhkan untuk memasang ubin di seluruh lantai kelas?", navText: "Ketuk » untuk mengidentifikasi informasi 'diketahui'.", navToFind: "Ketuk » untuk mengidentifikasi apa yang perlu 'ditanyakan'.", navTextCorrect: "Ketuk » untuk melanjutkan.", image: "assets/compre1.png", isComprehend: true, isSubstepComprehend: true, nextEnabled: false },
        2: { questionText: "Bangun kalimat matematika untuk total biaya.", navText: "Seret tombol yang benar ke tempat yang tepat.", navTextCorrect: "Ketuk » untuk melanjutkan.", image: "assets/compre6.png", isDragDrop: true, dragDropKey: "dragDrop1", showFindings: false, nextEnabled: false },
        3: { questionText: "", navText: "Ketuk opsi yang benar.", navTextCorrect: "Ketuk » untuk melanjutkan.", image: "assets/compre6.png", isCalcWithMcqAndBox: true, nextEnabled: false },
        4: { questionText: "", navText: "Ketuk » untuk melanjutkan.", isSplash: true, splashKey: "step4", nextEnabled: true },
        5: { questionText: "Langkah 1: Cari luas lantai.", navText: "Gunakan numpad untuk mengisi kotak.", navTextCorrect: "Ketuk » untuk melanjutkan.", image: "assets/compre6.png", isInteractiveBoxes: true, calcKey: "step5", nextEnabled: false },
        6: { questionText: "Langkah 4: Ubah satuan besar ke satuan kecil.", navText: "Ketuk opsi yang benar.", navTextCorrect: "Ketuk » untuk melanjutkan.", image: "assets/compre6.png", isConversionMcq: true, nextEnabled: false },
        7: { questionText: "Langkah 4: Ubah satuan besar ke satuan kecil.", navText: "Gunakan numpad untuk mengisi kotak.", navTextCorrect: "Ketuk » untuk melanjutkan.", image: "assets/compre6.png", isNumpad: true, calcKey: "step7", hideImage: true, nextEnabled: false },
        8: { questionText: "Langkah 4: Hitung total biaya", navText: "Ketuk 'Sederhanakan'.", navTextCorrect: "Ketuk » untuk melanjutkan.", image: "assets/compre6.png", isSimplifyNumpad: true, hideImage: true, nextEnabled: false },
        9: { questionText: "Aktivitas Selesai!", navText: "Ketuk 'Mulai Ulang' untuk memulai kembali.", image: "assets/compre6.png", isFinalStep: true, hideImage: true, nextEnabled: true }
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
