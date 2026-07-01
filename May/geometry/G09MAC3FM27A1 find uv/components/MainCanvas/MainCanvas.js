/* ── Quadrilateral geometry (viewBox 0 0 894 527) ── */

const VIEWBOX = "0 0 894 480";

const QUAD_ABCD = {
  A: { x: 336, y: 128 },
  B: { x: 81, y: 252 },
  C: { x: 183.5, y: 363 },
  D: { x: 406.5, y: 366 },
};

const QUAD_PQRS_INITIAL = {
  P: { x: 673.055, y: 396.614 },
  Q: { x: 831.891, y: 161.727 },
  R: { x: 687.624, y: 116.848 },
  S: { x: 493, y: 225.75 },
};

const COLOR_FILL = "#5AA6B6";
const COLOR_WHITE = "#ffffff";
const COLOR_YELLOW = "#ffd700";
const COLOR_ORANGE = "#ff8c00";
const COLOR_GHOST_FILL = "#888888";
const COLOR_GHOST_STROKE = "#aaaaaa";

const STROKE_WIDTH = 5;
const ARC_RADIUS = 42;
const ANGLE_LABEL_INSET = ARC_RADIUS + 30;
const HOTSPOT_RADIUS = 30;
const VERTEX_HOTSPOT_RADIUS = 26;
const VERTEX_DOT_RADIUS = 7;
const LABEL_OFFSET = 32;
const ANGLE_TEXT_FONT_SIZE = 26;
const VERTEX_LABEL_FONT_SIZE = 30;
const POLYGON_TITLE_FONT_SIZE = 28;
const POLYGON_TITLE_GAP = 36;
const TICK_LENGTH = 14;
const TICK_GAP = 5;

const VERTEX_ORDER_ABC = ["A", "B", "C", "D"];
const VERTEX_ORDER_PQRS = ["P", "Q", "R", "S"];
const LABEL_ORDER_PQRS = ["P", "Q", "R", "S"];

function outwardLabelPos(vertex, centroid, dist) {
  const dx = vertex.x - centroid.x;
  const dy = vertex.y - centroid.y;
  const len = Math.hypot(dx, dy) || 1;
  return {
    x: vertex.x + (dx / len) * dist,
    y: vertex.y + (dy / len) * dist,
  };
}

/** Place angle label along vertex → centroid, inset from the vertex. */
function inwardAngleLabelPos(vertex, centroid, dist) {
  const dx = centroid.x - vertex.x;
  const dy = centroid.y - vertex.y;
  const len = Math.hypot(dx, dy) || 1;
  return {
    x: vertex.x + (dx / len) * dist,
    y: vertex.y + (dy / len) * dist,
  };
}

