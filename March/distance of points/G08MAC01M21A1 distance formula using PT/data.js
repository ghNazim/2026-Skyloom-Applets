const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Distance Formula",
        text: "Let’s explore finding the distance between<br>two points placed diagonally.",
        buttonText: "Start",
      },
      steps: {
        1: {
          questionTextInitial:
            "Shout out the distance of each point from the y-axis: (3, 4) and (7, 7)",
          navTextInitial: "Tap the “?” to see the answer.",
          questionTextBetweenHorizontal:
            "Now, shout out the horizontal distance between the points (3, 4) and (7, 7).",
          navTextBetweenHorizontal: "Tap the “?” to see the answer.",
          questionTextDone:
            "The horizontal distance between the points (3, 4) and (7, 7) is <pr>4 units</pr>.",
          navTextDone:
            "Tap » to find the vertical distance between the points.",
          labelYellowAxis: "3 units",
          labelBlueAxis: "7 units",
          horizontalExprLeadingBlue: "7",
          horizontalExprLeadingYellow: "3",
          horizontalExprResult: "4 units",
        },
        2: {
          questionTextInitial:
            "Shout out the distance of each point from the x-axis: (3, 4) and (7, 7)",
          navTextInitial: "Tap the “?” to see the answer.",
          questionTextBetweenVertical:
            "Now, shout out the vertical distance between the points (3, 4) and (7, 7).",
          navTextBetweenVertical: "Tap the “?” to see the answer.",
          questionTextDone:
            "The vertical distance between the points (3, 4) and (7, 7) is <gr>3 units</gr>.",
          navTextDone: "Tap » to find the distance between the points.",
          labelYellowAxis: "4 units",
          labelBlueAxis: "7 units",
          fadedHorizontalLabel: "4 unit",
          verticalExprLeadingBlue: "7",
          verticalExprLeadingYellow: "4",
          verticalExprResult: "3 unit",
        },
        3: {
          questionTextInitial:
            "The horizontal and vertical distances between the points are <pr>4 units</pr> and <gr>3 units</gr> respectively.",
          navTextInitial:
            "Tap the “?” to find the distance between the points.",
          questionTextTriangle:
            "It forms a <y>triangle</y>. Shout out what type of triangle it is.",
          navTextTriangle: "Tap the triangle to see the answer.",
          questionTextHypotenuse:
            "It is a <y>right angled triangle</y>. The side d is the <y>hypotenuse</y>. Let’s find its length.",
          navTextHypotenuse: "Tap “d” to find the length of the hypotenuse.",
          horizontalLegLabel: "4 units",
          verticalLegLabel: "3 units",
        },
        4: {
          questionText: "Let's find the length of the hypotenuse.",
          navTextInitial: " ",
          navTextTapExpression: "Tap the expression to solve it.",
          navTextTapPlus: 'Tap "+" to simplify the expression.',
          navTextTapToSimplify: "Tap the expression to simplify it.",
          navTextConclude: "Tap \u00BB to conclude.",
          calcTitle: "Using the Pythagorean theorem,",
          hypLabel: "5 units",
        },
        5: {
          questionText:
            "The distance between the points (3, 4) and (7, 7) is <pk>5 units</pk>.",
          navTextInitial: " ",
          navText: "Tap \u00BB to try with a few more examples.",
        },
      },
      practiceQuestions: [
        {
          title: "Question 01",
          statement: "Find the distance between the points (2, 2) and (8, 10).",
          x1: 2,
          y1: 2,
          x2: 8,
          y2: 10,
        },
        {
          title: "Question 02",
          statement: "Find the distance between the points (4, 3) and (8, 9).",
          x1: 4,
          y1: 3,
          x2: 8,
          y2: 9,
        },
        {
          title: "Question 03",
          statement: "Find the distance between the points (3, 2) and (9, 7).",
          x1: 3,
          y1: 2,
          x2: 9,
          y2: 7,
        },
        {
          qtype: "xy",
          title: "Question 04",
          statement: "Find the distance between any 2 arbitrary points (x\u2081, y\u2081) and (x\u2082, y\u2082).",
          x1: 3,
          y1: 4,
          x2: 8,
          y2: 9,
        },
      ],
      practiceCopy: {
        tapQ: "Tap the “?” to see the answer.",
        tapNext: "Tap \u00BB to move to the next question.",
        navLast:
          "Tap \u00BB to complete the activity.",
        finalDistanceXy:
          "The distance between any two arbitrary points is {{FORMULA}}.",
        unitsWord: "units",
        shoutHorizontal:
          "Shout out the horizontal distance between the points.",
        shoutHorizontalXy:
          "Shout out the horizontal distance between the points.",
        xyAfterHorizontal:
          "The horizontal distance is <bl>x\u2082</bl> \u2212 <yl>x\u2081</yl>. Now, shout the vertical distance.",
        xyAfterVertical:
          "The vertical distance is <bl>y\u2082</bl> \u2212 <yl>y\u2081</yl>. Now, find the distance between the points.",
        xyAwaitHypAnim:
          "The vertical distance is <bl>y\u2082</bl> \u2212 <yl>y\u2081</yl>. Now, find the distance between the points.",
        afterHorizontal:
          "The horizontal distance between the points is <pr>{{DX}} units</pr>. Now, shout the vertical distance.",
        afterVertical:
          "The vertical distance is <gr>{{DY}} units</gr>. Now, shout the distance between the points.",
        finalDistance: "The distance between the points is <pk>{{DIST}}</pk>.",
        continueButton: "Continue",
      },
      examplesNext: {
        heading: "Distance Formula",
        text: "<y>More examples coming soon.</y><br><br>Use Start Over to explore again from the beginning.",
        buttonText: "Start Over",
      },
      final: {
        heading: "Distance Formula",
        text: "Awesome! Now, we know how to find<br> the distance between any two points.",
        buttonText: "Start Over",
        imageSrc: null,
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Rumus Jarak",
        text: "Mari jelajahi cara mencari jarak antara<br>dua titik yang letaknya diagonal.",
        buttonText: "Mulai",
      },
      steps: {
        1: {
          questionTextInitial:
            "Sebutkan jarak tiap titik dari sumbu-y: (3, 4) dan (7, 7)",
          navTextInitial: "Ketuk “?” untuk melihat jawabannya.",
          questionTextBetweenHorizontal:
            "Sekarang, sebutkan jarak horizontal antara titik (3, 4) dan (7, 7).",
          navTextBetweenHorizontal: "Ketuk “?” untuk melihat jawabannya.",
          questionTextDone:
            "Jarak horizontal antara titik (3, 4) dan (7, 7) adalah <pr>4 satuan</pr>.",
          navTextDone:
            "Ketuk » untuk mencari jarak vertikal antara titik-titik tersebut.",
          labelYellowAxis: "3 satuan",
          labelBlueAxis: "7 satuan",
          horizontalExprLeadingBlue: "7",
          horizontalExprLeadingYellow: "3",
          horizontalExprResult: "4 satuan",
        },
        2: {
          questionTextInitial:
            "Sebutkan jarak tiap titik dari sumbu-x: (3, 4) dan (7, 7)",
          navTextInitial: "Ketuk “?” untuk melihat jawabannya.",
          questionTextBetweenVertical:
            "Sekarang, sebutkan jarak vertikal antara titik (3, 4) dan (7, 7).",
          navTextBetweenVertical: "Ketuk “?” untuk melihat jawabannya.",
          questionTextDone:
            "Jarak vertikal antara titik (3, 4) dan (7, 7) adalah <gr>3 satuan</gr>.",
          navTextDone:
            "Ketuk » untuk mencari jarak antara titik-titik tersebut.",
          labelYellowAxis: "4 satuan",
          labelBlueAxis: "7 satuan",
          fadedHorizontalLabel: "4 satuan",
          verticalExprLeadingBlue: "7",
          verticalExprLeadingYellow: "4",
          verticalExprResult: "3 satuan",
        },
        3: {
          questionTextInitial:
            "Jarak horizontal dan vertikal antara titik-titik tersebut berturut-turut adalah <pr>4 satuan</pr> dan <gr>3 satuan</gr>.",
          navTextInitial:
            "Ketuk “?” untuk mencari jarak antara titik-titik tersebut.",
          questionTextTriangle:
            "Bangunannya berupa sebuah <y>segitiga</y>. Sebutkan jenis segitiganya.",
          navTextTriangle: "Ketuk segitiga untuk melihat jawabannya.",
          questionTextHypotenuse:
            "Ini adalah <y>segitiga siku-siku</y>. Sisi d adalah <y>hipotenusa</y>. Mari cari panjangnya.",
          navTextHypotenuse: "Ketuk “d” untuk mencari panjang hipotenusa.",
          horizontalLegLabel: "4 satuan",
          verticalLegLabel: "3 satuan",
        },
        4: {
          questionText: "Mari cari panjang hipotenusa.",
          navTextInitial: " ",
          navTextTapExpression: "Ketuk ekspresi untuk menyelesaikannya.",
          navTextTapPlus: 'Ketuk "+" untuk menyederhanakan ekspresi.',
          navTextTapToSimplify: "Ketuk ekspresi untuk menyederhanakannya.",
          navTextConclude: "Ketuk \u00BB untuk menyimpulkan.",
          calcTitle: "Menggunakan teorema Pythagoras,",
          hypLabel: "5 satuan",
        },
        5: {
          questionText:
            "Jarak antara titik (3, 4) dan (7, 7) adalah <pk>5 satuan</pk>.",
          navTextInitial: " ",
          navText: "Ketuk \u00BB untuk mencoba beberapa contoh lainnya.",
        },
      },
      practiceQuestions: [
        {
          title: "Soal 01",
          statement: "Tentukan jarak antara titik (2, 2) dan (8, 10).",
          x1: 2,
          y1: 2,
          x2: 8,
          y2: 10,
        },
        {
          title: "Soal 02",
          statement: "Tentukan jarak antara titik (4, 3) dan (8, 9).",
          x1: 4,
          y1: 3,
          x2: 8,
          y2: 9,
        },
        {
          title: "Soal 03",
          statement: "Tentukan jarak antara titik (3, 2) dan (9, 7).",
          x1: 3,
          y1: 2,
          x2: 9,
          y2: 7,
        },
        {
          qtype: "xy",
          title: "Soal 04",
          statement: "Tentukan jarak antara titik (x\u2081, y\u2081) dan (x\u2082, y\u2082).",
          x1: 3,
          y1: 4,
          x2: 8,
          y2: 9,
        },
      ],
      practiceCopy: {
        tapQ: "Ketuk “?” untuk melihat jawabannya.",
        tapNext: "Ketuk \u00BB untuk melanjut ke soal berikutnya",
        navLast:
          "Ketuk \u00BB untuk menyelesaikan aktivitas.",
        finalDistanceXy:
          "Jarak antara dua titik sembarang adalah {{FORMULA}}.",
        unitsWord: "satuan",
        shoutHorizontal:
          "Sebutkan jarak horizontal antara titik-titik tersebut.",
        shoutHorizontalXy:
          "Sebutkan jarak horizontal antara titik-titik tersebut.",
        xyAfterHorizontal:
          "Jarak horizontal adalah <bl>x\u2082</bl> \u2212 <yl>x\u2081</yl>. Sekarang, sebutkan jarak vertikalnya.",
        xyAfterVertical:
          "Jarak vertikal adalah <bl>y\u2082</bl> \u2212 <yl>y\u2081</yl>. Sekarang, tentukan jarak antara titik-titik tersebut.",
        xyAwaitHypAnim:
          "Jarak vertikal adalah <bl>y\u2082</bl> \u2212 <yl>y\u2081</yl>. Sekarang, tentukan jarak antara titik-titik tersebut.",
        afterHorizontal:
          "Jarak horizontal antara titik-titik tersebut adalah <pr>{{DX}} satuan</pr>. Sekarang, sebutkan jarak vertikalnya.",
        afterVertical:
          "Jarak vertikalnya adalah <gr>{{DY}} satuan</gr>. Sekarang, sebutkan jarak antara titik-titik tersebut.",
        finalDistance:
          "Jarak antara titik-titik tersebut adalah <pk>{{DIST}}</pk>.",
        continueButton: "Lanjut",
      },
      examplesNext: {
        heading: "Rumus Jarak",
        text: "<y>Contoh lainnya akan menyusul.</y><br><br>Gunakan Ulangi untuk menjelajahi lagi dari awal.",
        buttonText: "Ulangi",
      },
      final: {
        heading: "Rumus Jarak",
        text: "Kerja bagus menjelajahi jarak<br>di bidang koordinat.<br><br><y>Langkah berikutnya akan menyusul.</y>",
        buttonText: "Ulangi",
        imageSrc: null,
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
