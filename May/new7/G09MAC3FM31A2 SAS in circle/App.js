const NUDGE_DELAY_MS = 1000;
const LAST_STEP = 8;

const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(1);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [nextButtonText, setNextButtonText] = useState("»");
  const [resetKey, setResetKey] = useState(0);
  const [showNudge, setShowNudge] = useState(false);
  const [nudgePosition, setNudgePosition] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const nudgeElementRef = useRef(null);
  const nudgeDelayRef = useRef(null);

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
    setNextButtonText("»");
    setIsAnimating(false);
    setResetKey((k) => k + 1);
  }, [hideNudge]);

  const handleNext = useCallback(() => {
    if (isNextDisabled || isAnimating) return;
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    if (currentStep === LAST_STEP) {
      handleRestart();
      return;
    }
    setCurrentStep((step) => Math.min(LAST_STEP, step + 1));
  }, [currentStep, handleRestart, hideNudge, isAnimating, isNextDisabled]);

  const handlePrev = useCallback(() => {
    if (currentStep === 1 || isAnimating) return;
    if (typeof playSound === "function") playSound("click");
    hideNudge();
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
    const delay = opts.immediate ? 0 : opts.delay !== undefined ? opts.delay : NUDGE_DELAY_MS;

    if (nudgeDelayRef.current) clearTimeout(nudgeDelayRef.current);
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
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setNextButtonText(currentStep === LAST_STEP ? APP_DATA.steps[LAST_STEP].nextText : "»");
    setIsNextDisabled([4, 5, 6, 7].includes(currentStep));
    hideNudge();
  }, [currentStep, hideNudge]);

  useEffect(() => {
    const updateNudge = () => {
      if (isAnimating) {
        setShowNudge(false);
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

      if (currentStep === 5 && nudgeElementRef.current) {
        const rect = nudgeElementRef.current.getBoundingClientRect();
        setNudgePosition(rect);
        setShowNudge(true);
      }
    };

    const timeoutId = setTimeout(updateNudge, 200);
    window.addEventListener("resize", updateNudge);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateNudge);
    };
  }, [currentStep, hideNudge, isAnimating, isNextDisabled, nextButtonText, resetKey]);

  const getQuestionText = () => {
    if (dynamicQuestionText !== null) return dynamicQuestionText;
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.questionText : "";
  };

  const getNavText = () => {
    if (dynamicNavText !== null && dynamicNavText !== undefined) return dynamicNavText;
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.navText : "";
  };

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
        onSetNextLabel: setNextLabel,
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
        isNextDisabled: isNextDisabled || isAnimating,
        isPrevDisabled: currentStep === 1 || isAnimating,
        navText: getNavText(),
        nextButtonText: nextButtonText,
        step: currentStep,
      }),
    ),
    React.createElement(Nudge, { show: showNudge, position: nudgePosition }),
  );
};
