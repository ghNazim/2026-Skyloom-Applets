const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Distance Between Two Points",
        text: "Let’s explore how to find the distance between two points<br>placed horizontally or vertically.",
        buttonText: "Start",
      },
      steps: {
        1: {
          questionTextInitial:
            "Shout out the distance between the point (3, 4) and the Y-axis.",
          navTextInitial: 'Tap the "?" to see the answer.',
          questionTextAfterReveal:
            "Which coordinate helps us find the distance between the Y-axis and the point?",
          navTextAfterReveal: "Tap the correct button.",
          questionTextDone:
            "Yes, x-coordinate helps us find the distance between the Y-axis and the point.",
          navTextDone: "Tap » try with one more.",
          xCoordinateBtn: "x-coordinate",
          yCoordinateBtn: "y-coordinate",
        },
        2: {
          questionTextInitial:
            "Shout out the distance between point the (8, 4) and the Y-axis.",
          navTextInitial: 'Tap the "?" to see the answer.',
          questionTextDone:
            "The distance between the point (8, 4) and the Y-axis is <y>8 units</y>.",
          navTextDone: "Tap » to find the distance between (3, 4) and (8, 4).",
        },
        3: {
          questionTextInitial:
            "Shout out the distance between the points (8, 4) and (3, 4).",
          navTextInitial: 'Tap the "?" to see the answer.',
          questionTextDone:
            "The distance between the points (8, 4) and (3, 4) is <y>5 units</y>.",
          navTextDone: "Tap » to try a few more.",
        },
        4: {
          questionTextInitial:
            "Shout out the distance between the points ({x2}, {y}) and ({x1}, {y}).",
          questionTextDone:
            "The distance between the points ({x2}, {y}) and ({x1}, {y}) is <y>{d} units</y>.",
          navTextInitial: 'Tap the "?" to see the answer.',
          questions: [
            {
              p1: [2, 6],
              p2: [9, 6],
              navTextDone: "Tap » to try with one more.",
            },
            {
              p1: [1, 5],
              p2: [6, 5],
              navTextDone: "Tap » to see the formula.",
            },
          ],
        },
        5: {
          questionTextInitial:
            "Shout out the distance between the points (x₁, y) and (x₂, y).",
          questionTextDone:
            "The distance between two points (x₁, y) and (x₂, y) placed horizontally is <yl>x₂</yl> - <bl>x₁</bl>.",
          navTextInitial: 'Tap the "?" to see the answer.',
          navTextDone: "Tap » to continue.",
        },
        6: {
          questionText:
            "Since distance cannot be negative, we take the <y>absolute value</y>.",
          navText:
            "Tap » to find the distance between two vertically placed points.",
        },
        7: {
          questionTextInitial:
            "Shout out the distance between the point (6, 4) and the X-axis.",
          navTextInitial: 'Tap the "?" to see the answer.',
          questionTextAfterReveal:
            "Which coordinate helps us find the distance between the X-axis and the point?",
          navTextAfterReveal: "Tap the correct button.",
          questionTextDone:
            "Yes, y-coordinate helps us find the distance between the X-axis and the point.",
          navTextDone: "Tap » try with one more.",
          xCoordinateBtn: "x-coordinate",
          yCoordinateBtn: "y-coordinate",
        },
        8: {
          questionTextInitial:
            "Shout out the distance between the point (6, 8) and the X-axis.",
          navTextInitial: 'Tap the "?" to see the answer.',
          questionTextDone:
            "The distance between the point (6, 8) and the X-axis is <y>8 units</y>.",
          navTextDone:
            "Tap » to find the distance between (6, 4) and (6, 8).",
        },
        9: {
          questionTextInitial:
            "Shout out the distance between the points (6, 8) and (6, 4).",
          navTextInitial: 'Tap the "?" to see the answer.',
          questionTextDone:
            "The distance between the points (6, 8) and (6, 4) is <y>4 units</y>.",
          navTextDone: "Tap » to try a few more.",
        },
        10: {
          questionTextInitial:
            "Shout out the distance between the points ({x}, {y2}) and ({x}, {y1}).",
          questionTextDone:
            "The distance between the points ({x}, {y2}) and ({x}, {y1}) is <y>{d} units</y>.",
          navTextInitial: 'Tap the "?" to see the answer.',
          questions: [
            {
              p1: [2, 3],
              p2: [2, 9],
              navTextDone: "Tap » to try with one more.",
            },
            {
              p1: [5, 1],
              p2: [5, 6],
              navTextDone: "Tap » to see the formula.",
            },
          ],
        },
        11: {
          questionTextInitial:
            "Shout out the distance between the points (x, y₁) and (x, y₂).",
          questionTextDone:
            "The distance between two points (x, y₁) and (x, y₂) placed vertically is <yl>y₂</yl> - <bl>y₁</bl>.",
          navTextInitial: 'Tap the "?" to see the answer.',
          navTextDone: "Tap » to continue.",
        },
        12: {
          questionText:
            "Since distance cannot be negative, we take the <y>absolute value</y>.",
          navText:
            "Tap » to conclude.",
        },
      },
      final: {
        heading: "Distance Between Two Points",
        text: "Awesome! Now, we know<br>how to find the distance between two points<br>placed horizontally or vertically.",
        buttonText: "Start Over",
        imageSrc: null,
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Jarak Antara Dua Titik",
        text: "Mari jelajahi cara mencari jarak antara dua titik<br>yang tersusun horizontal atau vertikal.",
        buttonText: "Mulai",
      },
      steps: {
        1: {
          questionTextInitial:
            "Sebutkan jarak antara titik (3, 4) dan sumbu-Y.",
          navTextInitial: 'Ketuk "?" untuk melihat jawabannya.',
          questionTextAfterReveal:
            "Koordinat mana yang membantu kita mencari jarak antara sumbu-Y dan titik itu?",
          navTextAfterReveal: "Ketuk tombol yang benar.",
          questionTextDone:
            "Ya, koordinat x membantu kita mencari jarak antara sumbu-Y dan titik itu.",
          navTextDone: "Ketuk » coba satu lagi.",
          xCoordinateBtn: "koordinat-x",
          yCoordinateBtn: "koordinat-y",
        },
        2: {
          questionTextInitial:
            "Sebutkan jarak antara titik (8, 4) dan sumbu-Y.",
          navTextInitial: 'Ketuk "?" untuk melihat jawabannya.',
          questionTextDone:
            "Jarak antara titik (8, 4) dan sumbu-Y adalah <y>8 satuan</y>.",
          navTextDone: "Ketuk » untuk mencari jarak antara (3, 4) dan (8, 4).",
        },
        3: {
          questionTextInitial:
            "Sebutkan jarak antara titik (8, 4) dan (3, 4).",
          navTextInitial: 'Ketuk "?" untuk melihat jawabannya.',
          questionTextDone:
            "Jarak antara titik (8, 4) dan (3, 4) adalah <y>5 satuan</y>.",
          navTextDone: "Ketuk » untuk mencoba beberapa soal lagi.",
        },
        4: {
          questionTextInitial:
            "Sebutkan jarak antara titik ({x2}, {y}) dan ({x1}, {y}).",
          questionTextDone:
            "Jarak antara titik ({x2}, {y}) dan ({x1}, {y}) adalah <y>{d} satuan</y>.",
          navTextInitial: 'Ketuk "?" untuk melihat jawabannya.',
          questions: [
            {
              p1: [2, 6],
              p2: [9, 6],
              navTextDone: "Ketuk » coba satu lagi.",
            },
            {
              p1: [1, 5],
              p2: [6, 5],
              navTextDone: "Ketuk » untuk melihat rumus.",
            },
          ],
        },
        5: {
          questionTextInitial:
            "Sebutkan jarak antara titik (x₁, y) dan (x₂, y).",
          questionTextDone:
            "Jarak antara dua titik (x₁, y) dan (x₂, y) yang tersusun horizontal adalah <yl>x₂</yl>–<bl>x₁</bl>.",
          navTextInitial: 'Ketuk "?" untuk melihat jawabannya.',
          navTextDone: "Ketuk » untuk lanjut.",
        },
        6: {
          questionText:
            "Karena jarak tidak bisa bernilai negatif, kita ambil <y>nilai mutlak</y>.",
          navText:
            "Ketuk » untuk mencari jarak antara dua titik yang tersusun vertikal.",
        },
        7: {
          questionTextInitial:
            "Sebutkan jarak antara titik (6, 4) dan sumbu-X.",
          navTextInitial: 'Ketuk "?" untuk melihat jawabannya.',
          questionTextAfterReveal:
            "Koordinat mana yang membantu kita mencari jarak antara sumbu-X dan titik itu?",
          navTextAfterReveal: "Ketuk tombol yang benar.",
          questionTextDone:
            "Ya, koordinat y membantu kita mencari jarak antara sumbu-X dan titik itu.",
          navTextDone: "Ketuk » coba satu lagi.",
          xCoordinateBtn: "koordinat-x",
          yCoordinateBtn: "koordinat-y",
        },
        8: {
          questionTextInitial:
            "Sebutkan jarak antara titik (6, 8) dan sumbu-X.",
          navTextInitial: 'Ketuk "?" untuk melihat jawabannya.',
          questionTextDone:
            "Jarak antara titik (6, 8) dan sumbu-X adalah <y>8 satuan</y>.",
          navTextDone:
            "Ketuk » untuk mencari jarak antara (6, 4) dan (6, 8).",
        },
        9: {
          questionTextInitial:
            "Sebutkan jarak antara titik (6, 8) dan (6, 4).",
          navTextInitial: 'Ketuk "?" untuk melihat jawabannya.',
          questionTextDone:
            "Jarak antara titik (6, 8) dan (6, 4) adalah <y>4 satuan</y>.",
          navTextDone: "Ketuk » untuk mencoba beberapa soal lagi.",
        },
        10: {
          questionTextInitial:
            "Sebutkan jarak antara titik ({x}, {y2}) dan ({x}, {y1}).",
          questionTextDone:
            "Jarak antara titik ({x}, {y2}) dan ({x}, {y1}) adalah <y>{d} satuan</y>.",
          navTextInitial: 'Ketuk "?" untuk melihat jawabannya.',
          questions: [
            {
              p1: [2, 3],
              p2: [2, 9],
              navTextDone: "Ketuk » coba satu lagi.",
            },
            {
              p1: [5, 1],
              p2: [5, 6],
              navTextDone: "Ketuk » untuk melihat rumus.",
            },
          ],
        },
        11: {
          questionTextInitial:
            "Sebutkan jarak antara titik (x, y₁) dan (x, y₂).",
          questionTextDone:
            "Jarak antara dua titik (x, y₁) dan (x, y₂) yang tersusun vertikal adalah <yl>y₂</yl>–<bl>y₁</bl>.",
          navTextInitial: 'Ketuk "?" untuk melihat jawabannya.',
          navTextDone: "Ketuk » untuk lanjut.",
        },
        12: {
          questionText:
            "Karena jarak tidak bisa bernilai negatif, kita ambil <y>nilai mutlak</y>.",
          navText:
            "Ketuk » untuk menyimpulkan.",
        },
      },
      final: {
        heading: "Jarak Antara Dua Titik",
        text: "Keren! Sekarang kita tahu<br>cara mencari jarak antara dua titik<br>yang tersusun horizontal atau vertikal.",
        buttonText: "Ulangi",
        imageSrc: null,
      },
    },
  },

};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
