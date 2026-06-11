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
};

// Reserved top band inside the SVG for a future definition text box
const DIAGRAM_OFFSET_Y = 40;

const oy = (y) => y + DIAGRAM_OFFSET_Y;

const interpOnLine = (from, to, t) => ({
  x: from.x + t * (to.x - from.x),
  y: from.y + t * (to.y - from.y),
});

const TRANSVERSAL_BASE = { x1: 325, y1: 50, x2: 260, y2: 440 };
const transStartPt = interpOnLine(
  { x: TRANSVERSAL_BASE.x1, y: TRANSVERSAL_BASE.y1 },
  { x: TRANSVERSAL_BASE.x2, y: TRANSVERSAL_BASE.y2 },
  0.05,
);
const transEndPt = interpOnLine(
  { x: TRANSVERSAL_BASE.x1, y: TRANSVERSAL_BASE.y1 },
  { x: TRANSVERSAL_BASE.x2, y: TRANSVERSAL_BASE.y2 },
  0.95,
);

const INT1 = { cx: 305, cy: oy(170) };
const INT2 = { cx: 275, cy: oy(350) };

const angleData = [
  {
    id: 1,
    cx: INT1.cx,
    cy: INT1.cy,
    start: -170.9 + 90,
    end: -80.5 + 90,
    r: 35,
    color: "rgba(156, 39, 176, 0.7)",
    label: "1",
    labelR: 45,
  },
  {
    id: 2,
    cx: INT1.cx,
    cy: INT1.cy,
    start: -80.5 + 90,
    end: 9.1 + 90,
    r: 45,
    color: "rgba(156, 39, 176, 0.5)",
    label: "2",
    labelR: 55,
  },
  {
    id: 3,
    cx: INT1.cx,
    cy: INT1.cy,
    start: 9.1 + 90,
    end: 99.5 + 90,
    r: 35,
    color: "rgba(156, 39, 176, 0.7)",
    label: "3",
    labelR: 52,
  },
  {
    id: 4,
    cx: INT1.cx,
    cy: INT1.cy,
    start: 99.5 + 90,
    end: 189.1 + 90,
    r: 45,
    color: "rgba(156, 39, 176, 0.5)",
    label: "4",
    labelR: 60,
  },
  {
    id: 5,
    cx: INT2.cx,
    cy: INT2.cy,
    start: -180 + 90,
    end: -80.5 + 90,
    r: 35,
    color: "rgba(156, 39, 176, 0.7)",
    label: "5",
    labelR: 45,
  },
  {
    id: 6,
    cx: INT2.cx,
    cy: INT2.cy,
    start: -80.5 + 90,
    end: 0 + 90,
    r: 45,
    color: "rgba(156, 39, 176, 0.5)",
    label: "6",
    labelR: 55,
  },
  {
    id: 7,
    cx: INT2.cx,
    cy: INT2.cy,
    start: 0 + 90,
    end: 99.5 + 90,
    r: 35,
    color: "rgba(156, 39, 176, 0.7)",
    label: "7",
    labelR: 52,
  },
  {
    id: 8,
    cx: INT2.cx,
    cy: INT2.cy,
    start: 99.5 + 90,
    end: 180 + 90,
    r: 45,
    color: "rgba(156, 39, 176, 0.5)",
    label: "8",
    labelR: 60,
  },
];

const LINE_SEGMENTS = {
  topLineLeft: {
    x1: 55,
    y1: oy(130),
    x2: INT1.cx,
    y2: INT1.cy,
    color: "#ffc107",
    markerStart: "arrow-yellow-start",
    markerEnd: null,
  },
  topLineRight: {
    x1: INT1.cx,
    y1: INT1.cy,
    x2: 555,
    y2: oy(210),
    color: "#ffc107",
    markerStart: null,
    markerEnd: "arrow-yellow-end",
  },
  bottomLineLeft: {
    x1: 25,
    y1: INT2.cy,
    x2: INT2.cx,
    y2: INT2.cy,
    color: "#ffc107",
    markerStart: "arrow-yellow-start",
    markerEnd: null,
  },
  bottomLineRight: {
    x1: INT2.cx,
    y1: INT2.cy,
    x2: 525,
    y2: INT2.cy,
    color: "#ffc107",
    markerStart: null,
    markerEnd: "arrow-yellow-end",
  },
  transversalTop: {
    x1: transStartPt.x,
    y1: oy(transStartPt.y),
    x2: INT1.cx,
    y2: INT1.cy,
    color: "#00b0ff",
    markerStart: "arrow-blue-start",
    markerEnd: null,
  },
  transversalMiddle: {
    x1: INT1.cx,
    y1: INT1.cy,
    x2: INT2.cx,
    y2: INT2.cy,
    color: "#00b0ff",
    markerStart: null,
    markerEnd: null,
  },
  transversalBottom: {
    x1: INT2.cx,
    y1: INT2.cy,
    x2: transEndPt.x,
    y2: oy(transEndPt.y),
    color: "#00b0ff",
    markerStart: null,
    markerEnd: "arrow-blue-end",
  },
};

const WHOLE_TRANSVERSAL = {
  x1: transStartPt.x,
  y1: oy(transStartPt.y),
  x2: transEndPt.x,
  y2: oy(transEndPt.y),
};

const WHOLE_YELLOW_TOP = { x1: 55, y1: oy(130), x2: 555, y2: oy(210) };
const WHOLE_YELLOW_BOTTOM = { x1: 25, y1: INT2.cy, x2: 525, y2: INT2.cy };

const CLONE_LINE = { x1: 55, y1: oy(130), x2: INT1.cx, y2: INT1.cy };

const DIAGRAM_LABELS = {
  transversal: { x: 275, y: oy(245), rotate: -80.5 },
  straightLine: { x: 455, y: oy(165), rotate: 9.1 },
};

const ALL_SEGMENT_KEYS = Object.keys(LINE_SEGMENTS);

const CORRESPONDING_PAIRS = [
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];
const ALT_EXTERIOR_PAIRS = [
  [0, 6],
  [1, 7],
];
const EXTERIOR_ANGLE_INDICES = [0, 1, 6, 7];
const ALT_INTERIOR_PAIRS = [
  [3, 5],
  [2, 4],
];
const INTERIOR_ANGLE_INDICES = [2, 3, 4, 5];
const CO_EXTERIOR_PAIRS = [
  [0, 7],
  [1, 6],
];
const CO_INTERIOR_PAIRS = [
  [3, 4],
  [2, 5],
];

const PRACTICE_ANGLE_STEPS = [5, 7, 9, 11, 13];
const TEACH_HEADING_STEPS = [2, 3, 4, 6, 8, 10, 12];

const REVIEW_PAIR_CONFIG = [
  {
    angles: [0, 1],
    lineDim: {
      topLineLeft: false,
      topLineRight: false,
      transversalTop: false,
      bottomLineLeft: true,
      bottomLineRight: true,
      transversalMiddle: true,
      transversalBottom: true,
    },
  },
  {
    angles: [1, 3],
    lineDim: {
      topLineLeft: false,
      topLineRight: false,
      transversalTop: false,
      transversalMiddle: false,
      bottomLineLeft: true,
      bottomLineRight: true,
      transversalBottom: true,
    },
  },
  { angles: [0, 4] },
  { angles: [0, 6] },
  { angles: [3, 5] },
  { angles: [0, 7] },
  { angles: [3, 4] },
];

const EXT_REGION_TOP = `0,0 600,0 600,${217.2 + DIAGRAM_OFFSET_Y} 0,${121.2 + DIAGRAM_OFFSET_Y}`;
const EXT_REGION_BOTTOM = `0,${350 + DIAGRAM_OFFSET_Y} 600,${350 + DIAGRAM_OFFSET_Y} 600,500 0,500`;
const INT_REGION = `0,${121.2 + DIAGRAM_OFFSET_Y} 600,${217.2 + DIAGRAM_OFFSET_Y} 600,${350 + DIAGRAM_OFFSET_Y} 0,${350 + DIAGRAM_OFFSET_Y}`;

const ANGLE_LINE_MAP = {
  0: ["topLineLeft", "transversalTop"],
  1: ["topLineRight", "transversalTop"],
  2: ["topLineRight", "transversalMiddle"],
  3: ["topLineLeft", "transversalMiddle"],
  4: ["bottomLineLeft", "transversalMiddle"],
  5: ["bottomLineRight", "transversalMiddle"],
  6: ["bottomLineRight", "transversalBottom"],
  7: ["bottomLineLeft", "transversalBottom"],
};

const getCorrespondingPair = (idx) => (idx < 4 ? idx + 4 : idx - 4);

const getAlternateExteriorPair = (idx) => {
  if (idx === 0) return 6;
  if (idx === 6) return 0;
  if (idx === 1) return 7;
  if (idx === 7) return 1;
  return -1;
};

const getAlternateInteriorPair = (idx) => {
  if (idx === 2) return 4;
  if (idx === 4) return 2;
  if (idx === 3) return 5;
  if (idx === 5) return 3;
  return -1;
};

const getCoExteriorPair = (idx) => {
  if (idx === 0) return 7;
  if (idx === 7) return 0;
  if (idx === 1) return 6;
  if (idx === 6) return 1;
  return -1;
};

const getCoInteriorPair = (idx) => {
  if (idx === 3) return 4;
  if (idx === 4) return 3;
  if (idx === 2) return 5;
  if (idx === 5) return 2;
  return -1;
};

const buildEmptyPairSlots = (count) =>
  Array.from({ length: count }, () => ({
    a: 0,
    b: 0,
    shown: false,
    visible: false,
  }));

const buildLineDimForAngles = (indices) => {
  const highlight = new Set();
  indices.forEach((i) => ANGLE_LINE_MAP[i].forEach((s) => highlight.add(s)));
  const state = {};
  ALL_SEGMENT_KEYS.forEach((k) => {
    state[k] = !highlight.has(k);
  });
  return state;
};

const buildLineDimAllDimmed = () => {
  const state = {};
  ALL_SEGMENT_KEYS.forEach((k) => {
    state[k] = true;
  });
  return state;
};

