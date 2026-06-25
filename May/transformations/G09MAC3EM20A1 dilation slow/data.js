const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Dilation",
        text: "You've explored transformations that preserve size<br>of a shape. Now let's see what happens when a<br>transformation changes size of a shape.<br><br>Click START to begin!",
        buttonText: "START",
      },
      finish: {
        heading: "Dilation",
        text: '<p>A <y>dilation</y> is a transformation that<br>enlarges or reduces a figure while<br>preserving its shape about a fixed<br>point called the <g>center of dilation</g>.<br><br>Tap "Start Over" to Restart.</p>',
        buttonText: "START OVER",
      },
      slider: {
        zoomOut: "Zoom out",
        zoomIn: "Zoom in",
        scaleFactor: "Scale Factor(k)",
      },
      steps: {
        1: {
          questionText:
            "Observe how the triangle changes as you move the slider.",
          questionTextAfter:
            "The triangle has <y>increased</y> in size. This is an <y>enlargement</y>.",
          navText: "Drag the slider to the right and watch the triangle grow.",
        },
        2: {
          questionText:
            "The triangle has <y>increased</y> in size. This is an <y>enlargement</y>.",
          navText:
            "Drag the slider back to the center to return to the original size.",
        },
        3: {
          questionText:
            "The triangle has <y>returned to its original size</y>.",
          questionTextAfter:
            "The triangle has <y>decreased</y> in size. This is a <y>reduction</y>.",
          navTextInitial:
            "Drag the slider to the left and watch the triangle shrink.",
          navTextDone: "Tap » to explore about this transformation.",
        },
        4: {
          questionText:
            "The transformation shown here is called <y>dilation</y>.",
          navText: "Tap » to see the key elements of dilation.",
          rightText:
            "<y>Dilation</y> is a transformation that <y>changes the size</y> of a figure while keeping its shape the same.",
        },
        5: {
          questionText: "Key Elements of Dilation",
          navText:
            "Drag the slider above 1 and see how size change as per scale factor.",
          rightText:
            "Change in size of image is represented with <y>scale factor</y>. The scale factor is denoted by the letter 'k'.",
        },
        6: {
          questionText:
            "When the <y>scale factor (k) > 1</y>, the dilation produces a larger image called an <y>enlargement</y>.",
          navText:
            "Drag the slider to set it to 1 and see how size change as per scale factor.",
        },
        7: {
          questionText:
            "When the <y>scale factor (k) = 1</y>, the image remains the same size as the original image.",
          navTextInitial:
            "Drag the slider below 1 and see how size change as per scale factor.",
          questionTextAfter:
            "When the <y>scale factor is 0 < (k) < 1</y>, the dilation produces a smaller image called a <y>reduction</y>.",
          navTextAfter: "Tap » to other the key elements of dilation.",
        },
        8: {
          questionText:
            "Identify the point around which the triangle changes size.",
          navTextInitial: "Tap the correct point.",
          questionTextAfter:
            "The <y>fixed point</y> about which a figure is enlarged or shrunk is called <y>center of dilation</y>.",
          navTextAfter: "Tap » to summarise.",
        },
      },
      mcq: {
        gt1: {
          title: "What happens when the<br><y>scale factor(k) > 1</y>?",
          options: [
            "Enlarges triangle",
            "Reduces triangle",
            "No change in triangle",
          ],
          correctIndex: 0,
        },
        eq1: {
          title: "What happens when the<br><y>scale factor(k) = 1</y>?",
          options: [
            "Enlarges triangle",
            "Reduces triangle",
            "No change in triangle",
          ],
          correctIndex: 2,
        },
        lt1: {
          title: "What happens when the<br><y>scale factor(k) < 1</y>?",
          options: [
            "Enlarges triangle",
            "Reduces triangle",
            "No change in triangle",
          ],
          correctIndex: 1,
        },
      },
      feedback: {
        pointWrong:
          "Not quite! Look for the point that remains fixed as the triangle changes size.",
        pointCorrect:
          "Excellent! The triangle grows or shrinks around this point.",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Dilatasi",
        text: "Anda telah menjelajahi transformasi yang mempertahankan ukuran<br>bentuk. Sekarang mari kita lihat apa yang terjadi ketika<br>transformasi mengubah ukuran bentuk.<br><br>Ketuk MULAI untuk memulai!",
        buttonText: "MULAI",
      },
      finish: {
        heading: "Dilatasi",
        text: '<p><y>Dilatasi</y> adalah transformasi yang<br>memperbesar atau memperkecil bangun sambil<br>mempertahankan bentuknya terhadap titik<br>tetap yang disebut <g>pusat dilatasi</g>.<br><br>Ketuk "Mulai Lagi" untuk memulai ulang.</p>',
        buttonText: "MULAI LAGI",
      },
      slider: {
        zoomOut: "Perkecil",
        zoomIn: "Perbesar",
        scaleFactor: "Faktor Skala(k)",
      },
      steps: {
        1: {
          questionText:
            "Amati bagaimana segitiga berubah saat Anda menggerakkan penggeser.",
          questionTextAfter:
            "Segitiga telah <y>bertambah</y> ukurannya. Ini adalah <y>pembesaran</y>.",
          navText: "Seret penggeser ke kanan dan lihat segitiga membesar.",
        },
        2: {
          questionText:
            "Segitiga telah <y>bertambah</y> ukurannya. Ini adalah <y>pembesaran</y>.",
          navText:
            "Seret penggeser kembali ke tengah untuk kembali ke ukuran asli.",
        },
        3: {
          questionText:
            "Segitiga telah <y>kembali ke ukuran aslinya</y>.",
          questionTextAfter:
            "Segitiga telah <y>mengecil</y>. Ini adalah <y>reduksi</y>.",
          navTextInitial:
            "Seret penggeser ke kiri dan lihat segitiga mengecil.",
          navTextDone: "Ketuk » untuk menjelajahi transformasi ini.",
        },
        4: {
          questionText:
            "Transformasi yang ditunjukkan di sini disebut <y>dilatasi</y>.",
          navText: "Ketuk » untuk melihat elemen kunci dilatasi.",
          rightText:
            "<y>Dilatasi</y> adalah transformasi yang <y>mengubah ukuran</y> bangun sambil menjaga bentuknya tetap sama.",
        },
        5: {
          questionText: "Elemen Kunci Dilatasi",
          navText:
            "Seret penggeser di atas 1 dan lihat perubahan ukuran sesuai faktor skala.",
          rightText:
            "Perubahan ukuran bayangan diwakili dengan <y>faktor skala</y>. Faktor skala dinotasikan dengan huruf 'k'.",
        },
        6: {
          questionText:
            "Ketika <y>faktor skala (k) > 1</y>, dilatasi menghasilkan bayangan yang lebih besar yang disebut <y>pembesaran</y>.",
          navText:
            "Seret penggeser ke 1 dan lihat perubahan ukuran sesuai faktor skala.",
        },
        7: {
          questionText:
            "Ketika <y>faktor skala (k) = 1</y>, bayangan tetap sama ukurannya dengan bayangan asli.",
          navTextInitial:
            "Seret penggeser di bawah 1 dan lihat perubahan ukuran sesuai faktor skala.",
          questionTextAfter:
            "Ketika <y>faktor skala 0 < (k) < 1</y>, dilatasi menghasilkan bayangan yang lebih kecil yang disebut <y>reduksi</y>.",
          navTextAfter: "Ketuk » untuk melihat elemen kunci dilatasi lainnya.",
        },
        8: {
          questionText:
            "Identifikasi titik di sekitar mana segitiga berubah ukuran.",
          navTextInitial: "Ketuk titik yang benar.",
          questionTextAfter:
            "<y>Titik tetap</y> di sekitar mana bangun diperbesar atau diperkecil disebut <y>pusat dilatasi</y>.",
          navTextAfter: "Ketuk » untuk merangkum.",
        },
      },
      mcq: {
        gt1: {
          title: "Apa yang terjadi ketika<br><y>faktor skala(k) > 1</y>?",
          options: [
            "Memperbesar segitiga",
            "Memperkecil segitiga",
            "Tidak ada perubahan segitiga",
          ],
          correctIndex: 0,
        },
        eq1: {
          title: "Apa yang terjadi ketika<br><y>faktor skala(k) = 1</y>?",
          options: [
            "Memperbesar segitiga",
            "Memperkecil segitiga",
            "Tidak ada perubahan segitiga",
          ],
          correctIndex: 2,
        },
        lt1: {
          title: "Apa yang terjadi ketika<br><y>faktor skala(k) < 1</y>?",
          options: [
            "Memperbesar segitiga",
            "Memperkecil segitiga",
            "Tidak ada perubahan segitiga",
          ],
          correctIndex: 1,
        },
      },
      feedback: {
        pointWrong:
          "Belum tepat! Cari titik yang tetap pada posisinya saat segitiga berubah ukuran.",
        pointCorrect:
          "Bagus! Segitiga membesar atau mengecil di sekitar titik ini.",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
