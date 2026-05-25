const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Using a known grid to measure line segments",
        text: `With different line segments
given to you, let’s see if you can
measure the lengths…<br/><br/>
Let’s start with counting
grid-lines before we get to
using a ruler.`,
        buttonText: "Start",
        imageSrc: "assets/start.svg",
      },
      interludeRuler: {
        heading: "Using a Ruler / Scale to measure line segments",
        text: `Good job! Counting the grid cells
between the endpoints gave us
the measure of the line segment
in terms of the grid size.<br/><br/>
Now, let’s see if you can measure
line segments with a ruler…`,
        buttonText: "Continue",
        imageSrc: "assets/start.svg",
      },
      interludeMm: {
        heading: "Using a Ruler / Scale to measure line segments",
        text: `Good job! Counting the number
of centimeters from 0 placed at
one end point to the other
endpoint gives us the length of
the line segment.<br/><br/>
Level Up — Now, let’s try using the
smaller divisions too…`,
        buttonText: "Continue",
        imageSrc: "assets/start.svg",
      },
      endShapes: {
        heading:
          "Different shapes can be made by connecting corners with line segments",
        text: `Level Up Again<br/><br/>
Let’s measure the length
of sides of different shapes`,
        buttonText: "Continue",
        imageSrc: "assets/start.svg",
      },
      endRuler: {
        heading: "Good going on measuring a line segment using cm ruler!",
        text: `1: Align and place the ‘0’ marker
of the ruler at one endpoint<br/>
2: Count the CENTIMETERS till
the other endpoint from ‘0’.<br/>
3: If there is more distance, count the
MILLIMETERS to the other endpoint
from the CENTIMETER marker.<br/><br/>
Report in ‘cm and mm’ or ‘mm’.`,
        buttonText: "Start Over",
        imageSrc: "assets/start.svg",
      },
      steps: {
        1: {
          questionText: "",
          navText: "",
          questions: [
            {
              id: "q1",
              questionText:
                "If each box in the grid is 1 cm, what is the length of the line segment shown?",
              navTextInitial: "Enter the correct length of PQ using the numpad",
              navTextCorrect: "Tap » for another challenge",
              statementLabel:
                'Length of <span class="segment-overline">PQ</span> =',
              unit: "cm",
              wrongFeedback: "Oops! Try Again!",
              correctFeedback:
                "Good Going!<br/>Points P and Q are<br/>separated by 5 cells<br/>between them!",
              answer: 5,
              shape: "segment",
              measureSegment: "PQ",
              points: { p: [6, 8], q: [11, 8] },
            },
            {
              id: "q2",
              questionText:
                "If each box in the grid is 1 cm, what is the length of the line segment shown?",
              navTextInitial: "Enter the correct length of MN using the numpad",
              navTextCorrect: "Tap » for another challenge",
              statementLabel:
                'Length of <span class="segment-overline">MN</span> =',
              unit: "cm",
              wrongFeedback: "Oops! Try Again!",
              correctFeedback:
                "Good Going!<br/>Points M and N are<br/>separated by 7 cells<br/>between them!",
              answer: 7,
              shape: "segment",
              measureSegment: "MN",
              points: { p: [9, 3], q: [9, 10] },
            },
            {
              id: "q3",
              questionText:
                "If each box in the grid is 1 cm, what is the length of square side?",
              navTextInitial: "Enter the correct length of AB using the numpad",
              navTextCorrect: "Tap » to continue",
              statementLabel:
                'Length of <span class="segment-overline">AB</span> =',
              unit: "cm",
              wrongFeedback: "Oops! Try Again!",
              correctFeedback:
                "Good Going!<br/>Each side of square ABCD<br/>is 4 cells long!",
              answer: 4,
              shape: "square",
              measureSegment: "AB",
              points: { a: [9, 4], b: [13, 4], c: [13, 8], d: [9, 8] },
            },
          ],
        },
        3: {
          questionText: "What is the length of the given line segment?",
          navTextDrag:
            "Drag the ruler so that it’s ‘0’ mark aligns with point P",
          navTextRotate:
            "Rotate the ruler by dragging '↻' to align with the line segment",
          navTextSlider: "Move the marker to endpoint Q using the slider",
          navTextAnother: "Tap » for another challenge",
          actionIntro: `To find length of <span class="segment-overline">PQ</span>:`,
          step1:
            "1: Align and place the ‘0’ marker of the ruler at one endpoint",
          step2: "2: Count the large divisions till the other endpoint.",
          lengthLabel: 'Length of <span class="segment-overline">PQ</span> =',
          lengthUnit: "cm",
          questions: [
            {
              id: "s3-q1",
              segment: "PQ",
              startLabel: "P",
              endLabel: "Q",
              questionText: "What is the length of the given line segment?",
              navTextDrag:
                "Drag the ruler so that it’s ‘0’ mark aligns with point P",
              navTextRotate:
                "Rotate the ruler so that it aligns with the line segment",
              navTextSlider: "Move the marker to endpoint Q using the slider",
              navTextDone: "Tap » for another challenge",
              actionIntro:
                'To find length of <span class="segment-overline">PQ</span>:',
              step1:
                "1: Align and place the ‘0’ marker of the ruler at one endpoint",
              step2: "2: Count the large divisions till the other endpoint.",
              lengthLabel:
                'Length of <span class="segment-overline">PQ</span> =',
              lengthUnit: "cm",
              lengthMm: 100,
              points: { start: [68, 210], end: [360, 100] },
            },
            {
              id: "s3-q2",
              segment: "MN",
              startLabel: "M",
              endLabel: "N",
              questionText: "What is the length of the given line segment?",
              navTextDrag:
                "Drag the ruler so that it’s ‘0’ mark aligns with point M",
              navTextRotate:
                "Rotate the ruler so that it aligns with the line segment",
              navTextSlider: "Move the marker to endpoint N using the slider",
              navTextDone: "Tap » for another challenge",
              actionIntro:
                'To find length of <span class="segment-overline">MN</span>:',
              step1:
                "1: Align and place the ‘0’ marker of the ruler at one endpoint",
              step2: "2: Count the large divisions till the other endpoint.",
              lengthLabel:
                'Length of <span class="segment-overline">MN</span> =',
              lengthUnit: "cm",
              lengthMm: 80,
              points: { start: [115, 90], end: [355, 215] },
            },
            {
              id: "s3-q3",
              segment: "AB",
              startLabel: "A",
              endLabel: "B",
              questionText: "What is the length of the given line segment?",
              navTextDrag:
                "Drag the ruler so that it’s ‘0’ mark aligns with point A",
              navTextRotate:
                "Rotate the ruler so that it aligns with the line segment",
              navTextSlider: "Move the marker to endpoint B using the slider",
              navTextDone: "Tap » to continue",
              actionIntro:
                'To find length of <span class="segment-overline">AB</span>:',
              step1:
                "1: Align and place the ‘0’ marker of the ruler at one endpoint",
              step2: "2: Count the large divisions till the other endpoint.",
              lengthLabel:
                'Length of <span class="segment-overline">AB</span> =',
              lengthUnit: "cm",
              lengthMm: 120,
              points: { start: [80, 220], end: [440, 120] },
            },
          ],
        },
        5: {
          questionText: "What is the length of the given line segment?",
          navTextDrag:
            "Drag the ruler so that it’s ‘0’ mark aligns with point A",
          navTextRotate:
            "Rotate the ruler by dragging '↻' to align with the line segment",
          navTextSliderCm:
            "Move the slider to count large divisions from A to B",
          navTextSliderMm:
            "Move the slider to count small divisions between {wholeCm} and {wholeCmPlus1}",
          navTextDone: "Tap » to continue",
          actionIntro: `To find length of <span class="segment-overline">AB</span>:`,
          step1: "1: Align",
          step2: "2: Count large divisions as cm",
          step3: "3: Count small divisions as mm",
          lengthLinePrefix:
            'Length of <span class="segment-overline">AB</span> =',
          cmAnd: "and",
          cmLabel: "cm",
          mmLabel: "mm",
          totalEquals: "=",
          totalUnit: "mm",
          questions: [
            {
              id: "s5-q1",
              segment: "AB",
              startLabel: "A",
              endLabel: "B",
              questionText: "What is the length of the given line segment?",
              navTextDrag:
                "Drag the ruler so that it’s ‘0’ mark aligns with point A",
              navTextRotate:
                "Rotate the ruler by dragging '↻' to align with the line segment",
              navTextSliderCm:
                "Move the slider to count large divisions from A to B",
              navTextSliderMm:
                "Move the slider to count small divisions between {wholeCm} and {wholeCmPlus1}",
              navTextDone: "Tap » for another challenge",
              actionIntro:
                'To find length of <span class="segment-overline">AB</span>:',
              step1: "1: Align",
              step2: "2: Count large divisions as cm",
              step3: "3: Count small divisions as mm",
              lengthLinePrefix:
                'Length of <span class="segment-overline">AB</span> =',
              cmAnd: "and",
              cmLabel: "cm",
              mmLabel: "mm",
              totalEquals: "=",
              totalUnit: "mm",
              lengthMm: 137,
              points: { start: [70, 115], end: [355, 140] },
            },
            {
              id: "s5-q2",
              segment: "MN",
              startLabel: "M",
              endLabel: "N",
              questionText: "What is the length of the given line segment?",
              navTextDrag:
                "Drag the ruler so that it’s ‘0’ mark aligns with point M",
              navTextRotate:
                "Rotate the ruler by dragging '↻' to align with the line segment",
              navTextSliderCm:
                "Move the slider to count large divisions from M to N",
              navTextSliderMm:
                "Move the slider to count small divisions between {wholeCm} and {wholeCmPlus1}",
              navTextDone: "Tap » for another challenge",
              actionIntro:
                'To find length of <span class="segment-overline">MN</span>:',
              step1: "1: Align",
              step2: "2: Count large divisions as cm",
              step3: "3: Count small divisions as mm",
              lengthLinePrefix:
                'Length of <span class="segment-overline">MN</span> =',
              cmAnd: "and",
              cmLabel: "cm",
              mmLabel: "mm",
              totalEquals: "=",
              totalUnit: "mm",
              lengthMm: 84,
              points: { start: [80, 210], end: [335, 125] },
            },
            {
              id: "s5-q3",
              segment: "PQ",
              startLabel: "P",
              endLabel: "Q",
              questionText: "What is the length of the given line segment?",
              navTextDrag:
                "Drag the ruler so that it’s ‘0’ mark aligns with point P",
              navTextRotate:
                "Rotate the ruler by dragging '↻' to align with the line segment",
              navTextSliderCm:
                "Move the slider to count large divisions from P to Q",
              navTextSliderMm:
                "Move the slider to count small divisions between {wholeCm} and {wholeCmPlus1}",
              navTextDone: "Tap » to continue",
              actionIntro:
                'To find length of <span class="segment-overline">PQ</span>:',
              step1: "1: Align",
              step2: "2: Count large divisions as cm",
              step3: "3: Count small divisions as mm",
              lengthLinePrefix:
                'Length of <span class="segment-overline">PQ</span> =',
              cmAnd: "and",
              cmLabel: "cm",
              mmLabel: "mm",
              totalEquals: "=",
              totalUnit: "mm",
              lengthMm: 102,
              points: { start: [95, 200], end: [402, 106] },
            },
          ],
        },
        7: {
          questionText: "What is the length of each side of the given shape?",
          navTextSelect: "Tap any side of triangle ABC to measure",
          navTextDrag:
            "Drag the ruler so that it’s ‘0’ mark aligns with point {startLabel}",
          navTextRotate:
            "Rotate the ruler by dragging '↻' to align with side {sideLabel}",
          navTextSliderCm:
            "Move the slider to count large divisions from {startLabel} to {endLabel}",
          navTextSliderMm:
            "Move the slider to count small divisions between {wholeCm} and {wholeCmPlus1}",
          navTextSelectAnother: "Tap another side to measure",
          navTextDone: "Tap » to summarize",
          actionIntro:
            "Measure each side one by one.",
          step1: "1: Align",
          step2: "2: Count large divisions as cm",
          step3: "3: Count small divisions as mm",
          cmAnd: "and",
          cmLabel: "cm",
          mmLabel: "mm",
          summaryPrefix: "Length of",
          summaryEquals: "=",
          triangle: {
            points: {
              A: [40, 220],
              B: [371, 220],
              C: [206, 108],
            },
            sides: {
              AB: {
                sideLabel: "AB",
                startLabel: "A",
                endLabel: "B",
                lengthMm: 106,
              },
              BC: {
                sideLabel: "BC",
                startLabel: "C",
                endLabel: "B",
                lengthMm: 64,
              },
              AC: {
                sideLabel: "AC",
                startLabel: "A",
                endLabel: "C",
                lengthMm: 64,
              },
            },
            summaryOrder: ["AB", "BC", "AC"],
          },
        },
        8: {
          questionText: "What is the length of each side of the given shape?",
          navText: "Tap » for another challenge",
        },
        9: {
          questionText: "What is the length of each side of the given shape?",
          navTextSelect: "Tap any side of square PQRS to measure",
          navTextDrag:
            "Drag the ruler so that it’s ‘0’ mark aligns with point {startLabel}",
          navTextRotate:
            "Rotate the ruler by dragging '↻' to align with side {sideLabel}",
          navTextSliderCm:
            "Move the slider to count large divisions from {startLabel} to {endLabel}",
          navTextSliderMm:
            "Move the slider to count small divisions between {wholeCm} and {wholeCmPlus1}",
          navTextSelectAnother: "Tap another side to measure",
          navTextDone: "Tap » to summarize",
          actionIntro:
            "Measure each side one by one.",
          step1: "1: Align",
          step2: "2: Count large divisions as cm",
          step3: "3: Count small divisions as mm",
          cmAnd: "and",
          cmLabel: "cm",
          mmLabel: "mm",
          summaryPrefix: "Length of",
          summaryEquals: "=",
          shape: {
            points: {
              P: [120, 251],
              Q: [298, 251],
              R: [298, 73],
              S: [120, 73],
            },
            sides: {
              PQ: {
                sideLabel: "PQ",
                startLabel: "P",
                endLabel: "Q",
                lengthMm: 57,
              },
              QR: {
                sideLabel: "QR",
                startLabel: "Q",
                endLabel: "R",
                lengthMm: 57,
              },
              SR: {
                sideLabel: "SR",
                startLabel: "S",
                endLabel: "R",
                lengthMm: 57,
              },
              PS: {
                sideLabel: "PS",
                startLabel: "P",
                endLabel: "S",
                lengthMm: 57,
              },
            },
            summaryOrder: ["PQ", "QR", "SR", "PS"],
          },
        },
        10: {
          questionText: "What is the length of each side of the given shape?",
          navText: "Tap » to continue",
        },
      },
      measure: {
        /** Expected answer length in millimetres (ruler is scaled to this). */
        pqLengthMm: 100,
        abLengthMm: 137,
        sliderMax: 20,
        sliderMaxCm: 30,
        /**
         * Endpoint coordinates in SVG space; change these to move the segment.
         * Length in mm is derived as round(distPx * (pqLengthMm / distPx)) using pqLengthMm.
         */
        segmentPQ: { p: [68, 210], q: [360, 100] },
        segmentAB: { a: [70, 115], b: [355, 140] },
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Memakai petak yang diketahui untuk mengukur ruas garis",
        text: `Dengan berbagai ruas garis
yang diberikan, mari kita lihat apakah kamu dapat
mengukur panjangnya…<br/><br/>
Mari mulai dengan menghitung
garis petak sebelum kita
menggunakan penggaris.`,
        buttonText: "Mulai",
        imageSrc: "assets/start.svg",
      },
      interludeRuler: {
        heading: "Menggunakan penggaris untuk mengukur ruas garis",
        text: `Bagus! Menghitung sel petak
antara titik ujung memberi kita
ukuran ruas garis
dalam satuan petak.<br/><br/>
Sekarang, mari kita coba mengukur
ruas garis memakai penggaris…`,
        buttonText: "Lanjut",
        imageSrc: "assets/start.svg",
      },
      interludeMm: {
        heading: "Menggunakan penggaris untuk mengukur ruas garis",
        text: `Bagus! Menghitung berapa
sentimeter dari 0 di satu
titik ujung ke titik ujung
lain memberi kita panjang
ruas garis.<br/><br/>
Naik level — Sekarang, mari coba
pembagian yang lebih kecil…`,
        buttonText: "Lanjut",
        imageSrc: "assets/start.svg",
      },
      endShapes: {
        heading:
          "Berbagai bentuk dapat dibuat dengan menghubungkan sudut memakai ruas garis",
        text: `Naik level lagi<br/><br/>
Mari kita ukur panjang
sisi berbagai bentuk`,
        buttonText: "Lanjut",
        imageSrc: "assets/start.svg",
      },
      endRuler: {
        heading: "Hebat mengukur ruas garis dengan penggaris cm!",
        text: `1: Sejajarkan dan letakkan penanda ‘0’
penggaris di salah satu ujung<br/>
2: Hitung CENTIMETER sampai
ke ujung lainnya dari ‘0’.<br/>
3: Jika masih ada jarak, hitung
MILLIMETER ke ujung lainnya
dari penanda CENTIMETER.<br/><br/>
Laporkan dalam ‘cm dan mm’ atau ‘mm’.`,
        buttonText: "Mulai Lagi",
        imageSrc: "assets/start.svg",
      },
      steps: {
        1: {
          questionText: "",
          navText: "",
          questions: [
            {
              id: "q1",
              questionText:
                "Jika setiap kotak pada petak bernilai 1 cm, berapakah panjang ruas garis yang ditunjukkan?",
              navTextInitial: "Masukkan panjang PQ yang benar dengan numpad",
              navTextCorrect: "Ketuk » untuk tantangan berikutnya",
              statementLabel:
                'Panjang <span class="segment-overline">PQ</span> =',
              unit: "cm",
              wrongFeedback: "Oops! Coba Lagi!",
              correctFeedback:
                "Bagus!<br/>Titik P dan Q<br/>terpisah 5 kotak<br/>di antaranya!",
              answer: 5,
              shape: "segment",
              measureSegment: "PQ",
              points: { p: [6, 8], q: [11, 8] },
            },
            {
              id: "q2",
              questionText:
                "Jika setiap kotak pada petak bernilai 1 cm, berapakah panjang ruas garis yang ditunjukkan?",
              navTextInitial: "Masukkan panjang MN yang benar dengan numpad",
              navTextCorrect: "Ketuk » untuk tantangan berikutnya",
              statementLabel:
                'Panjang <span class="segment-overline">MN</span> =',
              unit: "cm",
              wrongFeedback: "Oops! Coba Lagi!",
              correctFeedback:
                "Bagus!<br/>Titik M dan N<br/>terpisah 7 kotak<br/>di antaranya!",
              answer: 7,
              shape: "segment",
              measureSegment: "MN",
              points: { p: [9, 3], q: [9, 10] },
            },
            {
              id: "q3",
              questionText:
                "Jika setiap kotak pada petak bernilai 1 cm, berapakah panjang sisi persegi?",
              navTextInitial: "Masukkan panjang AB yang benar dengan numpad",
              navTextCorrect: "Ketuk » untuk lanjut",
              statementLabel:
                'Panjang <span class="segment-overline">AB</span> =',
              unit: "cm",
              wrongFeedback: "Oops! Coba Lagi!",
              correctFeedback:
                "Bagus!<br/>Setiap sisi persegi ABCD<br/>panjangnya 4 kotak!",
              answer: 4,
              shape: "square",
              measureSegment: "AB",
              points: { a: [9, 4], b: [13, 4], c: [13, 8], d: [9, 8] },
            },
          ],
        },
        3: {
          questionText: "Berapakah panjang ruas garis yang diberikan?",
          navTextDrag: "Seret penggaris agar tanda ‘0’ sejajar dengan titik P",
          navTextRotate: "Putar penggaris agar sejajar dengan ruas garis",
          navTextSlider: "Pindahkan penanda ke titik ujung Q memakai penggeser",
          navTextAnother: "Ketuk » untuk tantangan lain",
          actionIntro: `Untuk mencari panjang <span class="segment-overline">PQ</span>:`,
          step1:
            "1: Sejajarkan dan letakkan penanda ‘0’ penggaris di salah satu ujung",
          step2: "2: Hitung pembagian besar sampai ke ujung yang lain.",
          lengthLabel: 'Panjang <span class="segment-overline">PQ</span> =',
          lengthUnit: "cm",
          questions: [
            {
              id: "s3-q1",
              segment: "PQ",
              startLabel: "P",
              endLabel: "Q",
              questionText: "Berapakah panjang ruas garis yang diberikan?",
              navTextDrag:
                "Seret penggaris agar tanda ‘0’ sejajar dengan titik P",
              navTextRotate: "Putar penggaris agar sejajar dengan ruas garis",
              navTextSlider:
                "Pindahkan penanda ke titik ujung Q memakai penggeser",
              navTextDone: "Ketuk » untuk tantangan berikutnya",
              actionIntro:
                'Untuk mencari panjang <span class="segment-overline">PQ</span>:',
              step1:
                "1: Sejajarkan dan letakkan penanda ‘0’ penggaris di salah satu ujung",
              step2: "2: Hitung pembagian besar sampai ke ujung yang lain.",
              lengthLabel: 'Panjang <span class="segment-overline">PQ</span> =',
              lengthUnit: "cm",
              lengthMm: 100,
              points: { start: [68, 210], end: [360, 100] },
            },
            {
              id: "s3-q2",
              segment: "MN",
              startLabel: "M",
              endLabel: "N",
              questionText: "Berapakah panjang ruas garis yang diberikan?",
              navTextDrag:
                "Seret penggaris agar tanda ‘0’ sejajar dengan titik M",
              navTextRotate: "Putar penggaris agar sejajar dengan ruas garis",
              navTextSlider:
                "Pindahkan penanda ke titik ujung N memakai penggeser",
              navTextDone: "Ketuk » untuk tantangan berikutnya",
              actionIntro:
                'Untuk mencari panjang <span class="segment-overline">MN</span>:',
              step1:
                "1: Sejajarkan dan letakkan penanda ‘0’ penggaris di salah satu ujung",
              step2: "2: Hitung pembagian besar sampai ke ujung yang lain.",
              lengthLabel: 'Panjang <span class="segment-overline">MN</span> =',
              lengthUnit: "cm",
              lengthMm: 80,
              points: { start: [115, 90], end: [355, 215] },
            },
            {
              id: "s3-q3",
              segment: "AB",
              startLabel: "A",
              endLabel: "B",
              questionText: "Berapakah panjang ruas garis yang diberikan?",
              navTextDrag:
                "Seret penggaris agar tanda ‘0’ sejajar dengan titik A",
              navTextRotate: "Putar penggaris agar sejajar dengan ruas garis",
              navTextSlider:
                "Pindahkan penanda ke titik ujung B memakai penggeser",
              navTextDone: "Ketuk » untuk lanjut",
              actionIntro:
                'Untuk mencari panjang <span class="segment-overline">AB</span>:',
              step1:
                "1: Sejajarkan dan letakkan penanda ‘0’ penggaris di salah satu ujung",
              step2: "2: Hitung pembagian besar sampai ke ujung yang lain.",
              lengthLabel: 'Panjang <span class="segment-overline">AB</span> =',
              lengthUnit: "cm",
              lengthMm: 120,
              points: { start: [80, 220], end: [440, 120] },
            },
          ],
        },
        5: {
          questionText: "Berapakah panjang ruas garis yang diberikan?",
          navTextDrag: "Seret penggaris agar tanda ‘0’ sejajar dengan titik A",
          navTextRotate: "Putar penggaris agar sejajar dengan ruas garis",
          navTextSliderCm:
            "Gerakkan penggeser untuk menghitung pembagian besar dari A ke B",
          navTextSliderMm:
            "Gerakkan penggeser untuk pembagian kecil antara {wholeCm} dan {wholeCmPlus1}",
          navTextDone: "Ketuk » untuk melanjutkan",
          actionIntro: `Untuk mencari panjang <span class="segment-overline">AB</span>:`,
          step1: "1: Sejajarkan",
          step2: "2: Hitung pembagian besar sebagai cm",
          step3: "3: Hitung pembagian kecil sebagai mm",
          lengthLinePrefix:
            'Panjang <span class="segment-overline">AB</span> =',
          cmAnd: "dan",
          cmLabel: "cm",
          mmLabel: "mm",
          totalEquals: "=",
          totalUnit: "mm",
          questions: [
            {
              id: "s5-q1",
              segment: "AB",
              startLabel: "A",
              endLabel: "B",
              questionText: "Berapakah panjang ruas garis yang diberikan?",
              navTextDrag:
                "Seret penggaris agar tanda ‘0’ sejajar dengan titik A",
              navTextRotate: "Putar penggaris agar sejajar dengan ruas garis",
              navTextSliderCm:
                "Gerakkan penggeser untuk menghitung pembagian besar dari A ke B",
              navTextSliderMm:
                "Gerakkan penggeser untuk pembagian kecil antara {wholeCm} dan {wholeCmPlus1}",
              navTextDone: "Ketuk » untuk tantangan berikutnya",
              actionIntro:
                'Untuk mencari panjang <span class="segment-overline">AB</span>:',
              step1: "1: Sejajarkan",
              step2: "2: Hitung pembagian besar sebagai cm",
              step3: "3: Hitung pembagian kecil sebagai mm",
              lengthLinePrefix:
                'Panjang <span class="segment-overline">AB</span> =',
              cmAnd: "dan",
              cmLabel: "cm",
              mmLabel: "mm",
              totalEquals: "=",
              totalUnit: "mm",
              lengthMm: 137,
              points: { start: [70, 215], end: [355, 88] },
            },
            {
              id: "s5-q2",
              segment: "MN",
              startLabel: "M",
              endLabel: "N",
              questionText: "Berapakah panjang ruas garis yang diberikan?",
              navTextDrag:
                "Seret penggaris agar tanda ‘0’ sejajar dengan titik M",
              navTextRotate: "Putar penggaris agar sejajar dengan ruas garis",
              navTextSliderCm:
                "Gerakkan penggeser untuk menghitung pembagian besar dari M ke N",
              navTextSliderMm:
                "Gerakkan penggeser untuk pembagian kecil antara {wholeCm} dan {wholeCmPlus1}",
              navTextDone: "Ketuk » untuk tantangan berikutnya",
              actionIntro:
                'Untuk mencari panjang <span class="segment-overline">MN</span>:',
              step1: "1: Sejajarkan",
              step2: "2: Hitung pembagian besar sebagai cm",
              step3: "3: Hitung pembagian kecil sebagai mm",
              lengthLinePrefix:
                'Panjang <span class="segment-overline">MN</span> =',
              cmAnd: "dan",
              cmLabel: "cm",
              mmLabel: "mm",
              totalEquals: "=",
              totalUnit: "mm",
              lengthMm: 84,
              points: { start: [80, 210], end: [335, 125] },
            },
            {
              id: "s5-q3",
              segment: "PQ",
              startLabel: "P",
              endLabel: "Q",
              questionText: "Berapakah panjang ruas garis yang diberikan?",
              navTextDrag:
                "Seret penggaris agar tanda ‘0’ sejajar dengan titik P",
              navTextRotate: "Putar penggaris agar sejajar dengan ruas garis",
              navTextSliderCm:
                "Gerakkan penggeser untuk menghitung pembagian besar dari P ke Q",
              navTextSliderMm:
                "Gerakkan penggeser untuk pembagian kecil antara {wholeCm} dan {wholeCmPlus1}",
              navTextDone: "Ketuk » untuk lanjut",
              actionIntro:
                'Untuk mencari panjang <span class="segment-overline">PQ</span>:',
              step1: "1: Sejajarkan",
              step2: "2: Hitung pembagian besar sebagai cm",
              step3: "3: Hitung pembagian kecil sebagai mm",
              lengthLinePrefix:
                'Panjang <span class="segment-overline">PQ</span> =',
              cmAnd: "dan",
              cmLabel: "cm",
              mmLabel: "mm",
              totalEquals: "=",
              totalUnit: "mm",
              lengthMm: 102,
              points: { start: [95, 200], end: [402, 106] },
            },
          ],
        },
        7: {
          questionText: "Berapakah panjang setiap sisi pada bangun yang diberikan?",
          navTextSelect: "Ketuk sisi mana saja pada segitiga ABC untuk mengukur",
          navTextDrag:
            "Seret penggaris agar tanda ‘0’ sejajar dengan titik {startLabel}",
          navTextRotate:
            "Putar penggaris dengan menyeret '↻' agar sejajar dengan sisi {sideLabel}",
          navTextSliderCm:
            "Gerakkan penggeser untuk menghitung pembagian besar dari {startLabel} ke {endLabel}",
          navTextSliderMm:
            "Gerakkan penggeser untuk pembagian kecil antara {wholeCm} dan {wholeCmPlus1}",
          navTextSelectAnother: "Ketuk sisi lain untuk mengukur",
          navTextDone: "Ketuk » untuk ringkasan",
          actionIntro:
            "Ukur setiap sisi satu per satu. Sisi yang sudah diukur menjadi oranye.",
          step1: "1: Sejajarkan",
          step2: "2: Hitung pembagian besar sebagai cm",
          step3: "3: Hitung pembagian kecil sebagai mm",
          cmAnd: "dan",
          cmLabel: "cm",
          mmLabel: "mm",
          summaryPrefix: "Panjang",
          summaryEquals: "=",
          triangle: {
            points: {
              A: [40, 220],
              B: [371, 220],
              C: [206, 108],
            },
            sides: {
              AB: {
                sideLabel: "AB",
                startLabel: "A",
                endLabel: "B",
                lengthMm: 106,
              },
              BC: {
                sideLabel: "BC",
                startLabel: "C",
                endLabel: "B",
                lengthMm: 64,
              },
              AC: {
                sideLabel: "AC",
                startLabel: "A",
                endLabel: "C",
                lengthMm: 64,
              },
            },
            summaryOrder: ["AB", "BC", "AC"],
          },
        },
        8: {
          questionText: "Berapakah panjang setiap sisi pada bangun yang diberikan?",
          navText: "Ketuk » untuk tantangan lain",
        },
        9: {
          questionText: "Berapakah panjang setiap sisi pada bangun yang diberikan?",
          navTextSelect: "Ketuk sisi mana saja pada persegi PQRS untuk mengukur",
          navTextDrag:
            "Seret penggaris agar tanda ‘0’ sejajar dengan titik {startLabel}",
          navTextRotate:
            "Putar penggaris dengan menyeret '↻' agar sejajar dengan sisi {sideLabel}",
          navTextSliderCm:
            "Gerakkan penggeser untuk menghitung pembagian besar dari {startLabel} ke {endLabel}",
          navTextSliderMm:
            "Gerakkan penggeser untuk pembagian kecil antara {wholeCm} dan {wholeCmPlus1}",
          navTextSelectAnother: "Ketuk sisi lain untuk mengukur",
          navTextDone: "Ketuk » untuk ringkasan",
          actionIntro:
            "Ukur setiap sisi satu per satu. Sisi yang sudah diukur menjadi oranye.",
          step1: "1: Sejajarkan",
          step2: "2: Hitung pembagian besar sebagai cm",
          step3: "3: Hitung pembagian kecil sebagai mm",
          cmAnd: "dan",
          cmLabel: "cm",
          mmLabel: "mm",
          summaryPrefix: "Panjang",
          summaryEquals: "=",
          shape: {
            points: {
              P: [120, 251],
              Q: [298, 251],
              R: [298, 73],
              S: [120, 73],
            },
            sides: {
              PQ: {
                sideLabel: "PQ",
                startLabel: "P",
                endLabel: "Q",
                lengthMm: 57,
              },
              QR: {
                sideLabel: "QR",
                startLabel: "Q",
                endLabel: "R",
                lengthMm: 57,
              },
              SR: {
                sideLabel: "SR",
                startLabel: "S",
                endLabel: "R",
                lengthMm: 57,
              },
              PS: {
                sideLabel: "PS",
                startLabel: "P",
                endLabel: "S",
                lengthMm: 57,
              },
            },
            summaryOrder: ["PQ", "QR", "SR", "PS"],
          },
        },
        10: {
          questionText: "Berapakah panjang setiap sisi pada bangun yang diberikan?",
          navText: "Ketuk » untuk lanjut",
        },
      },
      measure: {
        pqLengthMm: 100,
        abLengthMm: 137,
        sliderMax: 20,
        sliderMaxCm: 30,
        segmentPQ: { p: [68, 210], q: [360, 100] },
        segmentAB: { a: [70, 215], b: [355, 88] },
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
