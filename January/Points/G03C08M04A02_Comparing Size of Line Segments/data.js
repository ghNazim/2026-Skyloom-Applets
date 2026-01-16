const current_language = "en";

const appData = {
  en: {
    // Navigation button texts
    navButtonStart: "Start",
    navButtonNext: "»",
    navButtonStartOver: "Start Over",

    // Step -1 - Intro splash screen
    stepIntro: {
      question: "Size of Line Segments",
      navText: "",
      contentText:
        "How far away 2 points are is the 'distance' between the points. If we make a line segment connecting the points, this will be the 'length' of the line segment.\n\nLet's visually compare the lengths of different line segments.",
    },
    // Step 0 - Line drawing
    step0: {
      question: "Which point is closer to A - M or B?",
      navText: "Drag from point A to M or A to B",
      infoText:
        "Make the required line segments and compare their lengths visually.",
      feedbackWrong: "Oops, we do not need {lineName}",
      feedbackFirstCorrect: "Nice. Now make the other.",
      feedbackSecondCorrect: "Great work.",
    },
    // Step 1 - Compare animation and MCQ
    step1: {
      question: "Which point is closer to A - M or B?",
      navText: "Tap 'Compare' to visually compare the size of line segments",
      navTextAfter: "Tap the correct button as required",
      navTextFinal: "Tap » to explore another challenge",
      questionFinal: "M is closer than B to A - <ol>AM</ol> is shorter than <ol>AB</ol>",
      infoText:
        "Make the required line segments and compare their lengths visually",
      compareButtonText: "Compare Lengths of the Line Segments",
      mcq1: {
        title:
          "Which of these Line Segments is SHORTER, <ol>AB</ol> or <ol>AM</ol>?",
        options: ["<ol>AB</ol>", "<ol>AM</ol>"],
        correctAnswer: 1, // Index 1 = "AM"
      },
      mcq2: {
        title:
          "Good Job!\n<ol>AM</ol> is shorter than <ol>AB</ol>!\nThis means that the point 'closer' to point A is point _____",
        options: ["B", "M"],
        correctAnswer: 1, // Index 1 = "M"
      },

      finalInfoText:
        "Great Job!\nPoints that are closer together make a line segment that is shorter in length!",
      titleFinal:
        "Great Job!\nPoints that are closer together make a line segment that is shorter in length!",
    },
    // Step 2 - Line drawing (second question)
    step2: {
      question: "Which point is farther away from N - M or B?",
      navText: "Drag from point N to M or N to B",
      infoText:
        "Make the required line segments and compare their lengths visually.",
      feedbackWrong: "Oops, we do not need {lineName}",
      feedbackFirstCorrect: "Nice. Now make the other.",
      feedbackSecondCorrect: "Great work.",
    },
    // Step 3 - Compare animation and MCQ (second question)
    step3: {
      question: "Which point is farther away from N - M or B?",
      navText: "Tap 'Compare' to visually compare the size of line segments",
      navTextAfter: "Tap the correct button as required",
      navTextFinal: "Tap » to summarize",
      questionFinal:"M is farther away from N than B - <ol>MN</ol> is longer than <ol>BN</ol>",
      infoText:
        "Make the required line segments and compare their lengths visually",
      compareButtonText: "Compare Lengths of the Line Segments",
      mcq1: {
        title:
          "Which of these Line Segments is LONGER, <ol>BN</ol> or <ol>MN</ol>?",
        options: ["<ol>BN</ol>", "<ol>MN</ol>"],
        correctAnswer: 1, // Index 1 = "MN"
      },
      mcq2: {
        title:
          "Good Job!\n<ol>MN</ol> is longer than <ol>BN</ol>!\nThis means that the point 'farther' from point N is point _____",
        options: ["B", "M"],
        correctAnswer: 1, // Index 0 = "B"
      },
      finalInfoText:
        "Great Job!\nPoints that are further apart make a line segment that is longer!",
      titleFinal:
        "Great Job!\nPoints that are further\napart make a line\nsegment that is longer!",
    },
    // Step 4 - Final splash screen
    step4: {
      question: "Size of Line Segments",
      navText: "",
      contentText:
        "How far away 2 points are is the 'distance' between the points. If we make a line segment connecting the points, this will be the 'length' of the line segment.\n\nWe visually compared length of line segments by moving them next to one another.",
    },
    // Common strings
    lineSegmentLabel: "LINE SEGMENT",
    lineSegmentOr: " or ",
    lineSegmentPlaceholder: "__",
  },
  id: {
    // Navigation button texts
    navButtonStart: "Mulai",
    navButtonNext: "»",
    navButtonStartOver: "Mulai Lagi",

    // Step -1 - Intro splash screen
    stepIntro: {
      question: "Ukuran Ruas Garis",
      navText: "",
      contentText:
        "Seberapa jauh 2 titik adalah 'jarak' antara titik-titik. Jika kita membuat ruas garis yang menghubungkan titik-titik, ini akan menjadi 'panjang' dari ruas garis.\n\nMari kita bandingkan secara visual panjang dari berbagai ruas garis.",
    },
    // Step 0 - Line drawing
    step0: {
      question: "Titik mana yang lebih dekat ke A - M atau B?",
      navText: "Seret dari titik A ke M atau A ke B",
      infoText:
        "Buat ruas garis yang diperlukan dan bandingkan panjangnya secara visual.",
      feedbackWrong: "Ups, kita tidak membutuhkan {lineName}",
      feedbackFirstCorrect: "Bagus. Sekarang buat yang lainnya.",
      feedbackSecondCorrect: "Kerja bagus.",
    },
    // Step 1 - Compare animation and MCQ
    step1: {
      question: "Titik mana yang lebih dekat ke A - M atau B?",
      navText:
        "Ketuk 'Bandingkan' untuk membandingkan ukuran ruas garis secara visual",
      navTextAfter: "Ketuk tombol yang benar sesuai kebutuhan",
      navTextFinal: "Ketuk » untuk merangkum",
      infoText:
        "Buat ruas garis yang diperlukan dan bandingkan panjangnya secara visual",
      compareButtonText: "Bandingkan Panjang Ruas Garis",
      mcq1: {
        title:
          "Ruas Garis manakah yang LEBIH PENDEK, <ol>AB</ol> atau <ol>AM</ol>?",
        options: ["<ol>AB</ol>", "<ol>AM</ol>"],
        correctAnswer: 1, // Index 1 = "AM"
      },
      mcq2: {
        title:
          "Bagus!\n<ol>AM</ol> lebih pendek dari <ol>AB</ol>!\nIni berarti titik yang 'lebih dekat' ke titik A adalah titik _____",
        options: ["B", "M"],
        correctAnswer: 1, // Index 1 = "M"
      },
      finalInfoText:
        "Bagus!\nTitik-titik yang lebih dekat bersama membuat ruas garis yang lebih pendek panjangnya!",
    },
    // Step 2 - Line drawing (second question)
    step2: {
      question: "Titik mana yang lebih jauh dari N - M atau B?",
      navText: "Seret dari titik N ke M atau N ke B",
      infoText:
        "Buat ruas garis yang diperlukan dan bandingkan panjangnya secara visual.",
      feedbackWrong: "Ups, kita tidak membutuhkan {lineName}",
      feedbackFirstCorrect: "Bagus. Sekarang buat yang lainnya.",
      feedbackSecondCorrect: "Kerja bagus.",
    },
    // Step 3 - Compare animation and MCQ (second question)
    step3: {
      question: "Titik mana yang lebih jauh dari N - M atau B?",
      navText:
        "Ketuk 'Bandingkan' untuk membandingkan ukuran ruas garis secara visual",
      navTextAfter: "Ketuk tombol yang benar sesuai kebutuhan",
      navTextFinal: "Ketuk » untuk merangkum",
      infoText:
        "Buat ruas garis yang diperlukan dan bandingkan panjangnya secara visual",
      compareButtonText: "Bandingkan Panjang Ruas Garis",
      mcq1: {
        title:
          "Ruas Garis manakah yang LEBIH PANJANG, <ol>BN</ol> atau <ol>MN</ol>?",
        options: ["<ol>BN</ol>", "<ol>MN</ol>"],
        correctAnswer: 1, // Index 1 = "MN"
      },
      mcq2: {
        title:
          "Bagus!\n<ol>MN</ol> lebih panjang dari <ol>BN</ol>!\nIni berarti titik yang 'lebih jauh' dari titik N adalah titik _____",
        options: ["B", "M"],
        correctAnswer: 1, // Index 0 = "B"
      },
      finalInfoText:
        "Bagus!\nTitik-titik yang lebih jauh terpisah membuat ruas garis yang lebih panjang!",
      titleFinal:
        "Bagus!\nTitik-titik yang lebih jauh\nterpisah membuat ruas garis\nyang lebih panjang!",
    },
    // Step 4 - Final splash screen
    step4: {
      question: "Ukuran Ruas Garis",
      navText: "",
      contentText:
        "Seberapa jauh 2 titik adalah 'jarak' antara titik-titik. Jika kita membuat ruas garis yang menghubungkan titik-titik, ini akan menjadi 'panjang' dari ruas garis.\n\nKita membandingkan panjang ruas garis secara visual dengan memindahkannya bersebelahan satu sama lain.",
    },
    // Common strings
    lineSegmentLabel: "RUAS GARIS",
    lineSegmentOr: " atau ",
    lineSegmentPlaceholder: "__",
  },
};

const APP_DATA = appData[current_language];
