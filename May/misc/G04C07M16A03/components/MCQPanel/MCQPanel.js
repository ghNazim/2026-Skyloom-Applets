const MCQPanel = ({
  content,
  mcqData,
  selectedOption,
  isCorrect,
  onOptionClick,
  showFeedback,
  feedbackOverride,
  shake, // New prop
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
      ? "mcq-options-container column"
      : "mcq-options-container column";
  };

  // Helper functions for fraction rendering
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
          },
          feedbackText
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
              const selectedStr = String(selectedOption);

              if (isAnswered && optionStr === selectedStr) {
                buttonClass += isCorrect ? " correct" : " incorrect";
                // Add shake class if needed
                if (shake && !isCorrect) buttonClass += " shake";
              }
              if (isCorrect) {
                buttonClass += " disabled";
              }

              return React.createElement(
                "button",
                {
                  key: `${option}-${index}`,
                  className: buttonClass,
                  onClick: () => onOptionClick && onOptionClick(option),
                  disabled: isCorrect,
                  dangerouslySetInnerHTML:!isFraction(option) ? { __html: handleComma(option) }: null,
                },
                isFraction(option) ? renderFraction(option) : null
              );
            })
          )
        )
      )
  );
};
