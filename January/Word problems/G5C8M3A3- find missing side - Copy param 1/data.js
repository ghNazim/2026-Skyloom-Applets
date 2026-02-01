const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

// Master data structure for Find Missing Side Word Problem
const DATA = {
  en: {
    app: {
      start_over: "Restart",

      // Question text for display (step 0 and statement in visual)
      questionText: "Find the missing side length of the triangle below.",
      questionImage: "assets/question1.svg",

      // Comprehend step data (Step 1)
      comprehend: {
        sectionTitle: "INFORMATION ANALYSIS",
        images: [
          "assets/q1compre1.svg",
          "assets/q1compre2.svg","assets/q1compre3.svg",
        ],
        given: {
          title: "Given,",
          data: [
            "Two sides of the triangle are 18 cm and 16 cm.",
            "Perimeter of the triangle = 54 cm",
          ],
          highlights: ["null", "null"]
        },
        toFind: {
          title: "To Find",
          data: [
            "Missing side length"
          ],
          highlights: [
            "missing side length"
          ]
        },
      },

      // Splash screens data
      splash: {
        step2: {
          image: "assets/q1compre3.svg",
          text: "<blue>✓ Information gathered from the figure.</blue><br><yellow>Next - Find the missing side length of the triangle.</yellow>"
        }
      },

      // Findings format for calculation steps (steps 3+)
      findingsFormat: {
        title: "",
        givenLabel: "Given:",
        givenList: [
          "Sides of the triangle are 18 cm and 16 cm.",
          "Perimeter of the triangle = 54 cm"
        ],
        toFindLabel: "To Find:",
        toFindList: ["Missing side length"]
      },

      // MCQs array for step 4 - when last MCQ is answered, formulaRow from that item is added to calc left
      mcqs: [
        {
          title: "What is the name of a triangle that has all sides different in length?",
          options: [
            "A. Scalene triangle",
            "B. Isosceles triangle",
            "C. Right triangle",
            "D. Equilateral triangle"
          ],
          answerIndex: 0,
          formulaRow: null
        },
        {
          title: "Which of the following represents the perimeter of a triangle?",
          options: [
            "A. The length of one side of the triangle",
            "B. The sum of the lengths of any two sides",
            "C. The sum of the lengths of all three sides",
            "D. The area enclosed by the triangle"
          ],
          answerIndex: 2,
          formulaRow: "Perimeter = The sum of the lengths of all 3 sides"
        }
      ],

      // Calculation rows for step 5. Each row: { text: string, answers?: string[] }.
      // [box] in text is replaced by an input; answers[i] is correct value for i-th [box].
      // Rows without answers are display-only.
      calcRows: [
        { text: "[box] = 16 + 18 + a", answers: ["54"] },
        { text: "54 = [box] + a", answers: ["34"] },
        { text: "a = 54 - 34" },
        { text: "a = [box]", answers: ["20"] }
      ],

      // Final answer
      finalAnswer: "The missing side length of the triangle 20 cm.",

      // Steps configuration
      steps: {
        // Step 0: Initial comprehend - question + image only
        0: {
          questionText: "Find the missing side length of the triangle below.",
          navText: "Tap » to identify 'given' information.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        // Step 1: Comprehend with substeps (Given/To Find)
        1: {
          questionText: "Find the missing side length of the triangle below.",
          navText: "Tap » to continue.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/question1.svg",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false,
          statementInVisual: "Find the missing side length of the triangle below."
        },
        // Step 2: Splash screen
        2: {
          questionText: "",
          navText: "Tap » to continue.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true
        },
        // Step 3: Calculation panel - image + findings only, no calc rows, next enabled
        3: {
          questionText: "Let's label the missing side as 'a'.",
          navText: "Tap » to continue.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q1compute1.svg",
          isCalculation: true,
          isCalculationIntro: true,
          nextEnabled: true
        },
        // Step 4: MCQs - mcqs array; when last MCQ answered add formula row
        4: {
          questionText: "Answer the questions below.",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q1compute2.svg",
          isCalculation: true,
          isMcqStep: true,
          nextEnabled: false
        },
        // Step 5: Calculation step - calc rows with [box] inputs
        5: {
          questionText: "Let's find the missing side.",
          navText: "Use the numpad to fill the box and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q1compute2.svg",
          isCalculation: true,
          isCalcStep: true,
          nextEnabled: false
        },
        // Step 6: Final step - final answer only
        6: {
          questionText: "Activity Completed!",
          navText: "Tap 'Restart' to restart the activity",
          image: "assets/q1compute2.svg",
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
