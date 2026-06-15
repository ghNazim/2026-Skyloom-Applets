const BarGraph = ({
  highlightBarIndex,
  lowOpacityAll,
  highlightXLabels,
  feedbackText,
  barValueBoxes,
  wrongLineY,
  showCorrectLine,
  meanValue,
  meanLineVisible,
  meanDrawProgress,
  meanLabelRef,
}) => {
  const e = React.createElement;
  const config = APP_DATA.barGraph;
  const yLabels = config.yLabels;
  const xLabels = config.xLabels;
  const bars = config.bars;
  const yAxisLabel = config.yAxisLabel;
  const xAxisLabel = config.xAxisLabel;

  const SVG_W = 520;
  const SVG_H = 395;
  const VIEWBOX_LEFT = -5;
  const ML = 82;
  const MR = 20;
  const MT = 20;
  const MB = 62;
  const LABEL_SIZE = 25;
  const TAG_SIZE = 20;
  const X_LABEL_SIZE = 23;
  const X_TAG_SIZE = 23;
  const pW = SVG_W - ML - MR;
  const pH = SVG_H - MT - MB;

  const YMAX = yLabels[yLabels.length - 1];
  const barCount = bars.length;
  const barGap = pW / (barCount + 0.5);
  const barWidth = barGap * 0.55;

  function yP(val) {
    return MT + pH - (val / YMAX) * pH;
  }

  function xBarCenter(i) {
    return ML + barGap * (i + 0.75);
  }

  var children = [];

  // Dashed horizontal grid lines at each y label
  yLabels.forEach(function (val, i) {
    if (val === 0) return;
    var yy = yP(val);
    children.push(
      e("line", {
        key: "grid-" + i,
        x1: ML,
        y1: yy,
        x2: ML + pW,
        y2: yy,
        stroke: "rgba(255,255,255,0.2)",
        strokeWidth: 1,
        strokeDasharray: "6 4",
      })
    );
  });

  // Y axis line (extend a bit above YMAX)
  children.push(
    e("line", {
      key: "yaxis",
      x1: ML,
      y1: MT - 10,
      x2: ML,
      y2: yP(0),
      stroke: "white",
      strokeWidth: 1.5,
    })
  );

  // X axis line (extend a bit beyond last bar)
  children.push(
    e("line", {
      key: "xaxis",
      x1: ML,
      y1: yP(0),
      x2: ML + pW + 10,
      y2: yP(0),
      stroke: "white",
      strokeWidth: 1.5,
    })
  );

  // Y axis labels + orange dots on axis
  yLabels.forEach(function (val, i) {
    var yy = yP(val);
    children.push(
      e(
        "text",
        {
          key: "ylabel-" + i,
          x: ML - 30,
          y: yy + 6,
          textAnchor: "end",
          fill: "#f0a030",
          fontSize: LABEL_SIZE,
          fontWeight: 600,
        },
        val
      )
    );
    children.push(
      e("circle", {
        key: "ydot-" + i,
        cx: ML,
        cy: yy,
        r: 5,
        fill: "#f0a030",
      })
    );
  });

  // Y axis label text (rotated) — sits in extended viewBox left margin
  var yTagX = 22;
  var yTagY = SVG_H / 2 - 10;
  children.push(
    e(
      "text",
      {
        key: "yaxis-label",
        x: yTagX,
        y: yTagY,
        textAnchor: "middle",
        fill: "#f0a030",
        fontSize: TAG_SIZE,
        fontWeight: 600,
        transform: "rotate(-90, " + yTagX + ", " + yTagY + ")",
      },
      yAxisLabel
    )
  );

  // X axis labels
  xLabels.forEach(function (label, i) {
    var cx = xBarCenter(i);
    var isHighlighted = highlightXLabels;
    children.push(
      e(
        "text",
        {
          key: "xlabel-" + i,
          x: cx,
          y: yP(0) + 28,
          textAnchor: "middle",
          fill: isHighlighted ? "#ffcc00" : "#ffffff",
          fontSize: X_LABEL_SIZE,
          fontWeight: 600,
          className: isHighlighted ? "xlabel-highlight" : "",
        },
        label
      )
    );
    if (isHighlighted) {
      var boxW = Math.max(54, label.length * 15 + 18);
      var boxH = 26;
      children.push(
        e("rect", {
          key: "xlabel-box-" + i,
          x: cx - boxW / 2,
          y: yP(0) + 9,
          width: boxW,
          height: boxH,
          fill: "none",
          stroke: "#ffcc00",
          strokeWidth: 1.5,
          rx: 4,
          className: "xlabel-glow",
        })
      );
    }
  });

  // X axis label text
  children.push(
    e(
      "text",
      {
        key: "xaxis-label",
        x: ML + pW / 2,
        y: SVG_H - 2,
        textAnchor: "middle",
        fill: "#7dd3fc",
        fontSize: X_TAG_SIZE,
        fontWeight: 600,
      },
      xAxisLabel
    )
  );

  // Bars
  bars.forEach(function (val, i) {
    var cx = xBarCenter(i);
    var barTop = yP(val);
    var barH = yP(0) - barTop;
    var isActive = highlightBarIndex === i;
    var opacity =
      lowOpacityAll && !isActive ? 0.25 : 1;

    children.push(
      e("rect", {
        key: "bar-" + i,
        x: cx - barWidth / 2,
        y: barTop,
        width: barWidth,
        height: barH,
        fill: "#7dd3fc",
        opacity: opacity,
        rx: 2,
      })
    );
  });

  // White horizontal line from highlighted bar to y-axis
  if (highlightBarIndex !== null && highlightBarIndex !== undefined && highlightBarIndex >= 0) {
    var hVal = bars[highlightBarIndex];
    var hY = yP(hVal);
    var hCx = xBarCenter(highlightBarIndex);
    children.push(
      e("line", {
        key: "h-line-white",
        x1: ML,
        y1: hY,
        x2: hCx,
        y2: hY,
        stroke: showCorrectLine ? "#4ade80" : "white",
        strokeWidth: 2,
        className: showCorrectLine ? "correct-line-fade" : "",
      })
    );
    // Green dot at y-axis end
    children.push(
      e("circle", {
        key: "h-line-dot",
        cx: ML,
        cy: hY,
        r: 4,
        fill: showCorrectLine ? "#4ade80" : "white",
      })
    );
  }

  // Wrong answer red line
  if (wrongLineY !== null && wrongLineY !== undefined) {
    var wrongYPos = yP(wrongLineY);
    var isOnLabel = yLabels.indexOf(wrongLineY) !== -1;
    children.push(
      e("line", {
        key: "wrong-line",
        x1: ML,
        y1: wrongYPos,
        x2: ML + pW,
        y2: wrongYPos,
        stroke: "#ef4444",
        strokeWidth: 2,
      })
    );
    if (!isOnLabel) {
      children.push(
        e(
          "text",
          {
            key: "wrong-label",
            x: ML - 30,
            y: wrongYPos + 6,
            textAnchor: "end",
            fill: "#ef4444",
            fontSize: LABEL_SIZE,
            fontWeight: 700,
          },
          wrongLineY
        )
      );
    } else {
      // If on a label, just color that label red (overlay)
      children.push(
        e(
          "text",
          {
            key: "ylabel-red-overlay",
            x: ML - 30,
            y: wrongYPos + 6,
            textAnchor: "end",
            fill: "#ef4444",
            fontSize: LABEL_SIZE,
            fontWeight: 700,
          },
          wrongLineY
        )
      );
    }
  }

  // Bar value boxes (permanent labels above bars)
  var valueBoxSize = 32;
  var valueBoxHalf = valueBoxSize / 2;
  var valueBoxGap = 4;
  var valueBoxFontSize = 28;

  if (barValueBoxes) {
    barValueBoxes.forEach(function (val, i) {
      if (val === null || val === undefined) return;
      var cx = xBarCenter(i);
      var barTop = yP(bars[i]);
      var boxTop = barTop - valueBoxSize - valueBoxGap;
      children.push(
        e(
          "g",
          { key: "bvb-" + i, className: "bar-value-box-g" },
          e("rect", {
            x: cx - valueBoxHalf,
            y: boxTop,
            width: valueBoxSize,
            height: valueBoxSize,
            fill: "#fef9c3",
            stroke: "#ca8a04",
            strokeWidth: 1,
            rx: 3,
          }),
          e(
            "text",
            {
              x: cx,
              y: boxTop + valueBoxHalf + valueBoxFontSize * 0.35,
              textAnchor: "middle",
              fill: "#1a1a1a",
              fontSize: valueBoxFontSize,
              fontWeight: 700,
            },
            val
          )
        )
      );
    });
  }

  // Mean horizontal line and label
  if (meanValue !== null && meanValue !== undefined) {
    var meanY = yP(meanValue);
    var lastBarRight = xBarCenter(barCount - 1) + barWidth / 2;
    var lineX1 = ML;
    var lineX2 = lastBarRight;
    var lineLen = lineX2 - lineX1;
    var drawP = meanDrawProgress || 0;
    var showLine = !!meanLineVisible;
    var labelX = lineX2 + 10;
    var labelAnchor = "start";
    if (labelX + 44 > SVG_W - 12) {
      labelX = SVG_W - 12;
      labelAnchor = "end";
    }

    children.push(
      e("line", {
        key: "mean-line",
        x1: lineX2,
        y1: meanY,
        x2: lineX1,
        y2: meanY,
        stroke: "#f0a030",
        strokeWidth: 2.5,
        strokeLinecap: "round",
        opacity: showLine ? 1 : 0,
        strokeDasharray: lineLen,
        strokeDashoffset: lineLen * (1 - drawP),
      })
    );

    children.push(
      e(
        "text",
        {
          key: "mean-label",
          ref: meanLabelRef,
          x: labelX,
          y: meanY + 8,
          textAnchor: labelAnchor,
          fill: "#f0a030",
          fontSize: 28,
          fontWeight: 700,
          opacity: showLine ? 1 : 0,
          className: "mean-graph-label",
        },
        String(meanValue)
      )
    );
  }

  var svgEl = e(
    "svg",
    {
      viewBox: VIEWBOX_LEFT + " 0 " + (SVG_W - VIEWBOX_LEFT) + " " + SVG_H,
      className: "bar-graph-svg",
      preserveAspectRatio: "xMidYMid meet",
    },
    children
  );

  return e(
    "div",
    { className: "bar-graph-container" },
    feedbackText
      ? e(
          "div",
          { className: "bar-graph-feedback" },
          e("span", null, feedbackText)
        )
      : null,
    e("div", { className: "bar-graph-wrapper" }, svgEl)
  );
};
