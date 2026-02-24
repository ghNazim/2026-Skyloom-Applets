/**
 * MainCanvas: two-column layout for steps 0, 1, 3, 4, 5.
 * Step 2 is full-width Splash in App.js.
 */
const MainCanvas = ({
  step,
  comprehendSubstep,
  currentImage,
  onEnableNext,
  onUpdateTexts,
  onUpdateImage,
  onUpdateNav,
  mcqSelectedIndex,
  mcqCorrect,
  onMcqOptionClick,
  perpLeftClicked,
  perpRightClicked,
  onPerpLeftClick,
  onPerpRightClick,
  perpBothComplete,
}) => {
  const stepData = APP_DATA.steps[step];
  if (!stepData) return null;

  // Step 0: Comprehend - two columns
  if (step === 0 && stepData.isComprehend) {
    const comprehendData = APP_DATA.comprehend;
    const infoList = comprehendData.infoList || [];
    const showCount = comprehendSubstep >= 0 ? comprehendSubstep + 1 : 0;
    const highlight =
      comprehendSubstep >= 0 && comprehendData.highlights && comprehendData.highlights[comprehendSubstep]
        ? comprehendData.highlights[comprehendSubstep]
        : null;

    return React.createElement(
      "div",
      { className: "main-canvas-container two-column" },
      React.createElement(
        "div",
        { className: "column visual-column" },
        React.createElement(Visual, {
          imageSrc: currentImage,
          infoList: infoList,
          showCount: showCount,
          step: step,
          substep: comprehendSubstep,
        })
      ),
      React.createElement(
        "div",
        { className: "column content-column" },
        React.createElement(ComprehendQuestion, {
          questionText: comprehendData.comprehendQuestion,
          highlight: highlight,
        })
      )
    );
  }

  // Step 1, 4, 5: MCQ - two columns
  if (stepData.isMcq && stepData.mcqKey) {
    const mcqData = APP_DATA[stepData.mcqKey];
    if (!mcqData) return null;
    return React.createElement(
      "div",
      { className: "main-canvas-container two-column" },
      React.createElement(
        "div",
        { className: "column visual-column" },
        React.createElement(Visual, {
          imageSrc: currentImage,
          step: step,
        })
      ),
      React.createElement(
        "div",
        { className: "column content-column" },
        React.createElement(MCQPanel, {
          mcqData: mcqData,
          selectedIndex: mcqSelectedIndex,
          isCorrect: mcqCorrect,
          onOptionClick: onMcqOptionClick,
        })
      )
    );
  }

  // Step 6: Table (ratio multiplier)
  if (step === 6 && stepData.isTable && stepData.tableKey) {
    const tableConfig = APP_DATA[stepData.tableKey] || {};
    return React.createElement(
      "div",
      { className: "main-canvas-container two-column" },
      React.createElement(
        "div",
        { className: "column visual-column" },
        React.createElement(Visual, {
          imageSrc: currentImage,
          step: step,
        })
      ),
      React.createElement(
        "div",
        { className: "column content-column" },
        React.createElement(TablePanel, {
          title: tableConfig.title,
          tableConfig: tableConfig,
          onUpdateNav: onUpdateNav,
          onUpdateImage: onUpdateImage,
          onEnableNext: onEnableNext,
        })
      )
    );
  }

  // Step 9: Compute (area of trapezium)
  if (step === 9 && stepData.isCompute && stepData.computeKey) {
    const computeConfig = APP_DATA[stepData.computeKey] || {};
    return React.createElement(
      "div",
      { className: "main-canvas-container two-column" },
      React.createElement(
        "div",
        { className: "column visual-column" },
        React.createElement(Visual, {
          imageSrc: currentImage,
          step: step,
        })
      ),
      React.createElement(
        "div",
        { className: "column content-column" },
        React.createElement(Compute1, {
          config: computeConfig,
          onUpdateImage: onUpdateImage,
          onEnableNext: onEnableNext,
          onUpdateNav: onUpdateNav,
        })
      )
    );
  }

  // Step 3: Perpendiculars + OnlyText
  if (step === 3 && stepData.isOnlyText && stepData.onlyTextKey) {
    const onlyTextData = APP_DATA.onlyText[stepData.onlyTextKey];
    const text = perpBothComplete ? onlyTextData.finalText : onlyTextData.initialText;
    return React.createElement(
      "div",
      { className: "main-canvas-container two-column" },
      React.createElement(
        "div",
        { className: "column visual-column" },
        React.createElement(Visual, {
          imageSrc: currentImage,
          step: step,
          showPerpDots: true,
          perpLeftClicked: perpLeftClicked,
          perpRightClicked: perpRightClicked,
          onPerpLeftClick: onPerpLeftClick,
          onPerpRightClick: onPerpRightClick,
        })
      ),
      React.createElement(
        "div",
        { className: "column content-column" },
        React.createElement(OnlyText, { text: text })
      )
    );
  }

  return null;
};
