const RightPanel = ({
  visible,
  textHtml,
  mcq,
  mcqWrongIndices,
  mcqCorrectIndex,
  mcqAnswered,
  onMcqSelect,
}) => {
  return React.createElement(
    "div",
    {
      className:
        "dilation-right-panel" + (visible ? " is-visible" : " is-hidden"),
    },
    visible
      ? React.createElement(
          "div",
          { className: "dilation-right-panel-inner" },
          mcq
            ? React.createElement(McqPanel, {
                mcq: mcq,
                wrongIndices: mcqWrongIndices || [],
                correctIndex: mcqCorrectIndex,
                answered: mcqAnswered,
                onSelect: onMcqSelect,
              })
            : textHtml
              ? React.createElement("div", {
                  className: "dilation-right-text",
                  dangerouslySetInnerHTML: { __html: textHtml },
                })
              : null,
        )
      : null,
  );
};
