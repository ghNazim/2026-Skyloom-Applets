const DATA = {
  en: {
    app: {
      initial: {
        q: "Every triangle has three different base–height pairs.<br> Always match the base with its height.",
        n: "Tap on the button to highlight pair 1.",
      },
      feedback: {
        baseSelected: "<xx>Any side of the triangle is its base.</xx>",
        heightSelected: "<yy>Height is perpendicular drawn from selected base to the opposite corner.</yy>",
      },
      nav: {
        pair1: "Tap on the button to highlight pair 1.",
        pair2: "Tap on the button to highlight pair 2.",
        pair3: "Tap on the button to highlight pair 3.",
        restart: "Tap 'Restart' to start again.",
      },
      buttons: {
        base: "Base",
        height: "Height",
        restart: "Restart",
      },
    },
  },
  id: {
    app: {
      initial: {
        q: "Setiap segitiga memiliki tiga pasangan alas–tinggi yang berbeda.<br> Selalu cocokkan alas dengan tingginya.",
        n: "Ketuk tombol untuk menyorot pasangan 1.",
      },
      feedback: {
        baseSelected: "<xx>Setiap sisi segitiga adalah alasnya.</xx>",
        heightSelected: "<yy>Tinggi adalah garis tegak lurus yang ditarik dari alas yang dipilih ke sudut yang berlawanan.</yy>",
      },
      nav: {
        pair1: "Ketuk tombol untuk menyorot pasangan 1.",
        pair2: "Ketuk tombol untuk menyorot pasangan 2.",
        pair3: "Ketuk tombol untuk menyorot pasangan 3.",
        restart: "Ketuk 'Mulai Ulang' untuk memulai lagi.",
      },
      buttons: {
        base: "Alas",
        height: "Tinggi",
        restart: "Mulai Ulang",
      },
    },
  },
};

const APP_DATA = DATA[current_language] ? DATA[current_language].app : DATA.en.app;
