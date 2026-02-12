


const DATA = {
  en: {
    app: {
      start: {
        heading: "Surface Area of Hemisphere",
        text: 'Let\'s explore the formulas to find the curved and total surface area of Hemisphere.<br>Tap "Start" to start the activity.',
        buttonText: "Start",
      },
      buttons: {
        visualize: "Visualize",
        unfold: "Unfold",
        reset: "⟲",
      },
      steps: {
        1: {
          q: "A hemisphere is half of a sphere.",
          n: 'Tap "Visualise" to see.',
          qAfterAnim: "A hemisphere is half of a sphere. Let us first recall the surface area of a sphere.",
          nAfterAnim: 'Tap "⟲" to visualise and » to recall surface area of sphere.',
        },
        2: {
          q: "Each Sphere can be unfolded into a rectangle.",
          n: 'Tap "Unfold" to see the net of the Sphere.',
        },
        3: {
          q: "The sphere has radius <i>r</i> and diameter 2<i>r</i>.",
          n: "Tap » to continue.",
        },
        4: {
          q: "On unfolding the sphere, it has become a cylinder with radius <i>r</i>, height 2<i>r</i>, and circumference 2π<i>r</i>.",
          n: "Tap » to continue.",
        },
        5: {
          q: "On opening the cylinder, it has become a rectangular surface of <x>length 2π<i>r</i></x> and <y>height 2<i>r</i></y>.",
          n: "Tap » to continue.",
        },
        6: {
          q: "Surface area of the sphere is the area of transformed rectangle.",
          n: "Tap » to continue.",
        },
        7: {
          q: "Surface area of the sphere is the area of transformed rectangle.",
          n: "Tap » to continue.",
        },
        8: {
          q: "Surface area of the sphere is the area of transformed rectangle.",
          n: "Tap » to explore the surface area of hemisphere.",
        },
        9: {
          q: "A hemisphere is half of a sphere, so its curved surface area will be half of the sphere's surface area.",
          n: "Tap » to continue.",
        },
        10: {
          q: "Let's substitute the surface area of sphere.",
          n: "Tap the correct answer.",
          nAfterCorrect: "Tap » to simplify.",
          mcqTitle: "What is the surface area of a<br>sphere?",
          options: ["2π<i>r</i>", "4π<i>r</i>²", "π<i>r</i>²"],
          correct: 1,
        },
        11: {
          q: "Let's simplify the expression.",
          n: "Tap » to simplify.",
        },
        12: {
          q: "The curved surface area of the hemisphere is half of the sphere's surface area.",
          n: "Tap » to explore the total surface area.",
        },
        13: {
          q: "Total surface area of the Hemisphere is the sum of the areas of the circular base and curved surface.",
          n: "Tap » to find the area of the base.",
        },
        14: {
          q: "Let's find the area of base.",
          n: "Tap the correct answer.",
          nAfterCorrect: "Tap » to simplify.",
          mcqTitle: "What is the area of the circular<br>base?",
          options: ["2π<i>r</i>²", "4π<i>r</i>²", "π<i>r</i>²"],
          correct: 2,
        },
        15: {
          q: "Let's add the like terms in the expression.",
          n: "Tap » to simplify.",
        },
        16: {
          q: "Let's add the like terms in the expression.",
          n: "Tap » to summarise.",
        },
      },
      equations: {
        6: { box1: "Surface area", box2: "Area of the rectangle", box3: "<x>Length</x> × <y>Breadth</y>" },
        7: { box1: "Surface area", box2: "Area of the rectangle", box3: "<x>2πr</x> × <x>2r</y>" },
        8: { box1: "Surface area", box2: "Area of the rectangle", box3: "4πr²" },
        9: { box1: "Curved Surface area", box2: "½ × Surface area of sphere" },
        10: { box1: "Curved Surface area", box2Prefix: "½ × ", box2Highlight: "Surface area of sphere" },
        11: { box1: "Curved Surface area", box2: "½ × 4πr²" },
        12: { box1: "Curved Surface area", box2: "2πr²" },
        13: { full: "Total Surface Area = Area of Base + Curved Surface Area" },
        14: { prefix: "Total Surface Area = ", box: "Area of Base", boxReplaced: "πr²", suffix: " + Curved Surface Area" },
        15: { full: "Total Surface Area = πr² + 2πr²" },
        16: { full: "Total Surface Area = πr² + 2πr² = 3πr²" },
      },
      final: {
        heading: "Activity Completed!",
        text: 'Curved surface area and the total surface area of a hemisphere can be calculated using the following formulas.<br><br><y>Curved Surface Area = 2πr²</y><br><y>Total Surface Area = 3πr²</y><br><br>Tap "Start Over" to restart the activity.',
        buttonText: "Start Over",
        imageAlt: "Hemisphere surface area formula",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Luas Permukaan Belahan Bola",
        text: 'Mari kita jelajahi rumus untuk mencari luas permukaan lengkung dan total belahan bola.<br>Ketuk "Mulai" untuk memulai aktivitas.',
        buttonText: "Mulai",
      },
      buttons: {
        visualize: "Visualisasikan",
        unfold: "Buka",
        reset: "⟲",
      },
      steps: {
        1: {
          q: "Belahan bola adalah setengah dari bola.",
          n: 'Ketuk "Visualisasikan" untuk melihat.',
          qAfterAnim: "Belahan bola adalah setengah dari bola. Mari kita ingat kembali luas permukaan bola.",
          nAfterAnim: 'Ketuk "⟲" untuk memvisualisasikan dan » untuk mengingat luas permukaan bola.',
        },
        2: {
          q: "Setiap bola dapat dibuka menjadi persegi panjang.",
          n: 'Ketuk "Buka" untuk melihat jaring-jaring bola.',
        },
        3: {
          q: "Bola memiliki jari-jari <i>r</i> dan diameter 2<i>r</i>.",
          n: "Ketuk » untuk melanjutkan.",
        },
        4: {
          q: "Saat membuka bola, ia menjadi silinder dengan jari-jari <i>r</i>, tinggi 2<i>r</i>, dan keliling 2π<i>r</i>.",
          n: "Ketuk » untuk melanjutkan.",
        },
        5: {
          q: "Saat membuka silinder, ia menjadi permukaan persegi panjang dengan <x>panjang 2π<i>r</i></x> dan <y>tinggi 2<i>r</i></y>.",
          n: "Ketuk » untuk melanjutkan.",
        },
        6: {
          q: "Luas permukaan bola adalah luas persegi panjang yang ditransformasi.",
          n: "Ketuk » untuk melanjutkan.",
        },
        7: {
          q: "Luas permukaan bola adalah luas persegi panjang yang ditransformasi.",
          n: "Ketuk » untuk melanjutkan.",
        },
        8: {
          q: "Luas permukaan bola adalah luas persegi panjang yang ditransformasi.",
          n: "Ketuk » untuk menjelajahi luas permukaan belahan bola.",
        },
        9: {
          q: "Belahan bola adalah setengah dari bola, jadi luas permukaan lengkungnya akan menjadi setengah dari luas permukaan bola.",
          n: "Ketuk » untuk melanjutkan.",
        },
        10: {
          q: "Mari kita substitusi luas permukaan bola.",
          n: "Ketuk jawaban yang benar.",
          nAfterCorrect: "Ketuk » untuk menyederhanakan.",
          mcqTitle: "Berapa luas permukaan<br>bola?",
          options: ["2π<i>r</i>", "4π<i>r</i>²", "π<i>r</i>²"],
          correct: 1,
        },
        11: {
          q: "Mari kita sederhanakan ekspresinya.",
          n: "Ketuk » untuk menyederhanakan.",
        },
        12: {
          q: "Luas permukaan lengkung belahan bola adalah setengah dari luas permukaan bola.",
          n: "Ketuk » untuk menjelajahi luas permukaan total.",
        },
        13: {
          q: "Luas permukaan total belahan bola adalah jumlah dari luas alas lingkaran dan permukaan lengkung.",
          n: "Ketuk » untuk mencari luas alas.",
        },
        14: {
          q: "Mari kita cari luas alas.",
          n: "Ketuk jawaban yang benar.",
          nAfterCorrect: "Ketuk » untuk menyederhanakan.",
          mcqTitle: "Berapa luas alas<br>lingkaran?",
          options: ["2π<i>r</i>²", "4π<i>r</i>²", "π<i>r</i>²"],
          correct: 2,
        },
        15: {
          q: "Mari kita jumlahkan suku-suku sejenis dalam ekspresi.",
          n: "Ketuk » untuk menyederhanakan.",
        },
        16: {
          q: "Mari kita jumlahkan suku-suku sejenis dalam ekspresi.",
          n: "Ketuk » untuk merangkum.",
        },
      },
      equations: {
        6: { box1: "Luas permukaan", box2: "Luas persegi panjang", box3: "<x>Panjang</x> × <y>Lebar</y>" },
        7: { box1: "Luas permukaan", box2: "Luas persegi panjang", box3: "<x>2πr</x> × <y>2r</y>" },
        8: { box1: "Luas permukaan", box2: "Luas persegi panjang", box3: "4πr²" },
        9: { box1: "Luas permukaan lengkung", box2: "½ × Luas permukaan bola" },
        10: { box1: "Luas permukaan lengkung", box2Prefix: "½ × ", box2Highlight: "Luas permukaan bola" },
        11: { box1: "Luas permukaan lengkung", box2: "½ × 4πr²" },
        12: { box1: "Luas permukaan lengkung", box2: "2πr²" },
        13: { full: "Luas Permukaan Total = Luas Alas + Luas Permukaan Lengkung" },
        14: { prefix: "Luas Permukaan Total = ", box: "Luas Alas", boxReplaced: "πr²", suffix: " + Luas Permukaan Lengkung" },
        15: { full: "Luas Permukaan Total = πr² + 2πr²" },
        16: { full: "Luas Permukaan Total = πr² + 2πr² = 3πr²" },
      },
      final: {
        heading: "Aktivitas Selesai!",
        text: 'Luas permukaan lengkung dan luas permukaan total belahan bola dapat dihitung menggunakan rumus berikut.<br><br><y>Luas Permukaan Lengkung = 2πr²</y><br><y>Luas Permukaan Total = 3πr²</y><br><br>Ketuk "Mulai Lagi" untuk memulai ulang aktivitas.',
        buttonText: "Mulai Lagi",
        imageAlt: "Rumus luas permukaan belahan bola",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
