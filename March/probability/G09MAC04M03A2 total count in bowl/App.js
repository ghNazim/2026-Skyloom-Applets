const App = () => {
  const { useState, useRef } = React;

  const [currentStep, setCurrentStep] = useState(1);
  const [isStepComplete, setIsStepComplete] = useState(false);
  const [zeroStageStep, setZeroStageStep] = useState(null);

  const fullscreenButtonRef = useRef(null);
  const nextButtonRef = useRef(null);

  const handleStart = () => {
    playSound("click");
    setCurrentStep(1);
    setZeroStageStep(null);
  };

  const handleExitZeroStage = () => {
    playSound("click");
    setZeroStageStep(null);
  };

  const handleStartOver = () => {
    playSound("click");
    setCurrentStep(1);
    setIsStepComplete(false);
    setZeroStageStep(null);
  };

  const handleNav = (direction) => {
    if (direction === "next") {
      playSound("click");
      if (currentStep === 1) {
        setCurrentStep(2);
        setIsStepComplete(false);
        setZeroStageStep(null);
      } else if (currentStep === 2 && isStepComplete) {
        setCurrentStep(3);
        setIsStepComplete(false);
        setZeroStageStep(3);
      } else if (currentStep === 3 && isStepComplete) {
        setCurrentStep(4);
        setIsStepComplete(false);
        setZeroStageStep(4);
      } else if (currentStep === 4 && isStepComplete) {
        setCurrentStep(5);
        setIsStepComplete(false);
        setZeroStageStep(5);
      } else if (currentStep === 5 && isStepComplete) {
        setCurrentStep(6);
        setZeroStageStep(null);
      } else if (currentStep === 6) {
        setCurrentStep(7);
      } else if (currentStep === 7) {
        setCurrentStep(8);
      }
    } else if (direction === "prev") {
      playSound("click");
      if (currentStep === 1) {
        setCurrentStep(0);
        setIsStepComplete(false);
      } else if (currentStep >= 2 && currentStep <= 5) {
        setCurrentStep(currentStep - 1);
        setIsStepComplete(false);
        setZeroStageStep(null);
      } else if (currentStep === 6) {
        setCurrentStep(5);
        setIsStepComplete(false);
        setZeroStageStep(null);
      } else if (currentStep === 7) {
        setCurrentStep(6);
        setIsStepComplete(false);
      }
    }
  };

  const handleStepComplete = () => {
    setIsStepComplete(true);
  };

  var getNavText = function () {
    if (currentStep === 1) return APP_DATA.splash.navText;
    if (currentStep === 6) return APP_DATA.splash2.navText;
    if (currentStep === 7) return APP_DATA.splash3.navText;
    if (currentStep >= 2 && currentStep <= 5) {
      var stepIndex = currentStep - 2;
      if (zeroStageStep === currentStep && currentStep >= 3) {
        return APP_DATA.zeroStage.navText;
      }
      if (isStepComplete) return APP_DATA.steps[stepIndex].correctNavText;
      return APP_DATA.interactiveNavText;
    }
    return "";
  };

  var getIsNextDisabled = function () {
    if (currentStep === 1 || currentStep === 6 || currentStep === 7) return false;
    if (currentStep >= 2 && currentStep <= 5) {
      if (zeroStageStep === currentStep) return true;
      return !isStepComplete;
    }
    return true;
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
          buttonRef: fullscreenButtonRef,
        })
      ),
      React.createElement(Nudge, {
        show: true,
        targetRef: fullscreenButtonRef,
      })
    );
  }

  if (currentStep === 1) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(Splash, {
          heading: APP_DATA.splash.heading,
          image: APP_DATA.splash.image,
          text: APP_DATA.splash.text,
        })
      ),
      React.createElement(
        "div",
        { className: "lower-panel" },
        React.createElement(Navigation, {
          onNav: handleNav,
          isNextDisabled: false,
          isPrevDisabled: true,
          navText: getNavText(),
          nextButtonRef: nextButtonRef,
        })
      ),
      React.createElement(Nudge, {
        show: !getIsNextDisabled(),
        targetRef: nextButtonRef,
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
        React.createElement(Splash2, null)
      ),
      React.createElement(
        "div",
        { className: "lower-panel" },
        React.createElement(Navigation, {
          onNav: handleNav,
          isNextDisabled: getIsNextDisabled(),
          isPrevDisabled: false,
          navText: getNavText(),
          nextButtonRef: nextButtonRef,
        })
      ),
      React.createElement(Nudge, {
        show: !getIsNextDisabled(),
        targetRef: nextButtonRef,
      })
    );
  }

  if (currentStep === 7) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(Splash3, null)
      ),
      React.createElement(
        "div",
        { className: "lower-panel" },
        React.createElement(Navigation, {
          onNav: handleNav,
          isNextDisabled: getIsNextDisabled(),
          isPrevDisabled: false,
          navText: getNavText(),
          nextButtonRef: nextButtonRef,
        })
      ),
      React.createElement(Nudge, {
        show: !getIsNextDisabled(),
        targetRef: nextButtonRef,
      })
    );
  }

  if (currentStep === 8) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(Complete, {
          onStartOver: handleStartOver,
          buttonRef: fullscreenButtonRef,
        })
      ),
      React.createElement(Nudge, {
        show: true,
        targetRef: fullscreenButtonRef,
      })
    );
  }

  if (currentStep >= 2 && currentStep <= 5) {
    var stepIndex = currentStep - 2;
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(MainCanvas, {
          stepData: APP_DATA.steps[stepIndex],
          onStepComplete: handleStepComplete,
          inZeroStage:
            zeroStageStep === currentStep && currentStep >= 3 && currentStep <= 5,
          onExitZeroStage: handleExitZeroStage,
          previousStepData:
            stepIndex > 0 ? APP_DATA.steps[stepIndex - 1] : null,
        })
      ),
      React.createElement(
        "div",
        { className: "lower-panel" },
        React.createElement(Navigation, {
          onNav: handleNav,
          isNextDisabled: getIsNextDisabled(),
          isPrevDisabled: false,
          navText: getNavText(),
          nextButtonRef: nextButtonRef,
        })
      ),
      React.createElement(Nudge, {
        show: !getIsNextDisabled(),
        targetRef: nextButtonRef,
      })
    );
  }

  return null;
};
