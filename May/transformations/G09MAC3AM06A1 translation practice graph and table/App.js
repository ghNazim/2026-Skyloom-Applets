const App = () => {
  const { useState, useMemo, useEffect, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [step2Phase, setStep2Phase] = useState("initial");
  const [activeHighlight, setActiveHighlight] = useState(null);
  const [nudgePositions, setNudgePositions] = useState([]);

  const [step4Phase, setStep4Phase] = useState("mcq");
  const [step4Selected, setStep4Selected] = useState(null);
  const [step4Feedback, setStep4Feedback] = useState(null);

  const [step5Phase, setStep5Phase] = useState("entering");
  const [step5Selected, setStep5Selected] = useState(null);
  const [step5Feedback, setStep5Feedback] = useState(null);

  const [step6Phase, setStep6Phase] = useState("initial");
  const [step7Phase, setStep7Phase] = useState("initial");

  const [step8Phase, setStep8Phase] = useState("mcq");
  const [step8Selected, setStep8Selected] = useState(null);
  const [step8Feedback, setStep8Feedback] = useState(null);

  const [step9Phase, setStep9Phase] = useState("mcq");
  const [step9Selected, setStep9Selected] = useState(null);
  const [step9Feedback, setStep9Feedback] = useState(null);

  const [step10Phase, setStep10Phase] = useState("initial");

  const [navAnimating, setNavAnimating] = useState(false);

  const resetMcqSteps = useCallback(() => {
    setStep4Phase("mcq");
    setStep4Selected(null);
    setStep4Feedback(null);
    setStep5Phase("entering");
    setStep5Selected(null);
    setStep5Feedback(null);
    setStep6Phase("initial");
    setStep7Phase("initial");
    setStep8Phase("mcq");
    setStep8Selected(null);
    setStep8Feedback(null);
    setStep9Phase("mcq");
    setStep9Selected(null);
    setStep9Feedback(null);
    setStep10Phase("initial");
    setNavAnimating(false);
  }, []);

  const resetEverything = useCallback(() => {
    setCurrentStep(0);
    setStep2Phase("initial");
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

  const handleMcqSelect = useCallback((mcqKey, index, onCorrect, onWrong) => {
    const mcq = APP_DATA.mcq[mcqKey];
    const isCorrect = index === mcq.correctIndex;
    if (typeof playSound === "function") {
      playSound(isCorrect ? "correct" : "wrong");
    }
    setTimeout(() => {
      if (isCorrect) onCorrect();
      else onWrong(mcq.feedbackWrong);
    }, 500);
    return isCorrect;
  }, []);

  const handleStep4Select = useCallback((index) => {
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
      }
    }, 500);
  }, []);

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
        setStep5Phase("tableAnim");
        setNavAnimating(true);
      } else {
        setStep5Feedback({ type: "wrong", text: mcq.feedbackWrong });
        setStep5Phase("wrong");
      }
    }, 500);
  }, []);

  const handleStep8Select = useCallback((index) => {
    const mcq = APP_DATA.mcq.step8;
    setStep8Selected(index);
    setStep8Phase("selected");
    const isCorrect = index === mcq.correctIndex;
    if (typeof playSound === "function") {
      playSound(isCorrect ? "correct" : "wrong");
    }
    setTimeout(() => {
      if (isCorrect) {
        setStep8Phase("tableAnim");
        setNavAnimating(true);
      } else {
        setStep8Feedback({ type: "wrong", text: mcq.feedbackWrong });
        setStep8Phase("wrong");
      }
    }, 500);
  }, []);

  const handleStep9Select = useCallback((index) => {
    const mcq = APP_DATA.mcq.step9;
    setStep9Selected(index);
    setStep9Phase("selected");
    const isCorrect = index === mcq.correctIndex;
    if (typeof playSound === "function") {
      playSound(isCorrect ? "correct" : "wrong");
    }
    setTimeout(() => {
      if (isCorrect) {
        setStep9Phase("tableAnim");
        setNavAnimating(true);
      } else {
        setStep9Feedback({ type: "wrong", text: mcq.feedbackWrong });
        setStep9Phase("wrong");
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
    if (currentStep === 3) return APP_DATA.steps[3].navText;
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
    if (currentStep === 7 && step7Phase === "done") {
      return APP_DATA.steps[7].navTextDone;
    }
    if (currentStep === 8) {
      if (step8Phase === "wrong") return APP_DATA.steps[8].navTextWrong;
      if (step8Phase === "done") return APP_DATA.steps[8].navTextDone;
      if (step8Phase === "mcq") return APP_DATA.steps[8].navText;
      return "";
    }
    if (currentStep === 9) {
      if (step9Phase === "wrong") return APP_DATA.steps[9].navTextWrong;
      if (step9Phase === "done") return APP_DATA.steps[9].navTextDone;
      if (step9Phase === "mcq") return APP_DATA.steps[9].navText;
      return "";
    }
    if (currentStep === 10 && step10Phase === "done") {
      return APP_DATA.steps[10].navTextDone;
    }
    return "";
  }, [
    currentStep,
    step2Phase,
    step4Phase,
    step5Phase,
    step6Phase,
    step7Phase,
    step8Phase,
    step9Phase,
    step10Phase,
    navAnimating,
  ]);

  const navTextHidden =
    (currentStep === 2 && step2Phase === "initial") ||
    (currentStep === 5 &&
      (step5Phase === "entering" || step5Phase === "colAnim")) ||
    navAnimating;

  const isNextDisabled =
    (currentStep === 2 && step2Phase !== "done") ||
    (currentStep === 4 && step4Phase !== "correct") ||
    (currentStep === 5 && step5Phase !== "done") ||
    (currentStep === 6 && step6Phase !== "done") ||
    (currentStep === 7 && step7Phase !== "done") ||
    (currentStep === 8 && step8Phase !== "done") ||
    (currentStep === 9 && step9Phase !== "done") ||
    (currentStep === 10 && step10Phase !== "done");

  const isPrevDisabled =
    currentStep <= 1 ||
    (currentStep === 4 && step4Phase !== "wrong") ||
    (currentStep === 5 && step5Phase !== "wrong") ||
    (currentStep === 8 && step8Phase !== "wrong") ||
    (currentStep === 9 && step9Phase !== "wrong");

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    setNudgePositions([]);
    if (isNextDisabled) return;

    if (currentStep === 1) {
      setStep2Phase("initial");
      setActiveHighlight(null);
      setCurrentStep(2);
    } else if (currentStep === 2) {
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
      setStep7Phase("initial");
      setCurrentStep(7);
    } else if (currentStep === 7) {
      setStep8Phase("mcq");
      setStep8Selected(null);
      setStep8Feedback(null);
      setCurrentStep(8);
    } else if (currentStep === 8) {
      setStep9Phase("mcq");
      setStep9Selected(null);
      setStep9Feedback(null);
      setCurrentStep(9);
    } else if (currentStep === 9) {
      setStep10Phase("initial");
      setCurrentStep(10);
    } else if (currentStep === 10) {
      setCurrentStep(11);
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    setNudgePositions([]);

    if (currentStep === 4 && step4Phase === "wrong") {
      setStep4Phase("mcq");
      setStep4Selected(null);
      setStep4Feedback(null);
      return;
    }
    if (currentStep === 5 && step5Phase === "wrong") {
      setStep5Phase("mcq");
      setStep5Selected(null);
      setStep5Feedback(null);
      return;
    }
    if (currentStep === 8 && step8Phase === "wrong") {
      setStep8Phase("mcq");
      setStep8Selected(null);
      setStep8Feedback(null);
      return;
    }
    if (currentStep === 9 && step9Phase === "wrong") {
      setStep9Phase("mcq");
      setStep9Selected(null);
      setStep9Feedback(null);
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
      setCurrentStep(3);
      resetMcqSteps();
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
    } else if (currentStep === 9) {
      setStep8Phase("done");
      setCurrentStep(8);
    } else if (currentStep === 10) {
      setStep9Phase("done");
      setCurrentStep(9);
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

      if (currentStep === 0 || currentStep === 11) {
        addNudgeFor("start-button");
      } else if (currentStep === 6 && step6Phase === "initial") {
        addNudgeFor("apply-translation-btn");
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

  if (currentStep === 11) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.final.heading,
          text: APP_DATA.final.text,
          buttonText: APP_DATA.final.buttonText,
          onButtonClick: resetEverything,
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
        step4Phase: step4Phase,
        step4Selected: step4Selected,
        step4Feedback: step4Feedback,
        onStep4Select: handleStep4Select,
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
        step8Selected: step8Selected,
        step8Feedback: step8Feedback,
        onStep8Select: handleStep8Select,
        onStep8PhaseChange: setStep8Phase,
        step9Phase: step9Phase,
        step9Selected: step9Selected,
        step9Feedback: step9Feedback,
        onStep9Select: handleStep9Select,
        onStep9PhaseChange: setStep9Phase,
        step10Phase: step10Phase,
        onStep10PhaseChange: setStep10Phase,
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
