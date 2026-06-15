const App = () => {

  const { useState, useCallback } = React;

  const NAV_CHECKPOINTS = [1, 6, 7, 8, 9];

  function getPrevCheckpointStep(step) {
    if (step <= 1) return 1;
    const idx = NAV_CHECKPOINTS.indexOf(step);
    if (idx > 0) return NAV_CHECKPOINTS[idx - 1];
    return 1;
  }

  function getNextNavStep(step, farthest) {
    if (step >= 9) return 10;
    if (step === 1) return farthest > 1 ? 6 : 2;
    const idx = NAV_CHECKPOINTS.indexOf(step);
    if (idx >= 0 && idx < NAV_CHECKPOINTS.length - 1) {
      return NAV_CHECKPOINTS[idx + 1];
    }
    return step + 1;
  }

  function getNextNavInitialStage(fromStep, toStep, farthest) {
    if (fromStep === 1 && toStep === 6) return "final";
    if (toStep <= farthest) return "final";
    return "start";
  }

  const [currentStep, setCurrentStep] = useState(0);

  const [isNextDisabled, setIsNextDisabled] = useState(true);

  const [dynamicNavText, setDynamicNavText] = useState(null);

  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);

  const [resetKey, setResetKey] = useState(0);

  const [farthestCompletedStep, setFarthestCompletedStep] = useState(0);

  const [navInitialStage, setNavInitialStage] = useState("start");



  const handleStart = () => {

    if (typeof playSound === "function") playSound("click");

    setDynamicNavText(null);

    setDynamicQuestionText(null);

    setIsNextDisabled(true);

    setFarthestCompletedStep(0);

    setNavInitialStage("start");

    setCurrentStep(1);

  };



  const handleRestart = () => {

    if (typeof playSound === "function") playSound("click");

    setCurrentStep(0);

    setDynamicNavText(null);

    setDynamicQuestionText(null);

    setIsNextDisabled(true);

    setFarthestCompletedStep(0);

    setNavInitialStage("start");

    setResetKey(function (prev) { return prev + 1; });

  };



  const handleNext = () => {

    if (isNextDisabled) return;

    if (typeof playSound === "function") playSound("click");

    setDynamicNavText(null);

    setDynamicQuestionText(null);

    setIsNextDisabled(true);

    const nextStep = getNextNavStep(currentStep, farthestCompletedStep);

    if (nextStep === 10) {

      setCurrentStep(10);

      return;

    }

    setNavInitialStage(getNextNavInitialStage(currentStep, nextStep, farthestCompletedStep));

    setCurrentStep(nextStep);

  };



  const handlePrev = () => {

    if (isNextDisabled || currentStep <= 1) return;

    if (typeof playSound === "function") playSound("click");

    setDynamicNavText(null);

    setDynamicQuestionText(null);

    setIsNextDisabled(true);

    setNavInitialStage("final");

    setCurrentStep(getPrevCheckpointStep(currentStep));

  };



  const setNextEnabled = useCallback(function (enabled) {

    setIsNextDisabled(!enabled);

    if (enabled) {

      setFarthestCompletedStep(function (prev) {

        return Math.max(prev, currentStep);

      });

    }

  }, [currentStep]);



  const updateNavText = useCallback(function (nav) {

    setDynamicNavText(nav);

  }, []);



  const updateQuestionText = useCallback(function (text) {

    setDynamicQuestionText(text);

  }, []);



  const goToStep = useCallback(function (step) {

    setDynamicNavText(null);

    setDynamicQuestionText(null);

    setIsNextDisabled(true);

    setNavInitialStage("start");

    setCurrentStep(step);

  }, []);



  const getQuestionText = () => {

    if (dynamicQuestionText !== null && dynamicQuestionText !== undefined) {

      return dynamicQuestionText;

    }

    const stepData = APP_DATA.steps[currentStep];

    return stepData ? stepData.questionText : "";

  };



  const getNavText = () => {

    if (dynamicNavText !== null && dynamicNavText !== undefined) {

      return dynamicNavText;

    }

    const stepData = APP_DATA.steps[currentStep];

    return stepData ? stepData.navText : "";

  };



  if (currentStep === 0) {

    return React.createElement(

      "div",

      { className: "applet-container" },

      React.createElement(

        "div",

        { className: "app-main-content fullscreen-host" },

        React.createElement(Fullscreen, {

          heading: APP_DATA.start.heading,

          dataset: APP_DATA.dataset,

          stats: APP_DATA.start.stats,

          introLines: APP_DATA.start.introLines,

          buttonText: APP_DATA.start.buttonText,

          onButtonClick: handleStart,

        }),

      ),

    );

  }



  if (currentStep === 10) {

    return React.createElement(

      "div",

      { className: "applet-container" },

      React.createElement(

        "div",

        { className: "app-main-content fullscreen-host" },

        React.createElement(Fullscreen, {

          heading: APP_DATA.completion.heading,

          dataset: APP_DATA.dataset,

          stats: APP_DATA.completion.stats,

          completionText: APP_DATA.completion.text,

          buttonText: APP_DATA.completion.buttonText,

          onButtonClick: handleRestart,

          isCompletion: true,

        }),

      ),

    );

  }



  const showNudges = currentStep >= farthestCompletedStep;



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

        key: resetKey + "-" + currentStep + "-" + navInitialStage,

        step: currentStep,

        initialStage: navInitialStage,

        onSetNextEnabled: setNextEnabled,

        onUpdateNavText: updateNavText,

        onUpdateQuestionText: updateQuestionText,

        onGoToStep: goToStep,

        showNudges: showNudges,

      }),

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

        isPrevDisabled: isNextDisabled || currentStep <= 1,

        navText: getNavText(),

        showNextNudge: showNudges && !isNextDisabled && currentStep === farthestCompletedStep,

      }),

    ),

  );

};

