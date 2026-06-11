const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [showNudge, setShowNudge] = useState(false);
  const [nudgePosition, setNudgePosition] = useState(null);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
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
    hideNudge();
    setCurrentStep(0);
    setIsNextDisabled(true);
    setDynamicNavText(null);
    setResetKey((prev) => prev + 1);
  };

  useEffect(() => {
    setDynamicNavText(null);
    if (currentStep >= 1 && currentStep <= 13) {
      setIsNextDisabled(true);
    } else if (currentStep === 14) {
      setIsNextDisabled(false);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    if (currentStep === 14) {
      handleRestart();
      return;
    }
    if (currentStep < 14) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    if (currentStep > 1 && !isAnimationRunning) {
      setDynamicNavText(null);
      setIsNextDisabled(true);
      setResetKey((prev) => prev + 1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const setAnimationBusy = useCallback((busy) => {
    setIsAnimationRunning(busy);
  }, []);

  const updateTexts = useCallback((nav) => {
    if (nav !== undefined) setDynamicNavText(nav);
  }, []);

  const getNavText = () => {
    if (dynamicNavText !== null && dynamicNavText !== undefined)
      return dynamicNavText;
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.navText : "";
  };

  // Nudge on Start button (step 0)
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

  // Nudge on Next when enabled (not on step 14 — Start Over is optional)
  useEffect(() => {
    if (currentStep === 0 || currentStep === 14) {
      hideNudge();
      return;
    }

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

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        key: resetKey,
        step: currentStep,
        onSetNextEnabled: setNextEnabled,
        onUpdateTexts: updateTexts,
        onHideAppNudge: hideNudge,
        onSetAnimationBusy: setAnimationBusy,
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) =>
          dir === "next" ? handleNext() : dir === "prev" ? handlePrev() : null,
        isNextDisabled: isNextDisabled,
        isPrevDisabled: currentStep <= 1 || isAnimationRunning,
        hidePrev: currentStep <= 1,
        navText: getNavText(),
        nextLabel:
          currentStep === 14
            ? APP_DATA.steps[14].nextButtonText
            : undefined,
      })
    ),
    React.createElement(Nudge, { show: showNudge, position: nudgePosition })
  );
};
