const QuestionPanel = ({ text, step }) => {
  const { useEffect, useState } = React;

  const [highlightedText, setHighlightedText] = useState(text);

  useEffect(() => {
    if (step === 1 && text && APP_DATA.highlights) {
      // Apply highlighting for step 1
      let highlighted = text;

      // Get highlight texts from data.js
      const purpleHighlightText = APP_DATA.highlights.purpleHighlight;
      const orangeHighlightText = APP_DATA.highlights.orangeHighlight;

      // Escape special regex characters in the text
      const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      // Highlight purple (like shopA)
      const purpleHighlight = `<span class="question-highlight-purple">${purpleHighlightText}</span>`;

      // Highlight orange (like shopB)
      const orangeHighlight = `<span class="question-highlight-orange">${orangeHighlightText}</span>`;

      // Replace text with highlighted versions (escape regex special chars)
      highlighted = highlighted.replace(
        new RegExp(escapeRegex(purpleHighlightText), "g"),
        purpleHighlight
      );
      highlighted = highlighted.replace(
        new RegExp(escapeRegex(orangeHighlightText), "g"),
        orangeHighlight
      );

      setHighlightedText(highlighted);
    } else {
      setHighlightedText(text);
    }
  }, [text, step]);

  return React.createElement(
    "div",
    { className: "question-panel" },
    React.createElement("h2", {
      dangerouslySetInnerHTML: { __html: handleComma(highlightedText) },
    })
  );
};
