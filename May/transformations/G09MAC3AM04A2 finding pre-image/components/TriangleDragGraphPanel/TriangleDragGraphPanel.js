const TRI_GRAPH_CONFIG = {
  cols: 13,
  rows: 9,
  unit: 44,
  padLeft: 40,
  padRight: 40,
  padTop: 28,
  padBottom: 32,
  xLabelFontSize: 18,
  yLabelFontSize: 18,
  axisNameFontSize: 18,
  pointRadius: 9,
  pointLabelFontSize: 21,
  pointLabelOffsetY: 21,
  pointLabelGapBelow: 12,
};

const TRI_WRONG_PAUSE = 600;
const TRI_SNAP_BACK_DURATION = 650;
const TRI_ORIGINAL_COLOR = "#c9a0e8";

const TriangleDragGraphPanel = ({
  vertices,
  offset,
  figureColor,
  dragEnabled,
  snapBackActive,
  onDragMove,
  onFigureDrop,
  onSnapBackComplete,
}) => {
  const { useRef, useCallback, useMemo, useState, useEffect } = React;

  const svgRef = useRef(null);
  const grabOffsetRef = useRef({ x: 0, y: 0 });
  const dragOffsetRef = useRef({ dx: 0, dy: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ dx: 0, dy: 0 });
  const [snapAnim, setSnapAnim] = useState(null);

  const {
    cols: COLS,
    rows: ROWS,
    unit: UNIT,
    padLeft: PAD_LEFT,
    padRight: PAD_RIGHT,
    padTop: PAD_TOP,
    padBottom: PAD_BOTTOM,
    xLabelFontSize,
    yLabelFontSize,
    axisNameFontSize,
    pointRadius,
    pointLabelFontSize,
    pointLabelOffsetY,
    pointLabelGapBelow,
  } = TRI_GRAPH_CONFIG;

  const GRID_W = COLS * UNIT;
  const GRID_H = ROWS * UNIT;
  const SVG_W = PAD_LEFT + GRID_W + PAD_RIGHT;
  const SVG_H = PAD_TOP + GRID_H + PAD_BOTTOM;
  const ORIGIN_X = PAD_LEFT + UNIT;
  const ORIGIN_Y = PAD_TOP + (ROWS - 1) * UNIT;

  const GRID_COLOR = "#3a6d8c";
  const AXIS_COLOR = "#ffffff";
  const BG_COLOR = "#0a1520";
  const GHOST_COLOR = "#9aa8b3";

  const toSvg = useCallback(
    (gx, gy) => ({
      x: ORIGIN_X + gx * UNIT,
      y: ORIGIN_Y - gy * UNIT,
    }),
    [ORIGIN_X, ORIGIN_Y, UNIT],
  );

  const clientToGrid = useCallback(
    (clientX, clientY) => {
      const svg = svgRef.current;
      if (!svg) return null;
      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return null;
      const svgP = pt.matrixTransform(ctm.inverse());
      return {
        x: (svgP.x - ORIGIN_X) / UNIT,
        y: (ORIGIN_Y - svgP.y) / UNIT,
      };
    },
    [ORIGIN_X, ORIGIN_Y, UNIT],
  );

  const clampOffset = useCallback(
    (dx, dy) => {
      let minDx = -Infinity;
      let maxDx = Infinity;
      let minDy = -Infinity;
      let maxDy = Infinity;
      vertices.forEach((v) => {
        minDx = Math.max(minDx, -v.x);
        maxDx = Math.min(maxDx, 11 - v.x);
        minDy = Math.max(minDy, -v.y);
        maxDy = Math.min(maxDy, 7 - v.y);
      });
      return {
        dx: Math.max(minDx, Math.min(maxDx, Math.round(dx))),
        dy: Math.max(minDy, Math.min(maxDy, Math.round(dy))),
      };
    },
    [vertices],
  );

  useEffect(() => {
    dragOffsetRef.current = dragOffset;
  }, [dragOffset]);

  useEffect(() => {
    if (!snapBackActive) {
      setSnapAnim(null);
      return undefined;
    }

    const startDx = offset.dx;
    const startDy = offset.dy;

    let rafId = null;
    let pauseTimer = null;

    const runAnimation = () => {
      const startTime = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - startTime) / TRI_SNAP_BACK_DURATION);
        const eased = 1 - Math.pow(1 - t, 3);
        const lerp = (a, b) => a + (b - a) * eased;
        setSnapAnim({
          dx: lerp(startDx, 0),
          dy: lerp(startDy, 0),
          color: TRI_ORIGINAL_COLOR,
        });
        if (t < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          setSnapAnim(null);
          if (typeof onSnapBackComplete === "function") onSnapBackComplete();
        }
      };
      rafId = requestAnimationFrame(tick);
    };

    pauseTimer = setTimeout(runAnimation, TRI_WRONG_PAUSE);

    return () => {
      clearTimeout(pauseTimer);
      if (rafId) cancelAnimationFrame(rafId);
      setSnapAnim(null);
    };
  }, [snapBackActive, offset.dx, offset.dy, onSnapBackComplete]);

  useEffect(() => {
    if (!isDragging) return undefined;

    const onMove = (e) => {
      const grid = clientToGrid(e.clientX, e.clientY);
      if (!grid) return;
      const anchor = vertices[0];
      const rawDx = grid.x - grabOffsetRef.current.x - anchor.x;
      const rawDy = grid.y - grabOffsetRef.current.y - anchor.y;
      const snapped = clampOffset(rawDx, rawDy);
      setDragOffset(snapped);
      if (typeof onDragMove === "function") {
        onDragMove(snapped.dx, snapped.dy);
      }
    };

    const onUp = () => {
      const dropped = dragOffsetRef.current;
      if (typeof onFigureDrop === "function") {
        onFigureDrop(dropped.dx, dropped.dy);
      }
      setIsDragging(false);
      setDragOffset({ dx: 0, dy: 0 });
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDragging, vertices, clientToGrid, clampOffset, onDragMove, onFigureDrop]);

  const handlePointerDown = useCallback(
    (e) => {
      if (!dragEnabled) return;
      e.preventDefault();
      e.stopPropagation();
      const grid = clientToGrid(e.clientX, e.clientY);
      if (!grid) return;
      const anchor = vertices[0];
      grabOffsetRef.current = {
        x: grid.x - anchor.x - offset.dx,
        y: grid.y - anchor.y - offset.dy,
      };
      setIsDragging(true);
      setDragOffset({ dx: offset.dx, dy: offset.dy });
    },
    [dragEnabled, vertices, offset, clientToGrid],
  );

  const getLabelPosition = (placement, pos) => {
    if (placement === "below") {
      return {
        x: pos.x,
        y: pos.y + pointRadius + pointLabelGapBelow,
        anchor: "middle",
        baseline: "hanging",
      };
    }
    return {
      x: pos.x,
      y: pos.y - pointLabelOffsetY,
      anchor: "middle",
      baseline: "auto",
    };
  };

  const polygonStr = useCallback(
    (verts, dx, dy) => {
      return verts
        .map((v) => {
          const p = toSvg(v.x + dx, v.y + dy);
          return p.x + "," + p.y;
        })
        .join(" ");
    },
    [toSvg],
  );

  const renderFigure = (dx, dy, color, showLabels, keyPrefix, pointerProps) => {
    const els = [
      React.createElement("polygon", {
        key: keyPrefix + "-poly",
        points: polygonStr(vertices, dx, dy),
        fill: color,
        fillOpacity: 0.5,
        stroke: color,
        strokeWidth: 2.5,
        ...(pointerProps || {}),
      }),
    ];
    vertices.forEach((v, i) => {
      const gx = v.x + dx;
      const gy = v.y + dy;
      const pos = toSvg(gx, gy);
      els.push(
        React.createElement("circle", {
          key: keyPrefix + "-pt-" + i,
          cx: pos.x,
          cy: pos.y,
          r: pointRadius,
          fill: color,
          stroke: "#ffffff",
          strokeWidth: 1.5,
          pointerEvents: "none",
        }),
      );
      if (showLabels) {
        const labelPos = getLabelPosition(v.labelPlacement || "above", pos);
        els.push(
          React.createElement(
            "text",
            {
              key: keyPrefix + "-lbl-" + i,
              x: labelPos.x,
              y: labelPos.y,
              fill: color,
              fontSize: pointLabelFontSize,
              fontWeight: "700",
              textAnchor: labelPos.anchor,
              dominantBaseline: labelPos.baseline,
              fontFamily: "system-ui, sans-serif",
              pointerEvents: "none",
            },
            "(" + gx + "," + gy + ")",
          ),
        );
      }
    });
    return React.createElement(
      "g",
      { key: keyPrefix, opacity: keyPrefix === "ghost" ? 0.3 : 1 },
      els,
    );
  };

  const gridLines = useMemo(() => {
    const els = [];
    const gridRight = PAD_LEFT + GRID_W;
    const gridBottom = PAD_TOP + GRID_H;
    for (let c = 0; c <= COLS; c++) {
      const x = PAD_LEFT + c * UNIT;
      els.push(
        React.createElement("line", {
          key: "vc-" + c,
          x1: x,
          y1: PAD_TOP,
          x2: x,
          y2: gridBottom,
          stroke: GRID_COLOR,
          strokeWidth: 1,
        }),
      );
    }
    for (let r = 0; r <= ROWS; r++) {
      const y = PAD_TOP + r * UNIT;
      els.push(
        React.createElement("line", {
          key: "hr-" + r,
          x1: PAD_LEFT,
          y1: y,
          x2: gridRight,
          y2: y,
          stroke: GRID_COLOR,
          strokeWidth: 1,
        }),
      );
    }
    return els;
  }, [COLS, ROWS, UNIT, PAD_LEFT, PAD_TOP, GRID_W, GRID_H]);

  const axisLabels = useMemo(() => {
    const els = [];
    const gridRight = PAD_LEFT + GRID_W;
    for (let i = 1; i <= 11; i++) {
      const px = ORIGIN_X + i * UNIT;
      els.push(
        React.createElement(
          "text",
          {
            key: "xl-" + i,
            x: px,
            y: ORIGIN_Y + 28,
            fill: AXIS_COLOR,
            fontSize: xLabelFontSize,
            fontWeight: "600",
            textAnchor: "middle",
            fontFamily: "system-ui, sans-serif",
          },
          String(i),
        ),
      );
    }
    for (let i = 1; i <= 7; i++) {
      const py = ORIGIN_Y - i * UNIT;
      els.push(
        React.createElement(
          "text",
          {
            key: "yl-" + i,
            x: ORIGIN_X - 24,
            y: py + 6,
            fill: AXIS_COLOR,
            fontSize: yLabelFontSize,
            fontWeight: "600",
            textAnchor: "middle",
            fontFamily: "system-ui, sans-serif",
          },
          String(i),
        ),
      );
    }
    els.push(
      React.createElement(
        "text",
        {
          key: "origin-o",
          x: ORIGIN_X - 20,
          y: ORIGIN_Y + 24,
          fill: AXIS_COLOR,
          fontSize: axisNameFontSize,
          fontWeight: "700",
          textAnchor: "middle",
          fontFamily: "system-ui, sans-serif",
        },
        "O",
      ),
    );
    els.push(
      React.createElement(
        "text",
        {
          key: "axis-x",
          x: gridRight + 10,
          y: ORIGIN_Y + 6,
          fill: AXIS_COLOR,
          fontSize: axisNameFontSize,
          fontWeight: "700",
          textAnchor: "middle",
          fontFamily: "system-ui, sans-serif",
        },
        "X",
      ),
    );
    els.push(
      React.createElement(
        "text",
        {
          key: "axis-y",
          x: ORIGIN_X - 4,
          y: PAD_TOP - 8,
          fill: AXIS_COLOR,
          fontSize: axisNameFontSize,
          fontWeight: "700",
          textAnchor: "middle",
          fontFamily: "system-ui, sans-serif",
        },
        "Y",
      ),
    );
    return els;
  }, [
    ORIGIN_X,
    ORIGIN_Y,
    UNIT,
    PAD_LEFT,
    PAD_TOP,
    GRID_W,
    xLabelFontSize,
    yLabelFontSize,
    axisNameFontSize,
  ]);

  const gridRight = PAD_LEFT + GRID_W;
  const activeDx = snapAnim
    ? snapAnim.dx
    : isDragging
      ? dragOffset.dx
      : offset.dx;
  const activeDy = snapAnim
    ? snapAnim.dy
    : isDragging
      ? dragOffset.dy
      : offset.dy;
  const activeColor = snapAnim ? snapAnim.color : figureColor;
  const showActiveLabels = !snapAnim;
  const showGhost =
    isDragging || offset.dx !== 0 || offset.dy !== 0 || !!snapAnim;
  const cursorStyle = isDragging
    ? "grabbing"
    : dragEnabled
      ? "grab"
      : "default";

  const figureCentroid = useCallback(
    (dx, dy) => {
      let sx = 0;
      let sy = 0;
      vertices.forEach((v) => {
        sx += v.x + dx;
        sy += v.y + dy;
      });
      return { x: sx / vertices.length, y: sy / vertices.length };
    },
    [vertices],
  );

  const showFigureDragNudge = dragEnabled && !isDragging;
  const figureNudgeFrom = showFigureDragNudge ? figureCentroid(0, 0) : null;
  const figureNudgeTo = showFigureDragNudge ? figureCentroid(-4, 2) : null;

  return React.createElement(
    "div",
    { className: "graph-panel graph-panel-step4 figure-graph-panel" },
    React.createElement(
      "svg",
      {
        ref: svgRef,
        className: "graph-coordinate-svg",
        viewBox: "0 0 " + SVG_W + " " + SVG_H,
        preserveAspectRatio: "xMidYMid meet",
        style: { cursor: cursorStyle },
      },
      React.createElement("rect", {
        x: 0,
        y: 0,
        width: SVG_W,
        height: SVG_H,
        fill: BG_COLOR,
        rx: 8,
      }),
      React.createElement(
        "defs",
        null,
        React.createElement(
          "marker",
          {
            id: "tri-arrow-end",
            markerWidth: 8,
            markerHeight: 8,
            refX: 6,
            refY: 3,
            orient: "auto",
            markerUnits: "strokeWidth",
          },
          React.createElement("path", {
            d: "M0,0 L6,3 L0,6 z",
            fill: AXIS_COLOR,
          }),
        ),
        React.createElement(
          "marker",
          {
            id: "tri-arrow-start",
            markerWidth: 8,
            markerHeight: 8,
            refX: 0,
            refY: 3,
            orient: "auto-start-reverse",
            markerUnits: "strokeWidth",
          },
          React.createElement("path", {
            d: "M0,0 L6,3 L0,6 z",
            fill: AXIS_COLOR,
          }),
        ),
      ),
      gridLines,
      React.createElement("line", {
        x1: ORIGIN_X - 14,
        y1: ORIGIN_Y,
        x2: gridRight + 6,
        y2: ORIGIN_Y,
        stroke: AXIS_COLOR,
        strokeWidth: 2,
        markerStart: "url(#tri-arrow-start)",
        markerEnd: "url(#tri-arrow-end)",
      }),
      React.createElement("line", {
        x1: ORIGIN_X,
        y1: ORIGIN_Y + 14,
        x2: ORIGIN_X,
        y2: PAD_TOP - 4,
        stroke: AXIS_COLOR,
        strokeWidth: 2,
        markerStart: "url(#tri-arrow-start)",
        markerEnd: "url(#tri-arrow-end)",
      }),
      axisLabels,
      showGhost
        ? renderFigure(0, 0, GHOST_COLOR, true, "ghost", {
            pointerEvents: "none",
          })
        : null,
      renderFigure(
        activeDx,
        activeDy,
        activeColor,
        showActiveLabels,
        "active",
        dragEnabled && !isDragging && !snapBackActive
          ? {
              style: { cursor: "grab" },
              onMouseDown: handlePointerDown,
            }
          : { pointerEvents: dragEnabled ? "all" : "none" },
      ),
    ),
    showFigureDragNudge && figureNudgeFrom && figureNudgeTo
      ? React.createElement(DragPathNudge, {
          show: true,
          svgRef: svgRef,
          fromGrid: figureNudgeFrom,
          toGrid: figureNudgeTo,
          originX: ORIGIN_X,
          originY: ORIGIN_Y,
          unit: UNIT,
        })
      : null,
  );
};
