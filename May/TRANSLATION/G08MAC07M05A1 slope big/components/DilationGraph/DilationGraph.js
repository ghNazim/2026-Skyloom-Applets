const DilationGraph = (props) => {
  const { useMemo, useCallback, useRef, useEffect, useState } = React;
  const {
    center,
    triangle,
    dilationK = 1,
    showDilated = false,
    centerDraggable = false,
    onCenterChange,
    onKChange,
    onKDragStart,
    onKRelease,
    kMin = 0.1,
    kMax = 2,
  } = props;

  const svgRef = useRef(null);
  const draggingCenterRef = useRef(false);
  const draggingSliderRef = useRef(false);
  const animFrameRef = useRef(null);
  const animFromRef = useRef([]);
  const animToRef = useRef([]);
  const centerRef = useRef(center);
  const dilationKRef = useRef(dilationK);
  const pendingKRef = useRef(dilationK);

  const [interactionPhase, setInteractionPhase] = useState("idle");
  const [animProgress, setAnimProgress] = useState(0);
  const [sliderValue, setSliderValue] = useState(dilationK);

  centerRef.current = center;
  dilationKRef.current = dilationK;

  const GRID_COLOR = "#1a4b6d";
  const PRE_IMAGE_FILL = "rgba(52, 152, 219, 0.55)";
  const IMAGE_FILL = "rgba(160, 100, 55, 0.9)";
  const WHITE = "#ffffff";
  const GREEN = "#2ecc71";
  const YELLOW = "#f1c40f";

  const PAD = 38;
  const UNIT = 38;
  const PLOT_W = DILATION_GRID_COLS * UNIT;
  const PLOT_H = DILATION_GRID_ROWS * UNIT;
  const SVG_W = PAD * 2 + PLOT_W;
  const SVG_H = PAD * 2 + PLOT_H + 8;

  const toSvg = useCallback(
    (mx, my) => ({
      x: PAD + mx * UNIT,
      y: PAD + (DILATION_GRID_ROWS - my) * UNIT,
    }),
    [PAD, UNIT],
  );

  const fromSvg = useCallback(
    (sx, sy) => ({
      x: (sx - PAD) / UNIT,
      y: DILATION_GRID_ROWS - (sy - PAD) / UNIT,
    }),
    [PAD, UNIT],
  );

  const dilatedTriangle = useMemo(
    () => triangle.map((p) => dilatePoint(p, center, dilationK)),
    [triangle, center, dilationK],
  );

  const centerPt = toSvg(center.x, center.y);
  const triSvg = triangle.map((p) => toSvg(p.x, p.y));
  const dilSvg = dilatedTriangle.map((p) => toSvg(p.x, p.y));

  const pointsToPath = (pts) =>
    "M " +
    pts.map((p, i) => (i === 0 ? "" : "L ") + p.x + "," + p.y).join(" ") +
    " Z";

  const triPath = pointsToPath(triSvg);
  const dilPath = pointsToPath(dilSvg);

  const showDilatedVisual =
    showDilated || interactionPhase === "animating";

  const showDilatedRays =
    showDilated && interactionPhase === "idle";

  const gridEls = useMemo(() => {
    const els = [];
    for (let i = 0; i <= DILATION_GRID_COLS; i++) {
      const x = PAD + i * UNIT;
      els.push(
        React.createElement("line", {
          key: "gv-" + i,
          x1: x,
          y1: 0,
          x2: x,
          y2: SVG_H,
          stroke: GRID_COLOR,
          strokeWidth: 1,
        }),
      );
    }
    [0, SVG_W].forEach((x, i) => {
      els.push(
        React.createElement("line", {
          key: "gv-edge-" + i,
          x1: x,
          y1: 0,
          x2: x,
          y2: SVG_H,
          stroke: GRID_COLOR,
          strokeWidth: 1,
        }),
      );
    });
    for (let j = 0; j <= DILATION_GRID_ROWS; j++) {
      const y = PAD + j * UNIT;
      els.push(
        React.createElement("line", {
          key: "gh-" + j,
          x1: 0,
          y1: y,
          x2: SVG_W,
          y2: y,
          stroke: GRID_COLOR,
          strokeWidth: 1,
        }),
      );
    }
    return els;
  }, [PAD, UNIT, SVG_W, SVG_H, GRID_COLOR]);

  const renderRayLines = () => {
    const lines = [];
    for (let i = 0; i < triangle.length; i++) {
      const orig = triSvg[i];
      lines.push(
        React.createElement("line", {
          key: "ray-" + i,
          x1: centerPt.x,
          y1: centerPt.y,
          x2: orig.x,
          y2: orig.y,
          stroke: WHITE,
          strokeWidth: 1.5,
          strokeDasharray: "6 5",
          opacity: 0.9,
        }),
      );
      if (showDilatedRays) {
        const dil = dilSvg[i];
        lines.push(
          React.createElement("line", {
            key: "ray-dil-" + i,
            x1: centerPt.x,
            y1: centerPt.y,
            x2: dil.x,
            y2: dil.y,
            stroke: WHITE,
            strokeWidth: 1.5,
            strokeDasharray: "6 5",
            opacity: 0.9,
          }),
        );
      }
    }
    return lines;
  };

  const cancelCenterAnimation = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  const startReleaseAnimation = useCallback((releaseCenter, releaseK) => {
    cancelCenterAnimation();
    const fromPts = triangle.map((p) => toSvg(p.x, p.y));
    const toPts = triangle
      .map((p) => dilatePoint(p, releaseCenter, releaseK))
      .map((p) => toSvg(p.x, p.y));

    animFromRef.current = fromPts;
    animToRef.current = toPts;
    setInteractionPhase("animating");
    setAnimProgress(0);
    playDilationSweep(DILATION_ANIM_DURATION);

    const startTime = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - startTime) / DILATION_ANIM_DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimProgress(eased);
      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        animFrameRef.current = null;
        setInteractionPhase("idle");
        setAnimProgress(1);
      }
    };
    animFrameRef.current = requestAnimationFrame(tick);
  }, [cancelCenterAnimation, triangle, toSvg]);

  const renderDilatedUnderlay = () => {
    if (!showDilatedVisual) return null;
    if (interactionPhase !== "idle") return null;

    return React.createElement(
      React.Fragment,
      null,
      React.createElement("path", {
        d: dilPath,
        fill: IMAGE_FILL,
        stroke: WHITE,
        strokeWidth: 2.5,
      }),
      dilSvg.map((p, i) =>
        React.createElement("circle", {
          key: "vd-" + i,
          cx: p.x,
          cy: p.y,
          r: 4.5,
          fill: YELLOW,
        }),
      ),
    );
  };

  const renderDilatedOverlay = () => {
    if (interactionPhase !== "animating") return null;

    const from = animFromRef.current;
    const to = animToRef.current;
    if (!from.length || !to.length) return null;
    const clonePts = from.map((p, i) => ({
      x: p.x + (to[i].x - p.x) * animProgress,
      y: p.y + (to[i].y - p.y) * animProgress,
    }));
    return React.createElement(
      React.Fragment,
      null,
      React.createElement("path", {
        d: pointsToPath(clonePts),
        fill: PRE_IMAGE_FILL,
        stroke: WHITE,
        strokeWidth: 2.5,
      }),
      clonePts.map((p, i) =>
        React.createElement("circle", {
          key: "vc-" + i,
          cx: p.x,
          cy: p.y,
          r: 4.5,
          fill: YELLOW,
        }),
      ),
    );
  };

  const safeRange = Math.max(kMax - kMin, 0.001);
  const kPct = ((sliderValue - kMin) / safeRange) * 100;
  const kOnePct = ((1 - kMin) / safeRange) * 100;
  const kMaxLabel = formatDilationThumbValue(kMax);

  const handleKInput = useCallback((e) => {
    const nextK = clampDilationK(e.target.value, kMin, kMax);
    pendingKRef.current = nextK;
    setSliderValue(nextK);
    if (typeof onKChange === "function") onKChange(nextK);
  }, [kMin, kMax, onKChange]);

  const handleKPointerDown = useCallback(() => {
    cancelCenterAnimation();
    draggingSliderRef.current = true;
    pendingKRef.current = sliderValue;
    setInteractionPhase("slider-dragging");
    if (typeof onKDragStart === "function") onKDragStart();
  }, [cancelCenterAnimation, onKDragStart, sliderValue]);

  const handleKPointerUp = useCallback((e) => {
    if (!draggingSliderRef.current) return;
    draggingSliderRef.current = false;
    const releaseK = clampDilationK(
      e && e.target ? e.target.value : pendingKRef.current,
      kMin,
      kMax,
    );
    pendingKRef.current = releaseK;
    setSliderValue(releaseK);
    startReleaseAnimation(centerRef.current, releaseK);
    if (typeof onKRelease === "function") onKRelease(releaseK);
  }, [kMin, kMax, onKRelease, startReleaseAnimation]);

  const getSvgPoint = (clientX, clientY) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    return pt.matrixTransform(ctm.inverse());
  };

  const clampCenter = (mx, my) => ({
    x: Math.max(0.3, Math.min(DILATION_GRID_COLS - 0.3, mx)),
    y: Math.max(0.3, Math.min(DILATION_GRID_ROWS - 0.3, my)),
  });

  const onCenterChangeRef = useRef(onCenterChange);
  onCenterChangeRef.current = onCenterChange;

  const handleCenterPointerDown = (e) => {
    if (!centerDraggable || interactionPhase === "animating") return;
    e.preventDefault();
    cancelCenterAnimation();
    draggingCenterRef.current = true;
    setInteractionPhase("center-dragging");
    setAnimProgress(0);
    playDilationPickup();
    if (typeof onKDragStart === "function") onKDragStart();
  };

  const handlePointerMove = useCallback(
    (e) => {
      if (!draggingCenterRef.current || !centerDraggable) return;
      const svgPt = getSvgPoint(e.clientX, e.clientY);
      if (!svgPt) return;
      const math = fromSvg(svgPt.x, svgPt.y);
      const clamped = clampCenter(math.x, math.y);
      if (typeof onCenterChangeRef.current === "function") {
        onCenterChangeRef.current(clamped);
      }
    },
    [centerDraggable, fromSvg],
  );

  const handlePointerUp = useCallback(() => {
    if (draggingCenterRef.current && centerDraggable) {
      draggingCenterRef.current = false;
      startReleaseAnimation(centerRef.current, dilationKRef.current);
      return;
    }
    draggingCenterRef.current = false;
  }, [centerDraggable, startReleaseAnimation]);

  useEffect(() => {
    if (!centerDraggable) return undefined;
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [centerDraggable, handlePointerMove, handlePointerUp]);

  useEffect(() => {
    if (!centerDraggable) {
      draggingCenterRef.current = false;
    }
  }, [centerDraggable]);

  useEffect(() => {
    if (!draggingSliderRef.current && interactionPhase !== "slider-dragging") {
      setSliderValue(dilationK);
      pendingKRef.current = dilationK;
    }
  }, [dilationK, interactionPhase]);

  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (draggingSliderRef.current) {
        handleKPointerUp({ target: { value: pendingKRef.current } });
      }
    };
    window.addEventListener("pointerup", handleGlobalPointerUp);
    return () => window.removeEventListener("pointerup", handleGlobalPointerUp);
  }, [handleKPointerUp]);

  useEffect(() => () => cancelCenterAnimation(), [cancelCenterAnimation]);

  return React.createElement(
    "div",
    { className: "dilation-graph-panel" },
    React.createElement(
      "div",
      { className: "dilation-graph-row" },
      React.createElement(
        "div",
        { className: "dilation-svg-wrap" },
        React.createElement(
          "svg",
          {
            ref: svgRef,
            viewBox: "0 0 " + SVG_W + " " + SVG_H,
            className: "dilation-coordinate-svg",
            preserveAspectRatio: "xMidYMid meet",
          },
          gridEls,
          renderDilatedUnderlay(),
          React.createElement("path", {
            d: triPath,
            fill: PRE_IMAGE_FILL,
            stroke: WHITE,
            strokeWidth: 2.5,
          }),
          triSvg.map((p, i) =>
            React.createElement("circle", {
              key: "v-" + i,
              cx: p.x,
              cy: p.y,
              r: 4.5,
              fill: YELLOW,
            }),
          ),
          renderDilatedOverlay(),
          renderRayLines(),
          React.createElement("circle", {
            cx: centerPt.x,
            cy: centerPt.y,
            r: centerDraggable ? 9 : 7,
            fill: GREEN,
            stroke: WHITE,
            strokeWidth: 2,
            className:
              centerDraggable && interactionPhase !== "animating"
                ? "dilation-center draggable"
                : "dilation-center",
            onPointerDown: handleCenterPointerDown,
            style:
              centerDraggable && interactionPhase !== "animating"
                ? { cursor: "grab" }
                : undefined,
          }),
          React.createElement(
            "text",
            {
              x: centerPt.x + 12,
              y: centerPt.y + 4,
              fill: WHITE,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "system-ui, sans-serif",
            },
            "O",
          ),
        ),
      ),
    ),
    React.createElement(
      "div",
      { className: "dilation-k-slider-wrap" },
      React.createElement(
        "div",
        { className: "gp-slider-track-wrap horizontal dilation-k-track" },
        React.createElement("div", {
          className: "gp-slider-track-bg horizontal gp-slider-track-active",
          style: { width: "100%" },
        }),
        React.createElement(
          "span",
          { className: "dilation-k-mark dilation-k-mark-0" },
          "0.1",
        ),
        React.createElement(
          "span",
          {
            className: "dilation-k-mark",
            style: { left: kOnePct + "%" },
          },
          "1",
        ),
        React.createElement(
          "span",
          { className: "dilation-k-mark dilation-k-mark-2" },
          kMaxLabel,
        ),
        React.createElement(
          "div",
          {
            className: "gp-slider-thumb horizontal",
            style: { left: kPct + "%" },
          },
          formatDilationThumbValue(sliderValue),
        ),
        React.createElement("input", {
          type: "range",
          className: "gp-range-input",
          min: kMin,
          max: kMax,
          step: 0.01,
          value: sliderValue,
          onPointerDown: handleKPointerDown,
          onInput: handleKInput,
          onChange: handleKInput,
          onPointerUp: handleKPointerUp,
        }),
      ),
    ),
  );
};
