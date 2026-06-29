const QuestionPanel = ({ html, activeHighlightId = null }) => {
  const content = html || "";

  const processedHtml = content.replace(
    /id="(highlight-[^"]+)" class="((?:orange|cyan|purple)-bg)([^"]*)"/g,
    (match, id, colorClass, extra) => {
      const visible = activeHighlightId === id;
      return (
        'id="' +
        id +
        '" class="' +
        colorClass +
        (extra || "") +
        (visible ? " is-visible" : "") +
        '"'
      );
    },
  );

  return React.createElement(
    "div",
    { className: "question-panel" },
    React.createElement("h2", {
      dangerouslySetInnerHTML: { __html: processedHtml },
    }),
  );
};
