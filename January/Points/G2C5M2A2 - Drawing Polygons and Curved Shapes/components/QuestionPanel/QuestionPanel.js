const QuestionPanel = ({ text, text2 }) => {
  return React.createElement(
    "div",
    { className: "question-panel" },
    React.createElement("h2", {dangerouslySetInnerHTML: { __html: text }}),
    text2 && React.createElement("p", {dangerouslySetInnerHTML: { __html: text2 }})
  );
};
