const MainCanvas = ({
  step,
  appData,
  onEnableNext,
  onUpdateTexts,
  onUpdateImage,
  currentImage,
  comprehendSubstep = 0,
  statementInVisual = "",
  questionRowHighlights = null,
  questionRowHighlightColor = null,
  calcState,
  setCalcState,
  visibleCalcRowIndex = 0
}) => {
  const { useEffect } = React;

  useEffect(() => {
    const stepData = appData && appData.steps[step];
    if (stepData) {
      const navText = stepData.navText || "";
      const questionText = stepData.questionText || "";
      onUpdateTexts(questionText, navText);
    }
  }, [step, appData]);

  const stepData = appData && appData.steps[step];
  if (!stepData) return null;

  const getImageSrc = () => {
    if (currentImage) return currentImage;
    if (stepData.image) return `${stepData.image}`;
    return "";
  };

  const renderContent = () => {
    if (stepData.isComprehend) {
      return React.createElement(
        "div",
        { className: "main-canvas-container two-column" },
        React.createElement(
          "div",
          { className: "column visual-column" },
          React.createElement(Visual, {
            imageSrc: getImageSrc(),
            showAreaLabel: false,
            step: step,
            substep: comprehendSubstep,
            questionRowText: statementInVisual || null,
            questionRowHighlights: questionRowHighlights,
            questionRowHighlightColor: questionRowHighlightColor
          })
        ),
        React.createElement(
          "div",
          { className: "column content-column" },
          React.createElement(Comprehend, {
            step: step,
            substep: comprehendSubstep,
            appData: appData
          })
        )
      );
    }

    if (stepData.isDragDropStep) {
      const dragDropKey = stepData.dragDropKey || "dragDrop1";
      const findingDivInstances = appData.findingDivInstances || [];
      const findingIndex = stepData.findingDivInstanceIndex;
      const findingInstance = typeof findingIndex === "number" && findingDivInstances[findingIndex]
        ? findingDivInstances[findingIndex]
        : null;
      return React.createElement(DragDropPanel, {
        appData: appData,
        dragDropKey: dragDropKey,
        imageSrc: getImageSrc(),
        onEnableNext: onEnableNext,
        onUpdateNavText: (navText) => onUpdateTexts(null, navText),
        step: step,
        findingInstance: findingInstance
      });
    }

    if (stepData.isCalculation || stepData.isMcqStep || stepData.isBlankCalcStep || stepData.isCalcStep || stepData.isFinalStep) {
      return React.createElement(CalculationPanel, {
        step: step,
        appData: appData,
        onEnableNext: onEnableNext,
        onUpdateNavText: (navText) => onUpdateTexts(null, navText),
        calcState: calcState,
        setCalcState: setCalcState,
        imageSrc: getImageSrc(),
        onUpdateImage: onUpdateImage,
        visibleCalcRowIndex: visibleCalcRowIndex
      });
    }

    return null;
  };

  return renderContent();
};
