const MCQPanel = ({
  content,
  mcqData,
  selectedOption,
  isCorrect,
  onOptionClick,
  showFeedback,
  feedbackOverride,
  showCompareButton,
  compareButtonText,
  onCompareClick,
  showFinalInfo,
  mcqPhase,
}) => {
  const { useState, useEffect } = React;

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
  const panelClassName = hasMCQ
    ? "mcq-panel mcq-panel-with-mcq"
    : "mcq-panel mcq-panel-text-only";

  // Determine if we should show content (only when no MCQ is shown)
  const shouldShowContent = content && !mcqData;

  return React.createElement(
    "div",
    { className: panelClassName },
    // Show text content only when no MCQ is provided
    shouldShowContent &&
      React.createElement("div", {
        className: showFinalInfo
          ? "mcq-panel-text final-info"
          : "mcq-panel-text",
        dangerouslySetInnerHTML: { __html: content },
      }),
    // Show compare button if provided
    showCompareButton &&
      compareButtonText &&
      React.createElement(
        "div",
        {
          style: {
            position: "relative",
            display: "inline-block",
            marginTop: "1.5vw",
            width: "100%",
          },
        },
        React.createElement(
          "button",
          {
            id: "compare-button",
            className: "compare-button",
            onClick: onCompareClick,
            style: {
              padding: "1vw 2vw",
              fontSize: "2vw",
              fontWeight: "600",
              cursor: "pointer",
              border: "none",
              background: "linear-gradient(145deg, #ffeb3b, #ff9800)",
              color: "black",
              borderRadius: "0.8vw",
              transition: "all 0.3s ease",
              textAlign: "center",
              boxShadow: "0 0.4vh 0.8vh rgba(0, 0, 0, 0.2)",
              width: "100%",
            },
          },
          compareButtonText
        ),
        React.createElement("img", {
          src: "assets/tap.gif",
          alt: "Tap hint",
          className: "compare-tap-gif",
          style: {
            position: "absolute",
            top: "70%",
            left: "90%",
            transform: "translate(-50%, -50%)",
            width: "5vw",
            height: "5vw",
            pointerEvents: "none",
            zIndex: 10,
          },
        })
      ),
    // Show MCQ if provided
    mcqData &&
      React.createElement(
        "div",
        { className: "mcq-panel-content" },
        // MCQ Wrapper (Title + Options)
        React.createElement(
          "div",
          { className: "mcq-wrapper" },
          // MCQ Title in a box (covers space above options)
          mcqData.title &&
            React.createElement("div", {
              className: `mcq-title-box ${
                showFinalInfo || mcqPhase === 2
                  ? "mcq-title-box-correct"
                  : "mcq-title-box-neutral"
              }`,
              dangerouslySetInnerHTML: {
                __html: `<div>${mcqData.title}</div>`,
              },
            }),
          // MCQ Options (only show if not final info)
          !showFinalInfo &&
            mcqData.options &&
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

                return React.createElement("button", {
                  key: `${option}-${index}`,
                  className: buttonClass,
                  onClick: () => onOptionClick && onOptionClick(option),
                  disabled: isCorrect,
                  dangerouslySetInnerHTML: { __html: option },
                });
              })
            )
        )
      )
  );
};
