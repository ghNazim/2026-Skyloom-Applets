

const DATA = {
  en: {
    app: {
      start: {
        heading: "Surface Area of Cylinder",
        text: 'Let\'s explore the formulas to find the curved and total surface areas of cylinder.<br>Tap "Start" to start the activity.',
        buttonText: "Start",
      },
      buttons: {
        unfold: "Unfold",
      },
      equations: {
        curvedSurfaceArea: "Curved Surface area",
        areaOfRectangle: "Area of the rectangle",
        lengthTimesBreadth: "Length × breadth",
        totalSurfaceArea: "Total surface area",
        twoTimesAreaOfCircularBase: "2 × Area of circular base",
        curvedSurfaceAreaShort: "Curved Surface Area",
        twoTimesPiRSquared: "2 × πr²",
        twoTimesPiRH: "2 × πrh",
        twoTimesPiRTimesRPlusH: "2 × πr(r + h)",
        twoPiRTimesH: "2πr × h",
      },
      steps: {
        1: {
          q: "A cylinder has two circular bases and one curved surface that joins them.",
          n: 'Tap "Unfold" to see the net of the cylinder.',
          qAfterUnfold:
            "The net of the cylinder shows two circular bases and one curved surface.",
          nAfterUnfold: "Tap ⟲ to visualise or tap » to continue.",
        },
        2: {
          q: "For a circle with radius <i>r</i>, the circumference is 2π<i>r</i>. So each circular base of the cylinder has circumference 2π<i>r</i>.",
          n: "Tap » to continue.",
        },
        3: {
          q: "The net shows that the circumference of a circular base of a cylinder equals the length of the curved surface.",
          n: "Tap ⟲ to visualise or » to explore curved surface area.",
        },
        4: {
          q: "When we unfold the curved surface of a cylinder, it becomes a rectangle. So, the area of the rectangle is the curved surface area of the cylinder.",
          n: "Tap the correct answer.",
          mcqTitle:
            "What is the length and breadth<br>of the rectangle?",
          options: [
            "Length = <i>h</i><br>Breadth = π<i>r</i>²",
            "Length = 2π<i>r</i><br>Breadth = <i>h</i>",
            "Length = π<i>r</i>²<br>Breadth = <i>r</i>",
          ],
          correct: 1,
          qAfterCorrect:
            "Area of the rectangle is the Curved Surface area of the cylinder.",
          nAfterCorrect: "Tap » to explore the total surface area.",
        },
        5: {
          q: "The total surface area of a cylinder is the sum of the areas of its two circular bases and its curved (lateral) surface.",
          n: "Tap » to continue.",
        },
        6: {
          q: "The total surface area of a cylinder is the sum of the areas of its two circular bases and its curved (lateral) surface.",
          n: "Tap the correct option.",
          mcqTitle:
            "What is the area of a circular<br>base of the cylinder?",
          options: ["π<i>r</i>²", "2π<i>r</i>", "6π<i>r</i>²"],
          correct: 0,
          nAfterCorrect: "Tap » to continue.",
        },
        7: {
          q: "The total surface area of a cylinder is the sum of the areas of its two circular bases and its curved (lateral) surface.",
          n: "Tap » to simplify.",
        },
        8: {
          q: "The total surface area of a cylinder is the sum of the areas of its two circular bases and its curved (lateral) surface.",
          n: "Tap » to summarise.",
        },
      },
      final: {
        heading: "Activity Completed!",
        text:
          "We learned how to calculate the curved surface area and the total surface area of a cylinder using the formula.<br><br>" +
          "<y>Curved Surface Area = 2πrh</y><br>" +
          "<y>Total Surface Area = 2πr(r + h)</y><br><br>" +
          'Tap "Start Over" to restart the activity.',
        buttonText: "Start Over",
        imageAlt: "Cylinder net with area labels",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Luas Permukaan Silinder",
        text: 'Mari kita jelajahi rumus untuk mencari luas permukaan lengkung dan total permukaan silinder.<br>Ketuk "Mulai" untuk memulai aktivitas.',
        buttonText: "Mulai",
      },
      buttons: {
        unfold: "Buka",
      },
      equations: {
        curvedSurfaceArea: "Luas permukaan lengkung",
        areaOfRectangle: "Luas persegi panjang",
        lengthTimesBreadth: "Panjang × lebar",
        totalSurfaceArea: "Luas permukaan total",
        twoTimesAreaOfCircularBase: "2 × Luas alas lingkaran",
        curvedSurfaceAreaShort: "Luas Permukaan Lengkung",
        twoTimesPiRSquared: "2 × πr²",
        twoTimesPiRH: "2 × πrh",
        twoTimesPiRTimesRPlusH: "2 × πr(r + h)",
        twoPiRTimesH: "2πr × h",
      },
      steps: {
        1: {
          q: "Silinder memiliki dua alas lingkaran dan satu permukaan lengkung yang menghubungkannya.",
          n: 'Ketuk "Buka" untuk melihat jaring-jaring silinder.',
          qAfterUnfold:
            "Jaring-jaring silinder menunjukkan dua alas lingkaran dan satu permukaan lengkung.",
          nAfterUnfold: "Ketuk ⟲ untuk memvisualisasikan atau ketuk » untuk melanjutkan.",
        },
        2: {
          q: "Untuk lingkaran dengan jari-jari <i>r</i>, kelilingnya adalah 2π<i>r</i>. Jadi setiap alas lingkaran silinder memiliki keliling 2π<i>r</i>.",
          n: "Ketuk » untuk melanjutkan.",
        },
        3: {
          q: "Jaring-jaring menunjukkan bahwa keliling alas lingkaran silinder sama dengan panjang permukaan lengkung.",
          n: "Ketuk ⟲ untuk memvisualisasikan atau » untuk menjelajahi luas permukaan lengkung.",
        },
        4: {
          q: "Ketika kita membuka permukaan lengkung silinder, itu menjadi persegi panjang. Jadi, luas persegi panjang adalah luas permukaan lengkung silinder.",
          n: "Ketuk jawaban yang benar.",
          mcqTitle:
            "Berapa panjang dan lebar<br>persegi panjang?",
          options: [
            "Panjang = <i>h</i><br>Lebar = π<i>r</i>²",
            "Panjang = 2π<i>r</i><br>Lebar = <i>h</i>",
            "Panjang = π<i>r</i>²<br>Lebar = <i>r</i>",
          ],
          correct: 1,
          qAfterCorrect:
            "Luas persegi panjang adalah luas permukaan lengkung silinder.",
          nAfterCorrect: "Ketuk » untuk menjelajahi luas permukaan total.",
        },
        5: {
          q: "Luas permukaan total silinder adalah jumlah luas kedua alas lingkaran dan permukaan lengkung (lateral) nya.",
          n: "Ketuk » untuk melanjutkan.",
        },
        6: {
          q: "Luas permukaan total silinder adalah jumlah luas kedua alas lingkaran dan permukaan lengkung (lateral) nya.",
          n: "Ketuk opsi yang benar.",
          mcqTitle:
            "Berapa luas alas lingkaran<br>silinder?",
          options: ["π<i>r</i>²", "2π<i>r</i>", "6π<i>r</i>²"],
          correct: 0,
          nAfterCorrect: "Ketuk » untuk melanjutkan.",
        },
        7: {
          q: "Luas permukaan total silinder adalah jumlah luas kedua alas lingkaran dan permukaan lengkung (lateral) nya.",
          n: "Ketuk » untuk menyederhanakan.",
        },
        8: {
          q: "Luas permukaan total silinder adalah jumlah luas kedua alas lingkaran dan permukaan lengkung (lateral) nya.",
          n: "Ketuk » untuk merangkum.",
        },
      },
      final: {
        heading: "Aktivitas Selesai!",
        text:
          "Kita telah mempelajari cara menghitung luas permukaan lengkung dan luas permukaan total silinder menggunakan rumus.<br><br>" +
          "<y>Luas Permukaan Lengkung = 2πrh</y><br>" +
          "<y>Luas Permukaan Total = 2πr(r + h)</y><br><br>" +
          'Ketuk "Mulai Lagi" untuk memulai ulang aktivitas.',
        buttonText: "Mulai Lagi",
        imageAlt: "Jaring-jaring silinder dengan label luas",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
