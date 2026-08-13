const App = () => {
  const { useState, useEffect, useRef } = React;

  const config = getChallengeConfig();
  const [gameState, setGameState] = useState("welcome");
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState("");
  const [history, setHistory] = useState([]);
  const [forwardHistory, setForwardHistory] = useState([]);
  const [visualEpoch, setVisualEpoch] = useState(0);

  const startButtonRef = useRef(null);
  const startOverButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const backButtonRef = useRef(null);
  const compareRef = useRef(null);
  const autoAdvanceRef = useRef(null);
  const ftueResumeRef = useRef(null);
  const ftueSuppressedUntilRef = useRef(0);

  const stepConfig = getStepConfig(step);
  const stepData = stepConfig.stepData || {};
  const isEndStep = stepConfig.type === "end";
  const allCalculationsDone = (test) => {
    const prefix = test === "centre" ? "mean" : "range";
    return ["Population", "Sample1", "Sample2"].every(
      (dataset) => completed[`${prefix}${dataset}`] === true,
    );
  };
  const isCalculationOverview =
    stepData.type === "choose" &&
    ["centre", "spread"].includes(stepData.test) &&
    allCalculationsDone(stepData.test);

  const playSfx = (name) => {
    try {
      const audio = new Audio(T.sfx[name]);
      audio.play().catch(() => {});
    } catch (e) {
      // Platform audio restrictions are harmless here.
    }
  };

  const showFtue = (element) => {
    if (!element) return;
    if (Date.now() < ftueSuppressedUntilRef.current) return;
    const handFtue = document.getElementById("hand-ftue");
    if (!handFtue) return;
    const rect = element.getBoundingClientRect();
    const isButton =
      element.tagName === "BUTTON" || element.classList.contains("nav-chevron");
    const top = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
    const leftPoint = isButton ? rect.right - window.innerWidth * 0.02 : rect.left + rect.width / 2;
    const left = (leftPoint / window.innerWidth) * 100;
    handFtue.style.top = `${top}vh`;
    handFtue.style.left = `${left}vw`;
    handFtue.classList.add("hand-animating");
  };

  const hideFtue = () => {
    const handFtue = document.getElementById("hand-ftue");
    if (handFtue) handFtue.classList.remove("hand-animating");
  };

  const isStepComplete = (id = stepData.id) => {
    if (!id) return false;
    if (["info", "charts", "choose", "testDone", "summary"].includes(stepData.type)) return true;
    return completed[id] === true;
  };

  const canGoNext =
    gameState === "playing" &&
    !isEndStep &&
    isStepComplete() &&
    (forwardHistory.length > 0 ||
      isCalculationOverview ||
      !["choose", "quiz", "mean", "range"].includes(stepData.type));
  const canGoBack = gameState === "playing" && history.length > 0 && isStepComplete();

  useEffect(() => {
    const dismissFtueOnTap = (event) => {
      const target =
        event.target instanceof Element
          ? event.target.closest("button, .nav-chevron, .ftue-target")
          : null;
      if (!target || target.matches(":disabled")) return;

      ftueSuppressedUntilRef.current = Date.now() + 2300;
      hideFtue();

      if (ftueResumeRef.current) clearTimeout(ftueResumeRef.current);
      ftueResumeRef.current = setTimeout(() => {
        ftueResumeRef.current = null;
        setVisualEpoch((epoch) => epoch + 1);
      }, 2300);
    };

    document.addEventListener("pointerdown", dismissFtueOnTap, true);
    return () => {
      document.removeEventListener("pointerdown", dismissFtueOnTap, true);
      if (ftueResumeRef.current) clearTimeout(ftueResumeRef.current);
    };
  }, []);

  useEffect(() => {
    hideFtue();
    let timeoutId;

    if (gameState === "welcome") {
      timeoutId = setTimeout(() => showFtue(startButtonRef.current), 800);
    } else if (isEndStep) {
      timeoutId = setTimeout(() => showFtue(startOverButtonRef.current), 800);
    } else {
      timeoutId = setTimeout(() => {
        if (stepData && ["quiz", "finalChoice"].includes(stepData.type)) {
          if (canGoNext) {
            showFtue(nextButtonRef.current);
          }
          return;
        }
        const target = compareRef.current?.querySelector(".ftue-target:not(:disabled)");
        showFtue(target || (canGoNext ? nextButtonRef.current : null));
      }, 700);
    }

    return () => {
      clearTimeout(timeoutId);
      hideFtue();
    };
  }, [
    gameState,
    step,
    completed,
    answers,
    isEndStep,
    canGoNext,
    visualEpoch,
  ]);

  useEffect(
    () => () => {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    },
    [],
  );

  const resetPlayingState = () => {
    setStep(0);
    setCompleted({});
    setAnswers({});
    setFeedback("");
    setHistory([]);
    setForwardHistory([]);
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

  const markComplete = (id = stepData.id) => {
    setCompleted((prev) => ({ ...prev, [id]: true }));
  };

  const handleNext = () => {
    if (!canGoNext) return;
    playSfx("click");
    setFeedback("");

    if (forwardHistory.length > 0) {
      const returnStep = forwardHistory[forwardHistory.length - 1];
      setHistory((prev) => [...prev, step]);
      setForwardHistory((prev) => prev.slice(0, -1));
      setStep(returnStep);
      return;
    }

    setHistory((prev) => [...prev, step]);
    setForwardHistory([]);

    if (isCalculationOverview) {
      const quizId =
        stepData.test === "centre" ? "centreQuiz1" : "spreadQuiz1";
      setStep(config.steps.findIndex((item) => item.id === quizId));
      return;
    }

    if (stepData.type === "mean" || stepData.type === "range") {
      const currentTest = stepData.type === "mean" ? "centre" : "spread";
      const calculationSteps = currentTest === "centre"
        ? ["meanPopulation", "meanSample1", "meanSample2"]
        : ["rangePopulation", "rangeSample1", "rangeSample2"];

      const incomplete = calculationSteps.filter(id => completed[id] !== true && id !== stepData.id);
      if (incomplete.length > 0) {
        const chooseStepId = currentTest === "centre" ? "chooseCentre" : "chooseSpread";
        const chooseStepIndex = config.steps.findIndex(item => item.id === chooseStepId);
        setStep(chooseStepIndex);
        return;
      }
    }

    if (stepData.type === "testDone") {
      const tests = ["shape", "centre", "spread"];
      const allDone = tests.every((test) =>
        test === stepData.test ||
        (completed[`${test}Quiz1`] === true && completed[`${test}Quiz2`] === true)
      );
      setStep(allDone ? config.steps.findIndex((item) => item.id === "finalChoice") : 1);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (!canGoBack) return;
    playSfx("click");
    setFeedback("");
    const previousStep = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setForwardHistory((prev) => [...prev, step]);
    setStep(previousStep);
  };

  const handleChoose = (test) => {
    playSfx("click");
    const firstStepForTest = {
      shape: "shapeDraw",
      centre: "meanPopulation",
      spread: "rangePopulation",
    }[test];
    setForwardHistory([]);
    // For Centre, we default to the chooseCentre step itself now
    if (test === "centre") {
      const target = config.steps.findIndex((item) => item.id === "chooseCentre");
      setHistory((prev) => [...prev, step]);
      setFeedback("");
      setStep(target);
      return;
    }
    if (test === "spread") {
      const target = config.steps.findIndex((item) => item.id === "chooseSpread");
      setHistory((prev) => [...prev, step]);
      setFeedback("");
      setStep(target);
      return;
    }
    const target = config.steps.findIndex((item) => item.id === firstStepForTest);
    if (target < 0) return;
    setHistory((prev) => [...prev, step]);
    setFeedback("");
    setStep(target);
  };

  const handleChooseDataset = (stepId) => {
    playSfx("click");
    const target = config.steps.findIndex((item) => item.id === stepId);
    if (target < 0) return;
    setForwardHistory([]);
    setHistory((prev) => [...prev, step]);
    setFeedback("");
    setStep(target);
  };

  const handleDraw = (drawKey) => {
    playSfx("split");
    const current = completed[stepData.id] || {};
    const next = { ...current, [drawKey]: true };
    setCompleted((prev) => ({
      ...prev,
      [stepData.id]: next.population && next.sample1 && next.sample2 ? true : next,
    }));
  };

  const handleFormulaTap = (part) => {
    playSfx(part === "answer" ? "correct" : "click");
    const current = completed[stepData.id] || {};
    const next = { ...current, [part]: true };
    const required = stepData.type === "mean" ? ["numerator", "denominator", "answer"] : ["high", "low", "answer"];
    const done = required.every((item) => next[item]);
    setCompleted((prev) => ({ ...prev, [stepData.id]: done ? true : next }));
    if (done) {
      const chooseStepId =
        stepData.type === "mean" ? "chooseCentre" : "chooseSpread";
      const chooseStepIndex = config.steps.findIndex(
        (item) => item.id === chooseStepId,
      );
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = setTimeout(() => {
        setHistory((prev) => [...prev, step]);
        setForwardHistory([]);
        setFeedback("");
        setStep(chooseStepIndex);
      }, 1000);
    }
  };

  const handleQuizAnswer = (choice) => {
    const correct = T.testResults[stepData.test][stepData.sample];
    const isCorrect = choice === correct;
    const key = `${stepData.test}-${stepData.sample}`;
    setAnswers((prev) => ({ ...prev, [key]: choice }));
    setFeedback(getQuizFeedback(stepData, isCorrect));
    playSfx(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      markComplete();
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = setTimeout(() => {
        setHistory((prev) => [...prev, step]);
        setForwardHistory([]);
        setFeedback("");
        setStep((prev) => prev + 1);
      }, 980);
    }
  };

  const getQuizFeedback = (data, isCorrect) => {
    if (isCorrect) return "";
    const sampleNum = data.sample === "sample1" ? "1" : "2";
    const key = `wrong${data.test[0].toUpperCase()}${data.test.slice(1)}${sampleNum}`;
    return T.ui[key] || "";
  };

  const handleFinalChoice = (sampleId) => {
    const isCorrect = sampleId === "sample2";
    setAnswers((prev) => ({ ...prev, finalChoice: sampleId }));
    setFeedback(isCorrect ? T.ui.finalCorrect : T.ui.finalWrong);
    playSfx(isCorrect ? "correct" : "wrong");
    if (isCorrect) markComplete();
  };

  const getInstructionText = () => {
    if (isEndStep) return T.ui.instructionStartOver;
    if (stepData.type === "charts") return T.ui.instructionData;
    if (stepData.type === "choose") {
      if (stepData.test === "centre" && allCalculationsDone("centre"))
        return "Tap » to find which sample passes the Centre test.";
      if (stepData.test === "spread" && allCalculationsDone("spread"))
        return "Tap » to find which sample passes the Spread test.";
      if (stepData.test === "centre") return "Tap 'Mean...' to find centre of each diagram.";
      if (stepData.test === "spread") return "Tap 'Range...' to find the spread of each.";
      return T.ui.instructionChoose;
    }
    if (stepData.type === "draw") return isStepComplete() ? T.ui.shapeReady : T.ui.instructionDraw;
    if (stepData.type === "mean") {
      if (isStepComplete()) return T.ui.instructionTapContinue;
      const state = completed[stepData.id] || {};
      if (!state.numerator) return "Tap 'Sum of (xᵢ × fᵢ)' to find the sum of all values.";
      if (!state.denominator) return "Tap 'Sum of (fᵢ)' to find the total number of values.";
      return "Tap ? to reveal the final answer.";
    }
    if (stepData.type === "range") {
      if (isStepComplete()) return T.ui.instructionTapContinue;
      const state = completed[stepData.id] || {};
      if (!state.high) return `Tap '${T.ui.highestValue}'.`;
      if (!state.low) return `Tap '${T.ui.lowestValue}'.`;
      return `Tap ${T.ui.revealAnswer} to reveal the final answer.`;
    }
    if (stepData.type === "testDone") {
      if (stepData.test === "shape") return T.ui.instructionOtherTests;
      if (stepData.test === "centre") return T.ui.instructionRemainingTests;
      return T.ui.instructionChooseRepresentative;
    }
    if (stepData.type === "quiz") return T.ui.instructionQuiz;
    if (stepData.type === "finalChoice") {
      if (isStepComplete()) return T.ui.instructionSummarize;
      if (answers.finalChoice) return T.ui.instructionFinalWrong;
      return T.ui.instructionFinal;
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
    { className: "applet-container" },
    React.createElement(CompareScreen, {
      ref: compareRef,
      stepConfig,
      completed,
      answers,
      feedback,
      onChoose: handleChoose,
      onChooseDataset: handleChooseDataset,
      onDraw: handleDraw,
      onFormulaTap: handleFormulaTap,
      onQuizAnswer: handleQuizAnswer,
      onFinalChoice: handleFinalChoice,
      onVisualStateChange: () => setVisualEpoch((value) => value + 1),
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
        children: React.createElement(LowerPanel, { text: getInstructionText() }),
      })
  );
};
