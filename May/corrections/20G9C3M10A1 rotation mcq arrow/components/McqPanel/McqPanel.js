const McqPanel = ({
  options,
  selectedIndex,
  selectedIndices,
  resultState,
  showFeedback,
  feedbackText,
  feedbackType,
  disabled,
  multiAnswer,
  onSelect,
}) => {
  const selectedSet = multiAnswer
    ? new Set(selectedIndices || [])
    : new Set(selectedIndex !== null && selectedIndex !== undefined ? [selectedIndex] : []);

  const isOptionDisabled = (index) => {
    if (disabled) return true;
    if (multiAnswer) {
      if (selectedSet.has(index)) return true;
      return false;
    }
    return false;
  };

  const getOptionClass = (index) => {
    let cls = "mcq-option";
    if (!multiAnswer) {
      if (selectedIndex === index && resultState === "wrong" && !disabled) {
        cls += " wrong";
      }
      if (selectedIndex === index && resultState === "correct") {
        cls += " correct";
      }
      return cls;
    }
    if (selectedSet.has(index)) {
      cls += " correct";
    }
    if (resultState === "wrong" && selectedIndex === index) {
      cls += " wrong";
    }
    return cls;
  };

  return React.createElement(
    "div",
    { className: "mcq-panel" },
    React.createElement(
      "div",
      { className: "mcq-panel-options mcq-options-grid" },
      options.map((opt, index) => {
        const optionDisabled = isOptionDisabled(index);
        return React.createElement(
          "button",
          {
            key: index,
            className: getOptionClass(index),
            disabled: optionDisabled,
            onClick: () => {
              if (!optionDisabled && typeof onSelect === "function") onSelect(index);
            },
          },
          React.createElement("span", {
            dangerouslySetInnerHTML: { __html: handleComma(opt) },
          }),
        );
      }),
    ),
    React.createElement(
      "div",
      {
        className:
          "mcq-feedback-box" +
          (showFeedback && feedbackText ? " is-visible" : "") +
          (feedbackType === "correct"
            ? " is-correct"
            : feedbackType === "middle"
              ? " is-middle"
              : feedbackType === "wrong"
                ? " is-wrong"
                : ""),
      },
      feedbackText
        ? React.createElement("div", {
            className: "mcq-feedback-text",
            dangerouslySetInnerHTML: { __html: handleComma(feedbackText) },
          })
        : null,
    ),
  );
};
