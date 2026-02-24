const App = () => {
  const { useState, useEffect, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [step2SubStep, setStep2SubStep] = useState(0); // 0: copy phase, 1: flip phase
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setStep2SubStep(0);
    setIsNextDisabled(true);
  };

  const [resetKey, setResetKey] = useState(0); // Key to force reset of MainCanvas

  useEffect(() => {
    // Reset substep when leaving step 2
    if (currentStep !== 2) {
      setStep2SubStep(0);
    }
    // Step 4 has next enabled by default
    if (currentStep === 4) {
      setIsNextDisabled(false);
    } else {
      setIsNextDisabled(true);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 2 && step2SubStep === 0) {
      // Advance to the flip sub-step instead of going to step 3
      setStep2SubStep(1);
      setIsNextDisabled(true); // Disable immediately; MainCanvas re-enables after animation
    } else if (currentStep === 5) {
      // Step 5 goes directly to final step (step 7)
      setCurrentStep(7);
    } else if (currentStep < 7) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep > 1) {
      // Reset all states by incrementing resetKey
      setResetKey(prev => prev + 1);
      setStep2SubStep(0);
      setCurrentStep(prev => prev - 1);
    }
  };

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const updateTexts = useCallback((nav) => {
    if (nav !== undefined) setDynamicNavText(nav);
  }, []);

  const updateQuestionText = useCallback((text) => {
    if (text !== undefined) setDynamicQuestionText(text);
  }, []);

  // null → use step data default; "" → intentionally blank; any string → show that string
  const getQuestionText = () => {
    if (dynamicQuestionText !== null && dynamicQuestionText !== undefined) return dynamicQuestionText;
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.questionText : "";
  };

  const getNavText = () => {
    if (dynamicNavText !== null && dynamicNavText !== undefined) return dynamicNavText;
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

  // Step 7: Final fullscreen (color-coded formula, two-column with image)
  if (currentStep === 7) {
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
          isFinal: true,
          imageSrc: APP_DATA.final.imageSrc,
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
        key: resetKey, // Force remount/reset when resetKey changes
        step: currentStep,
        step2SubStep: step2SubStep,
        onSetNextEnabled: setNextEnabled,
        onUpdateTexts: updateTexts,
        onUpdateQuestionText: updateQuestionText,
        onForceNext: handleNext,
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => (dir === "next" ? handleNext() : (dir === "prev" ? handlePrev() : null)),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: currentStep <= 1, // Disable only on step 0 and 1
        navText: getNavText(),
        // nextSymbol: "▶",
      })
    )
  );
};
