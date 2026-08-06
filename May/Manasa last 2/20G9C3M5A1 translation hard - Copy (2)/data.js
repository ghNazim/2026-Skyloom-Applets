const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Translation of a Straight Line",
        text:
          "A line <y>x + y = 2</y> is translated 2 units to the right and 1 unit upward.<br>Let\u2019s see how to find the equation of the translated line.<br><br><br>Click START to begin!",
        buttonText: "START",
      },
      final: {
        heading: "",
        text:
          "You have learned how to find the equation of a translated line.",
        buttonText: "START OVER",
      },
      question: {
        text:
          'A line <span id="highlight-equation" class="orange-bg">x + y = 2</span> is <span id="highlight-translation" class="purple-bg">translated 2 units to the right and 1 unit upward</span>. <span id="highlight-find" class="purple-bg">What is the equation of the translated line?</span>',
        textPlain:
          "A line x + y = 2 is translated 2 units to the right and 1 unit upward. What is the equation of the translated line?",
      },
      graph: {
        objectLineLabel: "x+y=2",
        imageLineLabel: "",
      },
      stepCards: {
        card1InitialTitle: "To find :",
        card1Content: "Equation of the translated line",
        card2InitialTitle: "We need:",
        card2Content: "Two points on the translated line",
        card3InitialTitle: "We need:",
        card3Content: "Two points on the line before translation",
        step1Title: "Step 1: Find",
        step2Title: "Step 2: Find",
        step3Title: "Step 3: Find",
      },
      step7Placeholder: "Step 7 \u2014 coming soon",
      mathPanel: {
        line1: "Let\u2019s assume an easy value for x",
        line2X: "Let x = 0",
        line2Y: "When y = 0",
        objectPointsTitle: "Points on line before Translation",
        imagePointsTitle: "Points on the translated line",
        line3Prefix: "Translating by",
        line3Vector: "(+2, +1)",
        formulaTitle: "Equation of the line",
        objectCoord0: "(0, 2)",
        objectCoord1: "(2, 0)",
        imageCoord0: "(2, 3)",
        imageCoord1: "(4, 1)",
      },
      steps: {
        1: { navTextDone: "Tap \u00bb to visualize translation" },
        2: { navTextDone: "Tap \u00bb to see how to solve this question" },
        3: { navText: "Tap \u00bb to see how to proceed" },
        4: { navText: "Tap \u00bb to see how to proceed" },
        5: { navText: "Tap \u00bb to see how to proceed" },
        6: { navTextDone: "Tap step 1" },
        7: {
          navText: "",
          navTapX: "Tap \u2018x\u2019 to substitute value",
          navTapY: "Tap \u2018y\u2019 to substitute value",
          navTapEquation: "Tap the equation to simplify and find the point",
          navTapStep2: "Tap Step 2",
        },
        8: {
          navTapPoints: "Tap each point to translate",
          navTapStep3: "Tap Step 3",
        },
        9: {
          navTapPoints: "Tap the points to name it",
          navTapSubstitute: "Tap the equation to substitute the values",
          navTapSimplify: "Tap the highlighted box to simplify",
          navTapNext: "Tap \u00bb to draw the line",
        },
      },
      colors: {
        object: "#fb9b5b",
        image: "#46c5ce",
        transformation: "#bd78dd",
        pointPink: "#e85d8a",
        pointWhite: "#ffffff",
      },
      translation: {
        dx: 2,
        dy: 1,
      },
      linePoints: [
        { x: -3, y: 5 },
        { x: -2, y: 4 },
        { x: -1, y: 3 },
        { x: 0, y: 2 },
        { x: 1, y: 1 },
        { x: 2, y: 0 },
        { x: 3, y: -1 },
        { x: 4, y: -2 },
      ],
      imagePoints: [
        { x: 4, y: 1 },
        { x: 2, y: 3 },
      ],
      objectPoints: [
        { x: 2, y: 0 },
        { x: 0, y: 2 },
      ],
    },
  },
  id: {
    app: {
      start: {
        heading: "Translasi Garis Lurus",
        text:
          "Garis <y>x + y = 2</y> ditranslasi 2 satuan ke kanan dan 1 satuan ke atas.<br>Mari kita lihat cara mencari persamaan garis hasil translasi.<br><br><br>Ketuk MULAI untuk memulai!",
        buttonText: "MULAI",
      },
      final: {
        heading: "",
        text:
          "Kamu telah belajar cara mencari persamaan garis hasil translasi.",
        buttonText: "MULAI LAGI",
      },
      question: {
        text:
          'Garis <span id="highlight-equation" class="orange-bg">x + y = 2</span> <span id="highlight-translation" class="purple-bg">ditranslasi 2 satuan ke kanan dan 1 satuan ke atas</span>. <span id="highlight-find" class="purple-bg">Berapakah persamaan garis hasil translasi?</span>',
        textPlain:
          "Garis x + y = 2 ditranslasi 2 satuan ke kanan dan 1 satuan ke atas. Berapakah persamaan garis hasil translasi?",
      },
      graph: {
        objectLineLabel: "x+y=2",
        imageLineLabel: "",
      },
      stepCards: {
        card1InitialTitle: "Untuk mencari :",
        card1Content: "Persamaan garis hasil translasi",
        card2InitialTitle: "Kita perlu:",
        card2Content: "Dua titik pada garis hasil translasi",
        card3InitialTitle: "Kita perlu:",
        card3Content: "Dua titik pada garis sebelum translasi",
        step1Title: "Langkah 1: Cari",
        step2Title: "Langkah 2: Cari",
        step3Title: "Langkah 3: Cari",
      },
      step7Placeholder: "Langkah 7 \u2014 segera hadir",
      mathPanel: {
        line1: "Mari kita asumsikan nilai x yang mudah",
        line2X: "Misalkan x = 0",
        line2Y: "Ketika y = 0",
        objectPointsTitle: "Titik pada garis sebelum translasi",
        imagePointsTitle: "Titik pada garis hasil translasi",
        line3Prefix: "Mentranslasi dengan",
        line3Vector: "(+2, +1)",
        formulaTitle: "Persamaan garis",
        objectCoord0: "(0, 2)",
        objectCoord1: "(2, 0)",
        imageCoord0: "(2, 3)",
        imageCoord1: "(4, 1)",
      },
      steps: {
        1: { navTextDone: "Ketuk \u00bb untuk memvisualisasikan translasi" },
        2: {
          navTextDone:
            "Ketuk \u00bb untuk melihat cara menyelesaikan soal ini",
        },
        3: { navText: "Ketuk \u00bb untuk melihat cara melanjutkan" },
        4: { navText: "Ketuk \u00bb untuk melihat cara melanjutkan" },
        5: { navText: "Ketuk \u00bb untuk melihat cara melanjutkan" },
        6: { navTextDone: "Ketuk langkah 1" },
        7: {
          navText: "",
          navTapX: "Ketuk \u2018x\u2019 untuk mensubstitusi nilai",
          navTapY: "Ketuk \u2018y\u2019 untuk mensubstitusi nilai",
          navTapEquation:
            "Ketuk persamaan untuk menyederhanakan dan mencari titik",
          navTapStep2: "Ketuk Langkah 2",
        },
        8: {
          navTapPoints: "Ketuk setiap titik untuk mentranslasikan",
          navTapStep3: "Ketuk Langkah 3",
        },
        9: {
          navTapPoints: "Ketuk titik untuk menamai",
          navTapSubstitute: "Ketuk persamaan untuk mensubstitusi nilai",
          navTapSimplify: "Ketuk kotak yang disorot untuk menyederhanakan",
          navTapNext: "Ketuk \u00bb untuk menggambar garis",
        },
      },
      colors: {
        object: "#fb9b5b",
        image: "#46c5ce",
        transformation: "#bd78dd",
        pointPink: "#e85d8a",
        pointWhite: "#ffffff",
      },
      translation: {
        dx: 2,
        dy: 1,
      },
      linePoints: [
        { x: -3, y: 5 },
        { x: -2, y: 4 },
        { x: -1, y: 3 },
        { x: 0, y: 2 },
        { x: 1, y: 1 },
        { x: 2, y: 0 },
        { x: 3, y: -1 },
        { x: 4, y: -2 },
      ],
      imagePoints: [
        { x: 4, y: 1 },
        { x: 2, y: 3 },
      ],
      objectPoints: [
        { x: 2, y: 0 },
        { x: 0, y: 2 },
      ],
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];