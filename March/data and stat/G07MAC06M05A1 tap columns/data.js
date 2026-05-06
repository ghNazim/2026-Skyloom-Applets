const DATA = {
  en: {
    app: {
      graphTitle: "Hours spent on homework by students",
      xAxisLabel: "Hours",
      xData: [1, 2, 3, 4, 5, 6, 7],
      yData: [2, 4, 3, 5, 2, 3, 1],
      start: {
        heading: "Explore and Understand the Line Plot",
        text: "The line plot shows the hours spent on homework by the students in a week.<br>Let's learn to read and understand a line plot!",
        buttonText: "Start",
      },
      final: {
        heading: "Activity Completed!",
        text: "Well done!<br>You can now identify and locate data on a line plot.",
        buttonText: "Start Over",
      },
      steps: {
        1: {
          navText: "Tap the correct column of frequency marks.",
          navTextDone: "Tap » for next question.",
          navLast: "Tap » to conclude.",
        },
      },
      questions: [
        {
          questionText:
            "Q1. Tap the column that show  students who spent <y>2 hours</y> on homework.",
          correctColumns: [2],
          multiSelect: false,
          visualType: "pulsateX",
          wrongFeedback:
            "Not quite! Look at the number on the number line.<br>This does not show 2 hours. Try again.",
          correctFeedback:
            "Well done! This column shows that 4 students spent 2 hours on homework.",
          correctLabel: "4 Students",
        },
        {
          questionText:
            "Q2. Tap the column that shows the hours that the <y>most number of students</y> spent on homework.",
          correctColumns: [4],
          multiSelect: false,
          visualType: "fillCompare",
          wrongFeedback:
            "Not quite! This does not show the most number of students.<br>Look for the tallest column and try again.",
          correctFeedback:
            "Well done! 4 hours has the most frequency marks. The most number of students spent 4 hours on homework.",
          correctLabel: null,
        },
        {
          questionText:
            "Q3. Tap the column that shows the hours that the <y>least number of students</y> spent on homework.",
          correctColumns: [7],
          multiSelect: false,
          visualType: "fillCompare",
          wrongFeedback:
            "Not quite! This does not show the least number of students. Look for the shortest column and try again.",
          correctFeedback:
            "Well done! 7 hours has only one frequency marks.<br>The least number of students spent 7 hours on homework.",
          correctLabel: null,
        },
        {
          questionText:
            "Q4. Tap the columns that show  students who spent <y>more than 4 hours</y> on homework.",
          correctColumns: [5, 6, 7],
          multiSelect: true,
          visualType: "pulsateX",
          wrongFeedback:
            "Not quite! Look at the number on the number line.<br>This does not show more than 4 hours. Try again.",
          partialFeedbacks: [
            "Correct! There are more columns to tap. Keep going.",
            "Excellent! One more column to go.",
          ],
          correctFeedback:
            "Well done! 6 students spent more than 4 hours on homework.",
          correctLabel: null,
          summationText: "2 + 3 + 1 = 6",
        },
        {
          questionText:
            "Q5. Tap all the columns that show <y>exactly 2 students</y> who spent time on homework.",
          correctColumns: [1, 5],
          multiSelect: true,
          visualType: "simple",
          wrongFeedback:
            "Not quite! This column does not show exactly 2 students.<br>Count the frequency marks carefully and try again.",
          partialFeedbacks: [
            "Correct! Keep looking for another column.",
          ],
          correctFeedback:
            "Well done! Both 1 hour and 5 hours have exactly 2 frequency marks —<br>so 2 students spent each of these hours on homework.",
          correctLabel: null,
        },
      ],
    },
  },
  id: {
    app: {
      graphTitle: "Jam yang dihabiskan untuk PR oleh siswa",
      xAxisLabel: "Jam",
      xData: [1, 2, 3, 4, 5, 6, 7],
      yData: [2, 4, 3, 5, 2, 3, 1],
      start: {
        heading: "Jelajahi dan Pahami Diagram Garis",
        text: "Diagram garis menunjukkan jam yang dihabiskan siswa untuk mengerjakan PR dalam seminggu.<br>Mari belajar membaca dan memahami diagram garis!",
        buttonText: "Mulai",
      },
      final: {
        heading: "Aktivitas Selesai!",
        text: "Bagus sekali!<br>Kamu sekarang bisa mengidentifikasi dan menemukan data pada diagram garis.",
        buttonText: "Ulangi",
      },
      steps: {
        1: {
          navText: "Ketuk kolom tanda frekuensi yang benar.",
          navTextDone: "Ketuk » untuk pertanyaan berikutnya.",
          navLast: "Ketuk » untuk menyelesaikan.",
        },
      },
      questions: [
        {
          questionText:
            "Q1. Ketuk kolom yang menunjukkan siswa yang menghabiskan <y>2 jam</y> untuk PR.",
          correctColumns: [2],
          multiSelect: false,
          visualType: "pulsateX",
          wrongFeedback:
            "Belum tepat! Lihat angka pada garis bilangan.<br>Ini bukan menunjukkan 2 jam. Coba lagi.",
          correctFeedback:
            "Bagus! Kolom ini menunjukkan bahwa 4 siswa menghabiskan 2 jam untuk PR.",
          correctLabel: "4 Siswa",
        },
        {
          questionText:
            "Q2. Ketuk kolom yang menunjukkan jam yang dihabiskan oleh <y>siswa terbanyak</y> untuk PR.",
          correctColumns: [4],
          multiSelect: false,
          visualType: "fillCompare",
          wrongFeedback:
            "Belum tepat! Ini bukan menunjukkan siswa terbanyak.<br>Cari kolom tertinggi dan coba lagi.",
          correctFeedback:
            "Bagus! 4 jam memiliki tanda frekuensi terbanyak. Siswa terbanyak menghabiskan 4 jam untuk PR.",
          correctLabel: null,
        },
        {
          questionText:
            "Q3. Ketuk kolom yang menunjukkan jam yang dihabiskan oleh <y>siswa paling sedikit</y> untuk PR.",
          correctColumns: [7],
          multiSelect: false,
          visualType: "fillCompare",
          wrongFeedback:
            "Belum tepat! Ini bukan menunjukkan siswa paling sedikit. Cari kolom terpendek dan coba lagi.",
          correctFeedback:
            "Bagus! 7 jam hanya memiliki satu tanda frekuensi.<br>Siswa paling sedikit menghabiskan 7 jam untuk PR.",
          correctLabel: null,
        },
        {
          questionText:
            "Q4. Ketuk kolom yang menunjukkan siswa yang menghabiskan <y>lebih dari 4 jam</y> untuk PR.",
          correctColumns: [5, 6, 7],
          multiSelect: true,
          visualType: "pulsateX",
          wrongFeedback:
            "Belum tepat! Lihat angka pada garis bilangan.<br>Ini bukan menunjukkan lebih dari 4 jam. Coba lagi.",
          partialFeedbacks: [
            "Benar! Masih ada kolom lain yang harus diketuk. Lanjutkan.",
            "Hebat! Satu kolom lagi.",
          ],
          correctFeedback:
            "Bagus! 6 siswa menghabiskan lebih dari 4 jam untuk PR.",
          correctLabel: null,
          summationText: "2 + 3 + 1 = 6",
        },
        {
          questionText:
            "Q5. Ketuk semua kolom yang menunjukkan <y>tepat 2 siswa</y> yang menghabiskan waktu untuk PR.",
          correctColumns: [1, 5],
          multiSelect: true,
          visualType: "simple",
          wrongFeedback:
            "Belum tepat! Kolom ini tidak menunjukkan tepat 2 siswa.<br>Hitung tanda frekuensi dengan teliti dan coba lagi.",
          partialFeedbacks: [
            "Benar! Cari kolom lainnya.",
          ],
          correctFeedback:
            "Bagus! Baik 1 jam maupun 5 jam memiliki tepat 2 tanda frekuensi —<br>jadi 2 siswa menghabiskan masing-masing jam ini untuk PR.",
          correctLabel: null,
        },
      ],
    },
  },
};

const APP_DATA = DATA[current_language].app;
