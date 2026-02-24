/**
 * MCQPanel: title at top, feedback section (only visible when feedbacks exist and user has clicked),
 * options in a column. Uses correctIndex (0-based). Wrong option: reddish + wrong feedback;
 * correct: green, disable all, correct feedback.
 */
const MCQPanel = ({
  mcqData,
  selectedIndex,
  isCorrect,
  onOptionClick,
  shake = false,
}) => {
  if (!mcqData || !mcqData.options) return null;

  const { title, options, correctIndex, feedbacks } = mcqData;
  const isAnswered = selectedIndex !== null && selectedIndex !== undefined;
  const showFeedback = isAnswered && feedbacks && feedbacks.length > 0;
  const feedbackText = showFeedback ? feedbacks[selectedIndex] : null;
  const feedbackClass = showFeedback
    ? isCorrect
      ? "correct"
      : "incorrect"
    : "";

  const isFraction = (str) =>
    typeof str === "string" && str.includes("/") && /^\d+\/\d+$/.test(str);

  const renderFraction = (str) => {
    const [num, den] = str.split("/");
    return React.createElement(
      "div",
      { className: "mcq-fraction" },
      React.createElement("div", { className: "num" }, num),
      React.createElement("div", { className: "line" }),
      React.createElement("div", { className: "den" }, den)
    );
  };

  return React.createElement(
    "div",
    { className: "mcq-panel" },
    React.createElement(
      "div",
      { className: "mcq-panel-content" },
      // Title at top
      title &&
        React.createElement("div", { className: "mcq-title" }, title),
      // Feedback section - only visible when feedbacks exist and user has clicked
      React.createElement(
        "div",
        {
          className: `mcq-feedback ${feedbackClass}`,
        },
        feedbackText != null ? feedbackText : ""
      ),
      // Options container - column layout
      React.createElement(
        "div",
        { className: "mcq-options-container column" },
        options.map((option, index) => {
          let buttonClass = "mcq-option-button";
          const selected = selectedIndex === index;
          if (isAnswered && selected) {
            buttonClass += isCorrect ? " correct" : " incorrect";
            if (shake && !isCorrect) buttonClass += " shake";
          }
          if (isCorrect) {
            buttonClass += " disabled";
          }

          return React.createElement(
            "button",
            {
              key: `option-${index}`,
              className: buttonClass,
              onClick: () => onOptionClick && onOptionClick(index),
              disabled: isCorrect,
              dangerouslySetInnerHTML: !isFraction(option)
                ? { __html: typeof handleComma !== "undefined" ? handleComma(option) : option }
                : null,
            },
            isFraction(option) ? renderFraction(option) : null
          );
        })
      )
    )
  );
};
