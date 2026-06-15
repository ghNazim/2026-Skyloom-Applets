const DATA = {
  en: {
    app: {
      start: {
        heading: "Practice: Finding Mean from Bar Diagram",
        leftGraph: true,
        text: "The bar diagram shows the cars sold in 5 days.<br><br>Let\u2019s find the mean number of cars sold per day.<br><br>Tap \u2018Start\u2019 to begin.",
        buttonText: "Start",
      },
      barGraph: {
        yAxisLabel: "Number of cars sold",
        xAxisLabel: "Days",
        yLabels: [0, 2, 4, 6, 8, 10],
        xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        bars: [4, 5, 6, 7, 10],
      },
      steps: {
        1: {
          questionText: "We can find the mean from this formula:",
          navText: "Tap \u00BB to find start finding the mean.",
        },
        2: {
          questionText:
            "Let us first find the correct value of <i>n</i> (Number of days).",
          navText: "Tap on \u2018n\u2019 to solve for it.",
          navTextAfterTap:
            "Enter the correct value of \u2018n\u2019 into the denominator.",
          correctAnswer: 5,
          feedbackWrong: "There are 5 categories given.",
          questionAfterCorrect:
            "Here, <i>n</i> = 5. Which means, that there are 5 data values.",
          navAfterCorrect: "Tap \u00BB to find these data values.",
        },
        3: {
          questionText:
            "Let us now find the data values: <i>x</i><sub>1</sub>, <i>x</i><sub>2</sub>, <i>x</i><sub>3</sub>, <i>x</i><sub>4</sub>, and <i>x</i><sub>5</sub>.",
          navText: "Tap on any data value in the numerator.",
          navTextAfterTap:
            "Enter the correct value of <i>x</i><sub>INDEX</sub> into the numerator.",
          questionOnTap:
            "Let us find the value of <i>x</i><sub>INDEX</sub> i.e. cars sold on DAY.",
          feedbackWrong: "Read the bar of DAY again.",
          questionAfterOneCorrect:
            "<i>x</i><sub>INDEX</sub> = VALUE. Let\u2019s find the other values.",
          navAfterOneCorrect: "Tap on any other data value.",
          questionAllFilled:
            "We found all the values in numerator and denominator. Let us find the mean now.",
          navAllFilled: "Tap \u00BB to solve for the mean.",
          days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          answers: [4, 5, 6, 7, 10],
        },
        4: {
          questionText:
            "Let\u2019s now calculate the total sum of the numerator.",
          navText:
            "Tap \u2018Reveal\u2019 to reveal the sum of 4 + 5 + 6 + 7 + 10.",
          revealText: "Reveal",
          sumResult: 32,
          questionAfterSum:
            "Divide the total sum with the total number of values now.",
          navAfterSum:
            "Tap \u2018Reveal\u2019 to reveal the answer of 32 \u00F7 5.",
          meanResult: 6.4,
          questionFinal:
            "We found the final answer to be 6.4.<br>So, the mean number of cars sold per day = 6.4.",
          navFinal: "Tap \u00BB to visualize mean on the bar diagram.",
        },
        5: {
          questionText: "The mean, 6.4, is shown on the bar diagram.",
          navText: "Tap \u00BB for another question.",
        },
        6: {
          questionText: "Which day best represents the mean and why?",
          navText: "Tap and choose the correct day.",
          navComplete: "Tap \u00BB to summarize.",
          dayPlaceholder: "Select the day",
          reasonPlaceholder: "Select the reason",
          dayOptions: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
          ],
          reasonOptions: [
            "It is the furthest from the mean.",
            "It is the closest value to the mean.",
            "It has the lowest value in the data set.",
          ],
          correctDay: "Wednesday",
          correctReason: "It is the closest value to the mean.",
        },
      },
      end: {
        heading: "Well Done!",
        text:
          "You found the mean of the bar diagram to be <y>6.4</y>.<br><br>This is how you find the mean from bar diagram using the same old formula.<br><br>Tap \u2018Start Over\u2019 to repeat this activity.",
        buttonText: "Start Over",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Latihan: Mencari Rata-rata dari Diagram Batang",
        leftGraph: true,
        text: "Diagram batang menunjukkan mobil yang terjual dalam 5 hari.<br><br>Mari kita cari rata-rata jumlah mobil yang terjual per hari.<br><br>Ketuk \u2018Mulai\u2019 untuk memulai.",
        buttonText: "Mulai",
      },
      barGraph: {
        yAxisLabel: "Jumlah mobil terjual",
        xAxisLabel: "Hari",
        yLabels: [0, 2, 4, 6, 8, 10],
        xLabels: ["Sen", "Sel", "Rab", "Kam", "Jum"],
        bars: [4, 5, 6, 7, 10],
      },
      steps: {
        1: {
          questionText: "Kita bisa mencari rata-rata dari rumus ini:",
          navText: "Ketuk \u00BB untuk mulai mencari rata-rata.",
        },
        2: {
          questionText:
            "Mari kita temukan nilai <i>n</i> yang benar (Jumlah hari).",
          navText: "Ketuk \u2018n\u2019 untuk menyelesaikannya.",
          navTextAfterTap:
            "Masukkan nilai \u2018n\u2019 yang benar ke dalam penyebut.",
          correctAnswer: 5,
          feedbackWrong: "Ada 5 kategori yang diberikan.",
          questionAfterCorrect:
            "Di sini, <i>n</i> = 5. Artinya, ada 5 nilai data.",
          navAfterCorrect: "Ketuk \u00BB untuk menemukan nilai data ini.",
        },
        3: {
          questionText:
            "Mari kita temukan nilai data: <i>x</i><sub>1</sub>, <i>x</i><sub>2</sub>, <i>x</i><sub>3</sub>, <i>x</i><sub>4</sub>, dan <i>x</i><sub>5</sub>.",
          navText: "Ketuk salah satu nilai data di pembilang.",
          navTextAfterTap:
            "Masukkan nilai <i>x</i><sub>INDEX</sub> yang benar ke dalam pembilang.",
          questionOnTap:
            "Mari kita cari nilai <i>x</i><sub>INDEX</sub> yaitu mobil yang terjual pada hari DAY.",
          feedbackWrong: "Baca batang DAY lagi.",
          questionAfterOneCorrect:
            "<i>x</i><sub>INDEX</sub> = VALUE. Mari temukan nilai lainnya.",
          navAfterOneCorrect: "Ketuk nilai data lainnya.",
          questionAllFilled:
            "Kita telah menemukan semua nilai di pembilang dan penyebut. Mari kita cari rata-ratanya sekarang.",
          navAllFilled: "Ketuk \u00BB untuk menyelesaikan rata-rata.",
          days: ["Sen", "Sel", "Rab", "Kam", "Jum"],
          answers: [4, 5, 6, 7, 10],
        },
        4: {
          questionText:
            "Mari kita hitung jumlah total pembilang.",
          navText:
            "Ketuk \u2018Tampilkan\u2019 untuk menampilkan jumlah 4 + 5 + 6 + 7 + 10.",
          revealText: "Tampilkan",
          sumResult: 32,
          questionAfterSum:
            "Bagi jumlah total dengan jumlah total nilai sekarang.",
          navAfterSum:
            "Ketuk \u2018Tampilkan\u2019 untuk menampilkan jawaban dari 32 \u00F7 5.",
          meanResult: 6.4,
          questionFinal:
            "Kita menemukan jawaban akhir yaitu 6,4.<br>Jadi, rata-rata jumlah mobil yang terjual per hari = 6,4.",
          navFinal:
            "Ketuk \u00BB untuk memvisualisasikan rata-rata pada diagram batang.",
        },
        5: {
          questionText: "Rata-rata, 6,4, ditampilkan pada diagram batang.",
          navText: "Ketuk \u00BB untuk pertanyaan lain.",
        },
        6: {
          questionText: "Hari mana yang paling mewakili rata-rata dan mengapa?",
          navText: "Ketuk dan pilih hari yang benar.",
          navComplete: "Ketuk \u00BB untuk merangkum.",
          dayPlaceholder: "Pilih hari",
          reasonPlaceholder: "Pilih alasan",
          dayOptions: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"],
          reasonOptions: [
            "Ini yang paling jauh dari rata-rata.",
            "Ini nilai yang paling dekat dengan rata-rata.",
            "Ini memiliki nilai terendah dalam data.",
          ],
          correctDay: "Rabu",
          correctReason: "Ini nilai yang paling dekat dengan rata-rata.",
        },
      },
      end: {
        heading: "Bagus!",
        text:
          "Kamu menemukan rata-rata diagram batang adalah <y>6,4</y>.<br><br>Inilah cara mencari rata-rata dari diagram batang menggunakan rumus yang sama.<br><br>Ketuk \u2018Mulai Lagi\u2019 untuk mengulangi aktivitas ini.",
        buttonText: "Mulai Lagi",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
