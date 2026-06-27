const QuestionPanel = ({ text, html, animateIn = false }) => {
  const { useState, useEffect, useRef } = React;
  const content = html || text || "";
  const [panelVisible, setPanelVisible] = useState(!animateIn);
  const [highlightsVisible, setHighlightsVisible] = useState(false);
  const prevContentRef = useRef(content);

  useEffect(() => {
    if (!animateIn) {
      setPanelVisible(true);
      return;
    }
    setPanelVisible(false);
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPanelVisible(true));
    });
    return () => cancelAnimationFrame(t);
  }, [animateIn]);

  useEffect(() => {
    setHighlightsVisible(false);
    const t = setTimeout(() => setHighlightsVisible(true), 80);
    prevContentRef.current = content;
    return () => clearTimeout(t);
  }, [content]);

  const processedHtml = content.replace(
    /class="purple-bg"/g,
    'class="purple-bg' + (highlightsVisible ? " is-visible" : "") + '"',
  );

  return React.createElement(
    "div",
    {
      className:
        "question-panel" + (panelVisible ? " is-visible" : " is-entering"),
    },
    React.createElement("h2", {
      dangerouslySetInnerHTML: { __html: processedHtml },
    }),
  );
};
