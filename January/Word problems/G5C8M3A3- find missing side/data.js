const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

// Question 1: Scalene triangle – perimeter 54, sides 18 and 16, find missing side
const DATA1 = {
  en: {
    app: {
      start_over: "Restart",

      questionText: "Find the missing side length of the triangle below.",
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
            "Two sides of the triangle are 18 cm and 16 cm.",
            "Perimeter of the triangle = 54 cm",
          ],
          highlights: ["null", "null"]
        },
        toFind: {
          title: "To Find",
          data: ["Missing side length"],
          highlights: ["missing side length"]
        },
      },

      splash: {
        step2: {
          image: "assets/q1compre3.svg",
          text: "<blue>✓ Information gathered from the figure.</blue><br><yellow>Next - Find the missing side length of the triangle.</yellow>"
        }
      },

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

      mcqs: [
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

      calcRows: [
        { text: "[box] = 16 + 18 + a", answers: ["54"] },
        { text: "54 = [box] + a", answers: ["34"] },
        { text: "a = 54 - 34" },
        { text: "a = [box]", answers: ["20"] }
      ],

      finalAnswer: "The missing side length of the triangle 20 cm.",

      steps: {
        0: {
          questionText: "Find the missing side length of the triangle below.",
          navText: "Tap » to identify 'given' information.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        1: {
          questionText: "Find the missing side length of the triangle below.",
          navText: "Tap » to identify the 'given' information.",          
          navToFind: "Tap » to identify what do we need 'to find'.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/question1.svg",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false,
          statementInVisual: "Find the missing side length of the triangle below."
        },
        2: {
          questionText: "",
          navText: "Tap » to continue.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true
        },
        3: {
          questionText: "Let's label the missing side as 'a'.",
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
          image: "assets/q1compute2.svg",
          isCalculation: true,
          isMcqStep: true,
          nextEnabled: false
        },
        5: {
          questionText: "Let's find the missing side.",
          navText: "Use the numpad to fill the box and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q1compute2.svg",
          isCalculation: true,
          isCalcStep: true,
          nextEnabled: false
        },
        6: {
          questionText: "You have solved the question!",
          navText: "Tap » for the next question.",
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

// Question 2: Isosceles triangle – perimeter 77, two equal sides 27, find base
const DATA2 = {
  en: {
    app: {
      start_over: "Restart",

      questionText: "Find the missing side length of the triangle below.",
      questionImage: "assets/question2.svg",

      comprehend: {
        sectionTitle: "INFORMATION ANALYSIS",
        images: [
          "assets/q2compre1.svg",
          "assets/q2compre2.svg",
          "assets/q2compre3.svg",
          "assets/q2compre4.svg",
        ],
        given: {
          title: "Given,",
          data: [
            "Two sides of the triangle are equal",
            "Base = 27 cm",
            "Perimeter of the triangle = 77 cm",
          ],
          highlights: ["null", "null"]
        },
        toFind: {
          title: "To Find",
          data: ["Length of the marked side"],
          highlights: ["missing side length"]
        },
      },

      splash: {
        step2: {
          image: "assets/q2compre3.svg",
          text: "<blue>✓ Information gathered from the figure.</blue><br><yellow>Next - Find the missing side length of the triangle.</yellow>"
        }
      },

      findingsFormat: {
        title: "",
        givenLabel: "Given:",
        givenList: [
          "Two sides have same length and base = 27 cm.",
          "Perimeter of the triangle = 77 cm"
        ],
        toFindLabel: "To Find:",
        toFindList: ["Length of the marked side"]
      },

      mcqs: [
        {
          title: "What is the name of a triangle that has two sides equal in length?",
          options: [
            "A. Scalene triangle",
            "B. Isosceles triangle",
            "C. Right triangle",
            "D. Equilateral triangle"
          ],
          answerIndex: 1,
          formulaRow: null
        },
        {
          title: "What is the formula to calculate the perimeter of an isosceles triangle?",
          options: [
            "A. Side × Side",
            "B. 2 × equal side + base",
            "C. 3 × side",
            "D. Equal side + base"
          ],
          answerIndex: 1,
          formulaRow: "Perimeter of isosceles triangle = 2 × equal side + base"
        }
      ],

      calcRows: [
        { text: "[box] = 2 × a + [box]", answers: ["77", "27"] },
        { text: "2 × a = 77 - 27" },
        { text: "2 × a = [box]", answers: ["50"] },
        { text: "a = 50 ÷ 2 = [box]", answers: ["25"] }
      ],

      finalAnswer: "The missing side length of the triangle is 25 cm.",

      steps: {
        0: {
          questionText: "Find the missing side length of the triangle below.",
          navText: "Tap » to identify 'given' information.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        1: {
          questionText: "Find the missing side length of the triangle below.",
          navText: "Tap » to identify the 'given' information.",
          navToFind: "Tap » to identify what do we need 'to find'.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/question2.svg",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false,
          statementInVisual: "Find the missing side length of the triangle below."
        },
        2: {
          questionText: "",
          navText: "Tap » to continue.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true
        },
        3: {
          questionText: "Let's label the missing side as 'a'.",
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
          image: "assets/q2compute2.svg",
          isCalculation: true,
          isMcqStep: true,
          nextEnabled: false
        },
        5: {
          questionText: "Let's find the missing side.",
          navText: "Use the numpad to fill the box and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q2compute2.svg",
          isCalculation: true,
          isCalcStep: true,
          nextEnabled: false
        },
        6: {
          questionText: "You have solved the question!",
          navText: "Tap » for the next question.",
          image: "assets/q2compute2.svg",
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

// Question 3: Equilateral triangle – perimeter 114, find side length
const DATA3 = {
  en: {
    app: {
      start_over: "Restart",

      questionText: "Find the length of the side of the triangle below.",
      questionImage: "assets/question3.svg",

      comprehend: {
        sectionTitle: "INFORMATION ANALYSIS",
        images: [
          "assets/q3compre1.svg",
          "assets/q3compre2.svg",
          "assets/q3compre3.svg",
        ],
        given: {
          title: "Given,",
          data: [
            "The triangle has all 3 sides of equal length.",
            "Perimeter of the triangle = 114 cm",
          ],
          highlights: ["null", "null"]
        },
        toFind: {
          title: "To Find",
          data: ["Side length of the triangle"],
          highlights: ["length of the side"]
        },
      },

      splash: {
        step2: {
          image: "assets/q3compre3.svg",
          text: "<blue>✓ Information gathered from the figure.</blue><br><yellow>Next - Find the length of the side of the triangle.</yellow>"
        }
      },

      findingsFormat: {
        title: "",
        givenLabel: "Given:",
        givenList: [
          "The triangle has all 3 sides of equal length.",
          "Perimeter of the triangle = 114 cm"
        ],
        toFindLabel: "To Find:",
        toFindList: ["Side length of the triangle"]
      },

      mcqs: [
        {
          title: "What is the name of a triangle that has all sides equal in length?",
          options: [
            "A. Scalene triangle",
            "B. Isosceles triangle",
            "C. Right triangle",
            "D. Equilateral triangle"
          ],
          answerIndex: 3,
          formulaRow: null
        },
        {
          title: "What is the formula to calculate the perimeter of an equilateral triangle?",
          options: [
            "A. Side + Side",
            "B. 2 × Side",
            "C. 3 × Side",
            "D. Side × Side"
          ],
          answerIndex: 2,
          formulaRow: "Perimeter of equilateral triangle = 3 × Side"
        }
      ],

      calcRows: [
        { text: "[box] = 3 × a", answers: ["114"] },
        { text: "a = 114 ÷ 3" },
        { text: "a = [box]", answers: ["38"] }
      ],

      finalAnswer: "The side length of the triangle is 38 cm.",

      steps: {
        0: {
          questionText: "Find the length of the side of the triangle below.",
          navText: "Tap » to identify 'given' information.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        1: {
          questionText: "Find the length of the side of the triangle below.",
          navText: "Tap » to identify the 'given' information.",
          navToFind: "Tap » to identify what do we need 'to find'.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/question3.svg",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false,
          statementInVisual: "Find the length of the side of the triangle below."
        },
        2: {
          questionText: "",
          navText: "Tap » to continue.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true
        },
        3: {
          questionText: "Let's label the side length as 'a'.",
          navText: "Tap » to continue.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q3compute1.svg",
          isCalculation: true,
          isCalculationIntro: true,
          nextEnabled: true
        },
        4: {
          questionText: "Answer the questions below.",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q3compute2.svg",
          isCalculation: true,
          isMcqStep: true,
          nextEnabled: false
        },
        5: {
          questionText: "Let's find the side length.",
          navText: "Use the numpad to fill the box and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/q3compute2.svg",
          isCalculation: true,
          isCalcStep: true,
          nextEnabled: false
        },
        6: {
          questionText: "Activity Completed!",
          navText: "Tap 'Restart' to restart the activity",
          image: "assets/q3compute2.svg",
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

const questions = [DATA1, DATA2, DATA3];

// Current question data: APP_DATA = questions[question_idx][current_language].app
// Set by App.js based on question_idx; fallback for components that read before mount
const APP_DATA = questions[0][current_language].app;
const decimalSymbol = decimal[current_language];
