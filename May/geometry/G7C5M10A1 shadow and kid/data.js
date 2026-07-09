const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      steps: {
        1: {
          questionText:
            "Read the question and identify \u2018given\u2019 and \u2018to find\u2019",
          navText: "Tap \u00BB to identify \u2018given\u2019 information",
        },
        2: {
          navText: "Tap \u00BB to identify \u2018given\u2019 information",
          navToFind: "Tap \u00BB to identify what we need to find",
          navFindPole: "Tap \u00BB to find the height of the pole.",
        },
        3: {
          questionText: "Finding the height of the pole.",
          navText: "Tap the button to reveal the answer.",
          buttonText: "Sun rays travels always _____",
          img: "assets/5in.svg",
          imgAfter: "assets/5end.svg",
          navAfter:
            "Tap \u00BB to see the angles formed by sun rays and ground.",
        },
        4: {
          questionText: "Finding the height of the pole.",
          navText: "Tap the highlighted button to reveal the answer",
        },
        5: {
          questionText: "Finding the height of the pole.",
          navText: "Tap \u2018?\u2019 button to reveal the answer.",
          questionComplete: "Finding the height of the pole.",
          navComplete: "Activity Completed!!",
          nextText: "Start Over",
        },
      },
      problem: {
        statement: [
          {
            key: "given1",
            text: "A student is 150 cm tall.",
            type: "given",
            image: "assets/1.svg",
          },
          {
            key: "given2",
            text: " His shadow is 100 cm long.",
            type: "given",
            image: "assets/2.svg",
          },
          {
            key: "given3",
            text: " At the same time, the shadow of a nearby pole is 300 cm long.",
            type: "given",
            image: "assets/3.svg",
          },
          {
            key: "tofind",
            text: " Find the height of the pole.",
            type: "tofind",
            image: "assets/4.svg",
          },
        ],
      },
      step4Substeps: [
        {
          btn:
            "Look at the parallel lines and the transversal, shout out what do you say about the two angles measures.",
          img: "assets/6in.svg",
          textAfter:
            "The measures of the two angles are equal.<br><span class=\"text-after-sub\">(Corresponding angles)</span>",
          imgAfter: "assets/6end.svg",
          navAfter:
            "Tap \u00BB to see what shapes the objects and their shadows form.",
        },
        {
          btn: "Shout out what shape the objects and their shadows form.",
          textAfter: "Right angled triangles",
          img: "assets/7in.svg",
          imgAfter: "assets/7end.svg",
          navAfter:
            "Tap \u00BB to see the relationship between the two triangles.",
        },
        {
          btn:
            "The two triangles have two equal corresponding angles. Shout out what do we call such triangles.",
          textAfter: "Similar Triangles",
          img: "assets/8in.svg",
          imgAfter: "assets/8end.svg",
          navAfter:
            "Tap \u00BB to see how sides are related in similar triangles.",
        },
        {
          btn:
            "Shout out how are the corresponding sides related in similar triangles",
          textAfter: "Corresponding sides are proportional",
          img: "assets/9in.svg",
          imgAfter: "assets/9end.svg",
          navAfter: "Tap \u00BB to find h.",
        },
      ],
      math: {
        title: "Corresponding sides<br>are proportional",
        value150: "150",
        value300: "300",
        value100: "100",
        result: "450",
      },
    },
  },
  id: {
    app: {
      steps: {
        1: {
          questionText:
            "Baca pertanyaan dan identifikasi \u2018diketahui\u2019 dan \u2018yang dicari\u2019",
          navText:
            "Ketuk \u00BB untuk mengidentifikasi informasi \u2018diketahui\u2019",
        },
        2: {
          navText:
            "Ketuk \u00BB untuk mengidentifikasi informasi \u2018diketahui\u2019",
          navToFind: "Ketuk \u00BB untuk mengidentifikasi apa yang harus dicari",
          navFindPole: "Ketuk \u00BB untuk mencari tinggi tiang.",
        },
        3: {
          questionText: "Mencari tinggi tiang.",
          navText: "Ketuk tombol untuk mengungkap jawabannya.",
          buttonText: "Sinar matahari selalu _____",
          img: "assets/5in.svg",
          imgAfter: "assets/5end.svg",
          navAfter:
            "Ketuk \u00BB untuk melihat sudut yang terbentuk oleh sinar matahari dan tanah.",
        },
        4: {
          questionText: "Mencari tinggi tiang.",
          navText: "Ketuk tombol yang disorot untuk mengungkap jawabannya",
        },
        5: {
          questionText: "Mencari tinggi tiang.",
          navText: "Ketuk tombol \u2018?\u2019 untuk mengungkap jawabannya.",
          questionComplete: "Mencari tinggi tiang.",
          navComplete: "Aktivitas Selesai!!",
          nextText: "Mulai Lagi",
        },
      },
      problem: {
        statement: [
          {
            key: "given1",
            text: "Seorang siswa tingginya 150 cm.",
            type: "given",
            image: "assets/1.svg",
          },
          {
            key: "given2",
            text: " Bayangannya panjangnya 100 cm.",
            type: "given",
            image: "assets/2.svg",
          },
          {
            key: "given3",
            text: " Pada waktu yang sama, bayangan tiang di dekatnya panjangnya 300 cm.",
            type: "given",
            image: "assets/3.svg",
          },
          {
            key: "tofind",
            text: " Temukan tinggi tiang.",
            type: "tofind",
            image: "assets/4.svg",
          },
        ],
      },
      step4Substeps: [
        {
          btn:
            "Perhatikan garis-garis sejajar dan garis transversal, sebutkan apa yang dapat kamu katakan tentang besar kedua sudut tersebut.",
          img: "assets/6in.svg",
          textAfter:
            "Besar kedua sudut sama.<br><span class=\"text-after-sub\">(Sudut-sudut sehadap)</span>",
          imgAfter: "assets/6end.svg",
          navAfter:
            "Ketuk \u00BB untuk melihat bentuk objek dan bayangannya.",
        },
        {
          btn: "Sebutkan bentuk apa yang dibentuk oleh objek dan bayangannya.",
          textAfter: "Segitiga siku-siku",
          img: "assets/7in.svg",
          imgAfter: "assets/7end.svg",
          navAfter:
            "Ketuk \u00BB untuk melihat hubungan antara kedua segitiga.",
        },
        {
          btn:
            "Kedua segitiga memiliki dua sudut yang bersesuaian sama. Sebutkan apa nama segitiga seperti ini.",
          textAfter: "Segitiga Sebangun",
          img: "assets/8in.svg",
          imgAfter: "assets/8end.svg",
          navAfter:
            "Ketuk \u00BB untuk melihat bagaimana sisi-sisi berhubungan pada segitiga sebangun.",
        },
        {
          btn:
            "Sebutkan bagaimana sisi-sisi yang bersesuaian berhubungan pada segitiga sebangun",
          textAfter: "Sisi-sisi yang bersesuaian berbanding senilai",
          img: "assets/9in.svg",
          imgAfter: "assets/9end.svg",
          navAfter: "Ketuk \u00BB untuk mencari h.",
        },
      ],
      math: {
        title: "Sisi-sisi yang bersesuaian<br>berbanding senilai",
        value150: "150",
        value300: "300",
        value100: "100",
        result: "450",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
