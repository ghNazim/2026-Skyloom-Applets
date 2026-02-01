const MainCanvas = ({
  step,
  onEnableNext,
  onUpdateTexts,
  onUpdateImage,
  currentImage,
  comprehendSubstep = 0,
  leftQuestionText = null,
  leftHighlights = null,
  leftHighlightColor = null,
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
    // Step 1: Comprehend with substeps - LeftQuestion in left panel (no visual)
    if (stepData.isComprehend && stepData.useLeftQuestion) {
      return React.createElement(
        "div",
        { className: "main-canvas-container two-column" },
        React.createElement(
          "div",
          { className: "column visual-column" },
          React.createElement(LeftQuestion, {
            text: leftQuestionText || APP_DATA.questionText,
            highlights: leftHighlights,
            highlightColor: leftHighlightColor
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

    // Step 1: Comprehend with Visual (legacy)
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
            substep: comprehendSubstep
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

    // Step 3 and Step 6: Drag and Drop (legacy)
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

    // Steps 3-7: Calculation Panel (convert mL to L flow)
    if (stepData.isCalcWithQuestion || stepData.isInteractiveBoxes || stepData.isNumpad || stepData.isMcq || stepData.isFinalStep) {
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
