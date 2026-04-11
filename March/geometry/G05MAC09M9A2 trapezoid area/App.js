const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [showNudge, setShowNudge] = useState(false);
  const [nudgePosition, setNudgePosition] = useState(null);
  const nudgeTimeoutRef = useRef(null);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setShowNudge(false);
    setCurrentStep(1);
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setIsNextDisabled(true);
    setResetKey(prev => prev + 1);
  };

  useEffect(() => {
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    if (currentStep === 4) {
      setIsNextDisabled(false);
    } else {
      setIsNextDisabled(true);
    }
  }, [currentStep]);

  // Nudge for Start button (step 0) only – other steps trigger from children
  useEffect(() => {
    if (nudgeTimeoutRef.current) {
      clearTimeout(nudgeTimeoutRef.current);
    }
    if (currentStep !== 0) {
      return;
    }
    nudgeTimeoutRef.current = setTimeout(() => {
      const el = document.querySelector(".fullscreen-button");
      if (el) {
        const rect = el.getBoundingClientRect();
        setNudgePosition(rect);
        setShowNudge(true);
      }
    }, 300);
    return () => {
      if (nudgeTimeoutRef.current) {
        clearTimeout(nudgeTimeoutRef.current);
      }
    };
  }, [currentStep]);

  const showNudgeAtElement = useCallback((el) => {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setNudgePosition(rect);
    setShowNudge(true);
  }, []);

  const hideNudge = useCallback(() => {
    setShowNudge(false);
  }, []);

  const handleNext = () => {
    if (currentStep !== 1) playSound("click");
    if (currentStep === 4) {
      setCurrentStep(5);
    } else if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep > 1) {
      setResetKey(prev => prev + 1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const updateTexts = useCallback((nav) => {
    if (nav !== undefined) setDynamicNavText(nav);
  }, []);

  const updateQuestionText = useCallback((text) => {
    if (text !== undefined) setDynamicQuestionText(text);
  }, []);

  const getQuestionText = () => {
    if (dynamicQuestionText !== null && dynamicQuestionText !== undefined) return dynamicQuestionText;
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.questionText : "";
  };

  const getNavText = () => {
    if (dynamicNavText !== null && dynamicNavText !== undefined) return dynamicNavText;
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.navText : "";
  };

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

  if (currentStep === 5) {
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
          imageSrc: APP_DATA.final.imageSrc,
        })
      )
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
        onUpdateQuestionText: updateQuestionText,
        onForceNext: handleNext,
        onHideNudge: hideNudge,
        onShowNudge: showNudgeAtElement,
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => (dir === "next" ? handleNext() : (dir === "prev" ? handlePrev() : null)),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: currentStep <= 1,
        navText: getNavText(),
      })
    ),
    React.createElement(Nudge, { show: showNudge, position: nudgePosition })
  );
};
