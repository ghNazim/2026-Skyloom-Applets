const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Identify Congruent Polygons",
        text:
          "Let's identify congruent polygons<br><br>Tap \"Start\" to start the activity.",
        buttonText: "START",
      },
      steps: {
        1: {
          questionText:
            "Look at the given quadrilaterals and identify the congruent ones.",
          navTextInitial:
            "Select the congruent quadrilaterals and tap 'Check'.",
          navTextNext: "Tap » to see next question.",
          navTextConclude: "Tap » to conclude.",
        },
      },
      feedback: {
        correct:
          "Great job! The shapes are congruent because <b>both their sides and angles match</b> exactly.",
        sideMatch:
          "Not quite!<br>Even though the sides match, <b>the angles don't.</b> Check again.",
        angleMatch:
          "Not quite!<br>Even though the angles match, <b>the sides don't.</b> Check again.",
        noMatch:
          "Not quite!<br>Neither the angles match, nor the sides.<br>Check again.",
      },
      checkButton: "Check",
      shapeNames: {
        rectangle: "Rectangle",
        parallelogram: "Parallelogram",
        square: "Square",
        kite: "Kite",
        rhombus: "Rhombus",
      },
      angleLabels: {
        deg75: "75°",
        deg105: "105°",
      },
      finish: {
        text:
          "You identified congruent polygons by checking that both<br>their sides and angles match.<br><br>Tap \"Start Over\" to restart the activity.",
        buttonText: "START OVER",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Identifikasi Poligon Kongruen",
        text:
          "Mari identifikasi poligon kongruen<br><br>Ketuk \"Mulai\" untuk memulai aktivitas.",
        buttonText: "MULAI",
      },
      steps: {
        1: {
          questionText:
            "Perhatikan segi empat yang diberikan dan identifikasi yang kongruen.",
          navTextInitial:
            "Pilih segi empat yang kongruen dan ketuk 'Periksa'.",
          navTextNext: "Ketuk » untuk melihat pertanyaan berikutnya.",
          navTextConclude: "Ketuk » untuk menyimpulkan.",
        },
      },
      feedback: {
        correct:
          "Bagus! Bentuk-bentuk ini kongruen karena <b>panjang sisi dan sudutnya sama</b> persis.",
        sideMatch:
          "Belum tepat!<br>Meskipun panjang sisinya sama, <b>sudutnya tidak.</b> Periksa lagi.",
        angleMatch:
          "Belum tepat!<br>Meskipun sudutnya sama, <b>panjang sisinya tidak.</b> Periksa lagi.",
        noMatch:
          "Belum tepat!<br>Baik sudut maupun panjang sisi tidak sama.<br>Periksa lagi.",
      },
      checkButton: "Periksa",
      shapeNames: {
        rectangle: "Persegi Panjang",
        parallelogram: "Jajar Genjang",
        square: "Persegi",
        kite: "Layang-layang",
        rhombus: "Belah Ketupat",
      },
      angleLabels: {
        deg75: "75°",
        deg105: "105°",
      },
      finish: {
        text:
          "Kamu mengidentifikasi poligon kongruen dengan memeriksa bahwa<br>panjang sisi dan sudutnya sama.<br><br>Ketuk \"Mulai Lagi\" untuk mengulang aktivitas.",
        buttonText: "MULAI LAGI",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
