const HexagonLabelGraph = ({ showGray = true, animProgress = 0 }) => {
  const yellowCenter = lerpCenter(
    HEXAGON_PREIMAGE_CENTER,
    HEXAGON_IMAGE_CENTER,
    animProgress,
  );
  const grayPoints = createRegularHexagon(
    HEXAGON_PREIMAGE_CENTER.x,
    HEXAGON_PREIMAGE_CENTER.y,
    HEXAGON_RADIUS,
  );
  const yellowPoints = createRegularHexagon(
    yellowCenter.x,
    yellowCenter.y,
    HEXAGON_RADIUS,
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
  );
};
