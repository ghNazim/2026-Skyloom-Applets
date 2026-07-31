const SHARED_RULE_OPTIONS = [
  "(x, y) &rarr; (&minus;x, y)",
  "(x, y) &rarr; (&minus;x, &minus;y)",
  "(x, y) &rarr; (x, &minus;y)",
  "(x, y) &rarr; (y, x)",
];

const DATA = {
  en: {
    app: {
      title: "Equation of the Reflected Line",
      start: {
        heading: "Equation of the reflected line",
        text:
          "Let&rsquo;s practice how to find the equation of the reflected line by<br>substituting the reflection rule into the given line equation.<br>Click <y>START</y> to begin!",
        buttonText: "START",
      },
      completion: {
        heading: "Activity Completed",
        text:
          "Great job! You can now find the equation of a reflected line by<br>substituting the reflection rule into the equation of the original line.<br>Click START OVER to re-do this activity!",
        buttonText: "START OVER",
      },
      common: {
        labels: {
          equationGivenLine: "Equation of given line:",
          lineReflection: "Line of reflection:",
          coordinatesImage: "Coordinates of image:",
          ruleReflection: "Rule for reflection:",
          givenLine: "Given line:",
          equationReflectedLine: "Equation of the reflected line:",
          or: "or",
        },
        numpad: {
          clearLabel: "Clear",
          submitLabel: "Submit",
          plusLabel: "Plus",
          minusLabel: "Minus",
        },
      },
      questions: [
        // {
        //   id: "x-axis-3x-minus-2y",
        //   problem:
        //     "Find the equation of image of line 3x &minus; 2y = 1 when reflected across x&minus;axis.",
        //   lineEquation: "3x &minus; 2y = 1",
        //   reflectionAxis: "x&minus;axis",
        //   ruleLineLabel: "Rule for reflection across x&minus;axis:",
        //   ruleQuestion: "What is the rule for reflection across x&minus;axis?",
        //   ruleOptions: SHARED_RULE_OPTIONS,
        //   ruleCorrectIndex: 2,
        //   ruleAnswer: { left: ["x", "y"], right: ["x", "&minus;y"] },
        //   coordinateCard: {
        //     xBlue: ["x' = ", "x"],
        //     xYellow: "x = x'",
        //     yBlue: ["y' = ", "&minus;y"],
        //     yYellow: "y = &minus;y'",
        //   },
        //   step3: {
        //     ruleX: "x = x'",
        //     ruleY: "y = &minus;y'",
        //     givenParts: [{ text: "3(" }, { var: "x" }, { text: ") &minus; 2(" }, { var: "y" }, { text: ") = 1" }],
        //     answerParts: [{ text: "3" }, { box: "x" }, { text: " &minus; 2" }, { box: "y" }, { text: " = 1" }],
        //     answers: { x: "x'", y: "-y'" },
        //   },
        //   step4: {
        //     substitutionParts: [{ text: "3" }, { value: "x'", color: "x" }, { text: " &minus; 2" }, { value: "&minus;y'", color: "y" }, { text: " = 1" }],
        //     simplifyKind: "minusTimesNegative",
        //     finalAnswer: "3x + 2y = 1",
        //     options: ["3x + 2y = 1", "3x &minus; 2y = 1", "&minus;3x + 2y = 1", "3x &minus; 2y = &minus;1"],
        //     correctIndex: 0,
        //   },
        // },
        {
          id: "x-axis-4x-plus-y",
          problem:
            "Find the equation of image of line 4x + y = 6 when reflected across x&minus;axis.",
          lineEquation: "4x + y = 6",
          reflectionAxis: "x&minus;axis",
          ruleLineLabel: "Rule for reflection across x&minus;axis:",
          ruleQuestion: "What is the rule for reflection across x&minus;axis?",
          ruleOptions: SHARED_RULE_OPTIONS,
          ruleCorrectIndex: 2,
          ruleAnswer: { left: ["x", "y"], right: ["x", "&minus;y"] },
          coordinateCard: {
            xBlue: ["x' = ", "x"],
            xYellow: "x = x'",
            yBlue: ["y' = ", "&minus;y"],
            yYellow: "y = &minus;y'",
          },
          step3: {
            ruleX: "x = x'",
            ruleY: "y = &minus;y'",
            givenParts: [{ text: "4(" }, { var: "x" }, { text: ") + (" }, { var: "y" }, { text: ") = 6" }],
            answerParts: [{ text: "4" }, { box: "x" }, { text: " + " }, { box: "y" }, { text: " = 6" }],
            answers: { x: "x'", y: "-y'" },
          },
          step4: {
            substitutionParts: [{ text: "4" }, { value: "x'", color: "x" }, { text: " + " }, { value: "&minus;y'", color: "y" }, { text: " = 6" }],
            simplifyKind: "plusNegative",
            finalAnswer: "4x &minus; y = 6",
            options: ["4x &minus; y = 6", "4x + y = 6", "&minus;4x + y = 6", "4x &minus; y = &minus;6"],
            correctIndex: 0,
          },
        },
        {
          id: "line-y-equals-negative-x",
          problem:
            "Find the equation of the image of the line 5x + y &minus; 6 = 0 when reflected across the line y = &minus;x.",
          lineEquation: "5x + y &minus; 6 = 0",
          reflectionAxis: "y = &minus;x",
          ruleLineLabel: "Rule for reflection across y = &minus;x:",
          ruleQuestion: "What is the rule for reflection across (y = &minus;x)?",
          ruleOptions: ["(x, y) &rarr; (x, y)", "(x, y) &rarr; (y, x)", "(x, y) &rarr; (&minus;y, &minus;x)"],
          ruleCorrectIndex: 2,
          ruleAnswer: { left: ["x", "y"], right: ["&minus;y", "&minus;x"] },
          coordinateCard: {
            xBlue: ["x' = ", "&minus;y"],
            xYellow: "y = &minus;x'",
            yBlue: ["y' = ", "&minus;x"],
            yYellow: "x = &minus;y'",
          },
          step3: {
            ruleX: "x = &minus;y'",
            ruleY: "y = &minus;x'",
            givenParts: [{ text: "5(" }, { var: "x" }, { text: ") + (" }, { var: "y" }, { text: ") &minus; 6 = 0" }],
            answerParts: [{ text: "5" }, { box: "x" }, { text: " + " }, { box: "y" }, { text: " &minus; 6 = 0" }],
            answers: { x: "-y'", y: "-x'" },
          },
          step4: {
            substitutionParts: [{ text: "5" }, { value: "&minus;y'", color: "y" }, { text: " + " }, { value: "&minus;x'", color: "x" }, { text: " &minus; 6 = 0" }],
            simplifyKind: "reflectNegativeDiagonal",
            finalAnswer: "x + 5y + 6 = 0",
            options: ["x + 5y &minus; 6 = 0", "x &minus; 5y + 6 = 0", "&minus;x + 5y + 6 = 0", "x + 5y + 6 = 0"],
            correctIndex: 3,
          },
        },
        {
          id: "line-x-equals-negative-2",
          problem:
            "Find the equation of the image of the line &minus;2x &minus; y + 1 = 0 when reflected across the line x = &minus;2.",
          lineEquation: "&minus;2x &minus; y + 1 = 0",
          reflectionAxis: "x = &minus;2",
          reflectionAxisValue: "&minus;2",
          ruleLineLabel: "Rule for reflection across x = &minus;2:",
          ruleQuestion: "What is the rule for reflection across (x = &minus;2)?",
          ruleOptions: [
            "(x, y) &rarr; (x, y + 2k)",
            "(x, y) &rarr; (&minus;x + 2k, y)",
            "(x, y) &rarr; (x, y &minus; 2k)",
          ],
          ruleCorrectIndex: 1,
          ruleAnswer: { left: ["x", "y"], right: ["&minus;x + 2k", "y"] },
          coordinateCard: {
            xBlue: ["x' = ", "&minus;x + 2k"],
            xYellow: "x = 2k &minus; x'",
            yBlue: ["y' = ", "y"],
            yYellow: "y = y'",
          },
          step3: {
            ruleX: "x = 2k &minus; x'",
            ruleY: "y = y'",
            givenParts: [{ text: "&minus;2(" }, { var: "x" }, { text: ") &minus; (" }, { var: "y" }, { text: ") + 1 = 0" }],
            answerParts: [{ text: "&minus;2" }, { box: "x" }, { text: " &minus; " }, { box: "y" }, { text: " + 1 = 0" }],
            answers: { x: "2k-x'", y: "y'" },
          },
          step4: {
            substitutionParts: [{ text: "&minus;2" }, { value: "2k &minus; x'", color: "x" }, { text: " &minus; " }, { value: "y'", color: "y" }, { text: " + 1 = 0" }],
            simplifyKind: "verticalLineK",
            finalAnswer: "2x &minus; y + 9 = 0",
            options: ["2x &minus; y &minus; 9 = 0", "2x &minus; y + 9 = 0", "2x + y + 9 = 0", "&minus;2x &minus; y + 9 = 0"],
            correctIndex: 1,
          },
        },
      ],
      steps: {
        step1: {
          nav: { animating: "", ready: "Tap &raquo; to continue." },
          rightPanel: { exploreDetails: "Let&rsquo;s explore the details given in the question." },
        },
        step2: {
          nav: { chooseRule: "Tap the correct option.", ready: "Tap &raquo; to begin substitution." },
        },
        step3: {
          nav: { numpadActive: "Tap using numpad to fill the highlighted box.", ready: "Tap &raquo; for last step." },
          rightPanel: { numpadHelp: "Substitute the rule into the<br>equation of given line" },
          feedback: {
            wrongX: "Oops!<br>Look at the reflection rule and fill in the x&minus;coordinate part of the image here.",
            wrongY: "Oops!<br>Look at the reflection rule and fill in the y&minus;coordinate part of the image here.",
          },
        },
        step4: {
          nav: { chooseSimplified: "Tap the correct option.", ready: "Tap &raquo; for another challenge.", conclude: "Tap &raquo; to conclude." },
          rightPanel: { simplifyTitle: "The simplified form of the given equation is:" },
          feedback: { tryAgain: "Oops! Try again.", wellDone: "Well done!" },
        },
      },
    },
  },
  id: {
    app: {
      title: "Persamaan Garis Hasil Refleksi",
      start: {
        heading: "Persamaan garis hasil refleksi",
        text:
          "Mari berlatih menentukan persamaan garis hasil refleksi dengan<br>mensubstitusikan aturan refleksi ke persamaan garis yang diberikan.<br>Klik <y>MULAI</y> untuk memulai!",
        buttonText: "MULAI",
      },
      completion: {
        heading: "Aktivitas Selesai",
        text:
          "Hebat! Sekarang kamu dapat menentukan persamaan garis hasil refleksi dengan<br>mensubstitusikan aturan refleksi ke persamaan garis asal.<br>Klik MULAI LAGI untuk mengulang aktivitas ini!",
        buttonText: "MULAI LAGI",
      },
      common: {
        labels: {
          equationGivenLine: "Persamaan garis yang diberikan:",
          lineReflection: "Garis refleksi:",
          coordinatesImage: "Koordinat bayangan:",
          ruleReflection: "Aturan refleksi:",
          givenLine: "Garis yang diberikan:",
          equationReflectedLine: "Persamaan garis hasil refleksi:",
          or: "atau",
        },
        numpad: {
          clearLabel: "Hapus",
          submitLabel: "Kirim",
          plusLabel: "Tambah",
          minusLabel: "Kurang",
        },
      },
      questions: [
        {
          id: "x-axis-4x-plus-y",
          problem:
            "Temukan persamaan bayangan garis 4x + y = 6 ketika direfleksikan terhadap sumbu x.",
          lineEquation: "4x + y = 6",
          reflectionAxis: "sumbu x",
          ruleLineLabel: "Aturan refleksi terhadap sumbu x:",
          ruleQuestion: "Apakah aturan refleksi terhadap sumbu x?",
          ruleOptions: SHARED_RULE_OPTIONS,
          ruleCorrectIndex: 2,
          ruleAnswer: { left: ["x", "y"], right: ["x", "&minus;y"] },
          coordinateCard: {
            xBlue: ["x' = ", "x"],
            xYellow: "x = x'",
            yBlue: ["y' = ", "&minus;y"],
            yYellow: "y = &minus;y'",
          },
          step3: {
            ruleX: "x = x'",
            ruleY: "y = &minus;y'",
            givenParts: [{ text: "4(" }, { var: "x" }, { text: ") + (" }, { var: "y" }, { text: ") = 6" }],
            answerParts: [{ text: "4" }, { box: "x" }, { text: " + " }, { box: "y" }, { text: " = 6" }],
            answers: { x: "x'", y: "-y'" },
          },
          step4: {
            substitutionParts: [{ text: "4" }, { value: "x'", color: "x" }, { text: " + " }, { value: "&minus;y'", color: "y" }, { text: " = 6" }],
            simplifyKind: "plusNegative",
            finalAnswer: "4x &minus; y = 6",
            options: ["4x &minus; y = 6", "4x + y = 6", "&minus;4x + y = 6", "4x &minus; y = &minus;6"],
            correctIndex: 0,
          },
        },
        {
          id: "line-y-equals-negative-x",
          problem:
            "Temukan persamaan bayangan garis 5x + y &minus; 6 = 0 ketika direfleksikan terhadap garis y = &minus;x.",
          lineEquation: "5x + y &minus; 6 = 0",
          reflectionAxis: "y = &minus;x",
          ruleLineLabel: "Aturan refleksi terhadap y = &minus;x:",
          ruleQuestion: "Apakah aturan refleksi terhadap (y = &minus;x)?",
          ruleOptions: ["(x, y) &rarr; (x, y)", "(x, y) &rarr; (y, x)", "(x, y) &rarr; (&minus;y, &minus;x)"],
          ruleCorrectIndex: 2,
          ruleAnswer: { left: ["x", "y"], right: ["&minus;y", "&minus;x"] },
          coordinateCard: {
            xBlue: ["x' = ", "&minus;y"],
            xYellow: "y = &minus;x'",
            yBlue: ["y' = ", "&minus;x"],
            yYellow: "x = &minus;y'",
          },
          step3: {
            ruleX: "x = &minus;y'",
            ruleY: "y = &minus;x'",
            givenParts: [{ text: "5(" }, { var: "x" }, { text: ") + (" }, { var: "y" }, { text: ") &minus; 6 = 0" }],
            answerParts: [{ text: "5" }, { box: "x" }, { text: " + " }, { box: "y" }, { text: " &minus; 6 = 0" }],
            answers: { x: "-y'", y: "-x'" },
          },
          step4: {
            substitutionParts: [{ text: "5" }, { value: "&minus;y'", color: "y" }, { text: " + " }, { value: "&minus;x'", color: "x" }, { text: " &minus; 6 = 0" }],
            simplifyKind: "reflectNegativeDiagonal",
            finalAnswer: "x + 5y + 6 = 0",
            options: ["x + 5y &minus; 6 = 0", "x &minus; 5y + 6 = 0", "&minus;x + 5y + 6 = 0", "x + 5y + 6 = 0"],
            correctIndex: 3,
          },
        },
        {
          id: "line-x-equals-negative-2",
          problem:
            "Temukan persamaan bayangan garis &minus;2x &minus; y + 1 = 0 ketika direfleksikan terhadap garis x = &minus;2.",
          lineEquation: "&minus;2x &minus; y + 1 = 0",
          reflectionAxis: "x = &minus;2",
          reflectionAxisValue: "&minus;2",
          ruleLineLabel: "Aturan refleksi terhadap x = &minus;2:",
          ruleQuestion: "Apakah aturan refleksi terhadap (x = &minus;2)?",
          ruleOptions: [
            "(x, y) &rarr; (x, y + 2k)",
            "(x, y) &rarr; (&minus;x + 2k, y)",
            "(x, y) &rarr; (x, y &minus; 2k)",
          ],
          ruleCorrectIndex: 1,
          ruleAnswer: { left: ["x", "y"], right: ["&minus;x + 2k", "y"] },
          coordinateCard: {
            xBlue: ["x' = ", "&minus;x + 2k"],
            xYellow: "x = 2k &minus; x'",
            yBlue: ["y' = ", "y"],
            yYellow: "y = y'",
          },
          step3: {
            ruleX: "x = 2k &minus; x'",
            ruleY: "y = y'",
            givenParts: [{ text: "&minus;2(" }, { var: "x" }, { text: ") &minus; (" }, { var: "y" }, { text: ") + 1 = 0" }],
            answerParts: [{ text: "&minus;2" }, { box: "x" }, { text: " &minus; " }, { box: "y" }, { text: " + 1 = 0" }],
            answers: { x: "2k-x'", y: "y'" },
          },
          step4: {
            substitutionParts: [{ text: "&minus;2" }, { value: "2k &minus; x'", color: "x" }, { text: " &minus; " }, { value: "y'", color: "y" }, { text: " + 1 = 0" }],
            simplifyKind: "verticalLineK",
            finalAnswer: "2x &minus; y + 9 = 0",
            options: ["2x &minus; y &minus; 9 = 0", "2x &minus; y + 9 = 0", "2x + y + 9 = 0", "&minus;2x &minus; y + 9 = 0"],
            correctIndex: 1,
          },
        },
      ],
      steps: {
        step1: {
          nav: { animating: "", ready: "Ketuk &raquo; untuk melanjutkan." },
          rightPanel: { exploreDetails: "Mari kita lihat informasi yang diberikan dalam soal." },
        },
        step2: {
          nav: { chooseRule: "Ketuk opsi yang benar.", ready: "Ketuk &raquo; untuk mulai substitusi." },
        },
        step3: {
          nav: { numpadActive: "Ketuk numpad untuk mengisi kotak yang disorot.", ready: "Ketuk &raquo; untuk langkah terakhir." },
          rightPanel: { numpadHelp: "Substitusikan aturan ke<br>persamaan garis yang diberikan" },
          feedback: {
            wrongX: "Oops!<br>Perhatikan aturan refleksi dan isi bagian koordinat x bayangan di sini.",
            wrongY: "Oops!<br>Perhatikan aturan refleksi dan isi bagian koordinat y bayangan di sini.",
          },
        },
        step4: {
          nav: { chooseSimplified: "Ketuk opsi yang benar.", ready: "Ketuk &raquo; untuk tantangan lainnya.", conclude: "Ketuk &raquo; untuk selesai." },
          rightPanel: { simplifyTitle: "Bentuk sederhana dari persamaan yang diberikan adalah:" },
          feedback: { tryAgain: "Oops! Coba lagi.", wellDone: "Bagus!" },
        },
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
