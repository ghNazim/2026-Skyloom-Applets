const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Practice on Rotation",
        text:
          "Let's practice what we have learned<br>so far about rotation.<br><br>Tap 'START' to begin.",
        buttonText: "START",
      },
      finish: {
        heading: "Activity Completed!",
        text:
          "Well done! You now have a better understanding of the<br>terms used to describe a rotation and its properties.",
        buttonText: "START OVER",
      },
      nav: {
        tapOption: "Tap the correct option",
        tapNext: "Tap » for another challenge",
      },
      step4: {
        navDirection: "Tap to choose the direction of rotation",
        navSlider: "Drag the slider to set the angle of rotation",
        navButton: "Tap the button to check",
        navIncorrect: "Try answering again and tap 'Retry'.",
        navDone: "Tap » to conclude",
        title: "Describe the Rotation",
        centerLabel: "Center of rotation",
        centerValue: "Point A ( ● )",
        directionLabel: "Direction",
        clockwise: "Clockwise",
        anticlockwise: "Anti-clockwise",
        angleLabel: "Angle",
        rotateBtn: "Rotate",
        retryBtn: "Retry",
        correctFeedback: "Well done!",
        wrongFeedback: "Oops... Try again!",
        dangerText: "DANGER!!!",
      },
      mcq: {
        1: {
          title: "Does every point on the rotating object follow a circular path?",
          options: ["Yes", "No"],
          optionFlex: "row",
          ans: "Yes",
          wrongFeedback:
            "Not quite! During a rotation, every point moves along a circular path around the centre of rotation.",
          correctFeedback:
            "Correct! During a rotation, every point moves along a circular path around the centre of rotation.",
        },
        2: {
          title: "Which of the following remain unchanged during a rotation?",
          options: [
            "Shape and size only",
            "Shape, size and position",
            "Shape, size and orientation",
          ],
          optionFlex: "column",
          ans: "Shape and size only",
          wrongFeedback:
            "Not quite! A rotation preserves the shape and size of a figure, but its position and orientation change.",
          correctFeedback:
            "Correct! A rotation preserves the shape and size of a figure, but its position and orientation change.",
        },
        3: {
          title: "What is the direction of rotation for this rotating object?",
          options: ["Clockwise", "Anticlockwise"],
          optionFlex: "column",
          ans: "Clockwise",
          wrongFeedback:
            "Not quite! The object is rotating in the direction of clock's hands.",
          correctFeedback:
            "Correct! The object is rotating in the direction of clock's hands.",
        },
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Latihan Rotasi",
        text:
          "Mari berlatih apa yang telah kita pelajari<br>tentang rotasi sejauh ini.<br><br>Ketuk 'MULAI' untuk memulai.",
        buttonText: "MULAI",
      },
      finish: {
        heading: "Aktivitas Selesai!",
        text:
          "Bagus! Kamu sekarang lebih memahami<br>istilah yang digunakan untuk menjelaskan rotasi dan sifat-sifatnya.",
        buttonText: "MULAI LAGI",
      },
      nav: {
        tapOption: "Ketuk pilihan yang benar",
        tapNext: "Ketuk » untuk tantangan berikutnya",
      },
      step4: {
        navDirection: "Ketuk untuk memilih arah rotasi",
        navSlider: "Seret penggeser untuk mengatur sudut rotasi",
        navButton: "Ketuk tombol untuk memeriksa",
        navIncorrect: "Coba jawab lagi dan ketuk 'Coba Lagi'.",
        navDone: "Ketuk » untuk menyelesaikan",
        title: "Jelaskan Rotasinya",
        centerLabel: "Pusat rotasi",
        centerValue: "Titik A ( ● )",
        directionLabel: "Arah",
        clockwise: "Searah jarum jam",
        anticlockwise: "Berlawanan arah jarum jam",
        angleLabel: "Sudut",
        rotateBtn: "Putar",
        retryBtn: "Coba Lagi",
        correctFeedback: "Bagus!",
        wrongFeedback: "Ups... Coba lagi!",
        dangerText: "BAHAYA!!!",
      },
      mcq: {
        1: {
          title:
            "Apakah setiap titik pada benda yang berputar mengikuti lintasan melingkar?",
          options: ["Ya", "Tidak"],
          optionFlex: "row",
          ans: "Ya",
          wrongFeedback:
            "Belum tepat! Selama rotasi, setiap titik bergerak sepanjang lintasan melingkar di sekitar pusat rotasi.",
          correctFeedback:
            "Benar! Selama rotasi, setiap titik bergerak sepanjang lintasan melingkar di sekitar pusat rotasi.",
        },
        2: {
          title: "Manakah dari berikut yang tidak berubah selama rotasi?",
          options: [
            "Bentuk dan ukuran saja",
            "Bentuk, ukuran, dan posisi",
            "Bentuk, ukuran, dan orientasi",
          ],
          optionFlex: "column",
          ans: "Bentuk dan ukuran saja",
          wrongFeedback:
            "Belum tepat! Rotasi mempertahankan bentuk dan ukuran suatu bangun, tetapi posisi dan orientasinya berubah.",
          correctFeedback:
            "Benar! Rotasi mempertahankan bentuk dan ukuran suatu bangun, tetapi posisi dan orientasinya berubah.",
        },
        3: {
          title: "Apa arah rotasi benda yang berputar ini?",
          options: ["Searah jarum jam", "Berlawanan arah jarum jam"],
          optionFlex: "column",
          ans: "Searah jarum jam",
          wrongFeedback:
            "Belum tepat! Benda berputar searah dengan jarum jam.",
          correctFeedback:
            "Benar! Benda berputar searah dengan jarum jam.",
        },
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
