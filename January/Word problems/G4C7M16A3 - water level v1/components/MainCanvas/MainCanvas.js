const MainCanvas = ({ 
  step, 
  onEnableNext, 
  onUpdateTexts,
  onUpdateImage,
  currentImage,
  comprehendSubstep = 0,
  interactiveBoxState,
  setInteractiveBoxState,
  calcState,
  setCalcState
}) => {
  const { useState, useEffect } = React;

  // Reset state when step changes
  useEffect(() => {
    const stepData = APP_DATA.steps[step];
    if (stepData) {
      // Update texts
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
        // Left Column - Visual
        React.createElement(
          "div",
          { className: "column visual-column" },
          React.createElement(Visual, {
            imageSrc: getImageSrc(),
            showAreaLabel: false,
            step: step,
            substep: comprehendSubstep
          })
        ),
        // Right Column - Comprehend
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
    
    // Step 3: Drag and Drop
    if (stepData.isDragDrop) {
      return React.createElement(DragDropPanel, {
        onComplete: () => {},
        onEnableNext: onEnableNext,
        onUpdateNavText: (navText) => onUpdateTexts(null, navText),
        imageSrc: getImageSrc()
      });
    }
    
    // Steps 4-9: Calculation Panel
    if (stepData.isInteractiveBoxes || stepData.isCalculation) {
      return React.createElement(CalculationPanel, {
        step: step,
        calcPhase: stepData.calcPhase,
        onEnableNext: onEnableNext,
        onUpdateNavText: (navText) => onUpdateTexts(null, navText),
        interactiveBoxState: interactiveBoxState,
        setInteractiveBoxState: setInteractiveBoxState,
        calcState: calcState,
        setCalcState: setCalcState,
        imageSrc: getImageSrc()
      });
    }
    
    return null;
  };

  return renderContent();
};
