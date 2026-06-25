const TranslationPropertiesGraph = (props) => {
  const {
    yellowProgress = 1,
    grayCenter = STEP2_PREIMAGE_CENTER,
    yellowCenter = STEP2_IMAGE_CENTER,
    showLabels = true,
    sizeOverlap = 0,
    showSizeStroke = false,
    shapeCloneProgress = null,
    shapeCloneSettled = false,
    shapeHighlightOnGray = false,
    positionActive = false,
    positionYellowProgress = 1,
    positionCallout = null,
    positionShowImageLabel = true,
    positionShowPurplePoint = false,
    positionPointOpacity = 0,
    positionCalloutOpacity = 0,
    orientationActive = false,
    orientationArrowProgress = 0,
    orientationArrowMerge = 0,
    orientationShowPoints = false,
  } = props;

  const radius = PENTAGON_RADIUS_STEP2;
  const angleMarkR = getAngleMarkRadius(radius);
  const captionOffset = getCaptionOffset(radius);
  const pointR = radius * 0.11 * 0.7;

  const grayPos = lerpCenter(grayCenter, STEP2_OVERLAP_CENTER, sizeOverlap);

  const introActive =
    !positionActive &&
    !orientationActive &&
    yellowProgress < 1 &&
    shapeCloneProgress === null;

  let yellowPos;
  if (positionActive) {
    yellowPos = lerpCenter(grayCenter, yellowCenter, positionYellowProgress);
  } else if (introActive) {
    yellowPos = lerpCenter(grayCenter, yellowCenter, yellowProgress);
  } else {
    yellowPos = lerpCenter(yellowCenter, STEP2_OVERLAP_CENTER, sizeOverlap);
  }

  const showGrayPentagon =
    positionActive || orientationActive || !introActive || yellowProgress > 0;
  const grayOpacity = introActive ? Math.min(1, yellowProgress * 2) : 1;

  const grayPoints = getPentagonAtCenter(grayPos, radius);
  const yellowPoints = getPentagonAtCenter(yellowPos, radius);
  const restYellowPoints = getPentagonAtCenter(yellowCenter, radius);
  const sourceGrayPoints = getPentagonAtCenter(grayCenter, radius);
  const grayCentroid = polygonCentroid(grayPoints);
  const yellowCentroid = polygonCentroid(yellowPoints);

  const topVertex = (points) => {
    const idx = points.reduce(
      (best, p, i) => (p.y < points[best].y ? i : best),
      0,
    );
    return points[idx];
  };

  const renderArrow = (from, to, key, progress) => {
    const end = lerpPoint(from, to, progress);
    const len = Math.sqrt((end.x - from.x) ** 2 + (end.y - from.y) ** 2);
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
      markerEnd: "url(#props-arrowhead)",
      opacity: 0.9,
    });
  };

  const renderOrientationArrows = () => {
    if (!orientationActive || orientationArrowProgress <= 0) return null;
    const pre = grayPoints;
    const img = restYellowPoints;
    const arrows = [];
    for (let i = 0; i < 5; i++) {
      const from = lerpPoint(pre[i], grayCentroid, orientationArrowMerge);
      const to = lerpPoint(img[i], polygonCentroid(img), orientationArrowMerge);
      const prog = orientationArrowMerge >= 1 ? 1 : orientationArrowProgress;
      arrows.push(renderArrow(from, to, "o-arrow-" + i, prog));
    }
    return arrows;
  };

  const renderPurplePoints = (points) =>
    points.map((pt, i) =>
      React.createElement("circle", {
        key: "purple-" + i,
        cx: pt.x,
        cy: pt.y,
        r: pointR,
        fill: COLORS.purplePoint,
        stroke: "#fff",
        strokeWidth: 0.12,
      }),
    );

  const renderCallout = (anchor, text, key, side) => {
    if (!text) return null;
    const lines = text.split("<br>");
    const align = side || "right";

    const boxW = 46;
    const lineH = 3.2;
    const boxH = lines.length * lineH + 2.4;
    const boxY = anchor.y - boxH - 4;
    const midY = boxY + boxH / 2;

    let boxX;
    let leaderPath;
    const topEdgeY = anchor.y - pointR;
    if (align === "left") {
      boxX = anchor.x - boxW - 8;
      const boxRight = boxX + boxW;
      leaderPath =
        "M " + boxRight + " " + midY + " H " + anchor.x + " V " + topEdgeY;
    } else {
      boxX = anchor.x + 8;
      leaderPath =
        "M " + boxX + " " + midY + " H " + anchor.x + " V " + topEdgeY;
    }

    return React.createElement(
      "g",
      {
        key: key,
        className: "translation-callout",
        opacity: positionCalloutOpacity,
        style: { transition: "opacity 0.05s linear" },
      },
      React.createElement("path", {
        d: leaderPath,
        stroke: "rgba(255,255,255,0.65)",
        strokeWidth: 0.22,
        fill: "none",
      }),
      React.createElement("rect", {
        x: boxX,
        y: boxY,
        width: boxW,
        height: boxH,
        rx: 1.2,
        fill: "rgba(22, 38, 52, 0.94)",
        stroke: "rgba(255,255,255,0.45)",
        strokeWidth: 0.22,
      }),
      lines.map((line, i) =>
        React.createElement(
          "text",
          {
            key: "line-" + i,
            x: boxX + boxW / 2,
            y: boxY + 2.8 + i * lineH,
            fill: "#fff",
            fontSize: 2.7,
            textAnchor: "middle",
            dominantBaseline: "middle",
          },
          handleComma(line),
        ),
      ),
    );
  };

  const renderAngleMarks = (points, markRadius) =>
    points.map((pt, i) => {
      const prev = points[(i + 4) % 5];
      const next = points[(i + 1) % 5];
      return React.createElement("path", {
        key: "angle-" + i,
        d: getInteriorAngleMarkPath(pt, prev, next, markRadius),
        className: "translation-angle-mark",
      });
    });

  const renderShapeClone = () => {
    if (shapeCloneProgress === null || positionActive || orientationActive) {
      return null;
    }
    const center = lerpCenter(grayCenter, yellowCenter, shapeCloneProgress);
    const pts = getPentagonAtCenter(center, radius);
    return React.createElement(
      "g",
      {
        className: "translation-shape-clone",
        opacity: shapeCloneSettled ? 1 : 0.95,
      },
      React.createElement("polygon", {
        points: pts.map((p) => p.x + "," + p.y).join(" "),
        className: "translation-red-stroke",
      }),
      renderAngleMarks(pts, angleMarkR),
    );
  };

  const renderShapeHighlight = () => {
    if (
      !shapeHighlightOnGray ||
      positionActive ||
      orientationActive
    ) {
      return null;
    }
    return React.createElement(
      "g",
      { className: "translation-shape-source" },
      React.createElement("polygon", {
        points: sourceGrayPoints.map((p) => p.x + "," + p.y).join(" "),
        className: "translation-red-stroke",
      }),
      renderAngleMarks(sourceGrayPoints, angleMarkR),
    );
  };

  const renderCaption = (text, cx, cy, visible) => {
    if (!showLabels || !visible) return null;
    return React.createElement(
      "text",
      {
        x: cx,
        y: cy + captionOffset,
        fill: "#d1d5db",
        fontSize: 3.9,
        textAnchor: "middle",
        dominantBaseline: "middle",
        fontWeight: 600,
      },
      text,
    );
  };

  const purpleAnchor = topVertex(yellowPoints);
  const calloutText =
    positionCallout === "original"
      ? APP_DATA.steps[2].positionCalloutOriginal
      : positionCallout === "final"
        ? APP_DATA.steps[2].positionCalloutFinal
        : null;

  const showPreimageLabel = true;
  const showImageLabel = positionActive
    ? positionShowImageLabel
    : showLabels;

  return React.createElement(
    "svg",
    {
      className: "translation-svg translation-properties-svg",
      viewBox: "0 0 " + TRANSLATION_VIEW_W + " " + TRANSLATION_VIEW_H,
      preserveAspectRatio: "xMidYMid meet",
    },
    React.createElement(
      "defs",
      null,
      React.createElement(
        "marker",
        {
          id: "props-arrowhead",
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
    React.createElement("polygon", {
      points: grayPoints.map((p) => p.x + "," + p.y).join(" "),
      fill: COLORS.gray,
      stroke: "none",
      opacity: showGrayPentagon ? grayOpacity : 0,
    }),
    renderShapeHighlight(),
    orientationShowPoints ? renderPurplePoints(grayPoints) : null,
    React.createElement("polygon", {
      points: yellowPoints.map((p) => p.x + "," + p.y).join(" "),
      fill: COLORS.yellow,
      stroke: showSizeStroke ? COLORS.redStroke : "none",
      strokeWidth: showSizeStroke ? 0.55 : 0,
      strokeLinejoin: "round",
    }),
    orientationShowPoints ? renderPurplePoints(restYellowPoints) : null,
    renderShapeClone(),
    renderOrientationArrows(),
    positionShowPurplePoint
      ? React.createElement("circle", {
          cx: purpleAnchor.x,
          cy: purpleAnchor.y,
          r: pointR,
          fill: COLORS.purplePoint,
          stroke: "#fff",
          strokeWidth: 0.12,
          opacity: positionPointOpacity,
          style: { transition: "opacity 0.05s linear" },
        })
      : null,
    positionCallout
      ? renderCallout(
          purpleAnchor,
          calloutText,
          "position-callout",
          positionCallout === "final" ? "left" : "right",
        )
      : null,
    renderCaption(
      APP_DATA.steps[2].labelPreimage,
      grayCenter.x,
      grayCenter.y,
      showPreimageLabel,
    ),
    renderCaption(
      APP_DATA.steps[2].labelImage,
      yellowCenter.x,
      yellowCenter.y,
      showImageLabel,
    ),
  );
};
