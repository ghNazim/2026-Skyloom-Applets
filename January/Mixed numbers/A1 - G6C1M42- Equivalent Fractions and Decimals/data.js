/**
 * Returns HTML string for proper fraction notation
 * @param {string|number} num - Numerator
 * @param {string|number} den - Denominator
 * @returns {string} HTML string with fraction notation
 */
function fract(num, den) {
  return `<span style="vertical-align: middle; display: inline-flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1;"><span style="font-size: 1em;">${num}</span><span style="width: 120%; height: 3px; background-color: currentColor; margin: 2px 0; border-radius: 1px; display: block;"></span><span style="font-size: 1em;">${den}</span></span>`;
}

// Master data structure for Fractions to Decimal Numbers applet
const DATA = {
  en: {
    app: {
      start: {
        heading: "Fractions to Decimal Numbers",
        text: "Let us learn how fractions with <y>denominator</y> other than<br><y>10 or 100</y> are written as decimals.",
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
            "...the numerator and denominator by the same number.",
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
        text: "<left>Awesome!<br>To write the given fraction as a decimal:<br>● Convert the <y>denominator</y> to 10 or 100.<br>● Write the fraction with <y>denominator 10 or 100 as a decimal</y>.</left>",
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
        "Convert the <y>denominator to {{targetDen}}</y> to write the fraction as a decimal.",
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
            `Great choice! For  ${fract("2","5")} , converting the denominator to 10 is easier to write as a decimal.`,
          step2McqWrongFeedback:
            "Nice idea! Converting the denominator to 100 works, but converting the denominator to 10 is easier.",
          // Step 3 MCQ: Multiply or Divide?
          step3McqOptions: ["Multiply", "Divide"],
          step3McqAnswer: "Multiply",
          step3McqCorrectFeedback:
            "Great choice! Multiplying can change the denominator 5 to 10.",
          step3McqWrongFeedback:
            "Not quite! Dividing will not change the denominator 5 to a larger number 10. Try again!",
          // Step 4: Numpad input
          step4WrongFeedback:
            "Not quite. Multiply 5 by a number to get 10.",
          step4CorrectFeedback:
            "Well done! Multiplying 5 by 2 gives 10.",
          step4PartialFeedback:
            "Incorrect! both numerator and denominator should be multiplied by the same number",
          // Step 6 MCQ: Decimal form
          step6McqOptions: ["0.04", "4.2", "0.4", "4.0"],
          step6McqAnswer: "0.4",
          step6McqAnswerIndex: 2,
          step6McqFeedbacks: [
            "Oops! We need tenths, not hundredths.",
            "Oops! Check the digit in the numerator of the fraction.",
            "Well done! The denominator of 10 gives a decimal in tenths.",
            "Oops! We need tenths, not wholes!",
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
            `Great choice! For  ${fract("8","25")} , converting the denominator to 100 is easier to write as a decimal.`,
          step2McqWrongFeedback:
            "Not quite! 25 does not divide evenly into 10. Converting the denominator to 100 is easier.",
          step3McqOptions: ["Multiply", "Divide"],
          step3McqAnswer: "Multiply",
          step3McqCorrectFeedback:
            "Great choice! Multiplying can change the denominator 25 to 100.",
          step3McqWrongFeedback:
            "Not quite! Dividing will not change the denominator 25 to a larger number 100. Try again!",
          step4WrongFeedback:
            "Not quite. Multiply 25 by a number to get 100.",
          step4CorrectFeedback:
            "Well done! Multiplying 25 by 4 gives 100.",
          step4PartialFeedback:
            "Incorrect! both numerator and denominator should be multiplied by the same number",
          step6McqOptions: ["3.2", "0.32", "0.08", "32.0"],
          step6McqAnswer: "0.32",
          step6McqAnswerIndex: 1,
          step6McqFeedbacks: [
            "Oops! We need hundredths, not tenths.",
            "Well done! The denominator of 100 gives a decimal in hundredths.",
            "Oops! Check the digit in the numerator of the fraction.",
            "Oops! We need hundredths, not wholes!",
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
            `Great choice! For  ${fract("30","60")} , converting the denominator to 10 is easier to write as a decimal.`,
          step2McqWrongFeedback:
            "Not quite! 60 does not divide evenly into 100. Converting the denominator to 10 is easier.",
          step3McqOptions: ["Multiply", "Divide"],
          step3McqAnswer: "Divide",
          step3McqCorrectFeedback:
            "Great choice! Dividing can change the denominator 60 to 10.",
          step3McqWrongFeedback:
            "Not quite! Multiplying will not change the denominator 60 to a smaller number 10. Try again!",
          step4WrongFeedback:
            "Not quite. Divide 60 by a number to get 10.",
          step4CorrectFeedback:
            "Well done! Dividing 60 by 6 gives 10.",
          step4PartialFeedback:
            "Incorrect! both numerator and denominator should be divided by the same number",
          step6McqOptions: ["5.0", "0.5", "0.05", "0.3"],
          step6McqAnswer: "0.5",
          step6McqAnswerIndex: 1,
          step6McqFeedbacks: [
            "Oops! We need tenths, not wholes!",
            "Well done! The denominator of 10 gives a decimal in tenths.",
            "Oops! We need tenths, not hundredths.",
            "Oops! Check the digit in the numerator of the fraction.",
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
            `Great choice! For  ${fract("28","400")} , converting the denominator to 100 is easier to write as a decimal.`,
          step2McqWrongFeedback:
            "Not quite! 400 does not divide evenly into 10. Converting the denominator to 100 is easier.",
          step3McqOptions: ["Multiply", "Divide"],
          step3McqAnswer: "Divide",
          step3McqCorrectFeedback:
            "Great choice! Dividing can change the denominator 400 to 100.",
          step3McqWrongFeedback:
            "Not quite! Multiplying will not change the denominator 400 to a smaller number 100. Try again!",
          step4WrongFeedback:
            "Not quite. Divide 400 by a number to get 100.",
          step4CorrectFeedback:
            "Well done! Dividing 400 by 4 gives 100.",
          step4PartialFeedback:
            "Incorrect! both numerator and denominator should be divided by the same number",
          step6McqOptions: ["0.7", "0.07", "7.0", "0.28"],
          step6McqAnswer: "0.07",
          step6McqAnswerIndex: 1,
          step6McqFeedbacks: [
            "Oops! We need hundredths, not tenths.",
            "Well done! The denominator of 100 gives a decimal in hundredths.",
            "Oops! We need hundredths, not wholes!",
            "Oops! Check the digit in the numerator of the fraction.",
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
            "...pembilang dan penyebut dengan bilangan yang sama.",
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
        "Ubah penyebut menjadi <y>{{targetDen}} untuk menulis</y> pecahan sebagai desimal.",
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
            `Pilihan tepat! Untuk ${fract("2","5")}, mengubah penyebut ke 10 lebih mudah ditulis sebagai desimal.`,
          step2McqWrongFeedback:
            "Ide bagus! Mengubah penyebut ke 100 bisa, tapi mengubah penyebut ke 10 lebih mudah.",
          step3McqOptions: ["Kalikan", "Bagikan"],
          step3McqAnswer: "Kalikan",
          step3McqCorrectFeedback:
            "Pilihan tepat! Mengalikan bisa mengubah penyebut 5 jadi 10.",
          step3McqWrongFeedback:
            "Kurang tepat! Membagi tidak akan mengubah penyebut 5 jadi angka lebih besar 10. Coba lagi!",
          step4WrongFeedback:
            "Kurang tepat. Kalikan 5 dengan suatu angka untuk dapat 10.",
          step4CorrectFeedback:
            "Bagus sekali! Mengalikan 5 dengan 2 hasilkan 10.",
          step4PartialFeedback:
            "Tidak benar! pembilang dan penyebut harus dikalikan dengan angka yang sama",
          step6McqOptions: ["0.04", "4.2", "0.4", "4.0"],
          step6McqAnswer: "0.4",
          step6McqAnswerIndex: 2,
          step6McqFeedbacks: [
            "Ups! Kita butuh persepuluhan, bukan perseratusan.",
            "Ups! Cek angka di pembilang pecahan.",
            "Bagus sekali! Penyebut 10 hasilkan desimal dalam persepuluhan.",
            "Ups! Kita butuh persepuluhan, bukan bilangan bulat!",
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
            `Pilihan tepat! Untuk ${fract("8","25")}, mengubah penyebut ke 100 lebih mudah ditulis sebagai desimal.`,
          step2McqWrongFeedback:
            "Kurang tepat! 25 tidak bisa dibagi rata menjadi 10. Mengubah penyebut ke 100 lebih mudah.",
          step3McqOptions: ["Kalikan", "Bagikan"],
          step3McqAnswer: "Kalikan",
          step3McqCorrectFeedback:
            "Pilihan tepat! Mengalikan bisa mengubah penyebut 25 jadi 100.",
          step3McqWrongFeedback:
            "Kurang tepat! Membagi tidak akan mengubah penyebut 25 jadi angka lebih besar 100. Coba lagi!",
          step4WrongFeedback:
            "Kurang tepat. Kalikan 25 dengan suatu angka untuk dapat 100.",
          step4CorrectFeedback:
            "Bagus sekali! Mengalikan 25 dengan 4 hasilkan 100.",
          step4PartialFeedback:
            "Tidak benar! pembilang dan penyebut harus dikalikan dengan angka yang sama",
          step6McqOptions: ["3.2", "0.32", "0.08", "32.0"],
          step6McqAnswer: "0.32",
          step6McqAnswerIndex: 1,
          step6McqFeedbacks: [
            "Ups! Kita butuh perseratusan, bukan persepuluhan.",
            "Bagus sekali! Penyebut 100 menghasilkan desimal dalam perseratusan.",
            "Ups! Cek angka di pembilang pecahan.",
            "Ups! Kita butuh perseratusan, bukan bilangan bulat!",
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
            `Pilihan tepat! Untuk ${fract("30","60")}, mengubah penyebut ke 10 lebih mudah ditulis sebagai desimal.`,
          step2McqWrongFeedback:
            "Kurang tepat! 60 tidak bisa dibagi rata menjadi 100. Mengubah penyebut ke 10 lebih mudah.",
          step3McqOptions: ["Kalikan", "Bagikan"],
          step3McqAnswer: "Bagikan",
          step3McqCorrectFeedback:
            "Pilihan tepat! Membagi bisa mengubah penyebut 60 jadi 10.",
          step3McqWrongFeedback:
            "Kurang tepat! Mengalikan tidak akan mengubah penyebut 60 jadi angka lebih kecil 10. Coba lagi!",
          step4WrongFeedback:
            "Kurang tepat. Bagi 60 dengan suatu angka untuk dapat 10.",
          step4CorrectFeedback:
            "Bagus sekali! Membagi 60 dengan 6 hasilkan 10.",
          step4PartialFeedback:
            "Tidak benar! pembilang dan penyebut harus dibagi dengan angka yang sama",
          step6McqOptions: ["5.0", "0.5", "0.05", "0.3"],
          step6McqAnswer: "0.5",
          step6McqAnswerIndex: 1,
          step6McqFeedbacks: [
            "Ups! Kita butuh persepuluhan, bukan bilangan bulat!",
            "Bagus sekali! Penyebut 10 hasilkan desimal dalam persepuluhan.",
            "Ups! Kita butuh persepuluhan, bukan perseratusan.",
            "Ups! Cek angka di pembilang pecahan.",
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
            `Pilihan tepat! Untuk ${fract("28","400")}, mengubah penyebut ke 100 lebih mudah ditulis sebagai desimal.`,
          step2McqWrongFeedback:
            "Kurang tepat! 400 tidak bisa dibagi rata menjadi 10. Mengubah penyebut ke 100 lebih mudah.",
          step3McqOptions: ["Kalikan", "Bagikan"],
          step3McqAnswer: "Bagikan",
          step3McqCorrectFeedback:
            "Pilihan tepat! Membagi bisa mengubah penyebut 400 jadi 100.",
          step3McqWrongFeedback:
            "Kurang tepat! Mengalikan tidak akan mengubah penyebut 400 jadi angka lebih kecil 100. Coba lagi!",
          step4WrongFeedback:
            "Kurang tepat. Bagi 400 dengan suatu angka untuk dapat 100.",
          step4CorrectFeedback:
            "Bagus sekali! Membagi 400 dengan 4 hasilkan 100.",
          step4PartialFeedback:
            "Tidak benar! pembilang dan penyebut harus dibagi dengan angka yang sama",
          step6McqOptions: ["0.7", "0.07", "7.0", "0.28"],
          step6McqAnswer: "0.07",
          step6McqAnswerIndex: 1,
          step6McqFeedbacks: [
            "Ups! Kita butuh perseratusan, bukan persepuluhan.",
            "Bagus sekali! Penyebut 100 menghasilkan desimal dalam perseratusan.",
            "Ups! Kita butuh perseratusan, bukan bilangan bulat!",
            "Ups! Cek angka di pembilang pecahan.",
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
      partialFeedback: q.step4PartialFeedback,
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
