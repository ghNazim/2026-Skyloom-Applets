const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "AA Similarity",
        text:
          "Can two pairs of equal corresponding angles help us<br>" +
          "determine whether two triangles are similar?<br>" +
          "Let's find out!",
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
          navText: " ",
          navSummarize:
            "Tap 'Summarize' for the relationship between angles of similar triangles",
          actionSummarize: "Summarize",
          angleEqual: {
            1: "<span class='ang-def'>∠D</span> = <span class='ang-abc'>∠A</span>",
            2: "<span class='ang-abc'>∠B</span> = <span class='ang-def'>∠E</span>",
            3: "<span class='ang-abc'>∠C</span> = <span class='ang-def'>∠F</span>",
          },
        },
        3: {
          questionText:
            "Angles in <span class='tri-abc'>∆ABC</span> ~ <span class='tri-def'>∆DEF</span>",
          navText: "Tap 'Explore' to see another scenario.",
          actionSummary:
            "All corresponding angles of similar triangles are equal in measure!",
          nextText: "Explore",
        },
        4: {
          heading: "AA Similarity",
          introText:
            "<span class='tri-def'>△PQR</span> and <span class='tri-abc'>△KLM</span> have two pairs<br>" +
            "of corresponding angles equal.<br><br>" +
            "Let's see if they make similar triangles.",
          continueBtn: "Continue",
        },
        5: {
          questionText:
            "The two triangles have two pairs of corresponding angles equal.",
          navText: "Tap the highlighted area to reveal the answer.",
          actionFit: "Can two equal angles make triangles fit?",
          questionTextDone:
            "The two triangles fit into one another. They are similar triangles.",
          navTextDone: "Tap the highlighted button.",
          actionExplore: "Explore why this happens?",
        },
        6: {
          questionText:
            "Shout out the angle P measure in <span class='tri-def'>△PQR</span>.",
          navText:
            "Tap <span class='tri-def'>△PQR</span> to reveal the answer.",
          questionTextK:
            "Shout out the angle K measure in <span class='tri-abc'>△KLM</span>.",
          navTextK:
            "Tap <span class='tri-abc'>△KLM</span> to reveal the answer.",
          questionTextDone:
            "Both angles P and K have same measure.",
          navTextDone:
            "Tap conclude button.",
          actionConclude: "Conclude",
        },
        7: {
          questionText: "Both angles P and K have same measure.",
          navText: "Tap Similarity Rule button.",
          actionRule: "If two pairs of corresponding angles are equal, the third pair also becomes equal because of the angle sum property. This makes the triangles similar.",
          nextText: "Similarity Rule",
        },
        8: {
          questionText: "Let’s see what do we call this similarity rule.",
          navText: "Tap the highlighted button.",
          questionTextDone: "We call this AA similarity.",
          navTextDone: "Tap summarise button.",
          actionNameBtn: "Name",
          actionNameText: "If two pairs of corresponding angles are equal, they are similar triangles.",
          actionNameBox: "AA Similarity",
          nextText: "Summarise",
        },
      },
      final: {
        heading: "Activity Completed!!",
        boxText: "AA Similarity",
        text:
          "If two pairs of<br>" +
          "corresponding angles are equal,<br>" +
          "they are similar triangles.",
        buttonText: "Start Over",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Kesebangunan Sd.Sd.",
        text:
          "Dapatkah dua pasang sudut bersesuaian yang sama<br>" +
          "membantu kita menentukan apakah dua segitiga sebangun?<br>" +
          "Mari kita cari tahu!",
        buttonText: "Mulai",
      },
      steps: {
        1: {
          questionText:
            "<span class='tri-abc'>∆ABC</span> ~ <span class='tri-def'>∆DEF</span>",
          navText: "Ketuk 'Rangkum' untuk menumpuk segitiga",
          navExplore: "Ketuk 'Pelajari' untuk melihat hubungan sudut-sudutnya",
          actionRecap: "Rangkum Secara Visual",
          actionExplore: "Pelajari Sudut",
          recapText:
            "Keduanya memiliki bentuk<br>yang sama dan saling<br>bertumpuk dengan tepat.",
        },
        2: {
          questionText:
            "Sudut pada <span class='tri-abc'>∆ABC</span> ~ <span class='tri-def'>∆DEF</span>",
          navText: " ",
          navSummarize:
            "Ketuk 'Ringkas' untuk hubungan sudut segitiga sebangun",
          actionSummarize: "Ringkas",
          angleEqual: {
            1: "<span class='ang-def'>∠D</span> = <span class='ang-abc'>∠A</span>",
            2: "<span class='ang-abc'>∠B</span> = <span class='ang-def'>∠E</span>",
            3: "<span class='ang-abc'>∠C</span> = <span class='ang-def'>∠F</span>",
          },
        },
        3: {
          questionText:
            "<span class='tri-abc'>∆ABC</span> ~ <span class='tri-def'>∆DEF</span>",
          navText: "Ketuk 'Pelajari' untuk melihat skenario lain.",
          actionSummary:
            "Semua sudut yang bersesuaian pada segitiga sebangun sama besar!",
          nextText: "Pelajari",
        },
        4: {
          heading: "Kesebangunan Sd.Sd.",
          introText:
            "<span class='tri-def'>△PQR</span> dan <span class='tri-abc'>△KLM</span> memiliki dua pasang<br>" +
            "sudut bersesuaian yang sama.<br><br>" +
            "Mari lihat apakah keduanya membentuk segitiga sebangun.",
          continueBtn: "Lanjut",
        },
        5: {
          questionText:
            "Kedua segitiga memiliki dua pasang sudut bersesuaian yang sama.",
          navText: "Ketuk area yang disorot untuk melihat jawaban.",
          actionFit: "Bisakah dua sudut yang sama membuat segitiga saling bertumpuk tepat satu sama lain?",
          questionTextDone:
            "Kedua segitiga saling bertumpuk dengan tepat. Keduanya adalah segitiga sebangun.",
          navTextDone: "Ketuk tombol yang disorot.",
          actionExplore: "Pelajari mengapa ini terjadi?",
        },
        6: {
          questionText:
            "Sebutkan ukuran sudut P pada <span class='tri-def'>△PQR</span>.",
          navText:
            "Ketuk <span class='tri-def'>△PQR</span> untuk melihat jawaban.",
          questionTextK:
            "Sebutkan ukuran sudut K pada <span class='tri-abc'>△KLM</span>.",
          navTextK:
            "Ketuk <span class='tri-abc'>△KLM</span> untuk melihat jawaban.",
          questionTextDone:
            "Kedua sudut P dan K memiliki ukuran yang sama.",
          navTextDone:
            "Ketuk tombol simpulkan.",
          actionConclude: "Simpulkan",
        },
        7: {
          questionText: "Kedua sudut P dan K memiliki ukuran yang sama.",
          navText: "Ketuk tombol Aturan Kesebangunan.",
          actionRule: "Jika dua pasang sudut bersesuaian sama, pasangan ketiga juga menjadi sama karena sifat jumlah sudut. Hal ini membuat kedua segitiga sebangun.",
          nextText: "Aturan Kesebangunan",
        },
        8: {
          questionText: "Mari kita lihat apa sebutan untuk aturan kesebangunan ini.",
          navText: "Ketuk tombol yang disorot.",
          questionTextDone: "Kita menyebutnya kesebangunan Sd.Sd.",
          navTextDone: "Ketuk tombol ringkas.",
          actionNameBtn: "Nama",
          actionNameText: "Jika dua pasang sudut bersesuaian sama, keduanya adalah segitiga sebangun.",
          actionNameBox: "Kesebangunan Sd.Sd,",
          nextText: "Ringkas",
        },
      },
      final: {
        heading: "Aktivitas Selesai!",
        boxText: "Kesebangunan Sd.Sd.",
        text:
          "Jika dua pasang<br>" +
          "sudut bersesuaian sama,<br>" +
          "keduanya adalah segitiga sebangun.",
        buttonText: "Mulai Lagi",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
