/* ── Triangle Similarity – Main Canvas ── */

const VIEWBOX = "0 0 550 430";
const SVG_W = 550;
const SVG_H = 430;

const POINTS = {
  A: { x: 294.849, y: 63.1238 },
  B: { x: 81.1228, y: 213.527 },
  C: { x: 218.064, y: 377.717 },
  D: { x: 248.189, y: 254.301 },
};

const LABEL_OFFSETS = {
  A: { x: -8, y: -16 },
  B: { x: -10, y: 14 },
  C: { x: -11, y: 20 },
  D: { x: 12, y: 15 },
};

const COLOR_YELLOW = "#c8d44a";
const COLOR_YELLOW_FILL = "#b8a830";
const COLOR_BLUE = "#5ec4e0";
const COLOR_BLUE_FILL = "#2a8fc4";
const COLOR_WHITE = "#ffffff";
const STROKE_WIDTH = 2;
const LABEL_FONT_SIZE = 28;
const FLOAT_OFFSET_X = 225;
const SECTOR_RADIUS = 38;
const SQUARE_SIZE = 16;
const BLINK_COUNT = 4;
const BLINK_INTERVAL = 400;

function playSnd(name) {
  if (typeof playSound === "function") playSound(name);
}

function vecNorm(dx, dy) {
  const len = Math.hypot(dx, dy) || 1;
  return { x: dx / len, y: dy / len };
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

function getRightAngleSquarePath(vertex, p1, p2, size) {
  const v1 = vecNorm(p1.x - vertex.x, p1.y - vertex.y);
  const v2 = vecNorm(p2.x - vertex.x, p2.y - vertex.y);
  const pA = { x: vertex.x + v1.x * size, y: vertex.y + v1.y * size };
  const pB = {
    x: vertex.x + v1.x * size + v2.x * size,
    y: vertex.y + v1.y * size + v2.y * size,
  };
  const pC = { x: vertex.x + v2.x * size, y: vertex.y + v2.y * size };
  return `M ${vertex.x} ${vertex.y} L ${pA.x} ${pA.y} L ${pB.x} ${pB.y} L ${pC.x} ${pC.y} Z`;
}

function getLabelPos(key, offsetX, offsetY) {
  const pt = POINTS[key];
  const off = LABEL_OFFSETS[key];
  return {
    x: pt.x + off.x + (offsetX || 0),
    y: pt.y + off.y + (offsetY || 0),
  };
}

function shiftPoint(pt, dx, dy) {
  return { x: pt.x + dx, y: pt.y + dy };
}

function rotatePointAround(pt, center, angle) {
  const dx = pt.x - center.x;
  const dy = pt.y - center.y;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos,
  };
}

function alignTriangleByRightAngle(points, pivotKey, rayKey, targetPivot, targetRay) {
  const pivot = points[pivotKey];
  const ray = points[rayKey];
  const sourceAngle = Math.atan2(ray.y - pivot.y, ray.x - pivot.x);
  const targetAngle = Math.atan2(
    targetRay.y - targetPivot.y,
    targetRay.x - targetPivot.x,
  );
  const angle = targetAngle - sourceAngle;
  const rotated = {};
  Object.keys(points).forEach((key) => {
    rotated[key] = rotatePointAround(points[key], pivot, angle);
  });
  const dx = targetPivot.x - rotated[pivotKey].x;
  const dy = targetPivot.y - rotated[pivotKey].y;
  Object.keys(rotated).forEach((key) => {
    rotated[key] = shiftPoint(rotated[key], dx, dy);
  });
  return rotated;
}

function scaleTriangleFromPivot(points, pivotKey, factor) {
  const pivot = points[pivotKey];
  const scaled = {};
  Object.keys(points).forEach((key) => {
    const pt = points[key];
    scaled[key] = {
      x: pivot.x + (pt.x - pivot.x) * factor,
      y: pivot.y + (pt.y - pivot.y) * factor,
    };
  });
  return scaled;
}

