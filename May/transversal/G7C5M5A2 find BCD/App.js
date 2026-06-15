const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const TOTAL_STEPS = APP_DATA.steps.length;
  const MCQ_STEPS = [6, 8, 10];
  const NUMPAD_STEPS = [7, 9, 11];
  const CLICKABLE_STEPS = { B: 5, C: 7, D: 9 };

  const [currentStep, setCurrentStep] = useState(1);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [isPrevDisabled, setIsPrevDisabled] = useState(true);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [questionBlink, setQuestionBlink] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [nudgePosition, setNudgePosition] = useState(null);
  const [waitingForAngle, setWaitingForAngle] = useState(null);
  const nudgeTargetRef = useRef(null);

  const stepData = APP_DATA.steps[currentStep - 1];

  const hideNudge = useCallback(() => {
    setShowNudge(false);
    setNudgePosition(null);
  }, []);

  const updateTexts = useCallback((question, nav) => {
    if (question !== undefined) setDynamicQuestionText(question);
    if (nav !== undefined) setDynamicNavText(nav);
  }, []);

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const registerNudgeTarget = useCallback((rect) => {
    nudgeTargetRef.current = rect;
  }, []);

  const getQuestionText = () => {
    if (dynamicQuestionText !== null) return dynamicQuestionText;
    return stepData.questionText;
  };

  const getNavText = () => {
    if (dynamicNavText !== null) return dynamicNavText;
    return stepData.navText;
  };

  const getNextButtonText = () => {
    if (currentStep === TOTAL_STEPS) return APP_DATA.startOverText;
    return "\u00BB";
  };

  useEffect(() => {
    setDynamicQuestionText(null);
    setDynamicNavText(null);
    if (MCQ_STEPS.indexOf(currentStep) === -1) {
      setQuestionBlink(false);
    }
    setIsPrevDisabled(currentStep <= 1);
    setWaitingForAngle(null);

    if (
      currentStep === 5 ||
      NUMPAD_STEPS.includes(currentStep) ||
      MCQ_STEPS.includes(currentStep)
    ) {
      setIsNextDisabled(true);
    } else if (currentStep === TOTAL_STEPS) {
      setIsNextDisabled(false);
    } else {
      setIsNextDisabled(currentStep >= TOTAL_STEPS);
    }
  }, [currentStep, TOTAL_STEPS]);

  const handleNext = () => {
    if (isNextDisabled) return;
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    if (currentStep === TOTAL_STEPS) {
      setCurrentStep(1);
      return;
    }
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const handlePrev = () => {
    if (isPrevDisabled) return;
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    setWaitingForAngle(null);
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const handleAngleClick = useCallback(
    (angle) => {
      if (waitingForAngle === angle) {
        if (typeof playSound === "function") playSound("click");
        hideNudge();
        setWaitingForAngle(null);
        if (angle === "C") setCurrentStep(8);
        if (angle === "D") setCurrentStep(10);
        return;
      }
      if (currentStep === 5 && angle === "B") {
        if (typeof playSound === "function") playSound("click");
        hideNudge();
        setCurrentStep(6);
      }
    },
    [currentStep, waitingForAngle, hideNudge],
  );

  const handlePostFindReady = useCallback(
    (angle, navText) => {
      setWaitingForAngle(angle);
      setDynamicNavText(navText);
      if (angle === "C") setDynamicQuestionText(APP_DATA.step7.findAngleC);
      if (angle === "D") setDynamicQuestionText(APP_DATA.step9.findAngleD);
      setIsNextDisabled(true);
    },
    [],
  );

  const handleAngleNudgeReady = useCallback(() => {
    const rect = nudgeTargetRef.current;
    if (rect) {
      setNudgePosition(rect);
      setShowNudge(true);
    }
  }, []);

  const handleSummariseReady = useCallback(() => {
    setDynamicQuestionText(APP_DATA.step11.angleDFound);
    setDynamicNavText(APP_DATA.step11.navSummarise);
    setIsNextDisabled(false);
  }, []);

  const activeClickable =
    waitingForAngle ||
    (currentStep === CLICKABLE_STEPS.B ? "B" : null);

  useEffect(() => {
    if (!activeClickable) {
      if (currentStep !== 6 && currentStep !== 8 && currentStep !== 10) {
        hideNudge();
      }
      return;
    }
    if (activeClickable === "C" || activeClickable === "D") {
      hideNudge();
      return;
    }
    hideNudge();
    const update = () => {
      const rect = nudgeTargetRef.current;
      if (rect) {
        setNudgePosition(rect);
        setShowNudge(true);
      }
    };
    const tid = setTimeout(update, 200);
    window.addEventListener("resize", update);
    return () => {
      clearTimeout(tid);
      window.removeEventListener("resize", update);
    };
  }, [currentStep, activeClickable, hideNudge, waitingForAngle]);

  useEffect(() => {
    if (currentStep === 12 || waitingForAngle) return;
    if (NUMPAD_STEPS.includes(currentStep) || currentStep === 5) return;
    if (MCQ_STEPS.includes(currentStep)) {
      if (!isNextDisabled) {
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
      }
      return;
    }
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
  }, [
    currentStep,
    isNextDisabled,
    hideNudge,
    dynamicNavText,
    waitingForAngle,
  ]);

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: getQuestionText(),
      step: currentStep,
      blink: questionBlink,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas2, {
        step: currentStep,
        clickableAngle: activeClickable,
        onQuestionBlink: setQuestionBlink,
        onUpdateTexts: updateTexts,
        onSetNextEnabled: setNextEnabled,
        onAngleClick: handleAngleClick,
        onRegisterNudgeTarget: registerNudgeTarget,
        onPostFindReady: handlePostFindReady,
        onAngleNudgeReady: handleAngleNudgeReady,
        onSummariseReady: handleSummariseReady,
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
        nextButtonText: getNextButtonText(),
      }),
    ),
    React.createElement(Nudge, { show: showNudge, position: nudgePosition }),
  );
};
