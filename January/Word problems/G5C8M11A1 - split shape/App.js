const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicQuestionText, setDynamicQuestionText] = useState("");
  const [dynamicNavText, setDynamicNavText] = useState("");
  const [step2RetryFlag, setStep2RetryFlag] = useState(false);
  const [step2RetryTrigger, setStep2RetryTrigger] = useState(0); // Increment to tell MainCanvas to combine then reset

  // Reset state when step changes; step 6 keeps next enabled for restart
  useEffect(() => {
    setDynamicQuestionText("");
    setDynamicNavText("");
    if (currentStep === 6) {
      setIsNextDisabled(false);
    } else {
      setIsNextDisabled(true);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep !== 5) playSound("click");
    
    // Special case: step 2 retry (wrong answer) - trigger combine animation, then MainCanvas will reset
    if (currentStep === 2 && step2RetryFlag) {
      setStep2RetryFlag(false);
      setIsNextDisabled(true);
      setStep2RetryTrigger((t) => t + 1); // MainCanvas will start returning, then reset step 2
      return;
    }
    
    if (currentStep < 6) {
      if(currentStep === 5) {
        playSound("congrats")
      }
      setCurrentStep((prev) => prev + 1);
      
    } else {
      // Restart from step 0
      setCurrentStep(0);
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const enableNext = useCallback(() => {
    setIsNextDisabled(false);
  }, []);

  const disableNext = useCallback(() => {
    setIsNextDisabled(true);
  }, []);

  const goToStep = useCallback((step) => {
    setCurrentStep(step);
  }, []);

  const setStep2Retry = useCallback(() => {
    setStep2RetryFlag(true);
  }, []);

  const updateTexts = useCallback((question, nav) => {
    if (question !== undefined && question !== null) setDynamicQuestionText(question);
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
    if (!stepData) return "";
    // Step 5 uses navText1 initially (tap highlighted text), then navText2 after box click
    if (currentStep === 5) return stepData.navText1 || stepData.navText || "";
    return stepData.navText || "";
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
        step: currentStep,
        onEnableNext: enableNext,
        onDisableNext: disableNext,
        onUpdateTexts: updateTexts,
        onGoToStep: goToStep,
        onSetStep2Retry: setStep2Retry,
        step2RetryFlag: step2RetryFlag,
        step2RetryTrigger: step2RetryTrigger,
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => (dir === "next" ? handleNext() : handlePrev()),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: true, // Always disable prev in this applet
        navText: getNavText(),
        nextSymbol: "»",
      })
    )
  );
};
