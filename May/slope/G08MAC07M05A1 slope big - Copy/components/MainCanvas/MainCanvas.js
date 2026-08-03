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

  if (step === 1 || step === 6) {
    return React.createElement(
      "div",
      { className: "main-canvas-container card-select-layout" },
      React.createElement(CardSelect, {
        exploredCards: exploredCards,
        activeCardId: step === 1 ? "positive" : "negative",
        onSelectCard: onSelectCard,
      }),
    );
  }

  if (step >= 2 && step <= 5) {
    return React.createElement(
      "div",
      { className: "main-canvas-container slope-layout" },
      React.createElement(SlopeScene, {
        step: step,
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
