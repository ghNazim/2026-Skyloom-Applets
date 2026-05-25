const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Length of Objects",
        text: "Since comparing 2 line segments is not always possible, we can use another object of known length to compare them.<br><br>In this way, we are using the other object as a measuring instrument. Let's explore how.",
        buttonText: "Start",
        imageSrc: "assets/start.svg",
      },
      steps: {
        1: {
          questionText: "Which is shorter? The eraser or the pencil?",
          navText: "Tap the correct button as per the question",
          navNext: "Tap » to continue",
          mcq: {
            title:
              "Here, you see an eraser placed next to a pencil.<br>Which one of them is shorter?",
            options: ["Eraser", "Pencil"],
            answer: "Eraser",
            feedback:
              "Correct! We can clearly see that the eraser is of shorter length than the pencil.<br><br>We can now use the smaller eraser to measure the length of the pencil.",
          },
        },
        2: {
          questionText: "How many erasers make up the pencil?",
          navText: "Tap the eraser to add, then tap check when you are done…",
          navNext: "Tap » to continue",
          checkButton: "Check",
          correctCount: 6,
          texts: {
            default:
              "Stack these erasers next to the pencil to find out how many erasers are required to make up the length of this pencil.",
            wrongLesser:
              "Oops! You need to keep stacking erasers to match the full length of the pencil! Add a few more…",
            wrongExtra:
              "Oops! You need to keep stacking erasers to match the full length of the pencil! Remove an eraser by tapping the blinking eraser next to the pencil.",
            correct:
              "Good job!<br><br>6 erasers stack up to the length of the pencil starting from one end to the other.<br><br>We can say that the pencil is 6 erasers long!",
          },
        },
        3: {
          questionText: "How many erasers make up the pencil-box?",
          navText: "Tap the eraser to add, then tap check when you are done…",
          navNext: "Tap » to continue",
          checkButton: "Check",
          correctCount: 7,
          texts: {
            default:
              "Stack these erasers next to the pencil-box to find out how many erasers are required to make up the length of this pencil-box.",
            wrongLesser:
              "Oops! You need to keep stacking erasers to match the full length of the pencil-box! Add more…",
            wrongExtra:
              "Oops! You need to keep stacking erasers to match the full length of the pencil box! Remove an eraser by tapping the blinking eraser next to the pencil box.",
            correct:
              "Good job!<br><br>7 erasers stack up to the length of the pencil-box starting from one end to the other.<br><br>We can say that the pencil box is 7 erasers long!",
          },
        },
        4: {
          questionText: "Which is longer? The pencil or the pencil-box?",
          navText: "Tap the correct image as per the question",
          navNext: "Tap » to continue",
          options: {
            pencil: {
              heading: "the pencil is <y>6 erasers long</y>",
              imageSrc: "assets/pencil_length.svg",
              wrongFeedback: "Oops! Is 6 > 7?",
            },
            box: {
              heading: "the pencil-box is <y>7 erasers long</y>",
              imageSrc: "assets/box_length.svg",
              correctFeedback:
                "That's Right! 7 > 6, so the length of 7 erasers is longer than 6 erasers!",
            },
          },
        },
        5: {
          questionText: "Where were the line segments in these objects?",
          navText: "Tap » to continue",
          text: "Each of the lengths we explored is nothing but a line segment!",
          labels: {
            box: "Pencil Box",
            pencil: "Pencil",
            eraser: "Eraser",
          },
        },
        6: {
          questionText: "Where were the line segments in these objects?",
          navText: "Tap » to explore measurement of Ray and Line",
          text: "We placed the ERASER line segment from one end to the other end to measure the length of the PENCIL and PENCIL-BOX line segments!",
        },
        7: {
          questionText: "Which line is longer?",
          navText: "Tap the correct button as per the question",
          navNext: "Tap » to summarise",
          mcq: {
            options: ["AB", "MN", "Cannot Say"],
            answer: "Cannot Say",
            wrongFeedback:
              "Oops!<br>Both lines extend forever! Where will you start measuring and where will you stop?",
            correctFeedback:
              "That's Right! We really can't say what the length measure is for a Line, or even a Ray as they extend forever!",
          },
        },
      },
      summary: {
        heading: "Length of Objects",
        text: "We can measure the length of unknown line segments using a line segment of known length.<br><br>We explored this using a known eraser, placed from one end to the other, to find and compare the lengths of unknown pencil and pencil-box.<br><br>There is no concept of length measure for Rays and Lines!",
        buttonText: "Start Over",
        imageSrc: "assets/start.svg",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Panjang Benda",
        text: "Karena membandingkan 2 ruas garis tidak selalu memungkinkan, kita dapat menggunakan benda lain dengan panjang yang diketahui untuk membandingkannya.<br>Dengan cara ini, kita menggunakan benda lain sebagai alat ukur. Mari kita jelajahi caranya.",
        buttonText: "Mulai",
        imageSrc: "assets/start.svg",
      },
      steps: {
        1: {
          questionText: "Mana yang lebih pendek? Penghapus atau pensil?",
          navText: "Ketuk tombol yang benar sesuai pertanyaan",
          navNext: "Ketuk » untuk melanjutkan",
          mcq: {
            title:
              "Di sini, kamu melihat penghapus diletakkan di samping pensil.<br>Mana yang lebih panjang?",
            options: ["Penghapus", "Pensil"],
            answer: "Pensil",
            feedback:
              "Benar! Kita dapat melihat dengan jelas bahwa penghapus memiliki panjang yang lebih pendek daripada pensil.<br><br>Sekarang kita dapat menggunakan penghapus yang lebih kecil untuk mengukur panjang pensil.",
          },
        },
        2: {
          questionText: "Berapa penghapus yang membentuk panjang pensil?",
          navText: "Ketuk penghapus untuk menambah, lalu ketuk periksa jika sudah selesai…",
          navNext: "Ketuk » untuk melanjutkan",
          checkButton: "Periksa",
          correctCount: 6,
          texts: {
            default:
              "Susun penghapus ini di samping pensil untuk mengetahui berapa penghapus yang diperlukan untuk membentuk panjang pensil ini.",
            wrongLesser:
              "Ups! Kamu perlu terus menumpuk penghapus agar sesuai dengan panjang penuh pensil! Tambahkan beberapa lagi…",
            wrongExtra:
              "Ups! Kamu perlu terus menumpuk penghapus agar sesuai dengan panjang penuh pensil! Hapus penghapus dengan mengetuk penghapus yang berkedip di samping pensil.",
            correct:
              "Bagus!<br><br>6 penghapus membentuk panjang pensil dari ujung satu ke ujung yang lain.<br><br>Kita dapat mengatakan bahwa pensil ini panjangnya 6 penghapus!",
          },
        },
        3: {
          questionText: "Berapa penghapus yang membentuk panjang kotak pensil?",
          navText: "Ketuk penghapus untuk menambah, lalu ketuk periksa jika sudah selesai…",
          navNext: "Ketuk » untuk melanjutkan",
          checkButton: "Periksa",
          correctCount: 7,
          texts: {
            default:
              "Susun penghapus ini di samping kotak pensil untuk mengetahui berapa penghapus yang diperlukan untuk membentuk panjang kotak pensil ini.",
            wrongLesser:
              "Ups! Kamu perlu terus menumpuk penghapus agar sesuai dengan panjang penuh kotak pensil! Tambahkan lagi…",
            wrongExtra:
              "Ups! Kamu perlu terus menumpuk penghapus agar sesuai dengan panjang penuh kotak pensil! Hapus penghapus dengan mengetuk penghapus yang berkedip di samping kotak pensil.",
            correct:
              "Bagus!<br><br>7 penghapus membentuk panjang kotak pensil dari ujung satu ke ujung yang lain.<br><br>Kita dapat mengatakan bahwa kotak pensil ini panjangnya 7 penghapus!",
          },
        },
        4: {
          questionText: "Mana yang lebih panjang? Pensil atau kotak pensil?",
          navText: "Ketuk gambar yang benar sesuai pertanyaan",
          navNext: "Ketuk » untuk melanjutkan",
          options: {
            pencil: {
              heading: "pensil ini panjangnya <y>6 penghapus</y>",
              imageSrc: "assets/pencil_length.svg",
              wrongFeedback: "Ups! Apakah 6 > 7?",
            },
            box: {
              heading: "kotak pensil ini panjangnya <y>7 penghapus</y>",
              imageSrc: "assets/box_length.svg",
              correctFeedback:
                "Benar! 7 > 6, jadi panjang 7 penghapus lebih panjang dari 6 penghapus!",
            },
          },
        },
        5: {
          questionText: "Di manakah ruas garis pada benda-benda ini?",
          navText: "Ketuk » untuk melanjutkan",
          text: "Setiap panjang yang kita jelajahi tidak lain adalah ruas garis!",
          labels: {
            box: "Kotak Pensil",
            pencil: "Pensil",
            eraser: "Penghapus",
          },
        },
        6: {
          questionText: "Di manakah ruas garis pada benda-benda ini?",
          navText: "Ketuk » untuk menjelajahi pengukuran Sinar dan Garis",
          text: "Kita menempatkan ruas garis PENGHAPUS dari ujung satu ke ujung lainnya untuk mengukur panjang ruas garis PENSIL dan KOTAK PENSIL!",
        },
        7: {
          questionText: "Garis mana yang lebih panjang?",
          navText: "Ketuk tombol yang benar sesuai pertanyaan",
          navNext: "Ketuk » untuk merangkum",
          mcq: {
            options: ["AB", "MN", "Tidak Dapat Ditentukan"],
            answer: "Tidak Dapat Ditentukan",
            wrongFeedback:
              "Ups! Kedua garis memanjang selamanya! Di mana kamu akan mulai mengukur dan di mana kamu akan berhenti?",
            correctFeedback:
              "Benar! Kita memang tidak dapat menentukan ukuran panjang Garis, atau bahkan Sinar, karena keduanya memanjang selamanya!",
          },
        },
      },
      summary: {
        heading: "Panjang Benda",
        text: "Kita dapat mengukur panjang ruas garis yang tidak diketahui menggunakan ruas garis dengan panjang yang diketahui.<br>Kita menjelajahi ini menggunakan penghapus yang diketahui, ditempatkan dari ujung satu ke ujung lain, untuk menemukan dan membandingkan panjang pensil dan kotak pensil yang tidak diketahui.<br>Tidak ada konsep ukuran panjang untuk Sinar dan Garis!",
        buttonText: "Mulai Lagi",
        imageSrc: "assets/start.svg",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
