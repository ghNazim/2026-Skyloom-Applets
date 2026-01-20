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

      // Update nav text and question text to correct version if available
      const nextNavText = stepData.navTextCorrect ? stepData.navTextCorrect : null;
      const nextQuestionText = stepData.questionTextCorrect ? stepData.questionTextCorrect : null;
      
      if (nextNavText || nextQuestionText) {
        onUpdateTexts(nextQuestionText, null, nextNavText);
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
  const isFractionColumnVisible = stepData.hideFractionColumn ? showFractionBox : true;

  // Column widths
  const visualWidth = showVisualColumn ? "35%" : "0%";
  const fractionWidth = showVisualColumn 
    ? (showMcq ? "35%" : "65%") 
    : (showMcq ? "70%" : "100%");
  const mcqWidth = showMcq ? "30%" : "0%";

  // Visual Panel Props
  const visualProps = {
    filledSquares: stepData.filledSquares || 0,
    glowFilledSquares: glowFilled,
    glowAllSquares: glowAll,
    showFilledLabel: step >= 1 && step <= 4,
    showTotalLabel: step >= 1 && step <= 4,
  };

  // Get values based on step or step 5 question
  let percentNumber = stepData.percentNumber || "";
  let numerator = stepData.numerator || "";
  let decimalValue = stepData.decimalValue || "";
  // Left Side Type
  let leftSideType = stepData.leftSideType || "fraction";

  if (step === 5 && currentStep5Question) {
    percentNumber = currentStep5Question.percentNumber;
    numerator = currentStep5Question.numerator;
    decimalValue = currentStep5Question.decimalValue;
    // Step 5 feedback interpolation happens in handleOptionClick logic implicitly? 
    // Actually we need to pass the raw feedback text to McqPanel, but App.js handles text updates?
    // Data has 'feedbacks' with <n> and <p> placeholders.
    // We should pre-interpolate them for the McqPanel? 
    // No, McqPanel usually takes static strings. 
    // But since the feedback text is dynamic per question (depends on number),
    // and the feedback string in data.js uses placeholders <n> and <p>,
    // we should process them here.
  }

  // Helper to interpolate feedback
  const getInterpolatedFeedback = (text) => {
    if (!text) return "";
    let n = numerator;
    let p = percentNumber;
    if (step === 5 && currentStep5Question) {
        n = currentStep5Question.numerator || currentStep5Question.percentNumber; // assuming 6 hundredths from 6%
        p = currentStep5Question.percentNumber + "%";
    } else {
        // Step 1 logic if needed, but Step 1 text is static in data.js
    }
    return text.replace(/<n>/g, n).replace(/<p>/g, p);
  };
  
  // Prepare MCQ Data with interpolated feedbacks
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
      
      // Dynamic feedbacks
      feedbacks: {
        correct: getInterpolatedFeedback(stepData.feedbacks.correct),
        wrong: getInterpolatedFeedback(stepData.feedbacks.wrong),
      },
    };
  }

  // Fraction Panel Props
  const fractionProps = {
    percentNumber: percentNumber,
    showPercent: stepData.showPercent, 
    showEquals: stepData.showPercent, // Usually goes with percent box
    showFraction: stepData.showFraction, // Legacy prop
    
    numerator: numerator, // Used if leftSideType is fraction
    denominator: stepData.denominator || "100",
    
    decimalValue: decimalValue,
    leftSideType: leftSideType,

    highlightNumerator: stepData.highlightNumerator, 
    // Step 5: right side (Percent) hidden until Answered
    decimalHidden: step === 5 && !showFractionBox && !isAnswered,
    fractionHidden: !isFractionColumnVisible,

    showArrowToDenominator: stepData.showArrowToDenominator,
    showArrowToNumerator: stepData.showArrowToNumerator,
    showArrowToDecimal: stepData.showArrowToDecimal,
    showArrowToPercent: stepData.showArrowToPercent,
    
    numberColor: step===5?"white":"#4fc3f7",
    wide: step === 5,
  };

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
