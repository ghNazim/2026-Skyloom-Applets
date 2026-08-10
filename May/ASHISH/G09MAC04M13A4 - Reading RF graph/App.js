const App = () => {
  const { useState, useEffect, useRef } = React;

  const [gameState, setGameState] = useState("welcome");
  const [step, setStep] = useState(0);
  const [farthestStep, setFarthestStep] = useState(-1);

  const [tappedPoints, setTappedPoints] = useState([]);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState("");
  const [quizBlinkWrong, setQuizBlinkWrong] = useState(false);
  const [formulaFlyDone, setFormulaFlyDone] = useState(false);
  const [headsRevealed, setHeadsRevealed] = useState(0);
  const [revealTriggered, setRevealTriggered] = useState(false);
  const [activeRevealRow, setActiveRevealRow] = useState(null);
  const [activeRevealStep, setActiveRevealStep] = useState(0);
  const [headsExplored, setHeadsExplored] = useState(0);
  const [outcomesRevealed, setOutcomesRevealed] = useState(0);
  const [changesRecorded, setChangesRecorded] = useState(0);
  const [revealAnimating, setRevealAnimating] = useState(false);
  const [recordAnimating, setRecordAnimating] = useState(false);
  const [activeRecordRow, setActiveRecordRow] = useState(null);

  const revealTimersRef = useRef([]);
  const recordTimersRef = useRef([]);

  const RECORD_BLINK_MS = 500;
  const RECORD_ROW_PAUSE_MS = 1000;

  const startButtonRef = useRef(null);
  const startOverButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const backButtonRef = useRef(null);
  const screenRef = useRef(null);

  const stepConfig = getStepConfig(step);
  const stepData = stepConfig.stepData || {};
  const isEndStep = stepConfig.type === "end";

  const playSfx = (name) => {
    try {
      const audio = new Audio(T.sfx[name]);
      audio.play().catch(() => {});
    } catch (e) {
      // Audio play restriction is harmless
    }
  };

  const showFtue = (element) => {
    if (!element) return;
    const handFtue = document.getElementById("hand-ftue");
    if (!handFtue) return;
    const rect = element.getBoundingClientRect();
    const isButton =
      element.tagName === "BUTTON" || element.classList.contains("nav-chevron");
    const top = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
    const leftPoint = isButton
      ? rect.right - window.innerWidth * 0.02
      : rect.left + rect.width / 2;
    const left = (leftPoint / window.innerWidth) * 100;
    handFtue.style.top = `${top}vh`;
    handFtue.style.left = `${left}vw`;
    handFtue.classList.add("hand-animating");
  };

  const hideFtue = () => {
    const handFtue = document.getElementById("hand-ftue");
    if (handFtue) handFtue.classList.remove("hand-animating");
  };

  const clearRevealTimers = () => {
    revealTimersRef.current.forEach((id) => clearTimeout(id));
    revealTimersRef.current = [];
    setRevealAnimating(false);
    setActiveRevealRow(null);
    setActiveRevealStep(0);
  };

  const scheduleReveal = (fn, delay) => {
    const id = setTimeout(fn, delay);
    revealTimersRef.current.push(id);
    return id;
  };

  const clearRecordTimers = () => {
    recordTimersRef.current.forEach((id) => clearTimeout(id));
    recordTimersRef.current = [];
    setRecordAnimating(false);
    setActiveRecordRow(null);
  };

  const scheduleRecord = (fn, delay) => {
    const id = setTimeout(fn, delay);
    recordTimersRef.current.push(id);
    return id;
  };

  const runRecordSequence = () => {
    recordTimersRef.current.forEach((id) => clearTimeout(id));
    recordTimersRef.current = [];
    setActiveRecordRow(null);
    setRecordAnimating(true);

    const processRow = (row) => {
      setActiveRecordRow(row);

      scheduleRecord(() => {
        playSfx("split");
        setChangesRecorded(row + 1);

        if (row < 4) {
          scheduleRecord(() => processRow(row + 1), RECORD_ROW_PAUSE_MS);
        } else {
          scheduleRecord(() => {
            setActiveRecordRow(null);
            setRecordAnimating(false);
            playSfx("correct");
          }, RECORD_ROW_PAUSE_MS);
        }
      }, RECORD_BLINK_MS);
    };

    processRow(0);
  };

  const applyStepState = (state) => {
    if (!state) return;
    clearRevealTimers();
    clearRecordTimers();
    setTappedPoints(state.tappedPoints ?? []);
    setQuizAnswer(state.quizAnswer ?? null);
    setQuizFeedback(state.quizFeedback ?? "");
    setQuizBlinkWrong(state.quizBlinkWrong ?? false);
    setFormulaFlyDone(state.formulaFlyDone ?? false);
    setHeadsRevealed(state.headsRevealed ?? 0);
    setRevealTriggered(state.revealTriggered ?? false);
    setHeadsExplored(state.headsExplored ?? 0);
    setOutcomesRevealed(state.outcomesRevealed ?? 0);
    setChangesRecorded(state.changesRecorded ?? 0);
    setRevealAnimating(false);
    setRecordAnimating(false);
    setActiveRevealRow(null);
    setActiveRevealStep(0);
    setActiveRecordRow(null);
  };

  const goToCompletedStep = (targetStep) => {
    applyStepState(getCompletedStepState(targetStep));
    setStep(targetStep);
  };

  const isBrowsingCompletedSteps = step < farthestStep;

  useEffect(
    () => () => {
      clearRevealTimers();
      clearRecordTimers();
    },
    [],
  );

  useEffect(() => {
    const stepType = stepConfig.stepData?.type;
    if (stepType === "recordChange" && outcomesRevealed < 5) {
      setOutcomesRevealed(5);
    }
    if (stepType === "summary") {
      if (outcomesRevealed < 5) setOutcomesRevealed(5);
      if (changesRecorded < 5) setChangesRecorded(5);
    }
  }, [step, stepConfig.stepData?.type]);

  const isStepComplete = () => {
    if (stepData.type === "intro") return true;
    if (stepData.type === "tableIntro") return true;
    if (stepData.type === "pointsInteraction") return tappedPoints.length === 5;
    if (stepData.type === "formulaQuiz") return false;
    if (stepData.type === "deduceOutcomes") return outcomesRevealed === 5;
    if (stepData.type === "recordChange") return changesRecorded === 5;
    if (stepData.type === "summary") return true;
    return false;
  };

  const canRevealOnNext =
    (stepData.type === "deduceOutcomes" && outcomesRevealed === 0) ||
    (stepData.type === "recordChange" &&
      changesRecorded === 0 &&
      !recordAnimating);

  const showWhatDoesTellUs =
    stepData.type === "formulaQuiz" &&
    quizAnswer === "option2" &&
    headsRevealed === 5 &&
    !revealAnimating &&
    revealTriggered;

  const canGoNext =
    gameState === "playing" &&
    !isEndStep &&
    !revealAnimating &&
    !recordAnimating &&
    (isBrowsingCompletedSteps ||
      (!(stepData.type === "deduceOutcomes" && outcomesRevealed > 0) &&
        (canRevealOnNext || isStepComplete())));

  const canGoBack = canGoNext && getNavigableStep(step, "prev") !== null;

  const showNavTeeter =
    stepData.type === "formulaQuiz" && !quizAnswer && !revealAnimating;

  useEffect(() => {
    hideFtue();
    let timeoutId;

    if (gameState === "welcome") {
      timeoutId = setTimeout(() => showFtue(startButtonRef.current), 800);
    } else if (isEndStep) {
      timeoutId = setTimeout(() => showFtue(startOverButtonRef.current), 800);
    } else if (stepData.type === "formulaQuiz" && quizAnswer !== "option2") {
      // No FTUE on MCQ until answered
    } else if (showWhatDoesTellUs) {
      timeoutId = setTimeout(() => {
        const target = screenRef.current?.querySelector(
          ".what-does-tell-us-btn:not(:disabled)",
        );
        if (target) showFtue(target);
      }, 700);
    } else if (stepData.type === "deduceOutcomes" && outcomesRevealed > 0) {
      timeoutId = setTimeout(() => {
        const target = screenRef.current?.querySelector(
          ".callout-box__next:not(:disabled)",
        );
        if (target) showFtue(target);
      }, 700);
    } else {
      timeoutId = setTimeout(() => {
        if (canGoNext && isStepComplete() && !canRevealOnNext) {
          showFtue(nextButtonRef.current);
        } else {
          const target = screenRef.current?.querySelector(
            ".ftue-target:not(:disabled)",
          );
          if (target) {
            showFtue(target);
          } else if (canGoNext) {
            showFtue(nextButtonRef.current);
          }
        }
      }, 700);
    }

    return () => {
      clearTimeout(timeoutId);
      hideFtue();
    };
  }, [
    gameState,
    step,
    tappedPoints,
    quizAnswer,
    headsRevealed,
    headsExplored,
    outcomesRevealed,
    changesRecorded,
    revealAnimating,
    recordAnimating,
    revealTriggered,
    isEndStep,
    canGoNext,
    canRevealOnNext,
    showWhatDoesTellUs,
  ]);

  const resetPlayingState = () => {
    clearRevealTimers();
    clearRecordTimers();
    setStep(0);
    setFarthestStep(-1);
    setTappedPoints([]);
    setQuizAnswer(null);
    setQuizFeedback("");
    setQuizBlinkWrong(false);
    setFormulaFlyDone(false);
    setHeadsRevealed(0);
    setRevealTriggered(false);
    setHeadsExplored(0);
    setOutcomesRevealed(0);
    setChangesRecorded(0);
  };

  const handleStart = () => {
    playSfx("click");
    resetPlayingState();
    setGameState("playing");
  };

  const handleStartOver = () => {
    playSfx("click");
    resetPlayingState();
    setGameState("welcome");
  };

  const handleNext = () => {
    if (!canGoNext) return;

    if (isBrowsingCompletedSteps) {
      const nextStep = getNavigableStep(step, "next");
      if (nextStep === null) return;
      playSfx("click");
      goToCompletedStep(nextStep);
      return;
    }

    if (stepData.type === "deduceOutcomes" && outcomesRevealed === 0) {
      playSfx("click");
      setOutcomesRevealed(1);
      return;
    }

    if (stepData.type === "recordChange" && changesRecorded < 5) {
      if (recordAnimating) return;
      playSfx("click");
      runRecordSequence();
      return;
    }

    if (!isStepComplete()) return;

    const nextStep = getNavigableStep(step, "next");
    playSfx("click");

    if (nextStep === null) {
      if (stepData.type === "summary") {
        setFarthestStep(step);
        setStep(getChallengeConfig().endStep);
      }
      return;
    }

    setFarthestStep(step);
    setStep(nextStep);
  };

  const handleDeduceCalloutNext = () => {
    if (stepData.type !== "deduceOutcomes" || outcomesRevealed === 0) return;

    playSfx("click");

    if (outcomesRevealed < 5) {
      setOutcomesRevealed((prev) => prev + 1);
      return;
    }

    const nextStep = getNavigableStep(step, "next");
    if (nextStep === null) return;

    setFarthestStep(step);
    setChangesRecorded(0);
    setStep(nextStep);
  };

  const handleBack = () => {
    if (!canGoBack) return;

    const previousStep = getNavigableStep(step, "prev");
    if (previousStep === null) return;

    playSfx("click");
    goToCompletedStep(previousStep);
  };

  const handlePointClickStart = () => {
    hideFtue();
  };

  const handlePointTap = (trialNum) => {
    if (tappedPoints.includes(trialNum)) return;
    playSfx("split");
    setTappedPoints((prev) => [...prev, trialNum]);
  };

  const handleQuizAnswer = (choice) => {
    if (quizAnswer === "option2") return;
    setQuizAnswer(choice);
    if (choice === "option2") {
      playSfx("correct");
      setQuizFeedback(T.ui.correctOptionFeedback);
      setFormulaFlyDone(false);
    } else {
      playSfx("wrong");
      setQuizFeedback(T.ui.wrongOptionFeedback);
      setQuizBlinkWrong(true);
      scheduleReveal(() => setQuizBlinkWrong(false), 1200);
    }
  };

  const handleFormulaFlyComplete = () => {
    setFormulaFlyDone(true);
  };

  const handleHeadsReveal = () => {
    if (stepData.type !== "formulaQuiz" || quizAnswer !== "option2") return;
    if (revealTriggered || revealAnimating || headsRevealed >= 5) return;

    playSfx("click");
    setRevealTriggered(true);
    setRevealAnimating(true);
    setHeadsRevealed(0);

    const REVEAL_ROW_START_DELAY_MS = 500;
    const REVEAL_STEP_MS = 500;
    const REVEAL_ROW_GAP_MS = 1000;

    const runRowStep = (row, stepVal) => {
      setActiveRevealRow(row);
      setActiveRevealStep(stepVal);

      if (stepVal === 1) playSfx("split");

      if (stepVal < 5) {
        scheduleReveal(() => runRowStep(row, stepVal + 1), REVEAL_STEP_MS);
        return;
      }

      scheduleReveal(() => {
        setHeadsRevealed(row + 1);
        setActiveRevealRow(null);
        setActiveRevealStep(0);

        if (row < 4) {
          scheduleReveal(() => startRow(row + 1), REVEAL_ROW_GAP_MS);
        } else {
          playSfx("correct");
          setRevealAnimating(false);
        }
      }, REVEAL_STEP_MS);
    };

    const startRow = (row) => {
      setActiveRevealRow(row);
      setActiveRevealStep(0);
      scheduleReveal(() => runRowStep(row, 1), REVEAL_ROW_START_DELAY_MS);
    };

    startRow(0);
  };

  const handleWhatDoesTellUs = () => {
    if (!showWhatDoesTellUs) return;
    playSfx("click");
    const deduceStep = getChallengeConfig().steps.findIndex(
      (s) => s.type === "deduceOutcomes",
    );
    if (deduceStep < 0) return;
    setFarthestStep(step);
    applyStepState({
      ...getCompletedStepState(step),
      outcomesRevealed: 1,
    });
    setStep(deduceStep);
  };

  const getInstructionText = () => {
    if (isEndStep) return T.ui.instructionStartOver;
    if (stepData.type === "intro") return T.ui.seeTablePrompt;
    if (stepData.type === "tableIntro") return T.ui.tableFillPrompt;
    if (stepData.type === "pointsInteraction") {
      return tappedPoints.length < 5
        ? T.ui.tapPointsPrompt
        : T.ui.tapNextOutcome;
    }
    if (stepData.type === "formulaQuiz") {
      if (quizAnswer !== "option2") return T.ui.tapCorrectOption;
      if (!formulaFlyDone) return T.ui.instructionTapContinue;
      if (headsRevealed < 5) return T.ui.tapRevealHeads;
      return T.ui.tapWhatDoesThisTellUs;
    }
    if (stepData.type === "deduceOutcomes") {
      if (outcomesRevealed < 5) {
        return outcomesRevealed === 0
          ? T.ui.tapNextOutcome
          : outcomesRevealed === 4
            ? T.ui.tapNextPattern
            : T.ui.tapNextExplore;
      }
      return T.ui.instructionTapContinue;
    }
    if (stepData.type === "recordChange") {
      if (recordAnimating) return T.ui.instructionTapContinue;
      return changesRecorded < 5 ? T.ui.tapNextRecordChange : T.ui.tapNextWrap;
    }
    if (stepData.type === "summary") return T.ui.tapNextSummarize;
    return T.ui.instructionTapContinue;
  };

  if (gameState === "welcome") {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(WelcomeScreen, {
        onStart: handleStart,
        startButtonRef,
      }),
    );
  }

  if (isEndStep) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(EndScreen, {
        onStartOver: handleStartOver,
        startOverButtonRef,
      }),
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(ActivityScreen, {
      ref: screenRef,
      stepConfig,
      tappedPoints,
      quizAnswer,
      quizFeedback,
      quizBlinkWrong,
      formulaFlyDone,
      headsRevealed,
      revealTriggered,
      activeRevealRow,
      activeRevealStep,
      headsExplored,
      outcomesRevealed,
      changesRecorded,
      revealAnimating,
      recordAnimating,
      activeRecordRow,
      onPointTap: handlePointTap,
      onPointClickStart: handlePointClickStart,
      onQuizAnswer: handleQuizAnswer,
      onFormulaFlyComplete: handleFormulaFlyComplete,
      onHeadsReveal: handleHeadsReveal,
      onWhatDoesTellUs: handleWhatDoesTellUs,
      onDeduceCalloutNext: handleDeduceCalloutNext,
      showWhatDoesTellUs,
      handleStartOver,
      startOverButtonRef,
    }),
    React.createElement(Navigation, {
      onNext: handleNext,
      onBack: handleBack,
      showNext: canGoNext,
      showBack: canGoBack,
      showTeeter: showNavTeeter,
      nextButtonRef,
      backButtonRef,
      children: React.createElement(LowerPanel, { text: getInstructionText() }),
    }),
  );
};
