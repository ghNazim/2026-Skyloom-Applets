const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionComplete, setQuestionComplete] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [nudgePosition, setNudgePosition] = useState(null);
  const nudgeTargetRef = useRef(null);

  const totalQuestions = SVG_QUESTIONS.length;
  const isLastQuestion = questionIndex === totalQuestions - 1;

  const hideNudge = useCallback(() => {
    setShowNudge(false);
    setNudgePosition(null);
  }, []);

  const registerNudgeTarget = useCallback((rect) => {
    nudgeTargetRef.current = rect;
  }, []);

  const resetActivity = () => {
    setCurrentStep(0);
    setQuestionIndex(0);
    setQuestionComplete(false);
    setHasSelection(false);
    hideNudge();
  };

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    setCurrentStep(1);
    setQuestionIndex(0);
    setQuestionComplete(false);
    setHasSelection(false);
  };

  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    resetActivity();
  };

  const handleQuestionComplete = useCallback((complete) => {
    setQuestionComplete(complete);
  }, []);

  const handleSelectionChange = useCallback((hasAny) => {
    setHasSelection(hasAny);
  }, []);

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();

    if (!questionComplete) return;

    if (isLastQuestion) {
      setCurrentStep(2);
      return;
    }

    setQuestionIndex((prev) => prev + 1);
    setQuestionComplete(false);
    setHasSelection(false);
  };

  const getNavText = () => {
    if (currentStep !== 1) return "";
    if (questionComplete) {
      return isLastQuestion
        ? APP_DATA.steps[1].navTextConclude
        : APP_DATA.steps[1].navTextNext;
    }
    return APP_DATA.steps[1].navTextInitial;
  };

  const isNextDisabled = currentStep === 1 && !questionComplete;

  useEffect(() => {
    const updateNudge = () => {
      if (currentStep === 0) {
        const startBtn = document.getElementById("start-button");
        if (startBtn) {
          setNudgePosition(startBtn.getBoundingClientRect());
          setShowNudge(true);
        }
        return;
      }

      if (currentStep === 2) {
        const restartBtn = document.getElementById("start-over-button");
        if (restartBtn) {
          setNudgePosition(restartBtn.getBoundingClientRect());
          setShowNudge(true);
        }
        return;
      }

      if (currentStep === 1 && questionComplete) {
        const nextBtn = document.getElementById("next-button");
        if (nextBtn) {
          setNudgePosition(nextBtn.getBoundingClientRect());
          setShowNudge(true);
        }
        return;
      }

      if (currentStep === 1 && hasSelection && !questionComplete) {
        const rect = nudgeTargetRef.current;
        if (rect) {
          setNudgePosition(rect);
          setShowNudge(true);
        } else {
          hideNudge();
        }
        return;
      }

      hideNudge();
    };

    const tid = setTimeout(updateNudge, 150);
    window.addEventListener("resize", updateNudge);
    return () => {
      clearTimeout(tid);
      window.removeEventListener("resize", updateNudge);
    };
  }, [currentStep, questionComplete, hasSelection, questionIndex, hideNudge]);

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
          buttonId: "start-button",
        }),
      ),
      React.createElement(Nudge, { show: showNudge, position: nudgePosition }),
    );
  }

  if (currentStep === 2) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: null,
          text: APP_DATA.finish.text,
          buttonText: APP_DATA.finish.buttonText,
          onButtonClick: handleStartOver,
          buttonId: "start-over-button",
        }),
      ),
      React.createElement(Nudge, { show: showNudge, position: nudgePosition }),
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: APP_DATA.steps[1].questionText,
      step: 1,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        key: questionIndex,
        questionIndex: questionIndex,
        onQuestionComplete: handleQuestionComplete,
        onSelectionChange: handleSelectionChange,
        onRegisterNudgeTarget: registerNudgeTarget,
        onHideNudge: hideNudge,
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => (dir === "next" ? handleNext() : null),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: true,
        navText: getNavText(),
      }),
    ),
    React.createElement(Nudge, { show: showNudge, position: nudgePosition }),
  );
};
