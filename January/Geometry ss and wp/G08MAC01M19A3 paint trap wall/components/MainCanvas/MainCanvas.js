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
  step12ShowCansInfo = false,
  step12ComputePhase = null,
  onStep12AppendInfo,
  onStep12NumeratorHighlight,
  onStep12DenominatorHighlight,
  onStep12UnitsHighlight,
}) => {
  const stepData = APP_DATA.steps[step];
  if (!stepData) return null;

  // Step 0: Comprehend - two columns
  if (step === 0 && stepData.isComprehend) {
    const comprehendData = APP_DATA.comprehend;
    const isDefault = comprehendSubstep < 0;
    const infoList = isDefault
      ? (comprehendData.defaultInfoListItem ? [comprehendData.defaultInfoListItem] : [])
      : (comprehendData.infoList || []);
    const showCount = isDefault ? infoList.length : comprehendSubstep + 1;
    const highlight = isDefault
      ? (comprehendData.defaultHighlight || null)
      : (comprehendData.highlights && comprehendData.highlights[comprehendSubstep]
          ? comprehendData.highlights[comprehendSubstep]
          : null);
    const highlightClasses = comprehendData.highlightClasses || [];
    const highlightClass = isDefault
      ? (highlightClasses[0] || null)
      : (highlightClasses[comprehendSubstep] || null);

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
          highlightClass: highlightClass,
        })
      )
    );
  }

  // Step 12: Compute2 (#cans of paint) – two columns with visual info that can append
  if (step === 12 && stepData.isCompute2 && stepData.computeKey) {
    const computeConfig = APP_DATA[stepData.computeKey] || {};
    const visualData = APP_DATA.compute2Visual || {};
    const infoList = visualData.infoList || [];
    const listWithCans = step12ShowCansInfo && visualData.cansInfoText
      ? [...infoList, visualData.cansInfoText]
      : infoList;
    const showCount = listWithCans.length;
    const phase = step12ComputePhase;
    const dimmedIndices = phase === null ? [] : phase === "denominator" ? [1] : [0, 1];
    const yellowItemIndex = phase === "denominator" ? 0 : null;
    const greenItemIndex = step12ShowCansInfo ? showCount - 1 : null;
    return React.createElement(
      "div",
      { className: "main-canvas-container two-column" },
      React.createElement(
        "div",
        { className: "column visual-column" },
        React.createElement(Visual, {
          imageSrc: currentImage,
          infoList: listWithCans,
          showCount: showCount,
          greenItemIndex: greenItemIndex,
          yellowItemIndex: yellowItemIndex,
          dimmedIndices: dimmedIndices,
          step: step,
        })
      ),
      React.createElement(
        "div",
        { className: "column content-column" },
        React.createElement(Compute2, {
          config: computeConfig,
          onAppendInfoItem: onStep12AppendInfo,
          onNumeratorHighlight: onStep12NumeratorHighlight,
          onDenominatorHighlight: onStep12DenominatorHighlight,
          onUnitsHighlight: onStep12UnitsHighlight,
          onEnableNext: onEnableNext,
          onUpdateNav: onUpdateNav,
        })
      )
    );
  }

  // Step 14: Summary – question panel hidden, visual + only text, next restarts
  if (step === 14 && stepData.isSummary && stepData.summaryKey) {
    const summary = APP_DATA[stepData.summaryKey] || {};
    const infoList = summary.infoList || [];
    return React.createElement(
      "div",
      { className: "main-canvas-container two-column" },
      React.createElement(
        "div",
        { className: "column visual-column" },
        React.createElement(Visual, {
          imageSrc: currentImage,
          infoList: infoList,
          showCount: infoList.length,
          step: step,
        })
      ),
      React.createElement(
        "div",
        { className: "column content-column" },
        React.createElement(OnlyText, { text: summary.text || "" })
      )
    );
  }

  // Step 1, 4, 5, 11, 13: MCQ - two columns (steps 1, 11 & 13 have visual info list)
  if (stepData.isMcq && stepData.mcqKey) {
    const mcqData = APP_DATA[stepData.mcqKey];
    if (!mcqData) return null;
    let infoList = null;
    let showCount = 0;
    if (step === 1) {
      const comprehendList = APP_DATA.comprehend.infoList || [];
      infoList = comprehendList;
      showCount = comprehendList.length;
    } else if (step === 11 || step === 13) {
      const visualData = APP_DATA.compute2Visual || null;
      infoList = visualData
        ? (step === 13
            ? [...(visualData.infoList || []), visualData.cansInfoText]
            : visualData.infoList)
        : null;
      showCount = step === 11 ? 2 : 3;
    }
    return React.createElement(
      "div",
      { className: "main-canvas-container two-column" },
      React.createElement(
        "div",
        { className: "column visual-column" },
        React.createElement(Visual, {
          imageSrc: currentImage,
          infoList: infoList || undefined,
          showCount: infoList ? showCount : 0,
          greenItemIndex: step === 13 && infoList && infoList.length === 3 ? 2 : null,
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
