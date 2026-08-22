const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [nextButtonText, setNextButtonText] = useState("\u00BB");
  const [resetKey, setResetKey] = useState(0);
  const [showNudge, setShowNudge] = useState(false);
  const [nudgePosition, setNudgePosition] = useState(null);
  const [step6ActionReady, setStep6ActionReady] = useState(false);
  const [step8NameRevealed, setStep8NameRevealed] = useState(false);
  const [step2ExitPending, setStep2ExitPending] = useState(false);
  const [isPrevTemporarilyDisabled, setIsPrevTemporarilyDisabled] = useState(false);
  const [step1PointInteracted, setStep1PointInteracted] = useState(false);
  const [step1PointerDown, setStep1PointerDown] = useState(false);
  const nudgeTargetRef = useRef(null);

  const hideNudge = useCallback(() => {
    setShowNudge(false);
    setNudgePosition(null);
  }, []);

  const clearNudgeTarget = useCallback(() => {
    nudgeTargetRef.current = null;
  }, []);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    setCurrentStep(1);
    setIsNextDisabled(true);
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setNextButtonText("\u00BB");
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    setCurrentStep(0);
    setIsNextDisabled(true);
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setNextButtonText("\u00BB");
    setStep6ActionReady(false);
    setStep8NameRevealed(false);
    setStep2ExitPending(false);
    setIsPrevTemporarilyDisabled(false);
    setStep1PointInteracted(false);
    setStep1PointerDown(false);
    setResetKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (currentStep === 1) {
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setIsNextDisabled(true);
      setNextButtonText("\u00BB");
      setStep1PointInteracted(false);
      setStep1PointerDown(false);
    }
    if (currentStep === 2) {
      clearNudgeTarget();
      hideNudge();
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setIsNextDisabled(true);
      setNextButtonText("\u00BB");
      setStep2ExitPending(false);
    }
    if (currentStep === 3) {
      clearNudgeTarget();
      hideNudge();
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setIsNextDisabled(true);
      setNextButtonText(APP_DATA.steps[3].nextText);
    }
    if (currentStep === 4) {
      clearNudgeTarget();
      hideNudge();
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setIsNextDisabled(true);
      setNextButtonText(APP_DATA.steps[4].nextText);
    }
    if (currentStep === 5) {
      clearNudgeTarget();
      hideNudge();
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setIsNextDisabled(true);
      setNextButtonText("\u00BB");
    }
    if (currentStep === 6) {
      clearNudgeTarget();
      hideNudge();
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setIsNextDisabled(true);
      setNextButtonText("\u00BB");
      setStep6ActionReady(false);
    }
    if (currentStep === 7) {
      clearNudgeTarget();
      hideNudge();
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setIsNextDisabled(true);
      setNextButtonText("\u00BB");
    }
    if (currentStep === 8) {
      clearNudgeTarget();
      hideNudge();
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setIsNextDisabled(true);
      setNextButtonText("\u00BB");
      setStep8NameRevealed(false);
    }
  }, [clearNudgeTarget, currentStep, hideNudge]);

  const handleNext = (overrideStep) => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    if (typeof overrideStep === "number") {
      setCurrentStep(overrideStep);
      return;
    }
    if (currentStep === 1 && !isNextDisabled) {
      setCurrentStep(2);
      return;
    }
    if (currentStep === 2 && !isNextDisabled && !step2ExitPending) {
      setStep2ExitPending(true);
      setIsNextDisabled(true);
      return;
    }
    if (currentStep === 3 && !isNextDisabled) {
      setCurrentStep(4);
      return;
    }
    if (currentStep === 4 && !isNextDisabled) {
      setCurrentStep(5);
      return;
    }
    if (currentStep === 5 && !isNextDisabled) {
      setCurrentStep(6);
    }
    if (currentStep === 8 && !isNextDisabled) {
      handleRestart();
    }
  };

  const handlePrev = () => {
    if (currentStep <= 1 || isPrevTemporarilyDisabled) return;
    if (typeof playSound === "function") playSound("click");
    clearNudgeTarget();
    hideNudge();
    if (currentStep === 8) {
      setCurrentStep(7);
      return;
    }
    if (currentStep === 7) {
      setCurrentStep(6);
      return;
    }
    if (currentStep === 6 || currentStep === 5) {
      setCurrentStep(4);
      return;
    }
    if (currentStep === 4) {
      setCurrentStep(3);
      return;
    }
    if (currentStep === 3) {
      setCurrentStep(2);
      return;
    }
    if (currentStep === 2) {
      setCurrentStep(1);
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

  const registerNudgeTarget = useCallback((rect) => {
    nudgeTargetRef.current = rect;
    setNudgePosition(rect);
    setShowNudge(true);
  }, []);

  const showNudgeAtElement = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) {
      hideNudge();
      return;
    }
    setNudgePosition(el.getBoundingClientRect());
    setShowNudge(true);
  }, [hideNudge]);

  const handleStep1PointInteractionStart = useCallback(() => {
    setStep1PointInteracted(true);
    setStep1PointerDown(true);
    hideNudge();
  }, [hideNudge]);

  const handleStep1PointInteractionEnd = useCallback(() => {
    setStep1PointerDown(false);
  }, []);

  const handleStep5Ready = useCallback(() => {
    setIsNextDisabled(true);
    setNextButtonText("\u00BB");
  }, []);

  const handleStep6Ready = useCallback(() => {
    setStep6ActionReady(true);
  }, []);

  const handleStep8NameReveal = useCallback(() => {
    const stepData = APP_DATA.steps[8];
    setDynamicQuestionText(stepData.questionRevealed);
    setDynamicNavText(stepData.navCompleted);
    setStep8NameRevealed(true);
    setIsNextDisabled(false);
    setNextButtonText(stepData.nextText);
  }, []);

  const handleStep2FadeComplete = useCallback(() => {
    setStep2ExitPending(false);
    setCurrentStep(3);
  }, []);

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
    if (currentStep !== 0) return;
    const tid = setTimeout(() => {
      showNudgeAtElement("start-button");
    }, 500);
    return () => clearTimeout(tid);
  }, [currentStep, showNudgeAtElement]);

  useEffect(() => {
    if (currentStep === 0) return;

    const updateNudge = () => {
      if (currentStep === 5) {
        const rect = nudgeTargetRef.current;
        if (rect) {
          setNudgePosition(rect);
          setShowNudge(true);
        } else {
          hideNudge();
        }
        return;
      }
      if (currentStep === 6) {
        if (step6ActionReady) showNudgeAtElement("try-angle-button");
        else hideNudge();
        return;
      }
      if (currentStep === 7) {
        const rect = nudgeTargetRef.current;
        if (rect) {
          setNudgePosition(rect);
          setShowNudge(true);
        } else {
          hideNudge();
        }
        return;
      }
      if (currentStep === 8) {
        if (!step8NameRevealed) showNudgeAtElement("name-button");
        else if (!isNextDisabled) showNudgeAtElement("next-button");
        else hideNudge();
        return;
      }
      if (currentStep === 1) {
        if (!step1PointInteracted) {
          showNudgeAtElement("vertex-a-point");
        } else if (!step1PointerDown && !isNextDisabled) {
          showNudgeAtElement("next-button");
        } else {
          hideNudge();
        }
        return;
      }
      if (currentStep === 4) {
        if (!isNextDisabled) showNudgeAtElement("next-button");
        else hideNudge();
        return;
      }
      if ((currentStep === 2 || currentStep === 3) && !isNextDisabled) {
        showNudgeAtElement("next-button");
        return;
      }
      const rect = nudgeTargetRef.current;
      if (rect) {
        setNudgePosition(rect);
        setShowNudge(true);
      } else {
        hideNudge();
      }
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
    showNudgeAtElement,
    step1PointInteracted,
    step1PointerDown,
    step6ActionReady,
    step8NameRevealed,
  ]);

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
          buttonId: "start-button",
        }),
      ),
      React.createElement(Nudge, { show: showNudge, position: nudgePosition }),
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: getQuestionText(),
      step: currentStep,
      fadeIn: false,
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
        onSetPrevDisabled: setIsPrevTemporarilyDisabled,
        onStep1PointInteractionStart: handleStep1PointInteractionStart,
        onStep1PointInteractionEnd: handleStep1PointInteractionEnd,
        onStep5Ready: handleStep5Ready,
        onStep6Ready: handleStep6Ready,
        onStep8NameReveal: handleStep8NameReveal,
        step2ExitPending: step2ExitPending,
        onStep2FadeComplete: handleStep2FadeComplete,
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => (dir === "next" ? handleNext() : handlePrev()),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: currentStep === 1 || isPrevTemporarilyDisabled || step2ExitPending,
        hideNext: false,
        navText: getNavText(),
        nextButtonText: nextButtonText,
        navFadeIn: false,
        step: currentStep,
      }),
    ),
    React.createElement(Nudge, { show: showNudge, position: nudgePosition }),
  );
};
