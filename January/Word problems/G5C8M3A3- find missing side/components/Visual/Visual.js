const Visual = ({ imageSrc, altText = "", showAreaLabel = false, step, substep = 0, isAnswered = false, questionRowText = null, questionRowHighlights = null, questionRowHighlightColor = null }) => {
  const isSvgInline = imageSrc && imageSrc.trim().startsWith("<svg");

  const getHighlightedStatement = () => {
    if (!questionRowText || !questionRowHighlights || questionRowHighlights.length === 0) {
      return questionRowText || "";
    }
    let text = questionRowText;
    questionRowHighlights.forEach((highlight) => {
      if (highlight && highlight !== "null" && text.includes(highlight)) {
        const colorClass = questionRowHighlightColor === "orange"
          ? "question-highlight-orange"
          : "question-highlight-purple";
        text = text.replace(
          highlight,
          `<span class="${colorClass}">${highlight}</span>`
        );
      }
    });
    return text;
  };

  const content = isSvgInline
    ? React.createElement("div", {
        className: "svg-inline-wrapper",
        dangerouslySetInnerHTML: { __html: imageSrc }
      })
    : React.createElement("img", {
        src: imageSrc,
        alt: altText || "",
        className: "visual-image",
      });

  if (questionRowText) {
    return React.createElement(
      "div",
      { className: "visual-panel with-question-row" },
      React.createElement(
        "div",
        { className: "visual-question-row" },
        React.createElement("div", {
          className: "visual-question-row-text",
          dangerouslySetInnerHTML: { __html: getHighlightedStatement() }
        })
      ),
      React.createElement(
        "div",
        { className: "visual-image-area" },
        content
      )
    );
  }

  return React.createElement(
    "div",
    { className: "visual-panel" },
    content
  );
};
