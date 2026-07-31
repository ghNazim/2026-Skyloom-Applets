const App = () => {
  const { useState, useMemo, useEffect, useRef, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [stepReady, setStepReady] = useState(false);
  const [nudgePositions, setNudgePositions] = useState([]);
  const mainCanvasRef = useRef(null);

  const resetToStep = useCallback((step) => {
    setStepReady(false);
    setCurrentStep(step);
  }, []);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setQuestionIndex(0);
    resetToStep(1);
  };

  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    setQuestionIndex(0);
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
        if (questionIndex >= APP_DATA.questions.length - 1) {
          resetToStep(5);
          return;
        }
        setQuestionIndex((index) => index + 1);
        resetToStep(1);
        return;
      }
      resetToStep(currentStep + 1);
    };

    if (delay) setTimeout(goNext, delay);
    else goNext();
  };

  const handlePrev = () => {
    if (currentStep === 1 && questionIndex === 0) return;
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 1) {
      setQuestionIndex((index) => index - 1);
      resetToStep(4);
      return;
    }
    resetToStep(currentStep - 1);
  };

  const isPrevDisabled = currentStep === 1 && questionIndex === 0;

  const navText = useMemo(() => {
    const steps = APP_DATA.steps;
    if (currentStep === 1) return stepReady ? steps.step1.nav.ready : steps.step1.nav.animating;
    if (currentStep === 2) return stepReady ? steps.step2.nav.ready : steps.step2.nav.chooseRule;
    if (currentStep === 3) return stepReady ? steps.step3.nav.ready : steps.step3.nav.numpadActive;
    if (currentStep === 4) {
      if (!stepReady) return steps.step4.nav.chooseSimplified;
      return questionIndex >= APP_DATA.questions.length - 1
        ? steps.step4.nav.conclude
        : steps.step4.nav.ready;
    }
    return "";
  }, [currentStep, questionIndex, stepReady]);

  useEffect(() => {
    const updateNudges = () => {
      const nextPositions = [];
      const targetId =
        currentStep === 0 || currentStep === 5
          ? "start-button"
          : stepReady
            ? "next-button"
            : null;
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

  if (currentStep === 5) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content app-main-content-splash" },
        React.createElement(Fullscreen, {
          heading: APP_DATA.completion.heading,
          text: APP_DATA.completion.text,
          buttonText: APP_DATA.completion.buttonText,
          onButtonClick: handleStartOver,
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
        question: APP_DATA.questions[questionIndex],
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
        isPrevDisabled: isPrevDisabled,
        navText: navText,
      }),
    ),
    renderNudges(),
  );
};
