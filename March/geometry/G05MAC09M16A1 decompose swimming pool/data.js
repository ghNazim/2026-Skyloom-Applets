const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      steps: {
        1: {
          questionText: "Let's find the area of the swimming pool.",
          navText: "Tap » to find the shape of the pool.",
        },
        2: {
          questionText:
            "Let's break down the shape of the pool into quadrilaterals to determine its area.",
          navText: "Tap 'Decompose'.",
          questionTextAfter:
            "Notice that the shape of the pool is made of one trapezoid, one rectangle, and one square.",
          navTextAfter: "Tap » to continue.",
          decomposeButton: "Decompose",
        },
        3: {
          questionText:
            "Area of the composite shape is the sum of the area of all parts.",
          navText: "Tap the trapezoid in the composite shape.",
        },
        4: {
          questionText:
            "Area of the composite shape is the sum of the area of all parts.",
          navText: "Use the numpad to fill the answer and click ✓.",
          navTextCorrect: "Tap » to continue.",
        },
        5: {
          questionText:
            "Area of the composite shape is the sum of the area of all parts.",
          navText: "Tap the rectangle in the composite shape.",
        },
        6: {
          questionText:
            "Area of the composite shape is the sum of the area of all parts.",
          navText: "Use the numpad to fill the answer and click ✓.",
          navTextCorrect: "Tap » to continue.",
        },
        7: {
          questionText:
            "Area of the composite shape is the sum of the area of all parts.",
          navText: "Tap the square in the composite shape.",
        },
        8: {
          questionText:
            "Area of the composite shape is the sum of the area of all parts.",
          navText: "Use the numpad to fill the answer and click ✓.",
          navTextCorrect: "Tap » to continue.",
        },
        9: {
          questionText:
            "Area of the composite shape is the sum of the area of all parts.",
          navText: "Tap 'Restart' to start over.",
          restartButton: "Restart",
        },
      },
      labels: {
        trapezoid: "Trapezoid",
        rectangle: "Rectangle",
        square: "Square",
        areaOfComposite: "Area of the composite shape",
        areaOf: "Area of",
        sqUnits: "sq. units",
      },
    },
  },
  id: {
    app: {
      steps: {
        1: {
          questionText: "Mari kita cari luas kolam renang.",
          navText: "Ketuk » untuk menemukan bentuk kolam.",
        },
        2: {
          questionText:
            "Mari kita uraikan bentuk kolam menjadi segi empat untuk menentukan luasnya.",
          navText: "Ketuk 'Uraikan'.",
          questionTextAfter:
            "Perhatikan bahwa bentuk kolam terdiri dari satu trapesium, satu persegi panjang, dan satu persegi.",
          navTextAfter: "Ketuk » untuk melanjutkan.",
          decomposeButton: "Uraikan",
        },
        3: {
          questionText:
            "Luas bentuk gabungan adalah jumlah luas semua bagian.",
          navText: "Ketuk trapesium pada bentuk gabungan.",
        },
        4: {
          questionText:
            "Luas bentuk gabungan adalah jumlah luas semua bagian.",
          navText: "Gunakan numpad untuk mengisi jawaban dan klik ✓.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
        },
        5: {
          questionText:
            "Luas bentuk gabungan adalah jumlah luas semua bagian.",
          navText: "Ketuk persegi panjang pada bentuk gabungan.",
        },
        6: {
          questionText:
            "Luas bentuk gabungan adalah jumlah luas semua bagian.",
          navText: "Gunakan numpad untuk mengisi jawaban dan klik ✓.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
        },
        7: {
          questionText:
            "Luas bentuk gabungan adalah jumlah luas semua bagian.",
          navText: "Ketuk persegi pada bentuk gabungan.",
        },
        8: {
          questionText:
            "Luas bentuk gabungan adalah jumlah luas semua bagian.",
          navText: "Gunakan numpad untuk mengisi jawaban dan klik ✓.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
        },
        9: {
          questionText:
            "Luas bentuk gabungan adalah jumlah luas semua bagian.",
          navText: "Ketuk 'Mulai Ulang' untuk memulai kembali.",
          restartButton: "Mulai Ulang",
        },
      },
      labels: {
        trapezoid: "Trapesium",
        rectangle: "Persegi Panjang",
        square: "Persegi",
        areaOfComposite: "Luas bentuk gabungan",
        areaOf: "Luas",
        sqUnits: "satuan persegi",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
