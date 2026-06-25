const DilationGraph = ({ showGray = true, animProgress = 0 }) => {
  const grayPoints = createRegularPentagon(
    DILATION_CENTER.x,
    DILATION_CENTER.y,
    PENTAGON_RADIUS,
  );
  const scale = 1 + (DILATION_SCALE - 1) * animProgress;
  const yellowPoints = scalePointsFromCenter(
    grayPoints,
    DILATION_CENTER,
    scale,
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
      fillOpacity: 0.7,
      stroke: "none",
    }),
    React.createElement("circle", {
      cx: DILATION_CENTER.x,
      cy: DILATION_CENTER.y,
      r: 1.4,
      fill: COLORS.anchor,
      stroke: "none",
    }),
  );
};
