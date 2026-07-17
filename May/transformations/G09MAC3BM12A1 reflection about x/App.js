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

  // Step 6 coordinate reveal
  const [step6Phase, setStep6Phase] = useState("idle"); // idle | running | done
  const [step6ShowVerticalLine, setStep6ShowVerticalLine] = useState(false);
  const [step6VerticalLineGrowing, setStep6VerticalLineGrowing] = useState(false);
  const [step6HighlightX2, setStep6HighlightX2] = useState(false);
  const [step6ShowCoordLabel, setStep6ShowCoordLabel] = useState(false);
  const [step6ShowCoordX, setStep6ShowCoordX] = useState(false);
  const [step6XCloneVisible, setStep6XCloneVisible] = useState(false);
  const [step6XCloneFlying, setStep6XCloneFlying] = useState(false);
  const [step6ShowHorizontalLine, setStep6ShowHorizontalLine] = useState(false);
  const [step6HorizontalLineGrowing, setStep6HorizontalLineGrowing] = useState(false);
  const [step6HighlightYNeg4, setStep6HighlightYNeg4] = useState(false);
  const [step6ShowCoordY, setStep6ShowCoordY] = useState(false);
  const [step6YCloneVisible, setStep6YCloneVisible] = useState(false);
  const [step6YCloneFlying, setStep6YCloneFlying] = useState(false);

  // Step 7 observation MCQ
  const [step7Answer, setStep7Answer] = useState(null); // null | wrong | correct
  const [step7WrongCloneVisible, setStep7WrongCloneVisible] = useState(false);
  const [step7WrongCloneFlying, setStep7WrongCloneFlying] = useState(false);

  // Step 8 rule reveal
  const [step8Phase, setStep8Phase] = useState("idle"); // idle | x-blink | x-stable | y-blink | done
  const [step8ShowFormula, setStep8ShowFormula] = useState(false);
  const [step8XActive, setStep8XActive] = useState(false);
  const [step8XBlink, setStep8XBlink] = useState(false);
  const [step8YActive, setStep8YActive] = useState(false);
  const [step8YBlink, setStep8YBlink] = useState(false);

  // Step 9 challenge
  const [step9QuestionIndex, setStep9QuestionIndex] = useState(0);
  const [step9Part, setStep9Part] = useState("x"); // x | y
  const [step9XAnswer, setStep9XAnswer] = useState("");
  const [step9XStatus, setStep9XStatus] = useState(null); // null | wrong | correct
  const [step9XFeedback, setStep9XFeedback] = useState("");
  const [step9YAnswer, setStep9YAnswer] = useState("");
  const [step9YStatus, setStep9YStatus] = useState(null); // null | wrong | correct
  const [step9YFeedback, setStep9YFeedback] = useState("");

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

    setStep6Phase("idle");
    setStep6ShowVerticalLine(false);
    setStep6VerticalLineGrowing(false);
    setStep6HighlightX2(false);
    setStep6ShowCoordLabel(false);
    setStep6ShowCoordX(false);
    setStep6XCloneVisible(false);
    setStep6XCloneFlying(false);
    setStep6ShowHorizontalLine(false);
    setStep6HorizontalLineGrowing(false);
    setStep6HighlightYNeg4(false);
    setStep6ShowCoordY(false);
    setStep6YCloneVisible(false);
    setStep6YCloneFlying(false);

    setStep7Answer(null);
    setStep7WrongCloneVisible(false);
    setStep7WrongCloneFlying(false);

    setStep8Phase("idle");
    setStep8ShowFormula(false);
    setStep8XActive(false);
    setStep8XBlink(false);
    setStep8YActive(false);
    setStep8YBlink(false);

    setStep9Part("x");
    setStep9QuestionIndex(0);
    setStep9XAnswer("");
    setStep9XStatus(null);
    setStep9XFeedback("");
    setStep9YAnswer("");
    setStep9YStatus(null);
    setStep9YFeedback("");
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

  const resetStep6State = useCallback(() => {
    setStep6Phase("idle");
    setStep6ShowVerticalLine(false);
    setStep6VerticalLineGrowing(false);
    setStep6HighlightX2(false);
    setStep6ShowCoordLabel(false);
    setStep6ShowCoordX(false);
    setStep6XCloneVisible(false);
    setStep6XCloneFlying(false);
    setStep6ShowHorizontalLine(false);
    setStep6HorizontalLineGrowing(false);
    setStep6HighlightYNeg4(false);
    setStep6ShowCoordY(false);
    setStep6YCloneVisible(false);
    setStep6YCloneFlying(false);
  }, []);

  const resetStep7State = useCallback(() => {
    setStep7Answer(null);
    setStep7WrongCloneVisible(false);
    setStep7WrongCloneFlying(false);
  }, []);

  const resetStep8State = useCallback(() => {
    setStep8Phase("idle");
    setStep8ShowFormula(false);
    setStep8XActive(false);
    setStep8XBlink(false);
    setStep8YActive(false);
    setStep8YBlink(false);
  }, []);

  const resetStep9State = useCallback(() => {
    setStep9Part("x");
    setStep9XAnswer("");
    setStep9XStatus(null);
    setStep9XFeedback("");
    setStep9YAnswer("");
    setStep9YStatus(null);
    setStep9YFeedback("");
  }, []);

  const resetStep9Answers = useCallback(() => {
    setStep9Part("x");
    setStep9XAnswer("");
    setStep9XStatus(null);
    setStep9XFeedback("");
    setStep9YAnswer("");
    setStep9YStatus(null);
    setStep9YFeedback("");
  }, []);

  const runStep6Sequence = useCallback(() => {
    resetStep6State();
    setCurrentStep(6);
    setStep6Phase("running");

    schedule(() => {
      setStep6ShowVerticalLine(true);
      setStep6VerticalLineGrowing(true);
    }, 300);

    schedule(() => {
      setStep6VerticalLineGrowing(false);
      setStep6HighlightX2(true);
    }, 1100);

    schedule(() => {
      setStep6ShowCoordLabel(true);
    }, 1400);

    schedule(() => {
      setStep6XCloneVisible(true);
      setStep6XCloneFlying(false);
      schedule(() => setStep6XCloneFlying(true), 50);
    }, 1700);

    schedule(() => {
      setStep6XCloneVisible(false);
      setStep6ShowCoordX(true);
    }, 2550);

    schedule(() => {
      setStep6ShowHorizontalLine(true);
      setStep6HorizontalLineGrowing(true);
    }, 2850);

    schedule(() => {
      setStep6HorizontalLineGrowing(false);
      setStep6HighlightYNeg4(true);
    }, 3650);

    schedule(() => {
      setStep6YCloneVisible(true);
      setStep6YCloneFlying(false);
      schedule(() => setStep6YCloneFlying(true), 50);
    }, 3950);

    schedule(() => {
      setStep6YCloneVisible(false);
      setStep6ShowCoordY(true);
    }, 4800);

    schedule(() => {
      setStep6Phase("done");
    }, 5400);
  }, [resetStep6State, schedule]);

  const startStep7 = useCallback(() => {
    resetStep7State();
    resetStep8State();
    setCurrentStep(7);
  }, [resetStep7State, resetStep8State]);

  const startStep8 = useCallback(() => {
    resetStep8State();
    resetStep9State();
    setCurrentStep(8);
  }, [resetStep8State, resetStep9State]);

  const startStep9 = useCallback(() => {
    setStep9QuestionIndex(0);
    resetStep9State();
    setCurrentStep(9);
  }, [resetStep9State]);

  const handleStep7Option = useCallback(
    (choice) => {
      if (currentStep !== 7) return;
      if (choice === "y") {
        if (typeof playSound === "function") playSound("correct");
        setStep7WrongCloneVisible(false);
        setStep7WrongCloneFlying(false);
        setStep7Answer("correct");
        return;
      }

      if (typeof playSound === "function") playSound("wrong");
      setStep7Answer("wrong");
      setStep7WrongCloneVisible(true);
      setStep7WrongCloneFlying(false);
      schedule(() => setStep7WrongCloneFlying(true), 50);
      schedule(() => {
        setStep7WrongCloneVisible(false);
        setStep7WrongCloneFlying(false);
      }, 950);
    },
    [currentStep, schedule],
  );

  const handleStep8Reveal = useCallback(() => {
    if (currentStep !== 8 || step8Phase !== "idle") return;
    if (typeof playSound === "function") playSound("click");

    setStep8ShowFormula(true);
    setStep8Phase("x-blink");

    schedule(() => {
      setStep8XActive(true);
      setStep8XBlink(true);
    }, 250);

    schedule(() => {
      setStep8XBlink(false);
      setStep8Phase("x-stable");
    }, 2750);

    schedule(() => {
      setStep8YActive(true);
      setStep8YBlink(true);
      setStep8Phase("y-blink");
    }, 3350);

    schedule(() => {
      setStep8YBlink(false);
      setStep8Phase("done");
    }, 5850);
  }, [currentStep, step8Phase, schedule]);

  const handleStep9Option = useCallback(
    (value) => {
      if (currentStep !== 9) return;
      const s9 = APP_DATA.steps[9];
      const question = s9.questions[step9QuestionIndex] || s9.questions[0];

      if (step9Part === "x") {
        if (step9XStatus === "correct") return;
        const isCorrect = value === question.imageX;
        if (typeof playSound === "function") {
          playSound(isCorrect ? "correct" : "wrong");
        }
        setStep9XAnswer(value);
        if (isCorrect) {
          setStep9XStatus("correct");
          setStep9XFeedback(s9.xCorrect);
        } else {
          setStep9XStatus("wrong");
          const changedSign =
            Number(value) === -Number(question.x) && Number(question.x) !== 0;
          setStep9XFeedback(
            changedSign ? s9.xWrongNeg3 : s9.xWrongOther,
          );
        }
        return;
      }

      if (step9YStatus === "correct") return;
      const isCorrect = value === question.imageY;
      if (typeof playSound === "function") {
        playSound(isCorrect ? "correct" : "wrong");
      }
      setStep9YAnswer(value);
      if (isCorrect) {
        setStep9YStatus("correct");
        setStep9YFeedback(s9.yCorrect);
      } else {
        setStep9YStatus("wrong");
        if (value === question.x) setStep9YFeedback(s9.yWrong3);
        else if (value === question.y) setStep9YFeedback(s9.yWrong4);
        else setStep9YFeedback(s9.yWrongNeg3);
      }
    },
    [currentStep, step9Part, step9QuestionIndex, step9XStatus, step9YStatus],
  );

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
    if (currentStep === 6) {
      return step6Phase === "done"
        ? handleComma(APP_DATA.steps[6].navTextDone)
        : "";
    }
    if (currentStep === 7) {
      const s7 = APP_DATA.steps[7];
      return handleComma(
        step7Answer === "correct" ? s7.navTextDone : s7.navTextInitial,
      );
    }
    if (currentStep === 8) {
      const s8 = APP_DATA.steps[8];
      return handleComma(
        step8Phase === "done" ? s8.navTextDone : s8.navTextInitial,
      );
    }
    if (currentStep === 9) {
      const s9 = APP_DATA.steps[9];
      if (step9Part === "x") {
        return handleComma(
          step9XStatus === "correct" ? s9.navTextXDone : s9.navTextInitial,
        );
      }
      const isLastQuestion = step9QuestionIndex >= s9.questions.length - 1;
      return handleComma(
        step9YStatus === "correct"
          ? isLastQuestion
            ? s9.navTextFinalDone
            : s9.navTextYDone
          : s9.navTextInitial,
      );
    }
    return "";
  }, [
    currentStep,
    step2Feedback,
    step4Phase,
    step5Phase,
    step6Phase,
    step7Answer,
    step8Phase,
    step9Part,
    step9QuestionIndex,
    step9XStatus,
    step9YStatus,
  ]);

  const isNextDisabled =
    currentStep === 2 ||
    currentStep === 3 ||
    currentStep === 4 ||
    (currentStep === 5 && step5Phase !== "done") ||
    (currentStep === 6 && step6Phase !== "done") ||
    (currentStep === 7 && step7Answer !== "correct") ||
    (currentStep === 8 && step8Phase !== "done") ||
    (currentStep === 9 &&
      !(
        (step9Part === "x" && step9XStatus === "correct") ||
        (step9Part === "y" && step9YStatus === "correct")
      ));

  const isPrevDisabled = currentStep <= 1;

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (isNextDisabled) return;
    if (currentStep === 1) {
      setCurrentStep(2);
      setStep2Phase("initial");
      setStep2Feedback(null);
      setPlottedPoint(null);
      return;
    }
    if (currentStep === 5 && step5Phase === "done") {
      runStep6Sequence();
      return;
    }
    if (currentStep === 6 && step6Phase === "done") {
      startStep7();
      return;
    }
    if (currentStep === 7 && step7Answer === "correct") {
      startStep8();
      return;
    }
    if (currentStep === 8 && step8Phase === "done") {
      startStep9();
      return;
    }
    if (currentStep === 9 && step9Part === "x" && step9XStatus === "correct") {
      setStep9Part("y");
      setStep9YAnswer("");
      setStep9YStatus(null);
      setStep9YFeedback("");
      return;
    }
    if (currentStep === 9 && step9Part === "y" && step9YStatus === "correct") {
      const lastQuestionIndex = APP_DATA.steps[9].questions.length - 1;
      if (step9QuestionIndex < lastQuestionIndex) {
        setStep9QuestionIndex((index) => index + 1);
        resetStep9Answers();
      } else {
        setCurrentStep(10);
      }
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
      } else if (currentStep === 2 && step2Phase !== "correct" && step2Phase !== "done") {
        addNudgeFor("step2-target-nudge");
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
      } else if (currentStep === 6 && step6Phase === "done") {
        addNudgeFor("next-button");
      } else if (currentStep === 7) {
        if (step7Answer === "correct") addNudgeFor("next-button");
      } else if (currentStep === 8) {
        if (step8Phase === "idle") addNudgeFor("step8-reveal-button");
        else if (step8Phase === "done") addNudgeFor("next-button");
      } else if (currentStep === 9) {
        if (
          (step9Part === "x" && step9XStatus === "correct") ||
          (step9Part === "y" && step9YStatus === "correct")
        ) {
          addNudgeFor("next-button");
        }
      } else if (currentStep === 10) {
        addNudgeFor("start-over-button");
      }

      setNudgePositions(positions);
    };
    const timeoutId = setTimeout(updateNudges, 100);
    window.addEventListener("resize", updateNudges);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateNudges);
    };
  }, [
    currentStep,
    isNextDisabled,
    step4Phase,
    xAxisHighlighted,
    step5Phase,
    step6Phase,
    step7Answer,
    step8Phase,
    step2Phase,
    step9Part,
    step9QuestionIndex,
    step9XStatus,
    step9YStatus,
  ]);

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

  if (currentStep === 10) {
    const s10 = APP_DATA.steps[10];
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(
          "div",
          { className: "fullscreen-panel completion-panel" },
          React.createElement("h1", { className: "completion-heading" }, s10.heading),
          React.createElement(
            "div",
            { className: "completion-rule-card" },
            React.createElement(
              "div",
              { className: "completion-rule-title" },
              s10.ruleTitle,
            ),
            React.createElement(
              "div",
              { className: "completion-rule-row" },
              React.createElement(
                "span",
                { className: "completion-rule-label" },
                s10.ruleLabel,
              ),
              React.createElement("span", {
                className: "completion-rule-formula",
                dangerouslySetInnerHTML: { __html: handleComma(s10.ruleFormula) },
              }),
            ),
          ),
          React.createElement("div", {
            className: "completion-body",
            dangerouslySetInnerHTML: { __html: handleComma(s10.body) },
          }),
          React.createElement("div", {
            className: "completion-restart-prompt",
            dangerouslySetInnerHTML: { __html: handleComma(s10.restartPrompt) },
          }),
          React.createElement(
            "button",
            {
              id: "start-over-button",
              className: "btn completion-start-over-button",
              onClick: resetEverything,
            },
            s10.buttonText,
          ),
        ),
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
        step6Phase: step6Phase,
        step6ShowVerticalLine: step6ShowVerticalLine,
        step6VerticalLineGrowing: step6VerticalLineGrowing,
        step6HighlightX2: step6HighlightX2,
        step6ShowCoordLabel: step6ShowCoordLabel,
        step6ShowCoordX: step6ShowCoordX,
        step6XCloneVisible: step6XCloneVisible,
        step6XCloneFlying: step6XCloneFlying,
        step6ShowHorizontalLine: step6ShowHorizontalLine,
        step6HorizontalLineGrowing: step6HorizontalLineGrowing,
        step6HighlightYNeg4: step6HighlightYNeg4,
        step6ShowCoordY: step6ShowCoordY,
        step6YCloneVisible: step6YCloneVisible,
        step6YCloneFlying: step6YCloneFlying,
        step7Answer: step7Answer,
        step7WrongCloneVisible: step7WrongCloneVisible,
        step7WrongCloneFlying: step7WrongCloneFlying,
        onStep7Option: handleStep7Option,
        step8Phase: step8Phase,
        step8ShowFormula: step8ShowFormula,
        step8XActive: step8XActive,
        step8XBlink: step8XBlink,
        step8YActive: step8YActive,
        step8YBlink: step8YBlink,
        onStep8Reveal: handleStep8Reveal,
        step9Part: step9Part,
        step9QuestionIndex: step9QuestionIndex,
        step9XAnswer: step9XAnswer,
        step9XStatus: step9XStatus,
        step9XFeedback: step9XFeedback,
        step9YAnswer: step9YAnswer,
        step9YStatus: step9YStatus,
        step9YFeedback: step9YFeedback,
        onStep9Option: handleStep9Option,
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
