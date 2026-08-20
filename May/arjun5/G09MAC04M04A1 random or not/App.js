const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;
  const CHOICE_COUNT = APP_DATA.choiceQuestions.length;

  const [currentStep, setCurrentStep] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState([]);
  const [navInitialStage, setNavInitialStage] = useState("start");
  const [nextNudgeDismissed, setNextNudgeDismissed] = useState(false);
  const [farthestCompletedStep, setFarthestCompletedStep] = useState(0);

  const fullscreenButtonRef = useRef(null);
  const nextButtonRef = useRef(null);

  const play = (name) => {
    if (typeof playSound === "function") playSound(name);
  };

  const resetProgress = () => {
    setDynamicNavText(null);
    setIsNextDisabled(true);
    setCompletedQuestions([]);
    setQuestionIndex(0);
    setFarthestCompletedStep(0);
    setNavInitialStage("start");
    setNextNudgeDismissed(false);
    setResetKey((prev) => prev + 1);
  };

  const handleStart = () => {
    play("click");
    resetProgress();
    setCurrentStep(1);
  };

  const handleContinue = () => {
    play("click");
    setDynamicNavText(null);
    setIsNextDisabled(true);
    setNavInitialStage(farthestCompletedStep >= 3 ? "final" : "start");
    setCurrentStep(3);
    setResetKey((prev) => prev + 1);
  };

  const handleStartOver = () => {
    play("click");
    resetProgress();
    setCurrentStep(0);
  };

  useEffect(() => {
    setNextNudgeDismissed(false);
  }, [currentStep, questionIndex]);

  const handleNext = () => {
    if (isNextDisabled) return;
    if (currentStep === 7) return;
    play("click");
    setDynamicNavText(null);
    setIsNextDisabled(true);

    if (currentStep === 1) {
      if (questionIndex < CHOICE_COUNT - 1) {
        const nextQuestion = questionIndex + 1;
        setQuestionIndex(nextQuestion);
        setNavInitialStage(completedQuestions.includes(nextQuestion) ? "final" : "start");
        setResetKey((prev) => prev + 1);
        return;
      }
      setCurrentStep(2);
      return;
    }

    if (currentStep === 3) {
      setNavInitialStage(farthestCompletedStep >= 4 ? "final" : "start");
      setCurrentStep(4);
      setResetKey((prev) => prev + 1);
      return;
    }

    if (currentStep === 4) {
      setNavInitialStage(farthestCompletedStep >= 5 ? "final" : "start");
      setCurrentStep(5);
      setResetKey((prev) => prev + 1);
      return;
    }

    if (currentStep === 5) {
      setNavInitialStage(farthestCompletedStep >= 6 ? "final" : "start");
      setCurrentStep(6);
      setResetKey((prev) => prev + 1);
      return;
    }

    if (currentStep === 6) {
      setCurrentStep(7);
    }
  };

  const handlePrev = () => {
    if (isNextDisabled) return;

    if (currentStep === 1 && questionIndex > 0) {
      play("click");
      setDynamicNavText(null);
      setIsNextDisabled(true);
      const prevQuestion = questionIndex - 1;
      setQuestionIndex(prevQuestion);
      setNavInitialStage("final");
      setResetKey((prev) => prev + 1);
      return;
    }

    if (currentStep === 3) {
      play("click");
      setDynamicNavText(null);
      setIsNextDisabled(true);
      setCurrentStep(1);
      setQuestionIndex(CHOICE_COUNT - 1);
      setNavInitialStage("final");
      setResetKey((prev) => prev + 1);
      return;
    }

    if (currentStep === 4) {
      play("click");
      setDynamicNavText(null);
      setIsNextDisabled(true);
      setNavInitialStage("final");
      setCurrentStep(3);
      setResetKey((prev) => prev + 1);
      return;
    }

    if (currentStep === 5) {
      play("click");
      setDynamicNavText(null);
      setIsNextDisabled(true);
      setNavInitialStage("final");
      setCurrentStep(4);
      setResetKey((prev) => prev + 1);
      return;
    }

    if (currentStep === 6) {
      play("click");
      setDynamicNavText(null);
      setIsNextDisabled(true);
      setNavInitialStage("final");
      setCurrentStep(5);
      setResetKey((prev) => prev + 1);
    }
  };

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
    if (enabled) {
      setFarthestCompletedStep((prev) => Math.max(prev, currentStep));
      if (currentStep === 1) {
        setCompletedQuestions((prev) => (
          prev.includes(questionIndex) ? prev : prev.concat(questionIndex)
        ));
      }
    }
  }, [currentStep, questionIndex]);

  const updateNavText = useCallback((nav) => {
    setDynamicNavText(nav);
  }, []);

  const getNavText = () => {
    let nav = "";
    if (dynamicNavText !== null && dynamicNavText !== undefined) {
      nav = dynamicNavText;
    } else {
      const stepData = APP_DATA.steps[currentStep];
      nav = stepData ? stepData.navText : "";
    }
    return typeof handleComma === "function" ? handleComma(nav) : nav;
  };

  const showNextNudge = !isNextDisabled && !nextNudgeDismissed;
  const isPrevDisabled = isNextDisabled || (
    (currentStep === 1 && questionIndex === 0) ||
    (currentStep === 3)
  );

  const renderFullscreen = (config, onButtonClick) =>
    React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: config.heading,
          text: config.text,
          buttonText: config.buttonText,
          onButtonClick,
          buttonRef: fullscreenButtonRef,
        }),
      ),
      React.createElement(Nudge, {
        targetRef: fullscreenButtonRef,
        active: !nextNudgeDismissed,
        onDismiss: () => setNextNudgeDismissed(true),
      }),
    );

  if (currentStep === 0) {
    return renderFullscreen(APP_DATA.start, handleStart);
  }

  if (currentStep === 2) {
    return renderFullscreen(APP_DATA.summary, handleContinue);
  }

  if (currentStep === 7) {
    return renderFullscreen(APP_DATA.final, handleStartOver);
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        key: `${resetKey}-${currentStep}-${questionIndex}-${navInitialStage}`,
        step: currentStep,
        questionIndex,
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
        isNextDisabled,
        isPrevDisabled,
        navText: getNavText(),
        nextButtonRef,
        showNextNudge,
      }),
    ),
  );
};
