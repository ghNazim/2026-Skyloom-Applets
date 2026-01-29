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
        heading: "Percent, Fractions and Decimals",
        text: "Let's see how a <y>part out of 100</y>\ncan be shown as a percent, a fraction, and a decimal.",
        buttonText: "Start",
      },
      final: {
        heading: "Percent, Fractions and Decimals",
        text: "Awesome!\nA <y>percent</y>, a <y>fraction</y>, and a <y>decimal</y>\ncan all show the same share.",
        buttonText: "Start Over",
      },
      nav: {
        next: "Tap » to continue.",
      },
      percent: "Percent",
      check: "Check",
      steps: {
        1: {
          phases: [
            {
              q: "Let's split the square into 100 equal parts.",
              n: "Tap the button to divide the unit square.",
              actionButton: "Divide the Unit Square",
            },
            {
              q: "Each tiny square is one part out of 100",
              n: "Tap a blinking part to see its value.",
            },
            {
              q: "One part out of 100 is called 1 percent.",
              n: "Tap » continue.",
            },
          ],
          mcqText: "A Percent shows how many parts out of 100 are shaded.",
        },
        2: {
          q: "Explore different <y>Percents</y> using the <y>100 grid</y>.",
          n: "Use the slider to shade parts.",
          nAfterSlider: "Tap » to represent given Percent.",
        },
        3: {
          targetValue: 7,
          q: "Represent 7%.",
          n: "Use the sliders to shade parts, then tap Check.",
          qCorrect: "7 shaded parts out of 100 represents 7 percent (7%).",
          nCorrect: "Tap » to check its fraction form.",
          wrongFeedback:
            "Not quite!\nPercent means\nper hundred.\nCheck the\nshaded parts and\ntry again.",
          correctFeedback:
            "Awesome!\nThe shaded parts\ncorrectly show 7\nper hundred,\nwhich is 7%.",
        },
        4: {
          q: "Can this shaded part be written as a fraction?",
          n: "Tap the correct answer.",
          mcqs: [
            {
              q: "Can this shaded part be written as a fraction?",
              n: "Tap the correct answer.",
              options: ["Yes", "No"],
              answer: "Yes",
            },
            {
              q: "Which fraction matches these shaded squares?",
              n: "Tap the correct answer.",
              options: ["7/100", "70/100"],
              answer: "7/100",
            },
            {
              q: "Can this shaded part be written as a decimal too?",
              n: "Tap the correct answer.",
              options: ["Yes", "No"],
              answer: "Yes",
            },
            {
              q: "Which decimals shows the same shaded part?",
              n: "Tap the correct answer.",
              options: ["0.71", "0.70", "0.07", "0.7"],
              answer: "0.07",
              wrongFeedback:
                "Not quite!\n7% means 7 out of\n100. Look for the\ndecimal that shows\nseven hundredths.",
              correctFeedback: "Great job!",
            },
          ],
          qFinal:
            "The same shaded squares <y>out of 100</y> can be written as a <y>Percent</y>, a <y>fraction</y>, and a <y>decimal</y>.",
          nFinal: "Tap »",
        },
      },
      labels: {
        percent: "Percent",
        fraction: "Fraction",
        decimal: "Decimal",
        partsOutOf100: (num) => `${num} part${num !== 1 ? "s" : ""} out of 100`,
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Persen, Pecahan dan Desimal",
        text: "Mari kita lihat bagaimana <y>bagian dari 100</y>\ndapat ditampilkan sebagai persen, pecahan, dan desimal.",
        buttonText: "Mulai",
      },
      final: {
        heading: "Persen, Pecahan dan Desimal",
        text: "Bagus sekali!\nPersen, pecahan, dan desimal\ndapat menunjukkan bagian yang sama.",
        buttonText: "Mulai Lagi",
      },
      nav: {
        next: "Ketuk » untuk melanjutkan.",
      },
      percent: "Persen",
      check: "Periksa",
      steps: {
        1: {
          phases: [
            {
              q: "Mari bagi persegi menjadi 100 bagian yang sama.",
              n: "Ketuk tombol untuk membagi persegi satuan.",
              actionButton: "Bagi Persegi Satuan",
            },
            {
              q: "Setiap persegi kecil adalah satu bagian dari 100",
              n: "Ketuk bagian yang berkedip untuk melihat nilainya.",
            },
            {
              q: "Satu bagian dari 100 disebut 1 persen.",
              n: "Ketuk » lanjutkan.",
            },
          ],
          mcqText:
            "Persen\nmenunjukkan\nberapa banyak\nbagian dari 100\nyang diarsir.",
        },
        2: {
          q: "Jelajahi berbagai Persen menggunakan grid 100.",
          n: "Gunakan penggeser untuk mengarsir bagian.",
          nAfterSlider: "Ketuk » untuk merepresentasi Persen yang diberikan.",
        },
        3: {
          targetValue: 7,
          q: "Representasikan 7%.",
          n: "Gunakan penggeser untuk mengarsir bagian, lalu ketuk Periksa.",
          qCorrect:
            "7 bagian yang diarsir dari 100 merepresentasikan 7 persen (7%).",
          nCorrect: "Ketuk » untuk memeriksa bentuk pecahannya.",
          wrongFeedback:
            "Tidak tepat!\nPersen berarti\nper seratus.\nPeriksa bagian\nyang diarsir dan\ncoba lagi.",
          correctFeedback:
            "Hebat!\nBagian yang diarsir\ndengan benar menunjukkan 7\nper seratus,\nyaitu 7%.",
        },
        4: {
          q: "Bisakah bagian yang diarsir ini ditulis sebagai pecahan?",
          n: "Ketuk jawaban yang benar.",
          mcqs: [
            {
              q: "Bisakah bagian yang diarsir ini ditulis sebagai pecahan?",
              n: "Ketuk jawaban yang benar.",
              options: ["Ya", "Tidak"],
              answer: "Ya",
            },
            {
              q: "Pecahan mana yang sesuai dengan persegi yang diarsir ini?",
              n: "Ketuk jawaban yang benar.",
              options: ["7/100", "70/100"],
              answer: "7/100",
            },
            {
              q: "Bisakah bagian yang diarsir ini ditulis sebagai desimal juga?",
              n: "Ketuk jawaban yang benar.",
              options: ["Ya", "Tidak"],
              answer: "Ya",
            },
            {
              q: "Desimal mana yang menunjukkan bagian yang diarsir yang sama?",
              n: "Ketuk jawaban yang benar.",
              options: ["0,71", "0,70", "0,07", "0,7"],
              answer: "0,07",
              wrongFeedback:
                "Tidak tepat!\n7% berarti 7 dari\n100. Cari desimal\nyang menunjukkan\ntujuh perseratus.",
              correctFeedback: "Bagus sekali!",
            },
          ],
          qFinal:
            "Persegi yang diarsir dari 100 dapat ditulis sebagai Persen, pecahan, dan desimal.",
          nFinal: "Ketuk »",
        },
      },
      labels: {
        percent: "Persen",
        fraction: "Pecahan",
        decimal: "Desimal",
        partsOutOf100: (num) => `${num} bagian dari 100`,
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
