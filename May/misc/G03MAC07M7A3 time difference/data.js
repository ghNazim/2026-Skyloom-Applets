
const decimal = {
  en: ".",
  id: ",",
};

// Master data structure - Duration of Activity applet
const DATA = {
  en: {
    app: {
      common: {
        next: "Next",
        tapNextToContinue: "Tap » to continue.",
      },
      start: {
        heading: "Duration of the activity",
        text: 'Let\'s explore solving problems related to duration of activity.<br><br>Tap "Start" to begin!',
        buttonText: "Start",
      },
      step1: {
        characterText:
          "Hey!\nLet's explore some words relevant to duration related problems.",
        callouts: {
          startTime: "It is the time when \nan activity starts.",
          endTime: "It is the time when \nan activity ends.",
          duration: "It is the time taken \nto do the activity.",
        },
        formulas: {
          startTime: "<st>Start time</st> = <et>End time</et> - Duration",
          endTime: "<et>End time</et> = <st>Start time</st> + Duration",
          duration: "Duration = <et>End time</et> - <st>Start time</st>",
        },
        labels: {
          theTimeline: "The Timeline",
          startTime: "Start time",
          endTime: "End time",
          duration: "Duration",
        },
        nav: {
          tapStartTime: 'Tap "Start time".',
          tapEndTime: 'Tap "End time".',
          tapDuration: 'Tap "Duration".',
          tapNextToContinue: "Tap » to continue.",
        },
      },
      steps: {
        1: {
          layout: "with-character-timeline",
          characterImage: "boyHappy.png",
          characterText:
            "Hey!\nLet's explore some words relevant to duration related problems.",
        },
        2: {
          layout: "with-character-timeline",
          characterImage: "boyHappy.png",
          characterText:
            "Let's explore the math actions used to find the start time, end time and duration of activity.",
          navText: "Tap » to explore.",
        },
        3: {
          layout: "with-character-timeline",
          characterImage: "boyHappy.png",
          characterText:
            "Likewise number line, for timeline, when we go backwards, we subtract and when we go forward we add",
          navText: "Tap » to explore finding start time.",
        },
        4: {
          layout: "with-character-timeline",
          characterImage: "boyHappy.png",
          characterText:
            "To find the start time, we move backward from the end time. So, we subtract the duration from the end time to get the start time.",
          navText: "Tap » to explore finding End time.",
        },
        5: {
          layout: "with-character-timeline",
          characterImage: "boyHappy.png",
          characterText:
            "To find the end time, we move forward from the start time. So, we add the duration to the start time to get the end time",
          navText: "Tap » to explore finding Duration.",
        },
        6: {
          layout: "with-character-timeline",
          characterImage: "boyHappy.png",
          characterText:
            "Duration is the time difference between end time and start time. So, we subtract start time from end time to find the duration.",
          navText: "Tap » to summarize.",
          differenceText: "(Difference)",
        },
        7: {
          layout: "fullscreen",
          heading: "Duration of the activity",
          text: "",
          formulasAll:
            "<st>Start time</st> = <et>End time</et> - Duration<br><et>End time</et> = <st>Start time</st> + Duration<br>Duration = <et>End time</et> - <st>Start time</st>",
          image: "final-en.png",
          buttonText: "Start Over",
        },
      },
    },
  },
  id: {
    app: {
      common: {
        next: "Lanjut",
        tapNextToContinue: "Ketuk » untuk melanjutkan.",
      },
      start: {
        heading: "Durasi aktivitas",
        text: 'Mari kita jelajahi menyelesaikan masalah yang terkait dengan durasi aktivitas.<br><br>Ketuk "Mulai" untuk memulai!',
        buttonText: "Mulai",
      },
      step1: {
        characterText:
          "Hai!\nMari kita jelajahi beberapa kata yang relevan dengan masalah terkait durasi.",
        callouts: {
          startTime: "Ini adalah waktu ketika\nsuatu aktivitas dimulai.",
          endTime: "Ini adalah waktu ketika\nsuatu aktivitas berakhir.",
          duration:
            "Ini adalah waktu yang dibutuhkan\nuntuk melakukan aktivitas.",
        },
        formulas: {
          startTime: "<st>Waktu mulai</st> = <et>Waktu selesai</et> - Durasi",
          endTime: "<et>Waktu selesai</et> = <st>Waktu mulai</st> + Durasi",
          duration: "Durasi = <et>Waktu selesai</et> - <st>Waktu mulai</st>",
        },
        labels: {
          theTimeline: "Garis Waktu",
          startTime: "Waktu mulai",
          endTime: "Waktu selesai",
          duration: "Durasi",
        },
        nav: {
          tapStartTime: 'Ketuk "Waktu mulai".',
          tapEndTime: 'Ketuk "Waktu selesai".',
          tapDuration: 'Ketuk "Durasi".',
          tapNextToContinue: "Ketuk » untuk melanjutkan.",
        },
      },
      steps: {
        1: {
          layout: "with-character-timeline",
          characterImage: "boyHappy.png",
          characterText:
            "Hai!\nMari kita jelajahi beberapa kata yang relevan dengan masalah terkait durasi.",
        },
        2: {
          layout: "with-character-timeline",
          characterImage: "boyHappy.png",
          characterText:
            "Mari kita jelajahi aksi matematika yang digunakan untuk mencari waktu mulai, waktu selesai dan durasi aktivitas.",
          navText: "Ketuk » untuk menjelajahi.",
        },
        3: {
          layout: "with-character-timeline",
          characterImage: "boyHappy.png",
          characterText:
            "Sama seperti garis angka, pada timeline, ketika kita bergerak mundur kita kurangi dan ketika bergerak maju kita tambah.",
          navText: "Ketuk » untuk menjelajahi mencari waktu mulai.",
        },
        4: {
          layout: "with-character-timeline",
          characterImage: "boyHappy.png",
          characterText:
            "Untuk mencari waktu mulai, kita bergerak mundur dari waktu selesai. Jadi, kita kurangi durasi dari waktu selesai untuk mendapatkan waktu mulai.",
          navText: "Ketuk » untuk menjelajahi mencari waktu selesai.",
        },
        5: {
          layout: "with-character-timeline",
          characterImage: "boyHappy.png",
          characterText:
            "Untuk mencari waktu selesai, kita bergerak maju dari waktu mulai. Jadi, kita tambahkan durasi ke waktu mulai untuk mendapatkan waktu selesai.",
          navText: "Ketuk » untuk menjelajahi mencari durasi.",
        },
        6: {
          layout: "with-character-timeline",
          characterImage: "boyHappy.png",
          characterText:
            "Durasi adalah selisih waktu antara waktu selesai dan waktu mulai. Jadi, kita kurangi waktu mulai dari waktu selesai untuk mencari durasi.",
          navText: "Ketuk » untuk merangkum.",
          differenceText: "(Selisih)",
        },
        7: {
          layout: "fullscreen",
          heading: "Durasi aktivitas",
          text: "",
          formulasAll:
            "<st>Waktu mulai</st> = <et>Waktu selesai</et> - Durasi<br><et>Waktu selesai</et> = <st>Waktu mulai</st> + Durasi<br>Durasi = <et>Waktu selesai</et> - <st>Waktu mulai</st>",
          image: "final-id.png",
          buttonText: "Ulangi",
        },
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
