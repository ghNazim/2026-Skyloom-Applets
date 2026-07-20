const InteractiveGraphPanel = (props) => {
  const { useMemo, useCallback, useRef, useEffect } = React;
  const {
    baseX = 1,
    baseY = 1,
    hValue = 0,
    vValue = 0,
    hMin = -7,
    hMax = 7,
    vMin = -4,
    vMax = 4,
    isDragging = false,
    linePhase = null,
    pointDraggable = false,
    hasSliderInteraction = false,
    onHChange,
    onHRelease,
    onHDragStart,
    onVChange,
    onVRelease,
    onVDragStart,
    onPointDragStart,
    onPointChange,
    onPointDragEnd,
  } = props;

  const X_MIN = -9;
  const X_MAX = 9;
  const Y_MIN = -4;
  const Y_MAX = 4;
  const AXIS_LABEL_FONT = 7;
  const GRAPH_LABEL_FONT = 10;
  const BREAKDOWN_FONT = 8;
  const UNIT = 26;
  const LEFT_PAD = 30;
  const RIGHT_PAD = 26;
  const TOP_PAD = 24;
  const BOTTOM_PAD = 36;

  const svgRef = useRef(null);
  const pointDragRef = useRef(false);
  const activePointerIdRef = useRef(null);
  const dragCleanupRef = useRef(null);

  const xSpan = X_MAX - X_MIN;
  const ySpan = Y_MAX - Y_MIN;
  const PLOT_W = xSpan * UNIT;
  const PLOT_H = ySpan * UNIT;
  const SVG_W = LEFT_PAD + PLOT_W + RIGHT_PAD;
  const SVG_H = TOP_PAD + PLOT_H + BOTTOM_PAD;
  const ORIGIN_X = LEFT_PAD + Math.abs(X_MIN) * UNIT;
  const ORIGIN_Y = TOP_PAD + Y_MAX * UNIT;
  const plotLeft = ORIGIN_X + X_MIN * UNIT;
  const plotRight = ORIGIN_X + X_MAX * UNIT;
  const plotTop = TOP_PAD;
  const plotBottom = ORIGIN_Y - Y_MIN * UNIT;

  const YELLOW = "#FFD700";
  const PURPLE = "#B56CFF";
  const OBJECT_COLOR = "#fb9b5b";
  const IMAGE_COLOR = "#46c5ce";
  const GRID_COLOR = "#1A4B6D";
  const AXIS_COLOR = "#b0bec5";
  const WHITE = "#ffffff";

  const currentX = baseX + hValue;
  const currentY = baseY + vValue;
  const dx = hValue;
  const dy = vValue;

  const toSvg = useCallback(
    (mx, my) => ({
      x: ORIGIN_X + mx * UNIT,
      y: ORIGIN_Y - my * UNIT,
    }),
    [ORIGIN_X, ORIGIN_Y, UNIT],
  );

  const ghostPt = toSvg(baseX, baseY);
  const currentPt = toSvg(currentX, currentY);
  const cornerPt = toSvg(currentX, baseY);

  const pctFromValue = (val, min, max) => ((val - min) / (max - min)) * 100;
  const hPct = pctFromValue(hValue, hMin, hMax);
  const vPct = pctFromValue(vValue, vMin, vMax);

  const formatDelta = (n) => {
    if (Math.abs(n) < 0.05) return "";
    const rounded = Math.round(n);
    return rounded > 0 ? "+" + rounded : String(rounded);
  };

  const formatExpr = (start, delta) => {
    if (delta === 0) return String(start);
    return start + (delta > 0 ? "+" + delta : String(delta));
  };

  const showLines = !isDragging && linePhase;
  const showHLine = showLines && Math.abs(dx) > 0.05;
  const showVLine =
    showLines &&
    Math.abs(dy) > 0.05 &&
    (linePhase === "v" || linePhase === "done");
  const hLineGrowing = linePhase === "h";
  const vLineGrowing = linePhase === "v";
  const showDynamicLabel =
    (!isDragging || !hasSliderInteraction) &&
    (linePhase === "done" || !hasSliderInteraction);
  const showOriginMarker = hasSliderInteraction;
  const currentLabelAbove = currentY >= baseY;
  const currentAtTopEdge = currentY === Y_MAX;
  const currentAtBottomEdge = currentY === Y_MIN;
  const currentAtVerticalEdge = currentAtTopEdge || currentAtBottomEdge;
  const currentAtLeftCorner = currentAtVerticalEdge && currentX === X_MIN;
  const edgeLabelOffsetY = currentAtBottomEdge ? -UNIT * 0.5 : UNIT * 0.5;
  const edgeLabelOffsetX = currentAtLeftCorner ? 10 : -10;
  const currentLabelX = currentAtVerticalEdge
    ? currentPt.x + edgeLabelOffsetX
    : currentPt.x;
  const currentLabelY = currentAtVerticalEdge
    ? currentPt.y + edgeLabelOffsetY
    : currentPt.y + (currentLabelAbove ? -12 : 16);
  const currentLabelAnchor = currentAtVerticalEdge
    ? currentAtLeftCorner
      ? "start"
      : "end"
    : "middle";
  const originLabelY = ghostPt.y - 12;
  const showBreakdown =
    !isDragging && hasSliderInteraction && linePhase === "done";
  const breakdownX = currentAtVerticalEdge
    ? currentPt.x + edgeLabelOffsetX
    : currentPt.x;
  const breakdownBaseY = currentAtVerticalEdge
    ? currentPt.y + edgeLabelOffsetY + (currentAtBottomEdge ? -12 : 12)
    : currentLabelY + (currentLabelAbove ? -12 : 12);
  const breakdownAnchor = currentAtVerticalEdge
    ? currentAtLeftCorner
      ? "start"
      : "end"
    : "middle";

  const hLineLen = Math.abs(cornerPt.x - ghostPt.x);
  const vLineLen = Math.abs(currentPt.y - cornerPt.y);

  const clampH = (raw) => {
    let v = parseFloat(raw);
    if (isNaN(v)) v = 0;
    return Math.max(hMin, Math.min(hMax, v));
  };

  const clampV = (raw) => {
    let v = parseFloat(raw);
    if (isNaN(v)) v = 0;
    return Math.max(vMin, Math.min(vMax, v));
  };

  const updateDraggedPoint = useCallback(
    (clientX, clientY) => {
      if (!svgRef.current || typeof onPointChange !== "function") return;
      let svgX;
      let svgY;
      if (typeof svgRef.current.createSVGPoint === "function") {
        const point = svgRef.current.createSVGPoint();
        point.x = clientX;
        point.y = clientY;
        const matrix = svgRef.current.getScreenCTM();
        if (!matrix) return;
        const svgPoint = point.matrixTransform(matrix.inverse());
        svgX = svgPoint.x;
        svgY = svgPoint.y;
      } else {
        const rect = svgRef.current.getBoundingClientRect();
        const scaleX = SVG_W / rect.width;
        const scaleY = SVG_H / rect.height;
        svgX = (clientX - rect.left) * scaleX;
        svgY = (clientY - rect.top) * scaleY;
      }
      const nextX = Math.max(
        X_MIN,
        Math.min(X_MAX, Math.round((svgX - ORIGIN_X) / UNIT)),
      );
      const nextY = Math.max(
        Y_MIN,
        Math.min(Y_MAX, Math.round((ORIGIN_Y - svgY) / UNIT)),
      );
      onPointChange(nextX, nextY);
    },
    [onPointChange, ORIGIN_X, ORIGIN_Y, SVG_H, SVG_W, UNIT],
  );

  const getDragPoint = (event) => {
    if (event.touches && event.touches[0]) return event.touches[0];
    if (event.changedTouches && event.changedTouches[0]) {
      return event.changedTouches[0];
    }
    return event.nativeEvent || event;
  };

  const clearPointDragListeners = () => {
    if (dragCleanupRef.current) {
      dragCleanupRef.current();
      dragCleanupRef.current = null;
    }
  };

  const finishPointDrag = () => {
    clearPointDragListeners();
    activePointerIdRef.current = null;
    if (pointDragRef.current) {
      pointDragRef.current = false;
      if (typeof onPointDragEnd === "function") onPointDragEnd();
    }
  };

  const beginPointDrag = (clientX, clientY, pointerId) => {
    if (!pointDraggable) return;

    clearPointDragListeners();
    activePointerIdRef.current = pointerId != null ? pointerId : null;
    pointDragRef.current = true;
    if (typeof onPointDragStart === "function") onPointDragStart();
    updateDraggedPoint(clientX, clientY);

    const handleMove = (event) => {
      if (
        activePointerIdRef.current != null &&
        event.pointerId != null &&
        event.pointerId !== activePointerIdRef.current
      ) {
        return;
      }
      if (activePointerIdRef.current != null && event.pointerId == null) return;
      const point = getDragPoint(event);
      updateDraggedPoint(point.clientX, point.clientY);
      if (typeof event.preventDefault === "function") event.preventDefault();
    };

    const handleEnd = (event) => {
      if (
        activePointerIdRef.current != null &&
        event.pointerId != null &&
        event.pointerId !== activePointerIdRef.current
      ) {
        return;
      }
      finishPointDrag();
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleEnd);
    window.addEventListener("pointercancel", handleEnd);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);
    window.addEventListener("touchcancel", handleEnd);

    dragCleanupRef.current = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleEnd);
      window.removeEventListener("pointercancel", handleEnd);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
      window.removeEventListener("touchcancel", handleEnd);
    };
  };

  const handlePointPointerDown = (event) => {
    if (!pointDraggable) return;
    if (typeof event.preventDefault === "function") event.preventDefault();
    if (typeof event.stopPropagation === "function") event.stopPropagation();
    const point = getDragPoint(event);
    beginPointDrag(point.clientX, point.clientY, event.pointerId);
  };

  useEffect(() => () => clearPointDragListeners(), []);

  const handleHInput = (e) => {
    if (typeof onHChange === "function") onHChange(clampH(e.target.value));
  };

  const handleVInput = (e) => {
    if (typeof onVChange === "function") onVChange(clampV(e.target.value));
  };

  const handleHPointerDown = () => {
    if (typeof onHDragStart === "function") onHDragStart();
  };

  const handleVPointerDown = () => {
    if (typeof onVDragStart === "function") onVDragStart();
  };

  const handleHPointerUp = (e) => {
    const v = finalizeSliderValue(clampH(e.target.value), "both", hMin, hMax);
    if (typeof onHRelease === "function") onHRelease(v);
  };

  const handleVPointerUp = (e) => {
    const v = finalizeSliderValue(clampV(e.target.value), "both", vMin, vMax);
    if (typeof onVRelease === "function") onVRelease(v);
  };

  const renderSingleTrack = (orientation) =>
    React.createElement("div", {
      className:
        "gp-slider-track-bg " +
        orientation +
        " gp-slider-track-active ig-single-track",
      style:
        orientation === "horizontal" ? { width: "100%" } : { height: "100%" },
    });

  const gridEls = useMemo(() => {
    const els = [];

    for (let i = X_MIN; i <= X_MAX; i++) {
      const xi = ORIGIN_X + i * UNIT;
      els.push(
        React.createElement("line", {
          key: "gv-" + i,
          x1: xi,
          y1: plotTop,
          x2: xi,
          y2: plotBottom,
          stroke: GRID_COLOR,
          strokeWidth: 1,
        }),
      );
    }
    for (let j = Y_MIN; j <= Y_MAX; j++) {
      const yj = ORIGIN_Y - j * UNIT;
      els.push(
        React.createElement("line", {
          key: "gh-" + j,
          x1: plotLeft,
          y1: yj,
          x2: plotRight,
          y2: yj,
          stroke: GRID_COLOR,
          strokeWidth: 1,
        }),
      );
    }
    return els;
  }, [
    GRID_COLOR,
    ORIGIN_X,
    ORIGIN_Y,
    plotBottom,
    plotLeft,
    plotRight,
    plotTop,
    UNIT,
  ]);

  const axisLabels = useMemo(() => {
    const els = [];
    for (let i = X_MIN + 1; i < X_MAX; i++) {
      if (i === 0) continue;
      const px = ORIGIN_X + i * UNIT;
      els.push(
        React.createElement(
          "text",
          {
            key: "xl-" + i,
            x: px,
            y: ORIGIN_Y + 14,
            fill: AXIS_COLOR,
            fontSize: AXIS_LABEL_FONT,
            fontWeight: "600",
            textAnchor: "middle",
            fontFamily: "system-ui, sans-serif",
          },
          String(i),
        ),
      );
    }
    for (let j = Y_MIN + 1; j < Y_MAX; j++) {
      if (j === 0) continue;
      const py = ORIGIN_Y - j * UNIT;
      els.push(
        React.createElement(
          "text",
          {
            key: "yl-" + j,
            x: ORIGIN_X - 10,
            y: py + 5,
            fill: AXIS_COLOR,
            fontSize: AXIS_LABEL_FONT,
            fontWeight: "600",
            textAnchor: "middle",
            fontFamily: "system-ui, sans-serif",
          },
          String(j),
        ),
      );
    }
    return els;
  }, [AXIS_COLOR, AXIS_LABEL_FONT, ORIGIN_X, ORIGIN_Y, UNIT]);

  const renderGrowLine = (x1, y1, x2, y2, color, len, growing, key) => {
    if (len < 0.5) return null;
    return React.createElement("line", {
      key: key,
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      stroke: color,
      strokeWidth: 2.5,
      strokeDasharray: growing ? len + " " + len : "7 5",
      strokeDashoffset: growing ? len : 0,
      className: growing ? "ig-grow-line" : "ig-static-line",
      style: growing ? { "--ig-line-len": len + "px" } : undefined,
    });
  };

  return React.createElement(
    "div",
    { className: "ig-panel" },
    React.createElement(
      "div",
      { className: "ig-panel-inner" },
      React.createElement(
        "div",
        { className: "ig-graph-row" },
        React.createElement(
          "div",
          { className: "graph-v-slider-wrap ig-v-slider-wrap" },
          React.createElement(
            "div",
            { className: "gp-slider-track-wrap vertical" },
            renderSingleTrack("vertical"),
            React.createElement(
              "span",
              { className: "gp-slider-sign top" },
              "+",
            ),
            React.createElement(
              "span",
              { className: "gp-slider-sign bottom" },
              "-",
            ),
            React.createElement(
              "span",
              { className: "ig-slider-name ig-slider-name-v" },
              "b",
            ),
            React.createElement(
              "div",
              {
                className: "gp-slider-thumb vertical",
                style: { bottom: vPct + "%" },
              },
              formatSliderThumbValue(vValue),
            ),
            React.createElement("input", {
              type: "range",
              className: "gp-range-input vertical",
              min: vMin,
              max: vMax,
              step: 0.01,
              value: vValue,
              onMouseDown: handleVPointerDown,
              onTouchStart: handleVPointerDown,
              onInput: handleVInput,
              onChange: handleVInput,
              onMouseUp: handleVPointerUp,
              onTouchEnd: handleVPointerUp,
            }),
          ),
        ),
        React.createElement(
          "div",
          { className: "graph-svg-wrap ig-svg-wrap" },
          React.createElement(
            "svg",
            {
              ref: svgRef,
              viewBox: "0 0 " + SVG_W + " " + SVG_H,
              className: "graph-coordinate-svg",
              preserveAspectRatio: "xMidYMid slice",
              onPointerDown: pointDraggable ? handlePointPointerDown : undefined,
              onMouseDown: pointDraggable ? handlePointPointerDown : undefined,
              onTouchStart: pointDraggable ? handlePointPointerDown : undefined,
            },
            React.createElement(
              "defs",
              null,
              React.createElement(
                "marker",
                {
                  id: "ig-arrow-right",
                  markerWidth: 9,
                  markerHeight: 9,
                  refX: 7.5,
                  refY: 4.5,
                  orient: "auto",
                  markerUnits: "userSpaceOnUse",
                  viewBox: "0 0 9 9",
                },
                React.createElement("path", {
                  d: "M0,1.5 L7.5,4.5 L0,7.5 z",
                  fill: AXIS_COLOR,
                }),
              ),
              React.createElement(
                "marker",
                {
                  id: "ig-arrow-right-rev",
                  markerWidth: 9,
                  markerHeight: 9,
                  refX: 7.5,
                  refY: 4.5,
                  orient: "auto-start-reverse",
                  markerUnits: "userSpaceOnUse",
                  viewBox: "0 0 9 9",
                },
                React.createElement("path", {
                  d: "M0,1.5 L7.5,4.5 L0,7.5 z",
                  fill: AXIS_COLOR,
                }),
              ),
            ),
            pointDraggable
              ? React.createElement("rect", {
                  x: plotLeft,
                  y: plotTop,
                  width: plotRight - plotLeft,
                  height: plotBottom - plotTop,
                  fill: "transparent",
                  className: "ig-drag-plane",
                  onPointerDown: handlePointPointerDown,
                  onMouseDown: handlePointPointerDown,
                  onTouchStart: handlePointPointerDown,
                })
              : null,
            gridEls,
            React.createElement("line", {
              x1: plotLeft,
              y1: ORIGIN_Y,
              x2: plotRight,
              y2: ORIGIN_Y,
              stroke: AXIS_COLOR,
              strokeWidth: 2,
              markerStart: "url(#ig-arrow-right-rev)",
              markerEnd: "url(#ig-arrow-right)",
            }),
            React.createElement("line", {
              x1: ORIGIN_X,
              y1: plotBottom,
              x2: ORIGIN_X,
              y2: plotTop,
              stroke: AXIS_COLOR,
              strokeWidth: 2,
              markerStart: "url(#ig-arrow-right-rev)",
              markerEnd: "url(#ig-arrow-right)",
            }),
            axisLabels,
            showHLine
              ? renderGrowLine(
                  ghostPt.x,
                  ghostPt.y,
                  cornerPt.x,
                  cornerPt.y,
                  PURPLE,
                  hLineLen,
                  hLineGrowing,
                  "h-line",
                )
              : null,
            showVLine
              ? renderGrowLine(
                  cornerPt.x,
                  cornerPt.y,
                  currentPt.x,
                  currentPt.y,
                  PURPLE,
                  vLineLen,
                  vLineGrowing,
                  "v-line",
                )
              : null,
            showHLine && formatDelta(dx)
              ? React.createElement(
                  "text",
                  {
                    x: (ghostPt.x + cornerPt.x) / 2,
                    y: ghostPt.y + 15,
                    fill: PURPLE,
                    fontSize: GRAPH_LABEL_FONT,
                    fontWeight: "700",
                    textAnchor: "middle",
                    fontFamily: "system-ui, sans-serif",
                    className: hLineGrowing
                      ? "ig-label-hidden"
                      : "ig-label-visible",
                  },
                  formatDelta(dx),
                )
              : null,
            showVLine && formatDelta(dy)
              ? React.createElement(
                  "text",
                  {
                    x: cornerPt.x + 8,
                    y: (cornerPt.y + currentPt.y) / 2 + 5,
                    fill: PURPLE,
                    fontSize: GRAPH_LABEL_FONT,
                    fontWeight: "700",
                    textAnchor: "start",
                    fontFamily: "system-ui, sans-serif",
                    className: vLineGrowing
                      ? "ig-label-hidden"
                      : "ig-label-visible",
                  },
                  formatDelta(dy),
                )
              : null,
            showOriginMarker
              ? React.createElement("circle", {
                  cx: ghostPt.x,
                  cy: ghostPt.y,
                  r: 5,
                  fill: OBJECT_COLOR,
                })
              : null,
            showOriginMarker
              ? React.createElement(
                  "text",
                  {
                    x: ghostPt.x,
                    y: originLabelY,
                    fill: WHITE,
                    fontSize: GRAPH_LABEL_FONT,
                    fontWeight: "600",
                    textAnchor: "middle",
                    fontFamily: "system-ui, sans-serif",
                  },
                  "(" + baseX + "," + baseY + ")",
                )
              : null,
            showDynamicLabel
              ? React.createElement(
                  "text",
                  {
                    x: currentLabelX,
                    y: currentLabelY,
                    fill: WHITE,
                    fontSize: GRAPH_LABEL_FONT,
                    fontWeight: "600",
                    textAnchor: currentLabelAnchor,
                    fontFamily: "system-ui, sans-serif",
                    className:
                      "ig-label-visible" +
                      (pointDraggable ? " ig-draggable-point-label" : ""),
                    onPointerDown: handlePointPointerDown,
                    onMouseDown: handlePointPointerDown,
                    onTouchStart: handlePointPointerDown,
                  },
                  "(" + currentX + "," + currentY + ")",
                )
              : null,
            showBreakdown
              ? React.createElement(
                  "text",
                  {
                    x: breakdownX,
                    y: breakdownBaseY,
                    fill: "#ff4d4d",
                    fontSize: BREAKDOWN_FONT,
                    fontWeight: "600",
                    textAnchor: breakdownAnchor,
                    fontFamily: "system-ui, sans-serif",
                    className: "ig-label-visible ig-breakdown-text",
                  },
                  React.createElement(
                    "tspan",
                    { x: breakdownX, dy: 0 },
                    "(" + formatExpr(baseX, dx) + "," + formatExpr(baseY, dy) + ")",
                  ),
                )
              : null,
            React.createElement(
              "g",
              {
                className: pointDraggable ? "ig-draggable-point" : "",
                onPointerDown: handlePointPointerDown,
                onMouseDown: handlePointPointerDown,
                onTouchStart: handlePointPointerDown,
              },
              React.createElement("circle", {
                cx: currentPt.x,
                cy: currentPt.y,
                r: 24,
                fill: "transparent",
                stroke: "none",
              }),
              React.createElement("circle", {
                cx: currentPt.x,
                cy: currentPt.y,
                r: 5,
                fill: hasSliderInteraction ? IMAGE_COLOR : OBJECT_COLOR,
              }),
            ),
          ),
        ),
      ),
      React.createElement(
        "div",
        { className: "graph-h-slider-wrap ig-h-slider-wrap" },
        React.createElement(
          "div",
          { className: "gp-slider-track-wrap horizontal" },
          renderSingleTrack("horizontal"),
          React.createElement(
            "span",
            { className: "gp-slider-sign left" },
            "-",
          ),
          React.createElement(
            "span",
            { className: "gp-slider-sign right" },
            "+",
          ),
          React.createElement(
            "div",
            {
              className: "gp-slider-thumb horizontal",
              style: { left: hPct + "%" },
            },
            formatSliderThumbValue(hValue),
          ),
          React.createElement("input", {
            type: "range",
            className: "gp-range-input",
            min: hMin,
            max: hMax,
            step: 0.01,
            value: hValue,
            onMouseDown: handleHPointerDown,
            onTouchStart: handleHPointerDown,
            onInput: handleHInput,
            onChange: handleHInput,
            onMouseUp: handleHPointerUp,
            onTouchEnd: handleHPointerUp,
          }),
        ),
        React.createElement(
          "span",
          { className: "ig-slider-name ig-slider-name-h" },
          "a",
        ),
      ),
    ),
  );
};
