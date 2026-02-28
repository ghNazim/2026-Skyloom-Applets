

const DATA = {
  en: {
    app: {
      start: {
        heading: "Cuboids and Cubes",
        text: "Today we learn about cuboids and cubes.<br><br>Tap 'Start' to begin the lesson.",
        buttonText: "Start",
      },
      steps: {
        1: {
          questionText: "Tap on the boxes to understand about CUBOIDS",
          navText: "Tap 'cuboid'.",
          navSlider: "Move the slider to build a cuboid",
          navTapBoxes: "Tap the coloured boxes and see the visual",
          navNext: "Tap '»' to learn about cubes",
          textLines: [
            [{ type: "plain", text: "A " }, { type: "box", id: "cuboid", text: "cuboid", color: "green" }, { type: "plain", text: " is a" }],
            [{ type: "plain", text: "solid shape which has" }],
            [{ type: "box", id: "faces", text: "6 rectangular faces", color: "blue" }],
            [{ type: "box", id: "vertices", text: "8 vertices", color: "orange" }],
            [{ type: "box", id: "edges", text: "12 edges", color: "yellow" }],
          ],
        },
        2: {
          questionText: "Tap on the boxes to understand about CUBES",
          navText: "Tap 'cube'.",
          navSlider: "Move the slider to build a cube",
          navTapBoxes: "Tap the coloured boxes and see the visual",
          navNext: "Tap '»' to continue",
          textLines: [
            [{ type: "plain", text: "A " }, { type: "box", id: "cube", text: "cube", color: "green" }, { type: "plain", text: " is a cuboid" }],
            [{ type: "plain", text: "when all the faces are squares." }],
            [{ type: "box", id: "faces", text: "6 square faces", color: "blue" }],
            [{ type: "box", id: "vertices", text: "8 vertices", color: "orange" }],
            [{ type: "box", id: "edges", text: "12 edges", color: "yellow" }],
          ],
        },
        3: {
          questionText: "CUBOIDS and CUBES",
          navText: "Tap 'Start Over' to learn again",
          compare: {
            cuboid: {
              title: "Cuboid",
              features: ["6 Rectangular faces", "8 Vertices", "12 Edges"],
            },
            cube: {
              title: "Cube",
              features: ["6 Square faces", "8 Vertices", "12 Edges"],
            },
          },
        },
      },
      final: {},
      startOver: "Start Over",
    },
  },
  id: {
    app: {
      start: {
        heading: "Balok dan Kubus",
        text: "Hari ini kita belajar tentang balok dan kubus.<br><br>Ketuk 'Mulai' untuk memulai pelajaran.",
        buttonText: "Mulai",
      },
      steps: {
        1: {
          questionText: "Ketuk kotak-kotak untuk memahami tentang BALOK",
          navText: "Ketuk 'balok'.",
          navSlider: "Gerakkan slider untuk membangun balok",
          navTapBoxes: "Ketuk kotak berwarna dan lihat visualnya",
          navNext: "Ketuk '»' untuk belajar tentang kubus",
          textLines: [
            [{ type: "plain", text: "Sebuah " }, { type: "box", id: "cuboid", text: "balok", color: "green" }, { type: "plain", text: " adalah" }],
            [{ type: "plain", text: "bangun ruang yang memiliki" }],
            [{ type: "box", id: "faces", text: "6 sisi persegi panjang", color: "blue" }],
            [{ type: "box", id: "vertices", text: "8 titik sudut", color: "orange" }],
            [{ type: "box", id: "edges", text: "12 rusuk", color: "yellow" }],
          ],
        },
        2: {
          questionText: "Ketuk kotak-kotak untuk memahami tentang KUBUS",
          navText: "Ketuk 'kubus'.",
          navSlider: "Gerakkan slider untuk membangun kubus",
          navTapBoxes: "Ketuk kotak berwarna dan lihat visualnya",
          navNext: "Ketuk '»' untuk melanjutkan",
          textLines: [
            [{ type: "plain", text: "Sebuah " }, { type: "box", id: "cube", text: "kubus", color: "green" }, { type: "plain", text: " adalah balok" }],
            [{ type: "plain", text: "ketika semua sisinya berbentuk persegi." }],
            [{ type: "box", id: "faces", text: "6 sisi persegi", color: "blue" }],
            [{ type: "box", id: "vertices", text: "8 titik sudut", color: "orange" }],
            [{ type: "box", id: "edges", text: "12 rusuk", color: "yellow" }],
          ],
        },
        3: {
          questionText: "BALOK dan KUBUS",
          navText: "Ketuk 'Mulai Lagi' untuk belajar lagi",
          compare: {
            cuboid: {
              title: "Balok",
              features: ["6 Sisi persegi panjang", "8 Titik sudut", "12 Rusuk"],
            },
            cube: {
              title: "Kubus",
              features: ["6 Sisi persegi", "8 Titik sudut", "12 Rusuk"],
            },
          },
        },
      },
      final: {},
      startOver: "Mulai Lagi",
    },
  },
};

const APP_DATA = DATA[current_language].app;
