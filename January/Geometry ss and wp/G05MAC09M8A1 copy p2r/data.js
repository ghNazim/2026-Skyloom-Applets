const DATA = {
  en: {
    app: {
      initial: {
        q: "Let's start with a shape we already know - a rectangle.",
        n: "Drag the slider to tilt the shape and observe area",
      },
      sliderMoved: {
        q: "Observe that the area of the rectangle didn't change.",
        n: "Drag the slider to tilt the shape and observe area",
      },
    },
  },
  id: {
    app: {
      initial: {
        q: "Mari kita mulai dengan bentuk yang sudah kita kenal - persegi panjang.",
        n: "Seret slider untuk memiringkan bentuk dan amati luasnya",
      },
      sliderMoved: {
        q: "Perhatikan bahwa luas persegi panjang tidak berubah.",
        n: "Seret slider untuk memiringkan bentuk dan amati luasnya",
      },
    },
  },
};

const APP_DATA = DATA[current_language] ? DATA[current_language].app : DATA.en.app;
