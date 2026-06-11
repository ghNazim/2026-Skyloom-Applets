const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [showNudge, setShowNudge] = useState(false);
  const [nudgePosition, setNudgePosition] = useState(null);
  const [nextTrigger, setNextTrigger] = useState(0);
  const [nextButtonText, setNextButtonText] = useState("\u00BB");
  const [canvasNudge, setCanvasNudge] = useState(null);
  const nudgeTimeoutRef = useRef(null);

  const hideNudge = useCallback(() => {
    setShowNudge(false);
    setNudgePosition(null);
  }, []);

  const handleSetCanvasNudge = useCallback((position) => {
    setCanvasNudge(position);
  }, []);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    setCurrentStep(1);
  };

  useEffect(() => {
    if (currentStep === 0) {
      setDynamicNavText(null);
      setDynamicQuestionText(null);
    }
    if (currentStep === 1) setIsNextDisabled(true);
  }, [currentStep]);

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    setNextTrigger((p) => p + 1);
  };

  const handleStartOver = () => {
    hideNudge();
    setCanvasNudge(null);
    setNextButtonText("\u00BB");
    setNextTrigger(0);
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setIsNextDisabled(true);
    setCurrentStep(0);
  };

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const updateTexts = useCallback((nav, question) => {
    if (nav !== undefined) setDynamicNavText(nav);
    if (question !== undefined) setDynamicQuestionText(question);
  }, []);

  const getNavText = () => {
    if (dynamicNavText !== null && dynamicNavText !== undefined)
      return dynamicNavText;
    return "";
  };
  const getQuestionText = () => {
    if (dynamicQuestionText !== null && dynamicQuestionText !== undefined)
      return dynamicQuestionText;
    return "";
  };

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

  useEffect(() => {
    if (currentStep === 0 || !canvasNudge) return;
    setNudgePosition(canvasNudge);
    setShowNudge(true);
  }, [canvasNudge, currentStep]);

  useEffect(() => {
    if (currentStep === 0) return;
    if (canvasNudge) return;
    if (nextButtonText === APP_DATA.gallery.startOverText) {
      hideNudge();
      return;
    }
    const update = () => {
      if (isNextDisabled) {
        hideNudge();
        return;
      }
      const btn = document.getElementById("next-button");
      if (btn) {
        setNudgePosition(btn.getBoundingClientRect());
        setShowNudge(true);
      }
    };
    const tid = setTimeout(update, 100);
    window.addEventListener("resize", update);
    return () => {
      clearTimeout(tid);
      window.removeEventListener("resize", update);
    };
  }, [
    currentStep,
    isNextDisabled,
    dynamicNavText,
    canvasNudge,
    nextButtonText,
    hideNudge,
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
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        step: currentStep,
        onSetNextEnabled: setNextEnabled,
        onUpdateTexts: updateTexts,
        onSetNextButtonText: setNextButtonText,
        onSetCanvasNudge: handleSetCanvasNudge,
        onStartOver: handleStartOver,
        nextTrigger: nextTrigger,
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => {
          if (dir === "next") handleNext();
        },
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
