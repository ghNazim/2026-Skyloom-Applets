const svg_font_size = 17 * 1.6;
const LABEL_OFFSET_SCALE = 0.85;

// Tweak these to adjust label placement across the graph.
const AXIS_LABEL_OFFSET = 0.28;
const POINT_LABEL_OFFSET = 0.38;
const POINT_LABEL_ABOVE_RIGHT_OFFSET = 0.45;
const XK_REFLECTED_LABEL_LEFT_OFFSET = 0.45;
const YNEG_X_REFLECTED_LABEL_LEFT_OFFSET = 0.45;

const AXIS_INTERSECTION_OFFSETS = {
  positiveX: { x: AXIS_LABEL_OFFSET, y: -AXIS_LABEL_OFFSET },
  negativeX: { x: -AXIS_LABEL_OFFSET, y: -AXIS_LABEL_OFFSET },
  positiveY: { x: -AXIS_LABEL_OFFSET, y: AXIS_LABEL_OFFSET },
  negativeY: { x: -AXIS_LABEL_OFFSET, y: -AXIS_LABEL_OFFSET },
};

const HK_INTERSECTION_LABEL_OFFSET = AXIS_LABEL_OFFSET;
const AXIS_INTERSECTION_TICK_SIZE = 0.5;
const AXIS_INTERSECTION_TICK_WIDTH = 6;
const XK_EQUATION_LABEL_RIGHT_OFFSET = 0.35;
const Y_AXIS_EQUATION_LABEL_RIGHT_OFFSET = 0.4;
const LINE_YX_EQUATION_LABEL_LEFT_OFFSET = 0.45;
const LINE_YNEG_X_EQUATION_LABEL_LEFT_OFFSET = 0.45;
const HK_POINT_RADIUS = 5;

const HK_INTERSECTION_TOP_RIGHT = {
  offset: {
    x: HK_INTERSECTION_LABEL_OFFSET,
    y: HK_INTERSECTION_LABEL_OFFSET,
  },
  anchor: "start",
  baseline: "text-after-edge",
};

const HK_INTERSECTION_BOTTOM_RIGHT = {
  offset: {
    x: HK_INTERSECTION_LABEL_OFFSET,
    y: -HK_INTERSECTION_LABEL_OFFSET,
  },
  anchor: "start",
  baseline: "hanging",
};

const POINT_LABEL_ABOVE = {
  offset: { x: 0, y: POINT_LABEL_OFFSET },
  anchor: "middle",
  baseline: "text-after-edge",
};

const POINT_LABEL_BELOW = {
  offset: { x: 0, y: -POINT_LABEL_OFFSET },
  anchor: "middle",
  baseline: "text-before-edge",
};

const POINT_LABEL_ABOVE_RIGHT = {
  offset: {
    x: POINT_LABEL_OFFSET * POINT_LABEL_ABOVE_RIGHT_OFFSET,
    y: POINT_LABEL_OFFSET,
  },
  anchor: "start",
  baseline: "text-after-edge",
};

const POINT_LABEL_ABOVE_LEFT = {
  offset: { x: -XK_REFLECTED_LABEL_LEFT_OFFSET, y: POINT_LABEL_OFFSET },
  anchor: "end",
  baseline: "text-after-edge",
};

const POINT_LABEL_BELOW_LEFT = {
  offset: { x: -YNEG_X_REFLECTED_LABEL_LEFT_OFFSET, y: -POINT_LABEL_OFFSET },
  anchor: "end",
  baseline: "text-before-edge",
};

