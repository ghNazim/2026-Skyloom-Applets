/* ── Graph layout & style knobs (edit these to tweak the graph) ──
 *
 * cols, rows, unit     — grid size; origin sits 1 unit in from the bottom-left
 *                        corner of the grid area
 * padLeft, padRight    — horizontal padding inside the SVG; keep equal to center
 * padTop, padBottom    — vertical padding inside the SVG
 * xLabelFontSize       — font size for numbers 1–11 below the x-axis
 * yLabelFontSize       — font size for numbers 1–7 beside the y-axis
 * axisNameFontSize     — font size for O, X, Y labels
 * pointRadius          — radius of placed-point circles
 * pointLabelFontSize   — font size for labels above points (e.g. "P (2,1)")
 * pointLabelOffsetY    — how far above the dot the label sits
 */
const GRAPH_CONFIG = {
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
};

const SEGMENT_SNAP_BACK_COLOR = "#f4d03f";
const SEGMENT_SNAP_BACK_DURATION = 650;
const SEGMENT_WRONG_PAUSE = 600;

const GraphPanel = ({
  points,
  segments,
  onGridClick,
  interactive,
  nudgeTarget,
  draggableSegment,
  onSegmentDrop,
  segmentDragEnabled,
    placedClone,
    onSnapBackComplete,
    showDragPathNudge,
  }) => {
  const { useRef, useCallback, useMemo, useState, useEffect } = React;

  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const grabOffsetRef = useRef({ x: 0, y: 0 });
  const dragCloneRef = useRef(null);
  const [nudgeStyle, setNudgeStyle] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragClone, setDragClone] = useState(null);
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
  } = GRAPH_CONFIG;

  const GRID_W = COLS * UNIT;
  const GRID_H = ROWS * UNIT;
  const SVG_W = PAD_LEFT + GRID_W + PAD_RIGHT;
  const SVG_H = PAD_TOP + GRID_H + PAD_BOTTOM;
  const ORIGIN_X = PAD_LEFT + UNIT;
  const ORIGIN_Y = PAD_TOP + (ROWS - 1) * UNIT;

  const GRID_COLOR = "#3a6d8c";
  const AXIS_COLOR = "#ffffff";
  const BG_COLOR = "#0a1520";

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

  const snapSegmentPosition = useCallback((gridX, gridY, delta) => {
    let mX = Math.round(gridX);
    let mY = Math.round(gridY);
    mX = Math.max(0, Math.min(11 - delta.x, mX));
    mY = Math.max(0, Math.min(7 - delta.y, mY));
    return {
      m: { x: mX, y: mY },
      n: { x: mX + delta.x, y: mY + delta.y },
    };
  }, []);

  const updateNudgePosition = useCallback(() => {
    if (!nudgeTarget || !svgRef.current) {
      setNudgeStyle(null);
      return;
    }
    const pos = toSvg(nudgeTarget.x, nudgeTarget.y);
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = pos.x;
    pt.y = pos.y;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const screenPt = pt.matrixTransform(ctm);
    setNudgeStyle({
      left: screenPt.x + "px",
      top: screenPt.y + "px",
    });
  }, [nudgeTarget, toSvg]);

  useEffect(() => {
    updateNudgePosition();
    window.addEventListener("resize", updateNudgePosition);
    return () => window.removeEventListener("resize", updateNudgePosition);
  }, [updateNudgePosition, points, segments, isDragging, dragClone, placedClone]);

  useEffect(() => {
    dragCloneRef.current = dragClone;
  }, [dragClone]);

  useEffect(() => {
    if (!placedClone || !placedClone.snapBackTo) {
      setSnapAnim(null);
      return undefined;
    }

    const startM = { ...placedClone.m };
    const startN = { ...placedClone.n };
    const endM = placedClone.snapBackTo.m;
    const endN = placedClone.snapBackTo.n;

    let rafId = null;
    let pauseTimer = null;

    const runAnimation = () => {
      const startTime = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - startTime) / SEGMENT_SNAP_BACK_DURATION);
        const eased = 1 - Math.pow(1 - t, 3);
        const lerp = (a, b) => a + (b - a) * eased;
        setSnapAnim({
          m: { x: lerp(startM.x, endM.x), y: lerp(startM.y, endM.y) },
          n: { x: lerp(startN.x, endN.x), y: lerp(startN.y, endN.y) },
          color: SEGMENT_SNAP_BACK_COLOR,
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

    pauseTimer = setTimeout(runAnimation, SEGMENT_WRONG_PAUSE);

    return () => {
      clearTimeout(pauseTimer);
      if (rafId) cancelAnimationFrame(rafId);
      setSnapAnim(null);
    };
  }, [placedClone, onSnapBackComplete]);

  useEffect(() => {
    if (!isDragging || !draggableSegment) return undefined;

    const onMove = (e) => {
      const grid = clientToGrid(e.clientX, e.clientY);
      if (!grid) return;
      const snapped = snapSegmentPosition(
        grid.x - grabOffsetRef.current.x,
        grid.y - grabOffsetRef.current.y,
        draggableSegment.delta,
      );
      setDragClone(snapped);
    };

    const onUp = (e) => {
      const grid = clientToGrid(e.clientX, e.clientY);
      if (grid && typeof onSegmentDrop === "function") {
        const snapped = snapSegmentPosition(
          grid.x - grabOffsetRef.current.x,
          grid.y - grabOffsetRef.current.y,
          draggableSegment.delta,
        );
        onSegmentDrop(snapped.m, snapped.n);
      } else if (dragCloneRef.current && typeof onSegmentDrop === "function") {
        onSegmentDrop(dragCloneRef.current.m, dragCloneRef.current.n);
      }
      setIsDragging(false);
      setDragClone(null);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [
    isDragging,
    draggableSegment,
    clientToGrid,
    snapSegmentPosition,
    onSegmentDrop,
  ]);

  const handleSegmentPointerDown = useCallback(
    (e) => {
      if (!segmentDragEnabled || !draggableSegment || placedClone) return;
      e.preventDefault();
      e.stopPropagation();
      const grid = clientToGrid(e.clientX, e.clientY);
      if (!grid) return;
      grabOffsetRef.current = {
        x: grid.x - draggableSegment.m.x,
        y: grid.y - draggableSegment.m.y,
      };
      setIsDragging(true);
      setDragClone({
        m: { x: draggableSegment.m.x, y: draggableSegment.m.y },
        n: { x: draggableSegment.n.x, y: draggableSegment.n.y },
      });
    },
    [segmentDragEnabled, draggableSegment, placedClone, clientToGrid],
  );

  const handleClick = useCallback(
    (e) => {
      if (!interactive || typeof onGridClick !== "function") return;
      const svg = svgRef.current;
      if (!svg) return;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const svgP = pt.matrixTransform(ctm.inverse());
      const gx = Math.round((svgP.x - ORIGIN_X) / UNIT);
      const gy = Math.round((ORIGIN_Y - svgP.y) / UNIT);
      if (gx < 0 || gy < 0 || gx > 11 || gy > 7) return;
      onGridClick(gx, gy);
    },
    [interactive, onGridClick, ORIGIN_X, ORIGIN_Y, UNIT],
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

  const getLabelPosition = (pt, pos) => {
    const placement = pt.labelPlacement || "above";
    if (placement === "below") {
      return {
        x: pos.x,
        y: pos.y + pointLabelOffsetY,
        anchor: "middle",
      };
    }
    if (placement === "right") {
      return {
        x: pos.x + pointRadius + 8,
        y: pos.y + 6,
        anchor: "start",
      };
    }
    return {
      x: pos.x,
      y: pos.y - pointLabelOffsetY,
      anchor: "middle",
    };
  };

  const renderPoint = (pt) => {
    const pos = toSvg(pt.x, pt.y);
    const labelPos = getLabelPosition(pt, pos);
    const radius = pt.radius || pointRadius;
    const opacity = pt.opacity != null ? pt.opacity : 1;

    return React.createElement(
      "g",
      {
        key: pt.id,
        className: "gp-placed-point",
        opacity: opacity,
      },
      pt.label
        ? React.createElement(
            "text",
            {
              x: labelPos.x,
              y: labelPos.y,
              fill: pt.color,
              fontSize: pointLabelFontSize,
              fontWeight: "700",
              textAnchor: labelPos.anchor,
              fontFamily: "system-ui, sans-serif",
            },
            pt.label,
          )
        : null,
      React.createElement("circle", {
        cx: pos.x,
        cy: pos.y,
        r: radius,
        fill: pt.color,
        stroke: "#ffffff",
        strokeWidth: 1.5,
        className: pt.blink ? "gp-point-circle-blink" : undefined,
      }),
    );
  };

  const renderSegment = (seg, index, extraProps) => {
    const from = toSvg(seg.from.x, seg.from.y);
    const to = toSvg(seg.to.x, seg.to.y);
    return React.createElement("line", {
      key: "seg-" + index,
      x1: from.x,
      y1: from.y,
      x2: to.x,
      y2: to.y,
      stroke: seg.color,
      strokeWidth: seg.strokeWidth || 2.5,
      opacity: seg.opacity != null ? seg.opacity : 1,
      ...extraProps,
    });
  };

  const renderCloneGroup = (clone, color, showLabels, keyPrefix) => {
    if (!clone) return null;
    const mPos = toSvg(clone.m.x, clone.m.y);
    const nPos = toSvg(clone.n.x, clone.n.y);
    const els = [
      React.createElement("line", {
        key: keyPrefix + "-line",
        x1: mPos.x,
        y1: mPos.y,
        x2: nPos.x,
        y2: nPos.y,
        stroke: color,
        strokeWidth: 2.5,
      }),
      React.createElement("circle", {
        key: keyPrefix + "-m",
        cx: mPos.x,
        cy: mPos.y,
        r: pointRadius,
        fill: color,
        stroke: "#ffffff",
        strokeWidth: 1.5,
      }),
      React.createElement("circle", {
        key: keyPrefix + "-n",
        cx: nPos.x,
        cy: nPos.y,
        r: pointRadius,
        fill: color,
        stroke: "#ffffff",
        strokeWidth: 1.5,
      }),
    ];
    if (showLabels && clone.mLabel) {
      els.push(
        React.createElement(
          "text",
          {
            key: keyPrefix + "-ml",
            x: mPos.x,
            y: mPos.y - pointLabelOffsetY,
            fill: color,
            fontSize: pointLabelFontSize,
            fontWeight: "700",
            textAnchor: "middle",
            fontFamily: "system-ui, sans-serif",
          },
          clone.mLabel,
        ),
      );
    }
    if (showLabels && clone.nLabel) {
      els.push(
        React.createElement(
          "text",
          {
            key: keyPrefix + "-nl",
            x: nPos.x,
            y: nPos.y - pointLabelOffsetY,
            fill: color,
            fontSize: pointLabelFontSize,
            fontWeight: "700",
            textAnchor: "middle",
            fontFamily: "system-ui, sans-serif",
          },
          clone.nLabel,
        ),
      );
    }
    return els;
  };

  const gridRight = PAD_LEFT + GRID_W;
  const segmentList = segments || [];
  const dragHitSegment =
    draggableSegment && segmentDragEnabled && !placedClone
      ? draggableSegment
      : null;
  const dragHitFrom = dragHitSegment ? toSvg(dragHitSegment.m.x, dragHitSegment.m.y) : null;
  const dragHitTo = dragHitSegment ? toSvg(dragHitSegment.n.x, dragHitSegment.n.y) : null;
  const segmentMidFrom = dragHitSegment
    ? {
        x: (dragHitSegment.m.x + dragHitSegment.n.x) / 2,
        y: (dragHitSegment.m.y + dragHitSegment.n.y) / 2,
      }
    : null;
  const segmentMidTo = dragHitSegment
    ? {
        x: segmentMidFrom.x - 2,
        y: segmentMidFrom.y - 3,
      }
    : null;
  const showSegmentDragNudge =
    showDragPathNudge && segmentDragEnabled && !isDragging && !placedClone;
  const cursorStyle = isDragging
    ? "grabbing"
    : segmentDragEnabled
      ? "grab"
      : interactive
        ? "crosshair"
        : "default";

  const showPlacedLabels =
    placedClone &&
    placedClone.showLabels !== false &&
    !!(placedClone.mLabel || placedClone.nLabel) &&
    (!placedClone.snapBackTo || !snapAnim);

  return React.createElement(
    "div",
    { className: "graph-panel graph-panel-step4", ref: containerRef },
    React.createElement(
      "svg",
      {
        ref: svgRef,
        className: "graph-coordinate-svg",
        viewBox: "0 0 " + SVG_W + " " + SVG_H,
        preserveAspectRatio: "xMidYMid meet",
        onClick: handleClick,
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
            id: "gp4-arrow-end",
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
            id: "gp4-arrow-start",
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
        markerStart: "url(#gp4-arrow-start)",
        markerEnd: "url(#gp4-arrow-end)",
      }),
      React.createElement("line", {
        x1: ORIGIN_X,
        y1: ORIGIN_Y + 14,
        x2: ORIGIN_X,
        y2: PAD_TOP - 4,
        stroke: AXIS_COLOR,
        strokeWidth: 2,
        markerStart: "url(#gp4-arrow-start)",
        markerEnd: "url(#gp4-arrow-end)",
      }),
      axisLabels,
      segmentList.map(function (seg, i) {
        return renderSegment(seg, i);
      }),
      placedClone
        ? renderCloneGroup(
            snapAnim
              ? { ...placedClone, m: snapAnim.m, n: snapAnim.n }
              : placedClone,
            snapAnim ? snapAnim.color : placedClone.color,
            showPlacedLabels,
            "placed",
          )
        : null,
      isDragging && dragClone
        ? renderCloneGroup(dragClone, "#f4d03f", false, "drag")
        : null,
      points.map(renderPoint),
      dragHitFrom && dragHitTo && segmentDragEnabled && !isDragging
        ? React.createElement("line", {
            key: "drag-blink",
            x1: dragHitFrom.x,
            y1: dragHitFrom.y,
            x2: dragHitTo.x,
            y2: dragHitTo.y,
            stroke: "#ffffff",
            strokeWidth: 4,
            className: "segment-blink-line",
          })
        : null,
      dragHitFrom && dragHitTo
        ? React.createElement("line", {
            key: "drag-hit",
            x1: dragHitFrom.x,
            y1: dragHitFrom.y,
            x2: dragHitTo.x,
            y2: dragHitTo.y,
            stroke: "transparent",
            strokeWidth: 20,
            style: { cursor: "grab" },
            onMouseDown: handleSegmentPointerDown,
          })
        : null,
    ),
    nudgeTarget && nudgeStyle
      ? React.createElement(
          "div",
          { className: "graph-nudge", style: nudgeStyle },
          React.createElement("img", {
            src: "assets/tap.gif",
            alt: "",
            className: "graph-nudge-gif",
          }),
        )
      : null,
    showSegmentDragNudge && segmentMidFrom && segmentMidTo
      ? React.createElement(DragPathNudge, {
          show: true,
          svgRef: svgRef,
          fromGrid: segmentMidFrom,
          toGrid: segmentMidTo,
          originX: ORIGIN_X,
          originY: ORIGIN_Y,
          unit: UNIT,
        })
      : null,
  );
};
