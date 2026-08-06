const MainCanvas = ({
  step,
  step1Phase,
  onStep1AnimComplete,
  onVisibleHighlightsChange,
  step2Phase,
  onStep2AnimComplete,
  step6Phase,
  onStep6PhaseChange,
  onStepAdvance,
  onMathNavChange,
}) => {
  const { useState, useEffect, useRef, useCallback, useMemo } = React;

  const colors = APP_DATA.colors;
  const sc = APP_DATA.stepCards;
  const dx = APP_DATA.translation.dx;
  const dy = APP_DATA.translation.dy;

  const animStartedRef = useRef({});
  const cancelledRef = useRef(false);

  const [leftVisible, setLeftVisible] = useState(false);
  const [rightVisible, setRightVisible] = useState(false);
  const [showObjectLine, setShowObjectLine] = useState(false);
  const [objectLineGrow, setObjectLineGrow] = useState(0);
  const [showImageLine, setShowImageLine] = useState(false);
  const [imageLineBlink, setImageLineBlink] = useState(false);
  const [whitePoints, setWhitePoints] = useState([]);
  const [translationPaths, setTranslationPaths] = useState([]);
  const [translationOverlay, setTranslationOverlay] = useState(null);
  const [imagePinkPoints, setImagePinkPoints] = useState([]);
  const [objectPinkPoints, setObjectPinkPoints] = useState([]);
  const [pairTranslationPaths, setPairTranslationPaths] = useState([]);

  const [cards, setCards] = useState([]);
  const [showConnectors, setShowConnectors] = useState(false);
  const [titlePhase, setTitlePhase] = useState("initial");
  const [rearrangePhase, setRearrangePhase] = useState("idle");

  const mp = APP_DATA.mathPanel;
  const [math, setMath] = useState(() => createInitialMathState(mp));
  const [flyClones, setFlyClones] = useState([]);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const isCancelled = () => cancelledRef.current;

  useEffect(() => {
    cancelledRef.current = false;
    return () => {
      cancelledRef.current = true;
    };
  }, []);

  const addHighlight = useCallback(
    (id) => {
      if (typeof onVisibleHighlightsChange === "function") {
        onVisibleHighlightsChange(id);
      }
    },
    [onVisibleHighlightsChange],
  );

  const clearHighlights = useCallback(() => {
    if (typeof onVisibleHighlightsChange === "function") {
      onVisibleHighlightsChange("clear");
    }
  }, [onVisibleHighlightsChange]);

  const animatePathProgress = useCallback(
    async (pathCount, duration) => {
      const startTime = performance.now();
      return new Promise((resolve) => {
        const tick = (now) => {
          const t = Math.min(1, (now - startTime) / duration);
          const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          setTranslationPaths(
            APP_DATA.linePoints.map((pt) => ({
              from: pt,
              progress: eased,
              dx: dx,
              dy: dy,
            })),
          );
          if (t < 1) requestAnimationFrame(tick);
          else resolve();
        };
        requestAnimationFrame(tick);
      });
    },
    [dx, dy],
  );

  const animateLineTranslation = useCallback(async () => {
    const cfg = TRANSLATION_GRAPH_CONFIG;
    const offsetX = dx * cfg.unit;
    const offsetY = -dy * cfg.unit;
    const duration = 1200;

    setTranslationOverlay({
      active: true,
      offsetX: 0,
      offsetY: 0,
      opacity: 1,
      infiniteLines: [
        {
          from: OBJECT_LINE_CLIP.from,
          to: OBJECT_LINE_CLIP.to,
          color: colors.image,
          label: "",
        },
      ],
    });

    await delay(50);
    if (isCancelled()) return;

    await new Promise((resolve) => {
      const startTime = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        setTranslationOverlay({
          active: true,
          offsetX: eased * offsetX,
          offsetY: eased * offsetY,
          opacity: 1,
          infiniteLines: [
            {
              from: OBJECT_LINE_CLIP.from,
              to: OBJECT_LINE_CLIP.to,
              color: colors.image,
              label: "",
            },
          ],
        });
        if (t < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });

    if (isCancelled()) return;
    setTranslationOverlay(null);
    setShowImageLine(true);
  }, [colors.image, dx, dy]);

  const animateObjectLineGrow = useCallback(async (duration) => {
    return new Promise((resolve) => {
      const startTime = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        setObjectLineGrow(eased);
        if (t < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });
  }, []);

  const runStep1Animation = useCallback(async () => {
    setLeftVisible(true);
    await delay(500);
    if (isCancelled()) return;

    addHighlight("highlight-equation");
    await delay(500);
    if (isCancelled()) return;

    setShowObjectLine(true);
    setObjectLineGrow(0);
    await animateObjectLineGrow(900);
    if (isCancelled()) return;

    if (typeof onStep1AnimComplete === "function") onStep1AnimComplete();
  }, [addHighlight, onStep1AnimComplete, animateObjectLineGrow]);

  const runStep2Animation = useCallback(async () => {
    clearHighlights();
    addHighlight("highlight-right");
    addHighlight("highlight-up");
    await delay(400);
    if (isCancelled()) return;

    setWhitePoints(
      APP_DATA.linePoints.map((pt, i) => ({
        id: "wp-" + i,
        x: pt.x,
        y: pt.y,
        color: colors.pointWhite,
        showLabel: false,
      })),
    );
    await delay(400);
    if (isCancelled()) return;

    await animatePathProgress(APP_DATA.linePoints.length, 1400);
    if (isCancelled()) return;

    await animateLineTranslation();
    if (isCancelled()) return;

    clearHighlights();
    await delay(200);
    addHighlight("highlight-find");
    await delay(300);
    if (isCancelled()) return;

    if (typeof onStep2AnimComplete === "function") onStep2AnimComplete();
  }, [
    addHighlight,
    clearHighlights,
    animatePathProgress,
    animateLineTranslation,
    onStep2AnimComplete,
    colors.pointWhite,
  ]);

  const runStep6Animation = useCallback(async () => {
    if (typeof onStep6PhaseChange === "function") {
      onStep6PhaseChange("animating");
    }

    setImagePinkPoints((pts) => pts.map((p) => ({ ...p, blink: false })));
    setObjectPinkPoints((pts) => pts.map((p) => ({ ...p, blink: false })));

    setTitlePhase("changing");
    await delay(400);
    if (isCancelled()) return;

    setTitlePhase("numbered");
    await delay(500);
    if (isCancelled()) return;

    setShowConnectors(false);
    setRearrangePhase("prepare");
    await delay(80);
    if (isCancelled()) return;

    setRearrangePhase("hiding");
    await delay(50);
    if (isCancelled()) return;

    setCards((prev) =>
      prev.map((c) => ({
        ...c,
        order: c.id === "card-step1" ? 1 : c.id === "card-step2" ? 2 : 3,
      })),
    );
    setRearrangePhase("animating");
    await delay(700);
    if (isCancelled()) return;

    setRearrangePhase("done");
    setShowConnectors(true);
    setCards((prev) =>
      prev.map((c) => ({
        ...c,
        clickable: c.id === "card-step1",
      })),
    );

    if (typeof onStep6PhaseChange === "function") {
      onStep6PhaseChange("done");
    }
  }, [onStep6PhaseChange]);

  const showCompletedStep1 = useCallback(() => {
    setLeftVisible(true);
    setRightVisible(true);
    setShowObjectLine(true);
    setObjectLineGrow(1);
    addHighlight("highlight-equation");
  }, [addHighlight]);

  const showCompletedStep6 = useCallback(() => {
    setLeftVisible(true);
    setRightVisible(true);
    setShowObjectLine(true);
    setObjectLineGrow(1);
    setShowImageLine(true);
    setImageLineBlink(false);
    setImagePinkPoints(
      APP_DATA.imagePoints.map((pt, i) => ({
        id: "ip-" + i,
        x: pt.x,
        y: pt.y,
        color: colors.pointPink,
        showLabel: false,
        blink: false,
      })),
    );
    setObjectPinkPoints(
      APP_DATA.objectPoints.map((pt, i) => ({
        id: "op-" + i,
        x: pt.x,
        y: pt.y,
        color: colors.pointPink,
        showLabel: false,
        hollow: true,
        blink: false,
      })),
    );
    setPairTranslationPaths(
      APP_DATA.objectPoints.map((pt) => ({
        from: pt,
        progress: 1,
        dx: dx,
        dy: dy,
      })),
    );
    setTitlePhase("numbered");
    setRearrangePhase("done");
    setShowConnectors(true);
    setCards([
      {
        id: "card-step1",
        initialTitle: sc.card3InitialTitle,
        numberedTitle: sc.step1Title,
        content: sc.card3Content,
        order: 1,
        visible: true,
        clickable: true,
      },
      {
        id: "card-step2",
        initialTitle: sc.card2InitialTitle,
        numberedTitle: sc.step2Title,
        content: sc.card2Content,
        order: 2,
        visible: true,
        clickable: false,
      },
      {
        id: "card-step3",
        initialTitle: sc.card1InitialTitle,
        numberedTitle: sc.step3Title,
        content: sc.card1Content,
        order: 3,
        visible: true,
        clickable: false,
      },
    ]);
    animStartedRef.current.step6 = true;
  }, [colors.pointPink, sc, dx, dy]);

  const showCompletedStep2 = useCallback(() => {
    setLeftVisible(true);
    setRightVisible(true);
    setShowObjectLine(true);
    setObjectLineGrow(1);
    setShowImageLine(true);
    setWhitePoints(
      APP_DATA.linePoints.map((pt, i) => ({
        id: "wp-" + i,
        x: pt.x,
        y: pt.y,
        color: colors.pointWhite,
        showLabel: false,
      })),
    );
    setTranslationPaths(
      APP_DATA.linePoints.map((pt) => ({
        from: pt,
        progress: 1,
        dx: dx,
        dy: dy,
      })),
    );
    addHighlight("highlight-find");
  }, [addHighlight, colors.pointWhite, dx, dy]);

  useEffect(() => {
    if (step !== 1) return;

    if (step1Phase === "done") {
      if (!animStartedRef.current.step1) {
        showCompletedStep1();
        animStartedRef.current.step1 = true;
      }
      return;
    }

    if (animStartedRef.current.step1Run) return;
    animStartedRef.current.step1Run = true;
    setRightVisible(true);
    runStep1Animation();
  }, [step, step1Phase, runStep1Animation, showCompletedStep1]);

  useEffect(() => {
    if (step !== 2) return;

    if (step2Phase === "done") {
      if (!animStartedRef.current.step2) {
        showCompletedStep2();
        animStartedRef.current.step2 = true;
      }
      return;
    }

    if (animStartedRef.current.step2Run) return;
    animStartedRef.current.step2Run = true;
    setLeftVisible(true);
    setRightVisible(true);
    setShowObjectLine(true);
    runStep2Animation();
  }, [step, step2Phase, runStep2Animation, showCompletedStep2, addHighlight]);

  const prevStepRef = useRef(step);

  useEffect(() => {
    const enteringStep = step !== prevStepRef.current;
    prevStepRef.current = step;

    if (step === 1 && enteringStep) {
      animStartedRef.current = {};
      setLeftVisible(false);
      setRightVisible(true);
      setShowObjectLine(false);
      setObjectLineGrow(0);
      setShowImageLine(false);
      setImageLineBlink(false);
      setWhitePoints([]);
      setTranslationPaths([]);
      setTranslationOverlay(null);
      setImagePinkPoints([]);
      setObjectPinkPoints([]);
      setPairTranslationPaths([]);
      setCards([]);
      setShowConnectors(false);
      setTitlePhase("initial");
      setRearrangePhase("idle");
      clearHighlights();
    }

    if (step === 1) return;

    if (step >= 2) {
      setLeftVisible(true);
      setRightVisible(true);
      setShowObjectLine(true);
      setObjectLineGrow(1);
    }

    if (step >= 3) {
      setShowImageLine(true);
      setWhitePoints([]);
      setTranslationPaths([]);
      setTranslationOverlay(null);
      setImageLineBlink(true);
      clearHighlights();

      if (cards.length === 0) {
        setCards([
          {
            id: "card-step3",
            initialTitle: sc.card1InitialTitle,
            numberedTitle: sc.step3Title,
            content: sc.card1Content,
            order: 1,
            visible: true,
            clickable: false,
          },
        ]);
      }
    } else {
      setImageLineBlink(false);
    }

    if (step >= 4) {
      setImageLineBlink(false);
      setImagePinkPoints(
        APP_DATA.imagePoints.map((pt, i) => ({
          id: "ip-" + i,
          x: pt.x,
          y: pt.y,
          color: colors.pointPink,
          showLabel: false,
          blink: step === 4,
        })),
      );

      setCards((prev) => {
        if (prev.some((c) => c.id === "card-step2")) return prev;
        return prev.concat([
          {
            id: "card-step2",
            initialTitle: sc.card2InitialTitle,
            numberedTitle: sc.step2Title,
            content: sc.card2Content,
            order: 2,
            visible: true,
            clickable: false,
          },
        ]);
      });
      setShowConnectors(true);
    }

    if (step >= 5) {
      setImagePinkPoints((pts) => pts.map((p) => ({ ...p, blink: false })));

      setObjectPinkPoints(
        APP_DATA.objectPoints.map((pt, i) => ({
          id: "op-" + i,
          x: pt.x,
          y: pt.y,
          color: colors.pointPink,
          showLabel: false,
          hollow: true,
          blink: step === 5,
        })),
      );

      if (step === 5 && !animStartedRef.current.step5Paths) {
        animStartedRef.current.step5Paths = true;
        const pairs = [
          { from: APP_DATA.objectPoints[0], to: APP_DATA.imagePoints[0] },
          { from: APP_DATA.objectPoints[1], to: APP_DATA.imagePoints[1] },
        ];
        setPairTranslationPaths(
          pairs.map((p) => ({ from: p.from, progress: 0, dx: dx, dy: dy })),
        );
        const duration = 900;
        const startTime = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - startTime) / duration);
          const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          setPairTranslationPaths(
            pairs.map((p) => ({
              from: p.from,
              progress: eased,
              dx: dx,
              dy: dy,
            })),
          );
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      } else if (step >= 5 && pairTranslationPaths.length === 0) {
        setPairTranslationPaths(
          APP_DATA.objectPoints.map((pt) => ({
            from: pt,
            progress: 1,
            dx: dx,
            dy: dy,
          })),
        );
      }

      setCards((prev) => {
        if (prev.some((c) => c.id === "card-step1")) return prev;
        return prev.concat([
          {
            id: "card-step1",
            initialTitle: sc.card3InitialTitle,
            numberedTitle: sc.step1Title,
            content: sc.card3Content,
            order: 3,
            visible: true,
            clickable: false,
          },
        ]);
      });
      setShowConnectors(true);
    }

    if (step >= 6) {
      if (step6Phase === "done") {
        if (!animStartedRef.current.step6) showCompletedStep6();
        return;
      }
      if (step6Phase === "initial" && !animStartedRef.current.step6) {
        animStartedRef.current.step6 = true;
        runStep6Animation();
      }
    }

    if (step !== 5) animStartedRef.current.step5Paths = false;
    if (step !== 6) animStartedRef.current.step6 = false;
  }, [
    step,
    step6Phase,
    cards.length,
    sc,
    colors,
    dx,
    dy,
    clearHighlights,
    runStep6Animation,
    showCompletedStep6,
  ]);

  const handleCardClick = useCallback(
    (cardId) => {
      if (typeof playSound === "function") playSound("click");
      if (step === 6 && cardId === "card-step1") {
        if (typeof onStepAdvance === "function") onStepAdvance(7);
        return;
      }
      if (
        step === 7 &&
        cardId === "card-step2" &&
        math.step7Phase === "done"
      ) {
        if (typeof onStepAdvance === "function") onStepAdvance(8);
        return;
      }
      if (
        step === 8 &&
        cardId === "card-step3" &&
        math.step8Phase === "done"
      ) {
        if (typeof onStepAdvance === "function") onStepAdvance(9);
      }
    },
    [step, math.step7Phase, math.step8Phase, onStepAdvance],
  );

  const mathCtx = useMemo(
    () => ({
      delay,
      isCancelled,
      setMath,
      mp,
      onMathNavChange,
      setFlyClones,
      MathStepHelpers,
      setCards,
      addHighlight,
    }),
    [onMathNavChange, addHighlight],
  );

  const handleMathXClick = useCallback(() => {
    if (step !== 7 || math.step7Phase !== "tapX") return;
    runStep7AfterXClick(mathCtx);
  }, [step, math.step7Phase, mathCtx]);

  const handleMathYClick = useCallback(() => {
    if (step !== 7 || math.step7Phase !== "tapY") return;
    runStep7AfterYClick(mathCtx);
  }, [step, math.step7Phase, mathCtx]);

  const handleMathEquationClick = useCallback(() => {
    if (step !== 7) return;
    if (math.step7Phase === "tapEquationX") {
      runStep7AfterEquationX(mathCtx);
    } else if (math.step7Phase === "tapEquationY") {
      runStep7AfterEquationY(mathCtx);
    }
  }, [step, math.step7Phase, mathCtx]);

  const handleObjectPointClick = useCallback(
    (index) => {
      if (step !== 8) return;
      if (math.step8Phase === "tapPoints" && index === 0) {
        runStep8TranslatePoint(mathCtx, 0);
      } else if (math.step8Phase === "tapPoint1" && index === 1) {
        runStep8TranslatePoint(mathCtx, 1);
      }
    },
    [step, math.step8Phase, mathCtx],
  );

  useEffect(() => {
    if (step !== 7) {
      animStartedRef.current.step7Intro = false;
      return;
    }
    if (animStartedRef.current.step7Intro) return;
    animStartedRef.current.step7Intro = true;
    setMath((m) => ({
      ...m,
      activeCardId: "card-step1",
      contentHighlightId: "card-step1",
    }));
    runStep7Intro(mathCtx);
  }, [step, mathCtx]);

  useEffect(() => {
    if (step !== 8) {
      animStartedRef.current.step8Intro = false;
      return;
    }
    if (animStartedRef.current.step8Intro) return;
    animStartedRef.current.step8Intro = true;
    runStep8Intro(mathCtx);
  }, [step, mathCtx]);

  useEffect(() => {
    if (step !== 9) {
      animStartedRef.current.step9Intro = false;
      return;
    }
    if (animStartedRef.current.step9Intro) return;
    animStartedRef.current.step9Intro = true;
    runStep9Intro(mathCtx);
  }, [step, mathCtx]);

  const infiniteLines = useMemo(() => {
    const lines = [];
    if (showObjectLine && OBJECT_LINE_CLIP) {
      lines.push({
        from: OBJECT_LINE_CLIP.from,
        to: OBJECT_LINE_CLIP.to,
        color: colors.object,
        label: APP_DATA.graph.objectLineLabel,
        labelT: 0.82,
        labelAngleOffset: 180,
        growProgress: objectLineGrow,
      });
    }
    if (showImageLine && IMAGE_LINE_CLIP) {
      lines.push({
        from: IMAGE_LINE_CLIP.from,
        to: IMAGE_LINE_CLIP.to,
        color: colors.image,
        label: APP_DATA.graph.imageLineLabel,
        blink: imageLineBlink,
      });
    }
    return lines;
  }, [showObjectLine, showImageLine, imageLineBlink, colors, objectLineGrow]);

  const graphPoints = useMemo(() => {
    return whitePoints.concat(imagePinkPoints).concat(objectPinkPoints);
  }, [whitePoints, imagePinkPoints, objectPinkPoints]);

  const allTranslationPaths = useMemo(() => {
    if (step >= 5 && pairTranslationPaths.length > 0) {
      return pairTranslationPaths;
    }
    return translationPaths;
  }, [step, translationPaths, pairTranslationPaths]);

  const showStepCards = step >= 3 && step <= 9;
  const showMathPanel = step >= 7;

  const flyCloneEls = flyClones.map((clone) =>
    React.createElement(
      "div",
      {
        key: clone.id,
        className: "fly-clone-text " + (clone.colorClass || ""),
        style: {
          left: clone.startX + "px",
          top: clone.startY + "px",
          transform: clone.animating
            ? "translate(calc(-50% + " +
              clone.dx +
              "px), calc(-50% + " +
              clone.dy +
              "px))"
            : "translate(-50%, -50%)",
        },
      },
      clone.text,
    ),
  );

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "div",
      {
        className: "main-canvas-left" + (leftVisible ? " is-visible" : ""),
      },
      showMathPanel
        ? React.createElement(MathPanel, {
            texts: mp,
            equationVisible: math.equationVisible,
            equationCollapsed: math.equationCollapsed,
            line1Visible: math.line1Visible,
            line2Visible: math.line2Visible,
            line2Text: math.line2Text,
            equationParts: math.equationParts,
            highlightVar: math.highlightVar,
            equationClickable: math.equationClickable,
            onXClick: handleMathXClick,
            onYClick: handleMathYClick,
            onEquationClick: handleMathEquationClick,
            objectTitleVisible: math.objectTitleVisible,
            objectRowHidden: math.objectRowHidden,
            objectPoints: math.objectPoints,
            onObjectPointClick: handleObjectPointClick,
            line3Visible: math.line3Visible,
            line3Hidden: math.line3Hidden,
            line3PrefixVisible: math.line3PrefixVisible,
            line3VectorVisible: math.line3VectorVisible,
            line3VectorInstant: math.line3VectorInstant,
            imageTitleVisible: math.imageTitleVisible,
            imagePoints: math.imagePoints,
            formulaVisible: math.formulaVisible,
          })
        : step >= 1
          ? React.createElement(TranslationGraphPanel, {
              points: graphPoints,
              infiniteLines: infiniteLines,
              translationPaths: allTranslationPaths,
              translationOverlay: translationOverlay,
            })
          : null,
    ),
    React.createElement(
      "div",
      {
        className:
          "main-canvas-right" + (rightVisible ? " is-visible" : " is-visible"),
      },
      showStepCards
        ? React.createElement(StepCardsPanel, {
            cards: cards,
            showConnectors: showConnectors,
            titlePhase: titlePhase,
            rearrangePhase: rearrangePhase,
            onCardClick: handleCardClick,
            activeCardId: math.activeCardId,
            exploredCardIds: math.exploredCardIds,
            contentHighlightId: math.contentHighlightId,
          })
        : null,
    ),
    flyCloneEls,
  );
};
