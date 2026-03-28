const MainCanvas = ({
  step,
  triangleIndex,
  onSetNextEnabled,
  onUpdateTexts,
  onMeasurementDone,
  onAnimatingChange,
}) => {
  const { useState, useEffect, useRef, useCallback, useMemo } = React;

  // ── Triangle vertex data (math coords, Y up) ──
  const TRIANGLE_VERTICES = [
    { A: [0, 0], B: [10, 0], C: [5, 5 * Math.sqrt(3)] },
    { A: [0, 0], B: [13, 0], C: [6.5, Math.sqrt(81 - 42.25)] },
    { A: [0, 0], B: [5, 0], C: [5.3, (3 * Math.sqrt(399)) / 10] },
  ];

  // ── Constants ──
  const SVG_W = 400;
  const SVG_H = 280;
  const PAD = 30;
  const STROKE_W = 4;
  const LABEL_OFFSET = 22;
  const SIDE_COLORS = ["#3CFE89", "#2085C7", "#F18A00"];

  const RULER = { w: 309, h: 54, zeroX: 8.95, cm: 19.0 };
  /** Seconds — matches GSAP line tween; use same length for `sound/draw.mp3` */
  const LINE_DRAW_DURATION_SEC = 1.5;

  // ── Data ──
  const triData = APP_DATA.triangles[triangleIndex];
  const verts = TRIANGLE_VERTICES[triangleIndex];

  // ── SVG coordinate transform ──
  const computeSVG = (v) => {
    const pts = [v.A, v.B, v.C];
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const minX = Math.min(...xs),
      maxX = Math.max(...xs);
    const minY = Math.min(...ys),
      maxY = Math.max(...ys);
    const tw = maxX - minX,
      th = maxY - minY;
    const aw = SVG_W - 2 * PAD,
      ah = SVG_H - 2 * PAD;
    const s = Math.min(aw / tw, ah / th);
    const ox = PAD + (aw - tw * s) / 2;
    const oy = PAD + (ah - th * s) / 2;
    const t = ([x, y]) => [ox + (x - minX) * s, oy + (maxY - y) * s];
    return { A: t(v.A), B: t(v.B), C: t(v.C), scale: s };
  };

  const sv = useMemo(() => computeSVG(verts), [triangleIndex]);

  const centroid = useMemo(
    () => [
      (sv.A[0] + sv.B[0] + sv.C[0]) / 3,
      (sv.A[1] + sv.B[1] + sv.C[1]) / 3,
    ],
    [sv],
  );

  const sides = useMemo(
    () => [
      {
        v1: sv.A,
        v2: sv.B,
        len: triData.sides[0],
        color: SIDE_COLORS[0],
      },
      {
        v1: sv.B,
        v2: sv.C,
        len: triData.sides[1],
        color: SIDE_COLORS[1],
      },
      {
        v1: sv.A,
        v2: sv.C,
        len: triData.sides[2],
        color: SIDE_COLORS[2],
      },
    ],
    [sv, triData],
  );

  // ── State ──
  const [animPhase, setAnimPhase] = useState("idle");
  const [measured, setMeasured] = useState([false, false, false]);
  const [showComp, setShowComp] = useState(false);
  const [selOpt, setSelOpt] = useState(null);
  const [correct, setCorrect] = useState(false);
  const [showFb, setShowFb] = useState(false);
  const [shake, setShake] = useState(false);

  // ── Refs ──
  const rulerGRef = useRef(null);
  const rulerImgRef = useRef(null);
  const mLineRef = useRef(null);
  const tlRef = useRef(null);
  const measureDoneTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (tlRef.current) tlRef.current.kill();
      if (measureDoneTimeoutRef.current) {
        clearTimeout(measureDoneTimeoutRef.current);
        measureDoneTimeoutRef.current = null;
      }
      if (typeof onAnimatingChange === "function") onAnimatingChange(false);
    };
  }, [onAnimatingChange]);

  // ── Label helpers ──
  const labelPos = (v1, v2, offset) => {
    const mx = (v1[0] + v2[0]) / 2;
    const my = (v1[1] + v2[1]) / 2;
    const dx = mx - centroid[0];
    const dy = my - centroid[1];
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    return { x: mx + (dx / d) * offset, y: my + (dy / d) * offset };
  };

  const labelAngle = (v1, v2) => {
    let a = (Math.atan2(v2[1] - v1[1], v2[0] - v1[0]) * 180) / Math.PI;
    if (a > 90) a -= 180;
    if (a < -90) a += 180;
    return a;
  };

  // ── Ruler animation ──
  const startAnimation = () => {
    const rg = rulerGRef.current;
    const ri = rulerImgRef.current;
    const ml = mLineRef.current;
    if (!rg || !ri || !ml) {
      setAnimPhase("idle");
      return;
    }

    if (typeof onAnimatingChange === "function") onAnimatingChange(true);

    const tl = gsap.timeline({
      onComplete: () => {
        if (typeof onAnimatingChange === "function") onAnimatingChange(false);
        setShowComp(true);
        measureDoneTimeoutRef.current = setTimeout(() => {
          measureDoneTimeoutRef.current = null;
          onMeasurementDone();
        }, 600);
      },
    });

    sides.forEach((side, i) => {
      const { v1, v2, len } = side;
      const dx = v2[0] - v1[0];
      const dy = v2[1] - v1[1];
      const dist = Math.sqrt(dx * dx + dy * dy);
      const aRad = Math.atan2(dy, dx);
      const aDeg = (aRad * 180) / Math.PI;

      const rs = dist / (len * RULER.cm);
      const rW = RULER.w * rs;
      const rH = RULER.h * rs;
      const roX = -RULER.zeroX * rs;

      const roY = 0;

      tl.call(() => {
        rg.setAttribute(
          "transform",
          `translate(${v1[0]}, ${v1[1]}) rotate(${aDeg})`,
        );
        rg.style.display = "block";
        ri.setAttribute("x", roX);
        ri.setAttribute("y", roY);
        ri.setAttribute("width", rW);
        ri.setAttribute("height", rH);
        ml.setAttribute("x1", v1[0]);
        ml.setAttribute("y1", v1[1]);
        ml.setAttribute("x2", v1[0]);
        ml.setAttribute("y2", v1[1]);
        ml.style.display = "block";
      });

      tl.to({}, { duration: 0.3 });

      tl.call(() => {
        if (typeof playSound === "function") playSound("draw");
      });

      tl.to(ml, {
        attr: { x2: v2[0], y2: v2[1] },
        duration: LINE_DRAW_DURATION_SEC,
        ease: "none",
      });

      tl.to({}, { duration: 1 });

      tl.call(() => {
        rg.style.display = "none";
        ml.style.display = "none";
        if (typeof playSound === "function") playSound("tick");
        setMeasured((prev) => {
          const n = [...prev];
          n[i] = true;
          return n;
        });
      });

      if (i < sides.length - 1) tl.to({}, { duration: 0.5 });
    });

    tlRef.current = tl;
  };

  const handleBringScale = () => {
    if (animPhase !== "idle") return;
    if (typeof playSound === "function") playSound("click");
    setAnimPhase("measuring");
    startAnimation();
  };

  // ── MCQ handler ──
  const handleOptionClick = (option) => {
    if (correct) return;
    setSelOpt(option);
    setShowFb(true);

    if (option === triData.answer) {
      setCorrect(true);
      if (typeof playSound === "function") playSound("correct");
      onSetNextEnabled(true);
      const isLast = triangleIndex >= APP_DATA.triangles.length - 1;
      if (isLast) {
        onUpdateTexts(
          APP_DATA.steps[2].navCorrectLast,
          undefined,
          APP_DATA.final.buttonText,
        );
      } else {
        onUpdateTexts(APP_DATA.steps[2].navCorrect);
      }
    } else {
      if (typeof playSound === "function") playSound("wrong");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  // ── Build SVG children ──
  const svgChildren = [];

  // Triangle fill
  svgChildren.push(
    React.createElement("polygon", {
      key: "tri-fill",
      points: `${sv.A[0]},${sv.A[1]} ${sv.B[0]},${sv.B[1]} ${sv.C[0]},${sv.C[1]}`,
      fill: "#FED9AB",
    }),
  );

  // Side strokes
  sides.forEach((s, i) => {
    svgChildren.push(
      React.createElement("line", {
        key: `side-${i}`,
        x1: s.v1[0],
        y1: s.v1[1],
        x2: s.v2[0],
        y2: s.v2[1],
        stroke: s.color,
        strokeWidth: STROKE_W,
        strokeLinecap: "round",
      }),
    );
  });

  // Center text: "?" or triangle type name when answered correctly
  if (correct && triData.typeName) {
    const lines = triData.typeName;
    const tspans = lines.map((line, idx) =>
      React.createElement(
        "tspan",
        {
          key: `tn-${idx}`,
          x: centroid[0],
          dy: idx === 0 ? 0 : "1.2em",
        },
        line,
      ),
    );
    svgChildren.push(
      React.createElement(
        "text",
        {
          key: "type-name",
          x: centroid[0],
          y: centroid[1],
          textAnchor: "middle",
          dominantBaseline: "central",
          fill: "black",
          fontSize: 20,
          fontWeight: "bold",
        },
        ...tspans,
      ),
    );
  } else {
    svgChildren.push(
      React.createElement(
        "text",
        {
          key: "q-mark",
          x: centroid[0],
          y: centroid[1] + 10,
          textAnchor: "middle",
          dominantBaseline: "central",
          fill: "black",
          fontSize: 28,
          fontWeight: "bold",
        },
        "?",
      ),
    );
  }

  // Side labels (after measurement)
  sides.forEach((s, i) => {
    if (!measured[i]) return;
    const lp = labelPos(s.v1, s.v2, LABEL_OFFSET);
    const la = labelAngle(s.v1, s.v2);
    svgChildren.push(
      React.createElement(
        "text",
        {
          key: `lbl-${i}`,
          x: lp.x,
          y: lp.y,
          textAnchor: "middle",
          dominantBaseline: "central",
          fill: "white",
          fontSize: 18,
          fontWeight: "bold",
          transform: `rotate(${la}, ${lp.x}, ${lp.y})`,
          stroke: "rgba(0,0,0,0.6)",
          strokeWidth: 0.4,
          paintOrder: "stroke",
        },
        `${s.len} cm`,
      ),
    );
  });

  // Measurement line (for animation, rendered before ruler so ruler is on top)
  svgChildren.push(
    React.createElement("line", {
      key: "m-line",
      ref: mLineRef,
      stroke: "white",
      strokeWidth: 3,
      strokeLinecap: "round",
      style: { display: "none" },
    }),
  );

  // Ruler group
  svgChildren.push(
    React.createElement(
      "g",
      { key: "ruler-g", ref: rulerGRef, style: { display: "none" } },
      React.createElement("image", {
        ref: rulerImgRef,
        href: "assets/ruler.svg",
      }),
    ),
  );

  // ── Left panel ──
  const leftPanel = React.createElement(
    "div",
    { className: "canvas-left-panel" },
    React.createElement(
      "div",
      { className: "svg-card" },
      React.createElement(
        "svg",
        {
          viewBox: `0 0 ${SVG_W} ${SVG_H}`,
          className: "triangle-svg",
          xmlns: "http://www.w3.org/2000/svg",
        },
        ...svgChildren,
      ),
    ),
    React.createElement(
      "div",
      {
        className: "length-comp-text",
        style: { opacity: showComp ? 1 : 0, transition: "opacity 0.4s ease" },
      },
      triData.compText,
    ),
  );

  // ── Right panel ──
  let rightContent = null;

  if (step === 1) {
    rightContent = React.createElement(
      "div",
      { className: "right-panel-center" },
      React.createElement(
        "button",
        {
          className: "action-btn bring-scale-btn",
          onClick: handleBringScale,
          disabled: animPhase !== "idle",
        },
        APP_DATA.steps[1].actionButton,
      ),
    );
  } else if (step === 2) {
    rightContent = React.createElement(MCQPanel, {
      mcqData: {
        options: APP_DATA.mcqOptions,
        feedbacks: triData.feedbacks,
      },
      selectedOption: selOpt,
      isCorrect: correct,
      onOptionClick: handleOptionClick,
      showFeedback: showFb,
      shake: shake,
    });
  }

  const rightPanel = React.createElement(
    "div",
    { className: "canvas-right-panel" },
    rightContent,
  );

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    leftPanel,
    rightPanel,
  );
};
