const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const prevStepRef = useRef(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const isFullscreenStep =
    currentStep === 0 || currentStep === 3 || currentStep === 5;

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
  };

  const handleIntermissionBegin = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(4);
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setDynamicNavText(null);
    setIsNextDisabled(true);
    setResetKey((prev) => prev + 1);
  };

  useEffect(() => {
    const from = prevStepRef.current;
    prevStepRef.current = currentStep;

    // Entering step 1 from step 2 (back): MainCanvas restores quiz state, nav, and next — do not reset here.
    if (currentStep === 1 && from === 2) {
      return;
    }

    setDynamicNavText(null);
    if (currentStep === 1 || currentStep === 4) {
      setIsNextDisabled(true);
    } else if (currentStep === 2) {
      setIsNextDisabled(false);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (isNextDisabled) return;
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 2) {
      setCurrentStep(3);
      return;
    }
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const updateNavText = useCallback((nav) => {
    setDynamicNavText(nav);
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

  if (currentStep === 3) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.intermission.heading,
          text: APP_DATA.intermission.text,
          buttonText: APP_DATA.intermission.buttonText,
          onButtonClick: handleIntermissionBegin,
        }),
      ),
    );
  }

  if (currentStep === 5) {
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
          summaryCards: APP_DATA.final.summaryCards,
          isFinal: true,
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
          isPrevDisabled: currentStep <= 1,
          navText: getNavText(),
        }),
      ),
  );
};
