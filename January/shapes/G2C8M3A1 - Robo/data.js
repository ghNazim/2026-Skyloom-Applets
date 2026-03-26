
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
        shapesTable: "Shapes Tally Chart",
        colorOfShapesTable: "Color of Shapes Table",
        color: "COLOR",
        tallyMarks: "TALLY MARKS",
        numberOfShapes: "TOTAL",
        useNumberPadToAnswer: "Use the number pad to answer.",
        tapNextToContinue: "Tap 'Next' to continue.",
        tapNextToCount: "Tap 'Next' to count {color} shapes.",
        howManyShapesColor: "How many shapes are {color} in color?",
        correctCountMessage: "Correct! We have {count} {color} colored shapes.",
        wrongCountMessage: "That's wrong.\n\nTry counting again.",
        step9FillColumnQuestion:
          "Let's first add all the color names in the first column.",
        step9FillColumnButton: "Tap here to fill the first column",
        step9InitialBottomText: " ",
        step9TallyBottomText:
          "Tap the tally box for each {color} color shapes. Tap ✓ when done.",
        step9TallyTapResetToEnter: "Tap ↻ to enter tallies again.",
        step9TallyTapNextToContinue: "Tap > to continue.",
        step9TallyCorrectFeedback:
          "That's the right tally for {color}-colored shapes.",
        step9TallyWrongFeedback: "That's not right!\nTry again.",
        step9EnterThirdColumnQuestion:
          "Let's enter the third column for each color.",
        step9EnterThirdColumnBottomText: "Tap Next to fill the third column.",
        step9CountCorrectFeedback:
          "Yes! There are {count} {color}-colored shapes.",
        step9CountWrongFeedback: "That's not right! Try again.",
      },
      feedback: {
        moreSelected: "You selected more {shape} than needed.",
        lessSelected: "You selected less {shape} than needed.",
        wrongSelected: "You selected wrong shapes. Try again!",
        correct: "Great! You selected the correct number of {shape}.",
      },
      start: {
        heading: "Build the Robot!",
        text: "There are lots of shapes - Rectangles, Squares, Triangles, and Circles. <br><br>Use the Shapes Tally Chart to select the correct number of shapes and build a robot.<br><br> Tap ‘Start’ to begin!",
        buttonText: "Start",
      },

      steps: {
        1: {
          layout: "with-character",
          characterImage: "boyHappy.png",
          characterText:
            "We have the shapes and the tally chart that shows how many of each shape we need.\n\n Use this tally chart to build your robot.",
          bottomText: "Tap 'Next' to continue.",
          tableData: {
            headers: ["SHAPES", "COUNT"],
            rows: [
              ["Square", "2"],
              ["Rectangle", "8"],
              ["Triangle", "4"],
              ["Circle", "6"],
            ],
          },
        },
        2: {
          layout: "without-character",
          questionText: "Let's start with squares.",
          navText:
            "Tap the squares to select the required number. Tap OK when done.",
          questionCorrect: "Perfect match! Keep going.",
          navCorrect: "Tap 'Next' to select rectangles.",
          shapeClass: "square",
          requiredCount: 2,
          tableData: {
            headers: ["SHAPES", "COUNT"],
            rows: [
              ["Square", "2"],
              ["Rectangle", "8"],
              ["Triangle", "4"],
              ["Circle", "6"],
            ],
          },
        },
        3: {
          layout: "without-character",
          questionText: "Let's pick rectangles now.",
          navText:
            "Tap the rectangles to select the required number. Tap OK when done.",
          questionCorrect: "Perfect match! Keep going.",
          navCorrect: "Tap 'Next' to select triangles.",
          shapeClass: "rectangle",
          requiredCount: 8,
          tableData: {
            headers: ["SHAPES", "COUNT"],
            rows: [
              ["Square", "2"],
              ["Rectangle", "8"],
              ["Triangle", "4"],
              ["Circle", "6"],
            ],
          },
        },
        4: {
          layout: "without-character",
          questionText: "Let's pick triangles now.",
          navText:
            "Tap the triangles to select the required number. Tap OK when done.",
          questionCorrect: "Perfect match! Keep going.",
          navCorrect: "Tap 'Next' to select circles.",
          shapeClass: "triangle",
          requiredCount: 4,
          tableData: {
            headers: ["SHAPES", "COUNT"],
            rows: [
              ["Square", "2"],
              ["Rectangle", "8"],
              ["Triangle", "4"],
              ["Circle", "6"],
            ],
          },
        },
        5: {
          layout: "without-character",
          questionText: "Let's pick circles now.",
          navText:
            "Tap the circles to select the required number. Tap OK when done.",
          questionCorrect: "Perfect match! Keep going.",
          navCorrect: "Tap 'Next' to continue.",
          shapeClass: "circle",
          requiredCount: 6,
          tableData: {
            headers: ["SHAPES", "COUNT"],
            rows: [
              ["Square", "2"],
              ["Rectangle", "8"],
              ["Triangle", "4"],
              ["Circle", "6"],
            ],
          },
        },
        6: {
          layout: "with-character",
          characterImage: "boyHappy.png",
          characterText:
            "Wow! The robot looks fabulous.\n\n You used data from the table to build this robot.",
          bottomText: "Tap 'Next' to continue.",
          tableData: {
            headers: ["SHAPES", "COUNT"],
            rows: [
              ["Square", "2"],
              ["Rectangle", "8"],
              ["Triangle", "4"],
              ["Circle", "6"],
            ],
          },
        },
        7: {
          layout: "fullscreen",
          heading: "",
          text: "Now let’s record the <y>colors of the shapes</y> we used to build the robot.<br> We will count the <y>shapes by color</y> and <y>make a tally chart</y>.<br><br> Tap ‘Continue’ to start.",
          buttonText: "Continue",
        },
        8: {
          layout: "with-character",
          characterImage: "boyHappy.png",
          characterText:
            "Look at the robot and count how many shapes of each color are used.",
          bottomText: "Tap 'Next' to start counting.",
          showOnlyLeftVisual: true,
        },
        9: {
          layout: "color-counting",
          colors: [
            { name: "Red", hex: "#EE4231" },
            { name: "Green", hex: "#8ABE37" },
            { name: "Blue", hex: "#0077D1" },
            { name: "Orange", hex: "#FA9D11" },
          ],
        },
        10: {
          layout: "with-character",
          characterImage: "boyHappy.png",
          characterText:
            "That’s great!\n\n You created a tally chart by counting the colors in the shapes that make this robot!",
          bottomText: "Tap 'Next'.",
        },
        11: {
          layout: "fullscreen",
          heading: "Build the Robot!",
          text: "You used a table to build the robot and created a new table by sorting shapes by their colors.<br><br> Tap ‘Start Over’ to repeat this activity.",
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
        reset: "Atur Ulang",
        tapResetToTryAgain: "Ketuk 'Atur Ulang' untuk mencoba lagi.",
        altScrambledShapes: "Bentuk yang berantakan",
        shapesTable: "Tabel Tally Bentuk",
        colorOfShapesTable: "Tabel Warna Bentuk",
        color: "WARNA",
        tallyMarks: "TANDA TALLY",
        numberOfShapes: "TOTAL",
        useNumberPadToAnswer: "Gunakan papan angka untuk menjawab.",
        tapNextToContinue: "Ketuk 'Lanjut' untuk melanjutkan.",
        tapNextToCount: "Ketuk 'Lanjut' untuk menghitung bentuk warna {color}.",
        howManyShapesColor: "Berapa banyak bentuk yang berwarna {color}?",
        correctCountMessage: "Benar! Kita punya {count} bentuk berwarna {color}.",
        wrongCountMessage: "Itu salah.\n\nCoba hitung lagi.",
        step9FillColumnQuestion:
          "Mari kita tambahkan dulu semua nama warna di kolom pertama.",
        step9FillColumnButton: "Ketuk di sini untuk mengisi kolom pertama",
        step9InitialBottomText: " ",
        step9TallyBottomText:
          "Ketuk kotak tally untuk setiap bentuk warna {color}. Ketuk ✓ jika sudah selesai.",
        step9TallyTapResetToEnter: "Ketuk ↻ untuk memasukkan tally lagi.",
        step9TallyTapNextToContinue: "Ketuk > untuk melanjutkan.",
        step9TallyCorrectFeedback:
          "Tally yang benar untuk bentuk berwarna {color}.",
        step9TallyWrongFeedback: "Itu tidak benar!\nCoba lagi.",
        step9EnterThirdColumnQuestion:
          "Mari kita isi kolom ketiga untuk setiap warna.",
        step9EnterThirdColumnBottomText: "Ketuk Lanjut untuk mengisi kolom ketiga.",
        step9CountCorrectFeedback:
          "Ya! Ada {count} bentuk berwarna {color}.",
        step9CountWrongFeedback: "Itu tidak benar! Coba lagi.",
      },
      feedback: {
        moreSelected: "Kamu memilih lebih banyak {shape} dari yang dibutuhkan.",
        lessSelected: "Kamu memilih lebih sedikit {shape} dari yang dibutuhkan.",
        wrongSelected: "Kamu memilih bentuk yang salah. Coba lagi!",
        correct: "Bagus! Kamu memilih jumlah {shape} yang benar.",
      },
      start: {
        heading: "Buat Robotnya!",
        text: "Ada banyak bentuk - Persegi Panjang, Persegi, Segitiga, dan Lingkaran. <br><br>Gunakan Tabel Tally Bentuk untuk memilih jumlah bentuk yang benar dan membuat robot.<br><br> Ketuk 'Mulai' untuk memulai!",
        buttonText: "Mulai",
      },

      steps: {
        1: {
          layout: "with-character",
          characterImage: "boyHappy.png",
          characterText:
            "Kita punya bentuk-bentuk dan tabel tally yang menunjukan berapa banyak setiap bentuk yang kita butuhkan.\n\n Gunakan tabel tally ini untuk membuat robotmu.",
          bottomText: "Ketuk 'Lanjut' untuk melanjutkan.",
          tableData: {
            headers: ["BENTUK", "JUMLAH"],
            rows: [
              ["Persegi", "2"],
              ["Persegi Panjang", "8"],
              ["Segitiga", "4"],
              ["Lingkaran", "6"],
            ],
          },
        },
        2: {
          layout: "without-character",
          questionText: "Mari kita mulai dengan persegi.",
          navText:
            "Ketuk persegi untuk memilih jumlah yang dibutuhkan. Ketuk OK jika sudah selesai.",
          questionCorrect: "Cocok sempurna! Lanjutkan.",
          navCorrect: "Ketuk 'Lanjut' untuk memilih persegi panjang.",
          shapeClass: "square",
          requiredCount: 2,
          tableData: {
            headers: ["BENTUK", "JUMLAH"],
            rows: [
              ["Persegi", "2"],
              ["Persegi Panjang", "8"],
              ["Segitiga", "4"],
              ["Lingkaran", "6"],
            ],
          },
        },
        3: {
          layout: "without-character",
          questionText: "Sekarang mari kita pilih persegi panjang.",
          navText:
            "Ketuk persegi panjang untuk memilih jumlah yang dibutuhkan. Ketuk OK jika sudah selesai.",
          questionCorrect: "Cocok sempurna! Lanjutkan.",
          navCorrect: "Ketuk 'Lanjut' untuk memilih segitiga.",
          shapeClass: "rectangle",
          requiredCount: 8,
          tableData: {
            headers: ["BENTUK", "JUMLAH"],
            rows: [
              ["Persegi", "2"],
              ["Persegi Panjang", "8"],
              ["Segitiga", "4"],
              ["Lingkaran", "6"],
            ],
          },
        },
        4: {
          layout: "without-character",
          questionText: "Sekarang mari kita pilih segitiga.",
          navText:
            "Ketuk segitiga untuk memilih jumlah yang dibutuhkan. Ketuk OK jika sudah selesai.",
          questionCorrect: "Cocok sempurna! Lanjutkan.",
          navCorrect: "Ketuk 'Lanjut' untuk memilih lingkaran.",
          shapeClass: "triangle",
          requiredCount: 4,
          tableData: {
            headers: ["BENTUK", "JUMLAH"],
            rows: [
              ["Persegi", "2"],
              ["Persegi Panjang", "8"],
              ["Segitiga", "4"],
              ["Lingkaran", "6"],
            ],
          },
        },
        5: {
          layout: "without-character",
          questionText: "Sekarang mari kita pilih lingkaran.",
          navText:
            "Ketuk lingkaran untuk memilih jumlah yang dibutuhkan. Ketuk OK jika sudah selesai.",
          questionCorrect: "Cocok sempurna! Lanjutkan.",
          navCorrect: "Ketuk 'Lanjut' untuk melanjutkan.",
          shapeClass: "circle",
          requiredCount: 6,
          tableData: {
            headers: ["BENTUK", "JUMLAH"],
            rows: [
              ["Persegi", "2"],
              ["Persegi Panjang", "8"],
              ["Segitiga", "4"],
              ["Lingkaran", "6"],
            ],
          },
        },
        6: {
          layout: "with-character",
          characterImage: "boyHappy.png",
          characterText:
            "Wah! Robotnya terlihat cantik.\n\n Kamu menggunakan data dari tabel untuk membuat robot ini.",
          bottomText: "Ketuk 'Lanjut' untuk melanjutkan.",
          tableData: {
            headers: ["BENTUK", "JUMLAH"],
            rows: [
              ["Persegi", "2"],
              ["Persegi Panjang", "8"],
              ["Segitiga", "4"],
              ["Lingkaran", "6"],
            ],
          },
        },
        7: {
          layout: "fullscreen",
          heading: "",
          text: "Sekarang mari kita catat <y>warna bentuk</y> yang kita gunakan untuk membuat robot.<br> Kita akan menghitung <y>bentuk berdasarkan warna</y> dan <y>membuat tabel tally</y>.<br><br> Ketuk 'Lanjutkan' untuk memulai.",
          buttonText: "Lanjutkan",
        },
        8: {
          layout: "with-character",
          characterImage: "boyHappy.png",
          characterText:
            "Lihat robotnya dan hitung berapa banyak bentuk dari setiap warna yang digunakan.",
          bottomText: "Ketuk 'Lanjut' untuk mulai menghitung.",
          showOnlyLeftVisual: true,
        },
        9: {
          layout: "color-counting",
          colors: [
            { name: "Merah", hex: "#EE4231" },
            { name: "Hijau", hex: "#8ABE37" },
            { name: "Biru", hex: "#0077D1" },
            { name: "Oranye", hex: "#FA9D11" },
          ],
        },
        10: {
          layout: "with-character",
          characterImage: "boyHappy.png",
          characterText:
            "Bagus sekali!\n\n Kamu membuat tabel tally dengan menghitung warna-warna dalam bentuk yang membentuk robot ini!",
          bottomText: "Ketuk 'Lanjut'.",
        },
        11: {
          layout: "fullscreen",
          heading: "Buat Robotnya!",
          text: "Kamu menggunakan tabel untuk membuat robot dan membuat tabel baru dengan mengurutkan bentuk berdasarkan warnanya.<br><br> Ketuk 'Mulai Lagi' untuk mengulang aktivitas ini.",
          buttonText: "Mulai Lagi",
        },
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
