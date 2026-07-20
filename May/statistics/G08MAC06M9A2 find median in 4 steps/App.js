const App = () => {
  const { useState, useEffect, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [challengeIndex, setChallengeIndex] = useState(0);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
    setChallengeIndex(0);
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setChallengeIndex(0);
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setIsNextDisabled(true);
    setResetKey(function (prev) { return prev + 1; });
  };

  useEffect(function () {
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setIsNextDisabled(true);
  }, [currentStep]);

  const handleNext = () => {
    if (isNextDisabled) return;
    if (typeof playSound === "function") playSound("click");
    if (currentStep < 2) {
      setCurrentStep(function (prev) { return prev + 1; });
      return;
    }
    if (currentStep === 2) {
      var challenges = APP_DATA.challenges || [];
      if (challengeIndex < challenges.length - 1) {
        setChallengeIndex(function (prev) { return prev + 1; });
        setDynamicNavText(null);
        setDynamicQuestionText(null);
        setIsNextDisabled(true);
        setResetKey(function (prev) { return prev + 1; });
      } else {
        setCurrentStep(3);
      }
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep > 1) {
      setCurrentStep(function (prev) { return prev - 1; });
    }
  };

  const setNextEnabled = useCallback(function (enabled) {
    setIsNextDisabled(!enabled);
  }, []);

  const updateNavText = useCallback(function (nav) {
    setDynamicNavText(nav);
  }, []);

  const updateQuestionText = useCallback(function (text) {
    setDynamicQuestionText(text);
  }, []);

  const getQuestionText = () => {
    if (dynamicQuestionText !== null && dynamicQuestionText !== undefined) {
      return dynamicQuestionText;
    }
    var stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.questionText : "";
  };

  const getNavText = () => {
    if (dynamicNavText !== null && dynamicNavText !== undefined) {
      return dynamicNavText;
    }
    var stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.navText : "";
  };

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

  if (currentStep === 3) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.finalScreen.heading,
          text: APP_DATA.finalScreen.text,
          buttonText: APP_DATA.finalScreen.buttonText,
          onButtonClick: handleRestart,
        })
      )
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: getQuestionText(),
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        key: String(resetKey) + "-" + String(challengeIndex),
        step: currentStep,
        challengeIndex: challengeIndex,
        onSetNextEnabled: setNextEnabled,
        onUpdateNavText: updateNavText,
        onUpdateQuestionText: updateQuestionText,
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: function (dir) {
          if (dir === "next") handleNext();
          else if (dir === "prev") handlePrev();
        },
        isNextDisabled: isNextDisabled,
        isPrevDisabled: currentStep <= 1,
        navText: getNavText(),
      })
    )
  );
};
