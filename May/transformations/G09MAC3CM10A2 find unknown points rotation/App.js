const App = () => {
  const { useState, useMemo, useEffect, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
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

  const [step6Phase, setStep6Phase] = useState("initial");

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
    setStep6Phase("initial");
    setNavAnimating(false);
  }, []);

  const resetEverything = useCallback(() => {
    setCurrentStep(0);
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
      const mcq = APP_DATA.mcq.step4;
      setStep4Selected(index);
      setStep4Phase("selected");
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
    [blinkTableCell],
  );

  const handleStep5Select = useCallback((index) => {
    const mcq = APP_DATA.mcq.step5;
    setStep5Selected(index);
    setStep5Phase("selected");
    const isCorrect = index === mcq.correctIndex;
    if (typeof playSound === "function") {
      playSound(isCorrect ? "correct" : "wrong");
    }
    setTimeout(() => {
      if (isCorrect) {
        setStep5Phase("rotationFly");
        setNavAnimating(true);
      } else {
        setStep5Phase("wrong");
      }
    }, 500);
  }, []);

  const handleStep6Apply = useCallback(() => {
    if (typeof playSound === "function") playSound("click");
    setNavAnimating(true);
    setStep6Phase("applying");
  }, []);

  const questionHtml = useMemo(() => {
    if (currentStep < 1) return "";
    if (currentStep === 2) return APP_DATA.question.text;
    return APP_DATA.question.textPlain;
  }, [currentStep]);

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
      if (step4Phase === "wrong") return APP_DATA.steps[4].navTextWrong;
      if (step4Phase === "correct") return APP_DATA.steps[4].navTextDone;
      return APP_DATA.steps[4].navText;
    }
    if (currentStep === 5) {
      if (step5Phase === "wrong") return APP_DATA.steps[5].navTextWrong;
      if (step5Phase === "done") return APP_DATA.steps[5].navTextDone;
      if (step5Phase === "mcq") return APP_DATA.steps[5].navText;
      return "";
    }
    if (currentStep === 6) {
      return step6Phase === "done"
        ? APP_DATA.steps[6].navTextDone
        : APP_DATA.steps[6].navText;
    }
    return "";
  }, [
    currentStep,
    step2Phase,
    step3Phase,
    step4Phase,
    step5Phase,
    step6Phase,
    navAnimating,
  ]);

  const navTextHidden =
    (currentStep === 2 && step2Phase === "initial") ||
    (currentStep === 3 && step3Phase === "initial") ||
    (currentStep === 5 &&
      (step5Phase === "entering" ||
        step5Phase === "formulaAnim" ||
        step5Phase === "rotationFly")) ||
    navAnimating;

  const isNextDisabled =
    (currentStep === 2 && step2Phase !== "done") ||
    (currentStep === 3 && step3Phase !== "done") ||
    (currentStep === 4 && step4Phase !== "correct") ||
    (currentStep === 5 && step5Phase !== "done") ||
    (currentStep === 6 && step6Phase !== "done");

  const isPrevDisabled =
    currentStep <= 1 ||
    (currentStep === 4 && step4Phase !== "wrong") ||
    (currentStep === 5 && step5Phase !== "wrong");

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
      setCurrentStep(5);
    } else if (currentStep === 5) {
      setStep6Phase("initial");
      setCurrentStep(6);
    } else if (currentStep === 6) {
      setCurrentStep(7);
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    setNudgePositions([]);

    if (currentStep === 4 && step4Phase === "wrong") {
      setStep4Phase("mcq");
      setStep4Selected(null);
      setStep4Feedback(null);
      setBlinkCell(null);
      return;
    }
    if (currentStep === 5 && step5Phase === "wrong") {
      setStep5Phase("mcq");
      setStep5Selected(null);
      return;
    }
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
  }, [currentStep, isNextDisabled, step2Phase, step6Phase]);

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

  if (currentStep >= 7) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(QuestionPanel, {
        html: APP_DATA.question.textPlain,
        activeHighlightId: null,
      }),
      React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(MainCanvas, {
          step: 7,
          step2Phase: "done",
          step3Phase: "done",
          step4Phase: "correct",
          step4Selected: APP_DATA.mcq.step4.correctIndex,
          step4Feedback: null,
          step5Phase: "done",
          step5Selected: APP_DATA.mcq.step5.correctIndex,
          step6Phase: "done",
          blinkCell: null,
        }),
      ),
      React.createElement(
        "div",
        { className: "lower-panel" },
        React.createElement(Navigation, {
          onNav: (dir) => {
            if (dir === "prev") {
              if (typeof playSound === "function") playSound("click");
              setCurrentStep(6);
              setStep6Phase("done");
            }
          },
          isNextDisabled: true,
          isPrevDisabled: false,
          navText: "",
          navTextHidden: false,
        }),
      ),
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      html: questionHtml,
      activeHighlightId: activeHighlight,
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
        onStep5Select: handleStep5Select,
        onStep5PhaseChange: setStep5Phase,
        onNavAnimating: setNavAnimating,
        step6Phase: step6Phase,
        onStep6Apply: handleStep6Apply,
        onStep6PhaseChange: setStep6Phase,
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
