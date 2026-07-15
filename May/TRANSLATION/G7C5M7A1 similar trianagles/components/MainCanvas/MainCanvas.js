/* ── Geometry helpers ── */
/* Sides: AB=6 (base at bottom), AC=5, BC=4 — apex C at top (SVG y-down) */

const TRI_ABC = {
  A: { x: 0, y: 3.307 },
  B: { x: 6, y: 3.307 },
  C: { x: 3.75, y: 0 },
};

const TRI_DEF = {
  D: { x: 0, y: 6.614 },
  E: { x: 12, y: 6.614 },
  F: { x: 7.5, y: 0 },
};

const ABC_CENTROID = { x: 3.25, y: 2.205 };
const DEF_CENTROID = { x: 6.5, y: 4.409 };

/* Same scale for both — DEF local coords are already 2×, so it renders twice as large */
const S = 30;
const DIAGRAM_SHIFT_Y = -28;
const NEST_CENTER = { x: 300, y: 200 };
const SIDE_ABC_CENTER = { x: 90, y: 210 };
const SIDE_DEF_CENTER = { x: 430, y: 210 };

const LABEL_FONT_SIZE = 0.75;
const LABEL_DIST_OUTSIDE = 0.55;
const LABEL_DIST_INSIDE = 1.05;
const LABEL_DIST_INSIDE_ARC = 1.85;

const COLOR_YELLOW = "#FFD700";
const COLOR_BLUE = "#4FC3F7";
const COLOR_WHITE = "#FFFFFF";

const ARC_RADIUS_SMALL = 1.1;
const ARC_RADIUS_LARGE = 1.1 * 1.5;
const ARC_RADIUS_SMALL_HALF = ARC_RADIUS_SMALL * 0.5;
const ARC_RADIUS_LARGE_HALF = ARC_RADIUS_LARGE * 0.5;
const HOTSPOT_RADIUS = 58;
const HOTSPOT_RING_MID = 0.72;
const HOTSPOT_RING_CENTER = 0.48;
const HOTSPOT_OPACITY = { outer: 0.2, mid: 0.3, center: 0.5 };
const HOTSPOT_PULSE_BOOST = 0.1;

const describeHotspotRing = (cx, cy, rOuter, rInner) => {
  const outer = [
    "M", cx - rOuter, cy,
    "A", rOuter, rOuter, 0, 1, 0, cx + rOuter, cy,
    "A", rOuter, rOuter, 0, 1, 0, cx - rOuter, cy,
    "Z",
  ].join(" ");

  if (rInner <= 0) return outer;

  const inner = [
    "M", cx - rInner, cy,
    "A", rInner, rInner, 0, 1, 1, cx + rInner, cy,
    "A", rInner, rInner, 0, 1, 1, cx - rInner, cy,
    "Z",
  ].join(" ");

  return `${outer} ${inner}`;
};

const PAIR_CONFIG = {
  1: {
    fadeSidesAbc: ["BC"],
    fadeSidesDef: ["EF"],
    fadeLabels: ["B", "C", "E", "F"],
    textKey: "D",
    textBelow: true,
  },
  2: {
    fadeSidesAbc: ["AC"],
    fadeSidesDef: ["DF"],
    fadeLabels: ["A", "C", "D", "F"],
    textKey: "E",
    textBelow: true,
  },
  3: {
    fadeSidesAbc: ["AB"],
    fadeSidesDef: ["DE"],
    fadeLabels: ["A", "B", "D", "E"],
    textKey: "F",
    textBelow: false,
    textOffset: { x: 1.0, y: -0.35 },
  },
};

const SIDE_PAIR_CONFIG = {
  1: {
    fadeSidesAbc: ["BC", "AC"],
    fadeSidesDef: ["EF", "DF"],
    fadeLabels: ["C", "F"],
    abcSide: "AB",
    defSide: "DE",
    abcVerts: ["A", "B"],
    defVerts: ["D", "E"],
    abcLen: 6,
    defLen: 12,
    simpNum: 1,
    simpDen: 2,
  },
  2: {
    fadeSidesAbc: ["AB", "AC"],
    fadeSidesDef: ["DE", "DF"],
    fadeLabels: ["A", "D"],
    abcSide: "BC",
    defSide: "EF",
    abcVerts: ["B", "C"],
    defVerts: ["E", "F"],
    abcLen: 4,
    defLen: 8,
    simpNum: 1,
    simpDen: 2,
  },
  3: {
    fadeSidesAbc: ["AB", "BC"],
    fadeSidesDef: ["DE", "EF"],
    fadeLabels: ["B", "E"],
    abcSide: "AC",
    defSide: "DF",
    abcVerts: ["A", "C"],
    defVerts: ["D", "F"],
    abcLen: 5,
    defLen: 10,
    simpNum: 1,
    simpDen: 2,
  },
};

const DIAGRAM_SHIFT_LEFT = -115;
const CALC_BASE_X = 395;
const CALC_BASE_Y = 95;
const EQ_ROW_GAP = 58;
const EQ_MERGED_GAP = 22;
const EQ_FONT = 22;
const EQ_BAR_W = 34;

const STEP5_DEF_CENTER = { x: 155, y: 258 };
const STEP5_ABC_CENTER = { x: 500, y: 240 };
const STEP5_SLIDER = { x: 28, y: 330, width: 200, height: 72 };
const SLIDER_SNAPS = [0.25, 0.5, 1];
/** Horizontal center of the equation text (viewBox 0–600). */
const STEP5_EQ_CENTER_X = 300;
/** Vertical center-line of the equation fractions. */
const STEP5_EQ_Y = 58;
/** Padding between equation glyphs and the auto-sized black box. */
const STEP5_EQ_PAD = 14;
/** Nudge only the black rect (not the equation). */
const STEP5_EQ_BOX_OFFSET = { x: 0, y: 0 };

const formatSideLen = (n) => {
  const rounded = Math.round(n * 100) / 100;
  if (Math.abs(rounded - Math.round(rounded)) < 0.001) {
    return String(Math.round(rounded));
  }
  return String(rounded).replace(".", decimalSymbol);
};

const getRatioDisplay = (defScaleMul) => {
  if (defScaleMul <= 0.3) return { type: "whole", value: "2" };
  if (defScaleMul <= 0.6) return { type: "whole", value: "1" };
  return { type: "frac", num: "1", den: "2" };
};

const computeStep5EquationMetrics = (pairIds, ratio) => {
  const gap = EQ_MERGED_GAP;
  const y = STEP5_EQ_Y;
  const fracHalf = EQ_BAR_W / 2;
  const ratioTail = ratio.type === "whole" ? 14 : fracHalf;

  const probe = buildMergedEquationLayout(pairIds, 0, gap);
  const leftEdge0 = probe.fractions[0].num.x - fracHalf;
  const rightEdge0 = probe.simp.num.x + ratioTail;
  const contentWidth = rightEdge0 - leftEdge0;
  const baseX = STEP5_EQ_CENTER_X - contentWidth / 2 + fracHalf;

  const layout = buildMergedEquationLayout(pairIds, baseX, gap);
  layout.y = y;
  layout.fractions.forEach((frac) => {
    frac.num.y = y - 14;
    frac.bar.y = y + 2;
    frac.den.y = y + 18;
  });
  layout.equals.forEach((eq) => {
    eq.y = y + 4;
  });
  layout.simp.num.y = y - 14;
  layout.simp.bar.y = y + 2;
  layout.simp.den.y = y + 18;

  const contentLeft = layout.fractions[0].num.x - fracHalf;
  const contentRight = layout.simp.num.x + ratioTail;
  const contentTop = y - 14;
  const contentBottom = ratio.type === "whole" ? y + 14 : y + 18;

  const box = {
    x: contentLeft - STEP5_EQ_PAD + STEP5_EQ_BOX_OFFSET.x,
    y: contentTop - STEP5_EQ_PAD + STEP5_EQ_BOX_OFFSET.y,
    width: contentRight - contentLeft + STEP5_EQ_PAD * 2,
    height: contentBottom - contentTop + STEP5_EQ_PAD * 2,
  };

  return { layout, box };
};

const getSideLengthLabelLocal = (tri, sideName, inside, labelDist) => {
  const mid = getSideMidLocal(tri, sideName);
  const centroid = tri === "abc" ? ABC_CENTROID : DEF_CENTROID;
  const dx = mid.x - centroid.x;
  const dy = mid.y - centroid.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const dist = labelDist !== undefined ? labelDist : 0.7;
  const dir = inside ? -1 : 1;
  return {
    x: mid.x + (dx / len) * dist * dir,
    y: mid.y + (dy / len) * dist * dir,
  };
};

const getSideLabelDist = (tri, scaleMul, isStep5) => {
  if (!isStep5) return 0.7;
  if (tri === "abc") return 1.05;
  const base = 0.7;
  const s = Math.max(scaleMul, 0.2);
  return base / s + (1 - s) * 0.55;
};

/** Step 5 DEF vertex labels — distance grows smoothly as triangle shrinks. */
const getStep5DefVertexLabelDist = (defScaleMul) => {
  const s = Math.max(defScaleMul, 0.2);
  return LABEL_DIST_OUTSIDE / s + (1 - s) * 0.5;
};

const polarToCartesian = (cx, cy, r, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
};

const describeArc = (x, y, radius, startAngle, endAngle) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", x, y,
    "L", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "Z",
  ].join(" ");
};

const vectorAngle = (v) => (Math.atan2(v.y, v.x) * 180) / Math.PI;

const getInnerAngleArc = (vertex, adj1, adj2) => {
  const v1 = { x: adj1.x - vertex.x, y: adj1.y - vertex.y };
  const v2 = { x: adj2.x - vertex.x, y: adj2.y - vertex.y };
  let a1 = vectorAngle(v1);
  let a2 = vectorAngle(v2);
  let diff = a2 - a1;
  while (diff <= -180) diff += 360;
  while (diff > 180) diff -= 360;
  if (diff < 0) {
    const t = a1;
    a1 = a2;
    a2 = t;
  }
  return { start: a1 + 90, end: a2 + 90 };
};

const labelPos = (vertex, centroid, dist, inside) => {
  const dx = vertex.x - centroid.x;
  const dy = vertex.y - centroid.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const dir = inside ? -1 : 1;
  return {
    x: vertex.x + (dx / len) * dist * dir,
    y: vertex.y + (dy / len) * dist * dir,
  };
};

const labelPosLerp = (vertex, centroid, t, insideDist) => {
  const outside = labelPos(vertex, centroid, LABEL_DIST_OUTSIDE, false);
  const inside = labelPos(vertex, centroid, insideDist, true);
  return {
    x: outside.x + (inside.x - outside.x) * t,
    y: outside.y + (inside.y - outside.y) * t,
  };
};

const worldPoint = (pt, center, scale, localCentroid) => ({
  x: center.x + (pt.x - localCentroid.x) * scale,
  y: center.y + (pt.y - localCentroid.y) * scale,
});

const matchCenter = (abcVtx, defVtx) => ({
  x:
    NEST_CENTER.x +
    (defVtx.x - DEF_CENTROID.x) * S -
    (abcVtx.x - ABC_CENTROID.x) * S,
  y:
    NEST_CENTER.y +
    (defVtx.y - DEF_CENTROID.y) * S -
    (abcVtx.y - ABC_CENTROID.y) * S,
});

const getAngleEqualTextWorld = (pairId, defVtx) => {
  const cfg = PAIR_CONFIG[pairId];
  let localPt;
  if (cfg.textBelow) {
    localPt = { x: defVtx.x, y: defVtx.y + 0.75 };
  } else {
    localPt = {
      x: defVtx.x + cfg.textOffset.x,
      y: defVtx.y + cfg.textOffset.y,
    };
  }
  return worldPoint(localPt, NEST_CENTER, S, DEF_CENTROID);
};

const getEqualTextForeignObjectProps = (pairId, pos) => {
  const cfg = PAIR_CONFIG[pairId];
  if (cfg.textBelow) {
    return {
      x: pos.x - 60,
      y: pos.y + 4,
      width: 120,
      height: 30,
      className: "ang-equal-fo ang-equal-fo--below",
    };
  }
  return {
    x: pos.x,
    y: pos.y - 12,
    width: 120,
    height: 30,
    className: "ang-equal-fo",
  };
};

