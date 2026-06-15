const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [farthestCompletedStep, setFarthestCompletedStep] = useState(0);
  const [navInitialStage, setNavInitialStage] = useState("start");
  const [nextNudgeDismissed, setNextNudgeDismissed] = useState(false);

  const fullscreenButtonRef = useRef(null);
  const nextButtonRef = useRef(null);

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

    if (currentStep === 4) {
      setCurrentStep(5);
      return;
    }

    var nextStep = currentStep + 1;
    setNavInitialStage(getNextNavInitialStage(currentStep, nextStep, farthestCompletedStep));
    setCurrentStep(nextStep);
  };

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

  if (currentStep === 5) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.final.heading,
          text: APP_DATA.final.text,
          buttonText: APP_DATA.final.buttonText,
          onButtonClick: handleRestart,
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
        key: resetKey + "-" + currentStep + "-" + navInitialStage,
        step: currentStep,
        initialStage: navInitialStage,
        onSetNextEnabled: setNextEnabled,
        onUpdateNavText: updateNavText,
        onUpdateQuestionText: updateQuestionText,
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
      }),
    ),
  );
};
