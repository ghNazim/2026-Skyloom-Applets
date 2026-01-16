const current_language = "en";

const appData = {
  en: {
    // Navigation button texts
    navButtonStart: "Start",
    navButtonNext: "»",
    navButtonStartOver: "Start Over",

    // Step -1 - Intro splash screen
    stepIntro: {
      question: "Distance between any 2 points",
      navText: "",
      contentText:
        "2 points can be connected in\nmany different ways.\n\nLet's explore what makes a\nline segment special.",
    },

    // Step 0 - Line drawing (draw line segment AB)
    step0: {
      question: "Joining Points <y>in Space</y>",
      questionAfterDraw: "This is a Line Segment connecting points A and B.",
      navText: "Drag from one of the points to the other",
      navTextAfterDraw: "Tap the 'Connect…' Button",
      infoText:
        "<div>Connect\nPoint A to Point B to make\nthe line segment <ol>AB</ol>.</div>",
      infoTextAfterDraw:
        "<div>Good Job!\nYou've made a continuous\nstraight connection -\nLine Segment <ol>AB</ol></div>",
      actionButtonText: "Connect A and B\nwith Curves",
    },

    // Step 1 - Random curves comparison
    step1: {
      question: "What is the difference between these connections?",
      questionCompare: "Which connection is the shortest?",
      questionFinal:
        "Straight Connection is the shortest distance between 2 points.",
      navText: "Tap 'Compare…' Button",
      navTextCompare: "Tap the correct connection at the blinking circle",
      navTextFinal: "Tap » to make your own curved scribbles",
      infoText:
        "We've added 2 curves connecting points A and B. These are not straight, and hence are not line segments.\n\nWe can see that these are of different lengths if we straighten them out…",
      infoTextCompare: "Which of these connections is the SHORTEST?",
      infoTextFinal:
        "<div><span class='highlight-green'>Line Segment <ol>AB</ol></span> is the\nshortest distance\nbetween the 2 points\nA and B.\n\nTry this comparison again\nwith different curves.</div>",
      actionButtonText: "Compare lengths of the connections",
    },

    // Step 2 - User scribbles comparison
    step2: {
      question: "Connect points A and B with curves.",
      questionCompare: "Which connection is the shortest?",
      questionFinal:
        "Straight Connection is always the shortest distance between 2 points.",
      navText: "Drag to make curved scribbles, then tap the button",
      navTextOneScribble: "Make another curve connection, or tap the button",
      navTextTwoScribbles: "Tap the 'Compare' button",
      navTextCompare: "Tap the correct connection at the blinking circle",
      navTextFinal: "Tap » to summarise",
      infoText:
        "Draw any 2 curved connections between points A and B to compare the lengths of connections.",
      infoTextCompare: "Which of these connections is the SHORTEST?",
      infoTextFinal:
        "<div>Line Segment <ol>AB</ol> will always be the shortest distance between the 2\npoints A and B.</div>",
    },

    // Step 3 - Final splash screen
    step3: {
      question: "Line Segment is the shortest distance between points.",
      navText: "Activity Completed!",
      contentText:
        "A <span class='highlight-yellow'>straight continuous connection</span>\nbetween two <span class='highlight-orange'>points</span> is called a <span class='highlight-yellow'>line\nsegment</span>. This will be the shortest\ndistance between the points,\ncompared to all the <span class='highlight-pink'>curved\nconnections</span> we can make!",
    },

    // Common strings
    lineSegmentLabel: "LINE SEGMENT",
  },
  id: {
    // Navigation button texts
    navButtonStart: "Mulai",
    navButtonNext: "»",
    navButtonStartOver: "Mulai Lagi",

    // Step -1 - Intro splash screen
    stepIntro: {
      question: "Jarak antara 2 titik",
      navText: "",
      contentText:
        "2 titik dapat dihubungkan dengan\nbanyak cara berbeda.\n\nMari kita jelajahi apa yang membuat\nruas garis istimewa.",
    },

    // Step 0 - Line drawing (draw line segment AB)
    step0: {
      question: "Menghubungkan Titik <y>dalam Ruang</y>",
      questionAfterDraw:
        "Ini adalah Ruas Garis yang menghubungkan titik A dan B.",
      navText: "Seret dari salah satu titik ke titik lainnya",
      navTextAfterDraw: "Ketuk Tombol 'Hubungkan…'",
      infoText:
        "<div>Hubungkan\nTitik A ke Titik B untuk membuat\nruas garis <ol>AB</ol>.</div>",
      infoTextAfterDraw:
        "<div>Bagus!\nAnda telah membuat koneksi\nlurus yang kontinu -\nRuas Garis <ol>AB</ol></div>",
      actionButtonText: "Hubungkan A dan B\ndengan Kurva",
    },

    // Step 1 - Random curves comparison
    step1: {
      question: "Apa perbedaan antara koneksi-koneksi ini?",
      questionCompare: "Koneksi mana yang paling pendek?",
      questionFinal: "Koneksi Lurus adalah jarak terpendek antara 2 titik.",
      navText: "Ketuk Tombol 'Bandingkan…'",
      navTextCompare: "Ketuk koneksi yang benar pada lingkaran berkedip",
      navTextFinal: "Ketuk » untuk membuat coretan melengkung Anda sendiri",
      infoText:
        "Kami telah menambahkan 2 kurva\nyang menghubungkan titik A dan\nB. Ini tidak lurus,\ndan karenanya bukan ruas\ngaris.\n\nKita dapat melihat bahwa ini\nberbeda panjangnya jika kita\nmeluruskannya…",
      infoTextCompare: "Manakah dari koneksi\nini yang PALING\nPENDEK?",
      infoTextFinal:
        "<div><span class='highlight-green'>Ruas Garis <ol>AB</ol></span> adalah\njarak terpendek\nantara 2 titik\nA dan B.\n\nCoba perbandingan ini lagi\ndengan kurva berbeda.</div>",
      actionButtonText: "Bandingkan panjang\nkoneksi",
    },

    // Step 2 - User scribbles comparison
    step2: {
      question: "Hubungkan titik A dan B dengan kurva.",
      questionCompare: "Koneksi mana yang paling pendek?",
      questionFinal:
        "Koneksi Lurus selalu merupakan jarak terpendek antara 2 titik.",
      navText: "Seret untuk membuat coretan melengkung, lalu ketuk tombol",
      navTextOneScribble: "Buat koneksi kurva lain, atau ketuk tombol",
      navTextTwoScribbles: "Ketuk tombol 'Bandingkan'",
      navTextCompare: "Ketuk koneksi yang benar",
      navTextFinal: "Ketuk » untuk merangkum",
      infoText:
        "Gambar 2 koneksi melengkung\nantara titik A dan B untuk\nmembandingkan panjang\nkoneksi.",
      infoTextCompare: "Manakah dari koneksi\nini yang PALING\nPENDEK?",
      infoTextFinal:
        "<div>Ruas Garis <ol>AB</ol> akan\nselalu menjadi jarak\nterpendek antara 2\ntitik A dan B.</div>",
    },

    // Step 3 - Final splash screen
    step3: {
      question: "Ruas Garis adalah jarak terpendek antara titik-titik.",
      navText: "Aktivitas Selesai!",
      contentText:
        "<span class='highlight-yellow'>Koneksi lurus yang kontinu</span>\nantara dua <span class='highlight-orange'>titik</span> disebut <span class='highlight-yellow'>ruas\ngaris</span>. Ini akan menjadi jarak\nterpendek antara titik-titik,\ndibandingkan dengan semua <span class='highlight-pink'>koneksi\nmelengkung</span> yang dapat kita buat!",
    },

    // Common strings
    lineSegmentLabel: "RUAS GARIS",
  },
};

const APP_DATA = appData[current_language];
