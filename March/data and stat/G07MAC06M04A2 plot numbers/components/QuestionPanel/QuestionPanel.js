const QuestionPanel = ({ text, stepNumber }) => {
  return React.createElement(
    "div",
    { className: "question-panel" },
    React.createElement("div", { className: "question-step-number" }, stepNumber),
    React.createElement("h2", {
      dangerouslySetInnerHTML: { __html: text || "" },
    })
  );
};
