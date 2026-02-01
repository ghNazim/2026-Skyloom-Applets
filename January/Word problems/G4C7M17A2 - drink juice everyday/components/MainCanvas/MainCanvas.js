const MainCanvas = ({ 
  step, 
  onEnableNext, 
  onUpdateTexts,
  comprehendSubstep = 0,
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

  // Determine what to render based on step type
  const renderContent = () => {
    // Step 1: Comprehend with substeps - LeftQuestion + Comprehend panels
    if (stepData.isComprehend && stepData.hasLeftQuestion) {
      return React.createElement(
        "div",
        { className: "main-canvas-container two-column" },
        // Left Column - Question with highlights
        React.createElement(
          "div",
          { className: "column visual-column" },
          React.createElement(LeftQuestion, {
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
    
    // Step 3: MCQ Step (L-mL relationship)
    if (stepData.isMcqStep) {
      return React.createElement(MCQPanelStep3, {
        step: step,
        mcqKey: stepData.mcqKey,
        onEnableNext: onEnableNext,
        onUpdateNavText: (navText) => onUpdateTexts(null, navText),
        calcState: calcState,
        setCalcState: setCalcState,
        showFindings: stepData.showEmptyFindings
      });
    }
    
    // Steps 9 and 11: Drag and Drop
    if (stepData.isDragDrop) {
      const dragDropKey = stepData.dragDropKey || "dragDrop1";
      return React.createElement(DragDropPanel, {
        onComplete: () => {},
        onEnableNext: onEnableNext,
        onUpdateNavText: (navText) => onUpdateTexts(null, navText),
        dragDropKey: dragDropKey,
        step: step,
        showQuestionInLeft: stepData.showQuestionInLeft
      });
    }
    
    // Steps 4-8, 10, 12, 13, 14: Calculation Steps (14 = final step, same layout + final answer)
    if (stepData.isCalcStep || stepData.isFinalStep) {
      return React.createElement(CalculationPanel, {
        step: step,
        onEnableNext: onEnableNext,
        onUpdateNavText: (navText) => onUpdateTexts(null, navText),
        calcState: calcState,
        setCalcState: setCalcState
      });
    }
    
    return null;
  };

  return renderContent();
};
