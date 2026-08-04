const QuestionPanel = ({ text, step, fadeIn }) => {
  const hiddenUntilFade = step === 4 && !fadeIn;
  return React.createElement(
    "div",
    {
      className: "question-panel" + (fadeIn ? " panel-fade-in" : ""),
      style: hiddenUntilFade ? { opacity: 0 } : undefined,
    },
    React.createElement("h2", {
      dangerouslySetInnerHTML: { __html: text },
    }),
  );
};
