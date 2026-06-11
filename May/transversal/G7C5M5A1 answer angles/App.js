const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionStates, setQuestionStates] = useState({});
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [isPrevDisabled, setIsPrevDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [showNudge, setShowNudge] = useState(false);
  const [nudgePosition, setNudgePosition] = useState(null);
  const [nextTrigger, setNextTrigger] = useState(0);
  const [prevTrigger, setPrevTrigger] = useState(0);
  const [allQuestionsDone, setAllQuestionsDone] = useState(false);
  const nudgeTimeoutRef = useRef(null);

  const totalQuestions = APP_DATA.questions.length;

  const hideNudge = useCallback(() => {
    setShowNudge(false);
    setNudgePosition(null);
  }, []);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    setQuestionIndex(0);
    setQuestionStates({});
    setAllQuestionsDone(false);
    setIsNextDisabled(true);
    setIsPrevDisabled(true);
    setDynamicNavText(APP_DATA.step1.navText);
    setDynamicQuestionText(APP_DATA.step1.questionText);
    setCurrentStep(1);
  };

  const handleStartOver = () => {
    hideNudge();
    setQuestionIndex(0);
    setQuestionStates({});
    setAllQuestionsDone(false);
    setNextTrigger(0);
    setPrevTrigger(0);
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setIsNextDisabled(true);
    setIsPrevDisabled(true);
    setCurrentStep(0);
  };

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();

    if (currentStep === 1 && allQuestionsDone) {
      hideNudge();
      setCurrentStep(2);
      return;
    }

    if (currentStep === 1) {
      const state = questionStates[questionIndex];
      if (!state || !state.answered) return;

      if (questionIndex < totalQuestions - 1) {
        setQuestionIndex((i) => i + 1);
        setIsNextDisabled(true);
        setIsPrevDisabled(false);
      }
    }
    setNextTrigger((p) => p + 1);
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    hideNudge();

    if (currentStep === 1 && questionIndex > 0) {
      setQuestionIndex((i) => i - 1);
      setIsPrevDisabled(questionIndex - 1 <= 0);
      const prevState = questionStates[questionIndex - 1];
      setIsNextDisabled(!(prevState && prevState.answered));
    }
    setPrevTrigger((p) => p + 1);
  };

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const updateTexts = useCallback((nav, question) => {
    if (nav !== undefined) setDynamicNavText(nav);
    if (question !== undefined) setDynamicQuestionText(question);
  }, []);

  const saveQuestionState = useCallback((index, state) => {
    setQuestionStates((prev) => ({ ...prev, [index]: state }));
  }, []);

  const handleAllQuestionsDone = useCallback(() => {
    setAllQuestionsDone(true);
  }, []);

  const getNavText = () => {
    if (dynamicNavText !== null && dynamicNavText !== undefined)
      return dynamicNavText;
    return "";
  };

  const getQuestionText = () => {
    if (dynamicQuestionText !== null && dynamicQuestionText !== undefined)
      return dynamicQuestionText;
    return "";
  };

  useEffect(() => {
    if (currentStep === 0) {
      setDynamicNavText(null);
      setDynamicQuestionText(null);
    }
  }, [currentStep]);

  useEffect(() => {
    if (nudgeTimeoutRef.current) clearTimeout(nudgeTimeoutRef.current);
    if (currentStep !== 0) return;
    nudgeTimeoutRef.current = setTimeout(() => {
      const el = document.querySelector(".fullscreen-button");
      if (el) {
        setNudgePosition(el.getBoundingClientRect());
        setShowNudge(true);
      }
    }, 500);
    return () => {
      if (nudgeTimeoutRef.current) clearTimeout(nudgeTimeoutRef.current);
    };
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 0 || currentStep === 2) return;
    if (isNextDisabled) {
      hideNudge();
      return;
    }
    const update = () => {
      const btn = document.getElementById("next-button");
      if (btn) {
        setNudgePosition(btn.getBoundingClientRect());
        setShowNudge(true);
      }
    };
    const tid = setTimeout(update, 100);
    window.addEventListener("resize", update);
    return () => {
      clearTimeout(tid);
      window.removeEventListener("resize", update);
    };
  }, [currentStep, isNextDisabled, dynamicNavText, hideNudge, questionIndex]);

  useEffect(() => {
    if (currentStep === 2) hideNudge();
  }, [currentStep, hideNudge]);

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
      React.createElement(Nudge, { show: showNudge, position: nudgePosition }),
    );
  }

  if (currentStep === 2) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.end.heading,
          text: APP_DATA.end.text,
          buttonText: APP_DATA.end.buttonText,
          onButtonClick: handleStartOver,
        }),
      ),
    );
  }

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
        questionIndex: questionIndex,
        questionStates: questionStates,
        onSaveQuestionState: saveQuestionState,
        onSetNextEnabled: setNextEnabled,
        onUpdateTexts: updateTexts,
        onAllQuestionsDone: handleAllQuestionsDone,
        nextTrigger: nextTrigger,
        prevTrigger: prevTrigger,
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => {
          if (dir === "next") handleNext();
          if (dir === "prev") handlePrev();
        },
        isNextDisabled: isNextDisabled,
        isPrevDisabled: isPrevDisabled,
        hidePrev: false,
        navText: getNavText(),
      }),
    ),
    React.createElement(Nudge, { show: showNudge, position: nudgePosition }),
  );
};
