const DATA = {
  en: {
    app: {
      start: {
        heading: "Random or Not?",
        text: "Not every experiment is the same.<br>Some have <y>outcomes you can predict</y> &ndash; some don't.<br><y>Probability applies to random experiments.</y><br>Let's look at some experiments and identify if they are random.<br><br>Tap &lsquo;Start&rsquo; to begin.",
        buttonText: "Start",
      },
      summary: {
        heading: "",
        text: "Now you know!<br>If the sample space has<br><y>only one outcome &rarr; not a random experiment,</y><br><y>more than one outcome &rarr; random experiment</y><br>But out of all outcomes in sample space, which ones matter?<br>That depends on the event.<br>Let's practise picking <y>which outcomes belong to an event.</y><br>Tap &lsquo;Continue&rsquo; to identify outcomes for events.",
        buttonText: "Continue",
      },
      common: {
        experimentLabel: "Experiment:",
        eventLabel: "Event:",
        submit: "Submit",
        tryAgain: "Try Again",
      },
      steps: {
        1: {
          navText: "Tap the experiment you think is random.",
          navOther: "Tap the other box to understand.",
          navNextCard: "Tap &raquo; for the next card.",
          navSummarize: "Tap &raquo; to summarize.",
          leftText: "Look at the experiments.<br><br>Which one of them is a random experiment?",
        },
        3: {
          navText: "Tap the outcomes for the given event and submit.",
          navTryAgain: "Tap &lsquo;Try Again&rsquo;.",
          navNext: "Tap &raquo; for the next challenge.",
          titleValue: "Rolling a 6 faced standard die",
          eventText: "Getting a number more than 5",
          sampleLabel: "S",
          eventSetLabel: "E",
          sampleSpace: [1, 2, 3, 4, 5, 6],
          answer: [5, 6],
          wrongFeedback: "Check each outcome &ndash; are they all more than 5?",
          correctFeedback: "Correct! 5 and 6 belong to the event. E = {5, 6}",
        },
      },
      choiceQuestions: [
        {
          titleValue: "Picking a ball from the sack",
          correctId: "right",
          wrongFeedback: "Every ball is blue &ndash; the result is always the same. Not a random experiment.",
          correctFeedback: "You can't predict the colour you'll get &ndash; that's a random experiment!",
          cards: [
            {
              id: "left",
              image: "assets/bag1.png",
              items: [{ count: "10", ball: "assets/blueBall.png" }],
            },
            {
              id: "right",
              image: "assets/bag2.png",
              items: [
                { count: "5", ball: "assets/greenBall.png" },
                { count: "4", ball: "assets/redBall.png" },
                { count: "4", ball: "assets/blueBall.png" },
              ],
            },
          ],
        },
        {
          titleValue: "Spinning a spinner",
          correctId: "right",
          wrongFeedback: "It always lands on green &ndash; the result is certain. Not a random experiment.",
          correctFeedback: "You can't predict which colour it'll land on &ndash; that's a random experiment!",
          cards: [
            { id: "left", image: "assets/spinner1.png" },
            { id: "right", image: "assets/spinner2.png" },
          ],
        },
        {
          titleValue: "Tossing a coin",
          correctId: "left",
          wrongFeedback: "Both faces are Heads &ndash; the result is always the same.<br>Not a random experiment.",
          correctFeedback: "It could land Heads or Tails &ndash; you can't predict which. That's a random experiment!",
          cards: [
            {
              id: "left",
              faces: [
                { image: "assets/heads.png", label: "Face 1: Heads" },
                { image: "assets/tails.png", label: "Face 2: Tails" },
              ],
            },
            {
              id: "right",
              faces: [
                { image: "assets/heads.png", label: "Face 1: Heads" },
                { image: "assets/heads.png", label: "Face 2: Heads" },
              ],
            },
          ],
        },
      ],
    },
  },
  id: {
    app: {
      start: {
        heading: "Acak atau Tidak?",
        text: "Tidak setiap percobaan sama.<br>Beberapa memiliki <y>hasil yang dapat kamu prediksi</y> &ndash; beberapa tidak.<br><y>Peluang berlaku untuk percobaan acak.</y><br>Mari kita lihat beberapa percobaan dan tentukan apakah percobaan itu acak.<br><br>Ketuk &lsquo;Mulai&rsquo; untuk memulai.",
        buttonText: "Mulai",
      },
      summary: {
        heading: "",
        text: "Sekarang kamu tahu!<br>Jika ruang sampel memiliki<br><y>hanya satu hasil &rarr; bukan percobaan acak,</y><br><y>lebih dari satu hasil &rarr; percobaan acak</y><br>Tapi dari semua hasil di ruang sampel, mana yang penting?<br>Itu bergantung pada kejadiannya.<br>Mari berlatih memilih <y>hasil mana yang termasuk dalam suatu kejadian.</y><br>Ketuk &lsquo;Lanjut&rsquo; untuk menentukan hasil bagi kejadian.",
        buttonText: "Lanjut",
      },
      common: {
        experimentLabel: "Percobaan:",
        eventLabel: "Kejadian:",
        submit: "Kirim",
        tryAgain: "Coba Lagi",
      },
      steps: {
        1: {
          navText: "Ketuk percobaan yang menurutmu acak.",
          navOther: "Ketuk kotak yang lain untuk memahami.",
          navNextCard: "Ketuk &raquo; untuk kartu berikutnya.",
          navSummarize: "Ketuk &raquo; untuk merangkum.",
          leftText: "Lihat percobaan-percobaan ini.<br><br>Manakah yang merupakan percobaan acak?",
        },
        3: {
          navText: "Ketuk hasil untuk kejadian yang diberikan, lalu kirim.",
          navTryAgain: "Ketuk &lsquo;Coba Lagi&rsquo;.",
          navNext: "Ketuk &raquo; untuk tantangan berikutnya.",
          titleValue: "Melempar dadu standar 6 sisi",
          eventText: "Mendapatkan bilangan lebih dari 5",
          sampleLabel: "S",
          eventSetLabel: "E",
          sampleSpace: [1, 2, 3, 4, 5, 6],
          answer: [5, 6],
          wrongFeedback: "Periksa setiap hasil &ndash; apakah semuanya lebih dari 5?",
          correctFeedback: "Benar! 5 dan 6 termasuk dalam kejadian ini. E = {5, 6}",
        },
      },
      choiceQuestions: [
        {
          titleValue: "Mengambil bola dari karung",
          correctId: "right",
          wrongFeedback: "Setiap bola berwarna biru &ndash; hasilnya selalu sama. Bukan percobaan acak.",
          correctFeedback: "Kamu tidak bisa memprediksi warna yang akan kamu dapat &ndash; itu percobaan acak!",
          cards: [
            {
              id: "left",
              image: "assets/bag1.png",
              items: [{ count: "10", ball: "assets/blueBall.png" }],
            },
            {
              id: "right",
              image: "assets/bag2.png",
              items: [
                { count: "5", ball: "assets/greenBall.png" },
                { count: "4", ball: "assets/redBall.png" },
                { count: "4", ball: "assets/blueBall.png" },
              ],
            },
          ],
        },
        {
          titleValue: "Memutar spinner",
          correctId: "right",
          wrongFeedback: "Selalu mendarat di hijau &ndash; hasilnya pasti. Bukan percobaan acak.",
          correctFeedback: "Kamu tidak bisa memprediksi warna yang akan dilandasi &ndash; itu percobaan acak!",
          cards: [
            { id: "left", image: "assets/spinner1.png" },
            { id: "right", image: "assets/spinner2.png" },
          ],
        },
        {
          titleValue: "Melempar koin",
          correctId: "left",
          wrongFeedback: "Kedua sisi adalah Kepala &ndash; hasilnya selalu sama.<br>Bukan percobaan acak.",
          correctFeedback: "Bisa mendarat Kepala atau Ekor &ndash; kamu tidak bisa memprediksi yang mana. Itu percobaan acak!",
          cards: [
            {
              id: "left",
              faces: [
                { image: "assets/heads.png", label: "Sisi 1: Kepala" },
                { image: "assets/tails.png", label: "Sisi 2: Ekor" },
              ],
            },
            {
              id: "right",
              faces: [
                { image: "assets/heads.png", label: "Sisi 1: Kepala" },
                { image: "assets/heads.png", label: "Sisi 2: Kepala" },
              ],
            },
          ],
        },
      ],
    },
  },
};

const APP_DATA = DATA[current_language].app;
