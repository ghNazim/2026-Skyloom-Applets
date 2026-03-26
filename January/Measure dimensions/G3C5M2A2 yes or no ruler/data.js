const questions = [
  {
    ctKey: "q1_ct",
    nKey: "q1_n",
    ans: "No",
    feedbackCorrectKey: "q1_feedbackCorrect",
    feedbackWrongKey: "q1_feedbackWrong",
    navCorrectKey: "q1_navCorrect",
    image: "q1.svg",
    imageCorrect: "q1correct.svg",
    imageWrong: "q1wrong.svg",
    visualCharacter: "rizky.png",
    vtKey: null,
    vtCorrectKey: null,
    vtWrongKey: null,
  },
  {
    ctKey: "q2_ct",
    nKey: "q1_n",
    ans: "No",
    feedbackCorrectKey: "q2_feedbackCorrect",
    feedbackWrongKey: "q2_feedbackWrong",
    navCorrectKey: "q2_navCorrect",
    image: "q2.svg",
    imageCorrect: "q2correct.svg",
    imageWrong: "q2wrong.svg",
    visualCharacter: "farhan.png",
    vtKey: null,
    vtCorrectKey: null,
    vtWrongKey: null,
  },
  {
    ctKey: "q3_ct",
    nKey: "q1_n",
    ans: "Yes",
    feedbackCorrectKey: "q3_feedbackCorrect",
    feedbackWrongKey: "q3_feedbackWrong",
    navCorrectKey: "q3_navCorrect",
    image: "q3.svg",
    imageCorrect: null,
    imageWrong: null,
    visualCharacter: "rizky.png",
    vtKey: "q3_vt",
    vtCorrectKey: null,
    vtWrongKey: null,
  },
  {
    ctKey: "q4_ct",
    nKey: "q1_n",
    ans: "No",
    feedbackCorrectKey: "q4_feedbackCorrect",
    feedbackWrongKey: "q4_feedbackWrong",
    navCorrectKey: "q4_navCorrect",
    image: "q4.svg",
    imageCorrect: null,
    imageWrong: null,
    visualCharacter: "farhan.png",
    vtKey: "q4_vt",
    vtCorrectKey: "q4_vtCorrect",
    vtWrongKey: "q4_vtWrong",
  },
  // {
  //   ctKey: "q5_ct",
  //   nKey: "q1_n",
  //   ans: "No",
  //   feedbackCorrectKey: "q5_feedbackCorrect",
  //   feedbackWrongKey: "q5_feedbackWrong",
  //   navCorrectKey: "q5_navCorrect",
  //   image: "q5.svg",
  //   imageCorrect: "q5correct.svg",
  //   imageWrong: "q5wrong.svg",
  //   visualCharacter: "rizky.png",
  //   vtKey: "q5_vt",
  //   vtCorrectKey: "q5_vtCorrect",
  //   vtWrongKey: null,
  // },
  // {
  //   ctKey: "q6_ct",
  //   nKey: "q1_n",
  //   ans: "No",
  //   feedbackCorrectKey: "q6_feedbackCorrect",
  //   feedbackWrongKey: "q6_feedbackWrong",
  //   navCorrectKey: "q6_navCorrect",
  //   image: "q6.svg",
  //   imageCorrect: "q6correct.svg",
  //   imageWrong: "q6wrong.svg",
  //   visualCharacter: "farhan.png",
  //   vtKey: "q6_vt",
  //   vtCorrectKey: "q6_vtCorrect",
  //   vtWrongKey: "q6_vtWrong",
  // },
  // {
  //   ctKey: "q7_ct",
  //   nKey: "q1_n",
  //   ans: "Yes",
  //   feedbackCorrectKey: "q7_feedbackCorrect",
  //   feedbackWrongKey: "q7_feedbackWrong",
  //   navCorrectKey: "q7_navCorrect",
  //   image: "q7.svg",
  //   imageCorrect: null,
  //   imageWrong: "q7wrong.svg",
  //   visualCharacter: "rizky.png",
  //   vtKey: "q7_vt",
  //   vtCorrectKey: null,
  //   vtWrongKey: "q7_vtWrong",
  // },
];