const ReflectionGraph = ({ visual }) => {
  const caseConfig = visual.caseId ? REFLECTION_CASES[visual.caseId] : null;
  const graphText = APP_DATA.graph;

  const renderLine = (from, to, className, key, progress = 1, extra = {}) => {
    const end = interpolateGraphPoint(from, to, progress);
    const p1 = graphToSvg(from);
    const p2 = graphToSvg(end);
    return React.createElement("line", {
      key,
      x1: p1.x,
      y1: p1.y,
      x2: p2.x,
      y2: p2.y,
      className,
      ...extra,
    });
  };

  const renderLabel = (
    point,
    text,
    className,
    key,
    placement = { offset: { x: 0, y: 0 }, anchor: "middle", baseline: "middle" },
  ) => {
    const scaled = scaleLabelOffset(placement.offset);
    const p = graphToSvg({ x: point.x + scaled.x, y: point.y + scaled.y });
    return React.createElement(
      "text",
      {
        key,
        x: p.x,
        y: p.y,
        className,
        textAnchor: placement.anchor,
        dominantBaseline: placement.baseline,
        style: { fontSize: svg_font_size },
      },
      text,
    );
  };

  const renderPointLabel = (point, key, reflected = false) => {
    const placement = getPointLabelPlacement(visual.caseId, reflected);
    const p = graphToSvg({
      x: point.x + placement.offset.x,
      y: point.y + placement.offset.y,
    });
    const label = reflected
      ? graphText.reflectedPointLabels[visual.caseId]
      : graphText.initialPointLabel;
    const parts = getPointLabelParts(label);

    return React.createElement(
      "text",
      {
        key,
        x: p.x,
        y: p.y,
        className: "reflection-point-label" + (reflected ? " reflected" : ""),
        textAnchor: placement.anchor,
        dominantBaseline: placement.baseline,
        style: { fontSize: svg_font_size },
      },
      parts.map((part, index) =>
        React.createElement(
          "tspan",
          { key: index, className: part.className },
          part.text,
        ),
      ),
      label ? null : null,
    );
  };

  const renderAxisIntersectionTick = (point, key) => {
    const epsilon = 0.001;
    const half = AXIS_INTERSECTION_TICK_SIZE / 2;
    const tickStyle = { strokeWidth: AXIS_INTERSECTION_TICK_WIDTH };

    if (Math.abs(point.y) < epsilon) {
      return renderLine(
        { x: point.x, y: -half },
        { x: point.x, y: half },
        "reflection-axis-intersection-tick",
        key,
        1,
        tickStyle,
      );
    }

    if (Math.abs(point.x) < epsilon) {
      return renderLine(
        { x: -half, y: point.y },
        { x: half, y: point.y },
        "reflection-axis-intersection-tick",
        key,
        1,
        tickStyle,
      );
    }

    return null;
  };

  const renderHkIntersectionPoint = (point, key) => {
    const p = graphToSvg(point);
    return React.createElement("circle", {
      key,
      cx: p.x,
      cy: p.y,
      r: HK_POINT_RADIUS,
      className: "reflection-hk-point",
    });
  };

  const renderGrid = () => {
    const children = [];
    for (let i = -GRAPH_RANGE; i <= GRAPH_RANGE; i++) {
      children.push(
        renderLine(
          { x: i, y: -GRAPH_RANGE },
          { x: i, y: GRAPH_RANGE },
          "reflection-grid-line",
          "grid-v-" + i,
        ),
      );
      children.push(
        renderLine(
          { x: -GRAPH_RANGE, y: i },
          { x: GRAPH_RANGE, y: i },
          "reflection-grid-line",
          "grid-h-" + i,
        ),
      );
    }
    return React.createElement("g", { className: "reflection-grid" }, children);
  };

  const renderAxes = () =>
    React.createElement(
      "g",
      { className: "reflection-axes" },
      renderLine(
        { x: -GRAPH_RANGE, y: 0 },
        { x: GRAPH_RANGE, y: 0 },
        "reflection-axis-line",
        "axis-x",
        1,
        {
          markerStart: "url(#reflection-axis-arrow)",
          markerEnd: "url(#reflection-axis-arrow)",
        },
      ),
      renderLine(
        { x: 0, y: -GRAPH_RANGE },
        { x: 0, y: GRAPH_RANGE },
        "reflection-axis-line",
        "axis-y",
        1,
        {
          markerStart: "url(#reflection-axis-arrow)",
          markerEnd: "url(#reflection-axis-arrow)",
        },
      ),
      renderLabel(
        {
          x: GRAPH_RANGE - 0.32,
          y: 0.42,
        },
        graphText.xAxisLabel,
        "reflection-axis-label",
        "axis-label-x",
      ),
      renderLabel(
        {
          x: 0.42,
          y: GRAPH_RANGE - 0.35,
        },
        graphText.yAxisLabel,
        "reflection-axis-label",
        "axis-label-y",
      ),
    );

  const renderInitialGuides = () => {
    if (!caseConfig || visual.initialGuideProgress <= 0) return null;
    const point = caseConfig.point;
    const verticalEnd = { x: point.x, y: 0 };
    const horizontalEnd = { x: 0, y: point.y };
    return React.createElement(
      "g",
      { className: "reflection-guides" },
      renderLine(
        point,
        verticalEnd,
        "reflection-guide-line",
        "initial-guide-x",
        visual.initialGuideProgress,
      ),
      renderLine(
        point,
        horizontalEnd,
        "reflection-guide-line",
        "initial-guide-y",
        visual.initialGuideProgress,
      ),
      visual.initialGuideProgress >= 1
        ? renderAxisIntersectionTick(verticalEnd, "initial-tick-x")
        : null,
      visual.initialGuideProgress >= 1
        ? renderAxisIntersectionTick(horizontalEnd, "initial-tick-y")
        : null,
      visual.initialGuideProgress >= 1
        ? renderLabel(
            verticalEnd,
            graphText.coordinateLabels.x,
            "reflection-coordinate-label coord-x-token",
            "initial-label-x",
            getAxisIntersectionPlacement(verticalEnd),
          )
        : null,
      visual.initialGuideProgress >= 1
        ? renderLabel(
            horizontalEnd,
            graphText.coordinateLabels.y,
            "reflection-coordinate-label coord-y-token",
            "initial-label-y",
            getAxisIntersectionPlacement(horizontalEnd),
          )
        : null,
    );
  };

  const renderReflector = () => {
    if (!caseConfig || visual.reflectorProgress <= 0) return null;
    return React.createElement(
      "g",
      { className: "reflection-reflector" },
      renderLine(
        caseConfig.segment[0],
        caseConfig.segment[1],
        "reflection-reflector-line",
        "reflector-line",
        visual.reflectorProgress,
        {
          markerStart: "url(#reflection-reflector-arrow)",
          markerEnd: "url(#reflection-reflector-arrow)",
        },
      ),
      visual.reflectorProgress >= 1
        ? renderLabel(
            nudgeAwayFromLine(
              caseConfig.line,
              getEquationLabelPoint(visual.caseId, caseConfig.equationOffset),
              0.12,
            ),
            graphText.equations[visual.caseId],
            "reflection-equation-label",
            "reflector-equation",
          )
        : null,
    );
  };

  const renderOffsetMeasure = () => {
    if (
      !caseConfig ||
      !["lineYH", "lineXK"].includes(visual.caseId) ||
      visual.hMeasureProgress <= 0
    ) {
      return null;
    }

    const isHorizontal = visual.caseId === "lineXK";
    const from = isHorizontal ? { x: 0, y: -3.4 } : { x: -3.4, y: 0 };
    const to = isHorizontal
      ? { x: visual.hMeasureProgress, y: -3.4 }
      : { x: -3.4, y: visual.hMeasureProgress };
    const labelPoint = isHorizontal
      ? { x: 0.5, y: -3.4 + 0.32 }
      : { x: -3.4 + 0.28, y: 0.5 };
    const intersection = isHorizontal ? { x: 1, y: 0 } : { x: 0, y: 1 };
    const measureLabel = isHorizontal
      ? graphText.coordinateLabels.k
      : graphText.coordinateLabels.h;
    const intersectionLabel = isHorizontal
      ? graphText.coordinateLabels.kZero
      : graphText.coordinateLabels.zeroH;

    const intersectionPlacement = isHorizontal
      ? HK_INTERSECTION_BOTTOM_RIGHT
      : HK_INTERSECTION_TOP_RIGHT;

    return React.createElement(
      "g",
      { className: "reflection-h-measure" },
      renderLine(
        from,
        to,
        "reflection-h-arrow",
        "line-yh-h-arrow",
        1,
        {
          markerStart:
            visual.hMeasureProgress >= 1 ? "url(#reflection-h-arrow-head)" : undefined,
          markerEnd:
            visual.hMeasureProgress >= 1 ? "url(#reflection-h-arrow-head)" : undefined,
        },
      ),
      visual.hMeasureProgress >= 1
        ? renderLabel(
            labelPoint,
            measureLabel,
            "reflection-h-label",
            "line-yh-h-label",
          )
        : null,
      visual.hMeasureProgress >= 1
        ? renderHkIntersectionPoint(intersection, "line-yh-hk-point")
        : null,
      visual.hMeasureProgress >= 1
        ? renderOffsetIntersectionLabel(
            intersection,
            intersectionLabel,
            "line-yh-origin-h-label",
            intersectionPlacement,
          )
        : null,
    );
  };

  const renderProjection = () => {
    if (!caseConfig || !visual.showProjection || visual.projectionProgress <= 0) {
      return null;
    }
    return React.createElement(
      "g",
      { className: "reflection-projection" },
      renderLine(
        caseConfig.point,
        caseConfig.foot,
        "reflection-projection-line",
        "projection-line",
        visual.projectionProgress,
      ),
    );
  };

  const renderGhost = () => {
    if (!caseConfig || !visual.showGhost) return null;
    const reflected = caseConfig.reflected;
    const p = graphToSvg(reflected);
    return React.createElement(
      "g",
      { className: "reflection-ghost" },
      renderLine(
        reflected,
        caseConfig.foot,
        "reflection-ghost-line",
        "ghost-line",
      ),
      React.createElement("circle", {
        cx: p.x,
        cy: p.y,
        r: 7.5,
        className: "reflection-reflected-point",
      }),
    );
  };

  const renderFinalGuides = () => {
    if (!caseConfig || visual.finalGuideProgress <= 0) return null;
    return React.createElement(
      "g",
      { className: "reflection-final-guides" },
      caseConfig.finalGuides.map((guide, index) =>
        React.createElement(
          "g",
          { key: "final-guide-" + index },
          renderLine(
            guide.from,
            guide.to,
            "reflection-guide-line",
            "final-guide-line-" + index,
            visual.finalGuideProgress,
          ),
          visual.finalGuideProgress >= 1
            ? renderAxisIntersectionTick(
                guide.to,
                "final-guide-tick-" + index,
              )
            : null,
          visual.finalGuideProgress >= 1
            ? renderLabel(
                guide.to,
                graphText.coordinateLabels[guide.labelKey],
                "reflection-coordinate-label " + getCoordinateLabelClass(guide.labelKey),
                "final-guide-label-" + index,
                getAxisIntersectionPlacement(guide.to),
              )
            : null,
        ),
      ),
    );
  };

  const renderPoint = () => {
    if (!caseConfig || visual.pointOpacity <= 0) return null;
    const p = graphToSvg(caseConfig.point);
    return React.createElement(
      "g",
      { className: "reflection-original-point", opacity: visual.pointOpacity },
      React.createElement("circle", {
        cx: p.x,
        cy: p.y,
        r: 7.5,
        className: "reflection-point",
      }),
      renderPointLabel(caseConfig.point, "initial-point-label", false),
    );
  };

  const renderFinalLabel = () => {
    if (!caseConfig || !visual.showFinalLabel) return null;
    return renderPointLabel(caseConfig.reflected, "reflected-point-label", true);
  };

  const renderFoldOverlay = () => {
    if (!caseConfig || !visual.showFoldOverlay) return null;
    const theta = Math.PI * visual.foldProgress;
    const model = buildFoldModel(caseConfig);
    const panelPoints = model.polygon
      .map((point) => {
        const folded = graphToSvg(foldGraphPoint(caseConfig.line, point, theta));
        return folded.x.toFixed(2) + "," + folded.y.toFixed(2);
      })
      .join(" ");
    const foldedPoint = graphToSvg(
      foldGraphPoint(caseConfig.line, caseConfig.point, theta),
    );

    return React.createElement(
      "g",
      { className: "reflection-fold-overlay" },
      React.createElement("polygon", {
        points: panelPoints,
        className: "reflection-fold-panel",
      }),
      model.segments.map((segment, index) => {
        const from = foldGraphPoint(caseConfig.line, segment.points[0], theta);
        const to = foldGraphPoint(caseConfig.line, segment.points[1], theta);
        return renderLine(
          from,
          to,
          "reflection-fold-" + segment.type,
          "fold-segment-" + index,
        );
      }),
      React.createElement("circle", {
        cx: foldedPoint.x,
        cy: foldedPoint.y,
        r: 7.5,
        className: "reflection-fold-point",
      }),
    );
  };

  return React.createElement(
    "div",
    { className: "reflection-graph-wrap" },
    React.createElement(
      "svg",
      {
        className: "rotation-svg reflection-svg",
        viewBox: "0 0 " + GRAPH_VIEW_SIZE + " " + GRAPH_VIEW_SIZE,
        preserveAspectRatio: "xMidYMid meet",
      },
      React.createElement(
        "defs",
        null,
        React.createElement(
          "marker",
          {
            id: "reflection-axis-arrow",
            viewBox: "0 0 10 10",
            refX: 5,
            refY: 5,
            markerWidth: 10,
            markerHeight: 10,
            markerUnits: "userSpaceOnUse",
            orient: "auto-start-reverse",
          },
          React.createElement("path", {
            d: "M 0 0 L 10 5 L 0 10 z",
            fill: REFLECTION_COLORS.axis,
          }),
        ),
        React.createElement(
          "marker",
          {
            id: "reflection-reflector-arrow",
            viewBox: "0 0 10 10",
            refX: 5,
            refY: 5,
            markerWidth: 10,
            markerHeight: 10,
            markerUnits: "userSpaceOnUse",
            orient: "auto-start-reverse",
          },
          React.createElement("path", {
            d: "M 0 0 L 10 5 L 0 10 z",
            fill: REFLECTION_COLORS.reflector,
          }),
        ),
        React.createElement(
          "marker",
          {
            id: "reflection-h-arrow-head",
            viewBox: "0 0 10 10",
            refX: 5,
            refY: 5,
            markerWidth: 8,
            markerHeight: 8,
            markerUnits: "userSpaceOnUse",
            orient: "auto-start-reverse",
          },
          React.createElement("path", {
            d: "M 0 0 L 10 5 L 0 10 z",
            fill: REFLECTION_COLORS.point,
          }),
        ),
      ),
      renderGrid(),
      renderAxes(),
      renderInitialGuides(),
      renderReflector(),
      renderOffsetMeasure(),
      renderProjection(),
      renderGhost(),
      renderFinalGuides(),
      renderPoint(),
      renderFinalLabel(),
      renderFoldOverlay(),
    ),
  );
};

