const RotationSvg = ({
  step,
  rotationAngle,
  showPathFeedback,
  showClockwiseArrow,
  arrowDrawProgress,
}) => {
  const shapeType = step === 3 ? "rhombus" : "triangle";
  const basePoints =
    shapeType === "rhombus" ? getBaseRhombusPoints() : getBaseTrianglePoints();

  const orangeAngle = rotationAngle;
  const blueAngle = rotationAngle + 180;

  const orangePts = rotatePoints(basePoints, ANCHOR, orangeAngle);
  const bluePts = rotatePoints(basePoints, ANCHOR, blueAngle);

  const yellowRadius = getYellowCircleRadius();
  const purpleRadius = getPurpleCircleRadius();

  const yellowOrange = rotatePointAround(YELLOW_TRACK_LOCAL, ANCHOR, orangeAngle);
  const yellowBlue = rotatePointAround(YELLOW_TRACK_LOCAL, ANCHOR, blueAngle);
  const purpleOrange = rotatePointAround(PURPLE_TRACK_LOCAL, ANCHOR, orangeAngle);
  const purpleBlue = rotatePointAround(PURPLE_TRACK_LOCAL, ANCHOR, blueAngle);

  const guideLen = 6;
  const clockwiseArc =
    showClockwiseArrow && arrowDrawProgress > 0
      ? getClockwiseArcPath(arrowDrawProgress)
      : "";

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
          id: "clockwise-arrow-head",
          markerWidth: 5,
          markerHeight: 5,
          refX: 4.2,
          refY: 2.5,
          orient: "auto",
        },
        React.createElement("path", {
          d: "M0,0 L5,2.5 L0,5 Z",
          fill: COLORS.clockwiseArrow,
        }),
      ),
    ),
    showPathFeedback
      ? React.createElement(
          "g",
          { className: "rotation-path-circles", key: "path-circles" },
          React.createElement("circle", {
            cx: ANCHOR.x,
            cy: ANCHOR.y,
            r: yellowRadius,
            fill: "none",
            stroke: COLORS.yellow,
            strokeWidth: 0.35,
            strokeDasharray: "1.2 1",
          }),
          React.createElement("circle", {
            cx: ANCHOR.x,
            cy: ANCHOR.y,
            r: purpleRadius,
            fill: "none",
            stroke: COLORS.purple,
            strokeWidth: 0.35,
            strokeDasharray: "1.2 1",
          }),
        )
      : null,
    React.createElement("polygon", {
      key: "orange",
      points: pointsToPolygonAttr(orangePts),
      fill: COLORS.orange,
      stroke: "none",
    }),
    React.createElement("polygon", {
      key: "blue",
      points: pointsToPolygonAttr(bluePts),
      fill: COLORS.blue,
      stroke: "none",
    }),
    showPathFeedback
      ? React.createElement(
          "g",
          { className: "rotation-track-points", key: "track-points" },
          React.createElement("circle", {
            cx: yellowOrange.x,
            cy: yellowOrange.y,
            r: 0.9,
            fill: COLORS.yellow,
          }),
          React.createElement("circle", {
            cx: yellowBlue.x,
            cy: yellowBlue.y,
            r: 0.9,
            fill: COLORS.yellow,
          }),
          React.createElement("circle", {
            cx: purpleOrange.x,
            cy: purpleOrange.y,
            r: 0.9,
            fill: COLORS.purple,
          }),
          React.createElement("circle", {
            cx: purpleBlue.x,
            cy: purpleBlue.y,
            r: 0.9,
            fill: COLORS.purple,
          }),
        )
      : null,
    React.createElement("line", {
      x1: ANCHOR.x - guideLen,
      y1: ANCHOR.y,
      x2: ANCHOR.x + guideLen,
      y2: ANCHOR.y,
      stroke: COLORS.guideLine,
      strokeWidth: 0.22,
      strokeDasharray: "0.8 0.6",
    }),
    React.createElement("line", {
      x1: ANCHOR.x,
      y1: ANCHOR.y - guideLen,
      x2: ANCHOR.x,
      y2: ANCHOR.y + guideLen,
      stroke: COLORS.guideLine,
      strokeWidth: 0.22,
      strokeDasharray: "0.8 0.6",
    }),
    React.createElement("circle", {
      cx: ANCHOR.x,
      cy: ANCHOR.y,
      r: 1.1,
      fill: COLORS.anchor,
      stroke: "none",
    }),
    clockwiseArc
      ? React.createElement("path", {
          key: "clockwise-arrow",
          d: clockwiseArc,
          fill: "none",
          stroke: COLORS.clockwiseArrow,
          strokeWidth: 0.85,
          strokeLinecap: "round",
          strokeDasharray: "2.2 1.5",
          className: "rotation-clockwise-arrow",
          markerEnd:
            arrowDrawProgress > 0.08
              ? "url(#clockwise-arrow-head)"
              : undefined,
        })
      : null,
  );
};
