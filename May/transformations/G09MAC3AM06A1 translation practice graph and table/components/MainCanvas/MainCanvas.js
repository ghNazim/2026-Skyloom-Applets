const R_CYCLE = [
  { x: 4, y: 5 },
  { x: 4, y: 6 },
  { x: 4, y: 1 },
  { x: 5, y: 1 },
];

const QPRIME_CYCLE = [
  { x: 11, y: 2 },
  { x: 10, y: 1 },
  { x: 12, y: 2 },
  { x: 9, y: 5 },
];

const KNOWN_POINTS = [
  {
    key: "P",
    highlightId: "highlight-p",
    label: () => APP_DATA.graph.labelP,
    labelRefKey: "P",
    x: 2,
    y: 3,
    color: TRANSLATION_GRAPH_COLORS.preimage,
    labelPlacement: "below",
  },
  {
    key: "Q",
    highlightId: "highlight-q",
    label: () => APP_DATA.graph.labelQ,
    labelRefKey: "Q",
    x: 7,
    y: 4,
    color: TRANSLATION_GRAPH_COLORS.preimage,
    labelPlacement: "below",
  },
  {
    key: "PPrime",
    highlightId: "highlight-p-prime",
    label: () => APP_DATA.graph.labelPPrime,
    labelRefKey: "PPrime",
    x: 7,
    y: 2,
    color: TRANSLATION_GRAPH_COLORS.image,
    labelPlacement: "below",
  },
  {
    key: "RPrime",
    highlightId: "highlight-r-prime",
    label: () => APP_DATA.graph.labelRPrime,
    labelRefKey: "RPrime",
    x: 11,
    y: 5,
    color: TRANSLATION_GRAPH_COLORS.image,
    labelPlacement: "right",
  },
];

