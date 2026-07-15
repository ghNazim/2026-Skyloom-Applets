const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Properties of Rotation",
        text:
          "Explore the properties of rotation<br>by rotating figures about a fixed point.<br><br>Click START to begin!",
        buttonText: "START",
      },
      finish: {
        heading: "Activity Completed!",
        text:
          "In a rotation,<br><r>Orientation changes</r><r>Position changes</r><g>Shape remains same</g><g>Size remains same</g>",
        buttonText: "START OVER",
      },
      steps: {
        1: {
          topTextInitial: " ",
          bottomTextInitial: "Tap the figure to rotate it.",
          topTextAfterRotation:
            "A rotation turns a figure about a fixed centre of rotation.",
          bottomTextAfterRotation:
            "Tap each button to explore properties of rotation.",
        },
        2: {
          feedbackSize:
            "It fits perfectly!<br>In a rotation, the size remains the same.",
          feedbackShape:
            "All corresponding side lengths and angles are equal!<br>In a translation, the shape stays the same.",
          feedbackPosition:
            "Clearly, the position of the point has changed.<br>In a rotation, the position changes.",
          feedbackOrientation:
            "The figure is now facing a different direction.<br>In a rotation, the orientation changes.",
          bottomText:
            "Tap each button to explore properties of rotation.",
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
      summarize: "Summarize",
    },
  },
  id: {
    app: {
      start: {
        heading: "Sifat-sifat Rotasi",
        text:
          "Jelajahi sifat-sifat rotasi<br>dengan memutar bangun tentang titik tetap.<br><br>Klik MULAI untuk memulai!",
        buttonText: "MULAI",
      },
      finish: {
        heading: "Aktivitas Selesai!",
        text:
          "Dalam rotasi,<br><r>Orientasi berubah</r><br><r>Posisi berubah</r><br><g>Bentuk tetap sama</g><br><g>Ukuran tetap sama</g>",
        buttonText: "MULAI LAGI",
      },
      steps: {
        1: {
          topTextInitial: " ",
          bottomTextInitial: "Ketuk bangun untuk memutarnya.",
          topTextAfterRotation:
            "Rotasi memutar bangun tentang pusat rotasi yang tetap.",
          bottomTextAfterRotation:
            "Ketuk setiap tombol untuk menjelajahi sifat rotasi.",
        },
        2: {
          feedbackSize:
            "Pas sekali!<br>Dalam rotasi, ukuran tetap sama.",
          feedbackShape:
            "Semua panjang sisi dan sudut yang bersesuaian sama!<br>Dalam translasi, bentuk tetap sama.",
          feedbackPosition:
            "Jelas, posisi titik telah berubah.<br>Dalam rotasi, posisi berubah.",
          feedbackOrientation:
            "Bangun sekarang menghadap arah yang berbeda.<br>Dalam rotasi, orientasi berubah.",
          bottomText:
            "Ketuk setiap tombol untuk menjelajahi sifat rotasi.",
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
      summarize: "Ringkas",
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
