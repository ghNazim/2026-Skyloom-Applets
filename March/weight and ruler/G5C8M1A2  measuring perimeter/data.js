const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Measuring Perimeter",
        text: `Let's measure the sides of a shape and find its
perimeter by adding all the side lengths.<br/><br/>
Tap "Start" to start the activity.`,
        buttonText: "Start",
        imageSrc: "",
      },
      steps: {
        intro: {
          questionText:
            "Perimeter is the sum of the side lengths.<br/>Here, the boundary is made up of <b>AB</b>, <b>BC</b>, <b>CD</b>, and <b>AD</b>.",
          navText: "Tap » to measure each side of the shape.",
        },
        snap: {
          questionTextAll: "Let's measure all the sides of the shape.",
          questionTextRemaining:
            "Let's measure the remaining sides of the shape.",
          questionTextOne:
            "Let's measure the one remaining side of the shape.",
          navText:
            "Place the ruler, align any vertex to the '0' mark, then tap ».",
          wrongFeedbackNoSnap:
            "Not quite! None of the vertices is placed at the 0 mark.",
          wrongFeedbackBothMeasured:
            "Oops! both {side1} and {side2} are measured. Try another vertex.",
        },
        rotate: {
          navText: "Rotate the ruler to match a side and tap » when done.",
          wrongFeedbackNotAligned:
            "Oops! The side isn't aligned with the ruler yet.",
          wrongFeedbackAlreadyMeasured:
            "{side} is already measured. Measure remaining lines.",
        },
        slide: {
          navText: "Drag the slider to measure the side length.",
          navTextDone: "Tap » to continue.",
          wrongFeedback: "Oops! That length doesn't match!",
          correctFeedback: "Well done! You measured the side correctly.",
        },
        guidedFirstSide: {
          questionText:
            "Let's learn how to measure the length of any side of the shape.",
          navText: "Tap » to continue.",
          step1Text: "Step 1:<br/>Place the ruler so that<br/>any vertex aligns with<br/>the 0 mark.",
          step2Text:
            "Step 2:<br/>Rotate the ruler to<br/>match a side to<br/>measure its length.",
          step3Text: "Step 3:<br/>Move the slider to<br/>measure the side.",
        },
        animate: {
          questionText:
            "The perimeter of a closed figure is the sum of the lengths of all its sides.",
          navText: "",
          navTextEnd: "Tap » to add all the side lengths.",
          perimeterPrefix: "Perimeter",
        },
        sum: {
          questionText: "Let's add the side lengths to find the perimeter.",
          navText: "Enter the answer using the numpad and then tap ✔.",
          navTextDone: "Tap » to see another shape.",
          perimeterPrefix: "Perimeter",
          unit: "cm",
          wrongFeedback: "Not quite. Add all the side lengths.",
          correctFeedback: "Well done! You found the perimeter.",
        },
        end: {
          heading: "Activity Completed!",
          text: `We measured the sides of each shape and added the
side lengths to find the perimeter.<br/><br/>
Tap "Start Over" to restart the activity.`,
          buttonText: "Start Over",
        },
      },
      shapes: [
        {
          id: "rect-5x3",
          type: "rectangle",
          label: "ABCD",
          vertices: ["A", "B", "C", "D"],
          points: {
            A: [195, 60],
            B: [195, 195],
            C: [420, 195],
            D: [420, 60],
          },
          sides: {
            AB: { lengthMm: 30 },
            BC: { lengthMm: 50 },
            CD: { lengthMm: 30 },
            AD: { lengthMm: 50 },
          },
          summaryOrder: ["AD", "AB", "BC", "CD"],
        },
        {
          id: "square-rot-4x4",
          type: "square",
          label: "ABCD",
          vertices: ["A", "B", "C", "D"],
          points: {
            A: [310, 52],
            B: [437, 179],
            C: [310, 306],
            D: [183, 179],
          },
          sides: {
            AB: { lengthMm: 40 },
            BC: { lengthMm: 40 },
            CD: { lengthMm: 40 },
            AD: { lengthMm: 40 },
          },
          summaryOrder: ["AB", "BC", "CD", "AD"],
        },
        {
          id: "trapezium-4-5-5-5",
          type: "trapezium",
          label: "ABCD",
          vertices: ["A", "B", "C", "D"],
          points: {
            A: [223, 70],
            B: [403, 70],
            C: [425, 294],
            D: [200, 294],
          },
          sides: {
            AB: { lengthMm: 40 },
            BC: { lengthMm: 50 },
            CD: { lengthMm: 50 },
            AD: { lengthMm: 50 },
          },
          summaryOrder: ["AB", "BC", "CD", "AD"],
        },
      ],
      ruler: {
        w: 210,
        h: 35,
        zeroX: 8.95,
        cm: 19,
        imageSrc: "assets/ruler10.svg",
        bottomGapPx: 8,
      },
      pxPerMm: 4.5,
      svg: {
        w: 620,
        h: 400,
      },
      cmLabel: "cm",
    },
  },
  id: {
    app: {
      start: {
        heading: "Mengukur Keliling",
        text: `Mari ukur sisi-sisi sebuah bangun dan
hitung kelilingnya dengan menjumlahkan
panjang seluruh sisinya.<br/><br/>
Ketuk "Mulai" untuk memulai aktivitas.`,
        buttonText: "Mulai",
        imageSrc: "",
      },
      steps: {
        intro: {
          questionText:
            "Keliling adalah jumlah panjang sisi.<br/>Di sini, batas bangun terdiri dari <b>AB</b>, <b>BC</b>, <b>CD</b>, dan <b>AD</b>.",
          navText: "Ketuk » untuk mengukur setiap sisi bangun.",
        },
        snap: {
          questionTextAll: "Mari kita ukur semua sisi bangun.",
          questionTextRemaining: "Mari kita ukur sisi yang tersisa.",
          questionTextOne: "Mari kita ukur sisi terakhir yang tersisa.",
          navText:
            "Letakkan penggaris, sejajarkan salah satu titik sudut dengan tanda '0', lalu ketuk ».",
          wrongFeedbackNoSnap:
            "Belum tepat! Tidak ada titik sudut yang berada di tanda 0.",
          wrongFeedbackBothMeasured:
            "Oops! {side1} dan {side2} sudah diukur. Coba titik sudut lain.",
        },
        rotate: {
          navText:
            "Putar penggaris hingga sejajar dengan sebuah sisi, lalu ketuk ».",
          wrongFeedbackNotAligned:
            "Oops! Sisi belum sejajar dengan penggaris.",
          wrongFeedbackAlreadyMeasured:
            "{side} sudah diukur. Ukur sisi yang lain.",
        },
        slide: {
          navText: "Geser penanda untuk mengukur panjang sisi.",
          navTextDone: "Ketuk » untuk lanjut.",
          wrongFeedback: "Oops! Panjangnya belum tepat!",
          correctFeedback: "Bagus! Kamu mengukur sisinya dengan benar.",
        },
        guidedFirstSide: {
          questionText:
            "Mari belajar mengukur panjang salah satu sisi bangun.",
          navText: "Ketuk » untuk lanjut.",
          step1Text:
            "Langkah 1:<br/>Letakkan penggaris agar<br/>salah satu titik sudut sejajar<br/>dengan tanda 0.",
          step2Text:
            "Langkah 2:<br/>Putar penggaris untuk<br/>menyamakan arah sisi yang<br/>akan diukur.",
          step3Text:
            "Langkah 3:<br/>Gerakkan penanda untuk<br/>mengukur panjang sisi.",
        },
        animate: {
          questionText:
            "Keliling sebuah bangun tertutup adalah jumlah panjang seluruh sisinya.",
          navText: "",
          navTextEnd: "Ketuk » untuk menjumlahkan panjang seluruh sisi.",
          perimeterPrefix: "Keliling",
        },
        sum: {
          questionText:
            "Mari jumlahkan panjang sisi untuk mendapat kelilingnya.",
          navText: "Masukkan jawaban dengan numpad lalu ketuk ✔.",
          navTextDone: "Ketuk » untuk melihat bangun lain.",
          perimeterPrefix: "Keliling",
          unit: "cm",
          wrongFeedback: "Belum tepat. Jumlahkan panjang seluruh sisi.",
          correctFeedback: "Bagus! Kamu menemukan kelilingnya.",
        },
        end: {
          heading: "Aktivitas Selesai!",
          text: `Kita sudah mengukur sisi tiap bangun dan menjumlahkan
panjang sisinya untuk menemukan keliling.<br/><br/>
Ketuk "Mulai Lagi" untuk mengulang aktivitas.`,
          buttonText: "Mulai Lagi",
        },
      },
      shapes: [
        {
          id: "rect-5x3",
          type: "rectangle",
          label: "ABCD",
          vertices: ["A", "B", "C", "D"],
          points: {
            A: [195, 60],
            B: [195, 195],
            C: [420, 195],
            D: [420, 60],
          },
          sides: {
            AB: { lengthMm: 30 },
            BC: { lengthMm: 50 },
            CD: { lengthMm: 30 },
            AD: { lengthMm: 50 },
          },
          summaryOrder: ["AD", "AB", "BC", "CD"],
        },
        {
          id: "square-rot-4x4",
          type: "square",
          label: "ABCD",
          vertices: ["A", "B", "C", "D"],
          points: {
            A: [310, 52],
            B: [437, 179],
            C: [310, 306],
            D: [183, 179],
          },
          sides: {
            AB: { lengthMm: 40 },
            BC: { lengthMm: 40 },
            CD: { lengthMm: 40 },
            AD: { lengthMm: 40 },
          },
          summaryOrder: ["AB", "BC", "CD", "AD"],
        },
        {
          id: "trapezium-4-5-5-5",
          type: "trapesium",
          label: "ABCD",
          vertices: ["A", "B", "C", "D"],
          points: {
            A: [223, 70],
            B: [403, 70],
            C: [425, 294],
            D: [200, 294],
          },
          sides: {
            AB: { lengthMm: 40 },
            BC: { lengthMm: 50 },
            CD: { lengthMm: 50 },
            AD: { lengthMm: 50 },
          },
          summaryOrder: ["AB", "BC", "CD", "AD"],
        },
      ],
      ruler: {
        w: 210,
        h: 35,
        zeroX: 8.95,
        cm: 19,
        imageSrc: "assets/ruler10.svg",
        bottomGapPx: 8,
      },
      pxPerMm: 4.5,
      svg: {
        w: 620,
        h: 400,
      },
      cmLabel: "cm",
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
