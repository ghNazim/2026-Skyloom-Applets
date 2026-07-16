/* ── Geometry ──
 * A at the top apex, B bottom-left, C bottom-right (SVG y-down).
 * DEF local coords are 2× ABC, so DEF renders twice as large at the same scale.
 */

const TRI_ABC = {
  A: { x: 3.75, y: 0 },
  B: { x: 0, y: 3.307 },
  C: { x: 6, y: 3.307 },
};

const TRI_DEF = {
  D: { x: 7.5, y: 0 },
  E: { x: 0, y: 6.614 },
  F: { x: 12, y: 6.614 },
};

const ABC_CENTROID = { x: 3.25, y: 2.205 };
const DEF_CENTROID = { x: 6.5, y: 4.409 };

/* ── Steps 4-6 triangles (same shapes, relabeled) ──
 * KLM = small (light blue), PQR = big (yellow). K/L/M ↔ P/Q/R.
 */
const TRI_KLM = {
  K: { x: 3.75, y: 0 },
  L: { x: 0, y: 3.307 },
  M: { x: 6, y: 3.307 },
};
const TRI_PQR = {
  P: { x: 7.5, y: 0 },
  Q: { x: 0, y: 6.614 },
  R: { x: 12, y: 6.614 },
};
const KLM_CENTROID = { x: 3.25, y: 2.205 };
const PQR_CENTROID = { x: 6.5, y: 4.409 };

const ADJ_PQR = { P: ["Q", "R"], Q: ["P", "R"], R: ["P", "Q"] };
const ADJ_KLM = { K: ["L", "M"], L: ["K", "M"], M: ["K", "L"] };

const COLOR_VIOLET = "#B15CF2";
const COLOR_GREEN = "#8BC34A";

/* Angle sector radii (local units). KLM at 2× merge scale matches PQR. */
const ARC_R_PQR = 1.4;
const ARC_R_KLM = 0.7;
/* Angle-label placement: distance from the vertex toward the interior. */
const ANGLE_LABEL_DIST_PQR = 2.15;
const ANGLE_LABEL_DIST_KLM = 1.15;
const ANGLE_LABEL_FONT = 0.6;

/* Side-by-side rest centers for steps 4-6 (kept clear of the viewBox edges). */
const SIDE_KLM_CENTER = { x: 110, y: 243 };
const SIDE_PQR_CENTER = { x: 430, y: 210 };

/* Marked base angles: bottom-left = x° (violet), bottom-right = y° (green). */
const ANGLE_MARKS_PQR = [
  { vtx: "Q", label: "x°", color: COLOR_VIOLET },
  { vtx: "R", label: "y°", color: COLOR_GREEN },
];
const ANGLE_MARKS_KLM = [
  { vtx: "L", label: "x°", color: COLOR_VIOLET },
  { vtx: "M", label: "y°", color: COLOR_GREEN },
];

/* Extra label nudge (local units) during merge so KLM labels clear PQR's. */
const KLM_LABEL_MERGE_SHIFT = {
  K: { x: 0.5, y: 0 },
  L: { x: 0.55, y: 0 },
  M: { x: 0.8, y: 0 },
};

const SIM_CORNER_LABEL_OFFSETS = {
  P: { x: 0, y: -0.85 },
  Q: { x: 0, y: 0.85 },
  R: { x: -0.35, y: 0.85 },
  K: { x: 0, y: -0.85 },
  L: { x: 0, y: 0.9 },
  M: { x: 0, y: 0.9 },
};

const SIM_TAP_HINT_SIZE = 1.7;

const S = 30;
const DIAGRAM_SHIFT_Y = -28;
const NEST_CENTER = { x: 300, y: 200 };
const SIDE_ABC_CENTER = { x: 90, y: 210 };
const SIDE_DEF_CENTER = { x: 430, y: 210 };

const LABEL_FONT_SIZE = 0.75;
const LABEL_DIST_OUTSIDE = 0.55;
const LABEL_DIST_INSIDE = 1.05;
const LABEL_DIST_INSIDE_ARC = 1.4;

const COLOR_YELLOW = "#FFD700";
const COLOR_BLUE = "#4FC3F7";
const COLOR_WHITE = "#FFFFFF";

/* Arc radii in "local S units" (visual size when the group is at scale S). */
const ARC_R_DEF = 1.55;
const ARC_R_ABC_VISUAL = 1.1;

/* Per-vertex configuration for the step-2 angle-equal sequence. */
const PAIR_CONFIG = {
  1: {
    vtxAbc: "A",
    vtxDef: "D",
    fadeSidesAbc: ["BC"],
    fadeSidesDef: ["EF"],
    fadeLabels: ["B", "C", "E", "F"],
    textLocal: { x: 3.3, y: 0.4 },
  },
  2: {
    vtxAbc: "B",
    vtxDef: "E",
    fadeSidesAbc: ["AC"],
    fadeSidesDef: ["DF"],
    fadeLabels: ["A", "C", "D", "F"],
    textLocal: { x: -0.4, y: 8.0 },
  },
  3: {
    vtxAbc: "C",
    vtxDef: "F",
    fadeSidesAbc: ["AB"],
    fadeSidesDef: ["DE"],
    fadeLabels: ["A", "B", "D", "E"],
    textLocal: { x: 12.4, y: 8.0 },
  },
};

/* Left / right parts of each angle-equal label (matches data.js order). */
const ANGLE_LABEL_PARTS = {
  1: {
    left: { text: "∠D", color: COLOR_YELLOW, tri: "def", key: "D" },
    right: { text: "∠A", color: COLOR_BLUE, tri: "abc", key: "A" },
  },
  2: {
    left: { text: "∠B", color: COLOR_BLUE, tri: "abc", key: "B" },
    right: { text: "∠E", color: COLOR_YELLOW, tri: "def", key: "E" },
  },
  3: {
    left: { text: "∠C", color: COLOR_BLUE, tri: "abc", key: "C" },
    right: { text: "∠F", color: COLOR_YELLOW, tri: "def", key: "F" },
  },
};

const ABC_KEYS = { 1: "A", 2: "B", 3: "C" };
const DEF_KEYS = { 1: "D", 2: "E", 3: "F" };

