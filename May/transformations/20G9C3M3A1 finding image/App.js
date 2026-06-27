const STEP9_ORIGINAL = {
  A: { x: 2, y: 6 },
  B: { x: 6, y: 6 },
  C: { x: 6, y: 4 },
  D: { x: 2, y: 4 },
};

const STEP9_TARGETS = {
  A: { x: 7, y: 4 },
  B: { x: 11, y: 4 },
  C: { x: 11, y: 2 },
  D: { x: 7, y: 2 },
};

const STEP9_DRAG_ORDER = ["A", "B", "C", "D"];

const STEP10_VERTICES = [
  { x: 8, y: 5, labelPlacement: "above" },
  { x: 8, y: 1, labelPlacement: "below" },
  { x: 11, y: 1, labelPlacement: "below" },
];

const STEP10_CORRECT_OFFSET = { dx: -4, dy: 2 };

const App = () => {
  const { useState, useMemo, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);

  const [step2Phase, setStep2Phase] = useState("initial");

  const [step3Phase, setStep3Phase] = useState("initial");

  const [step3To4Transition, setStep3To4Transition] = useState(false);

  const [step4Phase, setStep4Phase] = useState("initial");

  const [step6Phase, setStep6Phase] = useState("initial");

  const [step7Phase, setStep7Phase] = useState("initial");

  const [step7Clone, setStep7Clone] = useState(null);

  const [step9Phase, setStep9Phase] = useState("initial");

  const [step9CurrentPoint, setStep9CurrentPoint] = useState("A");

  const [step9Placed, setStep9Placed] = useState([]);

  const [step9WrongPoint, setStep9WrongPoint] = useState(null);

  const [step10Phase, setStep10Phase] = useState("initial");

  const [step10Offset, setStep10Offset] = useState({ dx: 0, dy: 0 });

  const [step10FigureColor, setStep10FigureColor] = useState("#c9a0e8");

  const [step10SnapBack, setStep10SnapBack] = useState(false);

  const [showPurpleHighlight, setShowPurpleHighlight] = useState(false);

  const [dndPlacements, setDndPlacements] = useState({ x: null, y: null });

  const [dndSourceItems, setDndSourceItems] = useState([]);

  const [dndWrongItemId, setDndWrongItemId] = useState(null);

  const [dndWrongZone, setDndWrongZone] = useState(null);

  const [highlightTarget, setHighlightTarget] = useState(null);

  const [feedback, setFeedback] = useState(null);

  const [pointP, setPointP] = useState(null);

  const [pointPPrime, setPointPPrime] = useState(null);

  const [tempPoint, setTempPoint] = useState(null);

  const [pointAPrime, setPointAPrime] = useState(null);

  const [pointBPrime, setPointBPrime] = useState(null);

  const [wrongPoint6, setWrongPoint6] = useState(null);

  const [nudgePositions, setNudgePositions] = useState([]);

  const [step3RevealNudgeKey, setStep3RevealNudgeKey] = useState(0);

  const tempTimerRef = useRef(null);

  const step6TimerRef = useRef(null);

  const step7TimerRef = useRef(null);

  const step9TimerRef = useRef(null);

  const step10TimerRef = useRef(null);

  const resetDndState = useCallback(() => {
    setDndPlacements({ x: null, y: null });

    setDndSourceItems([...APP_DATA.dnd.options]);

    setDndWrongItemId(null);

    setDndWrongZone(null);
  }, []);

  const resetStep4State = useCallback(() => {
    if (tempTimerRef.current) clearTimeout(tempTimerRef.current);

    setStep4Phase("initial");

    setHighlightTarget(null);

    setFeedback(null);

    setPointP(null);

    setPointPPrime(null);

    setTempPoint(null);
  }, []);

  const resetStep6State = useCallback(() => {
    if (step6TimerRef.current) clearTimeout(step6TimerRef.current);
    if (tempTimerRef.current) clearTimeout(tempTimerRef.current);

    setStep6Phase("initial");

    setFeedback(null);

    setPointAPrime(null);

    setPointBPrime(null);

    setWrongPoint6(null);
  }, []);

  const resetStep7State = useCallback(() => {
    if (step7TimerRef.current) clearTimeout(step7TimerRef.current);

    setStep7Phase("initial");

    setStep7Clone(null);

    setFeedback(null);
  }, []);

  const resetStep9State = useCallback(() => {
    if (step9TimerRef.current) clearTimeout(step9TimerRef.current);

    setStep9Phase("initial");

    setStep9CurrentPoint("A");

    setStep9Placed([]);

    setStep9WrongPoint(null);

    setFeedback(null);
  }, []);

  const resetStep10State = useCallback(() => {
    if (step10TimerRef.current) clearTimeout(step10TimerRef.current);

    setStep10Phase("initial");

    setStep10Offset({ dx: 0, dy: 0 });

    setStep10FigureColor("#c9a0e8");

    setStep10SnapBack(false);

    setFeedback(null);
  }, []);

  const resetEverything = useCallback(() => {
    setCurrentStep(0);

    setStep2Phase("initial");

    setStep3Phase("initial");

    setStep3To4Transition(false);

    setStep3RevealNudgeKey(0);

    setShowPurpleHighlight(false);

    resetDndState();

    resetStep4State();

    resetStep6State();

    resetStep7State();

    resetStep9State();

    resetStep10State();
  }, [
    resetDndState,
    resetStep4State,
    resetStep6State,
    resetStep7State,
    resetStep9State,
    resetStep10State,
  ]);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");

    resetDndState();

    resetStep4State();

    resetStep6State();

    resetStep7State();

    resetStep9State();

    resetStep10State();

    setStep2Phase("initial");

    setStep3Phase("initial");

    setStep3To4Transition(false);

    setStep3RevealNudgeKey(0);

    setShowPurpleHighlight(false);

    setCurrentStep(1);
  };

  const handleStep2AnimComplete = useCallback(() => {
    setStep2Phase("dnd");

    setShowPurpleHighlight(true);
  }, []);

  const handleDndDragStart = useCallback(() => {}, []);

  const handleDndDrop = useCallback(
    (itemId, zoneId) => {
      if (dndWrongItemId || step2Phase !== "dnd") return;

      if (!dndSourceItems.includes(itemId)) return;

      if (dndPlacements[zoneId]) return;

      const correct = APP_DATA.dnd.correct;

      const isCorrect = correct[zoneId] === itemId;

      if (!isCorrect) {
        if (typeof playSound === "function") playSound("wrong");

        setDndWrongItemId(itemId);

        setDndWrongZone(zoneId);

        setTimeout(() => {
          setDndWrongItemId(null);

          setDndWrongZone(null);
        }, 550);

        return;
      }

      if (typeof playSound === "function") playSound("correct");

      const newPlacements = { ...dndPlacements, [zoneId]: itemId };

      setDndPlacements(newPlacements);

      setDndSourceItems((prev) => prev.filter((id) => id !== itemId));

      if (newPlacements.x && newPlacements.y) {
        setStep2Phase("done");
      }
    },

    [dndWrongItemId, dndSourceItems, dndPlacements, step2Phase],
  );

  const handleRevealComplete = useCallback((axis, xDone, yDone) => {
    if (xDone && yDone) {
      setStep3Phase("done");
    } else if (xDone) {
      setStep3RevealNudgeKey((k) => k + 1);
    }
  }, []);

  const handleRevealNudgeDismiss = useCallback(() => {
    setNudgePositions([]);
  }, []);

  const handleStep3To4Complete = useCallback(() => {
    setStep3To4Transition(false);
    resetStep4State();
    setCurrentStep(4);
  }, [resetStep4State]);

  useEffect(() => {
    if (currentStep !== 4) return undefined;

    setStep4Phase((phase) => (phase === "initial" ? "placeP" : phase));

    const t = setTimeout(() => {
      setHighlightTarget("p");
    }, 500);

    return () => clearTimeout(t);
  }, [currentStep]);

  useEffect(() => {
    if (currentStep !== 6) return undefined;

    setStep6Phase((phase) => (phase === "initial" ? "placeAPrime" : phase));

    return undefined;
  }, [currentStep]);

  useEffect(() => {
    if (currentStep !== 7) return undefined;

    setStep7Phase((phase) => (phase === "initial" ? "drag" : phase));

    return undefined;
  }, [currentStep]);

  useEffect(() => {
    if (currentStep !== 9) return undefined;

    setStep9Phase("intro");

    setStep9CurrentPoint("A");

    setStep9Placed([]);

    setStep9WrongPoint(null);

    setFeedback(null);

    const introTimer = setTimeout(() => {
      setStep9Phase("drag");
    }, 1000);

    return () => clearTimeout(introTimer);
  }, [currentStep]);

  useEffect(() => {
    if (currentStep !== 10) return undefined;

    setStep10Phase("drag");

    setStep10Offset({ dx: 0, dy: 0 });

    setStep10FigureColor("#c9a0e8");

    setStep10SnapBack(false);

    setFeedback(null);

    return undefined;
  }, [currentStep]);

  const handleSegmentDrop = useCallback(
    (m, n) => {
      if (currentStep !== 7 || step7Phase !== "drag") return;
      const s7 = APP_DATA.steps[7];
      const isCorrect = m.x === 2 && m.y === 2 && n.x === 5 && n.y === 4;

      if (isCorrect) {
        if (typeof playSound === "function") playSound("correct");
        setStep7Clone({
          m: m,
          n: n,
          color: "#5cb85c",
          mLabel: "M' (2,2)",
          nLabel: "N' (5,4)",
        });
        setFeedback({ type: "correct", text: s7.feedbackCorrectDone });
        setStep7Phase("done");
      } else {
        if (typeof playSound === "function") playSound("wrong");
        setStep7Clone({
          m: m,
          n: n,
          color: "#e74c3c",
          mLabel: "M' (" + m.x + "," + m.y + ")",
          nLabel: "N' (" + n.x + "," + n.y + ")",
          snapBackTo: {
            m: { x: 6, y: 5 },
            n: { x: 9, y: 7 },
          },
        });
        setFeedback({ type: "wrong", text: s7.feedbackWrong });
      }
    },
    [currentStep, step7Phase],
  );

  const handleSnapBackComplete = useCallback(() => {
    setStep7Clone(null);
    setFeedback(null);
  }, []);

  const handlePointDrop = useCallback(
    (pointId, x, y) => {
      if (currentStep !== 9 || step9Phase !== "drag") return;
      if (pointId !== step9CurrentPoint) return;
      const s9 = APP_DATA.steps[9];
      const target = STEP9_TARGETS[pointId];
      const isCorrect = x === target.x && y === target.y;
      const labelPlacement =
        pointId === "A" || pointId === "B" ? "above" : "below";

      if (isCorrect) {
        if (typeof playSound === "function") playSound("correct");
        const newPlaced = step9Placed.concat([
          {
            id: pointId,
            x: x,
            y: y,
            color: "#5cb85c",
            label: pointId + "' (" + x + "," + y + ")",
            labelPlacement: labelPlacement,
          },
        ]);
        setStep9Placed(newPlaced);
        const orderIdx = STEP9_DRAG_ORDER.indexOf(pointId);
        const isLast = orderIdx === STEP9_DRAG_ORDER.length - 1;
        if (isLast) {
          setFeedback({ type: "correct", text: s9.feedbackCorrectDone });
          setStep9Phase("done");
        } else {
          setStep9CurrentPoint(STEP9_DRAG_ORDER[orderIdx + 1]);
        }
      } else {
        if (typeof playSound === "function") playSound("wrong");
        setStep9WrongPoint({
          id: pointId,
          x: x,
          y: y,
          label: "(" + x + "," + y + ")",
          labelPlacement: labelPlacement,
          snapBackTo: {
            x: STEP9_ORIGINAL[pointId].x,
            y: STEP9_ORIGINAL[pointId].y,
          },
        });
        setFeedback({ type: "wrong", text: s9.feedbackWrong });
      }
    },
    [currentStep, step9Phase, step9CurrentPoint, step9Placed],
  );

  const handleStep9SnapBackComplete = useCallback(() => {
    setStep9WrongPoint(null);
    setFeedback(null);
  }, []);

  const handleFigureDragMove = useCallback(
    (dx, dy) => {
      if (currentStep !== 10 || step10Phase !== "drag") return;
      setStep10Offset({ dx: dx, dy: dy });
    },
    [currentStep, step10Phase],
  );

  const handleFigureDrop = useCallback(
    (dx, dy) => {
      if (currentStep !== 10 || step10Phase !== "drag") return;
      const s10 = APP_DATA.steps[10];
      const isCorrect =
        dx === STEP10_CORRECT_OFFSET.dx && dy === STEP10_CORRECT_OFFSET.dy;

      setStep10Offset({ dx: dx, dy: dy });

      if (isCorrect) {
        if (typeof playSound === "function") playSound("correct");
        setStep10FigureColor("#5cb85c");
        setFeedback({ type: "correct", text: s10.feedbackCorrect });
        setStep10Phase("done");
      } else {
        if (typeof playSound === "function") playSound("wrong");
        setStep10FigureColor("#e74c3c");
        setStep10SnapBack(true);
        setFeedback({ type: "wrong", text: s10.feedbackWrong });
      }
    },
    [currentStep, step10Phase],
  );

  const handleStep10SnapBackComplete = useCallback(() => {
    setStep10Offset({ dx: 0, dy: 0 });
    setStep10FigureColor("#c9a0e8");
    setStep10SnapBack(false);
    setFeedback(null);
  }, []);

  const handleGridClick = useCallback(
    (x, y) => {
      if (currentStep === 4) {
        const s4 = APP_DATA.steps[4];

        if (step4Phase === "placeP") {
          if (x === 2 && y === 1) {
            if (typeof playSound === "function") playSound("correct");

            setTempPoint(null);
            setPointP({ x: x, y: y });

            setFeedback({ type: "correct", text: s4.feedbackCorrectP });

            setHighlightTarget("pPrime");

            setStep4Phase("placePPrime");
          } else {
            if (typeof playSound === "function") playSound("wrong");

            setTempPoint({
              id: "temp-" + Date.now(),
              x: x,
              y: y,
              color: "#e74c3c",
              label: "(" + x + "," + y + ")",
              blink: true,
            });

            setFeedback({ type: "wrong", text: s4.feedbackWrong });
          }

          return;
        }

        if (step4Phase === "placePPrime") {
          if (x === 8 && y === 3) {
            if (typeof playSound === "function") playSound("correct");

            setTempPoint(null);
            setPointPPrime({ x: x, y: y });

            setFeedback({ type: "correct", text: s4.feedbackCorrectPPrime });

            setHighlightTarget(null);

            setStep4Phase("done");
          } else {
            if (typeof playSound === "function") playSound("wrong");

            setTempPoint({
              id: "temp-" + Date.now(),
              x: x,
              y: y,
              color: "#e74c3c",
              label: "(" + x + "," + y + ")",
              blink: true,
            });

            setFeedback({ type: "wrong", text: s4.feedbackWrong });
          }
        }

        return;
      }

      if (currentStep !== 6) return;

      const s6 = APP_DATA.steps[6];

      if (step6Phase === "placeAPrime") {
        if (x === 5 && y === 1) {
          if (typeof playSound === "function") playSound("correct");

          setPointAPrime({ x: x, y: y });

          setWrongPoint6(null);

          setFeedback({ type: "correct", text: s6.feedbackCorrectA });

          step6TimerRef.current = setTimeout(() => {
            setFeedback(null);

            setStep6Phase("placeBPrime");

            step6TimerRef.current = null;
          }, 1000);
        } else {
          if (typeof playSound === "function") playSound("wrong");
          setWrongPoint6({
            id: "wrong-6-" + Date.now(),
            x: x,
            y: y,
            color: "#e74c3c",
            label: "(" + x + "," + y + ")",
            blink: true,
          });

          setFeedback({ type: "wrong", text: s6.feedbackWrong });
        }

        return;
      }

      if (step6Phase === "placeBPrime") {
        if (x === 9 && y === 2) {
          if (typeof playSound === "function") playSound("correct");

          setPointBPrime({ x: x, y: y });

          setWrongPoint6(null);

          setFeedback({ type: "correct", text: s6.feedbackCorrectDone });

          setStep6Phase("done");
        } else {
          if (typeof playSound === "function") playSound("wrong");
          setWrongPoint6({
            id: "wrong-6-" + Date.now(),
            x: x,
            y: y,
            color: "#e74c3c",
            label: "(" + x + "," + y + ")",
            blink: true,
          });

          setFeedback({ type: "wrong", text: s6.feedbackWrong });
        }
      }
    },

    [currentStep, step4Phase, step6Phase],
  );

  const graphPoints = useMemo(() => {
    if (currentStep === 4) {
      const s4 = APP_DATA.steps[4];

      const pts = [];

      if (pointP) {
        pts.push({
          id: "point-p",

          x: pointP.x,

          y: pointP.y,

          color: "#64c7ff",

          label: s4.pointPLabel,
        });
      }

      if (pointPPrime) {
        pts.push({
          id: "point-pprime",

          x: pointPPrime.x,

          y: pointPPrime.y,

          color: "#eb984e",

          label: s4.pointPPrimeLabel,
        });
      }

      if (tempPoint) {
        pts.push(tempPoint);
      }

      return pts;
    }

    if (currentStep === 6) {
      const s6 = APP_DATA.steps[6];

      const yellow = "#f4d03f";

      const green = "#5cb85c";

      const pts = [
        {
          id: "point-a",

          x: 2,

          y: 2,

          color: yellow,

          label: s6.pointALabel,
        },

        {
          id: "point-b",

          x: 6,

          y: 3,

          color: yellow,

          label: s6.pointBLabel,
        },
      ];

      if (pointAPrime) {
        pts.push({
          id: "point-aprime",

          x: pointAPrime.x,

          y: pointAPrime.y,

          color: green,

          label: "(" + pointAPrime.x + "," + pointAPrime.y + ")",

          opacity: 0.85,
        });
      }

      if (pointBPrime) {
        pts.push({
          id: "point-bprime",

          x: pointBPrime.x,

          y: pointBPrime.y,

          color: green,

          label: "(" + pointBPrime.x + "," + pointBPrime.y + ")",

          opacity: 0.85,
        });
      }

      if (wrongPoint6) {
        pts.push(wrongPoint6);
      }

      return pts;
    }

    if (currentStep === 7) {
      const s7 = APP_DATA.steps[7];

      const purple = "#c9a0e8";

      return [
        {
          id: "point-m",

          x: 6,

          y: 5,

          color: purple,

          label: s7.pointMLabel,
        },

        {
          id: "point-n",

          x: 9,

          y: 7,

          color: purple,

          label: s7.pointNLabel,
        },
      ];
    }

    return [];
  }, [
    currentStep,

    pointP,

    pointPPrime,

    tempPoint,

    pointAPrime,

    pointBPrime,

    wrongPoint6,
  ]);

  const graphSegments = useMemo(() => {
    if (currentStep === 6) {
      const segments = [
        {
          from: { x: 2, y: 2 },

          to: { x: 6, y: 3 },

          color: "#f4d03f",
        },
      ];

      if (pointAPrime && pointBPrime) {
        segments.push({
          from: { x: pointAPrime.x, y: pointAPrime.y },

          to: { x: pointBPrime.x, y: pointBPrime.y },

          color: "#5cb85c",

          opacity: 0.85,
        });
      }

      return segments;
    }

    if (currentStep === 7) {
      return [
        {
          from: { x: 6, y: 5 },

          to: { x: 9, y: 7 },

          color: "#c9a0e8",
        },
      ];
    }

    return [];
  }, [currentStep, pointAPrime, pointBPrime]);

  const draggableSegment = useMemo(() => {
    if (currentStep !== 7) return null;

    return {
      m: { x: 6, y: 5 },

      n: { x: 9, y: 7 },

      delta: { x: 3, y: 2 },
    };
  }, [currentStep]);

  const segmentDragEnabled =
    currentStep === 7 && step7Phase === "drag" && !step7Clone;

  const placedClone = currentStep === 7 ? step7Clone : null;

  const step9VertexLabels = useMemo(() => {
    if (currentStep !== 9) return {};

    const s9 = APP_DATA.steps[9];

    return {
      A: s9.pointALabel,

      B: s9.pointBLabel,

      C: s9.pointCLabel,

      D: s9.pointDLabel,
    };
  }, [currentStep]);

  const nudgeTarget = useMemo(() => {
    if (currentStep === 4) {
      if (step4Phase === "placeP" && !pointP) return { x: 2, y: 1 };

      if (step4Phase === "placePPrime" && !pointPPrime) return { x: 8, y: 3 };
    }

    if (currentStep === 6) {
      if (step6Phase === "placeAPrime" && !pointAPrime) return { x: 5, y: 1 };

      if (step6Phase === "placeBPrime" && !pointBPrime) return { x: 9, y: 2 };
    }

    return null;
  }, [
    currentStep,
    step4Phase,
    step6Phase,
    pointP,
    pointPPrime,
    pointAPrime,
    pointBPrime,
  ]);

  const locateTitle = useMemo(() => {
    const s4 = APP_DATA.steps[4];

    if (step4Phase === "placePPrime" || step4Phase === "done") {
      return s4.titlePlacePPrime;
    }

    return s4.titlePlaceP;
  }, [step4Phase]);

  const questionHtml = useMemo(() => {
    if (currentStep === 5) return APP_DATA.steps[5].questionText;

    if (currentStep === 6) return APP_DATA.steps[6].questionText;

    if (currentStep === 7) return APP_DATA.steps[7].questionText;

    if (currentStep === 8) return APP_DATA.steps[8].questionText;

    if (currentStep === 9) return APP_DATA.steps[9].questionText;

    if (currentStep === 10) return APP_DATA.steps[10].questionText;

    if (currentStep >= 1 && currentStep <= 4) {
      return showPurpleHighlight && currentStep === 2
        ? APP_DATA.question.text
        : APP_DATA.question.textPlain;
    }

    return "";
  }, [currentStep, showPurpleHighlight]);

  const splashText = useMemo(() => {
    if (currentStep === 5) return APP_DATA.steps[5].splashText;

    if (currentStep === 8) return APP_DATA.steps[8].splashText;

    return "";
  }, [currentStep]);

  const navText = useMemo(() => {
    if (currentStep === 1) return APP_DATA.steps[1].navText;

    if (currentStep === 2) {
      if (step2Phase === "initial") return "";

      return step2Phase === "done"
        ? APP_DATA.steps[2].navTextDone
        : APP_DATA.steps[2].navTextDrag;
    }

    if (currentStep === 3) {
      return step3Phase === "done"
        ? APP_DATA.steps[3].navTextDone
        : APP_DATA.steps[3].navText;
    }

    if (currentStep === 4) {
      return step4Phase === "done"
        ? APP_DATA.steps[4].navTextDone
        : APP_DATA.steps[4].navText;
    }

    if (currentStep === 5) return APP_DATA.steps[5].navText;

    if (currentStep === 6) {
      if (step6Phase === "done") return APP_DATA.steps[6].navTextDone;

      if (step6Phase === "placeBPrime") return APP_DATA.steps[6].navTextPlaceB;

      return APP_DATA.steps[6].navTextPlaceA;
    }

    if (currentStep === 7) {
      return step7Phase === "done"
        ? APP_DATA.steps[7].navTextDone
        : APP_DATA.steps[7].navText;
    }

    if (currentStep === 8) return APP_DATA.steps[8].navText;

    if (currentStep === 9) {
      if (step9Phase === "done") return APP_DATA.steps[9].navTextDone;

      if (step9Phase === "intro") return "";

      const s9 = APP_DATA.steps[9];

      if (step9CurrentPoint === "B") return s9.navTextDragB;

      if (step9CurrentPoint === "C") return s9.navTextDragC;

      if (step9CurrentPoint === "D") return s9.navTextDragD;

      return s9.navTextDragA;
    }

    if (currentStep === 10) {
      return step10Phase === "done"
        ? APP_DATA.steps[10].navTextDone
        : APP_DATA.steps[10].navText;
    }

    return "";
  }, [
    currentStep,
    step2Phase,
    step3Phase,
    step3To4Transition,
    step4Phase,
    step6Phase,
    step7Phase,
    step9Phase,
    step9CurrentPoint,
    step10Phase,
  ]);

  const navTextHidden =
    (currentStep === 2 && step2Phase === "initial") ||
    (currentStep === 9 && step9Phase === "intro");

  const isNextDisabled =
    (currentStep === 2 && step2Phase !== "done") ||
    (currentStep === 3 && (step3Phase !== "done" || step3To4Transition)) ||
    (currentStep === 4 && step4Phase !== "done") ||
    (currentStep === 6 && step6Phase !== "done") ||
    (currentStep === 7 && step7Phase !== "done") ||
    (currentStep === 9 && step9Phase !== "done") ||
    (currentStep === 10 && step10Phase !== "done");

  const isPrevDisabled = currentStep <= 1;

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");

    setNudgePositions([]);

    if (isNextDisabled) return;

    if (currentStep === 1) {
      resetDndState();

      setStep2Phase("initial");

      setShowPurpleHighlight(false);

      setCurrentStep(2);
    } else if (currentStep === 2) {
      setStep3Phase("initial");
      setStep3To4Transition(false);
      setShowPurpleHighlight(false);
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setStep3To4Transition(true);
    } else if (currentStep === 4) {
      setCurrentStep(5);
    } else if (currentStep === 5) {
      resetStep6State();

      setCurrentStep(6);
    } else if (currentStep === 6) {
      resetStep7State();

      setCurrentStep(7);
    } else if (currentStep === 7) {
      setCurrentStep(8);
    } else if (currentStep === 8) {
      resetStep9State();

      setCurrentStep(9);
    } else if (currentStep === 9) {
      resetStep10State();

      setCurrentStep(10);
    } else if (currentStep === 10) {
      setCurrentStep(11);
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");

    if (currentStep === 11) {
      setStep10Phase("done");

      setStep10Offset({ dx: -4, dy: 2 });

      setStep10FigureColor("#5cb85c");

      setFeedback({
        type: "correct",

        text: APP_DATA.steps[10].feedbackCorrect,
      });

      setCurrentStep(10);

      return;
    }

    if (currentStep === 10) {
      resetStep10State();

      setStep9Phase("done");

      setStep9Placed([
        {
          id: "A",

          x: 7,

          y: 4,

          color: "#5cb85c",

          label: "A' (7,4)",

          labelPlacement: "above",
        },

        {
          id: "B",

          x: 11,

          y: 4,

          color: "#5cb85c",

          label: "B' (11,4)",

          labelPlacement: "above",
        },

        {
          id: "C",

          x: 11,

          y: 2,

          color: "#5cb85c",

          label: "C' (11,2)",

          labelPlacement: "below",
        },

        {
          id: "D",

          x: 7,

          y: 2,

          color: "#5cb85c",

          label: "D' (7,2)",

          labelPlacement: "below",
        },
      ]);

      setFeedback({
        type: "correct",

        text: APP_DATA.steps[9].feedbackCorrectDone,
      });

      setCurrentStep(9);

      return;
    }

    if (currentStep === 9) {
      resetStep9State();

      setCurrentStep(8);

      return;
    }

    if (currentStep === 8) {
      setStep7Phase("done");

      setStep7Clone({
        m: { x: 2, y: 2 },

        n: { x: 5, y: 4 },

        color: "#5cb85c",

        mLabel: "M' (2,2)",

        nLabel: "N' (5,4)",
      });

      setFeedback({
        type: "correct",

        text: APP_DATA.steps[7].feedbackCorrectDone,
      });

      setCurrentStep(7);

      return;
    }

    if (currentStep === 7) {
      resetStep7State();

      setStep6Phase("done");

      setPointAPrime({ x: 5, y: 1 });

      setPointBPrime({ x: 9, y: 2 });

      setFeedback({
        type: "correct",

        text: APP_DATA.steps[6].feedbackCorrectDone,
      });

      setCurrentStep(6);

      return;
    }

    if (currentStep === 6) {
      resetStep6State();

      setCurrentStep(5);

      return;
    }

    if (currentStep === 5) {
      resetStep4State();

      setStep3Phase("done");

      setShowPurpleHighlight(false);

      setCurrentStep(4);

      setStep4Phase("done");

      setPointP({ x: 2, y: 1 });

      setPointPPrime({ x: 8, y: 3 });

      setFeedback({
        type: "correct",

        text: APP_DATA.steps[4].feedbackCorrectPPrime,
      });

      return;
    }

    if (currentStep === 4) {
      resetStep4State();
      setStep3Phase("done");
      setStep3To4Transition(false);
      setShowPurpleHighlight(false);
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      setStep3Phase("initial");
      setStep3To4Transition(false);
      setShowPurpleHighlight(false);

      setCurrentStep(2);

      setStep2Phase("done");

      const correct = APP_DATA.dnd.correct;

      setDndPlacements({ x: correct.x, y: correct.y });

      setDndSourceItems(
        APP_DATA.dnd.options.filter(
          (id) => id !== correct.x && id !== correct.y,
        ),
      );

      return;
    }

    if (currentStep === 2) {
      setCurrentStep(1);

      setStep2Phase("initial");

      setShowPurpleHighlight(false);

      resetDndState();

      return;
    }

    if (currentStep === 1) {
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
      } else if (
        currentStep === 3 &&
        step3Phase !== "done" &&
        !step3To4Transition
      ) {
        const xBtn = document.getElementById("reveal-x-btn");
        const yBtn = document.getElementById("reveal-y-btn");
        if (xBtn) {
          positions.push(xBtn.getBoundingClientRect());
        } else if (yBtn) {
          positions.push(yBtn.getBoundingClientRect());
        }
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
  }, [
    currentStep,
    isNextDisabled,
    step2Phase,
    step3Phase,
    step3To4Transition,
    step3RevealNudgeKey,
    step4Phase,
    step6Phase,
    step7Phase,
    step9Phase,
    step10Phase,
  ]);

  useEffect(() => {
    return () => {
      if (tempTimerRef.current) clearTimeout(tempTimerRef.current);

      if (step6TimerRef.current) clearTimeout(step6TimerRef.current);

      if (step7TimerRef.current) clearTimeout(step7TimerRef.current);

      if (step9TimerRef.current) clearTimeout(step9TimerRef.current);

      if (step10TimerRef.current) clearTimeout(step10TimerRef.current);
    };
  }, []);

  const renderNudges = () =>
    nudgePositions.map((position, index) =>
      React.createElement(Nudge, {
        key: index,

        show: true,

        position: position,
      }),
    );

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

  return React.createElement(
    "div",

    { className: "applet-container" },

    React.createElement(QuestionPanel, {
      html: questionHtml,

      showPurpleHighlight: showPurpleHighlight && currentStep === 2,
    }),

    React.createElement(
      "div",

      { className: "app-main-content" },

      React.createElement(MainCanvas, {
        step: currentStep,

        step2Phase: step2Phase,

        step3Phase: step3Phase,

        step3To4Transition: step3To4Transition,

        step4Phase: step4Phase,

        step6Phase: step6Phase,

        step7Phase: step7Phase,

        dndPlacements: dndPlacements,

        dndSourceItems: dndSourceItems,

        dndWrongItemId: dndWrongItemId,

        dndWrongZone: dndWrongZone,

        onDndDrop: handleDndDrop,

        onDndDragStart: handleDndDragStart,

        onStep2AnimComplete: handleStep2AnimComplete,

        onRevealComplete: handleRevealComplete,

        onRevealNudgeDismiss: handleRevealNudgeDismiss,

        onStep3To4Complete: handleStep3To4Complete,

        graphPoints: graphPoints,

        graphSegments: graphSegments,

        onGridClick: handleGridClick,

        locateTitle: locateTitle,

        highlightTarget: highlightTarget,

        feedback: feedback,

        splashText: splashText,

        nudgeTarget: nudgeTarget,

        draggableSegment: draggableSegment,

        onSegmentDrop: handleSegmentDrop,

        segmentDragEnabled: segmentDragEnabled,

        placedClone: placedClone,

        onSnapBackComplete: handleSnapBackComplete,

        step9Phase: step9Phase,

        step9CurrentPoint: step9CurrentPoint,

        step9Placed: step9Placed,

        step9WrongPoint: step9WrongPoint,

        step9VertexLabels: step9VertexLabels,

        onPointDrop: handlePointDrop,

        onStep9SnapBackComplete: handleStep9SnapBackComplete,

        step10Phase: step10Phase,

        step10Offset: step10Offset,

        step10SnapBack: step10SnapBack,

        step10FigureColor: step10FigureColor,

        step10Vertices: STEP10_VERTICES,

        onFigureDragMove: handleFigureDragMove,

        onFigureDrop: handleFigureDrop,

        onStep10SnapBackComplete: handleStep10SnapBackComplete,
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
