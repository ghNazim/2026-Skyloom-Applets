function getProgress(step) {
  if (step === 0) return 0;
  if (step === 1) return 1;
  if (step === 2) return 2;
  if (step === "A1") return 3;
  if (step === "A2") return 4;
  if (step === "A3") return 5;
  if (step === "C1") return 6;
  if (step === "C2") return 7;
  if (step === "C3") return 8;
  if (step === "B1") return 9;
  if (step === "B2") return 10;
  if (step === "B3") return 11;
  if (step === 3) return 12;
  if (step === 4) return 13;
  return 0;
}

function getNextStep(step) {
  if (step === 1) return 2;
  if (step === "A1") return "A2";
  if (step === "A2") return "A3";
  if (step === "C1") return "C2";
  if (step === "C2") return "C3";
  if (step === "B1") return "B2";
  if (step === "B2") return "B3";
  return step;
}

function getPrevStep(step) {
  if (step === 2) return 1;
  if (step === "A1") return 2;
  if (step === "A2") return "A1";
  if (step === "A3") return "A2";
  if (step === "C1") return 2;
  if (step === "C2") return "C1";
  if (step === "C3") return "C2";
  if (step === "B1") return 2;
  if (step === "B2") return "B1";
  if (step === "B3") return "B2";
  return step;
}

function remainingNavText(remaining, stepData) {
  var hasShape = remaining.indexOf("shape") !== -1;
  var hasCentre = remaining.indexOf("centre") !== -1;
  var hasSpread = remaining.indexOf("spread") !== -1;
  var count = (hasShape ? 1 : 0) + (hasCentre ? 1 : 0) + (hasSpread ? 1 : 0);
  if (count === 0) return "";
  if (count === 1) {
    if (hasCentre) return stepData.navCentreOnly;
    if (hasSpread) return stepData.navSpreadOnly;
    return stepData.navShapeOnly;
  }
  if (hasCentre && hasSpread && !hasShape) return stepData.navCentreOrSpread;
  if (hasShape && hasCentre && !hasSpread) return stepData.navShapeOrCentre;
  if (hasShape && hasSpread && !hasCentre) return stepData.navShapeOrSpread;
  return stepData.navCentreOrSpread;
}

