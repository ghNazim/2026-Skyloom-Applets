/* Grid: x -6..7 (13 units), y -3..7 (10 units). */
const TRANSLATION_GRAPH_CONFIG = {
  cols: 13,
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
  xMin: -6,
  xMax: 7,
  yMin: -3,
  yMax: 7,
  xLabelSkip: [-6, 7],
  yLabelSkip: [-3, 7],
};

const COLOR_PREIMAGE = APP_DATA.colors.object;
const COLOR_IMAGE = APP_DATA.colors.image;

const TranslationGraphPanel = ({
  points,
  segments,
  polygons,
  infiniteLines,
  translationPaths,
  labelRefs,
  coordRefs,
  translationOverlay,
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
  } = TRANSLATION_GRAPH_CONFIG;

  const GRID_W = COLS * UNIT;
  const GRID_H = ROWS * UNIT;
  const SVG_W = PAD_LEFT + GRID_W + PAD_RIGHT;
  const SVG_H = PAD_TOP + GRID_H + PAD_BOTTOM;
  const ORIGIN_X = PAD_LEFT + (0 - xMin) * UNIT;
  const ORIGIN_Y = PAD_TOP + (yMax - 0) * UNIT;

  const GRID_COLOR = "#3a6d8c";
  const AXIS_COLOR = "rgba(160, 170, 180, 0.7)";
  const AXIS_LABEL_COLOR = "rgba(160, 170, 180, 0.7)";
  const BG_COLOR = "none";

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
            fill: AXIS_LABEL_COLOR,
            fontSize: xLabelFontSize,
            fontWeight: "600",
            textAnchor: "middle",
            fontFamily: "system-ui, sans-serif",
            opacity: 0.7,
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
            fill: AXIS_LABEL_COLOR,
            fontSize: yLabelFontSize,
            fontWeight: "600",
            textAnchor: "middle",
            fontFamily: "system-ui, sans-serif",
            opacity: 0.7,
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
          fill: AXIS_LABEL_COLOR,
          fontSize: axisNameFontSize,
          fontWeight: "700",
          fontStyle: "italic",
          textAnchor: "middle",
          fontFamily: '"Times New Roman", Times, serif',
          opacity: 0.7,
        },
        "O",
      ),
      React.createElement(
        "text",
        {
          key: "axis-x",
          x: gridRight + 10,
          y: ORIGIN_Y + 6,
          fill: AXIS_LABEL_COLOR,
          fontSize: axisNameFontSize,
          fontWeight: "700",
          fontStyle: "italic",
          textAnchor: "middle",
          fontFamily: '"Times New Roman", Times, serif',
          opacity: 0.7,
        },
        "X",
      ),
      React.createElement(
        "text",
        {
          key: "axis-y",
          x: ORIGIN_X - 4,
          y: PAD_TOP - 8,
          fill: AXIS_LABEL_COLOR,
          fontSize: axisNameFontSize,
          fontWeight: "700",
          fontStyle: "italic",
          textAnchor: "middle",
          fontFamily: '"Times New Roman", Times, serif',
          opacity: 0.7,
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
    const blinkClass = pt.blink ? " tgp-point-blink" : "";

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
        className: "tgp-placed-point" + blinkClass,
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
          "tgp-point-circle" + (isClickable ? " is-clickable" : "") + blinkClass,
        id: showClickPulse ? undefined : pt.clickId || undefined,
        cx: pos.x,
        cy: pos.y,
        r: radius,
        fill: pt.hollow ? "none" : pt.color,
        stroke: pt.hollow ? pt.color : "#ffffff",
        strokeWidth: pt.hollow ? 3 : 1.5,
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
      className: "tgp-segment" + (seg.blink ? " tgp-line-blink" : ""),
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

  const renderInfiniteLine = (line, index) => {
    const from = toSvg(line.from.x, line.from.y);
    const to = toSvg(line.to.x, line.to.y);
    const grow = line.growProgress != null ? line.growProgress : 1;
    const drawTo = {
      x: from.x + (to.x - from.x) * grow,
      y: from.y + (to.y - from.y) * grow,
    };
    const labelT = line.labelT != null ? line.labelT : 0.25;
    const midX = from.x + (to.x - from.x) * labelT;
    const midY = from.y + (to.y - from.y) * labelT;
    const angle =
      (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI +
      (line.labelAngleOffset || 0);
    const blinkClass = line.blink ? " tgp-line-blink" : "";

    return React.createElement(
      "g",
      { key: "iline-" + index, className: "tgp-infinite-line" + blinkClass },
      React.createElement("line", {
        x1: from.x,
        y1: from.y,
        x2: drawTo.x,
        y2: drawTo.y,
        stroke: line.color,
        strokeWidth: line.strokeWidth || 3,
        opacity: line.opacity != null ? line.opacity : 1,
        markerStart: grow >= 1 ? "url(#tgp-line-arrow-start)" : undefined,
        markerEnd: grow >= 1 ? "url(#tgp-line-arrow-end)" : undefined,
      }),
      line.label && grow >= 0.85
        ? React.createElement(
            "text",
            {
              x: midX,
              y: midY - 12,
              fill: line.color,
              fontSize: 20,
              fontWeight: "700",
              textAnchor: "middle",
              fontFamily: "system-ui, sans-serif",
              transform:
                "rotate(" + angle + " " + midX + " " + midY + ")",
            },
            line.label,
          )
        : null,
    );
  };

  const renderTranslationPath = (path, index) => {
    const progress = path.progress != null ? path.progress : 1;
    if (progress <= 0) return null;

    const dx = path.dx != null ? path.dx : APP_DATA.translation.dx;
    const dy = path.dy != null ? path.dy : APP_DATA.translation.dy;
    const totalLen = Math.abs(dx) + Math.abs(dy);
    const traveled = progress * totalLen;
    const hTravel = Math.min(Math.abs(dx), traveled);
    const vTravel = Math.max(0, traveled - Math.abs(dx));

    const start = toSvg(path.from.x, path.from.y);
    const hEnd = toSvg(path.from.x + (dx > 0 ? hTravel : -hTravel), path.from.y);
    const corner = toSvg(path.from.x + dx, path.from.y);
    const end = toSvg(path.from.x + dx, path.from.y + (dy > 0 ? vTravel : -vTravel));
    const color = path.color || APP_DATA.colors.transformation;

    const els = [];
    if (hTravel > 0) {
      els.push(
        React.createElement("line", {
          key: "h",
          x1: start.x,
          y1: start.y,
          x2: hEnd.x,
          y2: hEnd.y,
          stroke: color,
          strokeWidth: 2.5,
        }),
      );
    }
    if (vTravel > 0) {
      els.push(
        React.createElement("line", {
          key: "v",
          x1: corner.x,
          y1: corner.y,
          x2: end.x,
          y2: end.y,
          stroke: color,
          strokeWidth: 2.5,
          markerEnd: "url(#tgp-path-arrow-end)",
        }),
      );
    }

    return React.createElement("g", { key: "tpath-" + index }, els);
  };

  const gridLeft = PAD_LEFT;
  const gridRight = PAD_LEFT + GRID_W;
  const gridTop = PAD_TOP;
  const gridBottom = PAD_TOP + GRID_H;
  const AXIS_STROKE = 2;
  const AXIS_ARROW_INSET = AXIS_STROKE * 6;
  const pointList = points || [];
  const segmentList = segments || [];
  const polygonList = polygons || [];
  const infiniteLineList = infiniteLines || [];
  const translationPathList = translationPaths || [];

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
            fill: "rgba(160, 170, 180, 0.7)",
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
            fill: "rgba(160, 170, 180, 0.7)",
          }),
        ),
        React.createElement(
          "marker",
          {
            id: "tgp-line-arrow-end",
            markerWidth: 8,
            markerHeight: 8,
            refX: 6,
            refY: 3,
            orient: "auto",
            markerUnits: "strokeWidth",
          },
          React.createElement("path", {
            d: "M0,0 L6,3 L0,6 z",
            fill: "context-stroke",
          }),
        ),
        React.createElement(
          "marker",
          {
            id: "tgp-line-arrow-start",
            markerWidth: 8,
            markerHeight: 8,
            refX: 0,
            refY: 3,
            orient: "auto-start-reverse",
            markerUnits: "strokeWidth",
          },
          React.createElement("path", {
            d: "M0,0 L6,3 L0,6 z",
            fill: "context-stroke",
          }),
        ),
        React.createElement(
          "marker",
          {
            id: "tgp-path-arrow-end",
            markerWidth: 8,
            markerHeight: 8,
            refX: 6,
            refY: 3,
            orient: "auto",
            markerUnits: "strokeWidth",
          },
          React.createElement("path", {
            d: "M0,0 L6,3 L0,6 z",
            fill: APP_DATA.colors.transformation,
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
        opacity: 0.7,
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
        opacity: 0.7,
        markerStart: "url(#tgp-arrow-start)",
        markerEnd: "url(#tgp-arrow-end)",
      }),
      axisLabels,
      polygonList.map(renderPolygon),
      infiniteLineList.map(renderInfiniteLine),
      segmentList.map(renderSegment),
      translationPathList.map(renderTranslationPath),
      pointList.map((pt) => renderPoint(pt)),
      translationOverlay && translationOverlay.active
        ? React.createElement(
            "g",
            {
              className: "tgp-translation-clone",
              transform:
                "translate(" +
                translationOverlay.offsetX +
                "," +
                translationOverlay.offsetY +
                ")",
              opacity:
                translationOverlay.opacity != null
                  ? translationOverlay.opacity
                  : 1,
            },
            (translationOverlay.infiniteLines || []).map((line, i) =>
              renderInfiniteLine(line, "clone-" + i),
            ),
            (translationOverlay.segments || []).map((seg, i) =>
              renderSegment(seg, "clone-" + i),
            ),
            (translationOverlay.points || []).map((pt) =>
              renderPoint(pt, { isClone: true, keySuffix: "clone-" }),
            ),
          )
        : null,
    ),
  );
};

