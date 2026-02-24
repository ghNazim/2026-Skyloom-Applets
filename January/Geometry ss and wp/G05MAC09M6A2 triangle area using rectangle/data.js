// const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Area of Triangle",
        text: "Let's derive the area formula for triangle.<br>Tap 'Start' to begin the activity.",
        buttonText: "Start",
      },
      steps: {
        1: {
          questionText: "Create a triangle of your choice.",
          navText: "Drag the vertex of the triangle and tap » once you are done.",
          navNext: "Tap » to continue.",
        },
        2: {
          questionText: "Let's create an identical triangle.",
          navText: "Tap 'Identical Triangle'.",
          questionTextAfterCopy: "Good job! You created an identical triangle.",
          navTextAfterCopy: "Tap » to flip and join the new triangle to the original.",
          navNext: "Tap ⟲ to see the visualization or tap » to continue.",
          navNextAfterAnimation: "Superb, you made a parallelogram using two identical triangles.",
          actionButton: "Identical Triangle",
        },
        3: {
          questionText: "Superb, you made a parallelogram using two identical triangles.",
          navText: "Tap 'Make a rectangle'.",
          navNext: "Tap ⟲ to see the visualization or tap » to continue.",
          navNextAfterAnimation: "Fantastic! You made a rectangle of length 'b' and width 't'.",
          actionButton: "Make a rectangle",
        },
        4: {
          questionText: "We observed that two identical triangles combine to form a rectangle.",
          navText: "Tap » to simplify.",
          textBefore: "2  × (Area of a Triangle) = ",
          textAfter: "Area of Rectangle",
        },
        5: {
          questionText: "We observed that two identical triangles combine to form a rectangle.",
          navText: "Tap the highlighted text.",
          navNext: "Tap » to summarise.",
          questionTextAfter: "We found the formula for the area of triangle.",
          textBefore: "Area of a Triangle = ½  × ",
          textAfter: "Area of Rectangle",
          formulaText: " b × t",
        },
        6: {
          questionText: "We found the formula for the area of triangle.",
          navText: "Tap » to summarise.",
        }
      },
      final: {
        heading: "Summary",
        text: "Area of a Triangle   = ½  × <span class=\"highlight-yellow\">b</span> × <span class=\"highlight-blue\">t</span>",
        buttonText: "Start Over",
        imageSrc: "assets/final.png",
      },
    },
  },
  id: {
  app: {
    start: {
      heading: "Luas Segitiga",
      text: "Mari kita turunkan rumus luas segitiga.<br>Ketuk 'Mulai' untuk memulai aktivitas.",
      buttonText: "Mulai",
    },
    steps: {
      1: {
        questionText: "Buatlah segitiga pilihan Anda.",
        navText: "Seret titik sudut segitiga dan ketuk » setelah Anda selesai.",
        navNext: "Ketuk » untuk melanjutkan.",
      },
      2: {
        questionText: "Mari kita buat segitiga yang identik.",
        navText: "Ketuk 'Segitiga Identik'.",
        questionTextAfterCopy: "Bagus! Kamu membuat segitiga yang identik.",
        navTextAfterCopy: "Ketuk » untuk membalik dan menggabungkan segitiga baru ke segitiga asli.",
        navNext: "Ketuk ⟲ untuk melihat visualisasi atau ketuk » untuk melanjutkan.",
        navNextAfterAnimation: "Luar biasa, Anda membuat jajaran genjang menggunakan dua segitiga identik.",
        actionButton: "Segitiga Identik",
      },
      3: {
        questionText: "Luar biasa, Anda membuat jajaran genjang menggunakan dua segitiga identik.",
        navText: "Ketuk 'Buat persegi panjang'.",
        navNext: "Ketuk ⟲ untuk melihat visualisasi atau ketuk » untuk melanjutkan.",
        navNextAfterAnimation: "Fantastis! Anda membuat persegi panjang dengan panjang 'b' dan lebar 't'.",
        actionButton: "Buat persegi panjang",
      },
      4: {
        questionText: "Kita mengamati bahwa dua segitiga identik bergabung membentuk persegi panjang.",
        navText: "Ketuk » untuk menyederhanakan.",
        textBefore: "2 × (Luas Segitiga) = ",
        textAfter: "Luas Persegi Panjang",
      },
      5: {
        questionText: "Kita mengamati bahwa dua segitiga identik bergabung membentuk persegi panjang.",
        navText: "Ketuk teks yang disorot.",
        navNext: "Ketuk » untuk merangkum.",
        questionTextAfter: "Kita telah menemukan rumus untuk luas segitiga.",
        textBefore: "Luas Segitiga = ½ × ",
        textAfter: "Luas Persegi Panjang",
        formulaText: " b × t",
      },
      6: {
        questionText: "Kita telah menemukan rumus untuk luas segitiga.",
        navText: "Ketuk » untuk merangkum.",
      }
    },
    final: {
      heading: "Ringkasan",
      text: "Luas Segitiga = ½ × <span class=\"highlight-yellow\">b</span> × <span class=\"highlight-blue\">t</span>",
      buttonText: "Ulangi dari Awal",
      imageSrc: "assets/final.png",
    },
  },
},
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
