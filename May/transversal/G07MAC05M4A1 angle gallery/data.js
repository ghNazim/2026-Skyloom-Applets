const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Properties of Angle Pairs",
        text: "Angle pairs exhibit special properties\nwhen a transversal intersects two parallel lines.\n\nTap start to explore!",
        buttonText: "Start",
      },
      step1: {
        questionText: "Angle Pairs formed by Parallel Lines and a Transversal",
      },
      gallery: {
        selectText: "Select a type of pair to explore\u2026",
        allVisitedText:
          "Select a type of pair to explore again, or tap \u00BB to summarise",
        completedNavText: "Activity Completed",
        summaryQuestionText:
          "Properties of Angle Pairs - Parallel Lines and a Transversal",
        equalRowTitle: "Angle pairs of\nequal measure",
        sum180RowTitle: "Angle pairs that\nsum to 180\u00B0",
        startOverText: "Start Over",
      },
      cards: {
        linear: "Linear Pair",
        vertical: "Vertical",
        corresponding: "Corresponding",
        alternateInterior: "Alternate Interior",
        alternateExterior: "Alternate Exterior",
        coInterior: "Co-interior angles",
        coExterior: "Co-exterior angles",
      },
      vertical: {
        questionText:
          "Shout out the names of a vertically opposite pair of angles\u2026",
        navText: "Tap any angle to compare its measure with its vertical angle",
        navTextAfter:
          "Tap any other angle, or tap \u00BB for another type of pair",
        navTextDone: "Tap \u00BB for another type",
        feedback: "Vertical angles are equal\nin measure!",
      },
      coInterior: {
        questionText: "Shout out the names of a co-interior pair of angles…",
        navText: "Tap an interior angle to see its co-interior pair",
        navTextWait: "Tap the resultant angle (sum of co-interior angles)",
        navTextAfter:
          "Tap any other angle, or tap \u00BB for another type of pair",
        navTextDone: "Tap \u00BB for another type",
        feedback: "Co-interior angles\nadd up to 180\u00B0",
      },
      linear: {
        questionText:
          "Linear pairs are adjacent angles that form a straight line.",
        navText: "Tap any angle to see its linear pair",
        navTextWait: "Tap the resultant angle (sum of the linear pair)",
        navTextAfter:
          "Tap any other angle, or tap \u00BB for another type of pair",
        navTextDone: "Tap \u00BB for another type",
        feedback: "Linear pairs\nadd up to 180\u00B0",
      },
      coExterior: {
        questionText:
          "Shout out the names of a co-exterior pair of angles\u2026",
        navText: "Tap an exterior angle to see its co-exterior pair",
        navTextWait: "Tap the resultant angle (sum of co-exterior angles)",
        navTextAfter:
          "Tap any other angle, or tap \u00BB for another type of pair",
        navTextDone: "Tap \u00BB for another type",
        feedback: "Co-exterior angles\nadd up to 180\u00B0",
      },
      corresponding: {
        questionText:
          "Shout out the names of a corresponding pair of angles\u2026",
        navText:
          "Tap any angle to see its corresponding angle at the other intersection",
        navTextAfter:
          "Tap any other angle, or tap \u00BB for another type of pair",
        navTextDone: "Tap \u00BB for another type",
        feedback: "Corresponding angles are\n equal in measure!",
      },
      alternateInterior: {
        questionText:
          "Shout out the names of an alternate interior pair of angles\u2026",
        navText: "Tap an interior angle to see its alternate interior pair",
        navTextAfter:
          "Tap any other angle, or tap \u00BB for another type of pair",
        navTextDone: "Tap \u00BB for another type",
        feedback: "Alternate interior angles \n are equal in measure!",
      },
      alternateExterior: {
        questionText:
          "Shout out the names of an alternate exterior pair of angles\u2026",
        navText: "Tap an exterior angle to see its alternate exterior pair",
        navTextAfter:
          "Tap any other angle, or tap \u00BB for another type of pair",
        navTextDone: "Tap \u00BB for another type",
        feedback: "Alternate exterior angles \n are equal in measure!",
      },
      labels: {
        angle: "\u2220",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Sifat Pasangan Sudut",
        text: "Pasangan sudut memiliki sifat khusus\nketika garis transversal memotong dua garis sejajar.\n\nKetuk mulai untuk menjelajahi!",
        buttonText: "Mulai",
      },
      step1: {
        questionText:
          "Pasangan Sudut yang Dibentuk oleh Garis Sejajar dan Transversal",
      },
      gallery: {
        selectText: "Pilih jenis pasangan untuk dijelajahi\u2026",
        allVisitedText:
          "Pilih jenis pasangan untuk dijelajahi lagi, atau ketuk \u00BB untuk merangkum",
        completedNavText: "Aktivitas Selesai",
        summaryQuestionText:
          "Sifat Pasangan Sudut - Garis Sejajar dan Transversal",
        equalRowTitle: "Pasangan sudut dengan\nukuran sama",
        sum180RowTitle: "Pasangan sudut yang\nberjumlah 180\u00B0",
        startOverText: "Mulai Lagi",
      },
      cards: {
        linear: "Pasangan Linear",
        vertical: "Bertolak Belakang",
        corresponding: "Sehadap",
        alternateInterior: "Dalam Berseberangan",
        alternateExterior: "Luar Berseberangan",
        coInterior: "Dalam Sepihak",
        coExterior: "Luar Sepihak",
      },
      vertical: {
        questionText:
          "Sebutkan nama pasangan sudut yang bertolak belakang\u2026",
        navText:
          "Ketuk sudut mana pun untuk membandingkan ukurannya dengan sudut bertolak belakangnya",
        navTextAfter:
          "Ketuk sudut lain, atau ketuk \u00BB untuk jenis pasangan lain",
        navTextDone: "Ketuk \u00BB untuk jenis lain",
        feedback: "Sudut bertolak belakang\nmemiliki ukuran yang sama!",
      },
      coInterior: {
        questionText:
          "Sudut dalam sepihak berada di antara garis sejajar, di sisi yang sama dari transversal.",
        navText: "Ketuk sudut dalam untuk melihat pasangan dalam sepihaknya",
        navTextWait: "Ketuk sudut hasil (jumlah sudut dalam sepihak)",
        navTextAfter:
          "Ketuk sudut lain, atau ketuk \u00BB untuk jenis pasangan lain",
        navTextDone: "Ketuk \u00BB untuk jenis lain",
        feedback: "Sudut dalam sepihak\nberjumlah 180\u00B0",
      },
      linear: {
        questionText:
          "Pasangan linear adalah sudut bersebelahan yang membentuk garis lurus.",
        navText: "Ketuk sudut mana pun untuk melihat pasangan linearnya",
        navTextWait: "Ketuk sudut hasil (jumlah pasangan linear)",
        navTextAfter:
          "Ketuk sudut lain, atau ketuk \u00BB untuk jenis pasangan lain",
        navTextDone: "Ketuk \u00BB untuk jenis lain",
        feedback: "Pasangan linear\nberjumlah 180\u00B0",
      },
      coExterior: {
        questionText: "Sebutkan nama pasangan sudut luar sepihak\u2026",
        navText: "Ketuk sudut luar untuk melihat pasangan luar sepihaknya",
        navTextWait: "Ketuk sudut hasil (jumlah sudut luar sepihak)",
        navTextAfter:
          "Ketuk sudut lain, atau ketuk \u00BB untuk jenis pasangan lain",
        navTextDone: "Ketuk \u00BB untuk jenis lain",
        feedback: "Sudut luar sepihak\nberjumlah 180\u00B0",
      },
      corresponding: {
        questionText: "Sebutkan nama pasangan sudut sehadap\u2026",
        navText:
          "Ketuk sudut mana pun untuk melihat sudut sehadapnya di perpotongan lain",
        navTextAfter:
          "Ketuk sudut lain, atau ketuk \u00BB untuk jenis pasangan lain",
        navTextDone: "Ketuk \u00BB untuk jenis lain",
        feedback: "Sudut sehadap\nmemiliki ukuran yang sama!",
      },
      alternateInterior: {
        questionText: "Sebutkan nama pasangan sudut dalam berseberangan\u2026",
        navText:
          "Ketuk sudut dalam untuk melihat pasangan dalam berseberangannya",
        navTextAfter:
          "Ketuk sudut lain, atau ketuk \u00BB untuk jenis pasangan lain",
        navTextDone: "Ketuk \u00BB untuk jenis lain",
        feedback: "Sudut dalam berseberangan\nmemiliki ukuran yang sama!",
      },
      alternateExterior: {
        questionText: "Sebutkan nama pasangan sudut luar berseberangan\u2026",
        navText:
          "Ketuk sudut luar untuk melihat pasangan luar berseberangannya",
        navTextAfter:
          "Ketuk sudut lain, atau ketuk \u00BB untuk jenis pasangan lain",
        navTextDone: "Ketuk \u00BB untuk jenis lain",
        feedback: "Sudut luar berseberangan\nmemiliki ukuran yang sama!",
      },
      labels: {
        angle: "\u2220",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