function scaleLabelOffset(offset) {
  return {
    x: offset.x * LABEL_OFFSET_SCALE,
    y: offset.y * LABEL_OFFSET_SCALE,
  };
}

function nudgeAwayFromLine(line, point, extraDistance) {
  if (!extraDistance) return point;
  const side = signedGraphDistance(line, point) >= 0 ? 1 : -1;
  return {
    x: point.x + side * extraDistance * line.a,
    y: point.y + side * extraDistance * line.b,
  };
}

function getEquationLabelPoint(caseId, equationOffset) {
  if (caseId === "lineXK") {
    return {
      x: equationOffset.x + XK_EQUATION_LABEL_RIGHT_OFFSET,
      y: equationOffset.y,
    };
  }
  if (caseId === "yAxis") {
    return {
      x: equationOffset.x + Y_AXIS_EQUATION_LABEL_RIGHT_OFFSET,
      y: equationOffset.y,
    };
  }
  if (caseId === "lineYX") {
    return {
      x: equationOffset.x - LINE_YX_EQUATION_LABEL_LEFT_OFFSET,
      y: equationOffset.y,
    };
  }
  if (caseId === "lineYNegX") {
    return {
      x: equationOffset.x - LINE_YNEG_X_EQUATION_LABEL_LEFT_OFFSET,
      y: equationOffset.y,
    };
  }
  return equationOffset;
}

