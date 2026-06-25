const App = () => {
  const { useState, useEffect, useCallback, useRef, useMemo } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [mcqWrongIndices, setMcqWrongIndices] = useState([]);
  const [mcqAnswered, setMcqAnswered] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackType, setFeedbackType] = useState(null);
  const [showPathFeedback, setShowPathFeedback] = useState(false);
  const [showClockwiseArrow, setShowClockwiseArrow] = useState(false);
  const [arrowDrawProgress, setArrowDrawProgress] = useState(0);
  const [nudgePositions, setNudgePositions] = useState([]);

  const [step4Direction, setStep4Direction] = useState(null);
  const [step4Angle, setStep4Angle] = useState(0);
  const [step4SliderTouched, setStep4SliderTouched] = useState(false);
  const [step4ShowFeedback, setStep4ShowFeedback] = useState(false);
  const [step4FeedbackText, setStep4FeedbackText] = useState("");
  const [step4FeedbackType, setStep4FeedbackType] = useState(null);
  const [step4Answered, setStep4Answered] = useState(false);
  const [step4HasWrong, setStep4HasWrong] = useState(false);
  const [carAngle, setCarAngle] = useState(CAR_START_ANGLE);
  const [showDanger, setShowDanger] = useState(false);
  const [showCrashEffect, setShowCrashEffect] = useState(false);
  const [step4Animating, setStep4Animating] = useState(false);

  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const arrowRafRef = useRef(null);
  const arrowStartRef = useRef(null);
  const carAnimCancelRef = useRef(null);
  const stepRef = useRef(currentStep);
  stepRef.current = currentStep;

  const activeMcq = useMemo(() => {
    if (currentStep >= 1 && currentStep <= 3) {
      return APP_DATA.mcq[currentStep];
    }
    return null;
  }, [currentStep]);

  const correctIndex = useMemo(() => {
    if (!activeMcq) return -1;
    return activeMcq.options.indexOf(activeMcq.ans);
  }, [activeMcq]);

  const resetMcqState = useCallback(() => {
    setMcqWrongIndices([]);
    setMcqAnswered(false);
    setFeedbackText("");
    setFeedbackType(null);
    setShowPathFeedback(false);
    setShowClockwiseArrow(false);
    setArrowDrawProgress(0);
  }, []);

  const resetStep4State = useCallback(() => {
    if (typeof carAnimCancelRef.current === "function") {
      carAnimCancelRef.current();
      carAnimCancelRef.current = null;
    }
    setStep4Direction(null);
    setStep4Angle(0);
    setStep4SliderTouched(false);
    setStep4ShowFeedback(false);
    setStep4FeedbackText("");
    setStep4FeedbackType(null);
    setStep4Answered(false);
    setStep4HasWrong(false);
    setCarAngle(CAR_START_ANGLE);
    setShowDanger(false);
    setShowCrashEffect(false);
    setStep4Animating(false);
  }, []);

  const resetEverything = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (arrowRafRef.current) cancelAnimationFrame(arrowRafRef.current);
    rafRef.current = null;
    arrowRafRef.current = null;
    startTimeRef.current = null;
    arrowStartRef.current = null;
    setCurrentStep(0);
    setRotationAngle(0);
    resetMcqState();
    resetStep4State();
  }, [resetMcqState, resetStep4State]);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    resetMcqState();
    resetStep4State();
    setCurrentStep(1);
  };

  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    resetEverything();
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep <= 1) {
      resetEverything();
      return;
    }
    if (currentStep === 4) {
      resetStep4State();
    } else {
      resetMcqState();
    }
    setCurrentStep(currentStep - 1);
  };

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep >= 1 && currentStep <= 2) {
      resetMcqState();
      setCurrentStep(currentStep + 1);
      return;
    }
    if (currentStep === 3) {
      resetMcqState();
      resetStep4State();
      setCurrentStep(4);
      return;
    }
    if (currentStep === 4 && step4Answered) {
      setCurrentStep(5);
    }
  };

  const handleMcqSelect = useCallback(
    (index) => {
      const step = stepRef.current;
      const mcq = APP_DATA.mcq[step];
      if (!mcq || mcqAnswered) return;

      const isCorrect = index === mcq.options.indexOf(mcq.ans);

      if (isCorrect) {
        if (typeof playSound === "function") playSound("correct");
        setMcqAnswered(true);
        setFeedbackText(mcq.correctFeedback);
        setFeedbackType("correct");
        if (step === 1) setShowPathFeedback(true);
        if (step === 3) setShowClockwiseArrow(true);
      } else {
        if (typeof playSound === "function") playSound("wrong");
        setMcqWrongIndices((prev) =>
          prev.includes(index) ? prev : [...prev, index],
        );
        setFeedbackText(mcq.wrongFeedback);
        setFeedbackType("wrong");
        if (step === 1) setShowPathFeedback(true);
        if (step === 3) setShowClockwiseArrow(true);
      }
    },
    [mcqAnswered],
  );

  const runCarAnimation = useCallback((direction, angleDeg, onComplete) => {
    if (typeof carAnimCancelRef.current === "function") {
      carAnimCancelRef.current();
    }

    setStep4Animating(true);
    setShowDanger(false);
    setShowCrashEffect(false);

    const targetAngle = getTargetCarAngle(direction, angleDeg);
    const fromAngle = CAR_START_ANGLE;

    setCarAngle(fromAngle);

    carAnimCancelRef.current = animateCarAngle(
      fromAngle,
      targetAngle,
      CAR_ANIM_DURATION_MS,
      setCarAngle,
      () => {
        setStep4Animating(false);
        carAnimCancelRef.current = null;
        if (typeof onComplete === "function") onComplete(targetAngle);
      },
    );
  }, []);

  const handleStep4DirectionSelect = useCallback(
    (value) => {
      if (step4Answered || step4Animating) return;
      if (typeof playSound === "function") playSound("click");
      setStep4Direction(value);
      if (step4HasWrong) {
        setCarAngle(CAR_START_ANGLE);
        setShowDanger(false);
        setShowCrashEffect(false);
        setStep4ShowFeedback(false);
      }
    },
    [step4Answered, step4Animating, step4HasWrong],
  );

  const handleStep4AngleChange = useCallback(
    (value) => {
      if (step4Answered || step4Animating) return;
      setStep4Angle(value);
      setStep4SliderTouched(true);
      if (step4HasWrong) {
        setCarAngle(CAR_START_ANGLE);
        setShowDanger(false);
        setShowCrashEffect(false);
        setStep4ShowFeedback(false);
      }
    },
    [step4Answered, step4Animating, step4HasWrong],
  );

  const handleStep4Action = useCallback(() => {
    if (step4Answered || step4Animating || !step4Direction || !step4SliderTouched)
      return;

    if (typeof playSound === "function") playSound("click");

    const direction = step4Direction;
    const angle = step4Angle;
    const isCorrect = isStep4AnswerCorrect(direction, angle);
    const isCrash = isAnticlockwiseCrash(direction, angle);

    runCarAnimation(direction, angle, (targetAngle) => {
      if (isCorrect) {
        if (typeof playSound === "function") playSound("correct");
        setStep4ShowFeedback(true);
        setStep4FeedbackText(APP_DATA.step4.correctFeedback);
        setStep4FeedbackType("correct");
        setStep4Answered(true);
        setStep4HasWrong(false);
        setShowDanger(false);
        setShowCrashEffect(false);
      } else if (isCrash) {
        if (typeof playSound === "function") playSound("crash");
        setStep4ShowFeedback(true);
        setStep4FeedbackText(APP_DATA.step4.wrongFeedback);
        setStep4FeedbackType("wrong");
        setStep4HasWrong(true);
        setShowDanger(true);
        setShowCrashEffect(true);
      } else {
        if (typeof playSound === "function") playSound("wrong");
        setStep4ShowFeedback(true);
        setStep4FeedbackText(APP_DATA.step4.wrongFeedback);
        setStep4FeedbackType("wrong");
        setStep4HasWrong(true);
        setShowDanger(false);
        setShowCrashEffect(false);
      }
    });
  }, [
    step4Answered,
    step4Animating,
    step4Direction,
    step4Angle,
    step4SliderTouched,
    runCarAnimation,
  ]);

  useEffect(() => {
    if (currentStep < 1 || currentStep > 3) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return undefined;
    }

    startTimeRef.current = performance.now();

    const tick = (now) => {
      const elapsed = now - startTimeRef.current;
      setRotationAngle(getContinuousAngle(elapsed));
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [currentStep]);

  useEffect(() => {
    if (!showClockwiseArrow) {
      if (arrowRafRef.current) cancelAnimationFrame(arrowRafRef.current);
      arrowRafRef.current = null;
      arrowStartRef.current = null;
      setArrowDrawProgress(0);
      return undefined;
    }

    arrowStartRef.current = performance.now();
    const cycleMs = CLOCKWISE_ARROW_GROW_MS + CLOCKWISE_ARROW_HOLD_MS;

    const tickArrow = (now) => {
      const elapsed = now - arrowStartRef.current;
      const phase = elapsed % cycleMs;
      const progress =
        phase < CLOCKWISE_ARROW_GROW_MS
          ? phase / CLOCKWISE_ARROW_GROW_MS
          : 0;
      setArrowDrawProgress(Math.max(0, Math.min(1, progress)));
      arrowRafRef.current = requestAnimationFrame(tickArrow);
    };

    arrowRafRef.current = requestAnimationFrame(tickArrow);

    return () => {
      if (arrowRafRef.current) cancelAnimationFrame(arrowRafRef.current);
      arrowRafRef.current = null;
    };
  }, [showClockwiseArrow]);

  const navText = useMemo(() => {
    if (currentStep >= 1 && currentStep <= 3) {
      return handleComma(
        mcqAnswered ? APP_DATA.nav.tapNext : APP_DATA.nav.tapOption,
      );
    }
    if (currentStep === 4) {
      const t = APP_DATA.step4;
      if (step4Answered) return handleComma(t.navDone);
      if (step4HasWrong) return handleComma(t.navIncorrect);
      if (!step4Direction) return handleComma(t.navDirection);
      if (!step4SliderTouched) return handleComma(t.navSlider);
      return handleComma(t.navButton);
    }
    return "";
  }, [
    currentStep,
    mcqAnswered,
    step4Answered,
    step4HasWrong,
    step4Direction,
    step4SliderTouched,
  ]);

  const isNextDisabled = useMemo(() => {
    if (currentStep >= 1 && currentStep <= 3) {
      return !mcqAnswered;
    }
    if (currentStep === 4) {
      return !step4Answered;
    }
    return true;
  }, [currentStep, mcqAnswered, step4Answered]);

  const isPrevDisabled = false;

  const step4ActionLabel = step4HasWrong
    ? APP_DATA.step4.retryBtn
    : APP_DATA.step4.rotateBtn;

  const step4DirectionEnabled = !step4Answered && !step4Animating;
  const step4SliderEnabled =
    !step4Answered && !step4Animating && step4Direction != null;
  const step4ActionEnabled =
    !step4Answered &&
    !step4Animating &&
    step4Direction != null &&
    step4SliderTouched;

  useEffect(() => {
    const updateNudges = () => {
      const positions = [];
      const addNudgeFor = (id) => {
        const el = document.getElementById(id);
        if (el && !el.disabled) positions.push(el.getBoundingClientRect());
      };
      if (currentStep === 0) addNudgeFor("start-button");
      else if (currentStep === 5) addNudgeFor("start-over-button");
      else if (!isNextDisabled) addNudgeFor("next-button");
      setNudgePositions(positions);
    };
    const timeoutId = setTimeout(updateNudges, 0);
    window.addEventListener("resize", updateNudges);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateNudges);
    };
  }, [currentStep, isNextDisabled]);

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

  if (currentStep === 5) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.finish.heading,
          text: APP_DATA.finish.text,
          buttonText: APP_DATA.finish.buttonText,
          onButtonClick: handleStartOver,
          buttonId: "start-over-button",
        }),
      ),
      renderNudges(),
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        step: currentStep,
        rotationAngle: rotationAngle,
        showPathFeedback: showPathFeedback,
        showClockwiseArrow: showClockwiseArrow,
        arrowDrawProgress: arrowDrawProgress,
        mcq: activeMcq,
        mcqWrongIndices: mcqWrongIndices,
        mcqCorrectIndex: correctIndex,
        mcqAnswered: mcqAnswered,
        feedbackText: feedbackText,
        feedbackType: feedbackType,
        onMcqSelect: handleMcqSelect,
        carAngle: carAngle,
        showDanger: showDanger,
        showCrashEffect: showCrashEffect,
        step4Direction: step4Direction,
        step4Angle: step4Angle,
        step4ShowFeedback: step4ShowFeedback,
        step4FeedbackText: step4FeedbackText,
        step4FeedbackType: step4FeedbackType,
        step4DirectionEnabled: step4DirectionEnabled,
        step4SliderEnabled: step4SliderEnabled,
        step4ActionEnabled: step4ActionEnabled,
        step4ActionLabel: step4ActionLabel,
        step4Locked: step4Answered,
        onStep4DirectionSelect: handleStep4DirectionSelect,
        onStep4AngleChange: handleStep4AngleChange,
        onStep4Action: handleStep4Action,
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
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
