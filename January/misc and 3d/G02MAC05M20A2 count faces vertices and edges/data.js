const DATA = {
  en: {
    app: {
      start: {
        heading: "Faces, Vertices and Edges",
        text: "Today we will identify the number of faces,<br>vertices and edges in some objects.<br><br>Tap 'Start' to begin the lesson.",
        buttonText: "Start",
      },
      step1Question: "Is the given shape a cube or cuboid?",
      step1NavText: "Tap the correct option",
      step1Options: ["Cube", "Cuboid"],
      checkText: "Check",
      startOver: "Start Over",
      navStartOver: "Tap 'Start Over' to begin again",
      sliderMax: 12,
      questions: [
        {
          dims: [2, 2, 2],
          step1Answer: "Cube",
          questionText: "What are the number of faces in the given object?",
          answer: 6,
          navText: "Move the slider to find the number of faces and check",
          navCorrect: "Tap '»' to see the next question.",
          feedbacks: [
            "Good work!!!<br> You have correctly identified the cube",
            "Oops! Incorrect <br>Look all the faces are same",
          ],
          step2Feedbacks: {
            correct: "Good work!!!<br>You have correctly identified the number of faces",
            incorrect: "Oops!! Incorrect<br>A cube has 6 faces",
          },
        },
        {
          dims: [2, 5, 2],
          step1Answer: "Cuboid",
          questionText: "What are the number of vertices in the given object?",
          answer: 8,
          navText: "Move the slider to find the number of vertices and check",
          navCorrect: "Tap '»' to see the next question.",
          feedbacks: [
            "Oops! Incorrect <br>Look all the faces are not same",
            "Good work!!!<br> You have correctly identified the cuboid",
          ],
          step2Feedbacks: {
            correct: "Good work!!!<br>You have correctly identified the number of vertices",
            incorrect: "Oops!! Incorrect<br>A cuboid has 8 vertices",
          },
        },
        {
          dims: [6, 2, 2],
          step1Answer: "Cuboid",
          questionText: "What are the number of edges in the given object?",
          answer: 12,
          navText: "Move the slider to find the number of edges and check",
          navCorrect: "Tap '»' to see the next question.",
          feedbacks: [
            "Oops! Incorrect <br>Look all the faces are not same",
            "Good work!!!<br> You have correctly identified the cuboid",
          ],
          step2Feedbacks: {
            correct: "Good work!!!<br>You have correctly identified the number of edges",
            incorrect: "Oops!! Incorrect<br>A cuboid has 12 edges",
          },
        },
        {
          dims: [3, 6, 3],
          step1Answer: "Cuboid",
          questionText: "What are the number of vertices in the given object?",
          answer: 8,
          navText: "Move the slider to find the number of vertices and check",
          navCorrect: "Tap '»' to see the next question.",
          feedbacks: [
            "Oops! Incorrect <br>Look all the faces are not same",
            "Good work!!!<br> You have correctly identified the cuboid",
          ],
          step2Feedbacks: {
            correct: "Good work!!!<br>You have correctly identified the number of vertices",
            incorrect: "Oops!! Incorrect<br>A cuboid has 8 vertices",
          },
        },
        {
          dims: [5, 3, 3],
          step1Answer: "Cuboid",
          questionText: "What are the number of faces in the given object?",
          answer: 6,
          navText: "Move the slider to find the number of faces and check",
          navCorrect: "Tap '»' to see the next question.",
          feedbacks: [
            "Oops! Incorrect <br>Look all the faces are not same",
            "Good work!!!<br> You have correctly identified the cuboid",
          ],
          step2Feedbacks: {
            correct: "Good work!!!<br>You have correctly identified the number of faces",
            incorrect: "Oops!! Incorrect<br>A cuboid has 6 faces",
          },
        },
      ],
    },
  },
  id: {
    app: {
      start: {
        heading: "Sisi, Titik Sudut dan Rusuk",
        text: "Hari ini kita akan mengidentifikasi jumlah sisi,<br>titik sudut dan rusuk pada beberapa benda.<br><br>Ketuk 'Mulai' untuk memulai pelajaran.",
        buttonText: "Mulai",
      },
      step1Question: "Apakah bentuk yang diberikan kubus atau balok?",
      step1NavText: "Ketuk pilihan yang benar",
      step1Options: ["Kubus", "Balok"],
      checkText: "Periksa",
      startOver: "Mulai Lagi",
      navStartOver: "Ketuk 'Mulai Lagi' untuk memulai lagi",
      sliderMax: 12,
      questions: [
        {
          dims: [2, 2, 2],
          step1Answer: "Kubus",
          questionText: "Berapa jumlah sisi pada benda yang diberikan?",
          answer: 6,
          navText: "Gerakkan slider untuk menemukan jumlah sisi dan periksa",
          navCorrect: "Ketuk '»' untuk melihat pertanyaan berikutnya.",
          feedbacks: [
            "Kerja bagus!!!<br>Anda telah mengidentifikasi kubus dengan benar",
            "Ups! Salah<br>Lihat, semua sisinya sama",
          ],
          step2Feedbacks: {
            correct: "Kerja bagus!!!<br>Anda telah mengidentifikasi jumlah sisi dengan benar",
            incorrect: "Ups!! Salah<br>Sebuah kubus memiliki 6 sisi",
          },
        },
        {
          dims: [2, 5, 2],
          step1Answer: "Balok",
          questionText: "Berapa jumlah titik sudut pada benda yang diberikan?",
          answer: 8,
          navText:
            "Gerakkan slider untuk menemukan jumlah titik sudut dan periksa",
          navCorrect: "Ketuk '»' untuk melihat pertanyaan berikutnya.",
          feedbacks: [
            "Ups! Salah<br>Lihat, tidak semua sisinya sama",
            "Kerja bagus!!!<br>Anda telah mengidentifikasi balok dengan benar",
          ],
          step2Feedbacks: {
            correct: "Kerja bagus!!!<br>Anda telah mengidentifikasi jumlah titik sudut dengan benar",
            incorrect: "Ups!! Salah<br>Sebuah balok memiliki 8 titik sudut",
          },
        },
        {
          dims: [6, 2, 2],
          step1Answer: "Balok",
          questionText: "Berapa jumlah rusuk pada benda yang diberikan?",
          answer: 12,
          navText: "Gerakkan slider untuk menemukan jumlah rusuk dan periksa",
          navCorrect: "Ketuk '»' untuk melihat pertanyaan berikutnya.",
          feedbacks: [
            "Ups! Salah<br>Lihat, tidak semua sisinya sama",
            "Kerja bagus!!!<br>Anda telah mengidentifikasi balok dengan benar",
          ],
          step2Feedbacks: {
            correct: "Kerja bagus!!!<br>Anda telah mengidentifikasi jumlah rusuk dengan benar",
            incorrect: "Ups!! Salah<br>Sebuah balok memiliki 12 rusuk",
          },
        },
        {
          dims: [3, 6, 3],
          step1Answer: "Balok",
          questionText: "Berapa jumlah titik sudut pada benda yang diberikan?",
          answer: 8,
          navText:
            "Gerakkan slider untuk menemukan jumlah titik sudut dan periksa",
          navCorrect: "Ketuk '»' untuk melihat pertanyaan berikutnya.",
          feedbacks: [
            "Ups! Salah<br>Lihat, tidak semua sisinya sama",
            "Kerja bagus!!!<br>Anda telah mengidentifikasi balok dengan benar",
          ],
          step2Feedbacks: {
            correct: "Kerja bagus!!!<br>Anda telah mengidentifikasi jumlah titik sudut dengan benar",
            incorrect: "Ups!! Salah<br>Sebuah balok memiliki 8 titik sudut",
          },
        },
        {
          dims: [5, 3, 3],
          step1Answer: "Balok",
          questionText: "Berapa jumlah sisi pada benda yang diberikan?",
          answer: 6,
          navText: "Gerakkan slider untuk menemukan jumlah sisi dan periksa",
          navCorrect: "Ketuk '»' untuk melihat pertanyaan berikutnya.",
          feedbacks: [
            "Ups! Salah<br>Lihat, tidak semua sisinya sama",
            "Kerja bagus!!!<br>Anda telah mengidentifikasi balok dengan benar",
          ],
          step2Feedbacks: {
            correct: "Kerja bagus!!!<br>Anda telah mengidentifikasi jumlah sisi dengan benar",
            incorrect: "Ups!! Salah<br>Sebuah balok memiliki 6 sisi",
          },
        },
      ],
    },
  },
};

const APP_DATA = DATA[current_language].app;
