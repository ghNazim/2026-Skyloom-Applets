const DATA = {
  en: {
    scalePositions: [
      { label: "IMPOSSIBLE", dotColor: "#e53935" },
      { label: "LESS LIKELY", dotColor: "#fb8c00" },
      { label: "POSSIBLE", dotColor: "#fdd835" },
      { label: "MORE LIKELY", dotColor: "#29b6f6" },
      { label: "CERTAIN", dotColor: "#66bb6a" },
    ],

    correctTemplates: {
      1: "That's right! There are zero {coloredItem}.\n0 = Impossible",
      2: "That's right! {coloredItem} has the least count.\nLeast = Less Likely",
      3: "That's right! {coloredItem} is neither the most nor the least.\nNeither most nor least = Possible",
      4: "That's right! {coloredItem} has the highest count.\nMost = More Likely",
      5: "That's right! All {items} are the same.\nAll = Certain",
    },

    wrongTemplates: {
      1: "Impossible = 0\nThe {item} with zero count goes here.\nTry again!",
      2: "Less Likely = Least\nThe {item} with the least count goes here.\nTry again!",
      3: "Possible = Neither most nor least\nThe {item} that is neither the most nor the least goes here.\nTry again!",
      4: "More Likely = Most\nThe {item} with the highest count goes here.\nTry again!",
      5: "Certain = All\nOnly one {item} should be present for this place.\nTry again!",
    },

    questions: [
      {
        intro: {
          heading: "Practice Scale of Probability",
          image: "assets/bookshelf.png",
          text: "If we had to pick a book at random,<br><y>how likely is it that we pull<br>a book of a particular color?</y><br><br>Tap 'Start' to explore.",
          buttonText: "Start",
        },

        leftPanelImage: "assets/bookshelf.png",
        title: "",
        instruction: "Count the books\nand place them on\nthe scale.",
        heading:
          "<y>Estimate the probabilities</y> correctly using this scale.",
        placeholderImage: "assets/bookPlaceholder.png",
        maxPerZone: 2,
        itemSize: "8vw",
        item: "book",
        items: "books",
        completeFeedback: "The scale is complete now!",

        navText: "Drag the books to the correct position on the scale.",
        navNextQuestion: "Tap » for next challenge.",
        navLast: "Tap » to conclude.",

        draggables: [
          { id: "black", img: "assets/blackBook.png", dropzone: 1, coloredItem: "black books" },
          { id: "blue", img: "assets/blueBook.png", dropzone: 2, coloredItem: "Blue book" },
          { id: "orange", img: "assets/orangeBook.png", dropzone: 3, coloredItem: "Orange book" },
          { id: "red", img: "assets/redBook.png", dropzone: 4, coloredItem: "Red book" },
          { id: "green", img: "assets/greenBook.png", dropzone: 3, coloredItem: "Green book" },
        ],
      },

      {
        intro: {
          heading: "Practice Scale of Probability",
          image: "assets/dices.png",
          text: "Imagine a die on which<br>we have 6 on all six faces.<br>If we roll the die,<br><y>how likely is it that we get a '6'?</y><br><br>Tap 'Continue' to explore.",
          buttonText: "Continue",
        },

        leftPanelImage: "assets/dices.png",
        title: "",
        instruction: "Count the faces\nwith same number\nand place them on\nthe scale.",
        heading:
          "<y>Estimate the probability</y> correctly using this scale.",
        placeholderImage: "assets/diePlaceholder.png",
        maxPerZone: 1,
        itemSize: "6vw",
        item: "number",
        items: "numbers",
        completeFeedback: "The scale is complete now!",

        navText: "Drag the die face to the correct position on the scale.",
        navNextQuestion: "Tap » for next challenge.",
        navLast: "Tap » to conclude.",

        draggables: [
          { id: "diceFace6", img: "assets/diceFace6.png", dropzone: 5, coloredItem: "6" },
        ],
      },

      {
        intro: {
          heading: "Practice Scale of Probability",
          image: "assets/dices2.png",
          text: "We have a die on which<br>we have random numbers<br>on all six faces.<br>If we roll the die,<br><y>how likely is it that we get<br>a particular number?</y><br><br>Tap 'Continue' to explore.",
          buttonText: "Continue",
        },

        leftPanelImage: "assets/dices2.png",
        title: "",
        instruction: "Count the faces\nwith same number\nand place them on\nthe scale.",
        heading:
          "<y>Estimate the probabilities</y> correctly using this scale.",
        placeholderImage: "assets/diePlaceholder.png",
        maxPerZone: 1,
        itemSize: "6vw",
        item: "number",
        items: "numbers",
        completeFeedback: "The scale is complete now!",

        navText: "Drag the die faces to the correct position on the scale.",
        navNextQuestion: "Tap » for next challenge.",
        navLast: "Tap » to conclude.",

        draggables: [
          { id: "diceFace2", img: "assets/diceFace2.png", dropzone: 4, coloredItem: "2" },
          { id: "diceFace5", img: "assets/diceFace5.png", dropzone: 2, coloredItem: "5" },
          { id: "diceFace6", img: "assets/diceFace6.png", dropzone: 3, coloredItem: "6" },
        ],
      },

      {
        intro: {
          heading: "Practice Scale of Probability",
          image: "assets/bag1.png",
          text: "If we had to draw a ball at random,<br><y>how likely is it that we get<br>a ball of a particular color?</y><br><br>Tap 'Continue' to explore.",
          buttonText: "Continue",
        },

        leftPanelImage: "assets/bag1.png",
        title: "",
        instruction: "Count the balls of\neach color and place\nthem on the scale.",
        heading:
          "<y>Estimate the probabilities</y> correctly using this scale.",
        placeholderImage: "assets/ballPlaceholder.png",
        maxPerZone: 3,
        itemSize: "4.5vw",
        item: "ball",
        items: "balls",
        completeFeedback: "The scale is complete now!",

        navText: "Drag the balls to the correct position on the scale.",
        navNextQuestion: "Tap » for next challenge.",
        navLast: "Tap » to conclude.",

        draggables: [
          { id: "redBall", img: "assets/redBall.png", dropzone: 2, coloredItem: "Red ball" },
          { id: "greenBall", img: "assets/greenBall.png", dropzone: 2, coloredItem: "Green ball" },
          { id: "purpleBall", img: "assets/purpleBall.png", dropzone: 2, coloredItem: "Purple ball" },
          { id: "blueBall", img: "assets/blueBall.png", dropzone: 3, coloredItem: "Blue ball" },
          { id: "orangeBall", img: "assets/orangeBall.png", dropzone: 4, coloredItem: "Orange ball" },
        ],
      },

      {
        intro: {
          heading: "Practice Scale of Probability",
          image: "assets/bag2.png",
          text: "If we had to draw a ball at random,<br><y>how likely is it that we get<br>a ball of a particular color?</y><br><br>Tap 'Continue' to explore.",
          buttonText: "Continue",
        },

        leftPanelImage: "assets/bag2.png",
        title: "",
        instruction: "Count the balls of\neach color and place\nthem on the scale.",
        heading:
          "<y>Estimate the probabilities</y> correctly using this scale.",
        placeholderImage: "assets/ballPlaceholder.png",
        maxPerZone: 2,
        itemSize: "4.5vw",
        item: "ball",
        items: "balls",
        completeFeedback: "The scale is complete now!",

        navText: "Drag the balls to the correct position on the scale.",
        navNextQuestion: "Tap » for next challenge.",
        navLast: "Tap » to conclude.",

        draggables: [
          { id: "redBall", img: "assets/redBall.png", dropzone: 1, coloredItem: "red balls" },
          { id: "blueBall", img: "assets/blueBall.png", dropzone: 1, coloredItem: "blue balls" },
          { id: "orangeBall", img: "assets/orangeBall.png", dropzone: 5, coloredItem: "orange" },
        ],
      },
    ],

    final: {
      heading: "Well Done! Activity Completed!",
      text: "You estimated the probabilities correctly!<br>You can now use the scale and tell if an event is<br><y>impossible, less likely, possible, more likely, or certain!</y><br><br><br>Tap 'Start Over' to repeat this activity.",
      buttonText: "Start Over",
    },
  },

  id: {
    scalePositions: [
      { label: "MUSTAHIL", dotColor: "#e53935" },
      { label: "KURANG MUNGKIN", dotColor: "#fb8c00" },
      { label: "MUNGKIN", dotColor: "#fdd835" },
      { label: "LEBIH MUNGKIN", dotColor: "#29b6f6" },
      { label: "PASTI", dotColor: "#66bb6a" },
    ],

    correctTemplates: {
      1: "Benar! Ada nol {coloredItem}.\n0 = Mustahil",
      2: "Benar! {coloredItem} memiliki jumlah paling sedikit.\nPaling sedikit = Kurang Mungkin",
      3: "Benar! {coloredItem} bukan yang paling banyak atau paling sedikit.\nBukan paling banyak atau sedikit = Mungkin",
      4: "Benar! {coloredItem} memiliki jumlah paling banyak.\nPaling banyak = Lebih Mungkin",
      5: "Benar! Semua {items} sama.\nSemua = Pasti",
    },

    wrongTemplates: {
      1: "Mustahil = 0\n{item} dengan jumlah nol letaknya di sini.\nCoba lagi!",
      2: "Kurang Mungkin = Paling sedikit\n{item} dengan jumlah paling sedikit letaknya di sini.\nCoba lagi!",
      3: "Mungkin = Bukan paling banyak atau sedikit\n{item} yang bukan paling banyak atau sedikit letaknya di sini.\nCoba lagi!",
      4: "Lebih Mungkin = Paling banyak\n{item} dengan jumlah paling banyak letaknya di sini.\nCoba lagi!",
      5: "Pasti = Semua\nHanya satu {item} yang seharusnya ada di tempat ini.\nCoba lagi!",
    },

    questions: [
      {
        intro: {
          heading: "Latihan Skala Probabilitas",
          image: "assets/bookshelf.png",
          text: "Jika kita harus memilih buku secara acak,<br>seberapa besar kemungkinan kita mengambil<br>buku dengan warna tertentu?<br>Ketuk 'Mulai' untuk menjelajah.",
          buttonText: "Mulai",
        },

        leftPanelImage: "assets/bookshelf.png",
        title: "",
        instruction: "Hitung buku\ndan letakkan di\nskala.",
        heading:
          "<y>Perkirakan probabilitas</y> dengan benar menggunakan skala ini.",
        placeholderImage: "assets/bookPlaceholder.png",
        maxPerZone: 2,
        itemSize: "8vw",
        item: "buku",
        items: "buku",
        completeFeedback: "Skala sudah lengkap sekarang!",

        navText: "Seret buku ke posisi yang benar pada skala.",
        navNextQuestion: "Ketuk » untuk tantangan berikutnya.",
        navLast: "Ketuk » untuk menyelesaikan aktivitas.",

        draggables: [
          { id: "black", img: "assets/blackBook.png", dropzone: 1, coloredItem: "buku hitam" },
          { id: "blue", img: "assets/blueBook.png", dropzone: 2, coloredItem: "Buku biru" },
          { id: "orange", img: "assets/orangeBook.png", dropzone: 3, coloredItem: "Buku oranye" },
          { id: "red", img: "assets/redBook.png", dropzone: 4, coloredItem: "Buku merah" },
          { id: "green", img: "assets/greenBook.png", dropzone: 3, coloredItem: "Buku hijau" },
        ],
      },

      {
        intro: {
          heading: "Latihan Skala Probabilitas",
          image: "assets/dices.png",
          text: "Bayangkan sebuah dadu yang<br>memiliki angka 6 di semua enam sisi.<br>Jika kita melempar dadu,<br><y>seberapa besar kemungkinan kita mendapat '6'?</y><br><br>Ketuk 'Lanjutkan' untuk menjelajah.",
          buttonText: "Lanjutkan",
        },

        leftPanelImage: "assets/dices.png",
        title: "",
        instruction: "Hitung sisi\ndengan angka sama\ndan letakkan di\nskala.",
        heading:
          "<y>Perkirakan probabilitas</y> dengan benar menggunakan skala ini.",
        placeholderImage: "assets/diePlaceholder.png",
        maxPerZone: 1,
        itemSize: "6vw",
        item: "angka",
        items: "angka",
        completeFeedback: "Skala sudah lengkap sekarang!",

        navText: "Seret sisi dadu ke posisi yang benar pada skala.",
        navNextQuestion: "Ketuk » untuk tantangan berikutnya.",
        navLast: "Ketuk » untuk menyelesaikan aktivitas.",

        draggables: [
          { id: "diceFace6", img: "assets/diceFace6.png", dropzone: 5, coloredItem: "6" },
        ],
      },

      {
        intro: {
          heading: "Latihan Skala Probabilitas",
          image: "assets/dices2.png",
          text: "Kita memiliki dadu yang<br>memiliki angka acak<br>di semua enam sisi.<br>Jika kita melempar dadu,<br><y>seberapa besar kemungkinan kita mendapat<br>angka tertentu?</y><br><br>Ketuk 'Lanjutkan' untuk menjelajah.",
          buttonText: "Lanjutkan",
        },

        leftPanelImage: "assets/dices2.png",
        title: "",
        instruction: "Hitung sisi\ndengan angka sama\ndan letakkan di\nskala.",
        heading:
          "<y>Perkirakan probabilitas</y> dengan benar menggunakan skala ini.",
        placeholderImage: "assets/diePlaceholder.png",
        maxPerZone: 1,
        itemSize: "6vw",
        item: "angka",
        items: "angka",
        completeFeedback: "Skala sudah lengkap sekarang!",

        navText: "Seret sisi dadu ke posisi yang benar pada skala.",
        navNextQuestion: "Ketuk » untuk tantangan berikutnya.",
        navLast: "Ketuk » untuk menyelesaikan aktivitas.",

        draggables: [
          { id: "diceFace2", img: "assets/diceFace2.png", dropzone: 4, coloredItem: "2" },
          { id: "diceFace5", img: "assets/diceFace5.png", dropzone: 2, coloredItem: "5" },
          { id: "diceFace6", img: "assets/diceFace6.png", dropzone: 3, coloredItem: "6" },
        ],
      },

      {
        intro: {
          heading: "Latihan Skala Probabilitas",
          image: "assets/bag1.png",
          text: "Jika kita harus mengambil bola secara acak,<br><y>seberapa besar kemungkinan kita mendapat<br>bola dengan warna tertentu?</y><br><br>Ketuk 'Lanjutkan' untuk menjelajah.",
          buttonText: "Lanjutkan",
        },

        leftPanelImage: "assets/bag1.png",
        title: "",
        instruction: "Hitung bola dari\nsetiap warna dan\nletakkan di skala.",
        heading:
          "<y>Perkirakan probabilitas</y> dengan benar menggunakan skala ini.",
        placeholderImage: "assets/ballPlaceholder.png",
        maxPerZone: 3,
        itemSize: "4.5vw",
        item: "bola",
        items: "bola",
        completeFeedback: "Skala sudah lengkap sekarang!",

        navText: "Seret bola ke posisi yang benar pada skala.",
        navNextQuestion: "Ketuk » untuk tantangan berikutnya.",
        navLast: "Ketuk » untuk menyelesaikan aktivitas.",

        draggables: [
          { id: "redBall", img: "assets/redBall.png", dropzone: 2, coloredItem: "Bola merah" },
          { id: "greenBall", img: "assets/greenBall.png", dropzone: 2, coloredItem: "Bola hijau" },
          { id: "purpleBall", img: "assets/purpleBall.png", dropzone: 2, coloredItem: "Bola ungu" },
          { id: "blueBall", img: "assets/blueBall.png", dropzone: 3, coloredItem: "Bola biru" },
          { id: "orangeBall", img: "assets/orangeBall.png", dropzone: 4, coloredItem: "Bola oranye" },
        ],
      },

      {
        intro: {
          heading: "Latihan Skala Probabilitas",
          image: "assets/bag2.png",
          text: "Jika kita harus mengambil bola secara acak,<br><y>seberapa besar kemungkinan kita mendapat<br>bola dengan warna tertentu?</y><br><br>Ketuk 'Lanjutkan' untuk menjelajah.",
          buttonText: "Lanjutkan",
        },

        leftPanelImage: "assets/bag2.png",
        title: "",
        instruction: "Hitung bola dari\nsetiap warna dan\nletakkan di skala.",
        heading:
          "<y>Perkirakan probabilitas</y> dengan benar menggunakan skala ini.",
        placeholderImage: "assets/ballPlaceholder.png",
        maxPerZone: 2,
        itemSize: "4.5vw",
        item: "bola",
        items: "bola",
        completeFeedback: "Skala sudah lengkap sekarang!",

        navText: "Seret bola ke posisi yang benar pada skala.",
        navNextQuestion: "Ketuk » untuk tantangan berikutnya.",
        navLast: "Ketuk » untuk menyelesaikan aktivitas.",

        draggables: [
          { id: "redBall", img: "assets/redBall.png", dropzone: 1, coloredItem: "bola merah" },
          { id: "blueBall", img: "assets/blueBall.png", dropzone: 1, coloredItem: "bola biru" },
          { id: "orangeBall", img: "assets/orangeBall.png", dropzone: 5, coloredItem: "oranye" },
        ],
      },
    ],

    final: {
      heading: "Bagus Sekali! Aktivitas Selesai!",
      text: "Kamu memperkirakan probabilitas dengan benar!<br>Kamu sekarang dapat menggunakan skala dan mengetahui apakah suatu kejadian<br><y>mustahil, kurang mungkin, mungkin, lebih mungkin, atau pasti!</y><br><br><br>Ketuk 'Ulangi' untuk mengulangi aktivitas ini.",
      buttonText: "Ulangi",
    },
  },
};

const APP_DATA = DATA[current_language];
