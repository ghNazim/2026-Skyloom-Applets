const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [canGoPrevQuestion, setCanGoPrevQuestion] = useState(false);
  const [isQuizAnimating, setIsQuizAnimating] = useState(false);
  const [questionPanelVisible, setQuestionPanelVisible] = useState(false);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const goPrevQuestionRef = useRef(null);

  const isFullscreenStep = currentStep === 0 || currentStep === 5;

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setQuestionPanelVisible(false);
    setIsNextDisabled(true);
    setCanGoPrevQuestion(false);
    setIsQuizAnimating(false);
    setResetKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (currentStep === 1) {
      setDynamicNavText(APP_DATA.steps[1].navText);
      setDynamicQuestionText(null);
      setQuestionPanelVisible(false);
      setIsNextDisabled(true);
    } else if (currentStep === 2) {
      setDynamicNavText(APP_DATA.steps[2].navText);
      setDynamicQuestionText(APP_DATA.steps[2].questionText);
      setQuestionPanelVisible(true);
      setIsNextDisabled(true);
    } else if (currentStep === 3 || currentStep === 4) {
      setDynamicNavText(APP_DATA.steps[currentStep].navText);
      setDynamicQuestionText(APP_DATA.steps[currentStep].questionText);
      setQuestionPanelVisible(true);
      setIsNextDisabled(true);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (isNextDisabled) return;
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(5);
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 1 && goPrevQuestionRef.current) {
      goPrevQuestionRef.current();
    }
  };

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const updateNavText = useCallback((nav) => {
    setDynamicNavText(nav);
  }, []);

  const registerGoPrevQuestion = useCallback((fn) => {
    goPrevQuestionRef.current = fn;
  }, []);

  const updateQuestionPanel = useCallback((visible, text) => {
    setQuestionPanelVisible(visible);
    if (text !== undefined) setDynamicQuestionText(text);
  }, []);

  const getQuestionText = () => {
    if (dynamicQuestionText !== null && dynamicQuestionText !== undefined) {
      return dynamicQuestionText;
    }
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
          showNudge: true,
        }),
      ),
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
          table: APP_DATA.final.table,
          buttonText: APP_DATA.final.buttonText,
          onButtonClick: handleRestart,
          showNudge: false,
          isFinal: true,
        }),
      ),
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    !isFullscreenStep &&
      React.createElement(QuestionPanel, {
        text: getQuestionText(),
        visible: questionPanelVisible,
      }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        key: resetKey,
        step: currentStep,
        onSetNextEnabled: setNextEnabled,
        onUpdateNavText: updateNavText,
        onPrevAvailabilityChange: setCanGoPrevQuestion,
        onAnimatingChange: setIsQuizAnimating,
        registerGoPrevQuestion: registerGoPrevQuestion,
        onUpdateQuestionPanel: updateQuestionPanel,
      }),
    ),
    !isFullscreenStep &&
      React.createElement(
        "div",
        { className: "lower-panel" },
        React.createElement(Navigation, {
          onNav: (dir) =>
            dir === "next"
              ? handleNext()
              : dir === "prev"
              ? handlePrev()
              : null,
          isNextDisabled: isNextDisabled,
          isPrevDisabled:
            currentStep !== 1 || !canGoPrevQuestion || isQuizAnimating,
          navText: getNavText(),
        }),
      ),
  );
};
