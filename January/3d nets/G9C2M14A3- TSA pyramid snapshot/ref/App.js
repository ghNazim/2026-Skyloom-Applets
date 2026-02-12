const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [questionText, setQuestionText] = useState("");
  const [navText, setNavText] = useState("");
  const [isUnfolded, setIsUnfolded] = useState(false);
  const [unfoldValue, setUnfoldValue] = useState(0);
  const [mcqAnswered, setMcqAnswered] = useState(false);
  const [highlightAnimationDone, setHighlightAnimationDone] = useState(false);
  const unfoldAnimRef = useRef(null);

  // ---- Initialize step texts & state ----
  useEffect(() => {
    const stepData = APP_DATA.steps[currentStep];
    if (stepData) {
      setQuestionText(stepData.q);
      setNavText(stepData.n);
    }
    setMcqAnswered(false);

    // For steps 2+, ensure unfolded
    if (currentStep >= 2) {
      setIsUnfolded(true);
      setUnfoldValue(1);
    }

    // Enable next for non-interactive steps
    if ([2, 4, 5, 7].includes(currentStep)) {
      setIsNextDisabled(false);
    } else {
      setIsNextDisabled(true);
    }
  }, [currentStep]);

  // ---- Handlers ----
  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
    setIsUnfolded(false);
    setUnfoldValue(0);
    setHighlightAnimationDone(false);
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setIsUnfolded(false);
    setUnfoldValue(0);
    setIsNextDisabled(true);
    setMcqAnswered(false);
  };

  const handleUnfold = () => {
    if (typeof playSound === "function") playSound("click");
    const anim = { value: 0 };
    unfoldAnimRef.current = gsap.to(anim, {
      value: 1,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => setUnfoldValue(anim.value),
      onComplete: () => {
        setIsUnfolded(true);
        setUnfoldValue(1);
        // Update texts after unfold
        const stepData = APP_DATA.steps[1];
        setQuestionText(stepData.qAfterUnfold);
        setNavText(stepData.nAfterUnfold);
        setIsNextDisabled(false);
      },
    });
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
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    // No prev navigation in this applet
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

  // ==== STEP 8: Final fullscreen ====
  if (currentStep === 8) {
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

  // ==== STEPS 1-7: Main layout ====
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
        unfoldValue: unfoldValue,
        isUnfolded: isUnfolded,
        mcqAnswered: mcqAnswered,
        highlightAnimationDone: highlightAnimationDone,
        onHighlightAnimationComplete: () => setHighlightAnimationDone(true),
        onUnfold: handleUnfold,
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
        isPrevDisabled: true,
        navText: navText,
        nextSymbol: "»",
      })
    )
  );
};
