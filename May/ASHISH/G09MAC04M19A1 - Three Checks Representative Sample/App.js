function getProgress(step) {
  if (step === 0) return 0;
  if (step === 1) return 1;
  if (step === 2) return 2;
  if (step === "A1") return 3;
  if (step === "A2") return 4;
  if (step === "A3") return 5;
  return 0;
}

function getNextStep(step) {
  if (step === 1) return 2;
  if (step === "A1") return "A2";
  if (step === "A2") return "A3";
  return step;
}

function getPrevStep(step) {
  if (step === 2) return 1;
  if (step === "A1") return 2;
  if (step === "A2") return "A1";
  if (step === "A3") return "A2";
  return step;
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
  const [remainingTests, setRemainingTests] = useState(["centre", "spread"]);

  const fullscreenButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const progressRef = useRef({ step: 0 });
  progressRef.current = { step: currentStep };

  const isCatchingUp = useCallback(
    function () {
      return getProgress(currentStep) < farthestProgress - 1e-6;
    },
    [currentStep, farthestProgress],
  );

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setFarthestProgress(1);
    setStartAtFinal(false);
    setCurrentStep(1);
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
      } else if (currentStep === "A1" || currentStep === "A2") {
        setIsNextDisabled(true);
      } else if (currentStep === "A3") {
        setIsNextDisabled(true);
        setNavLocked(false);
        setFarthestProgress(function (prev) {
          return Math.max(prev, 5);
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
      if (testId === "shape") {
        var catchingUp = getProgress("A1") < farthestProgress - 1e-6;
        setStartAtFinal(catchingUp);
        setDynamicNavText(null);
        setDynamicQuestionText(null);
        setCurrentStep("A1");
      }
    },
    [farthestProgress],
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
    if (currentStep === "A3") {
      if (
        remainingTests.indexOf("centre") !== -1 &&
        remainingTests.indexOf("spread") !== -1
      ) {
        return stepData.navCentreOrSpread;
      }
      if (remainingTests.indexOf("centre") !== -1) return stepData.navCentreOnly;
      if (remainingTests.indexOf("spread") !== -1) return stepData.navSpreadOnly;
      return stepData.navCentreOrSpread;
    }
    return stepData.navText || "";
  };

  var canvasGroup = currentStep === 1 ? "s1" : "flow";
  var mainCanvasKey = resetKey + "-" + canvasGroup;

  var isPrevDisabled = currentStep === 1 || navLocked;

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
