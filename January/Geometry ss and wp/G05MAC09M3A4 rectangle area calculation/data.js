const DATA = {
  en: {
    app: {
      initial: {
        q: "Notice how changing the length and breadth of a rectangle changes its area.",
        n: "Tap '+' or '-' to choose the length and breadth and then tap 'Area'.",
      },
      calc: {
        areaOfRectangle: "Area of Rectangle",
        length: "Length",
        breadth: "Breadth",
        squareUnits: "sq. units",
        unit: "unit",
        units: "units",
        areaButton: "Area",
        resetButton: "Reset",
      },
    },
  },
  id: {
    app: {
      initial: {
        q: "Perhatikan bagaimana mengubah panjang dan lebar persegi panjang mengubah luasnya.",
        n: "Ketuk '+' atau '-' untuk memilih panjang dan lebar lalu ketuk 'Luas'.",
      },
      calc: {
        areaOfRectangle: "Luas Persegi Panjang",
        length: "Panjang",
        breadth: "Lebar",
        squareUnits: "satuan persegi",
        unit: "satuan",
        units: "satuan",
        areaButton: "Luas",
        resetButton: "Atur Ulang",
      },
    },
  },
};

const APP_DATA = DATA[current_language] ? DATA[current_language].app : DATA.en.app;
