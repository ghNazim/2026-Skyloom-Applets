const TRIANGLE_ABC_KEYS = ["A", "B", "C"];
const TRIANGLE_QR_KEYS = ["Q", "R"];
const UNKNOWN_PATH = [
  { x: -4, y: -4 },
  { x: -3, y: -4 },
  { x: -4, y: 4 },
  { x: -5, y: 4 },
  { x: -5, y: -4 },
];

const POINT_DEFS = {
  A: {
    sourceId: "source-a",
    colorKey: "object",
    placement: "right",
  },
  B: {
    sourceId: "source-b",
    colorKey: "object",
    placement: "left",
  },
  C: {
    sourceId: "source-c",
    colorKey: "object",
    placement: "above",
  },
  Q: {
    sourceId: "source-q",
    colorKey: "image",
    placement: "above",
  },
  R: {
    sourceId: "source-r",
    colorKey: "image",
    placement: "right",
  },
};

function getOutwardSideLabelPositions(A, B, C, amount) {
  const mid = (p, q) => ({ x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 });
  const centroid = {
    x: (A.x + B.x + C.x) / 3,
    y: (A.y + B.y + C.y) / 3,
  };
  const outward = (point) => {
    const dx = point.x - centroid.x;
    const dy = point.y - centroid.y;
    const len = Math.hypot(dx, dy) || 1;
    return {
      x: point.x + (dx / len) * amount,
      y: point.y + (dy / len) * amount,
    };
  };
  return {
    ab: outward(mid(A, B)),
    bc: outward(mid(B, C)),
    ac: outward(mid(A, C)),
  };
}

