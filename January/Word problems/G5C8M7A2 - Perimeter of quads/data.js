const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

// Question 1: parallelogram – perimeter 60 cm, AB = 9 cm, find AD
const DATA1 = {
  en: {
    app: {
      start_over: "Restart",

      questionText: "The perimeter of the parallelogram is 60 cm. If AB = 9 cm, find the length of AD.",
      questionImage: "assets/question1.svg",

      comprehend: {
        sectionTitle: "INFORMATION ANALYSIS",
        images: [
          "assets/q1compre1.svg",
          "assets/q1compre2.svg",
          "assets/q1compre3.svg",
        ],
        given: {
          title: "Given,",
          data: [
            "The perimeter of the parallelogram = 60 cm.",
            "Length = AB = 9 cm.",
          ],
          highlights: ["60 cm", "AB = 9 cm"]
        },
        toFind: {
          title: "To Find",
          data: ["Length of AD"],
          highlights: ["length of AD"]
        },
      },

      splash: {
        step2: {
          image: "assets/q1compre3.svg",
          text: "<blue>✓ Information gathered from the figure.</blue><br><yellow>Next - Find the length of AD.</yellow>"
        }
      },

      findingsFormat: {
        title: "",
        givenLabel: "Given:",
        givenList: [
          "The perimeter of the parallelogram = 60 cm.",
          "Length = AB = 9 cm."
        ],
        toFindLabel: "To Find:",
        toFindList: ["Length of AD"]
      },

      mcqs: [
        {
          title: "What is the formula for the perimeter of a parallelogram?",
          options: [
            "A. length + breadth",
            "B. 2 × length + breadth",
            "C. 2 × (length + breadth)",
            "D. length × breadth"
          ],
          answerIndex: 2,
          formulaRow: "Perimeter of parallelogram = 2 × (length + breadth)"
        }
      ],

      calcRows: [
        { text: "[box] = 2 × ([box] + AD)", answers: ["60", "9"] },
        { text: "2 × (9 + AD) = 60" },
        { text: "(9 + AD) = 60 ÷ 2" },
        { text: "(9 + AD) = [box]", answers: ["30"] },
        { text: "AD = 30 – 9" },
        { text: "AD = [box] cm", answers: ["21"] }
      ],

      finalAnswer: "So, the length of AD = 21 cm",

      steps: {
        0: {
          questionText: "Read the question and identify 'given' and 'to find'.",
          navText: "Tap » to identify 'given' information.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        1: {
          questionText: "Read the question and identify 'given' and 'to find'.",
          navText: "Tap » to identify the 'given' information.",
          navToFind: "Tap » to identify what do we need 'to find'.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q1compre0.svg",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false,
          statementInVisual: "The perimeter of the parallelogram is 60 cm. If AB = 9 cm, find the length of AD."
        },
        2: {
          questionText: "",
          navText: "Tap » to continue.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true
        },
        3: {
          questionText: "Let's use the formula to find AD.",
          navText: "Tap » to continue.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q1compute1.svg",
          isCalculation: true,
          isCalculationIntro: true,
          nextEnabled: true
        },
        4: {
          questionText: "Answer the questions below.",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q1compute1.svg",
          isCalculation: true,
          isMcqStep: true,
          nextEnabled: false
        },
        5: {
          questionText: "Let's find the length of AD.",
          navText: "Use the numpad to fill the box and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q1compute1.svg",
          isCalculation: true,
          isCalcStep: true,
          nextEnabled: false
        },
        6: {
          questionText: "You have solved the question!",
          navText: "Tap » for the next question.",
          image: "assets/q1computeFinal.svg",
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

// Question 2: rhombus – perimeter 92 cm, find side length
const DATA2 = {
  en: {
    app: {
      start_over: "Restart",

      questionText: "The perimeter of the rhombus is 92 cm. Determine the length of its side.",
      questionImage: "assets/question2.svg",

      comprehend: {
        sectionTitle: "INFORMATION ANALYSIS",
        images: [
          "assets/q2compre1.svg",
          "assets/q2compre2.svg",
        
        ],
        given: {
          title: "Given,",
          data: [
            "The perimeter of the rhombus = 92 cm.",
          ],
          highlights: ["92 cm"]
        },
        toFind: {
          title: "To Find",
          data: ["Side length of the rhombus"],
          highlights: ["length of its side"]
        },
      },

      splash: {
        step2: {
          image: "assets/q2compre2.svg",
          text: "<blue>✓ Information gathered from the figure.</blue><br><yellow>Next - Determine the length of its side.</yellow>"
        }
      },

      findingsFormat: {
        title: "",
        givenLabel: "Given:",
        givenList: [
          "The perimeter of the rhombus = 92 cm."
        ],
        toFindLabel: "To Find:",
        toFindList: ["Side length of the rhombus"]
      },

      mcqs: [
        {
          title: "What is the formula for the perimeter of a rhombus?",
          options: [
            "A. side + side",
            "B. 2 × side",
            "C. 4 × side",
            "D. side × side"
          ],
          answerIndex: 2,
          formulaRow: "Perimeter of rhombus = 4 × Side length"
        }
      ],

      calcRows: [
        { text: "[box] = 4 × AB", answers: ["92"] },
        { text: "4 × AB = 92" },
        { text: "AB = 92 ÷ 4" },
        { text: "AB = [box] cm", answers: ["23"] }
      ],

      finalAnswer: "The side length of the rhombus is 23 cm.",

      steps: {
        0: {
          questionText: "Read the question and identify 'given' and 'to find'.",
          navText: "Tap » to identify 'given' information.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        1: {
          questionText: "Read the question and identify 'given' and 'to find'.",
          navText: "Tap » to identify the 'given' information.",
          navToFind: "Tap » to identify what do we need 'to find'.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q2compre0.svg",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false,
          statementInVisual: "The perimeter of the rhombus is 92 cm. Determine the length of its side."
        },
        2: {
          questionText: "",
          navText: "Tap » to continue.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true
        },
        3: {
          questionText: "Let's label the side length as 'AB'.",
          navText: "Tap » to continue.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q2compute1.svg",
          isCalculation: true,
          isCalculationIntro: true,
          nextEnabled: true
        },
        4: {
          questionText: "Answer the questions below.",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q2compute1.svg",
          isCalculation: true,
          isMcqStep: true,
          nextEnabled: false
        },
        5: {
          questionText: "Let's find the side length.",
          navText: "Use the numpad to fill the box and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q2compute1.svg",
          isCalculation: true,
          isCalcStep: true,
          nextEnabled: false
        },
        6: {
          questionText: "You have solved the question!",
          navText: "Tap 'Restart' to restart the activity",
          image: "assets/q2computeFinal.svg",
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

const questions = [DATA1, DATA2];

// Current question data: APP_DATA = questions[question_idx][current_language].app
// Set by App.js based on question_idx; fallback for components that read before mount
const APP_DATA = questions[0][current_language].app;
const decimalSymbol = decimal[current_language];
