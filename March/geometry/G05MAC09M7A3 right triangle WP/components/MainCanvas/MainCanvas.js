const MainCanvas = ({
  step,
  onEnableNext,
  onUpdateTexts,
  onUpdateImage,
  currentImage,
  comprehendSubstep = 0,
}) => {
  const { useState, useEffect } = React;

  // Reset state when step changes
  useEffect(() => {
    const stepData = APP_DATA.steps[step];
    if (stepData) {
      const navText = stepData.navText || "";
      const questionText = stepData.questionText || "";
      onUpdateTexts(questionText, navText);
    }
  }, [step]);

  // Get step data
  const stepData = APP_DATA.steps[step];
  if (!stepData) return null;

  // Determine image source
  const getImageSrc = () => {
    if (currentImage) return currentImage;
    if (stepData.image) return `${stepData.image}`;
    return "";
  };

  // Determine what to render based on step type
  const renderContent = () => {
    // Step 1: Comprehend with substeps
    if (stepData.isComprehend) {
      return React.createElement(
        "div",
        { className: "main-canvas-container two-column" },
        // Left Column - Visual (no video, only images)
        React.createElement(
          "div",
          { className: "column visual-column" },
          React.createElement(Visual, {
            imageSrc: getImageSrc(),
            step: step,
            substep: comprehendSubstep,
          })
        ),
        // Right Column - Comprehend
        React.createElement(
          "div",
          { className: "column content-column" },
          React.createElement(Comprehend, {
            step: step,
            substep: comprehendSubstep,
          })
        )
      );
    }

    // Steps 3-8: CalculationPanel handles all calc/mcq/numpad/final steps
    if (stepData.isCalcStep || stepData.isMcqStep || stepData.isNumpadStep || 
        stepData.isTransitionStep || stepData.isMcqStep2 || stepData.isFinalStep) {
      return React.createElement(CalculationPanel, {
        step: step,
        onEnableNext: onEnableNext,
        onUpdateNavText: (navText) => onUpdateTexts(null, navText),
        onUpdateQuestionText: (text) => onUpdateTexts(text, null),
        imageSrc: getImageSrc(),
        onUpdateImage: onUpdateImage,
      });
    }

    return null;
  };

  return renderContent();
};
