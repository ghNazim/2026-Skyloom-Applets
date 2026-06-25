const RotationGraph = ({ showGray = true, animProgress = 0 }) => {
  const angle = ROTATION_ANGLE * animProgress;
  const grayPoints = getRectPoints(
    ROTATION_CENTER.x,
    ROTATION_CENTER.y,
    RECT_WIDTH,
    RECT_HEIGHT,
    0,
  );
  const yellowPoints = getRectPoints(
    ROTATION_CENTER.x,
    ROTATION_CENTER.y,
    RECT_WIDTH,
    RECT_HEIGHT,
    angle,
  );

  return React.createElement(
    "svg",
    {
      className: "translation-svg translation-graph-svg",
      viewBox: "0 0 " + GRAPH_VIEW_W + " " + GRAPH_VIEW_H,
      preserveAspectRatio: "xMidYMid meet",
    },
    showGray
      ? React.createElement("polygon", {
          points: pointsToPolygonAttr(grayPoints),
          fill: COLORS.gray,
          stroke: "none",
        })
      : null,
    React.createElement("polygon", {
      points: pointsToPolygonAttr(yellowPoints),
      fill: COLORS.yellow,
      stroke: "none",
    }),
    React.createElement("circle", {
      cx: ROTATION_CENTER.x,
      cy: ROTATION_CENTER.y,
      r: 1.4,
      fill: COLORS.anchor,
      stroke: "none",
    }),
  );
};
