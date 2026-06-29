const RECT_IMAGE_POINTS = [
  {
    key: "APrime",
    boxKey: "A",
    labelRefKey: "APrime",
    coordXRefKey: "APrimeX",
    coordYRefKey: "APrimeY",
    x: -2,
    y: 1,
    color: TRANSLATION_GRAPH_COLORS.image,
    labelPlacement: "left",
    clickId: "graph-point-aprime",
    findStep: 10,
  },
  {
    key: "BPrime",
    boxKey: "B",
    labelRefKey: "BPrime",
    coordXRefKey: "BPrimeX",
    coordYRefKey: "BPrimeY",
    x: -2,
    y: 4,
    color: TRANSLATION_GRAPH_COLORS.image,
    labelPlacement: "left",
    clickId: "graph-point-bprime",
    findStep: 11,
  },
  {
    key: "CPrime",
    boxKey: "C",
    labelRefKey: "CPrime",
    coordXRefKey: "CPrimeX",
    coordYRefKey: "CPrimeY",
    x: 1,
    y: 4,
    color: TRANSLATION_GRAPH_COLORS.image,
    labelPlacement: "right",
    clickId: "graph-point-cprime",
    findStep: 12,
  },
  {
    key: "DPrime",
    boxKey: "D",
    labelRefKey: "DPrime",
    coordXRefKey: "DPrimeX",
    coordYRefKey: "DPrimeY",
    x: 1,
    y: 1,
    color: TRANSLATION_GRAPH_COLORS.image,
    labelPlacement: "right",
    clickId: "graph-point-dprime",
    findStep: 13,
  },
];

const RECT_OBJECT_POINTS = [
  {
    key: "A",
    labelRefKey: "A",
    x: 2,
    y: -1,
    color: TRANSLATION_GRAPH_COLORS.preimage,
    labelPlacement: "right",
  },
  {
    key: "B",
    labelRefKey: "B",
    x: 2,
    y: -4,
    color: TRANSLATION_GRAPH_COLORS.preimage,
    labelPlacement: "right",
  },
  {
    key: "C",
    labelRefKey: "C",
    x: -1,
    y: -4,
    color: TRANSLATION_GRAPH_COLORS.preimage,
    labelPlacement: "left",
  },
  {
    key: "D",
    labelRefKey: "D",
    x: -1,
    y: -1,
    color: TRANSLATION_GRAPH_COLORS.preimage,
    labelPlacement: "left",
  },
];

const RECT_FIND_CONFIG = {
  APrime: { objectKey: "A" },
  BPrime: { objectKey: "B" },
  CPrime: { objectKey: "C" },
  DPrime: { objectKey: "D" },
};

const RECT_IMAGE_VERTICES = [
  { x: -2, y: 1 },
  { x: -2, y: 4 },
  { x: 1, y: 4 },
  { x: 1, y: 1 },
];

const RECT_OBJECT_VERTICES = [
  { x: 2, y: -1 },
  { x: 2, y: -4 },
  { x: -1, y: -4 },
  { x: -1, y: -1 },
];

const buildClosedSegments = (vertices, color, opacity) => {
  const segs = [];
  for (let i = 0; i < vertices.length; i++) {
    segs.push({
      from: vertices[i],
      to: vertices[(i + 1) % vertices.length],
      color: color,
      opacity: opacity,
    });
  }
  return segs;
};

const restoreObjectPointsForStep = (step) => {
  if (step < 11) return {};
  const objStates = {};
  if (step >= 11) objStates.A = { circleOpacity: 1, labelVisible: true };
  if (step >= 12) objStates.B = { circleOpacity: 1, labelVisible: true };
  if (step >= 13) objStates.C = { circleOpacity: 1, labelVisible: true };
  if (step >= 14) objStates.D = { circleOpacity: 1, labelVisible: true };
  return objStates;
};

