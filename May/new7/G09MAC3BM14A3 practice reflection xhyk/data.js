const DATA = {
  en: {
    app: {
      start: {
        heading: `Practice: Reflection across <span class="math-var">x</span> = <span class="math-var">h</span> and <span class="math-var">y</span> = <span class="math-var">k</span>`,
        text: 'Let&apos;s <y>use the rule of reflection</y> to<br><y>find the coordinates</y> of image of a point reflected<br>across horizontal lines <y><span class="math-var">y</span> = <span class="math-var">k</span></y> and vertical lines <y><span class="math-var">x</span> = <span class="math-var">h</span></y>.',
        subText: "Tap START to see the first challenge.",
        buttonText: "START",
      },
      reflection: {
        questionTemplate:
          "Find the coordinates of the image of the point {point} when it is reflected across the line {line}.",
        challenges: [
          {
            point: { x: 2, y: -5 },
            line: { axis: "y", value: -3 },
            answer: { x: 2, y: -1 },
          },
          {
            point: { x: -4, y: 2 },
            line: { axis: "x", value: -1 },
            answer: { x: 2, y: 2 },
          },
          {
            point: { x: 3, y: 5 },
            line: { axis: "y", value: 4 },
            answer: { x: 3, y: 3 },
          },
          {
            point: { x: -2, y: -6 },
            line: { axis: "x", value: 2 },
            answer: { x: 6, y: -6 },
          },
        ],
        givenPointTitle: "Given point:",
        givenLineTitle: "Given line:",
        imageTitle: "Image:",
        ruleLabel: "Rule:",
        mcqTitleTemplate:
          "What is the rule for reflection the line {lineType}?",
        hintTitle: "Across the line",
        hint: {
          horizontal: {
            line: "y = k,",
            body1: "y changes",
            body2: "x remains same.",
            wrong:
              "Oops! Rule for reflection across horizontal changes the y-coordinate only.",
          },
          vertical: {
            line: "x = h,",
            body1: "x changes",
            body2: "y remains same.",
            wrong:
              "Oops! Rule for reflection across vertical changes the x-coordinate only.",
          },
        },
        correctFeedback: "That&apos;s correct!",
        substitutePrompt: "Substitute the values.",
        substituteFeedback:
          "Great job!<br>You have substituted the values correctly.",
        calculatePrompt: "Calculate the<br>coordinates of A&apos;.",
        nav: {
          chooseOption: "Tap the correct option.",
          substitute: "Tap &raquo; to substitute the values in the formula.",
          drag: "Drag the values to the correct boxes.",
          simplify: "Tap &raquo; to simplify.",
          tapBox: "Tap the box to enter the value.",
          useNumpad: "Use the numpad to fill your answer.",
          nextChallenge: "Tap &raquo; to see the next challenge.",
          summarize: "Tap &raquo; to summarise the learning.",
        },
        numpad: {
          backspaceLabel: "Backspace",
          submitLabel: "Enter",
          plusLabel: "Plus",
          minusLabel: "Minus",
        },
      },
      completed: {
        heading: "Practice Complete!",
        text: "Great job! You can now use the rule of reflection to find the<br>image coordinates of a point reflected across horizontal or<br>vertical lines.",
        subText: "Tap START OVER to repeat!",
        startOver: "START OVER",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Latihan: Refleksi terhadap x = h dan y = k",
        text: 'Mari <y>gunakan aturan refleksi</y> untuk<br><y>menentukan koordinat</y> bayangan suatu titik yang direfleksikan<br>terhadap garis horizontal <y><span class="math-var">y</span> = <span class="math-var">k</span></y> dan garis vertikal <y><span class="math-var">x</span> = <span class="math-var">h</span></y>.',
        subText: "Ketuk MULAI untuk melihat tantangan pertama.",
        buttonText: "MULAI",
      },
      reflection: {
        questionTemplate:
          "Tentukan koordinat bayangan titik {point} jika direfleksikan terhadap garis {line}.",
        challenges: [
          {
            point: { x: 2, y: -5 },
            line: { axis: "y", value: -3 },
            answer: { x: 2, y: -1 },
          },
          {
            point: { x: -4, y: 2 },
            line: { axis: "x", value: -1 },
            answer: { x: 2, y: 2 },
          },
          {
            point: { x: 3, y: 5 },
            line: { axis: "y", value: 4 },
            answer: { x: 3, y: 3 },
          },
          {
            point: { x: -2, y: -6 },
            line: { axis: "x", value: 2 },
            answer: { x: 6, y: -6 },
          },
        ],
        givenPointTitle: "Titik yang diberikan:",
        givenLineTitle: "Garis yang diberikan:",
        imageTitle: "Bayangan:",
        ruleLabel: "Aturan:",
        mcqTitleTemplate: "Apa aturan refleksi terhadap garis {lineType}?",
        hintTitle: "Terhadap garis",
        hint: {
          horizontal: {
            line: "y = k,",
            body1: "y berubah",
            body2: "x tetap sama.",
            wrong:
              "Ups! Aturan refleksi terhadap garis horizontal hanya mengubah koordinat y.",
          },
          vertical: {
            line: "x = h,",
            body1: "x berubah",
            body2: "y tetap sama.",
            wrong:
              "Ups! Aturan refleksi terhadap garis vertikal hanya mengubah koordinat x.",
          },
        },
        correctFeedback: "Benar!",
        substitutePrompt: "Substitusikan nilainya.",
        substituteFeedback:
          "Bagus!<br>Kamu telah mensubstitusikan nilainya dengan benar.",
        calculatePrompt: "Hitung koordinat<br>A&apos;.",
        nav: {
          chooseOption: "Ketuk pilihan yang benar.",
          substitute: "Ketuk &raquo; untuk mensubstitusikan nilai ke rumus.",
          drag: "Seret nilai ke kotak yang benar.",
          simplify: "Ketuk &raquo; untuk menyederhanakan.",
          tapBox: "Ketuk kotak untuk memasukkan nilai.",
          useNumpad: "Gunakan numpad untuk mengisi jawaban.",
          nextChallenge: "Ketuk &raquo; untuk melihat tantangan berikutnya.",
          summarize: "Ketuk &raquo; untuk merangkum pembelajaran.",
        },
        numpad: {
          backspaceLabel: "Hapus",
          submitLabel: "Enter",
          plusLabel: "Plus",
          minusLabel: "Minus",
        },
      },
      completed: {
        heading: "Latihan Selesai!",
        text: "Bagus! Sekarang kamu dapat menggunakan aturan refleksi untuk menentukan<br>koordinat bayangan suatu titik yang direfleksikan terhadap garis horizontal<br>atau vertikal.",
        subText: "Ketuk MULAI LAGI untuk mengulang!",
        startOver: "MULAI LAGI",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
