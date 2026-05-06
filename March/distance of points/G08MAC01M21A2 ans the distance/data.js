const decimal = {
  en: ".",
  id: ",",
};
const bulb = `<img src="assets/bulb.png" alt="Bulb" class="bulb-small" />`;
const QUESTIONS = [
  {
    name: "AB",
    point1: [5, 2],
    point2: [9, 7],
    ans: "√41",
    coordinateOffset: [0, 0],
    nameOffset: [0, 0],
    flip: false,
  },
  {
    name: "MN",
    point1: [2, 3],
    point2: [9, 8],
    ans: "√74",
    coordinateOffset: [0, 0],
    nameOffset: [0, 0],
    flip: false,
  },
  {
    name: "KL",
    point1: [9, 3],
    point2: [2, 7],
    ans: "√65",
    coordinateOffset: [0, 0],
    nameOffset: [0, 0],
    flip: true,
  },
  {
    name: "GH",
    point1: [10, 2],
    point2: [3, 8],
    ans: "√85",
    coordinateOffset: [0, 0],
    nameOffset: [0, 0],
    flip: true,
  },
  {
    name: "EF",
    point1: [4, 3],
    point2: [8, 10],
    ans: "√65",
    coordinateOffset: [0, 0],
    nameOffset: [0, 0],
    flip: false,
  },
];

const DATA = {
  en: {
    app: {
      start: {
        heading: "Distance Formula",
        text: "Let’s solve a few questions on finding the distance between<br>two points using the distance formula.",
        buttonText: "Start",
      },
      steps: {
        1: {
          questionTextTemplate: "Find the distance between points {0} and {1}.",
          navTextInitial: "Fill the correct answer in the box.",
          navTextWrong: `Tap ${bulb} for the hint.`,
          navTextCorrect: "Tap » to move to the next question.",
          navTextLast: "Tap » to conclude.",
        },
      },
      final: {
        heading: "Distance Formula",
        text: "Awesome! Now, we mastered how to find the distance<br>between any two points.",
        buttonText: "Start Over",
        imageSrc: null,
      },
      labels: {
        numpadSubmit: "Submit",
      },
      questions: QUESTIONS,
    },
  },
  id: {
    app: {
      start: {
        heading: "Rumus Jarak",
        text: "Mari kita selesaikan beberapa soal tentang mencari jarak antara<br>dua titik menggunakan rumus jarak.",
        buttonText: "Mulai",
      },
      steps: {
        1: {
          questionTextTemplate: "Tentukan jarak antara titik {0} dan {1}.",
          navTextInitial: "Isi jawaban yang benar di kotak.",
          navTextWrong: `Ketuk ${bulb} untuk petunjuk.`,
          navTextCorrect: "Ketuk » untuk lanjut ke soal berikutnya.",
          navTextLast: "Ketuk » untuk menyelesaikan.",
        },
      },
      final: {
        heading: "Rumus Jarak",
        text: "Luar biasa! Sekarang kita telah menguasai cara mencari jarak<br>antara dua titik apa pun.",
        buttonText: "Ulangi dari Awal",
        imageSrc: null,
      },
      labels: {
        numpadSubmit: "Kirim",
      },
      questions: QUESTIONS,
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
