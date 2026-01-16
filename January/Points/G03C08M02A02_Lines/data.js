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
      navTextAfterExtend: "Move the slider to the left-most point",
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
        '<div class="info-box">Line PQ or QP passes\nstraight through points\nP and Q and extends\nforever on both sides.</div><div class="info-box">Line Segment PQ\nis <y>a part</y> of Line PQ.\n\nThat\'s why PQ is called\na <y>line segment</y></div>',
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
      question: "Lines",
      navText: "",
      contentText:
        "Segment refers to a part of something.\nLet's explore what geometrical figure a\nline segment is a part of by recalling a Ray…",
    },
    // Step 0 - Ray AB with arrow
    step0: {
      question: "Going beyond a Ray",
      navText: "Tap » to continue",
      infoText:
        "This is a ray AB which\nstarts at A and extends\nforever towards B.\nThe arrow means the\nfigure extends forever in\nthat direction…",
    },
    // Step 1 - Extend beyond A button
    step1: {
      question: "Going beyond a Ray",
      navText: "Tap the 'Extend' Button",
      navTextAfterExtend: "Move the slider to the left-most point",
      navTextAfterSlider: "Tap » to continue",
      infoText: "What if we did not have a\nstarting point in this\nfigure?",
      infoTextAfterExtend:
        "This figure seems to\nextend forever on both\nsides, in the direction\nconnecting points A and B.\nZoom out to see if there\nare any endpoints",
      actionButtonText: "Extend beyond A",
    },
    // Step 2 - No endpoints at all
    step2: {
      question: "No endpoints at all, only a direction.",
      navText: "Tap » to represent this line",
      infoText:
        "This figure does not have\nany start or end, but is a\nstraight connection between A and B.\nThis is called a Line.\nCan you guess how this\ncan be represented?",
    },
    // Step 3 - Representing a Line with double-arrow
    step3: {
      question: "Representing a Line with a double-arrow",
      navText: "Tap » to name this line",
      infoText:
        "Arrows on either end to\nsay it extends forever!\nGuess how the line\ncan be named…",
    },
    // Step 4 - Naming a Line
    step4: {
      question: "Naming a Line",
      navText: "Tap one point, then the other",
      navTextAfterFirstTap: "Tap the double-arrow line",
      navTextAfterDoubleArrow: "Tap » to continue",
      infoText:
        "We need any 2 points on a\nline to name it.\nThat gives us a direction.",
      infoTextAfterFirstTap:
        '<div class="info-box"><y>Letters</y> - Any 2 points on line</div><div class="info-box">A little double-arrow\nsymbol says it is a LINE...</div>',
      infoTextAfterDoubleArrow:
        '<div class="info-box"><y>Letters</y> - Any 2 points on line</div><div class="info-box"><y>Symbol</y> - double-arrow</div><div class="info-box">Line AB passes straight\nthrough points A and B\nand extends forever\non both sides.</div>',
    },
    // Step 5 - Show LINE AB or BA
    step5: {
      question: "Naming a Line",
      navText: "Tap » to find a Line Segment",
      infoText:
        '<div class="info-box"><y>Letters</y> - Any 2 points on line</div><div class="info-box"><y>Symbol</y> - double-arrow</div><div class="info-box">Line AB or BA passes\nstraight through points A\nand B and extends forever\non both sides.</div>',
    },
    // Step 6 - Line and Line Segment
    step6: {
      question: "Line and Line Segment",
      navText: "Tap the line at any 2 points",
      navTextAfterPoints: "Tap » to summarise",
      infoText:
        '<div class="info-box">A line extends straight\nforever on both sides in a\nparticular direction.</div><div class="info-box">Any 2 points on the line\nmark a segment of the line\nwith a fixed length.</div>',
      infoTextAfterPoints:
        '<div class="info-box">Line PQ or QP passes\nstraight through points\nP and Q and extends\nforever on both sides.</div><div class="info-box">Line Segment PQ\nis a part of Line PQ.\nThat\'s why PQ is called\na line segment</div>',
    },
    // Step 7 - Final splash screen
    step7: {
      question: "Line and Line Segment",
      navText: "Activity Complete!",
      contentText:
        "A line is a straight connection\nbetween 2 points and extending\nforever on both sides.\nDouble-Arrow symbol\nindicates a Line.\nThe part of the line without\nextending it beyond the points\nmakes a line segment!",
    },
    // Common strings
    lineLabel: "LINE",
    linePlaceholder: "__",
  },
};

const APP_DATA = appData[current_language];
