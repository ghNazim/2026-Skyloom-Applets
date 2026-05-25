const QuestionPanel = ({ text, step }) => {
  const { useEffect, useState } = React;

  const [highlightedText, setHighlightedText] = useState(text);

  useEffect(() => {
    setHighlightedText(text);
  }, [text, step]);

  return React.createElement(
    "div",
    { className: "question-panel" },
    React.createElement("h2", {
      dangerouslySetInnerHTML: { __html: highlightedText },
    })
  );
};
