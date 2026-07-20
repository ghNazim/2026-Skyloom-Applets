const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Reflection of a Point",
        text: "We saw that when a point is reflected across the x-axis,<br> its image appears on the <y>opposite side</y> – at the <y>same distance</y> from the line.<br><br>Now try it yourself and see where the image lands.",
        buttonText: "START",
      },
      steps: {
        1: {
          topText:
            "Let's plot point A(2, 4) and find the coordinates of its image after reflection across x-axis.",
          navText: "Tap » to start plotting given details.",
        },
        2: {
          rightText: "Plot Point <y>A(2, 4)</y>",
          navTextInitial: "Tap the cartesian to plot the point.",
          navTextRetry: "Tap again the cartesian to plot the point.",
          feedbackWrong: "Oops!<br>That's not correct.",
          feedbackCorrect: "Good job!<br>You plotted point A correctly.",
        },
        3: {
          rightText: "Plot <y>line of reflection</y>",
          navText: "Tap 'x-axis' to highlight the line of reflection.",
          reflectionLabel: "Line of reflection: x-axis",
        },
        4: {
          rightTextInitial:
            "Let's find the distance of point A from the line of reflection.",
          revealBtn: "Reveal",
          navTextReveal: "Tap 'Reveal'.",
          unitSingular: "1 unit",
          unitPlural: "{n} units",
          rightTextDone:
            "Point A(2, 4) is <y>4 units</y> away from x-axis.<br><y>y-coordinate of a point tells its distance from x-axis.</y><br>Now, let's recall the properties of reflection to locate the image.",
          propertiesBtn: "Properties",
          navTextProperties: "Tap 'Properties'.",
        },
        5: {
          navTextProp1: "Tap Property 1 to apply it.",
          navTextProp2: "Now, tap Property 2 to apply it.",
          navTextDone: "Tap » to find coordinates of the image.",
          property1Title: "Property 1",
          property1Text:
            "The line connecting the point and its image is <cy>perpendicular to the line of reflection</cy>.",
          property2Title: "Property 2",
          property2Text:
            "The point and its image are at <cy>equal distance</cy> from the line of reflection.",
          calloutProp1: "The image should be somewhere along this line",
          calloutProp2A: "Point A is 4 units away from line of reflection",
          calloutProp2B:
            "Locating the image at the same distance on the other side",
          doneText: "We have found the image using properties of reflection.",
        },
        6: {
          rightTextDone:
            "We located the image of<br><y>A(2, 4)</y> at <y>A&rsquo;(2, -4)</y>.",
          navTextDone: "Tap &raquo; to deduce the pattern.",
        },
        7: {
          topText: "<y>Compare the coordinates of point and its image.</y>",
          title: "Which of these observations is correct?",
          optionX: "x-coordinate changed",
          optionY: "y-coordinate changed",
          navTextInitial: "Tap the correct option.",
          navTextDone: "Tap &raquo; to continue.",
          feedbackWrong:
            "No, look again!<br>The x-coordinate of point and its image is same.",
          feedbackCorrect:
            "That&rsquo;s correct!<br>y-coordinates of point and its image have opposite signs.",
        },
        8: {
          topTextInitial:
            "<y>Compare the coordinates of point and its image.</y>",
          topTextRule: "Rule for reflection across x-axis.",
          navTextInitial: "Tap 'Reveal' for the x-axis rule.",
          navTextDone: "Tap &raquo; to see applications of this rule.",
          observationTitle: "Observation",
          observationX: "x-coordinate:",
          observationXValue: "No change",
          observationY: "y-coordinate:",
          observationYValue: "Sign changed",
          bodyText:
            "This pattern works for all<br>points reflected<br>across the x-axis.<br><br>Let&rsquo;s see the general rule.",
          revealBtn: "Reveal",
        },
        9: {
          questions: [
            {
              point: "A",
              x: "3",
              y: "4",
              imageX: "3",
              imageY: "-4",
              topText:
                "Find coordinates of image when point A(3, 4) is reflected across x-axis.",
              options: ["3", "-3", "4", "-4"],
            },
            {
              point: "B",
              x: "0",
              y: "-3",
              imageX: "0",
              imageY: "3",
              topText:
                "Find coordinates of image when point B(0, -3) is reflected across x-axis.",
              options: ["0", "3", "-3"],
            },
            {
              point: "C",
              x: "-3",
              y: "-2",
              imageX: "-3",
              imageY: "2",
              topText:
                "Find coordinates of image when point C(-3, -2) is reflected across x-axis.",
              options: ["3", "-3", "2", "-2"],
            },
          ],
          formulaText:
            'A(<span class="math-var">x</span>, <span class="math-var">y</span>) \u2192 A&rsquo;(<span class="math-var">x</span>, -<span class="math-var">y</span>)',
          pointLabel: "Point",
          imageLabel: "Image",
          navTextInitial: "Tap the correct option.",
          navTextXDone: "Tap &raquo; to continue.",
          navTextYDone: "Tap &raquo; for another challenge.",
          navTextFinalDone: "Tap &raquo; to complete the activity.",
          questionX: "What is the <y>x-coordinate</y> of the image?",
          questionY: "What is the <y>y-coordinate</y> of the image?",
          xWrongNeg3:
            "Oops! The sign of the x-coordinate should not change as per the rule.",
          xWrongOther:
            "Oops! x-coordinate doesn&rsquo;t change, it remains the same.",
          xCorrect:
            "That is correct!<br>Sign of x-coordinate of image does not change.",
          yWrong3: "Oops!<br>x-coordinate and y-coordinate do not get swapped.",
          yWrongNeg3:
            "Oops!<br>x-coordinate and y-coordinate do not get swapped.",
          yWrong4:
            "Oops!<br>The sign of the y-coordinate should reverse as per the rule.",
          yCorrect:
            "That is correct!<br>Sign of y-coordinate changes as per the given rule.",
          hintX: "unchanged",
          hintY: "sign reversed",
        },
        10: {
          heading: "Activity Completed!",
          ruleTitle: "Reflection of a Point Across x-axis",
          ruleLabel: "Rule:",
          ruleFormula:
            'A( <span class="math-var">x</span>, <span class="math-var">y</span> ) \u2192 A&rsquo;( <span class="math-var">x</span>, -<span class="math-var">y</span> )',
          body: "You can now find the coordinates of the image of a point<br>reflected across x-axis using the above rule.",
          restartPrompt: "Tap <y>START OVER</y> to repeat this activity!",
          buttonText: "START OVER",
        },
      },
      graph: {
        pointLabel: "A({x}, {y})",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Refleksi Sebuah Titik",
        text: "Kita telah melihat bahwa ketika sebuah titik direfleksikan terhadap sumbu-x,<br> bayangannya muncul di <y>sisi yang berlawanan</y> &ndash; pada <y>jarak yang sama</y> dari garis.<br><br>Sekarang coba sendiri dan lihat di mana bayangannya berada.",
        buttonText: "MULAI",
      },
      steps: {
        1: {
          topText:
            "Mari kita tandai titik A(2, 4) dan tentukan koordinat bayangannya setelah direfleksikan terhadap sumbu-x.",
          navText:
            "Ketuk &raquo; untuk mulai menandai informasi yang diberikan.",
        },
        2: {
          rightText: "Letakkan titik <y>A(2, 4)</y>",
          navTextInitial: "Ketuk bidang Kartesius untuk menandai titik.",
          navTextRetry: "Ketuk lagi bidang Kartesius untuk menandai titik.",
          feedbackWrong: "Ups!<br>Itu tidak benar.",
          feedbackCorrect: "Bagus!<br>Kamu menandai titik A dengan benar.",
        },
        3: {
          rightText: "Tampilkan <y>garis refleksi</y>",
          navText: "Ketuk 'sumbu-x' untuk menyorot garis refleksi.",
          reflectionLabel: "Garis refleksi: sumbu-x",
        },
        4: {
          rightTextInitial: "Mari cari jarak titik A dari garis refleksi.",
          revealBtn: "Tampilkan",
          navTextReveal: "Ketuk 'Tampilkan'.",
          unitSingular: "1 satuan",
          unitPlural: "{n} satuan",
          rightTextDone:
            "Titik A(2, 4) berjarak <y>4 satuan</y> dari sumbu-x.<br><y>Koordinat-y sebuah titik menunjukkan jaraknya dari sumbu-x.</y><br>Sekarang, mari ingat kembali sifat-sifat refleksi untuk menemukan bayangannya.",
          propertiesBtn: "Sifat",
          navTextProperties: "Ketuk 'Sifat'.",
        },
        5: {
          navTextProp1: "Ketuk Sifat 1 untuk menerapkannya.",
          navTextProp2: "Sekarang, ketuk Sifat 2 untuk menerapkannya.",
          navTextDone: "Ketuk &raquo; untuk menemukan koordinat bayangan.",
          property1Title: "Sifat 1",
          property1Text:
            "Garis yang menghubungkan titik dan bayangannya <cy>tegak lurus terhadap garis refleksi</cy>.",
          property2Title: "Sifat 2",
          property2Text:
            "Titik dan bayangannya berada pada <cy>jarak yang sama</cy> dari garis refleksi.",
          calloutProp1: "Bayangan harus berada di sepanjang garis ini",
          calloutProp2A: "Titik A berjarak 4 satuan dari garis refleksi",
          calloutProp2B:
            "Menentukan bayangan pada jarak yang sama di sisi lain",
          doneText:
            "Kita telah menemukan bayangan menggunakan sifat-sifat refleksi.",
        },
        6: {
          rightTextDone:
            "Kita menemukan bayangan dari<br><y>A(2, 4)</y> di <y>A&rsquo;(2, -4)</y>.",
          navTextDone: "Ketuk &raquo; untuk menyimpulkan polanya.",
        },
        7: {
          topText: "<y>Bandingkan koordinat titik dan bayangannya.</y>",
          title: "Pengamatan mana yang benar?",
          optionX: "koordinat-x berubah",
          optionY: "koordinat-y berubah",
          navTextInitial: "Ketuk pilihan yang benar.",
          navTextDone: "Ketuk &raquo; untuk melanjutkan.",
          feedbackWrong:
            "Belum tepat, coba perhatikan lagi!<br>Koordinat-x titik dan bayangannya sama.",
          feedbackCorrect:
            "Benar!<br>Koordinat-y titik dan bayangannya memiliki tanda yang berlawanan.",
        },
        8: {
          topTextInitial: "<y>Bandingkan koordinat titik dan bayangannya.</y>",
          topTextRule: "Aturan refleksi terhadap sumbu-x.",
          navTextInitial: "Ketuk 'Tampilkan' untuk melihat aturan sumbu-x.",
          navTextDone: "Ketuk &raquo; untuk melihat penerapan aturan ini.",
          observationTitle: "Pengamatan",
          observationX: "koordinat-x:",
          observationXValue: "Tidak berubah",
          observationY: "koordinat-y:",
          observationYValue: "Tanda berubah",
          bodyText:
            "Pola ini berlaku untuk semua<br>titik yang direfleksikan<br>terhadap sumbu-x.<br><br>Mari kita lihat aturan umumnya.",
          revealBtn: "Tampilkan",
        },
        9: {
          questions: [
            {
              point: "A",
              x: "3",
              y: "4",
              imageX: "3",
              imageY: "-4",
              topText:
                "Tentukan koordinat bayangan ketika titik A(3, 4) direfleksikan terhadap sumbu-x.",
              options: ["3", "-3", "4", "-4"],
            },
            {
              point: "B",
              x: "0",
              y: "-3",
              imageX: "0",
              imageY: "3",
              topText:
                "Tentukan koordinat bayangan ketika titik B(0, -3) direfleksikan terhadap sumbu-x.",
              options: ["0", "3", "-3"],
            },
            {
              point: "C",
              x: "-3",
              y: "-2",
              imageX: "-3",
              imageY: "2",
              topText:
                "Tentukan koordinat bayangan ketika titik C(-3, -2) direfleksikan terhadap sumbu-x.",
              options: ["3", "-3", "2", "-2"],
            },
          ],
          formulaText:
            'A(<span class="math-var">x</span>, <span class="math-var">y</span>) \u2192 A&rsquo;(<span class="math-var">x</span>, -<span class="math-var">y</span>)',
          pointLabel: "Titik",
          imageLabel: "Bayangan",
          navTextInitial: "Ketuk pilihan yang benar.",
          navTextXDone: "Ketuk &raquo; untuk melanjutkan.",
          navTextYDone: "Ketuk &raquo; untuk tantangan berikutnya.",
          navTextFinalDone: "Ketuk &raquo; untuk menyelesaikan aktivitas.",
          questionX: "Berapa <y>koordinat-x</y> bayangannya?",
          questionY: "Berapa <y>koordinat-y</y> bayangannya?",
          xWrongNeg3:
            "Ups! Sesuai aturan, tanda koordinat-x tidak boleh berubah.",
          xWrongOther: "Ups! Koordinat-x tidak berubah; nilainya tetap sama.",
          xCorrect: "Benar!<br>Tanda koordinat-x bayangan tidak berubah.",
          yWrong3: "Ups!<br>Koordinat-x dan koordinat-y tidak saling bertukar.",
          yWrongNeg3:
            "Ups!<br>Koordinat-x dan koordinat-y tidak saling bertukar.",
          yWrong4: "Ups!<br>Sesuai aturan, tanda koordinat-y harus berbalik.",
          yCorrect:
            "Benar!<br>Tanda koordinat-y berubah sesuai aturan yang diberikan.",
          hintX: "tidak berubah",
          hintY: "tanda berbalik",
        },
        10: {
          heading: "Aktivitas Selesai!",
          ruleTitle: "Refleksi Sebuah Titik terhadap sumbu-x",
          ruleLabel: "Aturan:",
          ruleFormula:
            'A( <span class="math-var">x</span>, <span class="math-var">y</span> ) \u2192 A&rsquo;( <span class="math-var">x</span>, -<span class="math-var">y</span> )',
          body: "Sekarang kamu dapat menentukan koordinat bayangan sebuah titik<br>yang direfleksikan terhadap sumbu-x menggunakan aturan di atas.",
          restartPrompt:
            "Ketuk <y>MULAI LAGI</y> untuk mengulang aktivitas ini!",
          buttonText: "MULAI LAGI",
        },
      },
      graph: {
        pointLabel: "A({x}, {y})",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
