const App = () => {
  const { useState, useEffect, useCallback } = React;

  // Main state
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [isAnswered, setIsAnswered] = useState(false);

  // Nudge (tap hand) overlay
  const [nudgeShow, setNudgeShow] = useState(false);
  const [nudgePosition, setNudgePosition] = useState(null);

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
    if (currentStep !== 1 && currentStep !== 4) {
      setNudgeShow(false);
    }
  }, [currentStep, currentQuestionIndex]);

  const handleNext = () => {
    playSound("click");
    const q = questions[currentQuestionIndex];

    if (currentStep === 1) {
      // After step 1, check if we should skip step 2
      if (q && q.skipStep2) {
        // Wait .5 sec then jump to step 3
        setTimeout(() => {
          setCurrentStep(3);
        }, 500);
      } else {
        setCurrentStep(2);
      }
    } else if (currentStep === 4) {
      // After step 4 (and button), go to summary
      setCurrentStep(5);
    } else if (currentStep < 6) {
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
      setCurrentStep(6);
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

  // Callback for skipping to step 3 directly
  const skipToStep3 = useCallback(() => {
    setCurrentStep(3);
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
      currentStep >= 1 && currentStep <= 4
        ? getStepData(currentStep, currentQuestionIndex)
        : null;
    return stepData ? stepData.questionText : "";
  };

  const getNavText = () => {
    if (dynamicNavText) return dynamicNavText;
    const stepData =
      currentStep >= 1 && currentStep <= 4
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
        }),
      ),
    );
  }

  // Step 5: Summary
  if (currentStep === 5) {
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
        }),
      ),
    );
  }

  // Step 6: Final fullscreen
  if (currentStep === 6) {
    const final = APP_DATA.step6Final || {};
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
        }),
      ),
    );
  }

  // Main Canvas Steps (1-4)
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
        onSkipToStep3: skipToStep3,
        onUpdateTexts: updateTexts,
        isAnswered: isAnswered,
        setIsAnswered: setIsAnswered,
        onNudgeShow: setNudgeShow,
        onNudgePosition: setNudgePosition,
      }),
      React.createElement(Nudge, {
        show: nudgeShow,
        position: nudgePosition,
      }),
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
      }),
    ),
  );
};
