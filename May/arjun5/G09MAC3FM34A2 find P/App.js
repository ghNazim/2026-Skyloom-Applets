const App = () => {
  const { useCallback, useEffect, useMemo, useState } = React;

  const [currentStep, setCurrentStep] = useState(1);
  const [step2Phase, setStep2Phase] = useState("initial");
  const [step3Phase, setStep3Phase] = useState("initial");
  const [step4Phase, setStep4Phase] = useState("initial");
  const [step5Phase, setStep5Phase] = useState("intro");
  const [step6Phase, setStep6Phase] = useState("abWaiting");
  const [step7Phase, setStep7Phase] = useState("waiting");
  const [step8Phase, setStep8Phase] = useState("initial");
  const [step9Phase, setStep9Phase] = useState("intro");
  const [step10Phase, setStep10Phase] = useState("intro");
  const [step11Phase, setStep11Phase] = useState("intro");
  const [step12Phase, setStep12Phase] = useState("initial");
  const [step13Phase, setStep13Phase] = useState("initial");
  const [step14Phase, setStep14Phase] = useState("intro");
  const [step15Phase, setStep15Phase] = useState("intro");
  const [step16Phase, setStep16Phase] = useState("intro");
  const [firstRotationCase, setFirstRotationCase] = useState(null);
  const [firstRotationDirection, setFirstRotationDirection] = useState(null);
  const [firstRotationDegrees, setFirstRotationDegrees] = useState(null);
  const [nudgePositions, setNudgePositions] = useState([]);
  const [canvasEpoch, setCanvasEpoch] = useState(0);

  useEffect(() => {
    document.title = APP_DATA.title;
  }, []);

  const visibleHighlights = useMemo(() => {
    if (currentStep === 2) return ["highlight-abc"];
    if (currentStep === 3) return ["highlight-qr"];
    if (currentStep === 4) return ["highlight-find-p"];
    return [];
  }, [currentStep]);

  const questionHtml =
    currentStep >= 5
      ? APP_DATA.question.solve
      : currentStep === 1
        ? APP_DATA.question.plain
        : APP_DATA.question.full;

  const isAnimating =
    (currentStep === 2 && step2Phase !== "done") ||
    (currentStep === 3 && step3Phase !== "done") ||
    (currentStep === 4 && step4Phase !== "done") ||
    (currentStep === 5 &&
      (step5Phase === "qrFilling" || step5Phase === "rootAnimating")) ||
    (currentStep === 6 &&
      (step6Phase === "abFilling" ||
        step6Phase === "abRootAnimating" ||
        step6Phase === "bcFilling" ||
        step6Phase === "bcRootAnimating" ||
        step6Phase === "acFilling" ||
        step6Phase === "acRootAnimating")) ||
    (currentStep === 7 && step7Phase === "flying") ||
    (currentStep === 8 && step8Phase === "animating") ||
    (currentStep === 11 &&
      (step11Phase === "flipping" || step11Phase === "flying")) ||
    (currentStep === 12 &&
      (step12Phase === "flying" || step12Phase === "belowAnimating")) ||
    (currentStep === 13 &&
      (step13Phase === "swapping" || step13Phase === "belowAnimating")) ||
    (currentStep === 16 &&
      (step16Phase === "flipping" || step16Phase === "flying"));

  const isNextDisabled =
    (currentStep === 2 && step2Phase !== "done") ||
    (currentStep === 3 && step3Phase !== "done") ||
    (currentStep === 4 && step4Phase !== "done") ||
    (currentStep === 5 && step5Phase !== "done") ||
    (currentStep === 6 && step6Phase !== "done") ||
    (currentStep === 7 && step7Phase !== "done") ||
    (currentStep === 8 && step8Phase !== "done") ||
    (currentStep === 9 && step9Phase !== "done") ||
    (currentStep === 10 && step10Phase !== "done") ||
    (currentStep === 11 && step11Phase !== "done") ||
    (currentStep === 12 && step12Phase !== "done") ||
    (currentStep === 13 && step13Phase !== "done") ||
    (currentStep === 14 && step14Phase !== "done") ||
    (currentStep === 15 && step15Phase !== "done") ||
    (currentStep === 16 && step16Phase !== "done");

  const isPrevDisabled = currentStep <= 1 || currentStep >= 17 || isAnimating;

  const navText = useMemo(() => {
    if (currentStep === 1) return APP_DATA.steps[1].navText;
    if (currentStep === 2 && step2Phase === "done") {
      return APP_DATA.steps[2].navTextDone;
    }
    if (currentStep === 3 && step3Phase === "done") {
      return APP_DATA.steps[3].navTextDone;
    }
    if (currentStep === 4 && step4Phase === "done") {
      return APP_DATA.steps[4].navTextDone;
    }
    if (currentStep === 5) {
      if (step5Phase === "intro") return APP_DATA.steps[5].navIntro;
      if (step5Phase === "formula") return APP_DATA.steps[5].navQr;
      if (step5Phase === "expanded" || step5Phase === "simplified") {
        return APP_DATA.steps[5].navSimplify;
      }
      if (step5Phase === "done") return APP_DATA.steps[5].navDone;
    }
    if (currentStep === 6) {
      if (step6Phase === "abWaiting") return APP_DATA.steps[6].navAb;
      if (step6Phase === "bcWaiting") return APP_DATA.steps[6].navBc;
      if (step6Phase === "acWaiting") return APP_DATA.steps[6].navAc;
      if (
        step6Phase === "abExpanded" ||
        step6Phase === "abSimplified" ||
        step6Phase === "bcExpanded" ||
        step6Phase === "bcSimplified" ||
        step6Phase === "acExpanded" ||
        step6Phase === "acSimplified"
      ) {
        return APP_DATA.steps[6].navSimplify;
      }
      if (step6Phase === "done") return APP_DATA.steps[6].navDone;
    }
    if (currentStep === 7) {
      if (step7Phase === "done") return APP_DATA.steps[7].navDone;
      return APP_DATA.steps[7].navPrompt;
    }
    if (currentStep === 8) {
      if (step8Phase === "done") return APP_DATA.steps[8].navDone;
      return APP_DATA.steps[8].navText;
    }
    if (currentStep === 9) {
      if (step9Phase === "done") return APP_DATA.steps[9].navDone;
      if (step9Phase === "ready") return APP_DATA.steps[9].navSlider;
      return APP_DATA.steps[9].navIntro;
    }
    if (currentStep === 10) {
      if (step10Phase === "done") return APP_DATA.steps[10].navDone;
      if (step10Phase === "controls") return APP_DATA.steps[10].navControls;
      return APP_DATA.steps[10].navIntro;
    }
    if (currentStep === 11) {
      if (step11Phase === "done") return APP_DATA.steps[11].navDone;
      return APP_DATA.steps[11].navIntro;
    }
    if (currentStep === 12) {
      if (step12Phase === "done") return APP_DATA.steps[12].navDone;
      return "";
    }
    if (currentStep === 13) {
      if (step13Phase === "done") return APP_DATA.steps[13].navDone;
      return "";
    }
    if (currentStep === 14) {
      if (step14Phase === "done") return APP_DATA.steps[14].navDone;
      if (step14Phase === "ready") return APP_DATA.steps[14].navSlider;
      return APP_DATA.steps[14].navIntro;
    }
    if (currentStep === 15) {
      if (step15Phase === "done") return APP_DATA.steps[15].navDone;
      if (step15Phase === "controls") return APP_DATA.steps[15].navControls;
      return APP_DATA.steps[15].navIntro;
    }
    if (currentStep === 16) {
      if (step16Phase === "done") return APP_DATA.steps[16].navDone;
      return APP_DATA.steps[16].navIntro;
    }
    if (currentStep === 17) {
      return APP_DATA.steps[17].navText;
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
    step9Phase,
    step10Phase,
    step11Phase,
    step12Phase,
    step13Phase,
    step14Phase,
    step15Phase,
    step16Phase,
  ]);

  const navTextHidden =
    isAnimating ||
    (currentStep === 2 && step2Phase !== "done") ||
    (currentStep === 3 && step3Phase !== "done") ||
    (currentStep === 4 && step4Phase !== "done") ||
    (currentStep === 6 &&
      step6Phase !== "abWaiting" &&
      step6Phase !== "bcWaiting" &&
      step6Phase !== "acWaiting" &&
      step6Phase !== "done") ||
    (currentStep === 7 && step7Phase === "flying") ||
    (currentStep === 11 &&
      (step11Phase === "flipping" || step11Phase === "flying")) ||
    (currentStep === 12 && step12Phase !== "done") ||
    (currentStep === 13 && step13Phase !== "done") ||
    (currentStep === 16 &&
      (step16Phase === "flipping" || step16Phase === "flying"));

  const nextSymbol =
    currentStep === 17 ? APP_DATA.steps[17].startOver : "»";

  const clearFirstRotation = useCallback(() => {
    setFirstRotationCase(null);
    setFirstRotationDirection(null);
    setFirstRotationDegrees(null);
  }, []);

  const handleFirstRotationChange = useCallback((payload) => {
    if (!payload) {
      setFirstRotationCase(null);
      setFirstRotationDirection(null);
      setFirstRotationDegrees(null);
      return;
    }
    setFirstRotationCase(payload.caseKey || null);
    setFirstRotationDirection(payload.direction || null);
    setFirstRotationDegrees(
      payload.degrees === 90 || payload.degrees === 270 ? payload.degrees : null,
    );
  }, []);

  const applyCompletedThrough = useCallback((throughStep) => {
    setStep2Phase(throughStep >= 2 ? "done" : "initial");
    setStep3Phase(throughStep >= 3 ? "done" : "initial");
    setStep4Phase(throughStep >= 4 ? "done" : "initial");
    setStep5Phase(throughStep >= 5 ? "done" : "intro");
    setStep6Phase(throughStep >= 6 ? "done" : "abWaiting");
    setStep7Phase(throughStep >= 7 ? "done" : "waiting");
    setStep8Phase(throughStep >= 8 ? "done" : "initial");
    setStep9Phase(throughStep >= 9 ? "done" : "intro");
    setStep10Phase(throughStep >= 10 ? "done" : "intro");
    setStep11Phase(throughStep >= 11 ? "done" : "intro");
    setStep12Phase(throughStep >= 12 ? "done" : "initial");
    setStep13Phase(throughStep >= 13 ? "done" : "initial");
    setStep14Phase(throughStep >= 14 ? "done" : "intro");
    setStep15Phase(throughStep >= 15 ? "done" : "intro");
    setStep16Phase(throughStep >= 16 ? "done" : "intro");
  }, []);

  const getStepInitialPhase = useCallback((stepNum) => {
    if (stepNum === 2 || stepNum === 3 || stepNum === 4 || stepNum === 8) {
      return "initial";
    }
    if (stepNum === 5) return "intro";
    if (stepNum === 6) return "abWaiting";
    if (stepNum === 7) return "waiting";
    if (
      stepNum === 9 ||
      stepNum === 10 ||
      stepNum === 11 ||
      stepNum === 14 ||
      stepNum === 15 ||
      stepNum === 16
    ) {
      return "intro";
    }
    if (stepNum === 12 || stepNum === 13) return "initial";
    return "intro";
  }, []);

  const setStepPhase = useCallback((stepNum, phase) => {
    if (stepNum === 2) setStep2Phase(phase);
    else if (stepNum === 3) setStep3Phase(phase);
    else if (stepNum === 4) setStep4Phase(phase);
    else if (stepNum === 5) setStep5Phase(phase);
    else if (stepNum === 6) setStep6Phase(phase);
    else if (stepNum === 7) setStep7Phase(phase);
    else if (stepNum === 8) setStep8Phase(phase);
    else if (stepNum === 9) setStep9Phase(phase);
    else if (stepNum === 10) setStep10Phase(phase);
    else if (stepNum === 11) setStep11Phase(phase);
    else if (stepNum === 12) setStep12Phase(phase);
    else if (stepNum === 13) setStep13Phase(phase);
    else if (stepNum === 14) setStep14Phase(phase);
    else if (stepNum === 15) setStep15Phase(phase);
    else if (stepNum === 16) setStep16Phase(phase);
  }, []);

  const restoreStep = useCallback(
    (targetStep) => {
      setNudgePositions([]);
      setCanvasEpoch((epoch) => epoch + 1);
      setCurrentStep(targetStep);

      if (targetStep <= 1) {
        applyCompletedThrough(0);
        clearFirstRotation();
        return;
      }

      // Keep earlier steps completed; erase this step and everything after.
      applyCompletedThrough(targetStep - 1);
      setStepPhase(targetStep, getStepInitialPhase(targetStep));
      for (let s = targetStep + 1; s <= 16; s++) {
        setStepPhase(s, getStepInitialPhase(s));
      }

      if (targetStep <= 9) {
        clearFirstRotation();
      }
    },
    [
      applyCompletedThrough,
      clearFirstRotation,
      getStepInitialPhase,
      setStepPhase,
    ],
  );

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (isNextDisabled) return;

    setNudgePositions([]);

    if (currentStep === 1) {
      setStep2Phase("initial");
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setStep3Phase("initial");
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setStep4Phase("initial");
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setStep5Phase("intro");
      setCurrentStep(5);
    } else if (currentStep === 5) {
      setStep6Phase("abWaiting");
      setCurrentStep(6);
    } else if (currentStep === 6) {
      setStep7Phase("waiting");
      setCurrentStep(7);
    } else if (currentStep === 7) {
      setStep8Phase("initial");
      setCurrentStep(8);
    } else if (currentStep === 8) {
      setStep9Phase("intro");
      setCurrentStep(9);
    } else if (currentStep === 9) {
      setStep10Phase("intro");
      setCurrentStep(10);
    } else if (currentStep === 10) {
      setStep11Phase("intro");
      setCurrentStep(11);
    } else if (currentStep === 11) {
      setStep12Phase("initial");
      setCurrentStep(12);
    } else if (currentStep === 12) {
      setStep13Phase("initial");
      setCurrentStep(13);
    } else if (currentStep === 13) {
      setStep14Phase("intro");
      setCurrentStep(14);
    } else if (currentStep === 14) {
      setStep15Phase("intro");
      setCurrentStep(15);
    } else if (currentStep === 15) {
      setStep16Phase("intro");
      setCurrentStep(16);
    } else if (currentStep === 16) {
      setCurrentStep(17);
    } else if (currentStep === 17) {
      restoreStep(1);
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (isPrevDisabled) return;
    restoreStep(currentStep - 1);
  };

  useEffect(() => {
    const updateNudges = () => {
      const positions = [];
      const addNudgeFor = (id) => {
        const el = document.getElementById(id);
        if (el && !el.disabled) positions.push(el.getBoundingClientRect());
      };

      if (currentStep === 5 && step5Phase === "intro") {
        addNudgeFor("find-side-button");
      } else if (currentStep === 5 && step5Phase === "formula") {
        addNudgeFor("qr-hotspot");
      } else if (currentStep === 5 && step5Phase === "expanded") {
        addNudgeFor("calc-box-expanded");
      } else if (currentStep === 5 && step5Phase === "simplified") {
        addNudgeFor("calc-box-simplified");
      } else if (currentStep === 6 && step6Phase === "abWaiting") {
        addNudgeFor("ab-hotspot");
      } else if (currentStep === 6 && step6Phase === "bcWaiting") {
        addNudgeFor("bc-hotspot");
      } else if (currentStep === 6 && step6Phase === "acWaiting") {
        addNudgeFor("ac-hotspot");
      } else if (
        currentStep === 6 &&
        (step6Phase === "abExpanded" ||
          step6Phase === "bcExpanded" ||
          step6Phase === "acExpanded")
      ) {
        addNudgeFor("calc-box-expanded");
      } else if (
        currentStep === 6 &&
        (step6Phase === "abSimplified" ||
          step6Phase === "bcSimplified" ||
          step6Phase === "acSimplified")
      ) {
        addNudgeFor("calc-box-simplified");
      } else if (currentStep === 9 && step9Phase === "intro") {
        addNudgeFor("step9-rotate-button");
      } else if (currentStep === 9 && step9Phase === "controls") {
        addNudgeFor("rotate-cw");
      } else if (currentStep === 10 && step10Phase === "intro") {
        addNudgeFor("step10-translate-button");
      } else if (currentStep === 11 && step11Phase === "intro") {
        addNudgeFor("step11-reflect-button");
      } else if (currentStep === 14 && step14Phase === "intro") {
        addNudgeFor("step14-rotate-button");
      } else if (currentStep === 14 && step14Phase === "controls") {
        addNudgeFor("rotate-cw");
      } else if (currentStep === 15 && step15Phase === "intro") {
        addNudgeFor("step15-translate-button");
      } else if (currentStep === 16 && step16Phase === "intro") {
        addNudgeFor("step16-reflect-button");
      } else if (!isNextDisabled) {
        addNudgeFor("next-button");
      }

      setNudgePositions(positions);
    };

    const nudgeDelay =
      currentStep === 5 && step5Phase === "intro"
        ? 800
        : (currentStep === 9 && step9Phase === "controls") ||
            (currentStep === 14 && step14Phase === "controls")
          ? 200
          : 80;
    const timeoutId = setTimeout(updateNudges, nudgeDelay);
    window.addEventListener("resize", updateNudges);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateNudges);
    };
  }, [
    currentStep,
    step2Phase,
    step3Phase,
    step4Phase,
    step5Phase,
    step6Phase,
    step7Phase,
    step8Phase,
    step9Phase,
    step10Phase,
    step11Phase,
    step12Phase,
    step13Phase,
    step14Phase,
    step15Phase,
    step16Phase,
    isNextDisabled,
  ]);

  const renderNudges = () =>
    nudgePositions.map((position, index) =>
      React.createElement(Nudge, {
        key: index,
        show: true,
        position: position,
      }),
    );

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      html: questionHtml,
      visibleHighlights: visibleHighlights,
      compact: currentStep >= 5,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        key: canvasEpoch,
        step: currentStep,
        step2Phase: step2Phase,
        onStep2PhaseChange: setStep2Phase,
        step3Phase: step3Phase,
        onStep3PhaseChange: setStep3Phase,
        step4Phase: step4Phase,
        onStep4PhaseChange: setStep4Phase,
        step5Phase: step5Phase,
        onStep5PhaseChange: setStep5Phase,
        step6Phase: step6Phase,
        onStep6PhaseChange: setStep6Phase,
        step7Phase: step7Phase,
        onStep7PhaseChange: setStep7Phase,
        step8Phase: step8Phase,
        onStep8PhaseChange: setStep8Phase,
        step9Phase: step9Phase,
        onStep9PhaseChange: setStep9Phase,
        step10Phase: step10Phase,
        onStep10PhaseChange: setStep10Phase,
        step11Phase: step11Phase,
        onStep11PhaseChange: setStep11Phase,
        step12Phase: step12Phase,
        onStep12PhaseChange: setStep12Phase,
        step13Phase: step13Phase,
        onStep13PhaseChange: setStep13Phase,
        step14Phase: step14Phase,
        onStep14PhaseChange: setStep14Phase,
        step15Phase: step15Phase,
        onStep15PhaseChange: setStep15Phase,
        step16Phase: step16Phase,
        onStep16PhaseChange: setStep16Phase,
        firstRotationCase: firstRotationCase,
        firstRotationDirection: firstRotationDirection,
        firstRotationDegrees: firstRotationDegrees,
        onFirstRotationChange: handleFirstRotationChange,
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
        nextSymbol: nextSymbol,
      }),
    ),
    renderNudges(),
  );
};
