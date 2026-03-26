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
      "assets/orange.png",
      "assets/red.png",
      "assets/white.png",
      null,
    ],

    challengeIntro: {
      heading: "Challenge 1",
      questionText:
        "There are 10 balls in a bag.<br>When one ball is picked at random, the chance of picking a<br>ball of each color is shown on the probability scale below.<br>Based on this probability scale, estimate how many balls of<br>each color are in the bag.",
      tapStartText: "Tap \u2018Start\u2019 to start solving.",
      buttonText: "Start",
    },

    comprehend: {
      questionText:
        'There are <span class="yellow">10 balls in a bag</span>.<br>When one ball is picked at random, the <span class="chance-yellow">chance of picking a ball</span> of each color is shown on the probability<br>scale below.<br>Based on this probability scale, <span class="light-blue">estimate how many<br>balls of each color are in the bag</span>.',
      givenTitle: "Given:",
      givenItems: [
        "Total number of balls = 10",
        "Chances of picking balls are given on probability scale",
      ],
      toFindTitle: "To Find:",
      toFindItems: ["Estimate the number of balls of each color"],
      navStep1Start: "Let\u2019s note the information from the question.",
      navStep1Continue: "Tap \u00BB to continue.",
      navStep1Done: "Tap \u00BB to note what we need to find.",
      navStep2Start: "Let’s understand what we need to find.",
      navStep2Done: "Tap \u00BB to solve the challenge.",
    },

    compare: {
      instructionText:
        "Based on the scale of probability,<br><y>compare the number of balls of given colors.</y>",
      totalInfoText: "Total<br>number of<br>balls = 10",
      compareData: [
        {
          img1: "assets/orange.png",
          img2: "assets/red.png",
          correctOperator: "<",
        },
        {
          img1: "assets/red.png",
          img2: "assets/white.png",
          correctOperator: "<",
        },
      ],
      wrongFeedback:
        "That\u2019s incorrect!<br>The color which has more probability<br>will be more in number than others.",
      correctFeedback:
        "That\u2019s right!<br>The color which has more probability will be<br>more in number than others.",
      navActive: "Tap on the correct sign.",
      navCorrect: "Tap \u00BB to compare other colors.",
      navLast: "Tap \u00BB to summarize all the conditions.",
    },

    compareSummary: {
      heading: "Conditions to Check",
      conditionsText: "We need to check for <y>three conditions</y>:",
      conditionLeft: "Total number of<br>balls = 10",
      buttonText: "Continue",
    },

    calculate: {
      estimateStatement: "Estimate the number of below given balls:",
      conditionTotalText: "Total number of<br>balls = 10",
      totalLabel: "TOTAL",
      checkText: "Check",
      wrongFeedback: "All conditions are not met, try again!",
      correctFeedback: "Great! You found a correct estimate!",
      duplicateFeedback:
        "This is correct! but this answer is already found. Try to find another.",
      navActive: "Use the buttons to increase or decrease number of balls.",
      navCorrect: "Tap \u00BB to find more estimates.",
      navAllFound: "Tap \u00BB to see all possible estimates.",
      navOnCheckActive: "Tap ‘Check’ to validate your answer.",
      navWrong: "Change the numbers to try again.",
      validAnswers: [
        [1, 4, 5],
        [1, 3, 6],
        [1, 2, 7],
        [2, 3, 5],
      ],
      ballImages: ["assets/orange.png", "assets/red.png", "assets/white.png"],
      compareData: [
        { img1: "assets/orange.png", img2: "assets/red.png", operator: "<" },
        { img1: "assets/red.png", img2: "assets/white.png", operator: "<" },
      ],
      prevAnswersTitle: "YOUR ESTIMATES",
    },

    allEstimates: {
      navText: "These are all possible estimates. Tap \u00BB to conclude.",
    },

    calculateSummary: {
      summaryText:
        "Based on the information given, there are <y>4 possible estimates</y>:",
      estimates: [
        "1 orange ball, 4 red balls<br>and 5 white balls",
        "1 orange ball, 3 red balls<br>and 6 white balls",
        "1 orange ball, 2 red balls<br>and 7 white balls",
        "2 orange balls, 3 red balls<br>and 5 white balls",
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
      "assets/orange.png",
      "assets/red.png",
      "assets/white.png",
      null,
    ],

    challengeIntro: {
      heading: "Tantangan 1",
      questionText:
        "Ada 10 bola dalam sebuah tas.<br>Ketika satu bola diambil secara acak, peluang mengambil<br>bola dari setiap warna ditunjukkan pada skala probabilitas di bawah ini.<br>Berdasarkan skala probabilitas ini, perkirakan berapa banyak bola<br>dari setiap warna yang ada dalam tas.",
      tapStartText: "Ketuk \u2018Mulai\u2019 untuk mulai menyelesaikan.",
      buttonText: "Mulai",
    },

    comprehend: {
      questionText:
        'Ada <span class="yellow">10 bola dalam sebuah tas</span>.<br>Ketika satu bola diambil secara acak, <span class="chance-yellow">peluang mengambil bola</span> dari setiap warna ditunjukkan pada skala probabilitas di bawah ini.<br>Berdasarkan skala probabilitas ini, <span class="light-blue">perkirakan berapa banyak bola dari setiap warna yang ada dalam tas</span>.',
      givenTitle: "Diketahui:",
      givenItems: [
        "Jumlah total bola = 10",
        "Peluang mengambil bola diberikan pada skala probabilitas",
      ],
      toFindTitle: "Dicari:",
      toFindItems: ["Perkirakan jumlah bola dari setiap warna"],
      navStep1Start: "Mari kita catat informasi dari soal.",
      navStep1Continue: "Ketuk \u00BB untuk melanjutkan.",
      navStep1Done: "Ketuk \u00BB untuk mencatat apa yang perlu dicari.",
      navStep2Start: "Mari kita catat informasi dari soal.",
      navStep2Done: "Ketuk \u00BB untuk menyelesaikan tantangan.",
    },

    compare: {
      instructionText:
        "Berdasarkan skala probabilitas,<br><y>bandingkan jumlah bola dari warna yang diberikan.</y>",
      totalInfoText: "Jumlah<br>total<br>bola = 10",
      compareData: [
        {
          img1: "assets/orange.png",
          img2: "assets/red.png",
          correctOperator: "<",
        },
        {
          img1: "assets/red.png",
          img2: "assets/white.png",
          correctOperator: "<",
        },
      ],
      wrongFeedback:
        "Itu tidak benar!<br>Warna yang memiliki probabilitas lebih tinggi<br>akan lebih banyak jumlahnya dari yang lain.",
      correctFeedback:
        "Benar!<br>Warna yang memiliki probabilitas lebih tinggi akan<br>lebih banyak jumlahnya dari yang lain.",
      navActive: "Ketuk tanda yang benar.",
      navCorrect: "Ketuk \u00BB untuk membandingkan warna lain.",
      navLast: "Ketuk \u00BB untuk merangkum semua kondisi.",
    },

    compareSummary: {
      heading: "Kondisi yang Perlu Diperiksa",
      conditionsText: "Kita perlu memeriksa <y>tiga kondisi</y>:",
      conditionLeft: "Jumlah total<br>bola = 10",
      buttonText: "Lanjutkan",
    },

    calculate: {
      estimateStatement: "Perkirakan jumlah bola dari setiap warna:",
      conditionTotalText: "Jumlah total<br>bola = 10",
      totalLabel: "TOTAL",
      checkText: "Periksa",
      wrongFeedback: "Semua kondisi belum terpenuhi, coba lagi!",
      correctFeedback: "Bagus! Kamu menemukan perkiraan yang benar!",
      duplicateFeedback:
        "Ini benar! tapi jawaban ini sudah ditemukan. Coba temukan yang lain.",
      navActive: "Atur jumlah dan ketuk Periksa.",
      navCorrect: "Ketuk \u00BB untuk menemukan perkiraan lain.",
      navAllFound: "Ketuk \u00BB untuk melihat semua perkiraan.",
      navOnCheckActive: "Ketuk 'Periksa' untuk memvalidasi jawaban Anda.",
      navWrong: "Ubah angkanya untuk mencoba lagi.",
      validAnswers: [
        [1, 4, 5],
        [1, 3, 6],
        [1, 2, 7],
        [2, 3, 5],
      ],
      ballImages: ["assets/orange.png", "assets/red.png", "assets/white.png"],
      compareData: [
        { img1: "assets/orange.png", img2: "assets/red.png", operator: "<" },
        { img1: "assets/red.png", img2: "assets/white.png", operator: "<" },
      ],
      prevAnswersTitle: "JAWABAN ANDA",
    },

    allEstimates: {
      navText:
        "Ini semua perkiraan yang mungkin. Ketuk \u00BB untuk menyimpulkan.",
    },

    calculateSummary: {
      summaryText:
        "Berdasarkan informasi yang diberikan, ada <b>4 perkiraan yang mungkin</b>:",
      estimates: [
        "1 bola oranye, 4 bola merah<br>dan 5 bola putih",
        "1 bola oranye, 3 bola merah<br>dan 6 bola putih",
        "1 bola oranye, 2 bola merah<br>dan 7 bola putih",
        "2 bola oranye, 3 bola merah<br>dan 5 bola putih",
      ],
      navText: "Ketuk \u2018Mulai Ulang\u2019 untuk mengulangi tantangan ini.",
      startOverText: "Mulai Ulang",
    },
  },
};

const APP_DATA = DATA[current_language];
