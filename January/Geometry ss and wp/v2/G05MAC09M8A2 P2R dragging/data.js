// const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Area of Parallelogram",
        text: "Let's derive the area formula for parallelogram by transforming it to a rectangle.<br>Tap 'Start' to begin the activity.",
        buttonText: "Start",
      },
      steps: {
        1: {
          questionText: "Let's transform the parallelogram to a rectangle.",
          navText: "Tap 'Transform'.",
          actionButton: "Transform",
        },
        2: {
          questionText: "Let's transform the parallelogram to a rectangle.",
          navText:
            "Drag and drop the highlighted triangle to form a rectangle.",
          navNext: "Tap ⟲ to see the visualization or tap » to continue.",
          actionButton: "Transform",
          replayButton: "⟲",
        },
        3: {
          questionText:
            "The transformed rectangle has the same area as the parallelogram.",
          navText: "Tap the highlighted text.",
          navNext: "Tap » to summarize.",
          textBefore: "Area of a Parallelogram   =   ",
          textAfter: "Area of Rectangle",
          formulaText: " b × t",
        },
      },
      final: {
        heading: "Summary",
        text: 'Area of Parallelogram  =  <span class="highlight-yellow"> b </span> × <span class="highlight-blue"> t </span>',
        buttonText: "Start Over",
        imageSrc: "assets/final-en.png",
      },
      labels: {
        height: "Height (t)",
        base: "Base (b)",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Luas Jajargenjang",
        text: "Mari kita turunkan rumus luas jajargenjang dengan mengubahnya<br> menjadi persegi panjang.<br>Ketuk 'Mulai' untuk memulai aktivitas.",
        buttonText: "Mulai",
      },
      steps: {
        1: {
          questionText: "Mari kita ubah jajargenjang menjadi persegi panjang.",
          navText: "Ketuk 'Transformasikan'.",
          actionButton: "Transformasikan",
        },
        2: {
          questionText: "Mari kita ubah jajargenjang menjadi persegi panjang.",
          navText:
            "Seret dan letakkan segitiga yang disorot hingga membentuk persegi panjang.",
          navNext:
            "Ketuk ⟲ untuk melihat visualisasi atau ketuk » untuk melanjutkan.",
          actionButton: "Transformasikan",
          replayButton: "⟲",
        },
        3: {
          questionText:
            "Persegi panjang yang diubah memiliki luas yang sama dengan jajargenjang.",
          navText: "Ketuk teks yang disorot.",
          navNext: "Ketuk » untuk merangkum.",
          textBefore: "Luas Jajargenjang   =   ",
          textAfter: "Luas Persegi Panjang",
          formulaText: " a × t",
        },
      },
      final: {
        heading: "Ringkasan",
        text: 'Luas jajargenjang  =  <span class="highlight-yellow">a</span> × <span class="highlight-blue">t</span>',
        buttonText: "Ulangi dari Awal",
        imageSrc: "assets/final-id.png",
      },
      labels: {
        height: "Tinggi (t)",
        base: "Alas (a)",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
