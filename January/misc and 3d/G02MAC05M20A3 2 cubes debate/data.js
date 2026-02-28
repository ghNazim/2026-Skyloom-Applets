
const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      questionText: "Who is correct?",
      navText: "Tap who you think is correct about the shape",
      navTextStartOver: "Tap 'Start Over' to see again",
      startOverButton: "Start Over",
      leftButtonText: "Joining two cubes will make a cube.",
      rightButtonText: "Joining two cubes will make a cuboid.",
      cubeLabel: "Cube",
      cuboidLabel: "Cuboid",
    },
  },
  id: {
    app: {
      questionText: "Siapa yang benar?",
      navText: "Ketuk siapa yang menurut Anda benar tentang bentuk tersebut",
      navTextStartOver: "Ketuk 'Mulai Lagi' untuk melihat lagi",
      startOverButton: "Mulai Lagi",
      leftButtonText: "Menggabungkan dua kubus akan menghasilkan kubus.",
      rightButtonText: "Menggabungkan dua kubus akan menghasilkan balok.",
      cubeLabel: "Kubus",
      cuboidLabel: "Balok",
    },
  },

};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
