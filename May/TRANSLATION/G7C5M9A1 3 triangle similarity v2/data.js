const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      steps: {
        1: {
          questionText: "Read the question and identify what to find.",
          navText: "Tap \u00BB to prove first two triangles similar.",
        },
        2: {
          questionText: "Prove: \u25B3ABC \u223C \u25B3ADB",
          navText: "Tap \u00BB to examine the angles of two triangles",
        },
        3: {
          questionText: "Prove: \u25B3ABC \u223C \u25B3ADB",
          navText: "Tap the highlighted angle.",
          navShowConclude: "Tap the conclude button.",
          navAfterConclude:
            "Tap \u00BB to prove third triangle also similar to these two triangles.",
        },
        4: {
          questionText: "Prove: \u25B3ABC \u223C \u25B3ADB",
          navText: "",
          navAfterAnim: "Tap \u00BB to examine the angles of two triangles.",
        },
        5: {
          questionText: "Prove: \u25B3ABC \u223C \u25B3BDC",
          navText: "",
          navAfterAnim: "Tap \u00BB to examine the angles of two triangles.",
        },
        6: {
          questionText: "Prove: \u25B3ABC \u223C \u25B3BDC",
          navText: "Tap the highlighted angle.",
          navShowConclude: "Tap the conclude button.",
          navAfterConclude: "Tap summary button.",
        },
        7: {
          questionText: "Prove: \u25B3ABC \u223C \u25B3ADB \u223C \u25B3BDC",
          navText: "",
          navAfterAnim: "Tap conclude button.",
          navAfterConclude: "Tap highlighted button to understand visually.",
        },
        8: {
          questionText:
            "Visualise: \u25B3ABC\u223C\u25B3ADB\u223C\u25B3BDC",
          navText: "",
          navComplete: "Activity completed!! Tap start over to restart",
        },
      },
      end: {
        restartLabel: "Start Over",
        completeLine1: "All three triangles fit into one another.",
        completeLine2: "All three are similar triangles.",
      },
      info: {
        proveTitle: "Prove that:",
        proveLine: "\u25B3ABC \u223C \u25B3ADB \u223C \u25B3BDC",
      },
      math: {
        commonAngle: "(Common Angle)",
        concludeText: "Conclude",
        conclusionLine1: "\u25B3ABC \u223C \u25B3ADB",
        conclusionLine1Bdc: "\u25B3ABC \u223C \u25B3BDC",
        conclusionLineAll: "\u25B3ADB \u223C \u25B3ABC \u223C \u25B3BDC",
        conclusionLine2: "(by AA similarity)",
        rulesUsedAmp: "&",
        summaryLabel: "Summary",
        visualiseLabel: "Visualise",
        con2Sim: "\u25B3ABC \u223C \u25B3BDC",
        con2Rule1: "\u2220BCA = \u2220BCD",
        con2Rule2: "\u2220ABC = \u2220BDC",
      },
    },
  },
  id: {
    app: {
      steps: {
        1: {
          questionText:
            "Baca pertanyaan dan tentukan apa yang harus dicari.",
          navText:
            "Ketuk \u00BB untuk membuktikan dua segitiga pertama sebangun.",
        },
        2: {
          questionText: "Buktikan: \u25B3ABC \u223C \u25B3ADB",
          navText: "Ketuk \u00BB untuk memeriksa sudut kedua segitiga",
        },
        3: {
          questionText: "Buktikan: \u25B3ABC \u223C \u25B3ADB",
          navText: "Ketuk sudut yang disorot.",
          navShowConclude: "Ketuk tombol simpulkan.",
          navAfterConclude:
            "Ketuk \u00BB untuk membuktikan segitiga ketiga juga sebangun dengan kedua segitiga ini.",
        },
        4: {
          questionText: "Buktikan: \u25B3ABC \u223C \u25B3ADB",
          navText: "",
          navAfterAnim: "Ketuk \u00BB untuk memeriksa sudut kedua segitiga.",
        },
        5: {
          questionText: "Buktikan: \u25B3ABC \u223C \u25B3BDC",
          navText: "",
          navAfterAnim: "Ketuk \u00BB untuk memeriksa sudut kedua segitiga.",
        },
        6: {
          questionText: "Buktikan: \u25B3ABC \u223C \u25B3BDC",
          navText: "Ketuk sudut yang disorot.",
          navShowConclude: "Ketuk tombol simpulkan.",
          navAfterConclude: "Ketuk tombol ringkasan.",
        },
        7: {
          questionText: "Buktikan: \u25B3ABC \u223C \u25B3ADB \u223C \u25B3BDC",
          navText: "",
          navAfterAnim: "Ketuk tombol simpulkan.",
          navAfterConclude:
            "Ketuk tombol yang disorot untuk memahami secara visual.",
        },
        8: {
          questionText:
            "Visualisasikan: \u25B3ABC\u223C\u25B3ADB\u223C\u25B3BDC",
          navText: "",
          navComplete:
            "Pembelajaran selesai! Ketuk ULANGI untuk memulai kembali",
        },
      },
      end: {
        restartLabel: "Ulangi",
        completeLine1:
          "Ketiga segitiga tersebut saling tepat berhimpit.",
        completeLine2: "Ketiga segitiga tersebut sebangun.",
      },
      info: {
        proveTitle: "Buktikan bahwa:",
        proveLine: "\u25B3ABC \u223C \u25B3ADB \u223C \u25B3BDC",
      },
      math: {
        commonAngle: "(Sudut Bersama)",
        concludeText: "Simpulkan",
        conclusionLine1: "\u25B3ABC \u223C \u25B3ADB",
        conclusionLine1Bdc: "\u25B3ABC \u223C \u25B3BDC",
        conclusionLineAll: "\u25B3ADB \u223C \u25B3ABC \u223C \u25B3BDC",
        conclusionLine2: "(dengan kesebangunan Sd.Sd.)",
        rulesUsedAmp: "&",
        summaryLabel: "Ringkasan",
        visualiseLabel: "Visualisasikan",
        con2Sim: "\u25B3ABC \u223C \u25B3BDC",
        con2Rule1: "\u2220BCA = \u2220BCD",
        con2Rule2: "\u2220ABC = \u2220BDC",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
