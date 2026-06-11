function getProgress(step, step7QuestionIndex) {

  if (step < 7) return step;

  if (step === 7) return 7 + step7QuestionIndex * 0.001;

  return 8;

}



const App = () => {

  const { useState, useEffect, useCallback, useRef } = React;



  const [currentStep, setCurrentStep] = useState(0);

  const [step7QuestionIndex, setStep7QuestionIndex] = useState(0);

  const [isNextDisabled, setIsNextDisabled] = useState(true);

  const [dynamicNavText, setDynamicNavText] = useState(null);

  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);

  const [resetKey, setResetKey] = useState(0);

  const [startAtFinal, setStartAtFinal] = useState(false);

  const [farthestProgress, setFarthestProgress] = useState(0);
  const [nextNudgeDismissed, setNextNudgeDismissed] = useState(false);

  const fullscreenButtonRef = useRef(null);
  const nextButtonRef = useRef(null);

  const step7QuestionCount = (APP_DATA.steps[7] && APP_DATA.steps[7].questions)

    ? APP_DATA.steps[7].questions.length

    : 0;



  const progressRef = useRef({ step: 0, q7: 0 });

  progressRef.current = { step: currentStep, q7: step7QuestionIndex };



  const isCatchingUp = useCallback(function () {

    return getProgress(currentStep, step7QuestionIndex) < farthestProgress - 1e-6;

  }, [currentStep, step7QuestionIndex, farthestProgress]);



  const handleStart = () => {

    if (typeof playSound === "function") playSound("click");

    setFarthestProgress(1);

    setStartAtFinal(false);

    setCurrentStep(1);

  };



  const handleRestart = () => {

    if (typeof playSound === "function") playSound("click");

    setCurrentStep(0);

    setStep7QuestionIndex(0);

    setFarthestProgress(0);

    setStartAtFinal(false);

    setDynamicNavText(null);

    setDynamicQuestionText(null);

    setIsNextDisabled(true);

    setResetKey(function (prev) { return prev + 1; });

  };



  const handleContinue = () => {

    if (typeof playSound === "function") playSound("click");

    setStartAtFinal(true);

    setCurrentStep(6);

    setFarthestProgress(function (prev) { return Math.max(prev, 6); });

  };



  const setNextEnabled = useCallback(function (enabled) {

    setIsNextDisabled(!enabled);

    if (enabled) {

      var p = progressRef.current;

      var prog = getProgress(p.step, p.q7);

      setFarthestProgress(function (prev) { return Math.max(prev, prog); });

    }

  }, []);



  useEffect(function () {

    setDynamicNavText(null);

    setDynamicQuestionText(null);



    if (startAtFinal) return;



    if (currentStep === 1 || currentStep === 3 || currentStep === 6) {

      setIsNextDisabled(false);

    } else if (currentStep === 2 || currentStep === 4 || currentStep === 7) {

      setIsNextDisabled(true);

    }

  }, [currentStep, step7QuestionIndex, startAtFinal]);

  useEffect(function () {
    setNextNudgeDismissed(false);
  }, [currentStep, step7QuestionIndex, startAtFinal]);

  var currentProgress = getProgress(currentStep, step7QuestionIndex);
  var atFarthestFrontier =
    Math.abs(currentProgress - farthestProgress) < 1e-6;
  var showNextNudge =
    !isNextDisabled &&
    !startAtFinal &&
    currentStep !== 8 &&
    atFarthestFrontier &&
    !nextNudgeDismissed;

  const handleNext = () => {

    if (isNextDisabled) return;

    if (typeof playSound === "function") playSound("click");



    var catchingUp = isCatchingUp();



    if (currentStep === 7 && step7QuestionIndex < step7QuestionCount - 1) {

      var nextQ = step7QuestionIndex + 1;

      setStep7QuestionIndex(nextQ);

      setStartAtFinal(catchingUp);

      setDynamicNavText(null);

      setDynamicQuestionText(null);

      if (!catchingUp) setIsNextDisabled(true);

      return;

    }



    if (currentStep === 7) {

      setStartAtFinal(false);

      setCurrentStep(8);

      setFarthestProgress(function (prev) { return Math.max(prev, 8); });

      return;

    }



    var nextStep = currentStep + 1;

    var useFinal = catchingUp;



    if (nextStep === 1 || nextStep === 3 || nextStep === 6) {

      useFinal = true;

    }



    setStartAtFinal(useFinal);

    setDynamicNavText(null);

    setDynamicQuestionText(null);

    setCurrentStep(nextStep);



    if (!useFinal && (nextStep === 2 || nextStep === 4)) {

      setIsNextDisabled(true);

    } else if (nextStep === 1 || nextStep === 3 || nextStep === 6) {

      setIsNextDisabled(false);

    }

  };



  const handlePrev = () => {

    if (isNextDisabled) return;

    if (typeof playSound === "function") playSound("click");



    setStartAtFinal(true);

    setDynamicNavText(null);

    setDynamicQuestionText(null);



    if (currentStep === 7 && step7QuestionIndex > 0) {

      setStep7QuestionIndex(function (prev) { return prev - 1; });

      return;

    }



    if (currentStep === 7) {

      setCurrentStep(6);

      return;

    }



    if (currentStep === 6) {

      setCurrentStep(5);

      return;

    }



    if (currentStep > 1) {

      setCurrentStep(function (prev) { return prev - 1; });

    }

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



  var mainCanvasKey = resetKey + "-" + currentStep;

  if (currentStep === 7) {

    mainCanvasKey += "-q" + step7QuestionIndex + (startAtFinal ? "-final" : "-initial");

  } else if (startAtFinal) {

    mainCanvasKey += "-final";

  }



  var isPrevDisabled = isNextDisabled || currentStep <= 1 || currentStep === 5;



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

        })

      ),

      React.createElement(Nudge, {
        targetRef: fullscreenButtonRef,
        active: true,
      })

    );

  }



  if (currentStep === 5) {

    return React.createElement(

      "div",

      { className: "applet-container" },

      React.createElement(

        "div",

        { className: "app-main-content", style: { position: "relative" } },

        React.createElement(Fullscreen, {

          heading: APP_DATA.continue.heading,

          text: APP_DATA.continue.text,

          buttonText: APP_DATA.continue.buttonText,

          onButtonClick: handleContinue,

          buttonRef: fullscreenButtonRef,

        })

      ),

      React.createElement(Nudge, {
        targetRef: fullscreenButtonRef,
        active: true,
      })

    );

  }



  if (currentStep === 8) {

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

          buttonRef: fullscreenButtonRef,

        })

      ),

      React.createElement(Nudge, {
        targetRef: fullscreenButtonRef,
        active: true,
      })

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

        key: mainCanvasKey,

        step: currentStep,

        questionIndex: step7QuestionIndex,

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
      onDismiss: function () { setNextNudgeDismissed(true); },
    })

  );

};

