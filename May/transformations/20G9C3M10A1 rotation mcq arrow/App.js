const App = () => {
  const { useState, useEffect, useCallback, useRef, useMemo } = React;

  const initialState = getInitialAppState();

  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [mcqSelectedIndex, setMcqSelectedIndex] = useState(
    initialState.mcqSelectedIndex,
  );
  const [mcqSelectedIndices, setMcqSelectedIndices] = useState(
    initialState.mcqSelectedIndices,
  );
  const [mcqResultState, setMcqResultState] = useState(
    initialState.mcqResultState,
  );
  const [mcqShowFeedback, setMcqShowFeedback] = useState(
    initialState.mcqShowFeedback,
  );
  const [mcqFeedbackText, setMcqFeedbackText] = useState(
    initialState.mcqFeedbackText,
  );
  const [mcqFeedbackType, setMcqFeedbackType] = useState(
    initialState.mcqFeedbackType,
  );
  const [mcqAnsweredCorrectly, setMcqAnsweredCorrectly] = useState(
    initialState.mcqAnsweredCorrectly,
  );

  const [nudgePositions, setNudgePositions] = useState([]);
  const mcqTimeoutRef = useRef(null);

  const questionCount = getQuestionCount();
  const currentQuestion = getQuestion(currentQuestionIndex);
  const isLastQuestion = currentQuestionIndex === questionCount - 1;
  const isMultiAnswer = currentQuestion
    ? isMultiAnswerQuestion(currentQuestion)
    : false;

  const resetMcqState = useCallback(() => {
    if (mcqTimeoutRef.current) {
      clearTimeout(mcqTimeoutRef.current);
      mcqTimeoutRef.current = null;
    }
    setMcqSelectedIndex(null);
    setMcqSelectedIndices([]);
    setMcqResultState(null);
    setMcqShowFeedback(false);
    setMcqFeedbackText("");
    setMcqFeedbackType(null);
    setMcqAnsweredCorrectly(false);
  }, []);

  const resetEverything = useCallback(() => {
    resetMcqState();
    setCurrentStep(0);
    setCurrentQuestionIndex(0);
  }, [resetMcqState]);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    resetMcqState();
    setCurrentQuestionIndex(0);
    setCurrentStep(1);
  };

  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    resetEverything();
  };

  const showMcqFeedback = useCallback((text, type, onDone) => {
    mcqTimeoutRef.current = setTimeout(() => {
      setMcqShowFeedback(true);
      setMcqFeedbackText(text);
      setMcqFeedbackType(type);
      if (typeof onDone === "function") onDone();
      mcqTimeoutRef.current = null;
    }, MCQ_RESULT_DELAY);
  }, []);

  const handleMcqSelectSingle = useCallback(
    (index, question) => {
      const correctIndex = question.correct[0];
      const isCorrect = index === correctIndex;

      setMcqSelectedIndex(index);
      setMcqResultState(isCorrect ? "correct" : "wrong");

      if (isCorrect) {
        if (typeof playSound === "function") playSound("correct");
        setMcqAnsweredCorrectly(true);
        showMcqFeedback(question.feedback, "correct");
      } else {
        if (typeof playSound === "function") playSound("wrong");
        showMcqFeedback(question.feedbackWrong || question.feedback, "wrong");
      }
    },
    [showMcqFeedback],
  );

  const handleMcqSelectMulti = useCallback(
    (index, question) => {
      if (mcqAnsweredCorrectly) return;
      if (mcqSelectedIndices.includes(index)) return;

      const correctSet = new Set(question.correct);
      const isCorrectChoice = correctSet.has(index);

      if (!isCorrectChoice) {
        if (typeof playSound === "function") playSound("wrong");
        setMcqSelectedIndex(index);
        setMcqResultState("wrong");
        showMcqFeedback(question.feedbackWrong, "wrong", null);
        return;
      }

      setMcqSelectedIndex(null);
      setMcqResultState("partial");

      if (typeof playSound === "function") playSound("correct");
      const nextSelected = [...mcqSelectedIndices, index];
      setMcqSelectedIndices(nextSelected);

      if (nextSelected.length === question.correct.length) {
        if (mcqTimeoutRef.current) {
          clearTimeout(mcqTimeoutRef.current);
          mcqTimeoutRef.current = null;
        }
        setMcqShowFeedback(false);
        setMcqFeedbackText("");
        setMcqFeedbackType(null);
        setMcqResultState("complete");
        setMcqAnsweredCorrectly(true);
        return;
      }

      showMcqFeedback(question.feedbackMiddle, "middle");
    },
    [mcqResultState, mcqAnsweredCorrectly, mcqSelectedIndices, showMcqFeedback],
  );

  const handleMcqSelect = useCallback(
    (index) => {
      if (!currentQuestion || mcqAnsweredCorrectly) return;

      if (isMultiAnswer) {
        handleMcqSelectMulti(index, currentQuestion);
      } else {
        handleMcqSelectSingle(index, currentQuestion);
      }
    },
    [
      currentQuestion,
      mcqAnsweredCorrectly,
      isMultiAnswer,
      handleMcqSelectMulti,
      handleMcqSelectSingle,
    ],
  );

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep !== 1 || !mcqAnsweredCorrectly) return;

    if (isLastQuestion) {
      resetMcqState();
      setCurrentStep(2);
      return;
    }

    resetMcqState();
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep !== 1 || currentQuestionIndex === 0) return;
    resetMcqState();
    setCurrentQuestionIndex((prev) => prev - 1);
  };

  const navText = useMemo(() => {
    if (currentStep !== 1) return "";

    if (mcqAnsweredCorrectly) {
      if (isLastQuestion) {
        return handleComma(APP_DATA.navLast);
      }
      return handleComma(APP_DATA.navCorrect);
    }
    return handleComma(APP_DATA.navText);
  }, [currentStep, mcqAnsweredCorrectly, isLastQuestion]);

  const isNextDisabled = currentStep !== 1 || !mcqAnsweredCorrectly;

  const isPrevDisabled = currentStep !== 1 || currentQuestionIndex === 0;

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
      } else if (currentStep === 2) {
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
  }, [currentStep, isNextDisabled]);

  useEffect(
    () => () => {
      if (mcqTimeoutRef.current) clearTimeout(mcqTimeoutRef.current);
    },
    [],
  );

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

  if (currentStep === 2) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.end.heading,
          text: APP_DATA.end.text,
          buttonText: APP_DATA.end.buttonText,
          onButtonClick: handleStartOver,
          buttonId: "start-over-button",
        }),
      ),
      renderNudges(),
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        question: currentQuestion,
        mcqOptions: currentQuestion ? currentQuestion.options : [],
        mcqSelectedIndex: mcqSelectedIndex,
        mcqSelectedIndices: mcqSelectedIndices,
        mcqResultState: mcqResultState,
        mcqShowFeedback: mcqShowFeedback,
        mcqFeedbackText: mcqFeedbackText,
        mcqFeedbackType: mcqFeedbackType,
        mcqDisabled: mcqAnsweredCorrectly,
        mcqMultiAnswer: isMultiAnswer,
        onMcqSelect: handleMcqSelect,
      }),
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
      }),
    ),
    renderNudges(),
  );
};
