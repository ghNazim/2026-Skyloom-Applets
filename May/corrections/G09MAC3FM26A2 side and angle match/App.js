const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [nextButtonText, setNextButtonText] = useState("»");
  const [resetKey, setResetKey] = useState(0);
  const [showNudge, setShowNudge] = useState(false);
  const [nudgePosition, setNudgePosition] = useState(null);
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
    setNextButtonText("»");
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    setCurrentStep(0);
    setIsNextDisabled(true);
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setNextButtonText("»");
    setResetKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (currentStep === 1) {
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setIsNextDisabled(true);
      setNextButtonText("»");
    }
    if (currentStep === 2) {
      setIsNextDisabled(true);
      setNextButtonText("»");
    }
    if (currentStep === 3) {
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setIsNextDisabled(true);
      setNextButtonText("»");
    }
    if (currentStep === 4) {
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setIsNextDisabled(false);
      setNextButtonText(APP_DATA.steps[4].nextText);
    }
    if (currentStep === 5) {
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setIsNextDisabled(true);
      setNextButtonText("»");
    }
    if (currentStep === 6) {
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setIsNextDisabled(false);
      setNextButtonText(APP_DATA.steps[6].nextText);
    }
  }, [currentStep]);

  const handleNext = (overrideStep) => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    if (typeof overrideStep === "number") {
      setCurrentStep(overrideStep);
      return;
    }
    if (currentStep === 2 && !isNextDisabled) {
      setCurrentStep(3);
      return;
    }
    if (currentStep === 4 && !isNextDisabled) {
      setCurrentStep(5);
      return;
    }
    if (currentStep === 6 && !isNextDisabled) {
      setCurrentStep(7);
      return;
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
    if (currentStep === 0 || currentStep === 7) return;

    const updateNudge = () => {
      if (
        (currentStep === 2 || currentStep === 4 || currentStep === 6) &&
        !isNextDisabled
      ) {
        const nextBtn = document.getElementById("next-button");
        if (nextBtn) {
          setNudgePosition(nextBtn.getBoundingClientRect());
          setShowNudge(true);
        }
        return;
      }

      if (currentStep === 3) {
        const summarizeBtn = document.getElementById("summarize-button");
        if (summarizeBtn) {
          setNudgePosition(summarizeBtn.getBoundingClientRect());
          setShowNudge(true);
          return;
        }
      }

      if (currentStep === 5) {
        const summarizeBtn = document.getElementById("side-summarize-button");
        if (summarizeBtn) {
          setNudgePosition(summarizeBtn.getBoundingClientRect());
          setShowNudge(true);
          return;
        }
      }

      if (currentStep === 1 || currentStep === 2 || currentStep === 3 || currentStep === 5) {
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

    const timeoutId = setTimeout(updateNudge, 200);
    window.addEventListener("resize", updateNudge);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateNudge);
    };
  }, [currentStep, isNextDisabled, dynamicNavText, hideNudge, resetKey]);

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

  if (currentStep === 7) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.finish.heading,
          text: APP_DATA.finish.text,
          buttonText: APP_DATA.finish.buttonText,
          onButtonClick: handleRestart,
          buttonId: "start-over-button",
        }),
      ),
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
        onUpdateTexts: updateTexts,
        onSetNextLabel: setNextLabel,
        onNext: handleNext,
        onRegisterNudgeTarget: registerNudgeTarget,
        onHideNudge: hideNudge,
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
  );
};
