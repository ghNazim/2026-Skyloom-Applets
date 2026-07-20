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
  const [farthestCompletedStep, setFarthestCompletedStep] = useState(0);
  const [isReviewingCompletedStep, setIsReviewingCompletedStep] = useState(false);
  const [isAnimationBusy, setIsAnimationBusy] = useState(false);
  const [step5Phase, setStep5Phase] = useState(1);

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
    if (currentStep === 5 && step5Phase === 1 && !isReviewingCompletedStep) {
      setStep5Phase(2);
      setIsNextDisabled(true);
      setDynamicNavText("");
      setDynamicQuestionText(null);
      return;
    }
    setFarthestCompletedStep((s) => Math.max(s, currentStep));
    if (currentStep === 8) {
      setCurrentStep(1);
      setResetKey((k) => k + 1);
      setNextButtonText("\u00BB");
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setFarthestCompletedStep(0);
      setIsReviewingCompletedStep(false);
      setStep5Phase(1);
      return;
    }
    if (currentStep < 8) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setIsReviewingCompletedStep(nextStep <= farthestCompletedStep);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setStep5Phase(1);
    }
  };

  const handlePrev = () => {
    if (currentStep <= 1 || isAnimationBusy) return;
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    setCurrentStep((s) => s - 1);
    setIsReviewingCompletedStep(true);
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setStep5Phase(2);
  };

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
    if (enabled && !(currentStep === 5 && step5Phase === 1)) {
      setFarthestCompletedStep((s) => Math.max(s, currentStep));
    }
  }, [currentStep, step5Phase]);

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
    setNudgeTarget(null);
    setIsAnimationBusy(false);
  }, [currentStep, isReviewingCompletedStep, step5Phase]);

  useEffect(() => {
    if (isReviewingCompletedStep || currentStep <= farthestCompletedStep) {
      setIsNextDisabled(false);
    } else if (currentStep === 5 && step5Phase === 1) {
      setIsNextDisabled(false);
    } else if ([1, 2].indexOf(currentStep) !== -1) {
      setIsNextDisabled(false);
    } else if ([3, 4, 5, 6, 7].indexOf(currentStep) !== -1) {
      setIsNextDisabled(true);
    }
    if (currentStep === 8) {
      setIsNextDisabled(false);
      setNextButtonText(APP_DATA.steps[8].startOver);
    } else {
      setNextButtonText("\u00BB");
    }
  }, [currentStep, farthestCompletedStep, isReviewingCompletedStep, step5Phase]);

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
        step5Phase: step5Phase,
        isCompletedView: isReviewingCompletedStep || currentStep < farthestCompletedStep,
        onSetNextEnabled: setNextEnabled,
        onSetAnimationBusy: setIsAnimationBusy,
        onUpdateTexts: updateTexts,
        onHideNudge: hideNudge,
        onShowNudge: showNudgeOn,
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => (dir === "next" ? handleNext() : handlePrev()),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: currentStep === 1 || isNextDisabled,
        hidePrev: false,
        navText: getNavText(),
        nextButtonText: nextButtonText,
      }),
    ),
    React.createElement(Nudge, { show: showNudge, position: nudgePosition }),
  );
};
