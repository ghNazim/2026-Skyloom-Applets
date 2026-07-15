const Step1Canvas = (props) => {
  const { graphProps, textHtml } = props;

  return React.createElement(
    "div",
    { className: "step1-canvas-container" },
    React.createElement(
      "div",
      { className: "step1-visual-column" },
      React.createElement(
        "div",
        { className: "translation-graph-panel" },
        React.createElement(TranslationIntroGraph, graphProps),
      ),
    ),
    React.createElement(
      "div",
      { className: "step1-text-column" },
      React.createElement("div", {
        className: "step1-text-box" + (textHtml ? " filled" : ""),
        dangerouslySetInnerHTML: textHtml ? { __html: `<div>${textHtml}</div>` } : undefined,

      }),
    ),
  );
};
