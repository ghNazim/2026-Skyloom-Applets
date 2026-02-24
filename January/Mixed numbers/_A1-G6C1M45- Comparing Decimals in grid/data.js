// Comparing Decimals in Grid / data.js



const DATA = {
  en: {
    app: {
      start: {
        heading: "Comparing Decimal Numbers",
        text: "Let us learn how to compare <y>decimal numbers</y> using <br>visual model.",
        buttonText: "Start",
      },
      final: {
        heading: "Comparing Decimal Numbers",
        text: "Now that you understand how the visual model helps <br>compare decimal numbers.<br> Let's compare the next pair of decimal numbers.",
        buttonText: "Continue",
      },
      step6: {
        heading: "Comparing Decimal Numbers",
        text: "<left>Awesome!<br>To compare decimals visually:<br>1. Compare the whole first.<br>2. If the wholes are the same, compare the shaded parts.</left>",
        buttonText: "Start Over",
      },
      nav: {
        next: "Tap » to continue.",
      },
      questions: [
        // Q1: 3.17 vs 2.75
        {
          num1: { val: "3.17", ones: 3, tenths: 1, hundredths: 7 },
          num2: { val: "2.75", ones: 2, tenths: 7, hundredths: 5 },
          step1: {
            q: "Show the decimal number <y>3.17</y> using the visual model.",
            nav: "Use the sliders to show the given number.",
            nAfterCorrect: "Tap » to show next decimal number.",
            correct: "Well done! <br>The model shows 3 ones, 1 tenth, and 7 hundredths exactly as in 3.17.",
            wrong: "Not quite!<br>3.17 needs 3 ones, 1 tenth, and 7 hundredths on the grid. <br>Try adjusting it again.",
          },
          step2: {
            q: "Show the decimal number <y>2.75</y> using the visual model.",
            nav: "Use the sliders to show the given number.",
            nAfterCorrect: "Tap » to compare the decimal numbers.",
            correct: "Well done! <br>The model shows 2 ones, 7 tenths, and 5 hundredths exactly as in 2.75.",
            wrong: "Not quite!<br>2.75 needs 2 ones, 7 tenths, and 5 hundredths on the grid. <br>Try adjusting it again.",
          },
          step3: {
            q: "Which of these numbers is greater?",
            nav: "Tap the correct symbol.",
            nAfterCorrect: "Tap » to see the visual comparison.",
            correctOperator: ">",
            correctFeedback: "You are right! 3.17 has more WHOLEs than 2.75.\nThe number with greater WHOLEs is the greater number.",
            wrongFeedback: "Oops! The number with greater WHOLEs is the greater number."
          },
          step4: {
            q: "Observe the visual comparison.",
            nav: "",
            nAfterAnimation: "Tap » to continue.",
            feedbackAfterAnimation: "3.17 has 1 more whole than 2.75. So 3.17 is greater.",
          },
        },
        // Q2: 2.42 vs 2.61
        {
          num1: { val: "2.42", ones: 2, tenths: 4, hundredths: 2 },
          num2: { val: "2.61", ones: 2, tenths: 6, hundredths: 1 },
          step3: {
            q: "Which of these numbers is greater?",
            nav: "Tap the correct symbol.",
            nAfterCorrect: "Tap » to see the visual comparison.",
            correctOperator: "<",
            correctFeedback: "You are right! 2.61 has more shaded parts than 2.42.<br>The number with greater shaded parts is the greater number.",
            wrongFeedback: "Oops! The number with greater shaded parts is the greater number."
          },
          step4: { 
            q: "Observe the visual comparison.", 
            nav: "", 
            nAfterAnimation: "Tap » to compare another pair of decimal numbers.",
            feedbackAfterAnimation: "2.61 has 2 more tenths than 2.42. So 2.61 is greater.",
          },
        },
        // Q3: 1.38 vs 1.36
        {
          num1: { val: "1.38", ones: 1, tenths: 3, hundredths: 8 },
          num2: { val: "1.36", ones: 1, tenths: 3, hundredths: 6 },
          step3: {
            q: "Which of these numbers is greater?",
            nav: "Tap the correct symbol.",
            nAfterCorrect: "Tap » to see the visual comparison.",
            correctOperator: ">",
            correctFeedback: "You are right! 1.38 has more shaded parts than 1.36.<br>The number with greater shaded parts is the greater number.",
            wrongFeedback: "Oops! The number with greater shaded parts is the greater number."
          },
          step4: { 
            q: "Observe the visual comparison.", 
            nav: "", 
            nAfterAnimation: "Tap » to compare another pair of decimal numbers.",
            feedbackAfterAnimation: "1.38 has 2 more hundredths than 1.36. So 1.38 is greater.",
          },
        },
        // Q4: 4.07 vs 3.70
        {
          num1: { val: "4.07", ones: 4, tenths: 0, hundredths: 7 },
          num2: { val: "3.70", ones: 3, tenths: 7, hundredths: 0 },
          step3: {
            q: "Which of these numbers is greater?",
            nav: "Tap the correct symbol.",
            nAfterCorrect: "Tap » to see the visual comparison.",
            correctOperator: ">",
            correctFeedback: "You are right! 4.07 has more WHOLEs than 3.70.<br>The number with greater WHOLEs is the greater number.",
            wrongFeedback: "Oops! The number with greater WHOLEs is the greater number."
          },
          step4: { 
            q: "Observe the visual comparison.", 
            nav: "", 
            nAfterAnimation: "Tap » to compare another pair of decimal numbers.",
            feedbackAfterAnimation: "4.07 has 1 more whole than 3.70. So 4.07 is greater.",
          },
        },
        // Q5: 3.54 vs 3.54
        {
          num1: { val: "3.54", ones: 3, tenths: 5, hundredths: 4 },
          num2: { val: "3.54", ones: 3, tenths: 5, hundredths: 4 },
          step3: {
            q: "Which of these numbers is greater?",
            nav: "Tap the correct symbol.",
            nAfterCorrect: "Tap » to see the visual comparison.",
            correctOperator: "=",
            correctFeedback: "You are right! Both models show the same whole squares and <br>shaded parts. So 3.54 is equal to 3.54.",
            wrongFeedback: "Not quite! Both models show the same whole squares and shaded <br>parts. Try again."
          },
          step4: { 
            q: "Observe the visual comparison.", 
            nav: "", 
            nAfterAnimation: "Tap » to summarize.",
            feedbackAfterAnimation: "Both numbers have equal wholes and shaded parts. So they are equal.",
          },
        },
      ],
      labels: {
        one: "one",
        ones: "ones",
        tenth: "tenth",
        tenths: "tenths",
        hundredth: "hundredth",
        hundredths: "hundredths",
      },
      check: "Check",
    },
  },
  id: {
    app: {
      start: {
        heading: "Membandingkan Bilangan Desimal",
        text: "Mari kita belajar membandingkan <y>bilangan desimal</y> menggunakan <br>model visual.",
        buttonText: "Mulai",
      },
      final: {
        heading: "Membandingkan Bilangan Desimal",
        text: "Sekarang kamu sudah memahami bagaimana model visual membantu <br>membandingkan bilangan desimal.<br> Mari bandingkan pasangan bilangan desimal berikutnya.",
        buttonText: "Lanjutkan",
      },
      step6: {
        heading: "Membandingkan Bilangan Desimal",
        text: "<left>Luar biasa!<br>Untuk membandingkan desimal secara visual:<br>1. Bandingkan bilangan bulat terlebih dahulu.<br>2. Jika bilangan bulatnya sama, bandingkan bagian yang diarsir.</left>",
        buttonText: "Mulai Lagi",
      },
      nav: {
        next: "Ketuk » untuk melanjutkan.",
      },
      questions: [
        // Q1: 3.17 vs 2.75
        {
          num1: { val: "3,17", ones: 3, tenths: 1, hundredths: 7 },
          num2: { val: "2,75", ones: 2, tenths: 7, hundredths: 5 },
          step1: {
            q: "Tunjukkan bilangan desimal <y>3,17</y> menggunakan model visual.",
            nav: "Gunakan penggeser untuk menunjukkan bilangan yang diberikan.",
            nAfterCorrect: "Ketuk » untuk menunjukkan bilangan desimal berikutnya.",
            correct: "Bagus sekali! <br>Model menunjukkan 3 satuan, 1 persepuluhan, dan 7 perseratusan tepat seperti pada 3,17.",
            wrong: "Kurang tepat!<br>3,17 membutuhkan 3 satuan, 1 persepuluhan, dan 7 perseratusan pada kisi. <br>Coba sesuaikan lagi.",
          },
          step2: {
            q: "Tunjukkan bilangan desimal <y>2,75</y> menggunakan model visual.",
            nav: "Gunakan penggeser untuk menunjukkan bilangan yang diberikan.",
            nAfterCorrect: "Ketuk » untuk membandingkan bilangan desimal.",
            correct: "Bagus sekali! <br>Model menunjukkan 2 satuan, 7 persepuluhan, dan 5 perseratusan tepat seperti pada 2,75.",
            wrong: "Kurang tepat!<br>2,75 membutuhkan 2 satuan, 7 persepuluhan, dan 5 perseratusan pada kisi. <br>Coba sesuaikan lagi.",
          },
          step3: {
            q: "Manakah dari angka-angka ini yang lebih besar?",
            nav: "Ketuk simbol yang benar.",
            nAfterCorrect: "Ketuk » untuk melihat perbandingan visual.",
            correctOperator: ">",
            correctFeedback: "Benar! 3,17 memiliki lebih banyak SATUAN daripada 2,75.\nBilangan dengan SATUAN lebih besar adalah bilangan yang lebih besar.",
            wrongFeedback: "Ups! Bilangan dengan SATUAN lebih besar adalah bilangan yang lebih besar."
          },
          step4: { 
            q: "Amati perbandingan visual.", 
            nav: "", 
            nAfterAnimation: "Ketuk » untuk melanjutkan.",
            feedbackAfterAnimation: "3,17 memiliki 1 satuan lebih banyak daripada 2,75. Jadi 3,17 lebih besar.",
          },
        },
        // Q2: 2.42 vs 2.61
        {
          num1: { val: "2,42", ones: 2, tenths: 4, hundredths: 2 },
          num2: { val: "2,61", ones: 2, tenths: 6, hundredths: 1 },
          step3: {
            q: "Manakah dari angka-angka ini yang lebih besar?",
            nav: "Ketuk simbol yang benar.",
            nAfterCorrect: "Ketuk » untuk melihat perbandingan visual.",
            correctOperator: "<",
            correctFeedback: "Kamu benar! 2,61 memiliki lebih banyak bagian yang diarsir daripada 2,42.<br>Bilangan dengan bagian yang diarsir lebih banyak adalah bilangan yang lebih besar.",
            wrongFeedback: "Ups! Bilangan dengan bagian yang diarsir lebih banyak adalah bilangan yang lebih besar."
          },
          step4: { 
            q: "Amati perbandingan visual.", 
            nav: "", 
            nAfterAnimation: "Ketuk » untuk membandingkan pasangan bilangan desimal lainnya.",
            feedbackAfterAnimation: "2,61 memiliki 2 persepuluhan lebih banyak daripada 2,42. Jadi 2,61 lebih besar.",
          },
        },
        // Q3: 1.38 vs 1.36
        {
          num1: { val: "1,38", ones: 1, tenths: 3, hundredths: 8 },
          num2: { val: "1,36", ones: 1, tenths: 3, hundredths: 6 },
          step3: {
            q: "Manakah dari angka-angka ini yang lebih besar?",
            nav: "Ketuk simbol yang benar.",
            nAfterCorrect: "Ketuk » untuk melihat perbandingan visual.",
            correctOperator: ">",
            correctFeedback: "Kamu benar! 1,38 memiliki lebih banyak bagian yang diarsir daripada 1,36.<br>Bilangan dengan bagian yang diarsir lebih banyak adalah bilangan yang lebih besar.",
            wrongFeedback: "Ups! Bilangan dengan bagian yang diarsir lebih banyak adalah bilangan yang lebih besar."
          },
          step4: { 
            q: "Amati perbandingan visual.", 
            nav: "", 
            nAfterAnimation: "Ketuk » untuk membandingkan pasangan bilangan desimal lainnya.",
            feedbackAfterAnimation: "1,38 memiliki 2 perseratusan lebih banyak daripada 1,36. Jadi 1,38 lebih besar.",
          },
        },
        // Q4: 4.07 vs 3.70
        {
          num1: { val: "4,07", ones: 4, tenths: 0, hundredths: 7 },
          num2: { val: "3,70", ones: 3, tenths: 7, hundredths: 0 },
          step3: {
            q: "Manakah dari angka-angka ini yang lebih besar?",
            nav: "Ketuk simbol yang benar.",
            nAfterCorrect: "Ketuk » untuk melihat perbandingan visual.",
            correctOperator: ">",
            correctFeedback: "Kamu benar! 4,07 memiliki lebih banyak SATUAN daripada 3,70.<br>Bilangan dengan SATUAN lebih besar adalah bilangan yang lebih besar.",
            wrongFeedback: "Ups! Bilangan dengan SATUAN lebih besar adalah bilangan yang lebih besar."
          },
          step4: { 
            q: "Amati perbandingan visual.", 
            nav: "", 
            nAfterAnimation: "Ketuk » untuk membandingkan pasangan bilangan desimal lainnya.",
            feedbackAfterAnimation: "4,07 memiliki 1 satuan lebih banyak daripada 3,70. Jadi 4,07 lebih besar.",
          },
        },
        // Q5: 3.54 vs 3.54
        {
          num1: { val: "3,54", ones: 3, tenths: 5, hundredths: 4 },
          num2: { val: "3,54", ones: 3, tenths: 5, hundredths: 4 },
          step3: {
            q: "Manakah dari angka-angka ini yang lebih besar?",
            nav: "Ketuk simbol yang benar.",
            nAfterCorrect: "Ketuk » untuk melihat perbandingan visual.",
            correctOperator: "=",
            correctFeedback: "Kamu benar! Kedua model menunjukkan persegi utuh dan <br>bagian yang diarsir yang sama. Jadi 3,54 sama dengan 3,54.",
            wrongFeedback: "Kurang tepat! Kedua model menunjukkan persegi utuh dan bagian yang diarsir yang sama. <br>Coba lagi."
          },
          step4: { 
            q: "Amati perbandingan visual.", 
            nav: "", 
            nAfterAnimation: "Ketuk » untuk ringkasan.",
            feedbackAfterAnimation: "Kedua bilangan memiliki bilangan bulat dan bagian yang diarsir yang sama. Jadi mereka sama.",
          },
        },
      ],
      labels: {
        one: "satuan",
        ones: "satuan",
        tenth: "persepuluhan",
        tenths: "persepuluhan",
        hundredth: "perseratusan",
        hundredths: "perseratusan",
      },
      check: "Periksa",
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalChar = current_language === "id" ? ",": "."
