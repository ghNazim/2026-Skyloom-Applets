const App = () => {
  const { useState, useMemo, useEffect, useRef, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [stepReady, setStepReady] = useState(false);
  const [nudgePositions, setNudgePositions] = useState([]);
  const mainCanvasRef = useRef(null);

  const resetToStep = useCallback((step) => {
    setStepReady(false);
    setCurrentStep(step);
  }, []);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    resetToStep(1);
  };

  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    resetToStep(0);
  };

  const handleNext = () => {
    if (!stepReady) return;
    if (typeof playSound === "function") playSound("click");

    const delay =
      mainCanvasRef.current && typeof mainCanvasRef.current.prepareStepChange === "function"
        ? mainCanvasRef.current.prepareStepChange()
        : 0;

    const goNext = () => {
      if (currentStep >= 4) {
        resetToStep(0);
        return;
      }
      resetToStep(currentStep + 1);
    };

    if (delay) setTimeout(goNext, delay);
    else goNext();
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep <= 1) {
      resetToStep(0);
      return;
    }
    resetToStep(currentStep - 1);
  };

  const navText = useMemo(() => {
    if (currentStep === 1) return stepReady ? APP_DATA.nav.continue : APP_DATA.nav.empty;
    if (currentStep === 2) return stepReady ? APP_DATA.nav.beginSubstitution : APP_DATA.nav.correctOption;
    if (currentStep === 3) return stepReady ? APP_DATA.nav.lastStep : APP_DATA.nav.numpadActive;
    if (currentStep === 4) return stepReady ? APP_DATA.nav.anotherChallenge : APP_DATA.nav.correctOption;
    return APP_DATA.nav.empty;
  }, [currentStep, stepReady]);

  useEffect(() => {
    const updateNudges = () => {
      const nextPositions = [];
      const targetId = currentStep === 0 ? "start-button" : stepReady ? "next-button" : null;
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el && !el.disabled) nextPositions.push(el.getBoundingClientRect());
      }
      setNudgePositions(nextPositions);
    };

    const timeoutId = setTimeout(updateNudges, 0);
    window.addEventListener("resize", updateNudges);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateNudges);
    };
  }, [currentStep, stepReady]);

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
        { className: "app-main-content app-main-content-splash" },
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

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(
      "div",
      { className: "app-main-content line-app-content" },
      React.createElement(MainCanvas, {
        ref: mainCanvasRef,
        step: currentStep,
        onReadyChange: setStepReady,
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) =>
          dir === "next" ? handleNext() : dir === "prev" ? handlePrev() : null,
        isNextDisabled: !stepReady,
        isPrevDisabled: false,
        navText: navText,
      }),
    ),
    renderNudges(),
  );
};
