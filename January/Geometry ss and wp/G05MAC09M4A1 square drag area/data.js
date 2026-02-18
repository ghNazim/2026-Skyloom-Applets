const DATA = {
  en: {
    app: {
      initial: {
        q: "Notice how equal rows and columns form the area of a square.",
        n: "Drag the vertex of the square to adjust its size.",
      },
      calc: {
        areaOfSquare: "Area of square",
        numberOfUnitSquares: "Number of unit squares",
        squareUnits: "square units",
        unit: "unit",
        units: "units",
      },
    },
  },
  id: {
    app: {
      initial: {
        q: "Perhatikan bagaimana baris dan kolom yang sama membentuk luas persegi.",
        n: "Seret titik sudut persegi untuk mengubah ukurannya.",
      },
      calc: {
        areaOfSquare: "Luas persegi",
        numberOfUnitSquares: "Banyak persegi satuan",
        squareUnits: "satuan persegi",
        unit: "satuan",
        units: "satuan",
      },
    },
  },
};

const APP_DATA = DATA[current_language] ? DATA[current_language].app : DATA.en.app;
