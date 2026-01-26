const App = () => {
  const { useState, useEffect, useCallback } = React;

  // Main state
  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  
  // Dynamic text state
  const [dynamicQuestionText, setDynamicQuestionText] = useState("");
  const [dynamicFeedbackText, setDynamicFeedbackText] = useState("");
  const [dynamicNavText, setDynamicNavText] = useState("");

  const handleStart = () => {
    playSound("click");
    // Jump directly to step 5
    setCurrentStep(5);
  };

  const handleRestart = () => {
    playSound("click");
    setCurrentStep(0);
    setIsNextDisabled(true);
  };
  
  // Reset next button on step change
  useEffect(() => {
    setIsNextDisabled(true);
    // Reset dynamic texts
    setDynamicQuestionText("");
    setDynamicNavText("");
  }, [currentStep]);

  const handleNext = () => {
    playSound("click");
    if (currentStep === 5) {
      // Move from step 5 to step 6
      setCurrentStep(6);
    } else if (currentStep === 6) {
      // Final step - could show completion or restart
      // For now, let's show a final screen or restart
      handleRestart();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    playSound("click");
    if (currentStep === 6) {
      setIsNextDisabled(true);
      setCurrentStep(5);
    } else if (currentStep > 0) {
      setIsNextDisabled(true);
      setCurrentStep(prev => prev - 1);
    }
  };

  // Callback from MainCanvas to enable Next button
  const enableNext = useCallback(() => {
    setIsNextDisabled(false);
  }, []);

  // Callback from MainCanvas to disable Next button
  const disableNext = useCallback(() => {
    setIsNextDisabled(true);
  }, []);

  // Callback from MainCanvas to auto-advance step
  const advanceStep = useCallback(() => {
    playSound("click");
    setCurrentStep(prev => prev + 1);
  }, []);

  // Handlers for dynamic text updates from MainCanvas
  const updateTexts = useCallback((question, feedback, nav) => {
    if (question !== undefined && question !== null) setDynamicQuestionText(question);
    if (feedback !== undefined && feedback !== null) setDynamicFeedbackText(feedback);
    if (nav !== undefined && nav !== null) setDynamicNavText(nav);
  }, []);

  // Content Selection
  const getQuestionText = () => {
    if (dynamicQuestionText) return dynamicQuestionText;
    const stepData = APP_DATA.steps[currentStep];
    if (stepData) {
      return stepData.questionText || stepData.q || "";
    }
    return "";
  };
  
  const getNavText = () => {
    if (dynamicNavText) return dynamicNavText;
    const stepData = APP_DATA.steps[currentStep];
    if (stepData) {
      return stepData.navText || stepData.n || "";
    }
    return "";
  };

  // Step 0: Initial Fullscreen
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

  // Main steps (5, 6, etc.)
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
        onEnableNext: enableNext,
        onDisableNext: disableNext,
        onAdvanceStep: advanceStep,
        onUpdateTexts: updateTexts,
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => dir === 'next' ? handleNext() : handlePrev(),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: currentStep <= 5,
        navText: getNavText(),
        nextSymbol: "»"
      })
    )
  );
};
