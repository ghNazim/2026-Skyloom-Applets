(() => {
  let CURRENT_LANGUAGE =
    typeof window !== "undefined" && window.APP_LANGUAGE
      ? window.APP_LANGUAGE
      : "en";

  const people = [
    {
      id: "putu",
      color: "#ffff00",
      rf: ["0", "0.5", "0.33", "0.5", "0.4"],
      freq: [0, 1, 1, 2, 2],
      changes: ["0", "+1", "0", "+1", "0"],
      mistakeTrial: null,
    },
    {
      id: "sondang",
      color: "#25b597",
      rf: ["1", "0.5", "0.67", "0.75", "0.4"],
      freq: [1, 1, 2, 3, 2],
      changes: ["+1", "0", "+1", "+1", "-1"],
      mistakeTrial: 5,
    },
  ];

  const baseSteps = [
    { id: "intro", type: "intro" },
    { id: "putuGraph", type: "graphRecord", person: "putu" },
    { id: "putuFormula", type: "formula", person: "putu" },
    { id: "putuRevealFreq", type: "revealFreq", person: "putu" },
    { id: "putuChanges", type: "enterChanges", person: "putu" },
    { id: "putuQuestion", type: "mistakeQuestion", person: "putu" },
    { id: "sondangGraph", type: "graphRecord", person: "sondang" },
    { id: "sondangRevealFreq", type: "revealFreq", person: "sondang" },
    { id: "sondangChanges", type: "enterChanges", person: "sondang" },
    { id: "sondangQuestion", type: "mistakeQuestion", person: "sondang" },
    { id: "sondangExplain", type: "explainMistake", person: "sondang" },
  ];

  const common = {
    people,
    steps: baseSteps,
    images: {
      background: "./assets/DarkBG2.jpg",
      hand_cursor: "./assets/fingerTap.gif",
    },
    sfx: {
      click: "./assets/sfx/click.mp3",
      correct: "./assets/sfx/correct.mp3",
      wrong: "./assets/sfx/wrong.mp3",
      split: "./assets/sfx/split.mp3",
    },
  };

  const appData = {
    en: {
      ...common,
      html_title: "Challenge 3 - Relative Frequency Mistake",
      peopleText: {
        putu: "Putu",
        sondang: "Sondang",
      },
      ui: {
        welcomeTitle: "Challenge 3",
        welcomeMessage:
          "<strong>Putu</strong> and <strong>Sondang</strong> each tossed a coin 5 times and plotted the relative frequency of heads. One of them made a mistake.<br><span class='hl-orange'>Who made the mistake? Where did they go wrong?</span>",
        tapStartToBegin: "Tap START to start solving.",
        readQuestionPrompt: "Read the question carefully.",
        startButton: "START",
        startOverButton: "START OVER",
        nextButton: "»",
        backButton: "«",
        trialsLabel: "Trials",
        rfLabel: "Relative frequency of heads",
        trialCol: "Trials (n)",
        rfCol: "f<sub>r</sub>(H)",
        graphRfAxis: "f<sub>r</sub>(H)",
        freqCol: "f(H)",
        changeCol: "change in<br>f(H)",
        bothPrompt:
          "Let’s record the data of each trial from diagram into a relative frequency table.",
        graphPrompt: "Let's study {name}'s diagram first.",
        graphPromptSondang: "Study {name}'s diagram.",
        recordPrompt: "Tap the highlighted points on the diagram.",
        recordedPrompt: "All graph readings are now recorded in the table.",
        formulaPrompt: "Tap the correct formula.",
        formulaQuestion: "Which formula will give us f(H)?",
        formulaKnown: "Relative frequency is given by:",
        formulaKnownExpr:
          "f<sub>r</sub>(H) = <span class='vfrac'><span>f(H)</span><span>n</span></span>",
        formulaOptionWrong:
          "<span class='vfrac'><span>f<sub>r</sub>(H)</span><span>n</span></span>",
        formulaOptionRight: "f<sub>r</sub>(H) × n",
        formulaCorrect:
          "Correct. Multiply relative frequency by trials to find f(H).",
        formulaWrong: "Not quite. Rearrange f<sub>r</sub>(H) = f(H) ÷ n.",
        revealPrompt: "Tap 'Reveal' to show all f(H) values.",
        revealButton: "Reveal",
        changesPrompt: "Let's record the change in f(H) for each trial.",
        enterChangePrompt:
          "Enter the correct change in f(H) for trial {trial}.",
        wrongFirstChange:
          "The frequency of head on first trial is <span class='hl-freq'>{current}</span>, so change is <span class='hl-change-wrong'>{answer}</span>.",
        wrongLaterChange:
          "The f(H) of trial <span class='hl-trial'>{prevTrial}</span> is <span class='hl-freq'>{prev}</span> and of trial <span class='hl-trial'>{trial}</span> is <span class='hl-freq'>{current}</span>. So, change is <span class='hl-freq'>{current}</span> − <span class='hl-freq'>{prev}</span> = <span class='hl-change-wrong'>{answer}</span>.",
        correctFirstChange:
          "The frequency of head on first trial is <span class='hl-freq'>{current}</span>, so change is <span class='hl-change-correct'>{answer}</span>.",
        correctLaterChange:
          "The f(H) of trial <span class='hl-trial'>{prevTrial}</span> is <span class='hl-freq'>{prev}</span> and of trial <span class='hl-trial'>{trial}</span> is <span class='hl-freq'>{current}</span>. So, change is <span class='hl-freq'>{current}</span> − <span class='hl-freq'>{prev}</span> = <span class='hl-change-correct'>{answer}</span>.",
        changesDonePrompt:
          "All changes recorded. Tap » to answer the main question.",
        answerMainQuestion: "Answer the main question.",
        mistakeQuestion: "Did {name} make any mistake?",
        yes: "Yes",
        no: "No",
        putuCorrectReason:
          "All changes in f(H) are either 0 or +1. So, no mistakes here.",
        putuWrongReason:
          "Not quite. Look at the changes in f(H) column. They are all 0 or +1, which are possible.",
        sondangCorrectReason:
          "The 5th trial has a negative change, which is not possible. So that's a mistake.",
        sondangWrongReason:
          "Not quite. Look at the changes in f(H) column. Can a change in frequency be negative?",
        mistakeExplain:
          "In Sondang's diagram, trial 5 has a mistake because the <span class = 'hl-orange'>frequency of heads becomes negative</span>, which is not possible.",
        instructionFindFH: "Tap » to find f(H) in the table.",
        instructionFindFHValues: "Tap » to find the value of f(H) for each trial.",
        instructionSeeTable: "Tap » to see the relative frequency table.",
        instructionTapPoints: "Tap the highlighted points on the diagram.",
        instructionFormula: "Tap the correct formula.",
        instructionReveal: "Tap 'Reveal' to show all f(H) values.",
        instructionQuestion: "Tap the correct answer - Yes or No.",
        instructionStudySondang: "Tap » to study Sondang's diagram.",
        instructionSeeMistake: "Tap » to see the mistake on the diagram.",
        instructionStartOver: "Tap START OVER to repeat the challenge.",
        instructionTapContinue: "Tap » to continue.",
        instructionRecordChanges: "Tap » to record changes in f(H).",
      },
    },
    id: {
      ...common,
      html_title: "Tantangan 3 - Kesalahan Frekuensi Relatif",
      peopleText: {
        putu: "Putu",
        sondang: "Sondang",
      },
      ui: {
        welcomeTitle: "Tantangan 3",
        welcomeMessage:
          "<strong>Putu</strong> dan <strong>Sondang</strong> masing-masing melempar koin 5 kali dan membuat grafik frekuensi relatif munculnya angka.<br><span class='hl-orange'>Salah satu dari mereka melakukan kesalahan. Siapa yang salah? Di mana letak kesalahannya?</span>",
        tapStartToBegin: "Ketuk MULAI untuk mulai menyelesaikan.",
        readQuestionPrompt: "Bacalah pertanyaannya dengan saksama.",
        startButton: "MULAI",
        startOverButton: "MULAI LAGI",
        nextButton: "»",
        backButton: "«",
        trialsLabel: "Uji coba",
        rfLabel: "Frekuensi relatif angka",
        trialCol: "Uji coba (n)",
        rfCol: "f<sub>r</sub>(A)",
        graphRfAxis: "f<sub>r</sub>(A)",
        freqCol: "f(A)",
        changeCol: "perubahan<br>f(A)",
        bothPrompt:
          "Mari kita catat data setiap uji coba dari diagram ke dalam tabel frekuensi relatif.",
        graphPrompt: "Mari pelajari diagram {name} terlebih dahulu.",
        graphPromptSondang: "Pelajari diagram {name}.",
        recordPrompt: "Ketuk titik-titik yang disorot pada diagram.",
        recordedPrompt: "Semua pembacaan grafik sudah dicatat pada tabel.",
        formulaPrompt: "Ketuk rumus yang benar.",
        formulaQuestion: "Rumus mana yang akan memberi kita f(A)?",
        formulaKnown: "Frekuensi relatif diberikan oleh:",
        formulaKnownExpr:
          "f<sub>r</sub>(A) = <span class='vfrac'><span>f(A)</span><span>n</span></span>",
        formulaOptionWrong:
          "<span class='vfrac'><span>f<sub>r</sub>(A)</span><span>n</span></span>",
        formulaOptionRight: "f<sub>r</sub>(A) × n",
        formulaCorrect:
          "Tepat. Kalikan frekuensi relatif dengan banyak uji coba untuk mencari f(A).",
        formulaWrong: "Belum tepat. Susun ulang f<sub>r</sub>(A) = f(A) ÷ n.",
        revealPrompt: "Ketuk 'Buka' untuk menampilkan semua nilai f(A).",
        revealButton: "Buka",
        changesPrompt: "Mari catat perubahan f(A) untuk setiap uji coba.",
        enterChangePrompt:
          "Masukkan perubahan f(A) yang benar untuk uji coba {trial}.",
        wrongFirstChange:
          "Frekuensi angka pada uji coba pertama adalah <span class='hl-freq'>{current}</span>, jadi perubahannya <span class='hl-change-wrong'>{answer}</span>.",
        wrongLaterChange:
          "f(A) pada uji coba <span class='hl-trial'>{prevTrial}</span> adalah <span class='hl-freq'>{prev}</span> dan pada uji coba <span class='hl-trial'>{trial}</span> adalah <span class='hl-freq'>{current}</span>. Jadi, perubahannya <span class='hl-freq'>{current}</span> − <span class='hl-freq'>{prev}</span> = <span class='hl-change-wrong'>{answer}</span>.",
        correctFirstChange:
          "Frekuensi angka pada uji coba pertama adalah <span class='hl-freq'>{current}</span>, jadi perubahannya <span class='hl-change-correct'>{answer}</span>.",
        correctLaterChange:
          "f(A) pada uji coba <span class='hl-trial'>{prevTrial}</span> adalah <span class='hl-freq'>{prev}</span> dan pada uji coba <span class='hl-trial'>{trial}</span> adalah <span class='hl-freq'>{current}</span>. Jadi, perubahannya <span class='hl-freq'>{current}</span> − <span class='hl-freq'>{prev}</span> = <span class='hl-change-correct'>{answer}</span>.",
        changesDonePrompt:
          "Semua perubahan tercatat. Ketuk » untuk menjawab pertanyaan utama.",
        answerMainQuestion: "Jawab pertanyaan utama.",
        mistakeQuestion: "Apakah {name} melakukan kesalahan?",
        yes: "Ya",
        no: "Tidak",
        putuCorrectReason:
          "Semua perubahan f(A) adalah 0 atau +1. Jadi, tidak ada kesalahan di sini.",
        putuWrongReason:
          "Belum tepat. Lihat kolom perubahan f(A). Semuanya bernilai 0 atau +1, dan hal tersebut mungkin terjadi.",
        sondangCorrectReason:
          "Uji coba ke-5 memiliki perubahan negatif, dan itu tidak mungkin. Jadi, itulah kesalahannya.",
        sondangWrongReason:
          "Belum tepat. Lihat kolom perubahan f(A). Mungkinkah perubahan frekuensi bernilai negatif?",
        mistakeExplain:
          "Pada diagram Sondang, uji coba ke-5 salah karena <span class='hl-orange'>frekuensi angka menjadi negatif</span>, dan itu tidak mungkin.",
        instructionFindFH: "Ketuk » untuk mencari f(A) pada tabel.",
        instructionFindFHValues: "Ketuk » untuk mencari nilai f(A) untuk setiap uji coba.",
        instructionSeeTable: "Ketuk » untuk melihat tabel frekuensi relatif.",
        instructionTapPoints: "Ketuk titik-titik yang disorot pada diagram.",
        instructionFormula: "Ketuk rumus yang benar.",
        instructionReveal: "Ketuk 'Buka' untuk menampilkan semua nilai f(A).",
        instructionEnterChange: "Masukkan perubahan lalu ketuk ✓.",
        instructionQuestion: "Ketuk jawaban yang benar - Ya atau Tidak.",
        instructionStudySondang: "Ketuk » untuk mempelajari diagram Sondang.",
        instructionSeeMistake: "Ketuk » untuk melihat kesalahan pada diagram.",
        instructionStartOver: "Ketuk MULAI LAGI untuk mengulang tantangan.",
        instructionTapContinue: "Ketuk » untuk melanjutkan.",
        instructionRecordChanges: "Ketuk » untuk mencatat perubahan f(A).",
      },
    },
  };

  window.getChallengeConfig = () => ({
    steps: baseSteps,
    totalSteps: baseSteps.length,
    endStep: baseSteps.length,
  });

  window.getStepConfig = (globalStep) => {
    const config = window.getChallengeConfig();
    if (globalStep >= config.endStep)
      return { step: globalStep, type: "end", stepData: null };
    const stepData = config.steps[globalStep];
    return { step: globalStep, type: stepData.type, stepData };
  };

  window.T = appData[CURRENT_LANGUAGE];
  window.setLanguage = (lang) => {
    CURRENT_LANGUAGE = lang;
    if (appData[CURRENT_LANGUAGE])
      Object.assign(window.T, appData[CURRENT_LANGUAGE]);
  };
})();
