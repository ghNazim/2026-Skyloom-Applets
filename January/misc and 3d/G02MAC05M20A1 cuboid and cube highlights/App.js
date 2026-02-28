const App = () => {
  const { useState, useEffect, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState("");
  const [sliderVal, setSliderVal] = useState(0);
  const [isDoneStacking, setIsDoneStacking] = useState(false);
  const [showSlider, setShowSlider] = useState(false);
  const [clickedBoxIds, setClickedBoxIds] = useState([]);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setIsNextDisabled(true);
    setSliderVal(0);
    setIsDoneStacking(false);
    setShowSlider(false);
    setClickedBoxIds([]);
  };

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 1) {
      setCurrentStep(2);
      setIsNextDisabled(true);
      setSliderVal(0);
      setIsDoneStacking(false);
      setShowSlider(false);
      setClickedBoxIds([]);
    } else if (currentStep === 2) {
      setCurrentStep(3);
      setIsNextDisabled(false);
    } else if (currentStep === 3) {
      handleRestart();
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
  };

  const enableNext = useCallback(() => {
    setIsNextDisabled(false);
  }, []);

  const updateNavText = useCallback((nav) => {
    if (nav !== undefined && nav !== null) setDynamicNavText(nav);
  }, []);

  useEffect(() => {
    const stepData = APP_DATA.steps[currentStep];
    if (stepData) setDynamicNavText(stepData.navText);
  }, [currentStep]);

  const getQuestionText = () => {
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.questionText : "";
  };

  const getNavText = () => {
    if (dynamicNavText) return dynamicNavText;
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.navText : "";
  };

  const getNextButtonText = () => {
    if (currentStep === 3) return APP_DATA.startOver;
    return "»";
  };

  const isPrevDisabled = currentStep <= 1;

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
        step: currentStep,
        sliderVal: sliderVal,
        setSliderVal: setSliderVal,
        isDoneStacking: isDoneStacking,
        setIsDoneStacking: setIsDoneStacking,
        showSlider: showSlider,
        setShowSlider: setShowSlider,
        clickedBoxIds: clickedBoxIds,
        setClickedBoxIds: setClickedBoxIds,
        onEnableNext: enableNext,
        onUpdateNavText: updateNavText,
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => (dir === "next" ? handleNext() : handlePrev()),
        isNextDisabled: currentStep === 3 ? false : isNextDisabled,
        isPrevDisabled: isPrevDisabled,
        navText: getNavText(),
        nextSymbol: getNextButtonText(),
      })
    )
  );
};
