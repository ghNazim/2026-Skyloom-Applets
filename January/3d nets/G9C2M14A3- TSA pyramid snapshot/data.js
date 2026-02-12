

const DATA = {
  en: {
    app: {
      buttons: [
        { label: "Lateral Surface Area" },
        { label: "Total Surface Area" },
      ],
      texts: [
        "Lateral Surface Area  includes only\nthe 4 triangular faces.",
        "Total Surface Area  includes area\nof the square base and lateral\nsurface area.",
      ],
      formulas: [
        "LSA  =  2al",
        "TSA  = a\u00B2 +  2al",
      ],
      colors: {
        green: "#1abc9c",
        blue: "#2e86de",
      },
    },
  },
  id: {
    app: {
      buttons: [
        { label: "Luas Permukaan Samping" },
        { label: "Luas Permukaan Total" },
      ],
      texts: [
        "Luas Permukaan Samping hanya mencakup\n4 sisi segitiga.",
        "Luas Permukaan Total mencakup luas\nalas persegi dan luas permukaan\nsamping.",
      ],
      formulas: [
        "LSA  =  2al",
        "TSA  = a\u00B2 +  2al",
      ],
      colors: {
        green: "#1abc9c",
        blue: "#2e86de",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
