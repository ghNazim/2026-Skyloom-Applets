const App = () => {
  const { useState, useEffect, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [isAnswered, setIsAnswered] = useState(false);
  const [step1QuestionIndex, setStep1QuestionIndex] = useState(0);
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
    if (currentStep === 0) {
      setStep1QuestionIndex(0);
      setDynamicNavText("");
    } else if (currentStep === 1) {
      const stepData = APP_DATA.steps[1];
      const texts = stepData?.texts || {};
      setDynamicNavText(texts[stepData?.nKey || "nav_default"] || "Tap the correct option.");
    }
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
        const nextQ = stepData.questions[step1QuestionIndex + 1];
        const texts = stepData.texts || {};
        const navDefault = texts[stepData.nKey || "nav_default"] || "Tap the correct option.";
        setDynamicNavText(navDefault);
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
      const texts = stepData.texts || {};
      const navDefault = texts[stepData.nKey || "nav_default"] || "Tap the correct option.";
      setDynamicNavText(navDefault);
    }
  };

  const enableNext = useCallback(() => {
    setIsNextDisabled(false);
  }, []);

  const updateTexts = useCallback((question, feedback, nav) => {
    if (nav !== undefined && nav !== null) setDynamicNavText(nav);
  }, []);

  const getNavText = () => {
    if (dynamicNavText) return dynamicNavText;
    const stepData = APP_DATA.steps[currentStep];
    if (!stepData) return "";
    const texts = stepData.texts || {};
    return texts[stepData.nKey || "nav_default"] || "";
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
          onButtonClick: handleRestart,
        })
      )
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
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
