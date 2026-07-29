const DATA = {
  en: {
    app: {
      start: {
        heading: "Series of Transformations",
        text:
          "Let's find the coordinates of image for an object after it is<br>transformed multiple times.<br><br>Tap START to begin!",
        buttonText: "START",
      },
      final: {
        heading: "Great work!",
        text:
          "You found the image coordinates after rotation and translation.",
        buttonText: "START OVER",
      },
      question: {
        rotation:
          'Find the image of polygon ABC, where <span class="seq-orange">A(3,2)</span>, <span class="seq-orange">B(5,2)</span>, and <span class="seq-orange">C(5,5)</span>,<br>after it is rotated <span class="seq-purple">90\u00b0 clockwise about the origin</span> and then translated by (2,3).',
        translation:
          'Find the image of polygon ABC, where A(3,2), B(5,2), and C(5,5),<br>after it is rotated 90\u00b0 clockwise about the origin and then <span class="seq-purple">translated by (2,3)</span>.',
      },
      nav: {
        answer: "Tap using numpad to fill the highlighted box.",
        rotationDone: "Tap \u00bb to find the final position after translation.",
        translationDone: "Tap \u00bb for another challenge.",
      },
      hints: {
        rotationDefault: "Rotation: 90\u00b0 clockwise about origin",
        rotationRule: "Rule:",
        translationDefault: "Translation by (2,3)",
        translationRule: "Rule:",
      },
      graph: {
        xAxis: "x",
        yAxis: "y",
        origin: "O",
      },
      labels: {
        given: "Given",
        answer: "Answer",
      },
      stages: {
        rotation: {
          key: "rotation",
          givenKeys: ["A", "B", "C"],
          answerKeys: ["A'", "B'", "C'"],
          defaultHintKey: "rotationDefault",
          ruleHintKey: "rotationRule",
          answerColor: "#ffc400",
          finalPolygonColor: "#ffc400",
          connectorMode: "rotate90Clockwise",
          points: {
            A: { x: 3, y: 2 },
            B: { x: 5, y: 2 },
            C: { x: 5, y: 5 },
          },
          answers: {
            "A'": { x: 2, y: -3 },
            "B'": { x: 2, y: -5 },
            "C'": { x: 5, y: -5 },
          },
        },
        translation: {
          key: "translation",
          givenKeys: ["A'", "B'", "C'"],
          answerKeys: ["A''", "B''", "C''"],
          defaultHintKey: "translationDefault",
          ruleHintKey: "translationRule",
          answerColor: "#55d7ff",
          finalPolygonColor: "#55d7ff",
          connectorMode: "translate23",
          points: {
            "A'": { x: 2, y: -3 },
            "B'": { x: 2, y: -5 },
            "C'": { x: 5, y: -5 },
          },
          answers: {
            "A''": { x: 4, y: 0 },
            "B''": { x: 4, y: -2 },
            "C''": { x: 7, y: -2 },
          },
        },
      },
      originalPoints: {
        A: { x: 3, y: 2 },
        B: { x: 5, y: 2 },
        C: { x: 5, y: 5 },
      },
      common: {
        backspace: "Backspace",
        enter: "Enter",
        hint: "Hint",
        plus: "Plus",
        minus: "Minus",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Rangkaian Transformasi",
        text:
          "Mari kita cari koordinat bayangan suatu objek setelah<br>ditransformasi beberapa kali.<br><br>Ketuk MULAI untuk memulai!",
        buttonText: "MULAI",
      },
      final: {
        heading: "Kerja bagus!",
        text:
          "Kamu menemukan koordinat bayangan setelah rotasi dan translasi.",
        buttonText: "MULAI LAGI",
      },
      question: {
        rotation:
          'Temukan bayangan poligon ABC, dengan <span class="seq-orange">A(3,2)</span>, <span class="seq-orange">B(5,2)</span>, dan <span class="seq-orange">C(5,5)</span>,<br>setelah dirotasi <span class="seq-purple">90\u00b0 searah jarum jam terhadap titik asal</span> lalu ditranslasi oleh (2,3).',
        translation:
          'Temukan bayangan poligon ABC, dengan A(3,2), B(5,2), dan C(5,5),<br>setelah dirotasi 90\u00b0 searah jarum jam terhadap titik asal lalu <span class="seq-purple">ditranslasi oleh (2,3)</span>.',
      },
      nav: {
        answer: "Ketuk numpad untuk mengisi kotak yang disorot.",
        rotationDone:
          "Ketuk \u00bb untuk menemukan posisi akhir setelah translasi.",
        translationDone: "Ketuk \u00bb untuk tantangan lain.",
      },
      hints: {
        rotationDefault: "Rotasi: 90\u00b0 searah jarum jam terhadap titik asal",
        rotationRule: "Aturan:",
        translationDefault: "Translasi oleh (2,3)",
        translationRule: "Aturan:",
      },
      graph: {
        xAxis: "x",
        yAxis: "y",
        origin: "O",
      },
      labels: {
        given: "Diketahui",
        answer: "Jawaban",
      },
      stages: {
        rotation: {
          key: "rotation",
          givenKeys: ["A", "B", "C"],
          answerKeys: ["A'", "B'", "C'"],
          defaultHintKey: "rotationDefault",
          ruleHintKey: "rotationRule",
          answerColor: "#ffc400",
          finalPolygonColor: "#ffc400",
          connectorMode: "rotate90Clockwise",
          points: {
            A: { x: 3, y: 2 },
            B: { x: 5, y: 2 },
            C: { x: 5, y: 5 },
          },
          answers: {
            "A'": { x: 2, y: -3 },
            "B'": { x: 2, y: -5 },
            "C'": { x: 5, y: -5 },
          },
        },
        translation: {
          key: "translation",
          givenKeys: ["A'", "B'", "C'"],
          answerKeys: ["A''", "B''", "C''"],
          defaultHintKey: "translationDefault",
          ruleHintKey: "translationRule",
          answerColor: "#55d7ff",
          finalPolygonColor: "#55d7ff",
          connectorMode: "translate23",
          points: {
            "A'": { x: 2, y: -3 },
            "B'": { x: 2, y: -5 },
            "C'": { x: 5, y: -5 },
          },
          answers: {
            "A''": { x: 4, y: 0 },
            "B''": { x: 4, y: -2 },
            "C''": { x: 7, y: -2 },
          },
        },
      },
      originalPoints: {
        A: { x: 3, y: 2 },
        B: { x: 5, y: 2 },
        C: { x: 5, y: 5 },
      },
      common: {
        backspace: "Backspace",
        enter: "Enter",
        hint: "Petunjuk",
        plus: "Plus",
        minus: "Minus",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
