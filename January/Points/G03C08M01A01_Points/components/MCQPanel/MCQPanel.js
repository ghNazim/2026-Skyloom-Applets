const MCQPanel = ({
  content,
  mcqData,
  selectedOption,
  isCorrect,
  onOptionClick,
  showFeedback,
  feedbackOverride,
}) => {
  const { useState, useEffect } = React;

  const getFeedbackText = () => {
    // Use feedback override if provided
    if (feedbackOverride) return feedbackOverride;

    if (!mcqData || !selectedOption || !showFeedback) return null;

    const optionIndex = mcqData.options.indexOf(selectedOption);
    if (optionIndex === -1 || !mcqData.feedbacks) return null;

    // Handle new feedback structure (object with wrong/correct keys)
    if (typeof mcqData.feedbacks === "object" && !Array.isArray(mcqData.feedbacks)) {
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

  // Determine panel style: text-only vs MCQ
  const hasMCQ = mcqData && mcqData.options;
  const panelClassName = hasMCQ ? "mcq-panel mcq-panel-with-mcq" : "mcq-panel mcq-panel-text-only";

  return React.createElement(
    "div",
    { className: panelClassName },
    // Show text content if provided
    content &&
      React.createElement(
        "div",
        { className: "mcq-panel-text", dangerouslySetInnerHTML: { __html: content } },
        
      ),
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
          // MCQ Title (only if not null and feedback not shown)
          mcqData.title && !showFeedback &&
            React.createElement("div", { className: "mcq-title" }, mcqData.title),
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
                if (!isCorrect) {
                  buttonClass += " shake";
                }
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
                },
                option
              );
            })
          )
        )
      )
  );
};
