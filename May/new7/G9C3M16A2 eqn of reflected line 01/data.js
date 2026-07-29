const RULE_OPTIONS = [
  "(x, -y)",
  "(-x, y)",
  "(x, -y + 2k)",
  "(-x + 2h, y)",
  "(y, x)",
  "(-y, -x)",
];

const SHARED_EN = {
  title: "Equation of Image of Reflected Line",
  start: {
    heading: "Equation of Image of Reflected Line",
    text: "Let&rsquo;s explore how to find the equation of<br>the image of a reflected line when two points on the line are given,<br>using the two&hyphen;point form of the equation of a line.<br>Click <y>START</y> to begin!",
    buttonText: "START",
  },
  complete: {
    heading: "Activity Completed!",
    text:
      "Great job!<br>You can now find the equation of the reflected line<br>using 2&hyphen;point form of equation of a line.<br><br>Just substitute the coordinates of points on the line in the 2&hyphen;point form<br> of equation and simplify that equation.<br><br>Click <y>START OVER</y> to re&hyphen;do this activity!",
    buttonText: "START OVER",
  },
  ruleLabel: "Rule:",
  coordPrompt: "Find the coordinates of the image:",
  step2Shared: {
    coordTitle: "Coordinates of points on line A\u2032B\u2032.",
    coordTextA: "A\u2032(",
    coordTextB: "B\u2032(",
    coordAnd: " and ",
    formulaTitle: "Two point form of equation of a line:",
    rightText:
      "Let\u2019s substitute<br>the coordinates of image points<br>in <bl>2\u2010point form</bl> of equation of<br>the line.",
    substituteBtn: "Substitute",
    rightTextAfter:
      "Now, simplify this equation in<br>the form of",
    rightTextAfterEnd: "to get the equation of the line.",
  },
  step3Shared: {
    headingLeft: "Finding equation of the line A\u2032B\u2032.",
    formulaTitle: "Two point form of equation of a line:",
    simplifyTitle: "Simplify the above equation in the form:",
    mcqTitle: "The simplified form of the given<br>equation is:",
    feedbackWrong:
      "Oops! That\u2019s not correct.<br>Simplify and try again!",
  },
  nav: {
    tapOption: "Tap the correct option.",
    tapNext: "Tap &raquo; to continue.",
    tapSubstitute: "Tap Substitute",
    tapVisualize: "Tap &raquo; to visualise the reflection.",
    tapChallenge: "Tap &raquo; for another challenge.",
    tapSummarize: "Tap &raquo; to summarize.",
  },
  feedback: {
    coordinateWrong:
      "Oops!<br>Check the rule of reflection and try again.",
  },
};

