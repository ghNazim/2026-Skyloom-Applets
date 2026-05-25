const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [showNudge, setShowNudge] = useState(false);
  const [nudgePosition, setNudgePosition] = useState(null);
  const nudgeTimeoutRef = useRef(null);

  const hideNudge = useCallback(() => {
    setShowNudge(false);
    setNudgePosition(null);
  }, []);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    setCurrentStep(1);
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setIsNextDisabled(true);
    setDynamicNavText(null);
    setDynamicQuestionText(null);
  };

  useEffect(() => {
    setDynamicNavText(null);
    setDynamicQuestionText(null);

    // Default next button state
    const autoDisableSteps = [1, 2, 3, 5, 6];
    if (autoDisableSteps.includes(currentStep)) {
      setIsNextDisabled(true);
    }
  }, [currentStep]);

  const handleNext = (overrideStep) => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    if (typeof overrideStep === 'string' || (typeof overrideStep === 'number' && overrideStep !== undefined && overrideStep.nativeEvent === undefined)) {
      setCurrentStep(overrideStep);
    } else if (typeof currentStep === 'number' && currentStep < 10) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    if (currentStep > 1) {
      setResetKey((prev) => prev + 1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const updateTexts = useCallback((nav, question) => {
    if (nav !== undefined) setDynamicNavText(nav);
    if (question !== undefined) setDynamicQuestionText(question);
  }, []);

  const getNavText = () => {
    if (dynamicNavText !== null && dynamicNavText !== undefined)
      return dynamicNavText;
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.navText : "";
  };

  const getQuestionText = () => {
    if (dynamicQuestionText !== null && dynamicQuestionText !== undefined)
      return dynamicQuestionText;
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.questionText : "";
  };

  // tap.gif on Start button (step 0 fullscreen only)
  useEffect(() => {
    if (nudgeTimeoutRef.current) clearTimeout(nudgeTimeoutRef.current);
    if (currentStep !== 0) return;
    nudgeTimeoutRef.current = setTimeout(() => {
      const el = document.querySelector(".fullscreen-button");
      if (el) {
        setNudgePosition(el.getBoundingClientRect());
        setShowNudge(true);
      }
    }, 500);
    return () => {
      if (nudgeTimeoutRef.current) clearTimeout(nudgeTimeoutRef.current);
    };
  }, [currentStep]);

  // tap.gif on Next when enabled (not on Start Over — optional for the user)
  useEffect(() => {
    if (currentStep === 0 || currentStep === 8) return;

    const updateNextNudge = () => {
      if (isNextDisabled) {
        hideNudge();
        return;
      }
      const nextBtn = document.getElementById("next-button");
      if (nextBtn) {
        setNudgePosition(nextBtn.getBoundingClientRect());
        setShowNudge(true);
      }
    };

    const timeoutId = setTimeout(updateNextNudge, 100);
    window.addEventListener("resize", updateNextNudge);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateNextNudge);
    };
  }, [currentStep, isNextDisabled, dynamicNavText, hideNudge]);

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
      ),
      React.createElement(Nudge, { show: showNudge, position: nudgePosition })
    );
  }

  if (currentStep === 8) {
    const stepData = APP_DATA.steps[8];
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: stepData.heading,
          text: stepData.text,
          buttonText: stepData.buttonText,
          onButtonClick: handleRestart,
        })
      )
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: getQuestionText(),
      step: currentStep,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      (currentStep === 4 || currentStep === 7) ? React.createElement(Splash, {
        step: currentStep,
      }) : React.createElement(MainCanvas, {
        key: resetKey,
        step: currentStep,
        onSetNextEnabled: setNextEnabled,
        onUpdateTexts: updateTexts,
        onNext: handleNext,
      })
    ),
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
        hidePrev: true,
        navText: getNavText(),
        nextSymbol: "»"
      })
    ),
    React.createElement(Nudge, { show: showNudge, position: nudgePosition })
  );
};
