const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

// Shape points
const shapePoints = [
  { x: -80, y: -100 }, // Top Left A
  { x: 40, y: -100 },  // Top Right B
  { x: 40, y: 0 },     // Inner corner C
  { x: 120, y: 0 },    // Far Right D
  { x: 40, y: 100 },   // Bottom Point E
  { x: -80, y: 20 }    // Side corner F
];

// Split lines
const splitLines = [
  { id: 'horizontal', x1: -150, y1: 0, x2: 200, y2: 0 },
  { id: 'diag1', x1: 150, y1: -150, x2: -150, y2: 150 },
  { id: 'diag2', x1: -150, y1: -150, x2: 150, y2: 150 }
];

// Side substitution map
const substituteMap = {
  AB: 24,
  BE: 25,
  EF: 25,
  FC: 20,
  CD: 24,
  AD: 24
};

const DATA = {
  en: {
    app: {
      steps: {
        0: {
          questionText: "Find the perimeter of the given composite shape.",
          navText: "Tap 'Perimeter'.",
          navAfter: "Tap » to continue.",
          buttonText: "Perimeter",
          feedback: "To find the perimeter of a composite shape, we need to know\nthe lengths of all its outer sides."
        },
        1: {
          questionText: "Uh-oh! a few side lengths are missing.",
          navText: "Tap the button.",
          navAfter: "Tap » to continue.",
          buttonText: "What to do?",
          feedback: "When a side length is missing,\nwe split the composite shape into simpler shapes."
        },
        2: {
          questionText: "Look for a line that divides the shape into smaller shapes.",
          navText: "Tap the correct line on the composite shape.",
          navWrong: "Tap » to try again!",
          navCorrect: "Tap on the square shape.",
          feedbackCorrect: "Well done!\nThis line splits the shape into a square and a triangle.",
          feedbackWrong: "This line doesn't help us find the missing side.",
          altTap: "Tap"
        },
        3: {
          questionText: "Since all sides of a square are equal, the missing side is the same length.",
          navText: "Tap 'Combine'.",
          buttonText: "Combine"
        },
        4: {
          questionText: "Now that we know the missing side length, let's find the perimeter.",
          navText: "Tap 'Perimeter'.",
          buttonText: "Perimeter"
        },
        5: {
          questionText: "Now that we know the missing side length, let's find the perimeter.",
          navText1: "Tap the highlighted text.",
          navText2: "Tap the highlighted text to substitute the values.",
          navCorrect: "Tap » to find the final answer.",
          equationRow1: "Perimeter = ",
          equationRow1Box: "Sum of the lengths of all the sides",
          equationRow2: "Perimeter = ",
          equationPlus: " + ",
          sides: ["AB", "BE", "EF", "FC", "CD", "AD"]
        },
        6: {
          questionText: "Now that we know the missing side length, let's find the perimeter.",
          navText: "Tap » to Restart.",
          finalAnswer: "Perimeter = 142 cm"
        }
      }
    }
  },
  id: {
    app: {
      steps: {
        0: {
          questionText: "Temukan keliling dari bentuk komposit yang diberikan.",
          navText: "Ketuk 'Keliling'.",
          navAfter: "Ketuk » untuk melanjutkan.",
          buttonText: "Keliling",
          feedback: "Untuk menemukan keliling bentuk komposit, kita perlu mengetahui\npanjang semua sisi luarnya."
        },
        1: {
          questionText: "Oh tidak! Beberapa panjang sisi hilang.",
          navText: "Ketuk tombol.",
          navAfter: "Ketuk » untuk melanjutkan.",
          buttonText: "Apa yang harus dilakukan?",
          feedback: "Ketika panjang sisi hilang,\nkita membagi bentuk komposit menjadi bentuk yang lebih sederhana."
        },
        2: {
          questionText: "Cari garis yang membagi bentuk menjadi bentuk yang lebih kecil.",
          navText: "Ketuk garis yang benar pada bentuk komposit.",
          navWrong: "Ketuk » untuk mencoba lagi!",
          navCorrect: "Ketuk pada bentuk persegi.",
          feedbackCorrect: "Bagus sekali!\nGaris ini membagi bentuk menjadi persegi dan segitiga.",
          feedbackWrong: "Garis ini tidak membantu kita menemukan sisi yang hilang.",
          altTap: "Ketuk"
        },
        3: {
          questionText: "Karena semua sisi persegi sama, sisi yang hilang memiliki panjang yang sama.",
          navText: "Ketuk 'Gabungkan'.",
          buttonText: "Gabungkan"
        },
        4: {
          questionText: "Sekarang kita tahu panjang sisi yang hilang, mari temukan kelilingnya.",
          navText: "Ketuk 'Keliling'.",
          buttonText: "Keliling"
        },
        5: {
          questionText: "Sekarang kita tahu panjang sisi yang hilang, mari temukan kelilingnya.",
          navText1: "Ketuk teks yang disorot.",
          navText2: "Ketuk teks yang disorot untuk mengganti nilai.",
          navCorrect: "Ketuk » untuk menemukan jawaban akhir.",
          equationRow1: "Keliling   =   ",
          equationRow1Box: "Jumlah panjang semua sisi",
          equationRow2: "Keliling   =   ",
          equationPlus: " + ",
          sides: ["AB", "BE", "EF", "FC", "CD", "AD"]
        },
        6: {
          questionText: "Sekarang kita tahu panjang sisi yang hilang, mari temukan kelilingnya.",
          navText: "Ketuk » untuk Mulai Ulang.",
          finalAnswer: "Keliling = 142 cm"
        }
      }
    }
  }
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
