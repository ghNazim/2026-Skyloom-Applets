const McqPanel = ({
  title,
  options,
  selectedIndex,
  resultState,
  showFeedback,
  feedbackText,
  feedbackType,
  disabled,
  onSelect,
}) => {
  const isCorrect = resultState === "correct";

  return React.createElement(
    "div",
    { className: "mcq-panel" },
    title
      ? React.createElement("div", {
          className: "mcq-title",
          dangerouslySetInnerHTML: { __html: handleComma(title) },
        })
      : null,
    React.createElement(
      "div",
      { className: "mcq-panel-options mcq-options-column" },
      options.map((opt, index) => {
        let cls = "mcq-option";
        if (selectedIndex === index && resultState === "wrong") cls += " wrong";
        if (selectedIndex === index && resultState === "correct") cls += " correct";
        const isDisabled = disabled || isCorrect;
        return React.createElement("button", {
          key: index,
          type: "button",
          className: cls,
          disabled: isDisabled,
          onClick: () => {
            if (!isDisabled && typeof onSelect === "function") onSelect(index);
          },
          dangerouslySetInnerHTML: { __html: handleComma(opt) },
        });
      }),
    ),
    React.createElement(
      "div",
      {
        className:
          "mcq-feedback-slot" +
          (showFeedback ? " is-visible" : "") +
          (feedbackType === "correct" ? " is-correct" : "") +
          (feedbackType === "wrong" ? " is-wrong" : ""),
      },
      React.createElement(
        "div",
        { className: "mcq-feedback-label" },
        APP_DATA.labels.feedback,
      ),
      React.createElement("div", {
        className: "mcq-feedback-text",
        dangerouslySetInnerHTML: { __html: handleComma(feedbackText || "") },
      }),
    ),
  );
};
