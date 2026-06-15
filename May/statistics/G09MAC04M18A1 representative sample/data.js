const DATA = {
  en: {
    app: {
      start: {
        heading: "Spot the Representative Samples",
        text: "Let us see what a representative sample should look like<br>for a population.<br><br>Tap 'Start' to begin.",
        buttonText: "Start",
      },
      sampleLabel: "Sample",
      graphs: [
        {
          graphData: [
            { x: 2, y: 7 },
            { x: 3, y: 11 },
            { x: 4, y: 30 },
            { x: 5, y: 35 },
            { x: 6, y: 12 },
            { x: 7, y: 14 },
            { x: 8, y: 16 },
            { x: 9, y: 20 },
          ],
          xRange: { min: 0, max: 10, step: 1, labelFrom: 1, labelTo: 10 },
          yRange: { min: 0, max: 40, step: 5 },
          populationHeading: "Population",
        },
        {
          graphData: [
            { x: 50, y: 60 },
            { x: 100, y: 55 },
            { x: 150, y: 50 },
            { x: 200, y: 60 },
            { x: 250, y: 42 },
            { x: 300, y: 41 },
            { x: 350, y: 20 },
            { x: 400, y: 5 },
            { x: 450, y: 5 },
          ],
          xRange: { min: 0, max: 500, step: 50, labelFrom: 0, labelTo: 500 },
          yRange: { min: 0, max: 70, step: 10 },
          populationHeading: "Population",
        },
        {
          graphData: [
            { x: 2, y: 2 },
            { x: 3, y: 3 },
            { x: 4, y: 9 },
            { x: 5, y: 11 },
            { x: 6, y: 24 },
            { x: 7, y: 27 },
            { x: 8, y: 32 },
            { x: 9, y: 40 },
            { x: 10, y: 64 },
            { x: 11, y: 70 },
            { x: 12, y: 60 },
            { x: 13, y: 45 },
            { x: 14, y: 34 },
            { x: 15, y: 33 },
            { x: 16, y: 23 },
            { x: 17, y: 16 },
            { x: 18, y: 5 },
            { x: 19, y: 1 },
            { x: 20, y: 1 },
          ],
          xRange: { min: 0, max: 21, step: 1, labelFrom: 1, labelTo: 21 },
          yRange: { min: 0, max: 70, step: 10 },
          populationHeading: "Population",
          barColor: "#e85a8a",
        },
      ],
      steps: {
        1: {
          questionText:
            "Here is a population represented in a bar diagram.",
          navText:
            "Tap » to view representative sample for this population.",
        },
        2: {
          questionText:
            "A representative sample is a sample that looks like a smaller version of the population.",
          navText:
            "Tap 'Shrink' to visualize a sample for this population.",
          shrinkButtonText: "Shrink",
          drawPopulationButtonText: "Draw Population Shape",
          drawSampleButtonText: "Draw Sample Shape",
          afterShrinkQuestion:
            "This is what a representative sample would look like – a smaller version of the population.",
          afterShrinkNav:
            "Tap 'Draw…' to draw the population shape.",
          afterPopulationShapeNav:
            "Tap 'Draw…' to draw the sample shape.",
          afterPopulationShapeQuestion:
            "Look at the population shape.<br>Notice how the population first rises at 2, peaks at 5, falls, and then rises again till 9.",
          afterSampleShapeQuestion:
            "The sample shape also first rises at 2, peaks at around 5, then falls, and then again rises till 9 –similar to population shape.",
          conclusionText:
            "The rise and fall of both population and its representative sample shape is similar.",
          conclusionNav:
            "Tap » to look at another population and its representative samples.",
        },
        3: {
          questionText:
            "Here is another population represented in a bar diagram.",
          navText:
            "Tap » to view representative sample for this population.",
        },
        4: {
          questionText:
            "A representative sample is a sample that looks like a smaller version of the population.",
          navText:
            "Tap 'Shrink' to visualize a sample for this population.",
          shrinkButtonText: "Shrink",
          drawPopulationButtonText: "Draw Population Shape",
          drawSampleButtonText: "Draw Sample Shape",
          afterShrinkQuestion:
            "This is what a representative sample would look like – a smaller version of the population.",
          afterShrinkNav:
            "Tap 'Draw…' to draw the population shape.",
          afterPopulationShapeNav:
            "Tap 'Draw…' to draw the sample shape.",
          afterPopulationShapeQuestion:
            "Look at the population shape.<br>Notice how the population peaks around 50 and 200, then falls steadily toward 450.",
          afterSampleShapeQuestion:
            "The sample shape also peaks around 50 and 200, then falls toward 450 – similar to the population shape.",
          conclusionText:
            "The rise and fall of both population and its representative sample shape is similar.",
          conclusionNav: "Tap » to continue.",
        },
        6: {
          questionText:
            "Here is the bar diagram for the population — all 500 students in a school.",
          navText: "Tap » to compare some samples with this population.",
        },
        7: {
          questionText:
            "Compare the population's shape with the given sample. Are they similar?",
          navText: "Tap the correct answer – Yes or No!",
          navNext: "Tap » to compare another sample with this population.",
          navNextLast: "Tap » to summarize.",
          mcqTitle: "Is the sample representative?",
          mcqOptions: ["Yes", "No"],
          sampleHeading: "Sample",
          barColor: "#5b9bd5",
          questions: [
            {
              graphData: [
                { x: 5, y: 15 },
                { x: 6, y: 18 },
                { x: 7, y: 19 },
                { x: 8, y: 28 },
                { x: 9, y: 26 },
                { x: 10, y: 28 },
                { x: 11, y: 27 },
                { x: 12, y: 28 },
              ],
              mcqAnswer: "No",
              feedbackCorrect:
                "That's right! The population and sample do not look similar in shape at all.",
              feedbackWrong:
                "Look again at the shapes! The sample does not look like a miniature version of the population.",
            },
            {
              graphData: [
                { x: 8, y: 12 },
                { x: 9, y: 14 },
                { x: 10, y: 15 },
                { x: 11, y: 21 },
                { x: 13, y: 8 },
                { x: 14, y: 10 },
                { x: 15, y: 10 },
                { x: 16, y: 14 },
                { x: 17, y: 13 },
                { x: 18, y: 14 },
                { x: 19, y: 14 },
                { x: 20, y: 14 },
              ],
              mcqAnswer: "No",
              feedbackCorrect:
                "That's right! The population and sample do not look similar in shape at all.",
              feedbackWrong:
                "Look again at the shapes! The sample does not look like a mini version of the population.",
            },
            {
              graphData: [
                { x: 4, y: 4 },
                { x: 5, y: 4 },
                { x: 6, y: 8 },
                { x: 7, y: 9 },
                { x: 8, y: 12 },
                { x: 9, y: 17 },
                { x: 10, y: 19 },
                { x: 11, y: 19 },
                { x: 12, y: 13 },
                { x: 13, y: 9 },
                { x: 14, y: 5 },
                { x: 15, y: 4 },
                { x: 17, y: 3 },
                { x: 20, y: 3 },
              ],
              mcqAnswer: "Yes",
              feedbackCorrect:
                "That's right! The population and sample look similar in shape – the rise, peak, and fall is similar.",
              feedbackWrong:
                "Look again! The sample rises, peaks, and falls similar to population.",
            },
          ],
        },
      },
      continue: {
        heading: " ",
        text:
          "You learnt that a representative sample has the same distribution as<br>the population — it is like a mini version of the population.<br>The best way to check if two distributions are similar is to look at<br>their <y>shape: where the data rises, peaks, and falls – which values<br>appear more, which appear less</y>.<br><br>Tap 'Continue' to practice what we learnt here.",
        buttonText: "Continue",
      },
      final: {
        heading: "Well Done!",
        text:
          "You learnt that a <y>representative sample has the same distribution as the population but on a smaller scale</y>.<br>Simply check for the <y>rise</y>, <y>peak</y>, and <y>fall</y> of population and find the sample which follows the same trend.<br><br>Tap 'Start Over' to repeat this activity.",
        buttonText: "Start Over",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Temukan Sampel Representatif",
        text: "Mari kita lihat seperti apa sampel representatif<br>untuk suatu populasi.<br><br>Ketuk 'Mulai' untuk memulai.",
        buttonText: "Mulai",
      },
      sampleLabel: "Sampel",
      graphs: [
        {
          graphData: [
            { x: 2, y: 7 },
            { x: 3, y: 11 },
            { x: 4, y: 30 },
            { x: 5, y: 35 },
            { x: 6, y: 12 },
            { x: 7, y: 14 },
            { x: 8, y: 16 },
            { x: 9, y: 20 },
          ],
          xRange: { min: 0, max: 10, step: 1, labelFrom: 1, labelTo: 10 },
          yRange: { min: 0, max: 40, step: 5 },
          populationHeading: "Populasi",
        },
        {
          graphData: [
            { x: 50, y: 60 },
            { x: 100, y: 55 },
            { x: 150, y: 50 },
            { x: 200, y: 60 },
            { x: 250, y: 42 },
            { x: 300, y: 41 },
            { x: 350, y: 20 },
            { x: 400, y: 5 },
            { x: 450, y: 5 },
          ],
          xRange: { min: 0, max: 500, step: 50, labelFrom: 0, labelTo: 500 },
          yRange: { min: 0, max: 70, step: 10 },
          populationHeading: "Populasi",
        },
        {
          graphData: [
            { x: 2, y: 2 },
            { x: 3, y: 3 },
            { x: 4, y: 9 },
            { x: 5, y: 11 },
            { x: 6, y: 24 },
            { x: 7, y: 27 },
            { x: 8, y: 32 },
            { x: 9, y: 40 },
            { x: 10, y: 64 },
            { x: 11, y: 70 },
            { x: 12, y: 60 },
            { x: 13, y: 45 },
            { x: 14, y: 34 },
            { x: 15, y: 33 },
            { x: 16, y: 23 },
            { x: 17, y: 16 },
            { x: 18, y: 5 },
            { x: 19, y: 1 },
            { x: 20, y: 1 },
          ],
          xRange: { min: 0, max: 21, step: 1, labelFrom: 1, labelTo: 21 },
          yRange: { min: 0, max: 70, step: 10 },
          populationHeading: "Populasi",
          barColor: "#e85a8a",
        },
      ],
      steps: {
        1: {
          questionText:
            "Berikut adalah populasi yang ditampilkan dalam diagram batang.",
          navText:
            "Ketuk » untuk melihat sampel representatif dari populasi ini.",
        },
        2: {
          questionText:
            "Sampel representatif adalah sampel yang terlihat seperti versi lebih kecil dari populasi.",
          navText:
            "Ketuk 'Kecilkan' untuk memvisualisasikan sampel dari populasi ini.",
          shrinkButtonText: "Kecilkan",
          drawPopulationButtonText: "Gambar Bentuk Populasi",
          drawSampleButtonText: "Gambar Bentuk Sampel",
          afterShrinkQuestion:
            "Ini adalah tampilan sampel representatif – versi lebih kecil dari populasi.",
          afterShrinkNav:
            "Ketuk 'Gambar…' untuk menggambar bentuk populasi.",
          afterPopulationShapeNav:
            "Ketuk 'Gambar…' untuk menggambar bentuk sampel.",
          afterPopulationShapeQuestion:
            "Perhatikan bentuk populasi. Lihat bagaimana populasi pertama naik di 2, mencapai puncak di 5, turun, lalu naik lagi hingga 9.",
          afterSampleShapeQuestion:
            "Bentuk sampel juga pertama naik di 2, mencapai puncak sekitar 5, lalu turun, dan naik lagi hingga 9 – mirip dengan bentuk populasi.",
          conclusionText:
            "Naik turunnya bentuk populasi dan sampel representatifnya serupa.",
          conclusionNav:
            "Ketuk » untuk melihat populasi lain dan sampel representatifnya.",
        },
        3: {
          questionText:
            "Berikut adalah populasi lain yang ditampilkan dalam diagram batang.",
          navText:
            "Ketuk » untuk melihat sampel representatif dari populasi ini.",
        },
        4: {
          questionText:
            "Sampel representatif adalah sampel yang terlihat seperti versi lebih kecil dari populasi.",
          navText:
            "Ketuk 'Kecilkan' untuk memvisualisasikan sampel dari populasi ini.",
          shrinkButtonText: "Kecilkan",
          drawPopulationButtonText: "Gambar Bentuk Populasi",
          drawSampleButtonText: "Gambar Bentuk Sampel",
          afterShrinkQuestion:
            "Ini adalah tampilan sampel representatif – versi lebih kecil dari populasi.",
          afterShrinkNav:
            "Ketuk 'Gambar…' untuk menggambar bentuk populasi.",
          afterPopulationShapeNav:
            "Ketuk 'Gambar…' untuk menggambar bentuk sampel.",
          afterPopulationShapeQuestion:
            "Perhatikan bentuk populasi. Lihat bagaimana populasi mencapai puncak sekitar 50 dan 200, lalu turun terus menuju 450.",
          afterSampleShapeQuestion:
            "Bentuk sampel juga mencapai puncak sekitar 50 dan 200, lalu turun menuju 450 – mirip dengan bentuk populasi.",
          conclusionText:
            "Naik turunnya bentuk populasi dan sampel representatifnya serupa.",
          conclusionNav: "Ketuk » untuk melanjutkan.",
        },
        6: {
          questionText:
            "Berikut diagram batang untuk populasi — seluruh 500 siswa di sebuah sekolah.",
          navText: "Ketuk » untuk membandingkan beberapa sampel dengan populasi ini.",
        },
        7: {
          questionText:
            "Bandingkan bentuk populasi dengan sampel yang diberikan. Apakah keduanya serupa?",
          navText: "Ketuk jawaban yang benar – Ya atau Tidak!",
          navNext: "Ketuk » untuk membandingkan sampel lain dengan populasi ini.",
          navNextLast: "Ketuk » untuk merangkum.",
          mcqTitle: "Apakah sampel ini representatif?",
          mcqOptions: ["Ya", "Tidak"],
          sampleHeading: "Sampel",
          barColor: "#5b9bd5",
          questions: [
            {
              graphData: [
                { x: 5, y: 15 },
                { x: 6, y: 18 },
                { x: 7, y: 19 },
                { x: 8, y: 28 },
                { x: 9, y: 26 },
                { x: 10, y: 28 },
                { x: 11, y: 27 },
                { x: 12, y: 28 },
              ],
              mcqAnswer: "Tidak",
              feedbackCorrect:
                "Benar! Populasi dan sampel sama sekali tidak terlihat serupa bentuknya.",
              feedbackWrong:
                "Perhatikan lagi bentuknya! Sampel tidak terlihat seperti versi miniatur populasi.",
            },
            {
              graphData: [
                { x: 8, y: 12 },
                { x: 9, y: 14 },
                { x: 10, y: 15 },
                { x: 11, y: 21 },
                { x: 13, y: 8 },
                { x: 14, y: 10 },
                { x: 15, y: 10 },
                { x: 16, y: 14 },
                { x: 17, y: 13 },
                { x: 18, y: 14 },
                { x: 19, y: 14 },
                { x: 20, y: 14 },
              ],
              mcqAnswer: "Tidak",
              feedbackCorrect:
                "Benar! Populasi dan sampel sama sekali tidak terlihat serupa bentuknya.",
              feedbackWrong:
                "Perhatikan lagi bentuknya! Sampel tidak terlihat seperti versi mini populasi.",
            },
            {
              graphData: [
                { x: 4, y: 4 },
                { x: 5, y: 4 },
                { x: 6, y: 8 },
                { x: 7, y: 9 },
                { x: 8, y: 12 },
                { x: 9, y: 17 },
                { x: 10, y: 19 },
                { x: 11, y: 19 },
                { x: 12, y: 13 },
                { x: 13, y: 9 },
                { x: 14, y: 5 },
                { x: 15, y: 4 },
                { x: 17, y: 3 },
                { x: 20, y: 3 },
              ],
              mcqAnswer: "Ya",
              feedbackCorrect:
                "Benar! Populasi dan sampel terlihat serupa bentuknya – naik, puncak, dan turunnya mirip.",
              feedbackWrong:
                "Perhatikan lagi! Sampel naik, mencapai puncak, dan turun mirip populasi.",
            },
          ],
        },
      },
      continue: {
        heading: " ",
        text:
          "Kamu telah mempelajari bahwa sampel representatif memiliki distribusi yang sama dengan<br>populasi — seperti versi mini dari populasi.<br>Cara terbaik untuk memeriksa apakah dua distribusi serupa adalah melihat<br><y>bentuknya: di mana data naik, mencapai puncak, dan turun – nilai mana<br>yang lebih sering muncul, mana yang lebih jarang</y>.<br><br>Ketuk 'Lanjutkan' untuk berlatih apa yang telah kita pelajari di sini.",
        buttonText: "Lanjutkan",
      },
      final: {
        heading: "Bagus Sekali!",
        text:
          "Kamu telah mempelajari bahwa <y>sampel representatif memiliki distribusi yang sama dengan populasi tetapi dalam skala yang lebih kecil</y>.<br>Cukup periksa naik, puncak, dan turun populasi lalu temukan sampel yang mengikuti tren yang sama.<br><br>Ketuk 'Ulangi' untuk mengulang aktivitas ini.",
        buttonText: "Ulangi",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
