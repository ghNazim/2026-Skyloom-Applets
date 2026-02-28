const QuestionPanelTop = ({ text }) => {
  return React.createElement(
    "div",
    { className: "question-panel-top" },
    React.createElement("h2", {
      dangerouslySetInnerHTML: { __html: text || "" },
    })
  );
};
