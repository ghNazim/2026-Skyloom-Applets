const DEV_START_STEP = 7;

const App = () => {
  const { useState, useMemo, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(DEV_START_STEP);
  const [step1Phase, setStep1Phase] = useState("initial");
  const [step2Phase, setStep2Phase] = useState("initial");
  const [step6Phase, setStep6Phase] = useState("initial");
  const [visibleHighlights, setVisibleHighlights] = useState([]);
  const [nudgePositions, setNudgePositions] = useState([]);
  const [resetEpoch, setResetEpoch] = useState(0);
  const [mathNav, setMathNav] = useState({
    text: "",
    hidden: true,
    nudgeId: null,
  });

  const resetStepStates = useCallback(() => {
    setStep1Phase("initial");
    setStep2Phase("initial");
    setStep6Phase("initial");
    setVisibleHighlights([]);
    setMathNav({ text: "", hidden: true, nudgeId: null });
  }, []);

  const resetEverything = useCallback(() => {
    setCurrentStep(0);
    setResetEpoch((epoch) => epoch + 1);
    resetStepStates();
  }, [resetStepStates]);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    resetStepStates();
    setCurrentStep(1);
  };

  const handleStep1AnimComplete = useCallback(() => {
    setStep1Phase("done");
  }, []);

  const handleStep2AnimComplete = useCallback(() => {
    setStep2Phase("done");
  }, []);

  const handleVisibleHighlightsChange = useCallback((id) => {
    if (id === "clear") {
      setVisibleHighlights([]);
      return;
    }
    setVisibleHighlights((prev) =>
      prev.indexOf(id) === -1 ? prev.concat([id]) : prev,
    );
  }, []);

  const handleStepAdvance = useCallback((nextStep) => {
    setCurrentStep(nextStep);
  }, []);

  const handleMathNavChange = useCallback((nav) => {
    setMathNav(nav);
  }, []);

  const restoreFreshStep = useCallback(
    (targetStep) => {
      setNudgePositions([]);
      setResetEpoch((epoch) => epoch + 1);
      resetStepStates();

      if (targetStep >= 1) {
        setStep1Phase(targetStep === 1 ? "initial" : "done");
      }
      if (targetStep >= 2) {
        setStep2Phase(targetStep === 2 ? "initial" : "done");
        if (targetStep >= 3) {
          setVisibleHighlights([]);
        }
      }
      if (targetStep >= 6) {
        setStep6Phase("done");
      } else {
        setStep6Phase("initial");
      }

      setCurrentStep(targetStep);
    },
    [resetStepStates],
  );

  const questionHtml = useMemo(() => {
    if (currentStep < 1) return "";
    return APP_DATA.question.text;
  }, [currentStep]);

  const navText = useMemo(() => {
    if (currentStep === 1 && step1Phase === "done") {
      return APP_DATA.steps[1].navTextDone;
    }
    if (currentStep === 2 && step2Phase === "done") {
      return APP_DATA.steps[2].navTextDone;
    }
    if (currentStep >= 3 && currentStep <= 5) {
      return APP_DATA.steps[3].navText;
    }
    if (currentStep === 6 && step6Phase === "done") {
      return APP_DATA.steps[6].navTextDone;
    }
    if (currentStep >= 7 && currentStep <= 9) {
      return mathNav.text;
    }
    return "";
  }, [currentStep, step1Phase, step2Phase, step6Phase, mathNav.text]);

  const navTextHidden =
    (currentStep === 1 && step1Phase !== "done") ||
    (currentStep === 2 && step2Phase !== "done") ||
    (currentStep === 6 &&
      (step6Phase === "initial" || step6Phase === "animating")) ||
    (currentStep >= 7 && currentStep <= 9 && mathNav.hidden);

  const isAnimationRunning = navTextHidden;

  const isNextDisabled =
    (currentStep === 1 && step1Phase !== "done") ||
    (currentStep === 2 && step2Phase !== "done") ||
    (currentStep === 6 && step6Phase !== "done") ||
    currentStep >= 7;

  const isPrevDisabled = currentStep <= 1 || isAnimationRunning;

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    setNudgePositions([]);
    if (isNextDisabled) return;

    if (currentStep === 5) {
      setStep6Phase("initial");
    }
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (isPrevDisabled) return;
    restoreFreshStep(currentStep - 1);
  };

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
      } else if (currentStep === 6 && step6Phase === "done") {
        addNudgeFor("step-card-clickable");
      } else if (currentStep >= 7 && currentStep <= 9 && mathNav.nudgeId) {
        addNudgeFor(mathNav.nudgeId);
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
  }, [currentStep, isNextDisabled, step6Phase, mathNav.nudgeId]);

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
      html: questionHtml,
      visibleHighlights: visibleHighlights,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        key: "main-" + resetEpoch,
        step: currentStep,
        step1Phase: step1Phase,
        onStep1AnimComplete: handleStep1AnimComplete,
        onVisibleHighlightsChange: handleVisibleHighlightsChange,
        step2Phase: step2Phase,
        onStep2AnimComplete: handleStep2AnimComplete,
        step6Phase: step6Phase,
        onStep6PhaseChange: setStep6Phase,
        onStepAdvance: handleStepAdvance,
        onMathNavChange: handleMathNavChange,
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
        navTextHidden: navTextHidden,
      }),
    ),
    renderNudges(),
  );
};
