const App = () => {
  const { useState, useEffect, useCallback, useMemo } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [step1Phase, setStep1Phase] = useState("initial");
  const [step2Phase, setStep2Phase] = useState("initial");
  const [step3Phase, setStep3Phase] = useState("initial");
  const [step4Phase, setStep4Phase] = useState("initial");
  const [step5Phase, setStep5Phase] = useState("initial");
  const [nudgePositions, setNudgePositions] = useState([]);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
    setStep1Phase("initial");
    setStep2Phase("initial");
    setStep3Phase("initial");
    setStep4Phase("initial");
    setStep5Phase("initial");
  };

  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setStep1Phase("initial");
    setStep2Phase("initial");
    setStep3Phase("initial");
    setStep4Phase("initial");
    setStep5Phase("initial");
  };

  const handleStep1PinPlaced = useCallback(() => {
    setStep1Phase("pinPlaced");
  }, []);

  const handleStep1RotationDone = useCallback(() => {
    setStep1Phase("done");
    setTimeout(() => {
      setCurrentStep(2);
      setStep2Phase("initial");
    }, 600);
  }, []);

  const handleStep2PointPlaced = useCallback(() => {
    setStep2Phase("pointPlaced");
  }, []);

  const handleStep2RotationDone = useCallback(() => {
    setStep2Phase("done");
  }, []);

  const handleStep2PurplePlaced = useCallback(() => {
    setStep2Phase("purplePlaced");
  }, []);

  const handleStep2GreenPlaced = useCallback(() => {
    setTimeout(() => {
      setCurrentStep(3);
      setStep3Phase("initial");
    }, 400);
  }, []);

  const handleStep3RotationDone = useCallback(() => {
    setStep3Phase("done");
  }, []);

  const handleStep3CentreTapped = useCallback(() => {
    setStep3Phase("centreShown");
  }, []);

  const handleStep4DragStart = useCallback(() => {
    setStep4Phase("rotating");
  }, []);

  const handleStep4Drop = useCallback(() => {
    setStep4Phase("done");
  }, []);

  const handleStep5LeftDone = useCallback(() => {
    setStep5Phase("leftDone");
  }, []);

  const handleStep5RightDone = useCallback(() => {
    setStep5Phase("done");
  }, []);

  const questionText = useMemo(() => {
    if (currentStep === 1) return APP_DATA.steps[1].questionText;
    if (currentStep === 2) return APP_DATA.steps[2].questionText;
    if (currentStep === 3) return APP_DATA.steps[3].questionText;
    if (currentStep === 4) return APP_DATA.steps[4].questionText;
    if (currentStep === 5) return APP_DATA.steps[5].questionText;
    if (currentStep === 6) return APP_DATA.steps[6].questionText;
    return "";
  }, [currentStep]);

  const navText = useMemo(() => {
    if (currentStep === 1) {
      if (step1Phase === "initial") return APP_DATA.steps[1].navTextInitial;
      return APP_DATA.steps[1].navTextPinPlaced;
    }
    if (currentStep === 2) {
      if (step2Phase === "initial") return APP_DATA.steps[2].navTextInitial;
      if (step2Phase === "pointPlaced") return APP_DATA.steps[2].navTextPointPlaced;
      if (step2Phase === "done") return APP_DATA.steps[2].navTextDone;
      if (step2Phase === "purplePlaced") return APP_DATA.steps[2].navTextMarkGreen;
      return APP_DATA.steps[2].navTextDone;
    }
    if (currentStep === 3) {
      if (step3Phase === "initial") return APP_DATA.steps[3].navTextInitial;
      if (step3Phase === "done") return APP_DATA.steps[3].navTextLocate;
      if (step3Phase === "centreShown") return APP_DATA.steps[3].navTextNext;
    }
    if (currentStep === 4) {
      if (step4Phase === "done") return APP_DATA.steps[4].navTextDone;
      return APP_DATA.steps[4].navTextInitial;
    }
    if (currentStep === 5) {
      if (step5Phase === "done") return APP_DATA.steps[5].navTextDone;
      return APP_DATA.steps[5].navTextInitial;
    }
    return "";
  }, [currentStep, step1Phase, step2Phase, step3Phase, step4Phase, step5Phase]);

  const rightText = useMemo(() => {
    if (currentStep === 1) {
      if (step1Phase === "initial") return APP_DATA.steps[1].rightTextInitial;
      return APP_DATA.steps[1].rightTextPinned;
    }
    if (currentStep === 2) {
      if (step2Phase === "initial") return APP_DATA.steps[2].rightTextInitial;
      if (step2Phase === "pointPlaced") return APP_DATA.steps[2].rightTextPointPlaced;
      return APP_DATA.steps[2].rightTextDone;
    }
    if (currentStep === 3) {
      if (step3Phase === "initial") return APP_DATA.steps[3].rightTextInitial;
      if (step3Phase === "done") return APP_DATA.steps[3].rightTextDone;
      if (step3Phase === "centreShown") return APP_DATA.steps[3].rightTextCentre;
    }
    if (currentStep === 4) {
      if (step4Phase === "initial") return APP_DATA.steps[4].rightTextInitial;
      if (step4Phase === "rotating") return APP_DATA.steps[4].rightTextRotating;
      if (step4Phase === "done") return APP_DATA.steps[4].rightTextDone;
    }
    return "";
  }, [currentStep, step1Phase, step2Phase, step3Phase, step4Phase]);

  const isNextDisabled = !(
    (currentStep === 3 && step3Phase === "centreShown") ||
    (currentStep === 4 && step4Phase === "done") ||
    (currentStep === 5 && step5Phase === "done")
  );
  const isPrevDisabled = currentStep <= 1;

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (isNextDisabled) return;
    if (currentStep === 3 && step3Phase === "centreShown") {
      setCurrentStep(4);
      setStep4Phase("initial");
    } else if (currentStep === 4 && step4Phase === "done") {
      setCurrentStep(5);
      setStep5Phase("initial");
    } else if (currentStep === 5 && step5Phase === "done") {
      setCurrentStep(6);
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 6) return;
    if (currentStep === 5) {
      setCurrentStep(4);
      setStep4Phase("done");
      setStep5Phase("initial");
      return;
    }
    if (currentStep === 4) {
      setCurrentStep(3);
      setStep3Phase("centreShown");
      setStep4Phase("initial");
      return;
    }
    if (currentStep === 3) {
      setCurrentStep(2);
      setStep2Phase("purplePlaced");
      setStep3Phase("initial");
      return;
    }
    if (currentStep === 2) {
      setCurrentStep(1);
      setStep1Phase("pinPlaced");
      setStep2Phase("initial");
    } else if (currentStep === 1) {
      setCurrentStep(0);
      setStep1Phase("initial");
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
      } else if (currentStep === 3 && step3Phase === "done") {
        addNudgeFor("pin2-tap");
      } else if (
        (currentStep === 3 && step3Phase === "centreShown") ||
        (currentStep === 4 && step4Phase === "done") ||
        (currentStep === 5 && step5Phase === "done")
      ) {
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
  }, [currentStep, step3Phase, step4Phase, step5Phase]);

  const renderNudges = () =>
    nudgePositions.map((position, index) =>
      React.createElement(Nudge, { key: index, show: true, position })
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
        })
      ),
      renderNudges()
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, { text: questionText, step: currentStep }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      currentStep === 6
        ? React.createElement(SummaryCanvas)
        : React.createElement(MainCanvas, {
            step: currentStep,
            step1Phase,
            step2Phase,
            step3Phase,
            step4Phase,
            step5Phase,
            rightText,
            onStep1PinPlaced: handleStep1PinPlaced,
            onStep1RotationDone: handleStep1RotationDone,
            onStep2PointPlaced: handleStep2PointPlaced,
            onStep2RotationDone: handleStep2RotationDone,
            onStep2PurplePlaced: handleStep2PurplePlaced,
            onStep2GreenPlaced: handleStep2GreenPlaced,
            onStep3RotationDone: handleStep3RotationDone,
            onStep3CentreTapped: handleStep3CentreTapped,
            onStep4DragStart: handleStep4DragStart,
            onStep4Drop: handleStep4Drop,
            onStep5LeftDone: handleStep5LeftDone,
            onStep5RightDone: handleStep5RightDone,
          })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) =>
          dir === "next" ? handleNext() : dir === "prev" ? handlePrev() : null,
        isNextDisabled,
        isPrevDisabled,
        navText,
        completionMode: currentStep === 6,
        startOverText: currentStep === 6 ? APP_DATA.steps[6].startOverText : "",
        onStartOver: handleStartOver,
      })
    ),
    renderNudges()
  );
};
