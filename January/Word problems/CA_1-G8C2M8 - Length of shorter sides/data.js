const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

// Master data structure for Right Triangle Challenge
const DATA = {
  en: {
    app: {
      label:"Area = 338 cm²",
      start_over: "Start Over",
      // Comprehend step data (Step 1)
      comprehend: {
        sectionTitle: "INFORMATION ANALYSIS",
        given: {
          title: "Given,",
          data: [
            "∆ABC is a right triangle",
            "Area of red square = 338 cm²",
            "Side of yellow square = 7 cm"
          ]
        },
        toFind: {
          title: "To Find",
          data: [
            "Side length AB = a cm = ?"
          ]
        },
        // Image sources for each substep
        images: [
          compre1_svg,
          compre2_svg,
          compre3_svg,
          compre4_svg
        ]
      },
      // Splash screens data
      splash: {
        step2: {
          image: "assets/compre0.svg",
          text: "<blue>✓ Information gathered from the figure.</blue><br><yellow>Next - Identify the relationships</yellow>"
        },
        step5: {
          image: "assets/connect2correct.svg",
          text: "<blue>✓ Information gathered from the figure.<br>✓ Calculated the one side length BC and the side length of the square.</blue><br><yellow>Next – Calculate the side length AB.</yellow>"
        }
      },
      // Compute step data (Step 7)
      compute: {
        initialImage: "assets/compute.svg",
        finalImage: "assets/computeFinal.svg",
        rows: {
          initial: {
            left: { text: "AB²", color: "blue" },
            middle: { text: "AC²", color: "red" },
            right: { text: "BC²", color: "yellow" }
          },
          substituted: {
            left: { original: "AB²", replaced: "a²" },
            middle: { original: "AC²", replaced: "338" },
            right: { original: "BC²", replaced: "7²" }
          },
          calculated: {
            left: { text: "a²" },
            middle: { text: "338" },
            right: { text: "49" }
          },
          sqrt: {
            left: { text: "a" },
            middle: { text: sqrt("289") }
          },
          final: {
            left: { text: "a" },
            middle: { text: sqrt("289") },
            result: "17 cm"
          }
        },
        buttons: {
          substitute: "Substitute the side lengths",
          calculate: "Calculate the square",
          sqrt: "Calculate the value of 'a'",
          final: `Calculate ${sqrt("289")}`
        }
      },
      steps: {
        // Step 0: Initial comprehend - question display
        0: {
          questionText: "Challenge on Side of a Right Triangle",
          navText: "Tap » to identify 'given' information.",
          image: "assets/compre0.svg",
          comprehendText: "Squares are drawn on 2 sides of a triangle as shown.\nWhat is the length of the shorter side labeled 'a'?",
          isComprehend: true,
          nextEnabled: true
        },
        // Step 1: Comprehend with substeps (Given/To Find)
        1: {
          questionText: "Observe the figure and identify 'given' and 'to find'",
          navText: "Tap » to identify 'given' information.",
          navTextCorrect: " Tap » to calculate the side lengths of the triangle",
          image: compre1_svg,
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false
        },
        // Step 2: Splash screen 1
        2: {
          questionText: "",
          navText: "Tap » to calculate.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true
        },
        // Step 3: MCQ - What is BC?
        3: {
          questionText: "What is the side length of BC?",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to find next side length of the triangle.",
          image: connect1_svg,
          imageCorrect: connect1correct_svg,
          imageHint: connect1hint_svg,
          isMcq: true,
          mcq: {
            options: ["7 cm", "4 cm", `${sqrt("7")} cm`],
            answer: "7 cm",
            feedbacks: {
              correct: "Awesome! The side of the  triangle has the  same length as the  side of the square  drawn on it.",
              wrong: "Not quite! The side of the  triangle has the  same length as the  side of the square  drawn on it."
            }
          }
        },
        // Step 4: MCQ - What is AC²? (NEW STEP)
        4: {
          questionText: "Which of the given options represents 338 cm²?",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to continue.",
          image: connect2_svg,
          imageCorrect: connect2correct_svg,
          // No hint needed, show default image when no hint image is provided
          imageHint: null, 
          isMcq: true,
          mcq: {
            options: ["AC", "AC²", sqrt('AC')],
            answer: "AC²",
            feedbacks: {
              correct: "Awesome!  338 cm² is the area  of the square on  AC, so it is AC².",
              wrong: "Not quite! 338 cm² is the area of  the square drawn on  side AC. For a square,\n  area = AC × AC = AC²."
            }
          }
        },
        // Step 5: Splash screen 2 (was 4)
        5: {
          questionText: "",
          navText: "Tap » to identify the required relationship.",
          isSplash: true,
          splashKey: "step5",
          nextEnabled: true
        },
        // Step 6: MCQ - Pythagoras relation (was 5)
        6: {
          questionText: "Which relation helps us find the length of AB?",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to apply Pythagoras' Theorem",
          image: connect3_svg,
          imageCorrect: connect3correct_svg,
          imageHint: null,
          isMcq: true,
          mcq: {
            options: [
              "AB² = BC² + AC²",
              "AB² = AC² - BC²",
              "AB² = BC² - AC²",
              "BC² = AB² + AC²"
            ],
            answer: "AB² = AC² - BC²",
            feedbacks: {
              correct: "Awesome! We use  Pythagoras' relation: The  square on the hypotenuse  equals the sum of the  squares on the other sides",
              wrong: "Not quite. Use the  Pythagoras' relation.  Try again."
            }
          }
        },
        // Step 7: Compute step (was 6)
        7: {
          questionText: "Calculate the side length AB = a cm.",
          navText: "Tap the highlighted button.",
          navTextComplete: "Tap » to summarize.",
          image: "assets/compute.svg",
          imageFinal: "assets/computeFinal.svg",
          isCompute: true,
          nextEnabled: false
        },
        // Step 8: Final step (was 7)
        8: {
          questionText: "Challenge completed",
          navText: "",
          image: "assets/computeFinal.svg",
          isFinalStep: true,
          finalText: "The length of the shorter side labeled a, is 17 cm."
        }
      },
      labels: {
        given: "Given",
        toFind: "To Find",
      },
    },
    
  },
  id: {
      app: {
        label: "Luas = 338 cm²",
        start_over: "Mulai Ulang",
        // Comprehend step data (Step 1)
        comprehend: {
          sectionTitle: "ANALISIS INFORMASI",
          given: {
            title: "Diketahui,",
            data: [
              "∆ABC adalah segitiga siku-siku",
              "Luas persegi merah = 338 cm²",
              "Sisi persegi kuning = 7 cm"
            ]
          },
          toFind: {
            title: "Ditanyakan",
            data: [
              "Panjang sisi AB = a cm = ?"
            ]
          },
          // Image sources for each substep
          images: [
            compre1_svg,
            compre2_svg,
            compre3_svg,
            compre4_svg
          ]
        },
        // Splash screens data
        splash: {
          step2: {
            image: "assets/compre0.svg",
            text: "<blue>✓ Informasi dikumpulkan dari gambar.</blue><br><yellow>Selanjutnya - Identifikasi hubungannya</yellow>"
          },
          step5: {
            image: "assets/connect2correct.svg",
            text: "<blue>✓ Informasi dikumpulkan dari gambar.<br>✓ Menghitung panjang sisi BC dan panjang sisi persegi.</blue><br><yellow>Selanjutnya – Hitung panjang sisi AB.</yellow>"
          }
        },
        // Compute step data (Step 7)
        compute: {
          initialImage: "assets/compute.svg",
          finalImage: "assets/computeFinal.svg",
          rows: {
            initial: {
              left: { text: "AB²", color: "blue" },
              middle: { text: "AC²", color: "red" },
              right: { text: "BC²", color: "yellow" }
            },
            substituted: {
              left: { original: "AB²", replaced: "a²" },
              middle: { original: "AC²", replaced: "338" },
              right: { original: "BC²", replaced: "7²" }
            },
            calculated: {
              left: { text: "a²" },
              middle: { text: "338" },
              right: { text: "49" }
            },
            sqrt: {
              left: { text: "a" },
              middle: { text: sqrt("289") }
            },
            final: {
              left: { text: "a" },
              middle: { text: sqrt("289") },
              result: "17 cm"
            }
          },
          buttons: {
            substitute: "Substitusikan panjang sisi",
            calculate: "Hitung kuadratnya",
            sqrt: "Hitung nilai 'a'",
            final: `Hitung ${sqrt("289")}`
          }
        },
        steps: {
          // Step 0: Initial comprehend - question display
          0: {
            questionText: "Tantangan pada Sisi Segitiga Siku-siku",
            navText: "Ketuk » untuk mengidentifikasi informasi 'diketahui'.",
            image: "assets/compre0.svg",
            comprehendText: "Persegi digambar pada 2 sisi segitiga seperti yang ditunjukkan.\nBerapa panjang sisi yang lebih pendek yang diberi label 'a'?",
            isComprehend: true,
            nextEnabled: true
          },
          // Step 1: Comprehend with substeps (Given/To Find)
          1: {
            questionText: "Amati gambar dan identifikasi 'diketahui' dan 'ditanyakan'",
            navText: "Ketuk » untuk mengidentifikasi informasi 'diketahui'.",
            navTextCorrect: " Ketuk » untuk menghitung panjang sisi segitiga",
            image: compre1_svg,
            isComprehend: true,
            isSubstepComprehend: true,
            nextEnabled: false
          },
          // Step 2: Splash screen 1
          2: {
            questionText: "",
            navText: "Ketuk » untuk menghitung.",
            isSplash: true,
            splashKey: "step2",
            nextEnabled: true
          },
          // Step 3: MCQ - What is BC?
          3: {
            questionText: "Berapa panjang sisi BC?",
            navText: "Ketuk jawaban yang benar.",
            navTextCorrect: "Ketuk » untuk mencari panjang sisi segitiga berikutnya.",
            image: connect1_svg,
            imageCorrect: connect1correct_svg,
            imageHint: connect1hint_svg,
            isMcq: true,
            mcq: {
              options: ["7 cm", "4 cm", `${sqrt("7")} cm`],
              answer: "7 cm",
              feedbacks: {
                correct: "Luar biasa! Sisi segitiga memiliki panjang yang sama dengan sisi persegi yang digambar di atasnya.",
                wrong: "Belum tepat! Sisi segitiga memiliki panjang yang sama dengan sisi persegi yang digambar di atasnya."
              }
            }
          },
          // Step 4: MCQ - What is AC²? (NEW STEP)
          4: {
            questionText: "Manakah dari opsi yang diberikan yang mewakili 338 cm²?",
            navText: "Ketuk jawaban yang benar.",
            navTextCorrect: "Ketuk » untuk melanjutkan.",
            image: connect2_svg,
            imageCorrect: connect2correct_svg,
            // No hint needed, show default image when no hint image is provided
            imageHint: null, 
            isMcq: true,
            mcq: {
              options: ["AC", "AC²", sqrt('AC')],
              answer: "AC²",
              feedbacks: {
                correct: "Luar biasa! 338 cm² adalah luas persegi pada AC, jadi itu adalah AC².",
                wrong: "Belum tepat! 338 cm² adalah luas persegi yang digambar pada sisi AC. Untuk persegi,\n  luas = AC × AC = AC²."
              }
            }
          },
          // Step 5: Splash screen 2 (was 4)
          5: {
            questionText: "",
            navText: "Ketuk » untuk mengidentifikasi hubungan yang diperlukan.",
            isSplash: true,
            splashKey: "step5",
            nextEnabled: true
          },
          // Step 6: MCQ - Pythagoras relation (was 5)
          6: {
            questionText: "Hubungan mana yang membantu kita menemukan panjang AB?",
            navText: "Ketuk jawaban yang benar.",
            navTextCorrect: "Ketuk » untuk menerapkan Teorema Pythagoras",
            image: connect3_svg,
            imageCorrect: connect3correct_svg,
            imageHint: null,
            isMcq: true,
            mcq: {
              options: [
                "AB² = BC² + AC²",
                "AB² = AC² - BC²",
                "AB² = BC² - AC²",
                "BC² = AB² + AC²"
              ],
              answer: "AB² = AC² - BC²",
              feedbacks: {
                correct: "Luar biasa! Kita menggunakan hubungan Pythagoras: Kuadrat pada sisi miring sama dengan jumlah kuadrat pada sisi-sisi lainnya",
                wrong: "Belum tepat. Gunakan hubungan Pythagoras. Coba lagi."
              }
            }
          },
          // Step 7: Compute step (was 6)
          7: {
            questionText: "Hitung panjang sisi AB = a cm.",
            navText: "Ketuk tombol yang disorot.",
            navTextComplete: "Ketuk » untuk merangkum.",
            image: "assets/compute.svg",
            imageFinal: "assets/computeFinal.svg",
            isCompute: true,
            nextEnabled: false
          },
          // Step 8: Final step (was 7)
          8: {
            questionText: "Tantangan selesai",
            navText: "",
            image: "assets/computeFinal.svg",
            isFinalStep: true,
            finalText: "Panjang sisi yang lebih pendek yang diberi label a, adalah 17 cm."
          }
        },
        labels: {
          given: "Diketahui",
          toFind: "Ditanyakan",
        },
      },
    },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
