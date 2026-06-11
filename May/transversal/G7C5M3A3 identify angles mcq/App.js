const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [showNudge, setShowNudge] = useState(false);
  const [nudgePosition, setNudgePosition] = useState(null);
  const nudgeTimeoutRef = useRef(null);

  const totalQuestions = APP_DATA.questions.length;

  const hideNudge = useCallback(() => {
    setShowNudge(false);
    setNudgePosition(null);
  }, []);

  const resetProgress = useCallback(() => {
    setQuestionIndex(0);
    setResetKey((prev) => prev + 1);
    setIsNextDisabled(true);
    setDynamicNavText(null);
  }, []);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    resetProgress();
    setCurrentStep(1);
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    resetProgress();
    setCurrentStep(0);
  };

  useEffect(() => {
    if (currentStep === 1) {
      setIsNextDisabled(true);
      setDynamicNavText(null);
    }
  }, [currentStep, questionIndex]);

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();

    if (currentStep === 1) {
      if (questionIndex < totalQuestions - 1) {
        setQuestionIndex((prev) => prev + 1);
        setResetKey((prev) => prev + 1);
        setIsNextDisabled(true);
        setDynamicNavText(null);
      } else {
        setCurrentStep(2);
      }
    }
  };

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const updateTexts = useCallback((nav) => {
    if (nav !== undefined) setDynamicNavText(nav);
  }, []);

  const getNavText = () => {
    if (dynamicNavText !== null && dynamicNavText !== undefined) {
      return dynamicNavText;
    }
    if (currentStep === 1) return APP_DATA.nav.initial;
    return "";
  };

  useEffect(() => {
    if (nudgeTimeoutRef.current) clearTimeout(nudgeTimeoutRef.current);
    if (currentStep !== 0 && currentStep !== 2) return;

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

  useEffect(() => {
    if (currentStep !== 1) return;

    const updateNextNudge = () => {
      if (isNextDisabled) {
        hideNudge();
        return;
      }
      const nextBtn = document.getElementById("next-button");
      if (nextBtn) {
        setNudgePosition(nextBtn.getBoundingClientRect());
        setShowNudge(true);
      }
    };

    const timeoutId = setTimeout(updateNextNudge, 100);
    window.addEventListener("resize", updateNextNudge);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateNextNudge);
    };
  }, [currentStep, isNextDisabled, dynamicNavText, hideNudge]);

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

  if (currentStep === 2) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.final.heading,
          text: APP_DATA.final.text,
          buttonText: APP_DATA.final.buttonText,
          onButtonClick: handleRestart,
          isFinal: true,
        })
      ),
      React.createElement(Nudge, { show: showNudge, position: nudgePosition })
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: APP_DATA.questionText,
      step: currentStep,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        key: resetKey,
        questionIndex: questionIndex,
        isLastQuestion: questionIndex === totalQuestions - 1,
        onSetNextEnabled: setNextEnabled,
        onUpdateTexts: updateTexts,
      })
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
      })
    ),
    React.createElement(Nudge, { show: showNudge, position: nudgePosition })
  );
};
