const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

// Master data structure for Stone Blocks Word Problem (half used, volume left in cm³)
const DATA = {
  en: {
    app: {
      start_over: "Restart",

      // Comprehend question (step 0 and used in step 5 question div)
      questionText: "Farhan has three huge blocks of stones for his construction project. If he has 3 stones of volumes 1 m³, 2 m³, and 4 m³, and if half of each stone is used, how many cm³ of stone will he be left with?",

      // Comprehend step data (Step 1)
      comprehend: {
        sectionTitle: "INFORMATION ANALYSIS",
        images: [
          "assets/compre1.png",
          "assets/compre2.png",
          "assets/compre3.png",
          "assets/compre4.png",
          "assets/compre5.png"
        ],
        given: {
          title: "Given,",
          data: [
            "Volume of stone A = 1 m³",
            "Volume of stone B = 2 m³",
            "Volume of stone C = 4 m³",
            "Half of each stone is used"
          ],
          highlights: [
            "1 m³",
            "2 m³",
            "4 m³",
            "half of each stone is used"
          ]
        },
        toFind: {
          title: "To Find",
          data: [
            "Total volume left after using half of each stone, in cm³"
          ],
          highlights: [
            "how many cm³ of stone will he be left with"
          ]
        },
      },

      // Splash screens data
      splash: {
        step2: {
          image: "assets/compre4.png",
          text: "<blue>✓ Information gathered from the figure.</blue><br><yellow>Next – Build a mathematical sentence to find the total volume of all 3 stones.</yellow>"
        }
      },

      // Drag and Drop data for Step 3 (Total volume equation – 5 drop zones)
      dragDrop1: {
        equationLabel: "Total volume all 3 stones",
        equationRowPrefix: "",
        // Parts: string or zone index (0-based). Renders "= [zone0] + [zone1] + [zone2] + [zone3] + [zone4]"
        equationLineParts: ["= ", 0, " ", 1, " ", 2, " ", 3, " ", 4],
        dropZones: [
          { id: "zone1", correctAnswers: ["Volume of A", "Volume of B", "Volume of C"], placeholder: "Volume of A" },
          { id: "zone2", correctAnswer: "+", placeholder: "+" },
          { id: "zone3", correctAnswers: ["Volume of A", "Volume of B", "Volume of C"], placeholder: "Volume of B" },
          { id: "zone4", correctAnswer: "+", placeholder: "+" },
          { id: "zone5", correctAnswers: ["Volume of A", "Volume of B", "Volume of C"], placeholder: "Volume of C" }
        ],
        draggables: [
          { id: "d1", text: "Volume of A" },
          { id: "d2", text: "Volume of B" },
          { id: "d3", text: "Volume of C" },
          { id: "d4", text: "+" },
          { id: "d5", text: "-" },
          { id: "d6", text: "+" },
          { id: "d7", text: "-" }
        ],
        showFindings: false,
        findingsTitle: "",
        findingsList: [],
        altTextImage: "Stones"
      },

      // Drag and Drop data for Step 5 (Volume of half – question div, 3 drop zones)
      dragDrop2: {
        equationLabel: "",
        equationRowPrefix: "Volume of half of stones = ",
        dropZones: [
          { id: "zone1", correctAnswer: "Total Volume", placeholder: "Total Volume" },
          { id: "zone2", correctAnswer: "÷", placeholder: "÷" },
          { id: "zone3", correctAnswer: "2", placeholder: "2" }
        ],
        draggables: [
          { id: "d1", text: "Volume of A" },
          { id: "d2", text: "Volume of B" },
          { id: "d3", text: "Volume of C" },
          { id: "d4", text: "Total Volume" },
          { id: "d5", text: "+" },
          { id: "d6", text: "×" },
          { id: "d7", text: "÷" },
          { id: "d8", text: "4" },
          { id: "d9", text: "2" },
          { id: "d10", text: "3" }
        ],
        showFindings: true,
        findingsTitle: "Findings",
        findingsList: ["Volume of all 3 stones = 7 m³"],
        showQuestionInsteadOfImage: true,
        questionText: "Farhan has three huge blocks of stones for his construction project. If he has 3 stones of volumes 1 m³, 2 m³, and 4 m³, and if half of each stone is used, how many cm³ of stone will he be left with?",
        altTextImage: "Stones"
      },

      // Calculation data for Step 4 (Total volume – 3 boxes then 1 box)
      calculation1: {
        rows: [
          { type: "label", text: "Total volume all 3 stones" },
          { type: "equation", text: "= Volume of A + Volume of B + Volume of C" },
          { type: "fillRow", parts: ["= ", "box", " + ", "box", " + ", "box"], answers: ["1", "2", "4"], unit: " m³" },
          { type: "resultRow", answer: "7", unit: " m³" }
        ],
        findingsTitle: "Findings",
        findingsListStep4: [],
        findingsListStep5: ["Volume of all 3 stones = 7 m³"]
      },

      // Calculation data for Step 6 (Volume of half)
      calculation2: {
        rows: [
          { type: "label", text: "Volume of half of stones = Total Volume ÷ 2" },
          { type: "fillRow", parts: ["Volume of half of stones = ", "box", " m³ ÷ 2"], answers: ["7"], unit: "" },
          { type: "resultRow", text: "Volume of half of stones = 3.5 m³" }
        ],
        numpadAnswer: "7",
        numpadMaxLength: 1,
        findingsList: ["Volume of all 3 stones = 7 m³"],
        findingHalf: "Volume of half of the stones = 3.5 m³"
      },

      // MCQ for step 7 (m³ to cm³ conversion)
      conversionMcq: {
        title: "How do we convert m³ to cm³?",
        options: [
          "A. Multiply volume value (in m³) by 100",
          "B. Multiply volume value (in m³) by 1,000",
          "C. Multiply volume value (in m³) by 1,000,000",
          "D. Divide volume value (in m³) by 1,000,000"
        ],
        answerIndex: 2,
        conversionFinding: "1 m³ = 1,000,000 cm³",
        calcRowsOnAnswer: [
          "Volume of half of stones in cm³",
          "= Volume in m³ × 1,000,000"
        ]
      },

      // Step 8: interactive substitution row
      calculation3: {
        substituteRow: "= [[Volume in m³]] × 1,000,000",
        substitutePlaceholder: "Volume in m³",
        substituteValue: "3.5",
        substitutedRow: "= 3.5 × 1,000,000 cm³"
      },

      // Step 9: final row and answer
      calculationFinal: {
        finalRow: "= 3,500,000 cm³",
        finalAnswer: "So, Farhan will be left with 3,500,000 cm³ of stone."
      },

      // Calculation display strings / units
      calculation: {
        units: { m3: "m³", cm3: "cm³" },
        altTexts: { stones: "Stones" }
      },

      // Steps configuration (0–9)
      steps: {
        0: {
          questionText: "Read the question and identify 'given' and 'to find'.",
          navText: "Tap » to identify 'given' information.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        1: {
          questionText: "Farhan has three huge blocks of stones for his construction project. If he has 3 stones of volumes 1 m³, 2 m³, and 4 m³, and if half of each stone is used, how many cm³ of stone will he be left with?",
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
          questionText: "Build a mathematical sentence to find the total volume of all 3 stones.",
          navText: "Drag the correct buttons to the correct spot in the sentence.",
          navTextCorrect: "Tap » to substitute the values into the equation.",
          image: "assets/compre4.png",
          isDragDrop: true,
          dragDropKey: "dragDrop1",
          showFindingsInDragDrop: false,
          nextEnabled: false
        },
        4: {
          questionText: "Let's find the total volume.",
          navText: "Use the numpad to fill the box, then tap ✓.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre4.png",
          isCalculation: true,
          calcKey: "calc1",
          nextEnabled: false
        },
        5: {
          questionText: "Build a mathematical sentence to find the volume of half of the stones.",
          navText: "Drag the correct buttons to the correct spot in the sentence.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre4.png",
          isDragDrop: true,
          dragDropKey: "dragDrop2",
          showFindingsInDragDrop: true,
          nextEnabled: false
        },
        6: {
          questionText: "Let's find the volume of half of stones.",
          navText: "Use the numpad to fill the box, then tap ✓.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre4.png",
          isCalculation: true,
          calcKey: "calc2",
          nextEnabled: false
        },
        7: {
          questionText: "How do we convert m³ to cm³?",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre4.png",
          isMcq: true,
          nextEnabled: false
        },
        8: {
          questionText: "Substitute the volume in m³ into the equation.",
          navText: "Tap the highlighted box to substitute the value.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre4.png",
          isCalculation: true,
          calcKey: "calc3",
          nextEnabled: false
        },
        9: {
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
  id: {}
};

const APP_DATA = (DATA[current_language] && DATA[current_language].app) ? DATA[current_language].app : DATA.en.app;
const decimalSymbol = decimal[current_language];
