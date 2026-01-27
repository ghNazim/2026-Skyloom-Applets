const MainCanvas = ({ step, onEnableNext, onAdvanceStep, onUpdateTexts, onDisableNext }) => {
  const { useState, useEffect, useCallback, useRef } = React;

  // MCQ state
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [shake, setShake] = useState(false);
  const [showMCQ, setShowMCQ] = useState(false);
  const [mcqActive, setMcqActive] = useState(false);
  
  // Substep state for step 6
  const [substep, setSubstep] = useState(1);
  
  // Feedback box state for steps 8 and 9
  const [showFeedbackBox, setShowFeedbackBox] = useState(false);
  
  // MCQ timer ref
  const mcqTimerRef = useRef(null);

  // Play sound helper
  const playSound = (name) => {
    if (window.playSound) window.playSound(name);
  };

  // Reset state when step changes
  useEffect(() => {
    setSelectedOption(null);
    setIsCorrect(false);
    setShowFeedback(false);
    setShake(false);
    setShowMCQ(false);
    setMcqActive(false);
    setShowFeedbackBox(false);
    
    if (step === 6) {
      setSubstep(1);
    }
    
    if (mcqTimerRef.current) {
      clearTimeout(mcqTimerRef.current);
      mcqTimerRef.current = null;
    }
  }, [step]);

  // Update texts based on step and substep
  useEffect(() => {
    const stepData = APP_DATA.steps[step];
    if (!stepData) return;

    let q = stepData.questionText || "";
    let n = stepData.navText || "";

    // Handle step 2 nav text after correct
    if (step === 2 && isCorrect && stepData.navTextAfterCorrect) {
      n = stepData.navTextAfterCorrect;
    }
    
    // Handle step 6 substeps
    if (step === 6 && stepData.substeps) {
      const substepData = stepData.substeps[substep];
      if (substepData) {
        q = substepData.q || q;
        n = substepData.n || n;
        
        // When MCQ is active, use MCQ-specific question and nav text
        if (mcqActive) {
          q = substepData.mcqQuestionText || q;
          n = "Tap the correct answer.";
        }
      }
    }
    
    // Handle steps 8, 9
    if (step === 8 || step === 9) {
      if (isCorrect) {
        // After correct answer, show the "after correct" texts
        if (stepData.questionTextAfterCorrect) q = stepData.questionTextAfterCorrect;
        if (stepData.navTextAfterCorrect) n = stepData.navTextAfterCorrect;
      } else if (mcqActive) {
        // When MCQ is active, show MCQ-specific question text
        if (stepData.mcqQuestionText) q = stepData.mcqQuestionText;
        n = "Tap the correct answer.";
      }
    }

    onUpdateTexts && onUpdateTexts(q, null, n);
  }, [step, substep, isCorrect, mcqActive, onUpdateTexts]);

  // Get MCQ data based on step and substep
  const getMCQData = useCallback(() => {
    const stepData = APP_DATA.steps[step];
    if (!stepData) return null;
    
    if (step === 2) {
      return stepData.mcq || null;
    }
    
    if (step === 6 && stepData.substeps) {
      const substepData = stepData.substeps[substep];
      return substepData && substepData.mcq ? substepData.mcq : null;
    }
    
    if (step === 8 || step === 9) {
      return stepData.mcq || null;
    }
    
    return null;
  }, [step, substep]);

  const mcqData = getMCQData();

  // Handle animation complete callback from PlaceValuePanel
  const handleAnimationComplete = useCallback((currentSubstepOrStep) => {
    if (step === 6) {
      // Show MCQ after animation for substeps 1 and 2
      if (substep < 3) {
        setTimeout(() => {
          setShowMCQ(true);
          setMcqActive(true);
          setSelectedOption(null);
          setIsCorrect(false);
        }, 100);
      }
    } else if (step === 8 || step === 9) {
      // Show MCQ after animation
      setTimeout(() => {
        setShowMCQ(true);
        setMcqActive(true);
        setSelectedOption(null);
        setIsCorrect(false);
      }, 100);
    }
  }, [step, substep]);

  // Handle MCQ option click
  const handleOptionClick = useCallback((option) => {
    if (isCorrect) return; // Already answered correctly
    
    const currentMcqData = getMCQData();
    if (!currentMcqData) return;
    
    setSelectedOption(option);
    const correct = String(option) === String(currentMcqData.answer);
    setIsCorrect(correct);
    
    if (step === 2) {
      // Step 2: Show feedback
      setShowFeedback(true);
      if (correct) {
        playSound("correct");
        onEnableNext && onEnableNext();
      } else {
        playSound("wrong");
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } else {
      // Steps 6-9: No feedback, just color and sound
      if (correct) {
        playSound("correct");
        
        // Hide MCQ after 1 second
        mcqTimerRef.current = setTimeout(() => {
          setShowMCQ(false);
          setMcqActive(false);
          
          if (step === 6) {
            // Move to next substep
            const nextSubstep = substep + 1;
            setSubstep(nextSubstep);
            setSelectedOption(null);
            setIsCorrect(false);
            
            // If moving to substep 3, update texts and enable next
            if (nextSubstep === 3) {
              const stepData = APP_DATA.steps[6];
              if (stepData && stepData.substeps && stepData.substeps[3]) {
                onUpdateTexts && onUpdateTexts(
                  stepData.substeps[3].q,
                  null,
                  stepData.substeps[3].n
                );
              }
              onEnableNext && onEnableNext();
            }
          } else if (step === 8 || step === 9) {
            // Show feedback box and enable next after correct answer
            setShowFeedbackBox(true);
            onEnableNext && onEnableNext();
          }
        }, 1000);
      } else {
        playSound("wrong");
        setShake(true);
        setTimeout(() => {
          setShake(false);
          setSelectedOption(null);
        }, 500);
      }
    }
  }, [step, substep, isCorrect, onEnableNext, onUpdateTexts, getMCQData]);

  // Handle dynamic text updates from PlaceValuePanel
  const handleUpdateTexts = useCallback((q, f, n) => {
    onUpdateTexts && onUpdateTexts(q, f, n);
  }, [onUpdateTexts]);

  // Render feedback box for steps 8 and 9
  const renderFeedbackBox = () => {
    if (!showFeedbackBox || (step !== 8 && step !== 9)) return null;
    
    const stepData = APP_DATA.steps[step];
    const feedbackText = stepData?.feedbackBoxText;
    if (!feedbackText) return null;
    
    return React.createElement(
      "div",
      { className: "step-feedback-box" },
      React.createElement("p", null, feedbackText)
    );
  };

  // Render MCQ Panel for steps 6, 8, 9 (no feedback)
  const renderNoFeedbackMCQPanel = () => {
    if (!showMCQ) return null;
    
    const currentMcqData = getMCQData();
    if (!currentMcqData) return null;
    
    return React.createElement(
      "div",
      {
        className: "mcq-panel-wrapper",
        style: {
          position: "absolute",
          right: 0,
          top: 0,
          width: "18%",
          height: "100%",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }
      },
      React.createElement(MCQPanel, {
        mcqData: currentMcqData,
        selectedOption: selectedOption,
        isCorrect: isCorrect,
        onOptionClick: handleOptionClick,
        showFeedback: false,
        shake: shake,
        noFeedback: true
      })
    );
  };

  // For steps 1-10, render the PlaceValuePanel
  if (step >= 1 && step <= 10) {
    return React.createElement(
      "div",
      { 
        className: "main-canvas-container place-value-canvas",
        style: { position: "relative" }
      },
      React.createElement(PlaceValuePanel, {
        step: step,
        onEnableNext: onEnableNext,
        onDisableNext: onDisableNext,
        onAdvanceStep: onAdvanceStep,
        mcqIsCorrect: step === 2 ? isCorrect : (step >= 6 ? isCorrect : null),
        mcqSelectedOption: step === 2 ? selectedOption : null,
        mcqActive: mcqActive,
        onAnimationComplete: handleAnimationComplete,
        onUpdateTexts: handleUpdateTexts,
        substep: substep,
        setSubstep: setSubstep,
        pulsateZeros: showFeedbackBox && (step === 8 || step === 9)
      }),
      // MCQ Panel for step 2
      step === 2 && React.createElement(
        "div",
        {
          style: {
            position: "absolute",
            right: 0,
            top: 0,
            width: "25%",
            height: "100%",
            zIndex: 100
          }
        },
        React.createElement(MCQPanel, {
          mcqData: mcqData,
          selectedOption: selectedOption,
          isCorrect: isCorrect,
          onOptionClick: handleOptionClick,
          showFeedback: showFeedback,
          shake: shake
        })
      ),
      // MCQ Panel for steps 6, 8, 9 (no feedback mode)
      (step === 6 || step === 8 || step === 9) && renderNoFeedbackMCQPanel(),
      // Feedback box for steps 8 and 9 (after correct MCQ)
      renderFeedbackBox()
    );
  }

  // Default: return empty container for other steps
  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    null
  );
};
