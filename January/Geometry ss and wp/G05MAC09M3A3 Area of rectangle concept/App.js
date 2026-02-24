const App = () => {
  const { useState, useEffect, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState("");

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setIsNextDisabled(true);
  };

  useEffect(() => {
    // Step 7 has no completion action—next should be enabled immediately so user can go to step 8
    if (currentStep === 7) {
      setIsNextDisabled(false);
    } else {
      setIsNextDisabled(true);
      setDynamicNavText("");
    }
  }, [currentStep]);

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep < 8) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // const handlePrev = () => {
  //   if (typeof playSound === "function") playSound("click");
  //   if (currentStep > 1) {
  //     setCurrentStep(prev => prev - 1);
  //   }
  // };

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const updateTexts = useCallback((nav) => {
    if (nav !== undefined && nav !== null) setDynamicNavText(nav);
  }, []);

  const getQuestionText = () => {
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.questionText : "";
  };

  const getNavText = () => {
    if (dynamicNavText) return dynamicNavText;
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.navText : "";
  };

  // Step 0: Start fullscreen
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

  // Step 8: Final fullscreen (color-coded formula, two-column with image)
  if (currentStep === 8) {
    const lengthLabel = APP_DATA.steps[1].sliders.length;
    const breadthLabel = APP_DATA.steps[1].sliders.breadth;
    const finalTextHtml = APP_DATA.final.textBefore +
      '<span class="highlight-green">' + lengthLabel + '</span> × <span class="highlight-blue">' + breadthLabel + '</span>';
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.final.heading,
          text: finalTextHtml,
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
        step: currentStep,
        onSetNextEnabled: setNextEnabled,
        onUpdateTexts: updateTexts,
        onForceNext: handleNext,
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => (dir === "next" ? handleNext() : null), // No prev button needed as per usual flows unless specified
        isNextDisabled: isNextDisabled,
        isPrevDisabled: true, // simplified
        navText: getNavText(),
        nextSymbol: "»",
      })
    )
  );
};
