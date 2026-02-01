const LeftQuestion = ({ text, highlights = null, highlightColor = null }) => {
  const getHighlightedText = () => {
    if (!text || !highlights || highlights.length === 0) {
      return text || "";
    }

    let highlightedText = text;

    highlights.forEach((highlight) => {
      if (highlight && highlightedText.includes(highlight)) {
        const colorClass =
          highlightColor === "orange"
            ? "left-question-highlight-orange"
            : "left-question-highlight-purple";
        highlightedText = highlightedText.replace(
          highlight,
          `<span class="${colorClass}">${highlight}</span>`
        );
      }
    });

    return highlightedText;
  };

  return React.createElement(
    "div",
    { className: "left-question" },
    React.createElement("div", {
      className: "left-question-text",
      dangerouslySetInnerHTML: { __html: getHighlightedText() },
    })
  );
};
