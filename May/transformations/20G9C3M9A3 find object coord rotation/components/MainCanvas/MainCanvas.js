const IMAGE_POINTS = [
  {
    key: "APrime",
    highlightId: "highlight-a-prime",
    label: () => APP_DATA.graph.labelAPrime,
    labelPrefix: "A\u2019",
    labelRefKey: "APrime",
    coordXRefKey: "APrimeX",
    coordYRefKey: "APrimeY",
    coordParts: () => APP_DATA.graph.coordAPrime,
    x: -2,
    y: 3,
    color: TRANSLATION_GRAPH_COLORS.image,
    labelPlacement: "left",
    clickId: "graph-point-aprime",
  },
  {
    key: "BPrime",
    highlightId: "highlight-b-prime",
    label: () => APP_DATA.graph.labelBPrime,
    labelPrefix: "B\u2019",
    labelRefKey: "BPrime",
    coordXRefKey: "BPrimeX",
    coordYRefKey: "BPrimeY",
    coordParts: () => APP_DATA.graph.coordBPrime,
    x: -4,
    y: 1,
    color: TRANSLATION_GRAPH_COLORS.image,
    labelPlacement: "left",
    clickId: "graph-point-bprime",
  },
];

const OBJECT_POINT_DEFS = [
  {
    key: "A",
    label: () => APP_DATA.graph.labelA,
    labelPrefix: "A",
    labelRefKey: "A",
    x: 3,
    y: 2,
    color: TRANSLATION_GRAPH_COLORS.preimage,
    labelPlacement: "below",
  },
  {
    key: "B",
    label: () => APP_DATA.graph.labelB,
    labelPrefix: "B",
    labelRefKey: "B",
    x: 1,
    y: 4,
    color: TRANSLATION_GRAPH_COLORS.preimage,
    labelPlacement: "above",
  },
];

const FIND_CONFIG = {
  APrime: {
    imageNumY: "2",
    imageCoord: () => APP_DATA.graph.coordAPrime,
    objectCoord: () => APP_DATA.graph.coordA,
    objectPoint: () => APP_DATA.points.a,
    objectKey: "A",
    objectBox: () => APP_DATA.questionVisual.objectAFound,
  },
  BPrime: {
    imageNumY: "4",
    imageCoord: () => APP_DATA.graph.coordBPrime,
    objectCoord: () => APP_DATA.graph.coordB,
    objectPoint: () => APP_DATA.points.b,
    objectKey: "B",
    objectBox: () => APP_DATA.questionVisual.objectBFound,
  },
};

