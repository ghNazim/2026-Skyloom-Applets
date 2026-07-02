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
  const [showQ1FourUnitsLabel, setShowQ1FourUnitsLabel] = useState(false);
  const [unitLineRotating, setUnitLineRotating] = useState(false);
  const [nudgePositions, setNudgePositions] = useState([]);

  // Step 5 (properties) state machine
  const [step5Phase, setStep5Phase] = useState("prop1-ready"); // prop1-ready | prop1-running | prop2-ready | prop2-running | done
  const [prop1Done, setProp1Done] = useState(false);
  const [prop2Done, setProp2Done] = useState(false);

  // Step 5 graph overlays
  const [p1LineVisible, setP1LineVisible] = useState(false);
  const [p1LineFadeReady, setP1LineFadeReady] = useState(false);
  const [p1RightAngleVisible, setP1RightAngleVisible] = useState(false);
  const [p1RightAngleFadeReady, setP1RightAngleFadeReady] = useState(false);
  const [cloneVisible, setCloneVisible] = useState(false);
  const [cloneY, setCloneY] = useState(4);
  const [cloneOpacity, setCloneOpacity] = useState(1);

  const [calloutVisible, setCalloutVisible] = useState(false);
  const [calloutFadeReady, setCalloutFadeReady] = useState(false);
  const [calloutPos, setCalloutPos] = useState("q4"); // q4 | q1
  const [calloutMode, setCalloutMode] = useState(null); // prop1 | prop2A | prop2B
  const [calloutPrevMode, setCalloutPrevMode] = useState(null);
  const [calloutTextNextReady, setCalloutTextNextReady] = useState(true);
  const [calloutLoading, setCalloutLoading] = useState(false);

  const [showMeasureLine, setShowMeasureLine] = useState(false);
  const [measureLineUnits, setMeasureLineUnits] = useState(0);
  const [measureLineGrowing, setMeasureLineGrowing] = useState(false);
  const [unitLabelOverride, setUnitLabelOverride] = useState(null); // {x,y} in math coords
  const [showApost, setShowApost] = useState(false);
  const [apostFadeReady, setApostFadeReady] = useState(false);
  const [step5DoneTextVisible, setStep5DoneTextVisible] = useState(false);

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
    setShowQ1FourUnitsLabel(false);
    setUnitLineRotating(false);

    setStep5Phase("prop1-ready");
    setProp1Done(false);
    setProp2Done(false);
    setP1LineVisible(false);
    setP1LineFadeReady(false);
    setP1RightAngleVisible(false);
    setP1RightAngleFadeReady(false);
    setCloneVisible(false);
    setCloneY(4);
    setCloneOpacity(1);
    setCalloutVisible(false);
    setCalloutFadeReady(false);
    setCalloutPos("q4");
    setCalloutMode(null);
    setCalloutPrevMode(null);
    setCalloutTextNextReady(true);
    setCalloutLoading(false);
    setShowMeasureLine(false);
    setMeasureLineUnits(0);
    setMeasureLineGrowing(false);
    setUnitLabelOverride(null);
    setShowApost(false);
    setApostFadeReady(false);
    setStep5DoneTextVisible(false);
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
    }, 2000);
  }, [currentStep, xAxisHighlighted, schedule]);

  const runDistanceAnimation = useCallback(() => {
    const s4 = APP_DATA.steps[4];
    const ROTATE_MS = 750;
    const GAP_MS = 300;
    const PAUSE_BEFORE_UNIT_MS = 1000;

    setUnitLineY1(4);
    setUnitLineY2(3);
    setShowUnitLine(false);
    setUnitLabelText("");
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
      setShowUnitLine(true);
      setUnitLabelText(s4.unitSingular);
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
                    setShowQ1FourUnitsLabel(true);
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
    }, PAUSE_BEFORE_UNIT_MS);
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
    setStep5Phase("prop1-ready");
    setProp1Done(false);
    setProp2Done(false);
    schedule(() => setCurrentStep(5), 200);
  }, [currentStep, step4Phase, schedule]);

  const runProp1Sequence = useCallback(() => {
    const LINE_FADE_MS = 550;
    const SQUARE_FADE_MS = 550;
    const AFTER_RIGHT_ANGLE_MS = 600;

    setStep5Phase("prop1-running");
    setP1LineVisible(true);
    setP1LineFadeReady(false);
    setP1RightAngleVisible(false);
    setP1RightAngleFadeReady(false);
    setCalloutVisible(false);
    setCalloutFadeReady(false);
    setCloneVisible(false);
    setCloneOpacity(1);
    setCloneY(4);

    schedule(() => setP1LineFadeReady(true), 50);

    schedule(() => {
      setP1RightAngleVisible(true);
      schedule(() => setP1RightAngleFadeReady(true), 50);
    }, LINE_FADE_MS);

    schedule(() => {
      setCalloutVisible(true);
      setCalloutMode("prop1");
      setCalloutPos("q4");
      setCalloutLoading(false);
      schedule(() => setCalloutFadeReady(true), 50);
    }, LINE_FADE_MS + SQUARE_FADE_MS);

    const cloneStart = LINE_FADE_MS + AFTER_RIGHT_ANGLE_MS;

    schedule(() => {
      setCloneVisible(true);
      setCloneOpacity(1);
      setCloneY(4);
    }, cloneStart);

    const move = (y, offset) =>
      schedule(() => {
        setCloneY(y);
      }, cloneStart + offset);

    move(-2, 250);
    move(-5, 850);
    move(-3, 1450);
    move(-4, 2050);
    move(-10, 2700);
    schedule(() => setCloneOpacity(0), cloneStart + 3000);

    schedule(() => {
      setCloneVisible(false);
      setProp1Done(true);
      setStep5Phase("prop2-ready");
    }, cloneStart + 3400);
  }, [schedule]);

  const handleProperty1Click = useCallback(() => {
    if (currentStep !== 5) return;
    if (prop1Done || step5Phase !== "prop1-ready") return;
    if (typeof playSound === "function") playSound("click");
    runProp1Sequence();
  }, [currentStep, prop1Done, step5Phase, runProp1Sequence]);

  const runProp2Sequence = useCallback(() => {
    const s4 = APP_DATA.steps[4];
    const PAUSE_BEFORE_Q1_MOVE_MS = 500;
    const READ_Q1_MS = 2500;
    const PAUSE_AFTER_Q4_MS = 1000;
    const ROTATE_MS = 750;
    const GAP_MS = 700;
    const CALLOUT_CROSSFADE_MS = 600;
    const APOST_FADE_MS = 550;
    const LABEL_MOVE_DELAY_MS = 550;

    const crossfadeCallout = (prevMode, nextMode, nextPos, onDone) => {
      setCalloutPrevMode(prevMode);
      setCalloutMode(nextMode);
      setCalloutTextNextReady(false);
      setCalloutPos(nextPos);
      schedule(() => setCalloutTextNextReady(true), 50);
      schedule(() => {
        setCalloutPrevMode(null);
        setCalloutTextNextReady(true);
        if (onDone) onDone();
      }, CALLOUT_CROSSFADE_MS);
    };

    setStep5Phase("prop2-running");
    setCalloutLoading(false);
    setShowMeasureLine(false);
    setMeasureLineUnits(0);
    setUnitLabelOverride(null);
    setShowApost(false);
    setApostFadeReady(false);
    setShowUnitLine(false);
    setUnitLineY1(0);
    setUnitLineY2(-1);
    setUnitLabelText("");
    setUnitLineRotating(false);

    const setMeasureExtent = (units) => {
      setMeasureLineUnits(units);
      setShowMeasureLine(true);
    };

    const moveToQ4At = PAUSE_BEFORE_Q1_MOVE_MS + READ_Q1_MS;
    const startUnitsAt = moveToQ4At + PAUSE_AFTER_Q4_MS + CALLOUT_CROSSFADE_MS;

    schedule(() => {
      crossfadeCallout("prop1", "prop2A", "q1");
    }, PAUSE_BEFORE_Q1_MOVE_MS);

    schedule(() => {
      crossfadeCallout("prop2A", "prop2B", "q4", () => {
        setCalloutLoading(true);
      });
    }, moveToQ4At);

    schedule(() => {
      const afterRotate = (y1, y2, label, units, next) => {
        setUnitLineRotating(false);
        setUnitLineY1(y1);
        setUnitLineY2(y2);
        setUnitLabelText(label);
        setMeasureExtent(units);
        schedule(next, GAP_MS);
      };

      setShowUnitLine(true);
      setUnitLabelText(s4.unitSingular);
      setMeasureExtent(1);

      setUnitLineRotating(true);
      schedule(() => {
        afterRotate(-1, -2, s4.unitPlural.replace("{n}", "2"), 2, () => {
          setUnitLineRotating(true);
          schedule(() => {
            afterRotate(-2, -3, s4.unitPlural.replace("{n}", "3"), 3, () => {
              setUnitLineRotating(true);
              schedule(() => {
                afterRotate(-3, -4, s4.unitPlural.replace("{n}", "4"), 4, () => {
                  schedule(() => {
                    setShowUnitLine(false);
                    setUnitLabelText(s4.unitPlural.replace("{n}", "4"));

                    setCalloutVisible(false);
                    setCalloutFadeReady(false);
                    setCalloutLoading(false);
                    setCalloutPrevMode(null);

                    setShowApost(true);
                    schedule(() => setApostFadeReady(true), 50);

                    schedule(() => {
                      setUnitLabelOverride({ x: 2, y: -2 });
                    }, LABEL_MOVE_DELAY_MS);

                    schedule(() => {
                      setProp2Done(true);
                      setStep5Phase("done");
                      schedule(() => setStep5DoneTextVisible(true), 2500);
                    }, LABEL_MOVE_DELAY_MS + 500);
                  }, GAP_MS);
                });
              }, ROTATE_MS);
            });
          }, ROTATE_MS);
        });
      }, ROTATE_MS);
    }, startUnitsAt);
  }, [schedule]);

  const handleProperty2Click = useCallback(() => {
    if (currentStep !== 5) return;
    if (!prop1Done || prop2Done) return;
    if (step5Phase !== "prop2-ready") return;
    if (typeof playSound === "function") playSound("click");
    runProp2Sequence();
  }, [currentStep, prop1Done, prop2Done, step5Phase, runProp2Sequence]);

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
    if (currentStep === 5) {
      const s5 = APP_DATA.steps[5];
      if (step5Phase === "prop2-ready" || step5Phase === "prop2-running") {
        return handleComma(s5.navTextProp2);
      }
      if (step5Phase === "done") {
        return handleComma(s5.navTextDone);
      }
      return handleComma(s5.navTextProp1);
    }
    return "";
  }, [currentStep, step2Feedback, step4Phase, step5Phase]);

  const isNextDisabled =
    currentStep === 2 ||
    currentStep === 3 ||
    currentStep === 4 ||
    (currentStep === 5 && step5Phase !== "done");

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
        if (step5Phase === "prop1-ready") addNudgeFor("property-1-button");
        else if (step5Phase === "prop2-ready") addNudgeFor("property-2-button");
        else if (step5Phase === "done") addNudgeFor("next-button");
      }

      setNudgePositions(positions);
    };
    const timeoutId = setTimeout(updateNudges, 100);
    window.addEventListener("resize", updateNudges);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateNudges);
    };
  }, [currentStep, isNextDisabled, step4Phase, xAxisHighlighted, step5Phase]);

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
        showQ1FourUnitsLabel: showQ1FourUnitsLabel,
        unitLineRotating: unitLineRotating,
        showDashedDistance: showDashedDistance,
        onGridClick: handleGridClick,
        onXAxisClick: handleXAxisClick,
        onRevealClick: handleRevealClick,
        onPropertiesClick: handlePropertiesClick,
        onProperty1Click: handleProperty1Click,
        onProperty2Click: handleProperty2Click,
        step5Phase: step5Phase,
        prop1Done: prop1Done,
        prop2Done: prop2Done,
        p1LineVisible: p1LineVisible,
        p1LineFadeReady: p1LineFadeReady,
        p1RightAngleVisible: p1RightAngleVisible,
        p1RightAngleFadeReady: p1RightAngleFadeReady,
        cloneVisible: cloneVisible,
        cloneY: cloneY,
        cloneOpacity: cloneOpacity,
        calloutVisible: calloutVisible,
        calloutFadeReady: calloutFadeReady,
        calloutPos: calloutPos,
        calloutMode: calloutMode,
        calloutPrevMode: calloutPrevMode,
        calloutTextNextReady: calloutTextNextReady,
        calloutLoading: calloutLoading,
        showMeasureLine: showMeasureLine,
        measureLineUnits: measureLineUnits,
        measureLineGrowing: measureLineGrowing,
        unitLabelOverride: unitLabelOverride,
        showApost: showApost,
        apostFadeReady: apostFadeReady,
        step5DoneTextVisible: step5DoneTextVisible,
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
