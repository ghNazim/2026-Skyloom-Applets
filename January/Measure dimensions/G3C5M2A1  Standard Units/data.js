// const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      title: "Standard Units",
      start: {
        heading: "Standard Units",
        text: "Farhan and Aisha are measuring the length<br>of a pencil. Let's see what they are up to.",
        buttonText: "Start",
      },
      step1Farhan: {
        q: "Farhan is measuring a pencil with his eraser.",
        n: "Tap the eraser to see how he measured.",
      },
      step2Farhan: {
        q: "Shout out the length of the pencil.",
        n: "Tap the pencil to see the answer.",
        qAfter: "The length of the pencil is <y>3</y> erasers long.",
        nAfter: "Tap » to see what Aisha is up to.",
        eraserCountTop: "<y>3</y> erasers",
      },
      step3Aisha: {
        q: "Aisha is measuring the same pencil with her eraser.",
        n: "Tap the eraser to see how she measured.",
      },
      step4Aisha: {
        q: "Shout out the length of the pencil.",
        n: "Tap the pencil to see the answer.",
        qAfter: "The length of the pencil is <y>4</y> erasers long.",
        nAfter: "Tap » to continue.",
        eraserCountTop: "<y>4</y> erasers",
      },
      step5: {
        q: "How did Farhan and Aisha get different lengths for the same pencil?",
        n: "Tap the correct button.",
        nAfter: "Tap » to continue.",
        farhanLabel: "<y>3</y> erasers",
        aishaLabel: "<y>4</y> erasers",
        options: [
          "Both measured\nwrong.",
          "They used different\nsizes of pencils.",
          "They used different\nerasers.",
        ],
        correctIndex: 2,
        feedbacks: [
          "Nope! Both placed\nerasers from one\nend to the other.",
          "Nope! Both used\nsame size of\npencils.",
          "That's correct! Both\nmeasured correctly,\nbut the erasers\nwere different sizes!",
        ],
      },
      step6: {
        q: "To get the same length, everyone should use objects of the same size.<br>But objects, hands and feet are different sizes.",
        n: "Tap » to continue.",
      },
      step7: {
        q: "We need something that is the same for everyone. What could it be? Shout it out!",
        n: "Tap the button to reveal the object.",
        buttonText: "Tool to measure",
      },
      step8: {
        q: "It's a ruler. It is the same size everywhere and helps us measure objects.",
        n: "Tap » to know about the ruler.",
        rulerLabel: "Ruler",
      },
      step9: {
        q: "The length from 0 to 1 is <gr>1 centimeter</gr>. It is written as <gr>1 cm</gr>.",
        n: "Tap numbers to see the length from 0 to the number.",
        nAfterTap: "Tap » after exploration.",
        unitCm: "cm",
        qTemplate:
          "The length from 0 to {{n}} is <gr>{{n}} centimeters</gr>. It is written as <gr>{{n}} cm</gr>.",
        qTemplate1:
          "The length from 0 to 1 is <gr>1 centimeter</gr>. It is written as <gr>1 cm</gr>.",
      },
      step10: {
        q: "Use the magnifying glass to zoom in on the ruler.",
        n: "Tap the magnifying glass.",
        qAfter: "There are 10 small divisions between two numbers.",
        nAfter: "Tap » to see the length of small division.",
        zoomAlt: "zoom",
      },
      step11: {
        q: [
          "",
          "The length of one small division is <bl>one millimeter</bl>. It is written as <bl>1mm</bl>.",
          "The length of two small divisions is <bl>two millimeters</bl>. It is written as <bl>2mm</bl>.",
          "The length of three small divisions is <bl>three millimeters</bl>. It is written as <bl>3mm</bl>.",
          "The length of four small divisions is <bl>four millimeters</bl>. It is written as <bl>4mm</bl>.",
          "The length of five small divisions is <bl>five millimeters</bl>. It is written as <bl>5mm</bl>.",
          "The length of six small divisions is <bl>six millimeters</bl>. It is written as <bl>6mm</bl>.",
          "The length of seven small divisions is <bl>seven millimeters</bl>. It is written as <bl>7mm</bl>.",
          "The length of eight small divisions is <bl>eight millimeters</bl>. It is written as <bl>8mm</bl>.",
          "The length of nine small divisions is <bl>nine millimeters</bl>. It is written as <bl>9mm</bl>.",
          "The length of ten small divisions is <bl>ten millimeters</bl>. It is written as <bl>10mm</bl>.",
        ],
        n: "Tap the next small division to see the length from 0 to it.",
        qFinal: "<gr>1 centimeter</gr> = <bl>10 millimeters</bl>",
        nFinal: "Tap » to see the entire length of the ruler.",
        unitMm: "mm",
        cm1Label: "1 cm",
      },
      step12: {
        q: "Explore measurements in <gr>centimeters (cm)</gr> and <bl>millimeters (mm)</bl> using a ruler.",
        n: "Tap and drag the slider.",
        nAfterTap: "Tap » after exploration.",
        labelCm: "cm",
        labelAnd: "and",
        labelMm: "mm",
      },
      step13: {
        q: "Let’s measure the length of the pencil using the ruler.",
        n: "Tap the pencil to place it along the ruler.",
      },
      step14: {
        q: "While measuring the length, place the left end on the “0” marking. Now, shout out the length of the pencil.",
        n: "Tap the pencil to see the answer.",
        qFinal:
          "Length of the pencil is <span style='color: #00bfa5;'>13 centimeters</span> <span style='color: #ffb300;'>and</span> <span style='color: #00b0ff;'>5 millimeters</span>.",
        nFinal: "Tap » to measure one more object.",
      },
      step15: {
        q: "Let’s measure the length of the eraser using the ruler.",
        n: "Tap the eraser to place it along the ruler.",
      },
      step16: {
        q: "Shout out the length of the eraser",
        n: "Tap the eraser to see the answer.",
        qFinal:
          "Length of the eraser is <span style='color: #00bfa5;'>4 centimeters</span> <span style='color: #ffb300;'>and</span> <span style='color: #00b0ff;'>5 millimeters</span>.",
        nFinal: " Tap » to finish.",
      },
      step17: {
        heading: "Standard units",
        text: "Awesome! We learned how to measure the length<br> of an object in <gr>cm</gr> and <bl>mm</bl> using the ruler.",
        buttonText: "Start Over",
      },
    },
  },
  id: {
    app: {
      title: "Satuan Baku",
      start: {
        heading: "Satuan Baku",
        text: "Farhan dan Aisha mengukur panjang<br>pensil. Mari kita lihat apa yang mereka lakukan.",
        buttonText: "Mulai",
      },
      step1Farhan: {
        q: "Farhan mengukur pensil dengan penghapusnya.",
        n: "Ketuk penghapus untuk melihat cara dia mengukur.",
      },
      step2Farhan: {
        q: "Sebutkan panjang pensil.",
        n: "Ketuk pensil untuk melihat jawabannya.",
        qAfter: "Panjang pensil adalah <y>3</y> penghapus.",
        nAfter: "Ketuk » untuk melihat apa yang dilakukan Aisha.",
        eraserCountTop: "<y>3</y> penghapus",
      },
      step3Aisha: {
        q: "Aisha mengukur pensil yang sama dengan penghapusnya.",
        n: "Ketuk penghapus untuk melihat cara dia mengukur.",
      },
      step4Aisha: {
        q: "Sebutkan panjang pensil.",
        n: "Ketuk pensil untuk melihat jawabannya.",
        qAfter: "Panjang pensil adalah <y>4</y> penghapus.",
        nAfter: "Ketuk » untuk melanjutkan.",
        eraserCountTop: "<y>4</y> penghapus",
      },
      step5: {
        q: "Bagaimana Farhan dan Aisha mendapatkan panjang yang berbeda untuk pensil yang sama?",
        n: "Ketuk tombol yang benar.",
        nAfter: "Ketuk » untuk melanjutkan.",
        farhanLabel: "<y>3</y> penghapus",
        aishaLabel: "<y>4</y> penghapus",
        options: [
          "Keduanya mengukur\ndengan salah.",
          "Mereka menggunakan\npensil dengan\nukuran berbeda.",
          "Mereka menggunakan\npenghapus yang\nberbeda.",
        ],
        correctIndex: 2,
        feedbacks: [
          "Tidak! Keduanya\nmenempatkan penghapus\ndari ujung ke ujung.",
          "Tidak! Keduanya\nmenggunakan pensil\ndengan ukuran\nyang sama.",
          "Benar! Keduanya\nmengukur dengan benar,\ntetapi penghapusnya\nberbeda ukuran!",
        ],
      },
      step6: {
        q: "Untuk mendapatkan panjang yang sama, semua orang harus menggunakan benda dengan ukuran yang sama.<br>Tapi benda, tangan dan kaki berbeda ukurannya.",
        n: "Ketuk » untuk melanjutkan.",
      },
      step7: {
        q: "Kita membutuhkan sesuatu yang sama untuk semua orang. Apa itu? Serukan!",
        n: "Ketuk tombol untuk menampilkan benda.",
        buttonText: "Alat untuk mengukur",
      },
      step8: {
        q: "Ini penggaris. Ukurannya sama di mana saja dan membantu kita mengukur benda.",
        n: "Ketuk » untuk mengetahui tentang penggaris.",
        rulerLabel: "Penggaris",
      },
      step9: {
        q: "Panjang dari 0 ke 1 adalah 1 sentimeter. Ditulis sebagai 1 cm.",
        n: "Ketuk angka untuk melihat panjang dari 0 ke angka tersebut.",
        nAfterTap: "Ketuk » setelah eksplorasi.",
        unitCm: "cm",
        qTemplate:
          "Panjang dari 0 ke {{n}} adalah {{n}} sentimeter. Ditulis sebagai {{n}} cm.",
        qTemplate1:
          "Panjang dari 0 ke 1 adalah 1 sentimeter. Ditulis sebagai 1 cm.",
      },
      step10: {
        q: "Gunakan kaca pembesar untuk memperbesar penggaris.",
        n: "Ketuk kaca pembesar.",
        qAfter: "Ada 10 pembagian kecil di antara dua angka.",
        nAfter: "Ketuk » untuk melihat panjang pembagian kecil.",
        zoomAlt: "perbesar",
      },
      step11: {
        q: [
          "",
          "Panjang satu pembagian kecil adalah satu milimeter. Ditulis sebagai 1 mm.",
          "Panjang dua pembagian kecil adalah dua milimeter. Ditulis sebagai 2 mm.",
          "Panjang tiga pembagian kecil adalah tiga milimeter. Ditulis sebagai 3 mm.",
          "Panjang empat pembagian kecil adalah empat milimeter. Ditulis sebagai 4 mm.",
          "Panjang lima pembagian kecil adalah lima milimeter. Ditulis sebagai 5 mm.",
          "Panjang enam pembagian kecil adalah enam milimeter. Ditulis sebagai 6 mm.",
          "Panjang tujuh pembagian kecil adalah tujuh milimeter. Ditulis sebagai 7 mm.",
          "Panjang delapan pembagian kecil adalah delapan milimeter. Ditulis sebagai 8 mm.",
          "Panjang sembilan pembagian kecil adalah sembilan milimeter. Ditulis sebagai 9 mm.",
          "Panjang sepuluh pembagian kecil adalah sepuluh milimeter. Ditulis sebagai 10 mm.",
        ],
        n: "Ketuk pembagian kecil berikutnya untuk melihat panjang dari 0 ke pembagian tersebut.",
        qFinal: "1 sentimeter = 10 milimeter",
        nFinal: "Ketuk » untuk melihat seluruh panjang penggaris.",
        unitMm: "mm",
        cm1Label: "1 cm",
      },
      step12: {
        q: "Eksplorasi pengukuran dalam sentimeter (cm) dan milimeter (mm) menggunakan penggaris.",
        n: "Ketuk dan seret penggeser.",
        nAfterTap: "Ketuk » setelah eksplorasi.",
        labelCm: "cm",
        labelAnd: "dan",
        labelMm: "mm",
      },
      step13: {
        q: "Mari kita ukur panjang pensil menggunakan penggaris.",
        n: "Ketuk pensil untuk meletakkannya di sepanjang penggaris.",
      },
      step14: {
        q: "Saat mengukur panjang, tempatkan ujung kiri pada tanda \"0\". Sekarang, teriakkan panjang pensil tersebut.",
        n: "Ketuk pensil untuk melihat jawabannya.",
        qFinal: "Panjang pensil adalah <span style='color: #00bfa5;'>13 sentimeter</span> <span style='color: #ffb300;'>dan</span> <span style='color: #00b0ff;'>5 milimeter</span>.",
        nFinal: "Ketuk » untuk mengukur objek lainnya.",
      },
      step15: {
        q: "Mari kita ukur panjang penghapus menggunakan penggaris.",
        n: "Ketuk penghapus untuk meletakkannya di sepanjang penggaris.",
      },
      step16: {
        q: "Sebutkan panjang penghapus.",
        n: "Ketuk penghapus untuk melihat jawabannya.",
        qFinal: "Panjang penghapus adalah <span style='color: #00bfa5;'>4 sentimeter</span> <span style='color: #ffb300;'>dan</span> <span style='color: #00b0ff;'>5 milimeter</span>.",
        nFinal: "Ketuk » untuk menyelesaikan.",
      },
      step17: {
        heading: "Satuan Baku",
        text: "Luar biasa! Kita telah belajar mengukur panjang benda dalam <gr>cm</gr> dan <bl>mm</bl> menggunakan penggaris.",
        buttonText: "Mulai Lagi",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
