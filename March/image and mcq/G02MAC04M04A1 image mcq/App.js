const App = () => {
  const { useState, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [nextSymbol, setNextSymbol] = useState("»");
  const [resetKey, setResetKey] = useState(0);

  const questions = APP_DATA.questions;

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(2);
    setQuestionIndex(0);
    setIsNextDisabled(true);
    setDynamicNavText(APP_DATA.steps[2].navText);
    setNextSymbol("»");
    setResetKey((k) => k + 1);
  };

  const fullResetToIntro = useCallback(() => {
    setCurrentStep(1);
    setQuestionIndex(0);
    setIsNextDisabled(true);
    setDynamicNavText(null);
    setNextSymbol("»");
    setResetKey((k) => k + 1);
  }, []);

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const updateNavAfterAnswer = useCallback((isLastQuestion) => {
    if (isLastQuestion) {
      setDynamicNavText(APP_DATA.steps[2].navFinal);
    } else {
      setDynamicNavText(APP_DATA.steps[2].navCorrect);
    }
    setNextSymbol("»");
  }, []);

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep !== 2) return;

    const isLast = questionIndex >= questions.length - 1;
    if (isLast) {
      fullResetToIntro();
      return;
    }

    setQuestionIndex((i) => i + 1);
    setIsNextDisabled(true);
    setDynamicNavText(APP_DATA.steps[2].navText);
    setNextSymbol("»");
    setResetKey((k) => k + 1);
  };

  const handlePrevious = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 1) return;

    if (questionIndex > 0) {
      setQuestionIndex((i) => i - 1);
      setIsNextDisabled(true);
      setDynamicNavText(APP_DATA.steps[2].navText);
      setNextSymbol("»");
      setResetKey((k) => k + 1);
    } else {
      fullResetToIntro();
    }
  };

  const getQuestionText = () => {
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.questionText : "";
  };

  const getNavText = () => {
    if (dynamicNavText !== null && dynamicNavText !== undefined) {
      return dynamicNavText;
    }
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.navText : "";
  };

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
        key: resetKey,
        step: currentStep,
        questionIndex: questionIndex,
        onSetNextEnabled: setNextEnabled,
        onNavAfterAnswer: updateNavAfterAnswer,
        onStart: handleStart,
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => {
          if (dir === "next") handleNext();
          else if (dir === "prev") handlePrevious();
        },
        isNextDisabled: isNextDisabled,
        isPrevDisabled: currentStep === 1,
        navText: getNavText(),
        nextSymbol: nextSymbol,
        nextBtnClass: nextSymbol.length > 2 ? "text-button" : "",
      })
    )
  );
};
