
const decimal = {
  en: ".",
  id: ",",
};

// Master data structure
const DATA = {
  en: {
    app: {
      start: {
        heading: "Decimal Numbers to Mixed Numbers",
        text: "Let us learn how decimal numbers are written as<br>mixed numbers.",
        buttonText: "Start",
      },
      steps: {
        1: {
          questionText: "Let us convert this decimal number into a mixed number.",
          navText: "Tap » to begin.",
          decimalNumber: "3.25",
          integerPart: "3",
          decimalPoint: ".",
          fractionalDigits: "25",
        },
        2: {
          questionText: "Identify the decimal part.",
          navText: "Tap the decimal part.",
          decimalNumber: "3.25",
          integerPart: "3",
          decimalPoint: ".",
          fractionalDigits: "25",
        },
        3: {
          questionText: "What is the fractional form of 0.25 ?",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to simplify the fractional part.",
          decimalNumber: "3.25",
          integerPart: "3",
          decimalPoint: ".",
          fractionalDigits: "25",
          wholePart: "3",
          decimalPart: "0.25",
          decimalPartDigits: "25",
          equalsSign: "=",
          andText: "and",
          labelWhole: "Whole part",
          labelDecimal: "Decimal part",
          labelFractional: "Fractional part",
          fractionNumerator: "25",
          fractionDenominator: "100",
          mcq: {
            options: ["25/10", "25/100", "250/100", "3/100"],
            answerIndex: 1,
            answer: "25/100",
            feedbacks: {
              correct: "Awesome!\nYou are correct.",
              wrong: "Not quite!\nThere are\n25\nhundredths.",
            },
          },
        },
        4: {
          questionText: "Simplify the fractional part.",
          navText: "Enter the simplified term using numpad.",
          decimalNumber: "3.25",
          integerPart: "3",
          decimalPoint: ".",
          fractionalDigits: "25",
          wholePart: "3",
          equalsSign: "=",
          andText: "and",
          labelWhole: "Whole part",
          labelFractional: "Fractional part",
          fractionNumerator: "25",
          fractionDenominator: "100",
          simplifiedNumerator: "1",
          simplifiedDenominator: "4",
          plusSign: "+",
          cancelTag: "×25",
        },
        5: {
          questionText: "Express the whole part and fractional part as mixed number.",
          navText: "Tap the 'and' button to combine.",
          questionTextComplete: "This mixed number has the same value as the given decimal.",
          navTextComplete: "Tap » to try another decimal number.",
          decimalNumber: "3.25",
          integerPart: "3",
          decimalPoint: ".",
          fractionalDigits: "25",
          wholePart: "3",
          equalsSign: "=",
          andText: "and",
          simplifiedFraction: "1/4",
          simplifiedNumerator: "1",
          simplifiedDenominator: "4",
          mixedWhole: "3",
          mixedNumerator: "1",
          mixedDenominator: "4",
        },
        6: {
          questionText: "",
          navText: "",
        },
      },
      // Intro screen before each question from the questions array (step 6)
      step6Intro: {
        introText: "Convert the decimal number<br>into a mixed number.",
        buttonText: "Continue",
      },
      // Final screen after all questions (step 7)
      step7Final: {
        heading: "Decimal Numbers to Mixed Numbers",
        text: "<left>Awesome!<br>To write the given decimal number as mixed number:<br>● Whole part → stays the same<br>● Decimal part → becomes a fraction<br>● Write the simplest form of the fractional part.<br>● Combine the whole part and fractional part to make the mixed number.</left>",
        buttonText: "Start Over",
      },
      // Questions array: each question has all data for steps 1–5 (used after first question 3.25)
      questions: [
        {
          decimalNumber: "5.2",
          integerPart: "5",
          decimalPoint: ".",
          fractionalDigits: "2",
          wholePart: "5",
          decimalPart: "0.2",
          decimalPartDigits: "2",
          fractionNumerator: "2",
          fractionDenominator: "10",
          mcq: {
            options: ["5/10", "2/10", "20/100", "2/100"],
            answerIndex: 1,
            answer: "2/10",
            feedbacks: { correct: "Awesome!\nYou are correct.", wrong: "Not quite!\nThere are\n2\ntenths." },
          },
          simplifiedNumerator: "1",
          simplifiedDenominator: "5",
          cancelTag: "×2",
          step5Mcq: { options: ["5 1/5", "1 1/5", "1 5/1"], answerIndex: 0 },
          mixedWhole: "5",
          mixedNumerator: "1",
          mixedDenominator: "5",
          questionTextStep2: "Step 01: Identify the decimal part.",
          questionTextStep3: "Step 02: Write the decimal part as a fraction.",
          questionTextStep4: "Step 03: Simplify the fractional part.",
          questionTextStep5: "Step 04: Express the whole part and fractional part as mixed number.",
          questionTextStep5Complete: "Step 04: Express the whole part and fractional part as mixed number.",
          navTextStep5: "Tap the correct mixed number.",
          navTextStep5Complete: "Tap » to try another decimal number.",
          navTextStep5Last: "Tap » to complete activity",
        },
        {
          decimalNumber: "1.05",
          integerPart: "1",
          decimalPoint: ".",
          fractionalDigits: "05",
          wholePart: "1",
          decimalPart: "0.05",
          decimalPartDigits: "05",
          fractionNumerator: "5",
          fractionDenominator: "100",
          mcq: {
            options: ["5/10", "5/100", "20/100", "2/100"],
            answerIndex: 1,
            answer: "5/100",
            feedbacks: { correct: "Awesome!\nYou are correct.", wrong: "Not quite!\nThere are\n5\nhundredths." },
          },
          simplifiedNumerator: "1",
          simplifiedDenominator: "20",
          cancelTag: "×5",
          step5Mcq: { options: ["1 1/20", "1 1/2", "1 5/1"], answerIndex: 0 },
          mixedWhole: "1",
          mixedNumerator: "1",
          mixedDenominator: "20",
          questionTextStep2: "Step 01: Identify the decimal part.",
          questionTextStep3: "Step 02: Write the decimal part as a fraction.",
          questionTextStep4: "Step 03: Simplify the fractional part.",
          questionTextStep5: "Step 04: Express the whole part and fractional part as mixed number.",
          questionTextStep5Complete: "Step 04: Express the whole part and fractional part as mixed number.",
          navTextStep5: "Tap the correct mixed number.",
          navTextStep5Complete: "Tap » to try another decimal number.",
          navTextStep5Last: "Tap » to complete activity",
        },
      ],
    },
  },
  id: {
    app: {
      start: {
        heading: "Bilangan Desimal ke Bilangan Campuran",
        text: "Mari kita pelajari bagaimana bilangan desimal ditulis sebagai<br>bilangan campuran.",
        buttonText: "Mulai",
      },
      steps: {
        1: {
          questionText: "Mari kita ubah bilangan desimal ini menjadi bilangan campuran.",
          navText: "Ketuk » untuk memulai.",
          decimalNumber: "3,25",
          integerPart: "3",
          decimalPoint: ",",
          fractionalDigits: "25",
        },
        2: {
          questionText: "Identifikasi bagian desimal.",
          navText: "Ketuk bagian desimal.",
          decimalNumber: "3,25",
          integerPart: "3",
          decimalPoint: ",",
          fractionalDigits: "25",
        },
        3: {
          questionText: "Apa bentuk pecahan dari 0,25 ?",
          navText: "Ketuk jawaban yang benar.",
          navTextCorrect: "Ketuk » untuk menyederhanakan bagian pecahan.",
          decimalNumber: "3,25",
          integerPart: "3",
          decimalPoint: ",",
          fractionalDigits: "25",
          wholePart: "3",
          decimalPart: "0,25",
          decimalPartDigits: "25",
          equalsSign: "=",
          andText: "dan",
          labelWhole: "Bagian bulat",
          labelDecimal: "Bagian desimal",
          labelFractional: "Bagian pecahan",
          fractionNumerator: "25",
          fractionDenominator: "100",
          mcq: {
            options: ["25/10", "25/100", "250/100", "3/100"],
            answerIndex: 1,
            answer: "25/100",
            feedbacks: {
              correct: "Luar biasa!\nAnda benar.",
              wrong: "Belum tepat!\nAda\n25\nperseratus.",
            },
          },
        },
        4: {
          questionText: "Sederhanakan bagian pecahan.",
          navText: "Masukkan suku yang disederhanakan menggunakan numpad.",
          decimalNumber: "3,25",
          integerPart: "3",
          decimalPoint: ",",
          fractionalDigits: "25",
          wholePart: "3",
          equalsSign: "=",
          andText: "dan",
          labelWhole: "Bagian bulat",
          labelFractional: "Bagian pecahan",
          fractionNumerator: "25",
          fractionDenominator: "100",
          simplifiedNumerator: "1",
          simplifiedDenominator: "4",
          plusSign: "+",
          cancelTag: "×25",
        },
        5: {
          questionText: "Nyatakan bagian bulat dan bagian pecahan sebagai bilangan campuran.",
          navText: "Ketuk tombol 'dan' untuk menggabungkan.",
          questionTextComplete: "Bilangan campuran ini memiliki nilai yang sama dengan desimal yang diberikan.",
          navTextComplete: "Ketuk » untuk mencoba bilangan desimal lain.",
          decimalNumber: "3,25",
          integerPart: "3",
          decimalPoint: ",",
          fractionalDigits: "25",
          wholePart: "3",
          equalsSign: "=",
          andText: "dan",
          simplifiedFraction: "1/4",
          simplifiedNumerator: "1",
          simplifiedDenominator: "4",
          mixedWhole: "3",
          mixedNumerator: "1",
          mixedDenominator: "4",
        },
        6: {
          questionText: "",
          navText: "",
        },
      },
      step6Intro: {
        introText: "Ubah bilangan desimal<br>menjadi bilangan campuran.",
        buttonText: "Lanjutkan",
      },
      step7Final: {
        heading: "Bilangan Desimal ke Bilangan Campuran",
        text: "<left>Luar biasa!<br>Untuk menulis bilangan desimal sebagai bilangan campuran:<br>● Bagian bulat → tetap sama<br>● Bagian desimal → menjadi pecahan<br>● Tulis bentuk paling sederhana dari bagian pecahan.<br>● Gabungkan bagian bulat dan pecahan untuk membuat bilangan campuran.</left>",
        buttonText: "Mulai Lagi",
      },
      questions: [
        {
          decimalNumber: "5,2",
          integerPart: "5",
          decimalPoint: ",",
          fractionalDigits: "2",
          wholePart: "5",
          decimalPart: "0,2",
          decimalPartDigits: "2",
          fractionNumerator: "2",
          fractionDenominator: "10",
          mcq: {
            options: ["5/10", "2/10", "20/100", "2/100"],
            answerIndex: 1,
            answer: "2/10",
            feedbacks: { correct: "Luar biasa!\nAnda benar.", wrong: "Belum tepat!\nAda\n2\npersepuluh." },
          },
          simplifiedNumerator: "1",
          simplifiedDenominator: "5",
          cancelTag: "×2",
          step5Mcq: { options: ["5 1/5", "1 1/5", "1 5/1"], answerIndex: 0 },
          mixedWhole: "5",
          mixedNumerator: "1",
          mixedDenominator: "5",
          questionTextStep2: "Langkah 01: Identifikasi bagian desimal.",
          questionTextStep3: "Langkah 02: Tulis bagian desimal sebagai pecahan.",
          questionTextStep4: "Langkah 03: Sederhanakan bagian pecahan.",
          questionTextStep5: "Langkah 04: Nyatakan bagian bulat dan pecahan sebagai bilangan campuran.",
          questionTextStep5Complete: "Langkah 04: Nyatakan bagian bulat dan pecahan sebagai bilangan campuran.",
          navTextStep5: "Ketuk bilangan campuran yang benar.",
          navTextStep5Complete: "Ketuk » untuk mencoba bilangan desimal lain.",
          navTextStep5Last: "Ketuk » untuk menyelesaikan aktivitas",
        },
        {
          decimalNumber: "1,05",
          integerPart: "1",
          decimalPoint: ",",
          fractionalDigits: "05",
          wholePart: "1",
          decimalPart: "0,05",
          decimalPartDigits: "05",
          fractionNumerator: "5",
          fractionDenominator: "100",
          mcq: {
            options: ["5/10", "5/100", "20/100", "2/100"],
            answerIndex: 1,
            answer: "5/100",
            feedbacks: { correct: "Luar biasa!\nAnda benar.", wrong: "Belum tepat!\nAda\n5\nperseratus." },
          },
          simplifiedNumerator: "1",
          simplifiedDenominator: "20",
          cancelTag: "×5",
          step5Mcq: { options: ["1 1/20", "1 1/2", "1 5/1"], answerIndex: 0 },
          mixedWhole: "1",
          mixedNumerator: "1",
          mixedDenominator: "20",
          questionTextStep2: "Langkah 01: Identifikasi bagian desimal.",
          questionTextStep3: "Langkah 02: Tulis bagian desimal sebagai pecahan.",
          questionTextStep4: "Langkah 03: Sederhanakan bagian pecahan.",
          questionTextStep5: "Langkah 04: Nyatakan bagian bulat dan pecahan sebagai bilangan campuran.",
          questionTextStep5Complete: "Langkah 04: Nyatakan bagian bulat dan pecahan sebagai bilangan campuran.",
          navTextStep5: "Ketuk bilangan campuran yang benar.",
          navTextStep5Complete: "Ketuk » untuk mencoba bilangan desimal lain.",
          navTextStep5Last: "Ketuk » untuk menyelesaikan aktivitas",
        },
      ],
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];

/**
 * Returns step data for the given step and question index.
 * questionIndex === -1: first question (3.25), use APP_DATA.steps.
 * questionIndex >= 0: use APP_DATA.questions[questionIndex] with step-specific texts.
 */
function getStepData(step, questionIndex) {
  if (questionIndex === -1) {
    return APP_DATA.steps[step] || null;
  }
  const q = APP_DATA.questions && APP_DATA.questions[questionIndex];
  if (!q) return null;
  const firstSteps = APP_DATA.steps;
  const base = {
    decimalNumber: q.decimalNumber,
    integerPart: q.integerPart,
    decimalPoint: q.decimalPoint,
    fractionalDigits: q.fractionalDigits,
    equalsSign: step >= 3 ? (current_language === "id" ? "=" : "=") : undefined,
    andText: q.andText || (current_language === "en" ? "and" : "dan"),
    labelWhole: firstSteps[3].labelWhole,
    labelDecimal: firstSteps[3].labelDecimal,
    labelFractional: firstSteps[3].labelFractional,
    plusSign: firstSteps[4].plusSign,
  };
  if (step === 1) {
    return {
      ...base,
      questionText: q.questionTextStep1 || firstSteps[1].questionText,
      navText: firstSteps[1].navText,
    };
  }
  if (step === 2) {
    return {
      ...base,
      questionText: q.questionTextStep2,
      navText: firstSteps[2].navText,
    };
  }
  if (step === 3) {
    return {
      ...base,
      wholePart: q.wholePart,
      decimalPart: q.decimalPart,
      decimalPartDigits: q.decimalPartDigits,
      fractionNumerator: q.fractionNumerator,
      fractionDenominator: q.fractionDenominator,
      mcq: q.mcq,
      questionText: q.questionTextStep3,
      navText: firstSteps[3].navText,
      navTextCorrect: firstSteps[3].navTextCorrect,
    };
  }
  if (step === 4) {
    return {
      ...base,
      wholePart: q.wholePart,
      fractionNumerator: q.fractionNumerator,
      fractionDenominator: q.fractionDenominator,
      simplifiedNumerator: q.simplifiedNumerator,
      simplifiedDenominator: q.simplifiedDenominator,
      cancelTag: q.cancelTag,
      questionText: q.questionTextStep4,
      navText: firstSteps[4].navText,
    };
  }
  if (step === 5) {
    return {
      ...base,
      wholePart: q.wholePart,
      simplifiedNumerator: q.simplifiedNumerator,
      simplifiedDenominator: q.simplifiedDenominator,
      mixedWhole: q.mixedWhole,
      mixedNumerator: q.mixedNumerator,
      mixedDenominator: q.mixedDenominator,
      step5Mcq: q.step5Mcq,
      questionText: q.questionTextStep5,
      navText: q.navTextStep5,
      questionTextComplete: q.questionTextStep5Complete,
      navTextComplete: q.navTextStep5Complete,
      navTextLast: q.navTextStep5Last,
    };
  }
  return null;
}
