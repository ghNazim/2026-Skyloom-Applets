
const OBJECTS = [
  {
    key: "Sharpener",
    image: "sharpener.png",
    measureType: "width",
    imageWidth: "14%",
    wheelScaleFactor: 1,
    units: [
      { key: "Hand Span", image: "handspan.png" },
      { key: "Finger Span", image: "fingerspan.png" },
    ],
    correctUnitIndex: 1,
    correctCount: 4,
  },
  {
    key: "Mat",
    image: "mat.png",
    measureType: "width",
    imageWidth: "80%",
    wheelScaleFactor: 2.6,
    units: [
      { key: "Footstep", image: "footstep.png" },
      { key: "Finger Span", image: "fingerspan.png" },
    ],
    correctUnitIndex: 0,
    correctCount: 5,
  },
  {
    key: "Table",
    image: "table.png",
    measureType: "height",
    imageWidth: "70%",
    wheelScaleFactor: 2.6,
    units: [
      { key: "Hand Span", image: "handspanvert.png" },
      { key: "Finger Span", image: "fingerspanvert.png" },
    ],
    correctUnitIndex: 0,
    correctCount: 7,
  },
  {
    key: "Eraser",
    image: "eraser.png",
    measureType: "height",
    imageWidth: "8%",
    wheelScaleFactor: 1.2,
    units: [
      { key: "Hand Span", image: "handspanvert.png" },
      { key: "Finger Span", image: "fingerspanvert.png" },
    ],
    correctUnitIndex: 1,
    correctCount: 6,
  },
];

