const QuestionPanel = ({ text, step }) => {
  return React.createElement(
    "div",
    { className: "question-panel" },
    React.createElement("h2", {
      dangerouslySetInnerHTML: { __html: text },
    })
  );
};
