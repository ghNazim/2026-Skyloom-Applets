const HIGHLIGHT_CLASS_NAMES = ["purple-bg", "orange-bg"];

const QuestionPanel = ({ html, visibleHighlights = [] }) => {
  const content = html || "";

  let processedHtml = content;
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
    { className: "question-panel" },
    React.createElement("h2", {
      dangerouslySetInnerHTML: { __html: processedHtml },
    }),
  );
};
