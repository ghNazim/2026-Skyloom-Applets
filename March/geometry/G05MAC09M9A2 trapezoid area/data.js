const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      labels: {
        baseA: "Base a",
        baseB: "Base b",
        heightT: "Height (t)",
      },
      start: {
        heading: "Area of Trapezoid",
        text: "Let's derive the area formula for trapezoid by transforming it to a parallelogram.<br>Tap 'Start' to begin the activity.",
        buttonText: "Start",
      },
      steps: {
        1: {
          questionText: "Let's create an identical trapezoid.",
          navText: "Tap 'Create' to create an identical trapezoid.",
          actionButton: "Create",
        },
        2: {
          questionText: "Let's transform the trapezoid to a parallelogram.",
          navText: "Tap 'Transform'.",
          navNext: "Tap ⟲ to see the visualization or tap » to continue.",
          actionButton: "Transform",
        },
        3: {
          questionText: "The transformed parallelogram has the same area as the two trapezoids.",
          navText: "Tap the highlighted text to derive the formula.",
          questionTextDeriving: "Now, derive the formula for the area of a trapezoid.",
          navMiddle: "Tap the highlighted text.",
          navLast: "Tap » to simplify.",
          areaOfParallelogram: "Area of Parallelogram",
          areaOfTrapezoid: "Area of a Trapezoid",
          base: "Base",
          height: "Height",
        },
        4: {
          questionText: "Now, derive the formula for the area of a trapezoid.",
          navText: "Tap » to summarise.",
          areaOfTrapezoid: "Area of a Trapezoid",
        },
      },
      final: {
        heading: "Summary",
        text: "Area of a Trapezoid = ½ × <yl>(a + b)</yl> × <bl>t</bl>",
        buttonText: "Start Over",
        imageSrc: "assets/finalen.png",
      },
    },
  },
  id: {
    app: {
      labels: {
        baseA: "Alas a",
        baseB: "Alas b",
        heightT: "Tinggi (t)",
      },
      start: {
        heading: "Luas Trapesium",
        text: "Mari kita turunkan rumus luas trapesium dengan mengubahnya menjadi jajaran genjang.<br>Ketuk 'Mulai' untuk memulai aktivitas.",
        buttonText: "Mulai",
      },
      steps: {
        1: {
          questionText: "Mari kita buat trapesium yang identik.",
          navText: "Ketuk 'Buat' untuk membuat trapesium yang identik.",
          actionButton: "Buat",
        },
        2: {
          questionText: "Mari kita ubah trapesium menjadi jajaran genjang.",
          navText: "Ketuk 'Ubah'.",
          navNext: "Ketuk ⟲ untuk melihat visualisasi atau ketuk » untuk melanjutkan.",
          actionButton: "Ubah",
        },
        3: {
          questionText: "Jajaran genjang yang terbentuk memiliki luas yang sama dengan dua trapesium.",
          navText: "Ketuk teks yang disorot untuk menurunkan rumus.",
          questionTextDeriving: "Sekarang, turunkan rumus untuk luas trapesium.",
          navMiddle: "Ketuk teks yang disorot.",
          navLast: "Ketuk » untuk menyederhanakan.",
          areaOfParallelogram: "Luas Jajaran Genjang",
          areaOfTrapezoid: "Luas Trapesium",
          base: "Alas",
          height: "Tinggi",
        },
        4: {
          questionText: "Sekarang, turunkan rumus untuk luas trapesium.",
          navText: "Ketuk » untuk merangkum.",
          areaOfTrapezoid: "Luas Trapesium",
        },
      },
      final: {
        heading: "Ringkasan",
        text: "Luas Trapesium = ½ × <yl>(a + b)</yl> × <bl>t</bl>",
        buttonText: "Ulangi dari Awal",
        imageSrc: "assets/finalid.png",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
