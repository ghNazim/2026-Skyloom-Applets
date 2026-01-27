const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

// Master data structure
const DATA = {
  en: {
    app: {
      start: {
        heading: "Fractions to Decimal Numbers",
        text: "Let us explore how a digit's position after the decimal\npoint gives fractions with denominator <y>10</y> or <y>100</y>.",
        buttonText: "Start",
      },
      final: {
        heading: "Fractions to Decimal Numbers",
        text: "Great work!\nYou've explored how moving a digit across place values\nchanges its value by powers of <y>10</y>.",
        buttonText: "Start Over",
      },
      nav: {
        next: "Tap » to continue.",
      },
      steps: {
        1: {
          questionText: "A place-value chart shows each digit's position and its value.",
          navText: "Tap » to identify the number in the chart",
        },
        2: {
          questionText: "What number is shown in the place-value chart?",
          navText: "Tap the correct answer.",
          navTextAfterCorrect: "Tap » to understand the number in different forms.",
          mcq: {
            options: ["3", "30", "300", "30.0"],
            answer: "300",
            feedbacks: {
              wrong: "Not quite.\nThe digit 3 is in\nthe hundreds\nplace. Try again.",
              correct: "Correct! The\nnumber 3 is in the\nhundreds place,\nand the value of\nthe number is 300."
            }
          }
        },
        3: {
          questionText: "Using the place-value chart, we can write the number in standard form.",
          navText: "Tap »",
        },
        4: {
          questionText: "We can also write the number in the expanded form.",
          navText: "Tap »",
        },
        5: {
          questionText: "Now, what happens when the digit '3' moves to the right across the place values?",
          navText: "Tap » to explore.",
        },
        6: {
          questionText: "Let us move the digit '3' across the place values.",
          navText: "Tap the arrow to move the digit.",
          substeps: {
            1: {
              q: "Let us move the digit '3' across the place values.",
              n: "Tap the arrow to move the digit.",
              mcqQuestionText: "What number is shown in the place-value chart?",
              mcq: {
                options: [300, 3, 30],
                answer: 30
              }
            },
            2: {
              q: "Let us move the digit '3' further to the right.",
              n: "Tap the arrow to move the digit.",
              mcqQuestionText: "What number is shown in the place-value chart?",
              mcq: {
                options: [300, 3, 30],
                answer: 3
              }
            },
            3: {
              q: "Moving a digit one place to the right makes its value 10 times smaller.",
              n: "Tap »"
            }
          }
        },
        7: {
          questionText: "Moving the digit right is the same as moving the decimal point left —both make the value 10 times smaller.",
          navText: "Tap » to move the digit further."
        },
        8: {
          questionText: "Let us move '3' after the ones place and into the decimal places.",
          navText: "Tap the arrows to move the digit.",
          mcqQuestionText: "3 is in the tenths place. What is the value of the number?",
          mcq: {
            options: ["3.0", "0.3", "30.0"],
            answer: "0.3"
          },
          questionTextAfterCorrect: "Both the first place after the decimal and moving the decimal one place to the left give tenths.",
          navTextAfterCorrect: "Tap » to move the digit to the next place.",
          feedbackBoxText: "One place after the decimal or moving the decimal one place to the left gives a fraction with denominator 10."
        },
        9: {
          questionText: "Let us move the digit '3' one more place to the right.",
          navText: "Tap the arrows to move the digit.",
          mcqQuestionText: "3 is in the hundredths place. What is the value of the number?",
          mcq: {
            options: ["3.0", "0.3", "0.03"],
            answer: "0.03"
          },
          questionTextAfterCorrect: "Both the second place after the decimal and moving the decimal two places to the left give hundredths.",
          navTextAfterCorrect: "Tap » to explore this change in value again.",
          feedbackBoxText: "Two places after the decimal or moving the decimal two places to the left gives a fraction with denominator 100."
        },
        10: {
          questionText: "Notice how moving the digit to the right changes its value.",
          navText: "Tap the arrows to move the digit and explore its value again.",
          navTextAfterInteraction: "Tap » to summarize."
        },
        11: {
          type: "splash",
          splashType: "type1",
          heading: "The digit 3 is <y>one place</y> after the decimal point.",
          buttonText: "Continue",
          equation: {
            digits: ['0', '0', '0', '3'],
            decimalPosition: 3, // decimal point before index 3
            numerator: 3,
            denominator: 10,
            pulsateZeros: true,
            bracketCount: 1
          },
          feedbackText: "One digit after the decimal point gives the fraction with denominator <y>10</y>, and the digit 3 becomes the numerator."
        },
        12: {
          type: "splash",
          splashType: "type1",
          heading: "The digit 3 is <y>two places</y> after the decimal point.",
          buttonText: "Continue",
          equation: {
            digits: ['0', '0', '0', '0', '3'],
            decimalPosition: 3, // decimal point before index 3
            numerator: 3,
            denominator: 100,
            pulsateZeros: true,
            bracketCount: 2
          },
          feedbackText: "Two digits after the decimal point gives the fraction with denominator <y>100</y>, and the digit 3 becomes the numerator."
        },
        13: {
          type: "fullscreen",
          heading: "",
          text: "We understood how to write decimals as fractions.\n\nNow, let's summarize how to write fractions as decimals.",
          buttonText: "Continue"
        },
        14: {
          type: "splash",
          splashType: "type2",
          heading: "One zero in the denominator <y>mean the decimal point moves</y> one place <y>to the left.</y>",
          buttonText: "Continue",
          equation: {
            numerator: 3,
            denominator: 10,
            // 0(grey) 0(yellow) . (active) 3(white) . (inactive) 0 0 0(grey)
            decimalDisplay: [
              { type: 'char', value: '0', color: 'grey' },
              { type: 'char', value: '0', color: 'yellow' },
              { type: 'dot', active: true },
              { type: 'char', value: '3', color: 'white' },
              { type: 'dot', active: false },
              { type: 'char', value: '0', color: 'grey' },
              { type: 'char', value: '0', color: 'grey' },
              { type: 'char', value: '0', color: 'grey' }
            ],
            arrowCount: 1,
            numeratorLabel: "Numerator = Digits after the decimal point",
            denominatorLabel: "Denominator = 10"
          },
          feedbackText: "The number of zeros in the denominator tells how many places to move the decimal to the left, starting after the numerator."
        },
        15: {
          type: "splash",
          splashType: "type2",
          heading: "Two zeros in the denominator <y>mean the decimal point moves</y> two places <y>to the left.</y>",
          buttonText: "Continue",
          equation: {
            numerator: 3,
            denominator: 100,
            // 0(yellow) . (active) 0(yellow) . (inactive) 3(white) . (inactive) 0 0 0(grey)
            decimalDisplay: [
              { type: 'char', value: '0', color: 'yellow' },
              { type: 'dot', active: true },
              { type: 'char', value: '0', color: 'yellow' },
              { type: 'dot', active: false },
              { type: 'char', value: '3', color: 'white' },
              { type: 'dot', active: false },
              { type: 'char', value: '0', color: 'grey' },
              { type: 'char', value: '0', color: 'grey' },
              { type: 'char', value: '0', color: 'grey' }
            ],
            arrowCount: 2,
            numeratorLabel: "Numerator = Digits after the decimal point",
            denominatorLabel: "Denominator = 100"
          },
          feedbackText: "The number of zeros in the denominator tells how many places to move the decimal to the left, starting after the numerator."
        },
        16: {
          type: "dndQuestion",
          questionText: "Write the given fraction in decimal form.",
          navText: "Drag the decimal point to move it to the left, then tap check.",
          navTextAfterCorrect: "Tap » to try another fraction.",
          navTextComplete: "Tap » to complete activity.",
          feedbacks: {
            wrong: "Not quite!\nCount the\nzeros in the\ndenominator\nand move the\ndecimal to the\nleft that many\nplaces.",
            correct: "Great job!\nMoving the\ndecimal point\n{places} places to\nthe left gives\n{result}."
          },
          questions: [
            { num: 8, den: 100, rightNum: "0080" },
            { num: 45, den: 100, rightNum: "0450" },
            { num: 23, den: 10, rightNum: "0230" },
            { num: 56, den: 10, rightNum: "0560" },
            { num: 235, den: 100, rightNum: "2350" },
            { num: 96, den: 100, rightNum: "0960" }
          ]
        },
        17: {
          type: "fullscreen",
          heading: "Fractions and Decimal",
          text: "Awesome!<br><br>When writing fractions with denominators 10 or 100 as decimals,<br><br>● The denominator tells how many places to move the decimal point left.<br><br>● The numerator becomes the digits of the decimal.",
          buttonText: "Start Over"
        },
      },
      labels: {
        placeValueChart: "Place value chart",
        standardForm: "Value of number in standard form",
        expandedForm: "Expanded form of the number",
      },
      placeLabels: ["H", "T", "O", "t", "h"],
      placeNames: ["hundreds", "tens", "ones", "tenths", "hundredths"],
    },
  },
  
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
