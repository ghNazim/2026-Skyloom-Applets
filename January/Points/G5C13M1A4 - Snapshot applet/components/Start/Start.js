const Start = ({ onButtonClick }) => {
  return React.createElement(
    "div",
    { className: "start-panel" },
    React.createElement(
      "div",
      { className: "start-content" },
      React.createElement(
        "div",
        {
          className: "start-text",
          dangerouslySetInnerHTML: { __html: APP_DATA.start.text },
        }
      )
    ),
    React.createElement(Button, {
      text: APP_DATA.start.buttonText,
      onClick: onButtonClick,
      className: "start-button",
    })
  );
};

