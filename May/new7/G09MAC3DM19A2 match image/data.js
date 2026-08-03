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
        cw: "CW",
        acw: "ACW",
        xAxis: "x axis",
        yAxis: "y-axis",
        units: "units",
        xArrow: "x \u2192",
        yArrow: "y \u2192",
        start: "START",
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
      },
      graph: {
        xMin: -6,
        xMax: 9,
        yMin: -6,
        yMax: 6,
        object: [
          { x: 1, y: 1 },
          { x: 3, y: 1 },
          { x: 1, y: 4 },
        ],
        image: [
          { x: 5, y: -2 },
          { x: 5, y: -4 },
          { x: 8, y: -2 },
        ],
      },
      examples: [
        {
          image: [
            { x: 5, y: -2 },
            { x: 5, y: -4 },
            { x: 8, y: -2 },
          ],
          downTarget: -1,
          successPanel: "success",
          revealPanel: "reveal",
        },
        {
          image: [
            { x: 5, y: -1 },
            { x: 5, y: 1 },
            { x: 8, y: -1 },
          ],
          downTarget: -2,
          successPanel: "success2",
          revealPanel: "reveal2",
        },
        {
          mode: "free",
          raster: {
            href: "assets/tangram.png",
            center: { x: -2, y: -2 },
            width: 3,
            height: 3,
          },
          targetMatrix: [1, 0, 0, -1, 7, -5],
          successPanel: "success3",
          revealPanel: "reveal3",
        },
        {
          mode: "free",
          object: [
            { x: 1, y: 1 },
            { x: 3, y: 1 },
            { x: 1, y: 4 },
          ],
          image: [
            { x: 3, y: -1 },
            { x: 1, y: -1 },
            { x: 3, y: -4 },
          ],
          targetMatrix: [-1, 0, 0, -1, 4, 0],
          successPanel: "success3",
          revealPanel: "reveal3",
        },
        {
          mode: "free",
          object: [
            { x: 1, y: 2 },
            { x: 3, y: 2 },
            { x: 1, y: 5 },
          ],
          image: [
            { x: -4, y: -2 },
            { x: -6, y: -2 },
            { x: -4, y: 1 },
          ],
          targetMatrix: [-1, 0, 0, 1, -3, -4],
          successPanel: "success3",
          revealPanel: "reveal3",
        },
      ],
      panels: {
        start: {
          heading: "Series of Transformations",
          lines: [
            [{ text: "Let\u2019s use different transformations to move object into image." }],
            [{ text: "Tap START to begin!" }],
          ],
        },
        chooseRotate: {
          lines: [
            [{ text: "Let\u2019s use a series of transformations to map the object into the image." }],
            [
              { text: "Fix orientation first (" },
              { text: "rotate", color: "orange" },
              { text: "/" },
              { text: "reflect", color: "purple" },
              { text: "), then slide it into place (" },
              { text: "translate", color: "blue" },
              { text: ")." },
            ],
            [{ text: "Tap " }, { text: "Rotate", color: "orange" }, { text: "." }],
          ],
        },
        rotatePrompt: {
          lines: [
            [
              { text: "Rotate", color: "orange" },
              { text: " and check if the object and image have the same " },
              { text: "orientation", color: "yellow" },
              { text: "." },
            ],
            [
              { text: "Tap \u2018" },
              { text: "CW", color: "orange" },
              { text: "\u2019 to set the direction to " },
              { text: "clockwise", color: "orange" },
              { text: "." },
            ],
          ],
        },
        rotationDone: {
          lines: [
            [
              { text: "Rotating the object by " },
              { token: "rotationAmount", color: "orange" },
              { text: " about the origin aligned its orientation with the image.", color: "green" },
            ],
            [
              { text: "Let\u2019s " },
              { text: "translate", color: "blue" },
              { text: " the object into image." },
            ],
            [{ text: "Tap " }, { text: "Translate", color: "blue" }, { text: "." }],
          ],
        },
        translateRight: {
          lines: [
            [{ text: "Translate", color: "blue" }],
            [{ text: "the object into image." }],
            [
              { text: "Tap " },
              { text: "right-arrow", color: "blue" },
              { text: " to " },
              { text: "translate towards right", color: "blue" },
              { text: "." },
            ],
          ],
        },
        translateDown: {
          lines: [
            [{ text: "Translate", color: "blue" }],
            [{ text: "the object into image." }],
            [
              { text: "Tap " },
              { text: "down-arrow", color: "blue" },
              { text: " to " },
              { text: "translate downwards", color: "blue" },
              { text: "." },
            ],
          ],
        },
        success: {
          heading: "Transformation Successful!",
          lines: [
            [
              { text: "Orientation matched by " },
              { text: "rotation", color: "orange" },
              { text: "," },
            ],
            [
              { text: "position matched by " },
              { text: "translation", color: "blue" },
            ],
            [{ text: "Tap \u2018Reveal\u2019 to reveal the series of transformations." }],
          ],
        },
        reveal: {
          lines: [
            [{ text: "Let\u2019s try one more example." }],
            [{ text: "Tap Next" }],
          ],
        },
        rotatePrompt2: {
          lines: [
            [
              { text: "Rotate", color: "orange" },
              { text: " to match the orientation of object and the image." },
            ],
            [
              { text: "Tap \u2018" },
              { text: "CW", color: "orange" },
              { text: "\u2019 to set the direction to " },
              { text: "clockwise", color: "orange" },
              { text: "." },
            ],
          ],
        },
        wrongRotation: {
          lines: [
            [
              { text: "Rotating the object 90\u00b0 clockwise about the origin did not align its orientation with the image.", color: "pink" },
            ],
            [
              { text: "Let\u2019s " },
              { text: "flip", color: "purple" },
              { text: " the object and then " },
              { text: "rotate", color: "orange" },
              { text: " to align it with the image." },
            ],
            [{ text: "Tap Reset." }],
          ],
        },
        reflectIntro: {
          lines: [
            [
              { text: "Let\u2019s " },
              { text: "reflect", color: "purple" },
              { text: " the object across " },
              { text: "y-axis", color: "purple" },
              { text: " and check if object is aligned with the image." },
            ],
            [{ text: "Tap Reflect." }],
          ],
        },
        reflectPrompt: {
          lines: [
            [{ text: "Tap \u2018" }, { text: "y-axis", color: "purple" }, { text: "\u2019." }],
          ],
        },
        afterReflect: {
          lines: [
            [
              { text: "The object " },
              { text: "flipped", color: "purple" },
            ],
            [
              { text: "But the object is still not aligned with the image.", color: "pink" },
            ],
            [
              { text: "Now, " },
              { text: "rotate", color: "purple" },
              { text: " again and check if object aligns with the image." },
            ],
            [
              { text: "Rotate by 90\u00b0 clockwise about origin.", color: "purple" },
            ],
            [{ text: "Tap " }, { text: "Rotate", color: "purple" }, { text: "." }],
          ],
        },
        rotateAgainPrompt: {
          lines: [
            [
              { text: "Rotate by 90\u00b0 clockwise about origin." },
            ],
            [
              { text: "Tap \u2018" },
              { text: "CW", color: "orange" },
              { text: "\u2019 to set the direction to " },
              { text: "clockwise", color: "orange" },
              { text: "." },
            ],
          ],
        },
        rotateAgainDrag: {
          lines: [
            [
              { text: "Rotate by 90\u00b0 clockwise about origin." },
            ],
            [
              { text: "Drag the slider to rotate the object by 90\u00b0 Clockwise about origin." },
            ],
          ],
        },
        orientationDone2: {
          lines: [
            [
              { text: "Reflecting across " },
              { text: "y-axis", color: "purple" },
              { text: " then rotating the object by " },
              { text: "90\u00b0 clockwise", color: "orange" },
              { text: " about the origin aligned its orientation with the image.", color: "green" },
            ],
            [
              { text: "Let\u2019s " },
              { text: "translate", color: "blue" },
              { text: " the object into image." },
            ],
            [{ text: "Tap " }, { text: "Translate", color: "blue" }, { text: "." }],
          ],
        },
        success2: {
          heading: "Transformation Successful!",
          lines: [
            [
              { text: "Orientation matched by " },
              { text: "reflection", color: "purple" },
              { text: " then " },
              { text: "rotation", color: "orange" },
              { text: "," },
            ],
            [
              { text: "position matched by " },
              { text: "translation", color: "blue" },
            ],
            [{ text: "Tap \u2018Reveal\u2019 to reveal the series of transformations." }],
          ],
        },
        reveal2: {
          lines: [
            [{ text: "Tap Next" }],
          ],
        },
        freePlay: {
          lines: [
            [{ text: "Use the transformation buttons to overlap the object with the image." }],
          ],
        },
        success3: {
          heading: "Transformation Successful!",
          lines: [
            [{ text: "Tap Next" }],
          ],
        },
        reveal3: {
          lines: [
            [{ text: "Tap Next" }],
          ],
        },
        completed: {
          heading: "Activity Completed",
          lines: [
            [{ text: "Great job! You can now use series of transformation to match the object with the image." }],
            [{ text: "Tap \u2018START OVER\u2019 to repeat this activity." }],
          ],
        },
        step3Pending: {
          heading: "Next Step",
          lines: [
            [{ text: "The next step will be added here." }],
          ],
        },
      },
      history: {
        rotation: "Rotation: {angle}\u00b0 {direction} about origin",
        translation: "Translation: ({x}, {y})",
        reflectionX: "Reflection: about x-axis",
        reflectionY: "Reflection: across y-axis",
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
        cw: "CW",
        acw: "ACW",
        xAxis: "sumbu x",
        yAxis: "sumbu-y",
        units: "satuan",
        xArrow: "x \u2192",
        yArrow: "y \u2192",
        start: "MULAI",
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
      },
      graph: {
        xMin: -6,
        xMax: 9,
        yMin: -6,
        yMax: 6,
        object: [
          { x: 1, y: 1 },
          { x: 3, y: 1 },
          { x: 1, y: 4 },
        ],
        image: [
          { x: 5, y: -2 },
          { x: 5, y: -4 },
          { x: 8, y: -2 },
        ],
      },
      examples: [
        {
          image: [
            { x: 5, y: -2 },
            { x: 5, y: -4 },
            { x: 8, y: -2 },
          ],
          downTarget: -1,
          successPanel: "success",
          revealPanel: "reveal",
        },
        {
          image: [
            { x: 5, y: -1 },
            { x: 5, y: 1 },
            { x: 8, y: -1 },
          ],
          downTarget: -2,
          successPanel: "success2",
          revealPanel: "reveal2",
        },
        {
          mode: "free",
          raster: {
            href: "assets/tangram.png",
            center: { x: -2, y: -2 },
            width: 3,
            height: 3,
          },
          targetMatrix: [1, 0, 0, -1, 7, -5],
          successPanel: "success3",
          revealPanel: "reveal3",
        },
        {
          mode: "free",
          object: [
            { x: 1, y: 1 },
            { x: 3, y: 1 },
            { x: 1, y: 4 },
          ],
          image: [
            { x: 3, y: -1 },
            { x: 1, y: -1 },
            { x: 3, y: -4 },
          ],
          targetMatrix: [-1, 0, 0, -1, 4, 0],
          successPanel: "success3",
          revealPanel: "reveal3",
        },
        {
          mode: "free",
          object: [
            { x: 1, y: 2 },
            { x: 3, y: 2 },
            { x: 1, y: 5 },
          ],
          image: [
            { x: -4, y: -2 },
            { x: -6, y: -2 },
            { x: -4, y: 1 },
          ],
          targetMatrix: [-1, 0, 0, 1, -3, -4],
          successPanel: "success3",
          revealPanel: "reveal3",
        },
      ],
      panels: {
        start: {
          heading: "Rangkaian Transformasi",
          lines: [
            [{ text: "Mari gunakan beberapa transformasi untuk memindahkan objek ke bayangan." }],
            [{ text: "Ketuk MULAI untuk memulai!" }],
          ],
        },
        chooseRotate: {
          lines: [
            [{ text: "Mari gunakan rangkaian transformasi untuk memetakan objek ke bayangan." }],
            [
              { text: "Perbaiki orientasi terlebih dahulu (" },
              { text: "rotasi", color: "orange" },
              { text: "/" },
              { text: "refleksi", color: "purple" },
              { text: "), lalu geser ke posisinya (" },
              { text: "translasi", color: "blue" },
              { text: ")." },
            ],
            [{ text: "Ketuk " }, { text: "Rotasi", color: "orange" }, { text: "." }],
          ],
        },
        rotatePrompt: {
          lines: [
            [
              { text: "Rotasi", color: "orange" },
              { text: " dan periksa apakah objek dan bayangan memiliki " },
              { text: "orientasi", color: "yellow" },
              { text: " yang sama." },
            ],
            [
              { text: "Ketuk \u2018" },
              { text: "CW", color: "orange" },
              { text: "\u2019 untuk mengatur arah menjadi " },
              { text: "searah jarum jam", color: "orange" },
              { text: "." },
            ],
          ],
        },
        rotationDone: {
          lines: [
            [
              { text: "Memutar objek sebesar " },
              { token: "rotationAmount", color: "orange" },
              { text: " terhadap titik asal membuat orientasinya sejajar dengan bayangan.", color: "green" },
            ],
            [
              { text: "Mari " },
              { text: "translasi", color: "blue" },
              { text: " objek ke bayangan." },
            ],
            [{ text: "Ketuk " }, { text: "Translasi", color: "blue" }, { text: "." }],
          ],
        },
        translateRight: {
          lines: [
            [{ text: "Translasi", color: "blue" }],
            [{ text: "objek ke bayangan." }],
            [
              { text: "Ketuk " },
              { text: "panah kanan", color: "blue" },
              { text: " untuk " },
              { text: "translasi ke kanan", color: "blue" },
              { text: "." },
            ],
          ],
        },
        translateDown: {
          lines: [
            [{ text: "Translasi", color: "blue" }],
            [{ text: "objek ke bayangan." }],
            [
              { text: "Ketuk " },
              { text: "panah bawah", color: "blue" },
              { text: " untuk " },
              { text: "translasi ke bawah", color: "blue" },
              { text: "." },
            ],
          ],
        },
        success: {
          heading: "Transformasi Berhasil!",
          lines: [
            [
              { text: "Orientasi cocok dengan " },
              { text: "rotasi", color: "orange" },
              { text: "," },
            ],
            [
              { text: "posisi cocok dengan " },
              { text: "translasi", color: "blue" },
            ],
            [{ text: "Ketuk \u2018Tampilkan\u2019 untuk melihat rangkaian transformasi." }],
          ],
        },
        reveal: {
          lines: [
            [{ text: "Mari coba satu contoh lagi." }],
            [{ text: "Ketuk Lanjut" }],
          ],
        },
        rotatePrompt2: {
          lines: [
            [
              { text: "Rotasi", color: "orange" },
              { text: " untuk mencocokkan orientasi objek dan bayangan." },
            ],
            [
              { text: "Ketuk \u2018" },
              { text: "CW", color: "orange" },
              { text: "\u2019 untuk mengatur arah menjadi " },
              { text: "searah jarum jam", color: "orange" },
              { text: "." },
            ],
          ],
        },
        wrongRotation: {
          lines: [
            [
              { text: "Memutar objek 90\u00b0 searah jarum jam terhadap titik asal tidak membuat orientasinya sejajar dengan bayangan.", color: "pink" },
            ],
            [
              { text: "Mari " },
              { text: "balik", color: "purple" },
              { text: " objek lalu " },
              { text: "rotasi", color: "orange" },
              { text: " untuk menyelaraskannya dengan bayangan." },
            ],
            [{ text: "Ketuk Reset." }],
          ],
        },
        reflectIntro: {
          lines: [
            [
              { text: "Mari " },
              { text: "refleksi", color: "purple" },
              { text: " objek terhadap " },
              { text: "sumbu-y", color: "purple" },
              { text: " dan periksa apakah objek sejajar dengan bayangan." },
            ],
            [{ text: "Ketuk Refleksi." }],
          ],
        },
        reflectPrompt: {
          lines: [
            [{ text: "Ketuk \u2018" }, { text: "sumbu-y", color: "purple" }, { text: "\u2019." }],
          ],
        },
        afterReflect: {
          lines: [
            [
              { text: "Objek " },
              { text: "terbalik", color: "purple" },
            ],
            [
              { text: "Namun objek masih belum sejajar dengan bayangan.", color: "pink" },
            ],
            [
              { text: "Sekarang, " },
              { text: "rotasi", color: "purple" },
              { text: " lagi dan periksa apakah objek sejajar dengan bayangan." },
            ],
            [
              { text: "Rotasi 90\u00b0 searah jarum jam terhadap titik asal.", color: "purple" },
            ],
            [{ text: "Ketuk " }, { text: "Rotasi", color: "purple" }, { text: "." }],
          ],
        },
        rotateAgainPrompt: {
          lines: [
            [
              { text: "Rotasi 90\u00b0 searah jarum jam terhadap titik asal." },
            ],
            [
              { text: "Ketuk \u2018" },
              { text: "CW", color: "orange" },
              { text: "\u2019 untuk mengatur arah menjadi " },
              { text: "searah jarum jam", color: "orange" },
              { text: "." },
            ],
          ],
        },
        rotateAgainDrag: {
          lines: [
            [
              { text: "Rotasi 90\u00b0 searah jarum jam terhadap titik asal." },
            ],
            [
              { text: "Seret slider untuk memutar objek 90\u00b0 searah jarum jam terhadap titik asal." },
            ],
          ],
        },
        orientationDone2: {
          lines: [
            [
              { text: "Refleksi terhadap " },
              { text: "sumbu-y", color: "purple" },
              { text: " lalu memutar objek " },
              { text: "90\u00b0 searah jarum jam", color: "orange" },
              { text: " terhadap titik asal membuat orientasinya sejajar dengan bayangan.", color: "green" },
            ],
            [
              { text: "Mari " },
              { text: "translasi", color: "blue" },
              { text: " objek ke bayangan." },
            ],
            [{ text: "Ketuk " }, { text: "Translasi", color: "blue" }, { text: "." }],
          ],
        },
        success2: {
          heading: "Transformasi Berhasil!",
          lines: [
            [
              { text: "Orientasi cocok dengan " },
              { text: "refleksi", color: "purple" },
              { text: " lalu " },
              { text: "rotasi", color: "orange" },
              { text: "," },
            ],
            [
              { text: "posisi cocok dengan " },
              { text: "translasi", color: "blue" },
            ],
            [{ text: "Ketuk \u2018Tampilkan\u2019 untuk melihat rangkaian transformasi." }],
          ],
        },
        reveal2: {
          lines: [
            [{ text: "Ketuk Lanjut" }],
          ],
        },
        freePlay: {
          lines: [
            [{ text: "Gunakan tombol transformasi untuk menumpuk objek dengan bayangan." }],
          ],
        },
        success3: {
          heading: "Transformasi Berhasil!",
          lines: [
            [{ text: "Ketuk Lanjut" }],
          ],
        },
        reveal3: {
          lines: [
            [{ text: "Ketuk Lanjut" }],
          ],
        },
        completed: {
          heading: "Aktivitas Selesai",
          lines: [
            [{ text: "Bagus! Sekarang kamu dapat menggunakan rangkaian transformasi untuk mencocokkan objek dengan bayangan." }],
            [{ text: "Ketuk \u2018MULAI LAGI\u2019 untuk mengulang aktivitas ini." }],
          ],
        },
        step3Pending: {
          heading: "Langkah Berikutnya",
          lines: [
            [{ text: "Langkah berikutnya akan ditambahkan di sini." }],
          ],
        },
      },
      history: {
        rotation: "Rotasi: {angle}\u00b0 {direction} terhadap titik asal",
        translation: "Translasi: ({x}, {y})",
        reflectionX: "Refleksi: terhadap sumbu-x",
        reflectionY: "Refleksi: terhadap sumbu-y",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
