const RULE_OPTIONS = [
  "(x, -y)",
  "(-x, y)",
  "(x, -y + 2h)",
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
      "Question 1. Line AB passes through the points <y>A(6, 2)</y> and <y>B(3, -4)</y>. Find the equation of the image of line AB after reflection across the <y>y-axis</y>.",
    rulePromptFull:
      "What is the <y>rule of reflection</y> across <y>y-axis</y>?",
    ruleOption: "(-x, y)",
    rule: {
      first: { prefix: "-", variable: "x" },
      second: { variable: "y" },
    },
    pointA: "A(6, 2)",
    pointB: "B(3, -4)",
    imageA: "A\u2032(-6, 2)",
    imageAShort: "(-6, 2)",
    imageAX: "-6",
    imageAY: "2",
    imageB: "B\u2032(-3, -4)",
    imageBShort: "(-3, -4)",
    imageBX: "-3",
    imageBY: "-4",
    coordOptionsA: ["(6, 2)", "(-6, 2)", "(6, -2)", "(-6, -2)"],
    coordCorrectIndexA: 1,
    coordOptionsB: ["(3, 4)", "(-3, 4)", "(3, -4)", "(-3, -4)"],
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
      xNumSubResult: "6",
      xDenUsesDblNeg: true,
      xDenVal2: "\u22123",
      xDenVal1: "6",
      xDenResult: "3",
      yNumSub: "2",
      yDenVal2: "\u22124",
      yDenVal1: "2",
      yDenResult: "\u22126",
    },
    step3Formula: {
      leftNumOp: "+",
      leftNumVal: "6",
      leftDen: "3",
      rightNumOp: "\u2212",
      rightNumVal: "2",
      rightDen: "\u22126",
    },
    step3: {
      options: ["2x + y + 10 = 0", "2x \u2212 y = 10", "x + 2y + 10 = 0"],
      correctIndex: 0,
      feedbackCorrect:
        "That\u2019s correct.<br>2x + y + 10 = 0 is the equation<br>of the reflection of line AB.",
    },
    step4: {
      headingLeft: "Reflection of line AB across <y>y\u2212axis</y>.",
      rightText:
        "Line <y>A\u2032B\u2032</y><br>is the image of<br>line <y>AB</y><br>after reflection across <br><y>y-axis</y>.",
      abEquationLabel: "2x \u2212 y = 10",
      abLabelOffset: 20,
      abLabelAngleOffset: 0,
      equationLabelAngleOffset: 180,
      equationLabel: "2x + y + 10 = 0",
      highlightYAxis: true,
    },
    graph: {
      A: { x: 6, y: 2, labelPlacement: "right" },
      B: { x: 3, y: -4, labelPlacement: "right" },
      Aprime: { x: -6, y: 2, labelPlacement: "left" },
      Bprime: { x: -3, y: -4, labelPlacement: "left" },
    },
    graphConfigKey: "q1",
  },
  {
    question:
      "Line AB passes through the points <y>A(2, -2)</y> and <y>B(3, -4)</y>. Find the equation of the image of line AB after reflection across the line <y>y = x</y>.",
    rulePromptFull:
      "What is the <y>rule of reflection</y> across <y>y = x</y>?",
    ruleOption: "(y, x)",
    rule: {
      first: { variable: "y" },
      second: { variable: "x" },
    },
    pointA: "A(2, -2)",
    pointB: "B(3, -4)",
    imageA: "A\u2032(-2, 2)",
    imageAShort: "(-2, 2)",
    imageAX: "-2",
    imageAY: "2",
    imageB: "B\u2032(-4, 3)",
    imageBShort: "(-4, 3)",
    imageBX: "-4",
    imageBY: "3",
    coordOptionsA: ["(2, -2)", "(-2, 2)", "(2, 2)", "(-2, -2)"],
    coordCorrectIndexA: 1,
    coordOptionsB: ["(3, -4)", "(-3, 4)", "(4, -3)", "(-4, 3)"],
    coordCorrectIndexB: 3,
    hints: {
      type: "labels",
      y: "Coordinates swapped",
      x: "No sign change",
    },
    step2: {
      headingLeft: "Finding equation of the line A\u2032B\u2032.",
    },
    subst: {
      xUseDblNeg: true,
      xNumSubUsesDblNeg: true,
      xNumSubResult: "2",
      xDenUsesDblNeg: true,
      xDenVal2: "\u22124",
      xDenVal1: "2",
      xDenResult: "\u22122",
      yNumSub: "2",
      yDenVal2: "3",
      yDenVal1: "2",
      yDenResult: "1",
    },
    step3Formula: {
      leftNumOp: "+",
      leftNumVal: "2",
      leftDen: "\u22122",
      rightNumOp: "\u2212",
      rightNumVal: "2",
      rightDen: "1",
    },
    step3: {
      options: ["x + 2y = 2", "2x + y = 2", "x \u2212 2y = 2"],
      correctIndex: 0,
      feedbackCorrect:
        "That\u2019s correct.<br>x + 2y = 2 is the equation<br>of the reflection of line AB.",
    },
    step4: {
      headingLeft: "Reflection of line AB across <y>y = x</y>.",
      rightText:
        "Line <y>A\u2032B\u2032</y><br>is the image of<br>line <y>AB</y><br>after reflection across <y>y = x</y>.",
      abEquationLabel: "2x + y = 2",
      abLabelOffset: -28,
      abLabelAngleOffset: 180,
      abLabelAtThroughMidpoint: true,
      equationLabel: "x + 2y = 2",
      equationLabelAtThroughMidpoint: true,
      highlightYAxis: false,
      reflectionAxisLine: {
        through: [
          { x: 0, y: 0 },
          { x: 1, y: 1 },
        ],
        strokeWidth: 3.5,
        equationLabel: "y = x",
        labelAngleOffset: 180,
        labelPositionRatio: 0.25,
      },
    },
    graph: {
      A: { x: 2, y: -2, labelPlacement: "right" },
      B: { x: 3, y: -4, labelPlacement: "right" },
      Aprime: { x: -2, y: 2, labelPlacement: "left" },
      Bprime: { x: -4, y: 3, labelPlacement: "left" },
    },
    graphConfigKey: "q2",
  },
  {
    question:
      "Line AB passes through the points <y>A(2, 4)</y> and <y>B(3, 6)</y>. Find the equation of the image of line AB after reflection across the line <y>y = 2</y>.",
    rulePromptFull:
      "What is the <y>rule of reflection</y> across <y>y = 2</y>?",
    ruleOption: "(x, -y + 2h)",
    rule: {
      first: { variable: "x" },
      second: { prefix: "-", variable: "y", suffix: " + 2h" },
    },
    pointA: "A(2, 4)",
    pointB: "B(3, 6)",
    imageA: "A\u2032(2, 0)",
    imageAShort: "(2, 0)",
    imageAX: "2",
    imageAY: "0",
    imageB: "B\u2032(3, -2)",
    imageBShort: "(3, -2)",
    imageBX: "3",
    imageBY: "-2",
    coordOptionsA: ["(2, 4)", "(2, -4)", "(2, 0)", "(-2, 0)"],
    coordCorrectIndexA: 2,
    coordOptionsB: ["(3, -2)", "(-3, -2)", "(3, 2)", "(3, -6)"],
    coordCorrectIndexB: 0,
    hints: {
      type: "connectors",
      y: "Change sign \n and add 2h",
      x: "No change",
    },
    step2: {
      headingLeft: "Finding equation of the line A\u2032B\u2032.",
    },
    subst: {
      xUseDblNeg: false,
      xNumSubUsesDblNeg: false,
      xNumSub: "2",
      xDenVal2: "3",
      xDenVal1: "2",
      xDenResult: "1",
      yNumSub: "0",
      yNumSimplifyTo: "y",
      yDenVal2: "\u22122",
      yDenVal1: "0",
      yDenResult: "\u22122",
    },
    step3Formula: {
      leftNumOp: "\u2212",
      leftNumVal: "2",
      leftDen: "1",
      rightNumOp: "",
      rightNumVal: "",
      rightDen: "\u22122",
    },
    step3: {
      options: ["2x + y = 4", "2x \u2212 y = 4", "x + 2y = 4"],
      correctIndex: 0,
      feedbackCorrect:
        "That\u2019s correct.<br>2x + y = 4 is the equation<br>of the reflection of line AB.",
    },
    step4: {
      headingLeft: "Reflection of line AB across <y>y = 2</y>.",
      rightText:
        "Line <y>A\u2032B\u2032</y><br>is the image of<br>line <y>AB</y><br>after reflection across <br><y>y = 2</y>.",
      abEquationLabel: "y = 2x",
      abLabelOffset: 28,
      abLabelAtThroughMidpoint: true,
      equationLabel: "2x + y = 4",
      equationLabelAtThroughMidpoint: true,
      highlightYAxis: false,
      equationLabelAngleOffset: 180,
      abLabelAngleOffset: 180,
      
      reflectionAxisLine: {
        through: [
          { x: 0, y: 2 },
          { x: 1, y: 2 },
        ],
        strokeWidth: 3.5,
        equationLabel: "y = 2",
        labelAngleOffset: 180,
        labelOffset: 20,
        labelPositionRatio: 0.25,
      },
    },
    graph: {
      A: { x: 2, y: 4, labelPlacement: "right" },
      B: { x: 3, y: 6, labelPlacement: "right" },
      Aprime: { x: 2, y: 0, labelPlacement: "right" },
      Bprime: { x: 3, y: -2, labelPlacement: "right" },
    },
    graphConfigKey: "q3",
  },
];

