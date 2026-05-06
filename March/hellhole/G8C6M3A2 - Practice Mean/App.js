const App = () => {
  const { useState, useCallback } = React;

  const questionCount = APP_DATA.questions.length;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const isFullscreenStep = currentStep === 0 || currentStep === 4;

  const stepsForQuestion = (qi) =>
    APP_DATA.questions[qi] && APP_DATA.questions[qi].steps
      ? APP_DATA.questions[qi].steps
      : {};

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentQuestionIndex(0);
    setCurrentStep(1);
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentQuestionIndex(0);
    setCurrentStep(0);
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setIsNextDisabled(true);
    setResetKey((prev) => prev + 1);
  };

  const handleNext = () => {
    if (isNextDisabled) return;
    if (typeof playSound === "function") playSound("click");
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
      return;
    }
    if (currentQuestionIndex < questionCount - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setCurrentStep(1);
      setResetKey((k) => k + 1);
      return;
    }
    setCurrentStep(4);
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 4) {
      setCurrentStep(3);
      return;
    }
    if (currentStep === 3) {
      setCurrentStep(2);
      return;
    }
    if (currentStep === 2) {
      setCurrentStep(1);
      return;
    }
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setCurrentStep(1);
      setResetKey((k) => k + 1);
    }
  };

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const updateNavText = useCallback((nav) => {
    setDynamicNavText(nav);
  }, []);
  const updateQuestionText = useCallback((text) => {
    setDynamicQuestionText(text);
  }, []);

  const getQuestionText = () => {
    if (dynamicQuestionText !== null && dynamicQuestionText !== undefined) {
      return dynamicQuestionText;
    }
    const stepData = stepsForQuestion(currentQuestionIndex)[currentStep];
    return stepData ? stepData.questionText : "";
  };

  const getNavText = () => {
    if (dynamicNavText !== null && dynamicNavText !== undefined) {
      return dynamicNavText;
    }
    const stepData = stepsForQuestion(currentQuestionIndex)[currentStep];
    return stepData ? stepData.navText : "";
  };

  if (currentStep === 0) {
    const formulaHtml =
      typeof renderFractionHTML === "function"
        ? "<span class='formula-equation'>" +
          "Mean (<span class='x-overline'>x</span>) = " +
          renderFractionHTML(
            "Sum of all values",
            "Number of data values",
          ) +
          " = " +
          renderFractionHTML(
            "x<sub>1</sub> + x<sub>2</sub> + &ctdot; + x<sub>n</sub>",
            "n",
          ) +
          "</span>"
        : "";

    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.start.heading,
          topText: APP_DATA.start.textTop,
          formulaPrefix: "",
          formulaHtml: formulaHtml,
          bottomText: APP_DATA.start.textBottom,
          buttonText: APP_DATA.start.buttonText,
          onButtonClick: handleStart,
        }),
      ),
    );
  }

  if (currentStep === 4) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.end.heading,
          topText: APP_DATA.end.textTop,
          bottomText: APP_DATA.end.textBottom,
          buttonText: APP_DATA.end.buttonText,
          onButtonClick: handleRestart,
        }),
      ),
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    !isFullscreenStep &&
      React.createElement(QuestionPanel, {
        text: getQuestionText(),
      }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        key: resetKey + "-" + currentQuestionIndex,
        step: currentStep,
        questionIndex: currentQuestionIndex,
        questionCount: questionCount,
        onSetNextEnabled: setNextEnabled,
        onUpdateNavText: updateNavText,
        onUpdateQuestionText: updateQuestionText,
      }),
    ),
    !isFullscreenStep &&
      React.createElement(
        "div",
        { className: "lower-panel" },
        React.createElement(Navigation, {
          onNav: (dir) =>
            dir === "next"
              ? handleNext()
              : dir === "prev"
                ? handlePrev()
                : null,
          isNextDisabled: isNextDisabled,
          isPrevDisabled:
            currentQuestionIndex <= 0 && currentStep <= 1,
          navText: getNavText(),
        }),
      ),
  );
};
