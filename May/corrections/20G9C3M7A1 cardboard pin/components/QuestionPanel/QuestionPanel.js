const QuestionPanel = ({ text, step }) => {
  const { useEffect, useState, useRef } = React;

  const [displayedText, setDisplayedText] = useState(text);
  const [opacity, setOpacity] = useState(1);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (text === displayedText) return;
    setOpacity(0);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDisplayedText(text);
      setOpacity(1);
    }, 300);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text]);

  return React.createElement(
    "div",
    { className: "question-panel" + (step === 6 ? " question-panel-complete" : "") },
    React.createElement("h2", {
      style: { opacity, transition: "opacity 0.3s ease" },
      dangerouslySetInnerHTML: { __html: displayedText },
    })
  );
};
