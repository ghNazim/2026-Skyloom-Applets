const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      givenAngle: {
        symbol: "\u2220A = 130\u00B0",
        value: 130,
      },
      angleB: {
        correct: 50,
        prefix: "\u2220B =",
      },
      angleC: {
        correct: 50,
        prefix: "\u2220C =",
      },
      angleD: {
        correct: 130,
        prefix: "\u2220D =",
      },
      parallelLinesLabel: "Parallel Lines",
      transversalLabel: "Transversal",
      unknownLabel: "?",
      options: [
        "Linear Pair of Angles",
        "Vertical Angles",
        "Corresponding Angles",
        "Alternate Exterior Angles",
        "Alternate Interior Angles",
        "Co-exterior Angles",
        "Co-interior Angles",
      ],
      correctOption: "Co-interior Angles",
      navTapCorrectOption: "Tap the correct option",
      step6: {
        animLines:
          "Lines \u2018k\u2019 and \u2018l\u2019 are parallel, and \u2018m\u2019 is a transversal.",
        optionsQuestion:
          "Shout out the type of angle pair formed by angles <or>A</or> and <yl>B</yl>!",
        wrongFeedback:
          "Oops! Both angles are inside the two parallel lines and on the same side of the transversal.",
        correctFeedback:
          "That\u2019s correct! These are inside the two parallel lines and on the same side of the transversal.",
        navCorrect: "Tap \u00BB to find angle B.",
        correctOption: "Co-interior Angles",
      },
      step7: {
        wrongHint: "Co-interior\nangles add\nup to 180\u00B0!",
        tapAngleC: "Tap angle C to find its measure.",
        findAngleC: "Let\u2019s find angle <bl>C</bl>!",
      },
      step8: {
        animLines:
          "Lines \u2018m\u2019 and \u2018n\u2019 are parallel, and \u2018l\u2019 is a transversal.",
        optionsQuestion:
          "Shout out the type of angle pair formed by angles <yl>B</yl> and <bl>C</bl>!",
        wrongFeedback:
          "Oops! Both angles are on opposite sides of the transversal and between the parallel lines.",
        correctFeedback:
          "That\u2019s correct! These are on opposite sides of the transversal and between the parallel lines.",
        navCorrect: "Tap \u00BB to find angle C.",
        correctOption: "Alternate Interior Angles",
      },
      step9: {
        wrongHint: "Alternate interior\nangles are\nequal!",
        tapAngleD: "Tap angle D to find its measure.",
        findAngleD: "Let\u2019s find angle <pr>D</pr>!",
      },
      step10: {
        animLines:
          "Lines \u2018m\u2019 and \u2018n\u2019 are parallel, and \u2018k\u2019 is a transversal.",
        optionsQuestion:
          "Shout out the type of angle pair formed by angles <or>A</or> and <pr>D</pr>!",
        wrongFeedback:
          "Oops! Both angles are in the same relative position at their intersections.",
        correctFeedback:
          "That\u2019s correct! These are in the same relative position at their intersections.",
        navCorrect: "Tap \u00BB to find angle D.",
        correctOption: "Corresponding Angles",
      },
      step11: {
        wrongHint: "Corresponding\nangles are\nequal!",
        navSummarise: "Tap \u00BB to summarise.",
        angleDFound: "<pr>\u2220D = 130\u00B0</pr>",
      },
      steps: [
        {
          questionText:
            "Find the measures of angles <yl>B</yl>, <bl>C</bl>, and <pr>D</pr>.",
          navText: "Tap \u00BB to identify the given information.",
        },
        {
          questionText: "<or>\u2220A = 130\u00B0</or>",
          navText: "Tap \u00BB to identify the given information.",
        },
        {
          questionText: "Lines k and l are parallel.",
          navText: "Tap \u00BB to identify the given information.",
        },
        {
          questionText: "Lines m and n are parallel.",
          navText: "Tap \u00BB to identify what we need to find.",
        },
        {
          questionText:
            "Find the measures of angles <yl>B</yl>, <bl>C</bl>, and <pr>D</pr>.",
          navText: "Tap angle B to find its measure.",
        },
        {
          questionText: "Finding angle <yl>B</yl>.",
          navText: " ",
        },
        {
          questionText: "Shout out the measure of angle <yl>B</yl>!",
          navText: "Enter the correct number",
        },
        {
          questionText: "Finding angle <bl>C</bl>.",
          navText: " ",
        },
        {
          questionText: "Shout out the measure of angle <bl>C</bl>!",
          navText: "Enter the correct number",
        },
        {
          questionText: "Finding angle <pr>D</pr>.",
          navText: " ",
        },
        {
          questionText: "Shout out the measure of angle <pr>D</pr>!",
          navText: "Enter the correct number",
        },
        {
          questionText:
            "The measures of unknown angles: <yl>\u2220B = 50\u00B0</yl>, <bl>\u2220C = 50\u00B0</bl>, and <pr>\u2220D = 130\u00B0</pr>",
          navText: "Activity Completed!",
        },
      ],
      startOverText: "Start Over",
    },
  },
  id: {
    app: {
      givenAngle: {
        symbol: "\u2220A = 130\u00B0",
        value: 130,
      },
      angleB: {
        correct: 50,
        prefix: "\u2220B =",
      },
      angleC: {
        correct: 50,
        prefix: "\u2220C =",
      },
      angleD: {
        correct: 130,
        prefix: "\u2220D =",
      },
      parallelLinesLabel: "Garis Sejajar",
      transversalLabel: "Transversal",
      unknownLabel: "?",
      options: [
        "Pasangan Linear",
        "Sudut Vertikal",
        "Sudut Sehadap",
        "Sudut Luar Berseberangan",
        "Sudut Dalam Berseberangan",
        "Sudut Luar Sepihak",
        "Sudut Dalam Sepihak",
      ],
      correctOption: "Sudut Dalam Sepihak",
      navTapCorrectOption: "Ketuk opsi yang benar",
      step6: {
        animLines:
          "Garis \u2018k\u2019 dan \u2018l\u2019 sejajar, dan \u2018m\u2019 adalah transversal.",
        optionsQuestion:
          "Sebutkan jenis pasangan sudut yang dibentuk oleh sudut <or>A</or> dan <yl>B</yl>!",
        wrongFeedback:
          "Ups! Kedua sudut berada di dalam dua garis sejajar dan pada sisi yang sama dari transversal.",
        correctFeedback:
          "Benar! Keduanya berada di dalam dua garis sejajar dan pada sisi yang sama dari transversal.",
        navCorrect: "Ketuk \u00BB untuk menemukan sudut B.",
        correctOption: "Sudut Dalam Sepihak",
      },
      step7: {
        wrongHint: "Sudut dalam sepihak\nberjumlah\n180\u00B0!",
        tapAngleC: "Ketuk sudut C untuk menemukan ukurannya.",
        findAngleC: "Mari cari sudut <bl>C</bl>!",
      },
      step8: {
        animLines:
          "Garis \u2018m\u2019 dan \u2018n\u2019 sejajar, dan \u2018l\u2019 adalah transversal.",
        optionsQuestion:
          "Sebutkan jenis pasangan sudut yang dibentuk oleh sudut <yl>B</yl> dan <bl>C</bl>!",
        wrongFeedback:
          "Ups! Kedua sudut berada di sisi berlawanan dari transversal dan di antara garis sejajar.",
        correctFeedback:
          "Benar! Keduanya berada di sisi berlawanan dari transversal dan di antara garis sejajar.",
        navCorrect: "Ketuk \u00BB untuk menemukan sudut C.",
        correctOption: "Sudut Dalam Berseberangan",
      },
      step9: {
        wrongHint: "Sudut dalam berseberangan\nsama besar!",
        tapAngleD: "Ketuk sudut D untuk menemukan ukurannya.",
        findAngleD: "Mari cari sudut <pr>D</pr>!",
      },
      step10: {
        animLines:
          "Garis \u2018m\u2019 dan \u2018n\u2019 sejajar, dan \u2018k\u2019 adalah transversal.",
        optionsQuestion:
          "Sebutkan jenis pasangan sudut yang dibentuk oleh sudut <or>A</or> dan <pr>D</pr>!",
        wrongFeedback:
          "Ups! Kedua sudut berada pada posisi relatif yang sama di persimpangannya.",
        correctFeedback:
          "Benar! Keduanya berada pada posisi relatif yang sama di persimpangannya.",
        navCorrect: "Ketuk \u00BB untuk menemukan sudut D.",
        correctOption: "Sudut Sehadap",
      },
      step11: {
        wrongHint: "Sudut sehadap\nsama besar!",
        navSummarise: "Ketuk \u00BB untuk merangkum.",
        angleDFound: "<pr>\u2220D = 130\u00B0</pr>",
      },
      steps: [
        {
          questionText:
            "Temukan ukuran sudut <yl>B</yl>, <bl>C</bl>, dan <pr>D</pr>.",
          navText:
            "Ketuk \u00BB untuk mengidentifikasi informasi yang diberikan.",
        },
        {
          questionText: "<or>\u2220A = 130\u00B0</or>",
          navText:
            "Ketuk \u00BB untuk mengidentifikasi informasi yang diberikan.",
        },
        {
          questionText: "Garis k dan l sejajar.",
          navText:
            "Ketuk \u00BB untuk mengidentifikasi informasi yang diberikan.",
        },
        {
          questionText: "Garis m dan n sejajar.",
          navText: "Ketuk \u00BB untuk mengidentifikasi apa yang perlu dicari.",
        },
        {
          questionText:
            "Temukan ukuran sudut <yl>B</yl>, <bl>C</bl>, dan <pr>D</pr>.",
          navText: "Ketuk sudut B untuk menemukan ukurannya.",
        },
        {
          questionText: "Mencari sudut <yl>B</yl>.",
          navText: " ",
        },
        {
          questionText: "Sebutkan ukuran sudut <yl>B</yl>!",
          navText: "Masukkan angka yang benar",
        },
        {
          questionText: "Mencari sudut <bl>C</bl>.",
          navText: " ",
        },
        {
          questionText: "Sebutkan ukuran sudut <bl>C</bl>!",
          navText: "Masukkan angka yang benar",
        },
        {
          questionText: "Mencari sudut <pr>D</pr>.",
          navText: " ",
        },
        {
          questionText: "Sebutkan ukuran sudut <pr>D</pr>!",
          navText: "Masukkan angka yang benar",
        },
        {
          questionText:
            "Ukuran sudut yang tidak diketahui: <yl>\u2220B = 50\u00B0</yl>, <bl>\u2220C = 50\u00B0</bl>, dan <pr>\u2220D = 130\u00B0</pr>",
          navText: "Aktivitas Selesai!",
        },
      ],
      startOverText: "Mulai Lagi",
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
