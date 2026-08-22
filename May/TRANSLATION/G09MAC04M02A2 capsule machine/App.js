function buildSplash2ImageSrcs(filled) {
  var fallback = APP_DATA.splash2.visualImages || [];
  var out = [];
  for (var i = 0; i < 5; i++) {
    var pos = i + 1;
    if (filled && filled[pos]) out.push(filled[pos]);
    else out.push(fallback[i] || "assets/machine.png");
  }
  return out;
}

/**
 * Completed view for a step so Previous can jump there without replaying it.
 * step 12 also needs problemIndex (challenge 1–5).
 */
function getCompletedStage(step, problemIndex) {
  problemIndex = problemIndex || 0;

  if (step >= 1 && step <= 4) {
    var introKeys = {
      1: "introStep1",
      2: "introStep2",
      3: "introStep3",
      4: "introStep4",
    };
    return {
      step: step,
      problemIndex: 0,
      phase: null,
      navText: APP_DATA[introKeys[step]].navText,
      isStepComplete: true,
      restoreCanvas: false,
    };
  }

  if (step >= 5 && step <= 9) {
    var machine = APP_DATA.machines[step - 5];
    return {
      step: step,
      problemIndex: 0,
      phase: "placed",
      navText: machine.navAfterPlace,
      isStepComplete: true,
      restoreCanvas: true,
      gridBalls: (machine.serves || []).slice(),
    };
  }

  if (step === 10) {
    return {
      step: 10,
      problemIndex: 0,
      phase: null,
      navText: APP_DATA.splash2.navText,
      isStepComplete: true,
      restoreCanvas: false,
    };
  }

  if (step === 11) {
    return {
      step: 11,
      problemIndex: 0,
      phase: null,
      navText: "",
      isStepComplete: true,
      restoreCanvas: false,
    };
  }

  if (step === 12) {
    var problem = APP_DATA.problems[problemIndex];
    return {
      step: 12,
      problemIndex: problemIndex,
      phase: "served",
      navText: problem.afterServeNav,
      isStepComplete: true,
      restoreCanvas: true,
      gridBalls: (problem.serves || []).slice(),
    };
  }

  if (step === 13) {
    return {
      step: 13,
      problemIndex: 0,
      phase: null,
      navText: "",
      isStepComplete: true,
      restoreCanvas: false,
    };
  }

  return null;
}

