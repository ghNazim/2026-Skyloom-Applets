const RULE_OPTIONS = [
  "(x, &minus;y)",
  "(&minus;x, y)",
  "(x, &minus;y + 2k)",
  "(&minus;x + 2h, y)",
  "(y, x)",
  "(&minus;y, &minus;x)",
];

const DATA = {
  en: {
    app: {
      title: "Equation of Image of Reflected Line",
      start: {
        heading: "Equation of Image of Reflected Line",
        text:
          "Let&rsquo;s explore how to find the equation of<br>the image of a reflected line when two points on the line are given,<br>using the two-point form of the equation of a line.<br>Click <y>START</y> to begin!",
        buttonText: "START",
      },
      question:
        "Line AB passes through the points A(3, 5) and B(4, &minus;2). Find the equation of the image of line AB after <y>reflection across the y-axis</y>.",
      labels: {
        ruleQuestion:
          "What is the <y>rule of reflection</y> across <y>y-axis</y>?",
        coordinatePrompt: "Find the coordinates of the image:",
        coordinatesReady: "Coordinates of the image:",
        equationHeading: "Finding equation of the line A&rsquo;B&rsquo;.",
        equationCoordinatesTitle: "Coordinates of points on line A&rsquo;B&rsquo;.",
        twoPointForm: "Two point form of equation of a line:",
        simplifyPrompt: "Simplify the above equation in the form:",
        finalTitle: "The simplified form of the given equation is:",
        andWord: "and",
      },
      nav: {
        choose: "Tap the correct option.",
        continue: "Tap &raquo; to continue.",
        substitute: "Tap Substitute",
        visualise: "Tap &raquo; to visualise the reflection.",
      },
      hints: {
        noChange: "No change",
        signChanges: "Sign changes",
      },
      feedback: {
        coordinateWrong:
          "Oops!<br>Check the rule of reflection and try again.",
        simplifyWrong:
          "Oops! That&rsquo;s not correct.<br>Simplify and try again!",
        simplifyCorrect:
          "That&rsquo;s correct.<br>7x &minus; y = &minus;26 is the equation<br>of the reflection of line AB.",
      },
      equation: {
        coordinateLine:
          "A&rsquo;(&minus;3, 5) and B&rsquo;(&minus;4, &minus;2)",
        substituteText:
          "Let&rsquo;s substitute<br>the coordinates of image points<br>in <y>2-point form</y> of equation of<br>the line.",
        substituteButton: "Substitute",
        simplifyTextTop: "Now, simplify this equation in<br>the form of",
        simplifyTextBottom: "to get the equation of the line.",
        standardForm: "ax + by = c",
      },
      problem: {
        points: [
          {
            key: "A",
            label: "A",
            imageLabel: "A&rsquo;",
            pointHtml: "A(3, 5)",
            answerHtml: "A&rsquo;(&minus;3, 5)",
            xHtml: "&minus;3",
            yHtml: "5",
            options: ["(3, 5)", "(&minus;3, 5)", "(3, &minus;5)", "(&minus;3, &minus;5)"],
          },
          {
            key: "B",
            label: "B",
            imageLabel: "B&rsquo;",
            pointHtml: "B(4, &minus;2)",
            answerHtml: "B&rsquo;(&minus;4, &minus;2)",
            xHtml: "&minus;4",
            yHtml: "&minus;2",
            options: ["(4, 2)", "(&minus;4, 2)", "(4, &minus;2)", "(&minus;4, &minus;2)"],
          },
        ],
        ruleOption: "(&minus;x, y)",
        simplifyOptions: [
          "7x &minus; y = &minus;26",
          "x &minus; 7y = &minus;26",
          "7x &minus; y = 8",
        ],
        simplifyAnswer: "7x &minus; y = &minus;26",
      },
    },
  },
  id: {
    app: {
      title: "Persamaan Bayangan Garis Refleksi",
      start: {
        heading: "Persamaan Bayangan Garis Refleksi",
        text:
          "Mari kita pelajari cara menentukan persamaan<br>bayangan garis yang direfleksikan ketika dua titik pada garis diberikan,<br>menggunakan bentuk dua titik dari persamaan garis.<br>Klik <y>MULAI</y> untuk memulai!",
        buttonText: "MULAI",
      },
      question:
        "Garis AB melalui titik A(3, 5) dan B(4, &minus;2). Tentukan persamaan bayangan garis AB setelah <y>refleksi terhadap sumbu-y</y>.",
      labels: {
        ruleQuestion:
          "Apa <y>aturan refleksi</y> terhadap <y>sumbu-y</y>?",
        coordinatePrompt: "Tentukan koordinat bayangannya:",
        coordinatesReady: "Koordinat bayangannya:",
        equationHeading: "Menentukan persamaan garis A&rsquo;B&rsquo;.",
        equationCoordinatesTitle: "Koordinat titik pada garis A&rsquo;B&rsquo;.",
        twoPointForm: "Bentuk dua titik dari persamaan garis:",
        simplifyPrompt: "Sederhanakan persamaan di atas ke bentuk:",
        finalTitle: "Bentuk sederhana dari persamaan yang diberikan adalah:",
        andWord: "dan",
      },
      nav: {
        choose: "Ketuk opsi yang benar.",
        continue: "Ketuk &raquo; untuk melanjutkan.",
        substitute: "Ketuk Substitusi",
        visualise: "Ketuk &raquo; untuk memvisualisasikan refleksi.",
      },
      hints: {
        noChange: "Tidak berubah",
        signChanges: "Tanda berubah",
      },
      feedback: {
        coordinateWrong:
          "Oops!<br>Periksa aturan refleksi dan coba lagi.",
        simplifyWrong:
          "Oops! Itu belum benar.<br>Sederhanakan dan coba lagi!",
        simplifyCorrect:
          "Benar.<br>7x &minus; y = &minus;26 adalah persamaan<br>bayangan refleksi garis AB.",
      },
      equation: {
        coordinateLine:
          "A&rsquo;(&minus;3, 5) dan B&rsquo;(&minus;4, &minus;2)",
        substituteText:
          "Mari substitusikan<br>koordinat titik bayangan<br>ke dalam <y>bentuk 2 titik</y> dari persamaan<br>garis.",
        substituteButton: "Substitusi",
        simplifyTextTop: "Sekarang, sederhanakan persamaan ini<br>ke bentuk",
        simplifyTextBottom: "untuk mendapatkan persamaan garis.",
        standardForm: "ax + by = c",
      },
      problem: {
        points: [
          {
            key: "A",
            label: "A",
            imageLabel: "A&rsquo;",
            pointHtml: "A(3, 5)",
            answerHtml: "A&rsquo;(&minus;3, 5)",
            xHtml: "&minus;3",
            yHtml: "5",
            options: ["(3, 5)", "(&minus;3, 5)", "(3, &minus;5)", "(&minus;3, &minus;5)"],
          },
          {
            key: "B",
            label: "B",
            imageLabel: "B&rsquo;",
            pointHtml: "B(4, &minus;2)",
            answerHtml: "B&rsquo;(&minus;4, &minus;2)",
            xHtml: "&minus;4",
            yHtml: "&minus;2",
            options: ["(4, 2)", "(&minus;4, 2)", "(4, &minus;2)", "(&minus;4, &minus;2)"],
          },
        ],
        ruleOption: "(&minus;x, y)",
        simplifyOptions: [
          "7x &minus; y = &minus;26",
          "x &minus; 7y = &minus;26",
          "7x &minus; y = 8",
        ],
        simplifyAnswer: "7x &minus; y = &minus;26",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
APP_DATA.ruleOptions = RULE_OPTIONS;
APP_DATA.problem.ruleCorrectIndex = RULE_OPTIONS.indexOf(APP_DATA.problem.ruleOption);
APP_DATA.problem.points.forEach((point) => {
  point.correctIndex = point.options.indexOf(point.answerHtml.replace(point.imageLabel, "").trim());
});
APP_DATA.problem.points[0].correctIndex = 1;
APP_DATA.problem.points[1].correctIndex = 3;
APP_DATA.problem.simplifyCorrectIndex = APP_DATA.problem.simplifyOptions.indexOf(
  APP_DATA.problem.simplifyAnswer,
);
