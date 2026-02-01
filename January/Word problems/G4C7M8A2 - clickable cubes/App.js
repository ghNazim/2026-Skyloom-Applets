const App = () => {
  const { useState, useEffect, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [isAnswered, setIsAnswered] = useState(false);
  const [step1QuestionIndex, setStep1QuestionIndex] = useState(0);
  const [dynamicQuestionText, setDynamicQuestionText] = useState("");
  const [dynamicFeedbackText, setDynamicFeedbackText] = useState("");
  const [dynamicNavText, setDynamicNavText] = useState("");

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setIsNextDisabled(true);
    setIsAnswered(false);
    setStep1QuestionIndex(0);
  };

  useEffect(() => {
    setIsNextDisabled(true);
    setIsAnswered(false);
    setDynamicQuestionText("");
    setDynamicFeedbackText("");
    setDynamicNavText("");
    if (currentStep === 0) setStep1QuestionIndex(0);
  }, [currentStep]);

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 1) {
      const stepData = APP_DATA.steps[1];
      const totalQuestions = stepData.questions.length;
      if (step1QuestionIndex < totalQuestions - 1) {
        setIsAnswered(false);
        setIsNextDisabled(true);
        setStep1QuestionIndex((prev) => prev + 1);
        setDynamicNavText(stepData.navText);
      } else {
        setCurrentStep(2);
      }
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 1 && step1QuestionIndex > 0) {
      setIsNextDisabled(true);
      setIsAnswered(false);
      setStep1QuestionIndex((prev) => prev - 1);
      const stepData = APP_DATA.steps[1];
      setDynamicNavText(stepData.navText);
    }
  };

  const enableNext = useCallback(() => {
    setIsNextDisabled(false);
  }, []);

  const updateTexts = useCallback((question, feedback, nav) => {
    if (question !== undefined && question !== null) setDynamicQuestionText(question);
    if (feedback !== undefined && feedback !== null) setDynamicFeedbackText(feedback);
    if (nav !== undefined && nav !== null) setDynamicNavText(nav);
  }, []);

  const getQuestionText = () => {
    if (dynamicQuestionText) return dynamicQuestionText;
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.questionText : "";
  };

  const getNavText = () => {
    if (dynamicNavText) return dynamicNavText;
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.navText : "";
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

  // Step 1: Main canvas (3D + MCQ) + navigation
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
        questionIndex: step1QuestionIndex,
        onEnableNext: enableNext,
        onUpdateTexts: updateTexts,
        isAnswered: isAnswered,
        setIsAnswered: setIsAnswered,
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => (dir === "next" ? handleNext() : handlePrev()),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: currentStep !== 1 || step1QuestionIndex <= 0,
        navText: getNavText(),
        nextSymbol: "»",
      })
    )
  );
};
