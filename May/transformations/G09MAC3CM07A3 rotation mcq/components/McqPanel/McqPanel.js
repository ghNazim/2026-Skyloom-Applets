const McqPanel = ({
  mcq,
  wrongIndices,
  correctIndex,
  answered,
  feedbackText,
  feedbackType,
  onSelect,
}) => {
  if (!mcq) return null;

  const handleClick = (index) => {
    if (answered) return;
    if (wrongIndices.includes(index)) return;
    if (typeof onSelect === "function") onSelect(index);
  };

  const optionFlex = mcq.optionFlex === "row" ? "row" : "column";

  return React.createElement(
    "div",
    { className: "mcq-panel" },
    React.createElement("div", {
      className: "mcq-panel-title",
      dangerouslySetInnerHTML: { __html: handleComma(mcq.title) },
    }),
    React.createElement(
      "div",
      { className: "mcq-panel-options mcq-options-" + optionFlex },
      mcq.options.map((opt, index) => {
        let cls = "mcq-option";
        if (wrongIndices.includes(index)) cls += " wrong";
        if (answered && index === correctIndex) cls += " correct";
        if (answered && index !== correctIndex) cls += " dimmed";
        const disabled = answered || wrongIndices.includes(index);
        return React.createElement(
          "button",
          {
            key: index,
            className: cls,
            disabled: disabled,
            onClick: () => handleClick(index),
          },
          opt,
        );
      }),
    ),
    feedbackText
      ? React.createElement(
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
        )
      : null,
  );
};
