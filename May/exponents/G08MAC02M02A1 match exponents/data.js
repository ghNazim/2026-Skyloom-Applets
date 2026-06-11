const DATA = {
  en: {
    app: {
      start: {
        heading: "  ",
        text: "Let's match the repeated multiplication expressions with their\ncorrect exponential forms and strengthen your understanding\nof exponents.\n\n\nClick START to explore!",
        buttonText: "Start",
      },
      steps: {
        1: {
          questionText:
            "Match the repeated multiplication with its correct exponential form.",
          navText:
            "Tap a multiplication card, then tap its matching answer card.",
          navAllDone: "Tap 'Start Over' to practice again!",
        },
      },
      feedback: {
        correct:
          "That's a perfect match! The base is the repeated factor, and the exponent tells how many times the base is multiplied by itself.",
        wrong:
          "Not quite! Identify the repeated factor as the base and the superscript as the exponent.",
        allDone:
          "Great work! You have matched all repeated multiplications with their correct exponential forms.",
      },
      hint: {
        base: "Base",
        exponent: "Exponent",
        close: "Close",
        hint: "Hint",
      },
      startOver: "Start Over",
      matching: {
        leftItems: [
          { id: 0, text: "5 \u00D7 5 \u00D7 5", pairId: 0 },
          { id: 1, text: "6 \u00D7 6", pairId: 1 },
          { id: 2, text: "3 \u00D7 3 \u00D7 3 \u00D7 3 \u00D7 3", pairId: 2 },
          { id: 3, text: "2 \u00D7 2 \u00D7 2 \u00D7 2 \u00D7 2 \u00D7 2", pairId: 3 },
          { id: 4, text: "4 \u00D7 4 \u00D7 4 \u00D7 4 \u00D7 4", pairId: 4 },
        ],
        rightItems: [
          { id: 0, base: 2, exponent: 6, pairId: 3 },
          { id: 1, base: 4, exponent: 5, pairId: 4 },
          { id: 2, base: 6, exponent: 2, pairId: 1 },
          { id: 3, base: 3, exponent: 5, pairId: 2 },
          { id: 4, base: 5, exponent: 3, pairId: 0 },
        ],
        hintExample: { base: 2, exponent: 5 },
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "  " ,
        text: "Mari cocokkan ekspresi perkalian berulang dengan\nbentuk eksponen yang benar dan perkuat pemahamanmu\ntentang eksponen.\n\n\nKlik MULAI untuk menjelajahi!",
        buttonText: "Mulai",
      },
      steps: {
        1: {
          questionText:
            "Cocokkan perkalian berulang dengan bentuk eksponen yang benar.",
          navText:
            "Ketuk kartu perkalian, lalu ketuk kartu jawaban yang cocok.",
          navAllDone: "Ketuk 'Ulangi dari Awal' untuk berlatih lagi!",
        },
      },
      feedback: {
        correct:
          "Itu sangat tepat! Basis adalah faktor yang diulang, dan eksponen menunjukkan berapa kali basis dikalikan dengan dirinya sendiri.",
        wrong:
          "Belum tepat! Identifikasi faktor yang berulang sebagai basis dan superskrip sebagai eksponen.",
        allDone:
          "Kerja bagus! Kamu telah mencocokkan semua perkalian berulang dengan bentuk eksponen yang benar.",
      },
      hint: {
        base: "Basis",
        exponent: "Eksponen",
        close: "Tutup",
        hint: "Petunjuk",
      },
      startOver: "Ulangi dari Awal",
      matching: {
        leftItems: [
          { id: 0, text: "5 \u00D7 5 \u00D7 5", pairId: 0 },
          { id: 1, text: "6 \u00D7 6", pairId: 1 },
          { id: 2, text: "3 \u00D7 3 \u00D7 3 \u00D7 3 \u00D7 3", pairId: 2 },
          { id: 3, text: "2 \u00D7 2 \u00D7 2 \u00D7 2 \u00D7 2 \u00D7 2", pairId: 3 },
          { id: 4, text: "4 \u00D7 4 \u00D7 4 \u00D7 4 \u00D7 4", pairId: 4 },
        ],
        rightItems: [
          { id: 0, base: 2, exponent: 6, pairId: 3 },
          { id: 1, base: 4, exponent: 5, pairId: 4 },
          { id: 2, base: 6, exponent: 2, pairId: 1 },
          { id: 3, base: 3, exponent: 5, pairId: 2 },
          { id: 4, base: 5, exponent: 3, pairId: 0 },
        ],
        hintExample: { base: 2, exponent: 5 },
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
