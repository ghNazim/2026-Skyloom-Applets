const App = () => {
  const { useState, useCallback, useRef, useEffect } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [navText, setNavText] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [showFullscreenNudge, setShowFullscreenNudge] = useState(true);

  const appletRef = useRef(null);
  const fullscreenBtnRef = useRef(null);

  const fullscreenNudgePosition = useNudgePosition(
    fullscreenBtnRef,
    showFullscreenNudge && (currentStep === 0 || currentStep === 7),
    appletRef,
    currentStep
  );

  useEffect(function () {
    if (currentStep === 0 || currentStep === 7) {
      setShowFullscreenNudge(true);
    }
  }, [currentStep]);

  const dismissFullscreenNudge = useCallback(function () {
    setShowFullscreenNudge(false);
  }, []);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    dismissFullscreenNudge();
    setCurrentStep(1);
    setNavText(APP_DATA.steps[1].navText);
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    setResetKey((prev) => prev + 1);
    setCurrentStep(0);
    setNavText("");
    setShowFullscreenNudge(true);
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
    dismissFullscreenNudge();
    setCurrentStep(8);
    setNavText("");
  };

  const renderFullscreenNudge = () =>
    showFullscreenNudge &&
    fullscreenNudgePosition &&
    React.createElement(Nudge, {
      visible: true,
      top: fullscreenNudgePosition.top,
      left: fullscreenNudgePosition.left,
    });

  if (currentStep === 0) {
    return React.createElement(
      "div",
      { className: "applet-container", ref: appletRef },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.start.heading,
          text: APP_DATA.start.text,
          buttonText: APP_DATA.start.buttonText,
          onButtonClick: handleStart,
          buttonRef: fullscreenBtnRef,
        }),
        renderFullscreenNudge()
      )
    );
  }

  if (currentStep === 7) {
    return React.createElement(
      "div",
      { className: "applet-container", ref: appletRef },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.steps[7].heading,
          text: APP_DATA.steps[7].text,
          buttonText: APP_DATA.steps[7].buttonText,
          onButtonClick: handleSummarize,
          buttonRef: fullscreenBtnRef,
        }),
        renderFullscreenNudge()
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
