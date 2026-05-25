const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      steps: {
        1: {
          questionText: "Exploring the position of items",
          navText: "Tap Start.",
          startButton: "START",
        },
        2: {
          questionText: "Exploring the position of items",
          navText: "Tap the correct option.",
          navCorrect: "Tap » to continue.",
          navFinal: "Tap » to re-do this activity.",
        },
      },
      questions: [
        {
          img: "assets/one.png",
          title: "The Circle is ______ the square.",
          options: ["below", "top", "on"],
          ans: 2,
          feedbackImage: "assets/q1h.png",
        },
        {
          img: "assets/one.png",
          title: "The triangle is ______ the table.",
          options: ["on", "under", "beside"],
          ans: 1,
          feedbackImage: "assets/q2h.png",
        },
        {
          img: "assets/one.png",
          title: "The boy is standing ______ the table.",
          options: ["on", "under", "beside"],
          ans: 2,
          feedbackImage: "assets/q3h.png",
        },
        {
          img: "assets/one.png",
          title: "The boy is standing ______ the table.",
          options: ["on", "behind", "front"],
          ans: 1,
          feedbackImage: "assets/q3h.png",
        },
        {
          img: "assets/one.png",
          title: "The square is ______ the circle.",
          options: ["below", "on", "under"],
          ans: 2,
          feedbackImage: "assets/q1h.png",
        },
        {
          img: "assets/one.png",
          title: "The notebook is to the ______ of the square.",
          options: ["bottom", "left", "right"],
          ans: 2,
          feedbackImage: "assets/q6h.png",
        },
        {
          img: "assets/one.png",
          title: "The table is in ______ of the boy.",
          options: ["front", "behind", "beside"],
          ans: 0,
          feedbackImage: "assets/q3h.png",
        },
      ],
    },
  },
  id: {
    app: {
      steps: {
        1: {
          questionText: "Mengeksplorasi posisi benda-benda",
          navText: "Ketuk Mulai.",
          startButton: "MULAI",
        },
        2: {
          questionText: "Mengeksplorasi posisi benda-benda",
          navText: "Ketuk opsi yang benar.",
          navCorrect: "Ketuk » untuk melanjutkan.",
          navFinal: "Ketuk » untuk mengulangi aktivitas ini.",
        },
      },
      questions: [
        {
          img: "assets/one.png",
          title: "Lingkaran berada ______ persegi.",
          options: ["di bawah", "atas", "di atas"],
          ans: 2,
          feedbackImage: "assets/q1h.png",
        },
        {
          img: "assets/one.png",
          title: "Segitiga berada ______ meja.",
          options: ["di atas", "di bawah", "di samping"],
          ans: 1,
          feedbackImage: "assets/q2h.png",
        },
        {
          img: "assets/one.png",
          title: "Anak laki-laki berdiri ______ meja.",
          options: ["di atas", "di bawah", "di samping"],
          ans: 2,
          feedbackImage: "assets/q3h.png",
        },
        {
          img: "assets/one.png",
          title: "Anak laki-laki berdiri ______ meja.",
          options: ["di atas", "di belakang", "di depan"],
          ans: 1,
          feedbackImage: "assets/q3h.png",
        },
        {
          img: "assets/one.png",
          title: "Persegi ______ lingkaran.",
          options: ["di bawah", "di atas", "tepat di bawah"],
          ans: 2,
          feedbackImage: "assets/q1h.png",
        },
        {
          img: "assets/one.png",
          title: "Buku catatan ada di ______ persegi.",
          options: ["bawah", "kiri", "kanan"],
          ans: 2,
          feedbackImage: "assets/q6h.png",
        },
        {
          img: "assets/one.png",
          title: "Meja berada di ______ anak laki-laki.",
          options: ["depan", "belakang", "samping"],
          ans: 0,
          feedbackImage: "assets/q3h.png",
        },
      ],
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
