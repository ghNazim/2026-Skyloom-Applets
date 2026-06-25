const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Dilation about different positions",
        text:
          "Dilation is much more interesting when the position of<br>center of dilation changes! Let's explore.<br><br>Click START to begin!",
        buttonText: "START",
      },
      finish: {
        heading: "Dilation about different positions",
        text:
          "We observed how the image changes as the <y>center of dilation</y><br>moves inside the figure, onto the figure, and outside the<br>figure.<br><br>Tap \"Start Over\" to restart the activity.",
        buttonText: "START OVER",
      },
      steps: {
        1: {
          questionText: "Exploring the Position of the Center of Dilation",
          navText: "Tap a figure to choose the position of the center of dilation.",
        },
        2: {
          navTextInitial: "Drag the slider to dilate the image.",
          navTextDone: "Tap » to explore another position of the centre.",
          navTextAllDone: "Tap » to explore dilation about any center.",
        },
        3: {
          questionText: "Explore dilation about any center by moving point 'O'.",
          navText:
            "Move the center of dilation anywhere or tap » to summarise.",
        },
      },
      cards: {
        outside: {
          title: "Center of Dilation<br>outside the figure",
          questionText: "Center of Dilation outside the figure",
          feedbackInitial:
            "Here center of dilation (point O) is <hl>outside the figure</hl>.<br>Let's dilate.",
          feedbackAfter:
            "The image and pre-image lie <hl>along the same straight lines<br>drawn from the center</hl>, with the image located <y>closer to<br>or farther</y> from it.",
        },
        inside: {
          title: "Center of Dilation<br>inside the figure",
          questionText: "Center of Dilation inside the figure",
          feedbackInitial:
            "Here center of dilation (point O) is <hl>inside the figure</hl>.<br>Let's dilate.",
          feedbackAfter:
            "Here the pre-image and image <hl>always overlap</hl>, sharing<br>the center of dilation as a <y>common interior point</y>.",
        },
        onedge: {
          title: "Center of Dilation<br>on the edge",
          questionText: "Center of Dilation on the edge",
          feedbackInitial:
            "Here center of dilation (point O) is <hl>on the edge of<br>the figure</hl>. Let's dilate.",
          feedbackAfter:
            "Here, the pre-image and image <hl>remain connected</hl> at<br><y>the center of dilation</y>, which lies on the edge of the figure.",
        },
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Dilatasi pada posisi berbeda",
        text:
          "Dilatasi jauh lebih menarik ketika posisi<br>pusat dilatasi berubah! Mari kita jelajahi.<br><br>Ketuk MULAI untuk memulai!",
        buttonText: "MULAI",
      },
      finish: {
        heading: "Dilatasi pada posisi berbeda",
        text:
          "Kita mengamati bagaimana bayangan berubah ketika <y>pusat dilatasi</y><br>bergerak ke dalam bangun, di atas bangun, dan di luar<br>bangun.<br><br>Ketuk \"Mulai Lagi\" untuk memulai ulang aktivitas.",
        buttonText: "MULAI LAGI",
      },
      steps: {
        1: {
          questionText: "Menjelajahi Posisi Pusat Dilatasi",
          navText:
            "Ketuk sebuah gambar untuk memilih posisi pusat dilatasi.",
        },
        2: {
          navTextInitial: "Seret penggeser untuk mendilatasi bayangan.",
          navTextDone:
            "Ketuk » untuk menjelajahi posisi pusat lainnya.",
          navTextAllDone:
            "Ketuk » untuk menjelajahi dilatasi pada pusat mana pun.",
        },
        3: {
          questionText:
            "Jelajahi dilatasi pada pusat mana pun dengan memindahkan titik 'O'.",
          navText:
            "Pindahkan pusat dilatasi ke mana saja atau ketuk » untuk merangkum.",
        },
      },
      cards: {
        outside: {
          title: "Pusat Dilatasi<br>di luar bangun",
          questionText: "Pusat Dilatasi di luar bangun",
          feedbackInitial:
            "Di sini pusat dilatasi (titik O) berada <hl>di luar bangun</hl>.<br>Mari kita dilatasi.",
          feedbackAfter:
            "Bayangan dan pra-bayangan terletak <hl>pada garis lurus yang sama<br>yang ditarik dari pusat</hl>, dengan bayangan yang terletak <y>lebih dekat<br>atau lebih jauh</y> darinya.",
        },
        inside: {
          title: "Pusat Dilatasi<br>di dalam bangun",
          questionText: "Pusat Dilatasi di dalam bangun",
          feedbackInitial:
            "Di sini pusat dilatasi (titik O) berada <hl>di dalam bangun</hl>.<br>Mari kita dilatasi.",
          feedbackAfter:
            "Di sini pra-bayangan dan bayangan <hl>selalu tumpang tindih</hl>, berbagi<br>pusat dilatasi sebagai <y>titik interior yang sama</y>.",
        },
        onedge: {
          title: "Pusat Dilatasi<br>di tepi bangun",
          questionText: "Pusat Dilatasi di tepi bangun",
          feedbackInitial:
            "Di sini pusat dilatasi (titik O) berada <hl>di tepi bangun</hl>.<br>Mari kita dilatasi.",
          feedbackAfter:
            "Di sini, pra-bayangan dan bayangan <hl>tetap terhubung</hl> pada<br><y>pusat dilatasi</y>, yang terletak di tepi bangun.",
        },
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
