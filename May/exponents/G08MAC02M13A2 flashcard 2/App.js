var App = function () {
  var useState = React.useState;
  var useCallback = React.useCallback;

  var _step = useState(0);
  var currentStep = _step[0];
  var setCurrentStep = _step[1];

  var _nextDisabled = useState(true);
  var isNextDisabled = _nextDisabled[0];
  var setIsNextDisabled = _nextDisabled[1];

  var _navText = useState("");
  var navText = _navText[0];
  var setNavText = _navText[1];

  var _feedbackType = useState("neutral");
  var navFeedbackType = _feedbackType[0];
  var setNavFeedbackType = _feedbackType[1];

  var _allComplete = useState(false);
  var allComplete = _allComplete[0];
  var setAllComplete = _allComplete[1];

  var _resetKey = useState(0);
  var resetKey = _resetKey[0];
  var setResetKey = _resetKey[1];

  var _navNudge = useState(false);
  var navNudgeVisible = _navNudge[0];
  var setNavNudgeVisible = _navNudge[1];

  var handleStart = function () {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
    setIsNextDisabled(true);
    setNavText(APP_DATA.steps[1].navText);
    setNavFeedbackType("neutral");
    setAllComplete(false);
  };

  var handleRestart = function () {
    setCurrentStep(0);
    setIsNextDisabled(true);
    setNavText("");
    setNavFeedbackType("neutral");
    setAllComplete(false);
    setResetKey(function (prev) {
      return prev + 1;
    });
  };

  var handleButtonClick = function () {
    if (typeof playSound === "function") playSound("click");
    setNavNudgeVisible(false);
    if (allComplete) {
      handleRestart();
    } else {
      if (window.__cardDeckNext) {
        window.__cardDeckNext();
      }
    }
  };

  var setNextEnabled = useCallback(function (enabled) {
    setIsNextDisabled(!enabled);
    if (enabled) {
      setNavNudgeVisible(true);
    } else {
      setNavNudgeVisible(false);
    }
  }, []);

  var updateNav = useCallback(function (text, feedbackType) {
    setNavText(text);
    setNavFeedbackType(feedbackType || "neutral");
  }, []);

  var onAllComplete = useCallback(function () {
    setAllComplete(true);
    setNavNudgeVisible(false);
  }, []);

  var getButtonText = function () {
    if (allComplete) return APP_DATA.buttons.startOver;
    return APP_DATA.buttons.nextQuestion;
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
        }),
      ),
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: APP_DATA.steps[1].questionText,
      step: currentStep,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        key: resetKey,
        step: currentStep,
        onSetNextEnabled: setNextEnabled,
        onUpdateNav: updateNav,
        onAllComplete: onAllComplete,
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        buttonText: getButtonText(),
        onButtonClick: handleButtonClick,
        isButtonDisabled: isNextDisabled,
        navText: navText,
        navFeedbackType: navFeedbackType,
        showNudge: navNudgeVisible,
      }),
    ),
  );
};
