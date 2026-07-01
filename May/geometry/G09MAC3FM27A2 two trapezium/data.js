const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      steps: {
        1: {
          questionText: "Answer the following questions.",
          navText: "Tap \u00BB to identify what is given.",
        },
        2: {
          questionText: "Read the question and identify 'given' and 'to find'.",
          navText: "Tap \u00BB to identify what to find in the first part.",
        },
        3: {
          questionText: "Read the question and identify 'given' and 'to find'.",
          navText: "Tap \u00BB to solve the first part.",
        },
        4: {
          questionText: "Let's find the unknown side lengths in the two congruent trapezoids.",
          navText: "Tap one of the '?' button to find the side length.",
          tapCorresponding: "Tap the side length in {polygon} that corresponds to {side}.",
          tapCorrectSide: "Tap the correct side in {polygon}.",
          sideFound: "The side length of {side} is {length} cm.",
          allFoundNav: "Tap \u00BB to solve the second part of the question.",
        },
        5: {
          questionText: "Let's find the unknown angles in trapezoid PQRS.",
          navText: "Tap \u00BB to solve the second part.",
        },
        6: {
          questionText: "Identify the angle in ABCD that corresponds to \u2220Q.",
          navText: "Tap the corresponding angle in ABCD.",
          identifyAngle: "Identify the angle in ABCD that corresponds to \u2220{angle}.",
          tapCorresponding: "Tap the corresponding angle in ABCD.",
          correspondDone: "\u2220C \u2192 \u2220R and \u2220D \u2192 \u2220S",
          correspondDoneNav: "Tap \u00BB to find the unknown angles.",
        },
        7: {
          questionText: "To find the unknown angles, we need to use a property of a trapezoid.",
          navText: "Tap the button to recall the property of trapezoid.",
          propertyBtn: "Property of trapezoid",
          propertyText: "The consecutive angles along each leg of a trapezoid add up to 180\u00B0.",
          propertyTitle: "Consecutive Angle Property of Trapezoid",
          tapCue: "Tap '?' button to find the angle using this property.",
          allFoundNav: "Tap \u00BB to summarize",
        },
        8: {
          navText: "Activity Completed",
          startOver: "Start Over",
        },
      },
      problem: {
        part1: "Observe the trapezoids ABCD and PQRS shown below, which are congruent.",
        part2a: "a. Determine the lengths of sides AD, DC, PQ, and QR.",
        part2b: "b. If \u2220A = 60\u00B0 and \u2220B = 40\u00B0, what are the measures of other angles?",
      },
      purpleBox: "ABCD \u2245 PQRS",
    },
  },
  id: {
    app: {
      steps: {
        1: {
          questionText: "Jawab pertanyaan-pertanyaan berikut.",
          navText: "Ketuk \u00BB untuk mengidentifikasi apa yang diketahui.",
        },
        2: {
          questionText: "Baca pertanyaan dan identifikasi 'yang diketahui' dan 'yang dicari'.",
          navText: "Ketuk \u00BB untuk mengidentifikasi apa yang dicari di bagian pertama.",
        },
        3: {
          questionText: "Baca pertanyaan dan identifikasi 'yang diketahui' dan 'yang dicari'.",
          navText: "Ketuk \u00BB untuk menyelesaikan bagian pertama.",
        },
        4: {
          questionText: "Mari temukan panjang sisi yang belum diketahui pada dua trapesium kongruen.",
          navText: "Ketuk salah satu tombol '?' untuk mencari panjang sisi.",
          tapCorresponding: "Ketuk panjang sisi di {polygon} yang bersesuaian dengan {side}.",
          tapCorrectSide: "Ketuk sisi yang benar di {polygon}.",
          sideFound: "Panjang sisi {side} adalah {length} cm.",
          allFoundNav: "Ketuk \u00BB untuk menyelesaikan bagian kedua pertanyaan.",
        },
        5: {
          questionText: "Mari temukan sudut-sudut yang belum diketahui pada trapesium PQRS.",
          navText: "Ketuk \u00BB untuk menyelesaikan bagian kedua.",
        },
        6: {
          questionText: "Identifikasi sudut pada ABCD yang bersesuaian dengan \u2220Q.",
          navText: "Ketuk sudut yang bersesuaian pada ABCD.",
          identifyAngle: "Identifikasi sudut pada ABCD yang bersesuaian dengan \u2220{angle}.",
          tapCorresponding: "Ketuk sudut yang bersesuaian pada ABCD.",
          correspondDone: "\u2220C \u2192 \u2220R dan \u2220D \u2192 \u2220S",
          correspondDoneNav: "Ketuk \u00BB untuk mencari sudut yang belum diketahui.",
        },
        7: {
          questionText: "Untuk menemukan sudut yang belum diketahui, kita perlu menggunakan sifat trapesium.",
          navText: "Ketuk tombol untuk mengingat sifat trapesium.",
          propertyBtn: "Sifat trapesium",
          propertyText: "Sudut-sudut yang berurutan di sepanjang kaki trapesium berjumlah 180\u00B0.",
          propertyTitle: "Sifat Sudut Berurutan Trapesium",
          tapCue: "Ketuk tombol '?' untuk mencari sudut menggunakan sifat ini.",
          allFoundNav: "Ketuk \u00BB untuk merangkum",
        },
        8: {
          navText: "Aktivitas Selesai",
          startOver: "Mulai Lagi",
        },
      },
      problem: {
        part1: "Perhatikan trapesium ABCD dan PQRS yang ditunjukkan di bawah ini, yang kongruen.",
        part2a: "a. Tentukan panjang sisi AD, DC, PQ, dan QR.",
        part2b: "b. Jika \u2220A = 60\u00B0 dan \u2220B = 40\u00B0, berapa ukuran sudut-sudut lainnya?",
      },
      purpleBox: "ABCD \u2245 PQRS",
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
