const R_CYCLE = [
  { x: 2, y: 4 },
  { x: 1, y: 4 },
  { x: 2, y: 3 },
  { x: 3, y: 4 },
];

const QPRIME_CYCLE = [
  { x: 2, y: -4 },
  { x: 1, y: -4 },
  { x: 1, y: -3 },
  { x: 3, y: -4 },
];

const KNOWN_POINTS = [
  {
    key: "P",
    highlightId: "highlight-p",
    label: () => APP_DATA.graph.labelP,
    labelRefKey: "P",
    x: 2,
    y: 1,
    color: TRANSLATION_GRAPH_COLORS.preimage,
    labelPlacement: "below",
  },
  {
    key: "Q",
    highlightId: "highlight-q",
    label: () => APP_DATA.graph.labelQ,
    labelRefKey: "Q",
    x: 4,
    y: 3,
    color: TRANSLATION_GRAPH_COLORS.preimage,
    labelPlacement: "right",
  },
  {
    key: "PPrime",
    highlightId: "highlight-p-prime",
    label: () => APP_DATA.graph.labelPPrime,
    labelRefKey: "PPrime",
    x: 1,
    y: -2,
    color: TRANSLATION_GRAPH_COLORS.image,
    labelPlacement: "below",
  },
  {
    key: "RPrime",
    highlightId: "highlight-r-prime",
    label: () => APP_DATA.graph.labelRPrime,
    labelRefKey: "RPrime",
    x: 4,
    y: -3,
    color: TRANSLATION_GRAPH_COLORS.image,
    labelPlacement: "right",
  },
];

const STEP3_FLY_SEQUENCE = [
  { graphKey: "P", tableKey: "pre-p" },
  { graphKey: "Q", tableKey: "pre-q" },
  { graphKey: "R", tableKey: "pre-r" },
  { graphKey: "PPrime", tableKey: "img-p" },
  { graphKey: "QPrime", tableKey: "img-q" },
  { graphKey: "RPrime", tableKey: "img-r" },
];