const PROBLEMS_ID = [
  {
    question:
      "Soal 1. Garis AB melalui titik <y>A(6, 2)</y> dan <y>B(3, -4)</y>. Tentukan persamaan bayangan garis AB setelah refleksi terhadap <y>sumbu-y</y>.",
    rulePromptFull:
      "Apa <y>aturan refleksi</y> terhadap <y>sumbu-y</y>?",
    ruleOption: "(-x, y)",
    rule: {
      first: { prefix: "-", variable: "x" },
      second: { variable: "y" },
    },
    pointA: "A(6, 2)",
    pointB: "B(3, -4)",
    imageA: "A\u2032(-6, 2)",
    imageAShort: "(-6, 2)",
    imageAX: "-6",
    imageAY: "2",
    imageB: "B\u2032(-3, -4)",
    imageBShort: "(-3, -4)",
    imageBX: "-3",
    imageBY: "-4",
    coordOptionsA: ["(6, 2)", "(-6, 2)", "(6, -2)", "(-6, -2)"],
    coordCorrectIndexA: 1,
    coordOptionsB: ["(3, 4)", "(-3, 4)", "(3, -4)", "(-3, -4)"],
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
      xNumSubResult: "6",
      xDenUsesDblNeg: true,
      xDenVal2: "\u22123",
      xDenVal1: "6",
      xDenResult: "3",
      yNumSub: "2",
      yDenVal2: "\u22124",
      yDenVal1: "2",
      yDenResult: "\u22126",
    },
    step3Formula: {
      leftNumOp: "+",
      leftNumVal: "6",
      leftDen: "3",
      rightNumOp: "\u2212",
      rightNumVal: "2",
      rightDen: "\u22126",
    },
    step3: {
      options: ["2x + y + 10 = 0", "2x \u2212 y = 10", "x + 2y + 10 = 0"],
      correctIndex: 0,
      feedbackCorrect:
        "Benar.<br>2x + y + 10 = 0 adalah persamaan<br>bayangan garis AB.",
    },
    step4: {
      headingLeft: "Refleksi garis AB terhadap <y>sumbu-y</y>.",
      rightText:
        "Garis <y>A\u2032B\u2032</y><br>adalah bayangan<br>garis <y>AB</y><br>setelah refleksi terhadap <y>sumbu-y</y>.",
      abEquationLabel: "2x \u2212 y = 10",
      abLabelOffset: 20,
      abLabelAngleOffset: 0,
      equationLabelAngleOffset: 180,
      equationLabel: "2x + y + 10 = 0",
      highlightYAxis: true,
    },
    graph: {
      A: { x: 6, y: 2, labelPlacement: "right" },
      B: { x: 3, y: -4, labelPlacement: "right" },
      Aprime: { x: -6, y: 2, labelPlacement: "left" },
      Bprime: { x: -3, y: -4, labelPlacement: "left" },
    },
    graphConfigKey: "q1",
  },
  {
    question:
      "Garis AB melalui titik <y>A(2, -2)</y> dan <y>B(3, -4)</y>. Tentukan persamaan bayangan garis AB setelah refleksi terhadap garis <y>y = x</y>.",
    rulePromptFull:
      "Apa <y>aturan refleksi</y> terhadap <y>y = x</y>?",
    ruleOption: "(y, x)",
    rule: {
      first: { variable: "y" },
      second: { variable: "x" },
    },
    pointA: "A(2, -2)",
    pointB: "B(3, -4)",
    imageA: "A\u2032(-2, 2)",
    imageAShort: "(-2, 2)",
    imageAX: "-2",
    imageAY: "2",
    imageB: "B\u2032(-4, 3)",
    imageBShort: "(-4, 3)",
    imageBX: "-4",
    imageBY: "3",
    coordOptionsA: ["(2, -2)", "(-2, 2)", "(2, 2)", "(-2, -2)"],
    coordCorrectIndexA: 1,
    coordOptionsB: ["(3, -4)", "(-3, 4)", "(4, -3)", "(-4, 3)"],
    coordCorrectIndexB: 3,
    hints: {
      type: "labels",
      y: "Koordinat ditukar",
      x: "Tidak ada perubahan tanda",
    },
    step2: {
      headingLeft: "Mencari persamaan garis A\u2032B\u2032.",
    },
    subst: {
      xUseDblNeg: true,
      xNumSubUsesDblNeg: true,
      xNumSubResult: "2",
      xDenUsesDblNeg: true,
      xDenVal2: "\u22124",
      xDenVal1: "2",
      xDenResult: "\u22122",
      yNumSub: "2",
      yDenVal2: "3",
      yDenVal1: "2",
      yDenResult: "1",
    },
    step3Formula: {
      leftNumOp: "+",
      leftNumVal: "2",
      leftDen: "\u22122",
      rightNumOp: "\u2212",
      rightNumVal: "2",
      rightDen: "1",
    },
    step3: {
      options: ["x + 2y = 2", "2x + y = 2", "x \u2212 2y = 2"],
      correctIndex: 0,
      feedbackCorrect:
        "Benar.<br>x + 2y = 2 adalah persamaan<br>bayangan garis AB.",
    },
    step4: {
      headingLeft: "Refleksi garis AB terhadap <y>y = x</y>.",
      rightText:
        "Garis <y>A\u2032B\u2032</y><br>adalah bayangan<br>garis <y>AB</y><br>setelah refleksi terhadap <y>y = x</y>.",
      abEquationLabel: "2x + y = 2",
      abLabelOffset: -28,
      abLabelAngleOffset: 180,
      abLabelAtThroughMidpoint: true,
      equationLabel: "x + 2y = 2",
      equationLabelAtThroughMidpoint: true,
      highlightYAxis: false,
      reflectionAxisLine: {
        through: [
          { x: 0, y: 0 },
          { x: 1, y: 1 },
        ],
        strokeWidth: 3.5,
        equationLabel: "y = x",
        labelAngleOffset: 180,
        labelPositionRatio: 0.25,
      },
    },
    graph: {
      A: { x: 2, y: -2, labelPlacement: "right" },
      B: { x: 3, y: -4, labelPlacement: "right" },
      Aprime: { x: -2, y: 2, labelPlacement: "left" },
      Bprime: { x: -4, y: 3, labelPlacement: "left" },
    },
    graphConfigKey: "q2",
  },
  {
    question:
      "Garis AB melalui titik <y>A(2, 4)</y> dan <y>B(3, 6)</y>. Tentukan persamaan bayangan garis AB setelah refleksi terhadap garis <y>y = 2</y>.",
    rulePromptFull:
      "Apa <y>aturan refleksi</y> terhadap <y>y = 2</y>?",
    ruleOption: "(x, -y + 2h)",
    rule: {
      first: { variable: "x" },
      second: { prefix: "-", variable: "y", suffix: " + 2h" },
    },
    pointA: "A(2, 4)",
    pointB: "B(3, 6)",
    imageA: "A\u2032(2, 0)",
    imageAShort: "(2, 0)",
    imageAX: "2",
    imageAY: "0",
    imageB: "B\u2032(3, -2)",
    imageBShort: "(3, -2)",
    imageBX: "3",
    imageBY: "-2",
    coordOptionsA: ["(2, 4)", "(2, -4)", "(2, 0)", "(-2, 0)"],
    coordCorrectIndexA: 2,
    coordOptionsB: ["(3, -2)", "(-3, -2)", "(3, 2)", "(3, -6)"],
    coordCorrectIndexB: 0,
    hints: {
      type: "connectors",
      y: "Ubah tanda dan \n tambahkan 2h",
      x: "Tidak berubah",
    },
    step2: {
      headingLeft: "Mencari persamaan garis A\u2032B\u2032.",
    },
    subst: {
      xUseDblNeg: false,
      xNumSubUsesDblNeg: false,
      xNumSub: "2",
      xDenVal2: "3",
      xDenVal1: "2",
      xDenResult: "1",
      yNumSub: "0",
      yNumSimplifyTo: "y",
      yDenVal2: "\u22122",
      yDenVal1: "0",
      yDenResult: "\u22122",
    },
    step3Formula: {
      leftNumOp: "\u2212",
      leftNumVal: "2",
      leftDen: "1",
      rightNumOp: "",
      rightNumVal: "",
      rightDen: "\u22122",
    },
    step3: {
      options: ["2x + y = 4", "2x \u2212 y = 4", "x + 2y = 4"],
      correctIndex: 0,
      feedbackCorrect:
        "Benar.<br>2x + y = 4 adalah persamaan<br>bayangan garis AB.",
    },
    step4: {
      headingLeft: "Refleksi garis AB terhadap <y>y = 2</y>.",
      rightText:
        "Garis <y>A\u2032B\u2032</y><br>adalah bayangan<br>garis <y>AB</y><br>setelah refleksi terhadap <y>y = 2</y>.",
      abEquationLabel: "y = 2x",
      abLabelOffset: 28,
      abLabelAtThroughMidpoint: true,
      equationLabel: "2x + y = 4",
      equationLabelAtThroughMidpoint: true,
      highlightYAxis: false,
      equationLabelAngleOffset: 180,
      abLabelAngleOffset: 180,
      reflectionAxisLine: {
        through: [
          { x: 0, y: 2 },
          { x: 1, y: 2 },
        ],
        strokeWidth: 3.5,
        equationLabel: "y = 2",
        labelAngleOffset: 180,
        labelOffset: 22,
        labelPositionRatio: 0.25,
      },
    },
    graph: {
      A: { x: 2, y: 4, labelPlacement: "right" },
      B: { x: 3, y: 6, labelPlacement: "right" },
      Aprime: { x: 2, y: 0, labelPlacement: "right" },
      Bprime: { x: 3, y: -2, labelPlacement: "right" },
    },
    graphConfigKey: "q3",
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
