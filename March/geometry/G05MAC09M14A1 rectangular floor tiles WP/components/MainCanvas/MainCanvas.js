const MainCanvas = ({ 
  step, 
  onEnableNext, 
  onUpdateTexts,
  onUpdateImage,
  currentImage,
  comprehendSubstep = 0,
  showFloorButtonClicked,
  setShowFloorButtonClicked,
  showFloorVideoEnded,
  onVideoEnded,
  comprehendTileMagnifyClicked,
  comprehendTileMagnifyVideoEnded,
  onTileMagnifyClick,
  onTileMagnifyVideoEnded,
  step3McqAnswered,
  setStep3McqAnswered,
  step3FractionTapped,
  setStep3FractionTapped,
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
      const showVisualImage = comprehendSubstep >= 0;
      return React.createElement(
        "div",
        { className: "main-canvas-container two-column" },
        // Left Column - Visual (blank when comprehend substep -1)
        React.createElement(
          "div",
          { className: "column visual-column" },
          React.createElement(Visual, {
            imageSrc: showVisualImage ? getImageSrc() : "",
            showAreaLabel: false,
            step: step,
            substep: comprehendSubstep,
            showFloorButtonClicked: showFloorButtonClicked,
            showFloorVideoEnded: showFloorVideoEnded,
            onVideoEnded: onVideoEnded,
            comprehendTileMagnifyClicked: comprehendTileMagnifyClicked,
            comprehendTileMagnifyVideoEnded: comprehendTileMagnifyVideoEnded,
            onTileMagnifyClick: onTileMagnifyClick,
            onTileMagnifyVideoEnded: onTileMagnifyVideoEnded
          })
        ),
        // Right Column - Comprehend
        React.createElement(
          "div",
          { className: "column content-column" },
          React.createElement(Comprehend, {
            step: step,
            substep: comprehendSubstep,
            comprehendTileMagnifyClicked: comprehendTileMagnifyClicked
          })
        )
      );
    }
    
    // Step 3 and Step 6: Drag and Drop
    if (stepData.isDragDrop) {
      const dragDropKey = stepData.dragDropKey || "dragDrop1";
      return React.createElement(DragDropPanel, {
        onComplete: () => {},
        onEnableNext: onEnableNext,
        onUpdateNavText: (navText) => onUpdateTexts(null, navText),
        imageSrc: getImageSrc(),
        dragDropKey: dragDropKey,
        step: step
      });
    }
    
    // Steps 3, 5–9: Calculation Panel (calc+MCQ+box, three boxes, conversion MCQ, numpad, simplify+numpad, final)
    if (stepData.isCalcWithMcqAndBox || stepData.isInteractiveBoxes || stepData.isNumpad || stepData.isConversionMcq || stepData.isSimplifyNumpad || stepData.isFinalStep) {
      return React.createElement(CalculationPanel, {
        step: step,
        onEnableNext: onEnableNext,
        onUpdateNavText: (navText) => onUpdateTexts(null, navText),
        onUpdateQuestionText: (text) => onUpdateTexts(text, null),
        step3McqAnswered: step3McqAnswered,
        setStep3McqAnswered: setStep3McqAnswered,
        step3FractionTapped: step3FractionTapped,
        setStep3FractionTapped: setStep3FractionTapped,
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
