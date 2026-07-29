const QuestionPanel = ({ text, visible = true }) => {
  return React.createElement(
    "div",
    { className: "question-panel" + (visible ? "" : " is-hidden") },
    React.createElement("h2", {
      dangerouslySetInnerHTML: { __html: text || "" },
    }),
  );
};
