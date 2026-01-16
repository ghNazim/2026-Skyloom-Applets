const current_language = "en";

const appData = {
  en: {
    // Navigation button texts
    navButtonStart: "Start",
    navButtonNext: "»",
    navButtonStartOver: "Start Over",

    // Step -1 - Intro splash screen
    stepIntro: {
      question: "Point",
      navText: "",
      contentText:
        "Everything in Geometry\nis made of points….\nLet's explore some\nproperties of points,\nand how to name them…",
    },
    // Step 0 (Step 1) - Region clicking states
    step0: {
      blue: {
        question: "A Point in Space - find one in the BLUE region",
        navText: "Tap anywhere in the BLUE region",
        infoText:
          "You see different regions on the screen. \n\nTap anywhere in the BLUE region.",
      },
      purple: {
        question: "A Point in Space - find one in the PURPLE region",
        navText: "Tap anywhere in the PURPLE region",
        infoText:
          "Good Job! You found a point that is located in that spot.\n\nTap anywhere in the PURPLE region.",
      },
      yellowOrange: {
        question: "Find points in the YELLOW and ORANGE regions",
        navText: "Tap anywhere in the YELLOW or ORANGE regions",
        infoText:
          "Good Job! You located another point.\n\nNow, find points in the\nYELLOW and ORANGE\nregions…",
      },
      complete: {
        question: "A <y>Point</y> is a <y>location</y>",
        navText: "Tap » to represent these points visually",
        infoText:
          "Good Job!\n\nA POINT is nothing but a\nlocation…\n\nBut, this is hard to see…",
      },
    },
    // Step 1 (Step 2)
    step1: {
      question: "A <y>DOT</y> is used to represent a <y>Point</y> - a <y>location</y>",
      navText: "Tap » to continue",
      infoText: "We use DOTS to represent\npoints, just so we can see\nthem…",
    },
    // Step 2 (Step 3) - Splash screen
    step2: {
      question: "<y>Point</y> - a <y>Location</y> marker",
      navText: "Tap » to explore another property",
      contentText:
        "A point marks a\nparticular location in space.\n\nWe use a dot to visually\nrepresent a point.",
    },
    // Step 3 (Step 4)
    step3: {
      question: "How big is a <y>Point</y>?",
      navText: "Drag the slider to the left-most",
      infoText:
        "You see the shape? It occupies some space inside…\n\n<y>Move the slider to 'shrink' this shape so it occupies less and less space</y>.",
      infoTextAfter:
        "We see that there is something at that location that <y>occupies no space</y>, and <y>has no shape</y>…\n\nIt is simply a location somewhere - a <y>POINT</y>.",
      navTextAfter: "Tap » to continue",
    },
    // Step 4 (Step 5) - Splash screen
    step4: {
      question: "A <y>Point</y> has <y>No Size</y> and <y>No Shape</y>",
      navText: "Tap » to explore naming a point",
      contentText:
        "We might use a circle or a DOT\nto REPRESENT a point, but a\nPOINT has NO SIZE and NO SHAPE.",
    },
    // Step 5 (Step 6) - MCQ
    step5: {
      question: "<y>Which Point</y> is which?",
      navText: "Tap the correct button as per the question",
      questionAfter: "A <y>Point</y> can be given a <y>NAME</y>",
      navTextAfter: "Tap » to continue",
      mcq: {
        title:
          "You see two points here…\nHow do we differentiate\nbetween the points?",
        options: ["Color the points", "Name the points", "We can't say"],
        feedbacks: [
          "Oops! Coloring will work\non this screen, but what\nabout a notebook?\nWe can't differentiate\npoints by color always…",
          "That's Right!\nWe name the points so\nwe can tell them apart!\nPoints can be named with\nCapital Letters like A, B, C,\nP, Q, R, X, Y, Z, etc.,",
          "Oops! We can clearly see\nthat the points are both in\ndifferent locations, the\npoints are different.\nThere is a way to tell them\napart… Try again…",
        ],
        correctAnswer: "Name the points",
      },
    },
    // Step 6 (Step 7) - Splash screen
    step6: {
      question: "Naming a <y>Point</y>",
      navText: "Tap » to summarise",
      contentText:
        "Points can be named with\nCapital Letters like\nA, B, C, P, Q, R, X, Y, Z, etc.\nwritten next to a dot.\n\nThis helps us differentiate\nbetween points and refer to\nspecific locations in space!",
    },
    // Step 7 (Step 8) - Final splash screen
    step7: {
      question: "<y>Properties</y> of a <y>Point</y>",
      navText: "Activity Completed!",
      boxes: [
        "A point marks a\nparticular <y>location</y> in space.",
        "A point has\n<y>no size</y> and <y>no shape</y>.",
        "Points can be <y>named</y> with\n<y>Capital Letters</y> like\nA, B, C, P, Q, R, X, Y, Z, etc.\nwritten <y>next to a dot</y>.",
      ],
    },
  },
};

const APP_DATA = appData[current_language];
