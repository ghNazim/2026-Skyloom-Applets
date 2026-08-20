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
          introRevealed: [
            { row: 2, col: "H" },
            { row: 3, col: "T" },
            { row: 4, col: "T" },
          ],
          safeOutcomes: [
            { row: 1, col: "H" },
            { row: 6, col: "H" },
            { row: 5, col: "T" },
          ],
          step2Cell: { row: 2, col: "H" },
          step3Cell: { row: 4, col: "T" },
          navTextDone: "Tap &raquo; to see the second experiment.",
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
          introRevealed: [
            { row: 2, col: "T" },
            { row: 5, col: "H" },
          ],
          safeOutcomes: [
            { row: 3, col: "H" },
            { row: 4, col: "T" },
            { row: 1, col: "H" },
          ],
          navTextDone: "Tap &raquo; to see the third experiment.",
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
          introRevealed: [
            { row: 1, col: 2 },
            { row: 4, col: 2 },
            { row: 5, col: 4 },
          ],
          safeOutcomes: [
            { row: 3, col: 2 },
            { row: 2, col: 1 },
            { row: 4, col: 4 },
            { row: 4, col: 3 },
          ],
          navTextDone: "Tap &raquo; to see the fourth experiment.",
        },
        {
          visualTitle: "EXPERIMENT 4:<br><vt>Two dice.</vt>",
          table: {
            rowLabel: "Die 1",
            columnLabel: "Die 2",
            rowItems: [1, 2, 3, 4, 5, 6],
            columnItems: [1, 2, 3, 4, 5, 6],
          },
          cornerImages: {
            row: "assets/dice.png",
            col: "assets/dice.png",
          },
          introRevealed: [
            { row: 1, col: 2 },
            { row: 4, col: 2 },
            { row: 5, col: 4 },
          ],
          safeOutcomes: [
            { row: 3, col: 2 },
            { row: 2, col: 1 },
            { row: 4, col: 4 },
            { row: 4, col: 3 },
            { row: 6, col: 1 },
            { row: 5, col: 6 },
          ],
          navTextDone: "Tap &raquo; to conclude.",
        },
      ],
      steps: {
        1: {
          navText: "Tap &raquo; to see a safe patch.",
          rightText: "Look! The <y>table</y> has become a <y>minefield</y> and its <y>cells</y> have become <y>patches</y>.",
        },
        2: {
          navText: "Tap the highlighted patch.",
          navTextDone: "Tap &raquo; to see a patch with a mine.",
          boxedText: "Some patches are safe.",
          subText: "Tapping a safe patch<br>reveals the outcome.",
          livesIntact: "Your lives<br>remain intact",
        },
        3: {
          navText: "Tap the highlighted patch.",
          navTextDone: "Tap &raquo; to continue.",
          boxedText: "Some patches have mines.",
          subText: "Tapping a patch<br>with mine explodes it.",
          lifeLost: "You lose a life<br>when a mine is hit",
        },
        4: {
          navText: "Tap to play!",
          heading: "Time to Play the Game!",
          playButton: "Play",
          playHint: "Tap to play!",
          tableCaption: "Some patches will be revealed from before.",
          rightText: "The revealed patches indicate the <y>order of events</y> in the outcome &ndash; <y>(Die, Coin)</y>, not <y>(Coin, Die)</y><br><br>All other hidden patches are either safe or contain a mine.<br><br><y>Spot the given outcomes</y> to find the safe patches!",
        },
        5: {
          navText: "Tap the patches with the given outcomes.",
          boxedText: "Patches with these<br>outcomes are SAFE:",
          warningText: "All other patches have mines!",
          gameOver: "GAME OVER!",
          feedback: {
            foundOne: "1 safe patch found.<br>Find the others.",
            foundTwo: "2 safe patches found.<br>Find the others.",
            foundThree: "3 safe patches found.<br>Find the last one.",
            foundFour: "4 safe patches found.<br>Find the others.",
            foundFive: "5 safe patches found.<br>Find the last one.",
            foundAll: "Great job!<br>All safe patches found.",
            mine: "That patch had a mine!<br>Find the safe patches.",
            gameOverZero: "That patch had a mine!<br>You found 0 patches.",
            gameOverOne: "That patch had a mine!<br>You found 1 patch.",
            gameOverTwo: "That patch had a mine!<br>You found 2 patches.",
            gameOverThree: "That patch had a mine!<br>You found 3 patches.",
            gameOverFour: "That patch had a mine!<br>You found 4 patches.",
            gameOverFive: "That patch had a mine!<br>You found 5 patches.",
          },
        },
      },
      final: {
        heading: "Activity Completed!",
        text: "We learnt how to identify outcomes in a table.<br><br>All outcomes follow the same order &ndash; <y>(row, column)</y> or <y>(column, row)</y>",
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
          introRevealed: [
            { row: 2, col: "A" },
            { row: 3, col: "G" },
            { row: 4, col: "G" },
          ],
          safeOutcomes: [
            { row: 1, col: "A" },
            { row: 6, col: "A" },
            { row: 5, col: "G" },
          ],
          step2Cell: { row: 2, col: "A" },
          step3Cell: { row: 4, col: "G" },
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
          introRevealed: [
            { row: 2, col: "G" },
            { row: 5, col: "A" },
          ],
          safeOutcomes: [
            { row: 3, col: "A" },
            { row: 4, col: "G" },
            { row: 1, col: "A" },
          ],
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
          introRevealed: [
            { row: 1, col: 2 },
            { row: 4, col: 2 },
            { row: 5, col: 4 },
          ],
          safeOutcomes: [
            { row: 3, col: 2 },
            { row: 2, col: 1 },
            { row: 4, col: 4 },
            { row: 4, col: 3 },
          ],
          navTextDone: "Ketuk &raquo; untuk melihat percobaan keempat.",
        },
        {
          visualTitle: "PERCOBAAN 4:<br><vt>Dua dadu.</vt>",
          table: {
            rowLabel: "Dadu 1",
            columnLabel: "Dadu 2",
            rowItems: [1, 2, 3, 4, 5, 6],
            columnItems: [1, 2, 3, 4, 5, 6],
          },
          cornerImages: {
            row: "assets/dice.png",
            col: "assets/dice.png",
          },
          introRevealed: [
            { row: 1, col: 2 },
            { row: 4, col: 2 },
            { row: 5, col: 4 },
          ],
          safeOutcomes: [
            { row: 3, col: 2 },
            { row: 2, col: 1 },
            { row: 4, col: 4 },
            { row: 4, col: 3 },
            { row: 6, col: 1 },
            { row: 5, col: 6 },
          ],
          navTextDone: "Ketuk &raquo; untuk menyelesaikan.",
        },
      ],
      steps: {
        1: {
          navText: "Ketuk &raquo; untuk melihat petak yang aman.",
          rightText: "Lihat! <y>Tabel</y> telah menjadi <y>medan ranjau</y> dan <y>sel-selnya</y> telah menjadi <y>petak-petak</y>.",
        },
        2: {
          navText: "Ketuk petak yang disorot.",
          navTextDone: "Ketuk &raquo; untuk melihat petak yang berisi ranjau.",
          boxedText: "Beberapa petak aman.",
          subText: "Mengetuk petak aman<br>menampilkan hasilnya.",
          livesIntact: "Nyawamu<br>tetap utuh",
        },
        3: {
          navText: "Ketuk petak yang disorot.",
          navTextDone: "Ketuk &raquo; untuk lanjut.",
          boxedText: "Beberapa petak berisi ranjau.",
          subText: "Mengetuk petak berisi ranjau<br>akan meledakkannya.",
          lifeLost: "Nyawa berkurang<br>saat ranjau terkena",
        },
        4: {
          navText: "Ketuk untuk bermain!",
          heading: "Saatnya Bermain!",
          playButton: "Main",
          playHint: "Ketuk untuk bermain!",
          tableCaption: "Beberapa petak akan terbuka dari sebelumnya.",
          rightText: "Petak yang terbuka menunjukkan <y>urutan kejadian</y> pada hasil &ndash; <y>(Dadu, Koin)</y>, bukan <y>(Koin, Dadu)</y><br><br>Semua petak tersembunyi lainnya aman atau berisi ranjau.<br><br><y>Temukan hasil yang diberikan</y> untuk mencari petak aman!",
        },
        5: {
          navText: "Ketuk petak dengan hasil yang diberikan.",
          boxedText: "Petak dengan hasil<br>berikut AMAN:",
          warningText: "Semua petak lainnya berisi ranjau!",
          gameOver: "PERMAINAN BERAKHIR!",
          feedback: {
            foundOne: "1 petak aman ditemukan.<br>Temukan yang lain.",
            foundTwo: "2 petak aman ditemukan.<br>Temukan yang lain.",
            foundThree: "3 petak aman ditemukan.<br>Temukan yang terakhir.",
            foundFour: "4 petak aman ditemukan.<br>Temukan yang lain.",
            foundFive: "5 petak aman ditemukan.<br>Temukan yang terakhir.",
            foundAll: "Kerja bagus!<br>Semua petak aman ditemukan.",
            mine: "Petak itu berisi ranjau!<br>Temukan petak yang aman.",
            gameOverZero: "Petak itu berisi ranjau!<br>Kamu menemukan 0 petak.",
            gameOverOne: "Petak itu berisi ranjau!<br>Kamu menemukan 1 petak.",
            gameOverTwo: "Petak itu berisi ranjau!<br>Kamu menemukan 2 petak.",
            gameOverThree: "Petak itu berisi ranjau!<br>Kamu menemukan 3 petak.",
            gameOverFour: "Petak itu berisi ranjau!<br>Kamu menemukan 4 petak.",
            gameOverFive: "Petak itu berisi ranjau!<br>Kamu menemukan 5 petak.",
          },
        },
      },
      final: {
        heading: "Aktivitas Selesai!",
        text: "Kita belajar cara mengidentifikasi hasil dalam tabel.<br><br>Semua hasil mengikuti urutan yang sama &ndash; <y>(baris, kolom)</y> atau <y>(kolom, baris)</y>",
        buttonText: "Ulangi",
        hintText: "Ketuk \u2018Ulangi\u2019 untuk bermain lagi.",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;

const getExperiment = (index) => APP_DATA.experiments[index] || APP_DATA.experiments[0];
