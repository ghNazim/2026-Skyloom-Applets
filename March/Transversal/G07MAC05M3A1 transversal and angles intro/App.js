const App = () => {
  const { useState, useEffect, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setIsNextDisabled(true);
    setDynamicNavText(null);
  };

  useEffect(() => {
    setDynamicNavText(null);

    // Default next button state
    const autoDisableSteps = [1, 2, 3, 4, 5, 6, 8, 'i1', 'i2', 'i3', 'e1', 'e2', 'e3'];
    if (autoDisableSteps.includes(currentStep)) {
      setIsNextDisabled(true);
    }
  }, [currentStep]);

  const handleNext = (overrideStep) => {
    if (typeof playSound === "function") playSound("click");
    if (typeof overrideStep === 'string' || typeof overrideStep === 'number' && overrideStep !== undefined && overrideStep.nativeEvent === undefined) {
      setCurrentStep(overrideStep);
    } else if (typeof currentStep === 'number' && currentStep < 8) {
      setCurrentStep((prev) => prev + 1);
    } else if (currentStep === 'e3' || currentStep === 'i3') {
      setCurrentStep('ie4');
    } else if (currentStep === 'ie4') {
      handleRestart();
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep > 1) {
      setResetKey((prev) => prev + 1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const updateTexts = useCallback((nav) => {
    if (nav !== undefined) setDynamicNavText(nav);
  }, []);

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
        })
      )
    );
  }

  if (currentStep === 9) {
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
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        key: resetKey,
        step: currentStep,
        onSetNextEnabled: setNextEnabled,
        onUpdateTexts: updateTexts,
        onNext: handleNext,
      })
    ),
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
        isNextDisabled: currentStep !== 'ie4' ? isNextDisabled : false,
        isPrevDisabled: currentStep <= 1,
        hidePrev: true,
        navText: getNavText(),
        nextSymbol: currentStep === 'ie4' ? APP_DATA.steps.ie4.nextText : "»"
      })
    )
  );
};
