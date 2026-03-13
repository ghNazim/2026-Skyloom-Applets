const Button = React.forwardRef(({ onClick, text, className, disabled = false }, ref) => {
  return React.createElement(
    "button",
    {
      ref: ref,
      className: `btn ${className || ""}`,
      onClick: disabled ? undefined : onClick,
      disabled: disabled,
    },
    text
  );
});
const Fullscreen = ({ text, buttonText, onButtonClick, heading, left = false, showCharacter = false, characterImage = null, buttonRef = null }) => {
  return React.createElement(
    "div",
    { className: `fullscreen-panel ${showCharacter ? 'with-character' : ''}` },
    showCharacter && characterImage && React.createElement("img", {
      src: `assets/${characterImage}`,
      alt: "Character",
      className: "fullscreen-character-image",
    }),
    React.createElement("p", { className: "heading" }, heading),
    React.createElement("p", {
      className: "fullscreen-content " + (left ? "left" : showCharacter ? "right" : "center"),
      dangerouslySetInnerHTML: { __html: text },
    }),
    React.createElement(Button, {
      ref: buttonRef,
      text: buttonText,
      onClick: onButtonClick,
      className: "fullscreen-button",
    })
  );
};