const getEqualTextPartTargets = (pairId, pos) => {
  const fo = getEqualTextForeignObjectProps(pairId, pos);
  if (PAIR_CONFIG[pairId].textBelow) {
    return {
      abc: { x: fo.x + 24, y: fo.y + 20 },
      def: { x: fo.x + 86, y: fo.y + 20 },
    };
  }
  return {
    abc: { x: fo.x + 18, y: fo.y + 18 },
    def: { x: fo.x + 78, y: fo.y + 18 },
  };
};

const ANGLE_LABEL_PARTS = {
  1: { abc: "∠A", def: "∠D" },
  2: { abc: "∠B", def: "∠E" },
  3: { abc: "∠C", def: "∠F" },
};

const getVertexLabelWorld = (
  tri,
  letter,
  abcCenter,
  insideDistOverride,
  useOutside
) => {
  const vtx = tri === "abc" ? TRI_ABC[letter] : TRI_DEF[letter];
  const centroid = tri === "abc" ? ABC_CENTROID : DEF_CENTROID;
  const center = tri === "abc" ? abcCenter : NEST_CENTER;
  const scale = S;
  const local =
    tri === "abc"
      ? useOutside
        ? labelPos(vtx, centroid, LABEL_DIST_OUTSIDE, false)
        : labelPosLerp(
            vtx,
            centroid,
            1,
            insideDistOverride !== undefined
              ? insideDistOverride
              : LABEL_DIST_INSIDE
          )
      : labelPos(vtx, centroid, LABEL_DIST_OUTSIDE, false);
  return worldPoint(local, center, scale, centroid);
};

const lerpPt = (from, to, t) => ({
  x: from.x + (to.x - from.x) * t,
  y: from.y + (to.y - from.y) * t,
});

const getSideMidLocal = (tri, sideName) => {
  const verts = sideName
    .split("")
    .map((l) => (tri === "abc" ? TRI_ABC[l] : TRI_DEF[l]));
  return {
    x: (verts[0].x + verts[1].x) / 2,
    y: (verts[0].y + verts[1].y) / 2,
  };
};

const getSideMidWorld = (tri, sideName, abcPos, defPos, abcScale, offsetX) => {
  const local = getSideMidLocal(tri, sideName);
  const centroid = tri === "abc" ? ABC_CENTROID : DEF_CENTROID;
  const center = tri === "abc" ? abcPos : defPos;
  const scale = tri === "abc" ? abcScale : S;
  const pt = worldPoint(local, center, scale, centroid);
  return { x: pt.x + offsetX, y: pt.y };
};

const getSideLengthLabelPos = (
  tri,
  sideName,
  abcPos,
  defPos,
  abcScale,
  offsetX,
  inside
) => {
  const mid = getSideMidLocal(tri, sideName);
  const centroid = tri === "abc" ? ABC_CENTROID : DEF_CENTROID;
  const dx = mid.x - centroid.x;
  const dy = mid.y - centroid.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const dist = 0.7;
  const dir = inside ? -1 : 1;
  const local = {
    x: mid.x + (dx / len) * dist * dir,
    y: mid.y + (dy / len) * dist * dir,
  };
  const center = tri === "abc" ? abcPos : defPos;
  const scale = tri === "abc" ? abcScale : S;
  const pt = worldPoint(local, center, scale, centroid);
  return { x: pt.x + offsetX, y: pt.y };
};

const getVertexLabelWorldWithOffset = (
  tri,
  letter,
  abcCenter,
  offsetX,
  insideDistOverride,
  useOutside
) => {
  const pt = getVertexLabelWorld(
    tri,
    letter,
    abcCenter,
    insideDistOverride,
    useOutside
  );
  return { x: pt.x + offsetX, y: pt.y };
};

const getEquationLayout = (pairId, rowIndex) => {
  const cfg = SIDE_PAIR_CONFIG[pairId];
  const y = CALC_BASE_Y + rowIndex * EQ_ROW_GAP;
  const cx = CALC_BASE_X;
  const fracHalf = EQ_BAR_W / 2;
  const gap = 22;

  const lhsCx = cx;
  const eq1X = lhsCx + fracHalf + gap;
  const rhsCx = eq1X + gap + fracHalf;
  const eq2X = rhsCx + fracHalf + gap;
  const simpCx = eq2X + gap + fracHalf;

  return {
    lhsNum: { x: lhsCx, y: y - 14, text: cfg.abcSide, color: COLOR_BLUE },
    lhsBar: { x1: lhsCx - fracHalf, x2: lhsCx + fracHalf, y: y + 2 },
    lhsDen: { x: lhsCx, y: y + 18, text: cfg.defSide, color: COLOR_YELLOW },
    eq1: { x: eq1X, y: y + 4 },
    rhsNum: { x: rhsCx, y: y - 14, text: String(cfg.abcLen), color: COLOR_WHITE },
    rhsBar: { x1: rhsCx - fracHalf, x2: rhsCx + fracHalf, y: y + 2 },
    rhsDen: { x: rhsCx, y: y + 18, text: String(cfg.defLen), color: COLOR_WHITE },
    eq2: { x: eq2X, y: y + 4 },
    simpNum: { x: simpCx, y: y - 14, text: String(cfg.simpNum), color: COLOR_WHITE },
    simpBar: { x1: simpCx - fracHalf, x2: simpCx + fracHalf, y: y + 2 },
    simpDen: { x: simpCx, y: y + 18, text: String(cfg.simpDen), color: COLOR_WHITE },
    rhsBox: {
      x: rhsCx - fracHalf - 10,
      y: y - 30,
      width: EQ_BAR_W + 20,
      height: 62,
    },
    collapsedEq2: { x: eq1X + gap + fracHalf, y: y + 4 },
    collapsedSimpCx: eq1X + gap + fracHalf + gap + fracHalf,
  };
};

const buildMergedEquationLayout = (pairIds, baseX, gap) => {
  const y = CALC_BASE_Y;
  const fracHalf = EQ_BAR_W / 2;
  let pos = baseX;
  const fractions = [];
  const equals = [];

  pairIds.forEach((pairId) => {
    const cfg = SIDE_PAIR_CONFIG[pairId];
    const fracCx = pos;
    fractions.push({
      pairId,
      num: { x: fracCx, y: y - 14, text: cfg.abcSide, color: COLOR_BLUE },
      bar: { x1: fracCx - fracHalf, x2: fracCx + fracHalf, y: y + 2 },
      den: { x: fracCx, y: y + 18, text: cfg.defSide, color: COLOR_YELLOW },
    });
    pos = fracCx + fracHalf + gap;
    equals.push({ x: pos, y: y + 4 });
    pos = pos + gap + fracHalf;
  });

  const simpCx = pos;
  return {
    y,
    fractions,
    equals,
    simp: {
      num: { x: simpCx, y: y - 14, text: "1", color: COLOR_WHITE },
      bar: { x1: simpCx - fracHalf, x2: simpCx + fracHalf, y: y + 2 },
      den: { x: simpCx, y: y + 18, text: "2", color: COLOR_WHITE },
    },
  };
};

const getFullMergedEquationLayout = (pairIds) =>
  buildMergedEquationLayout(pairIds, CALC_BASE_X, EQ_MERGED_GAP);

const getMergedEquationLayout = (pairId1, pairId2) => {
  const full = getFullMergedEquationLayout([pairId1, pairId2]);
  return {
    y: full.y,
    frac1: full.fractions[0],
    eq1: full.equals[0],
    frac2: full.fractions[1],
    eq2: full.equals[1],
    simp: full.simp,
  };
};

const getLetterTargetsInLabel = (sideName, center) => {
  const letters = sideName.split("");
  const letterSpacing = 13;
  const startX = center.x - ((letters.length - 1) * letterSpacing) / 2;
  return letters.map((letter, i) => ({
    letter,
    x: startX + i * letterSpacing,
    y: center.y,
  }));
};

const DEFAULT_EQ_ANIM = {
  simpOpacity: 1,
  simpOffsetX: 0,
  middleOpacity: 1,
  eq2Opacity: 1,
  simpCollapseX: 0,
};

