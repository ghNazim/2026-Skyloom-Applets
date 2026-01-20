const current_language = "en";

// Questions array - each question has total, box_count, result, and remainder
const QUESTIONS = [
  {
    total: 15,
    box_count: 4,
    result: 3,
    remainder: 3,
  },
  {
    total: 21,
    box_count: 5,
    result: 4,
    remainder: 1,
    type: 2,
  },
  {
    total: 17,
    box_count: 3,
    result: 5,
    remainder: 2,
  },
  {
    total: 26,
    box_count: 5,
    result: 5,
    remainder: 1,
    type: 2,
  },
  {
    total: 19,
    box_count: 5,
    result: 3,
    remainder: 4,
  },
  {
    total: 30,
    box_count: 5,
    result: 6,
    remainder: 0,
    type: 2,
  },
];

const appData = {
  en: {
    // Common labels
    common: {
      boxLabel: (num) => `Bag ${num}`,
      remainder: "remainder",
      leftovers: "Leftovers",
      noLeftovers: "No leftovers",
    },

    // Start screen
    start: {
      text: "Let's solve some questions. <br><br>Tap 'Start'.",
      buttonText: "Start",
    },

    // Navigation texts
    nav: {
      step1: "Enter the answer using the numpad and click ✓.",
      step2: "Tap the button to transfer coins.",
      next: "Tap » to continue.",
    },

    // Button texts
    buttons: {
      solveVisually: "Solve it visually",
      transferCoins: "Transfer coins",
    },

    // Question text template
    question: (total, boxCount, type, result) => {
      if (type === 2) {
        return `Divide ${total} coins into bags of ${result} coins each.`;
      }
      return `Divide ${total} coins equally among ${boxCount} bags`;
    },

    // Final screen
    final: {
      text: "Lesson over! Press the button below to see the lesson again.",
      buttonText: "Start Over",
    },
  },
  id: {
    // Common labels
    common: {
      boxLabel: (num) => `Kantong ${num}`,
      remainder: "sisa",
      leftovers: "Sisa",
      noLeftovers: "Tidak ada sisa",
    },

    // Start screen
    start: {
      text: "Mari selesaikan beberapa pertanyaan. <br><br>Ketuk 'Mulai'.",
      buttonText: "Mulai",
    },

    // Navigation texts
    nav: {
      step1: "Masukkan jawaban menggunakan keypad dan klik ✓.",
      step2: "Ketuk tombol untuk mentransfer koin.",
      next: "Ketuk » untuk melanjutkan.",
    },

    // Button texts
    buttons: {
      solveVisually: "Selesaikan secara visual",
      transferCoins: "Transfer koin",
    },

    // Question text template
    question: (total, boxCount, type, result) => {
      if (type === 2) {
        return `Bagilah ${total} koin ke dalam kantong yang masing-masing berisi ${result} koin.`;
      }
      return `Bagilah ${total} koin sama rata ke dalam ${boxCount} kantong`;
    },

    // Final screen
    final: {
      text: "Selamat! Anda telah menyelesaikan semua pertanyaan.",
      buttonText: "Mulai Lagi",
    },
  },
};

const APP_DATA = appData[current_language];
