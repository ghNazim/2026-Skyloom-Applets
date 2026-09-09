const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [experiment, setExperiment] = useState(1);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [farthestCompletedStep, setFarthestCompletedStep] = useState(0);
  const [navInitialStage, setNavInitialStage] = useState("start");
  const [nextNudgeDismissed, setNextNudgeDismissed] = useState(false);

  const fullscreenButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const COMPLETE_STEP = 7;

  function getNextNavInitialStage(fromStep, toStep, farthest) {
    if (toStep <= farthest) return "final";
    return "start";
  }

  function getStepData(exp, stepNum) {
    var expData = APP_DATA.experiments[exp];
    if (!expData || !expData.steps) return null;
    return expData.steps[stepNum] || null;
  }

  const resetToFreshStart = function () {
    setCurrentStep(0);
    setExperiment(1);
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setIsNextDisabled(true);
    setFarthestCompletedStep(0);
    setNavInitialStage("start");
    setNextNudgeDismissed(false);
    setResetKey(function (prev) {
      return prev + 1;
    });
  };

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setIsNextDisabled(true);
    setFarthestCompletedStep(0);
    setNavInitialStage("start");
    setExperiment(1);
    setCurrentStep(1);
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    resetToFreshStart();
  };

  useEffect(
    function () {
      setNextNudgeDismissed(false);
    },
    [currentStep, experiment],
  );

  const handleNext = () => {
    if (isNextDisabled) return;
    if (typeof playSound === "function") playSound("click");
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setIsNextDisabled(true);

    if (currentStep < MAX_STEP) {
      var nextStep = currentStep + 1;
      setNavInitialStage(
        getNextNavInitialStage(currentStep, nextStep, farthestCompletedStep),
      );
      setCurrentStep(nextStep);
      return;
    }

    if (experiment < MAX_EXPERIMENT) {
      setExperiment(experiment + 1);
      setCurrentStep(1);
      setFarthestCompletedStep(0);
      setNavInitialStage("start");
      return;
    }

    setCurrentStep(COMPLETE_STEP);
  };

  const handlePrev = () => {
    if (isNextDisabled) return;
    if (currentStep === COMPLETE_STEP) return;
    if (currentStep <= 1 && experiment <= 1) return;
    if (typeof playSound === "function") playSound("click");
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setIsNextDisabled(true);
    setNavInitialStage("final");

    if (currentStep > 1) {
      setCurrentStep(function (prev) {
        return prev - 1;
      });
      return;
    }

    setExperiment(function (prev) {
      return prev - 1;
    });
    setCurrentStep(MAX_STEP);
    setFarthestCompletedStep(MAX_STEP);
  };

  const setNextEnabled = useCallback(
    function (enabled) {
      setIsNextDisabled(!enabled);
      if (enabled) {
        setFarthestCompletedStep(function (prev) {
          return Math.max(prev, currentStep);
        });
      }
    },
    [currentStep],
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
    const stepData = getStepData(experiment, currentStep);
    return stepData ? stepData.questionText : "";
  };

  const getNavText = () => {
    if (dynamicNavText !== null && dynamicNavText !== undefined) {
      return dynamicNavText;
    }
    const stepData = getStepData(experiment, currentStep);
    return stepData ? stepData.navText : "";
  };

  var showNextNudge =
    !isNextDisabled &&
    currentStep === farthestCompletedStep &&
    currentStep > 0 &&
    currentStep < COMPLETE_STEP &&
    !nextNudgeDismissed;

  var isPrevDisabled =
    isNextDisabled || (currentStep <= 1 && experiment <= 1);

  if (currentStep === 0 || currentStep === COMPLETE_STEP) {
    var screenData =
      currentStep === COMPLETE_STEP ? APP_DATA.complete : APP_DATA.start;
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: screenData.heading,
          text: screenData.text,
          buttonText: screenData.buttonText,
          onButtonClick:
            currentStep === COMPLETE_STEP ? handleRestart : handleStart,
          buttonRef: fullscreenButtonRef,
        }),
      ),
      React.createElement(Nudge, {
        targetRef: fullscreenButtonRef,
        active: !nextNudgeDismissed,
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
        key:
          resetKey +
          "-e" +
          experiment +
          "-" +
          currentStep +
          "-" +
          navInitialStage,
        step: currentStep,
        experiment: experiment,
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
        isPrevDisabled: isPrevDisabled,
        navText: getNavText(),
        nextButtonRef: nextButtonRef,
        showNextNudge: showNextNudge,
      }),
    ),
  );
};
