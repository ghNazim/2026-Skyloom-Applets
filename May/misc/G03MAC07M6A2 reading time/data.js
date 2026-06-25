
const decimal = {
  en: ".",
  id: ",",
};

function deriveQuestion({ hours, minutes }) {
  const crossedNumber = Math.floor(minutes / 5);
  const minutesAtCrossed = crossedNumber * 5;
  const extraMinutes = minutes - minutesAtCrossed;
  return {
    hours,
    minutes,
    crossedNumber,
    minutesAtCrossed,
    extraMinutes,
    totalMinutes: minutes,
    showCirclesCount: crossedNumber + 1,
  };
}

function getTemplateVars(derived) {
  return {
    n: derived.crossedNumber,
    minutesAt: derived.minutesAtCrossed,
    extra: derived.extraMinutes,
    total: derived.totalMinutes,
  };
}

function fillVars(str, vars) {
  if (!str) return str;
  return String(str).replace(/\{(\w+)\}/g, (_, key) =>
    vars[key] !== undefined ? vars[key] : `{${key}}`
  );
}

function buildQuestion(time, templates) {
  const derived = deriveQuestion(time);
  const vars = getTemplateVars(derived);
  return {
    time: { hours: derived.hours, minutes: derived.minutes },
    crossedNumber: derived.crossedNumber,
    minutesAtCrossed: derived.minutesAtCrossed,
    extraMinutes: derived.extraMinutes,
    totalMinutes: derived.totalMinutes,
    showCirclesCount: derived.showCirclesCount,
    steps: {
      3: { characterText: templates.steps[3].characterText },
      4: { characterText: templates.steps[4].characterText },
      5: { characterText: fillVars(templates.steps[5].characterText, vars) },
      6: { characterText: fillVars(templates.steps[6].characterText, vars) },
      7: { characterText: fillVars(templates.steps[7].characterText, vars) },
      8: { characterText: fillVars(templates.steps[8].characterText, vars) },
      step8done: { characterText: fillVars(templates.steps.step8done.characterText, vars) },
    },
    mcq: {
      options: templates.mcq.options.map((o) => fillVars(o, vars)),
      correctIndex: templates.mcq.correctIndex,
      wrongFeedback: fillVars(templates.mcq.wrongFeedback, vars),
      correctFeedback: templates.mcq.correctFeedback,
    },
    numpad: {
      step6: {
        mathPrefix: fillVars(templates.numpad.step6.mathPrefix, vars),
        answer: derived.minutesAtCrossed,
        wrongFeedback: templates.numpad.step6.wrongFeedback,
        correctFeedback: templates.numpad.step6.correctFeedback,
      },
      step7: {
        mathSuffix: templates.numpad.step7.mathSuffix,
        answer: derived.extraMinutes,
        wrongFeedback: fillVars(templates.numpad.step7.wrongFeedback, vars),
        correctFeedback: fillVars(templates.numpad.step7.correctFeedback, vars),
      },
      step8: {
        mathPrefix: fillVars(templates.numpad.step8.mathPrefix, vars),
        mathSuffix: templates.numpad.step8.mathSuffix,
        answer: derived.totalMinutes,
        wrongFeedback: templates.numpad.step8.wrongFeedback,
        correctFeedback: templates.numpad.step8.correctFeedback,
      },
    },
    nav: {
      tapNextReadAt: fillVars(templates.nav.tapNextReadAt, vars),
    },
  };
}

