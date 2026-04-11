const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      common: {
        tapNextToContinue: "Tap » to continue.",
        tapNumpadToFill:
          "Tap using numpad to fill in the highlighted box and Check.",
        tapNextToAddWeights: "Tap » to add the lengths.",
        tapNextToAddKg: "Tap » to add the length in m.",
        tapNextForAnother: "Tap » for another challenge.",
        tapNextToSummarise: "Tap » to summarise.",
        tapNextToSubtract: "Tap » to subtract the lengths.",
        tapNextToSubtractKg: "Tap » to subtract the length in m.",
      },
      start: {
        heading: "Word problems on length",
        text:
          'Let\'s explore solving word problems on length.<br><br>Tap "Start" to begin!',
        buttonText: "Start",
      },
      summary: {
        heading: "Length word problems",
        text:
          "Awesome! Now you know how to solve word problems on length with metres and centimetres.",
        buttonText: "Start Over",
      },
      steps: {
        1: {
          characterText:
            "Hi!\nI am Jammal.\nLet's explore solving some word problems related to length.",
          characterImage: "normal.png",
        },
        2: {
          characterText: "Let's read the word problem.",
        },
        3: {
          characterText:
            "Step 1: Write the lengths given in the word problem.",
        },
        4: {
          characterText:
            "Step 2: Choose the math action needed to solve the word problem.",
        },
      },
      mcqOptions: {
        add: "ADD",
        subtract: "SUBTRACT",
      },
      operatorQuestion:
        "Should we <y>add</y> or <y>subtract</y> the lengths?\nCheck for words in the word problem that indicate addition or subtraction.",
      oops: "Oops!",
      tryAgain: "Try again.",
      wellDone: "Well done!",
      questions: [
        {
          statement:
            "A ladder is 9,500 cm long. Another 2 m is added. What is the total length in cm?",
          itemName1: "Ladder length",
          itemName2: "Length added",
          kgLabel: "m",
          gmLabel: "cm",
          kgAns1: 95,
          gmAns1: 0,
          kgAns2: 2,
          gmAns2: 0,
          kgResult: 97,
          gmResult: 0,
          operation: "add",
          hintWord: "total",
          step3CharacterText:
            "Observe that both lengths are in different units\n9,500 cm and 2 m!\nLet's convert both lengths to metres and centimetres.",
          step3WrongFeedbackRow1:
            "Oops!\nTry again.\nConvert 9,500 cm into metres and centimetres.",
          step3WrongFeedbackRow2:
            "Oops!\nTry again.\nWrite 2 m into metres and centimetres.",
          step3CorrectFeedback:
            "Well done!\nYou have correctly identified the lengths given in the question.",
          step4WrongFeedback:
            "Oops!\nRead the question again. Check for words that indicate the math action.",
          step4CorrectFeedback:
            "Well done!\nThe word 'total' in the word problem shows that the lengths should be added.",
          step5CharacterText:
            "Step 3: Add the lengths.\n\nLet's add the centimetres first.",
          step5WrongFeedback:
            "Oops!\nTry again.\n\nAdd 0 cm and 0 cm to get the total centimetres.",
          step5CorrectFeedback: "Well done!\n0 cm + 0 cm\n= 0 cm.",
          step5CtAfterGm:
            "Step 3: Add the lengths.\n0 cm + 0 cm\n= 0 cm.\n\nLet's add the metres.",
          step6WrongFeedback:
            "Oops!\nTry again.\n\nAdd 95 m and 2 m to get the total length in metres.",
          step6CorrectFeedback:
            "Well done!\nThe total length is\n97 m.",
          step6FinalCt:
            "Well Done!\nThe total length is 97 m.\n\nLet's try another question.",
          step6FinalCtLast: "Well Done!\nThe total length is 97 m.",
          resultLabel: "Total",
        },
        {
          statement:
            "A tape is 10 m long. Another 600 cm is added. What is the total length in meters?",
          itemName1: "Tape length",
          itemName2: "Length added",
          kgLabel: "m",
          gmLabel: "cm",
          kgAns1: 10,
          gmAns1: 0,
          kgAns2: 6,
          gmAns2: 0,
          kgResult: 16,
          gmResult: 0,
          operation: "add",
          hintWord: "total",
          step3CharacterText:
            "Observe that both lengths are in different units\n10 m and 600 cm!\nLet's convert both lengths to metres and centimetres.",
          step3WrongFeedbackRow1:
            "Oops!\nTry again.\nWrite 10 m into metres and centimetres.",
          step3WrongFeedbackRow2:
            "Oops!\nTry again.\nConvert 600 cm into metres and centimetres.",
          step3CorrectFeedback:
            "Well done!\nYou have correctly identified the lengths given in the question.",
          step4WrongFeedback:
            "Oops!\nRead the question again. Check for words that indicate the math action.",
          step4CorrectFeedback:
            "Well done!\nThe word 'total' in the word problem shows that the lengths should be added.",
          step5CharacterText:
            "Step 3: Add the lengths.\n\nLet's add the centimetres first.",
          step5WrongFeedback:
            "Oops!\nTry again.\n\nAdd 0 cm and 0 cm to get the total centimetres.",
          step5CorrectFeedback: "Well done!\n0 cm + 0 cm\n= 0 cm.",
          step5CtAfterGm:
            "Step 3: Add the lengths.\n0 cm + 0 cm\n= 0 cm.\n\nLet's add the metres.",
          step6WrongFeedback:
            "Oops!\nTry again.\n\nAdd 10 m and 6 m to get the total length in metres.",
          step6CorrectFeedback:
            "Well done!\nThe total length is\n16 m.",
          step6FinalCt:
            "Well Done!\nThe total length is 16 m.\n\nLet's try another question.",
          step6FinalCtLast: "Well Done!\nThe total length is 16 m.",
          resultLabel: "Total",
        },
        {
          statement:
            "A bridge is 2,200 cm long. Another 3 m is constructed. What is the total length in cm?",
          itemName1: "Bridge length",
          itemName2: "Length constructed",
          kgLabel: "m",
          gmLabel: "cm",
          kgAns1: 22,
          gmAns1: 0,
          kgAns2: 3,
          gmAns2: 0,
          kgResult: 25,
          gmResult: 0,
          operation: "add",
          hintWord: "total",
          step3CharacterText:
            "Observe that both lengths are in different units\n2,200 cm and 3 m!\nLet's convert both lengths to metres and centimetres.",
          step3WrongFeedbackRow1:
            "Oops!\nTry again.\nConvert 2,200 cm into metres and centimetres.",
          step3WrongFeedbackRow2:
            "Oops!\nTry again.\nWrite 3 m into metres and centimetres.",
          step3CorrectFeedback:
            "Well done!\nYou have correctly identified the lengths given in the question.",
          step4WrongFeedback:
            "Oops!\nRead the question again. Check for words that indicate the math action.",
          step4CorrectFeedback:
            "Well done!\nThe word 'total' in the word problem shows that the lengths should be added.",
          step5CharacterText:
            "Step 3: Add the lengths.\n\nLet's add the centimetres first.",
          step5WrongFeedback:
            "Oops!\nTry again.\n\nAdd 0 cm and 0 cm to get the total centimetres.",
          step5CorrectFeedback: "Well done!\n0 cm + 0 cm\n= 0 cm.",
          step5CtAfterGm:
            "Step 3: Add the lengths.\n0 cm + 0 cm\n= 0 cm.\n\nLet's add the metres.",
          step6WrongFeedback:
            "Oops!\nTry again.\n\nAdd 22 m and 3 m to get the total length in metres.",
          step6CorrectFeedback:
            "Well done!\nThe total length is\n25 m.",
          step6FinalCt:
            "Well Done!\nThe total length is 25 m.\n\nLet's try another question.",
          step6FinalCtLast: "Well Done!\nThe total length is 25 m.",
          resultLabel: "Total",
        },
        {
          statement:
            "A stick is 9 m long. 450 cm is broken. What is the remaining length?",
          itemName1: "Stick length",
          itemName2: "Length broken",
          kgLabel: "m",
          gmLabel: "cm",
          kgAns1: 9,
          gmAns1: 0,
          kgAns2: 4,
          gmAns2: 50,
          kgResult: 4,
          gmResult: 50,
          operation: "subtract",
          hintWord: "remaining",
          step3CharacterText:
            "Observe that both lengths are in different units\n9 m and 450 cm!\nLet's convert both lengths to metres and centimetres.",
          step3WrongFeedbackRow1:
            "Oops!\nTry again.\nWrite 9 m into metres and centimetres.",
          step3WrongFeedbackRow2:
            "Oops!\nTry again.\nConvert 450 cm into metres and centimetres.",
          step3CorrectFeedback:
            "Well done!\nYou have correctly identified the lengths given in the question.",
          step4WrongFeedback:
            "Oops!\nRead the question again. Check for words that indicate the math action.",
          step4CorrectFeedback:
            "Well done!\nThe word 'remaining' shows that the lengths should be subtracted.",
          step5CharacterText:
            "Step 3: Subtract the lengths.\n\nBorrow 1 m as 100 cm, then subtract the centimetres.",
          step5WrongFeedback:
            "Oops!\nTry again.\n\n100 cm − 50 cm = 50 cm.",
          step5CorrectFeedback: "Well done!\n100 cm − 50 cm\n= 50 cm.",
          step5CtAfterGm:
            "Step 3: Subtract the lengths.\n100 cm − 50 cm\n= 50 cm.\n\nNow subtract the metres (remember the borrow).",
          step6WrongFeedback:
            "Oops!\nTry again.\n\nAfter borrowing, subtract 4 m from 8 m.",
          step6CorrectFeedback:
            "Well done!\nThe remaining length is\n4 m 50 cm.",
          step6FinalCt:
            "Well Done!\nThe remaining length is 4 m 50 cm.\n\nLet's try another question.",
          step6FinalCtLast: "Well Done!\nThe remaining length is 4 m 50 cm.",
          resultLabel: "Remaining",
        },
        {
          statement:
            "A cloth piece is 10 m long. 325 cm is cut. What is the remaining length?",
          itemName1: "Cloth length",
          itemName2: "Length cut",
          kgLabel: "m",
          gmLabel: "cm",
          kgAns1: 10,
          gmAns1: 0,
          kgAns2: 3,
          gmAns2: 25,
          kgResult: 6,
          gmResult: 75,
          operation: "subtract",
          hintWord: "remaining",
          step3CharacterText:
            "Observe that both lengths are in different units\n10 m and 325 cm!\nLet's convert both lengths to metres and centimetres.",
          step3WrongFeedbackRow1:
            "Oops!\nTry again.\nWrite 10 m into metres and centimetres.",
          step3WrongFeedbackRow2:
            "Oops!\nTry again.\nConvert 325 cm into metres and centimetres.",
          step3CorrectFeedback:
            "Well done!\nYou have correctly identified the lengths given in the question.",
          step4WrongFeedback:
            "Oops!\nRead the question again. Check for words that indicate the math action.",
          step4CorrectFeedback:
            "Well done!\nThe word 'remaining' shows that the lengths should be subtracted.",
          step5CharacterText:
            "Step 3: Subtract the lengths.\n\nBorrow 1 m as 100 cm, then subtract the centimetres.",
          step5WrongFeedback:
            "Oops!\nTry again.\n\n100 cm − 25 cm = 75 cm.",
          step5CorrectFeedback: "Well done!\n100 cm − 25 cm\n= 75 cm.",
          step5CtAfterGm:
            "Step 3: Subtract the lengths.\n100 cm − 25 cm\n= 75 cm.\n\nNow subtract the metres (remember the borrow).",
          step6WrongFeedback:
            "Oops!\nTry again.\n\nAfter borrowing, subtract 3 m from 9 m.",
          step6CorrectFeedback:
            "Well done!\nThe remaining length is\n6 m 75 cm.",
          step6FinalCt:
            "Well Done!\nThe remaining length is 6 m 75 cm.\n\nLet's try another question.",
          step6FinalCtLast: "Well Done!\nThe remaining length is 6 m 75 cm.",
          resultLabel: "Remaining",
        },
      ],
    },
  },
  id: {
    app: {
      common: {
        tapNextToContinue: "Ketuk » untuk melanjutkan.",
        tapNumpadToFill:
          "Ketuk numpad untuk mengisi kotak yang disorot dan Periksa.",
        tapNextToAddWeights: "Ketuk » untuk menambahkan panjang.",
        tapNextToAddKg: "Ketuk » untuk menambahkan panjang dalam m.",
        tapNextForAnother: "Ketuk » untuk tantangan lain.",
        tapNextToSummarise: "Ketuk » untuk merangkum.",
        tapNextToSubtract: "Ketuk » untuk mengurangi panjang.",
        tapNextToSubtractKg: "Ketuk » untuk mengurangi panjang dalam m.",
      },
      start: {
        heading: "Soal cerita tentang panjang",
        text:
          'Mari kita pelajari soal cerita tentang panjang.<br><br>Ketuk "Mulai" untuk memulai!',
        buttonText: "Mulai",
      },
      summary: {
        heading: "Soal cerita panjang",
        text:
          "Luar biasa! Sekarang kamu tahu cara menyelesaikan soal cerita panjang dengan meter dan sentimeter.",
        buttonText: "Ulangi",
      },
      steps: {
        1: {
          characterText:
            "Hai!\nSaya Jammal.\nMari kita pelajari beberapa soal cerita tentang panjang.",
          characterImage: "normal.png",
        },
        2: {
          characterText: "Mari kita baca soal ceritanya.",
        },
        3: {
          characterText:
            "Langkah 1: Tuliskan panjang yang diberikan dalam soal cerita.",
        },
        4: {
          characterText:
            "Langkah 2: Pilih operasi matematika yang diperlukan untuk menyelesaikan soal cerita.",
        },
      },
      mcqOptions: {
        add: "TAMBAH",
        subtract: "KURANG",
      },
      operatorQuestion:
        "Haruskah kita <y>menambah</y> atau <y>mengurangi</y> panjang?\nPeriksa kata-kata dalam soal cerita yang menunjukkan penjumlahan atau pengurangan.",
      oops: "Ups!",
      tryAgain: "Coba lagi.",
      wellDone: "Bagus!",
      questions: [
        {
          statement:
            "Sebuah tangga panjangnya 9.500 cm. Ditambah 2 m lagi. Berapa total panjangnya dalam cm?",
          itemName1: "Panjang tangga",
          itemName2: "Panjang yang ditambah",
          kgLabel: "m",
          gmLabel: "cm",
          kgAns1: 95,
          gmAns1: 0,
          kgAns2: 2,
          gmAns2: 0,
          kgResult: 97,
          gmResult: 0,
          operation: "add",
          hintWord: "total",
          step3CharacterText:
            "Perhatikan kedua panjang memakai satuan berbeda\n9.500 cm dan 2 m!\nMari ubah keduanya ke meter dan sentimeter.",
          step3WrongFeedbackRow1:
            "Ups!\nCoba lagi.\nUbah 9.500 cm menjadi meter dan sentimeter.",
          step3WrongFeedbackRow2:
            "Ups!\nCoba lagi.\nTuliskan 2 m dalam meter dan sentimeter.",
          step3CorrectFeedback:
            "Bagus!\nKamu telah mengidentifikasi panjang dalam soal dengan benar.",
          step4WrongFeedback:
            "Ups!\nBaca soalnya lagi. Periksa kata-kata yang menunjukkan operasi matematika.",
          step4CorrectFeedback:
            "Bagus!\nKata 'total' dalam soal menunjukkan bahwa panjang harus ditambahkan.",
          step5CharacterText:
            "Langkah 3: Tambahkan panjang.\n\nMari tambahkan sentimeter terlebih dahulu.",
          step5WrongFeedback:
            "Ups!\nCoba lagi.\n\nTambahkan 0 cm dan 0 cm untuk mendapatkan total sentimeter.",
          step5CorrectFeedback: "Bagus!\n0 cm + 0 cm\n= 0 cm.",
          step5CtAfterGm:
            "Langkah 3: Tambahkan panjang.\n0 cm + 0 cm\n= 0 cm.\n\nMari tambahkan meternya.",
          step6WrongFeedback:
            "Ups!\nCoba lagi.\n\nTambahkan 95 m dan 2 m untuk mendapatkan total panjang dalam meter.",
          step6CorrectFeedback:
            "Bagus!\nTotal panjangnya adalah\n97 m.",
          step6FinalCt:
            "Bagus Sekali!\nTotal panjangnya adalah 97 m.\n\nMari coba soal lain.",
          step6FinalCtLast:
            "Bagus Sekali!\nTotal panjangnya adalah 97 m.",
          resultLabel: "Total",
        },
        {
          statement:
            "Sebuah pita panjangnya 10 m. Ditambah 600 cm lagi. Berapa total panjangnya dalam meter?",
          itemName1: "Panjang pita",
          itemName2: "Panjang yang ditambah",
          kgLabel: "m",
          gmLabel: "cm",
          kgAns1: 10,
          gmAns1: 0,
          kgAns2: 6,
          gmAns2: 0,
          kgResult: 16,
          gmResult: 0,
          operation: "add",
          hintWord: "total",
          step3CharacterText:
            "Perhatikan kedua panjang memakai satuan berbeda\n10 m dan 600 cm!\nMari ubah keduanya ke meter dan sentimeter.",
          step3WrongFeedbackRow1:
            "Ups!\nCoba lagi.\nTuliskan 10 m dalam meter dan sentimeter.",
          step3WrongFeedbackRow2:
            "Ups!\nCoba lagi.\nUbah 600 cm menjadi meter dan sentimeter.",
          step3CorrectFeedback:
            "Bagus!\nKamu telah mengidentifikasi panjang dalam soal dengan benar.",
          step4WrongFeedback:
            "Ups!\nBaca soalnya lagi. Periksa kata-kata yang menunjukkan operasi matematika.",
          step4CorrectFeedback:
            "Bagus!\nKata 'total' dalam soal menunjukkan bahwa panjang harus ditambahkan.",
          step5CharacterText:
            "Langkah 3: Tambahkan panjang.\n\nMari tambahkan sentimeter terlebih dahulu.",
          step5WrongFeedback:
            "Ups!\nCoba lagi.\n\nTambahkan 0 cm dan 0 cm untuk mendapatkan total sentimeter.",
          step5CorrectFeedback: "Bagus!\n0 cm + 0 cm\n= 0 cm.",
          step5CtAfterGm:
            "Langkah 3: Tambahkan panjang.\n0 cm + 0 cm\n= 0 cm.\n\nMari tambahkan meternya.",
          step6WrongFeedback:
            "Ups!\nCoba lagi.\n\nTambahkan 10 m dan 6 m untuk mendapatkan total panjang dalam meter.",
          step6CorrectFeedback:
            "Bagus!\nTotal panjangnya adalah\n16 m.",
          step6FinalCt:
            "Bagus Sekali!\nTotal panjangnya adalah 16 m.\n\nMari coba soal lain.",
          step6FinalCtLast: "Bagus Sekali!\nTotal panjangnya adalah 16 m.",
          resultLabel: "Total",
        },
        {
          statement:
            "Sebuah jembatan panjangnya 2.200 cm. Ditambah pembangunan 3 m. Berapa total panjangnya dalam cm?",
          itemName1: "Panjang jembatan",
          itemName2: "Panjang yang dibangun",
          kgLabel: "m",
          gmLabel: "cm",
          kgAns1: 22,
          gmAns1: 0,
          kgAns2: 3,
          gmAns2: 0,
          kgResult: 25,
          gmResult: 0,
          operation: "add",
          hintWord: "total",
          step3CharacterText:
            "Perhatikan kedua panjang memakai satuan berbeda\n2.200 cm dan 3 m!\nMari ubah keduanya ke meter dan sentimeter.",
          step3WrongFeedbackRow1:
            "Ups!\nCoba lagi.\nUbah 2.200 cm menjadi meter dan sentimeter.",
          step3WrongFeedbackRow2:
            "Ups!\nCoba lagi.\nTuliskan 3 m dalam meter dan sentimeter.",
          step3CorrectFeedback:
            "Bagus!\nKamu telah mengidentifikasi panjang dalam soal dengan benar.",
          step4WrongFeedback:
            "Ups!\nBaca soalnya lagi. Periksa kata-kata yang menunjukkan operasi matematika.",
          step4CorrectFeedback:
            "Bagus!\nKata 'total' dalam soal menunjukkan bahwa panjang harus ditambahkan.",
          step5CharacterText:
            "Langkah 3: Tambahkan panjang.\n\nMari tambahkan sentimeter terlebih dahulu.",
          step5WrongFeedback:
            "Ups!\nCoba lagi.\n\nTambahkan 0 cm dan 0 cm untuk mendapatkan total sentimeter.",
          step5CorrectFeedback: "Bagus!\n0 cm + 0 cm\n= 0 cm.",
          step5CtAfterGm:
            "Langkah 3: Tambahkan panjang.\n0 cm + 0 cm\n= 0 cm.\n\nMari tambahkan meternya.",
          step6WrongFeedback:
            "Ups!\nCoba lagi.\n\nTambahkan 22 m dan 3 m untuk mendapatkan total panjang dalam meter.",
          step6CorrectFeedback:
            "Bagus!\nTotal panjangnya adalah\n25 m.",
          step6FinalCt:
            "Bagus Sekali!\nTotal panjangnya adalah 25 m.\n\nMari coba soal lain.",
          step6FinalCtLast:
            "Bagus Sekali!\nTotal panjangnya adalah 25 m.",
          resultLabel: "Total",
        },
        {
          statement:
            "Sebuah tongkat panjangnya 9 m. 450 cm patah. Berapa sisa panjangnya?",
          itemName1: "Panjang tongkat",
          itemName2: "Panjang yang patah",
          kgLabel: "m",
          gmLabel: "cm",
          kgAns1: 9,
          gmAns1: 0,
          kgAns2: 4,
          gmAns2: 50,
          kgResult: 4,
          gmResult: 50,
          operation: "subtract",
          hintWord: "sisa",
          step3CharacterText:
            "Perhatikan kedua panjang memakai satuan berbeda\n9 m dan 450 cm!\nMari ubah keduanya ke meter dan sentimeter.",
          step3WrongFeedbackRow1:
            "Ups!\nCoba lagi.\nTuliskan 9 m dalam meter dan sentimeter.",
          step3WrongFeedbackRow2:
            "Ups!\nCoba lagi.\nUbah 450 cm menjadi meter dan sentimeter.",
          step3CorrectFeedback:
            "Bagus!\nKamu telah mengidentifikasi panjang dalam soal dengan benar.",
          step4WrongFeedback:
            "Ups!\nBaca soalnya lagi. Periksa kata-kata yang menunjukkan operasi matematika.",
          step4CorrectFeedback:
            "Bagus!\nKata 'sisa' menunjukkan bahwa panjang harus dikurangkan.",
          step5CharacterText:
            "Langkah 3: Kurangi panjang.\n\nPinjam 1 m menjadi 100 cm, lalu kurangkan sentimeternya.",
          step5WrongFeedback:
            "Ups!\nCoba lagi.\n\n100 cm − 50 cm = 50 cm.",
          step5CorrectFeedback: "Bagus!\n100 cm − 50 cm\n= 50 cm.",
          step5CtAfterGm:
            "Langkah 3: Kurangi panjang.\n100 cm − 50 cm\n= 50 cm.\n\nSekarang kurangkan meternya (ingat pinjaman).",
          step6WrongFeedback:
            "Ups!\nCoba lagi.\n\nSetelah meminjam, kurangkan 4 m dari 8 m.",
          step6CorrectFeedback:
            "Bagus!\nSisa panjangnya adalah\n4 m 50 cm.",
          step6FinalCt:
            "Bagus Sekali!\nSisa panjangnya adalah 4 m 50 cm.\n\nMari coba soal lain.",
          step6FinalCtLast:
            "Bagus Sekali!\nSisa panjangnya adalah 4 m 50 cm.",
          resultLabel: "Sisa",
        },
        {
          statement:
            "Sebuah kain panjangnya 10 m. 325 cm dipotong. Berapa sisa panjangnya?",
          itemName1: "Panjang kain",
          itemName2: "Panjang yang dipotong",
          kgLabel: "m",
          gmLabel: "cm",
          kgAns1: 10,
          gmAns1: 0,
          kgAns2: 3,
          gmAns2: 25,
          kgResult: 6,
          gmResult: 75,
          operation: "subtract",
          hintWord: "sisa",
          step3CharacterText:
            "Perhatikan kedua panjang memakai satuan berbeda\n10 m dan 325 cm!\nMari ubah keduanya ke meter dan sentimeter.",
          step3WrongFeedbackRow1:
            "Ups!\nCoba lagi.\nTuliskan 10 m dalam meter dan sentimeter.",
          step3WrongFeedbackRow2:
            "Ups!\nCoba lagi.\nUbah 325 cm menjadi meter dan sentimeter.",
          step3CorrectFeedback:
            "Bagus!\nKamu telah mengidentifikasi panjang dalam soal dengan benar.",
          step4WrongFeedback:
            "Ups!\nBaca soalnya lagi. Periksa kata-kata yang menunjukkan operasi matematika.",
          step4CorrectFeedback:
            "Bagus!\nKata 'sisa' menunjukkan bahwa panjang harus dikurangkan.",
          step5CharacterText:
            "Langkah 3: Kurangi panjang.\n\nPinjam 1 m menjadi 100 cm, lalu kurangkan sentimeternya.",
          step5WrongFeedback:
            "Ups!\nCoba lagi.\n\n100 cm − 25 cm = 75 cm.",
          step5CorrectFeedback: "Bagus!\n100 cm − 25 cm\n= 75 cm.",
          step5CtAfterGm:
            "Langkah 3: Kurangi panjang.\n100 cm − 25 cm\n= 75 cm.\n\nSekarang kurangkan meternya (ingat pinjaman).",
          step6WrongFeedback:
            "Ups!\nCoba lagi.\n\nSetelah meminjam, kurangkan 3 m dari 9 m.",
          step6CorrectFeedback:
            "Bagus!\nSisa panjangnya adalah\n6 m 75 cm.",
          step6FinalCt:
            "Bagus Sekali!\nSisa panjangnya adalah 6 m 75 cm.\n\nMari coba soal lain.",
          step6FinalCtLast:
            "Bagus Sekali!\nSisa panjangnya adalah 6 m 75 cm.",
          resultLabel: "Sisa",
        },
      ],
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
