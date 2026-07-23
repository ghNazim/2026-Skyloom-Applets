const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const TOTAL_STEPS = APP_DATA.steps.length;
  const MCQ_STEPS = [6, 8, 10];
  const NUMPAD_STEPS = [7, 9, 11];
  const CLICKABLE_STEPS = { B: 5, C: 7, D: 9 };
  const CHECKPOINT_STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const [currentStep, setCurrentStep] = useState(1);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [isPrevDisabled, setIsPrevDisabled] = useState(true);
  const [farthestCompletedStep, setFarthestCompletedStep] = useState(0);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [questionBlink, setQuestionBlink] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [nudgePosition, setNudgePosition] = useState(null);
  const [waitingForAngle, setWaitingForAngle] = useState(null);
  const [mcqStepBusy, setMcqStepBusy] = useState(false);
  const nudgeTargetRef = useRef(null);
  const [checkpointView, setCheckpointView] = useState(null);

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

  const markCheckpointCompleted = useCallback((step) => {
    if (CHECKPOINT_STEPS.indexOf(step) === -1 || step === TOTAL_STEPS) return;
    setFarthestCompletedStep((prev) => Math.max(prev, step));
  }, [TOTAL_STEPS]);

  const registerNudgeTarget = useCallback((rect) => {
    nudgeTargetRef.current = rect;
  }, []);

  const getDefaultNextDisabled = useCallback((step) => {
    if (
      step === 5 ||
      NUMPAD_STEPS.includes(step) ||
      MCQ_STEPS.includes(step)
    ) {
      return true;
    }
    if (step === TOTAL_STEPS) return false;
    return step >= TOTAL_STEPS;
  }, [TOTAL_STEPS]);

  const getPreviousCheckpoint = useCallback((step) => {
    let activeIndex = -1;
    for (let i = CHECKPOINT_STEPS.length - 1; i >= 0; i -= 1) {
      if (CHECKPOINT_STEPS[i] <= step) {
        activeIndex = i;
        break;
      }
    }
    if (activeIndex <= 0) return null;
    return CHECKPOINT_STEPS[activeIndex - 1];
  }, []);

  const getNextCheckpoint = useCallback((step) => {
    const idx = CHECKPOINT_STEPS.indexOf(step);
    if (idx === -1 || idx >= CHECKPOINT_STEPS.length - 1) return null;
    return CHECKPOINT_STEPS[idx + 1];
  }, []);

  const goToCheckpoint = useCallback((step) => {
    hideNudge();
    setQuestionBlink(false);
    setCheckpointView(
      farthestCompletedStep >= step
        ? MCQ_STEPS.includes(step)
          ? { step, mode: "mcq-answered" }
          : NUMPAD_STEPS.includes(step)
            ? { step, mode: "numpad-answered" }
            : null
        : null,
    );
    setCurrentStep(step);
  }, [farthestCompletedStep, hideNudge]);

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

  const currentQuestionText = getQuestionText();
  const currentNavText = getNavText();

  useEffect(() => {
    const isAnsweredCheckpointView =
      checkpointView &&
      checkpointView.step === currentStep;
    setDynamicQuestionText(null);
    setDynamicNavText(null);
    setWaitingForAngle(null);
    setIsNextDisabled(
      isAnsweredCheckpointView ? false : getDefaultNextDisabled(currentStep),
    );
    if (MCQ_STEPS.indexOf(currentStep) === -1) {
      setQuestionBlink(false);
    }
    setIsPrevDisabled(
      currentStep <= 1 ||
      (MCQ_STEPS.includes(currentStep) && mcqStepBusy && !isAnsweredCheckpointView),
    );
  }, [currentStep, checkpointView, TOTAL_STEPS, getDefaultNextDisabled, mcqStepBusy]);

  const handleNext = () => {
    if (isNextDisabled) return;
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    if (currentStep === TOTAL_STEPS) {
      setCheckpointView(null);
      setFarthestCompletedStep(0);
      setDynamicQuestionText(null);
      setDynamicNavText(null);
      setWaitingForAngle(null);
      setMcqStepBusy(false);
      setQuestionBlink(false);
      setCurrentStep(1);
      return;
    }
    if (CHECKPOINT_STEPS.includes(currentStep)) {
      markCheckpointCompleted(currentStep);
      const nextCheckpoint = getNextCheckpoint(currentStep);
      if (nextCheckpoint && nextCheckpoint <= farthestCompletedStep) {
        goToCheckpoint(nextCheckpoint);
        return;
      }
    }
    setCheckpointView(null);
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const handlePrev = () => {
    if (isPrevDisabled) return;
    if (typeof playSound === "function") playSound("click");
    hideNudge();
    const previousCheckpoint = getPreviousCheckpoint(currentStep);
    if (!previousCheckpoint) return;
    goToCheckpoint(previousCheckpoint);
  };

  const handleAngleClick = useCallback(
    (angle) => {
      if (waitingForAngle === angle) {
        if (typeof playSound === "function") playSound("click");
        hideNudge();
        setCheckpointView(null);
        setWaitingForAngle(null);
        if (angle === "C") setCurrentStep(8);
        if (angle === "D") setCurrentStep(10);
        return;
      }
      if (currentStep === 5 && angle === "B") {
        if (typeof playSound === "function") playSound("click");
        hideNudge();
        markCheckpointCompleted(5);
        setCheckpointView(null);
        setCurrentStep(6);
      }
    },
    [currentStep, waitingForAngle, hideNudge, markCheckpointCompleted],
  );

  const handlePostFindReady = useCallback(
    (angle, navText) => {
      if (angle === "C") markCheckpointCompleted(7);
      if (angle === "D") markCheckpointCompleted(9);
      setWaitingForAngle(angle);
      setDynamicNavText(navText);
      if (angle === "C") setDynamicQuestionText(APP_DATA.step7.findAngleC);
      if (angle === "D") setDynamicQuestionText(APP_DATA.step9.findAngleD);
      setIsNextDisabled(true);
    },
    [markCheckpointCompleted],
  );

  const handleAngleNudgeReady = useCallback(() => {
    const rect = nudgeTargetRef.current;
    if (rect) {
      setNudgePosition(rect);
      setShowNudge(true);
    }
  }, []);

  const handleSummariseReady = useCallback(() => {
    markCheckpointCompleted(11);
    setDynamicQuestionText(APP_DATA.step11.angleDFound);
    setDynamicNavText(APP_DATA.step11.navSummarise);
    setIsNextDisabled(false);
  }, [markCheckpointCompleted]);

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
      text: currentQuestionText,
      step: currentStep,
      blink: questionBlink,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas2, {
        step: currentStep,
        clickableAngle: activeClickable,
        currentQuestionText: currentQuestionText,
        currentNavText: currentNavText,
        checkpointViewMode:
          checkpointView && checkpointView.step === currentStep
            ? checkpointView.mode
            : null,
        onMcqStepBusyChange: setMcqStepBusy,
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
        navText: currentNavText,
        nextButtonText: getNextButtonText(),
      }),
    ),
    React.createElement(Nudge, { show: showNudge, position: nudgePosition }),
  );
};
