const App = () => {
  const { useState, useEffect, useCallback } = React;

  // Main state
  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // Question index (replaces step5QuestionIndex, used for any step with questions array)
  const [questionIndex, setQuestionIndex] = useState(0);
  
  // Dynamic text state
  const [dynamicQuestionText, setDynamicQuestionText] = useState("");
  const [dynamicFeedbackText, setDynamicFeedbackText] = useState("");
  const [dynamicNavText, setDynamicNavText] = useState("");

  const handleStart = () => {
    playSound("click");
    setCurrentStep(1);
  };

  const handleRestart = () => {
    playSound("click");
    setCurrentStep(0);
    setIsNextDisabled(true);
    setQuestionIndex(0);
  };
  
  // Reset next button and dynamic texts on step change
  useEffect(() => {
    // Default disable next for most steps
    setIsNextDisabled(true);
    setIsAnswered(false);
    
    // Reset dynamic texts
    setDynamicQuestionText("");
    setDynamicFeedbackText("");
    setDynamicNavText("");
    
    // Steps that have "Next" button immediately enabled (non-MCQ steps or Splash if handled by next button)
    // Step 2, 3, 4, 6 (Arrows), 7 (Splash - button handled separately)
    // Splash usually has its own button, so 'lower-panel' might not be shown or Next is ignored.
    // If Step 7 is Splash, we render Splash component which has its own "Continue" button calling handleNext.
    
    const stepData = APP_DATA.steps[currentStep];
    if (stepData) {
        if (!stepData.mcq && !stepData.questions && !stepData.isSplash) {
             setIsNextDisabled(false);
        }
        if (stepData.isSplash) {
            // Splash has its own button, but logic usually handled in render
        }
    }
  }, [currentStep]);

  const handleNext = () => {
    playSound("click");
    
    // Check for Final Step (Step 9)
    if (currentStep === 9) {
      handleRestart();
      return;
    }

    // Check for Question Loop Step
    const stepData = APP_DATA.steps[currentStep];
    
    if (stepData && stepData.questions) {
      const totalQuestions = stepData.questions.length;
      
      if (questionIndex < totalQuestions - 1) {
        // More questions remaining
        setIsAnswered(false);
        setQuestionIndex(prev => prev + 1);
        setIsNextDisabled(true);
        setDynamicNavText(stepData.navText);
        setDynamicQuestionText(""); 
        setDynamicFeedbackText("");
      } else {
        // All questions done
        setCurrentStep(prev => prev + 1);
        setQuestionIndex(0); // Reset for future or just cleanup
      }
    } else {
      // Normal Step Advance
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    playSound("click");
    if (currentStep > 1) {
      setIsNextDisabled(true);
      setDynamicQuestionText("");
      setDynamicFeedbackText("");
      setDynamicNavText("");
      
      const stepData = APP_DATA.steps[currentStep];
      
      // Special handling for step 8: go back to previous question if any, otherwise go back to previous step
      if (currentStep === 8 && stepData && stepData.questions && questionIndex > 0) {
        // Go back to previous question
        setQuestionIndex(prev => prev - 1);
        setIsAnswered(false);
      } else {
        // Go back to previous step
        setCurrentStep(prev => prev - 1);
        setQuestionIndex(0); // Reset loop index when going back to previous step
      }
    }
  };

  // Callback from MainCanvas to enable Next button
  const enableNext = useCallback(() => {
    setIsNextDisabled(false);
  }, []);

  // Callback from MainCanvas to auto-advance step (without sound for auto-advance)
  const advanceStep = useCallback(() => {
    // Don't play sound on auto-advance, handleNext will handle it if needed
    // For auto-advance, we skip the sound
    const stepData = APP_DATA.steps[currentStep];
    
    // Check for Final Step (Step 9)
    if (currentStep === 9) {
      handleRestart();
      return;
    }

    // Check for Question Loop Step
    if (stepData && stepData.questions) {
      const totalQuestions = stepData.questions.length;
      
      if (questionIndex < totalQuestions - 1) {
        // More questions remaining
        setIsAnswered(false);
        setQuestionIndex(prev => prev + 1);
        setIsNextDisabled(true);
        setDynamicNavText(stepData.navText);
        setDynamicQuestionText(""); 
        setDynamicFeedbackText("");
      } else {
        // All questions done
        setCurrentStep(prev => prev + 1);
        setQuestionIndex(0); // Reset for future or just cleanup
      }
    } else {
      // Normal Step Advance
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, questionIndex]);

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
    return stepData ? stepData.questionText : "";
  };
  
  const getNavText = () => {
    if (dynamicNavText) return dynamicNavText;
    const stepData = APP_DATA.steps[currentStep];
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

  // Step 7 or Splash Steps
  // Identify Splash by isSplash property in data
  const stepData = APP_DATA.steps[currentStep];
  if (stepData && stepData.isSplash) {
      return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Splash, {
          onButtonClick: handleNext,
        })
      )
    );
  }

  // Final Step (Step 9)
  if (currentStep === 9) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(FinalScreen, {
          heading: APP_DATA.final.heading,
          text: APP_DATA.final.text,
          buttonTextStartOver: APP_DATA.final.buttonText,
          buttonTextPrevious: "«",
          onStartOver: handleRestart,
          onPrevious: handlePrev
        })
      )
    );
  }

  // Main Canvas Steps
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
        onAdvanceStep: advanceStep,
        onUpdateTexts: updateTexts,
        isAnswered: isAnswered,
        setIsAnswered: setIsAnswered,
        questionIndex: questionIndex, // Renamed prop
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => dir === 'next' ? handleNext() : handlePrev(),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: currentStep <= 1,
        navText: getNavText(),
        nextSymbol: "»"
      })
    )
  );
};
