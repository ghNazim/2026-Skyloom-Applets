
const BOARD_DATA = {
  length: { Pencil: 10, Duster: 8, Chalk: 16 },
  height: { Pencil: 7, Duster: 6, Chalk: 12 },
};

const HORIZONTAL_UNITS = [
  { key: "Duster", image: "duster.png", width: "15vw" },
  { key: "Pencil", image: "pencil.png", width: "13vw" },
  { key: "Chalk", image: "chalk.png", width: "8vw" },
];

const VERTICAL_UNITS = [
  { key: "Duster", image: "dusterV.png", height: "15vw" },
  { key: "Pencil", image: "pencilV.png", height: "13vw" },
  { key: "Chalk", image: "chalkV.png", height: "8vw" },
];

const DATA = {
  en: {
    app: {
      unitNames: {
        Pencil: "pencil",
        Duster: "duster",
        Chalk: "chalk piece",
      },
      unitPlurals: {
        Pencil: "pencils",
        Duster: "dusters",
        Chalk: "chalk pieces",
      },
      start: {
        heading: "Finding Measurements",
        text: "Let's learn to find the length and height of the board<br>using small objects.",
        buttonText: "Start",
      },
      step1: {
        characterText: "First, let's find\nthe <y>length</y> of\nthe board.",
        navText: "Tap the button to see how to find the length.",
        actionButton: "Length",
      },
      step2: {
        characterText: "We can use\nany small\nobject to find\nthe length.",
        navText: "Tap any object you would like to use.",
      },
      step3: {
        characterText: "Start placing\n{{units}} from\none end of the\nboard.",
        navText: "Tap the {{unit}} to place along the board.",
      },
      step4: {
        characterText:
          "Good job!\n{{Units}} are\nplaced till the\nother end.\nLet's count\nthem!",
        characterTextDone: "The board is\n<y>{{count}} {{units}} long</y>.",
        navText: "Tap {{units}} to count.",
        navTextDone: "Tap \u00BB to continue.",
        questionText: "The board is <y>{{count}} {{units}} long</y>.",
      },
      step5: {
        characterText: "So, the length\nof the board is\n<y>{{count}} {{units}}</y>.",
        navText: "Tap \u00BB to find the height of the board.",
        questionText: "The length of the board is <y>{{count}} {{units}}</y>.",
      },
      step6: {
        characterText:
          "To find the\nheight of the\nboard, we need\nto find <bl>how far\nit goes from\nbottom to top</bl>.",
        navText: "Tap \u00BB to find the height of the board.",
      },
      step7: {
        characterText: "We can use\nany small\nobject to find\nthe height.",
        navText: "Tap the object you would like to use.",
      },
      step8: {
        characterText: "Start placing\n{{units}} from\nthe bottom.",
        navText: "Tap the {{unit}} to place along the board.",
      },
      step9: {
        characterText:
          "Good job!\n{{Units}} are\nplaced till the\ntop.\nLet's count\nthem!",
        characterTextDone: "The board is\n <bl>{{count}} {{units}} tall</bl>.",
        navText: "Tap {{units}} to count.",
        navTextDone: "Tap \u00BB to continue.",
        questionText: "The board is <bl>{{count}} {{units}} tall</bl>.",
      },
      step10: {
        characterText: "So, the height of\nthe board is\n <bl>{{count}} {{units}}</bl>.",
        navText: "Tap \u00BB to conclude.",
        questionText:
          "The height of the board is <bl>{{count}} {{units}}</bl>.",
      },
      step11: {
        characterText:
          "We found the\nmeasurements\nof the board\nlength and\nheight.",
        navText: "Tap \u00BB to start over.",
        questionText:
          "<y>Length</y> and <bl>height</bl> are the <y>measurements</y> of the board.",
        lengthLabel: "Length is <y>{{count}} {{units}}</y>",
        heightLabel: "Height is <br><bl> {{count}} {{units}} </bl>",
      },
      end: {
        heading: "Finding Measurements",
        text: "Awesome! We learned to find the length or height of an<br>object using small objects.",
        buttonText: "Start Over",
      },
    },
  },
  id: {
    app: {
      unitNames: {
        Pencil: "pensil",
        Duster: "penghapus",
        Chalk: "kapur",
      },
      unitPlurals: {
        Pencil: "pensil",
        Duster: "penghapus",
        Chalk: "kapur",
      },
      start: {
        heading: "Menemukan Ukuran",
        text: "Mari belajar mencari panjang dan tinggi papan tulis<br>menggunakan benda-benda kecil.",
        buttonText: "Mulai",
      },
      step1: {
        characterText: "Pertama, mari\ncari <y>panjang</y>\npapan tulis.",
        navText: "Ketuk tombol untuk melihat cara mencari panjang.",
        actionButton: "Panjang",
      },
      step2: {
        characterText:
          "Kita bisa\nmenggunakan\nbenda kecil\napa saja untuk\nmencari\npanjangnya.",
        navText: "Ketuk benda yang ingin kamu gunakan.",
      },
      step3: {
        characterText: "Mulai letakkan\n{{units}} dari\nujung papan.",
        navText: "Ketuk {{unit}} untuk diletakkan di sepanjang papan.",
      },
      step4: {
        characterText:
          "Bagus!\n{{Units}} sudah\ndiletakkan\nsampai ujung\nlainnya.\nAyo hitung!",
        characterTextDone: "Papan sepanjang\n<y>{{count}} {{units}}</y>.",
        navText: "Ketuk {{units}} untuk menghitung.",
        navTextDone: "Ketuk \u00BB untuk melanjutkan.",
        questionText: "Papan sepanjang <y>{{count}} {{units}}</y>.",
      },
      step5: {
        characterText: "Jadi, panjang\npapan adalah\n<y>{{count}} {{units}}</y>.",
        navText: "Ketuk \u00BB untuk mencari tinggi papan.",
        questionText: "Panjang papan adalah <y>{{count}} {{units}}</y>.",
      },
      step6: {
        characterText:
          "Untuk mencari\ntinggi papan,\nkita perlu tahu\n<bl>seberapa jauh\ndari bawah\nke atas</bl>.",
        navText: "Ketuk \u00BB untuk mencari tinggi papan.",
      },
      step7: {
        characterText:
          "Kita bisa\nmenggunakan\nbenda kecil\napa saja untuk\nmencari\ntingginya.",
        navText: "Ketuk benda yang ingin kamu gunakan.",
      },
      step8: {
        characterText: "Mulai letakkan\n{{units}} dari\nbawah.",
        navText: "Ketuk {{unit}} untuk diletakkan di sepanjang papan.",
      },
      step9: {
        characterText:
          "Bagus!\n{{Units}} sudah\ndiletakkan\nsampai atas.\nAyo hitung!",
        characterTextDone: "Papan setinggi\n<bl>{{count}} {{units}}</bl>.",
        navText: "Ketuk {{units}} untuk menghitung.",
        navTextDone: "Ketuk \u00BB untuk melanjutkan.",
        questionText: "Papan setinggi <bl>{{count}} {{units}}</bl>.",
      },
      step10: {
        characterText: "Jadi, tinggi\npapan adalah\n<bl>{{count}} {{units}}</bl>.",
        navText: "Ketuk \u00BB untuk menyimpulkan.",
        questionText: "Tinggi papan adalah <bl>{{count}} {{units}}</bl>.",
      },
      step11: {
        characterText: "Kita menemukan\nukuran papan\npanjang dan\ntinggi.",
        navText: "Ketuk \u00BB untuk mulai ulang.",
        questionText:
          "<y>Panjang</y> dan <bl>tinggi</bl> adalah <y>ukuran</y> papan.",
        lengthLabel: "Panjangnya <y>{{count}} {{units}}</y>",
        heightLabel: "Tingginya <br><bl>{{count}} {{units}}</bl>",
      },
      end: {
        heading: "Menemukan Ukuran",
        text: "Luar biasa! Kita sudah belajar mencari panjang atau tinggi<br>suatu benda menggunakan benda-benda kecil.",
        buttonText: "Mulai Ulang",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
