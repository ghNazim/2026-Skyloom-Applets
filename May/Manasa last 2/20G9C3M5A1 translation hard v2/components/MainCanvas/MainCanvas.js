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
  onSummaryNavChange,
  requestStep10,
  onRequestStep10Handled,
}) => {
  const { useState, useEffect, useRef, useCallback, useMemo } = React;

  const colors = APP_DATA.colors;
  const sc = APP_DATA.stepCards;
  const dx = APP_DATA.translation.dx;
  const dy = APP_DATA.translation.dy;

  const animStartedRef = useRef({
    step7Intro: step >= 7,
    step8Intro: step >= 8,
    step9Intro: step >= 9,
  });
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
  const [math, setMath] = useState(() =>
    step >= 7
      ? createMathStateForRestoredStep(step, mp)
      : createInitialMathState(mp),
  );
  const [flyClones, setFlyClones] = useState([]);
  const [step10, setStep10StateRaw] = useState(() =>
    step === 10 ? createStep10RestoredState() : {
    transferring: false,
    panelsHidden: false,
    plotPanelMounted: false,
    panelContentVisible: false,
    phase: "initial",
    plottedIndices: [],
    plottedGraphPoints: [],
    showImageLine: false,
    imageLineGrow: 0,
    coordClickable: null,
  },
  );

  const setStep10State = useCallback((update) => {
    if (typeof update === "function") {
      setStep10StateRaw((prev) => ({ ...prev, ...update(prev) }));
    } else {
      setStep10StateRaw((prev) => ({ ...prev, ...update }));
    }
  }, []);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const isCancelled = () => cancelledRef.current;

  useEffect(() => {
    cancelledRef.current = false;
    return () => {
      cancelledRef.current = true;
      if (
        MathStepHelpers &&
        typeof MathStepHelpers.clearPendingLineEquationClone === "function"
      ) {
        MathStepHelpers.clearPendingLineEquationClone();
      }
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

  const animateImageLineGrow = useCallback(async (duration) => {
    return new Promise((resolve) => {
      const startTime = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        setStep10State({ imageLineGrow: eased });
        if (t < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });
  }, [setStep10State]);

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
    addHighlight("highlight-translation");
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

  const applyStep5CardTitles = useCallback(
    (cardList) =>
      cardList.map((c) => {
        if (c.id === "card-step3") return { ...c, initialTitle: " " };
        if (c.id === "card-step2")
          return { ...c, initialTitle: sc.card1InitialTitle };
        return c;
      }),
    [sc],
  );

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

  useEffect(() => {
    if (step < 7) return;

    showCompletedStep6();
    setCards(createRestoredCards(sc, step));

    if (step >= 8) {
      addHighlight("highlight-translation");
    }

    applyRestoredStepNav(step, onMathNavChange);
  }, []);

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
      if (step !== 10) {
        setShowObjectLine(true);
        setObjectLineGrow(1);
      }
    }

    if (step === 10) {
      setLeftVisible(true);
      setRightVisible(true);
      setShowObjectLine(false);
      setShowImageLine(false);
      setWhitePoints([]);
      setTranslationPaths([]);
      setTranslationOverlay(null);
      setImagePinkPoints([]);
      setObjectPinkPoints([]);
      setPairTranslationPaths([]);
      setImageLineBlink(false);
      return;
    }

    if (step >= 3) {
      setShowImageLine(true);
      setWhitePoints([]);
      setTranslationPaths([]);
      setTranslationOverlay(null);
      setImageLineBlink(true);
      if (step === 3) {
        addHighlight("highlight-find");
      } else if (step >= 4) {
        clearHighlights();
      }

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
        if (prev.some((c) => c.id === "card-step1")) {
          return applyStep5CardTitles(prev);
        }
        return applyStep5CardTitles(
          prev.concat([
            {
              id: "card-step1",
              initialTitle: sc.card3InitialTitle,
              numberedTitle: sc.step1Title,
              content: sc.card3Content,
              order: 3,
              visible: true,
              clickable: false,
            },
          ]),
        );
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
    addHighlight,
    applyStep5CardTitles,
    runStep6Animation,
    showCompletedStep6,
  ]);

  const handleCardClick = useCallback(
    (cardId) => {
      if (typeof playSound === "function") playSound("click");
      if (step === 6 && cardId === "card-step1") {
        const labelEl = document.getElementById("object-line-equation-label");
        if (labelEl && MathStepHelpers.captureLineEquationClone) {
          MathStepHelpers.captureLineEquationClone(labelEl);
        }
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
      setStep10State,
      onStepAdvance,
      colors,
      imagePoints: APP_DATA.imagePoints,
      animateImageLineGrow,
    }),
    [onMathNavChange, onStepAdvance, addHighlight, setStep10State, animateImageLineGrow],
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

  const handleImagePointClick = useCallback(
    (index) => {
      if (step !== 9) return;
      if (math.step9Phase === "tapCoord0" && index === 0) {
        runStep9CoordClick(mathCtx, 0);
      } else if (math.step9Phase === "tapCoord1" && index === 1) {
        runStep9CoordClick(mathCtx, 1);
      }
    },
    [step, math.step9Phase, mathCtx],
  );

  const handleFormulaClick = useCallback(() => {
    if (step !== 9 || math.step9Phase !== "tapFormula") return;
    runStep9Substitute(mathCtx);
  }, [step, math.step9Phase, mathCtx]);

  const handleFormulaSimplifyClick = useCallback(() => {
    if (step !== 9 || math.step9Phase.indexOf("simplify-") !== 0) return;
    if (math.simplifyAnimPhase !== "idle") return;
    runStep9Simplify(mathCtx, math.simplifyStep);
  }, [
    step,
    math.step9Phase,
    math.simplifyStep,
    math.simplifyAnimPhase,
    mathCtx,
  ]);

  const handleStep10CoordClick = useCallback(
    (index) => {
      if (step !== 10) return;
      if (step10.phase === "tapCoord0" && index === 0) {
        runStep10PointClick(mathCtx, 0);
      } else if (step10.phase === "tapCoord1" && index === 1) {
        runStep10PointClick(mathCtx, 1);
      }
    },
    [step, step10.phase, mathCtx],
  );

  const step10TransferRef = useRef(false);

  useEffect(() => {
    if (!requestStep10 || step !== 9 || step10TransferRef.current) return;
    step10TransferRef.current = true;
    if (typeof onRequestStep10Handled === "function") onRequestStep10Handled();
    runStep9To10Transfer(mathCtx);
  }, [requestStep10, step, mathCtx, onRequestStep10Handled]);

  useEffect(() => {
    if (step !== 9) step10TransferRef.current = false;
  }, [step]);

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
    const showObject = step === 10 ? true : showObjectLine;
    const objectGrow = step === 10 ? 1 : objectLineGrow;

    if (showObject && OBJECT_LINE_CLIP) {
      lines.push({
        from: OBJECT_LINE_CLIP.from,
        to: OBJECT_LINE_CLIP.to,
        color: colors.object,
        label: APP_DATA.graph.objectLineLabel,
        labelId: "object-line-equation-label",
        labelT: 0.82,
        labelAngleOffset: 180,
        labelOffsetY: 27,
        growProgress: objectGrow,
      });
    }

    if (step === 10 && step10.showImageLine && IMAGE_LINE_CLIP) {
      lines.push({
        from: IMAGE_LINE_CLIP.from,
        to: IMAGE_LINE_CLIP.to,
        color: colors.image,
        label: "x+y=5",
        labelT: 0.82,
        labelAngleOffset: 180,
        growProgress: step10.imageLineGrow,
      });
    } else if (showImageLine && IMAGE_LINE_CLIP) {
      lines.push({
        from: IMAGE_LINE_CLIP.from,
        to: IMAGE_LINE_CLIP.to,
        color: colors.image,
        label: APP_DATA.graph.imageLineLabel,
        blink: imageLineBlink,
      });
    }
    return lines;
  }, [
    step,
    showObjectLine,
    showImageLine,
    imageLineBlink,
    colors,
    objectLineGrow,
    step10.showImageLine,
    step10.imageLineGrow,
  ]);

  const graphPoints = useMemo(() => {
    if (step === 10) {
      return step10.plottedGraphPoints || [];
    }
    return whitePoints.concat(imagePinkPoints).concat(objectPinkPoints);
  }, [
    step,
    whitePoints,
    imagePinkPoints,
    objectPinkPoints,
    step10.plottedGraphPoints,
  ]);

  const allTranslationPaths = useMemo(() => {
    if (step >= 5 && pairTranslationPaths.length > 0) {
      return pairTranslationPaths;
    }
    return translationPaths;
  }, [step, translationPaths, pairTranslationPaths]);

  const showStepCards = step >= 3 && step <= 9 && !step10.transferring;
  const showMathPanel = step >= 7 && step < 10;
  const showPlotLinePanel =
    step10.plotPanelMounted || step === 10 || step10.transferring;
  const showStep10Graph = step === 10;
  const panelTransferHidden = step10.panelsHidden;

  const step10CoordBoxes = useMemo(
    () => [
      {
        id: "step10-coord-0",
        text: mp.imageCoord0,
        clickable: step === 10 && step10.coordClickable === 0,
      },
      {
        id: "step10-coord-1",
        text: mp.imageCoord1,
        clickable: step === 10 && step10.coordClickable === 1,
      },
    ],
    [mp.imageCoord0, mp.imageCoord1, step, step10.coordClickable],
  );

  const flyCloneEls = flyClones.map((clone) => {
    if (clone.mode === "element") {
      return React.createElement(
        "div",
        {
          key: clone.id,
          className:
            "fly-clone-text is-element-clone" +
            (clone.animating ? " is-animating" : ""),
          style: {
            left: clone.startX + "px",
            top: clone.startY + "px",
            width: clone.width + "px",
            height: clone.height + "px",
            backgroundColor: clone.backgroundColor,
            border: clone.border,
            borderRadius: clone.borderRadius,
            color: clone.color,
            fontSize: clone.fontSize,
            fontWeight: clone.fontWeight,
            textAlign: clone.textAlign,
            "--fly-dx": clone.dx + "px",
            "--fly-dy": clone.dy + "px",
            "--fly-target-w": clone.targetWidth + "px",
            "--fly-target-h": clone.targetHeight + "px",
          },
        },
        clone.text,
      );
    }

    return React.createElement(
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
    );
  });

  if (step >= 11 && step < 12) {
    return React.createElement(
      "div",
      { className: "main-canvas-container main-canvas-summary" },
      React.createElement(SummaryCanvas, {
        step: step,
        texts: APP_DATA.summaryCanvas,
        translation: APP_DATA.translation,
        colors: {
          yellow: "#ffd34d",
          pink: APP_DATA.colors.pointPink,
          orange: APP_DATA.colors.object,
        },
        onNavChange: onSummaryNavChange,
      }),
      flyCloneEls,
    );
  }

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "div",
      {
        className:
          "main-canvas-left" +
          (leftVisible ? " is-visible" : "") +
          (panelTransferHidden ? " is-transfer-hidden" : ""),
      },
      showStep10Graph
        ? React.createElement(TranslationGraphPanel, {
            points: graphPoints,
            infiniteLines: infiniteLines,
            translationPaths: [],
            translationOverlay: null,
          })
        : showMathPanel
          ? React.createElement(MathPanel, {
            texts: mp,
            equationVisible: math.equationVisible,
            equationCollapsed: math.equationCollapsed,
            line1Visible: math.line1Visible,
            line1Text: math.line1Text,
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
            onImagePointClick: handleImagePointClick,
            formulaVisible: math.formulaVisible,
            formulaVarsYellow: math.formulaVarsYellow,
            formulaClickable: math.formulaClickable,
            formulaGlow: math.formulaGlow,
            formulaComplete: math.formulaComplete,
            simplifyStep: math.simplifyStep,
            simplifyAnimPhase: math.simplifyAnimPhase,
            onFormulaClick: handleFormulaClick,
            onFormulaSimplifyClick: handleFormulaSimplifyClick,
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
          "main-canvas-right" +
          (rightVisible ? " is-visible" : " is-visible") +
          (panelTransferHidden ? " is-transfer-hidden" : ""),
      },
      showPlotLinePanel
        ? React.createElement(PlotLinePanel, {
            texts: mp,
            contentVisible: step10.panelContentVisible,
            coordBoxes: step10CoordBoxes,
            onCoordClick: handleStep10CoordClick,
          })
        : showStepCards
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
