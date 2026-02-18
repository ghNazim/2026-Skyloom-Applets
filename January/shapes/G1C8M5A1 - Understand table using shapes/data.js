const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

// Master data structure
const DATA = {
  en: {
    app: {
      common: {
        next: "Next",
        ok: "OK",
        reset: "Reset",
        tapResetToTryAgain: "Tap 'Reset' to try again.",
        altScrambledShapes: "Scrambled shapes",
        shapesTable: "Shapes Table",
        colorOfShapesTable: "Color of Shapes Table",
        color: "COLOR",
        numberOfShapes: "NUMBER OF SHAPES",
        useNumberPadToAnswer: "Use the number pad to answer.",
        tapNextToContinue: "Tap 'Next' to continue.",
        tapNextToCount: "Tap 'Next' to count {color} shapes.",
        howManyShapesColor: "How many shapes are {color} in color?",
        correctCountMessage: "Correct! We have {count} {color} colored shapes.",
        wrongCountMessage: "That's wrong.\n\nTry counting again.",
      },
      feedback: {
        moreSelected: "You selected more {shape} than needed.",
        lessSelected: "You selected less {shape} than needed.",
        wrongSelected: "You selected wrong shapes.",
        correct: "Great! You selected the correct number of {shape}.",
      },
      start: {
        heading: "Creating shapes table!",
        text: "Use the table to select the correct number of shapes and build Andi's house.<br><br>Tap 'START' to begin!",
        buttonText: "Start",
      },
      
      steps: {
        1: {
          layout: "with-character",
          characterImage: "boyHappy.png",
          characterText: "Here are the shapes I have and a table that shows how many of each shape I need.\n\n Can you help me build the house using this table?",
          bottomText: "Tap 'Next' to continue.",
          tableData: {
            headers: ["SHAPES", "COUNT"],
            rows: [
              ["Square", "4"],
              ["Rectangle", "2"],
              ["Triangle", "5"],
              ["Circle", "3"],
            ],
          },
        },
        2: {
          layout: "without-character",
          questionText: "Let's start with squares.",
          navText: "Select 4 squares and Tap 'OK'.",
          questionCorrect: "Squares make up the windows of the house.",
          navCorrect: "Tap 'Next' to select rectangles.",
          shapeClass: "square",
          requiredCount: 4,
          tableData: {
            headers: ["SHAPES", "COUNT"],
            rows: [
              ["Square", "4"],
              ["Rectangle", "2"],
              ["Triangle", "5"],
              ["Circle", "3"],
            ],
          },
        },
        3: {
          layout: "without-character",
          questionText: "Let's pick rectangles now.",
          navText: "Select 2 rectangles and Tap 'OK'.",
          questionCorrect: "Rectangles make up the wall and the door of the house.",
          navCorrect: "Tap 'Next' to select triangles.",
          shapeClass: "rectangle",
          requiredCount: 2,
          tableData: {
            headers: ["SHAPES", "COUNT"],
            rows: [
              ["Square", "4"],
              ["Rectangle", "2"],
              ["Triangle", "5"],
              ["Circle", "3"],
            ],
          },
        },
        4: {
          layout: "without-character",
          questionText: "Let's pick triangles now.",
          navText: "Select 5 triangles and Tap 'OK'.",
          questionCorrect: "Triangles make up the roof of the house.",
          navCorrect: "Tap 'Next' to select circles.",
          shapeClass: "triangle",
          requiredCount: 5,
          tableData: {
            headers: ["SHAPES", "COUNT"],
            rows: [
              ["Square", "4"],
              ["Rectangle", "2"],
              ["Triangle", "5"],
              ["Circle", "3"],
            ],
          },
        },
        5: {
          layout: "without-character",
          questionText: "Let's pick circles now.",
          navText: "Select 3 circles and Tap 'OK'.",
          questionCorrect: "Circles make up the windows of the roof.",
          navCorrect: "Tap 'Next' to continue.",
          shapeClass: "circle",
          requiredCount: 3,
          tableData: {
            headers: ["SHAPES", "COUNT"],
            rows: [
              ["Square", "4"],
              ["Rectangle", "2"],
              ["Triangle", "5"],
              ["Circle", "3"],
            ],
          },
        },
        6: {
          layout: "with-character",
          characterImage: "boyHappy.png",
          characterText: "Wow! The house looks fabulous.\n\nYou used data from the table to help me build the house.",
          bottomText: "Tap 'Next' to continue.",
          tableData: {
            headers: ["SHAPES", "COUNT"],
            rows: [
              ["Square", "4"],
              ["Rectangle", "2"],
              ["Triangle", "5"],
              ["Circle", "3"],
            ],
          },
        },
        7: {
          layout: "fullscreen",
          heading: "",
          text: "Andi's house is ready!<br><br>Now he needs to record the colors of the shapes he used.<br><br>Let's count the shapes by color and make a table.<br><br>Tap 'Continue'.",
          buttonText: "Continue",
        },
        8: {
          layout: "with-character",
          characterImage: "boyHappy.png",
          characterText: "Look at the house and count how many shapes of each color are used.",
          bottomText: "Tap 'Next' to continue.",
          showOnlyLeftVisual: true,
        },
        9: {
          layout: "color-counting",
          colors: [
            { name: "Red", hex: "#CC0000" },
            { name: "Orange", hex: "#FF9900" },
            { name: "Yellow", hex: "#FFFF00" },
            { name: "Green", hex: "#00FF00" },
            { name: "Pink", hex: "#FF7ED1" },
            { name: "Blue", hex: "#00FFFF" },
          ],
        },
        10: {
          layout: "with-character",
          characterImage: "boyHappy.png",
          characterText: "That's great!\n\nYou created a table by counting the colors in it.",
          bottomText: "Tap 'Next' to continue.",
        },
        11: {
          layout: "fullscreen",
          heading: "Creating Shapes Table!",
          text: "You used a table to build Andi's house and created a new table by sorting shapes by their colors.<br><br>Tap 'Start Over' to repeat this activity.",
          buttonText: "Start Over",
        },
        
      },
     
    },
  },
  id: {
    app: {
      common: {
        next: "Lanjut",
        ok: "OK",
        reset: "Reset",
        tapResetToTryAgain: "Ketuk 'Reset' untuk coba lagi.",
        altScrambledShapes: "Bentuk acak",
        shapesTable: "Tabel Bentuk",
        colorOfShapesTable: "Tabel Warna Bentuk",
        color: "WARNA",
        numberOfShapes: "JUMLAH BENTUK",
        useNumberPadToAnswer: "Gunakan pad angka untuk menjawab.",
        tapNextToContinue: "Ketuk 'Lanjut' untuk melanjutkan.",
        tapNextToCount: "Ketuk 'Lanjut' untuk menghitung bentuk {color}.",
        howManyShapesColor: "Berapa banyak bentuk yang berwarna {color}?",
        correctCountMessage: "Benar! Ada {count} bentuk berwarna {color}.",
        wrongCountMessage: "Salah.\n\nCoba hitung lagi.",
      },
      feedback: {
        moreSelected: "Kamu memilih lebih banyak {shape} dari yang dibutuhkan.",
        lessSelected: "Kamu memilih lebih sedikit {shape} dari yang dibutuhkan.",
        wrongSelected: "Kamu memilih bentuk yang salah.",
        correct: "Bagus! Kamu memilih jumlah {shape} yang benar.",
      },
      start: {
        heading: "Membuat tabel bentuk!",
        text: "Gunakan tabel untuk memilih jumlah bentuk yang benar dan bangun rumah Andi.<br><br>Ketuk 'MULAI' untuk mulai!",
        buttonText: "Mulai",
      },
      steps: {
        1: {
          layout: "with-character",
          characterImage: "boyHappy.png",
          characterText: "Ini bentuk-bentuk yang aku punya dan tabel yang menunjukkan berapa banyak setiap bentuk yang kubutuhkan.\n\nBisakah kamu membantuku membangun rumah menggunakan tabel ini?",
          bottomText: "Ketuk 'Lanjut' untuk melanjutkan.",
          tableData: {
            headers: ["BENTUK", "JUMLAH"],
            rows: [
              ["Persegi", "4"],
              ["Persegi Panjang", "2"],
              ["Segitiga", "5"],
              ["Lingkaran", "3"],
            ],
          },
        },
        2: {
          layout: "without-character",
          questionText: "Mari mulai dengan persegi.",
          navText: "Pilih 4 persegi dan ketuk 'OK'.",
          questionCorrect: "Persegi membentuk jendela rumah.",
          navCorrect: "Ketuk 'Lanjut' untuk memilih persegi panjang.",
          shapeClass: "square",
          requiredCount: 4,
          tableData: {
            headers: ["BENTUK", "JUMLAH"],
            rows: [
              ["Persegi", "4"],
              ["Persegi Panjang", "2"],
              ["Segitiga", "5"],
              ["Lingkaran", "3"],
            ],
          },
        },
        3: {
          layout: "without-character",
          questionText: "Sekarang pilih persegi panjang.",
          navText: "Pilih 2 persegi panjang dan ketuk 'OK'.",
          questionCorrect: "Persegi panjang membentuk dinding dan pintu rumah.",
          navCorrect: "Ketuk 'Lanjut' untuk memilih segitiga.",
          shapeClass: "rectangle",
          requiredCount: 2,
          tableData: {
            headers: ["BENTUK", "JUMLAH"],
            rows: [
              ["Persegi", "4"],
              ["Persegi Panjang", "2"],
              ["Segitiga", "5"],
              ["Lingkaran", "3"],
            ],
          },
        },
        4: {
          layout: "without-character",
          questionText: "Sekarang pilih segitiga.",
          navText: "Pilih 5 segitiga dan ketuk 'OK'.",
          questionCorrect: "Segitiga membentuk atap rumah.",
          navCorrect: "Ketuk 'Lanjut' untuk memilih lingkaran.",
          shapeClass: "triangle",
          requiredCount: 5,
          tableData: {
            headers: ["BENTUK", "JUMLAH"],
            rows: [
              ["Persegi", "4"],
              ["Persegi Panjang", "2"],
              ["Segitiga", "5"],
              ["Lingkaran", "3"],
            ],
          },
        },
        5: {
          layout: "without-character",
          questionText: "Sekarang pilih lingkaran.",
          navText: "Pilih 3 lingkaran dan ketuk 'OK'.",
          questionCorrect: "Lingkaran membentuk jendela atap.",
          navCorrect: "Ketuk 'Lanjut' untuk melanjutkan.",
          shapeClass: "circle",
          requiredCount: 3,
          tableData: {
            headers: ["BENTUK", "JUMLAH"],
            rows: [
              ["Persegi", "4"],
              ["Persegi Panjang", "2"],
              ["Segitiga", "5"],
              ["Lingkaran", "3"],
            ],
          },
        },
        6: {
          layout: "with-character",
          characterImage: "boyHappy.png",
          characterText: "Wah! Rumahnya terlihat bagus.\n\nKamu menggunakan data dari tabel untuk membantuku membangun rumah.",
          bottomText: "Ketuk 'Lanjut' untuk melanjutkan.",
          tableData: {
            headers: ["BENTUK", "JUMLAH"],
            rows: [
              ["Persegi", "4"],
              ["Persegi Panjang", "2"],
              ["Segitiga", "5"],
              ["Lingkaran", "3"],
            ],
          },
        },
        7: {
          layout: "fullscreen",
          heading: "",
          text: "Rumah Andi sudah siap!<br><br>Sekarang dia perlu mencatat warna bentuk yang digunakannya.<br><br>Mari hitung bentuk menurut warna dan buat tabel.<br><br>Ketuk 'Lanjutkan'.",
          buttonText: "Lanjutkan",
        },
        8: {
          layout: "with-character",
          characterImage: "boyHappy.png",
          characterText: "Lihat rumah dan hitung berapa banyak bentuk setiap warna yang digunakan.",
          bottomText: "Ketuk 'Lanjut' untuk melanjutkan.",
          showOnlyLeftVisual: true,
        },
        9: {
          layout: "color-counting",
          colors: [
            { name: "Merah", hex: "#CC0000" },
            { name: "Oranye", hex: "#FF9900" },
            { name: "Kuning", hex: "#FFFF00" },
            { name: "Hijau", hex: "#00FF00" },
            { name: "Pink", hex: "#FF7ED1" },
            { name: "Biru", hex: "#00FFFF" },
          ],
        },
        10: {
          layout: "with-character",
          characterImage: "boyHappy.png",
          characterText: "Bagus sekali!\n\nKamu membuat tabel dengan menghitung warna di dalamnya.",
          bottomText: "Ketuk 'Lanjut' untuk melanjutkan.",
        },
        11: {
          layout: "fullscreen",
          heading: "Membuat Tabel Bentuk!",
          text: "Kamu menggunakan tabel untuk membangun rumah Andi<br><br>dan membuat tabel baru dengan mengelompokkan bentuk menurut warnanya.<br><br>Ketuk 'Ulangi' untuk mengulang aktivitas ini.",
          buttonText: "Ulangi",
        },
      },
    },
  },

};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
