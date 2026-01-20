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
      navTextAfterExtend: "Move the slider all the way to the right",
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
      question: "<y>Sinar</y>",
      navText: "",
      contentText:
        "Ketika kita memiliki 2 TITIK UJUNG \nyang dihubungkan dengan koneksi lurus, \nitu membuat ruas garis.\n\n Mari kita jelajahi bangun\n geometri yang kita dapatkan ketika kita melampaui\n salah satu titik.",
    },
    // Step 0 - Draggable points and connect button
    step0: {
      question: `Di antara <y>Titik-titik Ujung</y>`,
      navText: "Pindahkan titik-titik di sekitar, lalu ketuk tombol",
      navTextAfterConnect: "Ketuk Tombol 'Perpanjang'",
      navTextAfterExtend: "Gerakkan penggeser sepenuhnya ke kanan",
      navTextAfterSlider: "Ketuk » untuk melanjutkan",
      infoText:
        "Kita tahu bahwa semua titik di antara 2 titik ujung membuat ruas garis. <br><br>Mari kita visualisasikan menghubungkan dua titik ujung A dan B yang ditunjukkan di sini…",
      infoTextAfterConnect:
        "<div>Perhatikan bahwa ruas garis <ol>AB</ol> berakhir di titik A dan B.<br><br> Tapi, bagaimana jika kita tidak berhenti di B?</div>",
      infoTextAfterExtend:
        "<div>Gambar ini <y>dimulai</y> di titik A, tetapi <y>tidak berakhir</y> di titik B… <br><br>Gunakan penggeser untuk memperbesar gambar untuk melihat di mana ia berakhir…</div>",
      actionButtonText: "Hubungkan A ke B",
      actionButtonTextExtend: "Perpanjang melampaui Titik B",
      lineName: "RUAS GARIS <ol>AB</ol> atau <ol>BA</ol>",
    },
    // Step 1 - Ray introduction
    step1: {
      question: "Gambar ini adalah sebuah <y>Sinar</y>",
      navText: "Ketuk » untuk memahami cara merepresentasikan sinar",
      infoText:
        "<div>Ini <y>dimulai</y> di titik A, tetapi <y>tidak berakhir</y> sama sekali… Ia <y>meluas selamanya</y>… Ini disebut SINAR.</div>",
    },
    // Step 2 - Arrow representation
    step2: {
      question: "Merepresentasikan <y>Sinar</y> dengan <y>panah-tunggal</y>",
      navText: "Ketuk » untuk memberi nama sinar",
      infoText:
        "Kita menunjukkan bagian yang memanjang dengan panah, menunjukkan bahwa ia memanjang selamanya ke arah itu. \n\nSebuah Sinar memiliki titik awal dan memanjang selamanya ke arah tertentu.",
    },
    // Step 3 - Naming ray - starting point
    step3: {
      question: "<y>Memberi Nama</y> Sinar",
      navText: "Ketuk titik yang benar sesuai pertanyaan",
      navTextAfter: "Ketuk » untuk melanjutkan",
      infoText: "Manakah titik awal dari Sinar ini?",
      feedbackWrong:
        "Ups… Sinar memanjang di kedua sisi B. Cari titik yang memiliki sinar di satu sisi saja…",
      feedbackCorrect:
        "Itu Benar! Sinar dimulai di A. Ini adalah huruf pertama dalam penamaan Sinar.",
    },
    // Step 4 - Naming ray - direction point
    step4: {
      question: "<y>Memberi Nama</y> Sinar",
      navText: "Baca apa yang diberikan, lalu ketuk » untuk melanjutkan",
      infoText: `<div class="info-box"><y>Huruf Pertama</y> - Titik Awal</div><div class='info-box'>Ke arah mana sinar memanjang dari A? Kita membutuhkan titik lain di suatu tempat sepanjang sinar.</div>`,
    },
    // Step 5 - Naming ray - arrow symbol
    step5: {
      question: "<y>Memberi Nama</y> Sinar",
      navText: "Ketuk Tanda Panah",
      navTextAfter: "Ketuk » untuk melanjutkan",
      infoText:
        '<div class="info-box"><y>Huruf Pertama</y> - Titik Awal</div><div class="info-box"><y>Huruf Kedua</y> - Titik lain pada Sinar, untuk arah</div><div class="info-box">Ketuk tanda panah untuk simbol sinar.</div>',
      infoTextAfter: `<div class="info-box"><y>Huruf Pertama</y> - Titik Awal</div><div class="info-box"><y>Huruf Kedua</y> - Titik lain pada Sinar, untuk arah</div><div class="info-box"><y>Simbol Panah</y> - Panah ke kanan, di atas huruf.</div><div class="info-box">Sinar ${arrow(
        "AB"
      )} dimulai di A dan memanjang selamanya ke arah dari A ke B.</div>`,
    },
    // Step 6 - MCQ about order of letters
    step6: {
      question: "<y>Urutan huruf</y> saat memberi nama Sinar",
      navText: "Baca apa yang diberikan, lalu ketuk » untuk melanjutkan",
      navTextAfter: "Ketuk » untuk merangkum",
      infoText: `<div class="info-box">Huruf Pertama - Titik Awal</div><div class="info-box">Huruf Kedua - Titik lain pada Sinar, untuk arah</div><div class="info-box">Simbol Panah - Panah ke kanan, di atas huruf.</div><div class="info-box">Sinar ${arrow(
        "AB"
      )} dimulai di A dan memanjang selamanya ke arah dari A ke B. Sinar ${arrow(
        "BA"
      )} dimulai di B dan memanjang selamanya menuju A.</div>`,
      mcq: {
        title: `Apakah menurut Anda kita dapat menamai Sinar ini sebagai ${arrow(
          "BA"
        )} alih-alih ${arrow("AB")}?`,
        options: ["Ya", "Tidak"],
        feedbacks: {
          wrong: `Ups… Huruf pertama harus selalu menjadi titik awal… ${arrow(
            "BA"
          )} adalah sinar yang dimulai di B`,
          correct: "Benar!",
        },
        correctAnswer: 1, // Index 1 = "No"
      },
    },
    // Step 7 - Final splash screen
    step7: {
      question: "<y>Sinar</y>",
      navText: "Aktivitas Selesai!",
      contentText:
        "Sinar adalah koneksi lurus <yellow>dimulai dari sebuah titik</yellow> dan memanjang selamanya menuju <blue>titik lain</blue>.\n\n Simbol Panah Kanan menunjukkan Sinar",
    },
    // Common strings
    rayLabel: "SINAR",
    rayPlaceholder: "__",
  },
};

const APP_DATA = appData[current_language];
