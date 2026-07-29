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
  const [isAnimating, setIsAnimating] = useState(false);
  const nudgeTargetRef = useRef(null);
  const nudgeElementRef = useRef(null);
  const nudgeDelayRef = useRef(null);

  const hideNudge = useCallback(() => {
    if (nudgeDelayRef.current) {
      clearTimeout(nudgeDelayRef.current);
      nudgeDelayRef.current = null;
    }
    nudgeTargetRef.current = null;
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
    setResetKey((k) => k + 1);
  }, [hideNudge]);

  const handleNext = (overrideStep, silent) => {
    if (!silent && typeof playSound === "function") playSound("click");
    hideNudge();
    if (typeof overrideStep === "number") {
      setCurrentStep(overrideStep);
      return;
    }
    if (currentStep === 1 && !isNextDisabled) {
      setCurrentStep(2);
      return;
    }
    if (currentStep === 5 && !isNextDisabled) {
      setCurrentStep(6);
      setIsNextDisabled(true);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setNextButtonText("\u00BB");
    }
    if (currentStep === 6 && !isNextDisabled) {
      handleRestart();
    }
  };

  const handlePrev = useCallback(() => {
    if (currentStep === 1 || isAnimating) return;
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    setNextButtonText("\u00BB");
    setCurrentStep((step) => Math.max(1, step - 1));
  }, [currentStep, hideNudge, isAnimating]);

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

  const registerNudgeTarget = useCallback((target, options) => {
    const opts = options || {};
    const delay = opts.immediate ? 0 : (opts.delay !== undefined ? opts.delay : NUDGE_DELAY_MS);

    if (nudgeDelayRef.current) {
      clearTimeout(nudgeDelayRef.current);
    }
    nudgeTargetRef.current = null;
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
      nudgeTargetRef.current = rect;
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
    }
    if (currentStep === 2) {
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setIsNextDisabled(true);
    }
    if (currentStep === 3) {
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setIsNextDisabled(true);
    }
    if (currentStep === 4) {
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setIsNextDisabled(true);
    }
    if (currentStep === 5) {
      setIsNextDisabled(true);
    }
    if (currentStep === 6) {
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setIsNextDisabled(true);
      setNextButtonText("\u00BB");
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
      if (currentStep === 1 && !isNextDisabled) {
        const nextBtn = document.getElementById("next-button");
        if (nextBtn) {
          setNudgePosition(nextBtn.getBoundingClientRect());
          setShowNudge(true);
        }
        return;
      }
      if (currentStep === 5 && isNextDisabled) {
        if (showNudge && nudgeElementRef.current) {
          const rect = nudgeElementRef.current.getBoundingClientRect();
          nudgeTargetRef.current = rect;
          setNudgePosition(rect);
        }
        return;
      }
      if (currentStep === 5 && !isNextDisabled) {
        const nextBtn = document.getElementById("next-button");
        if (nextBtn) {
          setNudgePosition(nextBtn.getBoundingClientRect());
          setShowNudge(true);
        }
        return;
      }
      if (currentStep === 6 && !isNextDisabled) {
        if (nextButtonText === APP_DATA.steps[6].nextText) {
          hideNudge();
          return;
        }
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
        nudgeTargetRef.current = rect;
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
  }, [currentStep, isNextDisabled, dynamicNavText, hideNudge, nextButtonText, resetKey, showNudge]);

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: getQuestionText(),
      step: currentStep,
      fadeIn: currentStep === 4,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        key: resetKey,
        step: currentStep,
        onSetNextEnabled: setNextEnabled,
        onUpdateTexts: updateTexts,
        onSetNextLabel: setNextLabel,
        onNext: handleNext,
        onRegisterNudgeTarget: registerNudgeTarget,
        onHideNudge: hideNudge,
        onAnimationStateChange: setIsAnimating,
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => (dir === "next" ? handleNext() : handlePrev()),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: currentStep === 1 || isAnimating,
        navText: getNavText(),
        nextButtonText: nextButtonText,
        step: currentStep,
        navFadeIn: currentStep === 4,
      }),
    ),
    React.createElement(Nudge, { show: showNudge, position: nudgePosition }),
  );
};
