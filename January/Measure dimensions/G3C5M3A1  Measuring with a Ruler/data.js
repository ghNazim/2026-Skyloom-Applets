
const OBJECTS = [
  { key: "Spoon", image: "spoon.png", cm: 8, mm: 0, widthCm: 8 },
  { key: "Pencil", image: "pencil.png", cm: 10, mm: 5, widthCm: 10.5 },
  { key: "Crayon", image: "crayon.png", cm: 6, mm: 0, widthCm: 6 },
  { key: "Eraser", image: "erasor.png", cm: 4, mm: 0, widthCm: 4 },
  { key: "PencilBox", image: "pencilbox.png", cm: 13, mm: 5, widthCm: 13.5 },
];

// Ruler SVG dimensions from Figma (in SVG px at original size)
// SVG viewBox width = 404.04 (approx 405)
// leftGap before 0 starts = 8.7
// rightGap after markings end = 14.84
// 0 to 20 cm markings, 21 marking lines each 0.5 px wide
// gap between each cm marking edge-to-edge = 18.5
// Total = 8.7 + 21*0.5 + 20*18.5 + 14.84 = 404.04
// We display 15 cm on the ruler (0-15 markings visible as per the SVG text labels)
// But the ruler actually has 0-20 markings in the SVG.
// The ruler image shows markings 0 to 20 on cm side.
// 1 cm on ruler = 3.5vw for display purposes.
const RULER_CONFIG = {
  svgWidth: 404.04,           // total SVG width
  leftGap: 8.7,              // px before 0 mark starts
  rightGap: 14.84,           // px after last marking ends
  cmMarkWidth: 0.5,          // width of each cm marking line in px
  cmGap: 18.5,               // edge-to-edge gap between cm markings
  totalCmMarks: 21,          // 0 through 20
  totalCmSpaces: 20,         // spaces between marks
  cmToVw: 3.5,              // 1 cm = 3.5vw on screen
  // Derived: one cm in SVG px = cmGap + cmMarkWidth = 19.0
  // Position of mark N (center) = leftGap + N * (cmGap + cmMarkWidth) + cmMarkWidth/2
  // But for snap we need the left edge of marking N:
  // markLeftEdge(N) = leftGap + N * 19.0
  // As fraction of total width: markLeftEdge(N) / svgWidth
};

// Calculate ruler width in vw: total SVG mapped so that 1cm = 3.5vw
// cmUnit in SVG px = 19.0 (gap + mark width)
// rulerWidthVw = (svgWidth / cmUnit) * cmToVw
// = (404.04 / 19.0) * 3.5 = 74.43vw
// leftGapVw = (leftGap / cmUnit) * cmToVw = (8.7/19)*3.5 = 1.603vw
// Mark N position in vw from ruler left = leftGapVw + N * 3.5

const DATA = {
  en: {
    app: {
      objectNames: {
        Spoon: "spoon", Pencil: "pencil", Crayon: "crayon",
        Eraser: "eraser", PencilBox: "pencil box"
      },
      wheelLabels: {
        Spoon: "Spoon", Pencil: "Pencil", Crayon: "Crayon",
        Eraser: "Eraser", PencilBox: "Pencil Box"
      },
      start: {
        heading: "Measuring with a Ruler",
        text: "Let's practice to measure the length of an object<br>with a ruler.",
        buttonText: "Start"
      },
      step1: {
        characterText: "Choose an\nobject to\nmeasure the\nlength.",
        characterText2: "Choose the\nnext object\nto measure.",
        navText: "Tap any object to find the length."
      },
      step2: {
        topText: "Step 01: Place the ruler along the object.",
        characterText: "Find the\nlength of the\n{{object}}.",
        navText: "Tap and drag the ruler to place along the {{object}}, then tap check.",
        navTextCorrect: "Tap \u00BB to read the measurement of the {{object}}.",
        correctFeedback: "Good job! You placed the ruler correctly.",
        wrongFeedback: "Oops! Place the \u201C0\u201D mark at the left end of the object.",
        check: "Check"
      },
      step3: {
        topText: "Step 02: Identify the length of the {{object}}.",
        characterText: "Find the\nlength of the\n{{object}}.",
        navText: "Tap the correct number.",
        navTextCorrect: "Tap \u00BB to try with another one.",
        navTextCorrectLast: "Tap \u00BB to complete activity."
      },
      end: {
        heading: "Measuring with a Ruler",
        text: "Awesome! Now, we know to find the length of an object<br>with a ruler.",
        buttonText: "Start Over"
      }
    }
  },
  id: {
    app: {
      objectNames: {
        Spoon: "sendok", Pencil: "pensil", Crayon: "krayon",
        Eraser: "penghapus", PencilBox: "kotak pensil"
      },
      wheelLabels: {
        Spoon: "Sendok", Pencil: "Pensil", Crayon: "Krayon",
        Eraser: "Penghapus", PencilBox: "Kotak Pensil"
      },
      start: {
        heading: "Mengukur dengan Penggaris",
        text: "Mari berlatih mengukur panjang suatu benda<br>dengan penggaris.",
        buttonText: "Mulai"
      },
      step1: {
        characterText: "Pilih sebuah\nbenda untuk\nmengukur\npanjangnya.",
        characterText2: "Pilih benda\nberikutnya\nuntuk diukur.",
        navText: "Ketuk benda mana saja untuk mencari panjangnya."
      },
      step2: {
        topText: "Langkah 01: Letakkan penggaris di sepanjang benda.",
        characterText: "Temukan\npanjang\n{{object}}.",
        navText: "Ketuk dan seret penggaris untuk diletakkan di sepanjang {{object}}, lalu ketuk periksa.",
        navTextCorrect: "Ketuk \u00BB untuk membaca pengukuran {{object}}.",
        correctFeedback: "Bagus! Kamu meletakkan penggaris dengan benar.",
        wrongFeedback: "Ups! Letakkan tanda \u201C0\u201D di ujung kiri benda.",
        check: "Periksa"
      },
      step3: {
        topText: "Langkah 02: Tentukan panjang {{object}}.",
        characterText: "Temukan\npanjang\n{{object}}.",
        navText: "Ketuk angka yang benar.",
        navTextCorrect: "Ketuk \u00BB untuk mencoba yang lain.",
        navTextCorrectLast: "Ketuk \u00BB untuk menyelesaikan aktivitas."
      },
      end: {
        heading: "Mengukur dengan Penggaris",
        text: "Luar biasa! Sekarang, kita tahu cara menemukan panjang suatu benda<br>dengan penggaris.",
        buttonText: "Mulai Ulang"
      }
    }
  }
};

const APP_DATA = DATA[current_language].app;
