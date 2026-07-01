/* ── Triangle geometry (viewBox 0 0 894 527) ── */

const VIEWBOX = "0 0 894 527";

const TRI_ABC = {
  A: { x: 247.672, y: 115.261 },
  B: { x: 118.696, y: 374.425 },
  C: { x: 422.71, y: 294.179 },
};

const ABC_CENTROID = {
  x: (TRI_ABC.A.x + TRI_ABC.B.x + TRI_ABC.C.x) / 3,
  y: (TRI_ABC.A.y + TRI_ABC.B.y + TRI_ABC.C.y) / 3,
};

/** Tweak rotation (degrees) and translation to position triangle DEF on the right.
 *  Set USE_REFERENCE_DEF_POSITIONS to false to use transform-based positioning. */
const TRI_DEF_TRANSFORM = {
  rotation: -104.9,
  translateX: 680.343,
  translateY: -70.767,
};

const USE_REFERENCE_DEF_POSITIONS = true;

const TRI_DEF_SIDE_REFERENCE = {
  D: { x: 805.699, y: 241.587 },
  E: { x: 588.415, y: 50.3062 },
  F: { x: 587.787, y: 364.732 },
};

const COLOR_ABC = "#5AA6B6";
const COLOR_DEF = "#6C7890";
const COLOR_OVERLAP = "#4ade80";
const COLOR_CYAN = "#00ffff";
const COLOR_PURPLE = "#ff00ff";
const COLOR_WHITE = "#ffffff";

const LABEL_OFFSET = 34;
const LABEL_OFFSET_OVERLAP = 58;
const STROKE_WIDTH = 5;
const HIGHLIGHT_STROKE = 8;
const ARC_RADIUS = 50;
const HOTSPOT_RADIUS = 34;
const LABEL_FONT_SIZE = 34;
const ANGLE_TEXT_FONT_SIZE = 29;
const DIAGRAM_SHIFT_Y = 20;

const VERTEX_CORRESPONDENCE = { A: "D", B: "E", C: "F" };

const ANGLE_PAIR_CONFIG = {
  A: {
    abcVertex: "A",
    defVertex: "D",
    abcSides: ["B", "C"],
    defSides: ["E", "F"],
    textOffset: { x: 0, y: -83 },
  },
  B: {
    abcVertex: "B",
    defVertex: "E",
    abcSides: ["A", "C"],
    defSides: ["D", "F"],
    textOffset: { x: -8, y: 52 },
  },
  C: {
    abcVertex: "C",
    defVertex: "F",
    abcSides: ["A", "B"],
    defSides: ["D", "E"],
    textOffset: { x: 8, y: 52 },
  },
};

const SIDE_LENGTHS = { AB: "5 cm", BC: "6 cm", AC: "4 cm" };
const SIDE_DEF_MAP = { AB: "DE", BC: "EF", AC: "DF" };
const SIDE_LETTER_CONFIG = {
  AB: { abc: ["A", "B"], def: ["D", "E"] },
  BC: { abc: ["B", "C"], def: ["E", "F"] },
  AC: { abc: ["A", "C"], def: ["D", "F"] },
};
const SIDE_EQUAL_OFFSETS = {
  AB: { x: -72, y: 0 },
  BC: { x: 0, y: 58 },
  AC: { x: 72, y: 0 },
};
const SIDE_EQUAL_FONT_SIZE = 29;
const SIDE_EQUAL_CHAR_WIDTH = SIDE_EQUAL_FONT_SIZE * 0.62;
const SIDE_EQUAL_INTRA_GAP = 3;
const SIDE_EQUAL_EQ_PAD = 14;
const CM_LABEL_DISTANCE = 40;
const SIDE_MIDPOINT_RADIUS = 28;

function offsetPerpendicularFromSide(mid, p1, p2, centroid, dist) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const toCent = { x: centroid.x - mid.x, y: centroid.y - mid.y };
  const dot = nx * toCent.x + ny * toCent.y;
  const sign = dot > 0 ? -1 : 1;
  return {
    x: mid.x + sign * nx * dist,
    y: mid.y + sign * ny * dist,
  };
}

function midpoint(p1, p2) {
  return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
}

function sideKeyFromMidId(midId) {
  const name = midId.replace("mid-", "");
  if (name === "DE") return "AB";
  if (name === "EF") return "BC";
  if (name === "DF") return "AC";
  return name;
}

function getAbcSidePoints(sideKey) {
  const map = { AB: ["A", "B"], BC: ["B", "C"], AC: ["A", "C"] };
  const [a, b] = map[sideKey];
  return [TRI_ABC[a], TRI_ABC[b]];
}

function getDefSidePoints(sideKey, defPts) {
  const defName = SIDE_DEF_MAP[sideKey];
  const map = { DE: ["D", "E"], EF: ["E", "F"], DF: ["D", "F"] };
  const [a, b] = map[defName];
  return [defPts[a], defPts[b]];
}

function getSideEqualTextPos(sideKey) {
  const [p1, p2] = getAbcSidePoints(sideKey);
  const mid = midpoint(p1, p2);
  const off = SIDE_EQUAL_OFFSETS[sideKey];
  return { x: mid.x + off.x, y: mid.y + off.y };
}

function getSideEqualLayout(sideKey, anchorPos) {
  const defName = SIDE_DEF_MAP[sideKey];
  const abcLetters = SIDE_LETTER_CONFIG[sideKey].abc;
  const defLetters = SIDE_LETTER_CONFIG[sideKey].def;
  const charW = SIDE_EQUAL_CHAR_WIDTH;
  const abcSegW =
    abcLetters.length * charW +
    (abcLetters.length - 1) * SIDE_EQUAL_INTRA_GAP;
  const defSegW =
    defLetters.length * charW +
    (defLetters.length - 1) * SIDE_EQUAL_INTRA_GAP;
  const eqW = charW * 0.75;
  const totalW = abcSegW + SIDE_EQUAL_EQ_PAD * 2 + eqW + defSegW;

  let cursor = anchorPos.x - totalW / 2;
  const y = anchorPos.y;
  const letterTargets = {};

  abcLetters.forEach((letter) => {
    letterTargets[letter] = {
      x: cursor + charW / 2,
      y,
      color: COLOR_CYAN,
    };
    cursor += charW + SIDE_EQUAL_INTRA_GAP;
  });

  cursor += SIDE_EQUAL_EQ_PAD;
  const equalsPos = { x: cursor + eqW / 2, y };
  cursor += eqW + SIDE_EQUAL_EQ_PAD;

  defLetters.forEach((letter) => {
    letterTargets[letter] = {
      x: cursor + charW / 2,
      y,
      color: COLOR_PURPLE,
    };
    cursor += charW + SIDE_EQUAL_INTRA_GAP;
  });

  return {
    sideKey,
    defName,
    abcLetters,
    defLetters,
    letterTargets,
    equalsPos,
    anchorPos,
  };
}

