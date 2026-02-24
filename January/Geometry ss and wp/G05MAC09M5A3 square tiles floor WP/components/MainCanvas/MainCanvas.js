const MainCanvas = ({ 
  step, 
  onEnableNext, 
  onUpdateTexts,
  onUpdateImage,
  currentImage,
  comprehendSubstep = 0,
  showFloorVideoPlaying = false,
  onShowFloorClick,
  onShowFloorVideoEnded,
  interactiveBoxState1,
  setInteractiveBoxState1,
  interactiveBoxState2,
  setInteractiveBoxState2,
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
      const comprehendData = APP_DATA.comprehend;
      const showVideo = showFloorVideoPlaying && comprehendData && comprehendData.videoSrc;
      return React.createElement(
        "div",
        { className: "main-canvas-container two-column" },
        React.createElement(
          "div",
          { className: "column visual-column" },
          React.createElement(Visual, {
            imageSrc: showVideo ? "" : (showVisualImage ? getImageSrc() : ""),
            videoSrc: showVideo ? comprehendData.videoSrc : "",
            playVideo: showVideo,
            onVideoEnded: onShowFloorVideoEnded,
            showAreaLabel: false,
            step: step,
            substep: comprehendSubstep
          })
        ),
        React.createElement(
          "div",
          { className: "column content-column" },
          React.createElement(Comprehend, {
            step: step,
            substep: comprehendSubstep,
            onShowFloorClick: onShowFloorClick
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
    
    // Steps 4-5, 7-10: Calculation Panel
    if (stepData.isInteractiveBoxes || stepData.isNumpad || stepData.isMcq || stepData.isFinalStep) {
      return React.createElement(CalculationPanel, {
        step: step,
        onEnableNext: onEnableNext,
        onUpdateNavText: (navText) => onUpdateTexts(null, navText),
        interactiveBoxState1: interactiveBoxState1,
        setInteractiveBoxState1: setInteractiveBoxState1,
        interactiveBoxState2: interactiveBoxState2,
        setInteractiveBoxState2: setInteractiveBoxState2,
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
