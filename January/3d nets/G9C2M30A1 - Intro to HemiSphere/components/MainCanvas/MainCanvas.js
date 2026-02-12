const MainCanvas = ({
  sliceAction,
  labelMode,
  isAnimating,
  selectedButton,
  horizontalExplored,
  verticalExplored,
  onSlice,
  onAnimationComplete,
}) => {
  const bothExplored = horizontalExplored && verticalExplored;

  return React.createElement(
    "div",
    { className: "main-canvas-container" },

    // ==== Main Row (visual panel - full width) ====
    React.createElement(
      "div",
      { className: "main-row" },
      React.createElement(
        "div",
        { className: "visual-panel", style: { flex: 1 } },
        React.createElement(HemisphereVisual, {
          action: sliceAction,
          labelMode: labelMode,
          onAnimationComplete: onAnimationComplete,
        })
      )
    ),

    // ==== Action Row (buttons) ====
    React.createElement(
      "div",
      { className: "action-row" },
      React.createElement(
        "div",
        { className: "slice-buttons-container" },
        React.createElement(
          "button",
          {
            className:
              "btn slice-btn" +
              (selectedButton === "horizontal" ? " selected" : ""),
            onClick: () => onSlice("horizontal"),
            disabled:
              isAnimating ||
              selectedButton === "horizontal" ||
              bothExplored,
          },
          APP_DATA.buttons.sliceHorizontally
        ),
        React.createElement(
          "button",
          {
            className:
              "btn slice-btn" +
              (selectedButton === "vertical" ? " selected" : ""),
            onClick: () => onSlice("vertical"),
            disabled:
              isAnimating ||
              selectedButton === "vertical" ||
              bothExplored,
          },
          APP_DATA.buttons.sliceVertically
        )
      )
    )
  );
};
