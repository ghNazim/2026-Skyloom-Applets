const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Sides and Angles in Congruent Triangles",
        text:
          "We say <y>∆ABC and ∆DEF are congruent</y> to each other<br>" +
          "when their shapes and sizes are the same.<br><br>" +
          "What does this mean <y>mathematically</y>?<br>" +
          "Let's explore their angles and side lengths to understand<br>" +
          "what <y>'same shape'</y> and <y>'same size'</y> means.",
        buttonText: "START",
      },
      steps: {
        1: {
          questionText:
            "<span class='tri-abc'>∆ABC</span> ≅ <span class='tri-def'>∆DEF</span>",
          navText: "Tap 'recap' to overlap the triangles",
        },
        2: {
          questionText:
            "<span class='tri-abc'>∆ABC</span> ≅ <span class='tri-def'>∆DEF</span>",
          navText: "Tap the triangle to define congruence.",
          navExplore:
            "Tap 'Explore' to see the relationship between their angles.",
          actionText: "They have the same shape and the same size.",
          nextText: "Explore Angles",
        },
        3: {
          questionText:
            "Angles in <span class='tri-abc'>∆ABC</span> and <span class='tri-def'>∆DEF</span>",
          navText: "Tap any point to see the angle there…",
          navSummarize:
            "Tap 'Summarize' for the relationship between angles of congruent triangles",
          actionSummarize: "Summarize",
          angleEqual: {
            A: "<span class='ang-abc'>∠A</span> = <span class='ang-def'>∠D</span>",
            B: "<span class='ang-abc'>∠B</span> = <span class='ang-def'>∠E</span>",
            C: "<span class='ang-abc'>∠C</span> = <span class='ang-def'>∠F</span>",
          },
        },
        4: {
          questionText:
            "Angles in <span class='tri-abc'>∆ABC</span> and <span class='tri-def'>∆DEF</span>",
          navText: "Tap 'Explore' to see the relationship between sides.",
          actionSummary:
            "Corresponding angles of congruent triangles are equal in measure!",
          nextText: "Explore Sides",
        },
        5: {
          questionText:
            "Sides in <span class='tri-abc'>∆ABC</span> and <span class='tri-def'>∆DEF</span>",
          navText: "Tap any side to see the relationship between corresponding sides",
          navSummarize:
            "Tap 'Summarize' for the relationship between sides of congruent triangles",
          actionSummarize: "Summarize",
          sideEqual: {
            AB: "<span class='side-abc'>AB</span> = <span class='side-def'>DE</span>",
            BC: "<span class='side-abc'>BC</span> = <span class='side-def'>EF</span>",
            AC: "<span class='side-abc'>AC</span> = <span class='side-def'>DF</span>",
          },
        },
        6: {
          questionText:
            "Sides in <span class='tri-abc'>∆ABC</span> and <span class='tri-def'>∆DEF</span>",
          navText: "Tap 'Summarize'.",
          actionSummary:
            "Corresponding sides of congruent triangles are equal in lengths!",
          nextText: "Summarize",
        },
      },
      feedback: {
        overlap:
          "The two triangles overlap<br>exactly on top of each other.<br>Hence, they are congruent.",
      },
      actions: {
        recapVisually: "Recap Visually",
      },
      finish: {
        heading: "Sides and Angles in Congruent Triangles",
        text:
          "We say <yl>∆ABC and ∆DEF are congruent</yl> to each other<br>" +
          "when they have the same shape and the same size.<br><br>" +
          "Mathematically, this means<br>" +
          "<bl>CORRESPONDING ANGLES</bl> have the <bl>same measure</bl><br>" +
          "and <yl>CORRESPONDING SIDES</yl> have the <yl>same length</yl>.",
        buttonText: "START OVER",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Sisi dan Sudut pada Segitiga Kongruen",
        text:
          "Kita mengatakan <y>∆ABC dan ∆DEF kongruen</y> satu sama lain<br>" +
          "ketika bentuk dan ukurannya sama.<br><br>" +
          "Apa artinya ini <y>secara matematis</y>?<br>" +
          "Mari kita jelajahi sudut dan panjang sisinya untuk memahami<br>" +
          "apa arti <y>'bentuk sama'</y> dan <y>'ukuran sama'</y>.",
        buttonText: "MULAI",
      },
      steps: {
        1: {
          questionText:
            "<span class='tri-abc'>∆ABC</span> ≅ <span class='tri-def'>∆DEF</span>",
          navText: "Ketuk 'recap' untuk menumpuk segitiga",
        },
        2: {
          questionText:
            "<span class='tri-abc'>∆ABC</span> ≅ <span class='tri-def'>∆DEF</span>",
          navText: "Ketuk segitiga untuk mendefinisikan keterkaitan.",
          navExplore:
            "Ketuk 'Explore' untuk melihat hubungan sudut-sudutnya.",
          actionText: "Keduanya memiliki bentuk dan ukuran yang sama.",
          nextText: "Jelajahi Sudut",
        },
        3: {
          questionText:
            "Sudut pada <span class='tri-abc'>∆ABC</span> dan <span class='tri-def'>∆DEF</span>",
          navText: "Ketuk titik mana saja untuk melihat sudut di sana…",
          navSummarize:
            "Ketuk 'Ringkas' untuk hubungan sudut segitiga kongruen",
          actionSummarize: "Ringkas",
          angleEqual: {
            A: "<span class='ang-abc'>∠A</span> = <span class='ang-def'>∠D</span>",
            B: "<span class='ang-abc'>∠B</span> = <span class='ang-def'>∠E</span>",
            C: "<span class='ang-abc'>∠C</span> = <span class='ang-def'>∠F</span>",
          },
        },
        4: {
          questionText:
            "Sudut pada <span class='tri-abc'>∆ABC</span> dan <span class='tri-def'>∆DEF</span>",
          navText: "Ketuk 'Explore' untuk melihat hubungan sisi-sisinya.",
          actionSummary:
            "Sudut-sudut yang bersesuaian pada segitiga kongruen sama besar!",
          nextText: "Jelajahi Sisi",
        },
        5: {
          questionText:
            "Sisi pada <span class='tri-abc'>∆ABC</span> dan <span class='tri-def'>∆DEF</span>",
          navText:
            "Ketuk sisi mana saja untuk melihat hubungan sisi yang bersesuaian",
          navSummarize:
            "Ketuk 'Ringkas' untuk hubungan sisi segitiga kongruen",
          actionSummarize: "Ringkas",
          sideEqual: {
            AB: "<span class='side-abc'>AB</span> = <span class='side-def'>DE</span>",
            BC: "<span class='side-abc'>BC</span> = <span class='side-def'>EF</span>",
            AC: "<span class='side-abc'>AC</span> = <span class='side-def'>DF</span>",
          },
        },
        6: {
          questionText:
            "Sisi pada <span class='tri-abc'>∆ABC</span> dan <span class='tri-def'>∆DEF</span>",
          navText: "Ketuk 'Ringkas'.",
          actionSummary:
            "Sisi-sisi yang bersesuaian pada segitiga kongruen sama panjang!",
          nextText: "Ringkas",
        },
      },
      feedback: {
        overlap:
          "Kedua segitiga bertumpuk<br>tepat di atas satu sama lain.<br>Oleh karena itu, keduanya kongruen.",
      },
      actions: {
        recapVisually: "Recap Secara Visual",
      },
      finish: {
        heading: "Sisi dan Sudut pada Segitiga Kongruen",
        text:
          "Kita mengatakan <yl>∆ABC dan ∆DEF kongruen</yl> satu sama lain<br>" +
          "ketika bentuk dan ukurannya sama.<br><br>" +
          "Secara matematis, ini berarti<br>" +
          "<bl>SUDUT-SUDUT YANG BERSESUAIAN</bl> memiliki <bl>ukuran yang sama</bl><br>" +
          "dan <yl>SISI-SISI YANG BERSESUAIAN</yl> memiliki <yl>panjang yang sama</yl>.",
        buttonText: "MULAI LAGI",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
