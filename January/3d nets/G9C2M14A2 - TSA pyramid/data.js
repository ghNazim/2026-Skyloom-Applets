

const DATA = {
  en: {
    app: {
      start: {
        heading: "Surface Area of a Square Pyramid",
        text: 'Let\'s explore the formulas to find the total and lateral surface areas of a square pyramid.<br>Tap "Start" to start the activity.',
        buttonText: "Start",
      },
      steps: {
        1: {
          q: "A square pyramid has one square base and four lateral faces connected to it.",
          n: 'Tap "Unfold" to see the net of the pyramid.',
          qAfterUnfold:
            "The net of the square pyramid shows one square base and four triangular lateral faces.",
          nAfterUnfold: "Tap » to continue.",
        },
        2: {
          q: "The lateral surface area of a square pyramid is the sum of the areas of its four triangular faces.",
          n: "Tap » to continue.",
        },
        3: {
          q: "Let's find the area of each triangular face.",
          n: "Tap the correct answer.",
          nAfterCorrect: "Tap » to simplify.",
          mcqTitle:
            "What is the area of the square<br>base with side length <i>a</i>?",
          options: ["2 × a × l", "½ × a × l", "a × l"],
          correct: 1,
        },
        4: {
          q: "We simplified the numbers in the expression.",
          n: "Tap » to explore the total surface area.",
        },
        5: {
          q: "Total surface area is the sum of the areas of the base and lateral faces.",
          n: "Tap » to continue.",
        },
        6: {
          q: "Let's find the area of the square base.",
          n: "Tap the correct answer.",
          nAfterCorrect: "Tap » to simplify.",
          mcqTitle:
            "What is the area of the square<br>base with side length <i>a</i>?",
          options: ["2 × a × l", "½ × a × l", "a²"],
          correct: 2,
        },
        7: {
          q: "Total surface area is the sum of the areas of the base and lateral faces.",
          n: "Tap » to summarise.",
        },
      },
      final: {
        heading: "Activity Completed!",
        text:
          "The <y>surface area of a square pyramid</y> can be found using the following formula.<br><br>" +
          "<y>Lateral Surface Area = 2al</y><br>" +
          "<y>Total Surface Area = a² + 2al</y><br><br>" +
          "where, l → slant height of the pyramid<br>" +
          "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a → side length of the base<br>" +
          'Tap "Start Over" to restart the activity.',
        buttonText: "Start Over",
      },
      canvas: {
        unfoldButton: "Unfold",
        legend:
          'Where, <i>l</i> – slant height of the pyramid<br><i>a</i> – side length of the square base',
        lateralSurfaceArea: "Lateral Surface Area",
        totalSurfaceArea: "Total Surface Area",
        areaOfTriangularFace: "Area of a triangular face",
        areaOfBase: "Area of base",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Luas Permukaan Limas Persegi",
        text: 'Mari pelajari rumus untuk mencari luas permukaan total dan samping dari sebuah limas persegi.<br>Ketuk "Mulai" untuk memulai aktivitas.',
        buttonText: "Mulai",
      },
      steps: {
        1: {
          q: "Limas persegi memiliki satu alas persegi dan empat sisi tegak yang terhubung dengannya.",
          n: 'Ketuk "Buka" untuk melihat jaring-jaring limas.',
          qAfterUnfold:
            "Jaring-jaring limas persegi menunjukkan satu alas persegi dan empat sisi tegak berbentuk segitiga.",
          nAfterUnfold: "Ketuk » untuk melanjutkan.",
        },
        2: {
          q: "Luas permukaan samping limas persegi adalah jumlah luas dari keempat sisi segitiganya.",
          n: "Ketuk » untuk melanjutkan.",
        },
        3: {
          q: "Mari cari luas dari setiap sisi segitiga.",
          n: "Ketuk jawaban yang benar.",
          nAfterCorrect: "Ketuk » untuk menyederhanakan.",
          mcqTitle:
            "Berapakah luas alas persegi<br>dengan panjang sisi <i>a</i>?",
          options: ["2 × a × l", "½ × a × l", "a × l"],
          correct: 1,
        },
        4: {
          q: "Kita telah menyederhanakan angka dalam ekspresi tersebut.",
          n: "Ketuk » untuk mempelajari luas permukaan total.",
        },
        5: {
          q: "Luas permukaan total adalah jumlah luas alas dan luas sisi tegak.",
          n: "Ketuk » untuk melanjutkan.",
        },
        6: {
          q: "Mari cari luas dari alas persegi.",
          n: "Ketuk jawaban yang benar.",
          nAfterCorrect: "Ketuk » untuk menyederhanakan.",
          mcqTitle:
            "Berapakah luas alas persegi<br>dengan panjang sisi <i>a</i>?",
          options: ["2 × a × l", "½ × a × l", "a²"],
          correct: 2,
        },
        7: {
          q: "Luas permukaan total adalah jumlah luas alas dan luas sisi tegak.",
          n: "Ketuk » untuk merangkum.",
        },
      },
      final: {
        heading: "Aktivitas Selesai!",
        text:
          " <y>Luas permukaan limas persegi</y> dapat dicari dengan menggunakan rumus berikut.<br><br>" +
          "<y>Luas Permukaan Samping = 2al</y><br>" +
          "<y>Luas Permukaan Total = a² + 2al</y><br><br>" +
          "di mana, l → tinggi miring limas<br>" +
          "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a → panjang sisi alas<br>" +
          'Ketuk "Ulangi" untuk mengulang aktivitas.',
        buttonText: "Ulangi",
      },
      canvas: {
        unfoldButton: "Buka",
        legend:
          'Di mana, <i>l</i> – tinggi miring limas<br><i>a</i> – panjang sisi alas persegi',
        lateralSurfaceArea: "Luas Permukaan Samping",
        totalSurfaceArea: "Luas Permukaan Total",
        areaOfTriangularFace: "Luas sisi segitiga",
        areaOfBase: "Luas alas",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
