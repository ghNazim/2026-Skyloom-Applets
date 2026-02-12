


const DATA = {
  en: {
    app: {
      pageTitle: "Surface Area of a Sphere",
      start: {
        heading: "Surface Area of Sphere",
        text: 'Let\'s explore the formulas to find the Curved surface area of Sphere.<br>Tap "Start" to start the activity.',
        buttonText: "Start",
      },
      buttons: {
        unfold: "Unfold",
      },
      equations: {
        surfaceArea: "Surface area",
        areaOfRectangle: "Area of the rectangle",
        lengthTimesBreadth: "<x>Length</x> × <y>Breadth</y>",
        twoPiRTimesTwoR: "2πr × 2r",
        fourPiRSquared: "4πr²",
        equationEquals: " = ",
      },
      steps: {
        1: {
          q: "Each Sphere can be unfolded into a rectangle.",
          n: 'Tap "Unfold" to see the net of the Sphere.',
        },
        2: {
          q: "The sphere has radius <i>r</i> and diameter 2<i>r</i>.",
          n: "Tap » to continue.",
        },
        3: {
          q: "On unfolding the sphere, it has become a cylinder with radius <i>r</i>, <y>height 2r</y>, and <x>circumference 2πr</x>.",
          n: "Tap » to continue.",
        },
        4: {
          q: "On opening the cylinder, it has become a rectangular surface of <x>length 2π<i>r</i></x> and <y>height 2<i>r</i></y>.",
          n: "Tap » to find the length.",
        },
        5: {
          q: "Surface area of the sphere is the area of transformed rectangle.",
          n: "Tap the correct option.",
          mcqTitle: "What is the area of<br>transformed rectangle?",
          options: ["2π<i>r</i>", "2π<i>r</i> × 2<i>r</i>", "2<i>r</i>"],
          correct: 1,
          nAfterCorrect: "Tap » to simplify.",
        },
        6: {
          q: "Surface area of the sphere is the area of transformed rectangle.",
          n: "Tap » to summarise.",
        },
      },
      final: {
        heading: "Activity Completed!",
        text1: "We learned to find the surface area sphere using the formula.",
        text2:
          '<y>Surface Area of a Sphere = 4πr²</y><br><br>Tap "Start Over" to restart the activity.',
        buttonText: "Start Over",
        imageAlt: "Sphere surface area formula",
      },
    },
  },
  id: {
    app: {
      pageTitle: "Luas Permukaan Bola",
      start: {
        heading: "Luas Permukaan Bola",
        text: 'Mari kita jelajahi rumus untuk mencari luas permukaan bola.<br>Ketuk "Mulai" untuk memulai aktivitas.',
        buttonText: "Mulai",
      },
      buttons: {
        unfold: "Buka",
      },
      equations: {
        surfaceArea: "Luas permukaan",
        areaOfRectangle: "Luas persegi panjang",
        lengthTimesBreadth: "<x>Panjang</x> × <y>Lebar</y>",
        twoPiRTimesTwoR: "2πr × 2r",
        fourPiRSquared: "4πr²",
        equationEquals: " = ",
      },
      steps: {
        1: {
          q: "Setiap bola dapat dibuka menjadi persegi panjang.",
          n: 'Ketuk "Buka" untuk melihat jaring-jaring bola.',
        },
        2: {
          q: "Bola memiliki jari-jari <i>r</i> dan diameter 2<i>r</i>.",
          n: "Ketuk » untuk melanjutkan.",
        },
        3: {
          q: "Saat membuka bola, ia menjadi silinder dengan jari-jari <i>r</i>, <y>tinggi 2r</y>, dan <x>keliling 2πr</x>.",
          n: "Ketuk » untuk melanjutkan.",
        },
        4: {
          q: "Saat membuka silinder, ia menjadi permukaan persegi panjang dengan <x>panjang 2π<i>r</i></x> dan <y>tinggi 2<i>r</i></y>.",
          n: "Ketuk » untuk mencari panjang.",
        },
        5: {
          q: "Luas permukaan bola adalah luas persegi panjang yang ditransformasi.",
          n: "Ketuk opsi yang benar.",
          mcqTitle: "Berapa luas persegi panjang<br>yang ditransformasi?",
          options: ["2π<i>r</i>", "2π<i>r</i> × 2<i>r</i>", "2<i>r</i>"],
          correct: 1,
          nAfterCorrect: "Ketuk » untuk menyederhanakan.",
        },
        6: {
          q: "Luas permukaan bola adalah luas persegi panjang yang ditransformasi.",
          n: "Ketuk » untuk merangkum.",
        },
      },
      final: {
        heading: "Aktivitas Selesai!",
        text1:
          "Kita telah belajar mencari luas permukaan bola menggunakan rumus.",
        text2:
          '<y>Luas Permukaan Bola = 4πr²</y><br><br>Ketuk "Mulai Lagi" untuk memulai ulang aktivitas.',
        buttonText: "Mulai Lagi",
        imageAlt: "Rumus luas permukaan bola",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;

// Set page title from data (so it matches current language)
try {
  if (typeof document !== "undefined" && APP_DATA.pageTitle) {
    document.title = APP_DATA.pageTitle;
  }
} catch (e) {}
