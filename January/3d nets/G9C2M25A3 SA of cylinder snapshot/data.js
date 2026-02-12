const DATA = {
  en: {
    app: {
      initial: {
        q: "Surface area of 3D Shape - Cylinder",
        n: "Tap each button and observe the visual area",
      },
      buttons: {
        lateral: "Lateral Surface Area",
        total: "Total Surface Area",
      },
      textboxes: {
        lateral: "Area 1 curved lateral\nrectangle",
        total: "Area of 2 circular\nbases and 1 curved\nlateral rectangle",
      },
      questionTexts: {
        lateral: {
          unfold: "Cylinder has 1 curved rectangular lateral surface",
        },
        total: {
          unfold:
            "Cylinder has 2 circular bases and 1 curved rectangular lateral surface",
          baseArea: "Base Area is the sum of areas of all bases",
          lsa: "LSA is the sum of areas of all lateral surfaces, without bases",
          tsa: "TSA is area of all surfaces making the shape",
        },
      },
    },
  },
  id: {
    app: {
      initial: {
        q: "Luas Permukaan Bangun Ruang 3D - Tabung",
        n: "Ketuk setiap tombol dan amati visualisasi luasnya",
      },
      buttons: {
        lateral: "Luas Permukaan Selimut",
        total: "Luas Permukaan Total",
      },
      textboxes: {
        lateral: "Luas 1 persegi panjang\nselimut melengkung",
        total: "Luas 2 alas lingkaran\ndan 1 persegi panjang\nselimut melengkung",
      },
      questionTexts: {
        lateral: {
          unfold: "Tabung memiliki 1 permukaan selimut persegi panjang melengkung",
        },
        total: {
          unfold:
            "Tabung memiliki 2 alas lingkaran dan 1 permukaan selimut persegi panjang melengkung",
          baseArea: "Luas Alas adalah jumlah luas dari semua sisi alas",
          lsa: "LSA (Luas Selimut) adalah jumlah luas semua permukaan samping, tanpa alas",
          tsa: "TSA (Luas Permukaan Total) adalah luas seluruh permukaan yang membentuk bangun ruang",
        },
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
