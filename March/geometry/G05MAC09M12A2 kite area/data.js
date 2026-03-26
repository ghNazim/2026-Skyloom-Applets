const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Area of Kite",
        text: "Let's derive the area formula for a kite by transforming it into<br>a rectangle.<br>Tap 'Start' to begin the activity.",
        buttonText: "Start",
      },
      steps: {
        1: {
          questionText: "Observe the given kite and its diagonals.",
          navText: "Tap 'Transform'.",
          actionButton: "Transform",
        },
        2: {
          questionText: "Let's transform the kite to a rectangle.",
          navText: "Tap on the highlighted triangle to form a rectangle.",
          navNext:
            "Tap ⟲ to see the visualization or tap » to continue.",
          replayButton: "⟲",
        },
        3: {
          questionText:
            "The transformed rectangle has the same area as the kite.",
          questionTextAfter:
            "Notice that the diagonals now form the length and breadth of the rectangle.",
          navText: "Tap the highlighted text to derive the formula.",
          navNext: "Tap » to simplify.",
          textBefore: "Area of a Kite  =  ",
          textAfter: "Area of formed Rectangle",
          formulaText: "d₁ × ½ d₂",
        },
        4: {
          questionText: "We found the formula for the area of kite.",
          navText: "Tap » to summarise.",
          formulaText: "Area of a Kite = ½ × d₁ × d₂",
        },
      },
      final: {
        heading: "Summary",
        text: 'Area of a Kite = ½ × <span class="highlight-orange">d₁</span> × <span class="highlight-cyan">d₂</span>',
        buttonText: "Start Over",
        imageSrc: "assets/final.png",
      },
      labels: {
        d1: "d₁",
        d2: "d₂",
        halfD2: "½ d₂",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Luas Layang-layang",
        text: "Mari kita turunkan rumus luas layang-layang dengan mengubahnya<br>menjadi persegi panjang.<br>Ketuk 'Mulai' untuk memulai aktivitas.",
        buttonText: "Mulai",
      },
      steps: {
        1: {
          questionText:
            "Amati layang-layang yang diberikan dan diagonal-diagonalnya.",
          navText: "Ketuk 'Mentransformasikan'.",
          actionButton: "Mentransformasikan",
        },
        2: {
          questionText:
            "Mari kita ubah layang-layang menjadi persegi panjang.",
          navText:
            "Ketuk segitiga yang disorot untuk membentuk persegi panjang.",
          navNext:
            "Ketuk ⟲ untuk melihat visualisasi atau ketuk » untuk melanjutkan.",
          replayButton: "⟲",
        },
        3: {
          questionText:
            "Persegi panjang yang terbentuk memiliki luas yang sama dengan layang-layang.",
          questionTextAfter:
            "Perhatikan bahwa diagonal sekarang membentuk panjang dan lebar persegi panjang.",
          navText: "Ketuk teks yang disorot untuk menurunkan rumus.",
          navNext: "Ketuk » untuk menyederhanakan.",
          textBefore: "Luas Layang-layang  =  ",
          textAfter: "Luas Persegi Panjang yang Terbentuk",
          formulaText: "d₁ × ½ d₂",
        },
        4: {
          questionText:
            "Kita telah menemukan rumus luas layang-layang.",
          navText: "Ketuk » untuk merangkum.",
          formulaText: "Luas Layang-layang = ½ × d₁ × d₂",
        },
      },
      final: {
        heading: "Ringkasan",
        text: 'Luas Layang-layang = ½ × <span class="highlight-orange">d₁</span> × <span class="highlight-cyan">d₂</span>',
        buttonText: "Ulangi dari Awal",
        imageSrc: "assets/final.png",
      },
      labels: {
        d1: "d₁",
        d2: "d₂",
        halfD2: "½ d₂",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
