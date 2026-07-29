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
          navFindH: "Tap \u00BB to find \u2018h\u2019",
        },
        3: {
          questionText: "Finding the height of the Eiffel tower.",
          navText: "Tap the highlighted button to reveal the answer",
        },
        4: {
          questionText: "Finding the height of the Eiffel tower.",
          navText: "Tap \u2018?\u2019 button to reveal the answer.",
          questionComplete: "The height of the Eiffel tower is 327.3 m.",
          navSummary: "Tap \u00BB to summarize",
        },
        5: {
          questionText: "The height of the Eiffel tower is 327.3 m.",
          navText: "Activity completed!!",
          nextText: "Start Over",
        },
      },
      problem: {
        statement: [
          {
            key: "given1",
            text: "A mirror is placed 500 m from the base of the Eiffel Tower.",
            type: "given",
            image: "assets/1.svg",
          },
          {
            key: "given2",
            text: " A person stands 2.75 m from the other side of the mirror",
            type: "given",
            image: "assets/2.svg",
          },
          {
            key: "given3",
            text: " and sees the top of the tower reflected in the mirror.",
            type: "given",
            image: "assets/3.svg",
          },
          {
            key: "given4",
            text: " The person\u2019s eye level is 1.8 m above the ground.",
            type: "given",
            image: "assets/4.svg",
          },
          {
            key: "tofind",
            text: " Determine the height of the Eiffel Tower.",
            type: "tofind",
            image: "assets/h.svg",
          },
        ],
      },
      step3Substeps: [
        {
          btn: "Shout out what type of triangles are these.",
          img: "assets/5blink.svg",
          textAfter: "Right angled triangles",
          imgAfter: "assets/5.svg",
          navAfter: "Tap \u00BB to examine the angles formed at the mirror",
        },
        {
          btn: "Shout out what can we say about the angles formed at the mirror.",
          img: "assets/6blink.svg",
          textAfter:
            'Measures of these angles are equal<br><span class="text-after-sub">(Angle of incidence = Angle of reflection)</span>',
          imgAfter: "assets/6.svg",
          navAfter:
            "Tap \u00BB to see the angles formed by the triangles at the mirror.",
        },
        {
          btn: "Shout out the measures of the highlighted angles.",
          img: "assets/7blink.svg",
          textAfter: "Measures of the highlighted angles are equal",
          imgAfter: "assets/7.svg",
          navAfter: "Tap \u00BB to see the relationship between the triangles",
        },
        {
          btn: "The two triangles have two equal corresponding angles. Shout out what do we call such triangles",
          img: "assets/8blink.svg",
          imgAfter: "assets/8.svg",
          textAfter: "Similar Triangles",
          navAfter:
            "Tap \u00BB to see how sides are related in similar triangles.",
        },
        {
          btn: "Shout out how are the corresponding sides related in similar triangles",
          img: "assets/8.svg",
          imgAfter: "assets/8.svg",
          textAfter: "Corresponding sides are proportional",
          navAfter: "Tap \u00BB to find \u2018h\u2019.",
        },
      ],
      math: {
        title: "Corresponding sides<br>are proportional",
        heightVar: "h",
        value18: "1.8",
        value500: "500",
        value275: "2.75",
        result: "327.3",
      },
      defaultImages: {
        8: "assets/8.svg",
        ans: "assets/ans.svg",
      },
    },
  },
  id: {
    app: {
      steps: {
        1: {
          questionText:
            "Baca pertanyaan dan tentukan ‘diketahui’ dan ‘yang dicari’",
          navText: "Ketuk » untuk menentukan informasi ‘diketahui’",
        },
        2: {
          navText: "Ketuk » untuk menentukan informasi ‘diketahui’",
          navToFind: "Ketuk » untuk menentukan apa yang harus dicari",
          navFindH: "Ketuk » untuk mencari ‘t’",
        },
        3: {
          questionText: "Mencari tinggi Menara Eiffel.",
          navText: "Ketuk tombol yang disorot untuk mengungkap jawabannya",
        },
        4: {
          questionText: "Mencari tinggi Menara Eiffel.",
          navText: "Ketuk tombol \u2018?\u2019 untuk mengungkap jawabannya.",
          questionComplete: "Tinggi Menara Eiffel adalah 327,3 m.",
          navSummary: "Ketuk \u00BB untuk meringkas",
        },
        5: {
          questionText: "Tinggi Menara Eiffel adalah 327,3 m.",
          navText: "Aktivitas selesai!!",
          nextText: "Mulai Lagi",
        },
      },
      problem: {
        statement: [
          {
            key: "given1",
            text: "Sebuah cermin ditempatkan 500 m dari dasar Menara Eiffel.",
            type: "given",
            image: "assets/1_id.svg",
          },
          {
            key: "given2",
            text: " Seseorang berdiri 2,75 m di sisi lain cermin",
            type: "given",
            image: "assets/2_id.svg",
          },
          {
            key: "given3",
            text: " dan melihat puncak menara terpantul di cermin.",
            type: "given",
            image: "assets/3_id.svg",
          },
          {
            key: "given4",
            text: " Tinggi mata orang tersebut adalah 1,8 m di atas tanah.",
            type: "given",
            image: "assets/4_id.svg",
          },
          {
            key: "tofind",
            text: " Tentukan tinggi Menara Eiffel.",
            type: "tofind",
            image: "assets/h_id.svg",
          },
        ],
      },
      step3Substeps: [
        {
          btn: "Sebutkan jenis segitiga apa ini.",
          img: "assets/5blink_id.svg",
          textAfter: "Segitiga siku-siku",
          imgAfter: "assets/5_id.svg",
          navAfter:
            "Ketuk \u00BB untuk memeriksa sudut yang terbentuk di cermin",
        },
        {
          btn: "Apa yang dapat kita katakan tentang sudut yang terbentuk di cermin?",
          img: "assets/6blink_id.svg",
          textAfter:
            'Besar sudut-sudut ini sama<br><span class="text-after-sub">(Sudut datang = Sudut pantul)</span>',
          imgAfter: "assets/6_id.svg",
          navAfter:
            "Ketuk \u00BB untuk melihat sudut yang terbentuk oleh segitiga di cermin.",
        },
        {
          btn: "Sebutkan besar sudut yang disorot.",
          img: "assets/7blink_id.svg",
          textAfter: "Besar sudut yang disorot sama",
          imgAfter: "assets/7_id.svg",
          navAfter:
            "Ketuk \u00BB untuk melihat hubungan antara segitiga-segitiga",
        },
        {
          btn: "Kedua segitiga memiliki dua sudut yang berpadanan sama besar. Sebutkan nama segitiga ini?",
          img: "assets/8blink_id.svg",
          imgAfter: "assets/8_id.svg",
          textAfter: "Segitiga Sebangun",
          navAfter:
            "Ketuk \u00BB untuk melihat bagaimana sisi-sisi berhubungan pada segitiga sebangun.",
        },
        {
          btn: "Sebutkan bagaimana sisi-sisi yang berpadanan berhubungan pada segitiga sebangun",
          img: "assets/8_id.svg",
          imgAfter: "assets/8_id.svg",
          textAfter: "Sisi-sisi yang berpadanan berbanding senilai",
          navAfter: "Ketuk » untuk mencari ‘t’.",
        },
      ],
      math: {
        title: "Sisi-sisi yang berpadanan<br>berbanding senilai",
        heightVar: "t",
        value18: "1,8",
        value500: "500",
        value275: "2,75",
        result: "327,3",
      },
      defaultImages: {
        8: "assets/8_id.svg",
        ans: "assets/ans_id.svg",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
