const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [questionText, setQuestionText] = useState("");
  const [navText, setNavText] = useState("");
  const [mcqAnswered, setMcqAnswered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // ---- Initialize step texts & state ----
  useEffect(() => {
    const stepData = APP_DATA.steps[currentStep];
    if (stepData) {
      setQuestionText(stepData.q);
      setNavText(stepData.n);
    }
    setMcqAnswered(false);

    switch (currentStep) {
      case 1:
        setIsNextDisabled(true);
        setIsAnimating(false);
        break;
      case 2:
        setIsNextDisabled(false);
        setIsAnimating(false);
        break;
      case 3:
        setIsNextDisabled(true);
        setIsAnimating(true);
        break;
      case 4:
        setIsNextDisabled(true);
        setIsAnimating(true);
        break;
      case 5:
        setIsNextDisabled(true);
        setIsAnimating(false);
        break;
      case 6:
        setIsNextDisabled(false);
        setIsAnimating(false);
        break;
      default:
        setIsNextDisabled(true);
        setIsAnimating(false);
    }
  }, [currentStep]);

  // ---- Handlers ----
  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
    setIsAnimating(false);
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setIsNextDisabled(true);
    setMcqAnswered(false);
    setIsAnimating(false);
  };

  const handleUnfold = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(2);
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);
    setIsNextDisabled(false);
  };

  const handleMcqCorrect = () => {
    setMcqAnswered(true);
    const stepData = APP_DATA.steps[currentStep];
    if (stepData && stepData.nAfterCorrect) {
      setNavText(stepData.nAfterCorrect);
    }
    setIsNextDisabled(false);
  };

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (isAnimating) return;
    if (typeof playSound === "function") playSound("click");
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setMcqAnswered(false);
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

  // ==== STEP 7: Final fullscreen ====
  if (currentStep === 7) {
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

  // ==== STEPS 1-6: Main layout ====
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
        isAnimating: isAnimating,
        onUnfold: handleUnfold,
        onAnimationComplete: handleAnimationComplete,
        onMcqCorrect: handleMcqCorrect,
        onMcqWrong: () => {},
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
