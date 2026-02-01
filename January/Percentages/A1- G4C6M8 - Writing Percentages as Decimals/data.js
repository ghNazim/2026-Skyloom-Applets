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
        heading: "Percent as Decimal",
        text: "Let’s see how a <y>Percent</y> can be written as <y>Decimal</y> .",
        buttonText: "Start",
      },
      splash: {
        // Step 7
        heading: "Splash",
        buttonText: "Continue",
        leftText: "24",
        percentSymbol: "%",
        equals: "=",
        numerator: "0",
        denominator: "24", // Used as second part of decimal in splash component logic if customized
        rightText: "Let’s practice writing Percent as a Decimal.",
      },
      final: {
        heading: "Percent as Decimal",
        text: "Awesome!<br>While writing a <y>Percent</y>, as a <y>Decimal</y>.<br>● Number before % → Number of hundredths<br>● % sign → means ‘out of 100’",
        buttonText: "Start Over",
        buttonTextPrevious: "Previous",
      },
      steps: {
        1: {
          questionText: "What Percent of the square is shaded?",
          questionTextCorrect:
            "Out of 100 squares, 24 are shaded. This represents 24%.",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » connect with decimal.",
          filledSquares: 24,
          percentNumber: "24",
          hideFractionColumn: true,
          // For Correct State of Step 1:
          reversedLayout: true, // Percent Left
          showPercent: true,
          // Logic: Hide Equals, Hide Breakdown/Decimal. MainCanvas logic must handle this.
          // Or we set showEquals: false and fractionHidden: true in MainCanvas logic dynamically for Step 1

          showFilledLabel: false,
          showFilledLabelCorrect: true,
          mcq: {
            options: ["20%", "21%", "24%", "25%"],
            answer: "24%",
            feedbacks: {
              correct: "Great job!<br>24 out of 100 means 24%.",
              wrong:
                "Not quite!<br>A Percent tells how many parts are shaded out of 100.<br>Count again and try.",
            },
          },
        },
        2: {
          questionText:
            "The <y>% sign</y> means “out of 100” and shows that the decimal is written in <y>hundredths</y>.",
          navText: "Tap » to find out the number hundredths.",
          filledSquares: 24,
          glowAllSquares: true,
          leftSideType: "decimal-breakdown",
          reversedLayout: true,
          showPercent: true,
          percentNumber: "24",
          highlightNumerator: true,
          decimalValue: " . ",
          highlightHundredths: true,
          // groupedBreakdown: false (default), ungrouped layout used here
        },
        3: {
          questionText:
            "The <y>number 24</y> represents the <y>shaded parts</y> and tells us there are <y>24 hundredths</y>.",
          navText: "Tap » to check for ones.",
          filledSquares: 24,
          glowFilledSquares: true,
          leftSideType: "decimal-breakdown",
          reversedLayout: true,
          showPercent: true,
          percentNumber: "24",
          highlightNumerator: true,
          decimalValue: ".24",
          activeLabels: true,
          pulsateTenths: true,
          pulsateHundredths: true,
        },
        4: {
          questionText:
            "The whole square is divided into 100 equal parts. Since 24 parts are shaded,<br> there are <y>24 hundredths</y>.",
          navText: "Tap » to continue.",
          filledSquares: 24,
          glowAllSquares: true,
          orangeBorderFilled: true,
          leftSideType: "decimal-breakdown",
          reversedLayout: true,
          showPercent: true,
          percentNumber: "24",
          highlightNumerator: true,
          decimalValue: "0.24",
          activeLabels: true,
          highlightOnes: true,
        },
        5: {
          questionText:
            "<y>24%</y> is written as <y>0.24</y>, which has 0 ones, 2 tenths, and 4 hundredths.",
          navText: "Tap » summarize.",
          filledSquares: 24,
          leftSideType: "decimal-breakdown",
          reversedLayout: true,
          showPercent: true,
          percentNumber: "24",
          highlightNumerator: true,
          decimalValue: "0.24",
          activeLabels: true,
        },
        6: {
          questionText:
            "The <y>number before the %</y> tells how many <y>hundredths</y>.<br>The <y>% sign</y> means out of 100.",
          navText: "Tap » to represent more Percents as Decimals.",
          filledSquares: 24,
          leftSideType: "decimal-breakdown",
          reversedLayout: true,
          showPercent: true,
          percentNumber: "24",
          highlightNumerator: true,
          decimalValue: "0.24",
          showArrowRightToLeft: true,
          groupedBreakdown: true, // Specifically for Step 6 as requested "step 6 is correct, it will have the blue box"
        },
        7: {
          // Splash step
          isSplash: true,
        },
        8: {
          // Question Loop
          questionText: "Choose the correct decimal for the given Percent.",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to try another Percent.",
          navTextLast: "Tap » to summarise.",
          hideVisualColumn: true,
          leftSideType: "decimal",
          reversedLayout: true, // 18% = 0.18
          showPercent: true,
          questions: [
            {
              percentNumber: "18",
              decimalValue: "0.18",
              options: ["0.81", "1.8", "8.1", "0.18"],
              answer: "0.18",
            },
            {
              percentNumber: "3",
              decimalValue: "0.03",
              options: ["0.3", "3.0", "0.03", "30"],
              answer: "0.03",
            },
            {
              percentNumber: "61",
              decimalValue: "0.61",
              options: ["6.1", "0.61", "61", "0.16"],
              answer: "0.61",
            },
            {
              percentNumber: "9",
              decimalValue: "0.09",
              options: ["0.9", "0.09", "9.0", "90"],
              answer: "0.09",
            },
            {
              percentNumber: "89",
              decimalValue: "0.89",
              options: ["8.9", "0.89", "89", "0.98"],
              answer: "0.89",
            },
            {
              percentNumber: "48",
              decimalValue: "0.48",
              options: ["4.8", "0.48", "48", "0.84"],
              answer: "0.48",
            },
            {
              percentNumber: "30",
              decimalValue: "0.30",
              options: ["0.30", "3.0", "0.03", "30"],
              answer: "0.30",
            },
          ],
          feedbacks: {
            correct:
              "Well done!<br>The number in a Percent tells how many hundredths.",
            wrong:
              "Not quite!<br>Remember, the number in a Percent tells how many hundredths.",
          },
        },
      },
      labels: {
        fraction: "Fraction",
        decimal: "Decimal",
        ones: "Ones",
        tenths: "Tenths",
        hundredths: "Hundredths",
      },
      arrowAnnotations: {
        numberOfHundredthsEqualsNumber: "Number of Hundredths = Number",
        hundredthsEqualsOutOf100: "Hundredths = out of 100",
        numberEqualsNumberOfHundredths: "Number = Number of Hundredths",
        percentOutOf100EqualsHundredths: "% (out of 100) = Hundredths",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Desimal sebagai Persen",
        text: "Mari kita lihat bagaimana <y>Desimal</y> <br>bisa ditampilkan sebagai <y>Persen</y>.",
        buttonText: "Mulai",
      },
      splash: {
        // Step 7
        heading: "Splash",
        buttonText: "Lanjut",
        leftText: "24",
        percentSymbol: "%",
        equals: "=",
        numerator: "0",
        denominator: "24", // Used as second part of decimal in splash component logic if customized
        rightText: "Mari kita berlatih menulis Persen sebagai Desimal.",
      },
      final: {
        heading: "Desimal sebagai Persen",
        text: "Luar biasa!<br>Saat menulis <y>Desimal</y> sebagai <y>Persen</y>.<br>● Jumlah perseratus → angka sebelum %<br>● Tempat perseratus dalam desimal → dari 100",
        buttonText: "Mulai Lagi",
        buttonTextPrevious: "Sebelumnya",
      },
      steps: {
        1: {
          questionText: "Berapa Persen dari persegi yang diarsir?",
          questionTextCorrect:
            "Dari 100 persegi, 24 diarsir. Ini mewakili 24%.",
          navText: "Ketuk jawaban yang benar.",
          navTextCorrect: "Ketuk » hubungkan dengan desimal.",
          filledSquares: 24,
          percentNumber: "24",
          hideFractionColumn: true,
          reversedLayout: true,
          showPercent: true,
          showFilledLabel: false,
          showFilledLabelCorrect: true,
          mcq: {
            options: ["20%", "21%", "24%", "25%"],
            answer: "24%",
            feedbacks: {
              correct: "Kerja bagus!<br>24 dari 100 berarti 24%.",
              wrong:
                "Belum tepat!<br>Persen menunjukkan berapa bagian yang diarsir dari 100.<br>Hitung lagi dan coba.",
            },
          },
        },
        2: {
          questionText:
            'Tanda <y>%</y> berarti "dari 100" dan menunjukkan bahwa desimal ditulis dalam <y>perseratus</y>.',
          navText: "Ketuk » untuk mengetahui jumlah perseratus.",
          filledSquares: 24,
          glowAllSquares: true,
          leftSideType: "decimal-breakdown",
          reversedLayout: true,
          showPercent: true,
          percentNumber: "24",
          highlightNumerator: true,
          decimalValue: " . ",
          highlightHundredths: true,
        },
        3: {
          questionText:
            "Angka <y>24</y> mewakili <y>bagian yang diarsir</y> dan memberitahu kita ada <y>24 perseratus</y>.",
          navText: "Ketuk » untuk memeriksa satuan.",
          filledSquares: 24,
          glowFilledSquares: true,
          leftSideType: "decimal-breakdown",
          reversedLayout: true,
          showPercent: true,
          percentNumber: "24",
          highlightNumerator: true,
          decimalValue: ".24",
          activeLabels: true,
          pulsateTenths: true,
          pulsateHundredths: true,
        },
        4: {
          questionText:
            "Persegi utuh dibagi menjadi 100 bagian yang sama. Karena 24 bagian diarsir, ada <y>24 perseratus</y>.",
          navText: "Ketuk » untuk melanjutkan.",
          filledSquares: 24,
          glowAllSquares: true,
          orangeBorderFilled: true,
          leftSideType: "decimal-breakdown",
          reversedLayout: true,
          showPercent: true,
          percentNumber: "24",
          highlightNumerator: true,
          decimalValue: "0.24",
          activeLabels: true,
          highlightOnes: true,
        },
        5: {
          questionText:
            "<y>24%</y> ditulis sebagai <y>0,24</y>, yang memiliki 0 satuan, 2 persepuluh, dan 4 perseratus.",
          navText: "Ketuk » untuk merangkum.",
          filledSquares: 24,
          leftSideType: "decimal-breakdown",
          reversedLayout: true,
          showPercent: true,
          percentNumber: "24",
          highlightNumerator: true,
          decimalValue: "0.24",
          activeLabels: true,
        },
        6: {
          questionText:
            "Angka <y>sebelum %</y> memberitahu berapa banyak <y>perseratus</y>.<br>Tanda <y>%</y> berarti dari 100.",
          navText:
            "Ketuk » untuk mewakili lebih banyak Persen sebagai Desimal.",
          filledSquares: 24,
          leftSideType: "decimal-breakdown",
          reversedLayout: true,
          showPercent: true,
          percentNumber: "24",
          highlightNumerator: true,
          decimalValue: "0.24",
          showArrowRightToLeft: true,
          groupedBreakdown: true,
        },
        7: {
          isSplash: true,
        },
        8: {
          questionText: "Pilih desimal yang benar untuk Persen yang diberikan.",
          navText: "Ketuk jawaban yang benar.",
          navTextCorrect: "Ketuk » untuk mencoba Persen lain.",
          navTextLast: "Ketuk » untuk merangkum.",
          hideVisualColumn: true,
          leftSideType: "decimal",
          reversedLayout: true,
          showPercent: true,
          questions: [
            {
              percentNumber: "18",
              decimalValue: "0,18",
              options: ["0,81", "1,8", "8,1", "0,18"],
              answer: "0,18",
            },
            {
              percentNumber: "3",
              decimalValue: "0,03",
              options: ["0,3", "3,0", "0,03", "30"],
              answer: "0,03",
            },
            {
              percentNumber: "61",
              decimalValue: "0,61",
              options: ["6,1", "0,61", "61", "0,16"],
              answer: "0,61",
            },
            {
              percentNumber: "9",
              decimalValue: "0,09",
              options: ["0,9", "0,09", "9,0", "90"],
              answer: "0,09",
            },
            {
              percentNumber: "89",
              decimalValue: "0,89",
              options: ["8,9", "0,89", "89", "0,98"],
              answer: "0,89",
            },
            {
              percentNumber: "48",
              decimalValue: "0,48",
              options: ["4,8", "0,48", "48", "0,84"],
              answer: "0,48",
            },
            {
              percentNumber: "30",
              decimalValue: "0,30",
              options: ["0,30", "3,0", "0,03", "30"],
              answer: "0,30",
            },
          ],
          feedbacks: {
            correct:
              "Bagus sekali!<br>Angka dalam Persen memberitahu berapa banyak perseratus.",
            wrong:
              "Belum tepat!<br>Ingat, angka dalam Persen memberitahu berapa banyak perseratus.",
          },
        },
      },
      labels: {
        fraction: "Pecahan",
        decimal: "Desimal",
        ones: "Satuan",
        tenths: "Persepuluh",
        hundredths: "Perseratus",
      },
      arrowAnnotations: {
        numberOfHundredthsEqualsNumber: "Jumlah Perseratus = Angka",
        hundredthsEqualsOutOf100: "Perseratus = dari 100",
        numberEqualsNumberOfHundredths: "Angka = Jumlah Perseratus",
        percentOutOf100EqualsHundredths: "% (dari 100) = Perseratus",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
