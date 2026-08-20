const DATA = {
  en: {
    app: {
      start: {
        heading: "Listing Method",
        text:
          "You've learned the listing method to <y>find sample space</y>.<br>" +
          "Now it's time to practice!<br>" +
          "You'll work through <y>three experiments</y>.<br>" +
          "Your job: <y>find sample space</y> and<br>" +
          "<y>favorable outcomes</y> for each event!<br>" +
          "Tap &lsquo;Start&rsquo; to begin.",
        buttonText: "START",
      },
      steps: {
        1: {
          questionText: "EXPERIMENT 1: Two Different Spinners",
          navText: "Tap &raquo; for step 1",
          title: "Step 1: Identify the possible results of each object.",
          footerText: "Use listing method to find all possible outcomes.",
          spinnerAInfo: "<sa>Spinner A</sa> has the numbers 1, 2, 3.",
          spinnerBInfo: "<sb>Spinner B</sb> has the numbers 1, 2.",
          spinnerALabel: "Spinner A",
          spinnerBLabel: "Spinner B",
        },
        2: {
          questionText: "EXPERIMENT 1: Two Different Spinners",
          navText: "Drag the buttons to their correct places.",
          navDone: "Tap &raquo; for step 2",
          title: "Step 1: Identify the possible results of each object.",
          spinnerALabel: "Spinner A",
          spinnerBLabel: "Spinner B",
        },
        3: {
          questionText: "EXPERIMENT 1: Two Different Spinners",
          navText: "Fill the box by dragging the correct value.",
          navDone: "Tap &raquo; to generate sample space.",
          title: "Step 2: Make pairs from both objects.",
          spinnerALabel: "Spinner A",
          spinnerBLabel: "Spinner B",
          nAEquals: "n(A) = 3",
          nBEquals: "n(B) = 2",
          nSLabel: "n(S)",
          feedbackHtml:
            "<ns>n(S)</ns> = <sa>n(A)</sa> &times; <sb>n(B)</sb>",
        },
        4: {
          questionText: "EXPERIMENT 1: Two Different Spinners",
          navText: "To start pairing, tap first outcome of Spinner A.",
          navSecond: "To continue pairing, tap second outcome of Spinner A.",
          navThird: "To continue pairing, tap third outcome of Spinner A.",
          navDone: "Tap &raquo; to see an event for this experiment.",
          title: "Step 2: Make pairs from both objects.",
          spinnerALabel: "Spinner A",
          spinnerBLabel: "Spinner B",
          sampleSpaceLabel: "Sample space (S)",
          completedFooter: "Sample space completed!",
        },
        5: {
          questionText: "EXPERIMENT 1: Two Different Spinners",
          navText: "Tap the favourable outcomes and submit.",
          navReset: "Tap &lsquo;Reset&rsquo; to try again.",
          navDone: "Tap &raquo; to see another event for this experiment.",
          eventTitleHtml: "<y>Event (E)</y> : Getting an even number on first spinner.",
          sampleSpaceLabel: "Sample space (S)",
          nELabel: "n(E)",
          submitText: "Submit",
          resetText: "Reset",
          correctAnswers: [2, 3],
          feedbackCorrect: "Correct! You have found all the favourable outcomes!",
          feedbackWrong:
            "Even number on first spinner means first number in the pair should be even. Try again!",
        },
        6: {
          questionText: "EXPERIMENT 1: Two Different Spinners",
          navText: "Tap the favourable outcomes and submit.",
          navReset: "Tap &lsquo;Reset&rsquo; to try again.",
          navDone: "Tap &raquo; to see another experiment",
          eventTitleHtml: "<y>Event (E)</y> : Getting a 2 on at least one spinner.",
          sampleSpaceLabel: "Sample space (S)",
          nELabel: "n(E)",
          submitText: "Submit",
          resetText: "Reset",
          correctAnswers: [1, 2, 3, 5],
          feedbackCorrect: "Correct. You have found all the favourable outcomes.",
          feedbackWrong:
            'Check both spinners. A pair has "at least one 2" if the 2 is on the first spinner, the second spinner, or both.',
        },
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Metode Listing",
        text:
          "Kamu sudah belajar metode listing untuk <y>menemukan ruang sampel</y>.<br>" +
          "Sekarang saatnya berlatih!<br>" +
          "Kamu akan mengerjakan <y>tiga eksperimen</y>.<br>" +
          "Tugasmu: <y>temukan ruang sampel</y> dan<br>" +
          "<y>hasil yang menguntungkan</y> untuk setiap kejadian!<br>" +
          "Ketuk &lsquo;Mulai&rsquo; untuk memulai.",
        buttonText: "MULAI",
      },
      steps: {
        1: {
          questionText: "EKSPERIMEN 1: Dua Spinner Berbeda",
          navText: "Ketuk &raquo; untuk langkah 1",
          title: "Langkah 1: Identifikasi hasil yang mungkin dari setiap objek.",
          footerText: "Gunakan metode listing untuk menemukan semua hasil yang mungkin.",
          spinnerAInfo: "<sa>Spinner A</sa> memiliki angka 1, 2, 3.",
          spinnerBInfo: "<sb>Spinner B</sb> memiliki angka 1, 2.",
          spinnerALabel: "Spinner A",
          spinnerBLabel: "Spinner B",
        },
        2: {
          questionText: "EKSPERIMEN 1: Dua Spinner Berbeda",
          navText: "Seret tombol ke tempat yang benar.",
          navDone: "Ketuk &raquo; untuk langkah 2",
          title: "Langkah 1: Identifikasi hasil yang mungkin dari setiap objek.",
          spinnerALabel: "Spinner A",
          spinnerBLabel: "Spinner B",
        },
        3: {
          questionText: "EKSPERIMEN 1: Dua Spinner Berbeda",
          navText: "Isi kotak dengan menyeret nilai yang benar.",
          navDone: "Ketuk &raquo; untuk menghasilkan ruang sampel.",
          title: "Langkah 2: Buat pasangan dari kedua objek.",
          spinnerALabel: "Spinner A",
          spinnerBLabel: "Spinner B",
          nAEquals: "n(A) = 3",
          nBEquals: "n(B) = 2",
          nSLabel: "n(S)",
          feedbackHtml:
            "<ns>n(S)</ns> = <sa>n(A)</sa> &times; <sb>n(B)</sb>",
        },
        4: {
          questionText: "EKSPERIMEN 1: Dua Spinner Berbeda",
          navText: "Untuk mulai memasangkan, ketuk hasil pertama Spinner A.",
          navSecond: "Untuk lanjut memasangkan, ketuk hasil kedua Spinner A.",
          navThird: "Untuk lanjut memasangkan, ketuk hasil ketiga Spinner A.",
          navDone: "Ketuk &raquo; untuk melihat suatu kejadian pada eksperimen ini.",
          title: "Langkah 2: Buat pasangan dari kedua objek.",
          spinnerALabel: "Spinner A",
          spinnerBLabel: "Spinner B",
          sampleSpaceLabel: "Ruang sampel (S)",
          completedFooter: "Ruang sampel selesai!",
        },
        5: {
          questionText: "EKSPERIMEN 1: Dua Spinner Berbeda",
          navText: "Ketuk hasil yang menguntungkan lalu kirim.",
          navReset: "Ketuk &lsquo;Reset&rsquo; untuk mencoba lagi.",
          navDone: "Ketuk &raquo; untuk melihat kejadian lain pada eksperimen ini.",
          eventTitleHtml: "<y>Kejadian (E)</y> : Mendapat bilangan genap pada spinner pertama.",
          sampleSpaceLabel: "Ruang sampel (S)",
          nELabel: "n(E)",
          submitText: "Kirim",
          resetText: "Reset",
          correctAnswers: [2, 3],
          feedbackCorrect: "Benar! Kamu telah menemukan semua hasil yang menguntungkan!",
          feedbackWrong:
            "Bilangan genap pada spinner pertama berarti angka pertama pada pasangan harus genap. Coba lagi!",
        },
        6: {
          questionText: "EKSPERIMEN 1: Dua Spinner Berbeda",
          navText: "Ketuk hasil yang menguntungkan lalu kirim.",
          navReset: "Ketuk &lsquo;Reset&rsquo; untuk mencoba lagi.",
          navDone: "Ketuk &raquo; untuk melihat eksperimen lain",
          eventTitleHtml: "<y>Kejadian (E)</y> : Mendapat angka 2 pada setidaknya satu spinner.",
          sampleSpaceLabel: "Ruang sampel (S)",
          nELabel: "n(E)",
          submitText: "Kirim",
          resetText: "Reset",
          correctAnswers: [1, 2, 3, 5],
          feedbackCorrect: "Benar. Kamu telah menemukan semua hasil yang menguntungkan.",
          feedbackWrong:
            'Periksa kedua spinner. Suatu pasangan memiliki "setidaknya satu 2" jika angka 2 ada pada spinner pertama, spinner kedua, atau keduanya.',
        },
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
