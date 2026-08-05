const DATA = {
  en: {
    app: {
      labels: {
        object: "Object",
        image: "Image",
        transformationsList: "Transformations list",
        rotate: "Rotate",
        reflect: "Reflect",
        translate: "Translate",
        dilate: "Dilate",
        scaleFactor: "Scale factor (k)",
        dilateAboutOrigin: "Dilate about origin",
        dilateAboutVertex: "Dilate about vertex",
        cw: "CW",
        acw: "ACW",
        xAxis: "x axis",
        yAxis: "y-axis",
        units: "units",
        xArrow: "x \u2192",
        yArrow: "y \u2192",
        start: "Start",
        reveal: "Reveal",
        next: "Next",
        reset: "Reset",
        startOver: "START OVER",
        clockwise: "clockwise",
        anticlockwise: "anticlockwise",
        clockwiseTitle: "Clockwise",
        anticlockwiseTitle: "Anticlockwise",
        aboutOrigin: "about origin",
        up: "translate upward",
        down: "translate downward",
        left: "translate left",
        right: "translate right",
        axisX: "X",
        axisXPrime: "X\u2019",
        axisY: "Y",
        axisYPrime: "Y\u2019",
        origin: "O",
        dilateFirstThenTranslate: "Dilate first, then translate it.",
        translateFirstThenDilate: "Translate first, then dilate it.",
      },
      graph: {
        xMin: -13,
        xMax: 13,
        yMin: -9,
        yMax: 9,
        object: [
          { x: 1, y: -1 },
          { x: 1, y: -3 },
          { x: 4, y: -3 },
        ],
        image: [
          { x: -8, y: 7 },
          { x: -8, y: 1 },
          { x: 1, y: 1 },
        ],
        correctScale: 3,
        correctTranslation: { x: -11, y: 10 },
        rightAngleIndex: 1,
      },
      panels: {
        step1: {
          lines: [
            [
              {
                text: "The blue figure is the image obtained by transforming the orange figure.",
              },
            ],
            [
              {
                text: "Describe the sequence of transformations applied to the orange figure to obtain the blue figure.",
              },
            ],
          ],
          footer: "Tap \u2018Start\u2019 to begin.",
        },
        step2: {
          title: "This transformation can be performed in two ways:",
          footer: "Tap a way.",
        },
        stepA3: {
          lines: [
            [
              {
                text: "Resize the figure to the correct size (dilate), then slide it into place (translate).",
              },
            ],
          ],
          footer: "Tap Dilate.",
        },
        dilateOptions: {
          lines: [
            [
              {
                text: "During a dilation, each vertex moves along a line passing through the center of dilation. So, let\u2019s first choose the center of dilation.",
              },
            ],
          ],
          footer: "Tap a button to choose.",
        },
        dilateVertexPick: {
          lines: [
            [{ text: "Now choose any vertex as center of dilation." }],
          ],
          footer: "Tap to choose a vertex.",
        },
        dilateSlider: {
          lines: [
            [
              {
                text: "Next, choose a scale factor to increase or decrease the size of the orange figure.",
              },
            ],
          ],
          footer: "Drag the slider to choose a scale factor.",
        },
        dilateSuccess: {
          lines: [
            [{ text: "Dilation Successful!", color: "green" }],
            [{ text: "Now translate the figure." }],
          ],
          footer: "Tap Translate.",
        },
        translateActive: {
          lines: [
            [{ text: "Translate the object into image." }],
          ],
          footer: "Tap the arrows to translate.",
        },
        translateSuccess: {
          heading: "Transformation Successful!",
          lines: [
            [
              {
                text: "Size matched by dilation, position matched by translation",
              },
            ],
          ],
          footer: "",
        },
        stepB3: {
          lines: [
            [
              {
                text: "Slide it into place (translate), then resize the figure to the correct size (dilate).",
              },
            ],
          ],
          footer: "Tap Translate.",
        },
        translateBActive: {
          lines: [
            [
              {
                text: "Translate the figure so that one of its vertices coincides with the corresponding vertex of the blue figure.",
              },
            ],
          ],
          footer: "Tap the arrows to translate.",
        },
        translateBSuccess: {
          lines: [
            [{ text: "Now, perform the next transformation to resize." }],
          ],
          footer: "",
        },
        dilateBIntro: {
          lines: [
            [
              {
                text: "Resize the figure to the correct size (dilate).",
              },
            ],
          ],
          footer: "Tap Dilate.",
        },
        dilateBSlider: {
          lines: [
            [
              {
                text: "Choose a scale factor to increase or decrease the size of the figure.",
              },
            ],
          ],
          footer: "Drag the slider to choose a scale factor.",
        },
        dilateBSuccess: {
          lines: [
            [{ text: "Dilation Successful!", color: "green" }],
          ],
          footer: "",
        },
        translateSuccessB: {
          heading: "Transformation Successful!",
          lines: [
            [
              {
                text: "Position matched by translation, size matched by dilation",
              },
            ],
          ],
          footer: "",
        },
        revealPanel: {
          heading: "Transformation Successful!",
          lines: [
            [{ text: "Tap \u2018Next\u2019 to see the other way." }],
          ],
        },
        step4: {
          heading: "Next Step",
          lines: [
            [{ text: "Step 4 will be added here." }],
          ],
          footer: "",
        },
      },
      history: {
        dilation: "Dilation: Scale factor of {k} about the origin.",
        dilationVertex: "Dilation: Scale factor of {k} about vertex ({x}, {y}).",
        translation: "Translation: ({x}, {y})",
      },
    },
  },
  id: {
    app: {
      labels: {
        object: "Objek",
        image: "Bayangan",
        transformationsList: "Daftar transformasi",
        rotate: "Rotasi",
        reflect: "Refleksi",
        translate: "Translasi",
        dilate: "Dilatasi",
        scaleFactor: "Faktor skala (k)",
        dilateAboutOrigin: "Dilatasi terhadap titik asal",
        dilateAboutVertex: "Dilatasi terhadap titik sudut",
        cw: "CW",
        acw: "ACW",
        xAxis: "sumbu x",
        yAxis: "sumbu-y",
        units: "satuan",
        xArrow: "x \u2192",
        yArrow: "y \u2192",
        start: "Mulai",
        reveal: "Tampilkan",
        next: "Lanjut",
        reset: "Reset",
        startOver: "MULAI LAGI",
        clockwise: "searah jarum jam",
        anticlockwise: "berlawanan arah jarum jam",
        clockwiseTitle: "Searah jarum jam",
        anticlockwiseTitle: "Berlawanan arah jarum jam",
        aboutOrigin: "terhadap titik asal",
        up: "translasi ke atas",
        down: "translasi ke bawah",
        left: "translasi ke kiri",
        right: "translasi ke kanan",
        axisX: "X",
        axisXPrime: "X\u2019",
        axisY: "Y",
        axisYPrime: "Y\u2019",
        origin: "O",
        dilateFirstThenTranslate: "Dilatasi dulu, lalu translasi.",
        translateFirstThenDilate: "Translasi dulu, lalu dilatasi.",
      },
      graph: {
        xMin: -13,
        xMax: 13,
        yMin: -9,
        yMax: 9,
        object: [
          { x: 1, y: -1 },
          { x: 1, y: -3 },
          { x: 4, y: -3 },
        ],
        image: [
          { x: -8, y: 7 },
          { x: -8, y: 1 },
          { x: 1, y: 1 },
        ],
        correctScale: 3,
        correctTranslation: { x: -11, y: 10 },
        rightAngleIndex: 1,
      },
      panels: {
        step1: {
          lines: [
            [
              {
                text: "Gambar biru adalah bayangan yang diperoleh dengan mentransformasikan gambar oranye.",
              },
            ],
            [
              {
                text: "Jelaskan rangkaian transformasi yang diterapkan pada gambar oranye untuk memperoleh gambar biru.",
              },
            ],
          ],
          footer: "Ketuk \u2018Mulai\u2019 untuk memulai.",
        },
        step2: {
          title: "Transformasi ini dapat dilakukan dengan dua cara:",
          footer: "Ketuk salah satu cara.",
        },
        stepA3: {
          lines: [
            [
              {
                text: "Ubah ukuran gambar ke ukuran yang benar (dilatasi), lalu geser ke posisinya (translasi).",
              },
            ],
          ],
          footer: "Ketuk Dilatasi.",
        },
        dilateOptions: {
          lines: [
            [
              {
                text: "Selama dilatasi, setiap titik sudut bergerak sepanjang garis yang melalui pusat dilatasi. Jadi, mari pilih pusat dilatasi terlebih dahulu.",
              },
            ],
          ],
          footer: "Ketuk tombol untuk memilih.",
        },
        dilateVertexPick: {
          lines: [
            [{ text: "Sekarang pilih salah satu titik sudut sebagai pusat dilatasi." }],
          ],
          footer: "Ketuk untuk memilih titik sudut.",
        },
        dilateSlider: {
          lines: [
            [
              {
                text: "Selanjutnya, pilih faktor skala untuk memperbesar atau memperkecil gambar oranye.",
              },
            ],
          ],
          footer: "Seret slider untuk memilih faktor skala.",
        },
        dilateSuccess: {
          lines: [
            [{ text: "Dilatasi Berhasil!", color: "green" }],
            [{ text: "Sekarang translasi gambarnya." }],
          ],
          footer: "Ketuk Translasi.",
        },
        translateActive: {
          lines: [
            [{ text: "Translasi objek ke bayangan." }],
          ],
          footer: "Ketuk panah untuk mentranslasi.",
        },
        translateSuccess: {
          heading: "Transformasi Berhasil!",
          lines: [
            [
              {
                text: "Ukuran cocok dengan dilatasi, posisi cocok dengan translasi",
              },
            ],
          ],
          footer: "",
        },
        stepB3: {
          lines: [
            [
              {
                text: "Geser ke posisinya (translasi), lalu ubah ukuran gambar ke ukuran yang benar (dilatasi).",
              },
            ],
          ],
          footer: "Ketuk Translasi.",
        },
        translateBActive: {
          lines: [
            [
              {
                text: "Translasi gambar sehingga salah satu titik sudutnya bertepatan dengan titik sudut yang sesuai pada gambar biru.",
              },
            ],
          ],
          footer: "Ketuk panah untuk mentranslasi.",
        },
        translateBSuccess: {
          lines: [
            [{ text: "Sekarang, lakukan transformasi berikutnya untuk mengubah ukuran." }],
          ],
          footer: "",
        },
        dilateBIntro: {
          lines: [
            [
              {
                text: "Ubah ukuran gambar ke ukuran yang benar (dilatasi).",
              },
            ],
          ],
          footer: "Ketuk Dilatasi.",
        },
        dilateBSlider: {
          lines: [
            [
              {
                text: "Pilih faktor skala untuk memperbesar atau memperkecil gambar.",
              },
            ],
          ],
          footer: "Seret slider untuk memilih faktor skala.",
        },
        dilateBSuccess: {
          lines: [
            [{ text: "Dilatasi Berhasil!", color: "green" }],
          ],
          footer: "",
        },
        translateSuccessB: {
          heading: "Transformasi Berhasil!",
          lines: [
            [
              {
                text: "Posisi cocok dengan translasi, ukuran cocok dengan dilatasi",
              },
            ],
          ],
          footer: "",
        },
        revealPanel: {
          heading: "Transformasi Berhasil!",
          lines: [
            [{ text: "Ketuk \u2018Lanjut\u2019 untuk melihat cara lainnya." }],
          ],
        },
        step4: {
          heading: "Langkah Berikutnya",
          lines: [
            [{ text: "Langkah 4 akan ditambahkan di sini." }],
          ],
          footer: "",
        },
      },
      history: {
        dilation: "Dilatasi: Faktor skala {k} terhadap titik asal.",
        dilationVertex: "Dilatasi: Faktor skala {k} terhadap titik sudut ({x}, {y}).",
        translation: "Translasi: ({x}, {y})",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
