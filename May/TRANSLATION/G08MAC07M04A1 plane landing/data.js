const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      assets: {
        crash1: "assets/crash1.mp4",
        good1: "assets/good1.mp4",
        good2: "assets/good2.mp4",
        cycle: "assets/cycle.gif",
        light: "assets/light.gif",
        pyramid: "assets/pyramid.png",
        final: "assets/final.png",
      },
      steps: {
        1: {
          questionText: "An airplane is about to land.",
          navText: "Tap '»' to see the landing of the plane",
        },
        2: {
          questionText: "An airplane is about to land.",
          navText: "Tap the plane to see what happens",
          navTextDone: "Tap '»' to try the landing of the plane again",
          topTextMalfunction: "Ohhh no!!! The exhaust has malfunctioned….",
          topTextCrashed: "The plane crashed…",
        },
        3: {
          questionText: "Landing Attempt 2 – Gentle Landing",
          navText: "",
          navTextLand: "Tap 'Land the Plane' to see the landing",
          navTextDone: "Tap '»' to compare",
          topTextMalfunction: "Ohhh no!!! The exhaust has malfunctioned….",
          topTextLanded: "The plane has safely landed…",
          landButton: "Land the Plane",
        },
        4: {
          questionText: "Compare the two landings",
          navText: "Tap '»' after reading",
          badTitle: "Bad Landing",
          goodTitle: "Good Landing",
          compareText:
            "Had the plane gone straight ahead, it did not land safely<br>" +
            "When it followed a slanted path, then it landed safely.",
        },
        5: {
          questionText: "Compare the two landings",
          navText: "Tap '»' to see more examples where we see slopes",
          badTitle: "Bad Landing",
          goodTitle: "Good Landing",
          compareText:
            "Choosing the direction of travel made the difference between safe and unsafe.<br>" +
            "This direction can be understood in mathematics as <y>SLOPE</y>.",
        },
        6: {
          questionText: "Where do we see slopes in our daily lives?",
          navText: "Tap '»' to continue",
          navTextDone: "Activity Completed!!!",
          cardText:
            "Slopes are significant in different situations in our life.",
          finaleText:
            "We have seen slopes around us.<br>" +
            "Today we will learn about slopes mathematically.<br>" +
            "We will understand this on a cartesian plane.",
          startOver: "Start Over",
          cards: [
            { title: "Cycling on a hill", media: "cycle", type: "gif" },
            { title: "Street lamp", media: "light", type: "gif" },
            { title: "Pyramid", media: "pyramid", type: "image" },
            { title: "Airplane landing", media: "good2", type: "video" },
          ],
        },
      },
    },
  },
  id: {
    app: {
      assets: {
        crash1: "assets/crash1.mp4",
        good1: "assets/good1.mp4",
        good2: "assets/good2.mp4",
        cycle: "assets/cycle.gif",
        light: "assets/light.gif",
        pyramid: "assets/pyramid.png",
        final: "assets/final.png",
      },
      steps: {
        1: {
          questionText: "Sebuah pesawat akan mendarat.",
          navText: "Ketuk '»' untuk melihat pendaratan pesawat",
        },
        2: {
          questionText: "Sebuah pesawat akan mendarat.",
          navText: "Ketuk di mana saja untuk melihat apa yang terjadi",
          navTextDone: "Ketuk '»' untuk mencoba pendaratan pesawat lagi",
          topTextMalfunction: "Ohhh tidak!!! Knalpotnya mengalami kerusakan….",
          topTextCrashed: "Pesawatnya jatuh…",
        },
        3: {
          questionText: "Percobaan Pendaratan 2 – Pendaratan Lembut",
          navText: "",
          navTextLand: "Ketuk 'Mendaratkan Pesawat' untuk melihat pendaratannya",
          navTextDone: "Ketuk '»' untuk membandingkan",
          topTextMalfunction: "Ohhh tidak!!! Knalpotnya mengalami kerusakan….",
          topTextLanded: "Pesawatnya telah mendarat dengan aman…",
          landButton: "Mendaratkan Pesawat",
        },
        4: {
          questionText: "Bandingkan kedua pendaratan",
          navText: "Ketuk '»' setelah membaca",
          badTitle: "Pendaratan Buruk",
          goodTitle: "Pendaratan Baik",
          compareText:
            "Jika pesawat terbang lurus ke depan, ia tidak mendarat dengan aman<br>" +
            "Ketika mengikuti jalur miring, ia mendarat dengan aman.",
        },
        5: {
          questionText: "Bandingkan kedua pendaratan",
          navText: "Ketuk '»' untuk melihat contoh lain kemiringan di kehidupan kita",
          badTitle: "Pendaratan Buruk",
          goodTitle: "Pendaratan Baik",
          compareText:
            "Memilih arah perjalanan membuat perbedaan antara aman dan tidak aman.<br>" +
            "Arah ini dapat dipahami dalam matematika sebagai <y>KEMIRINGAN</y>.",
        },
        6: {
          questionText: "Di mana kita melihat kemiringan dalam kehidupan sehari-hari?",
          navText: "Ketuk '»' untuk melanjutkan",
          navTextDone: "Aktivitas Selesai!!!",
          cardText:
            "Kemiringan penting dalam berbagai situasi dalam hidup kita.",
          finaleText:
            "Kita telah melihat kemiringan di sekitar kita.<br>" +
            "Hari ini kita akan mempelajari kemiringan secara matematis.<br>" +
            "Kita akan memahaminya pada bidang koordinat.",
          startOver: "Mulai Lagi",
          cards: [
            { title: "Bersepeda di bukit", media: "cycle", type: "gif" },
            { title: "Tiang lampu jalan", media: "light", type: "gif" },
            { title: "Piramida", media: "pyramid", type: "image" },
            { title: "Pendaratan pesawat", media: "good2", type: "video" },
          ],
        },
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
