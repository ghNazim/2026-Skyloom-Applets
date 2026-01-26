const current_language = "en";

const appData = {
  en: {
    // Navigation button texts
    navButtonStart: "Start",
    navButtonNext: "»",
    navButtonStartOver: "Start Over",

    // Step -1 - Intro splash screen
    stepIntro: {
      question: "Drawing Polygons and Curved Shapes",
      navText: "",
      contentText:
        "Let's draw <y>POLYGONS</y>\nand <y>CURVED SHAPES</y>.\n\nTap 'Start' to begin the lesson.",
    },

    // Step 0 - Polygon drawing (4 points, straight lines only)
    step0: {
      question: "<y>Join the 4 given points to make a POLYGON</y>",
            text2: "Shout out the line type and the points to join!",

      navText: "Tap line button, then drag from one point to another.",
      navTextComplete: "Tap next to continue.",
      feedbackWrong:
        "Oops!! Incorrect!\nA polygon is made up of\nstraight lines only.",
      feedbackCorrect: "Great job! You have made a polygon.",
      requiredLines: 4,
    },

    // Step 1 - Curved shape drawing (3 points, at least one curved)
    step1: {
      question: "<y>Join the points to make a CURVED SHAPE</y>",
      navText: "Select the line and tap the points to make a curved shape.",
      navTextComplete: "Activity Completed!!!",
      feedbackWrong:
        "Oops!! Incorrect!\nA curved shape should at\nleast have one curved line.",
      feedbackCorrect: "Awesome! You have made a curved shape out of 3 points.",
      requiredLines: 3,
    },

    // Buttons
    buttonStraight: "Straight",
    buttonCurved: "Curved",
  },
  id: {
    // Navigation button texts
    navButtonStart: "Mulai",
    navButtonNext: "»",
    navButtonStartOver: "Mulai Lagi",

    // Step -1 - Intro splash screen
    stepIntro: {
      question: "Menggambar Poligon dan Bentuk Lengkung",
      navText: "",
      contentText:
        "Mari menggambar <y>POLIGON</y>\ndan <y>BENTUK LENGKUNG</y>.\n\nKetuk 'Mulai' untuk memulai pelajaran.",
    },

    // Step 0 - Polygon drawing
    step0: {
      question: "Hubungkan 4 titik untuk membuat <y>POLIGON</y>",
      text2: "Keluarkan jenis garis dan titik yang dihubungkan!",
      navText: "Ketuk tombol garis, lalu seret dari satu titik ke titik lain.",
      navTextComplete: "Ketuk berikutnya untuk melanjutkan.",
      feedbackWrong:
        "Ups!! Salah!\nPoligon hanya terdiri dari\ngaris lurus saja.",
      feedbackCorrect: "Bagus! Kamu telah membuat poligon.",
      requiredLines: 4,
    },

    // Step 1 - Curved shape drawing
    step1: {
      question: "Hubungkan titik-titik untuk membuat <y>BENTUK LENGKUNG</y>",
      navText: "Pilih garis dan ketuk titik-titik untuk membuat bentuk lengkung.",
      navTextComplete: "Aktivitas Selesai!!!",
      feedbackWrong:
        "Ups!! Salah!\nBentuk lengkung harus memiliki\nsetidaknya satu garis lengkung.",
      feedbackCorrect: "Luar biasa! Kamu telah membuat bentuk lengkung dari 3 titik.",
      requiredLines: 3,
    },

    // Buttons
    buttonStraight: "Lurus",
    buttonCurved: "Lengkung",
  },
};

const APP_DATA = appData[current_language];