const DATA = {
  en: {
    app: {
      options: { Yes: "Yes", No: "No" },
      start: {
        heading: "Measuring Objects",
        text: "Farhan and Rizky are finding the length and height of an object.<br> Let's see if they are doing it right.",
        buttonText: "Start",
      },
      steps: {
        1: {
          nKey: "nav_default",
          questions: questions,
          texts: {
            nav_default: "Tap the correct option.",
            q1_ct: "Is Rizky measuring the length correctly?",
            q1_feedbackCorrect:
              "That’s correct! When we measure length, we place left end of the object on “0” marking.",
            q1_feedbackWrong:
              "Oops! The left end of the object should be on “0” marking. Try again.",
            q1_navCorrect: "Tap » to see what is Farhan up to.",
            q1_vt: null,
            q1_vtCorrect: null,
            q2_ct: "Is Farhan measuring the length correctly?",
            q2_feedbackCorrect:
              "That’s correct! When we measure length, we place the object along the ruler.",
            q2_feedbackWrong:
              "Oops! We should place the object along the ruler. Try again.",
            q2_navCorrect: "Tap » to see another scenario.",
            q2_vt: null,
            q2_vtCorrect: null,
            q3_ct: "Is Rizky measuring the length correctly?",
            q3_feedbackCorrect:
              "That’s correct! Rizky measured and read the length correctly.",
            q3_feedbackWrong:
              "Oops! He measured and read the length correctly.",
            q3_navCorrect: "Tap » to see the next scenario.",
            q3_vt: "Length of the clips is 3 cm.",
            // q3_vtCorrect: "Length of the book is <green>4</green> clips.",
            q4_ct: "Is Farhan measuring the length correctly?",
            q4_feedbackCorrect:
              "Yes, Farhan measured the length correctly. But the reading was wrong.",
            q4_feedbackWrong:
              "Oops! The distance between two numbers is centimeter and length of each small division is millimeter. Try again.",
            q4_navCorrect: "Tap » to start over.",
            q4_vt: "Length of the duster is 5 cm and 13 mm.",
            q4_vtCorrect:
              "Length of the duster is <green>13 cm</green> and <green>5 mm</green>.",
            q4_vtWrong:
              "Length of the duster is <red>5 cm</red> and <red>13 mm</red>.",
            q5_ct: "Is Rizky measuring the height correctly?",
            q5_feedbackCorrect:
              "That's correct! When we measure, we place objects along the board.",
            q5_feedbackWrong:
              "Oops! The clips needs to be placed along the board. Check again.",
            q5_navCorrect: "Tap » to see two more scenarios",
            q5_vt: "Height of the book is 5 clips.",
            q5_vtCorrect: "Height of the book is <green>4</green> clips.",
            q6_ct: "Is Farhan measuring the height correctly?",
            q6_feedbackCorrect:
              "That's correct! He made a mistake when counting.",
            q6_feedbackWrong:
              "Oops! There are 5 clips placed, but he said height as 4 clips. Check again",
            q6_navCorrect: "Tap » to see one more scenario.",
            q6_vt: "Height of the bottle is 4 clips.",
            q6_vtCorrect: "Height of the bottle is <green>5</green> clips.",
            q6_vtWrong: "Height of the bottle is <red>4</red> clips.",
            q7_ct: "Is Rizky measuring the height correctly?",
            q7_feedbackCorrect: "Yes, Rizky measured the height correctly.",
            q7_feedbackWrong:
              "Oops! Check again. He placed and counted the clips correctly.",
            q7_navCorrect: "Tap » to start over.",
            q7_vt: "Height of the glass is 4 clips.",
            q7_vtWrong: "Height of the glass is <red>4</red> clips.",
          },
        },
      },
      final: {
        heading: "Measuring Objects",
        text: "Awesome! You helped Farhan and Rizky measure correctly!",
        buttonText: "Start Over",
      },
    },
  },
  id: {
    app: {
      options: { Yes: "Ya", No: "Tidak" },
      start: {
        heading: "Mengukur Benda",
        text: "Farhan dan Rizky sedang mencari panjang dan tinggi suatu benda.<br> Mari kita lihat apakah mereka melakukannya dengan benar.",
        buttonText: "Mulai",
      },
      steps: {
        1: {
          nKey: "nav_default",
          questions: questions,
          texts: {
            nav_default: "Ketuk pilihan yang benar.",
            q1_ct: "Apakah Rizky mengukur panjang dengan benar?",
            q1_feedbackCorrect:
              "Benar! Saat kita mengukur panjang, kita menempatkan ujung kiri benda pada angka \"0\".",
            q1_feedbackWrong:
              "Ups! Ujung kiri benda harus berada pada angka \"0\". Coba lagi.",
            q1_navCorrect: "Ketuk » untuk melihat apa yang dilakukan Farhan.",
            q1_vt: null,
            q1_vtCorrect: null,
            q2_ct: "Apakah Farhan mengukur panjang dengan benar?",
            q2_feedbackCorrect:
              "Benar! Saat kita mengukur panjang, kita menempatkan benda sejajar dengan penggaris.",
            q2_feedbackWrong:
              "Ups! Kita harus menempatkan benda sejajar dengan penggaris. Coba lagi.",
            q2_navCorrect: "Ketuk » untuk melihat skenario lain.",
            q2_vt: null,
            q2_vtCorrect: null,
            q3_ct: "Apakah Rizky mengukur panjang dengan benar?",
            q3_feedbackCorrect:
              "Benar! Rizky mengukur dan membaca panjang dengan benar.",
            q3_feedbackWrong:
              "Ups! Dia mengukur dan membaca panjang dengan benar.",
            q3_navCorrect: "Ketuk » untuk melihat skenario berikutnya.",
            q3_vt: "Panjang klip adalah 3 cm.",
            q4_ct: "Apakah Farhan mengukur panjang dengan benar?",
            q4_feedbackCorrect:
              "Ya, Farhan mengukur panjang dengan benar. Tapi pembacaannya salah.",
            q4_feedbackWrong:
              "Ups! Jarak antara dua angka adalah sentimeter dan panjang setiap bagian kecil adalah milimeter. Coba lagi.",
            q4_navCorrect: "Ketuk » untuk memulai ulang.",
            q4_vt: "Panjang penghapus papan tulis adalah 5 cm dan 13 mm.",
            q4_vtCorrect:
              "Panjang penghapus papan tulis adalah <green>13 cm</green> dan <green>5 mm</green>.",
            q4_vtWrong:
              "Panjang penghapus papan tulis adalah <red>5 cm</red> dan <red>13 mm</red>.",
            q5_ct: "Apakah Rizky mengukur tinggi dengan benar?",
            q5_feedbackCorrect:
              "Benar! Saat kita mengukur, kita menempatkan benda sejajar dengan papan.",
            q5_feedbackWrong:
              "Ups! Klip harus ditempatkan sejajar dengan papan. Periksa lagi.",
            q5_navCorrect: "Ketuk » untuk melihat dua skenario lagi",
            q5_vt: "Tinggi buku adalah 5 klip.",
            q5_vtCorrect: "Tinggi buku adalah <green>4</green> klip.",
            q6_ct: "Apakah Farhan mengukur tinggi dengan benar?",
            q6_feedbackCorrect:
              "Benar! Dia membuat kesalahan saat menghitung.",
            q6_feedbackWrong:
              "Ups! Ada 5 klip yang ditempatkan, tapi dia menyebut tinggi 4 klip. Periksa lagi.",
            q6_navCorrect: "Ketuk » untuk melihat satu skenario lagi.",
            q6_vt: "Tinggi botol adalah 4 klip.",
            q6_vtCorrect: "Tinggi botol adalah <green>5</green> klip.",
            q6_vtWrong: "Tinggi botol adalah <red>4</red> klip.",
            q7_ct: "Apakah Rizky mengukur tinggi dengan benar?",
            q7_feedbackCorrect: "Ya, Rizky mengukur tinggi dengan benar.",
            q7_feedbackWrong:
              "Ups! Periksa lagi. Dia menempatkan dan menghitung klip dengan benar.",
            q7_navCorrect: "Ketuk » untuk memulai ulang.",
            q7_vt: "Tinggi gelas adalah 4 klip.",
            q7_vtWrong: "Tinggi gelas adalah <red>4</red> klip.",
          },
        },
      },
      final: {
        heading: "Mengukur Benda",
        text: "Luar biasa! Kamu membantu Farhan dan Rizky mengukur dengan benar!",
        buttonText: "Mulai Ulang",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
