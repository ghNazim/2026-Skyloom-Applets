const DATA = {
  en: {
    app: {
      start: {
        heading: "Adding length in centimetres",
        text: "Let's understand the addition of length by measuring <br>the length of 2 objects together.",
        buttonText: "Start"
      },
      labels: {
        lengthOf: "Length of {{name}}:",
        totalLength: "Total length of both objects:",
        cm: "cm"
      },
      activities: {
        glue: {
          name: "Glue Stick",
          lengthCm: 6,
          objectClass: "glue",
          characterStep1: "Step 1: Place the 0 mark at left end of the glue.",
          navStep1: "Drag the ruler so 0 touches the left end of the glue.",
          navStep1Correct: "Tap » to read the scale.",
          feedbackStep1Wrong:
            "Look carefully.\nThe ruler must start at 0.\nMove it so that 0 touches the left end of the glue.",
          feedbackStep1Correct:
            "Good job!\nThe ruler starts at 0.\nNow we can read the length.",
          characterStep2: "Step 2: Measure the length of the glue stick",
          navStep2: "Use numpad to fill correct answer.",
          navStep2Correct: "Tap » to measure next object.",
          feedbackStep2Wrong:
            "Check again.\nThe glue starts at 0 and ends at 6.\nLook at the last number it touches.",
          feedbackStep2Correct:
            "Excellent!\nThe glue ends at 6.\nSo it is 6 cm long."
        },
        pencil: {
          name: "Pencil",
          lengthCm: 8,
          objectClass: "pencil",
          characterStep1: "Step 1: Place the 0 mark at left end of the pencil.",
          navStep1: "Drag the ruler so 0 touches the left end of the pencil.",
          navStep1Correct: "Tap » to read the scale.",
          feedbackStep1Wrong:
            "Look carefully.\nThe ruler must start at 0.\nMove it so 0 touches the left end of the pencil.",
          feedbackStep1Correct:
            "Good job!\nThe ruler starts at 0.\nNow we can read the length.",
          characterStep2: "Step 2: Measure the length of the pencil.",
          navStep2: "Use numpad to fill correct answer.",
          navStep2Correct: "Tap » to measure total length of glue and pencil.",
          feedbackStep2Wrong:
            "Check again.\nThe pencil starts at 0 and ends at 8.\nLook at the last number it touches.",
          feedbackStep2Correct:
            "Excellent!\nThe pencil ends at 8.\nSo it is 8 cm long."
        },
        total: {
          name: "both objects",
          lengthCm: 14,
          objectClass: "total",
          characterStep1:
            "Step 3: Place the 0 mark at left end of the glue to measure both objects.",
          navStep1: "Drag the ruler so 0 touches the left end of the glue.",
          navStep1Correct: "Tap » to find total length.",
          feedbackStep1Wrong:
            "Look carefully.\nStart from 0 at the left end of the glue\nbefore reading total length.",
          feedbackStep1Correct:
            "Great!\nThe ruler starts at 0.\nNow read where the pencil ends.",
          characterStep2:
            "Now, Let's measure the length of both objects kept together.",
          navStep2: "Use numpad to fill correct answer.",
          navStep2Correct: "Tap » to complete activity.",
          feedbackStep2Wrong:
            "Check again.\nThe items start at 0 and ends at 14.\nLook at the last number pencil touches.",
          feedbackStep2Correct:
            "Well Done!\nThe length of both glue stick and pencil together is 14 cm.",
          characterTotalVisualize:
            "The length of two objects together is the sum of the lengths of the 2 objects.",
          visualizeAdditionButton: "Visualize addition",
          navStepBeforeVisualize: "Tap \"Visualize addition\" to see the sum.",
          additionEquation: "{{a}} cm + {{b}} cm = {{sum}} cm"
        }
      },
      end: {
        heading: "Adding Length in Centimeters",
        text: "You learned that the addition of length by visualising <br>the length of 2 objects together.  ",
        buttonText: "Start Over"
      }
    }
  },
  id: {
    app: {
      start: {
        heading: "Menjumlahkan panjang dalam sentimeter",
        text: "Mari pahami penjumlahan panjang dengan mengukur<br>panjang 2 benda secara bersamaan.",
        buttonText: "Mulai"
      },
      labels: {
        lengthOf: "Panjang {{name}}:",
        totalLength: "Total panjang kedua benda:",
        cm: "cm"
      },
      activities: {
        glue: {
          name: "Stik Lem",
          lengthCm: 6,
          objectClass: "glue",
          characterStep1: "Langkah 1: Letakkan tanda 0 di ujung kiri lem.",
          navStep1: "Seret penggaris agar 0 menyentuh ujung kiri lem.",
          navStep1Correct: "Ketuk » untuk membaca skala.",
          feedbackStep1Wrong:
            "Perhatikan baik-baik.\nPenggaris harus mulai\ndari 0.\nPindahkan agar 0\nmenyentuh ujung kiri\nlem.",
          feedbackStep1Correct:
            "Bagus!\nPenggaris dimulai\ndari 0.\nSekarang kita bisa\nmembaca panjangnya.",
          characterStep2: "Langkah 2: Ukur panjang stik lem.",
          navStep2: "Gunakan numpad untuk mengisi jawaban benar.",
          navStep2Correct: "Ketuk » untuk mengukur benda berikutnya.",
          feedbackStep2Wrong:
            "Coba lagi.\nLem dimulai dari 0\ndan berakhir di 6.\nLihat angka terakhir\nyang disentuh.",
          feedbackStep2Correct:
            "Luar biasa!\nLem berakhir\npada 6.\nJadi panjangnya\n6 cm."
        },
        pencil: {
          name: "Pensil",
          lengthCm: 8,
          objectClass: "pencil",
          characterStep1: "Langkah 1: Letakkan tanda 0 di ujung kiri pensil.",
          navStep1: "Seret penggaris agar 0 menyentuh ujung kiri pensil.",
          navStep1Correct: "Ketuk » untuk membaca skala.",
          feedbackStep1Wrong:
            "Perhatikan baik-baik.\nPenggaris harus mulai\ndari 0.\nPindahkan agar 0\nmenyentuh ujung kiri\npensil.",
          feedbackStep1Correct:
            "Bagus!\nPenggaris dimulai\ndari 0.\nSekarang kita bisa\nmembaca panjangnya.",
          characterStep2: "Langkah 2: Ukur panjang pensil.",
          navStep2: "Gunakan numpad untuk mengisi jawaban benar.",
          navStep2Correct:
            "Ketuk » untuk mengukur total panjang lem dan pensil.",
          feedbackStep2Wrong:
            "Coba lagi.\nPensil dimulai dari 0\ndan berakhir di 8.\nLihat angka terakhir\nyang disentuh.",
          feedbackStep2Correct:
            "Luar biasa!\nPensil berakhir\npada 8.\nJadi panjangnya\n8 cm."
        },
        total: {
          name: "kedua benda",
          lengthCm: 14,
          objectClass: "total",
          characterStep1:
            "Langkah 3: Letakkan tanda 0 di ujung kiri lem untuk mengukur kedua benda.",
          navStep1: "Seret penggaris agar 0 menyentuh ujung kiri lem.",
          navStep1Correct: "Ketuk » untuk mencari panjang total.",
          feedbackStep1Wrong:
            "Perhatikan baik-baik.\nMulai dari 0 di\nujung kiri lem\nsebelum membaca\npanjang total.",
          feedbackStep1Correct:
            "Hebat!\nPenggaris dimulai\ndari 0.\nSekarang baca hingga\nujung pensil.",
          characterStep2:
            "Sekarang, mari ukur panjang kedua benda yang diletakkan bersama.",
          navStep2: "Gunakan numpad untuk mengisi jawaban benar.",
          navStep2Correct: "Ketuk » untuk menyelesaikan aktivitas.",
          feedbackStep2Wrong:
            "Coba lagi.\nBenda-benda dimulai dari 0 dan berakhir di 14.\nLihat angka terakhir yang disentuh pensil.",
          feedbackStep2Correct:
            "Bagus sekali!\nPanjang stik lem dan pensil bersama-sama adalah 14 cm.",
          characterTotalVisualize:
            "Panjang dua benda bersama adalah jumlah panjang kedua benda.",
          visualizeAdditionButton: "Visualisasi penjumlahan",
          navStepBeforeVisualize: "Ketuk \"Visualisasi penjumlahan\" untuk melihat jumlahnya.",
          additionEquation: "{{a}} cm + {{b}} cm = {{sum}} cm"
        }
      },
      end: {
        heading: "Menjumlahkan Panjang dalam Sentimeter",
        text: "Kamu telah memahami penjumlahan panjang dengan memvisualisasikan<br>panjang 2 benda bersama.",
        buttonText: "Mulai Ulang"
      }
    }
  }
};

const APP_DATA = DATA[current_language].app;
