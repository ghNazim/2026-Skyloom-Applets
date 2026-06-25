const RotationGraph = (props) => {
  const {
    orangeAngle = 0,
    blueAngle = 90,
    blueOpacity = 1,
    showOrange = true,
    showBlue = true,
    showPurpleArrow = false,
    purpleArrowDrawProgress = 1,
    showSizeStroke = false,
    sizeOverlapProgress = 0,
    shapeOnOrange = false,
    shapeGroupAngle = 0,
    positionMode = false,
    positionBlueProgress = 0,
    positionPointOpacity = 0,
    positionCallout = null,
    positionCalloutOpacity = 0,
    orientationMode = false,
    orientationProgress = 0,
    showOrientationArrows = false,
    orangeClickable = false,
    onOrangeClick,
  } = props;

  const basePoints = getBaseTrianglePoints();

  const getOrangePts = () => rotateTriangle(basePoints, ANCHOR, orangeAngle);
  const getBluePts = (angle) =>
    rotateTriangle(basePoints, ANCHOR, angle !== undefined ? angle : blueAngle);

  let orangePts = getOrangePts();
  let bluePts;
  let sizeStrokePts = null;

  if (sizeOverlapProgress > 0) {
    const orangeRot = orangeAngle + sizeOverlapProgress * 45;
    const blueRot = blueAngle - sizeOverlapProgress * 45;
    orangePts = rotateTriangle(basePoints, ANCHOR, orangeRot);
    bluePts = rotateTriangle(basePoints, ANCHOR, blueRot);
    if (showSizeStroke) {
      sizeStrokePts = rotateTriangle(basePoints, ANCHOR, 45);
    }
  } else {
    bluePts = getBluePts();
  }

  if (positionMode) {
    orangePts = getOrangePts();
    const posAngle = orientationMode ? 0 : positionBlueProgress * 90;
    bluePts = rotateTriangle(basePoints, ANCHOR, posAngle);
  }

  if (orientationMode) {
    orangePts = getOrangePts();
    const orientAngle = orientationProgress * 90;
    bluePts = rotateTriangle(basePoints, ANCHOR, orientAngle);
  }

  const topLeftVertex = (pts) => pts[2];

  const renderAngleMarks = (points) =>
    points.map((pt, i) => {
      const prev = points[(i + 2) % 3];
      const next = points[(i + 1) % 3];
      return React.createElement("path", {
        key: "angle-" + i,
        d: getInteriorAngleMarkPath(pt, prev, next, ANGLE_MARK_RADIUS),
        className: "rotation-angle-mark",
      });
    });

  const renderShapeGroup = () => {
    if (!shapeOnOrange && shapeGroupAngle <= 0) return null;
    const angle = shapeGroupAngle;
    const pts = rotateTriangle(basePoints, ANCHOR, angle);
    return React.createElement(
      "g",
      { className: "rotation-shape-group", key: "shape-group" },
      React.createElement("polygon", {
        points: pointsToPolygonAttr(pts),
        className: "rotation-red-stroke",
      }),
      renderAngleMarks(pts),
    );
  };

  const renderCallout = (anchor, text, key, side) => {
    if (!text) return null;
    const lines = text.split("<br>");
    const boxW = 44;
    const lineH = 3.2;
    const boxH = lines.length * lineH + 2.4;
    const boxY = anchor.y - boxH - 5;
    const midY = boxY + boxH / 2;
    let boxX;
    let leaderPath;
    const topEdgeY = anchor.y - POINT_RADIUS;
    if (side === "left") {
      boxX = anchor.x - boxW - 10;
      leaderPath =
        "M " +
        (boxX + boxW) +
        " " +
        midY +
        " H " +
        anchor.x +
        " V " +
        topEdgeY;
    } else {
      boxX = anchor.x + 10;
      leaderPath =
        "M " + boxX + " " + midY + " H " + anchor.x + " V " + topEdgeY;
    }
    return React.createElement(
      "g",
      {
        key: key,
        className: "rotation-callout",
        opacity: positionCalloutOpacity,
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
            fontSize: 2.6,
            textAnchor: "middle",
            dominantBaseline: "middle",
          },
          handleComma(line),
        ),
      ),
    );
  };

  const positionPoint = positionMode
    ? topLeftVertex(
        positionBlueProgress > 0
          ? bluePts
          : orangePts,
      )
    : null;

  const calloutText =
    positionCallout === "original"
      ? APP_DATA.steps[2].positionCalloutOriginal
      : positionCallout === "final"
        ? APP_DATA.steps[2].positionCalloutFinal
        : null;

  const renderOrientationArrow = (angleDeg, key) =>
    React.createElement("path", {
      key: key,
      d: getOrientationArrowPathD(angleDeg),
      fill: COLORS.redArrow,
      stroke: "none",
    });

  const orientBlueVisible = !orientationMode || orientationProgress > 0;

  const purpleArc = getPurpleArcPath(
    ANCHOR.x,
    ANCHOR.y,
    PURPLE_ARC_RADIUS,
    purpleArrowDrawProgress,
  );

  return React.createElement(
    "svg",
    {
      className: "rotation-svg",
      viewBox: "0 0 " + VIEW_W + " " + VIEW_H,
      preserveAspectRatio: "xMidYMid meet",
    },
    React.createElement(
      "defs",
      null,
      React.createElement(
        "marker",
        {
          id: "rotation-purple-head",
          markerWidth: 4,
          markerHeight: 4,
          refX: 2,
          refY: 2,
          orient: "auto",
        },
        React.createElement("path", {
          d: "M0,0 L4,2 L0,4 Z",
          fill: COLORS.purpleArrow,
        }),
      ),
    ),
    showOrange
      ? React.createElement("polygon", {
          key: "orange",
          points: pointsToPolygonAttr(orangePts),
          fill: COLORS.orange,
          stroke: "none",
          style: { cursor: orangeClickable ? "pointer" : "default" },
          onClick: orangeClickable ? onOrangeClick : undefined,
        })
      : null,
    showOrange && orangeClickable
      ? React.createElement("polygon", {
          key: "orange-hit",
          points: pointsToPolygonAttr(orangePts),
          fill: "transparent",
          stroke: "none",
          style: { cursor: "pointer" },
          onClick: onOrangeClick,
        })
      : null,
    orientationMode && showOrientationArrows
      ? renderOrientationArrow(0, "orient-arrow-orange")
      : null,
    showBlue && blueOpacity > 0 && orientBlueVisible
      ? React.createElement("polygon", {
          key: "blue",
          points: pointsToPolygonAttr(bluePts),
          fill: COLORS.blue,
          stroke: "none",
          opacity: blueOpacity,
        })
      : null,
    orientationMode && orientationProgress > 0 && showOrientationArrows
      ? renderOrientationArrow(
          orientationProgress * 90,
          "orient-arrow-blue",
        )
      : null,
    sizeStrokePts
      ? React.createElement("polygon", {
          key: "size-stroke",
          points: pointsToPolygonAttr(sizeStrokePts),
          className: "rotation-red-stroke rotation-size-stroke",
        })
      : null,
    shapeOnOrange && shapeGroupAngle <= 0
      ? React.createElement(
          "g",
          { key: "shape-on-orange" },
          React.createElement("polygon", {
            points: pointsToPolygonAttr(orangePts),
            className: "rotation-red-stroke",
          }),
          renderAngleMarks(orangePts),
        )
      : null,
    renderShapeGroup(),
    React.createElement("circle", {
      cx: ANCHOR.x,
      cy: ANCHOR.y,
      r: 1.2,
      fill: COLORS.anchor,
      stroke: "none",
    }),
    positionMode && positionPointOpacity > 0
      ? React.createElement("circle", {
          cx: positionPoint.x,
          cy: positionPoint.y,
          r: POINT_RADIUS,
          fill: COLORS.redPoint,
          stroke: "#fff",
          strokeWidth: 0.15,
          opacity: positionPointOpacity,
        })
      : null,
    positionCallout
      ? renderCallout(
          positionPoint || topLeftVertex(orangePts),
          calloutText,
          "position-callout",
          positionCallout === "final" ? "left" : "right",
        )
      : null,
    showPurpleArrow && purpleArc
      ? React.createElement(
          "g",
          { className: "rotation-purple-arrow" },
          React.createElement("path", {
            d: purpleArc,
            fill: "none",
            stroke: COLORS.purpleArrow,
            strokeWidth: 0.45,
            strokeLinecap: "round",
            markerEnd:
              purpleArrowDrawProgress > 0.05
                ? "url(#rotation-purple-head)"
                : undefined,
          }),
        )
      : null,
  );
};
