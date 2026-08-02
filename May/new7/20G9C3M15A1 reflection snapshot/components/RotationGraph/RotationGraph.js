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

  const renderLabel = (point, text, className, key, offset = { x: 0, y: 0 }) => {
    const p = graphToSvg({ x: point.x + offset.x, y: point.y + offset.y });
    return React.createElement(
      "text",
      {
        key,
        x: p.x,
        y: p.y,
        className,
        textAnchor: "middle",
        dominantBaseline: "middle",
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
        dominantBaseline: "middle",
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
        { x: GRAPH_RANGE - 0.32, y: 0.48 },
        graphText.xAxisLabel,
        "reflection-axis-label",
        "axis-label-x",
      ),
      renderLabel(
        { x: 0.42, y: GRAPH_RANGE - 0.35 },
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
        ? renderLabel(
            verticalEnd,
            graphText.coordinateLabels.x,
            "reflection-coordinate-label coord-x-token",
            "initial-label-x",
            { x: 0.25, y: -0.35 },
          )
        : null,
      visual.initialGuideProgress >= 1
        ? renderLabel(
            horizontalEnd,
            graphText.coordinateLabels.y,
            "reflection-coordinate-label coord-y-token",
            "initial-label-y",
            { x: -0.35, y: 0.25 },
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
            caseConfig.equationOffset,
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
    const labelPoint = isHorizontal ? { x: 0.5, y: -3.02 } : { x: -3.08, y: 0.5 };
    const intersection = isHorizontal ? { x: 1, y: 0 } : { x: 0, y: 1 };
    const measureLabel = isHorizontal
      ? graphText.coordinateLabels.k
      : graphText.coordinateLabels.h;
    const intersectionLabel = isHorizontal
      ? graphText.coordinateLabels.kZero
      : graphText.coordinateLabels.zeroH;

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
        ? renderOffsetIntersectionLabel(
            intersection,
            intersectionLabel,
            "line-yh-origin-h-label",
            isHorizontal ? { x: 0.72, y: -0.42 } : { x: 0.72, y: 0.42 },
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
            ? renderLabel(
                guide.to,
                graphText.coordinateLabels[guide.labelKey],
                "reflection-coordinate-label " + getCoordinateLabelClass(guide.labelKey),
                "final-guide-label-" + index,
                guide.labelOffset,
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

function getPointLabelPlacement(caseId, reflected) {
  if (!reflected) {
    return { offset: { x: 0.88, y: 0.18 }, anchor: "start" };
  }
  if (caseId === "yAxis" || caseId === "lineXK") {
    return { offset: { x: -0.36, y: 0.62 }, anchor: "end" };
  }
  if (caseId === "lineYNegX") {
    return { offset: { x: -0.36, y: -0.62 }, anchor: "end" };
  }
  return { offset: { x: 0.88, y: 0.18 }, anchor: "start" };
}

function renderOffsetIntersectionLabel(point, label, key, offset) {
  const p = graphToSvg({ x: point.x + offset.x, y: point.y + offset.y });
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
      textAnchor: "middle",
      dominantBaseline: "middle",
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
