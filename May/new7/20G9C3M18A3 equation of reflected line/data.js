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
      final: {
        heading: "Great job!",
        text:
          "You have completed this reflected-line challenge.",
        buttonText: "START OVER",
      },
      challenge: {
        problem:
          "Find the equation of image of line 3x &minus; 2y = 1 when reflected across x&minus;axis.",
        lineEquation: "3x &minus; 2y = 1",
        reflectionAxis: "x&minus;axis",
        reflectedEquation: "3x + 2y = 1",
      },
      labels: {
        equationGivenLine: "Equation of given line:",
        lineReflection: "Line of reflection:",
        ruleAcrossXAxis: "Rule for reflection across x&minus;axis:",
        coordinatesImage: "Coordinates of image:",
        ruleReflection: "Rule for reflection:",
        givenLine: "Given line:",
        equationReflectedLine: "Equation of the reflected line:",
        or: "or",
      },
      rightPanel: {
        exploreDetails: "Let&rsquo;s explore the details given in the question.",
        ruleQuestion: "What is the rule for reflection across x&minus;axis?",
        substituteRule: "Substitute the rule into the equation of given line",
        numpadHelp:
          "Substitute the rule into the<br>equation of given line",
        simplifyTitle: "The simplified form of the given equation is:",
      },
      nav: {
        empty: "",
        continue: "Tap &raquo; to continue.",
        correctOption: "Tap the correct option.",
        beginSubstitution: "Tap &raquo; to begin substitution.",
        numpadActive: "Tap using numpad to fill the highlighted box.",
        lastStep: "Tap &raquo; for last step.",
        anotherChallenge: "Tap &raquo; for another challenge.",
      },
      options: {
        rule: [
          "(x, y) &rarr; (&minus;x, y)",
          "(x, y) &rarr; (&minus;x, &minus;y)",
          "(x, y) &rarr; (x, &minus;y)",
          "(x, y) &rarr; (y, x)",
        ],
        ruleCorrectIndex: 2,
        simplify: [
          "3x + 2y = 1",
          "3x &minus; 2y = 1",
          "&minus;3x + 2y = 1",
          "3x &minus; 2y = &minus;1",
        ],
        simplifyCorrectIndex: 0,
      },
      feedback: {
        wrongX:
          "Oops!<br>Look at the reflection rule and fill in the x&minus;coordinate part of the image here.",
        wrongY:
          "Oops!<br>Look at the reflection rule and fill in the y&minus;coordinate part of the image here.",
        tryAgain: "Oops! Try again.",
        wellDone: "Well done!",
      },
      numpad: {
        clearLabel: "Clear",
        submitLabel: "Submit",
        plusLabel: "Plus",
        minusLabel: "Minus",
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
      final: {
        heading: "Hebat!",
        text:
          "Kamu telah menyelesaikan tantangan garis hasil refleksi ini.",
        buttonText: "MULAI LAGI",
      },
      challenge: {
        problem:
          "Tentukan persamaan bayangan garis 3x &minus; 2y = 1 jika direfleksikan terhadap sumbu&minus;x.",
        lineEquation: "3x &minus; 2y = 1",
        reflectionAxis: "sumbu&minus;x",
        reflectedEquation: "3x + 2y = 1",
      },
      labels: {
        equationGivenLine: "Persamaan garis yang diberikan:",
        lineReflection: "Garis refleksi:",
        ruleAcrossXAxis: "Aturan refleksi terhadap sumbu&minus;x:",
        coordinatesImage: "Koordinat bayangan:",
        ruleReflection: "Aturan refleksi:",
        givenLine: "Garis yang diberikan:",
        equationReflectedLine: "Persamaan garis hasil refleksi:",
        or: "atau",
      },
      rightPanel: {
        exploreDetails: "Mari kita lihat informasi yang diberikan dalam soal.",
        ruleQuestion: "Apa aturan refleksi terhadap sumbu&minus;x?",
        substituteRule: "Substitusikan aturan ke persamaan garis yang diberikan",
        numpadHelp:
          "Substitusikan aturan ke<br>persamaan garis yang diberikan",
        simplifyTitle: "Bentuk sederhana dari persamaan yang diberikan adalah:",
      },
      nav: {
        empty: "",
        continue: "Ketuk &raquo; untuk melanjutkan.",
        correctOption: "Ketuk opsi yang benar.",
        beginSubstitution: "Ketuk &raquo; untuk mulai substitusi.",
        numpadActive: "Ketuk numpad untuk mengisi kotak yang disorot.",
        lastStep: "Ketuk &raquo; untuk langkah terakhir.",
        anotherChallenge: "Ketuk &raquo; untuk tantangan lainnya.",
      },
      options: {
        rule: [
          "(x, y) &rarr; (&minus;x, y)",
          "(x, y) &rarr; (&minus;x, &minus;y)",
          "(x, y) &rarr; (x, &minus;y)",
          "(x, y) &rarr; (y, x)",
        ],
        ruleCorrectIndex: 2,
        simplify: [
          "3x + 2y = 1",
          "3x &minus; 2y = 1",
          "&minus;3x + 2y = 1",
          "3x &minus; 2y = &minus;1",
        ],
        simplifyCorrectIndex: 0,
      },
      feedback: {
        wrongX:
          "Oops!<br>Perhatikan aturan refleksi dan isi bagian koordinat x bayangan di sini.",
        wrongY:
          "Oops!<br>Perhatikan aturan refleksi dan isi bagian koordinat y bayangan di sini.",
        tryAgain: "Oops! Coba lagi.",
        wellDone: "Bagus!",
      },
      numpad: {
        clearLabel: "Hapus",
        submitLabel: "Kirim",
        plusLabel: "Plus",
        minusLabel: "Minus",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
