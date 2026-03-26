const DATA = {
  en: {
    app: {
      start: {
        heading: "Comparing Lengths",
        text: "Let's find the longer and shorter objects\nby comparing their lengths.",
        buttonText: "Start",
      },
      step1: {
        characterText: "Find the length\nof the stick.",
        navText: "Tap the hand span to place them along the stick.",
        unitLabel: "Hand Span",
      },
      step2: {
        characterText: "Shout out\u2013\nwhat is the\nlength of the\nstick?",
        navText: "Use the numpad to enter the length.",
        navCorrect: "Tap \u00BB to measure another stick.",
        questionText: "Length of the stick is {{input}} hand spans.",
        correctFeedback: "Well done!\nThat's correct.",
        wrongFeedback: "Oops! There\nare 5 hand\nspans. Try\nagain.",
      },
      step3: {
        characterText: "Find the length\nof the stick.",
        navText: "Tap the hand span to place them along the stick.",
        unitLabel: "Hand Span",
      },
      step4: {
        characterText: "Shout out\nwhat is the\nlength of the\nstick?",
        navText: "Use the numpad to enter the length.",
        navCorrect: "Tap \u00BB to compare the sticks.",
        questionText: "Length of the stick is {{input}} hand spans.",
        correctFeedback: "Well done!\nThat's correct.",
        wrongFeedback: "Oops! There\nare 4 hand\nspans. Try\nagain.",
      },
      step5: {
        characterText:
          "Which stick is\nlonger \u2013A or B?\n<y>Shout out loud</y>",
        navText: "Tap the correct stick.",
        navCorrect: "Tap \u00BB to continue.",
        ctCorrect: "Stick A is <y>longer</y>.\nStick B is <bl>shorter</bl>.",
        ctCorrect2: "The object with\n<y>greater length</y> is\n<y>longer</y>.\nThe object with\n<bl>less length</bl> is\n<bl>shorter</bl>.",
        navCorrect2: "Tap \u00BB to see another scenario.",
        labelA: "A",
        labelB: "B",
        labelLonger: "<y>Longer</y>",
        labelShorter: "<bl>Shorter</bl>",
        arrowLabelLong: "5 hand spans",
        arrowLabelShort: "4 hand spans",
      },
      step6: {
        characterText: "Which is longer\n\u2013board or cupboard?",
        navText: "Tap \u00BB to measure the board and cupboard.",
      },
      step7: {
        characterText: "Find the length\nof the board.",
        navText: "Tap the hand span to place them along the board.",
        unitLabel: "Hand Span",
      },
      step8: {
        characterText: "Shout out\nwhat is the\nlength of the\nboard?",
        navText: "Tap the correct number.",
        navCorrect: "Tap \u00BB to measure the cupboard.",
        questionText: "Length of the board is {{input}} hand spans.",
        correctFeedback: "Well done!\nThat's correct.",
        wrongFeedback: "Oops! There\nare 10 hand\nspans. Try\nagain.",
      },
      step9: {
        characterText: "Find the length\nof the cupboard.",
        navText: "Tap the hand span to place them along the cupboard.",
        unitLabel: "Hand Span",
      },
      step10: {
        characterText: "Shout out\nwhat is the\nlength of the\ncupboard?",
        navText: "Tap the correct number.",
        navCorrect: "Tap \u00BB to compare.",
        questionText: "Length of the cupboard is {{input}} hand spans.",
        correctFeedback: "Well done!\nThat's correct.",
        wrongFeedback: "Oops! There\nare 7 hand\nspans. Try\nagain.",
      },
      step11: {
        characterText: "Which is longer \u2013board or\ncupboard?",
        navText: "Tap the correct object.",
        navCorrect: "Tap \u00BB to continue.",
        labelLonger: "<y>Longer</y>",
        labelShorter: "<bl>Shorter</bl>",
        correctFeedback: "<green>Well done!\nThat's correct.</green>",
        wrongFeedback: "<red>Oops! The\nobject with\ngreater length\nis longer.</red>",
        correctAnswer: "left",
        leftSubText: "7 hand spans",
        rightSubText: "5 hand spans",
      },
      step12: {
        heading: "",
        text: "<y>The object with greater length is longer.</y><br><bl>The object with less length is shorter.</bl><br>Let's practice to find longer and shorter objects by comparing their lengths.",
        buttonText: "Continue",
      },
      step13: {
        navText: "Tap the correct object.",
        navCorrect: "Tap \u00BB to try with another one.",
        navCorrectLast: "Tap \u00BB to continue.",
        labelLonger: "<y>Longer</y>",
        labelShorter: "<bl>Shorter</bl>",
        questions: [
          {
            characterText: "Which is longer \u2013door or cot?",
            correctAnswer: "right",
            correctFeedback: "<green>Well done!\nThat's correct.\nGreater the\nlength is longer.</green>",
            wrongFeedback: "<red>Oops! The\nobject with\ngreater length\nis longer.</red>",
          },
          {
            characterText: "Which is shorter \u2013eraser or\nsharpener?",
            correctAnswer: "left",
            correctFeedback: "<green>Well done!\nThat's correct.\nLess the\nlength is shorter.</green>",
            wrongFeedback: "<red>Oops! The\nobject with\nless length\nis shorter.</red>",
          },
          {
            characterText: "Which is longer \u2013red mat or\ngreen mat?",
            correctAnswer: "left",
            correctFeedback: "<green>Well done!\nThat's correct.\nGreater the\nlength is longer.</green>",
            wrongFeedback: "<red>Oops! The\nobject with\ngreater length\nis longer.</red>",
          },
          {
            characterText: "Which is shorter \u2013TV or laptop?",
            correctAnswer: "right",
            correctFeedback: "<green>Well done!\nThat's correct.\nLess the\nlength is shorter.</green>",
            wrongFeedback: "<red>Oops! The\nobject with\nless length\nis shorter.</red>",
          },
        ]
      },
      step14: {
        heading: "Comparing Lengths",
        text: "Now, we know to find the longer and shorter objects\nby comparing their lengths.",
        buttonText: "Start Over",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Membandingkan Panjang",
        text: "Mari menemukan benda yang lebih panjang dan lebih pendek\ndengan membandingkan panjangnya.",
        buttonText: "Mulai",
      },
      step1: {
        characterText: "Temukan panjang\ntongkat.",
        navText:
          "Ketuk jengkal tangan untuk menempatkannya di sepanjang tongkat.",
        unitLabel: "Jengkal Tangan",
      },
      step2: {
        characterText: "Sebutkan\u2013\nberapa panjang\ntongkat\ntersebut?",
        navText: "Gunakan numpad untuk memasukkan panjang.",
        navCorrect: "Ketuk \u00BB untuk mengukur tongkat lainnya.",
        questionText: "Panjang tongkat adalah {{input}} jengkal tangan.",
        correctFeedback: "Bagus!\nItu benar.",
        wrongFeedback: "Ups! Ada\n5 jengkal\ntangan. Coba\nlagi.",
      },
      step3: {
        characterText: "Temukan panjang\ntongkat.",
        navText:
          "Ketuk jengkal tangan untuk menempatkannya di sepanjang tongkat.",
        unitLabel: "Jengkal Tangan",
      },
      step4: {
        characterText: "Sebutkan\nberapa panjang\ntongkat\ntersebut?",
        navText: "Gunakan numpad untuk memasukkan panjang.",
        navCorrect: "Ketuk \u00BB untuk membandingkan tongkat.",
        questionText: "Panjang tongkat adalah {{input}} jengkal tangan.",
        correctFeedback: "Bagus!\nItu benar.",
        wrongFeedback: "Ups! Ada\n4 jengkal\ntangan. Coba\nlagi.",
      },
      step5: {
        characterText:
          "Tongkat mana yang\nlebih panjang \u2013A atau B?\n<y>Katakan dengan keras</y>",
        navText: "Ketuk tongkat yang benar.",
        navCorrect: "Ketuk \u00BB untuk melanjutkan.",
        ctCorrect:
          "Tongkat A <y>lebih panjang</y>.\nTongkat B <bl>lebih pendek</bl>.",
        ctCorrect2:
          "Benda dengan\n<y>panjang lebih besar</y> adalah\n<y>lebih panjang</y>.\nBenda dengan\n<bl>panjang lebih kecil</bl> adalah\n<bl>lebih pendek</bl>.",
        navCorrect2: "Ketuk \u00BB untuk melihat skenario lain.",
        labelA: "A",
        labelB: "B",
        labelLonger: "<y>Lebih Panjang</y>",
        labelShorter: "<bl>Lebih Pendek</bl>",
        arrowLabelLong: "5 jengkal tangan",
        arrowLabelShort: "4 jengkal tangan",
      },
      step6: {
        characterText: "Mana yang lebih panjang\n\u2013papan atau lemari?",
        navText: "Ketuk \u00BB untuk mengukur papan dan lemari.",
      },
      step7: {
        characterText: "Temukan panjang\npapan.",
        navText:
          "Ketuk jengkal tangan untuk menempatkannya di sepanjang papan.",
        unitLabel: "Jengkal Tangan",
      },
      step8: {
        characterText: "Sebutkan\nberapa panjang\npapan\ntersebut?",
        navText: "Ketuk angka yang benar.",
        navCorrect: "Ketuk \u00BB untuk mengukur lemari.",
        questionText: "Panjang papan adalah {{input}} jengkal tangan.",
        correctFeedback: "Bagus!\nItu benar.",
        wrongFeedback: "Ups! Ada\n10 jengkal\ntangan. Coba\nlagi.",
      },
      step9: {
        characterText: "Temukan panjang\nlemari.",
        navText:
          "Ketuk jengkal tangan untuk menempatkannya di sepanjang lemari.",
        unitLabel: "Jengkal Tangan",
      },
      step10: {
        characterText: "Sebutkan\nberapa panjang\nlemari\ntersebut?",
        navText: "Ketuk angka yang benar.",
        navCorrect: "Ketuk \u00BB untuk membandingkan.",
        questionText: "Panjang lemari adalah {{input}} jengkal tangan.",
        correctFeedback: "Bagus!\nItu benar.",
        wrongFeedback: "Ups! Ada\n7 jengkal\ntangan. Coba\nlagi.",
      },
      step11: {
        characterText: "Mana yang lebih panjang \u2013papan atau\nlemari?",
        navText: "Ketuk benda yang benar.",
        navCorrect: "Ketuk \u00BB untuk melanjutkan.",
        labelLonger: "<y>Lebih Panjang</y>",
        labelShorter: "<bl>Lebih Pendek</bl>",
        correctFeedback: "<green>Bagus!\nItu benar.</green>",
        wrongFeedback: "<red>Ups! Benda\ndengan panjang\nlebih besar\nadalah lebih panjang.</red>",
        correctAnswer: "left",
        leftSubText: "7 jengkal tangan",
        rightSubText: "5 jengkal tangan",
      },
      step12: {
        heading: "",
        text: "<y>Benda dengan panjang lebih besar adalah lebih panjang.</y><br><bl>Benda dengan panjang lebih kecil adalah lebih pendek.</bl><br>Mari berlatih menemukan benda yang lebih panjang dan lebih pendek dengan membandingkan panjangnya.",
        buttonText: "Lanjutkan",
      },
      step13: {
        navText: "Ketuk benda yang benar.",
        navCorrect: "Ketuk \u00BB untuk mencoba yang lainnya.",
        navCorrectLast: "Ketuk \u00BB untuk melanjutkan.",
        labelLonger: "<y>Lebih Panjang</y>",
        labelShorter: "<bl>Lebih Pendek</bl>",
        questions: [
          {
            characterText: "Mana yang lebih panjang \u2013pintu atau ranjang?",
            correctAnswer: "right",
            correctFeedback: "<green>Bagus!\nItu benar.\nPanjang yang\nlebih besar\nadalah lebih panjang.</green>",
            wrongFeedback: "<red>Ups! Benda\ndengan panjang\nlebih besar\nadalah lebih panjang.</red>",
          },
          {
            characterText: "Mana yang lebih pendek \u2013penghapus atau\nperaut?",
            correctAnswer: "left",
            correctFeedback: "<green>Bagus!\nItu benar.\nPanjang yang\nlebih kecil\nadalah lebih pendek.</green>",
            wrongFeedback: "<red>Ups! Benda\ndengan panjang\nlebih kecil\nadalah lebih pendek.</red>",
          },
          {
            characterText: "Mana yang lebih panjang \u2013tikar merah atau\ntikar hijau?",
            correctAnswer: "left",
            correctFeedback: "<green>Bagus!\nItu benar.\nPanjang yang\nlebih besar\nadalah lebih panjang.</green>",
            wrongFeedback: "<red>Ups! Benda\ndengan panjang\nlebih besar\nadalah lebih panjang.</red>",
          },
          {
            characterText: "Mana yang lebih pendek \u2013TV atau laptop?",
            correctAnswer: "right",
            correctFeedback: "<green>Bagus!\nItu benar.\nPanjang yang\nlebih kecil\nadalah lebih pendek.</green>",
            wrongFeedback: "<red>Ups! Benda\ndengan panjang\nlebih kecil\nadalah lebih pendek.</red>",
          },
        ]
      },
      step14: {
        heading: "Membandingkan Panjang",
        text: "Sekarang, kita tahu cara menemukan benda yang lebih panjang dan lebih pendek\ndengan membandingkan panjangnya.",
        buttonText: "Mulai Ulang",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
