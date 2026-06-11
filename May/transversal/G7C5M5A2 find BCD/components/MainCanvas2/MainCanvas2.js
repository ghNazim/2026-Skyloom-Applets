const MainCanvas2 = (function () {
  /* ── helpers ── */
  const polarToXY = (cx, cy, r, deg) => {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const arcPath = (cx, cy, r, startDeg, endDeg) => {
    const s = polarToXY(cx, cy, r, startDeg);
    const e = polarToXY(cx, cy, r, endDeg);
    const span = endDeg - startDeg;
    const large = span > 180 ? 1 : 0;
    return [
      "M", cx, cy,
      "L", s.x, s.y,
      "A", r, r, 0, large, 1, e.x, e.y,
      "Z",
    ].join(" ");
  };

  const vecToDeg = (dx, dy) => {
    let deg = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (deg < 0) deg += 360;
    return deg;
  };

  const extend = (fromX, fromY, toX, toY, dist, fromFirst) => {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const len = Math.hypot(dx, dy);
    const ux = dx / len;
    const uy = dy / len;
    if (fromFirst) return { x: fromX - ux * dist, y: fromY - uy * dist };
    return { x: toX + ux * dist, y: toY + uy * dist };
  };

  const marker = (id, rev, color) =>
    React.createElement(
      "marker",
      {
        id,
        viewBox: "0 0 10 10",
        refX: rev ? "2" : "8",
        refY: "5",
        markerWidth: "5",
        markerHeight: "5",
        orient: rev ? "auto-start-reverse" : "auto",
      },
      React.createElement("path", {
        d: "M 0 0 L 10 5 L 0 10 z",
        fill: color || "white",
      }),
    );

  const chevronPath = (cx, cy, ux, uy, size, spread) => {
    const tipX = cx + ux * size;
    const tipY = cy + uy * size;
    const bx = cx - ux * size;
    const by = cy - uy * size;
    const px = -uy;
    const py = ux;
    const x1 = bx + px * spread;
    const y1 = by + py * spread;
    const x2 = bx - px * spread;
    const y2 = by - py * spread;
    return (
      "M " + x1 + " " + y1 + " L " + tipX + " " + tipY + " L " + x2 + " " + y2
    );
  };

  const lineLabelAt = (outerX, outerY, innerX, innerY, along, perp) => {
    const dx = outerX - innerX;
    const dy = outerY - innerY;
    const len = Math.hypot(dx, dy);
    const ux = dx / len;
    const uy = dy / len;
    return {
      x: outerX + ux * along - uy * perp,
      y: outerY + uy * along + ux * perp,
    };
  };

  const segmentTextPos = (x1, y1, x2, y2, perpOffset, alongOffset) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    const ux = dx / len;
    const uy = dy / len;
    const mx = (x1 + x2) / 2 + ux * alongOffset;
    const my = (y1 + y2) / 2 + uy * alongOffset;
    const px = -uy;
    const py = ux;
    return {
      x: mx + px * perpOffset,
      y: my + py * perpOffset,
      rotate: vecToDeg(dx, dy),
    };
  };

  const parallelTextBesideK = (seg, perpOffset, alongRatio) => {
    const vx = seg.x1 - seg.x2;
    const vy = seg.y1 - seg.y2;
    const len = Math.hypot(vx, vy);
    const ux = vx / len;
    const uy = vy / len;
    const alongShift = len * alongRatio;
    const mx = (seg.x1 + seg.x2) / 2 + ux * alongShift;
    const my = (seg.y1 + seg.y2) / 2 + uy * alongShift;
    const px = uy;
    const py = -ux;
    let rotate = vecToDeg(vx, vy);
    if (rotate > 90 && rotate < 270) rotate -= 180;
    return {
      x: mx + px * perpOffset,
      y: my + py * perpOffset,
      rotate,
    };
  };

  const uprightRotate = (deg) => {
    if (deg > 90 && deg < 270) return deg - 180;
    return deg;
  };

  const interiorLabelAngle = (start, end) => {
    let s = start;
    let e = end;
    if (e < s) e += 360;
    const span = e - s;
    if (span > 180) return ((s + e) / 2 + 180) % 360;
    return (s + e) / 2;
  };

  const lineOf = (key) => key.split("_")[0];

  /* ── constants ── */
  const COL_A = "#F39237";
  const COL_B = "#FFC815";
  const COL_C = "#29ABE2";
  const COL_D = "#E289C1";
  const COL_LINE = "white";
  const COL_DEHI = "#6a6a6a";
  const COL_YELLOW = "#FFC815";
  const COL_BLUE = "#29ABE2";
  const STROKE_W = 3;
  const EXT = 95;
  const ANG_R = 58;
  const PT_R = 8;
  const LABEL_R = 88;
  const ANGLE_LABEL_R = { A: 72, B: 88, C: 72, D: 88 };
  const VIEW_W = 800;
  const VIEW_H = 500;
  const ALL_LINES = ["k", "l", "m", "n"];
  const ALL_ANGLES = ["A", "B", "C", "D"];
  const WRONG_DEHI_B = ["m_rayA", "m_rayB", "k_rayA", "l_rayB"];
  const WRONG_DEHI_C = ["l_rayB", "l_rayC", "m_rayB", "n_rayC"];
  const WRONG_DEHI_D = ["k_rayA", "k_rayD", "m_rayA", "n_rayD"];
  const MCQ_STEPS = [6, 8, 10];
  const NUMPAD_STEPS = [7, 9, 11];
  const FIND_STEPS = [6, 7, 8, 9, 10, 11];
  const MCQ_STEP_KEY = { 6: "step6", 8: "step8", 10: "step10" };
  const NUMPAD_STEP_KEY = { 7: "step7", 9: "step9", 11: "step11" };
  const NUMPAD_ANGLE_KEY = { 7: "angleB", 9: "angleC", 11: "angleD" };
  const NUMPAD_ANGLE_ID = { 7: "B", 9: "C", 11: "D" };
  const ANGLE_COLORS = { A: COL_A, B: COL_B, C: COL_C, D: COL_D };
  const MCQ_CFG = {
    6: {
      blinkAngle: "B",
      parallels: ["k", "l"],
      transversal: "m",
      activeLines: ["k", "l", "m"],
      pairAngles: ["A", "B"],
      activePoints: ["A", "B"],
      lineLabels: ["k", "l", "m"],
      chevrons: ["k", "l"],
      parallelText: "k",
      transSeg: "m_segment",
      wrongDehi: WRONG_DEHI_B,
      lineColors: { k: COL_YELLOW, l: COL_YELLOW, m: COL_BLUE },
    },
    8: {
      blinkAngle: "C",
      parallels: ["m", "n"],
      transversal: "l",
      activeLines: ["m", "n", "l"],
      pairAngles: ["B", "C"],
      activePoints: ["B", "C"],
      lineLabels: ["m", "n", "l"],
      chevrons: ["m", "n"],
      parallelText: "m",
      transSeg: "l_segment",
      wrongDehi: WRONG_DEHI_C,
      lineColors: { m: COL_YELLOW, n: COL_YELLOW, l: COL_BLUE },
    },
    10: {
      blinkAngle: "D",
      parallels: ["m", "n"],
      transversal: "k",
      activeLines: ["m", "n", "k"],
      pairAngles: ["A", "D"],
      activePoints: ["A", "D"],
      lineLabels: ["m", "n", "k"],
      chevrons: ["m", "n"],
      parallelText: "m",
      transSeg: "k_segment",
      wrongDehi: WRONG_DEHI_D,
      lineColors: { m: COL_YELLOW, n: COL_YELLOW, k: COL_BLUE },
    },
  };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const buildAngleLabels = (bVal, cVal, dVal) => {
    const givenVal = APP_DATA.givenAngle.value + "\u00B0";
    const labels = { A: givenVal };
    if (bVal) labels.B = bVal;
    if (cVal) labels.C = cVal;
    if (dVal) labels.D = dVal;
    return labels;
  };

  const getMcqCfgForNumpad = (step) => MCQ_CFG[step - 1];

  /* ── geometry ── */
  const BASE_POINTS = {
    A: { x: 400, y: 88, color: COL_A, labelDy: -28 },
    B: { x: 668, y: 116, color: COL_B, labelDy: -28 },
    C: { x: 498, y: 292, color: COL_C, labelDy: 28 },
    D: { x: 230, y: 264, color: COL_D, labelDy: 28 },
  };

  const getRayTips = (pts) => {
    const A = pts.A;
    const B = pts.B;
    const C = pts.C;
    const D = pts.D;
    return [
      extend(A.x, A.y, D.x, D.y, EXT, true),
      extend(A.x, A.y, D.x, D.y, EXT, false),
      extend(B.x, B.y, C.x, C.y, EXT, true),
      extend(B.x, B.y, C.x, C.y, EXT, false),
      extend(A.x, A.y, B.x, B.y, EXT, true),
      extend(A.x, A.y, B.x, B.y, EXT, false),
      extend(D.x, D.y, C.x, C.y, EXT, true),
      extend(D.x, D.y, C.x, C.y, EXT, false),
    ];
  };

  const centerPoints = (base) => {
    const A = base.A;
    const B = base.B;
    const C = base.C;
    const tips = getRayTips(base);
    const kAExt = tips[0];
    const lBExt = tips[2];
    const mBExt = tips[5];
    const nCExt = tips[7];
    const xs = [];
    const ys = [];

    Object.values(base).forEach((p) => {
      xs.push(p.x);
      ys.push(p.y, p.y + p.labelDy);
    });
    tips.forEach((p) => {
      xs.push(p.x);
      ys.push(p.y);
    });
    [
      lineLabelAt(kAExt.x, kAExt.y, A.x, A.y, 32, -14),
      lineLabelAt(lBExt.x, lBExt.y, B.x, B.y, 32, 14),
      lineLabelAt(mBExt.x, mBExt.y, B.x, B.y, 28, 0),
      lineLabelAt(nCExt.x, nCExt.y, C.x, C.y, 28, 0),
    ].forEach((p) => {
      xs.push(p.x);
      ys.push(p.y);
    });

    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    const dx = VIEW_W / 2 - cx;
    const dy = VIEW_H / 2 - cy;

    const centered = {};
    Object.entries(base).forEach(([key, p]) => {
      centered[key] = { ...p, x: p.x + dx, y: p.y + dy };
    });
    return centered;
  };

  const POINTS = centerPoints(BASE_POINTS);

  const buildLineParts = () => {
    const A = POINTS.A;
    const B = POINTS.B;
    const C = POINTS.C;
    const D = POINTS.D;

    const kAExt = extend(A.x, A.y, D.x, D.y, EXT, true);
    const kDExt = extend(A.x, A.y, D.x, D.y, EXT, false);
    const lBExt = extend(B.x, B.y, C.x, C.y, EXT, true);
    const lCExt = extend(B.x, B.y, C.x, C.y, EXT, false);
    const mAExt = extend(A.x, A.y, B.x, B.y, EXT, true);
    const mBExt = extend(A.x, A.y, B.x, B.y, EXT, false);
    const nDExt = extend(D.x, D.y, C.x, C.y, EXT, true);
    const nCExt = extend(D.x, D.y, C.x, C.y, EXT, false);

    const kLabel = lineLabelAt(kAExt.x, kAExt.y, A.x, A.y, 32, -14);
    const lLabel = lineLabelAt(lBExt.x, lBExt.y, B.x, B.y, 32, 14);
    const mLabel = lineLabelAt(mBExt.x, mBExt.y, B.x, B.y, 28, 0);
    const nLabel = lineLabelAt(nCExt.x, nCExt.y, C.x, C.y, 28, 0);

    return {
      k_rayA: {
        x1: kAExt.x, y1: kAExt.y, x2: A.x, y2: A.y,
        ms: "url(#mc2-arr-s)", me: "",
        label: { text: "k", x: kLabel.x, y: kLabel.y },
      },
      k_segment: {
        x1: A.x, y1: A.y, x2: D.x, y2: D.y,
        ms: "", me: "", parallel: "single",
      },
      k_rayD: {
        x1: D.x, y1: D.y, x2: kDExt.x, y2: kDExt.y,
        ms: "", me: "url(#mc2-arr-e)", label: null,
      },
      l_rayB: {
        x1: lBExt.x, y1: lBExt.y, x2: B.x, y2: B.y,
        ms: "url(#mc2-arr-s)", me: "",
        label: { text: "l", x: lLabel.x, y: lLabel.y },
      },
      l_segment: {
        x1: B.x, y1: B.y, x2: C.x, y2: C.y,
        ms: "", me: "", parallel: "single",
      },
      l_rayC: {
        x1: C.x, y1: C.y, x2: lCExt.x, y2: lCExt.y,
        ms: "", me: "url(#mc2-arr-e)", label: null,
      },
      m_rayA: {
        x1: mAExt.x, y1: mAExt.y, x2: A.x, y2: A.y,
        ms: "url(#mc2-arr-s)", me: "", label: null,
      },
      m_segment: {
        x1: A.x, y1: A.y, x2: B.x, y2: B.y,
        ms: "", me: "", parallel: "double",
      },
      m_rayB: {
        x1: B.x, y1: B.y, x2: mBExt.x, y2: mBExt.y,
        ms: "", me: "url(#mc2-arr-e)",
        label: { text: "m", x: mLabel.x, y: mLabel.y },
      },
      n_rayD: {
        x1: nDExt.x, y1: nDExt.y, x2: D.x, y2: D.y,
        ms: "url(#mc2-arr-s)", me: "", label: null,
      },
      n_segment: {
        x1: D.x, y1: D.y, x2: C.x, y2: C.y,
        ms: "", me: "", parallel: "double",
      },
      n_rayC: {
        x1: C.x, y1: C.y, x2: nCExt.x, y2: nCExt.y,
        ms: "", me: "url(#mc2-arr-e)",
        label: { text: "n", x: nLabel.x, y: nLabel.y },
      },
    };
  };

  const LINE_KEYS = [
    "k_rayA", "k_segment", "k_rayD",
    "l_rayB", "l_segment", "l_rayC",
    "m_rayA", "m_segment", "m_rayB",
    "n_rayD", "n_segment", "n_rayC",
  ];

  const interiorArc = (cx, cy, n1, n2) => {
    const a1 = vecToDeg(n1.x - cx, n1.y - cy);
    const a2 = vecToDeg(n2.x - cx, n2.y - cy);
    const span = (((a2 - a1) % 360) + 360) % 360;
    if (span > 180) return { start: a2, end: a1 };
    return { start: a1, end: a2 };
  };

  const buildAngles = () => {
    const A = POINTS.A;
    const B = POINTS.B;
    const C = POINTS.C;
    const D = POINTS.D;
    const arcA = interiorArc(A.x, A.y, D, B);
    const arcB = interiorArc(B.x, B.y, A, C);
    const arcC = interiorArc(C.x, C.y, B, D);
    const arcD = interiorArc(D.x, D.y, C, A);
    return [
      { id: "A", cx: A.x, cy: A.y, color: COL_A, start: arcA.start, end: arcA.end },
      { id: "B", cx: B.x, cy: B.y, color: COL_B, start: arcB.start, end: arcB.end },
      { id: "C", cx: C.x, cy: C.y, color: COL_C, start: arcC.start, end: arcC.end },
      { id: "D", cx: D.x, cy: D.y, color: COL_D, start: arcD.start, end: arcD.end },
    ];
  };

  const LINES = buildLineParts();
  const ANGLES = buildAngles();

  /* ── visual config per step ── */
  const getStepVisual = (step, labels, clickableAngle) => {
    const givenVal = APP_DATA.givenAngle.value + "\u00B0";
    const unknown = APP_DATA.unknownLabel;
    const fullHighlight = {
      activeLines: ALL_LINES,
      activeAngles: ALL_ANGLES,
      activePoints: ALL_ANGLES,
      angleLabels: buildAngleLabels(labels.b, labels.c, labels.d),
      lineLabels: ALL_LINES,
      chevrons: ALL_LINES,
      blinkAngles: [],
      colorBlinkLines: [],
      parallelText: null,
    };

    if (
      (step === 7 && clickableAngle === "C") ||
      (step === 9 && clickableAngle === "D")
    ) {
      return fullHighlight;
    }

    switch (step) {
      case 1:
        return {
          activeLines: ALL_LINES, activeAngles: ALL_ANGLES, activePoints: ALL_ANGLES,
          angleLabels: { A: givenVal }, lineLabels: ALL_LINES, chevrons: ALL_LINES,
          blinkAngles: [], colorBlinkLines: [], parallelText: null,
        };
      case 2:
        return {
          activeLines: ["k", "m"], activeAngles: ["A"], activePoints: ["A"],
          angleLabels: { A: givenVal }, lineLabels: [], chevrons: [],
          blinkAngles: ["A"], colorBlinkLines: [], parallelText: null,
        };
      case 3:
        return {
          activeLines: ["k", "l"], activeAngles: [], activePoints: [],
          angleLabels: {}, lineLabels: ["k", "l"], chevrons: ["k", "l"],
          blinkAngles: [], colorBlinkLines: ["k", "l"], parallelText: "k",
        };
      case 4:
        return {
          activeLines: ["m", "n"], activeAngles: [], activePoints: [],
          angleLabels: {}, lineLabels: ["m", "n"], chevrons: ["m", "n"],
          blinkAngles: [], colorBlinkLines: ["m", "n"], parallelText: "m",
        };
      case 5:
        return {
          activeLines: ALL_LINES,
          activeAngles: ["B", "C", "D"], activePoints: ["B", "C", "D"],
          angleLabels: { A: givenVal, B: unknown, C: unknown, D: unknown },
          lineLabels: [], chevrons: [],
          blinkAngles: ["B", "C", "D"], colorBlinkLines: [], parallelText: null,
        };
      case 6: {
        var c6 = MCQ_CFG[6];
        return {
          activeLines: c6.activeLines,
          activeAngles: c6.pairAngles,
          activePoints: c6.activePoints,
          angleLabels: buildAngleLabels(labels.b, null, null),
          lineLabels: c6.lineLabels,
          chevrons: c6.chevrons,
          blinkAngles: [], colorBlinkLines: [], parallelText: null,
        };
      }
      case 7: {
        var c7 = MCQ_CFG[6];
        return {
          activeLines: c7.activeLines,
          activeAngles: c7.pairAngles,
          activePoints: c7.activePoints,
          angleLabels: buildAngleLabels(labels.b, null, null),
          lineLabels: c7.lineLabels,
          chevrons: c7.chevrons,
          blinkAngles: [], colorBlinkLines: [], parallelText: null,
        };
      }
      case 8: {
        var c8 = MCQ_CFG[8];
        return {
          activeLines: c8.activeLines,
          activeAngles: c8.pairAngles,
          activePoints: c8.activePoints,
          angleLabels: buildAngleLabels(labels.b, labels.c, null),
          lineLabels: c8.lineLabels,
          chevrons: c8.chevrons,
          blinkAngles: [], colorBlinkLines: [], parallelText: null,
        };
      }
      case 9: {
        var c9 = MCQ_CFG[8];
        return {
          activeLines: c9.activeLines,
          activeAngles: c9.pairAngles,
          activePoints: c9.activePoints,
          angleLabels: buildAngleLabels(labels.b, labels.c, null),
          lineLabels: c9.lineLabels,
          chevrons: c9.chevrons,
          blinkAngles: [], colorBlinkLines: [], parallelText: null,
        };
      }
      case 10: {
        var c10 = MCQ_CFG[10];
        return {
          activeLines: c10.activeLines,
          activeAngles: c10.pairAngles,
          activePoints: c10.activePoints,
          angleLabels: buildAngleLabels(labels.b, labels.c, labels.d),
          lineLabels: c10.lineLabels,
          chevrons: c10.chevrons,
          blinkAngles: [], colorBlinkLines: [], parallelText: null,
        };
      }
      case 11: {
        var c11 = MCQ_CFG[10];
        return {
          activeLines: c11.activeLines,
          activeAngles: c11.pairAngles,
          activePoints: c11.activePoints,
          angleLabels: buildAngleLabels(labels.b, labels.c, labels.d),
          lineLabels: c11.lineLabels,
          chevrons: c11.chevrons,
          blinkAngles: [], colorBlinkLines: [], parallelText: null,
        };
      }
      case 12:
        return fullHighlight;
      default:
        return getStepVisual(1, labels, null);
    }
  };

  const includes = (list, item) => list.indexOf(item) !== -1;

  /* ══════════════════════════════════════════════ */
  /*  Component                                     */
  /* ══════════════════════════════════════════════ */
  return function MainCanvas2(props) {
    const h = React.createElement;
    const {
      step = 1,
      clickableAngle = null,
      onQuestionBlink,
      onUpdateTexts,
      onSetNextEnabled,
      onAngleClick,
      onRegisterNudgeTarget,
      onPostFindReady,
      onAngleNudgeReady,
      onSummariseReady,
    } = props;
    const { useState, useEffect, useRef } = React;

    /* ── state ── */
    const [blinkFocus, setBlinkFocus] = useState(null);
    const [runtimeColorBlink, setRuntimeColorBlink] = useState([]);
    const [lineColors, setLineColors] = useState({});
    const [showParallelText, setShowParallelText] = useState(false);
    const [showTransversalText, setShowTransversalText] = useState(false);

    const [panelVisible, setPanelVisible] = useState(false);
    const [panelMode, setPanelMode] = useState(null);
    const [diagramShifted, setDiagramShifted] = useState(false);

    const [dehiParts, setDehiParts] = useState([]);
    const [optionAnswered, setOptionAnswered] = useState(false);
    const [wrongOptions, setWrongOptions] = useState([]);
    const [feedbackVisible, setFeedbackVisible] = useState(false);
    const [feedbackMode, setFeedbackMode] = useState(null);
    const [feedbackText, setFeedbackText] = useState("");

    const [angleBLabel, setAngleBLabel] = useState(null);
    const [angleCLabel, setAngleCLabel] = useState(null);
    const [angleDLabel, setAngleDLabel] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [inputState, setInputState] = useState("");
    const [showHint, setShowHint] = useState(false);
    const [numpadDisabled, setNumpadDisabled] = useState(false);
    const [flyingValue, setFlyingValue] = useState(null);
    const [transSeg, setTransSeg] = useState("m_segment");

    const svgRef = useRef(null);
    const inputBoxRef = useRef(null);
    const animRunRef = useRef(0);
    const DIAGRAM_RECENTER_MS = 650;

    /* ── computed visual ── */
    const labelVals = {
      b: angleBLabel ? angleBLabel + "\u00B0" : null,
      c: angleCLabel ? angleCLabel + "\u00B0" : null,
      d: angleDLabel ? angleDLabel + "\u00B0" : null,
    };
    const vis = getStepVisual(step, labelVals, clickableAngle);

    if (blinkFocus) vis.blinkAngles = [blinkFocus];
    if (runtimeColorBlink.length) vis.colorBlinkLines = runtimeColorBlink;
    if (showParallelText) {
      var mcqCfg = MCQ_CFG[step];
      vis.parallelText = mcqCfg ? mcqCfg.parallelText : "k";
    }

    /* ── reset when leaving find-angle steps ── */
    useEffect(() => {
      if (FIND_STEPS.includes(step)) return;
      setBlinkFocus(null);
      setRuntimeColorBlink([]);
      setLineColors({});
      setShowParallelText(false);
      setShowTransversalText(false);
      setPanelVisible(false);
      setPanelMode(null);
      setDiagramShifted(false);
      setDehiParts([]);
      setOptionAnswered(false);
      setWrongOptions([]);
      setFeedbackVisible(false);
      setFeedbackMode(null);
      setFeedbackText("");
      setInputValue("");
      setInputState("");
      setShowHint(false);
      setNumpadDisabled(false);
      setFlyingValue(null);
      if (step < 7) setAngleBLabel(null);
      if (step < 9) setAngleCLabel(null);
      if (step < 11) setAngleDLabel(null);
    }, [step]);

    /* ── register nudge target for clickable angle B (step 5) ── */
    useEffect(() => {
      if (!clickableAngle || !onRegisterNudgeTarget) return;
      if (clickableAngle === "C" || clickableAngle === "D") return;
      var valid = clickableAngle === "B" && step === 5;
      if (!valid) return;
      var update = function () {
        var el = document.querySelector(
          ".angle-" + clickableAngle.toLowerCase() + "-hit",
        );
        if (el) onRegisterNudgeTarget(el.getBoundingClientRect());
      };
      var tid = setTimeout(update, 150);
      window.addEventListener("resize", update);
      return function () {
        clearTimeout(tid);
        window.removeEventListener("resize", update);
      };
    }, [step, clickableAngle, onRegisterNudgeTarget, blinkFocus]);

    /* ── MCQ steps: animation sequence ── */
    useEffect(() => {
      if (!MCQ_STEPS.includes(step)) return;
      var cfg = MCQ_CFG[step];
      var stepKey = MCQ_STEP_KEY[step];
      var stepData = APP_DATA[stepKey];
      var runId = ++animRunRef.current;

      setBlinkFocus(null);
      setRuntimeColorBlink([]);
      setLineColors({});
      setShowParallelText(false);
      setShowTransversalText(false);
      setTransSeg(cfg.transSeg);
      setPanelVisible(false);
      setPanelMode(null);
      setDiagramShifted(false);
      setDehiParts([]);
      setOptionAnswered(false);
      setWrongOptions([]);
      setFeedbackVisible(false);
      setFeedbackMode(null);
      setFeedbackText("");
      if (onSetNextEnabled) onSetNextEnabled(false);

      var runAnim = async function () {
        await wait(80);
        if (animRunRef.current !== runId) return;
        if (onQuestionBlink) onQuestionBlink(true);
        await wait(1400);
        if (animRunRef.current !== runId) return;
        if (onQuestionBlink) onQuestionBlink(false);

        setBlinkFocus(cfg.blinkAngle);
        await wait(2600);
        if (animRunRef.current !== runId) return;
        setBlinkFocus(null);

        await wait(600);
        if (animRunRef.current !== runId) return;

        if (onUpdateTexts) onUpdateTexts(stepData.animParallel, " ");
        setRuntimeColorBlink(cfg.parallels);
        setShowParallelText(true);
        await wait(3000);
        if (animRunRef.current !== runId) return;
        setRuntimeColorBlink([]);
        var lc = {};
        cfg.parallels.forEach(function (p) { lc[p] = COL_YELLOW; });
        setLineColors(lc);
        setShowParallelText(false);

        await wait(600);
        if (animRunRef.current !== runId) return;

        if (onUpdateTexts) onUpdateTexts(stepData.animTransversal, " ");
        setRuntimeColorBlink([cfg.transversal]);
        setShowTransversalText(true);
        await wait(3000);
        if (animRunRef.current !== runId) return;
        setRuntimeColorBlink([]);
        setLineColors(cfg.lineColors);
        setShowTransversalText(false);

        await wait(600);
        if (animRunRef.current !== runId) return;

        if (onUpdateTexts)
          onUpdateTexts(stepData.optionsQuestion, APP_DATA.navTapCorrectOption);
        setPanelMode("options");
        setPanelVisible(true);
        setDiagramShifted(true);
      };

      runAnim();
    }, [step]);

    /* ── waiting to click next angle: full diagram, no panel ── */
    useEffect(() => {
      if (
        (step === 7 && clickableAngle === "C") ||
        (step === 9 && clickableAngle === "D")
      ) {
        setPanelVisible(false);
        setPanelMode(null);
        setDiagramShifted(false);
        setLineColors({});
        setShowHint(false);
      }
    }, [step, clickableAngle]);

    /* ── numpad steps: setup ── */
    useEffect(() => {
      if (!NUMPAD_STEPS.includes(step)) return;
      if (
        (step === 7 && clickableAngle === "C") ||
        (step === 9 && clickableAngle === "D")
      ) {
        return;
      }
      var lineCfg = getMcqCfgForNumpad(step);
      setPanelMode("numpad");
      setPanelVisible(true);
      setDiagramShifted(true);
      setDehiParts([]);
      setFeedbackVisible(false);
      setFeedbackMode(null);
      setFeedbackText("");
      setWrongOptions([]);
      setOptionAnswered(false);
      setInputValue("");
      setInputState("");
      setShowHint(false);
      setNumpadDisabled(false);
      setLineColors(lineCfg.lineColors);
      if (onSetNextEnabled) onSetNextEnabled(false);
    }, [step]);

    /* ── handlers ── */
    var playSnd = function (s) {
      if (typeof playSound === "function") playSound(s);
    };

    var handleOptionClick = function (option) {
      if (optionAnswered || !MCQ_STEPS.includes(step)) return;
      var cfg = MCQ_CFG[step];
      var stepKey = MCQ_STEP_KEY[step];
      var stepData = APP_DATA[stepKey];
      if (option === APP_DATA.correctOption) {
        setOptionAnswered(true);
        setDehiParts([]);
        setWrongOptions([]);
        setFeedbackMode("correct");
        setFeedbackText(stepData.correctFeedback);
        setFeedbackVisible(true);
        playSnd("correct");
        if (onSetNextEnabled) onSetNextEnabled(true);
        if (onUpdateTexts)
          onUpdateTexts(stepData.optionsQuestion, stepData.navCorrect);
        return;
      }
      playSnd("wrong");
      setDehiParts(cfg.wrongDehi);
      setWrongOptions(function (prev) {
        return prev.indexOf(option) !== -1 ? prev : prev.concat(option);
      });
      setFeedbackMode("wrong");
      setFeedbackText(stepData.wrongFeedback);
      setFeedbackVisible(true);
    };

    var getAngleVertexScreenRect = function (angleId) {
      var svgEl = svgRef.current;
      var pt = POINTS[angleId];
      if (!svgEl || !pt) return null;
      var svgPt = svgEl.createSVGPoint();
      svgPt.x = pt.x;
      svgPt.y = pt.y;
      var screen = svgPt.matrixTransform(svgEl.getScreenCTM());
      var size = 56;
      return {
        left: screen.x - size / 2,
        top: screen.y - size / 2,
        width: size,
        height: size,
      };
    };

    var registerAngleNudge = function (angleId) {
      var rect = getAngleVertexScreenRect(angleId);
      if (!rect || !onRegisterNudgeTarget) return;
      onRegisterNudgeTarget(rect);
      if (onAngleNudgeReady) onAngleNudgeReady();
    };

    var showAngleNudgeAfterRecenter = function (angleId) {
      var wrap = document.querySelector(
        ".main-canvas2-container .mc2-diagram-wrap",
      );
      var fired = false;
      var fire = function () {
        if (fired) return;
        fired = true;
        requestAnimationFrame(function () {
          registerAngleNudge(angleId);
        });
      };
      if (wrap) {
        var onEnd = function (e) {
          if (e.target !== wrap || e.propertyName !== "width") return;
          wrap.removeEventListener("transitionend", onEnd);
          fire();
        };
        wrap.addEventListener("transitionend", onEnd);
        setTimeout(fire, DIAGRAM_RECENTER_MS + 80);
      } else {
        setTimeout(fire, DIAGRAM_RECENTER_MS);
      }
    };

    var getAngleScreenPos = function (angleId) {
      var svgEl = svgRef.current;
      var ang = ANGLES.find(function (a) { return a.id === angleId; });
      if (!svgEl || !ang) return null;
      var mid = interiorLabelAngle(ang.start, ang.end);
      var lp = polarToXY(
        ang.cx,
        ang.cy,
        ANGLE_LABEL_R[angleId] || LABEL_R,
        mid,
      );
      var pt = svgEl.createSVGPoint();
      pt.x = lp.x;
      pt.y = lp.y;
      var screen = pt.matrixTransform(svgEl.getScreenCTM());
      return { x: screen.x, y: screen.y };
    };

    var setAngleLabel = function (angleId, val) {
      if (angleId === "B") setAngleBLabel(val);
      if (angleId === "C") setAngleCLabel(val);
      if (angleId === "D") setAngleDLabel(val);
    };

    var flyValueToAngle = function (angleId, valueText, color, onDone) {
      var inputEl = inputBoxRef.current;
      var target = getAngleScreenPos(angleId);
      var angleKey = NUMPAD_ANGLE_KEY[step];
      var correctVal = String(APP_DATA[angleKey].correct);

      if (!inputEl || !target) {
        setAngleLabel(angleId, correctVal);
        if (onDone) onDone();
        return;
      }
      var from = inputEl.getBoundingClientRect();
      var fromX = from.left + from.width / 2;
      var fromY = from.top + from.height / 2;
      setFlyingValue({ text: valueText, x: fromX, y: fromY, color: color });

      if (typeof gsap !== "undefined") {
        var proxy = { x: fromX, y: fromY };
        gsap.to(proxy, {
          x: target.x,
          y: target.y,
          duration: 0.85,
          ease: "power2.inOut",
          onUpdate: function () {
            setFlyingValue({
              text: valueText,
              x: proxy.x,
              y: proxy.y,
              color: color,
            });
          },
          onComplete: function () {
            setFlyingValue(null);
            setAngleLabel(angleId, correctVal);
            setTimeout(function () {
              setPanelVisible(false);
              setDiagramShifted(false);
              if (onDone) onDone();
              if (step === 7) showAngleNudgeAfterRecenter("C");
              else if (step === 9) showAngleNudgeAfterRecenter("D");
            }, 1000);
          },
        });
      } else {
        setFlyingValue(null);
        setAngleLabel(angleId, correctVal);
        setTimeout(function () {
          setPanelVisible(false);
          setDiagramShifted(false);
          if (onDone) onDone();
          if (step === 7) showAngleNudgeAfterRecenter("C");
          else if (step === 9) showAngleNudgeAfterRecenter("D");
        }, 1000);
      }
    };

    /* ── keep C/D nudge aligned after diagram recenters ── */
    useEffect(() => {
      var postFind =
        (step === 7 && clickableAngle === "C") ||
        (step === 9 && clickableAngle === "D");
      if (!postFind || panelVisible || diagramShifted || !onRegisterNudgeTarget) {
        return;
      }
      var update = function () {
        registerAngleNudge(clickableAngle);
      };
      window.addEventListener("resize", update);
      return function () {
        window.removeEventListener("resize", update);
      };
    }, [
      step,
      clickableAngle,
      panelVisible,
      diagramShifted,
      onRegisterNudgeTarget,
      onAngleNudgeReady,
    ]);

    var handleNumpadSubmit = function () {
      if (numpadDisabled || !inputValue || !NUMPAD_STEPS.includes(step)) return;
      var angleKey = NUMPAD_ANGLE_KEY[step];
      var angleData = APP_DATA[angleKey];
      var angleId = NUMPAD_ANGLE_ID[step];
      var num = parseInt(inputValue, 10);
      if (isNaN(num)) return;
      if (num === angleData.correct) {
        playSnd("correct");
        setInputState("correct");
        setShowHint(false);
        setNumpadDisabled(true);
        flyValueToAngle(
          angleId,
          num + "\u00B0",
          ANGLE_COLORS[angleId],
          function () {
            if (step === 7 && onPostFindReady)
              onPostFindReady("C", APP_DATA.step7.tapAngleC);
            else if (step === 9 && onPostFindReady)
              onPostFindReady("D", APP_DATA.step9.tapAngleD);
            else if (step === 11 && onSummariseReady) onSummariseReady();
          },
        );
      } else {
        playSnd("wrong");
        setInputState("wrong");
        setShowHint(true);
      }
    };

    /* ── render helpers ── */
    var resolveMarker = function (ref, lineDehi, lineName) {
      if (!ref) return "";
      if (lineDehi) {
        return ref.indexOf("arr-s") !== -1
          ? "url(#mc2-arr-s-dehi)"
          : "url(#mc2-arr-e-dehi)";
      }
      var suffix = "";
      if (lineColors[lineName] === COL_YELLOW) suffix = "-yellow";
      else if (lineColors[lineName] === COL_BLUE) suffix = "-blue";
      return ref
        .replace("mc2-arr-s", "mc2-arr-s" + suffix)
        .replace("mc2-arr-e", "mc2-arr-e" + suffix);
    };

    var renderDefs = function () {
      return h("defs", null,
        marker("mc2-arr-s", true),
        marker("mc2-arr-e", false),
        marker("mc2-arr-s-yellow", true, COL_YELLOW),
        marker("mc2-arr-e-yellow", false, COL_YELLOW),
        marker("mc2-arr-s-blue", true, COL_BLUE),
        marker("mc2-arr-e-blue", false, COL_BLUE),
        marker("mc2-arr-s-dehi", true, COL_DEHI),
        marker("mc2-arr-e-dehi", false, COL_DEHI),
      );
    };

    var renderParallelMarker = function (ln, key, lineName) {
      if (!ln.parallel) return null;
      var mx = (ln.x1 + ln.x2) / 2;
      var my = (ln.y1 + ln.y2) / 2;
      var dx = ln.x2 - ln.x1;
      var dy = ln.y2 - ln.y1;
      var len = Math.hypot(dx, dy);
      var ux = dx / len;
      var uy = dy / len;
      var chevronDehi = !includes(vis.chevrons, lineName);
      var chevronColor = chevronDehi ? COL_DEHI : (lineColors[lineName] || COL_LINE);
      var chevronClass = "parallel-marker" + (chevronDehi ? " dehi" : "");

      var chevronProps = {
        fill: "none",
        stroke: chevronColor,
        strokeWidth: STROKE_W,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        pointerEvents: "none",
      };

      if (ln.parallel === "double") {
        var gap = 7;
        return h("g", { key: key + "-par", className: chevronClass },
          h("path", { d: chevronPath(mx - ux * gap, my - uy * gap, ux, uy, 5, 3.5), ...chevronProps }),
          h("path", { d: chevronPath(mx + ux * gap, my + uy * gap, ux, uy, 5, 3.5), ...chevronProps }),
        );
      }

      return h("path", {
        key: key + "-par",
        className: chevronClass,
        d: chevronPath(mx, my, ux, uy, 5, 3.5),
        ...chevronProps,
      });
    };

    var renderLines = function () {
      return h("g", null,
        LINE_KEYS.map(function (key) {
          var ln = LINES[key];
          var lineName = lineOf(key);
          var lineActive = includes(vis.activeLines, lineName);
          var forcedDehi = includes(dehiParts, key);
          var lineDehi = !lineActive || forcedDehi;
          var colorBlink = includes(vis.colorBlinkLines, lineName) && !forcedDehi;
          var mcqWrongFeedback = MCQ_STEPS.includes(step) && dehiParts.length > 0;
          var labelActive =
            ln.label &&
            includes(vis.lineLabels, lineName) &&
            !mcqWrongFeedback;
          var labelDehi = ln.label && !labelActive;

          var strokeColor = lineDehi ? COL_DEHI : (lineColors[lineName] || COL_LINE);

          var ms = resolveMarker(ln.ms, lineDehi, lineName);
          var me = resolveMarker(ln.me, lineDehi, lineName);

          var groupClass = "line-segment line-" + key;
          if (lineDehi) groupClass += " dehi";
          if (colorBlink) groupClass += " color-blink-line";

          return h("g", { key: key, className: groupClass },
            h("line", {
              className: "line-stroke",
              x1: ln.x1, y1: ln.y1, x2: ln.x2, y2: ln.y2,
              stroke: strokeColor,
              strokeWidth: STROKE_W,
              markerStart: ms,
              markerEnd: me,
            }),
            renderParallelMarker(ln, key, lineName),
            ln.label && h("text", {
              x: ln.label.x,
              y: ln.label.y,
              className: "line-label" + (labelDehi ? " dehi" : ""),
              fill: labelDehi ? COL_DEHI : (lineColors[lineName] || COL_LINE),
            }, ln.label.text),
          );
        }),
      );
    };

    var renderAngles = function () {
      return h("g", null,
        ANGLES.map(function (a) {
          var angleActive = includes(vis.activeAngles, a.id);
          var angleDehi = !angleActive;
          var labelText = vis.angleLabels[a.id] || null;
          var shouldBlink = includes(vis.blinkAngles, a.id);
          var blinkFive = blinkFocus === a.id;
          var mid = interiorLabelAngle(a.start, a.end);
          var lp = polarToXY(
            a.cx,
            a.cy,
            ANGLE_LABEL_R[a.id] || LABEL_R,
            mid,
          );
          var isClickable =
            clickableAngle === a.id &&
            ((a.id === "B" && step === 5) ||
              (a.id === "C" && step === 7) ||
              (a.id === "D" && step === 9));

          var groupClass = "angle-group angle-" + a.id;
          if (angleDehi) groupClass += " dehi";
          if (shouldBlink && step === 5) groupClass += " blink-opacity";
          if (blinkFive) groupClass += " blink-opacity-5";
          if (isClickable) groupClass += " angle-" + a.id.toLowerCase() + "-hit";

          return h("g", {
            key: "ang-" + a.id,
            className: groupClass,
            onClick: isClickable ? function () { onAngleClick(a.id); } : undefined,
            style: isClickable ? { cursor: "pointer" } : undefined,
          },
            isClickable && h("circle", {
              cx: a.cx, cy: a.cy, r: ANG_R + 18,
              fill: "transparent", pointerEvents: "all",
            }),
            h("path", {
              className: "angle-arc",
              d: arcPath(a.cx, a.cy, ANG_R, a.start, a.end),
              fill: angleDehi ? COL_DEHI : a.color,
              fillOpacity: angleDehi ? 0.35 : 0.7,
              pointerEvents: isClickable ? "all" : "none",
            }),
            labelText && h("text", {
              x: lp.x, y: lp.y,
              className: "degree-label",
              fill: angleDehi ? COL_DEHI : a.color,
              pointerEvents: "none",
            }, labelText),
          );
        }),
      );
    };

    var renderPoints = function () {
      return h("g", null,
        Object.entries(POINTS).map(function (entry) {
          var name = entry[0];
          var pt = entry[1];
          var pointActive = includes(vis.activePoints, name);
          var pointDehi = !pointActive;
          var blinkLabel = blinkFocus === name;
          var groupClass = "point-group point-" + name + (pointDehi ? " dehi" : "");
          return h("g", { key: "pt-" + name, className: groupClass },
            h("circle", {
              cx: pt.x, cy: pt.y, r: PT_R,
              fill: pointDehi ? COL_DEHI : pt.color,
              stroke: pointDehi ? COL_DEHI : "white",
              strokeWidth: 1.5,
              pointerEvents: "none",
            }),
            h("text", {
              x: pt.x, y: pt.y + pt.labelDy,
              className: "point-label" + (blinkLabel ? " blink-opacity-5" : ""),
              fill: pointDehi ? COL_DEHI : pt.color,
              pointerEvents: "none",
            }, name),
          );
        }),
      );
    };

    var renderParallelText = function () {
      if (!vis.parallelText) return null;
      var label = APP_DATA.parallelLinesLabel;
      var pos;

      if (vis.parallelText === "k") {
        var seg = LINES.k_segment;
        pos = parallelTextBesideK(seg, 42, -0.11);
      } else {
        var seg2 = LINES.m_segment;
        pos = segmentTextPos(seg2.x1, seg2.y1, seg2.x2, seg2.y2, -42, 0);
      }

      var textClass = "parallel-lines-label opacity-blink-text";

      return h("text", {
        x: pos.x, y: pos.y,
        className: textClass,
        transform: "rotate(" + pos.rotate + " " + pos.x + " " + pos.y + ")",
      }, label);
    };

    var renderTransversalText = function () {
      if (!showTransversalText) return null;
      var pos;

      if (transSeg === "k_segment") {
        pos = parallelTextBesideK(LINES.k_segment, 42, -0.14);
      } else {
        var seg = LINES[transSeg] || LINES.m_segment;
        pos = segmentTextPos(seg.x1, seg.y1, seg.x2, seg.y2, -42, 0);
        pos.rotate = uprightRotate(pos.rotate);
      }

      return h("text", {
        x: pos.x, y: pos.y,
        className: "transversal-label opacity-blink-text",
        transform: "rotate(" + pos.rotate + " " + pos.x + " " + pos.y + ")",
      }, APP_DATA.transversalLabel);
    };

    var renderRightPanel = function () {
      if (!panelMode) return null;

      var panelClass = "mc2-right-panel" + (panelVisible ? " visible" : "");

      if (panelMode === "numpad") {
        var inputBoxClass = "answer-input-box" +
          (inputState === "correct" ? " correct" : "") +
          (inputState === "wrong" ? " wrong" : "");

        var numpadAngleKey = NUMPAD_ANGLE_KEY[step] || "angleB";
        return h("div", { className: panelClass },
          h("div", { className: "input-row" },
            h("span", { className: "input-prefix" }, APP_DATA[numpadAngleKey].prefix),
            h("div", { ref: inputBoxRef, className: inputBoxClass }, inputValue || "\u00A0"),
            h("span", { className: "input-suffix" }, "\u00B0"),
          ),
          h("div", { className: "numpad-wrapper" },
            h(Numpad, {
              disabled: numpadDisabled,
              onNumberClick: function (num) {
                if (numpadDisabled) return;
                if (inputState === "wrong") {
                  setInputState("");
                  setShowHint(false);
                  setInputValue(num);
                  return;
                }
                setInputValue(function (prev) {
                  return prev.length >= 3 ? prev : prev + num;
                });
              },
              onClear: function () {
                if (numpadDisabled) return;
                setInputValue("");
                if (inputState === "wrong") {
                  setInputState("");
                  setShowHint(false);
                }
              },
              onSubmit: handleNumpadSubmit,
            }),
          ),
        );
      }

      var processedFeedback = typeof handleComma === "function"
        ? handleComma(feedbackText)
        : feedbackText;

      return h("div", { className: panelClass },
        h("div", {
          className: "mc2-feedback-box" +
            (feedbackMode ? " " + feedbackMode : "") +
            (feedbackVisible ? " visible" : ""),
          dangerouslySetInnerHTML: { __html: processedFeedback },
        }),
        h("div", { className: "mc2-options-container" },
          APP_DATA.options.map(function (option) {
            var isWrong = !optionAnswered && wrongOptions.indexOf(option) !== -1;
            var isCorrect = optionAnswered && option === APP_DATA.correctOption;
            var optionLabel = typeof handleComma === "function"
              ? handleComma(option)
              : option;
            return h("button", {
              key: option,
              type: "button",
              className: "mc2-option-button" +
                (isWrong ? " incorrect" : "") +
                (isCorrect ? " correct" : ""),
              onClick: function () { handleOptionClick(option); },
              disabled: optionAnswered,
              dangerouslySetInnerHTML: { __html: optionLabel },
            });
          }),
        ),
      );
    };

    /* ── main render ── */
    var diagramClass = "mc2-diagram-wrap" + (diagramShifted ? " shifted" : "");

    return h("div", { className: "main-canvas2-container" },
      h("div", { className: diagramClass },
        h("svg", {
          ref: svgRef,
          className: "main-canvas2-svg",
          viewBox: "0 0 800 500",
          preserveAspectRatio: "xMidYMid meet",
        },
          renderDefs(),
          renderLines(),
          renderAngles(),
          renderPoints(),
          renderParallelText(),
          renderTransversalText(),
        ),
        showHint && h("div", {
          className:
            "mc2-hint-box blink-hint" +
            (current_language === "id" ? " id" : "") +
            (step === 9 ? " mc2-hint-box-middle" : "") +
            (step === 11 ? " mc2-hint-box-left" : ""),
        }, APP_DATA[NUMPAD_STEP_KEY[step]].wrongHint),
      ),
      renderRightPanel(),
      flyingValue && h("div", {
        className: "mc2-flying-value",
        style: { left: flyingValue.x + "px", top: flyingValue.y + "px", color: flyingValue.color },
      }, flyingValue.text),
    );
  };
})();