function getCoordinateLabelClass(labelKey) {
  if (labelKey === "x" || labelKey === "negativeX" || labelKey === "reflectedXK") {
    return "coord-x-token";
  }
  if (labelKey === "y" || labelKey === "negativeY" || labelKey === "reflectedYH") {
    return "coord-y-token";
  }
  return "";
}

function getResultToneClass(tone) {
  if (tone === "swap") return "tone-swap";
  if (tone === "y") return "tone-y";
  return "tone-x";
}

function getAxisIntersectionPlacement(point) {
  const epsilon = 0.001;

  if (Math.abs(point.y) < epsilon) {
    if (point.x >= 0) {
      return {
        offset: AXIS_INTERSECTION_OFFSETS.positiveX,
        anchor: "start",
        baseline: "hanging",
      };
    }
    return {
      offset: AXIS_INTERSECTION_OFFSETS.negativeX,
      anchor: "end",
      baseline: "hanging",
    };
  }

  if (Math.abs(point.x) < epsilon) {
    if (point.y >= 0) {
      return {
        offset: AXIS_INTERSECTION_OFFSETS.positiveY,
        anchor: "end",
        baseline: "text-after-edge",
      };
    }
    return {
      offset: AXIS_INTERSECTION_OFFSETS.negativeY,
      anchor: "end",
      baseline: "hanging",
    };
  }

  return {
    offset: { x: 0, y: 0 },
    anchor: "middle",
    baseline: "middle",
  };
}

