const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      steps: {
        1: {
          questionText: "Find the height of the tree",
          navText: "Tap \u00BB to find \u2018h\u2019.",
        },
        2: {
          questionText: "Look at the two triangles",
          navText: "Tap a triangle to add naming to them.",
        },
        3: {
          questionText:
            "Let\u2019s examine angles of the two triangles: \u25B3ABC and \u25B3ADE",
          navText: "Tap the highlighted angle.",
        },
        4: {
          questionText:
            "Let\u2019s examine angles of the two triangles: \u25B3ABC and \u25B3ADE",
          navText: "Tap the highlighted angle.",
        },
        5: {
          questionText:
            "Let\u2019s examine angles of the two triangles: \u25B3ABC and \u25B3ADE",
          navText: "Tap the highlighted button.",
          navAfterConclude: "Tap \u00BB to find h using corresponding sides.",
          calcTitle: "\u25B3ABC and \u25B3ADE",
          concludeText: "Conclude",
          conclusionLine1: "\u25B3ABC ~ \u25B3ADE",
          conclusionLine2: "(by AA similarity)",
        },
        6: {
          questionText: "Let\u2019s find h using similar triangles.",
          navText: "",
          navCompute: "Tap the button to compute the expression.",
          questionComplete: "The height of the tree = 15 ft",
          navComplete: "Activity completed!! Tap start over to restart.",
          calcTitle: "\u25B3ABC ~ \u25B3ADE",
          nextText: "Start Over",
        },
      },
      labels: {
        heightTree: "h",
        heightMan: "5 ft",
        distanceTotal: "24 ft",
        distanceAB: "8 ft",
        heightTreeResult: "15 ft",
      },
    },
  },
  id: {
    app: {
      steps: {
        1: {
          questionText: "Temukan tinggi pohon",
          navText: "Ketuk \u00BB untuk mencari \u2018h\u2019.",
        },
        2: {
          questionText: "Lihat kedua segitiga",
          navText: "Ketuk segitiga untuk menambahkan penamaan.",
        },
        3: {
          questionText:
            "Mari periksa sudut kedua segitiga: \u25B3ABC dan \u25B3ADE",
          navText: "Ketuk sudut yang disorot.",
        },
        4: {
          questionText:
            "Mari periksa sudut kedua segitiga: \u25B3ABC dan \u25B3ADE",
          navText: "Ketuk sudut yang disorot.",
        },
        5: {
          questionText:
            "Mari periksa sudut kedua segitiga: \u25B3ABC dan \u25B3ADE",
          navText: "Ketuk tombol yang disorot.",
          navAfterConclude:
            "Ketuk \u00BB untuk mencari h menggunakan sisi yang bersesuaian.",
          calcTitle: "\u25B3ABC dan \u25B3ADE",
          concludeText: "Simpulkan",
          conclusionLine1: "\u25B3ABC ~ \u25B3ADE",
          conclusionLine2: "(dengan kesebangunan AA)",
        },
        6: {
          questionText: "Mari cari h menggunakan segitiga sebangun.",
          navText: "",
          navCompute: "Ketuk tombol untuk menghitung ekspresi.",
          questionComplete: "Tinggi pohon = 15 ft",
          navComplete:
            "Aktivitas Selesai!! Ketuk mulai lagi untuk memulai ulang.",
          calcTitle: "\u25B3ABC ~ \u25B3ADE",
          nextText: "Mulai Lagi",
        },
      },
      labels: {
        heightTree: "h",
        heightMan: "5 ft",
        distanceTotal: "24 ft",
        distanceAB: "8 ft",
        heightTreeResult: "15 ft",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
