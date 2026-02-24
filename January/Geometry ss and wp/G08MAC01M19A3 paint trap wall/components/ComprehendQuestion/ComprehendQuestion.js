/**
 * ComprehendQuestion: shows the full question text with optional highlights.
 * highlight can be a string or array of strings (all highlighted with same class).
 */
const ComprehendQuestion = ({ questionText, highlight }) => {
  const getHighlightedHtml = () => {
    if (!questionText) return "";
    let text = questionText;
    const stringsToHighlight = Array.isArray(highlight) ? highlight : highlight ? [highlight] : [];
    stringsToHighlight.forEach((str) => {
      if (str && text.includes(str)) {
        const span = `<span class="comprehend-question-highlight">${str}</span>`;
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
      dangerouslySetInnerHTML: { __html: getHighlightedHtml() },
    })
  );
};
