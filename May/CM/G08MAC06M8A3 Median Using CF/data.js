const DATA = {
  en: {
    app: {
      start: {
        heading: "Finding Median Using Cumulative Frequency",
        text: "Let us find the <y>median &mdash; the middle value</y> of the dataset.<br>You will build the cumulative frequency table and then identify the middle position to locate exactly which data value sits there.<br><br>Tap 'Start' to begin.",
        buttonText: "Start",
      },
      tableHeaders: {
        data: "Data (<i>x<sub>i</sub></i>)",
        frequency: "Frequency (<i>f<sub>i</sub></i>)",
        cumulativeFrequency: "Cumulative<br>Frequency",
      },
      gridValues: [
        20, 10, 25, 20, 25,
        5, 25, 10, 25, 20,
        10, 10, 15, 15, 20,
        10, 15, 10, 5, 20,
        25, 15, 5, 5, 20,
      ],
      tableData: [
        { value: 5, frequency: 4, cumulativeFrequency: 4 },
        { value: 10, frequency: 6, cumulativeFrequency: 10 },
        { value: 15, frequency: 4, cumulativeFrequency: 14 },
        { value: 20, frequency: 6, cumulativeFrequency: 20 },
        { value: 25, frequency: 5, cumulativeFrequency: 25 },
      ],
      dataOptions: [5, 10, 15, 20, 25],
      frequencyOptions: [2, 3, 4, 5, 6],
      prompts: {
        chooseDataPoint: "Choose the data point",
        chooseFrequency: "Choose the frequency",
        inProgress: "...",
        unknown: "?",
      },
      feedback: {
        orderReminder: "Remember, to find the median, the data should always be ordered from smallest to largest. In table too either start with smallest or the largest data point.",
        nextSmallest: "We need to add the data points in order. You selected the smallest earlier, so choose the data point that is the next smallest after <value>.",
        nextLargest: "We need to add the data points in order. You selected the largest earlier, so choose the data point that is the next largest after <value>.",
        firstCf: "Remember, the cumulative frequency for first row is always its frequency.",
        nextCf: "Cumulative frequency (except the first row) = current frequency + previous cumulative frequency",
        totalCount: "Add all individual frequencies to get <i>n</i>, or simply read the last cumulative frequency.",
        oddFormula: "That is for even. There is only one middle position for odd sized data set.",
      },
      steps: {
        1: {
          questionText: "Here is a data set given. We will find the median of this data set using cumulative frequency.",
          navText: "Tap &raquo; to start.",
        },
        2: {
          questionText: "Organize the data in the frequency table starting with the first row.",
          questionTextOngoing: "Good job! Similarly build the frequency table in the correct order.",
          questionTextDone: "Good job! You organized the data in the frequency table.",
          navText: "Tap on 'Choose the data point'.",
          navChooseData: "Choose the correct data point.",
          navChooseFrequency: "Choose the correct frequency of '<value>'.",
          navTextDone: "Tap &raquo; to build the cumulative frequency column.",
        },
        3: {
          questionText: "Let's add the cumulative frequencies starting with the first row.",
          questionTextOngoing: "Good job! Continue adding the cumulative frequencies for the next row.",
          questionTextDone: "Great! The cumulative frequency table is ready.",
          navText: "Enter the correct cumulative frequency for 5.",
          navTextDynamic: "Enter the correct cumulative frequency for <value>.",
          navTextDone: "Tap &raquo; to find the median.",
        },
        4: {
          questionText: "What are the total number of data values of the given data set?",
          questionTextFormula: "There are 25 data values. How will you find the middle position for <i>n</i> = 25?",
          navText: "Enter the correct number.",
          navTextFormula: "Tap the correct formula.",
          nLabel: "n:",
          middlePosition: "Middle position:",
          options: [
            { id: "odd", suffix: "value", correct: true },
            { id: "even", suffix: "and next value", correct: false },
          ],
        },
        5: {
          // Intentionally blank: while the auto-calculation plays (n flies in, 25 -> (25+1)/2
          // -> 13) the title bar stays empty so it doesn't pre-announce the 13th result. The
          // median question below replaces it once the calculation settles.
          questionText: "",
          questionTextMedian: "Great! Now tell, which data value is on 13<sup>th</sup> position?",
          questionTextDone: "That's right! The median of this data set is 15.",
          navText: "",
          navTextMedian: "Enter the correct median value.",
          navTextRetry: "Try again! Enter the correct median value.",
          navTextDone: "Tap &raquo; to wrap up.",
          medianPosition: "Median position",
          medianLabel: "Median:",
          positionRangeHeader: "Position<br>range",
          positionRanges: ["1<sup>st</sup> - 4<sup>th</sup>", "5<sup>th</sup> - 10<sup>th</sup>", "11<sup>th</sup> - 14<sup>th</sup>", "15<sup>th</sup> - 20<sup>th</sup>", "21<sup>st</sup> - 25<sup>th</sup>"],
        },
        6: {
          questionText: "<y>Well Done!</y>",
        },
      },
      final: {
        heading: "Well Done!",
        text: "<p>You found the middle position for <i>n</i>, then used the cumulative frequency to locate which data value occupies it &mdash; and that gave you the median.<br><br>This same logic works for any dataset you'll ever see.<br><br>Tap &lsquo;Start Over&rsquo; to repeat this activity.</p>",
        medianLabel: "Median",
        buttonText: "Start Over",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Menemukan Median Menggunakan Frekuensi Kumulatif",
        text: "Mari kita cari <y>median &mdash; nilai tengah</y> dari kumpulan data.<br>Kamu akan membuat tabel frekuensi kumulatif, lalu menentukan posisi tengah untuk menemukan nilai data yang tepat berada di sana.<br><br>Ketuk 'Mulai' untuk memulai.",
        buttonText: "Mulai",
      },
      tableHeaders: {
        data: "Data (<i>x<sub>i</sub></i>)",
        frequency: "Frekuensi (<i>f<sub>i</sub></i>)",
        cumulativeFrequency: "Frekuensi<br>Kumulatif",
      },
      gridValues: [
        20, 10, 25, 20, 25,
        5, 25, 10, 25, 20,
        10, 10, 15, 15, 20,
        10, 15, 10, 5, 20,
        25, 15, 5, 5, 20,
      ],
      tableData: [
        { value: 5, frequency: 4, cumulativeFrequency: 4 },
        { value: 10, frequency: 6, cumulativeFrequency: 10 },
        { value: 15, frequency: 4, cumulativeFrequency: 14 },
        { value: 20, frequency: 6, cumulativeFrequency: 20 },
        { value: 25, frequency: 5, cumulativeFrequency: 25 },
      ],
      dataOptions: [5, 10, 15, 20, 25],
      frequencyOptions: [2, 3, 4, 5, 6],
      prompts: {
        chooseDataPoint: "Pilih titik data",
        chooseFrequency: "Pilih frekuensi",
        inProgress: "...",
        unknown: "?",
      },
      feedback: {
        orderReminder: "Ingat, untuk mencari median, data harus selalu diurutkan dari yang terkecil ke yang terbesar. Di tabel juga, mulailah dari titik data terkecil atau terbesar.",
        nextSmallest: "Kita perlu menambahkan titik data secara berurutan. Kamu memilih yang terkecil sebelumnya, jadi pilih titik data yang paling kecil berikutnya setelah <value>.",
        nextLargest: "Kita perlu menambahkan titik data secara berurutan. Kamu memilih yang terbesar sebelumnya, jadi pilih titik data yang paling besar berikutnya setelah <value>.",
        firstCf: "Ingat, frekuensi kumulatif untuk baris pertama selalu sama dengan frekuensinya.",
        nextCf: "Frekuensi kumulatif (kecuali baris pertama) = frekuensi saat ini + frekuensi kumulatif sebelumnya",
        totalCount: "Jumlahkan semua frekuensi satu per satu untuk mendapatkan <i>n</i>, atau cukup baca frekuensi kumulatif terakhir.",
        oddFormula: "Itu untuk data genap. Untuk kumpulan data berukuran ganjil, hanya ada satu posisi tengah.",
      },
      steps: {
        1: {
          questionText: "Berikut adalah kumpulan data. Kita akan mencari median dari kumpulan data ini menggunakan frekuensi kumulatif.",
          navText: "Ketuk &raquo; untuk mulai.",
        },
        2: {
          questionText: "Susun data di tabel frekuensi, mulai dari baris pertama.",
          questionTextOngoing: "Bagus! Lanjutkan membuat tabel frekuensi dengan urutan yang benar.",
          questionTextDone: "Bagus! Kamu sudah menyusun data di tabel frekuensi.",
          navText: "Ketuk 'Pilih titik data'.",
          navChooseData: "Pilih titik data yang benar.",
          navChooseFrequency: "Pilih frekuensi yang benar untuk '<value>'.",
          navTextDone: "Ketuk &raquo; untuk membuat kolom frekuensi kumulatif.",
        },
        3: {
          questionText: "Mari tambahkan frekuensi kumulatif mulai dari baris pertama.",
          questionTextOngoing: "Bagus! Lanjutkan menjumlahkan frekuensi kumulatif untuk baris berikutnya.",
          questionTextDone: "Hebat! Tabel frekuensi kumulatif sudah siap.",
          navText: "Masukkan frekuensi kumulatif yang benar untuk 5.",
          navTextDynamic: "Masukkan frekuensi kumulatif yang benar untuk <value>.",
          navTextDone: "Ketuk &raquo; untuk mencari median.",
        },
        4: {
          questionText: "Berapa jumlah seluruh nilai data dari kumpulan data yang diberikan?",
          questionTextFormula: "Ada 25 nilai data. Bagaimana cara menemukan posisi tengah untuk <i>n</i> = 25?",
          navText: "Masukkan angka yang benar.",
          navTextFormula: "Ketuk rumus yang benar.",
          nLabel: "n:",
          middlePosition: "Posisi tengah:",
          options: [
            { id: "odd", suffix: "nilai", correct: true },
            { id: "even", suffix: "dan nilai berikutnya", correct: false },
          ],
        },
        5: {
          // Intentionally blank: the title bar stays empty during the auto-calculation so it
          // doesn't pre-announce the ke-13 result; the median question replaces it after.
          questionText: "",
          questionTextMedian: "Hebat! Sekarang beri tahu, nilai data mana yang berada di posisi ke-13?",
          questionTextDone: "Benar! Median dari kumpulan data ini adalah 15.",
          navText: "",
          navTextMedian: "Masukkan nilai median yang benar.",
          navTextRetry: "Coba lagi! Masukkan nilai median yang benar.",
          navTextDone: "Ketuk &raquo; untuk menyelesaikan.",
          medianPosition: "Posisi median",
          medianLabel: "Median:",
          positionRangeHeader: "Rentang<br>posisi",
          positionRanges: ["ke-1 - ke-4", "ke-5 - ke-10", "ke-11 - ke-14", "ke-15 - ke-20", "ke-21 - ke-25"],
        },
        6: {
          questionText: "<y>Bagus Sekali!</y>",
        },
      },
      final: {
        heading: "Bagus Sekali!",
        text: "<p>Kamu menemukan posisi tengah untuk <i>n</i>, lalu menggunakan frekuensi kumulatif untuk menentukan nilai data mana yang menempatinya &mdash; dan itulah median.<br><br>Logika yang sama berlaku untuk kumpulan data apa pun yang akan kamu temui.<br><br>Ketuk &lsquo;Ulangi&rsquo; untuk mengulang aktivitas ini.</p>",
        medianLabel: "Median",
        buttonText: "Ulangi",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
