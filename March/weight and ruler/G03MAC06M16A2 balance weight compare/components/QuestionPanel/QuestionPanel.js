const QuestionPanel = ({ text }) => {
  const display = text ? handleComma(text) : "";

  return React.createElement(
    "div",
    { className: "question-panel" },
    React.createElement("h2", {
      dangerouslySetInnerHTML: { __html: display },
    }),
  );
};
