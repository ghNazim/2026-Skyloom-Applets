const CompleteButton = React.forwardRef(({ onClick, text, className }, ref) => {
  return React.createElement(
    "button",
    {
      ref: ref,
      className: `btn ${className || ""}`,
      onClick: onClick,
    },
    text
  );
});

const Complete = ({ onStartOver, buttonRef }) => {
  var d = APP_DATA.complete;

  return React.createElement(
    "div",
    { className: "complete-panel" },
    React.createElement("p", { className: "complete-heading" }, d.heading),
    React.createElement("div", {
      className: "complete-card",
      dangerouslySetInnerHTML: { __html: d.boxedHtml },
    }),
    React.createElement("p", { className: "complete-instruction" }, d.instructionText),
    React.createElement(CompleteButton, {
      ref: buttonRef,
      text: d.buttonText,
      onClick: onStartOver,
      className: "complete-button",
    })
  );
};
