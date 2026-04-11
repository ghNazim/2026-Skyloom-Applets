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
        tapNextToAddWeights: "Tap » to add the weights.",
        tapNextToAddKg: "Tap » to add weight in kg.",
        tapNextForAnother: "Tap » for another challenge.",
        tapNextToSummarise: "Tap » to summarise.",
        tapNextToSubtract: "Tap » to subtract the weights.",
        tapNextToSubtractKg: "Tap » to subtract weight in kg.",
      },
      start: {
        heading: "Word problems on weights",
        text: 'Let\'s explore solving word problems on weights.<br><br>Tap "Start" to begin!',
        buttonText: "Start",
      },
      summary: {
        heading: "Adding Weights",
        text: "Awesome! Now you know how to solve word problems on weight.",
        buttonText: "Start Over",
      },
      steps: {
        1: {
          characterText:
            "Hi!\nI am Jammal.\nLet's explore solving some word problems related to weights.",
          characterImage: "normal.png",
        },
        2: {
          characterText: "Let's read the word problem.",
        },
        3: {
          characterText: "Step 1: Write the weights given in the word problem.",
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
        "Should we <y>add</y> or <y>subtract</y> the weights?\nCheck for words in the word problem that indicate addition or subtraction.",
      oops: "Oops!",
      tryAgain: "Try again.",
      wellDone: "Well done!",
      questions: [
        {
          statement:
            "Rina bought 3 kg of rice. She already had 2,000 grams at home. How much rice does she have in total?",
          itemName1: "Rice Rina bought",
          itemName2: "Rice she already had at home",
          kgLabel: "kg",
          gmLabel: "gram",
          kgAns1: 3,
          gmAns1: 0,
          kgAns2: 2,
          gmAns2: 0,
          kgResult: 5,
          gmResult: 0,
          operation: "add",
          hintWord: "total",
          step3CharacterText:
            "Observe that both weights are in different units\n3 kg and 2000 gram!\nLet's convert both weights as kg and gram.",
          step3WrongFeedbackRow1:
            "Oops!\nTry again.\nConvert 3 kg into kg and gram.",
          step3WrongFeedbackRow2:
            "Oops!\nTry again.\nConvert 2000 g into kg and gram.",
          step3CorrectFeedback:
            "Well done!\nYou have correctly identified weights given in the question.",
          step4WrongFeedback:
            "Oops!\nRead the question again. Check for words that indicate the math action.",
          step4CorrectFeedback:
            "Well done!\nWord 'total' in the word problem indicated that weights should be added.",
          step5CharacterText:
            "Step 3: Add the weights.\n\nLet's add the gram first.",
          step5WrongFeedback:
            "Oops!\nTry again.\n\nAdd 0 and 0 to get the total weight in gram.",
          step5CorrectFeedback: "Well done!\n0 g + 0 g\n= 0 g.",
          step5CtAfterGm:
            "Step 3: Add the weights.\n0 g + 0 g\n= 0 g.\n\nLet's add the weight in kg.",
          step6WrongFeedback:
            "Oops!\nTry again.\n\nAdd 3 kg and 2 kg to get the total weight in kg.",
          step6CorrectFeedback:
            "Well done!\nShe has\n5 kg 0 g\nof rice in total.",
          step6FinalCt:
            "Well Done!\nRina has 5 kg of rice in total.\n\nLet's try another question.",
          step6FinalCtLast: "Well Done!\nRina has 5 kg of rice in total.",
          resultLabel: "Total",
        },
        {
          statement:
            "A fruit seller has 5,000 grams of oranges. He sold 3 kg of oranges. How many grams of oranges are left?",
          itemName1: "Oranges the seller had",
          itemName2: "Oranges sold",
          kgLabel: "kg",
          gmLabel: "gram",
          kgAns1: 5,
          gmAns1: 0,
          kgAns2: 3,
          gmAns2: 0,
          kgResult: 2,
          gmResult: 0,
          operation: "subtract",
          hintWord: "left",
          step3CharacterText:
            "Observe that both weights are in different units\n5000 grams and 3 kg!\nLet's convert both weights as kg and gram.",
          step3WrongFeedbackRow1:
            "Oops!\nTry again.\nConvert 5,000 g into kg and gram.",
          step3WrongFeedbackRow2:
            "Oops!\nTry again.\nConvert 3 kg into kg and gram.",
          step3CorrectFeedback:
            "Well done!\nYou have correctly identified weights given in the question.",
          step4WrongFeedback:
            "Oops!\nRead the question again. Check for words that indicate the math action.",
          step4CorrectFeedback:
            "Well done!\nWord 'left' in the word problem indicated that weights should be subtracted.",
          step5CharacterText:
            "Step 3: Subtract the weights.\n\nLet's subtract the gram first.",
          step5WrongFeedback:
            "Oops!\nTry again.\n\nSubtract 0 from 0 to get the remaining weight in gram.",
          step5CorrectFeedback: "Well done!\n0 g - 0 g\n= 0 g.",
          step5CtAfterGm:
            "Step 3: Subtract the weights.\n0 g - 0 g\n= 0 g.\n\nLet's subtract the weight in kg.",
          step6WrongFeedback:
            "Oops!\nTry again.\n\nSubtract 3 kg from 5 kg to get the remaining weight in kg.",
          step6CorrectFeedback:
            "Well done!\nOranges left are\n2 kg 0 g\n(2000 g).",
          step6FinalCt:
            "Well Done!\nThere are 2000 g of oranges left.\n\nLet's try another question.",
          step6FinalCtLast: "Well Done!\nThere are 2000 g of oranges left.",
          resultLabel: "Remaining",
        },
        {
          statement:
            "Siti bought 1 kg of cheese and 1450 grams more. What is the total weight of cheese?",
          itemName1: "1 kg of cheese",
          itemName2: "1450 grams more",
          kgLabel: "kg",
          gmLabel: "gram",
          kgAns1: 1,
          gmAns1: 0,
          kgAns2: 1,
          gmAns2: 450,
          kgResult: 2,
          gmResult: 450,
          operation: "add",
          hintWord: "total",
          step3CharacterText:
            "Observe that both weights are in different units\n1 kg and 1450 grams!\nLet's convert both weights as kg and gram.",
          step3WrongFeedbackRow1:
            "Oops!\nTry again.\nConvert 1 kg into kg and gram.",
          step3WrongFeedbackRow2:
            "Oops!\nTry again.\nConvert 1450 g into kg and gram.",
          step3CorrectFeedback:
            "Well done!\nYou have correctly identified weights given in the question.",
          step4WrongFeedback:
            "Oops!\nRead the question again. Check for words that indicate the math action.",
          step4CorrectFeedback:
            "Well done!\nWord 'total' in the word problem indicated that weights should be added.",
          step5CharacterText:
            "Step 3: Add the weights.\n\nLet's add the gram first.",
          step5WrongFeedback:
            "Oops!\nTry again.\n\nAdd 0 and 450 to get the total weight in gram.",
          step5CorrectFeedback: "Well done!\n0 g + 450 g\n= 450 g.",
          step5CtAfterGm:
            "Step 3: Add the weights.\n0 g + 450 g\n= 450 g.\n\nLet's add the weight in kg.",
          step6WrongFeedback:
            "Oops!\nTry again.\n\nAdd 1 kg and 1 kg to get the total weight in kg.",
          step6CorrectFeedback:
            "Well done!\nTotal weight of cheese is\n2 kg 450 g.",
          step6FinalCt:
            "Well Done!\nThe total weight of cheese is 2 kg 450 g.\n\nLet's try another question.",
          step6FinalCtLast:
            "Well Done!\nThe total weight of cheese is 2 kg 450 g.",
          resultLabel: "Total",
        },

        {
          statement:
            "A sack contains 10400 g of rice. 3 kg were used. How much rice is left?",
          itemName1: "Rice in the sack",
          itemName2: "Rice used",
          kgLabel: "kg",
          gmLabel: "gram",
          kgAns1: 10,
          gmAns1: 400,
          kgAns2: 3,
          gmAns2: 0,
          kgResult: 7,
          gmResult: 400,
          operation: "subtract",
          hintWord: "left",
          step3CharacterText:
            "Observe that both weights are in different units\n10400 g and 3 kg!\nLet's convert both weights as kg and gram.",
          step3WrongFeedbackRow1:
            "Oops!\nTry again.\nConvert 10400 g into kg and gram.",
          step3WrongFeedbackRow2:
            "Oops!\nTry again.\nConvert 3 kg into kg and gram.",
          step3CorrectFeedback:
            "Well done!\nYou have correctly identified weights given in the question.",
          step4WrongFeedback:
            "Oops!\nRead the question again. Check for words that indicate the math action.",
          step4CorrectFeedback:
            "Well done!\nWord 'left' in the word problem indicated that weights should be subtracted.",
          step5CharacterText:
            "Step 3: Subtract the weights.\n\nLet's subtract the gram first.",
          step5WrongFeedback:
            "Oops!\nTry again.\n\nSubtract 0 from 400 to get the remaining weight in gram.",
          step5CorrectFeedback: "Well done!\n400 g - 0 g\n= 400 g.",
          step5CtAfterGm:
            "Step 3: Subtract the weights.\n400 g - 0 g\n= 400 g.\n\nLet's subtract the weight in kg.",

          step6WrongFeedback:
            "Oops!\nTry again.\n\nSubtract 3 kg from 10 kg to get the remaining weight in kg.",
          step6CorrectFeedback: "Well done!\nRice left is\n7 kg 400 g.",
          step6FinalCt:
            "Well Done!\nThe rice left in the sack is 7 kg 400 g.\n\nLet's try another question.",
          step6FinalCtLast:
            "Well Done!\nThe rice left in the sack is 7 kg 400 g.",
          resultLabel: "Remaining",
        },
        {
          statement:
            "Ali collected 2 kg 500 g of potatoes on Monday and 1500 grams on Tuesday. What is the total weight of potatoes?",
          itemName1: "Potatoes collected on Monday",
          itemName2: "Potatoes collected on Tuesday",
          kgLabel: "kg",
          gmLabel: "gram",
          kgAns1: 2,
          gmAns1: 500,
          kgAns2: 1,
          gmAns2: 500,
          gmInterim: 1000,
          kgResult: 4,
          gmResult: 0,
          operation: "add",
          hintWord: "total",
          step3CharacterText:
            "Observe that both weights are in different units\n2 kg 500 g and 1500 grams!\nLet's convert both weights as kg and gram.",
          step3WrongFeedbackRow1:
            "Oops!\nTry again.\nConvert Monday's amount into kg and gram.",
          step3WrongFeedbackRow2:
            "Oops!\nTry again.\nConvert 1500 g into kg and gram.",
          step3CorrectFeedback:
            "Well done!\nYou have correctly identified weights given in the question.",
          step4WrongFeedback:
            "Oops!\nRead the question again. Check for words that indicate the math action.",
          step4CorrectFeedback:
            "Well done!\nWord 'total' in the word problem indicated that weights should be added.",
          step5CharacterText:
            "Step 3: Add the weights.\n\nLet's add the gram first.",
          step5WrongFeedback:
            "Oops!\nTry again.\n\nAdd 500 and 500 to get the total weight in gram.",
          step5CorrectFeedback: "Well done!\n500 g + 500 g\n= 1000 g.",
          step5CtAfterGm:
            "Step 3: Add the weights.\n500 g + 500 g\n= 1000 g.\n\nLet's add the weight in kg.",
          step6WrongFeedback:
            "Oops!\nTry again.\n\nAdd 2 kg, 1 kg, and 1 kg more from 1000 g to get the total weight in kg.",
          step6CorrectFeedback:
            "Well done!\nTotal weight of potatoes is\n4 kg 0 g.",
          step6FinalCt:
            "Well Done!\nThe total weight of potatoes is 4 kg.\n\nLet's try another question.",
          step6FinalCtLast: "Well Done!\nThe total weight of potatoes is 4 kg.",
          resultLabel: "Total",
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
        tapNextToAddWeights: "Ketuk » untuk menambahkan berat.",
        tapNextToAddKg: "Ketuk » untuk menambahkan berat dalam kg.",
        tapNextForAnother: "Ketuk » untuk tantangan lain.",
        tapNextToSummarise: "Ketuk » untuk merangkum.",
        tapNextToSubtract: "Ketuk » untuk mengurangi berat.",
        tapNextToSubtractKg: "Ketuk » untuk mengurangi berat dalam kg.",
      },
      start: {
        heading: "Soal cerita tentang berat",
        text: 'Mari kita jelajahi cara menyelesaikan soal cerita tentang berat.<br><br>Ketuk "Mulai" untuk memulai!',
        buttonText: "Mulai",
      },
      summary: {
        heading: "Menambahkan Berat",
        text: "Luar biasa! Sekarang kamu tahu cara menyelesaikan soal cerita tentang berat.",
        buttonText: "Ulangi",
      },
      steps: {
        1: {
          characterText:
            "Hai!\nSaya Jammal.\nMari kita jelajahi cara menyelesaikan beberapa soal cerita tentang berat.",
          characterImage: "normal.png",
        },
        2: {
          characterText: "Mari kita baca soal ceritanya.",
        },
        3: {
          characterText:
            "Langkah 1: Tuliskan berat yang diberikan dalam soal cerita.",
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
        "Haruskah kita <y>menambah</y> atau <y>mengurangi</y> berat?\nPeriksa kata-kata dalam soal cerita yang menunjukkan penjumlahan atau pengurangan.",
      oops: "Ups!",
      tryAgain: "Coba lagi.",
      wellDone: "Bagus!",
      questions: [
        {
          statement:
            "Rina membeli 3 kg beras. Di rumah sudah ada 2.000 gram. Berapa total beras yang dimiliki Rina?",
          itemName1: "Beras yang dibeli Rina",
          itemName2: "Beras yang sudah ada di rumah",
          kgLabel: "kg",
          gmLabel: "gram",
          kgAns1: 3,
          gmAns1: 0,
          kgAns2: 2,
          gmAns2: 0,
          kgResult: 5,
          gmResult: 0,
          operation: "add",
          hintWord: "total",
          step3CharacterText:
            "Perhatikan kedua berat memakai satuan berbeda\n3 kg dan 2000 gram!\nMari ubah keduanya sebagai kg dan gram.",
          step3WrongFeedbackRow1:
            "Ups!\nCoba lagi.\nUbah 3 kg menjadi kg dan gram.",
          step3WrongFeedbackRow2:
            "Ups!\nCoba lagi.\nUbah 2000 g menjadi kg dan gram.",
          step3CorrectFeedback:
            "Bagus!\nKamu telah mengidentifikasi berat yang diberikan dalam soal dengan benar.",
          step4WrongFeedback:
            "Ups!\nBaca soalnya lagi. Periksa kata-kata yang menunjukkan operasi matematika.",
          step4CorrectFeedback:
            "Bagus!\nKata 'total' dalam soal cerita menunjukkan bahwa berat harus ditambahkan.",
          step5CharacterText:
            "Langkah 3: Tambahkan berat.\n\nMari tambahkan gram terlebih dahulu.",
          step5WrongFeedback:
            "Ups!\nCoba lagi.\n\nTambahkan 0 dan 0 untuk mendapatkan total berat dalam gram.",
          step5CorrectFeedback: "Bagus!\n0 g + 0 g\n= 0 g.",
          step5CtAfterGm:
            "Langkah 3: Tambahkan berat.\n0 g + 0 g\n= 0 g.\n\nMari tambahkan berat dalam kg.",
          step6WrongFeedback:
            "Ups!\nCoba lagi.\n\nTambahkan 3 kg dan 2 kg untuk mendapatkan total berat dalam kg.",
          step6CorrectFeedback:
            "Bagus!\nRina memiliki\n5 kg 0 g\nberas secara total.",
          step6FinalCt:
            "Bagus Sekali!\nRina memiliki 5 kg beras secara total.\n\nMari coba soal lain.",
          step6FinalCtLast:
            "Bagus Sekali!\nRina memiliki 5 kg beras secara total.",
          resultLabel: "Total",
        },
        {
          statement:
            "Seorang penjual buah memiliki 5.000 gram jeruk. Dia menjual 3 kg jeruk. Berapa gram jeruk yang tersisa?",
          itemName1: "Jeruk yang dimiliki penjual",
          itemName2: "Jeruk yang terjual",
          kgLabel: "kg",
          gmLabel: "gram",
          kgAns1: 5,
          gmAns1: 0,
          kgAns2: 3,
          gmAns2: 0,
          kgResult: 2,
          gmResult: 0,
          operation: "subtract",
          hintWord: "tersisa",
          step3CharacterText:
            "Perhatikan kedua berat memakai satuan berbeda\n5000 gram dan 3 kg!\nMari ubah keduanya sebagai kg dan gram.",
          step3WrongFeedbackRow1:
            "Ups!\nCoba lagi.\nUbah 5.000 g menjadi kg dan gram.",
          step3WrongFeedbackRow2:
            "Ups!\nCoba lagi.\nUbah 3 kg menjadi kg dan gram.",
          step3CorrectFeedback:
            "Bagus!\nKamu telah mengidentifikasi berat yang diberikan dalam soal dengan benar.",
          step4WrongFeedback:
            "Ups!\nBaca soalnya lagi. Periksa kata-kata yang menunjukkan operasi matematika.",
          step4CorrectFeedback:
            "Bagus!\nKata 'tersisa' dalam soal cerita menunjukkan bahwa berat harus dikurangkan.",
          step5CharacterText:
            "Langkah 3: Kurangi berat.\n\nMari kurangi gram terlebih dahulu.",
          step5WrongFeedback:
            "Ups!\nCoba lagi.\n\nKurangi 0 dari 0 untuk mendapatkan sisa berat dalam gram.",
          step5CorrectFeedback: "Bagus!\n0 g - 0 g\n= 0 g.",
          step5CtAfterGm:
            "Langkah 3: Kurangi berat.\n0 g - 0 g\n= 0 g.\n\nMari kurangi berat dalam kg.",
          step6WrongFeedback:
            "Ups!\nCoba lagi.\n\nKurangi 3 kg dari 5 kg untuk mendapatkan sisa berat dalam kg.",
          step6CorrectFeedback:
            "Bagus!\nSisa jeruk adalah\n2 kg 0 g\n(2000 g).",
          step6FinalCt:
            "Bagus Sekali!\nTersisa 2000 g jeruk.\n\nMari coba soal lain.",
          step6FinalCtLast: "Bagus Sekali!\nTersisa 2000 g jeruk.",
          resultLabel: "Sisa",
        },
        {
          statement:
            "Siti membeli 1 kg keju dan 1450 gram lagi. Berapa total berat keju?",
          itemName1: "1 kg keju",
          itemName2: "1450 gram lagi",
          kgLabel: "kg",
          gmLabel: "gram",
          kgAns1: 1,
          gmAns1: 0,
          kgAns2: 1,
          gmAns2: 450,
          kgResult: 2,
          gmResult: 450,
          operation: "add",
          hintWord: "total",
          step3CharacterText:
            "Perhatikan kedua berat memakai satuan berbeda\n1 kg dan 1450 gram!\nMari ubah keduanya sebagai kg dan gram.",
          step3WrongFeedbackRow1:
            "Ups!\nCoba lagi.\nUbah 1 kg menjadi kg dan gram.",
          step3WrongFeedbackRow2:
            "Ups!\nCoba lagi.\nUbah 1450 g menjadi kg dan gram.",
          step3CorrectFeedback:
            "Bagus!\nKamu telah mengidentifikasi berat yang diberikan dalam soal dengan benar.",
          step4WrongFeedback:
            "Ups!\nBaca soalnya lagi. Periksa kata-kata yang menunjukkan operasi matematika.",
          step4CorrectFeedback:
            "Bagus!\nKata 'total' dalam soal cerita menunjukkan bahwa berat harus ditambahkan.",
          step5CharacterText:
            "Langkah 3: Tambahkan berat.\n\nMari tambahkan gram terlebih dahulu.",
          step5WrongFeedback:
            "Ups!\nCoba lagi.\n\nTambahkan 0 dan 450 untuk mendapatkan total berat dalam gram.",
          step5CorrectFeedback: "Bagus!\n0 g + 450 g\n= 450 g.",
          step5CtAfterGm:
            "Langkah 3: Tambahkan berat.\n0 g + 450 g\n= 450 g.\n\nMari tambahkan berat dalam kg.",
          step6WrongFeedback:
            "Ups!\nCoba lagi.\n\nTambahkan 1 kg dan 1 kg untuk mendapatkan total berat dalam kg.",
          step6CorrectFeedback: "Bagus!\nTotal berat keju adalah\n2 kg 450 g.",
          step6FinalCt:
            "Bagus Sekali!\nTotal berat keju adalah 2 kg 450 g.\n\nMari coba soal lain.",
          step6FinalCtLast:
            "Bagus Sekali!\nTotal berat keju adalah 2 kg 450 g.",
          resultLabel: "Total",
        },
        {
          statement:
            "Ali mengumpulkan 2 kg 500 g kentang hari Senin dan 1500 gram hari Selasa. Berapa total berat kentang?",
          itemName1: "Kentang hari Senin",
          itemName2: "Kentang hari Selasa",
          kgLabel: "kg",
          gmLabel: "gram",
          kgAns1: 2,
          gmAns1: 500,
          kgAns2: 1,
          gmAns2: 500,
          gmInterim: 1000,
          kgResult: 4,
          gmResult: 0,
          operation: "add",
          hintWord: "total",
          step3CharacterText:
            "Perhatikan kedua berat memakai satuan berbeda\n2 kg 500 g dan 1500 gram!\nMari ubah keduanya sebagai kg dan gram.",
          step3WrongFeedbackRow1:
            "Ups!\nCoba lagi.\nUbah jumlah hari Senin menjadi kg dan gram.",
          step3WrongFeedbackRow2:
            "Ups!\nCoba lagi.\nUbah 1500 g menjadi kg dan gram.",
          step3CorrectFeedback:
            "Bagus!\nKamu telah mengidentifikasi berat yang diberikan dalam soal dengan benar.",
          step4WrongFeedback:
            "Ups!\nBaca soalnya lagi. Periksa kata-kata yang menunjukkan operasi matematika.",
          step4CorrectFeedback:
            "Bagus!\nKata 'total' dalam soal cerita menunjukkan bahwa berat harus ditambahkan.",
          step5CharacterText:
            "Langkah 3: Tambahkan berat.\n\nMari tambahkan gram terlebih dahulu.",
          step5WrongFeedback:
            "Ups!\nCoba lagi.\n\nTambahkan 500 dan 500 untuk mendapatkan total berat dalam gram.",
          step5CorrectFeedback: "Bagus!\n500 g + 500 g\n= 1000 g.",
          step5CtAfterGm:
            "Langkah 3: Tambahkan berat.\n500 g + 500 g\n= 1000 g.\n\nMari tambahkan berat dalam kg.",
          step6WrongFeedback:
            "Ups!\nCoba lagi.\n\nTambahkan 2 kg, 1 kg, dan 1 kg lagi dari 1000 g untuk mendapatkan total berat dalam kg.",
          step6CorrectFeedback: "Bagus!\nTotal berat kentang adalah\n4 kg 0 g.",
          step6FinalCt:
            "Bagus Sekali!\nTotal berat kentang adalah 4 kg.\n\nMari coba soal lain.",
          step6FinalCtLast: "Bagus Sekali!\nTotal berat kentang adalah 4 kg.",
          resultLabel: "Total",
        },
        {
          statement:
            "Sebuah karung berisi 10400 g beras. 3 kg telah digunakan. Berapa sisa beras?",
          itemName1: "Beras di karung",
          itemName2: "Beras yang digunakan",
          kgLabel: "kg",
          gmLabel: "gram",
          kgAns1: 10,
          gmAns1: 400,
          kgAns2: 3,
          gmAns2: 0,
          kgResult: 7,
          gmResult: 400,
          operation: "subtract",
          hintWord: "sisa",
          step3CharacterText:
            "Perhatikan kedua berat memakai satuan berbeda\n10400 g dan 3 kg!\nMari ubah keduanya sebagai kg dan gram.",
          step3WrongFeedbackRow1:
            "Ups!\nCoba lagi.\nUbah 10400 g menjadi kg dan gram.",
          step3WrongFeedbackRow2:
            "Ups!\nCoba lagi.\nUbah 3 kg menjadi kg dan gram.",
          step3CorrectFeedback:
            "Bagus!\nKamu telah mengidentifikasi berat yang diberikan dalam soal dengan benar.",
          step4WrongFeedback:
            "Ups!\nBaca soalnya lagi. Periksa kata-kata yang menunjukkan operasi matematika.",
          step4CorrectFeedback:
            "Bagus!\nKata 'sisa' dalam soal cerita menunjukkan bahwa berat harus dikurangkan.",
          step5CharacterText:
            "Langkah 3: Kurangi berat.\n\nMari kurangi gram terlebih dahulu.",
          step5WrongFeedback:
            "Ups!\nCoba lagi.\n\nKurangi 0 dari 400 untuk mendapatkan sisa berat dalam gram.",
          step5CorrectFeedback: "Bagus!\n400 g - 0 g\n= 400 g.",
          step5CtAfterGm:
            "Langkah 3: Kurangi berat.\n400 g - 0 g\n= 400 g.\n\nMari kurangi berat dalam kg.",
          step6WrongFeedback:
            "Ups!\nCoba lagi.\n\nKurangi 3 kg dari 10 kg untuk mendapatkan sisa berat dalam kg.",
          step6CorrectFeedback: "Bagus!\nSisa beras adalah\n7 kg 400 g.",
          step6FinalCt:
            "Bagus Sekali!\nSisa beras di karung adalah 7 kg 400 g.\n\nMari coba soal lain.",
          step6FinalCtLast:
            "Bagus Sekali!\nSisa beras di karung adalah 7 kg 400 g.",
          resultLabel: "Sisa",
        },
      ],
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
