const App = () => {
  const { useState, useEffect, useMemo, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [step6Complete, setStep6Complete] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);
  const [nudgePositions, setNudgePositions] = useState([]);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
    setIsAnimating(false);
    setStep6Complete(false);
  };

  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setIsAnimating(false);
    setStep6Complete(false);
    setSessionKey((k) => k + 1);
  };

  const handleStepComplete = useCallback((completedStep) => {
    setCurrentStep(completedStep + 1);
  }, []);

  const handleStep6Complete = useCallback(() => {
    setStep6Complete(true);
  }, []);

  const handleNav = (direction) => {
    if (direction === "next" && currentStep === 6 && step6Complete) {
      if (typeof playSound === "function") playSound("click");
      setCurrentStep(7);
    }
  };

  const navText = useMemo(() => {
    if (isAnimating || currentStep < 1 || currentStep > 6) return "";
    if (currentStep === 6 && step6Complete) {
      return APP_DATA.completed.summarizeNav;
    }
    return APP_DATA.steps[currentStep].navText || "";
  }, [currentStep, isAnimating, step6Complete]);

  const isNextDisabled = !(currentStep === 6 && step6Complete && !isAnimating);

  useEffect(() => {
    const updateNudges = () => {
      const positions = [];
      const addNudgeFor = (id) => {
        const el = document.getElementById(id);
        if (el && !el.disabled) {
          positions.push(el.getBoundingClientRect());
        }
      };

      if (currentStep === 0) {
        addNudgeFor("start-button");
      } else if (!isAnimating) {
        if (currentStep === 1) addNudgeFor("btn-preimage");
        if (currentStep === 2) addNudgeFor("btn-translation");
        if (currentStep === 3) addNudgeFor("btn-image");
        if (currentStep === 4) addNudgeFor("btn-image");
        if (currentStep === 5) addNudgeFor("btn-translation");
        if (currentStep === 6 && !step6Complete) addNudgeFor("btn-preimage");
        if (currentStep === 6 && step6Complete) addNudgeFor("next-button");
      }

      setNudgePositions(positions);
    };

    const timeoutId = setTimeout(updateNudges, 0);
    window.addEventListener("resize", updateNudges);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateNudges);
    };
  }, [currentStep, isAnimating, step6Complete]);

  const renderNudges = () =>
    nudgePositions.map((position, index) =>
      React.createElement(Nudge, {
        key: index,
        show: true,
        position: position,
      }),
    );

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
          buttonId: "start-button",
        }),
      ),
      renderNudges(),
    );
  }

  if (currentStep === 7) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(ActivityCompleted, {
          onStartOver: handleStartOver,
        }),
      ),
      renderNudges(),
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        key: sessionKey,
        step: currentStep,
        onAnimatingChange: setIsAnimating,
        onStepComplete: handleStepComplete,
        onStep6Complete: handleStep6Complete,
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: handleNav,
        isNextDisabled: isNextDisabled,
        isPrevDisabled: true,
        navText: navText,
      }),
    ),
    renderNudges(),
  );
};