const SHARED_ID = {
  title: "Persamaan Bayangan Garis Refleksi",
  start: {
    heading: "Persamaan Bayangan Garis Refleksi",
    text: "Mari kita pelajari cara mencari persamaan<br>bayangan garis yang direfleksikan ketika dua titik pada garis diberikan,<br>menggunakan rumus dua titik persamaan garis.<br>Klik <y>MULAI</y> untuk memulai!",
    buttonText: "MULAI",
  },
  complete: {
    heading: "Aktivitas Selesai!",
    text:
      "Bagus!<br>Anda sekarang dapat mencari persamaan garis refleksi<br>menggunakan rumus dua titik persamaan garis.<br><br>Substitusikan koordinat titik-titik pada garis ke dalam rumus dua titik dan<br> sederhanakan persamaan tersebut.<br><br>Klik <y>MULAI LAGI</y> untuk mengulang aktivitas ini!",
    buttonText: "MULAI LAGI",
  },
  ruleLabel: "Aturan:",
  coordPrompt: "Tentukan koordinat bayangan:",
  step2Shared: {
    coordTitle: "Koordinat titik-titik pada garis A\u2032B\u2032.",
    coordTextA: "A\u2032(",
    coordTextB: "B\u2032(",
    coordAnd: " dan ",
    formulaTitle: "Rumus dua titik persamaan garis:",
    rightText:
      "Mari substitusikan<br>koordinat titik-titik bayangan<br>ke dalam <bl>rumus dua titik</bl> persamaan<br>garis.",
    substituteBtn: "Substitusi",
    rightTextAfter:
      "Sekarang, sederhanakan persamaan ini<br>dalam bentuk",
    rightTextAfterEnd: "untuk mendapatkan persamaan garis.",
  },
  step3Shared: {
    headingLeft: "Mencari persamaan garis A\u2032B\u2032.",
    formulaTitle: "Rumus dua titik persamaan garis:",
    simplifyTitle: "Sederhanakan persamaan di atas dalam bentuk:",
    mcqTitle: "Bentuk sederhana dari persamaan<br>tersebut adalah:",
    feedbackWrong:
      "Oops! Tidak benar.<br>Sederhanakan dan coba lagi!",
  },
  nav: {
    tapOption: "Ketuk opsi yang benar.",
    tapNext: "Ketuk &raquo; untuk melanjutkan.",
    tapSubstitute: "Ketuk Substitusi",
    tapVisualize: "Ketuk &raquo; untuk memvisualisasikan refleksi.",
    tapChallenge: "Ketuk &raquo; untuk tantangan lainnya.",
    tapSummarize: "Ketuk &raquo; untuk merangkum.",
  },
  feedback: {
    coordinateWrong:
      "Oops!<br>Periksa aturan refleksi dan coba lagi.",
  },
};

