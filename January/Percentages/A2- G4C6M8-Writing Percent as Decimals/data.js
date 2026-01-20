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
        heading: "Decimal as Percent",
        text: "Let’s see how a <y>decimal</y> <br>can be shown as a <y>Percent</y>.",
        buttonText: "Start",
      },
      splash: { 
        // Unused in new flow but keeping for safety
        heading: "Splash",
        buttonText: "Continue"
      },
      final: {
        heading: "Decimal as percent",
        text: "Awesome!<br>When writing a <y>decimal</y> as a <y>Percent</y>.<br>●Number of hundredths → number before %<br>●Hundredths place in the decimal→ out of 100",
        buttonText: "Start Over",
      },
      steps: {
        1: {
          questionText: "Which decimal shows the shaded parts?",
          questionTextCorrect: "<y>27</y> shaded squares <y>out of 100</y> represent <y>27 hundredths</y>.",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap ≫ to write the same as Percent.",
          filledSquares: 27,
          hideFractionColumn: true, // Initially hidden
          leftSideType: "decimal", // When shown, it will be decimal box
          decimalValue: "0.27",
          showPercent: false, // Hide percent box/equals initially
          mcq: {
            options: ["0.27","0.37","2.7","2.07"],
            answer: "0.27",
            feedbacks: {
              correct: "Great job!<br>Each shaded square is one hundredth.<br>27 hundredths = 0.27.",
              wrong: "Not quite!<br>Each small square is one hundredth.<br>Count the shaded hundredths and try again.",
            },
          },
        },
        2: {
          questionText: "The <y>hundredths place</y> shows how many parts <y>out of 100</y> are there, which is the <y>Percent</y>.",
          navText: "Tap ≫ to write the number in the Percent.",
          filledSquares: 27,
          decimalValue: "0.27",
          leftSideType: "decimal-highlight", // "27" in bluish color
          showPercent: true,
          percentNumber: "  ", // Blank
          percentSymbol: "%",
          hideMcq: true
        },
        3: {
          questionText: "The <y>number of hundredths</y> becomes the <y>number</y> before the % sign.",
          navText: "Tap ≫ to summarize.",
          filledSquares: 27,
          decimalValue: "0.27",
          leftSideType: "decimal-highlight",
          showPercent: true,
          percentNumber: "27",
          percentSymbol: "%",
          highlightNumerator: true, // Reuse this prop for coloring the percent number bluish
        },
        4: {
          questionText: "The <y>number before the %</y> tells how many <y>hundredths</y>.<br>“<y>Hundredths</y>” means <y>out of 100</y>.",
          navText: "Tap ≫ to represent more decimals as Percents.",
          filledSquares: 27,
          leftSideType: "decimal-breakdown", // Special breakdown view
          decimalValue: "0.27",
          showPercent: true,
          percentNumber: "27",
          percentSymbol: "%",
          highlightNumerator: true,
          showArrowToDecimal: true, // From box to number
          showArrowToPercent: true // From hundredths label to %
        },
        5: {
          questionText: "Choose the correct Percent for the given decimal.",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap ≫ to try another decimal.",
          navTextLast: "Tap ≫ to summarise.",
          hideVisualColumn: true,
          leftSideType: "decimal",
          showPercent: true, // This enables the right side box
          questions: [
            {
              decimalValue: "0.06",
              percentNumber: "6",
              options: ["6%", "16%", "60%", "61%"],
              answer: "6%",
            },
            {
              decimalValue: "0.25",
              percentNumber: "25",
              options: ["25%", "52%", "2.5%", "5%"],
              answer: "25%",
            },
            {
              decimalValue: "0.15",
              percentNumber: "15",
              options: ["15%", "51%", "1.5%", "5%"],
              answer: "15%",
            },
            {
              decimalValue: "0.76",
              percentNumber: "76",
              options: ["76%", "67%", "7.6%", "6%"],
              answer: "76%",
            },
            {
              decimalValue: "0.81",
              percentNumber: "81",
              options: ["81%", "18%", "8.1%", "8%"],
              answer: "81%",
            },
            {
              decimalValue: "0.33",
              percentNumber: "33",
              options: ["33%", "3%", "3.3%", "30%"],
              answer: "33%",
            },
            {
              decimalValue: "0.01",
              percentNumber: "1",
              options: ["1%", "10%", "0.1%", "0.01%"],
              answer: "1%",
            },
            {
              decimalValue: "0.99",
              percentNumber: "99",
              options: ["99%", "9%", "9.9%", "100%"],
              answer: "99%",
            },
            {
              decimalValue: "0.69",
              percentNumber: "69",
              options: ["69%", "96%", "6.9%", "6%"],
              answer: "69%",
            },
          ],
          feedbacks: {
            correct: "Awesome!<br>There are <n> hundredths in the given decimal,<br>which represents <p>.",
            wrong: "Not quite!<br>The decimal shows <n> hundredths. Each hundredth is one percent.",
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
        1: {
          questionText: "Desimal mana yang menunjukkan bagian yang diarsir?",
          questionTextCorrect: "<y>27</y> kotak yang diarsir <y>dari 100</y> mewakili <y>27 perseratus</y>.",
          navText: "Ketuk jawaban yang benar.",
          navTextCorrect: "Ketuk ≫ untuk menuliskannya sebagai Persen.",
          filledSquares: 27,
          hideFractionColumn: true,
          leftSideType: "decimal",
          decimalValue: "0.27",
          showPercent: false,
          mcq: {
            options: ["0.27","0.37","2.7","2.07"],
            answer: "0.27",
            feedbacks: {
              correct: "Kerja bagus!<br>Setiap kotak yang diarsir adalah satu perseratus.<br>27 perseratus = 0,27.",
              wrong: "Kurang tepat!<br>Setiap kotak kecil adalah satu perseratus.<br>Hitung perseratus yang diarsir dan coba lagi.",
            },
          },
        },
        2: {
          questionText: "<y>Tempat perseratus</y> menunjukkan ada berapa bagian <y>dari 100</y>, yang merupakan <y>Persen</y>.",
          navText: "Ketuk ≫ untuk menuliskan angka dalam Persen.",
          filledSquares: 27,
          decimalValue: "0.27",
          leftSideType: "decimal-highlight",
          showPercent: true,
          percentNumber: "  ",
          percentSymbol: "%",
          hideMcq: true
        },
        3: {
          questionText: "<y>Jumlah perseratus</y> menjadi <y>angka</y> sebelum tanda %.",
          navText: "Ketuk ≫ untuk menyimpulkan.",
          filledSquares: 27,
          decimalValue: "0.27",
          leftSideType: "decimal-highlight",
          showPercent: true,
          percentNumber: "27",
          percentSymbol: "%",
          highlightNumerator: true,
        },
        4: {
          questionText: "<y>Angka sebelum %</y> memberitahu berapa banyak <y>perseratus</y>.<br>“<y>Perseratus</y>” berarti <y>dari 100</y>.",
          navText: "Ketuk ≫ untuk menyajikan lebih banyak desimal sebagai Persen.",
          filledSquares: 27,
          leftSideType: "decimal-breakdown",
          decimalValue: "0.27",
          showPercent: true,
          percentNumber: "27",
          percentSymbol: "%",
          highlightNumerator: true,
          showArrowToDecimal: true,
          showArrowToPercent: true
        },
        5: {
          questionText: "Pilih Persen yang benar untuk desimal yang diberikan.",
          navText: "Ketuk jawaban yang benar.",
          navTextCorrect: "Ketuk ≫ untuk mencoba desimal lain.",
          navTextLast: "Ketuk ≫ untuk menyimpulkan.",
          hideVisualColumn: true,
          leftSideType: "decimal",
          showPercent: true,
          questions: [
            {
              decimalValue: "0.06",
              percentNumber: "6",
              options: ["6%", "16%", "60%", "61%"],
              answer: "6%",
            },
            {
              decimalValue: "0.25",
              percentNumber: "25",
              options: ["25%", "52%", "2.5%", "5%"],
              answer: "25%",
            },
            {
              decimalValue: "0.15",
              percentNumber: "15",
              options: ["15%", "51%", "1.5%", "5%"],
              answer: "15%",
            },
            {
              decimalValue: "0.76",
              percentNumber: "76",
              options: ["76%", "67%", "7.6%", "6%"],
              answer: "76%",
            },
            {
              decimalValue: "0.81",
              percentNumber: "81",
              options: ["81%", "18%", "8.1%", "8%"],
              answer: "81%",
            },
            {
              decimalValue: "0.33",
              percentNumber: "33",
              options: ["33%", "3%", "3.3%", "30%"],
              answer: "33%",
            },
            {
              decimalValue: "0.01",
              percentNumber: "1",
              options: ["1%", "10%", "0.1%", "0.01%"],
              answer: "1%",
            },
            {
              decimalValue: "0.99",
              percentNumber: "99",
              options: ["99%", "9%", "9.9%", "100%"],
              answer: "99%",
            },
            {
              decimalValue: "0.69",
              percentNumber: "69",
              options: ["69%", "96%", "6.9%", "6%"],
              answer: "69%",
            },
          ],
          feedbacks: {
            correct: "Luar biasa!<br>Ada <n> perseratus dalam desimal yang diberikan,<br>yang mewakili <p>.",
            wrong: "Kurang tepat!<br>Desimal menunjukkan <n> perseratus. Setiap perseratus adalah satu persen.",
          },
        },
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
