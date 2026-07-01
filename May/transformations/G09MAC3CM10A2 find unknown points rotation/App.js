const App = () => {
  const { useState, useMemo, useEffect, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(1);
  const [step2Phase, setStep2Phase] = useState("initial");
  const [step3Phase, setStep3Phase] = useState("initial");
  const [activeHighlight, setActiveHighlight] = useState(null);
  const [nudgePositions, setNudgePositions] = useState([]);

  const [step4Phase, setStep4Phase] = useState("mcq");
  const [step4Selected, setStep4Selected] = useState(null);
  const [step4Feedback, setStep4Feedback] = useState(null);
  const [blinkCell, setBlinkCell] = useState(null);

  const [step5Phase, setStep5Phase] = useState("entering");
  const [step5Selected, setStep5Selected] = useState(null);
  const [step5Feedback, setStep5Feedback] = useState(null);

  const [step6Phase, setStep6Phase] = useState("initial");
  const [step7Phase, setStep7Phase] = useState("waiting");
  const [step8Phase, setStep8Phase] = useState("waiting");
  const [step8ExitPhase, setStep8ExitPhase] = useState("idle");
  const [step9Phase, setStep9Phase] = useState("initial");

  const [navAnimating, setNavAnimating] = useState(false);

  const blinkTableCell = useCallback((cellKey) => {
    setBlinkCell(cellKey);
    setTimeout(() => setBlinkCell(null), 1400);
  }, []);

  const resetMcqSteps = useCallback(() => {
    setStep4Phase("mcq");
    setStep4Selected(null);
    setStep4Feedback(null);
    setBlinkCell(null);
    setStep5Phase("entering");
    setStep5Selected(null);
    setStep5Feedback(null);
    setStep6Phase("initial");
    setStep7Phase("waiting");
    setStep8Phase("waiting");
    setStep8ExitPhase("idle");
    setStep9Phase("initial");
    setNavAnimating(false);
  }, []);

  const resetEverything = useCallback(() => {
    setCurrentStep(1);
    setStep2Phase("initial");
    setStep3Phase("initial");
    setActiveHighlight(null);
    setNudgePositions([]);
    resetMcqSteps();
  }, [resetMcqSteps]);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
  };

  const handleStep2AnimComplete = useCallback(() => {
    setStep2Phase("done");
    setActiveHighlight(null);
  }, []);

  const handleHighlightChange = useCallback((id) => {
    setActiveHighlight(id);
  }, []);

  const handleStep4Select = useCallback(
    (index) => {
      if (step4Phase === "correct") return;
      const mcq = APP_DATA.mcq.step4;
      setStep4Selected(index);
      setStep4Phase("selected");
      setStep4Feedback(null);
      const isCorrect = index === mcq.correctIndex;
      if (typeof playSound === "function") {
        playSound(isCorrect ? "correct" : "wrong");
      }
      setTimeout(() => {
        if (isCorrect) {
          setStep4Feedback({ type: "correct", text: mcq.feedbackCorrect });
          setStep4Phase("correct");
        } else {
          const text =
            index === 1 ? mcq.feedbackWrongQ : mcq.feedbackWrongR;
          setStep4Feedback({ type: "wrong", text: text });
          setStep4Phase("wrong");
          if (index === 2) blinkTableCell("pre-r");
          if (index === 1) blinkTableCell("img-q");
        }
      }, 500);
    },
    [blinkTableCell, step4Phase],
  );

  const handleStep5Select = useCallback(
    (index) => {
      if (step5Phase === "rotationFly" || step5Phase === "done") return;
      const mcq = APP_DATA.mcq.step5;
      setStep5Selected(index);
      setStep5Phase("selected");
      setStep5Feedback(null);
      const isCorrect = index === mcq.correctIndex;
      if (typeof playSound === "function") {
        playSound(isCorrect ? "correct" : "wrong");
      }
      setTimeout(() => {
        if (isCorrect) {
          setStep5Phase("rotationFly");
          setNavAnimating(true);
        } else {
          setStep5Feedback({ type: "wrong", text: mcq.feedbackWrong });
          setStep5Phase("wrong");
        }
      }, 500);
    },
    [step5Phase],
  );

  const handleStep6Apply = useCallback(() => {
    if (typeof playSound === "function") playSound("click");
    setNavAnimating(true);
    setStep6Phase("applying");
  }, []);

  const handleStep8TransitionComplete = useCallback(() => {
    setStep8ExitPhase("idle");
    setCurrentStep(9);
    setStep9Phase("initial");
  }, []);

  const handleStartOver = useCallback(() => {
    if (typeof playSound === "function") playSound("click");
    resetEverything();
  }, [resetEverything]);

  const questionHtml = useMemo(() => {
    if (currentStep < 1) return "";
    if (currentStep === 2) return APP_DATA.question.text;
    if (currentStep === 9) return APP_DATA.question.textStep9;
    return APP_DATA.question.textPlain;
  }, [currentStep]);

  const questionHighlightId = useMemo(() => {
    if (currentStep === 9) return "highlight-solve-phrase";
    return activeHighlight;
  }, [currentStep, activeHighlight]);

  const navText = useMemo(() => {
    if (navAnimating) return "";

    if (currentStep === 1) return APP_DATA.steps[1].navText;
    if (currentStep === 2) {
      return step2Phase === "done" ? APP_DATA.steps[2].navTextDone : "";
    }
    if (currentStep === 3) {
      return step3Phase === "done" ? APP_DATA.steps[3].navTextDone : "";
    }
    if (currentStep === 4) {
      if (step4Phase === "correct") return APP_DATA.steps[4].navTextDone;
      if (
        step4Phase === "mcq" ||
        step4Phase === "wrong" ||
        step4Phase === "selected"
      ) {
        return APP_DATA.steps[4].navText;
      }
      return "";
    }
    if (currentStep === 5) {
      if (step5Phase === "done") return APP_DATA.steps[5].navTextDone;
      if (
        step5Phase === "mcq" ||
        step5Phase === "wrong" ||
        step5Phase === "selected"
      ) {
        return APP_DATA.steps[5].navText;
      }
      return "";
    }
    if (currentStep === 6) {
      return step6Phase === "done"
        ? APP_DATA.steps[6].navTextDone
        : APP_DATA.steps[6].navText;
    }
    if (currentStep === 7) {
      return step7Phase === "done"
        ? APP_DATA.steps[7].navTextDone
        : APP_DATA.steps[7].navText;
    }
    if (currentStep === 8) {
      return step8Phase === "done"
        ? APP_DATA.steps[8].navTextDone
        : APP_DATA.steps[8].navText;
    }
    return "";
  }, [
    currentStep,
    step2Phase,
    step3Phase,
    step4Phase,
    step5Phase,
    step6Phase,
    step7Phase,
    step8Phase,
    navAnimating,
  ]);

  const navTextHidden =
    (currentStep === 2 && step2Phase === "initial") ||
    (currentStep === 3 && step3Phase === "initial") ||
    (currentStep === 5 &&
      (step5Phase === "entering" ||
        step5Phase === "formulaAnim" ||
        step5Phase === "rotationFly")) ||
    navAnimating ||
    currentStep === 9;

  const isNextDisabled =
    (currentStep === 2 && step2Phase !== "done") ||
    (currentStep === 3 && step3Phase !== "done") ||
    (currentStep === 4 && step4Phase !== "correct") ||
    (currentStep === 5 && step5Phase !== "done") ||
    (currentStep === 6 && step6Phase !== "done") ||
    (currentStep === 7 && step7Phase !== "done") ||
    (currentStep === 8 && step8Phase !== "done") ||
    step8ExitPhase === "transitioning" ||
    currentStep === 9;

  const isPrevDisabled =isNextDisabled || currentStep<=1;

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    setNudgePositions([]);
    if (isNextDisabled) return;

    if (currentStep === 1) {
      setStep2Phase("initial");
      setActiveHighlight(null);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setStep3Phase("initial");
      setActiveHighlight(null);
      setCurrentStep(3);
    } else if (currentStep === 3) {
      resetMcqSteps();
      setStep4Phase("mcq");
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setStep5Phase("entering");
      setStep5Selected(null);
      setStep5Feedback(null);
      setCurrentStep(5);
    } else if (currentStep === 5) {
      setStep6Phase("initial");
      setCurrentStep(6);
    } else if (currentStep === 6) {
      setStep7Phase("waiting");
      setCurrentStep(7);
    } else if (currentStep === 7) {
      setStep8Phase("waiting");
      setCurrentStep(8);
    } else if (currentStep === 8) {
      setNavAnimating(true);
      setStep8ExitPhase("transitioning");
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    setNudgePositions([]);

    if (currentStep === 2) {
      setStep2Phase("initial");
      setActiveHighlight(null);
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setStep2Phase("done");
      setActiveHighlight(null);
      setCurrentStep(2);
    } else if (currentStep === 4) {
      setStep3Phase("done");
      setCurrentStep(3);
    } else if (currentStep === 5) {
      setStep4Phase("correct");
      setStep4Selected(APP_DATA.mcq.step4.correctIndex);
      setStep4Feedback({
        type: "correct",
        text: APP_DATA.mcq.step4.feedbackCorrect,
      });
      setCurrentStep(4);
    } else if (currentStep === 6) {
      setStep5Phase("done");
      setCurrentStep(5);
    } else if (currentStep === 7) {
      setStep6Phase("done");
      setCurrentStep(6);
    } else if (currentStep === 8) {
      setStep7Phase("done");
      setCurrentStep(7);
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
      } else if (currentStep === 6 && step6Phase === "initial") {
        addNudgeFor("apply-rotation-btn");
      } else if (
        (currentStep === 7 && step7Phase === "waiting") ||
        (currentStep === 8 && step8Phase === "waiting")
      ) {
        addNudgeFor("rotation-formula-box");
      } else if (!isNextDisabled && currentStep !== 9) {
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
    step6Phase,
    step7Phase,
    step8Phase,
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
      activeHighlightId: questionHighlightId,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        step: currentStep,
        step2Phase: step2Phase,
        onStep2AnimComplete: handleStep2AnimComplete,
        onHighlightChange: handleHighlightChange,
        step3Phase: step3Phase,
        onStep3PhaseChange: setStep3Phase,
        step4Phase: step4Phase,
        step4Selected: step4Selected,
        step4Feedback: step4Feedback,
        onStep4Select: handleStep4Select,
        blinkCell: blinkCell,
        step5Phase: step5Phase,
        step5Selected: step5Selected,
        step5Feedback: step5Feedback,
        onStep5Select: handleStep5Select,
        onStep5PhaseChange: setStep5Phase,
        onNavAnimating: setNavAnimating,
        step6Phase: step6Phase,
        onStep6Apply: handleStep6Apply,
        onStep6PhaseChange: setStep6Phase,
        step7Phase: step7Phase,
        onStep7PhaseChange: setStep7Phase,
        step8Phase: step8Phase,
        onStep8PhaseChange: setStep8Phase,
        step8ExitPhase: step8ExitPhase,
        onStep8TransitionComplete: handleStep8TransitionComplete,
        step9Phase: step9Phase,
        onStep9PhaseChange: setStep9Phase,
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      currentStep === 9
        ? step9Phase === "done"
          ? React.createElement(Navigation, {
              showStartOver: true,
              onStartOver: handleStartOver,
              startOverText: APP_DATA.final.buttonText,
            })
          : null
        : React.createElement(Navigation, {
            onNav: (dir) =>
              dir === "next"
                ? handleNext()
                : dir === "prev"
                  ? handlePrev()
                  : null,
            isNextDisabled: isNextDisabled,
            isPrevDisabled: isPrevDisabled,
            navText: navText,
            navTextHidden: navTextHidden,
          }),
    ),
    renderNudges(),
  );
};
