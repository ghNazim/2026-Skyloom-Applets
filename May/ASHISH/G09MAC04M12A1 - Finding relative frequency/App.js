const App = () => {
  const { useState, useEffect, useRef } = React;
  const [gameState, setGameState] = useState("welcome");
  const [step, setStep] = useState(0);
  const [history, setHistory] = useState([]);
  const [completed, setCompleted] = useState({});
  const [marbleCounts, setMarbleCounts] = useState({ red: 0, yellow: 0, blue: 0 });
  const [marbleDraws, setMarbleDraws] = useState(0);
  const [lastMarble, setLastMarble] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isFilling, setIsFilling] = useState(false);
  const [machineFilled, setMachineFilled] = useState(false);
  const [fillTrigger, setFillTrigger] = useState(0);
  const [machineTrigger, setMachineTrigger] = useState(0);
  const [pendingMarble, setPendingMarble] = useState(null);
  const [eventProgress, setEventProgress] = useState({});
  const [spinnerCounts, setSpinnerCounts] = useState({ red: 0, green: 0, yellow: 0, blue: 0 });
  const [spinnerSpins, setSpinnerSpins] = useState(0);
  const [spinnerAngle, setSpinnerAngle] = useState(0);
  const [spinnerRunning, setSpinnerRunning] = useState(false);
  const [lastSpinner, setLastSpinner] = useState(null);
  const [lessonBusy, setLessonBusy] = useState(false);
  const [outcomeGlowBusy, setOutcomeGlowBusy] = useState(false);

  const startButtonRef = useRef(null);
  const startOverButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const backButtonRef = useRef(null);
  const lessonRef = useRef(null);
  const ftueGenRef = useRef(0);

  const stepConfig = getStepConfig(step);
  const stepData = stepConfig.stepData || {};
  const isEndStep = stepConfig.type === "end";
  const interactionBusy = isFilling || isDrawing || spinnerRunning || lessonBusy || outcomeGlowBusy;

  const startOutcomeGlow = () => {
    setOutcomeGlowBusy(true);
    setTimeout(() => setOutcomeGlowBusy(false), 1100);
  };

  const playSfx = (name) => {
    try {
      const audio = new Audio(T.sfx[name]);
      audio.play().catch(() => {});
    } catch (e) {}
  };

  const markComplete = (id) => setCompleted((prev) => ({ ...prev, [id]: true }));
  const isStepComplete = () => isEndStep || completed[stepData.id] === true;
  const canGoNext = gameState === "playing" && !isEndStep && isStepComplete() && !interactionBusy;
  const canGoBack = gameState === "playing" && history.length > 0 && isStepComplete();

  const resetAll = () => {
    setStep(0);
    setHistory([]);
    setCompleted({});
    setMarbleCounts({ red: 0, yellow: 0, blue: 0 });
    setMarbleDraws(0);
    setLastMarble(null);
    setIsDrawing(false);
    setIsFilling(false);
    setMachineFilled(false);
    setFillTrigger(0);
    setMachineTrigger(0);
    setPendingMarble(null);
    setEventProgress({});
    setSpinnerCounts({ red: 0, green: 0, yellow: 0, blue: 0 });
    setSpinnerSpins(0);
    setSpinnerAngle(0);
    setSpinnerRunning(false);
    setLastSpinner(null);
    setLessonBusy(false);
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
    setHistory((prev) => [...prev, step]);
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (!canGoBack) return;
    playSfx("click");
    const previousStep = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setStep(previousStep);
  };

  const handleFill = () => {
    if (machineFilled || isFilling) return;
    playSfx("click");
    setIsFilling(true);
    setFillTrigger((n) => n + 1);
    setTimeout(() => {
      setMachineFilled(true);
      setIsFilling(false);
      markComplete("machineFilled");
    }, 1200);
  };

  const handleDraw = () => {
    if (!machineFilled || isDrawing || marbleDraws >= T.marbleSequence.length) return;
    playSfx("split");
    setLastMarble(null);
    setPendingMarble(T.marbleSequence[marbleDraws]);
    setIsDrawing(true);
    setMachineTrigger((n) => n + 1);
  };

  const handleMarbleServed = () => {
    const color = pendingMarble || T.marbleSequence[marbleDraws];
    if (!color) return;
    setLastMarble(color);
    setMarbleCounts((prev) => ({ ...prev, [color]: prev[color] + 1 }));
    setMarbleDraws((prev) => {
      const next = prev + 1;
      if (next === T.marbleSequence.length) markComplete("marbleDraw");
      return next;
    });
    setPendingMarble(null);
    setIsDrawing(false);
    startOutcomeGlow();
    playSfx("correct");
  };

  const handleSpin = () => {
    if (spinnerRunning || spinnerSpins >= T.spinnerSequence.length) return;
    playSfx("split");
    setLastSpinner(null);
    const color = T.spinnerSequence[spinnerSpins];
    const index = T.spinnerColors.indexOf(color);
    const segment = 360 / T.spinnerColors.length;
    const targetCenter = index * segment + segment / 2;
    const currentAngle = ((spinnerAngle % 360) + 360) % 360;
    const targetAngle = 360 * 4 + ((targetCenter - 35 - currentAngle + 360) % 360);
    setSpinnerRunning(true);
    setSpinnerAngle((prev) => prev + targetAngle);
    setTimeout(() => {
      setLastSpinner(color);
      setSpinnerCounts((prev) => ({ ...prev, [color]: prev[color] + 1 }));
      setSpinnerSpins((prev) => {
        const next = prev + 1;
        if (next === T.spinnerSequence.length) markComplete("spinnerSpin");
        return next;
      });
      setSpinnerRunning(false);
      startOutcomeGlow();
      playSfx("correct");
    }, 2500);
  };

  const getProgressKey = () => `${stepData.experiment}-${stepData.eventKey}`;
  const getEffectiveEventProgress = () => {
    const progress = eventProgress[getProgressKey()] || {};
    if (
      stepData.type === "relativeEvent" &&
      stepData.eventKey !== "A" &&
      (eventProgress[`${stepData.experiment}-A`] || {}).total
    ) {
      return { ...progress, total: true };
    }
    return progress;
  };
  const revealEventPart = (part) => {
    const key = getProgressKey();
    const current = getEffectiveEventProgress();
    const event =
      stepData.experiment === "spinner"
        ? T.ui.spinnerEvents[stepData.eventKey]
        : T.ui.marbleEvents[stepData.eventKey];
    const order = event?.parts?.length
      ? ["freq", "sum", "total", "decimal", "percentage"]
      : ["freq", "total", "decimal", "percentage"];
    const needed = order.indexOf(part);
    for (let i = 0; i < needed; i += 1) {
      if (!current[order[i]]) return;
    }
    const totalAlreadyKnown = part !== "total" && !!current.total;
    const sfx =
      part === "freq" && totalAlreadyKnown
        ? "correct"
        : part === "freq" || part === "sum"
          ? "click"
          : "correct";
    playSfx(sfx);
    const next = { ...eventProgress[key] || {}, [part]: true };
    setEventProgress((prev) => ({ ...prev, [key]: next }));
    if (part === "percentage") markComplete(stepData.id);
  };

  useEffect(() => {
    if (stepData.id === "marbleReady" || stepData.id === "spinnerReady") markComplete(stepData.id);
  }, [step]);

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
      const leftPoint = isButton
        ? rect.right - window.innerWidth * 0.015
        : rect.left + rect.width / 2;
      const left = (leftPoint / window.innerWidth) * 100;
      handFtue.style.top = `${top}vh`;
      handFtue.style.left = `${left}vw`;
    }
    handFtue.classList.toggle("hand-ftue--edge", needsEdgeFlip);
    handFtue.classList.add("hand-animating");
  };

  const hideFtue = () => {
    ftueGenRef.current += 1;
    const handFtue = document.getElementById("hand-ftue");
    if (handFtue) {
      handFtue.classList.remove("hand-animating");
      handFtue.classList.remove("hand-ftue--edge");
      handFtue.classList.remove("ftue-on-nav");
    }
  };

  useEffect(() => {
    const onPointerDown = (event) => {
      if (event.target.closest("button, .ftue-target, .nav-chevron")) hideFtue();
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, []);

  useEffect(() => {
    hideFtue();
    if (interactionBusy) return undefined;
    const gen = ftueGenRef.current;
    const timer = setTimeout(() => {
      if (gen !== ftueGenRef.current) return;
      if (gameState === "welcome") showFtue(startButtonRef.current);
      else if (isEndStep) showFtue(startOverButtonRef.current);
      else {
        const target = lessonRef.current?.querySelector(".ftue-target:not(:disabled)");
        showFtue(target || (canGoNext ? nextButtonRef.current : null));
      }
    }, 700);
    return () => {
      clearTimeout(timer);
      hideFtue();
    };
  }, [gameState, step, completed, isEndStep, canGoNext, marbleDraws, isDrawing, machineFilled, isFilling, eventProgress, spinnerSpins, spinnerRunning, outcomeGlowBusy, lessonBusy, interactionBusy]);

  const getInstructionText = () => {
    if (isEndStep) return T.ui.instructionStartOver;
    if (stepData.type === "marbleDraw") {
      if (marbleDraws >= T.marbleSequence.length) return T.ui.instructionMarbleReady;
      if (!machineFilled) return T.ui.instructionFillMachine;
      return marbleDraws === 0 ? T.ui.instructionDrawFirst : T.ui.instructionDrawNext;
    }
    if (stepData.type === "marbleReady") return T.ui.instructionMarbleReady;
    if (stepData.type === "spinnerSpin") {
      if (spinnerSpins >= T.spinnerSequence.length) return T.ui.instructionSpinnerReady;
      return spinnerSpins === 0 ? T.ui.instructionSpinnerFirst : T.ui.instructionSpinnerNext;
    }
    if (stepData.type === "spinnerReady") return T.ui.instructionSpinnerReady;
    if (stepData.type === "relativeEvent") {
      const progress = getEffectiveEventProgress();
      const event =
        stepData.experiment === "spinner"
          ? T.ui.spinnerEvents[stepData.eventKey]
          : T.ui.marbleEvents[stepData.eventKey];
      if (!progress.freq) return T.ui.instructionEventFreq.replaceAll("{event}", stepData.eventKey);
      if (event?.parts?.length && !progress.sum) return T.ui.instructionEventSum;
      if (!progress.total) return T.ui.instructionEventTotal;
      if (!progress.decimal) return T.ui.instructionEventDecimal;
      if (!progress.percentage) return T.ui.instructionEventPercent;
      if (stepData.experiment === "marble" && stepData.eventKey === "D") return T.ui.instructionContinueExperiment;
      return T.ui.instructionEventNext;
    }
    return T.ui.instructionMarbleReady;
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
    { className: "applet-container" },
    React.createElement(LessonScreen, {
      ref: lessonRef,
      stepConfig,
      marbleState: { counts: marbleCounts, draws: marbleDraws, last: lastMarble, isDrawing, machineTrigger },
      machineState: { isFilling, machineFilled, fillTrigger },
      spinnerState: { counts: spinnerCounts, spins: spinnerSpins, last: lastSpinner, isSpinning: spinnerRunning, angle: spinnerAngle },
      eventProgress,
      onFill: handleFill,
      onDraw: handleDraw,
      onMarbleServed: handleMarbleServed,
      onSpin: handleSpin,
      onRevealEventPart: revealEventPart,
      onInteractionBusyChange: setLessonBusy,
      handleStartOver,
      startOverButtonRef,
    }),
    !isEndStep &&
      React.createElement(Navigation, {
        onNext: handleNext,
        onBack: handleBack,
        showNext: canGoNext,
        showBack: canGoBack,
        nextButtonRef,
        backButtonRef,
        children: React.createElement(LowerPanel, {
          text: getInstructionText(),
          hidden: interactionBusy,
        }),
      })
  );
};
