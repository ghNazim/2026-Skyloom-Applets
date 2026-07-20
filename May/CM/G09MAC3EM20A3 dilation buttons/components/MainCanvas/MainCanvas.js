const MainCanvas = (props) => {
  const {
    activeProperty,
    exploredProperties,
    buttonsDisabled,
    onSelectProperty,
    graphProps,
  } = props;

  return React.createElement(
    "div",
    { className: "main-canvas-container properties-layout" },
    React.createElement(PropertyPanel, {
      activeProperty: activeProperty,
      exploredProperties: exploredProperties,
      disabled: buttonsDisabled,
      onSelect: onSelectProperty,
    }),
    React.createElement(
      "div",
      { className: "graph-right-panel" },
      React.createElement(DilationGraph, graphProps),
    ),
  );
};
