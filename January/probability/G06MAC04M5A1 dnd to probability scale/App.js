const App = () => {
  const { useState, useCallback, useRef, useEffect } = React;

  const [currentStep, setCurrentStep] = useState(0); // 0: intro, 1: question, 2: final
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isNextEnabled, setIsNextEnabled] = useState(false);
  const [showNudge, setShowNudge] = useState(true);

  const introButtonRef = useRef(null);
  const fullscreenButtonRef = useRef(null);
  const nextButtonRef = useRef(null);

  const questions = APP_DATA.questions;
  const totalQuestions = questions.length;

  // Show nudge when user is supposed to click a button
  useEffect(() => {
    const shouldShow =
      currentStep === 0 ||
      currentStep === 2 ||
      (currentStep === 1 && isNextEnabled);
    setShowNudge(shouldShow);
  }, [currentStep, isNextEnabled]);

  const handleIntroStart = () => {
    setShowNudge(false);
    playSound("click");
    setCurrentStep(1);
    setIsNextEnabled(false);
  };

  const handleStartOver = () => {
    setShowNudge(false);
    playSound("click");
    setCurrentStep(0);
    setCurrentQuestion(0);
    setIsNextEnabled(false);
  };

  const handleEnableNext = useCallback(() => {
    setIsNextEnabled(true);
  }, []);

  const handleNav = (direction) => {
    if (direction === "next") {
      setShowNudge(false);
      playSound("click");
      if (currentStep === 1 && isNextEnabled) {
        if (currentQuestion < totalQuestions - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setCurrentStep(0);
          setIsNextEnabled(false);
        } else {
          setCurrentStep(2);
        }
      }
    } else if (direction === "prev") {
      playSound("click");
      if (currentStep === 1 && currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1);
        setCurrentStep(0);
        setIsNextEnabled(false);
      }
    }
  };

  const getNavText = () => {
    if (currentStep !== 1) return "";
    const q = questions[currentQuestion];
    if (isNextEnabled) {
      return currentQuestion === totalQuestions - 1
        ? q.navLast
        : q.navNextQuestion;
    }
    return q.navText;
  };

  const isNextDisabled = () => {
    if (currentStep !== 1) return true;
    return !isNextEnabled;
  };

  const isPrevDisabled = () => {
    if (currentStep !== 1) return true;
    return currentQuestion === 0;
  };

  // Step 0 – Intro screen (per question)
  if (currentStep === 0) {
    const intro = questions[currentQuestion].intro;
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Intro, {
          heading: intro.heading,
          image: intro.image,
          text: intro.text,
          buttonText: intro.buttonText,
          onButtonClick: handleIntroStart,
          buttonRef: introButtonRef,
        }),
        React.createElement(Nudge, {
          show: showNudge,
          targetRef: introButtonRef,
        })
      )
    );
  }

  // Step 2 – Final screen
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
          onButtonClick: handleStartOver,
          buttonRef: fullscreenButtonRef,
        }),
        React.createElement(Nudge, {
          show: showNudge,
          targetRef: fullscreenButtonRef,
        })
      )
    );
  }

  // Step 1 – Question (main canvas + navigation)
  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        key: currentQuestion,
        question: questions[currentQuestion],
        onEnableNext: handleEnableNext,
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: handleNav,
        isNextDisabled: isNextDisabled(),
        isPrevDisabled: isPrevDisabled(),
        navText: getNavText(),
        totalDots: totalQuestions,
        currentDot: currentQuestion + 1,
        nextButtonRef: nextButtonRef,
      }),
      React.createElement(Nudge, {
        show: showNudge && isNextEnabled,
        targetRef: nextButtonRef,
      })
    )
  );
};
