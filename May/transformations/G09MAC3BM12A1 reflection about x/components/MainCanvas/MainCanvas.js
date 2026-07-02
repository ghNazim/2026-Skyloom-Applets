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
    showQ1FourUnitsLabel,
    unitLineRotating,
    showDashedDistance,
    onGridClick,
    onXAxisClick,
    onRevealClick,
    onPropertiesClick,
    onProperty1Click,
    onProperty2Click,
    step5Phase,
    prop1Done,
    prop2Done,
    p1LineVisible,
    p1LineFadeReady,
    p1RightAngleVisible,
    p1RightAngleFadeReady,
    cloneVisible,
    cloneY,
    cloneOpacity,
    calloutVisible,
    calloutFadeReady,
    calloutPos,
    calloutMode,
    calloutPrevMode,
    calloutTextNextReady,
    calloutLoading,
    showMeasureLine,
    measureLineUnits,
    measureLineGrowing,
    unitLabelOverride,
    showApost,
    apostFadeReady,
    step5DoneTextVisible,
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
      const prop2Enabled = step5Phase === "prop2-ready" || step5Phase === "prop2-running" || prop2Done;
      const prop1Dimmed =
        (step5Phase === "prop2-ready" || step5Phase === "prop2-running") && !prop2Done;
      return React.createElement(
        "div",
        { className: "right-panel-content property-cards" },
        React.createElement(
          "div",
          { className: "property-card" },
          React.createElement(
            "div",
            { className: "property-card-title-row" },
            React.createElement(
              "p",
              { className: "property-card-title" },
              s5.property1Title,
            ),
            prop1Done
              ? React.createElement("img", {
                  src: "assets/tick.svg",
                  alt: "",
                  className: "property-tick is-visible",
                })
              : React.createElement("img", {
                  src: "assets/tick.svg",
                  alt: "",
                  className: "property-tick",
                }),
          ),
          React.createElement(
            "button",
            {
              className:
                "property-card-box" +
                (prop1Done ? " is-complete" : "") +
                (prop1Dimmed ? " is-dimmed" : ""),
              id: "property-1-button",
              onClick: onProperty1Click,
              disabled: prop1Done || step5Phase === "prop1-running",
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
            "div",
            { className: "property-card-title-row" },
            React.createElement(
              "p",
              { className: "property-card-title" },
              s5.property2Title,
            ),
            prop2Done
              ? React.createElement("img", {
                  src: "assets/tick.svg",
                  alt: "",
                  className: "property-tick is-visible",
                })
              : React.createElement("img", {
                  src: "assets/tick.svg",
                  alt: "",
                  className: "property-tick",
                }),
          ),
          React.createElement(
            "button",
            {
              className:
                "property-card-box" +
                (prop1Done ? "" : " is-dimmed") +
                (prop2Done ? " is-complete" : ""),
              id: "property-2-button",
              onClick: onProperty2Click,
              disabled: !prop2Enabled || prop2Done,
            },
            React.createElement("div", {
              dangerouslySetInnerHTML: {
                __html: handleComma(s5.property2Text),
              },
            }),
          ),
        ),
        prop2Done && step5DoneTextVisible
          ? React.createElement(
              "div",
              { className: "step5-done-text is-visible" },
              s5.doneText,
            )
          : React.createElement("div", { className: "step5-done-text" }, ""),
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
          showQ1FourUnitsLabel: showQ1FourUnitsLabel,
          unitLineRotating: unitLineRotating,
          showDashedDistance: showDashedDistance,
          step5Phase: step5Phase,
          prop1Done: prop1Done,
          prop2Done: prop2Done,
          p1LineVisible: p1LineVisible,
          p1LineFadeReady: p1LineFadeReady,
          p1RightAngleVisible: p1RightAngleVisible,
          p1RightAngleFadeReady: p1RightAngleFadeReady,
          cloneVisible: cloneVisible,
          cloneY: cloneY,
          cloneOpacity: cloneOpacity,
          calloutVisible: calloutVisible,
          calloutFadeReady: calloutFadeReady,
          calloutPos: calloutPos,
          calloutMode: calloutMode,
          calloutPrevMode: calloutPrevMode,
          calloutTextNextReady: calloutTextNextReady,
          calloutLoading: calloutLoading,
          showMeasureLine: showMeasureLine,
          measureLineUnits: measureLineUnits,
          measureLineGrowing: measureLineGrowing,
          unitLabelOverride: unitLabelOverride,
          showApost: showApost,
          apostFadeReady: apostFadeReady,
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
