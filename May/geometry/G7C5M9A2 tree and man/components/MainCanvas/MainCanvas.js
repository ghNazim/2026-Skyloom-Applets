/* ── Tree & Man – Similar Triangles – Main Canvas ── */

const VIEWBOX = "0 0 1000 430";
const SVG_W = 1000;
const SVG_H = 430;

const UNIT = (SVG_H * 0.7) / 15;
const DIAG_W = 24 * UNIT;
const DIAG_H = 15 * UNIT;
const GROUND_EXTEND = 28;
const AD_ARROW_GAP = 20;
const AD_LABEL_GAP = 14;
const BOTTOM_LABEL_OFFSET = 36;

const COLOR_BLUE = "#5ec4e0";
const COLOR_BLUE_FILL = "#2a8fc4";
const COLOR_YELLOW = "#c8d44a";
const COLOR_YELLOW_FILL = "#b8c83e";
const COLOR_WHITE = "#ffffff";
const STROKE_WIDTH = 3;
const LABEL_FONT_SIZE = 22;
const POINT_LABEL_SIZE = 24;
const CALC_FONT_SIZE = 26;
const TREE_IMG = "assets/tree.png";
const MAN_IMG = "assets/man.png";

const CART = {
  D: { x: 0, y: 0 },
  E: { x: 0, y: 15 },
  A: { x: 24, y: 0 },
  B: { x: 16, y: 0 },
  C: { x: 16, y: 5 },
};

const CALC_PAD = 5;
const CALC_PANEL = {
  boxX: SVG_W - CALC_PAD - 345,
  boxY: CALC_PAD,
  boxW: 345,
  boxH: SVG_H - CALC_PAD * 2,
  titleY: 26,
  line1Y: 80,
  line2Y: 122,
  buttonY: 175,
  buttonW: 165,
  buttonH: 44,
  conclusionY: 170,
  textPadX: 14,
};

const DIAGRAM_SHIFT_LEFT = -155;
const YELLOW_FLOAT_OFFSET = -160;
const ARROW_HEAD_LEN = 7;
const ARROW_HEAD_HALF = 3.5;
const ARROW_TIP_OVERLAP = 1.5;

function playSnd(name) {
  if (typeof playSound === "function") playSound(name);
}

function getDiagramLayout() {
  const offsetX = (SVG_W - DIAG_W) / 2;
  const groundY = SVG_H - 68;
  return { offsetX, groundY };
}

function getBlueTriangleCentroid(D, E, A) {
  return {
    x: (D.x + E.x + A.x) / 3,
    y: (D.y + E.y + A.y) / 3,
  };
}

function toSvg(cartX, cartY, layout) {
  return {
    x: layout.offsetX + cartX * UNIT,
    y: layout.groundY - cartY * UNIT,
  };
}

function getWorldPoints(layout) {
  const pts = {};
  Object.keys(CART).forEach((k) => {
    pts[k] = toSvg(CART[k].x, CART[k].y, layout);
  });
  return pts;
}

function ptMid(p1, p2) {
  return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
}

function angleDegAtVertex(vertex, p1, p2) {
  const a1 = Math.atan2(p1.y - vertex.y, p1.x - vertex.x);
  const a2 = Math.atan2(p2.y - vertex.y, p2.x - vertex.x);
  return { start: a1, end: a2 };
}

function describeSector(vertex, p1, p2, radius) {
  const { start, end } = angleDegAtVertex(vertex, p1, p2);
  let s = start;
  let e = end;
  let diff = e - s;
  while (diff <= -Math.PI) diff += 2 * Math.PI;
  while (diff > Math.PI) diff -= 2 * Math.PI;
  if (diff < 0) {
    const t = s;
    s = e;
    e = t;
    diff = -diff;
  }
  const large = diff > Math.PI ? 1 : 0;
  const pStart = {
    x: vertex.x + radius * Math.cos(s),
    y: vertex.y + radius * Math.sin(s),
  };
  const pEnd = {
    x: vertex.x + radius * Math.cos(e),
    y: vertex.y + radius * Math.sin(e),
  };
  return `M ${vertex.x} ${vertex.y} L ${pStart.x} ${pStart.y} A ${radius} ${radius} 0 ${large} 1 ${pEnd.x} ${pEnd.y} Z`;
}

function getFloatingLabelPos(A, B, C) {
  return {
    A: { x: A.x + 16, y: A.y + 30 },
    B: { x: B.x - 6, y: B.y + 28 },
    C: { x: C.x - 14, y: C.y - 18 },
  };
}

function centerCalcLineParts(relParts, y) {
  let maxX = 0;
  Object.keys(relParts).forEach((k) => {
    if (relParts[k].x > maxX) maxX = relParts[k].x;
  });
  maxX += 16;
  const offsetX = CALC_PANEL.boxX + (CALC_PANEL.boxW - maxX) / 2;
  const parts = {};
  Object.keys(relParts).forEach((k) => {
    parts[k] = { ...relParts[k], x: relParts[k].x + offsetX, y };
  });
  return parts;
}

function getCalcLine1Positions() {
  const y = CALC_PANEL.boxY + CALC_PANEL.line1Y;
  const gap = 18;
  let cx = 0;
  const rel = {};
  rel.angle1 = { x: cx, text: "\u2220", opacity: 0 };
  cx += 18;
  rel.C = { x: cx, text: "C", opacity: 0 };
  cx += gap;
  rel.A1 = { x: cx, text: "A", opacity: 0 };
  cx += gap;
  rel.B = { x: cx, text: "B", opacity: 0 };
  cx += gap + 8;
  rel.equals = { x: cx, text: "=", opacity: 0 };
  cx += gap + 8;
  rel.angle2 = { x: cx, text: "\u2220", opacity: 0 };
  cx += 18;
  rel.E = { x: cx, text: "E", opacity: 0 };
  cx += gap;
  rel.A2 = { x: cx, text: "A", opacity: 0 };
  cx += gap;
  rel.D = { x: cx, text: "D", opacity: 0 };
  return centerCalcLineParts(rel, y);
}

function getCalcLine2Positions() {
  const y = CALC_PANEL.boxY + CALC_PANEL.line2Y;
  const gap = 18;
  let cx = 0;
  const rel = {};
  rel.angle1 = { x: cx, text: "\u2220", opacity: 0 };
  cx += 18;
  rel.C = { x: cx, text: "C", opacity: 0 };
  cx += gap;
  rel.B = { x: cx, text: "B", opacity: 0 };
  cx += gap;
  rel.A1 = { x: cx, text: "A", opacity: 0 };
  cx += gap + 8;
  rel.equals = { x: cx, text: "=", opacity: 0 };
  cx += gap + 8;
  rel.angle2 = { x: cx, text: "\u2220", opacity: 0 };
  cx += 18;
  rel.E = { x: cx, text: "E", opacity: 0 };
  cx += gap;
  rel.D = { x: cx, text: "D", opacity: 0 };
  cx += gap;
  rel.A2 = { x: cx, text: "A", opacity: 0 };
  return centerCalcLineParts(rel, y);
}

/* ── Step 6 calculation panel layouts and render helpers ── */
const S6_LINE_GAP = 90;
const S6_FRAC_BAR_W = 40;
const S6_EQ_RHS_OFFSET = 40;

function s6RatioLayout() {
  const y = s6Y(0);
  const cx = s6CenterX();
  const lhs = cx - 58;
  const rhs = cx + S6_EQ_RHS_OFFSET;
  return { y, cx, lhs, rhs };
}

function makeS6RatioSymbolic() {
  const { y, cx, lhs, rhs } = s6RatioLayout();
  return {
    lnA: { x: lhs - 8, y: y - 14, text: "A", c: "yellow", o: 0 },
    lnB: { x: lhs + 8, y: y - 14, text: "B", c: "yellow", o: 0 },
    lBar: { x1: lhs - S6_FRAC_BAR_W / 2, x2: lhs + S6_FRAC_BAR_W / 2, y: y + 2, o: 0 },
    ldA: { x: lhs - 8, y: y + 18, text: "A", c: "blue", o: 0 },
    ldD: { x: lhs + 8, y: y + 18, text: "D", c: "blue", o: 0 },
    eq: { x: cx - 6, y, text: "=", c: "white", o: 0 },
    rnB: { x: rhs - 8, y: y - 14, text: "B", c: "yellow", o: 0 },
    rnC: { x: rhs + 8, y: y - 14, text: "C", c: "yellow", o: 0 },
    rBar: { x1: rhs - S6_FRAC_BAR_W / 2, x2: rhs + S6_FRAC_BAR_W / 2, y: y + 2, o: 0 },
    rdD: { x: rhs - 8, y: y + 18, text: "D", c: "blue", o: 0 },
    rdE: { x: rhs + 8, y: y + 18, text: "E", c: "blue", o: 0 },
  };
}

