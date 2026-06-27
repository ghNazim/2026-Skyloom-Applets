const App = () => {
  const { useState, useEffect, useMemo, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [step3Phase, setStep3Phase] = useState("hold");
  const [dndPlacements, setDndPlacements] = useState({ x: null, y: null });
  const [dndSourceItems, setDndSourceItems] = useState([]);
  const [dndWrongItemId, setDndWrongItemId] = useState(null);
  const [dndWrongZone, setDndWrongZone] = useState(null);
  const [showDndFeedback, setShowDndFeedback] = useState(false);
  const [simplifyPhase, setSimplifyPhase] = useState("s1");
  const [simplifyComplete, setSimplifyComplete] = useState(false);
  const [nudgePositions, setNudgePositions] = useState([]);
  const hasAnimatedQuestionRef = useRef(false);

  const totalQuestions = APP_DATA.questions.length;
  const currentQuestion = APP_DATA.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const showStartOver =
    isLastQuestion && currentStep === 4 && simplifyComplete;

  const getDndSourceIds = useCallback((question) => {
    return question.mathDnd.options.map((o) => o.id);
  }, []);

  const resetDndState = useCallback((question) => {
    const q = question || currentQuestion;
    setDndPlacements({ x: null, y: null });
    setDndSourceItems(getDndSourceIds(q));
    setDndWrongItemId(null);
    setDndWrongZone(null);
    setShowDndFeedback(false);
  }, [currentQuestion, getDndSourceIds]);

  const resetSimplifyState = useCallback((question) => {
    const q = question || currentQuestion;
    setSimplifyPhase(q.simplify.initialPhase);
    setSimplifyComplete(false);
  }, [currentQuestion]);

  const resetEverything = useCallback(() => {
    setCurrentStep(0);
    setCurrentQuestionIndex(0);
    setStep3Phase("hold");
    const q0 = APP_DATA.questions[0];
    resetDndState(q0);
    resetSimplifyState(q0);
    hasAnimatedQuestionRef.current = false;
  }, [resetDndState, resetSimplifyState]);

  const loadQuestion = useCallback(
    (questionIndex) => {
      const q = APP_DATA.questions[questionIndex];
      setCurrentQuestionIndex(questionIndex);
      resetDndState(q);
      resetSimplifyState(q);
      setStep3Phase("hold");
      hasAnimatedQuestionRef.current = false;
    },
    [resetDndState, resetSimplifyState],
  );

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    loadQuestion(0);
    setCurrentStep(1);
  };

  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    resetEverything();
  };

  useEffect(() => {
    if (currentStep !== 3 || step3Phase !== "hold") return undefined;
    const timer = setTimeout(() => setStep3Phase("dnd"), 2000);
    return () => clearTimeout(timer);
  }, [currentStep, step3Phase, currentQuestionIndex]);

  const handleDndDragStart = useCallback(() => {
    setShowDndFeedback(false);
  }, []);

  const handleDndDrop = useCallback(
    (itemId, zoneId) => {
      if (dndWrongItemId) return;
      if (!dndSourceItems.includes(itemId)) return;
      if (dndPlacements[zoneId]) return;

      const correctMap = currentQuestion.mathDnd.correct;
      const isCorrect = correctMap[zoneId] === itemId;

      if (!isCorrect) {
        if (typeof playSound === "function") playSound("wrong");
        setDndWrongItemId(itemId);
        setDndWrongZone(zoneId);
        setShowDndFeedback(true);
        setTimeout(() => {
          setDndWrongItemId(null);
          setDndWrongZone(null);
        }, 550);
        return;
      }

      if (typeof playSound === "function") playSound("correct");
      const newPlacements = { ...dndPlacements, [zoneId]: itemId };
      setDndPlacements(newPlacements);
      setDndSourceItems((prev) => prev.filter((id) => id !== itemId));
      if (newPlacements.x && newPlacements.y) {
        setStep3Phase("done");
      }
    },
    [dndWrongItemId, dndSourceItems, dndPlacements, currentQuestion],
  );

  const handleSimplifyPhaseChange = useCallback((nextPhase) => {
    setSimplifyPhase(nextPhase);
  }, []);

  const handleSimplifyComplete = useCallback(() => {
    setSimplifyComplete(true);
  }, []);

  const questionText = useMemo(() => {
    if (currentStep === 2) return currentQuestion.questionText;
    if (currentStep === 3) {
      return step3Phase === "hold"
        ? currentQuestion.questionTextPhase1
        : currentQuestion.questionTextPhase2;
    }
    if (currentStep === 4) return currentQuestion.questionText;
    return "";
  }, [currentStep, step3Phase, currentQuestion]);

  const navText = useMemo(() => {
    if (currentStep === 1) return APP_DATA.steps[1].navText;
    if (currentStep === 2) return APP_DATA.steps[2].navText;
    if (currentStep === 3) {
      if (step3Phase === "hold") return "";
      return step3Phase === "done"
        ? APP_DATA.steps[3].navTextDone
        : APP_DATA.steps[3].navText;
    }
    if (currentStep === 4) {
      if (showStartOver) return "";
      return simplifyComplete
        ? APP_DATA.steps[4].navTextDone
        : APP_DATA.steps[4].navText;
    }
    return "";
  }, [currentStep, step3Phase, simplifyComplete, showStartOver]);

  const navTextHidden = currentStep === 3 && step3Phase === "hold";

  const isNextDisabled =
    (currentStep === 3 && step3Phase !== "done") ||
    (currentStep === 4 && !simplifyComplete);

  const isPrevDisabled = currentStep <= 1;

  const shouldAnimateQuestion =
    currentStep === 2 && !hasAnimatedQuestionRef.current;

  useEffect(() => {
    if (currentStep === 2 && !hasAnimatedQuestionRef.current) {
      hasAnimatedQuestionRef.current = true;
    }
  }, [currentStep]);

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    setNudgePositions([]);
    if (isNextDisabled) return;
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
      setStep3Phase("hold");
      resetDndState(currentQuestion);
    } else if (currentStep === 3) {
      setCurrentStep(4);
      resetSimplifyState(currentQuestion);
    } else if (currentStep === 4 && !isLastQuestion) {
      loadQuestion(currentQuestionIndex + 1);
      setCurrentStep(2);
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 4) {
      setCurrentStep(3);
      setStep3Phase("done");
      const correct = currentQuestion.mathDnd.correct;
      setDndPlacements({ x: correct.x, y: correct.y });
      setDndSourceItems(
        getDndSourceIds(currentQuestion).filter(
          (id) => id !== correct.x && id !== correct.y,
        ),
      );
      resetSimplifyState(currentQuestion);
      return;
    }
    if (currentStep === 3) {
      setCurrentStep(2);
      resetDndState(currentQuestion);
      return;
    }
    if (currentStep === 2) {
      if (currentQuestionIndex > 0) {
        loadQuestion(currentQuestionIndex - 1);
      }
      setCurrentStep(1);
      return;
    }
    if (currentStep === 1) {
      resetEverything();
    }
  };

  useEffect(() => {
    const updateNudges = () => {
      const positions = [];
      const addNudgeFor = (id) => {
        const el = document.getElementById(id);
        if (el && !el.disabled) {
          positions.push(el.getBoundingClientRect());
        }
      };
      if (currentStep === 0) {
        addNudgeFor("start-button");
      } else if (showStartOver) {
        addNudgeFor("start-over-button");
      } else if (!isNextDisabled) {
        addNudgeFor("next-button");
      }
      setNudgePositions(positions);
    };
    const timeoutId = setTimeout(updateNudges, 0);
    window.addEventListener("resize", updateNudges);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateNudges);
    };
  }, [currentStep, isNextDisabled, step3Phase, simplifyComplete, showStartOver]);

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
        { className: "app-main-content", style: { position: "relative" } },
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

  if (currentStep === 1) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(TextSplash, {
          heading: APP_DATA.textSplash.heading,
          content: APP_DATA.textSplash.content,
        }),
      ),
      React.createElement(
        "div",
        { className: "lower-panel" },
        React.createElement(Navigation, {
          onNav: (dir) =>
            dir === "next" ? handleNext() : dir === "prev" ? handlePrev() : null,
          isNextDisabled: false,
          isPrevDisabled: isPrevDisabled,
          navText: navText,
        }),
      ),
      renderNudges(),
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      key: "q-" + currentQuestionIndex + "-" + currentStep,
      html: questionText,
      animateIn: shouldAnimateQuestion,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      currentStep >= 2
        ? React.createElement(MainCanvas, {
            step: currentStep,
            step3Phase: step3Phase,
            question: currentQuestion,
            questionIndex: currentQuestionIndex,
            dndPlacements: dndPlacements,
            dndSourceItems: dndSourceItems,
            dndWrongItemId: dndWrongItemId,
            dndWrongZone: dndWrongZone,
            onDndDrop: handleDndDrop,
            onDndDragStart: handleDndDragStart,
            showDndFeedback: showDndFeedback,
            simplifyPhase: simplifyPhase,
            onSimplifyPhaseChange: handleSimplifyPhaseChange,
            onSimplifyComplete: handleSimplifyComplete,
          })
        : null,
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) =>
          dir === "next" ? handleNext() : dir === "prev" ? handlePrev() : null,
        isNextDisabled: isNextDisabled,
        isPrevDisabled: isPrevDisabled,
        navText: navText,
        navTextHidden: navTextHidden,
        showStartOver: showStartOver,
        startOverText: APP_DATA.startOver.buttonText,
        onStartOver: handleStartOver,
      }),
    ),
    renderNudges(),
  );
};
