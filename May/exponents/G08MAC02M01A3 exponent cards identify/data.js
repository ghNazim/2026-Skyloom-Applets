const DATA = {
  en: {
    app: {
      start: {
        heading: "Practice Identifying the Base and Exponent",
        text: "Let's practice identifying the base and the exponent by\nexploring numbers written in exponent form!\n\n\nClick 'Start' to explore!",
        buttonText: "Start",
      },
      steps: {
        1: {
          questionText:
            "Identify the base and the exponent in the given exponential form.",
          navText:
            "Drag the labels to the correct parts of the exponential expression and tap ».",
          navDone: "Tap » to see another question.",
          navLast: "Tap » to complete the activity.",
        },
      },
      final: {
        heading: "Great job! Activity Completed!",
        text: "We practiced identifying the base and the exponent by\nexploring numbers written in exponent form.\n\n\nTap 'Start Over' to restart!",
        buttonText: "Start Over",
      },
      labels: {
        base: "Base",
        exponent: "Exponent",
      },
      feedback: {
        correct:
          "Great job! The base is the repeated factor, and the exponent tells how many times the base is multiplied by itself.",
        wrong:
          "Not quite! Identify the repeated factor as the base and the superscript as the exponent.",
      },
      questions: [
        { base: 2, exponent: 5, optionFlip: false },
        { base: 7, exponent: 2, optionFlip: true },
        { base: 10, exponent: 4, optionFlip: true },
        { base: 3, exponent: 6, optionFlip: false },
        { base: 9, exponent: 3, optionFlip: true },
        { base: 4, exponent: 3, optionFlip: false },
        { base: 8, exponent: 2, optionFlip: true },
        { base: 5, exponent: 6, optionFlip: true },
        { base: 11, exponent: 2, optionFlip: false },
        { base: 6, exponent: 4, optionFlip: false },
      ],
    },
  },
  id: {
    app: {
      start: {
        heading: "Latihan Mengidentifikasi Basis dan Eksponen",
        text: "Mari berlatih mengidentifikasi basis dan eksponen dengan\nmenjelajahi bilangan yang ditulis dalam bentuk eksponen!\n\n\nKlik 'Mulai' untuk menjelajahi!",
        buttonText: "Mulai",
      },
      steps: {
        1: {
          questionText:
            "Identifikasi basis dan eksponen dalam bentuk eksponensial yang diberikan.",
          navText:
            "Seret label ke bagian yang benar dari ekspresi eksponensial dan ketuk ».",
          navDone: "Ketuk » untuk melihat pertanyaan lain.",
          navLast: "Ketuk » untuk menyelesaikan aktivitas.",
        },
      },
      final: {
        heading: "Bagus sekali! Aktivitas Selesai!",
        text: "Kita telah berlatih mengidentifikasi basis dan eksponen dengan\nmenjelajahi bilangan yang ditulis dalam bentuk eksponen.\n\n\nKetuk 'Ulangi dari Awal' untuk memulai ulang!",
        buttonText: "Ulangi dari Awal",
      },
      labels: {
        base: "Basis",
        exponent: "Eksponen",
      },
      feedback: {
        correct:
          "Bagus sekali! Basis adalah faktor yang berulang, dan eksponen menunjukkan berapa kali basis dikalikan dengan dirinya sendiri.",
        wrong:
          "Belum tepat! Identifikasi basis sebagai faktor yang berulang dan eksponen sebagai jumlah kali basis dikalikan dengan dirinya sendiri.",
      },
      questions: [
        { base: 2, exponent: 5, optionFlip: false },
        { base: 7, exponent: 2, optionFlip: true },
        { base: 10, exponent: 4, optionFlip: true },
        { base: 3, exponent: 6, optionFlip: false },
        { base: 9, exponent: 3, optionFlip: true },
        { base: 4, exponent: 3, optionFlip: false },
        { base: 8, exponent: 2, optionFlip: true },
        { base: 5, exponent: 6, optionFlip: true },
        { base: 11, exponent: 2, optionFlip: false },
        { base: 6, exponent: 4, optionFlip: false },
      ],
    },
  },
};

const APP_DATA = DATA[current_language].app;
