const STEP5_ORIGINAL = {
  A: { x: 2, y: 6 },
  B: { x: 6, y: 6 },
  C: { x: 6, y: 4 },
  D: { x: 2, y: 4 },
};

const STEP5_TARGETS = {
  A: { x: 7, y: 4 },
  B: { x: 11, y: 4 },
  C: { x: 11, y: 2 },
  D: { x: 7, y: 2 },
};

const STEP5_DRAG_ORDER = ["A", "B", "C", "D"];

const STEP6_VERTICES = [
  { x: 9, y: 5, labelPlacement: "above" },
  { x: 7, y: 2, labelPlacement: "below" },
  { x: 11, y: 2, labelPlacement: "below" },
];

const STEP6_CORRECT_OFFSET = { dx: -4, dy: 2 };

const LINE_SEGMENT_M = { x: 6, y: 5 };
const LINE_SEGMENT_N = { x: 9, y: 7 };
const LINE_SEGMENT_CORRECT_M = { x: 4, y: 2 };
const LINE_SEGMENT_CORRECT_N = { x: 7, y: 4 };

const App = () => {
  const { useState, useMemo, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);

  const [step2Phase, setStep2Phase] = useState("initial");
  const [step3Phase, setStep3Phase] = useState("initial");

  const [step4LinePhase, setStep4LinePhase] = useState("initial");
  const [step4LineClone, setStep4LineClone] = useState(null);

  const [step5Phase, setStep5Phase] = useState("initial");
  const [step5CurrentPoint, setStep5CurrentPoint] = useState("A");
  const [step5Placed, setStep5Placed] = useState([]);
  const [step5WrongPoint, setStep5WrongPoint] = useState(null);

  const [step6Phase, setStep6Phase] = useState("initial");
  const [step6Offset, setStep6Offset] = useState({ dx: 0, dy: 0 });
  const [step6FigureColor, setStep6FigureColor] = useState("#c9a0e8");
  const [step6SnapBack, setStep6SnapBack] = useState(false);

  const [showPurpleHighlight, setShowPurpleHighlight] = useState(false);

  const [dndPlacements, setDndPlacements] = useState({ x: null, y: null });
  const [dndSourceItems, setDndSourceItems] = useState([]);
  const [dndWrongItemId, setDndWrongItemId] = useState(null);
  const [dndWrongZone, setDndWrongZone] = useState(null);

  const [feedback, setFeedback] = useState(null);

  const [nudgePositions, setNudgePositions] = useState([]);
  const [step3RevealNudgeKey, setStep3RevealNudgeKey] = useState(0);

  const step4TimerRef = useRef(null);
  const step5TimerRef = useRef(null);
  const step6TimerRef = useRef(null);

  const resetDndState = useCallback(() => {
    setDndPlacements({ x: null, y: null });
    setDndSourceItems([...APP_DATA.dnd.options]);
    setDndWrongItemId(null);
    setDndWrongZone(null);
  }, []);

  const resetStep4LineState = useCallback(() => {
    if (step4TimerRef.current) clearTimeout(step4TimerRef.current);
    setStep4LinePhase("initial");
    setStep4LineClone(null);
    setFeedback(null);
  }, []);

  const resetStep5State = useCallback(() => {
    if (step5TimerRef.current) clearTimeout(step5TimerRef.current);
    setStep5Phase("initial");
    setStep5CurrentPoint("A");
    setStep5Placed([]);
    setStep5WrongPoint(null);
    setFeedback(null);
  }, []);

  const resetStep6State = useCallback(() => {
    if (step6TimerRef.current) clearTimeout(step6TimerRef.current);
    setStep6Phase("initial");
    setStep6Offset({ dx: 0, dy: 0 });
    setStep6FigureColor("#c9a0e8");
    setStep6SnapBack(false);
    setFeedback(null);
  }, []);

  const resetEverything = useCallback(() => {
    setCurrentStep(0);
    setStep2Phase("initial");
    setStep3Phase("initial");
    setStep3RevealNudgeKey(0);
    setShowPurpleHighlight(false);
    resetDndState();
    resetStep4LineState();
    resetStep5State();
    resetStep6State();
  }, [
    resetDndState,
    resetStep4LineState,
    resetStep5State,
    resetStep6State,
  ]);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    resetDndState();
    resetStep4LineState();
    resetStep5State();
    resetStep6State();
    setStep2Phase("initial");
    setStep3Phase("initial");
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

  useEffect(() => {
    if (currentStep !== 4) return undefined;
    setStep4LinePhase((phase) => (phase === "initial" ? "drag" : phase));
    return undefined;
  }, [currentStep]);

  useEffect(() => {
    if (currentStep !== 5) return undefined;
    setStep5Phase("intro");
    setStep5CurrentPoint("A");
    setStep5Placed([]);
    setStep5WrongPoint(null);
    setFeedback(null);

    const introTimer = setTimeout(() => {
      setStep5Phase("drag");
    }, 1000);

    return () => clearTimeout(introTimer);
  }, [currentStep]);

  useEffect(() => {
    if (currentStep !== 6) return undefined;
    setStep6Phase("drag");
    setStep6Offset({ dx: 0, dy: 0 });
    setStep6FigureColor("#c9a0e8");
    setStep6SnapBack(false);
    setFeedback(null);
    return undefined;
  }, [currentStep]);

  const handleSegmentDrop = useCallback(
    (m, n) => {
      if (currentStep !== 4 || step4LinePhase !== "drag") return;
      const s4 = APP_DATA.steps[4];
      const isCorrect =
        m.x === LINE_SEGMENT_CORRECT_M.x &&
        m.y === LINE_SEGMENT_CORRECT_M.y &&
        n.x === LINE_SEGMENT_CORRECT_N.x &&
        n.y === LINE_SEGMENT_CORRECT_N.y;

      if (isCorrect) {
        if (typeof playSound === "function") playSound("correct");
        setStep4LineClone({
          m: m,
          n: n,
          color: "#5cb85c",
          mLabel: "M (" + m.x + "," + m.y + ")",
          nLabel: "N (" + n.x + "," + n.y + ")",
        });
        setFeedback({ type: "correct", text: s4.feedbackCorrectDone });
        setStep4LinePhase("done");
      } else {
        if (typeof playSound === "function") playSound("wrong");
        setStep4LineClone({
          m: m,
          n: n,
          color: "#e74c3c",
          mLabel: "M' (" + m.x + "," + m.y + ")",
          nLabel: "N' (" + n.x + "," + n.y + ")",
          snapBackTo: {
            m: { ...LINE_SEGMENT_M },
            n: { ...LINE_SEGMENT_N },
          },
        });
        setFeedback({ type: "wrong", text: s4.feedbackWrong });
      }
    },
    [currentStep, step4LinePhase],
  );

  const handleSnapBackComplete = useCallback(() => {
    setStep4LineClone(null);
    setFeedback(null);
  }, []);

  const handlePointDrop = useCallback(
    (pointId, x, y) => {
      if (currentStep !== 5 || step5Phase !== "drag") return;
      if (pointId !== step5CurrentPoint) return;
      const s5 = APP_DATA.steps[5];
      const target = STEP5_TARGETS[pointId];
      const isCorrect = x === target.x && y === target.y;
      const labelPlacement =
        pointId === "A" || pointId === "B" ? "above" : "below";

      if (isCorrect) {
        if (typeof playSound === "function") playSound("correct");
        const newPlaced = step5Placed.concat([
          {
            id: pointId,
            x: x,
            y: y,
            color: "#5cb85c",
            label: pointId + " (" + x + "," + y + ")",
            labelPlacement: labelPlacement,
          },
        ]);
        setStep5Placed(newPlaced);
        const orderIdx = STEP5_DRAG_ORDER.indexOf(pointId);
        const isLast = orderIdx === STEP5_DRAG_ORDER.length - 1;
        if (isLast) {
          setFeedback({ type: "correct", text: s5.feedbackCorrectDone });
          setStep5Phase("done");
        } else {
          setStep5CurrentPoint(STEP5_DRAG_ORDER[orderIdx + 1]);
        }
      } else {
        if (typeof playSound === "function") playSound("wrong");
        setStep5WrongPoint({
          id: pointId,
          x: x,
          y: y,
          label: "(" + x + "," + y + ")",
          labelPlacement: labelPlacement,
          snapBackTo: {
            x: STEP5_ORIGINAL[pointId].x,
            y: STEP5_ORIGINAL[pointId].y,
          },
        });
        setFeedback({ type: "wrong", text: s5.feedbackWrong });
      }
    },
    [currentStep, step5Phase, step5CurrentPoint, step5Placed],
  );

  const handleStep5SnapBackComplete = useCallback(() => {
    setStep5WrongPoint(null);
    setFeedback(null);
  }, []);

  const handleFigureDragMove = useCallback(
    (dx, dy) => {
      if (currentStep !== 6 || step6Phase !== "drag") return;
      setStep6Offset({ dx: dx, dy: dy });
    },
    [currentStep, step6Phase],
  );

  const handleFigureDrop = useCallback(
    (dx, dy) => {
      if (currentStep !== 6 || step6Phase !== "drag") return;
      const s6 = APP_DATA.steps[6];
      const isCorrect =
        dx === STEP6_CORRECT_OFFSET.dx && dy === STEP6_CORRECT_OFFSET.dy;

      setStep6Offset({ dx: dx, dy: dy });

      if (isCorrect) {
        if (typeof playSound === "function") playSound("correct");
        setStep6FigureColor("#5cb85c");
        setFeedback({ type: "correct", text: s6.feedbackCorrect });
        setStep6Phase("done");
      } else {
        if (typeof playSound === "function") playSound("wrong");
        setStep6FigureColor("#e74c3c");
        setStep6SnapBack(true);
        setFeedback({ type: "wrong", text: s6.feedbackWrong });
      }
    },
    [currentStep, step6Phase],
  );

  const handleStep6SnapBackComplete = useCallback(() => {
    setStep6Offset({ dx: 0, dy: 0 });
    setStep6FigureColor("#c9a0e8");
    setStep6SnapBack(false);
    setFeedback(null);
  }, []);

  const graphPoints = useMemo(() => {
    if (currentStep !== 4) return [];

    const s4 = APP_DATA.steps[4];
    const purple = "#c9a0e8";

    return [
      {
        id: "point-mprime",
        x: LINE_SEGMENT_M.x,
        y: LINE_SEGMENT_M.y,
        color: purple,
        label: s4.pointMPrimeLabel,
      },
      {
        id: "point-nprime",
        x: LINE_SEGMENT_N.x,
        y: LINE_SEGMENT_N.y,
        color: purple,
        label: s4.pointNPrimeLabel,
      },
    ];
  }, [currentStep]);

  const graphSegments = useMemo(() => {
    if (currentStep !== 4) return [];

    return [
      {
        from: { ...LINE_SEGMENT_M },
        to: { ...LINE_SEGMENT_N },
        color: "#c9a0e8",
      },
    ];
  }, [currentStep]);

  const draggableSegment = useMemo(() => {
    if (currentStep !== 4) return null;

    return {
      m: { ...LINE_SEGMENT_M },
      n: { ...LINE_SEGMENT_N },
      delta: {
        x: LINE_SEGMENT_N.x - LINE_SEGMENT_M.x,
        y: LINE_SEGMENT_N.y - LINE_SEGMENT_M.y,
      },
    };
  }, [currentStep]);

  const segmentDragEnabled =
    currentStep === 4 && step4LinePhase === "drag" && !step4LineClone;

  const placedClone = currentStep === 4 ? step4LineClone : null;

  const step5VertexLabels = useMemo(() => {
    if (currentStep !== 5) return {};

    const s5 = APP_DATA.steps[5];
    return {
      A: s5.pointALabel,
      B: s5.pointBLabel,
      C: s5.pointCLabel,
      D: s5.pointDLabel,
    };
  }, [currentStep]);

  const questionHtml = useMemo(() => {
    if (currentStep === 4) return APP_DATA.steps[4].questionText;
    if (currentStep === 5) return APP_DATA.steps[5].questionText;
    if (currentStep === 6) return APP_DATA.steps[6].questionText;

    if (currentStep >= 1 && currentStep <= 3) {
      return showPurpleHighlight && currentStep === 2
        ? APP_DATA.question.text
        : APP_DATA.question.textPlain;
    }

    return "";
  }, [currentStep, showPurpleHighlight]);

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
      return step4LinePhase === "done"
        ? APP_DATA.steps[4].navTextDone
        : APP_DATA.steps[4].navText;
    }

    if (currentStep === 5) {
      if (step5Phase === "done") return APP_DATA.steps[5].navTextDone;
      if (step5Phase === "intro") return "";

      const s5 = APP_DATA.steps[5];
      if (step5CurrentPoint === "B") return s5.navTextDragB;
      if (step5CurrentPoint === "C") return s5.navTextDragC;
      if (step5CurrentPoint === "D") return s5.navTextDragD;
      return s5.navTextDragA;
    }

    if (currentStep === 6) {
      return step6Phase === "done"
        ? APP_DATA.steps[6].navTextDone
        : APP_DATA.steps[6].navText;
    }

    return "";
  }, [
    currentStep,
    step2Phase,
    step3Phase,
    step4LinePhase,
    step5Phase,
    step5CurrentPoint,
    step6Phase,
  ]);

  const navTextHidden =
    (currentStep === 2 && step2Phase === "initial") ||
    (currentStep === 5 && step5Phase === "intro");

  const isNextDisabled =
    (currentStep === 2 && step2Phase !== "done") ||
    (currentStep === 3 && step3Phase !== "done") ||
    (currentStep === 4 && step4LinePhase !== "done") ||
    (currentStep === 5 && step5Phase !== "done") ||
    (currentStep === 6 && step6Phase !== "done");

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
      setShowPurpleHighlight(false);
      setCurrentStep(3);
    } else if (currentStep === 3) {
      resetStep4LineState();
      setCurrentStep(4);
    } else if (currentStep === 4) {
      resetStep5State();
      setCurrentStep(5);
    } else if (currentStep === 5) {
      resetStep6State();
      setCurrentStep(6);
    } else if (currentStep === 6) {
      setCurrentStep(7);
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");

    if (currentStep === 7) {
      setStep6Phase("done");
      setStep6Offset({ ...STEP6_CORRECT_OFFSET });
      setStep6FigureColor("#5cb85c");
      setFeedback({
        type: "correct",
        text: APP_DATA.steps[6].feedbackCorrect,
      });
      setCurrentStep(6);
      return;
    }

    if (currentStep === 6) {
      resetStep6State();
      setStep5Phase("done");
      setStep5Placed([
        {
          id: "A",
          x: 7,
          y: 4,
          color: "#5cb85c",
          label: "A (7,4)",
          labelPlacement: "above",
        },
        {
          id: "B",
          x: 11,
          y: 4,
          color: "#5cb85c",
          label: "B (11,4)",
          labelPlacement: "above",
        },
        {
          id: "C",
          x: 11,
          y: 2,
          color: "#5cb85c",
          label: "C (11,2)",
          labelPlacement: "below",
        },
        {
          id: "D",
          x: 7,
          y: 2,
          color: "#5cb85c",
          label: "D (7,2)",
          labelPlacement: "below",
        },
      ]);
      setFeedback({
        type: "correct",
        text: APP_DATA.steps[5].feedbackCorrectDone,
      });
      setCurrentStep(5);
      return;
    }

    if (currentStep === 5) {
      resetStep5State();
      setStep4LinePhase("done");
      setStep4LineClone({
        m: { ...LINE_SEGMENT_CORRECT_M },
        n: { ...LINE_SEGMENT_CORRECT_N },
        color: "#5cb85c",
        mLabel:
          "M (" +
          LINE_SEGMENT_CORRECT_M.x +
          "," +
          LINE_SEGMENT_CORRECT_M.y +
          ")",
        nLabel:
          "N (" +
          LINE_SEGMENT_CORRECT_N.x +
          "," +
          LINE_SEGMENT_CORRECT_N.y +
          ")",
      });
      setFeedback({
        type: "correct",
        text: APP_DATA.steps[4].feedbackCorrectDone,
      });
      setCurrentStep(4);
      return;
    }

    if (currentStep === 4) {
      resetStep4LineState();
      setStep3Phase("done");
      setShowPurpleHighlight(false);
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      setStep3Phase("initial");
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

      if (currentStep === 0 || currentStep === 7) {
        addNudgeFor("start-button");
      } else if (currentStep === 3 && step3Phase !== "done") {
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
    step3RevealNudgeKey,
    step4LinePhase,
    step5Phase,
    step6Phase,
  ]);

  useEffect(() => {
    return () => {
      if (step4TimerRef.current) clearTimeout(step4TimerRef.current);
      if (step5TimerRef.current) clearTimeout(step5TimerRef.current);
      if (step6TimerRef.current) clearTimeout(step6TimerRef.current);
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

  if (currentStep === 7) {
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
        dndPlacements: dndPlacements,
        dndSourceItems: dndSourceItems,
        dndWrongItemId: dndWrongItemId,
        dndWrongZone: dndWrongZone,
        onDndDrop: handleDndDrop,
        onDndDragStart: handleDndDragStart,
        onStep2AnimComplete: handleStep2AnimComplete,
        onRevealComplete: handleRevealComplete,
        onRevealNudgeDismiss: handleRevealNudgeDismiss,
        graphPoints: graphPoints,
        graphSegments: graphSegments,
        feedback: feedback,
        step4LinePhase: step4LinePhase,
        draggableSegment: draggableSegment,
        onSegmentDrop: handleSegmentDrop,
        segmentDragEnabled: segmentDragEnabled,
        placedClone: placedClone,
        onSnapBackComplete: handleSnapBackComplete,
        step5Phase: step5Phase,
        step5CurrentPoint: step5CurrentPoint,
        step5Placed: step5Placed,
        step5WrongPoint: step5WrongPoint,
        step5VertexLabels: step5VertexLabels,
        onPointDrop: handlePointDrop,
        onStep5SnapBackComplete: handleStep5SnapBackComplete,
        step6Phase: step6Phase,
        step6Offset: step6Offset,
        step6SnapBack: step6SnapBack,
        step6FigureColor: step6FigureColor,
        step6Vertices: STEP6_VERTICES,
        onFigureDragMove: handleFigureDragMove,
        onFigureDrop: handleFigureDrop,
        onStep6SnapBackComplete: handleStep6SnapBackComplete,
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
