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
const LABEL_DIST_INSIDE_ARC = 1.45;

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
  insideDistOverride
) => {
  const vtx = tri === "abc" ? TRI_ABC[letter] : TRI_DEF[letter];
  const centroid = tri === "abc" ? ABC_CENTROID : DEF_CENTROID;
  const center = tri === "abc" ? abcCenter : NEST_CENTER;
  const scale = S;
  const local =
    tri === "abc"
      ? labelPosLerp(
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

const MainCanvas = (props) => {
  const {
    step,
    onSetNextEnabled,
    onUpdateTexts,
    onNext,
    onRegisterNudgeTarget,
    onHideNudge,
  } = props;
  const { useState, useEffect, useRef, useCallback } = React;

  const abcGroupRef = useRef(null);
  const defGroupRef = useRef(null);
  const actionBtnRef = useRef(null);
  const animatingRef = useRef(false);
  const hotspotAnimRef = useRef([]);

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
  const [exploredPairs, setExploredPairs] = useState({});
  const [visibleHotspots, setVisibleHotspots] = useState({});
  const [dehighlight, setDehighlight] = useState(null);
  const [persistedArcs, setPersistedArcs] = useState([]);
  const [tempArcs, setTempArcs] = useState(null);
  const [tempEqualText, setTempEqualText] = useState(null);
  const [angleTextFly, setAngleTextFly] = useState(null);
  const [allExplored, setAllExplored] = useState(false);

  const playSnd = (snd) => {
    if (typeof playSound === "function") playSound(snd);
  };

  const getSideOpacity = (tri, sideName) => {
    if (!dehighlight) return 1;
    if (tri === "abc" && dehighlight.fadeSidesAbc.includes(sideName)) return 0.2;
    if (tri === "def" && dehighlight.fadeSidesDef.includes(sideName)) return 0.2;
    return 1;
  };

  const getLabelOpacity = (label) => {
    if (labelDimmed) return 0.2;
    if (dehighlight && dehighlight.fadeLabels.includes(label)) return 0.2;
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
    if (step === 3) return;
    if (actionBtnRef.current && (step === 1 || step === 2) && actionBtn) {
      onRegisterNudgeTarget(actionBtnRef.current.getBoundingClientRect());
    } else {
      onRegisterNudgeTarget(null);
    }
  }, [step, actionBtn, onRegisterNudgeTarget]);

  useEffect(() => {
    const tid = setTimeout(updateNudgeTarget, 100);
    window.addEventListener("resize", updateNudgeTarget);
    return () => {
      clearTimeout(tid);
      window.removeEventListener("resize", updateNudgeTarget);
    };
  }, [updateNudgeTarget, actionBtn, actionDisabled, allExplored, step]);

  const animateHotspotsIn = useCallback(() => {
    hotspotAnimRef.current.forEach((tl) => tl.kill());
    hotspotAnimRef.current = [];

    Object.keys(visibleHotspots).forEach((id) => {
      if (!visibleHotspots[id]) return;

      const rings = [
        {
          el: document.getElementById(`hotspot-${id}-outer`),
          target: HOTSPOT_OPACITY.outer,
          delay: 0,
        },
        {
          el: document.getElementById(`hotspot-${id}-mid`),
          target: HOTSPOT_OPACITY.mid,
          delay: 0.12,
        },
        {
          el: document.getElementById(`hotspot-${id}-center`),
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
  }, [visibleHotspots]);

  useEffect(() => {
    if (step !== 2) {
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

    return () => {
      cancelAnimationFrame(raf);
    };
  }, [visibleHotspots, step, animateHotspotsIn]);

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
      onUpdateTexts(APP_DATA.steps[2].questionText, APP_DATA.steps[2].navText);
    }
    if (step === 3) {
      setActionBtn(null);
      setShowRecapText(false);
      onUpdateTexts(APP_DATA.steps[3].questionText, APP_DATA.steps[3].navText);
      onSetNextEnabled(true);
      onRegisterNudgeTarget(null);
    }
  }, [step]);

  const runRecapAnimation = () => {
    if (animatingRef.current) return;
    animatingRef.current = true;
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

    tl.to({}, {
      duration: 0.9,
      onStart: () => {
        setAbcScaleMul(2);
        setLabelDimmed(true);
      },
    });

    tl.to({}, { duration: 0.5 });

    tl.to({}, {
      duration: 0.9,
      onStart: () => {
        setAbcScaleMul(1);
        setLabelDimmed(false);
      },
    });
  };

  const handleRecapClick = () => {
    if (actionDisabled || recapDone) return;
    runRecapAnimation();
  };

  const handleExploreAnglesClick = () => {
    if (actionDisabled) return;
    playSnd("click");
    onHideNudge();
    onNext(2);
  };

  const handleSummarizeClick = () => {
    if (actionDisabled) return;
    playSnd("click");
    onHideNudge();
    onNext(3);
  };

  const runAngleAnimation = (pairId) => {
    if (animatingRef.current || exploredPairs[pairId]) return;
    animatingRef.current = true;
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
        setTempEqualText(null);
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
        }
      },
    });

    tl.to({}, {
      duration: 0.3,
      onStart: () => {
        setTempArcs({
          pairId,
          abc: { ...arcAbc, r: ARC_RADIUS_SMALL },
          def: { ...arcDef, r: ARC_RADIUS_LARGE },
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
      },
    });

    tl.to({}, { duration: 0.6 });

    tl.to({}, {
      duration: 0.9,
      onStart: () => setAbcPos(NEST_CENTER),
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
        fontSize: LABEL_FONT_SIZE,
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
  const abcLabelScale = S;

  const abcTransform = (scale) =>
    `translate(${abcPos.x}, ${abcPos.y}) scale(${scale}) translate(${-ABC_CENTROID.x}, ${-ABC_CENTROID.y})`;

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

  const renderAngleArcInGroup = (tri, vertexKey, arcData, radius, pairId) => {
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
      opacity: 0.85,
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

  const renderEqualTextFO = (pairId, pos, key, animateIn) => {
    const fo = getEqualTextForeignObjectProps(pairId, pos);
    return React.createElement(
      "foreignObject",
      {
        key: key,
        x: fo.x,
        y: fo.y,
        width: fo.width,
        height: fo.height,
        className:
          fo.className + (animateIn ? " ang-equal-fo--appear" : ""),
      },
      React.createElement("div", {
        className: "ang-equal-text",
        dangerouslySetInnerHTML: {
          __html: APP_DATA.steps[2].angleEqual[pairId],
        },
      })
    );
  };

  const showActionRow = step >= 1;

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

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "div",
      { className: "svg-row" },
      showRecapText &&
        React.createElement("div", {
          className: "recap-text-box",
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
              ref: defGroupRef,
              className: "triangle-group triangle-layer-back",
              transform: `translate(${defPos.x}, ${defPos.y}) scale(${S}) translate(${-DEF_CENTROID.x}, ${-DEF_CENTROID.y})`,
            },
            renderSide("def", "DE", TRI_DEF.D, TRI_DEF.E),
            renderSide("def", "EF", TRI_DEF.E, TRI_DEF.F),
            renderSide("def", "DF", TRI_DEF.D, TRI_DEF.F),
            tempArcs &&
              renderAngleArcInGroup(
                "def",
                DEF_KEYS[tempArcs.pairId],
                tempArcs.def,
                tempArcs.def.r,
                tempArcs.pairId
              ),
            persistedArcs.map((a) =>
              renderAngleArcInGroup(
                "def",
                DEF_KEYS[a.pairId],
                a.def,
                a.def.r,
                a.pairId
              )
            ),
            renderLabel("def", "D", TRI_DEF.D, true),
            renderLabel("def", "E", TRI_DEF.E, true),
            renderLabel("def", "F", TRI_DEF.F, true)
          ),
          React.createElement(
            "g",
            {
              ref: abcGroupRef,
              className: "triangle-group triangle-layer-front",
              transform: abcTransform(effectiveAbcScale),
            },
            renderSide("abc", "AB", TRI_ABC.A, TRI_ABC.B),
            renderSide("abc", "BC", TRI_ABC.B, TRI_ABC.C),
            renderSide("abc", "AC", TRI_ABC.A, TRI_ABC.C),
            tempArcs &&
              renderAngleArcInGroup(
                "abc",
                ABC_KEYS[tempArcs.pairId],
                tempArcs.abc,
                tempArcs.abc.r,
                tempArcs.pairId
              ),
            persistedArcs.map((a) =>
              renderAngleArcInGroup(
                "abc",
                ABC_KEYS[a.pairId],
                a.abc,
                a.abc.r,
                a.pairId
              )
            )
          ),
          React.createElement(
            "g",
            {
              className: "triangle-group triangle-labels triangle-layer-front",
              transform: abcTransform(abcLabelScale),
            },
            renderLabel("abc", "A", TRI_ABC.A),
            renderLabel("abc", "B", TRI_ABC.B),
            renderLabel("abc", "C", TRI_ABC.C)
          ),
          React.createElement(
            "g",
            { className: "hotspots-layer" },
            step === 2 &&
              hotspotPositions().map((h) =>
                visibleHotspots[h.id]
                  ? React.createElement(
                      "g",
                      {
                        key: `hotspot-${h.id}`,
                        className: "hotspot-group",
                      },
                      React.createElement("path", {
                        id: `hotspot-${h.id}-outer`,
                        d: describeHotspotRing(
                          h.cx,
                          h.cy,
                          h.r,
                          h.r * HOTSPOT_RING_MID
                        ),
                        className: "hotspot-ring hotspot-ring-outer",
                        onClick: () => runAngleAnimation(h.id),
                      }),
                      React.createElement("path", {
                        id: `hotspot-${h.id}-mid`,
                        d: describeHotspotRing(
                          h.cx,
                          h.cy,
                          h.r * HOTSPOT_RING_MID,
                          h.r * HOTSPOT_RING_CENTER
                        ),
                        className: "hotspot-ring hotspot-ring-mid",
                        onClick: () => runAngleAnimation(h.id),
                      }),
                      React.createElement("path", {
                        id: `hotspot-${h.id}-center`,
                        d: describeHotspotRing(
                          h.cx,
                          h.cy,
                          h.r * HOTSPOT_RING_CENTER,
                          0
                        ),
                        className: "hotspot-ring hotspot-ring-center",
                        onClick: () => runAngleAnimation(h.id),
                      }),
                      React.createElement("circle", {
                        cx: h.cx,
                        cy: h.cy,
                        r: h.r,
                        className: "hotspot-hit",
                        onClick: () => runAngleAnimation(h.id),
                      })
                    )
                  : null
              )
          ),
          renderFlyingAngleLabels(),
          tempEqualText &&
            renderEqualTextFO(
              tempEqualText.pairId,
              tempEqualText.pos,
              "temp-eq-text",
              true
            ),
          persistedArcs.map((a) =>
            renderEqualTextFO(a.pairId, a.text, `eq-${a.pairId}`, false)
          )
        )
      )
    ),
    showActionRow &&
      React.createElement(
        "div",
        {
          className:
            "action-row" + (actionRowContent() ? " has-content" : ""),
        },
        actionRowContent()
      )
  );
};
