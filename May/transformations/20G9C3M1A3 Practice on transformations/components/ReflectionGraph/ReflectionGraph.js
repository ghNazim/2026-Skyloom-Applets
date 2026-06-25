const ReflectionGraph = ({ showGray = true, animProgress = 0 }) => {
  const grayPoints = REFLECTION_TRIANGLE;
  const yellowPoints = flipPointsAcrossVerticalAxis(
    REFLECTION_TRIANGLE,
    REFLECTION_MIRROR_X,
    animProgress,
  );

  return React.createElement(
    "svg",
    {
      className: "translation-svg translation-graph-svg",
      viewBox: "0 0 " + GRAPH_VIEW_W + " " + GRAPH_VIEW_H,
      preserveAspectRatio: "xMidYMid meet",
    },
    React.createElement("line", {
      x1: REFLECTION_MIRROR_X,
      y1: REFLECTION_MIRROR_Y1,
      x2: REFLECTION_MIRROR_X,
      y2: REFLECTION_MIRROR_Y2,
      stroke: "rgba(255, 255, 255, 0.85)",
      strokeWidth: 0.35,
      strokeDasharray: "1.2 0.8",
      opacity: 0.9,
    }),
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
  );
};
