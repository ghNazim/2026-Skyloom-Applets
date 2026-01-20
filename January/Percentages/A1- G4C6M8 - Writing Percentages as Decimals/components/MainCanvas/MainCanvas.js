const MainCanvas = ({ 
  step, 
  onEnableNext, 
  onAdvanceStep, 
  onUpdateTexts,
  isAnswered,
  setIsAnswered,
  questionIndex = 0 // Renamed from step5QuestionIndex
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
  const [prevQuestionIndex, setPrevQuestionIndex] = useState(questionIndex);
  if (questionIndex !== prevQuestionIndex) {
    setPrevQuestionIndex(questionIndex);
    setSelectedOption(null);
    setIsCorrect(false);
    setWrongShake(false);
    setShowFractionBox(false);
    setGlowFilled(false);
    setGlowAll(false);
  }

  // Reset state when main step changes or question index changes
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

      // Enable next for non-MCQ steps 
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
  }, [step, questionIndex]);

  // Handle MCQ Option Click
  const handleOptionClick = (option) => {
    if (isCorrect) return;

    const stepData = APP_DATA.steps[step];
    if (!stepData) return;
    
    // Handle steps with questions array (e.g. Step 8)
    if (stepData.questions) {
      const currentQuestion = stepData.questions[questionIndex];
      const correctAnswer = currentQuestion.answer;
      
      setSelectedOption(option);
      
      if (option === correctAnswer) {
        setIsCorrect(true);
        playSound("correct");
        setShowFractionBox(true);
        
        // Check if this is the last question
        const isLastQuestion = questionIndex === stepData.questions.length - 1;
        
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

  // Get current question data
  const currentQuestion = stepData.questions 
    ? stepData.questions[questionIndex] 
    : null;

  // Determine what to show
  const showVisualColumn = !stepData.hideVisualColumn;
  const showMcq = stepData.mcq != null || (stepData.questions != null);
  
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
    showFilledLabel: stepData.showFilledLabel !== undefined ? stepData.showFilledLabel : (step >= 1),
    showTotalLabel: step >= 1,
    orangeBorder: stepData.orangeBorderFilled || false, // New prop
    step: step, // Pass step for specific animations
  };
  
  // Logic for Step 1 showFilledLabelCorrect
  if (step === 1 && isCorrect) {
     visualProps.showFilledLabel = true;
  }

  // Get values based on step or question
  let percentNumber = stepData.percentNumber || "";
  let numerator = stepData.numerator || "";
  let decimalValue = stepData.decimalValue || "";
  // Left Side Type
  let leftSideType = stepData.leftSideType || "fraction";

  if (currentQuestion) {
    percentNumber = currentQuestion.percentNumber;
    numerator = currentQuestion.numerator;
    decimalValue = currentQuestion.decimalValue;
  }

  // Helper to interpolate feedback
  const getInterpolatedFeedback = (text) => {
    if (!text) return "";
    let n = numerator;
    let p = percentNumber;
    if (currentQuestion) {
        // Fallbacks for feedback var
        n = currentQuestion.numerator || currentQuestion.percentNumber; 
        p = currentQuestion.percentNumber + "%";
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
  } else if (currentQuestion) {
    mcqData = {
      title: "",
      options: currentQuestion.options,
      
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
    showEquals: stepData.showPercent, 
    showFraction: stepData.showFraction, 
    
    numerator: numerator, 
    denominator: stepData.denominator || "100",
    
    decimalValue: decimalValue,
    leftSideType: leftSideType,

    highlightNumerator: stepData.highlightNumerator, 
    
    // Hide Decimal part on request (e.g. Step 8 logic)
    // Step 8 request: "keep = and right decimal box in 0 opacity till user answers correctly"
    // FractionPanel property 'decimalHidden'. 
    // In Step 8 (reversed layout), 'decimalHidden' controls the right side? 
    // Yes, 'decimalHidden' controls Opacity of Includes Equals Sign + Decimal Box (Right Item normally, or Left Item if reversed? No, FractionPanel implementation looked at 'decimalHidden' usage)
    // In my FractionPanel implementation:
    // showEquals && ... opacity: decimalHidden ? 0 : 1
    // renderPercentBox (Right side by default) ... opacity: decimalHidden ? 0 : 1
    // BUT wait. Step 8 is Reversed Layout.
    // Left: Percent. Right: Decimal.
    // Request: "keep = and right decimal box in 0 opacity"
    // 'right decimal box' is the Decimal Box.
    // So we want to hide EQUALS and DECIMAL.
    // My FractionPanel implementation puts 'decimalHidden' opacity on Equals and on PercentBox (default Right).
    // If Reversed, PercentBox is Left.
    // I need 'decimalHidden' to apply to the RIGHT SIDE regardless of content?
    // Or I should rename/check logic.
    // Currently: 
    //   Equals: style: { opacity: decimalHidden ? 0 : 1 }
    //   PercentBox (Default Right): style: { opacity: decimalHidden ? 0 : 1 }
    //   LeftSideContent (Default Left): style: { opacity: fractionHidden ? 0 : 1 }
    // 
    // If Reversed:
    //   Left: PercentBox. (Uses decimalHidden?) -> We want Percent VISIBLE. 
    //   Right: LeftSideContent (Decimal). (Uses fractionHidden?) -> We want Decimal HIDDEN.
    //   Equals: Hidden.
    // 
    // So for Step 8:
    //   Percent (Left) -> Visible.
    //   Equals -> Hidden.
    //   Decimal (Right) -> Hidden.
    // 
    // So 'decimalHidden' hides PercentBox? That's wrong for Step 8.
    // And 'fractionHidden' hides Decimal? That's correct for Step 8 (Decimal is "LeftSideContent").
    // But 'decimalHidden' controls Equals.
    // So I set `decimalHidden = true` -> Hides Percent (Left) and Equals. WRONG. I want Percent Visible.
    // 
    // I need to update `FractionPanel` to decouple opacity control or match specific use case.
    // OR just use `fractionHidden` and `decimalHidden` smartly.
    // 
    // If I cannot change FractionPanel again easily (I can, but prefer not to churn), I should have checked this.
    // Let's look at FractionPanel logic again.
    // `renderPercentBox` uses `decimalHidden`.
    // `renderLeftSideContent` uses `fractionHidden`.
    // `Equals` uses `decimalHidden`.
    
    // Step 8 needs: Percent(Visible) = (Hidden) Decimal(Hidden).
    // Percent(Left) is `renderPercentBox`.
    // Decimal(Right) is `renderLeftSideContent`.
    
    // So I need `renderPercentBox` visible. -> `decimalHidden = false`.
    // But `Equals` visible? No.
    // So I can't hide Equals without hiding PercentBox via `decimalHidden`.
    // Limitation of current FractionPanel.
    // 
    // I will pass `decimalHidden` as false, but pass `showEquals` logic dynamically?
    // `showEquals: stepData.showPercent && (step !== 8 || isAnswered || isCorrect)`.
    // And `fractionHidden` controls the Right side (Decimal) in Reversed mode.
    // So `fractionHidden: step === 8 && !isAnswered`.
    
    // Step 1: Initially hide even the percent box until correct.
    // If hideFractionColumn is set (Step 1), and we haven't shown it (not correct), hide decimal/percent parts.
    decimalHidden: stepData.hideFractionColumn && !showFractionBox, 
    fractionHidden: !isFractionColumnVisible || (step === 1) || (stepData.questions && !isAnswered && !isCorrect), 
    showEquals: stepData.showPercent && (step !== 1) && (!stepData.questions || isAnswered || isCorrect),

    showArrowToDenominator: stepData.showArrowToDenominator,
    showArrowToNumerator: stepData.showArrowToNumerator,
    showArrowToDecimal: stepData.showArrowToDecimal,
    showArrowToPercent: stepData.showArrowToPercent,
    showArrowRightToLeft: stepData.showArrowRightToLeft, // New props
    reversedLayout: stepData.reversedLayout,

    pulsateTenths: stepData.pulsateTenths || false,
    pulsateHundredths: stepData.pulsateHundredths || false,
    highlightOnes: stepData.highlightOnes || false,
    highlightTenths: stepData.highlightTenths || false,
    highlightHundredths: stepData.highlightHundredths || false,
    activeLabels: stepData.activeLabels || false,
    equalsHidden: stepData.questions && !isAnswered && !isCorrect,
    groupedBreakdown: stepData.groupedBreakdown || false,
    
    numberColor: step === 8 ? "white" : "#4fc3f7", // Step 8 request: percent number should be white
    wide: stepData.questions != null, // Wide for step 8
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
          opacity: 1 // Managed inside panel props
        }
      },
      // Remove opacity wrapper here, let FractionPanel handle it via props
      React.createElement(FractionPanel, fractionProps)
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
