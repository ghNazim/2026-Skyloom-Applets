const DATA = {
  en: {
    app: {
      start: {
        heading: null,
        text: "Let's solve some challenges on <y>negative exponents</y>.\n\nClick 'Start'.",
        buttonText: "Start",
      },
      steps: {
        1: {
          questionText:
            "Choose the simplest form for the expression on the card.",
          navText: "Tap the correct option.",
        },
      },
      buttons: {
        nextQuestion: "Next Question",
        startOver: "Start Over",
      },
      questions: [
        {
          expression: "2^{-2}",
          options: ["-4", "\\dfrac{1}{4}", "4", "-\\dfrac{1}{4}"],
          correctIndex: 1,
          solutionLatex: "2^{-2} = \\dfrac{1}{2^{2}} = \\dfrac{1}{4}",
          wrongFeedback: "Oops! Try again! That's not the answer.",
          correctFeedback: "Well done! {{solution}}",
        },
        {
          expression: "(3b)^{-4}",
          options: [
            "\\dfrac{1}{3b^{4}}",
            "81b^{4}",
            "\\dfrac{1}{81b^{4}}",
            "\\dfrac{3}{b^{4}}",
          ],
          correctIndex: 2,
          solutionLatex: "(3b)^{-4} = \\dfrac{1}{(3b)^{4}} = \\dfrac{1}{81b^{4}}",
          wrongFeedback: "Oops! Try again! That's not the answer.",
          correctFeedback: "Well done! {{solution}}",
        },
        {
          expression: "6q^{-5}",
          options: [
            "\\dfrac{6}{q^{5}}",
            "\\dfrac{1}{6q^{5}}",
            "6q^{5}",
            "\\dfrac{q^{5}}{6}",
          ],
          correctIndex: 0,
          solutionLatex:
            "6q^{-5} = 6 \\cdot \\dfrac{1}{q^{5}} = \\dfrac{6}{q^{5}}",
          wrongFeedback: "Oops! Try again! That's not the answer.",
          correctFeedback: "Well done! {{solution}}",
        },
        {
          expression: "\\dfrac{a}{4b^{-5}}",
          options: [
            "\\dfrac{a}{4b^{5}}",
            "\\dfrac{4a}{b^{5}}",
            "4ab^{5}",
            "\\dfrac{ab^{5}}{4}",
          ],
          correctIndex: 3,
          solutionLatex:
            "\\dfrac{a}{4b^{-5}} = \\dfrac{a \\cdot b^{5}}{4} = \\dfrac{ab^{5}}{4}",
          wrongFeedback: "Oops! Try again! That's not the answer.",
          correctFeedback: "Well done! {{solution}}",
        },
        {
          expression: "\\dfrac{4c}{16^{-8}}",
          options: [
            "\\dfrac{c}{4 \\cdot 16^{8}}",
            "2^{34}c",
            "2^{-34}c",
            "4c \\cdot 16^{-8}",
          ],
          correctIndex: 1,
          solutionLatex:
            "\\dfrac{4c}{16^{-8}} = 4c \\cdot 16^{8} = 2^{2} \\cdot 2^{32} \\cdot c = 2^{34}c",
          wrongFeedback: "Oops! Try again! That's not the answer.",
          correctFeedback: "Well done! {{solution}}",
        },
      ],
    },
  },
  id: {
    app: {
      start: {
        heading: null,
        text: "Mari selesaikan beberapa tantangan tentang <y>eksponen negatif</y>.\n\nKlik 'Mulai'.",
        buttonText: "Mulai",
      },
      steps: {
        1: {
          questionText:
            "Pilih bentuk terpendek untuk ekspresi yang ada di kartu.",
          navText: "Ketuk opsi yang benar.",
        },
      },
      buttons: {
        nextQuestion: "Pertanyaan Berikutnya",
        startOver: "Ulangi dari Awal",
      },
      questions: [
        {
          expression: "2^{-2}",
          options: ["-4", "\\dfrac{1}{4}", "4", "-\\dfrac{1}{4}"],
          correctIndex: 1,
          solutionLatex: "2^{-2} = \\dfrac{1}{2^{2}} = \\dfrac{1}{4}",
          wrongFeedback: "Ups! Coba lagi! Itu bukan jawabannya.",
          correctFeedback: "Bagus sekali! {{solution}}",
        },
        {
          expression: "(3b)^{-4}",
          options: [
            "\\dfrac{1}{3b^{4}}",
            "81b^{4}",
            "\\dfrac{1}{81b^{4}}",
            "\\dfrac{3}{b^{4}}",
          ],
          correctIndex: 2,
          solutionLatex: "(3b)^{-4} = \\dfrac{1}{(3b)^{4}} = \\dfrac{1}{81b^{4}}",
          wrongFeedback: "Ups! Coba lagi! Itu bukan jawabannya.",
          correctFeedback: "Bagus sekali! {{solution}}",
        },
        {
          expression: "6q^{-5}",
          options: [
            "\\dfrac{6}{q^{5}}",
            "\\dfrac{1}{6q^{5}}",
            "6q^{5}",
            "\\dfrac{q^{5}}{6}",
          ],
          correctIndex: 0,
          solutionLatex:
            "6q^{-5} = 6 \\cdot \\dfrac{1}{q^{5}} = \\dfrac{6}{q^{5}}",
          wrongFeedback: "Ups! Coba lagi! Itu bukan jawabannya.",
          correctFeedback: "Bagus sekali! {{solution}}",
        },
        {
          expression: "\\dfrac{a}{4b^{-5}}",
          options: [
            "\\dfrac{a}{4b^{5}}",
            "\\dfrac{4a}{b^{5}}",
            "4ab^{5}",
            "\\dfrac{ab^{5}}{4}",
          ],
          correctIndex: 3,
          solutionLatex:
            "\\dfrac{a}{4b^{-5}} = \\dfrac{a \\cdot b^{5}}{4} = \\dfrac{ab^{5}}{4}",
          wrongFeedback: "Ups! Coba lagi! Itu bukan jawabannya.",
          correctFeedback: "Bagus sekali! {{solution}}",
        },
        {
          expression: "\\dfrac{4c}{16^{-8}}",
          options: [
            "\\dfrac{c}{4 \\cdot 16^{8}}",
            "2^{34}c",
            "2^{-34}c",
            "4c \\cdot 16^{-8}",
          ],
          correctIndex: 1,
          solutionLatex:
            "\\dfrac{4c}{16^{-8}} = 4c \\cdot 16^{8} = 2^{2} \\cdot 2^{32} \\cdot c = 2^{34}c",
          wrongFeedback: "Ups! Coba lagi! Itu bukan jawabannya.",
          correctFeedback: "Bagus sekali! {{solution}}",
        },
      ],
    },
  },
};

const APP_DATA = DATA[current_language].app;
