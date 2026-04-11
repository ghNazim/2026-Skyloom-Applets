
const decimal = {
  en: ".",
  id: ",",
};

// Master data structure for Right Triangle Word Problem
const DATA = {
  en: {
    app: {
      start_over: "Restart",
      questionText:
        "A right-angled triangle is given.\na. Find the area of the triangle.\nb. If side BC is taken as the base, find the height corresponding to the hypotenuse.",
      comprehend: {
        sectionTitle: "INFORMATION ANALYSIS",
        images: [
          "assets/compre1.svg",
          "assets/compre2.svg",
          "assets/compre3.svg",
          "assets/compre4.svg",
        ],
        given: {
          title: "Given:",
          data: ["Triangle ABC is right-angled at A.", "BC = Base = 10 cm"],
          highlights: ["right-angled triangle", "right-angled triangle"],
        },
        toFind: {
          title: "To find:",
          data: [
            "Area of the given triangle.",
            "Height corresponding to its hypotenuse.",
          ],
          highlights: [
            "Find the area of the triangle",
            "find the height corresponding to the hypotenuse",
          ],
        },
      },
      splash: {
        step2: {
          image: "assets/compre4.svg",
          text: "<blue>✓ Information gathered from the figure.</blue><br><yellow>Next - Let's solve step by step to find the area and height.</yellow>",
        },
      },
      step3Calc: {
        questionText: "(a) Find the area of the triangle ABC.",
        navTapHighlight: "Tap the highlighted text.",
        navTapSubstitute: "Tap » to substitute the correct base.",
        navTapContinue: "Tap » to continue.",
        initialRow: "Area of Triangle ABC = ½ × Base × ",
        interactiveLabel: "Height",
        replaceValue: "<yl>AC</yl>",
        findingsTitle: "Given:",
        findingsItems: [
          "Triangle ABC is right-angled at A.",
          "BC = Base = 10 cm",
        ],
        toFindTitle: "To find:",
        toFindItems: [
          "Area of the given triangle.",
          "Height corresponding to its hypotenuse.",
        ],
      },
      step4Mcq: {
        questionText:
          "Let's choose the correct base for the corresponding height.",
        navTapOption: "Tap the correct base.",
        navTapSubstitute: "Tap » to substitute the values.",
        calcRowPrefix: "Area of Triangle ABC = ½ × ",
        calcRowSuffix: " × <yl>AC</yl>",
        replaceBoxLabel: "Base",
        options: ["BC", "AB", "AC"],
        answerIndex: 1,
        answerText: "AB",
        wrongImage: "assets/mcqwrong.svg",
        correctImage: "assets/pair1.svg",
      },
      step5Numpad: {
        questionText: "Let's calculate the area.",
        navUseNumpad: "Use the numpad to fill the answer and click ✓.",
        navTapContinue: "Tap » to continue.",
        row1: "Area of Triangle ABC = ½ × 6 cm × 8 cm",
        row2Prefix: "Area of Triangle ABC = ",
        row2Suffix: " cm²",
        answer: "24",
        numpadMaxLength: 3,
      },
      step6Transition: {
        questionText:
          "(b) If side BC is taken as the base, find the height corresponding to the hypotenuse.",
        navText: "Tap » to choose the correct base-height pair.",
        calcRow: "Area of Triangle ABC = ½ × Base × Height",
        findingsTitle: "Findings:",
        findingsItems: ["Area of Triangle ABC = 24 cm²"],
      },
      step6Mcq: {
        questionText:
          "Let's choose the correct height for the corresponding base BC.",
        navTapOption: "Tap the correct height.",
        calcRowPrefix: "Area of Triangle ABC = ½ × BC × ",
        replaceBoxLabel: "Height",
        options: ["AC", "AB", "t"],
        answerIndex: 2,
        answerText: "t",
        // After MCQ correct:
        afterCorrectQuestion:
          "Let's substitute the values in the math sentence.",
        afterCorrectNav: "Tap the highlighted text.",
        // Interactive box row: entire row is interactive
        interactiveRow: "Area of Triangle ABC = ½ × BC × t",
        // After clicking interactive row:
        expandedRow1: "24 cm² = ½ × 10 cm × t",
        expandedRow2: "24 cm² = 5 cm × t",
        // After clicking expanded row2:
        afterExpand2Question: "Let's calculate the corresponding height.",
        afterExpand2Nav: "Tap the highlighted text.",
        // Final numpad row
        finalRow1: "24 cm² = ½ × 10 cm × t",
        finalRow2: "24 cm² = 5 cm × t",
        finalRow3Prefix: "<in></in>t = ",
        finalRow3Suffix: "",
        finalRow3Placeholder: "24 cm² ÷ 5 cm",
        finalSubstituteValue: "4.8 cm",
        navTapSubstituteAnswer: "Tap the highlighted text.",
        navCorrect: "Tap » to continue.",
      },
      step7Final: {
        finalAnswerText:
          "The height corresponding to its hypotenuse is 4.8 cm.",
      },
      labels: {
        findings: "Findings",
      },
      altTexts: {
        classroom: "Right triangle",
        diagram: "Diagram",
        visualRepresentation: "Visual representation",
        splashImage: "Summary visual",
      },
      steps: {
        0: {
          questionText: "Read the question and identify 'given' and 'to find'.",
          navText: "Tap » to identify 'given' information.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true,
        },
        1: {
          questionText:
            "<left>A right-angled triangle is given.\na. Find the area of the triangle.\nb. If side BC is taken as the base, find the height corresponding to the hypotenuse.</left>",
          navText: "Tap » to identify 'given' information.",
          navToFind: "Tap » to identify what we need 'to find'.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre1.svg",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false,
        },
        2: {
          questionText: "",
          navText: "Tap » to continue.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true,
        },
        3: {
          questionText: "(a) Find the area of the triangle ABC.",
          navText: "Tap the highlighted text.",
          image: "assets/compre4.svg",
          isCalcStep: true,
          nextEnabled: false,
        },
        4: {
          questionText:
            "Let's choose the correct base for the corresponding height.",
          navText: "Tap the correct base.",
          image: "assets/compre4.svg",
          imageCorrect: "assets/pair1.svg",
          isMcqStep: true,
          nextEnabled: false,
        },
        5: {
          questionText: "Let's calculate the area.",
          navText: "Use the numpad to fill the answer and click ✓.",
          image: "assets/pair1.svg",
          isNumpadStep: true,
          nextEnabled: false,
        },
        6: {
          questionText:
            "(b) If side BC is taken as the base, find the height corresponding to the hypotenuse.",
          navText: "Tap » to choose the correct base-height pair.",
          image: "assets/compre4.svg",
          isTransitionStep: true,
          nextEnabled: true,
        },
        7: {
          questionText:
            "Let's choose the correct height for the corresponding base BC.",
          navText: "Tap the correct height.",
          image: "assets/compre4.svg",
          imageCorrect: "assets/pair2.svg",
          isMcqStep2: true,
          nextEnabled: false,
        },
        8: {
          questionText: "Activity Completed!",
          navText: "Tap 'Restart' to restart the activity.",
          image: "assets/final.svg",
          isFinalStep: true,
          nextEnabled: true,
        },
      },
    },
  },
  id: {
    app: {
      start_over: "Mulai Ulang",
      questionText:
        "Sebuah segitiga siku-siku diberikan.\na. Cari luas segitiga tersebut.\nb. Jika sisi BC diambil sebagai alas, cari tinggi yang bersesuaian dengan hipotenusa.",
      comprehend: {
        sectionTitle: "ANALISIS INFORMASI",
        images: [
          "assets/compre1.svg",
          "assets/compre2.svg",
          "assets/compre3.svg",
          "assets/compre4.svg",
        ],
        given: {
          title: "Diketahui:",
          data: ["Segitiga ABC siku-siku di A.", "BC = Alas = 10 cm"],
          highlights: ["segitiga siku-siku", "segitiga siku-siku"],
        },
        toFind: {
          title: "Ditanyakan:",
          data: [
            "Luas segitiga yang diberikan.",
            "Tinggi yang bersesuaian dengan hipotenusanya.",
          ],
          highlights: [
            "Cari luas segitiga",
            "cari tinggi yang bersesuaian dengan hipotenusa",
          ],
        },
      },
      splash: {
        step2: {
          image: "assets/compre4.svg",
          text: "<blue>✓ Informasi sudah dikumpulkan dari gambar.</blue><br><yellow>Berikutnya - Mari selesaikan langkah demi langkah untuk mencari luas dan tinggi.</yellow>",
        },
      },
      step3Calc: {
        questionText: "(a) Cari luas segitiga ABC.",
        navTapHighlight: "Ketuk teks yang disorot.",
        navTapSubstitute: "Ketuk » untuk mengganti alas yang benar.",
        navTapContinue: "Ketuk » untuk melanjutkan.",
        initialRow: "Luas Segitiga ABC = ½ × Alas × ",
        interactiveLabel: "Tinggi",
        replaceValue: "<yl>AC</yl>",
        findingsTitle: "Diketahui:",
        findingsItems: ["Segitiga ABC siku-siku di A.", "BC = Alas = 10 cm"],
        toFindTitle: "Ditanyakan:",
        toFindItems: [
          "Luas segitiga yang diberikan.",
          "Tinggi yang bersesuaian dengan hipotenusanya.",
        ],
      },
      step4Mcq: {
        questionText:
          "Mari pilih alas yang benar untuk tinggi yang bersesuaian.",
        navTapOption: "Ketuk alas yang benar.",
        navTapSubstitute: "Ketuk » untuk mengganti nilai-nilainya.",
        calcRowPrefix: "Luas Segitiga ABC = ½ × ",
        calcRowSuffix: " × <yl>AC</yl>",
        replaceBoxLabel: "Alas",
        options: ["BC", "AB", "AC"],
        answerIndex: 1,
        answerText: "AB",
        wrongImage: "assets/mcqwrong.svg",
        correctImage: "assets/pair1.svg",
      },
      step5Numpad: {
        questionText: "Mari hitung luasnya.",
        navUseNumpad: "Gunakan numpad untuk mengisi jawaban dan klik ✓.",
        navTapContinue: "Ketuk » untuk melanjutkan.",
        row1: "Luas Segitiga ABC = ½ × 6 cm × 8 cm",
        row2Prefix: "Luas Segitiga ABC = ",
        row2Suffix: " cm²",
        answer: "24",
        numpadMaxLength: 3,
      },
      step6Transition: {
        questionText:
          "(b) Jika sisi BC diambil sebagai alas, cari tinggi yang bersesuaian dengan hipotenusa.",
        navText: "Ketuk » untuk memilih pasangan alas-tinggi yang benar.",
        calcRow: "Luas Segitiga ABC = ½ × Alas × Tinggi",
        findingsTitle: "Temuan:",
        findingsItems: ["Luas Segitiga ABC = 24 cm²"],
      },
      step6Mcq: {
        questionText:
          "Mari pilih tinggi yang benar untuk alas BC yang bersesuaian.",
        navTapOption: "Ketuk tinggi yang benar.",
        calcRowPrefix: "Luas Segitiga ABC = ½ × BC × ",
        replaceBoxLabel: "Tinggi",
        options: ["AC", "AB", "t"],
        answerIndex: 2,
        answerText: "t",
        afterCorrectQuestion:
          "Mari mengganti nilai-nilai dalam kalimat matematika.",
        afterCorrectNav: "Ketuk teks yang disorot.",
        interactiveRow: "Luas Segitiga ABC = ½ × BC × t",
        expandedRow1: "24 cm² = ½ × 10 cm × t",
        expandedRow2: "24 cm² = 5 cm × t",
        afterExpand2Question: "Mari hitung tinggi yang bersesuaian.",
        afterExpand2Nav: "Ketuk teks yang disorot.",
        finalRow1: "24 cm² = ½ × 10 cm × t",
        finalRow2: "24 cm² = 5 cm × t",
        finalRow3Prefix: "<in></in>t = ",
        finalRow3Suffix: "",
        finalRow3Placeholder: "24 cm² ÷ 5 cm",
        finalSubstituteValue: "4,8 cm",
        navTapSubstituteAnswer: "Ketuk teks yang disorot.",
        navCorrect: "Ketuk » untuk melanjutkan.",
      },
      step7Final: {
        finalAnswerText:
          "Tinggi yang bersesuaian dengan hipotenusanya adalah 4,8 cm.",
      },
      labels: {
        findings: "Temuan",
      },
      altTexts: {
        classroom: "Segitiga siku-siku",
        diagram: "Diagram",
        visualRepresentation: "Representasi visual",
        splashImage: "Visual ringkasan",
      },
      steps: {
        0: {
          questionText:
            "Baca soal dan identifikasi 'diketahui' serta 'ditanyakan'.",
          navText: "Ketuk » untuk mengidentifikasi informasi 'diketahui'.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true,
        },
        1: {
          questionText:
            "<left>Sebuah segitiga siku-siku diberikan.\na. Cari luas segitiga tersebut.\nb. Jika sisi BC diambil sebagai alas, cari tinggi yang bersesuaian dengan hipotenusa.</left>",
          navText: "Ketuk » untuk mengidentifikasi informasi 'diketahui'.",
          navToFind:
            "Ketuk » untuk mengidentifikasi apa yang perlu 'ditanyakan'.",
          navTextCorrect: "Ketuk » untuk melanjutkan.",
          image: "assets/compre1.svg",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false,
        },
        2: {
          questionText: "",
          navText: "Ketuk » untuk melanjutkan.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true,
        },
        3: {
          questionText: "(a) Cari luas segitiga ABC.",
          navText: "Ketuk teks yang disorot.",
          image: "assets/compre4.svg",
          isCalcStep: true,
          nextEnabled: false,
        },
        4: {
          questionText:
            "Mari pilih alas yang benar untuk tinggi yang bersesuaian.",
          navText: "Ketuk alas yang benar.",
          image: "assets/compre4.svg",
          imageCorrect: "assets/pair1.svg",
          isMcqStep: true,
          nextEnabled: false,
        },
        5: {
          questionText: "Mari hitung luasnya.",
          navText: "Gunakan numpad untuk mengisi jawaban dan klik ✓.",
          image: "assets/pair1.svg",
          isNumpadStep: true,
          nextEnabled: false,
        },
        6: {
          questionText:
            "(b) Jika sisi BC diambil sebagai alas, cari tinggi yang bersesuaian dengan hipotenusa.",
          navText: "Ketuk » untuk memilih pasangan alas-tinggi yang benar.",
          image: "assets/compre4.svg",
          isTransitionStep: true,
          nextEnabled: true,
        },
        7: {
          questionText:
            "Mari pilih tinggi yang benar untuk alas BC yang bersesuaian.",
          navText: "Ketuk tinggi yang benar.",
          image: "assets/compre4.svg",
          imageCorrect: "assets/pair2.svg",
          isMcqStep2: true,
          nextEnabled: false,
        },
        8: {
          questionText: "Aktivitas Selesai!",
          navText: "Ketuk 'Mulai Ulang' untuk mengulang aktivitas.",
          image: "assets/compre4.svg",
          isFinalStep: true,
          nextEnabled: true,
        },
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
