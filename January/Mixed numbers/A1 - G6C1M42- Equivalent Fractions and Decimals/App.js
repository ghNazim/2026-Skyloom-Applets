const App = () => {
  const { useState, useEffect, useCallback } = React;

  // Main state
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [isAnswered, setIsAnswered] = useState(false);

  // Dynamic text state
  const [dynamicQuestionText, setDynamicQuestionText] = useState("");
  const [dynamicNavText, setDynamicNavText] = useState("");

  const questions = APP_DATA.questions || [];

  const handleStart = () => {
    playSound("click");
    setCurrentStep(1);
  };

  const handleStartOver = () => {
    playSound("click");
    setCurrentStep(0);
    setCurrentQuestionIndex(0);
    setIsNextDisabled(true);
    setIsAnswered(false);
  };

  // Reset next button and dynamic texts on step change
  useEffect(() => {
    setIsNextDisabled(true);
    setIsAnswered(false);
    setDynamicQuestionText("");
    setDynamicNavText("");
  }, [currentStep, currentQuestionIndex]);

  const handleNext = () => {
    playSound("click");
    if (currentStep < 8) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    playSound("click");
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Summary continue -> next question or final
  const handleSummaryContinue = () => {
    playSound("click");
    const nextQIdx = currentQuestionIndex + 1;
    if (nextQIdx < questions.length) {
      setCurrentQuestionIndex(nextQIdx);
      setCurrentStep(1);
    } else {
      setCurrentStep(8);
    }
  };

  // Callback from MainCanvas to enable Next button
  const enableNext = useCallback(() => {
    setIsNextDisabled(false);
  }, []);

  // Callback from MainCanvas to auto-advance step
  const advanceStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

  // Handlers for dynamic text updates from MainCanvas
  const updateTexts = useCallback((question, feedback, nav) => {
    if (question !== undefined && question !== null)
      setDynamicQuestionText(question);
    if (nav !== undefined && nav !== null) setDynamicNavText(nav);
  }, []);

  // Content Selection
  const getQuestionText = () => {
    if (dynamicQuestionText) return dynamicQuestionText;
    const stepData =
      currentStep >= 1 && currentStep <= 7
        ? getStepData(currentStep, currentQuestionIndex)
        : null;
    return stepData ? stepData.questionText : "";
  };

  const getNavText = () => {
    if (dynamicNavText) return dynamicNavText;
    const stepData =
      currentStep >= 1 && currentStep <= 7
        ? getStepData(currentStep, currentQuestionIndex)
        : null;
    return stepData ? stepData.navText : "";
  };

  // Step 0: Start Fullscreen
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

  // Step 7: Summary
  if (currentStep === 7) {
    const q = questions[currentQuestionIndex];
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Summary, {
          question: q,
          onContinue: handleSummaryContinue,
        })
      )
    );
  }

  // Step 8: Final fullscreen
  if (currentStep === 8) {
    const final = APP_DATA.step8Final || {};
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: final.heading,
          text: final.text,
          buttonText: final.buttonText,
          onButtonClick: handleStartOver,
        })
      )
    );
  }

  // Main Canvas Steps (1-6)
  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: getQuestionText(),
      step: currentStep,
    }),
    React.createElement(
      "div",
      { className: "app-main-content", style: { position: "relative" } },
      React.createElement(MainCanvas, {
        step: currentStep,
        questionIndex: currentQuestionIndex,
        isLastQuestion: currentQuestionIndex === questions.length - 1,
        onEnableNext: enableNext,
        onAdvanceStep: advanceStep,
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
        isPrevDisabled: currentStep <= 1,
        navText: getNavText(),
        nextSymbol: "»",
      })
    )
  );
};
