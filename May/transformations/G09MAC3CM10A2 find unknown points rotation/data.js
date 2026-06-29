const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Practice: Rotation",
        text:
          "Let's solve a question on Rotation.<br><br>Click START to begin!",
        buttonText: "START",
      },
      question: {
        text:
          'Triangle PQR is transformed to produce the image P\u2019Q\u2019R\u2019.<br>Given <span id="highlight-p" class="orange-bg fly-source">P (2,1)</span>, <span id="highlight-q" class="orange-bg fly-source">Q (4,3)</span>, <span id="highlight-p-prime" class="cyan-bg fly-source">P\u2019 (1,-2)</span>, and <span id="highlight-r-prime" class="cyan-bg fly-source">R\u2019 (4,-3)</span>.<br>Determine the coordinates of <span id="highlight-r-solve" class="orange-bg">R</span> and <span id="highlight-qprime-solve" class="cyan-bg">Q\u2019</span>.',
        textPlain:
          "Triangle PQR is transformed to produce the image P\u2019Q\u2019R\u2019. Given P (2,1), Q (4,3), P\u2019 (1,-2), and R\u2019 (4,-3). Determine the coordinates of R and Q\u2019.",
      },
      graph: {
        labelP: "P (2,1)",
        labelQ: "Q (4,3)",
        labelPPrime: "P\u2019 (1,-2)",
        labelRPrime: "R\u2019 (4,-3)",
        labelRUnknown: "R (?,?)",
        labelQPrimeUnknown: "Q\u2019 (?,?)",
      },
      table: {
        preImage: "OBJECT",
        rotation: "ROTATION",
        image: "IMAGE",
        p: "P",
        q: "Q",
        r: "R",
        pPrime: "P\u2019",
        qPrime: "Q\u2019",
        rPrime: "R\u2019",
        unknown: "(?,?)",
        rotationValue: "90\u00b0 Clockwise",
        qPrimeValue: "(3,-4)",
        rValue: "(2,4)",
      },
      formula: {
        objNumeric: "(2,1)",
        imgNumeric: "(1,-2)",
        objGeneric: "(x,y)",
        imgGeneric: "(y,-x)",
      },
      mcq: {
        step4: {
          title: "Which of these points can be used to find rotation?",
          options: ["P", "Q", "R"],
          correctIndex: 0,
          feedbackCorrect:
            "Since the object and image coordinates of point P are given, we use them to find rotation.",
          feedbackWrongQ:
            "Since the image coordinates of point Q are not given, we can\u2019t use it to find the rotation.",
          feedbackWrongR:
            "Since the object coordinates of point R is not given, we can\u2019t use it to find the rotation.",
        },
        step5: {
          title: "This rule corresponds to which rotation.",
          options: ["90\u00b0 clockwise", "90\u00b0 anticlockwise"],
          correctIndex: 0,
        },
      },
      applyPanel: {
        text:
          "Since every point rotates in the same way, apply the same rotation to all the coordinates.",
        buttonText: "Apply",
      },
      steps: {
        1: { navText: "Tap \u00bb to identify the given data" },
        2: { navTextDone: "Tap \u00bb to categorize given data" },
        3: {
          navText: "Tap \u00bb to answer the question",
          navTextDone: "Tap \u00bb to answer the question",
        },
        4: {
          navText: "Tap the correct option",
          navTextWrong: "Tap \u00ab to answer again",
          navTextDone: "Tap \u00bb to find rotation",
        },
        5: {
          navText: "Tap the correct option",
          navTextWrong: "Tap \u00ab to answer again",
          navTextDone: "Tap \u00bb to continue",
        },
        6: {
          navText: "Tap to apply the rotation to all points",
          navTextDone: "Tap \u00bb to find Q\u2019",
        },
      },
      final: {
        heading: "",
        text:
          "Great job!<br>You can now apply your understanding to solve<br>questions on rotation.",
        buttonText: "START OVER",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Latihan: Rotasi",
        text:
          "Mari selesaikan soal tentang Rotasi.<br><br>Ketuk MULAI untuk memulai!",
        buttonText: "MULAI",
      },
      question: {
        text:
          'Segitiga PQR ditransformasi untuk menghasilkan bayangan P\u2019Q\u2019R\u2019.<br>Diberikan <span id="highlight-p" class="orange-bg fly-source">P (2,1)</span>, <span id="highlight-q" class="orange-bg fly-source">Q (4,3)</span>, <span id="highlight-p-prime" class="cyan-bg fly-source">P\u2019 (1,-2)</span>, dan <span id="highlight-r-prime" class="cyan-bg fly-source">R\u2019 (4,-3)</span>.<br>Tentukan koordinat <span id="highlight-r-solve" class="orange-bg">R</span> dan <span id="highlight-qprime-solve" class="cyan-bg">Q\u2019</span>.',
        textPlain:
          "Segitiga PQR ditransformasi untuk menghasilkan bayangan P\u2019Q\u2019R\u2019. Diberikan P (2,1), Q (4,3), P\u2019 (1,-2), dan R\u2019 (4,-3). Tentukan koordinat R dan Q\u2019.",
      },
      graph: {
        labelP: "P (2,1)",
        labelQ: "Q (4,3)",
        labelPPrime: "P\u2019 (1,-2)",
        labelRPrime: "R\u2019 (4,-3)",
        labelRUnknown: "R (?,?)",
        labelQPrimeUnknown: "Q\u2019 (?,?)",
      },
      table: {
        preImage: "OBJEK",
        rotation: "ROTASI",
        image: "BAYANGAN",
        p: "P",
        q: "Q",
        r: "R",
        pPrime: "P\u2019",
        qPrime: "Q\u2019",
        rPrime: "R\u2019",
        unknown: "(?,?)",
        rotationValue: "90\u00b0 Searah Jarum Jam",
        qPrimeValue: "(3,-4)",
        rValue: "(2,4)",
      },
      formula: {
        objNumeric: "(2,1)",
        imgNumeric: "(1,-2)",
        objGeneric: "(x,y)",
        imgGeneric: "(y,-x)",
      },
      mcq: {
        step4: {
          title: "Titik mana yang dapat digunakan untuk mencari rotasi?",
          options: ["P", "Q", "R"],
          correctIndex: 0,
          feedbackCorrect:
            "Karena koordinat objek dan bayangan titik P diketahui, kita menggunakannya untuk mencari rotasi.",
          feedbackWrongQ:
            "Karena koordinat bayangan titik Q tidak diketahui, kita tidak dapat menggunakannya untuk mencari rotasi.",
          feedbackWrongR:
            "Karena koordinat objek titik R tidak diketahui, kita tidak dapat menggunakannya untuk mencari rotasi.",
        },
        step5: {
          title: "Aturan ini sesuai dengan rotasi yang mana.",
          options: ["90\u00b0 searah jarum jam", "90\u00b0 berlawanan jarum jam"],
          correctIndex: 0,
        },
      },
      applyPanel: {
        text:
          "Karena setiap titik berotasi dengan cara yang sama, terapkan rotasi yang sama ke semua koordinat.",
        buttonText: "Terapkan",
      },
      steps: {
        1: { navText: "Ketuk \u00bb untuk mengidentifikasi data yang diberikan" },
        2: {
          navTextDone: "Ketuk \u00bb untuk mengelompokkan data yang diberikan",
        },
        3: {
          navText: "Ketuk \u00bb untuk menjawab pertanyaan",
          navTextDone: "Ketuk \u00bb untuk menjawab pertanyaan",
        },
        4: {
          navText: "Ketuk opsi yang benar",
          navTextWrong: "Ketuk \u00ab untuk menjawab lagi",
          navTextDone: "Ketuk \u00bb untuk mencari rotasi",
        },
        5: {
          navText: "Ketuk opsi yang benar",
          navTextWrong: "Ketuk \u00ab untuk menjawab lagi",
          navTextDone: "Ketuk \u00bb untuk lanjut",
        },
        6: {
          navText: "Ketuk untuk menerapkan rotasi ke semua titik",
          navTextDone: "Ketuk \u00bb untuk mencari Q\u2019",
        },
      },
      final: {
        heading: "",
        text:
          "Bagus!<br>Sekarang kamu dapat menerapkan pemahamanmu untuk menyelesaikan<br>soal tentang rotasi.",
        buttonText: "MULAI LAGI",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
