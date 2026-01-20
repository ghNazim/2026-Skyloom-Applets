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
          "Good Job!\n<ol>AM</ol> is shorter than <ol>AB</ol>!\nThis means that the point 'closer' to point A is point <br><span class='inline-box'></span>",
          titleAnswered:"Good Job!\n<ol>AM</ol> is shorter than <ol>AB</ol>!\nThis means that the point 'closer' to point A is point <br><span class='inline-box'>M</span>",
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
          "Good Job!\n<ol>MN</ol> is longer than <ol>BN</ol>!\nThis means that the point 'farther' from point N is point <br><span class='inline-box'></span>",
        titleAnswered:
          "Good Job!\n<ol>MN</ol> is longer than <ol>BN</ol>!\nThis means that the point 'farther' from point N is point <br><span class='inline-box'>M</span>",
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
      navText: "Ketuk 'Bandingkan' untuk membandingkan secara visual",
      navTextAfter: "Ketuk tombol yang benar",
      navTextFinal: "Ketuk » untuk tantangan lain",
      questionFinal: "M lebih dekat dari B ke A - <ol>AM</ol> lebih pendek dari <ol>AB</ol>",
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
          "Bagus!\n<ol>AM</ol> lebih pendek dari <ol>AB</ol>!\nBerarti titik yang 'lebih dekat' ke A adalah <br><span class='inline-box'></span>",
        titleAnswered:
          "Bagus!\n<ol>AM</ol> lebih pendek dari <ol>AB</ol>!\nBerarti titik yang 'lebih dekat' ke A adalah <br><span class='inline-box'>M</span>",
        options: ["B", "M"],
        correctAnswer: 1, // Index 1 = "M"
      },
      finalInfoText:
        "Kerja Bagus!\nTitik-titik yang lebih dekat membuat ruas garis yang lebih pendek!",
      titleFinal:
        "Kerja Bagus!\nTitik-titik yang lebih dekat membuat ruas garis yang lebih pendek!",
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
      navText: "Ketuk 'Bandingkan' untuk membandingkan secara visual",
      navTextAfter: "Ketuk tombol yang benar",
      navTextFinal: "Ketuk » untuk merangkum",
      questionFinal: "M lebih jauh dari N dibanding B - <ol>MN</ol> lebih panjang dari <ol>BN</ol>",
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
          "Bagus!\n<ol>MN</ol> lebih panjang dari <ol>BN</ol>!\nBerarti titik yang 'lebih jauh' dari N adalah <br><span class='inline-box'></span>",
        titleAnswered:
          "Bagus!\n<ol>MN</ol> lebih panjang dari <ol>BN</ol>!\nBerarti titik yang 'lebih jauh' dari N adalah <br><span class='inline-box'>M</span>",
        options: ["B", "M"],
        correctAnswer: 1, // Index 0 = "B" -> Wait, previous correct answer was B (index 0) or M?
        // Let's check EN data. step3 mcq2 correctAnswer is 0 ("B").
        // But options here are ["B", "M"]. So index 0 is B.
        // Wait, M is farther from N? Let's check coordinates.
        // N is {x: 70, y: 45}. M is {x: 25, y: 50}. B is {x: 75, y: 25}.
        // Dist N-M: sqrt(45^2 + 5^2) = sqrt(2025+25) = sqrt(2050) ~ 45.2
        // Dist N-B: sqrt(5^2 + 20^2) = sqrt(25+400) = sqrt(425) ~ 20.6
        // MN is longer. M is farther.
        // So correct answer should be M.
        // Wait, let's check Step 3 data in EN.
        // mcq1: Which is LONGER? BN or MN? Correct: 1 (MN). Correct.
        // mcq2: Point 'farther' from N is... Options: ["B", "M"]. Correct: 1 (M).
        // BUT in the EN file provided in previous turn step 83:
        // mcq2: { options: ["B", "M"], correctAnswer: 1 } -> This is M.
        // WAIT. In my previous turn step 83 view of data.js:
        // Line 88: correctAnswer: 1, // Index 0 = "B" <-- The comment says "Index 0 = B" but value is 1.
        // This is conflicting.
        // If options are ["B", "M"], index 1 is "M".
        // If question is "farther", distinct is MN > BN, so M is farther.
        // So answer IS M.
        // I will set correctAnswer to 1.
      },
      finalInfoText:
        "Kerja Bagus!\nTitik-titik yang lebih jauh membuat ruas garis yang lebih panjang!",
      titleFinal:
        "Kerja Bagus!\nTitik-titik yang lebih jauh\nmembuat ruas garis\nyang lebih panjang!",
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
