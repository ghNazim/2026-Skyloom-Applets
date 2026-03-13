
const MEASUREMENT_DATA = [
  {
    object: "Stick",
    Pencil: 3, Brush: 4, Spoon: 5, "Ice Cream Stick": 6, Crayon: 8
  },
  {
    object: "Umbrella",
    Pencil: 3, Brush: 3, Spoon: 4, "Ice Cream Stick": 5, Crayon: 6
  },
  {
    object: "Mat",
    Pencil: 2, Brush: 3, Spoon: 3, "Ice Cream Stick": 4, Crayon: 5
  },
  {
    object: "Bookshelf",
    Pencil: 6, Brush: 7, Spoon: 8, "Ice Cream Stick": 10, Crayon: 12
  },
  {
    object: "Table",
    Pencil: 8, Brush: 9, Spoon: 10, "Ice Cream Stick": 12, Crayon: 15
  }
];

const OBJECTS = [
  { key: "Stick", image: "stick.png" },
  { key: "Mat", image: "mat.png" },
  { key: "Umbrella", image: "umbrella.png" },
  { key: "Bookshelf", image: "bookshelf.png" },
  { key: "Table", image: "table.png" },
];

const UNITS = [
  { key: "Pencil", image: "pencil.png", widthPercent: 90 },
  { key: "Brush", image: "brush.png", widthPercent: 80 },
  { key: "Spoon", image: "spoon.png", widthPercent: 70 },
  { key: "Ice Cream Stick", image: "iceCreamStick.png", widthPercent: 60 },
  { key: "Crayon", image: "crayon.png", widthPercent: 50 },
];

const DATA = {
  en: {
    app: {
      objectNames: {
        Stick: "stick", Mat: "mat", Umbrella: "umbrella",
        Bookshelf: "bookshelf", Table: "table"
      },
      unitNames: {
        Pencil: "pencil", Brush: "brush", Spoon: "spoon",
        "Ice Cream Stick": "ice cream stick", Crayon: "crayon"
      },
      unitPlurals: {
        Pencil: "pencils", Brush: "brushes", Spoon: "spoons",
        "Ice Cream Stick": "ice cream sticks", Crayon: "crayons"
      },
      wheelLabels: {
        Stick: "Stick", Mat: "Mat", Umbrella: "Umbrella",
        Bookshelf: "Bookshelf", Table: "Table"
      },
      start: {
        heading: "Finding Length",
        text: "Let's practice to find the length of an object<br>using small objects.",
        buttonText: "Start"
      },
      step1: {
        characterText: "Choose an\nobject to find\nthe length.",
        characterText2: "Choose the next object to find the length.",
        navText: "Tap the wheel to select an object."
      },
      step2: {
        topText: "Step 01: Select a small object",
        characterText: "Find the\nlength of the\n{{object}}.",
        navText: "Tap the object you would like to use to find the length."
      },
      step3: {
        topText: "Step 02: Place the small object along the {{object}}",
        characterText: "Find the\nlength of the\n{{object}}.",
        navText: "Tap the {{unit}} to place along the {{object}}, then tap check.",
        navTextRemoveExtra: "Tap the {{unit}} to remove extra {{units}}, then tap check.",
        navTextCorrect: "Tap \u00BB to move to step 3.",
        wrongFewer: "Oops! {{Units}} are not placed till the other end. Place more {{units}}.",
        wrongMore: "Oops! You placed more {{units}}. Remove the extra {{unit}}.",
        correct: "Good job! You placed {{units}} along the {{object}}.",
        check: "Check"
      },
      step4: {
        topText: "Step 03: Identify the length of the {{object}}",
        characterText: "Find the\nlength of the\n{{object}}.",
        navText: "Tap the correct number.",
        questionText: "Length of the {{object}} is {{input}} {{units}}.",
        correctFeedback: "Well done!\nThat's correct.",
        wrongFeedback: "Oops! There\nare {{count}} {{units}}.\nCheck again.",
        navCorrect: "Tap \u00BB to try with another object.",
        navCorrectLast: "Tap \u00BB to complete activity."
      },
      end: {
        heading: "Finding Length",
        text: "Awesome! Now, we know to find the length of an object<br>using small objects.",
        buttonText: "Start Over"
      }
    }
  },
  id: {
    app: {
      objectNames: {
        Stick: "tongkat", Mat: "tikar", Umbrella: "payung",
        Bookshelf: "rak buku", Table: "meja"
      },
      unitNames: {
        Pencil: "pensil", Brush: "sikat", Spoon: "sendok",
        "Ice Cream Stick": "stik es krim", Crayon: "krayon"
      },
      unitPlurals: {
        Pencil: "pensil", Brush: "sikat", Spoon: "sendok",
        "Ice Cream Stick": "stik es krim", Crayon: "krayon"
      },
      wheelLabels: {
        Stick: "Tongkat", Mat: "Tikar", Umbrella: "Payung",
        Bookshelf: "Rak Buku", Table: "Meja"
      },
      start: {
        heading: "Menemukan Panjang",
        text: "Mari berlatih mencari panjang suatu benda<br>menggunakan benda-benda kecil.",
        buttonText: "Mulai"
      },
      step1: {
        characterText: "Pilih sebuah\nbenda untuk\nmencari\npanjangnya.",
        characterText2: "Pilih benda berikutnya untuk mencari panjangnya.",
        navText: "Ketuk roda untuk memilih sebuah benda."
      },
      step2: {
        topText: "Langkah 01: Pilih benda kecil",
        characterText: "Temukan\npanjang\n{{object}}.",
        navText: "Ketuk benda yang ingin kamu gunakan untuk mencari panjangnya."
      },
      step3: {
        topText: "Langkah 02: Letakkan benda kecil di sepanjang {{object}}",
        characterText: "Temukan\npanjang\n{{object}}.",
        navText: "Ketuk {{unit}} untuk diletakkan di sepanjang {{object}}, lalu ketuk periksa.",
        navTextRemoveExtra: "Ketuk {{unit}} untuk menghapus {{units}} tambahan, lalu ketuk periksa.",
        navTextCorrect: "Ketuk \u00BB untuk lanjut ke langkah 3.",
        wrongFewer: "Ups! {{Units}} belum diletakkan sampai ujung lainnya. Letakkan lebih banyak {{units}}.",
        wrongMore: "Ups! Kamu meletakkan terlalu banyak {{units}}. Hapus {{unit}} tambahan.",
        correct: "Bagus! Kamu meletakkan {{units}} di sepanjang {{object}}.",
        check: "Periksa"
      },
      step4: {
        topText: "Langkah 03: Tentukan panjang {{object}}",
        characterText: "Temukan\npanjang\n{{object}}.",
        navText: "Ketuk angka yang benar.",
        questionText: "Panjang {{object}} adalah {{input}} {{units}}.",
        correctFeedback: "Bagus!\nItu benar.",
        wrongFeedback: "Ups! Ada\n{{count}} {{units}}.\nPeriksa lagi.",
        navCorrect: "Ketuk \u00BB untuk mencoba benda lainnya.",
        navCorrectLast: "Ketuk \u00BB untuk menyelesaikan aktivitas."
      },
      end: {
        heading: "Menemukan Panjang",
        text: "Luar biasa! Sekarang, kita tahu cara mencari panjang suatu benda<br>menggunakan benda-benda kecil.",
        buttonText: "Mulai Ulang"
      }
    }
  }
};

const APP_DATA = DATA[current_language].app;