const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [navLocked, setNavLocked] = useState(false);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [startAtFinal, setStartAtFinal] = useState(false);
  const [farthestProgress, setFarthestProgress] = useState(0);
  const [nextNudgeDismissed, setNextNudgeDismissed] = useState(false);
  const [remainingTests, setRemainingTests] = useState([
    "shape",
    "centre",
    "spread",
  ]);
  const [completedTests, setCompletedTests] = useState([]);

  const fullscreenButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const progressRef = useRef({ step: 0 });
  progressRef.current = { step: currentStep };

  const isCatchingUp = useCallback(
    function () {
      if (currentStep === "A1" || currentStep === "A2" || currentStep === "A3") {
        return completedTests.indexOf("shape") !== -1;
      }
      if (currentStep === "B1" || currentStep === "B2" || currentStep === "B3") {
        return completedTests.indexOf("centre") !== -1;
      }
      if (currentStep === "C1" || currentStep === "C2" || currentStep === "C3") {
        return completedTests.indexOf("spread") !== -1;
      }
      return getProgress(currentStep) < farthestProgress - 1e-6;
    },
    [currentStep, farthestProgress, completedTests],
  );

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setFarthestProgress(1);
    setStartAtFinal(false);
    setCurrentStep(1);
  };

  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setFarthestProgress(0);
    setIsNextDisabled(true);
    setNavLocked(false);
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setStartAtFinal(false);
    setRemainingTests(["shape", "centre", "spread"]);
    setCompletedTests([]);
    setResetKey(function (k) { return k + 1; });
  };

  const setNextEnabled = useCallback(function (enabled) {
    setIsNextDisabled(!enabled);
    if (enabled) {
      var prog = getProgress(progressRef.current.step);
      setFarthestProgress(function (prev) {
        return Math.max(prev, prog);
      });
    }
  }, []);

  const setNavLock = useCallback(function (locked) {
    setNavLocked(!!locked);
  }, []);

  useEffect(
    function () {
      setDynamicNavText(null);
      setDynamicQuestionText(null);

      if (currentStep === 1) {
        setIsNextDisabled(false);
        setNavLocked(false);
        setFarthestProgress(function (prev) {
          return Math.max(prev, 1);
        });
      } else if (currentStep === 2) {
        setIsNextDisabled(true);
      } else if (
        currentStep === "A1" ||
        currentStep === "A2" ||
        currentStep === "C1" ||
        currentStep === "C2" ||
        currentStep === "B1" ||
        currentStep === "B2"
      ) {
        setIsNextDisabled(true);
      } else if (currentStep === "A3") {
        setIsNextDisabled(true);
        setNavLocked(false);
        setCompletedTests(function (prev) {
          return prev.indexOf("shape") === -1 ? prev.concat("shape") : prev;
        });
        setRemainingTests(function (prev) {
          return prev.filter(function (id) {
            return id !== "shape";
          });
        });
        setFarthestProgress(function (prev) {
          return Math.max(prev, 5);
        });
      } else if (currentStep === "C3") {
        setIsNextDisabled(true);
        setNavLocked(false);
        setCompletedTests(function (prev) {
          return prev.indexOf("spread") === -1 ? prev.concat("spread") : prev;
        });
        setRemainingTests(function (prev) {
          return prev.filter(function (id) {
            return id !== "spread";
          });
        });
        setFarthestProgress(function (prev) {
          return Math.max(prev, 8);
        });
      } else if (currentStep === "B3") {
        setIsNextDisabled(true);
        setNavLocked(false);
        setCompletedTests(function (prev) {
          return prev.indexOf("centre") === -1 ? prev.concat("centre") : prev;
        });
        setRemainingTests(function (prev) {
          return prev.filter(function (id) {
            return id !== "centre";
          });
        });
        setFarthestProgress(function (prev) {
          return Math.max(prev, 11);
        });
      } else if (currentStep === 3) {
        setIsNextDisabled(true);
        setNavLocked(false);
        setFarthestProgress(function (prev) {
          return Math.max(prev, 12);
        });
      } else if (currentStep === 4) {
        setFarthestProgress(function (prev) {
          return Math.max(prev, 13);
        });
      }
    },
    [currentStep, startAtFinal],
  );

  useEffect(
    function () {
      setNextNudgeDismissed(false);
    },
    [currentStep, startAtFinal],
  );

  var currentProgress = getProgress(currentStep);
  var atFarthestFrontier = Math.abs(currentProgress - farthestProgress) < 1e-6;
  var showNextNudge =
    !isNextDisabled &&
    !navLocked &&
    currentStep !== 0 &&
    atFarthestFrontier &&
    !nextNudgeDismissed;
  var showFullscreenNudge = atFarthestFrontier && !nextNudgeDismissed;

  const handleNext = () => {
    if (isNextDisabled || navLocked) return;
    if (typeof playSound === "function") playSound("click");

    var catchingUp = isCatchingUp();
    var nextStep = getNextStep(currentStep);

    if (
      (currentStep === "A2" || currentStep === "B2" || currentStep === "C2") &&
      completedTests.length >= 2
    ) {
      var lastTest =
        currentStep === "A2" ? "shape" : currentStep === "B2" ? "centre" : "spread";
      var allDone =
        completedTests.indexOf(lastTest) !== -1
          ? completedTests.length >= 3
          : completedTests.length >= 2;
      if (allDone) {
        nextStep = 3;
      }
    }

    if (currentStep === 3) {
      nextStep = 4;
    }

    if (nextStep === currentStep) return;

    setStartAtFinal(catchingUp);
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setCurrentStep(nextStep);
  };

  const handlePrev = () => {
    if (navLocked) return;
    if (currentStep === 1) return;
    if (typeof playSound === "function") playSound("click");

    setStartAtFinal(true);
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setCurrentStep(getPrevStep(currentStep));
  };

  const handleSelectTest = useCallback(
    function (testId) {
      var alreadyDone = completedTests.indexOf(testId) !== -1;
      setStartAtFinal(alreadyDone);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      if (testId === "shape") setCurrentStep("A1");
      else if (testId === "centre") setCurrentStep("B1");
      else if (testId === "spread") setCurrentStep("C1");
    },
    [completedTests],
  );

  const updateNavText = useCallback(function (nav) {
    setDynamicNavText(nav);
  }, []);

  const updateQuestionText = useCallback(function (text) {
    setDynamicQuestionText(text);
  }, []);

  const getQuestionText = () => {
    if (dynamicQuestionText !== null && dynamicQuestionText !== undefined) {
      return dynamicQuestionText;
    }
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.questionText : "";
  };

  const getNavText = () => {
    if (dynamicNavText !== null && dynamicNavText !== undefined) {
      return dynamicNavText;
    }
    const stepData = APP_DATA.steps[currentStep];
    if (!stepData) return "";
    if (currentStep === "A3" || currentStep === "C3" || currentStep === "B3") {
      var remaining = remainingTests.slice();
      if (currentStep === "A3") {
        remaining = remaining.filter(function (id) {
          return id !== "shape";
        });
      }
      if (currentStep === "C3") {
        remaining = remaining.filter(function (id) {
          return id !== "spread";
        });
      }
      if (currentStep === "B3") {
        remaining = remaining.filter(function (id) {
          return id !== "centre";
        });
      }
      return remainingNavText(remaining, stepData);
    }
    return stepData.navText || "";
  };

  var canvasGroup = currentStep === 1 ? "s1" : "flow";
  var mainCanvasKey = resetKey + "-" + canvasGroup;

  var isPrevDisabled = currentStep === 1 || currentStep === 3 || navLocked;

  if (currentStep === 4) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.steps[4].heading,
          text: APP_DATA.steps[4].text,
          buttonText: APP_DATA.steps[4].buttonText,
          onButtonClick: handleStartOver,
          buttonRef: fullscreenButtonRef,
          left: true,
        }),
      ),
    );
  }

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
          buttonRef: fullscreenButtonRef,
          left: true,
        }),
      ),
      React.createElement(Nudge, {
        targetRef: fullscreenButtonRef,
        active: showFullscreenNudge,
        onDismiss: function () {
          setNextNudgeDismissed(true);
        },
      }),
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: getQuestionText(),
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        key: mainCanvasKey,
        step: currentStep,
        startAtFinal: startAtFinal,
        remainingTests: remainingTests,
        completedTests: completedTests,
        onSetNextEnabled: setNextEnabled,
        onSetNavLocked: setNavLock,
        onUpdateNavText: updateNavText,
        onUpdateQuestionText: updateQuestionText,
        onSelectTest: handleSelectTest,
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: function (dir) {
          if (dir === "next") handleNext();
          else if (dir === "prev") handlePrev();
        },
        isNextDisabled: isNextDisabled || navLocked,
        isPrevDisabled: isPrevDisabled,
        navText: getNavText(),
        nextButtonRef: nextButtonRef,
      }),
    ),
    React.createElement(Nudge, {
      targetRef: nextButtonRef,
      active: showNextNudge,
      onDismiss: function () {
        setNextNudgeDismissed(true);
      },
    }),
  );
};
