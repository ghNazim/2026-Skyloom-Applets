const MainCanvas = ({
  step,
  onEnableNext,
  onUpdateTexts,
  onUpdateImage,
  currentImage,
  comprehendSubstep = 0,
  statementInVisual = "",
  questionRowHighlights = null,
  questionRowHighlightColor = null,
  calcState,
  setCalcState
}) => {
  const { useEffect } = React;

  useEffect(() => {
    const stepData = APP_DATA.steps[step];
    if (stepData) {
      const navText = stepData.navText || "";
      const questionText = stepData.questionText || "";
      onUpdateTexts(questionText, navText);
    }
  }, [step]);

  const stepData = APP_DATA.steps[step];
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
            substep: comprehendSubstep
          })
        )
      );
    }

    if (stepData.isCalculation || stepData.isMcq || stepData.isNumpad || stepData.isFinalStep) {
      return React.createElement(CalculationPanel, {
        step: step,
        onEnableNext: onEnableNext,
        onUpdateNavText: (navText) => onUpdateTexts(null, navText),
        calcState: calcState,
        setCalcState: setCalcState,
        imageSrc: getImageSrc(),
        onUpdateImage: onUpdateImage
      });
    }

    return null;
  };

  return renderContent();
};
