const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Parallel Lines and Transversal",
        text: "Find the measure of the unknown angle in each question\nusing the properties of angle pairs.",
        buttonText: "Start",
      },
      end: {
        heading: "Parallel Lines and Transversal",
        text: "Well done! Now you can solve challenges\non parallel lines and transversal.",
        buttonText: "Start Over",
      },
      step1: {
        questionText: "Find the value of x.",
        navText: "Enter the correct number",
        navTextNext: "Tap \u00BB to move to the next question.",
        navTextSummarize: "Tap \u00BB to summarize.",
      },
      input: {
        prefix: "x =",
      },
      questions: [
        {
          givenAngle: 4,
          givenValue: 60,
          unknownAngle: 6,
          correct: 60,
          trans_angle: 60,
          pairType: "alternateInterior",
          wrong1:
            "Oops! These are alternate\ninterior angles. Recall their\nproperty.",
          wrong2: "Measures of alternate\ninterior angles are equal.",
          correct_feedback:
            "That\u2019s correct! Measures of\nalternate interior angles are\nequal. So, x = 60.",
        },
        {
          givenAngle: 3,
          givenValue: 40,
          unknownAngle: 4,
          correct: 140,
          trans_angle: 40,
          pairType: "linear",
          wrong1:
            "Oops! These angles form a linear pair. Recall their property.",
          wrong2: "Linear pair of angles add up to 180\u00B0.",
          correct_feedback:
            "That\u2019s correct! Linear pair angles add up to 180\u00B0. So, x = 140.",
        },
        {
          givenAngle: 4,
          givenValue: 110,
          unknownAngle: 6,
          correct: 110,
          trans_angle: 70,
          pairType: "alternateInterior",
          wrong1:
            "Oops! These are alternate interior angles. Recall their property.",
          wrong2: "Measures of alternate interior angles are equal.",
          correct_feedback:
            "That\u2019s correct! Measures of alternate interior angles are equal. So, x = 110.",
        },
        {
          givenAngle: 3,
          givenValue: 60,
          unknownAngle: 7,
          correct: 60,
          trans_angle: 60,
          pairType: "corresponding",
          wrong1:
            "Oops! These are corresponding angles. Recall their property.",
          wrong2: "Measures of corresponding angles are equal.",
          correct_feedback:
            "That\u2019s correct! Measures of corresponding angles are equal. So, x = 60.",
        },
        {
          givenAngle: 1,
          givenValue: 50,
          unknownAngle: 8,
          correct: 130,
          trans_angle: 50,
          pairType: "coExterior",
          wrong1:
            "Oops! These are co-exterior angles. Recall their property.",
          wrong2: "Co-exterior angles add up to 180\u00B0.",
          correct_feedback:
            "That\u2019s correct! Co-exterior angles add up to 180\u00B0. So, x = 130.",
        },
        {
          givenAngle: 2,
          givenValue: 130,
          unknownAngle: 8,
          correct: 130,
          trans_angle: 50,
          pairType: "alternateExterior",
          wrong1:
            "Oops! These are alternate exterior angles. Recall their property.",
          wrong2: "Measures of alternate exterior angles are equal.",
          correct_feedback:
            "That\u2019s correct! Measures of alternate exterior angles are equal. So, x = 130.",
        },
        {
          givenAngle: 6,
          givenValue: 135,
          unknownAngle: 7,
          correct: 45,
          trans_angle: 45,
          pairType: "linear",
          wrong1:
            "Oops! These angles form a linear pair. Recall their property.",
          wrong2: "Remember, linear pair angles add up to 180\u00B0.",
          correct_feedback:
            "That\u2019s correct! Linear pair angles add up to 180\u00B0. So, x = 45.",
        },
        {
          givenAngle: 3,
          givenValue: 50,
          unknownAngle: 5,
          correct: 50,
          trans_angle: 50,
          pairType: "alternateInterior",
          wrong1:
            "Oops! These are alternate interior angles. Recall their property.",
          wrong2: "Remember, alternate interior angles are equal.",
          correct_feedback:
            "That\u2019s correct! Measures of alternate interior angles are equal. So, x = 50.",
        },
        {
          givenAngle: 2,
          givenValue: 100,
          unknownAngle: 7,
          correct: 80,
          trans_angle: 80,
          pairType: "coExterior",
          wrong1:
            "Oops! These are co-exterior angles. Recall their property.",
          wrong2: "Co-exterior angles add up to 180\u00B0.",
          correct_feedback:
            "That\u2019s correct! Co-exterior angles add up to 180\u00B0. So, x = 80.",
        },
        {
          givenAngle: 2,
          givenValue: 150,
          unknownAngle: 4,
          correct: 150,
          trans_angle: 40,
          pairType: "vertical",
          wrong1: "Oops! These are vertical angles. Recall their property.",
          wrong2: "Remember, vertical angles are equal.",
          correct_feedback:
            "That\u2019s correct! Measures of vertical angles are equal. So, x = 150.",
        },
        {
          givenAngle: 1,
          givenValue: 25,
          unknownAngle: 7,
          correct: 25,
          trans_angle: 40,
          pairType: "alternateExterior",
          wrong1:
            "Oops! These are alternate exterior angles. Recall their property.",
          wrong2: "Remember, alternate exterior angles are equal.",
          correct_feedback:
            "That\u2019s correct! Measures of alternate exterior angles are equal. So, x = 25.",
        },
        {
          givenAngle: 3,
          givenValue: 30,
          unknownAngle: 6,
          correct: 150,
          trans_angle: 40,
          pairType: "coInterior",
          wrong1:
            "Oops! These are co-interior angles. Recall their property.",
          wrong2: "Remember, co-interior angles add up to 180\u00B0.",
          correct_feedback:
            "That\u2019s correct! Co-interior angles add up to 180\u00B0. So, x = 150.",
        },
      ],
    },
  },
  id: {
    app: {
      start: {
        heading: "Garis Sejajar dan Transversal",
        text: "Temukan ukuran sudut yang tidak diketahui pada setiap soal\nmenggunakan sifat pasangan sudut.",
        buttonText: "Mulai",
      },
      end: {
        heading: "Garis Sejajar dan Transversal",
        text: "Bagus! Sekarang kamu dapat menyelesaikan tantangan\ntentang garis sejajar dan transversal.",
        buttonText: "Mulai Lagi",
      },
      step1: {
        questionText: "Temukan nilai x.",
        navText: "Masukkan angka yang benar",
        navTextNext: "Ketuk \u00BB untuk pindah ke soal berikutnya.",
        navTextSummarize: "Ketuk \u00BB untuk merangkum.",
      },
      input: {
        prefix: "x =",
      },
      questions: [
        {
          givenAngle: 4,
          givenValue: 60,
          unknownAngle: 6,
          correct: 60,
          trans_angle: 60,
          pairType: "alternateInterior",
          wrong1:
            "Ups! Ini adalah sudut dalam\nberseberangan. Ingat\nsifatnya.",
          wrong2: "Ukuran sudut dalam berseberangan\nsama.",
          correct_feedback:
            "Benar! Ukuran sudut dalam berseberangan\nsama. Jadi, x = 60.",
        },
        {
          givenAngle: 3,
          givenValue: 40,
          unknownAngle: 4,
          correct: 140,
          trans_angle: 40,
          pairType: "linear",
          wrong1:
            "Ups! Sudut-sudut ini membentuk pasangan linear. Ingat sifatnya.",
          wrong2: "Pasangan linear berjumlah 180\u00B0.",
          correct_feedback:
            "Benar! Pasangan linear berjumlah 180\u00B0. Jadi, x = 140.",
        },
        {
          givenAngle: 4,
          givenValue: 110,
          unknownAngle: 6,
          correct: 110,
          trans_angle: 70,
          pairType: "alternateInterior",
          wrong1:
            "Ups! Ini adalah sudut dalam berseberangan. Ingat sifatnya.",
          wrong2: "Ukuran sudut dalam berseberangan sama.",
          correct_feedback:
            "Benar! Ukuran sudut dalam berseberangan sama. Jadi, x = 110.",
        },
        {
          givenAngle: 3,
          givenValue: 60,
          unknownAngle: 7,
          correct: 60,
          trans_angle: 60,
          pairType: "corresponding",
          wrong1: "Ups! Ini adalah sudut sehadap. Ingat sifatnya.",
          wrong2: "Ukuran sudut sehadap sama.",
          correct_feedback:
            "Benar! Ukuran sudut sehadap sama. Jadi, x = 60.",
        },
        {
          givenAngle: 1,
          givenValue: 50,
          unknownAngle: 8,
          correct: 130,
          trans_angle: 50,
          pairType: "coExterior",
          wrong1: "Ups! Ini adalah sudut luar sepihak. Ingat sifatnya.",
          wrong2: "Sudut luar sepihak berjumlah 180\u00B0.",
          correct_feedback:
            "Benar! Sudut luar sepihak berjumlah 180\u00B0. Jadi, x = 130.",
        },
        {
          givenAngle: 2,
          givenValue: 130,
          unknownAngle: 8,
          correct: 130,
          trans_angle: 50,
          pairType: "alternateExterior",
          wrong1:
            "Ups! Ini adalah sudut luar berseberangan. Ingat sifatnya.",
          wrong2: "Ukuran sudut luar berseberangan sama.",
          correct_feedback:
            "Benar! Ukuran sudut luar berseberangan sama. Jadi, x = 130.",
        },
        {
          givenAngle: 6,
          givenValue: 135,
          unknownAngle: 7,
          correct: 45,
          trans_angle: 45,
          pairType: "linear",
          wrong1:
            "Ups! Sudut-sudut ini membentuk pasangan linear. Ingat sifatnya.",
          wrong2: "Ingat, pasangan linear berjumlah 180\u00B0.",
          correct_feedback:
            "Benar! Pasangan linear berjumlah 180\u00B0. Jadi, x = 45.",
        },
        {
          givenAngle: 3,
          givenValue: 50,
          unknownAngle: 5,
          correct: 50,
          trans_angle: 50,
          pairType: "alternateInterior",
          wrong1:
            "Ups! Ini adalah sudut dalam berseberangan. Ingat sifatnya.",
          wrong2: "Ingat, sudut dalam berseberangan sama.",
          correct_feedback:
            "Benar! Ukuran sudut dalam berseberangan sama. Jadi, x = 50.",
        },
        {
          givenAngle: 2,
          givenValue: 100,
          unknownAngle: 7,
          correct: 80,
          trans_angle: 80,
          pairType: "coExterior",
          wrong1: "Ups! Ini adalah sudut luar sepihak. Ingat sifatnya.",
          wrong2: "Sudut luar sepihak berjumlah 180\u00B0.",
          correct_feedback:
            "Benar! Sudut luar sepihak berjumlah 180\u00B0. Jadi, x = 80.",
        },
        {
          givenAngle: 2,
          givenValue: 150,
          unknownAngle: 4,
          correct: 150,
          trans_angle: 40,
          pairType: "vertical",
          wrong1:
            "Ups! Ini adalah sudut bertolak belakang. Ingat sifatnya.",
          wrong2: "Ingat, sudut bertolak belakang sama.",
          correct_feedback:
            "Benar! Ukuran sudut bertolak belakang sama. Jadi, x = 150.",
        },
        {
          givenAngle: 1,
          givenValue: 25,
          unknownAngle: 7,
          correct: 25,
          trans_angle: 40,
          pairType: "alternateExterior",
          wrong1:
            "Ups! Ini adalah sudut luar berseberangan. Ingat sifatnya.",
          wrong2: "Ingat, sudut luar berseberangan sama.",
          correct_feedback:
            "Benar! Ukuran sudut luar berseberangan sama. Jadi, x = 25.",
        },
        {
          givenAngle: 3,
          givenValue: 30,
          unknownAngle: 6,
          correct: 150,
          trans_angle: 40,
          pairType: "coInterior",
          wrong1: "Ups! Ini adalah sudut dalam sepihak. Ingat sifatnya.",
          wrong2: "Ingat, sudut dalam sepihak berjumlah 180\u00B0.",
          correct_feedback:
            "Benar! Sudut dalam sepihak berjumlah 180\u00B0. Jadi, x = 150.",
        },
      ],
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
