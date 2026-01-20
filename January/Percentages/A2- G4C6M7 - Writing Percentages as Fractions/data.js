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
        heading: "Fraction as Percent",
        text: "We know that fractions show parts of <y>a whole</y>.<br>Let's see how the same part can be shown as a <y>Percent</y>.",
        buttonText: "Start",
      },
      splash: { // Keeping structure to avoid errors, but Logic will skip it if App.js is updated
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
        text: "Awesome!<br>When writing a <y>fraction</y>, as a <y>percent</y>.<br>●Numerator → number before %<br>●Denominator 100 → % sign (Per 100)",
        buttonText: "Start Over",
      },
      steps: {
        1: {
          questionText: "Which fraction represents the shaded squares?",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap ≫ to write the same as Percent.",
          filledSquares: 19,
          hideFractionColumn: true,
          mcq: {
            options: ["9/100", "23/100", "19/100", "91/100"],
            answer: "19/100",
            feedbacks: {
              correct: "Correct! The numerator shows the number of shaded squares, and the denominator shows 100 equal parts.",
              wrong: "Not quite! The numerator shows the number of shaded squares, and the denominator shows 100 equal parts.",
            },
          },
          numerator: "19",
          denominator: "100"
        },
        2: {
          questionText: `A denominator of 100 means “out of 100,” which is what <y>Percent</y> means.<br>That’s why we can write it as a percent.`,
          navText: "Tap ≫ to write the number in the Percent.",
          filledSquares: 19,
          showFraction: true,
          numerator: "19",
          denominator: "100",
          showPercent: true,
          percentNumber: "  ",
          percentSymbol: "%",
          hideMcq: true
        },
        3: {
          questionText: "The <y>numerator</y> becomes the number before the <y>% Sign</y>.",
          navText: "Tap ≫ to summarize.",
          filledSquares: 19,
          showFraction: true,
          numerator: "19",
          denominator: "100",
          showPercent: true,
          percentNumber: "19",
          percentSymbol: "%",
          pulsateNumber: true,
          highlightNumerator: true
        },
        4: {
          questionText: "The <y>numerator</y> becomes the <y>number</y> before the %.<br>The <y>denominator</y> 100 means ‘per hundred’ so it becomes the <y>% sign</y>.",
          navText: "Tap ≫ to represent more fractions as Percents",
          filledSquares: 19,
          showFraction: true,
          numerator: "19",
          denominator: "100",
          showPercent: true,
          percentNumber: "19",
          percentSymbol: "%",
          showArrowToNumerator: true,
          showArrowToDenominator: true
        },
        5: {
          questionText: "What percent does this fraction show?",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap ≫ to try another fraction.",
          navTextLast: "Tap ≫ to summarise.",
          hideVisualColumn: true,
          showFraction: true,
          denominator: "100",
          questions: [
            {
              percentNumber: "3",
              numerator: "3",
              options: ["30%", "13%", "77%", "3%"],
              answer: "3%",
            },
            { // 25
              percentNumber: "25",
              numerator: "25",
              options: ["52%", "15%", "25%", "5%"],
              answer: "25%",
            },
            { // 8
              percentNumber: "8",
              numerator: "8",
              options: ["80%", "81%", "8%", "18%"],
              answer: "8%",
            },
            { // 34
              percentNumber: "34",
              numerator: "34",
              options: ["43%", "31%", "34%", "340%"],
              answer: "34%",
            },
            { // 75
              percentNumber: "75",
              numerator: "75",
              options: ["57%", "51%", "75%", "5%"],
              answer: "75%",
            },
            { // 40
              percentNumber: "40",
              numerator: "40",
              options: ["4%", "40%", "14%", "41%"],
              answer: "40%",
            },
            { // 100
              percentNumber: "100",
              numerator: "100",
              options: ["10%", "100%", "1%", "11%"],
              answer: "100%",
            },
            { // 2
              percentNumber: "2",
              numerator: "2",
              options: ["20%", "22%", "2%", "12%"],
              answer: "2%",
            },
          ],
          feedbacks: {
            correct: "Correct!\nThe numerator \ngives the number,\nand the \ndenominator 100 \nmeans percent.",
            wrong: "Not quite! The \nnumerator becomes \nthe number, and the \ndenominator 100 \nmeans per hundred. \nTry again!",
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
        heading: "Pecahan sebagai Persen",
        text: "Pecahan menunjukkan bagian dari keseluruhan.<br>Mari kita lihat bagaimana bagian yang sama dapat ditunjukkan sebagai Persen.",
        buttonText: "Mulai",
      },
      // Placeholder ID data to prevent crashes if language switched, structure mirrors EN
      splash: {
        leftText: "12",
        percentSymbol: "%",
        equals: "=",
        numerator: "12",
        denominator: "100",
        rightText: "Mari berlatih",
        buttonText: "Lanjutkan",
      },
      final: {
        heading: "Persen sebagai Pecahan",
        text: "Luar biasa!",
        buttonText: "Mulai Lagi",
      },
      steps: {
          // Copied structure to keep ID valid
          1: { questionText: "...", navText: "...", filledSquares: 19, mcq: { options: [], answer: "", feedbacks: { correct: "...", wrong: "..." } } },
          2: { questionText: "...", navText: "...", filledSquares: 19 },
          3: { questionText: "...", navText: "...", filledSquares: 19 },
          4: { questionText: "...", navText: "...", filledSquares: 19 },
          5: { questionText: "...", navText: "...", questions: [], feedbacks: { correct: "...", wrong: "..." } }
      }, 
       labels: { fraction: "Pecahan", decimal: "Desimal" }
    }
  }
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
