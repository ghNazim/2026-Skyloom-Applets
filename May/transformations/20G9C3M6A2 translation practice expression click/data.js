const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Practice:<br>Translation of a Straight Line",
        text:
          "Let's solve a few questions on translation of a straight line.<br><br>Click START to begin!",
        buttonText: "START",
      },
      textSplash: {
        heading: "Quick Recall",
        content:
          "When a line translates by (<pr>a</pr> , <yl>b</yl>), just replace<br>" +
          "x   →   ( x <pr>- a</pr> )<br>" +
          "y   →   ( y <yl>- b</yl> )<br>" +
          "in the original equation.",
      },
      steps: {
        1: {
          navText: "Tap » to start solving",
        },
        2: {
          navText: "Tap » to start solving",
        },
        3: {
          navText: "Drag and drop the correct option",
          navTextDone: "Tap » to simplify",
          actionTitle:
            "What should replace x and y to get the translated line equation?",
          feedbackText:
            "Substitute the translation ( <pr>a</pr> , <yl>b</yl> ) correctly<br>" +
            "by replacing x → ( x <pr>- a</pr> )  and  y → ( y <yl>- b</yl> ).",
        },
        4: {
          navText: "Tap the highlighted box to simplify",
          navTextDone: "Tap » to see the next question",
        },
      },
      startOver: {
        buttonText: "START OVER",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Latihan:<br>Translasi Garis Lurus",
        text:
          "Mari selesaikan beberapa soal tentang translasi garis lurus.<br><br>Ketuk MULAI untuk memulai!",
        buttonText: "MULAI",
      },
      textSplash: {
        heading: "Ingat Cepat",
        content:
          "Ketika sebuah garis ditranslasi sebesar (<pr>a</pr> , <yl>b</yl>), cukup ganti<br>" +
          "x   →   ( x <pr>- a</pr> )<br>" +
          "y   →   ( y <yl>- b</yl> )<br>" +
          "pada persamaan aslinya.",
      },
      steps: {
        1: {
          navText: "Ketuk » untuk mulai menyelesaikan",
        },
        2: {
          navText: "Ketuk » untuk mulai menyelesaikan",
        },
        3: {
          navText: "Seret dan lepas pilihan yang benar",
          navTextDone: "Ketuk » untuk menyederhanakan",
          actionTitle:
            "Apa yang harus menggantikan x dan y untuk mendapatkan persamaan garis hasil translasi?",
          feedbackText:
            "Substitusikan translasi ( <pr>a</pr> , <yl>b</yl> ) dengan benar<br>" +
            "dengan mengganti x → ( x <pr>- a</pr> )  dan  y → ( y <yl>- b</yl> ).",
        },
        4: {
          navText: "Ketuk kotak yang disorot untuk menyederhanakan",
          navTextDone: "Ketuk » untuk melihat soal berikutnya",
        },
      },
      startOver: {
        buttonText: "MULAI LAGI",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
APP_DATA.questions = buildQuestions(current_language);
const decimalSymbol = decimal[current_language];
