const App = () => {
  const { useEffect, useRef, useState } = React;

  const config = getChallengeConfig();
  const [gameState, setGameState] = useState("welcome");
  const [step, setStep] = useState(0);
  const [history, setHistory] = useState([]);
  const [recordedPoints, setRecordedPoints] = useState({ putu: [], sondang: [] });
  const [formulaAnswer, setFormulaAnswer] = useState(null);
  const [revealedFreq, setRevealedFreq] = useState({ putu: false, sondang: false });
  const [revealIndex, setRevealIndex] = useState(0);
  const [activeRevealRow, setActiveRevealRow] = useState(null);
  const [activeRevealStep, setActiveRevealStep] = useState(0);
  const [revealAnimating, setRevealAnimating] = useState(false);
  const [changeIndex, setChangeIndex] = useState({ putu: 0, sondang: 0 });
  const [changeInputs, setChangeInputs] = useState({ putu: "?", sondang: "?" });
  const [changeFeedback, setChangeFeedback] = useState(null);
  const [changeAwaitingNext, setChangeAwaitingNext] = useState({ putu: false, sondang: false });
  const [changePanelHold, setChangePanelHold] = useState({ putu: false, sondang: false });
  const [revealTriggered, setRevealTriggered] = useState({ putu: false, sondang: false });
  const [questionAnswers, setQuestionAnswers] = useState({});
  const [formulaFlyDone, setFormulaFlyDone] = useState(false);
  const [formulaBlinkWrong, setFormulaBlinkWrong] = useState(false);
  const [questionBlinkWrong, setQuestionBlinkWrong] = useState(false);

  const startButtonRef = useRef(null);
  const startOverButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const backButtonRef = useRef(null);
  const screenRef = useRef(null);

  const stepConfig = getStepConfig(step);
  const stepData = stepConfig.stepData || {};
  const isEndStep = stepConfig.type === "end";
  const LAST_CHANGE_IDX = 4;

  const getPerson = (id) => T.people.find((person) => person.id === id);

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
    const isButton = element.tagName === "BUTTON" || element.classList.contains("nav-chevron");
    const top = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
    const leftPoint = isButton ? rect.right - window.innerWidth * 0.02 : rect.left + rect.width / 2;
    handFtue.style.top = `${top}vh`;
    handFtue.style.left = `${(leftPoint / window.innerWidth) * 100}vw`;
    handFtue.classList.add("hand-animating");
  };

  const hideFtue = () => {
    const handFtue = document.getElementById("hand-ftue");
    if (handFtue) handFtue.classList.remove("hand-animating");
  };

  const normalizeChange = (value) => {
    const trimmed = String(value || "").trim().replace(/\s+/g, "");
    if (!trimmed) return "";
    let sign = "";
    let rest = trimmed;
    if (trimmed.startsWith("+")) {
      sign = "+";
      rest = trimmed.slice(1);
    } else if (trimmed.startsWith("-")) {
      sign = "-";
      rest = trimmed.slice(1);
    }
    const num = parseInt(rest, 10);
    if (isNaN(num)) return trimmed;
    if (num === 0) return "0";
    if (sign === "-") {
      return `-${num}`;
    } else {
      return `+${num}`;
    }
  };

  const isStepComplete = () => {
    if (isEndStep) return true;
    const type = stepData.type;
    const personId = stepData.person;
    if (type === "intro") return true;
    if (type === "graphRecord") return recordedPoints[personId].length === 5;
    if (type === "formula") return formulaAnswer === "right" && formulaFlyDone;
    if (type === "revealFreq") return revealedFreq[personId];
    if (type === "enterChanges") return changeIndex[personId] >= 5;
    if (type === "mistakeQuestion") {
      const expected = personId === "putu" ? "no" : "yes";
      return questionAnswers[personId] === expected;
    }
    if (type === "explainMistake") return true;
    return false;
  };

  const canGoNext = () => {
    if (gameState !== "playing" || isEndStep || revealAnimating) return false;
    return isStepComplete();
  };
  const canGoBack = gameState === "playing" && history.length > 0 && !revealAnimating;

  const resetAll = () => {
    setStep(0);
    setHistory([]);
    setRecordedPoints({ putu: [], sondang: [] });
    setFormulaAnswer(null);
    setRevealedFreq({ putu: false, sondang: false });
    setRevealIndex(0);
    setActiveRevealRow(null);
    setActiveRevealStep(0);
    setRevealAnimating(false);
    setChangeIndex({ putu: 0, sondang: 0 });
    setChangeInputs({ putu: "?", sondang: "?" });
    setChangeFeedback(null);
    setChangeAwaitingNext({ putu: false, sondang: false });
    setChangePanelHold({ putu: false, sondang: false });
    setRevealTriggered({ putu: false, sondang: false });
    setQuestionAnswers({});
    setFormulaFlyDone(false);
    setFormulaBlinkWrong(false);
    setQuestionBlinkWrong(false);
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
    if (!canGoNext()) return;
    playSfx("click");

    if (stepData.type === "enterChanges") {
      const personId = stepData.person;
      if (changePanelHold[personId]) {
        setChangePanelHold((prev) => ({ ...prev, [personId]: false }));
        setChangeFeedback(null);
        setChangeInputs((prev) => ({ ...prev, [personId]: "?" }));
        setHistory((prev) => [...prev, step]);
        setStep((prev) => prev + 1);
        return;
      }
      if (changeAwaitingNext[personId]) {
        if (changeIndex[personId] >= LAST_CHANGE_IDX) {
          setChangeIndex((prev) => ({ ...prev, [personId]: LAST_CHANGE_IDX + 1 }));
          setChangeAwaitingNext((prev) => ({ ...prev, [personId]: false }));
          setChangePanelHold((prev) => ({ ...prev, [personId]: true }));
          return;
        }
        setChangeAwaitingNext((prev) => ({ ...prev, [personId]: false }));
        setChangeFeedback(null);
        setChangeInputs((prev) => ({ ...prev, [personId]: "?" }));
        setChangeIndex((prev) => ({ ...prev, [personId]: prev[personId] + 1 }));
        return;
      }
    }

    setChangeFeedback(null);
    setHistory((prev) => [...prev, step]);
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (!canGoBack) return;
    playSfx("click");
    setChangeFeedback(null);
    setChangeAwaitingNext({ putu: false, sondang: false });
    setChangePanelHold({ putu: false, sondang: false });
    const previousStep = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setStep(previousStep);
  };

  const handlePointTap = (personId, trial) => {
    setRecordedPoints((prev) => {
      if (prev[personId].includes(trial)) return prev;
      playSfx("split");
      return { ...prev, [personId]: [...prev[personId], trial] };
    });
  };

  const handleFormulaAnswer = (answer) => {
    setFormulaAnswer(answer);
    setFormulaBlinkWrong(answer === "wrong");
    playSfx(answer === "right" ? "correct" : "wrong");
  };

  const handleRevealFreq = (personId) => {
    if (revealAnimating || revealTriggered[personId]) return;
    setRevealTriggered((prev) => ({ ...prev, [personId]: true }));
    setRevealAnimating(true);
    setRevealIndex(0);

    const STEP_MS = 546;
    const ANSWER_HOLD = 910;
    const ROW_GAP = 364;

    const runRowStep = (row, stepVal) => {
      setActiveRevealRow(row);
      setActiveRevealStep(stepVal);

      if (stepVal === 1) {
        playSfx("split");
        setTimeout(() => runRowStep(row, 2), STEP_MS);
      } else if (stepVal === 2) {
        setTimeout(() => runRowStep(row, 3), STEP_MS);
      } else if (stepVal === 3) {
        playSfx("split");
        setTimeout(() => runRowStep(row, 4), STEP_MS);
      } else if (stepVal === 4) {
        setTimeout(() => runRowStep(row, 5), STEP_MS);
      } else if (stepVal === 5) {
        playSfx("correct");
        setTimeout(() => {
          setRevealIndex(row + 1);
          setActiveRevealRow(null);
          setActiveRevealStep(0);

          if (row < 4) {
            setTimeout(() => runRowStep(row + 1, 1), ROW_GAP);
          } else {
            setRevealedFreq((prev) => ({ ...prev, [personId]: true }));
            setRevealAnimating(false);
          }
        }, ANSWER_HOLD);
      }
    };

    runRowStep(0, 1);
  };

  const handleChangeInput = (personId, value) => {
    setChangeInputs((prev) => ({ ...prev, [personId]: value }));
    setChangeFeedback(null);
    setChangeAwaitingNext((prev) => ({ ...prev, [personId]: false }));
  };

  const buildChangeMessage = (person, idx, expected, template) =>
    template
      .replace(/\{prevTrial\}/g, idx)
      .replace(/\{trial\}/g, idx + 1)
      .replace(/\{prev\}/g, person.freq[idx - 1])
      .replace(/\{current\}/g, person.freq[idx])
      .replace(/\{answer\}/g, expected);

  const handleChangeSubmit = (personId) => {
    const person = getPerson(personId);
    const idx = changeIndex[personId];
    const expected = person.changes[idx];
    const value = normalizeChange(changeInputs[personId]);

    if (value === expected) {
      playSfx("correct");
      setChangeFeedback(null);
      setChangeAwaitingNext((prev) => ({ ...prev, [personId]: true }));
      
      // Auto-advance to the next trial/step after 2 seconds
      setTimeout(() => {
        setChangeAwaitingNext((prev) => {
          if (!prev[personId]) return prev;
          const nextState = { ...prev, [personId]: false };
          if (idx >= LAST_CHANGE_IDX) {
            setChangeIndex((pIndex) => ({ ...pIndex, [personId]: LAST_CHANGE_IDX + 1 }));
            setChangePanelHold((pHold) => ({ ...pHold, [personId]: false }));
          } else {
            setChangeFeedback(null);
            setChangeInputs((pInputs) => ({ ...pInputs, [personId]: "?" }));
            setChangeIndex((pIndex) => ({ ...pIndex, [personId]: idx + 1 }));
          }
          return nextState;
        });
      }, 2000);
      return;
    }

    playSfx("wrong");
    const message =
      idx === 0
        ? buildChangeMessage(person, idx, expected, T.ui.wrongFirstChange)
        : buildChangeMessage(person, idx, expected, T.ui.wrongLaterChange);
    setChangeFeedback({ type: "wrong", message });
  };

  const handleFormulaFlyComplete = () => {
    setFormulaFlyDone(true);
  };

  const handleQuestionAnswer = (personId, answer) => {
    const expected = personId === "putu" ? "no" : "yes";
    if (questionAnswers[personId] === expected) return;
    setQuestionAnswers((prev) => ({ ...prev, [personId]: answer }));
    setQuestionBlinkWrong(answer !== expected);
    playSfx(answer === expected ? "correct" : "wrong");
  };

  const getInstructionText = () => {
    if (isEndStep) return T.ui.instructionStartOver;
    if (gameState === "welcome") return T.ui.tapStartToBegin;
    if (revealAnimating) return "";
    if (stepData.type === "intro") return T.ui.instructionSeeTable;
    if (stepData.type === "graphRecord") {
      return isStepComplete() ? T.ui.instructionFindFH : T.ui.instructionTapPoints;
    }
    if (stepData.type === "formula") {
      if (formulaAnswer === "right" && formulaFlyDone) return T.ui.instructionFindFHValues;
      return isStepComplete() ? T.ui.instructionFindFHValues : T.ui.instructionFormula;
    }
    if (stepData.type === "revealFreq") {
      return isStepComplete() ? T.ui.instructionRecordChanges : T.ui.instructionReveal;
    }
    if (stepData.type === "enterChanges") {
      const personId = stepData.person;
      if (changePanelHold[personId]) return T.ui.changesDonePrompt;
      if (changeIndex[personId] >= 5) return T.ui.changesDonePrompt;
      return T.ui.enterChangePrompt.replace("{trial}", changeIndex[personId] + 1);
    }
    if (stepData.type === "mistakeQuestion") {
      if (isStepComplete() && stepData.person === "putu") return T.ui.instructionStudySondang;
      if (isStepComplete() && stepData.person === "sondang") return T.ui.instructionSeeMistake;
      return T.ui.instructionQuestion;
    }
    if (stepData.type === "explainMistake") return T.ui.instructionStartOver;
    return T.ui.instructionTapContinue;
  };

  useEffect(() => {
    const type = stepData.type;
    const personId = stepData.person;
    if (!personId) return;

    if (type === "revealFreq" && !revealedFreq[personId]) {
      setRevealIndex(0);
      setActiveRevealRow(null);
      setActiveRevealStep(0);
    }

    if (personId === "sondang" && ["enterChanges", "mistakeQuestion", "explainMistake"].includes(type)) {
      setFormulaAnswer("right");
      setFormulaFlyDone(true);
    }

    if (personId === "sondang" && type === "revealFreq") {
      setFormulaAnswer("right");
      if (revealedFreq[personId] || revealTriggered[personId]) {
        setFormulaFlyDone(true);
      } else {
        setFormulaFlyDone(false);
      }
    }

    if (type === "formula") {
      setFormulaFlyDone(false);
      setFormulaBlinkWrong(false);
    }

    if (type === "mistakeQuestion") {
      setQuestionBlinkWrong(false);
    }

    if (type === "enterChanges") {
      setChangeIndex((prev) => ({ ...prev, [personId]: 0 }));
      setChangeInputs((prev) => ({ ...prev, [personId]: "?" }));
      setChangeFeedback(null);
      setChangeAwaitingNext((prev) => ({ ...prev, [personId]: false }));
      setChangePanelHold((prev) => ({ ...prev, [personId]: false }));
    }
  }, [step]);

  useEffect(() => {
    hideFtue();
    let timeoutId;
    if (gameState === "welcome") {
      timeoutId = setTimeout(() => showFtue(startButtonRef.current), 800);
    } else if (isEndStep) {
      timeoutId = setTimeout(() => showFtue(startOverButtonRef.current), 800);
    } else {
      timeoutId = setTimeout(() => {
        const target = screenRef.current?.querySelector(".ftue-target:not(:disabled)");
        showFtue(target || (canGoNext() ? nextButtonRef.current : null));
      }, 650);
    }
    return () => {
      clearTimeout(timeoutId);
      hideFtue();
    };
  }, [
    gameState,
    step,
    recordedPoints,
    formulaAnswer,
    revealedFreq,
    changeIndex,
    changeInputs,
    changeFeedback,
    changeAwaitingNext,
    changePanelHold,
    questionAnswers,
    isEndStep,
    revealAnimating,
    formulaFlyDone,
    formulaBlinkWrong,
    questionBlinkWrong,
  ]);

  if (isEndStep) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(EndScreen, { onStartOver: handleStartOver, startOverButtonRef })
    );
  }

  const isWelcome = gameState === "welcome";
  const isExplain = stepData.type === "explainMistake";

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(ChallengeScreen, {
      ref: screenRef,
      isWelcome,
      stepConfig,
      recordedPoints,
      formulaAnswer,
      revealedFreq,
      revealIndex,
      activeRevealRow,
      activeRevealStep,
      revealAnimating,
      formulaFlyDone,
      formulaBlinkWrong,
      questionBlinkWrong,
      changeIndex,
      changeInputs,
      changeFeedback,
      changeAwaitingNext,
      changePanelHold,
      revealTriggered,
      questionAnswers,
      onPointTap: handlePointTap,
      onFormulaAnswer: handleFormulaAnswer,
      onRevealFreq: handleRevealFreq,
      onChangeInput: handleChangeInput,
      onChangeSubmit: handleChangeSubmit,
      onQuestionAnswer: handleQuestionAnswer,
      onFormulaFlyComplete: handleFormulaFlyComplete,
      onHideFtue: hideFtue,
    }),
    React.createElement(Navigation, {
      onNext: isWelcome ? handleStart : isExplain ? handleStartOver : handleNext,
      onBack: handleBack,
      showNext: isWelcome || isExplain || canGoNext(),
      showBack: !isWelcome && canGoBack,
      showTeeter: gameState === "playing" && !isEndStep && canGoNext() && !revealAnimating,
      nextButtonRef: isWelcome ? startButtonRef : isExplain ? startOverButtonRef : nextButtonRef,
      backButtonRef,
      nextLabel: isWelcome ? T.ui.startButton : isExplain ? T.ui.startOverButton : undefined,
      nextClassName: isWelcome
        ? "nav-chevron next nav-start-btn ftue-target"
        : isExplain
          ? "nav-chevron next nav-start-btn"
          : undefined,
      children: React.createElement(LowerPanel, { text: getInstructionText() }),
    })
  );
};
