const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      steps: {
        1: {
          questionText:
            "The two polygons are congruent. Can you find the values of u and v?",
          navText: "Tap » to identify what is given.",
        },
        2: {
          questionText:
            "<span class='question-highlight-purple'>The two polygons are congruent. </span>Can you find the values of u and v?",
          navText: "Tap » to identify what you need to find.",
          polygon1: "Polygon 1",
          polygon2: "Polygon 2",
          actionText: "Polygon 1 ≅ Polygon 2",
        },
        3: {
          questionText:
            "The two polygons are congruent. <span class='question-highlight-purple'>Can you find the values of u and v?</span>",
          navText: "Tap » to find the value of u and v.",
          polygon1: "Polygon 1",
          polygon2: "Polygon 2",
          actionText: "Polygon 1 ≅ Polygon 2",
        },
        4: {
          questionText:
            "The two polygons are congruent. Can you find the values of u and v?",
          navText: "Tap polygon 2 to make it similar to polygon 1.",
          polygon1: "Polygon 1",
          polygon2: "Polygon 2",
          actionText: "Polygon 1 ≅ Polygon 2",
          questionAfterRotate:
            "Now the corresponding angles are in matching positions.",
          navAfterRotate: "Tap » to label the vertices of the polygons.",
        },
        5: {
          questionText: "What will be the correct order of vertices in PQRS ?",
          navText: "Tap the vertices in right order to label it.",
          questionLabeled: "The vertices of the polygons are labeled.",
          navLabeled: "Tap » to find the unknown angles in the two polygons.",
        },
        6: {
          questionText: "Identify the angle in ABCD that corresponds to ∠Q.",
          navText: "Tap the matching angle in ABCD.",
          navDone: "Tap » to identify the next unknown angle.",
          actionText: "Since the two polygons are congruent,<br>∠B = ∠Q",
        },
        7: {
          questionText: "Identify the angle in ABCD that corresponds to ∠S.",
          navText: "Tap the matching angle in ABCD.",
          navDone: "Tap » to find the value of v.",
          actionText: "u = 75°",
        },
        8: {
          questionText: "What is the value of v?",
          navText: "Tap » to see how to identify the value of v.",
          actionText:
            "Oh! We don't know the measure of ∠A,<br>the angle that matches ∠P.",
        },
        9: {
          questionText: "What is the value of v?",
          navText: "Tap » to find the value of v.",
          actionText:
            "We know three angles of the<br>quadrilateral. Let's use them to find v.",
        },
        10: {
          questionText: "What is the value of v?",
          navText: "Use the numpad to fill the answer and click ✓.",
          navDone: "Tap » to summarize.",
          feedbackWrong:
            "Remember, the sum of all interior angles of a quadrilateral is 360°. Try again!",
          feedbackCorrect:
            "Well done! You used the angle sum property of a quadrilateral to find that v = 70°.",
        },
        11: {
          questionText: "We found the values of u and v.",
          navText: "Activity Completed! Tap 'Start Over' to restart.",
          actionText: "u = 75° and v = 70°",
          nextText: "Start Over",
        },
      },
      hint: {
        title: "Hint",
        body:
          "<p>The sum of all interior angles of a<br>quadrilateral is <span class='hint-highlight'>360°</span>.</p>" +
          "<p><span class='hint-highlight'>∠P + ∠Q + ∠R + ∠S = 360°</span></p>",
        closeButton: "Close",
      },
      labels: {
        angle80: "80°",
        angle135: "135°",
        angle75: "75°",
        u: "u",
        v: "v",
        uEquals: "u = 75°",
        vEquals: "v = 70°",
      },
    },
  },
  id: {
    app: {
      steps: {
        1: {
          questionText:
            "Kedua poligon kongruen. Bisakah kamu menemukan nilai u dan v?",
          navText: "Ketuk » untuk mengidentifikasi apa yang diketahui.",
        },
        2: {
          questionText:
            "<span class='question-highlight-purple'>Kedua poligon kongruen. </span>Bisakah kamu menemukan nilai u dan v?",
          navText: "Ketuk » untuk mengidentifikasi apa yang perlu dicari.",
          polygon1: "Poligon 1",
          polygon2: "Poligon 2",
          actionText: "Poligon 1 ≅ Poligon 2",
        },
        3: {
          questionText:
            "Kedua poligon kongruen. <span class='question-highlight-purple'>Bisakah kamu menemukan nilai u dan v?</span>",
          navText: "Ketuk » untuk menemukan nilai u dan v.",
          polygon1: "Poligon 1",
          polygon2: "Poligon 2",
          actionText: "Poligon 1 ≅ Poligon 2",
        },
        4: {
          questionText:
            "Kedua poligon kongruen. Bisakah kamu menemukan nilai u dan v?",
          navText: "Ketuk poligon 2 agar serupa dengan poligon 1.",
          polygon1: "Poligon 1",
          polygon2: "Poligon 2",
          actionText: "Poligon 1 ≅ Poligon 2",
          questionAfterRotate:
            "Sudut-sudut yang bersesuaian sekarang berada pada posisi yang cocok.",
          navAfterRotate:
            "Ketuk » untuk memberi label titik sudut poligon.",
        },
        5: {
          questionText:
            "Apa urutan titik sudut yang benar pada PQRS?",
          navText: "Ketuk titik sudut dalam urutan yang benar untuk memberi label.",
          questionLabeled: "Titik sudut poligon telah diberi label.",
          navLabeled:
            "Ketuk » untuk menemukan sudut yang belum diketahui pada kedua poligon.",
        },
        6: {
          questionText:
            "Identifikasi sudut pada ABCD yang bersesuaian dengan ∠Q.",
          navText: "Ketuk sudut yang cocok pada ABCD.",
          navDone: "Ketuk » untuk mengidentifikasi sudut berikutnya yang belum diketahui.",
          actionText:
            "Karena kedua poligon kongruen,<br>∠B = ∠Q",
        },
        7: {
          questionText:
            "Identifikasi sudut pada ABCD yang bersesuaian dengan ∠S.",
          navText: "Ketuk sudut yang cocok pada ABCD.",
          navDone: "Ketuk » untuk menemukan nilai v.",
          actionText: "u = 75°",
        },
        8: {
          questionText: "Berapa nilai v?",
          navText: "Ketuk » untuk melihat cara mengidentifikasi nilai v.",
          actionText:
            "Oh! Kita tidak tahu ukuran ∠A,<br>sudut yang bersesuaian dengan ∠P.",
        },
        9: {
          questionText: "Berapa nilai v?",
          navText: "Ketuk » untuk menemukan nilai v.",
          actionText:
            "Kita tahu tiga sudut pada<br>segi empat. Mari gunakan untuk mencari v.",
        },
        10: {
          questionText: "Berapa nilai v?",
          navText: "Gunakan numpad untuk mengisi jawaban dan ketuk ✓.",
          navDone: "Ketuk » untuk merangkum.",
          feedbackWrong:
            "Ingat, jumlah semua sudut dalam segi empat adalah 360°. Coba lagi!",
          feedbackCorrect:
            "Bagus! Kamu menggunakan sifat jumlah sudut segi empat untuk menemukan v = 70°.",
        },
        11: {
          questionText: "Kita menemukan nilai u dan v.",
          navText: "Aktivitas Selesai! Ketuk 'Mulai Lagi' untuk memulai ulang.",
          actionText: "u = 75° dan v = 70°",
          nextText: "Mulai Lagi",
        },
      },
      hint: {
        title: "Petunjuk",
        body:
          "<p>Jumlah semua sudut dalam<br>segi empat adalah <span class='hint-highlight'>360°</span>.</p>" +
          "<p><span class='hint-highlight'>∠P + ∠Q + ∠R + ∠S = 360°</span></p>",
        closeButton: "Tutup",
      },
      labels: {
        angle80: "80°",
        angle135: "135°",
        angle75: "75°",
        u: "u",
        v: "v",
        uEquals: "u = 75°",
        vEquals: "v = 70°",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