function getPreviousLocation(step, problemIndex) {
  if (step === 12 && problemIndex > 0) {
    return { step: 12, problemIndex: problemIndex - 1 };
  }
  if (step <= 1) {
    return { step: 0, problemIndex: 0 };
  }
  return { step: step - 1, problemIndex: 0 };
}

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

  var restoreState = useState(false);
  var restoreCanvas = restoreState[0];
  var setRestoreCanvas = restoreState[1];

  var farthestProblemState = useState(-1);
  var farthestCompletedProblem = farthestProblemState[0];
  var setFarthestCompletedProblem = farthestProblemState[1];

  var busyState = useState(false);
  var isCanvasBusy = busyState[0];
  var setIsCanvasBusy = busyState[1];

  var fullscreenButtonRef = useRef(null);
  var nextButtonRef = useRef(null);

  var handleStart = function () {
    playSound("click");
    setCurrentStep(1);
    setNavText(APP_DATA.introStep1.navText);
  };

  var handleContinue = function () {
    playSound("click");
    setFilledPositions({});
    setProblemIndex(0);
    setCurrentStep(12);
    setIsStepComplete(false);
    setRestoreCanvas(false);
    setFarthestCompletedProblem(-1);
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
    setRestoreCanvas(false);
    setFarthestCompletedProblem(-1);
  };

  var handleStepComplete = function () {
    setIsStepComplete(true);
    if (currentStep === 12) {
      setFarthestCompletedProblem(function (prev) {
        return problemIndex > prev ? problemIndex : prev;
      });
    }
  };

  var applyCompletedStage = function (stage) {
    if (!stage) return;
    setCurrentStep(stage.step);
    setProblemIndex(stage.problemIndex || 0);
    setIsStepComplete(stage.isStepComplete);
    setNavText(stage.navText);
    setRestoreCanvas(!!stage.restoreCanvas);
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
        setRestoreCanvas(false);
        setCurrentStep(nextStep);
        setIsStepComplete(true);
        if (nextStep === 2) setNavText(APP_DATA.introStep2.navText);
        else if (nextStep === 3) setNavText(APP_DATA.introStep3.navText);
        else if (nextStep === 4) setNavText(APP_DATA.introStep4.navText);
      } else if (currentStep === 4) {
        var machine0Done = !!filledPositions[APP_DATA.machines[0].correctPosition];
        if (machine0Done) {
          applyCompletedStage(getCompletedStage(5));
        } else {
          setCurrentStep(5);
          setIsStepComplete(false);
          setRestoreCanvas(false);
          setNavText(APP_DATA.machines[0].navInitial);
        }
      } else if (currentStep >= 5 && currentStep <= 8 && isStepComplete) {
        var destStep = currentStep + 1;
        var destMachine = APP_DATA.machines[destStep - 5];
        var destDone = destMachine && filledPositions[destMachine.correctPosition];
        if (destDone) {
          applyCompletedStage(getCompletedStage(destStep));
        } else {
          setCurrentStep(destStep);
          setIsStepComplete(false);
          setRestoreCanvas(false);
          setNavText(destMachine.navInitial);
        }
      } else if (currentStep === 9 && isStepComplete) {
        applyCompletedStage(getCompletedStage(10));
      } else if (currentStep === 10) {
        setCurrentStep(11);
        setIsStepComplete(false);
        setRestoreCanvas(false);
        setNavText("");
      } else if (currentStep === 12 && isStepComplete) {
        var nextProbIdx = problemIndex + 1;
        if (nextProbIdx < APP_DATA.problems.length) {
          setFilledPositions({});
          if (nextProbIdx <= farthestCompletedProblem) {
            applyCompletedStage(getCompletedStage(12, nextProbIdx));
          } else {
            setProblemIndex(nextProbIdx);
            setIsStepComplete(false);
            setRestoreCanvas(false);
            setNavText(APP_DATA.challengeNavInitial);
          }
        } else {
          setCurrentStep(13);
          setIsStepComplete(false);
          setRestoreCanvas(false);
          setNavText("");
        }
      }
    } else if (direction === "prev") {
      if (isCanvasBusy) return;
      playSound("click");
      var loc = getPreviousLocation(currentStep, problemIndex);
      if (loc.step === 0) {
        setCurrentStep(0);
        setIsStepComplete(false);
        setRestoreCanvas(false);
        setNavText("");
        return;
      }
      applyCompletedStage(getCompletedStage(loc.step, loc.problemIndex));
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
    if (isCanvasBusy) return true;
    if (currentStep >= 1 && currentStep <= 10) return false;
    if (currentStep === 12) return false;
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
          onBusyChange: setIsCanvasBusy,
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
          key: "serve-" + currentStep + (restoreCanvas ? "-done" : ""),
          mode: "serve",
          currentStep: currentStep,
          machineData: APP_DATA.machines[machineIdx],
          revealedPositions: revealedPositions,
          filledPositions: filledPositions,
          onStepComplete: handleStepComplete,
          onNavTextChange: handleNavTextChange,
          onPositionFilled: handlePositionFilled,
          onPositionRevealed: handlePositionRevealed,
          startAtCompleted: restoreCanvas,
          onBusyChange: setIsCanvasBusy,
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

  // Step 10: Splash2
  if (currentStep === 10) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(Splash2, {
          imageSrcs: buildSplash2ImageSrcs(filledPositions),
        })
      ),
      React.createElement(
        "div",
        { className: "lower-panel" },
        React.createElement(Navigation, {
          onNav: handleNav,
          isNextDisabled: false,
          isPrevDisabled: getIsPrevDisabled(),
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
          key: "challenge-" + problemIndex + (restoreCanvas ? "-done" : ""),
          mode: "challenge",
          currentStep: currentStep,
          problemData: problem,
          problemIndex: problemIndex,
          onStepComplete: handleStepComplete,
          onNavTextChange: handleNavTextChange,
          startAtCompleted: restoreCanvas,
          onBusyChange: setIsCanvasBusy,
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
