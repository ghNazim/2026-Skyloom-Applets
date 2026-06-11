const App = () => {
  const { useState } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const [dynamicNavText, setDynamicNavText] = useState(null);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
    setDynamicNavText(null);
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setResetKey((prev) => prev + 1);
    setDynamicNavText(null);
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
        })
      )
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: APP_DATA.steps[1].questionText,
      step: currentStep,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        key: resetKey,
        step: currentStep,
        onRestart: handleRestart,
        onUpdateNavText: setDynamicNavText,
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        navText: dynamicNavText || APP_DATA.steps[1].navText,
      })
    )
  );
};
