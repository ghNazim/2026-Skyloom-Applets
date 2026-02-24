
// Decimal separator for different languages
const decimal = {
  en: ".",
  id: ",",
};

// Master data structure - Ordering Decimal Numbers
const DATA = {
  en: {
    questions: [
      { numbers: [3.48, 2.73, 5.15], arrangement: "s2l" },
      { numbers: [6.95, 6.36, 5.15], arrangement: "s2l" },
      { numbers: [5.42, 5.49, 5.43], arrangement: "l2s" },
      { numbers: [7.56, 1.94, 9.08, 0.81], arrangement: "s2l" },
      { numbers: [2.13, 2.94, 2.52, 2.72], arrangement: "l2s" },
      { numbers: [31.58, 4.13, 76.09], arrangement: "s2l" },
    ],

    // Feedback texts (same for every question)
    wrongFeedback: "Not quite!\nCompare the\ndigits from\nleft to right\nusing place\nvalue, then\ntry again.",
    correctFeedbackS2L: "Great job!\nThe decimals are\nin the correct\norder from\nsmallest to\nlargest.",
    correctFeedbackL2S: "Great job!\nThe decimals are\nin the correct\norder from\nlargest to\nsmallest.",

    // Place value headings
    placeHeadings: {
      tens: "Tens",
      ones: "Ones",
      tenths: "Tenths",
      hundredths: "Hundredths",
    },

    // Start screen (Step 0)
    start: {
      heading: "Ordering Decimal Numbers",
      text: "Let's learn how to order <y>decimal numbers</y> from\n<y>smallest to largest</y> or <y>largest to smallest</y>.",
      buttonText: "Start",
    },

    // Final screen (Step 2)
    final: {
      heading: "Ordering Decimal Numbers",
      text: "Awesome!<br>You now know how to order decimals from \n<y>smallest to largest</y> or <y>largest to smallest</y> \nby comparing digits from <y>left to right</y>.",
      buttonText: "Start Over",
    },

    // Step 1 (question solving)
    step1: {
      questionS2L: "Arrange the decimal numbers in order from <y>smallest</y> to <y>largest</y>.",
      questionL2S: "Arrange the decimal numbers in order from <y>largest</y> to <y>smallest</y>.",
      navText: "Tap a decimal, tap a position to move to, then tap Check.",
      navTextNext: "Tap » to try next decimal numbers.",
      navTextComplete: "Tap » to complete the activity.",
    },

    // Buttons & labels
    checkBtn: "Check",
    placeHereBtn: "Place here",
    labels: {
      smallest: "Smallest",
      largest: "Largest",
    },
  },

  id: {
    questions: [
      { numbers: [3.48, 2.73, 5.15], arrangement: "s2l" },
      { numbers: [6.95, 6.36, 5.15], arrangement: "s2l" },
      { numbers: [5.42, 5.49, 5.43], arrangement: "l2s" },
      { numbers: [7.56, 1.94, 9.08, 0.81], arrangement: "s2l" },
      { numbers: [2.13, 2.94, 2.52, 2.72], arrangement: "l2s" },
      { numbers: [31.58, 4.13, 76.09], arrangement: "s2l" },
    ],

    wrongFeedback: "Belum tepat!\nBandingkan\nangka dari\nkiri ke kanan\nmenggunakan\nnilai tempat,\nlalu coba lagi.",
    correctFeedbackS2L: "Bagus!\nDesimal sudah\ndalam urutan\nyang benar dari\nterkecil ke\nterbesar.",
    correctFeedbackL2S: "Bagus!\nDesimal sudah\ndalam urutan\nyang benar dari\nterbesar ke\nterkecil.",

    placeHeadings: {
      tens: "Puluhan",
      ones: "Satuan",
      tenths: "Persepuluhan",
      hundredths: "Perseratusan",
    },

    start: {
      heading: "Mengurutkan Bilangan Desimal",
      text: "Mari belajar mengurutkan <y>bilangan desimal</y> dari\n<y>terkecil ke terbesar</y> atau <y>terbesar ke terkecil</y>.",
      buttonText: "Mulai",
    },

    final: {
      heading: "Mengurutkan Bilangan Desimal",
      text: "Luar biasa!<br>Kamu sekarang tahu cara mengurutkan desimal dari \n<y>terkecil ke terbesar</y> atau <y>terbesar ke terkecil</y>\n dengan membandingkan angka dari <y>kiri ke kanan</y>.",
      buttonText: "Ulangi",
    },

    step1: {
      questionS2L: "Susun bilangan desimal dari yang <y>terkecil</y> ke <y>terbesar</y>.",
      questionL2S: "Susun bilangan desimal dari yang <y>terbesar</y> ke <y>terkecil</y>.",
      navText: "Ketuk desimal, ketuk posisi untuk dipindahkan, lalu ketuk Periksa.",
      navTextNext: "Ketuk » untuk mencoba bilangan desimal berikutnya.",
      navTextComplete: "Ketuk » untuk menyelesaikan aktivitas.",
    },

    checkBtn: "Periksa",
    placeHereBtn: "Tempatkan di sini",
    labels: {
      smallest: "Terkecil",
      largest: "Terbesar",
    },
  },
};

// Current language data accessors
const APP_DATA = DATA[current_language];
