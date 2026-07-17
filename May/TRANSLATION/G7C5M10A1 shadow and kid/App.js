const NUDGE_DELAY_MS = 1000;

const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(1);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [nextButtonText, setNextButtonText] = useState("\u00BB");
  const [resetKey, setResetKey] = useState(0);
  const [showNudge, setShowNudge] = useState(false);
  const [nudgePosition, setNudgePosition] = useState(null);
  const [hideNextButton, setHideNextButton] = useState(false);
  const nudgeElementRef = useRef(null);
  const nudgeDelayRef = useRef(null);
  const advanceRef = useRef(null);

  const hideNudge = useCallback(() => {
    if (nudgeDelayRef.current) {
      clearTimeout(nudgeDelayRef.current);
      nudgeDelayRef.current = null;
    }
    nudgeElementRef.current = null;
    setShowNudge(false);
    setNudgePosition(null);
  }, []);

  const handleRestart = useCallback(() => {
    hideNudge();
    setCurrentStep(1);
    setIsNextDisabled(false);
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setNextButtonText("\u00BB");
    setHideNextButton(false);
    setResetKey((k) => k + 1);
  }, [hideNudge]);

  const resetForStep = useCallback((targetStep) => {
    hideNudge();
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setNextButtonText("\u00BB");
    setHideNextButton(false);
    setIsNextDisabled(false);
    setResetKey((k) => k + 1);
    setCurrentStep(targetStep);
  }, [hideNudge]);

  const handleNext = useCallback(() => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    if (advanceRef.current && advanceRef.current()) return;
    if (currentStep === 1 && !isNextDisabled) {
      setCurrentStep(2);
    }
  }, [currentStep, isNextDisabled, hideNudge]);

  const handlePrev = useCallback(() => {
    if (currentStep <= 1) return;
    if (typeof playSound === "function") playSound("click");
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

  const setNextHidden = useCallback((hidden) => {
    setHideNextButton(!!hidden);
  }, []);

  const registerNudgeTarget = useCallback((target, options) => {
    const opts = options || {};
    const delay = opts.immediate
      ? 0
      : opts.delay !== undefined
        ? opts.delay
        : NUDGE_DELAY_MS;

    if (nudgeDelayRef.current) {
      clearTimeout(nudgeDelayRef.current);
    }
    nudgeElementRef.current = target;
    setShowNudge(false);
    setNudgePosition(null);

    nudgeDelayRef.current = setTimeout(() => {
      const el = nudgeElementRef.current;
      const rect =
        el && typeof el.getBoundingClientRect === "function"
          ? el.getBoundingClientRect()
          : el;
      if (!rect) return;
      setNudgePosition(rect);
      setShowNudge(true);
      nudgeDelayRef.current = null;
    }, delay);
  }, []);

  useEffect(() => {
    if (currentStep === 1) {
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setIsNextDisabled(false);
      setNextButtonText("\u00BB");
      setHideNextButton(false);
    }
  }, [currentStep]);

  const getQuestionText = () => {
    if (dynamicQuestionText !== null) return dynamicQuestionText;
    const stepData = APP_DATA.steps[currentStep];
    if (stepData && stepData.questionText) return stepData.questionText;
    if (currentStep === 2) return APP_DATA.steps[1].questionText;
    return "";
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
      if (currentStep === 1 && !isNextDisabled && !hideNextButton) {
        const nextBtn = document.getElementById("next-button");
        if (nextBtn) {
          setNudgePosition(nextBtn.getBoundingClientRect());
          setShowNudge(true);
        }
        return;
      }
      if (
        (currentStep === 2 && !isNextDisabled && !hideNextButton) ||
        (currentStep === 5 && !isNextDisabled && !hideNextButton)
      ) {
        const nextBtn = document.getElementById("next-button");
        if (nextBtn) {
          setNudgePosition(nextBtn.getBoundingClientRect());
          setShowNudge(true);
        }
        return;
      }
      if (currentStep >= 2 && currentStep <= 6) {
        if (!showNudge || !nudgeElementRef.current) return;
        const rect = nudgeElementRef.current.getBoundingClientRect();
        setNudgePosition(rect);
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
    hideNudge,
    resetKey,
    showNudge,
    hideNextButton,
  ]);

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: getQuestionText(),
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        key: resetKey,
        step: currentStep,
        advanceRef: advanceRef,
        onSetNextEnabled: setNextEnabled,
        onSetNextHidden: setNextHidden,
        onUpdateTexts: updateTexts,
        onSetNextLabel: setNextLabel,
        onStepChange: setCurrentStep,
        onRestart: handleRestart,
        onRegisterNudgeTarget: registerNudgeTarget,
        onHideNudge: hideNudge,
      }),
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
        hideNext: hideNextButton,
        navText: getNavText(),
        nextButtonText: nextButtonText,
        step: currentStep,
      }),
    ),
    React.createElement(Nudge, { show: showNudge, position: nudgePosition }),
  );
};
