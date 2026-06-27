const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Finding Object Coordinates",
        text:
          "Given image coordinates and rotation,<br>find object coordinates.<br><br>Click START to begin!",
        buttonText: "START",
      },
      question: {
        text:
          'A line segment is rotated <span id="highlight-rotation" class="purple-bg">270\u00b0 clockwise</span> about the origin, resulting in endpoints <span id="highlight-a-prime" class="cyan-bg fly-source">A\u2019 (-2,3)</span> and <span id="highlight-b-prime" class="cyan-bg fly-source">B\u2019 (-4,1)</span>. <span id="highlight-find" class="orange-bg">Find the original line segment.</span>',
        textPlain:
          "A line segment is rotated 270\u00b0 clockwise about the origin, resulting in endpoints A\u2019 (-2,3) and B\u2019 (-4,1). Find the original line segment.",
      },
      graph: {
        labelAPrime: "A\u2019 (-2,3)",
        labelBPrime: "B\u2019 (-4,1)",
        labelA: "A (3,2)",
        labelB: "B (1,4)",
        coordAPrime: { x: "-2", y: "3" },
        coordBPrime: { x: "-4", y: "1" },
        coordA: { x: "3", y: "2" },
        coordB: { x: "1", y: "4" },
      },
      questionVisual: {
        objectAUnknown: "A (?,?)",
        objectBUnknown: "B (?,?)",
        objectAFound: "A (3,2)",
        objectBFound: "B (1,4)",
        imageA: "A\u2019 (-2,3)",
        imageB: "B\u2019 (-4,1)",
        rotation: "270\u00b0 clockwise",
      },
      rulePanel: {
        title:
          "Which rule should be applied to rotate a point <y>270\u00b0 clockwise</y> about the origin?",
        rulePrefix: "(x,y) \u2192 (",
        ruleSuffix: ")",
        resultRule:
          '( <span class="rule-object">x , y</span> ) \u2192 ( <span class="rule-image">-y , x</span> )',
        genericNegY: "-y",
        genericImgX: "x",
        genericObjX: "x",
        genericObjY: "y",
      },
      rotatePanel: {
        text:
          "<y>A (3,2)</y> and <y>B (1,4)</y> are the object points.",
        buttonText: "Rotate!",
      },
      dnd: {
        items: {
          x: { id: "x", label: "x" },
          negX: { id: "negX", label: "-x" },
          y: { id: "y", label: "y" },
          negY: { id: "negY", label: "-y" },
        },
        correctSlots: {
          slot1: "negY",
          slot2: "x",
        },
      },
      steps: {
        1: { navText: "Tap \u00bb to see given data" },
        2: { navTextDone: "Tap \u00bb to find out which rule to apply" },
        3: { navText: "Drag and drop the correct option" },
        4: { navText: "Tap A\u2019 to find A" },
        5: { navText: "Tap B\u2019 to find B" },
        6: {
          navText: "Tap the button to visualise rotation",
          navTextDone: "Tap \u00bb to see next question",
        },
      },
      colors: {
        object: "#E97132",
        image: "#45C6CE",
      },
      points: {
        aPrime: { x: -2, y: 3 },
        bPrime: { x: -4, y: 1 },
        a: { x: 3, y: 2 },
        b: { x: 1, y: 4 },
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Mencari Koordinat Objek",
        text:
          "Diberikan koordinat bayangan dan rotasi,<br>cari koordinat objek.<br><br>Ketuk MULAI untuk memulai!",
        buttonText: "MULAI",
      },
      question: {
        text:
          'Sebuah ruas garis dirotasi <span id="highlight-rotation" class="purple-bg">270\u00b0 searah jarum jam</span> terhadap titik asal, sehingga titik ujungnya menjadi <span id="highlight-a-prime" class="cyan-bg fly-source">A\u2019 (-2,3)</span> dan <span id="highlight-b-prime" class="cyan-bg fly-source">B\u2019 (-4,1)</span>. <span id="highlight-find" class="orange-bg">Temukan ruas garis aslinya.</span>',
        textPlain:
          "Sebuah ruas garis dirotasi 270\u00b0 searah jarum jam terhadap titik asal, sehingga titik ujungnya menjadi A\u2019 (-2,3) dan B\u2019 (-4,1). Temukan ruas garis aslinya.",
      },
      graph: {
        labelAPrime: "A\u2019 (-2,3)",
        labelBPrime: "B\u2019 (-4,1)",
        labelA: "A (3,2)",
        labelB: "B (1,4)",
        coordAPrime: { x: "-2", y: "3" },
        coordBPrime: { x: "-4", y: "1" },
        coordA: { x: "3", y: "2" },
        coordB: { x: "1", y: "4" },
      },
      questionVisual: {
        objectAUnknown: "A (?,?)",
        objectBUnknown: "B (?,?)",
        objectAFound: "A (3,2)",
        objectBFound: "B (1,4)",
        imageA: "A\u2019 (-2,3)",
        imageB: "B\u2019 (-4,1)",
        rotation: "270\u00b0 searah jarum jam",
      },
      rulePanel: {
        title:
          "Aturan mana yang harus diterapkan untuk merotasi titik <y>270\u00b0 searah jarum jam</y> terhadap titik asal?",
        rulePrefix: "(x,y) \u2192 (",
        ruleSuffix: ")",
        resultRule:
          '( <span class="rule-object">x , y</span> ) \u2192 ( <span class="rule-image">-y , x</span> )',
        genericNegY: "-y",
        genericImgX: "x",
        genericObjX: "x",
        genericObjY: "y",
      },
      rotatePanel: {
        text:
          "<y>A (3,2)</y> dan <y>B (1,4)</y> adalah titik objek.",
        buttonText: "Rotasi!",
      },
      dnd: {
        items: {
          x: { id: "x", label: "x" },
          negX: { id: "negX", label: "-x" },
          y: { id: "y", label: "y" },
          negY: { id: "negY", label: "-y" },
        },
        correctSlots: {
          slot1: "negY",
          slot2: "x",
        },
      },
      steps: {
        1: { navText: "Ketuk \u00bb untuk melihat data yang diberikan" },
        2: {
          navTextDone:
            "Ketuk \u00bb untuk mengetahui aturan mana yang harus diterapkan",
        },
        3: { navText: "Seret dan lepas opsi yang benar" },
        4: { navText: "Ketuk A\u2019 untuk mencari A" },
        5: { navText: "Ketuk B\u2019 untuk mencari B" },
        6: {
          navText: "Ketuk tombol untuk memvisualisasikan rotasi",
          navTextDone: "Ketuk \u00bb untuk melihat soal berikutnya",
        },
      },
      colors: {
        object: "#E97132",
        image: "#45C6CE",
      },
      points: {
        aPrime: { x: -2, y: 3 },
        bPrime: { x: -4, y: 1 },
        a: { x: 3, y: 2 },
        b: { x: 1, y: 4 },
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];

const GENERIC_RULE = {
  imgNegY: null,
  imgX: null,
  objX: null,
  objY: null,
};
