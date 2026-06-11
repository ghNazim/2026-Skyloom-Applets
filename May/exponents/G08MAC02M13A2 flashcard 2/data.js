const DATA = {
  en: {
    app: {
      start: {
        heading: null,
        text: "Let's solve some expressions on <y>power of fractions</y>.",
        buttonText: "Start",
      },
      steps: {
        1: {
          questionText:
            "Choose the correct answer for the expression on the card.",
          navText: "Tap the correct option.",
        },
      },
      buttons: {
        nextQuestion: "Next Question",
        startOver: "Start Over",
      },
      questions: [
        {
          expression:
            "\\dfrac{\\left(\\dfrac{1}{5}\\right)^{4}}{\\left(\\dfrac{1}{5}\\right)^{5}}",
          options: ["\\dfrac{1}{5}", "25", "5", "\\dfrac{1}{25}"],
          correctIndex: 2,
          solutionSteps: [
            { type: "text", content: "Using the quotient rule:" },
            {
              type: "math",
              content: "\\left(\\dfrac{1}{5}\\right)^{4-5}",
            },
            {
              type: "math",
              content: "= \\left(\\dfrac{1}{5}\\right)^{-1}",
            },
            { type: "math", content: "= 5" },
          ],
          finalAnswer: "5",
          wrongFeedback: "Oops! Try again! That's not the answer.",
          correctFeedback: "Well done! That's correct.",
        },
        {
          expression:
            "\\dfrac{\\left(\\dfrac{4}{16}\\right)^{3}}{\\left(\\dfrac{8}{32}\\right)^{2}}",
          options: ["\\dfrac{1}{4}", "\\dfrac{1}{16}", "4", "\\dfrac{1}{2}"],
          correctIndex: 0,
          solutionSteps: [
            { type: "text", content: "First simplify the fractions:" },
            {
              type: "math",
              content:
                "\\dfrac{4}{16} = \\dfrac{1}{4} \\qquad and \\qquad \\dfrac{8}{32} = \\dfrac{1}{4}",
            },
            { type: "text", content: "So," },
            {
              type: "math",
              content:
                "\\dfrac{\\left(\\dfrac{4}{16}\\right)^{3}}{\\left(\\dfrac{8}{32}\\right)^{2}} = \\dfrac{\\left(\\dfrac{1}{4}\\right)^{3}}{\\left(\\dfrac{1}{4}\\right)^{2}}",
            },
            { type: "text", content: "Using the quotient rule:" },
            {
              type: "math",
              content: "\\left(\\dfrac{1}{4}\\right)^{3-2}",
            },
            {
              type: "math",
              content: "= \\left(\\dfrac{1}{4}\\right)^{1}",
            },
            { type: "math", content: "= \\dfrac{1}{4}" },
          ],
          finalAnswer: "\\dfrac{1}{4}",
          wrongFeedback: "Oops! Try again! That's not the answer.",
          correctFeedback: "Well done! That's correct.",
        },
        {
          expression: "\\dfrac{8^{2}}{4^{3}} \\times \\dfrac{32^{5}}{16^{2}}",
          options: ["2^{7}", "2^{10}", "2^{25}", "2^{17}"],
          correctIndex: 3,
          solutionSteps: [
            { type: "text", content: "Write all the numbers as powers of 2:" },
            {
              type: "math",
              content:
                "8 = 2^{3}, \\quad 4 = 2^{2}, \\quad 32 = 2^{5}, \\quad 16 = 2^{4}",
            },
            { type: "text", content: "So," },
            {
              type: "math",
              content:
                "\\dfrac{8^{2}}{4^{3}} \\times \\dfrac{32^{5}}{16^{2}} = \\dfrac{(2^{3})^{2}}{(2^{2})^{3}} \\times \\dfrac{(2^{5})^{5}}{(2^{4})^{2}}",
            },
            { type: "text", content: "Apply Power of a Power rule:" },
            {
              type: "math",
              content: "\\dfrac{2^{6}}{2^{6}} \\times \\dfrac{2^{25}}{2^{8}}",
            },
            { type: "text", content: "Using quotient rule:" },
            {
              type: "math",
              content: "2^{6-6} \\times 2^{25-8}",
            },
            {
              type: "math",
              content: "= 2^{0} \\times 2^{17}",
            },
            {
              type: "math",
              content: "= 1 \\times 2^{17}",
            },
            { type: "math", content: "= 2^{17}" },
          ],
          finalAnswer: "2^{17}",
          wrongFeedback: "Oops! Try again! That's not the answer.",
          correctFeedback: "Well done! That's correct.",
        },
        {
          expression:
            "\\dfrac{3^{2}}{4^{3}} \\div \\dfrac{8}{27} \\times \\left(\\dfrac{2}{3}\\right)^{3}",
          options: [
            "\\dfrac{3}{64}",
            "\\dfrac{9}{64}",
            "\\dfrac{9}{16}",
            "\\dfrac{27}{64}",
          ],
          correctIndex: 1,
          solutionSteps: [
            { type: "text", content: "Write powers:" },
            {
              type: "math",
              content:
                "4^{3} = 64 \\qquad and \\qquad \\left(\\dfrac{2}{3}\\right)^{3} = \\dfrac{8}{27}",
            },
            { type: "text", content: "So," },
            {
              type: "math",
              content:
                "\\dfrac{3^{2}}{4^{3}} \\div \\dfrac{8}{27} \\times \\left(\\dfrac{2}{3}\\right)^{3} = \\dfrac{9}{64} \\div \\dfrac{8}{27} \\times \\dfrac{8}{27}",
            },
            {
              type: "text",
              content:
                "Division by a fraction means multiply by its reciprocal:",
            },
            {
              type: "math",
              content:
                "\\dfrac{9}{64} \\times \\dfrac{27}{8} \\times \\dfrac{8}{27}",
            },
            {
              type: "math",
              content: "= \\dfrac{9}{64} \\times 1",
            },
            { type: "math", content: "= \\dfrac{9}{64}" },
          ],
          finalAnswer: "\\dfrac{9}{64}",
          wrongFeedback: "Oops! Try again! That's not the answer.",
          correctFeedback: "Well done! That's correct.",
        },
      ],
    },
  },
  id: {
    app: {
      start: {
        heading: null,
        text: "Mari selesaikan beberapa ekspresi tentang <y>pangkat pecahan</y>.",
        buttonText: "Mulai",
      },
      steps: {
        1: {
          questionText: "Pilih jawaban yang benar untuk ekspresi pada kartu.",
          navText: "Ketuk opsi yang benar.",
        },
      },
      buttons: {
        nextQuestion: "Pertanyaan Berikutnya",
        startOver: "Ulangi dari Awal",
      },
      questions: [
        {
          expression:
            "\\dfrac{\\left(\\dfrac{1}{5}\\right)^{4}}{\\left(\\dfrac{1}{5}\\right)^{5}}",
          options: ["\\dfrac{1}{5}", "25", "5", "\\dfrac{1}{25}"],
          correctIndex: 2,
          solutionSteps: [
            { type: "text", content: "Menggunakan aturan hasil bagi:" },
            {
              type: "math",
              content: "\\left(\\dfrac{1}{5}\\right)^{4-5}",
            },
            {
              type: "math",
              content: "= \\left(\\dfrac{1}{5}\\right)^{-1}",
            },
            { type: "math", content: "= 5" },
          ],
          finalAnswer: "5",
          wrongFeedback: "Ups! Coba lagi! Itu bukan jawabannya.",
          correctFeedback: "Bagus sekali! Itu benar.",
        },
        {
          expression:
            "\\dfrac{\\left(\\dfrac{4}{16}\\right)^{3}}{\\left(\\dfrac{8}{32}\\right)^{2}}",
          options: ["\\dfrac{1}{4}", "\\dfrac{1}{16}", "4", "\\dfrac{1}{2}"],
          correctIndex: 0,
          solutionSteps: [
            { type: "text", content: "Sederhanakan pecahan terlebih dahulu:" },
            {
              type: "math",
              content:
                "\\dfrac{4}{16} = \\dfrac{1}{4} \\qquad dan \\qquad \\dfrac{8}{32} = \\dfrac{1}{4}",
            },
            { type: "text", content: "Jadi," },
            {
              type: "math",
              content:
                "\\dfrac{\\left(\\dfrac{4}{16}\\right)^{3}}{\\left(\\dfrac{8}{32}\\right)^{2}} = \\dfrac{\\left(\\dfrac{1}{4}\\right)^{3}}{\\left(\\dfrac{1}{4}\\right)^{2}}",
            },
            { type: "text", content: "Menggunakan aturan hasil bagi:" },
            {
              type: "math",
              content: "\\left(\\dfrac{1}{4}\\right)^{3-2}",
            },
            {
              type: "math",
              content: "= \\left(\\dfrac{1}{4}\\right)^{1}",
            },
            { type: "math", content: "= \\dfrac{1}{4}" },
          ],
          finalAnswer: "\\dfrac{1}{4}",
          wrongFeedback: "Ups! Coba lagi! Itu bukan jawabannya.",
          correctFeedback: "Bagus sekali! Itu benar.",
        },
        {
          expression: "\\dfrac{8^{2}}{4^{3}} \\times \\dfrac{32^{5}}{16^{2}}",
          options: ["2^{7}", "2^{10}", "2^{25}", "2^{17}"],
          correctIndex: 3,
          solutionSteps: [
            {
              type: "text",
              content: "Tulis semua angka sebagai pangkat 2:",
            },
            {
              type: "math",
              content:
                "8 = 2^{3}, \\quad 4 = 2^{2}, \\quad 32 = 2^{5}, \\quad 16 = 2^{4}",
            },
            { type: "text", content: "Jadi," },
            {
              type: "math",
              content:
                "\\dfrac{8^{2}}{4^{3}} \\times \\dfrac{32^{5}}{16^{2}} = \\dfrac{(2^{3})^{2}}{(2^{2})^{3}} \\times \\dfrac{(2^{5})^{5}}{(2^{4})^{2}}",
            },
            {
              type: "text",
              content: "Terapkan aturan pangkat atas pangkat:",
            },
            {
              type: "math",
              content: "\\dfrac{2^{6}}{2^{6}} \\times \\dfrac{2^{25}}{2^{8}}",
            },
            { type: "text", content: "Menggunakan aturan hasil bagi:" },
            {
              type: "math",
              content: "2^{6-6} \\times 2^{25-8}",
            },
            {
              type: "math",
              content: "= 2^{0} \\times 2^{17}",
            },
            {
              type: "math",
              content: "= 1 \\times 2^{17}",
            },
            { type: "math", content: "= 2^{17}" },
          ],
          finalAnswer: "2^{17}",
          wrongFeedback: "Ups! Coba lagi! Itu bukan jawabannya.",
          correctFeedback: "Bagus sekali! Itu benar.",
        },
        {
          expression:
            "\\dfrac{3^{2}}{4^{3}} \\div \\dfrac{8}{27} \\times \\left(\\dfrac{2}{3}\\right)^{3}",
          options: [
            "\\dfrac{3}{64}",
            "\\dfrac{9}{64}",
            "\\dfrac{9}{16}",
            "\\dfrac{27}{64}",
          ],
          correctIndex: 1,
          solutionSteps: [
            { type: "text", content: "Tulis pangkat:" },
            {
              type: "math",
              content:
                "4^{3} = 64 \\qquad dan \\qquad \\left(\\dfrac{2}{3}\\right)^{3} = \\dfrac{8}{27}",
            },
            { type: "text", content: "Jadi," },
            {
              type: "math",
              content:
                "\\dfrac{3^{2}}{4^{3}} \\div \\dfrac{8}{27} \\times \\left(\\dfrac{2}{3}\\right)^{3} = \\dfrac{9}{64} \\div \\dfrac{8}{27} \\times \\dfrac{8}{27}",
            },
            {
              type: "text",
              content:
                "Membagi dengan pecahan berarti mengalikan dengan kebalikannya:",
            },
            {
              type: "math",
              content:
                "\\dfrac{9}{64} \\times \\dfrac{27}{8} \\times \\dfrac{8}{27}",
            },
            {
              type: "math",
              content: "= \\dfrac{9}{64} \\times 1",
            },
            { type: "math", content: "= \\dfrac{9}{64}" },
          ],
          finalAnswer: "\\dfrac{9}{64}",
          wrongFeedback: "Ups! Coba lagi! Itu bukan jawabannya.",
          correctFeedback: "Bagus sekali! Itu benar.",
        },
      ],
    },
  },
};

const APP_DATA = DATA[current_language].app;
