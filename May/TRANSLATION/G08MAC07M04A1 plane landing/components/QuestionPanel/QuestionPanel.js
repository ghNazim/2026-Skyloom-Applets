const QuestionPanel = ({ text, collapsed }) => {
  return React.createElement(
    "div",
    {
      className:
        "question-panel" + (collapsed ? " question-panel--collapsed" : ""),
    },
    React.createElement("h2", {
      dangerouslySetInnerHTML: { __html: text || "" },
    })
  );
};
