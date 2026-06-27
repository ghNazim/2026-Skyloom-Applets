const FIGURE_GRAPH_CONFIG = {
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

const FIGURE_WRONG_PAUSE = 600;
const FIGURE_SNAP_BACK_DURATION = 650;

const FigureGraphPanel = ({
  originalVertices,
  polygonOrder,
  placedPoints,
  showGreenPolygon,
  draggablePointId,
  vertexLabels,
  wrongPoint,
  onPointDrop,
  onSnapBackComplete,
}) => {
  const { useRef, useCallback, useMemo, useState, useEffect } = React;

  const svgRef = useRef(null);
  const grabOffsetRef = useRef({ x: 0, y: 0 });
  const dragPosRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPos, setDragPos] = useState(null);
  const [wrongSnapAnim, setWrongSnapAnim] = useState(null);

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
  } = FIGURE_GRAPH_CONFIG;

  const GRID_W = COLS * UNIT;
  const GRID_H = ROWS * UNIT;
  const SVG_W = PAD_LEFT + GRID_W + PAD_RIGHT;
  const SVG_H = PAD_TOP + GRID_H + PAD_BOTTOM;
  const ORIGIN_X = PAD_LEFT + UNIT;
  const ORIGIN_Y = PAD_TOP + (ROWS - 1) * UNIT;

  const GRID_COLOR = "#3a6d8c";
  const AXIS_COLOR = "#ffffff";
  const BG_COLOR = "#0a1520";
  const PURPLE = "#c9a0e8";
  const GREEN = "#5cb85c";

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

  const snapGrid = useCallback((gx, gy) => {
    const x = Math.max(0, Math.min(11, Math.round(gx)));
    const y = Math.max(0, Math.min(7, Math.round(gy)));
    return { x: x, y: y };
  }, []);

  useEffect(() => {
    dragPosRef.current = dragPos;
  }, [dragPos]);

  useEffect(() => {
    if (!wrongPoint || !wrongPoint.snapBackTo) {
      setWrongSnapAnim(null);
      return undefined;
    }

    const startX = wrongPoint.x;
    const startY = wrongPoint.y;
    const endX = wrongPoint.snapBackTo.x;
    const endY = wrongPoint.snapBackTo.y;

    let rafId = null;
    let pauseTimer = null;

    const runAnimation = () => {
      const startTime = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - startTime) / FIGURE_SNAP_BACK_DURATION);
        const eased = 1 - Math.pow(1 - t, 3);
        const lerp = (a, b) => a + (b - a) * eased;
        setWrongSnapAnim({
          x: lerp(startX, endX),
          y: lerp(startY, endY),
          color: PURPLE,
        });
        if (t < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          setWrongSnapAnim(null);
          if (typeof onSnapBackComplete === "function") onSnapBackComplete();
        }
      };
      rafId = requestAnimationFrame(tick);
    };

    pauseTimer = setTimeout(runAnimation, FIGURE_WRONG_PAUSE);

    return () => {
      clearTimeout(pauseTimer);
      if (rafId) cancelAnimationFrame(rafId);
      setWrongSnapAnim(null);
    };
  }, [wrongPoint, onSnapBackComplete]);

  useEffect(() => {
    if (!isDragging || !draggablePointId) return undefined;

    const onMove = (e) => {
      const grid = clientToGrid(e.clientX, e.clientY);
      if (!grid) return;
      const snapped = snapGrid(
        grid.x - grabOffsetRef.current.x,
        grid.y - grabOffsetRef.current.y,
      );
      setDragPos(snapped);
    };

    const onUp = (e) => {
      const grid = clientToGrid(e.clientX, e.clientY);
      let dropped = dragPosRef.current;
      if (grid) {
        dropped = snapGrid(
          grid.x - grabOffsetRef.current.x,
          grid.y - grabOffsetRef.current.y,
        );
      }
      if (dropped && typeof onPointDrop === "function") {
        onPointDrop(draggablePointId, dropped.x, dropped.y);
      }
      setIsDragging(false);
      setDragPos(null);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [
    isDragging,
    draggablePointId,
    clientToGrid,
    snapGrid,
    onPointDrop,
  ]);

  const handlePointPointerDown = useCallback(
    (pointId, e) => {
      if (pointId !== draggablePointId || !originalVertices[pointId]) return;
      e.preventDefault();
      e.stopPropagation();
      const grid = clientToGrid(e.clientX, e.clientY);
      if (!grid) return;
      const origin = originalVertices[pointId];
      grabOffsetRef.current = {
        x: grid.x - origin.x,
        y: grid.y - origin.y,
      };
      setIsDragging(true);
      setDragPos({ x: origin.x, y: origin.y });
    },
    [draggablePointId, originalVertices, clientToGrid],
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

  const renderVertexPoint = (pt, keyPrefix, extra, groupExtra) => {
    const pos = toSvg(pt.x, pt.y);
    const labelPos = getLabelPosition(pt.labelPlacement || "above", pos);
    const els = [
      React.createElement("circle", {
        key: keyPrefix + "-circle",
        cx: pos.x,
        cy: pos.y,
        r: pointRadius,
        fill: pt.color,
        stroke: "#ffffff",
        strokeWidth: 1.5,
        ...(extra || {}),
      }),
    ];
    if (pt.label) {
      els.push(
        React.createElement(
          "text",
          {
            key: keyPrefix + "-label",
            x: labelPos.x,
            y: labelPos.y,
            fill: pt.color,
            fontSize: pointLabelFontSize,
            fontWeight: "700",
            textAnchor: labelPos.anchor,
            dominantBaseline: labelPos.baseline,
            fontFamily: "system-ui, sans-serif",
            className: "fg-vertex-label",
            pointerEvents: "none",
          },
          pt.label,
        ),
      );
    }
    return React.createElement(
      "g",
      { key: keyPrefix, ...(groupExtra || {}) },
      els,
    );
  };

  const polygonPointsStr = useCallback(
    (vertices, order) => {
      return order
        .map((id) => {
          const v = vertices[id];
          const p = toSvg(v.x, v.y);
          return p.x + "," + p.y;
        })
        .join(" ");
    },
    [toSvg],
  );

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
  const order = polygonOrder || ["A", "B", "C", "D"];
  const placedMap = {};
  (placedPoints || []).forEach((pt) => {
    placedMap[pt.id] = { x: pt.x, y: pt.y };
  });

  const cursorStyle = isDragging
    ? "grabbing"
    : draggablePointId
      ? "grab"
      : "default";

  const labelPlacementFor = (id) =>
    id === "A" || id === "B" ? "above" : "below";

  const renderOriginalVertex = (id, isDraggable) => {
    const v = originalVertices[id];
    if (!v) return null;
    return renderVertexPoint(
      {
        x: v.x,
        y: v.y,
        color: PURPLE,
        label: vertexLabels[id] || id,
        labelPlacement: labelPlacementFor(id),
      },
      "orig-" + id,
      isDraggable
        ? {
            style: { cursor: "grab" },
            onMouseDown: (e) => handlePointPointerDown(id, e),
          }
        : { pointerEvents: "none" },
    );
  };

  const inactiveOrigins = order.filter(
    (id) => id !== draggablePointId || isDragging,
  );
  const activeDragId =
    draggablePointId && !isDragging ? draggablePointId : null;

  const wrongPointDisplay = wrongPoint
    ? {
        x: wrongSnapAnim ? wrongSnapAnim.x : wrongPoint.x,
        y: wrongSnapAnim ? wrongSnapAnim.y : wrongPoint.y,
        color: wrongSnapAnim ? wrongSnapAnim.color : "#e74c3c",
        label: wrongSnapAnim ? null : wrongPoint.label,
        labelPlacement: wrongPoint.labelPlacement || "above",
      }
    : null;

  const showPointDragNudge =
    draggablePointId === "A" && !isDragging;
  const dragNudgeFrom =
    showPointDragNudge && originalVertices.A
      ? { x: originalVertices.A.x, y: originalVertices.A.y }
      : null;
  const dragNudgeTo = showPointDragNudge
    ? { x: originalVertices.A.x + 5, y: originalVertices.A.y - 2 }
    : null;

  const renderBlinkRing = (id) => {
    const v = originalVertices[id];
    if (!v) return null;
    const pos = toSvg(v.x, v.y);
    return React.createElement("circle", {
      key: "blink-" + id,
      cx: pos.x,
      cy: pos.y,
      r: pointRadius + 10,
      className: "draggable-blink-ring",
      fill: "none",
      stroke: "#ffffff",
      strokeWidth: 2,
      pointerEvents: "none",
    });
  };

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
            id: "fg-arrow-end",
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
            id: "fg-arrow-start",
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
        markerStart: "url(#fg-arrow-start)",
        markerEnd: "url(#fg-arrow-end)",
      }),
      React.createElement("line", {
        x1: ORIGIN_X,
        y1: ORIGIN_Y + 14,
        x2: ORIGIN_X,
        y2: PAD_TOP - 4,
        stroke: AXIS_COLOR,
        strokeWidth: 2,
        markerStart: "url(#fg-arrow-start)",
        markerEnd: "url(#fg-arrow-end)",
      }),
      axisLabels,
      React.createElement("polygon", {
        points: polygonPointsStr(originalVertices, order),
        fill: PURPLE,
        fillOpacity: 0.5,
        stroke: PURPLE,
        strokeWidth: 2.5,
      }),
      showGreenPolygon && Object.keys(placedMap).length === 4
        ? React.createElement("polygon", {
            points: polygonPointsStr(placedMap, order),
            fill: GREEN,
            fillOpacity: 0.5,
            stroke: GREEN,
            strokeWidth: 2.5,
          })
        : null,
      inactiveOrigins.map((id) => renderOriginalVertex(id, false)),
      (placedPoints || []).map((pt) =>
        renderVertexPoint(
          pt,
          "placed-" + pt.id,
          { pointerEvents: "none" },
          { pointerEvents: "none" },
        ),
      ),
      wrongPointDisplay
        ? renderVertexPoint(
            wrongPointDisplay,
            "wrong",
            { pointerEvents: "none" },
            { pointerEvents: "none" },
          )
        : null,
      isDragging && dragPos
        ? renderVertexPoint(
            {
              x: dragPos.x,
              y: dragPos.y,
              color: "#f4d03f",
            },
            "drag",
            { pointerEvents: "none" },
            { pointerEvents: "none" },
          )
        : null,
      activeDragId ? renderBlinkRing(activeDragId) : null,
      activeDragId ? renderOriginalVertex(activeDragId, true) : null,
    ),
    showPointDragNudge && dragNudgeFrom && dragNudgeTo
      ? React.createElement(DragPathNudge, {
          show: true,
          svgRef: svgRef,
          fromGrid: dragNudgeFrom,
          toGrid: dragNudgeTo,
          originX: ORIGIN_X,
          originY: ORIGIN_Y,
          unit: UNIT,
        })
      : null,
  );
};
