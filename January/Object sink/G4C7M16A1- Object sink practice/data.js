
const decimal = {
  en: ".",
  id: ",",
};

// Object sink data - positions and water level changes (numbers only, not translated)
const sinkData = {
  stone: {
    objectHeight: 100,
    objectStartX: 400,
    objectStartY: 50,
    objectEndY: 340,
    pivot: 130,
    waterLevel: 40,
    baseTickLabel: 12000,
    gap: 25,
  },
  anchor: {
    objectHeight: 100,
    objectStartX: 400,
    objectStartY: 50,
    objectEndY: 340,
    pivot: 130,
    waterLevel: 40,
    baseTickLabel: 12000,
    gap: 300,
  },
  brick: {
    objectHeight: 100,
    objectStartX: 400,
    objectStartY: 50,
    objectEndY: 340,
    pivot: 130,
    waterLevel: 40,
    baseTickLabel: 12000,
    gap: 750,
  },
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Volume of Irregular Objects",
        text: "Let's learn how to find the volume of an irregular object by subtracting volumes.<br><br>Tap 'Start' to begin the activity.",
        buttonText: "Start",
      },
      steps: {
        1: {
          questionText: "This tank holds 12,000 cm³ of water.",
          navText: "Choose an object to drop into the tank.",
          navAfterSelect: "Move the slider to drop the stone into tank.",
          navAfterDrop: "Tap » to find the volume of the object.",
        },
        2: {
          questionText: "Let's find the volume of the object.",
          navTexts: [
            "Tap » to find the volume of the object.",
            "Tap » to substitute the values.",
            "Tap » to subtract.",
            "Tap » to find the volume of another object.",
          ],
          navTextFinal:"Tap » to complete the activity.",
        },
      },
      final: {
        heading: "Activity Completed!",
        text: "We learned to find the volume of an irregular object by subtracting volumes.<br><br>Tap 'Start Over' to begin the activity.",
        buttonText: "Start Over",
      },
      objects: {
        stone: "stone",
        anchor: "anchor",
        brick: "brick",
      },
      objectTitles: {
        stone: "Stone",
        anchor: "Anchor",
        brick: "Brick",
      },
      sinkData: sinkData,
      calculationTexts: {
        stone: [
          "<yl>Volume of water = 12000 cm³</yl>",
          "<bl>Volume of water and stone = 12050 cm³</bl>",
          "Volume of stone = <bl>Total volume</bl> – <yl>Volume of Water</yl>",
          "Volume of stone = <bl>12050 cm³</bl> – <yl>12000 cm³</yl>",
          "Volume of stone = <cy>50 cm³</cy>",
        ],
        anchor: [
          "<yl>Volume of water = 12000 cm³</yl>",
          "<bl>Volume of water and anchor = 12600 cm³</bl>",
          "Volume of anchor = <bl>Total volume</bl> – <yl>Volume of Water</yl>",
          "Volume of anchor = <bl>12600 cm³</bl> – <yl>12000 cm³</yl>",
          "Volume of anchor = <cy>600 cm³</cy>",
        ],
        brick: [
          "<yl>Volume of water = 12000 cm³</yl>",
          "<bl>Volume of water and brick = 13500 cm³</bl>",
          "Volume of brick = <bl>Total volume</bl> – <yl>Volume of Water</yl>",
          "Volume of brick = <bl>13500 cm³</bl> – <yl>12000 cm³</yl>",
          "Volume of brick = <cy>1500 cm³</cy>",
        ],
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Volume Benda Tidak Beraturan",
        text: "Mari belajar cara menemukan volume benda tidak beraturan dengan pengurangan volume.<br><br>Ketuk 'Mulai' untuk memulai aktivitas.",
        buttonText: "Mulai",
      },
      steps: {
        1: {
          questionText: "Tangki ini menampung 12.000 cm³ air.",
          navText: "Pilih objek untuk dijatuhkan ke dalam tangki.",
          navAfterSelect: "Geser slider untuk menjatuhkan batu ke dalam tangki.",
          navAfterDrop: "Ketuk » untuk menemukan volume objek.",
        },
        2: {
          questionText: "Mari kita cari volume objek.",
          navTexts: [
            "Ketuk » untuk menemukan volume objek.",
            "Ketuk » untuk mensubstitusi nilai-nilai.",
            "Ketuk » untuk mengurangi.",
            "Ketuk » untuk menemukan volume objek lain.",
          ],
          navTextFinal: "Ketuk » untuk menyelesaikan aktivitas.",
        },
      },
      final: {
        heading: "Aktivitas Selesai!",
        text: "Kita telah belajar menemukan volume benda tidak beraturan dengan pengurangan volume.<br><br>Ketuk 'Mulai Lagi' untuk memulai aktivitas.",
        buttonText: "Mulai Lagi",
      },
      objects: {
        stone: "batu",
        anchor: "jangkar",
        brick: "bata",
      },
      objectTitles: {
        stone: "Batu",
        anchor: "Jangkar",
        brick: "Bata",
      },
      sinkData: sinkData,
      calculationTexts: {
        stone: [
          "<yl>Volume air = 12000 cm³</yl>",
          "<bl>Volume air dan batu = 13200 cm³</bl>",
          "Volume batu = <bl>Volume total</bl> – <yl>Volume air</yl>",
          "Volume batu = <bl>13200 cm³</bl> – <yl>12000 cm³</yl>",
          "= <cy>1200 cm³</cy>",
        ],
        anchor: [
          "<yl>Volume air = 12000 cm³</yl>",
          "<bl>Volume air dan jangkar = 13800 cm³</bl>",
          "Volume jangkar = <bl>Volume total</bl> – <yl>Volume air</yl>",
          "Volume jangkar = <bl>13800 cm³</bl> – <yl>12000 cm³</yl>",
          "= <cy>1800 cm³</cy>",
        ],
        brick: [
          "<yl>Volume air = 12000 cm³</yl>",
          "<bl>Volume air dan bata = 14400 cm³</bl>",
          "Volume bata = <bl>Volume total</bl> – <yl>Volume air</yl>",
          "Volume bata = <bl>14400 cm³</bl> – <yl>12000 cm³</yl>",
          "= <cy>2400 cm³</cy>",
        ],
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
