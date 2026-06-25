const InteractiveGraphPanel = (props) => {
  const { useMemo, useCallback } = React;
  const {
    baseX = 1,
    baseY = 1,
    hDefault = 1,
    vDefault = 1,
    hValue = 1,
    vValue = 1,
    hMin = -8,
    hMax = 8,
    vMin = -3,
    vMax = 3,
    isDragging = false,
    linePhase = null,
    onHChange,
    onHRelease,
    onHDragStart,
    onVChange,
    onVRelease,
    onVDragStart,
  } = props;

  const X_MIN = -9;
  const X_MAX = 9;
  const Y_MIN = -4;
  const Y_MAX = 4;
  const AXIS_LABEL_FONT = 7;
  const GRAPH_LABEL_FONT = 10;
  const UNIT = 26;
  const LEFT_PAD = 30;
  const RIGHT_PAD = 26;
  const TOP_PAD = 24;
  const BOTTOM_PAD = 36;

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
  const PINK = "#FF6EC7";
  const GRID_COLOR = "#1A4B6D";
  const AXIS_COLOR = "#b0bec5";
  const WHITE = "#ffffff";

  const currentX = baseX + (hValue - hDefault);
  const currentY = baseY + (vValue - vDefault);
  const dx = currentX - baseX;
  const dy = currentY - baseY;

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

  const showLines = !isDragging && linePhase;
  const showHLine = showLines && Math.abs(dx) > 0.05;
  const showVLine =
    showLines &&
    Math.abs(dy) > 0.05 &&
    (linePhase === "v" || linePhase === "done");
  const hLineGrowing = linePhase === "h";
  const vLineGrowing = linePhase === "v";
  const showDynamicLabel = !isDragging && linePhase === "done";
  const dynamicLabelY = dy > 0 ? currentPt.y - 14 : currentPt.y + 15;

  const hLineLen = Math.abs(cornerPt.x - ghostPt.x);
  const vLineLen = Math.abs(currentPt.y - cornerPt.y);

  const clampH = (raw) => {
    let v = parseFloat(raw);
    if (isNaN(v)) v = hDefault;
    return Math.max(hMin, Math.min(hMax, v));
  };

  const clampV = (raw) => {
    let v = parseFloat(raw);
    if (isNaN(v)) v = vDefault;
    return Math.max(vMin, Math.min(vMax, v));
  };

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
    ORIGIN_X,
    ORIGIN_Y,
    plotTop,
    plotBottom,
    plotLeft,
    plotRight,
    UNIT,
    X_MIN,
    X_MAX,
    Y_MIN,
    Y_MAX,
  ]);

  const axisLabels = useMemo(() => {
    const els = [];
    for (let i = X_MIN+1; i < X_MAX; i++) {
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
    for (let j = Y_MIN+1; j < Y_MAX; j++) {
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
  }, [ORIGIN_X, ORIGIN_Y, UNIT, X_MIN, X_MAX, Y_MIN, Y_MAX, AXIS_LABEL_FONT]);

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
              "−",
            ),
            React.createElement(
              "span",
              { className: "ig-slider-name ig-slider-name-v" },
              "y",
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
              viewBox: "0 0 " + SVG_W + " " + SVG_H,
              className: "graph-coordinate-svg",
              preserveAspectRatio: "xMidYMid slice",
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
                  YELLOW,
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
                  PINK,
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
                    fill: YELLOW,
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
                    fill: PINK,
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
            React.createElement("circle", {
              cx: ghostPt.x,
              cy: ghostPt.y,
              r: 5,
              fill: "none",
              stroke: YELLOW,
              strokeWidth: 2.5,
              opacity: 0.75,
            }),
            React.createElement(
              "text",
              {
                x: ghostPt.x,
                y: ghostPt.y + 15,
                fill: WHITE,
                fontSize: GRAPH_LABEL_FONT,
                fontWeight: "600",
                textAnchor: "middle",
                fontFamily: "system-ui, sans-serif",
              },
              "(" + baseX + "," + baseY + ")",
            ),
            showDynamicLabel
              ? React.createElement(
                  "text",
                  {
                    x: currentPt.x,
                    y: dynamicLabelY,
                    fill: WHITE,
                    fontSize: GRAPH_LABEL_FONT,
                    fontWeight: "600",
                    textAnchor: "middle",
                    fontFamily: "system-ui, sans-serif",
                    className: "ig-label-visible",
                  },
                  "(" + currentX + "," + currentY + ")",
                )
              : null,
            React.createElement("circle", {
              cx: currentPt.x,
              cy: currentPt.y,
              r: 5,
              fill: YELLOW,
            }),
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
            "−",
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
          "x",
        ),
      ),
    ),
  );
};
