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
    onClearNudges,
  } = props;

  if (step === 1 || step === 6 || step === 12) {
    const activeCardId =
      step === 1 ? "positive" : step === 6 ? "negative" : "zero";
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

  if ((step >= 2 && step <= 5) || (step >= 7 && step <= 11)) {
    return React.createElement(
      "div",
      { className: "main-canvas-container slope-layout" },
      React.createElement(SlopeScene, {
        step: step,
        scenario: step >= 7 ? "negative" : "positive",
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

  return null;
};
