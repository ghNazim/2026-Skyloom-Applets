const MainCanvas = (props) => {
  const {
    step,
    exploredCards,
    arrowSigns,
    slopeComplete,
    onSelectCard,
    onIntroComplete,
    onRideComplete,
    onArrowTap,
    onSlopeComplete,
    onSummaryComplete,
    onClearNudges,
  } = props;

  if (step === 1 || step === 6 || step === 11 || step === 16) {
    const activeCardId =
      step === 1
        ? "positive"
        : step === 6
          ? "negative"
          : step === 11
            ? "zero"
            : "nondefined";
    return React.createElement(
      "div",
      { className: "main-canvas-container card-select-layout" },
      React.createElement(CardSelect, {
        exploredCards: exploredCards,
        activeCardId: activeCardId,
        onSelectCard: onSelectCard,
      }),
    );
  }

  if (
    (step >= 2 && step <= 5) ||
    (step >= 7 && step <= 10) ||
    (step >= 12 && step <= 15) ||
    (step >= 17 && step <= 20)
  ) {
    const scenario =
      step >= 17
        ? "nondefined"
        : step >= 12
          ? "zero"
          : step >= 7
            ? "negative"
            : "positive";
    return React.createElement(
      "div",
      { className: "main-canvas-container slope-layout" },
      React.createElement(SlopeScene, {
        step: step,
        scenario: scenario,
        arrowSigns: arrowSigns,
        slopeComplete: slopeComplete,
        onIntroComplete: onIntroComplete,
        onRideComplete: onRideComplete,
        onArrowTap: onArrowTap,
        onSlopeComplete: onSlopeComplete,
        onClearNudges: onClearNudges,
      }),
    );
  }

  if (step === 21) {
    return React.createElement(
      "div",
      { className: "main-canvas-container slope-layout" },
      React.createElement(SummaryScene, {
        onComplete: onSummaryComplete,
      }),
    );
  }

  return null;
};
