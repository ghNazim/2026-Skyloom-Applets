const Button = React.forwardRef(({ onClick, text, className }, ref) => {
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
const Fullscreen = ({ text, buttonText, onButtonClick, heading, buttonRef }) => {
  return React.createElement(
    "div",
    { className: "fullscreen-panel" },
    React.createElement("p", { className: "heading" }, heading),
    React.createElement(Scalebg, null),
    React.createElement(
      "div",
      { className: "fullscreen-lower" },
      React.createElement("p", {
        className: "fullscreen-content",
        dangerouslySetInnerHTML: { __html: text },
      }),
      React.createElement(Button, {
        ref: buttonRef,
        text: buttonText,
        onClick: onButtonClick,
        className: "fullscreen-button",
      })
    )
  );
};
