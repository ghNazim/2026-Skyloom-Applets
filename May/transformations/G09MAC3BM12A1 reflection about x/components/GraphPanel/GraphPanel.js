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
    step2NudgePoint,
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
    step6Phase,
    step6ShowVerticalLine,
    step6VerticalLineGrowing,
    step6HighlightX2,
    step6ShowCoordLabel,
    step6ShowCoordX,
    step6XCloneVisible,
    step6XCloneFlying,
    step6ShowHorizontalLine,
    step6HorizontalLineGrowing,
    step6HighlightYNeg4,
    step6ShowCoordY,
    step6YCloneVisible,
    step6YCloneFlying,
    step7Answer,
    step7WrongCloneVisible,
    step7WrongCloneFlying,
    step8Phase,
    step8ShowFormula,
    step8XActive,
    step8XBlink,
    step8YActive,
    step8YBlink,
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
  const OBJECT_COLOR = "#fb9b5b";
  const IMAGE_COLOR = "#46c5ce";
  const AXIS_HIGHLIGHT = "#ff69c8";
  const AXIS_DIM_OPACITY = 0.5;
  const COORD_DIM_OPACITY = 0.6;
  const COORD_ORANGE = "#ff9f1c";
  const STEP8_X_HIGHLIGHT = "#f561a3";
  const STEP8_Y_HIGHLIGHT = "#5da6f4";
  const YELLOW = "#ffd34d";
  const WRONG_COLOR = "#a01822";
  const WHITE = "#ffffff";
  const MATH_FONT = '"Times New Roman", Times, serif';

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
    // ELEMENT: axis-labels — origin O, axis names x/y, and numeric tick labels
    const els = [];
    for (let i = X_MIN + 1; i < X_MAX; i++) {
      if (i === 0) continue;
      const px = ORIGIN_X + i * UNIT;
      const isWrongPlotHighlight =
        plottedPoint &&
        step2Phase === "wrong" &&
        lineAnimPhase === "done" &&
        i === plottedPoint.x;
      const isCoordinateHighlight =
        (step === 6 && step6HighlightX2 && i === 2) ||
        (step === 7 && step7Answer === "wrong" && i === 2);
      const isAxisNumberHighlight = isWrongPlotHighlight || isCoordinateHighlight;
      els.push(
        React.createElement(
          "text",
          {
            key: "xl-" + i,
            x: px,
            y: ORIGIN_Y + 24,
            fill: isWrongPlotHighlight
              ? WRONG_COLOR
              : isCoordinateHighlight
                ? YELLOW
                : AXIS_COLOR,
            opacity: isAxisNumberHighlight ? 1 : AXIS_DIM_OPACITY,
            fontSize: isCoordinateHighlight ? AXIS_NUM_FONT * 1.2 : AXIS_NUM_FONT,
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
      const isWrongPlotHighlight =
        plottedPoint &&
        step2Phase === "wrong" &&
        lineAnimPhase === "done" &&
        j === plottedPoint.y;
      const isCoordinateHighlight =
        (step === 6 && step6HighlightYNeg4 && j === -4) ||
        (step === 7 && step7Answer === "correct" && (j === 4 || j === -4));
      const isAxisNumberHighlight = isWrongPlotHighlight || isCoordinateHighlight;
      els.push(
        React.createElement(
          "text",
          {
            key: "yl-" + j,
            x: ORIGIN_X - 18,
            y: py + 5,
            fill: isWrongPlotHighlight
              ? WRONG_COLOR
              : isCoordinateHighlight
                ? YELLOW
                : AXIS_COLOR,
            opacity: isAxisNumberHighlight ? 1 : AXIS_DIM_OPACITY,
            fontSize: isCoordinateHighlight ? AXIS_NUM_FONT * 1.2 : AXIS_NUM_FONT,
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
          fontFamily: MATH_FONT,
          fontStyle: "italic",
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
          fontFamily: MATH_FONT,
          fontStyle: "italic",
          opacity: 1,
        },
        "x",
      ),
    );
    // X′ label hidden for now.
    // els.push(
    //   React.createElement(
    //     "text",
    //     {
    //       key: "axis-x-neg",
    //       x: plotLeft - 14,
    //       y: ORIGIN_Y + 5,
    //       fill: xAxisHighlighted ? AXIS_HIGHLIGHT : AXIS_COLOR,
    //       fontSize: AXIS_NAME_FONT,
    //       fontWeight: "700",
    //       textAnchor: "middle",
    //       fontFamily: MATH_FONT,
    //       fontStyle: "italic",
    //       opacity: 1,
    //     },
    //     "x\u2032",
    //   ),
    // );
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
          fontFamily: MATH_FONT,
          fontStyle: "italic",
          opacity: xAxisHighlighted ? AXIS_DIM_OPACITY : 1,
        },
        "y",
      ),
    );
    // Y′ label hidden for now.
    // els.push(
    //   React.createElement(
    //     "text",
    //     {
    //       key: "axis-y-neg",
    //       x: ORIGIN_X + 4,
    //       y: plotBottom + 20,
    //       fill: AXIS_COLOR,
    //       fontSize: AXIS_NAME_FONT,
    //       fontWeight: "700",
    //       textAnchor: "middle",
    //       fontFamily: MATH_FONT,
    //       fontStyle: "italic",
    //       opacity: xAxisHighlighted ? AXIS_DIM_OPACITY : 1,
    //     },
    //     "y\u2032",
    //   ),
    // );
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
    step,
    step6HighlightX2,
    step6HighlightYNeg4,
    step7Answer,
  ]);

  const renderGrowLine = (
    x1,
    y1,
    x2,
    y2,
    color,
    dashed,
    growing,
    key,
    extraClassName,
    extraStyle,
  ) => {
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
      strokeWidth: extraStyle && extraStyle.strokeWidth ? extraStyle.strokeWidth : 2.5,
      strokeDasharray: dashed ? (growing ? len + " " + len : "7 5") : undefined,
      strokeDashoffset: growing ? len : 0,
      className:
        (growing ? "rg-grow-line" : "") +
        (extraClassName ? " " + extraClassName : ""),
      style: Object.assign(
        {},
        growing ? { "--rg-line-len": len + "px" } : {},
        extraStyle || {},
      ),
    });
  };

  const showPointA =
    (step >= 2 && (step2Phase === "correct" || step2Phase === "done")) ||
    step >= 3 ||
    (step === 2 && plottedPoint);

  const pointColor =
    step2Phase === "correct" || step2Phase === "done" || step >= 3
      ? OBJECT_COLOR
      : WRONG_COLOR;

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
  const aPrimePt = toSvg(2, -4);
  const aPrimeAxisFoot = toSvg(2, 0);
  const yAxisFootA = toSvg(0, 4);
  const yAxisFootAPrime = toSvg(0, -4);

  const dashedLen = Math.abs(targetPt.y - axisFoot.y);
  const step6DimFirstQuadrant = step === 6 && step6Phase !== "done";
  const step7ShowVerticalMeasurements =
    step === 7 && step7Answer !== "correct";
  const step7ShowHorizontalMeasurements =
    step === 7 && step7Answer === "correct";
  const step8ShowVerticalMeasurements = step === 8;

  const renderPointLabel = () => {
    // ELEMENT: point-a-label — text label "A(x, y)" beside point A
    if (!pointCoords) return null;
    const pt = toSvg(pointCoords.x, pointCoords.y);
    const labelX = pt.x + 16;
    const labelY = pt.y - 12;
    const showHighlightY = highlightFour && step === 4 && step4Phase === "done";
    const highlightStep7X = step === 7 && step7Answer === "wrong";
    const highlightStep7Y = step === 7 && step7Answer === "correct";
    const highlightStep8X = step === 8 && step8XActive;
    const highlightStep8Y = step === 8 && step8YActive;

    return React.createElement(
      "text",
      {
        x: labelX,
        y: labelY,
        fill: WHITE,
        fontSize: POINT_LABEL_FONT,
        fontWeight: "600",
        fontFamily: "system-ui, sans-serif",
        className: step6DimFirstQuadrant ? "rg-dehighlight" : undefined,
      },
      React.createElement("tspan", { opacity: highlightStep7Y ? COORD_DIM_OPACITY : 1 }, "A("),
      React.createElement(
        "tspan",
        {
          fill: highlightStep7X ? YELLOW : highlightStep8X ? STEP8_X_HIGHLIGHT : WHITE,
          fontWeight: highlightStep7X || highlightStep8X ? "700" : "600",
          opacity: highlightStep7Y ? COORD_DIM_OPACITY : 1,
          className: step8XBlink ? "rg-blink-text" : undefined,
        },
        String(pointCoords.x),
      ),
      React.createElement("tspan", { opacity: highlightStep7Y ? COORD_DIM_OPACITY : 1 }, ", "),
      React.createElement(
        "tspan",
        {
          fill:
            showHighlightY || highlightStep7Y
              ? highlightStep7Y
                ? COORD_ORANGE
                : YELLOW
              : highlightStep8Y
                ? STEP8_Y_HIGHLIGHT
                : WHITE,
          fontWeight:
            showHighlightY || highlightStep7Y || highlightStep8Y ? "700" : "600",
          className: step8YBlink ? "rg-blink-text" : undefined,
        },
        String(pointCoords.y),
      ),
      React.createElement("tspan", { opacity: highlightStep7Y ? COORD_DIM_OPACITY : 1 }, ")"),
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
              { fill: YELLOW, fontWeight: "700" },
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
    if (step >= 7) return null;
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
        className: step6DimFirstQuadrant ? "rg-dehighlight" : undefined,
      },
      step >= 5
        ? q1Text
        : React.createElement(
            React.Fragment,
            null,
            React.createElement(
              "tspan",
              { fill: YELLOW, fontWeight: "700" },
              numPart,
            ),
            React.createElement("tspan", null, restPart),
          ),
    );
  };

  const renderQ4FourUnitsLabel = () => {
    // ELEMENT: q4-four-units-label - persistent "4 units" beside A' during step 6
    if (step !== 6) return null;
    const labelText = APP_DATA.steps[4].unitPlural.replace("{n}", "4");
    return React.createElement(
      "text",
      {
        x: toSvg(2, -2).x + 16,
        y: toSvg(2, -2).y + 5,
        fill: WHITE,
        fontSize: UNIT_LABEL_FONT,
        fontWeight: "600",
        fontFamily: "system-ui, sans-serif",
        textAnchor: "start",
      },
      labelText,
    );
  };

  const renderAPrimeLabel = () => {
    const labelX = aPrimePt.x + 14;
    const labelY = aPrimePt.y + 20;
    const highlightX =
      (step === 7 && step7Answer === "wrong") || (step === 8 && step8XActive);
    const highlightY =
      (step === 7 && step7Answer === "correct") || (step === 8 && step8YActive);
    const showCoords = step === 7 || step === 8 || step6ShowCoordLabel;

    if (!showCoords) {
      return React.createElement(
        "text",
        {
          id: "point-a-prime-label",
          x: labelX,
          y: labelY,
          fill: WHITE,
          fontSize: POINT_LABEL_FONT,
          fontWeight: "700",
          fontFamily: "system-ui, sans-serif",
          className:
            step === 5
              ? "rg-fade-in" + (apostFadeReady || prop2Done ? " is-visible" : "")
              : undefined,
        },
        "A\u2032",
      );
    }

    return React.createElement(
      "text",
      {
        id: "point-a-prime-label",
        x: labelX,
        y: labelY,
        fill: WHITE,
        fontSize: POINT_LABEL_FONT,
        fontWeight: "700",
        fontFamily: "system-ui, sans-serif",
      },
      React.createElement("tspan", { opacity: highlightY ? COORD_DIM_OPACITY : 1 }, "A\u2032("),
      React.createElement(
        "tspan",
        {
          fill: highlightX ? (step === 8 ? STEP8_X_HIGHLIGHT : YELLOW) : WHITE,
          opacity: step === 6 && !step6ShowCoordX ? 0 : highlightY ? COORD_DIM_OPACITY : 1,
          className: step8XBlink ? "rg-blink-text" : undefined,
        },
        "2",
      ),
      React.createElement("tspan", { opacity: highlightY ? COORD_DIM_OPACITY : 1 }, ", "),
      React.createElement(
        "tspan",
        {
          fill:
            step === 8 && step8YActive
              ? STEP8_Y_HIGHLIGHT
              : highlightY
                ? COORD_ORANGE
                : WHITE,
          opacity: step === 6 && !step6ShowCoordY ? 0 : 1,
          className: step8YBlink ? "rg-blink-text" : undefined,
        },
        "-4",
      ),
      React.createElement("tspan", { opacity: highlightY ? COORD_DIM_OPACITY : 1 }, ")"),
    );
  };

  const renderStep6CoordinateClones = () => {
    const labelX = aPrimePt.x + 14;
    const labelY = aPrimePt.y + 20;
    const xSource = { x: toSvg(2, 0).x, y: ORIGIN_Y + 24 };
    const xTarget = { x: labelX + 42, y: labelY };
    const ySource = { x: ORIGIN_X - 18, y: toSvg(0, -4).y + 5 };
    const yTarget = { x: labelX + 88, y: labelY };

    return React.createElement(
      React.Fragment,
      null,
      step6XCloneVisible
        ? React.createElement(
            "text",
            {
              className:
                "rg-flying-coordinate" +
                (step6XCloneFlying ? " is-flying" : ""),
              x: xSource.x,
              y: xSource.y,
              fill: YELLOW,
              fontSize: AXIS_NUM_FONT,
              fontWeight: "700",
              textAnchor: "middle",
              fontFamily: "system-ui, sans-serif",
              style: {
                "--rg-fly-x": xTarget.x - xSource.x + "px",
                "--rg-fly-y": xTarget.y - xSource.y + "px",
              },
            },
            "2",
          )
        : null,
      step6YCloneVisible
        ? React.createElement(
            "text",
            {
              className:
                "rg-flying-coordinate" +
                (step6YCloneFlying ? " is-flying" : ""),
              x: ySource.x,
              y: ySource.y,
              fill: YELLOW,
              fontSize: AXIS_NUM_FONT,
              fontWeight: "700",
              textAnchor: "middle",
              fontFamily: "system-ui, sans-serif",
              style: {
                "--rg-fly-x": yTarget.x - ySource.x + "px",
                "--rg-fly-y": yTarget.y - ySource.y + "px",
              },
            },
            "-4",
          )
        : null,
    );
  };

  const renderStep7WrongClones = () => {
    if (step !== 7 || !step7WrongCloneVisible) return null;

    const destination = { x: toSvg(2, 0).x, y: ORIGIN_Y + 24 };
    const sources = [
      { key: "a", x: targetPt.x + 50, y: targetPt.y - 12 },
      { key: "ap", x: aPrimePt.x + 56, y: aPrimePt.y + 20 },
    ];

    return React.createElement(
      React.Fragment,
      null,
      sources.map((source) =>
        React.createElement(
          "text",
          {
            key: source.key,
            className:
              "rg-flying-coordinate" +
              (step7WrongCloneFlying ? " is-flying" : ""),
            x: source.x,
            y: source.y,
            fill: YELLOW,
            fontSize: POINT_LABEL_FONT,
            fontWeight: "700",
            textAnchor: "middle",
            fontFamily: "system-ui, sans-serif",
            style: {
              "--rg-fly-x": destination.x - source.x + "px",
              "--rg-fly-y": destination.y - source.y + "px",
            },
          },
          "2",
        ),
      ),
    );
  };

  const getCalloutText = (mode) => {
    if (mode === "prop1") return APP_DATA.steps[5].calloutProp1;
    if (mode === "prop2A") return APP_DATA.steps[5].calloutProp2A;
    if (mode === "prop2B") return APP_DATA.steps[5].calloutProp2B;
    return "";
  };

  const renderCalloutDots = (mode = calloutMode, pos = calloutPos, loading = calloutLoading) =>
    // ELEMENT: callout-loading-dots — animated ●●● after yellow callout text
    loading && mode === "prop2B" && pos === "q4"
      ? React.createElement(
          "span",
          { className: "rg-callout-dots", "aria-hidden": "true" },
          React.createElement("span", { className: "rg-dot dot1" }, "\u25cf"),
          React.createElement("span", { className: "rg-dot dot2" }, "\u25cf"),
          React.createElement("span", { className: "rg-dot dot3" }, "\u25cf"),
        )
      : null;

  const getCalloutTransform = (pos) =>
    pos === "q1"
      ? "translate(" + (ORIGIN_X + 4 * UNIT) + "px," + (ORIGIN_Y - 4.8 * UNIT) + "px)"
      : "translate(" + (ORIGIN_X + 4.4 * UNIT) + "px," + (ORIGIN_Y + 1.5 * UNIT) + "px)";

  const renderCalloutBox = (mode, pos, options) => {
    const opts = options || {};
    const isTallCallout = mode === "prop2B" && pos === "q4";
    const id = opts.id || "callout-box";
    const prevMode = opts.prevMode || null;
    const textReady = opts.textReady !== false;

    return React.createElement(
      "g",
      {
        id: id,
        className:
          "rg-callout" +
          (opts.visible === false ? " is-hidden" : " is-visible") +
          (opts.dimmed ? " is-dimmed-copy" : ""),
        style: {
          transform: getCalloutTransform(pos),
        },
      },
      React.createElement("path", {
        id: id + "-background",
        d: isTallCallout
          ? "M18,18 h220 a16,16 0 0 1 16,16 v104 a16,16 0 0 1 -16,16 h-220 a16,16 0 0 1 -16,-16 v-104 a16,16 0 0 1 16,-16 z"
          : "M18,18 h220 a16,16 0 0 1 16,16 v80 a16,16 0 0 1 -16,16 h-220 a16,16 0 0 1 -16,-16 v-80 a16,16 0 0 1 16,-16 z",
        fill: "rgba(12, 60, 80, 0.85)",
        stroke: "rgba(255,255,255,0.08)",
        strokeWidth: 2,
      }),
      React.createElement("polygon", {
        id: id + "-pointer",
        points: isTallCallout
          ? "18,94 -18,104 18,114"
          : "18,82 -18,92 18,102",
        fill: "rgba(12, 60, 80, 0.85)",
      }),
      React.createElement(
        "foreignObject",
        {
          id: id + "-text-area",
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
          prevMode
            ? React.createElement(
                "div",
                {
                  className: "rg-callout-body is-prev is-fading",
                },
                getCalloutText(prevMode),
              )
            : null,
          React.createElement(
            "div",
            {
              className:
                "rg-callout-body is-next" +
                (textReady ? " is-visible" : "") +
                (mode === "prop2B" && pos === "q4" ? " is-yellow" : ""),
            },
            getCalloutText(mode),
            renderCalloutDots(mode, pos, opts.loading === true),
          ),
        ),
      ),
    );
  };

  const unitLinePt1 = toSvg(TARGET_A.x, unitLineY1);
  const unitLinePt2 = toSvg(TARGET_A.x, unitLineY2);
  const reflectionLabelText = APP_DATA.steps[3].reflectionLabel || "";
  const reflectionLabelParts = reflectionLabelText.includes("x-axis")
    ? {
        before: reflectionLabelText.split("x-axis")[0],
        after: reflectionLabelText.split("x-axis").slice(1).join("x-axis"),
        prefix: "",
        suffix: "-axis",
      }
    : reflectionLabelText.includes("sumbu-x")
      ? {
          before: reflectionLabelText.split("sumbu-x")[0],
          after: reflectionLabelText.split("sumbu-x").slice(1).join("sumbu-x"),
          prefix: "sumbu-",
          suffix: "",
        }
      : null;

  const xAxisStroke = xAxisHighlighted ? AXIS_HIGHLIGHT : AXIS_COLOR;
  const xAxisWidth = xAxisHighlighted ? 4 : 2;
  const yAxisOpacity = xAxisHighlighted ? AXIS_DIM_OPACITY : 1;
  const xTip = xArrowDims.tip;
  const yTip = yArrowDims.tip;

  const showProp1Overlays = step === 5 && (p1LineVisible || prop1Done || prop2Done);
  const showAPrimeOverlays =
    (step === 5 && (showApost || prop2Done)) || step === 6 || step === 7 || step === 8;

  const cloneBase = toSvg(2, 4);
  const cloneDest = toSvg(2, cloneY == null ? 0 : cloneY);
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
          opacity: 1,
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
          opacity: yAxisOpacity,
        }),
        // ELEMENT: y-axis-arrow-up / y-axis-arrow-down — arrowheads on y-axis
        React.createElement(
          "g",
          { opacity: yAxisOpacity },
          renderAxisArrow(ORIGIN_X, plotTop, "up", AXIS_COLOR, yArrowDims),
          renderAxisArrow(ORIGIN_X, plotBottom, "down", AXIS_COLOR, yArrowDims),
        ),
        axisLabels,
        showProp1Overlays && p1LineVisible
          ? React.createElement("line", {
              // ELEMENT: reflection-dotted-line — yellow dotted vertical line at x=2 (step 5 prop1)
              id: "reflection-dotted-line",
              x1: toSvg(2, 0).x,
              y1: plotTop,
              x2: toSvg(2, 0).x,
              y2: plotBottom,
              stroke: WHITE,
              strokeWidth: 2.5,
              strokeDasharray: "7 5",
              strokeLinecap: "round",
              className:
                "rg-p1-line-grow" +
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
        step === 5 && showMeasureLine && measureLineUnits > 0
          ? React.createElement("line", {
              // ELEMENT: reflection-measurement-line — dashed yellow line from axis to −N units (step 5 prop2)
              id: "reflection-measurement-line",
              x1: toSvg(2, 0).x,
              y1: toSvg(2, 0).y,
              x2: toSvg(2, -measureLineUnits).x,
              y2: toSvg(2, -measureLineUnits).y,
              stroke: YELLOW,
              strokeWidth: 4,
              strokeDasharray: "7 5",
            })
          : null,
        showDashedDistance && step < 7
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
              step6DimFirstQuadrant ? "rg-dehighlight" : "",
              { strokeWidth: 4 },
            )
          : null,
        step === 6 && step6ShowVerticalLine
          ? renderGrowLine(
              aPrimePt.x,
              aPrimePt.y,
              aPrimeAxisFoot.x,
              aPrimeAxisFoot.y,
              YELLOW,
              true,
              step6VerticalLineGrowing,
              "step6-aprime-to-x",
              "",
              { strokeWidth: 4 },
            )
          : null,
        step === 6 && step6ShowHorizontalLine
          ? renderGrowLine(
              aPrimePt.x,
              aPrimePt.y,
              yAxisFootAPrime.x,
              yAxisFootAPrime.y,
              YELLOW,
              true,
              step6HorizontalLineGrowing,
              "step6-aprime-to-y",
            )
          : null,
        step7ShowVerticalMeasurements
          ? React.createElement(
              React.Fragment,
              null,
              renderGrowLine(
                targetPt.x,
                targetPt.y,
                axisFoot.x,
                axisFoot.y,
                YELLOW,
                true,
              false,
              "step7-a-to-x",
              "",
                { opacity: 0.5, strokeWidth: 4 },
              ),
              renderGrowLine(
                aPrimePt.x,
                aPrimePt.y,
                aPrimeAxisFoot.x,
                aPrimeAxisFoot.y,
                YELLOW,
                true,
              false,
              "step7-aprime-to-x",
              "",
                { opacity: 0.5, strokeWidth: 4 },
              ),
            )
          : null,
        step7ShowHorizontalMeasurements
          ? React.createElement(
              React.Fragment,
              null,
              renderGrowLine(
                targetPt.x,
                targetPt.y,
                yAxisFootA.x,
                yAxisFootA.y,
                YELLOW,
                true,
              false,
              "step7-a-to-y",
              "",
                { opacity: 0.5, strokeWidth: 4 },
              ),
              renderGrowLine(
                aPrimePt.x,
                aPrimePt.y,
                yAxisFootAPrime.x,
                yAxisFootAPrime.y,
                YELLOW,
                true,
              false,
              "step7-aprime-to-y",
              "",
                { opacity: 0.5, strokeWidth: 4 },
              ),
            )
          : null,
        step8ShowVerticalMeasurements
          ? React.createElement(
              React.Fragment,
              null,
              renderGrowLine(
                targetPt.x,
                targetPt.y,
                axisFoot.x,
                axisFoot.y,
                YELLOW,
                true,
              false,
              "step8-a-to-x",
              "",
              { strokeWidth: 4 },
            ),
              renderGrowLine(
                aPrimePt.x,
                aPrimePt.y,
                aPrimeAxisFoot.x,
                aPrimeAxisFoot.y,
                YELLOW,
                true,
              false,
              "step8-aprime-to-x",
              "",
              { strokeWidth: 4 },
            ),
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
        renderQ4FourUnitsLabel(),
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
                WRONG_COLOR,
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
                    WRONG_COLOR,
                    true,
                    lineAnimPhase === "h",
                    "guide-h",
                  )
                : null,
            )
          : null,
        step === 2 && step2Phase !== "correct" && step2Phase !== "done"
          ? React.createElement("circle", {
              id: "step2-target-nudge",
              cx: toSvg(
                (step2NudgePoint || TARGET_A).x,
                (step2NudgePoint || TARGET_A).y,
              ).x,
              cy: toSvg(
                (step2NudgePoint || TARGET_A).x,
                (step2NudgePoint || TARGET_A).y,
              ).y,
              r: POINT_RADIUS + 14,
              fill: "transparent",
              stroke: "transparent",
              pointerEvents: "none",
            })
          : null,
        showPointA && pointCoords
          ? React.createElement("circle", {
              // ELEMENT: point-a — plotted / target point A circle
              id: "point-a",
              cx: toSvg(pointCoords.x, pointCoords.y).x,
              cy: toSvg(pointCoords.x, pointCoords.y).y,
              r: POINT_RADIUS,
              fill: pointColor,
              className: step6DimFirstQuadrant ? "rg-dehighlight" : undefined,
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
                fill: IMAGE_COLOR,
              }),
            )
          : null,
        showPointLabel ? renderPointLabel() : null,
        showAPrimeOverlays
          ? React.createElement("circle", {
              // ELEMENT: point-a-prime — reflected image A′ at (2, −4) (step 5 prop2)
              id: "point-a-prime",
              cx: aPrimePt.x,
              cy: aPrimePt.y,
              r: POINT_RADIUS,
              fill: IMAGE_COLOR,
              className:
                step === 5
                  ? "rg-fade-in" +
                    (apostFadeReady || prop2Done ? " is-visible" : "")
                  : undefined,
            })
          : null,
        showAPrimeOverlays && (step >= 6 || apostFadeReady || prop2Done)
          ? renderAPrimeLabel()
          : null,
        step === 6 ? renderStep6CoordinateClones() : null,
        renderStep7WrongClones(),
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
                fontFamily: "system-ui, sans-serif",
              },
              reflectionLabelParts
                ? React.createElement(
                    React.Fragment,
                    null,
                    React.createElement(
                      "tspan",
                      null,
                      reflectionLabelParts.before + reflectionLabelParts.prefix,
                    ),
                    React.createElement(
                      "tspan",
                      { fontFamily: MATH_FONT, fontStyle: "italic" },
                      "x",
                    ),
                    React.createElement(
                      "tspan",
                      null,
                      reflectionLabelParts.suffix + reflectionLabelParts.after,
                    ),
                  )
                : reflectionLabelText,
            )
          : null,
        calloutVisible && calloutMode === "prop2B" && calloutPos === "q4"
          ? renderCalloutBox("prop2A", "q1", {
              id: "callout-box-q1-copy",
              dimmed: true,
            })
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
