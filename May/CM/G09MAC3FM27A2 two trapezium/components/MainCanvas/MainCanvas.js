/* ════════════════════════════════════════════════════════════
   Geometry constants
   ════════════════════════════════════════════════════════════ */

var POLY_ABCD = {
  A: { x: 83, y: 83 },
  B: { x: 412, y: 83 },
  C: { x: 327.5, y: 229.5 },
  D: { x: 122, y: 229.5 },
};

var POLY_PQRS = {
  P: { x: 832, y: 229.5 },
  Q: { x: 503, y: 229.5 },
  R: { x: 587.5, y: 83 },
  S: { x: 793, y: 83 },
};

var SVG_VIEWBOX = "0 0 915 312";
var FONT_VERTEX = 34;
var FONT_SIDE = 32;
var ARC_RADIUS = 32;
var SIDE_LINE_W = 5;
var HIT_LINE_W = 22;

var ABCD_ORDER = ["A", "B", "C", "D"];
var PQRS_ORDER = ["P", "Q", "R", "S"];

var ABCD_ADJ = { A: ["D", "B"], B: ["A", "C"], C: ["B", "D"], D: ["C", "A"] };
var PQRS_ADJ = { P: ["S", "Q"], Q: ["P", "R"], R: ["Q", "S"], S: ["R", "P"] };

var ABCD_ALL_SIDES = [
  { name: "AB", v1: "A", v2: "B" },
  { name: "BC", v1: "B", v2: "C" },
  { name: "CD", v1: "C", v2: "D" },
  { name: "DA", v1: "D", v2: "A" },
];
var PQRS_ALL_SIDES = [
  { name: "PQ", v1: "P", v2: "Q" },
  { name: "QR", v1: "Q", v2: "R" },
  { name: "RS", v1: "R", v2: "S" },
  { name: "SP", v1: "S", v2: "P" },
];

var UNKNOWNS = {
  AD: { v1: "A", v2: "D", polyKey: "ABCD", corrSide: "SP", corrPolyKey: "PQRS", length: 15 },
  DC: { v1: "D", v2: "C", polyKey: "ABCD", corrSide: "RS", corrPolyKey: "PQRS", length: 16 },
  PQ: { v1: "P", v2: "Q", polyKey: "PQRS", corrSide: "AB", corrPolyKey: "ABCD", length: 40 },
  QR: { v1: "Q", v2: "R", polyKey: "PQRS", corrSide: "BC", corrPolyKey: "ABCD", length: 21 },
};

var SIDE_LABELS = {
  AB: { text: "40 cm", tx: 203, ty: 67.94 },
  BC: { text: "21 cm", tx: 0, ty: 29.94, transform: "translate(348 202.426) rotate(-59.1717)" },
  AD: { text: "15 cm", tx: 0, ty: 29.94, transform: "translate(86.6396 116) rotate(74.622)" },
  DC: { text: "16 cm", tx: 180, ty: 267.94 },
  RS: { text: "16 cm", tx: 646, ty: 74.94 },
  SP: { text: "15 cm", tx: 0, ty: 29.94, transform: "translate(844.64 97) rotate(74.622)" },
  PQ: { text: "40 cm", tx: 646, ty: 267.94 },
  QR: { text: "21 cm", tx: 0, ty: 29.94, transform: "translate(487 174.426) rotate(-59.1717)" },
};

var VLABEL_POS = {
  A: { x: 68, y: 71.88 }, B: { x: 397, y: 71.88 },
  C: { x: 308, y: 271.88 }, D: { x: 110, y: 271.88 },
  P: { x: 817, y: 271.88 }, Q: { x: 489, y: 271.88 },
  R: { x: 574, y: 71.88 }, S: { x: 778, y: 71.88 },
};

var ALWAYS_VISIBLE = new Set(["AB", "BC", "RS", "SP"]);

var YELLOW_FILL = "#ffd700";

/* ── Angle data ── */

var ANGLE_FILLS = {
  A: "rgba(100, 200, 255, 0.3)", P: "rgba(100, 200, 255, 0.3)",
  B: "rgba(180, 120, 255, 0.3)", Q: "rgba(180, 120, 255, 0.3)",
  C: "rgba(255, 160, 200, 0.3)", R: "rgba(255, 160, 200, 0.3)",
  D: "rgba(120, 230, 160, 0.3)", S: "rgba(120, 230, 160, 0.3)",
};

var ANGLE_VALUES = { A: 60, B: 40, C: 140, D: 120, P: 60, Q: 40, R: 140, S: 120 };

var S6_SEQ = [
  { target: "Q", correct: "B" },
  { target: "P", correct: "A" },
  { target: "R", correct: "C" },
];

var COMP_PAIRS = {
  D: { comp: "A", compVal: 60, result: 120, mirror: "S" },
  C: { comp: "B", compVal: 40, result: 140, mirror: "R" },
  S: { comp: "P", compVal: 60, result: 120, mirror: "D" },
  R: { comp: "Q", compVal: 40, result: 140, mirror: "C" },
};

var ANGLE_CUE_COLORS = { C: "yellow", R: "yellow", D: "green", S: "green" };
var CALC_SUBTRAHEND_TEXT_SLOT = { x: 46, y: 0 };
var CALC_SUBTRAHEND_DEST_OFFSET = { x: 0, y: 0 };
var CALC_EQUATION_INWARD_OFFSET = { C: 10, D: 10 };
var CALC_EQUATION_SCREEN_OFFSET = {
  S: { x: -10, y: 16 },
};

/* ════════════════════════════════════════════════════════════
   Helper functions
   ════════════════════════════════════════════════════════════ */

function _centroid(poly) {
  var keys = Object.keys(poly);
  var sx = 0, sy = 0;
  keys.forEach(function (k) { sx += poly[k].x; sy += poly[k].y; });
  return { x: sx / keys.length, y: sy / keys.length };
}

function _mid(p1, p2) { return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }; }

function _outward(mid, centroid, dist) {
  var dx = mid.x - centroid.x, dy = mid.y - centroid.y;
  var len = Math.hypot(dx, dy) || 1;
  return { x: mid.x + (dx / len) * dist, y: mid.y + (dy / len) * dist };
}

function _inward(vertex, centroid, dist) {
  var dx = centroid.x - vertex.x, dy = centroid.y - vertex.y;
  var len = Math.hypot(dx, dy) || 1;
  return { x: vertex.x + (dx / len) * dist, y: vertex.y + (dy / len) * dist };
}