const MainCanvas = ({
  step,
  step2Phase,
  onStep2AnimComplete,
  onVisibleHighlightsChange,
  onQuestionVisualChange,
  step3Phase,
  onStep3PhaseChange,
  step4Phase,
  onStep4PhaseChange,
  step5Phase,
  onStep5PhaseChange,
  step6Phase,
  onStep6PhaseChange,
  onObjectBoxChange,
  onStepAdvance,
}) => {
  const { useState, useEffect, useRef, useCallback, useMemo } = React;

  const animStartedRef = useRef(false);
  const labelRefs = useRef({});
  const coordRefs = useRef({});
  const ruleRefs = useRef({});
  const findAnimRef = useRef(false);
  const step4InitRef = useRef(false);
  const step5InitRef = useRef(false);
  const step6InitRef = useRef(false);
  const rotationAnimRef = useRef(false);

  const [leftVisible, setLeftVisible] = useState(false);
  const [rightVisible, setRightVisible] = useState(false);
  const [flyClones, setFlyClones] = useState([]);
  const [pointStates, setPointStates] = useState({});
  const [objectPointStates, setObjectPointStates] = useState({});
  const [showImageSegment, setShowImageSegment] = useState(false);
  const [imageSegmentOpacity, setImageSegmentOpacity] = useState(0);
  const [showObjectSegment, setShowObjectSegment] = useState(false);
  const [objectSegmentOpacity, setObjectSegmentOpacity] = useState(0);
  const [ruleState, setRuleState] = useState(GENERIC_RULE);
  const [useCoordParts, setUseCoordParts] = useState(false);
  const [rotationOverlay, setRotationOverlay] = useState(null);
  const [rotatePanelContentVisible, setRotatePanelContentVisible] =
    useState(false);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const setQuestionVisual = useCallback(
    (show, visible) => {
      if (typeof onQuestionVisualChange === "function") {
        onQuestionVisualChange(show, visible);
      }
    },
    [onQuestionVisualChange],
  );

  const animateFly = useCallback((sourceEl, targetEl, options = {}) => {
    return new Promise((resolve) => {
      if (!sourceEl || !targetEl) {
        resolve();
        return;
      }
      const id = "text-" + Date.now() + "-" + Math.random();
      const src = sourceEl.getBoundingClientRect();
      const tgt = targetEl.getBoundingClientRect();
      const dx = tgt.left + tgt.width / 2 - (src.left + src.width / 2);
      const dy = tgt.top + tgt.height / 2 - (src.top + src.height / 2);

      setFlyClones((prev) =>
        prev.concat([
          {
            id: id,
            text: options.text || sourceEl.textContent.trim(),
            startX: src.left + src.width / 2,
            startY: src.top + src.height / 2,
            dx: dx,
            dy: dy,
            animating: false,
            colorClass: options.colorClass || "",
          },
        ]),
      );

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFlyClones((prev) =>
            prev.map((c) => (c.id === id ? { ...c, animating: true } : c)),
          );
        });
      });

      setTimeout(() => {
        setFlyClones((prev) => prev.filter((c) => c.id !== id));
        resolve();
      }, 780);
    });
  }, []);

  const initHiddenPoints = useCallback(() => {
    const initial = {};
    IMAGE_POINTS.forEach((pt) => {
      initial[pt.key] = { circleOpacity: 0, labelVisible: false };
    });
    setPointStates(initial);
  }, []);

  const revealCircle = useCallback(async (key) => {
    setPointStates((prev) => ({
      ...prev,
      [key]: { circleOpacity: 0, labelVisible: true },
    }));
    await delay(30);
    setPointStates((prev) => ({
      ...prev,
      [key]: { circleOpacity: 1, labelVisible: true },
    }));
    await delay(320);
  }, []);

  const revealObjectPoint = useCallback(async (key) => {
    setObjectPointStates((prev) => ({
      ...prev,
      [key]: { circleOpacity: 0, labelVisible: false },
    }));
    await delay(30);
    setObjectPointStates((prev) => ({
      ...prev,
      [key]: { circleOpacity: 1, labelVisible: true },
    }));
    await delay(320);
  }, []);

  const addHighlight = useCallback(
    (id) => {
      if (typeof onVisibleHighlightsChange === "function") {
        onVisibleHighlightsChange(id);
      }
    },
    [onVisibleHighlightsChange],
  );

  const showCompletedStep2 = useCallback(() => {
    animStartedRef.current = true;
    setLeftVisible(true);
    const allPoints = {};
    IMAGE_POINTS.forEach((pt) => {
      allPoints[pt.key] = { circleOpacity: 1, labelVisible: true };
    });
    setPointStates(allPoints);
    setShowImageSegment(true);
    setImageSegmentOpacity(1);
    setQuestionVisual(true, true);
    if (typeof onVisibleHighlightsChange === "function") {
      onVisibleHighlightsChange("all");
    }
  }, [onVisibleHighlightsChange, setQuestionVisual]);

  const setupImageGraph = useCallback(() => {
    setLeftVisible(true);
    setShowImageSegment(true);
    setImageSegmentOpacity(1);
    const allPoints = {};
    IMAGE_POINTS.forEach((pt) => {
      allPoints[pt.key] = { circleOpacity: 1, labelVisible: true };
    });
    setPointStates(allPoints);
  }, []);

  const runFindAnimation = useCallback(
    async (primeKey) => {
      if (findAnimRef.current) return;
      findAnimRef.current = true;

      const cfg = FIND_CONFIG[primeKey];
      const imgCoord = cfg.imageCoord();
      const objCoord = cfg.objectCoord();

      if (typeof playSound === "function") playSound("click");

      await animateFly(
        coordRefs.current[primeKey + "X"],
        ruleRefs.current.imgNegY,
        { text: imgCoord.x, colorClass: "is-cyan" },
      );
      setRuleState((s) => ({
        ...s,
        imgNegY: { num: cfg.imageNumY },
      }));
      await delay(150);

      await animateFly(coordRefs.current[primeKey + "Y"], ruleRefs.current.imgX, {
        text: imgCoord.y,
        colorClass: "is-cyan",
      });
      setRuleState((s) => ({ ...s, imgX: imgCoord.y }));
      await delay(1000);

      await animateFly(
        ruleRefs.current.imgNegYNum,
        ruleRefs.current.objY,
        { text: cfg.imageNumY, colorClass: "is-orange" },
      );
      setRuleState((s) => ({ ...s, objY: objCoord.y }));
      await delay(150);

      await animateFly(ruleRefs.current.imgXNum, ruleRefs.current.objX, {
        text: imgCoord.y,
        colorClass: "is-orange",
      });
      setRuleState((s) => ({ ...s, objX: objCoord.x }));
      await delay(1000);

      const objGroup = document.querySelector(".rule-object-group");
      const ptDef = OBJECT_POINT_DEFS.find((p) => p.key === cfg.objectKey);

      setObjectPointStates((prev) => ({
        ...prev,
        [cfg.objectKey]: { circleOpacity: 0, labelVisible: false },
      }));
      await delay(100);

      const targetLabel = labelRefs.current[cfg.objectKey];
      if (objGroup && targetLabel) {
        await animateFly(objGroup, targetLabel, {
          text: ptDef.label(),
          colorClass: "is-orange",
        });
      }

      await revealObjectPoint(cfg.objectKey);

      if (typeof onObjectBoxChange === "function") {
        onObjectBoxChange(cfg.objectKey, cfg.objectBox());
      }

      await delay(400);
      findAnimRef.current = false;

      if (primeKey === "APrime") {
        if (typeof onStep4PhaseChange === "function") {
          onStep4PhaseChange("done");
        }
        await delay(300);
        if (typeof onStepAdvance === "function") onStepAdvance(5);
      } else {
        if (typeof onStep5PhaseChange === "function") {
          onStep5PhaseChange("done");
        }
        await delay(300);
        if (typeof onStepAdvance === "function") onStepAdvance(6);
      }
    },
    [
      animateFly,
      revealObjectPoint,
      onObjectBoxChange,
      onStep4PhaseChange,
      onStep5PhaseChange,
      onStepAdvance,
    ],
  );

  const handleAPrimeClick = useCallback(() => {
    if (step !== 4 || step4Phase !== "waiting" || findAnimRef.current) return;
    if (typeof onStep4PhaseChange === "function") {
      onStep4PhaseChange("animating");
    }
    runFindAnimation("APrime");
  }, [step, step4Phase, onStep4PhaseChange, runFindAnimation]);

  const handleBPrimeClick = useCallback(() => {
    if (step !== 5 || step5Phase !== "waiting" || findAnimRef.current) return;
    if (typeof onStep5PhaseChange === "function") {
      onStep5PhaseChange("animating");
    }
    runFindAnimation("BPrime");
  }, [step, step5Phase, onStep5PhaseChange, runFindAnimation]);

  const runRotationAnimation = useCallback(async () => {
    if (rotationAnimRef.current) return;
    rotationAnimRef.current = true;
    if (typeof playSound === "function") playSound("click");
    if (typeof onStep6PhaseChange === "function") {
      onStep6PhaseChange("rotating");
    }

    const clonePoints = OBJECT_POINT_DEFS.map((pt) => ({
      id: pt.key,
      x: pt.x,
      y: pt.y,
      color: pt.color,
      labelPlacement: pt.labelPlacement,
      circleOpacity: 1,
      showLabel: false,
    }));

    setRotationOverlay({
      active: true,
      angle: 0,
      opacity: 1,
      points: clonePoints,
      segments: [
        {
          from: { x: 3, y: 2 },
          to: { x: 1, y: 4 },
          color: TRANSLATION_GRAPH_COLORS.preimage,
        },
      ],
    });

    await delay(80);

    await new Promise((resolve) => {
      const duration = 1600;
      const startTime = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        setRotationOverlay((prev) =>
          prev ? { ...prev, angle: eased * 270 } : prev,
        );
        if (t < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });

    await delay(400);
    setRotationOverlay(null);
    rotationAnimRef.current = false;
    if (typeof onStep6PhaseChange === "function") {
      onStep6PhaseChange("done");
    }
  }, [onStep6PhaseChange]);

  useEffect(() => {
    if (step !== 2) return;

    if (step2Phase === "done") {
      if (!animStartedRef.current) showCompletedStep2();
      return;
    }

    if (animStartedRef.current) return;
    animStartedRef.current = true;

    const runStep2Anim = async () => {
      addHighlight("highlight-rotation");
      await delay(450);
      addHighlight("highlight-a-prime");
      addHighlight("highlight-b-prime");
      await delay(450);
      addHighlight("highlight-find");
      await delay(500);

      setLeftVisible(true);
      initHiddenPoints();
      await delay(450);

      for (let i = 0; i < IMAGE_POINTS.length; i++) {
        const pt = IMAGE_POINTS[i];
        const sourceEl = document.getElementById(pt.highlightId);
        const targetEl = labelRefs.current[pt.labelRefKey];
        await animateFly(sourceEl, targetEl, {
          text: pt.label(),
          colorClass: "is-cyan",
        });
        await revealCircle(pt.key);
        await delay(200);
      }

      setShowImageSegment(true);
      await delay(30);
      setImageSegmentOpacity(1);
      await delay(500);

      setQuestionVisual(true, false);
      await delay(80);
      setQuestionVisual(true, true);
      await delay(500);

      if (typeof onStep2AnimComplete === "function") onStep2AnimComplete();
    };

    runStep2Anim();
  }, [
    step,
    step2Phase,
    animateFly,
    revealCircle,
    initHiddenPoints,
    addHighlight,
    onStep2AnimComplete,
    showCompletedStep2,
  ]);

  useEffect(() => {
    if (step === 1) {
      animStartedRef.current = false;
      findAnimRef.current = false;
      step4InitRef.current = false;
      step5InitRef.current = false;
      step6InitRef.current = false;
      rotationAnimRef.current = false;
      setLeftVisible(false);
      setRightVisible(false);
      setPointStates({});
      setObjectPointStates({});
      setShowImageSegment(false);
      setImageSegmentOpacity(0);
      setShowObjectSegment(false);
      setObjectSegmentOpacity(0);
      setRuleState(GENERIC_RULE);
      setUseCoordParts(false);
      setRotationOverlay(null);
      setRotatePanelContentVisible(false);
      setQuestionVisual(false, false);
      return;
    }

    if (step === 2 && step2Phase === "initial") {
      setRightVisible(false);
      setUseCoordParts(false);
    }

    if (step === 3) {
      setupImageGraph();
      setQuestionVisual(true, true);
      setUseCoordParts(false);
      if (step3Phase === "initial") {
        setRightVisible(false);
        setTimeout(() => {
          setRightVisible(true);
          if (typeof onStep3PhaseChange === "function") {
            onStep3PhaseChange("entering");
          }
        }, 80);
      } else {
        setRightVisible(true);
      }
    }

    if (step === 4 && !step4InitRef.current) {
      step4InitRef.current = true;
      setupImageGraph();
      setQuestionVisual(true, true);
      setRuleState(GENERIC_RULE);
      setUseCoordParts(true);
      setRightVisible(true);
      findAnimRef.current = false;
    }

    if (step === 5 && !step5InitRef.current) {
      step5InitRef.current = true;
      setupImageGraph();
      setQuestionVisual(true, true);
      setRuleState(GENERIC_RULE);
      setUseCoordParts(true);
      setRightVisible(true);
      findAnimRef.current = false;
    }

    if (step === 6) {
      if (step6InitRef.current) return;
      step6InitRef.current = true;
      setupImageGraph();
      setQuestionVisual(true, true);
      setUseCoordParts(false);
      setRightVisible(true);
      setObjectPointStates({
        A: { circleOpacity: 1, labelVisible: true },
        B: { circleOpacity: 1, labelVisible: true },
      });
      setShowObjectSegment(true);
      setObjectSegmentOpacity(0);
      setRotatePanelContentVisible(false);

      setTimeout(() => setObjectSegmentOpacity(1), 80);
      setTimeout(() => setRotatePanelContentVisible(true), 600);
      if (typeof onStep6PhaseChange === "function") {
        onStep6PhaseChange("panelVisible");
      }
    }
    if (step !== 6) {
      step6InitRef.current = false;
    }
  }, [step, step2Phase, step3Phase, onStep3PhaseChange, setQuestionVisual, setupImageGraph]);

  const graphPoints = useMemo(() => {
    const pts = IMAGE_POINTS.map((pt) => {
      const state = pointStates[pt.key];
      if (!state) return null;
      const clickable =
        (step === 4 && step4Phase === "waiting" && pt.key === "APrime") ||
        (step === 5 && step5Phase === "waiting" && pt.key === "BPrime");

      return {
        id: pt.key,
        x: pt.x,
        y: pt.y,
        color: pt.color,
        label: pt.label(),
        labelPrefix: pt.labelPrefix,
        labelPlacement: pt.labelPlacement,
        circleOpacity: state.circleOpacity,
        labelOpacity: state.labelVisible ? 1 : 0,
        showLabel: true,
        labelRefKey: pt.labelRefKey,
        coordParts: useCoordParts ? pt.coordParts() : null,
        coordXRefKey: pt.coordXRefKey,
        coordYRefKey: pt.coordYRefKey,
        clickable: clickable,
        showClickPulse: clickable,
        clickId: pt.clickId,
        onClick: pt.key === "APrime" ? handleAPrimeClick : handleBPrimeClick,
      };
    }).filter(Boolean);

    OBJECT_POINT_DEFS.forEach((pt) => {
      const state = objectPointStates[pt.key];
      if (!state) return;
      pts.push({
        id: pt.key,
        x: pt.x,
        y: pt.y,
        color: pt.color,
        label: pt.label(),
        labelPrefix: pt.labelPrefix,
        labelPlacement: pt.labelPlacement,
        circleOpacity: state.circleOpacity,
        labelOpacity: state.labelVisible ? 1 : 0,
        showLabel: true,
        labelRefKey: pt.labelRefKey,
      });
    });

    return pts;
  }, [
    pointStates,
    objectPointStates,
    useCoordParts,
    step,
    step4Phase,
    step5Phase,
    handleAPrimeClick,
    handleBPrimeClick,
  ]);

  const graphSegments = useMemo(() => {
    const segs = [];
    if (showImageSegment) {
      segs.push({
        from: { x: -2, y: 3 },
        to: { x: -4, y: 1 },
        color: TRANSLATION_GRAPH_COLORS.image,
        opacity: imageSegmentOpacity,
      });
    }
    if (showObjectSegment) {
      segs.push({
        from: { x: 3, y: 2 },
        to: { x: 1, y: 4 },
        color: TRANSLATION_GRAPH_COLORS.preimage,
        opacity: objectSegmentOpacity,
      });
    }
    return segs;
  }, [showImageSegment, imageSegmentOpacity, showObjectSegment, objectSegmentOpacity]);

  const columnsHidden = step === 1;
  const rightHidden = step <= 2;
  const showRuleResult = step >= 4 && step <= 5;
  const showRotatePanel = step === 6;

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

  const renderRightPanel = () => {
    if (step === 3) {
      return React.createElement(RuleDndPanel, {
        phase: step3Phase,
        onComplete: () => {
          if (typeof onStep3PhaseChange === "function") {
            onStep3PhaseChange("complete");
          }
        },
      });
    }
    if (showRuleResult) {
      return React.createElement(
        "div",
        { className: "main-canvas-right-inner" },
        React.createElement(RuleResultBox, {
          ruleState: ruleState,
          coordRefs: ruleRefs,
          visible: true,
        }),
      );
    }
    if (showRotatePanel) {
      return React.createElement(RotatePanel, {
        visible: true,
        contentVisible: rotatePanelContentVisible,
        onRotate: runRotationAnimation,
        disabled: step6Phase === "rotating" || step6Phase === "done",
      });
    }
    return null;
  };

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "div",
      { className: "main-canvas-container" },
      React.createElement(
        "div",
        {
          className:
            "main-canvas-left" +
            (leftVisible && !columnsHidden ? " is-visible" : "") +
            (columnsHidden ? " is-hidden-step1" : ""),
        },
        step >= 2
          ? React.createElement(TranslationGraphPanel, {
              points: graphPoints,
              segments: graphSegments,
              labelRefs: labelRefs,
              coordRefs: coordRefs,
              rotationOverlay: rotationOverlay,
            })
          : null,
      ),
      React.createElement(
        "div",
        {
          className:
            "main-canvas-right" +
            (columnsHidden || rightHidden ? " is-hidden-step1" : "") +
            (rightVisible && step >= 3 ? " is-visible" : ""),
        },
        renderRightPanel(),
      ),
    ),
    flyCloneEls,
  );
};
