const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      documentTitle: "Reflection of a Point",
      start: {
        heading: "Reflection of a Point",
        text: "Let's recall the <y>rules of reflection</y>!",
        buttonText: "START",
      },
      panel: {
        title: "Explore reflection rules for different lines.",
        summarize: "Summarize",
      },
      finish: {
        heading: "Reflection of a Point",
        text:
          "Nice Job! Now you can apply these rules to find the<br>coordinates of the image point, when the coordinates of the<br>preimage are given.<br>Tap 'Start Over' to re-do this activity.",
        buttonText: "START OVER",
      },
      reflectors: {
        xAxis: { label: "x-axis" },
        yAxis: { label: "y-axis" },
        lineYH: { label: "Line y = h" },
        lineXK: { label: "Line x = k" },
        lineYX: { label: "Line y = x" },
        lineYNegX: { label: "Line y = -x" },
      },
      graph: {
        xAxisLabel: "x",
        yAxisLabel: "y",
        initialPointLabel: "A(x,y)",
        reflectedPointLabels: {
          xAxis: "A'(x,-y)",
          yAxis: "A'(-x,y)",
          lineYH: "A'(x,-y+2h)",
          lineXK: "A'(-x+2k,y)",
          lineYX: "A'(y,x)",
          lineYNegX: "A'(-y,-x)",
        },
        coordinateLabels: {
          x: "x",
          y: "y",
          h: "h",
          k: "k",
          zeroH: "(0,h)",
          kZero: "(k,0)",
          negativeX: "-x",
          negativeY: "-y",
          reflectedXK: "-x+2k",
          reflectedYH: "-y+2h",
        },
        equations: {
          xAxis: "y = 0",
          yAxis: "x = 0",
          lineYH: "y = h",
          lineXK: "x = k",
          lineYX: "y = x",
          lineYNegX: "y = -x",
        },
        resultBoxes: {
          xAxis: {
            x: "x-coordinate: No change",
            y: "y-coordinate: Sign changes",
          },
          yAxis: {
            x: "x-coordinate: Sign changes",
            y: "y-coordinate: No change",
          },
          lineYH: {
            x: "x-coordinate: No change",
            y: "y-coordinate: Change sign then add 2h",
          },
          lineXK: {
            x: "x-coordinate: Change sign then add 2k",
            y: "y-coordinate: No change",
          },
          lineYX: {
            x: "Coordinates swap",
            y: "Signs do not change",
          },
          lineYNegX: {
            x: "Coordinates swap",
            y: "Signs change",
          },
        },
      },
    },
  },
  id: {
    app: {
      documentTitle: "Pencerminan Sebuah Titik",
      start: {
        heading: "Pencerminan Sebuah Titik",
        text: "Mari kita ingat kembali <y>aturan pencerminan</y>!",
        buttonText: "MULAI",
      },
      panel: {
        title: "Jelajahi aturan pencerminan untuk berbagai garis.",
        summarize: "Ringkas",
      },
      finish: {
        heading: "Pencerminan Sebuah Titik",
        text:
          "Bagus! Sekarang kamu dapat menerapkan aturan ini untuk menemukan<br>koordinat titik bayangan, ketika koordinat titik<br>prabayangan diberikan.<br>Ketuk 'Mulai Lagi' untuk mengulangi aktivitas ini.",
        buttonText: "MULAI LAGI",
      },
      reflectors: {
        xAxis: { label: "sumbu-x" },
        yAxis: { label: "sumbu-y" },
        lineYH: { label: "Garis y = h" },
        lineXK: { label: "Garis x = k" },
        lineYX: { label: "Garis y = x" },
        lineYNegX: { label: "Garis y = -x" },
      },
      graph: {
        xAxisLabel: "x",
        yAxisLabel: "y",
        initialPointLabel: "A(x,y)",
        reflectedPointLabels: {
          xAxis: "A'(x,-y)",
          yAxis: "A'(-x,y)",
          lineYH: "A'(x,-y+2h)",
          lineXK: "A'(-x+2k,y)",
          lineYX: "A'(y,x)",
          lineYNegX: "A'(-y,-x)",
        },
        coordinateLabels: {
          x: "x",
          y: "y",
          h: "h",
          k: "k",
          zeroH: "(0,h)",
          kZero: "(k,0)",
          negativeX: "-x",
          negativeY: "-y",
          reflectedXK: "-x+2k",
          reflectedYH: "-y+2h",
        },
        equations: {
          xAxis: "y = 0",
          yAxis: "x = 0",
          lineYH: "y = h",
          lineXK: "x = k",
          lineYX: "y = x",
          lineYNegX: "y = -x",
        },
        resultBoxes: {
          xAxis: {
            x: "Koordinat x: Tidak berubah",
            y: "Koordinat y: Tanda berubah",
          },
          yAxis: {
            x: "Koordinat x: Tanda berubah",
            y: "Koordinat y: Tidak berubah",
          },
          lineYH: {
            x: "Koordinat x: Tidak berubah",
            y: "Koordinat y: Ubah tanda lalu tambahkan 2h",
          },
          lineXK: {
            x: "Koordinat x: Ubah tanda lalu tambahkan 2k",
            y: "Koordinat y: Tidak berubah",
          },
          lineYX: {
            x: "Koordinat bertukar",
            y: "Koordinat y: tanda tidak berubah",
          },
          lineYNegX: {
            x: "Koordinat bertukar",
            y: "Tanda berubah",
          },
        },
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];

if (typeof document !== "undefined") {
  document.title = APP_DATA.documentTitle;
}
