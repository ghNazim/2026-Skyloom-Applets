const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Finding Pre-image",
        text:
          "Given the image coordinates and the<br>translation (units of movement), find the<br>pre-image coordinates.<br><br>Click START to begin!",
        buttonText: "START",
      },
      question: {
        text:
          'A point is translated <span class="purple-bg">4 units to the right and 3 units downward</span>.<br>The image point is <span id="fly-point-q" class="fly-source">Q\'</span>(<span id="fly-x" class="fly-source">7</span>,<span id="fly-y" class="fly-source">2</span>). Find the pre-image Q.',
        textPlain:
          'A point is translated 4 units to the right and 3 units downward.<br>The image point is <span id="fly-point-q" class="fly-source">Q\'</span>(<span id="fly-x" class="fly-source">7</span>,<span id="fly-y" class="fly-source">2</span>). Find the pre-image Q.',
      },
      table: {
        pointImage: "Point Q'",
        pointPreImage: "Point Q",
        translation: "Translation",
        x: "x",
        y: "y",
        reveal: "Reveal",
        imageX: "7",
        imageY: "2",
        translationXStep3: "4",
        translationYStep3: "-3",
        revealConfig: {
          imageX: "7",
          imageY: "2",
          transX: "4",
          transXFly: "4",
          transY: "(-3)",
          transYFly: "(-3)",
          operator: " - ",
          resultX: "3",
          resultY: "5",
        },
      },
      dnd: {
        options: ["+4", "-3", "-4", "+3"],
        correct: { x: "+4", y: "-3" },
      },
      rightPanel: {
        step2Question:
          "How does the given translation affect the coordinates?",
        step3Instruction:
          "Simply subtract the translation from the image coordinate.",
        step3Result: "The pre-image coordinates of Point Q is (3,5).",
      },
      steps: {
        1: {
          navText: "Tap » to start solving",
        },
        2: {
          navTextDrag: "Drag the coordinates into the table correctly",
          navTextDone: "Tap » to find pre-image coordinates",
        },
        3: {
          navText: "Tap the button",
          navTextDone: "Tap » to continue",
        },
        4: {
          questionText:
            "The image of a line segment has endpoints M'(6,5) and N'(9,7). It was translated by (+2,+3). Find pre-image.",
          navText: "Drag the line segment to the pre-image position",
          navTextDone: "Tap » to continue",
          feedbackWrong: "Oops! Try again",
          feedbackCorrectDone:
            "Correct!\nYou moved the figure back to its pre-image position.",
          pointMPrimeLabel: "M' (6,5)",
          pointNPrimeLabel: "N' (9,7)",
        },
        5: {
          questionText:
            "Given image has translated 5 units left and 2 units upwards. Find the pre-image.",
          navTextDragA: "Drag point A to the pre-image position",
          navTextDragB: "Drag point B to the pre-image position",
          navTextDragC: "Drag point C to the pre-image position",
          navTextDragD: "Drag point D to the pre-image position",
          navTextDone: "Tap » to continue",
          feedbackWrong: "Oops! Try again",
          feedbackCorrectDone:
            "Well done! You have found the pre-image coordinates",
          pointALabel: "A' (2,6)",
          pointBLabel: "B' (6,6)",
          pointCLabel: "C' (6,4)",
          pointDLabel: "D' (2,4)",
        },
        6: {
          questionText:
            "Given image has translated 4 units to the right and 2 units downward. Find the pre-image.",
          navText: "Drag the figure to the pre-image position",
          navTextDone: "Tap » to continue",
          feedbackWrong: "Try again",
          feedbackCorrect:
            "Well done! You have found the pre-image coordinates",
        },
      },
      final: {
        heading: "",
        text:
          "Great job! You can now find the pre-image when the<br>image coordinates and units of movement are given.",
        buttonText: "START OVER",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Mencari Bangun Awal",
        text:
          "Diberikan koordinat bayangan dan<br>translasi (satuan pergerakan), temukan<br>koordinat bangun awalnya.<br><br>Ketuk MULAI untuk memulai!",
        buttonText: "MULAI",
      },
      question: {
        text:
          'Sebuah titik ditranslasi <span class="purple-bg">4 satuan ke kanan dan 3 satuan ke bawah</span>.<br>Titik bayangannya adalah <span id="fly-point-q" class="fly-source">Q\'</span>(<span id="fly-x" class="fly-source">7</span>,<span id="fly-y" class="fly-source">2</span>). Temukan bangun awal Q.',
        textPlain:
          'Sebuah titik ditranslasi 4 satuan ke kanan dan 3 satuan ke bawah.<br>Titik bayangannya adalah <span id="fly-point-q" class="fly-source">Q\'</span>(<span id="fly-x" class="fly-source">7</span>,<span id="fly-y" class="fly-source">2</span>). Temukan bangun awal Q.',
      },
      table: {
        pointImage: "Titik Q'",
        pointPreImage: "Titik Q",
        translation: "Translasi",
        x: "x",
        y: "y",
        reveal: "Ungkap",
        imageX: "7",
        imageY: "2",
        translationXStep3: "4",
        translationYStep3: "-3",
        revealConfig: {
          imageX: "7",
          imageY: "2",
          transX: "4",
          transXFly: "4",
          transY: "(-3)",
          transYFly: "(-3)",
          operator: " - ",
          resultX: "3",
          resultY: "5",
        },
      },
      dnd: {
        options: ["+4", "-3", "-4", "+3"],
        correct: { x: "+4", y: "-3" },
      },
      rightPanel: {
        step2Question:
          "Bagaimana translasi yang diberikan memengaruhi koordinat?",
        step3Instruction:
          "Cukup kurangi translasi dari koordinat bayangan untuk mendapatkan koordinat bangun awal.",
        step3Result: "Koordinat bangun awal Titik Q adalah (3,5).",
      },
      steps: {
        1: {
          navText: "Ketuk » untuk mulai menyelesaikan",
        },
        2: {
          navTextDrag:
            "Seret koordinat ke dalam tabel dengan benar",
          navTextDone: "Ketuk » untuk mencari koordinat bangun awal",
        },
        3: {
          navText: "Ketuk tombol",
          navTextDone: "Ketuk » untuk lanjut",
        },
        4: {
          questionText:
            "Bayangan ruas garis memiliki titik ujung M'(6,5) dan N'(9,7). Ditranslasi (+2,+3). Temukan bangun awal.",
          navText: "Seret ruas garis ke posisi bangun awal",
          navTextDone: "Ketuk » untuk lanjut",
          feedbackWrong: "Ups! Coba lagi",
          feedbackCorrectDone:
            "Benar!\nKamu telah mengembalikan bangun ke posisi bangun awalnya.",
          pointMPrimeLabel: "M' (6,5)",
          pointNPrimeLabel: "N' (9,7)",
        },
        5: {
          questionText:
            "Bayangan ditranslasi 5 satuan ke kiri dan 2 satuan ke atas. Temukan bangun awal.",
          navTextDragA: "Seret titik A ke posisi bangun awal",
          navTextDragB: "Seret titik B ke posisi bangun awal",
          navTextDragC: "Seret titik C ke posisi bangun awal",
          navTextDragD: "Seret titik D ke posisi bangun awal",
          navTextDone: "Ketuk » untuk lanjut",
          feedbackWrong: "Ups! Coba lagi",
          feedbackCorrectDone:
            "Bagus! Kamu telah menemukan koordinat bangun awal",
          pointALabel: "A' (2,6)",
          pointBLabel: "B' (6,6)",
          pointCLabel: "C' (6,4)",
          pointDLabel: "D' (2,4)",
        },
        6: {
          questionText:
            "Bayangan ditranslasi 4 satuan ke kanan dan 2 satuan ke bawah. Temukan bangun awal.",
          navText: "Seret bangun ke posisi bangun awal",
          navTextDone: "Ketuk » untuk lanjut",
          feedbackWrong: "Coba lagi",
          feedbackCorrect:
            "Bagus! Kamu telah menemukan koordinat bangun awal",
        },
      },
      final: {
        heading: "",
        text:
          "Bagus! Sekarang kamu dapat menemukan bangun awal ketika<br>koordinat bayangan dan satuan pergerakannya diberikan.",
        buttonText: "MULAI LAGI",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
