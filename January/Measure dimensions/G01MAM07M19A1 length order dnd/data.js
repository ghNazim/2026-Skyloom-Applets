// const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Ordering Lengths",
        text: "Let's arrange the objects from <y>shortest to longest</y><br> or <y>longest to shortest</y>.",
        buttonText: "Start",
      },
      questions: [
        {
          unit_image: "assets/paperclip.png",
          unit_length: "6vw",
          unit_name_plural: "paper clips",
          unit_name_singular: "paper clip",
          question_type: "l2s",
          options: [
            { big_image: "assets/gluestick.png", count: 4 },
            { big_image: "assets/pencil.png", count: 6 },
            { big_image: "assets/paintbrush.png", count: 5 },
          ],
        },
        {
          unit_image: "assets/handspan.png",
          unit_length: "6vw",
          unit_name_plural: "hand spans",
          unit_name_singular: "hand span",
          question_type: "l2s",
          options: [
            { big_image: "assets/stick.png", count: 3 },
            { big_image: "assets/stick2.png", count: 7 },
            { big_image: "assets/flute.png", count: 4 },
          ],
        },
        {
          unit_image: "assets/crayon.png",
          unit_length: "6vw",
          unit_name_plural: "crayons",
          unit_name_singular: "crayon",
          question_type: "l2s",
          options: [
            { big_image: "assets/ruler.png", count: 5 },
            { big_image: "assets/gluestick.png", count: 3 },
            { big_image: "assets/scissor.png", count: 4 },
          ],
        },
        {
          unit_image: "assets/chalk.png",
          unit_length: "6vw",
          unit_name_plural: "chalks",
          unit_name_singular: "chalk",
          question_type: "s2l",
          options: [
            { big_image: "assets/pencil.png", count: 3 },
            { big_image: "assets/erasor.png", count: 1 },
            { big_image: "assets/pencilbox.png", count: 4 },
          ],
        },
        {
          unit_image: "assets/handspan.png",
          unit_length: "6vw",
          unit_name_plural: "hand spans",
          unit_name_singular: "hand span",
          question_type: "l2s",
          options: [
            { big_image: "assets/rope.png", count: 7 },
            { big_image: "assets/toytrain.png", count: 5 },
            { big_image: "assets/toycar.png", count: 3 },
          ],
        },
      ],
      step1: {
        questionTemplateL2s: "Arrange the objects from longest to shortest.",
        questionTemplateS2l: "Arrange the objects from shortest to longest.",
        navText: "Drag the objects to arrange them, then tap check.",
        navCorrect: "Tap » to arrange the next set of objects.",
        navLast: "Tap » to complete activity.",
        checkButton: "Check",
        feedbackCorrect: "Well done! That's correct.",
        feedbackWrong:
          "Oops! The object with the greatest length is the longest. The one with the least length is the shortest.",
      },
      final: {
        heading: "Ordering Lengths",
        text: "Awesome!<br>We practiced to arrange the objects from<br> longest to shortest or shortest to longest.",
        buttonText: "Start Over",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Mengurutkan Panjang",
        text: "Mari kita urutkan benda dari <y>terpendek ke terpanjang</y><br> atau <y>terpanjang ke terpendek</y>.",
        buttonText: "Mulai",
      },
      questions: [
        {
          unit_image: "assets/paperclip.png",
          unit_length: "6vw",
          unit_name_plural: "klip kertas",
          unit_name_singular: "klip kertas",
          question_type: "l2s",
          options: [
            { big_image: "assets/gluestick.png", count: 4 },
            { big_image: "assets/pencil.png", count: 6 },
            { big_image: "assets/paintbrush.png", count: 5 },
          ],
        },
        {
          unit_image: "assets/handspan.png",
          unit_length: "6vw",
          unit_name_plural: "jengkal tangan",
          unit_name_singular: "jengkal tangan",
          question_type: "l2s",
          options: [
            { big_image: "assets/stick.png", count: 3 },
            { big_image: "assets/stick2.png", count: 7 },
            { big_image: "assets/flute.png", count: 4 },
          ],
        },
        {
          unit_image: "assets/crayon.png",
          unit_length: "6vw",
          unit_name_plural: "krayon",
          unit_name_singular: "krayon",
          question_type: "l2s",
          options: [
            { big_image: "assets/ruler.png", count: 5 },
            { big_image: "assets/gluestick.png", count: 3 },
            { big_image: "assets/scissor.png", count: 4 },
          ],
        },
        {
          unit_image: "assets/chalk.png",
          unit_length: "6vw",
          unit_name_plural: "kapur tulis",
          unit_name_singular: "kapur tulis",
          question_type: "s2l",
          options: [
            { big_image: "assets/pencil.png", count: 3 },
            { big_image: "assets/erasor.png", count: 1 },
            { big_image: "assets/pencilbox.png", count: 4 },
          ],
        },
        {
          unit_image: "assets/handspan.png",
          unit_length: "6vw",
          unit_name_plural: "jengkal tangan",
          unit_name_singular: "jengkal tangan",
          question_type: "l2s",
          options: [
            { big_image: "assets/rope.png", count: 7 },
            { big_image: "assets/toytrain.png", count: 5 },
            { big_image: "assets/toycar.png", count: 3 },
          ],
        },
      ],
      step1: {
        questionTemplateL2s: "Urutkan benda dari terpanjang ke terpendek.",
        questionTemplateS2l: "Urutkan benda dari terpendek ke terpanjang.",
        navText: "Seret benda untuk mengurutkannya, lalu ketuk periksa.",
        navCorrect: "Ketuk » untuk mengurutkan set benda berikutnya.",
        navLast: "Ketuk » untuk menyelesaikan aktivitas.",
        checkButton: "Periksa",
        feedbackCorrect: "Bagus! Benar.",
        feedbackWrong:
          "Ups! Benda dengan panjang terbesar adalah yang terpanjang. Yang dengan panjang terkecil adalah yang terpendek.",
      },
      final: {
        heading: "Mengurutkan Panjang",
        text: "Luar biasa!<br>Kita berlatih mengurutkan benda dari terpanjang <br>ke terpendek atau dari terpendek ke terpanjang.",
        buttonText: "Mulai Lagi",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
