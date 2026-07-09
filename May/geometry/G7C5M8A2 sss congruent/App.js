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
  const [step4QuestionFade, setStep4QuestionFade] = useState(false);
  const [step4NavFade, setStep4NavFade] = useState(false);
  const [step5NameRevealed, setStep5NameRevealed] = useState(false);
  const [step2ExitPending, setStep2ExitPending] = useState(false);
  const nudgeTargetRef = useRef(null);

  const hideNudge = useCallback(() => {
    setShowNudge(false);
    setNudgePosition(null);
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
    setStep4QuestionFade(false);
    setStep4NavFade(false);
    setStep5NameRevealed(false);
    setStep2ExitPending(false);
    setResetKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (currentStep === 1) {
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setIsNextDisabled(true);
      setNextButtonText("\u00BB");
    }
    if (currentStep === 2) {
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setIsNextDisabled(true);
      setNextButtonText("\u00BB");
      setStep2ExitPending(false);
    }
    if (currentStep === 3) {
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setIsNextDisabled(true);
      setNextButtonText(APP_DATA.steps[3].nextText);
    }
    if (currentStep === 4) {
      setDynamicNavText("");
      setDynamicQuestionText("");
      setStep4QuestionFade(false);
      setStep4NavFade(false);
      setIsNextDisabled(true);
    }
    if (currentStep === 5) {
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setStep5NameRevealed(false);
      setIsNextDisabled(true);
      setNextButtonText("\u00BB");
    }
  }, [currentStep]);

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
    if (currentStep === 5 && !isNextDisabled) {
      handleRestart();
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

  const handleStep4Phase = useCallback((phase) => {
    const stepData = APP_DATA.steps[4];
    if (phase === "question") {
      setDynamicQuestionText(stepData.questionOverlap);
      setStep4QuestionFade(true);
    }
    if (phase === "nav") {
      setDynamicNavText(stepData.navConclude);
      setStep4NavFade(true);
    }
  }, []);

  const handleStep5NameReveal = useCallback(() => {
    const stepData = APP_DATA.steps[5];
    setDynamicQuestionText(stepData.questionRevealed);
    setDynamicNavText(stepData.navCompleted);
    setStep5NameRevealed(true);
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
      const el = document.getElementById("start-button");
      if (el) {
        setNudgePosition(el.getBoundingClientRect());
        setShowNudge(true);
      }
    }, 500);
    return () => clearTimeout(tid);
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 0) return;

    const updateNudge = () => {
      if (currentStep === 4) {
        if (step4NavFade) {
          const concludeBtn = document.getElementById("conclude-button");
          if (concludeBtn) {
            setNudgePosition(concludeBtn.getBoundingClientRect());
            setShowNudge(true);
          }
        } else {
          hideNudge();
        }
        return;
      }
      if (currentStep === 5) {
        if (step5NameRevealed && !isNextDisabled) {
          const nextBtn = document.getElementById("next-button");
          if (nextBtn) {
            setNudgePosition(nextBtn.getBoundingClientRect());
            setShowNudge(true);
          }
        } else if (!step5NameRevealed) {
          const nameBtn = document.getElementById("name-button");
          if (nameBtn) {
            setNudgePosition(nameBtn.getBoundingClientRect());
            setShowNudge(true);
          } else {
            hideNudge();
          }
        }
        return;
      }
      if ((currentStep === 1 || currentStep === 2 || currentStep === 3) && !isNextDisabled) {
        const nextBtn = document.getElementById("next-button");
        if (nextBtn) {
          setNudgePosition(nextBtn.getBoundingClientRect());
          setShowNudge(true);
        }
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
    step4NavFade,
    step5NameRevealed,
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
      fadeIn: currentStep === 4 && step4QuestionFade,
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
        onStep4Phase: handleStep4Phase,
        onStep5NameReveal: handleStep5NameReveal,
        step2ExitPending: step2ExitPending,
        onStep2FadeComplete: handleStep2FadeComplete,
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
        hideNext: currentStep === 4,
        navText: getNavText(),
        nextButtonText: nextButtonText,
        navFadeIn: currentStep === 4 && step4NavFade,
        step: currentStep,
      }),
    ),
    React.createElement(Nudge, { show: showNudge, position: nudgePosition }),
  );
};
