const MainCanvas = ({
  step,
  onAnimationDone,
  compareIndex,
  onCompareCorrect,
  calculateKey,
  foundAnswers,
  onCalculateCorrect,
  comprehendKey,
  comprehendStep1Part,
  onNavChange,
}) => {
  if (step >= 1 && step <= 2) {
    return React.createElement(
      "div",
      { className: "main-canvas" },
      React.createElement(Comprehend, {
        key: comprehendKey,
        step: step,
        step1Part: comprehendStep1Part,
        onAnimationDone: onAnimationDone,
      })
    );
  }

  if (step === 3) {
    return React.createElement(
      "div",
      { className: "main-canvas" },
      React.createElement(Compare, {
        key: compareIndex,
        compareIndex: compareIndex,
        onCorrect: onCompareCorrect,
      })
    );
  }

  if (step === 5 || step === 6) {
    return React.createElement(
      "div",
      { className: "main-canvas" },
      React.createElement(Calculate, {
        key: step === 5 ? "calc-" + calculateKey : "table",
        step: step,
        foundAnswers: foundAnswers,
        onCorrect: onCalculateCorrect,
        onNavChange: onNavChange,
      })
    );
  }

  if (step === 7) {
    return React.createElement(
      "div",
      { className: "main-canvas" },
      React.createElement(CalculateSummary)
    );
  }

  return null;
};
