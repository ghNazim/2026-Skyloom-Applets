const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Identify the Pair of Angles",
        text: "Given a highlighted pair of angles,<br>let's see if you can identify them.",
        buttonText: "Start",
      },
      final: {
        heading: "Identify the Pair of Angles",
        text: "Awesome! Now you are familiar with\n all the types of angle pairs\n formed when a transversal intersects two lines.",
        buttonText: "Start Over",
      },
      questionText: "What type of pair of angles are these?",
      nav: {
        initial: "Tap the correct option.",
        correct: "Tap » to move to the next question.",
        last: "Tap » to summarize.",
      },
      options: [
        "Linear Pair of Angles",
        "Vertical Angles",
        "Corresponding Angles",
        "Alternate Exterior Angles",
        "Alternate Interior Angles",
        "Co-exterior Angles",
        "Co-interior Angles",
      ],
      questions: [
        {
          angles: [1, 5],
          answer: "Corresponding Angles",
          wrong_feedback:
            "Oops! These angles occupy the same relative position.",
          correct_feedback:
            "Well done! These angles are in the same relative position—they are corresponding angles.",
        },
        {
          angles: [1, 2],
          answer: "Linear Pair of Angles",
          wrong_feedback:
            "Oops! These angles are adjacent and form a straight line.",
          correct_feedback:
            "Great job! These are adjacent angles and form a straight line—they are linear pair of angles.",
        },
        {
          angles: [6, 8],
          answer: "Vertical Angles",
          wrong_feedback: "Oops! These angles are opposite each other.",
          correct_feedback:
            "Awesome! These angles are opposite each other—they are vertical angles.",
        },
        {
          angles: [1, 7],
          answer: "Alternate Exterior Angles",
          wrong_feedback:
            "Oops! These angles are outside the two lines and on opposite sides of the transversal.",
          correct_feedback:
            "Great! These angles are outside the two lines and on opposite sides—they are alternate exterior angles.",
        },
        {
          angles: [3, 6],
          answer: "Co-interior Angles",
          wrong_feedback:
            "Oops! These angles are inside the two lines and on the same side of the transversal.",
          correct_feedback:
            "Excellent! These angles are inside the two lines and on the same side—they are co-interior angles.",
        },
        {
          angles: [4, 6],
          answer: "Alternate Interior Angles",
          wrong_feedback:
            "Oops! These angles are inside the two lines and on opposite sides of the transversal.",
          correct_feedback:
            "That's correct! These angles are inside the two lines and on opposite sides—they are alternate interior angles.",
        },
        {
          angles: [3, 7],
          answer: "Corresponding Angles",
          wrong_feedback:
            "Oops! These angles occupy the same relative position.",
          correct_feedback:
            "Well done! These angles are in the same relative position—they are corresponding angles.",
        },
        {
          angles: [5, 6],
          answer: "Linear Pair of Angles",
          wrong_feedback:
            "Oops! These angles are adjacent and form a straight line.",
          correct_feedback:
            "Great job! These are adjacent angles and form a straight line—they are linear pair of angles.",
        },
        {
          angles: [3, 5],
          answer: "Alternate Interior Angles",
          wrong_feedback:
            "Oops! These angles are inside the two lines and on opposite sides of the transversal.",
          correct_feedback:
            "That's correct! These angles are inside the two lines and on opposite sides—they are alternate interior angles.",
        },
        {
          angles: [2, 7],
          answer: "Co-exterior Angles",
          wrong_feedback:
            "Oops! These angles are outside the two lines and on the same side of the transversal.",
          correct_feedback:
            "That's correct! These angles are outside the two lines and on the same side—they are co-exterior angles.",
        },
        {
          angles: [1, 3],
          answer: "Vertical Angles",
          wrong_feedback: "Oops! These angles are opposite each other.",
          correct_feedback:
            "Awesome! These angles are opposite each other—they are vertical angles.",
        },
        {
          angles: [2, 8],
          answer: "Alternate Exterior Angles",
          wrong_feedback:
            "Oops! These angles are outside the two lines and on opposite sides of the transversal.",
          correct_feedback:
            "Great! These angles are outside the two lines and on opposite sides—they are alternate exterior angles.",
        },
        {
          angles: [4, 5],
          answer: "Co-interior Angles",
          wrong_feedback:
            "Oops! These angles are inside the two lines and on the same side of the transversal.",
          correct_feedback:
            "Excellent! These angles are inside the two lines and on the same side—they are co-interior angles.",
        },
        {
          angles: [1, 8],
          answer: "Co-exterior Angles",
          wrong_feedback:
            "Oops! These angles are outside the two lines and on the same side of the transversal.",
          correct_feedback:
            "That's correct! These angles are outside the two lines and on the same side—they are co-exterior angles.",
        },
        {
          angles: [4, 8],
          answer: "Corresponding Angles",
          wrong_feedback:
            "Oops! These angles occupy the same relative position.",
          correct_feedback:
            "Well done! These angles are in the same relative position—they are corresponding angles.",
        },
        {
          angles: [3, 4],
          answer: "Linear Pair of Angles",
          wrong_feedback:
            "Oops! These angles are adjacent and form a straight line.",
          correct_feedback:
            "Great job! These are adjacent angles and form a straight line—they are linear pair of angles.",
        },
      ],
    },
  },
  id: {
    app: {
      start: {
        heading: "Identifikasi Pasangan Sudut",
        text: "Diberikan sepasang sudut yang disorot,<br>mari kita lihat apakah kamu bisa mengidentifikasinya.",
        buttonText: "Mulai",
      },
      final: {
        heading: "Identifikasi Pasangan Sudut",
        text: "Luar biasa! Sekarang kamu sudah familiar dengan\n semua jenis pasangan sudut\n yang terbentuk ketika transversal memotong dua garis.",
        buttonText: "Ulangi dari Awal",
      },
      questionText: "Jenis pasangan sudut apakah ini?",
      nav: {
        initial: "Ketuk opsi yang benar.",
        correct: "Ketuk » untuk pindah ke pertanyaan berikutnya.",
        last: "Ketuk » untuk merangkum.",
      },
      options: [
        "Pasangan Sudut Linear",
        "Sudut Vertical",
        "Sudut Sebangun",
        "Sudut Luar Beralternasi",
        "Sudut Dalam Beralternasi",
        "Sudut Luar Sepihak",
        "Sudut Dalam Sepihak",
      ],
      questions: [
        {
          angles: [1, 5],
          answer: "Sudut Sebangun",
          wrong_feedback:
            "Ups! Sudut-sudut ini menempati posisi relatif yang sama.",
          correct_feedback:
            "Bagus! Sudut-sudut ini berada pada posisi relatif yang sama—mereka adalah sudut sebangun.",
        },
        {
          angles: [1, 2],
          answer: "Pasangan Sudut Linear",
          wrong_feedback:
            "Ups! Sudut-sudut ini berdekatan dan membentuk garis lurus.",
          correct_feedback:
            "Hebat! Ini adalah sudut berdekatan yang membentuk garis lurus—mereka adalah pasangan sudut linear.",
        },
        {
          angles: [6, 8],
          answer: "Sudut Vertical",
          wrong_feedback: "Ups! Sudut-sudut ini berhadapan satu sama lain.",
          correct_feedback:
            "Luar biasa! Sudut-sudut ini berhadapan satu sama lain—mereka adalah sudut vertical.",
        },
        {
          angles: [1, 7],
          answer: "Sudut Luar Beralternasi",
          wrong_feedback:
            "Ups! Sudut-sudut ini berada di luar dua garis dan di sisi berlawanan transversal.",
          correct_feedback:
            "Bagus! Sudut-sudut ini berada di luar dua garis dan di sisi berlawanan—mereka adalah sudut luar beralternasi.",
        },
        {
          angles: [3, 6],
          answer: "Sudut Dalam Sepihak",
          wrong_feedback:
            "Ups! Sudut-sudut ini berada di dalam dua garis dan di sisi yang sama transversal.",
          correct_feedback:
            "Sempurna! Sudut-sudut ini berada di dalam dua garis dan di sisi yang sama—mereka adalah sudut dalam sepihak.",
        },
        {
          angles: [4, 6],
          answer: "Sudut Dalam Beralternasi",
          wrong_feedback:
            "Ups! Sudut-sudut ini berada di dalam dua garis dan di sisi berlawanan transversal.",
          correct_feedback:
            "Benar! Sudut-sudut ini berada di dalam dua garis dan di sisi berlawanan—mereka adalah sudut dalam beralternasi.",
        },
        {
          angles: [3, 7],
          answer: "Sudut Sebangun",
          wrong_feedback:
            "Ups! Sudut-sudut ini menempati posisi relatif yang sama.",
          correct_feedback:
            "Bagus! Sudut-sudut ini berada pada posisi relatif yang sama—mereka adalah sudut sebangun.",
        },
        {
          angles: [5, 6],
          answer: "Pasangan Sudut Linear",
          wrong_feedback:
            "Ups! Sudut-sudut ini berdekatan dan membentuk garis lurus.",
          correct_feedback:
            "Hebat! Ini adalah sudut berdekatan yang membentuk garis lurus—mereka adalah pasangan sudut linear.",
        },
        {
          angles: [3, 5],
          answer: "Sudut Dalam Beralternasi",
          wrong_feedback:
            "Ups! Sudut-sudut ini berada di dalam dua garis dan di sisi berlawanan transversal.",
          correct_feedback:
            "Benar! Sudut-sudut ini berada di dalam dua garis dan di sisi berlawanan—mereka adalah sudut dalam beralternasi.",
        },
        {
          angles: [2, 7],
          answer: "Sudut Luar Sepihak",
          wrong_feedback:
            "Ups! Sudut-sudut ini berada di luar dua garis dan di sisi yang sama transversal.",
          correct_feedback:
            "Benar! Sudut-sudut ini berada di luar dua garis dan di sisi yang sama—mereka adalah sudut luar sepihak.",
        },
        {
          angles: [1, 3],
          answer: "Sudut Vertical",
          wrong_feedback: "Ups! Sudut-sudut ini berhadapan satu sama lain.",
          correct_feedback:
            "Luar biasa! Sudut-sudut ini berhadapan satu sama lain—mereka adalah sudut vertical.",
        },
        {
          angles: [2, 8],
          answer: "Sudut Luar Beralternasi",
          wrong_feedback:
            "Ups! Sudut-sudut ini berada di luar dua garis dan di sisi berlawanan transversal.",
          correct_feedback:
            "Bagus! Sudut-sudut ini berada di luar dua garis dan di sisi berlawanan—mereka adalah sudut luar beralternasi.",
        },
        {
          angles: [4, 5],
          answer: "Sudut Dalam Sepihak",
          wrong_feedback:
            "Ups! Sudut-sudut ini berada di dalam dua garis dan di sisi yang sama transversal.",
          correct_feedback:
            "Sempurna! Sudut-sudut ini berada di dalam dua garis dan di sisi yang sama—mereka adalah sudut dalam sepihak.",
        },
        {
          angles: [1, 8],
          answer: "Sudut Luar Sepihak",
          wrong_feedback:
            "Ups! Sudut-sudut ini berada di luar dua garis dan di sisi yang sama transversal.",
          correct_feedback:
            "Benar! Sudut-sudut ini berada di luar dua garis dan di sisi yang sama—mereka adalah sudut luar sepihak.",
        },
        {
          angles: [4, 8],
          answer: "Sudut Sebangun",
          wrong_feedback:
            "Ups! Sudut-sudut ini menempati posisi relatif yang sama.",
          correct_feedback:
            "Bagus! Sudut-sudut ini berada pada posisi relatif yang sama—mereka adalah sudut sebangun.",
        },
        {
          angles: [3, 4],
          answer: "Pasangan Sudut Linear",
          wrong_feedback:
            "Ups! Sudut-sudut ini berdekatan dan membentuk garis lurus.",
          correct_feedback:
            "Hebat! Ini adalah sudut berdekatan yang membentuk garis lurus—mereka adalah pasangan sudut linear.",
        },
      ],
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
