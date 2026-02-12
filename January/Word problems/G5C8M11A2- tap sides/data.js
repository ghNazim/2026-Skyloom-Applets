const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

// T-Shape points (anticlockwise from top-left A to H)
// Based on sample.js positions
const shapePoints = {
  A: { x: 0, y: 0 },      // Top Left
  B: { x: 0, y: 23 },     // Left side down
  C: { x: 16, y: 23 },    // Inner corner bottom left
  D: { x: 16, y: 43 },    // Bottom left of stem
  E: { x: 26, y: 43 },    // Bottom right of stem
  F: { x: 26, y: 23 },    // Inner corner bottom right
  G: { x: 40, y: 23 },    // Right side down
  H: { x: 40, y: 0 },     // Top Right
};

// Edge labels with their measurements
const edgeLabels = {
  AH: { text: "40 cm", value: 40 },
  AB: { text: "23 cm", value: 23 },
  BC: { text: "16 cm", value: 16 },
  CD: { text: "20 cm", value: 20 },
  DE: { text: "10 cm", value: 10 },
  EF: { text: "20 cm", value: 20 },
  FG: { text: "14 cm", value: 14 },
  GH: { text: "23 cm", value: 23 },
};

const DATA = {
  en: {
    app: {
      appTitle: "Finding Perimeter of Composite Shape",
      replayAriaLabel: "Replay animation",
      unitCm: " cm",
      steps: {
        0: {
          questionText: "Find the perimeter of the given composite shape.",
          navText: "Tap 'Perimeter'.",
          navAfter: "Tap » to continue.",
          buttonText: "Perimeter",
          feedback: "To find the perimeter of a composite shape, we need to know\nthe lengths of all its outer sides."
        },
        1: {
          questionText: "To find the perimeter, let's label the outer sides first.",
          navText: "Tap 'Label outer sides'.",
          navAfterButton: "Tap the side 'AB' on the shape.",
          navAfterAB: "Tap ⟲ to see the visualization or tap side 'CD'.",
          navAfterCD: "Tap ⟲ to see the visualization or tap side 'DE'.",
          navAfterDE: "Tap the side AH on the shape.",
          navAfterAH: "Tap » to continue.",
          buttonText: "Label outer sides",
          questionAfterButton: "Let's find the missing sides first.",
          equationText: "AH = BC + CF + FG"
        },
        2: {
          questionText: "Let's find the missing sides first.",
          navText: "Tap the highlighted text.",
          navAfter: "Tap » to continue.",
          equationLine0Right: " = BC + CF + FG",
          equationLine1Left: "40 = ",
          equationLine1Right: " + CF + FG",
          equationLine2Left: "40 = 16 + CF + ",
          equationLine2Right: "",
          equationLine3Left: "40 = 16 + ",
          equationLine3Right: " + 14",
          equationLine4: "CF = 40 – (16 + 14)"
        },
        3: {
          questionText: "Let's find the side length of CF.",
          navText: "Use the numpad to fill the answer and click ✓.",
          navAfter: "Tap » to continue.",
          equationText: "CF = 40 - ( 16 + 14 ) = ",
          correctAnswer: 10
        },
        4: {
          questionText: "Add all the outer side lengths to find the perimeter.",
          navText: "Use the numpad to fill the answer and click ✓.",
          navFinal: "Tap » to start over.",
          questionFinal: "Well done! You found the perimeter of the composite shape.",
          equationText: "Perimeter = Sum of the lengths of all the sides = ",
          correctAnswer: 166
        }
      }
    }
  },
  id: {
    app: {
      appTitle: "Mencari Keliling Bentuk Gabungan",
      replayAriaLabel: "Putar ulang animasi",
      unitCm: " cm",
      steps: {
        0: {
          questionText: "Cari keliling dari bentuk gabungan yang diberikan.",
          navText: "Ketuk 'Keliling'.",
          navAfter: "Ketuk » untuk melanjutkan.",
          buttonText: "Keliling",
          feedback: "Untuk mencari keliling bangun gabungan, kita perlu mengetahui\npanjang semua sisi luarnya."
        },
        1: {
          questionText: "Untuk mencari keliling, mari kita beri label pada sisi luar terlebih dahulu.",
          navText: "Ketuk 'Labeli sisi luar'.",
          navAfterButton: "Ketuk sisi 'AB' pada bangun tersebut.",
          navAfterAB: "Ketuk ⟲ untuk melihat visualisasi atau ketuk sisi 'CD'.",
          navAfterCD: "Ketuk ⟲ untuk melihat visualisasi atau ketuk sisi 'DE'.",
          navAfterDE: "Ketuk sisi AH pada bangun tersebut.",
          navAfterAH: "Ketuk » untuk melanjutkan.",
          buttonText: "Labeli sisi luar",
          questionAfterButton: "Mari kita cari sisi yang hilang terlebih dahulu.",
          equationText: "AH = BC + CF + FG"
        },
        2: {
          questionText: "Mari kita cari sisi yang hilang terlebih dahulu.",
          navText: "Ketuk teks yang disorot.",
          navAfter: "Ketuk » untuk melanjutkan.",
          equationLine0Right: " = BC + CF + FG",
          equationLine1Left: "40 = ",
          equationLine1Right: " + CF + FG",
          equationLine2Left: "40 = 16 + CF + ",
          equationLine2Right: "",
          equationLine3Left: "40 = 16 + ",
          equationLine3Right: " + 14",
          equationLine4: "CF = 40 – (16 + 14)"
        },
        3: {
          questionText: "Mari kita cari panjang sisi CF.",
          navText: "Gunakan tombol angka untuk mengisi jawaban dan klik ✓.",
          navAfter: "Ketuk » untuk melanjutkan.",
          equationText: "CF = 40 - ( 16 + 14 ) = ",
          correctAnswer: 10
        },
        4: {
          questionText: "Jumlahkan semua panjang sisi luar untuk mencari kelilingnya.",
          navText: "Gunakan tombol angka untuk mengisi jawaban dan klik ✓.",
          navFinal: "Ketuk » untuk mengulang dari awal.",
          questionFinal: "Bagus sekali! Kamu telah menemukan keliling dari bangun gabungan tersebut.",
          equationText: "Keliling = Jumlah panjang semua sisi = ",
          correctAnswer: 166
        }
      }
    }
  }
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
