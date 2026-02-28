// const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

// Inline can icon for list items (2.3vw × 2.3vw); text strings are in language object, built after APP_DATA is set
const CAN_ICON = '<img src="assets/can.png" class="info-list-can-icon" alt="" />';

// Master data structure for Paint Trap Wall (Trapezium)
const DATA = {
  en: {
    app: {
      start_over: "Restart",

      // Translatable strings for list lines that show can icon (used in infoList/dataList)
      areaCoveredByCan: "<gr>Area covered by 1 can = 1.5 m²</gr>",
      areaPaintedByCan: "<gr>Area painted by 1 can = 1.5 m²</gr>",
      costOfCan: "<gr>Cost of 1 can = Rp 22,500.00</gr>",
      areaCoveredByCanWhite: "Area covered by 1 can = 1.5 m²",
      areaPaintedByCanWhite: "Area painted by 1 can = 1.5 m²",
      costOfCanWhite: "Cost of 1 can = Rp 22,500.00",

      // Step 0: Comprehend question
      comprehend: {
        comprehendQuestion:
          "A boundary wall in the shape of a trapezium will be painted with a base coat to prepare it for a mural. If one can of paint can cover 1.5 m² at a cost of Rp 22,500.00, determine the total cost required to paint the wall (√3 = 1.73) .",
        infoList: [
          "<bl>In iso. trapezium ABCD, AD = DC = CB = 4m</bl>",
          "lineAreaCoveredCan",
          "lineCostCan",
          "<yl>Total cost of painting wall = ?</yl>",
        ],
        highlights: [
          "A boundary wall in the shape of a trapezium",
          "If one can of paint can cover 1.5 m²",
          ["one can of paint", "a cost of Rp 22,500.00"],
          "determine the total cost required to paint the wall (√3 = 1.73)",
        ],
        highlightClasses: ["bl", "gr", "gr", "yl"],
        images: [
          "assets/compre2Anim.svg",
          "assets/compre0.svg",
          "assets/compre0.svg",
          "assets/compre0.svg",
        ],
        defaultImage: "assets/compre1Anim.svg",
        defaultInfoListItem: "<bl>ABCD is an isosceles Trapezium</bl>",
        defaultHighlight: "A boundary wall in the shape of a trapezium",
        nav: "Tap » to identify 'given' information in the question.",
        navFinal: "Tap »",
        q: "Visualising the Question",
      },

      // Splash screens data (Step 2)
      splash: {
        step2: {
          image: "assets/mcq1correct.svg",
          text: "<blue>✓ Information gathered from the figure.</blue><yellow>Next - Identify what the area of the rice field represents.</yellow>",
          belowImage: "<bl>In iso. trapezium ABCD, AD = DC = CB = 4m</bl>",
          dataList: [
            "lineAreaCoveredCan",
            "lineCostCan",
            "<yl>Total cost of painting wall = ?</yl>",
          ],
          nav: "Tap » to understand the shape better.",
        },
        step10: {
          image: "assets/compute2.svg",
          dataList: [
            "lineAreaCoveredCanWhite",
            "lineCostCanWhite",
            "<yl>Total cost of painting wall = ?</yl>",
          ],
          text: "<blue>✓ Information gathered from the figure.</blue><blue>✓ Calculated the area of the trapezium.</blue><yellow>Next – Calculate the total cost of painting the wall.</yellow>",
          nav: "Tap » to calculate the total cost of painting",
        },
      },

      // Visual data for steps 11, 12, 13 (compute2 image + info list)
      compute2Visual: {
        image: "assets/compute2.svg",
        infoList: ["lineAreaPaintedCanWhite", "lineCostCanWhite"],
        cansInfoText: "Number of cans of paint = 13.84",
      },

      // Step 14: Summary (question panel hidden, visual + only text, next restarts)
      step14: {
        image: "assets/final.svg",
        infoList: [
          "<bl>In iso. trapezium ABCD, AD = DC = CB = 4m</bl>",
          "lineAreaCoveredCan",
          "lineCostCan",
        ],
        text: "<left>1. Decompose the wall trapezium to\nfind right triangles\n2. Find required base and height\nlengths of the trapezium\n3. Find the area of Trapezium using\narea formula\n4. Find the number of paint cans\nrequired as a whole number.\n5. Find the total cost of painting\nusing cost of 1 can and number\nof cans required.</left>",
      },

      // MCQ data for Step 1
      mcq: {
        title:
          "What do we need to find to get total cost of painting the wall?",
        options: [
          "Perimeter of the wall",
          "Length of the wall",
          "Area of the wall",
        ],
        correctIndex: 2,
        feedbacks: null,
        imagesForEachOption: null,
        defaultImage: "assets/compre0.svg",
        correctImage: "assets/mcq1Correct.svg",
        nav: "Tap the correct answer",
        navFinal: "Tap » to summarise so far",
      },

      // Step 3: Perpendiculars + OnlyText
      onlyText: {
        step3: {
          initialText:
            "We need height and\nlength of both bases\nto calculate\narea of a trapezium.",
          finalText: "⏢ABCD is composed of\n∆ADE, ▭DCFE and ∆BCF",
          q: "Drop perpendiculars from one base of the trapezium to the other",
          nav: "Tap points D and C to draw perpendicular lines to the base AB.",
          navFinal: "Tap » to explore the triangles further",
        },
      },
      perpendiculars: {
        defaultImage: "assets/compre0.svg",
        perp1left: "assets/perp1left.svg",
        perp1right: "assets/perp1right.svg",
        perp2: "assets/perp2.svg",
      },

      // Step 4: MCQ (congruent triangles)
      mcq2: {
        title: "Are the triangles ADE and BCF congruent triangles?",
        options: ["Yes", "No"],
        correctIndex: 0,
        feedbacks: [
          "∠A = ∠B = 60°,   AD = BC = 4 m,\n∠E = ∠F = 90°.\nBy ASA, the triangles are congruent!",
          "Note that 2 angles and a side are equal in measure in both triangles",
        ],
        defaultImage: "assets/mcq2.svg",
        correctImage: "assets/mcq2.svg",
        nav: "Tap the correct answer",
        navFinal: "Tap » to explore the ratio of sides in the triangles",
      },

      // Step 5: MCQ (side ratio)
      mcq3: {
        title: "What is the side ratio of sides in the triangles?",
        options: [
          "1 : 1 : " + sqrt(2),
          "1 : " + sqrt(3) + " : 2",
          "1 : " + sqrt(2) + " : " + sqrt(3),
        ],
        correctIndex: 1,
        feedbacks: [
          "Note that the triangles are 30-60-90 special triangles.",
          "∠D = 30°, ∠A = 60°, ∠E = 90°.",
          "Note that the triangles are 30-60-90 special triangles.",
        ],
        defaultImage: "assets/mcq3.svg",
        correctImage: "assets/mcq3.svg",
        nav: "Tap the correct answer",
        navFinal: "Tap » to find the sides of the triangle",
      },

      // Step 6: Table (ratio multiplier + side lengths)
      tableStep: {
        title: "What is the multiplier for the ratio, if AD = 4m",
        headers: ["AE", "ED", "DA"],
        arrowCorrectAnswer: "2",
        arrowMaxLength: 1,
        image: "assets/tableAD.svg",
        imageAfterED: "assets/tableDE.svg",
        imageAfterAE: "assets/tableAE.svg",
        nav: "Use numpad to enter the ratio multiplier",
        navFinal: "Tap » to find dimensions of trapezium",
      },

      // Step 7: MCQ (dimensions of trapezium) – image per option
      mcq4: {
        title: "What are the dimensions of the trapezium?",
        options: [
          `Bases: 4 m, 4 m; height: 2${sqrt(3)} m`,
          `Bases: 4 m, 8 m; height: 4 m`,
          `Bases: 4 m, 8 m; height: 2${sqrt(3)} m`,
        ],
        correctIndex: 2,
        feedbacks: [
          "Oops, remember, both triangles are congruent. We should add their bases to the trapezium's base.",
          "Oops, we need perpendicular height between the bases of the trapezium.",
          "Since DCFE is a rectangle, EF = 4 m, and AB = 2 + 4 + 2 = 8m",
        ],
        defaultImage: "assets/mcq4.svg",
        imagesForEachOption: [
          "assets/mcq4opt1.svg",
          "assets/mcq4opt2.svg",
          "assets/mcq4.svg",
        ],
        nav: "Tap the correct answer",
        navFinal: "Tap » to find area of trapezium",
      },

      // Step 8: MCQ (area formula)
      mcq5: {
        title: "What is the area of the trapezium?",
        options: [
          `${frac(1, 2)} × ( a × b ) × h`,
          `${frac(1, 2)} × ( a + b ) × h`,
        ],
        correctIndex: 1,
        feedbacks: null,
        defaultImage: "assets/mcq5.svg",
        correctImage: "assets/mcq5.svg",
        nav: "Tap the correct answer",
        navFinal: "Tap »",
      },

      // Step 9: Compute (area of trapezium – substitute and simplify)
      compute1Config: {
        title: "What is the area of the trapezium?",
        defaultImage: "assets/mcq5.svg",
        finalImage: "assets/compute1final.svg",
        navFinal: "Tap » to summarise so far",
        colors: {
          lightBlue: "#56C7FF",
          lightGreen: "#47D2B6",
          yellow: "#EAB308",
        },
        steps: [
          { delay: 0, row1: `${frac(1, 2)} × ( a + b ) × h`, rowsCount: 1 },
          { delay: 1000, appendRow: `${frac(1, 2)} × ( a + b ) × h` },
          {
            delay: 1500,
            highlightRow1: [{ text: "a", color: "#56C7FF" }],
            row2: `${frac(1, 2)} × ( 4 + b ) × h`,
            row2Colored: [{ text: "4", color: "#56C7FF" }],
            image: "assets/a.svg",
          },
          {
            delay: 1500,
            highlightRow1: [{ text: "b", color: "#56C7FF" }],
            row2: `${frac(1, 2)} × ( 4 + 8 ) × h`,
            row2Colored: [{ text: "8", color: "#56C7FF" }],
            image: "assets/b.svg",
          },
          {
            delay: 1500,
            highlightRow1: [{ text: "h", color: "#47D2B6" }],
            row2: `${frac(1, 2)} × ( 4 + 8 ) × 2${sqrt(3)}`,
            row2Colored: [{ text: `2${sqrt(3)}`, color: "#47D2B6" }],
            image: "assets/h.svg",
          },
          { delay: 1500, image: "assets/mcq5.svg" },
          { delay: 1500, appendRow: `${frac(1, 2)} × ( 4 + 8 ) × 2${sqrt(3)}` },
          {
            delay: 1500,
            highlightRow2: [{ text: "( 4 + 8 )", color: "#EAB308" }],
            row3: `${frac(1, 2)} × ( 12 ) × 2${sqrt(3)}`,
            row3Colored: [{ text: "12", color: "#EAB308" }],
          },
          {
            delay: 1500,
            highlightRow2: [
              { text: `${frac(1, 2)}`, color: "#FF00E6" },
              { text: "2", color: "#FF00E6" },
            ],
            row3: `12 × ${sqrt(3)}`,
          },
          {
            delay: 1500,
            highlightRow2: [{ text: `${sqrt(3)}`, color: "#EAB308" }],
            row3: "12 × 1.73",
            row3Colored: [{ text: "1.73", color: "#EAB308" }],
          },
          {
            delay: 1500,
            row3FullHighlight: true,
            row3Replace: "20.76 m²",
            image: "assets/compute1final.svg",
            final: true,
          },
        ],
      },

      // Step 11: MCQ (formula for number of cans – fraction options)
      mcq6: {
        title: "",
        options: [
          "Area of Wall / Area painted by 1 Can",
          "Area painted by 1 Can / Area of Wall",
        ],
        correctIndex: 0,
        feedbacks: null,
        defaultImage: "assets/compute2.svg",
        correctImage: "assets/compute2.svg",
        nav: "Tap the correct answer",
        navFinal: "Tap »",
      },

      // Step 12: Compute (#cans of paint – fraction substitution)
      compute2Config: {
        title: "#cans of paint",
        defaultImage: "assets/compute2.svg",
        navFinal: "Tap »",
        colors: { yellow: "#EAB308" },
        fraction: { num: "Area of Wall", den: "Area painted by 1 Can" },
        steps: [
          { delay: 0, row1Fraction: true, rowsCount: 1 },
          { delay: 800, row2Fraction: true },
          {
            delay: 1500,
            highlightRow1: "numerator",
            row2Num: "20.76 m²",
            row2Den: "Area painted by 1 Can",
            row2ColoredNum: true,
          },
          {
            delay: 1500,
            highlightRow1: "denominator",
            row2Num: "20.76 m²",
            row2Den: "1.5 m²",
            row2ColoredDen: true,
          },
          {
            delay: 1500,
            highlightRow2Units: true,
          },
          {
            delay: 1000,
            highlightRow2Units: false,
            row2Num: "20.76",
            row2Den: "1.5",
          },
          {
            delay: 1500,
            row2Replace: "13.84",
            appendInfoText: "Number of cans of paint = 13.84",
            final: true,
          },
        ],
      },

      // Step 13: MCQ (total cost – full cans)
      mcq7: {
        title: "",
        options: ["13.84 × Rp 22,500.00", "14 × Rp 22,500.00"],
        correctIndex: 1,
        feedbacks: [
          "Oops! Paint can only be bought in count of full cans of paint!",
          "That's right! Paint can only be bought in count of full cans of paint! \n\n<b>Total cost = Rp. 315,000.00</b>",
        ],
        defaultImage: "assets/compute2.svg",
        correctImage: "assets/compute2.svg",
        nav: "Tap the correct option.",
        navFinal: "Tap » to summarise",
      },

      // Steps configuration
      steps: {
        0: {
          questionText: "",
          navText: "",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: true,
        },
        1: {
          questionText: "Connecting the ‘to find’ to mathematical concepts",
          navText: "",
          isMcq: true,
          mcqKey: "mcq",
          nextEnabled: false,
        },
        2: {
          questionText: "",
          navText: "",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true,
        },
        3: {
          questionText: "",
          navText: "",
          isOnlyText: true,
          onlyTextKey: "step3",
          isPerpendiculars: true,
          nextEnabled: false,
        },
        4: {
          questionText: "Compare the triangles",
          navText: "",
          isMcq: true,
          mcqKey: "mcq2",
          nextEnabled: false,
        },
        5: {
          questionText: "What type of triangles are these",
          navText: "",
          isMcq: true,
          mcqKey: "mcq3",
          nextEnabled: false,
        },
        6: {
          questionText: "Find the side lengths using the ratio of sides",
          navText: "",
          isTable: true,
          tableKey: "tableStep",
          nextEnabled: false,
        },
        7: {
          questionText: "What are the dimensions of the trapezium?",
          navText: "",
          isMcq: true,
          mcqKey: "mcq4",
          nextEnabled: false,
        },
        8: {
          questionText: "What is the area of the trapezium?",
          navText: "",
          isMcq: true,
          mcqKey: "mcq5",
          nextEnabled: false,
        },
        9: {
          questionText: "What is the area of the trapezium?",
          navText: "",
          isCompute: true,
          computeKey: "compute1Config",
          nextEnabled: false,
        },
        10: {
          questionText: "",
          navText: "",
          isSplash: true,
          splashKey: "step10",
          nextEnabled: true,
        },
        11: {
          questionText:
            "How many cans of paint would be needed for painting the complete wall?",
          navText: "",
          isMcq: true,
          mcqKey: "mcq6",
          nextEnabled: false,
        },
        12: {
          questionText:
            "How many cans of paint would be needed for painting the complete wall?",
          navText: "",
          isCompute2: true,
          computeKey: "compute2Config",
          nextEnabled: false,
        },
        13: {
          questionText: "What is the total cost of paint?",
          navText: "Tap the correct option.",
          isMcq: true,
          mcqKey: "mcq7",
          nextEnabled: false,
        },
        14: {
          questionText: "",
          navText: "Tap » to start over.",
          hideQuestionPanel: true,
          isSummary: true,
          summaryKey: "step14",
          nextEnabled: true,
        },
      },
      labels: {
        given: "Given",
        toFind: "To Find",
        findings: "Findings",
      },
    },
  },

  id: {
    app: {
      start_over: "Mulai ulang",

      areaCoveredByCan: "<gr>Luas yang dapat ditutup 1 kaleng = 1,5 m²</gr>",
      areaPaintedByCan: "<gr>Luas yang dapat dicat 1 kaleng = 1,5 m²</gr>",
      costOfCan: "<gr>Harga 1 kaleng = Rp 22.500,00</gr>",
      areaCoveredByCanWhite: "Luas yang dapat ditutup 1 kaleng = 1,5 m²",
      areaPaintedByCanWhite: "Luas yang dapat dicat 1 kaleng = 1,5 m²",
      costOfCanWhite: "Harga 1 kaleng = Rp 22.500,00",

      comprehend: {
        comprehendQuestion:
          "Dinding pembatas berbentuk trapesium akan dicat dengan lapisan dasar untuk persiapan mural. Jika satu kaleng cat dapat menutup 1,5 m² dengan biaya Rp 22.500,00, tentukan total biaya yang diperlukan untuk mengecat dinding (√3 = 1,73).",
        infoList: [
          "<bl>Pada trapesium ABCD, AD = DC = CB = 4m</bl>",
          "lineAreaCoveredCan",
          "lineCostCan",
          "<yl>Total biaya pengecatan dinding = ?</yl>",
        ],
        highlights: [
          "Dinding pembatas berbentuk trapesium",
          "Jika satu kaleng cat dapat menutup 1,5 m²",
          ["satu kaleng cat", "biaya Rp 22.500,00"],
          "tentukan total biaya yang diperlukan untuk mengecat dinding (√3 = 1,73)",
        ],
        highlightClasses: ["bl", "gr", "gr", "yl"],
        images: [
          "assets/compre2Anim.svg",
          "assets/compre0.svg",
          "assets/compre0.svg",
          "assets/compre0.svg",
        ],
        defaultImage: "assets/compre1Anim.svg",
        defaultInfoListItem: "<bl>ABCD adalah trapesium sama kaki</bl>",
        defaultHighlight: "Dinding pembatas berbentuk trapesium",
        nav: "Ketuk » untuk mengidentifikasi informasi 'diketahui' dalam soal.",
        navFinal: "Ketuk »",
        q: "Memvisualisasikan Soal",
      },

      splash: {
        step2: {
          image: "assets/mcq1correct.svg",
          text: "<blue>✓ Informasi dikumpulkan dari gambar.</blue><yellow>Selanjutnya - Identifikasi apa yang diwakili oleh luas sawah.</yellow>",
          belowImage:
            "<bl>Pada trapesium sama kaki ABCD, AD = DC = CB = 4m</bl>",
          dataList: [
            "lineAreaCoveredCan",
            "lineCostCan",
            "<yl>Total biaya pengecatan dinding = ?</yl>",
          ],
          nav: "Ketuk » untuk memahami bentuk lebih baik.",
        },
        step10: {
          image: "assets/compute2.svg",
          dataList: [
            "lineAreaCoveredCanWhite",
            "lineCostCanWhite",
            "<yl>Total biaya pengecatan dinding = ?</yl>",
          ],
          text: "<blue>✓ Informasi dikumpulkan dari gambar.</blue><blue>✓ Luas trapesium telah dihitung.</blue><yellow>Selanjutnya – Hitung total biaya pengecatan dinding.</yellow>",
          nav: "Ketuk » untuk menghitung total biaya pengecatan",
        },
      },

      compute2Visual: {
        image: "assets/compute2.svg",
        infoList: ["lineAreaPaintedCanWhite", "lineCostCanWhite"],
        cansInfoText: "Jumlah kaleng cat = 13,84",
      },

      step14: {
        image: "assets/final.svg",
        infoList: [
          "<bl>Pada trapesium ABCD, AD = DC = CB = 4m</bl>",
          "lineAreaCoveredCan",
          "lineCostCan",
        ],
        text: "<left>1. Uraikan dinding trapesium untuk\nmencari segitiga siku-siku\n2. Cari panjang alas dan tinggi\ntrapesium yang diperlukan\n3. Cari luas trapesium dengan\nrumus luas\n4. Cari jumlah kaleng cat yang\ndiperlukan dalam bilangan bulat.\n5. Cari total biaya pengecatan\ndengan biaya 1 kaleng dan jumlah\nkaleng yang diperlukan.</left>",
      },

      mcq: {
        title:
          "Apa yang perlu kita cari untuk mendapatkan total biaya pengecatan dinding?",
        options: ["Keliling dinding", "Panjang dinding", "Luas dinding"],
        correctIndex: 2,
        feedbacks: null,
        imagesForEachOption: null,
        defaultImage: "assets/compre0.svg",
        correctImage: "assets/mcq1Correct.svg",
        nav: "Ketuk jawaban yang benar",
        navFinal: "Ketuk » untuk merangkum sejauh ini",
      },

      onlyText: {
        step3: {
          initialText:
            "Kita membutuhkan tinggi dan\npanjang kedua alas\nuntuk menghitung\nluas trapesium.",
          finalText: "⏢ABCD tersusun dari\n∆ADE, ▭DCFE dan ∆BCF",
          q: "Gambarkan garis tegak lurus dari satu alas trapesium ke alas lainnya",
          nav: "Ketuk titik D dan C untuk menggambar garis tegak lurus ke alas AB.",
          navFinal: "Ketuk » untuk mengeksplorasi segitiga lebih lanjut",
        },
      },
      perpendiculars: {
        defaultImage: "assets/compre0.svg",
        perp1left: "assets/perp1left.svg",
        perp1right: "assets/perp1right.svg",
        perp2: "assets/perp2.svg",
      },

      mcq2: {
        title: "Apakah segitiga ADE dan BCF kongruen?",
        options: ["Ya", "Tidak"],
        correctIndex: 0,
        feedbacks: [
          "∠A = ∠B = 60°,   AD = BC = 4 m,\n∠E = ∠F = 90°.\nBerdasarkan Sd-Sd-S, segitiga kongruen!",
          "Perhatikan bahwa 2 sudut dan satu sisi sama besar pada kedua segitiga",
        ],
        defaultImage: "assets/mcq2.svg",
        correctImage: "assets/mcq2.svg",
        nav: "Ketuk jawaban yang benar",
        navFinal: "Ketuk » untuk mengeksplorasi perbandingan sisi segitiga",
      },

      mcq3: {
        title: "Berapa perbandingan sisi dalam segitiga tersebut?",
        options: [
          "1 : 1 : " + sqrt(2),
          "1 : " + sqrt(3) + " : 2",
          "1 : " + sqrt(2) + " : " + sqrt(3),
        ],
        correctIndex: 1,
        feedbacks: [
          "Perhatikan bahwa segitiga adalah segitiga istimewa 30-60-90.",
          "∠D = 30°, ∠A = 60°, ∠E = 90°.",
          "Perhatikan bahwa segitiga adalah segitiga istimewa 30-60-90.",
        ],
        defaultImage: "assets/mcq3.svg",
        correctImage: "assets/mcq3.svg",
        nav: "Ketuk jawaban yang benar",
        navFinal: "Ketuk » untuk mencari sisi segitiga",
      },

      tableStep: {
        title: "Berapa pengali untuk perbandingan, jika AD = 4m",
        headers: ["AE", "ED", "DA"],
        arrowCorrectAnswer: "2",
        arrowMaxLength: 1,
        image: "assets/tableAD.svg",
        imageAfterED: "assets/tableDE.svg",
        imageAfterAE: "assets/tableAE.svg",
        nav: "Gunakan numpad untuk memasukkan pengali perbandingan",
        navFinal: "Ketuk » untuk mencari dimensi trapesium",
      },

      mcq4: {
        title: "Berapa dimensi trapesium?",
        options: [
          `Alas: 4 m, 4 m; tinggi: 2${sqrt(3)} m`,
          `Alas: 4 m, 8 m; tinggi: 4 m`,
          `Alas: 4 m, 8 m; tinggi: 2${sqrt(3)} m`,
        ],
        correctIndex: 2,
        feedbacks: [
          "Ups, ingat, kedua segitiga kongruen. Kita harus menjumlahkan alasnya untuk alas trapesium.",
          "Ups, kita butuh tinggi tegak lurus antara alas trapesium.",
          "Karena DCFE persegi panjang, EF = 4 m, dan AB = 2 + 4 + 2 = 8m",
        ],
        defaultImage: "assets/mcq4.svg",
        imagesForEachOption: [
          "assets/mcq4opt1.svg",
          "assets/mcq4opt2.svg",
          "assets/mcq4.svg",
        ],
        nav: "Ketuk jawaban yang benar",
        navFinal: "Ketuk » untuk mencari luas trapesium",
      },

      mcq5: {
        title: "Berapa luas trapesium?",
        options: [
          `${frac(1, 2)} × ( a × b ) × h`,
          `${frac(1, 2)} × ( a + b ) × h`,
        ],
        correctIndex: 1,
        feedbacks: null,
        defaultImage: "assets/mcq5.svg",
        correctImage: "assets/mcq5.svg",
        nav: "Ketuk jawaban yang benar",
        navFinal: "Ketuk »",
      },

      compute1Config: {
        title: "Berapa luas trapesium?",
        defaultImage: "assets/mcq5.svg",
        finalImage: "assets/compute1final.svg",
        navFinal: "Ketuk » untuk merangkum sejauh ini",
        colors: {
          lightBlue: "#56C7FF",
          lightGreen: "#47D2B6",
          yellow: "#EAB308",
        },
        steps: [
          { delay: 0, row1: `${frac(1, 2)} × ( a + b ) × h`, rowsCount: 1 },
          { delay: 1000, appendRow: `${frac(1, 2)} × ( a + b ) × h` },
          {
            delay: 1500,
            highlightRow1: [{ text: "a", color: "#56C7FF" }],
            row2: `${frac(1, 2)} × ( 4 + b ) × h`,
            row2Colored: [{ text: "4", color: "#56C7FF" }],
            image: "assets/a.svg",
          },
          {
            delay: 1500,
            highlightRow1: [{ text: "b", color: "#56C7FF" }],
            row2: `${frac(1, 2)} × ( 4 + 8 ) × h`,
            row2Colored: [{ text: "8", color: "#56C7FF" }],
            image: "assets/b.svg",
          },
          {
            delay: 1500,
            highlightRow1: [{ text: "h", color: "#47D2B6" }],
            row2: `${frac(1, 2)} × ( 4 + 8 ) × 2${sqrt(3)}`,
            row2Colored: [{ text: `2${sqrt(3)}`, color: "#47D2B6" }],
            image: "assets/h.svg",
          },
          { delay: 1500, image: "assets/mcq5.svg" },
          { delay: 1500, appendRow: `${frac(1, 2)} × ( 4 + 8 ) × 2${sqrt(3)}` },
          {
            delay: 1500,
            highlightRow2: [{ text: "( 4 + 8 )", color: "#EAB308" }],
            row3: `${frac(1, 2)} × ( 12 ) × 2${sqrt(3)}`,
            row3Colored: [{ text: "12", color: "#EAB308" }],
          },
          {
            delay: 1500,
            highlightRow2: [
              { text: `${frac(1, 2)}`, color: "#FF00E6" },
              { text: "2", color: "#FF00E6" },
            ],
            row3: `12 × ${sqrt(3)}`,
          },
          {
            delay: 1500,
            highlightRow2: [{ text: `${sqrt(3)}`, color: "#EAB308" }],
            row3: "12 × 1,73",
            row3Colored: [{ text: "1,73", color: "#EAB308" }],
          },
          {
            delay: 1500,
            row3FullHighlight: true,
            row3Replace: "20,76 m²",
            image: "assets/compute1final.svg",
            final: true,
          },
        ],
      },

      mcq6: {
        title: "",
        options: [
          "Luas Dinding / Luas yang dicat 1 Kaleng",
          "Luas yang dicat 1 Kaleng / Luas Dinding",
        ],
        correctIndex: 0,
        feedbacks: null,
        defaultImage: "assets/compute2.svg",
        correctImage: "assets/compute2.svg",
        nav: "Ketuk jawaban yang benar",
        navFinal: "Ketuk »",
      },

      compute2Config: {
        title: "#kaleng cat",
        defaultImage: "assets/compute2.svg",
        navFinal: "Ketuk »",
        colors: { yellow: "#EAB308" },
        fraction: { num: "Luas Dinding", den: "Luas yang dicat 1 Kaleng" },
        steps: [
          { delay: 0, row1Fraction: true, rowsCount: 1 },
          { delay: 800, row2Fraction: true },
          {
            delay: 1500,
            highlightRow1: "numerator",
            row2Num: "20,76 m²",
            row2Den: "Luas yang dicat 1 Kaleng",
            row2ColoredNum: true,
          },
          {
            delay: 1500,
            highlightRow1: "denominator",
            row2Num: "20,76 m²",
            row2Den: "1,5 m²",
            row2ColoredDen: true,
          },
          {
            delay: 1500,
            highlightRow2Units: true,
          },
          {
            delay: 1000,
            highlightRow2Units: false,
            row2Num: "20,76",
            row2Den: "1,5",
          },
          {
            delay: 1500,
            row2Replace: "13,84",
            appendInfoText: "Jumlah kaleng cat = 13,84",
            final: true,
          },
        ],
      },

      mcq7: {
        title: "",
        options: ["13,84 × Rp 22.500,00", "14 × Rp 22.500,00"],
        correctIndex: 1,
        feedbacks: [
          "Ups! Cat hanya dapat dibeli dalam jumlah kaleng utuh!",
          "Benar! Cat hanya dapat dibeli dalam jumlah kaleng utuh! \n\n<b>Total biaya = Rp. 315.000,00</b>",
        ],
        defaultImage: "assets/compute2.svg",
        correctImage: "assets/compute2.svg",
        nav: "Ketuk opsi yang benar.",
        navFinal: "Ketuk » untuk merangkum",
      },

      steps: {
        0: {
          questionText: "",
          navText: "",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: true,
        },
        1: {
          questionText: "Menghubungkan 'yang dicari' dengan konsep matematika",
          navText: "",
          isMcq: true,
          mcqKey: "mcq",
          nextEnabled: false,
        },
        2: {
          questionText: "",
          navText: "",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true,
        },
        3: {
          questionText: "",
          navText: "",
          isOnlyText: true,
          onlyTextKey: "step3",
          isPerpendiculars: true,
          nextEnabled: false,
        },
        4: {
          questionText: "Bandingkan segitiga",
          navText: "",
          isMcq: true,
          mcqKey: "mcq2",
          nextEnabled: false,
        },
        5: {
          questionText: "Jenis segitiga apa ini",
          navText: "",
          isMcq: true,
          mcqKey: "mcq3",
          nextEnabled: false,
        },
        6: {
          questionText: "Cari panjang sisi menggunakan perbandingan sisi",
          navText: "",
          isTable: true,
          tableKey: "tableStep",
          nextEnabled: false,
        },
        7: {
          questionText: "Berapa dimensi trapesium?",
          navText: "",
          isMcq: true,
          mcqKey: "mcq4",
          nextEnabled: false,
        },
        8: {
          questionText: "Berapa luas trapesium?",
          navText: "",
          isMcq: true,
          mcqKey: "mcq5",
          nextEnabled: false,
        },
        9: {
          questionText: "Berapa luas trapesium?",
          navText: "",
          isCompute: true,
          computeKey: "compute1Config",
          nextEnabled: false,
        },
        10: {
          questionText: "",
          navText: "",
          isSplash: true,
          splashKey: "step10",
          nextEnabled: true,
        },
        11: {
          questionText:
            "Berapa kaleng cat yang dibutuhkan untuk mengecat seluruh dinding?",
          navText: "",
          isMcq: true,
          mcqKey: "mcq6",
          nextEnabled: false,
        },
        12: {
          questionText:
            "Berapa kaleng cat yang dibutuhkan untuk mengecat seluruh dinding?",
          navText: "",
          isCompute2: true,
          computeKey: "compute2Config",
          nextEnabled: false,
        },
        13: {
          questionText: "Berapa total biaya cat?",
          navText: "Ketuk opsi yang benar.",
          isMcq: true,
          mcqKey: "mcq7",
          nextEnabled: false,
        },
        14: {
          questionText: "",
          navText: "Ketuk » untuk mulai ulang.",
          hideQuestionPanel: true,
          isSummary: true,
          summaryKey: "step14",
          nextEnabled: true,
        },
      },
      labels: {
        given: "Diketahui",
        toFind: "Ditanya",
        findings: "Temuan",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;

// Build can-icon list line strings from translatable app strings (so they can be translated per language)
APP_DATA.lineAreaCoveredCan = CAN_ICON + APP_DATA.areaCoveredByCan;
APP_DATA.lineAreaPaintedCan = CAN_ICON + APP_DATA.areaPaintedByCan;
APP_DATA.lineCostCan = CAN_ICON + APP_DATA.costOfCan;
APP_DATA.lineAreaCoveredCanWhite = CAN_ICON + APP_DATA.areaCoveredByCanWhite;
APP_DATA.lineAreaPaintedCanWhite = CAN_ICON + APP_DATA.areaPaintedByCanWhite;
APP_DATA.lineCostCanWhite = CAN_ICON + APP_DATA.costOfCanWhite;
APP_DATA.listLineKeys = ["lineAreaCoveredCan", "lineCostCan", "lineAreaPaintedCan", "lineAreaCoveredCanWhite", "lineAreaPaintedCanWhite", "lineCostCanWhite"];

const decimalSymbol = decimal[current_language];
