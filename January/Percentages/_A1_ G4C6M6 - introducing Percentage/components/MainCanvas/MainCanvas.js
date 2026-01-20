const MainCanvas = ({ step, onEnableNext, onAdvanceStep, onUpdateTexts, onDisableNext }) => {
  const { useState, useEffect, useCallback } = React;

  // Local state for sub-steps (Phases within step 1)
  const [subStep, setSubStep] = useState(0);

  // Slider States
  const [sliderH, setSliderH] = useState(0);
  const [sliderV, setSliderV] = useState(0);

  // Grid state
  const [showBigSquare, setShowBigSquare] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [gridBlinking, setGridBlinking] = useState(false);
  const [selectedSquareIndex, setSelectedSquareIndex] = useState(null);

  // Slider visibility
  const [showSliderH, setShowSliderH] = useState(false);
  const [showSliderV, setShowSliderV] = useState(false);
  const [disableSliderH, setDisableSliderH] = useState(false);
  const [disableSliderV, setDisableSliderV] = useState(false);

  // Nudge states
  const [showTapNudge, setShowTapNudge] = useState(false);
  const [showSliderHNudge, setShowSliderHNudge] = useState(false);
  const [showSliderVNudge, setShowSliderVNudge] = useState(false);

  // Action button - now in MCQ panel
  const [showActionButton, setShowActionButton] = useState(false);
  const [actionButtonText, setActionButtonText] = useState("");

  // Fraction panel state
  const [showPercentBox, setShowPercentBox] = useState(false);
  const [showFractionBox, setShowFractionBox] = useState(false);
  const [showDecimalBox, setShowDecimalBox] = useState(false);
  const [showBlinkingCursor, setShowBlinkingCursor] = useState(false);
  const [boxState, setBoxState] = useState("default");
  const [showLabels, setShowLabels] = useState(false);
  const [percentValue, setPercentValue] = useState(0);

  // MCQ panel state
  const [showMCQ, setShowMCQ] = useState(false);
  const [showMCQText, setShowMCQText] = useState(false);
  const [mcqTextContent, setMcqTextContent] = useState("");
  const [currentMCQIndex, setCurrentMCQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wrongShake, setWrongShake] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  // Check button state (step 3)
  const [showCheckButton, setShowCheckButton] = useState(false);
  const [checkDisabled, setCheckDisabled] = useState(false);

  // Track if slider moved
  const [hasSliderMoved, setHasSliderMoved] = useState(false);

  // Play sound helper
  const playSound = (name) => {
    if (window.playSound) window.playSound(name);
  };

  // Reset all state when step changes
  useEffect(() => {
    // Reset all states
    setSubStep(0);
    setSliderH(0);
    setSliderV(0);
    setShowBigSquare(false);
    setShowGrid(false);
    setGridBlinking(false);
    setSelectedSquareIndex(null);
    setShowSliderH(false);
    setShowSliderV(false);
    setDisableSliderH(false);
    setDisableSliderV(false);
    setShowTapNudge(false);
    setShowSliderHNudge(false);
    setShowSliderVNudge(false);
    setShowActionButton(false);
    setActionButtonText("");
    setShowPercentBox(false);
    setShowFractionBox(false);
    setShowDecimalBox(false);
    setShowBlinkingCursor(false);
    setBoxState("default");
    setShowLabels(false);
    setPercentValue(0);
    setShowMCQ(false);
    setShowMCQText(false);
    setMcqTextContent("");
    setCurrentMCQIndex(0);
    setSelectedOption(null);
    setIsCorrect(false);
    setWrongShake(false);
    setShowFeedback(false);
    setFeedbackText("");
    setShowCheckButton(false);
    setCheckDisabled(false);
    setHasSliderMoved(false);

    // Initialize based on step
    if (step === 1) {
      setShowBigSquare(true);
      setShowActionButton(true);
      setActionButtonText(APP_DATA.steps[1]?.phases?.[0]?.actionButton || "Divide the Unit Square");
      setShowTapNudge(true);
    } else if (step === 2) {
      setShowGrid(true);
      setShowSliderH(true);
      setShowSliderV(true);
      setShowPercentBox(true);
    } else if (step === 3) {
      setShowGrid(true);
      setShowSliderH(true);
      setShowSliderV(true);
      setShowPercentBox(true);
      setShowBlinkingCursor(true);
      setShowCheckButton(true);
    } else if (step === 4) {
      setShowGrid(true);
      setSliderH(0);
      setSliderV(7);
      setShowPercentBox(true);
      setPercentValue(7);
      setShowMCQ(true);
    }
  }, [step]);

  // Update texts based on step and substep - also runs on initial mount
  useEffect(() => {
    const stepData = APP_DATA.steps[step];
    if (!stepData) return;

    let q = "";
    let n = "";

    if (step === 1) {
      if (stepData.phases && stepData.phases[subStep]) {
        q = stepData.phases[subStep].q;
        n = stepData.phases[subStep].n;
      }
    } else if (step === 2) {
      q = stepData.q;
      n = hasSliderMoved ? stepData.nAfterSlider : stepData.n;
    } else if (step === 3) {
      if (isCorrect) {
        q = stepData.qCorrect;
        n = stepData.nCorrect;
      } else {
        q = stepData.q;
        n = stepData.n;
      }
    } else if (step === 4) {
      const mcqs = stepData.mcqs;
      if (currentMCQIndex < mcqs.length) {
        q = mcqs[currentMCQIndex].q;
        n = mcqs[currentMCQIndex].n;
      } else {
        q = stepData.qFinal;
        n = stepData.nFinal;
      }
    }

    onUpdateTexts(q, null, n);
  }, [step, subStep, hasSliderMoved, isCorrect, currentMCQIndex]);

  // Handle action button click (step 1 phase 0) - button is now in MCQ panel
  const handleActionButtonClick = () => {
    playSound("click");
    setShowBigSquare(false);
    setShowGrid(true);
    setGridBlinking(true);
    setShowActionButton(false);
    setShowTapNudge(false);
    setSubStep(1);
  };

  // Handle square click (step 1 phase 1)
  const handleSquareClick = (index) => {
    if (step !== 1 || subStep !== 1) return;
    
    playSound("click");
    setSelectedSquareIndex(index);
    setGridBlinking(false);
    setSubStep(2);
    
    // Show percent box
    setShowPercentBox(true);
    setPercentValue(1);
    
    // Show MCQ text
    setShowMCQText(true);
    setMcqTextContent(APP_DATA.steps[1].mcqText);
    
    // Enable next
    onEnableNext();
  };

  // Handle slider change
  const handleSliderChange = (e, type) => {
    const val = parseInt(e.target.value);
    playSound("tick");
    
    if (!hasSliderMoved) {
      setHasSliderMoved(true);
    }

    // Remove blinking cursor when slider moves
    setShowBlinkingCursor(false);
    
    // Reset box state if it was wrong
    if (boxState === "wrong") {
      setBoxState("default");
      setShowFeedback(false);
    }

    if (type === "h") {
      // Step 2 & 3: horizontal slider max is limited by vertical slider
      const maxH = sliderV > 0 ? 9 : 10;
      if (val <= maxH) {
        setSliderH(val);
        const total = val * 10 + sliderV;
        setPercentValue(Math.min(total, 100));
        
        if (step === 2) {
          onEnableNext();
        }
      }
    } else if (type === "v") {
      setSliderV(val);
      let newH = sliderH;
      if (val > 0 && sliderH === 10) {
        newH = 9;
        setSliderH(9);
      }
      const total = newH * 10 + val;
      setPercentValue(Math.min(total, 100));
      
      if (step === 2) {
        onEnableNext();
      }
    }
  };

  // Handle check button click (step 3)
  const handleCheckClick = () => {
    const target = APP_DATA.steps[3].targetValue;
    const current = sliderH * 10 + sliderV;

    if (current === target) {
      playSound("correct");
      setIsCorrect(true);
      setBoxState("correct");
      setFeedbackText(APP_DATA.steps[3].correctFeedback);
      setShowFeedback(true);
      setCheckDisabled(true);
      setDisableSliderH(true);
      setDisableSliderV(true);
      onEnableNext();
    } else {
      playSound("wrong");
      setBoxState("wrong");
      setWrongShake(true);
      setFeedbackText(APP_DATA.steps[3].wrongFeedback);
      setShowFeedback(true);
      setTimeout(() => setWrongShake(false), 300);
    }
  };

  // Handle MCQ option click (step 4)
  const handleMCQOptionClick = (option) => {
    if (isCorrect) return;
    
    setSelectedOption(option);
    const stepData = APP_DATA.steps[4];
    const currentMCQ = stepData.mcqs[currentMCQIndex];
    
    if (option === currentMCQ.answer) {
      playSound("correct");
      setIsCorrect(true);
      
      // Handle progression based on which MCQ just answered
      setTimeout(() => {
        // After MCQ 1 (7/100), show fraction box
        if (currentMCQIndex === 1) {
          setShowFractionBox(true);
        }
        // After MCQ 3 (0.07 - the last one), show decimal box and final state
        if (currentMCQIndex === 3) {
          setShowDecimalBox(true);
          setShowLabels(true);
          setShowMCQ(false);
          onEnableNext();
          // Increment past array length to trigger final texts in useEffect
          setCurrentMCQIndex(4);
          setSelectedOption(null);
          setIsCorrect(false);
          setShowFeedback(false);
        } else if (currentMCQIndex < stepData.mcqs.length - 1) {
          // Move to next MCQ (for MCQs 0, 1, 2)
          setCurrentMCQIndex(prev => prev + 1);
          setSelectedOption(null);
          setIsCorrect(false);
          setShowFeedback(false);
        }
      }, 1000);
    } else {
      playSound("wrong");
      setWrongShake(true);
      if (currentMCQ.wrongFeedback) {
        setFeedbackText(currentMCQ.wrongFeedback);
        setShowFeedback(true);
      }
      setTimeout(() => setWrongShake(false), 400);
    }
  };

  // Calculate fill for the grid based on sliders or selected square
  const calculateFilledSquare = () => {
    // In step 1 phase 2, return the selected square index
    if (step === 1 && subStep === 2 && selectedSquareIndex !== null) {
      return selectedSquareIndex;
    }
    return null;
  };

  // Render MCQ panel content
  const renderMCQPanel = () => {
    // Step 1 Phase 0: Show action button (Divide the Unit Square)
    if (step === 1 && subStep === 0 && showActionButton) {
      return React.createElement(
        "div",
        { className: "mcq-panel mcq-panel-centered" },
        React.createElement(
          "button",
          {
            className: "action-button",
            onClick: handleActionButtonClick,
          },
          actionButtonText,
          showTapNudge &&
            React.createElement("img", {
              src: "assets/tap.gif",
              className: "nudge-gif nudge-tap-button",
            })
        )
      );
    }
    
    // Step 1 Phase 2: Show text box with A Percent description
    if (step === 1 && showMCQText) {
      return React.createElement(
        "div",
        { className: "mcq-panel mcq-panel-centered" },
        React.createElement(
          "div",
          { className: "mcq-text-box" },
          mcqTextContent
        )
      );
    }
    
    // Step 3: Show check button and feedback
    if (step === 3) {
      return React.createElement(
        "div",
        { className: "mcq-panel" },
        React.createElement(
          "div",
          { className: "mcq-panel-content" },
          // Feedback area - always rendered but visibility controlled by CSS
          React.createElement(
            "div",
            { className: `mcq-feedback ${showFeedback ? (isCorrect ? "correct" : "incorrect") : ""}` },
            feedbackText
          ),
          // Check button (replaces options container)
          React.createElement(
            "div",
            { className: "mcq-wrapper" },
            React.createElement(
              "div",
              { className: "mcq-options-container column" },
              React.createElement(
                "button",
                {
                  className: `action-button check-button ${checkDisabled ? "disabled" : ""}`,
                  onClick: handleCheckClick,
                  disabled: checkDisabled,
                },
                "Check"
              )
            )
          )
        )
      );
    }
    
    // Step 4: Show MCQ options
    if (step === 4 && showMCQ) {
      const stepData = APP_DATA.steps[4];
      const currentMCQ = stepData.mcqs[currentMCQIndex];
      
      if (!currentMCQ) return null;
      
      return React.createElement(MCQPanel, {
        mcqData: {
          title: "",
          options: currentMCQ.options,
          feedbacks: {
            correct: currentMCQ.correctFeedback || "Correct!",
            wrong: currentMCQ.wrongFeedback || "Try again!",
          },
        },
        selectedOption: selectedOption,
        isCorrect: isCorrect,
        onOptionClick: handleMCQOptionClick,
        showFeedback: showFeedback,
        feedbackOverride: showFeedback ? feedbackText : null,
        shake: wrongShake,
      });
    }
    
    return null;
  };

  // Determine if MCQ column should be shown
  const showMcqColumn = 
    (step === 1 && subStep >= 0) ||  // Show MCQ column from step 1 phase 0 for action button
    step === 3 ||
    (step === 4 && showMCQ);

  const fracWidth = showMcqColumn ? "35%" : "60%";

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    // Visual Column
    React.createElement(
      "div",
      { className: "column visual-column visual-column-style" },
      React.createElement(VisualPanel, {
        step: step,
        subStep: subStep,
        showBigSquare: showBigSquare,
        showGrid: showGrid,
        gridBlinking: gridBlinking,
        selectedSquareIndex: selectedSquareIndex,
        sliderH: sliderH,
        sliderV: sliderV,
        showSliderH: showSliderH,
        showSliderV: showSliderV,
        disableSliderH: disableSliderH,
        disableSliderV: disableSliderV,
        onSliderChange: handleSliderChange,
        onSquareClick: handleSquareClick,
        showSliderHNudge: showSliderHNudge,
        showSliderVNudge: showSliderVNudge,
      })
    ),
    // Fractions Column
    React.createElement(
      "div",
      {
        className: "column fractions-column fractions-column-style",
        style: { flex: `0 0 ${fracWidth}` },
      },
      React.createElement(FractionPanel, {
        step: step,
        showPercentBox: showPercentBox,
        showFractionBox: showFractionBox,
        showDecimalBox: showDecimalBox,
        percentValue: percentValue,
        showBlinkingCursor: showBlinkingCursor,
        boxState: boxState,
        showLabels: showLabels,
      })
    ),
    // MCQ Column
    showMcqColumn && React.createElement(
      "div",
      { className: "column mcq-column mcq-column-style" },
      renderMCQPanel()
    )
  );
};
