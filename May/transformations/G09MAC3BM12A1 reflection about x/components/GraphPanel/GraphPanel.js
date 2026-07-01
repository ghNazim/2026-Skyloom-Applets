const REFLECTION_GRAPH_CONFIG = {
  cols: 15,
  rows: 11,
  originCol: 6,
  originRowFromBottom: 5,
  xMin: -6,
  xMax: 9,
  yMin: -5,
  yMax: 6,
  unit: 44,
  padLeft: 36,
  padRight: 36,
  padTop: 28,
  padBottom: 32,
};

const TARGET_A = { x: 2, y: 4 };

const GraphPanel = (props) => {
  const { useRef, useCallback, useMemo } = React;
  const {
    step,
    step2Phase,
    plottedPoint,
    lineAnimPhase,
    xAxisHighlighted,
    showReflectionLabel,
    step4Phase,
    showUnitLine,
    unitLineY1,
    unitLineY2,
    unitLabelText,
    unitLabelFinal,
    highlightFour,
    unitLineRotating,
    showDashedDistance,
    onGridClick,
    onXAxisClick,
  } = props;

  const svgRef = useRef(null);

  const {
    cols: COLS,
    rows: ROWS,
    unit: UNIT,
    padLeft: PAD_LEFT,
    padRight: PAD_RIGHT,
    padTop: PAD_TOP,
    padBottom: PAD_BOTTOM,
    originCol: ORIGIN_COL,
    originRowFromBottom: ORIGIN_ROW_FROM_BOTTOM,
    xMin: X_MIN,
    xMax: X_MAX,
    yMin: Y_MIN,
    yMax: Y_MAX,
  } = REFLECTION_GRAPH_CONFIG;

  const GRID_W = COLS * UNIT;
  const GRID_H = ROWS * UNIT;
  const SVG_W = PAD_LEFT + GRID_W + PAD_RIGHT;
  const SVG_H = PAD_TOP + GRID_H + PAD_BOTTOM;
  const ORIGIN_X = PAD_LEFT + ORIGIN_COL * UNIT;
  const ORIGIN_Y = PAD_TOP + (ROWS - ORIGIN_ROW_FROM_BOTTOM) * UNIT;
  const plotLeft = PAD_LEFT;
  const plotRight = PAD_LEFT + GRID_W;
  const plotTop = PAD_TOP;
  const plotBottom = PAD_TOP + GRID_H;

  const GRID_COLOR = "#1a4b6d";
  const AXIS_COLOR = "#ffffff";
  const AXIS_HIGHLIGHT = "#ff9800";
  const YELLOW = "#ffd700";
  const PINK = "#e85d7a";
  const WHITE = "#ffffff";

  const toSvg = useCallback(
    (mx, my) => ({
      x: ORIGIN_X + mx * UNIT,
      y: ORIGIN_Y - my * UNIT,
    }),
    [ORIGIN_X, ORIGIN_Y, UNIT],
  );

  const clientToMath = useCallback(
    (clientX, clientY) => {
      const svg = svgRef.current;
      if (!svg) return null;
      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return null;
      const svgPt = pt.matrixTransform(ctm.inverse());
      const mx = (svgPt.x - ORIGIN_X) / UNIT;
      const my = (ORIGIN_Y - svgPt.y) / UNIT;
      const snappedX = Math.round(mx);
      const snappedY = Math.round(my);
      if (
        snappedX < X_MIN ||
        snappedX > X_MAX ||
        snappedY < Y_MIN ||
        snappedY > Y_MAX
      ) {
        return null;
      }
      return { x: snappedX, y: snappedY };
    },
    [ORIGIN_X, ORIGIN_Y, UNIT, X_MIN, X_MAX, Y_MIN, Y_MAX],
  );

  const handleSvgClick = (e) => {
    if (step === 2 && step2Phase !== "done") {
      const math = clientToMath(e.clientX, e.clientY);
      if (math && typeof onGridClick === "function") onGridClick(math);
    }
  };

  const handleXAxisClick = (e) => {
    e.stopPropagation();
    if (step === 3 && typeof onXAxisClick === "function") onXAxisClick();
  };

  const gridLines = useMemo(() => {
    const els = [];
    for (let c = 0; c <= COLS; c++) {
      const x = PAD_LEFT + c * UNIT;
      els.push(
        React.createElement("line", {
          key: "vc-" + c,
          x1: x,
          y1: plotTop,
          x2: x,
          y2: plotBottom,
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
          x1: plotLeft,
          y1: y,
          x2: plotRight,
          y2: y,
          stroke: GRID_COLOR,
          strokeWidth: 1,
        }),
      );
    }
    return els;
  }, [COLS, ROWS, UNIT, PAD_LEFT, PAD_TOP, plotLeft, plotRight, plotTop, plotBottom]);

  const axisLabels = useMemo(() => {
    const els = [];
    for (let i = X_MIN + 1; i < X_MAX; i++) {
      if (i === 0) continue;
      const px = ORIGIN_X + i * UNIT;
      const isHighlight =
        plottedPoint &&
        step2Phase === "wrong" &&
        lineAnimPhase === "done" &&
        i === plottedPoint.x;
      els.push(
        React.createElement(
          "text",
          {
            key: "xl-" + i,
            x: px,
            y: ORIGIN_Y + 24,
            fill: isHighlight ? PINK : AXIS_COLOR,
            fontSize: 16,
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
      const isHighlight =
        plottedPoint &&
        step2Phase === "wrong" &&
        lineAnimPhase === "done" &&
        j === plottedPoint.y;
      els.push(
        React.createElement(
          "text",
          {
            key: "yl-" + j,
            x: ORIGIN_X - 18,
            y: py + 5,
            fill: isHighlight ? PINK : AXIS_COLOR,
            fontSize: 16,
            fontWeight: "600",
            textAnchor: "middle",
            fontFamily: "system-ui, sans-serif",
          },
          String(j),
        ),
      );
    }
    els.push(
      React.createElement(
        "text",
        {
          key: "origin-o",
          x: ORIGIN_X - 22,
          y: ORIGIN_Y + 22,
          fill: AXIS_COLOR,
          fontSize: 15,
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
          key: "axis-x-pos",
          x: plotRight + 14,
          y: ORIGIN_Y + 5,
          fill: xAxisHighlighted ? AXIS_HIGHLIGHT : AXIS_COLOR,
          fontSize: 17,
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
          key: "axis-x-neg",
          x: plotLeft - 14,
          y: ORIGIN_Y + 5,
          fill: xAxisHighlighted ? AXIS_HIGHLIGHT : AXIS_COLOR,
          fontSize: 17,
          fontWeight: "700",
          textAnchor: "middle",
          fontFamily: "system-ui, sans-serif",
        },
        "X\u2032",
      ),
    );
    els.push(
      React.createElement(
        "text",
        {
          key: "axis-y-pos",
          x: ORIGIN_X + 4,
          y: plotTop - 10,
          fill: AXIS_COLOR,
          fontSize: 17,
          fontWeight: "700",
          textAnchor: "middle",
          fontFamily: "system-ui, sans-serif",
        },
        "Y",
      ),
    );
    els.push(
      React.createElement(
        "text",
        {
          key: "axis-y-neg",
          x: ORIGIN_X + 4,
          y: plotBottom + 20,
          fill: AXIS_COLOR,
          fontSize: 17,
          fontWeight: "700",
          textAnchor: "middle",
          fontFamily: "system-ui, sans-serif",
        },
        "Y\u2032",
      ),
    );
    return els;
  }, [
    ORIGIN_X,
    ORIGIN_Y,
    UNIT,
    plotLeft,
    plotRight,
    plotTop,
    plotBottom,
    X_MIN,
    X_MAX,
    Y_MIN,
    Y_MAX,
    plottedPoint,
    step2Phase,
    lineAnimPhase,
    xAxisHighlighted,
  ]);

  const renderGrowLine = (x1, y1, x2, y2, color, dashed, growing, key) => {
    const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    if (len < 0.5) return null;
    return React.createElement("line", {
      key: key,
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      stroke: color,
      strokeWidth: 2.5,
      strokeDasharray: dashed ? (growing ? len + " " + len : "7 5") : undefined,
      strokeDashoffset: growing ? len : 0,
      className: growing ? "rg-grow-line" : undefined,
      style: growing ? { "--rg-line-len": len + "px" } : undefined,
    });
  };

  const showPointA =
    (step >= 2 && (step2Phase === "correct" || step2Phase === "done")) ||
    step >= 3 ||
    (step === 2 && plottedPoint);

  const pointColor =
    step2Phase === "correct" || step2Phase === "done" || step >= 3
      ? YELLOW
      : PINK;

  const pointCoords =
    step2Phase === "correct" || step2Phase === "done" || step >= 3
      ? TARGET_A
      : plottedPoint;

  const showGuideLines =
    step === 2 &&
    plottedPoint &&
    step2Phase === "wrong" &&
    lineAnimPhase;

  const showPointLabel =
    step >= 3 ||
    (plottedPoint &&
      step2Phase === "correct") ||
    (plottedPoint &&
      step2Phase === "wrong" &&
      lineAnimPhase === "done");

  const targetPt = toSvg(TARGET_A.x, TARGET_A.y);
  const axisFoot = toSvg(TARGET_A.x, 0);

  const dashedLen = Math.abs(targetPt.y - axisFoot.y);

  const renderPointLabel = () => {
    if (!pointCoords) return null;
    const pt = toSvg(pointCoords.x, pointCoords.y);
    const labelX = pt.x + 14;
    const labelY = pt.y - 10;
    const showHighlightY =
      highlightFour && (step4Phase === "done" || step >= 5);

    return React.createElement(
      "text",
      {
        x: labelX,
        y: labelY,
        fill: WHITE,
        fontSize: 17,
        fontWeight: "600",
        fontFamily: "system-ui, sans-serif",
      },
      React.createElement("tspan", null, "A(" + pointCoords.x + ", "),
      React.createElement(
        "tspan",
        {
          fill: showHighlightY ? AXIS_HIGHLIGHT : WHITE,
          fontWeight: showHighlightY ? "700" : "600",
        },
        String(pointCoords.y),
      ),
      React.createElement("tspan", null, ")"),
    );
  };

  const renderUnitLabel = () => {
    if (!unitLabelText) return null;
    const lineX = toSvg(TARGET_A.x, 0).x;
    let labelY;
    if (unitLabelFinal) {
      labelY = (targetPt.y + axisFoot.y) / 2;
    } else {
      const midY = (unitLineY1 + unitLineY2) / 2;
      labelY = toSvg(TARGET_A.x, midY).y;
    }
    const parts = unitLabelText.match(/^(\d+)(.*)$/);
    const numPart = parts ? parts[1] : unitLabelText;
    const restPart = parts ? parts[2] : "";

    return React.createElement(
      "text",
      {
        x: lineX + 16,
        y: labelY + 5,
        fill: WHITE,
        fontSize: 16,
        fontWeight: "600",
        fontFamily: "system-ui, sans-serif",
        className: unitLabelFinal ? "rg-unit-label-final" : undefined,
      },
      highlightFour && unitLabelFinal
        ? React.createElement(
            React.Fragment,
            null,
            React.createElement(
              "tspan",
              { fill: AXIS_HIGHLIGHT, fontWeight: "700" },
              numPart,
            ),
            React.createElement("tspan", null, restPart),
          )
        : unitLabelText,
    );
  };

  const unitLinePt1 = toSvg(TARGET_A.x, unitLineY1);
  const unitLinePt2 = toSvg(TARGET_A.x, unitLineY2);

  const xAxisStroke = xAxisHighlighted ? AXIS_HIGHLIGHT : AXIS_COLOR;
  const xAxisWidth = xAxisHighlighted ? 4 : 2;

  return React.createElement(
    "div",
    { className: "graph-panel reflection-graph-panel" },
    React.createElement(
      "div",
      { className: "graph-panel-inner reflection-graph-inner" },
      React.createElement(
        "svg",
        {
          ref: svgRef,
          viewBox: "0 0 " + SVG_W + " " + SVG_H,
          className:
            "graph-coordinate-svg reflection-coordinate-svg" +
            (step === 2 && step2Phase !== "done" ? " is-clickable" : ""),
          preserveAspectRatio: "xMidYMid meet",
          onClick: handleSvgClick,
        },
        React.createElement(
          "defs",
          null,
          React.createElement(
            "marker",
            {
              id: "rg-arrow",
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
              fill: xAxisHighlighted ? AXIS_HIGHLIGHT : AXIS_COLOR,
            }),
          ),
          React.createElement(
            "marker",
            {
              id: "rg-arrow-rev",
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
              fill: xAxisHighlighted ? AXIS_HIGHLIGHT : AXIS_COLOR,
            }),
          ),
        ),
        gridLines,
        React.createElement("line", {
          x1: plotLeft - 8,
          y1: ORIGIN_Y,
          x2: plotRight + 8,
          y2: ORIGIN_Y,
          stroke: xAxisStroke,
          strokeWidth: xAxisWidth,
          markerStart: "url(#rg-arrow-rev)",
          markerEnd: "url(#rg-arrow)",
          className: step === 3 && !xAxisHighlighted ? "rg-x-axis-target" : undefined,
          onClick: step === 3 && !xAxisHighlighted ? handleXAxisClick : undefined,
          style: step === 3 && !xAxisHighlighted ? { cursor: "pointer" } : undefined,
        }),
        step === 3 && !xAxisHighlighted
          ? React.createElement("line", {
              id: "x-axis-hit",
              x1: ORIGIN_X,
              y1: ORIGIN_Y,
              x2: ORIGIN_X + 6 * UNIT,
              y2: ORIGIN_Y,
              stroke: "transparent",
              strokeWidth: 20,
              onClick: handleXAxisClick,
              style: { cursor: "pointer" },
            })
          : null,
        React.createElement("line", {
          x1: ORIGIN_X,
          y1: plotBottom + 8,
          x2: ORIGIN_X,
          y2: plotTop - 8,
          stroke: AXIS_COLOR,
          strokeWidth: 2,
          markerStart: "url(#rg-arrow-rev)",
          markerEnd: "url(#rg-arrow)",
        }),
        axisLabels,
        showDashedDistance
          ? renderGrowLine(
              targetPt.x,
              targetPt.y,
              axisFoot.x,
              axisFoot.y,
              YELLOW,
              true,
              step4Phase === "revealing",
              "dist-dash",
            )
          : null,
        showUnitLine
          ? React.createElement("line", {
              x1: unitLinePt2.x,
              y1: unitLinePt2.y,
              x2: unitLinePt1.x,
              y2: unitLinePt1.y,
              stroke: YELLOW,
              strokeWidth: 4,
              strokeLinecap: "round",
              className: unitLineRotating ? "rg-unit-line-rotate" : undefined,
              style: {
                transformOrigin:
                  unitLinePt2.x + "px " + unitLinePt2.y + "px",
              },
            })
          : null,
        renderUnitLabel(),
        showGuideLines && plottedPoint
          ? React.createElement(
              React.Fragment,
              null,
              renderGrowLine(
                toSvg(plottedPoint.x, plottedPoint.y).x,
                toSvg(plottedPoint.x, plottedPoint.y).y,
                toSvg(plottedPoint.x, 0).x,
                toSvg(plottedPoint.x, 0).y,
                PINK,
                true,
                lineAnimPhase === "v",
                "guide-v",
              ),
              lineAnimPhase === "h" || lineAnimPhase === "done"
                ? renderGrowLine(
                    toSvg(plottedPoint.x, plottedPoint.y).x,
                    toSvg(plottedPoint.x, plottedPoint.y).y,
                    toSvg(0, plottedPoint.y).x,
                    toSvg(0, plottedPoint.y).y,
                    PINK,
                    true,
                    lineAnimPhase === "h",
                    "guide-h",
                  )
                : null,
            )
          : null,
        showPointA && pointCoords
          ? React.createElement("circle", {
              cx: toSvg(pointCoords.x, pointCoords.y).x,
              cy: toSvg(pointCoords.x, pointCoords.y).y,
              r: 6,
              fill: pointColor,
            })
          : null,
        showPointLabel ? renderPointLabel() : null,
        showReflectionLabel
          ? React.createElement(
              "text",
              {
                x: ORIGIN_X + 3 * UNIT,
                y: ORIGIN_Y - 1.2 * UNIT,
                fill: AXIS_HIGHLIGHT,
                fontSize: 15,
                fontWeight: "600",
                fontStyle: "italic",
                fontFamily: "system-ui, sans-serif",
              },
              APP_DATA.steps[3].reflectionLabel,
            )
          : null,
      ),
    ),
  );
};
