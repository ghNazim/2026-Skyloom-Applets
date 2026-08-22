const ReflectionCanvas = (props) => {
  const {
    activeReflector,
    exploredReflectors,
    visual,
    isAnimating,
    navStage,
    onSelectReflector,
    onPrevious,
    onNext,
    showSummarize,
    onSummarize,
  } = props;

  const previousDisabled = isAnimating || navStage === "idle";
  const nextDisabled = isAnimating || navStage !== "prefold";
  const explorationInProgress =
    Boolean(activeReflector) && navStage !== "folded";
  const reflectorButtonsDisabled = isAnimating || explorationInProgress;
  const caseConfig = visual.caseId ? REFLECTION_CASES[visual.caseId] : null;
  const resultBoxes =
    caseConfig && visual.showResultBoxes
      ? APP_DATA.graph.resultBoxes[visual.caseId]
      : null;
  const tones = caseConfig ? caseConfig.resultTone : null;
  const useWideResultBoxes =
    visual.caseId === "lineYH" || visual.caseId === "lineXK";

  return React.createElement(
    "div",
    { className: "rotation-canvas-container reflection-canvas-container" },
    React.createElement(
      "div",
      { className: "rotation-property-column reflection-property-column visible" },
      React.createElement(PropertyPanel, {
        activeReflector,
        exploredReflectors,
        disabled: reflectorButtonsDisabled,
        onSelect: onSelectReflector,
        showSummarize,
        onSummarize,
      }),
    ),
    React.createElement(
      "div",
      { className: "rotation-graph-column reflection-graph-column" },
      React.createElement(ReflectionGraph, { visual }),
      resultBoxes
        ? React.createElement(
            "div",
            {
              className:
                "reflection-result-boxes" + (useWideResultBoxes ? " wide" : ""),
            },
            React.createElement(
              "div",
              { className: "reflection-result-box " + getResultToneClass(tones.x) },
              renderCanvasMathText(resultBoxes.x),
            ),
            React.createElement(
              "div",
              { className: "reflection-result-box " + getResultToneClass(tones.y) },
              renderCanvasMathText(resultBoxes.y),
            ),
          )
        : null,
      React.createElement(
        "div",
        { className: "reflection-nav-buttons" },
        React.createElement(
          "button",
          {
            id: "reflection-prev-button",
            className: "reflection-nav-btn",
            disabled: previousDisabled,
            onClick: onPrevious,
          },
          "<",
        ),
        React.createElement(
          "button",
          {
            id: "reflection-next-button",
            className: "reflection-nav-btn",
            disabled: nextDisabled,
            onClick: onNext,
          },
          ">",
        ),
      ),
    ),
  );
};

function renderCanvasMathText(text) {
  const parts = String(text).split(/\b([xy])\b/g);
  return parts.map((part, index) =>
    part === "x" || part === "y"
      ? React.createElement(
          "span",
          { key: index, className: "math-var" },
          part,
        )
      : part,
  );
}
