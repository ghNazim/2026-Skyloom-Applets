const App = () => {
  const { useState } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [navText, setNavText] = useState(APP_DATA.steps[1].navText);
  const [sessionKey, setSessionKey] = useState(0);
  const [answeredMap, setAnsweredMap] = useState({});

  const questions = APP_DATA.questions;
  const isLastQuestion = questionIndex >= questions.length - 1;

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
    setQuestionIndex(0);
    setIsNextDisabled(true);
    setNavText(APP_DATA.steps[1].navText);
    setAnsweredMap({});
    setSessionKey((k) => k + 1);
  };

  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setQuestionIndex(0);
    setIsNextDisabled(true);
    setNavText(APP_DATA.steps[1].navText);
    setAnsweredMap({});
    setSessionKey((k) => k + 1);
  };

  const handleAnswerState = ({ status }) => {
    if (status === "wrong") {
      setIsNextDisabled(true);
      setNavText(APP_DATA.steps[1].navWrong);
      return;
    }

    if (status === "reset") {
      setIsNextDisabled(true);
      setNavText(APP_DATA.steps[1].navText);
      return;
    }

    if (status === "correct") {
      setAnsweredMap((prev) => ({ ...prev, [questionIndex]: true }));
      setIsNextDisabled(false);
      setNavText(isLastQuestion ? APP_DATA.steps[1].navFinal : APP_DATA.steps[1].navCorrect);
    }
  };

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep !== 1 || isNextDisabled) return;

    if (isLastQuestion) {
      setCurrentStep(2);
      return;
    }

    setQuestionIndex((i) => i + 1);
    const nextIndex = questionIndex + 1;
    const alreadyAnswered = !!answeredMap[nextIndex];
    setIsNextDisabled(!alreadyAnswered);
    if (alreadyAnswered) {
      const willBeLast = nextIndex >= questions.length - 1;
      setNavText(willBeLast ? APP_DATA.steps[1].navFinal : APP_DATA.steps[1].navCorrect);
    } else {
      setNavText(APP_DATA.steps[1].navText);
    }
  };

  const handlePrevious = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep !== 1) return;

    if (questionIndex === 0) {
      setCurrentStep(0);
      return;
    }

    const prevIndex = questionIndex - 1;
    setQuestionIndex(prevIndex);
    const alreadyAnswered = !!answeredMap[prevIndex];
    setIsNextDisabled(!alreadyAnswered);
    if (alreadyAnswered) {
      const willBeLast = prevIndex >= questions.length - 1;
      setNavText(willBeLast ? APP_DATA.steps[1].navFinal : APP_DATA.steps[1].navCorrect);
    } else {
      setNavText(APP_DATA.steps[1].navText);
    }
  };

  const getQuestionText = () => {
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.questionText : "";
  };

  if (currentStep === 0) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content step-zero-fullscreen" },
        React.createElement(MainCanvas, {
          key: sessionKey,
          step: currentStep,
          questionIndex: questionIndex,
          onStart: handleStart,
          onAnswerState: handleAnswerState,
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
        key: sessionKey,
        step: currentStep,
        questionIndex: questionIndex,
        onStart: handleStart,
        onAnswerState: handleAnswerState,
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      currentStep === 1
        ? React.createElement(Navigation, {
            onNav: (dir) => {
              if (dir === "next") handleNext();
              if (dir === "prev") handlePrevious();
            },
            isNextDisabled: isNextDisabled,
            isPrevDisabled: false,
            navText: navText,
            showPrev: true,
            nextSymbol: "»",
          })
        : currentStep === 2
        ? React.createElement(
            "button",
            {
              className: "start-over-btn",
              type: "button",
              onClick: handleStartOver,
            },
            APP_DATA.steps[2].startOverButton
          )
        : React.createElement("div", { className: "lower-panel-placeholder" })
    )
  );
};
