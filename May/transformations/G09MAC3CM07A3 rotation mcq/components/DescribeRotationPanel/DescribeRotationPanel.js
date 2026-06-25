const DescribeRotationPanel = ({
  direction,
  angle,
  showFeedback,
  feedbackText,
  feedbackType,
  directionEnabled,
  sliderEnabled,
  actionEnabled,
  actionLabel,
  locked,
  onDirectionSelect,
  onAngleChange,
  onAction,
}) => {
  const t = APP_DATA.step4;

  const handleDirection = (value) => {
    if (!directionEnabled || locked) return;
    if (typeof onDirectionSelect === "function") onDirectionSelect(value);
  };

  return React.createElement(
    "div",
    { className: "describe-rotation-panel" },
    React.createElement(
      "div",
      {
        className:
          "describe-feedback-slot" +
          (showFeedback ? " has-feedback" : "") +
          (feedbackType === "correct" ? " is-correct" : "") +
          (feedbackType === "wrong" ? " is-wrong" : ""),
      },
      showFeedback
        ? React.createElement("div", {
            className: "describe-feedback-text",
            dangerouslySetInnerHTML: { __html: handleComma(feedbackText) },
          })
        : null,
    ),
    React.createElement(
      "h2",
      { className: "describe-rotation-title" },
      t.title,
    ),
    React.createElement(
      "div",
      { className: "describe-rotation-card" },
      React.createElement(
        "div",
        { className: "describe-row" },
        React.createElement(
          "div",
          { className: "describe-row-label" },
          t.centerLabel,
        ),
        React.createElement("div", {
          className: "describe-row-value",
          dangerouslySetInnerHTML: { __html: t.centerValue },
        }),
      ),
      React.createElement(
        "div",
        { className: "describe-row" },
        React.createElement(
          "div",
          { className: "describe-row-label" },
          t.directionLabel,
        ),
        React.createElement(
          "div",
          { className: "describe-direction-btns" },
          React.createElement(
            "button",
            {
              type: "button",
              className:
                "describe-dir-btn" +
                (direction === "clockwise" ? " selected" : "") +
                (!directionEnabled || locked ? " disabled" : ""),
              disabled: !directionEnabled || locked,
              onClick: () => handleDirection("clockwise"),
            },
            t.clockwise,
          ),
          React.createElement(
            "button",
            {
              type: "button",
              className:
                "describe-dir-btn" +
                (direction === "anticlockwise" ? " selected" : "") +
                (!directionEnabled || locked ? " disabled" : ""),
              disabled: !directionEnabled || locked,
              onClick: () => handleDirection("anticlockwise"),
            },
            t.anticlockwise,
          ),
        ),
      ),
      React.createElement(
        "div",
        { className: "describe-row" },
        React.createElement(
          "div",
          { className: "describe-row-label" },
          t.angleLabel,
        ),
        React.createElement(AngleSlider, {
          value: angle,
          min: 0,
          max: 180,
          step: 15,
          disabled: !sliderEnabled || locked,
          onChange: onAngleChange,
        }),
      ),
    ),
    React.createElement(
      "button",
      {
        type: "button",
        className:
          "describe-action-btn" +
          (!actionEnabled || locked ? " disabled" : ""),
        disabled: !actionEnabled || locked,
        onClick: onAction,
      },
      actionLabel,
    ),
  );
};
