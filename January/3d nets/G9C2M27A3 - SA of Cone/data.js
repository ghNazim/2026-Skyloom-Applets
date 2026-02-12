const DATA = {
  en: {
    app: {
      start: {
        heading: "Surface Area of Cone",
        text:
          "Let's explore the formulas to find the curved and total surface areas of cone.<br>Tap \"Start\" to start the activity.",
        buttonText: "Start",
      },
      buttons: {
        unfold: "Unfold",
      },
      equations: {
        areaOfSector: "Area of sector",
        arcLength: "Arc length",
        circumferenceOfCircle: "Circumference of circle",
        areaOfCircle: "Area of circle",
        curvedSurfaceArea: "Curved Surface Area",
        totalSurfaceArea: "Total Surface Area",
        areaOfBase: "Area of Base",
        piRSquared: "πr²",
        totalFinalFormula: "πr² + πrl",
      },
      steps: {
        1: {
          q: "A cone has a circular base and a curved (lateral) surface.",
          n: 'Tap "Unfold" to see the net of the cone.',
          mediaSrc: "assets/folded.png",
          videoSrc: "assets/cone.mp4",
          imageAfterVideo: "assets/unfolded1.png",
          qAfterUnfold:
            "The net of the cone shows a circular base and a curved (lateral) surface.",
          nAfterUnfold: "Tap » to explore the surface area of the cone.",
        },
        2: {
          q: "Let's identify the curved surface of the cone.",
          n: "Tap the correct answer.",
          nAfterCorrect: "Tap » to continue.",
          mediaSrc: "assets/unfolded1.png",
          mcqTitle:
            "The curved surface of a cone corresponds to which part of a circle?",
          options: ["Semicircle", "Circumference", "Sector"],
          correct: 2,
        },
        3: {
          q: "The net shows that the arc length of the sector is the circumference of the circular base of the cone.",
          n: "Tap » to continue.",
          mediaSrc: "assets/unfolded2.png",
        },
        4: {
          q: "Also, the sector of the cone is the curved surface area of the cone.",
          n: "Tap » to continue.",
          mediaSrc: "assets/unfoldedHsector.png",
        },
        5: {
          q: "We need to find the area of sector to find the curved surface area.",
          n: "Tap » to continue.",
          mediaSrc: "assets/sector.png",
        },
        6: {
          q: "We learned that, the area of a sector depends on its arc length.",
          n: "Tap » to simplify.",
          mediaSrc: "assets/sectorWhite.png",
          equation: "sectorFormula",
        },
        7: {
          q: "Let's find each term in the formula.",
          n: "Tap on each term.",
          nAfterAllSubstituted: "Tap » to simplify.",
          mediaSrc: "assets/sectorWhite.png",
          equation: "sectorInteractive",
          interactiveTerms: [
            { key: "arcLength", labelKey: "arcLength", value: "2πr", feedbackImage: "assets/sectorHarc.png" },
            { key: "circumference", labelKey: "circumferenceOfCircle", value: "2πl", feedbackImage: "assets/sectorHPeri.png" },
            { key: "areaOfCircle", labelKey: "areaOfCircle", value: "πl²", feedbackImage: "assets/sectorHarea.png" },
          ],
        },
        8: {
          q: "Area of sector of a cone is the curved surface area of cone.",
          n: "Tap » to simplify.",
          mediaSrc: "assets/sectorWhite.png",
          equation: "sectorSimplified",
        },
        9: {
          q: "Total surface area is the sum of the areas of the base and curved surface.",
          n: "Tap » to continue.",
          mediaSrc: "assets/unfolded1.png",
          equation: "totalFormula",
        },
        10: {
          q: "Let's find the area of the base.",
          n: "Tap the correct answer.",
          nAfterCorrect: "Tap » to simplify.",
          mediaSrc: "assets/unfoldedHbase.png",
          equation: "totalWithBase",
          equationAfterCorrect: "totalWithBaseSubstituted",
          mcqTitle: "What is the area of the base of the cone?",
          options: ["2πr", "½ πr²", "πr²"],
          correct: 2,
          visualFeedbackPerOption: ["assets/mcq2opt1.png", "assets/mcq2opt2.png", "assets/mcq2opt3.png"],
        },
        11: {
          q: "Let's find the area of the base.",
          n: "Tap » to summarise.",
          mediaSrc: "assets/unfolded1.png",
          equation: "totalFinal",
        },
      },
      final: {
        heading: "Activity Completed!",
        text:
          "Curved surface area and the total surface area of a cone can be calculated using the following formulas.<br><br>" +
          "<y>Curved Surface Area = πrl</y><br>" +
          "<y>Total Surface Area = πr² + πrl</y><br><br>" +
          'Tap "Start Over" to restart the activity.',
        buttonText: "Start Over",
        imageSrc: "assets/unfolded1.png",
        imageAlt: "Net of cone",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Luas Permukaan Kerucut",
        text:
          "Mari kita jelajahi rumus untuk mencari luas permukaan lengkung dan total permukaan kerucut.<br>Ketuk \"Mulai\" untuk memulai aktivitas.",
        buttonText: "Mulai",
      },
      buttons: {
        unfold: "Buka",
      },
      equations: {
        areaOfSector: "Luas sektor",
        arcLength: "Panjang busur",
        circumferenceOfCircle: "Keliling lingkaran",
        areaOfCircle: "Luas lingkaran",
        curvedSurfaceArea: "Luas Permukaan Lengkung",
        totalSurfaceArea: "Luas Permukaan Total",
        areaOfBase: "Luas Alas",
        piRSquared: "πr²",
        totalFinalFormula: "πr² + πrl",
      },
      steps: {
        1: {
          q: "Kerucut memiliki alas lingkaran dan permukaan lengkung (lateral).",
          n: 'Ketuk "Buka" untuk melihat jaring-jaring kerucut.',
          mediaSrc: "assets/folded.png",
          videoSrc: "assets/cone.mp4",
          imageAfterVideo: "assets/unfolded1.png",
          qAfterUnfold:
            "Jaring-jaring kerucut menunjukkan alas lingkaran dan permukaan lengkung (lateral).",
          nAfterUnfold: "Ketuk » untuk menjelajahi luas permukaan kerucut.",
        },
        2: {
          q: "Mari kita identifikasi permukaan lengkung kerucut.",
          n: "Ketuk jawaban yang benar.",
          nAfterCorrect: "Ketuk » untuk melanjutkan.",
          mediaSrc: "assets/unfolded1.png",
          mcqTitle:
            "Permukaan lengkung kerucut sesuai dengan bagian lingkaran mana?",
          options: ["Setengah lingkaran", "Keliling", "Sektor"],
          correct: 2,
        },
        3: {
          q: "Jaring-jaring menunjukkan bahwa panjang busur sektor adalah keliling alas lingkaran kerucut.",
          n: "Ketuk » untuk melanjutkan.",
          mediaSrc: "assets/unfolded2.png",
        },
        4: {
          q: "Juga, sektor kerucut adalah luas permukaan lengkung kerucut.",
          n: "Ketuk » untuk melanjutkan.",
          mediaSrc: "assets/unfoldedHsector.png",
        },
        5: {
          q: "Kita perlu mencari luas sektor untuk mencari luas permukaan lengkung.",
          n: "Ketuk » untuk melanjutkan.",
          mediaSrc: "assets/sector.png",
        },
        6: {
          q: "Kita belajar bahwa luas sektor bergantung pada panjang busurnya.",
          n: "Ketuk » untuk menyederhanakan.",
          mediaSrc: "assets/sectorWhite.png",
          equation: "sectorFormula",
        },
        7: {
          q: "Mari kita cari setiap suku dalam rumus.",
          n: "Ketuk setiap suku.",
          nAfterAllSubstituted: "Ketuk » untuk menyederhanakan.",
          mediaSrc: "assets/sectorWhite.png",
          equation: "sectorInteractive",
          interactiveTerms: [
            { key: "arcLength", labelKey: "arcLength", value: "2πr", feedbackImage: "assets/sectorHarc.png" },
            { key: "circumference", labelKey: "circumferenceOfCircle", value: "2πl", feedbackImage: "assets/sectorHPeri.png" },
            { key: "areaOfCircle", labelKey: "areaOfCircle", value: "πl²", feedbackImage: "assets/sectorHarea.png" },
          ],
        },
        8: {
          q: "Luas sektor kerucut adalah luas permukaan lengkung kerucut.",
          n: "Ketuk » untuk menyederhanakan.",
          mediaSrc: "assets/sectorWhite.png",
          equation: "sectorSimplified",
        },
        9: {
          q: "Luas permukaan total adalah jumlah luas alas dan permukaan lengkung.",
          n: "Ketuk » untuk melanjutkan.",
          mediaSrc: "assets/unfolded1.png",
          equation: "totalFormula",
        },
        10: {
          q: "Mari kita cari luas alas.",
          n: "Ketuk jawaban yang benar.",
          nAfterCorrect: "Ketuk » untuk menyederhanakan.",
          mediaSrc: "assets/unfoldedHbase.png",
          equation: "totalWithBase",
          equationAfterCorrect: "totalWithBaseSubstituted",
          mcqTitle: "Berapa luas alas kerucut?",
          options: ["2πr", "½ πr²", "πr²"],
          correct: 2,
          visualFeedbackPerOption: ["assets/mcq2opt1.png", "assets/mcq2opt2.png", "assets/mcq2opt3.png"],
        },
        11: {
          q: "Mari kita cari luas alas.",
          n: "Ketuk » untuk merangkum.",
          mediaSrc: "assets/unfolded1.png",
          equation: "totalFinal",
        },
      },
      final: {
        heading: "Aktivitas Selesai!",
        text:
          "Luas permukaan lengkung dan luas permukaan total kerucut dapat dihitung menggunakan rumus berikut.<br><br>" +
          "<y>Luas Permukaan Lengkung = πrl</y><br>" +
          "<y>Luas Permukaan Total = πr² + πrl</y><br><br>" +
          'Ketuk "Mulai Lagi" untuk memulai ulang aktivitas.',
        buttonText: "Mulai Lagi",
        imageSrc: "assets/unfolded1.png",
        imageAlt: "Jaring-jaring kerucut",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
