const decimal = {
  en: ".",
  id: ",",
};

/** Fraction glyph shown on a measuring cup, keyed by its denominator. */
const CUP_SYMBOLS = {
  1: "1",
  2: "\u00BD",
  3: "\u2153",
  4: "\u00BC",
};

/** Relative render size of each cup image, keyed by its denominator. */
const CUP_SIZE_SCALE = {
  1: 1,
  2: 0.8,
  3: 0.7,
  4: 0.6,
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "How much does each cup hold?",
        body:
          "Karina measures her baking ingredients with four cups: 1, \u00BD, \u2153, and \u00BC of a cup.<br><br>" +
          "Before using them, she wants to know how full each one makes the glass.<br><br>" +
          "Predict the level, then pour to check.",
        buttonText: "Start",
        imageSrc: "assets/cup4en.png",
      },
      cupUnit: "Cup",
      meterUnit: "cup",
      guessLabel: "Your guess",
      completedNav: "Tap \u00BB to go next",
      count: {
        title: "WHAT WE FOUND",
        footerOne: "1 pour fill the glass",
        footerMany: "{count} pours fill the glass",
      },
      steps: {
        1: {
          denominator: 1,
          questionText: "This is the 1 cup.",
          questionSub: "Pour it to see the glass fill.",
          navText: "Tap the 1 cup to pour it in.",
          navPour: "Tap the 1 cup to pour it in.",
          fillText: "The glass holds one cup \u2014 one full cup fills it.",
        },
        2: {
          denominator: 2,
          questionText: "This is the \u00BD cup.",
          questionSub:
            "Predict how high one \u00BD cup will reach in the glass.",
          navText: "Drag the line to show your prediction.",
          navPour: "Tap the \u00BD cup to pour it in.",
          fillText:
            "Nice estimate \u2014 one \u00BD cup reaches halfway, so two \u00BD cups fill the glass.",
        },
        3: {
          denominator: 3,
          questionText: "This is the \u2153 cup.",
          questionSub:
            "Predict how high one \u2153 cup will reach in the glass.",
          navText: "Drag the line to show your prediction.",
          navPour: "Tap the \u2153 cup to pour it in.",
          fillText:
            "One \u2153 cup reaches a third \u2014 three \u2153 cups fill the glass.",
        },
        4: {
          questionText: "You have placed \u2153. Now compare it with \u00BC",
          questionSub: "\u2014 which cup holds more?",
          navText: "Tap the cup you think holds more.",
          navDone: "Tap \u00BB to explore \u00BC cup.",
          wrongFeedback:
            "Not quite. Which fraction is greater: the one with the larger denominator, or the one with the smaller denominator?",
          correctFeedback:
            "A bigger denominator means a smaller cup.<br>" +
            "So, \u2153 cup > \u00BC cup.",
        },
        5: {
          denominator: 4,
          questionText: "This is the \u00BC cup.",
          navText: "",
          navDone: "Tap \u00BB to learn what these fractions are called.",
          fillText:
            "One \u00BC cup reaches a quarter \u2014 four \u00BC cups fill the glass.",
        },
        6: {
          heading: "Meet your Benchmarks",
          body:
            "These four amounts \u2014 <y>1, \u00BD, \u2153, \u00BC</y> \u2014 are our <y>benchmark fractions</y>:<br>" +
            "familiar measures we compare against.<br><br>" +
            "When an amount has no exact cup, we estimate to the closest benchmark.<br><br>" +
            "<yl>Tap \u2018continue\u2019 to start estimating.</yl>",
          buttonText: "Continue",
        },
        7: {
          questionText: "Karina needs this much, but she has no cup for it.",
          questionSub: "Which cup gets closest?",
          needsTitle: "KARINA NEEDS",
          waterLevel: 0.6,
          correctDenominator: 2,
          navText: "Tap the cup that lands nearest to what she needs.",
          navDone: "Tap \u00BB to try the next amount.",
          wrongFeedback:
            "Not quite \u2014 that level is further from what she needs. Which mark is closest?",
          correctFeedback:
            "Good estimate. The \u00BD mark is nearest to what Karina needs.",
        },
        8: {
          questionText: "Karina needs this much, but she has no cup for it.",
          questionSub: "Which cup gets closest?",
          needsTitle: "KARINA NEEDS",
          waterLevel: 0.26,
          correctDenominator: 4,
          navText: "Tap the cup that lands nearest to what she needs.",
          navDone: "Tap \u00BB to try the next amount.",
          wrongFeedback:
            "Not quite \u2014 that level is further from what she needs. Which mark is closest?",
          correctFeedback:
            "Good estimate. The \u00BC mark is nearest to what Karina needs.",
        },
        9: {
          questionText: "Karina needs this much, but she has no cup for it.",
          questionSub: "Which cup gets closest?",
          needsTitle: "KARINA NEEDS",
          waterLevel: 0.37,
          correctDenominator: 3,
          navText: "Tap the cup that lands nearest to what she needs.",
          navDone: "Tap \u00BB to conclude.",
          wrongFeedback:
            "Not quite \u2014 that level is further from what she needs. Which mark is closest?",
          correctFeedback:
            "Good estimate. The \u2153 mark is nearest to what Karina needs.",
        },
      },
      final: {
        heading: "Activity Completed",
        body:
          "You met four benchmark fractions \u2014 1, \u00BD, \u2153, and \u00BC \u2014<br>" +
          "and used them to estimate the closest cup for each amount.<br><br>" +
          "When there is no exact measure,<br>" +
          "you now know what to do: pick the benchmark it lands nearest.",
        buttonText: "Start Over",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Berapa isi setiap cangkir?",
        body:
          "Karina mengukur bahan kuenya dengan empat cangkir: 1, \u00BD, \u2153, dan \u00BC cangkir.<br><br>" +
          "Sebelum memakainya, ia ingin tahu seberapa penuh gelas yang terisi oleh masing-masing cangkir.<br><br>" +
          "Perkirakan tingginya, lalu tuang untuk memeriksanya.",
        buttonText: "Mulai",
        imageSrc: "assets/cup4id.png",
      },
      cupUnit: "Cangkir",
      meterUnit: "cangkir",
      guessLabel: "Perkiraanmu",
      completedNav: "Ketuk \u00BB untuk lanjut",
      count: {
        title: "YANG KAMI TEMUKAN",
        footerOne: "1 tuangan mengisi gelas",
        footerMany: "{count} tuangan mengisi gelas",
      },
      steps: {
        1: {
          denominator: 1,
          questionText: "Ini cangkir 1.",
          questionSub: "Tuang untuk melihat gelas terisi.",
          navText: "Ketuk cangkir 1 untuk menuangkannya.",
          navPour: "Ketuk cangkir 1 untuk menuangkannya.",
          fillText:
            "Gelas ini berisi satu cangkir \u2014 satu cangkir penuh mengisinya.",
        },
        2: {
          denominator: 2,
          questionText: "Ini cangkir \u00BD.",
          questionSub:
            "Perkirakan seberapa tinggi satu cangkir \u00BD akan mencapai di gelas.",
          navText: "Seret garis untuk menunjukkan perkiraanmu.",
          navPour: "Ketuk cangkir \u00BD untuk menuangkannya.",
          fillText:
            "Perkiraan bagus \u2014 satu cangkir \u00BD mencapai setengah, jadi dua cangkir \u00BD mengisi gelas.",
        },
        3: {
          denominator: 3,
          questionText: "Ini cangkir \u2153.",
          questionSub:
            "Perkirakan seberapa tinggi satu cangkir \u2153 akan mencapai di gelas.",
          navText: "Seret garis untuk menunjukkan perkiraanmu.",
          navPour: "Ketuk cangkir \u2153 untuk menuangkannya.",
          fillText:
            "Satu cangkir \u2153 mencapai sepertiga \u2014 tiga cangkir \u2153 mengisi gelas.",
        },
        4: {
          questionText:
            "Kamu telah menempatkan \u2153. Sekarang bandingkan dengan \u00BC",
          questionSub: "\u2014 cangkir mana yang berisi lebih banyak?",
          navText: "Ketuk cangkir yang menurutmu berisi lebih banyak.",
          navDone: "Ketuk \u00BB untuk menjelajahi cangkir \u00BC.",
          wrongFeedback:
            "Belum tepat. Pecahan mana yang lebih besar: yang penyebutnya lebih besar, atau yang penyebutnya lebih kecil?",
          correctFeedback:
            "Penyebut yang lebih besar berarti cangkir yang lebih kecil.<br>" +
            "Jadi, cangkir \u2153 > cangkir \u00BC.",
        },
        5: {
          denominator: 4,
          questionText: "Ini cangkir \u00BC.",
          navText: "",
          navDone: "Ketuk \u00BB untuk mempelajari apa nama pecahan ini.",
          fillText:
            "Satu cangkir \u00BC mencapai seperempat \u2014 empat cangkir \u00BC mengisi gelas.",
        },
        6: {
          heading: "Kenali Patokanmu",
          body:
            "Empat jumlah ini \u2014 <y>1, \u00BD, \u2153, \u00BC</y> \u2014 adalah <y>pecahan patokan</y> kita:<br>" +
            "ukuran yang dikenal untuk dibandingkan.<br><br>" +
            "Ketika suatu jumlah tidak memiliki cangkir yang tepat, kita memperkirakannya ke patokan terdekat.<br><br>" +
            "<yl>Ketuk \u2018lanjutkan\u2019 untuk mulai memperkirakan.</yl>",
          buttonText: "Lanjutkan",
        },
        7: {
          questionText:
            "Karina membutuhkan sebanyak ini, tetapi ia tidak memiliki cangkir untuk itu.",
          questionSub: "Cangkir mana yang paling dekat?",
          needsTitle: "KARINA MEMBUTUHKAN",
          waterLevel: 0.6,
          correctDenominator: 2,
          navText: "Ketuk cangkir yang paling dekat dengan yang dibutuhkannya.",
          navDone: "Ketuk \u00BB untuk mencoba jumlah berikutnya.",
          wrongFeedback:
            "Belum tepat \u2014 tingkat itu lebih jauh dari yang dibutuhkannya. Tanda mana yang paling dekat?",
          correctFeedback:
            "Perkiraan bagus. Tanda \u00BD paling dekat dengan yang dibutuhkan Karina.",
        },
        8: {
          questionText:
            "Karina membutuhkan sebanyak ini, tetapi ia tidak memiliki cangkir untuk itu.",
          questionSub: "Cangkir mana yang paling dekat?",
          needsTitle: "KARINA MEMBUTUHKAN",
          waterLevel: 0.26,
          correctDenominator: 4,
          navText: "Ketuk cangkir yang paling dekat dengan yang dibutuhkannya.",
          navDone: "Ketuk \u00BB untuk mencoba jumlah berikutnya.",
          wrongFeedback:
            "Belum tepat \u2014 tingkat itu lebih jauh dari yang dibutuhkannya. Tanda mana yang paling dekat?",
          correctFeedback:
            "Perkiraan bagus. Tanda \u00BC paling dekat dengan yang dibutuhkan Karina.",
        },
        9: {
          questionText:
            "Karina membutuhkan sebanyak ini, tetapi ia tidak memiliki cangkir untuk itu.",
          questionSub: "Cangkir mana yang paling dekat?",
          needsTitle: "KARINA MEMBUTUHKAN",
          waterLevel: 0.37,
          correctDenominator: 3,
          navText: "Ketuk cangkir yang paling dekat dengan yang dibutuhkannya.",
          navDone: "Ketuk \u00BB untuk menyimpulkan.",
          wrongFeedback:
            "Belum tepat \u2014 tingkat itu lebih jauh dari yang dibutuhkannya. Tanda mana yang paling dekat?",
          correctFeedback:
            "Perkiraan bagus. Tanda \u2153 paling dekat dengan yang dibutuhkan Karina.",
        },
      },
      final: {
        heading: "Aktivitas Selesai",
        body:
          "Kamu telah mengenal empat pecahan patokan \u2014 1, \u00BD, \u2153, dan \u00BC \u2014<br>" +
          "dan menggunakannya untuk memperkirakan cangkir terdekat untuk setiap jumlah.<br><br>" +
          "Ketika tidak ada ukuran yang tepat,<br>" +
          "kamu sekarang tahu apa yang harus dilakukan: pilih patokan yang paling dekat.",
        buttonText: "Mulai Lagi",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
