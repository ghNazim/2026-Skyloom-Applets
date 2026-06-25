const McqPanel = ({
  options,
  selectedIndex,
  resultState,
  showFeedback,
  feedbackText,
  feedbackType,
  disabled,
  onSelect,
}) => {
  if (showFeedback && feedbackText) {
    return React.createElement(
      "div",
      { className: "mcq-panel mcq-panel-feedback-only" },
      React.createElement(
        "div",
        {
          className:
            "mcq-feedback-box" +
            (feedbackType === "correct" ? " is-correct" : " is-wrong"),
        },
        React.createElement("div", {
          className: "mcq-feedback-text",
          dangerouslySetInnerHTML: { __html: handleComma(feedbackText) },
        }),
      ),
    );
  }

  return React.createElement(
    "div",
    { className: "mcq-panel" },
    React.createElement(
      "div",
      { className: "mcq-panel-options mcq-options-column" },
      options.map((opt, index) => {
        let cls = "mcq-option";
        if (selectedIndex === index && resultState === "wrong") cls += " wrong";
        if (selectedIndex === index && resultState === "correct") cls += " correct";
        const isDisabled =
          disabled || resultState !== null || selectedIndex !== null;
        return React.createElement(
          "button",
          {
            key: index,
            className: cls,
            disabled: isDisabled,
            onClick: () => {
              if (!isDisabled && typeof onSelect === "function") onSelect(index);
            },
          },
          opt,
        );
      }),
    ),
  );
};
