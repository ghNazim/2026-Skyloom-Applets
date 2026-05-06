const MCQPanel = ({
  content,
  mcqData,
  selectedOption,
  selectedIndex,
  selectionByIndex,
  isCorrect,
  onOptionClick,
  showFeedback,
  feedbackOverride,
  shake,
  suppressFeedbackText,
}) => {
  const useIndex =
    selectionByIndex === true ||
    (selectedIndex !== null && selectedIndex !== undefined);

  const getFeedbackText = () => {
    if (suppressFeedbackText) return null;
    if (feedbackOverride) return feedbackOverride;
    if (!mcqData || !showFeedback) return null;

    if (useIndex) {
      if (selectedIndex === null || selectedIndex === undefined) return null;
    } else {
      if (!selectedOption) return null;
    }

    if (
      typeof mcqData.feedbacks === "object" &&
      mcqData.feedbacks &&
      !Array.isArray(mcqData.feedbacks)
    ) {
      return isCorrect ? mcqData.feedbacks.correct : mcqData.feedbacks.wrong;
    }

    if (!mcqData.feedbacks) return null;

    const optionIndex = useIndex
      ? selectedIndex
      : mcqData.options.indexOf(selectedOption);
    if (optionIndex === -1) return null;

    if (Array.isArray(mcqData.feedbacks)) {
      return mcqData.feedbacks[optionIndex];
    }

    return null;
  };

  const feedbackText = getFeedbackText();
  const isAnswered = useIndex
    ? selectedIndex !== null && selectedIndex !== undefined
    : selectedOption !== null;

  const getOptionsClassName = () => {
    if (!mcqData || !mcqData.options) return "mcq-options-container";
    return mcqData.options.length === 4
      ? "mcq-options-container column"
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

  const panelContentClass =
    "mcq-panel-content" + (suppressFeedbackText ? " no-feedback" : "");

  return React.createElement(
    "div",
    { className: "mcq-panel" },
    content &&
      React.createElement("div", { className: "mcq-panel-text" }, content),
    mcqData &&
      React.createElement(
        "div",
        { className: panelContentClass },
        !suppressFeedbackText &&
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
            React.createElement(
              "div",
              { className: "mcq-title" },
              mcqData.title
            ),
          React.createElement(
            "div",
            { className: getOptionsClassName() },
            mcqData.options.map((option, index) => {
              let buttonClass = "mcq-option-button";
              const optionStr = String(option);

              const selectedForThis = useIndex
                ? selectedIndex === index
                : String(selectedOption) === optionStr;

              if (isAnswered && selectedForThis) {
                buttonClass += isCorrect ? " correct" : " incorrect";
                if (shake && !isCorrect) buttonClass += " shake";
              }
              if (isCorrect) {
                buttonClass += " disabled";
              }

              const handleClick = () => {
                if (!onOptionClick) return;
                if (useIndex) onOptionClick(index);
                else onOptionClick(option);
              };

              const btnProps = {
                key: `${option}-${index}`,
                type: "button",
                className: buttonClass,
                onClick: handleClick,
                disabled: isCorrect,
              };

              if (!isFraction(option)) {
                btnProps.dangerouslySetInnerHTML = {
                  __html: handleComma(optionStr),
                };
              }

              return React.createElement(
                "button",
                btnProps,
                isFraction(option) ? renderFraction(option) : null
              );
            })
          )
        )
      )
  );
};