const MainCanvas = (props) => {
  const { step, onSetNextEnabled, onUpdateTexts, onHideAppNudge, onSetAnimationBusy } =
    props;
  const { useState, useEffect, useLayoutEffect, useRef, useCallback } = React;

  const transversalRef = useRef(null);
  const yellow1Ref = useRef(null);
  const yellow2Ref = useRef(null);
  const int1OuterRef = useRef(null);
  const int1InnerRef = useRef(null);
  const int2OuterRef = useRef(null);
  const int2InnerRef = useRef(null);
  const whiteCircle1Ref = useRef(null);
  const whiteCircle2Ref = useRef(null);
  const transversalLabelRef = useRef(null);
  const straightLineLabelRef = useRef(null);
  const cloneLineRef = useRef(null);
  const headingRef = useRef(null);
  const segmentRefs = useRef({});
  const angleGroupRefs = useRef([]);
  const animatingRef = useRef(false);
  const animationLockCountRef = useRef(0);
  const currentHighlightRef = useRef(null);
  const definitionBoxRef = useRef(null);
  const pairSlotRefs = useRef([]);
  const pairsRowRef = useRef(null);
  const leftColumnRef = useRef(null);
  const step4GrowAfterLayoutRef = useRef(null);
  const extRegionTopRef = useRef(null);
  const extRegionBottomRef = useRef(null);
  const intRegionRef = useRef(null);

  const [linesVisible, setLinesVisible] = useState(false);
  const [int1Visible, setInt1Visible] = useState(false);
  const [int2Visible, setInt2Visible] = useState(false);
  const [transversalLabelVisible, setTransversalLabelVisible] = useState(false);
  const [straightLineLabelVisible, setStraightLineLabelVisible] =
    useState(false);
  const [anglesVisible, setAnglesVisible] = useState(Array(8).fill(false));
  const [tapGifTarget, setTapGifTarget] = useState(null);

  // Step 1 highlight progression: 0=transversal, 1=two-lines, 2=different-points, 3=eight-angles, 4=done
  const [step1ActiveIdx, setStep1ActiveIdx] = useState(0);
  const [step1Completed, setStep1Completed] = useState(new Set());

  // Step 2/3
  const [headingReady, setHeadingReady] = useState(false);
  const [step2ActiveIdx, setStep2ActiveIdx] = useState(0);
  const [step2Completed, setStep2Completed] = useState(new Set());
  const [step3Active, setStep3Active] = useState(false);
  const [step3Completed, setStep3Completed] = useState(false);
  const [lineDimState, setLineDimState] = useState(null);
  const [angleDimState, setAngleDimState] = useState(null);

  // Step 4/5
  const [step4Active, setStep4Active] = useState(false);
  const [step4Completed, setStep4Completed] = useState(false);
  const [showAngleLabels, setShowAngleLabels] = useState(true);
  const [topDefinitionVisible, setTopDefinitionVisible] = useState(false);
  const [filledPairSlots, setFilledPairSlots] = useState([]);
  const [step4GrowingPair, setStep4GrowingPair] = useState(null);
  const [disabledAngleIndices, setDisabledAngleIndices] = useState(new Set());
  const [interactionLocked, setInteractionLocked] = useState(false);

  // Step 6/7
  const [step6Active, setStep6Active] = useState(false);
  const [step6Completed, setStep6Completed] = useState(new Set());
  const [step6ActiveIdx, setStep6ActiveIdx] = useState(0);
  const [exteriorRegionsVisible, setExteriorRegionsVisible] = useState(false);

  // Step 8/9
  const [step8Active, setStep8Active] = useState(false);
  const [step8Completed, setStep8Completed] = useState(new Set());
  const [step8ActiveIdx, setStep8ActiveIdx] = useState(0);
  const [interiorRegionsVisible, setInteriorRegionsVisible] = useState(false);

  // Step 10/11
  const [step10Active, setStep10Active] = useState(false);
  const [step10Completed, setStep10Completed] = useState(new Set());
  const [step10ActiveIdx, setStep10ActiveIdx] = useState(0);

  // Step 12/13
  const [step12Active, setStep12Active] = useState(false);
  const [step12Completed, setStep12Completed] = useState(new Set());
  const [step12ActiveIdx, setStep12ActiveIdx] = useState(0);

  // Step 14 review
  const [step14Selected, setStep14Selected] = useState(null);
  const [step14AutoActive, setStep14AutoActive] = useState(false);
  const step14AutoIndexRef = useRef(-1);

  const playSnd = (snd) => {
    if (typeof playSound === "function") playSound(snd);
  };

  const hideTapGif = useCallback(() => {
    setTapGifTarget(null);
    clearTimeout(window.tapTimeout);
  }, []);

  const notifyAnimationBusy = useCallback(() => {
    const busy =
      animationLockCountRef.current > 0 ||
      animatingRef.current ||
      interactionLocked;
    onSetAnimationBusy?.(busy);
  }, [interactionLocked, onSetAnimationBusy]);

  const acquireAnimationLock = useCallback(() => {
    animationLockCountRef.current += 1;
    notifyAnimationBusy();
  }, [notifyAnimationBusy]);

  const releaseAnimationLock = useCallback(() => {
    animationLockCountRef.current = Math.max(
      0,
      animationLockCountRef.current - 1,
    );
    notifyAnimationBusy();
  }, [notifyAnimationBusy]);

  const setAnimatingRef = useCallback(
    (value) => {
      animatingRef.current = value;
      notifyAnimationBusy();
    },
    [notifyAnimationBusy],
  );

  useEffect(() => {
    notifyAnimationBusy();
  }, [interactionLocked, notifyAnimationBusy]);

  const getClickableAngleIndices = useCallback(() => {
    if (step === 5) {
      return [0, 1, 2, 3, 4, 5, 6, 7].filter(
        (i) => !disabledAngleIndices.has(i),
      );
    }
    if (step === 7 || step === 11) {
      return EXTERIOR_ANGLE_INDICES.filter((i) => !disabledAngleIndices.has(i));
    }
    if (step === 9 || step === 13) {
      return INTERIOR_ANGLE_INDICES.filter((i) => !disabledAngleIndices.has(i));
    }
    return [];
  }, [step, disabledAngleIndices]);

  const showTapOnClickableAngles = useCallback(() => {
    if (!PRACTICE_ANGLE_STEPS.includes(step)) return;
    if (interactionLocked) return;
    const indices = getClickableAngleIndices();
    if (!indices.length) {
      hideTapGif();
      return;
    }
    if (onHideAppNudge) onHideAppNudge();
    clearTimeout(window.tapTimeout);
    window.tapTimeout = setTimeout(() => {
      setTapGifTarget(
        indices.map((angleIdx) => ({ x: "angle", angleIdx, small: true })),
      );
    }, 500);
  }, [
    step,
    interactionLocked,
    getClickableAngleIndices,
    hideTapGif,
    onHideAppNudge,
  ]);

  useEffect(() => {
    if (!PRACTICE_ANGLE_STEPS.includes(step)) return undefined;
    if (interactionLocked) return undefined;
    const indices = getClickableAngleIndices();
    if (!indices.length) {
      hideTapGif();
      return undefined;
    }
    const timeoutId = setTimeout(showTapOnClickableAngles, 600);
    return () => clearTimeout(timeoutId);
  }, [
    step,
    interactionLocked,
    disabledAngleIndices,
    getClickableAngleIndices,
    showTapOnClickableAngles,
    hideTapGif,
  ]);

  const showTapOnHighlight = useCallback(
    (className) => {
      if (onHideAppNudge) onHideAppNudge();
      clearTimeout(window.tapTimeout);
      window.tapTimeout = setTimeout(() => {
        setTapGifTarget({ x: "text", textClass: className });
      }, 500);
    },
    [onHideAppNudge],
  );

  const restoreNudgeOnCurrentHighlight = useCallback(() => {
    const cls = currentHighlightRef.current;
    if (cls) showTapOnHighlight(cls);
    else hideTapGif();
  }, [showTapOnHighlight, hideTapGif]);

  const MIN_ANGLE_RADIUS = 0.01;

  const setAnglePathRadius = (idx, radius) => {
    const g = angleGroupRefs.current[idx];
    const path = g?.querySelector("path");
    if (!path) return false;
    const ang = angleData[idx];
    const r = Math.max(radius, MIN_ANGLE_RADIUS);
    path.setAttribute("d", describeArc(ang.cx, ang.cy, r, ang.start, ang.end));
    return true;
  };

  const resetAnglePath = (idx) => {
    const ang = angleData[idx];
    setAnglePathRadius(idx, ang.r);
    const g = angleGroupRefs.current[idx];
    if (g) gsap.set(g, { opacity: 1, clearProps: "scale,transform" });
  };

  const growPairAngles = (indices, onComplete) => {
    indices.forEach((idx) => {
      const ang = angleData[idx];
      const proxy = { r: MIN_ANGLE_RADIUS };
      gsap.killTweensOf(proxy);
      gsap.to(proxy, {
        r: ang.r,
        duration: 0.6,
        ease: "back.out(1.7)",
        onUpdate: () => setAnglePathRadius(idx, proxy.r),
      });
    });
    gsap.delayedCall(1.6, onComplete);
  };

  useLayoutEffect(() => {
    if (!step4GrowingPair) return;

    const runGrow = () => {
      const ready = step4GrowingPair.every((idx) =>
        angleGroupRefs.current[idx]?.querySelector("path"),
      );
      if (!ready) {
        requestAnimationFrame(runGrow);
        return;
      }

      step4GrowingPair.forEach((idx) => {
        const g = angleGroupRefs.current[idx];
        if (g) gsap.set(g, { opacity: 1, clearProps: "scale,transform" });
        setAnglePathRadius(idx, MIN_ANGLE_RADIUS);
      });

      if (step4GrowAfterLayoutRef.current) {
        const onGrowComplete = step4GrowAfterLayoutRef.current;
        step4GrowAfterLayoutRef.current = null;
        growPairAngles(step4GrowingPair, onGrowComplete);
      }
    };

    runGrow();
  }, [step4GrowingPair, anglesVisible]);

  useLayoutEffect(() => {
    if (step !== 5 && step !== 7 && step !== 9 && step !== 11 && step !== 13)
      return;
    const resetAll = () => {
      const ready = angleData.every((_, idx) =>
        angleGroupRefs.current[idx]?.querySelector("path"),
      );
      if (!ready) {
        requestAnimationFrame(resetAll);
        return;
      }
      angleData.forEach((_, idx) => resetAnglePath(idx));
    };
    resetAll();
  }, [step]);

  useEffect(() => {
    if (step === 1) {
      const map = [
        "hl-transversal",
        "hl-two-lines",
        "hl-different-points",
        "hl-eight-angles",
      ];
      currentHighlightRef.current =
        step1ActiveIdx < 4 ? map[step1ActiveIdx] : null;
    } else if (step === 2) {
      if (!headingReady) currentHighlightRef.current = null;
      else if (step2ActiveIdx === 0)
        currentHighlightRef.current = "hl-adjacent-angles";
      else if (step2ActiveIdx === 1)
        currentHighlightRef.current = "hl-straight-line";
      else currentHighlightRef.current = null;
    } else if (step === 3) {
      if (!headingReady || !step3Active) currentHighlightRef.current = null;
      else currentHighlightRef.current = "hl-opposite-angles";
    } else if (step === 4) {
      if (!headingReady || !step4Active) currentHighlightRef.current = null;
      else currentHighlightRef.current = "hl-same-relative-position";
    } else if (step === 5) {
      currentHighlightRef.current = null;
    } else if (step === 6) {
      if (!headingReady || !step6Active) currentHighlightRef.current = null;
      else if (step6ActiveIdx === 0)
        currentHighlightRef.current = "hl-outside-two-lines";
      else if (step6ActiveIdx === 1)
        currentHighlightRef.current = "hl-opposite-sides";
      else currentHighlightRef.current = null;
    } else if (step === 7) {
      currentHighlightRef.current = null;
    } else if (step === 8) {
      if (!headingReady || !step8Active) currentHighlightRef.current = null;
      else if (step8ActiveIdx === 0)
        currentHighlightRef.current = "hl-inside-two-lines";
      else if (step8ActiveIdx === 1)
        currentHighlightRef.current = "hl-opposite-sides";
      else currentHighlightRef.current = null;
    } else if (step === 9) {
      currentHighlightRef.current = null;
    } else if (step === 10) {
      if (!headingReady || !step10Active) currentHighlightRef.current = null;
      else if (step10ActiveIdx === 0)
        currentHighlightRef.current = "hl-outside-two-lines";
      else if (step10ActiveIdx === 1)
        currentHighlightRef.current = "hl-same-side";
      else currentHighlightRef.current = null;
    } else if (step === 11) {
      currentHighlightRef.current = null;
    } else if (step === 12) {
      if (!headingReady || !step12Active) currentHighlightRef.current = null;
      else if (step12ActiveIdx === 0)
        currentHighlightRef.current = "hl-inside-two-lines";
      else if (step12ActiveIdx === 1)
        currentHighlightRef.current = "hl-same-side";
      else currentHighlightRef.current = null;
    } else if (step === 13) {
      currentHighlightRef.current = null;
    }
  }, [
    step,
    step1ActiveIdx,
    step2ActiveIdx,
    step3Active,
    step4Active,
    headingReady,
    step6ActiveIdx,
    step8ActiveIdx,
    step10ActiveIdx,
    step12ActiveIdx,
    step6Active,
    step8Active,
    step10Active,
    step12Active,
  ]);

  const blinkHeading = (onComplete) => {
    if (!headingRef.current) {
      onComplete?.();
      return;
    }
    acquireAnimationLock();
    runPeakBlink(headingRef.current, {
      minOpacity: 0,
      maxOpacity: 1,
      duration: 0.55,
      ease: "power1.inOut",
      onComplete: () => {
        releaseAnimationLock();
        onComplete?.();
      },
    });
  };

  const blink = (targets, onComplete) => {
    const els = (Array.isArray(targets) ? targets : [targets]).filter(Boolean);
    if (!els.length) {
      onComplete?.();
      return;
    }
    acquireAnimationLock();
    gsap.killTweensOf(els);
    gsap.fromTo(
      els,
      { opacity: 1 },
      {
        opacity: 0.25,
        duration: 0.25,
        yoyo: true,
        repeat: 9,
        onComplete: () => {
          gsap.set(els, { clearProps: "opacity" });
          releaseAnimationLock();
          onComplete?.();
        },
      },
    );
  };

  const blinkAnglePaths = (indices, onComplete) => {
    acquireAnimationLock();
    setTimeout(() => {
      const targets = [];
      indices.forEach((i) => {
        const g = angleGroupRefs.current[i];
        if (!g) return;
        const path = g.querySelector("path");
        const label = g.querySelector("text");
        if (path) targets.push(path);
        if (label) targets.push(label);
      });
      if (!targets.length) {
        releaseAnimationLock();
        onComplete?.();
        return;
      }
      gsap.killTweensOf(targets);
      gsap.fromTo(
        targets,
        { opacity: 1 },
        {
          opacity: 0.2,
          duration: 0.25,
          yoyo: true,
          repeat: 9,
          onComplete: () => {
            gsap.set(targets, { clearProps: "opacity" });
            releaseAnimationLock();
            onComplete?.();
          },
        },
      );
    }, 80);
  };

  const resetDiagramNormal = useCallback(() => {
    setLineDimState(null);
    setAngleDimState(null);
    setStraightLineLabelVisible(false);
  }, []);

  const applyReviewSelection = useCallback((idx) => {
    if (idx === null || idx === undefined) {
      setLineDimState(null);
      setAngleDimState(null);
      setStraightLineLabelVisible(false);
      return;
    }

    const cfg = REVIEW_PAIR_CONFIG[idx];
    if (!cfg) return;

    const [a, b] = cfg.angles;
    const allDim = [0, 1, 2, 3, 4, 5, 6, 7].filter((i) => i !== a && i !== b);

    if (cfg.lineDim) {
      setLineDimState(cfg.lineDim);
    } else {
      setLineDimState(buildLineDimForAngles(cfg.angles));
    }
    setAngleDimState({ highlight: cfg.angles, dim: allDim });
    setStraightLineLabelVisible(false);
  }, []);

  // Reset teach-step highlights before paint to avoid a flash of active highlights
  useLayoutEffect(() => {
    if (!TEACH_HEADING_STEPS.includes(step)) return;

    setHeadingReady(false);
    hideTapGif();

    if (headingRef.current) {
      gsap.killTweensOf(headingRef.current);
      gsap.set(headingRef.current, { opacity: 0 });
    }

    if (step === 2) {
      setStep2ActiveIdx(0);
      setStep2Completed(new Set());
    } else if (step === 3) {
      setStep3Active(false);
      setStep3Completed(false);
    } else if (step === 4) {
      setStep4Active(false);
      setStep4Completed(false);
    } else if (step === 6) {
      setStep6Active(false);
      setStep6ActiveIdx(0);
      setStep6Completed(new Set());
    } else if (step === 8) {
      setStep8Active(false);
      setStep8ActiveIdx(0);
      setStep8Completed(new Set());
    } else if (step === 10) {
      setStep10Active(false);
      setStep10ActiveIdx(0);
      setStep10Completed(new Set());
    } else if (step === 12) {
      setStep12Active(false);
      setStep12ActiveIdx(0);
      setStep12Completed(new Set());
    }
  }, [step, hideTapGif]);

  // Step entry effects
  useEffect(() => {
    setAnimatingRef(false);
    hideTapGif();
    onHideAppNudge();

    if (step === 1) {
      setStep1ActiveIdx(0);
      setStep1Completed(new Set());
      setLinesVisible(false);
      setInt1Visible(false);
      setInt2Visible(false);
      setTransversalLabelVisible(false);
      setAnglesVisible(Array(8).fill(false));
      setLineDimState(null);
      setAngleDimState(null);

      setTimeout(() => {
        setLinesVisible(true);
        acquireAnimationLock();
        gsap.fromTo(
          [yellow1Ref.current, yellow2Ref.current],
          { x: -600, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, ease: "power2.out" },
        );
        gsap.fromTo(
          transversalRef.current,
          { y: -500, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            onComplete: () => {
              releaseAnimationLock();
              showTapOnHighlight("hl-transversal");
            },
          },
        );
      }, 100);
    }

    if (step === 2) {
      setStep2ActiveIdx(0);
      setStep2Completed(new Set());
      setHeadingReady(false);
      setStraightLineLabelVisible(false);
      setLineDimState(null);
      setAngleDimState(null);
      setAnglesVisible(Array(8).fill(true));
      setLinesVisible(true);
      setInt1Visible(true);
      setInt2Visible(true);
      setTransversalLabelVisible(false);

      setTimeout(() => {
        blinkHeading(() => {
          setHeadingReady(true);
          showTapOnHighlight("hl-adjacent-angles");
        });
      }, 200);
    }

    if (step === 3) {
      resetDiagramNormal();
      setStep3Active(false);
      setStep3Completed(false);
      setHeadingReady(false);
      setAnglesVisible(Array(8).fill(true));
      setLinesVisible(true);
      setInt1Visible(true);
      setInt2Visible(true);

      setTimeout(() => {
        blinkHeading(() => {
          setHeadingReady(true);
          setStep3Active(true);
          showTapOnHighlight("hl-opposite-angles");
        });
      }, 200);
    }

    if (step === 4) {
      resetDiagramNormal();
      setStep4Active(false);
      setStep4Completed(false);
      setHeadingReady(false);
      setTopDefinitionVisible(false);
      setShowAngleLabels(true);
      setFilledPairSlots([]);
      setStep4GrowingPair(null);
      setAnglesVisible(Array(8).fill(true));
      setLinesVisible(true);
      setInt1Visible(true);
      setInt2Visible(true);

      setTimeout(() => {
        blinkHeading(() => {
          setHeadingReady(true);
          setStep4Active(true);
          showTapOnHighlight("hl-same-relative-position");
        });
      }, 200);
    }

    if (step === 5) {
      resetDiagramNormal();
      if (headingRef.current) {
        gsap.killTweensOf(headingRef.current);
        gsap.set(headingRef.current, { opacity: 1 });
      }
      setHeadingReady(true);
      setStep4Completed(true);
      setStep4Active(false);
      setTopDefinitionVisible(false);
      setShowAngleLabels(true);
      setFilledPairSlots(buildEmptyPairSlots(4));
      setStep4GrowingPair(null);
      setDisabledAngleIndices(new Set());
      setAnglesVisible(Array(8).fill(true));
      setLinesVisible(true);
      setInt1Visible(true);
      setInt2Visible(true);
      setInteractionLocked(false);
      hideTapGif();
    }

    if (step === 6) {
      resetDiagramNormal();
      setStep6Active(false);
      setStep6Completed(new Set());
      setStep6ActiveIdx(0);
      setHeadingReady(false);
      setExteriorRegionsVisible(false);
      resetRegionOpacity(
        extRegionTopRef.current,
        extRegionBottomRef.current,
        intRegionRef.current,
      );
      setTopDefinitionVisible(false);
      setShowAngleLabels(true);
      setFilledPairSlots([]);
      setStep4GrowingPair(null);
      setAnglesVisible(Array(8).fill(true));
      setLinesVisible(true);
      setInt1Visible(true);
      setInt2Visible(true);

      setTimeout(() => {
        blinkHeading(() => {
          setHeadingReady(true);
          setStep6Active(true);
          showTapOnHighlight("hl-outside-two-lines");
        });
      }, 200);
    }

    if (step === 7) {
      resetDiagramNormal();
      if (headingRef.current) {
        gsap.killTweensOf(headingRef.current);
        gsap.set(headingRef.current, { opacity: 1 });
      }
      setHeadingReady(true);
      setStep6Completed(new Set(["hl-outside-two-lines", "hl-opposite-sides"]));
      setStep6Active(false);
      setExteriorRegionsVisible(false);
      resetRegionOpacity(
        extRegionTopRef.current,
        extRegionBottomRef.current,
        intRegionRef.current,
      );
      setTopDefinitionVisible(false);
      setShowAngleLabels(true);
      setFilledPairSlots(buildEmptyPairSlots(2));
      setStep4GrowingPair(null);
      setDisabledAngleIndices(new Set());
      setAnglesVisible(Array(8).fill(true));
      setLinesVisible(true);
      setInt1Visible(true);
      setInt2Visible(true);
      setInteractionLocked(false);
      hideTapGif();
    }

    if (step === 8) {
      resetDiagramNormal();
      setStep8Active(false);
      setStep8Completed(new Set());
      setStep8ActiveIdx(0);
      setHeadingReady(false);
      setInteriorRegionsVisible(false);
      setExteriorRegionsVisible(false);
      resetRegionOpacity(
        extRegionTopRef.current,
        extRegionBottomRef.current,
        intRegionRef.current,
      );
      setTopDefinitionVisible(false);
      setShowAngleLabels(true);
      setFilledPairSlots([]);
      setStep4GrowingPair(null);
      setAnglesVisible(Array(8).fill(true));
      setLinesVisible(true);
      setInt1Visible(true);
      setInt2Visible(true);

      setTimeout(() => {
        blinkHeading(() => {
          setHeadingReady(true);
          setStep8Active(true);
          showTapOnHighlight("hl-inside-two-lines");
        });
      }, 200);
    }

    if (step === 9) {
      resetDiagramNormal();
      if (headingRef.current) {
        gsap.killTweensOf(headingRef.current);
        gsap.set(headingRef.current, { opacity: 1 });
      }
      setHeadingReady(true);
      setStep8Completed(new Set(["hl-inside-two-lines", "hl-opposite-sides"]));
      setStep8Active(false);
      setInteriorRegionsVisible(false);
      setExteriorRegionsVisible(false);
      resetRegionOpacity(
        extRegionTopRef.current,
        extRegionBottomRef.current,
        intRegionRef.current,
      );
      setTopDefinitionVisible(false);
      setShowAngleLabels(true);
      setFilledPairSlots(buildEmptyPairSlots(2));
      setStep4GrowingPair(null);
      setDisabledAngleIndices(new Set());
      setAnglesVisible(Array(8).fill(true));
      setLinesVisible(true);
      setInt1Visible(true);
      setInt2Visible(true);
      setInteractionLocked(false);
      hideTapGif();
    }

    if (step === 10) {
      resetDiagramNormal();
      setStep10Active(false);
      setStep10Completed(new Set());
      setStep10ActiveIdx(0);
      setHeadingReady(false);
      setExteriorRegionsVisible(false);
      resetRegionOpacity(
        extRegionTopRef.current,
        extRegionBottomRef.current,
        intRegionRef.current,
      );
      setTopDefinitionVisible(false);
      setShowAngleLabels(true);
      setFilledPairSlots([]);
      setStep4GrowingPair(null);
      setAnglesVisible(Array(8).fill(true));
      setLinesVisible(true);
      setInt1Visible(true);
      setInt2Visible(true);

      setTimeout(() => {
        blinkHeading(() => {
          setHeadingReady(true);
          setStep10Active(true);
          showTapOnHighlight("hl-outside-two-lines");
        });
      }, 200);
    }

    if (step === 11) {
      resetDiagramNormal();
      if (headingRef.current) {
        gsap.killTweensOf(headingRef.current);
        gsap.set(headingRef.current, { opacity: 1 });
      }
      setHeadingReady(true);
      setStep10Completed(new Set(["hl-outside-two-lines", "hl-same-side"]));
      setStep10Active(false);
      setExteriorRegionsVisible(false);
      resetRegionOpacity(
        extRegionTopRef.current,
        extRegionBottomRef.current,
        intRegionRef.current,
      );
      setTopDefinitionVisible(false);
      setShowAngleLabels(true);
      setFilledPairSlots(buildEmptyPairSlots(2));
      setStep4GrowingPair(null);
      setDisabledAngleIndices(new Set());
      setAnglesVisible(Array(8).fill(true));
      setLinesVisible(true);
      setInt1Visible(true);
      setInt2Visible(true);
      setInteractionLocked(false);
      hideTapGif();
    }

    if (step === 12) {
      resetDiagramNormal();
      setStep12Active(false);
      setStep12Completed(new Set());
      setStep12ActiveIdx(0);
      setHeadingReady(false);
      setInteriorRegionsVisible(false);
      setExteriorRegionsVisible(false);
      resetRegionOpacity(
        extRegionTopRef.current,
        extRegionBottomRef.current,
        intRegionRef.current,
      );
      setTopDefinitionVisible(false);
      setShowAngleLabels(true);
      setFilledPairSlots([]);
      setStep4GrowingPair(null);
      setAnglesVisible(Array(8).fill(true));
      setLinesVisible(true);
      setInt1Visible(true);
      setInt2Visible(true);

      setTimeout(() => {
        blinkHeading(() => {
          setHeadingReady(true);
          setStep12Active(true);
          showTapOnHighlight("hl-inside-two-lines");
        });
      }, 200);
    }

    if (step === 13) {
      resetDiagramNormal();
      if (headingRef.current) {
        gsap.killTweensOf(headingRef.current);
        gsap.set(headingRef.current, { opacity: 1 });
      }
      setHeadingReady(true);
      setStep12Completed(new Set(["hl-inside-two-lines", "hl-same-side"]));
      setStep12Active(false);
      setInteriorRegionsVisible(false);
      setExteriorRegionsVisible(false);
      resetRegionOpacity(
        extRegionTopRef.current,
        extRegionBottomRef.current,
        intRegionRef.current,
      );
      setTopDefinitionVisible(false);
      setShowAngleLabels(true);
      setFilledPairSlots(buildEmptyPairSlots(2));
      setStep4GrowingPair(null);
      setDisabledAngleIndices(new Set());
      setAnglesVisible(Array(8).fill(true));
      setLinesVisible(true);
      setInt1Visible(true);
      setInt2Visible(true);
      setInteractionLocked(false);
      hideTapGif();
    }

    if (step === 14) {
      resetDiagramNormal();
      if (headingRef.current) {
        gsap.killTweensOf(headingRef.current);
        gsap.set(headingRef.current, { opacity: 1 });
      }
      if (cloneLineRef.current) {
        gsap.killTweensOf(cloneLineRef.current);
        gsap.set(cloneLineRef.current, { opacity: 0, rotation: 0 });
      }
      setExteriorRegionsVisible(false);
      setInteriorRegionsVisible(false);
      resetRegionOpacity(
        extRegionTopRef.current,
        extRegionBottomRef.current,
        intRegionRef.current,
      );
      setTopDefinitionVisible(false);
      setShowAngleLabels(true);
      setFilledPairSlots([]);
      setStep4GrowingPair(null);
      setDisabledAngleIndices(new Set());
      setAnglesVisible(Array(8).fill(true));
      setLinesVisible(true);
      setInt1Visible(true);
      setInt2Visible(true);
      setTransversalLabelVisible(false);
      setStep14Selected(null);
      setStep14AutoActive(true);
      step14AutoIndexRef.current = -1;
      applyReviewSelection(null);
      angleData.forEach((_, idx) => resetAnglePath(idx));
      hideTapGif();
      onSetNextEnabled(true);
    }
  }, [
    step,
    hideTapGif,
    onHideAppNudge,
    resetDiagramNormal,
    showTapOnHighlight,
    applyReviewSelection,
    onSetNextEnabled,
  ]);

  useEffect(() => {
    if (step !== 14 || !step14AutoActive) return undefined;

    const intervalId = setInterval(() => {
      step14AutoIndexRef.current =
        step14AutoIndexRef.current >= 6 ? -1 : step14AutoIndexRef.current + 1;
      const selected =
        step14AutoIndexRef.current === -1
          ? null
          : step14AutoIndexRef.current;
      setStep14Selected(selected);
      applyReviewSelection(selected);
    }, 2000);

    return () => clearInterval(intervalId);
  }, [step, step14AutoActive, applyReviewSelection]);

  const handleReviewButtonClick = (idx) => {
    playSnd("click");
    setStep14AutoActive(false);
    setStep14Selected(idx);
    applyReviewSelection(idx);
  };

  const getTapGifStyles = () => {
    if (!tapGifTarget) return [];
    const targets = Array.isArray(tapGifTarget) ? tapGifTarget : [tapGifTarget];
    const container = document.querySelector(".main-canvas-container");
    const parentRect = container?.getBoundingClientRect();
    if (!parentRect) return [];

    return targets.map((target, i) => {
      if (target.x === "text") {
        const el = document.querySelector(`.${target.textClass}`);
        if (!el) return { key: i, display: "none" };
        const rect = el.getBoundingClientRect();
        return {
          key: i,
          left: rect.left - parentRect.left + rect.width / 2,
          top: rect.top - parentRect.top + rect.height / 2,
          position: "absolute",
          display: "block",
          pointerEvents: "none",
          className: "tap-gif",
        };
      }
      if (target.x === "angle") {
        const g = angleGroupRefs.current[target.angleIdx];
        const el = g?.querySelector("text") || g?.querySelector("path");
        if (!el) return { key: i, display: "none" };
        const rect = el.getBoundingClientRect();
        return {
          key: i,
          left: rect.left - parentRect.left + rect.width / 2,
          top: rect.top - parentRect.top + rect.height / 2,
          position: "absolute",
          display: "block",
          pointerEvents: "none",
          className: target.small ? "tap-gif tap-gif--small" : "tap-gif",
        };
      }
      return { key: i, display: "none" };
    });
  };

  const advanceStep1 = (idx, cls) => {
    setStep1Completed((prev) => new Set([...prev, cls]));
    const next = idx + 1;
    setStep1ActiveIdx(next);
    const nextClasses = [
      "hl-transversal",
      "hl-two-lines",
      "hl-different-points",
      "hl-eight-angles",
    ];
    if (next < 4) {
      showTapOnHighlight(nextClasses[next]);
    } else {
      hideTapGif();
      onUpdateTexts(APP_DATA.steps[1].navNext);
      onSetNextEnabled(true);
    }
  };

  const handleTransversalClick = (isReplay) => {
    hideTapGif();
    playSnd("click");
    setTransversalLabelVisible(true);
    const targets = [transversalRef.current];
    setTimeout(() => {
      if (transversalLabelRef.current)
        targets.push(transversalLabelRef.current);
      blink(targets, () => {
        setTransversalLabelVisible(false);
        if (!isReplay) advanceStep1(0, "hl-transversal");
        else restoreNudgeOnCurrentHighlight();
      });
    }, 50);
  };

  const handleTwoLinesClick = (isReplay) => {
    hideTapGif();
    playSnd("click");
    blink([yellow1Ref.current, yellow2Ref.current], () => {
      if (!isReplay) advanceStep1(1, "hl-two-lines");
      else restoreNudgeOnCurrentHighlight();
    });
  };

  const handleDifferentPointsClick = (isReplay) => {
    hideTapGif();
    playSnd("click");
    setInt1Visible(true);
    setInt2Visible(true);
    gsap.fromTo(
      int1OuterRef.current,
      { attr: { r: 0 }, opacity: 0 },
      { attr: { r: 10 }, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
    );
    gsap.fromTo(
      int1InnerRef.current,
      { attr: { r: 0 }, opacity: 0 },
      { attr: { r: 4 }, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
    );
    gsap.fromTo(
      int2OuterRef.current,
      { attr: { r: 0 }, opacity: 0 },
      { attr: { r: 10 }, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
    );
    gsap.fromTo(
      int2InnerRef.current,
      { attr: { r: 0 }, opacity: 0 },
      { attr: { r: 4 }, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
    );
    gsap.fromTo(
      [whiteCircle1Ref.current, whiteCircle2Ref.current],
      { opacity: 0 },
      {
        opacity: 0.5,
        duration: 0.25,
        yoyo: true,
        repeat: 9,
        onComplete: () => {
          if (!isReplay) advanceStep1(2, "hl-different-points");
          else restoreNudgeOnCurrentHighlight();
        },
      },
    );
  };

  const handleEightAnglesClick = (isReplay) => {
    hideTapGif();
    playSnd("click");
    if (isReplay) {
      setAnglesVisible(Array(8).fill(true));
      blinkAnglePaths([0, 1, 2, 3, 4, 5, 6, 7], () =>
        restoreNudgeOnCurrentHighlight(),
      );
      return;
    }
    const tl = gsap.timeline({
      onComplete: () => {
        releaseAnimationLock();
        advanceStep1(3, "hl-eight-angles");
      },
    });
    acquireAnimationLock();
    for (let i = 0; i < 8; i++) {
      tl.call(
        () => {
          setAnglesVisible((prev) => {
            const arr = [...prev];
            arr[i] = true;
            return arr;
          });
          playSnd("tick");
        },
        null,
        i * 0.4,
      );
    }
  };

  const handleAdjacentAnglesClick = (isReplay) => {
    hideTapGif();
    playSnd("click");
    setLineDimState({
      topLineLeft: false,
      topLineRight: false,
      transversalTop: false,
      bottomLineLeft: true,
      bottomLineRight: true,
      transversalMiddle: true,
      transversalBottom: true,
    });
    setAngleDimState({ highlight: [0, 1], dim: [2, 3, 4, 5, 6, 7] });

    blinkAnglePaths([0, 1], () => {
      if (!isReplay) {
        setStep2Completed((prev) => new Set([...prev, "hl-adjacent-angles"]));
        setStep2ActiveIdx(1);
        showTapOnHighlight("hl-straight-line");
      } else {
        restoreNudgeOnCurrentHighlight();
      }
    });
  };

  const handleStraightLineClick = (isReplay) => {
    hideTapGif();
    playSnd("click");

    const clone = cloneLineRef.current;
    if (!clone) return;

    gsap.set(clone, {
      opacity: 0.5,
      rotation: 0,
      svgOrigin: `${INT1.cx} ${INT1.cy}`,
      transformOrigin: `${INT1.cx}px ${INT1.cy}px`,
    });
    acquireAnimationLock();
    gsap.to(clone, {
      rotation: 180,
      duration: 1.2,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.set(clone, { opacity: 0 });
        setStraightLineLabelVisible(true);
        releaseAnimationLock();
        if (!isReplay) {
          setStep2Completed((prev) => new Set([...prev, "hl-straight-line"]));
          setStep2ActiveIdx(2);
          onUpdateTexts(APP_DATA.steps[2].navNext);
          onSetNextEnabled(true);
        } else {
          restoreNudgeOnCurrentHighlight();
        }
      },
    });
  };

  const handleOppositeAnglesClick = (isReplay) => {
    hideTapGif();
    playSnd("click");
    setLineDimState({
      topLineLeft: false,
      topLineRight: false,
      transversalTop: false,
      transversalMiddle: false,
      bottomLineLeft: true,
      bottomLineRight: true,
      transversalBottom: true,
    });
    setAngleDimState({ highlight: [1, 3], dim: [0, 2, 4, 5, 6, 7] });

    blinkAnglePaths([1, 3], () => {
      if (!isReplay) {
        setStep3Completed(true);
        setStep3Active(false);
        onUpdateTexts(APP_DATA.steps[3].navNext);
        onSetNextEnabled(true);
      } else {
        restoreNudgeOnCurrentHighlight();
      }
    });
  };

  const fadeOutAngleGroups = (onComplete) => {
    const groups = angleGroupRefs.current.filter(Boolean);
    if (!groups.length) {
      onComplete?.();
      return;
    }
    gsap.to(groups, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        gsap.set(groups, { clearProps: "opacity" });
        onComplete?.();
      },
    });
  };

  const collectAngleFadeTargets = () => {
    const targets = [];
    angleGroupRefs.current.forEach((g) => {
      if (!g) return;
      g.querySelectorAll("path, text").forEach((el) => targets.push(el));
    });
    return targets;
  };

  const BLINK_OSCILLATIONS = 3;

  const runPeakBlink = (targets, options = {}) => {
    const {
      minOpacity = 0,
      maxOpacity = 1,
      duration = 0.55,
      ease = "power1.inOut",
      onComplete,
    } = options;
    const els = (Array.isArray(targets) ? targets : [targets]).filter(Boolean);
    if (!els.length) {
      onComplete?.();
      return;
    }
    gsap.killTweensOf(els);
    gsap.set(els, { opacity: minOpacity });
    gsap.to(els, {
      opacity: maxOpacity,
      duration,
      yoyo: true,
      repeat: BLINK_OSCILLATIONS * 2 - 2,
      ease,
      onComplete: () => {
        gsap.set(els, { opacity: maxOpacity });
        onComplete?.();
      },
    });
  };

  const pulseRegionElements = (regionEls, onComplete) => {
    const regions = regionEls.filter(Boolean);
    if (!regions.length) {
      onComplete?.();
      return;
    }
    runPeakBlink(regions, {
      minOpacity: 0.45,
      maxOpacity: 1,
      duration: 0.5,
      ease: "sine.inOut",
      onComplete,
    });
  };

  const animateRegionHighlightReveal = (
    setRegionVisible,
    getRegionEls,
    onComplete,
  ) => {
    const angleTargets = collectAngleFadeTargets();
    const allRegionEls = [
      extRegionTopRef.current,
      extRegionBottomRef.current,
      intRegionRef.current,
    ].filter(Boolean);

    setRegionVisible(true);

    const regions = getRegionEls().filter(Boolean);

    gsap.killTweensOf(angleTargets);
    gsap.killTweensOf(allRegionEls);
    gsap.set(allRegionEls, { opacity: 0 });
    if (regions.length) {
      gsap.set(regions, { opacity: 0 });
    }

    const finishReveal = () => {
      if (regions.length) {
        pulseRegionElements(regions, () => {
          releaseAnimationLock();
          onComplete?.();
        });
      } else {
        releaseAnimationLock();
        onComplete?.();
      }
    };

    if (!angleTargets.length && !regions.length) {
      onComplete?.();
      return;
    }

    acquireAnimationLock();
    const tl = gsap.timeline({ onComplete: finishReveal });

    if (angleTargets.length) {
      tl.to(
        angleTargets,
        {
          opacity: 0,
          duration: 0.2,
          ease: "power1.in",
          onComplete: () => {
            setAnglesVisible(Array(8).fill(false));
            setShowAngleLabels(false);
          },
        },
        0,
      );
    } else {
      setAnglesVisible(Array(8).fill(false));
      setShowAngleLabels(false);
    }

    if (regions.length) {
      tl.to(
        regions,
        {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        },
        0,
      );
    }
  };

  const resetRegionOpacity = (...refs) => {
    const regions = refs.filter(Boolean);
    if (regions.length) {
      gsap.killTweensOf(regions);
      gsap.set(regions, { opacity: 0 });
    }
  };

  const runPairsSequence = (pairs, onComplete) => {
    acquireAnimationLock();
    let pairIndex = 0;

    const finishSequence = () => {
      releaseAnimationLock();
      onComplete?.();
    };

    const runNextPair = () => {
      if (pairIndex >= pairs.length) {
        finishSequence();
        return;
      }

      const [a, b] = pairs[pairIndex];
      const isLastPair = pairIndex === pairs.length - 1;

      setLineDimState(buildLineDimForAngles([a, b]));
      setShowAngleLabels(false);
      const vis = Array(8).fill(false);
      vis[a] = true;
      vis[b] = true;
      step4GrowAfterLayoutRef.current = () => {
        if (isLastPair) {
          setStep4GrowingPair(null);
          setLineDimState(buildLineDimForAngles([a, b]));
          finishSequence();
          return;
        }

        const groups = [a, b]
          .map((i) => angleGroupRefs.current[i])
          .filter(Boolean);
        gsap.to(groups, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            gsap.set(groups, { clearProps: "opacity,scale,transform" });
            [a, b].forEach((i) => setAnglePathRadius(i, 0));
            setStep4GrowingPair(null);
            setAnglesVisible(Array(8).fill(false));
            setLineDimState(buildLineDimAllDimmed());
            pairIndex += 1;
            setTimeout(runNextPair, 350);
          },
        });
      };
      setStep4GrowingPair([a, b]);
      setAnglesVisible(vis);
    };

    runNextPair();
  };

  const runCorrespondingPairsSequence = (onComplete) => {
    runPairsSequence(CORRESPONDING_PAIRS, onComplete);
  };

  const handleSameRelativePositionClick = (isReplay) => {
    hideTapGif();
    playSnd("click");
    if (isReplay) {
      restoreNudgeOnCurrentHighlight();
      return;
    }

    setTopDefinitionVisible(true);
    setStep4Completed(true);
    acquireAnimationLock();

    setTimeout(() => {
      if (definitionBoxRef.current) {
        gsap.fromTo(
          definitionBoxRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.5,
            onComplete: () => {
              fadeOutAngleGroups(() => {
                setAnglesVisible(Array(8).fill(false));
                runCorrespondingPairsSequence(() => {
                  gsap.delayedCall(1, () => {
                    releaseAnimationLock();
                    setStep4Active(false);
                    onUpdateTexts(APP_DATA.steps[4].navNext);
                    onSetNextEnabled(true);
                  });
                });
              });
            },
          },
        );
      }
    }, 50);
  };

  const blinkExteriorRegions = (onComplete) => {
    pulseRegionElements(
      [extRegionTopRef.current, extRegionBottomRef.current],
      onComplete,
    );
  };

  const handleOutsideTwoLinesClick = (isReplay) => {
    hideTapGif();
    playSnd("click");

    const finishHighlight = () => {
      if (!isReplay) {
        setStep6Completed((prev) => new Set([...prev, "hl-outside-two-lines"]));
        setStep6ActiveIdx(1);
        showTapOnHighlight("hl-opposite-sides");
      } else {
        restoreNudgeOnCurrentHighlight();
      }
    };

    if (isReplay && exteriorRegionsVisible) {
      blinkExteriorRegions(finishHighlight);
      return;
    }

    animateRegionHighlightReveal(
      () => setExteriorRegionsVisible(true),
      () => [extRegionTopRef.current, extRegionBottomRef.current],
      finishHighlight,
    );
  };

  const handleOppositeSidesClick = (isReplay) => {
    hideTapGif();
    playSnd("click");

    if (isReplay) {
      setTimeout(() => {
        setAnglesVisible(Array(8).fill(false));
        setLineDimState(buildLineDimAllDimmed());
        runPairsSequence(ALT_EXTERIOR_PAIRS, () => {
          gsap.delayedCall(1, restoreNudgeOnCurrentHighlight);
        });
      }, 50);
      return;
    }

    setStep6Completed((prev) => new Set([...prev, "hl-opposite-sides"]));
    setStep6ActiveIdx(2);

    setTimeout(() => {
      setAnglesVisible(Array(8).fill(false));
      setLineDimState(buildLineDimAllDimmed());
      runPairsSequence(ALT_EXTERIOR_PAIRS, () => {
        gsap.delayedCall(1, () => {
          setStep6Active(false);
          onUpdateTexts(APP_DATA.steps[6].navNext);
          onSetNextEnabled(true);
        });
      });
    }, 50);
  };

  const blinkInteriorRegions = (onComplete) => {
    pulseRegionElements([intRegionRef.current], onComplete);
  };

  const handleInsideTwoLinesClick = (isReplay) => {
    hideTapGif();
    playSnd("click");

    const finishHighlight = () => {
      if (!isReplay) {
        setStep8Completed((prev) => new Set([...prev, "hl-inside-two-lines"]));
        setStep8ActiveIdx(1);
        showTapOnHighlight("hl-opposite-sides");
      } else {
        restoreNudgeOnCurrentHighlight();
      }
    };

    if (isReplay && interiorRegionsVisible) {
      blinkInteriorRegions(finishHighlight);
      return;
    }

    animateRegionHighlightReveal(
      () => setInteriorRegionsVisible(true),
      () => [intRegionRef.current],
      finishHighlight,
    );
  };

  const handleInteriorOppositeSidesClick = (isReplay) => {
    hideTapGif();
    playSnd("click");

    if (isReplay) {
      setTimeout(() => {
        setAnglesVisible(Array(8).fill(false));
        setLineDimState(buildLineDimAllDimmed());
        runPairsSequence(ALT_INTERIOR_PAIRS, () => {
          gsap.delayedCall(1, restoreNudgeOnCurrentHighlight);
        });
      }, 50);
      return;
    }

    setStep8Completed((prev) => new Set([...prev, "hl-opposite-sides"]));
    setStep8ActiveIdx(2);

    setTimeout(() => {
      setAnglesVisible(Array(8).fill(false));
      setLineDimState(buildLineDimAllDimmed());
      runPairsSequence(ALT_INTERIOR_PAIRS, () => {
        gsap.delayedCall(1, () => {
          setStep8Active(false);
          onUpdateTexts(APP_DATA.steps[8].navNext);
          onSetNextEnabled(true);
        });
      });
    }, 50);
  };

  const handleCoExteriorOutsideClick = (isReplay) => {
    hideTapGif();
    playSnd("click");

    const finishHighlight = () => {
      if (!isReplay) {
        setStep10Completed((prev) => new Set([...prev, "hl-outside-two-lines"]));
        setStep10ActiveIdx(1);
        showTapOnHighlight("hl-same-side");
      } else {
        restoreNudgeOnCurrentHighlight();
      }
    };

    if (isReplay && exteriorRegionsVisible) {
      blinkExteriorRegions(finishHighlight);
      return;
    }

    animateRegionHighlightReveal(
      () => setExteriorRegionsVisible(true),
      () => [extRegionTopRef.current, extRegionBottomRef.current],
      finishHighlight,
    );
  };

  const handleCoExteriorSameSideClick = (isReplay) => {
    hideTapGif();
    playSnd("click");

    if (isReplay) {
      setTimeout(() => {
        setAnglesVisible(Array(8).fill(false));
        setLineDimState(buildLineDimAllDimmed());
        runPairsSequence(CO_EXTERIOR_PAIRS, () => {
          gsap.delayedCall(1, restoreNudgeOnCurrentHighlight);
        });
      }, 50);
      return;
    }

    setStep10Completed((prev) => new Set([...prev, "hl-same-side"]));
    setStep10ActiveIdx(2);

    setTimeout(() => {
      setAnglesVisible(Array(8).fill(false));
      setLineDimState(buildLineDimAllDimmed());
      runPairsSequence(CO_EXTERIOR_PAIRS, () => {
        gsap.delayedCall(1, () => {
          setStep10Active(false);
          onUpdateTexts(APP_DATA.steps[10].navNext);
          onSetNextEnabled(true);
        });
      });
    }, 50);
  };

  const handleCoInteriorInsideClick = (isReplay) => {
    hideTapGif();
    playSnd("click");

    const finishHighlight = () => {
      if (!isReplay) {
        setStep12Completed((prev) => new Set([...prev, "hl-inside-two-lines"]));
        setStep12ActiveIdx(1);
        showTapOnHighlight("hl-same-side");
      } else {
        restoreNudgeOnCurrentHighlight();
      }
    };

    if (isReplay && interiorRegionsVisible) {
      blinkInteriorRegions(finishHighlight);
      return;
    }

    animateRegionHighlightReveal(
      () => setInteriorRegionsVisible(true),
      () => [intRegionRef.current],
      finishHighlight,
    );
  };

  const handleCoInteriorSameSideClick = (isReplay) => {
    hideTapGif();
    playSnd("click");

    if (isReplay) {
      setTimeout(() => {
        setAnglesVisible(Array(8).fill(false));
        setLineDimState(buildLineDimAllDimmed());
        runPairsSequence(CO_INTERIOR_PAIRS, () => {
          gsap.delayedCall(1, restoreNudgeOnCurrentHighlight);
        });
      }, 50);
      return;
    }

    setStep12Completed((prev) => new Set([...prev, "hl-same-side"]));
    setStep12ActiveIdx(2);

    setTimeout(() => {
      setAnglesVisible(Array(8).fill(false));
      setLineDimState(buildLineDimAllDimmed());
      runPairsSequence(CO_INTERIOR_PAIRS, () => {
        gsap.delayedCall(1, () => {
          setStep12Active(false);
          onUpdateTexts(APP_DATA.steps[12].navNext);
          onSetNextEnabled(true);
        });
      });
    }, 50);
  };

  const centerCloneOnTarget = (cloneEl, targetRect, colRect) => {
    const cloneRect = cloneEl.getBoundingClientRect();
    return {
      left:
        targetRect.left -
        colRect.left +
        (targetRect.width - cloneRect.width) / 2,
      top:
        targetRect.top -
        colRect.top +
        (targetRect.height - cloneRect.height) / 2,
    };
  };

  const flyLabelsToSlot = (smallerIdx, largerIdx, slotIndex, onComplete) => {
    const leftCol = leftColumnRef.current;
    const chip = pairSlotRefs.current[slotIndex];
    const labelSmaller =
      angleGroupRefs.current[smallerIdx]?.querySelector("text");
    const labelLarger =
      angleGroupRefs.current[largerIdx]?.querySelector("text");
    const numTargets = chip?.querySelectorAll(".pair-num");

    if (
      !leftCol ||
      !chip ||
      !labelSmaller ||
      !labelLarger ||
      !numTargets ||
      numTargets.length < 2
    ) {
      onComplete?.();
      return;
    }

    const colRect = leftCol.getBoundingClientRect();
    const rSmall = labelSmaller.getBoundingClientRect();
    const rLarge = labelLarger.getBoundingClientRect();
    const tSmall = numTargets[0].getBoundingClientRect();
    const tLarge = numTargets[1].getBoundingClientRect();
    const FLYING_LABEL_SCALE = 0.78;
    const fontSize = `${rSmall.height * FLYING_LABEL_SCALE}px`;

    const clones = [
      {
        el: document.createElement("div"),
        startX: rSmall.left - colRect.left,
        startY: rSmall.top - colRect.top,
        targetRect: tSmall,
        text: labelSmaller.textContent,
        width: rSmall.width,
        height: rSmall.height,
      },
      {
        el: document.createElement("div"),
        startX: rLarge.left - colRect.left,
        startY: rLarge.top - colRect.top,
        targetRect: tLarge,
        text: labelLarger.textContent,
        width: rLarge.width,
        height: rLarge.height,
      },
    ];

    clones.forEach((c) => {
      c.el.className = "flying-angle-label";
      c.el.textContent = c.text;
      c.el.style.left = `${c.startX}px`;
      c.el.style.top = `${c.startY}px`;
      c.el.style.fontSize = fontSize;
      c.el.style.lineHeight = `${c.height * FLYING_LABEL_SCALE}px`;
      c.el.style.width = `${c.width * FLYING_LABEL_SCALE}px`;
      leftCol.appendChild(c.el);
    });

    clones.forEach((c) => {
      const end = centerCloneOnTarget(c.el, c.targetRect, colRect);
      c.endX = end.left;
      c.endY = end.top;
    });

    const tl = gsap.timeline({
      onComplete: () => {
        clones.forEach((c) => c.el.remove());
        setFilledPairSlots((prev) =>
          prev.map((slot, i) =>
            i === slotIndex ? { ...slot, visible: true } : slot,
          ),
        );
        onComplete?.();
      },
    });

    clones.forEach((c) => {
      tl.to(
        c.el,
        { left: c.endX, top: c.endY, duration: 0.7, ease: "power2.inOut" },
        0,
      );
    });
  };

  const handleAngleClick = (idx) => {
    if (interactionLocked) return;

    if (step === 5) {
      if (disabledAngleIndices.has(idx)) return;

      const pairIdx = getCorrespondingPair(idx);
      const slotIndex = filledPairSlots.findIndex((s) => !s.visible);
      if (slotIndex < 0) return;

      const smallerIdx = Math.min(idx, pairIdx);
      const largerIdx = Math.max(idx, pairIdx);

      hideTapGif();
      playSnd("click");
      setInteractionLocked(true);

      const allDim = [0, 1, 2, 3, 4, 5, 6, 7].filter(
        (i) => i !== idx && i !== pairIdx,
      );
      setLineDimState(buildLineDimForAngles([idx, pairIdx]));
      setAngleDimState({ highlight: [idx, pairIdx], dim: allDim });

      blinkAnglePaths([idx, pairIdx], () => {
        setFilledPairSlots((prev) =>
          prev.map((s, i) =>
            i === slotIndex
              ? {
                  a: smallerIdx + 1,
                  b: largerIdx + 1,
                  shown: true,
                  visible: false,
                }
              : s,
          ),
        );

        const runFly = () => {
          const chip = pairSlotRefs.current[slotIndex];
          if (!chip?.querySelectorAll(".pair-num").length) {
            requestAnimationFrame(runFly);
            return;
          }
          flyLabelsToSlot(smallerIdx, largerIdx, slotIndex, () => {
            setLineDimState(null);
            setAngleDimState(null);
            const newDisabled = new Set([
              ...disabledAngleIndices,
              idx,
              pairIdx,
            ]);
            setDisabledAngleIndices(newDisabled);
            setInteractionLocked(false);
            if (newDisabled.size >= 8) {
              onUpdateTexts(APP_DATA.steps[5].navNext);
              onSetNextEnabled(true);
            }
          });
        };

        requestAnimationFrame(() => requestAnimationFrame(runFly));
      });
      return;
    }

    if (step === 7) {
      if (!EXTERIOR_ANGLE_INDICES.includes(idx)) return;
      if (disabledAngleIndices.has(idx)) return;

      const pairIdx = getAlternateExteriorPair(idx);
      const slotIndex = filledPairSlots.findIndex((s) => !s.visible);
      if (slotIndex < 0) return;

      const smallerIdx = Math.min(idx, pairIdx);
      const largerIdx = Math.max(idx, pairIdx);

      hideTapGif();
      playSnd("click");
      setInteractionLocked(true);

      const allDim = [0, 1, 2, 3, 4, 5, 6, 7].filter(
        (i) => i !== idx && i !== pairIdx,
      );
      setLineDimState(buildLineDimForAngles([idx, pairIdx]));
      setAngleDimState({ highlight: [idx, pairIdx], dim: allDim });

      blinkAnglePaths([idx, pairIdx], () => {
        setFilledPairSlots((prev) =>
          prev.map((s, i) =>
            i === slotIndex
              ? {
                  a: smallerIdx + 1,
                  b: largerIdx + 1,
                  shown: true,
                  visible: false,
                }
              : s,
          ),
        );

        const runFly = () => {
          const chip = pairSlotRefs.current[slotIndex];
          if (!chip?.querySelectorAll(".pair-num").length) {
            requestAnimationFrame(runFly);
            return;
          }
          flyLabelsToSlot(smallerIdx, largerIdx, slotIndex, () => {
            setLineDimState(null);
            setAngleDimState(null);
            const newDisabled = new Set([
              ...disabledAngleIndices,
              idx,
              pairIdx,
            ]);
            setDisabledAngleIndices(newDisabled);
            setInteractionLocked(false);
            if (newDisabled.size >= 4) {
              onUpdateTexts(APP_DATA.steps[7].navNext);
              onSetNextEnabled(true);
            }
          });
        };

        requestAnimationFrame(() => requestAnimationFrame(runFly));
      });
    }

    if (step === 9) {
      if (!INTERIOR_ANGLE_INDICES.includes(idx)) return;
      if (disabledAngleIndices.has(idx)) return;

      const pairIdx = getAlternateInteriorPair(idx);
      const slotIndex = filledPairSlots.findIndex((s) => !s.visible);
      if (slotIndex < 0) return;

      const smallerIdx = Math.min(idx, pairIdx);
      const largerIdx = Math.max(idx, pairIdx);

      hideTapGif();
      playSnd("click");
      setInteractionLocked(true);

      const allDim = [0, 1, 2, 3, 4, 5, 6, 7].filter(
        (i) => i !== idx && i !== pairIdx,
      );
      setLineDimState(buildLineDimForAngles([idx, pairIdx]));
      setAngleDimState({ highlight: [idx, pairIdx], dim: allDim });

      blinkAnglePaths([idx, pairIdx], () => {
        setFilledPairSlots((prev) =>
          prev.map((s, i) =>
            i === slotIndex
              ? {
                  a: smallerIdx + 1,
                  b: largerIdx + 1,
                  shown: true,
                  visible: false,
                }
              : s,
          ),
        );

        const runFly = () => {
          const chip = pairSlotRefs.current[slotIndex];
          if (!chip?.querySelectorAll(".pair-num").length) {
            requestAnimationFrame(runFly);
            return;
          }
          flyLabelsToSlot(smallerIdx, largerIdx, slotIndex, () => {
            setLineDimState(null);
            setAngleDimState(null);
            const newDisabled = new Set([
              ...disabledAngleIndices,
              idx,
              pairIdx,
            ]);
            setDisabledAngleIndices(newDisabled);
            setInteractionLocked(false);
            if (newDisabled.size >= 4) {
              onUpdateTexts(APP_DATA.steps[9].navNext);
              onSetNextEnabled(true);
            }
          });
        };

        requestAnimationFrame(() => requestAnimationFrame(runFly));
      });
    }

    if (step === 11) {
      if (!EXTERIOR_ANGLE_INDICES.includes(idx)) return;
      if (disabledAngleIndices.has(idx)) return;

      const pairIdx = getCoExteriorPair(idx);
      const slotIndex = filledPairSlots.findIndex((s) => !s.visible);
      if (slotIndex < 0) return;

      const smallerIdx = Math.min(idx, pairIdx);
      const largerIdx = Math.max(idx, pairIdx);

      hideTapGif();
      playSnd("click");
      setInteractionLocked(true);

      const allDim = [0, 1, 2, 3, 4, 5, 6, 7].filter(
        (i) => i !== idx && i !== pairIdx,
      );
      setLineDimState(buildLineDimForAngles([idx, pairIdx]));
      setAngleDimState({ highlight: [idx, pairIdx], dim: allDim });

      blinkAnglePaths([idx, pairIdx], () => {
        setFilledPairSlots((prev) =>
          prev.map((s, i) =>
            i === slotIndex
              ? {
                  a: smallerIdx + 1,
                  b: largerIdx + 1,
                  shown: true,
                  visible: false,
                }
              : s,
          ),
        );

        const runFly = () => {
          const chip = pairSlotRefs.current[slotIndex];
          if (!chip?.querySelectorAll(".pair-num").length) {
            requestAnimationFrame(runFly);
            return;
          }
          flyLabelsToSlot(smallerIdx, largerIdx, slotIndex, () => {
            setLineDimState(null);
            setAngleDimState(null);
            const newDisabled = new Set([
              ...disabledAngleIndices,
              idx,
              pairIdx,
            ]);
            setDisabledAngleIndices(newDisabled);
            setInteractionLocked(false);
            if (newDisabled.size >= 4) {
              onUpdateTexts(APP_DATA.steps[11].navNext);
              onSetNextEnabled(true);
            }
          });
        };

        requestAnimationFrame(() => requestAnimationFrame(runFly));
      });
    }

    if (step === 13) {
      if (!INTERIOR_ANGLE_INDICES.includes(idx)) return;
      if (disabledAngleIndices.has(idx)) return;

      const pairIdx = getCoInteriorPair(idx);
      const slotIndex = filledPairSlots.findIndex((s) => !s.visible);
      if (slotIndex < 0) return;

      const smallerIdx = Math.min(idx, pairIdx);
      const largerIdx = Math.max(idx, pairIdx);

      hideTapGif();
      playSnd("click");
      setInteractionLocked(true);

      const allDim = [0, 1, 2, 3, 4, 5, 6, 7].filter(
        (i) => i !== idx && i !== pairIdx,
      );
      setLineDimState(buildLineDimForAngles([idx, pairIdx]));
      setAngleDimState({ highlight: [idx, pairIdx], dim: allDim });

      blinkAnglePaths([idx, pairIdx], () => {
        setFilledPairSlots((prev) =>
          prev.map((s, i) =>
            i === slotIndex
              ? {
                  a: smallerIdx + 1,
                  b: largerIdx + 1,
                  shown: true,
                  visible: false,
                }
              : s,
          ),
        );

        const runFly = () => {
          const chip = pairSlotRefs.current[slotIndex];
          if (!chip?.querySelectorAll(".pair-num").length) {
            requestAnimationFrame(runFly);
            return;
          }
          flyLabelsToSlot(smallerIdx, largerIdx, slotIndex, () => {
            setLineDimState(null);
            setAngleDimState(null);
            const newDisabled = new Set([
              ...disabledAngleIndices,
              idx,
              pairIdx,
            ]);
            setDisabledAngleIndices(newDisabled);
            setInteractionLocked(false);
            if (newDisabled.size >= 4) {
              onUpdateTexts(APP_DATA.steps[13].navNext);
              onSetNextEnabled(true);
            }
          });
        };

        requestAnimationFrame(() => requestAnimationFrame(runFly));
      });
    }
  };

  const handleRightColumnClick = (e) => {
    const target = e.target;
    if (!target.classList.contains("highlight")) return;
    if (animatingRef.current) return;

    const isActive = target.classList.contains("active");
    const isInactive = target.classList.contains("inactive");
    if (!isActive && !isInactive) return;

    const isReplay = target.classList.contains("inactive");

    if (step === 1) {
      if (target.classList.contains("hl-transversal")) {
        setAnimatingRef(true);
        handleTransversalClick(isReplay);
        setTimeout(() => {
          setAnimatingRef(false);
        }, 3000);
      } else if (target.classList.contains("hl-two-lines")) {
        setAnimatingRef(true);
        handleTwoLinesClick(isReplay);
        setTimeout(() => {
          setAnimatingRef(false);
        }, 3000);
      } else if (target.classList.contains("hl-different-points")) {
        setAnimatingRef(true);
        handleDifferentPointsClick(isReplay);
        setTimeout(() => {
          setAnimatingRef(false);
        }, 4000);
      } else if (target.classList.contains("hl-eight-angles")) {
        setAnimatingRef(true);
        handleEightAnglesClick(isReplay);
        setTimeout(() => {
          setAnimatingRef(false);
        }, 5000);
      }
    }

    if (step === 2 && headingReady) {
      if (target.classList.contains("hl-adjacent-angles")) {
        setAnimatingRef(true);
        handleAdjacentAnglesClick(isReplay);
        setTimeout(() => {
          setAnimatingRef(false);
        }, 3000);
      } else if (target.classList.contains("hl-straight-line")) {
        if (
          !isReplay &&
          !step2Completed.has("hl-adjacent-angles") &&
          step2ActiveIdx < 1
        )
          return;
        setAnimatingRef(true);
        handleStraightLineClick(isReplay);
        setTimeout(() => {
          setAnimatingRef(false);
        }, 2000);
      }
    }

    if (step === 3 && headingReady) {
      if (target.classList.contains("hl-opposite-angles")) {
        setAnimatingRef(true);
        handleOppositeAnglesClick(isReplay);
        setTimeout(() => {
          setAnimatingRef(false);
        }, 3000);
      }
    }

    if (step === 4 && headingReady) {
      if (target.classList.contains("hl-same-relative-position")) {
        setAnimatingRef(true);
        handleSameRelativePositionClick(isReplay);
        setTimeout(() => {
          setAnimatingRef(false);
        }, 20000);
      }
    }

    if (step === 6 && headingReady) {
      if (target.classList.contains("hl-outside-two-lines")) {
        setAnimatingRef(true);
        handleOutsideTwoLinesClick(isReplay);
        setTimeout(() => {
          setAnimatingRef(false);
        }, 5000);
      } else if (target.classList.contains("hl-opposite-sides")) {
        if (
          !isReplay &&
          !step6Completed.has("hl-outside-two-lines") &&
          step6ActiveIdx < 1
        )
          return;
        setAnimatingRef(true);
        handleOppositeSidesClick(isReplay);
        setTimeout(() => {
          setAnimatingRef(false);
        }, 15000);
      }
    }

    if (step === 8 && headingReady) {
      if (target.classList.contains("hl-inside-two-lines")) {
        setAnimatingRef(true);
        handleInsideTwoLinesClick(isReplay);
        setTimeout(() => {
          setAnimatingRef(false);
        }, 5000);
      } else if (target.classList.contains("hl-opposite-sides")) {
        if (
          !isReplay &&
          !step8Completed.has("hl-inside-two-lines") &&
          step8ActiveIdx < 1
        )
          return;
        setAnimatingRef(true);
        handleInteriorOppositeSidesClick(isReplay);
        setTimeout(() => {
          setAnimatingRef(false);
        }, 15000);
      }
    }

    if (step === 10 && headingReady) {
      if (target.classList.contains("hl-outside-two-lines")) {
        setAnimatingRef(true);
        handleCoExteriorOutsideClick(isReplay);
        setTimeout(() => {
          setAnimatingRef(false);
        }, 5000);
      } else if (target.classList.contains("hl-same-side")) {
        if (
          !isReplay &&
          !step10Completed.has("hl-outside-two-lines") &&
          step10ActiveIdx < 1
        )
          return;
        setAnimatingRef(true);
        handleCoExteriorSameSideClick(isReplay);
        setTimeout(() => {
          setAnimatingRef(false);
        }, 15000);
      }
    }

    if (step === 12 && headingReady) {
      if (target.classList.contains("hl-inside-two-lines")) {
        setAnimatingRef(true);
        handleCoInteriorInsideClick(isReplay);
        setTimeout(() => {
          setAnimatingRef(false);
        }, 5000);
      } else if (target.classList.contains("hl-same-side")) {
        if (
          !isReplay &&
          !step12Completed.has("hl-inside-two-lines") &&
          step12ActiveIdx < 1
        )
          return;
        setAnimatingRef(true);
        handleCoInteriorSameSideClick(isReplay);
        setTimeout(() => {
          setAnimatingRef(false);
        }, 15000);
      }
    }
  };

  const makeHighlightSpan = (cls, text, idx, activeIdx, completed) => {
    const isDone = completed.has(cls);
    const isActive = idx === activeIdx;
    if (!isActive && !isDone) {
      return `<span class="highlight-pending">${text}</span>`;
    }
    const state = isActive ? "active" : "inactive";
    return `<span class="highlight ${cls} ${state}">${text}</span>`;
  };

  const buildStep1Text = () => {
    const p = APP_DATA.step1Parts;
    return (
      `${p.part1}${makeHighlightSpan("hl-transversal", p.transversal, 0, step1ActiveIdx, step1Completed)}` +
      `${p.part2}${makeHighlightSpan("hl-two-lines", p.twoLines, 1, step1ActiveIdx, step1Completed)}` +
      `${p.part3}${makeHighlightSpan("hl-different-points", p.differentPoints, 2, step1ActiveIdx, step1Completed)}` +
      `${p.part4}${makeHighlightSpan("hl-eight-angles", p.eightAngles, 3, step1ActiveIdx, step1Completed)}` +
      `${p.part5}`
    );
  };

  const buildStep2Text = () => {
    const p = APP_DATA.step2Parts;
    const activeIdx =
      headingReady && step2ActiveIdx < 2 ? step2ActiveIdx : -1;
    return (
      `${p.part1}${makeHighlightSpan("hl-adjacent-angles", p.adjacentAngles, 0, activeIdx, step2Completed)}` +
      `${p.part2}${makeHighlightSpan("hl-straight-line", p.straightLine, 1, activeIdx, step2Completed)}` +
      `${p.part3}`
    );
  };

  const buildStep3Text = () => {
    const p = APP_DATA.step3Parts;
    const completed = step3Completed
      ? new Set(["hl-opposite-angles"])
      : new Set();
    const activeIdx =
      !headingReady || !step3Active
        ? -1
        : step3Completed
          ? 1
          : 0;
    return (
      `${p.part1}${makeHighlightSpan("hl-opposite-angles", p.oppositeAngles, 0, activeIdx, completed)}` +
      `${p.part2}`
    );
  };

  const buildStep4Text = () => {
    const p = APP_DATA.step4Parts;
    const completed = step4Completed
      ? new Set(["hl-same-relative-position"])
      : new Set();
    const activeIdx =
      !headingReady || !step4Active
        ? -1
        : step4Completed
          ? 1
          : 0;
    return (
      `${p.part1}${makeHighlightSpan("hl-same-relative-position", p.sameRelativePosition, 0, activeIdx, completed)}` +
      `${p.part2}`
    );
  };

  const buildStep5Text = () => {
    const p = APP_DATA.step4Parts;
    return `${p.part1}${p.sameRelativePosition}${p.part2}`;
  };

  const buildStep6Text = () => {
    const p = APP_DATA.step6Parts;
    const activeIdx =
      headingReady && step6Active && step6ActiveIdx < 2
        ? step6ActiveIdx
        : -1;
    return (
      `${p.part1}${makeHighlightSpan("hl-outside-two-lines", p.outsideTwoLines, 0, activeIdx, step6Completed)}` +
      `${p.part2}${makeHighlightSpan("hl-opposite-sides", p.oppositeSides, 1, activeIdx, step6Completed)}` +
      `${p.part3}`
    );
  };

  const buildStep7Text = () => {
    const p = APP_DATA.step6Parts;
    return `${p.part1}${p.outsideTwoLines}${p.part2}${p.oppositeSides}${p.part3}`;
  };

  const buildStep8Text = () => {
    const p = APP_DATA.step8Parts;
    const activeIdx =
      headingReady && step8Active && step8ActiveIdx < 2
        ? step8ActiveIdx
        : -1;
    return (
      `${p.part1}${makeHighlightSpan("hl-inside-two-lines", p.insideTwoLines, 0, activeIdx, step8Completed)}` +
      `${p.part2}${makeHighlightSpan("hl-opposite-sides", p.oppositeSides, 1, activeIdx, step8Completed)}` +
      `${p.part3}`
    );
  };

  const buildStep9Text = () => {
    const p = APP_DATA.step8Parts;
    return `${p.part1}${p.insideTwoLines}${p.part2}${p.oppositeSides}${p.part3}`;
  };

  const buildStep10Text = () => {
    const p = APP_DATA.step10Parts;
    const activeIdx =
      headingReady && step10Active && step10ActiveIdx < 2
        ? step10ActiveIdx
        : -1;
    return (
      `${p.part1}${makeHighlightSpan("hl-outside-two-lines", p.outsideTwoLines, 0, activeIdx, step10Completed)}` +
      `${p.part2}${makeHighlightSpan("hl-same-side", p.sameSide, 1, activeIdx, step10Completed)}` +
      `${p.part3}`
    );
  };

  const buildStep11Text = () => {
    const p = APP_DATA.step10Parts;
    return `${p.part1}${p.outsideTwoLines}${p.part2}${p.sameSide}${p.part3}`;
  };

  const buildStep12Text = () => {
    const p = APP_DATA.step12Parts;
    const activeIdx =
      headingReady && step12Active && step12ActiveIdx < 2
        ? step12ActiveIdx
        : -1;
    return (
      `${p.part1}${makeHighlightSpan("hl-inside-two-lines", p.insideTwoLines, 0, activeIdx, step12Completed)}` +
      `${p.part2}${makeHighlightSpan("hl-same-side", p.sameSide, 1, activeIdx, step12Completed)}` +
      `${p.part3}`
    );
  };

  const buildStep13Text = () => {
    const p = APP_DATA.step12Parts;
    return `${p.part1}${p.insideTwoLines}${p.part2}${p.sameSide}${p.part3}`;
  };

  const getRightText = () => {
    if (step === 1) return buildStep1Text();
    if (step === 2) return buildStep2Text();
    if (step === 3) return buildStep3Text();
    if (step === 4) return buildStep4Text();
    if (step === 5) return buildStep5Text();
    if (step === 6) return buildStep6Text();
    if (step === 7) return buildStep7Text();
    if (step === 8) return buildStep8Text();
    if (step === 9) return buildStep9Text();
    if (step === 10) return buildStep10Text();
    if (step === 11) return buildStep11Text();
    if (step === 12) return buildStep12Text();
    if (step === 13) return buildStep13Text();
    return "";
  };

  const isSegmentDimmed = (key) => {
    if (!lineDimState) return false;
    return lineDimState[key] === true;
  };

  const isAngleDimmed = (idx) => {
    if (!angleDimState) return false;
    return angleDimState.dim && angleDimState.dim.includes(idx);
  };

  const renderSegment = (key) => {
    const seg = LINE_SEGMENTS[key];
    const dimmed = isSegmentDimmed(key);
    const stroke = dimmed ? "#888888" : seg.color;
    const opacity = dimmed ? 0.5 : 1;
    const markers = {};
    if (seg.markerStart)
      markers.markerStart = `url(#${dimmed ? seg.markerStart + "-dim" : seg.markerStart})`;
    if (seg.markerEnd)
      markers.markerEnd = `url(#${dimmed ? seg.markerEnd + "-dim" : seg.markerEnd})`;

    return React.createElement("line", {
      key,
      ref: (el) => {
        segmentRefs.current[key] = el;
      },
      x1: seg.x1,
      y1: seg.y1,
      x2: seg.x2,
      y2: seg.y2,
      stroke,
      strokeWidth: 3,
      opacity: linesVisible ? opacity : 0,
      ...markers,
    });
  };

  const renderWholeLines = () =>
    React.createElement(
      "g",
      { opacity: linesVisible ? 1 : 0 },
      React.createElement(
        "g",
        { ref: transversalRef },
        React.createElement("line", {
          x1: WHOLE_TRANSVERSAL.x1,
          y1: WHOLE_TRANSVERSAL.y1,
          x2: WHOLE_TRANSVERSAL.x2,
          y2: WHOLE_TRANSVERSAL.y2,
          stroke: "#00b0ff",
          strokeWidth: 3,
          markerStart: "url(#arrow-blue-start)",
          markerEnd: "url(#arrow-blue-end)",
        }),
      ),
      React.createElement("line", {
        ref: yellow1Ref,
        x1: WHOLE_YELLOW_TOP.x1,
        y1: WHOLE_YELLOW_TOP.y1,
        x2: WHOLE_YELLOW_TOP.x2,
        y2: WHOLE_YELLOW_TOP.y2,
        stroke: "#ffc107",
        strokeWidth: 3,
        markerStart: "url(#arrow-yellow-start)",
        markerEnd: "url(#arrow-yellow-end)",
      }),
      React.createElement("line", {
        ref: yellow2Ref,
        x1: WHOLE_YELLOW_BOTTOM.x1,
        y1: WHOLE_YELLOW_BOTTOM.y1,
        x2: WHOLE_YELLOW_BOTTOM.x2,
        y2: WHOLE_YELLOW_BOTTOM.y2,
        stroke: "#ffc107",
        strokeWidth: 3,
        markerStart: "url(#arrow-yellow-start)",
        markerEnd: "url(#arrow-yellow-end)",
      }),
    );

  const renderSegmentLines = () =>
    React.createElement("g", null, ALL_SEGMENT_KEYS.map(renderSegment));

  const renderPagination = () => {
    const stepData = APP_DATA.steps[step];
    if (!stepData || !stepData.totalDots) return null;
    const dots = [];
    for (let i = 1; i <= stepData.totalDots; i++) {
      dots.push(
        React.createElement("div", {
          key: i,
          className: `pagination-dot${i === stepData.paginationDot ? " active" : ""}`,
        }),
      );
    }
    return React.createElement("div", { className: "right-pagination" }, dots);
  };

  const showHeading = step >= 2 && step <= 13;
  const useSegments = step >= 2;
  const showEmptyPairRow = step === 5 || step === 7 || step === 9 || step === 11 || step === 13;
  const showStep14Definition =
    step === 14 && step14Selected !== null && step14Selected !== undefined;

  const renderStep14Panel = () =>
    React.createElement(
      React.Fragment,
      null,
      React.createElement("div", {
        className: "step14-title",
        dangerouslySetInnerHTML: { __html: APP_DATA.step14.title },
      }),
      React.createElement(
        "div",
        { className: "step14-buttons" },
        APP_DATA.step14.buttons.map((label, idx) =>
          React.createElement(
            "button",
            {
              key: idx,
              type: "button",
              className: `step14-button${step14Selected === idx ? " active" : ""}`,
              onClick: () => handleReviewButtonClick(idx),
            },
            label,
          ),
        ),
      ),
    );

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    getTapGifStyles().map((style) =>
      style.display !== "none"
        ? React.createElement("img", {
            key: style.key,
            src: "assets/tap.gif",
            className: style.className || "tap-gif",
            style,
          })
        : null,
    ),
    React.createElement(
      "div",
      { className: "left-column", ref: leftColumnRef },
      React.createElement(
        "div",
        { className: "diagram-text-slot" },
        topDefinitionVisible &&
          step === 4 &&
          React.createElement(
            "div",
            {
              ref: definitionBoxRef,
              className: "diagram-top-box diagram-top-box--definition",
            },
            APP_DATA.labels.correspondingDefinition,
          ),
        showStep14Definition &&
          React.createElement("div", {
            className:
              "diagram-top-box diagram-top-box--definition step14-definition-box",
            dangerouslySetInnerHTML: {
              __html: APP_DATA.step14.definitions[step14Selected],
            },
          }),
        showEmptyPairRow &&
          React.createElement(
            "div",
            {
              className: "diagram-top-box diagram-top-box--pairs",
              ref: pairsRowRef,
            },
            filledPairSlots.map((filled, slot) => {
              const innerStyle = filled.visible ? undefined : { opacity: 0 };
              return React.createElement(
                "div",
                {
                  key: slot,
                  ref: (el) => {
                    pairSlotRefs.current[slot] = el;
                  },
                  className: `pair-chip${filled.visible ? " filled" : ""}`,
                  style: { opacity: filled.shown ? 1 : 0 },
                },
                React.createElement(
                  "span",
                  { className: "pair-symbol", style: innerStyle },
                  React.createElement("span", { className: "pair-arc" }, "∠"),
                  React.createElement(
                    "span",
                    { className: "pair-num" },
                    filled.a,
                  ),
                ),
                React.createElement(
                  "span",
                  { className: "pair-amp", style: innerStyle },
                  " & ",
                ),
                React.createElement(
                  "span",
                  { className: "pair-symbol", style: innerStyle },
                  React.createElement("span", { className: "pair-arc" }, "∠"),
                  React.createElement(
                    "span",
                    { className: "pair-num" },
                    filled.b,
                  ),
                ),
              );
            }),
          ),
      ),
      React.createElement(
        "svg",
        {
          className: "grid-svg",
          viewBox: "0 0 600 500",
          preserveAspectRatio: "xMidYMid slice",
        },
        React.createElement(
          "defs",
          null,
          ["blue", "yellow"]
            .map((color) => {
              const fill = color === "blue" ? "#00b0ff" : "#ffc107";
              const dimFill = "#888888";
              return [
                React.createElement(
                  "marker",
                  {
                    key: `arrow-${color}-start`,
                    id: `arrow-${color}-start`,
                    viewBox: "0 0 10 10",
                    refX: 5,
                    refY: 5,
                    markerWidth: 5,
                    markerHeight: 5,
                    orient: "auto-start-reverse",
                  },
                  React.createElement("path", {
                    d: "M 0 0 L 10 5 L 0 10 z",
                    fill,
                  }),
                ),
                React.createElement(
                  "marker",
                  {
                    key: `arrow-${color}-end`,
                    id: `arrow-${color}-end`,
                    viewBox: "0 0 10 10",
                    refX: 5,
                    refY: 5,
                    markerWidth: 5,
                    markerHeight: 5,
                    orient: "auto",
                  },
                  React.createElement("path", {
                    d: "M 0 0 L 10 5 L 0 10 z",
                    fill,
                  }),
                ),
                React.createElement(
                  "marker",
                  {
                    key: `arrow-${color}-start-dim`,
                    id: `arrow-${color}-start-dim`,
                    viewBox: "0 0 10 10",
                    refX: 5,
                    refY: 5,
                    markerWidth: 5,
                    markerHeight: 5,
                    orient: "auto-start-reverse",
                  },
                  React.createElement("path", {
                    d: "M 0 0 L 10 5 L 0 10 z",
                    fill: dimFill,
                  }),
                ),
                React.createElement(
                  "marker",
                  {
                    key: `arrow-${color}-end-dim`,
                    id: `arrow-${color}-end-dim`,
                    viewBox: "0 0 10 10",
                    refX: 5,
                    refY: 5,
                    markerWidth: 5,
                    markerHeight: 5,
                    orient: "auto",
                  },
                  React.createElement("path", {
                    d: "M 0 0 L 10 5 L 0 10 z",
                    fill: dimFill,
                  }),
                ),
              ];
            })
            .flat(),
        ),

        React.createElement("polygon", {
          ref: extRegionTopRef,
          points: EXT_REGION_TOP,
          fill: "rgba(3, 169, 244, 0.3)",
          opacity: 0,
          style: { pointerEvents: "none" },
        }),
        React.createElement("polygon", {
          ref: extRegionBottomRef,
          points: EXT_REGION_BOTTOM,
          fill: "rgba(3, 169, 244, 0.3)",
          opacity: 0,
          style: { pointerEvents: "none" },
        }),
        React.createElement("polygon", {
          ref: intRegionRef,
          points: INT_REGION,
          fill: "rgba(255, 235, 59, 0.3)",
          opacity: 0,
          style: { pointerEvents: "none" },
        }),

        React.createElement(
          "g",
          null,
          angleData.map((ang, idx) => {
            if (!anglesVisible[idx]) return null;
            const dimmed = isAngleDimmed(idx);
            const isClickable =
              (step === 5 &&
                !disabledAngleIndices.has(idx) &&
                !interactionLocked) ||
              (step === 7 &&
                EXTERIOR_ANGLE_INDICES.includes(idx) &&
                !disabledAngleIndices.has(idx) &&
                !interactionLocked) ||
              (step === 9 &&
                INTERIOR_ANGLE_INDICES.includes(idx) &&
                !disabledAngleIndices.has(idx) &&
                !interactionLocked) ||
              (step === 11 &&
                EXTERIOR_ANGLE_INDICES.includes(idx) &&
                !disabledAngleIndices.has(idx) &&
                !interactionLocked) ||
              (step === 13 &&
                INTERIOR_ANGLE_INDICES.includes(idx) &&
                !disabledAngleIndices.has(idx) &&
                !interactionLocked);
            const isPairGrowing =
              step4GrowingPair && step4GrowingPair.includes(idx);
            const appearClass = isPairGrowing ? "" : " angle-appear";
            return React.createElement(
              "g",
              {
                key: `angle-${ang.id}`,
                ref: (el) => {
                  angleGroupRefs.current[idx] = el;
                },
                className: `angle-group-${idx}${appearClass}${dimmed ? " angle-dimmed" : ""}${isClickable ? " angle-clickable" : ""}`,
                onClick: isClickable ? () => handleAngleClick(idx) : undefined,
              },
              React.createElement("path", {
                d: describeArc(ang.cx, ang.cy, ang.r, ang.start, ang.end),
                fill: dimmed ? "rgba(100, 100, 100, 0.35)" : ang.color,
              }),
              showAngleLabels &&
                React.createElement(
                  "text",
                  {
                    x: polarToCartesian(
                      ang.cx,
                      ang.cy,
                      ang.labelR,
                      ang.start + (ang.end - ang.start) / 2,
                    ).x,
                    y:
                      polarToCartesian(
                        ang.cx,
                        ang.cy,
                        ang.labelR,
                        ang.start + (ang.end - ang.start) / 2,
                      ).y + 6,
                    fill: dimmed ? "#666666" : "#ff80ab",
                    fontSize: 24,
                    fontWeight: "bold",
                    textAnchor: "middle",
                    opacity: dimmed ? 0.4 : 1,
                    pointerEvents: isClickable ? "all" : "none",
                    onClick: isClickable
                      ? (e) => {
                          e.stopPropagation();
                          handleAngleClick(idx);
                        }
                      : undefined,
                  },
                  ang.label,
                ),
            );
          }),
        ),

        useSegments ? renderSegmentLines() : renderWholeLines(),

        React.createElement(
          "g",
          { ref: cloneLineRef, opacity: 0, pointerEvents: "none" },
          React.createElement("line", {
            x1: CLONE_LINE.x1,
            y1: CLONE_LINE.y1,
            x2: CLONE_LINE.x2,
            y2: CLONE_LINE.y2,
            stroke: "#ffc107",
            strokeWidth: 3,
            markerStart: "url(#arrow-yellow-start)",
          }),
        ),

        React.createElement("circle", {
          ref: whiteCircle1Ref,
          cx: INT1.cx,
          cy: INT1.cy,
          r: 30,
          fill: "white",
          opacity: 0,
          pointerEvents: "none",
        }),
        React.createElement("circle", {
          ref: whiteCircle2Ref,
          cx: INT2.cx,
          cy: INT2.cy,
          r: 30,
          fill: "white",
          opacity: 0,
          pointerEvents: "none",
        }),

        React.createElement(
          "g",
          { opacity: int1Visible ? 1 : 0 },
          React.createElement("circle", {
            ref: int1OuterRef,
            cx: INT1.cx,
            cy: INT1.cy,
            r: 10,
            fill: "#e91e63",
          }),
          React.createElement("circle", {
            ref: int1InnerRef,
            cx: INT1.cx,
            cy: INT1.cy,
            r: 4,
            fill: "white",
          }),
        ),
        React.createElement(
          "g",
          { opacity: int2Visible ? 1 : 0 },
          React.createElement("circle", {
            ref: int2OuterRef,
            cx: INT2.cx,
            cy: INT2.cy,
            r: 10,
            fill: "#e91e63",
          }),
          React.createElement("circle", {
            ref: int2InnerRef,
            cx: INT2.cx,
            cy: INT2.cy,
            r: 4,
            fill: "white",
          }),
        ),

        transversalLabelVisible &&
          React.createElement(
            "text",
            {
              ref: transversalLabelRef,
              x: DIAGRAM_LABELS.transversal.x,
              y: DIAGRAM_LABELS.transversal.y,
              fill: "white",
              fontSize: 20,
              transform: `rotate(${DIAGRAM_LABELS.transversal.rotate}, ${DIAGRAM_LABELS.transversal.x}, ${DIAGRAM_LABELS.transversal.y})`,
              textAnchor: "middle",
              className: "angle-appear",
            },
            APP_DATA.labels.transversal,
          ),

        straightLineLabelVisible &&
          React.createElement(
            "text",
            {
              ref: straightLineLabelRef,
              x: DIAGRAM_LABELS.straightLine.x,
              y: DIAGRAM_LABELS.straightLine.y,
              fill: "white",
              fontSize: 18,
              transform: `rotate(${DIAGRAM_LABELS.straightLine.rotate}, ${DIAGRAM_LABELS.straightLine.x}, ${DIAGRAM_LABELS.straightLine.y})`,
              textAnchor: "middle",
              className: "angle-appear",
            },
            APP_DATA.labels.straightLine,
          ),
      ),
    ),
    React.createElement(
      "div",
      {
        className: `right-column${showHeading ? " with-header" : ""}${step === 14 ? " step14-review" : ""}`,
        onClick: step === 14 ? undefined : handleRightColumnClick,
      },
      step === 14
        ? renderStep14Panel()
        : [
            showHeading &&
              React.createElement(
                "div",
                { ref: headingRef, className: "right-heading" },
                APP_DATA.steps[step].heading,
              ),
            React.createElement("div", {
              className: "right-text",
              dangerouslySetInnerHTML: { __html: getRightText() },
            }),
            showHeading && renderPagination(),
          ],
    ),
  );
};