function getCmLabelPositions(sideKey, defPts, abcCentroid, defCentroid) {
  const [ap1, ap2] = getAbcSidePoints(sideKey);
  const [dp1, dp2] = getDefSidePoints(sideKey, defPts);
  const abcMid = midpoint(ap1, ap2);
  const defMid = midpoint(dp1, dp2);
  return {
    abc: offsetPerpendicularFromSide(
      abcMid,
      ap1,
      ap2,
      abcCentroid,
      CM_LABEL_DISTANCE,
    ),
    def: offsetPerpendicularFromSide(
      defMid,
      dp1,
      dp2,
      defCentroid,
      CM_LABEL_DISTANCE,
    ),
  };
}

function getSideMidpoints(defPts) {
  const list = [];
  ["AB", "BC", "AC"].forEach((sideKey) => {
    const [p1, p2] = getAbcSidePoints(sideKey);
    const mid = midpoint(p1, p2);
    list.push({ id: `mid-${sideKey}`, cx: mid.x, cy: mid.y });
  });
  ["DE", "EF", "DF"].forEach((defSide) => {
    const map = { DE: ["D", "E"], EF: ["E", "F"], DF: ["D", "F"] };
    const [a, b] = map[defSide];
    const mid = midpoint(defPts[a], defPts[b]);
    list.push({ id: `mid-${defSide}`, cx: mid.x, cy: mid.y });
  });
  return list;
}

function rotatePoint(p, center, deg) {
  const rad = (deg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = p.x - center.x;
  const dy = p.y - center.y;
  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos,
  };
}

function computeDefSidePositions() {
  if (USE_REFERENCE_DEF_POSITIONS) {
    return clonePoints(TRI_DEF_SIDE_REFERENCE);
  }
  const map = { D: "A", E: "B", F: "C" };
  const result = {};
  const { rotation, translateX, translateY } = TRI_DEF_TRANSFORM;
  Object.keys(map).forEach((defKey) => {
    const abcKey = map[defKey];
    const rotated = rotatePoint(TRI_ABC[abcKey], ABC_CENTROID, rotation);
    result[defKey] = {
      x: rotated.x + translateX,
      y: rotated.y + translateY,
    };
  });
  return result;
}

function getOverlapDefPositions() {
  return getDefPointsFromTransform(ABC_CENTROID, 0);
}

const DEF_LOCAL = {
  D: {
    x: TRI_ABC.A.x - ABC_CENTROID.x,
    y: TRI_ABC.A.y - ABC_CENTROID.y,
  },
  E: {
    x: TRI_ABC.B.x - ABC_CENTROID.x,
    y: TRI_ABC.B.y - ABC_CENTROID.y,
  },
  F: {
    x: TRI_ABC.C.x - ABC_CENTROID.x,
    y: TRI_ABC.C.y - ABC_CENTROID.y,
  },
};

function getDefPointsFromTransform(centroid, rotationDeg) {
  const result = {};
  ["D", "E", "F"].forEach((key) => {
    const rotated = rotatePoint(DEF_LOCAL[key], { x: 0, y: 0 }, rotationDeg);
    result[key] = {
      x: centroid.x + rotated.x,
      y: centroid.y + rotated.y,
    };
  });
  return result;
}

function computeSideTransform() {
  const ref = TRI_DEF_SIDE_REFERENCE;
  const sideCentroid = getCentroid(ref);
  const abcAngle =
    (Math.atan2(
      TRI_ABC.B.y - TRI_ABC.A.y,
      TRI_ABC.B.x - TRI_ABC.A.x,
    ) *
      180) /
    Math.PI;
  const refAngle =
    (Math.atan2(ref.E.y - ref.D.y, ref.E.x - ref.D.x) * 180) / Math.PI;
  let sideRotation = refAngle - abcAngle;
  while (sideRotation > 180) sideRotation -= 360;
  while (sideRotation <= -180) sideRotation += 360;
  return { centroid: { ...sideCentroid }, rotation: sideRotation };
}

function getCentroid(pts) {
  const keys = Object.keys(pts);
  let sx = 0;
  let sy = 0;
  keys.forEach((k) => {
    sx += pts[k].x;
    sy += pts[k].y;
  });
  return { x: sx / keys.length, y: sy / keys.length };
}

function labelPos(vertex, centroid, dist) {
  const dx = vertex.x - centroid.x;
  const dy = vertex.y - centroid.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  return {
    x: vertex.x + (dx / len) * dist,
    y: vertex.y + (dy / len) * dist,
  };
}

function polarToCartesian(cx, cy, r, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M",
    x,
    y,
    "L",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    "Z",
  ].join(" ");
}

function vectorAngle(v) {
  return (Math.atan2(v.y, v.x) * 180) / Math.PI;
}

function getInnerAngleArc(vertex, adj1, adj2) {
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
}

function describeHotspotRing(cx, cy, rOuter, rInner) {
  const outer = [
    "M",
    cx - rOuter,
    cy,
    "A",
    rOuter,
    rOuter,
    0,
    1,
    0,
    cx + rOuter,
    cy,
    "A",
    rOuter,
    rOuter,
    0,
    1,
    0,
    cx - rOuter,
    cy,
    "Z",
  ].join(" ");

  if (rInner <= 0) return outer;

  const inner = [
    "M",
    cx - rInner,
    cy,
    "A",
    rInner,
    rInner,
    0,
    1,
    1,
    cx + rInner,
    cy,
    "A",
    rInner,
    rInner,
    0,
    1,
    1,
    cx - rInner,
    cy,
    "Z",
  ].join(" ");

  return `${outer} ${inner}`;
}

function lerpPt(from, to, t) {
  return {
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t,
  };
}

function pointsToPath(pts, order) {
  const p0 = pts[order[0]];
  return (
    `M${p0.x} ${p0.y} ` +
    order
      .slice(1)
      .map((k) => `L${pts[k].x} ${pts[k].y}`)
      .join(" ") +
    " Z"
  );
}

function clonePoints(pts) {
  const out = {};
  Object.keys(pts).forEach((k) => {
    out[k] = { x: pts[k].x, y: pts[k].y };
  });
  return out;
}