function makeS6RatioValueSlots() {
  const { y, lhs, rhs } = s6RatioLayout();
  return {
    ln8: { x: lhs, y: y - 14, text: "8", c: "white", o: 0 },
    ld24: { x: lhs, y: y + 18, text: "24", c: "white", o: 0 },
    rn5: { x: rhs, y: y - 14, text: "5", c: "white", o: 0 },
    rdh: { x: rhs, y: y + 18, text: "h", c: "white", o: 0, italic: true },
  };
}

function makeS6RatioValues() {
  const { y, cx, lhs, rhs } = s6RatioLayout();
  return {
    ln8: { x: lhs, y: y - 14, text: "8", c: "white", o: 0 },
    lBar: { x1: lhs - S6_FRAC_BAR_W / 2, x2: lhs + S6_FRAC_BAR_W / 2, y: y + 2, o: 0 },
    ld24: { x: lhs, y: y + 18, text: "24", c: "white", o: 0 },
    eq: { x: cx - 6, y, text: "=", c: "white", o: 0 },
    rn5: { x: rhs, y: y - 14, text: "5", c: "white", o: 0 },
    rBar: { x1: rhs - S6_FRAC_BAR_W / 2, x2: rhs + S6_FRAC_BAR_W / 2, y: y + 2, o: 0 },
    rdh: { x: rhs, y: y + 18, text: "h", c: "white", o: 0, italic: true },
  };
}

function s6Color(c) {
  if (c === "yellow") return COLOR_YELLOW;
  if (c === "blue") return COLOR_BLUE;
  return COLOR_WHITE;
}

function s6Y(line) {
  const base = CALC_PANEL.boxY + 86;
  return base + line * S6_LINE_GAP;
}

function s6CenterX() {
  return CALC_PANEL.boxX + CALC_PANEL.boxW / 2;
}

function makeS6Line2() {
  const y = s6Y(1);
  const cx = s6CenterX();
  const fx = cx - 18;
  return {
    h: { x: cx - 78, y, text: "h", c: "white", o: 0, italic: true },
    times: { x: cx - 54, y, text: "\u00D7", c: "white", o: 0 },
    n8: { x: fx, y: y - 14, text: "8", c: "white", o: 0 },
    bar: { x1: fx - 14, x2: fx + 14, y: y + 2, o: 0 },
    d24: { x: fx, y: y + 18, text: "24", c: "white", o: 0 },
    eq: { x: cx + 10, y, text: "=", c: "white", o: 0 },
    r5: { x: cx + 34, y, text: "5", c: "white", o: 0 },
  };
}

function makeS6Line3() {
  const y = s6Y(2);
  const cx = s6CenterX();
  const fx = cx + 28;
  return {
    h: { x: cx - 78, y, text: "h", c: "white", o: 0, italic: true },
    eq: { x: cx - 54, y, text: "=", c: "white", o: 0 },
    r5: { x: cx - 30, y, text: "5", c: "white", o: 0 },
    times: { x: cx - 8, y, text: "\u00D7", c: "white", o: 0 },
    n24: { x: fx, y: y - 14, text: "24", c: "white", o: 0 },
    bar: { x1: fx - 14, x2: fx + 14, y: y + 2, o: 0 },
    d8: { x: fx, y: y + 18, text: "8", c: "white", o: 0 },
    strike24: { x1: fx - 12, y1: y - 20, x2: fx + 12, y2: y - 8, o: 0 },
    strike8: { x1: fx - 10, y1: y + 14, x2: fx + 10, y2: y + 26, o: 0 },
    simp3: { x: fx + 30, y: y - 18, text: "3", c: "white", o: 0, fs: 22 },
    simp1: { x: fx + 30, y: y + 24, text: "1", c: "white", o: 0, fs: 22 },
  };
}

function makeS6Line4(multOnly) {
  const y = s6Y(3);
  const cx = s6CenterX();
  if (multOnly) {
    return {
      h: { x: cx - 54, y, text: "h", c: "white", o: 0, italic: true },
      eq: { x: cx - 30, y, text: "=", c: "white", o: 0 },
      r5: { x: cx - 8, y, text: "5", c: "white", o: 0 },
      times: { x: cx + 14, y, text: "\u00D7", c: "white", o: 0 },
      r3: { x: cx + 38, y, text: "3", c: "white", o: 0 },
    };
  }
  return {
    h: { x: cx - 54, y, text: "h", c: "white", o: 1, italic: true },
    eq: { x: cx - 30, y, text: "=", c: "white", o: 1 },
    val: { x: cx + 8, y, text: "15 ft", c: "white", o: 0 },
  };
}

function s6GetBoxBounds(y, padX, padY) {
  const cx = s6CenterX();
  return { x: cx - padX, y: y - padY, w: padX * 2, h: padY * 2 };
}

function s6RatioBoxBounds() {
  return s6GetBoxBounds(s6Y(0), 128, 34);
}

function s6Line2BoxBounds() {
  return s6GetBoxBounds(s6Y(1), 108, 38);
}

function s6Line4BoxBounds() {
  return s6GetBoxBounds(s6Y(3), 88, 22);
}

function renderS6TextPart(key, p) {
  if (!p || p.o === 0) return null;
  return React.createElement(
    "text",
    {
      key,
      x: p.x,
      y: p.y,
      fill: s6Color(p.c || "white"),
      fontSize: p.fs || 24,
      fontWeight: 700,
      fontStyle: p.italic ? "italic" : "normal",
      textAnchor: "middle",
      dominantBaseline: "middle",
    },
    p.text,
  );
}

function renderS6Bar(key, bar) {
  if (!bar || bar.o === 0) return null;
  return React.createElement("line", {
    key,
    x1: bar.x1,
    y1: bar.y,
    x2: bar.x2,
    y2: bar.y,
    stroke: COLOR_WHITE,
    strokeWidth: 2,
  });
}

function renderS6Strike(key, s) {
  if (!s || s.o === 0) return null;
  return React.createElement("line", {
    key,
    x1: s.x1,
    y1: s.y1,
    x2: s.x2,
    y2: s.y2,
    stroke: "#ff5555",
    strokeWidth: 2,
  });
}

function renderS6Ratio(ratio) {
  return React.createElement(
    "g",
    { className: "s6-ratio" },
    renderS6TextPart("lnA", ratio.lnA),
    renderS6TextPart("lnB", ratio.lnB),
    renderS6TextPart("ln8", ratio.ln8),
    renderS6Bar("lBar", ratio.lBar),
    renderS6TextPart("ldA", ratio.ldA),
    renderS6TextPart("ldD", ratio.ldD),
    renderS6TextPart("ld24", ratio.ld24),
    renderS6TextPart("eq", ratio.eq),
    renderS6TextPart("rnB", ratio.rnB),
    renderS6TextPart("rnC", ratio.rnC),
    renderS6TextPart("rn5", ratio.rn5),
    renderS6Bar("rBar", ratio.rBar),
    renderS6TextPart("rdD", ratio.rdD),
    renderS6TextPart("rdE", ratio.rdE),
    renderS6TextPart("rdh", ratio.rdh),
  );
}

function renderS6Line2Parts(line) {
  return React.createElement(
    "g",
    { className: "s6-line2" },
    renderS6TextPart("h", line.h),
    renderS6TextPart("times", line.times),
    renderS6TextPart("n8", line.n8),
    renderS6Bar("bar", line.bar),
    renderS6TextPart("d24", line.d24),
    renderS6TextPart("eq", line.eq),
    renderS6TextPart("r5", line.r5),
  );
}

function renderS6Line3Parts(line) {
  return React.createElement(
    "g",
    { className: "s6-line3" },
    renderS6TextPart("h", line.h),
    renderS6TextPart("eq", line.eq),
    renderS6TextPart("r5", line.r5),
    renderS6TextPart("times", line.times),
    renderS6TextPart("n24", line.n24),
    renderS6Bar("bar", line.bar),
    renderS6TextPart("d8", line.d8),
    renderS6Strike("strike24", line.strike24),
    renderS6Strike("strike8", line.strike8),
    renderS6TextPart("simp3", line.simp3),
    renderS6TextPart("simp1", line.simp1),
  );
}

