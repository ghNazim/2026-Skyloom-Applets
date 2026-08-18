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
          "Substituting the rule of reflection into the equation of the original line<br>gives the equation of reflected line. Now let&rsquo;s see why that works.<br>Every point on the reflected line comes from a point on the original<br>line, and using that idea, we can find the equation of the line for any<br>reflection<br>Tap <y>START</y> to begin!",
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
      teaching: {
        problem:
          "Find the equation of image of line 2x + y = 4 when reflected across x&minus;axis.",
        lineEquation: "2x + y = 4",
        reflectionAxis: "x&minus;axis",
        ruleLineLabel: "Rule for reflection across x&minus;axis:",
        ruleQuestion: "What is the rule for reflection across x&minus;axis?",
        ruleOptions: SHARED_RULE_OPTIONS.slice(0, 3),
        ruleCorrectIndex: 2,
        ruleFormula: "(x, y) &rarr; (x, &minus;y)",
        summary: {
          equationGivenLine: "Equation of given line",
          lineReflection: "Line of reflection:",
          equationReflectedLine: "Equation of reflected line",
          finalEquation: "2x &minus; y = 4",
        },
        stepA: {
          nav: { animating: "", ready: "Tap &raquo; to continue." },
          rightPanel: "Let&rsquo;s explore the details given in the question.",
          rulePlaceholder: "??",
        },
        stepB: {
          nav: { chooseRule: "Choose the correct option." },
        },
        stepC: {
          nav: { tapButton: "Tap the button" },
          rightPanel:
            "When a line reflects, all the points (<span class=\"math-var\">x</span>, <span class=\"math-var\">y</span>) on the given line<br>reflect on the image line.<br><br>Let&rsquo;s say (<span class=\"math-var\">x</span>', <span class=\"math-var\">y</span>') represents a<br>point on the reflected line",
          buttonText: "Express (x&rsquo;, y&rsquo;)",
          callout: "This rule transforms the<br>equation of the object line",
        },
        stepD: {
          nav: {
            tapSubstitute: "Tap &lsquo;Substitute&rsquo;",
            tapGeneralize: "Tap the highlighted box to generalize.",
          },
          rightPanel:
            "Let&rsquo;s substitute this into the<br>object line to form the<br>equation of reflected line with<br>this rule",
          foundPanel:
            "We have found the equation<br>for the reflected line .<br><br>Let&rsquo;s Generalize this",
          buttonText: "Substitute",
          equationTitle: "Equation of reflected line",
        },
        stepE: {
          nav: { ready: "Tap &raquo; to continue." },
          title: "Steps to find the equation of the reflected line.",
          box1: {
            title: "Step 1:",
            text: "Find the rule for reflection.",
            formula: "(x, y) &rarr; (x&rsquo;, y&rsquo;)",
          },
          box2: {
            title: "Step 2:",
            text:
              "Write the old coordinates <y>(x, y)</y> using the image coordinates <y>(x&rsquo;, y&rsquo;)</y>, then substitute and simplify,",
          },
          footer:
            "Let&rsquo;s use <y>substitution</y><br>to find the equation of the reflected line.",
        },
      },
      questions: [
        {
          id: "x-axis-3x-minus-2y",
          problem:
            "Find the equation of image of line 3x &minus; 2y = 1 when reflected across x&minus;axis.",
          lineEquation: "3x &minus; 2y = 1",
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
            givenParts: [{ text: "3(" }, { var: "x" }, { text: ") &minus; 2(" }, { var: "y" }, { text: ") = 1" }],
            answerParts: [{ text: "3" }, { box: "x" }, { text: " &minus; 2" }, { box: "y" }, { text: " = 1" }],
            answers: { x: "x'", y: "-y'" },
          },
          step4: {
            substitutionParts: [{ text: "3" }, { value: "x'", color: "x" }, { text: " &minus; 2" }, { value: "&minus;y'", color: "y" }, { text: " = 1" }],
            simplifyKind: "minusTimesNegative",
            finalAnswer: "3x + 2y = 1",
            options: ["3x + 2y = 1", "3x &minus; 2y = 1", "&minus;3x + 2y = 1", "3x &minus; 2y = &minus;1"],
            correctIndex: 0,
            simplificationArray: [
              {
                expr: "3(x') &minus; 2(&minus;y') = 1",
                note: "Substitute <i>x</i> = <i>x</i>&prime; and <i>y</i> = &minus;<i>y</i>&prime; into the equation of the given line.",
              },
              {
                expr: "3(x') + 2(y') = 1",
                note: "A negative multiplied by a negative gives a positive: &minus;2 &times; (&minus;<i>y</i>&prime;) = +2<i>y</i>&prime;.",
              },
              {
                expr: "3x' + 2y' = 1",
                note: "Nothing is left to multiply out, so the brackets can be removed.",
              },
              {
                expr: "3x + 2y = 1",
                note: "This holds for every point on the reflected line, so write <i>x</i>&prime; as <i>x</i> and <i>y</i>&prime; as <i>y</i>.",
              },
            ],
          },
        },
        // {
        //   id: "x-axis-4x-plus-y",
        //   problem:
        //     "Find the equation of image of line 4x + y = 6 when reflected across x&minus;axis.",
        //   lineEquation: "4x + y = 6",
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
        //     givenParts: [{ text: "4(" }, { var: "x" }, { text: ") + (" }, { var: "y" }, { text: ") = 6" }],
        //     answerParts: [{ text: "4" }, { box: "x" }, { text: " + " }, { box: "y" }, { text: " = 6" }],
        //     answers: { x: "x'", y: "-y'" },
        //   },
        //   step4: {
        //     substitutionParts: [{ text: "4" }, { value: "x'", color: "x" }, { text: " + " }, { value: "&minus;y'", color: "y" }, { text: " = 6" }],
        //     simplifyKind: "plusNegative",
        //     finalAnswer: "4x &minus; y = 6",
        //     options: ["4x &minus; y = 6", "4x + y = 6", "&minus;4x + y = 6", "4x &minus; y = &minus;6"],
        //     correctIndex: 0,
        //   },
        // },
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
            simplificationArray: [
              {
                expr: "5(&minus;y') + (&minus;x') &minus; 6 = 0",
                note: "Substitute <i>x</i> = &minus;<i>y</i>&prime; and <i>y</i> = &minus;<i>x</i>&prime; into the equation of the given line.",
              },
              {
                expr: "&minus;5(y') &minus; (x') &minus; 6 = 0",
                note: "Move each negative sign to the front of its term: 5 &times; (&minus;<i>y</i>&prime;) becomes &minus;5(<i>y</i>&prime;), and +(&minus;<i>x</i>&prime;) becomes &minus;(<i>x</i>&prime;).",
              },
              {
                expr: "&minus;5(y') &minus; (x') &minus; 6 = 0",
                note: "Both variable terms are now negative. The brackets are only marking what each negative sign applies to.",
              },
              {
                expr: "&minus;5y' &minus; x' &minus; 6 = 0",
                note: "Nothing is left to multiply out, so the brackets can be removed.",
              },
              {
                expr: "&minus;1 &times; (&minus;5y' &minus; x' &minus; 6) = &minus;1 &times; 0",
                note: "Every term on the left is negative. Multiply both sides by &minus;1 to make them positive.",
              },
              {
                expr: "5y' + x' + 6 = 0",
                note: "Each term changes sign, and &minus;1 &times; 0 is still 0.",
              },
              {
                expr: "x + 5y + 6 = 0",
                note: "Write the <i>x</i>&prime; term first to match the answer options, then write <i>x</i>&prime; as <i>x</i> and <i>y</i>&prime; as <i>y</i>.",
              },
            ],
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
            simplificationArray: [
              {
                expr: "&minus;2(2k &minus; x') &minus; (y') + 1 = 0",
                note: "Substitute <i>x</i> = 2<i>k</i> &minus; <i>x</i>&prime; and <i>y</i> = <i>y</i>&prime; into the equation of the given line.",
              },
              {
                expr: "&minus;2(2 &times; (&minus;2) &minus; x') &minus; (y') + 1 = 0",
                note: "Here <i>k</i> is the <i>x</i>&minus;value of the line of reflection, <i>x</i> = &minus;2, so replace <i>k</i> with &minus;2.",
              },
              {
                expr: "&minus;2(&minus;4 &minus; x') &minus; (y') + 1 = 0",
                note: "Work out 2 &times; (&minus;2) = &minus;4.",
              },
              {
                expr: "(&minus;2) &times; (&minus;4) &minus; (&minus;2)x' &minus; (y') + 1 = 0",
                note: "Multiply the &minus;2 by each term inside the bracket.",
              },
              {
                expr: "&minus;2 &times; (&minus;4) &minus; (&minus;2)x' &minus; (y') + 1 = 0",
                note: "The outer bracket only marked off the &minus;2 being multiplied, so it is no longer needed.",
              },
              {
                expr: "8 &minus; (&minus;2)x' &minus; (y') + 1 = 0",
                note: "A negative multiplied by a negative gives a positive: &minus;2 &times; (&minus;4) = 8.",
              },
              {
                expr: "8 + 2x' &minus; y' + 1 = 0",
                note: "Subtracting a negative adds: &minus;(&minus;2)<i>x</i>&prime; becomes +2<i>x</i>&prime;, and &minus;(<i>y</i>&prime;) becomes &minus;<i>y</i>&prime;.",
              },
              {
                expr: "8 + 2x' &minus; y' + 1 = 0",
                note: "Every term now carries a single sign in front of it.",
              },
              {
                expr: "2x' &minus; y' + 8 + 1 = 0",
                note: "Move the variable terms to the front so the equation matches the form of the answer options.",
              },
              {
                expr: "2x' &minus; y' + 9 = 0",
                note: "Add the constants: 8 + 1 = 9.",
              },
              {
                expr: "2x &minus; y + 9 = 0",
                note: "Write <i>x</i>&prime; as <i>x</i> and <i>y</i>&prime; as <i>y</i>.",
              },
            ],
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
          guide: {
            title: "Step {n}:",
          },
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
          "Mensubstitusikan aturan refleksi ke persamaan garis asal<br>memberikan persamaan garis hasil refleksi. Sekarang mari kita lihat alasannya.<br>Setiap titik pada garis hasil refleksi berasal dari titik pada garis asal,<br>dan dengan ide itu, kita dapat menemukan persamaan garis untuk refleksi apa pun.<br>Ketuk <y>MULAI</y> untuk memulai!",
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
      teaching: {
        problem:
          "Temukan persamaan bayangan garis 2x + y = 4 ketika direfleksikan terhadap sumbu x.",
        lineEquation: "2x + y = 4",
        reflectionAxis: "sumbu x",
        ruleLineLabel: "Aturan refleksi terhadap sumbu x:",
        ruleQuestion: "Apakah aturan refleksi terhadap sumbu x?",
        ruleOptions: SHARED_RULE_OPTIONS.slice(0, 3),
        ruleCorrectIndex: 2,
        ruleFormula: "(x, y) &rarr; (x, &minus;y)",
        summary: {
          equationGivenLine: "Persamaan garis yang diberikan",
          lineReflection: "Garis refleksi:",
          equationReflectedLine: "Persamaan garis hasil refleksi",
          finalEquation: "2x &minus; y = 4",
        },
        stepA: {
          nav: { animating: "", ready: "Ketuk &raquo; untuk melanjutkan." },
          rightPanel: "Mari kita lihat informasi yang diberikan dalam soal.",
          rulePlaceholder: "??",
        },
        stepB: {
          nav: { chooseRule: "Pilih opsi yang benar." },
        },
        stepC: {
          nav: { tapButton: "Ketuk tombol" },
          rightPanel:
            "Saat sebuah garis direfleksikan, semua titik (<span class=\"math-var\">x</span>, <span class=\"math-var\">y</span>) pada garis yang diberikan<br>berpindah ke garis bayangan.<br><br>Misalkan (<span class=\"math-var\">x</span>', <span class=\"math-var\">y</span>') menyatakan<br>titik pada garis hasil refleksi",
          buttonText: "Nyatakan (x&rsquo;, y&rsquo;)",
          callout: "Aturan ini mengubah<br>persamaan garis objek",
        },
        stepD: {
          nav: {
            tapSubstitute: "Ketuk &lsquo;Substitusi&rsquo;",
            tapGeneralize: "Ketuk kotak yang disorot untuk menggeneralisasi.",
          },
          rightPanel:
            "Mari substitusikan ini ke<br>garis objek untuk membentuk<br>persamaan garis hasil refleksi<br>dengan aturan ini",
          foundPanel:
            "Kita telah menemukan persamaan<br>untuk garis hasil refleksi.<br><br>Mari kita generalisasikan",
          buttonText: "Substitusi",
          equationTitle: "Persamaan garis hasil refleksi",
        },
        stepE: {
          nav: { ready: "Ketuk &raquo; untuk melanjutkan." },
          title: "Langkah-langkah menentukan persamaan garis hasil refleksi.",
          box1: {
            title: "Langkah 1:",
            text: "Tentukan aturan refleksi.",
            formula: "(x, y) &rarr; (x&rsquo;, y&rsquo;)",
          },
          box2: {
            title: "Langkah 2:",
            text:
              "Tulis koordinat lama <y>(x, y)</y> menggunakan koordinat bayangan<br><y>(x&rsquo;, y&rsquo;)</y>, lalu substitusikan dan sederhanakan,",
          },
          footer:
            "Mari gunakan <y>substitusi</y><br>untuk menentukan persamaan garis hasil refleksi.",
        },
      },
      questions: [
        {
          id: "x-axis-3x-minus-2y",
          problem:
            "Temukan persamaan bayangan garis 3x &minus; 2y = 1 ketika direfleksikan terhadap sumbu x.",
          lineEquation: "3x &minus; 2y = 1",
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
            givenParts: [{ text: "3(" }, { var: "x" }, { text: ") &minus; 2(" }, { var: "y" }, { text: ") = 1" }],
            answerParts: [{ text: "3" }, { box: "x" }, { text: " &minus; 2" }, { box: "y" }, { text: " = 1" }],
            answers: { x: "x'", y: "-y'" },
          },
          step4: {
            substitutionParts: [{ text: "3" }, { value: "x'", color: "x" }, { text: " &minus; 2" }, { value: "&minus;y'", color: "y" }, { text: " = 1" }],
            simplifyKind: "minusTimesNegative",
            finalAnswer: "3x + 2y = 1",
            options: ["3x + 2y = 1", "3x &minus; 2y = 1", "&minus;3x + 2y = 1", "3x &minus; 2y = &minus;1"],
            correctIndex: 0,
            simplificationArray: [
              {
                expr: "3(x') &minus; 2(&minus;y') = 1",
                note: "Substitusikan <i>x</i> = <i>x</i>&prime; dan <i>y</i> = &minus;<i>y</i>&prime; ke persamaan garis yang diberikan.",
              },
              {
                expr: "3(x') + 2(y') = 1",
                note: "Negatif dikali negatif menghasilkan positif: &minus;2 &times; (&minus;<i>y</i>&prime;) = +2<i>y</i>&prime;.",
              },
              {
                expr: "3x' + 2y' = 1",
                note: "Tidak ada lagi yang perlu dikalikan, jadi tanda kurungnya dapat dihilangkan.",
              },
              {
                expr: "3x + 2y = 1",
                note: "Persamaan ini berlaku untuk setiap titik pada garis bayangan, jadi tulis <i>x</i>&prime; sebagai <i>x</i> dan <i>y</i>&prime; sebagai <i>y</i>.",
              },
            ],
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
            simplificationArray: [
              {
                expr: "5(&minus;y') + (&minus;x') &minus; 6 = 0",
                note: "Substitusikan <i>x</i> = &minus;<i>y</i>&prime; dan <i>y</i> = &minus;<i>x</i>&prime; ke persamaan garis yang diberikan.",
              },
              {
                expr: "&minus;5(y') &minus; (x') &minus; 6 = 0",
                note: "Pindahkan setiap tanda negatif ke depan sukunya: 5 &times; (&minus;<i>y</i>&prime;) menjadi &minus;5(<i>y</i>&prime;), dan +(&minus;<i>x</i>&prime;) menjadi &minus;(<i>x</i>&prime;).",
              },
              {
                expr: "&minus;5(y') &minus; (x') &minus; 6 = 0",
                note: "Kedua suku variabel kini bernilai negatif. Tanda kurung hanya menandai bagian yang dikenai tanda negatif.",
              },
              {
                expr: "&minus;5y' &minus; x' &minus; 6 = 0",
                note: "Tidak ada lagi yang perlu dikalikan, jadi tanda kurungnya dapat dihilangkan.",
              },
              {
                expr: "&minus;1 &times; (&minus;5y' &minus; x' &minus; 6) = &minus;1 &times; 0",
                note: "Semua suku di ruas kiri bernilai negatif. Kalikan kedua ruas dengan &minus;1 agar menjadi positif.",
              },
              {
                expr: "5y' + x' + 6 = 0",
                note: "Setiap suku berubah tanda, dan &minus;1 &times; 0 tetap 0.",
              },
              {
                expr: "x + 5y + 6 = 0",
                note: "Tulis suku <i>x</i>&prime; di depan agar sesuai dengan pilihan jawaban, lalu tulis <i>x</i>&prime; sebagai <i>x</i> dan <i>y</i>&prime; sebagai <i>y</i>.",
              },
            ],
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
            simplificationArray: [
              {
                expr: "&minus;2(2k &minus; x') &minus; (y') + 1 = 0",
                note: "Substitusikan <i>x</i> = 2<i>k</i> &minus; <i>x</i>&prime; dan <i>y</i> = <i>y</i>&prime; ke persamaan garis yang diberikan.",
              },
              {
                expr: "&minus;2(2 &times; (&minus;2) &minus; x') &minus; (y') + 1 = 0",
                note: "Di sini <i>k</i> adalah nilai <i>x</i> dari garis refleksi, yaitu <i>x</i> = &minus;2, jadi ganti <i>k</i> dengan &minus;2.",
              },
              {
                expr: "&minus;2(&minus;4 &minus; x') &minus; (y') + 1 = 0",
                note: "Hitung 2 &times; (&minus;2) = &minus;4.",
              },
              {
                expr: "(&minus;2) &times; (&minus;4) &minus; (&minus;2)x' &minus; (y') + 1 = 0",
                note: "Kalikan &minus;2 dengan setiap suku di dalam tanda kurung.",
              },
              {
                expr: "&minus;2 &times; (&minus;4) &minus; (&minus;2)x' &minus; (y') + 1 = 0",
                note: "Tanda kurung luar hanya menandai &minus;2 yang dikalikan, jadi sudah tidak diperlukan lagi.",
              },
              {
                expr: "8 &minus; (&minus;2)x' &minus; (y') + 1 = 0",
                note: "Negatif dikali negatif menghasilkan positif: &minus;2 &times; (&minus;4) = 8.",
              },
              {
                expr: "8 + 2x' &minus; y' + 1 = 0",
                note: "Mengurangi bilangan negatif sama dengan menambah: &minus;(&minus;2)<i>x</i>&prime; menjadi +2<i>x</i>&prime;, dan &minus;(<i>y</i>&prime;) menjadi &minus;<i>y</i>&prime;.",
              },
              {
                expr: "8 + 2x' &minus; y' + 1 = 0",
                note: "Kini setiap suku ditulis dengan satu tanda di depannya.",
              },
              {
                expr: "2x' &minus; y' + 8 + 1 = 0",
                note: "Pindahkan suku-suku variabel ke depan agar bentuk persamaannya sesuai dengan pilihan jawaban.",
              },
              {
                expr: "2x' &minus; y' + 9 = 0",
                note: "Jumlahkan konstantanya: 8 + 1 = 9.",
              },
              {
                expr: "2x &minus; y + 9 = 0",
                note: "Tulis <i>x</i>&prime; sebagai <i>x</i> dan <i>y</i>&prime; sebagai <i>y</i>.",
              },
            ],
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
          guide: {
            title: "Langkah {n}:",
          },
        },
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