const MainCanvas = (props) => {
  const {
    step,
    onSetNextEnabled,
    onUpdateTexts,
    onSetNextLabel,
    onNext,
    onRegisterNudgeTarget,
    onHideNudge,
  } = props;
  const { useState, useEffect, useRef, useCallback, useMemo } = React;

  const actionBtnRef = useRef(null);
  const defPathRef = useRef(null);
  const animatingRef = useRef(false);
  const hotspotAnimRef = useRef([]);
  const sideTransformRef = useRef(computeSideTransform());

  const [defTransform, setDefTransform] = useState(() => ({
    centroid: { ...sideTransformRef.current.centroid },
    rotation: sideTransformRef.current.rotation,
  }));
  const defPoints = useMemo(
    () =>
      getDefPointsFromTransform(defTransform.centroid, defTransform.rotation),
    [defTransform],
  );
  const [showRecapBtn, setShowRecapBtn] = useState(true);
  const [overlapMode, setOverlapMode] = useState(false);
  const [defFill, setDefFill] = useState(COLOR_DEF);
  const [defClickable, setDefClickable] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [defLabelOffset, setDefLabelOffset] = useState(LABEL_OFFSET);
  const [defLabelOpacity, setDefLabelOpacity] = useState(1);
  const [actionText, setActionText] = useState(null);
  const [actionBtn, setActionBtn] = useState(null);
  const [visibleHotspots, setVisibleHotspots] = useState({});
  const [exploredAngles, setExploredAngles] = useState({});
  const [activeHighlight, setActiveHighlight] = useState(null);
  const [completedHighlight, setCompletedHighlight] = useState(null);
  const [visibleAngleTexts, setVisibleAngleTexts] = useState([]);
  const [angleTextFly, setAngleTextFly] = useState(null);
  const [tempEqualText, setTempEqualText] = useState(null);
  const [allAnglesExplored, setAllAnglesExplored] = useState(false);
  const [visibleSideMidpoints, setVisibleSideMidpoints] = useState({});
  const [exploredSides, setExploredSides] = useState({});
  const [visibleSideTexts, setVisibleSideTexts] = useState([]);
  const [activeSideHighlight, setActiveSideHighlight] = useState(null);
  const [sideFly, setSideFly] = useState(null);
  const [sideEqualBuild, setSideEqualBuild] = useState(null);
  const [allSidesExplored, setAllSidesExplored] = useState(false);
  const sideMidAnimRef = useRef([]);

  const abcCentroid = ABC_CENTROID;
  const defCentroid = getCentroid(defPoints);

  const playSnd = (snd) => {
    if (typeof playSound === "function") playSound(snd);
  };

  const updateNudgeTarget = useCallback(() => {
    if (step === 4 || step === 6) {
      onRegisterNudgeTarget(null);
      return;
    }
    if (actionBtnRef.current && (step === 1 || step === 2 || step === 3 || step === 5) && (showRecapBtn || actionBtn || defClickable)) {
      onRegisterNudgeTarget(actionBtnRef.current.getBoundingClientRect());
      return;
    }
    if (step === 2 && defClickable && defPathRef.current) {
      onRegisterNudgeTarget(defPathRef.current.getBoundingClientRect());
      return;
    }
    onRegisterNudgeTarget(null);
  }, [step, showRecapBtn, actionBtn, defClickable, onRegisterNudgeTarget]);

  useEffect(() => {
    const tid = setTimeout(updateNudgeTarget, 100);
    window.addEventListener("resize", updateNudgeTarget);
    return () => {
      clearTimeout(tid);
      window.removeEventListener("resize", updateNudgeTarget);
    };
  }, [updateNudgeTarget, showRecapBtn, actionBtn, actionText, allAnglesExplored, allSidesExplored, overlapMode, defClickable]);

  const animateSideMidpointsIn = useCallback(() => {
    sideMidAnimRef.current.forEach((tl) => tl.kill());
    sideMidAnimRef.current = [];

    Object.keys(visibleSideMidpoints).forEach((id) => {
      if (!visibleSideMidpoints[id]) return;
      const rings = [
        { el: document.getElementById(`side-${id}-outer`), target: 0.2, delay: 0 },
        { el: document.getElementById(`side-${id}-mid`), target: 0.35, delay: 0.12 },
        { el: document.getElementById(`side-${id}-center`), target: 0.55, delay: 0.24 },
      ];
      rings.forEach(({ el, target, delay }) => {
        if (!el) return;
        gsap.killTweensOf(el);
        gsap.set(el, { opacity: 0 });
        const tl = gsap.timeline({ delay });
        tl.to(el, { opacity: target, duration: 1, ease: "power2.out" });
        tl.to(el, {
          opacity: target + 0.12,
          duration: 1.3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
        sideMidAnimRef.current.push(tl);
      });
    });
  }, [visibleSideMidpoints]);

  const animateHotspotsIn = useCallback(() => {
    hotspotAnimRef.current.forEach((tl) => tl.kill());
    hotspotAnimRef.current = [];

    Object.keys(visibleHotspots).forEach((id) => {
      if (!visibleHotspots[id]) return;
      const rings = [
        { el: document.getElementById(`hotspot-${id}-outer`), target: 0.2, delay: 0 },
        { el: document.getElementById(`hotspot-${id}-mid`), target: 0.35, delay: 0.12 },
        { el: document.getElementById(`hotspot-${id}-center`), target: 0.55, delay: 0.24 },
      ];
      rings.forEach(({ el, target, delay }) => {
        if (!el) return;
        gsap.killTweensOf(el);
        gsap.set(el, { opacity: 0 });
        const tl = gsap.timeline({ delay });
        tl.to(el, { opacity: target, duration: 1, ease: "power2.out" });
        tl.to(el, {
          opacity: target + 0.12,
          duration: 1.3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
        hotspotAnimRef.current.push(tl);
      });
    });
  }, [visibleHotspots]);

  useEffect(() => {
    if (step !== 3) {
      hotspotAnimRef.current.forEach((tl) => tl.kill());
      hotspotAnimRef.current = [];
      return;
    }
    const active = Object.keys(visibleHotspots).some((k) => visibleHotspots[k]);
    if (!active) {
      hotspotAnimRef.current.forEach((tl) => tl.kill());
      hotspotAnimRef.current = [];
      return;
    }
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(animateHotspotsIn);
    });
    return () => cancelAnimationFrame(raf);
  }, [visibleHotspots, step, animateHotspotsIn]);

  useEffect(() => {
    if (step !== 5) {
      sideMidAnimRef.current.forEach((tl) => tl.kill());
      sideMidAnimRef.current = [];
      return;
    }
    const active = Object.keys(visibleSideMidpoints).some((k) => visibleSideMidpoints[k]);
    if (!active) {
      sideMidAnimRef.current.forEach((tl) => tl.kill());
      sideMidAnimRef.current = [];
      return;
    }
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(animateSideMidpointsIn);
    });
    return () => cancelAnimationFrame(raf);
  }, [visibleSideMidpoints, step, animateSideMidpointsIn]);

  useEffect(() => {
    if (step === 3) {
      setActionText(null);
      setActionBtn(null);
      setVisibleHotspots({ A: true, B: true, C: true, D: true, E: true, F: true });
      setExploredAngles({});
      setVisibleAngleTexts([]);
      setCompletedHighlight(null);
      setActiveHighlight(null);
      setAllAnglesExplored(false);
      onUpdateTexts(APP_DATA.steps[3].questionText, APP_DATA.steps[3].navText);
      onSetNextEnabled(false);
    }
    if (step === 4) {
      setActionBtn(null);
      setActionText(APP_DATA.steps[4].actionSummary);
      onUpdateTexts(APP_DATA.steps[4].questionText, APP_DATA.steps[4].navText);
      onSetNextLabel(APP_DATA.steps[4].nextText);
      onSetNextEnabled(true);
      onRegisterNudgeTarget(null);
    }
    if (step === 5) {
      const side = sideTransformRef.current;
      setDefTransform({
        centroid: { ...side.centroid },
        rotation: side.rotation,
      });
      setOverlapMode(false);
      setDefFill(COLOR_DEF);
      setDefLabelOffset(LABEL_OFFSET);
      setDefLabelOpacity(1);
      setVisibleAngleTexts([]);
      setCompletedHighlight(null);
      setActiveHighlight(null);
      setActionText(null);
      setActionBtn(null);
      setVisibleSideMidpoints({
        AB: true,
        BC: true,
        AC: true,
        DE: true,
        EF: true,
        DF: true,
      });
      setExploredSides({});
      setVisibleSideTexts([]);
      setActiveSideHighlight(null);
      setSideFly(null);
      setSideEqualBuild(null);
      setAllSidesExplored(false);
      onUpdateTexts(APP_DATA.steps[5].questionText, APP_DATA.steps[5].navText);
      onSetNextEnabled(false);
    }
    if (step === 6) {
      setActionBtn(null);
      setActionText(APP_DATA.steps[6].actionSummary);
      setActiveSideHighlight(null);
      onUpdateTexts(APP_DATA.steps[5].questionText, APP_DATA.steps[6].navText);
      onSetNextLabel(APP_DATA.steps[6].nextText);
      onSetNextEnabled(true);
      onRegisterNudgeTarget(null);
    }
  }, [step]);

  const runRecapAnimation = () => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    onHideNudge();
    playSnd("click");
    setShowRecapBtn(false);

    const side = sideTransformRef.current;
    const animState = {
      centroid: { ...side.centroid },
      rotation: side.rotation,
    };
    const labelAnim = { offset: LABEL_OFFSET, opacity: 1 };

    const syncTransform = () => {
      setDefTransform({
        centroid: { x: animState.centroid.x, y: animState.centroid.y },
        rotation: animState.rotation,
      });
    };

    const tl = gsap.timeline({
      onComplete: () => {
        setDefTransform({
          centroid: { ...ABC_CENTROID },
          rotation: 0,
        });
        setOverlapMode(true);
        setDefFill(COLOR_OVERLAP);
        setDefClickable(true);
        setDefLabelOffset(LABEL_OFFSET_OVERLAP);
        setDefLabelOpacity(0.4);
        setShowFeedback(true);
        requestAnimationFrame(() => setFeedbackVisible(true));
        animatingRef.current = false;
        onUpdateTexts(
          APP_DATA.steps[2].questionText,
          APP_DATA.steps[2].navText,
        );
        setTimeout(() => onNext(2), 500);
      },
    });

    tl.to(animState, {
      rotation: 0,
      duration: 0.7,
      ease: "power2.inOut",
      onUpdate: syncTransform,
    });

    tl.to(
      animState.centroid,
      {
        x: ABC_CENTROID.x,
        y: ABC_CENTROID.y,
        duration: 0.7,
        ease: "power2.inOut",
        onUpdate: syncTransform,
      },
      ">",
    );

    tl.to(
      labelAnim,
      {
        offset: LABEL_OFFSET_OVERLAP,
        opacity: 0.4,
        duration: 0.7,
        ease: "power2.inOut",
        onUpdate: () => {
          setDefLabelOffset(labelAnim.offset);
          setDefLabelOpacity(labelAnim.opacity);
        },
      },
      "<",
    );
  };

  const runRevertAnimation = () => {
    if (animatingRef.current || !defClickable) return;
    animatingRef.current = true;
    onHideNudge();
    playSnd("click");
    setDefClickable(false);

    setFeedbackVisible(false);
    setTimeout(() => setShowFeedback(false), 300);

    setTimeout(() => {
      setDefFill(COLOR_DEF);

      const side = sideTransformRef.current;
      const animState = {
        centroid: { ...ABC_CENTROID },
        rotation: 0,
      };
      const labelAnim = { offset: defLabelOffset, opacity: defLabelOpacity };

      const syncTransform = () => {
        setDefTransform({
          centroid: { x: animState.centroid.x, y: animState.centroid.y },
          rotation: animState.rotation,
        });
      };

      const tl = gsap.timeline({
        onComplete: () => {
          setDefTransform({
            centroid: { ...side.centroid },
            rotation: side.rotation,
          });
          setOverlapMode(false);
          setDefLabelOffset(LABEL_OFFSET);
          setDefLabelOpacity(1);
          setActionText(APP_DATA.steps[2].actionText);
          onUpdateTexts(
            APP_DATA.steps[2].questionText,
            APP_DATA.steps[2].navExplore,
          );
          onSetNextLabel(APP_DATA.steps[2].nextText);
          onSetNextEnabled(true);
          animatingRef.current = false;
          setTimeout(updateNudgeTarget, 100);
        },
      });

      tl.to(animState.centroid, {
        x: side.centroid.x,
        y: side.centroid.y,
        duration: 0.7,
        ease: "power2.inOut",
        onUpdate: syncTransform,
      });

      tl.to(
        labelAnim,
        {
          offset: LABEL_OFFSET,
          opacity: 1,
          duration: 0.7,
          ease: "power2.inOut",
          onUpdate: () => {
            setDefLabelOffset(labelAnim.offset);
            setDefLabelOpacity(labelAnim.opacity);
          },
        },
        "<",
      );

      tl.to(animState, {
        rotation: side.rotation,
        duration: 0.7,
        ease: "power2.inOut",
        onUpdate: syncTransform,
      });
    }, 300);
  };

  const getAngleEqualTextPos = (abcVertex) => {
    const cfg = ANGLE_PAIR_CONFIG[abcVertex];
    const v = TRI_ABC[cfg.abcVertex];
    return {
      x: v.x + cfg.textOffset.x,
      y: v.y + cfg.textOffset.y,
    };
  };

  const getEqualTextPartTargets = (abcVertex, pos) => {
    return {
      abc: { x: pos.x - 50, y: pos.y + 7 },
      def: { x: pos.x + 50, y: pos.y + 7 },
      equals: { x: pos.x, y: pos.y + 7 },
    };
  };

  const runAngleAnimation = (clickedVertex) => {
    const abcVertex =
      clickedVertex === "D" || clickedVertex === "E" || clickedVertex === "F"
        ? Object.keys(VERTEX_CORRESPONDENCE).find(
            (k) => VERTEX_CORRESPONDENCE[k] === clickedVertex,
          )
        : clickedVertex;

    if (!abcVertex || exploredAngles[abcVertex] || animatingRef.current) return;

    animatingRef.current = true;
    onHideNudge();
    playSnd("click");

    setCompletedHighlight(null);
    setActiveHighlight(null);
    setTempEqualText(null);
    setAngleTextFly(null);

    const cfg = ANGLE_PAIR_CONFIG[abcVertex];
    const abcV = TRI_ABC[cfg.abcVertex];
    const defV = defPoints[cfg.defVertex];
    const abcAdj1 = TRI_ABC[cfg.abcSides[0]];
    const abcAdj2 = TRI_ABC[cfg.abcSides[1]];
    const defAdj1 = defPoints[cfg.defSides[0]];
    const defAdj2 = defPoints[cfg.defSides[1]];

    const arcAbc = getInnerAngleArc(abcV, abcAdj1, abcAdj2);
    const arcDef = getInnerAngleArc(defV, defAdj1, defAdj2);
    const textPos = getAngleEqualTextPos(abcVertex);
    const clickedOnAbc = ["A", "B", "C"].includes(clickedVertex);
    const firstTri = clickedOnAbc ? "abc" : "def";

    setVisibleHotspots({});
    setActiveHighlight({
      abcVertex: cfg.abcVertex,
      defVertex: cfg.defVertex,
      abcSides: cfg.abcSides,
      defSides: cfg.defSides,
      arcAbc,
      arcDef,
      firstTriangle: firstTri,
      abcOpacity: 0,
      defOpacity: 0,
      blink: false,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        setCompletedHighlight({
          abcVertex: cfg.abcVertex,
          defVertex: cfg.defVertex,
          abcSides: cfg.abcSides,
          defSides: cfg.defSides,
          arcAbc,
          arcDef,
        });
        setActiveHighlight(null);
        setTempEqualText(null);
        setAngleTextFly(null);

        setVisibleAngleTexts((prev) => {
          if (prev.some((t) => t.abcVertex === abcVertex)) return prev;
          return [...prev, { abcVertex, textPos }];
        });

        const newExplored = { ...exploredAngles, [abcVertex]: true };
        setExploredAngles(newExplored);

        const remaining = {};
        ["A", "B", "C", "D", "E", "F"].forEach((v) => {
          const abcKey =
            v === "D" || v === "E" || v === "F"
              ? Object.keys(VERTEX_CORRESPONDENCE).find(
                  (k) => VERTEX_CORRESPONDENCE[k] === v,
                )
              : v;
          if (!newExplored[abcKey]) remaining[v] = true;
        });
        setVisibleHotspots(remaining);
        animatingRef.current = false;

        if (Object.keys(newExplored).length === 3) {
          setAllAnglesExplored(true);
          setActionBtn("summarize");
          onUpdateTexts(
            APP_DATA.steps[3].questionText,
            APP_DATA.steps[3].navSummarize,
          );
          setTimeout(updateNudgeTarget, 100);
        }
      },
    });

    tl.to(
      {},
      {
        duration: 0.5,
        onStart: () => {
          setActiveHighlight((h) => ({
            ...h,
            abcOpacity: firstTri === "abc" ? 1 : 0,
            defOpacity: firstTri === "def" ? 1 : 0,
          }));
        },
      },
    );

    tl.to({}, { duration: 0.5 });

    tl.to(
      {},
      {
        duration: 0.5,
        onStart: () => {
          setActiveHighlight((h) => ({
            ...h,
            abcOpacity: 1,
            defOpacity: 1,
          }));
        },
      },
    );

    tl.to(
      {},
      {
        duration: 2.5,
        onStart: () => {
          setActiveHighlight((h) => ({ ...h, blink: true }));
        },
        onComplete: () => {
          setActiveHighlight((h) => (h ? { ...h, blink: false } : h));
        },
      },
    );

    const fly = { t: 0 };
    let flyData = null;

    tl.to(fly, {
      t: 1,
      duration: 0.7,
      ease: "power2.inOut",
      onStart: () => {
        const targets = getEqualTextPartTargets(abcVertex, textPos);
        const fromA = labelPos(
          TRI_ABC[cfg.abcVertex],
          abcCentroid,
          LABEL_OFFSET,
        );
        const fromD = labelPos(
          defPoints[cfg.defVertex],
          defCentroid,
          defLabelOffset,
        );
        flyData = {
          abcVertex,
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
        setTempEqualText({ abcVertex, pos: textPos });
      },
    });

    tl.to({}, { duration: 0.3 });
  };

  const handleSummarize = () => {
    if (animatingRef.current) return;
    playSnd("click");
    onHideNudge();
    setCompletedHighlight(null);
    setActiveHighlight(null);
    onNext(4);
  };

  const handleSideSummarize = () => {
    if (animatingRef.current) return;
    playSnd("click");
    onHideNudge();
    setActiveSideHighlight(null);
    onNext(6);
  };

  const runSideAnimation = (midId) => {
    const sideKey = sideKeyFromMidId(midId);
    if (!sideKey || exploredSides[sideKey] || animatingRef.current) return;

    animatingRef.current = true;
    onHideNudge();
    playSnd("click");

    setActiveSideHighlight(null);
    setSideFly(null);
    setSideEqualBuild(null);
    setVisibleSideMidpoints({});

    const [ap1, ap2] = getAbcSidePoints(sideKey);
    const [dp1, dp2] = getDefSidePoints(sideKey, defPoints);
    const textPos = getSideEqualTextPos(sideKey);
    const sideLayout = getSideEqualLayout(sideKey, textPos);
    const cmPos = getCmLabelPositions(
      sideKey,
      defPoints,
      abcCentroid,
      defCentroid,
    );
    const letters = SIDE_LETTER_CONFIG[sideKey];
    const lengthLabel = SIDE_LENGTHS[sideKey];

    setActiveSideHighlight({
      sideKey,
      ap1,
      ap2,
      dp1,
      dp2,
      abcLineOpacity: 0,
      defLineOpacity: 0,
      showCm: false,
      cmBlink: false,
      cmPos,
      lengthLabel,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        setActiveSideHighlight(null);
        setSideFly(null);
        setSideEqualBuild(null);

        setVisibleSideTexts((prev) => {
          if (prev.some((t) => t.sideKey === sideKey)) return prev;
          return [...prev, { sideKey, layout: sideLayout }];
        });

        const newExplored = { ...exploredSides, [sideKey]: true };
        setExploredSides(newExplored);

        const remaining = {};
        getSideMidpoints(defPoints).forEach((m) => {
          const key = sideKeyFromMidId(m.id);
          if (!newExplored[key]) remaining[m.id.replace("mid-", "")] = true;
        });
        setVisibleSideMidpoints(remaining);
        animatingRef.current = false;

        if (Object.keys(newExplored).length === 3) {
          setAllSidesExplored(true);
          setActionBtn("summarize");
          onUpdateTexts(
            APP_DATA.steps[5].questionText,
            APP_DATA.steps[5].navSummarize,
          );
          setTimeout(updateNudgeTarget, 100);
        }
      },
    });

    tl.to(
      {},
      {
        duration: 0.4,
        onStart: () => {
          setActiveSideHighlight((h) => ({ ...h, abcLineOpacity: 1 }));
        },
      },
    );

    tl.to(
      {},
      {
        duration: 0.4,
        onStart: () => {
          setActiveSideHighlight((h) => ({ ...h, defLineOpacity: 1 }));
        },
      },
    );

    tl.to(
      {},
      {
        duration: 0.3,
        onStart: () => {
          setActiveSideHighlight((h) => ({ ...h, showCm: true }));
        },
      },
    );

    tl.to(
      {},
      {
        duration: 2.5,
        onStart: () => {
          setActiveSideHighlight((h) => ({ ...h, cmBlink: true }));
        },
        onComplete: () => {
          setActiveSideHighlight((h) =>
            h ? { ...h, cmBlink: false, showCm: false } : h,
          );
        },
      },
    );

    const fly = { t: 0 };
    let flyData = null;

    tl.to(fly, {
      t: 1,
      duration: 0.7,
      ease: "power2.inOut",
      onStart: () => {
        const from = {};
        letters.abc.forEach((letter) => {
          from[letter] = labelPos(
            TRI_ABC[letter],
            abcCentroid,
            LABEL_OFFSET,
          );
        });
        flyData = {
          sideKey,
          letters: { abc: letters.abc },
          from,
          to: sideLayout.letterTargets,
          t: 0,
          phase: "abc",
        };
        setSideFly({ ...flyData });
        setSideEqualBuild({
          layout: sideLayout,
          showAbc: false,
          showEquals: false,
          showDef: false,
        });
      },
      onUpdate: () => {
        if (flyData) setSideFly({ ...flyData, t: fly.t });
      },
      onComplete: () => {
        setSideFly(null);
        setSideEqualBuild({
          layout: sideLayout,
          showAbc: true,
          showEquals: false,
          showDef: false,
        });
      },
    });

    tl.to({}, {
      duration: 0.25,
      onStart: () => {
        setSideEqualBuild({
          layout: sideLayout,
          showAbc: true,
          showEquals: true,
          showDef: false,
        });
      },
    });

    const fly2 = { t: 0 };
    let flyData2 = null;

    tl.to(fly2, {
      t: 1,
      duration: 0.7,
      ease: "power2.inOut",
      onStart: () => {
        const from = {};
        letters.def.forEach((letter) => {
          from[letter] = labelPos(
            defPoints[letter],
            defCentroid,
            defLabelOffset,
          );
        });
        flyData2 = {
          sideKey,
          letters: { def: letters.def },
          from,
          to: sideLayout.letterTargets,
          t: 0,
          phase: "def",
        };
        setSideFly({ ...flyData2 });
      },
      onUpdate: () => {
        if (flyData2) setSideFly({ ...flyData2, t: fly2.t });
      },
      onComplete: () => {
        setSideFly(null);
        setSideEqualBuild({
          layout: sideLayout,
          showAbc: true,
          showEquals: true,
          showDef: true,
        });
      },
    });

    tl.to({}, { duration: 0.3 });
  };

  const renderTrianglePath = (pts, order, fill, stroke, extraProps) => {
    const props = extraProps || {};
    const { ref, ...rest } = props;
    return React.createElement("path", {
      ref,
      d: pointsToPath(pts, order),
      fill,
      stroke: stroke || COLOR_WHITE,
      strokeWidth: STROKE_WIDTH,
      ...rest,
    });
  };

  const renderLabel = (letter, vertex, centroid, offset, opacity, color) =>
    React.createElement(
      "text",
      {
        key: `label-${letter}`,
        x: labelPos(vertex, centroid, offset).x,
        y: labelPos(vertex, centroid, offset).y,
        fill: color || COLOR_WHITE,
        fontSize: LABEL_FONT_SIZE,
        fontWeight: 700,
        textAnchor: "middle",
        dominantBaseline: "middle",
        opacity,
        className: `vertex-label vertex-label-${letter}`,
        style: { transition: "opacity 0.3s ease" },
      },
      letter,
    );

  const renderHighlightLines = (highlight, isActive) => {
    if (!highlight) return null;
    const opacity = isActive ? highlight.abcOpacity : 1;
    const defOpacity = isActive ? highlight.defOpacity : 1;
    const blinkClass =
      isActive && highlight.blink ? " angle-arc-blink" : "";

    const abcV = TRI_ABC[highlight.abcVertex];
    const lines = highlight.abcSides.map((sideKey) =>
      React.createElement("line", {
        key: `abc-line-${sideKey}`,
        x1: abcV.x,
        y1: abcV.y,
        x2: TRI_ABC[sideKey].x,
        y2: TRI_ABC[sideKey].y,
        stroke: COLOR_CYAN,
        strokeWidth: HIGHLIGHT_STROKE,
        strokeLinecap: "round",
        opacity,
        className: "highlight-line",
      }),
    );

    const defV = defPoints[highlight.defVertex];
    const defLines = highlight.defSides.map((sideKey) =>
      React.createElement("line", {
        key: `def-line-${sideKey}`,
        x1: defV.x,
        y1: defV.y,
        x2: defPoints[sideKey].x,
        y2: defPoints[sideKey].y,
        stroke: COLOR_PURPLE,
        strokeWidth: HIGHLIGHT_STROKE,
        strokeLinecap: "round",
        opacity: defOpacity,
        className: "highlight-line",
      }),
    );

    const arcAbc = React.createElement("path", {
      key: "arc-abc",
      d: describeArc(
        abcV.x,
        abcV.y,
        ARC_RADIUS,
        highlight.arcAbc.start,
        highlight.arcAbc.end,
      ),
      fill: COLOR_CYAN,
      opacity: opacity * 0.75,
      className: "angle-arc" + blinkClass,
    });

    const arcDef = React.createElement("path", {
      key: "arc-def",
      d: describeArc(
        defV.x,
        defV.y,
        ARC_RADIUS,
        highlight.arcDef.start,
        highlight.arcDef.end,
      ),
      fill: COLOR_PURPLE,
      opacity: defOpacity * 0.75,
      className: "angle-arc" + blinkClass,
    });

    return React.createElement(
      "g",
      { className: "highlight-group" },
      lines,
      defLines,
      arcAbc,
      arcDef,
    );
  };

  const renderFlyingLabels = () => {
    if (!angleTextFly) return null;
    const { abcVertex, t, fromA, fromD, toA, toD } = angleTextFly;
    const defKey = VERTEX_CORRESPONDENCE[abcVertex];
    const posA = lerpPt(fromA, toA, t);
    const posD = lerpPt(fromD, toD, t);
    return React.createElement(
      "g",
      { className: "angle-fly-layer" },
      React.createElement(
        "text",
        {
          x: posA.x,
          y: posA.y,
          fill: COLOR_CYAN,
          fontSize: ANGLE_TEXT_FONT_SIZE,
          fontWeight: 700,
          textAnchor: "middle",
          dominantBaseline: "middle",
        },
        `∠${abcVertex}`,
      ),
      React.createElement(
        "text",
        {
          x: posD.x,
          y: posD.y,
          fill: COLOR_PURPLE,
          fontSize: ANGLE_TEXT_FONT_SIZE,
          fontWeight: 700,
          textAnchor: "middle",
          dominantBaseline: "middle",
        },
        `∠${defKey}`,
      ),
    );
  };

  const renderSideEqualSvgGroup = (layout, visibility, key) => {
    if (!layout) return null;
    const { abcLetters, defLetters, letterTargets, equalsPos } = layout;
    const showAbc = !visibility || visibility.showAbc;
    const showEquals = !visibility || visibility.showEquals;
    const showDef = !visibility || visibility.showDef;

    return React.createElement(
      "g",
      { key, className: "side-equal-svg-group" },
      showAbc &&
        abcLetters.map((letter) => {
          const pos = letterTargets[letter];
          return React.createElement(
            "text",
            {
              key: `side-ch-${letter}`,
              x: pos.x,
              y: pos.y,
              fill: COLOR_CYAN,
              fontSize: SIDE_EQUAL_FONT_SIZE,
              fontWeight: 700,
              textAnchor: "middle",
              dominantBaseline: "middle",
              className: "side-equal-char",
            },
            letter,
          );
        }),
      showEquals &&
        React.createElement(
          "text",
          {
            key: "side-eq-sign",
            x: equalsPos.x,
            y: equalsPos.y,
            fill: COLOR_WHITE,
            fontSize: SIDE_EQUAL_FONT_SIZE,
            fontWeight: 700,
            textAnchor: "middle",
            dominantBaseline: "middle",
            className: "side-equal-eq",
          },
          "=",
        ),
      showDef &&
        defLetters.map((letter) => {
          const pos = letterTargets[letter];
          return React.createElement(
            "text",
            {
              key: `side-ch-${letter}`,
              x: pos.x,
              y: pos.y,
              fill: COLOR_PURPLE,
              fontSize: SIDE_EQUAL_FONT_SIZE,
              fontWeight: 700,
              textAnchor: "middle",
              dominantBaseline: "middle",
              className: "side-equal-char",
            },
            letter,
          );
        }),
    );
  };

  const renderSideEqualText = (item, key) =>
    renderSideEqualSvgGroup(
      item.layout ||
        getSideEqualLayout(item.sideKey, item.textPos || item.layout?.anchorPos),
      { showAbc: true, showEquals: true, showDef: true },
      key,
    );

  const renderSideEqualBuild = () => {
    if (!sideEqualBuild || !sideEqualBuild.layout) return null;
    return renderSideEqualSvgGroup(sideEqualBuild.layout, sideEqualBuild, "side-equal-build");
  };

  const renderFlyingSideLetters = () => {
    if (!sideFly) return null;
    const { t, from, to, letters, phase } = sideFly;
    const letterList =
      phase === "def" ? letters.def || [] : letters.abc || [];
    return React.createElement(
      "g",
      { className: "side-fly-layer" },
      letterList.map((letter) => {
        const start = from[letter];
        const target = to[letter];
        if (!start || !target) return null;
        const pos = lerpPt(start, { x: target.x, y: target.y }, t);
        return React.createElement(
          "text",
          {
            key: `fly-side-${letter}`,
            x: pos.x,
            y: pos.y,
            fill: target.color,
            fontSize: SIDE_EQUAL_FONT_SIZE,
            fontWeight: 700,
            textAnchor: "middle",
            dominantBaseline: "middle",
          },
          letter,
        );
      }),
    );
  };

  const renderSideHighlight = (highlight) => {
    if (!highlight) return null;
    const blinkClass = highlight.cmBlink ? " cm-label-blink" : "";
    return React.createElement(
      "g",
      { className: "side-highlight-group" },
      React.createElement("line", {
        x1: highlight.ap1.x,
        y1: highlight.ap1.y,
        x2: highlight.ap2.x,
        y2: highlight.ap2.y,
        stroke: COLOR_CYAN,
        strokeWidth: HIGHLIGHT_STROKE,
        strokeLinecap: "round",
        opacity: highlight.abcLineOpacity,
        className: "highlight-line",
      }),
      React.createElement("line", {
        x1: highlight.dp1.x,
        y1: highlight.dp1.y,
        x2: highlight.dp2.x,
        y2: highlight.dp2.y,
        stroke: COLOR_PURPLE,
        strokeWidth: HIGHLIGHT_STROKE,
        strokeLinecap: "round",
        opacity: highlight.defLineOpacity,
        className: "highlight-line",
      }),
      highlight.showCm &&
        React.createElement(
          "g",
          { className: "cm-labels" + blinkClass },
          React.createElement(
            "text",
            {
              x: highlight.cmPos.abc.x,
              y: highlight.cmPos.abc.y,
              fill: COLOR_CYAN,
              fontSize: ANGLE_TEXT_FONT_SIZE,
              fontWeight: 700,
              textAnchor: "middle",
              dominantBaseline: "middle",
            },
            highlight.lengthLabel,
          ),
          React.createElement(
            "text",
            {
              x: highlight.cmPos.def.x,
              y: highlight.cmPos.def.y,
              fill: COLOR_PURPLE,
              fontSize: ANGLE_TEXT_FONT_SIZE,
              fontWeight: 700,
              textAnchor: "middle",
              dominantBaseline: "middle",
            },
            highlight.lengthLabel,
          ),
        ),
    );
  };

  const renderEqualText = (abcVertex, pos, key, animateIn) =>
    React.createElement(
      "foreignObject",
      {
        key,
        x: pos.x - 108,
        y: pos.y - 19,
        width: 216,
        height: 43,
        className: "ang-equal-fo" + (animateIn ? " ang-equal-fo--appear" : ""),
      },
      React.createElement("div", {
        className: "ang-equal-text",
        dangerouslySetInnerHTML: {
          __html: APP_DATA.steps[3].angleEqual[abcVertex],
        },
      }),
    );

  const hotspotVertices = () => {
    const list = [];
    ["A", "B", "C"].forEach((k) => {
      list.push({
        id: k,
        cx: TRI_ABC[k].x,
        cy: TRI_ABC[k].y,
      });
    });
    ["D", "E", "F"].forEach((k) => {
      list.push({
        id: k,
        cx: defPoints[k].x,
        cy: defPoints[k].y,
      });
    });
    return list;
  };

  const actionRowContent = () => {
    if (step === 4 && actionText) {
      return React.createElement("div", {
        className: "action-summary-text",
        dangerouslySetInnerHTML: { __html: actionText },
      });
    }
    if (step === 6 && actionText) {
      return React.createElement("div", {
        className: "action-summary-text",
        dangerouslySetInnerHTML: { __html: actionText },
      });
    }
    if (step === 2 && actionText) {
      return React.createElement("div", {
        className: "action-summary-text",
        dangerouslySetInnerHTML: { __html: actionText },
      });
    }
    if (step === 1 && showRecapBtn) {
      return React.createElement(
        "button",
        {
          ref: actionBtnRef,
          className: "btn",
          id: "recap-button",
          onClick: runRecapAnimation,
        },
        APP_DATA.actions.recapVisually,
      );
    }
    if (step === 3 && actionBtn === "summarize") {
      return React.createElement(
        "button",
        {
          ref: actionBtnRef,
          className: "btn",
          id: "summarize-button",
          onClick: handleSummarize,
        },
        APP_DATA.steps[3].actionSummarize,
      );
    }
    if (step === 5 && actionBtn === "summarize") {
      return React.createElement(
        "button",
        {
          ref: actionBtnRef,
          className: "btn",
          id: "side-summarize-button",
          onClick: handleSideSummarize,
        },
        APP_DATA.steps[5].actionSummarize,
      );
    }
    return null;
  };

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "div",
      { className: "svg-row" },
      showFeedback &&
        React.createElement("div", {
          className:
            "overlap-feedback-box" +
            (feedbackVisible ? " overlap-feedback-box--visible" : ""),
          dangerouslySetInnerHTML: { __html: APP_DATA.feedback.overlap },
        }),
      React.createElement(
        "svg",
        {
          className: "triangles-svg",
          viewBox: VIEWBOX,
          preserveAspectRatio: "xMidYMid meet",
        },
        React.createElement(
          "g",
          { transform: `translate(0, ${DIAGRAM_SHIFT_Y})` },
          React.createElement(
            "g",
            { className: "triangle-abc-layer" },
            renderTrianglePath(TRI_ABC, ["A", "B", "C"], COLOR_ABC),
            renderLabel("A", TRI_ABC.A, abcCentroid, LABEL_OFFSET, 1),
            renderLabel("B", TRI_ABC.B, abcCentroid, LABEL_OFFSET, 1),
            renderLabel("C", TRI_ABC.C, abcCentroid, LABEL_OFFSET, 1),
          ),
          React.createElement(
            "g",
            {
              className:
                "triangle-def-layer" +
                (defClickable ? " triangle-def-clickable" : ""),
              onClick: defClickable ? runRevertAnimation : undefined,
              style: { cursor: defClickable ? "pointer" : "default" },
            },
            renderTrianglePath(
              defPoints,
              ["D", "E", "F"],
              defFill,
              COLOR_WHITE,
              {
                ref: defPathRef,
                className: overlapMode ? "def-triangle-top" : "",
              },
            ),
            renderLabel(
              "D",
              defPoints.D,
              defCentroid,
              defLabelOffset,
              defLabelOpacity,
            ),
            renderLabel(
              "E",
              defPoints.E,
              defCentroid,
              defLabelOffset,
              defLabelOpacity,
            ),
            renderLabel(
              "F",
              defPoints.F,
              defCentroid,
              defLabelOffset,
              defLabelOpacity,
            ),
          ),
          (step === 3 || step === 4) &&
            visibleAngleTexts.map((item) =>
              renderEqualText(
                item.abcVertex,
                item.textPos,
                `eq-${item.abcVertex}`,
                false,
              ),
            ),
          (step === 5 || step === 6) &&
            visibleSideTexts.map((item) =>
              renderSideEqualText(item, `side-eq-${item.sideKey}`),
            ),
          step === 3 &&
            completedHighlight &&
            renderHighlightLines(completedHighlight, false),
          step === 3 && activeHighlight && renderHighlightLines(activeHighlight, true),
          step === 3 && renderFlyingLabels(),
          step === 3 &&
            tempEqualText &&
            renderEqualText(
              tempEqualText.abcVertex,
              tempEqualText.pos,
              "temp-eq",
              true,
            ),
          step === 5 && renderSideHighlight(activeSideHighlight),
          step === 5 && renderFlyingSideLetters(),
          step === 5 && renderSideEqualBuild(),
          step === 3 &&
            React.createElement(
              "g",
              { className: "hotspots-layer" },
              hotspotVertices().map((h) =>
                visibleHotspots[h.id]
                  ? React.createElement(
                      "g",
                      {
                        key: `hotspot-${h.id}`,
                        className: "hotspot-group",
                        onClick: () => runAngleAnimation(h.id),
                      },
                      React.createElement("path", {
                        id: `hotspot-${h.id}-outer`,
                        d: describeHotspotRing(
                          h.cx,
                          h.cy,
                          HOTSPOT_RADIUS,
                          HOTSPOT_RADIUS * 0.72,
                        ),
                        className: "hotspot-ring hotspot-ring-outer",
                      }),
                      React.createElement("path", {
                        id: `hotspot-${h.id}-mid`,
                        d: describeHotspotRing(
                          h.cx,
                          h.cy,
                          HOTSPOT_RADIUS * 0.72,
                          HOTSPOT_RADIUS * 0.48,
                        ),
                        className: "hotspot-ring hotspot-ring-mid",
                      }),
                      React.createElement("path", {
                        id: `hotspot-${h.id}-center`,
                        d: describeHotspotRing(
                          h.cx,
                          h.cy,
                          HOTSPOT_RADIUS * 0.48,
                          0,
                        ),
                        className: "hotspot-ring hotspot-ring-center",
                      }),
                      React.createElement("circle", {
                        cx: h.cx,
                        cy: h.cy,
                        r: HOTSPOT_RADIUS,
                        className: "hotspot-hit",
                      }),
                    )
                  : null,
              ),
            ),
          step === 5 &&
            React.createElement(
              "g",
              { className: "side-midpoints-layer" },
              getSideMidpoints(defPoints).map((h) => {
                const shortId = h.id.replace("mid-", "");
                if (!visibleSideMidpoints[shortId]) return null;
                return React.createElement(
                  "g",
                  {
                    key: `side-mid-${shortId}`,
                    className: "hotspot-group",
                    onClick: () => runSideAnimation(h.id),
                  },
                  React.createElement("path", {
                    id: `side-${shortId}-outer`,
                    d: describeHotspotRing(
                      h.cx,
                      h.cy,
                      SIDE_MIDPOINT_RADIUS,
                      SIDE_MIDPOINT_RADIUS * 0.72,
                    ),
                    className: "hotspot-ring hotspot-ring-outer",
                  }),
                  React.createElement("path", {
                    id: `side-${shortId}-mid`,
                    d: describeHotspotRing(
                      h.cx,
                      h.cy,
                      SIDE_MIDPOINT_RADIUS * 0.72,
                      SIDE_MIDPOINT_RADIUS * 0.48,
                    ),
                    className: "hotspot-ring hotspot-ring-mid",
                  }),
                  React.createElement("path", {
                    id: `side-${shortId}-center`,
                    d: describeHotspotRing(
                      h.cx,
                      h.cy,
                      SIDE_MIDPOINT_RADIUS * 0.48,
                      0,
                    ),
                    className: "hotspot-ring hotspot-ring-center",
                  }),
                  React.createElement("circle", {
                    cx: h.cx,
                    cy: h.cy,
                    r: SIDE_MIDPOINT_RADIUS,
                    className: "hotspot-hit",
                  }),
                );
              }),
            ),
        ),
      ),
    ),
    React.createElement(
      "div",
      {
        className:
          "action-row" + (actionRowContent() ? " has-content" : ""),
      },
      actionRowContent(),
    ),
  );
};
