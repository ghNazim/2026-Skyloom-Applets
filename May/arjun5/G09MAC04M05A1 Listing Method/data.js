const EXPERIMENT_CONFIG = {
  1: {
    leftImage: "assets/spinner1.png",
    rightImage: "assets/spinner2.png",
    outcomesA: [1, 2, 3],
    outcomesB: [1, 2],
    step2Draggables: [1, 2, 3],
    step3Choices: [2, 4, 6, 8],
    nSAnswer: 6,
    samplePairs: [
      { a: 1, b: 1 },
      { a: 1, b: 2 },
      { a: 2, b: 1 },
      { a: 2, b: 2 },
      { a: 3, b: 1 },
      { a: 3, b: 2 },
    ],
  },
  2: {
    leftImage: "assets/coin.png",
    rightImage: "assets/spinner3.png",
    outcomesA: ["H", "T"],
    outcomesB: [1, 2, 3, 4],
    step2Draggables: [1, 2, 3, 4, "H", "T"],
    step3Choices: [2, 4, 6, 8],
    nSAnswer: 8,
    samplePairs: [
      { a: "H", b: 1 },
      { a: "H", b: 2 },
      { a: "H", b: 3 },
      { a: "H", b: 4 },
      { a: "T", b: 1 },
      { a: "T", b: 2 },
      { a: "T", b: 3 },
      { a: "T", b: 4 },
    ],
  },
  3: {
    leftImage: "assets/coin.png",
    rightImage: "assets/dice.png",
    outcomesA: ["H", "T"],
    outcomesB: [1, 2, 3, 4, 5, 6],
    step2Draggables: [1, 2, 3, 4, 5, 6, "H", "T"],
    step3Choices: [6, 8, 10, 12],
    nSAnswer: 12,
    samplePairs: [
      { a: "H", b: 1 },
      { a: "H", b: 2 },
      { a: "H", b: 3 },
      { a: "H", b: 4 },
      { a: "H", b: 5 },
      { a: "H", b: 6 },
      { a: "T", b: 1 },
      { a: "T", b: 2 },
      { a: "T", b: 3 },
      { a: "T", b: 4 },
      { a: "T", b: 5 },
      { a: "T", b: 6 },
    ],
  },
};

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
      complete: {
        heading: "Activity Complete!",
        text:
          "You've practiced the <y>listing method</y> across<br>" +
          "three different experiments!<br><br>" +
          "Remember:<br>" +
          "<y>Step 1 &ndash; Identify the results of each object</y><br>" +
          "<y>Step 2 &ndash; Make pairs</y><br><br>" +
          "Tap &lsquo;Start Over&rsquo; to repeat this activity.",
        buttonText: "Start Over",
      },
      experiments: {
        1: {
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
              eventTitleHtml:
                "<y>Event (E)</y> : Getting an even number on first spinner.",
              sampleSpaceLabel: "Sample space (S)",
              nELabel: "n(E)",
              submitText: "Submit",
              resetText: "Reset",
              correctAnswers: [2, 3],
              feedbackCorrect:
                "Correct! You have found all the favourable outcomes!",
              feedbackWrong:
                "Even number on first spinner means first number in the pair should be even. Try again!",
            },
            6: {
              questionText: "EXPERIMENT 1: Two Different Spinners",
              navText: "Tap the favourable outcomes and submit.",
              navReset: "Tap &lsquo;Reset&rsquo; to try again.",
              navDone: "Tap &raquo; to see another experiment",
              eventTitleHtml:
                "<y>Event (E)</y> : Getting a 2 on at least one spinner.",
              sampleSpaceLabel: "Sample space (S)",
              nELabel: "n(E)",
              submitText: "Submit",
              resetText: "Reset",
              correctAnswers: [1, 2, 3, 5],
              feedbackCorrect:
                "Correct. You have found all the favourable outcomes.",
              feedbackWrong:
                'Check both spinners. A pair has "at least one 2" if the 2 is on the first spinner, the second spinner, or both.',
            },
          },
        },
        2: {
          steps: {
            1: {
              questionText: "EXPERIMENT 2: A Coin and a Spinner",
              navText: "Tap &raquo; for step 1",
              title: "Step 1: Identify the possible results of each object.",
              footerText: "Use listing method to find all possible outcomes.",
              spinnerAInfo: "<sa>Coin</sa> has the outcomes H and T.",
              spinnerBInfo: "<sb>Spinner A</sb> has the numbers 1, 2, 3, 4.",
              spinnerALabel: "Coin",
              spinnerBLabel: "Spinner A",
            },
            2: {
              questionText: "EXPERIMENT 2: A Coin and a Spinner",
              navText: "Drag the buttons to their correct places.",
              navDone: "Tap &raquo; for step 2",
              title: "Step 1: Identify the possible results of each object.",
              spinnerALabel: "Coin",
              spinnerBLabel: "Spinner A",
            },
            3: {
              questionText: "EXPERIMENT 2: A Coin and a Spinner",
              navText: "Fill the box by dragging the correct value.",
              navDone: "Tap &raquo; to generate sample space.",
              title: "Step 2: Make pairs from both objects.",
              spinnerALabel: "Coin",
              spinnerBLabel: "Spinner A",
              nAEquals: "n(C) = 2",
              nBEquals: "n(A) = 4",
              nSLabel: "n(S)",
              feedbackHtml:
                "<ns>n(S)</ns> = <sa>n(C)</sa> &times; <sb>n(A)</sb>",
            },
            4: {
              questionText: "EXPERIMENT 2: A Coin and a Spinner",
              navText: "To start pairing, tap first outcome of Coin.",
              navSecond: "To continue pairing, tap second outcome of Coin.",
              navDone: "Tap &raquo; to see an event for this experiment.",
              title: "Step 2: Make pairs from both objects.",
              spinnerALabel: "Coin",
              spinnerBLabel: "Spinner A",
              sampleSpaceLabel: "Sample space (S)",
              completedFooter: "Sample space completed!",
            },
            5: {
              questionText: "EXPERIMENT 2: A Coin and a Spinner",
              navText: "Tap the favourable outcomes and submit.",
              navReset: "Tap &lsquo;Reset&rsquo; to try again.",
              navDone: "Tap &raquo; to see another event for this experiment.",
              eventTitleHtml:
                "<y>Event (E)</y> : Getting heads AND a number greater than 2.",
              sampleSpaceLabel: "Sample space (S)",
              nELabel: "n(E)",
              submitText: "Submit",
              resetText: "Reset",
              correctAnswers: [2, 3],
              feedbackCorrect:
                "Correct. You have found all the favourable outcomes.",
              feedbackWrong:
                "Each correct pair should have H and a number greater than 2.",
            },
            6: {
              questionText: "EXPERIMENT 2: A Coin and a Spinner",
              navText: "Tap the favourable outcomes and submit.",
              navReset: "Tap &lsquo;Reset&rsquo; to try again.",
              navDone: "Tap &raquo; to see another experiment",
              eventTitleHtml:
                "<y>Event (E)</y> : Getting tails AND an even number.",
              sampleSpaceLabel: "Sample space (S)",
              nELabel: "n(E)",
              submitText: "Submit",
              resetText: "Reset",
              correctAnswers: [5, 7],
              feedbackCorrect:
                "Correct. You have found all the favourable outcomes.",
              feedbackWrong:
                "Each correct pair should have T and an even number.",
            },
          },
        },
        3: {
          steps: {
            1: {
              questionText: "EXPERIMENT 3: A Coin and a Die",
              navText: "Tap &raquo; for step 1",
              title: "Step 1: Identify the possible results of each object.",
              footerText: "Use listing method to find all possible outcomes.",
              spinnerAInfo: "<sa>Coin</sa> has the outcomes H and T.",
              spinnerBInfo: "<sb>Die</sb> has the numbers 1, 2, 3, 4, 5, 6.",
              spinnerALabel: "Coin",
              spinnerBLabel: "Die",
            },
            2: {
              questionText: "EXPERIMENT 3: A Coin and a Die",
              navText: "Drag the buttons to their correct places.",
              navDone: "Tap &raquo; for step 2",
              title: "Step 1: Identify the possible results of each object.",
              spinnerALabel: "Coin",
              spinnerBLabel: "Die",
            },
            3: {
              questionText: "EXPERIMENT 3: A Coin and a Die",
              navText: "Fill the box by dragging the correct value.",
              navDone: "Tap &raquo; to generate sample space.",
              title: "Step 2: Make pairs from both objects.",
              spinnerALabel: "Coin",
              spinnerBLabel: "Die",
              nAEquals: "n(C) = 2",
              nBEquals: "n(D) = 6",
              nSLabel: "n(S)",
              feedbackHtml:
                "<ns>n(S)</ns> = <sa>n(C)</sa> &times; <sb>n(D)</sb>",
            },
            4: {
              questionText: "EXPERIMENT 3: A Coin and a Die",
              navText: "To start pairing, tap first outcome of Coin.",
              navSecond: "To continue pairing, tap second outcome of Coin.",
              navDone: "Tap &raquo; to see an event for this experiment.",
              title: "Step 2: Make pairs from both objects.",
              spinnerALabel: "Coin",
              spinnerBLabel: "Die",
              sampleSpaceLabel: "Sample space (S)",
              completedFooter: "Sample space completed!",
            },
            5: {
              questionText: "EXPERIMENT 3: A Coin and a Die",
              navText: "Tap the favourable outcomes and submit.",
              navReset: "Tap &lsquo;Reset&rsquo; to try again.",
              navDone: "Tap &raquo; to see another event for this experiment.",
              eventTitleHtml:
                "<y>Event (E)</y> : Getting heads AND an odd number.",
              sampleSpaceLabel: "Sample space (S)",
              nELabel: "n(E)",
              submitText: "Submit",
              resetText: "Reset",
              correctAnswers: [0, 2, 4],
              feedbackCorrect:
                "Correct. You have found all the favourable outcomes.",
              feedbackWrong:
                "Each correct pair should have H and an odd number.",
            },
            6: {
              questionText: "EXPERIMENT 3: A Coin and a Die",
              navText: "Tap the favourable outcomes and submit.",
              navReset: "Tap &lsquo;Reset&rsquo; to try again.",
              navDone: "Tap &raquo; to conclude.",
              eventTitleHtml:
                "<y>Event (E)</y> : Getting a prime number on the die.",
              sampleSpaceLabel: "Sample space (S)",
              nELabel: "n(E)",
              submitText: "Submit",
              resetText: "Reset",
              correctAnswers: [1, 2, 4, 7, 8, 10],
              feedbackCorrect:
                "Correct. You have found all the favourable outcomes.",
              feedbackWrong:
                "Each correct pair should have a prime number on the die. The primes from 1 to 6 are 2, 3, and 5.",
            },
          },
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
      complete: {
        heading: "Aktivitas Selesai!",
        text:
          "Kamu telah berlatih <y>metode listing</y> pada<br>" +
          "tiga eksperimen yang berbeda!<br><br>" +
          "Ingat:<br>" +
          "<y>Langkah 1 &ndash; Identifikasi hasil dari setiap objek</y><br>" +
          "<y>Langkah 2 &ndash; Buat pasangan</y><br><br>" +
          "Ketuk &lsquo;Mulai Lagi&rsquo; untuk mengulangi aktivitas ini.",
        buttonText: "Mulai Lagi",
      },
      experiments: {
        1: {
          steps: {
            1: {
              questionText: "EKSPERIMEN 1: Dua Spinner Berbeda",
              navText: "Ketuk &raquo; untuk langkah 1",
              title: "Langkah 1: Identifikasi hasil yang mungkin dari setiap objek.",
              footerText:
                "Gunakan metode listing untuk menemukan semua hasil yang mungkin.",
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
              navText:
                "Untuk mulai memasangkan, ketuk hasil pertama Spinner A.",
              navSecond:
                "Untuk lanjut memasangkan, ketuk hasil kedua Spinner A.",
              navThird:
                "Untuk lanjut memasangkan, ketuk hasil ketiga Spinner A.",
              navDone:
                "Ketuk &raquo; untuk melihat suatu kejadian pada eksperimen ini.",
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
              navDone:
                "Ketuk &raquo; untuk melihat kejadian lain pada eksperimen ini.",
              eventTitleHtml:
                "<y>Kejadian (E)</y> : Mendapat bilangan genap pada spinner pertama.",
              sampleSpaceLabel: "Ruang sampel (S)",
              nELabel: "n(E)",
              submitText: "Kirim",
              resetText: "Reset",
              correctAnswers: [2, 3],
              feedbackCorrect:
                "Benar! Kamu telah menemukan semua hasil yang menguntungkan!",
              feedbackWrong:
                "Bilangan genap pada spinner pertama berarti angka pertama pada pasangan harus genap. Coba lagi!",
            },
            6: {
              questionText: "EKSPERIMEN 1: Dua Spinner Berbeda",
              navText: "Ketuk hasil yang menguntungkan lalu kirim.",
              navReset: "Ketuk &lsquo;Reset&rsquo; untuk mencoba lagi.",
              navDone: "Ketuk &raquo; untuk melihat eksperimen lain",
              eventTitleHtml:
                "<y>Kejadian (E)</y> : Mendapat angka 2 pada setidaknya satu spinner.",
              sampleSpaceLabel: "Ruang sampel (S)",
              nELabel: "n(E)",
              submitText: "Kirim",
              resetText: "Reset",
              correctAnswers: [1, 2, 3, 5],
              feedbackCorrect:
                "Benar. Kamu telah menemukan semua hasil yang menguntungkan.",
              feedbackWrong:
                'Periksa kedua spinner. Suatu pasangan memiliki "setidaknya satu 2" jika angka 2 ada pada spinner pertama, spinner kedua, atau keduanya.',
            },
          },
        },
        2: {
          steps: {
            1: {
              questionText: "EKSPERIMEN 2: Koin dan Spinner",
              navText: "Ketuk &raquo; untuk langkah 1",
              title: "Langkah 1: Identifikasi hasil yang mungkin dari setiap objek.",
              footerText:
                "Gunakan metode listing untuk menemukan semua hasil yang mungkin.",
              spinnerAInfo: "<sa>Koin</sa> memiliki hasil H, T.",
              spinnerBInfo: "<sb>Spinner A</sb> memiliki angka 1, 2, 3, 4.",
              spinnerALabel: "Koin",
              spinnerBLabel: "Spinner A",
            },
            2: {
              questionText: "EKSPERIMEN 2: Koin dan Spinner",
              navText: "Seret tombol ke tempat yang benar.",
              navDone: "Ketuk &raquo; untuk langkah 2",
              title: "Langkah 1: Identifikasi hasil yang mungkin dari setiap objek.",
              spinnerALabel: "Koin",
              spinnerBLabel: "Spinner A",
            },
            3: {
              questionText: "EKSPERIMEN 2: Koin dan Spinner",
              navText: "Isi kotak dengan menyeret nilai yang benar.",
              navDone: "Ketuk &raquo; untuk menghasilkan ruang sampel.",
              title: "Langkah 2: Buat pasangan dari kedua objek.",
              spinnerALabel: "Koin",
              spinnerBLabel: "Spinner A",
              nAEquals: "n(C) = 2",
              nBEquals: "n(A) = 4",
              nSLabel: "n(S)",
              feedbackHtml:
                "<ns>n(S)</ns> = <sa>n(C)</sa> &times; <sb>n(A)</sb>",
            },
            4: {
              questionText: "EKSPERIMEN 2: Koin dan Spinner",
              navText: "Untuk mulai memasangkan, ketuk hasil pertama Koin.",
              navSecond: "Untuk lanjut memasangkan, ketuk hasil kedua Koin.",
              navDone:
                "Ketuk &raquo; untuk melihat suatu kejadian pada eksperimen ini.",
              title: "Langkah 2: Buat pasangan dari kedua objek.",
              spinnerALabel: "Koin",
              spinnerBLabel: "Spinner A",
              sampleSpaceLabel: "Ruang sampel (S)",
              completedFooter: "Ruang sampel selesai!",
            },
            5: {
              questionText: "EKSPERIMEN 2: Koin dan Spinner",
              navText: "Ketuk hasil yang menguntungkan lalu kirim.",
              navReset: "Ketuk &lsquo;Reset&rsquo; untuk mencoba lagi.",
              navDone:
                "Ketuk &raquo; untuk melihat kejadian lain pada eksperimen ini.",
              eventTitleHtml:
                "<y>Kejadian (E)</y> : Mendapat angka H DAN bilangan lebih dari 2.",
              sampleSpaceLabel: "Ruang sampel (S)",
              nELabel: "n(E)",
              submitText: "Kirim",
              resetText: "Reset",
              correctAnswers: [2, 3],
              feedbackCorrect:
                "Benar. Kamu telah menemukan semua hasil yang menguntungkan.",
              feedbackWrong:
                "Setiap pasangan yang benar harus memiliki H dan bilangan lebih dari 2.",
            },
            6: {
              questionText: "EKSPERIMEN 2: Koin dan Spinner",
              navText: "Ketuk hasil yang menguntungkan lalu kirim.",
              navReset: "Ketuk &lsquo;Reset&rsquo; untuk mencoba lagi.",
              navDone: "Ketuk &raquo; untuk melihat eksperimen lain",
              eventTitleHtml:
                "<y>Kejadian (E)</y> : Mendapat angka T DAN bilangan genap.",
              sampleSpaceLabel: "Ruang sampel (S)",
              nELabel: "n(E)",
              submitText: "Kirim",
              resetText: "Reset",
              correctAnswers: [5, 7],
              feedbackCorrect:
                "Benar. Kamu telah menemukan semua hasil yang menguntungkan.",
              feedbackWrong:
                "Setiap pasangan yang benar harus memiliki T dan bilangan genap.",
            },
          },
        },
        3: {
          steps: {
            1: {
              questionText: "EKSPERIMEN 3: Koin dan Dadu",
              navText: "Ketuk &raquo; untuk langkah 1",
              title: "Langkah 1: Identifikasi hasil yang mungkin dari setiap objek.",
              footerText:
                "Gunakan metode listing untuk menemukan semua hasil yang mungkin.",
              spinnerAInfo: "<sa>Koin</sa> memiliki hasil H, T.",
              spinnerBInfo: "<sb>Dadu</sb> memiliki angka 1, 2, 3, 4, 5, 6.",
              spinnerALabel: "Koin",
              spinnerBLabel: "Dadu",
            },
            2: {
              questionText: "EKSPERIMEN 3: Koin dan Dadu",
              navText: "Seret tombol ke tempat yang benar.",
              navDone: "Ketuk &raquo; untuk langkah 2",
              title: "Langkah 1: Identifikasi hasil yang mungkin dari setiap objek.",
              spinnerALabel: "Koin",
              spinnerBLabel: "Dadu",
            },
            3: {
              questionText: "EKSPERIMEN 3: Koin dan Dadu",
              navText: "Isi kotak dengan menyeret nilai yang benar.",
              navDone: "Ketuk &raquo; untuk menghasilkan ruang sampel.",
              title: "Langkah 2: Buat pasangan dari kedua objek.",
              spinnerALabel: "Koin",
              spinnerBLabel: "Dadu",
              nAEquals: "n(C) = 2",
              nBEquals: "n(D) = 6",
              nSLabel: "n(S)",
              feedbackHtml:
                "<ns>n(S)</ns> = <sa>n(C)</sa> &times; <sb>n(D)</sb>",
            },
            4: {
              questionText: "EKSPERIMEN 3: Koin dan Dadu",
              navText: "Untuk mulai memasangkan, ketuk hasil pertama Koin.",
              navSecond: "Untuk lanjut memasangkan, ketuk hasil kedua Koin.",
              navDone:
                "Ketuk &raquo; untuk melihat suatu kejadian pada eksperimen ini.",
              title: "Langkah 2: Buat pasangan dari kedua objek.",
              spinnerALabel: "Koin",
              spinnerBLabel: "Dadu",
              sampleSpaceLabel: "Ruang sampel (S)",
              completedFooter: "Ruang sampel selesai!",
            },
            5: {
              questionText: "EKSPERIMEN 3: Koin dan Dadu",
              navText: "Ketuk hasil yang menguntungkan lalu kirim.",
              navReset: "Ketuk &lsquo;Reset&rsquo; untuk mencoba lagi.",
              navDone:
                "Ketuk &raquo; untuk melihat kejadian lain pada eksperimen ini.",
              eventTitleHtml:
                "<y>Kejadian (E)</y> : Mendapat angka H DAN bilangan ganjil.",
              sampleSpaceLabel: "Ruang sampel (S)",
              nELabel: "n(E)",
              submitText: "Kirim",
              resetText: "Reset",
              correctAnswers: [0, 2, 4],
              feedbackCorrect:
                "Benar. Kamu telah menemukan semua hasil yang menguntungkan.",
              feedbackWrong:
                "Setiap pasangan yang benar harus memiliki H dan bilangan ganjil.",
            },
            6: {
              questionText: "EKSPERIMEN 3: Koin dan Dadu",
              navText: "Ketuk hasil yang menguntungkan lalu kirim.",
              navReset: "Ketuk &lsquo;Reset&rsquo; untuk mencoba lagi.",
              navDone: "Ketuk &raquo; untuk menyimpulkan.",
              eventTitleHtml:
                "<y>Kejadian (E)</y> : Mendapat bilangan prima pada dadu.",
              sampleSpaceLabel: "Ruang sampel (S)",
              nELabel: "n(E)",
              submitText: "Kirim",
              resetText: "Reset",
              correctAnswers: [1, 2, 4, 7, 8, 10],
              feedbackCorrect:
                "Benar. Kamu telah menemukan semua hasil yang menguntungkan.",
              feedbackWrong:
                "Setiap pasangan yang benar harus memiliki bilangan prima pada dadu. Bilangan prima dari 1 sampai 6 adalah 2, 3, dan 5.",
            },
          },
        },
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const MAX_EXPERIMENT = 3;
const MAX_STEP = 6;
