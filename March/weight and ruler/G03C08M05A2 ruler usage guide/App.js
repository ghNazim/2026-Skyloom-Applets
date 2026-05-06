const App = () => {
  const { useState, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [nextSymbol, setNextSymbol] = useState("»");
  const [resetKey, setResetKey] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [userSegment, setUserSegment] = useState(null);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
    setIsNextDisabled(true);
    setDynamicNavText(APP_DATA.steps[1].navText);
    setDynamicQuestionText(APP_DATA.steps[1].questionText);
    setNextSymbol("»");
    setUserSegment(null);
    setResetKey((k) => k + 1);
  };

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const updateTexts = useCallback((nav, question, nextSym) => {
    if (nav !== undefined) setDynamicNavText(nav);
    if (question !== undefined) setDynamicQuestionText(question);
    if (nextSym !== undefined) setNextSymbol(nextSym);
  }, []);

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 1) {
      setCurrentStep(2);
      setIsNextDisabled(true);
      setDynamicNavText(APP_DATA.steps[2].navText);
      setDynamicQuestionText(APP_DATA.steps[2].questionText);
      setNextSymbol("»");
    } else if (currentStep === 2) {
      setCurrentStep(3);
      setIsNextDisabled(true);
      setDynamicNavText(APP_DATA.steps[3].navText);
      setDynamicQuestionText(APP_DATA.steps[3].questionText);
      setNextSymbol("»");
    } else if (currentStep === 3) {
      setCurrentStep(4);
      setIsNextDisabled(true);
      setDynamicNavText(APP_DATA.steps[4].navText);
      setDynamicQuestionText(APP_DATA.steps[4].questionText);
      setNextSymbol("»");
    } else if (currentStep === 4) {
      setCurrentStep(5);
      setIsNextDisabled(true);
      setDynamicNavText(APP_DATA.steps[5].navText);
      setDynamicQuestionText(APP_DATA.steps[5].questionText);
      setNextSymbol("»");
    } else if (currentStep === 5) {
      setCurrentStep(6);
      setIsNextDisabled(true);
      setDynamicNavText(APP_DATA.steps[6].navText);
      setDynamicQuestionText(APP_DATA.steps[6].questionText);
      setNextSymbol("»");
    } else if (currentStep === 6) {
      setCurrentStep(7);
      setIsNextDisabled(true);
      setDynamicNavText(APP_DATA.steps[7].navText);
      setDynamicQuestionText(APP_DATA.steps[7].questionText);
      setNextSymbol("»");
    } else if (currentStep === 7) {
      setCurrentStep(8);
      setIsNextDisabled(true);
      setDynamicNavText(APP_DATA.steps[8].navText);
      setDynamicQuestionText(APP_DATA.steps[8].questionText);
      setNextSymbol("»");
    } else if (currentStep === 8) {
      setCurrentStep(9);
      setIsNextDisabled(true);
      setDynamicNavText("");
      setDynamicQuestionText("");
      setNextSymbol("»");
    } else if (currentStep === 9) {
      setCurrentStep(10);
      setIsNextDisabled(true);
      setDynamicNavText(APP_DATA.steps[10].navText);
      setDynamicQuestionText(APP_DATA.steps[10].questionText);
      setNextSymbol("»");
      setUserSegment(null);
      setResetKey((k) => k + 1);
    } else if (currentStep === 10) {
      setCurrentStep(11);
      setIsNextDisabled(false);
      setDynamicNavText(APP_DATA.steps[11].navText);
      setDynamicQuestionText(APP_DATA.steps[11].questionText);
      setNextSymbol("»");
    } else if (currentStep === 11) {
      setCurrentStep(12);
      setIsNextDisabled(true);
      setDynamicNavText(APP_DATA.steps[12].navText);
      setDynamicQuestionText(APP_DATA.steps[12].questionText);
      setNextSymbol("»");
      setUserSegment(null);
      setResetKey((k) => k + 1);
    } else if (currentStep === 12) {
      if (!userSegment) return;
      setCurrentStep(13);
      setIsNextDisabled(true);
      setDynamicNavText(APP_DATA.steps[13].navText);
      setDynamicQuestionText(APP_DATA.steps[13].questionText);
      setNextSymbol("»");
    } else if (currentStep === 13) {
      setCurrentStep(14);
      setIsNextDisabled(false);
      setDynamicNavText(APP_DATA.steps[14].navText);
      setDynamicQuestionText(APP_DATA.steps[14].questionText);
      setNextSymbol("»");
    } else if (currentStep === 14) {
      setCurrentStep(15);
      setIsNextDisabled(false);
      setDynamicNavText(APP_DATA.steps[15].navText);
      setDynamicQuestionText(APP_DATA.steps[15].questionText);
      setNextSymbol("»");
    } else if (currentStep === 15) {
      setCurrentStep(16);
      setIsNextDisabled(false);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setNextSymbol("»");
    }
  };

  const handlePrevious = () => {
    if (isAnimating) return;
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 15) {
      setCurrentStep(14);
      setIsNextDisabled(false);
      setDynamicNavText(APP_DATA.steps[14].navText);
      setDynamicQuestionText(APP_DATA.steps[14].questionText);
      setNextSymbol("»");
    } else if (currentStep === 14) {
      setCurrentStep(13);
      setIsNextDisabled(true);
      setDynamicNavText(APP_DATA.steps[13].navText);
      setDynamicQuestionText(APP_DATA.steps[13].questionText);
      setNextSymbol("»");
    } else if (currentStep === 13) {
      setCurrentStep(12);
      setIsNextDisabled(true);
      setDynamicNavText(APP_DATA.steps[12].navText);
      setDynamicQuestionText(APP_DATA.steps[12].questionText);
      setNextSymbol("»");
      setUserSegment(null);
      setResetKey((k) => k + 1);
    } else if (currentStep === 12) {
      setCurrentStep(11);
      setIsNextDisabled(false);
      setDynamicNavText(APP_DATA.steps[11].navText);
      setDynamicQuestionText(APP_DATA.steps[11].questionText);
      setNextSymbol("»");
      setUserSegment(null);
      setResetKey((k) => k + 1);
    } else if (currentStep === 11) {
      setCurrentStep(10);
      setIsNextDisabled(true);
      setDynamicNavText(APP_DATA.steps[10].navText);
      setDynamicQuestionText(APP_DATA.steps[10].questionText);
      setNextSymbol("»");
      setResetKey((k) => k + 1);
    } else if (currentStep === 10) {
      setCurrentStep(9);
      setIsNextDisabled(true);
      setDynamicNavText("");
      setDynamicQuestionText("");
      setNextSymbol("»");
      setResetKey((k) => k + 1);
    } else if (currentStep === 9) {
      setCurrentStep(8);
      setIsNextDisabled(true);
      setDynamicNavText(APP_DATA.steps[8].navText);
      setDynamicQuestionText(APP_DATA.steps[8].questionText);
      setNextSymbol("»");
    } else if (currentStep === 8) {
      setCurrentStep(7);
      setIsNextDisabled(true);
      setDynamicNavText(APP_DATA.steps[7].navText);
      setDynamicQuestionText(APP_DATA.steps[7].questionText);
      setNextSymbol("»");
    } else if (currentStep === 7) {
      setCurrentStep(6);
      setIsNextDisabled(true);
      setDynamicNavText(APP_DATA.steps[6].navText);
      setDynamicQuestionText(APP_DATA.steps[6].questionText);
      setNextSymbol("»");
    } else if (currentStep === 6) {
      setCurrentStep(5);
      setIsNextDisabled(true);
      setDynamicNavText(APP_DATA.steps[5].navText);
      setDynamicQuestionText(APP_DATA.steps[5].questionText);
      setNextSymbol("»");
    } else if (currentStep === 5) {
      setCurrentStep(4);
      setIsNextDisabled(true);
      setDynamicNavText(APP_DATA.steps[4].navText);
      setDynamicQuestionText(APP_DATA.steps[4].questionText);
      setNextSymbol("»");
    } else if (currentStep === 4) {
      setCurrentStep(3);
      setIsNextDisabled(true);
      setDynamicNavText(APP_DATA.steps[3].navText);
      setDynamicQuestionText(APP_DATA.steps[3].questionText);
      setNextSymbol("»");
    } else if (currentStep === 3) {
      setCurrentStep(2);
      setIsNextDisabled(true);
      setDynamicNavText(APP_DATA.steps[2].navText);
      setDynamicQuestionText(APP_DATA.steps[2].questionText);
      setNextSymbol("»");
    } else if (currentStep === 2) {
      setCurrentStep(1);
      setIsNextDisabled(true);
      setDynamicNavText(APP_DATA.steps[1].navText);
      setDynamicQuestionText(APP_DATA.steps[1].questionText);
      setNextSymbol("»");
    } else if (currentStep === 1) {
      setCurrentStep(0);
      setIsNextDisabled(true);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setNextSymbol("»");
      setResetKey((k) => k + 1);
    }
  };

  const handleFinalStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setIsNextDisabled(true);
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setNextSymbol("»");
    setUserSegment(null);
    setResetKey((k) => k + 1);
  };

  const getQuestionText = () => {
    if (dynamicQuestionText !== null && dynamicQuestionText !== undefined)
      return dynamicQuestionText;
    const stepData = APP_DATA.steps[currentStep];
    if (!stepData) return "";
    return stepData.questionText || "";
  };

  const getNavText = () => {
    if (dynamicNavText !== null && dynamicNavText !== undefined)
      return dynamicNavText;
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
          imageSrc: APP_DATA.start.imageSrc,
          left: true,
        }),
      ),
    );
  }

  if (currentStep === 16) {
    const fin = APP_DATA.finalScreen;
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: fin.heading,
          text: fin.text,
          buttonText: fin.buttonText,
          onButtonClick: handleFinalStartOver,
          imageSrc: fin.imageSrc || undefined,
          left: true,
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
        userSegment: userSegment,
        onUserSegmentChange: setUserSegment,
        onSetNextEnabled: setNextEnabled,
        onUpdateTexts: updateTexts,
        onAnimatingChange: setIsAnimating,
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => {
          if (dir === "next") handleNext();
          else if (dir === "prev") handlePrevious();
        },
        isNextDisabled: isNextDisabled,
        isPrevDisabled: isAnimating,
        navText: getNavText(),
        nextSymbol: nextSymbol,
        nextBtnClass: nextSymbol.length > 2 ? "text-button" : "",
      }),
    ),
  );
};
