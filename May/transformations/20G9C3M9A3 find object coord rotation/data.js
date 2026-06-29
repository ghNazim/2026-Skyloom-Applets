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
      final: {
        heading: "",
        text:
          "You have learned to find object coordinates when rotation<br>and image coordinates are given.",
        buttonText: "START OVER",
      },
      question: {
        text:
          'A line segment is rotated <span id="highlight-rotation" class="purple-bg">270\u00b0 clockwise</span> about the origin, resulting in endpoints <span id="highlight-a-prime" class="cyan-bg fly-source">A\u2019 (-2,3)</span> and <span id="highlight-b-prime" class="cyan-bg fly-source">B\u2019 (-4,1)</span>. <span id="highlight-find" class="orange-bg">Find the original line segment.</span>',
        textPlain:
          "A line segment is rotated 270\u00b0 clockwise about the origin, resulting in endpoints A\u2019 (-2,3) and B\u2019 (-4,1). Find the original line segment.",
      },
      question2: {
        textPlain:
          "A rectangle ABCD was rotated 180\u00b0 clockwise about the origin to produce the image A\u2019B\u2019C\u2019D\u2019. Find the object coordinates.",
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
      graph2: {
        labels: {
          APrime: "A\u2019 (-2,1)",
          BPrime: "B\u2019 (-2,4)",
          CPrime: "C\u2019 (1,4)",
          DPrime: "D\u2019 (1,1)",
          A: "A (2,-1)",
          B: "B (2,-4)",
          C: "C (-1,-4)",
          D: "D (-1,-1)",
        },
        coords: {
          APrime: { x: "-2", y: "1" },
          BPrime: { x: "-2", y: "4" },
          CPrime: { x: "1", y: "4" },
          DPrime: { x: "1", y: "1" },
          A: { x: "2", y: "-1" },
          B: { x: "2", y: "-4" },
          C: { x: "-1", y: "-4" },
          D: { x: "-1", y: "-1" },
        },
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
      questionVisual2: {
        rotation: "180\u00b0 clockwise",
        objectUnknown: {
          A: "A (?,?)",
          B: "B (?,?)",
          C: "C (?,?)",
          D: "D (?,?)",
        },
        objectFound: {
          A: "A (2,-1)",
          B: "B (2,-4)",
          C: "C (-1,-4)",
          D: "D (-1,-1)",
        },
        image: {
          A: "A\u2019 (-2,1)",
          B: "B\u2019 (-2,4)",
          C: "C\u2019 (1,4)",
          D: "D\u2019 (1,1)",
        },
        keys: ["A", "B", "C", "D"],
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
      rulePanel2: {
        title:
          "Which rule should be applied to rotate a point <y>180\u00b0 clockwise</y> about the origin?",
        rulePrefix: "(x,y) \u2192 (",
        ruleSuffix: ")",
        resultRule:
          '( <span class="rule-object">x , y</span> ) \u2192 ( <span class="rule-image">-x , -y</span> )',
        genericNegX: "-x",
        genericNegY: "-y",
        genericObjX: "x",
        genericObjY: "y",
      },
      rotatePanel: {
        text:
          "<y>A (3,2)</y> and <y>B (1,4)</y> are the object points.",
        buttonText: "Rotate!",
      },
      rotatePanel2: {
        text:
          "<y>A (2,-1)</y>, <y>B (2,-4)</y>, <y>C (-1,-4)</y>, and <y>D (-1,-1)</y> are the object points.",
        buttonText: "Rotate!",
      },
      dnd: {
        items: {
          x: { id: "x", label: "x" },
          negX: { id: "negX", label: "-x" },
          y: { id: "y", label: "y" },
          negY: { id: "negY", label: "-y" },
        },
        correctSlots: { slot1: "negY", slot2: "x" },
      },
      dnd2: {
        items: {
          x: { id: "x", label: "x" },
          negX: { id: "negX", label: "-x" },
          y: { id: "y", label: "y" },
          negY: { id: "negY", label: "-y" },
        },
        correctSlots: { slot1: "negX", slot2: "negY" },
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
        7: { navText: "Tap \u00bb to identify the given data" },
        8: { navTextDone: "Tap \u00bb to find out which rule to apply" },
        9: { navText: "Drag and drop the correct option" },
        10: { navText: "Tap A\u2019 to find A" },
        11: { navText: "Tap B\u2019 to find B" },
        12: { navText: "Tap C\u2019 to find C" },
        13: { navText: "Tap D\u2019 to find D" },
        14: {
          navText: "Tap the button to visualise rotation",
          navTextDone: "Tap \u00bb to conclude",
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
      rectPoints: {
        aPrime: { x: -2, y: 1 },
        bPrime: { x: -2, y: 4 },
        cPrime: { x: 1, y: 4 },
        dPrime: { x: 1, y: 1 },
        a: { x: 2, y: -1 },
        b: { x: 2, y: -4 },
        c: { x: -1, y: -4 },
        d: { x: -1, y: -1 },
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
      final: {
        heading: "",
        text:
          "Kamu telah belajar mencari koordinat objek ketika rotasi<br>dan koordinat bayangan diketahui.",
        buttonText: "MULAI LAGI",
      },
      question: {
        text:
          'Sebuah ruas garis dirotasi <span id="highlight-rotation" class="purple-bg">270\u00b0 searah jarum jam</span> terhadap titik asal, sehingga titik ujungnya menjadi <span id="highlight-a-prime" class="cyan-bg fly-source">A\u2019 (-2,3)</span> dan <span id="highlight-b-prime" class="cyan-bg fly-source">B\u2019 (-4,1)</span>. <span id="highlight-find" class="orange-bg">Temukan ruas garis aslinya.</span>',
        textPlain:
          "Sebuah ruas garis dirotasi 270\u00b0 searah jarum jam terhadap titik asal, sehingga titik ujungnya menjadi A\u2019 (-2,3) dan B\u2019 (-4,1). Temukan ruas garis aslinya.",
      },
      question2: {
        textPlain:
          "Persegi panjang ABCD dirotasi 180\u00b0 searah jarum jam terhadap titik asal sehingga menghasilkan bayangan A\u2019B\u2019C\u2019D\u2019. Temukan koordinat objek.",
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
      graph2: {
        labels: {
          APrime: "A\u2019 (-2,1)",
          BPrime: "B\u2019 (-2,4)",
          CPrime: "C\u2019 (1,4)",
          DPrime: "D\u2019 (1,1)",
          A: "A (2,-1)",
          B: "B (2,-4)",
          C: "C (-1,-4)",
          D: "D (-1,-1)",
        },
        coords: {
          APrime: { x: "-2", y: "1" },
          BPrime: { x: "-2", y: "4" },
          CPrime: { x: "1", y: "4" },
          DPrime: { x: "1", y: "1" },
          A: { x: "2", y: "-1" },
          B: { x: "2", y: "-4" },
          C: { x: "-1", y: "-4" },
          D: { x: "-1", y: "-1" },
        },
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
      questionVisual2: {
        rotation: "180\u00b0 searah jarum jam",
        objectUnknown: {
          A: "A (?,?)",
          B: "B (?,?)",
          C: "C (?,?)",
          D: "D (?,?)",
        },
        objectFound: {
          A: "A (2,-1)",
          B: "B (2,-4)",
          C: "C (-1,-4)",
          D: "D (-1,-1)",
        },
        image: {
          A: "A\u2019 (-2,1)",
          B: "B\u2019 (-2,4)",
          C: "C\u2019 (1,4)",
          D: "D\u2019 (1,1)",
        },
        keys: ["A", "B", "C", "D"],
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
      rulePanel2: {
        title:
          "Aturan mana yang harus diterapkan untuk merotasi titik <y>180\u00b0 searah jarum jam</y> terhadap titik asal?",
        rulePrefix: "(x,y) \u2192 (",
        ruleSuffix: ")",
        resultRule:
          '( <span class="rule-object">x , y</span> ) \u2192 ( <span class="rule-image">-x , -y</span> )',
        genericNegX: "-x",
        genericNegY: "-y",
        genericObjX: "x",
        genericObjY: "y",
      },
      rotatePanel: {
        text:
          "<y>A (3,2)</y> dan <y>B (1,4)</y> adalah titik objek.",
        buttonText: "Rotasi!",
      },
      rotatePanel2: {
        text:
          "<y>A (2,-1)</y>, <y>B (2,-4)</y>, <y>C (-1,-4)</y>, dan <y>D (-1,-1)</y> adalah titik objek.",
        buttonText: "Rotasi!",
      },
      dnd: {
        items: {
          x: { id: "x", label: "x" },
          negX: { id: "negX", label: "-x" },
          y: { id: "y", label: "y" },
          negY: { id: "negY", label: "-y" },
        },
        correctSlots: { slot1: "negY", slot2: "x" },
      },
      dnd2: {
        items: {
          x: { id: "x", label: "x" },
          negX: { id: "negX", label: "-x" },
          y: { id: "y", label: "y" },
          negY: { id: "negY", label: "-y" },
        },
        correctSlots: { slot1: "negX", slot2: "negY" },
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
        7: { navText: "Ketuk \u00bb untuk mengidentifikasi data yang diberikan" },
        8: {
          navTextDone:
            "Ketuk \u00bb untuk mengetahui aturan mana yang harus diterapkan",
        },
        9: { navText: "Seret dan lepas opsi yang benar" },
        10: { navText: "Ketuk A\u2019 untuk mencari A" },
        11: { navText: "Ketuk B\u2019 untuk mencari B" },
        12: { navText: "Ketuk C\u2019 untuk mencari C" },
        13: { navText: "Ketuk D\u2019 untuk mencari D" },
        14: {
          navText: "Ketuk tombol untuk memvisualisasikan rotasi",
          navTextDone: "Ketuk \u00bb untuk menyimpulkan",
        },
      },
      colors: { object: "#E97132", image: "#45C6CE" },
      points: {
        aPrime: { x: -2, y: 3 },
        bPrime: { x: -4, y: 1 },
        a: { x: 3, y: 2 },
        b: { x: 1, y: 4 },
      },
      rectPoints: {
        aPrime: { x: -2, y: 1 },
        bPrime: { x: -2, y: 4 },
        cPrime: { x: 1, y: 4 },
        dPrime: { x: 1, y: 1 },
        a: { x: 2, y: -1 },
        b: { x: 2, y: -4 },
        c: { x: -1, y: -4 },
        d: { x: -1, y: -1 },
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

const GENERIC_RULE_180 = {
  imgNegX: null,
  imgNegY: null,
  objX: null,
  objY: null,
};
