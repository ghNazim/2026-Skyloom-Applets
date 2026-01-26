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
        heading: "Fractions to Decimal Numbers",
        text: "Let us explore how a digit's position after the decimal\npoint gives fractions with denominator <y>10</y> or <y>100</y>.",
        buttonText: "Start",
      },
      final: {
        heading: "Fractions to Decimal Numbers",
        text: "Great work!\nYou've explored how moving a digit across place values\nchanges its value by powers of <y>10</y>.",
        buttonText: "Start Over",
      },
      nav: {
        next: "Tap » to continue.",
      },
      steps: {
        5: {
          questionText: "Now, what happens when the digit '3' moves to the right across the place values?",
          navText: "Tap ≫ to explore.",
        },
        6: {
          questionText: "Use the arrows to move the digit '3' across place values.",
          navText: "Tap the arrow to move the digit.",
        },
      },
      labels: {
        placeValueChart: "Place value chart",
        standardForm: "Value of number in standard form",
        expandedForm: "Expanded form of the number",
      },
      placeLabels: ["H", "T", "O", "t", "h"],
      placeNames: ["hundreds", "tens", "ones", "tenths", "hundredths"],
    },
  },
  id: {
    app: {
      start: {
        heading: "Pecahan ke Bilangan Desimal",
        text: "Mari kita jelajahi bagaimana posisi digit setelah\ntitik desimal memberikan pecahan dengan penyebut <y>10</y> atau <y>100</y>.",
        buttonText: "Mulai",
      },
      final: {
        heading: "Pecahan ke Bilangan Desimal",
        text: "Kerja bagus!\nAnda telah menjelajahi bagaimana memindahkan digit melintasi nilai tempat\nmengubah nilainya dengan pangkat <y>10</y>.",
        buttonText: "Mulai Lagi",
      },
      nav: {
        next: "Ketuk » untuk melanjutkan.",
      },
      steps: {
        5: {
          questionText: "Sekarang, apa yang terjadi ketika digit '3' bergerak ke kanan melintasi nilai tempat?",
          navText: "Ketuk ≫ untuk menjelajahi.",
        },
        6: {
          questionText: "Gunakan panah untuk memindahkan digit '3' melintasi nilai tempat.",
          navText: "Ketuk panah untuk memindahkan digit.",
        },
      },
      labels: {
        placeValueChart: "Bagan nilai tempat",
        standardForm: "Nilai bilangan dalam bentuk baku",
        expandedForm: "Bentuk diperluas dari bilangan",
      },
      placeLabels: ["R", "P", "S", "p", "s"],
      placeNames: ["ratusan", "puluhan", "satuan", "persepuluhan", "perseratusan"],
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
