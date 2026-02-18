// Master data structure for Fractions to Decimal Numbers applet
const DATA = {
  en: {
    app: {
      start: {
        heading: "Fractions to Decimal Numbers",
        text: "Let us learn how fractions with denominator other than<br>10 or 100 are written as decimals.",
        buttonText: "Start",
      },
      steps: {
        1: {
          questionText: "Let us convert this fraction into a decimal.",
          navText: "Tap » to begin.",
        },
        2: {
          questionText:
            "Which denominator makes this fraction easy to write as a decimal?",
          navText: "Tap the correct answer.",
          navAfterCorrect:
            "Tap » to convert the denominator to {{targetDen}}.",
        },
        3: {
          questionText:
            "How do we convert the denominator of this fraction to {{targetDen}}?",
          navText: "Tap the correct answer.",
          navAfterCorrect: "Tap » to {{operation}} by the same number.",
          extraText:
            "...the numerator and\ndenominator by the\nsame number.",
        },
        4: {
          questionText:
            "What is the correct {{operation_noun}}?",
          navText: "Use the numpad to enter the value.",
        },
        5: {
          questionText:
            "The resulting fraction has the same value, with denominator {{targetDen}}.",
          navText: "",
        },
        6: {
          questionText:
            "Now choose the correct decimal form of this fraction.",
          navText: "Tap the correct answer.",
          navAfterCorrect: "Tap » to summarize.",
          questionAfterCorrect:
            "A denominator of {{targetDen}} gives a decimal in {{placeValue}}.",
        },
        7: {
          questionText: "",
          navText: "",
        },
      },
      // Final screen after all questions (step 8)
      step8Final: {
        heading: "Fractions and Decimal",
        text: "<left>Awesome!<br>To write the given fraction as a decimal:<br>● Convert the denominator to 10 or 100.<br>● Write the fraction with denominator 10 or 100 as a<br>decimal.</left>",
        buttonText: "Start Over",
      },
      // Common text elements
      equalsSign: "=",
      multiplySign: "×",
      divideSign: "÷",
      common: {
        multiplyVerb: "multiply",
        divideVerb: "divide",
      },
      // Summary component texts
      summaryHeading: "Fractions to Decimal Numbers",
      summaryContinueButton: "Continue.",
      summarySubheading:
        "Convert the denominator to {{targetDen}} to write the fraction as a decimal.",
      summaryCardTexts: [
        "Write an equivalent fraction with denominator {{targetDen}}.",
        "Write the fraction as decimal number.",
      ],
      // Place value texts
      placeValueTenths: "tenths",
      placeValueHundredths: "hundredths",
      // Questions array
      questions: [
        {
          // Question 1: 2/5 -> 0.4
          numerator: 2,
          denominator: 5,
          targetDenominator: 10,
          operation: "multiply", // Key for internal logic
          operationSymbol: "×",
          operationNoun: "multiplier",
          multiplier: 2,
          convertedNumerator: 4,
          convertedDenominator: 10,
          decimalValue: "0.4",
          placeValue: "tenths",
          // Step 2 MCQ: Which denominator?
          step2McqOptions: [100, 10],
          step2McqAnswer: 10,
          step2McqCorrectFeedback:
            "Great choice!\nFor  2/5 ,\nconverting the\ndenominator to 10 is\neasier to write as a\ndecimal.",
          step2McqWrongFeedback:
            "Nice idea!\nConverting the\ndenominator to 100\nworks, but converting\nthe denominator to 10\nis easier.",
          // Step 3 MCQ: Multiply or Divide?
          step3McqOptions: ["Multiply", "Divide"],
          step3McqAnswer: "Multiply",
          step3McqCorrectFeedback:
            "Great choice!\nMultiplying can\nchange the\ndenominator 5 to 10.",
          step3McqWrongFeedback:
            "Not quite!\nDividing will not\nchange the\ndenominator 5 to a\nlarger number 10.\nTry again!",
          // Step 4: Numpad input
          step4WrongFeedback:
            "Not quite.\nMultiply 5\nby a\nnumber to\nget 10.",
          step4CorrectFeedback:
            "Well done!\nMultiplying\n5 by 2\ngives 10.",
          // Step 6 MCQ: Decimal form
          step6McqOptions: ["0.04", "4.2", "0.4", "4.0"],
          step6McqAnswer: "0.4",
          step6McqAnswerIndex: 2,
          step6McqFeedbacks: [
            "Oops! We\nneed tenths,\nnot\nhundredths.",
            "Oops! Check\nthe digit in the\nnumerator of\nthe fraction.",
            "Well done!\nThe\ndenominator\nof 10 gives\na decimal in\ntenths.",
            "Oops! We\nneed tenths,\nnot\nwholes!",
          ],
          step6WrongHighlights: {
            0: "denominator",
            1: "numerator",
            3: "denominator",
          },
        },
        {
          // Question 2: 8/25 -> 0.32
          numerator: 8,
          denominator: 25,
          targetDenominator: 100,
          operation: "multiply",
          operationSymbol: "×",
          operationNoun: "multiplier",
          multiplier: 4,
          convertedNumerator: 32,
          convertedDenominator: 100,
          decimalValue: "0.32",
          placeValue: "hundredths",
          step2McqOptions: [10, 100],
          step2McqAnswer: 100,
          step2McqCorrectFeedback:
            "Great choice!\nFor  8/25 ,\nconverting the\ndenominator to 100\nis easier to write\nas a decimal.",
          step2McqWrongFeedback:
            "Not quite!\n25 does not divide\nevenly into 10.\nConverting the\ndenominator to 100\nis easier.",
          step3McqOptions: ["Multiply", "Divide"],
          step3McqAnswer: "Multiply",
          step3McqCorrectFeedback:
            "Great choice!\nMultiplying can\nchange the\ndenominator 25\nto 100.",
          step3McqWrongFeedback:
            "Not quite!\nDividing will not\nchange the\ndenominator 25 to a\nlarger number 100.\nTry again!",
          step4WrongFeedback:
            "Not quite.\nMultiply 25\nby a\nnumber to\nget 100.",
          step4CorrectFeedback:
            "Well done!\nMultiplying\n25 by 4\ngives 100.",
          step6McqOptions: ["3.2", "0.32", "0.08", "32.0"],
          step6McqAnswer: "0.32",
          step6McqAnswerIndex: 1,
          step6McqFeedbacks: [
            "Oops! We\nneed hundredths,\nnot\ntenths.",
            "Well done!\nThe\ndenominator\nof 100 gives\na decimal in\nhundredths.",
            "Oops! Check\nthe digit in the\nnumerator of\nthe fraction.",
            "Oops! We\nneed hundredths,\nnot\nwholes!",
          ],
          step6WrongHighlights: {
            0: "denominator",
            2: "numerator",
            3: "denominator",
          },
        },
        {
          // Question 3: 30/60 -> 0.5
          numerator: 30,
          denominator: 60,
          targetDenominator: 10,
          operation: "divide",
          operationSymbol: "÷",
          operationNoun: "divisor",
          multiplier: 6,
          convertedNumerator: 5,
          convertedDenominator: 10,
          decimalValue: "0.5",
          placeValue: "tenths",
          step2McqOptions: [100, 10],
          step2McqAnswer: 10,
          step2McqCorrectFeedback:
            "Great choice!\nFor  30/60 ,\nconverting the\ndenominator to 10 is\neasier to write as a\ndecimal.",
          step2McqWrongFeedback:
            "Not quite!\n60 does not divide\nevenly into 100.\nConverting the\ndenominator to 10\nis easier.",
          step3McqOptions: ["Multiply", "Divide"],
          step3McqAnswer: "Divide",
          step3McqCorrectFeedback:
            "Great choice!\nDividing can\nchange the\ndenominator 60\nto 10.",
          step3McqWrongFeedback:
            "Not quite!\nMultiplying will not\nchange the\ndenominator 60 to a\nsmaller number 10.\nTry again!",
          step4WrongFeedback:
            "Not quite.\nDivide 60\nby a\nnumber to\nget 10.",
          step4CorrectFeedback:
            "Well done!\nDividing\n60 by 6\ngives 10.",
          step6McqOptions: ["5.0", "0.5", "0.05", "0.3"],
          step6McqAnswer: "0.5",
          step6McqAnswerIndex: 1,
          step6McqFeedbacks: [
            "Oops! We\nneed tenths,\nnot\nwholes!",
            "Well done!\nThe\ndenominator\nof 10 gives\na decimal in\ntenths.",
            "Oops! We\nneed tenths,\nnot\nhundredths.",
            "Oops! Check\nthe digit in the\nnumerator of\nthe fraction.",
          ],
          step6WrongHighlights: {
            0: "denominator",
            2: "denominator",
            3: "numerator",
          },
        },
        {
          // Question 4: 28/400 -> 0.07
          numerator: 28,
          denominator: 400,
          targetDenominator: 100,
          operation: "divide",
          operationSymbol: "÷",
          operationNoun: "divisor",
          multiplier: 4,
          convertedNumerator: 7,
          convertedDenominator: 100,
          decimalValue: "0.07",
          placeValue: "hundredths",
          step2McqOptions: [10, 100],
          step2McqAnswer: 100,
          step2McqCorrectFeedback:
            "Great choice!\nFor  28/400 ,\nconverting the\ndenominator to 100\nis easier to write\nas a decimal.",
          step2McqWrongFeedback:
            "Not quite!\n400 does not divide\nevenly into 10.\nConverting the\ndenominator to 100\nis easier.",
          step3McqOptions: ["Multiply", "Divide"],
          step3McqAnswer: "Divide",
          step3McqCorrectFeedback:
            "Great choice!\nDividing can\nchange the\ndenominator 400\nto 100.",
          step3McqWrongFeedback:
            "Not quite!\nMultiplying will not\nchange the\ndenominator 400 to a\nsmaller number 100.\nTry again!",
          step4WrongFeedback:
            "Not quite.\nDivide 400\nby a\nnumber to\nget 100.",
          step4CorrectFeedback:
            "Well done!\nDividing\n400 by 4\ngives 100.",
          step6McqOptions: ["0.7", "0.07", "7.0", "0.28"],
          step6McqAnswer: "0.07",
          step6McqAnswerIndex: 1,
          step6McqFeedbacks: [
            "Oops! We\nneed hundredths,\nnot\ntenths.",
            "Well done!\nThe\ndenominator\nof 100 gives\na decimal in\nhundredths.",
            "Oops! We\nneed hundredths,\nnot\nwholes!",
            "Oops! Check\nthe digit in the\nnumerator of\nthe fraction.",
          ],
          step6WrongHighlights: {
            0: "denominator",
            2: "denominator",
            3: "numerator",
          },
        },
      ],
    },
  },
  id: {
    app: {
      start: {
        heading: "Pecahan ke Bilangan Desimal",
        text: "Mari belajar bagaimana pecahan dengan penyebut selain<br>10 atau 100 ditulis sebagai desimal.",
        buttonText: "Mulai",
      },
      steps: {
        1: {
          questionText: "Mari ubah pecahan ini menjadi desimal.",
          navText: "Ketuk » untuk memulai.",
        },
        2: {
          questionText:
            "Penyebut manakah yang membuat pecahan ini mudah ditulis sebagai desimal?",
          navText: "Ketuk jawaban yang benar.",
          navAfterCorrect:
            "Ketuk » untuk mengubah penyebut menjadi {{targetDen}}.",
        },
        3: {
          questionText:
            "Bagaimana cara mengubah penyebut pecahan ini menjadi {{targetDen}}?",
          navText: "Ketuk jawaban yang benar.",
          navAfterCorrect: "Ketuk » untuk {{operation}} dengan bilangan yang sama.",
          extraText:
            "...pembilang dan\npenyebut dengan\nbilangan yang sama.",
        },
        4: {
          questionText:
            "Masukkan {{operation_noun}} untuk mengubah penyebut menjadi {{targetDen}}.",
          navText: "Gunakan numpad untuk memasukkan nilai.",
        },
        5: {
          questionText:
            "Pecahan yang dihasilkan memiliki nilai yang sama, dengan penyebut {{targetDen}}.",
          navText: "",
        },
        6: {
          questionText:
            "Sekarang pilih bentuk desimal yang benar dari pecahan ini.",
          navText: "Ketuk jawaban yang benar.",
          navAfterCorrect: "Ketuk » untuk ringkasan.",
          questionAfterCorrect:
            "Penyebut {{targetDen}} menghasilkan desimal dalam {{placeValue}}.",
        },
        7: {
          questionText: "",
          navText: "",
        },
      },
      step8Final: {
        heading: "Pecahan dan Desimal",
        text: "<left>Luar biasa!<br>Untuk menulis pecahan yang diberikan sebagai desimal:<br>● Ubah penyebut menjadi 10 atau 100.<br>● Tulis pecahan dengan penyebut 10 atau 100 sebagai<br>desimal.</left>",
        buttonText: "Mulai Ulang",
      },
      equalsSign: "=",
      multiplySign: "×",
      divideSign: "÷",
      common: {
        multiplyVerb: "mengalikan",
        divideVerb: "membagi",
      },
      summaryHeading: "Pecahan ke Bilangan Desimal",
      summaryContinueButton: "Lanjut.",
      summarySubheading:
        "Ubah penyebut menjadi {{targetDen}} untuk menulis pecahan sebagai desimal.",
      summaryCardTexts: [
        "Tulis pecahan senilai dengan penyebut {{targetDen}}.",
        "Tulis pecahan sebagai bilangan desimal.",
      ],
      placeValueTenths: "persepuluhan",
      placeValueHundredths: "perseratusan",
      questions: [
        {
          // Question 1
          numerator: 2,
          denominator: 5,
          targetDenominator: 10,
          operation: "multiply", 
          operationSymbol: "×",
          operationNoun: "pengali",
          multiplier: 2,
          convertedNumerator: 4,
          convertedDenominator: 10,
          decimalValue: "0.4",
          placeValue: "persepuluhan",
          step2McqOptions: [100, 10],
          step2McqAnswer: 10,
          step2McqCorrectFeedback:
            "Pilihan tepat!\nUntuk 2/5,\nmengubah\npenyebut ke 10\nlebih mudah ditulis\nswbagai desimal.",
          step2McqWrongFeedback:
            "Ide bagus!\nMengubah\npenyebut ke 100\nbisa, tapi mengubah\npenyebut ke 10\nlebih mudah.",
          step3McqOptions: ["Kalikan", "Bagikan"],
          step3McqAnswer: "Kalikan",
          step3McqCorrectFeedback:
            "Pilihan tepata!\nMengalikan bisa\nmengubah\npenyebut 5 jadi 10.",
          step3McqWrongFeedback:
            "Kurang tepat!\nMembagi tidak akan\nmengubah\npenyebut 5 jadi\nangka lebih besar 10.\nCoba lagi!",
          step4WrongFeedback:
            "Kurang tepat.\nKalikan 5\ndengan suatu\nangka untuk\ndapat 10.",
          step4CorrectFeedback:
            "Bagus sekali!\nMengalikan\n5 dengan 2\nhasilkan 10.",
          step6McqOptions: ["0.04", "4.2", "0.4", "4.0"],
          step6McqAnswer: "0.4",
          step6McqAnswerIndex: 2,
          step6McqFeedbacks: [
            "Ups! Kita\nbutuh persepuluhan,\nbukan\nperseratusan.",
            "Ups! Cek\nangka di\npembilang\npecahan.",
            "Bagus sekali!\nPenyebut\n10 hasilkan\ndesimal dalam\npersepuluhan.",
            "Ups! Kita\nbutuh persepuluhan,\nbukan\nbilangan bulat!",
          ],
          step6WrongHighlights: {
            0: "denominator",
            1: "numerator",
            3: "denominator",
          },
        },
        {
          // Question 2
          numerator: 8,
          denominator: 25,
          targetDenominator: 100,
          operation: "multiply",
          operationSymbol: "×",
          operationNoun: "pengali",
          multiplier: 4,
          convertedNumerator: 32,
          convertedDenominator: 100,
          decimalValue: "0.32",
          placeValue: "perseratusan",
          step2McqOptions: [10, 100],
          step2McqAnswer: 100,
          step2McqCorrectFeedback:
            "Pilihan tepat!\nUntuk 8/25,\nmengubah\npenyebut ke 100\nlebih mudah ditulis\nsebagai desimal.",
          step2McqWrongFeedback:
            "Kurang tepat!\n25 tidak bisa dibagi\nrata menjadi 10.\nMengubah\npenyebut ke 100\nlebih mudah.",
          step3McqOptions: ["Kalikan", "Bagikan"],
          step3McqAnswer: "Kalikan",
          step3McqCorrectFeedback:
            "Pilihan tepat!\nMengalikan bisa\nmengubah\npenyebut 25\njadi 100.",
          step3McqWrongFeedback:
            "Kurang tepat!\nMembagi tidak akan\nmengubah\npenyebut 25 jadi\kangka lebih besar 100.\nCoba lagi!",
          step4WrongFeedback:
            "Kurang tepat.\nKalikan 25\ndengan suatu\nangka untuk\ndapat 100.",
          step4CorrectFeedback:
            "Bagus sekali!\nMengalikan\n25 dengan 4\nhasilkan 100.",
          step6McqOptions: ["3.2", "0.32", "0.08", "32.0"],
          step6McqAnswer: "0.32",
          step6McqAnswerIndex: 1,
          step6McqFeedbacks: [
            "Ups! Kita\nbutuh perseratusan,\nbukan\npersepuluhan.",
            "Bagus sekali!\nPenyebut\n100 menghasilkan\ndesimal dalam\nperseratusan.",
            "Ups! Cek\nangka di\npembilang\npecahan.",
            "Ups! Kita\nbutuh perseratusan,\nbukan\nbilangan bulat!",
          ],
          step6WrongHighlights: {
            0: "denominator",
            2: "numerator",
            3: "denominator",
          },
        },
        {
          // Question 3
          numerator: 30,
          denominator: 60,
          targetDenominator: 10,
          operation: "divide",
          operationSymbol: "÷",
          operationNoun: "pembagi",
          multiplier: 6,
          convertedNumerator: 5,
          convertedDenominator: 10,
          decimalValue: "0.5",
          placeValue: "persepuluhan",
          step2McqOptions: [100, 10],
          step2McqAnswer: 10,
          step2McqCorrectFeedback:
            "Pilihan tepat!\nUntuk 30/60,\nmengubah\npenyebut ke 10\nlebih mudah ditulis\nsebagai desimal.",
          step2McqWrongFeedback:
            "Kurang tepat!\n60 tidak bisa dibagi\nrata menjadi 100.\nMengubah\npenyebut ke 10\nlebih mudah.",
          step3McqOptions: ["Kalikan", "Bagikan"],
          step3McqAnswer: "Bagikan",
          step3McqCorrectFeedback:
            "Pilihan tepat!\nMembagi bisa\nmengubah\npenyebut 60\njadi 10.",
          step3McqWrongFeedback:
            "Kurang tepat!\nMengalikan tidak akan\nmengubah\npenyebut 60 jadi\nangka lebih kecil 10.\nCoba lagi!",
          step4WrongFeedback:
            "Kurang tepat.\nBagi 60\ndengan suatu\nangka untuk\ndapat 10.",
          step4CorrectFeedback:
            "Bagus sekali!\nMembagi\n60 dengan 6\nhasilkan 10.",
          step6McqOptions: ["5.0", "0.5", "0.05", "0.3"],
          step6McqAnswer: "0.5",
          step6McqAnswerIndex: 1,
          step6McqFeedbacks: [
            "Ups! Kita\nbutuh persepuluhan,\nbukan\nbilangan bulat!",
            "Bagus sekali!\nPenyebut\n10 hasilkan\ndesimal dalam\npersepuluhan.",
            "Ups! Kita\nbutuh persepuluhan,\nbukan\nperseratusan.",
            "Ups! Cek\nangka di\npembilang\npecahan.",
          ],
          step6WrongHighlights: {
            0: "denominator",
            2: "denominator",
            3: "numerator",
          },
        },
        {
          // Question 4
          numerator: 28,
          denominator: 400,
          targetDenominator: 100,
          operation: "divide",
          operationSymbol: "÷",
          operationNoun: "pembagi",
          multiplier: 4,
          convertedNumerator: 7,
          convertedDenominator: 100,
          decimalValue: "0.07",
          placeValue: "perseratusan",
          step2McqOptions: [10, 100],
          step2McqAnswer: 100,
          step2McqCorrectFeedback:
            "Pilihan tepat!\nUntuk 28/400,\nmengubah\npenyebut ke 100\nlebih mudah ditulis\nsebagai desimal.",
          step2McqWrongFeedback:
            "Kurang tepat!\n400 tidak bisa dibagi\nrata menjadi 10.\nMengubah\npenyebut ke 100\nlebih mudah.",
          step3McqOptions: ["Kalikan", "Bagikan"],
          step3McqAnswer: "Bagikan",
          step3McqCorrectFeedback:
            "Pilihan tepat!\nMembagi bisa\nmengubah\npenyebut 400\njadi 100.",
          step3McqWrongFeedback:
            "Kurang tepat!\nMengalikan tidak akan\nmengubah\npenyebut 400 jadi\nangka lebih kecil 100.\nCoba lagi!",
          step4WrongFeedback:
            "Kurang tepat.\nBagi 400\ndengan suatu\nangka untuk\ndapat 100.",
          step4CorrectFeedback:
            "Bagus sekali!\nMembagi\n400 dengan 4\nhasilkan 100.",
          step6McqOptions: ["0.7", "0.07", "7.0", "0.28"],
          step6McqAnswer: "0.07",
          step6McqAnswerIndex: 1,
          step6McqFeedbacks: [
            "Ups! Kita\nbutuh perseratusan,\nbukan\npersepuluhan.",
            "Bagus sekali!\nPenyebut\n100 menghasilkan\ndesimal dalam\nperseratusan.",
            "Ups! Kita\nbutuh perseratusan,\nbukan\nbilangan bulat!",
            "Ups! Cek\nangka di\npembilang\npecahan.",
          ],
          step6WrongHighlights: {
            0: "denominator",
            2: "denominator",
            3: "numerator",
          },
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
    numerator: q.numerator,
    denominator: q.denominator,
    equalsSign: APP_DATA.equalsSign,
    multiplySign: APP_DATA.multiplySign,
    divideSign: APP_DATA.divideSign,
    operation: q.operation,
    operationSymbol: q.operationSymbol,
    operationNoun: q.operationNoun,
    multiplier: q.multiplier,
    targetDenominator: q.targetDenominator,
    convertedNumerator: q.convertedNumerator,
    convertedDenominator: q.convertedDenominator,
    decimalValue: q.decimalValue,
    placeValue: q.placeValue,
  };

  if (step === 1) {
    return {
      ...base,
      questionText: steps[1].questionText,
      navText: steps[1].navText,
    };
  }
  if (step === 2) {
    return {
      ...base,
      questionText: steps[2].questionText,
      navText: steps[2].navText,
      navAfterCorrect: steps[2].navAfterCorrect.replace(
        "{{targetDen}}",
        String(q.targetDenominator)
      ),
      mcqOptions: q.step2McqOptions,
      mcqAnswer: q.step2McqAnswer,
      mcqCorrectFeedback: q.step2McqCorrectFeedback,
      mcqWrongFeedback: q.step2McqWrongFeedback,
    };
  }
  if (step === 3) {
    const opVerb = q.operation === "multiply" 
      ? APP_DATA.common.multiplyVerb 
      : APP_DATA.common.divideVerb;

    return {
      ...base,
      questionText: steps[3].questionText.replace(
        "{{targetDen}}",
        String(q.targetDenominator)
      ),
      navText: steps[3].navText,
      navAfterCorrect: steps[3].navAfterCorrect.replace(
        "{{operation}}",
        opVerb
      ),
      mcqOptions: q.step3McqOptions,
      mcqAnswer: q.step3McqAnswer,
      mcqCorrectFeedback: q.step3McqCorrectFeedback,
      mcqWrongFeedback: q.step3McqWrongFeedback,
      extraText: steps[3].extraText,
    };
  }
  if (step === 4) {
    return {
      ...base,
      questionText: steps[4].questionText
        .replace("{{operation_noun}}", q.operationNoun)
        .replace("{{targetDen}}", String(q.targetDenominator)),
      navText: steps[4].navText,
      wrongFeedback: q.step4WrongFeedback,
      correctFeedback: q.step4CorrectFeedback,
    };
  }
  if (step === 5) {
    return {
      ...base,
      questionText: steps[5].questionText.replace(
        "{{targetDen}}",
        String(q.targetDenominator)
      ),
      navText: steps[5].navText,
    };
  }
  if (step === 6) {
    return {
      ...base,
      questionText: steps[6].questionText,
      navText: steps[6].navText,
      navAfterCorrect: steps[6].navAfterCorrect,
      questionAfterCorrect: steps[6].questionAfterCorrect
        .replace("{{targetDen}}", String(q.targetDenominator))
        .replace(
          "{{placeValue}}",
          q.targetDenominator === 10
            ? APP_DATA.placeValueTenths
            : APP_DATA.placeValueHundredths
        ),
      mcqOptions: q.step6McqOptions,
      mcqAnswer: q.step6McqAnswer,
      mcqAnswerIndex: q.step6McqAnswerIndex,
      mcqFeedbacks: q.step6McqFeedbacks,
      wrongHighlights: q.step6WrongHighlights,
    };
  }
  if (step === 7) {
    return {
      ...base,
      questionText: steps[7].questionText,
      navText: steps[7].navText,
    };
  }
  return null;
}
