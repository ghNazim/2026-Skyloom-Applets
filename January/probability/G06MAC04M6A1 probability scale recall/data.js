const DATA = {
  en: {
    scalePositions: [
      { label: "Impossible", dotColor: "#e53935" },
      { label: "Less Likely", dotColor: "#fb8c00" },
      { label: "Possible", dotColor: "#fdd835" },
      { label: "More Likely", dotColor: "#29b6f6" },
      { label: "Certain", dotColor: "#66bb6a" },
    ],

    intro: {
      heading: "Recall Scale of Probability",
      text: "Let\u2019s recall how to represent<br>chances of events on a probability scale.<br><br><br>Our event is <y>picking a red ball<br>at random without looking</y>.",
      buttonText: "Start",
    },

    questionPanelText: "Scale of Probability",

    leftText:
      'Event = <br><b>Getting a <br><red>RED BALL</red></b>',

    rightTextArray: [
      '<y>No chance of getting</y> a <red>RED</red> ball.<br><br><red>RED</red> balls are <y>zero</y> in number.',
      '<y>Less chance of getting</y> a <red>RED</red> ball.<br><br><red>RED</red> balls are <y>least</y> in number.',
      '<y>Neither more nor less chance<br>of getting</y> a <red>RED</red> ball.<br><br><red>RED</red> balls are <y>neither most nor least</y><br>in number.',
      '<y>More chance of getting</y> a <red>RED</red> ball.<br><br><red>RED</red> balls are <y>most</y> in number.',
      '<y>Sure chance of getting</y> a <red>RED</red> ball.<br><br>All balls are <red>RED</red> balls.',
    ],

    navTexts: [
      "Tap \u00BB to see the less likely event on the scale.",
      "Tap \u00BB to see the possible event on the scale.",
      "Tap \u00BB to see the more likely event on the scale.",
      "Tap \u00BB to see the certain event on the scale.",
      "Tap \u00BB to summarize.",
    ],

    images: [
      "assets/1.png",
      "assets/2.png",
      "assets/3.png",
      "assets/4.png",
      "assets/5.png",
    ],

    summaryLabels: [
      '<red>RED</red> balls =<br><i>Zero</i>',
      '<red>RED</red> balls =<br><i>Least</i>',
      '<red>RED</red> balls =<br><i>Neither least<br>nor most</i>',
      '<red>RED</red> balls =<br><i>Most</i>',
      '<red>RED</red> balls =<br><i>All</i>',
    ],

    summary: {
      heading: "Scale of Probability",
      eventText: 'Event = Getting a <red>RED BALL</red>',
      footerText: "Tap \u2018Start Over\u2019 to go over this again.",
      buttonText: "Start Over",
    },
  },

  id: {
    scalePositions: [
      { label: "Mustahil", dotColor: "#e53935" },
      { label: "Kurang Mungkin", dotColor: "#fb8c00" },
      { label: "Mungkin", dotColor: "#fdd835" },
      { label: "Lebih Mungkin", dotColor: "#29b6f6" },
      { label: "Pasti", dotColor: "#66bb6a" },
    ],

    intro: {
      heading: "Mengingat Skala Probabilitas",
      text: "Mari kita mengingat cara merepresentasikan<br>peluang kejadian pada skala probabilitas.<br><br><br>Kejadian kita adalah <y>mengambil bola merah<br>secara acak tanpa melihat</y>.",
      buttonText: "Mulai",
    },

    questionPanelText: "Skala Probabilitas",

    leftText:
      'Kejadian = <br><b>Mendapatkan <br><red>BOLA MERAH</red></b>',

    rightTextArray: [
      '<y>Tidak ada peluang mendapatkan</y> <red>BOLA MERAH</red>.<br><br><red>BOLA MERAH</red> berjumlah <y>nol</y>.',
      '<y>Peluang kecil mendapatkan</y> <red>BOLA MERAH</red>.<br><br><red>BOLA MERAH</red> berjumlah <y>paling sedikit</y>.',
      '<y>Peluang tidak lebih atau kurang<br>mendapatkan</y> <red>BOLA MERAH</red>.<br><br><red>BOLA MERAH</red> bukan <y>paling banyak atau sedikit</y>.',
      '<y>Peluang lebih besar mendapatkan</y> <red>BOLA MERAH</red>.<br><br><red>BOLA MERAH</red> berjumlah <y>paling banyak</y>.',
      '<y>Pasti mendapatkan</y> <red>BOLA MERAH</red>.<br><br>Semua bola adalah <red>BOLA MERAH</red>.',
    ],

    navTexts: [
      "Ketuk \u00BB untuk melihat kejadian kurang mungkin pada skala.",
      "Ketuk \u00BB untuk melihat kejadian mungkin pada skala.",
      "Ketuk \u00BB untuk melihat kejadian lebih mungkin pada skala.",
      "Ketuk \u00BB untuk melihat kejadian pasti pada skala.",
      "Ketuk \u00BB untuk merangkum.",
    ],

    images: [
      "assets/1.png",
      "assets/2.png",
      "assets/3.png",
      "assets/4.png",
      "assets/5.png",
    ],

    summaryLabels: [
      '<red>MERAH</red> =<br><i>Nol</i>',
      '<red>MERAH</red> =<br><i>Paling sedikit</i>',
      '<red>MERAH</red> =<br><i>Bukan paling sedikit<br>atau banyak</i>',
      '<red>MERAH</red> =<br><i>Paling banyak</i>',
      '<red>MERAH</red> =<br><i>Semua</i>',
    ],

    summary: {
      heading: "Skala Probabilitas",
      eventText: 'Kejadian = Mendapatkan <red>BOLA MERAH</red>',
      footerText: "Ketuk \u2018Mulai Ulang\u2019 untuk mengulangi.",
      buttonText: "Mulai Ulang",
    },
  },
};

const APP_DATA = DATA[current_language];
