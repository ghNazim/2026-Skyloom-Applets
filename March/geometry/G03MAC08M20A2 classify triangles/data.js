const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Area of a composite shape",
        text: "We know that triangles can be<br>classified as Equilateral,<br>Isosceles and Scalene triangles.<br>Let us measure the side lengths<br>and classify the triangles…",
        buttonText: "Start",
        imageSrc: "assets/start.svg",
      },
      steps: {
        1: {
          questionText: "What type of triangle is shown here?",
          navText: "Tap 'Bring Scale' to measure the side lengths",
          actionButton: "Bring Scale",
        },
        2: {
          questionText: "What type of triangle is shown here?",
          navText: "Tap the correct option",
          navCorrect: "Tap » to move to the next challenge",
          navCorrectLast: "Tap 'Start Over' to practice again",
        },
      },
      triangles: [
        {
          sides: [10, 10, 10],
          answer: "Equilateral",
          typeName: ["Equilateral", "Triangle"],
          compText: "10 cm = 10 cm = 10 cm",
          feedbacks: {
            correct:
              "Good Work!!!\nEquilateral triangle has all its\nside lengths equal.",
            wrong:
              "Oops Incorrect!!!\nWhat type of triangle is formed\nwhen all the sides are equal?",
          },
        },
        {
          sides: [13, 9, 9],
          answer: "Isosceles",
          typeName: ["Isosceles", "Triangle"],
          compText: "9 cm = 9 cm ≠ 13 cm",
          feedbacks: {
            correct:
              "Good Work!!!\nIsosceles triangle has two of its\nside lengths equal.",
            wrong:
              "Oops Incorrect!!!\nWhat type of triangle is formed\nwhen two sides are equal?",
          },
        },
        {
          sides: [5, 6, 8],
          answer: "Scalene",
          typeName: ["Scalene", "Triangle"],
          compText: "5 cm ≠ 6 cm ≠ 8 cm",
          feedbacks: {
            correct:
              "Good Work!!!\nScalene triangle has none of its\nside lengths equal.",
            wrong:
              "Oops Incorrect!!!\nWhat type of triangle is formed\nwhen no sides are equal?",
          },
        },
      ],
      mcqOptions: ["Equilateral", "Isosceles", "Scalene"],
      final: {
        buttonText: "Start Over",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Luas Bangun Gabungan",
        text: "Kita tahu bahwa segitiga dapat<br>diklasifikasikan sebagai Segitiga<br>Sama Sisi, Sama Kaki, dan<br>Sembarang. Mari kita ukur panjang<br>sisinya dan klasifikasikan segitiga…",
        buttonText: "Mulai",
        imageSrc: "assets/start.svg",
      },
      steps: {
        1: {
          questionText: "Jenis segitiga apa yang ditunjukkan di sini?",
          navText: "Ketuk 'Bawa Penggaris' untuk mengukur panjang sisi",
          actionButton: "Bawa Penggaris",
        },
        2: {
          questionText: "Jenis segitiga apa yang ditunjukkan di sini?",
          navText: "Ketuk opsi yang benar",
          navCorrect: "Ketuk » untuk pindah ke tantangan berikutnya",
          navCorrectLast: "Ketuk 'Ulangi dari Awal' untuk berlatih lagi",
        },
      },
      triangles: [
        {
          sides: [10, 10, 10],
          answer: "Sama Sisi",
          typeName: ["Segitiga", "Sama Sisi"],
          compText: "10 cm = 10 cm = 10 cm",
          feedbacks: {
            correct:
              "Kerja Bagus!!!\nSegitiga Sama Sisi memiliki\nsemua panjang sisi yang sama.",
            wrong:
              "Ups Salah!!!\nJenis segitiga apa yang terbentuk\nketika semua sisinya sama?",
          },
        },
        {
          sides: [13, 9, 9],
          answer: "Sama Kaki",
          typeName: ["Segitiga", "Sama Kaki"],
          compText: "9 cm = 9 cm ≠ 13 cm",
          feedbacks: {
            correct:
              "Kerja Bagus!!!\nSegitiga Sama Kaki memiliki\ndua panjang sisi yang sama.",
            wrong:
              "Ups Salah!!!\nJenis segitiga apa yang terbentuk\nketika dua sisinya sama?",
          },
        },
        {
          sides: [5, 6, 8],
          answer: "Sembarang",
          typeName: ["Segitiga", "Sembarang"],
          compText: "5 cm ≠ 6 cm ≠ 8 cm",
          feedbacks: {
            correct:
              "Kerja Bagus!!!\nSegitiga Sembarang tidak memiliki\nsatupun panjang sisi yang sama.",
            wrong:
              "Ups Salah!!!\nJenis segitiga apa yang terbentuk\nketika tidak ada sisi yang sama?",
          },
        },
      ],
      mcqOptions: ["Sama Sisi", "Sama Kaki", "Sembarang"],
      final: {
        buttonText: "Ulangi dari Awal",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