function renderS6Line4Parts(line) {
  const parts = [];
  if (line.r3) {
    parts.push(
      renderS6TextPart("h", line.h),
      renderS6TextPart("eq", line.eq),
      renderS6TextPart("r5", line.r5),
      renderS6TextPart("times", line.times),
      renderS6TextPart("r3", line.r3),
    );
  } else if (line.val) {
    parts.push(
      renderS6TextPart("h", line.h),
      renderS6TextPart("eq", line.eq),
      React.createElement(
        "text",
        {
          key: "val",
          id: "s6-result-val",
          x: line.val.x,
          y: line.val.y,
          fill: s6Color(line.val.c || "white"),
          fontSize: line.val.fs || 24,
          fontWeight: 700,
          fontStyle: line.val.italic ? "italic" : "normal",
          textAnchor: "middle",
          dominantBaseline: "middle",
          style: { opacity: line.val.o || 0 },
        },
        line.val.text,
      ),
    );
  }
  return React.createElement("g", { className: "s6-line4" }, parts);
}

function renderS6ClickBox(id, bounds, onClick) {
  return React.createElement("rect", {
    id,
    x: bounds.x,
    y: bounds.y,
    width: bounds.w,
    height: bounds.h,
    rx: 10,
    ry: 10,
    fill: "transparent",
    stroke: COLOR_WHITE,
    strokeWidth: 2,
    strokeDasharray: "8 5",
    style: { cursor: "pointer" },
    onClick,
  });
}

function getPointLabelPositions(pts, showOnFloating) {
  return {
    A: { x: pts.A.x + 16, y: pts.A.y + 30 },
    B: showOnFloating
      ? null
      : { x: pts.B.x - 6, y: pts.B.y + BOTTOM_LABEL_OFFSET },
    C: showOnFloating
      ? null
      : { x: pts.C.x - 14, y: pts.C.y - 18 },
    D: { x: pts.D.x - 14, y: pts.D.y + BOTTOM_LABEL_OFFSET },
    E: { x: pts.E.x - 14, y: pts.E.y - 18 },
  };
}

