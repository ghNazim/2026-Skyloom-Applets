const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

// Question 1: Equilateral triangle (16 cm each side, perimeter 48 cm)
const DATA1 = {
  en: {
    app: {
      start_over: "»",
      questionText: "Calculate the perimeter of the following triangle.",
      questionImage: "assets/question.svg",
      comprehend: {
        sectionTitle: "INFORMATION ANALYSIS",
        images: ["assets/compre1.svg", "assets/compre2.svg"],
        given: {
          title: "Given,",
          data: ["Each side of the triangle = 16 cm"],
          highlights: ["null"]
        },
        toFind: {
          title: "To Find",
          data: ["Perimeter of the triangle"],
          highlights: ["perimeter"]
        },
      },
      splash: {
        step2: {
          image: "assets/compute1.svg",
          text: "<blue>✓ Information gathered from the figure.</blue><br><yellow>Next - Find the perimeter of the triangle.</yellow>"
        }
      },
      findingsFormat: {
        title: "INFORMATION ANALYSIS",
        givenLabel: "Given:",
        givenList: ["Each side of the triangle = 16 cm"],
        toFindLabel: "To Find:",
        toFindList: ["Perimeter of the triangle"]
      },
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
      perimeterCalc: {
        numpad1Answer: "16",
        numpad1MaxLength: 2,
        numpad2Answer: "48",
        numpad2MaxLength: 2
      },
      finalAnswer: "The perimeter of given equilateral triangle = 48 cm",
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
          navText: "Tap » to continue.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/question.svg",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false,
          statementInVisual: "Calculate the perimeter of the following triangle."
        },
        2: {
          questionText: "",
          navText: "Tap » to continue.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true
        },
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
        7: {
          questionText: "Question Completed!",
          navText: "Tap » to solve another question.",
          image: "assets/compute1.svg",
          isFinalStep: true,
          nextEnabled: true
        }
      },
      labels: { given: "Given", toFind: "To Find", findings: "Findings" }
    }
  }
};

// Question 2: Isosceles triangle (25 cm equal sides, 20 cm base, perimeter 70 cm)
const DATA2 = {
  en: {
    app: {
      start_over: "Restart",
      questionText: "Calculate the perimeter of the following triangle.",
      questionImage: "assets/question2.svg",
      comprehend: {
        sectionTitle: "INFORMATION ANALYSIS",
        images: ["assets/compre21.svg", "assets/compre22.svg","assets/compre23.svg"],
        given: {
          title: "Given,",
          data: ["Two equal sides = 25 cm", "Base = 20 cm"],
          highlights: ["null", "null"]
        },
        toFind: {
          title: "To Find",
          data: ["Perimeter of the triangle"],
          highlights: ["perimeter"]
        },
      },
      splash: {
        step2: {
          image: "assets/compute21.svg",
          text: "<blue>✓ Information gathered from the figure.</blue><br><yellow>Next - Find the perimeter of the triangle.</yellow>"
        }
      },
      findingsFormat: {
        title: "INFORMATION ANALYSIS",
        givenLabel: "Given:",
        givenList: ["Two equal sides = 25 cm", "Base = 20 cm"],
        toFindLabel: "To Find:",
        toFindList: ["Perimeter of the triangle"]
      },
      triangleMcq: {
        title: "What is the name of a triangle that has two sides equal in length?",
        options: [
          "A. Scalene triangle",
          "B. Isosceles triangle",
          "C. Right triangle",
          "D. Equilateral triangle"
        ],
        answerIndex: 1
      },
      formulaMcq: {
        title: "What is the formula to calculate the perimeter of an isosceles triangle?",
        options: [
          "A. Side × Side",
          "B. 2 × equal side + base",
          "C. 3 × side",
          "D. Equal side + base"
        ],
        answerIndex: 1,
        formulaRow: "Perimeter of isosceles triangle = 2 × equal side + base"
      },
      perimeterCalc: {
        numpad1Answers: ["25", "20"],
        numpad1MaxLength: 2,
        numpad2Answer: "70",
        numpad2MaxLength: 2
      },
      finalAnswer: "The perimeter of given isosceles triangle = 70 cm",
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
          navText: "Tap » to continue.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/question2.svg",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false,
          statementInVisual: "Calculate the perimeter of the following triangle."
        },
        2: {
          questionText: "",
          navText: "Tap » to continue.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true
        },
        3: {
          questionText: "Let's identify the given triangle.",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compute21.svg",
          isCalculation: true,
          isMcq: true,
          mcqKey: "triangleMcq",
          nextEnabled: false
        },
        4: {
          questionText: "Let's find the correct formula to calculating the perimeter.",
          navText: "Tap the correct formula.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compute21.svg",
          isCalculation: true,
          isMcq: true,
          mcqKey: "formulaMcq",
          nextEnabled: false
        },
        5: {
          questionText: "Let's find the perimeter.",
          navText: "Use the numpad to fill the boxes and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compute21.svg",
          isCalculation: true,
          isNumpad: true,
          numpadKey: "numpad1",
          nextEnabled: false
        },
        6: {
          questionText: "Let's find the perimeter.",
          navText: "Use the numpad to fill the answer and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compute21.svg",
          isCalculation: true,
          isNumpad: true,
          numpadKey: "numpad2",
          nextEnabled: false
        },
        7: {
          questionText: "Activity Completed!",
          navText: "Tap 'Restart' to restart the activity",
          image: "assets/compute21.svg",
          isFinalStep: true,
          nextEnabled: true
        }
      },
      labels: { given: "Given", toFind: "To Find", findings: "Findings" }
    }
  }
};

const questions = [DATA1, DATA2];

let _questionIdx = 0;
function setAppDataQuestionIdx(i) {
  _questionIdx = i;
}

const APP_DATA = new Proxy({}, {
  get(_, prop) {
    return questions[_questionIdx][current_language].app[prop];
  }
});

const decimalSymbol = decimal[current_language];
