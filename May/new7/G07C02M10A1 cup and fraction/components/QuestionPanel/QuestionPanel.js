const QuestionPanel = ({ text, subText, fadeIn }) => {
  return React.createElement(
    "div",
    { className: "question-panel" + (fadeIn ? " panel-fade-in" : "") },
    React.createElement(
      "div",
      { className: "question-panel-lines" },
      React.createElement("h2", {
        dangerouslySetInnerHTML: { __html: text || "" },
      }),
      subText
        ? React.createElement("h3", {
            className: "question-sub",
            dangerouslySetInnerHTML: { __html: subText },
          })
        : null,
    ),
  );
};
