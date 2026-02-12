const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [questionText, setQuestionText] = useState("");
  const [navText, setNavText] = useState("");
  const [mcqAnswered, setMcqAnswered] = useState(false);
  const [mcq14Answered, setMcq14Answered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);
  const [actionBtnText, setActionBtnText] = useState(APP_DATA.buttons.visualize);


  // ---- Initialize step texts & state ----
  useEffect(() => {
    const stepData = APP_DATA.steps[currentStep];
    if (stepData) {
      setQuestionText(stepData.q);
      setNavText(stepData.n);
    }
    setMcqAnswered(false);
    setMcq14Answered(false);

    switch (currentStep) {
      case 1:
        // Visualize button active, next disabled
        setIsNextDisabled(true);
        break;
      case 2:
        // Unfold button, next disabled
        setIsNextDisabled(true);
        break;
      case 3:
        // Labels shown, next enabled
        setIsNextDisabled(false);
        break;
      case 4:
        // Morph animation, next disabled until animation completes
        setIsNextDisabled(true);
        setIsAnimating(true);
        break;
      case 5:
        // Unfold animation, next disabled until animation completes
        setIsNextDisabled(true);
        setIsAnimating(true);
        break;
      case 6:
      case 7:
      case 8:
      case 9:
        // Equation steps, next enabled
        setIsNextDisabled(false);
        break;
      case 10:
        // MCQ step, next disabled until correct answer
        setIsNextDisabled(true);
        break;
      case 11:
      case 12:
      case 13:
        // Equation steps, next enabled
        setIsNextDisabled(false);
        break;
      case 14:
        // MCQ step, next disabled until correct answer
        setIsNextDisabled(true);
        break;
      case 15:
      case 16:
        // Equation steps, next enabled
        setIsNextDisabled(false);
        break;
      default:
        setIsNextDisabled(true);
    }
  }, [currentStep]);

  // ---- Handlers ----
  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
    setIsAnimating(false);
    setAnimationDone(false);
    setActionBtnText(APP_DATA.buttons.visualize);
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setIsNextDisabled(true);
    setMcqAnswered(false);
    setMcq14Answered(false);
    setIsAnimating(false);
    setAnimationDone(false);
    setActionBtnText(APP_DATA.buttons.visualize);
  };

  const handleVisualise = () => {
    if (typeof playSound === "function") playSound("click");

    if (currentStep === 1) {
      // MainCanvas handles the hemisphere action internally
      setIsAnimating(true);
      setIsNextDisabled(true);
      setActionBtnText(APP_DATA.buttons.reset);
    } else if (currentStep === 2) {
      // Move to step 3 (show labels)
      setCurrentStep(3);
    }
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);
    
    if (currentStep === 1) {
      setAnimationDone(true);
      setIsNextDisabled(false);
      // Update texts after animation
      const stepData = APP_DATA.steps[1];
      if (stepData.qAfterAnim) setQuestionText(stepData.qAfterAnim);
      if (stepData.nAfterAnim) setNavText(stepData.nAfterAnim);
      setActionBtnText(APP_DATA.buttons.reset);
    } else {
      setIsNextDisabled(false);
    }
  };

  const handleMcqCorrect = () => {
    if (typeof confettiBurst === "function") confettiBurst();
    setMcqAnswered(true);
    const stepData = APP_DATA.steps[currentStep];
    if (stepData && stepData.nAfterCorrect) {
      setNavText(stepData.nAfterCorrect);
    }
    setIsNextDisabled(false);
  };

  const handleMcq14Correct = () => {
    if (typeof confettiBurst === "function") confettiBurst();
    setMcq14Answered(true);
    const stepData = APP_DATA.steps[currentStep];
    if (stepData && stepData.nAfterCorrect) {
      setNavText(stepData.nAfterCorrect);
    }
    setIsNextDisabled(false);
  };

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep < 17) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (isAnimating) return;
    if (typeof playSound === "function") playSound("click");
    if (currentStep <= 1) {
      setCurrentStep(0);
      return;
    }
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    // Reset state so user lands on previous step as if for the first time
    setAnimationDone(false);
    setMcqAnswered(false);
    setMcq14Answered(false);
    if (prevStep === 1) {
      setActionBtnText(APP_DATA.buttons.visualize);
    }
  };

  // ==== STEP 0: Start fullscreen ====
  if (currentStep === 0) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.start.heading,
          text: APP_DATA.start.text,
          buttonText: APP_DATA.start.buttonText,
          onButtonClick: handleStart,
        })
      )
    );
  }

  // ==== STEP 17: Final fullscreen ====
  if (currentStep === 17) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Final, {
          onRestart: handleRestart,
        })
      )
    );
  }

  // ==== STEPS 1-16: Main layout ====
  return React.createElement(
    "div",
    { className: "applet-container" },

    // Question Panel
    React.createElement(QuestionPanel, { text: questionText }),

    // Main Content
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        step: currentStep,
        mcqAnswered: mcqAnswered,
        mcq14Answered: mcq14Answered,
        isAnimating: isAnimating,
        onVisualise: handleVisualise,
        onAnimationComplete: handleAnimationComplete,
        onMcqCorrect: handleMcqCorrect,
        onMcq14Correct: handleMcq14Correct,
        onMcqWrong: () => {},
        actionBtnText: actionBtnText,
      })
    ),

    // Navigation
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => (dir === "next" ? handleNext() : handlePrev()),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: isAnimating,
        navText: navText,
        nextSymbol: "»",
      })
    )
  );
};
