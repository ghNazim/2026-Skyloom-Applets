const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Practice on Transformations",
        text:
          "Let's solve a few questions on Transformations.<br><br>Click START to begin!",
        buttonText: "START",
      },
      replay: "REPLAY",
      mcqQuestion: "Which transformation the figure has gone through?",
      steps: {
        1: {
          navText: "Tap the correct option",
          navTextRetry: "Tap « to answer again",
          navTextNext: "Tap » to see next question",
          options: ["Translation", "Rotation", "Reflection", "Dilation"],
          ans: "Translation",
          correctFeedback:
            "Correct!<br>This is a Translation.<br>The shape moved to a new position without changing its shape, size or orientation.",
          wrongFeedback:
            "Not quite!<br>Look carefully at how<br>the shape moves.",
        },
        2: {
          questionText:
            "What properties change and what remains the same after a translation?",
          navText: "Drag each property to the correct column",
          navTextNext: "Tap » to see next question",
        },
        3: {
          navText: "Tap the correct option",
          navTextRetry: "Tap « to answer again",
          navTextNext: "Tap » to see next question",
          options: ["Translation", "Rotation", "Reflection", "Dilation"],
          ans: "Rotation",
          correctFeedback:
            "Correct!<br>This is a Rotation.<br>The shape turned around a fixed point without changing its shape or size.",
          wrongFeedback:
            "Not quite!<br>Watch again carefully. The shape is turning around a fixed point.",
        },
        4: {
          questionText:
            "What properties change and what remains the same after a rotation?",
          navText: "Drag each property to the correct column",
          navTextNext: "Tap » to see next question",
        },
        5: {
          navText: "Tap the correct option",
          navTextRetry: "Tap « to answer again",
          navTextNext: "Tap » to see next question",
          options: ["Translation", "Rotation", "Reflection", "Dilation"],
          ans: "Reflection",
          correctFeedback:
            "Correct!<br>This is a reflection. The shape flipped across a mirror line without changing its size or shape.",
          wrongFeedback:
            "Not quite!<br>Watch again carefully. The shape appears on the other side like a mirror image.",
        },
        6: {
          questionText:
            "What properties change and what remains the same after a reflection?",
          navText: "Drag each property to the correct column",
          navTextNext: "Tap » to see next question",
        },
        7: {
          navText: "Tap the correct option",
          navTextRetry: "Tap « to answer again",
          navTextNext: "Tap » to see next question",
          options: ["Translation", "Rotation", "Reflection", "Dilation"],
          ans: "Dilation",
          correctFeedback:
            "Correct!<br>This is a Dilation.<br>The shape changed its size.",
          wrongFeedback:
            "Not quite!<br>Watch again carefully. The shape has become bigger",
        },
        8: {
          questionText:
            "What properties change and what remains the same after a dilation?",
          navText: "Drag each property to the correct column",
          navTextNext: "Tap » to see next question",
        },
        9: {
          questionText: "Label the figures",
          navText: "Drag the correct label",
          navTextNext: "Tap » to see next question",
        },
        10: {
          questionText: "Identify the type of transformation",
          navText: "Drag each transformation to the correct column",
        },
      },
      labels: {
        image: { label: "Image" },
        preimage: { label: "Pre-Image" },
      },
      transformations: {
        translation: { label: "Translation" },
        rotation: { label: "Rotation" },
        reflection: { label: "Reflection" },
        dilation: { label: "Dilation" },
      },
      transformationDnd: {
        rigidTitle: "Rigid",
        nonrigidTitle: "Non-rigid",
      },
      startOver: "START OVER",
      properties: {
        size: { label: "Size" },
        shape: { label: "Shape" },
        position: { label: "Position" },
        orientation: { label: "Orientation" },
      },
      dnd: {
        changedTitle: "Changed",
        sameTitle: "Remained Same",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Latihan Transformasi",
        text:
          "Mari kita selesaikan beberapa soal tentang Transformasi.<br><br>Ketuk MULAI untuk memulai!",
        buttonText: "MULAI",
      },
      replay: "PUTAR ULANG",
      mcqQuestion: "Transformasi apa yang dialami bangun ini?",
      steps: {
        1: {
          navText: "Ketuk opsi yang benar",
          navTextRetry: "Ketuk « untuk menjawab lagi",
          navTextNext: "Ketuk » untuk melihat pertanyaan berikutnya",
          options: ["Translasi", "Rotasi", "Refleksi", "Dilatasi"],
          ans: "Translasi",
          correctFeedback:
            "Benar!<br>Ini adalah Translasi.<br>Bangun berpindah ke posisi baru tanpa mengubah bentuk, ukuran, atau orientasinya.",
          wrongFeedback:
            "Belum tepat!<br>Perhatikan dengan saksama bagaimana<br>bangun bergerak.",
        },
        2: {
          questionText:
            "Sifat apa yang berubah dan apa yang tetap sama setelah translasi?",
          navText: "Seret setiap sifat ke kolom yang benar",
          navTextNext: "Ketuk » untuk melihat pertanyaan berikutnya",
        },
        3: {
          navText: "Ketuk opsi yang benar",
          navTextRetry: "Ketuk « untuk menjawab lagi",
          navTextNext: "Ketuk » untuk melihat pertanyaan berikutnya",
          options: ["Translasi", "Rotasi", "Refleksi", "Dilatasi"],
          ans: "Rotasi",
          correctFeedback:
            "Benar!<br>Ini adalah Rotasi.<br>Bangun berputar di sekitar titik tetap tanpa mengubah bentuk atau ukurannya.",
          wrongFeedback:
            "Belum tepat!<br>Tonton lagi dengan saksama. Bangun berputar di sekitar titik tetap.",
        },
        4: {
          questionText:
            "Sifat apa yang berubah dan apa yang tetap sama setelah rotasi?",
          navText: "Seret setiap sifat ke kolom yang benar",
          navTextNext: "Ketuk » untuk melihat pertanyaan berikutnya",
        },
        5: {
          navText: "Ketuk opsi yang benar",
          navTextRetry: "Ketuk « untuk menjawab lagi",
          navTextNext: "Ketuk » untuk melihat pertanyaan berikutnya",
          options: ["Translasi", "Rotasi", "Refleksi", "Dilatasi"],
          ans: "Refleksi",
          correctFeedback:
            "Benar!<br>Ini adalah Refleksi. Bangun terbalik melintasi garis cermin tanpa mengubah ukuran atau bentuknya.",
          wrongFeedback:
            "Belum tepat!<br>Tonton lagi dengan saksama. Bangun muncul di sisi lain seperti bayangan cermin.",
        },
        6: {
          questionText:
            "Sifat apa yang berubah dan apa yang tetap sama setelah refleksi?",
          navText: "Seret setiap sifat ke kolom yang benar",
          navTextNext: "Ketuk » untuk melihat pertanyaan berikutnya",
        },
        7: {
          navText: "Ketuk opsi yang benar",
          navTextRetry: "Ketuk « untuk menjawab lagi",
          navTextNext: "Ketuk » untuk melihat pertanyaan berikutnya",
          options: ["Translasi", "Rotasi", "Refleksi", "Dilatasi"],
          ans: "Dilatasi",
          correctFeedback:
            "Benar!<br>Ini adalah Dilatasi.<br>Bangun mengubah ukurannya.",
          wrongFeedback:
            "Belum tepat!<br>Tonton lagi dengan saksama. Bangun menjadi lebih besar",
        },
        8: {
          questionText:
            "Sifat apa yang berubah dan apa yang tetap sama setelah dilatasi?",
          navText: "Seret setiap sifat ke kolom yang benar",
          navTextNext: "Ketuk » untuk melihat pertanyaan berikutnya",
        },
        9: {
          questionText: "Berilah label pada bangun",
          navText: "Seret label yang benar",
          navTextNext: "Ketuk » untuk melihat pertanyaan berikutnya",
        },
        10: {
          questionText: "Identifikasi jenis transformasi",
          navText: "Seret setiap transformasi ke kolom yang benar",
        },
      },
      labels: {
        image: { label: "Gambar" },
        preimage: { label: "Pra-gambar" },
      },
      transformations: {
        translation: { label: "Translasi" },
        rotation: { label: "Rotasi" },
        reflection: { label: "Refleksi" },
        dilation: { label: "Dilatasi" },
      },
      transformationDnd: {
        rigidTitle: "Kaku",
        nonrigidTitle: "Tidak Kaku",
      },
      startOver: "MULAI LAGI",
      properties: {
        size: { label: "Ukuran" },
        shape: { label: "Bentuk" },
        position: { label: "Posisi" },
        orientation: { label: "Orientasi" },
      },
      dnd: {
        changedTitle: "Berubah",
        sameTitle: "Tetap Sama",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
