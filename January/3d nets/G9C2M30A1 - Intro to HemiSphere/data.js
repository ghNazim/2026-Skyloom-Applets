const DATA = {
  en: {
    app: {
      start: {
        heading: "Hemisphere",
        text: 'Let\'s explore how we can form a hemisphere from a sphere.<br>Tap "Start" to start the activity.',
        buttonText: "Start",
      },
      buttons: {
        sliceHorizontally: "Slice horizontally",
        sliceVertically: "Slice vertically",
      },
      steps: {
        1: {
          q: "A sphere is a perfectly round 3D shape.<br>Let's slice it through its center using a plane.",
          n: "Tap any button to slice the sphere.",
          qAfterSlice:
            "This cut divides the sphere into two equal parts.<br>Each equal part is called a hemisphere.",
        },
      },
      final: {
        heading: "Activity Completed!",
        text:
          "We learned that, when a plane passes through its center, it forms two hemispheres.<br>" +
          "This shows that a hemisphere is exactly half of a sphere.<br><br>" +
          'Tap "Start Over" to restart the activity.',
        buttonText: "Start Over",
        imageAlt: "Hemisphere illustration",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Belahan Bola",
        text: 'Mari kita jelajahi bagaimana kita dapat membentuk belahan bola dari sebuah bola.<br>Ketuk "Mulai" untuk memulai aktivitas.',
        buttonText: "Mulai",
      },
      buttons: {
        sliceHorizontally: "Iris horizontal",
        sliceVertically: "Iris vertikal",
      },
      steps: {
        1: {
          q: "Bola adalah bentuk 3D yang bulat sempurna.<br>Mari kita iris melalui pusatnya menggunakan bidang.",
          n: "Ketuk salah satu tombol untuk mengiris bola.",
          qAfterSlice:
            "Irisan ini membagi bola menjadi dua bagian yang sama.<br>Setiap bagian yang sama disebut belahan bola.",
        },
      },
      final: {
        heading: "Aktivitas Selesai!",
        text:
          "Kita telah mempelajari bahwa ketika sebuah bidang melewati pusatnya, itu membentuk dua belahan bola.<br>" +
          "Ini menunjukkan bahwa belahan bola adalah tepat setengah dari bola.<br><br>" +
          'Ketuk "Mulai Lagi" untuk memulai ulang aktivitas.',
        buttonText: "Mulai Lagi",
        imageAlt: "Ilustrasi belahan bola",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