function getPointLabelPlacement(caseId, reflected) {
  if (caseId === "xAxis") {
    return reflected ? POINT_LABEL_BELOW : POINT_LABEL_ABOVE;
  }

  if (caseId === "yAxis") {
    return POINT_LABEL_ABOVE;
  }

  if (caseId === "lineXK") {
    return reflected ? POINT_LABEL_ABOVE_LEFT : POINT_LABEL_ABOVE;
  }

  if (caseId === "lineYH") {
    return reflected ? POINT_LABEL_BELOW : POINT_LABEL_ABOVE;
  }

  if (caseId === "lineYNegX") {
    return reflected ? POINT_LABEL_BELOW_LEFT : POINT_LABEL_ABOVE;
  }

  if (caseId === "lineYX") {
    return reflected ? POINT_LABEL_ABOVE : POINT_LABEL_ABOVE_RIGHT;
  }

  return reflected ? POINT_LABEL_BELOW : POINT_LABEL_ABOVE;
}

function renderOffsetIntersectionLabel(point, label, key, placement) {
  const scaled = scaleLabelOffset(placement.offset);
  const p = graphToSvg({ x: point.x + scaled.x, y: point.y + scaled.y });
  const symbolIndex = Math.max(label.indexOf("h"), label.indexOf("k"));
  const parts =
    symbolIndex >= 0
      ? [
          { text: label.slice(0, symbolIndex), className: "" },
          { text: label[symbolIndex], className: "coord-h-token" },
          { text: label.slice(symbolIndex + 1), className: "" },
        ]
      : [{ text: label, className: "" }];

  return React.createElement(
    "text",
    {
      key,
      x: p.x,
      y: p.y,
      className: "reflection-origin-h-label",
      textAnchor: placement.anchor,
      dominantBaseline: placement.baseline,
      style: { fontSize: svg_font_size },
    },
    parts.map((part, index) =>
      React.createElement(
        "tspan",
        { key: index, className: part.className },
        part.text,
      ),
    ),
  );
}

function getPointLabelParts(label) {
  const parts = [];
  const tokenPattern = /(-x\+2k|-y\+2h|-x|-y|x|y|k|h)/g;
  let lastIndex = 0;
  let match;

  while ((match = tokenPattern.exec(label)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: label.slice(lastIndex, match.index), className: "" });
    }
    parts.push({
      text: match[0],
      className: getFormulaTokenClass(match[0]),
    });
    lastIndex = tokenPattern.lastIndex;
  }

  if (lastIndex < label.length) {
    parts.push({ text: label.slice(lastIndex), className: "" });
  }

  return parts;
}

function getFormulaTokenClass(token) {
  if (token === "x" || token === "-x" || token === "-x+2k") {
    return "coord-x-token";
  }
  if (token === "k" || token === "h") {
    return "coord-h-token";
  }
  return "coord-y-token";
}
