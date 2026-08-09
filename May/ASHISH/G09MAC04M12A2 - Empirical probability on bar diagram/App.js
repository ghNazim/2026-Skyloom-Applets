const App = () => {
  const { useState, useEffect, useRef } = React;
  const config = getChallengeConfig();
  const [gameState, setGameState] = useState("welcome");
  const [step, setStep] = useState(0);
  const [history, setHistory] = useState([]);
  const [completed, setCompleted] = useState({});
  const [feedback, setFeedback] = useState("");

  const [trialCount, setTrialCount] = useState(0);
  const [frequencies, setFrequencies] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
  const [dieValue, setDieValue] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [rollStage, setRollStage] = useState("idle");
  const [highlightFace, setHighlightFace] = useState(null);
  const [spinnerPreview, setSpinnerPreview] = useState(null);

  const compoundEventInit = () => ({
    buildStarted: false,
    terms: [],
    buildComplete: false,
    sumRevealed: false,
    sumCompact: false,
    sumPromptReady: false,
    isAnimating: false,
    animatingFace: null,
  });

  const [eventA, setEventA] = useState({ freqRevealed: false, totalRevealed: false });
  const [eventB, setEventB] = useState(compoundEventInit());
  const [eventC, setEventC] = useState(compoundEventInit());

  const [spinnerEntered, setSpinnerEntered] = useState({ A: null, B: null, C: null, D: null });
  const [spinnerInput, setSpinnerInput] = useState("?");
  const [spinnerTotalDisplay, setSpinnerTotalDisplay] = useState(null);
  const [sumCollapseParts, setSumCollapseParts] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});

  const startButtonRef = useRef(null);
  const startOverButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const backButtonRef = useRef(null);
  const lessonRef = useRef(null);
  const sumAnimatingRef = useRef(false);
  const eventBuildRef = useRef({ idx: 0, eventKey: null });

  const stepConfig = getStepConfig(step);
  const stepData = stepConfig.stepData || {};
  const isEndStep = stepConfig.type === "end";
  const hideNavigation = isEndStep || stepConfig.type === "spinnerBridge";

  const playSfx = (name) => {
    try {
      const audio = new Audio(T.sfx[name]);
      audio.play().catch(() => {});
    } catch (e) {}
  };

  const showFtue = (element) => {
    if (!element) return;
    const handFtue = document.getElementById("hand-ftue");
    if (!handFtue) return;
    const rect = element.getBoundingClientRect();
    const handWidth = window.innerWidth * 0.045;
    const needsEdgeFlip = rect.right + handWidth * 0.7 > window.innerWidth;
    const isButton = element.tagName === "BUTTON" || element.classList.contains("nav-chevron");
    const top = ((rect.top + rect.height * (isButton ? 0.55 : 0.5)) / window.innerHeight) * 100;
    const leftPoint = isButton ? rect.right - window.innerWidth * 0.015 : rect.left + rect.width / 2;
    const left = (leftPoint / window.innerWidth) * 100;
    handFtue.style.top = `${top}vh`;
    handFtue.style.left = `${left}vw`;
    handFtue.classList.toggle("hand-ftue--edge", needsEdgeFlip);
    handFtue.classList.add("hand-animating");
  };

  const hideFtue = () => {
    const handFtue = document.getElementById("hand-ftue");
    if (handFtue) {
      handFtue.classList.remove("hand-animating");
      handFtue.classList.remove("hand-ftue--edge");
    }
  };

  const markComplete = (id) => setCompleted((prev) => ({ ...prev, [id]: true }));

  const isStepComplete = () => {
    if (isEndStep) return true;
    const id = stepData.id;
    if (!id) return false;
    return completed[id] === true;
  };

  const canGoNext = gameState === "playing" && !isEndStep && isStepComplete();
  const canGoBack = gameState === "playing" && history.length > 0 && isStepComplete();

  const resetAll = () => {
    setStep(0);
    setHistory([]);
    setCompleted({});
    setFeedback("");
    setTrialCount(0);
    setFrequencies({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
    setDieValue(null);
    setIsRolling(false);
    setRollStage("idle");
    setHighlightFace(null);
    setSpinnerPreview(null);
    setEventA({ freqRevealed: false, totalRevealed: false });
    setEventB(compoundEventInit());
    setEventC(compoundEventInit());
    setSpinnerEntered({ A: null, B: null, C: null, D: null });
    setSpinnerInput("?");
    setSpinnerTotalDisplay(null);
    setSumCollapseParts(null);
    setQuizAnswers({});
    sumAnimatingRef.current = false;
    eventBuildRef.current = { idx: 0, eventKey: null };
  };

  const SINGLE_ROLL_MS = 1500;
  const DICE_SETTLE_MS = 500;

  const runRollAnimation = (face, onDone) => {
    setRollStage("rolling");
    setIsRolling(true);
    playSfx("split");
    setTimeout(() => {
      setDieValue(face);
      setIsRolling(false);
      setTimeout(() => {
        setRollStage("chart");
        setFrequencies((prev) => ({ ...prev, [face]: (prev[face] || 0) + 1 }));
        setTrialCount((prev) => {
          const next = prev + 1;
          setHighlightFace(face);
          setTimeout(() => {
            setHighlightFace(null);
            setRollStage("idle");
            if (onDone) onDone(next);
          }, 700);
          return next;
        });
      }, DICE_SETTLE_MS);
    }, SINGLE_ROLL_MS);
  };

  const BATCH_ROLL_TOTAL_MS = 10000;
  const BATCH_SPIN_MS = 120;
  const BATCH_FACE_MS = 80;

  const handleRoll = () => {
    if (isRolling) return;
    if (stepData.type === "diceRoll") {
      if (trialCount >= T.diceFirstRolls.length) return;
      const face = T.diceFirstRolls[trialCount];
      runRollAnimation(face, (newCount) => {
        if (newCount >= T.diceFirstRolls.length) {
          markComplete(stepData.id);
          setTimeout(() => advanceStep(), 500);
        }
      });
    } else if (stepData.type === "diceRollBatch") {
      if (isStepComplete()) return;
      const rolls = T.diceBatchRolls;
      const rollCycleMs = BATCH_SPIN_MS + DICE_SETTLE_MS + BATCH_FACE_MS;
      const perRollMs = Math.max(rollCycleMs + 20, Math.floor(BATCH_ROLL_TOTAL_MS / rolls.length));
      const gapBetweenRolls = perRollMs - rollCycleMs;
      setRollStage("rolling");
      setIsRolling(true);
      playSfx("split");
      let index = 0;

      const tick = () => {
        if (index >= rolls.length) {
          setRollStage("idle");
          setIsRolling(false);
          setHighlightFace(null);
          setDieValue(rolls[rolls.length - 1]);
          markComplete(stepData.id);
          return;
        }

        const face = rolls[index];
        setIsRolling(true);
        setRollStage("rolling");

        setTimeout(() => {
          setDieValue(face);
          setIsRolling(false);
          setTimeout(() => {
            setRollStage("chart");
            setFrequencies((prev) => ({ ...prev, [face]: (prev[face] || 0) + 1 }));
            setTrialCount((prev) => prev + 1);
            setHighlightFace(face);

            setTimeout(() => {
              setHighlightFace(null);
              index += 1;
              if (index < rolls.length) {
                setTimeout(tick, gapBetweenRolls);
              } else {
                setRollStage("idle");
                setDieValue(face);
                markComplete(stepData.id);
              }
            }, BATCH_FACE_MS);
          }, DICE_SETTLE_MS);
        }, BATCH_SPIN_MS);
      };

      setTimeout(tick, 200);
    }
  };

  const handleEventCalcTap = (eventKey, part) => {
    if (eventKey !== "A") return;
    const state = eventA;
    if (part === "freq" && !state.freqRevealed) {
      playSfx("click");
      setEventA((prev) => ({ ...prev, freqRevealed: true }));
    } else if (part === "total" && state.freqRevealed && !state.totalRevealed) {
      playSfx("correct");
      setEventA((prev) => ({ ...prev, totalRevealed: true }));
      markComplete("eventA");
    }
  };

  const startEventBuildTerm = (eventKey) => {
    const event = T.diceEvents[eventKey];
    const setter = eventKey === "B" ? setEventB : setEventC;
    const { idx } = eventBuildRef.current;
    if (idx >= event.faces.length) {
      setter((prev) => ({ ...prev, isAnimating: false, buildComplete: true, animatingFace: null }));
      setTimeout(() => {
        setter((prev) => ({ ...prev, sumPromptReady: true }));
      }, 650);
      return;
    }
    setter((prev) => ({ ...prev, animatingFace: event.faces[idx] }));
  };

  const handleEventTermLanded = (eventKey) => {
    const event = T.diceEvents[eventKey];
    const setter = eventKey === "B" ? setEventB : setEventC;
    const ref = eventBuildRef.current;
    if (ref.eventKey !== eventKey) return;
    const face = event.faces[ref.idx];
    const value = event.freqs[ref.idx];
    ref.idx += 1;
    setter((prev) => ({
      ...prev,
      animatingFace: null,
      terms: [...prev.terms, { face, value }],
    }));
    setTimeout(() => startEventBuildTerm(eventKey), 450);
  };

  const handleEventBuildStart = (eventKey) => {
    const state = eventKey === "B" ? eventB : eventC;
    if (state.buildStarted || state.isAnimating) return;
    playSfx("click");
    eventBuildRef.current = { idx: 0, eventKey };
    const setter = eventKey === "B" ? setEventB : setEventC;
    setter((prev) => ({
      ...prev,
      buildStarted: true,
      isAnimating: true,
      terms: [],
      buildComplete: false,
      sumRevealed: false,
      sumCompact: false,
      sumPromptReady: false,
      animatingFace: null,
    }));
    setTimeout(() => startEventBuildTerm(eventKey), 300);
  };

  const handleEventSumTap = (eventKey) => {
    const state = eventKey === "B" ? eventB : eventC;
    if (!state.buildComplete || state.sumRevealed) return;
    playSfx("correct");
    const setter = eventKey === "B" ? setEventB : setEventC;
    setter((prev) => ({ ...prev, sumRevealed: true }));
    markComplete(`event${eventKey}`);
    setTimeout(() => {
      setter((prev) => ({ ...prev, sumCompact: true }));
    }, 700);
  };

  const getSpinnerFrequencies = () => {
    if (stepData.type === "spinnerOverview") {
      const empty = {};
      T.spinnerSections.forEach((s) => {
        empty[s] = 0;
      });
      return empty;
    }
    const freq = {};
    T.spinnerSections.forEach((s) => {
      freq[s] = spinnerEntered[s] != null ? spinnerEntered[s] : T.spinnerFreq[s];
    });
    return freq;
  };

  const getSpinnerExprParts = () => {
    return T.spinnerSections.map((section) => ({
      text: spinnerEntered[section] != null ? String(spinnerEntered[section]) : "?",
      revealed: spinnerEntered[section] != null,
    }));
  };

  const handleSpinnerInputChange = (val) => {
    setSpinnerInput(val);
    setFeedback("");
    const num = parseInt(val, 10);
    if (!Number.isNaN(num) && val !== "?") {
      setSpinnerPreview({ section: stepData.section, value: num });
    } else {
      setSpinnerPreview(null);
    }
  };

  const handleSpinnerShowSubmitPreview = () => {
    const num = parseInt(spinnerInput, 10);
    if (Number.isNaN(num) || spinnerInput === "?") return;
    setSpinnerPreview({ section: stepData.section, value: num });
  };

  const handleSpinnerSubmitWrong = () => {
    playSfx("wrong");
    const num = parseInt(spinnerInput, 10);
    if (Number.isNaN(num)) return;
    setSpinnerPreview({ section: stepData.section, value: num, wrong: true });
  };

  const handleSpinnerSubmitCorrect = () => {
    const section = stepData.section;
    playSfx("correct");
    setSpinnerEntered((prev) => ({ ...prev, [section]: T.spinnerFreq[section] }));
    setSpinnerPreview(null);
    setFeedback("");
    markComplete(stepData.id);
    setTimeout(() => advanceStep(), 900);
  };

  const advanceStep = () => {
    setFeedback("");
    setStep((current) => {
      setHistory((prev) => [...prev, current]);
      return current + 1;
    });
  };

  const handleSumExpressionTap = () => {
    if (completed.spinnerSum) return;
    playSfx("click");
    markComplete("spinnerSum");
    advanceStep();
  };

  const runSpinnerSumAnimation = () => {
    if (sumAnimatingRef.current) return;
    sumAnimatingRef.current = true;
    const values = T.spinnerSections.map((s) => T.spinnerFreq[s]);
    const collapseSteps = [
      values.map(String),
      [String(values[0]), String(values[1]), String(values[2] + values[3])],
      [String(values[0]), String(values[1] + values[2] + values[3])],
      [String(T.spinnerTotalTrials)],
    ];
    let step = 0;
    setSumCollapseParts(collapseSteps[0].map((text) => ({ text, revealed: true })));
    setSpinnerTotalDisplay(null);
    const run = () => {
      step += 1;
      if (step >= collapseSteps.length) {
        setSpinnerTotalDisplay(T.spinnerTotalTrials);
        setSumCollapseParts(null);
        markComplete("spinnerSumDone");
        sumAnimatingRef.current = false;
        return;
      }
      setSumCollapseParts(collapseSteps[step].map((text) => ({ text, revealed: true })));
      setTimeout(run, 750);
    };
    setTimeout(run, 750);
  };

  const handleBridgeContinue = () => {
    playSfx("click");
    markComplete("spinnerBridge");
    advanceStep();
  };

  const handleQuizAnswer = (quizId, choice) => {
    const quiz = T.spinnerQuizzes.find((q) => q.id === quizId);
    const isCorrect = choice === quiz.correct;
    setQuizAnswers((prev) => ({ ...prev, [quizId]: choice }));
    playSfx(isCorrect ? "correct" : "wrong");
    if (isCorrect) markComplete(stepData.id);
  };

  const handleStart = () => {
    playSfx("click");
    resetAll();
    setGameState("playing");
  };

  const handleStartOver = () => {
    playSfx("click");
    resetAll();
    setGameState("welcome");
  };

  const handleNext = () => {
    if (!canGoNext) return;
    playSfx("click");
    setFeedback("");
    setHistory((prev) => [...prev, step]);
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (!canGoBack) return;
    playSfx("click");
    setFeedback("");
    const previousStep = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setStep(previousStep);
  };

  useEffect(() => {
    const autoSteps = ["spinnerOverview"];
    if (stepData.id && autoSteps.includes(stepData.id)) {
      markComplete(stepData.id);
    }
    if (stepData.type === "spinnerEnter") {
      setSpinnerInput("?");
      setSpinnerPreview(null);
      setFeedback("");
    }
    if (stepData.type === "spinnerSumDone") {
      setSpinnerTotalDisplay(null);
      setSumCollapseParts(null);
      sumAnimatingRef.current = false;
      const timer = setTimeout(() => runSpinnerSumAnimation(), 450);
      return () => clearTimeout(timer);
    }
  }, [step]);

  useEffect(() => {
    hideFtue();
    let timeoutId;
    if (gameState === "welcome") {
      timeoutId = setTimeout(() => showFtue(startButtonRef.current), 800);
    } else if (isEndStep) {
      timeoutId = setTimeout(() => showFtue(startOverButtonRef.current), 800);
    } else if (stepData.type === "spinnerBridge") {
      timeoutId = setTimeout(() => showFtue(lessonRef.current?.querySelector(".bridge-continue-btn")), 700);
    } else if (stepData.type === "spinnerEnter" || stepData.type === "spinnerQuiz") {
      hideFtue();
    } else {
      timeoutId = setTimeout(() => {
        const target = lessonRef.current?.querySelector(".ftue-target:not(:disabled)");
        showFtue(target || (canGoNext ? nextButtonRef.current : null));
      }, 700);
    }
    return () => {
      clearTimeout(timeoutId);
      hideFtue();
    };
  }, [gameState, step, completed, isEndStep, canGoNext, feedback, spinnerInput, trialCount, isRolling, highlightFace, eventA, eventB, eventC, spinnerEntered, spinnerTotalDisplay]);

  const getInstructionText = () => {
    if (rollStage !== "idle") return "";
    if (isEndStep) return T.ui.instructionStartOver;
    const type = stepData.type;
    if (type === "diceRoll") {
      if (trialCount === 0) return T.ui.instructionRoll;
      if (trialCount < T.diceFirstRolls.length) return T.ui.instructionRollAgain;
      return T.ui.instructionRollAll;
    }
    if (type === "diceRollBatch") {
      if (isStepComplete()) return T.ui.instructionDiceRecorded;
      return T.ui.instructionRollAll;
    }
    if (type === "diceEventCalc") {
      const eventKey = stepData.eventKey;
      if (eventKey === "A") {
        if (!eventA.freqRevealed) return T.ui.instructionEventAFreq;
        if (!eventA.totalRevealed) return T.ui.instructionEventATotal;
        return T.ui.instructionEventNext;
      }
      const state = eventKey === "B" ? eventB : eventC;
      if (!state.buildStarted) {
        return eventKey === "B" ? T.ui.instructionEventBFreq : T.ui.instructionEventCFreq;
      }
      if (!state.buildComplete || state.isAnimating || !state.sumPromptReady) return "";
      if (!state.sumRevealed) {
        return eventKey === "B" ? T.ui.instructionEventBSum : T.ui.instructionEventCSum;
      }
      if (eventKey === "C") return T.ui.instructionEventCNext;
      return T.ui.instructionEventNext;
    }
    if (type === "spinnerBridge") return "";
    if (type === "spinnerOverview") return T.ui.instructionSpinnerOverview;
    if (type === "spinnerEnter") {
      if (spinnerEntered[stepData.section] != null) return T.ui.instructionTapContinue;
      return T.ui.instructionSpinnerEnter.replace("{section}", stepData.section);
    }
    if (type === "spinnerSum") return T.ui.instructionSpinnerSum;
    if (type === "spinnerSumDone") {
      if (!isStepComplete()) return T.ui.instructionSpinnerSumAnimating;
      return T.ui.instructionSpinnerSumDone;
    }
    if (type === "spinnerQuiz") {
      if (!isStepComplete()) return T.ui.instructionSpinnerQuiz;
      if (stepData.quizIndex < 2) return T.ui.instructionSpinnerQuizNext;
      return T.ui.instructionSpinnerQuizSummary;
    }
    return T.ui.instructionTapContinue;
  };

  if (gameState === "welcome") {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(WelcomeScreen, { onStart: handleStart, startButtonRef })
    );
  }

  return React.createElement(
    "div",
    { className: `applet-container${hideNavigation ? " applet-container--no-nav" : ""}` },
    React.createElement(LessonScreen, {
      ref: lessonRef,
      stepConfig,
      diceState: { trialCount, frequencies, dieValue, isRolling, rollStage, highlightFace, fastRoll: stepData.type === "diceRollBatch" },
      spinnerState: {
        frequencies: getSpinnerFrequencies(),
        exprParts: getSpinnerExprParts(),
        currentInput: spinnerInput,
        enteredValues: spinnerEntered,
        preview: spinnerPreview,
        totalDisplay:
          stepData.type === "spinnerSumDone"
            ? spinnerTotalDisplay
            : stepData.type === "spinnerSum"
              ? null
              : spinnerTotalDisplay ?? T.spinnerTotalTrials,
        showExpr:
          stepData.type === "spinnerEnter" || stepData.type === "spinnerSum"
            ? true
            : stepData.type === "spinnerSumDone"
              ? spinnerTotalDisplay == null
              : false,
        sumExpression: "11 + 7 + 2 + 10",
        sumCollapseParts,
        quizAnswers,
      },
      eventState: {
        eventA,
        eventB,
        eventC,
        fracSub: "r",
      },
      feedback,
      onRoll: handleRoll,
      onEventCalcTap: handleEventCalcTap,
      onEventBuildStart: handleEventBuildStart,
      onEventTermLanded: handleEventTermLanded,
      onEventSumTap: handleEventSumTap,
      onSpinnerInputChange: handleSpinnerInputChange,
      onSpinnerSubmitWrong: handleSpinnerSubmitWrong,
      onSpinnerShowSubmitPreview: handleSpinnerShowSubmitPreview,
      onSpinnerSubmitCorrect: handleSpinnerSubmitCorrect,
      onSumExpressionTap: handleSumExpressionTap,
      onQuizAnswer: handleQuizAnswer,
      onBridgeContinue: handleBridgeContinue,
      onNumpadTap: () => playSfx("click"),
      handleStartOver,
      startOverButtonRef,
    }),
    React.createElement(Navigation, {
        hidden: hideNavigation,
        onNext: handleNext,
        onBack: handleBack,
        showNext: canGoNext,
        showBack: canGoBack,
        nextButtonRef,
        backButtonRef,
        children: React.createElement(LowerPanel, { text: getInstructionText() }),
      })
  );
};