function formatPointCoord(n) {
  const rounded = Math.round(n * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

function formatPLabel(point) {
  return (
    "P(" + formatPointCoord(point.x) + ", " + formatPointCoord(point.y) + ")"
  );
}

function reflectPointAcrossLine(point, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy || 1;
  const t = ((point.x - a.x) * dx + (point.y - a.y) * dy) / len2;
  const projX = a.x + t * dx;
  const projY = a.y + t * dy;
  return {
    x: 2 * projX - point.x,
    y: 2 * projY - point.y,
  };
}

function projectPointOnLine(point, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy || 1;
  const t = ((point.x - a.x) * dx + (point.y - a.y) * dy) / len2;
  return { x: a.x + t * dx, y: a.y + t * dy };
}

function lerpPoint(a, b, t) {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  };
}

function flipPointAcrossLine(from, to, lineA, lineB, t) {
  const mid = projectPointOnLine(from, lineA, lineB);
  if (t <= 0.5) return lerpPoint(from, mid, t * 2);
  return lerpPoint(mid, to, (t - 0.5) * 2);
}

const SIDE_LENGTH_CONFIG = {
  QR: {
    sideKey: "QR",
    label: () => APP_DATA.math.qr,
    hotspotId: "qr-hotspot",
    hotspot: { x: -3, y: 0 },
    graphLabel: { x: -2.45, y: 0.7, refKey: "QRRoot" },
    pointRefs: { x2: "QX", x1: "RX", y2: "QY", y1: "RY" },
    expandedTerms: () => APP_DATA.math.expandedTerms,
    simplifiedDisplay: () => "[(2)² + (-2)²]",
    rootValue: () => APP_DATA.math.rootEight,
  },
  AB: {
    sideKey: "AB",
    label: () => APP_DATA.math.ab,
    hotspotId: "ab-hotspot",
    hotspot: { x: 2, y: 1.5 },
    graphLabel: { x: 2.2, y: 0.86, refKey: "ABRoot" },
    pointRefs: { x2: "AX", x1: "BX", y2: "AY", y1: "BY" },
    expandedTerms: () => APP_DATA.math.sideCalcs.AB.expandedTerms,
    simplifiedDisplay: () => APP_DATA.math.sideCalcs.AB.simplifiedDisplay,
    rootValue: () => APP_DATA.math.sideCalcs.AB.rootValue,
  },
  BC: {
    sideKey: "BC",
    label: () => APP_DATA.math.bc,
    hotspotId: "bc-hotspot",
    hotspot: { x: 1, y: 3 },
    graphLabel: { x: 0.55, y: 3.35, refKey: "BCRoot" },
    pointRefs: { x2: "CX", x1: "BX", y2: "CY", y1: "BY" },
    expandedTerms: () => APP_DATA.math.sideCalcs.BC.expandedTerms,
    simplifiedDisplay: () => APP_DATA.math.sideCalcs.BC.simplifiedDisplay,
    rootValue: () => APP_DATA.math.sideCalcs.BC.rootValue,
  },
  AC: {
    sideKey: "AC",
    label: () => APP_DATA.math.ac,
    hotspotId: "ac-hotspot",
    hotspot: { x: 3, y: 2.5 },
    graphLabel: { x: 3.25, y: 2.85, refKey: "ACRoot" },
    pointRefs: { x2: "AX", x1: "CX", y2: "AY", y1: "CY" },
    expandedTerms: () => APP_DATA.math.sideCalcs.AC.expandedTerms,
    simplifiedDisplay: () => APP_DATA.math.sideCalcs.AC.simplifiedDisplay,
    rootValue: () => APP_DATA.math.sideCalcs.AC.rootValue,
  },
};

const MainCanvas = ({
  step,
  step2Phase,
  onStep2PhaseChange,
  step3Phase,
  onStep3PhaseChange,
  step4Phase,
  onStep4PhaseChange,
  step5Phase,
  onStep5PhaseChange,
  step6Phase,
  onStep6PhaseChange,
  step7Phase,
  onStep7PhaseChange,
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
}) => {
  const { useCallback, useEffect, useMemo, useRef, useState } = React;

  const colors = APP_DATA.colors;
  const graph = APP_DATA.graph;
  const labelRefs = useRef({});
  const coordRefs = useRef({});
  const formulaRefs = useRef({});
  const eqRefs = useRef({});
  const step11ResultRefs = useRef({});
  const yellowValueRefs = useRef({});
  const cancelledRef = useRef(false);
  const step7BusyRef = useRef(false);
  const step8AnimRef = useRef(false);
  const step9WrongTimerRef = useRef(null);
  const pqrExitTweenRef = useRef(null);
  const reflectTweenRef = useRef(null);
  const step12BusyRef = useRef(false);
  const step13BusyRef = useRef(false);

  const [flyClones, setFlyClones] = useState([]);
  const [visiblePointKeys, setVisiblePointKeys] = useState([]);
  const [pointRevealState, setPointRevealState] = useState({});
  const [showAbcTriangle, setShowAbcTriangle] = useState(false);
  const [showQrSegment, setShowQrSegment] = useState(false);
  const [showUnknownPoint, setShowUnknownPoint] = useState(false);
  const [showUnknownLabel, setShowUnknownLabel] = useState(false);
  const [showQuestionMark, setShowQuestionMark] = useState(false);
  const [unknownCoord, setUnknownCoord] = useState(graph.coords.PStart);
  const [formulaSlots, setFormulaSlots] = useState({});
  const [visibleLengthLabels, setVisibleLengthLabels] = useState({
    QR: false,
    AB: false,
    BC: false,
    AC: false,
  });
  const [wrongHotspot, setWrongHotspot] = useState(null);
  const [step7ShowResult, setStep7ShowResult] = useState(false);
  const [step7Reveal, setStep7Reveal] = useState(false);
  const [step7PromptVisible, setStep7PromptVisible] = useState(true);
  const [sideClone, setSideClone] = useState(null);
  const [rotationDirection, setRotationDirection] = useState(null);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [showRotationClone, setShowRotationClone] = useState(false);
  const [sliderWrong, setSliderWrong] = useState(false);
  const [rotationLocked, setRotationLocked] = useState(false);
  const [translationVector, setTranslationVector] = useState({ x: 0, y: 0 });
  const [translateLocked, setTranslateLocked] = useState(false);
  const [showPqr1, setShowPqr1] = useState(false);
  const [pqr1Coords, setPqr1Coords] = useState(null);
  const [originalPqrFadeOpacity, setOriginalPqrFadeOpacity] = useState(0);
  const [showPqr2, setShowPqr2] = useState(false);
  const [pqr2Coords, setPqr2Coords] = useState(null);
  const [reflectProgress, setReflectProgress] = useState(0);
  const [step11ResultOpacity, setStep11ResultOpacity] = useState(0);
  const [step11ShowResult, setStep11ShowResult] = useState(false);
  const [yellowRootsVisible, setYellowRootsVisible] = useState(false);
  const [yellowRootsSwapped, setYellowRootsSwapped] = useState(false);
  const [yellowBelowVisible, setYellowBelowVisible] = useState(false);
  const [yellowBelowOpacity, setYellowBelowOpacity] = useState(0);
  const [yellowBoxVisible, setYellowBoxVisible] = useState(false);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const isCancelled = () => cancelledRef.current;

  useEffect(() => {
    cancelledRef.current = false;
    return () => {
      cancelledRef.current = true;
    };
  }, []);

  const setPhase = useCallback((setter, value) => {
    if (typeof setter === "function") setter(value);
  }, []);

  const getStep6CurrentSide = useCallback((phase) => {
    if (phase.indexOf("ab") === 0) return "AB";
    if (phase.indexOf("bc") === 0) return "BC";
    if (phase.indexOf("ac") === 0) return "AC";
    return null;
  }, []);

  const getVisibleLengthState = useCallback(
    (currentStep, qrPhase, abcPhase) => {
      const next = { QR: false, AB: false, BC: false, AC: false };
      if (currentStep >= 5 && qrPhase === "done") next.QR = true;
      if (currentStep === 6 || currentStep >= 7) {
        next.QR = true;
        if (
          abcPhase === "bcWaiting" ||
          abcPhase === "bcFilling" ||
          abcPhase === "bcExpanded" ||
          abcPhase === "bcSimplified" ||
          abcPhase === "bcRootAnimating" ||
          abcPhase === "acWaiting" ||
          abcPhase === "acFilling" ||
          abcPhase === "acExpanded" ||
          abcPhase === "acSimplified" ||
          abcPhase === "acRootAnimating" ||
          abcPhase === "done"
        ) {
          next.AB = true;
        }
        if (
          abcPhase === "acWaiting" ||
          abcPhase === "acFilling" ||
          abcPhase === "acExpanded" ||
          abcPhase === "acSimplified" ||
          abcPhase === "acRootAnimating" ||
          abcPhase === "done"
        ) {
          next.BC = true;
        }
        if (abcPhase === "done" || currentStep >= 7) {
          next.AC = true;
        }
      }
      return next;
    },
    [],
  );

  const animateFly = useCallback((sourceEl, targetEl, options = {}) => {
    return new Promise((resolve) => {
      if (!sourceEl || !targetEl) {
        resolve();
        return;
      }

      const id = "fly-" + Date.now() + "-" + Math.random();
      const src = sourceEl.getBoundingClientRect();
      const tgt = targetEl.getBoundingClientRect();
      const startX = src.left + src.width / 2;
      const startY = src.top + src.height / 2;
      const dx = tgt.left + tgt.width / 2 - startX;
      const dy = tgt.top + tgt.height / 2 - startY;
      const endScale = options.scale != null ? options.scale : 1;
      const fontSize = options.fontSize || null;

      setFlyClones((prev) =>
        prev.concat([
          {
            id: id,
            text: options.text || sourceEl.textContent.trim(),
            rootValue: options.rootValue || null,
            startX: startX,
            startY: startY,
            dx: dx,
            dy: dy,
            animating: false,
            className: options.className || "",
            endScale: endScale,
            fontSize: fontSize,
          },
        ]),
      );

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFlyClones((prev) =>
            prev.map((clone) =>
              clone.id === id ? { ...clone, animating: true } : clone,
            ),
          );
        });
      });

      setTimeout(() => {
        setFlyClones((prev) => prev.filter((clone) => clone.id !== id));
        resolve();
      }, 760);
    });
  }, []);

  const preparePoint = useCallback(
    async (key) => {
      setVisiblePointKeys((prev) =>
        prev.indexOf(key) === -1 ? prev.concat([key]) : prev,
      );
      setPointRevealState((prev) => ({
        ...prev,
        [key]: { circleOpacity: 0, labelOpacity: 0 },
      }));
      await delay(40);
    },
    [],
  );

  const finishRevealPoint = useCallback(
    async (key) => {
      setPointRevealState((prev) => ({
        ...prev,
        [key]: { circleOpacity: 1, labelOpacity: 1 },
      }));
      await delay(300);
    },
    [],
  );

  const revealUnknown = useCallback(async (showLabel) => {
    setShowUnknownPoint(true);
    setShowUnknownLabel(showLabel);
    setPointRevealState((prev) => ({
      ...prev,
      P: { circleOpacity: 0, labelOpacity: showLabel ? 0 : 0 },
    }));
    await delay(40);
    setPointRevealState((prev) => ({
      ...prev,
      P: { circleOpacity: 1, labelOpacity: showLabel ? 1 : 0 },
    }));
    await delay(300);
  }, []);

  const buildCompletedGraph = useCallback(() => {
    setVisiblePointKeys(["A", "B", "C", "Q", "R"]);
    setPointRevealState({
      A: { circleOpacity: 1, labelOpacity: 1 },
      B: { circleOpacity: 1, labelOpacity: 1 },
      C: { circleOpacity: 1, labelOpacity: 1 },
      Q: { circleOpacity: 1, labelOpacity: 1 },
      R: { circleOpacity: 1, labelOpacity: 1 },
      P: { circleOpacity: 1, labelOpacity: 1 },
    });
    setShowAbcTriangle(true);
    setShowQrSegment(true);
    setShowUnknownPoint(true);
    setShowUnknownLabel(true);
    setShowQuestionMark(true);
    setUnknownCoord(graph.coords.PStart);
  }, [graph.coords.PStart]);

  const buildAbcGraph = useCallback(() => {
    setVisiblePointKeys(["A", "B", "C"]);
    setPointRevealState({
      A: { circleOpacity: 1, labelOpacity: 1 },
      B: { circleOpacity: 1, labelOpacity: 1 },
      C: { circleOpacity: 1, labelOpacity: 1 },
    });
    setShowAbcTriangle(true);
    setShowQrSegment(false);
    setShowUnknownPoint(false);
    setShowUnknownLabel(false);
    setShowQuestionMark(false);
    setUnknownCoord(graph.coords.PStart);
  }, [graph.coords.PStart]);

  const buildQrGraph = useCallback(() => {
    setVisiblePointKeys(["A", "B", "C", "Q", "R"]);
    setPointRevealState({
      A: { circleOpacity: 1, labelOpacity: 1 },
      B: { circleOpacity: 1, labelOpacity: 1 },
      C: { circleOpacity: 1, labelOpacity: 1 },
      Q: { circleOpacity: 1, labelOpacity: 1 },
      R: { circleOpacity: 1, labelOpacity: 1 },
      P: { circleOpacity: 1, labelOpacity: 0 },
    });
    setShowAbcTriangle(true);
    setShowQrSegment(true);
    setShowUnknownPoint(true);
    setShowUnknownLabel(false);
    setShowQuestionMark(false);
    setUnknownCoord(graph.coords.PStart);
  }, [graph.coords.PStart]);

  const runStep2 = useCallback(async () => {
    setPhase(onStep2PhaseChange, "animating");
    await delay(500);
    if (isCancelled()) return;

    for (let i = 0; i < TRIANGLE_ABC_KEYS.length; i++) {
      const key = TRIANGLE_ABC_KEYS[i];
      await preparePoint(key);
      if (isCancelled()) return;
      await animateFly(
        document.getElementById(POINT_DEFS[key].sourceId),
        labelRefs.current[key],
        { className: "is-orange" },
      );
      if (isCancelled()) return;
      await finishRevealPoint(key);
      await delay(140);
    }

    setShowAbcTriangle(true);
    await delay(420);
    if (!isCancelled()) setPhase(onStep2PhaseChange, "done");
  }, [
    animateFly,
    preparePoint,
    finishRevealPoint,
    setPhase,
    onStep2PhaseChange,
  ]);

  const runStep3 = useCallback(async () => {
    setPhase(onStep3PhaseChange, "animating");
    await delay(500);
    if (isCancelled()) return;

    for (let i = 0; i < TRIANGLE_QR_KEYS.length; i++) {
      const key = TRIANGLE_QR_KEYS[i];
      await preparePoint(key);
      if (isCancelled()) return;
      await animateFly(
        document.getElementById(POINT_DEFS[key].sourceId),
        labelRefs.current[key],
        { className: "is-cyan" },
      );
      if (isCancelled()) return;
      await finishRevealPoint(key);
      await delay(140);
    }

    setShowQrSegment(true);
    await delay(280);
    await revealUnknown(false);
    if (isCancelled()) return;
    await delay(420);
    if (!isCancelled()) setPhase(onStep3PhaseChange, "done");
  }, [
    animateFly,
    preparePoint,
    finishRevealPoint,
    revealUnknown,
    setPhase,
    onStep3PhaseChange,
  ]);

  const runStep4 = useCallback(async () => {
    setPhase(onStep4PhaseChange, "animating");
    await delay(500);
    if (isCancelled()) return;

    setShowUnknownLabel(true);
    setPointRevealState((prev) => ({
      ...prev,
      P: { circleOpacity: 1, labelOpacity: 0 },
    }));
    await delay(50);
    await animateFly(document.getElementById("source-p"), labelRefs.current.P, {
      text: "P",
      className: "is-purple",
    });
    if (isCancelled()) return;

    setPointRevealState((prev) => ({
      ...prev,
      P: { circleOpacity: 1, labelOpacity: 1 },
    }));
    setShowQuestionMark(true);
    await delay(360);

    let current = graph.coords.PStart;
    for (let i = 0; i < UNKNOWN_PATH.length; i++) {
      await new Promise((resolve) => {
        const start = { ...current };
        const target = UNKNOWN_PATH[i];
        const duration = 500;
        const startedAt = performance.now();

        const tick = (now) => {
          const t = Math.min(1, (now - startedAt) / duration);
          const eased =
            t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          setUnknownCoord({
            x: start.x + (target.x - start.x) * eased,
            y: start.y + (target.y - start.y) * eased,
          });
          if (t < 1) requestAnimationFrame(tick);
          else resolve();
        };

        requestAnimationFrame(tick);
      });
      current = UNKNOWN_PATH[i];
      if (isCancelled()) return;
      await delay(300);
    }

    if (!isCancelled()) setPhase(onStep4PhaseChange, "done");
  }, [animateFly, graph.coords.PStart, setPhase, onStep4PhaseChange]);

  const runQrCalculation = useCallback(async () => {
    setPhase(onStep5PhaseChange, "qrFilling");
    setFormulaSlots({});
    await delay(260);
    if (isCancelled()) return;

    const qrConfig = SIDE_LENGTH_CONFIG.QR;
    const fillSteps = [
      {
        source: coordRefs.current[qrConfig.pointRefs.x2],
        target: formulaRefs.current.x2,
        key: "x2",
        value: qrConfig.expandedTerms().x2,
        className: "is-cyan",
      },
      {
        source: coordRefs.current[qrConfig.pointRefs.x1],
        target: formulaRefs.current.x1,
        key: "x1",
        value: qrConfig.expandedTerms().x1,
        className: "is-cyan",
      },
      {
        source: coordRefs.current[qrConfig.pointRefs.y2],
        target: formulaRefs.current.y2,
        key: "y2",
        value: qrConfig.expandedTerms().y2,
        className: "is-cyan",
      },
      {
        source: coordRefs.current[qrConfig.pointRefs.y1],
        target: formulaRefs.current.y1,
        key: "y1",
        value: qrConfig.expandedTerms().y1,
        className: "is-cyan",
      },
    ];

    for (let i = 0; i < fillSteps.length; i++) {
      const part = fillSteps[i];
      await animateFly(part.source, part.target, {
        text: part.value,
        className: part.className,
      });
      if (isCancelled()) return;
      setFormulaSlots((prev) => ({ ...prev, [part.key]: part.value }));
      await delay(180);
    }

    if (!isCancelled()) setPhase(onStep5PhaseChange, "expanded");
  }, [animateFly, setPhase, onStep5PhaseChange]);

  const finishRootCalculation = useCallback(async () => {
    setPhase(onStep5PhaseChange, "rootAnimating");
    await delay(450);
    if (isCancelled()) return;
    if (typeof playSound === "function") playSound("congrats");
    await animateFly(formulaRefs.current.rootResult, labelRefs.current.QRRoot, {
      rootValue: SIDE_LENGTH_CONFIG.QR.rootValue(),
      className: "is-white is-math-root",
    });
    if (isCancelled()) return;
    setVisibleLengthLabels((prev) => ({ ...prev, QR: true }));
    await delay(220);
    if (!isCancelled()) setPhase(onStep5PhaseChange, "done");
  }, [animateFly, setPhase, onStep5PhaseChange]);

  const runStep6SideCalculation = useCallback(
    async (sideKey, fillingPhase, expandedPhase) => {
      const sideConfig = SIDE_LENGTH_CONFIG[sideKey];
      const expandedTerms = sideConfig.expandedTerms();
      setPhase(onStep6PhaseChange, fillingPhase);
      setFormulaSlots({});
      await delay(260);
      if (isCancelled()) return;

      const fillSteps = [
        {
          source: coordRefs.current[sideConfig.pointRefs.x2],
          target: formulaRefs.current.x2,
          key: "x2",
          value: expandedTerms.x2,
          className: "is-orange",
        },
        {
          source: coordRefs.current[sideConfig.pointRefs.x1],
          target: formulaRefs.current.x1,
          key: "x1",
          value: expandedTerms.x1,
          className: "is-orange",
        },
        {
          source: coordRefs.current[sideConfig.pointRefs.y2],
          target: formulaRefs.current.y2,
          key: "y2",
          value: expandedTerms.y2,
          className: "is-orange",
        },
        {
          source: coordRefs.current[sideConfig.pointRefs.y1],
          target: formulaRefs.current.y1,
          key: "y1",
          value: expandedTerms.y1,
          className: "is-orange",
        },
      ];

      for (let i = 0; i < fillSteps.length; i++) {
        const part = fillSteps[i];
        await animateFly(part.source, part.target, {
          text: part.value,
          className: part.className,
        });
        if (isCancelled()) return;
        setFormulaSlots((prev) => ({ ...prev, [part.key]: part.value }));
        await delay(180);
      }

      if (!isCancelled()) setPhase(onStep6PhaseChange, expandedPhase);
    },
    [animateFly, setPhase, onStep6PhaseChange],
  );

  const finishStep6SideCalculation = useCallback(
    async (sideKey, animPhase, nextPhase) => {
      const sideConfig = SIDE_LENGTH_CONFIG[sideKey];
      setPhase(onStep6PhaseChange, animPhase);
      await delay(450);
      if (isCancelled()) return;
      if (typeof playSound === "function") playSound("congrats");
      await animateFly(
        formulaRefs.current.rootResult,
        labelRefs.current[sideConfig.graphLabel.refKey],
        {
          rootValue: sideConfig.rootValue(),
          className: "is-white is-math-root",
        },
      );
      if (isCancelled()) return;
      setVisibleLengthLabels((prev) => ({ ...prev, [sideKey]: true }));
      await delay(nextPhase === "done" ? 220 : 700);
      if (!isCancelled()) setPhase(onStep6PhaseChange, nextPhase);
    },
    [animateFly, setPhase, onStep6PhaseChange],
  );

  useEffect(() => {
    if (step === 1) {
      setVisiblePointKeys([]);
      setPointRevealState({});
      setShowAbcTriangle(false);
      setShowQrSegment(false);
      setShowUnknownPoint(false);
      setShowUnknownLabel(false);
      setShowQuestionMark(false);
      setUnknownCoord(graph.coords.PStart);
      setFormulaSlots({});
      setVisibleLengthLabels({ QR: false, AB: false, BC: false, AC: false });
    }

    if (step === 2 && step2Phase === "done") {
      buildAbcGraph();
    }

    if (step === 3 && step3Phase === "done") {
      buildQrGraph();
    }

    if (step === 4 && step4Phase === "done") {
      buildCompletedGraph();
    }

    if (step === 5) {
      buildCompletedGraph();
      setVisibleLengthLabels(getVisibleLengthState(step, step5Phase, step6Phase));
    }

    if (step === 6 || step >= 7) {
      buildCompletedGraph();
      setVisibleLengthLabels(getVisibleLengthState(step, step5Phase, step6Phase));
    }
  }, [
    step,
    step2Phase,
    step3Phase,
    step4Phase,
    step5Phase,
    step6Phase,
    buildAbcGraph,
    buildQrGraph,
    buildCompletedGraph,
    getVisibleLengthState,
  ]);

  useEffect(() => {
    if (step === 2 && step2Phase === "initial") runStep2();
  }, [step, step2Phase, runStep2]);

  useEffect(() => {
    if (step === 3 && step3Phase === "initial") {
      buildAbcGraph();
      runStep3();
    }
  }, [step, step3Phase, buildAbcGraph, runStep3]);

  useEffect(() => {
    if (step === 4 && step4Phase === "initial") {
      buildQrGraph();
      setUnknownCoord(graph.coords.PStart);
      runStep4();
    }
  }, [step, step4Phase, buildQrGraph, graph.coords.PStart, runStep4]);

  useEffect(() => {
    if (step === 5 && step5Phase === "formula") {
      setFormulaSlots({});
      setVisibleLengthLabels((prev) => ({ ...prev, QR: false }));
    }
  }, [step, step5Phase]);

  useEffect(() => {
    if (step === 5 && step5Phase === "done") {
      setVisibleLengthLabels((prev) => ({ ...prev, QR: true }));
    }
  }, [step, step5Phase]);

  useEffect(() => {
    if (
      step === 6 &&
      (step6Phase === "abWaiting" ||
        step6Phase === "bcWaiting" ||
        step6Phase === "acWaiting")
    ) {
      setFormulaSlots({});
    }
  }, [step, step6Phase]);

  const handleFindSideLengths = () => {
    if (step5Phase !== "intro") return;
    if (typeof playSound === "function") playSound("click");
    setPhase(onStep5PhaseChange, "formula");
  };

  const handleQrHotspot = () => {
    if (step5Phase !== "formula") return;
    if (typeof playSound === "function") playSound("click");
    runQrCalculation();
  };

  const handleCalcBoxClick = () => {
    if (step5Phase === "expanded") {
      if (typeof playSound === "function") playSound("click");
      setPhase(onStep5PhaseChange, "simplified");
    }
    if (step5Phase === "simplified") {
      if (typeof playSound === "function") playSound("click");
      finishRootCalculation();
    }
    if (step6Phase === "abExpanded") {
      if (typeof playSound === "function") playSound("click");
      setPhase(onStep6PhaseChange, "abSimplified");
    }
    if (step6Phase === "abSimplified") {
      if (typeof playSound === "function") playSound("click");
      finishStep6SideCalculation("AB", "abRootAnimating", "bcWaiting");
    }
    if (step6Phase === "bcExpanded") {
      if (typeof playSound === "function") playSound("click");
      setPhase(onStep6PhaseChange, "bcSimplified");
    }
    if (step6Phase === "bcSimplified") {
      if (typeof playSound === "function") playSound("click");
      finishStep6SideCalculation("BC", "bcRootAnimating", "acWaiting");
    }
    if (step6Phase === "acExpanded") {
      if (typeof playSound === "function") playSound("click");
      setPhase(onStep6PhaseChange, "acSimplified");
    }
    if (step6Phase === "acSimplified") {
      if (typeof playSound === "function") playSound("click");
      finishStep6SideCalculation("AC", "acRootAnimating", "done");
    }
  };

  const handleStep6Hotspot = useCallback(
    (sideKey) => {
      if (typeof playSound === "function") playSound("click");
      if (sideKey === "AB" && step6Phase === "abWaiting") {
        runStep6SideCalculation("AB", "abFilling", "abExpanded");
      }
      if (sideKey === "BC" && step6Phase === "bcWaiting") {
        runStep6SideCalculation("BC", "bcFilling", "bcExpanded");
      }
      if (sideKey === "AC" && step6Phase === "acWaiting") {
        runStep6SideCalculation("AC", "acFilling", "acExpanded");
      }
    },
    [runStep6SideCalculation, step6Phase],
  );

  const runStep7Wrong = useCallback(async (sideKey) => {
    if (step7BusyRef.current) return;
    step7BusyRef.current = true;
    if (typeof playSound === "function") playSound("wrong");
    setWrongHotspot(sideKey);
    await delay(500);
    if (!isCancelled()) setWrongHotspot(null);
    step7BusyRef.current = false;
  }, []);

  const runStep7Correct = useCallback(async () => {
    if (step7BusyRef.current) return;
    step7BusyRef.current = true;
    if (typeof playSound === "function") playSound("correct");
    setPhase(onStep7PhaseChange, "flying");
    setStep7PromptVisible(false);
    await delay(360);
    if (isCancelled()) return;

    setStep7ShowResult(true);
    setStep7Reveal(false);
    await delay(40);
    if (isCancelled()) return;

    for (let i = 0; i < 12 && !eqRefs.current.Q; i++) {
      await delay(30);
      if (isCancelled()) return;
    }

    await Promise.all([
      animateFly(labelRefs.current.Q, eqRefs.current.Q, {
        text: "Q",
        className: "is-cyan",
        scale: 1.5,
      }),
      animateFly(labelRefs.current.R, eqRefs.current.R, {
        text: "R",
        className: "is-cyan",
        scale: 1.5,
      }),
      animateFly(labelRefs.current.B, eqRefs.current.B, {
        text: "B",
        className: "is-orange",
        scale: 1.5,
      }),
      animateFly(labelRefs.current.C, eqRefs.current.C, {
        text: "C",
        className: "is-orange",
        scale: 1.5,
      }),
    ]);
    if (isCancelled()) return;

    setStep7Reveal(true);
    await delay(120);
    if (!isCancelled()) setPhase(onStep7PhaseChange, "done");
    step7BusyRef.current = false;
  }, [animateFly, setPhase, onStep7PhaseChange]);

  const handleStep7Hotspot = useCallback(
    (sideKey) => {
      if (step !== 7 || step7Phase !== "waiting" || step7BusyRef.current) {
        return;
      }
      if (sideKey === "BC") {
        runStep7Correct();
        return;
      }
      runStep7Wrong(sideKey);
    },
    [step, step7Phase, runStep7Correct, runStep7Wrong],
  );

  useEffect(() => {
    if (step !== 7) return;
    setWrongHotspot(null);
    if (step7Phase === "done") {
      step7BusyRef.current = false;
      setStep7ShowResult(true);
      setStep7Reveal(true);
      setStep7PromptVisible(false);
    } else if (step7Phase === "waiting") {
      step7BusyRef.current = false;
      setStep7ShowResult(false);
      setStep7Reveal(false);
      setStep7PromptVisible(true);
    }
  }, [step, step7Phase]);

  const rotatePoint = useCallback((point, mid, angle, tx, ty) => {
    const dx = point.x - mid.x;
    const dy = point.y - mid.y;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: mid.x + dx * cos - dy * sin + tx,
      y: mid.y + dx * sin + dy * cos + ty,
    };
  }, []);

  const runStep8BcFly = useCallback(async () => {
    if (step8AnimRef.current) return;
    step8AnimRef.current = true;
    setPhase(onStep8PhaseChange, "animating");
    await delay(450);
    if (isCancelled()) return;

    const B = graph.coords.B;
    const C = graph.coords.C;
    const Q = graph.coords.Q;
    const mid = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2 };
    // 90° clockwise in graph space maps BC onto QR (B→Q, C→R).
    const endAngle = -Math.PI / 2;
    const bRotated = rotatePoint(B, mid, endAngle, 0, 0);
    const endT = { x: Q.x - bRotated.x, y: Q.y - bRotated.y };

    setSideClone({
      from: { x: B.x, y: B.y },
      to: { x: C.x, y: C.y },
      color: colors.object,
      strokeWidth: 5,
      opacity: 1,
    });
    await delay(80);
    if (isCancelled()) return;

    await new Promise((resolve) => {
      const duration = 1100;
      const start = performance.now();
      const tick = (now) => {
        if (isCancelled()) {
          resolve();
          return;
        }
        const raw = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - raw, 3);
        const angle = endAngle * eased;
        const tx = endT.x * eased;
        const ty = endT.y * eased;
        setSideClone({
          from: rotatePoint(B, mid, angle, tx, ty),
          to: rotatePoint(C, mid, angle, tx, ty),
          color: colors.object,
          strokeWidth: 5,
          opacity: 1,
        });
        if (raw < 1) {
          requestAnimationFrame(tick);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(tick);
    });
    if (isCancelled()) return;

    await delay(180);
    if (isCancelled()) return;
    setSideClone(null);
    if (typeof playSound === "function") playSound("placed");
    await delay(200);
    if (!isCancelled()) setPhase(onStep8PhaseChange, "done");
  }, [
    graph.coords.B,
    graph.coords.C,
    graph.coords.Q,
    colors.object,
    rotatePoint,
    setPhase,
    onStep8PhaseChange,
  ]);

  useEffect(() => {
    if (step !== 8) {
      step8AnimRef.current = false;
      setSideClone(null);
      return;
    }
    if (step8Phase === "done") {
      step8AnimRef.current = true;
      setSideClone(null);
      return;
    }
    if (step8Phase === "initial" && !step8AnimRef.current) {
      runStep8BcFly();
    }
  }, [step, step8Phase, runStep8BcFly]);

  const snapDegreesTo90 = useCallback((value, threshold) => {
    const targets = [0, 90, 180, 270, 360];
    let best = value;
    let bestDist = Infinity;
    targets.forEach((target) => {
      const dist = Math.abs(value - target);
      if (dist <= threshold && dist < bestDist) {
        bestDist = dist;
        best = target;
      }
    });
    return best;
  }, []);

  const resetStep9Local = useCallback(() => {
    if (step9WrongTimerRef.current) {
      clearTimeout(step9WrongTimerRef.current);
      step9WrongTimerRef.current = null;
    }
    setRotationDirection(null);
    setRotationDegrees(0);
    setShowRotationClone(false);
    setSliderWrong(false);
    setRotationLocked(false);
  }, []);

  const resetStep10Local = useCallback(() => {
    if (pqrExitTweenRef.current) {
      pqrExitTweenRef.current.kill();
      pqrExitTweenRef.current = null;
    }
    setTranslationVector({ x: 0, y: 0 });
    setTranslateLocked(false);
    setShowPqr1(false);
    setPqr1Coords(null);
    setOriginalPqrFadeOpacity(0);
  }, []);

  const resetStep11Local = useCallback(() => {
    if (reflectTweenRef.current) {
      reflectTweenRef.current.kill();
      reflectTweenRef.current = null;
    }
    setShowPqr2(false);
    setPqr2Coords(null);
    setReflectProgress(0);
    setStep11ResultOpacity(0);
    setStep11ShowResult(false);
  }, []);

  const resetStep12Local = useCallback(() => {
    step12BusyRef.current = false;
    setYellowRootsVisible(false);
    setYellowRootsSwapped(false);
    setYellowBelowVisible(false);
    setYellowBelowOpacity(0);
    setYellowBoxVisible(false);
  }, []);

  const resetStep13Local = useCallback(() => {
    step13BusyRef.current = false;
  }, []);

  const buildPqr2FromPqr1 = useCallback((pqr1) => {
    if (!pqr1) return null;
    const reflected = reflectPointAcrossLine(pqr1.P, pqr1.Q, pqr1.R);
    const P = {
      x: Math.round(reflected.x),
      y: Math.round(reflected.y),
    };
    return {
      P: P,
      Q: pqr1.Q,
      R: pqr1.R,
      labelTriangle: {
        A: P,
        B: pqr1.Q,
        C: pqr1.R,
      },
    };
  }, []);

  const startOriginalPqrExit = useCallback(() => {
    if (pqrExitTweenRef.current) {
      pqrExitTweenRef.current.kill();
      pqrExitTweenRef.current = null;
    }
    setOriginalPqrFadeOpacity(1);
    const state = { opacity: 1 };
    pqrExitTweenRef.current = gsap.to(state, {
      opacity: 0,
      duration: 0.75,
      ease: "power1.out",
      onUpdate: function () {
        setOriginalPqrFadeOpacity(state.opacity);
      },
      onComplete: function () {
        setOriginalPqrFadeOpacity(0);
        pqrExitTweenRef.current = null;
      },
    });
  }, []);

  const rotatePointAboutOrigin = useCallback((point, degrees, direction) => {
    const rad = (degrees * Math.PI) / 180;
    const angle = direction === "acw" ? rad : -rad;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: point.x * cos - point.y * sin,
      y: point.x * sin + point.y * cos,
    };
  }, []);

  const getTransformedAbc = useCallback(
    (degrees, direction, translation) => {
      const tx = translation ? translation.x : 0;
      const ty = translation ? translation.y : 0;
      const mapPoint = (point) => {
        const rotated = rotatePointAboutOrigin(point, degrees, direction);
        return { x: rotated.x + tx, y: rotated.y + ty };
      };
      return {
        A: mapPoint(graph.coords.A),
        B: mapPoint(graph.coords.B),
        C: mapPoint(graph.coords.C),
      };
    },
    [graph.coords, rotatePointAboutOrigin],
  );

  const segmentMatchesQr = useCallback((bPrime, cPrime) => {
    const Q = graph.coords.Q;
    const R = graph.coords.R;
    const near = (p, q) =>
      Math.abs(p.x - q.x) < 0.05 && Math.abs(p.y - q.y) < 0.05;
    return (
      (near(bPrime, Q) && near(cPrime, R)) ||
      (near(bPrime, R) && near(cPrime, Q))
    );
  }, [graph.coords.Q, graph.coords.R]);

  const buildDefaultPqr1 = useCallback(() => {
    const transformed = getTransformedAbc(90, "cw", { x: -6, y: 1 });
    return {
      P: {
        x: Math.round(transformed.A.x),
        y: Math.round(transformed.A.y),
      },
      Q: graph.coords.Q,
      R: graph.coords.R,
      labelTriangle: {
        A: transformed.A,
        B: transformed.B,
        C: transformed.C,
      },
    };
  }, [getTransformedAbc, graph.coords.Q, graph.coords.R]);

  useEffect(() => {
    if (step < 9) {
      resetStep9Local();
      resetStep10Local();
      resetStep11Local();
      resetStep12Local();
      resetStep13Local();
      return;
    }

    if (step === 9 && step9Phase === "intro") {
      resetStep9Local();
      resetStep10Local();
      resetStep11Local();
      resetStep12Local();
      resetStep13Local();
      return;
    }

    if (step === 9 && step9Phase === "done") {
      setRotationLocked(true);
      setShowRotationClone(true);
      setSliderWrong(false);
      setRotationDirection((prev) => prev || "cw");
      setRotationDegrees((prev) =>
        prev === 90 || prev === 270 ? prev : 90,
      );
      resetStep10Local();
      resetStep11Local();
      resetStep12Local();
      resetStep13Local();
      return;
    }

    if (step === 10) {
      resetStep11Local();
      resetStep12Local();
      resetStep13Local();
      setRotationLocked(true);
      setRotationDirection((prev) => prev || "cw");
      setRotationDegrees((prev) =>
        prev === 90 || prev === 270 ? prev : 90,
      );
      if (step10Phase === "done") {
        setShowRotationClone(false);
        setTranslateLocked(true);
        setShowPqr1(true);
        setOriginalPqrFadeOpacity(0);
        setTranslationVector((prev) =>
          prev.x !== 0 || prev.y !== 0 ? prev : { x: -6, y: 1 },
        );
        setPqr1Coords((prev) => prev || buildDefaultPqr1());
        return;
      }
      setShowRotationClone(true);
      setShowPqr1(false);
      setTranslateLocked(false);
      setOriginalPqrFadeOpacity(0);
      return;
    }

    if (step === 11) {
      resetStep12Local();
      resetStep13Local();
      setRotationLocked(true);
      setShowRotationClone(false);
      setTranslateLocked(true);
      setShowPqr1(true);
      setOriginalPqrFadeOpacity(0);
      setPqr1Coords((prev) => prev || buildDefaultPqr1());

      if (step11Phase === "done") {
        setShowPqr2(true);
        setReflectProgress(1);
        setStep11ShowResult(true);
        setStep11ResultOpacity(1);
        setPqr2Coords((prev) => {
          if (prev) return prev;
          return buildPqr2FromPqr1(buildDefaultPqr1());
        });
        return;
      }

      if (step11Phase === "intro") {
        setShowPqr2(false);
        setPqr2Coords(null);
        setReflectProgress(0);
        setStep11ShowResult(false);
        setStep11ResultOpacity(0);
      }
      return;
    }

    if (step === 12 || step === 13) {
      setRotationLocked(true);
      setShowRotationClone(false);
      setTranslateLocked(true);
      setShowPqr1(true);
      setShowPqr2(true);
      setReflectProgress(1);
      setOriginalPqrFadeOpacity(0);
      setStep11ShowResult(true);
      setStep11ResultOpacity(0);
      setPqr1Coords((prev) => prev || buildDefaultPqr1());
      setPqr2Coords((prev) => {
        if (prev) return prev;
        return buildPqr2FromPqr1(buildDefaultPqr1());
      });

      if (step === 12) {
        resetStep13Local();
        if (step12Phase === "done") {
          setYellowBoxVisible(true);
          setYellowRootsVisible(true);
          setYellowRootsSwapped(false);
          setYellowBelowVisible(true);
          setYellowBelowOpacity(1);
        } else if (step12Phase === "initial") {
          setYellowBoxVisible(false);
          setYellowRootsVisible(false);
          setYellowRootsSwapped(false);
          setYellowBelowVisible(false);
          setYellowBelowOpacity(0);
        }
      }

      if (step === 13) {
        if (step13Phase === "done") {
          setYellowBoxVisible(true);
          setYellowRootsVisible(true);
          setYellowRootsSwapped(true);
          setYellowBelowVisible(true);
          setYellowBelowOpacity(1);
        } else if (step13Phase === "initial") {
          setYellowBoxVisible(true);
          setYellowRootsVisible(true);
          setYellowRootsSwapped(false);
          setYellowBelowVisible(false);
          setYellowBelowOpacity(0);
        }
      }
    }
  }, [
    step,
    step9Phase,
    step10Phase,
    step11Phase,
    step12Phase,
    step13Phase,
    resetStep9Local,
    resetStep10Local,
    resetStep11Local,
    resetStep12Local,
    resetStep13Local,
    buildDefaultPqr1,
    buildPqr2FromPqr1,
  ]);

  useEffect(() => {
    return () => {
      if (step9WrongTimerRef.current) {
        clearTimeout(step9WrongTimerRef.current);
      }
      if (pqrExitTweenRef.current) {
        pqrExitTweenRef.current.kill();
        pqrExitTweenRef.current = null;
      }
      if (reflectTweenRef.current) {
        reflectTweenRef.current.kill();
        reflectTweenRef.current = null;
      }
    };
  }, []);

  const handleStep9RotateClick = () => {
    if (step !== 9 || step9Phase !== "intro") return;
    if (typeof playSound === "function") playSound("click");
    setPhase(onStep9PhaseChange, "controls");
  };

  const handleStep9Direction = (direction) => {
    if (step !== 9 || rotationLocked) return;
    if (step9Phase !== "controls" && step9Phase !== "ready") return;
    if (typeof playSound === "function") playSound("click");
    setRotationDirection(direction);
    setRotationDegrees(0);
    setShowRotationClone(false);
    setSliderWrong(false);
    if (step9Phase === "controls") {
      setPhase(onStep9PhaseChange, "ready");
    }
  };

  const handleStep9SliderChange = (value) => {
    if (step !== 9 || rotationLocked || !rotationDirection) return;
    const snapped = snapDegreesTo90(value, 15);
    setRotationDegrees(snapped);
    setShowRotationClone(snapped !== 0);
    setSliderWrong(false);
  };

  const handleStep9SliderCommit = () => {
    if (step !== 9 || rotationLocked || !rotationDirection) return;
    const snapped = snapDegreesTo90(rotationDegrees, 15);
    const isCorrect = snapped === 90 || snapped === 270;

    if (isCorrect) {
      if (typeof playSound === "function") playSound("correct");
      setRotationDegrees(snapped);
      setShowRotationClone(true);
      setRotationLocked(true);
      setSliderWrong(false);
      setPhase(onStep9PhaseChange, "done");
      return;
    }

    if (typeof playSound === "function") playSound("wrong");
    setShowRotationClone(false);
    setSliderWrong(true);
    if (step9WrongTimerRef.current) {
      clearTimeout(step9WrongTimerRef.current);
    }
    step9WrongTimerRef.current = setTimeout(() => {
      setSliderWrong(false);
      setRotationDegrees(0);
      step9WrongTimerRef.current = null;
    }, 500);
  };

  const handleStep10TranslateClick = () => {
    if (step !== 10 || step10Phase !== "intro") return;
    if (typeof playSound === "function") playSound("click");
    setTranslationVector({ x: 0, y: 0 });
    setPhase(onStep10PhaseChange, "controls");
  };

  const handleStep10Move = (direction) => {
    if (step !== 10 || translateLocked || step10Phase !== "controls") return;
    if (typeof playSound === "function") playSound("click");

    const delta =
      direction === "left"
        ? { x: -1, y: 0 }
        : direction === "right"
          ? { x: 1, y: 0 }
          : direction === "up"
            ? { x: 0, y: 1 }
            : direction === "down"
              ? { x: 0, y: -1 }
              : { x: 0, y: 0 };

    const degrees =
      rotationDegrees === 90 || rotationDegrees === 270
        ? rotationDegrees
        : 90;
    const directionRot = rotationDirection || "cw";
    const next = {
      x: translationVector.x + delta.x,
      y: translationVector.y + delta.y,
    };
    const transformed = getTransformedAbc(degrees, directionRot, next);
    setTranslationVector(next);

    if (segmentMatchesQr(transformed.B, transformed.C)) {
      if (typeof playSound === "function") playSound("congrats");
      setTranslateLocked(true);
      setShowRotationClone(false);
      setShowPqr1(true);
      setPqr1Coords({
        P: {
          x: Math.round(transformed.A.x),
          y: Math.round(transformed.A.y),
        },
        Q: graph.coords.Q,
        R: graph.coords.R,
        labelTriangle: {
          A: transformed.A,
          B: transformed.B,
          C: transformed.C,
        },
      });
      startOriginalPqrExit();
      setPhase(onStep10PhaseChange, "done");
    }
  };

  const runStep11ResultFly = useCallback(async (order) => {
    setPhase(onStep11PhaseChange, "flying");
    setStep11ShowResult(true);
    setStep11ResultOpacity(0);
    await delay(40);
    if (isCancelled()) return;

    const sourceKey1 = order && order.swap ? "PQR2P" : "PQR1P";
    const sourceKey2 = order && order.swap ? "PQR1P" : "PQR2P";
    const source1 = labelRefs.current[sourceKey1];
    const source2 = labelRefs.current[sourceKey2];
    const target1 = step11ResultRefs.current.p1;
    const target2 = step11ResultRefs.current.p2;

    await Promise.all([
      animateFly(source1, target1, {
        text: source1 ? source1.textContent.trim() : "",
        className: "is-cyan",
      }),
      animateFly(source2, target2, {
        text: source2 ? source2.textContent.trim() : "",
        className: "is-cyan",
      }),
    ]);

    if (isCancelled()) return;
    setStep11ResultOpacity(1);
    if (typeof playSound === "function") playSound("correct");
    setPhase(onStep11PhaseChange, "done");
  }, [animateFly, onStep11PhaseChange, setPhase]);

  const handleStep11ReflectClick = () => {
    if (step !== 11 || step11Phase !== "intro") return;
    if (typeof playSound === "function") playSound("click");

    const base = pqr1Coords || buildDefaultPqr1();
    if (!pqr1Coords) setPqr1Coords(base);
    const reflected = buildPqr2FromPqr1(base);
    setPqr2Coords(reflected);
    setShowPqr2(true);
    setReflectProgress(0);
    setStep11ShowResult(false);
    setStep11ResultOpacity(0);
    setPhase(onStep11PhaseChange, "flipping");

    const near = (p, x, y) =>
      p && Math.abs(p.x - x) < 0.15 && Math.abs(p.y - y) < 0.15;
    const swap =
      near(reflected.P, -5, -3) && !near(base.P, -5, -3);

    if (reflectTweenRef.current) {
      reflectTweenRef.current.kill();
      reflectTweenRef.current = null;
    }
    const state = { t: 0 };
    reflectTweenRef.current = gsap.to(state, {
      t: 1,
      duration: 1.05,
      ease: "power2.inOut",
      onUpdate: function () {
        setReflectProgress(state.t);
      },
      onComplete: function () {
        setReflectProgress(1);
        reflectTweenRef.current = null;
        setTimeout(function () {
          runStep11ResultFly({ swap: swap });
        }, 500);
      },
    });
  };

  const runStep12Sequence = useCallback(async () => {
    if (step12BusyRef.current) return;
    step12BusyRef.current = true;
    setPhase(onStep12PhaseChange, "flying");
    setYellowBoxVisible(false);
    setYellowRootsVisible(false);
    setYellowRootsSwapped(false);
    setYellowBelowVisible(false);
    setYellowBelowOpacity(0);
    await delay(80);
    if (isCancelled()) {
      step12BusyRef.current = false;
      return;
    }
    await new Promise(function (resolve) {
      requestAnimationFrame(function () {
        requestAnimationFrame(resolve);
      });
    });
    if (isCancelled()) {
      step12BusyRef.current = false;
      return;
    }
    setYellowBoxVisible(true);
    await delay(480);
    if (isCancelled()) {
      step12BusyRef.current = false;
      return;
    }

    await Promise.all([
      animateFly(labelRefs.current.PQR1AB, yellowValueRefs.current.pq, {
        rootValue: SIDE_LENGTH_CONFIG.AB.rootValue(),
        className: "is-orange is-math-root",
      }),
      animateFly(labelRefs.current.PQR1AC, yellowValueRefs.current.pr, {
        rootValue: SIDE_LENGTH_CONFIG.AC.rootValue(),
        className: "is-orange is-math-root",
      }),
    ]);

    if (isCancelled()) {
      step12BusyRef.current = false;
      return;
    }

    setYellowRootsVisible(true);
    setPhase(onStep12PhaseChange, "belowAnimating");
    setYellowBelowVisible(true);
    setYellowBelowOpacity(0);
    await delay(40);
    setYellowBelowOpacity(1);
    await delay(450);
    if (isCancelled()) {
      step12BusyRef.current = false;
      return;
    }
    setPhase(onStep12PhaseChange, "done");
    step12BusyRef.current = false;
  }, [animateFly, onStep12PhaseChange, setPhase]);

  const runStep13Sequence = useCallback(async () => {
    if (step13BusyRef.current) return;
    step13BusyRef.current = true;
    setYellowBoxVisible(true);
    setYellowRootsVisible(true);
    setYellowRootsSwapped(false);
    setYellowBelowVisible(false);
    setYellowBelowOpacity(0);
    setPhase(onStep13PhaseChange, "swapping");
    await delay(120);
    if (isCancelled()) {
      step13BusyRef.current = false;
      return;
    }

    const pqEl = yellowValueRefs.current.pq;
    const prEl = yellowValueRefs.current.pr;
    const flyPromise = Promise.all([
      animateFly(pqEl, prEl, {
        rootValue: SIDE_LENGTH_CONFIG.AB.rootValue(),
        className: "is-orange is-math-root",
      }),
      animateFly(prEl, pqEl, {
        rootValue: SIDE_LENGTH_CONFIG.AC.rootValue(),
        className: "is-orange is-math-root",
      }),
    ]);
    setYellowRootsVisible(false);
    await flyPromise;

    if (isCancelled()) {
      step13BusyRef.current = false;
      return;
    }

    setYellowRootsSwapped(true);
    setYellowRootsVisible(true);
    setPhase(onStep13PhaseChange, "belowAnimating");
    setYellowBelowVisible(true);
    setYellowBelowOpacity(0);
    await delay(40);
    setYellowBelowOpacity(1);
    await delay(450);
    if (isCancelled()) {
      step13BusyRef.current = false;
      return;
    }
    setPhase(onStep13PhaseChange, "done");
    step13BusyRef.current = false;
  }, [animateFly, onStep13PhaseChange, setPhase]);

  useEffect(() => {
    if (step === 12 && step12Phase === "initial" && !step12BusyRef.current) {
      const t = setTimeout(function () {
        runStep12Sequence();
      }, 200);
      return function () {
        clearTimeout(t);
      };
    }
  }, [step, step12Phase, runStep12Sequence]);

  useEffect(() => {
    if (step === 13 && step13Phase === "initial" && !step13BusyRef.current) {
      const t = setTimeout(function () {
        runStep13Sequence();
      }, 250);
      return function () {
        clearTimeout(t);
      };
    }
  }, [step, step13Phase, runStep13Sequence]);

  const activeTransform =
    (step === 9 || step === 10) &&
    showRotationClone &&
    rotationDirection &&
    rotationDegrees
      ? getTransformedAbc(
          rotationDegrees,
          rotationDirection,
          step === 10 ? translationVector : { x: 0, y: 0 },
        )
      : null;

  const rotationOverlay = useMemo(() => {
    if (!activeTransform) return null;
    const { A, B, C } = activeTransform;
    const objectColor = colors.object;
    return {
      active: true,
      angle: 0,
      opacity: 0.95,
      points: [
        {
          id: "rotA",
          x: A.x,
          y: A.y,
          color: objectColor,
          showLabel: false,
          circleOpacity: 1,
          radius: 8,
        },
        {
          id: "rotB",
          x: B.x,
          y: B.y,
          color: objectColor,
          showLabel: false,
          circleOpacity: 1,
          radius: 8,
        },
        {
          id: "rotC",
          x: C.x,
          y: C.y,
          color: objectColor,
          showLabel: false,
          circleOpacity: 1,
          radius: 8,
        },
      ],
      segments: [
        { from: A, to: B, color: objectColor, strokeWidth: 3.8, opacity: 0.95 },
        { from: B, to: C, color: objectColor, strokeWidth: 3.8, opacity: 0.95 },
        { from: C, to: A, color: objectColor, strokeWidth: 3.8, opacity: 0.95 },
      ],
      polygons: [
        {
          vertices: [A, B, C],
          color: objectColor,
          fillOpacity: 0.28,
          noStroke: true,
          opacity: 1,
        },
      ],
    };
  }, [activeTransform, colors.object]);

  const cloneRootLabels = useMemo(() => {
    if (!activeTransform || !rotationLocked) return [];
    const { A, B, C } = activeTransform;
    const positions = getOutwardSideLabelPositions(A, B, C, 0.7);
    return [
      {
        x: positions.ab.x,
        y: positions.ab.y,
        text: SIDE_LENGTH_CONFIG.AB.rootValue(),
        color: "#ffffff",
        visible: true,
      },
      {
        x: positions.bc.x,
        y: positions.bc.y,
        text: SIDE_LENGTH_CONFIG.BC.rootValue(),
        color: "#ffffff",
        visible: true,
      },
      {
        x: positions.ac.x,
        y: positions.ac.y,
        text: SIDE_LENGTH_CONFIG.AC.rootValue(),
        color: "#ffffff",
        visible: true,
      },
    ];
  }, [activeTransform, rotationLocked]);

  const dimAbcOriginal =
    ((step === 9 || step === 10) && showRotationClone) ||
    ((step === 10 || step === 11 || step === 12 || step === 13) && showPqr1);
  const abcDimColor = "#8b8b8b";
  const isOriginalPqrExiting =
    step === 10 && showPqr1 && originalPqrFadeOpacity > 0.01;
  const hideOriginalQ =
    (step === 10 || step === 11 || step === 12 || step === 13) && showPqr1;
  const hideOriginalR =
    (step === 10 || step === 11 || step === 12 || step === 13) && showPqr1;

  const pqr2Display = useMemo(() => {
    if (!showPqr2 || !pqr1Coords || !pqr2Coords) return null;
    const liveP =
      reflectProgress >= 0.999
        ? pqr2Coords.P
        : flipPointAcrossLine(
            pqr1Coords.P,
            pqr2Coords.P,
            pqr1Coords.Q,
            pqr1Coords.R,
            reflectProgress,
          );
    return {
      P: liveP,
      Q: pqr1Coords.Q,
      R: pqr1Coords.R,
      finalP: pqr2Coords.P,
    };
  }, [showPqr2, pqr1Coords, pqr2Coords, reflectProgress]);

  const step11ResultPoints = useMemo(() => {
    if (!pqr1Coords || !pqr2Coords) return null;
    const a = pqr1Coords.P;
    const b = pqr2Coords.P;
    const near = (p, x, y) =>
      Math.abs(p.x - x) < 0.15 && Math.abs(p.y - y) < 0.15;
    if (near(b, -5, -3) && !near(a, -5, -3)) {
      return {
        first: b,
        second: a,
        firstRef: "PQR2P",
        secondRef: "PQR1P",
      };
    }
    return {
      first: a,
      second: b,
      firstRef: "PQR1P",
      secondRef: "PQR2P",
    };
  }, [pqr1Coords, pqr2Coords]);

  const graphPoints = useMemo(() => {
    const points = visiblePointKeys
      .filter((key) => {
        if (key === "Q" && hideOriginalQ) return false;
        if (key === "R" && hideOriginalR) return false;
        return true;
      })
      .map((key) => {
      const def = POINT_DEFS[key];
      const reveal = pointRevealState[key] || {};
      const coords = graph.coords[key];
      const coordParts = graph.coordText[key] || null;
      const isAbc = key === "A" || key === "B" || key === "C";
      const pointColor =
        dimAbcOriginal && isAbc ? abcDimColor : colors[def.colorKey];
      const baseCircle =
        reveal.circleOpacity != null ? reveal.circleOpacity : 1;
      const baseLabel =
        reveal.labelOpacity != null ? reveal.labelOpacity : 1;

      return {
        id: key,
        x: coords.x,
        y: coords.y,
        color: pointColor,
        label: graph.labels[key],
        labelPrefix: key,
        labelPlacement: def.placement,
        circleOpacity:
          dimAbcOriginal && isAbc ? baseCircle * 0.55 : baseCircle,
        labelOpacity: dimAbcOriginal && isAbc ? baseLabel * 0.55 : baseLabel,
        showLabel: true,
        labelRefKey: key,
        coordParts: coordParts,
        coordXRefKey: key + "X",
        coordYRefKey: key + "Y",
      };
    });

    if (showUnknownPoint && (!showPqr1 || isOriginalPqrExiting)) {
      const reveal = pointRevealState.P || {};
      const fadeMul = isOriginalPqrExiting ? originalPqrFadeOpacity : 1;
      const baseCircle =
        reveal.circleOpacity != null ? reveal.circleOpacity : 1;
      const baseLabel = showUnknownLabel
        ? reveal.labelOpacity != null
          ? reveal.labelOpacity
          : 1
        : 0;
      points.push({
        id: "P",
        x: unknownCoord.x,
        y: unknownCoord.y,
        color: colors.unknown,
        label: graph.labels.P,
        labelPrefix: "P",
        labelPlacement: "below",
        circleOpacity: baseCircle * fadeMul,
        labelOpacity: baseLabel * fadeMul,
        showLabel: true,
        labelRefKey: "P",
        questionMark: showQuestionMark,
        questionColor: "#00f7ff",
      });
    }

    if (showPqr1 && pqr1Coords) {
      const P = pqr1Coords.P;
      const Q = pqr1Coords.Q;
      const R = pqr1Coords.R;
      points.push(
        {
          id: "PQR1-P",
          x: P.x,
          y: P.y,
          color: colors.image,
          label: formatPLabel(P),
          labelPrefix: "P",
          labelPlacement: P.y >= 0 ? "above" : "below",
          showLabel: true,
          circleOpacity: 1,
          labelOpacity: 1,
          labelRefKey: "PQR1P",
        },
        {
          id: "PQR1-Q",
          x: Q.x,
          y: Q.y,
          color: colors.image,
          label: graph.labels.Q,
          labelPrefix: "Q",
          labelPlacement: POINT_DEFS.Q.placement,
          showLabel: true,
          circleOpacity: 1,
          labelOpacity: 1,
          coordParts: graph.coordText.Q,
        },
        {
          id: "PQR1-R",
          x: R.x,
          y: R.y,
          color: colors.image,
          label: graph.labels.R,
          labelPrefix: "R",
          labelPlacement: POINT_DEFS.R.placement,
          showLabel: true,
          circleOpacity: 1,
          labelOpacity: 1,
          coordParts: graph.coordText.R,
        },
      );
    }

    if (pqr2Display) {
      const P = pqr2Display.P;
      const showPLabel = reflectProgress > 0.55;
      points.push({
        id: "PQR2-P",
        x: P.x,
        y: P.y,
        color: colors.image,
        label: formatPLabel(pqr2Display.finalP || P),
        labelPrefix: "P",
        labelPlacement: (pqr2Display.finalP || P).y >= 0 ? "above" : "below",
        showLabel: showPLabel,
        circleOpacity: 1,
        labelOpacity: showPLabel ? 1 : 0,
        labelRefKey: "PQR2P",
      });
    }

    if (step5Phase === "formula") {
      points.push({
        id: "QRHotspot",
        x: SIDE_LENGTH_CONFIG.QR.hotspot.x,
        y: SIDE_LENGTH_CONFIG.QR.hotspot.y,
        color: "#ffffff",
        radius: 12,
        circleOpacity: 0.6,
        strokeWidth: 0,
        showLabel: false,
        clickable: true,
        showClickPulse: true,
        pulseRadius: 21,
        pulseOpacity: 0.4,
        clickId: "qr-hotspot",
        onClick: handleQrHotspot,
      });
    }

    if (step === 6) {
      const activeSide =
        step6Phase === "abWaiting"
          ? "AB"
          : step6Phase === "bcWaiting"
            ? "BC"
            : step6Phase === "acWaiting"
              ? "AC"
              : null;

      if (activeSide) {
        const hotspotConfig = SIDE_LENGTH_CONFIG[activeSide];
        points.push({
          id: activeSide + "Hotspot",
          x: hotspotConfig.hotspot.x,
          y: hotspotConfig.hotspot.y,
          color: "#ffffff",
          radius: 12,
          circleOpacity: 0.6,
          strokeWidth: 0,
          showLabel: false,
          clickable: true,
          showClickPulse: true,
          pulseRadius: 21,
          pulseOpacity: 0.4,
          clickId: hotspotConfig.hotspotId,
          onClick: () => handleStep6Hotspot(activeSide),
        });
      }
    }

    if (step === 7 && step7Phase === "waiting") {
      ["AB", "BC", "AC"].forEach((sideKey) => {
        const hotspotConfig = SIDE_LENGTH_CONFIG[sideKey];
        const isWrong = wrongHotspot === sideKey;
        points.push({
          id: sideKey + "Hotspot",
          x: hotspotConfig.hotspot.x,
          y: hotspotConfig.hotspot.y,
          color: isWrong ? "#ff4d4d" : "#ffffff",
          radius: 12,
          circleOpacity: 0.6,
          strokeWidth: 0,
          showLabel: false,
          clickable: true,
          showClickPulse: true,
          pulseRadius: 21,
          pulseOpacity: 0.4,
          clickId: hotspotConfig.hotspotId,
          isWrong: isWrong,
          isShaking: isWrong,
          onClick: () => handleStep7Hotspot(sideKey),
        });
      });
    }

    return points;
  }, [
    visiblePointKeys,
    pointRevealState,
    graph,
    colors,
    showUnknownPoint,
    showUnknownLabel,
    showQuestionMark,
    unknownCoord,
    dimAbcOriginal,
    hideOriginalQ,
    hideOriginalR,
    isOriginalPqrExiting,
    originalPqrFadeOpacity,
    showPqr1,
    pqr1Coords,
    pqr2Display,
    reflectProgress,
    step,
    step5Phase,
    step6Phase,
    step7Phase,
    wrongHotspot,
    handleStep6Hotspot,
    handleStep7Hotspot,
  ]);

  const graphPolygons = useMemo(() => {
    const polys = [];
    if (showPqr1 && pqr1Coords) {
      polys.push({
        vertices: [pqr1Coords.P, pqr1Coords.Q, pqr1Coords.R],
        color: colors.image,
        fillOpacity: 0.28,
        noStroke: true,
        opacity: 1,
      });
    }
    if (pqr2Display) {
      polys.push({
        vertices: [pqr2Display.P, pqr2Display.Q, pqr2Display.R],
        color: colors.image,
        fillOpacity: 0.28,
        noStroke: true,
        opacity: 1,
      });
    }
    return polys;
  }, [showPqr1, pqr1Coords, pqr2Display, colors.image]);

  const graphSegments = useMemo(() => {
    const segments = [];
    if (showAbcTriangle) {
      const abcColor = dimAbcOriginal ? abcDimColor : colors.object;
      segments.push(
        {
          from: graph.coords.A,
          to: graph.coords.B,
          color: abcColor,
          strokeWidth: 3.8,
          opacity: dimAbcOriginal ? 0.55 : 1,
        },
        {
          from: graph.coords.B,
          to: graph.coords.C,
          color: abcColor,
          strokeWidth: 3.8,
          opacity: dimAbcOriginal ? 0.55 : 1,
        },
        {
          from: graph.coords.C,
          to: graph.coords.A,
          color: abcColor,
          strokeWidth: 3.8,
          opacity: dimAbcOriginal ? 0.55 : 1,
        },
      );
    }
    if (showQrSegment && !showPqr1) {
      segments.push({
        from: graph.coords.Q,
        to: graph.coords.R,
        color: colors.image,
        strokeWidth: 4,
      });
    }
    if (showUnknownPoint && (!showPqr1 || isOriginalPqrExiting)) {
      const dashOpacity = isOriginalPqrExiting
        ? 0.68 * originalPqrFadeOpacity
        : 0.68;
      segments.push(
        {
          from: graph.coords.Q,
          to: unknownCoord,
          color: colors.image,
          strokeWidth: 3,
          dashed: true,
          opacity: dashOpacity,
        },
        {
          from: graph.coords.R,
          to: unknownCoord,
          color: colors.image,
          strokeWidth: 3,
          dashed: true,
          opacity: dashOpacity,
        },
      );
    }
    if (showPqr1 && pqr1Coords) {
      segments.push(
        {
          from: pqr1Coords.P,
          to: pqr1Coords.Q,
          color: colors.image,
          strokeWidth: 3.8,
        },
        {
          from: pqr1Coords.Q,
          to: pqr1Coords.R,
          color: colors.image,
          strokeWidth: 3.8,
        },
        {
          from: pqr1Coords.R,
          to: pqr1Coords.P,
          color: colors.image,
          strokeWidth: 3.8,
        },
      );
    }
    if (pqr2Display) {
      segments.push(
        {
          from: pqr2Display.P,
          to: pqr2Display.Q,
          color: colors.image,
          strokeWidth: 3.8,
        },
        {
          from: pqr2Display.Q,
          to: pqr2Display.R,
          color: colors.image,
          strokeWidth: 3.8,
        },
        {
          from: pqr2Display.R,
          to: pqr2Display.P,
          color: colors.image,
          strokeWidth: 3.8,
        },
      );
    }
    if (sideClone) {
      segments.push({
        from: sideClone.from,
        to: sideClone.to,
        color: sideClone.color || colors.object,
        strokeWidth: sideClone.strokeWidth || 5,
        opacity: sideClone.opacity != null ? sideClone.opacity : 1,
      });
    }
    return segments;
  }, [
    showAbcTriangle,
    showQrSegment,
    showUnknownPoint,
    isOriginalPqrExiting,
    originalPqrFadeOpacity,
    showPqr1,
    pqr1Coords,
    pqr2Display,
    graph.coords,
    colors,
    unknownCoord,
    sideClone,
    dimAbcOriginal,
  ]);

  const rootLabels = [];
  ["QR", "AB", "BC", "AC"].forEach((sideKey) => {
    const config = SIDE_LENGTH_CONFIG[sideKey];
    const isAbcSide = sideKey === "AB" || sideKey === "BC" || sideKey === "AC";
    const isQr = sideKey === "QR";
    const hideQrLabel = showPqr1 && isQr;
    rootLabels.push({
      x: config.graphLabel.x,
      y: config.graphLabel.y,
      text: config.rootValue(),
      color: dimAbcOriginal && isAbcSide ? abcDimColor : "#ffffff",
      visible: hideQrLabel ? false : visibleLengthLabels[sideKey],
      opacity: dimAbcOriginal && isAbcSide ? 0.5 : 1,
      refKey: config.graphLabel.refKey,
    });
  });

  if (showPqr1 && pqr1Coords) {
    const tri = pqr1Coords.labelTriangle || {
      A: pqr1Coords.P,
      B: pqr1Coords.Q,
      C: pqr1Coords.R,
    };
    const positions = getOutwardSideLabelPositions(tri.A, tri.B, tri.C, 0.7);
    rootLabels.push(
      {
        x: positions.ab.x,
        y: positions.ab.y,
        text: SIDE_LENGTH_CONFIG.AB.rootValue(),
        color: "#ffffff",
        visible: true,
        refKey: "PQR1AB",
      },
      {
        x: positions.bc.x,
        y: positions.bc.y,
        text: SIDE_LENGTH_CONFIG.BC.rootValue(),
        color: "#ffffff",
        visible: true,
        refKey: "PQR1BC",
      },
      {
        x: positions.ac.x,
        y: positions.ac.y,
        text: SIDE_LENGTH_CONFIG.AC.rootValue(),
        color: "#ffffff",
        visible: true,
        refKey: "PQR1AC",
      },
    );
  }

  if (pqr2Display && reflectProgress > 0.82) {
    const tri = {
      A: pqr2Display.finalP || pqr2Display.P,
      B: pqr2Display.Q,
      C: pqr2Display.R,
    };
    const positions = getOutwardSideLabelPositions(tri.A, tri.B, tri.C, 0.7);
    rootLabels.push(
      {
        x: positions.ab.x,
        y: positions.ab.y,
        text: SIDE_LENGTH_CONFIG.AB.rootValue(),
        color: "#ffffff",
        visible: true,
      },
      {
        x: positions.ac.x,
        y: positions.ac.y,
        text: SIDE_LENGTH_CONFIG.AC.rootValue(),
        color: "#ffffff",
        visible: true,
      },
    );
  }

  const flyCloneEls = flyClones.map((clone) => {
    const endScale = clone.endScale != null ? clone.endScale : 1;
    const content = clone.rootValue
      ? React.createElement(
          "math",
          {
            className: "math-root-inline",
            display: "inline",
            role: "img",
            "aria-label":
              APP_DATA.aria.squareRootOf + " " + clone.rootValue,
          },
          React.createElement(
            "mrow",
            null,
            React.createElement(
              "msqrt",
              null,
              React.createElement(
                "mtext",
                { className: "math-root-text" },
                clone.rootValue,
              ),
            ),
          ),
        )
      : clone.text;

    return React.createElement(
      "div",
      {
        key: clone.id,
        className: "fly-clone-text " + clone.className,
        style: {
          left: clone.startX + "px",
          top: clone.startY + "px",
          fontSize: clone.fontSize || undefined,
          transform: clone.animating
            ? "translate(calc(-50% + " +
              clone.dx +
              "px), calc(-50% + " +
              clone.dy +
              "px)) scale(" +
              endScale +
              ")"
            : "translate(-50%, -50%) scale(1)",
        },
      },
      content,
    );
  });

  const renderMathRootFormula = (slots = {}) =>
    React.createElement(
      "math",
      {
        className: "math-root-formula",
        display: "inline",
        role: "img",
        "aria-label": APP_DATA.aria.squareRootExpression,
      },
      React.createElement(
        "mrow",
        null,
        React.createElement(
          "msqrt",
          null,
          React.createElement(
            "mrow",
            null,
            React.createElement("mo", null, "["),
            React.createElement("mo", null, "("),
            React.createElement(
              "mtext",
              {
                className: "math-slot",
                ref: (el) => {
                  formulaRefs.current.x2 = el;
                },
              },
              slots.x2 || "x₂",
            ),
            React.createElement("mo", null, "-"),
            React.createElement(
              "mtext",
              {
                className: "math-slot",
                ref: (el) => {
                  formulaRefs.current.x1 = el;
                },
              },
              slots.x1 || "x₁",
            ),
            React.createElement("mo", null, ")"),
            React.createElement("mo", null, "²"),
            React.createElement("mo", null, "+"),
            React.createElement("mo", null, "("),
            React.createElement(
              "mtext",
              {
                className: "math-slot",
                ref: (el) => {
                  formulaRefs.current.y2 = el;
                },
              },
              slots.y2 || "y₂",
            ),
            React.createElement("mo", null, "-"),
            React.createElement(
              "mtext",
              {
                className: "math-slot",
                ref: (el) => {
                  formulaRefs.current.y1 = el;
                },
              },
              slots.y1 || "y₁",
            ),
            React.createElement("mo", null, ")"),
            React.createElement("mo", null, "²"),
            React.createElement("mo", null, "]"),
          ),
        ),
      ),
    );

  const renderMathRootText = (text, refKey) =>
    React.createElement(
      "span",
      {
        className: "inline-root-holder",
        ref: (el) => {
          if (refKey) formulaRefs.current[refKey] = el;
        },
      },
      React.createElement(
        "math",
        {
          className: "math-root-inline",
          display: "inline",
          role: "img",
          "aria-label": APP_DATA.aria.squareRootOf + " " + text,
        },
        React.createElement(
          "mrow",
          null,
          React.createElement(
            "msqrt",
            null,
            React.createElement("mtext", { className: "math-root-text" }, text),
          ),
        ),
      ),
    );

  const renderYellowValueBox = () => {
    const pqRoot = yellowRootsSwapped
      ? SIDE_LENGTH_CONFIG.AC.rootValue()
      : SIDE_LENGTH_CONFIG.AB.rootValue();
    const prRoot = yellowRootsSwapped
      ? SIDE_LENGTH_CONFIG.AB.rootValue()
      : SIDE_LENGTH_CONFIG.AC.rootValue();

    return React.createElement(
      "div",
      {
        className:
          "yellow-value-box" + (yellowBoxVisible ? " is-visible" : ""),
      },
      React.createElement(
        "div",
        { className: "yellow-value-row" },
        React.createElement(
          "span",
          { className: "yellow-value-side is-cyan" },
          "PQ",
        ),
        React.createElement("span", { className: "yellow-value-eq" }, " = "),
        React.createElement(
          "span",
          {
            className: "yellow-value-root is-orange",
            style: { opacity: yellowRootsVisible ? 1 : 0 },
            ref: (el) => {
              yellowValueRefs.current.pq = el;
            },
          },
          renderMathRootText(pqRoot),
        ),
      ),
      React.createElement(
        "div",
        { className: "yellow-value-row" },
        React.createElement(
          "span",
          { className: "yellow-value-side is-cyan" },
          "PR",
        ),
        React.createElement("span", { className: "yellow-value-eq" }, " = "),
        React.createElement(
          "span",
          {
            className: "yellow-value-root is-orange",
            style: { opacity: yellowRootsVisible ? 1 : 0 },
            ref: (el) => {
              yellowValueRefs.current.pr = el;
            },
          },
          renderMathRootText(prRoot),
        ),
      ),
    );
  };

  const renderDistanceFormula = () =>
    React.createElement(
      "div",
      { className: "distance-formula-box" },
      React.createElement(
        "div",
        { className: "distance-title" },
        APP_DATA.rightPanel.distanceTitle,
      ),
      React.createElement(
        "div",
        { className: "distance-formula-yellow" },
        React.createElement(
          "span",
          { className: "formula-prefix" },
          APP_DATA.math.distanceVariable + " = ",
        ),
        renderMathRootFormula(),
      ),
    );

  const renderExpandedFormulaBox = (sideLabel, phase) =>
    React.createElement(
      "button",
      {
        id: "calc-box-expanded",
        className:
          "calc-dashed-box" +
          (phase === "expanded" ? " is-clickable" : "") +
          (phase === "simplified" ||
          phase === "rootAnimating" ||
          phase === "done"
            ? " is-complete"
            : ""),
        onClick: handleCalcBoxClick,
        disabled: phase !== "expanded",
      },
      React.createElement(
        "span",
        { className: "formula-prefix" },
        sideLabel + " = ",
      ),
      renderMathRootFormula(formulaSlots),
    );

  const renderSimplifiedBox = (sideLabel, phase, simplifiedDisplay) =>
    React.createElement(
      "button",
      {
        id: "calc-box-simplified",
        className:
          "calc-dashed-box" +
          (phase === "simplified" ? " is-clickable" : "") +
          (phase === "rootAnimating" || phase === "done"
            ? " is-complete"
            : ""),
        onClick: handleCalcBoxClick,
        disabled: phase !== "simplified",
      },
      React.createElement(
        "span",
        { className: "formula-prefix" },
        sideLabel + " = ",
      ),
      renderMathRootText(simplifiedDisplay),
    );

  const renderRootBox = (sideLabel, rootValue) =>
    React.createElement(
      "div",
      {
        id: "calc-box-root",
        className: "calc-dashed-box is-final",
      },
      React.createElement(
        "span",
        { className: "formula-prefix" },
        sideLabel + " = ",
      ),
      renderMathRootText(rootValue, "rootResult"),
    );

  const renderEqText = () =>
    React.createElement(
      "div",
      { className: "step7-eq-text", "aria-hidden": false },
      React.createElement(
        "span",
        {
          className: "step7-eq-letter is-cyan",
          ref: (el) => {
            eqRefs.current.Q = el;
          },
        },
        "Q",
      ),
      React.createElement(
        "span",
        {
          className: "step7-eq-letter is-cyan",
          ref: (el) => {
            eqRefs.current.R = el;
          },
        },
        "R",
      ),
      React.createElement("span", { className: "step7-eq-arrow" }, " ↔ "),
      React.createElement(
        "span",
        {
          className: "step7-eq-letter is-orange",
          ref: (el) => {
            eqRefs.current.B = el;
          },
        },
        "B",
      ),
      React.createElement(
        "span",
        {
          className: "step7-eq-letter is-orange",
          ref: (el) => {
            eqRefs.current.C = el;
          },
        },
        "C",
      ),
    );

  const renderStep7PromptPanel = () =>
    React.createElement(
      "div",
      {
        className:
          "step7-panel step7-prompt-panel" +
          (step7PromptVisible ? "" : " is-fading-out"),
      },
      React.createElement(
        "p",
        { className: "step7-intro-text" },
        APP_DATA.steps[7].intro,
      ),
      React.createElement(
        "div",
        { className: "step7-prompt-box" },
        APP_DATA.steps[7].promptBox,
      ),
    );

  const renderStep7ResultPanel = () =>
    React.createElement(
      "div",
      {
        className:
          "step7-panel step7-result-panel" +
          (step7Reveal ? " is-revealed" : " is-pending"),
      },
      renderEqText(),
      React.createElement(
        "div",
        { className: "step7-below-space" },
        APP_DATA.steps[7].belowText,
      ),
    );

  const renderStep8Panel = () =>
    React.createElement(
      "div",
      {
        className: "step7-panel step7-result-panel is-revealed",
      },
      renderEqText(),
      React.createElement(
        "div",
        { className: "step7-below-space is-step8-visible" },
        APP_DATA.steps[8].belowText,
      ),
    );

  const renderStep9Panel = () => {
    const showControls =
      step9Phase === "controls" ||
      step9Phase === "ready" ||
      step9Phase === "done";

    return React.createElement(
      "div",
      { className: "step7-panel step7-result-panel is-revealed step9-panel" },
      renderEqText(),
      React.createElement(
        "div",
        { className: "step7-below-space is-step8-visible step9-below-space" },
        showControls
          ? React.createElement(
              React.Fragment,
              null,
              React.createElement(
                "div",
                { className: "step9-rotate-title" },
                APP_DATA.steps[9].rotateTitle,
              ),
              React.createElement(
                "div",
                {
                  className:
                    "step9-rotate-wrap" + (sliderWrong ? " is-wrong" : ""),
                },
                React.createElement(RotateControls, {
                  direction: rotationDirection,
                  sliderValue: rotationDegrees,
                  sliderDisabled: !rotationDirection || rotationLocked,
                  controlsDisabled: rotationLocked,
                  showSliderPulse: false,
                  onDirection: handleStep9Direction,
                  onSliderChange: handleStep9SliderChange,
                  onSliderDragStart: function () {},
                  onSliderCommit: handleStep9SliderCommit,
                }),
              ),
            )
          : React.createElement(
              React.Fragment,
              null,
              React.createElement(
                "div",
                { className: "step9-intro-text" },
                APP_DATA.steps[9].belowText,
              ),
              React.createElement(
                "button",
                {
                  id: "step9-rotate-button",
                  className: "step9-rotate-button",
                  onClick: handleStep9RotateClick,
                },
                APP_DATA.steps[9].rotateButton,
              ),
            ),
      ),
    );
  };

  const renderStep10Panel = () => {
    const showControls =
      step10Phase === "controls" || step10Phase === "done";

    return React.createElement(
      "div",
      { className: "step7-panel step7-result-panel is-revealed step10-panel" },
      renderEqText(),
      React.createElement(
        "div",
        { className: "step7-below-space is-step8-visible step10-below-space" },
        showControls
          ? React.createElement(
              React.Fragment,
              null,
              React.createElement(
                "div",
                { className: "step10-translate-title" },
                APP_DATA.steps[10].translateTitle,
              ),
              React.createElement(
                "div",
                {
                  className:
                    "step10-translate-wrap" +
                    (translateLocked ? " is-locked" : ""),
                },
                React.createElement(TranslateControls, {
                  vector: translationVector,
                  enabledArrow: translateLocked ? null : "all",
                  hintArrow: null,
                  onMove: handleStep10Move,
                }),
              ),
            )
          : React.createElement(
              React.Fragment,
              null,
              React.createElement(
                "div",
                { className: "step10-intro-text" },
                APP_DATA.steps[10].belowText,
              ),
              React.createElement(
                "button",
                {
                  id: "step10-translate-button",
                  className: "step10-translate-button",
                  onClick: handleStep10TranslateClick,
                },
                APP_DATA.steps[10].translateButton,
              ),
            ),
      ),
    );
  };

  const renderStep11Panel = () => {
    const showResult =
      step11ShowResult ||
      step11Phase === "flying" ||
      step11Phase === "done";
    const resultPts = step11ResultPoints;

    return React.createElement(
      "div",
      { className: "step7-panel step7-result-panel is-revealed step11-panel" },
      renderEqText(),
      React.createElement(
        "div",
        { className: "step7-below-space is-step8-visible step11-below-space" },
        showResult
          ? React.createElement(
              "div",
              {
                className: "step11-result-text",
                style: { opacity: step11ResultOpacity },
              },
              React.createElement(
                "div",
                { className: "step11-result-intro" },
                APP_DATA.steps[11].resultIntro,
              ),
              React.createElement(
                "div",
                { className: "step11-result-line" },
                React.createElement(
                  "span",
                  null,
                  APP_DATA.steps[11].resultPPrefix,
                ),
                React.createElement(
                  "span",
                  {
                    className: "step11-result-p",
                    ref: (el) => {
                      step11ResultRefs.current.p1 = el;
                    },
                  },
                  resultPts ? formatPLabel(resultPts.first) : "P(-5, -3)",
                ),
              ),
              React.createElement(
                "div",
                { className: "step11-result-or" },
                APP_DATA.steps[11].resultOr,
              ),
              React.createElement(
                "div",
                { className: "step11-result-line" },
                React.createElement(
                  "span",
                  null,
                  APP_DATA.steps[11].resultPPrefix,
                ),
                React.createElement(
                  "span",
                  {
                    className: "step11-result-p",
                    ref: (el) => {
                      step11ResultRefs.current.p2 = el;
                    },
                  },
                  resultPts ? formatPLabel(resultPts.second) : "P(0, 2)",
                ),
              ),
            )
          : React.createElement(
              React.Fragment,
              null,
              React.createElement(
                "div",
                { className: "step11-intro-text" },
                APP_DATA.steps[11].belowText,
              ),
              React.createElement(
                "button",
                {
                  id: "step11-reflect-button",
                  className: "step11-reflect-button",
                  onClick: handleStep11ReflectClick,
                },
                APP_DATA.steps[11].reflectButton,
              ),
            ),
      ),
    );
  };

  const renderStep12Or13Panel = () => {
    const belowText =
      step === 13
        ? APP_DATA.steps[13].belowText
        : APP_DATA.steps[12].belowText;

    return React.createElement(
      "div",
      {
        className:
          "step7-panel step7-result-panel is-revealed step12-panel",
      },
      renderEqText(),
      renderYellowValueBox(),
      yellowBelowVisible
        ? React.createElement(
            "div",
            {
              className: "step7-below-space is-step8-visible step12-below-space",
              style: { opacity: yellowBelowOpacity },
            },
            belowText,
          )
        : null,
    );
  };

  const renderRightPanel = () => {
    if (step < 5) return null;

    if (step === 7) {
      if (step7ShowResult || step7Phase === "done" || step7Phase === "flying") {
        return renderStep7ResultPanel();
      }
      return renderStep7PromptPanel();
    }

    if (step === 8) {
      return renderStep8Panel();
    }

    if (step === 9) {
      return renderStep9Panel();
    }

    if (step === 10) {
      return renderStep10Panel();
    }

    if (step === 11) {
      return renderStep11Panel();
    }

    if (step === 12 || step === 13) {
      return renderStep12Or13Panel();
    }

    if (step === 5 && step5Phase === "intro") {
      return React.createElement(
        "div",
        { className: "solve-intro-panel" },
        React.createElement(
          "div",
          { className: "solve-property-box" },
          APP_DATA.rightPanel.congruentProperty,
        ),
        React.createElement(
          "p",
          { className: "solve-use-text" },
          APP_DATA.rightPanel.useProperty,
        ),
        React.createElement(
          "button",
          {
            id: "find-side-button",
            className: "find-side-button",
            onClick: handleFindSideLengths,
          },
          APP_DATA.rightPanel.findButton,
        ),
      );
    }

    if (step === 6) {
      const activeSideKey = getStep6CurrentSide(step6Phase);
      const activeSideConfig = activeSideKey
        ? SIDE_LENGTH_CONFIG[activeSideKey]
        : null;
      const activeExpanded =
        step6Phase === "abExpanded" ||
        step6Phase === "bcExpanded" ||
        step6Phase === "acExpanded";
      const activeSimplified =
        step6Phase === "abSimplified" ||
        step6Phase === "bcSimplified" ||
        step6Phase === "acSimplified";
      const activeRootAnimating =
        step6Phase === "abRootAnimating" ||
        step6Phase === "bcRootAnimating" ||
        step6Phase === "acRootAnimating";

      return React.createElement(
        "div",
        { className: "calculation-panel" },
        renderDistanceFormula(),
        activeSideConfig &&
        (step6Phase.indexOf("Filling") !== -1 ||
          activeExpanded ||
          activeSimplified ||
          activeRootAnimating)
          ? renderExpandedFormulaBox(
              activeSideConfig.label(),
              activeExpanded
                ? "expanded"
                : activeSimplified || activeRootAnimating
                  ? "simplified"
                  : "filling",
            )
          : null,
        activeSideConfig && (activeSimplified || activeRootAnimating)
          ? renderSimplifiedBox(
              activeSideConfig.label(),
              activeSimplified ? "simplified" : "rootAnimating",
              activeSideConfig.simplifiedDisplay(),
            )
          : null,
        activeSideConfig && activeRootAnimating
          ? renderRootBox(
              activeSideConfig.label(),
              activeSideConfig.rootValue(),
            )
          : null,
      );
    }

    // Step 5 calculation panel only (never steps 7+)
    if (step !== 5) return null;

    return React.createElement(
      "div",
      { className: "calculation-panel" },
      renderDistanceFormula(),
      step5Phase === "qrFilling" ||
      step5Phase === "expanded" ||
      step5Phase === "simplified" ||
      step5Phase === "rootAnimating" ||
      step5Phase === "done"
        ? renderExpandedFormulaBox(
            APP_DATA.math.qr,
            step5Phase === "expanded"
              ? "expanded"
              : step5Phase === "simplified" ||
                  step5Phase === "rootAnimating" ||
                  step5Phase === "done"
                ? "simplified"
                : "filling",
          )
        : null,
      step5Phase === "simplified" ||
      step5Phase === "rootAnimating" ||
      step5Phase === "done"
        ? renderSimplifiedBox(
            APP_DATA.math.qr,
            step5Phase === "simplified" ? "simplified" : "rootAnimating",
            "[(2)² + (-2)²]",
          )
        : null,
      step5Phase === "rootAnimating" || step5Phase === "done"
        ? renderRootBox(APP_DATA.math.qr, APP_DATA.math.rootEight)
        : null,
    );
  };

  const hasRightPanel = step >= 5;

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "div",
      {
        className:
          "main-canvas-container" + (hasRightPanel ? " has-right-panel" : ""),
      },
      React.createElement(
        "div",
        { className: "main-canvas-left is-visible" },
        React.createElement(TranslationGraphPanel, {
          points: graphPoints,
          segments: graphSegments,
          polygons: graphPolygons,
          rootLabels: rootLabels,
          cloneRootLabels: cloneRootLabels,
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
            (hasRightPanel ? " is-visible" : " is-hidden-step1"),
        },
        renderRightPanel(),
      ),
    ),
    flyCloneEls,
  );
};
