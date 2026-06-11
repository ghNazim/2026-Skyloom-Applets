const QuestionPanel = ({ text }) => {
  const processedText =
    typeof handleComma === "function" ? handleComma(text) : text;

  return React.createElement(
    "div",
    { className: "question-panel" },
    React.createElement("h2", {
      dangerouslySetInnerHTML: { __html: processedText },
    })
  );
};
