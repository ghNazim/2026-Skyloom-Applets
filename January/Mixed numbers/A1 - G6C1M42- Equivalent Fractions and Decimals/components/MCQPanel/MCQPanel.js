const MCQPanel = ({
  content,
  mcqData,
  selectedOption,
  isCorrect,
  onOptionClick,
  showFeedback,
  feedbackOverride,
  shake, // New prop
  extraText,
}) => {
  const { useState, useEffect } = React;

  const getFeedbackText = () => {
    // Use feedback override if provided
    if (feedbackOverride) return feedbackOverride;

    if (!mcqData || !selectedOption || !showFeedback) return null;

    const optionIndex = mcqData.options.indexOf(selectedOption);
    if (optionIndex === -1 || !mcqData.feedbacks) return null;

    // Handle new feedback structure (object with wrong/correct keys)
    if (
      typeof mcqData.feedbacks === "object" &&
      !Array.isArray(mcqData.feedbacks)
    ) {
      return isCorrect ? mcqData.feedbacks.correct : mcqData.feedbacks.wrong;
    }

    // Handle old feedback structure (array)
    return mcqData.feedbacks[optionIndex];
  };

  const feedbackText = getFeedbackText();
  const isAnswered = selectedOption !== null;

  // Determine grid layout based on number of options
  const getOptionsClassName = () => {
    if (!mcqData || !mcqData.options) return "mcq-options-container";
    return mcqData.options.length === 4
      ? "mcq-options-container grid-2x2"
      : "mcq-options-container column";
  };

  // Helper functions for fraction rendering
  const isFraction = (str) =>
    typeof str === "string" && str.includes("/") && /^\d+\/\d+$/.test(str);

  const isMixedFraction = (str) =>
    typeof str === "string" && /^\d+\s+\d+\/\d+$/.test(str.trim());

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

  const renderMixedFraction = (str) => {
    const match = str.trim().match(/^(\d+)\s+(\d+)\/(\d+)$/);
    if (!match) return str;
    const [, whole, num, den] = match;
    return React.createElement(
      "div",
      { className: "mcq-mixed-fraction" },
      React.createElement("span", { className: "mcq-mixed-whole" }, whole),
      React.createElement(
        "div",
        { className: "mcq-mixed-fraction-part" },
        React.createElement("span", { className: "num" }, num),
        React.createElement("span", { className: "line" }),
        React.createElement("span", { className: "den" }, den)
      )
    );
  };

  return React.createElement(
    "div",
    { className: "mcq-panel" },
    // Show text content if provided
    content &&
      React.createElement("div", { className: "mcq-panel-text" }, content),
    // Show MCQ if provided
    mcqData &&
      React.createElement(
        "div",
        { className: "mcq-panel-content" },
        // Feedback area (only visible when answered)
        React.createElement(
          "div",
          {
            className: `mcq-feedback ${
              !isAnswered ? "" : isCorrect ? "correct" : "incorrect"
            }`,
            dangerouslySetInnerHTML: feedbackText ? { __html: feedbackText.replace(/\n/g, '<br>') } : undefined,
          },
          !feedbackText ? null : undefined
        ),
        // MCQ Wrapper (Title + Options)
        React.createElement(
          "div",
          { className: "mcq-wrapper" },
          // MCQ Title (only if not null)
          mcqData.title &&
            React.createElement(
              "div",
              { className: "mcq-title" },
              mcqData.title
            ),
          // MCQ Options
            React.createElement(
              "div",
              { className: getOptionsClassName() },
              mcqData.options.map((option, index) => {
                let buttonClass = "mcq-option-button";
                const optionStr = String(option);
                // ... (simplified for clarity in this replacement, but I will use the actual code)
                // Actually, I should just target the end of the map and append the extra text element
                
                // Let's copy the map logic properly or just target the closing brace of the options div
                if (isAnswered && String(option) === String(selectedOption)) {
                  buttonClass += isCorrect ? " correct" : " incorrect";
                  // Add shake class if needed
                  if (shake && !isCorrect) buttonClass += " shake";
                }
                if (isCorrect) {
                  buttonClass += " disabled";
                }

                const isMixed = isMixedFraction(option);
                const isFrac = isFraction(option);
                const buttonContent = isMixed
                  ? renderMixedFraction(option)
                  : isFrac
                  ? renderFraction(option)
                  : null;
                  
                return React.createElement(
                  "button",
                  {
                    key: `${option}-${index}`,
                    className: buttonClass,
                    onClick: () => onOptionClick && onOptionClick(option),
                    disabled: isCorrect,
                    dangerouslySetInnerHTML:
                      !isMixed && !isFrac
                        ? { __html: handleComma(option) }
                        : undefined,
                  },
                  buttonContent
                );
              })
            ),
            extraText &&
              React.createElement(
                "div",
                { className: "mcq-extra-text" },
                extraText
              )
          )
      )
  );
};