const PROBLEMS_EN = [
  {
    question:
      "Line AB passes through the points <y>A(3, 5)</y> and <y>B(4, -2)</y>. Find the equation of the image of line AB after reflection across the <y>y-axis</y>.",
    rulePromptFull:
      "What is the <y>rule of reflection</y> across <y>y-axis</y>?",
    ruleOption: "(-x, y)",
    rule: {
      first: { prefix: "-", variable: "x" },
      second: { variable: "y" },
    },
    pointA: "A(3, 5)",
    pointB: "B(4, -2)",
    imageA: "A\u2032(-3, 5)",
    imageAShort: "(-3, 5)",
    imageAX: "-3",
    imageAY: "5",
    imageB: "B\u2032(-4, -2)",
    imageBShort: "(-4, -2)",
    imageBX: "-4",
    imageBY: "-2",
    coordOptionsA: ["(3, 5)", "(-3, 5)", "(3, -5)", "(-3, -5)"],
    coordCorrectIndexA: 1,
    coordOptionsB: ["(4, 2)", "(-4, 2)", "(4, -2)", "(-4, -2)"],
    coordCorrectIndexB: 3,
    hints: {
      type: "connectors",
      x: "Sign changes",
      y: "No change",
    },
    step2: {
      headingLeft: "Finding equation of the line A\u2032B\u2032.",
    },
    subst: {
      xUseDblNeg: true,
      xNumSubUsesDblNeg: true,
      xNumSubResult: "3",
      xDenUsesDblNeg: true,
      xDenVal2: "\u22124",
      xDenVal1: "3",
      xDenResult: "\u22121",
      yNumSub: "5",
      yDenVal2: "\u22122",
      yDenVal1: "5",
      yDenResult: "\u22127",
    },
    step3Formula: {
      leftNumOp: "+",
      leftNumVal: "3",
      leftDen: "\u22121",
      rightNumOp: "\u2212",
      rightNumVal: "5",
      rightDen: "\u22127",
    },
    step3: {
      options: ["7x \u2212 y = \u221226", "x \u2212 7y = \u221226", "7x \u2212 y = 8"],
      correctIndex: 0,
      feedbackCorrect:
        "That\u2019s correct.<br>7x \u2212 y = \u221226 is the equation<br>of the reflection of line AB.",
    },
    step4: {
      headingLeft: "Reflection of line AB across <y>y\u2212axis</y>.",
      rightText:
        "Line <y>A\u2032B\u2032</y><br>is the image of<br>line <y>AB</y><br>after reflection across <y>y-axis</y>.",
      equationLabel: "7x \u2212 y = \u221226",
      highlightYAxis: true,
    },
    graph: {
      A: { x: 3, y: 5, labelPlacement: "right" },
      B: { x: 4, y: -2, labelPlacement: "right" },
      Aprime: { x: -3, y: 5, labelPlacement: "left" },
      Bprime: { x: -4, y: -2, labelPlacement: "right" },
    },
  },
  {
    question:
      "Line AB passes through the points <y>A(1, 6)</y> and <y>B(-3, 2)</y>. Find the equation of the image of line AB after reflection across the line <y>y = x</y>.",
    rulePromptFull:
      "What is the <y>rule of reflection</y> across <y>y = x</y>?",
    ruleOption: "(y, x)",
    rule: {
      first: { variable: "y" },
      second: { variable: "x" },
    },
    pointA: "A(1, 6)",
    pointB: "B(-3, 2)",
    imageA: "A\u2032(6, 1)",
    imageAShort: "(6, 1)",
    imageAX: "6",
    imageAY: "1",
    imageB: "B\u2032(2, -3)",
    imageBShort: "(2, -3)",
    imageBX: "2",
    imageBY: "-3",
    coordOptionsA: ["(1, 6)", "(6, 1)", "(-6, 1)", "(6, -1)"],
    coordCorrectIndexA: 1,
    coordOptionsB: ["(-3, 2)", "(2, -3)", "(-2, 3)", "(2, 3)"],
    coordCorrectIndexB: 1,
    hints: {
      type: "labels",
      y: "Coordinates swapped",
      x: "No sign change",
    },
    step2: {
      headingLeft: "Finding equation of the line A\u2032B\u2032.",
    },
    subst: {
      xUseDblNeg: false,
      xNumSubUsesDblNeg: false,
      xNumSub: "6",
      xDenVal2: "2",
      xDenVal1: "6",
      xDenResult: "\u22124",
      yNumSub: "1",
      yDenVal2: "\u22123",
      yDenVal1: "1",
      yDenResult: "\u22124",
    },
    step3Formula: {
      leftNumOp: "\u2212",
      leftNumVal: "6",
      leftDen: "\u22124",
      rightNumOp: "\u2212",
      rightNumVal: "1",
      rightDen: "\u22124",
    },
    step3: {
      options: ["y = x \u2212 5", "y = x + 5", "x \u2212 y = \u22125"],
      correctIndex: 0,
      feedbackCorrect:
        "That\u2019s correct.<br>y = x \u2212 5 is the equation<br>of the reflection of line AB.",
    },
    step4: {
      headingLeft: "Reflection of line AB across <y>y = x</y>.",
      rightText:
        "Line <y>A\u2032B\u2032</y><br>is the image of<br>line <y>AB</y><br>after reflection across <y>y = x</y>.",
      equationLabel: "y = x \u2212 5",
      highlightYAxis: false,
      reflectionAxisLine: {
        through: [
          { x: 0, y: 0 },
          { x: 1, y: 1 },
        ],
        strokeWidth: 3.5,
      },
    },
    graph: {
      A: { x: 1, y: 6, labelPlacement: "right" },
      B: { x: -3, y: 2, labelPlacement: "left" },
      Aprime: { x: 6, y: 1, labelPlacement: "right" },
      Bprime: { x: 2, y: -3, labelPlacement: "right" },
    },
    graphConfig: {
      cols: 17,
      rows: 11,
      unit: 44,
      padLeft: 40,
      padRight: 40,
      padTop: 28,
      padBottom: 32,
      xLabelFontSize: 18,
      yLabelFontSize: 18,
      axisNameFontSize: 27,
      pointRadius: 9,
      pointLabelFontSize: 21,
      equationLabelFontSize: 32,
      pointLabelOffsetY: 21,
      pointLabelOffsetYBelow: 25,
      xMin: -8,
      xMax: 9,
      yMin: -4,
      yMax: 7,
      xLabelSkip: [-8, 9],
      yLabelSkip: [-4, 7],
      xAxisName: "x",
      yAxisName: "y",
    },
  },
];

