const App = () => {
  const { useState, useEffect, useRef, useMemo, useCallback } = React;

  const TARGET_X = 2;
  const TARGET_Y = 4;

  const [currentStep, setCurrentStep] = useState(0);
  const [step2Phase, setStep2Phase] = useState("initial");
  const [step2Feedback, setStep2Feedback] = useState(null);
  const [plottedPoint, setPlottedPoint] = useState(null);
  const [lineAnimPhase, setLineAnimPhase] = useState(null);
  const [xAxisHighlighted, setXAxisHighlighted] = useState(false);
  const [showReflectionLabel, setShowReflectionLabel] = useState(false);
  const [step4Phase, setStep4Phase] = useState("initial");
  const [showDashedDistance, setShowDashedDistance] = useState(false);
  const [showUnitLine, setShowUnitLine] = useState(false);
  const [unitLineY1, setUnitLineY1] = useState(4);
  const [unitLineY2, setUnitLineY2] = useState(3);
  const [unitLabelText, setUnitLabelText] = useState("");
  const [unitLabelFinal, setUnitLabelFinal] = useState(false);
  const [highlightFour, setHighlightFour] = useState(false);
  const [unitLineRotating, setUnitLineRotating] = useState(false);
  const [nudgePositions, setNudgePositions] = useState([]);

  const timersRef = useRef([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const schedule = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  const resetStepState = useCallback(() => {
    setStep2Phase("initial");
    setStep2Feedback(null);
    setPlottedPoint(null);
    setLineAnimPhase(null);
    setXAxisHighlighted(false);
    setShowReflectionLabel(false);
    setStep4Phase("initial");
    setShowDashedDistance(false);
    setShowUnitLine(false);
    setUnitLineY1(4);
    setUnitLineY2(3);
    setUnitLabelText("");
    setUnitLabelFinal(false);
    setHighlightFour(false);
    setUnitLineRotating(false);
  }, []);

  const resetEverything = useCallback(() => {
    clearTimers();
    setCurrentStep(0);
    resetStepState();
  }, [clearTimers, resetStepState]);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    clearTimers();
    resetStepState();
    setCurrentStep(1);
  };

  useEffect(() => () => clearTimers(), [clearTimers]);

  const handleGridClick = useCallback(
    (math) => {
      if (currentStep !== 2 || step2Phase === "done" || step2Phase === "correct")
        return;
      if (typeof playSound === "function") playSound("click");

      setLineAnimPhase(null);
      setPlottedPoint(math);
      const isCorrect = math.x === TARGET_X && math.y === TARGET_Y;

      if (isCorrect) {
        setStep2Phase("correct");
        setStep2Feedback("correct");
        setLineAnimPhase(null);
        if (typeof playSound === "function") playSound("correct");
        schedule(() => {
          setStep2Phase("done");
          setCurrentStep(3);
        }, 2000);
      } else {
        setStep2Phase("wrong");
        setStep2Feedback("wrong");
        setLineAnimPhase("v");
        if (typeof playSound === "function") playSound("wrong");
        schedule(() => {
          setLineAnimPhase("h");
          schedule(() => setLineAnimPhase("done"), 600);
        }, 600);
      }
    },
    [currentStep, step2Phase, schedule],
  );

  const handleXAxisClick = useCallback(() => {
    if (currentStep !== 3 || xAxisHighlighted) return;
    if (typeof playSound === "function") playSound("click");
    setXAxisHighlighted(true);
    setShowReflectionLabel(true);
    schedule(() => {
      setShowReflectionLabel(false);
      schedule(() => setCurrentStep(4), 300);
    }, 1000);
  }, [currentStep, xAxisHighlighted, schedule]);

  const runDistanceAnimation = useCallback(() => {
    const s4 = APP_DATA.steps[4];
    const ROTATE_MS = 750;
    const GAP_MS = 400;

    setUnitLineY1(4);
    setUnitLineY2(3);
    setShowUnitLine(true);
    setUnitLabelText(s4.unitSingular);
    setUnitLabelFinal(false);
    setUnitLineRotating(false);

    const afterRotate = (y1, y2, label, next) => {
      setUnitLineRotating(false);
      setUnitLineY1(y1);
      setUnitLineY2(y2);
      setUnitLabelText(label);
      schedule(next, GAP_MS);
    };

    schedule(() => {
      setUnitLineRotating(true);
      schedule(() => {
        afterRotate(3, 2, s4.unitPlural.replace("{n}", "2"), () => {
          setUnitLineRotating(true);
          schedule(() => {
            afterRotate(2, 1, s4.unitPlural.replace("{n}", "3"), () => {
              setUnitLineRotating(true);
              schedule(() => {
                afterRotate(1, 0, s4.unitPlural.replace("{n}", "4"), () => {
                  schedule(() => {
                    setShowUnitLine(false);
                    setUnitLabelFinal(true);
                    setUnitLabelText(s4.unitPlural.replace("{n}", "4"));
                    schedule(() => {
                      setHighlightFour(true);
                      setStep4Phase("done");
                    }, 400);
                  }, GAP_MS);
                });
              }, ROTATE_MS);
            });
          }, ROTATE_MS);
        });
      }, ROTATE_MS);
    }, 600);
  }, [schedule]);

  const handleRevealClick = useCallback(() => {
    if (currentStep !== 4 || step4Phase !== "initial") return;
    if (typeof playSound === "function") playSound("click");
    setStep4Phase("revealing");
    setShowDashedDistance(true);
    schedule(() => {
      setStep4Phase("animating");
      runDistanceAnimation();
    }, 650);
  }, [currentStep, step4Phase, schedule, runDistanceAnimation]);

  const handlePropertiesClick = useCallback(() => {
    if (currentStep !== 4 || step4Phase !== "done") return;
    if (typeof playSound === "function") playSound("click");
    setStep4Phase("properties-ready");
    setHighlightFour(false);
    schedule(() => setCurrentStep(5), 200);
  }, [currentStep, step4Phase, schedule]);

  const handleProperty1Click = useCallback(() => {
    if (currentStep !== 5) return;
    if (typeof playSound === "function") playSound("click");
  }, [currentStep]);

  const navText = useMemo(() => {
    if (currentStep === 1) return handleComma(APP_DATA.steps[1].navText);
    if (currentStep === 2) {
      const s2 = APP_DATA.steps[2];
      return handleComma(
        step2Feedback === "wrong" ? s2.navTextRetry : s2.navTextInitial,
      );
    }
    if (currentStep === 3) return handleComma(APP_DATA.steps[3].navText);
    if (currentStep === 4) {
      const s4 = APP_DATA.steps[4];
      if (step4Phase === "done" || step4Phase === "properties-ready") {
        return handleComma(s4.navTextProperties);
      }
      return handleComma(s4.navTextReveal);
    }
    if (currentStep === 5) return handleComma(APP_DATA.steps[5].navText);
    return "";
  }, [currentStep, step2Feedback, step4Phase]);

  const isNextDisabled =
    currentStep === 2 ||
    currentStep === 3 ||
    currentStep === 4 ||
    currentStep === 5;

  const isPrevDisabled = currentStep <= 1;

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (isNextDisabled) return;
    if (currentStep === 1) {
      setCurrentStep(2);
      setStep2Phase("initial");
      setStep2Feedback(null);
      setPlottedPoint(null);
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 1) {
      resetEverything();
      return;
    }
    if (currentStep === 2) {
      setCurrentStep(1);
      resetStepState();
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
      } else if (currentStep === 1 && !isNextDisabled) {
        addNudgeFor("next-button");
      } else if (currentStep === 3 && !xAxisHighlighted) {
        addNudgeFor("x-axis-hit");
      } else if (currentStep === 4 && step4Phase === "initial") {
        addNudgeFor("reveal-button");
      } else if (currentStep === 4 && step4Phase === "done") {
        addNudgeFor("properties-button");
      } else if (currentStep === 5) {
        addNudgeFor("property-1-button");
      }

      setNudgePositions(positions);
    };
    const timeoutId = setTimeout(updateNudges, 100);
    window.addEventListener("resize", updateNudges);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateNudges);
    };
  }, [currentStep, isNextDisabled, step4Phase, xAxisHighlighted]);

  const renderNudges = () =>
    nudgePositions.map((position, index) =>
      React.createElement(Nudge, { key: index, show: true, position: position }),
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
          text: handleComma(APP_DATA.start.text),
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
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        step: currentStep,
        step2Phase: step2Phase,
        step2Feedback: step2Feedback,
        plottedPoint: plottedPoint,
        lineAnimPhase: lineAnimPhase,
        xAxisHighlighted: xAxisHighlighted,
        showReflectionLabel: showReflectionLabel,
        step4Phase: step4Phase,
        showUnitLine: showUnitLine,
        unitLineY1: unitLineY1,
        unitLineY2: unitLineY2,
        unitLabelText: unitLabelText,
        unitLabelFinal: unitLabelFinal,
        highlightFour: highlightFour,
        unitLineRotating: unitLineRotating,
        showDashedDistance: showDashedDistance,
        onGridClick: handleGridClick,
        onXAxisClick: handleXAxisClick,
        onRevealClick: handleRevealClick,
        onPropertiesClick: handlePropertiesClick,
        onProperty1Click: handleProperty1Click,
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
      }),
    ),
    renderNudges(),
  );
};
