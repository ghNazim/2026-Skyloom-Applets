const decimal = {
  en: ".",
  id: ",",
};

const DATA = {
  en: {
    app: {
      start: {
        heading: "Moving a Point",
        text:
          "Let's see how the coordinates of a point change<br>as we move it on the coordinate plane.<br><br>Click START to begin!",
        buttonText: "START",
      },
      steps: {
        1: {
          questionText:
            "Move the point to the right and see how the coordinates change.",
          navTextInitial: "Drag the slider to move the point",
          navTextDone:
            "Tap » to see how coordinates change when point moves to the left.",
          unitsRight: "{n} units right",
        },
        2: {
          questionTextInitial:
            "Move the point to the left and see how the coordinates change.",
          questionTextRule: "General Rule: Horizontal Movement",
          navTextInitial: "Drag the slider to left to move the point",
          navTextDone:
            "Tap » to see how coordinates change when point moves upward",
          unitsLeft: "{n} units left",
          generalRuleBtn: "General Rule",
          ruleIntro: "If a point moves:",
          ruleUnits: "a units",
          ruleUnitsHorizontal: " horizontally",
          ruleThen: "Then:",
          ruleFormula: "(x, y) → (x+a, y)",
        },
        3: {
          questionText:
            "Move the point upward and see how the coordinates change.",
          navTextInitial: "Drag the slider to move the point",
          navTextDone:
            "Tap » to see how coordinates change when point moves downward.",
          unitsUp: "{n} units upward",
        },
        4: {
          questionTextInitial:
            "Move the point downward and see how the coordinates change.",
          questionTextRule: "General Rule: Vertical Movement",
          navTextInitial: "Drag the slider downward to move the point",
          navTextDone: "Tap » to continue.",
          unitsDown: "{n} units downward",
          generalRuleBtn: "General Rule",
          ruleIntro: "If a point moves:",
          ruleUnits: "b units",
          ruleUnitsVertical: " vertically",
          ruleThen: "Then:",
          ruleFormula: "(x, y) → (x, y+b)",
        },
        5: {
          questionText: "General Rule",
          navTextInitial: "Tap the button",
          navTextDone: "Tap » to explore general rule.",
          horizontalLabel: "Horizontally,",
          verticalLabel: "Vertically,",
          combineBtn: "Combine Both",
          arrowLabel: "(a, b)",
        },
        6: {
          navText:
            "Drag the slider 'x' to move horizontally and slider 'y' to move vertically",
        },
      },
      finish: {
        text:
          "Great job! You now know how the coordinates change<br>when a point moves on the coordinate plane.",
        buttonText: "START OVER",
      },
    },
  },
  id: {
    app: {
      start: {
        heading: "Memindahkan Sebuah Titik",
        text:
          "Mari lihat bagaimana koordinat sebuah titik berubah<br>saat kita memindahkannya pada bidang koordinat.<br>Ketuk MULAI untuk memulai!",
        buttonText: "MULAI",
      },
      steps: {
        1: {
          questionText:
            "Gerakkan titik ke kanan dan lihat bagaimana koordinatnya berubah.",
          navTextInitial: "Seret penggeser untuk memindahkan titik",
          navTextDone:
            "Ketuk » untuk melihat bagaimana koordinat berubah saat titik bergerak ke kiri.",
          unitsRight: "{n} satuan ke kanan",
        },
        2: {
          questionTextInitial:
            "Gerakkan titik ke kiri dan lihat bagaimana koordinatnya berubah.",
          questionTextRule: "Aturan Umum: Pergerakan Horizontal",
          navTextInitial: "Seret penggeser ke kiri untuk memindahkan titik",
          navTextDone:
            "Ketuk » untuk melihat bagaimana koordinat berubah saat titik bergerak ke atas",
          unitsLeft: "{n} satuan ke kiri",
          generalRuleBtn: "Aturan Umum",
          ruleIntro: "Jika sebuah titik bergerak:",
          ruleUnits: "a satuan",
          ruleUnitsHorizontal: " secara horizontal",
          ruleThen: "Maka:",
          ruleFormula: "(x, y) → (x+a, y)",
        },
        3: {
          questionText:
            "Gerakkan titik ke atas dan lihat bagaimana koordinatnya berubah.",
          navTextInitial: "Seret penggeser untuk memindahkan titik",
          navTextDone:
            "Ketuk » untuk melihat bagaimana koordinat berubah saat titik bergerak ke bawah.",
          unitsUp: "{n} satuan ke atas",
        },
        4: {
          questionTextInitial:
            "Gerakkan titik ke bawah dan lihat bagaimana koordinatnya berubah.",
          questionTextRule: "Aturan Umum: Pergerakan Vertikal",
          navTextInitial: "Seret penggeser ke bawah untuk memindahkan titik",
          navTextDone: "Ketuk » untuk lanjut.",
          unitsDown: "{n} satuan ke bawah",
          generalRuleBtn: "Aturan Umum",
          ruleIntro: "Jika sebuah titik bergerak:",
          ruleUnits: "b satuan",
          ruleUnitsVertical: " secara vertikal",
          ruleThen: "Maka:",
          ruleFormula: "(x, y) → (x, y+b)",
        },
        5: {
          questionText: "Aturan Umum",
          navTextInitial: "Ketuk tombol",
          navTextDone: "Ketuk » untuk jelajahi aturan umum.",
          horizontalLabel: "Secara horizontal,",
          verticalLabel: "Secara vertikal,",
          combineBtn: "Gabungkan Keduanya",
          arrowLabel: "(a, b)",
        },
        6: {
          navText:
            "Seret penggeser 'x' untuk bergerak horizontal dan penggeser 'y' untuk bergerak vertikal",
        },
      },
      finish: {
        text:
          "Bagus! Kamu sekarang tahu bagaimana koordinat berubah<br>saat sebuah titik bergerak pada bidang koordinat.",
        buttonText: "MULAI LAGI",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
