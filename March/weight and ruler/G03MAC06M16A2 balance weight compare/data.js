const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Comparing Weights of Objects",
        text:
          "Let us identify which object is heavier<br>and which is lighter.",
        buttonText: "Start",
      },
      final: {
        heading: "Comparing Weights of Objects",
        text:
          "Awesome!<br><br>We learned that<br><bl>Greater the weight</bl> → <bl>heavier</bl>.<br><yl>Lesser the weight</yl> → <yl>lighter</yl>.<br>We look at weight on the measuring tool<br>to compare.",
        buttonText: "Start Over",
      },
      questions: [
        {
          questionText: "Which object is heavier?",
          navText: "Tap the correct option.",
          imageLeft: "assets/q1l.png",
          imageRight: "assets/q1r.png",
          buttonTextLeft: "Banana",
          buttonTextRight: "Tennis Ball",
          weightTextLeft: "Banana weighs 120 g.",
          weightTextRight: "Tennis ball weighs 100 g.",
          correct: "l",
          correctFeedback:
            "Awesome!\n120 g is heavier than 100 g.\nBanana is heavier than tennis ball.",
          wrongFeedback:
            "The object that balances more weight on balancing scale is heavier.",
          navCorrect: "Tap » to compare more objects.",
        },
        {
          questionText: "Which object is lighter?",
          navText: "Tap the correct option.",
          imageLeft: "assets/q2l.png",
          imageRight: "assets/q2r.png",
          buttonTextLeft: "Pumpkin",
          buttonTextRight: "School Bag",
          weightTextLeft: "Pumpkin weighs 2 kg.",
          weightTextRight: "School bag weighs 3 kg.",
          correct: "l",
          correctFeedback:
            "Awesome!\n2 kg is lighter than 3 kg.\nPumpkin is lighter than the school bag.",
          wrongFeedback:
            "The object that balances less weight on the balancing scale is lighter.",
          navCorrect: "Tap » to compare more objects.",
        },
        {
          questionText: "Which object is lighter?",
          navText: "Tap the correct option.",
          imageLeft: "assets/q3l.png",
          imageRight: "assets/q3r.png",
          buttonTextLeft: "Mango",
          buttonTextRight: "Tiffin box",
          weightTextLeft: "Mango weighs 400 g.",
          weightTextRight: "Tiffin box weighs 600 g.",
          correct: "l",
          correctFeedback:
            "Awesome!\n400 g is lighter than 600 g.\nMango is lighter than the tiffin box.",
          wrongFeedback:
            "The object that balances less weight on the balancing scale is lighter.",
          navCorrect: "Tap » to compare more objects.",
        },
        {
          questionText: "Which object is lighter?",
          navText: "Tap the correct option.",
          imageLeft: "assets/q4l.png",
          imageRight: "assets/q4r.png",
          buttonTextLeft: "Watermelon",
          buttonTextRight: "Cake",
          weightTextLeft: "Watermelon weighs 3 kg.",
          weightTextRight: "Cake weighs 1 kg.",
          correct: "r",
          correctFeedback:
            "Awesome!\n1 kg is lighter than 3 kg.\nCake is lighter than the watermelon.",
          wrongFeedback:
            "The object that balances less weight on the balancing scale is lighter.",
          navCorrect: "Tap » to summarise.",
        },
      ],
    },
  },
  id: {
    app: {
      start: {
        heading: "Membandingkan Berat Benda",
        text:
          "Mari kita tentukan benda mana yang lebih berat<br>dan mana yang lebih ringan.",
        buttonText: "Mulai",
      },
      final: {
        heading: "Membandingkan Berat Benda",
          text:
            "Luar biasa!<br><br>Kita belajar bahwa<br><bl>Semakin besar beratnya</bl> → <bl>semakin berat</bl>.<br><yl>Semakin kecil beratnya</yl> → <yl>semakin ringan</yl>.<br>Kita melihat berat pada alat ukur<br>untuk membandingkan.",
        buttonText: "Ulangi dari Awal",
      },
      questions: [
        {
          questionText: "Benda manakah yang lebih berat?",
          navText: "Ketuk pilihan yang benar.",
          imageLeft: "assets/q1l.png",
          imageRight: "assets/q1r.png",
          buttonTextLeft: "Pisang",
          buttonTextRight: "Bola Tenis",
          weightTextLeft: "Pisang bermassa 120 g.",
          weightTextRight: "Bola tenis bermassa 100 g.",
          correct: "l",
          correctFeedback:
            "Luar biasa!\n120 g lebih berat dari 100 g.\nPisang lebih berat dari bola tenis.",
          wrongFeedback:
            "Benda yang menyeimbangkan lebih banyak beban pada timbangan lebih berat.",
          navCorrect: "Ketuk » untuk membandingkan benda lainnya.",
        },
        {
          questionText: "Benda manakah yang lebih ringan?",
          navText: "Ketuk pilihan yang benar.",
          imageLeft: "assets/q2l.png",
          imageRight: "assets/q2r.png",
          buttonTextLeft: "Labu",
          buttonTextRight: "Tas Sekolah",
          weightTextLeft: "Labu bermassa 2 kg.",
          weightTextRight: "Tas sekolah bermassa 3 kg.",
          correct: "l",
          correctFeedback:
            "Luar biasa!\n2 kg lebih ringan dari 3 kg.\nLabu lebih ringan dari tas sekolah.",
          wrongFeedback:
            "Benda yang menyeimbangkan lebih sedikit beban pada timbangan lebih ringan.",
          navCorrect: "Ketuk » untuk membandingkan benda lainnya.",
        },
        {
          questionText: "Benda manakah yang lebih ringan?",
          navText: "Ketuk pilihan yang benar.",
          imageLeft: "assets/q3l.png",
          imageRight: "assets/q3r.png",
          buttonTextLeft: "Mangga",
          buttonTextRight: "Kotak bekal",
          weightTextLeft: "Mangga bermassa 400 g.",
          weightTextRight: "Kotak bekal bermassa 600 g.",
          correct: "l",
          correctFeedback:
            "Luar biasa!\n400 g lebih ringan dari 600 g.\nMangga lebih ringan dari kotak bekal.",
          wrongFeedback:
            "Benda yang menyeimbangkan lebih sedikit beban pada timbangan lebih ringan.",
          navCorrect: "Ketuk » untuk membandingkan benda lainnya.",
        },
        {
          questionText: "Benda manakah yang lebih ringan?",
          navText: "Ketuk pilihan yang benar.",
          imageLeft: "assets/q4l.png",
          imageRight: "assets/q4r.png",
          buttonTextLeft: "Semangka",
          buttonTextRight: "Kue",
          weightTextLeft: "Semangka bermassa 3 kg.",
          weightTextRight: "Kue bermassa 1 kg.",
          correct: "r",
          correctFeedback:
            "Luar biasa!\n1 kg lebih ringan dari 3 kg.\nKue lebih ringan dari semangka.",
          wrongFeedback:
            "Benda yang menyeimbangkan lebih sedikit beban pada timbangan lebih ringan.",
          navCorrect: "Ketuk » untuk merangkum.",
        },
      ],
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