const ADJ_ABC = {
  A: ["B", "C"],
  B: ["A", "C"],
  C: ["A", "B"],
};
const ADJ_DEF = {
  D: ["E", "F"],
  E: ["D", "F"],
  F: ["D", "E"],
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

const lerpPt = (from, to, t) => ({
  x: from.x + (to.x - from.x) * t,
  y: from.y + (to.y - from.y) * t,
});

const getAngleEqualTextWorld = (pairId) => {
  const cfg = PAIR_CONFIG[pairId];
  return worldPoint(cfg.textLocal, NEST_CENTER, S, DEF_CENTROID);
};

/* Exact world position of a source vertex label as it is drawn in step 2.
 * ABC labels sit inside (at the arc distance) on the 2× scaled group;
 * DEF labels sit outside on the base-scale group. Both groups are centered
 * on NEST_CENTER. Uses fixed step-2 values (avoids stale closure state). */
const getSourceLabelWorld = (tri, key) => {
  if (tri === "abc") {
    const local = labelPos(TRI_ABC[key], ABC_CENTROID, LABEL_DIST_INSIDE_ARC, true);
    return worldPoint(local, NEST_CENTER, S * 2, ABC_CENTROID);
  }
  const local = labelPos(TRI_DEF[key], DEF_CENTROID, LABEL_DIST_OUTSIDE, false);
  return worldPoint(local, NEST_CENTER, S, DEF_CENTROID);
};

const getEqualFoProps = (pos) => ({
  x: pos.x - 62,
  y: pos.y - 16,
  width: 124,
  height: 32,
});

const getEqualTextPartTargets = (pos) => ({
  left: { x: pos.x - 26, y: pos.y },
  right: { x: pos.x + 26, y: pos.y },
});

const MainCanvas = (props) => {
  const {
    step,
    onSetNextEnabled,
    onSetAnimating,
    onUpdateTexts,
    onNext,
    onCompleteStep9Transition,
    onRestart,
    onRegisterNudgeTarget,
    onHideNudge,
    step9TransitionVersion,
  } = props;
  const { useState, useEffect, useRef, useCallback } = React;

  const actionBtnRef = useRef(null);
  const animatingRef = useRef(false);
  const step2TweenRef = useRef(null);
  const mainCanvasRef = useRef(null);
  const step9SourceRefs = useRef({});
  const step9TargetRefs = useRef({});

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
  const [abcScaleTweening, setAbcScaleTweening] = useState(false);

  const [dehighlight, setDehighlight] = useState(null);
  const [labelArcShift, setLabelArcShift] = useState({});
  const [hiddenLabels, setHiddenLabels] = useState({});
  const [finaleDone, setFinaleDone] = useState(false);
  const [persistedArcs, setPersistedArcs] = useState([]);
  const [tempArc, setTempArc] = useState(null);
  const [tempArcReveal, setTempArcReveal] = useState(0);
  const [tempEqualText, setTempEqualText] = useState(null);
  const [equalTextBorderBlink, setEqualTextBorderBlink] = useState(false);
  const [angleTextFly, setAngleTextFly] = useState(null);
  const [finaleHighlight, setFinaleHighlight] = useState(false);

  /* ── Steps 4-6 (PQR / KLM) ── */
  const triangleRef = useRef(null);
  const klmTriangleRef = useRef(null);
  const [simKlmPos, setSimKlmPos] = useState(SIDE_KLM_CENTER);
  const [simPqrPos, setSimPqrPos] = useState(SIDE_PQR_CENTER);
  const [simKlmScale, setSimKlmScale] = useState(1);
  const [simMerge, setSimMerge] = useState(0);
  const [step5Btn, setStep5Btn] = useState(null);
  const [pqrClickable, setPqrClickable] = useState(false);
  const [pqrClicked, setPqrClicked] = useState(false);
  const [klmClickable, setKlmClickable] = useState(false);
  const [klmClicked, setKlmClicked] = useState(false);
  const [pqrAngleAnim, setPqrAngleAnim] = useState({ state: 0, textT1: 0, textT2: 0, blink: false });
  const [klmAngleAnim, setKlmAngleAnim] = useState({ state: 0, textT1: 0, textT2: 0, blink: false });
  const [step6Btn, setStep6Btn] = useState(null);
  const [step7Btn, setStep7Btn] = useState(null);
  const [step8State, setStep8State] = useState(0);
  const [step9Transitioning, setStep9Transitioning] = useState(false);
  const [step9TransitionActive, setStep9TransitionActive] = useState(false);
  const [step9ActionCollapsed, setStep9ActionCollapsed] = useState(false);
  const [step9ActionContentHidden, setStep9ActionContentHidden] = useState(false);
  const [step9FinalVisible, setStep9FinalVisible] = useState(false);
  const [step9TextClones, setStep9TextClones] = useState([]);
  const step9TransitionTimeoutsRef = useRef([]);

  const step9LineTexts = APP_DATA.final.text
    .split("<br>")
    .map((line) => line.replace(/<[^>]*>/g, "").trim())
    .filter(Boolean);
  const step9TextKeys = ["box", "line1", "line2", "line3"];

  const playSnd = (snd) => {
    if (typeof playSound === "function") playSound(snd);
  };

  const clearStep9TransitionTimeouts = useCallback(() => {
    step9TransitionTimeoutsRef.current.forEach((id) => clearTimeout(id));
    step9TransitionTimeoutsRef.current = [];
  }, []);

  const setStep9SourceRef = useCallback((key, node) => {
    step9SourceRefs.current[key] = node;
  }, []);

  const setStep9TargetRef = useCallback((key, node) => {
    step9TargetRefs.current[key] = node;
  }, []);

  const queueStep9Timeout = useCallback((fn, delay) => {
    const id = setTimeout(fn, delay);
    step9TransitionTimeoutsRef.current.push(id);
    return id;
  }, []);

  const setAnimatingState = useCallback((animating) => {
    animatingRef.current = animating;
    if (typeof onSetAnimating === "function") onSetAnimating(animating);
  }, [onSetAnimating]);

  const finishStep9Transition = useCallback(() => {
    if (typeof onCompleteStep9Transition === "function") onCompleteStep9Transition();
  }, [onCompleteStep9Transition]);

  const launchStep9TextFlight = useCallback(() => {
    const containerRect = mainCanvasRef.current && mainCanvasRef.current.getBoundingClientRect();
    if (!containerRect) {
      setStep9FinalVisible(true);
      queueStep9Timeout(() => {
        setStep9ActionCollapsed(true);
        queueStep9Timeout(finishStep9Transition, 320);
      }, 160);
      return;
    }

    const cloneItems = step9TextKeys.map((key) => {
      const sourceNode = step9SourceRefs.current[key];
      const targetNode = step9TargetRefs.current[key];
      if (!sourceNode || !targetNode) return null;

      const sourceRect = sourceNode.getBoundingClientRect();
      const targetRect = targetNode.getBoundingClientRect();
      return {
        key,
        text: sourceNode.textContent,
        isBox: key === "box",
        x: sourceRect.left - containerRect.left,
        y: sourceRect.top - containerRect.top,
        width: sourceRect.width,
        height: sourceRect.height,
        dx: targetRect.left - sourceRect.left,
        dy: targetRect.top - sourceRect.top,
      };
    }).filter(Boolean);

    if (cloneItems.length !== step9TextKeys.length) {
      setStep9FinalVisible(true);
      queueStep9Timeout(() => {
        setStep9ActionCollapsed(true);
        queueStep9Timeout(finishStep9Transition, 320);
      }, 160);
      return;
    }

    setStep9ActionContentHidden(true);
    setStep9TextClones(cloneItems.map((item) => ({ ...item, active: false })));

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setStep9TextClones((prev) => prev.map((item) => ({ ...item, active: true })));
      });
    });

    queueStep9Timeout(() => {
      setStep9FinalVisible(true);
      setStep9TextClones([]);
      queueStep9Timeout(() => {
        setStep9ActionCollapsed(true);
        queueStep9Timeout(finishStep9Transition, 320);
      }, 160);
    }, 720);
  }, [finishStep9Transition, queueStep9Timeout, step9TextKeys]);

  const blankNavText = useCallback(() => {
    onUpdateTexts(undefined, " ");
  }, [onUpdateTexts]);

  const getSideOpacity = (tri, sideName) => {
    if (!dehighlight) return 1;
    if (tri === "abc" && dehighlight.fadeSidesAbc.includes(sideName)) return 0.2;
    if (tri === "def" && dehighlight.fadeSidesDef.includes(sideName)) return 0.2;
    return 1;
  };

  const getLabelOpacity = (label) => {
    if (hiddenLabels[label]) return 0;
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
    if (
      actionBtnRef.current &&
      (step === 1 || step === 2 || step === 4 || step === 5) &&
      !actionDisabled
    ) {
      onRegisterNudgeTarget(actionBtnRef.current.getBoundingClientRect());
    } else if (step === 6 && pqrClickable && triangleRef.current) {
      onRegisterNudgeTarget(triangleRef.current.getBoundingClientRect());
    } else if (step === 6 && klmClickable && klmTriangleRef.current) {
      onRegisterNudgeTarget(klmTriangleRef.current.getBoundingClientRect());
    } else if (step === 6 && step6Btn === "conclude" && actionBtnRef.current && !actionDisabled) {
      onRegisterNudgeTarget(actionBtnRef.current.getBoundingClientRect());
    } else if (step === 8 && step8State === 0 && actionBtnRef.current && !actionDisabled) {
      onRegisterNudgeTarget(actionBtnRef.current.getBoundingClientRect());
    } else {
      onRegisterNudgeTarget(null);
    }
  }, [step, actionBtn, actionDisabled, pqrClickable, klmClickable, step6Btn, step8State, onRegisterNudgeTarget]);

  useEffect(() => {
    const tid = setTimeout(updateNudgeTarget, 100);
    window.addEventListener("resize", updateNudgeTarget);
    return () => {
      clearTimeout(tid);
      window.removeEventListener("resize", updateNudgeTarget);
    };
  }, [updateNudgeTarget]);

  /* ── Step entry ── */
  useEffect(() => {
    if (step === 2) {
      setShowRecapText(false);
      setActionBtn(null);
      setLayout("nested");
      setColorsOn(true);
      setLabelInsideProgress(1);
      setLabelDimmed(false);
      setAbcPos(NEST_CENTER);
      setDefPos(NEST_CENTER);
      setAbcScaleMul(1);
      setDehighlight(null);
      setLabelArcShift({});
      setHiddenLabels({});
      setFinaleDone(false);
      setPersistedArcs([]);
      setTempArc(null);
      setTempArcReveal(0);
      setTempEqualText(null);
      setEqualTextBorderBlink(false);
      setAngleTextFly(null);
      setFinaleHighlight(false);
      onUpdateTexts(APP_DATA.steps[2].questionText, APP_DATA.steps[2].navText);
      onSetNextEnabled(false);
      onRegisterNudgeTarget(null);
      requestAnimationFrame(() => runStep2Sequence());
    }
    if (step === 3) {
      setActionBtn(null);
      setShowRecapText(false);
      setDehighlight(null);
      setFinaleHighlight(false);
      onUpdateTexts(APP_DATA.steps[3].questionText, APP_DATA.steps[3].navText);
      onSetNextEnabled(true);
      onRegisterNudgeTarget(null);
    }
    if (step === 4 || step === 5 || step === 6 || step === 7 || step === 8) {
      if (step2TweenRef.current) {
        step2TweenRef.current.kill();
        step2TweenRef.current = null;
      }
      setAnimatingState(false);
      setSimKlmPos(SIDE_KLM_CENTER);
      setSimPqrPos(SIDE_PQR_CENTER);
      setSimKlmScale(1);
      setSimMerge(0);
      setPqrClicked(false);
      setKlmClicked(false);
      setPqrAngleAnim({ state: 0, textT1: 0, textT2: 0, blink: false });
      setKlmAngleAnim({ state: 0, textT1: 0, textT2: 0, blink: false });
      setStep9Transitioning(false);
      setStep9TransitionActive(false);
      setStep9ActionCollapsed(false);
      clearStep9TransitionTimeouts();
    }
    if (step === 4) {
      setPqrClickable(false);
      setKlmClickable(false);
      setStep5Btn(null);
      setStep6Btn(null);
      onSetNextEnabled(false);
      onRegisterNudgeTarget(null);
      setTimeout(updateNudgeTarget, 120);
    }
    if (step === 5) {
      setPqrClickable(false);
      setKlmClickable(false);
      setStep5Btn("fit");
      setStep6Btn(null);
      onUpdateTexts(APP_DATA.steps[5].questionText, APP_DATA.steps[5].navText);
      onSetNextEnabled(false);
      onRegisterNudgeTarget(null);
      setTimeout(updateNudgeTarget, 120);
    }
    if (step === 6) {
      setPqrClickable(true);
      setKlmClickable(false);
      setPqrAngleAnim({ state: 1, textT1: 0, textT2: 0, blink: true });
      setKlmAngleAnim({ state: 0, textT1: 0, textT2: 0, blink: false });
      setStep5Btn(null);
      setStep6Btn(null);
      onUpdateTexts(APP_DATA.steps[6].questionText, APP_DATA.steps[6].navText);
      onSetNextEnabled(false);
      onRegisterNudgeTarget(null);
      setTimeout(updateNudgeTarget, 200);
    }
    if (step === 7) {
      setPqrClickable(false);
      setKlmClickable(false);
      setPqrAngleAnim({ state: 6, textT1: 1, textT2: 1, blink: false });
      setKlmAngleAnim({ state: 6, textT1: 1, textT2: 1, blink: false });
      onUpdateTexts(APP_DATA.steps[7].questionText, APP_DATA.steps[7].navText);
      onSetNextEnabled(true);
      onRegisterNudgeTarget(null);
      setTimeout(updateNudgeTarget, 200);
    }
    if (step === 8) {
      setPqrClickable(false);
      setKlmClickable(false);
      setPqrAngleAnim({ state: 6, textT1: 1, textT2: 1, blink: false });
      setKlmAngleAnim({ state: 6, textT1: 1, textT2: 1, blink: false });
      setStep8State(0);
      onUpdateTexts(APP_DATA.steps[8].questionText, APP_DATA.steps[8].navText);
      onSetNextEnabled(false);
      onRegisterNudgeTarget(null);
      setTimeout(updateNudgeTarget, 200);
    }
  }, [step]);

  useEffect(() => {
    return () => {
      if (step2TweenRef.current) {
        step2TweenRef.current.kill();
        step2TweenRef.current = null;
      }
      clearStep9TransitionTimeouts();
      setAnimatingState(false);
    };
  }, [clearStep9TransitionTimeouts, setAnimatingState]);

  /* ── Step 1: recap ── */
  const runRecapAnimation = () => {
    if (animatingRef.current) return;
    setAnimatingState(true);
    blankNavText();
    setActionDisabled(true);
    onHideNudge();
    playSnd("click");

    const labelAnim = { progress: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        setAnimatingState(false);
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

  /* ── Step 2: auto-play the angle-equal sequence ── */
  const appendPairAnimation = (tl, pairId) => {
    const cfg = PAIR_CONFIG[pairId];
    const abcVtx = TRI_ABC[cfg.vtxAbc];
    const defVtx = TRI_DEF[cfg.vtxDef];
    const arcAbc = getInnerAngleArc(
      abcVtx,
      TRI_ABC[ADJ_ABC[cfg.vtxAbc][0]],
      TRI_ABC[ADJ_ABC[cfg.vtxAbc][1]]
    );
    const arcDef = getInnerAngleArc(
      defVtx,
      TRI_DEF[ADJ_DEF[cfg.vtxDef][0]],
      TRI_DEF[ADJ_DEF[cfg.vtxDef][1]]
    );
    const textWorld = getAngleEqualTextWorld(pairId);
    const parts = ANGLE_LABEL_PARTS[pairId];

    tl.add(() => {
      setDehighlight({
        fadeSidesAbc: cfg.fadeSidesAbc,
        fadeSidesDef: cfg.fadeSidesDef,
        fadeLabels: cfg.fadeLabels,
      });
      setTempArc({ pairId, abc: arcAbc, def: arcDef });
      setTempArcReveal(0);
      playSnd("tick");
    });

    const reveal = { o: 0 };
    tl.to(reveal, {
      o: 0.9,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => setTempArcReveal(reveal.o),
    });

    /* Gently slide the vertex label inward toward the arc (not instant). */
    const abcLetter = ABC_KEYS[pairId];
    const shift = { v: 0 };
    tl.to(
      shift,
      {
        v: 1,
        duration: 0.5,
        ease: "power2.inOut",
        onUpdate: () =>
          setLabelArcShift((prev) => ({ ...prev, [abcLetter]: shift.v })),
      },
      "<"
    );

    tl.to({}, { duration: 0.15 });

    const fly = { t: 0 };
    tl.to(fly, {
      t: 1,
      duration: 0.6,
      ease: "power2.inOut",
      onStart: () => {
        const targets = getEqualTextPartTargets(textWorld);
        setAngleTextFly({
          left: {
            ...parts.left,
            from: getSourceLabelWorld(parts.left.tri, parts.left.key),
            to: targets.left,
          },
          right: {
            ...parts.right,
            from: getSourceLabelWorld(parts.right.tri, parts.right.key),
            to: targets.right,
          },
          t: 0,
        });
        /* The clones "become" the source, so remove the originals. */
        setHiddenLabels((prev) => ({
          ...prev,
          [cfg.vtxAbc]: true,
          [cfg.vtxDef]: true,
        }));
      },
      onUpdate: () => {
        setAngleTextFly((prev) => (prev ? { ...prev, t: fly.t } : prev));
      },
      onComplete: () => {
        setAngleTextFly(null);
        setTempEqualText({ pairId, pos: textWorld });
        setEqualTextBorderBlink(true);
      },
    });

    /* Hold long enough for all 4 border blinks (0.5s each) to play. */
    tl.to({}, { duration: 2.0 });

    tl.add(() => {
      setEqualTextBorderBlink(false);
      setTempEqualText(null);
      setTempArc(null);
      setTempArcReveal(0);
      setPersistedArcs((prev) => [...prev, { pairId, text: textWorld }]);
    });
  };

  const runStep2Sequence = () => {
    if (animatingRef.current) return;
    setAnimatingState(true);
    onHideNudge();
    onRegisterNudgeTarget(null);

    if (step2TweenRef.current) step2TweenRef.current.kill();

    const tl = gsap.timeline({
      onComplete: () => {
        setAnimatingState(false);
        step2TweenRef.current = null;
        setActionBtn("summarize");
        onUpdateTexts(
          APP_DATA.steps[2].questionText,
          APP_DATA.steps[2].navSummarize
        );
        setTimeout(updateNudgeTarget, 120);
      },
    });
    step2TweenRef.current = tl;

    /* 1) Grow the inner (blue) triangle to fit the bigger one, and keep it. */
    const scaleAnim = { m: 1 };
    tl.to(scaleAnim, {
      m: 2,
      duration: 0.9,
      ease: "power2.inOut",
      onStart: () => setAbcScaleTweening(true),
      onUpdate: () => setAbcScaleMul(scaleAnim.m),
      onComplete: () => {
        setAbcScaleMul(2);
        setAbcScaleTweening(false);
      },
    });

    tl.to({}, { duration: 0.4 });

    /* 2) Bring the angle-equal texts in, one pair at a time. */
    [1, 2, 3].forEach((pairId, idx) => {
      appendPairAnimation(tl, pairId);
      if (idx < 2) tl.to({}, { duration: 0.5 });
    });

    /* 3) Pause, then settle everything to full opacity (no glow / no blink).
     *    Sides and angle arcs return to full strength; labels stay hidden. */
    tl.to({}, { duration: 0.5 });
    tl.add(() => {
      setDehighlight(null);
      setFinaleHighlight(false);
      setFinaleDone(true);
      playSnd("correct");
    });
  };

  /* ── Step 4: intro ── */
  const handleContinueClick = () => {
    playSnd("click");
    onHideNudge();
    onRegisterNudgeTarget(null);
    onNext(5);
  };

  /* ── Step 5: fit / merge the triangles ──
   * 1) Slide KLM (no scaling) until point L sits on point Q.
   * 2) Scale KLM up to 2× anchored at L, so it grows to fit PQR exactly.
   */
  const Q_WORLD = worldPoint(TRI_PQR.Q, SIDE_PQR_CENTER, S, PQR_CENTROID);
  const klmAnchorPos = (mul) => ({
    x: Q_WORLD.x - (TRI_KLM.L.x - KLM_CENTROID.x) * S * mul,
    y: Q_WORLD.y - (TRI_KLM.L.y - KLM_CENTROID.y) * S * mul,
  });

  const runMergeAnimation = () => {
    if (animatingRef.current) return;
    setAnimatingState(true);
    setStep5Btn(null);
    setActionDisabled(true);
    blankNavText();
    onHideNudge();
    onRegisterNudgeTarget(null);
    playSnd("click");

    if (step2TweenRef.current) step2TweenRef.current.kill();

    const posAligned = klmAnchorPos(1);

    const tl = gsap.timeline({
      onComplete: () => {
        setAnimatingState(false);
        step2TweenRef.current = null;
        setActionDisabled(false);
        setStep5Btn("explore");
        onUpdateTexts(
          APP_DATA.steps[5].questionTextDone,
          APP_DATA.steps[5].navTextDone
        );
        setTimeout(updateNudgeTarget, 120);
      },
    });
    step2TweenRef.current = tl;

    /* Phase A: translate so L meets Q (scale stays 1). */
    const mv = { p: 0 };
    tl.to(mv, {
      p: 1,
      duration: 1.4,
      ease: "power2.inOut",
      onUpdate: () => {
        setSimKlmPos(lerpPt(SIDE_KLM_CENTER, posAligned, mv.p));
        setSimKlmScale(1);
        setSimMerge(0);
      },
    });

    /* Phase B: scale up anchored at L. */
    const sc = { m: 1 };
    tl.to(sc, {
      m: 2,
      duration: 1.4,
      ease: "power2.inOut",
      onUpdate: () => {
        setSimKlmScale(sc.m);
        setSimKlmPos(klmAnchorPos(sc.m));
        setSimMerge(sc.m - 1);
      },
      onComplete: () => playSnd("tick"),
    });

    tl.to({}, { duration: 1.2 });

    /* Reverse Phase B: shrink back to scale 1 (still anchored at L). */
    const sc2 = { m: 2 };
    tl.to(sc2, {
      m: 1,
      duration: 1.4,
      ease: "power2.inOut",
      onUpdate: () => {
        setSimKlmScale(sc2.m);
        setSimKlmPos(klmAnchorPos(sc2.m));
        setSimMerge(sc2.m - 1);
      },
    });

    /* Reverse Phase A: slide back to the original rest position. */
    const mv2 = { p: 1 };
    tl.to(mv2, {
      p: 0,
      duration: 1.4,
      ease: "power2.inOut",
      onUpdate: () => {
        setSimKlmPos(lerpPt(SIDE_KLM_CENTER, posAligned, mv2.p));
        setSimKlmScale(1);
        setSimMerge(0);
      },
      onComplete: () => {
        setSimKlmPos(SIDE_KLM_CENTER);
        setSimKlmScale(1);
        setSimMerge(0);
      },
    });
  };

  const handleFitClick = () => {
    if (actionDisabled) return;
    onHideNudge();
    onRegisterNudgeTarget(null);
    runMergeAnimation();
  };

  const handleExploreWhyClick = () => {
    if (actionDisabled) return;
    playSnd("click");
    onHideNudge();
    onRegisterNudgeTarget(null);
    onNext(6);
  };

  /* ── Step 6: reveal by tapping △PQR and △KLM ── */
  const runAngleAnimation = (isKlm) => {
    if (animatingRef.current) return;
    setAnimatingState(true);
    onHideNudge();
    onRegisterNudgeTarget(null);

    const tl = gsap.timeline({
      onComplete: () => {
        setAnimatingState(false);
        if (!isKlm) {
          setKlmClickable(true);
          setKlmAngleAnim({ state: 1, textT1: 0, textT2: 0, blink: true });
          onUpdateTexts(APP_DATA.steps[6].questionTextK, APP_DATA.steps[6].navTextK);
          setTimeout(updateNudgeTarget, 200);
        } else {
          setStep6Btn("conclude");
          onUpdateTexts(APP_DATA.steps[6].questionTextDone, APP_DATA.steps[6].navTextDone);
          setTimeout(updateNudgeTarget, 200);
        }
      },
    });

    const setAnimState = (s) => isKlm ? setKlmAngleAnim(s) : setPqrAngleAnim(s);
    let s = { state: 1, textT1: 0, textT2: 0, blink: false };
    tl.add(() => {
      playSnd("tick");
      setAnimState(s);
    });
    tl.to({}, { duration: 0.2 });
    tl.add(() => setAnimState({ ...s, state: 2 }));
    tl.to({}, { duration: 0.6 });

    // Fly x
    const fly1 = { t: 0 };
    tl.add(() => setAnimState({ ...s, state: 3 }));
    tl.to(fly1, {
      t: 1, duration: 0.6, ease: "power2.inOut",
      onUpdate: () => setAnimState({ ...s, state: 3, textT1: fly1.t }),
      onComplete: () => { s.textT1 = 1; setAnimState({ ...s, state: 4 }); }
    });

    tl.to({}, { duration: 0.6 });

    // Fly y
    const fly2 = { t: 0 };
    tl.add(() => setAnimState({ ...s, state: 5 }));
    tl.to(fly2, {
      t: 1, duration: 0.6, ease: "power2.inOut",
      onUpdate: () => setAnimState({ ...s, state: 5, textT2: fly2.t }),
      onComplete: () => setAnimState({ ...s, state: 6, textT1: 1, textT2: 1 })
    });
  };

  const handlePqrClick = () => {
    if (!pqrClickable || pqrClicked) return;
    setPqrClicked(true);
    setPqrClickable(false);
    playSnd("click");
    runAngleAnimation(false);
  };

  const handleKlmClick = () => {
    if (!klmClickable || klmClicked) return;
    setKlmClicked(true);
    setKlmClickable(false);
    playSnd("click");
    runAngleAnimation(true);
  };

  const handleConcludeClick = () => {
    if (actionDisabled) return;
    playSnd("click");
    onHideNudge();
    onRegisterNudgeTarget(null);
    onNext(7);
  };

  const handleNameClick = () => {
    if (actionDisabled) return;
    playSnd("click");
    setStep8State(1);
    onUpdateTexts(APP_DATA.steps[8].questionTextDone, APP_DATA.steps[8].navTextDone);
    onSetNextEnabled(true);
    setTimeout(updateNudgeTarget, 200);
  };

  const startStep9Transition = useCallback(() => {
    if (step !== 8 || step8State !== 1 || step9Transitioning || animatingRef.current) return;
    setAnimatingState(true);
    onHideNudge();
    onRegisterNudgeTarget(null);
    clearStep9TransitionTimeouts();
    setStep9Transitioning(true);
    setStep9TransitionActive(false);
    setStep9ActionCollapsed(false);
    setStep9ActionContentHidden(false);
    setStep9FinalVisible(false);
    setStep9TextClones([]);

    queueStep9Timeout(() => {
      setStep9TransitionActive(true);
    }, 20);

    queueStep9Timeout(() => {
      launchStep9TextFlight();
    }, 640);
  }, [
    clearStep9TransitionTimeouts,
    onHideNudge,
    onRegisterNudgeTarget,
    launchStep9TextFlight,
    queueStep9Timeout,
    setAnimatingState,
    step,
    step8State,
    step9Transitioning,
  ]);

  useEffect(() => {
    if (step === 8 && step8State === 1 && step9TransitionVersion > 0) {
      startStep9Transition();
    }
  }, [startStep9Transition, step, step8State, step9TransitionVersion]);

  /* ── Rendering ── */
  useEffect(() => {
    if (step !== 9) return;
    setStep9Transitioning(false);
    setStep9TransitionActive(false);
    setStep9ActionContentHidden(false);
    setStep9TextClones([]);
    setAnimatingState(false);
  }, [setAnimatingState, step]);

  useEffect(() => () => {
    clearStep9TransitionTimeouts();
  }, [clearStep9TransitionTimeouts]);

  useEffect(() => {
    if (step === 8 || step === 9) return;
    clearStep9TransitionTimeouts();
    setStep9Transitioning(false);
    setStep9TransitionActive(false);
    setStep9ActionCollapsed(false);
    setStep9ActionContentHidden(false);
    setStep9FinalVisible(false);
    setStep9TextClones([]);
  }, [clearStep9TransitionTimeouts, step]);

  const renderSide = (tri, sideName, p1, p2) =>
    React.createElement("line", {
      key: `${tri}-${sideName}`,
      x1: p1.x,
      y1: p1.y,
      x2: p2.x,
      y2: p2.y,
      stroke: getStrokeColor(tri),
      strokeWidth: 3,
      vectorEffect: "non-scaling-stroke",
      strokeLinecap: "round",
      opacity: getSideOpacity(tri, sideName),
      style: { transition: "opacity 0.3s ease" },
    });

  const getAbcLabelInsideDist = (letter) => {
    const t = labelArcShift[letter] || 0;
    return LABEL_DIST_INSIDE + (LABEL_DIST_INSIDE_ARC - LABEL_DIST_INSIDE) * t;
  };

  const renderLabel = (tri, letter, vertex, forceOutside) => {
    const centroid = tri === "abc" ? ABC_CENTROID : DEF_CENTROID;
    let pos;
    if (tri === "abc" && !forceOutside) {
      pos = labelPosLerp(
        vertex,
        centroid,
        labelInsideProgress,
        getAbcLabelInsideDist(letter)
      );
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
        fontSize: tri === "abc" ? LABEL_FONT_SIZE / abcScaleMul : LABEL_FONT_SIZE,
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

  const effectiveAbcScale = S * abcScaleMul;
  const effectiveDefScale = S;

  const abcTransform = (scale) =>
    `translate(${abcPos.x}, ${abcPos.y}) scale(${scale}) translate(${-ABC_CENTROID.x}, ${-ABC_CENTROID.y})`;

  const defTransform = (scale) =>
    `translate(${defPos.x}, ${defPos.y}) scale(${scale}) translate(${-DEF_CENTROID.x}, ${-DEF_CENTROID.y})`;

  const renderArc = (tri, vertexKey, arcData, pairId, opacity) => {
    const vertex = tri === "abc" ? TRI_ABC[vertexKey] : TRI_DEF[vertexKey];
    const adj =
      tri === "abc"
        ? [TRI_ABC[ADJ_ABC[vertexKey][0]], TRI_ABC[ADJ_ABC[vertexKey][1]]]
        : [TRI_DEF[ADJ_DEF[vertexKey][0]], TRI_DEF[ADJ_DEF[vertexKey][1]]];
    const arc = arcData || getInnerAngleArc(vertex, adj[0], adj[1]);
    const r =
      tri === "abc" ? ARC_R_ABC_VISUAL / abcScaleMul : ARC_R_DEF;
    const color = tri === "abc" ? COLOR_BLUE : COLOR_YELLOW;
    return React.createElement("path", {
      key: `arc-${tri}-${vertexKey}-${pairId}`,
      d: describeArc(vertex.x, vertex.y, r, arc.start, arc.end),
      fill: color,
      opacity: opacity !== undefined ? opacity : 0.9,
    });
  };

  const renderFlyingAngleLabels = () => {
    if (!angleTextFly) return null;
    const { left, right, t } = angleTextFly;
    const mk = (part, k) => {
      const p = lerpPt(part.from, part.to, t);
      return React.createElement(
        "text",
        {
          key: k,
          x: p.x,
          y: p.y,
          fill: part.color,
          fontSize: 22,
          fontWeight: 700,
          textAnchor: "middle",
          dominantBaseline: "middle",
          className: "angle-fly-text",
        },
        part.text
      );
    };
    return React.createElement(
      "g",
      { className: "angle-fly-layer" },
      mk(left, "fly-l"),
      mk(right, "fly-r")
    );
  };

  const renderEqualTextFO = (pairId, pos, key, animateIn, opacity, borderBlink) => {
    const fo = getEqualFoProps(pos);
    return React.createElement(
      "foreignObject",
      {
        key,
        x: fo.x,
        y: fo.y,
        width: fo.width,
        height: fo.height,
        className:
          "ang-equal-fo" + (animateIn ? " ang-equal-fo--appear" : ""),
        opacity: opacity !== undefined ? opacity : 1,
        style:
          opacity !== undefined ? { transition: "opacity 0.3s ease" } : undefined,
      },
      React.createElement("div", {
        className:
          "ang-equal-text" +
          (borderBlink ? " ang-equal-text--border-blink" : ""),
        dangerouslySetInnerHTML: {
          __html: APP_DATA.steps[2].angleEqual[pairId],
        },
      })
    );
  };

  /* ── Steps 4-6 diagram (PQR big / KLM small) ── */
  const simKlmTransform = `translate(${simKlmPos.x}, ${simKlmPos.y}) scale(${S * simKlmScale
    }) translate(${-KLM_CENTROID.x}, ${-KLM_CENTROID.y})`;
  const simPqrTransform = `translate(${simPqrPos.x}, ${simPqrPos.y}) scale(${S}) translate(${-PQR_CENTROID.x}, ${-PQR_CENTROID.y})`;

  const renderSimSide = (key, p1, p2, color) =>
    React.createElement("line", {
      key,
      x1: p1.x,
      y1: p1.y,
      x2: p2.x,
      y2: p2.y,
      stroke: color,
      strokeWidth: 3,
      vectorEffect: "non-scaling-stroke",
      strokeLinecap: "round",
    });

  const renderSimArc = (key, vertex, adj0, adj1, color, r) => {
    const arc = getInnerAngleArc(vertex, adj0, adj1);
    return React.createElement("path", {
      key,
      d: describeArc(vertex.x, vertex.y, r, arc.start, arc.end),
      fill: color,
      opacity: 0.85,
    });
  };

  const renderStep6BlinkArc = (key, vertex, adj0, adj1, color, r) => {
    const arc = getInnerAngleArc(vertex, adj0, adj1);
    return React.createElement("path", {
      key,
      d: describeArc(vertex.x, vertex.y, r, arc.start, arc.end),
      fill: color,
      opacity: 0.85,
      className: "step6-angle-blink",
    });
  };

  const renderSimAngleLabel = (key, vertex, centroid, dist, text, color, font, opacity) => {
    const pos = labelPos(vertex, centroid, dist, true);
    return React.createElement(
      "text",
      {
        key,
        x: pos.x,
        y: pos.y,
        fill: color,
        fontSize: font,
        fontStyle: "italic",
        fontFamily: "'Times New Roman', Times, serif",
        fontWeight: "bold",
        textAnchor: "middle",
        dominantBaseline: "middle",
        opacity: opacity !== undefined ? opacity : 1,
      },
      text
    );
  };

  const renderSimCornerLabel = (key, letter, vertex, centroid, color, font, shift) => {
    const offset = SIM_CORNER_LABEL_OFFSETS[letter];
    const base = offset
      ? { x: vertex.x + offset.x, y: vertex.y + offset.y }
      : labelPos(vertex, centroid, LABEL_DIST_OUTSIDE, false);
    const pos = shift
      ? { x: base.x + shift.x * simMerge, y: base.y + shift.y * simMerge }
      : base;
    return React.createElement(
      "text",
      {
        key,
        x: pos.x,
        y: pos.y,
        fill: color,
        fontSize: font,
        fontStyle: "italic",
        fontFamily: "'Times New Roman', Times, serif",
        fontWeight: "bold",
        textAnchor: "middle",
        dominantBaseline: "middle",
      },
      letter
    );
  };

  const renderSimCornerLabelWorld = (
    key,
    letter,
    vertex,
    center,
    scale,
    localCentroid,
    color,
    font,
    shift
  ) => {
    const vertexWorld = worldPoint(vertex, center, scale, localCentroid);
    const offset = SIM_CORNER_LABEL_OFFSETS[letter] || { x: 0, y: 0 };
    const shiftX = shift ? shift.x * simMerge : 0;
    const shiftY = shift ? shift.y * simMerge : 0;
    const pos = {
      x: vertexWorld.x + (offset.x + shiftX) * S,
      y: vertexWorld.y + (offset.y + shiftY) * S,
    };
    return React.createElement(
      "text",
      {
        key,
        x: pos.x,
        y: pos.y,
        fill: color,
        fontSize: font,
        fontStyle: "italic",
        fontFamily: "'Times New Roman', Times, serif",
        fontWeight: "bold",
        textAnchor: "middle",
        dominantBaseline: "middle",
      },
      letter
    );
  };

  const renderAngleAnimGroup = (tri, animState) => {
    if (animState.state === 0) return null;
    const vertex = tri === "pqr" ? TRI_PQR.P : TRI_KLM.K;
    const centroid = tri === "pqr" ? PQR_CENTROID : KLM_CENTROID;
    const adj0 = tri === "pqr" ? TRI_PQR.Q : TRI_KLM.L;
    const adj1 = tri === "pqr" ? TRI_PQR.R : TRI_KLM.M;
    const font = tri === "pqr" ? ANGLE_LABEL_FONT * 1.2 : (ANGLE_LABEL_FONT * 1.2) / simKlmScale;
    const r = tri === "pqr" ? ARC_R_PQR : ARC_R_KLM;
    const dist = tri === "pqr" ? ANGLE_LABEL_DIST_PQR : ANGLE_LABEL_DIST_KLM;

    const sector = animState.blink
      ? renderStep6BlinkArc(`${tri}-anim-arc`, vertex, adj0, adj1, "#8B4513", r)
      : renderSimArc(`${tri}-anim-arc`, vertex, adj0, adj1, "#8B4513", r);

    if (animState.state < 2) return sector;

    const pos = tri === "pqr"
      ? { x: vertex.x + 3.15, y: vertex.y + 1.0 }
      : { x: vertex.x + 2.55, y: vertex.y + 0.5 };
    const leadSpacing = tri === "pqr" ? 1.15 : 1.15 / simKlmScale;
    const xOffset = tri === "pqr" ? 0.2 : 0.2 / simKlmScale;
    const yOffset = tri === "pqr" ? 1.15 : 1.15 / simKlmScale;

    const renderPart = (key, text, offsetX, color, opacity) => React.createElement(
      "text",
      {
        key,
        x: pos.x + offsetX,
        y: pos.y,
        fill: color,
        fontSize: font,
        fontStyle: "italic",
        fontFamily: "'Times New Roman', Times, serif",
        fontWeight: "bold",
        textAnchor: "middle",
        dominantBaseline: "middle",
        opacity: opacity
      },
      text
    );

    const parts = [sector];
    parts.push(renderPart(`${tri}-anim-180`, "180°", -leadSpacing, COLOR_WHITE, 1));

    if (animState.state >= 3) {
      if (animState.state === 3) {
        const source = tri === "pqr" ? TRI_PQR.Q : TRI_KLM.L;
        const sourcePos = labelPos(source, centroid, dist, true);
        const targetPos = { x: pos.x + xOffset, y: pos.y };
        const currentPos = lerpPt(sourcePos, targetPos, animState.textT1);
        parts.push(React.createElement(
          "text",
          {
            key: `${tri}-fly-x`,
            x: currentPos.x,
            y: currentPos.y,
            fill: COLOR_VIOLET,
            fontSize: font,
            fontStyle: "italic",
            fontFamily: "'Times New Roman', Times, serif",
            fontWeight: "bold",
            textAnchor: "middle",
            dominantBaseline: "middle",
          },
          "x°"
        ));
      } else {
        parts.push(renderPart(`${tri}-anim-x`, "-x°", xOffset, COLOR_VIOLET, 1));
      }
    }

    if (animState.state >= 5) {
      if (animState.state === 5) {
        const source = tri === "pqr" ? TRI_PQR.R : TRI_KLM.M;
        const sourcePos = labelPos(source, centroid, dist, true);
        const targetPos = { x: pos.x + yOffset, y: pos.y };
        const currentPos = lerpPt(sourcePos, targetPos, animState.textT2);
        parts.push(React.createElement(
          "text",
          {
            key: `${tri}-fly-y`,
            x: currentPos.x,
            y: currentPos.y,
            fill: COLOR_GREEN,
            fontSize: font,
            fontStyle: "italic",
            fontFamily: "'Times New Roman', Times, serif",
            fontWeight: "bold",
            textAnchor: "middle",
            dominantBaseline: "middle",
          },
          "y°"
        ));
      } else {
        parts.push(renderPart(`${tri}-anim-y`, "-y°", yOffset, COLOR_GREEN, 1));
      }
    }
    return parts;
  };

  const renderSimTapHint = (key, center) =>
    React.createElement("image", {
      key,
      href: "assets/tap.gif",
      x: center.x - SIM_TAP_HINT_SIZE / 2,
      y: center.y - SIM_TAP_HINT_SIZE / 2,
      width: SIM_TAP_HINT_SIZE,
      height: SIM_TAP_HINT_SIZE,
      preserveAspectRatio: "xMidYMid meet",
      className: "sim-triangle-tap-hint",
      pointerEvents: "none",
    });

  const renderSimDiagram = () => {
    const klmCornerFont = LABEL_FONT_SIZE * S;
    const klmAngleFont = (ANGLE_LABEL_FONT * 1.2) / simKlmScale;
    const pqrAngleFont = ANGLE_LABEL_FONT * 1.2;

    const pqrGroup = React.createElement(
      "g",
      { transform: simPqrTransform, style: { transition: "none" } },
      pqrClickable &&
      React.createElement("polygon", {
        key: "pqr-hit",
        ref: triangleRef,
        points: `${TRI_PQR.P.x},${TRI_PQR.P.y} ${TRI_PQR.Q.x},${TRI_PQR.Q.y} ${TRI_PQR.R.x},${TRI_PQR.R.y}`,
        fill: "#FFFFFF",
        fillOpacity: 0.01,
        className: "pqr-clickable",
        style: { cursor: "pointer" },
        onClick: handlePqrClick,
      }),
      renderSimSide("pqr-PQ", TRI_PQR.P, TRI_PQR.Q, COLOR_YELLOW),
      renderSimSide("pqr-QR", TRI_PQR.Q, TRI_PQR.R, COLOR_YELLOW),
      renderSimSide("pqr-PR", TRI_PQR.P, TRI_PQR.R, COLOR_YELLOW),
      renderAngleAnimGroup("pqr", pqrAngleAnim),
      pqrClickable && renderSimTapHint("pqr-tap-hint", PQR_CENTROID),
      ANGLE_MARKS_PQR.map((m) =>
        renderSimArc(
          `pqr-arc-${m.vtx}`,
          TRI_PQR[m.vtx],
          TRI_PQR[ADJ_PQR[m.vtx][0]],
          TRI_PQR[ADJ_PQR[m.vtx][1]],
          m.color,
          ARC_R_PQR
        )
      ),
      ANGLE_MARKS_PQR.map((m) =>
        renderSimAngleLabel(
          `pqr-ang-${m.vtx}`,
          TRI_PQR[m.vtx],
          PQR_CENTROID,
          ANGLE_LABEL_DIST_PQR,
          m.label,
          m.color,
          pqrAngleFont
        )
      ),
      ["P", "Q", "R"].map((letter) =>
        renderSimCornerLabel(
          `pqr-lbl-${letter}`,
          letter,
          TRI_PQR[letter],
          PQR_CENTROID,
          COLOR_YELLOW,
          LABEL_FONT_SIZE,
          null
        )
      )
    );

    const klmGroup = React.createElement(
      "g",
      { transform: simKlmTransform, style: { transition: "none" } },
      klmClickable &&
      React.createElement("polygon", {
        key: "klm-hit",
        ref: klmTriangleRef,
        points: `${TRI_KLM.K.x},${TRI_KLM.K.y} ${TRI_KLM.L.x},${TRI_KLM.L.y} ${TRI_KLM.M.x},${TRI_KLM.M.y}`,
        fill: "#FFFFFF",
        fillOpacity: 0.01,
        className: "klm-clickable",
        style: { cursor: "pointer" },
        onClick: handleKlmClick,
      }),
      renderSimSide("klm-KL", TRI_KLM.K, TRI_KLM.L, COLOR_BLUE),
      renderSimSide("klm-LM", TRI_KLM.L, TRI_KLM.M, COLOR_BLUE),
      renderSimSide("klm-KM", TRI_KLM.K, TRI_KLM.M, COLOR_BLUE),
      renderAngleAnimGroup("klm", klmAngleAnim),
      klmClickable && renderSimTapHint("klm-tap-hint", KLM_CENTROID),
      ANGLE_MARKS_KLM.map((m) =>
        renderSimArc(
          `klm-arc-${m.vtx}`,
          TRI_KLM[m.vtx],
          TRI_KLM[ADJ_KLM[m.vtx][0]],
          TRI_KLM[ADJ_KLM[m.vtx][1]],
          m.color,
          ARC_R_KLM
        )
      ),
      ANGLE_MARKS_KLM.map((m) =>
        renderSimAngleLabel(
          `klm-ang-${m.vtx}`,
          TRI_KLM[m.vtx],
          KLM_CENTROID,
          ANGLE_LABEL_DIST_KLM,
          m.label,
          m.color,
          klmAngleFont,
          1 - simMerge
        )
      )
    );

    const klmLabels = ["K", "L", "M"].map((letter) =>
      renderSimCornerLabelWorld(
        `klm-lbl-${letter}`,
        letter,
        TRI_KLM[letter],
        simKlmPos,
        S * simKlmScale,
        KLM_CENTROID,
        COLOR_BLUE,
        klmCornerFont,
        KLM_LABEL_MERGE_SHIFT[letter]
      )
    );

    return React.createElement(
      "svg",
      {
        className: "triangles-svg",
        viewBox: "0 0 620 360",
        preserveAspectRatio: "xMidYMid meet",
      },
      React.createElement(
        "g",
        { transform: `translate(0, ${DIAGRAM_SHIFT_Y})` },
        pqrGroup,
        klmGroup,
        klmLabels
      )
    );
  };

  const renderStep9TextGroup = (mode) => {
    const isSource = mode === "source";
    const setRef = isSource ? setStep9SourceRef : setStep9TargetRef;
    const wrapperClassName = isSource ? "step9-source-summary" : "step9-final-summary";
    const lineClassName = isSource ? "step9-source-line" : "step9-final-line";

    return React.createElement(
      "div",
      { className: wrapperClassName },
      React.createElement(
        "div",
        {
          ref: (node) => setRef("box", node),
          className: "step9-box-text",
        },
        APP_DATA.final.boxText
      ),
      React.createElement(
        "div",
        { className: "final-step-text" },
        step9LineTexts.map((line, index) =>
          React.createElement(
            "div",
            {
              key: `${mode}-${index}`,
              ref: (node) => setRef(`line${index + 1}`, node),
              className: lineClassName,
            },
            line
          )
        )
      )
    );
  };

  const renderStep8ActionNameText = () =>
    React.createElement(
      "div",
      { className: "step8-sub-text" },
      React.createElement(
        "span",
        {
          ref: (node) => setStep9SourceRef("line1", node),
          className: "step8-source-fragment",
        },
        `${step9LineTexts[0]} `
      ),
      React.createElement(
        "span",
        {
          ref: (node) => setStep9SourceRef("line2", node),
          className: "step8-source-fragment",
        },
        `${step9LineTexts[1]} `
      ),
      React.createElement(
        "span",
        {
          ref: (node) => setStep9SourceRef("line3", node),
          className: "step8-source-fragment",
        },
        step9LineTexts[2]
      )
    );

  const showAngleArcs = step === 2 || step === 3;
  const showActionRow = step === 1 || step === 2 || step === 3 || step === 5 || step === 6 || step === 7 || step === 8;

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
    if (step === 5 && step5Btn === "fit") {
      return React.createElement(
        "button",
        {
          ref: actionBtnRef,
          className: "action-btn action-btn--wide",
          onClick: handleFitClick,
          disabled: actionDisabled,
        },
        APP_DATA.steps[5].actionFit
      );
    }
    if (step === 5 && step5Btn === "explore") {
      return React.createElement(
        "button",
        {
          ref: actionBtnRef,
          className: "action-btn",
          onClick: handleExploreWhyClick,
          disabled: actionDisabled,
        },
        APP_DATA.steps[5].actionExplore
      );
    }
    if (step === 6 && step6Btn === "conclude") {
      return React.createElement(
        "div",
        { className: "action-btn-hint-wrap" },
        React.createElement(
          "button",
          {
            ref: actionBtnRef,
            className: "action-btn",
            onClick: handleConcludeClick,
            disabled: actionDisabled,
          },
          APP_DATA.steps[6].actionConclude
        ),
        React.createElement("img", {
          src: "assets/tap.gif",
          alt: "",
          className: "action-btn-tap-hint",
        })
      );
    }
    if (step === 7) {
      return React.createElement("div", {
        className: "action-summary-text",
        dangerouslySetInnerHTML: {
          __html: APP_DATA.steps[7].actionRule,
        },
      });
    }
    if (step === 8) {
      if (step8State === 0) {
        return React.createElement(
          "div",
          { className: "step8-action-wrapper" },
          React.createElement(
            "button",
            {
              ref: actionBtnRef,
              className: "action-btn",
              onClick: handleNameClick,
              disabled: actionDisabled,
            },
            APP_DATA.steps[8].actionNameBtn
          ),
          React.createElement("div", { className: "step8-sub-text" }, APP_DATA.steps[8].actionNameText)
        );
      } else {
        return React.createElement(
          "div",
          {
            className: "step8-action-wrapper step8-action-wrapper--done",
          },
          React.createElement(
            "div",
            {
              ref: (node) => setStep9SourceRef("box", node),
              className: "step8-box-text",
            },
            APP_DATA.steps[8].actionNameBox
          ),
          renderStep8ActionNameText()
        );
      }
    }
    return null;
  };

  const abcGroupTransformStyle = abcScaleTweening ? { transition: "none" } : undefined;

  if (step === 4) {
    return React.createElement(
      "div",
      { className: "sim-intro-panel" },
      React.createElement("p", { className: "heading" }, APP_DATA.steps[4].heading),
      React.createElement(
        "div",
        { className: "sim-intro-content" },
        React.createElement(
          "div",
          { className: "sim-intro-svg" },
          renderSimDiagram()
        ),
        React.createElement(
          "div",
          { className: "sim-intro-text", dangerouslySetInnerHTML: { __html: APP_DATA.steps[4].introText } }
        )
      ),
      React.createElement(
        "button",
        {
          ref: actionBtnRef,
          className: "action-btn sim-continue-btn",
          onClick: handleContinueClick,
        },
        APP_DATA.steps[4].continueBtn
      )
    );
  }

  if (step === 5 || step === 6 || step === 7 || step === 8 || step === 9) {
    const isStep8 = step === 8;
    const isStep9 = step === 9;
    const showFinalTransitionLayout = isStep9 || step9Transitioning;
    const step9ContentVisible = isStep9 || step9FinalVisible;
    return React.createElement(
      "div",
      {
        ref: mainCanvasRef,
        className: `main-canvas-container ${isStep8 ? 'layout-reverse' : ''}`,
      },
      step9TextClones.length > 0 &&
      React.createElement(
        "div",
        { className: "step9-clone-layer" },
        step9TextClones.map((item) =>
          React.createElement(
            "div",
            {
              key: item.key,
              className:
                "step9-text-clone" +
                (item.isBox ? " step9-text-clone--box" : " step9-text-clone--line") +
                (item.active ? " step9-text-clone--active" : ""),
              style: {
                left: `${item.x}px`,
                top: `${item.y}px`,
                width: `${item.width}px`,
                minHeight: `${item.height}px`,
                transform: item.active
                  ? `translate(${item.dx}px, ${item.dy}px)`
                  : "translate(0, 0)",
              },
            },
            item.text
          )
        )
      ),
      showFinalTransitionLayout
        ? React.createElement(
            "div",
            {
              className:
                "svg-row svg-row--final" +
                (step9Transitioning ? " svg-row--final-transition" : ""),
            },
            React.createElement(
              "div",
              {
                className:
                  "final-step-layout" +
                  (step9Transitioning ? " final-step-layout--transitioning" : "") +
                  (step9TransitionActive ? " final-step-layout--active" : ""),
              },
              React.createElement(
                "div",
                {
                  className:
                    "final-step-diagram" +
                    (step9Transitioning ? " final-step-diagram--transitioning" : "") +
                    (step9TransitionActive ? " final-step-diagram--active" : ""),
                },
                renderSimDiagram()
              ),
              React.createElement(
                "div",
                {
                  className:
                    "final-step-content flex-col-center" +
                    (step9Transitioning ? " final-step-content--transitioning" : "") +
                    (step9TransitionActive ? " final-step-content--active" : "") +
                    (!step9ContentVisible ? " final-step-content--hidden" : ""),
                },
                React.createElement(
                  "div",
                  {
                    className:
                      "final-step-content-inner" +
                      (step9ContentVisible ? " final-step-content-inner--visible" : ""),
                  },
                  renderStep9TextGroup("target")
                )
              )
            )
          )
        : React.createElement(
            "div",
            { className: "svg-row" },
            renderSimDiagram()
          ),
      showActionRow &&
      React.createElement(
        "div",
        {
          className:
            "action-row" +
            (actionRowContent() ? " has-content" : "") +
            (step9ActionCollapsed ? " action-row--collapsed" : "") +
            (step9ActionContentHidden ? " action-row--content-hidden" : ""),
        },
        actionRowContent()
      )
    );
  }

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
          viewBox: "0 0 620 360",
          preserveAspectRatio: "xMidYMid meet",
        },
        React.createElement(
          "g",
          { transform: `translate(0, ${DIAGRAM_SHIFT_Y})` },
          React.createElement(
            "g",
            {
              className:
                "diagram-group" + (finaleHighlight ? " finale-glow" : ""),
            },
            // DEF (back)
            React.createElement(
              "g",
              {
                className: "triangle-group triangle-layer-back",
                transform: defTransform(effectiveDefScale),
              },
              renderSide("def", "DE", TRI_DEF.D, TRI_DEF.E),
              renderSide("def", "EF", TRI_DEF.E, TRI_DEF.F),
              renderSide("def", "DF", TRI_DEF.D, TRI_DEF.F),
              showAngleArcs &&
              tempArc &&
              renderArc(
                "def",
                DEF_KEYS[tempArc.pairId],
                tempArc.def,
                tempArc.pairId,
                tempArcReveal
              ),
              showAngleArcs &&
              persistedArcs.map((a) =>
                renderArc(
                  "def",
                  DEF_KEYS[a.pairId],
                  null,
                  a.pairId,
                  finaleDone ? 1 : 0.9
                )
              ),
              renderLabel("def", "D", TRI_DEF.D, true),
              renderLabel("def", "E", TRI_DEF.E, true),
              renderLabel("def", "F", TRI_DEF.F, true)
            ),
            // ABC sides (front)
            React.createElement(
              "g",
              {
                className: "triangle-group triangle-layer-front",
                transform: abcTransform(effectiveAbcScale),
                style: abcGroupTransformStyle,
              },
              renderSide("abc", "AB", TRI_ABC.A, TRI_ABC.B),
              renderSide("abc", "BC", TRI_ABC.B, TRI_ABC.C),
              renderSide("abc", "AC", TRI_ABC.A, TRI_ABC.C),
              showAngleArcs &&
              tempArc &&
              renderArc(
                "abc",
                ABC_KEYS[tempArc.pairId],
                tempArc.abc,
                tempArc.pairId,
                tempArcReveal
              ),
              showAngleArcs &&
              persistedArcs.map((a) =>
                renderArc(
                  "abc",
                  ABC_KEYS[a.pairId],
                  null,
                  a.pairId,
                  finaleDone ? 1 : 0.9
                )
              )
            ),
            // ABC labels (front)
            React.createElement(
              "g",
              {
                className: "triangle-group triangle-labels triangle-layer-front",
                transform: abcTransform(effectiveAbcScale),
                style: abcGroupTransformStyle,
              },
              renderLabel("abc", "A", TRI_ABC.A, false),
              renderLabel("abc", "B", TRI_ABC.B, false),
              renderLabel("abc", "C", TRI_ABC.C, false)
            )
          ),
          renderFlyingAngleLabels(),
          showAngleArcs &&
          tempEqualText &&
          renderEqualTextFO(
            tempEqualText.pairId,
            tempEqualText.pos,
            "temp-eq-text",
            true,
            undefined,
            equalTextBorderBlink
          ),
          showAngleArcs &&
          persistedArcs.map((a) =>
            renderEqualTextFO(
              a.pairId,
              a.text,
              `eq-${a.pairId}`,
              false,
              1,
              finaleHighlight
            )
          )
        )
      )
    ),
    showActionRow &&
    React.createElement(
      "div",
      {
        className: "action-row" + (actionRowContent() ? " has-content" : ""),
      },
      actionRowContent()
    )
  );
};
