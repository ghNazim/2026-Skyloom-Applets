const QuestionPanel = ({ text, fadeIn }) => {
  return React.createElement(
    "div",
    {
      className: "question-panel" + (fadeIn ? " panel-fade-in" : ""),
    },
    React.createElement("h2", {
      dangerouslySetInnerHTML: { __html: text },
    }),
  );
};
