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
const Fullscreen = ({ text, buttonText, onButtonClick, heading }) => {
  return React.createElement(
    "div",
    { className: "fullscreen-panel" },
    React.createElement("p", { className: "heading" }, heading),
    React.createElement("p", {
      className: "fullscreen-content",
      dangerouslySetInnerHTML: { __html: text },
    }),
    React.createElement(Button, {
      text: buttonText,
      onClick: onButtonClick,
      className: "fullscreen-button",
    })
  );
};
