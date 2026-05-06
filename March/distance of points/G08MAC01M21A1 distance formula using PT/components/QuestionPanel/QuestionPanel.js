const QuestionPanel = ({ text, className = "" }) => {
  const processed =
    typeof handleComma === "function" ? handleComma(text || "") : text || "";

  return React.createElement(
    "div",
    { className: "question-panel " + className },
    React.createElement("h2", {
      dangerouslySetInnerHTML: { __html: processed },
    }),
  );
};
