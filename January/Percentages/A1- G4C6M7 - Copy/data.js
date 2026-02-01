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
        heading: "Percent as Fraction",
        text: "Let's see how a <y>Percent</y> can be written as a <y>Fraction</y>.",
        buttonText: "Start",
      },
      splash: {
        leftText: "12",
        percentSymbol: "%",
        equals: "=",
        numerator: "12",
        denominator: "100",
        rightText: "Let's practice writing\nPercents as fractions.",
        buttonText: "Continue",
      },
      final: {
        heading: "Percent as Fraction",
        text: "Awesome!<br><br>While writing a <y>Percent</y>, as a <y>Fraction</y>.<br>● Number before % → numerator<br>● % sign → denominator is 100",
        buttonText: "Start Over",
        buttonTextPrevious: "Previous",
      },
      steps: {
        1: {
          questionText: "What percent of the square is shaded?",
          navText: "Tap the correct answer.",
          questionTextCorrect:
            "Out of 100 squares, 12 are shaded. This represents 12%.",
          navTextCorrect: "Tap » connect with fraction.",
          filledSquares: 12,
          mcq: {
            options: ["15%", "21%", "12%", "13%"],
            answer: "12%",
            feedbacks: {
              correct: "Great job!\n12 out of 100\nmeans 12%.",
              wrong:
                "Not quite!\nCount how many\nsquares are\nshaded out of\n100.",
            },
          },
        },
        2: {
          questionText: `The <y>%</y> means "<y>out of 100</y>". That is why the <y>denominator</y> of the <y>fraction is 100</y>.`,
          navText: "Tap » to find out the numerator of the fraction",
          filledSquares: 12,
          glowAllSquares: true,
          percentNumber: "12",
          percentSymbol: "%",
          showFraction: true,
          numerator: "",
          denominator: "100",
          highlightDenominator: true,
          pulsatePercent: true,
          pulsateDenominator: true,
        },
        3: {
          questionText:
            "The <y>number 12</y> represents the <y>shaded parts</y> and becomes the <y>numerator</y>.",
          navText: "Tap » to summarise",
          filledSquares: 12,
          glowFilledSquares: true,
          percentNumber: "2",
          percentSymbol: "%",
          showFraction: true,
          numerator: "2",
          denominator: "100",
          highlightNumerator: true,
          pulsateNumber: true,
          pulsateNumerator: true,
        },
        5: {
          questionText: "Choose the correct fraction for the given Percent.",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to try another Percent.",
          navTextLast: "Tap » to summarise.",
          hideVisualColumn: true,
          showFraction: true,
          denominator: "100",
          questions: [
            {
              percentNumber: "36",
              numerator: "36",
              options: ["36/100", "36/10", "360/100", "6/10"],
              answer: "36/100",
            },
            {
              percentNumber: "9",
              numerator: "9",
              options: ["9/100", "90/100", "9/10", "19/100"],
              answer: "9/100",
            },
            {
              percentNumber: "78",
              numerator: "78",
              options: ["78/100", "87/100", "78/10", "7/100"],
              answer: "78/100",
            },
            {
              percentNumber: "93",
              numerator: "93",
              options: ["39/100", "93/10", "93/100", "9/100"],
              answer: "93/100",
            },
            {
              percentNumber: "6",
              numerator: "6",
              options: ["60/100", "6/10", "16/100", "6/100"],
              answer: "6/100",
            },
            {
              percentNumber: "56",
              numerator: "56",
              options: ["56/100", "65/100", "56/10", "5/100"],
              answer: "56/100",
            },
            {
              percentNumber: "99",
              numerator: "99",
              options: ["9/100", "99/10", "99/100", "90/100"],
              answer: "99/100",
            },
          ],
          feedbacks: {
            correct:
              "Well done!\nThe number in the\nPercent is the\nnumerator,\nand the % sign means\nthe denominator is 100.",
            wrong:
              "Not quite!\nThe number in the\nPercent is the\nnumerator,\nand the % means the\ndenominator is 100.",
          },
        },
      },
      labels: {
        fraction: "Fraction",
        decimal: "Decimal",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Persen sebagai Pecahan",
        text: "Mari kita lihat bagaimana <y>Persen</y> dapat ditulis sebagai <y>Pecahan</y>.",
        buttonText: "Mulai",
      },
      splash: {
        leftText: "12",
        percentSymbol: "%",
        equals: "=",
        numerator: "12",
        denominator: "100",
        rightText: "Mari berlatih menulis\nPersen sebagai pecahan.",
        buttonText: "Lanjutkan",
      },
      final: {
        heading: "Persen sebagai Pecahan",
        text: "Luar biasa!<br><br>Saat menulis <y>Persen</y>, sebagai <y>Pecahan</y>.<br>●Angka sebelum % → pembilang<br>●Tanda % → penyebut adalah 100",
        buttonText: "Mulai Lagi",
        buttonTextPrevious: "Sebelumnya",
      },
      steps: {
        1: {
          questionText: "Berapa persen kotak yang diarsir?",
          navText: "Ketuk jawaban yang benar.",
          questionTextCorrect: "Dari 100 kotak, 12 diarsir. Ini mewakili 12%.",
          navTextCorrect: "Ketuk » hubungkan dengan pecahan.",
          filledSquares: 12,
          mcq: {
            options: ["15%", "21%", "12%", "13%"],
            answer: "12%",
            feedbacks: {
              correct: "Kerja bagus!\n12 dari 100\nberarti 12%.",
              wrong:
                "Belum tepat!\nHitung berapa\nkotak yang\ndiarsir dari\n100.",
            },
          },
        },
        2: {
          questionText: `Tanda <y>%</y> berarti "<y>dari 100</y>". Itulah mengapa <y>penyebut</y> <y>pecahannya adalah 100</y>.`,
          navText: "Ketuk » untuk mengetahui pembilang pecahan",
          filledSquares: 12,
          glowAllSquares: true,
          percentNumber: "12",
          percentSymbol: "%",
          showFraction: true,
          numerator: "",
          denominator: "100",
          highlightDenominator: true,
          pulsatePercent: true,
          pulsateDenominator: true,
        },
        3: {
          questionText:
            "<y>Angka 12</y> mewakili <y>bagian yang diarsir</y> dan menjadi <y>pembilang</y>.",
          navText: "Ketuk » untuk merangkum",
          filledSquares: 12,
          glowFilledSquares: true,
          percentNumber: "12",
          percentSymbol: "%",
          showFraction: true,
          numerator: "12",
          denominator: "100",
          highlightNumerator: true,
          pulsateNumber: true,
          pulsateNumerator: true,
        },
        5: {
          questionText: "Pilih pecahan yang benar untuk Persen yang diberikan.",
          navText: "Ketuk jawaban yang benar.",
          navTextCorrect: "Ketuk » untuk mencoba Persen lain.",
          navTextLast: "Ketuk » untuk merangkum.",
          hideVisualColumn: true,
          showFraction: true,
          denominator: "100",
          questions: [
            {
              percentNumber: "36",
              numerator: "36",
              options: ["36/100", "36/10", "360/100", "6/10"],
              answer: "36/100",
            },
            {
              percentNumber: "9",
              numerator: "9",
              options: ["9/100", "90/100", "9/10", "19/100"],
              answer: "9/100",
            },
            {
              percentNumber: "78",
              numerator: "78",
              options: ["78/100", "87/100", "78/10", "7/100"],
              answer: "78/100",
            },
            {
              percentNumber: "93",
              numerator: "93",
              options: ["39/100", "93/10", "93/100", "9/100"],
              answer: "93/100",
            },
            {
              percentNumber: "6",
              numerator: "6",
              options: ["60/100", "6/10", "16/100", "6/100"],
              answer: "6/100",
            },
            {
              percentNumber: "56",
              numerator: "56",
              options: ["56/100", "65/100", "56/10", "5/100"],
              answer: "56/100",
            },
            {
              percentNumber: "99",
              numerator: "99",
              options: ["9/100", "99/10", "99/100", "90/100"],
              answer: "99/100",
            },
          ],
          feedbacks: {
            correct:
              "Bagus sekali!\nAngka dalam\nPersen adalah\npembilang,\ndan tanda % berarti\npenyebut adalah 100.",
            wrong:
              "Belum tepat!\nAngka dalam\nPersen adalah\npembilang,\ndan % berarti\npenyebut adalah 100.",
          },
        },
      },
      labels: {
        fraction: "Pecahan",
        decimal: "Desimal",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