function getPolygonTitlePos(pts, order) {
  const centroid = getCentroid(pts);
  let minY = Infinity;
  order.forEach((k) => {
    minY = Math.min(minY, pts[k].y);
  });
  return {
    x: centroid.x,
    y: minY - POLYGON_TITLE_GAP,
  };
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

function computePqrsGeometry() {
  const abcCentroid = getCentroid(QUAD_ABCD);
  const referenceCentroid = getCentroid(QUAD_PQRS_INITIAL);

  // Aligned PQRS = ABCD translated horizontally only (same vertical level as Polygon 1)
  const translation = {
    x: referenceCentroid.x - abcCentroid.x,
    y: 0,
  };

  const aligned = {};
  VERTEX_ORDER_ABC.forEach((abc, i) => {
    const pqr = VERTEX_ORDER_PQRS[i];
    aligned[pqr] = {
      x: QUAD_ABCD[abc].x + translation.x,
      y: QUAD_ABCD[abc].y + translation.y,
    };
  });

  const alignedCentroid = getCentroid(aligned);

  // Polygon 2 starts rotated -150° (150° clockwise) around its centroid
  const INITIAL_ROTATION_DEG = -150;

  const local = {};
  VERTEX_ORDER_PQRS.forEach((k) => {
    local[k] = {
      x: aligned[k].x - alignedCentroid.x,
      y: aligned[k].y - alignedCentroid.y,
    };
  });

  return {
    aligned,
    alignedCentroid,
    local,
    initialRotation: INITIAL_ROTATION_DEG,
    rotationToAlignedDeg: 150,
  };
}

const PQRS_GEOM = computePqrsGeometry();

function getPqrsPointsFromTransform(centroid, rotationDeg) {
  const result = {};
  VERTEX_ORDER_PQRS.forEach((key) => {
    const rotated = rotatePoint(PQRS_GEOM.local[key], { x: 0, y: 0 }, rotationDeg);
    result[key] = {
      x: centroid.x + rotated.x,
      y: centroid.y + rotated.y,
    };
  });
  return result;
}

function labelPos(vertex, centroid, dist) {
  return outwardLabelPos(vertex, centroid, dist);
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
    "M", x, y,
    "L", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
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

function midpoint(p1, p2) {
  return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
}

function describeHotspotRing(cx, cy, rOuter, rInner) {
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
}

function pointsToPath(pts, order) {
  const p0 = pts[order[0]];
  return (
    `M${p0.x} ${p0.y} ` +
    order.slice(1).map((k) => `L${pts[k].x} ${pts[k].y}`).join(" ") +
    " Z"
  );
}

/** Anticlockwise vertex order for a consistent convex quadrilateral path. */
function getConvexVertexOrder(pts, keys) {
  const c = getCentroid(pts);
  return keys
    .slice()
    .sort(
      (a, b) =>
        Math.atan2(pts[a].y - c.y, pts[a].x - c.x) -
        Math.atan2(pts[b].y - c.y, pts[b].x - c.x),
    );
}

function getGhostPoints() {
  const result = {};
  VERTEX_ORDER_PQRS.forEach((k) => {
    result[k] = rotatePoint(
      PQRS_GEOM.aligned[k],
      PQRS_GEOM.alignedCentroid,
      PQRS_GEOM.initialRotation,
    );
  });
  return result;
}

function getSideTickGeometry(p1, p2, count) {
  const mid = midpoint(p1, p2);
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const ticks = [];
  if (count === 1) {
    ticks.push({
      x1: mid.x - nx * TICK_LENGTH,
      y1: mid.y - ny * TICK_LENGTH,
      x2: mid.x + nx * TICK_LENGTH,
      y2: mid.y + ny * TICK_LENGTH,
    });
  } else {
    const along = { x: dx / len, y: dy / len };
    [-TICK_GAP / 2, TICK_GAP / 2].forEach((off) => {
      const cx = mid.x + along.x * off;
      const cy = mid.y + along.y * off;
      ticks.push({
        x1: cx - nx * TICK_LENGTH,
        y1: cy - ny * TICK_LENGTH,
        x2: cx + nx * TICK_LENGTH,
        y2: cy + ny * TICK_LENGTH,
      });
    });
  }
  return ticks;
}

const MainCanvas = (props) => {
  const {
    step,
    onSetNextEnabled,
    onUpdateTexts,
    onSetTextsHidden,
    onSetNextLabel,
    onRegisterNudgeTarget,
    onHideNudge,
    onOpenHint,
  } = props;
  const { useState, useEffect, useRef, useCallback, useMemo } = React;

  const pqrsPathRef = useRef(null);
  const animatingRef = useRef(false);
  const hotspotAnimRef = useRef([]);

  const [pqrsTransform, setPqrsTransform] = useState(() => ({
    centroid: { ...PQRS_GEOM.alignedCentroid },
    rotation: PQRS_GEOM.initialRotation,
  }));
  const [rotationDone, setRotationDone] = useState(false);
  const [pqrsClickable, setPqrsClickable] = useState(false);
  const [showGhost, setShowGhost] = useState(false);
  const [actionText, setActionText] = useState(null);
  const [labeledVertices, setLabeledVertices] = useState({});
  const [nextPqrsLabel, setNextPqrsLabel] = useState(0);
  const [visibleHotspots, setVisibleHotspots] = useState({});
  const [hotspotShake, setHotspotShake] = useState(null);
  const [orangeAngles, setOrangeAngles] = useState({});
  const [qAngleFound, setQAngleFound] = useState(false);
  const [sAngleFound, setSAangleFound] = useState(false);
  const [glowAngle, setGlowAngle] = useState(null);
  const [vFound, setVFound] = useState(false);
  const [answerValue, setAnswerValue] = useState("");
  const [answerStatus, setAnswerStatus] = useState(null);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [bulbHighlighted, setBulbHighlighted] = useState(false);
  const [answerShake, setAnswerShake] = useState(false);

  const pqrsPoints = useMemo(
    () =>
      getPqrsPointsFromTransform(
        pqrsTransform.centroid,
        pqrsTransform.rotation,
      ),
    [pqrsTransform],
  );

  const abcCentroid = useMemo(() => getCentroid(QUAD_ABCD), []);
  const pqrsCentroid = useMemo(() => getCentroid(pqrsPoints), [pqrsPoints]);
  const ghostPoints = useMemo(() => getGhostPoints(), []);
  const abcPathOrder = useMemo(
    () => getConvexVertexOrder(QUAD_ABCD, VERTEX_ORDER_ABC),
    [],
  );
  const pqrsPathOrder = useMemo(
    () => getConvexVertexOrder(pqrsPoints, VERTEX_ORDER_PQRS),
    [pqrsPoints],
  );
  const ghostPathOrder = useMemo(
    () => getConvexVertexOrder(ghostPoints, VERTEX_ORDER_PQRS),
    [ghostPoints],
  );

  const playSnd = (snd) => {
    if (typeof playSound === "function") playSound(snd);
  };

  const updateNudgeTarget = useCallback(() => {
    if (step === 4 && pqrsClickable && pqrsPathRef.current) {
      onRegisterNudgeTarget(pqrsPathRef.current.getBoundingClientRect());
      return;
    }
    onRegisterNudgeTarget(null);
  }, [step, pqrsClickable, onRegisterNudgeTarget]);

  useEffect(() => {
    const tid = setTimeout(updateNudgeTarget, 100);
    window.addEventListener("resize", updateNudgeTarget);
    return () => {
      clearTimeout(tid);
      window.removeEventListener("resize", updateNudgeTarget);
    };
  }, [updateNudgeTarget, pqrsClickable, rotationDone, labeledVertices]);

  const animateHotspotsIn = useCallback(() => {
    hotspotAnimRef.current.forEach((tl) => tl.kill());
    hotspotAnimRef.current = [];

    Object.keys(visibleHotspots).forEach((id) => {
      if (!visibleHotspots[id]) return;
      const rings = [
        { el: document.getElementById(`hotspot-${id}-outer`), target: 0.25, delay: 0 },
        { el: document.getElementById(`hotspot-${id}-mid`), target: 0.4, delay: 0.1 },
        { el: document.getElementById(`hotspot-${id}-center`), target: 0.6, delay: 0.2 },
      ];
      rings.forEach(({ el, target, delay }) => {
        if (!el) return;
        gsap.killTweensOf(el);
        gsap.set(el, { opacity: 0 });
        const tl = gsap.timeline({ delay });
        tl.to(el, { opacity: target, duration: 0.8, ease: "power2.out" });
        tl.to(el, {
          opacity: target + 0.15,
          duration: 1.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
        hotspotAnimRef.current.push(tl);
      });
    });
  }, [visibleHotspots]);

  useEffect(() => {
    if (Object.keys(visibleHotspots).length > 0) {
      requestAnimationFrame(() => animateHotspotsIn());
    }
  }, [visibleHotspots, animateHotspotsIn]);

  useEffect(() => {
    if (step === 1) {
      setActionText(null);
      onSetNextEnabled(true);
    }
    if (step === 2) {
      setActionText(APP_DATA.steps[2].actionText);
      onSetNextEnabled(true);
    }
    if (step === 3) {
      setActionText(APP_DATA.steps[2].actionText);
      onSetNextEnabled(true);
    }
    if (step === 4) {
      if (!rotationDone) {
        setActionText(APP_DATA.steps[2].actionText);
        setPqrsClickable(true);
        onSetNextEnabled(false);
      } else {
        setActionText(null);
        onSetNextEnabled(true);
      }
    }
    if (step === 5) {
      setActionText(null);
      setLabeledVertices({});
      setNextPqrsLabel(0);
      onSetNextEnabled(false);
    }
    if (step === 6) {
      setActionText(null);
      setOrangeAngles({});
      setQAngleFound(false);
      setGlowAngle("Q");
      setVisibleHotspots({ A: true, B: true, C: true, D: true });
      onSetNextEnabled(false);
    }
    if (step === 7) {
      setActionText(null);
      setOrangeAngles((prev) => {
        const next = { ...prev };
        delete next.B;
        delete next.Q;
        return next;
      });
      setGlowAngle("S");
      setVisibleHotspots({ A: true, C: true, D: true });
      onSetNextEnabled(false);
    }
    if (step === 8) {
      setOrangeAngles((prev) => {
        const next = { ...prev };
        delete next.D;
        delete next.S;
        return next;
      });
      setActionText(APP_DATA.steps[8].actionText);
      onSetNextEnabled(true);
    }
    if (step === 9) {
      setActionText(APP_DATA.steps[9].actionText);
      onSetNextEnabled(true);
    }
    if (step === 10) {
      setActionText(null);
      setAnswerValue("");
      setAnswerStatus(null);
      setFeedbackVisible(false);
      setBulbHighlighted(false);
      setVFound(false);
      onSetNextLabel("\u00BB");
      onSetNextEnabled(false);
    }
    if (step === 11) {
      setActionText(APP_DATA.steps[11].actionText);
      onSetNextLabel(APP_DATA.steps[11].nextText);
      onSetNextEnabled(true);
    }
  }, [step]);

  const runRotationAnimation = () => {
    if (animatingRef.current || rotationDone) return;
    animatingRef.current = true;
    onHideNudge();
    playSnd("click");
    setPqrsClickable(false);
    onSetTextsHidden(true);
    onUpdateTexts("", "");

    setShowGhost(true);

    const animState = {
      rotation: pqrsTransform.rotation,
    };

    const syncTransform = () => {
      setPqrsTransform({
        centroid: { ...PQRS_GEOM.alignedCentroid },
        rotation: animState.rotation,
      });
    };

    const tl = gsap.timeline({
      onComplete: () => {
        setPqrsTransform({
          centroid: { ...PQRS_GEOM.alignedCentroid },
          rotation: 0,
        });
        setRotationDone(true);
        animatingRef.current = false;
        onSetTextsHidden(false);
        onUpdateTexts(
          APP_DATA.steps[4].questionAfterRotate,
          APP_DATA.steps[4].navAfterRotate,
        );
        onSetNextEnabled(true);
        setActionText(null);
      },
    });

    tl.to(animState, {
      rotation: 0,
      duration: 1.0,
      ease: "power2.inOut",
      onUpdate: syncTransform,
    });
  };

  const handlePqrsVertexClick = (vertexKey) => {
    if (step !== 5 || labeledVertices[vertexKey]) return;
    const expected = LABEL_ORDER_PQRS[nextPqrsLabel];
    if (vertexKey !== expected) {
      playSnd("wrong");
      setHotspotShake(vertexKey);
      setTimeout(() => setHotspotShake(null), 500);
      return;
    }
    playSnd("click");
    const newLabeled = { ...labeledVertices, [vertexKey]: expected };
    setLabeledVertices(newLabeled);
    const nextIdx = nextPqrsLabel + 1;
    setNextPqrsLabel(nextIdx);
    if (nextIdx >= 4) {
      onUpdateTexts(
        APP_DATA.steps[5].questionLabeled,
        APP_DATA.steps[5].navLabeled,
      );
      onSetNextEnabled(true);
    }
  };

  const handleNumpadNumber = (num) => {
    if (step !== 10 || vFound) return;
    setAnswerValue((prev) => {
      if (prev.length >= 3) return prev;
      return prev + num;
    });
    setAnswerStatus(null);
    setFeedbackVisible(false);
  };

  const handleNumpadClear = () => {
    if (step !== 10 || vFound) return;
    setAnswerValue("");
    setAnswerStatus(null);
    setFeedbackVisible(false);
  };

  const handleNumpadSubmit = () => {
    if (step !== 10 || vFound) return;
    const val = parseInt(answerValue, 10);
    if (answerValue.trim() === "" || isNaN(val)) return;

    if (val === 70) {
      playSnd("correct");
      setAnswerStatus("correct");
      setFeedbackVisible(true);
      setVFound(true);
      onSetNextEnabled(true);
      onUpdateTexts(
        APP_DATA.steps[10].questionText,
        APP_DATA.steps[10].navDone,
      );
    } else {
      playSnd("wrong");
      setAnswerStatus("wrong");
      setFeedbackVisible(true);
      setBulbHighlighted(true);
      setAnswerShake(true);
      setTimeout(() => setAnswerShake(false), 500);
    }
  };

  const handleAbcHotspotClick = (vertex) => {
    if (step === 6) {
      if (vertex !== "B") {
        playSnd("wrong");
        setHotspotShake(vertex);
        setTimeout(() => setHotspotShake(null), 500);
        return;
      }
      playSnd("correct");
      setVisibleHotspots({});
      setGlowAngle(null);
      setOrangeAngles({ B: true, Q: true });
      setQAngleFound(true);
      setActionText(APP_DATA.steps[6].actionText);
      onUpdateTexts(APP_DATA.steps[6].questionText, APP_DATA.steps[6].navDone);
      onSetNextEnabled(true);
    }
    if (step === 7) {
      if (vertex !== "D") {
        playSnd("wrong");
        setHotspotShake(vertex);
        setTimeout(() => setHotspotShake(null), 500);
        return;
      }
      playSnd("correct");
      setVisibleHotspots({});
      setGlowAngle(null);
      setOrangeAngles((prev) => ({ ...prev, D: true, S: true }));
      setSAangleFound(true);
      setActionText(APP_DATA.steps[7].actionText);
      onUpdateTexts(APP_DATA.steps[7].questionText, APP_DATA.steps[7].navDone);
      onSetNextEnabled(true);
    }
  };

  const showPolygonTitles = step >= 2 && step <= 4;
  const highlightUV = step === 3;
  const showAbcLabels = step >= 5;
  const abcDimmed = step === 9 || step === 10;
  const summarizeYellow = step === 11;
  const showRightPanel = step === 10;
  const showBulb = step === 10;
  const showPqrsVertexHotspots =
    step === 5 && Object.keys(labeledVertices).length < 4;

  const renderQuadPath = (pts, order, fill, stroke, extraProps) => {
    const pathProps = {
      d: pointsToPath(pts, order),
      fill,
      stroke: stroke || COLOR_WHITE,
      strokeWidth: STROKE_WIDTH,
      strokeLinejoin: "round",
      ...extraProps,
    };
    return React.createElement("path", pathProps);
  };

  const renderAngleArc = (vertex, adj1, adj2, options) => {
    const {
      fill = "none",
      stroke = COLOR_WHITE,
      strokeWidth = 2,
      className = "",
      id,
    } = options || {};
    const arc = getInnerAngleArc(vertex, adj1, adj2);
    return React.createElement("path", {
      id,
      d: describeArc(vertex.x, vertex.y, ARC_RADIUS, arc.start, arc.end),
      fill,
      stroke,
      strokeWidth,
      className: `angle-arc ${className}`,
    });
  };

  const renderAngleLabel = (text, vertex, shapeCentroid, color, className) => {
    const pos = inwardAngleLabelPos(vertex, shapeCentroid, ANGLE_LABEL_INSET);
    return React.createElement(
      "text",
      {
        x: pos.x,
        y: pos.y,
        fill: color || COLOR_WHITE,
        fontSize: ANGLE_TEXT_FONT_SIZE,
        fontWeight: 600,
        textAnchor: "middle",
        dominantBaseline: "middle",
        className: `angle-label ${className || ""}`,
      },
      text,
    );
  };

  const renderVertexLabel = (letter, vertex, centroid) => {
    const pos = labelPos(vertex, centroid, LABEL_OFFSET);
    return React.createElement(
      "text",
      {
        x: pos.x,
        y: pos.y,
        fill: COLOR_WHITE,
        fontSize: VERTEX_LABEL_FONT_SIZE,
        fontWeight: 700,
        textAnchor: "middle",
        dominantBaseline: "middle",
        className: "vertex-label",
      },
      letter,
    );
  };

  const renderSideTicks = (p1, p2, count, key) => {
    const ticks = getSideTickGeometry(p1, p2, count);
    return ticks.map((t, i) =>
      React.createElement("line", {
        key: `${key}-tick-${i}`,
        x1: t.x1,
        y1: t.y1,
        x2: t.x2,
        y2: t.y2,
        stroke: COLOR_WHITE,
        strokeWidth: 2.5,
        strokeLinecap: "round",
      }),
    );
  };

  const renderYellowVertexHotspot = (vertexKey, pts) => {
    if (labeledVertices[vertexKey]) return null;
    const v = pts[vertexKey];
    const shakeClass = hotspotShake === vertexKey ? " hotspot-shake" : "";
    return React.createElement(
      "g",
      {
        key: `pqrs-hotspot-${vertexKey}`,
        className: `pqrs-vertex-hotspot${shakeClass}`,
        onClick: () => handlePqrsVertexClick(vertexKey),
      },
      React.createElement("circle", {
        cx: v.x,
        cy: v.y,
        r: VERTEX_HOTSPOT_RADIUS,
        className: "pqrs-vertex-hotspot-circle",
      }),
      React.createElement("circle", {
        cx: v.x,
        cy: v.y,
        r: VERTEX_DOT_RADIUS,
        className: "pqrs-vertex-dot",
      }),
      React.createElement("circle", {
        cx: v.x,
        cy: v.y,
        r: VERTEX_HOTSPOT_RADIUS,
        className: "pqrs-vertex-hotspot-hit",
      }),
    );
  };

  const renderAbcHotspot = (vertexKey) => {
    if (!visibleHotspots[vertexKey]) return null;
    const v = QUAD_ABCD[vertexKey];
    const shakeClass = hotspotShake === vertexKey ? " hotspot-shake" : "";
    const isWrong = hotspotShake === vertexKey;
    return React.createElement(
      "g",
      {
        key: `abc-hotspot-${vertexKey}`,
        className: `hotspot-group${shakeClass}`,
        onClick: () => handleAbcHotspotClick(vertexKey),
      },
      React.createElement("path", {
        id: `hotspot-${vertexKey}-outer`,
        d: describeHotspotRing(v.x, v.y, HOTSPOT_RADIUS, HOTSPOT_RADIUS * 0.72),
        className: `hotspot-ring hotspot-ring-outer${isWrong ? " hotspot-ring-wrong" : ""}`,
      }),
      React.createElement("path", {
        id: `hotspot-${vertexKey}-mid`,
        d: describeHotspotRing(v.x, v.y, HOTSPOT_RADIUS * 0.72, HOTSPOT_RADIUS * 0.48),
        className: `hotspot-ring hotspot-ring-mid${isWrong ? " hotspot-ring-wrong" : ""}`,
      }),
      React.createElement("path", {
        id: `hotspot-${vertexKey}-center`,
        d: describeHotspotRing(v.x, v.y, HOTSPOT_RADIUS * 0.48, 0),
        className: `hotspot-ring hotspot-ring-center${isWrong ? " hotspot-ring-wrong" : ""}`,
      }),
      React.createElement("circle", {
        cx: v.x,
        cy: v.y,
        r: HOTSPOT_RADIUS,
        className: "hotspot-hit",
      }),
    );
  };

  const renderAbcAngles = () => {
    const elems = [];
    const angleConfig = [
      { key: "B", adj: ["A", "C"], label: APP_DATA.labels.angle80 },
      { key: "C", adj: ["B", "D"], label: APP_DATA.labels.angle135 },
      { key: "D", adj: ["C", "A"], label: APP_DATA.labels.angle75 },
    ];
    angleConfig.forEach(({ key, adj, label }) => {
      const v = QUAD_ABCD[key];
      const isOrange = orangeAngles[key];
      elems.push(
        renderAngleArc(v, QUAD_ABCD[adj[0]], QUAD_ABCD[adj[1]], {
          fill: isOrange ? COLOR_ORANGE : "none",
          stroke: isOrange ? COLOR_WHITE : COLOR_WHITE,
          strokeWidth: isOrange ? 2.5 : 2,
          id: `abc-angle-${key}`,
        }),
      );
      elems.push(renderAngleLabel(label, v, abcCentroid, COLOR_WHITE));
    });
    return elems;
  };

  const renderPqrsAngles = () => {
    const elems = [];
    const p = pqrsPoints;

    const renderP = () => {
      const isYellow = highlightUV || summarizeYellow;
      const isOrange = orangeAngles.P;
      const fill = summarizeYellow
        ? COLOR_YELLOW
        : isOrange
          ? COLOR_ORANGE
          : isYellow
            ? COLOR_YELLOW
            : "none";
      elems.push(
        renderAngleArc(p.P, p.S, p.Q, {
          fill,
          stroke: COLOR_WHITE,
          strokeWidth: summarizeYellow || isOrange ? 2.5 : 2,
          id: "pqrs-angle-P",
        }),
      );
      const pLabel = vFound ? APP_DATA.labels.vEquals : APP_DATA.labels.v;
      const pLabelColor =
        summarizeYellow || (highlightUV && !vFound) ? COLOR_YELLOW : COLOR_WHITE;
      elems.push(
        renderAngleLabel(pLabel, p.P, pqrsCentroid, pLabelColor, summarizeYellow || (highlightUV && !vFound) ? "angle-label-yellow" : ""),
      );
    };

    const renderQ = () => {
      if (qAngleFound) {
        elems.push(
          renderAngleArc(p.Q, p.P, p.R, {
            fill: orangeAngles.Q ? COLOR_ORANGE : "none",
            stroke: COLOR_WHITE,
            strokeWidth: orangeAngles.Q ? 2.5 : 2,
            id: "pqrs-angle-Q",
          }),
        );
        elems.push(
          renderAngleLabel(APP_DATA.labels.angle80, p.Q, pqrsCentroid, COLOR_WHITE),
        );
      } else if (glowAngle === "Q" && step === 6) {
        elems.push(
          renderAngleArc(p.Q, p.P, p.R, {
            fill: COLOR_ORANGE,
            stroke: COLOR_WHITE,
            strokeWidth: 2.5,
            className: "angle-glow-pulse",
            id: "pqrs-angle-Q-glow",
          }),
        );
      }
    };

    const renderR = () => {
      elems.push(
        renderAngleArc(p.R, p.Q, p.S, {
          fill: "none",
          stroke: COLOR_WHITE,
          strokeWidth: 2,
          id: "pqrs-angle-R",
        }),
      );
      elems.push(
        renderAngleLabel(APP_DATA.labels.angle135, p.R, pqrsCentroid, COLOR_WHITE),
      );
    };

    const renderS = () => {
      const isYellow = highlightUV || summarizeYellow;
      const isOrange = orangeAngles.S;
      const isGlow = glowAngle === "S" && step === 7 && !sAngleFound;
      const fill = summarizeYellow
        ? COLOR_YELLOW
        : isOrange || isGlow
          ? COLOR_ORANGE
          : isYellow
            ? COLOR_YELLOW
            : "none";
      elems.push(
        renderAngleArc(p.S, p.R, p.P, {
          fill,
          stroke: COLOR_WHITE,
          strokeWidth: summarizeYellow || isOrange || isGlow ? 2.5 : 2,
          className: isGlow ? "angle-glow-pulse" : "",
          id: isGlow ? "pqrs-angle-S-glow" : "pqrs-angle-S",
        }),
      );
      const label = sAngleFound
        ? APP_DATA.labels.uEquals
        : APP_DATA.labels.u;
      const labelColor =
        summarizeYellow || (isYellow && !sAngleFound)
          ? COLOR_YELLOW
          : COLOR_WHITE;
      elems.push(
        renderAngleLabel(
          label,
          p.S,
          pqrsCentroid,
          labelColor,
          summarizeYellow || (isYellow && !sAngleFound) ? "angle-label-yellow" : "",
        ),
      );
    };

    renderP();
    renderQ();
    renderR();
    renderS();
    return elems;
  };

  const abcTitlePos = getPolygonTitlePos(QUAD_ABCD, VERTEX_ORDER_ABC);
  const pqrsTitlePos = getPolygonTitlePos(pqrsPoints, VERTEX_ORDER_PQRS);

  const actionRowContent = () => {
    if (!actionText) return null;
    return React.createElement("div", {
      className: "action-summary-text",
      dangerouslySetInnerHTML: { __html: actionText },
    });
  };

  const renderRightPanel = () => {
    if (!showRightPanel) return null;
    const boxClass =
      "answer-box" +
      (answerStatus === "wrong" ? " answer-box-wrong" : "") +
      (answerStatus === "correct" ? " answer-box-correct" : "") +
      (answerShake ? " answer-box-shake" : "");

    return React.createElement(
      "div",
      { className: "right-panel" },
      React.createElement(
        "div",
        { className: "right-panel-body" },
        React.createElement(
          "div",
          { className: "math-row" },
          React.createElement("span", { className: "math-var" }, "v"),
          React.createElement("span", { className: "math-eq" }, " = "),
          React.createElement(
            "span",
            { className: boxClass },
            answerValue || "\u00A0",
          ),
          React.createElement("span", { className: "math-degree" }, "\u00B0"),
        ),
        React.createElement(
          "div",
          { className: "right-panel-numpad-wrap" },
          React.createElement(Numpad, {
            disabled: vFound,
            onNumberClick: handleNumpadNumber,
            onClear: handleNumpadClear,
            onSubmit: handleNumpadSubmit,
          }),
        ),
      ),
      React.createElement(
        "div",
        { className: "right-panel-feedback-slot" },
        React.createElement(
          "div",
          {
            className:
              "numpad-feedback" +
              (feedbackVisible
                ? answerStatus === "correct"
                  ? " numpad-feedback-correct"
                  : " numpad-feedback-wrong"
                : " numpad-feedback--hidden"),
          },
          feedbackVisible
            ? answerStatus === "correct"
              ? APP_DATA.steps[10].feedbackCorrect
              : APP_DATA.steps[10].feedbackWrong
            : "\u00A0",
        ),
      ),
    );
  };

  return React.createElement(
    "div",
    { className: "canvas-layout" },
    React.createElement(
      "div",
      {
        className:
          "main-canvas-container" +
          (showRightPanel ? " main-canvas-container--with-panel" : ""),
      },
      showBulb &&
        React.createElement(
          "button",
          {
            type: "button",
            className:
              "bulb-btn" + (bulbHighlighted ? " bulb-btn--highlighted" : ""),
            onClick: () => {
              if (bulbHighlighted && onOpenHint) {
                playSnd("click");
                onOpenHint();
              }
            },
            "aria-label": "Hint",
          },
          React.createElement("img", {
            src: "assets/bulb.png",
            onError: (e) => {
              e.target.onerror = null;
              e.target.src = "assets/bulb.svg";
            },
            alt: "",
            className: "bulb-img",
          }),
        ),
    React.createElement(
      "div",
      { className: "svg-row" },
      React.createElement(
        "svg",
        {
          className: "triangles-svg",
          viewBox: VIEWBOX,
          preserveAspectRatio: "xMidYMid meet",
        },
        showPolygonTitles &&
          React.createElement(
            "text",
            {
              x: abcTitlePos.x,
              y: abcTitlePos.y,
              fill: COLOR_WHITE,
              fontSize: POLYGON_TITLE_FONT_SIZE,
              fontWeight: 600,
              textAnchor: "middle",
              dominantBaseline: "auto",
              className: "polygon-title",
            },
            APP_DATA.steps[2].polygon1,
          ),
        showPolygonTitles &&
          React.createElement(
            "text",
            {
              x: pqrsTitlePos.x,
              y: pqrsTitlePos.y,
              fill: COLOR_WHITE,
              fontSize: POLYGON_TITLE_FONT_SIZE,
              fontWeight: 600,
              textAnchor: "middle",
              dominantBaseline: "auto",
              className: "polygon-title",
            },
            APP_DATA.steps[2].polygon2,
          ),
        React.createElement(
          "g",
          {
            className:
              "quad-abcd-layer" + (abcDimmed ? " quad-abcd-layer--dimmed" : ""),
          },
          renderQuadPath(QUAD_ABCD, abcPathOrder, COLOR_FILL),
          renderSideTicks(QUAD_ABCD.B, QUAD_ABCD.C, 2, "bc"),
          renderSideTicks(QUAD_ABCD.C, QUAD_ABCD.D, 1, "cd"),
          renderAbcAngles(),
          showAbcLabels &&
            VERTEX_ORDER_ABC.map((k) =>
              renderVertexLabel(k, QUAD_ABCD[k], abcCentroid),
            ),
          (step === 6 || step === 7) &&
            React.createElement(
              "g",
              { className: "hotspots-layer" },
              VERTEX_ORDER_ABC.map((k) => renderAbcHotspot(k)),
            ),
        ),
        showGhost &&
          React.createElement(
            "g",
            { className: "ghost-polygon-layer" },
            renderQuadPath(ghostPoints, ghostPathOrder, COLOR_GHOST_FILL, COLOR_GHOST_STROKE, {
              fillOpacity: 0.2,
              strokeWidth: 3,
              strokeDasharray: "10 8",
            }),
          ),
        React.createElement(
          "g",
          {
            className:
              "quad-pqrs-layer" +
              (pqrsClickable ? " quad-pqrs-clickable" : ""),
            onClick: pqrsClickable ? runRotationAnimation : undefined,
            style: { cursor: pqrsClickable ? "pointer" : "default" },
          },
          renderQuadPath(
            pqrsPoints,
            pqrsPathOrder,
            COLOR_FILL,
            COLOR_WHITE,
            {
              ref: pqrsPathRef,
              className: "pqrs-polygon-path",
            },
          ),
          renderSideTicks(pqrsPoints.Q, pqrsPoints.R, 2, "qr"),
          renderSideTicks(pqrsPoints.R, pqrsPoints.S, 1, "rs"),
          renderPqrsAngles(),
          showAbcLabels &&
            VERTEX_ORDER_PQRS.map((k) =>
              labeledVertices[k] || step >= 9
                ? renderVertexLabel(k, pqrsPoints[k], pqrsCentroid)
                : null,
            ),
          showPqrsVertexHotspots &&
            VERTEX_ORDER_PQRS.map((k) =>
              renderYellowVertexHotspot(k, pqrsPoints),
            ),
        ),
      ),
    ),
    React.createElement(
      "div",
      {
        className: "action-row" + (actionText ? " has-content" : ""),
      },
      actionRowContent(),
    ),
    ),
    renderRightPanel(),
  );
};
