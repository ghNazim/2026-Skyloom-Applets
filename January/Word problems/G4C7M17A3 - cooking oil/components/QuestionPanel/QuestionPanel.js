const QuestionPanel = ({ text, step, highlights = null, highlightColor = null, smallerFont = false }) => {
  // Apply highlights to the text if provided
  const getHighlightedText = () => {
    if (!text || !highlights || highlights.length === 0) {
      return text || "";
    }
    
    let highlightedText = text;
    
    highlights.forEach((highlight) => {
      if (highlight && highlightedText.includes(highlight)) {
        const colorClass = highlightColor === "orange" 
          ? "question-highlight-orange" 
          : "question-highlight-purple";
        highlightedText = highlightedText.replace(
          highlight,
          `<span class="${colorClass}">${highlight}</span>`
        );
      }
    });
    
    return highlightedText;
  };
  
  const panelClass = `question-panel ${smallerFont ? 'smaller-font' : ''}`;
  
  return React.createElement(
    "div",
    { className: panelClass },
    React.createElement("h2", {
      dangerouslySetInnerHTML: { __html: getHighlightedText() },
    })
  );
};
