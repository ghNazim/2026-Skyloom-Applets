// --- DEV JUMP ---------------------------------------------------------------
// Start the applet at any section by adding ?step=N to the URL (N = 0..6):
//   0 welcome · 1 intro · 2 build table · 3 CF column · 4 count n + formula
//   5 median position/value · 6 well done
// Optional &stage=final shows that section already solved (instead of playing
// its intro). The step's setup effect auto-fills the table/CF for you, so a
// direct jump lands on a ready scene. Example: index.html?step=5&stage=final
// Omit the params entirely and it behaves normally, starting at the welcome.
function readJumpParam(name) {
  try { return new URLSearchParams(window.location.search).get(name); } catch (e) { return null; }
}
function getInitialStep() {
  var n = parseInt(readJumpParam("step"), 10);
  return (!isNaN(n) && n >= 0 && n <= 6) ? n : 0;
}
function getInitialStage() {
  return readJumpParam("stage") === "final" ? "final" : "start";
}

const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const jumpStep = getInitialStep();
  const jumpStage = getInitialStage();
  const [currentStep, setCurrentStep] = useState(jumpStep);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  // When jumping to an already-solved view, mark earlier steps complete so nav
  // (« / ») treats them as revisitable rather than fresh.
  const [farthestCompletedStep, setFarthestCompletedStep] = useState(jumpStage === "final" ? jumpStep : 0);
  const [navInitialStage, setNavInitialStage] = useState(jumpStep > 0 ? jumpStage : "start");
  const [nextNudgeDismissed, setNextNudgeDismissed] = useState(false);
  const [tableDirection, setTableDirection] = useState("asc");

  const fullscreenButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const startOverButtonRef = useRef(null);

  function getNextNavInitialStage(fromStep, toStep, farthest) {
    if (toStep <= farthest) return "final";
    return "start";
  }

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setIsNextDisabled(true);
    setFarthestCompletedStep(0);
    setNavInitialStage("start");
    setTableDirection("asc");
    setCurrentStep(1);
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setIsNextDisabled(true);
    setFarthestCompletedStep(0);
    setNavInitialStage("start");
    setTableDirection("asc");
    setResetKey(function (prev) { return prev + 1; });
  };

  useEffect(function () {
    setNextNudgeDismissed(false);
  }, [currentStep]);

  const handleNext = () => {
    if (isNextDisabled) return;
    if (typeof playSound === "function") playSound("click");
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setIsNextDisabled(true);

    if (currentStep === 3) {
      setCurrentStep(4);
      return;
    }

    var nextStep = currentStep + 1;
    setNavInitialStage(getNextNavInitialStage(currentStep, nextStep, farthestCompletedStep));
    setCurrentStep(nextStep);
  };

  const handleAutoAdvance = useCallback(function () {
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setIsNextDisabled(true);
    setNavInitialStage("start");
    setCurrentStep(function (prev) { return prev + 1; });
  }, []);

  const handlePrev = () => {
    if (isNextDisabled || currentStep <= 1) return;
    if (typeof playSound === "function") playSound("click");
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setIsNextDisabled(true);
    setNavInitialStage("final");
    setCurrentStep(function (prev) { return prev - 1; });
  };

  const setNextEnabled = useCallback(function (enabled) {
    setIsNextDisabled(!enabled);
    if (enabled) {
      setFarthestCompletedStep(function (prev) {
        return Math.max(prev, currentStep);
      });
    }
  }, [currentStep]);

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
    return stepData ? stepData.navText : "";
  };

  var showNextNudge =
    !isNextDisabled &&
    currentStep === farthestCompletedStep &&
    !nextNudgeDismissed;

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
        }),
      ),
      React.createElement(Nudge, {
        targetRef: fullscreenButtonRef,
        active: !nextNudgeDismissed,
        onDismiss: function () { setNextNudgeDismissed(true); },
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
        // Steps 4 and 5 are ONE continuous scene: choosing the formula in step 4 flows
        // straight into the step-5 auto-calculation. If the key changed on 4->5 the whole
        // canvas would remount, and a fresh MainCanvas paints its blank initial state (empty
        // table, no CF, no n) for one frame before the setup effect refills it — that empty
        // frame is the "blink". Collapsing 5's key onto 4 keeps the canvas mounted so the
        // table/CF/n persist untouched and only the calculation animates in. Every other
        // transition still changes the key (step number, or navInitialStage flipping to
        // "final" on back-nav), so those still get their clean remount.
        key: resetKey + "-" + (currentStep === 5 ? 4 : currentStep) + "-" + navInitialStage,
        step: currentStep,
        initialStage: navInitialStage,
        onSetNextEnabled: setNextEnabled,
        onUpdateNavText: updateNavText,
        onUpdateQuestionText: updateQuestionText,
        onAutoAdvance: handleAutoAdvance,
        tableDirection: tableDirection,
        onSetTableDirection: setTableDirection,
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
        isNextDisabled: isNextDisabled,
        isPrevDisabled: isNextDisabled || currentStep <= 1,
        navText: getNavText(),
        nextButtonRef: nextButtonRef,
        showNextNudge: showNextNudge,
        isFinalStep: currentStep === 6,
        startOverText: APP_DATA.final.buttonText,
        startOverButtonRef: startOverButtonRef,
        showStartOverNudge: currentStep === 6 && !nextNudgeDismissed,
        onStartOverNudgeDismiss: function () { setNextNudgeDismissed(true); },
        onRestart: handleRestart,
      }),
    ),
  );
};
