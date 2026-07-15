const Step2Canvas = (props) => {
  const {
    activeProperty,
    exploredProperties,
    buttonsDisabled,
    onSelectProperty,
    headerHtml,
    graphProps,
  } = props;

  return React.createElement(
    "div",
    { className: "step2-canvas-container" },
    React.createElement(PropertyPanel, {
      activeProperty: activeProperty,
      exploredProperties: exploredProperties,
      disabled: buttonsDisabled,
      onSelect: onSelectProperty,
    }),
    React.createElement(
      "div",
      { className: "step2-right-column" },
      React.createElement("div", {
        className: "header-div" + (headerHtml ? " filled" : ""),
        dangerouslySetInnerHTML: headerHtml
          ? { __html: renderAppTextHtml(handleComma(headerHtml)) }
          : undefined,
      }),
      React.createElement(
        "div",
        { className: "step2-graph-panel translation-graph-panel" },
        React.createElement(TranslationPropertiesGraph, graphProps),
      ),
    ),
  );
};
