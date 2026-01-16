const MCQPanel = ({
  content,
  mcqData,
  selectedOption,
  isCorrect,
  onOptionClick,
  showFeedback,
  feedbackOverride,
  showFeedbackOverride,
  isCorrectOverride, // Override isCorrect for step 3 feedback
  actionButtonText,
  onActionButtonClick,
  actionButtonDisabled,
  sliderValue,
  onSliderChange,
  showSlider,
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
  const showFeedbackDiv =
    showFeedbackOverride !== undefined ? showFeedbackOverride : showFeedback;
  // Use isCorrectOverride if provided (for step 3), otherwise use isCorrect
  const effectiveIsCorrect =
    isCorrectOverride !== undefined ? isCorrectOverride : isCorrect;

  // Determine grid layout based on number of options
  const getOptionsClassName = () => {
    if (!mcqData || !mcqData.options) return "mcq-options-container";
    return mcqData.options.length === 4
      ? "mcq-options-container grid-2x2"
      : "mcq-options-container column";
  };

  // Determine panel style: text-only vs MCQ
  const hasMCQ = mcqData && mcqData.options;
  const panelClassName = hasMCQ
    ? "mcq-panel mcq-panel-with-mcq"
    : "mcq-panel mcq-panel-text-only";

  return React.createElement(
    "div",
    { className: panelClassName },
    // Show text content if provided, but NOT when there's an MCQ
    content &&
      !hasMCQ &&
      React.createElement("div", {
        className: "mcq-panel-text",
        dangerouslySetInnerHTML: { __html: content },
      }),
    // Show feedback div below mcq-panel-text (for step 3)
    showFeedbackDiv &&
      feedbackText &&
      React.createElement(
        "div",
        {
          className: `mcq-feedback ${
            effectiveIsCorrect !== undefined
              ? effectiveIsCorrect
                ? "correct"
                : "incorrect"
              : ""
          }`,
          dangerouslySetInnerHTML: { __html: feedbackText },
        },
        // feedbackText
      ),
    // Action button (below mcq-panel-text) - styled like MCQ option buttons
    actionButtonText &&
      React.createElement(
        "button",
        {
          className: `mcq-option-button ${
            actionButtonDisabled ? "disabled" : ""
          }`,
          onClick: onActionButtonClick,
          disabled: actionButtonDisabled,
          style: {
            marginTop: "2vw",
            width: "100%",
          },
        },
        actionButtonText
      ),
    // Slider (below mcq-panel-text)
    showSlider &&
      React.createElement(
        "div",
        {
          style: {
            marginTop: "2vw",
            width: "100%",
          },
        },
        React.createElement("input", {
          type: "range",
          min: 1,
          max: 2,
          step: 0.01,
          value: sliderValue || 1,
          onChange: (e) =>
            onSliderChange && onSliderChange(parseFloat(e.target.value)),
          className: "visual-panel-slider",
          style: {
            width: "100%",
          },
        })
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
            dangerouslySetInnerHTML: { __html: feedbackText },
          },
         
        ),
        // MCQ Wrapper (Title + Options)
        React.createElement(
          "div",
          { className: "mcq-wrapper" },
          // MCQ Title (only if not null and feedback not shown)
          mcqData.title &&
            !showFeedback &&
            React.createElement("div", {
              className: "mcq-title",
              dangerouslySetInnerHTML: { __html: mcqData.title },
            }),
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
