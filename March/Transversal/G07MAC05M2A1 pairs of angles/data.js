const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Angles Created by Intersecting Lines",
        text: "Let's explore the different types of angle pairs formed when\ntwo lines intersect.",
        buttonText: "Start",
      },
      steps: {
        1: {
          questionText: "Let's see angles created by intersecting lines.",
          navText: "Tap any one of the lines to make both lines intersect.",
          questionTextAfter: "Two intersecting lines create <y>4 angles</y>.",
          navTextAfter: "Tap » to see how these angles are related.",
          twoLinesLabel: "Two Lines",
        },
        2: {
          questionText: "Linear Pairs – Pairs of angles that form a straight line.",
          navText: "Tap each ray to see each linear pair.",
          navTextAfter: "Tap » to see relationship between each linear pair.",
          textColumnTitle: "Linear Pairs:",
          straightLineLabel: "Straight line",
          andText: "and",
        },
        3: {
          questionText: "Relationship between each linear pair",
          navText: "Tap each button and look at the figure.",
          navTextAfter: "Tap » to summarize Linear Pairs",
        },
        4: {
          questionText: "Linear Pairs of Angles",
          navText: "Tap » to explore another type of pairs of angles",
          text: "A pair of adjacent angles whose non-common arms <y>form a straight line</y> is<br/>called a linear pair.<br/><br/>They are <yl>supplementary</y> – their<br/>measures add up to <pr>180°</pr>.",
        },
        5: {
          questionText: "Vertical Angles – Pairs of opposite angles.",
          navText: "Tap each highlighted angle to see each vertical angle.",
          navTextAfter: "Tap » to see relationship between each vertical angle.",
          textColumnTitle: "Vertical Angles:",
          andText: "and",
        },
        6: {
          questionText: "Relationship between each vertical angle",
          navText: "Tap each button and look at the figure.",
          navTextAfter: "Tap » to summarize vertical angles",
        },
        7: {
          questionText: "Vertical Angles",
          navText: "Tap » to complete the activity.",
          text: "A pair of angles <bl>opposite to each other</bl><br/>are vertical angles.<br/><br/>The measures of vertical angles are<br/><bl>equal</bl>.",
        },
        8: {
          heading: "Angles Created by Intersecting Lines",
          text: "Awesome! We explored the different types of angle pairs<br/>formed when two lines intersect.",
          buttonText: "Start Over",
        },
      },
      labels: {
        angle: "∠",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Sudut yang Dibentuk oleh Garis Berpotongan",
        text: "Mari kita jelajahi berbagai jenis pasangan sudut yang terbentuk\nketika dua garis berpotongan.",
        buttonText: "Mulai",
      },
      steps: {
        1: {
          questionText: "Mari kita lihat sudut-sudut yang dibentuk oleh garis berpotongan.",
          navText: "Ketuk salah satu garis untuk membuat kedua garis berpotongan.",
          questionTextAfter: "Dua garis berpotongan menghasilkan <y>4 sudut</y>.",
          navTextAfter: "Ketuk » untuk melihat hubungan sudut-sudut ini.",
          twoLinesLabel: "Dua Garis",
        },
        2: {
          questionText: "Pasangan Linear – Pasangan sudut yang membentuk garis lurus.",
          navText: "Ketuk setiap sinar untuk melihat setiap pasangan linear.",
          navTextAfter: "Ketuk » untuk melihat hubungan antar pasangan linear.",
          textColumnTitle: "Pasangan Linear:",
          straightLineLabel: "Garis lurus",
          andText: "dan",
        },
        3: {
          questionText: "Hubungan antara setiap pasangan linear",
          navText: "Ketuk setiap tombol dan perhatikan gambarnya.",
          navTextAfter: "Ketuk » untuk merangkum Pasangan Linear",
        },
        4: {
          questionText: "Pasangan Sudut Linear",
          navText: "Ketuk » untuk menjelajahi jenis pasangan sudut lainnya",
          text: "Sepasang sudut berdekatan yang lengan tidak bersamanya <y>membentuk garis lurus</y> disebut pasangan linear.<br/><br/>Keduanya saling <yl>berpelurus</y> – jumlah besar sudutnya adalah <pr>180°</pr>.",
        },
        5: {
          questionText: "Sudut Bertolak Belakang – Pasangan sudut yang berlawanan.",
          navText: "Ketuk setiap sudut yang disorot untuk melihat setiap sudut bertolak belakang.",
          navTextAfter: "Ketuk » untuk melihat hubungan antar sudut bertolak belakang.",
          textColumnTitle: "Sudut Bertolak Belakang:",
          andText: "dan",
        },
        6: {
          questionText: "Hubungan antara setiap sudut bertolak belakang",
          navText: "Ketuk setiap tombol dan perhatikan gambarnya.",
          navTextAfter: "Ketuk » untuk merangkum sudut bertolak belakang",
        },
        7: {
          questionText: "Sudut Bertolak Belakang",
          navText: "Ketuk » untuk menyelesaikan aktivitas.",
          text: "Sepasang sudut yang <bl>saling berlawanan</bl><br/>disebut sudut bertolak belakang.<br/><br/>Besar sudut-sudut yang bertolak belakang adalah<br/><bl>sama</bl>.",
        },
        8: {
          heading: "Sudut yang Dibentuk oleh Garis Berpotongan",
          text: "Luar biasa! Kita telah menjelajahi berbagai jenis pasangan sudut<br/>yang terbentuk saat dua garis berpotongan.",
          buttonText: "Mulai Lagi",
        },
      },
      labels: {
        angle: "∠",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
