// const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

// Master data structure for Paint Trap Wall (Trapezium)
const DATA = {
  en: {
    app: {
      start_over: "Restart",

      // Step 0: Comprehend question
      comprehend: {
        comprehendQuestion:
          "A boundary wall in the shape of a trapezium will be painted with a base coat to prepare it for a mural. If one can of paint can cover 1.5 m² at a cost of Rp 22,500.00, determine the total cost required to paint the wall (√3 = 1.73) .",
        infoList: [
          "In trapezium ABCD, AD = DC = CB = 4m",
          "Area covered by 1 can = 1.5 m²",
          "Cost of 1 can = Rp 22,500.00",
          "Total cost of painting wall = ?"
        ],
        highlights: [
          "A boundary wall in the shape of a trapezium",
          "If one can of paint can cover 1.5 m²",
          ["one can of paint", "a cost of Rp 22,500.00"],
          "determine the total cost required to paint the wall (√3 = 1.73)"
        ],
        images: [
          "assets/compre1.svg",
          "assets/compre0.svg",
          "assets/compre0.svg",
          "assets/compre0.svg"
        ],
        defaultImage: "assets/compre0.svg",
        nav: "Tap » to identify 'given' information in the question.",
        navFinal: "Tap »",
        q: "Visualising the Question"
      },

      // Splash screens data (Step 2)
      splash: {
        step2: {
          image: "assets/mcq1correct.svg",
          text: "<blue>✓ Information gathered from the figure.</blue><br><yellow>Next - Identify what the area of the rice field represents.</yellow>",
          dataList: [
            "In trapezium ABCD, AD = DC = CB = 4m",
            "Area covered by 1 can = 1.5 m²",
            "Cost of 1 can = Rp 22,500.00",
            "Total cost of painting wall = ?"
          ],
          nav: "Tap » to understand the shape better."
        }
      },

      // MCQ data for Step 1
      mcq: {
        title: "What do we need to find to get total cost of painting the wall?",
        options: [
          "Perimeter of the wall",
          "Length of the wall",
          "Area of the wall"
        ],
        correctIndex: 2,
        feedbacks: null,
        imagesForEachOption: null,
        defaultImage: "assets/compre0.svg",
        correctImage: "assets/mcq1Correct.svg",
        nav: "Tap the correct answer",
        navFinal: "Tap » to summarise so far"
      },

      // Step 3: Perpendiculars + OnlyText
      onlyText: {
        step3: {
          initialText: "We need height and\nlength of both bases\nto calculate\narea of a trapezium.",
          finalText: "⏢ABCD is composed of\n∆ADE, ▭DCFE and ∆BCF",
          q: "Drop perpendiculars from one base of the trapezium to the other",
          nav: "Tap points D and C to draw perpendicular lines to the base AB.",
          navFinal: "Tap » to explore the triangles further"
        }
      },
      perpendiculars: {
        defaultImage: "assets/compre0.svg",
        perp1left: "assets/perp1left.svg",
        perp1right: "assets/perp1right.svg",
        perp2: "assets/perp2.svg"
      },

      // Step 4: MCQ (congruent triangles)
      mcq2: {
        title: "Are the triangles ADE and BCF congruent triangles?",
        options: ["Yes", "No"],
        correctIndex: 0,
        feedbacks: [
          "Note that 2 angles and a side are equal in measure in both triangles",
          "∠A = ∠B = 60°,   AD = BC = 4 m,\n∠E = ∠F = 90°.\nBy ASA, the triangles are congruent!"
        ],
        defaultImage: "assets/mcq2.svg",
        correctImage: "assets/mcq2.svg",
        nav: "Tap the correct answer",
        navFinal: "Tap » to explore the ratio of sides in the triangles"
      },

      // Step 5: MCQ (side ratio)
      mcq3: {
        title: "What is the side ratio of sides in the triangles?",
        options: ["1 : 1 : √2", "1 : √3 : 2", "1 : √2 : √3"],
        correctIndex: 1,
        feedbacks: [
          "Note that the triangles are 30-60-90 special triangles.",
          "∠D = 30°, ∠A = 60°, ∠E = 90°.",
          "Note that the triangles are 30-60-90 special triangles."
        ],
        defaultImage: "assets/mcq3.svg",
        correctImage: "assets/mcq3.svg",
        nav: "Tap the correct answer",
        navFinal: "Tap » to find the sides of the triangle"
      },

      // Step 6: Table (ratio multiplier + side lengths)
      tableStep: {
        title: "What is the multiplier for the ratio, if AD = 4m",
        headers: ["AE", "ED", "DA"],
        arrowCorrectAnswer: "2",
        arrowMaxLength: 1,
        image: "assets/tableAD.svg",
        imageAfterED: "assets/tableDE.svg",
        imageAfterAE: "assets/tableAE.svg",
        nav: "Use numpad to enter the ratio multiplier",
        navFinal: "Tap » to find dimensions of trapezium"
      },

      // Step 7: MCQ (dimensions of trapezium) – image per option
      mcq4: {
        title: "What are the dimensions of the trapezium?",
        options: [
          "Bases: 4 m, 4 m; height: 2√3 m",
          "Bases: 4 m, 8 m; height: 4 m",
          "Bases: 4 m, 8 m; height: 2√3 m"
        ],
        correctIndex: 2,
        feedbacks: [
          "Oops, remember, both triangles are congruent. We should add their bases to the trapezium's base.",
          "Oops, we need perpendicular height between the bases of the trapezium.",
          "Since DCFE is a rectangle, EF = 4 m, and AB = 2 + 4 + 2 = 8m"
        ],
        defaultImage: "assets/mcq4.svg",
        imagesForEachOption: [
          "assets/mcq4opt1.svg",
          "assets/mcq4opt2.svg",
          "assets/mcq4opt3.svg"
        ],
        nav: "Tap the correct answer",
        navFinal: "Tap » to find area of trapezium"
      },

      // Step 8: MCQ (area formula)
      mcq5: {
        title: "What is the area of the trapezium?",
        options: [
          "½ × ( a × b ) × h",
          "½ × ( a + b ) × h"
        ],
        correctIndex: 1,
        feedbacks: null,
        defaultImage: "assets/mcq5.svg",
        correctImage: "assets/mcq5.svg",
        nav: "Tap the correct answer",
        navFinal: "Tap »."
      },

      // Step 9: Compute (area of trapezium – substitute and simplify)
      compute1Config: {
        title: "What is the area of the trapezium?",
        defaultImage: "assets/mcq5.svg",
        finalImage: "assets/compute1final.svg",
        navFinal: "Tap » to summarise so far",
        colors: {
          lightBlue: "#56C7FF",
          lightGreen: "#47D2B6",
          yellow: "#EAB308"
        },
        steps: [
          { delay: 0, row1: "½ × ( a + b ) × h", rowsCount: 1 },
          { delay: 1000, appendRow: "½ × ( a + b ) × h" },
          { delay: 1500, highlightRow1: [{ text: "a", color: "#56C7FF" }], row2: "½ × ( 4 + b ) × h", row2Colored: [{ text: "4", color: "#56C7FF" }], image: "assets/a.svg" },
          { delay: 1500, highlightRow1: [{ text: "b", color: "#56C7FF" }], row2: "½ × ( 4 + 8 ) × h", row2Colored: [{ text: "8", color: "#56C7FF" }], image: "assets/b.svg" },
          { delay: 1500, highlightRow1: [{ text: "h", color: "#47D2B6" }], row2: "½ × ( 4 + 8 ) × 2√3", row2Colored: [{ text: "2√3", color: "#47D2B6" }], image: "assets/h.svg" },
          { delay: 1500, image: "assets/mcq5.svg" },
          { delay: 1500, appendRow: "½ × ( 4 + 8 ) × 2√3" },
          { delay: 1500, highlightRow2: [{ text: "( 4 + 8 )", color: "#EAB308" }], row3: "½ × ( 12 ) × 2√3", row3Colored: [{ text: "12", color: "#EAB308" }] },
          { delay: 1500, highlightRow2: [{ text: "½ ×", color: "#EAB308" }, { text: "2", color: "#EAB308" }], row3: "12 × √3" },
          { delay: 1500, highlightRow2: [{ text: "√3", color: "#EAB308" }], row3: "12 × 1.73", row3Colored: [{ text: "1.73", color: "#EAB308" }] },
          { delay: 1500, row3FullHighlight: true, row3Replace: "20.76 m²", image: "assets/compute1final.svg", final: true }
        ]
      },

      // Steps configuration
      steps: {
        0: {
          questionText: "",
          navText: "",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: true
        },
        1: {
          questionText: "",
          navText: "",
          isMcq: true,
          mcqKey: "mcq",
          nextEnabled: false
        },
        2: {
          questionText: "",
          navText: "",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true
        },
        3: {
          questionText: "",
          navText: "",
          isOnlyText: true,
          onlyTextKey: "step3",
          isPerpendiculars: true,
          nextEnabled: false
        },
        4: {
          questionText: "Compare the triangles",
          navText: "",
          isMcq: true,
          mcqKey: "mcq2",
          nextEnabled: false
        },
        5: {
          questionText: "What type of triangles are these",
          navText: "",
          isMcq: true,
          mcqKey: "mcq3",
          nextEnabled: false
        },
        6: {
          questionText: "Find the side lengths using the ratio of sides",
          navText: "",
          isTable: true,
          tableKey: "tableStep",
          nextEnabled: false
        },
        7: {
          questionText: "What are the dimensions of the trapezium?",
          navText: "",
          isMcq: true,
          mcqKey: "mcq4",
          nextEnabled: false
        },
        8: {
          questionText: "What is the area of the trapezium?",
          navText: "",
          isMcq: true,
          mcqKey: "mcq5",
          nextEnabled: false
        },
        9: {
          questionText: "What is the area of the trapezium?",
          navText: "",
          isCompute: true,
          computeKey: "compute1Config",
          nextEnabled: false
        }
      },
      labels: {
        given: "Given",
        toFind: "To Find",
        findings: "Findings"
      },
    },
  },

};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
