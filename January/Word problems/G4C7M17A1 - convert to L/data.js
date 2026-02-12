const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

// Master data structure for Convert mL to L Word Problem (Helen's bucket)
const DATA = {
  en: {
    app: {
      start_over: "Restart",

      questionText:
        "The water poured into the bucket by Helen is 6340 mL. How do you convert this measurement into liters? Explain it.",

      comprehend: {
        sectionTitle: "INFORMATION ANALYSIS",
        given: {
          title: "Given,",
          data: ["Volume of water poured = 6340 mL"],
          highlights: ["water poured into the bucket by Helen is 6340 mL"],
        },
        toFind: {
          title: "To Find",
          data: ["Volume of water poured in liters"],
          highlights: ["convert this measurement into liters?"],
        },
      },

      splash: {
        step2: {
          image: null,
          text: "<blue>✓ Given and to find identified.</blue><br><yellow>Next - Convert 6340 mL to liters.</yellow>",
          questionStatement:
            "The water poured into the bucket by Helen is 6340 mL. How do you convert this measurement into liters? Explain it.",
        },
      },

      conversionQuestionText:
        "Let's convert the unit from milliliters (mL) to liters (L).",

      calcRowInitial: "Volume of water poured = 6340 mL",
      calcRowStep6: "Volume of water poured = (6340 ÷ 1000) L",
      calcRowStep7: "Volume of water poured = 6.34 L",

      finalAnswer:
        "So, the water poured into the bucket by Helen is 6.34 liters.",

      mcqStep3: {
        title:
          "We're converting 6340 mL into liters (L). Which statement best describes this conversion?",
        options: [
          "Changing from a larger unit to a smaller unit",
          "Changing from a smaller unit to a larger unit",
          "No change in units is needed",
          "Changing from a unit of length to a unit of volume",
        ],
        answerIndex: 1,
      },

      mcqStep4: {
        title:
          "Which statement correctly shows the relationship between liters (L) and milliliters (mL)?",
        options: [
          "1 mL = 1000 L",
          "1 L = 100 mL",
          "1000 mL = 1 L",
          "1 mL = 10 L",
        ],
        answerIndex: 2,
      },

      mcqStep5: {
        title: "To convert mL to L, what should you do?",
        options: [
          "Multiply the value in mL by 1000",
          "Divide the value in mL by 1000",
          "Multiply the value in mL by 100",
          "Divide the value in mL by 100",
        ],
        answerIndex: 1,
      },

      steps: {
        0: {
          questionText:
            "Read the question and identify 'given' and 'to find'.",
          navText: "Tap » to identify 'given' and 'to find'.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true,
        },
        1: {
          questionText:
            "Read the question and identify 'given' and 'to find' in this step.",
          navText: "Tap » to identify the 'given' information.",
          navToFind: "Tap » to identify what do we need 'to find'.",
          navTextCorrect: "Tap » to continue.",
          isComprehend: true,
          isSubstepComprehend: true,
          useLeftQuestion: true,
          nextEnabled: false,
        },
        2: {
          questionText: "",
          navText: "Tap » to continue.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true,
        },
        3: {
          questionText: "Let's convert the unit from milliliters (mL) to liters (L).",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to continue.",
          isCalcWithQuestion: true,
          isMcq: true,
          mcqKey: "mcqStep3",
          nextEnabled: false,
        },
        4: {
          questionText: "Let's convert the unit from milliliters (mL) to liters (L).",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to continue.",
          isCalcWithQuestion: true,
          isMcq: true,
          mcqKey: "mcqStep4",
          nextEnabled: false,
        },
        5: {
          questionText: "Let's convert the unit from milliliters (mL) to liters (L).",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to continue.",
          isCalcWithQuestion: true,
          isMcq: true,
          mcqKey: "mcqStep5",
          nextEnabled: false,
        },
        6: {
          questionText: "Let's convert the unit from milliliters (mL) to liters (L).",
          navText: "Tap » to continue.",
          isCalcWithQuestion: true,
          nextEnabled: true,
        },
        7: {
          questionText: "Activity Completed!",
          navText: "Tap 'Restart' to restart the activity",
          isCalcWithQuestion: true,
          isFinalStep: true,
          nextEnabled: true,
        },
      },
      labels: {
        given: "Given",
        toFind: "To Find",
        findings: "Findings",
      },
    },
  },
  id: {
    app: {
      start_over: "Mulai Ulang",
      questionText:
        "Air yang dituang Helen ke dalam ember adalah 6340 mL. Bagaimana Anda mengonversi pengukuran ini ke liter? Jelaskan.",
      comprehend: {
        sectionTitle: "ANALISIS INFORMASI",
        given: {
          title: "Diketahui,",
          data: ["Volume air yang dituang = 6340 mL"],
          highlights: ["air yang dituang Helen ke dalam ember adalah 6340 mL"],
        },
        toFind: {
          title: "Ditanyakan",
          data: ["Volume air yang dituang dalam liter"],
          highlights: ["mengonversi pengukuran ini ke liter?"],
        },
      },
      splash: {
        step2: {
          image: null,
          text: "<blue>✓ Diketahui dan ditanyakan teridentifikasi.</blue><br><yellow>Selanjutnya - Konversi 6340 mL ke liter.</yellow>",
          questionStatement:
            "Air yang dituang Helen ke dalam ember adalah 6340 mL. Bagaimana Anda mengonversi pengukuran ini ke liter? Jelaskan.",
        },
      },
      conversionQuestionText:
        "Mari kita konversi satuan dari mililiter (mL) ke liter (L).",
      calcRowInitial: "Volume air yang dituang = 6340 mL",
      calcRowStep6: "Volume air yang dituang = (6340 ÷ 1000) L",
      calcRowStep7: "Volume air yang dituang = 6,34 L",
      finalAnswer:
        "Jadi, air yang dituang Helen ke dalam ember adalah 6,34 liter.",
      mcqStep3: {
        title:
          "Kita mengonversi 6340 mL ke liter (L). Pernyataan mana yang paling menggambarkan konversi ini?",
        options: [
          "a. Mengubah dari satuan lebih besar ke satuan lebih kecil",
          "b. Mengubah dari satuan lebih kecil ke satuan lebih besar",
          "c. Tidak ada perubahan satuan yang diperlukan",
          "d. Mengubah dari satuan panjang ke satuan volume",
        ],
        answerIndex: 1,
      },
      mcqStep4: {
        title:
          "Pernyataan mana yang benar menunjukkan hubungan antara liter (L) dan mililiter (mL)?",
        options: [
          "a. 1 mL = 1000 L",
          "b. 1 L = 100 mL",
          "c. 1000 mL = 1 L",
          "d. 1 mL = 10 L",
        ],
        answerIndex: 2,
      },
      mcqStep5: {
        title: "Untuk mengonversi mL ke L, apa yang harus Anda lakukan?",
        options: [
          "a. Kalikan nilai dalam mL dengan 1000",
          "b. Bagi nilai dalam mL dengan 1000",
          "c. Kalikan nilai dalam mL dengan 100",
          "d. Bagi nilai dalam mL dengan 100",
        ],
        answerIndex: 1,
      },
      steps: {
        0: {
          questionText: "Baca pertanyaan dan identifikasi 'diketahui' dan 'ditanyakan'.",
          navText: "Ketuk » untuk mengidentifikasi 'diketahui' dan 'ditanyakan'.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true,
        },
        1: {
          questionText:
            "Baca pertanyaan dan identifikasi 'diketahui' dan 'ditanyakan' pada langkah ini.",
          navText: "Ketuk » untuk mengidentifikasi informasi 'diketahui'.",
          navToFind: "Ketuk » untuk mengidentifikasi apa yang 'ditanyakan'.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          isComprehend: true,
          isSubstepComprehend: true,
          useLeftQuestion: true,
          nextEnabled: false,
        },
        2: {
          questionText: "",
          navText: "Ketuk » untuk melanjutkan.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true,
        },
        3: {
          questionText: "Mari kita konversi satuan dari mililiter (mL) ke liter (L).",
          navText: "Ketuk jawaban yang benar.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          isCalcWithQuestion: true,
          isMcq: true,
          mcqKey: "mcqStep3",
          nextEnabled: false,
        },
        4: {
          questionText: "Mari kita konversi satuan dari mililiter (mL) ke liter (L).",
          navText: "Ketuk jawaban yang benar.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          isCalcWithQuestion: true,
          isMcq: true,
          mcqKey: "mcqStep4",
          nextEnabled: false,
        },
        5: {
          questionText: "Mari kita konversi satuan dari mililiter (mL) ke liter (L).",
          navText: "Ketuk jawaban yang benar.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          isCalcWithQuestion: true,
          isMcq: true,
          mcqKey: "mcqStep5",
          nextEnabled: false,
        },
        6: {
          questionText: "Mari kita konversi satuan dari mililiter (mL) ke liter (L).",
          navText: "Ketuk » untuk melanjutkan.",
          isCalcWithQuestion: true,
          nextEnabled: true,
        },
        7: {
          questionText: "Aktivitas Selesai!",
          navText: "Ketuk 'Mulai Ulang' untuk memulai kembali aktivitas",
          isCalcWithQuestion: true,
          isFinalStep: true,
          nextEnabled: true,
        },
      },
      labels: {
        given: "Diketahui",
        toFind: "Ditanyakan",
        findings: "Temuan",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
