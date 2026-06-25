const ActivityCompleted = ({ onStartOver }) => {
  const f = APP_DATA.formula;

  const renderFormulaBox = (parts) =>
    React.createElement(
      "div",
      { className: "summary-formula-box" },
      parts.map((part, index) =>
        React.createElement(
          "span",
          { key: index, className: part.className || "summary-op" },
          part.text,
        ),
      ),
    );

  return React.createElement(
    "div",
    { className: "activity-completed-panel" },
    React.createElement(
      "h1",
      { className: "activity-completed-heading" },
      APP_DATA.completed.heading,
    ),
    React.createElement(
      "div",
      { className: "activity-completed-formulas" },
      renderFormulaBox([
        { text: f.imageCoordinates, className: "summary-term color-image" },
        { text: "=" },
        { text: f.preimageCoordinates, className: "summary-term color-preimage" },
        { text: "+" },
        { text: f.translation, className: "summary-term color-translation" },
      ]),
      renderFormulaBox([
        { text: f.translation, className: "summary-term color-translation" },
        { text: "=" },
        { text: f.imageCoordinates, className: "summary-term color-image" },
        { text: "−" },
        { text: f.preimageCoordinates, className: "summary-term color-preimage" },
      ]),
      renderFormulaBox([
        { text: f.preimageCoordinates, className: "summary-term color-preimage" },
        { text: "=" },
        { text: f.imageCoordinates, className: "summary-term color-image" },
        { text: "−" },
        { text: f.translation, className: "summary-term color-translation" },
      ]),
    ),
    React.createElement(
      "button",
      {
        className: "btn activity-completed-button",
        onClick: onStartOver,
        id: "start-over-button",
      },
      APP_DATA.completed.startOver,
    ),
  );
};
