const current_language = "en";

const appData = {
  en: {
    // Navigation button texts
    navButtonStart: "Start",
    navButtonNext: "»",
    navButtonStartOver: "Start Over",

    // Step -1 - Intro splash screen
    stepIntro: {
      question: "Point, Ray, Line, Segment",
      navText: "",
      contentText:
        "Everything in Geometry is made of points….\n\nLet's place points next to each other and see what emerges…",
    },
    // Step 0 - Scribble drawing
    step0: {
      question: "<y>Joining Points</y> in Space",
      navText: "Drag from one of the points to the other",
      infoText:
        "Connect\nPoint A to Point B by\ndrawing a scribble\nbetween them…",
    },
    // Step 1 - MCQ about straight line
    step1: {
      question: "Is this the a Straight Distance the Points?",
      navText: "Tap the correct button as per the question",
      navTextAfter: "Tap » to build a straight connection",
      mcq: {
        title:
          "Good Job. You've made a continuous connection between points A and B.\nIs this scribble STRAIGHT?",
        options: ["Yes", "No"],
        feedbacks: {
          wrong:
            "Oops! We see that the\nscribbles shown here have\ncurved parts, and are not\nconnecting A and B\nstraight!",
          correct:
            "That's Right! We see that\nthe scribbles shown here have\ncurved parts, and are not\nconnecting A and B\nstraight!",
        },
        correctAnswer: 1, // Index 1 = "No"
      },
    },
    // Step 2 - Animation showing points forming line
    step2: {
      question: "<y>Straight Distance</y> between 2 Points",
      navText: "Tap » to continue",
      infoText:
        "A straight connection between the two points A and B is like drawing many points next to each other between A and B.",
    },
    // Step 3 - Draggable points
    step3: {
      question:
        "<y>Straight Distance</y> between 2 Points - a <y>Line Segment</y>",
      navText: "Move either point and notice the line segment",
      navTextAfter: "Tap » to name this line segment",
      infoText:
        "This is called a line segment. \n\n A line segment does not have any curved parts.",
      infoTextAfter:
        "A line segment between any 2 points will not have any curved parts.",
    },
    // Step 4 - Naming line segment
    step4: {
      question: "<y>Naming</y> a Line Segment",
      navText: "Tap each point name to bring them together",
      navTextAfter: "Tap the line segment to add the symbol",
      navTextFinal: "Tap » to continue",
      infoText:
        "To name a line segment,\nwe write the name of the\npoints side by side.",
      infoTextAfter:
        "Letters - <y>Endpoints</y>\n\n\nA little dash symbol says it\nis a LINE SEGMENT..",
      infoTextFinal:
        '<div class="info-box">Letters - <y>Endpoints</y></div><div class="info-box">Symbol - <y>dash</y></div>',
    },
    // Step 5 - Summary
    step5: {
      question: "Naming a Line Segment",
      navText: "Tap » to summarise",
      infoText:
        '<div class="info-box">Letters - <y>Endpoints</y></div><div class="info-box">Symbol - <y>dash</y></div><div class="info-box">The order of the points does not matter as both points A and B are end points.</div>',
    },
    // Step 6 - Final splash screen
    step6: {
      question: "Line Segment",
      navText: "Activity Completed!",
      contentText:
        "A straight connection between two points is called a line segment. \n\nLine segments are named by writing the names of their endpoints next to one another under a dash symbol.",
    },
    // Common strings
    lineSegmentLabel: "LINE SEGMENT",
    lineSegmentOr: " or ",
    lineSegmentPlaceholder: "__",
  },
  id: {
    // Navigation button texts
    navButtonStart: "Mulai",
    navButtonNext: "»",
    navButtonStartOver: "Mulai Lagi",

    // Step -1 - Intro splash screen
    stepIntro: {
      question: "Titik, Sinar, Garis, Ruas Garis",
      navText: "",
      contentText:
        "Segala sesuatu dalam Geometri terbuat dari titik….\n\nMari kita letakkan titik-titik bersebelahan dan lihat apa yang muncul…",
    },
    // Step 0 - Scribble drawing
    step0: {
      question: "<y>Menghubungkan Titik</y> dalam Ruang",
      navText: "Seret dari salah satu titik ke titik lainnya",
      infoText:
        "Hubungkan\nTitik A ke Titik B dengan\nmenggambar coretan\ndi antara keduanya…",
    },
    // Step 1 - MCQ about straight line
    step1: {
      question: "Apakah ini Jarak Lurus antara Titik-titik?",
      navText: "Ketuk tombol yang benar sesuai pertanyaan",
      navTextAfter: "Ketuk » untuk membuat koneksi lurus",
      mcq: {
        title:
          "Bagus. Anda telah membuat koneksi kontinu antara titik A dan B.\nApakah coretan ini LURUS?",
        options: ["Ya", "Tidak"],
        feedbacks: {
          wrong:
            "Ups! Kami melihat bahwa\ncoretan yang ditunjukkan di sini memiliki\nbagian melengkung, dan tidak\nmenghubungkan A dan B\ndengan lurus!",
          correct:
            "Benar! Kami melihat bahwa\ncoretan yang ditunjukkan di sini memiliki\nbagian melengkung, dan tidak\nmenghubungkan A dan B\ndengan lurus!",
        },
        correctAnswer: 1, // Index 1 = "Tidak"
      },
    },
    // Step 2 - Animation showing points forming line
    step2: {
      question: "<y>Jarak Lurus</y> antara 2 Titik",
      navText: "Ketuk » untuk melanjutkan",
      infoText:
        "Koneksi lurus antara dua titik A dan B seperti menggambar banyak titik bersebelahan di antara A dan B.",
    },
    // Step 3 - Draggable points
    step3: {
      question: "<y>Jarak Lurus</y> antara 2 Titik - <y>Ruas Garis</y>",
      navText: "Pindahkan salah satu titik dan perhatikan ruas garisnya",
      navTextAfter: "Ketuk » untuk memberi nama ruas garis ini",
      infoText:
        "Ini disebut ruas garis. \n\n Ruas garis tidak memiliki bagian melengkung.",
      infoTextAfter:
        "Ruas garis antara 2 titik tidak akan memiliki bagian melengkung.",
    },
    // Step 4 - Naming line segment
    step4: {
      question: "<y>Memberi Nama</y> Ruas Garis",
      navText: "Ketuk setiap nama titik untuk menyatukannya",
      navTextAfter: "Ketuk ruas garis untuk menambahkan simbol",
      navTextFinal: "Ketuk » untuk melanjutkan",
      infoText:
        "Untuk memberi nama ruas garis,\nkita menulis nama\n titik-titik bersebelahan.",
      infoTextAfter:
        "Huruf - <y>Titik Ujung</y>\n\n\nSimbol garis kecil menunjukkan bahwa ini\nadalah RUAS GARIS..",
      infoTextFinal:
        '<div class="info-box">Huruf - <y>Titik Ujung</y></div><div class="info-box">Simbol - <y>garis</y></div>',
    },
    // Step 5 - Summary
    step5: {
      question: "Memberi Nama Ruas Garis",
      navText: "Ketuk » untuk merangkum",
      infoText:
        '<div class="info-box">Huruf - <y>Titik Ujung</y></div><div class="info-box">Simbol - <y>garis</y></div><div class="info-box">Urutan titik tidak penting karena kedua titik A dan B adalah titik ujung.</div>',
    },
    // Step 6 - Final splash screen
    step6: {
      question: "Ruas Garis",
      navText: "Aktivitas Selesai!",
      contentText:
        "Koneksi lurus antara dua titik disebut ruas garis. \n\nRuas garis diberi nama dengan menulis nama titik ujungnya bersebelahan di bawah simbol garis.",
    },
    // Common strings
    lineSegmentLabel: "RUAS GARIS",
    lineSegmentOr: " atau ",
    lineSegmentPlaceholder: "__",
  },
};

const APP_DATA = appData[current_language];