const TRANSLATION_GRAPH_COLORS = {
  preimage: COLOR_PREIMAGE,
  image: COLOR_IMAGE,
};

/* Clip line ax + by + c = 0 to grid bounds. For x+y=2: a=1,b=1,c=-2 */
function clipLineToGrid(a, b, c, xMin, xMax, yMin, yMax) {
  const pts = [];
  const addIfInside = (x, y) => {
    if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
      pts.push({ x: x, y: y });
    }
  };

  if (b !== 0) {
    addIfInside(xMin, (-c - a * xMin) / b);
    addIfInside(xMax, (-c - a * xMax) / b);
  }
  if (a !== 0) {
    addIfInside((-c - b * yMin) / a, yMin);
    addIfInside((-c - b * yMax) / a, yMax);
  }

  const unique = [];
  pts.forEach((p) => {
    const exists = unique.some(
      (q) => Math.abs(q.x - p.x) < 0.001 && Math.abs(q.y - p.y) < 0.001,
    );
    if (!exists) unique.push(p);
  });

  if (unique.length < 2) return null;
  return { from: unique[0], to: unique[1] };
}

const LINE_CLIP_BOUNDS = {
  xMin: TRANSLATION_GRAPH_CONFIG.xMin,
  xMax: TRANSLATION_GRAPH_CONFIG.xMax,
  yMin: TRANSLATION_GRAPH_CONFIG.yMin,
  yMax: TRANSLATION_GRAPH_CONFIG.yMax,
};

const OBJECT_LINE_CLIP = clipLineToGrid(1, 1, -2, LINE_CLIP_BOUNDS.xMin, LINE_CLIP_BOUNDS.xMax, LINE_CLIP_BOUNDS.yMin, LINE_CLIP_BOUNDS.yMax);
const IMAGE_LINE_CLIP = clipLineToGrid(1, 1, -5, LINE_CLIP_BOUNDS.xMin, LINE_CLIP_BOUNDS.xMax, LINE_CLIP_BOUNDS.yMin, LINE_CLIP_BOUNDS.yMax);
