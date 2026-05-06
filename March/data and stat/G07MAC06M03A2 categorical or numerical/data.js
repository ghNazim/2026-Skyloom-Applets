const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      steps: {
        0: {
          questionText: "",
          heading: "Data Sort - Categorical or Numerical?",
          text: "Read the data item carefully and sort them into the correct category!",
          startButton: "Start",
        },
        1: {
          questionText:
            "Classify whether the data is categorical or numerical.",
          navText: "Drag and drop the statement to the correct column.",
          navWrong: "Tap 'Try Again'.",
          navCorrect: "Tap » for the next question.",
          navFinal: "Tap » to summarize.",
        },
        2: {
          questionText:
            "Categorical data describes qualities or characteristics.<br>Numerical data measures or counts quantities.",
          startOverButton: "Start Over",
        },
      },
      columns: {
        categorical: "Categorical Data",
        numerical: "Numerical Data",
      },
      feedback: {
        tryAgainButton: "Try Again",
      },
      questions: [
        {
          item: "The blood types of students in Grade 7.",
          correctInfo:
            "The blood types of students in Grade 7 - <bl>A, B, O, AB are labels</bl>",
          correct_place: "categorical",
          correct_feedback:
            "Correct! Blood types are labels that name a group - that makes them categorical.",
          wrong_feedback:
            "Not quite! Blood types like A, B, O, AB are labels. They name a group, not a measurement. Think again!",
        },
        {
          item: "How many hours do Grade 7 students sleep?",
          correctInfo:
            "How many hours do Grade 7 students sleep? - <yl>7 hours, 8 hours are counts</yl>",
          correct_place: "numerical",
          correct_feedback:
            "Correct! Hours of sleep can be measured and compared - that makes them numerical.",
          wrong_feedback:
            "Not quite! Values like 7, 8, 9 hours are measurements - they tell us how much. Think again!",
        },
        {
          item: "What is the home language of students in our class?",
          correctInfo:
            "What is the home language of students in our class? - <bl>Javanese, Indonesian are names</bl>",
          correct_place: "categorical",
          correct_feedback:
            "Correct! Language names are labels that describe a group - that makes them categorical.",
          wrong_feedback:
            "Not quite! Values like Javanese, Indonesian are names - they label a group, not a count. Think again!",
        },
        {
          item: "Gold medals won by Indonesia at the Asian Games",
          correctInfo:
            "Gold medals won by Indonesia at the Asian Games - <yl>3, 7, 12 medals are counts</yl>",
          correct_place: "numerical",
          correct_feedback:
            "Correct! Medal counts can be counted and compared - that makes them numerical.",
          wrong_feedback:
            "Not quite! Values like 3, 7, 12 medals are counts - they tell us how many. Think again!",
        },
        {
          item: "How many online games do students in our class play?",
          correctInfo:
            "How many online games do students in our class play? - <yl>2, 3, 5 games are counts</yl>",
          correct_place: "numerical",
          correct_feedback:
            "Correct! The number of games can be counted and compared - that makes them numerical.",
          wrong_feedback:
            "Not quite! Values like 2, 3, 5 games are counts - they tell us how many. Think again!",
        },
        {
          item: "The jersey numbers of players in the school football team",
          correctInfo:
            "The jersey numbers of players in the school football team - <bl>5, 7, 11 are jersey labels</bl>",
          correct_place: "categorical",
          correct_feedback:
            "Correct! Jersey numbers are labels, not measurements - that makes them categorical.",
          wrong_feedback:
            "Not quite! Numbers like 5, 7, 11 are labels on shirts - you cannot do meaningful maths with them. Think again!",
        },

        {
          item: "What are the class sections of Grade 7 in our school?",
          correctInfo:
            "What are the class sections of Grade 7 in our school? - <bl>7-1, 7-2 are labels for groups</bl>",
          correct_place: "categorical",
          correct_feedback:
            "Correct! Class sections are labels for groups - that makes them categorical.",
          wrong_feedback:
            "Not quite! Values like 7-1, 7-2 are labels for groups - you cannot do meaningful maths with them. Think again!",
        },
        {
          item: "The number of students in Grade 7 who play sports",
          correctInfo:
            "The number of students in Grade 7 who play sports - <yl>15, 20, 25 students are counts</yl>",
          correct_place: "numerical",
          correct_feedback:
            "Correct! The number of students can be counted and compared - that makes them numerical.",
          wrong_feedback:
            "Not quite! Values like 15, 20, 25 students are counts - they tell us how many. Think again!",
        },
      ],
    },
  },
  id: {
    app: {
      steps: {
        0: {
          questionText: "",
          heading: "Sortir Data - Kategorikal atau Numerik?",
          text: "Baca data dengan saksama lalu masukkan ke kategori yang tepat!",
          startButton: "Mulai",
        },
        1: {
          questionText:
            "Klasifikasikan apakah data bersifat kategorikal atau numerik.",
          navText: "Seret dan lepaskan pernyataan ke kolom yang benar.",
          navWrong: "Ketuk 'Coba Lagi'.",
          navCorrect: "Ketuk » untuk soal berikutnya.",
          navFinal: "Ketuk » untuk ringkasan.",
        },
        2: {
          questionText:
            "Data kategorikal menjelaskan kualitas atau karakteristik.<br>Data numerik mengukur atau menghitung kuantitas.",
          startOverButton: "Mulai Lagi",
        },
      },
      columns: {
        categorical: "Data Kategorikal",
        numerical: "Data Numerik",
      },
      feedback: {
        tryAgainButton: "Coba Lagi",
      },
      questions: [
        {
          item: "Golongan darah siswa kelas 7.",
          correctInfo:
            "Golongan darah siswa kelas 7 - <bl>A, B, O, AB adalah label</bl>",
          correct_place: "categorical",
          correct_feedback:
            "Benar! Golongan darah adalah label yang menamai kelompok - jadi ini data kategorikal.",
          wrong_feedback:
            "Belum tepat! Golongan darah seperti A, B, O, AB adalah label. Itu menamai kelompok, bukan pengukuran. Coba lagi!",
        },
        {
          item: "Berapa jam siswa kelas 7 tidur?",
          correctInfo:
            "Berapa jam siswa kelas 7 tidur? - <yl>7 jam, 8 jam adalah hitungan</yl>",
          correct_place: "numerical",
          correct_feedback:
            "Benar! Jam tidur dapat diukur dan dibandingkan - jadi ini data numerik.",
          wrong_feedback:
            "Belum tepat! Nilai seperti 7, 8, 9 jam adalah pengukuran - itu menunjukkan berapa banyak. Coba lagi!",
        },
        {
          item: "Apa bahasa ibu siswa di kelas kita?",
          correctInfo:
            "Apa bahasa ibu siswa di kelas kita? - <bl>Jawa, Indonesia adalah nama</bl>",
          correct_place: "categorical",
          correct_feedback:
            "Benar! Nama bahasa adalah label yang menggambarkan kelompok - jadi ini data kategorikal.",
          wrong_feedback:
            "Belum tepat! Nilai seperti Jawa, Indonesia adalah nama - itu label kelompok, bukan hitungan. Coba lagi!",
        },
        {
          item: "Medali emas yang dimenangkan Indonesia pada Asian Games",
          correctInfo:
            "Medali emas yang dimenangkan Indonesia pada Asian Games - <yl>3, 7, 12 medali adalah hitungan</yl>",
          correct_place: "numerical",
          correct_feedback:
            "Benar! Jumlah medali bisa dihitung dan dibandingkan - jadi ini data numerik.",
          wrong_feedback:
            "Belum tepat! Nilai seperti 3, 7, 12 medali adalah hitungan - itu menunjukkan berapa banyak. Coba lagi!",
        },
        {
          item: "Berapa banyak game online yang dimainkan siswa di kelas kita?",
          correctInfo:
            "Berapa banyak game online yang dimainkan siswa di kelas kita? - <yl>2, 3, 5 game adalah hitungan</yl>",
          correct_place: "numerical",
          correct_feedback:
            "Benar! Jumlah game dapat dihitung dan dibandingkan - jadi ini data numerik.",
          wrong_feedback:
            "Belum tepat! Nilai seperti 2, 3, 5 game adalah hitungan - itu menunjukkan berapa banyak. Coba lagi!",
        },
        {
          item: "Nomor punggung pemain tim sepak bola sekolah",
          correctInfo:
            "Nomor punggung pemain tim sepak bola sekolah - <bl>5, 7, 11 adalah label nomor punggung</bl>",
          correct_place: "categorical",
          correct_feedback:
            "Benar! Nomor punggung adalah label, bukan pengukuran - jadi ini data kategorikal.",
          wrong_feedback:
            "Belum tepat! Angka seperti 5, 7, 11 adalah label pada baju - tidak bisa dipakai untuk operasi hitung bermakna. Coba lagi!",
        },

        {
          item: "Apa saja kelas bagian (section) kelas 7 di sekolah kita?",
          correctInfo:
            "Apa saja kelas bagian (section) kelas 7 di sekolah kita? - <bl>7-1, 7-2 adalah label kelompok</bl>",
          correct_place: "categorical",
          correct_feedback:
            "Benar! Kelas bagian adalah label kelompok - jadi ini data kategorikal.",
          wrong_feedback:
            "Belum tepat! Nilai seperti 7-1, 7-2 adalah label kelompok - tidak bisa dipakai untuk operasi hitung bermakna. Coba lagi!",
        },
        {
          item: "Jumlah siswa kelas 7 yang bermain olahraga",
          correctInfo:
            "Jumlah siswa kelas 7 yang bermain olahraga - <yl>15, 20, 25 siswa adalah hitungan</yl>",
          correct_place: "numerical",
          correct_feedback:
            "Benar! Jumlah siswa dapat dihitung dan dibandingkan - jadi ini data numerik.",
          wrong_feedback:
            "Belum tepat! Nilai seperti 15, 20, 25 siswa adalah hitungan - itu menunjukkan berapa banyak. Coba lagi!",
        },
      ],
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
