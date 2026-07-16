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
  feedbackCompact,
  alignTop,
  onSelect,
}) => {
  return React.createElement(
    "div",
    { className: "mcq-panel" + (alignTop ? " is-align-top" : "") },
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
        const showResult = selectedIndex === index && resultState;
        if (showResult && resultState === "wrong") cls += " wrong";
        if (showResult && resultState === "correct") cls += " correct";
        return React.createElement(
          "button",
          {
            key: index,
            className: cls,
            disabled: disabled,
            onClick: () => {
              if (!disabled && typeof onSelect === "function") onSelect(index);
            },
          },
          opt,
        );
      }),
    ),
    showFeedback && feedbackText
      ? React.createElement(
          "div",
          {
            className:
              "mcq-feedback-box is-inline" +
              (feedbackType === "correct" ? " is-correct" : " is-wrong") +
              (feedbackCompact ? " is-compact" : ""),
          },
          React.createElement("div", {
            className: "mcq-feedback-text",
            dangerouslySetInnerHTML: { __html: handleComma(feedbackText) },
          }),
        )
      : null,
  );
};
