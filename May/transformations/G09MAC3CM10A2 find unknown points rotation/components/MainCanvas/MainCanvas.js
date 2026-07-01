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

const R_FINAL = { x: 3, y: 4 };
const QPRIME_FINAL = { x: 3, y: -4 };

/** End scale for label clones flying onto the graph (step 2 & 9). Tweak this value. */
const PLOT_FLY_END_SCALE = 0.8;

const DEFAULT_FLY_DURATION = 780;
const STEP9_PLOT_FLY_DURATION = Math.round(DEFAULT_FLY_DURATION * 1.5);
const STEP9_LINE_GROW_DURATION = 900;

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
    labelPlacement: "above",
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
  step5Feedback,
  onStep5Select,
  onStep5PhaseChange,
  onNavAnimating,
  step6Phase,
  onStep6Apply,
  onStep6PhaseChange,
  step7Phase,
  onStep7PhaseChange,
  step8Phase,
  onStep8PhaseChange,
  step8ExitPhase,
  onStep8TransitionComplete,
  step9Phase,
  onStep9PhaseChange,
}) => {
  const { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } =
    React;

  const animStartedRef = useRef(false);
  const step3AnimRef = useRef(false);
  const labelRefs = useRef({});
  const cellRefs = useRef({});
  const formulaRefs = useRef({});
  const step5AnimRef = useRef(false);
  const step5FormulaAnimRef = useRef(false);
  const step5RotationFlyRef = useRef(false);
  const step6AnimRef = useRef(false);
  const step7AnimRef = useRef(false);
  const step8AnimRef = useRef(false);
  const step8To9AnimRef = useRef(false);
  const step9AnimRef = useRef(false);
  const step9InitRef = useRef(false);

  const [qPrimeKnown, setQPrimeKnown] = useState(false);
  const [rKnown, setRKnown] = useState(false);
  const [leftTableFlyHidden, setLeftTableFlyHidden] = useState(false);
  const [rightTablePrepInvisible, setRightTablePrepInvisible] = useState(false);
  const [rightTableRevealed, setRightTableRevealed] = useState(false);
  const [step8FlyTargetsReady, setStep8FlyTargetsReady] = useState(false);
  const [lineGrowKey, setLineGrowKey] = useState(null);
  const [step9CellHighlight, setStep9CellHighlight] = useState(null);
  const [step9HideUnknownBorders, setStep9HideUnknownBorders] = useState(false);

  const makeGenericSplitFormula = useCallback((clickable) => {
    return {
      panelVisible: true,
      formulaObj: true,
      formulaArrow: true,
      formulaImg: true,
      movedUp: false,
      centered: true,
      clickable: clickable,
      splitCoords: true,
      switching: null,
      objX: "x",
      objY: "y",
      imgSlot1: "y",
      imgSlot2: "x",
      imgNegate: true,
    };
  }, []);

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
      const srcStyle = window.getComputedStyle(sourceEl);
      const tgtStyle = window.getComputedStyle(targetEl);
      const startFontSize = options.startFontSize || srcStyle.fontSize;
      const endFontSize = options.shrinkWhileFlying
        ? startFontSize
        : options.endFontSize || tgtStyle.fontSize;
      const flyEndScale = options.shrinkWhileFlying
        ? options.flyEndScale != null
          ? options.flyEndScale
          : PLOT_FLY_END_SCALE
        : null;

      const flyDuration = options.flyDuration || DEFAULT_FLY_DURATION;
      setFlyClones((prev) =>
        prev.concat([
          {
            id: id,
            mode: "text",
            text: options.text || sourceEl.textContent.trim(),
            color: color,
            startFontSize: startFontSize,
            endFontSize: endFontSize,
            startScale: flyEndScale != null ? 1 : null,
            endScale: flyEndScale,
            fontWeight: srcStyle.fontWeight,
            startX: src.left + src.width / 2,
            startY: src.top + src.height / 2,
            dx: dx,
            dy: dy,
            animating: false,
            transitionDuration: flyDuration / 1000 + "s",
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
      }, flyDuration);
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

  const waitForElement = useCallback(async (getEl, attempts = 24) => {
    for (let i = 0; i < attempts; i++) {
      const el = getEl();
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) return el;
      }
      await delay(50);
    }
    return getEl();
  }, []);

  const flyFormulaFromCell = useCallback(
    async (cellKey, formulaKey, text, color) => {
      const sourceEl = await waitForElement(() => cellRefs.current[cellKey]);
      const targetEl = await waitForElement(
        () => formulaRefs.current[formulaKey],
      );
      await animateFly(sourceEl, targetEl, {
        text: text,
        color: color,
      });
    },
    [animateFly, waitForElement],
  );

  const flyFormulaPart = useCallback(
    async (fromKey, toKey, text, color) => {
      const sourceEl = await waitForElement(() => formulaRefs.current[fromKey]);
      const targetEl = await waitForElement(() => formulaRefs.current[toKey]);
      await animateFly(sourceEl, targetEl, {
        text: text,
        color: color,
      });
    },
    [animateFly, waitForElement],
  );

  const flyFormulaToCell = useCallback(
    async (formulaKey, cellKey, text, color) => {
      const sourceEl = await waitForElement(
        () => formulaRefs.current[formulaKey],
      );
      const targetEl = await waitForElement(() => cellRefs.current[cellKey]);
      await animateFly(sourceEl, targetEl, {
        text: text,
        color: color,
      });
    },
    [animateFly, waitForElement],
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

  const animateColumnFly = useCallback((snapshot) => {
    return new Promise((resolve) => {
      if (!snapshot) {
        resolve();
        return;
      }
      const id = snapshot.id || "column-" + Date.now();

      setFlyClones((prev) =>
        prev.concat([
          {
            id: id,
            mode: "column",
            startX: snapshot.startX,
            startY: snapshot.startY,
            width: snapshot.width,
            height: snapshot.height,
            outerHTML: snapshot.outerHTML,
            dx: snapshot.dx,
            dy: snapshot.dy,
            scaleX: snapshot.scaleX,
            scaleY: snapshot.scaleY,
            isRotation: snapshot.isRotation,
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
      }, 920);
    });
  }, []);

  const captureLeftColumnSnapshots = useCallback(() => {
    const wrap = cellRefs.current["left-table-wrap"];
    if (!wrap) return [];

    const columnDefs = [
      {
        selector: ".piit-col-pre",
        refKey: "col-pre",
        id: "fly-col-pre",
        targetKey: "right-col-pre",
        isRotation: false,
      },
      {
        selector: ".piit-col-trans",
        refKey: "col-rot",
        id: "fly-col-rot",
        targetKey: "right-col-rot",
        isRotation: true,
      },
      {
        selector: ".piit-col-img",
        refKey: "col-img",
        id: "fly-col-img",
        targetKey: "right-col-img",
        isRotation: false,
      },
    ];

    const wrapRotationColumnHtml = (columnHtml) =>
      '<div class="piit-table has-translation is-trans-open is-rot-merged">' +
      '<div class="piit-columns">' +
      columnHtml +
      "</div></div>";

    const snapshots = [];
    for (const def of columnDefs) {
      const sourceEl =
        wrap.querySelector(def.selector) ||
        (def.refKey ? cellRefs.current[def.refKey] : null);
      if (!sourceEl) continue;

      const src = sourceEl.getBoundingClientRect();
      if (src.width < 2 || src.height < 2) continue;

      const columnHtml = sourceEl.outerHTML;
      snapshots.push({
        id: def.id,
        targetKey: def.targetKey,
        isRotation: def.isRotation,
        startX: src.left,
        startY: src.top,
        width: src.width,
        height: src.height,
        outerHTML: def.isRotation
          ? wrapRotationColumnHtml(columnHtml)
          : columnHtml,
      });
    }

    return snapshots;
  }, []);

  const getRotationTargetRect = useCallback((snap) => {
    const preEl = cellRefs.current["right-col-pre"];
    const imgEl = cellRefs.current["right-col-img"];
    if (!preEl || !imgEl) return null;

    const pre = preEl.getBoundingClientRect();
    const img = imgEl.getBoundingClientRect();
    if (pre.width < 2 || img.width < 2 || img.left <= pre.right) return null;

    const slotLeft = pre.right;
    const slotWidth = img.left - pre.right;
    const width = Math.min(snap.width, slotWidth);
    const left = slotLeft + (slotWidth - width) / 2;

    return {
      left: left,
      top: pre.top,
      width: width,
      height: pre.height,
    };
  }, []);

  const applyTargetRectsToSnapshots = useCallback(
    async (snapshots) => {
      const result = [];
      for (const snap of snapshots) {
        const targetEl = await waitForElement(
          () => cellRefs.current[snap.targetKey],
          50,
        );

        let tgt = targetEl ? targetEl.getBoundingClientRect() : null;
        if ((!tgt || tgt.width < 2) && snap.isRotation) {
          tgt = getRotationTargetRect(snap);
        }
        if (!tgt || tgt.width < 2) continue;

        result.push({
          ...snap,
          dx: tgt.left - snap.startX,
          dy: tgt.top - snap.startY,
          scaleX: tgt.width / snap.width,
          scaleY: tgt.height / snap.height,
        });
      }
      return result;
    },
    [waitForElement, getRotationTargetRect],
  );

  const flyTableColumnsTogether = useCallback(
    async (snapshots) => {
      if (!snapshots || snapshots.length === 0) return false;
      await Promise.all(snapshots.map((snap) => animateColumnFly(snap)));
      return true;
    },
    [animateColumnFly],
  );

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
          shrinkWhileFlying: true,
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
        onHighlightChange(["highlight-r-solve", "highlight-qprime-solve"]);
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
  }, [step, step3Phase, animateFly, onStep3PhaseChange, onNavAnimating]);

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
        objGeneric: false,
        imgGeneric: false,
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
        centered: false,
        clickable: false,
        splitCoords: false,
      }));
    }
    if (step === 7) {
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
      setAllHighlighted(false);
      if (step7Phase === "waiting") {
        setQPrimeKnown(false);
        setRKnown(false);
        setFormulaState(makeGenericSplitFormula(true));
        step7AnimRef.current = false;
      }
    }
    if (step === 8) {
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
      setAllHighlighted(false);
      if (step8Phase === "waiting") {
        setQPrimeKnown(true);
        setRKnown(false);
        setFormulaState(makeGenericSplitFormula(true));
        step8AnimRef.current = false;
      }
    }
    if (step < 9) {
      step9InitRef.current = false;
      step9AnimRef.current = false;
    }
    if (step < 8 || step8ExitPhase !== "transitioning") {
      if (step < 8) {
        step8To9AnimRef.current = false;
        setLeftTableFlyHidden(false);
        setRightTablePrepInvisible(false);
        setRightTableRevealed(false);
        setStep8FlyTargetsReady(false);
        setStep9CellHighlight(null);
        setStep9HideUnknownBorders(false);
      }
    }
    if (step === 9 && !step9InitRef.current) {
      step9InitRef.current = true;
      setLeftVisible(true);
      setRightVisible(true);
      setTableVisible(true);
      setLeftTableFlyHidden(true);
      setRightTablePrepInvisible(false);
      setRightTableRevealed(true);
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
      setQPrimeKnown(true);
      setRKnown(true);
      setAllHighlighted(false);
      setStep9CellHighlight(null);
      setStep9HideUnknownBorders(false);
      const knownStates = {};
      KNOWN_POINTS.forEach((pt) => {
        knownStates[pt.key] = { opacity: 1, labelVisible: true };
      });
      setPointStates(knownStates);
      setSegments({ PQ: true, PPrimeRPrime: true });
      setShowUnknown(false);
      setUnknownR(R_FINAL);
      setUnknownQPrime(QPRIME_FINAL);
    }
    if (step < 7) {
      step7AnimRef.current = false;
    }
    if (step < 8) {
      step8AnimRef.current = false;
    }
  }, [
    step,
    step3Phase,
    step7Phase,
    step8Phase,
    step8ExitPhase,
    makeGenericSplitFormula,
  ]);

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
      setRightVisible(true);
      setFormulaState({
        panelVisible: true,
        formulaObj: false,
        formulaArrow: false,
        formulaImg: false,
        useGeneric: false,
        objGeneric: false,
        imgGeneric: false,
        movedUp: false,
        switching: null,
      });
      await delay(300);
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
      await delay(200);

      const f = APP_DATA.formula;
      await flyFormulaFromCell(
        "pre-p",
        "formula-obj",
        f.objNumeric,
        TRANSLATION_GRAPH_COLORS.preimage,
      );
      setFormulaState((fs) => ({ ...fs, formulaObj: true }));
      await delay(250);

      await flyFormulaFromCell(
        "img-p",
        "formula-img",
        f.imgNumeric,
        TRANSLATION_GRAPH_COLORS.image,
      );
      setFormulaState((fs) => ({ ...fs, formulaImg: true }));
      await delay(250);
      setFormulaState((fs) => ({ ...fs, formulaArrow: true }));
      await delay(1000);

      setFormulaState((fs) => ({ ...fs, switching: "formulaObj" }));
      await delay(300);
      setFormulaState((fs) => ({
        ...fs,
        objGeneric: true,
        switching: null,
        formulaObj: true,
      }));
      await delay(300);

      setFormulaState((fs) => ({ ...fs, switching: "formulaImg" }));
      await delay(300);
      setFormulaState((fs) => ({
        ...fs,
        imgGeneric: true,
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
  }, [step5Phase, flyFormulaFromCell, onStep5PhaseChange, onNavAnimating]);

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
  }, [
    step6Phase,
    flyBetweenRefs,
    animateCellFly,
    onStep6PhaseChange,
    onNavAnimating,
  ]);

  useEffect(() => {
    if (step !== 7 || step7Phase !== "animating" || step7AnimRef.current)
      return;
    step7AnimRef.current = true;

    const runStep7Anim = async () => {
      if (typeof onNavAnimating === "function") onNavAnimating(true);
      setFormulaState((fs) => ({ ...fs, clickable: false }));

      await flyFormulaFromCell("pre-q", "formula-obj", "(4,3)", "#ffffff");
      setFormulaState((fs) => ({
        ...fs,
        objX: "4",
        objY: "3",
        formulaObj: true,
      }));
      await delay(500);

      await flyFormulaPart("formula-obj-x", "formula-img-x", "4", "#ffffff");
      setFormulaState((fs) => ({ ...fs, imgSlot2: "4" }));
      await delay(200);

      await flyFormulaPart("formula-obj-y", "formula-img-y", "3", "#ffffff");
      setFormulaState((fs) => ({ ...fs, imgSlot1: "3", formulaImg: true }));
      await delay(350);

      await flyFormulaToCell("formula-img", "img-q", "(3,-4)", "#ffffff");
      setQPrimeKnown(true);
      await delay(300);

      if (typeof onStep7PhaseChange === "function") {
        onStep7PhaseChange("done");
      }
      if (typeof onNavAnimating === "function") onNavAnimating(false);
    };
    runStep7Anim();
  }, [
    step,
    step7Phase,
    flyFormulaFromCell,
    flyFormulaPart,
    flyFormulaToCell,
    onStep7PhaseChange,
    onNavAnimating,
  ]);

  useEffect(() => {
    if (step !== 8 || step8Phase !== "animating" || step8AnimRef.current)
      return;
    step8AnimRef.current = true;

    const runStep8Anim = async () => {
      if (typeof onNavAnimating === "function") onNavAnimating(true);
      setFormulaState((fs) => ({ ...fs, clickable: false }));

      await flyFormulaFromCell("img-r", "formula-img", "(4,-3)", "#ffffff");
      setFormulaState((fs) => ({
        ...fs,
        imgSlot1: "4",
        imgSlot2: "3",
        imgNegate: true,
        formulaImg: true,
      }));
      await delay(500);

      await flyFormulaPart("formula-img-y", "formula-obj-y", "4", "#ffffff");
      setFormulaState((fs) => ({ ...fs, objY: "4" }));
      await delay(200);

      await flyFormulaPart("formula-img-x", "formula-obj-x", "3", "#ffffff");
      setFormulaState((fs) => ({ ...fs, objX: "3", formulaObj: true }));
      await delay(350);

      await flyFormulaToCell("formula-obj", "pre-r", "(3,4)", "#ffffff");
      setRKnown(true);
      await delay(300);

      if (typeof onStep8PhaseChange === "function") {
        onStep8PhaseChange("done");
      }
      if (typeof onNavAnimating === "function") onNavAnimating(false);
    };
    runStep8Anim();
  }, [
    step,
    step8Phase,
    flyFormulaFromCell,
    flyFormulaPart,
    flyFormulaToCell,
    onStep8PhaseChange,
    onNavAnimating,
  ]);

  useLayoutEffect(() => {
    if (step !== 8 || step8ExitPhase !== "transitioning") {
      return;
    }

    let cancelled = false;

    const runTableTransition = async () => {
      if (typeof onNavAnimating === "function") onNavAnimating(true);
      setRightTableRevealed(false);
      setRightTablePrepInvisible(true);
      setStep8FlyTargetsReady(false);

      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve);
        });
      });
      if (cancelled) return;

      await waitForElement(() => cellRefs.current["left-table-wrap"], 50);
      if (cancelled) return;

      const leftSnapshots = captureLeftColumnSnapshots();

      if (leftSnapshots.length === 0) {
        setStep8FlyTargetsReady(true);
        setLeftTableFlyHidden(true);
        setRightTablePrepInvisible(false);
        setRightTableRevealed(true);
        if (!cancelled && typeof onStep8TransitionComplete === "function") {
          onStep8TransitionComplete();
        }
        if (typeof onNavAnimating === "function") onNavAnimating(false);
        return;
      }

      setStep8FlyTargetsReady(true);

      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve);
        });
      });
      if (cancelled) return;

      await waitForElement(() => cellRefs.current["right-table-wrap"], 50);
      await delay(150);
      if (cancelled) return;

      const snapshots = await applyTargetRectsToSnapshots(leftSnapshots);

      if (snapshots.length === 0) {
        setLeftTableFlyHidden(true);
        setRightTablePrepInvisible(false);
        setRightTableRevealed(true);
        if (!cancelled && typeof onStep8TransitionComplete === "function") {
          onStep8TransitionComplete();
        }
        if (typeof onNavAnimating === "function") onNavAnimating(false);
        return;
      }

      setLeftTableFlyHidden(true);
      await delay(30);
      if (cancelled) return;

      await flyTableColumnsTogether(snapshots);
      if (cancelled) return;

      setRightTableRevealed(true);
      setRightTablePrepInvisible(false);
      await delay(100);

      if (!cancelled && typeof onStep8TransitionComplete === "function") {
        onStep8TransitionComplete();
      }
      if (typeof onNavAnimating === "function") onNavAnimating(false);
    };
    runTableTransition();

    return () => {
      cancelled = true;
    };
  }, [
    step,
    step8ExitPhase,
    flyTableColumnsTogether,
    captureLeftColumnSnapshots,
    applyTargetRectsToSnapshots,
    waitForElement,
    onStep8TransitionComplete,
    onNavAnimating,
  ]);

  useEffect(() => {
    if (step !== 9 || step9Phase !== "initial" || step9AnimRef.current) return;
    step9AnimRef.current = true;

    const growLine = async (key) => {
      setLineGrowKey(key);
      setSegments((prev) => ({ ...prev, [key]: true }));
      await delay(STEP9_LINE_GROW_DURATION);
      setLineGrowKey(null);
    };

    const plotPointFromTable = async (sourceKey, targetRefKey, label, color) => {
      const source = cellRefs.current[sourceKey];
      let target = labelRefs.current[targetRefKey];
      if (!target) {
        await delay(50);
        target = labelRefs.current[targetRefKey];
      }
      await animateFly(source, target, {
        text: label,
        color: color,
        shrinkWhileFlying: true,
        flyDuration: STEP9_PLOT_FLY_DURATION,
      });
    };

    const runStep9Anim = async () => {
      if (typeof onNavAnimating === "function") onNavAnimating(true);
      await delay(1000);

      setStep9CellHighlight("pre-r");
      setPointStates((prev) => ({
        ...prev,
        R: { opacity: 0, labelVisible: false },
      }));
      setUnknownR(R_FINAL);
      await delay(120);

      await plotPointFromTable(
        "right-pre-r",
        "R",
        APP_DATA.graph.labelRKnown,
        TRANSLATION_GRAPH_COLORS.preimage,
      );
      setPointStates((prev) => ({
        ...prev,
        R: { opacity: 1, labelVisible: true },
      }));
      await delay(350);

      await growLine("PR");
      await growLine("QR");
      await delay(1000);

      setStep9CellHighlight(null);
      await delay(300);

      setStep9CellHighlight("img-q");
      setPointStates((prev) => ({
        ...prev,
        QPrime: { opacity: 0, labelVisible: false },
      }));
      setUnknownQPrime(QPRIME_FINAL);
      await delay(120);

      await plotPointFromTable(
        "right-img-q",
        "QPrime",
        APP_DATA.graph.labelQPrimeKnown,
        TRANSLATION_GRAPH_COLORS.image,
      );
      setPointStates((prev) => ({
        ...prev,
        QPrime: { opacity: 1, labelVisible: true },
      }));
      await delay(350);

      await growLine("PPrimeQPrime");
      await growLine("QPrimeRPrime");
      await delay(400);

      setStep9CellHighlight(null);
      setStep9HideUnknownBorders(true);

      if (typeof onStep9PhaseChange === "function") {
        onStep9PhaseChange("done");
      }
      if (typeof onNavAnimating === "function") onNavAnimating(false);
    };
    runStep9Anim();
  }, [step, step9Phase, animateFly, onStep9PhaseChange, onNavAnimating]);

  const handleFormulaClick = useCallback(() => {
    if (typeof playSound === "function") playSound("click");
    if (step === 7 && step7Phase === "waiting") {
      if (typeof onStep7PhaseChange === "function") {
        onStep7PhaseChange("animating");
      }
    }
    if (step === 8 && step8Phase === "waiting") {
      if (typeof onStep8PhaseChange === "function") {
        onStep8PhaseChange("animating");
      }
    }
  }, [step, step7Phase, step8Phase, onStep7PhaseChange, onStep8PhaseChange]);

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

    if (showUnknown || (step === 9 && pointStates.R)) {
      const isStep9 = step === 9;
      const rOpacity =
        pointStates.R && pointStates.R.opacity != null
          ? pointStates.R.opacity
          : 1;
      const rLabelVisible = pointStates.R && pointStates.R.labelVisible;
      pts.push({
        id: "R",
        x: isStep9 ? R_FINAL.x : unknownR.x,
        y: isStep9 ? R_FINAL.y : unknownR.y,
        color: TRANSLATION_GRAPH_COLORS.preimage,
        label: isStep9
          ? APP_DATA.graph.labelRKnown
          : APP_DATA.graph.labelRUnknown,
        labelPlacement: dynamicLabelPlacement(isStep9 ? R_FINAL.y : unknownR.y),
        opacity: rOpacity,
        labelOpacity: isStep9 ? (rLabelVisible ? 1 : 0) : 1,
        showLabel: true,
        labelRefKey: "R",
      });
    }

    if (showUnknown || (step === 9 && pointStates.QPrime)) {
      const isStep9 = step === 9;
      const qOpacity =
        pointStates.QPrime && pointStates.QPrime.opacity != null
          ? pointStates.QPrime.opacity
          : 1;
      const qLabelVisible =
        pointStates.QPrime && pointStates.QPrime.labelVisible;
      pts.push({
        id: "QPrime",
        x: isStep9 ? QPRIME_FINAL.x : unknownQPrime.x,
        y: isStep9 ? QPRIME_FINAL.y : unknownQPrime.y,
        color: TRANSLATION_GRAPH_COLORS.image,
        label: isStep9
          ? APP_DATA.graph.labelQPrimeKnown
          : APP_DATA.graph.labelQPrimeUnknown,
        labelPlacement: dynamicLabelPlacement(
          isStep9 ? QPRIME_FINAL.y : unknownQPrime.y,
        ),
        opacity: qOpacity,
        labelOpacity: isStep9 ? (qLabelVisible ? 1 : 0) : 1,
        showLabel: true,
        labelRefKey: "QPrime",
      });
    }

    return pts;
  }, [pointStates, showUnknown, unknownR, unknownQPrime, step]);

  const graphSegments = useMemo(() => {
    const segs = [];
    const p = { x: 2, y: 1 };
    const q = { x: 4, y: 3 };
    const pPrime = { x: 1, y: -2 };
    const rPrime = { x: 4, y: -3 };
    const rPos = step === 9 ? R_FINAL : unknownR;
    const qPrimePos = step === 9 ? QPRIME_FINAL : unknownQPrime;
    const unknownDashed = step !== 9;

    const withGrow = (seg, key) => ({
      ...seg,
      segKey: key,
      animateGrow: lineGrowKey === key,
    });

    if (segments.PQ) {
      segs.push(
        withGrow(
          {
            from: p,
            to: q,
            color: TRANSLATION_GRAPH_COLORS.preimage,
            dashed: false,
          },
          "PQ",
        ),
      );
    }
    if (segments.PPrimeRPrime) {
      segs.push(
        withGrow(
          {
            from: pPrime,
            to: rPrime,
            color: TRANSLATION_GRAPH_COLORS.image,
            dashed: false,
          },
          "PPrimeRPrime",
        ),
      );
    }
    if (segments.PR) {
      segs.push(
        withGrow(
          {
            from: p,
            to: rPos,
            color: TRANSLATION_GRAPH_COLORS.preimage,
            dashed: unknownDashed,
          },
          "PR",
        ),
      );
    }
    if (segments.QR) {
      segs.push(
        withGrow(
          {
            from: q,
            to: rPos,
            color: TRANSLATION_GRAPH_COLORS.preimage,
            dashed: unknownDashed,
          },
          "QR",
        ),
      );
    }
    if (segments.PPrimeQPrime) {
      segs.push(
        withGrow(
          {
            from: pPrime,
            to: qPrimePos,
            color: TRANSLATION_GRAPH_COLORS.image,
            dashed: unknownDashed,
          },
          "PPrimeQPrime",
        ),
      );
    }
    if (segments.QPrimeRPrime) {
      segs.push(
        withGrow(
          {
            from: qPrimePos,
            to: rPrime,
            color: TRANSLATION_GRAPH_COLORS.image,
            dashed: unknownDashed,
          },
          "QPrimeRPrime",
        ),
      );
    }
    return segs;
  }, [segments, unknownR, unknownQPrime, step, lineGrowKey]);

  const columnsHidden = step === 1;
  const rightHidden = step <= 2;
  const showLeftGraph = step === 2 || step === 3 || step === 9;
  const showLeftTable = step >= 4 && step <= 8 && !leftTableFlyHidden;
  const showRightTable =
    step === 3 ||
    (step === 8 && step8ExitPhase === "transitioning") ||
    step === 9;

  const sharedTableProps = {
    cellRefs: cellRefs,
    revealedCells: revealedCells,
    blinkCell: blinkCell,
    qPrimeKnown: qPrimeKnown,
    rKnown: rKnown,
  };

  const rightPanelTableProps = {
    ...sharedTableProps,
    refPrefix: "right-",
    wrapRefKey: "right-table-wrap",
    visible:
      rightTableRevealed && tableVisible && showRightTable,
    prepInvisible: rightTablePrepInvisible,
    contentVisible: true,
    showRotationColumn: true,
    rotationColumnOpen: rotationColumnOpen || step === 9,
    rotationCells: rotationCells,
    rotationMerged: rotationMerged,
    hideRotTop: hideRotTop,
    hideRotBottom: hideRotBottom,
    rotationFirstDashed: rotationFirstDashed,
    cellHighlight: step9CellHighlight,
    hideUnknownBorders: step9HideUnknownBorders,
    twoColumnOnly: false,
  };

  const leftTableProps = {
    ...sharedTableProps,
    wrapRefKey: "left-table-wrap",
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
        : step === 7
          ? { p: false, q: true, r: false }
          : step === 8
            ? { p: false, q: false, r: true }
            : null,
    rotMiddleHighlight:
      (step === 5 && step5Phase !== "entering") || step === 7 || step === 8,
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
      const showFb = step4Phase === "wrong" || step4Phase === "correct";
      const picked =
        step4Selected !== null && (step4Phase === "selected" || showFb);
      return React.createElement(McqPanel, {
        title: mcq.title,
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
        disabled: step4Phase === "correct",
        alignTop: true,
        onSelect: onStep4Select,
      });
    }
    if (
      (step === 5 || step === 6 || step === 7 || step === 8) &&
      !(
        step === 8 &&
        step8ExitPhase === "transitioning" &&
        step8FlyTargetsReady
      )
    ) {
      return React.createElement(RotationFormulaPanel, {
        formulaState: formulaState,
        formulaRefs: formulaRefs,
        step5Phase: step === 5 ? step5Phase : null,
        step5Selected: step5Selected,
        step5Feedback: step5Feedback,
        onStep5Select: onStep5Select,
        step6Phase: step === 6 ? step6Phase : null,
        onStep6Apply: onStep6Apply,
        onFormulaClick: handleFormulaClick,
      });
    }
    if (
      step === 9 ||
      (step === 8 &&
        step8ExitPhase === "transitioning" &&
        step8FlyTargetsReady)
    ) {
      return React.createElement(PreImageImageTable, rightPanelTableProps);
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

  const flyCloneEls = flyClones.map((clone) => {
    if (clone.mode === "cell") {
      return React.createElement(
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
      );
    }
    if (clone.mode === "column") {
      return React.createElement("div", {
        key: clone.id,
        className:
          "fly-clone-column" + (clone.isRotation ? " is-rotation-col" : ""),
        style: {
          left: clone.startX + "px",
          top: clone.startY + "px",
          width: clone.width + "px",
          height: clone.height + "px",
          transform: clone.animating
            ? "translate(" +
              clone.dx +
              "px, " +
              clone.dy +
              "px) scale(" +
              clone.scaleX +
              ", " +
              clone.scaleY +
              ")"
            : "translate(0, 0) scale(1, 1)",
          transformOrigin: "top left",
        },
        dangerouslySetInnerHTML: { __html: clone.outerHTML },
      });
    }
    if (clone.mode === "table") {
      return React.createElement("div", {
        key: clone.id,
        className: "fly-clone-table",
        style: {
          left: clone.startX + "px",
          top: clone.startY + "px",
          width: clone.width + "px",
          height: clone.height + "px",
          transform: clone.animating
            ? "translate(" +
              clone.dx +
              "px, " +
              clone.dy +
              "px) scale(" +
              clone.scaleX +
              ", " +
              clone.scaleY +
              ")"
            : "translate(0, 0) scale(1, 1)",
          transformOrigin: "top left",
        },
        dangerouslySetInnerHTML: {
          __html:
            '<div class="' +
            (clone.wrapClassName || "piit-wrap is-visible") +
            '">' +
            clone.innerHTML +
            "</div>",
        },
      });
    }
    return React.createElement(
      "div",
      {
        key: clone.id,
        className: "fly-clone-text",
        style: {
          left: clone.startX + "px",
          top: clone.startY + "px",
          color: clone.color || "#ffffff",
          fontSize: clone.animating ? clone.endFontSize : clone.startFontSize,
          fontWeight: clone.fontWeight,
          transition: clone.transitionDuration
            ? "transform " +
              clone.transitionDuration +
              " cubic-bezier(0.4, 0, 0.2, 1), font-size " +
              clone.transitionDuration +
              " cubic-bezier(0.4, 0, 0.2, 1)"
            : undefined,
          transform: clone.animating
            ? "translate(calc(-50% + " +
              clone.dx +
              "px), calc(-50% + " +
              clone.dy +
              "px)) scale(" +
              (clone.endScale != null ? clone.endScale : 1) +
              ")"
            : "translate(-50%, -50%) scale(" +
              (clone.startScale != null ? clone.startScale : 1) +
              ")",
        },
      },
      clone.text,
    );
  });

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
            (rightVisible && step >= 3 ? " is-visible" : "") +
            (step === 4 ? " is-step4" : ""),
        },
        renderRightPanel(),
      ),
    ),
    flyCloneEls,
  );
};
