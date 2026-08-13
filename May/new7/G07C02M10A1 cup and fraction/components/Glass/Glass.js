const GLASS_VIEWBOX = 450;

const GLASS_GEOMETRY = {
  cx: 180,
  topY: 100,
  bottomY: 420,
  innerBottomY: 400,
  outerTopRx: 140,
  outerTopRy: 30,
  outerBottomRx: 100,
  outerBottomRy: 20,
  innerTopRx: 130,
  innerTopRy: 25,
  innerBottomRx: 94,
  innerBottomRy: 17,
  waterMaxFillY: 115,
  meterX: 350,
  meterTextX: 380,
};

const GLASS_COLORS = {
  glassTint: "#62b5df",
  innerTint: "#8acae9",
  waterStart: "#3b90b8",
  waterMid: "#4fa5c9",
  waterEnd: "#3789b0",
  surfaceStart: "#7bc7e6",
  surfaceEnd: "#55accf",
  highlight: "#ffffff",
  meterBase: "#1d3f54",
  activeColor: "#f7a01d",
};

const GLASS_FILL_RANGE = GLASS_GEOMETRY.innerBottomY - GLASS_GEOMETRY.waterMaxFillY;

const GLASS_TICK_LABELS = [
  { value: 1, label: "1", fontSize: 30 },
  { value: 0.5, label: "\u00BD", fontSize: 30 },
  { value: 1 / 3, label: "\u2153", fontSize: 30 },
  { value: 0.25, label: "\u00BC", fontSize: 30 },
  { value: 0, label: "0", fontSize: 30 },
];

function glassTickInfo(value) {
  for (let i = 0; i < GLASS_TICK_LABELS.length; i += 1) {
    if (Math.abs(GLASS_TICK_LABELS[i].value - value) < 0.005) return GLASS_TICK_LABELS[i];
  }
  return { value, label: String(value), fontSize: 18 };
}

function glassYForLevel(level) {
  return GLASS_GEOMETRY.innerBottomY - level * GLASS_FILL_RANGE;
}

/** Inner radii of the glass at a given y, so surfaces stay flush with the tapered walls. */
function glassRadiiAtY(y) {
  const gp = GLASS_GEOMETRY;
  const ratio = (gp.innerBottomY - y) / (gp.innerBottomY - gp.topY);
  return {
    rx: gp.innerBottomRx + ratio * (gp.innerTopRx - gp.innerBottomRx),
    ry: gp.innerBottomRy + ratio * (gp.innerTopRy - gp.innerBottomRy),
  };
}

