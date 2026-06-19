const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "RIGID AND NON-RIGID TRANSFORMATIONS",
        text:
          "Transformations can be grouped based on<br>whether the shape and size change or remain the same.<br>Let's explore these groups.",
        buttonText: "START",
      },
      steps: {
        1: {
          instructionText:
            "This figure can change in different ways.<br>Let's make copies of the figure and transform each one differently.",
          navText: "Tap on the figure to make copies",
        },
        2: {
          navText: "Tap to translate the figure",
          translationHeading: "TRANSLATION",
        },
        3: {
          navText: "Tap to reflect the figure",
          reflectionHeading: "REFLECTION",
        },
        4: {
          navText: "Tap to rotate the figure",
          rotationHeading: "ROTATION",
        },
        5: {
          navText: "Tap to dilate the figure",
          dilationHeading: "DILATION",
        },
        6: {
          navText:
            "Tap any transformed image to compare shape and size with the original figure.",
          overlapTextYes: "They overlap<br>perfectly!",
          overlapTextNo: "They don't overlap<br>perfectly!",
          overlayHeadingRigidBefore: "The ",
          overlayHeadingRigidAfter: " keeps the shape and size the same.",
          overlayHeadingDilationBefore: "The ",
          overlayHeadingDilationAfter:
            " changes the size of the figure keeping the shape same.",
          overlayLeftHeading: "Same shape and size",
          overlayRightHeading: "Change in shape or size",
          overlayFooter: "Tap anywhere to close",
          navTapLeft:
            "Tap 'same shape and size' to discover the term used for these transformations",
          navTapRight:
            "Tap 'change in shape or size' to discover the term used for these transformations",
          rigidGroupHeading: "RIGID TRANSFORMATIONS",
          nonRigidGroupHeading: "NON-RIGID TRANSFORMATIONS",
        },
        7: {
          heading: "RIGID AND NON-RIGID TRANSFORMATIONS",
          text:
            'A transformation that keeps the <span class="highlight-peach">shape</span> and size of the figure the same<br>is called a <span class="highlight-rigid">Rigid Transformation</span>, also known as an <span class="highlight-peach">isometry</span>.<br><br>A transformation that <span class="highlight-purple-light">changes the shape</span> or size of a figure<br>is called a <span class="highlight-nonrigid">Non-rigid Transformation</span>.',
          buttonText: "Summarize",
        },
      },
      finalTable: {
        leftHeading: "RIGID TRANSFORMATIONS",
        rightHeading: "NON-RIGID TRANSFORMATIONS",
        buttonText: "Start Over",
      },
      labels: {
        translation: "TRANSLATION",
        reflection: "REFLECTION",
        rotation: "ROTATION",
        dilation: "DILATION",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "TRANSFORMASI KAKU DAN TIDAK KAKU",
        text:
          "Transformasi dapat dikelompokkan berdasarkan<br>apakah bentuk dan ukuran berubah atau tetap sama.<br>Mari kita jelajahi kelompok-kelompok ini.",
        buttonText: "MULAI",
      },
      steps: {
        1: {
          instructionText:
            "Bangun ini dapat berubah dengan cara yang berbeda.<br>Mari buat salinan bangun dan transformasikan masing-masing secara berbeda.",
          navText: "Ketuk bangun untuk membuat salinan",
        },
        2: {
          navText: "Ketuk untuk mentranslasikan bangun",
          translationHeading: "TRANSLASI",
        },
        3: {
          navText: "Ketuk untuk memantulkan bangun",
          reflectionHeading: "CERMIN",
        },
        4: {
          navText: "Ketuk untuk memutar bangun",
          rotationHeading: "ROTASI",
        },
        5: {
          navText: "Ketuk untuk memperbesar bangun",
          dilationHeading: "DILATASI",
        },
        6: {
          navText:
            "Ketuk gambar yang ditransformasi untuk membandingkan bentuk dan ukuran dengan bangun asli.",
          overlapTextYes: "Mereka tumpang tindih<br>dengan sempurna!",
          overlapTextNo: "Mereka tidak tumpang tindih<br>dengan sempurna!",
          overlayHeadingRigidBefore: "",
          overlayHeadingRigidAfter:
            " mempertahankan bentuk dan ukuran yang sama.",
          overlayHeadingDilationBefore: "",
          overlayHeadingDilationAfter:
            " mengubah ukuran bangun sambil mempertahankan bentuk yang sama.",
          overlayLeftHeading: "Bentuk dan ukuran sama",
          overlayRightHeading: "Perubahan bentuk atau ukuran",
          overlayFooter: "Ketuk di mana saja untuk menutup",
          navTapLeft:
            "Ketuk 'bentuk dan ukuran sama' untuk mengetahui istilah transformasi ini",
          navTapRight:
            "Ketuk 'perubahan bentuk atau ukuran' untuk mengetahui istilah transformasi ini",
          rigidGroupHeading: "TRANSFORMASI KAKU",
          nonRigidGroupHeading: "TRANSFORMASI TIDAK KAKU",
        },
        7: {
          heading: "TRANSFORMASI KAKU DAN TIDAK KAKU",
          text:
            'Transformasi yang mempertahankan <span class="highlight-peach">bentuk</span> dan ukuran bangun<br>disebut <span class="highlight-rigid">Transformasi Kaku</span>, juga dikenal sebagai <span class="highlight-peach">isometri</span>.<br><br>Transformasi yang <span class="highlight-purple-light">mengubah bentuk</span> atau ukuran bangun<br>disebut <span class="highlight-nonrigid">Transformasi Tidak Kaku</span>.',
          buttonText: "Ringkas",
        },
      },
      finalTable: {
        leftHeading: "TRANSFORMASI KAKU",
        rightHeading: "TRANSFORMASI TIDAK KAKU",
        buttonText: "Ulangi dari Awal",
      },
      labels: {
        translation: "TRANSLASI",
        reflection: "CERMIN",
        rotation: "ROTASI",
        dilation: "DILATASI",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
