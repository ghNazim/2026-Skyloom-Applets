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

const COLOR_PREIMAGE = "#E97132";
const COLOR_IMAGE = "#45C6CE";

const TranslationGraphPanel = ({
  points,
  segments,
  labelRefs,
}) => {
  const { useCallback, useMemo } = React;

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
    xMin,
    xMax,
    yMin,
    yMax,
    xLabelSkip,
    yLabelSkip,
  } = ROTATION_GRAPH_CONFIG;

  const GRID_W = COLS * UNIT;
  const GRID_H = ROWS * UNIT;
  const SVG_W = PAD_LEFT + GRID_W + PAD_RIGHT;
  const SVG_H = PAD_TOP + GRID_H + PAD_BOTTOM;
  const ORIGIN_X = PAD_LEFT + (0 - xMin) * UNIT;
  const ORIGIN_Y = PAD_TOP + (yMax - 0) * UNIT;

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
    xMin,
    xMax,
    yMin,
    yMax,
    xLabelSkip,
    yLabelSkip,
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

  const renderPoint = (pt) => {
    const pos = toSvg(pt.x, pt.y);
    const labelPos = getLabelPosition(pt, pos);
    const radius = pt.radius || pointRadius;
    const opacity = pt.opacity != null ? pt.opacity : 1;
    const showLabel = pt.showLabel !== false && pt.label;

    return React.createElement(
      "g",
      {
        key: pt.id,
        className: "tgp-placed-point",
        opacity: opacity,
        style: pt.opacity === 0 ? { pointerEvents: "none" } : undefined,
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
                if (labelRefs && pt.labelRefKey) {
                  labelRefs.current[pt.labelRefKey] = el;
                }
              },
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
      }),
    );
  };

  const renderSegment = (seg, index) => {
    const from = toSvg(seg.from.x, seg.from.y);
    const to = toSvg(seg.to.x, seg.to.y);
    const lineLen = Math.hypot(to.x - from.x, to.y - from.y);
    const growing = seg.animateGrow;
    const lineStyle = growing
      ? {
          strokeDasharray: lineLen,
          strokeDashoffset: lineLen,
          animation: "tgp-line-grow 0.9s ease forwards",
        }
      : undefined;
    return React.createElement("line", {
      key: (seg.segKey || "seg") + "-" + index,
      className: "tgp-segment" + (growing ? " is-growing" : ""),
      x1: from.x,
      y1: from.y,
      x2: to.x,
      y2: to.y,
      stroke: seg.color,
      strokeWidth: seg.strokeWidth || 2.5,
      strokeDasharray: growing ? undefined : seg.dashed ? "8 6" : undefined,
      opacity: seg.opacity != null ? seg.opacity : 1,
      style: lineStyle,
    });
  };

  const gridLeft = PAD_LEFT;
  const gridRight = PAD_LEFT + GRID_W;
  const gridTop = PAD_TOP;
  const gridBottom = PAD_TOP + GRID_H;
  const AXIS_STROKE = 2;
  const AXIS_ARROW_INSET = AXIS_STROKE * 6;
  const pointList = points || [];
  const segmentList = segments || [];

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
        x1: ORIGIN_X,
        y1: gridTop + AXIS_ARROW_INSET,
        x2: ORIGIN_X,
        y2: gridBottom,
        stroke: AXIS_COLOR,
        strokeWidth: AXIS_STROKE,
        markerStart: "url(#tgp-arrow-start)",
        markerEnd: "url(#tgp-arrow-end)",
      }),
      axisLabels,
      segmentList.map(renderSegment),
      pointList.map(renderPoint),
    ),
  );
};

const TRANSLATION_GRAPH_COLORS = {
  preimage: COLOR_PREIMAGE,
  image: COLOR_IMAGE,
};
