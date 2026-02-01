const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

// Master data structure for Triangle Perimeter Word Problem
const DATA = {
  en: {
    app: {
      start_over: "Restart",

      // Question text for display (step 0 and statement in visual)
      questionText: "Calculate the perimeter of the following triangle.",
      questionImage: "assets/question.svg",

      // Comprehend step data (Step 1)
      comprehend: {
        sectionTitle: "INFORMATION ANALYSIS",
        images: [
          "assets/compre1.svg",
          "assets/compre2.svg",
        ],
        given: {
          title: "Given,",
          data: [
            "Each side of the triangle = 16 cm",
          ],
          highlights: ["null"]
        },
        toFind: {
          title: "To Find",
          data: [
            "Perimeter of the triangle"
          ],
          highlights: [
            "perimeter"
          ]
        },
      },

      // Splash screens data
      splash: {
        step2: {
          image: "assets/compute1.svg",
          text: "<blue>✓ Information gathered from the figure.</blue><br><yellow>Next - Find the perimeter of the triangle.</yellow>"
        }
      },

      // Findings format for calculation steps (steps 3+)
      findingsFormat: {
        title: "INFORMATION ANALYSIS",
        givenLabel: "Given:",
        givenList: ["Each side of the triangle = 16 cm"],
        toFindLabel: "To Find:",
        toFindList: ["Perimeter of the triangle"]
      },

      // Triangle type MCQ (Step 3)
      triangleMcq: {
        title: "What is the name of a triangle that has all sides equal in length?",
        options: [
          "A. Scalene triangle",
          "B. Isosceles triangle",
          "C. Right triangle",
          "D. Equilateral triangle"
        ],
        answerIndex: 3
      },

      // Formula MCQ (Step 4)
      formulaMcq: {
        title: "What is the formula to calculate the perimeter of an equilateral triangle?",
        options: [
          "A. Side + Side",
          "B. 2 × Side",
          "C. 3 × Side",
          "D. Side × Side"
        ],
        answerIndex: 2,
        formulaRow: "Perimeter of equilateral triangle = 3 × Side"
      },

      // Perimeter calculation (Steps 5-6)
      perimeterCalc: {
        numpad1Answer: "16",
        numpad2Answer: "48",
        numpad1MaxLength: 2,
        numpad2MaxLength: 2
      },

      // Final answer
      finalAnswer: "The perimeter of given equilateral triangle = 48 cm",

      // Steps configuration
      steps: {
        // Step 0: Initial comprehend - question + image only
        0: {
          questionText: "Read the question and identify 'given' and 'to find'.",
          navText: "Tap » to identify 'given' information.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        // Step 1: Comprehend with substeps (Given/To Find) - statement in visual, highlights in question-row
        1: {
          questionText: "Read the question and identify 'given' and 'to find'.",
          navText: "Tap » to continue.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/question.svg",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false,
          statementInVisual: "Calculate the perimeter of the following triangle."
        },
        // Step 2: Splash screen
        2: {
          questionText: "",
          navText: "Tap » to continue.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true
        },
        // Step 3: Identify triangle type - calculation panel + findings + MCQ
        3: {
          questionText: "Let's identify the given triangle.",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compute1.svg",
          isCalculation: true,
          isMcq: true,
          mcqKey: "triangleMcq",
          nextEnabled: false
        },
        // Step 4: Formula MCQ - on correct add formula row
        4: {
          questionText: "Let's find the correct formula to calculating the perimeter.",
          navText: "Tap the correct formula.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compute1.svg",
          isCalculation: true,
          isMcq: true,
          mcqKey: "formulaMcq",
          nextEnabled: false
        },
        // Step 5: Numpad for side value (16)
        5: {
          questionText: "Let's find the perimeter.",
          navText: "Use the numpad to fill the box and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compute1.svg",
          isCalculation: true,
          isNumpad: true,
          numpadKey: "numpad1",
          nextEnabled: false
        },
        // Step 6: Numpad for perimeter result (48)
        6: {
          questionText: "Let's find the perimeter.",
          navText: "Use the numpad to fill the answer and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compute1.svg",
          isCalculation: true,
          isNumpad: true,
          numpadKey: "numpad2",
          nextEnabled: false
        },
        // Step 7: Final step
        7: {
          questionText: "Activity Completed!",
          navText: "Tap 'Restart' to restart the activity",
          image: "assets/compute1.svg",
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
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
