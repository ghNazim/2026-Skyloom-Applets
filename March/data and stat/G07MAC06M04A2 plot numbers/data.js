const DATA = {
  en: {
    app: {
      start: {
        heading: "Build the Line Plot",
        text: "A teacher recorded the heights of 16 students in a class.<br>Let\'s build a line plot from this data, step by step.",
        buttonText: "Start",
      },
      step1Complete: {
        heading: "Step 1 Completed!",
        text: "Organising data from smallest to largest helps us to see all the values clearly and find the smallest and largest.<br>The next step is to draw the number line to show these data values.<br><br>Tap \u2018Begin\u2019 to start step 2.",
        buttonText: "Begin",
      },
      step2Complete: {
        heading: "Step 2 Completed!",
        text: "You have drawn the number line from 140 to 150.<br>The unit label \u201ccm\u201d shows that height is measured in centimetres.<br>The next step is to plot the data values on the number line.<br><br>Tap \u2018Begin\u2019 to start step 3.",
        buttonText: "Begin",
      },
      step3Complete: {
        heading: "Step 3 Completed!",
        text: "Great job! You have plotted all the data values. The line plot needs a title to be complete.<br>The next step is to add a title.<br><br>Tap \u2018Begin\u2019 to go to the next step.",
        buttonText: "Begin",
      },
      final: {
        heading: "Line Plot Completed!",
        text: "You have built a complete line plot by following all four steps.",
        buttonText: "Start Over",
      },
      common: {
        smallest: "Smallest",
        largest: "Largest",
        numberLine: "Number Line",
        unit: "cm",
      },
      table: {
        title: "Height of 16 students (in cm)",
        initialNumbers: [142, 144, 144, 150, 144, 150, 140, 149, 145, 147, 147, 140, 145, 144, 150, 142],
        sortedNumbers: [140, 140, 142, 142, 144, 144, 144, 144, 145, 145, 147, 147, 149, 150, 150, 150],
      },
      steps: {
        1: {
          stepNumber: "1",
          questionText: "Organise the Data",
          navText: "Tap the button to sort the data.",
          navDone: "Tap \xbb to conclude step 1.",
        },
        3: {
          stepNumber: "2",
          questionText: "Draw the Number Line and Add the Unit Label.",
          navText: "Tap the correct option.",
          navDone: "Tap \xbb to add a label to the number line.",
        },
        4: {
          stepNumber: "2",
          questionText: "Draw the Number Line and Add the Unit Label.",
          navText: "Tap the correct option.",
          navDone: "Tap \xbb to conclude step 2.",
        },
        6: {
          stepNumber: "3",
          questionText: "Plot Data Values on the Number Line",
          navText: "Tap a value, then tap its position on the number line.",
          navDone: "Tap \xbb to conclude step 3.",
        },
        8: {
          stepNumber: "4",
          questionText: "Add a Title",
          navText: "Tap the correct title.",
          navDone: "Tap \xbb to summarise .",
        },
      },
      step1: {
        leftText: "Before drawing,<br>we must organise the data from<br>the smallest to the largest.",
        sortButton: "Sort from Smallest to Largest",
        feedbackCorrect: "Well done!<br>Data is now organised from<br>smallest to largest.",
      },
      step3: {
        title: "Look at the smallest and largest values. Select the correct range for the number line.",
        options: ["145 to 150", "135 to 160", "140 to 150"],
        correctIndex: 2,
        feedbacks: [
          "Not quite! This range misses some values. Choose a range that includes all values.",
          "Not quite! This range is too wide.\nThe numbers are too close together.\n Try a smaller range.",
          "Excellent! This range includes all the data values and the numbers are easy to read.",
        ],
      },
      step4: {
        title: "Choose the correct unit label.",
        options: ["Height of students", "Number of students", "cm"],
        correctIndex: 2,
        feedbacks: [
          "Not quite! The unit label should show the unit used to measure height. Try again.",
          "Not quite! \u2018Number of students\u2019 tells us how many, not what we are measuring. Choose the unit for height.",
          "Excellent! This range includes all the data values and the numbers are easy to read.",
        ],
      },
      step6: {
        correctFeedbacks: [
          "That\u2019s correct! Keep going!",
          "Well done! Find the next value.",
          "Great job! Keep going!",
          "Excellent! Keep plotting.",
        ],
        wrongFeedback:
          "Not quite! That is not the right position. Look carefully at the number line and try again.",
        finalFeedback:
          "Well done! You plotted all the data values on the number line.",
      },
      step8: {
        title: "A title tells us what the line plot is about. Choose the correct title.",
        options: [
          "Height of students in a school",
          "Height of 16 students (cm)",
          "Number of students in class",
        ],
        correctIndex: 1,
        feedbacks: [
          "Not quite! The data was recorded from one class, not a whole school. Choose a title that matches the data.",
          "Correct! The title tells us that we measured the height of 16 students.",
          "Not quite! The data shows heights, not the number of students. Choose a title that describes what was measured.",
        ],
        finalTitle: "Height of 16 students (cm)",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Buat Diagram Garis",
        text: "Seorang guru mencatat tinggi 16 siswa di kelas.<br>Mari buat diagram garis dari data ini, langkah demi langkah.",
        buttonText: "Mulai",
      },
      step1Complete: {
        heading: "Langkah 1 Selesai!",
        text: "Mengurutkan data dari yang terkecil ke terbesar membantu kita melihat semua nilai dengan jelas dan menemukan nilai terkecil serta terbesar.<br>Langkah berikutnya adalah menggambar garis bilangan untuk menampilkan nilai data ini.<br><br>Ketuk \u2018Mulai\u2019 untuk memulai langkah 2.",
        buttonText: "Mulai",
      },
      step2Complete: {
        heading: "Langkah 2 Selesai!",
        text: "Kamu sudah menggambar garis bilangan dari 140 sampai 150.<br>Label satuan \u201ccm\u201d menunjukkan bahwa tinggi diukur dalam sentimeter.<br>Langkah berikutnya adalah memplot nilai data pada garis bilangan.<br><br>Ketuk \u2018Mulai\u2019 untuk memulai langkah 3.",
        buttonText: "Mulai",
      },
      step3Complete: {
        heading: "Langkah 3 Selesai!",
        text: "Hebat! Kamu sudah memplot semua nilai data. Diagram garis perlu judul agar lengkap.<br>Langkah berikutnya adalah menambahkan judul.<br><br>Ketuk \u2018Mulai\u2019 untuk ke langkah berikutnya.",
        buttonText: "Mulai",
      },
      final: {
        heading: "Diagram Garis Selesai!",
        text: "Kamu sudah membuat diagram garis lengkap dengan mengikuti keempat langkah.",
        buttonText: "Mulai Lagi",
      },
      common: {
        smallest: "Terkecil",
        largest: "Terbesar",
        numberLine: "Garis Bilangan",
        unit: "cm",
      },
      table: {
        title: "Tinggi 16 siswa (dalam cm)",
        initialNumbers: [142, 144, 144, 150, 144, 150, 140, 149, 145, 147, 147, 140, 145, 144, 150, 142],
        sortedNumbers: [140, 140, 142, 142, 144, 144, 144, 144, 145, 145, 147, 147, 149, 150, 150, 150],
      },
      steps: {
        1: {
          stepNumber: "1",
          questionText: "Susun Datanya",
          navText: "Ketuk tombol untuk mengurutkan data.",
          navDone: "Ketuk \xbb untuk menyelesaikan langkah 1.",
        },
        3: {
          stepNumber: "2",
          questionText: "Gambar Garis Bilangan dan Tambahkan Label Satuan.",
          navText: "Ketuk pilihan yang benar.",
          navDone: "Ketuk \xbb untuk menambahkan label pada garis bilangan.",
        },
        4: {
          stepNumber: "2",
          questionText: "Gambar Garis Bilangan dan Tambahkan Label Satuan.",
          navText: "Ketuk pilihan yang benar.",
          navDone: "Ketuk \xbb untuk menyelesaikan langkah 2.",
        },
        6: {
          stepNumber: "3",
          questionText: "Plot Nilai Data pada Garis Bilangan",
          navText: "Ketuk nilai, lalu ketuk posisinya pada garis bilangan.",
          navDone: "Ketuk \xbb untuk menyelesaikan langkah 3.",
        },
        8: {
          stepNumber: "4",
          questionText: "Tambahkan Judul",
          navText: "Ketuk judul yang benar.",
          navDone: "Ketuk \xbb untuk ringkasan.",
        },
      },
      step1: {
        leftText: "Sebelum menggambar,<br>kita harus menyusun data dari<br>yang terkecil ke terbesar.",
        sortButton: "Urutkan dari Terkecil ke Terbesar",
        feedbackCorrect: "Bagus sekali!<br>Data sekarang sudah tersusun dari<br>yang terkecil ke terbesar.",
      },
      step3: {
        title: "Lihat nilai terkecil dan terbesar. Pilih rentang yang benar untuk garis bilangan.",
        options: ["145 sampai 150", "135 sampai 160", "140 sampai 150"],
        correctIndex: 2,
        feedbacks: [
          "Belum tepat! Rentang ini melewatkan beberapa nilai. Pilih rentang yang mencakup semua nilai.",
          "Belum tepat! Rentang ini terlalu lebar.<br>Angkanya terlalu berdekatan.<br>Coba rentang yang lebih kecil.",
          "Hebat! Rentang ini mencakup semua nilai data dan angkanya mudah dibaca.",
        ],
      },
      step4: {
        title: "Pilih label satuan yang benar.",
        options: ["Tinggi siswa", "Jumlah siswa", "cm"],
        correctIndex: 2,
        feedbacks: [
          "Belum tepat! Label satuan harus menunjukkan satuan untuk mengukur tinggi. Coba lagi.",
          "Belum tepat! \u2018Jumlah siswa\u2019 menunjukkan banyaknya siswa, bukan apa yang diukur. Pilih satuan untuk tinggi.",
          "Hebat! Rentang ini mencakup semua nilai data dan angkanya mudah dibaca.",
        ],
      },
      step6: {
        correctFeedbacks: [
          "Itu benar! Lanjutkan!",
          "Bagus! Cari nilai berikutnya.",
          "Kerja bagus! Lanjutkan!",
          "Luar biasa! Terus plot nilainya.",
        ],
        wrongFeedback:
          "Belum tepat! Itu belum posisi yang benar. Perhatikan garis bilangan dengan saksama lalu coba lagi.",
        finalFeedback:
          "Bagus sekali! Kamu sudah memplot semua nilai data pada garis bilangan.",
      },
      step8: {
        title: "Judul memberi tahu tentang apa diagram garis ini. Pilih judul yang benar.",
        options: [
          "Tinggi siswa di sebuah sekolah",
          "Tinggi 16 siswa (cm)",
          "Jumlah siswa di kelas",
        ],
        correctIndex: 1,
        feedbacks: [
          "Belum tepat! Data dicatat dari satu kelas, bukan seluruh sekolah. Pilih judul yang sesuai dengan data.",
          "Benar! Judul ini menunjukkan bahwa kita mengukur tinggi 16 siswa.",
          "Belum tepat! Data menunjukkan tinggi, bukan jumlah siswa. Pilih judul yang menjelaskan apa yang diukur.",
        ],
        finalTitle: "Tinggi 16 siswa (cm)",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
