function buildQuestions(lang) {
  const isId = lang === "id";

  return [
    {
      id: "q1",
      questionText: isId
        ? "Sebuah garis 2x + y = 5 ditranslasi 1 satuan ke kanan dan 4 satuan ke atas.<br>Berapakah persamaan garis hasil translasi?"
        : "A line 2x + y = 5 is translated 1 unit to the right and 4 unit upward.<br>What is the equation of the translated line?",
      questionTextPhase1: isId
        ? "Sebuah garis <span class=\"purple-bg\">2x + y = 5</span> ditranslasi 1 satuan ke kanan dan 4 satuan ke atas.<br>Berapakah persamaan garis hasil translasi?"
        : "A line <span class=\"purple-bg\">2x + y = 5</span> is translated 1 unit to the right and 4 unit upward.<br>What is the equation of the translated line?",
      questionTextPhase2: isId
        ? "Sebuah garis 2x + y = 5 ditranslasi <span class=\"purple-bg\">1 satuan ke kanan dan 4 satuan ke atas</span>.<br>Berapakah persamaan garis hasil translasi?"
        : "A line 2x + y = 5 is translated <span class=\"purple-bg\">1 unit to the right and 4 unit upward</span>.<br>What is the equation of the translated line?",
      mathDnd: {
        parts: [
          { type: "text", value: "2" },
          { type: "zone", id: "x", placeholder: "x" },
          { type: "text", value: " + " },
          { type: "zone", id: "y", placeholder: "y" },
          { type: "text", value: " = 5" },
        ],
        options: [
          { id: "xMinus1", label: "(x - 1)" },
          { id: "xMinusNeg1", label: "(x - (-1))" },
          { id: "yMinus4", label: "(y - 4)" },
          { id: "yMinusNeg4", label: "(y - (-4))" },
        ],
        correct: { x: "xMinus1", y: "yMinus4" },
      },
      simplify: {
        initialPhase: "s1",
        phases: {
          s1: { prefix: "", highlight: "2(x - 1)", suffix: " + (y - 4) = 5" },
          s2: { prefix: "", highlight: "2x - 2 + (y - 4)", suffix: " = 5" },
          s3: { prefix: "2x + y ", highlight: "- 2 - 4 = 5", suffix: "" },
          s4: { prefix: "2x + y = ", highlight: "5 + 4 + 2", suffix: "" },
        },
        actions: {
          s1: { innerTo: "2x - 2", nextPhase: "s2" },
          s2: { innerTo: "2x + y - 2 - 4", nextPhase: "s3" },
          s3: { innerTo: "= 5 + 4 + 2", nextPhase: "s4" },
          s4: { innerTo: "11", nextPhase: null },
        },
        finalExpression: "2x + y = 11",
        conclusionText: isId
          ? "2x + y = 11 adalah persamaan<br>garis hasil translasi."
          : "2x + y = 11 is the equation of the<br>translated line.",
      },
    },
    {
      id: "q2",
      questionText: isId
        ? "Sebuah garis 3x - 2y = 8 ditranslasi 2 satuan ke kiri dan 5 satuan ke bawah.<br>Berapakah persamaan garis hasil translasi?"
        : "A line 3x - 2y = 8 is translated 2 units to the left and 5 units downward.<br>What is the equation of the translated line?",
      questionTextPhase1: isId
        ? "Sebuah garis <span class=\"purple-bg\">3x - 2y = 8</span> ditranslasi 2 satuan ke kiri dan 5 satuan ke bawah.<br>Berapakah persamaan garis hasil translasi?"
        : "A line <span class=\"purple-bg\">3x - 2y = 8</span> is translated 2 units to the left and 5 units downward.<br>What is the equation of the translated line?",
      questionTextPhase2: isId
        ? "Sebuah garis 3x - 2y = 8 ditranslasi <span class=\"purple-bg\">2 satuan ke kiri dan 5 satuan ke bawah</span>.<br>Berapakah persamaan garis hasil translasi?"
        : "A line 3x - 2y = 8 is translated <span class=\"purple-bg\">2 units to the left and 5 units downward</span>.<br>What is the equation of the translated line?",
      mathDnd: {
        parts: [
          { type: "text", value: "3" },
          { type: "zone", id: "x", placeholder: "x" },
          { type: "text", value: " - 2" },
          { type: "zone", id: "y", placeholder: "y" },
          { type: "text", value: " = 8" },
        ],
        options: [
          { id: "xMinus2", label: "( x – 2 )" },
          { id: "xPlus2", label: "( x + 2 )" },
          { id: "yMinus5", label: "( y – 5 )" },
          { id: "yPlus5", label: "( y + 5 )" },
        ],
        correct: { x: "xPlus2", y: "yPlus5" },
      },
      simplify: {
        initialPhase: "s1",
        phases: {
          s1: { prefix: "", highlight: "3(x + 2)", suffix: " – 2(y + 5) = 8" },
          s2: { prefix: "3x + 6 ", highlight: "– 2(y + 5)", suffix: " = 8" },
          s3: {
            prefix: "",
            highlight: "3x + 6 – 2y – 10",
            suffix: " = 8",
          },
          s4: {
            prefix: "3x - 2y ",
            highlight: "+ 6 - 10 = 8",
            suffix: "",
          },
          s5: { prefix: "3x - 2y = ", highlight: "8 – 6 + 10", suffix: "" },
        },
        actions: {
          s1: { innerTo: "3x + 6", nextPhase: "s2" },
          s2: { innerTo: "– 2y – 10", nextPhase: "s3" },
          s3: { innerTo: "3x - 2y + 6 - 10", nextPhase: "s4" },
          s4: { innerTo: "= 8 – 6 + 10", nextPhase: "s5" },
          s5: { innerTo: "12", nextPhase: null },
        },
        finalExpression: "3x - 2y = 12",
        conclusionText: isId
          ? "3x - 2y = 12 adalah persamaan<br>garis hasil translasi."
          : "3x - 2y = 12 is the equation of the<br>translated line.",
      },
    },
    {
      id: "q3",
      questionText: isId
        ? "Sebuah garis x + 4y = 12 ditranslasi 3 satuan ke kiri dan 2 satuan ke atas.<br>Berapakah persamaan garis hasil translasi?"
        : "A line x + 4y = 12 is translated 3 units to the left and 2 units upward.<br>What is the equation of the translated line?",
      questionTextPhase1: isId
        ? "Sebuah garis <span class=\"purple-bg\">x + 4y = 12</span> ditranslasi 3 satuan ke kiri dan 2 satuan ke atas.<br>Berapakah persamaan garis hasil translasi?"
        : "A line <span class=\"purple-bg\">x + 4y = 12</span> is translated 3 units to the left and 2 units upward.<br>What is the equation of the translated line?",
      questionTextPhase2: isId
        ? "Sebuah garis x + 4y = 12 ditranslasi <span class=\"purple-bg\">3 satuan ke kiri dan 2 satuan ke atas</span>.<br>Berapakah persamaan garis hasil translasi?"
        : "A line x + 4y = 12 is translated <span class=\"purple-bg\">3 units to the left and 2 units upward</span>.<br>What is the equation of the translated line?",
      mathDnd: {
        parts: [
          { type: "zone", id: "x", placeholder: "x" },
          { type: "text", value: " + 4" },
          { type: "zone", id: "y", placeholder: "y" },
          { type: "text", value: " = 12" },
        ],
        options: [
          { id: "xMinus3", label: "( x - 3 )" },
          { id: "xPlus3", label: "( x + 3 )" },
          { id: "yMinus2", label: "( y – 2 )" },
          { id: "yPlus2", label: "( y + 2 )" },
        ],
        correct: { x: "xPlus3", y: "yMinus2" },
      },
      simplify: {
        initialPhase: "s1",
        phases: {
          s1: { prefix: "", highlight: "(x + 3)", suffix: " + 4(y – 2) = 12" },
          s2: { prefix: "x + 3 + ", highlight: "4(y – 2)", suffix: " = 12" },
          s3: {
            prefix: "",
            highlight: "x + 3 + 4y – 8",
            suffix: " = 12",
          },
          s4: {
            prefix: "x + 4y ",
            highlight: "+ 3 – 8 = 12",
            suffix: "",
          },
          s5: { prefix: "x + 4y = ", highlight: "12 – 3 + 8", suffix: "" },
        },
        actions: {
          s1: { innerTo: "x + 3", nextPhase: "s2" },
          s2: { innerTo: "4y – 8", nextPhase: "s3" },
          s3: { innerTo: "x + 4y + 3 – 8", nextPhase: "s4" },
          s4: { innerTo: "= 12 – 3 + 8", nextPhase: "s5" },
          s5: { innerTo: "17", nextPhase: null },
        },
        finalExpression: "x + 4y = 17",
        conclusionText: isId
          ? "x + 4y = 17 adalah persamaan<br>garis hasil translasi."
          : "x + 4y = 17 is the equation of the<br>translated line.",
      },
    },
  ];
}

function getDndLabel(question, itemId) {
  const opt = question.mathDnd.options.find((o) => o.id === itemId);
  return opt ? opt.label : itemId;
}
