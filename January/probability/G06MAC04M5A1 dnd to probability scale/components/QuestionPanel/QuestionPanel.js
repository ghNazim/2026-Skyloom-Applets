const QuestionPanel = ({ text, step }) => {
  const { useEffect, useState } = React;

  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    // Just use the text as-is since it already contains HTML markup
    setDisplayText(text);
  }, [text, step]);

  return React.createElement(
    "div",
    { className: "question-panel" },
    React.createElement("h2", {
      dangerouslySetInnerHTML: { __html: displayText },
    })
  );
};
