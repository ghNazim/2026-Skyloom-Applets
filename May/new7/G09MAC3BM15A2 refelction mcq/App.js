const App = () => {
  const { useState, useMemo, useEffect, useRef, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [ruleStatus, setRuleStatus] = useState("pending");
  const [ruleSelected, setRuleSelected] = useState(null);
  const [coordinateStatus, setCoordinateStatus] = useState("pending");
  const [coordinateSelected, setCoordinateSelected] = useState(null);
  const [showCoordinateFeedback, setShowCoordinateFeedback] = useState(false);
  const [nudgePositions, setNudgePositions] = useState([]);
  const [farthestCompletedIndex, setFarthestCompletedIndex] = useState(-1);
  const ruleHoldTimerRef = useRef(null);

  const activeQuestion = APP_DATA.questions[questionIndex];
  const isLastQuestion = questionIndex === APP_DATA.questions.length - 1;

  const clearRuleHoldTimer = useCallback(() => {
    if (ruleHoldTimerRef.current) {
      clearTimeout(ruleHoldTimerRef.current);
      ruleHoldTimerRef.current = null;
    }
  }, []);

  const resetPractice = useCallback(() => {
    clearRuleHoldTimer();
    setRuleStatus("pending");
    setRuleSelected(null);
    setCoordinateStatus("pending");
    setCoordinateSelected(null);
    setShowCoordinateFeedback(false);
  }, [clearRuleHoldTimer]);

  useEffect(() => {
    return () => clearRuleHoldTimer();
  }, [clearRuleHoldTimer]);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setQuestionIndex(0);
    setFarthestCompletedIndex(-1);
    resetPractice();
    setCurrentStep(1);
  };

  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    setQuestionIndex(0);
    setFarthestCompletedIndex(-1);
    resetPractice();
    setCurrentStep(0);
  };

  const showSolvedQuestion = useCallback((index) => {
    clearRuleHoldTimer();
    const question = APP_DATA.questions[index];
    setQuestionIndex(index);
    setRuleStatus("correct");
    setRuleSelected(question.ruleCorrectIndex);
    setCoordinateStatus("correct");
    setCoordinateSelected(question.coordinateCorrectIndex);
    setShowCoordinateFeedback(false);
    setCurrentStep(1);
  }, [clearRuleHoldTimer]);

  const handleRuleSelect = useCallback((index) => {
    if (ruleStatus === "correct" || ruleStatus === "hold" || ruleStatus === "animating") return;

    const isCorrect = index === activeQuestion.ruleCorrectIndex;
    setRuleSelected(index);

    if (typeof playSound === "function") {
      playSound(isCorrect ? "correct" : "wrong");
    }

    if (isCorrect) {
      setRuleStatus("animating");
    } else {
      setRuleStatus("wrong");
      setTimeout(() => {
        setRuleSelected(null);
        setRuleStatus("pending");
      }, 650);
    }
  }, [activeQuestion, ruleStatus]);

  const handleRuleAnimationDone = useCallback(() => {
    setRuleStatus("hold");
    clearRuleHoldTimer();
    ruleHoldTimerRef.current = setTimeout(() => {
      setRuleStatus("correct");
      ruleHoldTimerRef.current = null;
    }, 1000);
  }, [clearRuleHoldTimer]);

  const handleCoordinateSelect = useCallback((index) => {
    if (ruleStatus !== "correct") return;
    if (coordinateStatus === "correct" || coordinateStatus === "animating") return;

    const isCorrect = index === activeQuestion.coordinateCorrectIndex;
    setCoordinateSelected(index);
    setShowCoordinateFeedback(false);

    if (typeof playSound === "function") {
      playSound(isCorrect ? "correct" : "wrong");
    }

    if (isCorrect) {
      setCoordinateStatus("animating");
    } else {
      setCoordinateStatus("wrong");
      setShowCoordinateFeedback(true);
    }
  }, [activeQuestion, coordinateStatus, ruleStatus]);

  const handleCoordinateAnimationDone = useCallback(() => {
    setCoordinateStatus("correct");
    setShowCoordinateFeedback(false);
    setFarthestCompletedIndex((index) => Math.max(index, questionIndex));
  }, [questionIndex]);

  const handleNext = () => {
    if (coordinateStatus !== "correct") return;
    if (typeof playSound === "function") playSound("click");

    if (isLastQuestion) {
      setCurrentStep(2);
      return;
    }

    const nextIndex = questionIndex + 1;
    if (nextIndex <= farthestCompletedIndex) {
      showSolvedQuestion(nextIndex);
      return;
    }

    resetPractice();
    setQuestionIndex(nextIndex);
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep !== 1) return;

    if (questionIndex === 0) {
      resetPractice();
      setCurrentStep(0);
      return;
    }

    showSolvedQuestion(questionIndex - 1);
  };

  const navText = useMemo(() => {
    if (coordinateStatus === "correct") {
      return isLastQuestion
        ? APP_DATA.steps.navTextConclude
        : APP_DATA.steps.navTextDone;
    }
    return APP_DATA.steps.navText;
  }, [coordinateStatus, isLastQuestion]);

  useEffect(() => {
    const updateNudges = () => {
      const nextPositions = [];
      const targetId =
        currentStep === 0 || currentStep === 2
          ? "start-button"
          : coordinateStatus === "correct"
            ? "next-button"
            : null;

      if (targetId) {
        const el = document.getElementById(targetId);
        if (el && !el.disabled) {
          nextPositions.push(el.getBoundingClientRect());
        }
      }

      setNudgePositions(nextPositions);
    };

    const timeoutId = setTimeout(updateNudges, 0);
    window.addEventListener("resize", updateNudges);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateNudges);
    };
  }, [currentStep, coordinateStatus, questionIndex]);

  const renderNudges = () =>
    nudgePositions.map((position, index) =>
      React.createElement(Nudge, {
        key: index,
        show: true,
        position: position,
      }),
    );

  if (currentStep === 0) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content app-main-content-splash" },
        React.createElement(Fullscreen, {
          heading: APP_DATA.start.heading,
          text: APP_DATA.start.text,
          buttonText: APP_DATA.start.buttonText,
          onButtonClick: handleStart,
          buttonId: "start-button",
        }),
      ),
      renderNudges(),
    );
  }

  if (currentStep === 2) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content app-main-content-splash" },
        React.createElement(Fullscreen, {
          heading: APP_DATA.final.heading,
          text: APP_DATA.final.text,
          buttonText: APP_DATA.final.buttonText,
          onButtonClick: handleStartOver,
          buttonId: "start-button",
        }),
      ),
      renderNudges(),
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      html: activeQuestion.question,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        key: activeQuestion.id,
        question: activeQuestion,
        ruleStatus: ruleStatus,
        ruleSelected: ruleSelected,
        coordinateStatus: coordinateStatus,
        coordinateSelected: coordinateSelected,
        showCoordinateFeedback: showCoordinateFeedback,
        onRuleSelect: handleRuleSelect,
        onRuleAnimationDone: handleRuleAnimationDone,
        onCoordinateSelect: handleCoordinateSelect,
        onCoordinateAnimationDone: handleCoordinateAnimationDone,
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) =>
          dir === "next" ? handleNext() : dir === "prev" ? handlePrev() : null,
        isNextDisabled: coordinateStatus !== "correct",
        isPrevDisabled: false,
        navText: navText,
      }),
    ),
    renderNudges(),
  );
};