function getScreenCenter(el) {
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function getElementCenterById(id) {
  if (!id) return null;
  const el = document.getElementById(id);
  return getScreenCenter(el);
}

function getSvgPointCenter(svgEl, pt) {
  if (!svgEl || !pt) return null;
  const ctm = svgEl.getScreenCTM();
  if (!ctm) return null;
  const ptSvg = svgEl.createSVGPoint();
  ptSvg.x = pt.x;
  ptSvg.y = pt.y;
  const screen = ptSvg.matrixTransform(ctm);
  return { x: screen.x, y: screen.y };
}

async function blinkFill(setOpacity, times, low, high) {
  for (let i = 0; i < times; i++) {
    setOpacity(low);
    await new Promise((r) => setTimeout(r, BLINK_INTERVAL / 2));
    setOpacity(high);
    await new Promise((r) => setTimeout(r, BLINK_INTERVAL / 2));
  }
  setOpacity(high);
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
    onSetNavLocked,
    stepTransition,
  } = props;
  const { useState, useEffect, useCallback, useRef } = React;

  const svgRef = useRef(null);
  const mathRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const onNextRef = useRef(onNext);
  const floatOffsetXRef = useRef(0);
  const adbSeparatedRef = useRef(false);
  const bcdSeparatedRef = useRef(false);

  const [abcFillOpacity, setAbcFillOpacity] = useState(0);
  const [abdFillOpacity, setAbdFillOpacity] = useState(0);
  const [bcdFillOpacity, setBcdFillOpacity] = useState(0);
  const [showAbcFill, setShowAbcFill] = useState(false);
  const [showAbdFill, setShowAbdFill] = useState(false);
  const [showBcdFill, setShowBcdFill] = useState(false);
  const [showAngleA, setShowAngleA] = useState(false);
  const [showAngleC, setShowAngleC] = useState(false);
  const [mathVisible, setMathVisible] = useState(false);
  const [floatOffsetX, setFloatOffsetX] = useState(0);
  const [adbSeparated, setAdbSeparated] = useState(false);
  const [bcdSeparated, setBcdSeparated] = useState(false);
  const [showRightSquares, setShowRightSquares] = useState(false);
  const [rightSquaresFilled, setRightSquaresFilled] = useState(false);
  const [squareDBlink, setSquareDBlink] = useState(1);
  const [squareDStable, setSquareDStable] = useState(false);
  const [line1Parts, setLine1Parts] = useState({});
  const [line2Parts, setLine2Parts] = useState({});
  const [line1RuleVisible, setLine1RuleVisible] = useState(false);
  const [line2Visible, setLine2Visible] = useState(false);
  const [showConcludeBtn, setShowConcludeBtn] = useState(false);
  const [concluded, setConcluded] = useState(false);
  const [flyingClones, setFlyingClones] = useState([]);
  const [step3Phase, setStep3Phase] = useState("idle");
  const [step6Phase, setStep6Phase] = useState("idle");
  const [proofMode, setProofMode] = useState("adb");
  const [con1Opacity, setCon1Opacity] = useState(0);
  const [con1Parts, setCon1Parts] = useState({});
  const [con1RulesVisible, setCon1RulesVisible] = useState(true);
  const [hiddenSources, setHiddenSources] = useState({});
  const [mathLegacyHidden, setMathLegacyHidden] = useState(false);
  const [con1AmpVisible, setCon1AmpVisible] = useState(false);

  const [con2Opacity, setCon2Opacity] = useState(0);
  const [con2Parts, setCon2Parts] = useState({});
  const [con2RulesVisible, setCon2RulesVisible] = useState(true);

  const [step7ConcludeVisible, setStep7ConcludeVisible] = useState(false);
  const [step7Phase, setStep7Phase] = useState("idle");

  const [con3Opacity, setCon3Opacity] = useState(0);
  const [con3Parts, setCon3Parts] = useState({});
  const [con3TildeVisible, setCon3TildeVisible] = useState(false);

  const [step8Phase, setStep8Phase] = useState("idle");
  const [step8Verts, setStep8Verts] = useState(null);
  const [step8BlueVerts, setStep8BlueVerts] = useState(null);

  const step4IntroStartedRef = useRef(false);
  const step7IntroStartedRef = useRef(false);
  const step8IntroStartedRef = useRef(false);

  const FLY_DURATION = 1.1;
  const SEPARATE_DURATION = 0.75;
  const MERGE_DURATION = 0.7;

  const setAnimatingState = useCallback(
    (value) => {
      isAnimatingRef.current = value;
      if (onSetNavLocked) onSetNavLocked(value);
    },
    [onSetNavLocked],
  );

  useEffect(() => {
    onNextRef.current = onNext;
  }, [onNext]);

  useEffect(() => {
    floatOffsetXRef.current = floatOffsetX;
  }, [floatOffsetX]);

  useEffect(() => {
    adbSeparatedRef.current = adbSeparated;
  }, [adbSeparated]);

  useEffect(() => {
    bcdSeparatedRef.current = bcdSeparated;
  }, [bcdSeparated]);

  const flyLetter = useCallback(
    (id, text, from, to, color, fontSizeEnd, onStart, fontSizeStart) => {
      const endSize = fontSizeEnd || fontSizeStart || 22;
      const startSize = fontSizeStart ?? endSize;
      return new Promise((resolve) => {
        if (!from || !to) {
          if (onStart) onStart();
          resolve();
          return;
        }
        if (onStart) onStart();
        setFlyingClones((prev) => [
          ...prev,
          {
            id,
            text,
            from,
            to,
            color,
            t: 0,
            fontSizeStart: startSize,
            fontSizeEnd: endSize,
          },
        ]);
        const anim = { t: 0 };
        gsap.to(anim, {
          t: 1,
          duration: FLY_DURATION,
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
    },
    [FLY_DURATION],
  );

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

  const mergeFloatingAdb = useCallback(async () => {
    if (!adbSeparatedRef.current && !floatOffsetXRef.current) return;
    const floatAnim = { x: floatOffsetXRef.current };
    await new Promise((resolve) => {
      gsap.to(floatAnim, {
        x: 0,
        duration: MERGE_DURATION,
        ease: "power2.inOut",
        onUpdate: () => setFloatOffsetX(floatAnim.x),
        onComplete: () => {
          setAdbSeparated(false);
          resolve();
        },
      });
    });
  }, [MERGE_DURATION]);

  const mergeFloatingBcd = useCallback(async () => {
    if (!bcdSeparatedRef.current && !floatOffsetXRef.current) return;
    const floatAnim = { x: floatOffsetXRef.current };
    await new Promise((resolve) => {
      gsap.to(floatAnim, {
        x: 0,
        duration: MERGE_DURATION,
        ease: "power2.inOut",
        onUpdate: () => setFloatOffsetX(floatAnim.x),
        onComplete: () => {
          setBcdSeparated(false);
          resolve();
        },
      });
    });
  }, [MERGE_DURATION]);

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

  const getMathLetterScreenPos = useCallback((dataKey) => {
    const el = document.querySelector(`[data-math-key="${dataKey}"]`);
    return getScreenCenter(el);
  }, []);

  const getDiagramLetterScreenPos = useCallback(
    (letter, useFloat) => {
      const svg = svgRef.current;
      if (!svg) return null;
      const dx = useFloat ? floatOffsetX : 0;
      const labelPt = getLabelPos(letter, dx, 0);
      return getSvgPointCenter(svg, labelPt);
    },
    [floatOffsetX],
  );

  const initLine1Parts = useCallback(() => {
    return {
      angle1: { key: "angle1", text: "\u2220", opacity: 0 },
      B1: { key: "B1", text: "B", opacity: 0 },
      A1: { key: "A1", text: "A", opacity: 0 },
      C: { key: "C", text: "C", opacity: 0 },
      equals: { key: "equals", text: "=", opacity: 0 },
      angle2: { key: "angle2", text: "\u2220", opacity: 0 },
      B2: { key: "B2", text: "B", opacity: 0 },
      A2: { key: "A2", text: "A", opacity: 0 },
      D: { key: "D", text: "D", opacity: 0 },
    };
  }, []);

  const initLine2Parts = useCallback(() => {
    return {
      angle1: { key: "angle1", text: "\u2220", opacity: 0 },
      A1: { key: "A1", text: "A", opacity: 0 },
      B1: { key: "B1", text: "B", opacity: 0 },
      C: { key: "C", text: "C", opacity: 0 },
      equals: { key: "equals", text: "=", opacity: 0 },
      angle2: { key: "angle2", text: "\u2220", opacity: 0 },
      A2: { key: "A2", text: "A", opacity: 0 },
      D: { key: "D", text: "D", opacity: 0 },
      B2: { key: "B2", text: "B", opacity: 0 },
    };
  }, []);

  const initLine1PartsBdc = useCallback(() => {
    return {
      angle1: { key: "angle1", text: "\u2220", opacity: 0 },
      B1: { key: "B1", text: "B", opacity: 0 },
      C1: { key: "C1", text: "C", opacity: 0 },
      A: { key: "A", text: "A", opacity: 0 },
      equals: { key: "equals", text: "=", opacity: 0 },
      angle2: { key: "angle2", text: "\u2220", opacity: 0 },
      B2: { key: "B2", text: "B", opacity: 0 },
      C2: { key: "C2", text: "C", opacity: 0 },
      D: { key: "D", text: "D", opacity: 0 },
    };
  }, []);

  const initLine2PartsBdc = useCallback(() => {
    return {
      angle1: { key: "angle1", text: "\u2220", opacity: 0 },
      A1: { key: "A1", text: "A", opacity: 0 },
      B1: { key: "B1", text: "B", opacity: 0 },
      C1: { key: "C1", text: "C", opacity: 0 },
      equals: { key: "equals", text: "=", opacity: 0 },
      angle2: { key: "angle2", text: "\u2220", opacity: 0 },
      B2: { key: "B2", text: "B", opacity: 0 },
      D: { key: "D", text: "D", opacity: 0 },
      C2: { key: "C2", text: "C", opacity: 0 },
    };
  }, []);

  const getConScreenPos = useCallback((dataKey) => {
    const el = document.querySelector(`[data-con-key="${dataKey}"]`);
    return getScreenCenter(el);
  }, []);

  const hideSource = useCallback((key) => {
    setHiddenSources((prev) => ({ ...prev, [key]: true }));
  }, []);

  const showConPart = useCallback((key) => {
    setCon1Parts((prev) => ({ ...prev, [key]: 1 }));
  }, []);

  const getCon2ScreenPos = useCallback((dataKey) => {
    const el = document.querySelector(`[data-con2-key="${dataKey}"]`);
    return getScreenCenter(el);
  }, []);

  const showCon2Part = useCallback((key) => {
    setCon2Parts((prev) => ({ ...prev, [key]: 1 }));
  }, []);

  const initCon2Parts = useCallback(() => {
    const keys = [
      "con2-sim",
      "con2-r1-angle1",
      "con2-r1-B",
      "con2-r1-C1",
      "con2-r1-A",
      "con2-r1-eq",
      "con2-r1-angle2",
      "con2-r1-B2",
      "con2-r1-C2",
      "con2-r1-D",
      "con2-r2-angle1",
      "con2-r2-A1",
      "con2-r2-B1",
      "con2-r2-C1",
      "con2-r2-eq",
      "con2-r2-angle2",
      "con2-r2-B2",
      "con2-r2-D",
      "con2-r2-C2",
      "con2-amp",
    ];
    const parts = {};
    keys.forEach((k) => {
      parts[k] = 0;
    });
    return parts;
  }, []);

  const flyToCon2 = useCallback(
    async (items) => {
      await Promise.all(
        items.map((item, i) => {
          const fromEl = item.srcId
            ? document.getElementById(item.srcId)
            : document.querySelector(`[data-math-key="${item.src}"]`);
          return flyLetter(
            `con2-fly-${item.dst}-${i}-${Date.now()}`,
            item.text,
            getScreenCenter(fromEl),
            getCon2ScreenPos(item.dst),
            item.color,
            item.fontSize,
            () => hideSource(item.src || item.srcId),
            item.fontSizeStart,
          ).then(() => showCon2Part(item.dst));
        }),
      );
    },
    [flyLetter, getCon2ScreenPos, hideSource, showCon2Part],
  );

  const getCon3ScreenPos = useCallback((dataKey) => {
    const el = document.querySelector(`[data-con3-key="${dataKey}"]`);
    return getScreenCenter(el);
  }, []);

  const initCon3Parts = useCallback(() => {
    const keys = ["con3-adb", "con3-tilde", "con3-rest"];
    const parts = {};
    keys.forEach((k) => {
      parts[k] = 0;
    });
    return parts;
  }, []);

  const initCon1Parts = useCallback(() => {
    const keys = [
      "con-sim",
      "con-l1-angle1",
      "con-l1-B1",
      "con-l1-A1",
      "con-l1-C",
      "con-l1-eq1",
      "con-l1-angle2",
      "con-l1-B2",
      "con-l1-A2",
      "con-l1-D",
      "con-l2-angle1",
      "con-l2-A1",
      "con-l2-B1",
      "con-l2-C",
      "con-l2-eq",
      "con-l2-angle2",
      "con-l2-A2",
      "con-l2-D",
      "con-l2-B2",
    ];
    const parts = {};
    keys.forEach((k) => {
      parts[k] = 0;
    });
    return parts;
  }, []);

  const initVisibleCon1Parts = useCallback(() => {
    const parts = initCon1Parts();
    Object.keys(parts).forEach((key) => {
      parts[key] = 1;
    });
    return parts;
  }, [initCon1Parts]);

  const flyToCon1 = useCallback(
    async (items) => {
      await Promise.all(
        items.map((item, i) => {
          const fromEl = item.srcId
            ? document.getElementById(item.srcId)
            : document.querySelector(`[data-math-key="${item.src}"]`);
          return flyLetter(
            `con1-fly-${item.dst}-${i}-${Date.now()}`,
            item.text,
            getScreenCenter(fromEl),
            getConScreenPos(item.dst),
            item.color,
            item.fontSize,
            () => hideSource(item.src || item.srcId),
            item.fontSizeStart,
          ).then(() => showConPart(item.dst));
        }),
      );
    },
    [flyLetter, getConScreenPos, hideSource, showConPart],
  );

  const runStep4Animation = useCallback(async () => {
    if (isAnimatingRef.current) return;
    setAnimatingState(true);

    setLine1RuleVisible(false);
    hideSource("conclusion-line2-source");
    await new Promise((r) => setTimeout(r, 250));
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r)),
    );

    const vw = window.innerWidth / 100;
    const simFontSize = vw * 2.5;
    const mathLineFontSize = vw * 2.5;
    const rulesFontSize = vw * 1.5;

    setCon1Opacity(0.5);

    await flyToCon1([
      {
        srcId: "conclusion-line1-source",
        dst: "con-sim",
        text: APP_DATA.math.conclusionLine1,
        color: COLOR_WHITE,
        fontSize: simFontSize,
        fontSizeStart: simFontSize,
      },
      {
        src: "l1-angle1",
        dst: "con-l1-angle1",
        text: "\u2220",
        color: COLOR_YELLOW,
        fontSize: rulesFontSize,
        fontSizeStart: mathLineFontSize,
      },
      {
        src: "l1-B1",
        dst: "con-l1-B1",
        text: "B",
        color: COLOR_YELLOW,
        fontSize: rulesFontSize,
        fontSizeStart: mathLineFontSize,
      },
      {
        src: "l1-A1",
        dst: "con-l1-A1",
        text: "A",
        color: COLOR_YELLOW,
        fontSize: rulesFontSize,
        fontSizeStart: mathLineFontSize,
      },
      {
        src: "l1-C",
        dst: "con-l1-C",
        text: "C",
        color: COLOR_YELLOW,
        fontSize: rulesFontSize,
        fontSizeStart: mathLineFontSize,
      },
      {
        src: "l1-equals",
        dst: "con-l1-eq1",
        text: "=",
        color: COLOR_WHITE,
        fontSize: rulesFontSize,
        fontSizeStart: mathLineFontSize,
      },
      {
        src: "l1-angle2",
        dst: "con-l1-angle2",
        text: "\u2220",
        color: COLOR_BLUE,
        fontSize: rulesFontSize,
        fontSizeStart: mathLineFontSize,
      },
      {
        src: "l1-B2",
        dst: "con-l1-B2",
        text: "B",
        color: COLOR_BLUE,
        fontSize: rulesFontSize,
        fontSizeStart: mathLineFontSize,
      },
      {
        src: "l1-A2",
        dst: "con-l1-A2",
        text: "A",
        color: COLOR_BLUE,
        fontSize: rulesFontSize,
        fontSizeStart: mathLineFontSize,
      },
      {
        src: "l1-D",
        dst: "con-l1-D",
        text: "D",
        color: COLOR_BLUE,
        fontSize: rulesFontSize,
        fontSizeStart: mathLineFontSize,
      },
      {
        src: "l2-angle1",
        dst: "con-l2-angle1",
        text: "\u2220",
        color: COLOR_YELLOW,
        fontSize: rulesFontSize,
        fontSizeStart: mathLineFontSize,
      },
      {
        src: "l2-A1",
        dst: "con-l2-A1",
        text: "A",
        color: COLOR_YELLOW,
        fontSize: rulesFontSize,
        fontSizeStart: mathLineFontSize,
      },
      {
        src: "l2-B1",
        dst: "con-l2-B1",
        text: "B",
        color: COLOR_YELLOW,
        fontSize: rulesFontSize,
        fontSizeStart: mathLineFontSize,
      },
      {
        src: "l2-C",
        dst: "con-l2-C",
        text: "C",
        color: COLOR_YELLOW,
        fontSize: rulesFontSize,
        fontSizeStart: mathLineFontSize,
      },
      {
        src: "l2-equals",
        dst: "con-l2-eq",
        text: "=",
        color: COLOR_WHITE,
        fontSize: rulesFontSize,
        fontSizeStart: mathLineFontSize,
      },
      {
        src: "l2-angle2",
        dst: "con-l2-angle2",
        text: "\u2220",
        color: COLOR_BLUE,
        fontSize: rulesFontSize,
        fontSizeStart: mathLineFontSize,
      },
      {
        src: "l2-A2",
        dst: "con-l2-A2",
        text: "A",
        color: COLOR_BLUE,
        fontSize: rulesFontSize,
        fontSizeStart: mathLineFontSize,
      },
      {
        src: "l2-D",
        dst: "con-l2-D",
        text: "D",
        color: COLOR_BLUE,
        fontSize: rulesFontSize,
        fontSizeStart: mathLineFontSize,
      },
      {
        src: "l2-B2",
        dst: "con-l2-B2",
        text: "B",
        color: COLOR_BLUE,
        fontSize: rulesFontSize,
        fontSizeStart: mathLineFontSize,
      },
    ]);

    setCon1AmpVisible(true);
    setMathLegacyHidden(true);
    onSetNextEnabled(false);
    onUpdateTexts(undefined, "");
    setAnimatingState(false);

    setTimeout(() => {
      if (onNextRef.current) onNextRef.current(5, true);
    }, 500);
  }, [
    flyToCon1,
    hideSource,
    onSetNextEnabled,
    onUpdateTexts,
    setAnimatingState,
  ]);

  // ── Step 4 init ──
  useEffect(() => {
    if (step !== 4) {
      step4IntroStartedRef.current = false;
      return;
    }
    if (step4IntroStartedRef.current) return;
    step4IntroStartedRef.current = true;

    let cancelled = false;
    let tid = null;

    const startStep4 = async () => {
      if (stepTransition === "3to4") {
        setAnimatingState(true);
        await mergeFloatingAdb();
        if (cancelled) {
          setAnimatingState(false);
          return;
        }
        setAnimatingState(false);
      }

      setMathVisible(true);
      setCon1Opacity(0);
      setCon1Parts(initCon1Parts());
      setHiddenSources({});
      setMathLegacyHidden(false);
      setCon1AmpVisible(false);
      setProofMode("adb");
      setShowAbdFill(false);
      setShowBcdFill(false);
      setShowAngleA(false);
      setShowAngleC(false);
      setShowRightSquares(false);
      setRightSquaresFilled(false);
      setAdbSeparated(false);
      setBcdSeparated(false);
      setFloatOffsetX(0);
      setShowAbcFill(true);
      setAbcFillOpacity(0.5);
      setAbdFillOpacity(0);
      setBcdFillOpacity(0);
      setLine1RuleVisible(true);
      setLine2Visible(true);
      setConcluded(true);
      setLine1Parts((prev) => {
        const next = { ...initLine1Parts(), ...prev };
        Object.keys(next).forEach((k) => {
          next[k] = { ...next[k], opacity: 1 };
        });
        return next;
      });
      setLine2Parts((prev) => {
        const next = { ...initLine2Parts(), ...prev };
        Object.keys(next).forEach((k) => {
          next[k] = { ...next[k], opacity: 1 };
        });
        return next;
      });
      onSetNextEnabled(false);
      onUpdateTexts(undefined, "");

      tid = setTimeout(() => runStep4Animation(), 500);
    };

    startStep4();
    return () => {
      cancelled = true;
      if (tid) clearTimeout(tid);
    };
  }, [
    step,
    stepTransition,
    onSetNextEnabled,
    onUpdateTexts,
    initCon1Parts,
    initLine1Parts,
    initLine2Parts,
    mergeFloatingAdb,
    runStep4Animation,
    setAnimatingState,
  ]);

  // ── Step 5: blink ABC then BCD fills ──
  useEffect(() => {
    if (step !== 5) return;
    let cancelled = false;
    if (onSetNavLocked) onSetNavLocked(true);
    onSetNextEnabled(false);
    onUpdateTexts(APP_DATA.steps[5].questionText, "");
    setProofMode("bdc");
    setCon1Opacity(0.5);
    setCon1Parts(initVisibleCon1Parts());
    setCon1RulesVisible(true);
    setCon1AmpVisible(true);
    setShowAbcFill(true);
    setShowAbdFill(false);
    setShowBcdFill(false);
    setShowAngleA(false);
    setShowAngleC(false);
    setAdbSeparated(false);
    setBcdSeparated(false);
    setFloatOffsetX(0);
    setShowRightSquares(false);
    setRightSquaresFilled(false);
    setAbcFillOpacity(0);
    setAbdFillOpacity(0);
    setBcdFillOpacity(0);

    const run = async () => {
      await blinkFill(
        (v) => {
          if (!cancelled) setAbcFillOpacity(v);
        },
        BLINK_COUNT,
        0.1,
        0.5,
      );
      if (cancelled) return;
      await new Promise((r) => setTimeout(r, 300));
      if (cancelled) return;
      setShowBcdFill(true);
      await blinkFill(
        (v) => {
          if (!cancelled) setBcdFillOpacity(v);
        },
        BLINK_COUNT,
        0.1,
        0.5,
      );
      if (!cancelled) {
        onSetNextEnabled(true);
        onUpdateTexts(undefined, APP_DATA.steps[5].navAfterAnim);
        if (onSetNavLocked) onSetNavLocked(false);
        setTimeout(() => {
          const el = document.getElementById("next-button");
          if (el && onRegisterNudgeTarget)
            onRegisterNudgeTarget(el, { immediate: true });
        }, 400);
      }
    };
    run();
    return () => {
      cancelled = true;
      if (onSetNavLocked) onSetNavLocked(false);
    };
  }, [
    step,
    onSetNextEnabled,
    onUpdateTexts,
    onRegisterNudgeTarget,
    onSetNavLocked,
    initVisibleCon1Parts,
  ]);

  // ── Step 6 init ──
  useEffect(() => {
    if (step !== 6) return;
    setCon1Opacity(0.5);
    setCon1Parts(initVisibleCon1Parts());
    setCon1RulesVisible(true);
    setCon1AmpVisible(true);
    setShowAbcFill(true);
    setShowAbdFill(false);
    setShowBcdFill(true);
    setAbcFillOpacity(0.5);
    setAbdFillOpacity(0);
    setBcdFillOpacity(0.5);
    setShowAngleA(false);
    setShowAngleC(true);
    setMathVisible(false);
    setMathLegacyHidden(false);
    setHiddenSources({});
    setFloatOffsetX(0);
    setBcdSeparated(false);
    setShowRightSquares(false);
    setRightSquaresFilled(false);
    setSquareDStable(false);
    setSquareDBlink(1);
    setProofMode("bdc");
    setLine1Parts(initLine1PartsBdc());
    setLine2Parts(initLine2PartsBdc());
    setLine1RuleVisible(false);
    setLine2Visible(false);
    setShowConcludeBtn(false);
    setConcluded(false);
    setStep6Phase("angle-click");
    onSetNextEnabled(false);
    onUpdateTexts(APP_DATA.steps[6].questionText, APP_DATA.steps[6].navText);

    const tid = setTimeout(() => {
      const el = document.getElementById("angle-c-sector");
      if (el && onRegisterNudgeTarget) onRegisterNudgeTarget(el);
    }, 500);
    return () => clearTimeout(tid);
  }, [
    step,
    onSetNextEnabled,
    onUpdateTexts,
    onRegisterNudgeTarget,
    initLine1PartsBdc,
    initLine2PartsBdc,
    initVisibleCon1Parts,
  ]);

  // ── Step 7: summary (like step 4) ──
  useEffect(() => {
    if (step !== 7) {
      step7IntroStartedRef.current = false;
      return;
    }
    if (step7IntroStartedRef.current) return;
    step7IntroStartedRef.current = true;

    let cancelled = false;
    let tid = null;

    const startStep7 = async () => {
      onUpdateTexts(APP_DATA.steps[7].questionText, "");
      onSetNextEnabled(false);
      if (onSetNextLabel) onSetNextLabel("\u00BB");

      if (stepTransition === "6to7") {
        setAnimatingState(true);
        await mergeFloatingBcd();
        if (cancelled) {
          setAnimatingState(false);
          return;
        }
        setAnimatingState(false);
      }

      setBcdSeparated(false);
      setAdbSeparated(false);
      setFloatOffsetX(0);
      setCon1Opacity(0.5);
      setMathVisible(true);
      setMathLegacyHidden(false);

      // prepare con2
      setCon2Opacity(0);
      setCon2Parts(initCon2Parts());
      setCon2RulesVisible(true);
      setStep7ConcludeVisible(false);
      setStep7Phase("anim");

      // prepare con3
      setCon3Opacity(0);
      setCon3Parts(initCon3Parts());
      setCon3TildeVisible(false);

      // keep con1 rules visible until conclude
      setCon1RulesVisible(true);

      // run animation after a tick for layout
      tid = setTimeout(async () => {
        if (isAnimatingRef.current) return;
        setAnimatingState(true);

        // match step 4 cleanup before fly
        setLine1RuleVisible(false);
        hideSource("conclusion-line2-source");

        await new Promise((r) =>
          requestAnimationFrame(() => requestAnimationFrame(r)),
        );

        const vw = window.innerWidth / 100;
        const simFontSize = vw * 2.2;
        const mathLineFontSize = vw * 2.2;
        const rulesFontSize = vw * 1.35;

        setCon2Opacity(1);

        await flyToCon2([
        {
          srcId: "conclusion-line1-source",
          dst: "con2-sim",
          text: APP_DATA.math.con2Sim,
          color: COLOR_WHITE,
          fontSize: simFontSize,
          fontSizeStart: simFontSize,
        },

        // rule 1: ∠BCA = ∠BCD
        {
          src: "l1-angle1",
          dst: "con2-r1-angle1",
          text: "\u2220",
          color: COLOR_YELLOW,
          fontSize: rulesFontSize,
          fontSizeStart: mathLineFontSize,
        },
        {
          src: "l1-B1",
          dst: "con2-r1-B",
          text: "B",
          color: COLOR_YELLOW,
          fontSize: rulesFontSize,
          fontSizeStart: mathLineFontSize,
        },
        {
          src: "l1-C1",
          dst: "con2-r1-C1",
          text: "C",
          color: COLOR_YELLOW,
          fontSize: rulesFontSize,
          fontSizeStart: mathLineFontSize,
        },
        {
          src: "l1-A",
          dst: "con2-r1-A",
          text: "A",
          color: COLOR_YELLOW,
          fontSize: rulesFontSize,
          fontSizeStart: mathLineFontSize,
        },
        {
          src: "l1-equals",
          dst: "con2-r1-eq",
          text: "=",
          color: COLOR_WHITE,
          fontSize: rulesFontSize,
          fontSizeStart: mathLineFontSize,
        },
        {
          src: "l1-angle2",
          dst: "con2-r1-angle2",
          text: "\u2220",
          color: COLOR_BLUE,
          fontSize: rulesFontSize,
          fontSizeStart: mathLineFontSize,
        },
        {
          src: "l1-B2",
          dst: "con2-r1-B2",
          text: "B",
          color: COLOR_BLUE,
          fontSize: rulesFontSize,
          fontSizeStart: mathLineFontSize,
        },
        {
          src: "l1-C2",
          dst: "con2-r1-C2",
          text: "C",
          color: COLOR_BLUE,
          fontSize: rulesFontSize,
          fontSizeStart: mathLineFontSize,
        },
        {
          src: "l1-D",
          dst: "con2-r1-D",
          text: "D",
          color: COLOR_BLUE,
          fontSize: rulesFontSize,
          fontSizeStart: mathLineFontSize,
        },

        // rule 2: ∠ABC = ∠BDC
        {
          src: "l2-angle1",
          dst: "con2-r2-angle1",
          text: "\u2220",
          color: COLOR_YELLOW,
          fontSize: rulesFontSize,
          fontSizeStart: mathLineFontSize,
        },
        {
          src: "l2-A1",
          dst: "con2-r2-A1",
          text: "A",
          color: COLOR_YELLOW,
          fontSize: rulesFontSize,
          fontSizeStart: mathLineFontSize,
        },
        {
          src: "l2-B1",
          dst: "con2-r2-B1",
          text: "B",
          color: COLOR_YELLOW,
          fontSize: rulesFontSize,
          fontSizeStart: mathLineFontSize,
        },
        {
          src: "l2-C1",
          dst: "con2-r2-C1",
          text: "C",
          color: COLOR_YELLOW,
          fontSize: rulesFontSize,
          fontSizeStart: mathLineFontSize,
        },
        {
          src: "l2-equals",
          dst: "con2-r2-eq",
          text: "=",
          color: COLOR_WHITE,
          fontSize: rulesFontSize,
          fontSizeStart: mathLineFontSize,
        },
        {
          src: "l2-angle2",
          dst: "con2-r2-angle2",
          text: "\u2220",
          color: COLOR_BLUE,
          fontSize: rulesFontSize,
          fontSizeStart: mathLineFontSize,
        },
        {
          src: "l2-B2",
          dst: "con2-r2-B2",
          text: "B",
          color: COLOR_BLUE,
          fontSize: rulesFontSize,
          fontSizeStart: mathLineFontSize,
        },
        {
          src: "l2-D",
          dst: "con2-r2-D",
          text: "D",
          color: COLOR_BLUE,
          fontSize: rulesFontSize,
          fontSizeStart: mathLineFontSize,
        },
        {
          src: "l2-C2",
          dst: "con2-r2-C2",
          text: "C",
          color: COLOR_BLUE,
          fontSize: rulesFontSize,
          fontSizeStart: mathLineFontSize,
        },
        ]);

        setMathLegacyHidden(true);
        setStep7ConcludeVisible(true);
        setStep7Phase("conclude");
        setCon1Opacity(1);
        onUpdateTexts(undefined, APP_DATA.steps[7].navAfterAnim);

        setAnimatingState(false);
      }, 500);
    };

    startStep7();
    return () => {
      cancelled = true;
      if (tid) clearTimeout(tid);
      if (onSetNavLocked) onSetNavLocked(false);
    };
  }, [
    step,
    stepTransition,
    onSetNextEnabled,
    onUpdateTexts,
    onSetNextLabel,
    initCon2Parts,
    initCon3Parts,
    flyToCon2,
    mergeFloatingBcd,
    hideSource,
    onSetNavLocked,
    setAnimatingState,
  ]);

  // ── Step 8: visual overlay animations ──
  const runStep8AdbAnimation = useCallback(async () => {
    if (isAnimatingRef.current) return;
    setAnimatingState(true);

    const A = POINTS.A,
      B = POINTS.B,
      C = POINTS.C,
      D = POINTS.D;

    const verts = { ax: A.x, ay: A.y, dx: D.x, dy: D.y, bx: B.x, by: B.y };
    setStep8Verts({ ...verts });
    setStep8Phase("adb-visible");

    await new Promise((r) => setTimeout(r, 1000));

    const cx = (A.x + D.x + B.x) / 3;
    const flipped = {
      ax: 2 * cx - A.x,
      ay: A.y,
      dx: 2 * cx - D.x,
      dy: D.y,
      bx: 2 * cx - B.x,
      by: B.y,
    };

    setStep8Phase("animating");

    await new Promise((resolve) => {
      gsap.to(verts, {
        ...flipped,
        duration: 0.8,
        ease: "power2.inOut",
        onUpdate: () => setStep8Verts({ ...verts }),
        onComplete: resolve,
      });
    });

    await new Promise((r) => setTimeout(r, 400));

    const unitBA = vecNorm(A.x - B.x, A.y - B.y);
    const unitBC = vecNorm(C.x - B.x, C.y - B.y);
    const lenDA = Math.hypot(A.x - D.x, A.y - D.y);
    const lenDB = Math.hypot(B.x - D.x, B.y - D.y);
    const alignedYellow = {
      A: { x: B.x + unitBA.x * lenDA, y: B.y + unitBA.y * lenDA },
      D: { x: B.x, y: B.y },
      B: { x: B.x + unitBC.x * lenDB, y: B.y + unitBC.y * lenDB },
    };

    await new Promise((resolve) => {
      gsap.to(verts, {
        ax: alignedYellow.A.x,
        ay: alignedYellow.A.y,
        dx: alignedYellow.D.x,
        dy: alignedYellow.D.y,
        bx: alignedYellow.B.x,
        by: alignedYellow.B.y,
        duration: 0.8,
        ease: "power2.inOut",
        onUpdate: () => setStep8Verts({ ...verts }),
        onComplete: resolve,
      });
    });

    await new Promise((r) => setTimeout(r, 250));

    await new Promise((resolve) => {
      gsap.to(verts, {
        ax: A.x,
        ay: A.y,
        dx: B.x,
        dy: B.y,
        bx: C.x,
        by: C.y,
        duration: 0.8,
        ease: "power2.inOut",
        onUpdate: () => setStep8Verts({ ...verts }),
        onComplete: resolve,
      });
    });

    setStep8Phase("adb-done");

    // Blue triangle (from BCD) -> overlap ABC
    await new Promise((r) => setTimeout(r, 500));

    const blue = { ax: C.x, ay: C.y, dx: D.x, dy: D.y, bx: B.x, by: B.y };
    setStep8BlueVerts({ ...blue });
    setStep8Phase("bdc-visible");

    await new Promise((r) => setTimeout(r, 800));

    // For BDC, we DO a single flip to match orientation, then rotate+scale into place.
    const cxBlue = (blue.ax + blue.dx + blue.bx) / 3;
    const blueFlipped = {
      ax: 2 * cxBlue - blue.ax,
      ay: blue.ay,
      dx: 2 * cxBlue - blue.dx,
      dy: blue.dy,
      bx: 2 * cxBlue - blue.bx,
      by: blue.by,
    };

    setStep8Phase("bdc-animating");
    await new Promise((resolve) => {
      gsap.to(blue, {
        ...blueFlipped,
        duration: 0.8,
        ease: "power2.inOut",
        onUpdate: () => setStep8BlueVerts({ ...blue }),
        onComplete: resolve,
      });
    });

    await new Promise((r) => setTimeout(r, 250));

    // Similarity: △ABC ∼ △BDC → B→A, D→B, C→C
    const lenDC = Math.hypot(C.x - D.x, C.y - D.y);
    const alignedBlue = {
      C: { x: B.x + unitBC.x * lenDC, y: B.y + unitBC.y * lenDC },
      D: { x: B.x, y: B.y },
      B: { x: B.x + unitBA.x * lenDB, y: B.y + unitBA.y * lenDB },
    };

    await new Promise((resolve) => {
      gsap.to(blue, {
        ax: alignedBlue.C.x,
        ay: alignedBlue.C.y,
        dx: alignedBlue.D.x,
        dy: alignedBlue.D.y,
        bx: alignedBlue.B.x,
        by: alignedBlue.B.y,
        duration: 0.8,
        ease: "power2.inOut",
        onUpdate: () => setStep8BlueVerts({ ...blue }),
        onComplete: resolve,
      });
    });

    await new Promise((r) => setTimeout(r, 250));

    await new Promise((resolve) => {
      gsap.to(blue, {
        ax: C.x,
        ay: C.y,
        dx: B.x,
        dy: B.y,
        bx: A.x,
        by: A.y,
        duration: 0.8,
        ease: "power2.inOut",
        onUpdate: () => setStep8BlueVerts({ ...blue }),
        onComplete: resolve,
      });
    });

    // Show completion text + Start Over
    setStep8Phase("complete");
    setMathVisible(true);
    onUpdateTexts(undefined, APP_DATA.steps[8].navComplete);
    if (onSetNextLabel) onSetNextLabel(APP_DATA.end.restartLabel);
    onSetNextEnabled(true);

    setAnimatingState(false);
  }, [onSetNextEnabled, onSetNextLabel, onUpdateTexts, setAnimatingState]);

  useEffect(() => {
    if (step !== 8) {
      step8IntroStartedRef.current = false;
      return;
    }
    if (step8IntroStartedRef.current) return;
    step8IntroStartedRef.current = true;

    setShowAbcFill(false);
    setShowAbdFill(false);
    setShowBcdFill(false);
    setShowAngleA(false);
    setShowAngleC(false);
    setShowRightSquares(false);
    setRightSquaresFilled(false);
    setMathVisible(false);
    setMathLegacyHidden(false);
    setFloatOffsetX(0);
    setAdbSeparated(false);
    setBcdSeparated(false);
    setShowConcludeBtn(false);
    setConcluded(false);
    setProofMode("adb");
    setStep8Verts(null);
    setStep8BlueVerts(null);
    setStep8Phase("idle");

    onSetNextEnabled(false);
    onUpdateTexts(APP_DATA.steps[8].questionText, "");

    const tid = setTimeout(() => runStep8AdbAnimation(), 600);
    return () => clearTimeout(tid);
  }, [step, onSetNextEnabled, onUpdateTexts, runStep8AdbAnimation]);

  // ── Step 1 ──
  useEffect(() => {
    if (step === 1) {
      onSetNextEnabled(true);
    }
  }, [step, onSetNextEnabled]);

  // ── Step 2: blink fills ──
  useEffect(() => {
    if (step !== 2) return;
    let cancelled = false;
    if (onSetNavLocked) onSetNavLocked(true);
    onSetNextEnabled(false);
    setShowAbcFill(true);
    setShowAbdFill(false);
    setAbcFillOpacity(0);
    setAbdFillOpacity(0);

    const run = async () => {
      await blinkFill(
        (v) => {
          if (!cancelled) setAbcFillOpacity(v);
        },
        BLINK_COUNT,
        0.1,
        0.5,
      );
      if (cancelled) return;
      setShowAbdFill(true);
      await blinkFill(
        (v) => {
          if (!cancelled) setAbdFillOpacity(v);
        },
        BLINK_COUNT,
        0.1,
        0.5,
      );
      if (!cancelled) {
        onSetNextEnabled(true);
        if (onSetNavLocked) onSetNavLocked(false);
      }
    };
    run();
    return () => {
      cancelled = true;
      if (onSetNavLocked) onSetNavLocked(false);
    };
  }, [step, onSetNextEnabled, onSetNavLocked]);

  // ── Step 3 init ──
  useEffect(() => {
    if (step !== 3) return;
    setShowAbcFill(true);
    setShowAbdFill(true);
    setAbcFillOpacity(0.5);
    setAbdFillOpacity(0.5);
    setShowAngleA(true);
    setMathVisible(false);
    setFloatOffsetX(0);
    setAdbSeparated(false);
    setShowRightSquares(false);
    setRightSquaresFilled(false);
    setSquareDStable(false);
    setSquareDBlink(1);
    setLine1Parts(initLine1Parts());
    setLine2Parts(initLine2Parts());
    setLine1RuleVisible(false);
    setLine2Visible(false);
    setShowConcludeBtn(false);
    setConcluded(false);
    setStep3Phase("angle-click");
    setProofMode("adb");
    onSetNextEnabled(false);
    onUpdateTexts(APP_DATA.steps[3].questionText, APP_DATA.steps[3].navText);

    const tid = setTimeout(() => {
      const el = document.getElementById("angle-a-sector");
      if (el && onRegisterNudgeTarget) onRegisterNudgeTarget(el);
    }, 500);
    return () => clearTimeout(tid);
  }, [
    step,
    onSetNextEnabled,
    onUpdateTexts,
    onRegisterNudgeTarget,
    initLine1Parts,
    initLine2Parts,
  ]);

  const runStep3AngleClick = useCallback(async () => {
    if (isAnimatingRef.current || step !== 3 || step3Phase !== "angle-click")
      return;
    setAnimatingState(true);
    if (onHideNudge) onHideNudge();
    playSnd("click");
    setStep3Phase("separating");

    setMathVisible(true);
    setLine1Parts(initLine1Parts());
    await new Promise((r) => setTimeout(r, 600));
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r)),
    );

    const floatAnim = { x: 0 };
    await new Promise((resolve) => {
      gsap.to(floatAnim, {
        x: FLOAT_OFFSET_X,
        duration: SEPARATE_DURATION,
        ease: "power2.inOut",
        onUpdate: () => setFloatOffsetX(floatAnim.x),
        onStart: () => setAdbSeparated(true),
        onComplete: resolve,
      });
    });
    await new Promise((r) => setTimeout(r, 300));

    const flyYellow = [
      {
        key: "B1",
        text: "B",
        from: getDiagramLetterScreenPos("B", false),
        to: getMathLetterScreenPos("l1-B1"),
        color: COLOR_YELLOW,
      },
      {
        key: "A1",
        text: "A",
        from: getDiagramLetterScreenPos("A", false),
        to: getMathLetterScreenPos("l1-A1"),
        color: COLOR_YELLOW,
      },
      {
        key: "C",
        text: "C",
        from: getDiagramLetterScreenPos("C", false),
        to: getMathLetterScreenPos("l1-C"),
        color: COLOR_YELLOW,
      },
    ];
    await flyLettersSimultaneous(flyYellow, setLine1Opacity, "angle1");
    setLine1Opacity("equals", 1);
    await new Promise((r) => setTimeout(r, 300));

    const flyBlue = [
      {
        key: "B2",
        text: "B",
        from: getElementCenterById("float-label-B"),
        to: getMathLetterScreenPos("l1-B2"),
        color: COLOR_BLUE,
      },
      {
        key: "A2",
        text: "A",
        from: getElementCenterById("float-label-A"),
        to: getMathLetterScreenPos("l1-A2"),
        color: COLOR_BLUE,
      },
      {
        key: "D",
        text: "D",
        from: getElementCenterById("float-label-D"),
        to: getMathLetterScreenPos("l1-D"),
        color: COLOR_BLUE,
      },
    ];
    await flyLettersSimultaneous(flyBlue, setLine1Opacity, "angle2");
    setLine1RuleVisible(true);

    setShowRightSquares(true);
    setRightSquaresFilled(true);
    setStep3Phase("square-click");
    setAnimatingState(false);

    setTimeout(() => {
      const el = document.getElementById("right-angle-square-d");
      if (el && onRegisterNudgeTarget) onRegisterNudgeTarget(el);
    }, 400);
  }, [
    step,
    step3Phase,
    onHideNudge,
    initLine1Parts,
    getDiagramLetterScreenPos,
    getMathLetterScreenPos,
    flyLettersSimultaneous,
    setLine1Opacity,
    onRegisterNudgeTarget,
    setAnimatingState,
  ]);

  const runStep3SquareClick = useCallback(async () => {
    if (isAnimatingRef.current || step !== 3 || step3Phase !== "square-click")
      return;
    setAnimatingState(true);
    if (onHideNudge) onHideNudge();
    setSquareDStable(true);
    setSquareDBlink(1);
    playSnd("click");
    setStep3Phase("line2");
    setLine2Visible(true);
    setLine2Parts(initLine2Parts());
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r)),
    );

    const flyYellow = [
      {
        key: "A1",
        text: "A",
        from: getDiagramLetterScreenPos("A", false),
        to: getMathLetterScreenPos("l2-A1"),
        color: COLOR_YELLOW,
      },
      {
        key: "B1",
        text: "B",
        from: getDiagramLetterScreenPos("B", false),
        to: getMathLetterScreenPos("l2-B1"),
        color: COLOR_YELLOW,
      },
      {
        key: "C",
        text: "C",
        from: getDiagramLetterScreenPos("C", false),
        to: getMathLetterScreenPos("l2-C"),
        color: COLOR_YELLOW,
      },
    ];
    await flyLettersSimultaneous(flyYellow, setLine2Opacity, "angle1");
    setLine2Opacity("equals", 1);
    await new Promise((r) => setTimeout(r, 300));

    const flyBlue = [
      {
        key: "A2",
        text: "A",
        from: getDiagramLetterScreenPos("A", true),
        to: getMathLetterScreenPos("l2-A2"),
        color: COLOR_BLUE,
      },
      {
        key: "D",
        text: "D",
        from: getDiagramLetterScreenPos("D", true),
        to: getMathLetterScreenPos("l2-D"),
        color: COLOR_BLUE,
      },
      {
        key: "B2",
        text: "B",
        from: getDiagramLetterScreenPos("B", true),
        to: getMathLetterScreenPos("l2-B2"),
        color: COLOR_BLUE,
      },
    ];
    await flyLettersSimultaneous(flyBlue, setLine2Opacity, "angle2");

    setShowConcludeBtn(true);
    setStep3Phase("conclude");
    onUpdateTexts(undefined, APP_DATA.steps[3].navShowConclude);
    setAnimatingState(false);

    setTimeout(() => {
      const el = document.getElementById("conclude-button");
      if (el && onRegisterNudgeTarget)
        onRegisterNudgeTarget(el, { delay: 400 });
    }, 400);
  }, [
    step,
    step3Phase,
    onHideNudge,
    initLine2Parts,
    getDiagramLetterScreenPos,
    getMathLetterScreenPos,
    flyLettersSimultaneous,
    setLine2Opacity,
    onUpdateTexts,
    onRegisterNudgeTarget,
    setAnimatingState,
  ]);

  const handleConclude = useCallback(() => {
    playSnd("click");
    if (onHideNudge) onHideNudge();
    setShowConcludeBtn(false);
    setConcluded(true);
    if (step === 6) {
      setStep6Phase("done");
      onUpdateTexts(
        APP_DATA.steps[6].questionText,
        APP_DATA.steps[6].navAfterConclude,
      );
      if (onSetNextLabel) onSetNextLabel(APP_DATA.math.summaryLabel);
    } else {
      setStep3Phase("done");
      onUpdateTexts(
        APP_DATA.steps[3].questionText,
        APP_DATA.steps[3].navAfterConclude,
      );
    }
    onSetNextEnabled(true);
    setTimeout(() => {
      const el = document.getElementById("next-button");
      if (el && onRegisterNudgeTarget)
        onRegisterNudgeTarget(el, { immediate: true });
    }, 400);
  }, [
    step,
    onHideNudge,
    onUpdateTexts,
    onSetNextEnabled,
    onSetNextLabel,
    onRegisterNudgeTarget,
  ]);

  const runStep6AngleClick = useCallback(async () => {
    if (isAnimatingRef.current || step !== 6 || step6Phase !== "angle-click")
      return;
    setAnimatingState(true);
    if (onHideNudge) onHideNudge();
    playSnd("click");
    setStep6Phase("separating");

    setMathVisible(true);
    setLine1Parts(initLine1PartsBdc());
    await new Promise((r) => setTimeout(r, 600));
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r)),
    );

    const floatAnim = { x: 0 };
    await new Promise((resolve) => {
      gsap.to(floatAnim, {
        x: FLOAT_OFFSET_X,
        duration: SEPARATE_DURATION,
        ease: "power2.inOut",
        onUpdate: () => setFloatOffsetX(floatAnim.x),
        onStart: () => setBcdSeparated(true),
        onComplete: resolve,
      });
    });
    await new Promise((r) => setTimeout(r, 300));

    const flyYellow = [
      {
        key: "B1",
        text: "B",
        from: getDiagramLetterScreenPos("B", false),
        to: getMathLetterScreenPos("l1-B1"),
        color: COLOR_YELLOW,
      },
      {
        key: "C1",
        text: "C",
        from: getDiagramLetterScreenPos("C", false),
        to: getMathLetterScreenPos("l1-C1"),
        color: COLOR_YELLOW,
      },
      {
        key: "A",
        text: "A",
        from: getDiagramLetterScreenPos("A", false),
        to: getMathLetterScreenPos("l1-A"),
        color: COLOR_YELLOW,
      },
    ];
    await flyLettersSimultaneous(flyYellow, setLine1Opacity, "angle1");
    setLine1Opacity("equals", 1);
    await new Promise((r) => setTimeout(r, 300));

    const flyBlue = [
      {
        key: "B2",
        text: "B",
        from: getElementCenterById("float-label-B-bcd"),
        to: getMathLetterScreenPos("l1-B2"),
        color: COLOR_BLUE,
      },
      {
        key: "C2",
        text: "C",
        from: getElementCenterById("float-label-C-bcd"),
        to: getMathLetterScreenPos("l1-C2"),
        color: COLOR_BLUE,
      },
      {
        key: "D",
        text: "D",
        from: getElementCenterById("float-label-D-bcd"),
        to: getMathLetterScreenPos("l1-D"),
        color: COLOR_BLUE,
      },
    ];
    await flyLettersSimultaneous(flyBlue, setLine1Opacity, "angle2");
    setLine1RuleVisible(true);

    setShowRightSquares(true);
    setRightSquaresFilled(true);
    setStep6Phase("square-click");
    setAnimatingState(false);

    setTimeout(() => {
      const el = document.getElementById("right-angle-square-d-bdc");
      if (el && onRegisterNudgeTarget) onRegisterNudgeTarget(el);
    }, 400);
  }, [
    step,
    step6Phase,
    onHideNudge,
    initLine1PartsBdc,
    getDiagramLetterScreenPos,
    getMathLetterScreenPos,
    flyLettersSimultaneous,
    setLine1Opacity,
    onRegisterNudgeTarget,
    setAnimatingState,
  ]);

  const runStep6SquareClick = useCallback(async () => {
    if (isAnimatingRef.current || step !== 6 || step6Phase !== "square-click")
      return;
    setAnimatingState(true);
    if (onHideNudge) onHideNudge();
    setSquareDStable(true);
    setSquareDBlink(1);
    playSnd("click");
    setStep6Phase("line2");
    setLine2Visible(true);
    setLine2Parts(initLine2PartsBdc());
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r)),
    );

    const flyYellow = [
      {
        key: "A1",
        text: "A",
        from: getDiagramLetterScreenPos("A", false),
        to: getMathLetterScreenPos("l2-A1"),
        color: COLOR_YELLOW,
      },
      {
        key: "B1",
        text: "B",
        from: getDiagramLetterScreenPos("B", false),
        to: getMathLetterScreenPos("l2-B1"),
        color: COLOR_YELLOW,
      },
      {
        key: "C1",
        text: "C",
        from: getDiagramLetterScreenPos("C", false),
        to: getMathLetterScreenPos("l2-C1"),
        color: COLOR_YELLOW,
      },
    ];
    await flyLettersSimultaneous(flyYellow, setLine2Opacity, "angle1");
    setLine2Opacity("equals", 1);
    await new Promise((r) => setTimeout(r, 300));

    const flyBlue = [
      {
        key: "B2",
        text: "B",
        from: getDiagramLetterScreenPos("B", true),
        to: getMathLetterScreenPos("l2-B2"),
        color: COLOR_BLUE,
      },
      {
        key: "D",
        text: "D",
        from: getDiagramLetterScreenPos("D", true),
        to: getMathLetterScreenPos("l2-D"),
        color: COLOR_BLUE,
      },
      {
        key: "C2",
        text: "C",
        from: getDiagramLetterScreenPos("C", true),
        to: getMathLetterScreenPos("l2-C2"),
        color: COLOR_BLUE,
      },
    ];
    await flyLettersSimultaneous(flyBlue, setLine2Opacity, "angle2");

    setShowConcludeBtn(true);
    setStep6Phase("conclude");
    onUpdateTexts(undefined, APP_DATA.steps[6].navShowConclude);
    setAnimatingState(false);

    setTimeout(() => {
      const el = document.getElementById("conclude-button");
      if (el && onRegisterNudgeTarget)
        onRegisterNudgeTarget(el, { delay: 400 });
    }, 400);
  }, [
    step,
    step6Phase,
    onHideNudge,
    initLine2PartsBdc,
    getDiagramLetterScreenPos,
    getMathLetterScreenPos,
    flyLettersSimultaneous,
    setLine2Opacity,
    onUpdateTexts,
    onRegisterNudgeTarget,
    setAnimatingState,
  ]);

  // Square D border blink
  useEffect(() => {
    const isStep3Square =
      step === 3 && showRightSquares && rightSquaresFilled && !squareDStable;
    const isStep6Square =
      step === 6 && showRightSquares && rightSquaresFilled && !squareDStable;
    if (!isStep3Square && !isStep6Square) return;
    let count = 0;
    const id = setInterval(() => {
      count++;
      setSquareDBlink(count % 2 === 0 ? 1 : 0.2);
    }, 500);
    return () => clearInterval(id);
  }, [showRightSquares, rightSquaresFilled, squareDStable, step]);

  const renderLabel = (key, dx, dy, id) => {
    const pos = getLabelPos(key, dx, dy);
    return React.createElement(
      "text",
      {
        key: id || `lbl-${key}`,
        id: id || `label-${key}`,
        x: pos.x,
        y: pos.y,
        fill: COLOR_WHITE,
        fontSize: LABEL_FONT_SIZE,
        fontWeight: 700,
        textAnchor: "middle",
        dominantBaseline: "middle",
      },
      key,
    );
  };

  const renderDiagram = () => {
    const { A, B, C, D } = POINTS;
    const fx = floatOffsetX;

    const Afloat = shiftPoint(A, fx, 0);
    const Bfloat = shiftPoint(B, fx, 0);
    const Cfloat = shiftPoint(C, fx, 0);
    const Dfloat = shiftPoint(D, fx, 0);

    const abcPath = `M${B.x} ${B.y} L${C.x} ${C.y} L${A.x} ${A.y} Z`;
    const abdPath = `M${A.x} ${A.y} L${B.x} ${B.y} L${D.x} ${D.y} Z`;
    const bcdPath = `M${B.x} ${B.y} L${C.x} ${C.y} L${D.x} ${D.y} Z`;
    const abdFloatPath = `M${Afloat.x} ${Afloat.y} L${Bfloat.x} ${Bfloat.y} L${Dfloat.x} ${Dfloat.y} Z`;
    const bcdFloatPath = `M${Bfloat.x} ${Bfloat.y} L${Cfloat.x} ${Cfloat.y} L${Dfloat.x} ${Dfloat.y} Z`;

    const useBdcSquare = (step >= 5 && step < 8) || proofMode === "bdc";
    const squareBPath = getRightAngleSquarePath(B, A, C, SQUARE_SIZE);
    const squareDPath = useBdcSquare
      ? getRightAngleSquarePath(D, B, C, SQUARE_SIZE)
      : getRightAngleSquarePath(D, A, B, SQUARE_SIZE);
    const squareDFloatPathAdb = getRightAngleSquarePath(
      Dfloat,
      Afloat,
      Bfloat,
      SQUARE_SIZE,
    );
    const squareDFloatPathBdc = getRightAngleSquarePath(
      Dfloat,
      Bfloat,
      Cfloat,
      SQUARE_SIZE,
    );

    const showBasicSquares = step >= 1;
    const showFills = step >= 2;
    const hideDOnMain = adbSeparated || bcdSeparated;
    const squaresFilled = rightSquaresFilled && showRightSquares && step !== 4;
    const showAbdOnMain =
      showFills && showAbdFill && !adbSeparated && proofMode === "adb";
    const showBcdOnMain = showFills && showBcdFill && !bcdSeparated;

    return React.createElement(
      "g",
      { className: "diagram-group" },
      showFills &&
        showAbcFill &&
        React.createElement("path", {
          d: abcPath,
          fill: COLOR_YELLOW_FILL,
          fillOpacity: abcFillOpacity,
          stroke: "none",
        }),

      showAbdOnMain &&
        React.createElement("path", {
          d: abdPath,
          fill: COLOR_BLUE_FILL,
          fillOpacity: abdFillOpacity,
          stroke: "none",
        }),

      showBcdOnMain &&
        React.createElement("path", {
          d: bcdPath,
          fill: COLOR_BLUE_FILL,
          fillOpacity: bcdFillOpacity,
          stroke: "none",
        }),

      React.createElement("path", {
        d: abcPath,
        fill: "none",
        stroke: COLOR_WHITE,
        strokeWidth: STROKE_WIDTH,
      }),

      React.createElement("line", {
        x1: B.x,
        y1: B.y,
        x2: D.x,
        y2: D.y,
        stroke: COLOR_WHITE,
        strokeWidth: STROKE_WIDTH,
      }),

      (step >= 5 || proofMode === "bdc") &&
        React.createElement("line", {
          x1: D.x,
          y1: D.y,
          x2: C.x,
          y2: C.y,
          stroke: COLOR_WHITE,
          strokeWidth: STROKE_WIDTH,
        }),

      showBasicSquares &&
        React.createElement("path", {
          d: squareBPath,
          fill: squaresFilled ? COLOR_YELLOW_FILL : "none",
          fillOpacity: squaresFilled ? 0.85 : 0,
          stroke: squaresFilled ? COLOR_YELLOW : COLOR_WHITE,
          strokeWidth: 1.5,
        }),

      !hideDOnMain &&
        showBasicSquares &&
        !squaresFilled &&
        React.createElement("path", {
          d: squareDPath,
          fill: "none",
          stroke: COLOR_WHITE,
          strokeWidth: 1.5,
        }),

      !hideDOnMain &&
        squaresFilled &&
        proofMode === "adb" &&
        React.createElement("path", {
          d: squareDPath,
          fill: COLOR_BLUE_FILL,
          fillOpacity: 0.85,
          stroke: COLOR_BLUE,
          strokeWidth: 2,
        }),

      showAngleA &&
        React.createElement("path", {
          id: "angle-a-sector",
          d: describeSector(A, C, B, SECTOR_RADIUS),
          fill: COLOR_YELLOW,
          fillOpacity: 1,
          stroke: COLOR_YELLOW,
          strokeWidth: 1.5,
          style: {
            cursor:
              step === 3 && step3Phase === "angle-click"
                ? "pointer"
                : "default",
            pointerEvents:
              step === 3 && step3Phase === "angle-click" ? "all" : "none",
          },
          onClick: runStep3AngleClick,
        }),

      showAngleC &&
        React.createElement("path", {
          id: "angle-c-sector",
          d: describeSector(C, B, A, SECTOR_RADIUS),
          fill: COLOR_YELLOW,
          fillOpacity: 1,
          stroke: COLOR_YELLOW,
          strokeWidth: 1.5,
          style: {
            cursor:
              step === 6 && step6Phase === "angle-click"
                ? "pointer"
                : "default",
            pointerEvents:
              step === 6 && step6Phase === "angle-click" ? "all" : "none",
          },
          onClick: runStep6AngleClick,
        }),

      adbSeparated &&
        React.createElement(
          "g",
          { className: "floating-abd" },
          React.createElement("path", {
            d: abdFloatPath,
            fill: COLOR_BLUE_FILL,
            fillOpacity: 0.5,
            stroke: "none",
          }),
          React.createElement("path", {
            d: describeSector(Afloat, Bfloat, Dfloat, SECTOR_RADIUS),
            fill: COLOR_BLUE,
            fillOpacity: 0.85,
            stroke: COLOR_BLUE,
            strokeWidth: 1.5,
          }),
          React.createElement("path", {
            id: "right-angle-square-d",
            d: squareDFloatPathAdb,
            fill: rightSquaresFilled ? COLOR_BLUE_FILL : "none",
            fillOpacity: rightSquaresFilled ? 0.85 : 0,
            stroke: rightSquaresFilled ? COLOR_BLUE : COLOR_WHITE,
            strokeWidth: rightSquaresFilled ? 2 : 1.5,
            strokeOpacity:
              rightSquaresFilled && !squareDStable ? squareDBlink : 1,
            style: {
              cursor:
                showRightSquares &&
                rightSquaresFilled &&
                step3Phase === "square-click" &&
                !squareDStable
                  ? "pointer"
                  : "default",
              pointerEvents:
                showRightSquares &&
                rightSquaresFilled &&
                step3Phase === "square-click" &&
                !squareDStable
                  ? "all"
                  : "none",
            },
            onClick: runStep3SquareClick,
          }),
          renderLabel("A", fx, 0, "float-label-A"),
          renderLabel("B", fx, 0, "float-label-B"),
          renderLabel("D", fx, 0, "float-label-D"),
        ),

      bcdSeparated &&
        React.createElement(
          "g",
          { className: "floating-bcd" },
          React.createElement("path", {
            d: bcdFloatPath,
            fill: COLOR_BLUE_FILL,
            fillOpacity: 0.5,
            stroke: "none",
          }),
          React.createElement("path", {
            d: describeSector(Cfloat, Bfloat, Dfloat, SECTOR_RADIUS),
            fill: COLOR_BLUE,
            fillOpacity: 0.85,
            stroke: COLOR_BLUE,
            strokeWidth: 1.5,
          }),
          React.createElement("path", {
            id: "right-angle-square-d-bdc",
            d: squareDFloatPathBdc,
            fill: rightSquaresFilled ? COLOR_BLUE_FILL : "none",
            fillOpacity: rightSquaresFilled ? 0.85 : 0,
            stroke: rightSquaresFilled ? COLOR_BLUE : COLOR_WHITE,
            strokeWidth: rightSquaresFilled ? 2 : 1.5,
            strokeOpacity:
              rightSquaresFilled && !squareDStable ? squareDBlink : 1,
            style: {
              cursor:
                showRightSquares &&
                rightSquaresFilled &&
                step6Phase === "square-click" &&
                !squareDStable
                  ? "pointer"
                  : "default",
              pointerEvents:
                showRightSquares &&
                rightSquaresFilled &&
                step6Phase === "square-click" &&
                !squareDStable
                  ? "all"
                  : "none",
            },
            onClick: runStep6SquareClick,
          }),
          renderLabel("B", fx, 0, "float-label-B-bcd"),
          renderLabel("C", fx, 0, "float-label-C-bcd"),
          renderLabel("D", fx, 0, "float-label-D-bcd"),
        ),

      step === 8 &&
        step8Verts &&
        React.createElement(
          "g",
          { className: "step8-yellow-tri" },
          React.createElement("path", {
            d: `M${step8Verts.ax} ${step8Verts.ay} L${step8Verts.dx} ${step8Verts.dy} L${step8Verts.bx} ${step8Verts.by} Z`,
            fill: COLOR_YELLOW_FILL,
            fillOpacity: 0.5,
            stroke: COLOR_YELLOW,
            strokeWidth: STROKE_WIDTH,
          }),
          React.createElement("path", {
            d: getRightAngleSquarePath(
              { x: step8Verts.dx, y: step8Verts.dy },
              { x: step8Verts.ax, y: step8Verts.ay },
              { x: step8Verts.bx, y: step8Verts.by },
              SQUARE_SIZE,
            ),
            fill: "none",
            stroke: COLOR_YELLOW,
            strokeWidth: 1.5,
          }),
        ),

      step === 8 &&
        step8BlueVerts &&
        React.createElement(
          "g",
          { className: "step8-blue-tri" },
          React.createElement("path", {
            d: `M${step8BlueVerts.ax} ${step8BlueVerts.ay} L${step8BlueVerts.dx} ${step8BlueVerts.dy} L${step8BlueVerts.bx} ${step8BlueVerts.by} Z`,
            fill: COLOR_BLUE_FILL,
            fillOpacity: 0.5,
            stroke: COLOR_BLUE,
            strokeWidth: STROKE_WIDTH,
          }),
          React.createElement("path", {
            d: getRightAngleSquarePath(
              { x: step8BlueVerts.dx, y: step8BlueVerts.dy },
              { x: step8BlueVerts.ax, y: step8BlueVerts.ay },
              { x: step8BlueVerts.bx, y: step8BlueVerts.by },
              SQUARE_SIZE,
            ),
            fill: "none",
            stroke: COLOR_BLUE,
            strokeWidth: 1.5,
          }),
        ),

      renderLabel("A", 0, 0, "label-A"),
      renderLabel("B", 0, 0, "label-B"),
      renderLabel("C", 0, 0, "label-C"),
      !hideDOnMain && renderLabel("D", 0, 0, "label-D"),
    );
  };

  const renderMathSlot = (dataKey, part, colorClass) => {
    const isHidden = hiddenSources[dataKey];
    const opacity = isHidden ? 0 : part?.opacity || 0;
    const text = part?.text || "";
    return React.createElement(
      "span",
      {
        key: dataKey,
        className: `math-slot ${colorClass}`,
        "data-math-key": dataKey,
        style: { opacity },
      },
      text,
    );
  };

  const renderConSlot = (dataKey, text, colorClass) => {
    const opacity = con1Parts[dataKey] || 0;
    return React.createElement(
      "span",
      {
        key: dataKey,
        className: `con-slot ${colorClass}`,
        "data-con-key": dataKey,
        style: { opacity },
      },
      text,
    );
  };

  const renderCon1 = () => {
    return React.createElement(
      "div",
      {
        className: "con1" + (con1Opacity ? " visible" : ""),
        style: { opacity: con1Opacity },
      },
      React.createElement(
        "div",
        {
          className: "similarity",
          "data-con-key": "con-sim",
          style: { opacity: con1Parts["con-sim"] || 0 },
        },
        APP_DATA.math.conclusionLine1,
      ),
      con1RulesVisible &&
        React.createElement(
          "div",
          { className: "rules-used" },
          renderConSlot("con-l1-angle1", "\u2220", "math-yellow"),
          renderConSlot("con-l1-B1", "B", "math-yellow"),
          renderConSlot("con-l1-A1", "A", "math-yellow"),
          renderConSlot("con-l1-C", "C", "math-yellow"),
          renderConSlot("con-l1-eq1", "=", "math-white"),
          renderConSlot("con-l1-angle2", "\u2220", "math-blue"),
          renderConSlot("con-l1-B2", "B", "math-blue"),
          renderConSlot("con-l1-A2", "A", "math-blue"),
          renderConSlot("con-l1-D", "D", "math-blue"),
          React.createElement(
            "span",
            {
              className: "con-slot math-white con-amp",
              style: { opacity: con1AmpVisible ? 1 : 0 },
            },
            APP_DATA.math.rulesUsedAmp,
          ),
          renderConSlot("con-l2-angle1", "\u2220", "math-yellow"),
          renderConSlot("con-l2-A1", "A", "math-yellow"),
          renderConSlot("con-l2-B1", "B", "math-yellow"),
          renderConSlot("con-l2-C", "C", "math-yellow"),
          renderConSlot("con-l2-eq", "=", "math-white"),
          renderConSlot("con-l2-angle2", "\u2220", "math-blue"),
          renderConSlot("con-l2-A2", "A", "math-blue"),
          renderConSlot("con-l2-D", "D", "math-blue"),
          renderConSlot("con-l2-B2", "B", "math-blue"),
        ),
    );
  };

  const renderCon2Slot = (dataKey, text, colorClass) => {
    const opacity = con2Parts[dataKey] || 0;
    return React.createElement(
      "span",
      {
        key: dataKey,
        className: `con-slot ${colorClass}`,
        "data-con2-key": dataKey,
        style: { opacity },
      },
      text,
    );
  };

  const renderCon2 = () => {
    return React.createElement(
      "div",
      {
        className: "con2" + (con2Opacity ? " visible" : ""),
        style: { opacity: con2Opacity },
      },
      React.createElement(
        "div",
        {
          id: "con2-similarity",
          className: "similarity",
          "data-con2-key": "con2-sim",
          style: { opacity: con2Parts["con2-sim"] || 0 },
        },
        APP_DATA.math.con2Sim,
      ),
      con2RulesVisible &&
        React.createElement(
          "div",
          { className: "rules-used" },
          renderCon2Slot("con2-r1-angle1", "\u2220", "math-yellow"),
          renderCon2Slot("con2-r1-B", "B", "math-yellow"),
          renderCon2Slot("con2-r1-C1", "C", "math-yellow"),
          renderCon2Slot("con2-r1-A", "A", "math-yellow"),
          renderCon2Slot("con2-r1-eq", "=", "math-white"),
          renderCon2Slot("con2-r1-angle2", "\u2220", "math-blue"),
          renderCon2Slot("con2-r1-B2", "B", "math-blue"),
          renderCon2Slot("con2-r1-C2", "C", "math-blue"),
          renderCon2Slot("con2-r1-D", "D", "math-blue"),
          React.createElement(
            "span",
            {
              className: "con-slot math-white con-amp",
              "data-con2-key": "con2-amp",
              style: { opacity: con2Parts["con2-amp"] || 0 },
            },
            APP_DATA.math.rulesUsedAmp,
          ),
          renderCon2Slot("con2-r2-angle1", "\u2220", "math-yellow"),
          renderCon2Slot("con2-r2-A1", "A", "math-yellow"),
          renderCon2Slot("con2-r2-B1", "B", "math-yellow"),
          renderCon2Slot("con2-r2-C1", "C", "math-yellow"),
          renderCon2Slot("con2-r2-eq", "=", "math-white"),
          renderCon2Slot("con2-r2-angle2", "\u2220", "math-blue"),
          renderCon2Slot("con2-r2-B2", "B", "math-blue"),
          renderCon2Slot("con2-r2-D", "D", "math-blue"),
          renderCon2Slot("con2-r2-C2", "C", "math-blue"),
        ),
    );
  };

  const renderCon3 = () => {
    if (!con3Opacity) return null;
    return React.createElement(
      "div",
      {
        className: "con3",
        style: { opacity: con3Opacity },
      },
      React.createElement(
        "div",
        {
          className: "similarity",
          style: { opacity: 1 },
        },
        React.createElement(
          "span",
          {
            className: "con-slot math-white",
            "data-con3-key": "con3-adb",
            style: { opacity: con3Parts["con3-adb"] || 0 },
          },
          "\u25B3ADB",
        ),
        React.createElement(
          "span",
          {
            className: "con-slot math-white",
            "data-con3-key": "con3-tilde",
            style: { opacity: con3TildeVisible ? 1 : 0 },
          },
          "\u223C",
        ),
        React.createElement(
          "span",
          {
            className: "con-slot math-white",
            "data-con3-key": "con3-rest",
            style: { opacity: con3Parts["con3-rest"] || 0 },
          },
          "\u25B3ABC \u223C \u25B3BDC",
        ),
      ),
    );
  };

  const renderMathLine1 = () => {
    const isBdc = proofMode === "bdc" && step >= 6;
    return React.createElement(
      "div",
      { className: "math-line math-line-1" },
      renderMathSlot("l1-angle1", line1Parts.angle1, "math-yellow"),
      isBdc
        ? [
            renderMathSlot("l1-B1", line1Parts.B1, "math-yellow"),
            renderMathSlot("l1-C1", line1Parts.C1, "math-yellow"),
            renderMathSlot("l1-A", line1Parts.A, "math-yellow"),
          ]
        : [
            renderMathSlot("l1-B1", line1Parts.B1, "math-yellow"),
            renderMathSlot("l1-A1", line1Parts.A1, "math-yellow"),
            renderMathSlot("l1-C", line1Parts.C, "math-yellow"),
          ],
      renderMathSlot("l1-equals", line1Parts.equals, "math-white"),
      renderMathSlot("l1-angle2", line1Parts.angle2, "math-blue"),
      isBdc
        ? [
            renderMathSlot("l1-B2", line1Parts.B2, "math-blue"),
            renderMathSlot("l1-C2", line1Parts.C2, "math-blue"),
            renderMathSlot("l1-D", line1Parts.D, "math-blue"),
          ]
        : [
            renderMathSlot("l1-B2", line1Parts.B2, "math-blue"),
            renderMathSlot("l1-A2", line1Parts.A2, "math-blue"),
            renderMathSlot("l1-D", line1Parts.D, "math-blue"),
          ],
      line1RuleVisible &&
        React.createElement(
          "span",
          { className: "math-rule" },
          APP_DATA.math.commonAngle,
        ),
    );
  };

  const renderMathLine2 = () => {
    if (!line2Visible) return null;
    const isBdc = proofMode === "bdc" && step >= 6;
    return React.createElement(
      "div",
      { className: "math-line math-line-2" },
      renderMathSlot("l2-angle1", line2Parts.angle1, "math-yellow"),
      isBdc
        ? [
            renderMathSlot("l2-A1", line2Parts.A1, "math-yellow"),
            renderMathSlot("l2-B1", line2Parts.B1, "math-yellow"),
            renderMathSlot("l2-C1", line2Parts.C1, "math-yellow"),
          ]
        : [
            renderMathSlot("l2-A1", line2Parts.A1, "math-yellow"),
            renderMathSlot("l2-B1", line2Parts.B1, "math-yellow"),
            renderMathSlot("l2-C", line2Parts.C, "math-yellow"),
          ],
      renderMathSlot("l2-equals", line2Parts.equals, "math-white"),
      renderMathSlot("l2-angle2", line2Parts.angle2, "math-blue"),
      isBdc
        ? [
            renderMathSlot("l2-B2", line2Parts.B2, "math-blue"),
            renderMathSlot("l2-D", line2Parts.D, "math-blue"),
            renderMathSlot("l2-C2", line2Parts.C2, "math-blue"),
          ]
        : [
            renderMathSlot("l2-A2", line2Parts.A2, "math-blue"),
            renderMathSlot("l2-D", line2Parts.D, "math-blue"),
            renderMathSlot("l2-B2", line2Parts.B2, "math-blue"),
          ],
    );
  };

  const conclusionLine1Text =
    proofMode === "bdc" && step >= 6
      ? APP_DATA.math.conclusionLine1Bdc
      : APP_DATA.math.conclusionLine1;

  const isStep8Math = step === 8 && mathVisible;
  const isStep8OnlyMath = step === 8 && isStep8Math;
  const infoWidth = step === 1 ? "45%" : "0%";
  const mathWidth = isStep8Math
    ? "45%"
    : step >= 8
      ? "0%"
      : mathVisible || step >= 4
        ? "45%"
        : "0%";
  const visualWidth = "55%";
  const visualMarginLeft =
    step >= 8
      ? isStep8Math
        ? "0%"
        : "22.5%"
      : mathVisible || step >= 4
        ? "0%"
        : step >= 2
          ? "22.5%"
          : "0%";
  const visualCentering =
    ((step >= 2 && step <= 3) || step === 6 || step >= 8) && !mathVisible;
  const mathContentClass =
    "math-content" +
    (step >= 5 && con1Opacity && mathVisible && !mathLegacyHidden
      ? " with-con1"
      : "");

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "div",
      {
        className: "canvas-column info-column" + (step === 1 ? " visible" : ""),
        style: { width: infoWidth },
      },
      React.createElement(
        "div",
        { className: "info-content" },
        React.createElement(
          "p",
          { className: "info-title" },
          APP_DATA.info.proveTitle,
        ),
        React.createElement("p", {
          className: "info-line",
          dangerouslySetInnerHTML: { __html: APP_DATA.info.proveLine },
        }),
      ),
    ),
    React.createElement(
      "div",
      {
        className:
          "canvas-column visual-column" +
          (visualCentering ? " visual-centering" : ""),
        style: { width: visualWidth, marginLeft: visualMarginLeft },
      },
      React.createElement(
        "svg",
        {
          ref: svgRef,
          className: "main-svg",
          viewBox: VIEWBOX,
          preserveAspectRatio: "xMidYMid meet",
        },
        renderDiagram(),
      ),
    ),
    React.createElement(
      "div",
      {
        ref: mathRef,
        className:
          "canvas-column math-column" +
          ((step < 8 && (mathVisible || step >= 4)) || isStep8Math
            ? " visible"
            : ""),
        style: { width: mathWidth },
      },
      React.createElement(
        "div",
        { className: mathContentClass },
        isStep8OnlyMath &&
          React.createElement(
            "div",
            { className: "step8-complete-panel" },
            React.createElement(
            "div",
            { className: "step8-complete-text" },
              APP_DATA.end.completeLine1 + " " + APP_DATA.end.completeLine2,
            ),
            React.createElement(
              "div",
              { className: "similarity step8-similarity" },
              "\u25B3ABC\u223C\u25B3ADB\u223C\u25B3BDC",
            ),
          ),
        !isStep8OnlyMath && step >= 4 && renderCon1(),
        !isStep8OnlyMath && step === 7 && renderCon2(),
        !isStep8OnlyMath && step === 7 && renderCon3(),
        step === 7 &&
          step7ConcludeVisible &&
          step7Phase === "conclude" &&
          React.createElement(
            "button",
            {
              id: "step7-conclude-button",
              className: "conclude-button step7-conclude",
              onClick: async () => {
                if (isAnimatingRef.current) return;
                setAnimatingState(true);
                playSnd("click");

                setStep7Phase("merging");
                setStep7ConcludeVisible(false);
                setCon1RulesVisible(false);
                setCon2RulesVisible(false);

                setCon3Opacity(1);
                setCon3Parts(initCon3Parts());
                setCon3TildeVisible(false);

                await new Promise((r) =>
                  requestAnimationFrame(() => requestAnimationFrame(r)),
                );

                const vw = window.innerWidth / 100;
                const simFontSize = vw * 2.2;

                // Fly △ABC∼△BDC from con2 -> con3
                await flyLetter(
                  `con3-fly-rest-${Date.now()}`,
                  APP_DATA.math.con2Sim,
                  getScreenCenter(document.getElementById("con2-similarity")),
                  getCon3ScreenPos("con3-rest"),
                  COLOR_WHITE,
                  simFontSize,
                );
                setCon3Parts((p) => ({ ...p, "con3-rest": 1 }));

                // Fly △ADB from con1 -> con3, then reveal first ~
                await flyLetter(
                  `con3-fly-adb-${Date.now()}`,
                  "\u25B3ADB",
                  getScreenCenter(
                    document.querySelector('[data-con-key="con-sim"]'),
                  ),
                  getCon3ScreenPos("con3-adb"),
                  COLOR_WHITE,
                  simFontSize,
                );
                setCon3Parts((p) => ({ ...p, "con3-adb": 1 }));
                setCon3TildeVisible(true);

                onUpdateTexts(undefined, APP_DATA.steps[7].navAfterConclude);
                if (onSetNextLabel)
                  onSetNextLabel(APP_DATA.math.visualiseLabel);
                onSetNextEnabled(true);
                setAnimatingState(false);
              },
            },
            APP_DATA.math.concludeText,
          ),
        !isStep8OnlyMath &&
          !mathLegacyHidden &&
          React.createElement(
            "div",
            { className: "math-legacy" },
            renderMathLine1(),
            renderMathLine2(),
            showConcludeBtn &&
              !concluded &&
              React.createElement(
                "button",
                {
                  id: "conclude-button",
                  className: "conclude-button",
                  onClick: handleConclude,
                },
                APP_DATA.math.concludeText,
              ),
            concluded &&
              React.createElement(
                "div",
                { className: "conclusion-box" },
                React.createElement(
                  "p",
                  {
                    id: "conclusion-line1-source",
                    className: "conclusion-line1",
                    style: {
                      opacity: hiddenSources["conclusion-line1-source"] ? 0 : 1,
                    },
                  },
                  conclusionLine1Text,
                ),
                React.createElement(
                  "p",
                  {
                    id: "conclusion-line2-source",
                    className: "conclusion-line2",
                    style: {
                      opacity: hiddenSources["conclusion-line2-source"] ? 0 : 1,
                    },
                  },
                  APP_DATA.math.conclusionLine2,
                ),
              ),
          ),
      ),
    ),
    flyingClones.length > 0 &&
      React.createElement(
        "div",
        { className: "flying-clones-layer" },
        flyingClones.map((c) => {
          const x = c.from.x + (c.to.x - c.from.x) * c.t;
          const y = c.from.y + (c.to.y - c.from.y) * c.t;
          const startSize = c.fontSizeStart ?? c.fontSizeEnd ?? 22;
          const endSize = c.fontSizeEnd ?? c.fontSizeStart ?? 22;
          const fontSize = startSize + (endSize - startSize) * c.t;
          return React.createElement(
            "span",
            {
              key: c.id,
              className: "flying-letter",
              style: {
                left: x + "px",
                top: y + "px",
                color: c.color,
                fontSize: fontSize + "px",
              },
            },
            c.text,
          );
        }),
      ),
  );
};
