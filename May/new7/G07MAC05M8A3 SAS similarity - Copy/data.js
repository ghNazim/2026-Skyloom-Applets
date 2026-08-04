const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "SAS Similarity",
        text:
          "Let's explore whether two pairs of proportional<br>" +
          "corresponding sides make two triangles similar.",
        buttonText: "Explore",
      },
      steps: {
        1: {
          questionText: "Build your own triangle.",
          navText: "Move the vertices to change the side lengths of the triangle.",
          navInteracted: "Tap \u00BB once you've built your triangle.",
        },
        2: {
          questionText: "Let's build another triangle with two proportional pairs of corresponding sides.",
          navText: "Tap a button to choose the ratio of the corresponding sides.",
          navAfterAnimation: "Tap \u00BB to build the yellow triangle.",
          proportionalText: "Two pairs of corresponding sides\nare proportional",
        },
        3: {
          questionText: "Join the side lengths to build the new triangle.",
          navText:
            "Use '<img src=\"assets/circle.png\" class=\"nav-inline-icon\" alt=\"\" />' to move and " +
            "'<img src=\"assets/rot.svg\" class=\"nav-inline-icon\" alt=\"\" />' to rotate.",
          navDone: "Tap \u00BB to complete the triangle.",
          nextText: "\u00BB",
        },
        4: {
          questionText: "Join the vertices to complete the new triangle.",
          navText: "Tap and drag the vertices to join the two vertices.",
          navDone: "Tap the button to check both triangles are similar.",
          nextText: "Similarity",
        },
        5: {
          questionText: "The two triangles didn\u2019t fit into one another.",
          navText: "Tap the button to conclude.",
          nonSimilarText: "The two triangles are not similar.",
          concludeText: "Conclude",
        },
        6: {
          questionText:
            "Two pairs of proportional corresponding sides are not enough to make two triangles similar.",
          navText: "Tap the highlighted button.",
          panelText:
            "Two pairs of proportional corresponding sides are not enough to make two triangles similar.",
          tryAngleButtonText:
            "What else do we need to make triangles similar?<br>" +
            "Let's try keeping the included angle equal.",
        },
        7: {
          questionText: "Make the included angles of the two triangles equal.",
          navText:
            "Use '<img src=\"assets/rot.svg\" class=\"nav-inline-icon\" alt=\"\" />' to modify the yellow triangle.",
          checkButtonText:
            "Two pairs of corresponding sides are proportional, and the included angles are equal. " +
            "Let's check if the triangles are similar.",
          navCheck: "Tap the button to check both triangles are similar.",
          questionFit: "The two triangles fit into one another.",
          navConclude: "Tap the button to conclude.",
          similarText: "The two triangles are similar.",
          concludeText: "Conclude",
        },
        8: {
          questionText: "Let\u2019s see what we call this rule.",
          navText: "Tap the button to reveal the name.",
          panelText:
            "Two pairs of proportional corresponding sides and an equal included angle make two triangles similar.",
          nameButtonText: "Name",
          sasName: "SAS Similarity",
          questionRevealed: "This is called SAS similarity.",
          navCompleted: "Activity Completed!!",
          nextText: "Start Over",
        },
      },
      finish: {
        heading: "SSS Similarity",
        text: "Great work!",
        buttonText: "START OVER",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Kesebangunan SAS",
        text:
          "Mari jelajahi apakah dua pasang sisi bersesuaian<br>" +
          "yang proporsional membuat dua segitiga sebangun.",
        buttonText: "Jelajahi",
      },
      steps: {
        1: {
          questionText: "Bangun segitiga Anda sendiri.",
          navText: "Gerakkan titik sudut untuk mengubah panjang sisi segitiga.",
          navInteracted: "Ketuk \u00BB setelah Anda membuat segitiga.",
        },
        2: {
          questionText: "Mari bangun segitiga lain dengan dua pasang sisi bersesuaian yang proporsional.",
          navText: "Ketuk tombol untuk memilih rasio sisi-sisi yang bersesuaian.",
          navAfterAnimation: "Ketuk \u00BB untuk membangun segitiga kuning.",
          proportionalText: "Dua pasang sisi yang bersesuaian\nproporsional",
        },
        3: {
          questionText: "Gabungkan panjang sisi untuk membangun segitiga baru.",
          navText:
            "Gunakan '<img src=\"assets/circle.png\" class=\"nav-inline-icon\" alt=\"\" />' untuk menggerakkan dan " +
            "'<img src=\"assets/rot.svg\" class=\"nav-inline-icon\" alt=\"\" />' untuk memutar.",
          navDone: "Ketuk \u00BB untuk melengkapi segitiga.",
          nextText: "\u00BB",
        },
        4: {
          questionText: "Hubungkan titik-titik sudut untuk melengkapi segitiga baru.",
          navText: "Ketuk dan seret titik sudut untuk menghubungkan dua titik sudut.",
          navDone: "Ketuk tombol untuk memeriksa apakah kedua segitiga sebangun.",
          nextText: "Kesebangunan",
        },
        5: {
          questionText: "Kedua segitiga tidak saling pas.",
          navText: "Ketuk tombol untuk menyimpulkan.",
          nonSimilarText: "Kedua segitiga tidak sebangun.",
          concludeText: "Simpulkan",
        },
        6: {
          questionText:
            "Dua pasang sisi bersesuaian yang proporsional belum cukup untuk membuat dua segitiga sebangun.",
          navText: "Ketuk tombol yang disorot.",
          panelText:
            "Dua pasang sisi bersesuaian yang proporsional belum cukup untuk membuat dua segitiga sebangun.",
          tryAngleButtonText:
            "Apa lagi yang kita butuhkan agar segitiga-segitiga sebangun?<br>" +
            "Mari coba menjaga sudut apitnya tetap sama.",
        },
        7: {
          questionText: "Buat sudut apit kedua segitiga sama besar.",
          navText:
            "Gunakan '<img src=\"assets/rot.svg\" class=\"nav-inline-icon\" alt=\"\" />' untuk mengubah segitiga kuning.",
          checkButtonText:
            "Dua pasang sisi yang bersesuaian proporsional, dan sudut apitnya sama. " +
            "Mari periksa apakah segitiga-segitiga tersebut sebangun.",
          navCheck: "Ketuk tombol untuk memeriksa apakah kedua segitiga sebangun.",
          questionFit: "Kedua segitiga cocok satu sama lain.",
          navConclude: "Ketuk tombol untuk menyimpulkan.",
          similarText: "Kedua segitiga sebangun.",
          concludeText: "Simpulkan",
        },
        8: {
          questionText: "Mari lihat apa nama aturan ini.",
          navText: "Ketuk tombol untuk mengungkapkan namanya.",
          panelText:
            "Dua pasang sisi bersesuaian yang proporsional dan sudut apit yang sama membuat dua segitiga sebangun.",
          nameButtonText: "Nama",
          sasName: "Kesebangunan SAS",
          questionRevealed: "Ini disebut kesebangunan SAS.",
          navCompleted: "Aktivitas Selesai!!",
          nextText: "Mulai Lagi",
        },
      },
      finish: {
        heading: "Kesebangunan SSS",
        text: "Kerja bagus!",
        buttonText: "MULAI LAGI",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
