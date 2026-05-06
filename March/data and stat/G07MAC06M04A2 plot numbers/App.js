const App = () => {
  const { useState, useEffect, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const isQuestionStep =
    currentStep === 1 || currentStep === 3 || currentStep === 4 || currentStep === 6 || currentStep === 8;

  useEffect(() => {
    if (isQuestionStep) {
      setIsNextDisabled(true);
      setDynamicNavText(null);
    }
  }, [currentStep, isQuestionStep]);

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const updateNavText = useCallback((navText) => {
    setDynamicNavText(navText);
  }, []);

  const handleStartStepOne = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
    setResetKey((prev) => prev + 1);
  };

  const handleBeginStepTwo = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(3);
    setResetKey((prev) => prev + 1);
  };

  const handleStepFiveButton = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(6);
    setResetKey((prev) => prev + 1);
  };

  const handleStepSevenButton = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(8);
    setResetKey((prev) => prev + 1);
  };

  const handleStepNineButton = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setResetKey((prev) => prev + 1);
  };

  const handleNext = () => {
    if (isNextDisabled) return;
    if (typeof playSound === "function") playSound("click");

    if (currentStep === 1) setCurrentStep(2);
    if (currentStep === 3) setCurrentStep(4);
    if (currentStep === 4) setCurrentStep(5);
    if (currentStep === 6) setCurrentStep(7);
    if (currentStep === 8) setCurrentStep(9);
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");

    if (currentStep === 1) setCurrentStep(0);
    if (currentStep === 3) setCurrentStep(2);
    if (currentStep === 4) setCurrentStep(3);
    if (currentStep === 6) setCurrentStep(5);
    if (currentStep === 8) setCurrentStep(7);
  };

  const getNavText = () => {
    if (dynamicNavText !== null && dynamicNavText !== undefined) return dynamicNavText;
    if (!isQuestionStep) return "";
    return APP_DATA.steps[currentStep].navText;
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
          onButtonClick: handleStartStepOne,
          rightContent: React.createElement(MainCanvas, {
            key: "step-0-" + resetKey,
            step: 0,
          }),
        })
      )
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
          heading: APP_DATA.step1Complete.heading,
          text: APP_DATA.step1Complete.text,
          buttonText: APP_DATA.step1Complete.buttonText,
          onButtonClick: handleBeginStepTwo,
          rightContent: React.createElement(MainCanvas, {
            key: "step-2-" + resetKey,
            step: 2,
          }),
        })
      )
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
          heading: APP_DATA.step2Complete.heading,
          text: APP_DATA.step2Complete.text,
          buttonText: APP_DATA.step2Complete.buttonText,
          onButtonClick: handleStepFiveButton,
          topContent: React.createElement(MainCanvas, {
            key: "step-5-" + resetKey,
            step: 5,
          }),
        })
      )
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
          heading: APP_DATA.step3Complete.heading,
          text: APP_DATA.step3Complete.text,
          buttonText: APP_DATA.step3Complete.buttonText,
          onButtonClick: handleStepSevenButton,
          rightContent: React.createElement(MainCanvas, {
            key: "step-7-" + resetKey,
            step: 7,
          }),
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
          onButtonClick: handleStepNineButton,
          rightContent: React.createElement(MainCanvas, {
            key: "step-9-" + resetKey,
            step: 9,
          }),
        })
      )
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: APP_DATA.steps[currentStep].questionText,
      stepNumber: APP_DATA.steps[currentStep].stepNumber,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        key: "step-" + currentStep + "-" + resetKey,
        step: currentStep,
        onSetNextEnabled: setNextEnabled,
        onUpdateNavText: updateNavText,
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => (dir === "next" ? handleNext() : handlePrev()),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: false,
        navText: getNavText(),
      })
    )
  );
};
