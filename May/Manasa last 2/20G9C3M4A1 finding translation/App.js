const App = () => {
  const { useState, useMemo, useEffect, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [step2Phase, setStep2Phase] = useState("intro");
  const [step3Phase, setStep3Phase] = useState("ready");
  const [step4Done, setStep4Done] = useState(false);
  const [step5Done, setStep5Done] = useState(false);
  const [step6Ready, setStep6Ready] = useState(false);
  const [step7Ready, setStep7Ready] = useState(false);
  const [step8Done, setStep8Done] = useState(false);
  const [step8Animating, setStep8Animating] = useState(false);
  const [step9Ready, setStep9Ready] = useState(false);
  const [step10Ready, setStep10Ready] = useState(false);
  const [step11Done, setStep11Done] = useState(false);
  const [step11Animating, setStep11Animating] = useState(false);
  const [step12Done, setStep12Done] = useState(false);
  const [selectedTrianglePoint, setSelectedTrianglePoint] = useState("P");
  const [selectedLinePoint, setSelectedLinePoint] = useState("M");
  const [nudgePositions, setNudgePositions] = useState([]);

  const resetEverything = useCallback(() => {
    setCurrentStep(0);
    setStep2Phase("intro");
    setStep3Phase("ready");
    setStep4Done(false);
    setStep5Done(false);
    setStep6Ready(false);
    setStep7Ready(false);
    setStep8Done(false);
    setStep8Animating(false);
    setStep9Ready(false);
    setStep10Ready(false);
    setStep11Done(false);
    setStep11Animating(false);
    setStep12Done(false);
    setSelectedTrianglePoint("P");
    setSelectedLinePoint("M");
    setNudgePositions([]);
  }, []);

  const handleStart = useCallback(() => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
    setStep2Phase("intro");
    setStep3Phase("ready");
    setStep4Done(false);
    setStep5Done(false);
    setStep6Ready(false);
    setStep7Ready(false);
    setStep8Done(false);
    setStep8Animating(false);
    setStep9Ready(false);
    setStep10Ready(false);
    setStep11Done(false);
    setStep11Animating(false);
    setStep12Done(false);
    setSelectedTrianglePoint("P");
    setSelectedLinePoint("M");
  }, []);

  const handleStep2Ready = useCallback(() => {
    setStep2Phase("x-ready");
  }, []);

  const handleRevealStart = useCallback(() => {
    setNudgePositions([]);
    setStep2Phase("revealing");
  }, []);

  const handleRevealComplete = useCallback((axis, xDone, yDone) => {
    if (xDone && yDone) {
      setStep2Phase("done");
    } else if (axis === "x") {
      setStep2Phase("y-ready");
    }
  }, []);

  const handleTranslate = useCallback(() => {
    if (currentStep !== 3 || step3Phase !== "ready") return;
    if (typeof playSound === "function") playSound("click");
    setStep3Phase("animating");
    setNudgePositions([]);
  }, [currentStep, step3Phase]);

  const handleTranslateComplete = useCallback(() => {
    setStep3Phase("done");
  }, []);

  const handleStep4Complete = useCallback(() => {
    setStep4Done(true);
  }, []);

  const handleStep5Complete = useCallback(() => {
    setStep5Done(true);
  }, []);

  const handleChoiceReady = useCallback((stepNumber) => {
    if (stepNumber === 7) setStep7Ready(true);
    if (stepNumber === 10) setStep10Ready(true);
  }, []);

  const handleChoiceSelect = useCallback((option) => {
    setNudgePositions([]);
    if (currentStep === 7) {
      setSelectedTrianglePoint(option || "P");
      setStep8Done(false);
      setStep8Animating(true);
      setCurrentStep(8);
    } else if (currentStep === 10) {
      setSelectedLinePoint(option || "M");
      setStep11Done(false);
      setStep11Animating(true);
      setCurrentStep(11);
    }
  }, [currentStep]);

  const handleScenarioTableComplete = useCallback((stepNumber) => {
    if (stepNumber === 8) {
      setStep8Animating(false);
      setStep8Done(true);
    }
    if (stepNumber === 11) {
      setStep11Animating(false);
      setStep11Done(true);
    }
  }, []);

  const handleScenarioTableAnimating = useCallback((stepNumber, isAnimating) => {
    if (stepNumber === 8) setStep8Animating(isAnimating);
    if (stepNumber === 11) setStep11Animating(isAnimating);
  }, []);

  const handleLineVerificationComplete = useCallback(() => {
    setStep12Done(true);
  }, []);

  const isNextDisabled =
    (currentStep === 2 && step2Phase !== "done") ||
    (currentStep === 3 && step3Phase !== "done") ||
    (currentStep === 4 && !step4Done) ||
    (currentStep === 5 && !step5Done) ||
    (currentStep === 6 && !step6Ready) ||
    currentStep === 7 ||
    (currentStep === 8 && !step8Done) ||
    (currentStep === 8 && step8Animating) ||
    (currentStep === 9 && !step9Ready) ||
    currentStep === 10 ||
    (currentStep === 11 && !step11Done) ||
    (currentStep === 11 && step11Animating) ||
    (currentStep === 12 && !step12Done) ||
    currentStep === 0;

  const isPrevDisabled = currentStep <= 1;

  const questionHtml =
    currentStep === 6
      ? APP_DATA.scenarios.triangle.questionPlain
      : currentStep === 7
        ? APP_DATA.scenarios.triangle.questionHighlighted
        : currentStep === 8
          ? APP_DATA.scenarios.triangle.questionPlain
          : currentStep === 9
            ? APP_DATA.scenarios.line.questionPlain
            : currentStep === 10
              ? APP_DATA.scenarios.line.questionHighlighted
              : currentStep === 11 || currentStep === 12
                ? APP_DATA.scenarios.line.questionPlain
                : currentStep === 4
      ? APP_DATA.practice.questionText
      : currentStep === 5
        ? APP_DATA.rectangle.questionText
        : currentStep >= 1
          ? APP_DATA.question.text
          : "";

  const navText = useMemo(() => {
    if (currentStep === 1) return APP_DATA.steps[1].navText;
    if (currentStep === 2) {
      if (step2Phase === "revealing") return "";
      return step2Phase === "done"
        ? APP_DATA.steps[2].navTextDone
        : step2Phase === "intro"
          ? ""
          : APP_DATA.steps[2].navTextButton;
    }
    if (currentStep === 3) {
      return step3Phase === "done"
        ? APP_DATA.steps[3].navTextDone
        : APP_DATA.steps[3].navTextButton;
    }
    if (currentStep === 4) {
      return step4Done ? APP_DATA.steps[4].navTextDone : APP_DATA.steps[4].navText;
    }
    if (currentStep === 5) {
      return step5Done ? APP_DATA.steps[5].navTextDone : APP_DATA.steps[5].navText;
    }
    if (currentStep === 6) return step6Ready ? APP_DATA.steps[6].navText : "";
    if (currentStep === 7) return step7Ready ? APP_DATA.scenarioIntro.navSelect : "";
    if (currentStep === 8) {
      if (step8Animating) return "";
      return step8Done ? APP_DATA.steps[8].navTextDone : APP_DATA.steps[8].navText;
    }
    if (currentStep === 9) return step9Ready ? APP_DATA.steps[9].navText : "";
    if (currentStep === 10) return step10Ready ? APP_DATA.scenarioIntro.navSelect : "";
    if (currentStep === 11) {
      if (step11Animating) return "";
      return step11Done ? APP_DATA.steps[11].navTextDone : APP_DATA.steps[11].navText;
    }
    if (currentStep === 12) return step12Done ? APP_DATA.steps[12].navTextDone : "";
    return "";
  }, [
    currentStep,
    step2Phase,
    step3Phase,
    step4Done,
    step5Done,
    step6Ready,
    step7Ready,
    step8Done,
    step8Animating,
    step9Ready,
    step10Ready,
    step11Done,
    step11Animating,
    step12Done,
  ]);

  const navTextHidden =
    (currentStep === 2 && (step2Phase === "intro" || step2Phase === "revealing")) ||
    (currentStep === 6 && !step6Ready) ||
    (currentStep === 7 && !step7Ready) ||
    (currentStep === 8 && step8Animating) ||
    (currentStep === 9 && !step9Ready) ||
    (currentStep === 10 && !step10Ready) ||
    (currentStep === 11 && step11Animating) ||
    (currentStep === 12 && !step12Done);

  useEffect(() => {
    if (currentStep !== 6) return undefined;
    setStep6Ready(false);
    const timer = setTimeout(() => setStep6Ready(true), 3000);
    return () => clearTimeout(timer);
  }, [currentStep]);

  useEffect(() => {
    if (currentStep !== 9) return undefined;
    setStep9Ready(false);
    const timer = setTimeout(() => setStep9Ready(true), 3000);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleNext = useCallback(() => {
    if (isNextDisabled) return;
    if (typeof playSound === "function") playSound("click");
    setNudgePositions([]);

    if (currentStep === 1) {
      setStep2Phase("intro");
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setStep3Phase("ready");
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setStep4Done(false);
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setStep5Done(false);
      setCurrentStep(5);
    } else if (currentStep === 5) {
      setStep6Ready(false);
      setCurrentStep(6);
    } else if (currentStep === 6) {
      setStep7Ready(false);
      setCurrentStep(7);
    } else if (currentStep === 8) {
      setStep8Animating(false);
      setStep9Ready(false);
      setCurrentStep(9);
    } else if (currentStep === 9) {
      setStep10Ready(false);
      setCurrentStep(10);
    } else if (currentStep === 11) {
      setStep11Animating(false);
      setStep12Done(false);
      setCurrentStep(12);
    } else if (currentStep === 12) {
      setCurrentStep(13);
    }
  }, [currentStep, isNextDisabled]);

  const handlePrev = useCallback(() => {
    if (isPrevDisabled) return;
    if (typeof playSound === "function") playSound("click");
    setNudgePositions([]);

    if (currentStep === 3) {
      setStep2Phase("done");
      setStep3Phase("ready");
      setCurrentStep(2);
    } else if (currentStep === 4) {
      setStep3Phase("done");
      setStep4Done(false);
      setCurrentStep(3);
    } else if (currentStep === 5) {
      setStep4Done(true);
      setStep5Done(false);
      setCurrentStep(4);
    } else if (currentStep === 6) {
      setStep5Done(true);
      setStep6Ready(false);
      setCurrentStep(5);
    } else if (currentStep === 7) {
      setStep6Ready(true);
      setStep7Ready(false);
      setCurrentStep(6);
    } else if (currentStep === 8) {
      setStep7Ready(true);
      setStep8Done(false);
      setStep8Animating(false);
      setCurrentStep(7);
    } else if (currentStep === 9) {
      setStep8Done(true);
      setStep8Animating(true);
      setStep9Ready(false);
      setCurrentStep(8);
    } else if (currentStep === 10) {
      setStep9Ready(true);
      setStep10Ready(false);
      setCurrentStep(9);
    } else if (currentStep === 11) {
      setStep10Ready(true);
      setStep11Done(false);
      setStep11Animating(false);
      setCurrentStep(10);
    } else if (currentStep === 12) {
      setStep11Done(true);
      setStep11Animating(true);
      setStep12Done(false);
      setCurrentStep(11);
    } else if (currentStep === 13) {
      setStep12Done(true);
      setCurrentStep(12);
    } else if (currentStep === 2) {
      setStep2Phase("intro");
      setCurrentStep(1);
    }
  }, [currentStep, isPrevDisabled]);

  useEffect(() => {
    const updateNudges = () => {
      const positions = [];

      const addNudgeFor = (id) => {
        const el = document.getElementById(id);
        if (el && !el.disabled) positions.push(el.getBoundingClientRect());
      };

      if (currentStep === 0) {
        addNudgeFor("start-button");
    } else if (currentStep === 2 && (step2Phase === "x-ready" || step2Phase === "y-ready")) {
        addNudgeFor(step2Phase === "x-ready" ? "reveal-x-btn" : "reveal-y-btn");
      } else if (currentStep === 3 && step3Phase === "ready") {
        addNudgeFor("translate-button");
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
  }, [currentStep, step2Phase, step3Phase, isNextDisabled]);

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

  if (currentStep === 13) {
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
    React.createElement(QuestionPanel, { html: questionHtml }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        step: currentStep,
        step2Phase: step2Phase,
        step3Phase: step3Phase,
        onStep2Ready: handleStep2Ready,
        onRevealStart: handleRevealStart,
        onRevealComplete: handleRevealComplete,
        onTranslate: handleTranslate,
        onTranslateComplete: handleTranslateComplete,
        onStep4Complete: handleStep4Complete,
        onStep5Complete: handleStep5Complete,
        onChoiceReady: handleChoiceReady,
        onChoiceSelect: handleChoiceSelect,
        onScenarioTableComplete: handleScenarioTableComplete,
        onScenarioTableAnimating: handleScenarioTableAnimating,
        selectedTrianglePoint: selectedTrianglePoint,
        selectedLinePoint: selectedLinePoint,
        onLineVerificationComplete: handleLineVerificationComplete,
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
        nextSymbol: APP_DATA.nav.nextSymbol,
        prevSymbol: APP_DATA.nav.previousSymbol,
      }),
    ),
    renderNudges(),
  );
};
