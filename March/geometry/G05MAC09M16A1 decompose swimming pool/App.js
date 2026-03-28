const App = () => {
  const { useState, useEffect, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(1);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const handleRestart = useCallback(() => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
    setIsNextDisabled(false);
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setResetKey(function (prev) {
      return prev + 1;
    });
  }, []);

  useEffect(() => {
    setDynamicNavText(null);
    setDynamicQuestionText(null);
  }, [currentStep]);

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 9) {
      handleRestart();
      return;
    }
    if (currentStep < 9) {
      setCurrentStep(function (prev) {
        return prev + 1;
      });
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep > 1) {
      setResetKey(function (prev) {
        return prev + 1;
      });
      setCurrentStep(function (prev) {
        return prev - 1;
      });
    }
  };

  const setNextEnabled = useCallback(function (enabled) {
    setIsNextDisabled(!enabled);
  }, []);

  const updateTexts = useCallback(function (nav, question) {
    if (nav !== undefined) setDynamicNavText(nav);
    if (question !== undefined) setDynamicQuestionText(question);
  }, []);

  const advanceStep = useCallback(function () {
    setCurrentStep(function (prev) {
      return prev + 1;
    });
  }, []);

  const getQuestionText = () => {
    if (dynamicQuestionText !== null) return dynamicQuestionText;
    var stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.questionText : "";
  };

  const getNavText = () => {
    if (dynamicNavText !== null) return dynamicNavText;
    var stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.navText : "";
  };

  const getNextSymbol = () => {
    if (currentStep === 9) {
      return APP_DATA.steps[9].restartButton;
    }
    return "»";
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
        key: resetKey,
        step: currentStep,
        onSetNextEnabled: setNextEnabled,
        onUpdateTexts: updateTexts,
        onAdvanceStep: advanceStep,
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: function (dir) {
          return dir === "next"
            ? handleNext()
            : dir === "prev"
            ? handlePrev()
            : null;
        },
        isNextDisabled: isNextDisabled,
        isPrevDisabled: currentStep <= 1,
        navText: getNavText(),
        nextSymbol: getNextSymbol(),
      })
    )
  );
};
