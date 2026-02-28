/**
 * ComprehendQuestion: shows the full question text with optional highlights.
 * highlight can be a string or array of strings (all highlighted with same class).
 * highlightClass overrides the default highlight CSS class.
 */
const ComprehendQuestion = ({ questionText, highlight, highlightClass }) => {
  const getHighlightedHtml = () => {
    if (!questionText) return "";
    let text = questionText;
    const cls = highlightClass || "comprehend-question-highlight";
    const stringsToHighlight = Array.isArray(highlight) ? highlight : highlight ? [highlight] : [];
    stringsToHighlight.forEach((str) => {
      if (str && text.includes(str)) {
        const span = `<span class="${cls}">${str}</span>`;
        text = text.split(str).join(span);
      }
    });
    return text;
  };

  return React.createElement(
    "div",
    { className: "comprehend-question-panel" },
    React.createElement("p", {
      className: "comprehend-question-text",
      dangerouslySetInnerHTML: { __html: replaceRoot3(getHighlightedHtml()) },
    })
  );
};
