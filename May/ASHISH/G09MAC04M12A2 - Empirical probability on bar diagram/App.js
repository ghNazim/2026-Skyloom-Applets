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
  const [sumMergeAnim, setSumMergeAnim] = useState(null);
  const [spinnerCorrectHold, setSpinnerCorrectHold] = useState(false);
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
    const isNavButton = element.classList.contains("nav-chevron");
    const isButton = element.tagName === "BUTTON" || isNavButton;
    const needsEdgeFlip = !isNavButton && rect.right + handWidth * 0.7 > window.innerWidth;
    handFtue.classList.toggle("ftue-on-nav", isNavButton);
    if (isNavButton) {
      handFtue.style.top = `${(rect.top / window.innerHeight) * 100}vh`;
      handFtue.style.left = `${(rect.left / window.innerWidth) * 100}vw`;
      handFtue.style.setProperty("--ftue-btn-w", `${rect.width}px`);
      handFtue.style.setProperty("--ftue-btn-h", `${rect.height}px`);
    } else {
      const top = ((rect.top + rect.height * (isButton ? 0.55 : 0.5)) / window.innerHeight) * 100;
      const leftPoint = isButton ? rect.right - window.innerWidth * 0.015 : rect.left + rect.width / 2;
      const left = (leftPoint / window.innerWidth) * 100;
      handFtue.style.top = `${top}vh`;
      handFtue.style.left = `${left}vw`;
    }
    handFtue.classList.toggle("hand-ftue--edge", needsEdgeFlip);
    handFtue.classList.add("hand-animating");
  };

  const hideFtue = () => {
    const handFtue = document.getElementById("hand-ftue");
    if (handFtue) {
      handFtue.classList.remove("hand-animating");
      handFtue.classList.remove("hand-ftue--edge");
      handFtue.classList.remove("ftue-on-nav");
    }
  };

  const markComplete = (id) => setCompleted((prev) => ({ ...prev, [id]: true }));

  const isStepComplete = () => {
    if (isEndStep) return true;
    const id = stepData.id;
    if (!id) return false;
    return completed[id] === true;
  };

  const canGoNext =
    gameState === "playing" && !isEndStep && isStepComplete() && stepData.type !== "spinnerEnter";
  const canGoBack =
    gameState === "playing" && history.length > 0 && isStepComplete() && stepData.type !== "spinnerEnter";

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
    setSumMergeAnim(null);
    setSpinnerCorrectHold(false);
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
        playSfx("tick");
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
        playSfx("split");

        setTimeout(() => {
          setDieValue(face);
          setIsRolling(false);
          setTimeout(() => {
            setRollStage("chart");
            setFrequencies((prev) => ({ ...prev, [face]: (prev[face] || 0) + 1 }));
            playSfx("tick");
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
      return { ...T.spinnerFreq };
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
    setSpinnerCorrectHold(true);
    markComplete(stepData.id);
    setTimeout(() => {
      setSpinnerCorrectHold(false);
      advanceStep();
    }, 1200);
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
    const mergeQueue = [
      { left: 2, right: 3, sum: String(values[2] + values[3]) },
      { left: 1, right: 2, sum: String(values[1] + values[2] + values[3]) },
      { left: 0, right: 1, sum: String(T.spinnerTotalTrials) },
    ];
    const MERGE_HIGHLIGHT_MS = 450;
    const MERGE_SLIDE_MS = 550;
    const MERGE_COMMIT_MS = 200;
    const MERGE_PAUSE_MS = 280;
    const MERGE_COLLAPSE_MS = 800;

    let terms = values.map(String);
    let hiddenPlus = [false, false, false];
    let hiddenTerms = [false, false, false, false];

    const runMerge = (mergeIndex) => {
      if (mergeIndex >= mergeQueue.length) {
        setSumMergeAnim({
          terms: [...terms],
          hiddenPlus: [...hiddenPlus],
          hiddenTerms: [...hiddenTerms],
          phase: "idle",
          mergeLeft: null,
          mergeRight: null,
        });
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setSumMergeAnim((prev) => ({ ...prev, phase: "collapse-width" }));
          });
        });
        setTimeout(() => {
          setSpinnerTotalDisplay(T.spinnerTotalTrials);
          setSumMergeAnim(null);
          markComplete("spinnerSumDone");
          sumAnimatingRef.current = false;
        }, MERGE_COLLAPSE_MS);
        return;
      }

      const { left, right, sum } = mergeQueue[mergeIndex];

      setSumMergeAnim({
        terms: [...terms],
        hiddenPlus: [...hiddenPlus],
        hiddenTerms: [...hiddenTerms],
        phase: "highlight",
        mergeLeft: left,
        mergeRight: right,
      });

      setTimeout(() => {
        setSumMergeAnim((prev) => ({ ...prev, phase: "slide" }));

        setTimeout(() => {
          terms = [...terms];
          terms[left] = sum;
          hiddenPlus = [...hiddenPlus];
          hiddenPlus[right] = true;
          hiddenTerms = [...hiddenTerms];
          hiddenTerms[right] = true;

          setSumMergeAnim({
            terms: [...terms],
            hiddenPlus: [...hiddenPlus],
            hiddenTerms: [...hiddenTerms],
            phase: "commit",
            mergeLeft: left,
            mergeRight: right,
          });

          setTimeout(() => {
            setSumMergeAnim((prev) => ({
              ...prev,
              phase: "idle",
              mergeLeft: null,
              mergeRight: null,
            }));
            setTimeout(() => runMerge(mergeIndex + 1), MERGE_PAUSE_MS);
          }, MERGE_COMMIT_MS);
        }, MERGE_SLIDE_MS);
      }, MERGE_HIGHLIGHT_MS);
    };

    runMerge(0);
  };

  const handleBridgeContinue = () => {
    playSfx("click");
    markComplete("spinnerBridge");
    advanceStep();
  };

  const handleQuizAnswer = (quizId, choice) => {
    const quiz = T.spinnerQuizzes.find((q) => q.id === quizId);
    if (choice !== quiz.correct) return;
    setQuizAnswers((prev) => ({ ...prev, [quizId]: choice }));
    markComplete(stepData.id);
  };

  const handleQuizWrong = () => {};

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
      setSpinnerCorrectHold(false);
      setFeedback("");
    }
    if (stepData.type === "spinnerSumDone") {
      setSpinnerTotalDisplay(null);
      setSumMergeAnim(null);
      setSpinnerCorrectHold(false);
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
    } else if (stepData.type === "spinnerEnter") {
      hideFtue();
    } else if (stepData.type === "spinnerQuiz") {
      if (canGoNext) {
        timeoutId = setTimeout(() => showFtue(nextButtonRef.current), 700);
      } else {
        hideFtue();
      }
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
      if (spinnerEntered[stepData.section] != null || spinnerCorrectHold) return "";
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
          stepData.type === "spinnerOverview" ||
          stepData.type === "spinnerEnter" ||
          stepData.type === "spinnerSum"
            ? true
            : stepData.type === "spinnerSumDone"
              ? spinnerTotalDisplay == null
              : false,
        sumExpression: "11 + 7 + 2 + 10",
        sumMergeAnim,
        correctHold: spinnerCorrectHold,
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
      onQuizWrong: handleQuizWrong,
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