const GLASS_STATIC_PATHS = (() => {
  const gp = GLASS_GEOMETRY;
  return {
    backTint1: `M ${gp.cx - gp.outerTopRx} ${gp.topY} A ${gp.outerTopRx} ${gp.outerTopRy} 0 0 0 ${gp.cx + gp.outerTopRx} ${gp.topY} L ${gp.cx + gp.outerBottomRx} ${gp.bottomY} A ${gp.outerBottomRx} ${gp.outerBottomRy} 0 0 1 ${gp.cx - gp.outerBottomRx} ${gp.bottomY} Z`,
    backTint2: `M ${gp.cx - gp.outerTopRx} ${gp.topY} A ${gp.outerTopRx} ${gp.outerTopRy} 0 0 1 ${gp.cx + gp.outerTopRx} ${gp.topY} L ${gp.cx + gp.outerBottomRx} ${gp.bottomY} A ${gp.outerBottomRx} ${gp.outerBottomRy} 0 0 0 ${gp.cx - gp.outerBottomRx} ${gp.bottomY} Z`,
    backInnerBottom: `M ${gp.cx - gp.innerBottomRx} ${gp.innerBottomY} A ${gp.innerBottomRx} ${gp.innerBottomRy} 0 0 1 ${gp.cx + gp.innerBottomRx} ${gp.innerBottomY}`,
    backOuterBottom: `M ${gp.cx - gp.outerBottomRx} ${gp.bottomY} A ${gp.outerBottomRx} ${gp.outerBottomRy} 0 0 1 ${gp.cx + gp.outerBottomRx} ${gp.bottomY}`,
    backOuterTop: `M ${gp.cx - gp.outerTopRx} ${gp.topY} A ${gp.outerTopRx} ${gp.outerTopRy} 0 0 1 ${gp.cx + gp.outerTopRx} ${gp.topY}`,
    backInnerTop: `M ${gp.cx - gp.innerTopRx} ${gp.topY} A ${gp.innerTopRx} ${gp.innerTopRy} 0 0 1 ${gp.cx + gp.innerTopRx} ${gp.topY}`,
    baseInnerVolume: `M ${gp.cx - gp.innerBottomRx} ${gp.innerBottomY} A ${gp.innerBottomRx} ${gp.innerBottomRy} 0 0 0 ${gp.cx + gp.innerBottomRx} ${gp.innerBottomY} L ${gp.cx + gp.outerBottomRx} ${gp.bottomY} A ${gp.outerBottomRx} ${gp.outerBottomRy} 0 0 1 ${gp.cx - gp.outerBottomRx} ${gp.bottomY} Z`,
    frontOuterBottom: `M ${gp.cx - gp.outerBottomRx} ${gp.bottomY} A ${gp.outerBottomRx} ${gp.outerBottomRy} 0 0 0 ${gp.cx + gp.outerBottomRx} ${gp.bottomY}`,
    frontInnerBottom: `M ${gp.cx - gp.innerBottomRx} ${gp.innerBottomY} A ${gp.innerBottomRx} ${gp.innerBottomRy} 0 0 0 ${gp.cx + gp.innerBottomRx} ${gp.innerBottomY}`,
    frontOuterTop: `M ${gp.cx - gp.outerTopRx} ${gp.topY} A ${gp.outerTopRx} ${gp.outerTopRy} 0 0 0 ${gp.cx + gp.outerTopRx} ${gp.topY}`,
    frontInnerTop: `M ${gp.cx - gp.innerTopRx} ${gp.topY} A ${gp.innerTopRx} ${gp.innerTopRy} 0 0 0 ${gp.cx + gp.innerTopRx} ${gp.topY}`,
    outerLeft: `M ${gp.cx - gp.outerTopRx} ${gp.topY} L ${gp.cx - gp.outerBottomRx} ${gp.bottomY}`,
    outerRight: `M ${gp.cx + gp.outerTopRx} ${gp.topY} L ${gp.cx + gp.outerBottomRx} ${gp.bottomY}`,
    innerLeft: `M ${gp.cx - gp.innerTopRx} ${gp.topY} L ${gp.cx - gp.innerBottomRx} ${gp.innerBottomY}`,
    innerRight: `M ${gp.cx + gp.innerTopRx} ${gp.topY} L ${gp.cx + gp.innerBottomRx} ${gp.innerBottomY}`,
    reflection1: `M ${gp.cx - gp.outerTopRx + 6} ${gp.topY + 15} L ${gp.cx - gp.outerBottomRx + 6} ${gp.bottomY - 15}`,
    reflection2: `M ${gp.cx - gp.outerTopRx + 14} ${gp.topY + 25} L ${gp.cx - gp.outerBottomRx + 11} ${gp.bottomY - 30}`,
    reflection3: `M ${gp.cx + gp.outerTopRx - 6} ${gp.topY + 15} L ${gp.cx + gp.outerBottomRx - 6} ${gp.bottomY - 15}`,
  };
})();

