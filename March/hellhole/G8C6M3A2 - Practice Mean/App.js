const App = () => {
  const { useState, useCallback, useRef, useEffect } = React;

  const questionCount = APP_DATA.questions.length;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [showStartNudge, setShowStartNudge] = useState(true);
  const [showNextNudge, setShowNextNudge] = useState(false);
  const [showRestartNudge, setShowRestartNudge] = useState(false);
  const [displayMode, setDisplayMode] = useState("natural");
  const [completedSteps, setCompletedSteps] = useState({});

  const startButtonRef = useRef(null);
  const restartButtonRef = useRef(null);
  const nextButtonRef = useRef(null);

  const isFullscreenStep = currentStep === 0 || currentStep === 4;

  const stepsForQuestion = (qi) =>
    APP_DATA.questions[qi] && APP_DATA.questions[qi].steps
      ? APP_DATA.questions[qi].steps
      : {};

  const stepKey = (qi, step) => qi + "-" + step;

  const linearStepPosition = (qi, step) => qi * 3 + step;

  const furthestRef = useRef({ questionIndex: 0, step: 1 });
  const [furthestReached, setFurthestReached] = useState({
    questionIndex: 0,
    step: 1,
  });

  const advanceFurthest = (qi, step) => {
    const pos = linearStepPosition(qi, step);
    const cur = furthestRef.current;
    const curPos = linearStepPosition(cur.questionIndex, cur.step);
    if (pos > curPos) {
      furthestRef.current = { questionIndex: qi, step: step };
      setFurthestReached({ questionIndex: qi, step: step });
    }
  };

  const syncFurthestTo = (qi, step) => {
    furthestRef.current = { questionIndex: qi, step: step };
    setFurthestReached({ questionIndex: qi, step: step });
  };

  const isAtFrontier =
    currentQuestionIndex === furthestReached.questionIndex &&
    currentStep === furthestReached.step;

  const positionRef = useRef({
    questionIndex: currentQuestionIndex,
    step: currentStep,
  });
  positionRef.current = {
    questionIndex: currentQuestionIndex,
    step: currentStep,
  };

  const isStepCompleted = useCallback(
    (qi, step) => !!completedSteps[stepKey(qi, step)],
    [completedSteps],
  );

  const markStepCompleted = useCallback((qi, step) => {
    const key = stepKey(qi, step);
    advanceFurthest(qi, step);
    setCompletedSteps((prev) => {
      if (prev[key]) return prev;
      return { ...prev, [key]: true };
    });
  }, []);

  const getPrevPosition = (qi, step) => {
    if (step === 4) {
      return { questionIndex: questionCount - 1, step: 3 };
    }
    if (step === 1 && qi === 0) {
      return { questionIndex: 0, step: 0, isStart: true };
    }
    if (step === 1) {
      return { questionIndex: qi - 1, step: 3 };
    }
    return { questionIndex: qi, step: step - 1 };
  };

  const getNextPosition = (qi, step) => {
    if (step === 0) {
      return { questionIndex: 0, step: 1 };
    }
    if (step < 3) {
      return { questionIndex: qi, step: step + 1 };
    }
    if (qi < questionCount - 1) {
      return { questionIndex: qi + 1, step: 1 };
    }
    return { questionIndex: qi, step: 4, isEnd: true };
  };

  const navigateTo = (qi, step, mode) => {
    setShowNextNudge(false);
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setDisplayMode(mode);
    advanceFurthest(qi, step);
    setCurrentQuestionIndex(qi);
    setCurrentStep(step);
    if (mode === "final") {
      setIsNextDisabled(false);
    } else if (step === 1) {
      setIsNextDisabled(false);
      setShowNextNudge(true);
    } else {
      setIsNextDisabled(true);
    }
    setResetKey((k) => k + 1);
  };

  const handleStart = () => {
    setShowStartNudge(false);
    if (typeof playSound === "function") playSound("click");
    setDisplayMode("natural");
    syncFurthestTo(0, 1);
    setCurrentQuestionIndex(0);
    setCurrentStep(1);
    setIsNextDisabled(false);
    setShowNextNudge(true);
    markStepCompleted(0, 1);
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    setShowRestartNudge(false);
    setCurrentQuestionIndex(0);
    setCurrentStep(0);
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setIsNextDisabled(true);
    setShowStartNudge(true);
    setShowNextNudge(false);
    setShowRestartNudge(false);
    setDisplayMode("natural");
    setCompletedSteps({});
    syncFurthestTo(0, 1);
    setResetKey((prev) => prev + 1);
  };

  const handleNext = () => {
    if (isNextDisabled) return;
    setShowNextNudge(false);
    if (typeof playSound === "function") playSound("click");

    const next = getNextPosition(currentQuestionIndex, currentStep);
    if (next.isEnd) {
      setShowRestartNudge(true);
      setCurrentStep(4);
      return;
    }

    const mode = isStepCompleted(next.questionIndex, next.step)
      ? "final"
      : "natural";
    navigateTo(next.questionIndex, next.step, mode);
  };

  const handlePrev = () => {
    if (isNextDisabled) return;
    if (typeof playSound === "function") playSound("click");

    const prev = getPrevPosition(currentQuestionIndex, currentStep);
    if (prev.isStart) {
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setDisplayMode("natural");
      setCurrentStep(0);
      setCurrentQuestionIndex(0);
      return;
    }

    navigateTo(prev.questionIndex, prev.step, "final");
  };

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled((prevDisabled) => {
      if (enabled && prevDisabled) {
        const f = furthestRef.current;
        const pos = positionRef.current;
        if (
          pos.questionIndex === f.questionIndex &&
          pos.step === f.step
        ) {
          setShowNextNudge(true);
        }
      }
      return !enabled;
    });
  }, []);

  useEffect(() => {
    if (!isAtFrontier) {
      setShowNextNudge(false);
    }
  }, [isAtFrontier]);

  const updateNavText = useCallback((nav) => {
    setDynamicNavText(nav);
  }, []);
  const updateQuestionText = useCallback((text) => {
    setDynamicQuestionText(text);
  }, []);

  const getQuestionText = () => {
    if (dynamicQuestionText !== null && dynamicQuestionText !== undefined) {
      return dynamicQuestionText;
    }
    const stepData = stepsForQuestion(currentQuestionIndex)[currentStep];
    return stepData ? stepData.questionText : "";
  };

  const getNavText = () => {
    if (dynamicNavText !== null && dynamicNavText !== undefined) {
      return dynamicNavText;
    }
    const stepData = stepsForQuestion(currentQuestionIndex)[currentStep];
    return stepData ? stepData.navText : "";
  };

  if (currentStep === 0) {
    const formulaHtml =
      typeof buildStartFormulaHtml === "function"
        ? buildStartFormulaHtml(APP_DATA.start)
        : "";

    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.start.heading,
          topText: APP_DATA.start.textTop,
          formulaPrefix: "",
          formulaHtml: formulaHtml,
          bottomText: APP_DATA.start.textBottom,
          buttonText: APP_DATA.start.buttonText,
          onButtonClick: handleStart,
          buttonRef: startButtonRef,
        }),
        React.createElement(Nudge, {
          targetRef: startButtonRef,
          visible: showStartNudge,
          size: "6vw",
          anchorX: 0.85,
          anchorY: 1,
        }),
      ),
    );
  }

  if (currentStep === 4) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.end.heading,
          topText: APP_DATA.end.textTop,
          bottomText: APP_DATA.end.textBottom,
          buttonText: APP_DATA.end.buttonText,
          onButtonClick: handleRestart,
          buttonRef: restartButtonRef,
        }),
        React.createElement(Nudge, {
          targetRef: restartButtonRef,
          visible: showRestartNudge,
          size: "6vw",
          anchorX: 0.85,
          anchorY: 1,
        }),
      ),
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    !isFullscreenStep &&
      React.createElement(QuestionPanel, {
        text: getQuestionText(),
      }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        key: resetKey + "-" + currentQuestionIndex + "-" + displayMode,
        step: currentStep,
        questionIndex: currentQuestionIndex,
        questionCount: questionCount,
        displayMode: displayMode,
        isAtFrontier: isAtFrontier,
        onSetNextEnabled: setNextEnabled,
        onUpdateNavText: updateNavText,
        onUpdateQuestionText: updateQuestionText,
        onStepCompleted: markStepCompleted,
      }),
    ),
    !isFullscreenStep &&
      React.createElement(
        "div",
        { className: "lower-panel" },
        React.createElement(Navigation, {
          onNav: (dir) =>
            dir === "next"
              ? handleNext()
              : dir === "prev"
                ? handlePrev()
                : null,
          isNextDisabled: isNextDisabled,
          isPrevDisabled: isNextDisabled || (currentStep === 1 && currentQuestionIndex === 0),
          navText: getNavText(),
          nextButtonRef: nextButtonRef,
        }),
        React.createElement(Nudge, {
          targetRef: nextButtonRef,
          visible: showNextNudge && !isNextDisabled && isAtFrontier,
          size: "5.5vw",
          anchorX: 0.85,
          anchorY: 0.75,
        }),
      ),
  );
};
