const App = () => {
  const { useState, useEffect, useCallback, useRef, useMemo } = React;

  const initialState = getInitialAppState(INITIAL_STEP);
  // To jump to a step for testing, set INITIAL_STEP in transformConfig.js (not here).

  const [currentStep, setCurrentStep] = useState(initialState.currentStep);

  const [showGray, setShowGray] = useState(initialState.showGray);
  const [animProgress, setAnimProgress] = useState(initialState.animProgress);
  const [animationDone, setAnimationDone] = useState(initialState.animationDone);
  const [mcqUnlocked, setMcqUnlocked] = useState(initialState.mcqUnlocked);
  const [showReplay, setShowReplay] = useState(initialState.showReplay);
  const [isAnimating, setIsAnimating] = useState(initialState.isAnimating);

  const [mcqSelectedIndex, setMcqSelectedIndex] = useState(
    initialState.mcqSelectedIndex,
  );
  const [mcqResultState, setMcqResultState] = useState(
    initialState.mcqResultState,
  );
  const [mcqShowFeedback, setMcqShowFeedback] = useState(
    initialState.mcqShowFeedback,
  );
  const [mcqFeedbackText, setMcqFeedbackText] = useState(
    initialState.mcqFeedbackText,
  );
  const [mcqFeedbackType, setMcqFeedbackType] = useState(
    initialState.mcqFeedbackType,
  );
  const [mcqAnsweredCorrectly, setMcqAnsweredCorrectly] = useState(
    initialState.mcqAnsweredCorrectly,
  );

  const [dndPlacements, setDndPlacements] = useState(
    initialState.dndPlacements,
  );
  const [dndSourceItems, setDndSourceItems] = useState(
    initialState.dndSourceItems,
  );
  const [dndWrongItemId, setDndWrongItemId] = useState(
    initialState.dndWrongItemId,
  );
  const [dndWrongZone, setDndWrongZone] = useState(initialState.dndWrongZone);

  const [nudgePositions, setNudgePositions] = useState([]);
  const cancelRef = useRef(null);
  const mcqTimeoutRef = useRef(null);

  const currentStepData = APP_DATA.steps[currentStep] || {};

  const cancelAnimations = useCallback(() => {
    if (typeof cancelRef.current === "function") {
      cancelRef.current();
      cancelRef.current = null;
    }
  }, []);

  const resetMcqState = useCallback(() => {
    if (mcqTimeoutRef.current) {
      clearTimeout(mcqTimeoutRef.current);
      mcqTimeoutRef.current = null;
    }
    setMcqSelectedIndex(null);
    setMcqResultState(null);
    setMcqShowFeedback(false);
    setMcqFeedbackText("");
    setMcqFeedbackType(null);
    setMcqAnsweredCorrectly(false);
  }, []);

  const resetAnimationState = useCallback(() => {
    cancelAnimations();
    setShowGray(true);
    setAnimProgress(0);
    setAnimationDone(false);
    setMcqUnlocked(false);
    setShowReplay(false);
    setIsAnimating(false);
  }, [cancelAnimations]);

  const restoreAnimationComplete = useCallback(() => {
    cancelAnimations();
    setShowGray(true);
    setAnimProgress(1);
    setAnimationDone(true);
    setMcqUnlocked(true);
    setShowReplay(true);
    setIsAnimating(false);
  }, [cancelAnimations]);

  const resetDndState = useCallback((forStep) => {
    const step = forStep !== undefined ? forStep : 2;
    setDndPlacements(getEmptyPlacements(step));
    setDndSourceItems([...getDndSourceIds(step)]);
    setDndWrongItemId(null);
    setDndWrongZone(null);
  }, []);

  const resetEverything = useCallback(() => {
    cancelAnimations();
    resetMcqState();
    resetAnimationState();
    resetDndState(2);
    setCurrentStep(0);
  }, [cancelAnimations, resetMcqState, resetAnimationState, resetDndState]);

  const runGraphAnimation = useCallback(
    (options) => {
      const unlockMcq = options && options.unlockMcq;
      const enableReplay = options && options.enableReplay;

      cancelAnimations();
      setIsAnimating(true);
      setShowGray(true);
      setAnimProgress(0);
      setAnimationDone(false);
      if (!unlockMcq) setMcqUnlocked(false);
      setShowReplay(false);

      const cleanups = [];
      cleanups.push(
        delay(ANIM_INITIAL_PAUSE, () => {
          cleanups.push(
            animateValue(0, 1, ANIM_DURATION, setAnimProgress, () => {
              setIsAnimating(false);
              setAnimationDone(true);
              if (unlockMcq) setMcqUnlocked(true);
              if (enableReplay) setShowReplay(true);
            }),
          );
        }),
      );

      cancelRef.current = () => cleanups.forEach((fn) => fn());
    },
    [cancelAnimations],
  );

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    resetMcqState();
    resetAnimationState();
    resetDndState(2);
    setCurrentStep(1);
    setTimeout(
      () => runGraphAnimation({ unlockMcq: true, enableReplay: true }),
      0,
    );
  };

  const handleReplay = () => {
    if (typeof playSound === "function") playSound("click");
    if (isAnimating) return;
    runGraphAnimation({ unlockMcq: true, enableReplay: true });
  };

  const handleMcqSelect = useCallback(
    (index) => {
      if (mcqResultState !== null || !mcqUnlocked || !isMcqStep(currentStep)) return;

      const stepData = APP_DATA.steps[currentStep];
      const correctIndex = stepData.options.indexOf(stepData.ans);
      const isCorrect = index === correctIndex;

      setMcqSelectedIndex(index);
      setMcqResultState(isCorrect ? "correct" : "wrong");

      if (isCorrect) {
        if (typeof playSound === "function") playSound("correct");
        setMcqFeedbackText(stepData.correctFeedback);
        setMcqFeedbackType("correct");
      } else {
        if (typeof playSound === "function") playSound("wrong");
        setMcqFeedbackText(stepData.wrongFeedback);
        setMcqFeedbackType("wrong");
      }

      mcqTimeoutRef.current = setTimeout(() => {
        setMcqShowFeedback(true);
        if (isCorrect) {
          setMcqAnsweredCorrectly(true);
        }
        mcqTimeoutRef.current = null;
      }, MCQ_RESULT_DELAY);
    },
    [mcqResultState, mcqUnlocked, currentStep],
  );

  const handleDndDrop = useCallback(
    (itemId, zoneId) => {
      if (dndWrongItemId) return;
      if (!dndSourceItems.includes(itemId)) return;
      if (
        isLabelStep(currentStep) &&
        (dndPlacements[zoneId] || []).length > 0
      ) {
        return;
      }

      const dndMap = getDndCorrectMap(currentStep);
      const expectedZone = dndMap[itemId];
      const isCorrect = expectedZone === zoneId;
      const sourceOrder = getDndSourceIds(currentStep);

      if (isCorrect) {
        if (typeof playSound === "function") playSound("correct");
        setDndSourceItems((prev) => prev.filter((id) => id !== itemId));
        setDndPlacements((prev) => ({
          ...prev,
          [zoneId]: [...prev[zoneId], itemId],
        }));
        return;
      }

      if (typeof playSound === "function") playSound("wrong");
      setDndSourceItems((prev) => prev.filter((id) => id !== itemId));
      setDndWrongItemId(itemId);
      setDndWrongZone(zoneId);

      setTimeout(() => {
        setDndWrongItemId(null);
        setDndWrongZone(null);
        setDndSourceItems((prev) => {
          const combined = [...prev, itemId];
          return sourceOrder.filter((id) => combined.includes(id));
        });
      }, DND_WRONG_RETURN_DELAY);
    },
    [dndWrongItemId, dndSourceItems, dndPlacements, currentStep],
  );

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (isMcqStep(currentStep) && mcqAnsweredCorrectly) {
      resetMcqState();
      resetDndState(currentStep + 1);
      setCurrentStep(currentStep + 1);
      return;
    }
    if (isDndStep(currentStep) && allDndComplete) {
      resetMcqState();
      const nextStep = currentStep + 1;
      resetDndState(nextStep);
      setCurrentStep(nextStep);
      if (nextStep === LABEL_STEP) {
        resetAnimationState();
        setTimeout(() => runGraphAnimation({}), 0);
      } else if (isMcqStep(nextStep)) {
        resetAnimationState();
        setTimeout(
          () => runGraphAnimation({ unlockMcq: true, enableReplay: true }),
          0,
        );
      }
      return;
    }
    if (isLabelStep(currentStep) && allDndComplete) {
      resetMcqState();
      resetDndState(TRANSFORMATION_DND_STEP);
      setCurrentStep(TRANSFORMATION_DND_STEP);
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (isMcqStep(currentStep) && mcqShowFeedback && mcqResultState === "wrong") {
      resetMcqState();
      return;
    }
    if (isLabelStep(currentStep)) {
      resetMcqState();
      resetDndState(8);
      setCurrentStep(8);
      return;
    }
    if (isTransformationDndStep(currentStep)) {
      resetMcqState();
      resetDndState(LABEL_STEP);
      cancelAnimations();
      setShowGray(true);
      setAnimProgress(1);
      setAnimationDone(true);
      setMcqUnlocked(false);
      setShowReplay(false);
      setIsAnimating(false);
      setCurrentStep(LABEL_STEP);
      return;
    }
    if (isDndStep(currentStep)) {
      resetMcqState();
      resetDndState(currentStep - 1);
      restoreAnimationComplete();
      setCurrentStep(currentStep - 1);
    }
  };

  const allDndComplete = dndSourceItems.length === 0;

  const questionText = useMemo(() => {
    if (isMcqStep(currentStep)) return APP_DATA.mcqQuestion;
    if (
      isDndStep(currentStep) ||
      isLabelStep(currentStep) ||
      isTransformationDndStep(currentStep)
    ) {
      return currentStepData.questionText || "";
    }
    return "";
  }, [currentStep, currentStepData]);

  const navText = useMemo(() => {
    if (isMcqStep(currentStep)) {
      if (!mcqUnlocked) return "";
      if (mcqShowFeedback && mcqResultState === "wrong") {
        return handleComma(currentStepData.navTextRetry);
      }
      if (mcqAnsweredCorrectly) {
        return handleComma(currentStepData.navTextNext);
      }
      return handleComma(currentStepData.navText);
    }
    if (isLabelStep(currentStep)) {
      if (!animationDone) return "";
      if (allDndComplete) {
        return handleComma(currentStepData.navTextNext);
      }
      return handleComma(currentStepData.navText);
    }
    if (isDndStep(currentStep) || isTransformationDndStep(currentStep)) {
      if (isTransformationDndStep(currentStep) && allDndComplete) return "";
      if (allDndComplete && currentStepData.navTextNext) {
        return handleComma(currentStepData.navTextNext);
      }
      return handleComma(currentStepData.navText);
    }
    return "";
  }, [
    currentStep,
    currentStepData,
    mcqUnlocked,
    mcqShowFeedback,
    mcqResultState,
    mcqAnsweredCorrectly,
    animationDone,
    allDndComplete,
  ]);

  const isNextDisabled = useMemo(() => {
    if (isMcqStep(currentStep)) return !mcqAnsweredCorrectly;
    if (isLabelStep(currentStep)) return !allDndComplete;
    if (isDndStep(currentStep)) return !allDndComplete;
    if (isTransformationDndStep(currentStep)) return true;
    return true;
  }, [currentStep, mcqAnsweredCorrectly, allDndComplete]);

  const isPrevDisabled = useMemo(() => {
    if (isMcqStep(currentStep)) {
      if (mcqShowFeedback && mcqResultState === "wrong") return false;
      return true;
    }
    if (
      isDndStep(currentStep) ||
      isLabelStep(currentStep) ||
      isTransformationDndStep(currentStep)
    ) {
      return false;
    }
    return true;
  }, [currentStep, mcqShowFeedback, mcqResultState]);

  const showStartOver = isTransformationDndStep(currentStep) && allDndComplete;

  useEffect(() => {
    const updateNudges = () => {
      const positions = [];
      const addNudgeFor = (id) => {
        const el = document.getElementById(id);
        if (el && !el.disabled) {
          positions.push(el.getBoundingClientRect());
        }
      };

      if (currentStep === 0) {
        addNudgeFor("start-button");
      } else if (showStartOver) {
        addNudgeFor("start-over-button");
      } else if (!isNextDisabled) {
        addNudgeFor("next-button");
      }

      setNudgePositions(positions);
    };

    const timeoutId = setTimeout(updateNudges, 0);
    window.addEventListener("resize", updateNudges);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateNudges);
    };
  }, [currentStep, isNextDisabled, showStartOver]);

  useEffect(() => {
    if (!shouldAutoRunAnimationOnMount(INITIAL_STEP)) return undefined;
    const timeoutId = setTimeout(() => {
      if (isMcqStep(INITIAL_STEP)) {
        runGraphAnimation({ unlockMcq: true, enableReplay: true });
      } else if (isLabelStep(INITIAL_STEP)) {
        runGraphAnimation({});
      }
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [runGraphAnimation]);

  useEffect(
    () => () => {
      cancelAnimations();
      if (mcqTimeoutRef.current) clearTimeout(mcqTimeoutRef.current);
    },
    [cancelAnimations],
  );

  const renderNudges = () =>
    nudgePositions.map((position, index) =>
      React.createElement(Nudge, {
        key: index,
        show: true,
        position: position,
      }),
    );

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
          buttonId: "start-button",
        }),
      ),
      renderNudges(),
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: questionText,
      step: currentStep,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        step: currentStep,
        showGray: showGray,
        animProgress: animProgress,
        showReplay: showReplay,
        onReplay: handleReplay,
        mcqOptions: isMcqStep(currentStep) ? currentStepData.options : [],
        mcqSelectedIndex: mcqSelectedIndex,
        mcqResultState: mcqResultState,
        mcqShowFeedback: mcqShowFeedback,
        mcqFeedbackText: mcqFeedbackText,
        mcqFeedbackType: mcqFeedbackType,
        mcqDisabled: !mcqUnlocked || mcqResultState !== null,
        showMcqOptions: mcqUnlocked,
        onMcqSelect: handleMcqSelect,
        dndPlacements: dndPlacements,
        dndSourceItems: dndSourceItems,
        dndWrongItemId: dndWrongItemId,
        dndWrongZone: dndWrongZone,
        dndReady: animationDone,
        onDndDrop: handleDndDrop,
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      showStartOver
        ? React.createElement(
            "button",
            {
              type: "button",
              className: "btn applet-start-over-btn",
              id: "start-over-button",
              onClick: resetEverything,
            },
            APP_DATA.startOver,
          )
        : React.createElement(Navigation, {
            onNav: (dir) =>
              dir === "next" ? handleNext() : dir === "prev" ? handlePrev() : null,
            isNextDisabled: isNextDisabled,
            isPrevDisabled: isPrevDisabled,
            navText: navText,
          }),
    ),
    renderNudges(),
  );
};
