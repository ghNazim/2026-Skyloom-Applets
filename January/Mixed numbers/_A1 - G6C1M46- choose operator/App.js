const App = () => {
  const { useState, useCallback } = React;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentStep, setCurrentStep] = useState(0); // 0: start, 1: questions, 2: final
  const [selectedOperator, setSelectedOperator] = useState(null); // '>', '=', '<' or null
  const [isCorrectCurrent, setIsCorrectCurrent] = useState(false); // true when current question answered correctly

  const questions = APP_DATA.questions;
  const totalQuestions = questions.length;

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleOperatorSelect = useCallback((operator) => {
    if (isCorrectCurrent) return;
    setSelectedOperator(operator);
    const q = questions[currentQuestion];
    const correct = operator === q.operator;
    if (correct) {
      playSound("correct");
      // isCorrectCurrent will be set when MainCanvas calls onCorrectAnimationComplete
    } else {
      setIsCorrectCurrent(false);
      playSound("wrong");
    }
  }, [currentQuestion, isCorrectCurrent, questions]);

  const handleCorrectAnimationComplete = useCallback(() => {
    setIsCorrectCurrent(true);
  }, []);

  const handleNav = (direction) => {
    if (direction === "next") {
      playSound("click");
      if (currentStep === 1 && isCorrectCurrent) {
        if (currentQuestion < totalQuestions - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedOperator(null);
          setIsCorrectCurrent(false);
        } else {
          setCurrentStep(2);
        }
      }
    } else if (direction === "prev") {
      playSound("click");
      if (currentStep === 1 && currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1);
        setSelectedOperator(null);
        setIsCorrectCurrent(false);
      }
    }
  };

  const handleStartOver = () => {
    playSound("click");
    setCurrentStep(0);
    setCurrentQuestion(0);
    setSelectedOperator(null);
    setIsCorrectCurrent(false);
  };

  const handleStart = () => {
    playSound("click");
    setCurrentStep(1);
    setCurrentQuestion(0);
    setSelectedOperator(null);
    setIsCorrectCurrent(false);
  };

  function getNavText() {
    if (currentStep === 0 || currentStep === 2) return "";
    if (currentStep === 1) {
      if (isCorrectCurrent) return APP_DATA.step1.navTextNext;
      return APP_DATA.step1.navText;
    }
    return "";
  }

  function getQuestionText() {
    if (currentStep === 0 || currentStep === 2) return "";
    if (currentStep === 1) return APP_DATA.step1.question;
    return "";
  }

  function isNextDisabled() {
    if (currentStep === 0 || currentStep === 2) return true;
    if (currentStep === 1) return !isCorrectCurrent;
    return true;
  }

  function isPrevDisabled() {
    if (currentStep === 0 || currentStep === 2) return true;
    if (currentStep === 1) return currentQuestion === 0;
    return false;
  }

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

  if (currentStep === 2) {
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
          onButtonClick: handleStartOver,
        })
      )
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: getQuestionText(),
      step: currentStep,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        step: currentStep,
        question: getCurrentQuestion(),
        questionIndex: currentQuestion,
        totalQuestions: totalQuestions,
        selectedOperator: selectedOperator,
        isCorrectCurrent: isCorrectCurrent,
        onOperatorSelect: handleOperatorSelect,
        onCorrectAnimationComplete: handleCorrectAnimationComplete,
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: handleNav,
        isNextDisabled: isNextDisabled(),
        isPrevDisabled: isPrevDisabled(),
        navText: getNavText(),
        totalDots: totalQuestions,
        currentDot: currentQuestion + 1,
      })
    )
  );
};
