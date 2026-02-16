const App = () => {
  const { useState, useEffect, useCallback } = React;

  // Main state
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // -1 = first question (3.25), 0+ = questions array
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [isAnswered, setIsAnswered] = useState(false);

  // Nudge (tap hand) overlay: show at position from MainCanvas
  const [nudgeShow, setNudgeShow] = useState(false);
  const [nudgePosition, setNudgePosition] = useState(null);

  // Dynamic text state
  const [dynamicQuestionText, setDynamicQuestionText] = useState("");
  const [dynamicNavText, setDynamicNavText] = useState("");

  const handleStart = () => {
    playSound("click");
    setCurrentStep(1);
  };

  const handleRestart = () => {
    playSound("click");
    setCurrentStep(0);
    setCurrentQuestionIndex(-1);
    setIsNextDisabled(true);
    setIsAnswered(false);
  };

  const questions = APP_DATA.questions || [];
  const nextQuestionIndex = currentQuestionIndex + 1;

  const handleDecimalIntroContinue = () => {
    playSound("click");
    setCurrentQuestionIndex(nextQuestionIndex);
    setCurrentStep(1);
    setIsNextDisabled(false);
  };

  const handleStartOver = () => {
    playSound("click");
    setCurrentStep(0);
    setCurrentQuestionIndex(-1);
    setIsNextDisabled(true);
    setIsAnswered(false);
  };

  // Reset next button and dynamic texts on step change
  useEffect(() => {
    setIsNextDisabled(true);
    setIsAnswered(false);
    setDynamicQuestionText("");
    setDynamicNavText("");
    if (currentStep !== 2 && currentStep !== 5) {
      setNudgeShow(false);
    }

    // Steps that have "Next" button immediately enabled
    if (currentStep === 1) {
      setIsNextDisabled(false);
    }
  }, [currentStep]);

  const handleNext = () => {
    playSound("click");
    if (currentStep === 5) {
      if (nextQuestionIndex < questions.length) {
        setCurrentStep(6);
      } else {
        setCurrentStep(7);
      }
    } else if (currentStep < 7) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    playSound("click");
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Callback from MainCanvas to enable Next button
  const enableNext = useCallback(() => {
    setIsNextDisabled(false);
  }, []);

  // Callback from MainCanvas to auto-advance step
  const advanceStep = useCallback(() => {
    setCurrentStep(prev => prev + 1);
  }, []);

  // Handlers for dynamic text updates from MainCanvas
  const updateTexts = useCallback((question, feedback, nav) => {
    if (question !== undefined && question !== null) setDynamicQuestionText(question);
    if (nav !== undefined && nav !== null) setDynamicNavText(nav);
  }, []);

  // Content Selection (use getStepData when on steps 1–5)
  const getQuestionText = () => {
    if (dynamicQuestionText) return dynamicQuestionText;
    const stepData = currentStep >= 1 && currentStep <= 5 ? getStepData(currentStep, currentQuestionIndex) : APP_DATA.steps[currentStep];
    return stepData ? stepData.questionText : "";
  };

  const getNavText = () => {
    if (dynamicNavText) return dynamicNavText;
    const stepData = currentStep >= 1 && currentStep <= 5 ? getStepData(currentStep, currentQuestionIndex) : APP_DATA.steps[currentStep];
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

  // Step 6: Decimal intro (next question from array)
  if (currentStep === 6 && questions[nextQuestionIndex]) {
    const q = questions[nextQuestionIndex];
    const intro = APP_DATA.step6Intro || {};
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(DecimalIntro, {
          integerPart: q.integerPart,
          decimalPoint: q.decimalPoint,
          fractionalDigits: q.fractionalDigits,
          introText: intro.introText,
          buttonText: intro.buttonText,
          onContinue: handleDecimalIntroContinue,
        })
      )
    );
  }

  // Step 7: Final fullscreen
  if (currentStep === 7) {
    const final = APP_DATA.step7Final || {};
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(Fullscreen, {
          heading: final.heading,
          text: final.text,
          buttonText: final.buttonText,
          onButtonClick: handleStartOver,
        })
      )
    );
  }

  // Main Canvas Steps (1-5)
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
        isLastQuestion: currentQuestionIndex >= 0 && currentQuestionIndex === questions.length - 1,
        onEnableNext: enableNext,
        onAdvanceStep: advanceStep,
        onUpdateTexts: updateTexts,
        isAnswered: isAnswered,
        setIsAnswered: setIsAnswered,
        onNudgeShow: setNudgeShow,
        onNudgePosition: setNudgePosition,
      }),
      React.createElement(Nudge, {
        show: nudgeShow,
        position: nudgePosition,
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => dir === 'next' ? handleNext() : handlePrev(),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: currentStep <= 1 || currentStep === 6 || currentStep === 7,
        navText: getNavText(),
        nextSymbol: "»"
      })
    )
  );
};
