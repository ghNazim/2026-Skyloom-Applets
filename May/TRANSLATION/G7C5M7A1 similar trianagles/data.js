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
          "We say <y>∆ABC and ∆DEF are similar</y> to each other<br>" +
          "when their shapes are the same<br>" +
          "and they can fit into one another.<br><br>" +
          "What does this mean <y>mathematically?</y><br>" +
          "Let's explore their angles and side measures<br>" +
          "to understand what <y>same shape</y> means.",
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
          questionText:
            "Angles in <span class='tri-abc'>∆ABC</span> ~ <span class='tri-def'>∆DEF</span>",
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
          navText: "Tap 'Explore' to see the relationship between sides",
          actionSummary:
            "Corresponding angles of similar triangles are equal in measure!",
          nextText: "Explore",
        },
        4: {
          questionText:
            "Sides in <span class='tri-abc'>∆ABC</span> ~ <span class='tri-def'>∆DEF</span>",
          navText:
            "Tap any side to see the relationship between corresponding sides",
          navCompare: "Tap 'compare' to take a ratio of sides",
          navSimplify: "Tap to simplify",
          actionCompare: "Compare<br>side lengths",
          navComplete:
            "Tap » to explore side ratios for different similar triangles",
          actionSummary:
            "Corresponding sides<br>of similar triangles<br>are proportional<br>(equal in ratio)!",
        },
        5: {
          questionText:
            "Sides in <span class='tri-abc'>∆ABC</span> ~ <span class='tri-def'>∆DEF</span>",
          navText: "Move the slider and notice the ratio of sides",
          navComplete: "Tap » to summarize",
        },
      },
      final: {
        heading: "Sides and Angles in similar triangles",
        text:
          "We say <y>∆ABC and ∆DEF are similar</y> to each other<br>" +
          "when their shapes are the same<br>" +
          "and they can fit into one another.<br><br>" +
          "Mathematically, this means<br>" +
          "<bl>CORRESPONDING ANGLES</bl> have the <bl>same measure</bl><br>" +
          "and <y>CORRESPONDING SIDES</y> are <y>proportional</y>.",
        buttonText: "Start over",
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
          "dan keduanya saling bertumpuk dengan tepat.<br><br>" +
          "Apa artinya ini secara matematis?<br>" +
          "Ayo kita pelajari sudut dan panjang sisinya<br>" +
          "untuk memahami arti bentuk yang sebangun.",
        buttonText: "Mulai",
      },
      steps: {
        1: {
          questionText:
            "<span class='tri-abc'>∆ABC</span> ~ <span class='tri-def'>∆DEF</span>",
          navText: "Ketuk 'rangkuman' untuk menumpuk segitiga",
          navExplore: "Ketuk 'PELAJARI' untuk melihat hubungan sudut-sudutnya",
          actionRecap: "Rangkum Secara Visual",
          actionExplore: "PELAJARI Sudut",
          recapText:
            "Keduanya memiliki bentuk<br>yang sama dan saling<br>menumpuk dengan tepat.",
        },
        2: {
          questionText:
            "Sudut pada <span class='tri-abc'>∆ABC</span> ~ <span class='tri-def'>∆DEF</span>",
          navText: "Ketuk titik mana saja untuk melihat sudutnya.",
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
          navText: "Ketuk 'PELAJARI' untuk melihat hubungan sisi-sisinya",
          actionSummary:
            "Sudut-sudut yang bersesuaian pada segitiga sebangun sama besar!",
          nextText: "PELAJARI",
        },
        4: {
          questionText:
            "Sisi pada <span class='tri-abc'>∆ABC</span> ~ <span class='tri-def'>∆DEF</span>",
          navText:
            "Ketuk sisi mana saja untuk melihat hubungan sisi yang bersesuaian",
          navCompare: "Ketuk 'BANDINGKAN' untuk membandingkan panjang sisi",
          navSimplify: "Ketuk untuk menyederhanakan",
          actionCompare: "BANDINGKAN <br>panjang sisi",
          navComplete:
            "Ketuk » untuk belajar rasio sisi segitiga sebangun lainnya",
          actionSummary:
            "Sisi-sisi yang bersesuaian<br>pada segitiga sebangun<br>saling proporsional<br>(rasionya sama)!",
        },
        5: {
          questionText:
            "Sisi pada <span class='tri-abc'>∆ABC</span> ~ <span class='tri-def'>∆DEF</span>",
          navText: "Geser tombol dan perhatikan rasio sisi-sisinya",
          navComplete: "Ketuk » untuk merangkum",
        },
      },
      final: {
        heading: "Sisi dan Sudut pada segitiga sebangun",
        text:
          "Kita mengatakan ∆ABC dan ∆DEF sebangun<br>" +
          "ketika bentuknya sama<br>" +
          "dan keduanya dapat saling bertumpuk dengan tepat.<br><br>" +
          "Secara matematis, ini berarti<br>" +
          "<strong>SUDUT YANG BERSESUAIAN</strong> sama besar<br>" +
          "dan <strong>SISI YANG BERSESUAIAN</strong> proporsional.",
        buttonText: "Mulai lagi",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
