const DATA = {
  en: {
    app: {
      start: {
        heading: "Words or Numbers?",
        text: "The teacher recorded data about Budi, Siti, Rizki, and Dewi —<br>four students in Grade 7.<br>Let's look at each piece of data and classify it as a word or a number.",
        buttonText: "Start",
      },
      intermission: {
        heading: "Will the answers be words or numbers?",
        text: "The teacher is running a survey about Grade 7 students. She has prepared<br>some statistical questions to find out more about her class.<br>Let's decide whether the answers to each question will be<br>words or numbers.",
        buttonText: "Begin",
      },
      final: {
        heading: "Activity Completed!",
        text: "From both activities, we can see that data always comes in one of two forms:",
        buttonText: "Start Over",
        summaryCards: [
          {
            icon: "abc",
            heading: "Words",
            text: "Names, places, subjects,<br>preferences, groups, etc.",
          },
          {
            icon: "1234",
            heading: "Numbers",
            text: "Heights, ages, counts,<br>distances, temperatures, etc.",
          },
        ],
      },
      labels: {
        words: "Words",
        numbers: "Numbers",
      },
      steps: {
        1: {
          questionText:
            "The data of 4 students is below.<br>Look at each type of data below — is it written as words or numbers?",
          navText: "Tap Words or Numbers for each type of data.",
          navTextDone: "Tap » to see what we found.",
          feedback: {
            correct:
              "Well done! You correctly classified all the data.<br>Notice how clearly the data splits into two groups!",
            wrongMany:
              "Not quite! Look at each data carefully — are the values written as words or as numbers?",
            wrongFewTemplate:
              "Almost! Check these again: {titles}.<br>Are the students’ values written as words or numbers?",
          },
          cards: [
            {
              title: "Home Province:",
              shortTitle: "Home province",
              answer: 0,
              contentRows: [
                ["Budi", "→", "Riau"],
                ["Siti", "→", "Papua"],
                ["Rizki", "→", "Bali"],
                ["Dewi", "→", "Sulawesi"],
              ],
            },
            {
              title: "Favorite Subjects:",
              shortTitle: "Favorite subjects",
              answer: 0,
              contentRows: [
                ["Budi", "→", "Maths"],
                ["Siti", "→", "Science"],
                ["Rizki", "→", "English"],
                ["Dewi", "→", "Maths"],
              ],
            },
            {
              title: "Age:",
              shortTitle: "Age",
              answer: 1,
              contentRows: [
                ["Budi", "→", "13"],
                ["Siti", "→", "12"],
                ["Rizki", "→", "13"],
                ["Dewi", "→", "12"],
              ],
            },
            {
              title: "Height:",
              shortTitle: "Height",
              answer: 1,
              contentRows: [
                ["Budi", "→", "152 cm"],
                ["Siti", "→", "148 cm"],
                ["Rizki", "→", "160 cm"],
                ["Dewi", "→", "155 cm"],
              ],
            },
          ],
        },
        2: {
          questionText: "What do you notice?",
          navText: "Tap » to classify more data.",
          cards: [
            {
              title: "Home Province:",
              highlight: "Riau, Papua,<br>Bali, Sulawesi",
              text: "Province names are words.",
            },
            {
              title: "Favorite Subjects:",
              highlight: "Maths, Science,<br>English, Maths",
              text: "Subjects are word.",
            },
            {
              title: "Age:",
              highlight: "13, 12, 13, 12",
              text: "Age is a number.",
            },
            {
              title: "Height:",
              highlight: "152 cm, 148 cm,<br>160 cm, 155 cm",
              text: "Height is a number.",
            },
          ],
          noteText:
            "Some data about the students is written as words and<br>other data is written as numbers.<br><br>This tells us that data does not always look the same —<br>it comes in two different forms!",
        },
        4: {
          questionText:
            "Look at each question and think: will the answers be <y>words</y> or <y>numbers</y>?",
          navText: "Tap Words or Numbers for each question.",
          navTextDone: "Tap » to summarise.",
          feedback: {
            correct:
              "Excellent! You correctly identified the type of answers.",
            allWrong:
              "Not quite! Look at the highlighted words — are they asking you to name something or to count something? Try again!",
            specialName:
              "Almost! Look at the highlighted words again. Do they ask you to count something — or to name something? Try again!",
            specialCount:
              "Almost! Look at the highlighted words again. Do they ask you to name something — or to count something? Try again!",
            defaultWrong:
              "Not quite! Look at the highlighted words — are they asking you to name something or to count something? Try again!",
          },
          cards: [
            {
              content:
                "What is the most popular food among students in our class?",
              wrongHighlight: "What is the most popular food",
              answer: 0,
            },
            {
              content:
                "How many siblings do students in our class have?",
              wrongHighlight: "How many siblings",
              answer: 1,
            },
            {
              content:
                "How many books do students in our class read in a month?",
              wrongHighlight: "How many books",
              answer: 1,
            },
            {
              content:
                "What type of transport do most students in our class use to school?",
              wrongHighlight: "What type of transport",
              answer: 0,
            },
          ],
        },
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Kata atau Angka?",
        text: "Guru mencatat data tentang Budi, Siti, Rizki, dan Dewi —<br>empat siswa kelas 7.<br>Mari lihat setiap data dan klasifikasikan apakah itu kata atau angka.",
        buttonText: "Mulai",
      },
      intermission: {
        heading: "Apakah jawabannya kata atau angka?",
        text: "Guru sedang melakukan survei tentang siswa kelas 7. Ia menyiapkan<br>beberapa pertanyaan statistik untuk mengenal kelasnya lebih jauh.<br>Mari tentukan apakah jawaban dari tiap pertanyaan berupa<br>kata atau angka.",
        buttonText: "Mulai",
      },
      final: {
        heading: "Aktivitas Selesai!",
        text: "Dari kedua aktivitas, kita dapat melihat bahwa data selalu hadir dalam dua bentuk:",
        buttonText: "Ulangi",
        summaryCards: [
          {
            icon: "abc",
            heading: "Kata",
            text: "Nama, tempat, mata pelajaran,<br>preferensi, kelompok, dll.",
          },
          {
            icon: "1234",
            heading: "Angka",
            text: "Tinggi, usia, jumlah,<br>jarak, suhu, dll.",
          },
        ],
      },
      labels: {
        words: "Kata",
        numbers: "Angka",
      },
      steps: {
        1: {
          questionText:
            "Data 4 siswa ada di bawah ini.<br>Lihat setiap jenis data — apakah ditulis sebagai kata atau angka?",
          navText: "Ketuk Kata atau Angka untuk tiap jenis data.",
          navTextDone: "Ketuk » untuk melihat hasilnya.",
          feedback: {
            correct:
              "Bagus sekali! Kamu berhasil mengelompokkan semua data dengan benar.<br>Lihat betapa jelasnya data terbagi menjadi dua kelompok!",
            wrongMany:
              "Belum tepat! Perhatikan lagi tiap data — nilainya ditulis sebagai kata atau angka?",
            wrongFewTemplate:
              "Hampir benar! Cek lagi: {titles}.<br>Apakah nilainya ditulis sebagai kata atau angka?",
          },
          cards: [
            {
              title: "Provinsi Asal:",
              shortTitle: "Provinsi asal",
              answer: 0,
              contentRows: [
                ["Budi", "→", "Riau"],
                ["Siti", "→", "Papua"],
                ["Rizki", "→", "Bali"],
                ["Dewi", "→", "Sulawesi"],
              ],
            },
            {
              title: "Pelajaran Favorit:",
              shortTitle: "Pelajaran favorit",
              answer: 0,
              contentRows: [
                ["Budi", "→", "Matematika"],
                ["Siti", "→", "IPA"],
                ["Rizki", "→", "Bahasa&nbsp;Inggris"],
                ["Dewi", "→", "Matematika"],
              ],
            },
            {
              title: "Usia:",
              shortTitle: "Usia",
              answer: 1,
              contentRows: [
                ["Budi", "→", "13"],
                ["Siti", "→", "12"],
                ["Rizki", "→", "13"],
                ["Dewi", "→", "12"],
              ],
            },
            {
              title: "Tinggi Badan:",
              shortTitle: "Tinggi badan",
              answer: 1,
              contentRows: [
                ["Budi", "→", "152 cm"],
                ["Siti", "→", "148 cm"],
                ["Rizki", "→", "160 cm"],
                ["Dewi", "→", "155 cm"],
              ],
            },
          ],
        },
        2: {
          questionText: "Apa yang kamu perhatikan?",
          navText: "Ketuk » untuk mengklasifikasikan data lagi.",
          cards: [
            {
              title: "Provinsi Asal:",
              highlight: "Riau, Papua,<br>Bali, Sulawesi",
              text: "Nama provinsi adalah kata.",
            },
            {
              title: "Pelajaran Favorit:",
              highlight: "Matematika, IPA,<br>Bahasa Inggris, Matematika",
              text: "Nama pelajaran adalah kata.",
            },
            {
              title: "Usia:",
              highlight: "13, 12, 13, 12",
              text: "Usia adalah angka.",
            },
            {
              title: "Tinggi Badan:",
              highlight: "152 cm, 148 cm,<br>160 cm, 155 cm",
              text: "Tinggi badan adalah angka.",
            },
          ],
          noteText:
            "Sebagian data tentang siswa ditulis sebagai kata dan<br>sebagian lainnya ditulis sebagai angka.<br><br>Ini menunjukkan bahwa bentuk data tidak selalu sama —<br>data hadir dalam dua bentuk yang berbeda!",
        },
        4: {
          questionText:
            "Lihat tiap pertanyaan dan pikirkan: jawabannya berupa <y>kata</y> atau <y>angka</y>?",
          navText: "Ketuk Kata atau Angka untuk tiap pertanyaan.",
          navTextDone: "Ketuk » untuk merangkum.",
          feedback: {
            correct:
              "Hebat! Kamu berhasil mengidentifikasi jenis jawabannya.",
            allWrong:
              "Belum tepat! Lihat kata yang disorot — apakah pertanyaannya meminta menyebutkan sesuatu atau menghitung sesuatu? Coba lagi!",
            specialName:
              "Hampir benar! Lihat lagi kata yang disorot. Apakah pertanyaannya meminta menghitung sesuatu — atau menyebutkan sesuatu? Coba lagi!",
            specialCount:
              "Hampir benar! Lihat lagi kata yang disorot. Apakah pertanyaannya meminta menyebutkan sesuatu — atau menghitung sesuatu? Coba lagi!",
            defaultWrong:
              "Belum tepat! Lihat kata yang disorot — apakah pertanyaannya meminta menyebutkan sesuatu atau menghitung sesuatu? Coba lagi!",
          },
          cards: [
            {
              content:
                "Makanan apa yang paling populer di antara siswa di kelas kita?",
              wrongHighlight: "Makanan apa yang paling populer",
              answer: 0,
            },
            {
              content:
                "Berapa banyak saudara kandung yang dimiliki siswa di kelas kita?",
              wrongHighlight: "Berapa banyak saudara kandung",
              answer: 1,
            },
            {
              content:
                "Berapa banyak buku yang dibaca siswa di kelas kita dalam sebulan?",
              wrongHighlight: "Berapa banyak buku",
              answer: 1,
            },
            {
              content:
                "Jenis transportasi apa yang paling sering digunakan siswa di kelas kita ke sekolah?",
              wrongHighlight: "Jenis transportasi apa",
              answer: 0,
            },
          ],
        },
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
