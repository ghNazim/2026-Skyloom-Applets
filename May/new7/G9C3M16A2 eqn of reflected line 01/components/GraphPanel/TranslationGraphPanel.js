/* Grid: 14 horizontal units (-7..7), 10 vertical units (-5..5), origin at center. */
const ROTATION_GRAPH_CONFIG = {
  cols: 14,
  rows: 10,
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
  pointLabelOffsetYBelow: 25,
  xMin: -7,
  xMax: 7,
  yMin: -5,
  yMax: 5,
  xLabelSkip: [-7, 7],
  yLabelSkip: [-5, 5],
};

/* Grid: 16 horizontal units (-8..8), 10 vertical units (-4..6), origin 1 below center. */
const REFLECTION_LINE_GRAPH_CONFIG = {
  cols: 16,
  rows: 10,
  unit: 44,
  padLeft: 40,
  padRight: 40,
  padTop: 28,
  padBottom: 32,
  xLabelFontSize: 18,
  yLabelFontSize: 18,
  axisNameFontSize: 27,
  pointRadius: 9,
  pointLabelFontSize: 21,
  equationLabelFontSize: 32,
  pointLabelOffsetY: 21,
  pointLabelOffsetYBelow: 25,
  xMin: -8,
  xMax: 8,
  yMin: -4,
  yMax: 6,
  xLabelSkip: [-8, 8],
  yLabelSkip: [-4, 6],
  xAxisName: "x",
  yAxisName: "y",
};

function extendLineToGridBounds(x1, y1, x2, y2, xMin, xMax, yMin, yMax) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  if (dx === 0 && dy === 0) return null;

  var hits = [];

  if (dx !== 0) {
    var tLeft = (xMin - x1) / dx;
    var yLeft = y1 + tLeft * dy;
    if (yLeft >= yMin - 0.001 && yLeft <= yMax + 0.001) {
      hits.push({ x: xMin, y: yLeft, t: tLeft });
    }

    var tRight = (xMax - x1) / dx;
    var yRight = y1 + tRight * dy;
    if (yRight >= yMin - 0.001 && yRight <= yMax + 0.001) {
      hits.push({ x: xMax, y: yRight, t: tRight });
    }
  }

  if (dy !== 0) {
    var tBottom = (yMin - y1) / dy;
    var xBottom = x1 + tBottom * dx;
    if (xBottom >= xMin - 0.001 && xBottom <= xMax + 0.001) {
      hits.push({ x: xBottom, y: yMin, t: tBottom });
    }

    var tTop = (yMax - y1) / dy;
    var xTop = x1 + tTop * dx;
    if (xTop >= xMin - 0.001 && xTop <= xMax + 0.001) {
      hits.push({ x: xTop, y: yMax, t: tTop });
    }
  }

  if (hits.length < 2) return null;

  hits.sort(function (a, b) {
    return a.t - b.t;
  });

  var unique = [];
  hits.forEach(function (hit) {
    var duplicate = unique.some(function (existing) {
      return (
        Math.abs(existing.x - hit.x) < 0.001 &&
        Math.abs(existing.y - hit.y) < 0.001
      );
    });
    if (!duplicate) unique.push(hit);
  });

  if (unique.length < 2) return null;

  unique.sort(function (a, b) {
    return a.t - b.t;
  });

  return {
    from: { x: unique[0].x, y: unique[0].y },
    to: { x: unique[unique.length - 1].x, y: unique[unique.length - 1].y },
  };
}

const COLOR_PREIMAGE = "#E97132";
const COLOR_IMAGE = "#45C6CE";

