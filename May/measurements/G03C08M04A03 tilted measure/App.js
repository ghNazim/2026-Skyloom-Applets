const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [step5Trigger, setStep5Trigger] = useState(0);
  const [showNudge, setShowNudge] = useState(false);
  const [nudgePosition, setNudgePosition] = useState(null);
  const nudgeTimeoutRef = useRef(null);

  const hideNudge = useCallback(function () {
    setShowNudge(false);
    setNudgePosition(null);
  }, []);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    setCurrentStep(1);
  };

  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    setResetKey((prev) => prev + 1);
    setDynamicNavText(null);
    setStep5Trigger(0);
    setCurrentStep(0);
  };

  useEffect(() => {
    setDynamicNavText(null);
    if (currentStep >= 1 && currentStep <= 4) {
      setIsNextDisabled(true);
    } else if (currentStep === 5 || currentStep === 6) {
      setIsNextDisabled(false);
    } else if (currentStep === 7) {
      setIsNextDisabled(true);
    }
  }, [currentStep]);

  useEffect(() => {
    if (nudgeTimeoutRef.current) clearTimeout(nudgeTimeoutRef.current);
    if (currentStep !== 0) return;

    nudgeTimeoutRef.current = setTimeout(function () {
      const el = document.querySelector(".fullscreen-button");
      if (el) {
        setNudgePosition(el.getBoundingClientRect());
        setShowNudge(true);
      }
    }, 500);

    return function () {
      if (nudgeTimeoutRef.current) clearTimeout(nudgeTimeoutRef.current);
    };
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 0 || currentStep === 8) return;

    const updateNextNudge = function () {
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

    return function () {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateNextNudge);
    };
  }, [currentStep, isNextDisabled, dynamicNavText, hideNudge]);

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    if (currentStep === 5) {
      setIsNextDisabled(true);
      setStep5Trigger((prev) => prev + 1);
      return;
    }
    if (currentStep < 8) {
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

  const handleStep5Complete = useCallback(() => {
    setCurrentStep(6);
    setIsNextDisabled(false);
  }, []);

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const updateNavText = useCallback((nav) => {
    if (nav !== undefined && nav !== null) setDynamicNavText(nav);
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
          imageSrc: APP_DATA.start.imageSrc,
          onButtonClick: handleStart,
        })
      ),
      React.createElement(Nudge, { show: showNudge, position: nudgePosition })
    );
  }

  if (currentStep === 8) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.summary.heading,
          text: APP_DATA.summary.text,
          buttonText: APP_DATA.summary.buttonText,
          imageSrc: APP_DATA.summary.imageSrc,
          onButtonClick: handleStartOver,
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
      React.createElement(MainCanvas, {
        key: resetKey,
        step: currentStep,
        step5Trigger: step5Trigger,
        onSetNextEnabled: setNextEnabled,
        onUpdateNavText: updateNavText,
        onStep5Complete: handleStep5Complete,
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
        navText: getNavText(),
      })
    ),
    React.createElement(Nudge, { show: showNudge, position: nudgePosition })
  );
};
