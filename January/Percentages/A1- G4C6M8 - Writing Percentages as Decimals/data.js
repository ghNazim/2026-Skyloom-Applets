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
        text: "Let’s see how a <y>Percent</y> <br>can be written as <y>decimal</y> .",
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
        rightText: "Let’s practice writing Percent as a decimal."
      },
      final: {
        heading: "Percent as Decimal",
        text: "Awesome!<br>While writing a <y>Percent</y>, as a <y>decimal</y>.<br>●Number before % → Number of hundredths<br>●% sign → means ‘out of 100’",
        buttonText: "Start Over",
      },
      steps: {
        1: {
          questionText: "What Percent of the square is shaded?",
          questionTextCorrect: "Out of 100 squares, 24 are shaded. This represents 24%.",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap ≫ connect with decimal.",
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
              wrong: "Not quite!<br>A Percent tells how many parts are shaded out of 100.<br>Count again and try.",
            },
          },
        },
        2: {
          questionText: "The <y>% sign</y> means “out of 100” and shows that the decimal is written in <y>hundredths</y>.",
          navText: "Tap ≫ to find out the number hundredths.",
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
          questionText: "The <y>number 24</y> represents the <y>shaded parts</y> and tells us there are <y>24 hundredths</y>.",
          navText: "Tap ≫ to check for ones.",
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
          questionText: "The whole square is divided into 100 equal parts. Since 24 parts are shaded, there are <y>24 hundredths and 0 ones</y>...",
          navText: "Tap ≫ to continue.",
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
          questionText: "<y>24%</y> is written as <y>0.24</y>, which has 0 ones, 2 tenths, and 4 hundredths.",
          navText: "Tap ≫ summarize.",
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
          questionText: "The <y>number before the %</y> tells how many <y>hundredths</y>.<br>The <y>% sign</y> means out of 100.",
          navText: "Tap ≫ to represent more Percents as decimals.",
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
           isSplash: true
        },
        8: {
          // Question Loop
          questionText: "Choose the correct decimal for the given Percent.",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap ≫ to try another Percent.",
          navTextLast: "Tap ≫ to summarise.",
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
            }
          ],
          feedbacks: {
            correct: "Well done!<br>The number in a Percent tells how many hundredths.",
            wrong: "Not quite!<br>Remember, the number in a Percent tells how many hundredths.",
          },
        },
      },
      labels: {
        fraction: "Fraction",
        decimal: "Decimal",
        ones: "Ones",
        tenths: "Tenths",
        hundredths: "Hundredths"
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Desimal sebagai Persen",
        text: "Mari kita lihat bagaimana <y>desimal</y> <br>bisa ditampilkan sebagai <y>Persen</y>.",
        buttonText: "Mulai",
      },
      splash: { 
        heading: "Splash",
        buttonText: "Lanjut"
      },
      final: {
        heading: "Desimal sebagai Persen",
        text: "Luar biasa!<br>Saat menulis <y>desimal</y> sebagai <y>Persen</y>.<br>●Jumlah perseratus → angka sebelum %<br>●Tempat perseratus dalam desimal → dari 100",
        buttonText: "Mulai Lagi",
      },
      steps: {
          // Placeholder for ID steps if needed, for now EN is priority
      },
      labels: {
        fraction: "Pecahan",
        decimal: "Desimal",
        ones: "Satuan",
        tenths: "Persepuluh",
        hundredths: "Perseratus"
      },
    }
  }
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];

