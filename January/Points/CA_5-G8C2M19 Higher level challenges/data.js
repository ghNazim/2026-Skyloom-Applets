// data.js
(() => {
  let CURRENT_LANGUAGE = "en";

  const appData = {
    en: {
      html_title: "Triangular Pyramid Net Problem",
      problem: {
        question:
          "Look at the net of the triangular pyramid below.<br>a) Find the length b.<br>b) What is the surface area of the triangular pyramid?",
      },
      flow: [
        // Step -1: Comprehend - Show labelled image
        {
          type: "comprehend",
          stage: {
            stageTitle: "Comprehend: Visualise the pyramid",
            instruction: "Tap » to continue.",
            type: "showLabelled",
            imageSrc: "assets/labelled1.png",
            highlights: [],
          },
        },
        // Step 0: Comprehend - Show Pyramid Video
        {
          type: "comprehend",
          stage: {
            stageTitle: "Comprehend: Visualise the pyramid",
            instruction:
              "Tap the button to see how the pyramid unfolds into the given flat shape.",
            type: "showPyramid",
            imageSrc: "assets/labelled1.png",
            videoSrc: "assets/pyramid.mp4",
            highlights: [],
          },
        },
        // Step 1: Comprehend - Find B
        {
          type: "comprehend",
          stage: {
            stageTitle: "Comprehend: Find the length b",
            instruction: "To find, \n Length b = ?",
            type: "findB",
            imageSrc: findB_svg,
            highlights: [{ text: "Find the length b", color: "yellow" }],
          },
        },
        // Step 2: Connect - findBConnect1
        {
          type: "connect",
          stage: {
            stageTitle: "What type of triangle is this?",
            instruction: "Tap the correct option",
            nextInstruction: "Tap » to continue",
            hint: "In this triangle, two equal sides with a 90° angle give two 45° angles.",
            options: [
              "A. A scalene triangle",
              "B. An equilateral triangle",
              "C. An isosceles right triangle (45° – 45° – 90°)",
              "D. A right triangle with all sides different",
            ],
            correctAnswer: 2,
            correctFeedback: "Awesome!",
            incorrectFeedback: "Try again!",
            imageSrc: findBConnect1_svg,
            correctImageSrc: "assets/findBConnect1Ans.png",
            highlight: {
              text: "Find the length b",
              color: "yellow",
            },
          },
        },
        // Step 3: Connect - findBConnect2
        {
          type: "connect",
          stage: {
            stageTitle: "What is the side ratio of this triangle?",
            instruction: "Tap the correct option",
            nextInstruction: "Tap » to calculate the value of 'b' now.",
            hint: "Lateral triangle is an isosceles right triangle. Think about the sides of a triangle having angles 45°–45°–90°.",
            options: [
              "a. 1 : 2 : 3",
              `b. 1 : 1 : ${sqrt("2")}`,
              `c. 1 : ${sqrt("3")} : 2`,
              `d. 1 : ${sqrt("2")}  : 2`,
            ],
            correctAnswer: 1,
            correctFeedback: "Awesome!",
            incorrectFeedback: "Try again!",
            imageSrc: "assets/findBConnect2.png",
            correctImageSrc: "assets/findBConnect2Ans.png",
            highlight: {
              text: "Find the length b",
              color: "yellow",
            },
          },
        },
        // Step 4: Compute - findBTable
        {
          type: "compute",
          stage: {
            type: "findBTable",
            instruction: "Fill the empty arrow label box",
            imageSrc: "assets/findBCompute1.png",
            finalImageSrc: "assets/findBCompute1Ans.png",
            questionText: `By what number should the ratio 1 : 1 : ${sqrt(
              "2"
            )} be scaled up to get the side length b.`,
            tableData: {
              headers: ["side", "side", "hypotenuse"],
              rows: [
                ["1", "1", sqrt("2")],
                ["6", "6", "?"],
              ],
              rowsComplete: [
                ["1", "1", sqrt("2")],
                ["6", "6", `6${sqrt("2")}`],
              ],
              arrowLabel: "",
              correctAnswer: "6",
            },
            highlight: {
              text: "Find the length b",
              color: "yellow",
            },
          },
        },
        // Step 5: Compute - findBResult
        {
          type: "compute",
          stage: {
            type: "findBResult",
            instruction: "Tap » to solve the second part of the question.",
            equation: `The length of b = 6 ${sqrt("2")} cm`,
            imageSrc: "assets/findBCompute1Final.png",
            highlight: {
              text: "Find the length b",
              color: "yellow",
            },
          },
        },
        // Step 6: Comprehend - Find Area
        {
          type: "comprehend",
          stage: {
            stageTitle: "Comprehend: Find Area",
            instruction: "To find, \n Surface Area of the triangular Pyramid",
            type: "findArea",
            imageSrc: "assets/findArea.png",
            highlights: [
              {
                text: "b) What is the surface area of the triangular pyramid?",
                color: "yellow",
              },
            ],
          },
        },
        // Step 7: Connect - findAreaConnect0
        {
          type: "connect",
          stage: {
            stageTitle:
              "Which of the following represents the total surface area of this triangular pyramid?",
            instruction: "Tap the correct option",
            nextInstruction: "Tap » to continue",
            hint: "One base triangle + three lateral triangles.",
            options: [
              "A. Sum of the three lateral areas",
              "B. 2 × (base area) + sum of the lateral areas",
              "C. Base area + sum of the areas of the three lateral triangular faces",
              "D. None of these",
            ],
            correctAnswer: 2,
            correctFeedback: "Awesome!",
            incorrectFeedback: "Try again!",
            imageSrc: "assets/findArea.png",
            correctImageSrc: "assets/findAreaConnect0Ans.png",
            highlight: {
              text: "b) What is the surface area of the triangular pyramid?",
              color: "yellow",
            },
          },
        },
        // Step 8: Connect - findAreaConnect1
        {
          type: "connect",
          stage: {
            stageTitle:
              "Which of the following is the correct formula for the area of an isosceles right triangle ?",
            instruction: "Tap the correct option",
            nextInstruction:
              "Tap » to calculate the area of one lateral triangle.",
            hint: `The area of a triangle is ${frac(
              "1",
              "2"
            )} × base × height. In a 45°–45°–90° triangle, the base and height are equal.`,
            options: [
              `a. ${frac("1", "2")} × (side)`,
              "b. (side)²",
              `c. ${frac("1", "2")} × (side)²`,
              `d. ${frac(sqrt("3"), "4")} ×(side)²`,
            ],
            correctAnswer: 2,
            correctFeedback: "Awesome",
            incorrectFeedback: "Try again!",
            imageSrc: "assets/findAreaConnect1.png",
            correctImageSrc: "assets/findAreaConnect1Ans.png",
            highlight: {
              text: "b) What is the surface area of the triangular pyramid?",
              color: "yellow",
            },
          },
        },
        // Step 9: Compute - findAreaCompute1
        {
          type: "compute",
          stage: {
            type: "findAreaCompute1",
            instruction: "Tap the highlighted box or select the correct option",
            imageSrc: "assets/findAreaCompute1.png",
            finalImageSrc: "assets/findAreaCompute1Final.png",
            steps: [
              {
                equation: `Area of one lateral triangle =  ${frac(
                  "1",
                  "2"
                )} × (side)²`,
                highlightText: "side",
                userInput: null,
              },
              {
                equation: `Area of one lateral triangle =  ${frac(
                  "1",
                  "2"
                )} × ({{empty}})²`,
                mcq: {
                  title: "What is the side length of the right triangle?",
                  options: ["6", `6${sqrt("2")}`, "12"],
                  correctAnswer: 0,
                },
                userInput: "side",
              },
              {
                equation: "Area of one lateral triangle = {{empty}}",
                mcq: {
                  title: "What is the area of the triangle?",
                  options: ["36 cm²", `36${sqrt("2")} cm²`, "18 cm²"],
                  correctAnswer: 2,
                },
                userInput: "area",
              },
            ],
            highlight: {
              text: "b) What is the surface area of the triangular pyramid?",
              color: "yellow",
            },
          },
        },
        // Step 10: Connect - findAreaConnect2
        {
          type: "connect",
          stage: {
            stageTitle:
              "What can we say about the three highlighted lateral triangles?",
            instruction: "Tap the correct option",
            nextInstruction: "Tap » to calculate the lateral surface area.",
            hint: `All three triangles share the same side lengths: 6${sqrt(
              "2"
            )} cm and two sides of 6 cm.`,
            options: [
              "a. All three triangles are different.",
              "b. Only two triangles are identical.",
              "c. All three triangles are identical",
            ],
            correctAnswer: 2,
            correctFeedback: "Awesome!",
            incorrectFeedback: "Try again!",
            imageSrc: "assets/findAreaConnect2.png",
            correctImageSrc: "assets/findAreaConnect2Ans.png",
            highlight: {
              text: "b) What is the surface area of the triangular pyramid?",
              color: "yellow",
            },
          },
        },
        // Step 11: Compute - findAreaCompute2
        {
          type: "compute",
          stage: {
            type: "findAreaCompute2",
            instruction: "Tap the correct option",
            imageSrc: "assets/findAreaCompute2.png",
            finalImageSrc: "assets/findAreaCompute2Final.png",
            steps: [
              {
                equation:
                  "Lateral surface area = 3 × Area of one lateral triangle",
                highlightText: "Area of one lateral triangle",
                userInput: null,
              },
              {
                equation: "Lateral surface area = 3 × {{empty}}",
                mcq: {
                  title: "What is the area of one lateral triangle?",
                  options: ["18 cm²", "36 cm²", "54 cm²"],
                  correctAnswer: 0,
                },
                userInput: "area",
              },
              {
                equation: "Lateral surface area = {{empty}}",
                mcq: {
                  title: "What is the lateral surface area?",
                  options: ["18 cm²", "36 cm²", "54 cm²"],
                  correctAnswer: 2,
                },
                userInput: "lateralArea",
              },
            ],
            highlight: {
              text: "b) What is the surface area of the triangular pyramid?",
              color: "yellow",
            },
          },
        },
        // Step 12: Connect - findAreaConnect3
        {
          type: "connect",
          stage: {
            stageTitle:
              "In the net of a triangular pyramid, what is the shape of the base triangle?",
            instruction: "Tap the correct option",
            nextInstruction: "Tap » to continue",
            hint: "The three lateral triangles are identical, so the three edges they meet on the base are equal in length.",
            options: [
              "A. Scalene triangle",
              "B. Isosceles triangle",
              "C. Right triangle",
              "D.  Equilateral triangle",
            ],
            correctAnswer: 3,
            correctFeedback: "Awesome!",
            incorrectFeedback: "Try again!",
            imageSrc: "assets/findAreaConnect3.png",
            correctImageSrc: "assets/findAreaConnect3Ans.png",
            highlight: {
              text: "b) What is the surface area of the triangular pyramid?",
              color: "yellow",
            },
          },
        },
        // Step 13: Connect - findAreaConnect4
        {
          type: "connect",
          stage: {
            stageTitle:
              "Which of the following is the correct formula for the area of an equilateral triangle?",
            instruction: "Tap the correct option",
            nextInstruction:
              "Tap » to calculate the area of the base equilateral triangle.",
            hint: `Use the special area formula for an equilateral triangle — it involves ${sqrt(
              "3"
            )} and the square of the side.`,
            options: [
              `a. ${frac("1", "2")} × (side + sidet)`,
              "b. (side)²",
              `c. ${frac("1", "2")} × ( side)²`,
              `d. ${frac(sqrt("3"), "4")} ×(side)²`,
            ],
            correctAnswer: 3,
            correctFeedback: "Awesome!",
            incorrectFeedback: "Try again!",
            imageSrc: "assets/findAreaConnect3Ans.png",
            correctImageSrc: "assets/findAreaConnect3Ans.png",
            highlight: {
              text: "b) What is the surface area of the triangular pyramid?",
              color: "yellow",
            },
          },
        },
        // Step 14: Compute - findAreaCompute3
        {
          type: "compute",
          stage: {
            type: "findAreaCompute3",
            instruction: "Tap the highlighted box or select the correct option",
            imageSrc: "assets/findAreaCompute3.png",
            finalImageSrc: "assets/findAreaCompute3Final.png",
            steps: [
              {
                equation: `Area of an equilateral triangle = ${frac(
                  sqrt("3"),
                  "4"
                )} ×(side)²`,
                equationX: `Area of an equilateral triangle \n= ${frac(
                  "√3",
                  "4"
                )} ×(side)²`,
                highlightText: "side",
                userInput: null,
              },
              {
                equation: `Area of an equilateral triangle = ${frac(
                  sqrt("3"),
                  "4"
                )} ×({{empty}})²`,
                mcq: {
                  title: "What is the side length of the equilateral triangle?",
                  options: ["6", `6${sqrt("2")}`, "12"],
                  correctAnswer: 1,
                },
                userInput: "side",
              },
              {
                equation: "Area of an equilateral triangle = {{empty}}",
                nextInstruction:
                  "Tap » to see the total surface area of the triangular pyramid.",
                mcq: {
                  title: "What is the area of the equilateral triangle?",
                  options: [
                    `18${sqrt("3")} cm²`,
                    `36${sqrt("3")} cm²`,
                    `9${sqrt("3")} cm²`,
                  ],
                  correctAnswer: 0,
                },
                userInput: "area",
              },
            ],
            highlight: {
              text: "b) What is the surface area of the triangular pyramid?",
              color: "yellow",
            },
          },
        },
        // Step 15: Compute - findAreaCompute4
        {
          type: "compute",
          stage: {
            type: "findAreaCompute4",
            instruction: "Tap » to continue",
            equation: `Total surface area = 54 + 18 ${sqrt("3")} cm²`,
            imageSrc: "assets/findAreaCompute4.png",
            finalImageSrc: "assets/findAreaCompute4Final.png",
            highlight: {
              text: "b) What is the surface area of the triangular pyramid?",
              color: "yellow",
            },
          },
        },
        // Step 16: Summary
        {
          type: "summary",
          stage: {
            title: "Summary",
            instruction: "Activity Complete",
            imageSrc: "assets/final.png",
            answers: [
              `The length b is 6 ${sqrt("2")} cm .`,
              `The surface area of the triangular pyramid is 54 + 18 ${sqrt(
                "3"
              )} cm²`,
            ],
          },
        },
      ],
      ui: {
        tabs: ["Comprehend", "Connect", "Compute"],
        navigation: {
          next: "»",
          restart: "Restart",
          tapToContinue: "Tap » to continue",
        },
        instructions: {
          tapToContinue: "Tap » to continue",
          tapCorrectOption: "Tap the correct option",
          useNumpad: "Use numpad to enter the number in the highlighted box.",
          tapHighlightedBox: "Tap the highlighted box to substitute the value.",
          activityComplete: "Activity Complete",
        },
        summary: {
          answer: "Answer:",
          steps: "Steps:",
        },
        showPyramidButton: "Show pyramid",
        hintButton: "HINT",
        showHint: "Show Hint",
        hint: "Hint",
        visualization: "Visualization",
      },
    },
    id: {
      html_title: "Masalah Jaring Piramida Segitiga",
      problem: {
        question:
          "Lihat jaring piramida segitiga di bawah ini.<br>a) Carilah panjang b.<br>b) Berapakah luas permukaan piramida segitiga?",
      },
      flow: [
        // Step -1: Comprehend - Show labelled image
        {
          type: "comprehend",
          stage: {
            stageTitle: "Pahami: Visualisasikan piramida",
            instruction: "Ketuk » untuk melanjutkan.",
            type: "showLabelled",
            imageSrc: "assets/labelled1.png",
            highlights: [],
          },
        },
        // Step 0: Comprehend - Show Pyramid Video
        {
          type: "comprehend",
          stage: {
            stageTitle: "Pahami: Visualisasikan piramida",
            instruction:
              "Ketuk tombol untuk melihat bagaimana piramida membuka menjadi bentuk datar yang diberikan.",
            type: "showPyramid",
            imageSrc: "assets/labelled1.png",
            videoSrc: "assets/pyramid.mp4",
            highlights: [],
          },
        },
        // Step 1: Comprehend - Find B
        {
          type: "comprehend",
          stage: {
            stageTitle: "Pahami: Carilah panjang b",
            instruction: "Untuk mencari, \n Panjang b = ?",
            type: "findB",
            imageSrc: findB_svg,
            highlights: [{ text: "Carilah panjang b", color: "yellow" }],
          },
        },
        // Step 2: Connect - findBConnect1
        {
          type: "connect",
          stage: {
            stageTitle: "Jenis segitiga apakah ini?",
            instruction: "Ketuk opsi yang benar",
            nextInstruction: "Ketuk » untuk melanjutkan",
            hint: "Pada segitiga ini, dua sisi yang sama dengan sudut 90° memberikan dua sudut 45°.",
            options: [
              "A. Segitiga sembarang",
              "B. Segitiga sama sisi",
              "C. Segitiga siku-siku sama kaki (45° – 45° – 90°)",
              "D. Segitiga siku-siku dengan semua sisi berbeda",
            ],
            correctAnswer: 2,
            correctFeedback: "Luar biasa!",
            incorrectFeedback: "Coba lagi!",
            imageSrc: findBConnect1_svg,
            correctImageSrc: "assets/findBConnect1Ans.png",
            highlight: {
              text: "Carilah panjang b",
              color: "yellow",
            },
          },
        },
        // Step 3: Connect - findBConnect2
        {
          type: "connect",
          stage: {
            stageTitle: "Berapakah perbandingan sisi segitiga ini?",
            instruction: "Ketuk opsi yang benar",
            nextInstruction: "Ketuk » untuk menghitung nilai 'b' sekarang.",
            hint: "Segitiga lateral adalah segitiga siku-siku sama kaki. Pikirkan tentang sisi-sisi segitiga yang memiliki sudut 45°–45°–90°.",
            options: [
              "a. 1 : 2 : 3",
              `b. 1 : 1 : ${sqrt("2")}`,
              `c. 1 : ${sqrt("3")} : 2`,
              `d. 1 : ${sqrt("2")}  : 2`,
            ],
            correctAnswer: 1,
            correctFeedback: "Luar biasa!",
            incorrectFeedback: "Coba lagi!",
            imageSrc: "assets/findBConnect2.png",
            correctImageSrc: "assets/findBConnect2Ans.png",
            highlight: {
              text: "Carilah panjang b",
              color: "yellow",
            },
          },
        },
        // Step 4: Compute - findBTable
        {
          type: "compute",
          stage: {
            type: "findBTable",
            instruction: "Isi kotak label panah yang kosong",
            imageSrc: "assets/findBCompute1.png",
            finalImageSrc: "assets/findBCompute1Ans.png",
            questionText: `Dengan angka berapa perbandingan 1 : 1 : ${sqrt(
              "2"
            )} harus diperbesar untuk mendapatkan panjang sisi b.`,
            tableData: {
              headers: ["sisi", "sisi", "hipotenusa"],
              rows: [
                ["1", "1", sqrt("2")],
                ["6", "6", "?"],
              ],
              rowsComplete: [
                ["1", "1", sqrt("2")],
                ["6", "6", `6${sqrt("2")}`],
              ],
              arrowLabel: "",
              correctAnswer: "6",
            },
            highlight: {
              text: "Carilah panjang b",
              color: "yellow",
            },
          },
        },
        // Step 5: Compute - findBResult
        {
          type: "compute",
          stage: {
            type: "findBResult",
            instruction:
              "Ketuk » untuk menyelesaikan bagian kedua dari pertanyaan.",
            equation: `Panjang b = 6 ${sqrt("2")} cm`,
            imageSrc: "assets/findBCompute1Final.png",
            highlight: {
              text: "Carilah panjang b",
              color: "yellow",
            },
          },
        },
        // Step 6: Comprehend - Find Area
        {
          type: "comprehend",
          stage: {
            stageTitle: "Pahami: Carilah Luas",
            instruction: "Untuk mencari, \n Luas Permukaan Piramida Segitiga",
            type: "findArea",
            imageSrc: "assets/findArea.png",
            highlights: [
              {
                text: "b) Berapakah luas permukaan piramida segitiga?",
                color: "yellow",
              },
            ],
          },
        },
        // Step 7: Connect - findAreaConnect0
        {
          type: "connect",
          stage: {
            stageTitle:
              "Manakah dari berikut ini yang mewakili luas permukaan total piramida segitiga ini?",
            instruction: "Ketuk opsi yang benar",
            nextInstruction: "Ketuk » untuk melanjutkan",
            hint: "Satu segitiga alas + tiga segitiga lateral.",
            options: [
              "A. Jumlah dari tiga luas lateral",
              "B. 2 × (luas alas) + jumlah luas lateral",
              "C. Luas alas + jumlah luas dari tiga sisi segitiga lateral",
              "D. Tidak ada yang benar",
            ],
            correctAnswer: 2,
            correctFeedback: "Luar biasa!",
            incorrectFeedback: "Coba lagi!",
            imageSrc: "assets/findArea.png",
            correctImageSrc: "assets/findAreaConnect0Ans.png",
            highlight: {
              text: "b) Berapakah luas permukaan piramida segitiga?",
              color: "yellow",
            },
          },
        },
        // Step 8: Connect - findAreaConnect1
        {
          type: "connect",
          stage: {
            stageTitle:
              "Manakah dari berikut ini yang merupakan rumus yang benar untuk luas segitiga siku-siku sama kaki?",
            instruction: "Ketuk opsi yang benar",
            nextInstruction:
              "Ketuk » untuk menghitung luas satu segitiga lateral.",
            hint: `Luas segitiga adalah ${frac(
              "1",
              "2"
            )} × alas × tinggi. Pada segitiga 45°–45°–90°, alas dan tinggi sama.`,
            options: [
              `a. ${frac("1", "2")} × (sisi)`,
              "b. (sisi)²",
              `c. ${frac("1", "2")} × (sisi)²`,
              `d. ${frac(sqrt("3"), "4")} ×(sisi)²`,
            ],
            correctAnswer: 2,
            correctFeedback: "Luar biasa",
            incorrectFeedback: "Coba lagi!",
            imageSrc: "assets/findAreaConnect1.png",
            correctImageSrc: "assets/findAreaConnect1Ans.png",
            highlight: {
              text: "b) Berapakah luas permukaan piramida segitiga?",
              color: "yellow",
            },
          },
        },
        // Step 9: Compute - findAreaCompute1
        {
          type: "compute",
          stage: {
            type: "findAreaCompute1",
            instruction: "Ketuk kotak yang disorot atau pilih opsi yang benar",
            imageSrc: "assets/findAreaCompute1.png",
            finalImageSrc: "assets/findAreaCompute1Final.png",
            steps: [
              {
                equation: `Luas satu segitiga lateral =  ${frac(
                  "1",
                  "2"
                )} × (sisi)²`,
                highlightText: "sisi",
                userInput: null,
              },
              {
                equation: `Luas satu segitiga lateral =  ${frac(
                  "1",
                  "2"
                )} × ({{empty}})²`,
                mcq: {
                  title: "Berapakah panjang sisi segitiga siku-siku?",
                  options: ["6", `6${sqrt("2")}`, "12"],
                  correctAnswer: 0,
                },
                userInput: "side",
              },
              {
                equation: "Luas satu segitiga lateral = {{empty}}",
                mcq: {
                  title: "Berapakah luas segitiga?",
                  options: ["36 cm²", `36${sqrt("2")} cm²`, "18 cm²"],
                  correctAnswer: 2,
                },
                userInput: "area",
              },
            ],
            highlight: {
              text: "b) Berapakah luas permukaan piramida segitiga?",
              color: "yellow",
            },
          },
        },
        // Step 10: Connect - findAreaConnect2
        {
          type: "connect",
          stage: {
            stageTitle:
              "Apa yang dapat kita katakan tentang tiga segitiga lateral yang disorot?",
            instruction: "Ketuk opsi yang benar",
            nextInstruction: "Ketuk » untuk menghitung luas permukaan lateral.",
            hint: `Ketiga segitiga memiliki panjang sisi yang sama: 6${sqrt(
              "2"
            )} cm dan dua sisi 6 cm.`,
            options: [
              "a. Ketiga segitiga berbeda.",
              "b. Hanya dua segitiga yang identik.",
              "c. Ketiga segitiga identik",
            ],
            correctAnswer: 2,
            correctFeedback: "Luar biasa!",
            incorrectFeedback: "Coba lagi!",
            imageSrc: "assets/findAreaConnect2.png",
            correctImageSrc: "assets/findAreaConnect2Ans.png",
            highlight: {
              text: "b) Berapakah luas permukaan piramida segitiga?",
              color: "yellow",
            },
          },
        },
        // Step 11: Compute - findAreaCompute2
        {
          type: "compute",
          stage: {
            type: "findAreaCompute2",
            instruction: "Ketuk opsi yang benar",
            imageSrc: "assets/findAreaCompute2.png",
            finalImageSrc: "assets/findAreaCompute2Final.png",
            steps: [
              {
                equation:
                  "Luas permukaan lateral = 3 × Luas satu segitiga lateral",
                highlightText: "Luas satu segitiga lateral",
                userInput: null,
              },
              {
                equation: "Luas permukaan lateral = 3 × {{empty}}",
                mcq: {
                  title: "Berapakah luas satu segitiga lateral?",
                  options: ["18 cm²", "36 cm²", "54 cm²"],
                  correctAnswer: 0,
                },
                userInput: "area",
              },
              {
                equation: "Luas permukaan lateral = {{empty}}",
                mcq: {
                  title: "Berapakah luas permukaan lateral?",
                  options: ["18 cm²", "36 cm²", "54 cm²"],
                  correctAnswer: 2,
                },
                userInput: "lateralArea",
              },
            ],
            highlight: {
              text: "b) Berapakah luas permukaan piramida segitiga?",
              color: "yellow",
            },
          },
        },
        // Step 12: Connect - findAreaConnect3
        {
          type: "connect",
          stage: {
            stageTitle:
              "Pada jaring piramida segitiga, apakah bentuk segitiga alas?",
            instruction: "Ketuk opsi yang benar",
            nextInstruction: "Ketuk » untuk melanjutkan",
            hint: "Ketiga segitiga lateral identik, jadi ketiga sisi yang mereka temui pada alas sama panjangnya.",
            options: [
              "A. Segitiga sembarang",
              "B. Segitiga sama kaki",
              "C. Segitiga siku-siku",
              "D. Segitiga sama sisi",
            ],
            correctAnswer: 3,
            correctFeedback: "Luar biasa!",
            incorrectFeedback: "Coba lagi!",
            imageSrc: "assets/findAreaConnect3.png",
            correctImageSrc: "assets/findAreaConnect3Ans.png",
            highlight: {
              text: "b) Berapakah luas permukaan piramida segitiga?",
              color: "yellow",
            },
          },
        },
        // Step 13: Connect - findAreaConnect4
        {
          type: "connect",
          stage: {
            stageTitle:
              "Manakah dari berikut ini yang merupakan rumus yang benar untuk luas segitiga sama sisi?",
            instruction: "Ketuk opsi yang benar",
            nextInstruction:
              "Ketuk » untuk menghitung luas segitiga alas sama sisi.",
            hint: `Gunakan rumus luas khusus untuk segitiga sama sisi — melibatkan ${sqrt(
              "3"
            )} dan kuadrat sisi.`,
            options: [
              `a. ${frac("1", "2")} × (sisi + sisi)`,
              "b. (sisi)²",
              `c. ${frac("1", "2")} × ( sisi)²`,
              `d. ${frac(sqrt("3"), "4")} ×(sisi)²`,
            ],
            correctAnswer: 3,
            correctFeedback: "Luar biasa!",
            incorrectFeedback: "Coba lagi!",
            imageSrc: "assets/findAreaConnect3Ans.png",
            correctImageSrc: "assets/findAreaConnect3Ans.png",
            highlight: {
              text: "b) Berapakah luas permukaan piramida segitiga?",
              color: "yellow",
            },
          },
        },
        // Step 14: Compute - findAreaCompute3
        {
          type: "compute",
          stage: {
            type: "findAreaCompute3",
            instruction: "Ketuk kotak yang disorot atau pilih opsi yang benar",
            imageSrc: "assets/findAreaCompute3.png",
            finalImageSrc: "assets/findAreaCompute3Final.png",
            steps: [
              {
                equation: `Luas segitiga sama sisi = ${frac(
                  sqrt("3"),
                  "4"
                )} ×(sisi)²`,
                equationX: `Luas segitiga sama sisi \n= ${frac(
                  "√3",
                  "4"
                )} ×(sisi)²`,
                highlightText: "sisi",
                userInput: null,
              },
              {
                equation: `Luas segitiga sama sisi = ${frac(
                  sqrt("3"),
                  "4"
                )} ×({{empty}})²`,
                mcq: {
                  title: "Berapakah panjang sisi segitiga sama sisi?",
                  options: ["6", `6${sqrt("2")}`, "12"],
                  correctAnswer: 1,
                },
                userInput: "side",
              },
              {
                equation: "Luas segitiga sama sisi = {{empty}}",
                nextInstruction:
                  "Ketuk » untuk melihat luas permukaan total piramida segitiga.",
                mcq: {
                  title: "Berapakah luas segitiga sama sisi?",
                  options: [
                    `18${sqrt("3")} cm²`,
                    `36${sqrt("3")} cm²`,
                    `9${sqrt("3")} cm²`,
                  ],
                  correctAnswer: 0,
                },
                userInput: "area",
              },
            ],
            highlight: {
              text: "b) Berapakah luas permukaan piramida segitiga?",
              color: "yellow",
            },
          },
        },
        // Step 15: Compute - findAreaCompute4
        {
          type: "compute",
          stage: {
            type: "findAreaCompute4",
            instruction: "Ketuk » untuk melanjutkan",
            equation: `Luas permukaan total = 54 + 18 ${sqrt("3")} cm²`,
            imageSrc: "assets/findAreaCompute4.png",
            finalImageSrc: "assets/findAreaCompute4Final.png",
            highlight: {
              text: "b) Berapakah luas permukaan piramida segitiga?",
              color: "yellow",
            },
          },
        },
        // Step 16: Summary
        {
          type: "summary",
          stage: {
            title: "Ringkasan",
            instruction: "Aktivitas Selesai",
            imageSrc: "assets/final.png",
            answers: [
              `Panjang b adalah 6 ${sqrt("2")} cm .`,
              `Luas permukaan piramida segitiga adalah 54 + 18 ${sqrt(
                "3"
              )} cm²`,
            ],
          },
        },
      ],
      ui: {
        tabs: ["Pahami", "Hubungkan", "Hitung"],
        navigation: {
          next: "»",
          restart: "Mulai Ulang",
          tapToContinue: "Ketuk » untuk melanjutkan",
        },
        instructions: {
          tapToContinue: "Ketuk » untuk melanjutkan",
          tapCorrectOption: "Ketuk opsi yang benar",
          useNumpad:
            "Gunakan numpad untuk memasukkan angka di kotak yang disorot.",
          tapHighlightedBox:
            "Ketuk kotak yang disorot untuk mengganti nilainya.",
          activityComplete: "Aktivitas Selesai",
        },
        summary: {
          answer: "Jawaban:",
          steps: "Langkah-langkah:",
        },
        showPyramidButton: "Tampilkan piramida",
        hintButton: "PETUNJUK",
        showHint: "Tampilkan Petunjuk",
        hint: "Petunjuk",
        visualization: "Visualisasi",
      },
    },
  };

  window.T = appData[CURRENT_LANGUAGE];
  window.setLanguage = (lang) => {
    if (appData[lang]) {
      CURRENT_LANGUAGE = lang;
      window.T = appData[lang];
    }
  };
})();
