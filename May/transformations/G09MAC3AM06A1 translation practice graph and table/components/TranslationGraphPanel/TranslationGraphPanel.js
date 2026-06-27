/* Grid: origin + 13 numbered x-units + 1 trailing gap column (cols=15). */
const TRANSLATION_GRAPH_CONFIG = {
  cols: 15,
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
  pointLabelOffsetYBelow: 25,
};

const COLOR_PREIMAGE = "#E97132";
const COLOR_IMAGE = "#45C6CE";

const TranslationGraphPanel = ({
  points,
  segments,
  labelRefs,
}) => {
  const { useRef, useCallback, useMemo } = React;

  const svgRef = useRef(null);

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
  } = TRANSLATION_GRAPH_CONFIG;

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

    for (let i = 1; i <= 13; i++) {
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
        y: pos.y + pointRadius + pointLabelOffsetYBelow,
        anchor: "middle",
      };
    }
    if (placement === "right") {
      return { x: pos.x + pointRadius + 8, y: pos.y + 6, anchor: "start" };
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

  const gridRight = PAD_LEFT + GRID_W;
  const pointList = points || [];
  const segmentList = segments || [];

  return React.createElement(
    "div",
    { className: "translation-graph-panel", ref: svgRef },
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
        x1: ORIGIN_X - 14,
        y1: ORIGIN_Y,
        x2: gridRight + 6,
        y2: ORIGIN_Y,
        stroke: AXIS_COLOR,
        strokeWidth: 2,
        markerStart: "url(#tgp-arrow-start)",
        markerEnd: "url(#tgp-arrow-end)",
      }),
      React.createElement("line", {
        x1: ORIGIN_X,
        y1: ORIGIN_Y + 14,
        x2: ORIGIN_X,
        y2: PAD_TOP - 4,
        stroke: AXIS_COLOR,
        strokeWidth: 2,
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
