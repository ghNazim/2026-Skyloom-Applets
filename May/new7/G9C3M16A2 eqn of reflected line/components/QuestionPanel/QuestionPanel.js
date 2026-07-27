const QuestionPanel = ({ html, activeHighlightId = null, collapsed = false }) => {
  const content = html || "";

  const processedHtml = formatMathVariablesInHtml(
    content.replace(
      /id="(highlight-[^"]+)" class="purple-bg([^"]*)"/g,
      (match, id, extra) => {
        const visible = activeHighlightId === id;
        return (
          'id="' +
          id +
          '" class="purple-bg' +
          (extra || "") +
          (visible ? " is-visible" : "") +
          '"'
        );
      },
    ),
  );

  return React.createElement(
    "div",
    { className: "question-panel" + (collapsed ? " is-collapsed" : "") },
    React.createElement("h2", {
      dangerouslySetInnerHTML: { __html: processedHtml },
    }),
  );
};
