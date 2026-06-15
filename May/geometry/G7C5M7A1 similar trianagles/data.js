const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Sides and Angles in similar triangles",
        text:
          "We say ∆ABC and ∆DEF are similar to each other<br>" +
          "when their shapes are the same<br>" +
          "and they can fit into one another.<br><br>" +
          "What does this mean mathematically?<br>" +
          "Let's explore their angles and side measures<br>" +
          "to understand what same shape means.",
        buttonText: "Start",
      },
      steps: {
        1: {
          questionText:
            "<span class='tri-abc'>∆ABC</span> ~ <span class='tri-def'>∆DEF</span>",
          navText: "Tap 'recap' to overlap the triangles",
          navExplore:
            "Tap 'Explore' to see the relationship between their angles",
          actionRecap: "Recap Visually",
          actionExplore: "Explore Angles",
          recapText:
            "They have the same<br>shape and they fit<br>into one another.",
        },
        2: {
          questionText: "Angles in <span class='tri-abc'>∆ABC</span> ~ <span class='tri-def'>∆DEF</span>",
          navText: "Tap any point to see the angle there…",
          navSummarize:
            "Tap 'Summarize' for the relationship between angles of similar triangles",
          actionSummarize: "Summarize",
          angleEqual: {
            1: "<span class='ang-abc'>∠A</span> = <span class='ang-def'>∠D</span>",
            2: "<span class='ang-abc'>∠B</span> = <span class='ang-def'>∠E</span>",
            3: "<span class='ang-abc'>∠C</span> = <span class='ang-def'>∠F</span>",
          },
        },
        3: {
          questionText:
            "<span class='tri-abc'>∆ABC</span> ~ <span class='tri-def'>∆DEF</span>",
          navText:
            "Tap 'Explore' to see the relationship between sides",
          actionSummary:
            "Corresponding angles of similar triangles are equal in measure!",
          nextText: "Explore",
        },
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Sisi dan Sudut pada segitiga sebangun",
        text:
          "Kita mengatakan ∆ABC dan ∆DEF sebangun<br>" +
          "ketika bentuknya sama<br>" +
          "dan keduanya dapat saling muat.<br><br>" +
          "Apa artinya ini secara matematis?<br>" +
          "Mari kita jelajahi sudut dan panjang sisinya<br>" +
          "untuk memahami arti bentuk yang sama.",
        buttonText: "Mulai",
      },
      steps: {
        1: {
          questionText:
            "<span class='tri-abc'>∆ABC</span> ~ <span class='tri-def'>∆DEF</span>",
          navText: "Ketuk 'recap' untuk menumpuk segitiga",
          navExplore:
            "Ketuk 'Explore' untuk melihat hubungan sudut-sudutnya",
          actionRecap: "Recap Secara Visual",
          actionExplore: "Jelajahi Sudut",
          recapText:
            "Keduanya memiliki bentuk<br>yang sama dan saling<br>muat.",
        },
        2: {
          questionText:
            "Sudut pada <span class='tri-abc'>∆ABC</span> ~ <span class='tri-def'>∆DEF</span>",
          navText: "Ketuk titik mana saja untuk melihat sudut di sana…",
          navSummarize:
            "Ketuk 'Ringkas' untuk hubungan sudut segitiga sebangun",
          actionSummarize: "Ringkas",
          angleEqual: {
            1: "<span class='ang-abc'>∠A</span> = <span class='ang-def'>∠D</span>",
            2: "<span class='ang-abc'>∠B</span> = <span class='ang-def'>∠E</span>",
            3: "<span class='ang-abc'>∠C</span> = <span class='ang-def'>∠F</span>",
          },
        },
        3: {
          questionText:
            "<span class='tri-abc'>∆ABC</span> ~ <span class='tri-def'>∆DEF</span>",
          navText:
            "Ketuk 'Explore' untuk melihat hubungan sisi-sisinya",
          actionSummary:
            "Sudut-sudut yang bersesuaian pada segitiga sebangun sama besar!",
          nextText: "Explore",
        },
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
