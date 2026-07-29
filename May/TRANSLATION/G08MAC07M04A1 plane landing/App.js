const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(1);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [nextButtonText, setNextButtonText] = useState("\u00BB");
  const [questionCollapsed, setQuestionCollapsed] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [showNudge, setShowNudge] = useState(false);
  const [nudgePosition, setNudgePosition] = useState(null);
  const nudgeTargetRef = useRef(null);
  const advanceRef = useRef(null);

  const hideNudge = useCallback(() => {
    setShowNudge(false);
    setNudgePosition(null);
  }, []);

  const handleRestart = useCallback(() => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    setCurrentStep(1);
    setIsNextDisabled(false);
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setNextButtonText("\u00BB");
    setQuestionCollapsed(false);
    setResetKey((k) => k + 1);
  }, [hideNudge]);

  const resetForStep = useCallback(
    (targetStep) => {
      if (typeof playSound === "function") playSound("click");
      hideNudge();
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setNextButtonText("\u00BB");
      setQuestionCollapsed(false);
      setResetKey((k) => k + 1);
      setCurrentStep(targetStep);
    },
    [hideNudge]
  );

  const handleNext = useCallback(() => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    if (advanceRef.current && advanceRef.current()) return;
    if (currentStep < 6) {
      setCurrentStep((s) => s + 1);
    }
  }, [currentStep, hideNudge]);

  const handlePrev = useCallback(() => {
    if (currentStep <= 1) return;
    resetForStep(currentStep - 1);
  }, [currentStep, resetForStep]);

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

  const setQuestionPanelCollapsed = useCallback((collapsed) => {
    setQuestionCollapsed(!!collapsed);
  }, []);

  const registerNudgeTarget = useCallback((rect) => {
    nudgeTargetRef.current = rect;
  }, []);

  useEffect(() => {
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setNextButtonText("\u00BB");
    setQuestionCollapsed(false);
    if (currentStep === 1 || currentStep === 4 || currentStep === 5 || currentStep === 6) {
      setIsNextDisabled(false);
    } else {
      setIsNextDisabled(true);
    }
  }, [currentStep]);

  const getQuestionText = () => {
    if (dynamicQuestionText !== null) return dynamicQuestionText;
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

  useEffect(() => {
    const updateNudge = () => {
      if (!isNextDisabled) {
        const nextBtn = document.getElementById("next-button");
        if (nextBtn) {
          setNudgePosition(nextBtn.getBoundingClientRect());
          setShowNudge(true);
          return;
        }
      }

      if ((currentStep === 2 || currentStep === 3) && isNextDisabled) {
        const rect = nudgeTargetRef.current;
        if (rect) {
          setNudgePosition(rect);
          setShowNudge(true);
          return;
        }
      }

      hideNudge();
    };

    const timeoutId = setTimeout(updateNudge, 200);
    window.addEventListener("resize", updateNudge);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateNudge);
    };
  }, [currentStep, isNextDisabled, dynamicNavText, hideNudge, resetKey]);

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: getQuestionText(),
      collapsed: questionCollapsed,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        key: resetKey,
        step: currentStep,
        advanceRef: advanceRef,
        onSetNextEnabled: setNextEnabled,
        onUpdateTexts: updateTexts,
        onSetNextLabel: setNextLabel,
        onSetQuestionCollapsed: setQuestionPanelCollapsed,
        onRestart: handleRestart,
        onRegisterNudgeTarget: registerNudgeTarget,
        onHideNudge: hideNudge,
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => {
          if (dir === "next") handleNext();
          else if (dir === "prev") handlePrev();
        },
        isNextDisabled: isNextDisabled,
        isPrevDisabled: currentStep <= 1,
        hidePrev: false,
        navText: getNavText(),
        nextButtonText: nextButtonText,
      })
    ),
    React.createElement(Nudge, { show: showNudge, position: nudgePosition })
  );
};
