const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Understanding Transversal and the Angles it Forms",
        text: "Let’s explore what a transversal is,<br>and the angles formed at the intersection of lines.",
        buttonText: "Start",
      },
      steps: {
        1: {
          navText: "Tap the line to bring in another line",
        },
        2: {
          rightText: "2 lines meeting<br>at a <span class='highlight single-point active'>single point</span><br>are called<br>intersecting lines.",
          navText: "Tap the highlighted text.",
        },
        3: {
          rightText: "2 lines meeting<br>at a <span class='highlight single-point inactive'>single point</span><br>are called<br><span class='highlight intersecting-lines active'>intersecting lines</span>.",
          navText: "Tap the highlighted text.",
        },
        4: {
          rightText: "2 lines meeting<br>at a <span class='highlight single-point inactive'>single point</span><br>are called<br><span class='highlight intersecting-lines inactive'>intersecting lines</span>.",
          navText: "Tap the blue line to bring in another intersecting line.",
        },
        5: {
          rightText: "<span class='highlight two-or-more-lines active'>A line intersecting<br>two or more lines</span><br>at different points<br>is called a<br>transversal.",
          navText: "Tap the highlighted text.",
        },
        6: {
          rightText: "<span class='highlight two-or-more-lines inactive'>A line intersecting<br>two or more lines</span><br>at <span class='highlight different-points active'>different points</span><br>is called a<br>transversal.",
          navText: "Tap the highlighted text.",
        },
        7: {
          rightText: "<span class='highlight two-or-more-lines inactive'>A line intersecting<br>two or more lines</span><br>at <span class='highlight different-points inactive'>different points</span><br>is called a<br><span class='highlight transversal-highlight active'>transversal</span>.",
          navText: "Tap the highlighted text.",
          navNext: "Tap » to see how the transversal forms angles.",
        },
        8: {
          rightText: "When a <span class='highlight transversal-highlight-2 inactive'>transversal</span><br>intersects with<br><span class='highlight two-lines inactive'>two lines</span> forms<br><span class='highlight eight-angles active'>8 angles</span>.",
          navText: "Tap the highlighted text.",
          navNext: "Tap any angle to notice ‘where it is present’.",
        },
        i1: {
          rightText: "All angles<br><span class='highlight between-two-lines active'>between the two lines</span><br>are called<br>interior angles.",
          navText: "Tap the highlighted text.",
        },
        i2: {
          rightText: "All angles<br><span class='highlight between-two-lines inactive'>between the two lines</span><br>are called<br><span class='highlight interior-angles active'>interior angles</span>.",
          navText: "Tap the highlighted text.",
        },
        i3: {
          rightText: "All angles<br><span class='highlight between-two-lines inactive'>between the two lines</span><br>are called<br><span class='highlight interior-angles inactive'>interior angles</span>.",
          navText: "Tap any non-interior angle.",
          navNext: "Tap » to summarise.",
        },
        e1: {
          rightText: "All angles<br><span class='highlight outside-two-lines active'>outside the two lines</span> are<br>called<br>exterior angles.",
          navText: "Tap the highlighted text.",
        },
        e2: {
          rightText: "All angles<br><span class='highlight outside-two-lines inactive'>outside the two lines</span> are<br>called<br><span class='highlight exterior-angles active'>exterior angles</span>.",
          navText: "Tap the highlighted text.",
        },
        e3: {
          rightText: "All angles<br><span class='highlight outside-two-lines inactive'>outside the two lines</span> are<br>called<br><span class='highlight exterior-angles inactive'>exterior angles</span>.",
          navText: "Tap any non-exterior angle.",
          navNext: "Tap » to summarise.",
        },
        ie4: {
          rightText: "A Transversal intersecting<br>2 lines makes 8 angles:<br>4 interior angles and<br>4 exterior angles.",
          navText: "Tap 'Start Over' to go through the lesson again",
          nextText: "Start Over"
        },
      },
      final: {
        heading: "Summary",
        text: "Summary text here.",
        buttonText: "Start Over",
        imageSrc: "assets/final.png",
      },
      labels: {
        transversal: "Transversal",
        interiorAngles: "Interior Angles",
        exteriorAngles: "Exterior Angles"
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Memahami Transversal dan Sudut yang Dibentuknya",
        text: "Mari kita jelajahi apa itu transversal,<br>dan sudut-sudut yang terbentuk pada perpotongan garis.",
        buttonText: "Mulai",
      },
      steps: {
        1: {
          navText: "Ketuk garis untuk memunculkan garis lain",
        },
        2: {
          rightText: "2 garis yang bertemu<br>di satu <span class='highlight single-point active'>titik tunggal</span><br>disebut<br>garis berpotongan.",
          navText: "Ketuk teks yang disorot.",
        },
        3: {
          rightText: "2 garis yang bertemu<br>di satu <span class='highlight single-point inactive'>titik tunggal</span><br>disebut<br><span class='highlight intersecting-lines active'>garis berpotongan</span>.",
          navText: "Ketuk teks yang disorot.",
        },
        4: {
          rightText: "2 garis yang bertemu<br>di satu <span class='highlight single-point inactive'>titik tunggal</span><br>disebut<br><span class='highlight intersecting-lines inactive'>garis berpotongan</span>.",
          navText: "Ketuk garis biru untuk memunculkan garis berpotongan lain.",
        },
        5: {
          rightText: "<span class='highlight two-or-more-lines active'>Garis yang memotong<br>dua garis atau lebih</span><br>di titik yang berbeda<br>disebut<br>transversal.",
          navText: "Ketuk teks yang disorot.",
        },
        6: {
          rightText: "<span class='highlight two-or-more-lines inactive'>Garis yang memotong<br>dua garis atau lebih</span><br>di <span class='highlight different-points active'>titik yang berbeda</span><br>disebut<br>transversal.",
          navText: "Ketuk teks yang disorot.",
        },
        7: {
          rightText: "<span class='highlight two-or-more-lines inactive'>Garis yang memotong<br>dua garis atau lebih</span><br>di <span class='highlight different-points inactive'>titik yang berbeda</span><br>disebut<br><span class='highlight transversal-highlight active'>transversal</span>.",
          navText: "Ketuk teks yang disorot.",
          navNext: "Ketuk » untuk melihat bagaimana transversal membentuk sudut.",
        },
        8: {
          rightText: "Ketika sebuah <span class='highlight transversal-highlight-2 inactive'>transversal</span><br>berpotongan dengan<br><span class='highlight two-lines inactive'>dua garis</span> akan membentuk<br><span class='highlight eight-angles active'>8 sudut</span>.",
          navText: "Ketuk teks yang disorot.",
          navNext: "Ketuk sudut mana saja untuk memperhatikan 'di mana posisinya'.",
        },
        i1: {
          rightText: "Semua sudut<br><span class='highlight between-two-lines active'>di antara dua garis</span><br>disebut<br>sudut dalam.",
          navText: "Ketuk teks yang disorot.",
        },
        i2: {
          rightText: "Semua sudut<br><span class='highlight between-two-lines inactive'>di antara dua garis</span><br>disebut<br><span class='highlight interior-angles active'>sudut dalam</span>.",
          navText: "Ketuk teks yang disorot.",
        },
        i3: {
          rightText: "Semua sudut<br><span class='highlight between-two-lines inactive'>di antara dua garis</span><br>disebut<br><span class='highlight interior-angles inactive'>sudut dalam</span>.",
          navText: "Ketuk sudut mana saja yang bukan sudut dalam.",
          navNext: "Ketuk » untuk meringkas.",
        },
        e1: {
          rightText: "Semua sudut<br><span class='highlight outside-two-lines active'>di luar dua garis</span><br>disebut<br>sudut luar.",
          navText: "Ketuk teks yang disorot.",
        },
        e2: {
          rightText: "Semua sudut<br><span class='highlight outside-two-lines inactive'>di luar dua garis</span><br>disebut<br><span class='highlight exterior-angles active'>sudut luar</span>.",
          navText: "Ketuk teks yang disorot.",
        },
        e3: {
          rightText: "Semua sudut<br><span class='highlight outside-two-lines inactive'>di luar dua garis</span><br>disebut<br><span class='highlight exterior-angles inactive'>sudut luar</span>.",
          navText: "Ketuk sudut mana saja yang bukan sudut luar.",
          navNext: "Ketuk » untuk meringkas.",
        },
        ie4: {
          rightText: "Transversal yang memotong<br>2 garis menghasilkan 8 sudut:<br>4 sudut dalam dan<br>4 sudut luar.",
          navText: "Ketuk 'Ulangi' untuk memulai pelajaran lagi",
          nextText: "Ulangi"
        },
      },
      final: {
        heading: "Ringkasan",
        text: "Teks ringkasan di sini.",
        buttonText: "Ulangi dari Awal",
        imageSrc: "assets/final.png",
      },
      labels: {
        transversal: "Transversal",
        interiorAngles: "Sudut Dalam",
        exteriorAngles: "Sudut Luar"
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
