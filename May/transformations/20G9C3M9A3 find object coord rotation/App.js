const App = () => {
  const { useState, useMemo, useEffect, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [step2Phase, setStep2Phase] = useState("initial");
  const [step3Phase, setStep3Phase] = useState("initial");
  const [step4Phase, setStep4Phase] = useState("waiting");
  const [step5Phase, setStep5Phase] = useState("waiting");
  const [step6Phase, setStep6Phase] = useState("initial");
  const [visibleHighlights, setVisibleHighlights] = useState([]);
  const [showQuestionVisual, setShowQuestionVisual] = useState(false);
  const [questionVisualVisible, setQuestionVisualVisible] = useState(false);
  const [objectBoxA, setObjectBoxA] = useState(null);
  const [objectBoxB, setObjectBoxB] = useState(null);
  const [nudgePositions, setNudgePositions] = useState([]);

  const ALL_HIGHLIGHTS = [
    "highlight-rotation",
    "highlight-a-prime",
    "highlight-b-prime",
    "highlight-find",
  ];

  const resetStepStates = useCallback(() => {
    setStep2Phase("initial");
    setStep3Phase("initial");
    setStep4Phase("waiting");
    setStep5Phase("waiting");
    setStep6Phase("initial");
    setVisibleHighlights([]);
    setShowQuestionVisual(false);
    setQuestionVisualVisible(false);
    setObjectBoxA(null);
    setObjectBoxB(null);
  }, []);

  const resetEverything = useCallback(() => {
    setCurrentStep(0);
    resetStepStates();
  }, [resetStepStates]);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    resetStepStates();
    setCurrentStep(1);
  };

  const handleStep2AnimComplete = useCallback(() => {
    setStep2Phase("done");
  }, []);

  const handleVisibleHighlightsChange = useCallback((id) => {
    if (id === "all") {
      setVisibleHighlights(ALL_HIGHLIGHTS.slice());
      return;
    }
    setVisibleHighlights((prev) =>
      prev.indexOf(id) === -1 ? prev.concat([id]) : prev,
    );
  }, []);

  const handleQuestionVisualChange = useCallback((show, visible) => {
    setShowQuestionVisual(show);
    setQuestionVisualVisible(visible);
  }, []);

  const handleObjectBoxChange = useCallback((key, text) => {
    if (key === "A") setObjectBoxA(text);
    if (key === "B") setObjectBoxB(text);
  }, []);

  const handleStepAdvance = useCallback((nextStep) => {
    if (nextStep === 5) setStep5Phase("waiting");
    if (nextStep === 6) setStep6Phase("initial");
    setCurrentStep(nextStep);
  }, []);

  useEffect(() => {
    if (currentStep !== 3 || step3Phase !== "complete") return undefined;
    const id = setTimeout(() => {
      setStep4Phase("waiting");
      setCurrentStep(4);
    }, 1000);
    return () => clearTimeout(id);
  }, [currentStep, step3Phase]);

  const questionHtml = useMemo(() => {
    if (currentStep < 1 || showQuestionVisual) return "";
    if (currentStep === 1) return APP_DATA.question.textPlain;
    return APP_DATA.question.text;
  }, [currentStep, showQuestionVisual]);

  const navText = useMemo(() => {
    if (currentStep === 1) return APP_DATA.steps[1].navText;
    if (currentStep === 2 && step2Phase === "done") {
      return APP_DATA.steps[2].navTextDone;
    }
    if (currentStep === 3) return APP_DATA.steps[3].navText;
    if (currentStep === 4 && step4Phase === "waiting") {
      return APP_DATA.steps[4].navText;
    }
    if (currentStep === 5 && step5Phase === "waiting") {
      return APP_DATA.steps[5].navText;
    }
    if (currentStep === 6) {
      if (step6Phase === "done") return APP_DATA.steps[6].navTextDone;
      if (step6Phase === "panelVisible") return APP_DATA.steps[6].navText;
    }
    return "";
  }, [currentStep, step2Phase, step4Phase, step5Phase, step6Phase]);

  const navTextHidden =
    (currentStep === 2 && step2Phase === "initial") ||
    (currentStep === 4 && step4Phase === "animating") ||
    (currentStep === 5 && step5Phase === "animating") ||
    (currentStep === 6 &&
      (step6Phase === "initial" || step6Phase === "rotating"));

  const isNextDisabled =
    (currentStep === 2 && step2Phase !== "done") ||
    (currentStep >= 3 && currentStep <= 5) ||
    (currentStep === 6 && step6Phase !== "done");

  const isPrevDisabled = currentStep <= 1;

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    setNudgePositions([]);
    if (isNextDisabled) return;

    if (currentStep === 1) {
      resetStepStates();
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setStep3Phase("initial");
      setCurrentStep(3);
    } else if (currentStep === 6) {
      setCurrentStep(7);
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    setNudgePositions([]);

    if (currentStep === 2) {
      setStep2Phase("initial");
      setVisibleHighlights([]);
      setShowQuestionVisual(false);
      setQuestionVisualVisible(false);
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setStep2Phase("done");
      setStep3Phase("initial");
      setShowQuestionVisual(true);
      setQuestionVisualVisible(true);
      setVisibleHighlights(ALL_HIGHLIGHTS.slice());
      setCurrentStep(2);
    } else if (currentStep === 1) {
      resetEverything();
    }
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
      } else if (currentStep === 4 && step4Phase === "waiting") {
        addNudgeFor("graph-point-aprime");
      } else if (currentStep === 5 && step5Phase === "waiting") {
        addNudgeFor("graph-point-bprime");
      } else if (
        currentStep === 6 &&
        step6Phase === "panelVisible"
      ) {
        addNudgeFor("rotate-button");
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
  }, [
    currentStep,
    isNextDisabled,
    step2Phase,
    step3Phase,
    step4Phase,
    step5Phase,
    step6Phase,
  ]);

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
      showQuestionVisual: showQuestionVisual,
      questionVisualVisible: questionVisualVisible,
      objectBoxA: objectBoxA,
      objectBoxB: objectBoxB,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        step: currentStep,
        step2Phase: step2Phase,
        onStep2AnimComplete: handleStep2AnimComplete,
        onVisibleHighlightsChange: handleVisibleHighlightsChange,
        onQuestionVisualChange: handleQuestionVisualChange,
        step3Phase: step3Phase,
        onStep3PhaseChange: setStep3Phase,
        step4Phase: step4Phase,
        onStep4PhaseChange: setStep4Phase,
        step5Phase: step5Phase,
        onStep5PhaseChange: setStep5Phase,
        step6Phase: step6Phase,
        onStep6PhaseChange: setStep6Phase,
        onObjectBoxChange: handleObjectBoxChange,
        onStepAdvance: handleStepAdvance,
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
