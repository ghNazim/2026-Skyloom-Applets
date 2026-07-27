const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [canGoPrevQuestion, setCanGoPrevQuestion] = useState(false);
  const [isQuizAnimating, setIsQuizAnimating] = useState(false);
  const goPrevQuestionRef = useRef(null);

  const isFullscreenStep = currentStep === 0 || currentStep === 2;

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setDynamicNavText(null);
    setIsNextDisabled(true);
    setCanGoPrevQuestion(false);
    setIsQuizAnimating(false);
    setResetKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (currentStep === 1) {
      setDynamicNavText(null);
      setIsNextDisabled(true);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (isNextDisabled) return;
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 1 && goPrevQuestionRef.current) {
      goPrevQuestionRef.current();
    }
  };

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const updateNavText = useCallback((nav) => {
    setDynamicNavText(nav);
  }, []);

  const registerGoPrevQuestion = useCallback((fn) => {
    goPrevQuestionRef.current = fn;
  }, []);

  const getQuestionText = () => {
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.questionText : "";
  };

  const getNavText = () => {
    if (dynamicNavText !== null && dynamicNavText !== undefined) {
      return dynamicNavText;
    }
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.navText : "";
  };

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
        }),
      ),
    );
  }

  if (currentStep === 2) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.final.heading,
          text: APP_DATA.final.text,
          buttonText: APP_DATA.final.buttonText,
          onButtonClick: handleRestart,
        }),
      ),
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    !isFullscreenStep &&
      React.createElement(QuestionPanel, {
        text: getQuestionText(),
      }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        key: resetKey,
        step: currentStep,
        onSetNextEnabled: setNextEnabled,
        onUpdateNavText: updateNavText,
        onPrevAvailabilityChange: setCanGoPrevQuestion,
        onAnimatingChange: setIsQuizAnimating,
        registerGoPrevQuestion: registerGoPrevQuestion,
      }),
    ),
    !isFullscreenStep &&
      React.createElement(
        "div",
        { className: "lower-panel" },
        React.createElement(Navigation, {
          onNav: (dir) =>
            dir === "next"
              ? handleNext()
              : dir === "prev"
              ? handlePrev()
              : null,
          isNextDisabled: isNextDisabled,
          isPrevDisabled:
            currentStep !== 1 || !canGoPrevQuestion || isQuizAnimating,
          navText: getNavText(),
        }),
      ),
  );
};
