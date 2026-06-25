const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Properties of Dilation",
        text:
          "Let\u2019s explore different properties of dilation.<br><br>Tap \u2018Start\u2019 to begin.",
        buttonText: "START",
      },
      finish: {
        heading: "Properties of Dilation",
        text:
          "When a figure is dilated:<br>\u25cf The shape of the image is preserved.<br>\u25cf The size of the image changes.<br>\u25cf The image does not rotate unless the scale factor is negative.<br>\u25cf The position of the image changes.<br><br>Tap \u2018Start Over\u2019 to restart.",
        buttonText: "START OVER",
      },
      steps: {
        1: {
          questionText: "Exploring Properties of Dilation",
          navText: "Tap a button to explore the property.",
          navTextSummarise: "Tap \u00bb to summarise.",
          navTextTapPolygon: "Tap on the polygon to dilate it.",
          navTextDragNegative:
            "Drag the slider to left to make the scale factor negative",
        },
      },
      properties: {
        shape: { label: "Shape" },
        size: { label: "Size" },
        orientation: { label: "Orientation" },
        position: { label: "Position" },
      },
      slider: {
        label: "Scale Factor (k)",
      },
      feedback: {
        size:
          "A dilation changes the size of a figure according to the scale factor.",
        orientationInitial:
          "<b>Scale factor &gt; 0</b><br>- no change in orientation<br><y>What if the scale factor (k) &lt; 0?</y>",
        orientationFinal:
          "<b>Scale factor &gt; 0</b><br>- no change in orientation<br><b>Scale factor &lt; 0</b><br>\u2013 Orientation changes (180\u00b0)",
        position:
          "The image is located at new coordinates after the dilation.",
        shape:
          "A dilation preserves shape. The image and preimage have the same shape.",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Sifat-sifat Dilatasi",
        text:
          "Mari kita jelajahi berbagai sifat dilatasi.<br><br>Ketuk \u2018Mulai\u2019 untuk memulai.",
        buttonText: "MULAI",
      },
      finish: {
        heading: "Sifat-sifat Dilatasi",
        text:
          "Ketika sebuah bangun didilatasi:<br>\u25cf Bentuk bayangan tetap terjaga.<br>\u25cf Ukuran bayangan berubah.<br>\u25cf Bayangan tidak berputar kecuali faktor skala negatif.<br>\u25cf Posisi bayangan berubah.<br><br>Ketuk \u2018Mulai Lagi\u2019 untuk memulai ulang.",
        buttonText: "MULAI LAGI",
      },
      steps: {
        1: {
          questionText: "Menjelajahi Sifat-sifat Dilatasi",
          navText: "Ketuk tombol untuk menjelajahi sifatnya.",
          navTextSummarise: "Ketuk \u00bb untuk merangkum.",
          navTextTapPolygon: "Ketuk poligon untuk mendilatasinya.",
          navTextDragNegative:
            "Seret penggeser ke kiri untuk membuat faktor skala negatif",
        },
      },
      properties: {
        shape: { label: "Bentuk" },
        size: { label: "Ukuran" },
        orientation: { label: "Orientasi" },
        position: { label: "Posisi" },
      },
      slider: {
        label: "Faktor Skala (k)",
      },
      feedback: {
        size:
          "Dilatasi mengubah ukuran bangun sesuai faktor skala.",
        orientationInitial:
          "<b>Faktor skala &gt; 0</b><br>- tidak ada perubahan orientasi<br><y>Bagaimana jika faktor skala (k) &lt; 0?</y>",
        orientationFinal:
          "<b>Faktor skala &gt; 0</b><br>- tidak ada perubahan orientasi<br><b>Faktor skala &lt; 0</b><br>\u2013 Orientasi berubah (180\u00b0)",
        position:
          "Bayangan berada di koordinat baru setelah dilatasi.",
        shape:
          "Dilatasi mempertahankan bentuk. Bayangan dan pra-bayangan memiliki bentuk yang sama.",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