const MainCanvas = (props) => {
  const {
    step,
    onSetNextEnabled,
    onUpdateTexts,
    onNext,
    onRegisterNudgeTarget,
    onHideNudge,
  } = props;
  const { useState, useEffect, useLayoutEffect, useRef, useCallback } = React;

  const abcGroupRef = useRef(null);
  const defGroupRef = useRef(null);
  const actionBtnRef = useRef(null);
  const sliderRef = useRef(null);
  const animatingRef = useRef(false);
  const hotspotAnimRef = useRef([]);
  const step5EntryTweenRef = useRef(null);
  const step5RatioBlinkTweenRef = useRef(null);
  const layoutSnapshotRef = useRef({
    diagramOffsetX: 0,
    abcPos: NEST_CENTER,
    defPos: NEST_CENTER,
  });

  const blankNavText = useCallback(() => {
    onUpdateTexts(undefined, " ");
  }, [onUpdateTexts]);

  const blinkStep5Ratio = useCallback(() => {
    if (step5RatioBlinkTweenRef.current) {
      step5RatioBlinkTweenRef.current.kill();
      step5RatioBlinkTweenRef.current = null;
    }
    setRatioSliderBlink(false);
    requestAnimationFrame(() => {
      setRatioBlinkKey((k) => k + 1);
      setRatioSliderBlink(true);
      step5RatioBlinkTweenRef.current = gsap.delayedCall(1, () => {
        setRatioSliderBlink(false);
        step5RatioBlinkTweenRef.current = null;
      });
    });
  }, []);

  const [layout, setLayout] = useState("sideBySide");
  const [colorsOn, setColorsOn] = useState(false);
  const [labelInsideProgress, setLabelInsideProgress] = useState(0);
  const [labelDimmed, setLabelDimmed] = useState(false);
  const [recapDone, setRecapDone] = useState(false);
  const [showRecapText, setShowRecapText] = useState(false);
  const [actionBtn, setActionBtn] = useState("recap");
  const [actionDisabled, setActionDisabled] = useState(false);
  const [abcPos, setAbcPos] = useState(SIDE_ABC_CENTER);
  const [defPos, setDefPos] = useState(SIDE_DEF_CENTER);
  const [abcScaleMul, setAbcScaleMul] = useState(1);
  const [defScaleMul, setDefScaleMul] = useState(1);
  const [displayDefScale, setDisplayDefScale] = useState(1);
  const [sliderIndex, setSliderIndex] = useState(2);
  const [ratioSliderBlink, setRatioSliderBlink] = useState(false);
  const [ratioBlinkKey, setRatioBlinkKey] = useState(0);
  const [abcScaleTweening, setAbcScaleTweening] = useState(false);
  const [exploredScales, setExploredScales] = useState({});
  const [exploredPairs, setExploredPairs] = useState({});
  const [visibleHotspots, setVisibleHotspots] = useState({});
  const [dehighlight, setDehighlight] = useState(null);
  const [persistedArcs, setPersistedArcs] = useState([]);
  const [tempArcs, setTempArcs] = useState(null);
  const [tempArcReveal, setTempArcReveal] = useState({
    opacity: 0,
    labelShift: 0,
  });
  const [tempEqualText, setTempEqualText] = useState(null);
  const [equalTextBorderBlink, setEqualTextBorderBlink] = useState(false);
  const [angleTextFly, setAngleTextFly] = useState(null);
  const [allExplored, setAllExplored] = useState(false);

  const [sideHotspots, setSideHotspots] = useState({});
  const [sidePairsDone, setSidePairsDone] = useState({});
  const [diagramOffsetX, setDiagramOffsetX] = useState(0);
  const [sideDehighlight, setSideDehighlight] = useState(null);
  const [sideLengthLabels, setSideLengthLabels] = useState(null);
  const [showCompareBtn, setShowCompareBtn] = useState(false);
  const [activeSidePair, setActiveSidePair] = useState(null);
  const [finishedEquations, setFinishedEquations] = useState([]);
  const [equationState, setEquationState] = useState(null);
  const [sideFlyClones, setSideFlyClones] = useState([]);
  const [showFractionBox, setShowFractionBox] = useState(false);
  const [persistedSideLengths, setPersistedSideLengths] = useState([]);
  const [mergedEquation, setMergedEquation] = useState(null);
  const [mergeState, setMergeState] = useState(null);
  const [thirdFracAnim, setThirdFracAnim] = useState(null);
  const [step4Complete, setStep4Complete] = useState(false);

  const playSnd = (snd) => {
    if (typeof playSound === "function") playSound(snd);
  };

  const getSideOpacity = (tri, sideName) => {
    const dh = step === 4 ? sideDehighlight : dehighlight;
    if (!dh) return 1;
    if (tri === "abc" && dh.fadeSidesAbc.includes(sideName)) return 0.2;
    if (tri === "def" && dh.fadeSidesDef.includes(sideName)) return 0.2;
    return 1;
  };

  const getLabelOpacity = (label) => {
    if (labelDimmed) return 0.2;
    const dh = step === 4 ? sideDehighlight : dehighlight;
    if (dh && dh.fadeLabels.includes(label)) return 0.2;
    return 1;
  };

  const getStrokeColor = (tri) => {
    if (!colorsOn) return COLOR_WHITE;
    return tri === "abc" ? COLOR_BLUE : COLOR_YELLOW;
  };

  const getLabelColor = (tri) => {
    if (!colorsOn) return COLOR_WHITE;
    return tri === "abc" ? COLOR_BLUE : COLOR_YELLOW;
  };

  const updateNudgeTarget = useCallback(() => {
    if (step === 3 || step === 4 || step === 5) {
      onRegisterNudgeTarget(null);
      return;
    }
    if (
      actionBtnRef.current &&
      (step === 1 || step === 2) &&
      actionBtn &&
      !actionDisabled
    ) {
      onRegisterNudgeTarget(actionBtnRef.current.getBoundingClientRect());
    } else {
      onRegisterNudgeTarget(null);
    }
  }, [
    step,
    actionBtn,
    actionDisabled,
    onRegisterNudgeTarget,
  ]);

  useEffect(() => {
    if (step !== 2 || actionBtn !== "summarize") return undefined;
    const register = () => updateNudgeTarget();
    const tid1 = setTimeout(register, 50);
    const tid2 = setTimeout(register, 350);
    return () => {
      clearTimeout(tid1);
      clearTimeout(tid2);
    };
  }, [step, actionBtn, updateNudgeTarget]);

  useEffect(() => {
    const tid = setTimeout(updateNudgeTarget, 100);
    window.addEventListener("resize", updateNudgeTarget);
    return () => {
      clearTimeout(tid);
      window.removeEventListener("resize", updateNudgeTarget);
    };
  }, [updateNudgeTarget, actionBtn, actionDisabled, allExplored, step]);

  const animateHotspotsIn = useCallback((hotspotMap, prefix) => {
    hotspotAnimRef.current.forEach((tl) => tl.kill());
    hotspotAnimRef.current = [];

    Object.keys(hotspotMap).forEach((id) => {
      if (!hotspotMap[id]) return;

      const rings = [
        {
          el: document.getElementById(`${prefix}-${id}-outer`),
          target: HOTSPOT_OPACITY.outer,
          delay: 0,
        },
        {
          el: document.getElementById(`${prefix}-${id}-mid`),
          target: HOTSPOT_OPACITY.mid,
          delay: 0.12,
        },
        {
          el: document.getElementById(`${prefix}-${id}-center`),
          target: HOTSPOT_OPACITY.center,
          delay: 0.24,
        },
      ];

      rings.forEach(({ el, target, delay }) => {
        if (!el) return;
        gsap.killTweensOf(el);
        gsap.set(el, { opacity: 0 });

        const tl = gsap.timeline({ delay });
        tl.to(el, {
          opacity: target,
          duration: 1,
          ease: "power2.out",
        });
        tl.to(el, {
          opacity: target + HOTSPOT_PULSE_BOOST,
          duration: 1.3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
        hotspotAnimRef.current.push(tl);
      });
    });
  }, []);

  useEffect(() => {
    if (step !== 2 && step !== 4) {
      hotspotAnimRef.current.forEach((tl) => tl.kill());
      hotspotAnimRef.current = [];
      return;
    }

    const hotspotMap = step === 2 ? visibleHotspots : sideHotspots;
    const prefix = step === 2 ? "hotspot" : "side-hotspot";
    const active = Object.keys(hotspotMap).some((k) => hotspotMap[k]);
    if (!active) {
      hotspotAnimRef.current.forEach((tl) => tl.kill());
      hotspotAnimRef.current = [];
      return;
    }

    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => animateHotspotsIn(hotspotMap, prefix));
    });

    return () => {
      cancelAnimationFrame(raf);
    };
  }, [visibleHotspots, sideHotspots, step, animateHotspotsIn]);

  useEffect(() => {
    if (step === 2) {
      setShowRecapText(false);
      setActionBtn(null);
      setVisibleHotspots({ 1: true, 2: true, 3: true });
      setLayout("nested");
      setColorsOn(true);
      setLabelInsideProgress(1);
      setAbcPos(NEST_CENTER);
      setDefPos(NEST_CENTER);
      setAbcScaleMul(1);
      setTempArcReveal({ opacity: 0, labelShift: 0 });
      onUpdateTexts(APP_DATA.steps[2].questionText, APP_DATA.steps[2].navText);
    }
    if (step === 3) {
      setActionBtn(null);
      setShowRecapText(false);
      onUpdateTexts(APP_DATA.steps[3].questionText, APP_DATA.steps[3].navText);
      onSetNextEnabled(true);
      onRegisterNudgeTarget(null);
    }
    if (step === 4) {
      setActionBtn(null);
      setShowRecapText(false);
      setPersistedArcs([]);
      setTempArcs(null);
      setTempArcReveal({ opacity: 0, labelShift: 0 });
      setTempEqualText(null);
      setAngleTextFly(null);
      setExploredPairs({});
      setAllExplored(false);
      setDehighlight(null);
      setLabelDimmed(false);
      setVisibleHotspots({});
      setSideHotspots({ 1: true, 2: true, 3: true });
      setSidePairsDone({});
      setDiagramOffsetX(0);
      setSideDehighlight(null);
      setSideLengthLabels(null);
      setShowCompareBtn(false);
      setActiveSidePair(null);
      setFinishedEquations([]);
      setEquationState(null);
      setSideFlyClones([]);
      setShowFractionBox(false);
      setPersistedSideLengths([]);
      setMergedEquation(null);
      setMergeState(null);
      setThirdFracAnim(null);
      setStep4Complete(false);
      setLayout("nested");
      setColorsOn(true);
      setLabelInsideProgress(1);
      setAbcPos(NEST_CENTER);
      setDefPos(NEST_CENTER);
      setAbcScaleMul(1);
      onUpdateTexts(APP_DATA.steps[4].questionText, APP_DATA.steps[4].navText);
      onSetNextEnabled(false);
      onRegisterNudgeTarget(null);

      const labelAnim = { progress: 1 };
      setLabelInsideProgress(1);
      requestAnimationFrame(() => {
        gsap.to(labelAnim, {
          progress: 0,
          duration: 0.9,
          ease: "power2.inOut",
          onUpdate: () => setLabelInsideProgress(labelAnim.progress),
        });
      });
    }
  }, [step]);

  useLayoutEffect(() => {
    if (step !== 5) return undefined;

    setActionBtn(null);
    setShowRecapText(false);
    setStep4Complete(false);
    setSideHotspots({});
    setShowCompareBtn(false);
    setActiveSidePair(null);
    setEquationState(null);
    setShowFractionBox(false);
    setMergeState(null);
    setThirdFracAnim(null);
    setFinishedEquations([]);
    setSideFlyClones([]);
    setColorsOn(true);
    setLabelInsideProgress(0);
    setAbcScaleMul(1);
    setDefScaleMul(1);
    setDisplayDefScale(1);
    setSliderIndex(2);
    setRatioSliderBlink(false);
    setExploredScales({ 1: true });
    setMergedEquation((prev) =>
      prev && prev.pairIds.length === 3 ? prev : { pairIds: [3, 2, 1] }
    );
    setPersistedSideLengths([{ pairId: 1 }, { pairId: 2 }, { pairId: 3 }]);
    onUpdateTexts(APP_DATA.steps[5].questionText, APP_DATA.steps[5].navText);
    onSetNextEnabled(false);
    onRegisterNudgeTarget(null);

    const { diagramOffsetX: startOffset, abcPos: fromAbc, defPos: fromDef } =
      layoutSnapshotRef.current;

    const entryAnim = {
      abcX: fromAbc.x,
      abcY: fromAbc.y,
      defX: fromDef.x,
      defY: fromDef.y,
    };

    if (step5EntryTweenRef.current) {
      step5EntryTweenRef.current.kill();
      step5EntryTweenRef.current = null;
    }

    step5EntryTweenRef.current = gsap.to(entryAnim, {
      abcX: STEP5_ABC_CENTER.x - startOffset,
      abcY: STEP5_ABC_CENTER.y,
      defX: STEP5_DEF_CENTER.x - startOffset,
      defY: STEP5_DEF_CENTER.y,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => {
        setAbcPos({ x: entryAnim.abcX, y: entryAnim.abcY });
        setDefPos({ x: entryAnim.defX, y: entryAnim.defY });
      },
      onComplete: () => {
        step5EntryTweenRef.current = null;
        setDiagramOffsetX(0);
        setAbcPos({ x: STEP5_ABC_CENTER.x, y: STEP5_ABC_CENTER.y });
        setDefPos({ x: STEP5_DEF_CENTER.x, y: STEP5_DEF_CENTER.y });
      },
    });

    return () => {
      if (step5EntryTweenRef.current) {
        step5EntryTweenRef.current.kill();
        step5EntryTweenRef.current = null;
      }
      if (step5RatioBlinkTweenRef.current) {
        step5RatioBlinkTweenRef.current.kill();
        step5RatioBlinkTweenRef.current = null;
      }
    };
  }, [step, onUpdateTexts, onSetNextEnabled, onRegisterNudgeTarget]);

  const runRecapAnimation = () => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    blankNavText();
    setActionDisabled(true);
    onHideNudge();
    playSnd("click");

    const labelAnim = { progress: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        animatingRef.current = false;
        setLabelInsideProgress(1);
        setRecapDone(true);
        setShowRecapText(true);
        setActionBtn("explore");
        setActionDisabled(false);
        onUpdateTexts(
          APP_DATA.steps[1].questionText,
          APP_DATA.steps[1].navExplore
        );
        setTimeout(updateNudgeTarget, 100);
      },
    });

    tl.to(
      {},
      {
        duration: 0.9,
        onStart: () => {
          setLayout("nested");
          setAbcPos(NEST_CENTER);
          setDefPos(NEST_CENTER);
          setColorsOn(true);
        },
      },
      0
    );

    tl.to(
      labelAnim,
      {
        progress: 1,
        duration: 0.9,
        ease: "power2.inOut",
        onUpdate: () => setLabelInsideProgress(labelAnim.progress),
      },
      0
    );

    tl.to({}, { duration: 0.2 });

    const scaleAnim = { m: 1 };
    tl.to(scaleAnim, {
      m: 2,
      duration: 0.9,
      ease: "power2.inOut",
      onStart: () => {
        setAbcScaleTweening(true);
        setLabelDimmed(true);
      },
      onUpdate: () => setAbcScaleMul(scaleAnim.m),
    });

    tl.to({}, { duration: 0.5 });

    tl.to(scaleAnim, {
      m: 1,
      duration: 0.9,
      ease: "power2.inOut",
      onUpdate: () => setAbcScaleMul(scaleAnim.m),
      onComplete: () => {
        setAbcScaleMul(1);
        setAbcScaleTweening(false);
        setLabelDimmed(false);
      },
    });
  };

  const handleRecapClick = () => {
    if (actionDisabled || recapDone) return;
    onHideNudge();
    onRegisterNudgeTarget(null);
    runRecapAnimation();
  };

  const handleExploreAnglesClick = () => {
    if (actionDisabled) return;
    playSnd("click");
    onHideNudge();
    onRegisterNudgeTarget(null);
    onNext(2);
  };

  const handleSummarizeClick = () => {
    if (actionDisabled) return;
    playSnd("click");
    onHideNudge();
    onRegisterNudgeTarget(null);
    onNext(3);
  };

  const runFlyPairStep = (
    tl,
    from1,
    from2,
    to1,
    to2,
    letter1,
    letter2,
    color1,
    color2
  ) => {
    const fly = { t: 0 };
    tl.to(fly, {
      t: 1,
      duration: 0.55,
      ease: "power2.inOut",
      onStart: () => {
        setSideFlyClones([
          { text: letter1, color: color1, x: from1.x, y: from1.y, opacity: 1 },
          { text: letter2, color: color2, x: from2.x, y: from2.y, opacity: 1 },
        ]);
      },
      onUpdate: () => {
        const pos1 = lerpPt(from1, to1, fly.t);
        const pos2 = lerpPt(from2, to2, fly.t);
        setSideFlyClones([
          { text: letter1, color: color1, x: pos1.x, y: pos1.y, opacity: 1 },
          { text: letter2, color: color2, x: pos2.x, y: pos2.y, opacity: 1 },
        ]);
      },
      onComplete: () => setSideFlyClones([]),
    });
  };

  const runFlyStep = (tl, from, to, text, color) => {
    const fly = { t: 0 };
    tl.to(fly, {
      t: 1,
      duration: 0.5,
      ease: "power2.inOut",
      onStart: () => {
        setSideFlyClones([{ text, color, x: from.x, y: from.y, opacity: 1 }]);
      },
      onUpdate: () => {
        const pos = lerpPt(from, to, fly.t);
        setSideFlyClones([{ text, color, x: pos.x, y: pos.y, opacity: 1 }]);
      },
      onComplete: () => setSideFlyClones([]),
    });
  };

  const getEmptyEqParts = () => ({
    lhsNum: false,
    lhsBar: false,
    lhsDen: false,
    eq1: false,
    rhsNum: false,
    rhsBar: false,
    rhsDen: false,
    eq2: false,
    simpNum: false,
    simpBar: false,
    simpDen: false,
  });

  const appendCompareAnimation = (tl, pairId, rowIndex) => {
    const cfg = SIDE_PAIR_CONFIG[pairId];
    const layout = getEquationLayout(pairId, rowIndex);
    const offsetX = diagramOffsetX;

    tl.add(() => {
      setEquationState({
        pairId,
        rowIndex,
        parts: getEmptyEqParts(),
        showSimp: false,
        anim: { ...DEFAULT_EQ_ANIM },
      });
    });

    const abcLabelsOutside = step >= 4;

    const fromA = getVertexLabelWorldWithOffset(
      "abc",
      cfg.abcVerts[0],
      abcPos,
      offsetX,
      undefined,
      abcLabelsOutside
    );
    const fromB = getVertexLabelWorldWithOffset(
      "abc",
      cfg.abcVerts[1],
      abcPos,
      offsetX,
      undefined,
      abcLabelsOutside
    );
    const fromD = getVertexLabelWorldWithOffset(
      "def",
      cfg.defVerts[0],
      abcPos,
      offsetX
    );
    const fromE = getVertexLabelWorldWithOffset(
      "def",
      cfg.defVerts[1],
      abcPos,
      offsetX
    );
    const fromLenAbc = getSideLengthLabelPos(
      "abc",
      cfg.abcSide,
      abcPos,
      defPos,
      effectiveAbcScale,
      offsetX,
      true
    );
    const fromLenDef = getSideLengthLabelPos(
      "def",
      cfg.defSide,
      abcPos,
      defPos,
      effectiveAbcScale,
      offsetX,
      false
    );

    const showPart = (key) => {
      setEquationState((prev) => ({
        ...prev,
        parts: { ...prev.parts, [key]: true },
      }));
    };

    const lhsLetterTargets = getLetterTargetsInLabel(cfg.abcSide, layout.lhsNum);
    const lhsDenLetterTargets = getLetterTargetsInLabel(
      cfg.defSide,
      layout.lhsDen
    );

    runFlyPairStep(
      tl,
      fromA,
      fromB,
      lhsLetterTargets[0],
      lhsLetterTargets[1],
      cfg.abcVerts[0],
      cfg.abcVerts[1],
      COLOR_BLUE,
      COLOR_BLUE
    );
    tl.add(() => showPart("lhsNum"));
    tl.to({}, { duration: 0.15 });
    tl.add(() => showPart("lhsBar"));
    tl.to({}, { duration: 0.2 });
    runFlyPairStep(
      tl,
      fromD,
      fromE,
      lhsDenLetterTargets[0],
      lhsDenLetterTargets[1],
      cfg.defVerts[0],
      cfg.defVerts[1],
      COLOR_YELLOW,
      COLOR_YELLOW
    );
    tl.add(() => showPart("lhsDen"));
    tl.to({}, { duration: 0.15 });
    tl.add(() => showPart("eq1"));
    tl.to({}, { duration: 0.2 });
    runFlyStep(
      tl,
      fromLenAbc,
      layout.rhsNum,
      String(cfg.abcLen),
      COLOR_WHITE
    );
    tl.add(() => showPart("rhsNum"));
    tl.to({}, { duration: 0.1 });
    tl.add(() => showPart("rhsBar"));
    tl.to({}, { duration: 0.15 });
    runFlyStep(
      tl,
      fromLenDef,
      layout.rhsDen,
      String(cfg.defLen),
      COLOR_WHITE
    );
    tl.add(() => showPart("rhsDen"));
  };

  const appendFractionSimplify = (tl, pairId, rowIndex, onFinished) => {
    const layout = getEquationLayout(pairId, rowIndex);
    const simpDelta = layout.simpNum.x - layout.rhsNum.x;
    const eqAnim = {
      simpOpacity: 0,
      simpOffsetX: -28,
      middleOpacity: 1,
      eq2Opacity: 0,
      simpCollapseX: 0,
    };

    tl.add(() => {
      setEquationState((prev) => ({
        ...prev,
        showSimp: true,
        parts: {
          ...prev.parts,
          eq2: true,
          simpNum: true,
          simpBar: true,
          simpDen: true,
        },
        anim: { ...eqAnim },
      }));
    });

    tl.to(eqAnim, {
      simpOpacity: 1,
      simpOffsetX: 0,
      eq2Opacity: 1,
      duration: 0.65,
      ease: "power2.out",
      onUpdate: () => {
        setEquationState((prev) => ({
          ...prev,
          anim: { ...eqAnim },
        }));
      },
    });

    tl.to({}, { duration: 1 });

    tl.to(eqAnim, {
      middleOpacity: 0,
      duration: 0.55,
      ease: "power2.in",
      onUpdate: () => {
        setEquationState((prev) => ({
          ...prev,
          anim: { ...eqAnim },
        }));
      },
    });

    tl.to(eqAnim, {
      eq2Opacity: 0,
      duration: 0.35,
      ease: "power2.in",
      onUpdate: () => {
        setEquationState((prev) => ({
          ...prev,
          anim: { ...eqAnim },
        }));
      },
    });

    tl.to(eqAnim, {
      simpCollapseX: -simpDelta,
      duration: 0.7,
      ease: "power2.inOut",
      onUpdate: () => {
        setEquationState((prev) => ({
          ...prev,
          anim: { ...eqAnim },
        }));
      },
    });

    tl.add(() => {
      setFinishedEquations((prev) => [...prev, { pairId, collapsed: true }]);
      setPersistedSideLengths((prev) =>
        prev.some((p) => p.pairId === pairId)
          ? prev
          : [...prev, { pairId }]
      );
      setEquationState(null);
      if (onFinished) onFinished();
    });
  };

  const appendMergeAnimation = (tl, pairId1, pairId2) => {
    const layout2 = getEquationLayout(pairId2, 1);
    const merged = getMergedEquationLayout(pairId1, pairId2);
    const row2TargetX = merged.frac2.num.x - layout2.lhsNum.x;
    const row2TargetY = -EQ_ROW_GAP;

    const mergeAnim = {
      blinkOpacity: 1,
      eq1SimpOpacity: 1,
      row2OffsetX: 0,
      row2OffsetY: 0,
    };

    tl.add(() => {
      setMergeState({
        pairId1,
        pairId2,
        anim: { ...mergeAnim },
      });
    });

    tl.to(mergeAnim, {
      blinkOpacity: 0.25,
      duration: 0.22,
      ease: "power1.inOut",
      repeat: 5,
      yoyo: true,
      onUpdate: () => {
        setMergeState((prev) =>
          prev ? { ...prev, anim: { ...mergeAnim } } : prev
        );
      },
    });

    tl.to(mergeAnim, {
      blinkOpacity: 1,
      duration: 0.1,
      onUpdate: () => {
        setMergeState((prev) =>
          prev ? { ...prev, anim: { ...mergeAnim } } : prev
        );
      },
    });

    tl.to(mergeAnim, {
      eq1SimpOpacity: 0,
      duration: 0.28,
      ease: "power2.in",
      onUpdate: () => {
        setMergeState((prev) =>
          prev ? { ...prev, anim: { ...mergeAnim } } : prev
        );
      },
    });

    tl.to(
      mergeAnim,
      {
        row2OffsetX: row2TargetX,
        row2OffsetY: row2TargetY,
        duration: 0.85,
        ease: "power2.inOut",
        onUpdate: () => {
          setMergeState((prev) =>
            prev ? { ...prev, anim: { ...mergeAnim } } : prev
          );
        },
      },
      "-=0.05"
    );

    tl.add(() => {
      setMergedEquation({ pairIds: [pairId1, pairId2] });
      setFinishedEquations([]);
      setMergeState(null);
    });
  };

  const runCompareAnimation = () => {
    if (animatingRef.current || !activeSidePair) return;
    animatingRef.current = true;
    blankNavText();
    onHideNudge();
    onRegisterNudgeTarget(null);
    playSnd("click");
    setShowCompareBtn(false);

    const rowIndex = finishedEquations.length;
    const tl = gsap.timeline({
      onComplete: () => {
        animatingRef.current = false;
        setShowFractionBox(true);
        onUpdateTexts(undefined, APP_DATA.steps[4].navSimplify);
        setTimeout(updateNudgeTarget, 150);
      },
    });

    appendCompareAnimation(tl, activeSidePair, rowIndex);
  };

  const runSideHotspotAnimation = (pairId) => {
    if (animatingRef.current) return;
    if (Object.keys(sidePairsDone).length > 0) return;
    if (activeSidePair) return;

    animatingRef.current = true;
    blankNavText();
    onHideNudge();
    playSnd("click");

    const cfg = SIDE_PAIR_CONFIG[pairId];
    setSideHotspots({});
    setActiveSidePair(pairId);
    setSideDehighlight({
      fadeSidesAbc: cfg.fadeSidesAbc,
      fadeSidesDef: cfg.fadeSidesDef,
      fadeLabels: cfg.fadeLabels,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        animatingRef.current = false;
        setShowCompareBtn(true);
        onUpdateTexts(undefined, APP_DATA.steps[4].navCompare);
        setTimeout(updateNudgeTarget, 150);
      },
    });

    tl.to({}, {
      duration: 0.35,
      onStart: () => {
        setSideLengthLabels({ pairId, visible: true });
      },
    });

    tl.to(
      { x: 0 },
      {
        x: DIAGRAM_SHIFT_LEFT,
        duration: 0.85,
        ease: "power2.inOut",
        onUpdate: function () {
          setDiagramOffsetX(this.targets()[0].x);
        },
      },
      0.15
    );
  };

  const runFractionBoxClick = () => {
    if (animatingRef.current || !equationState || !activeSidePair) return;
    animatingRef.current = true;
    blankNavText();
    onHideNudge();
    onRegisterNudgeTarget(null);
    playSnd("click");
    setShowFractionBox(false);

    const pairId = activeSidePair;
    const rowIndex = equationState.rowIndex ?? finishedEquations.length;

    const tl = gsap.timeline({
      onComplete: () => {
        animatingRef.current = false;
      },
    });

    appendFractionSimplify(tl, pairId, rowIndex, () => {
      setSideDehighlight(null);
      setSideLengthLabels(null);

      setSidePairsDone((prev) => {
        const newDone = { ...prev, [pairId]: true };
        const remaining = {};
        [1, 2, 3].forEach((p) => {
          if (!newDone[p]) remaining[p] = true;
        });
        setSideHotspots(remaining);
        return newDone;
      });

      setActiveSidePair(null);
      onUpdateTexts(undefined, APP_DATA.steps[4].navText);
    });
  };

  const runSecondSideHotspotAnimation = (pairId) => {
    if (animatingRef.current || activeSidePair) return;
    const doneCount = Object.keys(sidePairsDone).length;
    if (doneCount !== 1) return;

    const firstPairId = finishedEquations[0].pairId;
    const rowIndex = finishedEquations.length;

    animatingRef.current = true;
    blankNavText();
    onHideNudge();
    playSnd("click");

    const cfg = SIDE_PAIR_CONFIG[pairId];
    setSideHotspots({});
    setActiveSidePair(pairId);
    setSideDehighlight({
      fadeSidesAbc: cfg.fadeSidesAbc,
      fadeSidesDef: cfg.fadeSidesDef,
      fadeLabels: cfg.fadeLabels,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        animatingRef.current = false;
      },
    });

    tl.to({}, {
      duration: 0.35,
      onStart: () => {
        setSideLengthLabels({ pairId, visible: true });
      },
    });

    tl.to({}, { duration: 0.5 });

    appendCompareAnimation(tl, pairId, rowIndex);
    tl.to({}, { duration: 0.5 });
    appendFractionSimplify(tl, pairId, rowIndex);
    appendMergeAnimation(tl, firstPairId, pairId);

    tl.add(() => {
      setSideDehighlight(null);
      setSideLengthLabels(null);

      setSidePairsDone((prev) => {
        const newDone = { ...prev, [pairId]: true };
        const remaining = {};
        [1, 2, 3].forEach((p) => {
          if (!newDone[p]) remaining[p] = true;
        });
        setSideHotspots(remaining);
        return newDone;
      });

      setActiveSidePair(null);
      onUpdateTexts(undefined, APP_DATA.steps[4].navText);
    });
  };

  const handleSideHotspotClick = (pairId) => {
    if (animatingRef.current || activeSidePair) return;
    if (sidePairsDone[pairId]) return;

    const doneCount = Object.keys(sidePairsDone).length;
    if (doneCount === 0) {
      runSideHotspotAnimation(pairId);
    } else if (doneCount === 1) {
      runSecondSideHotspotAnimation(pairId);
    } else if (doneCount === 2 && mergedEquation) {
      runThirdSideHotspotAnimation(pairId);
    }
  };

  const runThirdSideHotspotAnimation = (pairId) => {
    if (animatingRef.current || activeSidePair || !mergedEquation) return;
    if (mergedEquation.pairIds.length !== 2) return;

    const [pairId1, pairId2] = mergedEquation.pairIds;
    const cfg = SIDE_PAIR_CONFIG[pairId];
    const layout2 = getFullMergedEquationLayout([pairId1, pairId2]);
    const layout3 = getFullMergedEquationLayout([pairId1, pairId2, pairId]);
    const trailingStartX = layout2.equals[1].x - layout3.equals[2].x;

    animatingRef.current = true;
    blankNavText();
    onHideNudge();
    playSnd("click");

    setSideHotspots({});
    setActiveSidePair(pairId);
    setSideDehighlight({
      fadeSidesAbc: cfg.fadeSidesAbc,
      fadeSidesDef: cfg.fadeSidesDef,
      fadeLabels: cfg.fadeLabels,
    });

    const anim = {
      trailingShiftX: trailingStartX,
      parts: { eq2: false, bar: false, num: false, den: false },
    };

    const tl = gsap.timeline({
      onComplete: () => {
        animatingRef.current = false;
      },
    });

    tl.to({}, {
      duration: 0.35,
      onStart: () => {
        setSideLengthLabels({ pairId, visible: true });
      },
    });

    tl.to({}, { duration: 0.5 });

    tl.add(() => {
      setThirdFracAnim({
        pairIds: [pairId1, pairId2],
        pairId3: pairId,
        anim: { ...anim },
      });
    });

    tl.to(anim, {
      trailingShiftX: 0,
      duration: 0.65,
      ease: "power2.inOut",
      onStart: () => {
        anim.parts.eq2 = true;
        setThirdFracAnim((prev) =>
          prev
            ? {
                ...prev,
                anim: { ...anim, parts: { ...anim.parts } },
              }
            : prev
        );
      },
      onUpdate: () => {
        setThirdFracAnim((prev) =>
          prev ? { ...prev, anim: { ...anim, parts: { ...anim.parts } } } : prev
        );
      },
    });

    tl.add(() => {
      anim.parts.bar = true;
      setThirdFracAnim((prev) =>
        prev ? { ...prev, anim: { ...anim, parts: { ...anim.parts } } } : prev
      );
    });
    tl.to({}, { duration: 0.2 });

    const frac3 = layout3.fractions[2];
    const lhsLetterTargets = getLetterTargetsInLabel(
      cfg.abcSide,
      frac3.num
    );
    const lhsDenLetterTargets = getLetterTargetsInLabel(
      cfg.defSide,
      frac3.den
    );
    const abcLabelsOutside = step >= 4;

    const fromA = getVertexLabelWorldWithOffset(
      "abc",
      cfg.abcVerts[0],
      abcPos,
      diagramOffsetX,
      undefined,
      abcLabelsOutside
    );
    const fromB = getVertexLabelWorldWithOffset(
      "abc",
      cfg.abcVerts[1],
      abcPos,
      diagramOffsetX,
      undefined,
      abcLabelsOutside
    );
    const fromD = getVertexLabelWorldWithOffset(
      "def",
      cfg.defVerts[0],
      abcPos,
      diagramOffsetX
    );
    const fromE = getVertexLabelWorldWithOffset(
      "def",
      cfg.defVerts[1],
      abcPos,
      diagramOffsetX
    );

    runFlyPairStep(
      tl,
      fromA,
      fromB,
      lhsLetterTargets[0],
      lhsLetterTargets[1],
      cfg.abcVerts[0],
      cfg.abcVerts[1],
      COLOR_BLUE,
      COLOR_BLUE
    );
    tl.add(() => {
      anim.parts.num = true;
      setThirdFracAnim((prev) =>
        prev ? { ...prev, anim: { ...anim, parts: { ...anim.parts } } } : prev
      );
    });
    tl.to({}, { duration: 0.1 });
    runFlyPairStep(
      tl,
      fromD,
      fromE,
      lhsDenLetterTargets[0],
      lhsDenLetterTargets[1],
      cfg.defVerts[0],
      cfg.defVerts[1],
      COLOR_YELLOW,
      COLOR_YELLOW
    );
    tl.add(() => {
      anim.parts.den = true;
      setThirdFracAnim((prev) =>
        prev ? { ...prev, anim: { ...anim, parts: { ...anim.parts } } } : prev
      );
    });

    tl.add(() => {
      setThirdFracAnim(null);
      const allPairIds = [pairId1, pairId2, pairId];
      setMergedEquation({ pairIds: allPairIds });
      setPersistedSideLengths(
        allPairIds.map((id) => ({ pairId: id }))
      );
      setSideDehighlight(null);
      setSideLengthLabels(null);
      setSidePairsDone((prev) => ({ ...prev, [pairId]: true }));
      setSideHotspots({});
      setActiveSidePair(null);
      setStep4Complete(true);
      onUpdateTexts(undefined, APP_DATA.steps[4].navComplete);
      onSetNextEnabled(true);
      setTimeout(updateNudgeTarget, 150);
    });
  };

  const runAngleAnimation = (pairId) => {
    if (animatingRef.current || exploredPairs[pairId]) return;
    animatingRef.current = true;
    blankNavText();
    onHideNudge();
    playSnd("click");

    const cfg = PAIR_CONFIG[pairId];
    const abcKey = { 1: "A", 2: "B", 3: "C" }[pairId];
    const defKey = { 1: "D", 2: "E", 3: "F" }[pairId];
    const abcVtx = TRI_ABC[abcKey];
    const defVtx = TRI_DEF[defKey];
    const matched = matchCenter(abcVtx, defVtx);

    const arcAbc = getInnerAngleArc(
      abcVtx,
      TRI_ABC[{ A: "B", B: "A", C: "B" }[abcKey]],
      TRI_ABC[{ A: "C", B: "C", C: "A" }[abcKey]]
    );
    const arcDef = getInnerAngleArc(
      defVtx,
      TRI_DEF[{ D: "E", E: "D", F: "E" }[defKey]],
      TRI_DEF[{ D: "F", E: "F", F: "D" }[defKey]]
    );

    setVisibleHotspots({});
    setDehighlight({
      fadeSidesAbc: cfg.fadeSidesAbc,
      fadeSidesDef: cfg.fadeSidesDef,
      fadeLabels: cfg.fadeLabels,
    });

    const textWorld = getAngleEqualTextWorld(pairId, defVtx);
    const fly = { t: 0 };
    const revealAnim = { opacity: 0, labelShift: 0 };
    let flyData = null;

    const tl = gsap.timeline({
      onComplete: () => {
        const halfArc = {
          pairId,
          abc: { ...arcAbc, r: ARC_RADIUS_SMALL_HALF },
          def: { ...arcDef, r: ARC_RADIUS_LARGE_HALF },
          text: textWorld,
        };
        setPersistedArcs((prev) => [...prev, halfArc]);
        setTempArcs(null);
        setTempArcReveal({ opacity: 0, labelShift: 0 });
        setTempEqualText(null);
        setEqualTextBorderBlink(false);
        setAngleTextFly(null);
        setDehighlight(null);
        setAbcPos(NEST_CENTER);

        const newExplored = { ...exploredPairs, [pairId]: true };
        setExploredPairs(newExplored);
        const count = Object.keys(newExplored).length;
        const remaining = {};
        [1, 2, 3].forEach((p) => {
          if (!newExplored[p]) remaining[p] = true;
        });
        setVisibleHotspots(remaining);

        animatingRef.current = false;

        if (count === 3) {
          setAllExplored(true);
          setActionBtn("summarize");
          onUpdateTexts(
            APP_DATA.steps[1].questionText,
            APP_DATA.steps[2].navSummarize
          );
          setTimeout(updateNudgeTarget, 100);
        } else {
          onUpdateTexts(undefined, APP_DATA.steps[2].navText);
        }
      },
    });

    tl.to({}, {
      duration: 0.01,
      onStart: () => {
        setTempArcs({
          pairId,
          abc: { ...arcAbc, r: ARC_RADIUS_SMALL },
          def: { ...arcDef, r: ARC_RADIUS_LARGE },
        });
        setTempArcReveal({ opacity: 0, labelShift: 0 });
      },
    });

    gsap.killTweensOf(revealAnim);
    tl.to(revealAnim, {
      opacity: 0.85,
      labelShift: 1,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => {
        setTempArcReveal({
          opacity: revealAnim.opacity,
          labelShift: revealAnim.labelShift,
        });
      },
    });

    tl.to({}, {
      duration: 0.9,
      onStart: () => setAbcPos(matched),
    });

    tl.to(fly, {
      t: 1,
      duration: 0.7,
      ease: "power2.inOut",
      onStart: () => {
        const targets = getEqualTextPartTargets(pairId, textWorld);
        const fromA = getVertexLabelWorld(
          "abc",
          abcKey,
          matched,
          LABEL_DIST_INSIDE_ARC
        );
        const fromD = getVertexLabelWorld("def", defKey, matched);
        flyData = {
          pairId,
          fromA,
          fromD,
          toA: targets.abc,
          toD: targets.def,
        };
        fly.t = 0;
        setAngleTextFly({ ...flyData, t: 0 });
      },
      onUpdate: () => {
        if (flyData) setAngleTextFly({ ...flyData, t: fly.t });
      },
      onComplete: () => {
        setAngleTextFly(null);
        setTempEqualText({ pairId, pos: textWorld });
        setEqualTextBorderBlink(true);
      },
    });

    tl.to({}, { duration: 2 });

    tl.to({}, {
      duration: 0.9,
      onStart: () => {
        setEqualTextBorderBlink(false);
        setAbcPos(NEST_CENTER);
      },
    });
  };

  const renderSide = (tri, sideName, p1, p2) => {
    const opacity = getSideOpacity(tri, sideName);
    return React.createElement("line", {
      key: `${tri}-${sideName}`,
      x1: p1.x,
      y1: p1.y,
      x2: p2.x,
      y2: p2.y,
      stroke: getStrokeColor(tri),
      strokeWidth: 3,
      vectorEffect: "non-scaling-stroke",
      strokeLinecap: "round",
      opacity,
      style: { transition: "opacity 0.3s ease" },
    });
  };

  const getAbcLabelInsideDist = (letter) => {
    if (tempArcs && ABC_KEYS[tempArcs.pairId] === letter) {
      return (
        LABEL_DIST_INSIDE +
        (LABEL_DIST_INSIDE_ARC - LABEL_DIST_INSIDE) * tempArcReveal.labelShift
      );
    }
    if (
      (step === 2 || step === 3) &&
      persistedArcs.some((a) => ABC_KEYS[a.pairId] === letter)
    ) {
      return LABEL_DIST_INSIDE_ARC;
    }
    return LABEL_DIST_INSIDE;
  };

  const renderLabel = (tri, letter, vertex, forceOutside) => {
    const centroid = tri === "abc" ? ABC_CENTROID : DEF_CENTROID;
    let pos;
    if (tri === "abc" && !forceOutside) {
      const insideDist = getAbcLabelInsideDist(letter);
      pos = labelPosLerp(vertex, centroid, labelInsideProgress, insideDist);
    } else {
      pos = labelPos(vertex, centroid, LABEL_DIST_OUTSIDE, false);
    }
    return React.createElement(
      "text",
      {
        key: `${tri}-label-${letter}`,
        x: pos.x,
        y: pos.y,
        fill: getLabelColor(tri),
        fontSize:
          tri === "abc" ? LABEL_FONT_SIZE / abcScaleMul : LABEL_FONT_SIZE,
        fontWeight: "bold",
        textAnchor: "middle",
        dominantBaseline: "middle",
        opacity: getLabelOpacity(letter),
        className: "vertex-label",
        style: { transition: "opacity 0.3s ease" },
      },
      letter
    );
  };

  const ABC_KEYS = { 1: "A", 2: "B", 3: "C" };
  const DEF_KEYS = { 1: "D", 2: "E", 3: "F" };

  const effectiveAbcScale = S * abcScaleMul;
  const effectiveDefScale = S * defScaleMul;

  const getPersistedArcOpacity = () => (dehighlight ? 0.2 : 0.85);

  const abcTransform = (scale) =>
    `translate(${abcPos.x}, ${abcPos.y}) scale(${scale}) translate(${-ABC_CENTROID.x}, ${-ABC_CENTROID.y})`;

  const defTransform = (scale) =>
    `translate(${defPos.x}, ${defPos.y}) scale(${scale}) translate(${-DEF_CENTROID.x}, ${-DEF_CENTROID.y})`;

  const hotspotPositions = () => {
    const pairs = [
      { id: 1, a: TRI_ABC.A, d: TRI_DEF.D },
      { id: 2, a: TRI_ABC.B, d: TRI_DEF.E },
      { id: 3, a: TRI_ABC.C, d: TRI_DEF.F },
    ];
    return pairs.map((p) => {
      const wa = worldPoint(p.a, abcPos, effectiveAbcScale, ABC_CENTROID);
      const wd = worldPoint(p.d, defPos, S, DEF_CENTROID);
      return {
        id: p.id,
        cx: (wa.x + wd.x) / 2,
        cy: (wa.y + wd.y) / 2,
        r: HOTSPOT_RADIUS,
      };
    });
  };

  const renderAngleArcInGroup = (
    tri,
    vertexKey,
    arcData,
    radius,
    pairId,
    opacity
  ) => {
    const vertex = tri === "abc" ? TRI_ABC[vertexKey] : TRI_DEF[vertexKey];
    const adj = tri === "abc"
      ? vertexKey === "A"
        ? [TRI_ABC.B, TRI_ABC.C]
        : vertexKey === "B"
        ? [TRI_ABC.A, TRI_ABC.C]
        : [TRI_ABC.B, TRI_ABC.A]
      : vertexKey === "D"
      ? [TRI_DEF.E, TRI_DEF.F]
      : vertexKey === "E"
      ? [TRI_DEF.D, TRI_DEF.F]
      : [TRI_DEF.E, TRI_DEF.D];
    const arc = arcData || getInnerAngleArc(vertex, adj[0], adj[1]);
    const r = radius || (tri === "abc" ? ARC_RADIUS_SMALL : ARC_RADIUS_LARGE);
    const color = tri === "abc" ? COLOR_BLUE : COLOR_YELLOW;
    return React.createElement("path", {
      key: `arc-${tri}-${vertexKey}-${pairId || "t"}`,
      d: describeArc(vertex.x, vertex.y, r, arc.start, arc.end),
      fill: color,
      opacity: opacity !== undefined ? opacity : 0.85,
    });
  };

  const renderFlyingAngleLabels = () => {
    if (!angleTextFly) return null;
    const { pairId, t, fromA, fromD, toA, toD } = angleTextFly;
    const parts = ANGLE_LABEL_PARTS[pairId];
    const posA = lerpPt(fromA, toA, t);
    const posD = lerpPt(fromD, toD, t);
    return React.createElement(
      "g",
      { className: "angle-fly-layer" },
      React.createElement("text", {
        x: posA.x,
        y: posA.y,
        fill: COLOR_BLUE,
        fontSize: 22,
        fontWeight: 700,
        textAnchor: "middle",
        dominantBaseline: "middle",
        className: "angle-fly-text",
      }, parts.abc),
      React.createElement("text", {
        x: posD.x,
        y: posD.y,
        fill: COLOR_YELLOW,
        fontSize: 22,
        fontWeight: 700,
        textAnchor: "middle",
        dominantBaseline: "middle",
        className: "angle-fly-text",
      }, parts.def)
    );
  };

  const renderEqualTextFO = (pairId, pos, key, animateIn, extraOpacity, borderBlink) => {
    const fo = getEqualTextForeignObjectProps(pairId, pos);
    const foClass =
      fo.className +
      (animateIn ? " ang-equal-fo--appear" : "") +
      (borderBlink ? " ang-equal-fo--border-blink" : "");
    return React.createElement(
      "foreignObject",
      {
        key: key,
        x: fo.x,
        y: fo.y,
        width: fo.width,
        height: fo.height,
        className: foClass,
        opacity: extraOpacity !== undefined ? extraOpacity : 1,
        style: extraOpacity !== undefined ? { transition: "opacity 0.3s ease" } : undefined,
      },
      React.createElement("div", {
        className:
          "ang-equal-text" + (borderBlink ? " ang-equal-text--border-blink" : ""),
        dangerouslySetInnerHTML: {
          __html: APP_DATA.steps[2].angleEqual[pairId],
        },
      })
    );
  };

  const sideHotspotPositions = () => {
    const pairs = [
      { id: 1, abcSide: "AB", defSide: "DE" },
      { id: 2, abcSide: "BC", defSide: "EF" },
      { id: 3, abcSide: "AC", defSide: "DF" },
    ];
    return pairs.map((p) => {
      const wa = getSideMidWorld(
        "abc",
        p.abcSide,
        abcPos,
        defPos,
        effectiveAbcScale,
        0
      );
      const wd = getSideMidWorld(
        "def",
        p.defSide,
        abcPos,
        defPos,
        effectiveAbcScale,
        0
      );
      return {
        id: p.id,
        cx: (wa.x + wd.x) / 2,
        cy: (wa.y + wd.y) / 2,
        r: HOTSPOT_RADIUS,
      };
    });
  };

  const renderHotspotGroup = (h, prefix, onClick) =>
    React.createElement(
      "g",
      { key: `${prefix}-${h.id}`, className: "hotspot-group" },
      React.createElement("path", {
        id: `${prefix}-${h.id}-outer`,
        d: describeHotspotRing(h.cx, h.cy, h.r, h.r * HOTSPOT_RING_MID),
        className: "hotspot-ring hotspot-ring-outer",
        onClick,
      }),
      React.createElement("path", {
        id: `${prefix}-${h.id}-mid`,
        d: describeHotspotRing(
          h.cx,
          h.cy,
          h.r * HOTSPOT_RING_MID,
          h.r * HOTSPOT_RING_CENTER
        ),
        className: "hotspot-ring hotspot-ring-mid",
        onClick,
      }),
      React.createElement("path", {
        id: `${prefix}-${h.id}-center`,
        d: describeHotspotRing(
          h.cx,
          h.cy,
          h.r * HOTSPOT_RING_CENTER,
          0
        ),
        className: "hotspot-ring hotspot-ring-center",
        onClick,
      }),
      React.createElement("circle", {
        cx: h.cx,
        cy: h.cy,
        r: h.r,
        className: "hotspot-hit",
        onClick,
      })
    );

  const renderSideLengthLabels = () => {
    if (!sideLengthLabels || !sideLengthLabels.visible) return null;
    const cfg = SIDE_PAIR_CONFIG[sideLengthLabels.pairId];
    const abcPt = getSideLengthLabelPos(
      "abc",
      cfg.abcSide,
      abcPos,
      defPos,
      effectiveAbcScale,
      0,
      true
    );
    const defPt = getSideLengthLabelPos(
      "def",
      cfg.defSide,
      abcPos,
      defPos,
      effectiveAbcScale,
      0,
      false
    );
    return React.createElement(
      "g",
      { className: "side-length-labels" },
      React.createElement("text", {
        x: abcPt.x,
        y: abcPt.y,
        fill: COLOR_WHITE,
        fontSize: 22,
        fontWeight: 700,
        textAnchor: "middle",
        dominantBaseline: "middle",
        className: "side-length-label side-length-label--appear",
      }, String(cfg.abcLen)),
      React.createElement("text", {
        x: defPt.x,
        y: defPt.y,
        fill: COLOR_WHITE,
        fontSize: 22,
        fontWeight: 700,
        textAnchor: "middle",
        dominantBaseline: "middle",
        className: "side-length-label side-length-label--appear",
      }, String(cfg.defLen))
    );
  };

  const renderEqText = (item, key, visible, extraClass) => {
    if (!visible) return null;
    return React.createElement(
      "text",
      {
        key,
        x: item.x,
        y: item.y,
        fill: item.color,
        fontSize: EQ_FONT,
        fontWeight: 700,
        textAnchor: "middle",
        dominantBaseline: "middle",
        className: "eq-text" + (extraClass ? ` ${extraClass}` : ""),
      },
      item.text
    );
  };

  const renderEqBar = (bar, key, visible) => {
    if (!visible) return null;
    return React.createElement("line", {
      key,
      x1: bar.x1,
      y1: bar.y,
      x2: bar.x2,
      y2: bar.y,
      stroke: COLOR_WHITE,
      strokeWidth: 2.5,
      className: "eq-fraction-bar",
    });
  };

  const renderEqEquals = (pos, key, visible) => {
    if (!visible) return null;
    return React.createElement(
      "text",
      {
        key,
        x: pos.x,
        y: pos.y,
        fill: COLOR_WHITE,
        fontSize: EQ_FONT,
        fontWeight: 700,
        textAnchor: "middle",
        dominantBaseline: "middle",
        className: "eq-equals",
      },
      "="
    );
  };

  const renderActiveEquation = () => {
    if (!equationState) return null;
    const { pairId, rowIndex, parts, showSimp, anim } = equationState;
    const layout = getEquationLayout(
      pairId,
      rowIndex !== undefined ? rowIndex : finishedEquations.length
    );
    const eqAnim = anim || DEFAULT_EQ_ANIM;
    const simpTransform = `translate(${eqAnim.simpOffsetX + eqAnim.simpCollapseX}, 0)`;

    return React.createElement(
      "g",
      { className: "equation-group" },
      renderEqText(layout.lhsNum, "lhs-n", parts.lhsNum),
      renderEqBar(layout.lhsBar, "lhs-b", parts.lhsBar),
      renderEqText(layout.lhsDen, "lhs-d", parts.lhsDen),
      renderEqEquals(layout.eq1, "eq1", parts.eq1),
      React.createElement(
        "g",
        {
          className: "eq-middle-group",
          opacity: eqAnim.middleOpacity,
        },
        renderEqText(layout.rhsNum, "rhs-n", parts.rhsNum),
        renderEqBar(layout.rhsBar, "rhs-b", parts.rhsBar),
        renderEqText(layout.rhsDen, "rhs-d", parts.rhsDen)
      ),
      showSimp &&
        React.createElement(
          "g",
          {
            className: "eq-simp-group",
            opacity: eqAnim.simpOpacity,
            transform: simpTransform,
          },
          React.createElement(
            "g",
            { opacity: eqAnim.eq2Opacity },
            renderEqEquals(layout.eq2, "eq2", parts.eq2)
          ),
          renderEqText(layout.simpNum, "simp-n", parts.simpNum),
          renderEqBar(layout.simpBar, "simp-b", parts.simpBar),
          renderEqText(layout.simpDen, "simp-d", parts.simpDen)
        ),
      showFractionBox &&
        React.createElement(
          "foreignObject",
          {
            x: layout.rhsBox.x,
            y: layout.rhsBox.y,
            width: layout.rhsBox.width,
            height: layout.rhsBox.height,
            className: "fraction-box-fo",
          },
          React.createElement(
            "div",
            { className: "svg-tap-hint-wrap" },
            React.createElement("button", {
              className: "fraction-box-btn",
              onClick: runFractionBoxClick,
            }),
            renderInlineTapHint("centered")
          )
        )
    );
  };

  const renderCollapsedEquationRow = (
    pairId,
    rowIndex,
    keyPrefix,
    simpOpacity,
    simpBlinkOpacity
  ) => {
    const layout = getEquationLayout(pairId, rowIndex);
    const simpAtRhs = {
      num: { ...layout.simpNum, x: layout.rhsNum.x },
      bar: { x1: layout.rhsBar.x1, x2: layout.rhsBar.x2, y: layout.rhsBar.y },
      den: { ...layout.simpDen, x: layout.rhsDen.x },
    };
    return React.createElement(
      "g",
      { key: keyPrefix, className: "equation-group equation-group--finished" },
      renderEqText(layout.lhsNum, `${keyPrefix}-ln`, true),
      renderEqBar(layout.lhsBar, `${keyPrefix}-lb`, true),
      renderEqText(layout.lhsDen, `${keyPrefix}-ld`, true),
      renderEqEquals(
        { x: layout.eq1.x, y: layout.eq1.y },
        `${keyPrefix}-eq`,
        true
      ),
      React.createElement(
        "g",
        {
          opacity:
            (simpOpacity !== undefined ? simpOpacity : 1) *
            (simpBlinkOpacity !== undefined ? simpBlinkOpacity : 1),
        },
        renderEqText(simpAtRhs.num, `${keyPrefix}-sn`, true),
        renderEqBar(simpAtRhs.bar, `${keyPrefix}-sb`, true),
        renderEqText(simpAtRhs.den, `${keyPrefix}-sd`, true)
      )
    );
  };

  const renderFinishedEquation = (eq, rowIndex) =>
    renderCollapsedEquationRow(eq.pairId, rowIndex, `finished-eq-${eq.pairId}`);

  const renderMergeView = () => {
    if (!mergeState) return null;
    const { pairId1, pairId2, anim } = mergeState;
    return React.createElement(
      "g",
      { className: "equation-merge-view" },
      renderCollapsedEquationRow(
        pairId1,
        0,
        "merge-eq1",
        anim.eq1SimpOpacity,
        anim.blinkOpacity
      ),
      React.createElement(
        "g",
        {
          transform: `translate(${anim.row2OffsetX}, ${anim.row2OffsetY})`,
        },
        renderCollapsedEquationRow(
          pairId2,
          1,
          "merge-eq2",
          1,
          anim.blinkOpacity
        )
      )
    );
  };

  const renderFullMergedEquation = (pairIds, keyPrefix, thirdParts, trailingShiftX) => {
    const layout = getFullMergedEquationLayout(pairIds);
    const elems = [];

    layout.fractions.forEach((frac, i) => {
      const isThird = i === 2 && thirdParts;

      if (isThird) {
        if (thirdParts.eq2) {
          elems.push(renderEqEquals(layout.equals[1], `${keyPrefix}-eq2`, true));
        }
        if (thirdParts.bar) {
          elems.push(renderEqBar(frac.bar, `${keyPrefix}-f3b`, true));
        }
        if (thirdParts.num) {
          elems.push(renderEqText(frac.num, `${keyPrefix}-f3n`, true));
        }
        if (thirdParts.den) {
          elems.push(renderEqText(frac.den, `${keyPrefix}-f3d`, true));
        }
        return;
      }

      elems.push(renderEqText(frac.num, `${keyPrefix}-f${i}n`, true));
      elems.push(renderEqBar(frac.bar, `${keyPrefix}-f${i}b`, true));
      elems.push(renderEqText(frac.den, `${keyPrefix}-f${i}d`, true));

      if (i < layout.fractions.length - 1) {
        elems.push(renderEqEquals(layout.equals[i], `${keyPrefix}-eq${i}`, true));
      }
    });

    const lastEq = layout.equals[layout.equals.length - 1];
    elems.push(
      React.createElement(
        "g",
        {
          key: `${keyPrefix}-trail`,
          transform:
            trailingShiftX !== undefined && trailingShiftX !== 0
              ? `translate(${trailingShiftX}, 0)`
              : undefined,
        },
        renderEqEquals(lastEq, `${keyPrefix}-eqt`, true),
        renderEqText(layout.simp.num, `${keyPrefix}-sn`, true),
        renderEqBar(layout.simp.bar, `${keyPrefix}-sb`, true),
        renderEqText(layout.simp.den, `${keyPrefix}-sd`, true)
      )
    );

    return React.createElement(
      "g",
      { className: "equation-group equation-group--merged" },
      elems
    );
  };

  const renderMergedEquation = () => {
    if (thirdFracAnim) {
      const { pairIds, pairId3, anim } = thirdFracAnim;
      const allIds = [...pairIds, pairId3];
      return renderFullMergedEquation(
        allIds,
        "mg3",
        anim.parts,
        anim.trailingShiftX
      );
    }
    if (!mergedEquation) return null;
    if (mergedEquation.pairIds.length === 3) {
      return renderFullMergedEquation(mergedEquation.pairIds, "mg");
    }
    const [pairId1, pairId2] = mergedEquation.pairIds;
    const layout = getMergedEquationLayout(pairId1, pairId2);
    return React.createElement(
      "g",
      { className: "equation-group equation-group--merged" },
      renderEqText(layout.frac1.num, "mg-f1n", true),
      renderEqBar(layout.frac1.bar, "mg-f1b", true),
      renderEqText(layout.frac1.den, "mg-f1d", true),
      renderEqEquals(layout.eq1, "mg-eq1", true),
      renderEqText(layout.frac2.num, "mg-f2n", true),
      renderEqBar(layout.frac2.bar, "mg-f2b", true),
      renderEqText(layout.frac2.den, "mg-f2d", true),
      renderEqEquals(layout.eq2, "mg-eq2", true),
      renderEqText(layout.simp.num, "mg-sn", true),
      renderEqBar(layout.simp.bar, "mg-sb", true),
      renderEqText(layout.simp.den, "mg-sd", true)
    );
  };

  const renderStep4Summary = () => {
    if (step !== 4 || !step4Complete) return null;
    return React.createElement(
      "foreignObject",
      {
        x: 380,
        y: CALC_BASE_Y + 52,
        width: 235,
        height: 120,
        className: "step4-summary-fo step4-summary-fo--appear",
      },
      React.createElement("div", {
        className: "step4-summary-text",
        dangerouslySetInnerHTML: {
          __html: APP_DATA.steps[4].actionSummary,
        },
      })
    );
  };

  const renderPersistedSideLengthLabels = () => {
    if (!persistedSideLengths.length || step === 5) return null;
    return React.createElement(
      "g",
      { className: "persisted-side-lengths" },
      persistedSideLengths.map(({ pairId }) => {
        const cfg = SIDE_PAIR_CONFIG[pairId];
        const abcPt = getSideLengthLabelPos(
          "abc",
          cfg.abcSide,
          abcPos,
          defPos,
          effectiveAbcScale,
          0,
          true
        );
        const defPt = getSideLengthLabelPos(
          "def",
          cfg.defSide,
          abcPos,
          defPos,
          effectiveAbcScale,
          0,
          false
        );
        return React.createElement(
          "g",
          { key: `persisted-len-${pairId}`, opacity: step4Complete ? 1 : 0.35 },
          React.createElement("text", {
            x: abcPt.x,
            y: abcPt.y,
            fill: COLOR_BLUE,
            fontSize: 22,
            fontWeight: 700,
            textAnchor: "middle",
            dominantBaseline: "middle",
          }, String(cfg.abcLen)),
          React.createElement("text", {
            x: defPt.x,
            y: defPt.y,
            fill: COLOR_YELLOW,
            fontSize: 22,
            fontWeight: 700,
            textAnchor: "middle",
            dominantBaseline: "middle",
          }, String(cfg.defLen))
        );
      })
    );
  };

  const handleSliderInput = (e) => {
    setSliderIndex(Number(e.target.value));
  };

  const handleSliderCommit = (e) => {
    const idx = Number(e.target.value);
    const target = SLIDER_SNAPS[idx];
    if (Math.abs(target - defScaleMul) < 0.001) return;
    playSnd("click");
    onHideNudge();
    const anim = { s: defScaleMul };
    gsap.killTweensOf(anim);
    gsap.to(anim, {
      s: target,
      duration: 0.7,
      ease: "power2.inOut",
      onUpdate: () => setDefScaleMul(anim.s),
      onComplete: () => {
        setDefScaleMul(target);
        setDisplayDefScale(target);
        blinkStep5Ratio();
        setExploredScales((prev) => {
          const next = { ...prev, [target]: true };
          if (SLIDER_SNAPS.every((v) => next[v])) {
            onSetNextEnabled(true);
            onUpdateTexts(undefined, APP_DATA.steps[5].navComplete);
            setTimeout(updateNudgeTarget, 150);
          }
          return next;
        });
      },
    });
  };

  const renderStep5DefAttachedLabels = () => {
    if (step !== 5) return null;
    const vertFont = LABEL_FONT_SIZE / defScaleMul;
    const sideFont = 22 / effectiveDefScale;

    return React.createElement(
      "g",
      { className: "step5-def-attached-labels" },
      ["D", "E", "F"].map((letter) => {
        const vtx = TRI_DEF[letter];
        const vertDist = getStep5DefVertexLabelDist(defScaleMul);
        const pos = labelPos(vtx, DEF_CENTROID, vertDist, false);
        return React.createElement(
          "text",
          {
            key: `s5d-${letter}`,
            x: pos.x,
            y: pos.y,
            fill: COLOR_YELLOW,
            fontSize: vertFont,
            fontWeight: "bold",
            textAnchor: "middle",
            dominantBaseline: "middle",
          },
          letter
        );
      }),
      [1, 2, 3].map((pairId) => {
        const cfg = SIDE_PAIR_CONFIG[pairId];
        const dist = getSideLabelDist("def", defScaleMul, true);
        const pos = getSideLengthLabelLocal("def", cfg.defSide, false, dist);
        return React.createElement(
          "text",
          {
            key: `s5dl-${pairId}`,
            x: pos.x,
            y: pos.y,
            fill: COLOR_YELLOW,
            fontSize: sideFont,
            fontWeight: 700,
            textAnchor: "middle",
            dominantBaseline: "middle",
          },
          formatSideLen(cfg.defLen * defScaleMul)
        );
      })
    );
  };

  const renderStep5AbcAttachedLabels = () => {
    if (step !== 5) return null;
    const sideFont = 22 / effectiveAbcScale;

    return React.createElement(
      "g",
      { className: "step5-abc-attached-labels" },
      [1, 2, 3].map((pairId) => {
        const cfg = SIDE_PAIR_CONFIG[pairId];
        const dist = getSideLabelDist("abc", displayDefScale, true);
        const pos = getSideLengthLabelLocal("abc", cfg.abcSide, false, dist);
        return React.createElement(
          "text",
          {
            key: `s5al-${pairId}`,
            x: pos.x,
            y: pos.y,
            fill: COLOR_BLUE,
            fontSize: sideFont,
            fontWeight: 700,
            textAnchor: "middle",
            dominantBaseline: "middle",
          },
          formatSideLen(cfg.abcLen)
        );
      })
    );
  };

  const renderStep5RatioRhs = (layout, ratio) => {
    const ratioClass =
      "step5-ratio-group" +
      (ratioSliderBlink ? " step5-ratio-group--slider-blink" : "");
    if (ratio.type === "whole") {
      return React.createElement(
        "g",
        {
          key: `step5-ratio-${ratioBlinkKey}`,
          className: ratioClass,
        },
        React.createElement(
          "text",
          {
            x: layout.simp.num.x,
            y: layout.simp.num.y + 14,
            fill: COLOR_WHITE,
            fontSize: EQ_FONT,
            fontWeight: 700,
            textAnchor: "middle",
            dominantBaseline: "middle",
            className: "step5-ratio-text",
          },
          ratio.value
        )
      );
    }
    return React.createElement(
      "g",
      {
        key: `step5-ratio-${ratioBlinkKey}`,
        className: ratioClass,
      },
      renderEqText(layout.simp.num, "s5-sn", true, "step5-ratio-text"),
      renderEqBar(layout.simp.bar, "s5-sb", true),
      renderEqText(layout.simp.den, "s5-sd", true, "step5-ratio-text")
    );
  };

  const renderStep5EquationBox = () => {
    if (step !== 5 || !mergedEquation || mergedEquation.pairIds.length !== 3) {
      return null;
    }
    const ratio = getRatioDisplay(displayDefScale);
    const { layout, box } = computeStep5EquationMetrics(
      mergedEquation.pairIds,
      ratio
    );

    return React.createElement(
      "g",
      { className: "step5-equation-group" },
      React.createElement("rect", {
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        rx: 10,
        ry: 10,
        fill: "rgba(0, 0, 0, 0.55)",
      }),
      layout.fractions.map((frac, i) =>
        React.createElement(
          "g",
          { key: `s5f-${i}` },
          renderEqText(frac.num, `s5-f${i}n`, true),
          renderEqBar(frac.bar, `s5-f${i}b`, true),
          renderEqText(frac.den, `s5-f${i}d`, true),
          i < layout.fractions.length - 1
            ? renderEqEquals(layout.equals[i], `s5-eq${i}`, true)
            : null
        )
      ),
      renderEqEquals(
        layout.equals[layout.equals.length - 1],
        "s5-eqt",
        true
      ),
      renderStep5RatioRhs(layout, ratio)
    );
  };

  const renderStep5Slider = () => {
    if (step !== 5) return null;
    return React.createElement(
      "foreignObject",
      {
        x: STEP5_SLIDER.x,
        y: STEP5_SLIDER.y,
        width: STEP5_SLIDER.width,
        height: STEP5_SLIDER.height,
        className: "step5-slider-fo",
      },
      React.createElement("input", {
        ref: sliderRef,
        type: "range",
        className: "step5-slider",
        min: 0,
        max: 2,
        step: 1,
        value: sliderIndex,
        onInput: handleSliderInput,
        onChange: handleSliderCommit,
      })
    );
  };

  const renderSideFlyClones = () => {
    if (!sideFlyClones.length) return null;
    return React.createElement(
      "g",
      { className: "side-fly-layer" },
      sideFlyClones.map((c, i) =>
        React.createElement(
          "text",
          {
            key: `fly-${i}`,
            x: c.x,
            y: c.y,
            fill: c.color,
            fontSize: EQ_FONT,
            fontWeight: 700,
            textAnchor: "middle",
            dominantBaseline: "middle",
            opacity: c.opacity,
          },
          c.text
        )
      )
    );
  };

  const renderInlineTapHint = (variant) =>
    React.createElement("img", {
      src: "assets/tap.gif",
      alt: "",
      className:
        "svg-inline-tap-hint" +
        (variant ? ` svg-inline-tap-hint--${variant}` : ""),
    });

  const renderCompareButton = () => {
    if (!showCompareBtn) return null;
    return React.createElement(
      "foreignObject",
      {
        x: 380,
        y: 118,
        width: 170,
        height: 90,
        className: "compare-btn-fo compare-btn-fo--appear",
      },
      React.createElement(
        "div",
        { className: "svg-tap-hint-wrap compare-tap-wrap" },
        React.createElement("button", {
          className: "compare-side-btn",
          onClick: runCompareAnimation,
          dangerouslySetInnerHTML: {
            __html: APP_DATA.steps[4].actionCompare,
          },
        }),
        renderInlineTapHint("on-btn")
      )
    );
  };

  const showAngleArcs = step === 2 || step === 3;
  const showActionRow = step >= 1 && step !== 4 && step !== 5;

  const actionRowContent = () => {
    if (step === 3) {
      return React.createElement("div", {
        className: "action-summary-text",
        dangerouslySetInnerHTML: {
          __html: APP_DATA.steps[3].actionSummary,
        },
      });
    }
    if (step === 1 && actionBtn === "recap") {
      return React.createElement(
        "button",
        {
          ref: actionBtnRef,
          className: "action-btn",
          onClick: handleRecapClick,
          disabled: actionDisabled,
        },
        APP_DATA.steps[1].actionRecap
      );
    }
    if (step === 1 && actionBtn === "explore") {
      return React.createElement(
        "button",
        {
          ref: actionBtnRef,
          className: "action-btn",
          onClick: handleExploreAnglesClick,
          disabled: actionDisabled,
        },
        APP_DATA.steps[1].actionExplore
      );
    }
    if (step === 2 && actionBtn === "summarize") {
      return React.createElement(
        "button",
        {
          ref: actionBtnRef,
          className: "action-btn",
          onClick: handleSummarizeClick,
          disabled: actionDisabled,
        },
        APP_DATA.steps[2].actionSummarize
      );
    }
    return null;
  };

  const step5NoTransformTransition =
    step === 5 ? { transition: "none" } : undefined;

  const abcGroupTransformStyle =
    step5NoTransformTransition ||
    (abcScaleTweening ? { transition: "none" } : undefined);

  layoutSnapshotRef.current = { diagramOffsetX, abcPos, defPos };

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "div",
      { className: "svg-row" },
      showRecapText &&
        React.createElement("div", {
          className: "recap-text-box " + current_language,
          dangerouslySetInnerHTML: { __html: APP_DATA.steps[1].recapText },
        }),
      React.createElement(
        "svg",
        {
          className: "triangles-svg",
          viewBox: "0 0 600 360",
          preserveAspectRatio: "xMidYMid meet",
        },
        React.createElement(
          "g",
          { transform: `translate(0, ${DIAGRAM_SHIFT_Y})` },
          React.createElement(
            "g",
            {
              className: "diagram-group",
              transform: `translate(${diagramOffsetX}, 0)`,
            },
            React.createElement(
              "g",
              {
                ref: defGroupRef,
                className: "triangle-group triangle-layer-back",
                transform: defTransform(effectiveDefScale),
                style: step5NoTransformTransition,
              },
              renderSide("def", "DE", TRI_DEF.D, TRI_DEF.E),
              renderSide("def", "EF", TRI_DEF.E, TRI_DEF.F),
              renderSide("def", "DF", TRI_DEF.D, TRI_DEF.F),
              showAngleArcs &&
                tempArcs &&
                renderAngleArcInGroup(
                  "def",
                  DEF_KEYS[tempArcs.pairId],
                  tempArcs.def,
                  tempArcs.def.r,
                  tempArcs.pairId,
                  tempArcReveal.opacity,
                ),
              showAngleArcs &&
                persistedArcs.map((a) =>
                  renderAngleArcInGroup(
                    "def",
                    DEF_KEYS[a.pairId],
                    a.def,
                    a.def.r,
                    a.pairId,
                    getPersistedArcOpacity(),
                  ),
                ),
              step !== 5 && renderLabel("def", "D", TRI_DEF.D, true),
              step !== 5 && renderLabel("def", "E", TRI_DEF.E, true),
              step !== 5 && renderLabel("def", "F", TRI_DEF.F, true),
              renderStep5DefAttachedLabels(),
            ),
            React.createElement(
              "g",
              {
                ref: abcGroupRef,
                className: "triangle-group triangle-layer-front",
                transform: abcTransform(effectiveAbcScale),
                style: abcGroupTransformStyle,
              },
              renderSide("abc", "AB", TRI_ABC.A, TRI_ABC.B),
              renderSide("abc", "BC", TRI_ABC.B, TRI_ABC.C),
              renderSide("abc", "AC", TRI_ABC.A, TRI_ABC.C),
              showAngleArcs &&
                tempArcs &&
                renderAngleArcInGroup(
                  "abc",
                  ABC_KEYS[tempArcs.pairId],
                  tempArcs.abc,
                  tempArcs.abc.r,
                  tempArcs.pairId,
                  tempArcReveal.opacity,
                ),
              showAngleArcs &&
                persistedArcs.map((a) =>
                  renderAngleArcInGroup(
                    "abc",
                    ABC_KEYS[a.pairId],
                    a.abc,
                    a.abc.r,
                    a.pairId,
                    getPersistedArcOpacity(),
                  ),
                ),
            ),
            React.createElement(
              "g",
              {
                className:
                  "triangle-group triangle-labels triangle-layer-front",
                transform: abcTransform(effectiveAbcScale),
                style: abcGroupTransformStyle,
              },
              renderLabel("abc", "A", TRI_ABC.A, step >= 4),
              renderLabel("abc", "B", TRI_ABC.B, step >= 4),
              renderLabel("abc", "C", TRI_ABC.C, step >= 4),
              renderStep5AbcAttachedLabels(),
            ),
            renderSideLengthLabels(),
            renderPersistedSideLengthLabels(),
            step === 4 &&
              React.createElement(
                "g",
                { className: "hotspots-layer" },
                sideHotspotPositions().map((h) =>
                  sideHotspots[h.id]
                    ? renderHotspotGroup(h, "side-hotspot", () =>
                        handleSideHotspotClick(h.id),
                      )
                    : null,
                ),
              ),
          ),
          React.createElement(
            "g",
            { className: "calc-space" },
            step === 4 &&
              !mergeState &&
              !thirdFracAnim &&
              !mergedEquation &&
              finishedEquations.map((eq, i) => renderFinishedEquation(eq, i)),
            step === 4 && mergeState && renderMergeView(),
            step === 4 &&
              (mergedEquation || thirdFracAnim) &&
              renderMergedEquation(),
            renderStep4Summary(),
            step === 4 && renderActiveEquation(),
            step === 4 && renderCompareButton(),
            step === 5 && renderStep5EquationBox(),
            step === 5 && renderStep5Slider(),
          ),
          React.createElement(
            "g",
            { className: "hotspots-layer" },
            step === 2 &&
              hotspotPositions().map((h) =>
                visibleHotspots[h.id]
                  ? renderHotspotGroup(h, "hotspot", () =>
                      runAngleAnimation(h.id),
                    )
                  : null,
              ),
          ),
          renderFlyingAngleLabels(),
          renderSideFlyClones(),
          showAngleArcs &&
            tempEqualText &&
            renderEqualTextFO(
              tempEqualText.pairId,
              tempEqualText.pos,
              "temp-eq-text",
              true,
              undefined,
              equalTextBorderBlink,
            ),
          showAngleArcs &&
            persistedArcs.map((a) =>
              renderEqualTextFO(
                a.pairId,
                a.text,
                `eq-${a.pairId}`,
                false,
                dehighlight ? 0.2 : 1,
              ),
            ),
        ),
      ),
    ),
    showActionRow &&
      React.createElement(
        "div",
        {
          className: "action-row" + (actionRowContent() ? " has-content" : ""),
        },
        actionRowContent(),
      ),
  );
};
