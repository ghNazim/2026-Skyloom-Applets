var App = function () {
  var useState = React.useState;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  var stepState = useState(0);
  var currentStep = stepState[0];
  var setCurrentStep = stepState[1];

  var completeState = useState(false);
  var isStepComplete = completeState[0];
  var setIsStepComplete = completeState[1];

  var navTextState = useState("");
  var navText = navTextState[0];
  var setNavText = navTextState[1];

  var problemIdxState = useState(0);
  var problemIndex = problemIdxState[0];
  var setProblemIndex = problemIdxState[1];

  var filledState = useState({});
  var filledPositions = filledState[0];
  var setFilledPositions = filledState[1];

  var revealedState = useState([1, 5]);
  var revealedPositions = revealedState[0];
  var setRevealedPositions = revealedState[1];

  var fullscreenButtonRef = useRef(null);
  var nextButtonRef = useRef(null);

  var handleStart = function () {
    playSound("click");
    setCurrentStep(1);
    setNavText(APP_DATA.introStep1.navText);
  };

  var handleContinue = function () {
    playSound("click");
    setProblemIndex(0);
    setCurrentStep(12);
    setIsStepComplete(false);
    setNavText(APP_DATA.challengeNavInitial);
  };

  var handleStartOver = function () {
    playSound("click");
    setCurrentStep(0);
    setIsStepComplete(false);
    setNavText("");
    setFilledPositions({});
    setRevealedPositions([1, 5]);
    setProblemIndex(0);
  };

  var handleStepComplete = function () {
    setIsStepComplete(true);
  };

  var handleNavTextChange = function (text) {
    setNavText(text);
  };

  var handlePositionFilled = function (position, imageSrc) {
    setFilledPositions(function (prev) {
      var next = {};
      for (var k in prev) next[k] = prev[k];
      next[position] = imageSrc;
      return next;
    });
  };

  var handlePositionRevealed = function (position) {
    setRevealedPositions(function (prev) {
      if (prev.indexOf(position) !== -1) return prev;
      return prev.concat([position]);
    });
  };

  var handleNav = function (direction) {
    if (direction === "next") {
      playSound("click");

      if (currentStep >= 1 && currentStep <= 3) {
        var nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setIsStepComplete(false);
        if (nextStep === 2) setNavText(APP_DATA.introStep2.navText);
        else if (nextStep === 3) setNavText(APP_DATA.introStep3.navText);
        else if (nextStep === 4) setNavText(APP_DATA.introStep4.navText);
      } else if (currentStep === 4) {
        setCurrentStep(5);
        setIsStepComplete(false);
        setNavText(APP_DATA.machines[0].navInitial);
      } else if (currentStep >= 5 && currentStep <= 8 && isStepComplete) {
        var machineIdx = currentStep - 5 + 1;
        setCurrentStep(currentStep + 1);
        setIsStepComplete(false);
        if (machineIdx < APP_DATA.machines.length) {
          setNavText(APP_DATA.machines[machineIdx].navInitial);
        }
      } else if (currentStep === 9 && isStepComplete) {
        setCurrentStep(10);
        setIsStepComplete(false);
        setNavText(APP_DATA.splash2.navText);
      } else if (currentStep === 10) {
        setCurrentStep(11);
        setIsStepComplete(false);
        setNavText("");
      } else if (currentStep === 12 && isStepComplete) {
        var nextProbIdx = problemIndex + 1;
        if (nextProbIdx < APP_DATA.problems.length) {
          setProblemIndex(nextProbIdx);
          setIsStepComplete(false);
          setNavText(APP_DATA.challengeNavInitial);
        } else {
          setCurrentStep(13);
          setIsStepComplete(false);
          setNavText("");
        }
      }
    } else if (direction === "prev") {
      playSound("click");
      if (currentStep === 1) {
        setCurrentStep(0);
        setIsStepComplete(false);
      } else if (currentStep >= 2 && currentStep <= 4) {
        var prevStep = currentStep - 1;
        setCurrentStep(prevStep);
        setIsStepComplete(false);
        if (prevStep === 1) setNavText(APP_DATA.introStep1.navText);
        else if (prevStep === 2) setNavText(APP_DATA.introStep2.navText);
        else if (prevStep === 3) setNavText(APP_DATA.introStep3.navText);
      }
    }
  };

  var getIsNextDisabled = function () {
    if (currentStep >= 1 && currentStep <= 4) return false;
    if (currentStep >= 5 && currentStep <= 9) return !isStepComplete;
    if (currentStep === 10) return false;
    if (currentStep === 12) return !isStepComplete;
    return true;
  };

  var getIsPrevDisabled = function () {
    if (currentStep >= 1 && currentStep <= 4) return false;
    return true;
  };

  // Step 0: Fullscreen intro
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

  // Steps 1-4: Intro steps
  if (currentStep >= 1 && currentStep <= 4) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(MainCanvas, {
          mode: "intro",
          currentStep: currentStep,
          revealedPositions: revealedPositions,
        })
      ),
      React.createElement(
        "div",
        { className: "lower-panel" },
        React.createElement(Navigation, {
          onNav: handleNav,
          isNextDisabled: getIsNextDisabled(),
          isPrevDisabled: getIsPrevDisabled(),
          navText: navText,
          nextButtonRef: nextButtonRef,
        })
      ),
      React.createElement(Nudge, {
        show: !getIsNextDisabled(),
        targetRef: nextButtonRef,
      })
    );
  }

  // Steps 5-9: Machine steps
  if (currentStep >= 5 && currentStep <= 9) {
    var machineIdx = currentStep - 5;
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(MainCanvas, {
          mode: "serve",
          currentStep: currentStep,
          machineData: APP_DATA.machines[machineIdx],
          revealedPositions: revealedPositions,
          filledPositions: filledPositions,
          onStepComplete: handleStepComplete,
          onNavTextChange: handleNavTextChange,
          onPositionFilled: handlePositionFilled,
          onPositionRevealed: handlePositionRevealed,
        })
      ),
      React.createElement(
        "div",
        { className: "lower-panel" },
        React.createElement(Navigation, {
          onNav: handleNav,
          isNextDisabled: getIsNextDisabled(),
          isPrevDisabled: true,
          navText: navText,
          nextButtonRef: nextButtonRef,
        })
      ),
      React.createElement(Nudge, {
        show: !getIsNextDisabled(),
        targetRef: nextButtonRef,
      })
    );
  }

  // Step 10: Splash2
  if (currentStep === 10) {
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
          isNextDisabled: false,
          isPrevDisabled: true,
          navText: navText,
          nextButtonRef: nextButtonRef,
        })
      ),
      React.createElement(Nudge, {
        show: true,
        targetRef: nextButtonRef,
      })
    );
  }

  // Step 11: Fullscreen2 (complete summary)
  if (currentStep === 11) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(Fullscreen2, {
          data: APP_DATA.fullscreen2,
          onButtonClick: handleContinue,
          buttonRef: fullscreenButtonRef,
        })
      ),
      React.createElement(Nudge, {
        show: true,
        targetRef: fullscreenButtonRef,
      })
    );
  }

  // Step 12: Challenge problems
  if (currentStep === 12) {
    var problem = APP_DATA.problems[problemIndex];
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement("div", {
        className: "event-text-bar",
        dangerouslySetInnerHTML: { __html: problem.eventText },
      }),
      React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(MainCanvas, {
          mode: "challenge",
          currentStep: currentStep,
          problemData: problem,
          problemIndex: problemIndex,
          onStepComplete: handleStepComplete,
          onNavTextChange: handleNavTextChange,
        })
      ),
      React.createElement(
        "div",
        { className: "lower-panel" },
        React.createElement(Navigation, {
          onNav: handleNav,
          isNextDisabled: getIsNextDisabled(),
          isPrevDisabled: true,
          navText: navText,
          nextButtonRef: nextButtonRef,
        })
      ),
      React.createElement(Nudge, {
        show: !getIsNextDisabled(),
        targetRef: nextButtonRef,
      })
    );
  }

  // Step 13: Final fullscreen
  if (currentStep === 13) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(Fullscreen2, {
          data: APP_DATA.finalScreen,
          onButtonClick: handleStartOver,
          buttonRef: fullscreenButtonRef,
        })
      ),
      React.createElement(Nudge, {
        show: true,
        targetRef: fullscreenButtonRef,
      })
    );
  }

  return null;
};
