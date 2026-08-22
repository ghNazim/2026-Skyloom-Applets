const DATA = {
  en: {
    app: {
      title: "Finding Unknown Coordinates",
      question: {
        full: '<span id="highlight-abc" class="orange-bg">Triangle ABC has vertices <span id="source-a">A(4, 1)</span>, <span id="source-b">B(0, 2)</span>, and <span id="source-c">C(2, 4)</span></span>. <span id="highlight-qr" class="cyan-bg">Triangle PQR has two vertices with coordinates <span id="source-q">Q(-4, 1)</span> and <span id="source-r">R(-2, -1)</span></span>. <span id="highlight-find-p" class="purple-bg">For the two triangles to be congruent, where should the coordinates of the unknown vertex <span id="source-p">P</span> be?</span>',
        plain:
          "Triangle ABC has vertices A(4, 1), B(0, 2), and C(2, 4). Triangle PQR has two vertices with coordinates Q(-4, 1) and R(-2, -1). For the two triangles to be congruent, where should the coordinates of the unknown vertex P be?",
        solve: "Let’s find P(x,y) so that △ PQR ≅ △ ABC",
      },
      graph: {
        labels: {
          A: "A(4, 1)",
          B: "B(0, 2)",
          C: "C(2, 4)",
          Q: "Q(-4, 1)",
          R: "R(-2, -1)",
          P: "P(x,y)",
        },
        coords: {
          A: { x: 4, y: 1 },
          B: { x: 0, y: 2 },
          C: { x: 2, y: 4 },
          Q: { x: -4, y: 1 },
          R: { x: -2, y: -1 },
          PStart: { x: -5, y: -4 },
        },
        coordText: {
          A: { x: "4", y: "1" },
          B: { x: "0", y: "2" },
          C: { x: "2", y: "4" },
          Q: { x: "-4", y: "1" },
          R: { x: "-2", y: "-1" },
        },
      },
      steps: {
        1: {
          navText: "Tap » to identify the ‘given’ information.",
        },
        2: {
          navTextDone: "Tap » to identify the ‘given’ information.",
        },
        3: {
          navTextDone: "Tap » to identify what you need to find.",
        },
        4: {
          navTextDone: "Tap » to solve the problem step by step.",
        },
        5: {
          navIntro: "Tap ‘Find side lengths’.",
          navQr: "Tap side QR to find its length.",
          navSimplify: "Tap the highlighted text to simplify.",
          navDone: "Tap » to find the lengths of all the sides of △ ABC.",
        },
        6: {
          navAb: "Tap side AB to find its length.",
          navBc: "Tap side BC to find its length.",
          navAc: "Tap side AC to find its length.",
          navSimplify: "Tap the highlighted text to simplify.",
          navDone: "Tap » to find correspondence between the triangles",
        },
        7: {
          navPrompt: "Tap the side in △ABC that corresponds to QR.",
          navDone: "Tap » to visualise.",
          intro: "Now we can clearly see one pair of corresponding sides.",
          promptBox: "Can you spot the side corresponding to QR in △ABC?",
          belowText:
            "Since QR corresponds to BC, let's transform △ABC so that BC overlaps QR.",
        },
        8: {
          navText:
            " ",
          navDone:
            "Tap » to transform △ABC into △PQR so that BC overlaps QR.",
          belowText:
            "Let's use transformations to determine the coordinates of P.",
        },
        9: {
          navIntro: "Tap rotate.",
          navSlider: "Use slider to rotate the triangle",
          navDone:
            "Tap » to align the rotated triangle so that BC coincides with QR.",
          belowText: "Fix orientation first so that BC coincides with QR.",
          rotateButton: "Rotate",
          rotateTitle:
            "Rotate △ABC about the origin until side BC coincides with side QR.",
        },
        10: {
          navIntro: "Tap ‘Translate’.",
          navControls: "Tap arrows to move the triangle.",
          navDone: "Tap » to find another possible position for vertex P.",
          belowText:
            "Rotation aligned the orientation.\nNow, translate the triangle.",
          translateButton: "Translate",
          translateTitle: "Translate △ABC so that BC ↔ QR",
        },
        11: {
          navIntro: "Tap ‘Reflect’.",
          navDone: "Tap » to find another possible position for vertex P.",
          belowText:
            "A triangle can also lie on the opposite side of the same base.\nReflect △PQR across line QR.",
          reflectButton: "Reflect",
          resultIntro: "△PQR is reflected across line QR.",
          resultOr: "or",
          resultPPrefix: "P(x, y) = ",
        },
        12: {
          navDone: "Tap » to find another possible position for vertex P.",
          belowText:
            "We can swap the matching side lengths: PQ = √13 and PR = √17.\n\nThen P sits in a different place.",
        },
        13: {
          navDone: "Tap » to transform △ABC into △PQR.",
          belowText:
            "Let's use these values of PQ and PR to transform the triangle and determine the coordinates of P.",
        },
      },
      labels: {
        cw: "CW",
        acw: "ACW",
        xArrow: "x →",
        yArrow: "y →",
        units: "units",
        translate: "Translate",
        up: "Up",
        down: "Down",
        left: "Left",
        right: "Right",
      },
      rightPanel: {
        congruentProperty:
          "When two triangles are congruent, their corresponding side lengths are equal.",
        useProperty: "Let’s use this property to find unknown coordinates",
        findButton: "Find side lengths",
        distanceTitle: "Distance formula",
      },
      math: {
        qr: "QR",
        ab: "AB",
        bc: "BC",
        ac: "AC",
        distanceVariable: "d",
        rootEight: "8",
        rootSeventeen: "17",
        rootThirteen: "13",
        expandedTerms: {
          x2: "-4",
          x1: "(-2)",
          y2: "1",
          y1: "(-1)",
        },
        simplified: "QR = √[(-2)² + (2)²]",
        rootResult: "QR = √8",
        sideCalcs: {
          AB: {
            label: "AB",
            expandedTerms: { x2: "4", x1: "0", y2: "1", y1: "2" },
            simplifiedDisplay: "[(4)² + (-1)²]",
            rootValue: "17",
          },
          BC: {
            label: "BC",
            expandedTerms: { x2: "2", x1: "0", y2: "4", y1: "2" },
            simplifiedDisplay: "[(2)² + (2)²]",
            rootValue: "8",
          },
          AC: {
            label: "AC",
            expandedTerms: { x2: "4", x1: "2", y2: "1", y1: "4" },
            simplifiedDisplay: "[(2)² + (-3)²]",
            rootValue: "13",
          },
        },
      },
      aria: {
        squareRootExpression: "square root expression",
        squareRootOf: "square root of",
      },
      colors: {
        object: "#fb9b5b",
        image: "#46c5ce",
        transformation: "#bd78dd",
        unknown: "#a9a9a9",
      },
    },
  },
  id: {
    app: {
      title: "Mencari Koordinat yang Belum Diketahui",
      question: {
        full: '<span id="highlight-abc" class="orange-bg">Segitiga ABC memiliki titik sudut <span id="source-a">A(4, 1)</span>, <span id="source-b">B(0, 2)</span>, dan <span id="source-c">C(2, 4)</span></span>. <span id="highlight-qr" class="cyan-bg">Segitiga PQR memiliki dua titik sudut dengan koordinat <span id="source-q">Q(-4, 1)</span> dan <span id="source-r">R(-2, -1)</span></span>. <span id="highlight-find-p" class="purple-bg">Agar kedua segitiga kongruen, di mana koordinat titik sudut <span id="source-p">P</span> yang belum diketahui?</span>',
        plain:
          "Segitiga ABC memiliki titik sudut A(4, 1), B(0, 2), dan C(2, 4). Segitiga PQR memiliki dua titik sudut dengan koordinat Q(-4, 1) dan R(-2, -1). Agar kedua segitiga kongruen, di mana koordinat titik sudut P yang belum diketahui?",
        solve: "Mari cari P(x,y) sehingga △ PQR ≅ △ ABC",
      },
      graph: {
        labels: {
          A: "A(4, 1)",
          B: "B(0, 2)",
          C: "C(2, 4)",
          Q: "Q(-4, 1)",
          R: "R(-2, -1)",
          P: "P(x,y)",
        },
        coords: {
          A: { x: 4, y: 1 },
          B: { x: 0, y: 2 },
          C: { x: 2, y: 4 },
          Q: { x: -4, y: 1 },
          R: { x: -2, y: -1 },
          PStart: { x: -5, y: -4 },
        },
        coordText: {
          A: { x: "4", y: "1" },
          B: { x: "0", y: "2" },
          C: { x: "2", y: "4" },
          Q: { x: "-4", y: "1" },
          R: { x: "-2", y: "-1" },
        },
      },
      steps: {
        1: {
          navText: "Ketuk » untuk mengidentifikasi informasi yang diberikan.",
        },
        2: {
          navTextDone:
            "Ketuk » untuk mengidentifikasi informasi yang diberikan.",
        },
        3: {
          navTextDone: "Ketuk » untuk mengidentifikasi apa yang perlu dicari.",
        },
        4: {
          navTextDone: "Ketuk » untuk menyelesaikan soal langkah demi langkah.",
        },
        5: {
          navIntro: "Ketuk ‘Cari panjang sisi’.",
          navQr: "Ketuk sisi QR untuk mencari panjangnya.",
          navSimplify: "Ketuk teks yang disorot untuk menyederhanakan.",
          navDone: "Ketuk » untuk mencari panjang semua sisi △ ABC.",
        },
        6: {
          navAb: "Ketuk sisi AB untuk mencari panjangnya.",
          navBc: "Ketuk sisi BC untuk mencari panjangnya.",
          navAc: "Ketuk sisi AC untuk mencari panjangnya.",
          navSimplify: "Ketuk teks yang disorot untuk menyederhanakan.",
          navDone:
            "Ketuk » untuk menemukan korespondensi antara kedua segitiga",
        },
        7: {
          navPrompt: "Ketuk sisi pada △ABC yang bersesuaian dengan QR.",
          navDone: "Ketuk » untuk memvisualisasikan.",
          intro:
            "Sekarang kita dapat melihat dengan jelas satu pasangan sisi yang bersesuaian.",
          promptBox:
            "Dapatkah kamu menemukan sisi yang bersesuaian dengan QR pada △ABC?",
          belowText:
            "Karena QR bersesuaian dengan BC, mari transformasikan △ABC sehingga BC berimpit dengan QR.",
        },
        8: {
          navText:
            "Ketuk » untuk mentransformasikan △ABC menjadi △PQR sehingga BC berimpit dengan QR.",
          navDone:
            "Ketuk » untuk mentransformasikan △ABC menjadi △PQR sehingga BC berimpit dengan QR.",
          belowText:
            "Mari gunakan transformasi untuk menentukan koordinat P.",
        },
        9: {
          navIntro: "Ketuk rotate.",
          navSlider: "Gunakan penggeser untuk memutar segitiga",
          navDone:
            "Ketuk » untuk menggeser segitiga yang sudah diputar agar BC berimpit dengan QR.",
          belowText:
            "Perbaiki orientasi terlebih dahulu agar BC berimpit dengan QR.",
          rotateButton: "Rotate",
          rotateTitle:
            "Putar △ABC terhadap titik asal hingga sisi BC berimpit dengan sisi QR.",
        },
        10: {
          navIntro: "Ketuk ‘Translate’.",
          navControls: "Ketuk panah untuk menggerakkan segitiga.",
          navDone:
            "Ketuk » untuk mencari kemungkinan posisi lain untuk titik P.",
          belowText:
            "Rotasi telah menyelaraskan orientasi.\nSekarang, translasi kan segitiga.",
          translateButton: "Translate",
          translateTitle: "Translasi △ABC sehingga BC ↔ QR",
        },
        11: {
          navIntro: "Ketuk ‘Reflect’.",
          navDone:
            "Ketuk » untuk mencari kemungkinan posisi lain untuk titik P.",
          belowText:
            "Sebuah segitiga juga dapat berada di sisi berlawanan dari alas yang sama.\nRefleksikan △PQR terhadap garis QR.",
          reflectButton: "Reflect",
          resultIntro: "△PQR direfleksikan terhadap garis QR.",
          resultOr: "atau",
          resultPPrefix: "P(x, y) = ",
        },
        12: {
          navDone:
            "Ketuk » untuk mencari kemungkinan posisi lain untuk titik P.",
          belowText:
            "Kita dapat menukar panjang sisi yang bersesuaian: PQ = √13 dan PR = √17.\n\nMaka P berada di tempat yang berbeda.",
        },
        13: {
          navDone: "Ketuk » untuk mentransformasikan △ABC menjadi △PQR.",
          belowText:
            "Mari gunakan nilai PQ dan PR ini untuk mentransformasikan segitiga dan menentukan koordinat P.",
        },
      },
      labels: {
        cw: "CW",
        acw: "ACW",
        xArrow: "x →",
        yArrow: "y →",
        units: "satuan",
        translate: "Translate",
        up: "Atas",
        down: "Bawah",
        left: "Kiri",
        right: "Kanan",
      },
      rightPanel: {
        congruentProperty:
          "Ketika dua segitiga kongruen, panjang sisi-sisi yang bersesuaian sama.",
        useProperty:
          "Mari gunakan sifat ini untuk mencari koordinat yang belum diketahui",
        findButton: "Cari panjang sisi",
        distanceTitle: "Rumus jarak",
      },
      math: {
        qr: "QR",
        ab: "AB",
        bc: "BC",
        ac: "AC",
        distanceVariable: "d",
        rootEight: "8",
        rootSeventeen: "17",
        rootThirteen: "13",
        expandedTerms: {
          x2: "-4",
          x1: "(-2)",
          y2: "1",
          y1: "(-1)",
        },
        simplified: "QR = √[(-2)² + (2)²]",
        rootResult: "QR = √8",
        sideCalcs: {
          AB: {
            label: "AB",
            expandedTerms: { x2: "4", x1: "0", y2: "1", y1: "2" },
            simplifiedDisplay: "[(4)² + (-1)²]",
            rootValue: "17",
          },
          BC: {
            label: "BC",
            expandedTerms: { x2: "2", x1: "0", y2: "4", y1: "2" },
            simplifiedDisplay: "[(2)² + (2)²]",
            rootValue: "8",
          },
          AC: {
            label: "AC",
            expandedTerms: { x2: "4", x1: "2", y2: "1", y1: "4" },
            simplifiedDisplay: "[(2)² + (-3)²]",
            rootValue: "13",
          },
        },
      },
      aria: {
        squareRootExpression: "ekspresi akar kuadrat",
        squareRootOf: "akar kuadrat dari",
      },
      colors: {
        object: "#fb9b5b",
        image: "#46c5ce",
        transformation: "#bd78dd",
        unknown: "#a9a9a9",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
