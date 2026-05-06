const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [solvedQuestions, setSolvedQuestions] = useState(() =>
    APP_DATA.questions.map(() => false)
  );

  const totalQuestions = APP_DATA.questions.length;

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setSolvedQuestions(APP_DATA.questions.map(() => false));
    setCurrentStep(1);
    setCurrentQuestion(0);
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setCurrentQuestion(0);
    setDynamicNavText(null);
    setIsNextDisabled(true);
    setSolvedQuestions(APP_DATA.questions.map(() => false));
    setResetKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (currentStep !== 1) return;
    if (solvedQuestions[currentQuestion]) {
      setIsNextDisabled(false);
      const s = APP_DATA.steps[1];
      const last = currentQuestion === totalQuestions - 1;
      setDynamicNavText(last ? s.navLast : s.navTextDone);
    } else {
      setDynamicNavText(null);
      setIsNextDisabled(true);
    }
  }, [currentStep, currentQuestion, solvedQuestions, totalQuestions]);

  const markQuestionSolved = useCallback((index) => {
    setSolvedQuestions((prev) => {
      if (prev[index]) return prev;
      const next = prev.slice();
      next[index] = true;
      return next;
    });
  }, []);

  const handleNext = () => {
    if (isNextDisabled) return;
    if (typeof playSound === "function") playSound("click");

    if (currentStep === 1) {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setCurrentStep(2);
      }
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 1) {
      if (currentQuestion > 0) {
        setCurrentQuestion((prev) => prev - 1);
      } else {
        setCurrentStep(0);
      }
    } else if (currentStep === 2) {
      setCurrentStep(1);
      setCurrentQuestion(totalQuestions - 1);
    }
  };

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const updateNavText = useCallback((nav) => {
    setDynamicNavText(nav);
  }, []);

  const getQuestionText = () => {
    if (currentStep === 1) {
      return APP_DATA.questions[currentQuestion].questionText;
    }
    return "";
  };

  const getNavText = () => {
    if (dynamicNavText !== null && dynamicNavText !== undefined) {
      return dynamicNavText;
    }
    if (currentStep === 1) {
      return APP_DATA.steps[1].navText;
    }
    return "";
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
          rightContent: React.createElement(MainCanvas, {
            step: 0,
            questionIndex: 0,
            isQuestionSolved: false,
            onSetNextEnabled: () => {},
            onUpdateNavText: () => {},
            onQuestionSolved: () => {},
            isStartScreen: true
          })
        })
      )
    );
  }

  // Step 2: Final fullscreen
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
          onButtonClick: handleRestart,
        })
      )
    );
  }

  // Step 1: Questions
  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: getQuestionText(),
      questionKey: currentQuestion,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        key: resetKey + "-q" + currentQuestion,
        step: currentStep,
        questionIndex: currentQuestion,
        isQuestionSolved: !!solvedQuestions[currentQuestion],
        onSetNextEnabled: setNextEnabled,
        onUpdateNavText: updateNavText,
        onQuestionSolved: markQuestionSolved,
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => (dir === "next" ? handleNext() : handlePrev()),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: currentQuestion === 0,
        navText: getNavText(),
      })
    )
  );
};
