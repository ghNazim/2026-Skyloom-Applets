const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Finding Image Coordinates",
        text:
          "Given the coordinates of an object and the<br>movement (translation), let's see how to find the<br>coordinates of its image.<br><br>Click START to begin!",
        buttonText: "START",
      },
      buttons: {
        preimage: "PRE-IMAGE",
        translation: "TRANSLATION",
        image: "IMAGE",
      },
      sideText: {
        preimage: "P (x, y)",
        translation: "(a, b)",
        imagePlaceholder: "P'( ___, ___ )",
      },
      equationPrompt: "Let's write each term as a equation",
      steps: {
        1: {
          navText: "Tap the button for point P",
        },
        2: {
          navText: "Tap the button to see translation",
        },
        3: {
          navText: "Tap the button to see image",
        },
        4: {
          navText: "Tap 'IMAGE' to see it's equation",
        },
        5: {
          navText: "Tap the button to see translation",
        },
        6: {
          navText: "Tap the button for point P",
        },
      },
      completed: {
        heading: "Activity Completed!",
        startOver: "START OVER",
        summarizeNav: "Tap » to summarize",
      },
      formula: {
        imageCoordinates: "Image coordinates",
        preimageCoordinates: "Pre-image coordinates",
        translation: "Translation",
      },
      svgLabels: {
        pLabel: "P",
        pPrime: "P'",
        openParen: "(",
        closeParen: ")",
        comma: ",",
        plus: "+",
        x: "x",
        y: "y",
        a: "a",
        b: "b",
        underscore: "___",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Mencari Koordinat Bayangan",
        text:
          "Diberikan koordinat sebuah objek dan<br>pergerakannya (translasi), mari lihat cara<br>mencari koordinat bayangannya.<br><br>Ketuk MULAI untuk memulai!",
        buttonText: "MULAI",
      },
      buttons: {
        preimage: "BAYANGAN AWAL",
        translation: "TRANSLASI",
        image: "BAYANGAN",
      },
      sideText: {
        preimage: "P (x, y)",
        translation: "(a, b)",
        imagePlaceholder: "P'(__, __)",
      },
      equationPrompt: "Mari tulis setiap suku sebagai persamaan",
      steps: {
        1: {
          navText: "Ketuk tombol untuk titik P",
        },
        2: {
          navText: "Ketuk tombol untuk melihat translasi",
        },
        3: {
          navText: "Ketuk tombol untuk melihat bayangan",
        },
        4: {
          navText: "Ketuk 'BAYANGAN' untuk melihat persamaannya",
        },
        5: {
          navText: "Ketuk tombol untuk melihat translasi",
        },
        6: {
          navText: "Ketuk tombol untuk titik P",
        },
      },
      completed: {
        heading: "Aktivitas Selesai!",
        startOver: "MULAI LAGI",
        summarizeNav: "Ketuk » untuk merangkum",
      },
      formula: {
        imageCoordinates: "Koordinat bayangan",
        preimageCoordinates: "Koordinat bayangan awal",
        translation: "Translasi",
      },
      svgLabels: {
        pLabel: "P",
        pPrime: "P'",
        openParen: "(",
        closeParen: ")",
        comma: ",",
        plus: "+",
        x: "x",
        y: "y",
        a: "a",
        b: "b",
        underscore: "__",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
