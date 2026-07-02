const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Reflection of a Point",
        text:
          "We saw that when a point is reflected across the x-axis,<br> its image appears on the <y>opposite side</y> – at the <y>same distance</y> from the line.<br><br>Now try it yourself and see where the image lands.",
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
          calloutProp2B: "Locating the image at the same distance on the other side",
          doneText: "We have found the image using properties of reflection.",
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
        text:
          "Kita melihat bahwa ketika sebuah titik direfleksikan melintasi sumbu-x, bayangannya muncul di <y>sisi berlawanan</y> – pada <y>jarak yang sama</y> dari garis.<br>Sekarang coba sendiri dan lihat di mana bayangannya berada.",
        buttonText: "MULAI",
      },
      steps: {
        1: {
          topText:
            "Mari plot titik A(2, 4) dan temukan koordinat bayangannya setelah refleksi melintasi sumbu-x.",
          navText: "Ketuk » untuk mulai memplot detail yang diberikan.",
        },
        2: {
          rightText: "Plot Titik <y>A(2, 4)</y>",
          navTextInitial: "Ketuk bidang kartesius untuk memplot titik.",
          navTextRetry: "Ketuk lagi bidang kartesius untuk memplot titik.",
          feedbackWrong: "Ups!<br>Itu tidak benar.",
          feedbackCorrect: "Bagus!<br>Kamu memplot titik A dengan benar.",
        },
        3: {
          rightText: "Plot <y>garis refleksi</y>",
          navText: "Ketuk 'sumbu-x' untuk menyorot garis refleksi.",
          reflectionLabel: "Garis refleksi: sumbu-x",
        },
        4: {
          rightTextInitial:
            "Mari cari jarak titik A dari garis refleksi.",
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
          navTextDone: "Ketuk » untuk menemukan koordinat bayangan.",
          property1Title: "Sifat 1",
          property1Text:
            "Garis yang menghubungkan titik dan bayangannya <cy>tegak lurus terhadap garis refleksi</cy>.",
          property2Title: "Sifat 2",
          property2Text:
            "Titik dan bayangannya berada pada <cy>jarak yang sama</cy> dari garis refleksi.",
          calloutProp1: "Bayangan harus berada di sepanjang garis ini",
          calloutProp2A: "Titik A berjarak 4 satuan dari garis refleksi",
          calloutProp2B: "Menentukan bayangan pada jarak yang sama di sisi lain",
          doneText: "Kita telah menemukan bayangan menggunakan sifat-sifat refleksi.",
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
