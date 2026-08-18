const App = () => {
  const { useCallback, useEffect, useRef, useState } = React;
  const screens = [
    { type: "builder", mode: "add" },
    { type: "builder", mode: "subtract" },
    { type: "rules" },
    ...T.lesson.problems.map((problem, problemIndex) => ({
      type: "problem",
      problem,
      problemIndex,
    })),
    { type: "end" },
  ];
  const [gameState, setGameState] = useState("welcome");
  const [screenIndex, setScreenIndex] = useState(0);
  const [screenComplete, setScreenComplete] = useState(false);
  const [resumeComplete, setResumeComplete] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [animationBusy, setAnimationBusy] = useState(false);

  const getStepFinalState = (stepIndex) => {
    const target = screens[stepIndex];
    if (!target) return null;
    if (target.type === "builder")
      return getGroupBuilderFinalState(target.mode);
    if (target.type === "rules") return getRuleExplorerFinalState();
    if (target.type === "problem")
      return getProblemSolverFinalState(target.problem);
    return { complete: true };
  };
  const startButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const backButtonRef = useRef(null);
  const startOverButtonRef = useRef(null);
  const ftueDismissedRef = useRef(false);

  const playSfx = useCallback((name) => {
    try {
      new Audio(T.sfx[name]).play().catch(() => {});
    } catch (_) {}
  }, []);
  const showFtue = (element) => {
    const hand = document.getElementById("hand-ftue");
    if (!element || !hand) return;
    const rect = element.getBoundingClientRect();
    if (element.classList.contains("group-slider")) {
      hand.style.top = `${((rect.top + rect.height / 2) / innerHeight) * 100}vh`;
      hand.style.left = `${((rect.left + rect.width * 0.15) / innerWidth) * 100}vw`;
      hand.classList.add("hand-animating", "hand-nudge-right");
    } else {
      hand.style.top = `${((rect.top + rect.height / 2) / innerHeight) * 100}vh`;
      hand.style.left = `${((rect.right - innerWidth * 0.02) / innerWidth) * 100}vw`;
      hand.classList.remove("hand-nudge-right");
      hand.classList.add("hand-animating");
    }
  };
  const hideFtue = () => {
    const hand = document.getElementById("hand-ftue");
    if (hand) hand.classList.remove("hand-animating", "hand-nudge-right");
  };

  useEffect(() => {
    ftueDismissedRef.current = false;
    hideFtue();
    let attempts = 0;
    let timer;
    const showWhenReady = () => {
      if (ftueDismissedRef.current) return;
      const target =
        gameState === "welcome"
          ? startButtonRef.current
          : screens[screenIndex]?.type === "end"
            ? startOverButtonRef.current
            : screenComplete && screenIndex < screens.length - 1
              ? nextButtonRef.current
              : instruction === T.ui.identifyPrompt ||
                  instruction === T.ui.classificationCompletePrompt ||
                  instruction === T.ui.startFinding
                ? nextButtonRef.current
                : document.querySelector(".ftue-target:not(:disabled)");
      if (target) showFtue(target);
      else if (attempts++ < 40) timer = setTimeout(showWhenReady, 250);
    };
    timer = setTimeout(showWhenReady, 700);
    return () => {
      clearTimeout(timer);
      hideFtue();
    };
  }, [gameState, screenIndex, screenComplete, instruction]);

  useEffect(() => {
    const dismissFtue = (event) => {
      const target = event.target.closest?.(".ftue-target:not(:disabled)");
      if (!target) return;
      hideFtue();
      ftueDismissedRef.current = true;
    };
    document.addEventListener("click", dismissFtue, true);
    document.addEventListener("input", dismissFtue, true);
    return () => {
      document.removeEventListener("click", dismissFtue, true);
      document.removeEventListener("input", dismissFtue, true);
    };
  }, []);

  const nextReady =
    !animationBusy &&
    (screenComplete ||
      instruction === T.ui.identifyPrompt ||
      instruction === T.ui.classificationCompletePrompt ||
      instruction === T.ui.startFinding);
  const start = () => {
    playSfx("click");
    setScreenIndex(0);
    setScreenComplete(false);
    setResumeComplete(false);
    setGameState("playing");
  };
  const next = () => {
    if (!screenComplete) {
      const internalAction = document.querySelector(
        ".story-action.ftue-target:not(:disabled)",
      );
      if (internalAction) {
        playSfx("click");
        internalAction.click();
      }
      return;
    }
    playSfx("click");
    setResumeComplete(false);
    setScreenIndex((value) => value + 1);
    setScreenComplete(false);
  };
  const back = () => {
    if (screenIndex === 0 || !nextReady) return;
    playSfx("click");
    setResumeComplete(true);
    setScreenIndex((value) => value - 1);
    setScreenComplete(true);
  };
  const restart = () => {
    playSfx("click");
    setScreenIndex(0);
    setScreenComplete(false);
    setResumeComplete(false);
    setGameState("welcome");
  };

  if (gameState === "welcome")
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(WelcomeScreen, { onStart: start, startButtonRef }),
    );
  const screen = screens[screenIndex];
  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(CompareScreen, {
      key: `${screen.type}-${screen.mode || screen.problem?.id || screenIndex}-${resumeComplete ? "done" : "fresh"}`,
      screen,
      onComplete: setScreenComplete,
      onInstruction: setInstruction,
      playSfx,
      onAnimationBusy: setAnimationBusy,
      onStartOver: restart,
      startOverButtonRef,
      initialState: resumeComplete ? getStepFinalState(screenIndex) : null,
    }),
    screen.type !== "end" &&
      React.createElement(Navigation, {
        onNext: next,
        onBack: back,
        showNext: nextReady,
        showBack: screenIndex > 0 && nextReady,
        hideNext: animationBusy,
        hideInstruction: animationBusy,
        nextButtonRef,
        backButtonRef,
        children: React.createElement(LowerPanel, {
          text: animationBusy ? "" : instruction || T.ui.continuePrompt,
        }),
      }),
  );
};
