const ContentPanel = ({ mainVisualLeft, mainVisualRight, buttonText, onButtonClick, bottomText, buttonRef = null, timelineMode = false }) => {
  const showButton = !timelineMode && buttonText;
  return React.createElement(
    "div",
    { className: "content-panel" },
    // Main Row
    React.createElement(
      "div",
      { className: "main-row" + (timelineMode ? " timeline-main" : "") },
      // Main Visual
      React.createElement(
        "div",
        { className: "main-visual" + (mainVisualRight ? " with-right" : "") + (timelineMode ? " timeline-visual" : "") },
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
      // Main Button (hidden in timeline mode)
      showButton && React.createElement(
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
    // Text Row (hidden in timeline mode - Navigation is outside)
    !timelineMode && React.createElement(
      "div",
      { className: "text-row" },
      bottomText
    )
  );
};
