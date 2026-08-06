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
          'A line <span id="highlight-equation" class="orange-bg">x + y = 2</span> is translated <span id="highlight-right" class="purple-bg">2 units to the right</span> and <span id="highlight-up" class="purple-bg">1 unit upward</span>. <span id="highlight-find" class="purple-bg">What is the equation of the translated line?</span>',
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
      steps: {
        1: { navTextDone: "Tap \u00bb to visualize translation" },
        2: { navTextDone: "Tap \u00bb to see how to solve this question" },
        3: { navText: "Tap \u00bb to see how to proceed" },
        4: { navText: "Tap \u00bb to see how to proceed" },
        5: { navText: "Tap \u00bb to see how to proceed" },
        6: { navTextDone: "Tap step 1" },
        7: { navText: "" },
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
          'Garis <span id="highlight-equation" class="orange-bg">x + y = 2</span> ditranslasi <span id="highlight-right" class="purple-bg">2 satuan ke kanan</span> dan <span id="highlight-up" class="purple-bg">1 satuan ke atas</span>. <span id="highlight-find" class="purple-bg">Berapakah persamaan garis hasil translasi?</span>',
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
        7: { navText: "" },
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
