const App = () => {
  const { useState, useEffect, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(1);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [nextButtonText, setNextButtonText] = useState("\u00BB");
  const [resetKey, setResetKey] = useState(0);
  const [showNudge, setShowNudge] = useState(false);
  const [nudgePosition, setNudgePosition] = useState(null);
  const [nudgeTarget, setNudgeTarget] = useState(null);

  const hideNudge = useCallback(() => {
    setShowNudge(false);
    setNudgePosition(null);
    setNudgeTarget(null);
  }, []);

  const showNudgeOn = useCallback((selector) => {
    setNudgeTarget(selector);
  }, []);

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    if (currentStep === 8) {
      setCurrentStep(1);
      setResetKey((k) => k + 1);
      setNextButtonText("\u00BB");
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      return;
    }
    if (currentStep < 8) {
      setCurrentStep((s) => s + 1);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
    }
  };

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const updateTexts = useCallback((question, nav) => {
    if (question !== undefined) setDynamicQuestionText(question);
    if (nav !== undefined) setDynamicNavText(nav);
  }, []);

  const getQuestionText = () => {
    if (dynamicQuestionText !== null) return dynamicQuestionText;
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.questionText || "" : "";
  };

  const getNavText = () => {
    if (dynamicNavText !== null) return dynamicNavText;
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.navText || "" : "";
  };

  useEffect(() => {
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setNudgeTarget(null);

    if ([1, 2, 3, 5].indexOf(currentStep) !== -1) {
      setIsNextDisabled(false);
    }
    if ([4, 6, 7].indexOf(currentStep) !== -1) {
      setIsNextDisabled(true);
    }
    if (currentStep === 8) {
      setIsNextDisabled(false);
      setNextButtonText(APP_DATA.steps[8].startOver);
    } else {
      setNextButtonText("\u00BB");
    }
  }, [currentStep]);

  useEffect(() => {
    const updateNudge = () => {
      if (nudgeTarget) {
        const el = document.querySelector(nudgeTarget);
        if (el) {
          setNudgePosition(el.getBoundingClientRect());
          setShowNudge(true);
        }
        return;
      }
      if (!isNextDisabled) {
        const nextBtn = document.getElementById("next-button");
        if (nextBtn) {
          setNudgePosition(nextBtn.getBoundingClientRect());
          setShowNudge(true);
        }
        return;
      }
      hideNudge();
    };
    const tid = setTimeout(updateNudge, 250);
    window.addEventListener("resize", updateNudge);
    return () => {
      clearTimeout(tid);
      window.removeEventListener("resize", updateNudge);
    };
  }, [currentStep, isNextDisabled, dynamicNavText, hideNudge, resetKey, nudgeTarget]);

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
        onSetNextEnabled: setNextEnabled,
        onUpdateTexts: updateTexts,
        onHideNudge: hideNudge,
        onShowNudge: showNudgeOn,
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => (dir === "next" ? handleNext() : null),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: true,
        hidePrev: true,
        navText: getNavText(),
        nextButtonText: nextButtonText,
      }),
    ),
    React.createElement(Nudge, { show: showNudge, position: nudgePosition }),
  );
};