const MainCanvas = ({
  step,
  step2Phase,
  onStep2AnimComplete,
  onHighlightChange,
  step4Phase,
  step4Selected,
  step4Feedback,
  onStep4Select,
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
  step8Selected,
  step8Feedback,
  onStep8Select,
  onStep8PhaseChange,
  step9Phase,
  step9Selected,
  step9Feedback,
  onStep9Select,
  onStep9PhaseChange,
  step10Phase,
  onStep10PhaseChange,
}) => {
  const { useState, useEffect, useRef, useCallback, useMemo } = React;

  const animStartedRef = useRef(false);
  const labelRefs = useRef({});
  const cellRefs = useRef({});
  const step5AnimRef = useRef(false);
  const step5TableAnimRef = useRef(false);
  const step6AnimRef = useRef(false);
  const step7AnimRef = useRef(false);
  const step8AnimRef = useRef(false);
  const step9AnimRef = useRef(false);
  const step10AnimRef = useRef(false);

  const [leftVisible, setLeftVisible] = useState(false);
  const [rightVisible, setRightVisible] = useState(false);
  const [flyClones, setFlyClones] = useState([]);
  const [pointStates, setPointStates] = useState({});
  const [segments, setSegments] = useState({});
  const [showUnknown, setShowUnknown] = useState(false);
  const [unknownR, setUnknownR] = useState({ x: 4, y: 5 });
  const [unknownQPrime, setUnknownQPrime] = useState({ x: 11, y: 2 });
  const [tableVisible, setTableVisible] = useState(false);
  const [translationColumnOpen, setTranslationColumnOpen] = useState(false);
  const [translationCells, setTranslationCells] = useState([null, null, null]);
  const [translationExpr, setTranslationExpr] = useState(null);
  const [translationMerged, setTranslationMerged] = useState(false);
  const [hideTransTop, setHideTransTop] = useState(false);
  const [hideTransBottom, setHideTransBottom] = useState(false);
  const [allHighlighted, setAllHighlighted] = useState(false);
  const [qPrimeKnown, setQPrimeKnown] = useState(false);
  const [rKnown, setRKnown] = useState(false);
  const [qPrimeFill, setQPrimeFill] = useState(null);
  const [rFill, setRFill] = useState(null);
  const [step10Graph, setStep10Graph] = useState({
    showR: false,
    rFadeIn: false,
    showPR: false,
    prFadeIn: false,
    showQR: false,
    qrFadeIn: false,
    showQPrime: false,
    qPrimeFadeIn: false,
    showPPrimeQPrime: false,
    pPrimeQPrimeFadeIn: false,
    showQPrimeRPrime: false,
    qPrimeRPrimeFadeIn: false,
  });
  const [rightTableReady, setRightTableReady] = useState(false);
  const [rightTableContentVisible, setRightTableContentVisible] = useState(false);
  const [hideLeftFlyColumns, setHideLeftFlyColumns] = useState(false);

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

      setFlyClones((prev) =>
        prev.concat([
          {
            id: id,
            mode: "text",
            text: options.text || sourceEl.textContent.trim(),
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
    async (fromKey, toKey, text) => {
      await delay(50);
      const sourceEl = cellRefs.current[fromKey];
      const targetEl = cellRefs.current[toKey];
      await animateFly(sourceEl, targetEl, { text: text });
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

  const animateColumnFly = useCallback((sourceKey, targetKey) => {
    return new Promise((resolve) => {
      const sourceEl = cellRefs.current[sourceKey];
      const targetEl = cellRefs.current[targetKey];
      if (!sourceEl || !targetEl) {
        resolve();
        return;
      }
      const src = sourceEl.getBoundingClientRect();
      const tgt = targetEl.getBoundingClientRect();
      const dx = tgt.left - src.left;
      const dy = tgt.top - src.top;

      const flyEl = sourceEl.cloneNode(true);
      flyEl.classList.remove("is-source-hidden", "is-content-hidden");
      flyEl.classList.add("piit-fly-column-clone");
      flyEl.style.position = "fixed";
      flyEl.style.left = src.left + "px";
      flyEl.style.top = src.top + "px";
      flyEl.style.width = src.width + "px";
      flyEl.style.height = src.height + "px";
      flyEl.style.zIndex = "10001";
      flyEl.style.margin = "0";
      flyEl.style.pointerEvents = "none";
      flyEl.style.transition =
        "transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)";
      flyEl.style.transform = "translate(0, 0)";
      flyEl.style.boxSizing = "border-box";

      document.body.appendChild(flyEl);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          flyEl.style.transform = "translate(" + dx + "px, " + dy + "px)";
        });
      });

      setTimeout(() => {
        if (flyEl.parentNode) flyEl.parentNode.removeChild(flyEl);
        resolve();
      }, 920);
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
        await animateFly(sourceEl, targetEl, { text: pt.label() });

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
        onHighlightChange("highlight-solve");
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
    if (step === 1) {
      animStartedRef.current = false;
      setLeftVisible(false);
      setTableVisible(false);
      setPointStates({});
      setSegments({});
      setShowUnknown(false);
      setUnknownR({ x: 4, y: 5 });
      setUnknownQPrime({ x: 11, y: 2 });
      return;
    }
    if (step === 3) {
      animStartedRef.current = false;
      setLeftVisible(true);
      setTableVisible(true);
      setRightVisible(false);
    }
    if (step === 4) {
      setLeftVisible(true);
      setTableVisible(true);
      setTimeout(() => setRightVisible(true), 80);
    }
    if (step < 5) {
      setTranslationColumnOpen(false);
      setTranslationCells([null, null, null]);
      setTranslationExpr(null);
      step5AnimRef.current = false;
      step5TableAnimRef.current = false;
    }
    if (step < 6) {
      setAllHighlighted(false);
      step6AnimRef.current = false;
    }
    if (step === 6) {
      setRightVisible(true);
    }
    if (step === 7) {
      setRightVisible(false);
    }
    if (step === 8) {
      setLeftVisible(true);
      setTableVisible(true);
      setRightVisible(true);
      setTranslationMerged(true);
      setTranslationCells([null, APP_DATA.table.translationValue, null]);
      if (step8Phase === "mcq") {
        setQPrimeKnown(false);
        setQPrimeFill(null);
      }
    }
    if (step === 9) {
      setLeftVisible(true);
      setTableVisible(true);
      setRightVisible(true);
      setTranslationMerged(true);
      setTranslationCells([null, APP_DATA.table.translationValue, null]);
      if (step9Phase === "mcq") {
        setRFill(null);
        setRKnown(false);
      }
    }
    if (step === 10) {
      setLeftVisible(true);
      if (step10Phase === "initial") {
        setRightVisible(false);
        setRightTableReady(false);
        setRightTableContentVisible(false);
        setHideLeftFlyColumns(false);
        setTableVisible(true);
        setStep10Graph({
          showR: false,
          rFadeIn: false,
          showPR: false,
          prFadeIn: false,
          showQR: false,
          qrFadeIn: false,
          showQPrime: false,
          qPrimeFadeIn: false,
          showPPrimeQPrime: false,
          pPrimeQPrimeFadeIn: false,
          showQPrimeRPrime: false,
          qPrimeRPrimeFadeIn: false,
        });
      }
    }
    if (step < 7) {
      setTranslationMerged(false);
      setHideTransTop(false);
      setHideTransBottom(false);
      step7AnimRef.current = false;
    }
    if (step !== 8) {
      step8AnimRef.current = false;
    }
    if (step !== 9) {
      step9AnimRef.current = false;
    }
    if (step !== 10) {
      step10AnimRef.current = false;
      setRightTableReady(false);
      setRightTableContentVisible(false);
      setHideLeftFlyColumns(false);
    }
  }, [step, step8Phase, step9Phase, step10Phase]);

  useEffect(() => {
    if (step !== 5 || step5Phase !== "entering") return;
    if (step5AnimRef.current) return;
    step5AnimRef.current = true;

    const runStep5Enter = async () => {
      setRightVisible(false);
      setTranslationColumnOpen(false);
      await delay(350);
      await delay(80);
      setTranslationColumnOpen(true);
      await delay(700);
      if (typeof onStep5PhaseChange === "function") onStep5PhaseChange("mcq");
      await delay(150);
      setRightVisible(true);
    };
    runStep5Enter();
  }, [step, step5Phase, onStep5PhaseChange]);

  useEffect(() => {
    if (step5Phase !== "tableAnim" || step5TableAnimRef.current) return;
    step5TableAnimRef.current = true;

    const runTableAnim = async () => {
      if (typeof onNavAnimating === "function") onNavAnimating(true);
      setTranslationExpr({
        active: true,
        show7: false,
        showMinus1: false,
        show2a: false,
        show2b: false,
        showMinus2: false,
        show3: false,
        showFinal: false,
      });
      await delay(450);

      await flyBetweenRefs("img-p-x", "trans-slot-7", "7");
      setTranslationExpr((e) => ({ ...e, show7: true }));
      await delay(150);
      setTranslationExpr((e) => ({ ...e, showMinus1: true }));
      await delay(120);
      await flyBetweenRefs("pre-p-x", "trans-slot-2a", "2");
      setTranslationExpr((e) => ({ ...e, show2a: true }));
      await delay(350);

      await flyBetweenRefs("img-p-y", "trans-slot-2b", "2");
      setTranslationExpr((e) => ({ ...e, show2b: true }));
      await delay(150);
      setTranslationExpr((e) => ({ ...e, showMinus2: true }));
      await delay(120);
      await flyBetweenRefs("pre-p-y", "trans-slot-3", "3");
      setTranslationExpr((e) => ({ ...e, show3: true }));
      await delay(500);

      setTranslationExpr((e) => ({ ...e, showFinal: true }));
      await delay(550);
      setTranslationCells([
        APP_DATA.table.translationValue,
        null,
        null,
      ]);
      setTranslationExpr(null);
      if (typeof onStep5PhaseChange === "function") onStep5PhaseChange("done");
      if (typeof onNavAnimating === "function") onNavAnimating(false);
    };
    runTableAnim();
  }, [step5Phase, flyBetweenRefs, onStep5PhaseChange, onNavAnimating]);

  useEffect(() => {
    if (step6Phase !== "applying" || step6AnimRef.current) return;
    step6AnimRef.current = true;

    const runApplyAnim = async () => {
      const val = APP_DATA.table.translationValue;
      setAllHighlighted(true);
      await delay(400);
      await flyBetweenRefs("trans-val-0", "trans-1", val);
      setTranslationCells([val, val, null]);
      await delay(250);
      await flyBetweenRefs("trans-val-0", "trans-2", val);
      setTranslationCells([val, val, val]);
      await delay(350);
      if (typeof onStep6PhaseChange === "function") onStep6PhaseChange("done");
      if (typeof onNavAnimating === "function") onNavAnimating(false);
    };
    runApplyAnim();
  }, [step6Phase, flyBetweenRefs, onStep6PhaseChange, onNavAnimating]);

  useEffect(() => {
    if (step !== 7 || step7Phase !== "initial" || step7AnimRef.current) return;
    step7AnimRef.current = true;

    const runMergeAnim = async () => {
      if (typeof onNavAnimating === "function") onNavAnimating(true);
      const val = APP_DATA.table.translationValue;
      await delay(450);

      setHideTransTop(true);
      setHideTransBottom(true);
      await delay(40);
      await Promise.all([
        animateCellFly("trans-0", "trans-1", "merge-top"),
        animateCellFly("trans-2", "trans-1", "merge-bottom"),
      ]);
      await delay(200);

      setTranslationMerged(true);
      setTranslationCells([null, val, null]);
      if (typeof onStep7PhaseChange === "function") onStep7PhaseChange("done");
      if (typeof onNavAnimating === "function") onNavAnimating(false);
    };
    runMergeAnim();
  }, [step, step7Phase, animateCellFly, onStep7PhaseChange, onNavAnimating]);

  useEffect(() => {
    if (step8Phase !== "tableAnim" || step8AnimRef.current) return;
    step8AnimRef.current = true;

    const runQPrimeFill = async () => {
      const t = APP_DATA.table;
      setQPrimeFill({ active: true, showBrackets: true });
      await delay(500);
      setQPrimeFill({
        active: true,
        showExpr: true,
        a1: "7",
        op1: "+",
        a2: "5",
        b1: "4",
        op2: "+",
        wrapB2: true,
        b2: "-1",
      });
      await delay(250);

      await flyBetweenRefs("pre-q-x", "qprime-a1", "7");
      setQPrimeFill((e) => ({ ...e, showA1: true }));
      await delay(120);
      setQPrimeFill((e) => ({ ...e, showOp1: true }));
      await delay(100);
      await flyBetweenRefs("trans-merged-x", "qprime-a2", "5");
      setQPrimeFill((e) => ({ ...e, showA2: true }));
      await delay(320);

      await flyBetweenRefs("pre-q-y", "qprime-b1", "4");
      setQPrimeFill((e) => ({ ...e, showB1: true }));
      await delay(120);
      setQPrimeFill((e) => ({ ...e, showOp2: true }));
      await delay(100);
      await flyBetweenRefs("trans-merged-y", "qprime-b2", "-1");
      setQPrimeFill((e) => ({ ...e, showB2Wrap: true, showB2: true }));
      await delay(450);

      setQPrimeFill((e) => ({ ...e, hideExpr: true }));
      await delay(480);
      setQPrimeFill({
        active: true,
        showFinal: true,
        showFinalVisible: false,
        finalValue: t.qPrimeValue,
      });
      await delay(60);
      setQPrimeFill((e) => ({ ...e, showFinalVisible: true }));
      await delay(500);
      setQPrimeFill({
        active: true,
        showNamed: true,
        prefix: t.qPrime,
        finalValue: t.qPrimeValue,
      });
      await delay(400);
      setQPrimeKnown(true);
      setQPrimeFill(null);
      if (typeof onStep8PhaseChange === "function") onStep8PhaseChange("done");
      if (typeof onNavAnimating === "function") onNavAnimating(false);
    };
    runQPrimeFill();
  }, [step8Phase, flyBetweenRefs, onStep8PhaseChange, onNavAnimating]);

  useEffect(() => {
    if (step9Phase !== "tableAnim" || step9AnimRef.current) return;
    step9AnimRef.current = true;

    const runRFill = async () => {
      const t = APP_DATA.table;
      setRFill({ active: true, showBrackets: true });
      await delay(500);
      setRFill({
        active: true,
        showExpr: true,
        a1: "11",
        op1: "-",
        a2: "5",
        b1: "5",
        op2: "-",
        wrapB2: true,
        b2: "-1",
      });
      await delay(250);

      await flyBetweenRefs("img-r-x", "rfill-a1", "11");
      setRFill((e) => ({ ...e, showA1: true }));
      await delay(120);
      setRFill((e) => ({ ...e, showOp1: true }));
      await delay(100);
      await flyBetweenRefs("trans-merged-x", "rfill-a2", "5");
      setRFill((e) => ({ ...e, showA2: true }));
      await delay(320);

      await flyBetweenRefs("img-r-y", "rfill-b1", "5");
      setRFill((e) => ({ ...e, showB1: true }));
      await delay(120);
      setRFill((e) => ({ ...e, showOp2: true }));
      await delay(100);
      await flyBetweenRefs("trans-merged-y", "rfill-b2", "-1");
      setRFill((e) => ({ ...e, showB2Wrap: true, showB2: true }));
      await delay(450);

      setRFill((e) => ({ ...e, hideExpr: true }));
      await delay(480);
      setRFill({
        active: true,
        showFinal: true,
        showFinalVisible: false,
        finalValue: t.rValue,
      });
      await delay(60);
      setRFill((e) => ({ ...e, showFinalVisible: true }));
      await delay(500);
      setRFill({
        active: true,
        showNamed: true,
        prefix: t.r,
        finalValue: t.rValue,
      });
      await delay(400);
      setRKnown(true);
      setRFill(null);
      if (typeof onStep9PhaseChange === "function") onStep9PhaseChange("done");
      if (typeof onNavAnimating === "function") onNavAnimating(false);
    };
    runRFill();
  }, [step9Phase, flyBetweenRefs, onStep9PhaseChange, onNavAnimating]);

  useEffect(() => {
    if (step !== 10 || step10Phase !== "initial" || step10AnimRef.current) return;
    step10AnimRef.current = true;

    const runStep10 = async () => {
      if (typeof onNavAnimating === "function") onNavAnimating(true);
      setLeftVisible(true);
      setTableVisible(true);
      setRightTableContentVisible(false);
      setHideLeftFlyColumns(false);
      setRightTableReady(false);
      setRightVisible(false);
      await delay(350);

      setRightVisible(true);
      await delay(500);

      setRightTableReady(true);
      if (typeof onStep10PhaseChange === "function") {
        onStep10PhaseChange("transfer");
      }
      await delay(500);

      setHideLeftFlyColumns(true);
      const preFly = animateColumnFly("col-pre", "right-col-pre");
      const imgFly = animateColumnFly("col-img", "right-col-img");
      await Promise.all([preFly, imgFly]);
      await delay(120);

      setRightTableContentVisible(true);
      await delay(500);

      if (typeof onStep10PhaseChange === "function") {
        onStep10PhaseChange("graph");
      }
      setHideLeftFlyColumns(false);
      await delay(550);

      setStep10Graph({
        showR: false,
        rFadeIn: false,
        showPR: false,
        prFadeIn: false,
        showQR: false,
        qrFadeIn: false,
        showQPrime: false,
        qPrimeFadeIn: false,
        showPPrimeQPrime: false,
        pPrimeQPrimeFadeIn: false,
        showQPrimeRPrime: false,
        qPrimeRPrimeFadeIn: false,
      });
      await delay(500);

      setStep10Graph((g) => ({ ...g, showR: true }));
      await delay(60);
      setStep10Graph((g) => ({ ...g, rFadeIn: true }));
      await delay(500);
      await delay(300);

      setStep10Graph((g) => ({ ...g, showPR: true }));
      await delay(60);
      setStep10Graph((g) => ({ ...g, prFadeIn: true }));
      await delay(300);
      await delay(300);

      setStep10Graph((g) => ({ ...g, showQR: true }));
      await delay(60);
      setStep10Graph((g) => ({ ...g, qrFadeIn: true }));
      await delay(300);
      await delay(800);

      setStep10Graph((g) => ({ ...g, showQPrime: true }));
      await delay(60);
      setStep10Graph((g) => ({ ...g, qPrimeFadeIn: true }));
      await delay(500);
      await delay(300);

      setStep10Graph((g) => ({ ...g, showPPrimeQPrime: true }));
      await delay(60);
      setStep10Graph((g) => ({ ...g, pPrimeQPrimeFadeIn: true }));
      await delay(300);
      await delay(300);

      setStep10Graph((g) => ({ ...g, showQPrimeRPrime: true }));
      await delay(60);
      setStep10Graph((g) => ({ ...g, qPrimeRPrimeFadeIn: true }));
      await delay(300);
      if (typeof onStep10PhaseChange === "function") onStep10PhaseChange("done");
      if (typeof onNavAnimating === "function") onNavAnimating(false);
    };
    runStep10();
  }, [step, step10Phase, animateColumnFly, onStep10PhaseChange, onNavAnimating]);

  const dynamicLabelPlacement = (y) => (y > 4 ? "above" : "below");

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
    const p = { x: 2, y: 3 };
    const q = { x: 7, y: 4 };
    const pPrime = { x: 7, y: 2 };
    const rPrime = { x: 11, y: 5 };

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

  const step10GraphPoints = useMemo(() => {
    if (step !== 10) return [];
    const pts = [
      {
        id: "P",
        x: 2,
        y: 3,
        color: TRANSLATION_GRAPH_COLORS.preimage,
        label: APP_DATA.graph.labelP,
        labelPlacement: "below",
        opacity: 1,
        labelOpacity: 1,
        showLabel: true,
      },
      {
        id: "Q",
        x: 7,
        y: 4,
        color: TRANSLATION_GRAPH_COLORS.preimage,
        label: APP_DATA.graph.labelQ,
        labelPlacement: "below",
        opacity: 1,
        labelOpacity: 1,
        showLabel: true,
      },
      {
        id: "PPrime",
        x: 7,
        y: 2,
        color: TRANSLATION_GRAPH_COLORS.image,
        label: APP_DATA.graph.labelPPrime,
        labelPlacement: "below",
        opacity: 1,
        labelOpacity: 1,
        showLabel: true,
      },
      {
        id: "RPrime",
        x: 11,
        y: 5,
        color: TRANSLATION_GRAPH_COLORS.image,
        label: APP_DATA.graph.labelRPrime,
        labelPlacement: "right",
        opacity: 1,
        labelOpacity: 1,
        showLabel: true,
      },
    ];
    if (step10Graph.showR) {
      pts.push({
        id: "R",
        x: 6,
        y: 6,
        color: TRANSLATION_GRAPH_COLORS.preimage,
        label: APP_DATA.graph.labelR,
        labelPlacement: "above",
        opacity: step10Graph.rFadeIn ? 1 : 0,
        labelOpacity: step10Graph.rFadeIn ? 1 : 0,
        showLabel: true,
      });
    }
    if (step10Graph.showQPrime) {
      pts.push({
        id: "QPrime",
        x: 12,
        y: 3,
        color: TRANSLATION_GRAPH_COLORS.image,
        label: APP_DATA.graph.labelQPrime,
        labelPlacement: "below",
        opacity: step10Graph.qPrimeFadeIn ? 1 : 0,
        labelOpacity: step10Graph.qPrimeFadeIn ? 1 : 0,
        showLabel: true,
      });
    }
    return pts;
  }, [step, step10Graph]);

  const step10GraphSegments = useMemo(() => {
    if (step !== 10) return [];
    const p = { x: 2, y: 3 };
    const q = { x: 7, y: 4 };
    const pPrime = { x: 7, y: 2 };
    const rPrime = { x: 11, y: 5 };
    const r = { x: 6, y: 6 };
    const qPrime = { x: 12, y: 3 };
    const segs = [
      {
        from: p,
        to: q,
        color: TRANSLATION_GRAPH_COLORS.preimage,
        dashed: false,
      },
      {
        from: pPrime,
        to: rPrime,
        color: TRANSLATION_GRAPH_COLORS.image,
        dashed: false,
      },
    ];
    if (step10Graph.showPR) {
      segs.push({
        from: p,
        to: r,
        color: TRANSLATION_GRAPH_COLORS.preimage,
        dashed: false,
        opacity: step10Graph.prFadeIn ? 1 : 0,
      });
    }
    if (step10Graph.showQR) {
      segs.push({
        from: q,
        to: r,
        color: TRANSLATION_GRAPH_COLORS.preimage,
        dashed: false,
        opacity: step10Graph.qrFadeIn ? 1 : 0,
      });
    }
    if (step10Graph.showPPrimeQPrime) {
      segs.push({
        from: pPrime,
        to: qPrime,
        color: TRANSLATION_GRAPH_COLORS.image,
        dashed: false,
        opacity: step10Graph.pPrimeQPrimeFadeIn ? 1 : 0,
      });
    }
    if (step10Graph.showQPrimeRPrime) {
      segs.push({
        from: qPrime,
        to: rPrime,
        color: TRANSLATION_GRAPH_COLORS.image,
        dashed: false,
        opacity: step10Graph.qPrimeRPrimeFadeIn ? 1 : 0,
      });
    }
    return segs;
  }, [step, step10Graph]);

  const columnsHidden = step === 1;
  const rightHidden = step <= 3 || step === 7;
  const showLeftTable =
    (step >= 3 && step <= 9) ||
    (step === 10 && step10Phase === "initial") ||
    (step === 10 && step10Phase === "transfer");
  const showLeftGraph =
    step === 2 ||
    (step === 10 &&
      (step10Phase === "graph" || step10Phase === "done"));
  const showRightTable =
    step === 10 &&
    rightTableReady &&
    (step10Phase === "transfer" ||
      step10Phase === "graph" ||
      step10Phase === "done");

  const baseTableProps = {
    showTranslationColumn: step >= 5 && step <= 9,
    translationColumnOpen: step >= 5,
    translationCells: translationCells,
    translationMerged: translationMerged,
    hideTransTop: hideTransTop,
    hideTransBottom: hideTransBottom,
    cellRefs: cellRefs,
    qPrimeKnown: qPrimeKnown,
    rKnown: rKnown,
    qPrimeFill: qPrimeFill,
    rFill: rFill,
  };

  const leftTableProps = {
    ...baseTableProps,
    visible: tableVisible && showLeftTable,
    showTranslationColumn: step >= 5,
    translationColumnOpen:
      step === 10 || step >= 8 || (step >= 5 && translationColumnOpen),
    pRowGreen: step === 4 && step4Phase === "correct",
    dehighlightQR:
      (step === 4 && step4Phase === "correct") ||
      step === 5 ||
      (step === 6 && step6Phase === "initial"),
    allHighlighted: allHighlighted,
    translationTopUnknown: false,
    translationExpr: translationExpr,
    rowHighlight:
      step === 8
        ? { p: false, q: true, r: false }
        : step === 9
          ? { p: false, q: false, r: true }
          : null,
    transMiddleHighlight: step === 8 || step === 9,
    hideFlySources: hideLeftFlyColumns,
    hideTranslationColumn: step === 10 && hideLeftFlyColumns,
  };

  const rightTableProps = {
    ...baseTableProps,
    refPrefix: "right-",
    twoColumnOnly: true,
    visible: showRightTable,
    contentVisible: rightTableContentVisible,
    showTranslationColumn: false,
    qPrimeKnown: true,
    rKnown: true,
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
    if (
      step === 5 &&
      step5Phase !== "entering" &&
      step5Phase !== "colAnim"
    ) {
      const mcq = APP_DATA.mcq.step5;
      const showFb = step5Phase === "wrong";
      const picked =
        step5Selected !== null &&
        (step5Phase === "selected" ||
          showFb ||
          step5Phase === "tableAnim" ||
          step5Phase === "done");
      const isCorrect =
        step5Selected === mcq.correctIndex && picked;
      return React.createElement(McqPanel, {
        title: showFb ? null : mcq.title,
        options: mcq.options,
        layout: "column",
        selectedIndex: step5Selected,
        resultState: picked
          ? isCorrect
            ? "correct"
            : "wrong"
          : null,
        showFeedback: showFb,
        feedbackText: step5Feedback ? step5Feedback.text : null,
        feedbackType: "wrong",
        disabled: step5Phase === "tableAnim" || step5Phase === "done",
        onSelect: onStep5Select,
      });
    }
    if (step === 6) {
      return React.createElement(ApplyTranslationPanel, {
        onApply: onStep6Apply,
        disabled: step6Phase !== "initial",
      });
    }
    if (step === 8) {
      const mcq = APP_DATA.mcq.step8;
      const showFb = step8Phase === "wrong";
      const picked =
        step8Selected !== null &&
        (step8Phase === "selected" ||
          showFb ||
          step8Phase === "tableAnim" ||
          step8Phase === "done");
      const isCorrect =
        step8Selected === mcq.correctIndex && picked;
      return React.createElement(McqPanel, {
        title: showFb ? null : mcq.title,
        options: mcq.options,
        layout: "column",
        selectedIndex: step8Selected,
        resultState: picked
          ? isCorrect
            ? "correct"
            : "wrong"
          : null,
        showFeedback: showFb,
        feedbackText: step8Feedback ? step8Feedback.text : null,
        feedbackType: "wrong",
        disabled: step8Phase === "tableAnim" || step8Phase === "done",
        onSelect: onStep8Select,
      });
    }
    if (step === 9) {
      const mcq = APP_DATA.mcq.step9;
      const showFb = step9Phase === "wrong";
      const picked =
        step9Selected !== null &&
        (step9Phase === "selected" ||
          showFb ||
          step9Phase === "tableAnim" ||
          step9Phase === "done");
      const isCorrect =
        step9Selected === mcq.correctIndex && picked;
      return React.createElement(McqPanel, {
        title: showFb ? null : mcq.title,
        options: mcq.options,
        layout: "column",
        selectedIndex: step9Selected,
        resultState: picked
          ? isCorrect
            ? "correct"
            : "wrong"
          : null,
        showFeedback: showFb,
        feedbackText: step9Feedback ? step9Feedback.text : null,
        feedbackType: "wrong",
        disabled: step9Phase === "tableAnim" || step9Phase === "done",
        onSelect: onStep9Select,
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
      const points = step === 10 ? step10GraphPoints : graphPoints;
      const segs = step === 10 ? step10GraphSegments : graphSegments;
      return React.createElement(TranslationGraphPanel, {
        points: points,
        segments: segs,
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
            (rightVisible &&
            (step === 10 || (step >= 4 && step <= 9))
              ? " is-visible"
              : "") +
            (step === 10 && step10Phase === "transfer"
              ? " is-transition-panel"
              : ""),
        },
        renderRightPanel(),
      ),
    ),
    flyCloneEls,
  );
};
