
const MEASUREMENT_DATA = [
  {
    object: "Bottle",
    Pencil: 2, Brush: 2, Spoon: 3, "Ice Cream Stick": 4, Crayon: 5
  },
  {
    object: "Pole",
    Pencil: 7, Brush: 8, Spoon: 9, "Ice Cream Stick": 11, Crayon: 14
  },
  {
    object: "Door",
    Pencil: 8, Brush: 9, Spoon: 10, "Ice Cream Stick": 12, Crayon: 15
  },
  {
    object: "Bookshelf",
    Pencil: 6, Brush: 7, Spoon: 8, "Ice Cream Stick": 10, Crayon: 12
  },
  {
    object: "Table",
    Pencil: 5, Brush: 5, Spoon: 6, "Ice Cream Stick": 7, Crayon: 9
  }
];

const OBJECTS = [
  { key: "Bottle", image: "bottle.png" },
  { key: "Pole", image: "pole.png" },
  { key: "Table", image: "table.png" },
  { key: "Door", image: "door.png" },
  { key: "Bookshelf", image: "bookshelf.png" },
];

const UNITS = [
  { key: "Pencil", image: "pencil.png", heightPercent: 90 },
  { key: "Brush", image: "brush.png", heightPercent: 80 },
  { key: "Spoon", image: "spoon.png", heightPercent: 70 },
  { key: "Ice Cream Stick", image: "iceCreamStick.png", heightPercent: 60 },
  { key: "Crayon", image: "crayon.png", heightPercent: 50 },
];

const DATA = {
  en: {
    app: {
      objectNames: {
        Bottle: "bottle", Pole: "pole", Door: "door",
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
        Bottle: "Bottle", Pole: "Pole", Door: "Door",
        Bookshelf: "Bookshelf", Table: "Table"
      },
      start: {
        heading: "Finding Height",
        text: "Let's practice to find the height of an object<br>using small objects.",
        buttonText: "Start"
      },
      step1: {
        characterText: "Choose an\nobject to find\nthe height.",
        navText: "Tap the wheel to select an object."
      },
      step2: {
        topText: "Step 01: Select a small object",
        characterText: "Find the\nheight of the\n{{object}}.",
        navText: "Tap the object you would like to use to find the height."
      },
      step3: {
        topText: "Step 02: Place the small object along the {{object}}",
        characterText: "Find the\nheight of the\n{{object}}.",
        navText: "Tap the {{unit}} to place beside the {{object}}, then tap check.",
        navTextRemoveExtra: "Tap the {{unit}} to remove extra {{units}}, then tap check.",
        navTextCorrect: "Tap \u00BB to move to step 3.",
        wrongFewer: "Oops! {{Units}} are not placed till the top. Place more {{units}}.",
        wrongMore: "Oops! You placed more {{units}}. Remove the extra {{unit}}.",
        correct: "Good job! You placed {{units}} beside the {{object}}.",
        check: "Check"
      },
      step4: {
        topText: "Step 03: Identify the height of the {{object}}",
        characterText: "Find the\nheight of the\n{{object}}.",
        navText: "Tap the correct number.",
        questionText: "Height of the {{object}} is {{input}} {{units}}.",
        correctFeedback: "Well done!\nThat's correct.",
        wrongFeedback: "Oops! There\nare {{count}} {{units}}.\nCheck again.",
        navCorrect: "Tap \u00BB to try with another object.",
        navCorrectLast: "Tap \u00BB to complete activity."
      },
      end: {
        heading: "Finding Height",
        text: "Awesome! Now, we know to find the height of an object<br>using small objects.",
        buttonText: "Start Over"
      }
    }
  },
  id: {
    app: {
      objectNames: {
        Bottle: "botol", Pole: "tiang", Door: "pintu",
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
        Bottle: "Botol", Pole: "Tiang", Door: "Pintu",
        Bookshelf: "Rak Buku", Table: "Meja"
      },
      start: {
        heading: "Menemukan Tinggi",
        text: "Mari berlatih mencari tinggi suatu benda<br>menggunakan benda-benda kecil.",
        buttonText: "Mulai"
      },
      step1: {
        characterText: "Pilih sebuah\nbenda untuk\nmencari\ntingginya.",
        navText: "Ketuk roda untuk memilih sebuah benda."
      },
      step2: {
        topText: "Langkah 01: Pilih benda kecil",
        characterText: "Temukan\ntinggi\n{{object}}.",
        navText: "Ketuk benda yang ingin kamu gunakan untuk mencari tingginya."
      },
      step3: {
        topText: "Langkah 02: Letakkan benda kecil di samping {{object}}",
        characterText: "Temukan\ntinggi\n{{object}}.",
        navText: "Ketuk {{unit}} untuk diletakkan di samping {{object}}, lalu ketuk periksa.",
        navTextRemoveExtra: "Ketuk {{unit}} untuk menghapus {{units}} tambahan, lalu ketuk periksa.",
        navTextCorrect: "Ketuk \u00BB untuk lanjut ke langkah 3.",
        wrongFewer: "Ups! {{Units}} belum diletakkan sampai atas. Letakkan lebih banyak {{units}}.",
        wrongMore: "Ups! Kamu meletakkan terlalu banyak {{units}}. Hapus {{unit}} tambahan.",
        correct: "Bagus! Kamu meletakkan {{units}} di samping {{object}}.",
        check: "Periksa"
      },
      step4: {
        topText: "Langkah 03: Tentukan tinggi {{object}}",
        characterText: "Temukan\ntinggi\n{{object}}.",
        navText: "Ketuk angka yang benar.",
        questionText: "Tinggi {{object}} adalah {{input}} {{units}}.",
        correctFeedback: "Bagus!\nItu benar.",
        wrongFeedback: "Ups! Ada\n{{count}} {{units}}.\nPeriksa lagi.",
        navCorrect: "Ketuk \u00BB untuk mencoba benda lainnya.",
        navCorrectLast: "Ketuk \u00BB untuk menyelesaikan aktivitas."
      },
      end: {
        heading: "Menemukan Tinggi",
        text: "Luar biasa! Sekarang, kita tahu cara mencari tinggi suatu benda<br>menggunakan benda-benda kecil.",
        buttonText: "Mulai Ulang"
      }
    }
  }
};

const APP_DATA = DATA[current_language].app;
