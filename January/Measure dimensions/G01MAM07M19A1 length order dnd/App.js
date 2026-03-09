const App = () => {
  const { useState, useEffect, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const questions = APP_DATA.questions || [];
  const hasMoreQuestions = questionIndex < questions.length - 1;

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
    setQuestionIndex(0);
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setQuestionIndex(0);
    setIsNextDisabled(true);
    setDynamicNavText(null);
    setResetKey((prev) => prev + 1);
  };

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 1) {
      if (hasMoreQuestions) {
        setQuestionIndex((prev) => prev + 1);
        setIsNextDisabled(true);
        setDynamicNavText(null);
        setResetKey((prev) => prev + 1);
      } else {
        setCurrentStep(2);
        setIsNextDisabled(true);
      }
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 1 && questionIndex > 0) {
      setQuestionIndex((prev) => prev - 1);
      setResetKey((prev) => prev + 1);
      setIsNextDisabled(true);
      setDynamicNavText(null);
    }
  };

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const updateTexts = useCallback((nav) => {
    if (nav !== undefined) setDynamicNavText(nav);
  }, []);

  const getQuestionText = () => {
    if (currentStep !== 1 || !questions[questionIndex]) return "";
    const q = questions[questionIndex];
    const step1 = APP_DATA.step1;
    if (!step1) return "";
    return q.question_type === "l2s"
      ? step1.questionTemplateL2s
      : step1.questionTemplateS2l;
  };

  const getNavText = () => {
    if (dynamicNavText !== null && dynamicNavText !== undefined) return dynamicNavText;
    if (currentStep === 1) return APP_DATA.step1?.navText || "";
    return "";
  };

  // Step 0: Start fullscreen
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

  // Step 2: Final fullscreen
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
        })
      )
    );
  }

  // Step 1: Question + Main canvas
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
        question: questions[questionIndex] || null,
        questionIndex: questionIndex,
        onSetNextEnabled: setNextEnabled,
        onUpdateTexts: updateTexts,
        hasMoreQuestions: hasMoreQuestions,
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => (dir === "next" ? handleNext() : dir === "prev" ? handlePrev() : null),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: currentStep !== 1 || questionIndex <= 0,
        navText: getNavText(),
      })
    )
  );
};