function _polar(cx, cy, r, deg) {
  var rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function _vecAngle(v) { return (Math.atan2(v.y, v.x) * 180) / Math.PI; }

function _innerArc(vertex, adj1, adj2) {
  var v1 = { x: adj1.x - vertex.x, y: adj1.y - vertex.y };
  var v2 = { x: adj2.x - vertex.x, y: adj2.y - vertex.y };
  var a1 = _vecAngle(v1), a2 = _vecAngle(v2);
  var diff = a2 - a1;
  while (diff <= -180) diff += 360;
  while (diff > 180) diff -= 360;
  if (diff < 0) { var t = a1; a1 = a2; a2 = t; }
  return { start: a1 + 90, end: a2 + 90 };
}

function _sectorPath(cx, cy, r, sa, ea) {
  var s = _polar(cx, cy, r, ea), e = _polar(cx, cy, r, sa);
  var large = ea - sa <= 180 ? "0" : "1";
  return "M " + cx + " " + cy + " L " + s.x + " " + s.y +
    " A " + r + " " + r + " 0 " + large + " 0 " + e.x + " " + e.y + " Z";
}

function _arcPath(cx, cy, r, sa, ea) {
  var s = _polar(cx, cy, r, ea), e = _polar(cx, cy, r, sa);
  var large = ea - sa <= 180 ? "0" : "1";
  return "M " + s.x + " " + s.y + " A " + r + " " + r + " 0 " + large + " 0 " + e.x + " " + e.y;
}

function _polyPath(poly, order) {
  var d = "M" + poly[order[0]].x + " " + poly[order[0]].y;
  for (var i = 1; i < order.length; i++) d += " L" + poly[order[i]].x + " " + poly[order[i]].y;
  return d + " Z";
}

function _getPoly(key) { return key === "ABCD" ? POLY_ABCD : POLY_PQRS; }
function _getAllSides(key) { return key === "ABCD" ? ABCD_ALL_SIDES : PQRS_ALL_SIDES; }

function _sideLabelFlyCfg(key) {
  var cfg = SIDE_LABELS[key];
  if (cfg.transform) {
    var parts = cfg.transform.match(/translate\(([\d.]+)\s+([\d.]+)\)\s+rotate\(([-\d.]+)\)/);
    return {
      hasTransform: true,
      tx: parseFloat(parts[1]),
      ty: parseFloat(parts[2]),
      rotate: parseFloat(parts[3]),
      tspanX: cfg.tx,
      tspanY: cfg.ty,
    };
  }
  return {
    hasTransform: false,
    tx: cfg.tx,
    ty: cfg.ty,
    tspanX: cfg.tx,
    tspanY: cfg.ty,
    rotate: 0,
  };
}

function _angleLabelPos(vk, offset) {
  offset = offset || 0;
  if (ABCD_ORDER.indexOf(vk) !== -1) return _inward(POLY_ABCD[vk], ABCD_C, 55 + offset);
  return _inward(POLY_PQRS[vk], PQRS_C, 55 + offset);
}

function _calcEquationPos(angle) {
  var inwardOffset = CALC_EQUATION_INWARD_OFFSET[angle] || 0;
  var screenOffset = CALC_EQUATION_SCREEN_OFFSET[angle] || { x: 0, y: 0 };
  var pos = _angleLabelPos(angle, inwardOffset);
  return {
    x: pos.x + screenOffset.x,
    y: pos.y + screenOffset.y,
  };
}

function _calcSubtrahendDestPos(angle) {
  var pos = _calcEquationPos(angle);
  return {
    x: pos.x + CALC_SUBTRAHEND_TEXT_SLOT.x + CALC_SUBTRAHEND_DEST_OFFSET.x,
    y: pos.y + CALC_SUBTRAHEND_TEXT_SLOT.y + CALC_SUBTRAHEND_DEST_OFFSET.y,
  };
}

function _getCalcLines(angle) {
  if (angle === "D") return [
    [POLY_ABCD.A, POLY_ABCD.D],
    [POLY_ABCD.A, _mid(POLY_ABCD.A, POLY_ABCD.B)],
    [POLY_ABCD.D, _mid(POLY_ABCD.D, POLY_ABCD.C)],
  ];
  if (angle === "C") return [
    [POLY_ABCD.B, POLY_ABCD.C],
    [POLY_ABCD.B, _mid(POLY_ABCD.A, POLY_ABCD.B)],
    [POLY_ABCD.C, _mid(POLY_ABCD.D, POLY_ABCD.C)],
  ];
  if (angle === "S") return [
    [POLY_PQRS.S, POLY_PQRS.P],
    [POLY_PQRS.S, _mid(POLY_PQRS.R, POLY_PQRS.S)],
    [POLY_PQRS.P, _mid(POLY_PQRS.P, POLY_PQRS.Q)],
  ];
  if (angle === "R") return [
    [POLY_PQRS.Q, POLY_PQRS.R],
    [POLY_PQRS.R, _mid(POLY_PQRS.R, POLY_PQRS.S)],
    [POLY_PQRS.Q, _mid(POLY_PQRS.P, POLY_PQRS.Q)],
  ];
  return [];
}

var ABCD_C = _centroid(POLY_ABCD);
var PQRS_C = _centroid(POLY_PQRS);

/* ════════════════════════════════════════════════════════════
   MainCanvas Component
   ════════════════════════════════════════════════════════════ */

var MainCanvas = function (props) {
  var step = props.step;
  var onSetNextEnabled = props.onSetNextEnabled;
  var onSetAnimationBusy = props.onSetAnimationBusy;
  var onUpdateTexts = props.onUpdateTexts;
  var onHideNudge = props.onHideNudge;
  var onShowNudge = props.onShowNudge;
  var isCompletedView = props.isCompletedView;
  var step5Phase = props.step5Phase || 1;

  var useState = React.useState;
  var useEffect = React.useEffect;
  var useRef = React.useRef;
  var h = React.createElement;

  /* ── State: Step 4 (sides) ── */
  var _fs = useState([]); var foundSides = _fs[0]; var setFoundSides = _fs[1];
  var _st = useState(1); var s4Stage = _st[0]; var setS4Stage = _st[1];
  var _ac = useState(null); var activeCue = _ac[0]; var setActiveCue = _ac[1];
  var _wl = useState(null); var wrongLine = _wl[0]; var setWrongLine = _wl[1];
  var _cl = useState(null); var correctLine = _cl[0]; var setCorrectLine = _cl[1];
  var _bl = useState(false); var blinking = _bl[0]; var setBlinking = _bl[1];
  var _lf = useState(null); var lastFoundMsg = _lf[0]; var setLastFoundMsg = _lf[1];
  var _s3h = useState(null); var step3HighlightSide = _s3h[0]; var setStep3HighlightSide = _s3h[1];
  var _s3c = useState([]); var step3VisibleCues = _s3c[0]; var setStep3VisibleCues = _s3c[1];

  /* ── State: Step 6 (angle correspondence) ── */
  var _s6i = useState(0); var s6Idx = _s6i[0]; var setS6Idx = _s6i[1];
  var _s6p = useState(null); var s6Phase = _s6p[0]; var setS6Phase = _s6p[1];
  var _uh = useState([]); var usedHotspots = _uh[0]; var setUsedHotspots = _uh[1];
  var _wh = useState(null); var wrongHotspot = _wh[0]; var setWrongHotspot = _wh[1];
  var _fb = useState(""); var feedbackText = _fb[0]; var setFeedbackText = _fb[1];

  /* ── State: Steps 6-8 shared ── */
  var _fa = useState({}); var foundAngles = _fa[0]; var setFoundAngles = _fa[1];
  var _hl = useState(null); var highlightAngle = _hl[0]; var setHighlightAngle = _hl[1];
  var _fd = useState(null); var flyData = _fd[0]; var setFlyData = _fd[1];
  var _hfd = useState(null); var htmlFlyData = _hfd[0]; var setHtmlFlyData = _hfd[1];
  var _sc = useState(false); var showCorrespCues = _sc[0]; var setShowCorrespCues = _sc[1];
  var _ska = useState([]); var step5KnownAngles = _ska[0]; var setStep5KnownAngles = _ska[1];
  var _s5c = useState([]); var step5VisibleCues = _s5c[0]; var setStep5VisibleCues = _s5c[1];
  var _rc = useState(["C", "D", "R", "S"]); var remainingAngleCues = _rc[0]; var setRemainingAngleCues = _rc[1];
  var _ack = useState(false); var angleCuesClickable = _ack[0]; var setAngleCuesClickable = _ack[1];

  /* ── State: Step 7 ── */
  var _act = useState(0); var actionContent = _act[0]; var setActionContent = _act[1];
  var _ca = useState(null); var calcAngle = _ca[0]; var setCalcAngle = _ca[1];
  var _cp = useState(0); var calcPhase = _cp[0]; var setCalcPhase = _cp[1];
  var _csv = useState(false); var calcSubtrahendVisible = _csv[0]; var setCalcSubtrahendVisible = _csv[1];
  var _ya = useState([]); var yellowAngles = _ya[0]; var setYellowAngles = _ya[1];

  /* ── Refs ── */
  var timerRef = useRef([]);
  var foundRef = useRef(foundSides);
  foundRef.current = foundSides;
  var foundAnglesRef = useRef(foundAngles);
  foundAnglesRef.current = foundAngles;
  var remainingRef = useRef(remainingAngleCues);
  remainingRef.current = remainingAngleCues;
  var s6IdxRef = useRef(s6Idx);
  s6IdxRef.current = s6Idx;
  var usedHotspotsRef = useRef(usedHotspots);
  usedHotspotsRef.current = usedHotspots;
  var svgRef = useRef(null);
  var wrapperRef = useRef(null);

  function clearTimers() {
    timerRef.current.forEach(function (t) { clearTimeout(t); });
    timerRef.current = [];
  }
  function addTimer(fn, ms) {
    timerRef.current.push(setTimeout(fn, ms));
  }
  function playSnd(s) { if (typeof playSound === "function") playSound(s); }
  function setAnimationBusy(busy) {
    if (onSetAnimationBusy) onSetAnimationBusy(busy);
  }

  /* ── Derived ── */
  var showPurpleBox = step >= 2 && step < 8;
  var problemHidden = step === 4 || step === 6 || step === 7;
  var showAngleLabelsABCD = step >= 5;
  var showAngleCuesStep5 = step === 5 && step5VisibleCues.length > 0;
  var actionVisible = (actionContent > 0 && step === 7) || (step === 6 && !!feedbackText);

  function isSideLabelVisible(key) {
    if (ALWAYS_VISIBLE.has(key)) return true;
    if (foundRef.current.indexOf(key) !== -1) return true;
    if (step >= 5) return true;
    return false;
  }

  function isCueVisible(side) {
    if (step < 3) return false;
    if (step === 3) return step3VisibleCues.indexOf(side) !== -1;
    if (step >= 5) return false;
    if (foundRef.current.indexOf(side) !== -1) return false;
    return true;
  }

  function isCueClickable(side) {
    if (step !== 4) return false;
    if (s4Stage !== 1) return false;
    if (foundRef.current.indexOf(side) !== -1) return false;
    return true;
  }

  /* ════════════════════════════════════════════════════════════
     Step entry effects
     ════════════════════════════════════════════════════════════ */

  useEffect(function () {
    clearTimers();
    setAnimationBusy(false);

    if (isCompletedView) {
      applyCompletedStepState(step);
      return clearTimers;
    }

    if (step === 3) {
      setStep3HighlightSide(null); setStep3VisibleCues([]);
      if (onSetNextEnabled) onSetNextEnabled(false);
      onUpdateTexts(undefined, "");
      setAnimationBusy(true);
      addTimer(function () {
        var sides = ["AD", "DC", "PQ", "QR"];
        sides.forEach(function (side, i) {
          addTimer(function () {
            setStep3HighlightSide(side);
            setStep3VisibleCues(function (prev) {
              return prev.indexOf(side) === -1 ? prev.concat([side]) : prev;
            });
          }, i * 1000);
        });
        addTimer(function () {
          setStep3HighlightSide(null);
          setAnimationBusy(false);
          onSetNextEnabled(true);
          onUpdateTexts(undefined, APP_DATA.steps[3].navText);
        }, sides.length * 1000 + 350);
      }, 600);
    }

    if (step === 4) {
      setS4Stage(1); setActiveCue(null); setCorrectLine(null);
      setWrongLine(null); setBlinking(false); setLastFoundMsg(null);
    }

    if (step === 5) {
      setHighlightAngle(null);
      setShowCorrespCues(false);
      setStep5KnownAngles([]);
      setStep5VisibleCues([]);
      if (step5Phase === 1) {
        if (onSetNextEnabled) onSetNextEnabled(true);
        onUpdateTexts(undefined, APP_DATA.steps[5].identifySecondPartNav);
        setAnimationBusy(false);
      } else {
        if (onSetNextEnabled) onSetNextEnabled(false);
        onUpdateTexts(undefined, "");
        setAnimationBusy(true);
        addTimer(function () { runStep5Intro(); }, 600);
      }
    }

    if (step === 6) {
      setS6Idx(0); setS6Phase("select");
      setUsedHotspots([]); setHighlightAngle("Q"); setWrongHotspot(null); setFeedbackText("");
    }

    if (step === 7) {
      setActionContent(1);
      setAngleCuesClickable(false);
      addTimer(function () {
        if (onShowNudge) onShowNudge(".action-btn");
      }, 300);
    }

    if (step === 8) {
      setActionContent(0);
      setCalcAngle(null); setCalcPhase(0);
      setCalcSubtrahendVisible(false);
      setYellowAngles([]);
    }

    return clearTimers;
  }, [step, isCompletedView, step5Phase]);

  function applyCompletedStepState(completedStep) {
    setStep3HighlightSide(null);
    setStep3VisibleCues(completedStep >= 3 ? ["AD", "DC", "PQ", "QR"] : []);
    setFoundSides(completedStep >= 4 ? Object.keys(UNKNOWNS) : []);
    setS4Stage(0); setActiveCue(null); setWrongLine(null); setCorrectLine(null);
    setBlinking(false); setLastFoundMsg(null);
    setStep5KnownAngles(completedStep >= 5 ? ["A", "B"] : []);
    setStep5VisibleCues(completedStep >= 5 ? ["P", "Q", "R", "S"] : []);
    setS6Idx(0); setS6Phase(completedStep >= 6 ? "done" : null);
    setUsedHotspots(completedStep >= 6 ? ["B", "A", "C"] : []);
    setWrongHotspot(null); setFeedbackText("");
    setHighlightAngle(null);
    setFlyData(null); setHtmlFlyData(null);
    setShowCorrespCues(completedStep >= 6 && completedStep < 7);
    setRemainingAngleCues(completedStep >= 7 ? [] : ["C", "D", "R", "S"]);
    setAngleCuesClickable(false);
    setActionContent(completedStep >= 7 ? 2 : 0);
    setCalcAngle(null); setCalcPhase(0); setCalcSubtrahendVisible(false); setYellowAngles([]);

    if (completedStep >= 7) {
      setFoundAngles({ P: 60, Q: 40, C: 140, D: 120, R: 140, S: 120 });
      onUpdateTexts(APP_DATA.steps[7].propertyTitle, APP_DATA.steps[7].allFoundNav);
    } else if (completedStep >= 6) {
      setFoundAngles({ P: 60, Q: 40 });
      onUpdateTexts(APP_DATA.steps[6].correspondDone, APP_DATA.steps[6].correspondDoneNav);
    } else {
      setFoundAngles({});
      if (completedStep === 5) onUpdateTexts(undefined, APP_DATA.steps[5].navText);
      else if (completedStep === 4) onUpdateTexts(
        APP_DATA.steps[4].sideFound.replace("{side}", "QR").replace("{length}", UNKNOWNS.QR.length),
        APP_DATA.steps[4].allFoundNav
      );
      else if (completedStep === 3) onUpdateTexts(undefined, APP_DATA.steps[3].navText);
      else onUpdateTexts(undefined, APP_DATA.steps[completedStep] ? APP_DATA.steps[completedStep].navText : "");
    }
    if (onSetNextEnabled) onSetNextEnabled(true);
  }

  function svgPointToWrapperPoint(point) {
    var svg = svgRef.current;
    var wrapper = wrapperRef.current;
    if (!svg || !wrapper) return point;
    var svgRect = svg.getBoundingClientRect();
    var wrapRect = wrapper.getBoundingClientRect();
    var vb = svg.viewBox.baseVal;
    var scale = Math.min(svgRect.width / vb.width, svgRect.height / vb.height);
    var renderedW = vb.width * scale;
    var renderedH = vb.height * scale;
    var offsetX = (svgRect.width - renderedW) / 2;
    var offsetY = (svgRect.height - renderedH) / 2;
    return {
      x: svgRect.left - wrapRect.left + offsetX + (point.x - vb.x) * scale,
      y: svgRect.top - wrapRect.top + offsetY + (point.y - vb.y) * scale,
    };
  }

  function getProblemTokenPoint(token) {
    var el = document.querySelector('[data-problem-token="' + token + '"]');
    var wrapper = wrapperRef.current;
    if (!el || !wrapper) return { x: 0, y: 0 };
    var rect = el.getBoundingClientRect();
    var wrapRect = wrapper.getBoundingClientRect();
    return {
      x: rect.left - wrapRect.left + rect.width / 2,
      y: rect.top - wrapRect.top + rect.height / 2,
    };
  }

  function startHtmlFly(text, fromPoint, toPoint, onDone, opts) {
    opts = opts || {};
    var id = "html-fly-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
    setHtmlFlyData({
      id: id,
      text: text,
      x: fromPoint.x,
      y: fromPoint.y,
      className: opts.className || "",
    });
    addTimer(function () {
      var el = document.getElementById(id);
      if (el && typeof gsap !== "undefined") {
        gsap.to(el, {
          left: toPoint.x,
          top: toPoint.y,
          duration: opts.duration || 0.7,
          ease: "power2.inOut",
          onComplete: function () {
            if (onDone) onDone();
            setHtmlFlyData(null);
          },
        });
      } else {
        if (onDone) onDone();
        setHtmlFlyData(null);
      }
    }, 80);
  }

  function runStep5Intro() {
    var known = [
      { token: "60", angle: "A", text: "60\u00B0" },
      { token: "40", angle: "B", text: "40\u00B0" },
    ];
    function flyKnown(i) {
      if (i >= known.length) {
        flyStep5Cues();
        return;
      }
      var item = known[i];
      startHtmlFly(
        item.text,
        getProblemTokenPoint(item.token),
        svgPointToWrapperPoint(_angleLabelPos(item.angle)),
        function () {
          setStep5KnownAngles(function (prev) { return prev.concat([item.angle]); });
          addTimer(function () { flyKnown(i + 1); }, 250);
        },
        { className: "html-fly-label--angle" }
      );
    }
    flyKnown(0);
  }

  function flyStep5Cues() {
    var source = getProblemTokenPoint("other-angles");
    var cues = ["P", "Q", "R", "S"];
    function flyCue(i) {
      if (i >= cues.length) {
        setAnimationBusy(false);
        onSetNextEnabled(true);
        onUpdateTexts(undefined, APP_DATA.steps[5].navText);
        return;
      }
      var from = { x: source.x + (i - 1.5) * 38, y: source.y };
      startHtmlFly("?", from, svgPointToWrapperPoint(_angleLabelPos(cues[i])), function () {
        setStep5VisibleCues(function (prev) {
          return prev.indexOf(cues[i]) === -1 ? prev.concat([cues[i]]) : prev;
        });
        addTimer(function () { flyCue(i + 1); }, 120);
      }, { className: "html-fly-label--cue", duration: 0.55 });
    }
    flyCue(0);
  }

  /* ════════════════════════════════════════════════════════════
     Step 4 handlers (side finding)
     ════════════════════════════════════════════════════════════ */

  function handleCueClick(side) {
    if (!isCueClickable(side)) return;
    playSnd("click");
    if (onHideNudge) onHideNudge();
    setActiveCue(side); setS4Stage(2);
    setWrongLine(null); setCorrectLine(null);

    var info = UNKNOWNS[side];
    onUpdateTexts(
      APP_DATA.steps[4].tapCorresponding.replace("{polygon}", info.corrPolyKey).replace("{side}", side),
      APP_DATA.steps[4].tapCorrectSide.replace("{polygon}", info.corrPolyKey)
    );
  }

  function handleSideLineClick(sideName) {
    if (s4Stage !== 2 || !activeCue) return;
    if (wrongLine) return;
    var info = UNKNOWNS[activeCue];
    if (sideName !== info.corrSide) {
      playSnd("wrong"); setWrongLine(sideName);
      addTimer(function () { setWrongLine(null); }, 500);
      return;
    }
    playSnd("correct"); setCorrectLine(sideName);
    enterStage3();
  }

  function enterStage3() {
    setAnimationBusy(true);
    setS4Stage(3);
    var cue = activeCue;
    var info = UNKNOWNS[cue];
    var foundMsg = APP_DATA.steps[4].sideFound.replace("{side}", cue).replace("{length}", info.length);
    setLastFoundMsg(foundMsg);
    onUpdateTexts(foundMsg, "");

    addTimer(function () {
      setBlinking(true);
      addTimer(function () {
        setBlinking(false);
        var knownSide = info.corrSide;
        var labelText = SIDE_LABELS[knownSide].text;

        startSideFly(knownSide, cue, labelText, function () {
          var newFound = foundRef.current.concat([cue]);
          setFoundSides(newFound);
          setCorrectLine(null); setActiveCue(null);

          if (newFound.length >= 4) {
            setS4Stage(0);
            setAnimationBusy(false);
            onSetNextEnabled(true);
            onUpdateTexts(foundMsg, APP_DATA.steps[4].allFoundNav);
          } else {
            setS4Stage(1);
            setAnimationBusy(false);
            onUpdateTexts(foundMsg, APP_DATA.steps[4].navText);
          }
        }, { fontSize: FONT_SIDE });
      }, 1600);
    }, 500);
  }

  /* ════════════════════════════════════════════════════════════
     Step 6 handlers (angle correspondence)
     ════════════════════════════════════════════════════════════ */

  function handleHotspotClick(vk) {
    if (step !== 6 || s6Phase !== "select") return;
    if (wrongHotspot) return;

    var seq = S6_SEQ[s6IdxRef.current];
    if (vk !== seq.correct) {
      playSnd("wrong"); setWrongHotspot(vk);
      setFeedbackText(APP_DATA.steps[6].wrongFeedback.replace("{angle}", seq.target));
      addTimer(function () { setWrongHotspot(null); }, 500);
      return;
    }

    playSnd("correct");
    setFeedbackText("");
    var idx = s6IdxRef.current;
    var newUsed = usedHotspotsRef.current.concat([vk]);
    setUsedHotspots(newUsed);

    if (idx < 2) {
      setAnimationBusy(true);
      setS6Phase("fly");
      var val = ANGLE_VALUES[seq.correct];
      var fromPos = _angleLabelPos(seq.correct);
      var toPos = _angleLabelPos(seq.target);
      startFly(val + "\u00B0", fromPos, toPos, function () {
        var fa = Object.assign({}, foundAnglesRef.current);
        fa[seq.target] = val;
        setFoundAngles(fa);
        setHighlightAngle(null);

        addTimer(function () {
          var next = s6IdxRef.current + 1;
          setS6Idx(next);
          var nextSeq = S6_SEQ[next];
          setS6Phase("select");
          setHighlightAngle(nextSeq.target);
          setAnimationBusy(false);
          onUpdateTexts(
            APP_DATA.steps[6].identifyAngle.replace("{angle}", nextSeq.target),
            APP_DATA.steps[6].tapCorresponding
          );
        }, 500);
      });
    } else {
      setS6Phase("done");
      setHighlightAngle(null);
      setShowCorrespCues(true);
      setAnimationBusy(false);
      onUpdateTexts(
        APP_DATA.steps[6].correspondDone,
        APP_DATA.steps[6].correspondDoneNav
      );
      onSetNextEnabled(true);
    }
  }

  function startFly(text, fromPos, toPos, onDone, opts) {
    opts = opts || {};
    var id = "fly-text-" + Date.now();
    setFlyData({
      mode: "angle",
      id: id, text: text, x: fromPos.x, y: fromPos.y,
      fill: opts.fill || "white",
      fontSize: opts.fontSize || 22,
    });
    addTimer(function () {
      var el = document.getElementById(id);
      if (el && typeof gsap !== "undefined") {
        gsap.to(el, {
          attr: { x: toPos.x, y: toPos.y },
          duration: 0.7,
          ease: "power2.inOut",
          onComplete: function () {
            if (onDone) onDone();
            setFlyData(null);
          },
        });
      } else {
        if (onDone) onDone();
        setFlyData(null);
      }
    }, 80);
  }

  function startSideFly(fromKey, toKey, text, onDone, opts) {
    opts = opts || {};
    var from = _sideLabelFlyCfg(fromKey);
    var to = _sideLabelFlyCfg(toKey);
    var id = "fly-text-" + Date.now();

    setFlyData({
      mode: "side",
      id: id,
      text: text,
      fill: opts.fill || "white",
      fontSize: opts.fontSize || FONT_SIDE,
      useTransform: from.hasTransform,
      tx: from.tx,
      ty: from.ty,
      rotate: from.rotate,
      tspanX: from.tspanX,
      tspanY: from.tspanY,
    });

    addTimer(function () {
      var el = document.getElementById(id);
      if (!el || typeof gsap === "undefined") {
        if (onDone) onDone();
        setFlyData(null);
        return;
      }

      if (from.hasTransform) {
        var state = { tx: from.tx, ty: from.ty };
        gsap.to(state, {
          tx: to.tx,
          ty: to.ty,
          duration: 0.7,
          ease: "power2.inOut",
          onUpdate: function () {
            el.setAttribute(
              "transform",
              "translate(" + state.tx + " " + state.ty + ") rotate(" + to.rotate + ")"
            );
          },
          onComplete: function () {
            if (onDone) onDone();
            setFlyData(null);
          },
        });
      } else {
        var tspan = el.querySelector("tspan");
        gsap.to(tspan, {
          attr: { x: to.tx, y: to.ty },
          duration: 0.7,
          ease: "power2.inOut",
          onComplete: function () {
            if (onDone) onDone();
            setFlyData(null);
          },
        });
      }
    }, 80);
  }

  /* ════════════════════════════════════════════════════════════
     Step 7 handlers (trapezoid property + angle calc)
     ════════════════════════════════════════════════════════════ */

  function handlePropertyBtnClick() {
    if (onHideNudge) onHideNudge();
    playSnd("click");
    setActionContent(2);
    setAngleCuesClickable(true);
    onUpdateTexts(
      APP_DATA.steps[7].propertyTitle,
      APP_DATA.steps[7].tapCue
    );
  }

  function handleAngleCueClick(angle) {
    if (!angleCuesClickable) return;
    if (remainingRef.current.indexOf(angle) === -1) return;
    playSnd("click");
    if (onHideNudge) onHideNudge();

    setAngleCuesClickable(false);
    setAnimationBusy(true);
    var info = COMP_PAIRS[angle];
    setCalcAngle(angle);
    setCalcSubtrahendVisible(false);
    setYellowAngles([angle]);

    var newRemaining = remainingRef.current.filter(function (a) { return a !== angle; });
    setRemainingAngleCues(newRemaining);

    addTimer(function () { setCalcPhase(1); }, 0);
    addTimer(function () { setCalcPhase(2); }, 1500);
    addTimer(function () {
      startFly(
        info.compVal + "\u00B0",
        _angleLabelPos(info.comp),
        _calcSubtrahendDestPos(angle),
        function () { setCalcSubtrahendVisible(true); },
        { fill: YELLOW_FILL, fontSize: 20 }
      );
    }, 1600);
    addTimer(function () { setCalcPhase(3); }, 2500);

    addTimer(function () {
      setCalcPhase(4);
      var pos = _angleLabelPos(angle);
      var mirrorPos = _angleLabelPos(info.mirror);

      var fa = Object.assign({}, foundAnglesRef.current);
      fa[angle] = info.result;
      setFoundAngles(fa);

      startFly(info.result + "\u00B0", pos, mirrorPos, function () {
        var fa2 = Object.assign({}, foundAnglesRef.current);
        fa2[info.mirror] = info.result;
        setFoundAngles(fa2);

        var mirrorRemaining = remainingRef.current.filter(function (a) { return a !== info.mirror; });
        setRemainingAngleCues(mirrorRemaining);

        setCalcAngle(null); setCalcPhase(0); setCalcSubtrahendVisible(false);
        setYellowAngles([angle, info.mirror]);

        addTimer(function () { setYellowAngles([]); }, 500);

        if (mirrorRemaining.length === 0) {
          setAnimationBusy(false);
          onSetNextEnabled(true);
          onUpdateTexts(null, APP_DATA.steps[7].allFoundNav);
        } else {
          setAnimationBusy(false);
          setAngleCuesClickable(true);
        }
      }, { fill: YELLOW_FILL });
    }, 3500);
  }

  /* ════════════════════════════════════════════════════════════
     Render helpers
     ════════════════════════════════════════════════════════════ */

  function getProblemPartClass(partIdx) {
    if (step === 1) return "problem-line";
    if (step === 2) return partIdx === 0 ? "problem-line problem-highlight" : "problem-line problem-dim";
    if (step === 3) return partIdx === 1 ? "problem-line problem-highlight" : "problem-line problem-dim";
    if (step === 5 && step5Phase === 1) return partIdx === 2 ? "problem-line" : "problem-line problem-dim";
    if (step === 5) return partIdx === 2 ? "problem-line problem-highlight" : "problem-line problem-dim";
    if (step === 8) return partIdx === 0 ? "problem-line problem-dim" : "problem-line problem-highlight";
    return "problem-line";
  }

  function renderPart2A() {
    var tokens = current_language === "id"
      ? [
        { text: "a. Tentukan panjang sisi " },
        { text: "AD", token: "AD" },
        { text: ", " },
        { text: "DC", token: "DC" },
        { text: ", " },
        { text: "PQ", token: "PQ" },
        { text: ", dan " },
        { text: "QR", token: "QR" },
        { text: "." },
      ]
      : [
        { text: "a. Determine the lengths of sides " },
        { text: "AD", token: "AD" },
        { text: ", " },
        { text: "DC", token: "DC" },
        { text: ", " },
        { text: "PQ", token: "PQ" },
        { text: ", and " },
        { text: "QR", token: "QR" },
        { text: "." },
      ];
    return tokens.map(function (part, i) {
      if (!part.token) return part.text;
      var cls = step === 3 && step3HighlightSide === part.token ? "problem-token problem-token--yellow" : "problem-token";
      return h("span", { key: "p2a-" + i, className: cls, "data-problem-token": part.token }, part.text);
    });
  }

  function renderPart2B() {
    if (current_language === "id") {
      return [
        "b. Jika \u2220A = ",
        h("span", { key: "ang60", className: "problem-token", "data-problem-token": "60" }, "60\u00B0"),
        " dan \u2220B = ",
        h("span", { key: "ang40", className: "problem-token", "data-problem-token": "40" }, "40\u00B0"),
        ", berapa ",
        h("span", { key: "other", className: "problem-token", "data-problem-token": "other-angles" }, "ukuran sudut-sudut lainnya?"),
      ];
    }
    return [
      "b. If \u2220A = ",
      h("span", { key: "ang60", className: "problem-token", "data-problem-token": "60" }, "60\u00B0"),
      " and \u2220B = ",
      h("span", { key: "ang40", className: "problem-token", "data-problem-token": "40" }, "40\u00B0"),
      ", what are the ",
      h("span", { key: "other", className: "problem-token", "data-problem-token": "other-angles" }, "measures of other angles?"),
    ];
  }

  function renderProblemRow() {
    var cls = "problem-row" + (problemHidden ? " problem-row--hidden" : "");
    return h("div", { className: cls },
      h("p", { className: getProblemPartClass(0) }, APP_DATA.problem.part1),
      h("p", { className: getProblemPartClass(1) }, renderPart2A()),
      h("p", { className: getProblemPartClass(2) }, renderPart2B())
    );
  }

  function renderPolygonPath(poly, order) {
    return h("path", {
      d: _polyPath(poly, order),
      fill: "none", stroke: "white", strokeWidth: 2.5, strokeLinejoin: "round",
    });
  }

  function renderAngleSectors(poly, adj, vertexKeys) {
    var sectorDim = step >= 3 && step <= 4;
    return vertexKeys.map(function (vk) {
      var vertex = poly[vk];
      var a1 = poly[adj[vk][0]], a2 = poly[adj[vk][1]];
      var arc = _innerArc(vertex, a1, a2);
      var fill = ANGLE_FILLS[vk];
      if (highlightAngle === vk) fill = "rgba(255, 215, 0, 1)";

      return h("path", {
        key: "sector-" + vk,
        d: _sectorPath(vertex.x, vertex.y, ARC_RADIUS, arc.start, arc.end),
        fill: fill, stroke: "white", strokeWidth: 1.5,
        className: "angle-sector" + (sectorDim ? " angle-sector--dim" : ""),
      });
    });
  }

  function renderVertexLabels(vertexKeys) {
    return vertexKeys.map(function (vk) {
      var pos = VLABEL_POS[vk];
      return h("text", {
        key: "vlabel-" + vk, fill: "white",
        fontFamily: "Roboto, system-ui, sans-serif",
        fontSize: FONT_VERTEX, fontWeight: 700,
        className: "vertex-label-text",
      }, h("tspan", { x: pos.x, y: pos.y }, vk));
    });
  }

  function renderSideLabel(key) {
    var cfg = SIDE_LABELS[key];
    var visible = isSideLabelVisible(key);
    var dim = visible && step >= 5 && step <= 7;
    var cls = "side-label";
    if (!visible) cls += " side-label--hidden";
    else if (dim) cls += " side-label--dim";
    else cls += " side-label--visible";
    var props = {
      key: "slabel-" + key, fill: "white",
      fontFamily: "Roboto, system-ui, sans-serif",
      fontSize: FONT_SIDE, className: cls,
    };
    if (cfg.transform) props.transform = cfg.transform;
    return h("text", props, h("tspan", { x: cfg.tx, y: cfg.ty }, cfg.text));
  }

  function renderSideLabels(keys) { return keys.map(renderSideLabel); }

  /* ── Side cue boxes (step 3-4) ── */

  function getCuePos(side) {
    var info = UNKNOWNS[side];
    var poly = _getPoly(info.polyKey);
    var cent = info.polyKey === "ABCD" ? ABCD_C : PQRS_C;
    var m = _mid(poly[info.v1], poly[info.v2]);
    return _outward(m, cent, 32);
  }

  function renderSideCueBox(side) {
    if (!isCueVisible(side)) return null;
    var pos = getCuePos(side);
    var clickable = isCueClickable(side);
    var boxW = 36, boxH = 30;
    return h("foreignObject", {
      key: "cue-" + side, x: pos.x - boxW / 2, y: pos.y - boxH / 2,
      width: boxW, height: boxH, className: "cue-box-fo",
    },
      h("div", {
        className: "cue-box " + (clickable ? "cue-box--clickable" : "cue-box--non-clickable"),
        onClick: clickable ? function () { handleCueClick(side); } : undefined,
        style: { width: "100%", height: "100%" },
      }, "?")
    );
  }

  /* ── Side interactive lines (step 4) ── */

  function renderYellowLine() {
    if (!activeCue || s4Stage < 2) return null;
    var info = UNKNOWNS[activeCue];
    var poly = _getPoly(info.polyKey);
    var v1 = poly[info.v1], v2 = poly[info.v2];
    return h("line", {
      key: "yellow-line", x1: v1.x, y1: v1.y, x2: v2.x, y2: v2.y,
      stroke: s4Stage === 3 ? "#4CAF50" : "#ffd700", strokeWidth: SIDE_LINE_W + 1, strokeLinecap: "round",
      className: blinking ? "side-line-blink" : "",
    });
  }

  function renderOrangeLines() {
    if (s4Stage !== 2 || !activeCue) return null;
    var info = UNKNOWNS[activeCue];
    var sides = _getAllSides(info.corrPolyKey);
    var poly = _getPoly(info.corrPolyKey);
    return sides.map(function (side) {
      var v1 = poly[side.v1], v2 = poly[side.v2];
      var color = "#ff8c00";
      if (correctLine === side.name) color = "#4CAF50";
      if (wrongLine === side.name) color = "#ff4444";
      return h("g", { key: "oline-" + side.name },
        h("line", {
          x1: v1.x, y1: v1.y, x2: v2.x, y2: v2.y,
          stroke: color, strokeWidth: SIDE_LINE_W, strokeLinecap: "round",
          className: "clickable-side-line",
        }),
        h("line", {
          x1: v1.x, y1: v1.y, x2: v2.x, y2: v2.y,
          stroke: "transparent", strokeWidth: HIT_LINE_W, strokeLinecap: "round",
          className: "side-hit-area",
          onClick: function () { handleSideLineClick(side.name); },
        })
      );
    });
  }

  function renderCorrectLineBlink() {
    if (s4Stage !== 3 || !correctLine || !activeCue) return null;
    var info = UNKNOWNS[activeCue];
    var poly = _getPoly(info.corrPolyKey);
    var side = null;
    _getAllSides(info.corrPolyKey).forEach(function (s) { if (s.name === correctLine) side = s; });
    if (!side) return null;
    var v1 = poly[side.v1], v2 = poly[side.v2];
    return h("line", {
      key: "correct-blink", x1: v1.x, y1: v1.y, x2: v2.x, y2: v2.y,
      stroke: "#4CAF50", strokeWidth: SIDE_LINE_W + 1, strokeLinecap: "round",
      className: blinking ? "side-line-blink" : "",
    });
  }

  /* ── Angle labels (ABCD: A=60°, B=40° shown from step 5) ── */

  function renderAngleLabelsABCD() {
    if (!showAngleLabelsABCD) return null;
    var labels = [];

    ABCD_ORDER.forEach(function (vk) {
      var val = null;
      if (vk === "A") val = 60;
      else if (vk === "B") val = 40;
      else val = foundAnglesRef.current[vk];
      if (step === 5 && step5KnownAngles.indexOf(vk) === -1) return;
      if (val == null) return;

      var pos = _angleLabelPos(vk);
      var isYellow = yellowAngles.indexOf(vk) !== -1;
      labels.push(h("text", {
        key: "alabel-" + vk, x: pos.x, y: pos.y,
        fill: isYellow ? YELLOW_FILL : "white", fontSize: 22, fontWeight: 600,
        textAnchor: "middle", dominantBaseline: "middle",
        className: "angle-label-text",
      }, val + "\u00B0"));
    });
    return labels;
  }

  function renderAngleLabelsPQRS() {
    if (step < 6) return null;
    var labels = [];
    PQRS_ORDER.forEach(function (vk) {
      var val = foundAnglesRef.current[vk];
      if (val == null) return;
      if (calcAngle && COMP_PAIRS[calcAngle] && COMP_PAIRS[calcAngle].mirror === vk && calcPhase < 5) return;

      var pos = _angleLabelPos(vk);
      var isYellow = yellowAngles.indexOf(vk) !== -1;
      labels.push(h("text", {
        key: "alabel-" + vk, x: pos.x, y: pos.y,
        fill: isYellow ? YELLOW_FILL : "white", fontSize: 22, fontWeight: 600,
        textAnchor: "middle", dominantBaseline: "middle",
        className: "angle-label-text",
      }, val + "\u00B0"));
    });
    return labels;
  }

  /* ── Step 5: simple angle cue boxes in PQRS ── */

  function renderAngleCuesStep5() {
    if (!showAngleCuesStep5) return null;
    var boxW = 34, boxH = 28;
    return PQRS_ORDER.map(function (vk) {
      if (step5VisibleCues.indexOf(vk) === -1) return null;
      var pos = _angleLabelPos(vk);
      return h("foreignObject", {
        key: "acue5-" + vk, x: pos.x - boxW / 2, y: pos.y - boxH / 2,
        width: boxW, height: boxH, className: "cue-box-fo",
      },
        h("div", {
          className: "angle-cue-simple",
          style: { width: "100%", height: "100%" },
        }, "?")
      );
    });
  }

  /* ── Steps 6-7: colored angle cue boxes for C,D,R,S ── */

  function renderCorrespCues() {
    if (!showCorrespCues) return null;
    var boxW = 34, boxH = 28;
    return remainingAngleCues.map(function (vk) {
      if (foundAnglesRef.current[vk] != null) return null;
      var pos = _angleLabelPos(vk);
      var colorCls = "angle-cue-colored--" + ANGLE_CUE_COLORS[vk];
      var clickCls = angleCuesClickable ? "angle-cue-colored--clickable" : "angle-cue-colored--non-clickable";
      return h("foreignObject", {
        key: "acue7-" + vk, x: pos.x - boxW / 2, y: pos.y - boxH / 2,
        width: boxW, height: boxH, className: "cue-box-fo",
      },
        h("div", {
          className: "angle-cue-colored " + colorCls + " " + clickCls,
          style: { width: "100%", height: "100%" },
          onClick: angleCuesClickable ? function () { handleAngleCueClick(vk); } : undefined,
        }, "?")
      );
    });
  }

  /* ── Step 6: hotspots in ABCD ── */

  function renderHotspots(visibleOnly) {
    if (step !== 6 || s6Phase !== "select") return null;
    var available = ABCD_ORDER.filter(function (v) {
      return usedHotspotsRef.current.indexOf(v) === -1;
    });
    return available.map(function (vk) {
      var pos = POLY_ABCD[vk];
      var isWrong = wrongHotspot === vk;
      var wCls = isWrong ? " hotspot-g--wrong" : "";
      var ringFills = isWrong
        ? ["rgba(255,50,50,0.18)", "rgba(255,50,50,0.28)", "rgba(255,50,50,0.45)"]
        : ["rgba(255,255,255,0.12)", "rgba(255,255,255,0.22)", "rgba(255,255,255,0.36)"];
      if (!visibleOnly) {
        return h("circle", {
          key: "hotspot-hit-" + vk,
          cx: pos.x, cy: pos.y, r: 28,
          fill: "transparent", stroke: "none",
          className: "hotspot-hit",
          onClick: function () { handleHotspotClick(vk); },
        });
      }
      return h("g", { key: "hotspot-" + vk, className: "hotspot-g" + wCls },
        h("circle", {
          cx: pos.x, cy: pos.y, r: 28,
          fill: ringFills[0], stroke: "none",
          className: "hotspot-ring hotspot-ring--3",
        }),
        h("circle", {
          cx: pos.x, cy: pos.y, r: 20,
          fill: ringFills[1], stroke: "none",
          className: "hotspot-ring hotspot-ring--2",
        }),
        h("circle", {
          cx: pos.x, cy: pos.y, r: 12,
          fill: ringFills[2], stroke: "none",
          className: "hotspot-ring hotspot-ring--1",
        })
      );
    });
  }

  /* ── Step 7: yellow construction lines ── */

  function renderCalcLines() {
    if (!calcAngle || calcPhase < 1) return null;
    var lines = _getCalcLines(calcAngle);
    return lines.map(function (seg, i) {
      return h("line", {
        key: "cline-" + i,
        x1: seg[0].x, y1: seg[0].y, x2: seg[1].x, y2: seg[1].y,
        stroke: "#ffd700", strokeWidth: 3.5, strokeLinecap: "round",
        pathLength: "1",
        className: "calc-line calc-line--grow",
      });
    });
  }

  /* ── Step 7: calc text ("180° - 60°" → "120°") ── */

  function renderCalcText() {
    if (!calcAngle || calcPhase < 2 || calcPhase >= 4) return null;
    var info = COMP_PAIRS[calcAngle];
    var equationPos = _calcEquationPos(calcAngle);
    var resultPos = _angleLabelPos(calcAngle);

    if (calcPhase === 2) {
      var subPos = _calcSubtrahendDestPos(calcAngle);
      return h("g", { key: "calc-sub" },
        h("text", {
          x: equationPos.x, y: equationPos.y,
          fill: YELLOW_FILL, fontSize: 20, fontWeight: 600,
          textAnchor: "middle", dominantBaseline: "middle",
          className: "calc-text calc-text--appear",
        }, "180\u00B0 -"),
        calcSubtrahendVisible ? h("text", {
          x: subPos.x, y: subPos.y,
          fill: YELLOW_FILL, fontSize: 20, fontWeight: 600,
          textAnchor: "middle", dominantBaseline: "middle",
          className: "calc-text",
        }, info.compVal + "\u00B0") : null
      );
    }
    if (calcPhase === 3) {
      return h("text", {
        key: "calc-res", x: resultPos.x, y: resultPos.y,
        fill: YELLOW_FILL, fontSize: 22, fontWeight: 600,
        textAnchor: "middle", dominantBaseline: "middle",
        className: "calc-text calc-text--appear",
      }, info.result + "\u00B0");
    }
    return null;
  }

  /* ── Fly label ── */

  function renderFlyLabel() {
    if (!flyData) return null;

    if (flyData.mode === "side") {
      var sideProps = {
        id: flyData.id, key: "fly-label",
        fill: flyData.fill || "white",
        fontSize: flyData.fontSize || FONT_SIDE,
        fontFamily: "Roboto, system-ui, sans-serif",
        className: "fly-label-text",
      };
      if (flyData.useTransform) {
        sideProps.transform = "translate(" + flyData.tx + " " + flyData.ty + ") rotate(" + flyData.rotate + ")";
      }
      return h("text", sideProps,
        h("tspan", { x: flyData.tspanX, y: flyData.tspanY }, flyData.text)
      );
    }

    return h("text", {
      id: flyData.id, key: "fly-label",
      x: flyData.x, y: flyData.y,
      fill: flyData.fill || "white",
      fontSize: flyData.fontSize || 22,
      fontWeight: 600,
      textAnchor: "middle", dominantBaseline: "middle",
      className: "fly-label-text",
    }, flyData.text);
  }

  function renderHtmlFlyLabel() {
    if (!htmlFlyData) return null;
    return h("div", {
      id: htmlFlyData.id,
      className: "html-fly-label " + htmlFlyData.className,
      style: { left: htmlFlyData.x, top: htmlFlyData.y },
    }, htmlFlyData.text);
  }

  /* ── Action row ── */

  function renderActionRow() {
    var cls = "action-row-wrap" + (actionVisible ? " action-row-wrap--visible" : "");
    var content = null;

    if (actionContent === 1) {
      content = h("button", {
        className: "action-btn",
        onClick: handlePropertyBtnClick,
      }, APP_DATA.steps[7].propertyBtn);
    } else if (actionContent === 2) {
      content = h("div", { className: "action-text" }, APP_DATA.steps[7].propertyText);
    } else if (step === 6 && feedbackText) {
      content = h("div", { className: "action-text action-text--feedback" }, feedbackText);
    }

    return h("div", { className: cls }, content);
  }

  /* ════════════════════════════════════════════════════════════
     Main render
     ════════════════════════════════════════════════════════════ */

  var unknownKeys = Object.keys(UNKNOWNS);

  return h("div", { className: "main-canvas-wrapper", ref: wrapperRef },

    renderProblemRow(),

    h("div", { className: "visual-row" },
      h("svg", {
        className: "trapezoid-svg",
        ref: svgRef,
        viewBox: SVG_VIEWBOX,
        preserveAspectRatio: "xMidYMid meet",
      },

        /* Step 6 hotspot fills under geometry */
        renderHotspots(true),

        /* ABCD polygon */
        h("g", { key: "g-abcd" },
          renderPolygonPath(POLY_ABCD, ABCD_ORDER),
          renderAngleSectors(POLY_ABCD, ABCD_ADJ, ABCD_ORDER),
          renderSideLabels(["AB", "BC", "AD", "DC"]),
          renderVertexLabels(ABCD_ORDER),
          renderAngleLabelsABCD()
        ),

        /* PQRS polygon */
        h("g", { key: "g-pqrs" },
          renderPolygonPath(POLY_PQRS, PQRS_ORDER),
          renderAngleSectors(POLY_PQRS, PQRS_ADJ, PQRS_ORDER),
          renderSideLabels(["RS", "SP", "PQ", "QR"]),
          renderVertexLabels(PQRS_ORDER),
          renderAngleLabelsPQRS()
        ),

        /* Side cue boxes */
        unknownKeys.map(renderSideCueBox),

        /* Side interactive lines */
        renderYellowLine(),
        renderOrangeLines(),
        renderCorrectLineBlink(),

        /* Step 5 angle cues */
        renderAngleCuesStep5(),

        /* Steps 6-7 colored angle cues */
        renderCorrespCues(),

        /* Step 7 calc lines + text */
        renderCalcLines(),
        renderCalcText(),

        /* Fly label */
        renderFlyLabel(),

        /* Step 6 hotspot hit targets */
        renderHotspots(false)
      ),

      /* Purple box */
      h("div", {
        className: "purple-box" + (showPurpleBox ? " purple-box--visible" : ""),
      }, APP_DATA.purpleBox)
    ),

    /* Action row */
    renderActionRow(),
    renderHtmlFlyLabel()
  );
};
