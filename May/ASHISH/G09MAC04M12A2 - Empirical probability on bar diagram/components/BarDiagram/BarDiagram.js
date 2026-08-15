const BarDiagram = ({
  mode = "dice",
  frequencies = {},
  labels = [],
  ymax = 12,
  highlightBars = [],
  glowBar = null,
  dimOthers = false,
  showLabels = true,
  showFreqLabels = true,
  labelClass = "",
  chartRef,
  previewFreq = null,
  highlightFace = null,
  confirmedSections = [],
  animateLabels = true,
}) => {
  const items =
    labels.length > 0
      ? labels
      : mode === "dice"
        ? [1, 2, 3, 4, 5, 6]
        : ["A", "B", "C", "D"];

  const axisX = 10;
  const plotTop = 10;
  const plotBottom = 76;
  const plotHeight = plotBottom - plotTop;
  const labelGap = 2.4;
  const xLabelY = plotBottom + 6.2;
  const xTitleY = 88.5;
  const yTitleX = 1;
  const yTitleY = (plotTop + plotBottom) / 2;

  const X_CELLS_PER_LABEL = 3;
  const EXTRA_GRID_COLS_AFTER = 2;
  const squareSize = plotHeight / ymax;
  const xUnitSpacing = X_CELLS_PER_LABEL * squareSize;

  const getXValue = (label, index) =>
    typeof label === "number" ? label : index + 1;

  const xFor = (label, index) => axisX + getXValue(label, index) * xUnitSpacing;

  const maxXValue = items.reduce(
    (max, label, index) => Math.max(max, getXValue(label, index)),
    0,
  );
  const plotEndX =
    axisX + maxXValue * xUnitSpacing + EXTRA_GRID_COLS_AFTER * squareSize;
  const viewBoxWidth = Math.max(100, plotEndX + 3);
  const barWidth = Math.min(xUnitSpacing * 0.58, squareSize * 2.4);

  const yFor = (freq) => plotBottom - (freq / ymax) * plotHeight;

  const yTicksLabeled = [0, 2, 4, 6, 8, 10, 12];
  const yGridLines = Array.from({ length: ymax + 1 }, (_, i) => i);

  const xGridLines = [];
  const nEnd = Math.ceil((plotEndX - axisX) / squareSize);
  for (let n = 0; n <= nEnd; n += 1) {
    xGridLines.push(Math.round((axisX + n * squareSize) * 10000) / 10000);
  }

  const previewWrong = Boolean(previewFreq?.wrong);
  const rawPreviewWrongValue =
    previewWrong && previewFreq != null ? Math.max(previewFreq.value, 0) : null;
  const previewWrongValue =
    rawPreviewWrongValue != null ? Math.min(rawPreviewWrongValue, ymax) : null;
  const previewWrongWithinAxis =
    rawPreviewWrongValue != null && rawPreviewWrongValue <= ymax;
  const showOddWrongYLabel =
    previewWrongWithinAxis && previewWrongValue % 2 !== 0;

  const activeHighlights = (
    Array.isArray(highlightBars)
      ? highlightBars
      : highlightBars
        ? [highlightBars]
        : []
  ).filter((bar) => items.includes(bar));

  return React.createElement(
    "div",
    {
      className: `bar-diagram-wrap${!animateLabels ? " bar-diagram-wrap--fast" : ""}`,
      ref: chartRef,
    },
    React.createElement(
      "svg",
      {
        className: "bar-diagram-svg",
        viewBox: `-3 0 ${viewBoxWidth + 3} 92`,
        preserveAspectRatio: "xMidYMid meet",
      },
      yGridLines.map((tick) =>
        React.createElement("line", {
          key: `grid-h-${tick}`,
          className: "grid-line",
          x1: axisX,
          y1: yFor(tick),
          x2: plotEndX,
          y2: yFor(tick),
        }),
      ),
      xGridLines.map((x) =>
        React.createElement("line", {
          key: `grid-v-${x}`,
          className: "grid-line grid-line--vertical",
          x1: x,
          y1: plotTop,
          x2: x,
          y2: plotBottom,
        }),
      ),
      yTicksLabeled.map((tick) => {
        const isPreviewYTick =
          previewWrongWithinAxis && previewWrongValue === tick;
        return React.createElement(
          "text",
          {
            key: `y-label-${tick}`,
            className: `axis-text y-text${isPreviewYTick ? " y-text--wrong-preview" : ""}`,
            x: axisX - 3,
            y: yFor(tick),
            fontSize: 3.5,
          },
          tick,
        );
      }),
      showOddWrongYLabel &&
        React.createElement(
          "text",
          {
            key: "y-label-wrong-odd",
            className: "axis-text y-text y-text--wrong-preview",
            x: axisX - 3,
            y: yFor(previewWrongValue),
            fontSize: 3.5,
          },
          previewWrongValue,
        ),
      React.createElement("line", {
        className: "axis-line",
        x1: axisX,
        y1: plotBottom,
        x2: plotEndX,
        y2: plotBottom,
      }),
      React.createElement("line", {
        className: "axis-line",
        x1: axisX,
        y1: plotTop,
        x2: axisX,
        y2: plotBottom,
      }),
      React.createElement(
        "text",
        {
          className: "axis-title y-title",
          x: yTitleX,
          y: yTitleY,
          fontSize: 4.5,
          transform: `rotate(-90 ${yTitleX} ${yTitleY})`,
        },
        T.ui.frequency,
      ),
      React.createElement(
        "text",
        {
          className: "axis-title x-title",
          x: (axisX + plotEndX) / 2,
          y: xTitleY,
          fontSize: 4.5,
        },
        mode === "dice" ? T.ui.dieFaces : T.ui.spinnerSection,
      ),
      items.map((label, index) => {
        const freq = frequencies[label] || 0;
        const hasPreview = previewFreq && previewFreq.section === label;
        const previewValue = hasPreview
          ? Math.min(Math.max(previewFreq.value, 0), ymax)
          : null;
        const isJustUpdated = highlightFace === label;
        const isConfirmed = confirmedSections.includes(label);
        const x = xFor(label, index);
        const baseBarTop = yFor(freq);
        const baseHeight = Math.max(0, plotBottom - baseBarTop);
        const previewBarTop = previewValue != null ? yFor(previewValue) : null;
        const isHighlight = activeHighlights.includes(label);
        const isGlow = glowBar === label || isJustUpdated;
        const isDimmed = dimOthers && !isHighlight && !isGlow && !isConfirmed;
        const isPreviewWrong = hasPreview && previewWrong;
        const showBarFreqLabel =
          showLabels &&
          freq > 0 &&
          (mode === "dice" || showFreqLabels || isConfirmed);
        const showPreviewLabel =
          hasPreview && previewValue != null && !isConfirmed && !isPreviewWrong;
        const previewExceedsActual =
          previewValue != null && previewValue > freq;
        const previewLabelY =
          previewBarTop != null
            ? previewExceedsActual
              ? previewBarTop - labelGap * 1.6
              : previewBarTop - labelGap
            : null;
        return React.createElement(
          "g",
          { key: `${label}`, "data-bar-value": label },
          React.createElement("rect", {
            className: `bar-rect ${isGlow ? "bar-rect--glow" : ""} ${isDimmed ? "bar-rect--dim" : ""} ${isJustUpdated ? "bar-rect--grow" : ""} ${isHighlight && !isGlow ? "bar-rect--highlight" : ""}`,
            "data-bar-value": label,
            x: x - barWidth / 2,
            y: baseBarTop,
            width: barWidth,
            height: baseHeight,
            style: { "--bar-delay": isJustUpdated ? "0ms" : `${index * 40}ms` },
          }),
          showBarFreqLabel &&
            React.createElement(
              "text",
              {
                className: `freq-label freq-label--confirmed ${labelClass} ${isDimmed ? "freq-label--dim" : ""} ${isHighlight ? "freq-label--active" : ""} ${isJustUpdated && animateLabels ? "freq-label--after-bar" : ""}`,
                "data-freq-label": label,
                x,
                y: yFor(freq) - labelGap,
                fontSize: 5.75,
              },
              freq,
            ),
          showPreviewLabel &&
            React.createElement(
              "text",
              {
                className: `freq-label freq-label--preview ${isPreviewWrong ? "freq-label--wrong" : "freq-label--correct"} ${previewExceedsActual ? "freq-label--preview-high" : ""}`,
                "data-freq-preview": label,
                x,
                y: previewLabelY,
                fontSize: 5.5,
              },
              previewFreq.value,
            ),
          React.createElement(
            "text",
            {
              className: `axis-text x-label ${isGlow || isHighlight ? "x-label--active" : ""} ${isDimmed ? "x-label--dim" : ""}`,
              x,
              y: xLabelY,
              fontSize: 3.5,
            },
            label,
          ),
        );
      }),
      items.map((label, index) => {
        const freq = frequencies[label] || 0;
        const hasPreview = previewFreq && previewFreq.section === label;
        const previewValue = hasPreview
          ? Math.min(Math.max(previewFreq.value, 0), ymax)
          : null;
        const isConfirmed = confirmedSections.includes(label);
        const isPreviewWrong = hasPreview && previewWrong;
        const x = xFor(label, index);
        const guideY = previewValue != null ? yFor(previewValue) : null;
        const confirmedGuideY = isConfirmed && freq > 0 ? yFor(freq) : null;
        if (!hasPreview && confirmedGuideY == null) return null;
        return React.createElement(
          "g",
          { key: `guide-${label}`, className: "bar-guide-overlay" },
          isConfirmed &&
            confirmedGuideY != null &&
            React.createElement("line", {
              className: "confirmed-guide-line",
              x1: axisX,
              y1: confirmedGuideY,
              x2: x + barWidth / 2,
              y2: confirmedGuideY,
            }),
          hasPreview &&
            guideY != null &&
            React.createElement("line", {
              className: `preview-guide-line ${isPreviewWrong ? "preview-guide-line--wrong" : "preview-guide-line--correct"}`,
              x1: axisX,
              y1: guideY,
              x2: isPreviewWrong ? plotEndX : x + barWidth / 2,
              y2: guideY,
            }),
        );
      }),
    ),
  );
};