const RectMainCanvas = ({
  step,
  devStartStep = 0,
  step8Phase,
  onStep8PhaseChange,
  step9Phase,
  onStep9PhaseChange,
  step10Phase,
  onStep10PhaseChange,
  step11Phase,
  onStep11PhaseChange,
  step12Phase,
  onStep12PhaseChange,
  step13Phase,
  onStep13PhaseChange,
  step14Phase,
  onStep14PhaseChange,
  onQuestionVisualChange,
  onRectImageBoxChange,
  onRectObjectBoxChange,
  onStepAdvance,
}) => {
  const { useState, useEffect, useRef, useCallback, useMemo } = React;

  const labelRefs = useRef({});
  const coordRefs = useRef({});
  const ruleRefs = useRef({});
  const findAnimRef = useRef(false);
  const step8AnimRef = useRef(false);
  const step8InitRef = useRef(false);
  const findInitRef = useRef({});
  const step14InitRef = useRef(false);
  const rotationAnimRef = useRef(false);
  const mountSyncDoneRef = useRef(false);

  const [leftVisible, setLeftVisible] = useState(false);
  const [rightVisible, setRightVisible] = useState(false);
  const [flyClones, setFlyClones] = useState([]);
  const [pointStates, setPointStates] = useState({});
  const [objectPointStates, setObjectPointStates] = useState({});
  const [showImageRect, setShowImageRect] = useState(false);
  const [imageRectOpacity, setImageRectOpacity] = useState(0);
  const [showObjectRect, setShowObjectRect] = useState(false);
  const [objectRectOpacity, setObjectRectOpacity] = useState(0);
  const [ruleState, setRuleState] = useState(GENERIC_RULE_180);
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

  const setupImageGraph = useCallback(() => {
    setLeftVisible(true);
    setShowImageRect(true);
    setImageRectOpacity(1);
    const allPoints = {};
    RECT_IMAGE_POINTS.forEach((pt) => {
      allPoints[pt.key] = { circleOpacity: 1, labelVisible: true };
    });
    setPointStates(allPoints);
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

  const runFindAnimation = useCallback(
    async (primeKey) => {
      if (findAnimRef.current) return;
      findAnimRef.current = true;

      const cfg = RECT_FIND_CONFIG[primeKey];
      const imgCoord = APP_DATA.graph2.coords[primeKey];
      const objCoord = APP_DATA.graph2.coords[cfg.objectKey];
      const qv = APP_DATA.questionVisual2;

      if (typeof playSound === "function") playSound("click");

      setRuleState(GENERIC_RULE_180);
      await delay(50);

      await animateFly(
        coordRefs.current[primeKey + "X"],
        ruleRefs.current.imgNegX,
        { text: imgCoord.x, colorClass: "is-cyan" },
      );
      setRuleState((s) => ({ ...s, imgNegX: imgCoord.x }));
      await delay(150);

      await animateFly(
        coordRefs.current[primeKey + "Y"],
        ruleRefs.current.imgNegY,
        { text: imgCoord.y, colorClass: "is-cyan" },
      );
      setRuleState((s) => ({ ...s, imgNegY: imgCoord.y }));
      await delay(1000);

      await delay(50);

      await animateFly(
        ruleRefs.current.imgNegYNum,
        ruleRefs.current.objY,
        { text: objCoord.y, colorClass: "is-orange" },
      );
      setRuleState((s) => ({ ...s, objY: objCoord.y }));
      await delay(150);

      await delay(50);

      await animateFly(
        ruleRefs.current.imgNegXNum,
        ruleRefs.current.objX,
        { text: objCoord.x, colorClass: "is-orange" },
      );
      setRuleState((s) => ({ ...s, objX: objCoord.x }));
      await delay(1000);

      const objGroup = document.querySelector(".rule-object-group");
      const targetLabel = labelRefs.current[cfg.objectKey];

      setObjectPointStates((prev) => ({
        ...prev,
        [cfg.objectKey]: { circleOpacity: 0, labelVisible: false },
      }));
      await delay(100);

      if (objGroup && targetLabel) {
        await animateFly(objGroup, targetLabel, {
          text: APP_DATA.graph2.labels[cfg.objectKey],
          colorClass: "is-orange",
        });
      }

      await revealObjectPoint(cfg.objectKey);

      if (typeof onRectObjectBoxChange === "function") {
        onRectObjectBoxChange(cfg.objectKey, qv.objectFound[cfg.objectKey]);
      }

      await delay(400);
      findAnimRef.current = false;

      const phaseMap = {
        APrime: { phase: step10Phase, onChange: onStep10PhaseChange, next: 11 },
        BPrime: { phase: step11Phase, onChange: onStep11PhaseChange, next: 12 },
        CPrime: { phase: step12Phase, onChange: onStep12PhaseChange, next: 13 },
        DPrime: { phase: step13Phase, onChange: onStep13PhaseChange, next: 14 },
      };

      const info = phaseMap[primeKey];
      if (info && typeof info.onChange === "function") {
        info.onChange("done");
      }

      if (primeKey === "DPrime") {
        setShowObjectRect(true);
        setObjectRectOpacity(0);
        await delay(80);
        setObjectRectOpacity(1);
        await delay(400);
      }

      await delay(300);
      if (typeof onStepAdvance === "function") {
        onStepAdvance(info.next);
      }
    },
    [
      animateFly,
      revealObjectPoint,
      onRectObjectBoxChange,
      step10Phase,
      step11Phase,
      step12Phase,
      step13Phase,
      onStep10PhaseChange,
      onStep11PhaseChange,
      onStep12PhaseChange,
      onStep13PhaseChange,
      onStepAdvance,
    ],
  );

  const makePrimeClickHandler = useCallback(
    (primeKey, findStep, phase, onPhaseChange) => {
      return () => {
        if (step !== findStep || phase !== "waiting" || findAnimRef.current) {
          return;
        }
        if (typeof onPhaseChange === "function") {
          onPhaseChange("animating");
        }
        runFindAnimation(primeKey);
      };
    },
    [step, runFindAnimation],
  );

  const handleAPrimeClick = useMemo(
    () => makePrimeClickHandler("APrime", 10, step10Phase, onStep10PhaseChange),
    [makePrimeClickHandler, step10Phase, onStep10PhaseChange],
  );
  const handleBPrimeClick = useMemo(
    () => makePrimeClickHandler("BPrime", 11, step11Phase, onStep11PhaseChange),
    [makePrimeClickHandler, step11Phase, onStep11PhaseChange],
  );
  const handleCPrimeClick = useMemo(
    () => makePrimeClickHandler("CPrime", 12, step12Phase, onStep12PhaseChange),
    [makePrimeClickHandler, step12Phase, onStep12PhaseChange],
  );
  const handleDPrimeClick = useMemo(
    () => makePrimeClickHandler("DPrime", 13, step13Phase, onStep13PhaseChange),
    [makePrimeClickHandler, step13Phase, onStep13PhaseChange],
  );

  const primeClickHandlers = {
    APrime: handleAPrimeClick,
    BPrime: handleBPrimeClick,
    CPrime: handleCPrimeClick,
    DPrime: handleDPrimeClick,
  };

  const runRotationAnimation = useCallback(async () => {
    if (rotationAnimRef.current) return;
    rotationAnimRef.current = true;
    if (typeof playSound === "function") playSound("click");
    if (typeof onStep14PhaseChange === "function") {
      onStep14PhaseChange("rotating");
    }

    const clonePoints = RECT_OBJECT_POINTS.map((pt) => ({
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
      segments: buildClosedSegments(
        RECT_OBJECT_VERTICES,
        TRANSLATION_GRAPH_COLORS.preimage,
        1,
      ),
    });

    await delay(80);

    await new Promise((resolve) => {
      const duration = 1600;
      const startTime = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        setRotationOverlay((prev) =>
          prev ? { ...prev, angle: eased * 180 } : prev,
        );
        if (t < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });

    await delay(400);
    setRotationOverlay(null);
    rotationAnimRef.current = false;
    if (typeof onStep14PhaseChange === "function") {
      onStep14PhaseChange("done");
    }
  }, [onStep14PhaseChange]);

  useEffect(() => {
    if (mountSyncDoneRef.current) return;
    mountSyncDoneRef.current = true;

    if (devStartStep < 7) return;

    if (devStartStep > 8 || (devStartStep === 8 && step8Phase === "done")) {
      setupImageGraph();
      setQuestionVisual(true, true);
      step8InitRef.current = true;
      step8AnimRef.current = true;
    }

    const objStates = restoreObjectPointsForStep(devStartStep);
    if (Object.keys(objStates).length > 0) {
      setObjectPointStates(objStates);
    }

    if (devStartStep >= 14) {
      setShowObjectRect(true);
      setObjectRectOpacity(1);
    }

    if (devStartStep >= 9) {
      setRightVisible(true);
    }

    if (devStartStep >= 10) {
      setUseCoordParts(true);
      setRuleState(GENERIC_RULE_180);
    }

    if (devStartStep === 14) {
      step14InitRef.current = true;
      setRotatePanelContentVisible(true);
      if (typeof onStep14PhaseChange === "function") {
        onStep14PhaseChange("panelVisible");
      }
    }
  }, [
    devStartStep,
    step8Phase,
    setupImageGraph,
    setQuestionVisual,
    onStep14PhaseChange,
  ]);

  useEffect(() => {
    if (step !== 8 || step8Phase !== "initial" || step8AnimRef.current) {
      return;
    }
    step8AnimRef.current = true;

    const runStep8Anim = async () => {
      setupImageGraph();
      setQuestionVisual(true, false);
      await delay(80);
      setQuestionVisual(true, true);
      await delay(500);

      const qv = APP_DATA.questionVisual2;
      for (let i = 0; i < RECT_IMAGE_POINTS.length; i++) {
        const pt = RECT_IMAGE_POINTS[i];
        const sourceEl = labelRefs.current[pt.labelRefKey];
        const targetEl = document.getElementById(
          "qv-image-" + pt.boxKey.toLowerCase(),
        );
        const labelText = qv.image[pt.boxKey];
        await animateFly(sourceEl, targetEl, {
          text: labelText,
          colorClass: "is-cyan",
        });
        if (typeof onRectImageBoxChange === "function") {
          onRectImageBoxChange(pt.boxKey, labelText);
        }
        await delay(200);
      }

      await delay(300);
      qv.keys.forEach((key) => {
        if (typeof onRectObjectBoxChange === "function") {
          onRectObjectBoxChange(key, qv.objectUnknown[key]);
        }
      });

      await delay(400);
      if (typeof onStep8PhaseChange === "function") {
        onStep8PhaseChange("done");
      }
    };

    runStep8Anim();
  }, [
    step,
    step8Phase,
    setupImageGraph,
    setQuestionVisual,
    animateFly,
    onRectImageBoxChange,
    onRectObjectBoxChange,
    onStep8PhaseChange,
  ]);

  useEffect(() => {
    if (step === 7) {
      findAnimRef.current = false;
      step8AnimRef.current = false;
      step8InitRef.current = false;
      findInitRef.current = {};
      step14InitRef.current = false;
      rotationAnimRef.current = false;
      setLeftVisible(true);
      setRightVisible(false);
      setShowImageRect(true);
      setImageRectOpacity(1);
      setShowObjectRect(false);
      setObjectRectOpacity(0);
      setObjectPointStates({});
      setRuleState(GENERIC_RULE_180);
      setUseCoordParts(false);
      setRotationOverlay(null);
      setRotatePanelContentVisible(false);
      setQuestionVisual(false, false);
      const allPoints = {};
      RECT_IMAGE_POINTS.forEach((pt) => {
        allPoints[pt.key] = { circleOpacity: 1, labelVisible: true };
      });
      setPointStates(allPoints);
      return;
    }

    if (step === 8 && !step8InitRef.current) {
      step8InitRef.current = true;
      setRightVisible(false);
      setUseCoordParts(false);
      if (typeof onStep8PhaseChange === "function") {
        onStep8PhaseChange("initial");
      }
    }

    if (step === 9) {
      setupImageGraph();
      setQuestionVisual(true, true);
      setUseCoordParts(false);
      if (step9Phase === "initial") {
        setRightVisible(false);
        setTimeout(() => {
          setRightVisible(true);
          if (typeof onStep9PhaseChange === "function") {
            onStep9PhaseChange("entering");
          }
        }, 80);
      } else {
        setRightVisible(true);
      }
    }

    const initFindStep = (findStep, phaseKey) => {
      if (step !== findStep || findInitRef.current[findStep]) return;
      findInitRef.current[findStep] = true;
      setupImageGraph();
      setQuestionVisual(true, true);
      setRuleState(GENERIC_RULE_180);
      setUseCoordParts(true);
      setRightVisible(true);
      findAnimRef.current = false;
    };

    initFindStep(10, "step10");
    initFindStep(11, "step11");
    initFindStep(12, "step12");
    initFindStep(13, "step13");

    if (step === 14) {
      if (step14InitRef.current) return;
      step14InitRef.current = true;
      setupImageGraph();
      setQuestionVisual(true, true);
      setUseCoordParts(false);
      setRightVisible(true);
      setShowObjectRect(true);
      setObjectRectOpacity(1);
      const objStates = {};
      RECT_OBJECT_POINTS.forEach((pt) => {
        objStates[pt.key] = { circleOpacity: 1, labelVisible: true };
      });
      setObjectPointStates(objStates);
      setRotatePanelContentVisible(false);

      setTimeout(() => setRotatePanelContentVisible(true), 600);
      if (typeof onStep14PhaseChange === "function") {
        onStep14PhaseChange("panelVisible");
      }
    }
    if (step !== 14) {
      step14InitRef.current = false;
    }
  }, [
    step,
    step9Phase,
    onStep9PhaseChange,
    onStep8PhaseChange,
    onStep14PhaseChange,
    setupImageGraph,
    setQuestionVisual,
  ]);

  const graphPoints = useMemo(() => {
    const pts = RECT_IMAGE_POINTS.map((pt) => {
      const state = pointStates[pt.key];
      if (!state) return null;
      const clickable =
        step === pt.findStep &&
        ((pt.findStep === 10 && step10Phase === "waiting") ||
          (pt.findStep === 11 && step11Phase === "waiting") ||
          (pt.findStep === 12 && step12Phase === "waiting") ||
          (pt.findStep === 13 && step13Phase === "waiting"));

      return {
        id: pt.key,
        x: pt.x,
        y: pt.y,
        color: pt.color,
        label: APP_DATA.graph2.labels[pt.key],
        labelPrefix: pt.key.replace("Prime", "\u2019"),
        labelPlacement: pt.labelPlacement,
        circleOpacity: state.circleOpacity,
        labelOpacity: state.labelVisible ? 1 : 0,
        showLabel: true,
        labelRefKey: pt.labelRefKey,
        coordParts: useCoordParts ? APP_DATA.graph2.coords[pt.key] : null,
        coordXRefKey: pt.coordXRefKey,
        coordYRefKey: pt.coordYRefKey,
        clickable: clickable,
        showClickPulse: clickable,
        clickId: pt.clickId,
        onClick: primeClickHandlers[pt.key],
      };
    }).filter(Boolean);

    RECT_OBJECT_POINTS.forEach((pt) => {
      const state = objectPointStates[pt.key];
      if (!state) return;
      pts.push({
        id: pt.key,
        x: pt.x,
        y: pt.y,
        color: pt.color,
        label: APP_DATA.graph2.labels[pt.key],
        labelPrefix: pt.key,
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
    step10Phase,
    step11Phase,
    step12Phase,
    step13Phase,
    primeClickHandlers,
  ]);

  const graphSegments = useMemo(() => {
    const segs = [];
    if (showImageRect) {
      segs.push(
        ...buildClosedSegments(
          RECT_IMAGE_VERTICES,
          TRANSLATION_GRAPH_COLORS.image,
          imageRectOpacity,
        ),
      );
    }
    if (showObjectRect) {
      segs.push(
        ...buildClosedSegments(
          RECT_OBJECT_VERTICES,
          TRANSLATION_GRAPH_COLORS.preimage,
          objectRectOpacity,
        ),
      );
    }
    return segs;
  }, [showImageRect, imageRectOpacity, showObjectRect, objectRectOpacity]);

  const graphPolygons = useMemo(() => {
    const polys = [];
    if (showImageRect && step >= 7) {
      polys.push({
        vertices: RECT_IMAGE_VERTICES,
        color: TRANSLATION_GRAPH_COLORS.image,
        fillOpacity: 0.7,
        noStroke: true,
        opacity: imageRectOpacity,
      });
    }
    if (showObjectRect) {
      polys.push({
        vertices: RECT_OBJECT_VERTICES,
        color: TRANSLATION_GRAPH_COLORS.preimage,
        fillOpacity: 0.7,
        noStroke: true,
        opacity: objectRectOpacity,
      });
    }
    return polys;
  }, [
    showImageRect,
    imageRectOpacity,
    showObjectRect,
    objectRectOpacity,
    step,
  ]);

  const showRuleResult = step >= 10 && step <= 13;
  const showRotatePanel = step === 14;

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
    if (step === 9) {
      return React.createElement(RuleDndPanel, {
        phase: step9Phase,
        dndConfig: APP_DATA.dnd2,
        rulePanelConfig: APP_DATA.rulePanel2,
        onComplete: () => {
          if (typeof onStep9PhaseChange === "function") {
            onStep9PhaseChange("complete");
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
          variant: "180",
        }),
      );
    }
    if (showRotatePanel) {
      return React.createElement(RotatePanel, {
        visible: true,
        contentVisible: rotatePanelContentVisible,
        onRotate: runRotationAnimation,
        disabled: step14Phase === "rotating" || step14Phase === "done",
        panelConfig: APP_DATA.rotatePanel2,
        ruleVariant: "180",
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
            "main-canvas-left" + (leftVisible ? " is-visible" : ""),
        },
        React.createElement(TranslationGraphPanel, {
          points: graphPoints,
          segments: graphSegments,
          polygons: graphPolygons,
          labelRefs: labelRefs,
          coordRefs: coordRefs,
          rotationOverlay: rotationOverlay,
        }),
      ),
      React.createElement(
        "div",
        {
          className:
            "main-canvas-right" +
            (rightVisible && step >= 9 ? " is-visible" : ""),
        },
        renderRightPanel(),
      ),
    ),
    flyCloneEls,
  );
};
