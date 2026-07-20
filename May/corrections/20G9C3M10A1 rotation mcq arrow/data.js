const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Practice on Rotation",
        text: "Let's practice what we have learned so far<br>about rotation.<br><br><br>Tap 'START' to begin.",
        buttonText: "START",
      },
      end: {
        heading: "Activity Completed!",
        text: "Good job!<br>You've practiced finding image coordinates, object<br>coordinates and angle of rotation.",
        buttonText: "START OVER",
      },
      navText: "Tap the correct option",
      navCorrect: "Tap » for next question",
      navLast: "Tap » to conclude",
      navRetry: "Tap « to answer again",
      headings: {
        image: "Find the image coordinates",
        transformation: "Find the angle of rotation",
        object: "Find the object coordinates",
      },
      questions: [
        // —— Find image (11–15) ——
        {
          findType: "image",
          object: "A (-4,1)",
          transformation: "180° anticlockwise",
          image: null,
          options: ["A' (1,-4)", "A' (-4,-1)", "A' (-1,-4)", "A' (4,-1)"],
          correct: [3],
          feedback: "The rule for 180° rotation is<br>(x, y) → (-x, -y)",
        },
        {
          findType: "image",
          object: "B (3,2)",
          transformation: "90° clockwise",
          image: null,
          options: ["B' (2,3)", "B' (-3,-2)", "B' (2,-3)", "B' (-2,-3)"],
          correct: [2],
          feedback:
            "The rule for 90° clockwise rotation is<br>(x, y) → (y, -x)",
        },
        {
          findType: "image",
          object: "C (4,-1)",
          transformation: "270° anticlockwise",
          image: null,
          options: ["C' (-1,-4)", "C' (1,4)", "C' (-4,1)", "C' (1,-4)"],
          correct: [0],
          feedback:
            "The rule for 270° anticlockwise rotation is<br>(x, y) → (y, -x)",
        },
        {
          findType: "image",
          object: "D (3,2)",
          transformation: "270° clockwise",
          image: null,
          options: ["D' (2,-3)", "D' (-2,3)", "D' (-3,-2)", "D' (3,-2)"],
          correct: [1],
          feedback:
            "The rule for 270° clockwise rotation is<br>(x, y) → (-y, x)",
        },

        {
          findType: "image",
          object: "E (-2,5)",
          transformation: "90° anticlockwise",
          image: null,
          options: ["E' (5,2)", "E' (-5,-2)", "E' (-5,2)", "E' (2,5)"],
          correct: [1],
          feedback:
            "The rule for 90° anticlockwise rotation is<br>(x, y) → (-y, x)",
        },

        // —— Find transformation (6–10) ——
        {
          findType: "transformation",
          object: "B (-1,4)",
          transformation: null,
          image: "B' (1,-4)",
          options: [
            "90°<br>clockwise",
            "90°<br>anticlockwise",
            "270°<br>clockwise",
            "180°<br>rotation",
          ],
          correct: [3],
          feedback: "The rule used here is<br>(x, y) → (-x, -y)",
        },
        {
          findType: "transformation",
          object: "C (2,-5)",
          transformation: null,
          image: "C' (5,2)",
          options: [
            "90°<br>clockwise",
            "90°<br>anticlockwise",
            "270°<br>clockwise",
            "270°<br>anticlockwise",
          ],
          correct: [1, 2],
          multiAnswer: true,
          feedbackMiddle: "Good! What is the other<br>possible rotation?",
          feedbackWrong: "The rule used here is<br>(x, y) → (-y, x)",
        },
        {
          findType: "transformation",
          object: "D (-3,-2)",
          transformation: null,
          image: "D' (2,-3)",
          options: [
            "90°<br>clockwise",
            "90°<br>anticlockwise",
            "270°<br>clockwise",
            "270°<br>anticlockwise",
          ],
          correct: [1, 2],
          multiAnswer: true,
          feedbackMiddle: "Good! What is the other<br>possible rotation?",
          feedbackWrong: "The rule used here is<br>(x, y) → (-y, x)",
        },
        {
          findType: "transformation",
          object: "E (5,-1)",
          transformation: null,
          image: "E' (-5,1)",
          options: [
            "180°<br>rotation",
            "90°<br>clockwise",
            "90°<br>anticlockwise",
            "270°<br>clockwise",
          ],
          correct: [0],
          feedback: "The rule used here is<br>(x, y) → (-x, -y)",
        },
        {
          findType: "transformation",
          object: "A (3,2)",
          transformation: null,
          image: "A' (2,-3)",
          options: [
            "90°<br>clockwise",
            "90°<br>anticlockwise",
            "270°<br>clockwise",
            "270°<br>anticlockwise",
          ],
          correct: [0, 3],
          multiAnswer: true,
          feedbackMiddle: "Good! What is the other<br>possible rotation?",
          feedbackWrong: "The rule used here is<br>(x, y) → (y, -x)",
        },

        // —— Find object (1–5) ——
        {
          findType: "object",
          object: null,
          transformation: "90° clockwise",
          image: "A' (4,-2)",
          options: ["A (-2, 4)", "A (4, 2)", "A (-4, 2)", "A (2, 4)"],
          correct: [3],
          feedback:
            "The rule for 90° clockwise rotation is<br>(x, y) → (y, -x)",
        },
        {
          findType: "object",
          object: null,
          transformation: "270° clockwise",
          image: "C' (6,1)",
          options: ["C (-1, 6)", "C (1, 6)", "C (1, -6)", "C (-6, 1)"],
          correct: [2],
          feedback:
            "The rule for 270° clockwise rotation is<br>(x, y) → (-y, x)",
        },
        {
          findType: "object",
          object: null,
          transformation: "90° anticlockwise",
          image: "D' (-2,-7)",
          options: ["D (-7, 2)", "D (7, 2)", "D (2, -7)", "D (7, -2)"],
          correct: [0],
          feedback:
            "The rule for 90° anticlockwise rotation is<br>(x, y) → (-y, x)",
        },
        {
          findType: "object",
          object: null,
          transformation: "270° clockwise",
          image: "G' (-7,-2)",
          options: ["G (-2, 7)", "G (2, -7)", "G (-2, -7)", "G (7, 2)"],
          correct: [0],
          feedback:
            "The rule for 270° clockwise rotation is<br>(x, y) → (-y, x)",
        },

        {
          findType: "object",
          object: null,
          transformation: "180° rotation",
          image: "B' (-3,5)",
          options: ["B (-3, -5)", "B (3, -5)", "B (5, 3)", "B (-5, 3)"],
          correct: [1],
          feedback: "The rule for 180° rotation is<br>(x, y) → (-x, -y)",
        },
      ],
    },
  },
  id: {
    app: {
      start: {
        heading: "Latihan Rotasi",
        text: "Mari berlatih apa yang telah kita pelajari<br>tentang rotasi.<br><br>Ketuk 'MULAI' untuk memulai.",
        buttonText: "MULAI",
      },
      end: {
        heading: "Aktivitas Selesai!",
        text: "Kerja bagus!<br>Anda telah berlatih menentukan koordinat bayangan, koordinat<br>objek, dan sudut rotasi.",
        buttonText: "MULAI LAGI",
      },
      navText: "Ketuk opsi yang benar",
      navCorrect: "Ketuk » untuk pertanyaan berikutnya",
      navLast: "Ketuk » untuk melihat ringkasan",
      navRetry: "Ketuk « untuk menjawab lagi",
      headings: {
        image: "Tentukan koordinat bayangan",
        transformation: "Tentukan sudut rotasi",
        object: "Tentukan koordinat objek",
      },
      questions: [
        {
          findType: "image",
          object: "A (-4,1)",
          transformation: "180° berlawanan arah jarum jam",
          image: null,
          options: ["A' (1,-4)", "A' (-4,-1)", "A' (-1,-4)", "A' (4,-1)"],
          correct: [3],
          feedback: "Aturan untuk rotasi 180° adalah<br>(x, y) → (-x, -y)",
        },
        {
          findType: "image",
          object: "B (3,2)",
          transformation: "90° searah jarum jam",
          image: null,
          options: ["B' (2,3)", "B' (-3,-2)", "B' (2,-3)", "B' (-2,-3)"],
          correct: [2],
          feedback:
            "Aturan untuk rotasi 90° searah jarum jam adalah<br>(x, y) → (y, -x)",
        },
        {
          findType: "image",
          object: "C (4,-1)",
          transformation: "270° berlawanan arah jarum jam",
          image: null,
          options: ["C' (-1,-4)", "C' (1,4)", "C' (-4,1)", "C' (1,-4)"],
          correct: [0],
          feedback:
            "Aturan untuk rotasi 270° berlawanan arah jarum jam adalah<br>(x, y) → (y, -x)",
        },
        {
          findType: "image",
          object: "D (3,2)",
          transformation: "270° searah jarum jam",
          image: null,
          options: ["D' (2,-3)", "D' (-2,3)", "D' (-3,-2)", "D' (3,-2)"],
          correct: [1],
          feedback:
            "Aturan untuk rotasi 270° searah jarum jam adalah<br>(x, y) → (-y, x)",
        },
        {
          findType: "image",
          object: "E (-2,5)",
          transformation: "90° berlawanan arah jarum jam",
          image: null,
          options: ["E' (5,2)", "E' (-5,-2)", "E' (-5,2)", "E' (2,5)"],
          correct: [1],
          feedback:
            "Aturan untuk rotasi 90° berlawanan arah jarum jam adalah<br>(x, y) → (-y, x)",
        },
        {
          findType: "transformation",
          object: "B (-1,4)",
          transformation: null,
          image: "B' (1,-4)",
          options: [
            "90°<br>searah jarum jam",
            "90°<br>berlawanan arah jarum jam",
            "270°<br>searah jarum jam",
            "180°<br>rotasi",
          ],
          correct: [3],
          feedback: "Aturan yang digunakan di sini adalah<br>(x, y) → (-x, -y)",
        },
        {
          findType: "transformation",
          object: "C (2,-5)",
          transformation: null,
          image: "C' (5,2)",
          options: [
            "90°<br>searah jarum jam",
            "90°<br>berlawanan arah jarum jam",
            "270°<br>searah jarum jam",
            "270°<br>berlawanan arah jarum jam",
          ],
          correct: [1, 2],
          multiAnswer: true,
          feedbackMiddle: "Bagus! Apa kemungkinan<br>rotasi lainnya?",
          feedbackWrong:
            "Aturan yang digunakan di sini adalah<br>(x, y) → (-y, x)",
        },
        {
          findType: "transformation",
          object: "D (-3,-2)",
          transformation: null,
          image: "D' (2,-3)",
          options: [
            "90°<br>searah jarum jam",
            "90°<br>berlawanan arah jarum jam",
            "270°<br>searah jarum jam",
            "270°<br>berlawanan arah jarum jam",
          ],
          correct: [1, 2],
          multiAnswer: true,
          feedbackMiddle: "Bagus! Apa kemungkinan<br>rotasi lainnya?",
          feedbackWrong:
            "Aturan yang digunakan di sini adalah<br>(x, y) → (-y, x)",
        },
        {
          findType: "transformation",
          object: "E (5,-1)",
          transformation: null,
          image: "E' (-5,1)",
          options: [
            "180°<br>rotasi",
            "90°<br>searah jarum jam",
            "90°<br>berlawanan arah jarum jam",
            "270°<br>searah jarum jam",
          ],
          correct: [0],
          feedback: "Aturan yang digunakan di sini adalah<br>(x, y) → (-x, -y)",
        },
        {
          findType: "transformation",
          object: "A (3,2)",
          transformation: null,
          image: "A' (2,-3)",
          options: [
            "90°<br>searah jarum jam",
            "90°<br>berlawanan arah jarum jam",
            "270°<br>searah jarum jam",
            "270°<br>berlawanan arah jarum jam",
          ],
          correct: [0, 3],
          multiAnswer: true,
          feedbackMiddle: "Bagus! Apa kemungkinan<br>rotasi lainnya?",
          feedbackWrong:
            "Aturan yang digunakan di sini adalah<br>(x, y) → (y, -x)",
        },
        {
          findType: "object",
          object: null,
          transformation: "90° searah jarum jam",
          image: "A' (4,-2)",
          options: ["A (-2, 4)", "A (4, 2)", "A (-4, 2)", "A (2, 4)"],
          correct: [3],
          feedback:
            "Aturan untuk rotasi 90° searah jarum jam adalah<br>(x, y) → (y, -x)",
        },
        {
          findType: "object",
          object: null,
          transformation: "270° searah jarum jam",
          image: "C' (6,1)",
          options: ["C (-1, 6)", "C (1, 6)", "C (1, -6)", "C (-6, 1)"],
          correct: [2],
          feedback:
            "Aturan untuk rotasi 270° searah jarum jam adalah<br>(x, y) → (-y, x)",
        },
        {
          findType: "object",
          object: null,
          transformation: "90° berlawanan arah jarum jam",
          image: "D' (-2,-7)",
          options: ["D (-7, 2)", "D (7, 2)", "D (2, -7)", "D (7, -2)"],
          correct: [0],
          feedback:
            "Aturan untuk rotasi 90° berlawanan arah jarum jam adalah<br>(x, y) → (-y, x)",
        },
        {
          findType: "object",
          object: null,
          transformation: "270° searah jarum jam",
          image: "G' (-7,-2)",
          options: ["G (-2, 7)", "G (2, -7)", "G (-2, -7)", "G (7, 2)"],
          correct: [0],
          feedback:
            "Aturan untuk rotasi 270° searah jarum jam adalah<br>(x, y) → (-y, x)",
        },
        {
          findType: "object",
          object: null,
          transformation: "Rotasi 180°",
          image: "B' (-3,5)",
          options: ["B (-3, -5)", "B (3, -5)", "B (5, 3)", "B (-5, 3)"],
          correct: [1],
          feedback: "Aturan untuk rotasi 180° adalah<br>(x, y) → (-x, -y)",
        },
      ],
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
