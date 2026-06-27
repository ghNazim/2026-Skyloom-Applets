const current_language = "id";
const decimal = {
  en: ".",
  id: ",",
};

// Master data structure for Water Level Word Problem
const DATA = {
  en: {
    app: {
      start_over: "Restart",
      
      // Question text for display
      questionText: "A water tank contains 2.225 L of water. After use, the water is reduced by 975.325 mL. How much water is left in the tank? Represent it in cm³.",
      
      // Comprehend step data (Step 1)
      comprehend: {
        sectionTitle: "INFORMATION ANALYSIS",
        blankSubstepHighlight: "water tank",
        images: [
          "assets/compre0.svg",
          "assets/compre1.svg",
          "assets/compre2.svg"
        ],
        video: {
          src: "assets/water.mp4",
          substeps: {
            0: { showVideo: true, isPlaying: false, showLastFrame: false },
            1: { showVideo: true, isPlaying: false, showLastFrame: false },
            2: { showVideo: true, isPlaying: true, showLastFrame: false },
            3: { showVideo: true, isPlaying: false, showLastFrame: true }
          }
        },
        zoomImages: [
          null,
          "assets/zoom1.svg",
          "assets/zoom2.svg",
          "assets/zoom3.svg"
        ],
        given: {
          title: "Given,",
          data: [
            
            "Initial volume of water = 2.225 L",
            "Volume of water used = 975.325 mL",
          ],
          highlights: [
            
            "water tank contains 2.225 L of water.",
            "water is reduced by 975.325 mL"
          ]
        },
        toFind: {
          title: "To Find",
          data: [
            "Volume of water left in the tank in cm³."
          ],
          highlights: [
            "How much water is left in the tank? Represent it in cm³."
          ]
        },
      },
      
      // Splash screens data
      splash: {
        step2: {
          image: "assets/compre1.svg",
          text: "<blue>✓ Information gathered from the figure.</blue><br><yellow>Next - Build mathematical sentence to solve the question.</yellow>",
          // Use video last frame instead of image
          useVideoLastFrame: true,
          videoSrc: "assets/water.mp4",
          zoomImageSrc: "assets/zoom3.svg"
        }
      },
      
      // Drag and Drop data for Step 3
      dragDrop: {
        equationLabel: "Volume of water left in the tank",
        dropZones: [
          { id: "zone1", correctAnswer: "Initial volume of water", placeholder: "Initial volume of water" },
          { id: "zone2", correctAnswer: "-", placeholder: "-" },
          { id: "zone3", correctAnswer: "Volume of water used", placeholder: "Volume of water used" }
        ],
        draggables: [
          { id: "drag1", text: "Initial volume of water" },
          { id: "drag2", text: "Volume of water used" },
          { id: "drag3", text: "+" },
          { id: "drag4", text: "-" }
        ]
      },
      
      // Calculation data for Steps 5-9
      calculation: {
        // Initial equation
        initialEquation: [
          "Volume of water left in the tank",
          "= Initial volume of water – Volume of water used"
        ],
        // Values to fill
        values: {
          initialVolume: "2.225 L",
          usedVolume: "975.325 mL",
          initial1:"Initial volume of water",
          initial2:"Volume of water used"
        },
        // MCQ for step 5
        mcq1: {
          title: "How will you convert 2.225 L to mL?",
          options: [
            "Multiply the value in L by 10",
            "Multiply the value in L by 100",
            "Multiply the value in L by 1000",
            "Divide the value in L by 1000"
          ],
          answerIndex: 2,
          finding: "1 L = 1000 mL"
        },
        // Numpad answer for step 5
        numpad1: {
          answer: "1000",
          maxLength: 4
        },
        // Numpad answer for step 6
        numpad2: {
          answer: "2225",
          maxLength: 4
        },
        // MCQ for step 8
        mcq2: {
          title: "How will you convert mL to cm³?",
          options: [
            "Multiply the value in mL by 10",
            "Multiply the value in mL by 100",
            "No conversion is needed",
            "Divide the value in mL by 1000"
          ],
          answerIndex: 2
        },
        // Final answer
        finalAnswer: "So, the volume of water left in the tank is 1249.675 cm³.",
        // Calculation rows (built progressively)
        rows: [
          "= 2.225 L – 975.325 mL",
          "= (2.225 × [box]) mL – 975.325 mL",
          "= [box] mL – 975.325 mL",
          "= 1249.675 mL",
          "= 1249.675 cm³"
        ],
        resultMl: "1249.675 mL",
        resultCm3: "1249.675 cm³"
      },
      
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
          questionText: "A water tank contains 2.225 L of water. After use, the water is reduced by 975.325 mL. How much water is left in the tank? Represent it in cm³.",
          navText: "Tap » to continue.",
          navToFind: "Tap » to identify 'to find'.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre0.svg",
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
        // Step 3: Drag and Drop
        3: {
          questionText: "Build a mathematical sentence to find the required volume.",
          navText: "Drag the correct buttons to the correct spot in the sentence.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre1.svg",
          isDragDrop: true,
          nextEnabled: false,
          useVideoLastFrame: true,
          videoSrc: "assets/water.mp4",
          zoomImageSrc: "assets/zoom3.svg"
        },
        // Step 4: Interactive boxes
        4: {
          questionText: "Let's find the required volume of water.",
          navText: "Tap the highlighted box.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre1.svg",
          isInteractiveBoxes: true,
          nextEnabled: false,
          useVideoLastFrame: true,
          videoSrc: "assets/water.mp4",
          zoomImageSrc: "assets/zoom3.svg"
        },
        // Step 5: MCQ + Numpad
        5: {
          questionText: "Let's find the required volume of water.",
          navText: "Tap the correct answer.",
          navTextNumpad: "Use the numpad to fill the answer and click ✓ to check and move to the next question",
          navTextCorrect: "Tap » to continue.",
          isCalculation: true,
          calcPhase: "mcq1",
          nextEnabled: false
        },
        // Step 6: Numpad only
        6: {
          questionText: "Let's find the required volume of water.",
          navText: "Use the numpad to fill the answer and click ✓ to check and move to the next question",
          navTextCorrect: "Tap » to continue.",
          isCalculation: true,
          calcPhase: "numpad2",
          nextEnabled: false
        },
        // Step 7: Show result row
        7: {
          questionText: "Let's find the required volume of water.",
          navText: "Tap » to continue.",
          isCalculation: true,
          calcPhase: "result",
          nextEnabled: true
        },
        // Step 8: MCQ for cm³ conversion
        8: {
          questionText: "Let's find the required volume of water.",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to continue.",
          isCalculation: true,
          calcPhase: "mcq2",
          nextEnabled: false
        },
        // Step 9: Final step
        9: {
          questionText: "Activity Completed!",
          navText: "Tap 'Restart' to restart the activity",
          isCalculation: true,
          calcPhase: "final",
          isFinalStep: true,
          nextEnabled: true
        }
      },
      labels: {
        given: "Given",
        toFind: "To Find",
        findings: "Findings:",
        waterTankAlt: "Water tank",
        zoomIndicatorAlt: "Zoom indicator",
        summaryVisualAlt: "Summary visual",
        visualRepresentationAlt: "Visual representation"
      },
    },
  },
  id: {
    app: {
      start_over: "Mulai Ulang",
      
      questionText: "Sebuah tangki air berisi 2,225 L air. Setelah digunakan, air berkurang 975,325 mL. Berapa banyak air yang tersisa di dalam tangki? Nyatakan dalam cm³.",
      
      comprehend: {
        sectionTitle: "ANALISIS INFORMASI",
        blankSubstepHighlight: "tangki air",
        images: [
          "assets/compre0_id.svg",
          "assets/compre1_id.svg",
          "assets/compre2_id.svg"
        ],
        video: {
          src: "assets/water.mp4",
          substeps: {
            0: { showVideo: true, isPlaying: false, showLastFrame: false },
            1: { showVideo: true, isPlaying: true, showLastFrame: false },
            2: { showVideo: true, isPlaying: false, showLastFrame: true },
            3: { showVideo: true, isPlaying: false, showLastFrame: true }
          }
        },
        zoomImages: [
          null,
          "assets/zoom1_id.svg",
          "assets/zoom2_id.svg",
          "assets/zoom3_id.svg"
        ],
        given: {
          title: "Diketahui:",
          data: [
            "Volume air awal = 2,225 L",
            "Volume air yang digunakan = 975,325 mL",
          ],
          highlights: [
            "tangki air berisi 2,225 L air.",
            "air berkurang 975,325 mL"
          ]
        },
        toFind: {
          title: "Ditanyakan",
          data: [
            "Volume air yang tersisa di dalam tangki dalam cm³."
          ],
          highlights: [
            "Berapa banyak air yang tersisa di dalam tangki?"
          ]
        },
      },
      
      splash: {
        step2: {
          image: "assets/compre1_id.svg",
          text: "<blue>✓ Informasi dikumpulkan dari gambar.</blue><br><yellow>Selanjutnya - Bangun kalimat matematika untuk menyelesaikan pertanyaan.</yellow>",
          // Use video last frame instead of image
          useVideoLastFrame: true,
          videoSrc: "assets/water.mp4",
          zoomImageSrc: "assets/zoom3_id.svg"
        }
      },
      
      dragDrop: {
        equationLabel: "Volume air yang tersisa di tangki",
        dropZones: [
          { id: "zone1", correctAnswer: "Volume air awal", placeholder: "Volume air awal" },
          { id: "zone2", correctAnswer: "-", placeholder: "-" },
          { id: "zone3", correctAnswer: "Volume air yang digunakan", placeholder: "Volume air yang digunakan" }
        ],
        draggables: [
          { id: "drag1", text: "Volume air awal" },
          { id: "drag2", text: "Volume air yang digunakan" },
          { id: "drag3", text: "+" },
          { id: "drag4", text: "-" }
        ]
      },
      
      calculation: {
        initialEquation: [
          "Volume air yang tersisa di tangki",
          "= Volume air awal – Volume air yang digunakan"
        ],
        values: {
          initialVolume: "2,225 L",
          usedVolume: "975,325 mL",
          initial1: "Volume air awal",
          initial2: "Volume air yang digunakan"
        },
        mcq1: {
          title: "Bagaimana cara mengubah 2,225 L ke mL?",
          options: [
            "Kalikan nilai dalam L dengan 10",
            "Kalikan nilai dalam L dengan 100",
            "Kalikan nilai dalam L dengan 1000",
            "Bagi nilai dalam L dengan 1000"
          ],
          answerIndex: 2,
          finding: "1 L = 1000 mL"
        },
        numpad1: {
          answer: "1000",
          maxLength: 4
        },
        numpad2: {
          answer: "2225",
          maxLength: 4
        },
        mcq2: {
          title: "Bagaimana cara mengubah mL ke cm³?",
          options: [
            "Kalikan nilai dalam mL dengan 10",
            "Kalikan nilai dalam mL dengan 100",
            "Tidak perlu konversi",
            "Bagi nilai dalam mL dengan 1000"
          ],
          answerIndex: 2
        },
        finalAnswer: "Jadi, volume air yang tersisa di dalam tangki adalah 1249,675 cm³.",
        rows: [
          "= 2,225 L – 975,325 mL",
          "= (2,225 × [box]) mL – 975,325 mL",
          "= [box] mL – 975,325 mL",
          "= 1249,675 mL",
          "= 1249,675 cm³"
        ],
        resultMl: "1249,675 mL",
        resultCm3: "1249,675 cm³"
      },
      
      steps: {
        0: {
          questionText: "Baca pertanyaan dan identifikasi 'diketahui' dan 'ditanyakan'.",
          navText: "Ketuk » untuk mengidentifikasi informasi 'diketahui'.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        1: {
          questionText: "Sebuah tangki air berisi 2,225 L air. Setelah digunakan, air berkurang 975,325 mL. Berapa banyak air yang tersisa di dalam tangki? Nyatakan dalam cm³.",
          navText: "Ketuk » untuk melanjutkan.",
          navToFind: "Ketuk » untuk mengidentifikasi 'ditanyakan'.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compre0_id.svg",
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
          questionText: "Bangun kalimat matematika untuk menemukan volume yang diperlukan.",
          navText: "Seret tombol yang benar ke tempat yang tepat dalam kalimat.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compre1_id.svg",
          isDragDrop: true,
          nextEnabled: false,
          useVideoLastFrame: true,
          videoSrc: "assets/water.mp4",
          zoomImageSrc: "assets/zoom3_id.svg"
        },
        4: {
          questionText: "Mari temukan volume air yang diperlukan.",
          navText: "Ketuk kotak yang disorot.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compre1_id.svg",
          isInteractiveBoxes: true,
          nextEnabled: false,
          useVideoLastFrame: true,
          videoSrc: "assets/water.mp4",
          zoomImageSrc: "assets/zoom3_id.svg"
        },
        5: {
          questionText: "Mari temukan volume air yang diperlukan.",
          navText: "Ketuk jawaban yang benar.",
          navTextNumpad: "Gunakan papan angka untuk mengisi jawaban dan ketuk ✓ untuk memeriksa dan lanjut ke pertanyaan berikutnya",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          isCalculation: true,
          calcPhase: "mcq1",
          nextEnabled: false
        },
        6: {
          questionText: "Mari temukan volume air yang diperlukan.",
          navText: "Gunakan papan angka untuk mengisi jawaban dan ketuk ✓ untuk memeriksa dan lanjut ke pertanyaan berikutnya",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          isCalculation: true,
          calcPhase: "numpad2",
          nextEnabled: false
        },
        7: {
          questionText: "Mari temukan volume air yang diperlukan.",
          navText: "Ketuk » untuk melanjutkan.",
          isCalculation: true,
          calcPhase: "result",
          nextEnabled: true
        },
        8: {
          questionText: "Mari temukan volume air yang diperlukan.",
          navText: "Ketuk jawaban yang benar.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          isCalculation: true,
          calcPhase: "mcq2",
          nextEnabled: false
        },
        9: {
          questionText: "Aktivitas Selesai!",
          navText: "Ketuk 'Mulai Ulang' untuk memulai kembali aktivitas",
          isCalculation: true,
          calcPhase: "final",
          isFinalStep: true,
          nextEnabled: true
        }
      },
      labels: {
        given: "Diketahui",
        toFind: "Ditanyakan",
        findings: "Temuan:",
        waterTankAlt: "Tangki air",
        zoomIndicatorAlt: "Indikator zoom",
        summaryVisualAlt: "Visual ringkasan",
        visualRepresentationAlt: "Representasi visual"
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
