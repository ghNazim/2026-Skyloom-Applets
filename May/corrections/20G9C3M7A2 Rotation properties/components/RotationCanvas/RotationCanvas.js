const RotationCanvas = (props) => {
  const {
    showPropertyPanel,
    activeProperty,
    exploredProperties,
    buttonsDisabled,
    showSummarize,
    onSelectProperty,
    onSummarize,
    topTextHtml,
    bottomTextHtml,
    topTextVisible,
    bottomTextVisible,
    graphProps,
  } = props;

  return React.createElement(
    "div",
    { className: "rotation-canvas-container" },
    React.createElement(
      "div",
      {
        className:
          "rotation-property-column" +
          (showPropertyPanel ? " visible" : " hidden"),
      },
      React.createElement(PropertyPanel, {
        activeProperty: activeProperty,
        exploredProperties: exploredProperties,
        disabled: buttonsDisabled,
        onSelect: onSelectProperty,
        showSummarize: showSummarize,
        onSummarize: onSummarize,
      }),
    ),
    React.createElement(
      "div",
      { className: "rotation-graph-column" },
      React.createElement(
        "div",
        {
          className: "rotation-text-row rotation-top-text",
          style: { opacity: topTextVisible ? 1 : 0 },
        },
        React.createElement("div", {
          className: "rotation-text-content",
          dangerouslySetInnerHTML: topTextHtml
            ? { __html: handleComma(topTextHtml) }
            : undefined,
        }),
      ),
      React.createElement(
        "div",
        { className: "rotation-visual-row" },
        React.createElement(RotationGraph, graphProps),
      ),
      React.createElement(
        "div",
        {
          className: "rotation-text-row rotation-bottom-text",
          style: { opacity: bottomTextVisible ? 1 : 0 },
        },
        React.createElement("div", {
          className: "rotation-text-content rotation-bottom-content",
          dangerouslySetInnerHTML: bottomTextHtml
            ? { __html: handleComma(bottomTextHtml) }
            : undefined,
        }),
      ),
    ),
  );
};
