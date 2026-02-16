

// Decimal separator for different languages
const decimal = {
  en: ".",
  id: ",",
};

// Master data structure - Comparing Decimal Numbers
const DATA = {
  en: {
    // Questions: compare num1 and num2; operator is correct choice; highlightIndex is first differing character index
    questions: [
      {
        num1: "5.61",
        num2: "8.52",
        operator: "<",
        highlightIndex: 0,
        wrongFeedback:
          "Ooops! The digit in ones place of the first number is smaller than the second.",
        correctFeedback:
          "The digit in ones place of the first number is smaller than the second.",
        correctFeedbackSteps: [
          "Look at the digit in ones place.",
          "The digit in ones place of the first number is smaller than the second.",
          "The first number is smaller than the second.",
        ],
      },
      {
        num1: "6.83",
        num2: "6.79",
        operator: ">",
        highlightIndex: 2,
        wrongFeedback:
          "Ooops! The digit in tenths place of the first number is greater than the second.",
        correctFeedback:
          "The digit in tenths place of the first number is greater than the second.",
        correctFeedbackSteps: [
          "Look at the digit in tenths place.",
          "The digit in tenths place of the first number is greater than the second.",
          "The first number is greater than the second.",
        ],
      },
      {
        num1: "3.56",
        num2: "3.59",
        operator: "<",
        highlightIndex: 3,
        wrongFeedback:
          "Ooops! The digit in hundredths place of the first number is smaller than the second.",
        correctFeedback:
          "The digit in hundredths place of the first number is smaller than the second.",
        correctFeedbackSteps: [
          "Look at the digit in hundredths place.",
          "The digit in hundredths place of the first number is smaller than the second.",
          "The first number is smaller than the second.",
        ],
      },
      {
        num1: "0.65",
        num2: "0.56",
        operator: ">",
        highlightIndex: 2,
        wrongFeedback:
          "Ooops! The digit in tenths place of the first number is greater than the second.",
        correctFeedback:
          "The digit in tenths place of the first number is greater than the second.",
        correctFeedbackSteps: [
          "Look at the digit in tenths place.",
          "The digit in tenths place of the first number is greater than the second.",
          "The first number is greater than the second.",
        ],
      },
      {
        num1: "71.10",
        num2: "52.73",
        operator: ">",
        highlightIndex: 0,
        wrongFeedback:
          "Ooops! The digit in tens place of the first number is greater than the second.",
        correctFeedback:
          "The digit in tens place of the first number is greater than the second.",
        correctFeedbackSteps: [
          "Look at the digit in tens place.",
          "The digit in tens place of the first number is greater than the second.",
          "The first number is greater than the second.",
        ],
      },
      {
        num1: "35.61",
        num2: "38.03",
        operator: "<",
        highlightIndex: 1,
        wrongFeedback:
          "Ooops! The digit in tens place of the first number is smaller than the second.",
        correctFeedback:
          "The digit in tens place of the first number is smaller than the second.",
        correctFeedbackSteps: [
          "Look at the digit in tens place.",
          "The digit in tens place of the first number is smaller than the second.",
          "The first number is smaller than the second.",
        ],
      },
    ],

    // Start screen
    start: {
      heading: "Comparing Decimal Numbers",
      text: "Let's compare the <y>decimal numbers</y> using place value.",
      buttonText: "Start",
    },

    // Final screen
    final: {
      heading: "Comparing Decimal Numbers",
      text:
        "<left>Awesome!<br>To compare <y>decimal numbers</y>:<br>● Compare the digits from <y>left to right</y> using place value.<br>● The <y>first place</y> where the digits differ decides which decimal is <y>greater</y>.</left>",
      buttonText: "Start Over",
    },

    // Step 1 (question solving)
    step1: {
      question: "Compare the given decimal numbers.",
      navText: "Tap the correct symbol to compare the decimal numbers.",
      navTextNext: "Tap ≫",
    },
  },

  id: {
    questions: [
      {
        num1: "5,61",
        num2: "8,52",
        operator: "<",
        highlightIndex: 0,
        wrongFeedback:
          "Ups! Angka di tempat satuan bilangan pertama lebih kecil dari bilangan kedua.",
        correctFeedback:
          "Angka di tempat satuan bilangan pertama lebih kecil dari bilangan kedua.",
        correctFeedbackSteps: [
          "Lihat angka di tempat satuan.",
          "Angka di tempat satuan bilangan pertama lebih kecil dari bilangan kedua.",
          "Bilangan pertama lebih kecil dari bilangan kedua.",
        ],
      },
      {
        num1: "6,83",
        num2: "6,79",
        operator: ">",
        highlightIndex: 2,
        wrongFeedback:
          "Ups! Angka di tempat persepuluhan bilangan pertama lebih besar dari bilangan kedua.",
        correctFeedback:
          "Angka di tempat persepuluhan bilangan pertama lebih besar dari bilangan kedua.",
        correctFeedbackSteps: [
          "Lihat angka di tempat persepuluhan.",
          "Angka di tempat persepuluhan bilangan pertama lebih besar dari bilangan kedua.",
          "Bilangan pertama lebih besar dari bilangan kedua.",
        ],
      },
      {
        num1: "3,56",
        num2: "3,59",
        operator: "<",
        highlightIndex: 3,
        wrongFeedback:
          "Ups! Angka di tempat perseratusan bilangan pertama lebih kecil dari bilangan kedua.",
        correctFeedback:
          "Angka di tempat perseratusan bilangan pertama lebih kecil dari bilangan kedua.",
        correctFeedbackSteps: [
          "Lihat angka di tempat perseratusan.",
          "Angka di tempat perseratusan bilangan pertama lebih kecil dari bilangan kedua.",
          "Bilangan pertama lebih kecil dari bilangan kedua.",
        ],
      },
      {
        num1: "0,65",
        num2: "0,56",
        operator: ">",
        highlightIndex: 2,
        wrongFeedback:
          "Ups! Angka di tempat persepuluhan bilangan pertama lebih besar dari bilangan kedua.",
        correctFeedback:
          "Angka di tempat persepuluhan bilangan pertama lebih besar dari bilangan kedua.",
        correctFeedbackSteps: [
          "Lihat angka di tempat persepuluhan.",
          "Angka di tempat persepuluhan bilangan pertama lebih besar dari bilangan kedua.",
          "Bilangan pertama lebih besar dari bilangan kedua.",
        ],
      },
      {
        num1: "71,10",
        num2: "52,73",
        operator: ">",
        highlightIndex: 0,
        wrongFeedback:
          "Ups! Angka di tempat puluhan bilangan pertama lebih besar dari bilangan kedua.",
        correctFeedback:
          "Angka di tempat puluhan bilangan pertama lebih besar dari bilangan kedua.",
        correctFeedbackSteps: [
          "Lihat angka di tempat puluhan.",
          "Angka di tempat puluhan bilangan pertama lebih besar dari bilangan kedua.",
          "Bilangan pertama lebih besar dari bilangan kedua.",
        ],
      },
      {
        num1: "35,61",
        num2: "38,03",
        operator: "<",
        highlightIndex: 1,
        wrongFeedback:
          "Ups! Angka di tempat puluhan bilangan pertama lebih kecil dari bilangan kedua.",
        correctFeedback:
          "Angka di tempat puluhan bilangan pertama lebih kecil dari bilangan kedua.",
        correctFeedbackSteps: [
          "Lihat angka di tempat puluhan.",
          "Angka di tempat puluhan bilangan pertama lebih kecil dari bilangan kedua.",
          "Bilangan pertama lebih kecil dari bilangan kedua.",
        ],
      },
    ],
    start: {
      heading: "Membandingkan Bilangan Desimal",
      text: "Mari kita bandingkan bilangan desimal menggunakan nilai tempat.",
      buttonText: "Mulai",
    },
    final: {
      heading: "Membandingkan Bilangan Desimal",
      text:
        "<left>Luar biasa!<br>Untuk membandingkan bilangan desimal:<br>● Bandingkan angka dari kiri ke kanan menggunakan nilai tempat.<br>● Tempat pertama di mana angkanya berbeda menentukan desimal mana yang lebih besar.</left>",
      buttonText: "Ulangi",
    },
    step1: {
      question: "Bandingkan bilangan desimal yang diberikan.",
      navText: "Ketuk simbol yang benar untuk membandingkan bilangan desimal.",
      navTextNext: "Ketuk ≫",
    },
  },
};

// Current language data accessors
const APP_DATA = DATA[current_language];
