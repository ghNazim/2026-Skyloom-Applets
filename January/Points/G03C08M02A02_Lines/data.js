const current_language = "en";

const appData = {
  en: {
    // Navigation button texts
    navButtonStart: "Start",
    navButtonNext: "»",
    navButtonStartOver: "Start Over",

    // Step -1 - Intro splash screen
    stepIntro: {
      question: "<y>Lines</y>",
      navText: "",
      contentText:
        "Segment refers to a part of something.\n\nLet's explore what geometrical figure a\nline segment is a part of by recalling a Ray…",
    },
    // Step 0 - Ray AB with arrow
    step0: {
      question: "Going beyond <y>a Ray</y>",
      navText: "Tap » to continue",
      infoText:
        `<div>This is a ray ${doubleArrow("AB")} which\n<yellow>starts at A</yellow> and <blue>extends\nforever towards B</blue>.\n\nThe arrow means the\nfigure extends forever in\nthat direction…</div>`,
    },
    // Step 1 - Extend beyond A button
    step1: {
      question: "Going beyond <y>a Ray</y>",
      navText: "Tap the 'Extend' Button",
      navTextAfterExtend: "Move the slider to the right-most point",
      navTextAfterSlider: "Tap » to continue",
      infoText: "What if we did not have a\nstarting point in this\nfigure?",
      infoTextAfterExtend:
        "This figure seems to\nextend forever on both\nsides, in the direction\nconnecting points A and B.\n\nZoom out to see if there\nare any endpoints",
      actionButtonText: "Extend beyond A",
    },
    // Step 2 - No endpoints at all
    step2: {
      question: "<y>No endpoints</y> at all, only a <y>direction</y>.",
      navText: "Tap » to represent this line",
      infoText:
        "This figure does not have\nany start or end, but is a\nstraight connection between A and B.\n\nThis is called a Line.\n\nCan you guess how this\ncan be represented?",
    },
    // Step 3 - Representing a Line with double-arrow
    step3: {
      question: "Representing a <y>Line</y> with a <y>double-arrow</y>",
      navText: "Tap » to name this line",
      infoText:
        "Arrows on either end to\nsay it extends forever!\n\nGuess how the line\ncan be named…",
    },
    // Step 4 - Naming a Line
    step4: {
      question: "<y>Naming</y> a Line",
      navText: "Tap one point, then the other",
      navTextAfterFirstTap: "Tap the double-arrow line",
      navTextAfterDoubleArrow: "Tap » to continue",
      infoText:
        "We need any 2 points on a\nline to name it.\n\nThat gives us a direction.",
      infoTextAfterFirstTap:
        '<div class="info-box"><y>Letters</y> - Any 2 points on line</div><div class="info-box">A little double-arrow\nsymbol says it is a LINE...</div>',
      infoTextAfterDoubleArrow:
        `<div class="info-box"><y>Letters</y> - Any 2 points on line</div><div class="info-box"><y>Symbol</y> - double-arrow</div><div class="info-box">Line ${doubleArrow("AB")} passes straight\nthrough points A and B\nand extends forever\non both sides.</div>`,
    },
    // Step 5 - Show LINE AB or BA
    step5: {
      question: "<y>Naming</y> a Line",
      navText: "Tap » to find a Line Segment",
      infoText:
        `<div class="info-box"><y>Letters</y> - Any 2 points on line</div><div class="info-box"><y>Symbol</y> - double-arrow</div><div class="info-box">Line ${doubleArrow("AB")} or ${doubleArrow("BA")} passes\nstraight through points A\nand B and extends forever\non both sides.</div>`,
    },
    // Step 6 - Line and Line Segment
    step6: {
      question: "<y>Line</y> and <y>Line Segment</y>",
      navText: "Tap the line at any 2 points",
      navTextAfterPoints: "Tap » to summarise",
      infoText:
        '<div class="info-box">A line extends straight\nforever on both sides in a\nparticular direction.</div><div class="info-box">Any <y>2 points on the line</y>\nmark a <y>segment</y> of the line\nwith <y>a fixed length</y>.</div>',
      infoTextAfterPoints:
        `<div class="info-box">Line PQ or QP passes\nstraight through points\nP and Q and extends\nforever on both sides.</div><div class="info-box">Line Segment <ol>PQ</ol>\nis <y>a part</y> of Line ${doubleArrow("PQ")}.\n\nThat\'s why <ol>PQ</ol> is called\na <y>line segment</y></div>`,
    },
    // Step 7 - Final splash screen
    step7: {
      question: "<y>Line</y> and <y>Line Segment</y>",
      navText: "Activity Complete!",
      contentText:
        "A line is a straight connection <yellow>between 2 points</yellow> and <blue>extending forever on both sides</blue>.\n\nDouble-Arrow symbol indicates a Line.\n\nThe part of the line without extending it beyond the points makes a line segment!",
    },
    // Common strings
    lineLabel: "LINE",
    linePlaceholder: "__",
  },
  id: {
    // Navigation button texts
    navButtonStart: "Mulai",
    navButtonNext: "»",
    navButtonStartOver: "Mulai Lagi",

    // Step -1 - Intro splash screen
    stepIntro: {
      question: "<y>Garis</y>",
      navText: "",
      contentText:
        "Ruas garis mengacu pada bagian dari sesuatu.\n\nMari kita jelajahi bentuk geometri apa yang\nruas garis merupakan bagian darinya dengan mengingat kembali Sinar Garis...",
    },
    // Step 0 - Ray AB with arrow
    step0: {
      question: "Melampaui <y>Sinar Garis</y>",
      navText: "Ketuk » untuk melanjutkan",
      infoText:
        `<div>Ini adalah sinar garis ${doubleArrow("AB")} yang\n<yellow>dimulai dari A</yellow> dan <blue>memanjang\nselamanya ke arah B</blue>.\n\nTanda panah berarti\nbentuk tersebut memanjang selamanya\nke arah itu...</div>`,
    },
    // Step 1 - Extend beyond A button
    step1: {
      question: "Melampaui <y>Sinar Garis</y>",
      navText: "Ketuk Tombol 'Perpanjang'",
      navTextAfterExtend: "Geser penggeser ke titik paling kanan",
      navTextAfterSlider: "Ketuk » untuk melanjutkan",
      infoText: "Bagaimana jika kita tidak memiliki\ntitik awal pada bentuk ini?",
      infoTextAfterExtend:
        "Bentuk ini tampaknya\nmemanjang selamanya di kedua\nsisi, menghubungkan titik A dan B.\n\nPerkecil tampilan untuk melihat apakah ada\ntitik ujung",
      actionButtonText: "Perpanjang melampaui A",
    },
    // Step 2 - No endpoints at all
    step2: {
      question: "<y>Tidak ada titik ujung</y> sama sekali, hanya <y>arah</y>.",
      navText: "Ketuk » untuk menampilkan garis ini",
      infoText:
        "Bentuk ini tidak memiliki\nawal atau akhir, tetapi merupakan\nhubungan lurus antara A dan B.\n\nIni disebut Garis.\n\nBisakah kamu menebak bagaimana ini\nbisa digambarkan?",
    },
    // Step 3 - Representing a Line with double-arrow
    step3: {
      question: "Menggambarkan <y>Garis</y> dengan <y>panah ganda</y>",
      navText: "Ketuk » untuk menamai garis ini",
      infoText:
        "Panah di kedua ujung menunjukkan\nperpanjangan selamanya!\n\nTebak bagaimana garis tersebut\nbisa dinamai...",
    },
    // Step 4 - Naming a Line
    step4: {
      question: "<y>Menamai</y> Garis",
      navText: "Ketuk satu titik, lalu titik lainnya",
      navTextAfterFirstTap: "Ketuk garis panah ganda",
      navTextAfterDoubleArrow: "Ketuk » untuk melanjutkan",
      infoText:
        "Kita membutuhkan 2 titik mana pun pada\ngaris untuk menamainya.\n\nItu memberi kita arah.",
      infoTextAfterFirstTap:
        '<div class="info-box"><y>Huruf</y> - 2 titik mana pun pada garis</div><div class="info-box">Simbol panah ganda kecil\nmenandakan itu adalah GARIS...</div>',
      infoTextAfterDoubleArrow:
        `<div class="info-box"><y>Huruf</y> - 2 titik mana pun pada garis</div><div class="info-box"><y>Simbol</y> - panah ganda</div><div class="info-box">Garis ${doubleArrow("AB")} melewati lurus\ntitik A dan B dan memanjang selamanya\ndi kedua sisi.</div>`,
    },
    // Step 5 - Show LINE AB or BA
    step5: {
      question: "<y>Menamai</y> Garis",
      navText: "Ketuk » untuk menemukan Ruas Garis",
      infoText:
        `<div class="info-box"><y>Huruf</y> - 2 titik mana pun pada garis</div><div class="info-box"><y>Simbol</y> - panah ganda</div><div class="info-box">Garis ${doubleArrow("AB")} atau ${doubleArrow("BA")} melewati\nlurus titik A dan B dan memanjang selamanya\ndi kedua sisi.</div>`,
    },
    // Step 6 - Line and Line Segment
    step6: {
      question: "<y>Garis</y> dan <y>Ruas Garis</y>",
      navText: "Ketuk garis di 2 titik mana saja",
      navTextAfterPoints: "Ketuk » untuk meringkas",
      infoText:
        '<div class="info-box">Garis memanjang lurus\nselamanya di kedua sisi dalam\narah tertentu.</div><div class="info-box">2 titik mana pun pada garis\nmenandai <y>ruas</y> garis\ndengan <y>panjang tetap</y>.</div>',
      infoTextAfterPoints:
        `<div class="info-box">Garis PQ atau QP melewati\nlurus titik P dan Q dan memanjang\nselamanya di kedua sisi.</div><div class="info-box">Ruas Garis <ol>PQ</ol>\nadalah <y>bagian</y> dari Garis ${doubleArrow("PQ")}.\n\nItulah mengapa <ol>PQ</ol> disebut\n<y>ruas garis</y></div>`,
    },
    // Step 7 - Final splash screen
    step7: {
      question: "<y>Garis</y> dan <y>Ruas Garis</y>",
      navText: "Aktivitas Selesai!",
      contentText:
        "Garis adalah hubungan lurus <yellow>antara 2 titik</yellow> dan <blue>memanjang selamanya di kedua sisi</blue>.\n\nSimbol Panah Ganda menunjukkan Garis.\n\nBagian dari garis tanpa memanjangkannya melampaui titik-titik tersebut membuat ruas garis!",
    },
    // Common strings
    lineLabel: "GARIS",
    linePlaceholder: "__",
  },
};

const APP_DATA = appData[current_language];
