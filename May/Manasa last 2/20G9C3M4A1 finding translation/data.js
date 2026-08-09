const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      colors: {
        object: "#fb9b5b",
        image: "#46c5ce",
        transformation: "#bd78dd",
      },
      nav: {
        previousSymbol: "\u00ab",
        nextSymbol: "\u00bb",
      },
      start: {
        heading: "Finding Translation",
        text: "Given the pre-image coordinates and the image coordinates,<br>find the translation (units of movement).<br><br><br>Click START to begin!",
        buttonText: "START",
      },
      question: {
        text: 'The pre-image point <span id="fly-pre-label" class="fly-source">A</span>(<span id="fly-pre-x" class="fly-source">2</span>,<span id="fly-pre-y" class="fly-source">3</span>) moves to image point <span id="fly-image-label" class="fly-source">A\'</span>(<span id="fly-image-x" class="fly-source">7</span>,<span id="fly-image-y" class="fly-source">1</span>).<br>Find the translation.',
      },
      table: {
        x: "x",
        y: "y",
        pointImage: "Point A'",
        pointPreImage: "Point A",
        translation: "Translation",
        reveal: "Reveal",
        imageX: "7",
        imageY: "1",
        preImageX: "2",
        preImageY: "3",
        revealConfig: {
          xBase: "7",
          xSubtract: "2",
          xResult: "5",
          yBase: "1",
          ySubtract: "3",
          yResult: "-2",
          operator: " - ",
        },
      },
      rightPanel: {
        instruction:
          "Simply subtract the pre-image coordinate from the image coordinate.",
        resultHtml:
          '<span class="translation-rule">The translation rule is <br>(+5, -2).</span><br>The point has moved<br>5 units to the right and<br>2 units downward',
        translateButton: "TRANSLATE",
      },
      practice: {
        questionText:
          'Find the translation for this image <span class="image-text">A\'</span>.',
        navText: "Enter the number using numpad",
        navTextDone: "Tap \u00bb to see next question",
        translationLabel: "Translation:",
        submitLabel: "CHECK",
        leftLabel: "LEFT",
        rightLabel: "RIGHT",
        downLabel: "DOWN",
        upLabel: "UP",
        feedbackCorrect: "Correct!<br>The translation is (+4,+2)",
      },
      rectangle: {
        questionText:
          "Use the sliders to move the rectangle to its image position and<br>find the translation.",
        navText: "Drag the slider to move the figure",
        navTextDone: "Tap \u00bb to see next question",
        imagePositionText: "IMAGE<br>POSITION",
        leftLabel: "LEFT",
        rightLabel: "RIGHT",
        downLabel: "DOWN",
        upLabel: "UP",
        feedbackCorrect: "Correct!<br>The translation is (+4,+2)",
      },
      scenarioIntro: {
        explanation:
          "In a translation, every point of a shape<br>moves the same distance in the same<br>direction.<br><br>So, translation rule for every point will<br>be the same.",
        choicePrompt: "Choose any one point to<br>find the translation rule",
        navSelect: "Select any point",
      },
      scenarios: {
        triangle: {
          questionPlain:
            'Triangle PQR has vertices <span id="tri-pre-p-label">P</span>(<span id="tri-pre-p-x">1</span>,<span id="tri-pre-p-y">2</span>), <span id="tri-pre-q-label">Q</span>(<span id="tri-pre-q-x">4</span>,<span id="tri-pre-q-y">2</span>), <span id="tri-pre-r-label">R</span>(<span id="tri-pre-r-x">2</span>,<span id="tri-pre-r-y">5</span>). Its image has<br>vertices <span id="tri-img-p-label">P\u2019</span>(<span id="tri-img-p-x">6</span>,<span id="tri-img-p-y">-1</span>), <span id="tri-img-q-label">Q\u2019</span>(<span id="tri-img-q-x">9</span>,<span id="tri-img-q-y">-1</span>), <span id="tri-img-r-label">R\u2019</span>(<span id="tri-img-r-x">7</span>,<span id="tri-img-r-y">2</span>). Find the translation.',
          questionHighlighted:
            'Triangle PQR has vertices <span class="scenario-highlight scenario-object"><span id="tri-pre-p-label">P</span>(<span id="tri-pre-p-x">1</span>,<span id="tri-pre-p-y">2</span>)</span>, <span class="scenario-highlight scenario-object"><span id="tri-pre-q-label">Q</span>(<span id="tri-pre-q-x">4</span>,<span id="tri-pre-q-y">2</span>)</span>, <span class="scenario-highlight scenario-object"><span id="tri-pre-r-label">R</span>(<span id="tri-pre-r-x">2</span>,<span id="tri-pre-r-y">5</span>)</span>. Its image has<br>vertices <span class="scenario-highlight scenario-image"><span id="tri-img-p-label">P\u2019</span>(<span id="tri-img-p-x">6</span>,<span id="tri-img-p-y">-1</span>)</span>, <span class="scenario-highlight scenario-image"><span id="tri-img-q-label">Q\u2019</span>(<span id="tri-img-q-x">9</span>,<span id="tri-img-q-y">-1</span>)</span>, <span class="scenario-highlight scenario-image"><span id="tri-img-r-label">R\u2019</span>(<span id="tri-img-r-x">7</span>,<span id="tri-img-r-y">2</span>)</span>. Find the translation.',
          options: ["P", "Q", "R"],
          id: "triangle",
          pointLabelPrefix: "Point ",
          imageMark: "\u2019",
          points: {
            P: {
              pre: [1, 2],
              image: [6, -1],
              preSourceId: "tri-pre-p-label",
              preXSourceId: "tri-pre-p-x",
              preYSourceId: "tri-pre-p-y",
              imageSourceId: "tri-img-p-label",
              imageXSourceId: "tri-img-p-x",
              imageYSourceId: "tri-img-p-y",
            },
            Q: {
              pre: [4, 2],
              image: [9, -1],
              preSourceId: "tri-pre-q-label",
              preXSourceId: "tri-pre-q-x",
              preYSourceId: "tri-pre-q-y",
              imageSourceId: "tri-img-q-label",
              imageXSourceId: "tri-img-q-x",
              imageYSourceId: "tri-img-q-y",
            },
            R: {
              pre: [2, 5],
              image: [7, 2],
              preSourceId: "tri-pre-r-label",
              preXSourceId: "tri-pre-r-x",
              preYSourceId: "tri-pre-r-y",
              imageSourceId: "tri-img-r-label",
              imageXSourceId: "tri-img-r-x",
              imageYSourceId: "tri-img-r-y",
            },
          },
          table: {
            x: "x",
            y: "y",
            pointImage: "Point P\u2019",
            pointPreImage: "Point P",
            translation: "Translation",
            reveal: "Reveal",
            imageX: "6",
            imageY: "-1",
            preImageX: "1",
            preImageY: "2",
            revealConfig: {
              xBase: "6",
              xSubtract: "1",
              xResult: "5",
              yBase: "-1",
              ySubtract: "2",
              yResult: "-3",
              operator: " - ",
            },
          },
          resultHtml:
            '<span class="translation-rule">The translation rule is <br>(+5, -3).</span><br>The point has moved<br>5 units to the right and<br>3 units downward',
        },
        line: {
          questionPlain:
            '<span class="overline-text">MN</span> has endpoints <span id="line-pre-m-label">M</span>(<span id="line-pre-m-x">2</span>,<span id="line-pre-m-y">1</span>) and <span id="line-pre-n-label">N</span>(<span id="line-pre-n-x">4</span>,<span id="line-pre-n-y">5</span>). After a translation,<br> the image endpoints are <span id="line-img-m-label">M\u2019</span>(<span id="line-img-m-x">8</span>,<span id="line-img-m-y">3</span>) and <span id="line-img-n-label">N\u2019</span>(<span id="line-img-n-x">10</span>,<span id="line-img-n-y">7</span>). Find the translation.',
          questionHighlighted:
            '<span class="overline-text">MN</span> has endpoints <span class="scenario-highlight scenario-object"><span id="line-pre-m-label">M</span>(<span id="line-pre-m-x">2</span>,<span id="line-pre-m-y">1</span>)</span> and <span class="scenario-highlight scenario-object"><span id="line-pre-n-label">N</span>(<span id="line-pre-n-x">4</span>,<span id="line-pre-n-y">5</span>)</span>. After a translation,<br> the image endpoints are <span class="scenario-highlight scenario-image"><span id="line-img-m-label">M\u2019</span>(<span id="line-img-m-x">8</span>,<span id="line-img-m-y">3</span>)</span> and <span class="scenario-highlight scenario-image"><span id="line-img-n-label">N\u2019</span>(<span id="line-img-n-x">10</span>,<span id="line-img-n-y">7</span>)</span>. Find the translation.',
          options: ["M", "N"],
          id: "line",
          pointLabelPrefix: "Point ",
          imageMark: "\u2019",
          points: {
            M: {
              pre: [2, 1],
              image: [8, 3],
              preSourceId: "line-pre-m-label",
              preXSourceId: "line-pre-m-x",
              preYSourceId: "line-pre-m-y",
              imageSourceId: "line-img-m-label",
              imageXSourceId: "line-img-m-x",
              imageYSourceId: "line-img-m-y",
            },
            N: {
              pre: [4, 5],
              image: [10, 7],
              preSourceId: "line-pre-n-label",
              preXSourceId: "line-pre-n-x",
              preYSourceId: "line-pre-n-y",
              imageSourceId: "line-img-n-label",
              imageXSourceId: "line-img-n-x",
              imageYSourceId: "line-img-n-y",
            },
          },
          table: {
            x: "x",
            y: "y",
            pointImage: "Point M\u2019",
            pointPreImage: "Point M",
            translation: "Translation",
            reveal: "Reveal",
            imageX: "8",
            imageY: "3",
            preImageX: "2",
            preImageY: "1",
            revealConfig: {
              xBase: "8",
              xSubtract: "2",
              xResult: "6",
              yBase: "3",
              ySubtract: "1",
              yResult: "2",
              operator: " - ",
            },
          },
          resultHtml:
            '<span class="translation-rule">The translation rule is <br>(+6, +2).</span><br>The point has moved<br>6 units to the right and<br>2 units upward',
        },
      },
      graph: {
        objectPointLabel: "A(2,3)",
        imagePointLabel: "A'(7,1)",
        positiveSteps: ["+1", "+2", "+3", "+4", "+5"],
        negativeSteps: ["-1", "-2"],
      },
      verification: {
        ruleHtml:
          'The translation rule is<br><span class="translation-rule">(+6, +2).</span>',
        navTextDone: "Tap \u00bb to continue",
        mLabel: "M (2,1)",
        nLabel: "N (4,5)",
        mPrimeLabel: "M\u2019 (8,3)",
        nPrimeLabel: "N\u2019 (10,7)",
        positiveSteps: ["+1", "+2", "+3", "+4", "+5", "+6"],
        upwardSteps: ["+1", "+2"],
      },
      final: {
        heading: "",
        text: "Great job! You can now find the translation (units of movement) <br>when the pre-image coordinates and image coordinates are given.",
        buttonText: "START OVER",
      },
      steps: {
        1: {
          navText: "Tap \u00bb to start solving the question",
        },
        2: {
          navTextButton: "Tap the button",
          navTextDone: "Tap \u00bb to verify",
        },
        3: {
          navTextButton: "Tap the button",
          navTextDone: "Tap \u00bb to see next question",
        },
        4: {
          navText: "Enter the number using numpad",
          navTextDone: "Tap \u00bb to see next question",
        },
        5: {
          navText: "Drag the slider to move the figure",
          navTextDone: "Tap \u00bb to see next question",
        },
        6: {
          navText: "Tap \u00bb to start solving the question",
        },
        8: {
          navText: "Tap the button",
          navTextDone: "Tap \u00bb to see next question",
        },
        9: {
          navText: "Tap \u00bb to start solving the question",
        },
        11: {
          navText: "Tap the button",
          navTextDone: "Tap \u00bb to verify",
        },
        12: {
          navTextDone: "Tap \u00bb to continue",
        },
      },
    },
  },
  id: {
    app: {
      colors: {
        object: "#fb9b5b",
        image: "#46c5ce",
        transformation: "#bd78dd",
      },
      nav: {
        previousSymbol: "\u00ab",
        nextSymbol: "\u00bb",
      },
      start: {
        heading: "Menemukan Translasi",
        text: "Diberikan koordinat pra-bayangan dan koordinat bayangan,<br>temukan translasi (satuan perpindahan).<br><br><br>Klik MULAI untuk memulai!",
        buttonText: "MULAI",
      },
      question: {
        text: 'Titik pra-bayangan <span id="fly-pre-label" class="fly-source">A</span>(<span id="fly-pre-x" class="fly-source">2</span>,<span id="fly-pre-y" class="fly-source">3</span>) bergerak ke titik bayangan <span id="fly-image-label" class="fly-source">A\'</span>(<span id="fly-image-x" class="fly-source">7</span>,<span id="fly-image-y" class="fly-source">1</span>).<br>Temukan translasinya.',
      },
      table: {
        x: "x",
        y: "y",
        pointImage: "Titik A'",
        pointPreImage: "Titik A",
        translation: "Translasi",
        reveal: "Ungkap",
        imageX: "7",
        imageY: "1",
        preImageX: "2",
        preImageY: "3",
        revealConfig: {
          xBase: "7",
          xSubtract: "2",
          xResult: "5",
          yBase: "1",
          ySubtract: "3",
          yResult: "-2",
          operator: " - ",
        },
      },
      rightPanel: {
        instruction:
          "Cukup kurangi koordinat pra-bayangan dari koordinat bayangan.",
        resultHtml:
          '<span class="translation-rule">Aturan translasinya adalah (+5, -2).</span><br>Titik tersebut bergerak<br>5 satuan ke kanan dan<br>2 satuan ke bawah',
        translateButton: "TRANSLASI",
      },
      practice: {
        questionText:
          'Temukan translasi untuk bayangan <span class="image-text">A\'</span> ini.',
        navText: "Masukkan angka menggunakan numpad",
        navTextDone: "Ketuk \u00bb untuk melihat soal berikutnya",
        translationLabel: "Translasi:",
        submitLabel: "PERIKSA",
        leftLabel: "KIRI",
        rightLabel: "KANAN",
        downLabel: "BAWAH",
        upLabel: "ATAS",
        feedbackCorrect: "Benar!<br>Translasinya adalah (+4,+2)",
      },
      rectangle: {
        questionText:
          "Gunakan slider untuk memindahkan persegi panjang ke posisi bayangannya dan<br>temukan translasinya.",
        navText: "Geser slider untuk memindahkan bangun",
        navTextDone: "Ketuk \u00bb untuk melihat soal berikutnya",
        imagePositionText: "POSISI<br>BAYANGAN",
        leftLabel: "KIRI",
        rightLabel: "KANAN",
        downLabel: "BAWAH",
        upLabel: "ATAS",
        feedbackCorrect: "Benar!<br>Translasinya adalah (+4,+2)",
      },
      scenarioIntro: {
        explanation:
          "Dalam translasi, setiap titik pada bangun<br>bergerak sejauh jarak yang sama ke arah<br>yang sama.<br><br>Jadi, aturan translasi untuk setiap titik<br>akan sama.",
        choicePrompt:
          "Pilih salah satu titik untuk<br>menemukan aturan translasi",
        navSelect: "Pilih salah satu titik",
      },
      scenarios: {
        triangle: {
          questionPlain:
            'Segitiga PQR memiliki titik sudut <span id="tri-pre-p-label">P</span>(<span id="tri-pre-p-x">1</span>,<span id="tri-pre-p-y">2</span>), <span id="tri-pre-q-label">Q</span>(<span id="tri-pre-q-x">4</span>,<span id="tri-pre-q-y">2</span>), <span id="tri-pre-r-label">R</span>(<span id="tri-pre-r-x">2</span>,<span id="tri-pre-r-y">5</span>). Bayangannya memiliki<br>titik sudut <span id="tri-img-p-label">P\u2019</span>(<span id="tri-img-p-x">6</span>,<span id="tri-img-p-y">-1</span>), <span id="tri-img-q-label">Q\u2019</span>(<span id="tri-img-q-x">9</span>,<span id="tri-img-q-y">-1</span>), <span id="tri-img-r-label">R\u2019</span>(<span id="tri-img-r-x">7</span>,<span id="tri-img-r-y">2</span>). Temukan translasinya.',
          questionHighlighted:
            'Segitiga PQR memiliki titik sudut <span class="scenario-highlight scenario-object"><span id="tri-pre-p-label">P</span>(<span id="tri-pre-p-x">1</span>,<span id="tri-pre-p-y">2</span>)</span>, <span class="scenario-highlight scenario-object"><span id="tri-pre-q-label">Q</span>(<span id="tri-pre-q-x">4</span>,<span id="tri-pre-q-y">2</span>)</span>, <span class="scenario-highlight scenario-object"><span id="tri-pre-r-label">R</span>(<span id="tri-pre-r-x">2</span>,<span id="tri-pre-r-y">5</span>)</span>. Bayangannya memiliki<br>titik sudut <span class="scenario-highlight scenario-image"><span id="tri-img-p-label">P\u2019</span>(<span id="tri-img-p-x">6</span>,<span id="tri-img-p-y">-1</span>)</span>, <span class="scenario-highlight scenario-image"><span id="tri-img-q-label">Q\u2019</span>(<span id="tri-img-q-x">9</span>,<span id="tri-img-q-y">-1</span>)</span>, <span class="scenario-highlight scenario-image"><span id="tri-img-r-label">R\u2019</span>(<span id="tri-img-r-x">7</span>,<span id="tri-img-r-y">2</span>)</span>. Temukan translasinya.',
          options: ["P", "Q", "R"],
          id: "triangle",
          pointLabelPrefix: "Titik ",
          imageMark: "\u2019",
          points: {
            P: {
              pre: [1, 2],
              image: [6, -1],
              preSourceId: "tri-pre-p-label",
              preXSourceId: "tri-pre-p-x",
              preYSourceId: "tri-pre-p-y",
              imageSourceId: "tri-img-p-label",
              imageXSourceId: "tri-img-p-x",
              imageYSourceId: "tri-img-p-y",
            },
            Q: {
              pre: [4, 2],
              image: [9, -1],
              preSourceId: "tri-pre-q-label",
              preXSourceId: "tri-pre-q-x",
              preYSourceId: "tri-pre-q-y",
              imageSourceId: "tri-img-q-label",
              imageXSourceId: "tri-img-q-x",
              imageYSourceId: "tri-img-q-y",
            },
            R: {
              pre: [2, 5],
              image: [7, 2],
              preSourceId: "tri-pre-r-label",
              preXSourceId: "tri-pre-r-x",
              preYSourceId: "tri-pre-r-y",
              imageSourceId: "tri-img-r-label",
              imageXSourceId: "tri-img-r-x",
              imageYSourceId: "tri-img-r-y",
            },
          },
          table: {
            x: "x",
            y: "y",
            pointImage: "Titik P\u2019",
            pointPreImage: "Titik P",
            translation: "Translasi",
            reveal: "Ungkap",
            imageX: "6",
            imageY: "-1",
            preImageX: "1",
            preImageY: "2",
            revealConfig: {
              xBase: "6",
              xSubtract: "1",
              xResult: "5",
              yBase: "-1",
              ySubtract: "2",
              yResult: "-3",
              operator: " - ",
            },
          },
          resultHtml:
            '<span class="translation-rule">Aturan translasinya adalah (+5, -3).</span><br>Titik tersebut bergerak<br>5 satuan ke kanan dan<br>3 satuan ke bawah',
        },
        line: {
          questionPlain:
            '<span class="overline-text">MN</span> memiliki titik ujung <span id="line-pre-m-label">M</span>(<span id="line-pre-m-x">2</span>,<span id="line-pre-m-y">1</span>) dan <span id="line-pre-n-label">N</span>(<span id="line-pre-n-x">4</span>,<span id="line-pre-n-y">5</span>). Setelah translasi,<br> titik ujung bayangannya adalah <span id="line-img-m-label">M\u2019</span>(<span id="line-img-m-x">8</span>,<span id="line-img-m-y">3</span>) dan <span id="line-img-n-label">N\u2019</span>(<span id="line-img-n-x">10</span>,<span id="line-img-n-y">7</span>). Temukan translasinya.',
          questionHighlighted:
            '<span class="overline-text">MN</span> memiliki titik ujung <span class="scenario-highlight scenario-object"><span id="line-pre-m-label">M</span>(<span id="line-pre-m-x">2</span>,<span id="line-pre-m-y">1</span>)</span> dan <span class="scenario-highlight scenario-object"><span id="line-pre-n-label">N</span>(<span id="line-pre-n-x">4</span>,<span id="line-pre-n-y">5</span>)</span>. Setelah translasi,<br> titik ujung bayangannya adalah <span class="scenario-highlight scenario-image"><span id="line-img-m-label">M\u2019</span>(<span id="line-img-m-x">8</span>,<span id="line-img-m-y">3</span>)</span> dan <span class="scenario-highlight scenario-image"><span id="line-img-n-label">N\u2019</span>(<span id="line-img-n-x">10</span>,<span id="line-img-n-y">7</span>)</span>. Temukan translasinya.',
          options: ["M", "N"],
          id: "line",
          pointLabelPrefix: "Titik ",
          imageMark: "\u2019",
          points: {
            M: {
              pre: [2, 1],
              image: [8, 3],
              preSourceId: "line-pre-m-label",
              preXSourceId: "line-pre-m-x",
              preYSourceId: "line-pre-m-y",
              imageSourceId: "line-img-m-label",
              imageXSourceId: "line-img-m-x",
              imageYSourceId: "line-img-m-y",
            },
            N: {
              pre: [4, 5],
              image: [10, 7],
              preSourceId: "line-pre-n-label",
              preXSourceId: "line-pre-n-x",
              preYSourceId: "line-pre-n-y",
              imageSourceId: "line-img-n-label",
              imageXSourceId: "line-img-n-x",
              imageYSourceId: "line-img-n-y",
            },
          },
          table: {
            x: "x",
            y: "y",
            pointImage: "Titik M\u2019",
            pointPreImage: "Titik M",
            translation: "Translasi",
            reveal: "Ungkap",
            imageX: "8",
            imageY: "3",
            preImageX: "2",
            preImageY: "1",
            revealConfig: {
              xBase: "8",
              xSubtract: "2",
              xResult: "6",
              yBase: "3",
              ySubtract: "1",
              yResult: "2",
              operator: " - ",
            },
          },
          resultHtml:
            '<span class="translation-rule">Aturan translasinya adalah (+6, +2).</span><br>Titik tersebut bergerak<br>6 satuan ke kanan dan<br>2 satuan ke atas',
        },
      },
      graph: {
        objectPointLabel: "A(2,3)",
        imagePointLabel: "A'(7,1)",
        positiveSteps: ["+1", "+2", "+3", "+4", "+5"],
        negativeSteps: ["-1", "-2"],
      },
      verification: {
        ruleHtml:
          'Aturan translasinya adalah<br><span class="translation-rule">(+6, +2).</span>',
        navTextDone: "Ketuk \u00bb untuk melanjutkan",
        mLabel: "M (2,1)",
        nLabel: "N (4,5)",
        mPrimeLabel: "M\u2019 (8,3)",
        nPrimeLabel: "N\u2019 (10,7)",
        positiveSteps: ["+1", "+2", "+3", "+4", "+5", "+6"],
        upwardSteps: ["+1", "+2"],
      },
      final: {
        heading: "",
        text: "Bagus! Sekarang kamu dapat menemukan translasi (satuan perpindahan) <br>ketika koordinat pra-bayangan dan koordinat bayangan diberikan.",
        buttonText: "MULAI LAGI",
      },
      steps: {
        1: {
          navText: "Ketuk \u00bb untuk mulai menyelesaikan soal",
        },
        2: {
          navTextButton: "Ketuk tombol",
          navTextDone: "Ketuk \u00bb untuk memeriksa",
        },
        3: {
          navTextButton: "Ketuk tombol",
          navTextDone: "Ketuk \u00bb untuk melihat soal berikutnya",
        },
        4: {
          navText: "Masukkan angka menggunakan numpad",
          navTextDone: "Ketuk \u00bb untuk melihat soal berikutnya",
        },
        5: {
          navText: "Geser slider untuk memindahkan bangun",
          navTextDone: "Ketuk \u00bb untuk melihat soal berikutnya",
        },
        6: {
          navText: "Ketuk \u00bb untuk mulai menyelesaikan soal",
        },
        8: {
          navText: "Ketuk tombol",
          navTextDone: "Ketuk \u00bb untuk melihat soal berikutnya",
        },
        9: {
          navText: "Ketuk \u00bb untuk mulai menyelesaikan soal",
        },
        11: {
          navText: "Ketuk tombol",
          navTextDone: "Ketuk \u00bb untuk memeriksa",
        },
        12: {
          navTextDone: "Ketuk \u00bb untuk melanjutkan",
        },
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
