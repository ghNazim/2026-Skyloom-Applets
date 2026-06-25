const TranslationIntroGraph = (props) => {
  const { useMemo } = React;
  const {
    showGray = false,
    yellowProgress = 0,
    arrowProgress = 0,
    arrowMerge = 0,
    showArrowLabels = false,
    showPreimagePoints = false,
    showImagePoints = false,
    showPillLabels = false,
    pillLabelsOpacity = 0,
    grayClickable = false,
    yellowClickable = false,
    onGrayClick,
    onYellowClick,
  } = props;

  const radius = PENTAGON_RADIUS_STEP1;
  const labelOffset = radius * 0.22;
  const pillOffset = radius + 5;

  const yellowCenter = lerpCenter(PREIMAGE_CENTER, IMAGE_CENTER, yellowProgress);
  const grayCenter = PREIMAGE_CENTER;
  const grayPoints = getPentagonAtCenter(grayCenter, radius);
  const yellowPoints = getPentagonAtCenter(yellowCenter, radius);
  const grayCentroid = polygonCentroid(grayPoints);
  const yellowCentroid = polygonCentroid(yellowPoints);

  const arrowData = useMemo(() => {
    const pre = grayPoints;
    const img = yellowPoints;
    const topIdx = pre.reduce(
      (best, p, i) => (p.y < pre[best].y ? i : best),
      0,
    );
    const bottomIdx = pre.reduce(
      (best, p, i) => (p.y > pre[best].y ? i : best),
      0,
    );
    return { pre, img, topIdx, bottomIdx };
  }, [grayPoints, yellowPoints]);

  const renderArrow = (from, to, key, progress) => {
    const end = lerpPoint(from, to, progress);
    const len = Math.sqrt(
      (end.x - from.x) ** 2 + (end.y - from.y) ** 2,
    );
    if (len < 0.1) return null;
    return React.createElement("line", {
      key: key,
      x1: from.x,
      y1: from.y,
      x2: end.x,
      y2: end.y,
      stroke: COLORS.arrow,
      strokeWidth: 0.35,
      strokeDasharray: "1.2 0.8",
      markerEnd: "url(#translation-arrowhead)",
      opacity: 0.9,
    });
  };

  const renderMergedArrows = () => {
    const arrows = [];
    for (let i = 0; i < 5; i++) {
      const from = lerpPoint(
        arrowData.pre[i],
        grayCentroid,
        arrowMerge,
      );
      const to = lerpPoint(arrowData.img[i], yellowCentroid, arrowMerge);
      const prog = arrowMerge >= 1 ? 1 : arrowProgress;
      arrows.push(renderArrow(from, to, "arrow-" + i, prog));
    }
    return arrows;
  };

  const getLabelPosition = (isTop) => {
    const idx = isTop ? arrowData.topIdx : arrowData.bottomIdx;
    const from = lerpPoint(
      arrowData.pre[idx],
      grayCentroid,
      arrowMerge,
    );
    const to = lerpPoint(arrowData.img[idx], yellowCentroid, arrowMerge);
    const mid = lerpPoint(from, to, 0.5);
    const angle = getArrowAngleDeg(from.x, from.y, to.x, to.y);
    const perpOffset = isTop ? -3.5 : 3.5;
    const rad = (angle * Math.PI) / 180;
    const nx = -Math.sin(rad) * perpOffset;
    const ny = Math.cos(rad) * perpOffset;
    return { x: mid.x + nx, y: mid.y + ny, angle: angle };
  };

  const renderPoints = (points, centroid, labels, fill, show) => {
    if (!show) return null;
    return points.map((pt, i) => {
      const labelPt = radialLabelPoint(pt, centroid, labelOffset);
      return React.createElement(
        "g",
        { key: "pt-" + labels[i] },
        React.createElement("circle", {
          cx: pt.x,
          cy: pt.y,
          r: radius * 0.085,
          fill: fill,
          stroke: "#fff",
          strokeWidth: 0.15,
        }),
        React.createElement(
          "text",
          {
            x: labelPt.x,
            y: labelPt.y,
            fill: "#fff",
            fontSize: 2.8,
            textAnchor: "middle",
            dominantBaseline: "middle",
            fontWeight: 600,
          },
          labels[i],
        ),
      );
    });
  };

  const renderPillLabel = (text, x, y, above) => {
    if (!showPillLabels) return null;
    const pillY = above ? y - pillOffset -3.5 : y + pillOffset;
    return React.createElement(
      "g",
      {
        opacity: pillLabelsOpacity,
        style: { transition: "opacity 0.6s ease" },
      },
      React.createElement("rect", {
        x: x - 11.5,
        y: pillY - 2.8,
        width: 23,
        height: 5.6,
        rx: 2.8,
        fill: COLORS.labelPill,
      }),
      React.createElement(
        "text",
        {
          x: x,
          y: pillY,
          fill: "#fff",
          fontSize: 3,
          textAnchor: "middle",
          dominantBaseline: "middle",
          fontWeight: 600,
        },
        text,
      ),
    );
  };

  const distanceLabel = getLabelPosition(true);
  const directionLabel = getLabelPosition(false);

  return React.createElement(
    "svg",
    {
      className: "translation-svg translation-intro-svg",
      viewBox: "0 0 " + TRANSLATION_VIEW_W + " " + TRANSLATION_VIEW_H,
      preserveAspectRatio: "xMidYMid meet",
    },
    React.createElement(
      "defs",
      null,
      React.createElement(
        "marker",
        {
          id: "translation-arrowhead",
          markerWidth: 4,
          markerHeight: 4,
          refX: 3.5,
          refY: 2,
          orient: "auto",
        },
        React.createElement("path", {
          d: "M0,0 L4,2 L0,4 Z",
          fill: COLORS.arrow,
        }),
      ),
    ),
    showGray
      ? React.createElement("polygon", {
          points: grayPoints.map((p) => p.x + "," + p.y).join(" "),
          fill: COLORS.gray,
          stroke: "none",
        })
      : null,
    React.createElement("polygon", {
      points: yellowPoints.map((p) => p.x + "," + p.y).join(" "),
      fill: COLORS.yellow,
      stroke: "none",
      style: { cursor: yellowClickable ? "pointer" : "default" },
      onClick: yellowClickable ? onYellowClick : undefined,
    }),
    grayClickable
      ? React.createElement("polygon", {
          points: grayPoints.map((p) => p.x + "," + p.y).join(" "),
          fill: "transparent",
          stroke: "none",
          style: { cursor: "pointer" },
          onClick: onGrayClick,
        })
      : null,
    arrowProgress > 0 ? renderMergedArrows() : null,
    showArrowLabels
      ? React.createElement(
          React.Fragment,
          null,
          React.createElement(
            "text",
            {
              x: distanceLabel.x,
              y: distanceLabel.y,
              fill: "#64C7FF",
              fontSize: 3.1,
              textAnchor: "middle",
              dominantBaseline: "middle",
              transform:
                "rotate(" +
                distanceLabel.angle +
                " " +
                distanceLabel.x +
                " " +
                distanceLabel.y +
                ")",
            },
            handleComma(APP_DATA.steps[1].sameDistance),
          ),
          React.createElement(
            "text",
            {
              x: directionLabel.x,
              y: directionLabel.y,
              fill: "#64C7FF",
              fontSize: 3.1,
              textAnchor: "middle",
              dominantBaseline: "middle",
              transform:
                "rotate(" +
                directionLabel.angle +
                " " +
                directionLabel.x +
                " " +
                directionLabel.y +
                ")",
            },
            handleComma(APP_DATA.steps[1].sameDirection),
          ),
        )
      : null,
    renderPoints(
      grayPoints,
      grayCentroid,
      PENTAGON_LABELS,
      COLORS.grayPoint,
      showPreimagePoints,
    ),
    renderPoints(
      yellowPoints,
      yellowCentroid,
      PENTAGON_PRIME_LABELS,
      COLORS.yellowPoint,
      showImagePoints,
    ),
    renderPillLabel(
      APP_DATA.steps[1].labelPreimage,
      grayCentroid.x,
      grayCentroid.y,
      false,
    ),
    renderPillLabel(
      APP_DATA.steps[1].labelImage,
      yellowCentroid.x,
      yellowCentroid.y,
      true,
    ),
  );
};
