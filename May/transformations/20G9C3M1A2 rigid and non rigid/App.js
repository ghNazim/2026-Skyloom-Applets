const App = () => {
  const { useState, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [navText, setNavText] = useState("");
  const [resetKey, setResetKey] = useState(0);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
    setNavText(APP_DATA.steps[1].navText);
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    setResetKey((prev) => prev + 1);
    setCurrentStep(0);
    setNavText("");
  };

  const handleStepChange = useCallback((nextStep) => {
    setCurrentStep(nextStep);
    const stepData = APP_DATA.steps[nextStep];
    if (stepData && stepData.navText) {
      setNavText(stepData.navText);
    } else if (nextStep === 7 || nextStep === 8) {
      setNavText("");
    }
  }, []);

  const handleUpdateNavText = useCallback((text) => {
    if (text !== undefined) setNavText(text);
  }, []);

  const handleSummarize = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(8);
    setNavText("");
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

  if (currentStep === 7) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.steps[7].heading,
          text: APP_DATA.steps[7].text,
          buttonText: APP_DATA.steps[7].buttonText,
          onButtonClick: handleSummarize,
        })
      )
    );
  }

  if (currentStep === 8) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(FinalTable, {
          key: resetKey,
          onStartOver: handleRestart,
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
        onStepChange: handleStepChange,
        onUpdateNavText: handleUpdateNavText,
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        navText: navText,
      })
    )
  );
};
