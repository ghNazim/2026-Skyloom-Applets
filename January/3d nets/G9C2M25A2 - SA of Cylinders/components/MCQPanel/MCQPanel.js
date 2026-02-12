const MCQPanel = ({
  content,
  mcqData,
  selectedOption,
  isCorrect,
  onOptionClick,
  showFeedback,
  feedbackOverride,
  shake,
}) => {
  const { useState, useEffect } = React;

  const getFeedbackText = () => {
    if (feedbackOverride) return feedbackOverride;
    if (!mcqData || !selectedOption || !showFeedback) return null;

    const optionIndex = mcqData.options.indexOf(selectedOption);
    if (optionIndex === -1 || !mcqData.feedbacks) return null;

    if (
      typeof mcqData.feedbacks === "object" &&
      !Array.isArray(mcqData.feedbacks)
    ) {
      return isCorrect ? mcqData.feedbacks.correct : mcqData.feedbacks.wrong;
    }

    return mcqData.feedbacks[optionIndex];
  };

  const feedbackText = getFeedbackText();
  const isAnswered = selectedOption !== null;

  const getOptionsClassName = () => {
    if (!mcqData || !mcqData.options) return "mcq-options-container";
    return mcqData.options.length === 4
      ? "mcq-options-container grid-2x2"
      : "mcq-options-container column";
  };

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
    content &&
      React.createElement("div", { className: "mcq-panel-text" }, content),
    mcqData &&
      React.createElement(
        "div",
        { className: "mcq-panel-content" },
        // Only render feedback area if showFeedback is true
        showFeedback &&
          React.createElement(
            "div",
            {
              className: `mcq-feedback ${
                !isAnswered ? "" : isCorrect ? "correct" : "incorrect"
              }`,
            },
            feedbackText
          ),
        React.createElement(
          "div",
          { className: "mcq-wrapper" },
          mcqData.title &&
            React.createElement("div", {
              className: "mcq-title",
              dangerouslySetInnerHTML: { __html: mcqData.title },
            }),
          React.createElement(
            "div",
            { className: getOptionsClassName() },
            mcqData.options.map((option, index) => {
              let buttonClass = "mcq-option-button";
              const optionStr = String(option);
              const selectedStr = String(selectedOption);

              if (isAnswered && optionStr === selectedStr) {
                buttonClass += isCorrect ? " correct" : " incorrect";
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
                  dangerouslySetInnerHTML: !isFraction(option)
                    ? { __html: handleComma(option) }
                    : null,
                },
                isFraction(option) ? renderFraction(option) : null
              );
            })
          )
        )
      )
  );
};
