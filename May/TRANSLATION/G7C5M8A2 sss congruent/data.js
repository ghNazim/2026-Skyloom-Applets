const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "SSS Similarity",
        text:
          "Let's learn another similarity rule that can help us<br>" +
          "determine whether two triangles are similar.",
        buttonText: "START",
      },
      steps: {
        1: {
          questionText: "Build your own triangle.",
          navText:
            "Move the vertices to change the side lengths of the triangle.",
          navInteracted: "Tap \u00BB once you've built your triangle.",
        },
        2: {
          questionText:
            "Let's build another triangle whose corresponding sides are proportional.",
          navText:
            "Tap a button to choose the ratio of the corresponding sides.",
          questionAfterRatio: "Relationship between corresponding sides",
          navAfterAnimation: "Tap \u00BB to build the yellow triangle.",
          proportionalText:
            "Three pairs of corresponding\nsides are proportional",
        },
        3: {
          questionText: "Join the side lengths to build the new triangle.",
          navText:
            'Use \'<img src="assets/circle.png" class="nav-inline-icon" alt="" />\' to move and ' +
            '\'<img src="assets/rot.svg" class="nav-inline-icon" alt="" />\' to rotate.',
          navDone: "Tap the button to check both triangles are similar.",
          nextText: "Similarity",
        },
        4: {
          questionText: "",
          navText: "",
          questionOverlap: "The two triangles fit into one another.",
          bottomText: "The two triangles are similar.",
          navConclude: "Tap the button to conclude.",
          concludeText: "Conclude",
        },
        5: {
          questionText: "Let\u2019s see what we call this rule.",
          navText: "Tap the button to reveal the name.",
          panelText:
            "If three pairs of corresponding sides are proportional, then the triangles are similar.",
          nameButtonText: "Name",
          sssName: "SSS Similarity",
          questionRevealed: "This is called SSS similarity.",
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
        heading: "Kesebangunan S.S.S.",
        text:
          "Mari pelajari aturan kesebangunan lain yang dapat membantu kita<br>" +
          "menentukan apakah dua segitiga sebangun.",
        buttonText: "MULAI",
      },
      steps: {
        1: {
          questionText: "Bangun segitiga kamu sendiri.",
          navText: "Gerakkan titik sudut untuk mengubah panjang sisi segitiga.",
          navInteracted: "Ketuk » setelah kamu membuat segitigamu.",
        },
        2: {
          questionText:
            "Mari bangun segitiga lain yang sisi-sisi bersepadanannya proporsional.",
          navText:
            "Ketuk tombol untuk memilih rasio sisi-sisi yang bersepadanan.",
          questionAfterRatio: "Hubungan antara sisi-sisi yang bersepadanan",
          navAfterAnimation: "Ketuk \u00BB untuk membangun segitiga kuning.",
          proportionalText: "Tiga pasang sisi yang bersepadanan\nproporsional",
        },
        3: {
          questionText: "Gabungkan panjang sisi untuk membangun segitiga baru.",
          navText:
            'Gunakan \'<img src="assets/circle.png" class="nav-inline-icon" alt="" />\' untuk geser dan ' +
            '\'<img src="assets/rot.svg" class="nav-inline-icon" alt="" />\' untuk putar.',
          navDone:
            "Ketuk tombol untuk memeriksa apakah kedua segitiga sebangun.",
          nextText: "Kesebangunan",
        },
        4: {
          questionText: "",
          navText: "",
          questionOverlap: "Kedua segitiga cocok satu sama lain.",
          bottomText: "Kedua segitiga sebangun.",
          navConclude: "Ketuk tombol untuk menyimpulkan.",
          concludeText: "Simpulkan",
        },
        5: {
          questionText: "Mari lihat apa nama aturan ini.",
          navText: "Ketuk tombol untuk mengungkapkan namanya.",
          panelText:
            "Jika tiga pasang sisi yang bersepadanan proporsional, maka segitiga-segitiga tersebut sebangun.",
          nameButtonText: "Nama",
          sssName: "Kesebangunan S.S.S.",
          questionRevealed: "Ini disebut kesebangunan S.S.S.",
          navCompleted: "Aktivitas Selesai!!",
          nextText: "Mulai Lagi",
        },
      },
      finish: {
        heading: "Kesebangunan S.S.S.",
        text: "Kerja bagus!",
        buttonText: "MULAI LAGI",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
