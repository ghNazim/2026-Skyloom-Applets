const QuestionPanel = ({ html, showPurpleHighlight = false }) => {
  const { useState, useEffect } = React;
  const content = html || "";
  const [highlightsVisible, setHighlightsVisible] = useState(false);

  useEffect(() => {
    setHighlightsVisible(false);
    if (!showPurpleHighlight) return undefined;
    const t = setTimeout(() => setHighlightsVisible(true), 80);
    return () => clearTimeout(t);
  }, [content, showPurpleHighlight]);

  const processedHtml = content.replace(
    /class="purple-bg"/g,
    'class="purple-bg' + (highlightsVisible ? " is-visible" : "") + '"',
  );

  return React.createElement(
    "div",
    { className: "question-panel" },
    React.createElement("h2", {
      dangerouslySetInnerHTML: { __html: processedHtml },
    }),
  );
};
