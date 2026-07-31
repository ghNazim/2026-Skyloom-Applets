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
        heading: "Activity Completed",
        text:
          "Great job! You can now find the image of a polygon<br>after a series of transformations — applying each step in order<br>and using each image as the object for the next.<br><br>Tap 'Start Over' to repeat this activity.",
        buttonText: "START OVER",
      },
      question: {
        rotation:
          'Find the image of polygon ABC, where <span class="seq-orange">A(3,2)</span>, <span class="seq-orange">B(5,2)</span>, and <span class="seq-orange">C(5,5)</span>,<br>after it is rotated <span class="seq-purple">90\u00b0 clockwise about the origin</span> and then translated by (2,3).',
        translation:
          'Find the image of polygon ABC, where A(3,2), B(5,2), and C(5,5),<br>after it is rotated 90\u00b0 clockwise about the origin and then <span class="seq-purple">translated by (2,3)</span>.',
        reflectionX:
          'Find the image of triangle ABC, where <span class="seq-orange">A(3,0)</span>, <span class="seq-orange">B(6,0)</span>, and <span class="seq-orange">C(5,4)</span>,<br>after it is <span class="seq-purple">reflected across x-axis</span> and then reflected across y-axis.',
        reflectionY:
          'Find the image of triangle ABC, where A(3,0), B(6,0), and C(5,4),<br>after it is reflected across x-axis and then <span class="seq-purple">reflected across</span> <span class="seq-purple">y-axis</span>.',
        reflectionY2:
          'Find the image of triangle ABC, where <span class="seq-orange">A(3,2)</span>, <span class="seq-orange">B(4,1)</span>, and <span class="seq-orange">C(4,5)</span>,<br>after it is <span class="seq-purple">reflected across y-axis</span> and then translated by (-4, -3).',
        translation2:
          'Find the image of triangle ABC, where A(3,2), B(4,1), and C(4,5),<br>after it is reflected across y-axis and then <span class="seq-purple">translated by (-4, -3)</span>.',
      },
      nav: {
        answer: "Tap using numpad to fill the highlighted box.",
        rotationDone: "Tap \u00bb to find the final position after translation.",
        translationDone: "Tap \u00bb for another challenge.",
        reflectionXDone: "Tap \u00bb to reflect the image across the y-axis.",
        reflectionYDone: "Tap \u00bb for another challenge.",
        reflectionY2Done: "Tap \u00bb to translate the image.",
        translation2Done: "Tap \u00bb to complete the activity.",
      },
      hints: {
        rotationDefault: "Rotation: 90\u00b0 clockwise about origin",
        rotationRule: "Rule:",
        translationDefault: "Translation by (2,3)",
        translationRule: "Rule:",
        translation2Default: "Translation by (-4,-3)",
        reflectionXDefault: "Reflection: across x-axis",
        reflectionXRule: "Rule:",
        reflectionYDefault: "Reflection: across y-axis",
        reflectionYRule: "Rule:",
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
          graph: {
            xMin: -2,
            xMax: 10,
            yMin: -6,
            yMax: 6,
          },
          originalPoints: {
            A: { x: 3, y: 2 },
            B: { x: 5, y: 2 },
            C: { x: 5, y: 5 },
          },
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
          demoMode: "translate",
          translation: { x: 2, y: 3 },
          graph: {
            xMin: -2,
            xMax: 10,
            yMin: -6,
            yMax: 6,
          },
          originalPoints: {
            A: { x: 3, y: 2 },
            B: { x: 5, y: 2 },
            C: { x: 5, y: 5 },
          },
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
        reflectionX: {
          key: "reflectionX",
          givenKeys: ["A", "B", "C"],
          answerKeys: ["A'", "B'", "C'"],
          defaultHintKey: "reflectionXDefault",
          ruleHintKey: "reflectionXRule",
          answerColor: "#ffc400",
          finalPolygonColor: "#ffc400",
          connectorMode: "reflectX",
          demoMode: "reflectX",
          demoPoints: ["C'"],
          labelPlacements: {
            "A'": "bottomLeft",
            "B'": "bottomRight",
          },
          graph: {
            xMin: -7,
            xMax: 7,
            yMin: -7,
            yMax: 7,
          },
          originalPoints: {
            A: { x: 3, y: 0 },
            B: { x: 6, y: 0 },
            C: { x: 5, y: 4 },
          },
          points: {
            A: { x: 3, y: 0 },
            B: { x: 6, y: 0 },
            C: { x: 5, y: 4 },
          },
          answers: {
            "A'": { x: 3, y: 0 },
            "B'": { x: 6, y: 0 },
            "C'": { x: 5, y: -4 },
          },
        },
        reflectionY: {
          key: "reflectionY",
          givenKeys: ["A'", "B'", "C'"],
          answerKeys: ["A''", "B''", "C''"],
          defaultHintKey: "reflectionYDefault",
          ruleHintKey: "reflectionYRule",
          answerColor: "#55d7ff",
          finalPolygonColor: "#55d7ff",
          connectorMode: "reflectY",
          demoMode: "reflectY",
          labelPlacements: {
            "A''": "top",
            "B''": "top",
          },
          graph: {
            xMin: -7,
            xMax: 7,
            yMin: -7,
            yMax: 7,
          },
          originalPoints: {
            A: { x: 3, y: 0 },
            B: { x: 6, y: 0 },
            C: { x: 5, y: 4 },
          },
          points: {
            "A'": { x: 3, y: 0 },
            "B'": { x: 6, y: 0 },
            "C'": { x: 5, y: -4 },
          },
          answers: {
            "A''": { x: -3, y: 0 },
            "B''": { x: -6, y: 0 },
            "C''": { x: -5, y: -4 },
          },
        },
        reflectionY2: {
          key: "reflectionY2",
          givenKeys: ["A", "B", "C"],
          answerKeys: ["A'", "B'", "C'"],
          defaultHintKey: "reflectionYDefault",
          ruleHintKey: "reflectionYRule",
          answerColor: "#ffc400",
          finalPolygonColor: "#ffc400",
          connectorMode: "reflectY",
          demoMode: "reflectY",
          labelPlacements: {
            "A'": "bottomRight",
          },
          graph: {
            xMin: -9,
            xMax: 5,
            yMin: -7,
            yMax: 7,
          },
          originalPoints: {
            A: { x: 3, y: 2 },
            B: { x: 4, y: 1 },
            C: { x: 4, y: 5 },
          },
          points: {
            A: { x: 3, y: 2 },
            B: { x: 4, y: 1 },
            C: { x: 4, y: 5 },
          },
          answers: {
            "A'": { x: -3, y: 2 },
            "B'": { x: -4, y: 1 },
            "C'": { x: -4, y: 5 },
          },
        },
        translation2: {
          key: "translation2",
          givenKeys: ["A'", "B'", "C'"],
          answerKeys: ["A''", "B''", "C''"],
          defaultHintKey: "translation2Default",
          ruleHintKey: "translationRule",
          answerColor: "#55d7ff",
          finalPolygonColor: "#55d7ff",
          connectorMode: "translateNegative43",
          demoMode: "translate",
          translation: { x: -4, y: -3 },
          labelPlacements: {
            "A''": "bottomRight",
          },
          graph: {
            xMin: -9,
            xMax: 5,
            yMin: -7,
            yMax: 7,
          },
          originalPoints: {
            A: { x: 3, y: 2 },
            B: { x: 4, y: 1 },
            C: { x: 4, y: 5 },
          },
          points: {
            "A'": { x: -3, y: 2 },
            "B'": { x: -4, y: 1 },
            "C'": { x: -4, y: 5 },
          },
          answers: {
            "A''": { x: -7, y: -1 },
            "B''": { x: -8, y: -2 },
            "C''": { x: -8, y: 2 },
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
        heading: "Aktivitas Selesai",
        text:
          "Kerja bagus! Sekarang kamu dapat menemukan bayangan sebuah poligon<br>setelah rangkaian transformasi — menerapkan setiap langkah secara berurutan<br>dan menggunakan setiap bayangan sebagai objek untuk langkah berikutnya.<br><br>Ketuk 'Mulai Lagi' untuk mengulang aktivitas ini.",
        buttonText: "MULAI LAGI",
      },
      question: {
        rotation:
          'Temukan bayangan poligon ABC, dengan <span class="seq-orange">A(3,2)</span>, <span class="seq-orange">B(5,2)</span>, dan <span class="seq-orange">C(5,5)</span>,<br>setelah dirotasi <span class="seq-purple">90\u00b0 searah jarum jam terhadap titik asal</span> lalu ditranslasi oleh (2,3).',
        translation:
          'Temukan bayangan poligon ABC, dengan A(3,2), B(5,2), dan C(5,5),<br>setelah dirotasi 90\u00b0 searah jarum jam terhadap titik asal lalu <span class="seq-purple">ditranslasi oleh (2,3)</span>.',
        reflectionX:
          'Temukan bayangan segitiga ABC, dengan <span class="seq-orange">A(3,0)</span>, <span class="seq-orange">B(6,0)</span>, dan <span class="seq-orange">C(5,4)</span>,<br>setelah <span class="seq-purple">dicerminkan terhadap sumbu-x</span> lalu dicerminkan terhadap sumbu-y.',
        reflectionY:
          'Temukan bayangan segitiga ABC, dengan A(3,0), B(6,0), dan C(5,4),<br>setelah dicerminkan terhadap sumbu-x lalu <span class="seq-purple">dicerminkan terhadap</span> <span class="seq-purple">sumbu-y</span>.',
        reflectionY2:
          'Temukan bayangan segitiga ABC, dengan <span class="seq-orange">A(3,2)</span>, <span class="seq-orange">B(4,1)</span>, dan <span class="seq-orange">C(4,5)</span>,<br>setelah <span class="seq-purple">dicerminkan terhadap sumbu-y</span> lalu ditranslasi oleh (-4, -3).',
        translation2:
          'Temukan bayangan segitiga ABC, dengan A(3,2), B(4,1), dan C(4,5),<br>setelah dicerminkan terhadap sumbu-y lalu <span class="seq-purple">ditranslasi oleh (-4, -3)</span>.',
      },
      nav: {
        answer: "Ketuk numpad untuk mengisi kotak yang disorot.",
        rotationDone:
          "Ketuk \u00bb untuk menemukan posisi akhir setelah translasi.",
        translationDone: "Ketuk \u00bb untuk tantangan lain.",
        reflectionXDone: "Ketuk \u00bb untuk mencerminkan bayangan terhadap sumbu-y.",
        reflectionYDone: "Ketuk \u00bb untuk tantangan lain.",
        reflectionY2Done: "Ketuk \u00bb untuk mentranslasi bayangan.",
        translation2Done: "Ketuk \u00bb untuk menyelesaikan aktivitas.",
      },
      hints: {
        rotationDefault: "Rotasi: 90\u00b0 searah jarum jam terhadap titik asal",
        rotationRule: "Aturan:",
        translationDefault: "Translasi oleh (2,3)",
        translationRule: "Aturan:",
        translation2Default: "Translasi oleh (-4,-3)",
        reflectionXDefault: "Pencerminan: terhadap sumbu-x",
        reflectionXRule: "Aturan:",
        reflectionYDefault: "Pencerminan: terhadap sumbu-y",
        reflectionYRule: "Aturan:",
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
          graph: {
            xMin: -2,
            xMax: 10,
            yMin: -6,
            yMax: 6,
          },
          originalPoints: {
            A: { x: 3, y: 2 },
            B: { x: 5, y: 2 },
            C: { x: 5, y: 5 },
          },
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
          demoMode: "translate",
          translation: { x: 2, y: 3 },
          graph: {
            xMin: -2,
            xMax: 10,
            yMin: -6,
            yMax: 6,
          },
          originalPoints: {
            A: { x: 3, y: 2 },
            B: { x: 5, y: 2 },
            C: { x: 5, y: 5 },
          },
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
        reflectionX: {
          key: "reflectionX",
          givenKeys: ["A", "B", "C"],
          answerKeys: ["A'", "B'", "C'"],
          defaultHintKey: "reflectionXDefault",
          ruleHintKey: "reflectionXRule",
          answerColor: "#ffc400",
          finalPolygonColor: "#ffc400",
          connectorMode: "reflectX",
          demoMode: "reflectX",
          demoPoints: ["C'"],
          labelPlacements: {
            "A'": "bottomLeft",
            "B'": "bottomRight",
          },
          graph: {
            xMin: -7,
            xMax: 7,
            yMin: -7,
            yMax: 7,
          },
          originalPoints: {
            A: { x: 3, y: 0 },
            B: { x: 6, y: 0 },
            C: { x: 5, y: 4 },
          },
          points: {
            A: { x: 3, y: 0 },
            B: { x: 6, y: 0 },
            C: { x: 5, y: 4 },
          },
          answers: {
            "A'": { x: 3, y: 0 },
            "B'": { x: 6, y: 0 },
            "C'": { x: 5, y: -4 },
          },
        },
        reflectionY: {
          key: "reflectionY",
          givenKeys: ["A'", "B'", "C'"],
          answerKeys: ["A''", "B''", "C''"],
          defaultHintKey: "reflectionYDefault",
          ruleHintKey: "reflectionYRule",
          answerColor: "#55d7ff",
          finalPolygonColor: "#55d7ff",
          connectorMode: "reflectY",
          demoMode: "reflectY",
          labelPlacements: {
            "A''": "top",
            "B''": "top",
          },
          graph: {
            xMin: -7,
            xMax: 7,
            yMin: -7,
            yMax: 7,
          },
          originalPoints: {
            A: { x: 3, y: 0 },
            B: { x: 6, y: 0 },
            C: { x: 5, y: 4 },
          },
          points: {
            "A'": { x: 3, y: 0 },
            "B'": { x: 6, y: 0 },
            "C'": { x: 5, y: -4 },
          },
          answers: {
            "A''": { x: -3, y: 0 },
            "B''": { x: -6, y: 0 },
            "C''": { x: -5, y: -4 },
          },
        },
        reflectionY2: {
          key: "reflectionY2",
          givenKeys: ["A", "B", "C"],
          answerKeys: ["A'", "B'", "C'"],
          defaultHintKey: "reflectionYDefault",
          ruleHintKey: "reflectionYRule",
          answerColor: "#ffc400",
          finalPolygonColor: "#ffc400",
          connectorMode: "reflectY",
          demoMode: "reflectY",
          labelPlacements: {
            "A'": "bottomRight",
          },
          graph: {
            xMin: -9,
            xMax: 5,
            yMin: -7,
            yMax: 7,
          },
          originalPoints: {
            A: { x: 3, y: 2 },
            B: { x: 4, y: 1 },
            C: { x: 4, y: 5 },
          },
          points: {
            A: { x: 3, y: 2 },
            B: { x: 4, y: 1 },
            C: { x: 4, y: 5 },
          },
          answers: {
            "A'": { x: -3, y: 2 },
            "B'": { x: -4, y: 1 },
            "C'": { x: -4, y: 5 },
          },
        },
        translation2: {
          key: "translation2",
          givenKeys: ["A'", "B'", "C'"],
          answerKeys: ["A''", "B''", "C''"],
          defaultHintKey: "translation2Default",
          ruleHintKey: "translationRule",
          answerColor: "#55d7ff",
          finalPolygonColor: "#55d7ff",
          connectorMode: "translateNegative43",
          demoMode: "translate",
          translation: { x: -4, y: -3 },
          labelPlacements: {
            "A''": "bottomRight",
          },
          graph: {
            xMin: -9,
            xMax: 5,
            yMin: -7,
            yMax: 7,
          },
          originalPoints: {
            A: { x: 3, y: 2 },
            B: { x: 4, y: 1 },
            C: { x: 4, y: 5 },
          },
          points: {
            "A'": { x: -3, y: 2 },
            "B'": { x: -4, y: 1 },
            "C'": { x: -4, y: 5 },
          },
          answers: {
            "A''": { x: -7, y: -1 },
            "B''": { x: -8, y: -2 },
            "C''": { x: -8, y: 2 },
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
