const Final = ({ onButtonClick }) => {
  return React.createElement(
    "div",
    { className: "final-panel" },
    React.createElement(
      "div",
      { className: "final-content" },
      React.createElement(
        "div",
        { className: "final-text" },
        APP_DATA.final.text
      )
    ),
    React.createElement(Button, {
      text: APP_DATA.final.buttonText,
      onClick: onButtonClick,
      className: "final-button",
    })
  );
};
