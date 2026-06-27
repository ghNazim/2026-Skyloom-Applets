const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Finding Image Coordinates",
        text:
          "Given the coordinates of an object and the<br>movement (translation), let's see how to find the<br>coordinates of its image.<br><br>Click START to begin!",
        buttonText: "START",
      },
      question: {
        text:
          'A <span id="fly-point-p" class="fly-source">point P</span>(<span id="fly-x" class="fly-source">2</span>,<span id="fly-y" class="fly-source">1</span>) translates <span class="purple-bg">6 units right and 2 units up</span>.<br>Find the image coordinates.',
        textPlain:
          'A <span id="fly-point-p" class="fly-source">point P</span>(<span id="fly-x" class="fly-source">2</span>,<span id="fly-y" class="fly-source">1</span>) translates 6 units right and 2 units up.<br>Find the image coordinates.',
      },
      table: {
        pointP: "Point P",
        translation: "Translation",
        pointPPrime: "Point P'",
        x: "x",
        y: "y",
        reveal: "Reveal",
      },
      dnd: {
        options: ["+6", "+2", "-6", "-2"],
        correct: { x: "+6", y: "+2" },
      },
      rightPanel: {
        step2Question:
          "How does the given translation affect the coordinates?",
        step3Instruction:
          "Simply add the object coordinate and the translation to get the image coordinate.",
        step3Result: "The image coordinates of Point P is (8,3).",
      },
      steps: {
        1: {
          navText: "Tap » to start solving",
        },
        2: {
          navTextDrag: "Drag the coordinates into the table correctly",
          navTextDone: "Tap » to find image coordinates",
        },
        3: {
          navText: "Tap the button",
          navTextDone: "Tap » to visualise the translation",
        },
        4: {
          navText: "Tap the correct location on the graph",
          navTextDone: "Tap » to continue",
          titlePlaceP: "Locate P on the graph",
          titlePlacePPrime: "Locate P' on the graph",
          tableRows: {
            pointP: "Point P",
            pointPCoord: "(2, 1)",
            translation: "Translation",
            translationCoord: "(+6, +2)",
            pointPPrime: "Point P'",
            pointPPrimeCoord: "(8, 3)",
          },
          feedbackWrong: "Oops! Try again",
          feedbackCorrectP: "Well done!",
          feedbackCorrectPPrime:
            "Well done! You have translated point P correctly.",
          pointPLabel: "P (2,1)",
          pointPPrimeLabel: "P' (8,3)",
        },
        5: {
          questionText: "Translation of a Line Segment",
          navText: "Tap » to see next question",
          splashText:
            "Every point on a line segment translates the same way.\nTranslate the endpoints just as you would translate a point.",
        },
        6: {
          questionText:
            "AB with points A(2,2) and B(6,3) translates 3 units right and 1 unit downward. Find the image.",
          navTextPlaceA: "Tap to locate A'",
          navTextPlaceB: "Tap to locate B'",
          navTextDone: "Tap » to see next question",
          feedbackWrong: "Oops! Try again",
          feedbackCorrectA: "Well done!",
          feedbackCorrectDone:
            "Well done!\nYou have translated the line segment correctly.",
          pointALabel: "A (2,2)",
          pointBLabel: "B (6,3)",
        },
        7: {
          questionText:
            "MN with points M(6,5) and N(9,7) translates 4 units left and 3 units down. Find the image.",
          navText: "Drag the line segment to the image position",
          navTextDone: "Tap » to continue",
          feedbackWrong: "Oops! Try again",
          feedbackCorrectDone:
            "Well done!\nYou have translated the line segment correctly.",
          pointMLabel: "M (6,5)",
          pointNLabel: "N (9,7)",
        },
        8: {
          questionText: "Translation of a Planar Figure",
          navText: "Tap » to see next question",
          splashText:
            "Every point on a planar figure translates the same way.\nTranslate the vertices just as you would translate a point.",
        },
        9: {
          questionText:
            "Given figure translates 5 units right and 2 units down. Find the image.",
          navTextDragA: "Drag point A to the image position",
          navTextDragB: "Drag point B to the image position",
          navTextDragC: "Drag point C to the image position",
          navTextDragD: "Drag point D to the image position",
          navTextDone: "Tap » to see next question",
          feedbackWrong: "Oops! Try again",
          feedbackCorrectDone: "Well done!",
          pointALabel: "A (2,6)",
          pointBLabel: "B (6,6)",
          pointCLabel: "C (6,4)",
          pointDLabel: "D (2,4)",
        },
        10: {
          questionText:
            "Given figure translates 4 units to the left and 2 units upward. Find the image.",
          navText: "Drag the figure to the image position",
          navTextDone: "Tap » to continue",
          feedbackWrong: "Try again",
          feedbackCorrect:
            "Well done! You have translated the figure correctly.",
        },
      },
      final: {
        heading: "",
        text:
          "Great job! You can now find the image when the<br>pre-image coordinates and units of movement are given.",
        buttonText: "START OVER",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Mencari Koordinat Bayangan",
        text:
          "Diberikan koordinat sebuah objek dan<br>pergerakannya (translasi), mari lihat cara<br>mencari koordinat bayangannya.<br><br>Ketuk MULAI untuk memulai!",
        buttonText: "MULAI",
      },
      question: {
        text:
          'Sebuah <span id="fly-point-p" class="fly-source">titik P</span>(<span id="fly-x" class="fly-source">2</span>,<span id="fly-y" class="fly-source">1</span>) ditranslasi <span class="purple-bg">6 satuan ke kanan dan 2 satuan ke atas</span>.<br>Temukan koordinat bayangannya.',
        textPlain:
          'Sebuah <span id="fly-point-p" class="fly-source">titik P</span>(<span id="fly-x" class="fly-source">2</span>,<span id="fly-y" class="fly-source">1</span>) ditranslasi 6 satuan ke kanan dan 2 satuan ke atas.<br>Temukan koordinat bayangannya.',
      },
      table: {
        pointP: "Titik P",
        translation: "Translasi",
        pointPPrime: "Titik P'",
        x: "x",
        y: "y",
        reveal: "Ungkap",
      },
      dnd: {
        options: ["+6", "+2", "-6", "-2"],
        correct: { x: "+6", y: "+2" },
      },
      rightPanel: {
        step2Question:
          "Bagaimana translasi yang diberikan memengaruhi koordinat?",
        step3Instruction:
          "Cukup tambahkan koordinat objek dan translasi untuk mendapatkan koordinat bayangan.",
        step3Result: "Koordinat bayangan Titik P adalah (8,3).",
      },
      steps: {
        1: {
          navText: "Ketuk » untuk mulai menyelesaikan",
        },
        2: {
          navTextDrag:
            "Seret koordinat ke dalam tabel dengan benar",
          navTextDone: "Ketuk » untuk mencari koordinat bayangan",
        },
        3: {
          navText: "Ketuk tombol",
          navTextDone: "Ketuk » untuk memvisualisasikan translasi",
        },
        4: {
          navText: "Ketuk lokasi yang benar pada grafik",
          navTextDone: "Ketuk » untuk lanjut",
          titlePlaceP: "Letakkan P pada grafik",
          titlePlacePPrime: "Letakkan P' pada grafik",
          tableRows: {
            pointP: "Titik P",
            pointPCoord: "(2, 1)",
            translation: "Translasi",
            translationCoord: "(+6, +2)",
            pointPPrime: "Titik P'",
            pointPPrimeCoord: "(8, 3)",
          },
          feedbackWrong: "Ups! Coba lagi",
          feedbackCorrectP: "Bagus!",
          feedbackCorrectPPrime:
            "Bagus! Kamu telah mentranslasi titik P dengan benar.",
          pointPLabel: "P (2,1)",
          pointPPrimeLabel: "P' (8,3)",
        },
        5: {
          questionText: "Translasi Ruas Garis",
          navText: "Ketuk » untuk melihat pertanyaan berikutnya",
          splashText:
            "Setiap titik pada ruas garis ditranslasi dengan cara yang sama.\nTranslasi titik ujung sama seperti Anda mentranslasi sebuah titik.",
        },
        6: {
          questionText:
            "AB dengan titik A(2,2) dan B(6,3) ditranslasi 3 satuan ke kanan dan 1 satuan ke bawah. Temukan bayangannya.",
          navTextPlaceA: "Ketuk untuk menemukan A'",
          navTextPlaceB: "Ketuk untuk menemukan B'",
          navTextDone: "Ketuk » untuk melihat pertanyaan berikutnya",
          feedbackWrong: "Ups! Coba lagi",
          feedbackCorrectA: "Bagus!",
          feedbackCorrectDone:
            "Bagus!\nKamu telah mentranslasi ruas garis dengan benar.",
          pointALabel: "A (2,2)",
          pointBLabel: "B (6,3)",
        },
        7: {
          questionText:
            "MN dengan titik M(6,5) dan N(9,7) ditranslasi 4 satuan ke kiri dan 3 satuan ke bawah. Temukan bayangannya.",
          navText: "Seret ruas garis ke posisi bayangan",
          navTextDone: "Ketuk » untuk lanjut",
          feedbackWrong: "Ups! Coba lagi",
          feedbackCorrectDone:
            "Bagus!\nKamu telah mentranslasi ruas garis dengan benar.",
          pointMLabel: "M (6,5)",
          pointNLabel: "N (9,7)",
        },
        8: {
          questionText: "Translasi Bangun Datar",
          navText: "Ketuk » untuk melihat pertanyaan berikutnya",
          splashText:
            "Setiap titik pada bangun datar ditranslasi dengan cara yang sama.\nTranslasi titik sudut sama seperti Anda mentranslasi sebuah titik.",
        },
        9: {
          questionText:
            "Bangun diberikan ditranslasi 5 satuan ke kanan dan 2 satuan ke bawah. Temukan bayangannya.",
          navTextDragA: "Seret titik A ke posisi bayangan",
          navTextDragB: "Seret titik B ke posisi bayangan",
          navTextDragC: "Seret titik C ke posisi bayangan",
          navTextDragD: "Seret titik D ke posisi bayangan",
          navTextDone: "Ketuk » untuk melihat pertanyaan berikutnya",
          feedbackWrong: "Ups! Coba lagi",
          feedbackCorrectDone: "Bagus!",
          pointALabel: "A (2,6)",
          pointBLabel: "B (6,6)",
          pointCLabel: "C (6,4)",
          pointDLabel: "D (2,4)",
        },
        10: {
          questionText:
            "Bangun diberikan ditranslasi 4 satuan ke kiri dan 2 satuan ke atas. Temukan bayangannya.",
          navText: "Seret bangun ke posisi bayangan",
          navTextDone: "Ketuk » untuk lanjut",
          feedbackWrong: "Coba lagi",
          feedbackCorrect:
            "Bagus! Kamu telah mentranslasi bangun dengan benar.",
        },
      },
      final: {
        heading: "",
        text:
          "Bagus! Sekarang kamu dapat menemukan bayangan ketika<br>koordinat bangun awal dan satuan pergerakannya diberikan.",
        buttonText: "MULAI LAGI",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
