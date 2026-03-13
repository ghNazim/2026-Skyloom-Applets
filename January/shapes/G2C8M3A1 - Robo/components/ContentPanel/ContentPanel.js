const ContentPanel = ({ mainVisualLeft, mainVisualRight, buttonText, onButtonClick, bottomText, buttonRef = null }) => {
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
        { className: "main-visual" + (mainVisualRight ? " with-right" : "") },
        React.createElement(
          "div",
          { className: "main-visual-left" },
          mainVisualLeft
        ),
        mainVisualRight && React.createElement(
          "div",
          { className: "main-visual-right" },
          React.createElement(
            "div",
            { className: "main-visual-right-inner" },
            mainVisualRight
          )
        )
      ),
      // Main Button
      React.createElement(
        "div",
        { className: "main-button" },
        React.createElement(Button, {
          ref: buttonRef,
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
