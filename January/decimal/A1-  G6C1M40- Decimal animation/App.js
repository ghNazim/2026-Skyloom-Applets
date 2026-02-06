const App = () => {
  const { useState, useEffect, useCallback } = React;

  // Main state
  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  
  // DnD Question state
  const [dndQuestionIndex, setDndQuestionIndex] = useState(0);
  
  // Dynamic text state
  const [dynamicQuestionText, setDynamicQuestionText] = useState("");
  const [dynamicFeedbackText, setDynamicFeedbackText] = useState("");
  const [dynamicNavText, setDynamicNavText] = useState("");

  const handleStart = () => {
    playSound("click");
    setCurrentStep(1);
    setDndQuestionIndex(0);
  };

  const handleRestart = () => {
    playSound("click");
    setCurrentStep(0);
    setIsNextDisabled(true);
    setDndQuestionIndex(0);
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
    if (currentStep >= 1 && currentStep <= 15) {
      // Move to next step
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === 16) {
      // DnD Question step - check if more questions
      const stepData = APP_DATA.steps[16];
      const totalQuestions = stepData.questions.length;
      
      if (dndQuestionIndex < totalQuestions - 1) {
        // Go to next question
        setDndQuestionIndex(prev => prev + 1);
        setIsNextDisabled(true);
      } else {
        // All questions done, go to final step
        setCurrentStep(17);
      }
    } else if (currentStep === 17) {
      // Final step - restart
      handleRestart();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    playSound("click");
    if (currentStep > 1) {
      setIsNextDisabled(true);
      // Reset dynamic texts when going back
      setDynamicQuestionText("");
      setDynamicFeedbackText("");
      setDynamicNavText("");
      // Reset DnD question index if going back from step 16
      if (currentStep === 16) {
        setDndQuestionIndex(0);
      }
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

  // Get current step data
  const stepData = APP_DATA.steps[currentStep];

  // Splash steps (11, 12, 14, 15)
  if (stepData && stepData.type === "splash") {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Splash, {
          heading: stepData.heading,
          type: stepData.splashType,
          equationData: stepData.equation,
          feedbackText: stepData.feedbackText,
          buttonText: stepData.buttonText,
          onButtonClick: handleNext,
        })
      )
    );
  }

  // Fullscreen steps (step 13, 17)
  if (stepData && stepData.type === "fullscreen") {
    const buttonHandler = currentStep === 17 ? handleRestart : handleNext;
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: stepData.heading,
          text: stepData.text,
          buttonText: stepData.buttonText,
          onButtonClick: buttonHandler,
          left: currentStep === 17
        })
      )
    );
  }

  // DnD Question step (step 16)
  if (stepData && stepData.type === "dndQuestion") {
    const currentQuestion = stepData.questions[dndQuestionIndex];
    const totalQuestions = stepData.questions.length;
    
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(QuestionPanel, {
        text: stepData.questionText,
        step: currentStep,
      }),
      React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(DndQuestion, {
          questionData: currentQuestion,
          questionIndex: dndQuestionIndex,
          totalQuestions: totalQuestions,
          onCorrectAnswer: enableNext,
          feedbacks: stepData.feedbacks,
          navText: stepData.navText,
          navTextAfterCorrect: stepData.navTextAfterCorrect,
          navTextComplete: stepData.navTextComplete,
          checkButton: stepData.checkButton,
          places: stepData.places,
          onUpdateNav: (text) => setDynamicNavText(text),
        })
      ),
      React.createElement(
        "div",
        { className: "lower-panel" },
        React.createElement(Navigation, {
          onNav: (dir) => dir === 'next' ? handleNext() : handlePrev(),
          isNextDisabled: isNextDisabled,
          isPrevDisabled: true,
          navText: dynamicNavText || stepData.navText,
          nextSymbol: "»"
        })
      )
    );
  }

  // Main steps (1-10)
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
        isPrevDisabled: currentStep <= 1,
        navText: getNavText(),
        nextSymbol: "»"
      })
    )
  );
};
