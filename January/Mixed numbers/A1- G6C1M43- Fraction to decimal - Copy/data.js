// Master data structure for Mixed Numbers to Decimal Numbers applet
const DATA = {
  en: {
    app: {
      start: {
        heading: "Mixed Numbers to Decimal Numbers",
        text: "Let us learn how <y>mixed numbers</y> are written as<br><y>decimal numbers</y>.",
        buttonText: "Start",
      },
      steps: {
        1: {
          questionText: "Identify the fractional part in the mixed number.",
          navText: "Tap the fractional part in the mixed number.",
        },
        2: {
          questionText:
            "Rewrite the fractional part with a denominator of {{targetDen}}.",
          navText: "Enter the multiplier using the numpad.",
        },
        3: {
          questionText: "What is the decimal form of this fraction?",
          navText: "Tap the correct answer.",
        },
        4: {
          questionText: "Combine the whole part and the decimal part.",
          navText: "Tap the 'and' button to combine.",
        },
        5: {
          questionText: "",
          navText: "",
        },
      },
      // Final screen after all questions (step 6)
      step6Final: {
        heading: "Mixed Numbers to Decimal Numbers",
        text: "<left>Awesome!<br>To write the mixed number as a decimal:<br>● Write the <y>whole part</y> and the <y>fractional part</y>.<br>● Make the <y>denominator</y> of the <y>fractional part</y> 10 or 100.<br>● Convert to a decimal form and combine with whole number.</left>",
        buttonText: "Start Over",
      },
      // Common text elements
      equalsSign: "=",
      andText: "and",
      multiplySign: "×",
      // Summary component texts
      summaryHeading: "Mixed Numbers to Decimal Numbers",
      summaryContinueButton: "Continue.",
      summarySubheadingWithConvert:
        "When the fractional part does not have a 10 or 100 denominator...",
      summarySubheadingNoConvert:
        "When the fractional part has a 10 or 100 denominator...",
      summaryCardTexts: [
        "Convert the fractional part to a denominator of 10.",
        "Write the fraction with denominator 10 as a decimal.",
        "Combine both whole number and decimal part.",
      ],
      summaryCardTextsNoConvert: [
        "Convert the fractional part to decimal form.",
        "Combine both whole number and decimal part.",
      ],
      // Questions array: order [3 5/10, 7 2/5, 4 3/25]
      questions: [
        {
          // Question 1: 3 5/10 -> 3.5 (skip step 2)
          whole: 3,
          numerator: 5,
          denominator: 10,
          skipStep2: true,
          multiplier: 1,
          targetDenominator: 10,
          convertedNumerator: 5,
          convertedDenominator: 10,
          decimalValue: "0.5",
          finalDecimal: "3.5",
          mcqOptions: ["0.5", "5.0", "0.05", "0.3"],
          mcqAnswerIndex: 0,
          mcqFeedbacks: [
            "Correct!",
            "Oops! We need\ntenths, not\nwholes.",
            "Oops! We need\ntenths, not\nhundredths.",
            "Oops! Check\nthe digit in the\nnumerator of\nthe fraction.",
          ],
          step1NavTextFinal: "",
          questionTextStep4: "Express 3 wholes and 0.5 as a single number.",
          questionTextStep4Complete:
            "We have the decimal form of the mixed number.",
          navTextStep4Complete: "Tap » to summarize.",
        },
        {
          // Question 2: 7 2/5 -> 7.4
          whole: 7,
          numerator: 2,
          denominator: 5,
          skipStep2: false,
          multiplier: 2,
          targetDenominator: 10,
          convertedNumerator: 4,
          convertedDenominator: 10,
          decimalValue: "0.4",
          finalDecimal: "7.4",
          mcqOptions: ["0.4", "4.0", "0.04", "0.7"],
          mcqAnswerIndex: 0,
          mcqFeedbacks: [
            "Correct!",
            "Oops! We need\ntenths, not\nwholes.",
            "Oops! We need\ntenths, not\nhundredths.",
            "Oops! Check\nthe digit in the\nnumerator of\nthe fraction.",
          ],
          step1NavTextFinal:
            "Tap » to rewrite the fractional part with a denominator of 10.",
          questionTextStep4: "Express 7 wholes and 0.4 as a single number.",
          questionTextStep4Complete:
            "We have the decimal form of the mixed number.",
          navTextStep4Complete: "Tap » to summarize.",
        },
        {
          // Question 3: 4 3/25 -> 4.12
          whole: 4,
          numerator: 3,
          denominator: 25,
          skipStep2: false,
          multiplier: 4,
          targetDenominator: 100,
          convertedNumerator: 12,
          convertedDenominator: 100,
          decimalValue: "0.12",
          finalDecimal: "4.12",
          mcqOptions: ["0.12", "12", "1.2", "0.43"],
          mcqAnswerIndex: 0,
          mcqFeedbacks: [
            "Correct!",
            "Oops! We need\nhundredths, not\ntenths.",
            "Oops! Check\nthe digit in the\nnumerator of\nthe fraction.",
            "Oops! Check\nthe digit in the\nnumerator of\nthe fraction.",
          ],
          step1NavTextFinal:
            "Tap » to rewrite the fractional part with a denominator of 100.",
          questionTextStep4: "Express 4 wholes and 0.12 as a single number.",
          questionTextStep4Complete:
            "We have the decimal form of the mixed number.",
          navTextStep4Complete: "Tap » to summarize.",
        },
      ],
    },
  },
};

const APP_DATA = DATA[current_language].app;

/**
 * Returns step data for the given step and question index.
 */
function getStepData(step, questionIndex) {
  const q = APP_DATA.questions && APP_DATA.questions[questionIndex];
  if (!q) return null;
  const steps = APP_DATA.steps;

  const base = {
    whole: q.whole,
    numerator: q.numerator,
    denominator: q.denominator,
    equalsSign: APP_DATA.equalsSign,
    andText: APP_DATA.andText,
    multiplySign: APP_DATA.multiplySign,
    skipStep2: q.skipStep2,
    multiplier: q.multiplier,
    targetDenominator: q.targetDenominator,
    convertedNumerator: q.convertedNumerator,
    convertedDenominator: q.convertedDenominator,
    decimalValue: q.decimalValue,
    finalDecimal: q.finalDecimal,
  };

  if (step === 1) {
    return {
      ...base,
      questionText: steps[1].questionText,
      navText: steps[1].navText,
      navTextFinal: q.step1NavTextFinal,
    };
  }
  if (step === 2) {
    const qText = steps[2].questionText.replace(
      "{{targetDen}}",
      String(q.targetDenominator),
    );
    return {
      ...base,
      questionText: qText,
      navText: steps[2].navText,
    };
  }
  if (step === 3) {
    return {
      ...base,
      questionText: steps[3].questionText,
      navText: steps[3].navText,
      mcqOptions: q.mcqOptions,
      mcqAnswerIndex: q.mcqAnswerIndex,
      mcqFeedbacks: q.mcqFeedbacks,
    };
  }
  if (step === 4) {
    return {
      ...base,
      questionText: q.questionTextStep4,
      navText: steps[4].navText,
      questionTextComplete: q.questionTextStep4Complete,
      navTextComplete: q.navTextStep4Complete,
    };
  }
  if (step === 5) {
    return {
      ...base,
      questionText: steps[5].questionText,
      navText: steps[5].navText,
    };
  }
  return null;
}
