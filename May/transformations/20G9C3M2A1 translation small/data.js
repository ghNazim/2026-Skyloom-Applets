const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Properties of Translation",
        text:
          "Let\u2019s explore the properties of a translation.<br><br>Click START to begin!",
        buttonText: "START",
      },
      finish: {
        heading: "Activity Completed!",
        text:
          "In a translation,<br><r>Position changes</r><g>Shape remains same</g><g>Size remains same</g><g>Orientation remains same</g>",
        buttonText: "START OVER",
      },
      steps: {
        1: {
          navTextTapShape: "Tap the shape!",
          navTextNext: "Tap \u00bb to see properties of translation",
          sameDistance: "same distance",
          sameDirection: "same direction",
          labelPreimage: "Pre-image",
          labelImage: "Image",
          textPreimage:
            "The original figure before the translation is called <y>Pre-image</y>.<br>Pre-image points are usually named using capital letters such as <y>A, B, C</y>, and so on.",
          textImage:
            "The final figure after the translation is called <y>Image</y>.<br><br>Image points are usually named using the same letters with a <y>prime symbol</y>, such as <y>A\u2032, B\u2032, C\u2032</y>, and so on.",
        },
        2: {
          labelPreimage: "Pre-image",
          labelImage: "Image",
          feedbackSize:
            "It fits perfectly!<br>In a translation, the size remains the same.",
          feedbackShape:
            "All corresponding side lengths and angles are equal!<br>In a translation, the shape stays the same.",
          feedbackPosition:
            "Clearly, the position of the points has changed.<br>In a translation, the position changes.",
          feedbackOrientation:
            "Every point moves the same distance in the same direction.<br>In a translation, orientation stays the same.",
          positionCalloutOriginal:
            "Original position of a<br>point on the figure",
          positionCalloutFinal: "Final position of the<br>same point",
        },
      },
      properties: {
        size: { label: "Size" },
        shape: { label: "Shape" },
        position: { label: "Position" },
        orientation: { label: "Orientation" },
      },
      navigation2: {
        summarize: "Summarize",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Sifat-sifat Translasi",
        text:
          "Mari kita jelajahi sifat-sifat translasi.<br><br>Klik MULAI untuk memulai!",
        buttonText: "MULAI",
      },
      finish: {
        heading: "Aktivitas Selesai!",
        text:
          "Dalam translasi,<br><r>Posisi berubah</r><g>Bentuk tetap sama</g><g>Ukuran tetap sama</g><g>Orientasi tetap sama</g>",
        buttonText: "MULAI LAGI",
      },
      steps: {
        1: {
          navTextTapShape: "Ketuk bentuknya!",
          navTextNext: "Ketuk \u00bb untuk melihat sifat translasi",
          sameDistance: "jarak sama",
          sameDirection: "arah sama",
          labelPreimage: "Pra-bayangan",
          labelImage: "Bayangan",
          textPreimage:
            "Bangun asli sebelum translasi disebut <y>Pra-bayangan</y>.<br><br>Titik pra-bayangan biasanya dinamai dengan huruf kapital seperti <y>A, B, C</y>, dan seterusnya.",
          textImage:
            "Bangun akhir setelah translasi disebut <y>Bayangan</y>.<br><br>Titik bayangan biasanya dinamai dengan huruf yang sama dengan <y>simbol prima</y>, seperti <y>A\u2032, B\u2032, C\u2032</y>, dan seterusnya.",
        },
        2: {
          labelPreimage: "Pra-bayangan",
          labelImage: "Bayangan",
          feedbackSize:
            "Pas sekali!<br>Dalam translasi, ukuran tetap sama.",
          feedbackShape:
            "Semua panjang sisi dan sudut yang bersesuaian sama!<br>Dalam translasi, bentuk tetap sama.",
          feedbackPosition:
            "Jelas, posisi titik-titik telah berubah.<br>Dalam translasi, posisi berubah.",
          feedbackOrientation:
            "Setiap titik bergerak jarak yang sama ke arah yang sama.<br>Dalam translasi, orientasi tetap sama.",
          positionCalloutOriginal:
            "Posisi asli sebuah titik<br>pada bangun",
          positionCalloutFinal: "Posisi akhir<br>titik yang sama",
        },
      },
      properties: {
        size: { label: "Ukuran" },
        shape: { label: "Bentuk" },
        position: { label: "Posisi" },
        orientation: { label: "Orientasi" },
      },
      navigation2: {
        summarize: "Ringkas",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
