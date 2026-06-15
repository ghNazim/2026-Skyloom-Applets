const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [startAtFinal, setStartAtFinal] = useState(false);
  const [farthestProgress, setFarthestProgress] = useState(0);
  const [nextNudgeDismissed, setNextNudgeDismissed] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const fullscreenButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const startOverButtonRef = useRef(null);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setFarthestProgress(1);
    setStartAtFinal(false);
    setCurrentStep(1);
  };

  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setStartAtFinal(false);
    setFarthestProgress(0);
    setIsNextDisabled(true);
    setNextNudgeDismissed(false);
    setResetKey(function (k) {
      return k + 1;
    });
    setCurrentStep(0);
  };

  const setNextEnabled = useCallback(function (enabled) {
    setIsNextDisabled(!enabled);
    if (enabled) {
      setFarthestProgress(function (prev) {
        return Math.max(prev, currentStep);
      });
    }
  }, [currentStep]);

  useEffect(function () {
    setDynamicNavText(null);
    setDynamicQuestionText(null);

    if (startAtFinal) {
      setIsNextDisabled(false);
      return;
    }

    setNextNudgeDismissed(false);

    if (currentStep === 1) {
      setIsNextDisabled(false);
    } else if (currentStep >= 2 && currentStep <= 6) {
      setIsNextDisabled(true);
    }
  }, [currentStep, startAtFinal]);

  const prevNextDisabledRef = useRef(true);
  useEffect(function () {
    if (
      prevNextDisabledRef.current &&
      !isNextDisabled &&
      currentStep === farthestProgress
    ) {
      setNextNudgeDismissed(false);
    }
    prevNextDisabledRef.current = isNextDisabled;
  }, [isNextDisabled, currentStep, farthestProgress]);

  const handleNext = () => {
    if (isNextDisabled) return;
    if (typeof playSound === "function") playSound("click");

    var nextStep = currentStep + 1;
    if (nextStep > 7) return;

    var catchingUp = currentStep < farthestProgress;

    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setStartAtFinal(catchingUp);
    setCurrentStep(nextStep);
    setFarthestProgress(function (prev) {
      return Math.max(prev, nextStep);
    });

    if (catchingUp || nextStep === 1) {
      setIsNextDisabled(false);
    } else if (nextStep >= 2 && nextStep <= 6) {
      setIsNextDisabled(true);
    }
  };

  const handlePrev = () => {
    if (isNextDisabled || currentStep <= 1) return;
    if (typeof playSound === "function") playSound("click");

    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setStartAtFinal(true);
    setIsNextDisabled(false);
    setCurrentStep(function (prev) {
      return prev - 1;
    });
  };

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

  var showNextNudge =
    !isNextDisabled &&
    currentStep === farthestProgress &&
    currentStep !== 0 &&
    currentStep !== 7 &&
    !nextNudgeDismissed;
  var showFullscreenNudge = currentStep === 0 && !nextNudgeDismissed;
  var showStartOverNudge = currentStep === 7 && !nextNudgeDismissed;
  var isPrevDisabled = isNextDisabled || currentStep <= 1;

  var endGraphProps = {
    highlightBarIndex: null,
    lowOpacityAll: false,
    highlightXLabels: false,
    feedbackText: null,
    barValueBoxes: [4, 5, 6, 7, 10],
    wrongLineY: null,
    showCorrectLine: false,
    meanValue: APP_DATA.steps[4].meanResult,
    meanLineVisible: true,
    meanDrawProgress: 1,
    meanLabelRef: null,
  };

  var endText = APP_DATA.end.text
    .replace(/<y>/g, '<span class="highlight-y">')
    .replace(/<\/y>/g, "</span>");

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
          buttonRef: fullscreenButtonRef,
          leftGraph: true,
        })
      ),
      React.createElement(Nudge, {
        targetRef: fullscreenButtonRef,
        active: showFullscreenNudge,
        onDismiss: function () {
          setNextNudgeDismissed(true);
        },
      })
    );
  }

  if (currentStep === 7) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.end.heading,
          text: endText,
          buttonText: APP_DATA.end.buttonText,
          onButtonClick: handleStartOver,
          buttonRef: startOverButtonRef,
          leftGraph: true,
          barGraphProps: endGraphProps,
        })
      ),
      React.createElement(Nudge, {
        targetRef: startOverButtonRef,
        active: showStartOverNudge,
        onDismiss: function () {
          setNextNudgeDismissed(true);
        },
      })
    );
  }

  var mainCanvasKey =
    resetKey + "-" + currentStep + (startAtFinal ? "-final" : "-initial");

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
        key: mainCanvasKey,
        step: currentStep,
        startAtFinal: startAtFinal,
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
        isPrevDisabled: isPrevDisabled,
        navText: getNavText(),
        nextButtonRef: nextButtonRef,
      })
    ),
    React.createElement(Nudge, {
      targetRef: nextButtonRef,
      active: showNextNudge,
      onDismiss: function () {
        setNextNudgeDismissed(true);
      },
    })
  );
};
