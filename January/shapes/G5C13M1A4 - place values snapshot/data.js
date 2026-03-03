// Place Values up to 1 Million / data.js

const DATA = {
  en: {
    app: {
      questionText: "Place values up to 1 million",
      navText: "Click on the buttons to visualize the place values",
      buttons: [
        "10 ones",
        "10 tens",
        "10 hundreds",
        "10 thousands",
        "10 ten thousands",
        "10 hundred thousands",
      ],
      tableEntries: [
        "1 × 10 = 10",
        "10 × 10 = 100",
        "100 × 10 = 1,000",
        "1,000 × 10 = 10,000",
        "10,000 × 10 = 100,000",
        "100,000 × 10 = 1,000,000",
      ],
      // step configs
      steps: [
        {
          // Step 1: ones -> tens
          initialImage: "one.png",
          initialText: "1 one",
          topCount: 10,
          topText: "1 one × 10",
          bottomImage: "ten.png",
          bottomText: "1 ten",
          // top visual: 10 images in a row, 2vw width each
          topImageWidth: "2vw",
          topLayout: "row", // single row
          topRows: 1,
          topPerRow: 10,
          // bottom divisions: 10 sections vertically (column image divided into 10 squares)
          bottomDivisionType: "column", // 10 vertical sections
          bottomDivisionCount: 10,
        },
        {
          // Step 2: tens -> hundreds
          initialImage: "ten.png",
          initialText: "1 ten",
          topCount: 10,
          topText: "1 ten × 10",
          bottomImage: "hundred.png",
          bottomText: "1 hundred",
          topImageHeight: "10vw",
          topLayout: "row",
          topRows: 1,
          topPerRow: 10,
          bottomDivisionType: "row", // 10 horizontal sections (columns side by side)
          bottomDivisionCount: 10,
        },
        {
          // Step 3: hundreds -> thousands
          initialImage: "hundred.png",
          initialText: "1 hundred",
          topCount: 10,
          topText: "1 hundred × 10",
          bottomImage: "thousand.png",
          bottomText: "1 thousand",
          topImageWidth: "5vw",
          topLayout: "grid", // 2 rows, 5 per row
          topRows: 2,
          topPerRow: 5,
          bottomDivisionType: "single", // 10 squares 10vw×10vw, padding 0.1vw, shift 0.4vw
          bottomDivisionCount: 10,
        },
        {
          // Step 4: thousands -> ten thousands
          initialImage: "thousand.png",
          initialText: "1 thousand",
          topCount: 10,
          topText: "1 thousand × 10",
          bottomImage: "tenThousand.png",
          bottomText: "1 ten thousand",
          topImageWidth: "5vw",
          topLayout: "grid", // 2 rows, 5 per row
          topRows: 2,
          topPerRow: 5,
          bottomDivisionType: "column", // column wise (rod/pillar)
          bottomDivisionCount: 10,
        },
        {
          // Step 5: ten thousands -> hundred thousands
          initialImage: "tenThousand.png",
          initialText: "1 ten thousand",
          topCount: 10,
          topText: "1 ten thousand × 10",
          bottomImage: "hundredThousand.png",
          bottomText: "1 hundred thousand",
          topImageHeight: "10vw",
          topLayout: "row",
          topRows: 1,
          topPerRow: 10,
          bottomDivisionType: "row", // row wise (pillars side by side)
          bottomDivisionCount: 10,
        },
      ],
    },
  },
  id: {
    app: {
      questionText: "Nilai tempat hingga 1 juta",
      navText: "Klik tombol untuk memvisualisasikan nilai tempat",
      buttons: [
        "10 satuan",
        "10 puluhan",
        "10 ratusan",
        "10 ribuan",
        "10 puluh ribuan",
        "10 ratus ribuan",
      ],
      tableEntries: [
        "1 × 10 = 10",
        "10 × 10 = 100",
        "100 × 10 = 1.000",
        "1.000 × 10 = 10.000",
        "10.000 × 10 = 100.000",
        "100.000 × 10 = 1.000.000",
      ],
      steps: [
        {
          initialImage: "one.png",
          initialText: "1 satuan",
          topCount: 10,
          topText: "1 satuan × 10",
          bottomImage: "ten.png",
          bottomText: "1 puluhan",
          topImageWidth: "2vw",
          topLayout: "row",
          topRows: 1,
          topPerRow: 10,
          bottomDivisionType: "column",
          bottomDivisionCount: 10,
        },
        {
          initialImage: "ten.png",
          initialText: "1 puluhan",
          topCount: 10,
          topText: "1 puluhan × 10",
          bottomImage: "hundred.png",
          bottomText: "1 ratusan",
          topImageHeight: "10vw",
          topLayout: "row",
          topRows: 1,
          topPerRow: 10,
          bottomDivisionType: "row",
          bottomDivisionCount: 10,
        },
        {
          initialImage: "hundred.png",
          initialText: "1 ratusan",
          topCount: 10,
          topText: "1 ratusan × 10",
          bottomImage: "thousand.png",
          bottomText: "1 ribuan",
          topImageWidth: "5vw",
          topLayout: "grid",
          topRows: 2,
          topPerRow: 5,
          bottomDivisionType: "single",
          bottomDivisionCount: 10,
        },
        {
          initialImage: "thousand.png",
          initialText: "1 ribuan",
          topCount: 10,
          topText: "1 ribuan × 10",
          bottomImage: "tenThousand.png",
          bottomText: "1 puluh ribuan",
          topImageWidth: "5vw",
          topLayout: "grid",
          topRows: 2,
          topPerRow: 5,
          bottomDivisionType: "column",
          bottomDivisionCount: 10,
        },
        {
          initialImage: "tenThousand.png",
          initialText: "1 puluh ribuan",
          topCount: 10,
          topText: "1 puluh ribuan × 10",
          bottomImage: "hundredThousand.png",
          bottomText: "1 ratus ribuan",
          topImageHeight: "10vw",
          topLayout: "row",
          topRows: 1,
          topPerRow: 10,
          bottomDivisionType: "row",
          bottomDivisionCount: 10,
        },
      ],
    },
  },
};

// Resolve language
const APP_DATA =
  DATA[typeof current_language !== "undefined" ? current_language : "en"].app;
