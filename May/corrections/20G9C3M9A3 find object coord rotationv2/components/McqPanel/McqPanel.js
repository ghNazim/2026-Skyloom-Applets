const McqPanel = ({
  title,
  options,
  layout = "column",
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
    title
      ? React.createElement(
          "div",
          { className: "mcq-panel-title" },
          title,
        )
      : null,
    React.createElement(
      "div",
      {
        className:
          "mcq-panel-options" +
          (layout === "row" ? " mcq-options-row" : " mcq-options-column"),
      },
      options.map((opt, index) => {
        let cls = "mcq-option";
        const isDisabled = disabled || selectedIndex !== null;
        const showResult = selectedIndex === index && resultState;
        if (showResult && resultState === "wrong") cls += " wrong";
        if (showResult && resultState === "correct") cls += " correct";
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
