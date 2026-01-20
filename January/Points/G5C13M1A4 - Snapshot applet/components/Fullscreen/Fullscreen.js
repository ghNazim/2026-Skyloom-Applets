const Button = ({ onClick, text, className }) => {
  return React.createElement(
    "button",
    {
      className: `btn ${className || ""}`,
      onClick: onClick,
    },
    text
  );
};
const Fullscreen = ({ text, buttonText, onButtonClick, heading }) => {
  return React.createElement(
    "div",
    { className: "fullscreen-panel" },
    React.createElement("p", { className: "heading" }, heading),
    // Row with image and boxed text
    React.createElement(
      "div",
      { className: "fullscreen-row" },
      // Left half: image
      React.createElement(
        "div",
        { className: "fullscreen-left" },
        React.createElement("img", {
          src: "assets/question2x.svg",
          alt: "Triangle illustration",
          className: "fullscreen-image",
        })
      ),
      // Right half: boxed text
      React.createElement(
        "div",
        { className: "fullscreen-right" },
        React.createElement(
          "div",
          { className: "identity-box" },
          "sin² θ + cos² θ = 1"
        )
      )
    ),
    // Fullscreen content text
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
