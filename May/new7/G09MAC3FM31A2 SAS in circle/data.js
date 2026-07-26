const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      steps: {
        1: {
          questionText: "Point C is the center of the circle. Show that △ABC ≅ △DEC.",
          navText: "Tap » to find the given information.",
        },
        2: {
          questionText:
            "<span class='question-highlight-purple'>Point C is the center of the circle</span><span class='q-dim'>. Show that △ABC ≅ △DEC.</span>",
          navText: "Tap » to find what we need to find.",
        },
        3: {
          questionText:
            "<span class='q-dim'>Point C is the center of the circle. </span><span class='question-focus'>Show that <span class='tri-abc'>△ABC</span> ≅ <span class='tri-dec'>△DEC</span>.</span>",
          navText: "Tap » to solve the problem step by step.",
        },
        4: {
          questionText: "Let’s prove △ABC ≅ △DEC.",
          navText: "Choose the correct answer.",
          navAfterCorrect: "Tap » to visualize.",
        },
        5: {
          questionText: "Let’s prove △ABC ≅ △DEC.",
          navText: "Tap the circle to observe.",
          navAfterObservation: "Tap » to continue observation.",
        },
        6: {
          questionText: "Let’s prove △ABC ≅ △DEC.",
          navText: "Choose the correct answer.",
          navAfterCorrect: "Tap » to continue.",
        },
        7: {
          questionText: "Let’s prove △ABC ≅ △DEC.",
          navText: "Choose the correct answer.",
          navAfterCorrect: "Tap » to continue.",
        },
        8: {
          questionText:
            "Two pairs of corresponding sides and included angle between them are equal.",
          navText: "Tap ‘Start Over’ to restart.",
          nextText: "Start Over",
        },
      },
      actionText: {
        radiiIntro:
          "Let’s see if any of the sides are equal.<br><br>Observe that, AC, CE, BC and CD, are the radii of the circle.",
        radiiDone:
          "Two pairs of corresponding sides of the triangles are equal.<br><br>Let’s see what else we find equal.",
        final: "△ACB ≅ △DCE<br>by SAS congruence rule",
      },
      infoBox: {
        line1Left: "AC",
        line1Right: "CD",
        line2Left: "CE",
        line2Right: "BC",
        line3Left: "∠ACB",
        line3Right: "∠ECD",
      },
      mcqs: {
        congruentParts: {
          title: "What do we need to show to prove that two triangles are congruent?",
          options: [
            "They have the same area",
            "Their corresponding sides and angles are equal",
            "They look similar in shape",
            "Their perimeters are equal",
          ],
          answerIndex: 1,
          feedbacks: [
            "Not quite! Two triangles can have the same area but different shapes. Think about what must match exactly.",
            "Correct! When all corresponding sides and angles are equal, the triangles are congruent.",
            "Not quite! Having the same shape does not always mean having the same size. Think about what measurements must be equal.",
            "Not quite! Two triangles can have the same perimeter but different side lengths and angles. Think about what must match between corresponding parts.",
          ],
        },
        verticalAngles: {
          title:
            "Look at point C for corresponding angles. What can you say about ∠ACB and ∠ECD?",
          options: [
            "Supplementary Angles",
            "Right angles",
            "Vertically opposite",
            "Unequal angles",
          ],
          answerIndex: 2,
          feedbacks: [
            "Not quite! Look at how the two lines intersect at C. Try again!",
            "Not quite! There is no indication that the lines meet at 90°. Look at the positions of the two angles at C.",
            "Correct! ∠ACB and ∠ECD are vertically opposite angles, so they are equal.",
            "Not quite! The angles lie opposite each other where two lines intersect. Try again!",
          ],
        },
        sasRule: {
          title: "Which congruence rule can we use to prove the triangles are congruent?",
          options: ["Side–Side–Side", "Side–Angle–Side", "None"],
          answerIndex: 1,
          feedbacks: [
            "Not quite! We know two pairs of corresponding sides are equal, but no third pair of equal sides is given. Look at the angle information.",
            "Correct! Two pairs of corresponding sides and the included angles are equal.",
            "Not quite! Look for two equal sides and the angle between them.",
          ],
        },
      },
      labels: {
        A: "A",
        B: "B",
        C: "C",
        D: "D",
        E: "E",
        feedback: "FEEDBACK",
      },
    },
  },
  id: {
    app: {
      steps: {
        1: {
          questionText:
            "Titik C adalah pusat lingkaran. Tunjukkan bahwa △ABC ≅ △DEC.",
          navText: "Ketuk » untuk menemukan informasi yang diberikan.",
        },
        2: {
          questionText:
            "<span class='question-highlight-purple'>Titik C adalah pusat lingkaran</span><span class='q-dim'>. Tunjukkan bahwa △ABC ≅ △DEC.</span>",
          navText: "Ketuk » untuk menemukan apa yang perlu dibuktikan.",
        },
        3: {
          questionText:
            "<span class='q-dim'>Titik C adalah pusat lingkaran. </span><span class='question-focus'>Tunjukkan bahwa <span class='tri-abc'>△ABC</span> ≅ <span class='tri-dec'>△DEC</span>.</span>",
          navText: "Ketuk » untuk menyelesaikan soal langkah demi langkah.",
        },
        4: {
          questionText: "Mari buktikan △ABC ≅ △DEC.",
          navText: "Pilih jawaban yang benar.",
          navAfterCorrect: "Ketuk » untuk memvisualisasikan.",
        },
        5: {
          questionText: "Mari buktikan △ABC ≅ △DEC.",
          navText: "Ketuk lingkaran untuk mengamati.",
          navAfterObservation: "Ketuk » untuk melanjutkan pengamatan.",
        },
        6: {
          questionText: "Mari buktikan △ABC ≅ △DEC.",
          navText: "Pilih jawaban yang benar.",
          navAfterCorrect: "Ketuk » untuk melanjutkan.",
        },
        7: {
          questionText: "Mari buktikan △ABC ≅ △DEC.",
          navText: "Pilih jawaban yang benar.",
          navAfterCorrect: "Ketuk » untuk melanjutkan.",
        },
        8: {
          questionText:
            "Dua pasang sisi yang bersesuaian dan sudut apitnya sama.",
          navText: "Ketuk ‘Mulai Lagi’ untuk mengulang.",
          nextText: "Mulai Lagi",
        },
      },
      actionText: {
        radiiIntro:
          "Mari lihat apakah ada sisi-sisi yang sama.<br><br>Perhatikan bahwa AC, CE, BC, dan CD adalah jari-jari lingkaran.",
        radiiDone:
          "Dua pasang sisi yang bersesuaian pada segitiga-segitiga tersebut sama.<br><br>Mari lihat apa lagi yang sama.",
        final: "△ACB ≅ △DCE<br>dengan aturan kekongruenan SAS",
      },
      infoBox: {
        line1Left: "AC",
        line1Right: "CD",
        line2Left: "CE",
        line2Right: "BC",
        line3Left: "∠ACB",
        line3Right: "∠ECD",
      },
      mcqs: {
        congruentParts: {
          title:
            "Apa yang perlu kita tunjukkan untuk membuktikan bahwa dua segitiga kongruen?",
          options: [
            "Keduanya memiliki luas yang sama",
            "Sisi dan sudut yang bersesuaian sama",
            "Keduanya tampak mirip bentuknya",
            "Keduanya memiliki keliling yang sama",
          ],
          answerIndex: 1,
          feedbacks: [
            "Belum tepat! Dua segitiga dapat memiliki luas yang sama tetapi bentuknya berbeda. Pikirkan apa yang harus sama persis.",
            "Benar! Jika semua sisi dan sudut yang bersesuaian sama, maka segitiga-segitiga itu kongruen.",
            "Belum tepat! Bentuk yang sama belum tentu berarti ukurannya sama. Pikirkan ukuran apa yang harus sama.",
            "Belum tepat! Dua segitiga dapat memiliki keliling yang sama tetapi panjang sisi dan sudutnya berbeda. Pikirkan apa yang harus sama antara bagian-bagian yang bersesuaian.",
          ],
        },
        verticalAngles: {
          title:
            "Lihat titik C untuk sudut-sudut yang bersesuaian. Apa yang dapat kamu katakan tentang ∠ACB dan ∠ECD?",
          options: [
            "Sudut berpelurus",
            "Sudut siku-siku",
            "Sudut bertolak belakang",
            "Sudut tidak sama",
          ],
          answerIndex: 2,
          feedbacks: [
            "Belum tepat! Lihat bagaimana kedua garis berpotongan di C. Coba lagi!",
            "Belum tepat! Tidak ada tanda bahwa garis-garis itu berpotongan 90°. Lihat posisi kedua sudut di C.",
            "Benar! ∠ACB dan ∠ECD adalah sudut bertolak belakang, sehingga besarnya sama.",
            "Belum tepat! Sudut-sudut itu saling berhadapan saat dua garis berpotongan. Coba lagi!",
          ],
        },
        sasRule: {
          title:
            "Aturan kekongruenan apa yang dapat kita gunakan untuk membuktikan segitiga-segitiga itu kongruen?",
          options: ["Sisi–Sisi–Sisi", "Sisi–Sudut–Sisi", "Tidak ada"],
          answerIndex: 1,
          feedbacks: [
            "Belum tepat! Kita mengetahui dua pasang sisi yang bersesuaian sama, tetapi tidak ada pasangan sisi ketiga yang diketahui sama. Lihat informasi sudutnya.",
            "Benar! Dua pasang sisi yang bersesuaian dan sudut apitnya sama.",
            "Belum tepat! Carilah dua sisi yang sama dan sudut di antara kedua sisi itu.",
          ],
        },
      },
      labels: {
        A: "A",
        B: "B",
        C: "C",
        D: "D",
        E: "E",
        feedback: "UMPAN BALIK",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
