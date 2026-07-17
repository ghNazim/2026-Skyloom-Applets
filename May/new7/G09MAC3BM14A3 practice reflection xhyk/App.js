const App = () => {
  const { useState, useCallback, useEffect } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showCompletedStep, setShowCompletedStep] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);
  const [nudgePositions, setNudgePositions] = useState([]);
  const [navState, setNavState] = useState({
    text: "",
    nextEnabled: false,
    prevEnabled: false,
    animating: false,
  });

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setQuestionIndex(0);
    setShowCompletedStep(false);
    setCurrentStep(1);
  };

  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setQuestionIndex(0);
    setShowCompletedStep(false);
    setSessionKey((key) => key + 1);
    setNavState({ text: "", nextEnabled: false, prevEnabled: false, animating: false });
  };

  const handleNavChange = useCallback((nextState) => {
    setNavState((prev) => ({ ...prev, ...nextState }));
  }, []);

  const handleNav = (direction) => {
    if (navState.animating) return;

    if (direction === "prev") {
      if (currentStep <= 1 && questionIndex <= 0) return;
      if (typeof playSound === "function") playSound("click");
      if (currentStep === 1) {
        setQuestionIndex((index) => Math.max(0, index - 1));
        setCurrentStep(3);
      } else {
        setCurrentStep((step) => step - 1);
      }
      setShowCompletedStep(true);
      setSessionKey((key) => key + 1);
      setNavState({ text: "", nextEnabled: false, prevEnabled: false, animating: false });
      return;
    }

    if (direction === "next" && navState.nextEnabled) {
      if (typeof playSound === "function") playSound("click");
      setShowCompletedStep(false);
      if (currentStep === 3) {
        if (questionIndex < APP_DATA.reflection.challenges.length - 1) {
          setQuestionIndex((index) => index + 1);
          setCurrentStep(1);
          setSessionKey((key) => key + 1);
        } else {
          setCurrentStep(4);
        }
        setNavState({ text: "", nextEnabled: false, prevEnabled: false, animating: false });
      } else {
        setCurrentStep((step) => step + 1);
      }
    }
  };

  useEffect(() => {
    const updateNudges = () => {
      const positions = [];
      const addTarget = (id) => {
        const el = document.getElementById(id);
        if (el && !el.disabled) positions.push(el.getBoundingClientRect());
      };

      if (currentStep === 0) {
        addTarget("start-button");
      } else if (currentStep > 3) {
        addTarget("start-over-button");
      } else if (navState.nextEnabled && !navState.animating) {
        addTarget("next-button");
      }

      setNudgePositions(positions);
    };

    const id = setTimeout(updateNudges, 0);
    window.addEventListener("resize", updateNudges);
    return () => {
      clearTimeout(id);
      window.removeEventListener("resize", updateNudges);
    };
  }, [currentStep, questionIndex, navState.nextEnabled, navState.animating]);

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
          subText: APP_DATA.start.subText,
          buttonText: APP_DATA.start.buttonText,
          onButtonClick: handleStart,
          buttonId: "start-button",
        }),
      ),
      renderNudges(),
    );
  }

  if (currentStep > 3) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.completed.heading,
          text: APP_DATA.completed.text,
          subText: APP_DATA.completed.subText,
          buttonText: APP_DATA.completed.startOver,
          onButtonClick: handleStartOver,
          buttonId: "start-over-button",
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
        key: sessionKey + "-" + questionIndex + "-" + currentStep + "-" + showCompletedStep,
        step: currentStep,
        questionIndex: questionIndex,
        isLastQuestion: questionIndex === APP_DATA.reflection.challenges.length - 1,
        startCompleted: showCompletedStep,
        onNavChange: handleNavChange,
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: handleNav,
        isNextDisabled: !navState.nextEnabled,
        isPrevDisabled: (currentStep <= 1 && questionIndex <= 0) || navState.animating,
        navText: navState.text,
      }),
    ),
    renderNudges(),
  );
};
