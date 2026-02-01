const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

// Cube positions use [x, y, z] with y = up (Three.js convention).
// Each question: positions (unit cube centers), options, correct index.

const questions = [
  // Q1: 9 cubes - staggered column
  {
    positions: [
      [-1, 0, 0], [0, 0, 0], [1, 0, 0],
      [-1, 1, 0], [0, 1, 0], [1, 1, -1],
      [-1, 2, 0], [0, 2, 0], [1, 2, -1],
    ],
    options: ["6 cm³", "7 cm³", "9 cm³", "8 cm³"],
    correct: 2,
  },
  // Q2: 16 cubes - two full 4×2 layers
  {
    positions: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [3, 0, 0], [0, 1, -1], [1, 1, -1], [2, 1, -1], [3, 1, -1], [0, 0, -1], [1, 0, -1], [2, 0, -1], [3, 0, -1], [0, 0, 1], [1, 0, 1], [2, 0, 1], [3, 0, 1]],
    options: ["14 cm³", "16 cm³", "18 cm³", "20 cm³"],
    correct: 1,
  },
  // Q3: 9 cubes - 3×2 base + 3×1 back
  {
    positions: [
      
      [0, 0, 0], [1, 0, 0], [2, 0, 0],[3, 0, 0],[4, 0, 0],
      [0, 1, 0], [1, 1, 0], [2, 1, 0],[3, 1, 0]
    ],
    options: ["10 cm³", "8 cm³", "7 cm³", "9 cm³"],
    correct: 3,
  },
  // Q4: 14 cubes - L base (8) + 2×2 (4) + 2×1 top (2)
  {
    positions: [
      [-1, 0, 0],[0,0,0], [1, 0, 0], [2, 0, 0],
      [-1, 0, 1],[0,0,1], [1, 0, 1], [2, 0, 1],
      
      [-1, 0, -1],[0,0,-1], [1, 0, -1], [2, 0, -1],
      [-1, 1, -1],[0,1,-1]
    ],
    options: ["20 cm³", "24 cm³", "14 cm³", "15 cm³"],
    correct: 2,
  },
  // Q5: 16 cubes - 7+7+1+1 layers
  {
    positions: [
      [-1, 0, 0],[-2, 0, 0],[0, 0, 0], [1, 0, 0], [2, 0, 0], [3, 0, 0], 
      [-1, 1, 0],[-2, 1, 0],[0, 1, 0], [1, 1, 0], [2, 1, 0], [3, 1, 0], 
      [2, 2, 0], [3, 2, 0], 
      [2, 3, 0], [3, 3, 0], 
      
    ],
    options: ["16 cm³", "18 cm³", "14 cm³", "20 cm³"],
    correct: 0,
  },
];

const DATA = {
  en: {
    app: {
      start: {
        heading: "Practice - Finding Volume of a 3D shape",
        text: "Let's rotate the shape and count all the unit cubes to determine the volume.<br>Tap 'Start' to begin the activity.",
        buttonText: "Start",
      },
      steps: {
        1: {
          questionText: "Each unit cube in the shape has a volume of 1 cm³.",
          navText: "Drag to rotate the object and tap the correct answer.",
          navNext: "Tap » to solve another question.",
          navLast: "Tap »",
          mcqTitle: "What is the total volume of the shape?",
          feedbacks: {
            wrong: "Not quite. Tap on each cube to count the total.",
            correct: "Well done! You got it right!",
          },
          questions: questions,
        },
      },
      final: {
        heading: "Activity Completed!",
        text: "You practiced rotating a 3D shape and counting unit cubes to find its volume.<br>Tap 'Start Over' to restart the activity.",
        buttonText: "Start Over",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Latihan - Mencari Volume Bangun Ruang 3D",
        text: "Mari putar bangun tersebut dan hitung semua kubus satuan untuk menentukan volumenya.<br>Ketuk 'Mulai' untuk memulai aktivitas.",
        buttonText: "Mulai",
      },
      steps: {
        1: {
          questionText: "Setiap kubus satuan dalam bangun tersebut memiliki volume 1 cm³.",
          navText: "Seret untuk memutar objek dan ketuk jawaban yang benar.",
          navNext: "Ketuk » untuk menyelesaikan pertanyaan lain.",
          navLast: "Ketuk »",
          mcqTitle: "Berapakah volume total dari bangun tersebut?",
          feedbacks: {
            wrong: "Kurang tepat. Ketuk pada setiap kubus untuk menghitung totalnya.",
            correct: "Bagus sekali! Jawaban Anda benar!",
          },
          questions: questions,
        },
      },
      final: {
        heading: "Aktivitas Selesai!",
        text: "Anda telah berlatih memutar bangun ruang 3D dan menghitung kubus satuan untuk mencari volumenya.<br>Ketuk 'Mulai Lagi' untuk mengulang aktivitas.",
        buttonText: "Mulai Lagi",
      },
    },
  },

};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
