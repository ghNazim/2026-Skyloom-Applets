

const FinalScreen = ({ text, onPrevious, onStartOver, heading, buttonTextPrevious, buttonTextStartOver }) => {
  return React.createElement(
    "div",
    { className: "final-screen-panel" },
    React.createElement("p", { className: "heading" }, heading),
    React.createElement("p", {
      className: "final-screen-content",
      dangerouslySetInnerHTML: { __html: text },
    }),
    // Previous button (bottom left)
    React.createElement(Button, {
      text: buttonTextPrevious,
      onClick: onPrevious,
      className: "final-screen-button final-screen-button-previous",
    }),
    // Start Over button (bottom right)
    React.createElement(Button, {
      text: buttonTextStartOver,
      onClick: onStartOver,
      className: "final-screen-button final-screen-button-start-over",
    })
  );
};