const Glass = ({
  fill = 0,
  fillDuration = 1.1,
  ticks = [0, 1],
  unitLabel = "cup",
  showMeter = true,
  showGuess = false,
  guess = 0,
  guessLabel = null,
  guessPointerId = null,
  onGuessChange = null,
  onGuessRelease = null,
  benchmarkPick = null,
  feedbackMode = null,
  highlightNearWater = true,
  className = "",
}) => {
  const { useState, useEffect, useRef, useCallback, useMemo } = React;
  const h = React.createElement;
  const gp = GLASS_GEOMETRY;

  const svgRef = useRef(null);
  const animLevelRef = useRef({ value: fill });
  const guessHandlersRef = useRef({});
  const [level, setLevel] = useState(fill);
  const [isDragging, setIsDragging] = useState(false);

  const uid = useMemo(() => "glass-" + Math.random().toString(36).slice(2, 9), []);

  guessHandlersRef.current = { onGuessChange, onGuessRelease };

  const playTick = () => {
    if (typeof playSound === "function") playSound("tick");
  };

  useEffect(() => {
    const target = Math.max(0, Math.min(1, fill));
    const anim = animLevelRef.current;
    if (typeof gsap === "undefined" || Math.abs(anim.value - target) < 0.001) {
      anim.value = target;
      setLevel(target);
      return undefined;
    }
    const tween = gsap.to(anim, {
      value: target,
      duration: fillDuration,
      ease: "power1.inOut",
      onUpdate: () => setLevel(anim.value),
    });
    return () => tween.kill();
  }, [fill, fillDuration]);

  const levelFromClientY = useCallback((clientY) => {
    const svg = svgRef.current;
    if (!svg) return 0;
    const rect = svg.getBoundingClientRect();
    const scale = Math.min(rect.width / GLASS_VIEWBOX, rect.height / GLASS_VIEWBOX);
    if (!scale) return 0;
    const offsetY = (rect.height - GLASS_VIEWBOX * scale) / 2;
    const userY = (clientY - rect.top - offsetY) / scale;
    const ratio = (gp.innerBottomY - userY) / GLASS_FILL_RANGE;
    return Math.max(0, Math.min(1, ratio));
  }, [gp.innerBottomY]);

  useEffect(() => {
    if (!isDragging) return undefined;
    const clientYOf = (e) => (e.touches && e.touches.length ? e.touches[0].clientY : e.clientY);
    const onMove = (e) => {
      e.preventDefault();
      const handler = guessHandlersRef.current.onGuessChange;
      if (handler) handler(levelFromClientY(clientYOf(e)));
    };
    const onUp = (e) => {
      const value = levelFromClientY(clientYOf(e));
      setIsDragging(false);
      playTick();
      const handlers = guessHandlersRef.current;
      if (handlers.onGuessChange) handlers.onGuessChange(value);
      if (handlers.onGuessRelease) handlers.onGuessRelease(value);
    };
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [isDragging, levelFromClientY]);

  const startGuessDrag = (e) => {
    if (!showGuess) return;
    e.preventDefault();
    e.stopPropagation();
    playTick();
    const clientY = e.touches && e.touches.length ? e.touches[0].clientY : e.clientY;
    const handler = guessHandlersRef.current.onGuessChange;
    if (handler) handler(levelFromClientY(clientY));
    setIsDragging(true);
  };

  const waterY = glassYForLevel(level);
  const waterRadii = glassRadiiAtY(waterY);
  const hasWater = level > 0.005;
  const waterPath =
    `M ${gp.cx - waterRadii.rx} ${waterY}` +
    ` A ${waterRadii.rx} ${waterRadii.ry} 0 0 1 ${gp.cx + waterRadii.rx} ${waterY}` +
    ` L ${gp.cx + gp.innerBottomRx} ${gp.innerBottomY}` +
    ` A ${gp.innerBottomRx} ${gp.innerBottomRy} 0 0 1 ${gp.cx - gp.innerBottomRx} ${gp.innerBottomY} Z`;

  const guessLevel = Math.max(0, Math.min(1, guess));
  const guessY = glassYForLevel(guessLevel);
  const guessRadii = glassRadiiAtY(guessY);

  const feedbackColor =
    feedbackMode === "correct" ? "#86d06d" : feedbackMode === "wrong" ? "#ff5a52" : null;
  const benchmarkLevel =
    benchmarkPick === null || benchmarkPick === undefined
      ? null
      : Math.max(0, Math.min(1, benchmarkPick));
  const benchmarkY = benchmarkLevel === null ? null : glassYForLevel(benchmarkLevel);

  const renderBenchmarkFeedback = () => {
    if (!feedbackColor || benchmarkY === null) return null;
    const barTop = Math.min(waterY, benchmarkY);
    const barHeight = Math.abs(waterY - benchmarkY);
    return h(
      "g",
      { className: "glass-benchmark-feedback" },
      h("line", {
        x1: 16,
        y1: waterY,
        x2: gp.meterTextX + 36,
        y2: waterY,
        stroke: feedbackColor,
        strokeWidth: 2.5,
        strokeDasharray: "5 5",
      }),
      barHeight > 0.5
        ? h("rect", {
            x: gp.meterX + 8,
            y: barTop,
            width: 16,
            height: barHeight,
            fill: feedbackColor,
            opacity: 0.6,
            rx: 2,
          })
        : null,
    );
  };

  const renderDefs = () =>
    h(
      "defs",
      null,
      h(
        "linearGradient",
        { id: uid + "-water", x1: "0%", y1: "0%", x2: "100%", y2: "0%" },
        h("stop", { offset: "0%", stopColor: GLASS_COLORS.waterStart }),
        h("stop", { offset: "50%", stopColor: GLASS_COLORS.waterMid }),
        h("stop", { offset: "100%", stopColor: GLASS_COLORS.waterEnd }),
      ),
      h(
        "linearGradient",
        { id: uid + "-surface", x1: "0%", y1: "0%", x2: "0%", y2: "100%" },
        h("stop", { offset: "0%", stopColor: GLASS_COLORS.surfaceStart }),
        h("stop", { offset: "100%", stopColor: GLASS_COLORS.surfaceEnd }),
      ),
    );

  const renderBackTint = () =>
    h(
      "g",
      { className: "glass-back-tint" },
      h("path", { d: GLASS_STATIC_PATHS.backTint1, fill: GLASS_COLORS.glassTint, opacity: 0.05 }),
      h("path", { d: GLASS_STATIC_PATHS.backTint2, fill: GLASS_COLORS.glassTint, opacity: 0.05 }),
    );

  const renderBackRims = () =>
    h(
      "g",
      { className: "glass-back-rims" },
      h("path", {
        d: GLASS_STATIC_PATHS.backInnerBottom,
        fill: "none",
        stroke: GLASS_COLORS.innerTint,
        strokeWidth: 2,
        opacity: 0.3,
      }),
      h("path", {
        d: GLASS_STATIC_PATHS.backOuterBottom,
        fill: "none",
        stroke: GLASS_COLORS.glassTint,
        strokeWidth: 2,
        opacity: 0.5,
      }),
      h("path", {
        d: GLASS_STATIC_PATHS.backOuterTop,
        fill: "none",
        stroke: GLASS_COLORS.glassTint,
        strokeWidth: 4,
      }),
      h("path", {
        d: GLASS_STATIC_PATHS.backInnerTop,
        fill: "none",
        stroke: GLASS_COLORS.innerTint,
        strokeWidth: 2,
      }),
    );

  const renderWater = () =>
    h(
      "g",
      { className: "glass-water" },
      h("path", {
        d: waterPath,
        fill: `url(#${uid}-water)`,
        opacity: hasWater ? 0.85 : 0,
      }),
      h("ellipse", {
        cx: gp.cx,
        cy: waterY,
        rx: waterRadii.rx,
        ry: waterRadii.ry,
        fill: `url(#${uid}-surface)`,
        opacity: hasWater ? 0.95 : 0,
      }),
      h("ellipse", {
        cx: gp.cx,
        cy: waterY,
        rx: Math.max(0, waterRadii.rx - 2),
        ry: Math.max(0, waterRadii.ry - 1),
        fill: "none",
        stroke: GLASS_COLORS.highlight,
        strokeWidth: 1.5,
        opacity: hasWater ? 0.4 : 0,
      }),
    );

  const renderBaseVolume = () =>
    h(
      "g",
      { className: "glass-base-volume" },
      h("path", {
        d: GLASS_STATIC_PATHS.baseInnerVolume,
        fill: GLASS_COLORS.glassTint,
        opacity: 0.15,
      }),
      h("ellipse", {
        cx: gp.cx,
        cy: gp.innerBottomY + 7,
        rx: gp.innerBottomRx + 3,
        ry: gp.innerBottomRy + 1.5,
        fill: "none",
        stroke: GLASS_COLORS.glassTint,
        strokeWidth: 2,
        opacity: 0.4,
      }),
      h("ellipse", {
        cx: gp.cx,
        cy: gp.innerBottomY + 14,
        rx: gp.innerBottomRx + 4.5,
        ry: gp.innerBottomRy + 2.5,
        fill: "none",
        stroke: GLASS_COLORS.glassTint,
        strokeWidth: 2,
        opacity: 0.4,
      }),
    );

  const renderFrontRims = () =>
    h(
      "g",
      { className: "glass-front-rims" },
      h("path", {
        d: GLASS_STATIC_PATHS.frontOuterBottom,
        fill: "none",
        stroke: GLASS_COLORS.glassTint,
        strokeWidth: 4,
        strokeLinecap: "round",
      }),
      h("path", {
        d: GLASS_STATIC_PATHS.frontInnerBottom,
        fill: "none",
        stroke: GLASS_COLORS.innerTint,
        strokeWidth: 2,
        strokeLinecap: "round",
      }),
      h("path", {
        d: GLASS_STATIC_PATHS.frontOuterTop,
        fill: "none",
        stroke: GLASS_COLORS.glassTint,
        strokeWidth: 4,
      }),
      h("path", {
        d: GLASS_STATIC_PATHS.frontInnerTop,
        fill: "none",
        stroke: GLASS_COLORS.innerTint,
        strokeWidth: 2,
      }),
    );

  const renderSideWalls = () =>
    h(
      "g",
      { className: "glass-side-walls" },
      h("path", {
        d: GLASS_STATIC_PATHS.outerLeft,
        fill: "none",
        stroke: GLASS_COLORS.glassTint,
        strokeWidth: 4,
        strokeLinecap: "round",
      }),
      h("path", {
        d: GLASS_STATIC_PATHS.outerRight,
        fill: "none",
        stroke: GLASS_COLORS.glassTint,
        strokeWidth: 4,
        strokeLinecap: "round",
      }),
      h("path", {
        d: GLASS_STATIC_PATHS.innerLeft,
        fill: "none",
        stroke: GLASS_COLORS.innerTint,
        strokeWidth: 2,
        strokeLinecap: "round",
        opacity: 0.7,
      }),
      h("path", {
        d: GLASS_STATIC_PATHS.innerRight,
        fill: "none",
        stroke: GLASS_COLORS.innerTint,
        strokeWidth: 2,
        strokeLinecap: "round",
        opacity: 0.7,
      }),
    );

  const renderReflections = () =>
    h(
      "g",
      { className: "glass-reflections" },
      h("path", {
        d: GLASS_STATIC_PATHS.reflection1,
        stroke: "white",
        strokeWidth: 4,
        strokeLinecap: "round",
        opacity: 0.15,
      }),
      h("path", {
        d: GLASS_STATIC_PATHS.reflection2,
        stroke: "white",
        strokeWidth: 1.5,
        strokeLinecap: "round",
        opacity: 0.1,
      }),
      h("path", {
        d: GLASS_STATIC_PATHS.reflection3,
        stroke: "white",
        strokeWidth: 3,
        strokeLinecap: "round",
        opacity: 0.08,
      }),
    );

  const renderMeter = () => {
    if (!showMeter) return null;
    return h(
      "g",
      { className: "glass-meter" },
      h("line", {
        x1: gp.meterX,
        y1: gp.waterMaxFillY,
        x2: gp.meterX,
        y2: gp.innerBottomY,
        stroke: GLASS_COLORS.glassTint,
        strokeWidth: 4,
        strokeLinecap: "round",
      }),
      h(
        "text",
        {
          x: gp.meterTextX - (current_language === "en" ? 12 : 60),
          y: gp.waterMaxFillY - 45,
          fill: "#ffffff",
          fontSize: 30,
          fontWeight: "bold",
        },
        unitLabel,
      ),
      ticks.map((value) => {
        const info = glassTickInfo(value);
        const y = glassYForLevel(value);
        const isEndTick = Math.abs(value) < 0.005 || Math.abs(value - 1) < 0.005;
        const isNearWater = highlightNearWater && Math.abs(level - value) <= 0.03;
        const isPickedBenchmark =
          benchmarkLevel !== null && Math.abs(value - benchmarkLevel) < 0.005;
        let tickFill = "#ffffff";
        if (isPickedBenchmark && feedbackColor) tickFill = feedbackColor;
        else if (isNearWater) tickFill = GLASS_COLORS.activeColor;
        return h(
          "g",
          { key: "tick-" + info.label, className: "glass-meter-tick" },
          h("line", {
            x1: gp.meterX,
            y1: y,
            x2: gp.meterX + (isEndTick ? 20 : 15),
            y2: y,
            stroke: isPickedBenchmark && feedbackColor ? feedbackColor : GLASS_COLORS.glassTint,
            strokeWidth: isPickedBenchmark && feedbackColor ? 3 : 2,
          }),
          h(
            "text",
            {
              className:
                "glass-meter-label" +
                (Math.abs(value - 0.25) < 0.005 ? " glass-meter-label-quarter" : ""),
              x: gp.meterTextX,
              y: y + 6,
              fill: tickFill,
              fontSize: info.fontSize,
              fontWeight: isPickedBenchmark && feedbackColor ? "bold" : "normal",
            },
            info.label,
          ),
        );
      }),
    );
  };

  const renderGuess = () => {
    if (!showGuess) return null;
    return h(
      "g",
      { className: "glass-guess" },
      h("line", {
        x1: 20,
        y1: guessY,
        x2: gp.meterX - 24,
        y2: guessY,
        stroke: GLASS_COLORS.activeColor,
        strokeWidth: 2,
        strokeDasharray: "4 4",
      }),
      guessLabel
        ? h(
            "text",
            {
              className: "glass-guess-label",
              x: gp.cx - guessRadii.rx + 8,
              y: guessY - 12,
              fill: GLASS_COLORS.activeColor,
              fontSize: 22,
              fontWeight: "bold",
            },
            guessLabel,
          )
        : null,
      h("polygon", {
        points: `${gp.meterX - 22},${guessY} ${gp.meterX - 4},${guessY - 11} ${gp.meterX - 4},${guessY + 11}`,
        fill: GLASS_COLORS.activeColor,
      }),
      h("rect", {
        className: "glass-guess-track",
        x: gp.meterX - 16,
        y: gp.waterMaxFillY - 8,
        width: 32,
        height: GLASS_FILL_RANGE + 16,
        fill: "transparent",
        onPointerDown: startGuessDrag,
      }),
      h("rect", {
        id: guessPointerId || undefined,
        className: "glass-guess-handle",
        x: gp.meterX - 30,
        y: guessY - 18,
        width: 46,
        height: 36,
        fill: "transparent",
        onPointerDown: startGuessDrag,
      }),
    );
  };

  return h(
    "div",
    { className: "glass-figure " + className },
    h(
      "svg",
      {
        ref: svgRef,
        className: "glass-svg" + (isDragging ? " glass-svg-dragging" : ""),
        viewBox: `0 0 ${GLASS_VIEWBOX} ${GLASS_VIEWBOX}`,
        preserveAspectRatio: "xMidYMid meet",
      },
      renderDefs(),
      renderBackTint(),
      renderBackRims(),
      renderWater(),
      renderBaseVolume(),
      renderFrontRims(),
      renderSideWalls(),
      renderReflections(),
      renderMeter(),
      renderBenchmarkFeedback(),
      renderGuess(),
    ),
  );
};
