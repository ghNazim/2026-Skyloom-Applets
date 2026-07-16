const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [step9TransitionVersion, setStep9TransitionVersion] = useState(0);
  const [isStepAnimating, setIsStepAnimating] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [nudgePosition, setNudgePosition] = useState(null);
  const [nudgeTargetVersion, setNudgeTargetVersion] = useState(0);
  const nudgeTargetRef = useRef(null);
  const nudgeTimeoutRef = useRef(null);

  const hideNudge = useCallback(() => {
    setShowNudge(false);
    setNudgePosition(null);
  }, []);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    setIsStepAnimating(false);
    setCurrentStep(1);
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    setCurrentStep(0);
    setIsNextDisabled(true);
    setIsStepAnimating(false);
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setResetKey((prev) => prev + 1);
  };

  useEffect(() => {
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    if (currentStep === 3 || currentStep === 7) {
      setIsNextDisabled(false);
    } else {
      setIsNextDisabled(true);
    }
    setIsStepAnimating(false);
  }, [currentStep]);

  const handleNext = (overrideStep) => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    if (
      typeof overrideStep === "number" ||
      typeof overrideStep === "string"
    ) {
      setCurrentStep(overrideStep);
      return;
    }
    if (currentStep === 8) {
      setIsStepAnimating(true);
      setStep9TransitionVersion((prev) => prev + 1);
      return;
    }
    if (currentStep >= 3 && currentStep < 9) {
      setCurrentStep((prev) => prev + 1);
      return;
    }
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep <= 1 || isStepAnimating) return;
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    setIsStepAnimating(false);
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setResetKey((prev) => prev + 1);
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const updateTexts = useCallback((question, nav) => {
    if (question !== undefined) setDynamicQuestionText(question);
    if (nav !== undefined) setDynamicNavText(nav);
  }, []);

  const registerNudgeTarget = useCallback((rect) => {
    nudgeTargetRef.current = rect;
    setNudgeTargetVersion((v) => v + 1);
  }, []);

  const setAnimating = useCallback((animating) => {
    setIsStepAnimating(animating);
  }, []);

  const completeStep9Transition = useCallback(() => {
    setCurrentStep(9);
  }, []);

  const getQuestionText = () => {
    if (currentStep === 9) return "<strong>Activity Completed!!</strong>";
    if (dynamicQuestionText !== null) return dynamicQuestionText;
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.questionText : "";
  };

  const getNavText = () => {
    if (currentStep === 9) return "";
    if (dynamicNavText !== null && dynamicNavText !== undefined)
      return dynamicNavText;
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.navText : "";
  };

  const getNextButtonText = () => {
    if (currentStep === 3) return APP_DATA.steps[3].nextText;
    if (currentStep === 7) return APP_DATA.steps[7].nextText;
    if (currentStep === 8) return APP_DATA.steps[8].nextText;
    return "»";
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

  // Nudge on action button (registered by MainCanvas) or Next when enabled
  useEffect(() => {
    if (currentStep === 0) return;

    const updateNudge = () => {
      if (dynamicNavText === " ") {
        hideNudge();
        return;
      }

      if (currentStep === 3 && !isNextDisabled) {
        const nextBtn = document.getElementById("next-button");
        if (nextBtn) {
          setNudgePosition(nextBtn.getBoundingClientRect());
          setShowNudge(true);
        }
        return;
      }

      if (currentStep === 4 && !isNextDisabled) {
        const nextBtn = document.getElementById("next-button");
        if (nextBtn) {
          setNudgePosition(nextBtn.getBoundingClientRect());
          setShowNudge(true);
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

      if (currentStep === 7 && !isNextDisabled) {
        const nextBtn = document.getElementById("next-button");
        if (nextBtn) {
          setNudgePosition(nextBtn.getBoundingClientRect());
          setShowNudge(true);
        }
        return;
      }

      if (currentStep === 8 && !isNextDisabled) {
        const nextBtn = document.getElementById("next-button");
        if (nextBtn) {
          setNudgePosition(nextBtn.getBoundingClientRect());
          setShowNudge(true);
        }
        return;
      }

      if (
        currentStep === 1 ||
        currentStep === 2 ||
        currentStep === 4 ||
        currentStep === 5 ||
        currentStep === 6 ||
        currentStep === 8
      ) {
        const rect = nudgeTargetRef.current;
        if (rect) {
          setNudgePosition(rect);
          setShowNudge(true);
        } else {
          hideNudge();
        }
        return;
      }

      hideNudge();
    };

    const timeoutId = setTimeout(updateNudge, 150);
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
    nudgeTargetVersion,
  ]);

  if (currentStep === 4) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(MainCanvas, {
          key: resetKey,
          step: currentStep,
          onSetNextEnabled: setNextEnabled,
          onSetAnimating: setAnimating,
          onUpdateTexts: updateTexts,
          onNext: handleNext,
          onCompleteStep9Transition: completeStep9Transition,
          onRestart: handleRestart,
          onRegisterNudgeTarget: registerNudgeTarget,
          onHideNudge: hideNudge,
          step9TransitionVersion,
        })
      ),
      React.createElement(Nudge, { show: showNudge, position: nudgePosition })
    );
  }

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
        onSetAnimating: setAnimating,
        onUpdateTexts: updateTexts,
        onNext: handleNext,
        onCompleteStep9Transition: completeStep9Transition,
        onRestart: handleRestart,
        onRegisterNudgeTarget: registerNudgeTarget,
        onHideNudge: hideNudge,
        step9TransitionVersion,
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => (dir === "next" ? handleNext() : handlePrev()),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: currentStep === 1 || isStepAnimating,
        navText: getNavText(),
        nextButtonText: getNextButtonText(),
        centerButton:
          currentStep === 9
            ? {
                text: APP_DATA.final.buttonText,
                onClick: handleRestart,
                className: "nav-center-restart-btn fullscreen-button-style",
              }
            : null,
      })
    ),
    React.createElement(Nudge, { show: showNudge, position: nudgePosition })
  );
};
