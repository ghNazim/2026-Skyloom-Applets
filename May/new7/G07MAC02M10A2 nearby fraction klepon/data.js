const decimal = {
  en: ".",
  id: ",",
};

const RECIPE_ITEMS = {
  en: [
    { key: "riceFlour", label: "Rice flour", amount: [9, 10], unit: "cup" },
    { key: "tapiocaFlour", label: "Tapioca flour", amount: [2, 9], unit: "cup" },
    { key: "coconutMilk", label: "Coconut milk", amount: [3, 5], unit: "cup" },
    { key: "vegetableOil", label: "Vegetable oil", amount: [5, 6], unit: "tbsp" },
    { key: "pandanPaste", label: "Pandan paste", amount: [2, 5], unit: "tsp" },
    { key: "salt", label: "Salt", amount: [3, 4], unit: "tsp" },
  ],
  id: [
    { key: "riceFlour", label: "Tepung beras", amount: [9, 10], unit: "cup" },
    { key: "tapiocaFlour", label: "Tepung tapioka", amount: [2, 9], unit: "cup" },
    { key: "coconutMilk", label: "Santan", amount: [3, 5], unit: "cup" },
    { key: "vegetableOil", label: "Minyak sayur", amount: [5, 6], unit: "tbsp" },
    { key: "pandanPaste", label: "Pasta pandan", amount: [2, 5], unit: "tsp" },
    { key: "salt", label: "Garam", amount: [3, 4], unit: "tsp" },
  ],
};

const DATA = {
  en: {
    app: {
      recipe: {
        title: "Klepon",
        subtitle: "makes about 20",
        actual: "Actual",
        estimate: "Estimate",
        units: {
          cup: "cup",
          tbsp: "tbsp",
          tsp: "tsp",
        },
        items: RECIPE_ITEMS.en,
      },
      start: {
        heading: "Estimate for Klepon",
        body:
          "Karina is making Klepon, but she has no measuring tools for these exact amounts.<br><br>" +
          "Use benchmarks to estimate each ingredient to the nearest measure.",
        buttonText: "Start",
      },
      problem: {
        line1: "Karina needs 9/10 cup of rice flour.",
        line2: "She has 4 cups to measure:",
        cups: [
          { label: "1 cup", fraction: null },
          { label: "1/2 cup", fraction: [1, 2] },
          { label: "1/3 cup", fraction: [1, 3] },
          { label: "1/4 cup", fraction: [1, 4] },
        ],
        prompt: "Let's estimate which cup to use with the help of the number line.",
      },
      steps: {
        1: {
          questionText: "",
          navText: "Tap \u00BB to place 9/10 on the number line.",
        },
        2: {
          questionText: "Karina needs 9/10 cup of rice flour.",
          navText: "Drag a dot to place 9/10 on the line.",
          topText:
            "The number line from 0 to 1 is split into tenths.<br>" +
            "<y>Where does 9/10 belong?</y>",
          wrongFeedback: "Not quite - count the equal parts. You need the 9th mark from 0.",
          correctFeedback: "Correct! 9/10 is 9 of the 10 equal parts.",
        },
        3: {
          questionText: "estimate 9/10 to its nearest benchmark.",
          navText: "Tap 'Show Benchmarks' to see the measures.",
          showBenchmarks: "Show Benchmarks",
          navChoose: "Tap the benchmark the amount is nearest to.",
          navDone: "Tap \u00BB to estimate the next ingredient.",
          wrongZero:
            "Not quite. 0 means none at all - but Karina does need some.<br>" +
            "Pick the measure it is nearest to.",
          wrongOther:
            "Not quite - that benchmark is further from what we needed.<br>" +
            "Which mark is closest?",
          correctFeedback:
            "Nine tenths is closest to 1.<br>" +
            "So we can use the 1 cup to measure about 9/10 cup of rice flour.",
        },
      },
    },
  },
  id: {
    app: {
      recipe: {
        title: "Klepon",
        subtitle: "menghasilkan sekitar 20",
        actual: "Sebenarnya",
        estimate: "Perkiraan",
        units: {
          cup: "cangkir",
          tbsp: "sdm",
          tsp: "sdt",
        },
        items: RECIPE_ITEMS.id,
      },
      start: {
        heading: "Perkiraan untuk Klepon",
        body:
          "Karina sedang membuat Klepon, tetapi ia tidak memiliki alat ukur untuk jumlah yang tepat ini.<br><br>" +
          "Gunakan patokan untuk memperkirakan setiap bahan ke takaran terdekat.",
        buttonText: "Mulai",
      },
      problem: {
        line1: "Karina membutuhkan 9/10 cangkir tepung beras.",
        line2: "Ia memiliki 4 cangkir ukur:",
        cups: [
          { label: "1 cangkir", fraction: null },
          { label: "1/2 cangkir", fraction: [1, 2] },
          { label: "1/3 cangkir", fraction: [1, 3] },
          { label: "1/4 cangkir", fraction: [1, 4] },
        ],
        prompt: "Mari perkirakan cangkir mana yang digunakan dengan bantuan garis bilangan.",
      },
      steps: {
        1: {
          questionText: "",
          navText: "Ketuk \u00BB untuk menempatkan 9/10 pada garis bilangan.",
        },
        2: {
          questionText: "Karina membutuhkan 9/10 cangkir tepung beras.",
          navText: "Seret titik untuk menempatkan 9/10 pada garis.",
          topText:
            "Garis bilangan dari 0 sampai 1 dibagi menjadi persepuluhan.<br>" +
            "<y>Di mana letak 9/10?</y>",
          wrongFeedback: "Belum tepat - hitung bagian yang sama. Kamu membutuhkan tanda ke-9 dari 0.",
          correctFeedback: "Benar! 9/10 adalah 9 dari 10 bagian yang sama.",
        },
        3: {
          questionText: "perkirakan 9/10 ke patokan terdekat.",
          navText: "Ketuk 'Tampilkan Patokan' untuk melihat takaran.",
          showBenchmarks: "Tampilkan Patokan",
          navChoose: "Ketuk patokan yang paling dekat dengan jumlah tersebut.",
          navDone: "Ketuk \u00BB untuk memperkirakan bahan berikutnya.",
          wrongZero:
            "Belum tepat. 0 berarti tidak ada sama sekali - tetapi Karina membutuhkan sebagian.<br>" +
            "Pilih takaran yang paling dekat.",
          wrongOther:
            "Belum tepat - patokan itu lebih jauh dari yang dibutuhkan.<br>" +
            "Tanda mana yang paling dekat?",
          correctFeedback:
            "Sembilan persepuluh paling dekat dengan 1.<br>" +
            "Jadi kita dapat menggunakan cangkir 1 untuk mengukur sekitar 9/10 cangkir tepung beras.",
        },
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
