const MainCanvas = (props) => {
  const {
    step,
    step2Phase,
    step2Feedback,
    plottedPoint,
    lineAnimPhase,
    xAxisHighlighted,
    showReflectionLabel,
    step4Phase,
    showUnitLine,
    unitLineY1,
    unitLineY2,
    unitLabelText,
    unitLabelFinal,
    highlightFour,
    unitLineRotating,
    showDashedDistance,
    onGridClick,
    onXAxisClick,
    onRevealClick,
    onPropertiesClick,
    onProperty1Click,
  } = props;

  const topText =
    step >= 1 ? handleComma(APP_DATA.steps[1].topText) : "";

  const renderRightPanel = () => {
    if (step === 2) {
      const s2 = APP_DATA.steps[2];
      return React.createElement(
        "div",
        { className: "right-panel-content" },
        React.createElement("div", {
          className: "right-panel-text",
          dangerouslySetInnerHTML: { __html: handleComma(s2.rightText) },
        }),
        step2Feedback
          ? React.createElement("div", {
              className:
                "feedback-box" +
                (step2Feedback === "correct" ? " is-correct" : " is-wrong"),
              dangerouslySetInnerHTML: {
                __html: handleComma(
                  step2Feedback === "correct"
                    ? s2.feedbackCorrect
                    : s2.feedbackWrong,
                ),
              },
            })
          : null,
      );
    }

    if (step === 3) {
      return React.createElement(
        "div",
        { className: "right-panel-content" },
        React.createElement("div", {
          className: "right-panel-text",
          dangerouslySetInnerHTML: {
            __html: handleComma(APP_DATA.steps[3].rightText),
          },
        }),
      );
    }

    if (step === 4) {
      const s4 = APP_DATA.steps[4];
      const showDoneText =
        step4Phase === "done" || step4Phase === "properties-ready";
      return React.createElement(
        "div",
        { className: "right-panel-content" },
        React.createElement("div", {
          className: "right-panel-text",
          dangerouslySetInnerHTML: {
            __html: handleComma(
              showDoneText ? s4.rightTextDone : s4.rightTextInitial,
            ),
          },
        }),
        step4Phase === "initial" || step4Phase === "revealing"
          ? React.createElement(
              "button",
              {
                className: "btn action-btn reveal-btn",
                id: "reveal-button",
                onClick: onRevealClick,
                disabled: step4Phase === "revealing",
              },
              s4.revealBtn,
            )
          : null,
        step4Phase === "done" || step4Phase === "properties-ready"
          ? React.createElement(
              "button",
              {
                className: "btn action-btn properties-btn",
                id: "properties-button",
                onClick: onPropertiesClick,
              },
              s4.propertiesBtn,
            )
          : null,
      );
    }

    if (step === 5) {
      const s5 = APP_DATA.steps[5];
      return React.createElement(
        "div",
        { className: "right-panel-content property-cards" },
        React.createElement(
          "div",
          { className: "property-card" },
          React.createElement(
            "p",
            { className: "property-card-title" },
            s5.property1Title,
          ),
          React.createElement(
            "button",
            {
              className: "property-card-box",
              id: "property-1-button",
              onClick: onProperty1Click,
            },
            React.createElement("div", {
              dangerouslySetInnerHTML: {
                __html: handleComma(s5.property1Text),
              },
            }),
          ),
        ),
        React.createElement(
          "div",
          { className: "property-card" },
          React.createElement(
            "p",
            { className: "property-card-title" },
            s5.property2Title,
          ),
          React.createElement(
            "div",
            { className: "property-card-box is-static" },
            React.createElement("div", {
              dangerouslySetInnerHTML: {
                __html: handleComma(s5.property2Text),
              },
            }),
          ),
        ),
      );
    }

    return null;
  };

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "div",
      { className: "main-canvas-left" },
      React.createElement(
        "div",
        { className: "left-top-text-row" },
        React.createElement("div", {
          className: "left-top-text-content",
          dangerouslySetInnerHTML: { __html: topText },
        }),
      ),
      React.createElement(
        "div",
        { className: "left-graph-row" },
        React.createElement(GraphPanel, {
          step: step,
          step2Phase: step2Phase,
          plottedPoint: plottedPoint,
          lineAnimPhase: lineAnimPhase,
          xAxisHighlighted: xAxisHighlighted,
          showReflectionLabel: showReflectionLabel,
          step4Phase: step4Phase,
          showUnitLine: showUnitLine,
          unitLineY1: unitLineY1,
          unitLineY2: unitLineY2,
          unitLabelText: unitLabelText,
          unitLabelFinal: unitLabelFinal,
          highlightFour: highlightFour,
          unitLineRotating: unitLineRotating,
          showDashedDistance: showDashedDistance,
          onGridClick: onGridClick,
          onXAxisClick: onXAxisClick,
        }),
      ),
    ),
    React.createElement(
      "div",
      { className: "main-canvas-right" },
      renderRightPanel(),
    ),
  );
};
