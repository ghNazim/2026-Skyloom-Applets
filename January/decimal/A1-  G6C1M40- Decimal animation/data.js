const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

// Master data structure
const DATA = {
  en: {
    app: {
      start: {
        heading: "Fractions to Decimal Numbers",
        text: "Let us explore how a digit's position after the decimal\npoint gives fractions with <y>denominator</y> <y>10</y> or <y>100</y>.",
        buttonText: "Start",
      },
      final: {
        heading: "Fractions and Decimal ",
        text: "Awesome!\nYou've explored how moving a digit across place values\nchanges its value by powers of <y>10</y>.",
        buttonText: "Start Over",
      },
      nav: {
        next: "Tap » to continue.",
        tapCorrectAnswer: "Tap the correct answer.",
      },
      steps: {
        1: {
          questionText: "A place-value chart shows <y>each digit's position</y> and <y>its value</y>.",
          navText: "Tap » to identify the number in the chart",
        },
        2: {
          questionText: "What number is shown in the place-value chart?",
          navText: "Tap the correct answer.",
          navTextAfterCorrect: "Tap » to understand the number in different forms.",
          mcq: {
            options: ["3", "30", "300", "30.0"],
            answer: "300",
            feedbacks: {
              wrong: "Not quite.\nThe digit 3 is in\nthe hundreds\nplace. Try again.",
              correct: "Correct! The\nnumber 3 is in the\nhundreds place,\nand the value of\nthe number is 300."
            }
          }
        },
        3: {
          questionText: "Using the place-value chart, we can write the number in <y>standard form</y>.",
          navText: "Tap »",
        },
        4: {
          questionText: "We can also write the number in the <y>expanded form</y>.",
          navText: "Tap »",
        },
        5: {
          questionText: "Now, what happens when the digit <y>'3'</y> moves to the <y>right</y> across the <y>place values</y>?",
          navText: "Tap » to explore.",
        },
        6: {
          questionText: "Let us move the digit <y>'3'</y> across the <y>place values</y>.",
          navText: "Tap the arrow to move the digit.",
          substeps: {
            1: {
              q: "Let us move the digit <y>'3'</y> across the <y>place values</y>.",
              n: "Tap the arrow to move the digit.",
              mcqQuestionText: "What number is shown in the place-value chart?",
              mcq: {
                options: [300, 3, 30],
                answer: 30
              }
            },
            2: {
              q: "Let us move the digit <y>'3'</y> further to the right.",
              n: "Tap the arrow to move the digit.",
              mcqQuestionText: "What number is shown in the place-value chart?",
              mcq: {
                options: [300, 3, 30],
                answer: 3
              }
            },
            3: {
              q: "Moving a digit one place to the <y>right</y> makes its value <y>10 times smaller</y>.",
              n: "Tap »"
            }
          }
        },
        7: {
          questionText: "Moving the digit <y>right</y> is the <y>same as</y> moving the <y>decimal point</y> left —both make the value <y>10 times smaller</y>.",
          navText: "Tap » to move the digit further."
        },
        8: {
          questionText: "Let us move <y>'3'</y> after the ones place and into the <y>decimal places</y>.",
          navText: "Tap the arrow to move the digit.",
          mcqQuestionText: "3 is in the <y>tenths place</y>. What is the value of the number?",
          mcq: {
            options: ["3.0", "0.3", "30.0"],
            answer: "0.3"
          },
          questionTextAfterCorrect: "Both the <y>first place after the decimal</y> and moving the decimal <y>one place to the left</y> give <y>tenths</y>.",
          navTextAfterCorrect: "Tap » to move the digit to the next place.",
          feedbackBoxText: "One place after the decimal or moving the decimal one place to the left gives a fraction with <b>denominator 10</b>."
        },
        9: {
          questionText: "Let us move the digit <y>'3'</y> one more place to the <y>right</y>.",
          navText: "Tap the arrow to move the digit.",
          mcqQuestionText: "3 is in the <y>hundredths place</y>. What is the value of the number?",
          mcq: {
            options: ["3.0", "0.3", "0.03"],
            answer: "0.03"
          },
          questionTextAfterCorrect: "Both the <y>second place after the decimal</y> and moving the decimal <y>two places to the left</y> give <y>hundredths</y>.",
          navTextAfterCorrect: "Tap » to explore this change in value again.",
          feedbackBoxText: "Two places after the decimal or moving the decimal two places to the left gives a fraction with <b>denominator 100</b>."
        },
        10: {
          questionText: "Notice how <y>moving the digit to the right</y> changes its value.",
          navText: "Tap the arrow to move the digit and explore its value again.",
          navTextAfterInteraction: "Tap » to summarize."
        },
        11: {
          type: "splash",
          splashType: "type1",
          heading: "The digit 3 is <y>one place</y> after the decimal point.",
          buttonText: "Continue",
          equation: {
            digits: ['0', '0', '0', '3'],
            decimalPosition: 3, // decimal point before index 3
            numerator: 3,
            denominator: 10,
            pulsateZeros: true,
            bracketCount: 1
          },
          feedbackText: "One digit after the decimal point gives the fraction with denominator <y>10</y>, and the digit 3 becomes the numerator."
        },
        12: {
          type: "splash",
          splashType: "type1",
          heading: "The digit 3 is <y>two places</y> after the decimal point.",
          buttonText: "Continue",
          equation: {
            digits: ['0', '0', '0', '0', '3'],
            decimalPosition: 3, // decimal point before index 3
            numerator: 3,
            denominator: 100,
            pulsateZeros: true,
            bracketCount: 2
          },
          feedbackText: "Two digits after the decimal point gives the fraction with denominator <y>100</y>, and the digit 3 becomes the numerator."
        },
        13: {
          type: "fullscreen",
          heading: "",
          text: "We understood how to write decimals as fractions.<br><br>Now, let's summarize how to write fractions as decimals.",
          buttonText: "Continue"
        },
        14: {
          type: "splash",
          splashType: "type2",
          heading: "One zero in the denominator <y>mean the decimal point moves</y> one place <y>to the left.</y>",
          buttonText: "Continue",
          equation: {
            numerator: 3,
            denominator: 10,
            // 0(grey) 0(yellow) . (active) 3(white) . (inactive) 0 0 0(grey)
            decimalDisplay: [
              { type: 'char', value: '0', color: 'grey' },
              { type: 'char', value: '0', color: 'yellow' },
              { type: 'dot', active: true },
              { type: 'char', value: '3', color: 'white' },
              { type: 'dot', active: false },
              { type: 'char', value: '0', color: 'grey' },
              { type: 'char', value: '0', color: 'grey' },
              { type: 'char', value: '0', color: 'grey' }
            ],
            arrowCount: 1,
            numeratorLabel: "Numerator = Digits after the decimal point",
            denominatorLabel: "Denominator = 10"
          },
          feedbackText: "The number of zeros in the denominator tells how many places to move the decimal to the left, starting after the numerator."
        },
        15: {
          type: "splash",
          splashType: "type2",
          heading: "Two zeros in the denominator <y>mean the decimal point moves</y> two places <y>to the left.</y>",
          buttonText: "Continue",
          equation: {
            numerator: 3,
            denominator: 100,
            // 0(yellow) . (active) 0(yellow) . (inactive) 3(white) . (inactive) 0 0 0(grey)
            decimalDisplay: [
              { type: 'char', value: '0', color: 'yellow' },
              { type: 'dot', active: true },
              { type: 'char', value: '0', color: 'yellow' },
              { type: 'dot', active: false },
              { type: 'char', value: '3', color: 'white' },
              { type: 'dot', active: false },
              { type: 'char', value: '0', color: 'grey' },
              { type: 'char', value: '0', color: 'grey' },
              { type: 'char', value: '0', color: 'grey' }
            ],
            arrowCount: 2,
            numeratorLabel: "Numerator = Digits after the decimal point",
            denominatorLabel: "Denominator = 100"
          },
          feedbackText: "The number of zeros in the denominator tells how many places to move the decimal to the left, starting after the numerator."
        },
        16: {
          type: "dndQuestion",
          questionText: "Write the given fraction in decimal form.",
          questionCorrect100:"Moving the decimal point two places to the left gives {num} hundredths.",
          questionCorrect10:"Moving the decimal point one place to the left gives {num} tenths.",
          navText: "Tap any of the pink circles to move the decimal there.",
          navTextAfterCorrect: "Tap » to try another fraction.",
          navTextComplete: "Tap » to complete activity.",
          checkButton: "Check",
          places: {
            one: "one",
            two: "two"
          },
          feedbacks: {
            wrong: "Not quite!\nCount the\nzeros in the\ndenominator\nand move the\ndecimal to the\nleft that many\nplaces.",
            correct: "Great job!\nMoving the\ndecimal point\n{places} places to\nthe left gives\n{result}."
          },
          questions: [
            { num: 8, den: 100, rightNum: "0080" },
            { num: 45, den: 100, rightNum: "0450" },
            { num: 23, den: 10, rightNum: "0230" },
            { num: 56, den: 10, rightNum: "0560" },
            { num: 235, den: 100, rightNum: "2350" },
            { num: 96, den: 100, rightNum: "0960" }
          ]
        },
        17: {
          type: "fullscreen",
          heading: "Fractions and Decimal",
          text: "Awesome!<br><br>When writing fractions with denominators 10 or 100 as decimals,<br><br>● The <y>denominator</y> tells how many places to move the decimal point left.<br><br>● The <y>numerator</y> becomes the digits of the decimal.",
          buttonText: "Start Over"
        },
      },
      labels: {
        placeValueChart: "Place value chart",
        standardForm: "Value of number in standard form",
        expandedForm: "Expanded form of the number",
      },
      placeLabels: ["H", "T", "O", "t", "h"],
      placeNames: ["hundreds", "tens", "ones", "tenths", "hundredths"],
    },
    
  },
  id: {
      app: {
        start: {
          heading: "Pecahan ke Bilangan Desimal",
          text: "Mari kita jelajahi bagaimana posisi digit setelah titik\ndesimal memberikan pecahan dengan <y>penyebut</y> <y>10</y> atau <y>100</y>.",
          buttonText: "Mulai",
        },
        final: {
          heading: "Pecahan dan Desimal",
          text: "Luar biasa!\nAnda telah menjelajahi bagaimana memindahkan digit melintasi nilai tempat\nmengubah nilainya dengan pangkat <y>10</y>.",
          buttonText: "Mulai Lagi",
        },
        nav: {
          next: "Ketuk » untuk melanjutkan.",
          tapCorrectAnswer: "Ketuk jawaban yang benar.",
        },
        steps: {
          1: {
            questionText: "Tabel nilai tempat menunjukkan <y>posisi setiap digit</y> dan <y>nilainya</y>.",
            navText: "Ketuk » untuk mengidentifikasi angka dalam tabel",
          },
          2: {
            questionText: "Angka berapa yang ditunjukkan dalam tabel nilai tempat?",
            navText: "Ketuk jawaban yang benar.",
            navTextAfterCorrect: "Ketuk » untuk memahami angka dalam bentuk yang berbeda.",
            mcq: {
              options: ["3", "30", "300", "30,0"],
              answer: "300",
              feedbacks: {
                wrong: "Belum tepat.\nDigit 3 berada di\nposisi ratusan.\nCoba lagi.",
                correct: "Benar! Angka\n3 berada di posisi\nratusan,\ndan nilai\nangkanya adalah 300."
              }
            }
          },
          3: {
            questionText: "Menggunakan tabel nilai tempat, kita dapat menulis angka dalam <y>bentuk standar</y>.",
            navText: "Ketuk »",
          },
          4: {
            questionText: "Kita juga dapat menulis angka dalam <y>bentuk panjang</y>.",
            navText: "Ketuk »",
          },
          5: {
            questionText: "Sekarang, apa yang terjadi ketika digit <y>'3'</y> bergerak ke <y>kanan</y> melintasi <y>nilai tempat</y>?",
            navText: "Ketuk » untuk menjelajahi.",
          },
          6: {
            questionText: "Mari kita pindahkan digit <y>'3'</y> melintasi <y>nilai tempat</y>.",
            navText: "Ketuk panah untuk memindahkan digit.",
            substeps: {
              1: {
                q: "Mari kita pindahkan digit <y>'3'</y> melintasi <y>nilai tempat</y>.",
                n: "Ketuk panah untuk memindahkan digit.",
                mcqQuestionText: "Angka berapa yang ditunjukkan dalam tabel nilai tempat?",
                mcq: {
                  options: [300, 3, 30],
                  answer: 30
                }
              },
              2: {
                q: "Mari kita pindahkan digit <y>'3'</y> lebih jauh ke kanan.",
                n: "Ketuk panah untuk memindahkan digit.",
                mcqQuestionText: "Angka berapa yang ditunjukkan dalam tabel nilai tempat?",
                mcq: {
                  options: [300, 3, 30],
                  answer: 3
                }
              },
              3: {
                q: "Memindahkan digit satu tempat ke <y>kanan</y> membuat nilainya <y>10 kali lebih kecil</y>.",
                n: "Ketuk »"
              }
            }
          },
          7: {
            questionText: "Memindahkan digit ke <y>kanan</y> <y>sama dengan</y> memindahkan <y>titik desimal</y> ke kiri —keduanya membuat nilai <y>10 kali lebih kecil</y>.",
            navText: "Ketuk » untuk memindahkan digit lebih jauh."
          },
          8: {
            questionText: "Mari kita pindahkan <y>'3'</y> setelah posisi satuan dan ke dalam <y>tempat desimal</y>.",
            navText: "Ketuk panah untuk memindahkan digit.",
            mcqQuestionText: "3 berada di <y>posisi persepuluh</y>. Berapa nilai angkanya?",
            mcq: {
              options: ["3,0", "0,3", "30,0"],
              answer: "0,3"
            },
            questionTextAfterCorrect: "Baik <y>tempat pertama setelah desimal</y> maupun memindahkan desimal <y>satu tempat ke kiri</y> memberikan <y>persepuluh</y>.",
            navTextAfterCorrect: "Ketuk » untuk memindahkan digit ke tempat berikutnya.",
            feedbackBoxText: "Satu tempat setelah desimal atau memindahkan desimal satu tempat ke kiri memberikan pecahan dengan <b>penyebut 10</b>."
          },
          9: {
            questionText: "Mari kita pindahkan digit <y>'3'</y> satu tempat lagi ke <y>kanan</y>.",
            navText: "Ketuk panah untuk memindahkan digit.",
            mcqQuestionText: "3 berada di <y>posisi perseratus</y>. Berapa nilai angkanya?",
            mcq: {
              options: ["3,0", "0,3", "0,03"],
              answer: "0,03"
            },
            questionTextAfterCorrect: "Baik <y>tempat kedua setelah desimal</y> maupun memindahkan desimal <y>dua tempat ke kiri</y> memberikan <y>perseratus</y>.",
            navTextAfterCorrect: "Ketuk » untuk menjelajahi perubahan nilai ini lagi.",
            feedbackBoxText: "Dua tempat setelah desimal atau memindahkan desimal dua tempat ke kiri memberikan pecahan dengan <b>penyebut 100</b>."
          },
          10: {
            questionText: "Perhatikan bagaimana <y>memindahkan digit ke kanan</y> mengubah nilainya.",
            navText: "Ketuk panah untuk memindahkan digit dan jelajahi nilainya lagi.",
            navTextAfterInteraction: "Ketuk » untuk merangkum."
          },
          11: {
            type: "splash",
            splashType: "type1",
            heading: "Digit 3 berada <y>satu tempat</y> setelah titik desimal.",
            buttonText: "Lanjutkan",
            equation: {
              digits: ['0', '0', '0', '3'],
              decimalPosition: 3,
              numerator: 3,
              denominator: 10,
              pulsateZeros: true,
              bracketCount: 1
            },
            feedbackText: "Satu digit setelah titik desimal memberikan pecahan dengan penyebut <y>10</y>, dan digit 3 menjadi pembilang."
          },
          12: {
            type: "splash",
            splashType: "type1",
            heading: "Digit 3 berada <y>dua tempat</y> setelah titik desimal.",
            buttonText: "Lanjutkan",
            equation: {
              digits: ['0', '0', '0', '0', '3'],
              decimalPosition: 3,
              numerator: 3,
              denominator: 100,
              pulsateZeros: true,
              bracketCount: 2
            },
            feedbackText: "Dua digit setelah titik desimal memberikan pecahan dengan penyebut <y>100</y>, dan digit 3 menjadi pembilang."
          },
          13: {
            type: "fullscreen",
            heading: "",
            text: "Kita memahami cara menulis desimal sebagai pecahan.<br><br>Sekarang, mari kita rangkum cara menulis pecahan sebagai desimal.",
            buttonText: "Lanjutkan"
          },
          14: {
            type: "splash",
            splashType: "type2",
            heading: "Satu nol dalam penyebut <y>berarti titik desimal bergerak</y> satu tempat <y>ke kiri.</y>",
            buttonText: "Lanjutkan",
            equation: {
              numerator: 3,
              denominator: 10,
              decimalDisplay: [
                { type: 'char', value: '0', color: 'grey' },
                { type: 'char', value: '0', color: 'yellow' },
                { type: 'dot', active: true },
                { type: 'char', value: '3', color: 'white' },
                { type: 'dot', active: false },
                { type: 'char', value: '0', color: 'grey' },
                { type: 'char', value: '0', color: 'grey' },
                { type: 'char', value: '0', color: 'grey' }
              ],
              arrowCount: 1,
              numeratorLabel: "Pembilang = Digit setelah titik desimal",
              denominatorLabel: "Penyebut = 10"
            },
            feedbackText: "Jumlah nol dalam penyebut menunjukkan berapa banyak tempat untuk memindahkan desimal ke kiri, dimulai setelah pembilang."
          },
          15: {
            type: "splash",
            splashType: "type2",
            heading: "Dua nol dalam penyebut <y>berarti titik desimal bergerak</y> dua tempat <y>ke kiri.</y>",
            buttonText: "Lanjutkan",
            equation: {
              numerator: 3,
              denominator: 100,
              decimalDisplay: [
                { type: 'char', value: '0', color: 'yellow' },
                { type: 'dot', active: true },
                { type: 'char', value: '0', color: 'yellow' },
                { type: 'dot', active: false },
                { type: 'char', value: '3', color: 'white' },
                { type: 'dot', active: false },
                { type: 'char', value: '0', color: 'grey' },
                { type: 'char', value: '0', color: 'grey' },
                { type: 'char', value: '0', color: 'grey' }
              ],
              arrowCount: 2,
              numeratorLabel: "Pembilang = Digit setelah titik desimal",
              denominatorLabel: "Penyebut = 100"
            },
            feedbackText: "Jumlah nol dalam penyebut menunjukkan berapa banyak tempat untuk memindahkan desimal ke kiri, dimulai setelah pembilang."
          },
          16: {
            type: "dndQuestion",
            questionText: "Tuliskan pecahan yang diberikan dalam bentuk desimal.",
            questionCorrect100: "Memindahkan titik desimal dua tempat ke kiri memberikan {num} perseratus.",
            questionCorrect10: "Memindahkan titik desimal satu tempat ke kiri memberikan {num} persepuluh.",
            navText: "Ketuk salah satu lingkaran pink untuk memindahkan desimal ke sana.",
            navTextAfterCorrect: "Ketuk » untuk mencoba pecahan lain.",
            navTextComplete: "Ketuk » untuk menyelesaikan aktivitas.",
            checkButton: "Periksa",
            places: {
              one: "satu",
              two: "dua"
            },
            feedbacks: {
              wrong: "Belum tepat!\nHitung jumlah\nnol dalam\npenyebut\ndan pindahkan\ndesimal ke\nkiri sebanyak\ntempat tersebut.",
              correct: "Kerja bagus!\nMemindahkan\ntitik desimal\n{places} tempat ke\nkiri memberikan\n{result}."
            },
            questions: [
              { num: 8, den: 100, rightNum: "0080" },
              { num: 45, den: 100, rightNum: "0450" },
              { num: 23, den: 10, rightNum: "0230" },
              { num: 56, den: 10, rightNum: "0560" },
              { num: 235, den: 100, rightNum: "2350" },
              { num: 96, den: 100, rightNum: "0960" }
            ]
          },
          17: {
            type: "fullscreen",
            heading: "Pecahan dan Desimal",
            text: "Luar biasa!<br><br>Saat menulis pecahan dengan penyebut 10 atau 100 sebagai desimal,<br><br>● <y>Penyebut</y> menunjukkan berapa banyak tempat untuk memindahkan titik desimal ke kiri.<br><br>● <y>Pembilang</y> menjadi digit desimal.",
            buttonText: "Mulai Lagi"
          },
        },
        labels: {
          placeValueChart: "Tabel nilai tempat",
          standardForm: "Nilai angka dalam bentuk standar",
          expandedForm: "Bentuk panjang angka",
        },
        placeLabels: ["R", "P", "S", "p", "s"],
        placeNames: ["ratusan", "puluhan", "satuan", "persepuluh", "perseratus"],
      },
    },
  
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