const MainCanvas = ({
  step,
  step2Phase,
  onStep2AnimComplete,
  onHighlightChange,
  step3Phase,
  onStep3PhaseChange,
  step4Phase,
  step4Selected,
  step4Feedback,
  onStep4Select,
  blinkCell,
  step5Phase,
  step5Selected,
  onStep5Select,
  onStep5PhaseChange,
  onNavAnimating,
  step6Phase,
  onStep6Apply,
  onStep6PhaseChange,
}) => {
  const { useState, useEffect, useRef, useCallback, useMemo } = React;

  const animStartedRef = useRef(false);
  const step3AnimRef = useRef(false);
  const labelRefs = useRef({});
  const cellRefs = useRef({});
  const formulaRefs = useRef({});
  const step5AnimRef = useRef(false);
  const step5FormulaAnimRef = useRef(false);
  const step5RotationFlyRef = useRef(false);
  const step6AnimRef = useRef(false);

  const [leftVisible, setLeftVisible] = useState(false);
  const [rightVisible, setRightVisible] = useState(false);
  const [flyClones, setFlyClones] = useState([]);
  const [pointStates, setPointStates] = useState({});
  const [segments, setSegments] = useState({});
  const [showUnknown, setShowUnknown] = useState(false);
  const [unknownR, setUnknownR] = useState({ x: 2, y: 4 });
  const [unknownQPrime, setUnknownQPrime] = useState({ x: 2, y: -4 });
  const [tableVisible, setTableVisible] = useState(false);
  const [revealedCells, setRevealedCells] = useState(null);
  const [rotationColumnOpen, setRotationColumnOpen] = useState(false);
  const [rotationCells, setRotationCells] = useState([null, null, null]);
  const [rotationMerged, setRotationMerged] = useState(false);
  const [hideRotTop, setHideRotTop] = useState(false);
  const [hideRotBottom, setHideRotBottom] = useState(false);
  const [allHighlighted, setAllHighlighted] = useState(false);
  const [rotationFirstDashed, setRotationFirstDashed] = useState(false);
  const [formulaState, setFormulaState] = useState({
    panelVisible: false,
    formulaObj: false,
    formulaArrow: false,
    formulaImg: false,
    useGeneric: false,
    movedUp: false,
    switching: null,
  });

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
      const color = options.color || "#ffffff";

      setFlyClones((prev) =>
        prev.concat([
          {
            id: id,
            mode: "text",
            text: options.text || sourceEl.textContent.trim(),
            color: color,
            startX: src.left + src.width / 2,
            startY: src.top + src.height / 2,
            dx: dx,
            dy: dy,
            animating: false,
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

  const flyBetweenRefs = useCallback(
    async (fromKey, toKey, text, color) => {
      await delay(50);
      const sourceEl = cellRefs.current[fromKey];
      const targetEl = cellRefs.current[toKey];
      await animateFly(sourceEl, targetEl, { text: text, color: color });
    },
    [animateFly],
  );

  const animateCellFly = useCallback((sourceKey, targetKey, cloneId) => {
    const id = cloneId || "cell-" + sourceKey;
    return new Promise((resolve) => {
      const sourceEl = cellRefs.current[sourceKey];
      const targetEl = cellRefs.current[targetKey];
      if (!sourceEl || !targetEl) {
        resolve();
        return;
      }
      const src = sourceEl.getBoundingClientRect();
      const tgt = targetEl.getBoundingClientRect();
      const computed = window.getComputedStyle(sourceEl);
      const dx = tgt.left + tgt.width / 2 - (src.left + src.width / 2);
      const dy = tgt.top + tgt.height / 2 - (src.top + src.height / 2);

      setFlyClones((prev) =>
        prev.concat([
          {
            id: id,
            mode: "cell",
            text: sourceEl.textContent.trim(),
            startX: src.left,
            startY: src.top,
            width: src.width,
            height: src.height,
            dx: dx,
            dy: dy,
            backgroundColor: computed.backgroundColor,
            border: computed.border,
            color: computed.color,
            fontSize: computed.fontSize,
            fontWeight: computed.fontWeight,
            textShadow: computed.textShadow,
            animating: false,
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

  const revealPointOpacity = useCallback(async (key) => {
    setPointStates((prev) => ({
      ...prev,
      [key]: { opacity: 0, labelVisible: false },
    }));
    await delay(30);
    setPointStates((prev) => ({
      ...prev,
      [key]: { opacity: 1, labelVisible: false },
    }));
    await delay(320);
  }, []);

  const animatePosition = useCallback((from, to, duration, setter) => {
    return new Promise((resolve) => {
      const startTime = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        setter({
          x: from.x + (to.x - from.x) * eased,
          y: from.y + (to.y - from.y) * eased,
        });
        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(tick);
    });
  }, []);

  const runUnknownCycle = useCallback(async () => {
    const CYCLE_MS = 900;
    const PAUSE_MS = 200;

    for (let i = 0; i < R_CYCLE.length; i++) {
      const fromR = i === 0 ? R_CYCLE[0] : R_CYCLE[i];
      const toR = R_CYCLE[(i + 1) % R_CYCLE.length];
      const fromQ = i === 0 ? QPRIME_CYCLE[0] : QPRIME_CYCLE[i];
      const toQ = QPRIME_CYCLE[(i + 1) % QPRIME_CYCLE.length];

      await Promise.all([
        animatePosition(fromR, toR, CYCLE_MS, setUnknownR),
        animatePosition(fromQ, toQ, CYCLE_MS, setUnknownQPrime),
      ]);
      await delay(PAUSE_MS);
    }
  }, [animatePosition]);

  const showCompletedGraph = useCallback(() => {
    animStartedRef.current = true;
    setLeftVisible(true);
    const allPoints = {};
    KNOWN_POINTS.forEach((pt) => {
      allPoints[pt.key] = { opacity: 1, labelVisible: true };
    });
    setPointStates(allPoints);
    setSegments({
      PQ: true,
      PPrimeRPrime: true,
      PR: true,
      QR: true,
      PPrimeQPrime: true,
      QPrimeRPrime: true,
    });
    setShowUnknown(true);
    setPointStates((prev) => ({
      ...prev,
      R: { opacity: 1, labelVisible: true },
      QPrime: { opacity: 1, labelVisible: true },
    }));
    setUnknownR(R_CYCLE[0]);
    setUnknownQPrime(QPRIME_CYCLE[0]);
  }, []);

  useEffect(() => {
    if (step !== 2) return;

    if (step2Phase === "done") {
      if (!animStartedRef.current) {
        showCompletedGraph();
      }
      return;
    }

    if (animStartedRef.current) return;
    animStartedRef.current = true;

    const runStep2Anim = async () => {
      setLeftVisible(true);
      await delay(450);

      for (let i = 0; i < KNOWN_POINTS.length; i++) {
        const pt = KNOWN_POINTS[i];
        if (typeof onHighlightChange === "function") {
          onHighlightChange(pt.highlightId);
        }
        await delay(200);

        await revealPointOpacity(pt.key);
        await delay(80);

        const sourceEl = document.getElementById(pt.highlightId);
        const targetEl = labelRefs.current[pt.labelRefKey];
        await animateFly(sourceEl, targetEl, {
          text: pt.label(),
          color: pt.color,
        });

        setPointStates((prev) => ({
          ...prev,
          [pt.key]: { opacity: 1, labelVisible: true },
        }));

        if (pt.key === "Q") {
          setSegments((prev) => ({ ...prev, PQ: true }));
        }
        if (pt.key === "RPrime") {
          setSegments((prev) => ({ ...prev, PPrimeRPrime: true }));
        }

        await delay(400);
      }

      await delay(500);

      if (typeof onHighlightChange === "function") {
        onHighlightChange("highlight-r-solve");
      }
      await delay(350);
      if (typeof onHighlightChange === "function") {
        onHighlightChange("highlight-qprime-solve");
      }
      await delay(400);

      setShowUnknown(true);
      setPointStates((prev) => ({
        ...prev,
        R: { opacity: 0, labelVisible: true },
        QPrime: { opacity: 0, labelVisible: true },
      }));
      await delay(30);
      setPointStates((prev) => ({
        ...prev,
        R: { opacity: 1, labelVisible: true },
        QPrime: { opacity: 1, labelVisible: true },
      }));
      setSegments((prev) => ({
        ...prev,
        PR: true,
        QR: true,
        PPrimeQPrime: true,
        QPrimeRPrime: true,
      }));

      await delay(600);
      await runUnknownCycle();

      if (typeof onHighlightChange === "function") {
        onHighlightChange(null);
      }
      if (typeof onStep2AnimComplete === "function") {
        onStep2AnimComplete();
      }
    };

    runStep2Anim();
  }, [
    step,
    step2Phase,
    animateFly,
    revealPointOpacity,
    runUnknownCycle,
    onHighlightChange,
    onStep2AnimComplete,
    showCompletedGraph,
  ]);

  useEffect(() => {
    if (step !== 3 || step3Phase !== "initial" || step3AnimRef.current) return;
    step3AnimRef.current = true;

    const runStep3Anim = async () => {
      if (typeof onNavAnimating === "function") onNavAnimating(true);
      setTableVisible(true);
      setRevealedCells({});
      await delay(500);

      for (let i = 0; i < STEP3_FLY_SEQUENCE.length; i++) {
        const item = STEP3_FLY_SEQUENCE[i];
        const sourceEl = labelRefs.current[item.graphKey];
        const targetEl = cellRefs.current[item.tableKey];
        const ptColor =
          item.tableKey.indexOf("pre-") === 0
            ? TRANSLATION_GRAPH_COLORS.preimage
            : TRANSLATION_GRAPH_COLORS.image;
        await animateFly(sourceEl, targetEl, { color: ptColor });
        setRevealedCells((prev) => ({
          ...(prev || {}),
          [item.tableKey]: true,
        }));
        await delay(280);
      }

      if (typeof onStep3PhaseChange === "function") {
        onStep3PhaseChange("done");
      }
      if (typeof onNavAnimating === "function") onNavAnimating(false);
    };

    runStep3Anim();
  }, [
    step,
    step3Phase,
    animateFly,
    onStep3PhaseChange,
    onNavAnimating,
  ]);

  useEffect(() => {
    if (step === 2 && step2Phase === "initial") {
      step3AnimRef.current = false;
    }
    if (step === 2) {
      step3AnimRef.current = false;
    }
    if (step === 1) {
      animStartedRef.current = false;
      step3AnimRef.current = false;
      setLeftVisible(false);
      setTableVisible(false);
      setRevealedCells(null);
      setPointStates({});
      setSegments({});
      setShowUnknown(false);
      setUnknownR({ x: 2, y: 4 });
      setUnknownQPrime({ x: 2, y: -4 });
      return;
    }
    if (step === 3) {
      setLeftVisible(true);
      setTableVisible(true);
      if (step3Phase === "initial") {
        setRightVisible(true);
      } else {
        setRightVisible(true);
        setRevealedCells({
          "pre-p": true,
          "pre-q": true,
          "pre-r": true,
          "img-p": true,
          "img-q": true,
          "img-r": true,
        });
      }
    }
    if (step === 4) {
      setLeftVisible(true);
      setTableVisible(true);
      setRevealedCells({
        "pre-p": true,
        "pre-q": true,
        "pre-r": true,
        "img-p": true,
        "img-q": true,
        "img-r": true,
      });
      setTimeout(() => setRightVisible(true), 80);
    }
    if (step < 5) {
      setRotationColumnOpen(false);
      setRotationCells([null, null, null]);
      setRotationFirstDashed(false);
      step5AnimRef.current = false;
      step5FormulaAnimRef.current = false;
      step5RotationFlyRef.current = false;
      setFormulaState({
        panelVisible: false,
        formulaObj: false,
        formulaArrow: false,
        formulaImg: false,
        useGeneric: false,
        movedUp: false,
        switching: null,
      });
    }
    if (step === 5) {
      setLeftVisible(true);
      setTableVisible(true);
      setRevealedCells({
        "pre-p": true,
        "pre-q": true,
        "pre-r": true,
        "img-p": true,
        "img-q": true,
        "img-r": true,
      });
    }
    if (step < 6) {
      setAllHighlighted(false);
      setRotationMerged(false);
      setHideRotTop(false);
      setHideRotBottom(false);
      step6AnimRef.current = false;
    }
    if (step === 6) {
      setRightVisible(true);
      setFormulaState((fs) => ({
        ...fs,
        panelVisible: true,
        formulaObj: true,
        formulaArrow: true,
        formulaImg: true,
        useGeneric: true,
        movedUp: true,
      }));
    }
    if (step >= 7) {
      setLeftVisible(true);
      setTableVisible(true);
      setRightVisible(true);
      setRevealedCells({
        "pre-p": true,
        "pre-q": true,
        "pre-r": true,
        "img-p": true,
        "img-q": true,
        "img-r": true,
      });
      setRotationColumnOpen(true);
      setRotationMerged(true);
      setRotationCells([null, APP_DATA.table.rotationValue, null]);
      setFormulaState({
        panelVisible: true,
        formulaObj: true,
        formulaArrow: true,
        formulaImg: true,
        useGeneric: true,
        movedUp: true,
        switching: null,
      });
    }
  }, [step, step3Phase]);

  useEffect(() => {
    if (step !== 5 || step5Phase !== "entering") return;
    if (step5AnimRef.current) return;
    step5AnimRef.current = true;

    const runStep5Enter = async () => {
      setRightVisible(false);
      setRotationColumnOpen(false);
      await delay(350);
      setRotationColumnOpen(true);
      await delay(700);
      if (typeof onStep5PhaseChange === "function") {
        onStep5PhaseChange("formulaAnim");
      }
    };
    runStep5Enter();
  }, [step, step5Phase, onStep5PhaseChange]);

  useEffect(() => {
    if (step5Phase !== "formulaAnim" || step5FormulaAnimRef.current) return;
    step5FormulaAnimRef.current = true;

    const runFormulaAnim = async () => {
      if (typeof onNavAnimating === "function") onNavAnimating(true);
      setRightVisible(true);
      setFormulaState((fs) => ({ ...fs, panelVisible: true }));
      await delay(450);

      const f = APP_DATA.formula;
      await flyBetweenRefs(
        "pre-p",
        "formula-obj",
        f.objNumeric,
        TRANSLATION_GRAPH_COLORS.preimage,
      );
      setFormulaState((fs) => ({ ...fs, formulaObj: true }));
      await delay(200);

      await flyBetweenRefs(
        "img-p",
        "formula-img",
        f.imgNumeric,
        TRANSLATION_GRAPH_COLORS.image,
      );
      setFormulaState((fs) => ({ ...fs, formulaImg: true }));
      await delay(200);
      setFormulaState((fs) => ({ ...fs, formulaArrow: true }));
      await delay(1000);

      setFormulaState((fs) => ({ ...fs, switching: "formulaObj" }));
      await delay(350);
      setFormulaState((fs) => ({
        ...fs,
        useGeneric: true,
        switching: null,
        formulaObj: true,
      }));
      await delay(350);

      setFormulaState((fs) => ({ ...fs, switching: "formulaImg" }));
      await delay(350);
      setFormulaState((fs) => ({
        ...fs,
        switching: null,
        formulaImg: true,
      }));
      await delay(1000);

      setFormulaState((fs) => ({ ...fs, movedUp: true }));
      await delay(450);
      if (typeof onStep5PhaseChange === "function") {
        onStep5PhaseChange("mcq");
      }
      if (typeof onNavAnimating === "function") onNavAnimating(false);
    };
    runFormulaAnim();
  }, [step5Phase, flyBetweenRefs, onStep5PhaseChange, onNavAnimating]);

  useEffect(() => {
    if (step5Phase !== "rotationFly" || step5RotationFlyRef.current) return;
    step5RotationFlyRef.current = true;

    const runRotationFly = async () => {
      if (typeof onNavAnimating === "function") onNavAnimating(true);
      const val = APP_DATA.table.rotationValue;
      const btnEl = document.getElementById("rotation-mcq-opt-0");
      const targetEl = cellRefs.current["rot-0"];
      await animateFly(btnEl, targetEl, { text: val, color: "#ffffff" });
      setRotationCells([val, null, null]);
      setRotationFirstDashed(true);
      await delay(350);
      if (typeof onStep5PhaseChange === "function") {
        onStep5PhaseChange("done");
      }
      if (typeof onNavAnimating === "function") onNavAnimating(false);
    };
    runRotationFly();
  }, [step5Phase, animateFly, onStep5PhaseChange, onNavAnimating]);

  useEffect(() => {
    if (step6Phase !== "applying" || step6AnimRef.current) return;
    step6AnimRef.current = true;

    const runApplyAndMerge = async () => {
      const val = APP_DATA.table.rotationValue;
      if (typeof onNavAnimating === "function") onNavAnimating(true);
      setAllHighlighted(true);
      setRotationFirstDashed(false);
      await delay(400);

      await flyBetweenRefs("rot-val-0", "rot-1", val);
      setRotationCells([val, val, null]);
      await delay(250);
      await flyBetweenRefs("rot-val-0", "rot-2", val);
      setRotationCells([val, val, val]);
      await delay(350);

      setHideRotTop(true);
      setHideRotBottom(true);
      await delay(40);
      await Promise.all([
        animateCellFly("rot-0", "rot-1", "merge-top"),
        animateCellFly("rot-2", "rot-1", "merge-bottom"),
      ]);
      await delay(200);

      setRotationMerged(true);
      setRotationCells([null, val, null]);
      if (typeof onStep6PhaseChange === "function") {
        onStep6PhaseChange("done");
      }
      if (typeof onNavAnimating === "function") onNavAnimating(false);
    };
    runApplyAndMerge();
  }, [step6Phase, flyBetweenRefs, animateCellFly, onStep6PhaseChange, onNavAnimating]);

  const dynamicLabelPlacement = (y) => (y > 2 ? "above" : "below");

  const graphPoints = useMemo(() => {
    const pts = [];

    KNOWN_POINTS.forEach((pt) => {
      const state = pointStates[pt.key];
      if (!state) return;
      pts.push({
        id: pt.key,
        x: pt.x,
        y: pt.y,
        color: pt.color,
        label: pt.label(),
        labelPlacement: pt.labelPlacement,
        opacity: state.opacity,
        labelOpacity: state.labelVisible ? 1 : 0,
        showLabel: state.opacity > 0,
        labelRefKey: pt.labelRefKey,
      });
    });

    if (showUnknown) {
      const rOpacity =
        pointStates.R && pointStates.R.opacity != null
          ? pointStates.R.opacity
          : 1;
      const qOpacity =
        pointStates.QPrime && pointStates.QPrime.opacity != null
          ? pointStates.QPrime.opacity
          : 1;
      pts.push({
        id: "R",
        x: unknownR.x,
        y: unknownR.y,
        color: TRANSLATION_GRAPH_COLORS.preimage,
        label: APP_DATA.graph.labelRUnknown,
        labelPlacement: dynamicLabelPlacement(unknownR.y),
        opacity: rOpacity,
        labelOpacity: 1,
        showLabel: true,
        labelRefKey: "R",
      });
      pts.push({
        id: "QPrime",
        x: unknownQPrime.x,
        y: unknownQPrime.y,
        color: TRANSLATION_GRAPH_COLORS.image,
        label: APP_DATA.graph.labelQPrimeUnknown,
        labelPlacement: dynamicLabelPlacement(unknownQPrime.y),
        opacity: qOpacity,
        labelOpacity: 1,
        showLabel: true,
        labelRefKey: "QPrime",
      });
    }

    return pts;
  }, [pointStates, showUnknown, unknownR, unknownQPrime]);

  const graphSegments = useMemo(() => {
    const segs = [];
    const p = { x: 2, y: 1 };
    const q = { x: 4, y: 3 };
    const pPrime = { x: 1, y: -2 };
    const rPrime = { x: 4, y: -3 };

    if (segments.PQ) {
      segs.push({
        from: p,
        to: q,
        color: TRANSLATION_GRAPH_COLORS.preimage,
        dashed: false,
      });
    }
    if (segments.PPrimeRPrime) {
      segs.push({
        from: pPrime,
        to: rPrime,
        color: TRANSLATION_GRAPH_COLORS.image,
        dashed: false,
      });
    }
    if (segments.PR) {
      segs.push({
        from: p,
        to: unknownR,
        color: TRANSLATION_GRAPH_COLORS.preimage,
        dashed: true,
      });
      segs.push({
        from: q,
        to: unknownR,
        color: TRANSLATION_GRAPH_COLORS.preimage,
        dashed: true,
      });
    }
    if (segments.PPrimeQPrime) {
      segs.push({
        from: pPrime,
        to: unknownQPrime,
        color: TRANSLATION_GRAPH_COLORS.image,
        dashed: true,
      });
      segs.push({
        from: unknownQPrime,
        to: rPrime,
        color: TRANSLATION_GRAPH_COLORS.image,
        dashed: true,
      });
    }
    return segs;
  }, [segments, unknownR, unknownQPrime]);

  const columnsHidden = step === 1;
  const rightHidden = step <= 2;
  const showLeftGraph = step === 2 || step === 3;
  const showLeftTable = (step >= 4 && step <= 6) || step >= 7;
  const showRightTable = step === 3;

  const sharedTableProps = {
    cellRefs: cellRefs,
    revealedCells: revealedCells,
    blinkCell: blinkCell,
    qPrimeKnown: false,
    rKnown: false,
  };

  const leftTableProps = {
    ...sharedTableProps,
    visible: tableVisible && showLeftTable,
    showRotationColumn: step >= 5,
    rotationColumnOpen: step >= 5 && (rotationColumnOpen || step >= 7),
    rotationCells: rotationCells,
    rotationMerged: rotationMerged,
    hideRotTop: hideRotTop,
    hideRotBottom: hideRotBottom,
    rotationFirstDashed: rotationFirstDashed,
    pRowGreen: step === 4 && step4Phase === "correct",
    dehighlightQR:
      (step === 4 && step4Phase === "correct") ||
      step === 5 ||
      (step === 6 && step6Phase === "initial"),
    allHighlighted: allHighlighted,
    rowHighlight:
      step === 5 && step5Phase !== "entering"
        ? { p: true, q: false, r: false }
        : null,
    rotMiddleHighlight: step === 5 && step5Phase !== "entering",
  };

  const rightTableProps = {
    ...sharedTableProps,
    twoColumnOnly: true,
    visible: tableVisible && showRightTable,
    contentVisible: true,
    showRotationColumn: false,
  };

  const renderRightPanel = () => {
    if (step === 4) {
      const mcq = APP_DATA.mcq.step4;
      const showFb =
        step4Phase === "wrong" || step4Phase === "correct";
      const picked =
        step4Selected !== null &&
        (step4Phase === "selected" || showFb);
      return React.createElement(McqPanel, {
        title: showFb ? null : mcq.title,
        options: mcq.options,
        layout: "row",
        selectedIndex: step4Selected,
        resultState: picked
          ? step4Selected === mcq.correctIndex
            ? "correct"
            : "wrong"
          : null,
        showFeedback: showFb,
        feedbackText: step4Feedback ? step4Feedback.text : null,
        feedbackType: step4Feedback ? step4Feedback.type : null,
        onSelect: onStep4Select,
      });
    }
    if (step === 5 || step === 6 || step >= 7) {
      return React.createElement(RotationFormulaPanel, {
        formulaState: formulaState,
        formulaRefs: formulaRefs,
        step5Phase: step5Phase || "done",
        step5Selected: step5Selected,
        onStep5Select: onStep5Select,
        step6Phase: step >= 6 ? step6Phase || "done" : null,
        onStep6Apply: onStep6Apply,
      });
    }
    if (showRightTable) {
      return React.createElement(PreImageImageTable, rightTableProps);
    }
    return null;
  };

  const renderLeftPanel = () => {
    if (showLeftTable) {
      return React.createElement(PreImageImageTable, leftTableProps);
    }
    if (showLeftGraph) {
      return React.createElement(TranslationGraphPanel, {
        points: graphPoints,
        segments: graphSegments,
        labelRefs: labelRefs,
      });
    }
    return null;
  };

  const flyCloneEls = flyClones.map((clone) =>
    clone.mode === "cell"
      ? React.createElement(
          "div",
          {
            key: clone.id,
            className: "fly-clone-text is-cell-clone",
            style: {
              left: clone.startX + "px",
              top: clone.startY + "px",
              width: clone.width + "px",
              height: clone.height + "px",
              backgroundColor: clone.backgroundColor,
              border: clone.border,
              color: clone.color,
              fontSize: clone.fontSize,
              fontWeight: clone.fontWeight,
              textShadow: clone.textShadow,
              transform: clone.animating
                ? "translate(" + clone.dx + "px, " + clone.dy + "px)"
                : "translate(0, 0)",
            },
          },
          clone.text,
        )
      : React.createElement(
          "div",
          {
            key: clone.id,
            className: "fly-clone-text",
            style: {
              left: clone.startX + "px",
              top: clone.startY + "px",
              color: clone.color || "#ffffff",
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
        renderLeftPanel(),
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
