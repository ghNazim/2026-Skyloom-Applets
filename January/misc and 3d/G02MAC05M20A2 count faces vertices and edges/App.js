const App = () => {
  const { useState, useRef, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [navText, setNavText] = useState("");

  const autoAdvanceRef = useRef(null);
  const questionIndexRef = useRef(questionIndex);
  questionIndexRef.current = questionIndex;

  const totalQuestions = APP_DATA.questions.length;
  const currentQuestion = APP_DATA.questions[questionIndex];
  const isLastQuestion = questionIndex === totalQuestions - 1;

  const clearAutoAdvance = () => {
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }
  };

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setQuestionIndex(0);
    setCurrentStep(1);
    setNavText(APP_DATA.step1NavText);
    setIsNextDisabled(true);
  };

  const handleStep1Correct = useCallback(() => {
    autoAdvanceRef.current = setTimeout(() => {
      autoAdvanceRef.current = null;
      const qi = questionIndexRef.current;
      const question = APP_DATA.questions[qi];
      setCurrentStep(2);
      setNavText(question.navText);
      setIsNextDisabled(true);
    }, 1000);
  }, []);

  const handleStep2Correct = useCallback(() => {
    setIsNextDisabled(false);
    const qi = questionIndexRef.current;
    const isLast = qi === totalQuestions - 1;
    if (isLast) {
      setNavText(APP_DATA.navStartOver);
    } else {
      setNavText(APP_DATA.questions[qi].navCorrect);
    }
  }, [totalQuestions]);

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    clearAutoAdvance();

    if (currentStep === 2) {
      if (isLastQuestion) {
        setQuestionIndex(0);
        setCurrentStep(0);
        setIsNextDisabled(true);
        setNavText("");
      } else {
        setQuestionIndex((prev) => prev + 1);
        setCurrentStep(1);
        setNavText(APP_DATA.step1NavText);
        setIsNextDisabled(true);
      }
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    clearAutoAdvance();

    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
      setCurrentStep(1);
      setNavText(APP_DATA.step1NavText);
      setIsNextDisabled(true);
    }
  };

  const getQuestionText = () => {
    if (currentStep === 1) return APP_DATA.step1Question;
    if (currentStep === 2) return currentQuestion.questionText;
    return "";
  };

  const getNextButtonText = () => {
    if (currentStep === 2 && isLastQuestion && !isNextDisabled) {
      return APP_DATA.startOver;
    }
    return "»";
  };

  const isPrevDisabled = questionIndex === 0;

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
        })
      )
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
        key: questionIndex,
        step: currentStep,
        currentQuestion: currentQuestion,
        questionIndex: questionIndex,
        onStep1Correct: handleStep1Correct,
        onStep2Correct: handleStep2Correct,
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => (dir === "next" ? handleNext() : handlePrev()),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: isPrevDisabled,
        navText: navText,
        nextSymbol: getNextButtonText(),
      })
    )
  );
};
