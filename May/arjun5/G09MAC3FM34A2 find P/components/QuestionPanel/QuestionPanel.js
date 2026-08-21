const HIGHLIGHT_CLASS_NAMES = ["purple-bg", "cyan-bg", "orange-bg"];

const QuestionPanel = ({ html, visibleHighlights = [], compact = false }) => {
  let processedHtml = html || "";

  HIGHLIGHT_CLASS_NAMES.forEach((className) => {
    const re = new RegExp(
      'id="(highlight-[^"]+)" class="' + className + '([^"]*)"',
      "g",
    );

    processedHtml = processedHtml.replace(re, (match, id, extra) => {
      const visible = visibleHighlights.indexOf(id) !== -1;
      return (
        'id="' +
        id +
        '" class="' +
        className +
        (extra || "") +
        (visible ? " is-visible" : "") +
        '"'
      );
    });
  });

  return React.createElement(
    "div",
    { className: "question-panel" + (compact ? " is-compact" : "") },
    React.createElement("h2", {
      dangerouslySetInnerHTML: { __html: processedHtml },
    }),
  );
};
