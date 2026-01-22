const MainCanvas = ({ 
  step, 
  onEnableNext, 
  onAdvanceStep, 
  onUpdateTexts,
  isAnswered,
  setIsAnswered,
  step5QuestionIndex = 0
}) => {
  const { useState, useEffect, useRef } = React;

  // MCQ States
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wrongShake, setWrongShake] = useState(false);
  const [showFractionBox, setShowFractionBox] = useState(false);

  // Glow states for visual panel
  const [glowFilled, setGlowFilled] = useState(false);
  const [glowAll, setGlowAll] = useState(false);

  // State reset pattern for immediate updates (prevents flash)
  const [prevStep5QuestionIndex, setPrevStep5QuestionIndex] = useState(step5QuestionIndex);
  if (step5QuestionIndex !== prevStep5QuestionIndex) {
    setPrevStep5QuestionIndex(step5QuestionIndex);
    setSelectedOption(null);
    setIsCorrect(false);
    setWrongShake(false);
    setShowFractionBox(false);
    setGlowFilled(false);
    setGlowAll(false);
  }

  // Reset state when main step changes or step5 question index changes
  useEffect(() => {
    setSelectedOption(null);
    setIsCorrect(false);
    setWrongShake(false);
    setShowFractionBox(false);
    setGlowFilled(false);
    setGlowAll(false);

    // Step-specific initializations
    const stepData = APP_DATA.steps[step];
    if (stepData) {
      // Update texts
      const navText = stepData.navText || "";
      const questionText = stepData.questionText || "";
      onUpdateTexts(questionText, "", navText);

      // Enable next for non-MCQ steps (step 5 has questions array instead of mcq)
      // Step 4 is instruction step but sometimes doesn't fall into !mcq trap depending on object structure
      if ((!stepData.mcq && !stepData.questions) || step === 4) {
        onEnableNext();
      }

      // Set glow states
      if (stepData.glowAllSquares) {
        setGlowAll(true);
      }
      if (stepData.glowFilledSquares) {
        setGlowFilled(true);
      }
    }
  }, [step, step5QuestionIndex]);

  // Handle MCQ Option Click
  const handleOptionClick = (option) => {
    if (isCorrect) return;

    const stepData = APP_DATA.steps[step];
    if (!stepData) return;
    
    // Handle step 5 with questions array
    if (step === 5 && stepData.questions) {
      const currentQuestion = stepData.questions[step5QuestionIndex];
      const correctAnswer = currentQuestion.answer;
      
      setSelectedOption(option);
      
      if (option === correctAnswer) {
        setIsCorrect(true);
        playSound("correct");
        setShowFractionBox(true);
        
        // Check if this is the last question
        const isLastQuestion = step5QuestionIndex === stepData.questions.length - 1;
        
        // Update nav text based on whether it's the last question
        if (isLastQuestion && stepData.navTextLast) {
          onUpdateTexts(null, null, stepData.navTextLast);
        } else if (stepData.navTextCorrect) {
          onUpdateTexts(null, null, stepData.navTextCorrect);
        }
        
        setTimeout(() => {
          onEnableNext();
          if (setIsAnswered) setIsAnswered(true);
        }, 500);
      } else {
        setIsCorrect(false);
        playSound("wrong");
        setWrongShake(true);
        setTimeout(() => setWrongShake(false), 400);
      }
      return;
    }
    
    // Original handling for steps with mcq property
    if (!stepData.mcq) return;

    setSelectedOption(option);

    const correctAnswer = stepData.mcq.answer;
    if (option === correctAnswer) {
      setIsCorrect(true);
      playSound("correct");
      setGlowFilled(false);
      setGlowAll(false);

      // Show fraction box for step 1
      if (step === 1) {
        setShowFractionBox(true);
      }

      // Update nav text to correct version
      if (stepData.navTextCorrect) {
        onUpdateTexts(null, null, stepData.navTextCorrect);
      }

      setTimeout(() => {
        onEnableNext();
        if (setIsAnswered) setIsAnswered(true);
      }, 500);
    } else {
      setIsCorrect(false);
      playSound("wrong");
      setWrongShake(true);
      
      // Trigger glow on wrong answer for step 1
      if (step === 1) {
        setGlowFilled(true);
      }
      
      setTimeout(() => setWrongShake(false), 400);
    }
  };

  const playSound = (name) => {
    if (window.playSound) window.playSound(name);
  };

  // Get step data
  const stepData = APP_DATA.steps[step];
  if (!stepData) return null;

  // Get current question data for step 5
  const currentStep5Question = step === 5 && stepData.questions 
    ? stepData.questions[step5QuestionIndex] 
    : null;

  // Determine what to show
  const showVisualColumn = !stepData.hideVisualColumn;
  const showMcq = stepData.mcq != null || (step === 5 && stepData.questions != null);
  
  // Custom logic for hiding fraction column content initially in Step 1
  // If hideFractionColumn is true, we hide the FractionPanel content until showFractionBox is true (which happens on correct answer)
  const isFractionColumnVisible = stepData.hideFractionColumn ? showFractionBox : true;

  // Column widths
  const visualWidth = showVisualColumn ? "35%" : "0%";
  
  // Calculate fraction column width
  // If Step 5 (wide), take more space.
  // If visual is hidden, main canvas gets more space.
  const fractionWidth = showVisualColumn 
    ? (showMcq ? "35%" : "65%") 
    : (showMcq ? "70%" : "100%");
    
  const mcqWidth = showMcq ? "30%" : "0%";

  // Visual Panel Props
  const visualProps = {
    filledSquares: stepData.filledSquares || 0,
    glowFilledSquares: glowFilled,
    glowAllSquares: glowAll,
    // Show labels for steps 1 through 4 (keeping context visible)
    showFilledLabel: step >= 1 && step <= 4,
    showTotalLabel: step >= 1 && step <= 4,
  };

  // Get percent number and numerator based on step
  let percentNumber = stepData.percentNumber || "";
  let numerator = stepData.numerator || "";
  
  if (step === 1 && showFractionBox) {
    // Hardcoded for step 1 answer state if needed, or stick to data
    // data.js says numerator 19, denom 100 for step 1
  }
  
  if (step === 5 && currentStep5Question) {
    percentNumber = currentStep5Question.percentNumber;
    numerator = currentStep5Question.numerator;
  }

  // Fraction Panel Props
  const fractionProps = {
    step: step,
    percentNumber: percentNumber,
    // Show Percent (Decimal Box):
    // Always render for steps 2-5 to prevent layout shift.
    // For step 5, we will handle visibility with opacity via decimalHidden.
    showPercent: (step >= 2), 
    
    // Show Equals:
    // Only show if we are showing the decimal/percent box logic
    // For Step 5, also render but hide opacity
    showEquals: (step >= 2),
    
    // Show Fraction (Fraction Box):
    // Always visible except maybe Step 1 initially? 
    // Step 1: Only when answered (controlled by isFractionColumnVisible)
    showFraction: true, 
    
    numerator: numerator,
    denominator: stepData.denominator || "100",
    
    // Numerator Color/Highlight:
    // User wants it blueish always except step 5.
    // highlightNumerator controls the color (numberColor) and the box border.
    // If we want just color, we might need to tweak FractionPanel, but assuming highlight is okay:
    highlightNumerator: step !== 5,  
    
    highlightDenominator: stepData.highlightDenominator || false,
    pulsateNumber: stepData.pulsateNumber || false,
    pulsatePercent: stepData.pulsatePercent || false,
    pulsateNumerator: stepData.pulsateNumerator || false,
    pulsateDenominator: stepData.pulsateDenominator || false,
    numberColor: step!==5? "#4fc3f7":"#ffffff",
    percentColor: "white",
    
    // Step 5 Specifics
    wide: step === 5,
    
    // Visibility props for Step 5 layout stability
    // In Step 5, if not answered (!showFractionBox), we hide the percent part (decimal box + equals)
    decimalHidden: step === 5 && !showFractionBox && !isAnswered,

    // Arrow props - Step 4 shows arrows
    showArrowToDenominator: step === 4,
    showArrowToNumerator: step === 4,
    arrowAnnotationTop: stepData.arrowAnnotationTop || "",
    arrowAnnotationBottom: stepData.arrowAnnotationBottom || "",
  };

  // MCQ data - handle both regular mcq and step 5 questions array
  let mcqData = null;
  if (stepData.mcq) {
    mcqData = {
      title: "",
      options: stepData.mcq.options,
      feedbacks: stepData.mcq.feedbacks,
    };
  } else if (step === 5 && currentStep5Question) {
    mcqData = {
      title: "",
      options: currentStep5Question.options,
      feedbacks: stepData.feedbacks,
    };
  }

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    // Visual Column
    showVisualColumn && React.createElement(
      "div",
      { 
        className: "column visual-column",
        style: { flex: `0 0 ${visualWidth}` }
      },
      React.createElement(VisualPanel, visualProps)
    ),
    // Fraction Column
    React.createElement(
      "div",
      { 
        className: "column fractions-column",
        style: { 
          flex: `0 0 ${fractionWidth}`,
          // Hide opacity if Step 1 and not visible yet
          opacity: isFractionColumnVisible ? 1 : 0
        }
      },
      // Render FractionPanel if it's visible or we just hide via opacity
      isFractionColumnVisible && React.createElement(FractionPanel, fractionProps)
    ),
    // MCQ Column
    showMcq && React.createElement(
      "div",
      { 
        className: "column mcq-column",
        style: { flex: `0 0 ${mcqWidth}` }
      },
      React.createElement(MCQPanel, {
        mcqData: mcqData,
        selectedOption: selectedOption,
        isCorrect: isCorrect,
        onOptionClick: handleOptionClick,
        showFeedback: true,
        shake: wrongShake,
      })
    )
  );
};
