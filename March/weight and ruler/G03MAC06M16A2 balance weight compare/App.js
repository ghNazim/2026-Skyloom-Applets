const App = () => {
  const { useState, useEffect, useCallback } = React;

  const questions = APP_DATA.questions;
  const lastQuestionIndex = questions.length - 1;

  const [currentStep, setCurrentStep] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
    setQuestionIndex(0);
    setIsNextDisabled(true);
    setDynamicNavText(null);
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setQuestionIndex(0);
    setIsNextDisabled(true);
    setDynamicNavText(null);
    setResetKey((k) => k + 1);
  };

  useEffect(() => {
    if (currentStep !== 1) return;
    setDynamicNavText(null);
    setIsNextDisabled(true);
  }, [questionIndex, currentStep]);

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep !== 1) return;
    if (questionIndex < lastQuestionIndex) {
      setQuestionIndex((i) => i + 1);
    } else {
      setCurrentStep(2);
      setIsNextDisabled(true);
      setDynamicNavText(null);
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep !== 1 || questionIndex <= 0) return;
    setQuestionIndex((i) => i - 1);
  };

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const updateTexts = useCallback((nav) => {
    if (nav !== undefined) setDynamicNavText(nav);
  }, []);

  const getQuestionText = () => {
    if (currentStep === 1 && questions[questionIndex])
      return questions[questionIndex].questionText;
    return "";
  };

  const getNavText = () => {
    if (dynamicNavText !== null && dynamicNavText !== undefined)
      return dynamicNavText;
    if (currentStep === 1 && questions[questionIndex])
      return questions[questionIndex].navText;
    return "";
  };

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
        }),
      ),
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
          onButtonClick: handleRestart,
        }),
      ),
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
        key: resetKey + "-" + questionIndex,
        question: questions[questionIndex],
        onSetNextEnabled: setNextEnabled,
        onUpdateTexts: updateTexts,
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) =>
          dir === "next" ? handleNext() : dir === "prev" ? handlePrev() : null,
        isNextDisabled: isNextDisabled,
        isPrevDisabled: currentStep === 1 && questionIndex === 0,
        navText: getNavText(),
        totalDots: questions.length,
        currentDot: questionIndex + 1,
      }),
    ),
  );
};
