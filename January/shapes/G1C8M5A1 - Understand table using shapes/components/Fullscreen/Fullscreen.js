const Button = ({ onClick, text, className, disabled = false }) => {
  return React.createElement(
    "button",
    {
      className: `btn ${className || ""}`,
      onClick: disabled ? undefined : onClick,
      disabled: disabled,
    },
    text
  );
};
const Fullscreen = ({ text, buttonText, onButtonClick, heading, left = false }) => {
  return React.createElement(
    "div",
    { className: "fullscreen-panel" },
    React.createElement("p", { className: "heading" }, heading),
    React.createElement("p", {
      className: "fullscreen-content " + (left ? "left" : "center"),
      dangerouslySetInnerHTML: { __html: text },
    }),
    React.createElement(Button, {
      text: buttonText,
      onClick: onButtonClick,
      className: "fullscreen-button",
    })
  );
};
