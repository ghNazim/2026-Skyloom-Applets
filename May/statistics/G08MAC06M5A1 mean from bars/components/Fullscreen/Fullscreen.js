const Button = ({ onClick, text, className, buttonRef }) => {
  return React.createElement(
    "button",
    {
      ref: buttonRef,
      className: "btn " + (className || ""),
      onClick: onClick,
    },
    text
  );
};

const Fullscreen = ({
  text,
  buttonText,
  onButtonClick,
  heading,
  buttonRef,
  leftGraph,
  barGraphProps,
}) => {
  const e = React.createElement;

  var graphProps = barGraphProps || {
    highlightBarIndex: null,
    lowOpacityAll: false,
    highlightXLabels: false,
    feedbackText: null,
    barValueBoxes: null,
    wrongLineY: null,
    showCorrectLine: false,
    meanValue: null,
    meanLineVisible: false,
    meanDrawProgress: 0,
    meanLabelRef: null,
  };

  if (leftGraph) {
    return e(
      "div",
      { className: "fullscreen-panel fullscreen-panel-split" },
      e("p", { className: "heading" }, heading),
      e(
        "div",
        { className: "fullscreen-split" },
        e(
          "div",
          { className: "fullscreen-split-left" },
          e(BarGraph, graphProps)
        ),
        e(
          "div",
          { className: "fullscreen-split-right" },
          e("p", { dangerouslySetInnerHTML: { __html: text } }),
          e(Button, {
            text: buttonText,
            onClick: onButtonClick,
            className: "start-button-inline",
            buttonRef: buttonRef,
          })
        )
      )
    );
  }

  return e(
    "div",
    { className: "fullscreen-panel" },
    e("p", { className: "heading" }, heading),
    e(
      "div",
      { className: "fullscreen-content-wrap" },
      e("p", {
        className: "fullscreen-content center",
        dangerouslySetInnerHTML: { __html: text },
      })
    ),
    e(Button, {
      text: buttonText,
      onClick: onButtonClick,
      className: "fullscreen-button",
      buttonRef: buttonRef,
    })
  );
};
