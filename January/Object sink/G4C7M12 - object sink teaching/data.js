// const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

// Object sink data - positions and water level changes for each object
// Uses exact same GLOBAL values as ref.html (lines 756-761)
// Note: ref.html sinkData had different values but animation used globals!
const sinkData = {
  watermelon: {
    objectHeight: 100,      // Used for animation timing calculation
    objectStartX: 400,      // X position
    objectStartY: 50,       // Start Y = 50 (ref.html global value)
    objectEndY: 340,        // End Y = 340 (ref.html global value)
    pivot: 130,             // pivot = 230 - objectHeight = 130 (ref.html global calculation)
    waterLevel: 40,         // Water level increase
    baseTickLabel: 12000,
    gap: 1200,
    
  },
  pumpkin: {
    objectHeight: 100,
    objectStartX: 400,
    objectStartY: 50,
    objectEndY: 340,
    pivot: 130,
    waterLevel: 40,
    baseTickLabel: 12000,
    gap: 900,
  },
  coconut: {
    objectHeight: 100,      // Animation uses global objectHeight=100, not 200
    objectStartX: 400,
    objectStartY: 50,
    objectEndY: 340,
    pivot: 130,
    waterLevel: 40,
    baseTickLabel: 12000,
    gap: 600,
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
          questionText: "Volume of the object = volume of the displaced water.",
          navTexts: [
            "Tap » to find the volume of the object.",
            "Tap » to substitute the values.",
            "Tap » to subtract.",
            "Tap » to find the volume of another object.",
          ],
          navTextFinal: "Tap » to complete the activity.",
        },
      },
      final: {
        heading: "Activity Completed!",
        text: "We learned to find the volume of an irregular object by subtracting volumes.<br><br>Tap 'Start Over' to begin the activity.",
        buttonText: "Start Over",
      },
      objects: {
        coconut: "coconut",
        pumpkin: "pumpkin",
        watermelon: "watermelon",
      },
      sinkData: sinkData,
      calculationTexts: {
        coconut: [
          "<yl>Volume of water = 12000 cm³</yl>",
          "<bl>Volume of water and coconut = 13200 cm³</bl>",
          "Volume of coconut = <bl>Total volume</bl> – <yl>Volume of Water</yl>",
          "Volume of coconut = <bl>13200 cm³</bl> – <yl>12000 cm³</yl>",
          "= <cy>1200 cm³</cy>",
        ],
        pumpkin: [
          "<yl>Volume of water = 12000 cm³</yl>",
          "<bl>Volume of water and pumpkin = 13800 cm³</bl>",
          "Volume of pumpkin = <bl>Total volume</bl> – <yl>Volume of Water</yl>",
          "Volume of pumpkin = <bl>13800 cm³</bl> – <yl>12000 cm³</yl>",
          "= <cy>1800 cm³</cy>",
        ],
        watermelon: [
          "<yl>Volume of water = 12000 cm³</yl>",
          "<bl>Volume of water and watermelon = 14400 cm³</bl>",
          "Volume of watermelon = <bl>Total volume</bl> – <yl>Volume of Water</yl>",
          "Volume of watermelon = <bl>14400 cm³</bl> – <yl>12000 cm³</yl>",
          "= <cy>2400 cm³</cy>",
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
          questionText: "Volume objek = volume air yang dipindahkan.",
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
        coconut: "kelapa",
        pumpkin: "labu",
        watermelon: "semangka",
      },
      sinkData: sinkData,
      calculationTexts: {
        coconut: [
          "<yl>Volume air = 12000 cm³</yl>",
          "<bl>Volume air dan kelapa = 13200 cm³</bl>",
          "Volume kelapa = <bl>Volume total</bl> – <yl>Volume air</yl>",
          "Volume kelapa = <bl>13200 cm³</bl> – <yl>12000 cm³</yl>",
          "= <cy>1200 cm³</cy>",
        ],
        pumpkin: [
          "<yl>Volume air = 12000 cm³</yl>",
          "<bl>Volume air dan labu = 13800 cm³</bl>",
          "Volume labu = <bl>Volume total</bl> – <yl>Volume air</yl>",
          "Volume labu = <bl>13800 cm³</bl> – <yl>12000 cm³</yl>",
          "= <cy>1800 cm³</cy>",
        ],
        watermelon: [
          "<yl>Volume air = 12000 cm³</yl>",
          "<bl>Volume air dan semangka = 14400 cm³</bl>",
          "Volume semangka = <bl>Volume total</bl> – <yl>Volume air</yl>",
          "Volume semangka = <bl>14400 cm³</bl> – <yl>12000 cm³</yl>",
          "= <cy>2400 cm³</cy>",
        ],
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