const DATA = {
  en: {
    app: {
      objectNames: {
        Sharpener: "sharpener",
        Mat: "mat",
        Table: "table",
        Eraser: "eraser",
      },
      unitNames: {
        "Hand Span": "hand span",
        "Finger Span": "finger span",
        Footstep: "footstep",
      },
      unitPlurals: {
        "Hand Span": "hand spans",
        "Finger Span": "finger spans",
        Footstep: "footsteps",
      },
      unitLabels: {
        "Hand Span": "Hand Span",
        "Finger Span": "Finger Span",
        Footstep: "Footstep",
      },
      wheelLabels: {
        Sharpener: "Sharpener",
        Mat: "Mat",
        Table: "Table",
        Eraser: "Eraser",
      },
      measureWords: { width: "length", height: "height" },
      measureWordsCapital: { width: "Length", height: "Height" },

      start: {
        heading: "Finding Length and Height",
        text: "Let's practice to find the length and height<br>of an object using hands and feet.",
        buttonText: "Start",
      },
      step1: {
        characterText: "Choose an\nobject to\nmeasure.",
        characterText2: "Choose the next object to measure.",
        navText: "Tap any object to measure.",
      },
      step2: {
        topText: "Step 01: Select the correct one to measure.",
        characterText: "Find the\n{{measure}} of the\n{{object}}.",
        navText: "Tap the correct one to measure the {{object}}.",
        navCorrect: "Tap \u00BB to move to step 2.",
      },
      step2Feedback: {
        Sharpener: {
          correct:
            "Well done! The finger span is small. Let's use this.",
          wrong:
            "Oops! The hand span is too big. Let's use something smaller.",
        },
        Mat: {
          correct:
            "Well done! The footstep is for big objects. Let's use this.",
          wrong:
            "Oops! Finger span is too small. Let's try something bigger.",
        },
        Table: {
          correct:
            "Well done! The hand span is for big objects. Let's use this.",
          wrong:
            "Oops! Finger span is too small. Let's try something bigger.",
        },
        Eraser: {
          correct:
            "Well done! The finger span is small. Let's use this.",
          wrong:
            "Oops! Hand is too big. Let's try something smaller.",
        },
      },
      step3: {
        topText: "Step 02: Place the {{unit}} along the {{object}}.",
        characterText: "Find the\n{{measure}} of the\n{{object}}.",
        navText:
          "Tap the {{unit}} to place along the {{object}}, then tap check.",
        navTextRemoveExtra:
          "Tap the extra {{unit}} to remove, then tap check.",
        navTextCorrect: "Tap \u00BB to move to step 3.",
        wrongFewer:
          "Oops! Not enough {{units}} placed. Place more {{units}}.",
        wrongMore:
          "Oops! You placed more {{units}}. Remove the extra {{unit}}.",
        correct: "Good job! You placed {{units}} along the {{object}}.",
        check: "Check",
      },
      step4: {
        topText: "Step 03: Identify the {{measure}} of the {{object}}",
        characterText: "Find the\n{{measure}} of the\n{{object}}.",
        navText: "Use the numpad to enter the correct answer.",
        questionText: "{{Measure}} of the {{object}} is {{input}} {{units}}.",
        correctFeedback: "Well done! That's correct.",
        wrongFeedback: "Oops! There are {{count}} {{units}}. Try again.",
        navCorrect: "Tap \u00BB to try with another object.",
        navCorrectLast: "Tap \u00BB to complete activity.",
      },
      end: {
        heading: "Finding Length and Height",
        text: "Now, we know to find the length and height<br>of an object using hands and feet.",
        buttonText: "Start Over",
      },
    },
  },
  id: {
    app: {
      objectNames: {
        Sharpener: "rautan",
        Mat: "tikar",
        Table: "meja",
        Eraser: "penghapus",
      },
      unitNames: {
        "Hand Span": "jengkal tangan",
        "Finger Span": "rentang jari",
        Footstep: "langkah kaki",
      },
      unitPlurals: {
        "Hand Span": "jengkal tangan",
        "Finger Span": "rentang jari",
        Footstep: "langkah kaki",
      },
      unitLabels: {
        "Hand Span": "Jengkal Tangan",
        "Finger Span": "Rentang Jari",
        Footstep: "Langkah Kaki",
      },
      wheelLabels: {
        Sharpener: "Rautan",
        Mat: "Tikar",
        Table: "Meja",
        Eraser: "Penghapus",
      },
      measureWords: { width: "panjang", height: "tinggi" },
      measureWordsCapital: { width: "Panjang", height: "Tinggi" },

      start: {
        heading: "Menemukan Panjang dan Tinggi",
        text: "Mari berlatih mencari panjang dan tinggi<br>suatu benda menggunakan tangan dan kaki.",
        buttonText: "Mulai",
      },
      step1: {
        characterText: "Pilih sebuah\nbenda untuk\ndiukur.",
        characterText2: "Pilih benda berikutnya untuk diukur.",
        navText: "Ketuk benda apa saja untuk diukur.",
      },
      step2: {
        topText: "Langkah 01: Pilih yang benar untuk mengukur.",
        characterText: "Temukan\n{{measure}}\n{{object}}.",
        navText: "Ketuk yang benar untuk mengukur {{object}}.",
        navCorrect: "Ketuk \u00BB untuk lanjut ke langkah 2.",
      },
      step2Feedback: {
        Sharpener: {
          correct: "Bagus! Rentang jari itu kecil. Mari gunakan ini.",
          wrong: "Ups! Jengkal tangan terlalu besar. Mari coba yang lebih kecil.",
        },
        Mat: {
          correct:
            "Bagus! Langkah kaki untuk benda besar. Mari gunakan ini.",
          wrong:
            "Ups! Rentang jari terlalu kecil. Mari coba yang lebih besar.",
        },
        Table: {
          correct:
            "Bagus! Jengkal tangan untuk benda besar. Mari gunakan ini.",
          wrong:
            "Ups! Rentang jari terlalu kecil. Mari coba yang lebih besar.",
        },
        Eraser: {
          correct: "Bagus! Rentang jari itu kecil. Mari gunakan ini.",
          wrong: "Ups! Tangan terlalu besar. Mari coba yang lebih kecil.",
        },
      },
      step3: {
        topText: "Langkah 02: Letakkan {{unit}} di sepanjang {{object}}.",
        characterText: "Temukan\n{{measure}}\n{{object}}.",
        navText:
          "Ketuk {{unit}} untuk diletakkan di sepanjang {{object}}, lalu ketuk periksa.",
        navTextRemoveExtra:
          "Ketuk {{unit}} tambahan untuk menghapus, lalu ketuk periksa.",
        navTextCorrect: "Ketuk \u00BB untuk lanjut ke langkah 3.",
        wrongFewer:
          "Ups! {{Units}} belum cukup diletakkan. Letakkan lebih banyak {{units}}.",
        wrongMore:
          "Ups! Kamu meletakkan lebih banyak {{units}}. Hapus {{unit}} tambahan.",
        correct:
          "Bagus! Kamu meletakkan {{units}} di sepanjang {{object}}.",
        check: "Periksa",
      },
      step4: {
        topText: "Langkah 03: Tentukan {{measure}} {{object}}",
        characterText: "Temukan\n{{measure}}\n{{object}}.",
        navText: "Gunakan numpad untuk memasukkan jawaban yang benar.",
        questionText: "{{Measure}} {{object}} adalah {{input}} {{units}}.",
        correctFeedback: "Bagus! Itu benar.",
        wrongFeedback: "Ups! Ada {{count}} {{units}}. Coba lagi.",
        navCorrect: "Ketuk \u00BB untuk mencoba benda lainnya.",
        navCorrectLast: "Ketuk \u00BB untuk menyelesaikan aktivitas.",
      },
      end: {
        heading: "Menemukan Panjang dan Tinggi",
        text: "Sekarang, kita tahu cara mencari panjang dan tinggi<br>suatu benda menggunakan tangan dan kaki.",
        buttonText: "Mulai Ulang",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