const TranslationGraphPanel = ({
  points,
  segments,
  extendedLines,
  polygons,
  labelRefs,
  coordRefs,
  rotationOverlay,
  graphConfig,
  yAxisHighlight,
  xAxisLeftName,
  dimAxisNumbers,
  reflectionAxisLine,
}) => {
  const { useCallback, useMemo } = React;

  const cfg = graphConfig || ROTATION_GRAPH_CONFIG;

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
    pointLabelOffsetYBelow,
    equationLabelFontSize,
    xMin,
    xMax,
    yMin,
    yMax,
    xLabelSkip,
    yLabelSkip,
    xAxisName,
    yAxisName,
  } = cfg;

  const GRID_W = COLS * UNIT;
  const GRID_H = ROWS * UNIT;
  const SVG_W = PAD_LEFT + GRID_W + PAD_RIGHT;
  const SVG_H = PAD_TOP + GRID_H + PAD_BOTTOM;
  const ORIGIN_X = PAD_LEFT + (0 - xMin) * UNIT;
  const ORIGIN_Y = PAD_TOP + (yMax - 0) * UNIT;

  const GRID_COLOR = "#3a6d8c";
  const AXIS_COLOR = "#ffffff";
  const BG_COLOR = "none";
  const AXIS_NUMBER_OPACITY = dimAxisNumbers ? 0.5 : 1;

  const toSvg = useCallback(
    (gx, gy) => ({
      x: ORIGIN_X + gx * UNIT,
      y: ORIGIN_Y - gy * UNIT,
    }),
    [ORIGIN_X, ORIGIN_Y, UNIT],
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

    for (let i = xMin; i <= xMax; i++) {
      if (i === 0 || xLabelSkip.indexOf(i) !== -1) continue;
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
            opacity: AXIS_NUMBER_OPACITY,
          },
          String(i),
        ),
      );
    }

    for (let i = yMin; i <= yMax; i++) {
      if (i === 0 || yLabelSkip.indexOf(i) !== -1) continue;
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
            opacity: AXIS_NUMBER_OPACITY,
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
          fontStyle: "italic",
          textAnchor: "middle",
          fontFamily: "\"Times New Roman\", Times, serif",
        },
        "O",
      ),
    );
    if (xAxisLeftName) {
      els.push(
        React.createElement(
          "text",
          {
            key: "axis-x-left",
            x: PAD_LEFT - 10,
            y: ORIGIN_Y + 6,
            fill: AXIS_COLOR,
            fontSize: axisNameFontSize,
            fontWeight: "700",
            fontStyle: "italic",
            textAnchor: "middle",
            fontFamily: "\"Times New Roman\", Times, serif",
          },
          xAxisLeftName,
        ),
      );
    }
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
          fontStyle: "italic",
          textAnchor: "middle",
          fontFamily: "\"Times New Roman\", Times, serif",
        },
        xAxisName || "X",
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
          fontStyle: "italic",
          textAnchor: "middle",
          fontFamily: "\"Times New Roman\", Times, serif",
        },
        yAxisName || "Y",
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
    xMin,
    xMax,
    yMin,
    yMax,
    xLabelSkip,
    yLabelSkip,
    xAxisLeftName,
    xAxisName,
    yAxisName,
    dimAxisNumbers,
  ]);

  const getLabelPosition = (pt, pos) => {
    const placement = pt.labelPlacement || "above";
    if (placement === "below") {
      return {
        x: pos.x,
        y: pos.y + pointRadius + pointLabelOffsetYBelow,
        anchor: "middle",
      };
    }
    if (placement === "right") {
      return { x: pos.x + pointRadius + 8, y: pos.y + 6, anchor: "start" };
    }
    if (placement === "left") {
      return { x: pos.x - pointRadius - 8, y: pos.y + 6, anchor: "end" };
    }
    return { x: pos.x, y: pos.y - pointLabelOffsetY, anchor: "middle" };
  };

  const renderPoint = (pt, options = {}) => {
    const pos = toSvg(pt.x, pt.y);
    const labelPos = getLabelPosition(pt, pos);
    const radius = pt.radius || pointRadius;
    const circleOpacity =
      pt.circleOpacity != null
        ? pt.circleOpacity
        : pt.opacity != null
          ? pt.opacity
          : 1;
    const showLabel = pt.showLabel !== false && pt.label;
    const isClickable = pt.clickable && !options.isClone;
    const showClickPulse = pt.showClickPulse && isClickable;
    const pulseRadius = pt.pulseRadius || radius * 2.4;
    const prefixKey = pt.labelPrefix || pt.label;

    const renderLabelContent = () => {
      if (pt.coordParts) {
        const cp = pt.coordParts;
        return React.createElement(
          React.Fragment,
          null,
          prefixKey + " (",
          React.createElement(
            "tspan",
            {
              ref: (el) => {
                if (coordRefs && pt.coordXRefKey) {
                  coordRefs.current[pt.coordXRefKey] = el;
                }
              },
            },
            cp.x,
          ),
          ",",
          React.createElement(
            "tspan",
            {
              ref: (el) => {
                if (coordRefs && pt.coordYRefKey) {
                  coordRefs.current[pt.coordYRefKey] = el;
                }
              },
            },
            cp.y,
          ),
          ")",
        );
      }
      return pt.label;
    };

    return React.createElement(
      "g",
      {
        key: (options.keySuffix || "") + pt.id,
        className: "tgp-placed-point",
      },
      showLabel
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
              opacity: pt.labelOpacity != null ? pt.labelOpacity : 1,
              ref: (el) => {
                if (labelRefs && pt.labelRefKey && !pt.coordParts) {
                  labelRefs.current[pt.labelRefKey] = el;
                }
                if (labelRefs && pt.labelRefKey && pt.coordParts) {
                  labelRefs.current[pt.labelRefKey] = el;
                }
              },
            },
            renderLabelContent(),
          )
        : null,
      showClickPulse
        ? React.createElement("circle", {
            className: "tgp-click-pulse",
            id: pt.clickId || undefined,
            cx: pos.x,
            cy: pos.y,
            r: pulseRadius,
            onClick: pt.onClick,
          })
        : null,
      React.createElement("circle", {
        className:
          "tgp-point-circle" + (isClickable ? " is-clickable" : ""),
        id: showClickPulse ? undefined : pt.clickId || undefined,
        cx: pos.x,
        cy: pos.y,
        r: radius,
        fill: pt.color,
        stroke: "#ffffff",
        strokeWidth: 1.5,
        opacity: circleOpacity,
        onClick: isClickable ? pt.onClick : undefined,
        style: isClickable ? { pointerEvents: "all", cursor: "pointer" } : undefined,
      }),
    );
  };

  const renderPolygon = (poly, index) => {
    const pointsStr = poly.vertices
      .map((v) => {
        const p = toSvg(v.x, v.y);
        return p.x + "," + p.y;
      })
      .join(" ");
    return React.createElement("polygon", {
      key: "poly-" + index,
      className: "tgp-polygon",
      points: pointsStr,
      fill: poly.color,
      fillOpacity: poly.fillOpacity != null ? poly.fillOpacity : 0.7,
      stroke: poly.noStroke ? "none" : poly.stroke != null ? poly.stroke : poly.color,
      strokeWidth: poly.noStroke ? 0 : poly.strokeWidth || 2.5,
      opacity: poly.opacity != null ? poly.opacity : 1,
    });
  };

  const renderSegment = (seg, index) => {
    const from = toSvg(seg.from.x, seg.from.y);
    const to = toSvg(seg.to.x, seg.to.y);
    return React.createElement("line", {
      key: "seg-" + index,
      className: "tgp-segment",
      x1: from.x,
      y1: from.y,
      x2: to.x,
      y2: to.y,
      stroke: seg.color,
      strokeWidth: seg.strokeWidth || 2.5,
      strokeDasharray: seg.dashed ? "8 6" : undefined,
      opacity: seg.opacity != null ? seg.opacity : 1,
    });
  };

  const renderExtendedLine = (line, index) => {
    const bounds = extendLineToGridBounds(
      line.through[0].x,
      line.through[0].y,
      line.through[1].x,
      line.through[1].y,
      xMin,
      xMax,
      yMin,
      yMax,
    );
    if (!bounds) return null;

    const from = toSvg(bounds.from.x, bounds.from.y);
    const to = toSvg(bounds.to.x, bounds.to.y);
    const strokeWidth = line.strokeWidth || 2.5;
    const markerStartId = "tgp-ext-arrow-start-" + index;
    const markerEndId = "tgp-ext-arrow-end-" + index;
    const color = line.color || AXIS_COLOR;
    const growFromCenter = line.growFromCenter === true;
    const noArrows = line.noArrows === true;

    const markerDefs = noArrows
      ? null
      : React.createElement(
          "defs",
          null,
          React.createElement(
            "marker",
            {
              id: markerEndId,
              markerWidth: 8,
              markerHeight: 8,
              refX: 6,
              refY: 3,
              orient: "auto",
              markerUnits: "strokeWidth",
            },
            React.createElement("path", {
              d: "M0,0 L6,3 L0,6 z",
              fill: color,
            }),
          ),
          React.createElement(
            "marker",
            {
              id: markerStartId,
              markerWidth: 8,
              markerHeight: 8,
              refX: 0,
              refY: 3,
              orient: "auto-start-reverse",
              markerUnits: "strokeWidth",
            },
            React.createElement("path", {
              d: "M0,0 L6,3 L0,6 z",
              fill: color,
            }),
          ),
        );

    if (!growFromCenter) {
      return React.createElement(
        React.Fragment,
        { key: "ext-" + index },
        markerDefs,
        React.createElement("line", {
          className: "tgp-extended-line",
          x1: from.x,
          y1: from.y,
          x2: to.x,
          y2: to.y,
          stroke: color,
          strokeWidth: strokeWidth,
          strokeDasharray: line.dashed ? "8 6" : undefined,
          opacity: line.opacity != null ? line.opacity : 1,
          markerStart: noArrows ? undefined : "url(#" + markerStartId + ")",
          markerEnd: noArrows ? undefined : "url(#" + markerEndId + ")",
        }),
      );
    }

    const midGraph = {
      x: (line.through[0].x + line.through[1].x) / 2,
      y: (line.through[0].y + line.through[1].y) / 2,
    };
    const mid = toSvg(midGraph.x, midGraph.y);
    const lenTowardFrom = Math.hypot(from.x - mid.x, from.y - mid.y);
    const lenTowardTo = Math.hypot(to.x - mid.x, to.y - mid.y);
    const dashedClass = line.dashed ? " is-dashed" : "";
    const capLen = 4;
    const dirFromX = from.x - mid.x;
    const dirFromY = from.y - mid.y;
    const dirToX = to.x - mid.x;
    const dirToY = to.y - mid.y;
    const lenFromDir = Math.hypot(dirFromX, dirFromY) || 1;
    const lenToDir = Math.hypot(dirToX, dirToY) || 1;

    const equationLabelEl = line.equationLabel
      ? (function () {
          const labelGraphX = (bounds.from.x + bounds.to.x) / 2;
          const labelGraphY = (bounds.from.y + bounds.to.y) / 2;
          const labelPos = toSvg(labelGraphX, labelGraphY);
          const angleRad = Math.atan2(to.y - from.y, to.x - from.x);
          const angleDeg = (angleRad * 180) / Math.PI + 180;
          const perpOffset =
            line.labelOffset != null ? line.labelOffset : -20;
          const lx = labelPos.x + Math.sin(angleRad) * perpOffset;
          const ly = labelPos.y - Math.cos(angleRad) * perpOffset;

          return React.createElement(
            "text",
            {
              className:
                "tgp-line-equation" +
                (line.showLabelAfterGrow ? " tgp-after-grow" : ""),
              x: lx,
              y: ly,
              fill: line.labelColor || REFLECTION_GRAPH_YELLOW,
              fontSize:
                line.labelFontSize ||
                equationLabelFontSize ||
                pointLabelFontSize,
              fontWeight: "600",
              textAnchor: "middle",
              dominantBaseline: "middle",
              transform:
                "rotate(" + angleDeg + " " + lx + " " + ly + ")",
              fontFamily: "system-ui, sans-serif",
            },
            line.equationLabel,
          );
        })()
      : null;

    return React.createElement(
      "g",
      {
        key: "ext-" + index,
        className:
          "tgp-extended-line-grow" +
          dashedClass +
          (noArrows ? " tgp-reflection-axis-grow" : ""),
      },
      markerDefs,
      React.createElement("line", {
        className: "tgp-ext-half",
        x1: mid.x,
        y1: mid.y,
        x2: from.x,
        y2: from.y,
        stroke: color,
        strokeWidth: strokeWidth,
        opacity: line.opacity != null ? line.opacity : 1,
        style: {
          strokeDasharray: lenTowardFrom,
          strokeDashoffset: lenTowardFrom,
        },
      }),
      React.createElement("line", {
        className: "tgp-ext-half",
        x1: mid.x,
        y1: mid.y,
        x2: to.x,
        y2: to.y,
        stroke: color,
        strokeWidth: strokeWidth,
        opacity: line.opacity != null ? line.opacity : 1,
        style: {
          strokeDasharray: lenTowardTo,
          strokeDashoffset: lenTowardTo,
        },
      }),
      noArrows
        ? null
        : React.createElement("line", {
            className: "tgp-ext-arrow-cap",
            x1: from.x - (dirFromX / lenFromDir) * capLen,
            y1: from.y - (dirFromY / lenFromDir) * capLen,
            x2: from.x,
            y2: from.y,
            stroke: color,
            strokeWidth: strokeWidth,
            markerEnd: "url(#" + markerEndId + ")",
          }),
      noArrows
        ? null
        : React.createElement("line", {
            className: "tgp-ext-arrow-cap",
            x1: to.x - (dirToX / lenToDir) * capLen,
            y1: to.y - (dirToY / lenToDir) * capLen,
            x2: to.x,
            y2: to.y,
            stroke: color,
            strokeWidth: strokeWidth,
            markerEnd: "url(#" + markerEndId + ")",
          }),
      equationLabelEl,
    );
  };

  const gridLeft = PAD_LEFT;
  const gridRight = PAD_LEFT + GRID_W;
  const gridTop = PAD_TOP;
  const gridBottom = PAD_TOP + GRID_H;
  const AXIS_STROKE = 2;
  /* Marker path tip is at x=6 with markerUnits=strokeWidth; inset so tip lands on grid edge. */
  const AXIS_ARROW_INSET = AXIS_STROKE * 6;
  const pointList = points || [];
  const segmentList = segments || [];
  const extendedLineList = extendedLines || [];
  const polygonList = polygons || [];
  const reflectionAxisLineEl = reflectionAxisLine
    ? renderExtendedLine(reflectionAxisLine, "refl-axis")
    : null;
  const yAxisColor = yAxisHighlight ? REFLECTION_GRAPH_ORANGE : AXIS_COLOR;
  const yAxisStroke = yAxisHighlight ? 3.5 : AXIS_STROKE;

  return React.createElement(
    "div",
    { className: "translation-graph-panel" },
    React.createElement(
      "svg",
      {
        className: "translation-graph-svg",
        viewBox: "0 0 " + SVG_W + " " + SVG_H,
        preserveAspectRatio: "xMidYMid meet",
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
            id: "tgp-arrow-end",
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
            id: "tgp-arrow-start",
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
        React.createElement(
          "marker",
          {
            id: "tgp-y-arrow-end",
            markerWidth: 8,
            markerHeight: 8,
            refX: 6,
            refY: 3,
            orient: "auto",
            markerUnits: "strokeWidth",
          },
          React.createElement("path", {
            d: "M0,0 L6,3 L0,6 z",
            fill: yAxisColor,
          }),
        ),
        React.createElement(
          "marker",
          {
            id: "tgp-y-arrow-start",
            markerWidth: 8,
            markerHeight: 8,
            refX: 0,
            refY: 3,
            orient: "auto-start-reverse",
            markerUnits: "strokeWidth",
          },
          React.createElement("path", {
            d: "M0,0 L6,3 L0,6 z",
            fill: yAxisColor,
          }),
        ),
      ),
      gridLines,
      React.createElement("line", {
        x1: gridLeft + AXIS_ARROW_INSET,
        y1: ORIGIN_Y,
        x2: gridRight,
        y2: ORIGIN_Y,
        stroke: AXIS_COLOR,
        strokeWidth: AXIS_STROKE,
        markerStart: "url(#tgp-arrow-start)",
        markerEnd: "url(#tgp-arrow-end)",
      }),
      React.createElement("line", {
        className:
          "tgp-y-axis" + (yAxisHighlight ? " tgp-y-axis-highlight" : ""),
        x1: ORIGIN_X,
        y1: gridTop + AXIS_ARROW_INSET,
        x2: ORIGIN_X,
        y2: gridBottom,
        stroke: yAxisColor,
        strokeWidth: yAxisStroke,
        markerStart: "url(#tgp-y-arrow-start)",
        markerEnd: "url(#tgp-y-arrow-end)",
      }),
      reflectionAxisLineEl,
      axisLabels,
      polygonList.map(renderPolygon),
      extendedLineList.map(renderExtendedLine),
      segmentList.map(renderSegment),
      pointList.map((pt) => renderPoint(pt)),
      rotationOverlay && rotationOverlay.active
        ? React.createElement(
            "g",
            {
              className: "tgp-rotation-clone",
              transform:
                "rotate(" +
                rotationOverlay.angle +
                " " +
                ORIGIN_X +
                " " +
                ORIGIN_Y +
                ")",
              opacity: rotationOverlay.opacity != null ? rotationOverlay.opacity : 1,
            },
            (rotationOverlay.polygons || []).map(renderPolygon),
            (rotationOverlay.segments || []).map(renderSegment),
            (rotationOverlay.points || []).map((pt) =>
              renderPoint(pt, { isClone: true, keySuffix: "clone-" }),
            ),
          )
        : null,
    ),
  );
};

const ROTATION_GRAPH_ORIGIN = {
  getOrigin: () => {
    const cfg = ROTATION_GRAPH_CONFIG;
    return {
      x: cfg.padLeft + (0 - cfg.xMin) * cfg.unit,
      y: cfg.padTop + (cfg.yMax - 0) * cfg.unit,
    };
  },
};

const TRANSLATION_GRAPH_COLORS = {
  preimage: COLOR_PREIMAGE,
  image: COLOR_IMAGE,
};

const REFLECTION_GRAPH_YELLOW = "#FFD34D";
const REFLECTION_GRAPH_ORANGE = "#E97132";
