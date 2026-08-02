const App = () => {
  const { useState, useMemo, useEffect, useRef, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [stepReady, setStepReady] = useState(false);
  const [canvasNavText, setCanvasNavText] = useState("");
  const [nudgePositions, setNudgePositions] = useState([]);
  const [teachingNudgePositions, setTeachingNudgePositions] = useState([]);
  const mainCanvasRef = useRef(null);
  const teachingSteps = ["A", "B", "C", "D", "E"];
  const isTeachingStep = teachingSteps.includes(currentStep);

  const resetToStep = useCallback((step) => {
    setStepReady(false);
    setCanvasNavText("");
    setTeachingNudgePositions([]);
    setCurrentStep(step);
  }, []);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setQuestionIndex(0);
    resetToStep("A");
  };

  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    setQuestionIndex(0);
    resetToStep(0);
  };

  const handleNext = () => {
    if (!stepReady) return;
    if (typeof playSound === "function") playSound("click");

    const delay =
      mainCanvasRef.current && typeof mainCanvasRef.current.prepareStepChange === "function"
        ? mainCanvasRef.current.prepareStepChange()
        : 0;

    const goNext = () => {
      if (currentStep === "A") {
        resetToStep("B");
        return;
      }
      if (currentStep === "E") {
        setQuestionIndex(0);
        resetToStep(1);
        return;
      }
      if (currentStep >= 4) {
        if (questionIndex >= APP_DATA.questions.length - 1) {
          resetToStep(5);
          return;
        }
        setQuestionIndex((index) => index + 1);
        resetToStep(1);
        return;
      }
      resetToStep(currentStep + 1);
    };

    if (delay) setTimeout(goNext, delay);
    else goNext();
  };

  const handleTeachingAutoAdvance = useCallback(() => {
    setStepReady(false);
    setCanvasNavText("");
    setTeachingNudgePositions([]);
    setCurrentStep((step) => {
      if (step === "B") return "C";
      if (step === "C") return "D";
      if (step === "D") return "E";
      return step;
    });
  }, []);

  const handlePrev = () => {
    if (
      (currentStep === "A") ||
      (currentStep === 1 && questionIndex === 0)
    )
      return;
    if (typeof playSound === "function") playSound("click");
    if (isTeachingStep) {
      const index = teachingSteps.indexOf(currentStep);
      if (index > 0) resetToStep(teachingSteps[index - 1]);
      return;
    }
    if (currentStep === 1) {
      setQuestionIndex((index) => index - 1);
      resetToStep(4);
      return;
    }
    resetToStep(currentStep - 1);
  };

  const isPrevDisabled = currentStep === "A" || (currentStep === 1 && questionIndex === 0);

  const navText = useMemo(() => {
    if (isTeachingStep) {
      if (canvasNavText) return canvasNavText;
      const teaching = APP_DATA.teaching;
      if (currentStep === "A") return stepReady ? teaching.stepA.nav.ready : teaching.stepA.nav.animating;
      if (currentStep === "B") return teaching.stepB.nav.chooseRule;
      if (currentStep === "C") return teaching.stepC.nav.tapButton;
      if (currentStep === "D") return teaching.stepD.nav.tapSubstitute;
      if (currentStep === "E") return teaching.stepE.nav.ready;
    }
    const steps = APP_DATA.steps;
    if (currentStep === 1) return stepReady ? steps.step1.nav.ready : steps.step1.nav.animating;
    if (currentStep === 2) return stepReady ? steps.step2.nav.ready : steps.step2.nav.chooseRule;
    if (currentStep === 3) return stepReady ? steps.step3.nav.ready : steps.step3.nav.numpadActive;
    if (currentStep === 4) {
      if (!stepReady) return steps.step4.nav.chooseSimplified;
      return questionIndex >= APP_DATA.questions.length - 1
        ? steps.step4.nav.conclude
        : steps.step4.nav.ready;
    }
    return "";
  }, [currentStep, questionIndex, stepReady, isTeachingStep, canvasNavText]);

  useEffect(() => {
    const updateNudges = () => {
      const nextPositions = [];
      const targetId =
        currentStep === 0 || currentStep === 5
          ? "start-button"
          : stepReady && (currentStep === "A" || currentStep === "E" || !isTeachingStep)
            ? "next-button"
            : null;
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el && !el.disabled) nextPositions.push(el.getBoundingClientRect());
      }
      setNudgePositions(nextPositions);
    };

    const timeoutId = setTimeout(updateNudges, 0);
    window.addEventListener("resize", updateNudges);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateNudges);
    };
  }, [currentStep, stepReady, isTeachingStep]);

  const renderNudges = () => {
    const allPositions = isTeachingStep
      ? [...nudgePositions, ...teachingNudgePositions]
      : nudgePositions;
    return allPositions.map((position, index) =>
      React.createElement(Nudge, {
        key: index,
        show: true,
        position: position,
      }),
    );
  };

  if (currentStep === 0) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content app-main-content-splash" },
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

  if (currentStep === 5) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content app-main-content-splash" },
        React.createElement(Fullscreen, {
          heading: APP_DATA.completion.heading,
          text: APP_DATA.completion.text,
          buttonText: APP_DATA.completion.buttonText,
          onButtonClick: handleStartOver,
          buttonId: "start-button",
        }),
      ),
      renderNudges(),
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(
      "div",
      { className: "app-main-content line-app-content" },
      isTeachingStep
        ? React.createElement(MainCanvas0, {
            ref: mainCanvasRef,
            step: currentStep,
            onReadyChange: setStepReady,
            onAutoAdvance: handleTeachingAutoAdvance,
            onNavTextChange: setCanvasNavText,
            onNudgeTargetsChange: setTeachingNudgePositions,
          })
        : React.createElement(MainCanvas, {
            ref: mainCanvasRef,
            step: currentStep,
            question: APP_DATA.questions[questionIndex],
            onReadyChange: setStepReady,
          }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) =>
          dir === "next" ? handleNext() : dir === "prev" ? handlePrev() : null,
        isNextDisabled: !stepReady || (isTeachingStep && currentStep !== "A" && currentStep !== "E"),
        isPrevDisabled: isPrevDisabled,
        navText: navText,
      }),
    ),
    renderNudges(),
  );
};