const DATA = {
  en: {
    app: {
      common: {
        tapNextToContinue: "Tap » to continue.",
        tapNextExplore: "Tap » to explore more on reading minutes.",
        tapNumberCrossed: "Tap the number that the long hand has just crossed.",
        tapCorrectOption: "Tap the correct option.",
        tapNumpadToFill: "Tap using numpad to fill the highlighted box.",
        tapNextCountRemaining: "Tap » to count the remaining minutes.",
        tapNextAddUp: "Tap » to add up all minutes.",
        tapNextAnother: "Tap » for another challenge.",
        tapNextConclude: "Tap » to conclude.",
      },
      start: {
        heading: "Reading Time",
        text: 'Let\'s learn how to read <y>minutes</y><br>when long hand points between 2 consecutive numbers<br>on the clock.<br><br>Tap "Start" to begin!',
        buttonText: "START",
      },
      summary: {
        heading: "Reading Time",
        text:
          "Awesome! We have learnt how to read minutes<br>when long hand points between<br>2 consecutive numbers on the clock.",
        buttonText: "START OVER",
      },
      splash: {
        heading: "Reading Time",
        step1Image: "assets/step1.png",
        step2Image: "assets/step2.png",
      },
      splashSteps: {
        1: {
          text: "<bl>Let's recall</bl>\n\nTo find minutes when long hand points to a number, we need to do\n<y>REPEATED ADDITION of 5</y>.\n\nCan we use multiplication to read minutes?",
        },
        2: {
          text: "<bl>Yes, we can.</bl>\nMultiply the number\nwhere long hand points to by 5 to read the minutes shown by the clock.",
        },
      },
      questionTimes: [
        { hours: 6, minutes: 13 },
        { hours: 6, minutes: 18 },
        { hours: 6, minutes: 22 },
        { hours: 6, minutes: 31 },
        { hours: 6, minutes: 39 },
        { hours: 6, minutes: 43 },
      ],
      questionTemplates: {
        steps: {
          3: {
            characterText:
              "Hey! Let's learn how to read minutes when long hand points between two numbers.",
          },
          4: {
            characterText: "First, let's see where the long hand is?",
          },
          5: {
            characterText:
              "Long hand has just crossed {n}.\n\nHow many <st>minutes</st> when long hand points at {n}?",
          },
          6: {
            characterText:
              "Yeah! Now, tell how many minutes when long hand points at {n}?",
          },
          7: {
            characterText:
              "How many more marks has the long hand crossed after number crossing {n}?",
          },
          8: {
            characterText:
              "Let's count up the total minutes.\n\n{minutesAt} + {extra} marks = \n<st>?? minutes</st>",
          },
          step8done: {
            characterText: "Well Done!\nThe clock reads <st>{total} minutes</st>.",
          },
        },
        mcq: {
          options: ["{n} minutes", "{n}×5 minutes", "{n}×10 minutes"],
          correctIndex: 1,
          wrongFeedback:
            "That's not right!\nTo find the minutes, multiply the number where the long hand points at by 5.",
          correctFeedback: "That's correct!",
        },
        numpad: {
          step6: {
            mathPrefix: "{n} × 5 = ",
            wrongFeedback: "Try again!",
            correctFeedback: "That's correct.",
          },
          step7: {
            mathSuffix: " minutes",
            wrongFeedback:
              "That's not right!\nCount how many marks after {minutesAt} minutes",
            correctFeedback:
              "That's correct.\n{extra} more minutes have passed after crossing {n}.",
          },
          step8: {
            mathPrefix: "({minutesAt} + {extra}) minutes =",
            mathSuffix: " minutes",
            wrongFeedback: "Oops!\nThat's not right.",
            correctFeedback: "Well done!",
          },
        },
        nav: {
          tapNextReadAt: "Tap » to read number when long hand points at {n}.",
        },
      },
    },
  },
  id: {
    app: {
      common: {
        tapNextToContinue: "Ketuk » untuk melanjutkan.",
        tapNextExplore:
          "Ketuk » untuk menjelajahi lebih lanjut tentang membaca menit.",
        tapNumberCrossed: "Ketuk angka yang baru saja dilewati jarum panjang.",
        tapCorrectOption: "Ketuk pilihan yang benar.",
        tapNumpadToFill: "Ketuk numpad untuk mengisi kotak yang disorot.",
        tapNextCountRemaining: "Ketuk » untuk menghitung sisa menit.",
        tapNextAddUp: "Ketuk » untuk menjumlahkan semua menit.",
        tapNextAnother: "Ketuk » untuk tantangan lain.",
        tapNextConclude: "Ketuk » untuk menyimpulkan.",
      },
      start: {
        heading: "Waktu Membaca",
        text: 'Mari belajar cara membaca <y>menit</y><br>ketika jarum panjang berada di antara 2 angka berurutan<br>pada jam.<br><br>Ketuk "Mulai" untuk memulai!',
        buttonText: "MULAI",
      },
      summary: {
        heading: "Waktu Membaca",
        text:
          "Luar biasa! Kita telah belajar cara membaca menit<br>ketika jarum panjang berada di antara<br>2 angka berurutan pada jam.",
        buttonText: "ULANGI",
      },
      splash: {
        heading: "Waktu Membaca",
        step1Image: "assets/step1.png",
        step2Image: "assets/step2.png",
      },
      splashSteps: {
        1: {
          text: "<bl>Mari kita ingat kembali</bl>\n\nUntuk menemukan menit ketika jarum panjang menunjuk ke suatu angka, kita perlu melakukan\n<y>PENJUMLAHAN BERULANG 5</y>.\n\nBisakah kita menggunakan perkalian untuk membaca menit?",
        },
        2: {
          text: "<bl>Ya, bisa.</bl>\nKalikan angka\ndi mana jarum panjang menunjuk dengan 5 untuk membaca menit yang ditunjukkan jam.",
        },
      },
      questionTimes: [
        { hours: 6, minutes: 13 },
        { hours: 6, minutes: 18 },
        { hours: 6, minutes: 22 },
        { hours: 6, minutes: 31 },
        { hours: 6, minutes: 39 },
        { hours: 6, minutes: 43 },
      ],
      questionTemplates: {
        steps: {
          3: {
            characterText:
              "Hai! Mari belajar cara membaca menit ketika jarum panjang berada di antara dua angka.",
          },
          4: {
            characterText: "Pertama, mari lihat di mana jarum panjang berada?",
          },
          5: {
            characterText:
              "Jarum panjang baru saja melewati {n}.\n\nBerapa <st>menit</st> ketika jarum panjang menunjuk ke {n}?",
          },
          6: {
            characterText:
              "Ya! Sekarang, sebutkan berapa menit ketika jarum panjang menunjuk ke {n}?",
          },
          7: {
            characterText:
              "Berapa tanda lagi yang dilewati jarum panjang setelah melewati angka {n}?",
          },
          8: {
            characterText:
              "Mari jumlahkan total menitnya.\n\n{minutesAt} + {extra} tanda = \n<st>?? menit</st>",
          },
          step8done: {
            characterText: "Bagus Sekali!\nJam menunjukkan <st>{total} menit</st>.",
          },
        },
        mcq: {
          options: ["{n} menit", "{n}×5 menit", "{n}×10 menit"],
          correctIndex: 1,
          wrongFeedback:
            "Itu tidak benar!\nUntuk menemukan menit, kalikan angka tempat jarum panjang menunjuk dengan 5.",
          correctFeedback: "Benar!",
        },
        numpad: {
          step6: {
            mathPrefix: "{n} × 5 = ",
            wrongFeedback: "Coba lagi!",
            correctFeedback: "Benar.",
          },
          step7: {
            mathSuffix: " menit",
            wrongFeedback:
              "Itu tidak benar!\nHitung berapa tanda setelah {minutesAt} menit",
            correctFeedback:
              "Benar.\n{extra} menit lagi telah berlalu setelah melewati {n}.",
          },
          step8: {
            mathPrefix: "({minutesAt} + {extra}) menit =",
            mathSuffix: " menit",
            wrongFeedback: "Ups!\nItu tidak benar.",
            correctFeedback: "Bagus!",
          },
        },
        nav: {
          tapNextReadAt: "Ketuk » untuk membaca angka saat jarum panjang menunjuk ke {n}.",
        },
      },
    },
  },
};

const app = DATA[current_language].app;
app.questions = app.questionTimes.map((time) =>
  buildQuestion(time, app.questionTemplates)
);

const APP_DATA = app;
const decimalSymbol = decimal[current_language];
