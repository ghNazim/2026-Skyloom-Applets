const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(1);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [nextButtonText, setNextButtonText] = useState("\u00BB");
  const [textsHidden, setTextsHiddenState] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [showNudge, setShowNudge] = useState(false);
  const [nudgePosition, setNudgePosition] = useState(null);
  const nudgeTargetRef = useRef(null);

  const hideNudge = useCallback(() => {
    setShowNudge(false);
    setNudgePosition(null);
  }, []);

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    setShowHint(false);
    setCurrentStep(1);
    setIsNextDisabled(false);
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setNextButtonText("\u00BB");
    setResetKey((prev) => prev + 1);
  };

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    if (currentStep === 11) {
      handleRestart();
      return;
    }
    if (currentStep < 11) {
      setCurrentStep((s) => s + 1);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      if (currentStep !== 10) {
        setNextButtonText("\u00BB");
      }
    }
  };

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const updateTexts = useCallback((question, nav) => {
    if (question !== undefined) setDynamicQuestionText(question);
    if (nav !== undefined) setDynamicNavText(nav);
  }, []);

  const setNextLabel = useCallback((text) => {
    if (text !== undefined) setNextButtonText(text);
  }, []);

  const handleTextsHidden = useCallback((hidden) => {
    setTextsHiddenState(hidden);
  }, []);

  const registerNudgeTarget = useCallback((rect) => {
    nudgeTargetRef.current = rect;
  }, []);

  const openHint = useCallback(() => {
    setShowHint(true);
  }, []);

  const closeHint = useCallback(() => {
    if (typeof playSound === "function") playSound("click");
    setShowHint(false);
  }, []);

  const getQuestionText = () => {
    if (textsHidden) return "\u00A0";
    if (dynamicQuestionText !== null) return dynamicQuestionText;
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.questionText : "";
  };

  const getNavText = () => {
    if (textsHidden) return "\u00A0";
    if (dynamicNavText !== null && dynamicNavText !== undefined) {
      return dynamicNavText;
    }
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.navText : "";
  };

  useEffect(() => {
    if (currentStep === 1) {
      setIsNextDisabled(false);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setNextButtonText("\u00BB");
    }
    if (currentStep === 2 || currentStep === 3) {
      setIsNextDisabled(false);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setNextButtonText("\u00BB");
    }
    if (currentStep === 4) {
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setNextButtonText("\u00BB");
    }
    if (currentStep === 5) {
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setIsNextDisabled(true);
      setNextButtonText("\u00BB");
    }
    if (currentStep === 6 || currentStep === 7) {
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setIsNextDisabled(true);
      setNextButtonText("\u00BB");
    }
    if (currentStep === 8) {
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setIsNextDisabled(false);
      setNextButtonText("\u00BB");
    }
    if (currentStep === 9) {
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setIsNextDisabled(false);
      setNextButtonText("\u00BB");
    }
    if (currentStep === 10) {
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setIsNextDisabled(true);
      setNextButtonText("\u00BB");
    }
    if (currentStep === 11) {
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setIsNextDisabled(false);
      setNextButtonText(APP_DATA.steps[11].nextText);
    }
  }, [currentStep]);

  useEffect(() => {
    if (textsHidden || showHint) {
      hideNudge();
      return;
    }

    const updateNudge = () => {
      if (currentStep === 4 && isNextDisabled) {
        const rect = nudgeTargetRef.current;
        if (rect) {
          setNudgePosition(rect);
          setShowNudge(true);
        } else {
          hideNudge();
        }
        return;
      }

      if (!isNextDisabled && currentStep < 11) {
        const nextBtn = document.getElementById("next-button");
        if (nextBtn) {
          setNudgePosition(nextBtn.getBoundingClientRect());
          setShowNudge(true);
        }
        return;
      }

      hideNudge();
    };

    const timeoutId = setTimeout(updateNudge, 200);
    window.addEventListener("resize", updateNudge);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateNudge);
    };
  }, [
    currentStep,
    isNextDisabled,
    dynamicNavText,
    textsHidden,
    showHint,
    hideNudge,
    resetKey,
  ]);

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
        onSetTextsHidden: handleTextsHidden,
        onSetNextLabel: setNextLabel,
        onRegisterNudgeTarget: registerNudgeTarget,
        onHideNudge: hideNudge,
        onOpenHint: openHint,
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
    showHint && React.createElement(Hint, { onClose: closeHint }),
  );
};
