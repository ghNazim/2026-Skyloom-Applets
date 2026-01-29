const App = () => {
  const { useState, useEffect, useCallback } = React;

  // Main state
  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // Step 5 question index
  const [step5QuestionIndex, setStep5QuestionIndex] = useState(0);
  
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
    setStep5QuestionIndex(0);
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
    
    // Steps that have "Next" button immediately enabled (non-MCQ steps)
    if (currentStep === 2 || currentStep === 3) {
      setIsNextDisabled(false);
    }
  }, [currentStep]);

  const handleNext = () => {
    playSound("click");
    if (currentStep === 6) {
      // Final step - restart
      handleRestart();
    } else if (currentStep === 4) {
      // Splash step - go to step 5
      setCurrentStep(5);
    } else if (currentStep === 5) {
      // Step 5: cycle through questions or go to step 6
      const step5Data = APP_DATA.steps[5];
      const totalQuestions = step5Data.questions.length;
      
      if (step5QuestionIndex < totalQuestions - 1) {
        // More questions remaining - go to next question
        setIsAnswered(false);
        setStep5QuestionIndex(prev => prev + 1);
        setIsNextDisabled(true);
        setDynamicNavText(step5Data.navText);
      } else {
        // All questions done - go to step 6
        setCurrentStep(6);
      }
    } else {
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
      
      // Handle Step 6: go back to last question of step 5
      if (currentStep === 6) {
        const step5Data = APP_DATA.steps[5];
        const lastQuestionIndex = step5Data.questions.length - 1;
        setStep5QuestionIndex(lastQuestionIndex);
        setIsAnswered(true);
        setCurrentStep(5);
        setDynamicNavText(step5Data.navTextLast);
        setIsNextDisabled(false);
        return;
      }
      
      // Handle Step 5: go to previous question if any, otherwise go to previous step
      if (currentStep === 5) {
        if (step5QuestionIndex > 0) {
          // Go to previous question within Step 5
          setIsAnswered(false);
          setStep5QuestionIndex(prev => prev - 1);
          const step5Data = APP_DATA.steps[5];
          setDynamicNavText(step5Data.navText);
        } else {
          // First question - skip splash screen and go to step 3
          setStep5QuestionIndex(0);
          setCurrentStep(3);
        }
      } else {
        setCurrentStep(prev => prev - 1);
      }
    }
  };

  // Callback from MainCanvas to enable Next button
  const enableNext = useCallback(() => {
    setIsNextDisabled(false);
  }, []);

  // Callback from MainCanvas to auto-advance step
  const advanceStep = useCallback(() => {
    playSound("click");
    setCurrentStep(prev => prev + 1);
  }, []);

  // Callback from MainCanvas to advance to next question in step 5
  const handleStep5NextQuestion = useCallback(() => {
    const step5Data = APP_DATA.steps[5];
    const totalQuestions = step5Data.questions.length;
    
    if (step5QuestionIndex < totalQuestions - 1) {
      // More questions remaining - go to next question
      setIsAnswered(false);
      setStep5QuestionIndex(prev => prev + 1);
      setIsNextDisabled(true);
      setDynamicNavText(step5Data.navText);
    }
  }, [step5QuestionIndex]);

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

  // Step 4: Splash Screen
  if (currentStep === 4) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Splash, {
          onButtonClick: () => {
            playSound("click");
            setCurrentStep(5);
          },
        })
      )
    );
  }

  // Step 6: Final Screen
  if (currentStep === 6) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(FinalScreen, {
          heading: APP_DATA.final.heading,
          text: APP_DATA.final.text,
          buttonTextPrevious: "«",
          buttonTextStartOver: APP_DATA.final.buttonText,
          onPrevious: handlePrev,
          onStartOver: handleRestart,
        })
      )
    );
  }

  // Main Canvas Steps (1, 2, 3, 5)
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
        step5QuestionIndex: step5QuestionIndex,
        onStep5NextQuestion: handleStep5NextQuestion,
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
