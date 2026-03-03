const MainCanvas = ({
  step,
  onAnimationDone,
  compareIndex,
  onCompareCorrect,
  calculateKey,
  foundAnswers,
  onCalculateCorrect,
  comprehendKey,
  onNavChange,
}) => {
  if (step >= 1 && step <= 2) {
    return React.createElement(
      "div",
      { className: "main-canvas" },
      React.createElement(Comprehend, {
        key: comprehendKey,
        step: step,
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

  if (step === 5) {
    return React.createElement(
      "div",
      { className: "main-canvas" },
      React.createElement(Calculate, {
        key: "calc-" + calculateKey,
        foundAnswers: foundAnswers,
        onCorrect: onCalculateCorrect,
        onNavChange: onNavChange,
      })
    );
  }

  if (step === 6) {
    return React.createElement(
      "div",
      { className: "main-canvas" },
      React.createElement(CalculateSummary)
    );
  }

  return null;
};
