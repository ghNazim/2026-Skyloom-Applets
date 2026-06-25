const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Reflection",
        text:
          "<p>Let\u2019s explore <y>reflection</y> of this figure.<br><br>Tap START to begin!</p>",
        buttonText: "START",
      },
      finish: {
        heading: "Activity Completed!",
        text:
          "<y>Reflection</y> is a <y>transformation</y> that <y>flips</y> a figure.<br>The image forms on the <y>other side</y> of the line,<br>exactly at <y>same distance</y> as the figure.<br><br>Tap \u2018Start Over\u2019 to repeat this activity.",
        buttonText: "Start Over",
      },
      steps: {
        1: {
          text: "Let\u2019s reflect this figure across a mirror and observe the image that is formed.",
          navText: "Tap \u2018Reflect\u2019.",
          buttonReflect: "Reflect",
        },
        2: {
          text: "Mirror reflected the figure to form an image.",
          navText: "Tap \u00bb to see the mirror as a line.",
        },
        3: {
          text: "This mirror line is known as <y>line of reflection</y>.",
          navText: "Tap \u00bb to continue.",
          lineLabel: "Line of reflection",
        },
        4: {
          text: "Is the image formed by rotation of the figure?",
          navText: "Tap \u2018Check\u2019 to find out.",
          buttonCheck: "Check",
        },
        5: {
          text:
            "Rotating the figure in any orientation does not match the image.<br>So, how has the orientation changed?<br>Tap \u2018Reveal\u2019 to see the transformation.",
          navText: "Tap \u2018Reveal\u2019 to see the transformation.",
          buttonReveal: "Reveal",
        },
        6: {
          text:
            "Image is formed by <y>flipping</y> the figure across the line of <y>reflection</y>!",
          navText: "Tap \u00bb to observe the distance rule.",
        },
        7: {
          textBeforeTap:
            "Explore how the <y>distance of the figure</y> from the line <y>compares</y> to the <y>distance of its image</y>.",
          navTextBeforeTap: "Tap the figure.",
          textAfterTap:
            "The image forms on the <y>other side</y> of the line, exactly at <y>same distance</y> as the figure.",
          navTextAfterTap: "Tap \u00bb to recap.",
          textDuringK:
            "This is the image of a figure reflected across a line!",
        },
        8: {
          text:
            "This is the image of a figure reflected across a line!<br>Just like a mirror would reflect it!",
          navText: "Tap \u00bb to summarize.",
        },
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Refleksi",
        text:
          "Mari kita jelajahi refleksi bangun ini.<br><br>Ketuk MULAI untuk memulai!",
        buttonText: "MULAI",
      },
      finish: {
        heading: "Aktivitas Selesai!",
        text:
          "Refleksi adalah transformasi yang membalik sebuah bangun.<br>Bayangan terbentuk di sisi lain garis,<br>tepat pada jarak yang sama dengan bangun.<br><br>Ketuk \u2018Mulai Lagi\u2019 untuk mengulang aktivitas ini.",
        buttonText: "Mulai Lagi",
      },
      steps: {
        1: {
          text: "Mari kita refleksikan bangun ini melintasi cermin dan amati bayangan yang terbentuk.",
          navText: "Ketuk \u2018Refleksikan\u2019.",
          buttonReflect: "Refleksikan",
        },
        2: {
          text: "Cermin merefleksikan bangun untuk membentuk bayangan.",
          navText: "Ketuk \u00bb untuk melihat cermin sebagai garis.",
        },
        3: {
          text: "Garis cermin ini dikenal sebagai <y>garis refleksi</y>.",
          navText: "Ketuk \u00bb untuk melanjutkan.",
          lineLabel: "Garis refleksi",
        },
        4: {
          text: "Apakah bayangan terbentuk oleh rotasi bangun?",
          navText: "Ketuk \u2018Periksa\u2019 untuk mengetahuinya.",
          buttonCheck: "Periksa",
        },
        5: {
          text:
            "Memutar bangun dalam orientasi apa pun tidak cocok dengan bayangannya.<br>Jadi, bagaimana orientasinya berubah?<br>Ketuk \u2018Ungkap\u2019 untuk melihat transformasinya.",
          navText: "Ketuk \u2018Ungkap\u2019 untuk melihat transformasinya.",
          buttonReveal: "Ungkap",
        },
        6: {
          text:
            "Bayangan terbentuk dengan <y>membalik</y> bangun melintasi <y>garis refleksi</y>!",
          navText: "Ketuk \u00bb untuk mengamati aturan jarak.",
        },
        7: {
          textBeforeTap:
            "Jelajahi bagaimana <y>jarak bangun</y> dari garis <y>dibandingkan</y> dengan <y>jarak bayangannya</y>.",
          navTextBeforeTap: "Ketuk bangunnya.",
          textAfterTap:
            "Bayangan terbentuk di <y>sisi lain</y> garis, tepat pada <y>jarak yang sama</y> dengan bangun.",
          navTextAfterTap: "Ketuk \u00bb untuk merangkum.",
          textDuringK:
            "Ini adalah bayangan bangun yang direfleksikan melintasi garis!",
        },
        8: {
          text:
            "Ini adalah bayangan bangun yang direfleksikan melintasi garis!<br>Seperti yang akan direfleksikan cermin!",
          navText: "Ketuk \u00bb untuk merangkum.",
        },
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
