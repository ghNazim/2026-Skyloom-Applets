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
    React.createElement(
      "div",
      { className: "image-4" },
      [0, 1, 2, 3].map((index) =>
        React.createElement(
          "div",
          { key: index,  },
          React.createElement("img", { src: `assets/${index}.png` }),
          React.createElement("p", { className: "image-label" }, APP_DATA.types[index])
        )
      )
    ),
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
