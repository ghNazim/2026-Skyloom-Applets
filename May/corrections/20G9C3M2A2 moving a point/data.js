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
          "Let's see how the coordinates of a point change<br>as we move it on the coordinate plane.<br><br><br>Click START to begin!",
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
          navTextRuleButton:
            "Tap the button to see general rule for horizontal movement.",
          navTextDone:
            "Tap » to see how coordinates change when point moves upward",
          unitsLeft: "{n} units left",
          generalRuleBtn: "General Rule",
          ruleIntro: "If a point moves",
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
          navTextRuleButton:
            "Tap the button to see general rule for vertical movement.",
          navTextDone: "Tap » see the general rule.",
          unitsDown: "{n} units downward",
          generalRuleBtn: "General Rule",
          ruleIntro: "If a point moves",
          ruleUnits: "b units",
          ruleUnitsVertical: " vertically",
          ruleThen: "Then:",
          ruleFormula: "(x, y) → (x, y+b)",
        },
        5: {
          questionText: "General Rule",
          navTextInitial: "Tap the button to combine both movements",
          navTextDone: "Tap » to explore general rule.",
          horizontalLabel: "When a point moves 'a units' horizontally,",
          verticalLabel: "When a point moves 'b units' vertically",
          combinedLabel:
            "When a point moves 'a units' horizontally, and 'b units' vertically",
          combineBtn: "Combine Both",
          arrowLabel: "(a, b)",
        },
        6: {
          navText:
            "<sm>Drag slider 'a' to move the point horizontally and slider 'b' to move it vertically</sm>",
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
        heading: "Menggeser Titik",
        text:
          "Mari lihat bagaimana koordinat titik berubah<br>saat titik digeser pada bidang koordinat.<br><br><br>Klik MULAI untuk mulai!",
        buttonText: "MULAI",
      },
      steps: {
        1: {
          questionText:
            "Geser titik ke kanan dan amati koordinatnya.",
          navTextInitial: "Geser slider untuk memindahkan titik",
          navTextDone:
            "Ketuk » untuk gerak ke kiri.",
          unitsRight: "{n} satuan ke kanan",
        },
        2: {
          questionTextInitial:
            "Geser titik ke kiri dan amati koordinatnya.",
          questionTextRule: "Aturan Umum: Gerak Horizontal",
          navTextInitial: "Geser slider ke kiri",
          navTextRuleButton:
            "Ketuk tombol untuk melihat aturan horizontal.",
          navTextDone:
            "Ketuk » untuk gerak ke atas",
          unitsLeft: "{n} satuan ke kiri",
          generalRuleBtn: "Aturan Umum",
          ruleIntro: "Jika titik bergerak",
          ruleUnits: "a satuan",
          ruleUnitsHorizontal: " horizontal",
          ruleThen: "Maka:",
          ruleFormula: "(x, y) → (x+a, y)",
        },
        3: {
          questionText:
            "Geser titik ke atas dan amati koordinatnya.",
          navTextInitial: "Geser slider untuk memindahkan titik",
          navTextDone:
            "Ketuk » untuk gerak ke bawah.",
          unitsUp: "{n} satuan ke atas",
        },
        4: {
          questionTextInitial:
            "Geser titik ke bawah dan amati koordinatnya.",
          questionTextRule: "Aturan Umum: Gerak Vertikal",
          navTextInitial: "Geser slider ke bawah",
          navTextRuleButton:
            "Ketuk tombol untuk melihat aturan vertikal.",
          navTextDone: "Ketuk » untuk aturan umum.",
          unitsDown: "{n} satuan ke bawah",
          generalRuleBtn: "Aturan Umum",
          ruleIntro: "Jika titik bergerak",
          ruleUnits: "b satuan",
          ruleUnitsVertical: " vertikal",
          ruleThen: "Maka:",
          ruleFormula: "(x, y) → (x, y+b)",
        },
        5: {
          questionText: "Aturan Umum",
          navTextInitial: "Ketuk tombol untuk menggabungkan gerak",
          navTextDone: "Ketuk » untuk eksplorasi.",
          horizontalLabel: "Saat titik bergerak 'a satuan' horizontal,",
          verticalLabel: "Saat titik bergerak 'b satuan' vertikal",
          combinedLabel:
            "Saat titik bergerak 'a satuan' horizontal dan 'b satuan' vertikal",
          combineBtn: "Gabungkan Keduanya",
          arrowLabel: "(a, b)",
        },
        6: {
          navText:
            "<sm>Geser slider 'a' untuk gerak horizontal dan 'b' untuk gerak vertikal</sm>",
        },
      },
      finish: {
        text:
          "Bagus! Sekarang kamu tahu bagaimana koordinat berubah<br>saat titik bergerak pada bidang koordinat.",
        buttonText: "MULAI LAGI",
      },
    },
  },
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
