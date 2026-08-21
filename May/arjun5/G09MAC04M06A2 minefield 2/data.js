const DATA = {
  en: {
    app: {
      questionText: "Sample Space Minefield",
      experiments: [
        {
          visualTitle: "EXPERIMENT 1:<br><vt>A die is rolled and a coin is flipped.</vt>",
          table: {
            rowLabel: "Die",
            columnLabel: "Coin",
            rowItems: [1, 2, 3, 4, 5, 6],
            columnItems: ["H", "T"],
          },
          cornerImages: {
            row: "assets/dice.png",
            col: "assets/coin.png",
          },
          teach: {
            eventText: "Getting tails and an odd number",
            selectCols: ["T"],
            selectRows: [1, 3, 5],
            safeOutcomes: [
              { row: 1, col: "T" },
              { row: 3, col: "T" },
              { row: 5, col: "T" },
            ],
            demoMine: { row: 2, col: "T" },
          },
          play: {
            eventText: "Getting heads and an even number",
            selectCols: ["H"],
            selectRows: [2, 4, 6],
            safeOutcomes: [
              { row: 2, col: "H" },
              { row: 4, col: "H" },
              { row: 6, col: "H" },
            ],
            matchFeedback: "({outcome}) matches heads and an even number.",
            mineFeedback: "({outcome}) doesn&rsquo;t match heads and an even number.",
            revealSummary:
              "We get 3 favorable outcomes by overlapping the even number rows with heads column.",
          },
          navTextDone: "Tap &raquo; to see your second experiment.",
        },
        {
          visualTitle: "EXPERIMENT 2:<br><vt>A coin and a spinner with 1, 2, 3, 4, 5.</vt>",
          table: {
            rowLabel: "Spinner",
            columnLabel: "Coin",
            rowItems: [1, 2, 3, 4, 5],
            columnItems: ["H", "T"],
          },
          cornerImages: {
            row: "assets/spin.png",
            col: "assets/coin.png",
          },
          play: {
            eventText: "Getting tails and a prime number",
            selectCols: ["T"],
            selectRows: [2, 3, 5],
            safeOutcomes: [
              { row: 2, col: "T" },
              { row: 3, col: "T" },
              { row: 5, col: "T" },
            ],
            matchFeedback: "({outcome}) matches tails and a prime number.",
            mineFeedback: "({outcome}) doesn&rsquo;t match tails and a prime number.",
            revealSummary:
              "We get 3 favorable outcomes by overlapping the prime number rows with tails column.",
          },
          navTextDone: "Tap &raquo; to see your third experiment.",
        },
        {
          visualTitle: "EXPERIMENT 3:<br><vt>A die and a spinner with 1, 2, 3, 4.</vt>",
          table: {
            rowLabel: "Die",
            columnLabel: "Spinner",
            rowItems: [1, 2, 3, 4, 5, 6],
            columnItems: [1, 2, 3, 4],
          },
          cornerImages: {
            row: "assets/dice.png",
            col: "assets/spin.png",
          },
          play: {
            eventText: "Getting an odd number on the spinner and an even number on the die",
            selectCols: [1, 3],
            selectRows: [2, 4, 6],
            safeOutcomes: [
              { row: 2, col: 1 },
              { row: 2, col: 3 },
              { row: 4, col: 1 },
              { row: 4, col: 3 },
              { row: 6, col: 1 },
              { row: 6, col: 3 },
            ],
            matchFeedback:
              "({outcome}) matches an odd number on the spinner and an even number on the die.",
            mineFeedback:
              "({outcome}) doesn&rsquo;t match an odd number on the spinner and an even number on the die.",
            revealSummary:
              "We get 6 favorable outcomes by overlapping the even number rows with the odd spinner columns.",
          },
          navTextDone: "Tap &raquo; to conclude.",
        },
      ],
      steps: {
        1: {
          navText: "Tap &raquo; to see an event.",
          rightText:
            "The <y>sample space minefield</y> is back!<br><br>This time, we need to identify favourable outcomes of events.",
        },
        2: {
          navText: "Tap &raquo; to pick given events.",
          boxedTitle: "Safe patches:",
          boxedLabel: "Favorable outcomes<br>of event:",
          warningText: "All other patches have mines!",
        },
        3: {
          navText: "Tap the button to select column with tails.",
          navSelectOdds: "Tap the button to select rows with odd numbers.",
          navSelectOverlaps: "Tap the button to select overlapping outcomes.",
          navTapHighlights: "Tap the highlighted patches.",
          navTapMine: "Tap any non overlapping patch.",
          navTextDone: "Tap &raquo; to continue.",
          boxedTitle: "Safe patches:",
          boxedLabel: "Favorable outcomes<br>of event:",
          btnSelectTails: "Select Tails",
          btnSelectOdds: "Select Odd<br>Numbers",
          btnSelectOverlaps: "Select<br>Overlaps",
          matchFeedback: "({outcome}) matches tails and an odd number.",
          mineFeedback: "({outcome}) doesn&rsquo;t match tails and an odd number.",
          allFound: "All safe patches found!",
          livesIntact: "Your lives<br>remain intact",
          lifeLost: "You lose a life<br>when a mine is hit",
          overlapHint: "Only overlapping patches show correct favorable outcomes.",
        },
        4: {
          navText: "Tap to play!",
          heading: "Sample Space Minefield – Round 2",
          playButton: "Play",
          playHint: "Tap to play!",
          tableCaption: "All patches are either safe or contain a mine.",
          rightText:
            "Now, the row and column highlights<br>won&rsquo;t be given.<br><br>Read the event, think about the<br>correct row and column overlap to<br><y>spot the favorable outcomes.</y>",
        },
        5: {
          navText: "Tap the patches with the given outcomes.",
          boxedTitle: "Safe patches:",
          boxedLabel: "Favorable outcomes of event:",
          warningText: "All other patches have mines!",
          gameOver: "GAME OVER!",
          allFound: "All safe patches found!",
          gameOverFound: "You could find {found} of {total} favorable outcomes.",
        },
      },
      final: {
        heading: "Activity Completed!",
        text:
          "We learnt how to identify <y>favorable outcomes</y> for<br><y>events with two conditions</y> in a table.<br>Outcomes that are<br><y>an overlap of both conditions.</y>",
        buttonText: "Start Over",
        hintText: "Tap \u2018Start Over\u2019 to play again.",
      },
    },
  },
  id: {
    app: {
      questionText: "Medan Ranjau Ruang Sampel",
      experiments: [
        {
          visualTitle: "PERCOBAAN 1:<br><vt>Sebuah dadu dilempar dan sebuah koin dilempar.</vt>",
          table: {
            rowLabel: "Dadu",
            columnLabel: "Koin",
            rowItems: [1, 2, 3, 4, 5, 6],
            columnItems: ["A", "G"],
          },
          cornerImages: {
            row: "assets/dice.png",
            col: "assets/coin.png",
          },
          teach: {
            eventText: "Mendapat gambar dan bilangan ganjil",
            selectCols: ["G"],
            selectRows: [1, 3, 5],
            safeOutcomes: [
              { row: 1, col: "G" },
              { row: 3, col: "G" },
              { row: 5, col: "G" },
            ],
            demoMine: { row: 2, col: "G" },
          },
          play: {
            eventText: "Mendapat angka dan bilangan genap",
            selectCols: ["A"],
            selectRows: [2, 4, 6],
            safeOutcomes: [
              { row: 2, col: "A" },
              { row: 4, col: "A" },
              { row: 6, col: "A" },
            ],
            matchFeedback: "({outcome}) cocok dengan angka dan bilangan genap.",
            mineFeedback: "({outcome}) tidak cocok dengan angka dan bilangan genap.",
            revealSummary:
              "Kita mendapat 3 hasil menguntungkan dengan mengiris baris bilangan genap dengan kolom angka.",
          },
          navTextDone: "Ketuk &raquo; untuk melihat percobaan kedua.",
        },
        {
          visualTitle: "PERCOBAAN 2:<br><vt>Sebuah koin dan spinner dengan 1, 2, 3, 4, 5.</vt>",
          table: {
            rowLabel: "Spinner",
            columnLabel: "Koin",
            rowItems: [1, 2, 3, 4, 5],
            columnItems: ["A", "G"],
          },
          cornerImages: {
            row: "assets/spin.png",
            col: "assets/coin.png",
          },
          play: {
            eventText: "Mendapat gambar dan bilangan prima",
            selectCols: ["G"],
            selectRows: [2, 3, 5],
            safeOutcomes: [
              { row: 2, col: "G" },
              { row: 3, col: "G" },
              { row: 5, col: "G" },
            ],
            matchFeedback: "({outcome}) cocok dengan gambar dan bilangan prima.",
            mineFeedback: "({outcome}) tidak cocok dengan gambar dan bilangan prima.",
            revealSummary:
              "Kita mendapat 3 hasil menguntungkan dengan mengiris baris bilangan prima dengan kolom gambar.",
          },
          navTextDone: "Ketuk &raquo; untuk melihat percobaan ketiga.",
        },
        {
          visualTitle: "PERCOBAAN 3:<br><vt>Sebuah dadu dan spinner dengan 1, 2, 3, 4.</vt>",
          table: {
            rowLabel: "Dadu",
            columnLabel: "Spinner",
            rowItems: [1, 2, 3, 4, 5, 6],
            columnItems: [1, 2, 3, 4],
          },
          cornerImages: {
            row: "assets/dice.png",
            col: "assets/spin.png",
          },
          play: {
            eventText: "Mendapat bilangan ganjil pada spinner dan bilangan genap pada dadu",
            selectCols: [1, 3],
            selectRows: [2, 4, 6],
            safeOutcomes: [
              { row: 2, col: 1 },
              { row: 2, col: 3 },
              { row: 4, col: 1 },
              { row: 4, col: 3 },
              { row: 6, col: 1 },
              { row: 6, col: 3 },
            ],
            matchFeedback:
              "({outcome}) cocok dengan bilangan ganjil pada spinner dan bilangan genap pada dadu.",
            mineFeedback:
              "({outcome}) tidak cocok dengan bilangan ganjil pada spinner dan bilangan genap pada dadu.",
            revealSummary:
              "Kita mendapat 6 hasil menguntungkan dengan mengiris baris bilangan genap dengan kolom spinner ganjil.",
          },
          navTextDone: "Ketuk &raquo; untuk menyelesaikan.",
        },
      ],
      steps: {
        1: {
          navText: "Ketuk &raquo; untuk melihat sebuah kejadian.",
          rightText:
            "<y>Medan ranjau ruang sampel</y> kembali!<br><br>Kali ini, kita perlu mengidentifikasi hasil yang menguntungkan dari kejadian.",
        },
        2: {
          navText: "Ketuk &raquo; untuk memilih kejadian yang diberikan.",
          boxedTitle: "Petak aman:",
          boxedLabel: "Hasil menguntungkan<br>dari kejadian:",
          warningText: "Semua petak lainnya berisi ranjau!",
        },
        3: {
          navText: "Ketuk tombol untuk memilih kolom gambar.",
          navSelectOdds: "Ketuk tombol untuk memilih baris bilangan ganjil.",
          navSelectOverlaps: "Ketuk tombol untuk memilih hasil yang beririsan.",
          navTapHighlights: "Ketuk petak yang disorot.",
          navTapMine: "Ketuk petak mana pun yang tidak beririsan.",
          navTextDone: "Ketuk &raquo; untuk lanjut.",
          boxedTitle: "Petak aman:",
          boxedLabel: "Hasil menguntungkan<br>dari kejadian:",
          btnSelectTails: "Pilih Gambar",
          btnSelectOdds: "Pilih Bilangan<br>Ganjil",
          btnSelectOverlaps: "Pilih<br>Irisan",
          matchFeedback: "({outcome}) cocok dengan gambar dan bilangan ganjil.",
          mineFeedback: "({outcome}) tidak cocok dengan gambar dan bilangan ganjil.",
          allFound: "Semua petak aman ditemukan!",
          livesIntact: "Nyawamu<br>tetap utuh",
          lifeLost: "Nyawa berkurang<br>saat ranjau terkena",
          overlapHint: "Hanya petak yang beririsan yang menunjukkan hasil menguntungkan yang benar.",
        },
        4: {
          navText: "Ketuk untuk bermain!",
          heading: "Medan Ranjau Ruang Sampel – Ronde 2",
          playButton: "Main",
          playHint: "Ketuk untuk bermain!",
          tableCaption: "Semua petak aman atau berisi ranjau.",
          rightText:
            "Sekarang, sorotan baris dan kolom<br>tidak akan diberikan.<br><br>Baca kejadiannya, pikirkan<br>irisan baris dan kolom yang benar untuk<br><y>menemukan hasil yang menguntungkan.</y>",
        },
        5: {
          navText: "Ketuk petak dengan hasil yang diberikan.",
          boxedTitle: "Petak aman:",
          boxedLabel: "Hasil menguntungkan dari kejadian:",
          warningText: "Semua petak lainnya berisi ranjau!",
          gameOver: "PERMAINAN BERAKHIR!",
          allFound: "Semua petak aman ditemukan!",
          gameOverFound: "Kamu bisa menemukan {found} dari {total} hasil menguntungkan.",
        },
      },
      final: {
        heading: "Aktivitas Selesai!",
        text:
          "Kita belajar cara mengidentifikasi <y>hasil menguntungkan</y> untuk<br><y>kejadian dengan dua syarat</y> dalam tabel.<br>Hasil yang merupakan<br><y>irisan dari kedua syarat.</y>",
        buttonText: "Ulangi",
        hintText: "Ketuk \u2018Ulangi\u2019 untuk bermain lagi.",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;

const getExperiment = (index) => APP_DATA.experiments[index] || APP_DATA.experiments[0];
