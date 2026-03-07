const App = () => {
  const { useState, useRef, useEffect } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [nudgeVisible, setNudgeVisible] = useState(true);

  const fullscreenButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const startOverButtonRef = useRef(null);

  useEffect(() => {
    setNudgeVisible(true);
  }, [currentStep]);

  const handleStart = () => {
    setNudgeVisible(false);
    playSound("click");
    setCurrentStep(1);
  };

  const handleStartOver = () => {
    setNudgeVisible(false);
    playSound("click");
    setCurrentStep(0);
  };

  const handleNav = (direction) => {
    if (direction === "next") {
      setNudgeVisible(false);
      playSound("click");
      if (currentStep >= 1 && currentStep <= 5) {
        setCurrentStep(currentStep + 1);
      }
    } else if (direction === "prev") {
      playSound("click");
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  const showNudgeOnFullscreen = currentStep === 0 && nudgeVisible;
  const showNudgeOnNext = currentStep >= 1 && currentStep <= 5 && nudgeVisible;
  const showNudgeOnStartOver = currentStep === 6 && nudgeVisible;

  if (currentStep === 0) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(Fullscreen, {
          heading: APP_DATA.intro.heading,
          text: APP_DATA.intro.text,
          buttonText: APP_DATA.intro.buttonText,
          onButtonClick: handleStart,
          buttonRef: fullscreenButtonRef,
        })
      ),
      React.createElement(Nudge, {
        show: showNudgeOnFullscreen,
        targetRef: fullscreenButtonRef,
      })
    );
  }

  if (currentStep === 6) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(Summary, {
          onStartOver: handleStartOver,
          startOverButtonRef: startOverButtonRef,
        })
      ),
      React.createElement(Nudge, {
        show: showNudgeOnStartOver,
        targetRef: startOverButtonRef,
      })
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },

    React.createElement(QuestionPanel, {
      text: APP_DATA.questionPanelText,
    }),

    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        key: currentStep,
        step: currentStep,
      })
    ),

    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: handleNav,
        isNextDisabled: false,
        isPrevDisabled: currentStep <= 1,
        navText: APP_DATA.navTexts[currentStep - 1],
        nextButtonRef: nextButtonRef,
      })
    ),

    React.createElement(Nudge, {
      show: showNudgeOnNext,
      targetRef: nextButtonRef,
    })
  );
};
