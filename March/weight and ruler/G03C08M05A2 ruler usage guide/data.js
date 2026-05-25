const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Using a Ruler / Scale",
        text: "Learn how to align a ruler and read the length of a line segment.",
        buttonText: "Start",
        imageSrc: "assets/start.svg",
      },
      steps: {
        1: {
          questionText: "Measuring using CENTIMETER (cm) scale",
          navText: "Tap » to look at the symbol",
          feedbackText: `Pull out your scale and look at the divisions on it…<br/><br/>
On the screen, let’s zoom in an look at different segments.`,
        },
        2: {
          questionText: "The ‘cm’ symbol stands for CENTIMETER",
          navText: "Tap » to look at the divisions",
          feedbackText: `The symbol ‘cm’ indicates that this ruler let’s us measure in CENTIMETERS.<br/><br/>
Look at the divisions now…`,
        },
        3: {
          questionText: "Divisions on a CENTIMETER (cm) ruler",
          navText: "Tap » to continue",
          feedbackText: `There are <span class="ruler-feedback-gr">larger numbered divisions</span> and <span class="ruler-feedback-bl">smaller divisions</span> in between them.`,
        },
        4: {
          questionText: "Divisions on a CENTIMETER (cm) ruler",
          navText: "Tap » to look at one large division",
          feedbackText: `Notice that the distance between all divisions is exactly the same!`,
        },
        5: {
          questionText: "Every large numbered division is 1 cm",
          navText: "Tap » to look at the division numbers",
          feedbackText: `Look at any 2 large divisions next to one another, and they will have a distance of 1 cm between them, in all cm rulers!`,
        },
        6: {
          questionText: "What do the numbers indicate?",
          navText: "Tap » to look at the small divisions",
          feedbackText: `Each number indicates how many CENTIMETERS of length are moved from the marking 0.`,
        },
        7: {
          questionText: "Small divisions in a cm ruler",
          navText: "Tap » to look at one small division",
          feedbackText: `There are 10 small divisions between each large numbered division.`,
        },
        8: {
          questionText: "Every small division is 1 mm",
          navText: "Tap » to check how many mm are in 1 cm",
          feedbackText: `Look at any 2 small divisions next to one another, and they will have a distance of 1 millimeter or 1 mm between them, in all cm rulers!`,
        },
        9: {
          questionText: "How many mm in 1 cm?",
          navText: "Tap the correct button as per the question",
          navTextCorrect: "Tap » to measure a line segment using the ruler",
          feedbackNeutral: `How many millimeter
(mm) are there in 1
centimeter (cm)?`,
          feedbackWrong: `Oops! 10 small
divisions make 1 large
numbered division…`,
          feedbackCorrect: `That’s Right! 10 small
divisions (mm) make 1
large numbered
division (cm)…`,
          mcqOptions: ["1", "10", "100"],
          mcqCorrect: "10",
        },
        10: {
          questionText: "What is the length of the given line segment?",
          navText: "Tap <b>‘1: Align…’</b> button",
          navAfterAlign: "Tap <b>‘2: Count… large…’</b> button",
          navSlider: "Drag the marker along the line to measure",
          navReadMeasure: "Tap <b>»</b> to read this measure",
          actionIntro: `To find length of <span class="segment-overline">PQ</span>:`,
          button1:
            "1: Align and place the ‘0’ marker of the ruler at one endpoint",
          button2: "2: Count the large divisions till the other endpoint.",
        },
        11: {
          questionText: "What is the length of the given line segment?",
          navText: "Tap <b>»</b> to draw your own line segment",
          feedbackLine:
            'Length of <span class="segment-overline">PQ</span> = 10 cm',
        },
        12: {
          questionText: "Draw any line segment",
          navText: "Drag across the grid to draw a line segment",
          navTextDone: "Tap <b>»</b> to bring in the ruler",
          feedbackIntro: `Part of a line bound by 2 endpoints is called a line segment.<br/><br/>
You can draw a line segment of your choice on the grid.`,
          feedbackFinal: `Good Job!<br/>
With endpoints A and B, this line segment is <span class="segment-overline">AB</span>.`,
        },
        13: {
          questionText: "Steps to measure length of line segment with ruler:",
          navText: "Tap <b>‘1: Align…’</b> button",
          navAfterAlign: "Tap <b>‘2: Count… large…’</b> button",
          navSliderCm: "Drag the cm marker to count large divisions from A to B",
          navAfterCmCorrect:
            "Tap <b>‘3: If there is more distance…’</b> button",
          navSliderMm:
            "Drag the mm marker to count small divisions between {wholeCm} and {wholeCmPlus1}",
          navReadMeasure: "Tap <b>»</b> to continue",
          actionIntro: `To find length of <span class="segment-overline">AB</span>:`,
          button1:
            "1: Align and place the ‘0’ marker of the ruler at one endpoint",
          button2: "2: Count the large divisions till the other endpoint.",
          button3:
            "3: If there is more distance, count the small divisions to the other endpoint",
        },
        14: {
          questionText: "Steps to measure length of line segment with ruler:",
          feedbackLine:
            'Length of <span class="segment-overline">AB</span> = {wholeCm} cm and {mmPart} mm',
          navText: "Tap <b>»</b> for length in mm alone",
        },
        15: {
          questionText: "Steps to measure length of line segment with ruler:",
          feedbackLine: `Since 1 cm = 10 mm,<br/>we can also say length of <span class="segment-overline">AB</span><br/>
= {cmWhole} × 10 + {mmPart} mm<br/>
= {lengthMm} mm`,
          navText: "Tap <b>»</b> to summarise",
        },
      },
      measure: {
        correctCm: 10,
        sliderMax: 20,
        sliderMaxCm: 20,
      },
      finalScreen: {
        heading: "Measuring a line segment using cm ruler",
        text: `1: Align and place the ‘0’ marker of the ruler at one endpoint<br/><br/>
2: Count the CENTIMETERS till the other endpoint from ‘0’.<br/><br/>
3: If there is more distance, count the MILLIMETERS to the other endpoint from the CENTIMETER marker.<br/><br/>
Report in ‘cm and mm’ or ‘mm’.`,
        buttonText: "Start Over",
        imageSrc: "assets/start.svg",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Mengukur ruas garis",
        text: "Pelajari cara memasang penggaris dan membaca panjang suatu ruas garis.",
        buttonText: "Mulai",
        imageSrc: "assets/start.svg",
      },
      steps: {
        1: {
          questionText: "Mengukur memakai skala SENTIMETER (cm)",
          navText: "Ketuk » untuk melihat simbolnya",
          feedbackText: `Ambil penggarismu dan perhatikan pembagiannya…<br/><br/>
Di layar, kita akan memperbesar dan melihat berbagai segmen.`,
        },
        2: {
          questionText: "Simbol ‘cm’ berarti SENTIMETER",
          navText: "Ketuk » untuk melihat pembagiannya",
          feedbackText: `Simbol ‘cm’ menunjukkan bahwa penggaris ini mengukur dalam SENTIMETER.<br/><br/>
Perhatikan pembagiannya sekarang…`,
        },
        3: {
          questionText: "Pembagian pada penggaris SENTIMETER (cm)",
          navText: "Ketuk » untuk melanjutkan",
          feedbackText: `Ada <span class="ruler-feedback-gr">pembagian bernomor yang lebih besar</span> dan <span class="ruler-feedback-bl">pembagian yang lebih kecil</span> di antaranya.`,
        },
        4: {
          questionText: "Pembagian pada penggaris SENTIMETER (cm)",
          navText: "Ketuk » untuk melihat satu pembagian besar",
          feedbackText: `Perhatikan bahwa jarak antara semua pembagian sama persis!`,
        },
        5: {
          questionText: "Setiap pembagian bernomor besar bernilai 1 cm",
          navText: "Ketuk » untuk melihat angka pembagian",
          feedbackText: `Perhatikan dua pembagian besar yang bersebelahan: jaraknya 1 cm, pada semua penggaris cm!`,
        },
        6: {
          questionText: "Apa arti angka-angkanya?",
          navText: "Ketuk » untuk melihat pembagian kecil",
          feedbackText: `Setiap angka menunjukkan berapa SENTIMETER panjang yang diukur dari tanda 0.`,
        },
        7: {
          questionText: "Pembagian kecil pada penggaris cm",
          navText: "Ketuk » untuk melihat satu pembagian kecil",
          feedbackText: `Ada 10 pembagian kecil di antara setiap pembagian besar bernomor.`,
        },
        8: {
          questionText: "Setiap pembagian kecil bernilai 1 mm",
          navText: "Ketuk » untuk memeriksa berapa mm dalam 1 cm",
          feedbackText: `Perhatikan dua pembagian kecil yang bersebelahan: jaraknya 1 milimeter atau 1 mm, pada semua penggaris cm!`,
        },
        9: {
          questionText: "Ada berapa mm dalam 1 cm?",
          navText: "Ketuk tombol jawaban yang benar",
          navTextCorrect: "Ketuk » untuk mengukur ruas garis dengan penggaris",
          feedbackNeutral: `Ada berapa milimeter
(mm) di dalam 1
sentimeter (cm)?`,
          feedbackWrong: `Oops! 10 pembagian kecil
membentuk 1 pembagian
besar bernomor…`,
          feedbackCorrect: `Benar! 10 pembagian kecil
(mm) membentuk 1
pembagian besar
bernomor (cm)…`,
          mcqOptions: ["1", "10", "100"],
          mcqCorrect: "10",
        },
        10: {
          questionText: "Berapakah panjang ruas garis yang diberikan?",
          navText: "Ketuk tombol <b>‘1: Sejajarkan…’</b>",
          navAfterAlign: "Ketuk tombol <b>‘2: Hitung… besar…’</b>",
          navSlider: "Seret penanda di sepanjang garis untuk mengukur",
          navReadMeasure: "Ketuk <b>»</b> untuk membaca hasil ukur",
          actionIntro: "Untuk mencari panjang PQ:",
          button1:
            "1: Sejajarkan dan letakkan penanda ‘0’ penggaris di salah satu ujung",
          button2: "2: Hitung pembagian besar sampai ke ujung yang lain.",
        },
        11: {
          questionText: "Berapakah panjang ruas garis yang diberikan?",
          navText: "Ketuk <b>»</b> untuk menggambar ruas garis Anda sendiri",
          feedbackLine:
            'Panjang <span class="segment-overline">PQ</span> = 10 cm',
        },
        12: {
          questionText: "Gambar sembarang ruas garis",
          navText: "Seret melintasi petak untuk menggambar ruas garis",
          navTextDone: "Ketuk <b>»</b> untuk membawa penggaris",
          feedbackIntro: `Sebagian garis yang dibatasi 2 titik ujung disebut ruas garis.<br/><br/>
Anda dapat menggambar ruas garis pilihan Anda pada petak.`,
          feedbackFinal: `Bagus!<br/>
Dengan titik ujung A dan B, ruas garis ini adalah <span class="segment-overline">AB</span>.`,
        },
        13: {
          questionText:
            'Pengukuran Ruas Garis <span class="segment-overline">AB</span> memakai penggaris cm:',
          navText: "Ketuk tombol <b>‘1: Sejajarkan…’</b>",
          navAfterAlign: "Ketuk tombol <b>‘2: Hitung… besar…’</b>",
          navSliderCm:
            "Seret penanda cm untuk menghitung pembagian besar dari A ke B",
          navAfterCmCorrect: "Ketuk tombol <b>‘3: Jika masih ada jarak…’</b>",
          navSliderMm:
            "Seret penanda mm untuk hitung pembagian kecil {wholeCm}–{wholeCmPlus1}",
          navReadMeasure: "Ketuk <b>»</b> untuk melanjutkan",
          actionIntro: "Untuk mencari panjang AB:",
          button1:
            "1: Sejajarkan dan letakkan penanda ‘0’ penggaris di salah satu ujung",
          button2: "2: Hitung pembagian besar sampai ke ujung yang lain.",
          button3:
            "3: Jika masih ada jarak, hitung pembagian kecil sampai ke ujung yang lain",
        },
        14: {
          questionText:
            'Pengukuran Ruas Garis <span class="segment-overline">AB</span> memakai penggaris cm:',
          feedbackLine:
            'Panjang <span class="segment-overline">AB</span> = {wholeCm} cm dan {mmPart} mm',
          navText: "Ketuk <b>»</b> untuk panjang dalam mm saja",
        },
        15: {
          questionText:
            'Pengukuran Ruas Garis <span class="segment-overline">AB</span> memakai penggaris cm:',
          feedbackLine: `Karena 1 cm = 10 mm,<br/>kita juga dapat mengatakan panjang <span class="segment-overline">AB</span><br/>
= {cmWhole} × 10 + {mmPart} mm<br/>
= {lengthMm} mm`,
          navText: "Ketuk <b>»</b> untuk merangkum",
        },
      },
      measure: {
        correctCm: 10,
        sliderMax: 20,
        sliderMaxCm: 20,
      },
      finalScreen: {
        heading: "Ringkasan",
        text: `1: Sejajarkan dan letakkan penanda ‘0’ penggaris di salah satu ujung<br/><br/>
2: Hitung SENTIMETER sampai ke ujung lain dari ‘0’.<br/><br/>
3: Jika masih ada jarak, hitung MILIMETER ke ujung lain dari penanda SENTIMETER.<br/><br/>
Laporkan dalam ‘cm dan mm’ atau ‘mm’.`,
        buttonText: "Ulangi dari Awal",
        imageSrc: "assets/start.svg",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
