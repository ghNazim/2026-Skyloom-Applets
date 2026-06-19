const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Different types of Transformations",
        text: "Transformation is simply movement<br>based on a set of rules.<br>There are different types of transformations.<br>Let's explore them…",
        buttonText: "Start",
      },
      steps: {
        1: {
          questionText: "",
          navText:
            "Tap any of the icons to explore different transformations…",
          introText:
            "This is an object on<br>the screen…<br>It is made of line<br>segments meeting<br>at points.",
        },
        2: {
          questionText: "Drag and MOVE the figure to the target location",
          navText: "",
        },
        3: {
          questionText: "Answer the question to uncover patterns…",
          questionTextAfter: "What changed when you moved the figure?",
          questionTranslation: "TRANSLATION",
          navText:
            "Tap any of the icons to explore different transformations…",
          mcqs: [
            {
              title:
                "Did the shape of the figure<br>change when you moved it?",
              options: ["Yes", "No"],
              answer: "No",
            },
            {
              title:
                "Did the size of the figure<br>change when you moved it?",
              options: ["Yes", "No"],
              answer: "No",
            },
            {
              title:
                "Did the turn or orientation of the figure<br>change when you moved it?",
              options: ["Yes", "No"],
              answer: "No",
            },
          ],
          summaries: [
            {
              line1: "Moving the figure caused",
              lines: ["- NO CHANGE IN SHAPE"],
            },
            {
              line1: "Moving the figure caused",
              lines: [
                "- NO CHANGE IN SHAPE",
                "- NO CHANGE IN SIZE",
              ],
            },
            {
              line1: "Moving the figure caused",
              lines: [
                "- NO CHANGE IN SHAPE",
                "- NO CHANGE IN SIZE",
                "- NO CHANGE IN ORIENTATION",
              ],
            },
          ],
          revealButton: "Reveal what changed",
          revealParts: [
            "Every point ",
            "on the shape<br>",
            "changed its POSITION<br>",
            "by the SAME DISTANCE<br>",
            "in the SAME DIRECTION.",
          ],
          blueBox:
            "Such a Transformation<br>is called a <y>TRANSLATION</y>.",
          definitionTyping:
            "A transformation in which every point of a figure changes its POSITION by the SAME DISTANCE in the SAME DIRECTION.",
          textLayover: {
            body:
              "<y>Translation is a transformation</y> when point(s)<br>are moved from one position to another<br><y>to a particular distance in a particular direction</y>.<br><bl>Translation causes no change in orientation, shape or size</bl><br>of a collection of points.",
            footer: "Tap anywhere to close.",
          },
        },
      },
      navigation: {
        move: "Move",
        rotate: "Rotate",
        zoom: "Zoom",
        mirror: "Mirror",
        startOver: "Start Over",
      },
      rotate: {
        tapQuestion: "Tap on the figure.",
        rotateQuestion:
          "Turn the figure around the fixed point to reach its target position.",
        mcqQuestion: "Answer the question to uncover patterns…",
        summaryQuestion: "What changed when you turned the figure?",
        mcq: {
          title:
            "Did the shape or size of the figure<br>change when you turned it?",
          options: ["Yes", "No"],
          answer: "No",
        },
        summary: {
          line1: "Turning the figure caused",
          lines: ["- NO CHANGE IN SHAPE", "- NO CHANGE IN SIZE"],
        },
        orientationSummary: {
          text:
            "The orientation changes<br>when the figure turns around<br>a fixed point.",
        },
        pointsSummary: {
          text:
            "Every point on the figure<br>follows a circular path around<br>a fixed point when the figure is<br>turned.",
        },
        fullSummary: {
          line1: "Turning the figure caused",
          lines: [
            "- NO CHANGE IN SHAPE",
            "- NO CHANGE IN SIZE",
            "- CHANGE IN ORIENTATION",
            "- CHANGE IN POSITION",
          ],
        },
        revealButton: "Reveal what changed",
        whatElseButton: "What else changed",
        summarizeButton: "Summarize",
        replayButton: "Replay",
        observeQuestion:
          "Observe how every points move when you turn the figure",
        questionTranslation: "ROTATION",
        blueBox:
          "Such a Transformation<br>is called a <y>ROTATION</y>.",
        definitionTyping:
          "A transformation in which point(s) are turned about a fixed point through a specified angle and in a specified direction.",
        textLayover: {
          body:
            "<o>Rotation</o> is a transformation when point(s)<br>are <y>turned around a fixed point</y><br><y>through a particular angle in a particular direction.</y><br>The <o>fixed point</o> around which a figure rotates is called<br><o>centre of rotation.</o><br><br>Rotation causes <bl>no change in shape or size</bl> of a collection of<br>points, but the <bl>orientation and position changes.</bl>",
          footer: "Tap anywhere to close.",
        },
        navText:
          "Tap any of the icons to explore different transformations…",
      },
      zoom: {
        tapQuestion: "Tap anywhere in the region to select a point.",
        sliderQuestion:
          "Drag the slider to the markers to resize the figure",
        summaryQuestion: "What changed when you resized the figure?",
        summary: {
          line1: "Resizing the figure caused",
          lines: [
            "- NO CHANGE IN SHAPE",
            "- NO CHANGE IN ORIENTATION",
          ],
        },
        revealSummary: {
          text:
            "The figure became larger/smaller.<br>Every point on the figure changed<br>its position except the fixed point<br>about which the figure was<br>resized.",
        },
        fullSummary: {
          line1: "Resizing the figure caused",
          lines: [
            "- NO CHANGE IN SHAPE",
            "- NO CHANGE IN ORIENTATION",
            "- CHANGE IN SIZE",
            "- CHANGE IN POSITION",
          ],
        },
        revealButton: "Reveal what changed",
        summarizeButton: "Summarize",
        replayButton: "Replay",
        questionTranslation: "DILATION",
        blueBox:
          "Such a Transformation<br>is called a <y>DILATION</y>.",
        definitionTyping:
          "A transformation in which point(s) are moved closer to or farther from a fixed point to enlarge or shrink a figure.",
        textLayover: {
          body:
            "<y>Dilation is a transformation</y> when point(s)<br>are moved closer to or farther <y>from a fixed point</y><br><y>to enlarge or shrink the figure.</y><br><br>The <o>fixed point</o> about which a figure is enlarged or shrunk is called <o>center of dilation.</o><br><br><bl>Dilation changes the size and position</bl> of a collection of points,<br>but <bl>the shape and orientation remains the same.</bl>",
          footer: "Tap anywhere to close.",
        },
        navText:
          "Tap any of the icons to explore different transformations…",
      },
      mirror: {
        dragQuestion: "Move the mirror towards the figure",
        dragFeedback: "Drag the mirror till you see image",
        tapMirrorQuestion: "Tap the mirror.",
        flipQuestion: "Tap the mirror line to flip the figure.",
        summaryQuestion: "What changed when you flipped the figure?",
        summary: {
          line1: "Flipping the figure caused",
          lines: ["- NO CHANGE IN SHAPE", "- NO CHANGE IN SIZE"],
        },
        revealSummary: {
          text:
            "Every point on the figure<br>changed its position<br>causing<br>change in orientation",
        },
        fullSummary: {
          line1: "Flipping the figure caused",
          lines: [
            "- NO CHANGE IN SHAPE",
            "- NO CHANGE IN SIZE",
            "- CHANGE IN POSITION",
            "- CHANGE IN ORIENTATION",
          ],
        },
        revealButton: "Reveal what changed",
        summarizeButton: "Summarize",
        replayButton: "Replay",
        questionTranslation: "REFLECTION",
        blueBox:
          "Such a Transformation<br>is called a <y>REFLECTION</y>.",
        definitionTyping:
          "A transformation in which point(s) are flipped across a line",
        textLayover: {
          body:
            "<y>Reflection is a transformation</y> when point(s)<br>are flipped across a line called the <y>line of reflection.</y><br><br><bl>Reflection causes no change in shape or size</bl><br>of a collection of points, but the <bl>orientation and position changes.</bl>",
          footer: "Tap anywhere to close.",
        },
        navText:
          "Tap any of the icons to explore different transformations…",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Berbagai Jenis Transformasi",
        text: "Transformasi adalah pergerakan<br>berdasarkan seperangkat aturan.<br>Ada berbagai jenis transformasi.<br>Mari kita jelajahi…",
        buttonText: "Mulai",
      },
      steps: {
        1: {
          questionText: "",
          navText:
            "Ketuk salah satu ikon untuk menjelajahi transformasi yang berbeda…",
          introText:
            "Ini adalah objek di<br>layar…<br>Objek ini terbuat dari<br>ruas garis yang<br>bertemu di titik-titik.",
        },
        2: {
          questionText: "Seret dan PINDAHKAN figur ke lokasi target",
          navText: "",
        },
        3: {
          questionText: "Jawab pertanyaan untuk menemukan pola…",
          questionTextAfter: "Apa yang berubah ketika Anda memindahkan figur?",
          questionTranslation: "TRANSLASI",
          navText:
            "Ketuk salah satu ikon untuk menjelajahi transformasi yang berbeda…",
          mcqs: [
            {
              title:
                "Apakah bentuk figur berubah<br>ketika Anda memindahkannya?",
              options: ["Ya", "Tidak"],
              answer: "Tidak",
            },
            {
              title:
                "Apakah ukuran figur berubah<br>ketika Anda memindahkannya?",
              options: ["Ya", "Tidak"],
              answer: "Tidak",
            },
            {
              title:
                "Apakah arah atau orientasi figur berubah<br>ketika Anda memindahkannya?",
              options: ["Ya", "Tidak"],
              answer: "Tidak",
            },
          ],
          summaries: [
            {
              line1: "Memindahkan figur menyebabkan",
              lines: ["- TIDAK ADA PERUBAHAN BENTUK"],
            },
            {
              line1: "Memindahkan figur menyebabkan",
              lines: [
                "- TIDAK ADA PERUBAHAN BENTUK",
                "- TIDAK ADA PERUBAHAN UKURAN",
              ],
            },
            {
              line1: "Memindahkan figur menyebabkan",
              lines: [
                "- TIDAK ADA PERUBAHAN BENTUK",
                "- TIDAK ADA PERUBAHAN UKURAN",
                "- TIDAK ADA PERUBAHAN ORIENTASI",
              ],
            },
          ],
          revealButton: "Ungkap apa yang berubah",
          revealParts: [
            "Setiap titik ",
            "pada bentuk<br>",
            "mengubah POSISI-nya<br>",
            "dengan JARAK YANG SAMA<br>",
            "ke ARAH YANG SAMA.",
          ],
          blueBox:
            "Transformasi seperti ini<br>disebut <y>TRANSLASI</y>.",
          definitionTyping:
            "Transformasi di mana setiap titik pada sebuah figur mengubah POSISI-nya dengan JARAK YANG SAMA ke ARAH YANG SAMA.",
          textLayover: {
            body:
              "<y>Translasi adalah transformasi</y> ketika titik-titik<br>dipindahkan dari satu posisi ke posisi lain<br><y>sejauh jarak tertentu ke arah tertentu</y>.<br><bl>Translasi tidak mengubah orientasi, bentuk, atau ukuran</bl><br>kumpulan titik.",
            footer: "Ketuk di mana saja untuk menutup.",
          },
        },
      },
      navigation: {
        move: "Pindah",
        rotate: "Putar",
        zoom: "Perbesar",
        mirror: "Cermin",
        startOver: "Mulai Lagi",
      },
      rotate: {
        tapQuestion: "Ketuk figur.",
        rotateQuestion:
          "Putar figur di sekitar titik tetap untuk mencapai posisi target.",
        mcqQuestion: "Jawab pertanyaan untuk menemukan pola…",
        summaryQuestion: "Apa yang berubah ketika Anda memutar figur?",
        mcq: {
          title:
            "Apakah bentuk atau ukuran figur berubah<br>ketika Anda memutarnya?",
          options: ["Ya", "Tidak"],
          answer: "Tidak",
        },
        summary: {
          line1: "Memutar figur menyebabkan",
          lines: ["- TIDAK ADA PERUBAHAN BENTUK", "- TIDAK ADA PERUBAHAN UKURAN"],
        },
        orientationSummary: {
          text:
            "Orientasi berubah<br>ketika figur berputar<br>di sekitar titik tetap.",
        },
        pointsSummary: {
          text:
            "Setiap titik pada figur<br>mengikuti lintasan melingkar<br>di sekitar titik tetap ketika<br>figur diputar.",
        },
        fullSummary: {
          line1: "Memutar figur menyebabkan",
          lines: [
            "- TIDAK ADA PERUBAHAN BENTUK",
            "- TIDAK ADA PERUBAHAN UKURAN",
            "- PERUBAHAN ORIENTASI",
            "- PERUBAHAN POSISI",
          ],
        },
        revealButton: "Ungkap apa yang berubah",
        whatElseButton: "Apa lagi yang berubah",
        summarizeButton: "Ringkas",
        replayButton: "Putar Ulang",
        observeQuestion:
          "Amati bagaimana setiap titik bergerak ketika Anda memutar figur",
        questionTranslation: "ROTASI",
        blueBox:
          "Transformasi seperti ini<br>disebut <y>ROTASI</y>.",
        definitionTyping:
          "Transformasi di mana titik-titik diputar mengelilingi titik tetap melalui sudut tertentu ke arah tertentu.",
        textLayover: {
          body:
            "<o>Rotasi</o> adalah transformasi ketika titik-titik<br><y>diputar mengelilingi titik tetap</y><br><y>melalui sudut tertentu ke arah tertentu.</y><br><o>Titik tetap</o> tempat figur berputar disebut<br><o>pusat rotasi.</o><br><br>Rotasi menyebabkan <bl>tidak ada perubahan bentuk atau ukuran</bl> kumpulan<br>titik, tetapi <bl>orientasi dan posisinya berubah.</bl>",
          footer: "Ketuk di mana saja untuk menutup.",
        },
        navText:
          "Ketuk salah satu ikon untuk menjelajahi transformasi yang berbeda…",
      },
      zoom: {
        tapQuestion: "Ketuk di mana saja di wilayah untuk memilih titik.",
        sliderQuestion:
          "Seret penggeser ke penanda untuk mengubah ukuran figur",
        summaryQuestion: "Apa yang berubah ketika Anda mengubah ukuran figur?",
        summary: {
          line1: "Mengubah ukuran figur menyebabkan",
          lines: [
            "- TIDAK ADA PERUBAHAN BENTUK",
            "- TIDAK ADA PERUBAHAN ORIENTASI",
          ],
        },
        revealSummary: {
          text:
            "Figur menjadi lebih besar/kecil.<br>Setiap titik pada figur mengubah<br>posisinya kecuali titik tetap<br>tempat figur diubah<br>ukurannya.",
        },
        fullSummary: {
          line1: "Mengubah ukuran figur menyebabkan",
          lines: [
            "- TIDAK ADA PERUBAHAN BENTUK",
            "- TIDAK ADA PERUBAHAN ORIENTASI",
            "- PERUBAHAN UKURAN",
            "- PERUBAHAN POSISI",
          ],
        },
        revealButton: "Ungkap apa yang berubah",
        summarizeButton: "Ringkas",
        replayButton: "Putar Ulang",
        questionTranslation: "DILASI",
        blueBox:
          "Transformasi seperti ini<br>disebut <y>DILASI</y>.",
        definitionTyping:
          "Transformasi di mana titik-titik dipindahkan lebih dekat atau lebih jauh dari titik tetap untuk memperbesar atau memperkecil figur.",
        textLayover: {
          body:
            "<y>Dilasi adalah transformasi</y> ketika titik-titik<br>dipindahkan lebih dekat atau lebih jauh <y>dari titik tetap</y><br><y>untuk memperbesar atau memperkecil figur.</y><br><br><o>Titik tetap</o> tempat figur diperbesar atau diperkecil disebut <o>pusat dilatasi.</o><br><br><bl>Dilasi mengubah ukuran dan posisi</bl> kumpulan titik,<br>tetapi <y>bentuk dan orientasinya tetap sama.</y>",
          footer: "Ketuk di mana saja untuk menutup.",
        },
        navText:
          "Ketuk salah satu ikon untuk menjelajahi transformasi yang berbeda…",
      },
      mirror: {
        dragQuestion: "Gerakkan cermin menuju figur",
        dragFeedback: "Seret cermin sampai Anda melihat bayangan",
        tapMirrorQuestion: "Ketuk cermin.",
        flipQuestion: "Ketuk garis cermin untuk membalik figur.",
        summaryQuestion: "Apa yang berubah ketika Anda membalik figur?",
        summary: {
          line1: "Membalik figur menyebabkan",
          lines: [
            "- TIDAK ADA PERUBAHAN BENTUK",
            "- TIDAK ADA PERUBAHAN UKURAN",
          ],
        },
        revealSummary: {
          text:
            "Setiap titik pada figur<br>mengubah posisinya<br>sehingga<br>orientasinya berubah",
        },
        fullSummary: {
          line1: "Membalik figur menyebabkan",
          lines: [
            "- TIDAK ADA PERUBAHAN BENTUK",
            "- TIDAK ADA PERUBAHAN UKURAN",
            "- PERUBAHAN POSISI",
            "- PERUBAHAN ORIENTASI",
          ],
        },
        revealButton: "Ungkap apa yang berubah",
        summarizeButton: "Ringkas",
        replayButton: "Putar ulang",
        questionTranslation: "REFLEKSI",
        blueBox:
          "Transformasi seperti ini<br>disebut <y>REFLEKSI</y>.",
        definitionTyping:
          "Transformasi di mana titik-titik dibalik melintasi sebuah garis",
        textLayover: {
          body:
            "<y>Refleksi adalah transformasi</y> ketika titik-titik<br>dibalik melintasi garis yang disebut <y>garis refleksi.</y><br><br><bl>Refleksi tidak mengubah bentuk atau ukuran</bl><br>kumpulan titik, tetapi <bl>orientasi dan posisinya berubah.</bl>",
          footer: "Ketuk di mana saja untuk menutup.",
        },
        navText:
          "Ketuk salah satu ikon untuk menjelajahi transformasi yang berbeda…",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
