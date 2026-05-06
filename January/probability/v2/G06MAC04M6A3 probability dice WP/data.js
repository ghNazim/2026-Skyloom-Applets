const DATA = {
  en: {
    scalePositions: [
      { label: "Impossible", dotColor: "#e53935" },
      { label: "Less Likely", dotColor: "#fb8c00" },
      { label: "Possible", dotColor: "#fdd835" },
      { label: "More Likely", dotColor: "#29b6f6" },
      { label: "Certain", dotColor: "#66bb6a" },
    ],
    scaleImages: [
      null,
      "assets/3.png",
      ["assets/4.png", "assets/5.png"],
      "assets/6.png",
      null,
    ],

    challengeIntro: {
      heading: "Challenge 2",
      questionText:
        "There is a game die with 8 faces.<br>Based on the probability scale, what is your estimate of the<br>numbers written on each face of the die?",
      tapStartText: "Tap \u2018Start\u2019 to start solving.",
      buttonText: "Start",
    },

    comprehend: {
      questionText:
        'There is a <span class="yellow">game die with 8 faces</span>.<br>Based on the <span class="prob-scale">probability scale</span>, what is your <span class="light-blue">estimate<br>of the numbers written on each face of the die</span>?',
      givenTitle: "Given:",
      givenItems: [
        "Total number of faces = 8",
        "Chances of getting numbers on the die are given on probability scale",
      ],
      toFindTitle: "To Find:",
      toFindItems: ["Estimate the numbers written on all faces"],
      navStep1Start: "Let\u2019s note the information from the question.",
      navStep1Mid: "Tap \u00BB to note more information from the question.",
      navStep1Done: "Tap \u00BB to note what we need to find.",
      navStep2Start: "Let’s understand what we need to find.",
      navStep2Done: "Tap \u00BB to solve the challenge.",
    },

    compare: {
      instructionText:
        "Based on the scale of probability, <br>find <y>which number appears on more faces</y> of the die.",
      totalInfoText: "Total<br>number of<br>faces = 8",
      compareData: [
        {
          img1: "assets/3.png",
          img2: "assets/4.png",
          correctOperator: "<",
        },
        {
          img1: "assets/3.png",
          img2: "assets/5.png",
          correctOperator: "<",
        },
        {
          img1: "assets/4.png",
          img2: "assets/6.png",
          correctOperator: "<",
        },
        {
          img1: "assets/5.png",
          img2: "assets/6.png",
          correctOperator: "<",
        },
      ],
      wrongFeedback:
        "That\u2019s incorrect!<br>The number which has more probability will be on more faces.",
      correctFeedback:
        "That\u2019s right!<br>The number which has more probability will be on more faces.",
      navActive: "Tap on the correct sign.",
      navCorrect: "Tap \u00BB to compare other numbers.",
      navLast: "Tap \u00BB to summarize all the conditions.",
    },

    compareSummary: {
      heading: "Conditions to Check",
      conditionsText: "We need to check for <y>five conditions</y>:",
      conditionLeft: "Total<br>number of<br>faces = 8",
      buttonText: "Continue",
    },

    calculate: {
      estimateText: "Estimate the number of faces for each type below: ",
      totalTarget: 8,
      conditionTotalText: "Total number of faces = 8",
      totalLabel: "TOTAL",
      checkText: "Check",
      wrongFeedback: "All conditions are not met, try again!",
      correctFeedback: "Great! You found the correct estimate!",
      duplicateFeedback: "This is correct! but this answer is already found.",
      navActive:
        "Use the buttons to increase or decrease number of faces.",
      navCorrect: "Tap \u00BB to conclude.",
      navAllFound: "Tap \u00BB to conclude.",
      navOnCheckActive:"Tap ‘Check’ to validate your answer.",
      navWrong:"Change the numbers to try again.",
      validAnswers: [[1, 2, 2, 3]],
      ballImages: [
        "assets/3.png",
        "assets/4.png",
        "assets/5.png",
        "assets/6.png",
      ],
      compareData: [
        { img1: "assets/3.png", img2: "assets/4.png", operator: "<" },
        { img1: "assets/3.png", img2: "assets/5.png", operator: "<" },
        { img1: "assets/4.png", img2: "assets/6.png", operator: "<" },
        { img1: "assets/5.png", img2: "assets/6.png", operator: "<" },
      ],
    },

    calculateSummary: {
      summaryText:
        "Based on the information given, there is <y>exactly 1 possible estimate</y>:",
      estimates: [
        "3 on one face, 4 and 5 on two faces each,<br>6 on three faces.",
      ],
      navText: "Tap \u2018Start Over\u2019 to repeat this challenge.",
      startOverText: "Start Over",
    },
  },

  id: {
    scalePositions: [
      { label: "Mustahil", dotColor: "#e53935" },
      { label: "Kurang Mungkin", dotColor: "#fb8c00" },
      { label: "Mungkin", dotColor: "#fdd835" },
      { label: "Lebih Mungkin", dotColor: "#29b6f6" },
      { label: "Pasti", dotColor: "#66bb6a" },
    ],
    scaleImages: [
      null,
      "assets/3.png",
      ["assets/4.png", "assets/5.png"],
      "assets/6.png",
      null,
    ],

    challengeIntro: {
      heading: "Tantangan 2",
      questionText:
        "Ada dadu permainan dengan 8 sisi.<br>Berdasarkan skala probabilitas, bagaimana perkiraan kalian tentang angka-angka yang tertulis pada setiap sisi dadu?",
      tapStartText: "Ketuk \u2018Mulai\u2019 untuk mulai menyelesaikan.",
      buttonText: "Mulai",
    },

    comprehend: {
      questionText:
        'Ada <span class="yellow">dadu permainan dengan 8 sisi</span>.<br>Berdasarkan <span class="prob-scale">skala probabilitas</span>, bagaimana <span class="light-blue">perkiraan kalian tentang angka-angka yang tertulis pada setiap sisi dadu</span>?',
      givenTitle: "Diketahui:",
      givenItems: [
        "Jumlah total sisi = 8",
        "Peluang mendapatkan angka pada dadu diberikan pada skala probabilitas",
      ],
      toFindTitle: "Ditanyakan:",
      toFindItems: ["Perkirakan angka yang tertulis pada semua sisi"],
      navStep1Start: "Mari kita catat informasi dari soal.",
      navStep1Mid: "Ketuk \u00BB untuk mencatat lebih banyak informasi dari soal.",
      navStep1Done: "Ketuk \u00BB untuk mencatat apa yang perlu dicari.",
      navStep2Start: "Mari kita catat informasi dari soal.",
      navStep2Done: "Ketuk \u00BB untuk menyelesaikan tantangan.",
    },

    compare: {
      instructionText:
        "Berdasarkan skala probabilitas, <br>temukan <y>angka mana yang muncul di lebih banyak sisi</y> dadu",
      totalInfoText: "Jumlah<br>total<br>sisi = 8",
      compareData: [
        {
          img1: "assets/3.png",
          img2: "assets/4.png",
          correctOperator: "<",
        },
        {
          img1: "assets/3.png",
          img2: "assets/5.png",
          correctOperator: "<",
        },
        {
          img1: "assets/4.png",
          img2: "assets/6.png",
          correctOperator: "<",
        },
        {
          img1: "assets/5.png",
          img2: "assets/6.png",
          correctOperator: "<",
        },
      ],
      wrongFeedback:
        "Belum tepat! Angka yang memiliki probabilitas lebih tinggi akan muncul di lebih banyak sisi.",
      correctFeedback:
        "Benar! Angka yang memiliki probabilitas lebih tinggi akan muncul di lebih banyak sisi.",
      navActive: "Ketuk tanda yang benar.",
      navCorrect: "Ketuk \u00BB untuk membandingkan angka lain.",
      navLast: "Ketuk \u00BB untuk merangkum semua kondisi.",
    },

    compareSummary: {
      heading: "Kondisi yang Perlu Diperiksa",
      conditionsText: "Kita perlu memeriksa <y>lima kondisi</y>:",
      conditionLeft: "Jumlah<br> total<br>sisi = 8",
      buttonText: "Lanjutkan",
    },

    calculate: {
      estimateText: "Perkirakan jumlah sisi untuk setiap angka di bawah ini: ",
      totalTarget: 8,
      conditionTotalText: "Jumlah total sisi = 8",
      totalLabel: "TOTAL",
      checkText: "Periksa",
      wrongFeedback: "Semua kondisi belum terpenuhi, coba lagi!",
      correctFeedback: "Bagus! Kalian menemukan perkiraan yang benar!",
      duplicateFeedback: "Ini benar! tapi jawaban ini sudah ditemukan.",
      navActive: "Gunakan tombol untuk menambah atau mengurangi jumlah sisi.",
      navOnCheckActive: "Ketuk ‘Periksa’ untuk membuktikan jawaban kalian.",
      navWrong: "Ubah angka untuk mencoba lagi.",
      navCorrect: "Ketuk \u00BB untuk menyimpulkan.",
      navAllFound: "Ketuk \u00BB untuk menyimpulkan.",
      validAnswers: [[1, 2, 2, 3]],
      ballImages: [
        "assets/3.png",
        "assets/4.png",
        "assets/5.png",
        "assets/6.png",
      ],
      compareData: [
        { img1: "assets/3.png", img2: "assets/4.png", operator: "<" },
        { img1: "assets/3.png", img2: "assets/5.png", operator: "<" },
        { img1: "assets/4.png", img2: "assets/6.png", operator: "<" },
        { img1: "assets/5.png", img2: "assets/6.png", operator: "<" },
      ],
    },

    calculateSummary: {
      summaryText:
        "Berdasarkan informasi yang diberikan, ada <y>tepat 1 perkiraan yang mungkin</y>:",
      estimates: [
        "3 pada satu sisi, 4 dan 5 pada masing-masing dua sisi,<br>6 pada tiga sisi.",
      ],
      navText: "Ketuk \u2018Mulai Ulang\u2019 untuk mengulangi tantangan ini.",
      startOverText: "Mulai Ulang",
    },
  },
};

const APP_DATA = DATA[current_language];
