const RULE_OPTIONS = [
  "(x, -y)",
  "(-x, y)",
  "(x, -y + 2k)",
  "(-x + 2h, y)",
  "(y, x)",
  "(-y, -x)",
];

const DATA = {
  en: {
    app: {
      title: "Reflection of a Point",
      start: {
        heading: "Reflection of a Point",
        text:
          "Let&rsquo;s practice finding image coordinates after reflection.<br>Click <y>START</y> to begin!",
        buttonText: "START",
      },
      final: {
        heading: "Great job!",
        text:
          "You can now find image coordinates after reflection across different lines.",
        buttonText: "START OVER",
      },
      labels: {
        rule: "Rule:",
        coordinatesPrompt: "Find the coordinates of the image:",
      },
      feedback: {
        coordinateWrong:
          "Oops!<br>Check the rule of reflection and try again.",
      },
      steps: {
        navText: "Tap the correct option.",
        navTextDone: "Tap &raquo; for another challenge.",
        navTextConclude: "Tap &raquo; to conclude.",
      },
      questions: [
        {
          id: "x-axis-a",
          question:
            "Find the image of <y>A(1, -3)</y> after reflection across the <y>x-axis</y>.",
          ruleOption: "(x, -y)",
          rule: {
            first: { variable: "x" },
            second: { prefix: "-", variable: "y" },
          },
          point: "(1, -3)",
          answer: "(1, 3)",
          coordinateOptions: ["(1, 3)", "(-1, 3)", "(-1, -3)", "(1, -3)"],
          hints: {
            type: "connectors",
            x: "No change",
            y: "Sign changes",
          },
        },
        {
          id: "y-axis-negative-x",
          question:
            "Find the image of <y>A(-1, 4)</y> after reflection across the <y>y-axis</y>.",
          ruleOption: "(-x, y)",
          rule: {
            first: { prefix: "-", variable: "x" },
            second: { variable: "y" },
          },
          point: "(-1, 4)",
          answer: "(1, 4)",
          coordinateOptions: ["(-1, 4)", "(1, 4)", "(-1, -4)", "(1, -4)"],
          hints: {
            type: "connectors",
            x: "Sign changes",
            y: "No change",
          },
        },
        {
          id: "y-axis-zero-y",
          question:
            "Find the image of <y>A(3, 0)</y> after reflection across the <y>y-axis</y>.",
          ruleOption: "(-x, y)",
          rule: {
            first: { prefix: "-", variable: "x" },
            second: { variable: "y" },
          },
          point: "(3, 0)",
          answer: "(-3, 0)",
          coordinateOptions: ["(3, 0)", "(0, 3)", "(-3, 0)", "(0, -3)"],
          hints: {
            type: "connectors",
            x: "Sign changes",
            y: "No change",
          },
        },
        {
          id: "line-y-equals-x",
          question:
            "Find the image of <y>A(-3, 1)</y> after reflection across the line <y>y = x</y>.",
          ruleOption: "(y, x)",
          rule: {
            first: { variable: "y" },
            second: { variable: "x" },
          },
          point: "(-3, 1)",
          answer: "(1, -3)",
          coordinateOptions: ["(-1, 3)", "(-3, 1)", "(3, -1)", "(1, -3)"],
          hints: {
            type: "swap",
            top: "coordinates are swapped",
            bottom: "Sign do not change",
          },
        },
        {
          id: "line-y-equals-negative-x",
          question:
            "Find the image of <y>A(-2, -6)</y> after reflection across the line <y>y = -x</y>.",
          ruleOption: "(-y, -x)",
          rule: {
            first: { prefix: "-", variable: "y" },
            second: { prefix: "-", variable: "x" },
          },
          point: "(-2, -6)",
          answer: "(6, 2)",
          coordinateOptions: ["(6, 2)", "(-6, -2)", "(2, 6)", "(-2, -6)"],
          hints: {
            type: "swap",
            top: "coordinates are swapped",
            bottom: "Sign changes",
          },
        },
        {
          id: "vertical-line-x-equals-4",
          question:
            "Find the image of <y>A(0, -2)</y> after reflection across the line <y>x = 4</y>.",
          ruleOption: "(-x + 2h, y)",
          rule: {
            first: { prefix: "-", variable: "x", suffix: " + 2h" },
            second: { variable: "y" },
          },
          point: "(0, -2)",
          answer: "(8, -2)",
          coordinateOptions: ["(-8, -2)", "(0, 2)", "(8, -2)", "(4, -2)"],
          hints: {
            type: "connectors",
            x: "Value Changes",
            y: "No change",
          },
        },
        {
          id: "horizontal-line-y-equals-negative-1",
          question:
            "Find the image of <y>A(3, 5)</y> after reflection across the line <y>y = -1</y>.",
          ruleOption: "(x, -y + 2k)",
          rule: {
            first: { variable: "x" },
            second: { prefix: "-", variable: "y", suffix: " + 2k" },
          },
          point: "(3, 5)",
          answer: "(3, -7)",
          coordinateOptions: ["(-3, -7)", "(3, 7)", "(-7, 3)", "(3, -7)"],
          hints: {
            type: "connectors",
            x: "No change",
            y: "Value Changes",
          },
        },
      ],
    },
  },
  id: {
    app: {
      title: "Refleksi Sebuah Titik",
      start: {
        heading: "Refleksi Sebuah Titik",
        text:
          "Mari berlatih menentukan koordinat bayangan setelah refleksi.<br>Klik <y>MULAI</y> untuk memulai!",
        buttonText: "MULAI",
      },
      final: {
        heading: "Bagus!",
        text:
          "Sekarang kamu dapat menentukan koordinat bayangan setelah refleksi terhadap berbagai garis.",
        buttonText: "MULAI LAGI",
      },
      labels: {
        rule: "Aturan:",
        coordinatesPrompt: "Tentukan koordinat bayangan:",
      },
      feedback: {
        coordinateWrong:
          "Oops!<br>Periksa aturan refleksi dan coba lagi.",
      },
      steps: {
        navText: "Ketuk opsi yang benar.",
        navTextDone: "Ketuk &raquo; untuk tantangan lainnya.",
        navTextConclude: "Ketuk &raquo; untuk menyimpulkan.",
      },
      questions: [
        {
          id: "x-axis-a",
          question:
            "Tentukan bayangan <y>A(1, -3)</y> setelah refleksi terhadap <y>sumbu-x</y>.",
          ruleOption: "(x, -y)",
          rule: {
            first: { variable: "x" },
            second: { prefix: "-", variable: "y" },
          },
          point: "(1, -3)",
          answer: "(1, 3)",
          coordinateOptions: ["(1, 3)", "(-1, 3)", "(-1, -3)", "(1, -3)"],
          hints: {
            type: "connectors",
            x: "Tidak berubah",
            y: "Tanda berubah",
          },
        },
        {
          id: "y-axis-negative-x",
          question:
            "Tentukan bayangan <y>A(-1, 4)</y> setelah refleksi terhadap <y>sumbu-y</y>.",
          ruleOption: "(-x, y)",
          rule: {
            first: { prefix: "-", variable: "x" },
            second: { variable: "y" },
          },
          point: "(-1, 4)",
          answer: "(1, 4)",
          coordinateOptions: ["(-1, 4)", "(1, 4)", "(-1, -4)", "(1, -4)"],
          hints: {
            type: "connectors",
            x: "Tanda berubah",
            y: "Tidak berubah",
          },
        },
        {
          id: "y-axis-zero-y",
          question:
            "Tentukan bayangan <y>A(3, 0)</y> setelah refleksi terhadap <y>sumbu-y</y>.",
          ruleOption: "(-x, y)",
          rule: {
            first: { prefix: "-", variable: "x" },
            second: { variable: "y" },
          },
          point: "(3, 0)",
          answer: "(-3, 0)",
          coordinateOptions: ["(3, 0)", "(0, 3)", "(-3, 0)", "(0, -3)"],
          hints: {
            type: "connectors",
            x: "Tanda berubah",
            y: "Tidak berubah",
          },
        },
        {
          id: "line-y-equals-x",
          question:
            "Tentukan bayangan <y>A(-3, 1)</y> setelah refleksi terhadap garis <y>y = x</y>.",
          ruleOption: "(y, x)",
          rule: {
            first: { variable: "y" },
            second: { variable: "x" },
          },
          point: "(-3, 1)",
          answer: "(1, -3)",
          coordinateOptions: ["(-1, 3)", "(-3, 1)", "(3, -1)", "(1, -3)"],
          hints: {
            type: "swap",
            top: "koordinat bertukar tempat",
            bottom: "Tanda tidak berubah",
          },
        },
        {
          id: "line-y-equals-negative-x",
          question:
            "Tentukan bayangan <y>A(-2, -6)</y> setelah refleksi terhadap garis <y>y = -x</y>.",
          ruleOption: "(-y, -x)",
          rule: {
            first: { prefix: "-", variable: "y" },
            second: { prefix: "-", variable: "x" },
          },
          point: "(-2, -6)",
          answer: "(6, 2)",
          coordinateOptions: ["(6, 2)", "(-6, -2)", "(2, 6)", "(-2, -6)"],
          hints: {
            type: "swap",
            top: "koordinat bertukar tempat",
            bottom: "Tanda berubah",
          },
        },
        {
          id: "vertical-line-x-equals-4",
          question:
            "Tentukan bayangan <y>A(0, -2)</y> setelah refleksi terhadap garis <y>x = 4</y>.",
          ruleOption: "(-x + 2h, y)",
          rule: {
            first: { prefix: "-", variable: "x", suffix: " + 2h" },
            second: { variable: "y" },
          },
          point: "(0, -2)",
          answer: "(8, -2)",
          coordinateOptions: ["(-8, -2)", "(0, 2)", "(8, -2)", "(4, -2)"],
          hints: {
            type: "connectors",
            x: "Nilai berubah",
            y: "Tidak berubah",
          },
        },
        {
          id: "horizontal-line-y-equals-negative-1",
          question:
            "Tentukan bayangan <y>A(3, 5)</y> setelah refleksi terhadap garis <y>y = -1</y>.",
          ruleOption: "(x, -y + 2k)",
          rule: {
            first: { variable: "x" },
            second: { prefix: "-", variable: "y", suffix: " + 2k" },
          },
          point: "(3, 5)",
          answer: "(3, -7)",
          coordinateOptions: ["(-3, -7)", "(3, 7)", "(-7, 3)", "(3, -7)"],
          hints: {
            type: "connectors",
            x: "Tidak berubah",
            y: "Nilai berubah",
          },
        },
      ],
    },
  },
};

const APP_DATA = DATA[current_language].app;
APP_DATA.ruleOptions = RULE_OPTIONS;
APP_DATA.questions.forEach((question) => {
  question.ruleOptions = RULE_OPTIONS;
  question.ruleCorrectIndex = RULE_OPTIONS.indexOf(question.ruleOption);
  question.coordinateCorrectIndex = question.coordinateOptions.indexOf(question.answer);
});
