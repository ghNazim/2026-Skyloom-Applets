const TranslationGraph = ({
  showGray = true,
  animProgress = 0,
  yellowProgress,
}) => {
  const { useMemo } = React;
  const progress = yellowProgress !== undefined ? yellowProgress : animProgress;

  const yellowCenter = lerpCenter(PREIMAGE_CENTER, IMAGE_CENTER, progress);
  const grayPoints = getRhombusAtCenter(PREIMAGE_CENTER, RHOMBUS_RADIUS);
  const yellowPoints = getRhombusAtCenter(yellowCenter, RHOMBUS_RADIUS);

  const arrowPairs = useMemo(() => {
    return grayPoints.map((from, i) => ({
      from,
      to: yellowPoints[i],
    }));
  }, [grayPoints, yellowPoints]);

  const renderArrow = (from, to, key) => {
    const len = Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2);
    if (len < 0.1) return null;
    return React.createElement("line", {
      key: key,
      x1: from.x,
      y1: from.y,
      x2: to.x,
      y2: to.y,
      stroke: COLORS.arrow,
      strokeWidth: 0.35,
      strokeDasharray: "1.2 0.8",
      markerEnd: "url(#translation-arrowhead)",
      opacity: 0.9,
    });
  };

  return React.createElement(
    "svg",
    {
      className: "translation-svg translation-graph-svg",
      viewBox: "0 0 " + GRAPH_VIEW_W + " " + GRAPH_VIEW_H,
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
    }),
    progress > 0
      ? arrowPairs.map((pair, i) =>
          renderArrow(pair.from, pair.to, "arrow-" + i),
        )
      : null,
  );
};
