const current_language = "en";

const appData = {
  en: {
    // Navigation button texts
    navButtonStart: "Start",
    navButtonNext: "»",
    navButtonStartOver: "Start Over",

    // Step -1 - Intro splash screen
    stepIntro: {
      question: "<y>Rays</y>",
      navText: "",
      contentText:
        "When we have 2 ENDPOINTS \njoined with a straight connection, \nthat makes a line segment.\n\n Let's explore the geometrical\n figure we get when we go beyond\n one of the points.",
    },
    // Step 0 - Draggable points and connect button
    step0: {
      question: `In between <y>the Endpoints</y>`,
      navText: "Move the points around, then tap the button",
      navTextAfterConnect: "Tap the 'Extend' Button",
      navTextAfterExtend: "Move the slider all the way to the left",
      navTextAfterSlider: "Tap » to continue",
      infoText:
        "We know that all the points between 2 endpoints make a line segment. <br><br>Let's visualise connecting the two end points A and B shown here…",
      infoTextAfterConnect:
        "<div>Notice that the line segment <ol>AB</ol> ends at points A and B.<br><br> But, what if we did not stop at B?</div>",
      infoTextAfterExtend:
        "<div>This figure <y>starts</y> at point A, but <y>does not end</y> at point B… <br><br>Use the slider to zoom the image to see where it ends…</div>",
      actionButtonText: "Connect A to B",
      actionButtonTextExtend: "Extend beyond Point B",
      lineName: "LINE SEGMENT <ol>AB</ol> or <ol>BA</ol>",
    },
    // Step 1 - Ray introduction
    step1: {
      question: "This figure is a <y>Ray</y>",
      navText: "Tap » to understand how to represent a ray",
      infoText:
        "<div>This <y>starts</y> at point A, but <y>does not end</y> at all… It <y>extends forever</y>… This is called a RAY.</div>",
    },
    // Step 2 - Arrow representation
    step2: {
      question: "Representing a <y>Ray</y> with a <y>single-arrow</y>",
      navText: "Tap » to name the ray",
      infoText:
        "We show the extending part with an arrow, indicating it extends forever in that direction. \n\nA Ray has a starting point and extends forever in a particular direction.",
    },
    // Step 3 - Naming ray - starting point
    step3: {
      question: "<y>Naming</y> a Ray",
      navText: "Tap the correct point as per the question",
      navTextAfter: "Tap » to continue",
      infoText: "Which is the starting point of this Ray?",
      feedbackWrong:
        "Oops… The Ray extends on both sides of B. Look for the point that has the ray on one side only…",
      feedbackCorrect:
        "That's Correct! The Ray starts at A. This is first letter in naming the Ray.",
    },
    // Step 4 - Naming ray - direction point
    step4: {
      question: "<y>Naming</y> a Ray",
      navText: "Read what's given, then tap » to continue",
      infoText: `<div class="info-box"><y>First Letter</y> - Starting Point</div><div class='info-box'>What direction does the ray extend from A? We need another point somewhere along the ray.</div>`,
    },
    // Step 5 - Naming ray - arrow symbol
    step5: {
      question: "<y>Naming</y> a Ray",
      navText: "Tap the Arrow Mark",
      navTextAfter: "Tap » to continue",
      infoText:
        '<div class="info-box"><y>First Letter</y> - Starting Point</div><div class="info-box"><y>Second Letter</y> - Another point on the Ray, for direction</div><div class="info-box">Tap the arrow mark for the symbol of the ray.</div>',
      infoTextAfter: `<div class="info-box"><y>First Letter</y> - Starting Point</div><div class="info-box"><y>Second Letter</y> - Another point on the Ray, for direction</div><div class="info-box"><y>Arrow Symbol</y> - Arrow to the right, above the letters.</div><div class="info-box">Ray ${arrow(
        "AB"
      )} starts at A and extends forever in the direction from A to B.</div>`,
    },
    // Step 6 - MCQ about order of letters
    step6: {
      question: "<y>Order of letters</y> while naming a Ray",
      navText: "Read what's given, then tap » to continue",
      navTextAfter: "Tap » to summarise",
      infoText: `<div class="info-box">First Letter - Starting Point</div><div class="info-box">Second Letter - Another point on the Ray, for direction</div><div class="info-box">Arrow Symbol - Arrow to the right, above the letters.</div><div class="info-box">Ray ${arrow(
        "AB"
      )} starts at A and extends forever in the direction from A to B. Ray ${arrow(
        "BA"
      )} starts at B and extends forever towards A.</div>`,
      mcq: {
        title: `Do you think we can name this Ray as ${arrow(
          "BA"
        )} instead of ${arrow("AB")}?`,
        options: ["Yes", "No"],
        feedbacks: {
          wrong: `Oops… The first letter should always be the starting point… ${arrow(
            "BA"
          )} is a ray starting at B`,
          correct: "Correct!",
        },
        correctAnswer: 1, // Index 1 = "No"
      },
    },
    // Step 7 - Final splash screen
    step7: {
      question: "<y>Rays</y>",
      navText: "Activity Completed!",
      contentText:
        "Ray is a straight connection <yellow>starting at a point</yellow> and extending forever towards <blue>another point</blue>.\n\n Right Arrow symbol indicates a Ray",
    },
    // Common strings
    rayLabel: "RAY",
    rayPlaceholder: "__",
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
        "Segala sesuatu dalam Geometri terbuat dari titik….  Mari kita letakkan titik-titik bersebelahan dan lihat apa yang muncul…",
    },
    // Step 0 - Scribble drawing
    step0: {
      question: "<y>Menghubungkan Titik</y> dalam Ruang",
      navText: "Seret dari salah satu titik ke titik lainnya",
      infoText:
        "Hubungkan Titik A ke Titik B dengan menggambar coretan di antara keduanya…",
    },
    // Step 1 - MCQ about straight line
    step1: {
      question: "Apakah ini Jarak Lurus antara Titik-titik?",
      navText: "Ketuk tombol yang benar sesuai pertanyaan",
      navTextAfter: "Ketuk » untuk membuat koneksi lurus",
      mcq: {
        title:
          "Bagus. Anda telah membuat koneksi kontinu antara titik A dan B. Apakah coretan ini LURUS?",
        options: ["Ya", "Tidak"],
        feedbacks: {
          wrong:
            "Ups! Kami melihat bahwa coretan yang ditunjukkan di sini memiliki bagian melengkung, dan tidak menghubungkan A dan B dengan lurus!",
          correct:
            "Benar! Kami melihat bahwa coretan yang ditunjukkan di sini memiliki bagian melengkung, dan tidak menghubungkan A dan B dengan lurus!",
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
        "Ini disebut ruas garis.    Ruas garis tidak memiliki bagian melengkung.",
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
        "Untuk memberi nama ruas garis, kita menulis nama  titik-titik bersebelahan.",
      infoTextAfter:
        "Huruf - <y>Titik Ujung</y>   Simbol garis kecil menunjukkan bahwa ini adalah RUAS GARIS..",
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
        "Koneksi lurus antara dua titik disebut ruas garis.   Ruas garis diberi nama dengan menulis nama titik ujungnya bersebelahan di bawah simbol garis.",
    },
    // Common strings
    rayLabel: "SINAR",
    rayPlaceholder: "__",
  },
};

const APP_DATA = appData[current_language];
