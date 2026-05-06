const QuestionPanel = ({ text, questionKey }) => {
  return React.createElement(
    "div",
    { className: "question-panel" },
    React.createElement(
      "h2",
      {
        key: questionKey != null ? String(questionKey) : text || "q",
        className: "question-panel-text",
        dangerouslySetInnerHTML: { __html: text || "" },
      }
    )
  );
};