const MainCanvas = (props) => {
  const {
    step,
    onSetNextEnabled,
    onUpdateTexts,
    onNext,
    onRegisterNudgeTarget,
    onHideNudge,
    onSetNextLabel,
  } = props;
  const { useState, useEffect, useMemo, useCallback, useRef } = React;

  const layout = useMemo(() => getDiagramLayout(), []);
  const basePts = useMemo(() => getWorldPoints(layout), [layout]);

  const [diagramShiftX, setDiagramShiftX] = useState(0);
  const [yellowOffsetY, setYellowOffsetY] = useState(0);
  const [showFills, setShowFills] = useState(false);
  const [showPointLabels, setShowPointLabels] = useState(false);
  const [floatingLabels, setFloatingLabels] = useState(false);
  const [showYellowAngle, setShowYellowAngle] = useState(false);
  const [showBlueAngle, setShowBlueAngle] = useState(false);
  const [calcPanelVisible, setCalcPanelVisible] = useState(false);
  const [calcTitleOpacity, setCalcTitleOpacity] = useState(0);
  const [line1Parts, setLine1Parts] = useState(() => getCalcLine1Positions());
  const [line2Parts, setLine2Parts] = useState(() => getCalcLine2Positions());
  const [line2Visible, setLine2Visible] = useState(false);
  const [flyingClones, setFlyingClones] = useState([]);
  const [sectorBlink, setSectorBlink] = useState(1);
  const [showRightSquares, setShowRightSquares] = useState(false);
  const [squareBlink, setSquareBlink] = useState(1);
  const [rightSquaresStable, setRightSquaresStable] = useState(false);
  const [showConcludeBtn, setShowConcludeBtn] = useState(false);
  const [concluded, setConcluded] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [step6Phase, setStep6Phase] = useState(null);
  const [s6Ratio, setS6Ratio] = useState(null);
  const [s6Line2, setS6Line2] = useState(null);
  const [s6Line3, setS6Line3] = useState(null);
  const [s6Line4, setS6Line4] = useState(null);
  const [s6ActiveBox, setS6ActiveBox] = useState(null);
  const [step6FloatDims, setStep6FloatDims] = useState(false);
  const [treeHeightLabel, setTreeHeightLabel] = useState(null);
  const [step6TitleOpacity, setStep6TitleOpacity] = useState(0);
  const [s6RatioMode, setS6RatioMode] = useState("symbolic");

  const step6IntroStartedRef = useRef(false);
  const isAnimatingRef = useRef(false);

  const getShiftedPts = useCallback(() => {
    const sx = diagramShiftX;
    const yOff = yellowOffsetY;
    const shift = (p, dy) => ({ x: p.x + sx, y: p.y + dy });
    const A = shift(basePts.A, 0);
    const B = shift(basePts.B, 0);
    const C = shift(basePts.C, 0);
    const D = shift(basePts.D, 0);
    const E = shift(basePts.E, 0);
    const useFloat = yOff !== 0;
    const Af = shift(basePts.A, yOff);
    const Bf = shift(basePts.B, yOff);
    const Cf = shift(basePts.C, yOff);
    return {
      D,
      E,
      A,
      B,
      C,
      Af,
      Bf,
      Cf,
      yellowA: useFloat ? Af : A,
      yellowB: useFloat ? Bf : B,
      yellowC: useFloat ? Cf : C,
    };
  }, [basePts, diagramShiftX, yellowOffsetY]);

  const flyLetter = useCallback((id, text, from, to, color) => {
    return new Promise((resolve) => {
      if (!from || !to) {
        resolve();
        return;
      }
      setFlyingClones((prev) => [
        ...prev,
        { id, text, from, to, color, t: 0, fontSize: POINT_LABEL_SIZE },
      ]);
      const anim = { t: 0 };
      gsap.to(anim, {
        t: 1,
        duration: 0.55,
        ease: "power2.inOut",
        onUpdate: () => {
          setFlyingClones((prev) =>
            prev.map((c) => (c.id === id ? { ...c, t: anim.t } : c)),
          );
        },
        onComplete: () => {
          setFlyingClones((prev) => prev.filter((c) => c.id !== id));
          resolve();
        },
      });
    });
  }, []);

  const flyLettersSimultaneous = useCallback(
    async (items, setOpacity, angleKey) => {
      await Promise.all(
        items.map((item, i) =>
          flyLetter(
            `fly-${item.key}-${i}-${Date.now()}`,
            item.text,
            item.from,
            item.to,
            item.color,
          ),
        ),
      );
      items.forEach((item) => setOpacity(item.key, 1));
      if (angleKey) setOpacity(angleKey, 1);
    },
    [flyLetter],
  );

  const setLine1Opacity = useCallback((key, val) => {
    setLine1Parts((prev) => ({
      ...prev,
      [key]: { ...prev[key], opacity: val },
    }));
  }, []);

  const setLine2Opacity = useCallback((key, val) => {
    setLine2Parts((prev) => ({
      ...prev,
      [key]: { ...prev[key], opacity: val },
    }));
  }, []);

  // ── Step 1: enable next ──
  useEffect(() => {
    if (step === 1) {
      onSetNextEnabled(true);
    }
  }, [step, onSetNextEnabled]);

  // ── Step 2: show fills, register nudge on blue triangle ──
  useEffect(() => {
    if (step !== 2) return;
    setShowFills(true);
    setShowPointLabels(false);
    setShowYellowAngle(false);
    setStep2Done(false);
    onSetNextEnabled(false);
    const tid = setTimeout(() => {
      const el = document.getElementById("blue-triangle-nudge-target");
      if (el && onRegisterNudgeTarget) {
        onRegisterNudgeTarget(el);
      }
    }, 400);
    return () => clearTimeout(tid);
  }, [step, onSetNextEnabled, onRegisterNudgeTarget]);

  const handleBlueTriangleClick = useCallback(() => {
    if (step !== 2 || step2Done) return;
    playSnd("click");
    if (onHideNudge) onHideNudge();
    setShowPointLabels(true);
    setShowYellowAngle(true);
    setStep2Done(true);
    onUpdateTexts(
      APP_DATA.steps[3].questionText,
      APP_DATA.steps[3].navText,
    );
    if (onNext) onNext(3, true);
  }, [step, step2Done, onHideNudge, onUpdateTexts, onNext]);

  // ── Step 3: nudge on angle (labels + sector already shown from step 2 click) ──
  useEffect(() => {
    if (step !== 3) return;
    setShowBlueAngle(false);
    setCalcPanelVisible(false);
    setCalcTitleOpacity(0);
    setLine1Parts(getCalcLine1Positions());
    setLine2Visible(false);
    setDiagramShiftX(0);
    setYellowOffsetY(0);
    setFloatingLabels(false);
    onSetNextEnabled(false);
    const tid = setTimeout(() => {
      const el = document.getElementById("yellow-angle-sector");
      if (el && onRegisterNudgeTarget) {
        onRegisterNudgeTarget(el);
      }
    }, 400);
    return () => clearTimeout(tid);
  }, [step, onSetNextEnabled, onRegisterNudgeTarget]);

  const getLabelPosAt = useCallback(
    (shiftX, yellowY, floating) => {
      const shift = (p, dy) => ({ x: p.x + shiftX, y: p.y + dy });
      const ground = {
        D: shift(basePts.D, 0),
        E: shift(basePts.E, 0),
        A: shift(basePts.A, 0),
        B: shift(basePts.B, 0),
        C: shift(basePts.C, 0),
      };
      const groundLabels = getPointLabelPositions(ground, false);
      if (!floating) {
        return { ground: groundLabels, yellow: groundLabels };
      }
      const floated = {
        A: shift(basePts.A, yellowY),
        B: shift(basePts.B, yellowY),
        C: shift(basePts.C, yellowY),
      };
      return {
        ground: groundLabels,
        yellow: getFloatingLabelPos(floated.A, floated.B, floated.C),
      };
    },
    [basePts],
  );

  const runStep3Animation = useCallback(async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    if (onHideNudge) onHideNudge();
    playSnd("click");

    const shiftAnim = { x: 0 };
    await new Promise((resolve) => {
      gsap.to(shiftAnim, {
        x: DIAGRAM_SHIFT_LEFT,
        duration: 0.8,
        ease: "power2.inOut",
        onUpdate: () => setDiagramShiftX(shiftAnim.x),
        onComplete: resolve,
      });
    });

    setCalcPanelVisible(true);
    await new Promise((r) => setTimeout(r, 500));

    const floatAnim = { y: 0 };
    await new Promise((resolve) => {
      gsap.to(floatAnim, {
        y: YELLOW_FLOAT_OFFSET,
        duration: 0.7,
        ease: "power2.inOut",
        onUpdate: () => setYellowOffsetY(floatAnim.y),
        onStart: () => {
          setFloatingLabels(true);
          setShowBlueAngle(true);
        },
        onComplete: resolve,
      });
    });
    await new Promise((r) => setTimeout(r, 300));

    const titleAnim = { o: 0 };
    await new Promise((resolve) => {
      gsap.to(titleAnim, {
        o: 1,
        duration: 0.4,
        onUpdate: () => setCalcTitleOpacity(titleAnim.o),
        onComplete: resolve,
      });
    });
    await new Promise((r) => setTimeout(r, 300));

    for (let i = 0; i < 3; i++) {
      setSectorBlink(0.15);
      await new Promise((r) => setTimeout(r, 280));
      setSectorBlink(1);
      await new Promise((r) => setTimeout(r, 280));
    }

    const calc1 = getCalcLine1Positions();
    const labelPos = getLabelPosAt(DIAGRAM_SHIFT_LEFT, YELLOW_FLOAT_OFFSET, true);
    const line1Fly = [
      { key: "C", text: "C", from: labelPos.yellow.C, to: calc1.C, color: COLOR_YELLOW },
      { key: "A1", text: "A", from: labelPos.yellow.A, to: calc1.A1, color: COLOR_YELLOW },
      { key: "B", text: "B", from: labelPos.yellow.B, to: calc1.B, color: COLOR_YELLOW },
    ];
    await flyLettersSimultaneous(line1Fly, setLine1Opacity, "angle1");
    setLine1Opacity("equals", 1);
    const line1Fly2 = [
      { key: "E", text: "E", from: labelPos.ground.E, to: calc1.E, color: COLOR_BLUE },
      { key: "A2", text: "A", from: labelPos.ground.A, to: calc1.A2, color: COLOR_BLUE },
      { key: "D", text: "D", from: labelPos.ground.D, to: calc1.D, color: COLOR_BLUE },
    ];
    await flyLettersSimultaneous(line1Fly2, setLine1Opacity, "angle2");

    setIsAnimating(false);
    if (onNext) onNext(4, true);
  }, [isAnimating, onHideNudge, onNext, flyLettersSimultaneous, setLine1Opacity, getLabelPosAt]);

  const handleYellowAngleClick = useCallback(() => {
    if (step !== 3) return;
    runStep3Animation();
  }, [step, runStep3Animation]);

  // ── Step 4: right-angle squares ──
  useEffect(() => {
    if (step !== 4) return;
    setShowRightSquares(true);
    setRightSquaresStable(false);
    setSquareBlink(1);
    setLine2Visible(true);
    setLine2Parts(getCalcLine2Positions());
    onSetNextEnabled(false);
    const tid = setTimeout(() => {
      const el = document.getElementById("right-angle-square-b");
      if (el && onRegisterNudgeTarget) {
        onRegisterNudgeTarget(el);
      }
    }, 350);
    return () => clearTimeout(tid);
  }, [step, onSetNextEnabled]);

  const runStep4Animation = useCallback(async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    if (onHideNudge) onHideNudge();
    setRightSquaresStable(true);
    setSquareBlink(1);
    playSnd("click");

    const calc2 = getCalcLine2Positions();
    const labelPos = getLabelPosAt(DIAGRAM_SHIFT_LEFT, YELLOW_FLOAT_OFFSET, true);
    const line2Fly = [
      { key: "C", text: "C", from: labelPos.yellow.C, to: calc2.C, color: COLOR_YELLOW },
      { key: "B", text: "B", from: labelPos.yellow.B, to: calc2.B, color: COLOR_YELLOW },
      { key: "A1", text: "A", from: labelPos.yellow.A, to: calc2.A1, color: COLOR_YELLOW },
    ];
    await flyLettersSimultaneous(line2Fly, setLine2Opacity, "angle1");
    setLine2Opacity("equals", 1);
    const line2Fly2 = [
      { key: "E", text: "E", from: labelPos.ground.E, to: calc2.E, color: COLOR_BLUE },
      { key: "D", text: "D", from: labelPos.ground.D, to: calc2.D, color: COLOR_BLUE },
      { key: "A2", text: "A", from: labelPos.ground.A, to: calc2.A2, color: COLOR_BLUE },
    ];
    await flyLettersSimultaneous(line2Fly2, setLine2Opacity, "angle2");

    const floatAnim = { y: yellowOffsetY };
    await new Promise((resolve) => {
      gsap.to(floatAnim, {
        y: 0,
        duration: 0.7,
        ease: "power2.inOut",
        onUpdate: () => setYellowOffsetY(floatAnim.y),
        onComplete: () => {
          setFloatingLabels(false);
          resolve();
        },
      });
    });

    setIsAnimating(false);
    if (onNext) onNext(5, true);
  }, [isAnimating, yellowOffsetY, flyLettersSimultaneous, onHideNudge, onNext, setLine2Opacity, getLabelPosAt]);

  const handleRightSquareClick = useCallback(() => {
    if (step !== 4) return;
    runStep4Animation();
  }, [step, runStep4Animation]);

  // ── Step 5: conclude button ──
  useEffect(() => {
    if (step !== 5) return;
    setShowConcludeBtn(true);
    setConcluded(false);
    onSetNextEnabled(false);
    onUpdateTexts(APP_DATA.steps[5].questionText, APP_DATA.steps[5].navText);
    const tid = setTimeout(() => {
      const el = document.getElementById("conclude-button-svg");
      if (el && onRegisterNudgeTarget) {
        onRegisterNudgeTarget(el, { delay: 500 });
      }
    }, 500);
    return () => clearTimeout(tid);
  }, [step, onSetNextEnabled, onUpdateTexts, onRegisterNudgeTarget]);

  const handleConclude = useCallback(() => {
    playSnd("click");
    if (onHideNudge) onHideNudge();
    setConcluded(true);
    setShowConcludeBtn(false);
    onUpdateTexts(
      APP_DATA.steps[5].questionText,
      APP_DATA.steps[5].navAfterConclude,
    );
    onSetNextEnabled(true);
    setTimeout(() => {
      const el = document.getElementById("next-button");
      if (el && onRegisterNudgeTarget) {
        onRegisterNudgeTarget(el, { immediate: true });
      }
    }, 400);
  }, [onHideNudge, onUpdateTexts, onSetNextEnabled, onRegisterNudgeTarget]);

  const getSvgElCenter = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el || typeof el.getBBox !== "function") return null;
    const b = el.getBBox();
    return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  }, []);

  const setS6RatioOp = useCallback((key, o) => {
    setS6Ratio((prev) => {
      if (!prev || !prev[key]) return prev;
      return { ...prev, [key]: { ...prev[key], o } };
    });
  }, []);

  const setS6Line2Op = useCallback((key, o) => {
    setS6Line2((prev) => {
      if (!prev || !prev[key]) return prev;
      return { ...prev, [key]: { ...prev[key], o } };
    });
  }, []);

  const setS6Line3Op = useCallback((key, o) => {
    setS6Line3((prev) => {
      if (!prev || !prev[key]) return prev;
      return { ...prev, [key]: { ...prev[key], o } };
    });
  }, []);

  const setS6Line4Op = useCallback((key, o) => {
    setS6Line4((prev) => {
      if (!prev || !prev[key]) return prev;
      return { ...prev, [key]: { ...prev[key], o } };
    });
  }, []);

  const registerS6BoxNudge = useCallback(
    (boxId) => {
      setTimeout(() => {
        const el = document.getElementById(boxId);
        if (el && onRegisterNudgeTarget) {
          onRegisterNudgeTarget(el);
        }
      }, 300);
    },
    [onRegisterNudgeTarget],
  );

  const showS6ComputeNav = useCallback(() => {
    onUpdateTexts(
      APP_DATA.steps[6].questionText,
      APP_DATA.steps[6].navCompute,
    );
  }, [onUpdateTexts]);

  const runStep6Intro = useCallback(async () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setIsAnimating(true);
    setCalcPanelVisible(true);
    setDiagramShiftX(DIAGRAM_SHIFT_LEFT);
    setS6Ratio(makeS6RatioSymbolic());
    setS6RatioMode("symbolic");
    setS6Line2(null);
    setS6Line3(null);
    setS6Line4(null);
    setS6ActiveBox(null);
    setStep6FloatDims(false);
    setTreeHeightLabel(null);
    setStep6TitleOpacity(0);
    setYellowOffsetY(0);
    setFloatingLabels(false);

    const titleAnim = { o: 0 };
    await new Promise((resolve) => {
      gsap.to(titleAnim, {
        o: 1,
        duration: 0.4,
        onUpdate: () => setStep6TitleOpacity(titleAnim.o),
        onComplete: resolve,
      });
    });
    await new Promise((r) => setTimeout(r, 200));

    const floatAnim = { y: 0 };
    await new Promise((resolve) => {
      gsap.to(floatAnim, {
        y: YELLOW_FLOAT_OFFSET,
        duration: 0.7,
        ease: "power2.inOut",
        onUpdate: () => setYellowOffsetY(floatAnim.y),
        onStart: () => {
          setStep6FloatDims(true);
          setFloatingLabels(true);
        },
        onComplete: resolve,
      });
    });
    await new Promise((r) => setTimeout(r, 250));

    const ratio = makeS6RatioSymbolic();
    setS6Ratio(ratio);
    const labelPos = getLabelPosAt(DIAGRAM_SHIFT_LEFT, YELLOW_FLOAT_OFFSET, true);

    await flyLettersSimultaneous(
      [
        { key: "lnA", text: "A", from: labelPos.yellow.A, to: ratio.lnA, color: COLOR_YELLOW },
        { key: "lnB", text: "B", from: labelPos.yellow.B, to: ratio.lnB, color: COLOR_YELLOW },
      ],
      (key, val) => setS6RatioOp(key, val),
    );
    setS6RatioOp("lBar", 1);
    await flyLettersSimultaneous(
      [
        { key: "ldA", text: "A", from: labelPos.ground.A, to: ratio.ldA, color: COLOR_BLUE },
        { key: "ldD", text: "D", from: labelPos.ground.D, to: ratio.ldD, color: COLOR_BLUE },
      ],
      (key, val) => setS6RatioOp(key, val),
    );
    setS6RatioOp("eq", 1);
    await flyLettersSimultaneous(
      [
        { key: "rnB", text: "B", from: labelPos.yellow.B, to: ratio.rnB, color: COLOR_YELLOW },
        { key: "rnC", text: "C", from: labelPos.yellow.C, to: ratio.rnC, color: COLOR_YELLOW },
      ],
      (key, val) => setS6RatioOp(key, val),
    );
    setS6RatioOp("rBar", 1);
    await flyLettersSimultaneous(
      [
        { key: "rdD", text: "D", from: labelPos.ground.D, to: ratio.rdD, color: COLOR_BLUE },
        { key: "rdE", text: "E", from: labelPos.ground.E, to: ratio.rdE, color: COLOR_BLUE },
      ],
      (key, val) => setS6RatioOp(key, val),
    );

    const valueSlots = makeS6RatioValueSlots();
    setS6Ratio((prev) => ({ ...prev, ...valueSlots }));

    setStep6Phase("box-symbolic");
    setS6ActiveBox("ratio");
    showS6ComputeNav();
    registerS6BoxNudge("s6-box-ratio");
    isAnimatingRef.current = false;
    setIsAnimating(false);
  }, [
    flyLettersSimultaneous,
    getLabelPosAt,
    setS6RatioOp,
    showS6ComputeNav,
    registerS6BoxNudge,
  ]);

  const runS6SubstituteValues = useCallback(async () => {
    setIsAnimating(true);
    const targets = makeS6RatioValueSlots();

    const substituteGroup = async (
      srcId,
      text,
      valueKey,
      letterKeys,
      color,
    ) => {
      const to = targets[valueKey];
      const from = getSvgElCenter(srcId);
      if (!from || !to) {
        letterKeys.forEach((k) => setS6RatioOp(k, 0));
        setS6RatioOp(valueKey, 1);
        return;
      }
      await flyLetter(
        `s6-sub-${valueKey}-${Date.now()}`,
        text,
        from,
        to,
        color,
      );
      letterKeys.forEach((k) => setS6RatioOp(k, 0));
      setS6RatioOp(valueKey, 1);
    };

    await substituteGroup(
      "diagram-label-8ft",
      "8",
      "ln8",
      ["lnA", "lnB"],
      COLOR_WHITE,
    );
    await substituteGroup(
      "diagram-label-24ft",
      "24",
      "ld24",
      ["ldA", "ldD"],
      COLOR_WHITE,
    );
    await substituteGroup(
      "diagram-label-5ft",
      "5",
      "rn5",
      ["rnB", "rnC"],
      COLOR_WHITE,
    );
    await substituteGroup(
      "diagram-label-h",
      "h",
      "rdh",
      ["rdD", "rdE"],
      COLOR_WHITE,
    );

    setS6RatioMode("values");
    setStep6Phase("box-values");
    setS6ActiveBox("ratio");
    showS6ComputeNav();
    registerS6BoxNudge("s6-box-ratio");
    setIsAnimating(false);
  }, [flyLetter, getSvgElCenter, setS6RatioOp, showS6ComputeNav, registerS6BoxNudge]);

  const runS6Line2Anim = useCallback(async () => {
    setIsAnimating(true);
    const line2 = makeS6Line2();
    setS6Line2(line2);
    const ratio = makeS6RatioValues();
    Object.keys(line2).forEach((k) => setS6Line2Op(k, 0));

    const flyFromRatio = async (srcKey, dstKey, text) => {
      const from = ratio[srcKey] || ratio[dstKey];
      const to = line2[dstKey];
      if (!from || !to) {
        setS6Line2Op(dstKey, 1);
        return;
      }
      await flyLetter(
        `s6-l2-${dstKey}-${Date.now()}`,
        text || from.text,
        { x: from.x, y: from.y },
        to,
        COLOR_WHITE,
      );
      setS6Line2Op(dstKey, 1);
    };

    await flyFromRatio("rdh", "h", "h");
    setS6Line2Op("times", 1);
    await flyFromRatio("ln8", "n8", "8");
    setS6Line2Op("bar", 1);
    await flyFromRatio("ld24", "d24", "24");
    setS6Line2Op("eq", 1);
    await flyFromRatio("rn5", "r5", "5");

    setStep6Phase("box-line2");
    setS6ActiveBox("line2");
    showS6ComputeNav();
    registerS6BoxNudge("s6-box-line2");
    setIsAnimating(false);
  }, [flyLetter, setS6Line2Op, showS6ComputeNav, registerS6BoxNudge]);

  const runS6Line3Anim = useCallback(async () => {
    setIsAnimating(true);
    const line3 = makeS6Line3();
    setS6Line3(line3);
    const line2 = makeS6Line2();
    Object.keys(line3).forEach((k) => setS6Line3Op(k, 0));

    const flyFromL2 = async (srcKey, dstKey, text) => {
      const from = line2[srcKey];
      const to = line3[dstKey];
      if (!from || !to) {
        setS6Line3Op(dstKey, 1);
        return;
      }
      await flyLetter(
        `s6-l3-${dstKey}-${Date.now()}`,
        text || from.text,
        { x: from.x, y: from.y },
        to,
        COLOR_WHITE,
      );
      setS6Line3Op(dstKey, 1);
    };

    await flyFromL2("h", "h", "h");
    setS6Line3Op("eq", 1);
    await flyFromL2("r5", "r5", "5");
    setS6Line3Op("times", 1);
    await flyFromL2("d24", "n24", "24");
    setS6Line3Op("bar", 1);
    await flyFromL2("n8", "d8", "8");
    await new Promise((r) => setTimeout(r, 200));
    setS6Line3Op("strike24", 1);
    setS6Line3Op("strike8", 1);
    setS6Line3Op("simp3", 1);
    setS6Line3Op("simp1", 1);
    await new Promise((r) => setTimeout(r, 250));

    const line4 = makeS6Line4(true);
    setS6Line4(line4);
    Object.keys(line4).forEach((k) => setS6Line4Op(k, 0));
    const flyFromL3 = async (srcKey, dstKey, text) => {
      const from = line3[srcKey];
      const to = line4[dstKey];
      if (!from || !to) {
        setS6Line4Op(dstKey, 1);
        return;
      }
      await flyLetter(
        `s6-l4-${dstKey}-${Date.now()}`,
        text || from.text,
        { x: from.x, y: from.y },
        to,
        COLOR_WHITE,
      );
      setS6Line4Op(dstKey, 1);
    };

    await flyFromL3("h", "h", "h");
    setS6Line4Op("eq", 1);
    await flyFromL3("r5", "r5", "5");
    setS6Line4Op("times", 1);
    await flyFromL3("simp3", "r3", "3");

    setStep6Phase("box-line4");
    setS6ActiveBox("line4");
    showS6ComputeNav();
    registerS6BoxNudge("s6-box-line4");
    setIsAnimating(false);
  }, [flyLetter, setS6Line3Op, setS6Line4Op, showS6ComputeNav, registerS6BoxNudge]);

  const runS6Finish = useCallback(async () => {
    setIsAnimating(true);
    const final = makeS6Line4(false);
    setS6Line4(final);
    await new Promise((r) => setTimeout(r, 350));
    setS6Line4Op("val", 1);
    await new Promise((r) => setTimeout(r, 450));
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r)),
    );

    const floatAnim = { y: yellowOffsetY };
    await new Promise((resolve) => {
      gsap.to(floatAnim, {
        y: 0,
        duration: 0.7,
        ease: "power2.inOut",
        onUpdate: () => setYellowOffsetY(floatAnim.y),
        onComplete: () => {
          setStep6FloatDims(false);
          setFloatingLabels(false);
          resolve();
        },
      });
    });

    const from = getSvgElCenter("s6-result-val");
    const to = getSvgElCenter("diagram-label-h");
    const resultText = APP_DATA.labels.heightTreeResult;
    if (from && to) {
      await flyLetter(
        `s6-final-h-${Date.now()}`,
        resultText,
        from,
        to,
        COLOR_WHITE,
      );
    }
    setTreeHeightLabel(resultText);

    setStep6Phase("complete");
    setS6ActiveBox(null);
    onUpdateTexts(
      APP_DATA.steps[6].questionComplete,
      APP_DATA.steps[6].navComplete,
    );
    if (onSetNextLabel) onSetNextLabel(APP_DATA.steps[6].nextText);
    onSetNextEnabled(true);
    setIsAnimating(false);
  }, [
    yellowOffsetY,
    flyLetter,
    getSvgElCenter,
    setS6Line4Op,
    onUpdateTexts,
    onSetNextLabel,
    onSetNextEnabled,
  ]);

  const handleS6BoxClick = useCallback(() => {
    if (isAnimating || !s6ActiveBox) return;
    playSnd("click");
    if (onHideNudge) onHideNudge();
    setS6ActiveBox(null);
    onUpdateTexts(APP_DATA.steps[6].questionText, "");

    if (step6Phase === "box-symbolic") {
      runS6SubstituteValues();
    } else if (step6Phase === "box-values") {
      runS6Line2Anim();
    } else if (step6Phase === "box-line2") {
      runS6Line3Anim();
    } else if (step6Phase === "box-line4") {
      runS6Finish();
    }
  }, [
    isAnimating,
    s6ActiveBox,
    step6Phase,
    onHideNudge,
    onUpdateTexts,
    runS6SubstituteValues,
    runS6Line2Anim,
    runS6Line3Anim,
    runS6Finish,
  ]);

  useEffect(() => {
    if (step !== 6) {
      step6IntroStartedRef.current = false;
      return;
    }
    if (step6IntroStartedRef.current) return;
    step6IntroStartedRef.current = true;

    setShowConcludeBtn(false);
    setConcluded(false);
    setShowRightSquares(false);
    setShowBlueAngle(false);
    setShowYellowAngle(false);
    onSetNextEnabled(false);
    onUpdateTexts(APP_DATA.steps[6].questionText, APP_DATA.steps[6].navText);
    if (onSetNextLabel) onSetNextLabel("\u00BB");
    const tid = setTimeout(() => runStep6Intro(), 400);
    return () => clearTimeout(tid);
  }, [step, onSetNextEnabled, onUpdateTexts, onSetNextLabel, runStep6Intro]);

  // Square border blink
  useEffect(() => {
    if (!showRightSquares || step !== 4 || rightSquaresStable) return;
    let count = 0;
    const id = setInterval(() => {
      count++;
      setSquareBlink(count % 2 === 0 ? 1 : 0.2);
    }, 500);
    return () => clearInterval(id);
  }, [showRightSquares, step, rightSquaresStable]);

  // ── SVG helpers ──
  const renderBidirectionalArrow = (p1, p2, key) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const px = -uy;
    const py = ux;
    const hl = ARROW_HEAD_LEN;
    const hh = ARROW_HEAD_HALF;
    const ov = ARROW_TIP_OVERLAP;

    const innerStart = { x: p1.x + ux * hl, y: p1.y + uy * hl };
    const innerEnd = { x: p2.x - ux * hl, y: p2.y - uy * hl };
    const endTip = { x: p2.x + ux * ov, y: p2.y + uy * ov };
    const startTip = { x: p1.x - ux * ov, y: p1.y - uy * ov };

    const endBase1 = {
      x: p2.x - ux * hl + px * hh,
      y: p2.y - uy * hl + py * hh,
    };
    const endBase2 = {
      x: p2.x - ux * hl - px * hh,
      y: p2.y - uy * hl - py * hh,
    };
    const startBase1 = {
      x: p1.x + ux * hl + px * hh,
      y: p1.y + uy * hl + py * hh,
    };
    const startBase2 = {
      x: p1.x + ux * hl - px * hh,
      y: p1.y + uy * hl - py * hh,
    };

    return React.createElement(
      "g",
      { key },
      React.createElement("line", {
        x1: innerStart.x,
        y1: innerStart.y,
        x2: innerEnd.x,
        y2: innerEnd.y,
        stroke: COLOR_WHITE,
        strokeWidth: STROKE_WIDTH,
      }),
      React.createElement("polygon", {
        points: `${endTip.x},${endTip.y} ${endBase1.x},${endBase1.y} ${endBase2.x},${endBase2.y}`,
        fill: COLOR_WHITE,
      }),
      React.createElement("polygon", {
        points: `${startTip.x},${startTip.y} ${startBase1.x},${startBase1.y} ${startBase2.x},${startBase2.y}`,
        fill: COLOR_WHITE,
      }),
    );
  };

  const renderDiagram = () => {
    const world = getShiftedPts();
    const { D, E, A, B, C, yellowA, yellowB, yellowC } = world;
    const labels = APP_DATA.labels;
    const adArrowY = layout.groundY + AD_ARROW_GAP;
    const groundLeft = { x: D.x - GROUND_EXTEND, y: D.y };
    const groundRight = { x: A.x + GROUND_EXTEND, y: A.y };
    const labelPos = getPointLabelPositions(world, floatingLabels);
    const floatLabelPos = floatingLabels
      ? {
          A: { x: yellowA.x + 16, y: yellowA.y + 30 },
          B: { x: yellowB.x - 6, y: yellowB.y + 28 },
          C: { x: yellowC.x - 14, y: yellowC.y - 18 },
        }
      : null;

    const useFloatDims = step6FloatDims || (step >= 6 && yellowOffsetY !== 0);
    const dimB = useFloatDims ? yellowB : B;
    const dimC = useFloatDims ? yellowC : C;
    const dimA = useFloatDims ? yellowA : A;
    const treeHText = treeHeightLabel || labels.heightTree;

    const bluePath = `M${D.x} ${D.y} L${E.x} ${E.y} L${A.x} ${A.y} Z`;
    const yellowPath = `M${yellowB.x} ${yellowB.y} L${yellowC.x} ${yellowC.y} L${yellowA.x} ${yellowA.y} Z`;
    const sectorRadius = 42;
    const yellowAngleVertex = floatingLabels ? yellowA : A;
    const yellowAngleP1 = floatingLabels ? yellowC : C;
    const yellowAngleP2 = floatingLabels ? yellowB : B;

    const blueCentroid = getBlueTriangleCentroid(D, E, A);

    return React.createElement(
      "g",
      { className: "diagram-group" },
      showFills &&
        React.createElement("path", {
          id: "blue-triangle-fill",
          d: bluePath,
          fill: COLOR_BLUE_FILL,
          fillOpacity: 1,
          stroke: "none",
          style: {
            cursor: step === 2 && !step2Done ? "pointer" : "default",
            pointerEvents: step === 2 && !step2Done ? "all" : "none",
          },
          onClick: handleBlueTriangleClick,
        }),

      step === 2 &&
        !step2Done &&
        React.createElement("circle", {
          id: "blue-triangle-nudge-target",
          cx: blueCentroid.x,
          cy: blueCentroid.y,
          r: 36,
          fill: "transparent",
          stroke: "none",
          style: { pointerEvents: "none" },
        }),

      React.createElement("image", {
        href: TREE_IMG,
        x: D.x - (D.y - E.y) * 0.22,
        y: E.y,
        width: (D.y - E.y) * 0.44,
        height: D.y - E.y,
        preserveAspectRatio: "xMidYMid slice",
      }),

      React.createElement("line", {
        x1: groundLeft.x,
        y1: groundLeft.y,
        x2: groundRight.x,
        y2: groundRight.y,
        stroke: COLOR_WHITE,
        strokeWidth: STROKE_WIDTH,
      }),

      React.createElement("line", {
        x1: E.x,
        y1: E.y,
        x2: A.x,
        y2: A.y,
        stroke: COLOR_WHITE,
        strokeWidth: STROKE_WIDTH,
      }),

      renderBidirectionalArrow(D, E, "de"),
      renderBidirectionalArrow(
        { x: D.x, y: adArrowY },
        { x: A.x, y: adArrowY },
        "ad",
      ),

      React.createElement("image", {
        href: MAN_IMG,
        x: B.x - (B.y - C.y) * 0.2,
        y: C.y,
        width: (B.y - C.y) * 0.4,
        height: B.y - C.y,
        preserveAspectRatio: "xMidYMid slice",
      }),

      renderBidirectionalArrow(B, C, "bc"),

      showFills &&
        React.createElement("path", {
          d: yellowPath,
          fill: COLOR_YELLOW_FILL,
          fillOpacity: 0.5,
          stroke: "none",
        }),

      showYellowAngle &&
        React.createElement("path", {
          id: "yellow-angle-sector",
          d: describeSector(yellowAngleVertex, yellowAngleP1, yellowAngleP2, sectorRadius),
          fill: COLOR_YELLOW,
          fillOpacity: 0.55 * sectorBlink,
          stroke: COLOR_YELLOW,
          strokeWidth: 2,
          style: {
            cursor: step === 3 ? "pointer" : "default",
            pointerEvents: step === 3 ? "all" : "none",
          },
          onClick: handleYellowAngleClick,
        }),

      showBlueAngle &&
        React.createElement("path", {
          d: describeSector(A, E, D, sectorRadius),
          fill: COLOR_BLUE,
          fillOpacity: 0.45 * sectorBlink,
          stroke: COLOR_BLUE,
          strokeWidth: 2,
          style: { pointerEvents: "none" },
        }),

      showRightSquares &&
        React.createElement(
          "g",
          null,
          React.createElement("rect", {
            id: "right-angle-square-d",
            x: D.x,
            y: D.y - 22,
            width: 22,
            height: 22,
            fill: COLOR_BLUE_FILL,
            fillOpacity: 0.35 + 0.2 * squareBlink,
            stroke: COLOR_BLUE,
            strokeWidth: 2.5,
            strokeOpacity: squareBlink,
            style: { cursor: "pointer" },
            onClick: handleRightSquareClick,
          }),
          React.createElement("rect", {
            id: "right-angle-square-b",
            x: yellowB.x,
            y: yellowB.y - 22,
            width: 22,
            height: 22,
            fill: COLOR_YELLOW_FILL,
            fillOpacity: 0.35 + 0.2 * squareBlink,
            stroke: COLOR_YELLOW,
            strokeWidth: 2.5,
            strokeOpacity: squareBlink,
            style: { cursor: "pointer" },
            onClick: handleRightSquareClick,
          }),
        ),

      React.createElement(
        "text",
        {
          id: "diagram-label-h",
          x: D.x - 32,
          y: (D.y + E.y) / 2,
          fill: COLOR_WHITE,
          fontSize: LABEL_FONT_SIZE,
          fontStyle: "italic",
          fontWeight: 600,
          textAnchor: "middle",
          dominantBaseline: "middle",
        },
        treeHText,
      ),

      React.createElement(
        "text",
        {
          id: "diagram-label-5ft",
          x: dimB.x - 36,
          y: (dimB.y + dimC.y) / 2,
          fill: COLOR_WHITE,
          fontSize: LABEL_FONT_SIZE,
          fontWeight: 600,
          textAnchor: "middle",
          dominantBaseline: "middle",
        },
        labels.heightMan,
      ),

      React.createElement(
        "text",
        {
          id: "diagram-label-24ft",
          x: (D.x + A.x) / 2,
          y: adArrowY + AD_LABEL_GAP,
          fill: COLOR_WHITE,
          fontSize: LABEL_FONT_SIZE,
          fontWeight: 600,
          textAnchor: "middle",
          dominantBaseline: "middle",
        },
        labels.distanceTotal,
      ),

      React.createElement(
        "text",
        {
          id: "diagram-label-8ft",
          x: (dimB.x + dimA.x) / 2,
          y: dimA.y - 18,
          fill: COLOR_WHITE,
          fontSize: LABEL_FONT_SIZE,
          fontWeight: 600,
          textAnchor: "middle",
          dominantBaseline: "middle",
        },
        labels.distanceAB,
      ),

      showPointLabels &&
        ["D", "E", "A"].map((k) =>
          labelPos[k]
            ? React.createElement(
                "text",
                {
                  key: `lbl-${k}`,
                  x: labelPos[k].x,
                  y: labelPos[k].y,
                  fill: COLOR_WHITE,
                  fontSize: POINT_LABEL_SIZE,
                  fontWeight: 700,
                  textAnchor: "middle",
                  dominantBaseline: "middle",
                },
                k,
              )
            : null,
        ),

      showPointLabels &&
        !floatingLabels &&
        ["B", "C"].map((k) =>
          labelPos[k]
            ? React.createElement(
                "text",
                {
                  key: `lbl-${k}`,
                  x: labelPos[k].x,
                  y: labelPos[k].y,
                  fill: COLOR_WHITE,
                  fontSize: POINT_LABEL_SIZE,
                  fontWeight: 700,
                  textAnchor: "middle",
                  dominantBaseline: "middle",
                },
                k,
              )
            : null,
        ),

      floatingLabels &&
        floatLabelPos &&
        ["A", "B", "C"].map((k) =>
          React.createElement(
            "text",
            {
              key: `float-lbl-${k}`,
              x: floatLabelPos[k].x,
              y: floatLabelPos[k].y,
              fill: COLOR_WHITE,
              fontSize: POINT_LABEL_SIZE,
              fontWeight: 700,
              textAnchor: "middle",
              dominantBaseline: "middle",
            },
            k,
          ),
        ),
    );
  };

  const renderCalcPanel = () => {
    if (step < 3) return null;
    if (step === 3 && !calcPanelVisible) return null;

    if (step >= 6) {
      const step6 = APP_DATA.steps[6];
      return React.createElement(
        "g",
        { className: "calc-panel-group" },
        React.createElement("rect", {
          x: CALC_PANEL.boxX,
          y: CALC_PANEL.boxY,
          width: CALC_PANEL.boxW,
          height: CALC_PANEL.boxH,
          rx: 16,
          ry: 16,
          fill: "rgba(35, 50, 65, 0.88)",
          stroke: "rgba(255,255,255,0.12)",
          strokeWidth: 1.5,
        }),
        React.createElement(
          "text",
          {
            x: CALC_PANEL.boxX + CALC_PANEL.boxW / 2,
            y: CALC_PANEL.boxY + CALC_PANEL.titleY,
            fill: COLOR_WHITE,
            fontSize: 24,
            fontWeight: 700,
            textAnchor: "middle",
            dominantBaseline: "middle",
            style: { opacity: step6TitleOpacity },
          },
          step6.calcTitle,
        ),
        s6Ratio && renderS6Ratio(s6Ratio),
        s6Line2 && renderS6Line2Parts(s6Line2),
        s6Line3 && renderS6Line3Parts(s6Line3),
        s6Line4 && renderS6Line4Parts(s6Line4),
        s6ActiveBox === "ratio" &&
          renderS6ClickBox("s6-box-ratio", s6RatioBoxBounds(), handleS6BoxClick),
        s6ActiveBox === "line2" &&
          renderS6ClickBox("s6-box-line2", s6Line2BoxBounds(), handleS6BoxClick),
        s6ActiveBox === "line4" &&
          renderS6ClickBox("s6-box-line4", s6Line4BoxBounds(), handleS6BoxClick),
      );
    }

    const step5 = APP_DATA.steps[5];
    const btnCx = CALC_PANEL.boxX + CALC_PANEL.boxW / 2;
    const btnX = btnCx - CALC_PANEL.buttonW / 2;
    const btnY = CALC_PANEL.boxY + CALC_PANEL.buttonY;

    return React.createElement(
      "g",
      { className: "calc-panel-group" },
      React.createElement("rect", {
        x: CALC_PANEL.boxX,
        y: CALC_PANEL.boxY,
        width: CALC_PANEL.boxW,
        height: CALC_PANEL.boxH,
        rx: 16,
        ry: 16,
        fill: "rgba(35, 50, 65, 0.88)",
        stroke: "rgba(255,255,255,0.12)",
        strokeWidth: 1.5,
        style: { opacity: calcPanelVisible ? 1 : 0 },
      }),

      React.createElement(
        "text",
        {
          x: CALC_PANEL.boxX + CALC_PANEL.boxW / 2,
          y: CALC_PANEL.boxY + CALC_PANEL.titleY,
          fill: COLOR_WHITE,
          fontSize: 24,
          fontWeight: 700,
          textAnchor: "middle",
          dominantBaseline: "middle",
          style: { opacity: calcTitleOpacity },
        },
        step5.calcTitle,
      ),

      Object.keys(line1Parts).map((key) => {
        const p = line1Parts[key];
        const color =
          key === "equals"
            ? COLOR_WHITE
            : key === "angle1"
              ? COLOR_YELLOW
              : key === "angle2"
                ? COLOR_BLUE
            : ["C", "B", "A1"].includes(key)
              ? COLOR_YELLOW
              : COLOR_BLUE;
        return React.createElement(
          "text",
          {
            key: `l1-${key}`,
            x: p.x,
            y: p.y,
            fill: color,
            fontSize: CALC_FONT_SIZE,
            fontWeight: 700,
            textAnchor: "middle",
            dominantBaseline: "middle",
            style: { opacity: step >= 6 ? 0 : p.opacity },
          },
          p.text,
        );
      }),

      line2Visible &&
        step < 6 &&
        Object.keys(line2Parts).map((key) => {
          const p = line2Parts[key];
          const color =
            key === "equals"
              ? COLOR_WHITE
              : key === "angle1"
                ? COLOR_YELLOW
                : key === "angle2"
                  ? COLOR_BLUE
              : ["C", "B", "A1"].includes(key)
                ? COLOR_YELLOW
                : COLOR_BLUE;
          return React.createElement(
            "text",
            {
              key: `l2-${key}`,
              x: p.x,
              y: p.y,
              fill: color,
              fontSize: CALC_FONT_SIZE,
              fontWeight: 700,
              textAnchor: "middle",
              dominantBaseline: "middle",
              style: { opacity: p.opacity },
            },
            p.text,
          );
        }),

      showConcludeBtn &&
        !concluded &&
        step < 6 &&
        React.createElement(
          "g",
          {
            id: "conclude-button-svg",
            style: { cursor: "pointer" },
            onClick: handleConclude,
          },
          React.createElement("rect", {
            x: btnX,
            y: btnY,
            width: CALC_PANEL.buttonW,
            height: CALC_PANEL.buttonH,
            rx: 10,
            ry: 10,
            fill: "#ffb84c",
          }),
          React.createElement(
            "text",
            {
              x: btnCx,
              y: btnY + CALC_PANEL.buttonH / 2,
              fill: "#1a2a3a",
              fontSize: 22,
              fontWeight: 700,
              textAnchor: "middle",
              dominantBaseline: "middle",
            },
            step5.concludeText,
          ),
        ),

      concluded &&
        step < 6 &&
        React.createElement(
          "g",
          null,
          React.createElement("rect", {
            x: CALC_PANEL.boxX + CALC_PAD,
            y: CALC_PANEL.boxY + CALC_PANEL.conclusionY,
            width: CALC_PANEL.boxW - CALC_PAD * 2,
            height: 68,
            rx: 10,
            ry: 10,
            fill: "rgba(55, 68, 82, 0.95)",
          }),
          React.createElement(
            "text",
            {
              x: CALC_PANEL.boxX + CALC_PANEL.boxW / 2,
              y: CALC_PANEL.boxY + CALC_PANEL.conclusionY + 28,
              fill: COLOR_WHITE,
              fontSize: 24,
              fontWeight: 700,
              textAnchor: "middle",
              dominantBaseline: "middle",
            },
            step5.conclusionLine1,
          ),
          React.createElement(
            "text",
            {
              x: CALC_PANEL.boxX + CALC_PANEL.boxW / 2,
              y: CALC_PANEL.boxY + CALC_PANEL.conclusionY + 52,
              fill: COLOR_WHITE,
              fontSize: 17,
              fontStyle: "italic",
              fontWeight: 500,
              textAnchor: "middle",
              dominantBaseline: "middle",
            },
            step5.conclusionLine2,
          ),
        ),
    );
  };

  const renderFlyingClones = () => {
    if (flyingClones.length === 0) return null;
    return React.createElement(
      "g",
      { style: { pointerEvents: "none" } },
      flyingClones.map((c) => {
        const x = c.from.x + (c.to.x - c.from.x) * c.t;
        const y = c.from.y + (c.to.y - c.from.y) * c.t;
        return React.createElement(
          "text",
          {
            key: c.id,
            x,
            y,
            fill: c.color,
            fontSize: c.fontSize,
            fontWeight: 700,
            textAnchor: "middle",
            dominantBaseline: "middle",
          },
          c.text,
        );
      }),
    );
  };

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "svg",
      {
        className: "main-svg",
        viewBox: VIEWBOX,
        preserveAspectRatio: "xMidYMid meet",
      },
      renderDiagram(),
      renderCalcPanel(),
      renderFlyingClones(),
    ),
  );
};
