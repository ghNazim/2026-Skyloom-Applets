const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      fullscreenStart: {
        heading: "Area of a composite shape",
        text: 'Let\'s decompose composite shapes and find their area.\nTap "Start" to start the activity.',
        button: "Start",
      },
      fullscreenEnd: {
        heading: "Activity Completed!",
        text: 'We learned to decompose composite shapes and find their area.\nTap "Start Over" to restart the activity.',
        button: "Start Over",
      },
      step1: {
        questionText: "Find the area of the given composite shape.",
        navText: "Tap the button to explore steps.",
        buttonText: "Steps to find Area",
      },
      step2: {
        navText: "Tap » to continue.",
      },
      step3: {
        navText: "Tap a button of your choice.",
        navTextAfterSelect: "Tap » to add labels.",
        split2Button: "Split into 2 shapes",
        split3Button: "Split into 3 shapes",
      },
      rightPanelSteps: [
        {
          title: "Step 1:",
          desc: "Decompose the composite shape into known shapes.",
        },
        {
          title: "Step 2:",
          desc: "Calculate the area of these known shapes individually.",
        },
        {
          title: "Step 3:",
          desc: "Add or subtract the areas of these known shapes.",
        },
      ],
      commonNavs: {
        navNumpad: "Use the numpad to fill the answer and click ✓.",
        navCorrect: "Tap » to continue.",
        navHighlightBox: "Tap the highlighted text.",
      },
      step5NavSummarise: "Tap » to summarise.",
      split2Labels: {
        t1class: "t1",
        t1: "Trapezoid 1",
        t1a: "Area = 45 cm²",
        a1step: 8,
        t2class: "t2",
        t2: "Trapezoid 2",
        t2a: "Area = 38 cm²",
        a2step: 14,
      },
      split3Labels: {
        r1class: "r1",
        r1: "Rectangle 1",
        r1a: "Area = 48 cm²",
        a1step: 5,
        r2class: "r2",
        r2: "Rectangle 2",
        r2a: "Area = 25 cm²",
        a2step: 12,
        trclass: "tr",
        tr: "Triangle",
        tra: "Area = 10 cm²",
        a3step: 18,
      },
      split2Config: [
        {
          text1: "Area of trapezoid 1 = ½ (base 1 + base 2) × height",
          nav: "Tap » to identify the required sides.",
          img: "a1.svg",
        },
        {
          text1: "Area of trapezoid 1 = ½ ( [AD]  +  BC ) × DZ",
          img: "a1_ad.svg",
        },
        {
          text1: "Area of trapezoid 1 = ½ (  AD  +  BC ) × DZ",
          text2: "AD = 13 – (4 + 4) = [box] cm",
          answer: "5",
          img: "a1_ad.svg",
          imgCorrect: "a1_ad_found.svg",
        },
        {
          text1: "Area of trapezoid 1 = ½ (  5  +  [BC] ) × DZ",
          img: "a1_bc.svg",
        },
        {
          text1: "Area of trapezoid 1 = ½ (  5  +  13 ) × [DZ]",
          img: "a1_dz.svg",
        },
        {
          text1: "Area of trapezoid 1 = ½ (  5  +  13 ) × DZ",
          text2: "DZ = 12 – 7 = [box] cm",
          answer: "5",
          img: "a1_dz.svg",
          imgCorrect: "a1_dz_found.svg",
        },
        {
          text1: "Area of trapezoid 1 = ½ (  5  +  13 ) × 5",
          nav: "Tap » to calculate the area of trapezoid 1.",
          img: "a1_dz_found.svg",
        },
        {
          text1: "Area of trapezoid 1 = 45 cm²",
          nav: "Tap » to find the area of trapezoid 2.",
          img: "a1_dz_found.svg",
        },
        {
          text1: "Area of trapezoid 2 = ½ (base 1 + base 2) × height",
          nav: "Tap » to identify the required sides.",
          img: "a2.svg",
        },
        {
          text1: "Area of trapezoid 2 = ½ ( [GH] + EF ) × GF",
          img: "a2_gh.svg",
        },
        {
          text1: "Area of trapezoid 2 = ½ ( 7 + [EF] ) × GF",
          img: "a2_ef.svg",
        },
        {
          text1: "Area of trapezoid 2 = ½ ( 7 + 12 ) × [GF]",
          img: "a2_gf.svg",
        },
        {
          text1: "Area of trapezoid 2 = ½ ( 7 + 12 ) × 4",
          nav: "Tap » to calculate the area of trapezoid 2.",
          img: "a2.svg",
        },
        {
          text1: "Area of trapezoid 2 = 38 cm²",
          nav: "Tap » to move to step 3.",
          img: "a2.svg",
        },
      ],
      step5: {
        img: "afull.svg",
        texts: [
          "Area of composite shape = Area of (Trapezoid 1 + Trapezoid 2)",
          "Area of composite shape = 45 cm² + 38 cm²",
          "Area of composite shape = 83 cm²",
        ],
        navs: [
          "Tap » to find the total area.",
          "Tap » to calculate the total area.",
          "Tap » to see another way to find the area of this shape.",
        ],
      },
      step5Split3: {
        img: "bfull.svg",
        texts: [
          "Area of composite shape = Area of (Rectangle 1 + Rectangle 2 + Triangle)",
          "Area of composite shape = 48 cm² + 25 cm² + 10 cm²",
          "Area of composite shape = 83 cm²",
        ],
        navs: [
          "Tap » to find the total area.",
          "Tap » to calculate the total area.",
          "Tap » to see another way to find the area of this shape.",
        ],
      },
      split3Config: [
        {
          text1: "Area of rectangle 1 = width × height",
          nav: "Tap » to identify the required sides.",
          img: "b1.svg",
        },
        {
          text1: "Area of rectangle 1 = [JK] × IJ",
          img: "b1_jk.svg",
        },
        {
          text1: "Area of rectangle 1 = 4 × [IJ]",
          img: "b1_ij.svg",
        },
        {
          text1: "Area of rectangle 1 = 4 × 12",
          nav: "Tap » to calculate the area of rectangle 1.",
          img: "b1.svg",
        },
        {
          text1: "Area of rectangle 1 = 48 cm²",
          nav: "Tap » to find the area of rectangle 2.",
          img: "b1.svg",
        },
        {
          text1: "Area of rectangle 2 = width × height",
          nav: "Tap » to identify the required sides.",
          img: "b2.svg",
        },
        {
          text1: "Area of rectangle 2 = [DE] × EF",
          img: "b2_de.svg",
        },
        {
          text1: "Area of rectangle 2 = DE × EF",
          text2: "DE = 13 - 4 - 4 = [box] cm",
          answer: "5",
          img: "b2_de.svg",
          imgCorrect: "b2_de_found.svg",
        },
        {
          text1: "Area of rectangle 2 = 5 × [EF]",
          img: "b2_ef.svg",
        },
        {
          text1: "Area of rectangle 2 = 5 × EF",
          text2: "EF = 12 - 7 = [box] cm",
          answer: "5",
          img: "b2_ef.svg",
          imgCorrect: "b2_ef_found.svg",
        },
        {
          text1: "Area of rectangle 2 = 5 × 5",
          nav: "Tap » to calculate the area of rectangle 2.",
          img: "b2_ef_found.svg",
        },
        {
          text1: "Area of rectangle 2 = 25 cm²",
          nav: "Tap » to find the area of the triangle.",
          img: "b2_ef_found.svg",
        },
        {
          text1: "Area of triangle = ½ × base × height",
          nav: "Tap » to identify the required sides.",
          img: "b3.svg",
        },
        {
          text1: "Area of triangle = ½ × [AB] × BC",
          img: "b3_ab.svg",
        },
        {
          text1: "Area of triangle = ½ × 4 × [BC]",
          img: "b3_bc.svg",
        },
        {
          text1: "Area of triangle = ½ × 4 × BC",
          text2: "BC = EF = [box] cm",
          answer: "5",
          img: "b3_bc.svg",
          imgCorrect: "b3_bc_found.svg",
        },
        {
          text1: "Area of triangle = ½ × 4 × 5",
          nav: "Tap » to calculate the area of the triangle.",
          img: "b3_bc_found.svg",
        },
        {
          text1: "Area of triangle = 10 cm²",
          nav: "Tap » to move to step 3.",
          img: "b3_bc_found.svg",
        },
      ],
    },
  },
  id: {
    app: {
      fullscreenStart: {
        heading: "Luas Bangun Gabungan",
        text: 'Mari kita uraikan bangun gabungan dan temukan luasnya.\nKetuk "Mulai" untuk memulai aktivitas.',
        button: "Mulai",
      },
      fullscreenEnd: {
        heading: "Aktivitas Selesai!",
        text: 'Kita telah belajar menguraikan bangun gabungan dan menemukan luasnya.\nKetuk "Mulai Ulang" untuk memulai ulang aktivitas.',
        button: "Mulai Ulang",
      },
      step1: {
        questionText: "Temukan luas bangun gabungan yang diberikan.",
        navText: "Ketuk tombol untuk menjelajahi langkah-langkah.",
        buttonText: "Langkah Mencari Luas",
      },
      step2: {
        navText: "Ketuk » untuk melanjutkan.",
      },
      step3: {
        navText: "Ketuk tombol pilihan Anda.",
        navTextAfterSelect: "Ketuk » untuk menambahkan label.",
        split2Button: "Bagi menjadi 2 bangun",
        split3Button: "Bagi menjadi 3 bangun",
      },
      rightPanelSteps: [
        {
          title: "Langkah 1:",
          desc: "Uraikan bangun gabungan menjadi bangun yang diketahui.",
        },
        {
          title: "Langkah 2:",
          desc: "Hitung luas masing-masing bangun yang diketahui.",
        },
        {
          title: "Langkah 3:",
          desc: "Jumlahkan atau kurangkan luas bangun-bangun yang diketahui.",
        },
      ],
      commonNavs: {
        navNumpad: "Gunakan numpad untuk mengisi jawaban dan klik ✓.",
        navCorrect: "Ketuk » untuk melanjutkan.",
        navHighlightBox: "Ketuk teks yang disorot.",
      },
      step5NavSummarise: "Ketuk » untuk merangkum.",
      split2Labels: {
        t1class: "t1",
        t1: "Trapesium 1",
        t1a: "Luas = 45 cm²",
        a1step: 8,
        t2class: "t2",
        t2: "Trapesium 2",
        t2a: "Luas = 38 cm²",
        a2step: 14,
      },
      split3Labels: {
        r1class: "r1",
        r1: "Persegi Panjang 1",
        r1a: "Luas = 48 cm²",
        a1step: 5,
        r2class: "r2",
        r2: "Persegi Panjang 2",
        r2a: "Luas = 25 cm²",
        a2step: 12,
        trclass: "tr",
        tr: "Segitiga",
        tra: "Luas = 10 cm²",
        a3step: 18,
      },
      split2Config: [
        {
          text1: "Luas trapesium 1 = ½ (alas 1 + alas 2) × tinggi",
          nav: "Ketuk » untuk mengidentifikasi sisi yang diperlukan.",
          img: "a1.svg",
        },
        {
          text1: "Luas trapesium 1 = ½ ( [AD]  +  BC ) × DZ",
          img: "a1_ad.svg",
        },
        {
          text1: "Luas trapesium 1 = ½ (  AD  +  BC ) × DZ",
          text2: "AD = 13 – (4 + 4) = [box] cm",
          answer: "5",
          img: "a1_ad.svg",
          imgCorrect: "a1_ad_found.svg",
        },
        {
          text1: "Luas trapesium 1 = ½ (  5  +  [BC] ) × DZ",
          img: "a1_bc.svg",
        },
        {
          text1: "Luas trapesium 1 = ½ (  5  +  13 ) × [DZ]",
          img: "a1_dz.svg",
        },
        {
          text1: "Luas trapesium 1 = ½ (  5  +  13 ) × DZ",
          text2: "DZ = 12 – 7 = [box] cm",
          answer: "5",
          img: "a1_dz.svg",
          imgCorrect: "a1_dz_found.svg",
        },
        {
          text1: "Luas trapesium 1 = ½ (  5  +  13 ) × 5",
          nav: "Ketuk » untuk menghitung luas trapesium 1.",
          img: "a1_dz_found.svg",
        },
        {
          text1: "Luas trapesium 1 = 45 cm²",
          nav: "Ketuk » untuk menemukan luas trapesium 2.",
          img: "a1_dz_found.svg",
        },
        {
          text1: "Luas trapesium 2 = ½ (alas 1 + alas 2) × tinggi",
          nav: "Ketuk » untuk mengidentifikasi sisi yang diperlukan.",
          img: "a2.svg",
        },
        {
          text1: "Luas trapesium 2 = ½ ( [GH] + EF ) × GF",
          img: "a2_gh.svg",
        },
        {
          text1: "Luas trapesium 2 = ½ ( 7 + [EF] ) × GF",
          img: "a2_ef.svg",
        },
        {
          text1: "Luas trapesium 2 = ½ ( 7 + 12 ) × [GF]",
          img: "a2_gf.svg",
        },
        {
          text1: "Luas trapesium 2 = ½ ( 7 + 12 ) × 4",
          nav: "Ketuk » untuk menghitung luas trapesium 2.",
          img: "a2.svg",
        },
        {
          text1: "Luas trapesium 2 = 38 cm²",
          nav: "Ketuk » untuk melanjutkan ke langkah 3.",
          img: "a2.svg",
        },
      ],
      step5: {
        img: "afull.svg",
        texts: [
          "Luas bangun gabungan = Luas (Trapesium 1 + Trapesium 2)",
          "Luas bangun gabungan = 45 cm² + 38 cm²",
          "Luas bangun gabungan = 83 cm²",
        ],
        navs: [
          "Ketuk » untuk menemukan luas total.",
          "Ketuk » untuk menghitung luas total.",
          "Ketuk » untuk melihat cara lain menemukan luas bangun ini.",
        ],
      },
      step5Split3: {
        img: "bfull.svg",
        texts: [
          "Luas bangun gabungan = Luas (Persegi Panjang 1 + Persegi Panjang 2 + Segitiga)",
          "Luas bangun gabungan = 48 cm² + 25 cm² + 10 cm²",
          "Luas bangun gabungan = 83 cm²",
        ],
        navs: [
          "Ketuk » untuk menemukan luas total.",
          "Ketuk » untuk menghitung luas total.",
          "Ketuk » untuk melihat cara lain menemukan luas bangun ini.",
        ],
      },
      split3Config: [
        {
          text1: "Luas persegi panjang 1 = lebar × tinggi",
          nav: "Ketuk » untuk mengidentifikasi sisi yang diperlukan.",
          img: "b1.svg",
        },
        {
          text1: "Luas persegi panjang 1 = [JK] × IJ",
          img: "b1_jk.svg",
        },
        {
          text1: "Luas persegi panjang 1 = 4 × [IJ]",
          img: "b1_ij.svg",
        },
        {
          text1: "Luas persegi panjang 1 = 4 × 12",
          nav: "Ketuk » untuk menghitung luas persegi panjang 1.",
          img: "b1.svg",
        },
        {
          text1: "Luas persegi panjang 1 = 48 cm²",
          nav: "Ketuk » untuk menemukan luas persegi panjang 2.",
          img: "b1.svg",
        },
        {
          text1: "Luas persegi panjang 2 = lebar × tinggi",
          nav: "Ketuk » untuk mengidentifikasi sisi yang diperlukan.",
          img: "b2.svg",
        },
        {
          text1: "Luas persegi panjang 2 = [DE] × EF",
          img: "b2_de.svg",
        },
        {
          text1: "Luas persegi panjang 2 = DE × EF",
          text2: "DE = 13 - 4 - 4 = [box] cm",
          answer: "5",
          img: "b2_de.svg",
          imgCorrect: "b2_de_found.svg",
        },
        {
          text1: "Luas persegi panjang 2 = 5 × [EF]",
          img: "b2_ef.svg",
        },
        {
          text1: "Luas persegi panjang 2 = 5 × EF",
          text2: "EF = 12 - 7 = [box] cm",
          answer: "5",
          img: "b2_ef.svg",
          imgCorrect: "b2_ef_found.svg",
        },
        {
          text1: "Luas persegi panjang 2 = 5 × 5",
          nav: "Ketuk » untuk menghitung luas persegi panjang 2.",
          img: "b2_ef_found.svg",
        },
        {
          text1: "Luas persegi panjang 2 = 25 cm²",
          nav: "Ketuk » untuk menemukan luas segitiga.",
          img: "b2_ef_found.svg",
        },
        {
          text1: "Luas segitiga = ½ × alas × tinggi",
          nav: "Ketuk » untuk mengidentifikasi sisi yang diperlukan.",
          img: "b3.svg",
        },
        {
          text1: "Luas segitiga = ½ × [AB] × BC",
          img: "b3_ab.svg",
        },
        {
          text1: "Luas segitiga = ½ × 4 × [BC]",
          img: "b3_bc.svg",
        },
        {
          text1: "Luas segitiga = ½ × 4 × BC",
          text2: "BC = EF = [box] cm",
          answer: "5",
          img: "b3_bc.svg",
          imgCorrect: "b3_bc_found.svg",
        },
        {
          text1: "Luas segitiga = ½ × 4 × 5",
          nav: "Ketuk » untuk menghitung luas segitiga.",
          img: "b3_bc_found.svg",
        },
        {
          text1: "Luas segitiga = 10 cm²",
          nav: "Ketuk » untuk melanjutkan ke langkah 3.",
          img: "b3_bc_found.svg",
        },
      ],
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
