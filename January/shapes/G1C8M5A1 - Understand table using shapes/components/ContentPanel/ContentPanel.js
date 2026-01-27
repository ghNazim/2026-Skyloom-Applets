const ContentPanel = ({ mainVisualLeft, mainVisualRight, buttonText, onButtonClick, bottomText }) => {
  return React.createElement(
    "div",
    { className: "content-panel" },
    // Main Row
    React.createElement(
      "div",
      { className: "main-row" },
      // Main Visual
      React.createElement(
        "div",
        { className: "main-visual" },
        React.createElement(
          "div",
          { className: "main-visual-left" },
          mainVisualLeft
        ),
        React.createElement(
          "div",
          { className: "main-visual-right" },
          mainVisualRight
        )
      ),
      // Main Button
      React.createElement(
        "div",
        { className: "main-button" },
        React.createElement(Button, {
          text: buttonText,
          onClick: onButtonClick,
          className: "",
        })
      )
    ),
    // Text Row
    React.createElement(
      "div",
      { className: "text-row" },
      bottomText
    )
  );
};
