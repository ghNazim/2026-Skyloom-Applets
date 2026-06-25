const MainCanvas = (props) => {
  const {
    step,
    selectedCard,
    exploredCards,
    interactionDone,
    dilationK,
    showDilated,
    center,
    feedbackHtml,
    onSelectCard,
    onKChange,
    onKDragStart,
    onKRelease,
    onCenterChange,
  } = props;

  if (step === 1) {
    return React.createElement(
      "div",
      { className: "main-canvas-container card-select-layout" },
      React.createElement(CardSelect, {
        exploredCards: exploredCards,
        onSelectCard: onSelectCard,
      }),
    );
  }

  if (step === 2 || step === 3) {
    const geom =
      step === 3
        ? { center: center, triangle: FREE_EXPLORE_GEOMETRY.triangle }
        : getCardGeometry(selectedCard);

    return React.createElement(
      "div",
      { className: "main-canvas-container interaction-layout" },
      React.createElement(
        "div",
        { className: "dilation-interaction-wrap" },
        React.createElement(DilationGraph, {
          center: geom.center,
          triangle: geom.triangle,
          dilationK: dilationK,
          showDilated: showDilated,
          centerDraggable: step === 3,
          onCenterChange: onCenterChange,
          onKChange: onKChange,
          onKDragStart: onKDragStart,
          onKRelease: onKRelease,
        }),
        step === 2 && feedbackHtml
          ? React.createElement("div", {
              className: "feedback-box",
              dangerouslySetInnerHTML: { __html: feedbackHtml },
            })
          : null,
        step === 2
          ? React.createElement(CardStrip, {
              selectedCard: selectedCard,
              interactive: false,
            })
          : null,
      ),
    );
  }

  return null;
};
