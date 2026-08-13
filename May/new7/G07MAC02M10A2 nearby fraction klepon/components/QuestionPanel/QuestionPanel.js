const QuestionPanel = ({ text, step, fadeIn, hidden }) => {
  return React.createElement(
    "div",
    {
      id: "question-panel",
      className: "question-panel" + (fadeIn ? " panel-fade-in" : ""),
      style: hidden ? { opacity: 0 } : undefined,
    },
    React.createElement("h2", {
      dangerouslySetInnerHTML: { __html: text },
    }),
  );
};
