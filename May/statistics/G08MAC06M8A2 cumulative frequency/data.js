const DATA = {
  en: {
    app: {
      start: {
        heading: "Cumulative Frequency & Position",
        text: "You've learnt how to build a <y>cumulative frequency table by adding<br>up frequencies row by row</y>.<br><br>Here, explore what those cumulative values are actually telling you<br>about where each data value sits in the sorted data set.<br><br>Tap 'Start' to begin.",
        buttonText: "Start",
      },
      tableHeaders: {
        data: "Data (<i>x</i><sub><i>i</i></sub>)",
        frequency: "Frequency (<i>f</i><sub><i>i</i></sub>)",
        cumulativeFrequency: "Cumulative<br>Frequency",
      },
      tableData: [
        { value: 5, frequency: 2 },
        { value: 6, frequency: 1 },
        { value: 7, frequency: 5 },
        { value: 8, frequency: 9 },
        { value: 9, frequency: 2 },
      ],
      sortedData: [5, 5, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 9],
      ordinalLabels: [
        "1<sup>st</sup>", "2<sup>nd</sup>", "3<sup>rd</sup>", "4<sup>th</sup>", "5<sup>th</sup>", "6<sup>th</sup>", "7<sup>th</sup>",
        "8<sup>th</sup>", "9<sup>th</sup>", "10<sup>th</sup>", "11<sup>th</sup>", "12<sup>th</sup>", "13<sup>th</sup>", "14<sup>th</sup>",
        "15<sup>th</sup>", "16<sup>th</sup>", "17<sup>th</sup>", "18<sup>th</sup>", "19<sup>th</sup>",
      ],
      steps: {
        1: {
          questionText:
            "Here is a sorted data set given in the frequency table. Let's build its cumulative frequency column.",
          navText: "Tap » to build the cumulative frequency column.",
        },
        2: {
          questionText:
            "Let's find cumulative frequency of each data value one-by-one, starting with the first value.",
          questionTextInitial:
            "Let's find cumulative frequency of each data value one-by-one, starting with the first value.",
          questionTextOngoing:
            "Let's find cumulative frequency of the next data values.",
          questionTextDone:
            "The last cumulative frequency also gives us the total number of data values.<br>So, here <i>n</i> = 19.",
          navText: "Tap on first ?",
          navTextInitial: "Tap on first ?",
          navTextOngoing: "Tap on next ?",
          navTextDone: "Tap » to continue.",
          textSectionFirst:
            "For first row:  <y>Cumulative frequency is the same as its frequency.</y>",
          textSectionNext:
            "For next row:  <y>Cumulative frequency = previous Cf + this row's frequency.</y>",
          dataSections: [
            "For 5: <pn>Cf = 2</pn>",
            "For 6: <pn>Cf = 2 + 1 = 3</pn>",
            "For 7: <pn>Cf = 3 + 5 = 8</pn>",
            "For 8: <pn>Cf = 8 + 9 = 17</pn>",
            "For 9: <pn>Cf = 17 + 2 = 19</pn>",
          ],
        },
        3: {
          questionText:
            "The cumulative frequency gives the last position of each data, hence, we can understand which data lies at which position.",
          navText: "Tap » to look at the positions of data on table.",
        },
        4: {
          navText: "Drag the pointer to see where its position lies in the table.",
          positionQuestions: [
            "For first value 5: CF = 2, meaning it is at positions 1 and 2.",
            "For 6: CF = 3, meaning it is at position 3.",
            "For 7: CF = 8, meaning it is at positions 4 to 8.",
            "For 8: CF = 17, meaning it is at positions 9 to 17.",
            "For 9: CF = 19, meaning it is at positions 18 and 19.",
          ],
        },
      },
      final: {
        heading: "Well done!",
        text: "You explored how the cumulative frequency of each row<br>tells you the position range of that data value in the sorted<br>data set.<br><br>The <y>CF value marks where that data value ends</y> — and<br>that's how you know exactly which positions it occupies.<br><br>Tap 'Start Over' to repeat this activity",
        buttonText: "Start Over",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Frekuensi Kumulatif & Posisi",
        text: "Kamu sudah belajar cara membuat tabel frekuensi kumulatif dengan<br>menjumlahkan frekuensi baris demi baris.<br><br>Di sini, jelajahi apa yang sebenarnya ditunjukkan oleh nilai kumulatif<br>tersebut tentang posisi setiap nilai data dalam kumpulan data yang terurut.<br><br>Ketuk 'Mulai' untuk memulai.",
        buttonText: "Mulai",
      },
      tableHeaders: {
        data: "Data (<i>x</i><sub><i>i</i></sub>)",
        frequency: "Frekuensi (<i>f</i><sub><i>i</i></sub>)",
        cumulativeFrequency: "Frekuensi<br>Kumulatif",
      },
      tableData: [
        { value: 5, frequency: 2 },
        { value: 6, frequency: 1 },
        { value: 7, frequency: 5 },
        { value: 8, frequency: 9 },
        { value: 9, frequency: 2 },
      ],
      sortedData: [5, 5, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 9],
      ordinalLabels: [
        "ke-1", "ke-2", "ke-3", "ke-4", "ke-5", "ke-6", "ke-7",
        "ke-8", "ke-9", "ke-10", "ke-11", "ke-12", "ke-13", "ke-14",
        "ke-15", "ke-16", "ke-17", "ke-18", "ke-19",
      ],
      steps: {
        1: {
          questionText:
            "Berikut adalah kumpulan data terurut yang disajikan dalam tabel frekuensi. Mari kita bangun kolom frekuensi kumulatifnya.",
          navText: "Ketuk » untuk membangun kolom frekuensi kumulatif.",
        },
        2: {
          questionText:
            "Mari kita temukan frekuensi kumulatif dari setiap nilai data satu per satu, dimulai dari nilai pertama.",
          questionTextInitial:
            "Mari kita temukan frekuensi kumulatif dari setiap nilai data satu per satu, dimulai dari nilai pertama.",
          questionTextOngoing:
            "Mari kita temukan frekuensi kumulatif dari nilai data berikutnya.",
          questionTextDone:
            "Frekuensi kumulatif terakhir juga memberikan jumlah total nilai data.<br>Jadi, di sini <i>n</i> = 19.",
          navText: "Ketuk pada ? pertama",
          navTextInitial: "Ketuk pada ? pertama",
          navTextOngoing: "Ketuk pada ? berikutnya",
          navTextDone: "Ketuk » untuk melanjutkan.",
          textSectionFirst:
            "Untuk baris pertama:  <y>Frekuensi kumulatif sama dengan frekuensinya.</y>",
          textSectionNext:
            "Untuk baris berikutnya:  <y>Frekuensi kumulatif = FK sebelumnya + frekuensi baris ini.</y>",
          dataSections: [
            "Untuk 5: <pn>Fk = 2</pn>",
            "Untuk 6: <pn>Fk = 2 + 1 = 3</pn>",
            "Untuk 7: <pn>Fk = 3 + 5 = 8</pn>",
            "Untuk 8: <pn>Fk = 8 + 9 = 17</pn>",
            "Untuk 9: <pn>Fk = 17 + 2 = 19</pn>",
          ],
        },
        3: {
          questionText:
            "Frekuensi kumulatif memberikan posisi terakhir dari setiap data, sehingga kita dapat memahami di posisi mana setiap data berada.",
          navText: "Ketuk » untuk melihat posisi data pada tabel.",
        },
        4: {
          navText: "Geser penunjuk untuk melihat di posisi mana nilainya berada pada tabel.",
          positionQuestions: [
            "Untuk nilai pertama 5: FK = 2, artinya berada pada posisi 1 dan 2.",
            "Untuk 6: FK = 3, artinya berada pada posisi 3.",
            "Untuk 7: FK = 8, artinya berada pada posisi 4 sampai 8.",
            "Untuk 8: FK = 17, artinya berada pada posisi 9 sampai 17.",
            "Untuk 9: FK = 19, artinya berada pada posisi 18 dan 19.",
          ],
        },
      },
      final: {
        heading: "Bagus sekali!",
        text: "Kamu telah menjelajahi bagaimana frekuensi kumulatif setiap baris<br>memberitahu rentang posisi nilai data tersebut dalam kumpulan data<br>yang terurut.<br><br><y>Nilai FK menandai di posisi mana nilai data itu berakhir</y> — dan<br>itulah cara kamu mengetahui posisi mana saja yang ditempatinya.<br><br>Ketuk 'Ulangi' untuk mengulang aktivitas ini",
        buttonText: "Ulangi",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
