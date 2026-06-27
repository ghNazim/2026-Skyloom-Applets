const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Practice: Translation",
        text:
          "Let's solve a question on Translation.<br><br>Click START to begin!",
        buttonText: "START",
      },
      question: {
        text:
          'Triangle PQR is translated to produce the image of P\u2019Q\u2019R\u2019. Given <span id="highlight-p" class="purple-bg fly-source">P(2,3)</span>, <span id="highlight-q" class="purple-bg fly-source">Q(7,4)</span>, <span id="highlight-p-prime" class="purple-bg fly-source">P\u2019(7,2)</span>, and <span id="highlight-r-prime" class="purple-bg fly-source">R\u2019(11,5)</span>, <span id="highlight-solve" class="purple-bg">determine the coordinates of R and Q\u2019</span>. Also determine the translation.',
        textPlain:
          'Triangle PQR is translated to produce the image of P\u2019Q\u2019R\u2019. Given P(2,3), Q(7,4), P\u2019(7,2), and R\u2019(11,5), determine the coordinates of R and Q\u2019. Also determine the translation.',
      },
      graph: {
        labelP: "P(2,3)",
        labelQ: "Q(7,4)",
        labelPPrime: "P\u2019(7,2)",
        labelRPrime: "R\u2019(11,5)",
        labelR: "R (6,6)",
        labelQPrime: "Q\u2019 (12,3)",
        labelRUnknown: "R (?,?)",
        labelQPrimeUnknown: "Q\u2019 (?,?)",
      },
      table: {
        preImage: "PRE-IMAGE",
        translation: "TRANSLATION",
        image: "IMAGE",
        p: "P",
        q: "Q",
        r: "R",
        pPrime: "P\u2019",
        qPrime: "Q\u2019",
        rPrime: "R\u2019",
        unknown: "(?,?)",
        translationValue: "(5,-1)",
        qPrimeValue: "(12,3)",
        rValue: "(6,6)",
      },
      mcq: {
        step4: {
          title: "Which of these points can be used to find translation?",
          options: ["P", "Q", "R"],
          correctIndex: 0,
          feedbackCorrect:
            "Since the object and image coordinates of point P are given, we use them to find the translation.",
          feedbackWrongQ:
            "Since the image coordinates of point Q are not given, we can\u2019t use it to find the translation.",
          feedbackWrongR:
            "Since the object coordinates of point R are not given, we can\u2019t use it to find the translation.",
        },
        step5: {
          title:
            "How do we find the translation from the coordinates of the object and image?",
          options: ["Object + Image", "Image - Object", "Object - Image"],
          correctIndex: 1,
          feedbackWrong:
            "To find translation, subtract object coordinates from image coordinates",
        },
        step8: {
          title: "Choose the correct way to find Q\u2019?",
          options: [
            "Object + Translation",
            "Object - Translation",
            "Translation - Object",
          ],
          correctIndex: 0,
          feedbackWrong:
            "To find image coordinates, add translation to the object coordinates",
        },
        step9: {
          title: "Choose the correct way to find R?",
          options: [
            "Translation + Image",
            "Image - Translation",
            "Translation - Image",
          ],
          correctIndex: 1,
          feedbackWrong:
            "To find object coordinates, subtract translation from image coordinates",
        },
      },
      applyPanel: {
        text:
          "In a translation, every point moves the same distance in the same direction",
        buttonText: "Apply",
      },
      steps: {
        1: { navText: "Tap \u00bb to see given data" },
        2: { navTextDone: "Tap \u00bb to categorize given data" },
        3: { navText: "Tap \u00bb to start solving" },
        4: {
          navText: "Tap the correct option",
          navTextWrong: "Tap \u00ab to answer again",
          navTextDone: "Tap \u00bb to find translation",
        },
        5: {
          navText: "Tap the correct option",
          navTextWrong: "Tap \u00ab to answer again",
          navTextDone: "Tap \u00bb to continue",
        },
        6: {
          navText: "Tap to apply the translation to all points",
          navTextDone: "Tap \u00bb to continue",
        },
        7: { navTextDone: "Tap \u00bb to find Q\u2019" },
        8: {
          navText: "Tap the correct option",
          navTextWrong: "Tap \u00ab to answer again",
          navTextDone: "Tap \u00bb to find R",
        },
        9: {
          navText: "Tap the correct option",
          navTextWrong: "Tap \u00ab to answer again",
          navTextDone: "Tap \u00bb to see it on the graph",
        },
        10: { navTextDone: "Tap \u00bb to conclude" },
      },
      final: {
        heading: "",
        text:
          "Great job!<br>You can now apply your understanding to solve<br>questions on translation.",
        buttonText: "START OVER",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Latihan: Translasi",
        text:
          "Mari selesaikan soal tentang Translasi.<br><br>Ketuk MULAI untuk memulai!",
        buttonText: "MULAI",
      },
      question: {
        text:
          'Segitiga PQR ditranslasi untuk menghasilkan bayangan P\u2019Q\u2019R\u2019. Diberikan <span id="highlight-p" class="purple-bg fly-source">P(2,3)</span>, <span id="highlight-q" class="purple-bg fly-source">Q(7,4)</span>, <span id="highlight-p-prime" class="purple-bg fly-source">P\u2019(7,2)</span>, dan <span id="highlight-r-prime" class="purple-bg fly-source">R\u2019(11,5)</span>, <span id="highlight-solve" class="purple-bg">tentukan koordinat R dan Q\u2019</span>. Juga tentukan translasinya.',
        textPlain:
          'Segitiga PQR ditranslasi untuk menghasilkan bayangan P\u2019Q\u2019R\u2019. Diberikan P(2,3), Q(7,4), P\u2019(7,2), dan R\u2019(11,5), tentukan koordinat R dan Q\u2019. Juga tentukan translasinya.',
      },
      graph: {
        labelP: "P(2,3)",
        labelQ: "Q(7,4)",
        labelPPrime: "P\u2019(7,2)",
        labelRPrime: "R\u2019(11,5)",
        labelR: "R (6,6)",
        labelQPrime: "Q\u2019 (12,3)",
        labelRUnknown: "R (?,?)",
        labelQPrimeUnknown: "Q\u2019 (?,?)",
      },
      table: {
        preImage: "BANGUN AWAL",
        translation: "TRANSLASI",
        image: "BAYANGAN",
        p: "P",
        q: "Q",
        r: "R",
        pPrime: "P\u2019",
        qPrime: "Q\u2019",
        rPrime: "R\u2019",
        unknown: "(?,?)",
        translationValue: "(5,-1)",
        qPrimeValue: "(12,3)",
        rValue: "(6,6)",
      },
      mcq: {
        step4: {
          title: "Titik mana yang dapat digunakan untuk mencari translasi?",
          options: ["P", "Q", "R"],
          correctIndex: 0,
          feedbackCorrect:
            "Karena koordinat objek dan bayangan titik P diketahui, kita menggunakannya untuk mencari translasi.",
          feedbackWrongQ:
            "Karena koordinat bayangan titik Q tidak diketahui, kita tidak dapat menggunakannya untuk mencari translasi.",
          feedbackWrongR:
            "Karena koordinat objek titik R tidak diketahui, kita tidak dapat menggunakannya untuk mencari translasi.",
        },
        step5: {
          title:
            "Bagaimana kita mencari translasi dari koordinat objek dan bayangan?",
          options: ["Objek + Bayangan", "Bayangan - Objek", "Objek - Bayangan"],
          correctIndex: 1,
          feedbackWrong:
            "Untuk mencari translasi, kurangkan koordinat objek dari koordinat bayangan",
        },
        step8: {
          title: "Pilih cara yang benar untuk mencari Q\u2019?",
          options: [
            "Objek + Translasi",
            "Objek - Translasi",
            "Translasi - Objek",
          ],
          correctIndex: 0,
          feedbackWrong:
            "Untuk mencari koordinat bayangan, tambahkan translasi ke koordinat objek",
        },
        step9: {
          title: "Pilih cara yang benar untuk mencari R?",
          options: [
            "Translasi + Bayangan",
            "Bayangan - Translasi",
            "Translasi - Bayangan",
          ],
          correctIndex: 1,
          feedbackWrong:
            "Untuk mencari koordinat objek, kurangkan translasi dari koordinat bayangan",
        },
      },
      applyPanel: {
        text:
          "Dalam translasi, setiap titik bergerak jarak yang sama ke arah yang sama",
        buttonText: "Terapkan",
      },
      steps: {
        1: { navText: "Ketuk \u00bb untuk melihat data yang diberikan" },
        2: {
          navTextDone: "Ketuk \u00bb untuk mengelompokkan data yang diberikan",
        },
        3: { navText: "Ketuk \u00bb untuk mulai menyelesaikan" },
        4: {
          navText: "Ketuk opsi yang benar",
          navTextWrong: "Ketuk \u00ab untuk menjawab lagi",
          navTextDone: "Ketuk \u00bb untuk mencari translasi",
        },
        5: {
          navText: "Ketuk opsi yang benar",
          navTextWrong: "Ketuk \u00ab untuk menjawab lagi",
          navTextDone: "Ketuk \u00bb untuk lanjut",
        },
        6: {
          navText: "Ketuk untuk menerapkan translasi ke semua titik",
          navTextDone: "Ketuk \u00bb untuk lanjut",
        },
        7: { navTextDone: "Ketuk \u00bb untuk mencari Q\u2019" },
        8: {
          navText: "Ketuk opsi yang benar",
          navTextWrong: "Ketuk \u00ab untuk menjawab lagi",
          navTextDone: "Ketuk \u00bb untuk mencari R",
        },
        9: {
          navText: "Ketuk opsi yang benar",
          navTextWrong: "Ketuk \u00ab untuk menjawab lagi",
          navTextDone: "Ketuk \u00bb untuk melihatnya pada grafik",
        },
        10: { navTextDone: "Ketuk \u00bb untuk menyimpulkan" },
      },
      final: {
        heading: "",
        text:
          "Bagus!<br>Sekarang kamu dapat menerapkan pemahamanmu untuk menyelesaikan<br>soal tentang translasi.",
        buttonText: "MULAI LAGI",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
