// const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Area of Rectangle",
        text: "Let’s derive the formula to find the area of a rectangle.<br>Tap ‘Start’ to begin the activity.",
        buttonText: "Start",
      },
      steps: {
        1: {
          questionText: "Let’s create a rectangle.",
          navText: "Drag the sliders to change the length and breadth and tap ».",
          navNext: "Tap » to continue.",
          sliders: {
            length: "Length",
            breadth: "Breadth"
          }
        },
        2: {
          questionText: "Visualizing area by filling with squares",
          navText: "Tap the button to visualize.",
          navNext: "Tap » to fill square through side lengths.",
          actionButton: "Visualize",
          areaLabel: "Area = {{count}} squares"
        },
        3: {
          questionText: "Count the number of squares in one row.",
          navText: "Drag the slider to set your answer.",
          navNext: "Tap » next to fill the area.",
          sliderLabel: "Number of squares in a row"
        },
        4: {
          questionText: "Fill the rectangle by setting right number of rows.",
          navText: "Drag the slider to set number of rows.",
          navNext: "Tap » to continue.",
          sliderLabel: "Number of rows"
        },
        5: {
          questionText: "Total number of squares can be expressed as,",
          navText: "Tap the highlighted text.",
          navNext: "Tap the highlighted text to reveal formula",
          navNext2: "Tap the highlighted text.",
          text1: "Total number of squares = ",
          labelSquaresInRow: "Squares in one row",
          labelNumberOfRows: "Number of rows"
        },
        6: {
            questionText: "We know that, total number of squares = Area of the rectangle",
            navText: "Tap the highlighted text to simplify.",
            textBefore: "Area of rectangle = ",
        },
        7: {
            questionText: "Formula for Area of rectangle.",
            navText: "Tap » to summarize.",
            finalText: "Area of rectangle = Length × Breadth"
        }
      },
      final: {
        heading: "Summary",
        text: "Area of rectangle = Length × Breadth",
        textBefore: "Area of rectangle = ",
        buttonText: "Start Over",
        imageSrc: "assets/final_en.png",
      },
    },
  },
  id: {
     app: {
      start: {
        heading: "Luas Persegi Panjang",
        text: "Mari kita turunkan rumus untuk mencari luas persegi panjang.<br>Ketuk 'Mulai' untuk memulai aktivitas.",
        buttonText: "Mulai",
      },
      steps: {
        1: {
          questionText: "Mari membuat persegi panjang.",
          navText: "Geser slider untuk mengubah panjang dan lebar, lalu ketuk ».",
          navNext: "Ketuk » untuk melanjutkan.",
          sliders: {
            length: "Panjang",
            breadth: "Lebar"
          }
        },
        2: {
          questionText: "Memvisualisasikan luas dengan mengisi kotak-kotak",
          navText: "Ketuk tombol untuk memvisualisasikan.",
          navNext: "Ketuk » untuk mengisi kotak melalui panjang sisi.",
          actionButton: "Visualisasikan",
          areaLabel: "Luas = {{count}} kotak"
        },
        3: {
          questionText: "Hitung jumlah kotak dalam satu baris.",
          navText: "Geser slider untuk menetapkan jawaban Anda.",
          navNext: "Ketuk » untuk mengisi area.",
          sliderLabel: "Jumlah kotak dalam satu baris"
        },
        4: {
          questionText: "Isi persegi panjang dengan menetapkan jumlah baris yang tepat.",
          navText: "Geser slider untuk menetapkan jumlah baris.",
          navNext: "Ketuk » untuk melanjutkan.",
          sliderLabel: "Jumlah baris"
        },
        5: {
          questionText: "Jumlah total kotak dapat dinyatakan sebagai,",
          navText: "Ketuk teks yang disorot.",
          navNext: "Ketuk teks yang disorot untuk mengungkapkan rumus",
          navNext2: "Ketuk teks yang disorot.",
          text1: "Jumlah total kotak = ",
          labelSquaresInRow: "Kotak dalam satu baris",
          labelNumberOfRows: "Jumlah baris"
        },
        6: {
            questionText: "Kita tahu bahwa, jumlah total kotak = Luas persegi panjang",
            navText: "Ketuk teks yang disorot untuk menyederhanakan.",
            textBefore: "Luas persegi panjang = ",
        },
        7: {
            questionText: "Rumus Luas Persegi Panjang.",
            navText: "Ketuk » untuk merangkum.",
            finalText: "Luas Persegi Panjang = Panjang × Lebar"
        }
      },
      final: {
        heading: "Ringkasan",
        text: "Luas Persegi Panjang = Panjang × Lebar",
        textBefore: "Luas persegi panjang = ",
        buttonText: "Mulai Lagi",
        imageSrc: "assets/final_id.png",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
