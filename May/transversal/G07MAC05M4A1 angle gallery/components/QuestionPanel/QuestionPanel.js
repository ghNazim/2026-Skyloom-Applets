const QuestionPanel = ({ text, step }) => {
  const { useMemo } = React;

  const highlightedText = useMemo(() => {
    if (step === 1 && text && APP_DATA.highlights) {
      let highlighted = text;
      const purpleHighlightText = APP_DATA.highlights.purpleHighlight;
      const orangeHighlightText = APP_DATA.highlights.orangeHighlight;
      const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const purpleHighlight = `<span class="question-highlight-purple">${purpleHighlightText}</span>`;
      const orangeHighlight = `<span class="question-highlight-orange">${orangeHighlightText}</span>`;
      highlighted = highlighted.replace(
        new RegExp(escapeRegex(purpleHighlightText), "g"),
        purpleHighlight,
      );
      highlighted = highlighted.replace(
        new RegExp(escapeRegex(orangeHighlightText), "g"),
        orangeHighlight,
      );
      return highlighted;
    }
    return text;
  }, [text, step]);

  return React.createElement(
    "div",
    { className: "question-panel" },
    React.createElement("h2", {
      dangerouslySetInnerHTML: { __html: highlightedText },
    }),
  );
};
