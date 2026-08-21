const App = () => {
  const { useCallback, useEffect, useMemo, useState } = React;

  const [currentStep, setCurrentStep] = useState(1);
  const [step2Phase, setStep2Phase] = useState("initial");
  const [step3Phase, setStep3Phase] = useState("initial");
  const [step4Phase, setStep4Phase] = useState("initial");
  const [step5Phase, setStep5Phase] = useState("intro");
  const [step6Phase, setStep6Phase] = useState("abWaiting");
  const [step7Phase, setStep7Phase] = useState("waiting");
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

  const questionHtml = currentStep >= 5
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
    (currentStep === 7 && step7Phase === "flying");

  const isNextDisabled =
    (currentStep === 2 && step2Phase !== "done") ||
    (currentStep === 3 && step3Phase !== "done") ||
    (currentStep === 4 && step4Phase !== "done") ||
    (currentStep === 5 && step5Phase !== "done") ||
    (currentStep === 6 && step6Phase !== "done") ||
    (currentStep === 7 && step7Phase !== "done") ||
    currentStep >= 8;

  const isPrevDisabled = currentStep <= 1 || isAnimating;

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
    return "";
  }, [
    currentStep,
    step2Phase,
    step3Phase,
    step4Phase,
    step5Phase,
    step6Phase,
    step7Phase,
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
    (currentStep === 7 && step7Phase === "flying");

  const restoreStep = useCallback((targetStep) => {
    setNudgePositions([]);
    setCanvasEpoch((epoch) => epoch + 1);
    setCurrentStep(targetStep);

    if (targetStep === 1) {
      setStep2Phase("initial");
      setStep3Phase("initial");
      setStep4Phase("initial");
      setStep5Phase("intro");
      setStep6Phase("abWaiting");
      setStep7Phase("waiting");
    }
    if (targetStep === 2) {
      setStep2Phase("done");
      setStep3Phase("initial");
      setStep4Phase("initial");
      setStep5Phase("intro");
      setStep6Phase("abWaiting");
      setStep7Phase("waiting");
    }
    if (targetStep === 3) {
      setStep2Phase("done");
      setStep3Phase("done");
      setStep4Phase("initial");
      setStep5Phase("intro");
      setStep6Phase("abWaiting");
      setStep7Phase("waiting");
    }
    if (targetStep === 4) {
      setStep2Phase("done");
      setStep3Phase("done");
      setStep4Phase("done");
      setStep5Phase("intro");
      setStep6Phase("abWaiting");
      setStep7Phase("waiting");
    }
    if (targetStep === 5) {
      setStep2Phase("done");
      setStep3Phase("done");
      setStep4Phase("done");
      setStep5Phase("done");
      setStep6Phase("abWaiting");
      setStep7Phase("waiting");
    }
    if (targetStep === 6) {
      setStep2Phase("done");
      setStep3Phase("done");
      setStep4Phase("done");
      setStep5Phase("done");
      setStep6Phase("done");
      setStep7Phase("waiting");
    }
    if (targetStep >= 7) {
      setStep2Phase("done");
      setStep3Phase("done");
      setStep4Phase("done");
      setStep5Phase("done");
      setStep6Phase("done");
      setStep7Phase("done");
    }
  }, []);

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
      } else if (!isNextDisabled) {
        addNudgeFor("next-button");
      }

      setNudgePositions(positions);
    };

    const nudgeDelay =
      currentStep === 5 && step5Phase === "intro" ? 800 : 80;
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
