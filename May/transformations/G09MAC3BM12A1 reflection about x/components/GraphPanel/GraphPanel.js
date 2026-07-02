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
    showQ1FourUnitsLabel,
    unitLineRotating,
    showDashedDistance,
    step5Phase,
    prop1Done,
    prop2Done,
    p1LineVisible,
    p1LineFadeReady,
    p1RightAngleVisible,
    p1RightAngleFadeReady,
    cloneVisible,
    cloneY,
    cloneOpacity,
    calloutVisible,
    calloutFadeReady,
    calloutPos,
    calloutMode,
    calloutPrevMode,
    calloutTextNextReady,
    calloutLoading,
    showMeasureLine,
    measureLineUnits,
    measureLineGrowing,
    unitLabelOverride,
    showApost,
    apostFadeReady,
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

  const AXIS_NUM_FONT = 19;
  const AXIS_NAME_FONT = 20;
  const ORIGIN_FONT = 22;
  const POINT_LABEL_FONT = 26;
  const UNIT_LABEL_FONT = 24;
  const REFLECTION_LABEL_FONT = 21;
  const POINT_RADIUS = 8;

  const getArrowDims = (size) => {
    if (size === "large") {
      return { tip: 18, wing: 6.5 };
    }
    return { tip: 14, wing: 5 };
  };

  const renderAxisArrow = (tipX, tipY, direction, color, dims) => {
    // ELEMENT: axis-arrow — arrowhead polygon (x-axis / y-axis); direction: left|right|up|down
    const { tip, wing } = dims;
    let points;
    if (direction === "right") {
      points =
        tipX +
        "," +
        tipY +
        " " +
        (tipX - tip) +
        "," +
        (tipY - wing) +
        " " +
        (tipX - tip) +
        "," +
        (tipY + wing);
    } else if (direction === "left") {
      points =
        tipX +
        "," +
        tipY +
        " " +
        (tipX + tip) +
        "," +
        (tipY - wing) +
        " " +
        (tipX + tip) +
        "," +
        (tipY + wing);
    } else if (direction === "up") {
      points =
        tipX +
        "," +
        tipY +
        " " +
        (tipX - wing) +
        "," +
        (tipY + tip) +
        " " +
        (tipX + wing) +
        "," +
        (tipY + tip);
    } else {
      points =
        tipX +
        "," +
        tipY +
        " " +
        (tipX - wing) +
        "," +
        (tipY - tip) +
        " " +
        (tipX + wing) +
        "," +
        (tipY - tip);
    }
    return React.createElement("polygon", {
      points: points,
      fill: color,
      stroke: "none",
    });
  };

  const xArrowDims = getArrowDims(xAxisHighlighted ? "large" : "normal");
  const yArrowDims = getArrowDims("normal");
  const xArrowColor = xAxisHighlighted ? AXIS_HIGHLIGHT : AXIS_COLOR;

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
    // ELEMENT: grid-lines — background coordinate grid (vertical + horizontal lines)
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
    // ELEMENT: axis-labels — origin O, axis names X/X′/Y/Y′, and numeric tick labels
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
            fontSize: AXIS_NUM_FONT,
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
            fontSize: AXIS_NUM_FONT,
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
          x: ORIGIN_X - 15,
          y: ORIGIN_Y + 20,
          fill: AXIS_COLOR,
          fontSize: ORIGIN_FONT,
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
          fontSize: AXIS_NAME_FONT,
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
          fontSize: AXIS_NAME_FONT,
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
          fontSize: AXIS_NAME_FONT,
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
          fontSize: AXIS_NAME_FONT,
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
    // ELEMENT: grow-line (helper) — animated dashed/solid line; key identifies instance
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
    // ELEMENT: point-a-label — text label "A(x, y)" beside point A
    if (!pointCoords) return null;
    const pt = toSvg(pointCoords.x, pointCoords.y);
    const labelX = pt.x + 16;
    const labelY = pt.y - 12;
    const showHighlightY = highlightFour && step === 4 && step4Phase === "done";

    return React.createElement(
      "text",
      {
        x: labelX,
        y: labelY,
        fill: WHITE,
        fontSize: POINT_LABEL_FONT,
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
    // ELEMENT: unit-label — animated "N unit(s)" beside the unit-line (step 4 + step 5 prop2)
    if (!unitLabelText) return null;

    const isProp2Measuring =
      step === 5 &&
      (step5Phase === "prop2-running" || step5Phase === "done");

    if (showQ1FourUnitsLabel && !isProp2Measuring && step < 5) return null;
    if (showQ1FourUnitsLabel && step >= 5 && !isProp2Measuring) return null;

    const lineX = toSvg(TARGET_A.x, 0).x;
    let labelY;

    if (isProp2Measuring) {
      const labelMathY = unitLabelOverride
        ? unitLabelOverride.y
        : (unitLineY1 + unitLineY2) / 2;
      const midY = toSvg(TARGET_A.x, labelMathY).y;
      return React.createElement(
        "text",
        {
          x: lineX + 16,
          y: midY + 5,
          fill: WHITE,
          fontSize: UNIT_LABEL_FONT,
          fontWeight: unitLabelOverride ? "700" : "600",
          fontFamily: "system-ui, sans-serif",
          textAnchor: "start",
          className:
            !showUnitLine || unitLabelOverride ? "rg-unit-label-final" : undefined,
        },
        unitLabelText,
      );
    }

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
        fontSize: UNIT_LABEL_FONT,
        fontWeight: "600",
        fontFamily: "system-ui, sans-serif",
        className: unitLabelFinal ? "rg-unit-label-final" : undefined,
      },
      highlightFour && unitLabelFinal && step < 5
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

  const renderQ1FourUnitsLabel = () => {
    // ELEMENT: q1-four-units-label — persistent "4 units" in quadrant I (step 4 end + step 5)
    if (!showQ1FourUnitsLabel) return null;
    const lineX = toSvg(TARGET_A.x, 0).x;
    const labelY = (targetPt.y + axisFoot.y) / 2;
    const q1Text = APP_DATA.steps[4].unitPlural.replace("{n}", "4");
    const parts = q1Text.match(/^(\d+)(.*)$/);
    const numPart = parts ? parts[1] : q1Text;
    const restPart = parts ? parts[2] : "";

    return React.createElement(
      "text",
      {
        x: lineX + 16,
        y: labelY + 5,
        fill: WHITE,
        fontSize: UNIT_LABEL_FONT,
        fontWeight: "600",
        fontFamily: "system-ui, sans-serif",
        textAnchor: "start",
      },
      step >= 5
        ? q1Text
        : React.createElement(
            React.Fragment,
            null,
            React.createElement(
              "tspan",
              { fill: AXIS_HIGHLIGHT, fontWeight: "700" },
              numPart,
            ),
            React.createElement("tspan", null, restPart),
          ),
    );
  };

  const getCalloutText = (mode) => {
    if (mode === "prop1") return APP_DATA.steps[5].calloutProp1;
    if (mode === "prop2A") return APP_DATA.steps[5].calloutProp2A;
    if (mode === "prop2B") return APP_DATA.steps[5].calloutProp2B;
    return "";
  };

  const renderCalloutDots = () =>
    // ELEMENT: callout-loading-dots — animated ●●● after yellow callout text
    calloutLoading && calloutMode === "prop2B" && calloutPos === "q4"
      ? React.createElement(
          "span",
          { className: "rg-callout-dots", "aria-hidden": "true" },
          React.createElement("span", { className: "rg-dot dot1" }, "\u25cf"),
          React.createElement("span", { className: "rg-dot dot2" }, "\u25cf"),
          React.createElement("span", { className: "rg-dot dot3" }, "\u25cf"),
        )
      : null;

  const unitLinePt1 = toSvg(TARGET_A.x, unitLineY1);
  const unitLinePt2 = toSvg(TARGET_A.x, unitLineY2);

  const xAxisStroke = xAxisHighlighted ? AXIS_HIGHLIGHT : AXIS_COLOR;
  const xAxisWidth = xAxisHighlighted ? 4 : 2;
  const xTip = xArrowDims.tip;
  const yTip = yArrowDims.tip;

  const showProp1Overlays = step === 5 && (p1LineVisible || prop1Done || prop2Done);
  const showProp2Overlays = step === 5 && (showApost || prop2Done);

  const cloneBase = toSvg(2, 4);
  const cloneDest = toSvg(2, cloneY == null ? 4 : cloneY);
  const cloneDx = cloneDest.x - cloneBase.x;
  const cloneDy = cloneDest.y - cloneBase.y;

  return React.createElement(
    "div",
    { className: "graph-panel reflection-graph-panel" },
    React.createElement(
      "div",
      { className: "graph-panel-inner reflection-graph-inner" },
      React.createElement(
        "svg",
        {
          // ELEMENT: coordinate-svg — root SVG canvas for the reflection graph
          id: "coordinate-svg",
          ref: svgRef,
          viewBox: "0 0 " + SVG_W + " " + SVG_H,
          className:
            "graph-coordinate-svg reflection-coordinate-svg" +
            (step === 2 && step2Phase !== "done" ? " is-clickable" : ""),
          preserveAspectRatio: "xMidYMid meet",
          onClick: handleSvgClick,
        },
        gridLines,
        // ELEMENT: x-axis — horizontal axis line (orange when highlighted in step 3)
        React.createElement("line", {
          id: "x-axis",
          x1: plotLeft + xTip,
          y1: ORIGIN_Y,
          x2: plotRight - xTip,
          y2: ORIGIN_Y,
          stroke: xAxisStroke,
          strokeWidth: xAxisWidth,
          strokeLinecap: "butt",
          className: step === 3 && !xAxisHighlighted ? "rg-x-axis-target" : undefined,
          onClick: step === 3 && !xAxisHighlighted ? handleXAxisClick : undefined,
          style: step === 3 && !xAxisHighlighted ? { cursor: "pointer" } : undefined,
        }),
        // ELEMENT: x-axis-arrow-left / x-axis-arrow-right — arrowheads on x-axis
        renderAxisArrow(plotLeft, ORIGIN_Y, "left", xArrowColor, xArrowDims),
        renderAxisArrow(plotRight, ORIGIN_Y, "right", xArrowColor, xArrowDims),
        step === 3 && !xAxisHighlighted
          ? React.createElement("line", {
              // ELEMENT: x-axis-hit-zone — invisible click target for step 3
              id: "x-axis-hit",
              x1: plotLeft,
              y1: ORIGIN_Y,
              x2: plotRight,
              y2: ORIGIN_Y,
              stroke: "transparent",
              strokeWidth: 48,
              onClick: handleXAxisClick,
              style: { cursor: "pointer" },
            })
          : null,
        // ELEMENT: y-axis — vertical axis line through the origin
        React.createElement("line", {
          id: "y-axis",
          x1: ORIGIN_X,
          y1: plotTop + yTip,
          x2: ORIGIN_X,
          y2: plotBottom - yTip,
          stroke: AXIS_COLOR,
          strokeWidth: 2,
          strokeLinecap: "butt",
        }),
        // ELEMENT: y-axis-arrow-up / y-axis-arrow-down — arrowheads on y-axis
        renderAxisArrow(ORIGIN_X, plotTop, "up", AXIS_COLOR, yArrowDims),
        renderAxisArrow(ORIGIN_X, plotBottom, "down", AXIS_COLOR, yArrowDims),
        axisLabels,
        showProp1Overlays && p1LineVisible
          ? React.createElement("line", {
              // ELEMENT: reflection-dotted-line — yellow dotted vertical line at x=2 (step 5 prop1)
              id: "reflection-dotted-line",
              x1: toSvg(2, 0).x,
              y1: plotTop,
              x2: toSvg(2, 0).x,
              y2: plotBottom,
              stroke: YELLOW,
              strokeWidth: 2.5,
              strokeDasharray: "0 8",
              strokeLinecap: "round",
              className:
                "rg-p1-line-fade" +
                (p1LineFadeReady || prop1Done || prop2Done ? " is-visible" : ""),
            })
          : null,
        showProp1Overlays && p1RightAngleVisible
          ? React.createElement("rect", {
              // ELEMENT: right-angle-symbol — cyan square at x-axis ∩ x=2 (step 5 prop1)
              id: "right-angle-symbol",
              x: toSvg(2, 0).x + 2,
              y: toSvg(2, 0).y - 20,
              width: 18,
              height: 18,
              fill: "rgba(69, 198, 206, 0.55)",
              rx: 2,
              className:
                "rg-fade-in" +
                (p1RightAngleFadeReady || prop1Done || prop2Done
                  ? " is-visible"
                  : ""),
            })
          : null,
        showMeasureLine && measureLineUnits > 0
          ? React.createElement("line", {
              // ELEMENT: reflection-measurement-line — dashed yellow line from axis to −N units (step 5 prop2)
              id: "reflection-measurement-line",
              x1: toSvg(2, 0).x,
              y1: toSvg(2, 0).y,
              x2: toSvg(2, -measureLineUnits).x,
              y2: toSvg(2, -measureLineUnits).y,
              stroke: YELLOW,
              strokeWidth: 2.5,
              strokeDasharray: "7 5",
            })
          : null,
        showDashedDistance
          ? renderGrowLine(
              // ELEMENT: vertical-projection-line — A down to x-axis (step 4); grow-line key "dist-dash"
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
              // ELEMENT: unit-line — thick yellow segment showing 1 unit (steps 4 + 5 prop2)
              id: "unit-line",
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
        renderQ1FourUnitsLabel(),
        renderUnitLabel(),
        showGuideLines && plottedPoint
          ? React.createElement(
              React.Fragment,
              null,
              // ELEMENT: guide-line-vertical — pink dashed line from wrong point down to x-axis (step 2)
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
                ? // ELEMENT: guide-line-horizontal — pink dashed line from wrong point to y-axis (step 2)
                  renderGrowLine(
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
              // ELEMENT: point-a — plotted / target point A circle
              id: "point-a",
              cx: toSvg(pointCoords.x, pointCoords.y).x,
              cy: toSvg(pointCoords.x, pointCoords.y).y,
              r: POINT_RADIUS,
              fill: pointColor,
            })
          : null,
        cloneVisible
          ? React.createElement(
              "g",
              {
                // ELEMENT: clone-point-group — animated copy of A sliding along x=2 (step 5 prop1)
                id: "clone-point-group",
                style: {
                  transform: "translate(" + cloneDx + "px, " + cloneDy + "px)",
                  transition: "transform 0.65s ease, opacity 0.45s ease",
                  opacity: cloneOpacity,
                },
              },
              React.createElement("circle", {
                // ELEMENT: clone-point — circle inside clone-point-group
                id: "clone-point",
                cx: cloneBase.x,
                cy: cloneBase.y,
                r: POINT_RADIUS,
                fill: YELLOW,
              }),
            )
          : null,
        showPointLabel ? renderPointLabel() : null,
        showProp2Overlays
          ? React.createElement("circle", {
              // ELEMENT: point-a-prime — reflected image A′ at (2, −4) (step 5 prop2)
              id: "point-a-prime",
              cx: toSvg(2, -4).x,
              cy: toSvg(2, -4).y,
              r: POINT_RADIUS,
              fill: YELLOW,
              className:
                "rg-fade-in" + (apostFadeReady || prop2Done ? " is-visible" : ""),
            })
          : null,
        showProp2Overlays && (apostFadeReady || prop2Done)
          ? React.createElement(
              "text",
              {
                // ELEMENT: point-a-prime-label — text "A′" beside reflected point
                id: "point-a-prime-label",
                x: toSvg(2, -4).x + 14,
                y: toSvg(2, -4).y + 20,
                fill: WHITE,
                fontSize: POINT_LABEL_FONT,
                fontWeight: "700",
                fontFamily: "system-ui, sans-serif",
                className:
                  "rg-fade-in" + (apostFadeReady || prop2Done ? " is-visible" : ""),
              },
              "A\u2032",
            )
          : null,
        showReflectionLabel
          ? React.createElement(
              "text",
              {
                // ELEMENT: reflection-axis-label — "Line of reflection: x-axis" (step 3)
                id: "reflection-axis-label",
                x: ORIGIN_X + 3 * UNIT,
                y: ORIGIN_Y - 1.2 * UNIT,
                fill: AXIS_HIGHLIGHT,
                fontSize: REFLECTION_LABEL_FONT,
                fontWeight: "600",
                fontStyle: "italic",
                fontFamily: "system-ui, sans-serif",
              },
              APP_DATA.steps[3].reflectionLabel,
            )
          : null,
        calloutVisible && calloutMode
          ? (() => {
              const isTallCallout =
                calloutMode === "prop2B" && calloutPos === "q4";
              return React.createElement(
              "g",
              {
                // ELEMENT: callout-box — speech-bubble group (steps 5 prop1/prop2)
                id: "callout-box",
                className:
                  "rg-callout" + (calloutFadeReady ? " is-visible" : " is-hidden"),
                style: {
                  transform:
                    calloutPos === "q1"
                      ? "translate(" + (ORIGIN_X + 4 * UNIT) + "px," + (ORIGIN_Y - 4.8 * UNIT) + "px)"
                      : "translate(" + (ORIGIN_X + 4.4 * UNIT) + "px," + (ORIGIN_Y + 1.5 * UNIT) + "px)",
                },
              },
              React.createElement("path", {
                // ELEMENT: callout-box-background — rounded rectangle fill behind callout text
                id: "callout-box-background",
                d: isTallCallout
                  ? "M18,18 h220 a16,16 0 0 1 16,16 v104 a16,16 0 0 1 -16,16 h-220 a16,16 0 0 1 -16,-16 v-104 a16,16 0 0 1 16,-16 z"
                  : "M18,18 h220 a16,16 0 0 1 16,16 v80 a16,16 0 0 1 -16,16 h-220 a16,16 0 0 1 -16,-16 v-80 a16,16 0 0 1 16,-16 z",
                fill: "rgba(12, 60, 80, 0.85)",
                stroke: "rgba(255,255,255,0.08)",
                strokeWidth: 2,
              }),
              React.createElement("polygon", {
                // ELEMENT: callout-pointer — triangular tail on callout box edge
                id: "callout-pointer",
                points: isTallCallout
                  ? "18,94 -18,104 18,114"
                  : "18,82 -18,92 18,102",
                fill: "rgba(12, 60, 80, 0.85)",
              }),
              React.createElement(
                "foreignObject",
                {
                  // ELEMENT: callout-text-area — HTML text container inside callout
                  id: "callout-text-area",
                  x: 20,
                  y: 24,
                  width: 216,
                  height: isTallCallout ? 120 : 96,
                },
                React.createElement(
                  "div",
                  {
                    xmlns: "http://www.w3.org/1999/xhtml",
                    className: "rg-callout-text-wrap",
                  },
                  calloutPrevMode
                    ? React.createElement(
                        "div",
                        {
                          // ELEMENT: callout-text-prev — fading-out previous callout message
                          className: "rg-callout-body is-prev is-fading",
                        },
                        getCalloutText(calloutPrevMode),
                      )
                    : null,
                  React.createElement(
                    "div",
                    {
                      // ELEMENT: callout-text-current — active callout message (+ loading dots)
                      className:
                        "rg-callout-body is-next" +
                        (calloutTextNextReady ? " is-visible" : "") +
                        (calloutMode === "prop2B" && calloutPos === "q4"
                          ? " is-yellow"
                          : ""),
                    },
                    getCalloutText(calloutMode),
                    renderCalloutDots(),
                  ),
                ),
              ),
            );
            })()
          : null,
      ),
    ),
  );
};
