
const DATA = {
  en: {
    app: {
      start: {
        heading: "Comparing Heights",
        text: "Let's practice finding the taller and shorter objects.",
        buttonText: "Start"
      },
      step1: {
        characterText: "Find the height\nof the stick.",
        navText: "Tap the hand span to place them along the stick.",
        unitLabel: "Hand Span"
      },
      step2: {
        characterText: "Shout out\nwhat is the\nheight of the\nstick?",
        navText: "Tap the correct number.",
        navCorrect: "Tap \u00BB to measure another stick.",
        questionText: "Height of the stick is {{input}} hand spans.",
        correctFeedback: "Well done!\nThat's correct.",
        wrongFeedback: "Oops! There\nare 7 hand\nspans. Try\nagain."
      },
      step3: {
        characterText: "Find the height\nof the stick.",
        navText: "Tap the hand span to place them along the stick.",
        unitLabel: "Hand Span"
      },
      step4: {
        characterText: "Shout out\nwhat is the\nheight of the\nstick?",
        navText: "Tap the correct number.",
        navCorrect: "Tap \u00BB to compare the sticks.",
        questionText: "Height of the stick is {{input}} hand spans.",
        correctFeedback: "Well done!\nThat's correct.",
        wrongFeedback: "Oops! There\nare 5 hand\nspans. Try\nagain."
      },
      step5: {
        characterText: "Which stick is\ntaller \u2013A or B?\n<y>Shout out loud</y>",
        navText: "Tap the correct stick.",
        navCorrect: "Tap \u00BB to continue.",
        ctCorrect: "Stick A is <y>taller</y>.\nStick B is <bl>shorter</bl>.",
        labelA: "A",
        labelB: "B",
        labelTaller: "<y>Taller</y>",
        labelShorter: "<bl>Shorter</bl>"
      },
      step6: {
        characterText: "The object that\ngoes <y>farther</y>\nfrom the bottom\nto the top is\n<y>taller</y>.",
        navText: "Tap \u00BB to try with more examples.",
        labelTaller: "<y>Taller</y>",
        labelShorter: "<bl>Shorter</bl>",
        arrowLabelLong: "7 hand spans",
        arrowLabelShort: "5 hand spans"
      },
      step7Fullscreen: {
        heading: "",
        text: "<y>The object that goes farther from the bottom to the top is taller.</y><br><bl>The object that goes less far from the bottom to the top is shorter.</bl><br>Let's practice to find taller and shorter objects.",
        buttonText: "Continue"
      },
      step7: {
        navText: "Tap the correct object.",
        navCorrect: "Tap \u00BB to try with another one.",
        navCorrectLast: "Tap \u00BB to start over.",
        labelTaller: "<y>Taller</y>",
        labelShorter: "<bl>Shorter</bl>",
        correctFeedback: "<green>Well done!\nThat's correct.</green>",
        wrongFeedbackTaller: "<red>Oops! The\nobject that goes\nfarther from the\nbottom to the\ntop is taller.</red>",
        wrongFeedbackShorter: "<red>Oops! The object that goes\nless far from the bottom to the top is shorter.</red>"
      },
      questions: [
        {
          characterText: "Which plant is\ntaller?",
          correctAnswer: "left",
          wrongFeedback: "taller"
        },
        {
          characterText: "Which is shorter \u2013table or\ncupboard?",
          correctAnswer: "left",
          wrongFeedback: "shorter"
        },
        {
          characterText: "Which is taller\nchalk piece or\npencil?",
          correctAnswer: "left",
          wrongFeedback: "taller"
        },
        {
          characterText: "Which is shorter \u2013TV or laptop?",
          correctAnswer: "right",
          wrongFeedback: "shorter"
        }
      ],
      step8: {
        heading: "Comparing Heights",
        text: "Now, we know to find the taller and shorter objects\nby measuring the objects.",
        buttonText: "Start Over"
      }
    }
  },
  id: {
    app: {
      start: {
        heading: "Membandingkan Tinggi",
        text: "Mari berlatih menemukan benda yang lebih tinggi dan lebih pendek.",
        buttonText: "Mulai"
      },
      step1: {
        characterText: "Temukan tinggi\ntongkat.",
        navText: "Ketuk jengkal tangan untuk menempatkannya di sepanjang tongkat.",
        unitLabel: "Jengkal Tangan"
      },
      step2: {
        characterText: "Sebutkan\nberapa tinggi\ntongkat\ntersebut?",
        navText: "Ketuk angka yang benar.",
        navCorrect: "Ketuk \u00BB untuk mengukur tongkat lainnya.",
        questionText: "Tinggi tongkat adalah {{input}} jengkal tangan.",
        correctFeedback: "Bagus!\nItu benar.",
        wrongFeedback: "Ups! Ada\n7 jengkal\ntangan. Coba\nlagi."
      },
      step3: {
        characterText: "Temukan tinggi\ntongkat.",
        navText: "Ketuk jengkal tangan untuk menempatkannya di sepanjang tongkat.",
        unitLabel: "Jengkal Tangan"
      },
      step4: {
        characterText: "Sebutkan\nberapa tinggi\ntongkat\ntersebut?",
        navText: "Ketuk angka yang benar.",
        navCorrect: "Ketuk \u00BB untuk membandingkan tongkat.",
        questionText: "Tinggi tongkat adalah {{input}} jengkal tangan.",
        correctFeedback: "Bagus!\nItu benar.",
        wrongFeedback: "Ups! Ada\n5 jengkal\ntangan. Coba\nlagi."
      },
      step5: {
        characterText: "Tongkat mana yang\nlebih tinggi \u2013A atau B?\n<y>Katakan dengan keras</y>",
        navText: "Ketuk tongkat yang benar.",
        navCorrect: "Ketuk \u00BB untuk melanjutkan.",
        ctCorrect: "Tongkat A <y>lebih tinggi</y>.\nTongkat B <bl>lebih pendek</bl>.",
        labelA: "A",
        labelB: "B",
        labelTaller: "<y>Lebih Tinggi</y>",
        labelShorter: "<bl>Lebih Pendek</bl>"
      },
      step6: {
        characterText: "Benda yang\nlebih <y>jauh</y>\ndari bawah\nke atas adalah\n<y>lebih tinggi</y>.",
        navText: "Ketuk \u00BB untuk mencoba contoh lainnya.",
        labelTaller: "<y>Lebih Tinggi</y>",
        labelShorter: "<bl>Lebih Pendek</bl>",
        arrowLabelLong: "7 jengkal tangan",
        arrowLabelShort: "5 jengkal tangan"
      },
      step7Fullscreen: {
        heading: "",
        text: "<y>Benda yang lebih jauh dari bawah ke atas adalah lebih tinggi.</y><br><bl>Benda yang kurang jauh dari bawah ke atas adalah lebih pendek.</bl><br>Mari berlatih menemukan benda yang lebih tinggi dan lebih pendek.",
        buttonText: "Lanjutkan"
      },
      step7: {
        navText: "Ketuk benda yang benar.",
        navCorrect: "Ketuk \u00BB untuk mencoba yang lainnya.",
        navCorrectLast: "Ketuk \u00BB untuk mulai ulang.",
        labelTaller: "<y>Lebih Tinggi</y>",
        labelShorter: "<bl>Lebih Pendek</bl>",
        correctFeedback: "Bagus!\nItu benar.",
        wrongFeedbackTaller: "Ups! Benda yang\nlebih jauh dari\nbawah ke atas\nadalah lebih\ntinggi.",
        wrongFeedbackShorter: "Ups! Benda yang kurang jauh dari bawah ke atas adalah lebih pendek."
      },
      questions: [
        {
          characterText: "Tanaman mana yang\nlebih tinggi?",
          correctAnswer: "left",
          wrongFeedback: "taller"
        },
        {
          characterText: "Mana yang lebih\npendek \u2013meja atau\nlemari?",
          correctAnswer: "left",
          wrongFeedback: "shorter"
        },
        {
          characterText: "Mana yang lebih\ntinggi \u2013kapur atau\npensil?",
          correctAnswer: "left",
          wrongFeedback: "taller"
        },
        {
          characterText: "Mana yang lebih\npendek \u2013TV atau\nlaptop?",
          correctAnswer: "right",
          wrongFeedback: "shorter"
        }
      ],
      step8: {
        heading: "Membandingkan Tinggi",
        text: "Sekarang, kita tahu cara menemukan benda yang lebih tinggi dan lebih pendek\n dengan mengukur benda-benda.",
        buttonText: "Mulai Ulang"
      }
    }
  }
};

const APP_DATA = DATA[current_language].app;
