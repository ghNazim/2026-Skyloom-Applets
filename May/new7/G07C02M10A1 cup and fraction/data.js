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
      final: {
        heading: "Activity Completed",
        body:
          "You estimated every ingredient to its nearest benchmark.<br><br>" +
          "When an amount does not match a measuring tool, choosing the nearest benchmark is how we <y>estimate</y>.<br><br>" +
          "This skill will be used far beyond cooking.",
        buttonText: "Start Over",
      },
      problem: {
        line2: "She has 4 cups to measure:",
        cups: [
          { label: "1 cup", fraction: null },
          { label: "1/2 cup", fraction: [1, 2] },
          { label: "1/3 cup", fraction: [1, 3] },
          { label: "1/4 cup", fraction: [1, 4] },
        ],
        prompt: "Let's estimate which cup to use with the help of the number line.",
      },
      ingredientFlows: [
        {
          itemIndex: 0,
          itemKey: "riceFlour",
          itemName: "rice flour",
          numerator: 9,
          denominator: 10,
          splitName: "tenths",
          correctBenchmark: 1,
          estimateText: "1 cup",
          problemLine: "Karina needs 9/10 cup of rice flour.",
          placeQuestion: "Karina needs 9/10 cup of rice flour.",
          problemNav: "Tap \u00BB to place 9/10 on the number line.",
          placeNav: "Drag a dot to place 9/10 on the line.",
          benchmarkQuestion: "estimate 9/10 to its nearest benchmark.",
          placeWrong: "Not quite - count the equal parts. You need the 9th mark from 0.",
          placeCorrect: "Correct! 9/10 is 9 of the 10 equal parts.",
          benchmarkCorrect:
            "Nine tenths is closest to 1.<br>" +
            "So we can use the 1 cup to measure about 9/10 cup of rice flour.",
        },
        {
          itemIndex: 1,
          itemKey: "tapiocaFlour",
          itemName: "tapioca flour",
          numerator: 2,
          denominator: 9,
          splitName: "ninths",
          correctBenchmark: 0.25,
          estimateText: "1/4 cup",
          problemLine: "Karina needs 2/9 cup of tapioca flour.",
          placeQuestion: "Karina needs 2/9 cup of tapioca flour.",
          problemNav: "Tap \u00BB to place 2/9 on the number line.",
          placeNav: "Drag a dot to place 2/9 on the line.",
          benchmarkQuestion: "estimate 2/9 to its nearest benchmark.",
          placeWrong: "Not quite - count the equal parts. You need the 2nd mark from 0.",
          placeCorrect: "Correct! 2/9 is 2 of the 9 equal parts.",
          benchmarkCorrect:
            "Two ninths is closest to 1/4.<br>" +
            "So we can use the 1/4 cup to measure about 2/9 cup of tapioca flour.",
        },
        {
          itemIndex: 2,
          itemKey: "coconutMilk",
          itemName: "coconut milk",
          numerator: 3,
          denominator: 5,
          splitName: "fifths",
          correctBenchmark: 0.5,
          estimateText: "1/2 cup",
          problemLine: "Karina needs 3/5 cup of coconut milk.",
          placeQuestion: "Karina needs 3/5 cup of coconut milk.",
          problemNav: "Tap \u00BB to place 3/5 on the number line.",
          placeNav: "Drag a dot to place 3/5 on the line.",
          benchmarkQuestion: "estimate 3/5 to its nearest benchmark.",
          placeWrong: "Not quite - count the equal parts. You need the 3rd mark from 0.",
          placeCorrect: "Correct! 3/5 is 3 of the 5 equal parts.",
          benchmarkCorrect:
            "Three fifths is closest to 1/2.<br>" +
            "So we can use the 1/2 cup to measure about 3/5 cup of coconut milk.",
        },
        {
          itemIndex: 3,
          itemKey: "vegetableOil",
          itemName: "vegetable oil",
          numerator: 5,
          denominator: 6,
          splitName: "sixths",
          benchmarkValues: [0, 0.5, 1],
          correctBenchmark: 1,
          estimateText: "1 tbsp",
          problemLine: "Now, Karina needs 5/6 tbsp of vegetable oil.",
          problemLine2: "She has 2 table spoons to measure:",
          tools: [{ label: "1 tbsp" }, { label: "1/2 tbsp" }],
          prompt: "Let's estimate which tablespoon to use with the help of the number line.",
          placeQuestion: "Karina needs 5/6 tbsp of vegetable oil.",
          problemNav: "Tap \u00BB to place 5/6 on the number line.",
          placeNav: "Drag a dot to place 5/6 on the line.",
          benchmarkQuestion: "estimate 5/6 to its nearest benchmark.",
          placeWrong: "Not quite - count the equal parts. You need the 5th mark from 0.",
          placeCorrect: "Correct! 5/6 is 5 of the 6 equal parts.",
          benchmarkCorrect:
            "Five sixths is closest to 1.<br>" +
            "So we can use the 1 tbsp to measure about 5/6 tbsp of vegetable oil.",
        },
        {
          itemIndex: 4,
          itemKey: "pandanPaste",
          itemName: "pandan paste",
          numerator: 2,
          denominator: 5,
          splitName: "fifths",
          benchmarkValues: [0, 0.5, 1],
          correctBenchmark: 0.5,
          estimateText: "1/2 tsp",
          problemLine: "Now, Karina needs 2/5 tsp of pandan paste.",
          problemLine2: "She has only 2 tea spoons to measure:",
          tools: [{ label: "1 tsp" }, { label: "1/2 tsp" }],
          prompt: "Let's estimate which teaspoon to use.",
          placeQuestion: "Karina needs 2/5 tsp of pandan paste.",
          problemNav: "Tap \u00BB to place 2/5 on the number line.",
          placeNav: "Drag a dot to place 2/5 on the line.",
          benchmarkQuestion: "estimate 2/5 to its nearest benchmark.",
          placeWrong: "Not quite - count the equal parts. You need the 2nd mark from 0.",
          placeCorrect: "Correct! 2/5 is 2 of the 5 equal parts.",
          benchmarkCorrect:
            "2/5 is closest to 1/2.<br>" +
            "So we can use the 1/2 tsp to measure about 2/5 tsp of pandan paste.",
        },
        {
          itemIndex: 5,
          itemKey: "salt",
          itemName: "salt",
          numerator: 3,
          denominator: 4,
          splitName: "fourths",
          benchmarkValues: [0, 0.5, 1],
          correctBenchmark: 1,
          estimateText: "1 tsp",
          halfwayRoundUp: true,
          halfwayWrong:
            "Not quite. We never estimate a halfway amount to the smaller measure.<br>" +
            "Try again.",
          problemLine: "Now, Karina needs 3/4 tsp of salt.",
          problemLine2: "She has only 2 tea spoons to measure:",
          tools: [{ label: "1 tsp" }, { label: "1/2 tsp" }],
          prompt: "Let's estimate which teaspoon to use.",
          placeQuestion: "Karina needs 3/4 tsp of salt.",
          problemNav: "Tap \u00BB to place 3/4 on the number line.",
          placeNav: "Drag a dot to place 3/4 on the line.",
          benchmarkQuestion: "estimate 3/4 to its nearest benchmark.",
          placeWrong: "Not quite - count the equal parts. You need the 3rd mark from 0.",
          placeCorrect: "Correct! 3/4 is 3 of the 4 equal parts.",
          benchmarkCorrect:
            "Correct! 3/4 is exactly halfway, so we round up to the larger measure - 1.<br>" +
            "So we can use the 1 tsp to measure about 3/4 tsp of salt.",
        },
      ],
      steps: {
        1: {
          questionText: "",
          navText: "Tap \u00BB to place 9/10 on the number line.",
        },
        2: {
          questionText: "Karina needs 9/10 cup of rice flour.",
          navText: "Drag a dot to place 9/10 on the line.",
          topLead: "The number line from 0 to 1 is split into {splitName}.",
          topQuestion: "Where does {fraction} belong?",
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
          navFinish: "Tap \u00BB to finish.",
          navFinished: "Activity Completed!!",
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
      final: {
        heading: "Aktivitas Selesai",
        body:
          "Kamu telah memperkirakan setiap bahan ke patokan terdekat.<br><br>" +
          "Ketika suatu jumlah tidak sama dengan alat ukur, memilih patokan terdekat adalah cara kita <y>memperkirakan</y>.<br><br>" +
          "Keterampilan ini akan digunakan jauh melampaui memasak.",
        buttonText: "Mulai Lagi",
      },
      problem: {
        line2: "Ia memiliki 4 cangkir ukur:",
        cups: [
          { label: "1 cangkir", fraction: null },
          { label: "1/2 cangkir", fraction: [1, 2] },
          { label: "1/3 cangkir", fraction: [1, 3] },
          { label: "1/4 cangkir", fraction: [1, 4] },
        ],
        prompt: "Mari perkirakan cangkir mana yang digunakan dengan bantuan garis bilangan.",
      },
      ingredientFlows: [
        {
          itemIndex: 0,
          itemKey: "riceFlour",
          itemName: "tepung beras",
          numerator: 9,
          denominator: 10,
          splitName: "persepuluhan",
          correctBenchmark: 1,
          estimateText: "1 cangkir",
          problemLine: "Karina membutuhkan 9/10 cangkir tepung beras.",
          placeQuestion: "Karina membutuhkan 9/10 cangkir tepung beras.",
          problemNav: "Ketuk \u00BB untuk menempatkan 9/10 pada garis bilangan.",
          placeNav: "Seret titik untuk menempatkan 9/10 pada garis.",
          benchmarkQuestion: "perkirakan 9/10 ke patokan terdekat.",
          placeWrong: "Belum tepat - hitung bagian yang sama. Kamu membutuhkan tanda ke-9 dari 0.",
          placeCorrect: "Benar! 9/10 adalah 9 dari 10 bagian yang sama.",
          benchmarkCorrect:
            "Sembilan persepuluh paling dekat dengan 1.<br>" +
            "Jadi kita dapat menggunakan cangkir 1 untuk mengukur sekitar 9/10 cangkir tepung beras.",
        },
        {
          itemIndex: 1,
          itemKey: "tapiocaFlour",
          itemName: "tepung tapioka",
          numerator: 2,
          denominator: 9,
          splitName: "persembilan",
          correctBenchmark: 0.25,
          estimateText: "1/4 cangkir",
          problemLine: "Karina membutuhkan 2/9 cangkir tepung tapioka.",
          placeQuestion: "Karina membutuhkan 2/9 cangkir tepung tapioka.",
          problemNav: "Ketuk \u00BB untuk menempatkan 2/9 pada garis bilangan.",
          placeNav: "Seret titik untuk menempatkan 2/9 pada garis.",
          benchmarkQuestion: "perkirakan 2/9 ke patokan terdekat.",
          placeWrong: "Belum tepat - hitung bagian yang sama. Kamu membutuhkan tanda ke-2 dari 0.",
          placeCorrect: "Benar! 2/9 adalah 2 dari 9 bagian yang sama.",
          benchmarkCorrect:
            "Dua persembilan paling dekat dengan 1/4.<br>" +
            "Jadi kita dapat menggunakan cangkir 1/4 untuk mengukur sekitar 2/9 cangkir tepung tapioka.",
        },
        {
          itemIndex: 2,
          itemKey: "coconutMilk",
          itemName: "santan",
          numerator: 3,
          denominator: 5,
          splitName: "perlima",
          correctBenchmark: 0.5,
          estimateText: "1/2 cangkir",
          problemLine: "Karina membutuhkan 3/5 cangkir santan.",
          placeQuestion: "Karina membutuhkan 3/5 cangkir santan.",
          problemNav: "Ketuk \u00BB untuk menempatkan 3/5 pada garis bilangan.",
          placeNav: "Seret titik untuk menempatkan 3/5 pada garis.",
          benchmarkQuestion: "perkirakan 3/5 ke patokan terdekat.",
          placeWrong: "Belum tepat - hitung bagian yang sama. Kamu membutuhkan tanda ke-3 dari 0.",
          placeCorrect: "Benar! 3/5 adalah 3 dari 5 bagian yang sama.",
          benchmarkCorrect:
            "Tiga perlima paling dekat dengan 1/2.<br>" +
            "Jadi kita dapat menggunakan cangkir 1/2 untuk mengukur sekitar 3/5 cangkir santan.",
        },
        {
          itemIndex: 3,
          itemKey: "vegetableOil",
          itemName: "minyak sayur",
          numerator: 5,
          denominator: 6,
          splitName: "perenam",
          benchmarkValues: [0, 0.5, 1],
          correctBenchmark: 1,
          estimateText: "1 sdm",
          problemLine: "Sekarang, Karina membutuhkan 5/6 sdm minyak sayur.",
          problemLine2: "Ia memiliki 2 sendok makan untuk mengukur:",
          tools: [{ label: "1 sdm" }, { label: "1/2 sdm" }],
          prompt: "Mari perkirakan sendok makan mana yang digunakan dengan bantuan garis bilangan.",
          placeQuestion: "Karina membutuhkan 5/6 sdm minyak sayur.",
          problemNav: "Ketuk \u00BB untuk menempatkan 5/6 pada garis bilangan.",
          placeNav: "Seret titik untuk menempatkan 5/6 pada garis.",
          benchmarkQuestion: "perkirakan 5/6 ke patokan terdekat.",
          placeWrong: "Belum tepat - hitung bagian yang sama. Kamu membutuhkan tanda ke-5 dari 0.",
          placeCorrect: "Benar! 5/6 adalah 5 dari 6 bagian yang sama.",
          benchmarkCorrect:
            "Lima perenam paling dekat dengan 1.<br>" +
            "Jadi kita dapat menggunakan 1 sdm untuk mengukur sekitar 5/6 sdm minyak sayur.",
        },
        {
          itemIndex: 4,
          itemKey: "pandanPaste",
          itemName: "pasta pandan",
          numerator: 2,
          denominator: 5,
          splitName: "perlima",
          benchmarkValues: [0, 0.5, 1],
          correctBenchmark: 0.5,
          estimateText: "1/2 sdt",
          problemLine: "Sekarang, Karina membutuhkan 2/5 sdt pasta pandan.",
          problemLine2: "Ia hanya memiliki 2 sendok teh untuk mengukur:",
          tools: [{ label: "1 sdt" }, { label: "1/2 sdt" }],
          prompt: "Mari perkirakan sendok teh mana yang digunakan.",
          placeQuestion: "Karina membutuhkan 2/5 sdt pasta pandan.",
          problemNav: "Ketuk \u00BB untuk menempatkan 2/5 pada garis bilangan.",
          placeNav: "Seret titik untuk menempatkan 2/5 pada garis.",
          benchmarkQuestion: "perkirakan 2/5 ke patokan terdekat.",
          placeWrong: "Belum tepat - hitung bagian yang sama. Kamu membutuhkan tanda ke-2 dari 0.",
          placeCorrect: "Benar! 2/5 adalah 2 dari 5 bagian yang sama.",
          benchmarkCorrect:
            "2/5 paling dekat dengan 1/2.<br>" +
            "Jadi kita dapat menggunakan 1/2 sdt untuk mengukur sekitar 2/5 sdt pasta pandan.",
        },
        {
          itemIndex: 5,
          itemKey: "salt",
          itemName: "garam",
          numerator: 3,
          denominator: 4,
          splitName: "perempat",
          benchmarkValues: [0, 0.5, 1],
          correctBenchmark: 1,
          estimateText: "1 sdt",
          halfwayRoundUp: true,
          halfwayWrong:
            "Belum tepat. Kita tidak memperkirakan jumlah yang tepat di tengah ke ukuran yang lebih kecil.<br>" +
            "Coba lagi.",
          problemLine: "Sekarang, Karina membutuhkan 3/4 sdt garam.",
          problemLine2: "Ia hanya memiliki 2 sendok teh untuk mengukur:",
          tools: [{ label: "1 sdt" }, { label: "1/2 sdt" }],
          prompt: "Mari perkirakan sendok teh mana yang digunakan.",
          placeQuestion: "Karina membutuhkan 3/4 sdt garam.",
          problemNav: "Ketuk \u00BB untuk menempatkan 3/4 pada garis bilangan.",
          placeNav: "Seret titik untuk menempatkan 3/4 pada garis.",
          benchmarkQuestion: "perkirakan 3/4 ke patokan terdekat.",
          placeWrong: "Belum tepat - hitung bagian yang sama. Kamu membutuhkan tanda ke-3 dari 0.",
          placeCorrect: "Benar! 3/4 adalah 3 dari 4 bagian yang sama.",
          benchmarkCorrect:
            "Benar! 3/4 tepat di tengah, jadi kita membulatkan ke ukuran yang lebih besar - 1.<br>" +
            "Jadi kita dapat menggunakan 1 sdt untuk mengukur sekitar 3/4 sdt garam.",
        },
      ],
      steps: {
        1: {
          questionText: "",
          navText: "Ketuk \u00BB untuk menempatkan 9/10 pada garis bilangan.",
        },
        2: {
          questionText: "Karina membutuhkan 9/10 cangkir tepung beras.",
          navText: "Seret titik untuk menempatkan 9/10 pada garis.",
          topLead: "Garis bilangan dari 0 sampai 1 dibagi menjadi {splitName}.",
          topQuestion: "Di mana letak {fraction}?",
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
          navFinish: "Ketuk \u00BB untuk selesai.",
          navFinished: "Aktivitas Selesai!!",
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
