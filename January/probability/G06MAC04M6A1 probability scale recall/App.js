const App = () => {
  const { useState } = React;

  const [currentStep, setCurrentStep] = useState(0);

  const handleStart = () => {
    playSound("click");
    setCurrentStep(1);
  };

  const handleStartOver = () => {
    playSound("click");
    setCurrentStep(0);
  };

  const handleNav = (direction) => {
    if (direction === "next") {
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
        })
      )
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
        })
      )
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
      })
    )
  );
};
