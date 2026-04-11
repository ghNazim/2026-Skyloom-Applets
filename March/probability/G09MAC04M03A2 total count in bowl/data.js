const DATA = {
  en: {
    scalePositions: [
      { label: "Impossible\nevent", dotColor: "#e53935" },
      { label: "Less likely\nevent", dotColor: "#fb8c00" },
      { label: "Equally likely\nevent", dotColor: "#fdd835" },
      { label: "More likely\nevent", dotColor: "#29b6f6" },
      { label: "Certain\nevent", dotColor: "#66bb6a" },
    ],

    intro: {
      heading: "The Probability Scale",
      text: "From left to right \u2013<br><y>Count increases \u2192 Probability increases</y><br>Is this <y>always</y> true?<br><br>Tap \u2018Start\u2019 to explore.",
      buttonText: "Start",
    },

    introScaleBg: {
      columns: [
        {
          dotColor: "#e53935",
          labelHtml:
            "Getting a <red>RED</red> ball is an\n<sc1>impossible event</sc1>",
        },
        {
          dotColor: "#fb8c00",
          labelHtml:
            "Getting a <red>RED</red> ball is an\n<sc2>less likely event</sc2>",
        },
        {
          dotColor: "#fdd835",
          labelHtml:
            "Getting a <red>RED</red> ball is an\n<sc3>equally likely event</sc3>",
        },
        {
          dotColor: "#29b6f6",
          labelHtml:
            "Getting a <red>RED</red> ball is an\n<sc4>more likely event</sc4>",
        },
        {
          dotColor: "#66bb6a",
          labelHtml:
            "Getting a <red>RED</red> ball is an\n<sc5>certain event</sc5>",
        },
      ],
    },

    splash: {
      heading: "Probability & Total Count",
      image: "assets/bowl1.png",
      text: "We learned that having more <red>RED</red> balls means<br>a higher probability of picking <red>RED</red>.<br><br>But what if we keep <red>RED</red> the same \u2013<br>and add other balls instead?<br><br>Will the probability of picking <red>RED</red> stay the same,<br>go up, or go down? Let\u2019s find out!",
      navText: "Tap \u00BB to see how probability changes.",
    },

    interactiveNavText: "Tap the correct place on the line.",

    labels: {
      red: "RED",
      total: "TOTAL",
    },

    steps: [
      {
        image: "assets/bowl1.png",
        redCount: 4,
        totalCount: 4,
        correctPosition: 5,
        initialFeedback: "",
        wrongFeedback: "All 4 balls are RED.\nYou will get RED every\nsingle time.",
        eventText: "Event: Getting a <red>RED</red> ball at random",
        extraText: "Where does this event sit on the probability scale?",
        correctExtraText: "Since all balls are RED, picking a RED ball\nat random is a <sc5>certain event</sc5>.",
        correctNavText: "Tap \u00BB to add the first 2 balls.",
        wrongText: "Not here,\nTry again!",
      },
      {
        image: "assets/bowl2.png",
        redCount: 4,
        totalCount: 6,
        correctPosition: 4,
        initialFeedback: "We added 2 BLUE balls.\nRED is still 4.",
        wrongFeedback: "RED balls are more in number than\nBLUE. What does that tell you about\nthe chance?",
        eventText: "Event: Getting a <red>RED</red> ball at random",
        extraText: "Where does this event sit on the probability scale?",
        correctExtraText: "Since RED balls are more in number, the chance of\ngetting a RED ball is high \u2013 hence this event is <sc4>more\nlikely</sc4>.",
        correctNavText: "Tap \u00BB to add the next 2 balls.",
        wrongText: "Not here,\nTry again!",
      },
      {
        image: "assets/bowl3.png",
        redCount: 4,
        totalCount: 8,
        correctPosition: 3,
        initialFeedback: "We added 2 GREEN balls.\nRED is still 4.",
        wrongFeedback: "RED and not-RED balls are equal in\nnumber. What does that tell you\nabout the chance?",
        eventText: "Event: Getting a <red>RED</red> ball at random",
        extraText: "Where does this event sit on the probability scale?",
        correctExtraText: "Since RED and not-RED balls are equal in number, the\nchance of getting a RED ball is medium \u2013 hence this event\nis <sc3>equally likely</sc3>.",
        correctNavText: "Tap \u00BB to add the next 2 balls.",
        wrongText: "Not here,\nTry again!",
      },
      {
        image: "assets/bowl4.png",
        redCount: 4,
        totalCount: 10,
        correctPosition: 2,
        initialFeedback: "We added 2 YELLOW balls.\nRED is still 4.",
        wrongFeedback: "RED balls are fewer in number than\nthe rest. What does that tell you\nabout the chance?",
        eventText: "Event: Getting a <red>RED</red> ball at random",
        extraText: "Where does this event sit on the probability scale?",
        correctExtraText: "Since RED balls are fewer in number than non-RED balls,\nthe chance of getting a RED ball is low \u2013 hence this event is\n<sc2>less likely</sc2>.",
        correctNavText: "Tap \u00BB to see what happened.",
        wrongText: "Not here,\nTry again!",
      },
    ],

    splash2: {
      heading: "What Just Happened?",
      scaleColumns: [
        {
          dotColor: "#e53935",
          labelHtml:
            "<span style=\"color:#e53935;font-weight:700\">Impossible<br>event</span>",
        },
        {
          dotColor: "#fb8c00",
          labelHtml:
            "<span style=\"color:#fb8c00;font-weight:700\">Less likely<br>event</span>",
        },
        {
          dotColor: "#fdd835",
          labelHtml:
            "<span style=\"color:#fdd835;font-weight:700\">Equally likely<br>event</span>",
        },
        {
          dotColor: "#29b6f6",
          labelHtml:
            "<span style=\"color:#29b6f6;font-weight:700\">More likely<br>event</span>",
        },
        {
          dotColor: "#66bb6a",
          labelHtml:
            "<span style=\"color:#66bb6a;font-weight:700\">Certain<br>event</span>",
        },
      ],
      visualImages: [
        null,
        "assets/bowl4.png",
        "assets/bowl3.png",
        "assets/bowl2.png",
        "assets/bowl1.png",
      ],
      arrowLeftLabel: "Less likely",
      arrowRightLabel: "Certain",
      summaryHtml:
        "<red>RED</red> started at <sc5>certain</sc5> and drifted all the way to <sc2>less likely</sc2>.<br>But we never changed the <red>RED</red> balls \u2013 they stayed at 4!<br><y>So what changed?</y>",
      navText: "Tap \u00BB to see the answer.",
    },

    splash3: {
      heading: "The Key Idea",
      leftTitle: "What we want",
      leftImage: "assets/101.png",
      leftCount: "4",
      leftFooter: "\u2713 Stayed the same",
      rightTitle: "Everything in the bowl",
      sequenceImages: [
        "assets/101.png",
        "assets/102.png",
        "assets/103.png",
        "assets/104.png",
      ],
      sequenceCounts: ["4", "6", "8", "10"],
      rightFooter: "Total number of balls changed",
      summaryHtml:
        "As non-<red>RED</red> balls were added, the chance of getting a <red>RED</red> ball <y>reduced</y> \u2014<br>because the chance is now shared among more balls.<br><br><y><strong>Probability depends on both:</strong></y> what we want AND everything in the bowl",
      navText: "Tap \u00BB to conclude.",
    },

    complete: {
      heading: "Probability & Total Count \u2013 Complete!",
      boxedHtml:
        "Probability does not just depend on what we want.<br><y>It also depends on everything in the bowl.</y><br>Change either one, and the event moves<br>on the probability scale.",
      instructionText: "Tap \u2018Start Over\u2019 to repeat this activity.",
      buttonText: "Start Over",
    },
  },

  id: {
    scalePositions: [
      { label: "Kejadian\nmustahil", dotColor: "#e53935" },
      { label: "Kejadian\nkurang mungkin", dotColor: "#fb8c00" },
      { label: "Kejadian\nsama mungkin", dotColor: "#fdd835" },
      { label: "Kejadian\nlebih mungkin", dotColor: "#29b6f6" },
      { label: "Kejadian\npasti", dotColor: "#66bb6a" },
    ],

    intro: {
      heading: "Skala Probabilitas",
      text: "Dari kiri ke kanan \u2013<br><y>Jumlah naik \u2192 Probabilitas naik</y><br>Apakah ini <y>selalu</y> benar?<br><br>Ketuk \u2018Mulai\u2019 untuk menjelajah.",
      buttonText: "Mulai",
    },

    introScaleBg: {
      columns: [
        {
          dotColor: "#e53935",
          labelHtml:
            "Mendapat bola <red>MERAH</red> adalah\n<sc1>kejadian mustahil</sc1>",
        },
        {
          dotColor: "#fb8c00",
          labelHtml:
            "Mendapat bola <red>MERAH</red> adalah\n<sc2>kejadian kurang mungkin</sc2>",
        },
        {
          dotColor: "#fdd835",
          labelHtml:
            "Mendapat bola <red>MERAH</red> adalah\n<sc3>kejadian sama mungkin</sc3>",
        },
        {
          dotColor: "#29b6f6",
          labelHtml:
            "Mendapat bola <red>MERAH</red> adalah\n<sc4>kejadian lebih mungkin</sc4>",
        },
        {
          dotColor: "#66bb6a",
          labelHtml:
            "Mendapat bola <red>MERAH</red> adalah\n<sc5>kejadian pasti</sc5>",
        },
      ],
    },

    splash: {
      heading: "Probabilitas & Jumlah Total",
      image: "assets/bowl1.png",
      text: "Kita belajar bahwa lebih banyak bola <red>MERAH</red> berarti<br>probabilitas memilih <red>MERAH</red> lebih tinggi.<br><br>Tetapi bagaimana jika jumlah <red>MERAH</red> tetap \u2013<br>dan kita menambah bola lain?<br><br>Apakah probabilitas memilih <red>MERAH</red> tetap sama,<br>naik, atau turun? Mari cari tahu!",
      navText: "Ketuk \u00BB untuk melihat bagaimana probabilitas berubah.",
    },

    interactiveNavText: "Ketuk posisi yang benar pada garis.",

    labels: {
      red: "MERAH",
      total: "TOTAL",
    },

    steps: [
      {
        image: "assets/bowl1.png",
        redCount: 4,
        totalCount: 4,
        correctPosition: 5,
        initialFeedback: "",
        wrongFeedback:
          "Keempat bola adalah MERAH.\nAnda akan selalu mendapat MERAH.",
        eventText: "Kejadian: Mendapat bola <red>MERAH</red> secara acak",
        extraText: "Di mana kejadian ini pada skala probabilitas?",
        correctExtraText:
          "Karena semua bola MERAH, memilih bola MERAH\nsecara acak adalah <sc5>kejadian pasti</sc5>.",
        correctNavText: "Ketuk \u00BB untuk menambah 2 bola pertama.",
        wrongText: "Bukan di sini,\nCoba lagi!",
      },
      {
        image: "assets/bowl2.png",
        redCount: 4,
        totalCount: 6,
        correctPosition: 4,
        initialFeedback: "Kita menambah 2 bola BIRU.\nMERAH tetap 4.",
        wrongFeedback:
          "Bola MERAH lebih banyak dari\nBIRU. Apa artinya untuk\npeluangnya?",
        eventText: "Kejadian: Mendapat bola <red>MERAH</red> secara acak",
        extraText: "Di mana kejadian ini pada skala probabilitas?",
        correctExtraText:
          "Karena bola MERAH lebih banyak, peluang mendapat\nbola MERAH tinggi \u2013 jadi kejadian ini <sc4>lebih\nmungkin</sc4>.",
        correctNavText: "Ketuk \u00BB untuk menambah 2 bola berikutnya.",
        wrongText: "Bukan di sini,\nCoba lagi!",
      },
      {
        image: "assets/bowl3.png",
        redCount: 4,
        totalCount: 8,
        correctPosition: 3,
        initialFeedback: "Kita menambah 2 bola HIJAU.\nMERAH tetap 4.",
        wrongFeedback:
          "Bola MERAH dan bukan-MERAH sama banyaknya.\nApa artinya untuk\npeluangnya?",
        eventText: "Kejadian: Mendapat bola <red>MERAH</red> secara acak",
        extraText: "Di mana kejadian ini pada skala probabilitas?",
        correctExtraText:
          "Karena bola MERAH dan bukan-MERAH sama banyaknya,\npeluang mendapat bola MERAH sedang \u2013 jadi kejadian ini\n<sc3>sama mungkin</sc3>.",
        correctNavText: "Ketuk \u00BB untuk menambah 2 bola berikutnya.",
        wrongText: "Bukan di sini,\nCoba lagi!",
      },
      {
        image: "assets/bowl4.png",
        redCount: 4,
        totalCount: 10,
        correctPosition: 2,
        initialFeedback: "Kita menambah 2 bola KUNING.\nMERAH tetap 4.",
        wrongFeedback:
          "Bola MERAH lebih sedikit dari\nyang lain. Apa artinya untuk\npeluangnya?",
        eventText: "Kejadian: Mendapat bola <red>MERAH</red> secara acak",
        extraText: "Di mana kejadian ini pada skala probabilitas?",
        correctExtraText:
          "Karena bola MERAH lebih sedikit dari bola bukan-MERAH,\npeluang mendapat bola MERAH rendah \u2013 jadi kejadian ini\n<sc2>kurang mungkin</sc2>.",
        correctNavText: "Ketuk \u00BB untuk melihat yang terjadi.",
        wrongText: "Bukan di sini,\nCoba lagi!",
      },
    ],

    splash2: {
      heading: "Apa yang Terjadi?",
      scaleColumns: [
        {
          dotColor: "#e53935",
          labelHtml:
            "<span style=\"color:#e53935;font-weight:700\">Kejadian<br>mustahil</span>",
        },
        {
          dotColor: "#fb8c00",
          labelHtml:
            "<span style=\"color:#fb8c00;font-weight:700\">Kejadian<br>kurang mungkin</span>",
        },
        {
          dotColor: "#fdd835",
          labelHtml:
            "<span style=\"color:#fdd835;font-weight:700\">Kejadian<br>sama mungkin</span>",
        },
        {
          dotColor: "#29b6f6",
          labelHtml:
            "<span style=\"color:#29b6f6;font-weight:700\">Kejadian<br>lebih mungkin</span>",
        },
        {
          dotColor: "#66bb6a",
          labelHtml:
            "<span style=\"color:#66bb6a;font-weight:700\">Kejadian<br>pasti</span>",
        },
      ],
      visualImages: [
        null,
        "assets/bowl4.png",
        "assets/bowl3.png",
        "assets/bowl2.png",
        "assets/bowl1.png",
      ],
      arrowLeftLabel: "Kurang mungkin",
      arrowRightLabel: "Pasti",
      summaryHtml:
        "<red>MERAH</red> mulai di <sc5>pasti</sc5> lalu bergeser hingga <sc2>kurang mungkin</sc2>.<br>Tapi jumlah bola <red>MERAH</red> tidak berubah \u2013 tetap 4!<br><y>Jadi, apa yang berubah?</y>",
      navText: "Ketuk \u00BB untuk melihat jawabannya.",
    },

    splash3: {
      heading: "Ide Utama",
      leftTitle: "Yang kita inginkan",
      leftImage: "assets/101.png",
      leftCount: "4",
      leftFooter: "\u2713 Tetap sama",
      rightTitle: "Semua isi mangkuk",
      sequenceImages: [
        "assets/101.png",
        "assets/102.png",
        "assets/103.png",
        "assets/104.png",
      ],
      sequenceCounts: ["4", "6", "8", "10"],
      rightFooter: "Jumlah total bola berubah",
      summaryHtml:
        "Saat bola non-<red>MERAH</red> ditambahkan, peluang mendapat bola <red>MERAH</red> <y>menyusut</y> \u2014<br>karena peluang itu kini dibagi oleh lebih banyak bola.<br><br><y><strong>Probabilitas bergantung pada keduanya:</strong></y> yang kita inginkan DAN semua isi mangkuk",
      navText: "Ketuk \u00BB untuk menyelesaikan.",
    },

    complete: {
      heading: "Probabilitas & Jumlah Total \u2013 Selesai!",
      boxedHtml:
        "Probabilitas tidak hanya bergantung pada yang kita inginkan.<br><y>Ini juga bergantung pada semua isi mangkuk.</y><br>Ubah salah satunya, maka kejadian akan bergerak<br>di skala probabilitas.",
      instructionText: "Ketuk \u2018Mulai Ulang\u2019 untuk mengulangi aktivitas ini.",
      buttonText: "Mulai Ulang",
    },
  },
};

const APP_DATA = DATA[current_language];
