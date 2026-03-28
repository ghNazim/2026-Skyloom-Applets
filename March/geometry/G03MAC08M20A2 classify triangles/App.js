const App = () => {
  const { useState, useEffect, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [triangleIndex, setTriangleIndex] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [nextSymbol, setNextSymbol] = useState("»");
  const [resetKey, setResetKey] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
    setTriangleIndex(0);
    setIsNextDisabled(true);
    setDynamicNavText(APP_DATA.steps[1].navText);
    setNextSymbol("»");
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setTriangleIndex(0);
    setIsNextDisabled(true);
    setDynamicNavText(null);
    setNextSymbol("»");
    setResetKey((prev) => prev + 1);
  };

  const handleMeasurementDone = useCallback(() => {
    setCurrentStep(2);
    setIsNextDisabled(true);
    setDynamicNavText(APP_DATA.steps[2].navText);
  }, []);

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const updateTexts = useCallback((nav, question, nextSym) => {
    if (nav !== undefined) setDynamicNavText(nav);
    if (nextSym !== undefined) setNextSymbol(nextSym);
  }, []);

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 2) {
      if (triangleIndex < APP_DATA.triangles.length - 1) {
        setTriangleIndex((prev) => prev + 1);
        setCurrentStep(1);
        setIsNextDisabled(true);
        setDynamicNavText(APP_DATA.steps[1].navText);
        setNextSymbol("»");
        setResetKey((prev) => prev + 1);
      } else {
        handleRestart();
      }
    }
  };

  const handlePrevious = () => {
    if (isAnimating) return;
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 2) {
      setCurrentStep(1);
      setIsNextDisabled(true);
      setDynamicNavText(APP_DATA.steps[1].navText);
      setNextSymbol("»");
      setResetKey((prev) => prev + 1);
    } else if (currentStep === 1) {
      setCurrentStep(0);
      setTriangleIndex(0);
      setIsNextDisabled(true);
      setDynamicNavText(null);
      setNextSymbol("»");
      setResetKey((prev) => prev + 1);
    }
  };

  const getQuestionText = () => {
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.questionText : "";
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
        triangleIndex: triangleIndex,
        onSetNextEnabled: setNextEnabled,
        onUpdateTexts: updateTexts,
        onMeasurementDone: handleMeasurementDone,
        onAnimatingChange: setIsAnimating,
      })
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
      })
    )
  );
};