const PROBLEMS_ID = [
  {
    question:
      "Garis AB melalui titik <y>A(3, 5)</y> dan <y>B(4, -2)</y>. Tentukan persamaan bayangan garis AB setelah refleksi terhadap <y>sumbu-y</y>.",
    rulePromptFull:
      "Apa <y>aturan refleksi</y> terhadap <y>sumbu-y</y>?",
    ruleOption: "(-x, y)",
    rule: {
      first: { prefix: "-", variable: "x" },
      second: { variable: "y" },
    },
    pointA: "A(3, 5)",
    pointB: "B(4, -2)",
    imageA: "A\u2032(-3, 5)",
    imageAShort: "(-3, 5)",
    imageAX: "-3",
    imageAY: "5",
    imageB: "B\u2032(-4, -2)",
    imageBShort: "(-4, -2)",
    imageBX: "-4",
    imageBY: "-2",
    coordOptionsA: ["(3, 5)", "(-3, 5)", "(3, -5)", "(-3, -5)"],
    coordCorrectIndexA: 1,
    coordOptionsB: ["(4, 2)", "(-4, 2)", "(4, -2)", "(-4, -2)"],
    coordCorrectIndexB: 3,
    hints: {
      type: "connectors",
      x: "Tanda berubah",
      y: "Tidak berubah",
    },
    step2: {
      headingLeft: "Mencari persamaan garis A\u2032B\u2032.",
    },
    subst: {
      xUseDblNeg: true,
      xNumSubUsesDblNeg: true,
      xNumSubResult: "3",
      xDenUsesDblNeg: true,
      xDenVal2: "\u22124",
      xDenVal1: "3",
      xDenResult: "\u22121",
      yNumSub: "5",
      yDenVal2: "\u22122",
      yDenVal1: "5",
      yDenResult: "\u22127",
    },
    step3Formula: {
      leftNumOp: "+",
      leftNumVal: "3",
      leftDen: "\u22121",
      rightNumOp: "\u2212",
      rightNumVal: "5",
      rightDen: "\u22127",
    },
    step3: {
      options: ["7x \u2212 y = \u221226", "x \u2212 7y = \u221226", "7x \u2212 y = 8"],
      correctIndex: 0,
      feedbackCorrect:
        "Benar.<br>7x \u2212 y = \u221226 adalah persamaan<br>refleksi garis AB.",
    },
    step4: {
      headingLeft: "Refleksi garis AB terhadap <y>sumbu-y</y>.",
      rightText:
        "Garis <y>A\u2032B\u2032</y><br>adalah bayangan<br>garis <y>AB</y><br>setelah refleksi terhadap <y>sumbu-y</y>.",
      equationLabel: "7x \u2212 y = \u221226",
      highlightYAxis: true,
    },
    graph: {
      A: { x: 3, y: 5, labelPlacement: "right" },
      B: { x: 4, y: -2, labelPlacement: "right" },
      Aprime: { x: -3, y: 5, labelPlacement: "left" },
      Bprime: { x: -4, y: -2, labelPlacement: "right" },
    },
  },
  {
    question:
      "Garis AB melalui titik <y>A(1, 6)</y> dan <y>B(-3, 2)</y>. Tentukan persamaan bayangan garis AB setelah refleksi terhadap garis <y>y = x</y>.",
    rulePromptFull:
      "Apa <y>aturan refleksi</y> terhadap <y>y = x</y>?",
    ruleOption: "(y, x)",
    rule: {
      first: { variable: "y" },
      second: { variable: "x" },
    },
    pointA: "A(1, 6)",
    pointB: "B(-3, 2)",
    imageA: "A\u2032(6, 1)",
    imageAShort: "(6, 1)",
    imageAX: "6",
    imageAY: "1",
    imageB: "B\u2032(2, -3)",
    imageBShort: "(2, -3)",
    imageBX: "2",
    imageBY: "-3",
    coordOptionsA: ["(1, 6)", "(6, 1)", "(-6, 1)", "(6, -1)"],
    coordCorrectIndexA: 1,
    coordOptionsB: ["(-3, 2)", "(2, -3)", "(-2, 3)", "(2, 3)"],
    coordCorrectIndexB: 1,
    hints: {
      type: "labels",
      y: "Koordinat ditukar",
      x: "Tidak ada perubahan tanda",
    },
    step2: {
      headingLeft: "Mencari persamaan garis A\u2032B\u2032.",
    },
    subst: {
      xUseDblNeg: false,
      xNumSubUsesDblNeg: false,
      xNumSub: "6",
      xDenVal2: "2",
      xDenVal1: "6",
      xDenResult: "\u22124",
      yNumSub: "1",
      yDenVal2: "\u22123",
      yDenVal1: "1",
      yDenResult: "\u22124",
    },
    step3Formula: {
      leftNumOp: "\u2212",
      leftNumVal: "6",
      leftDen: "\u22124",
      rightNumOp: "\u2212",
      rightNumVal: "1",
      rightDen: "\u22124",
    },
    step3: {
      options: ["y = x \u2212 5", "y = x + 5", "x \u2212 y = \u22125"],
      correctIndex: 0,
      feedbackCorrect:
        "Benar.<br>y = x \u2212 5 adalah persamaan<br>refleksi garis AB.",
    },
    step4: {
      headingLeft: "Refleksi garis AB terhadap <y>y = x</y>.",
      rightText:
        "Garis <y>A\u2032B\u2032</y><br>adalah bayangan<br>garis <y>AB</y><br>setelah refleksi terhadap <y>y = x</y>.",
      equationLabel: "y = x \u2212 5",
      highlightYAxis: false,
      reflectionAxisLine: {
        through: [
          { x: 0, y: 0 },
          { x: 1, y: 1 },
        ],
        strokeWidth: 3.5,
      },
    },
    graph: {
      A: { x: 1, y: 6, labelPlacement: "right" },
      B: { x: -3, y: 2, labelPlacement: "left" },
      Aprime: { x: 6, y: 1, labelPlacement: "right" },
      Bprime: { x: 2, y: -3, labelPlacement: "right" },
    },
    graphConfig: {
      cols: 17,
      rows: 11,
      unit: 44,
      padLeft: 40,
      padRight: 40,
      padTop: 28,
      padBottom: 32,
      xLabelFontSize: 18,
      yLabelFontSize: 18,
      axisNameFontSize: 27,
      pointRadius: 9,
      pointLabelFontSize: 21,
      equationLabelFontSize: 32,
      pointLabelOffsetY: 21,
      pointLabelOffsetYBelow: 25,
      xMin: -8,
      xMax: 9,
      yMin: -4,
      yMax: 7,
      xLabelSkip: [-8, 9],
      yLabelSkip: [-4, 7],
      xAxisName: "x",
      yAxisName: "y",
    },
  },
];

const DATA = {
  en: { shared: SHARED_EN, problems: PROBLEMS_EN },
  id: { shared: SHARED_ID, problems: PROBLEMS_ID },
};

const PROBLEMS = DATA[current_language].problems;
const SHARED = DATA[current_language].shared;

const APP_DATA = Object.assign({}, SHARED);

function mergeProblemIntoAppData(problem) {
  Object.assign(APP_DATA, problem);
  APP_DATA.step2 = Object.assign({}, SHARED.step2Shared, problem.step2);
  APP_DATA.step3 = Object.assign({}, SHARED.step3Shared, problem.step3);
  APP_DATA.ruleOptions = RULE_OPTIONS;
  APP_DATA.ruleCorrectIndex = RULE_OPTIONS.indexOf(APP_DATA.ruleOption);
}

function setActiveProblem(index) {
  APP_DATA.problemIndex = index;
  mergeProblemIntoAppData(PROBLEMS[index]);
}

setActiveProblem(0);
