const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(1);
  const [currentExperiment, setCurrentExperiment] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [farthestCompletedStep, setFarthestCompletedStep] = useState(0);
  const [farthestCompletedExperiment, setFarthestCompletedExperiment] = useState(0);
  const [completedExperiments, setCompletedExperiments] = useState([]);
  const [navInitialStage, setNavInitialStage] = useState("start");
  const [nextNudgeDismissed, setNextNudgeDismissed] = useState(false);
  const [playNudgeDismissed, setPlayNudgeDismissed] = useState(false);
  const [startOverNudgeDismissed, setStartOverNudgeDismissed] = useState(false);

  const nextButtonRef = useRef(null);
  const playButtonRef = useRef(null);
  const startOverButtonRef = useRef(null);

  const experimentCount = APP_DATA.experiments.length;
  const lastExperimentIndex = experimentCount - 1;

  const getNextNavInitialStage = (fromStep, toStep, farthest) => {
    if (toStep <= farthest) return "final";
    return "start";
  };

  const play = (name) => {
    if (typeof playSound === "function") playSound(name);
  };

  const handleRestart = () => {
    play("click");
    setCurrentStep(1);
    setCurrentExperiment(0);
    setDynamicNavText(null);
    setIsNextDisabled(true);
    setFarthestCompletedStep(0);
    setFarthestCompletedExperiment(0);
    setCompletedExperiments([]);
    setNavInitialStage("start");
    setResetKey((prev) => prev + 1);
  };

  useEffect(() => {
    setNextNudgeDismissed(false);
    setPlayNudgeDismissed(false);
    setStartOverNudgeDismissed(false);
  }, [currentStep, currentExperiment]);

  const handleNext = () => {
    if (isNextDisabled) return;
    play("click");
    setDynamicNavText(null);
    setIsNextDisabled(true);

    if (currentStep === 5) {
      if (currentExperiment < lastExperimentIndex) {
        const nextExperiment = currentExperiment + 1;
        setCurrentExperiment(nextExperiment);
        setNavInitialStage(completedExperiments.includes(nextExperiment) ? "final" : "start");
        setResetKey((prev) => prev + 1);
        return;
      }
      setCurrentStep(6);
      return;
    }

    if (currentStep >= 6) return;

    const nextStep = currentStep + 1;
    setNavInitialStage(getNextNavInitialStage(currentStep, nextStep, farthestCompletedStep));
    setCurrentStep(nextStep);
  };

  const handlePlay = useCallback(() => {
    play("click");
    setDynamicNavText(null);
    setIsNextDisabled(true);
    setCurrentExperiment(0);
    setNavInitialStage(completedExperiments.includes(0) ? "final" : "start");
    setCurrentStep(5);
    setResetKey((prev) => prev + 1);
  }, [completedExperiments]);

  const handlePrev = () => {
    if (isNextDisabled) return;

    if (currentStep === 5 && currentExperiment > 0) {
      play("click");
      setDynamicNavText(null);
      setIsNextDisabled(true);
      const prevExperiment = currentExperiment - 1;
      setNavInitialStage(completedExperiments.includes(prevExperiment) ? "final" : "start");
      setCurrentExperiment(prevExperiment);
      setResetKey((prev) => prev + 1);
      return;
    }

    if (currentStep <= 1) return;
    play("click");
    setDynamicNavText(null);
    setIsNextDisabled(true);
    setNavInitialStage("final");
    setCurrentStep((prev) => prev - 1);
  };

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
    if (enabled) {
      setFarthestCompletedStep((prev) => Math.max(prev, currentStep));
      if (currentStep === 5) {
        setFarthestCompletedExperiment((prev) => Math.max(prev, currentExperiment));
        setCompletedExperiments((prev) =>
          prev.includes(currentExperiment) ? prev : prev.concat(currentExperiment),
        );
      }
    }
  }, [currentStep, currentExperiment]);

  const updateNavText = useCallback((nav) => {
    setDynamicNavText(nav);
  }, []);

  const getQuestionText = () => APP_DATA.questionText;

  const getNavText = () => {
    if (dynamicNavText !== null && dynamicNavText !== undefined) {
      return dynamicNavText;
    }
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.navText : "";
  };

  const showNextNudge = !isNextDisabled && !nextNudgeDismissed;

  if (currentStep === 4) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(PlayIntroScreen, {
          onPlay: handlePlay,
          buttonRef: playButtonRef,
        }),
      ),
      React.createElement(Nudge, {
        targetRef: playButtonRef,
        active: !playNudgeDismissed,
        onDismiss: () => setPlayNudgeDismissed(true),
      }),
    );
  }

  if (currentStep === 6) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(CompletionScreen, {
          onRestart: handleRestart,
          buttonRef: startOverButtonRef,
        }),
      ),
      React.createElement(Nudge, {
        targetRef: startOverButtonRef,
        active: !startOverNudgeDismissed,
        onDismiss: () => setStartOverNudgeDismissed(true),
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
          "-" +
          (currentStep === 5 ? "e" + currentExperiment : "t") +
          "-" +
          navInitialStage,
        step: currentStep,
        experimentIndex: currentExperiment,
        initialStage: navInitialStage,
        onSetNextEnabled: setNextEnabled,
        onUpdateNavText: updateNavText,
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => {
          if (dir === "next") handleNext();
          else if (dir === "prev") handlePrev();
        },
        isNextDisabled: isNextDisabled,
        isPrevDisabled: isNextDisabled || (currentStep <= 1 && currentExperiment === 0),
        navText: getNavText(),
        nextButtonRef: nextButtonRef,
        showNextNudge: showNextNudge,
        onNextNudgeDismiss: () => setNextNudgeDismissed(true),
      }),
    ),
  );
};
