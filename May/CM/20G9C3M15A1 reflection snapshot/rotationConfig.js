const REFLECTION_IDS = [
  "xAxis",
  "yAxis",
  "lineYH",
  "lineXK",
  "lineYX",
  "lineYNegX",
];

const IMPLEMENTED_REFLECTION_IDS = REFLECTION_IDS;

const GRAPH_VIEW_SIZE = 500;
const GRAPH_RANGE = 6;
const GRAPH_MARGIN = 42;
const GRAPH_SCALE = (GRAPH_VIEW_SIZE - GRAPH_MARGIN * 2) / (GRAPH_RANGE * 2);
const GRAPH_CENTER = { x: GRAPH_VIEW_SIZE / 2, y: GRAPH_VIEW_SIZE / 2 };

const PREFOLD_POINT_DURATION = 504;
const PREFOLD_GUIDE_DURATION = 624;
const REFLECTOR_GROW_DURATION = 672;
const OFFSET_MEASURE_DURATION = 576;
const PROJECTION_GROW_DURATION = 672;
const FOLD_DURATION = 1620;
const FINAL_GUIDE_DURATION = 624;
const ANIMATION_PAUSE = 750;
const POST_FOLD_PROMPT_DELAY = 2000;

const REFLECTION_COLORS = {
  axis: "#ffffff",
  grid: "rgba(255,255,255,0.18)",
  guide: "rgba(226,232,240,0.72)",
  reflector: "#facc15",
  point: "#fb923c",
  pointStroke: "#fff7ed",
  projection: "#facc15",
  reflected: "#22d3ee",
  reflectedStroke: "#ecfeff",
  xToken: "#ff7ac8",
  yToken: "#c084fc",
  swapToken: "#86efac",
  panelFill: "rgba(250,204,21,0.16)",
  panelStroke: "rgba(250,204,21,0.5)",
};

const RAW_REFLECTION_CASES = {
  xAxis: {
    point: { x: 4, y: 3 },
    line: { a: 0, b: 1, c: 0 },
    segment: [{ x: -GRAPH_RANGE, y: 0 }, { x: GRAPH_RANGE, y: 0 }],
    equationOffset: { x: -3, y: 0.55 },
    finalGuides: [
      {
        from: { x: 4, y: -3 },
        to: { x: 0, y: -3 },
        labelKey: "negativeY",
        labelOffset: { x: -0.28, y: -0.16 },
      },
    ],
    resultTone: { x: "x", y: "y" },
  },
  yAxis: {
    point: { x: 4, y: 3 },
    line: { a: 1, b: 0, c: 0 },
    segment: [{ x: 0, y: -GRAPH_RANGE }, { x: 0, y: GRAPH_RANGE }],
    equationOffset: { x: 0.68, y: -3 },
    finalGuides: [
      {
        from: { x: -4, y: 3 },
        to: { x: -4, y: 0 },
        labelKey: "negativeX",
        labelOffset: { x: 0.18, y: -0.28 },
      },
    ],
    resultTone: { x: "x", y: "y" },
  },
  lineYH: {
    point: { x: 3, y: 4 },
    line: { a: 0, b: 1, c: -1 },
    segment: [{ x: -GRAPH_RANGE, y: 1 }, { x: GRAPH_RANGE, y: 1 }],
    equationOffset: { x: -3, y: 1.55 },
    finalGuides: [
      {
        from: { x: 3, y: -2 },
        to: { x: 3, y: 0 },
        labelKey: "x",
        labelOffset: { x: 0.16, y: -0.28 },
      },
      {
        from: { x: 3, y: -2 },
        to: { x: 0, y: -2 },
        labelKey: "reflectedYH",
        labelOffset: { x: -0.4, y: -0.16 },
      },
    ],
    resultTone: { x: "x", y: "y" },
  },
  lineXK: {
    point: { x: 4, y: 3 },
    line: { a: 1, b: 0, c: -1 },
    segment: [{ x: 1, y: -GRAPH_RANGE }, { x: 1, y: GRAPH_RANGE }],
    equationOffset: { x: 1.7, y: -3 },
    finalGuides: [
      {
        from: { x: -2, y: 3 },
        to: { x: -2, y: 0 },
        labelKey: "reflectedXK",
        labelOffset: { x: 0.28, y: -0.28 },
      },
    ],
    resultTone: { x: "x", y: "y" },
  },
  lineYX: {
    point: { x: 4, y: 2 },
    line: { a: 1, b: -1, c: 0 },
    segment: [{ x: -GRAPH_RANGE, y: -GRAPH_RANGE }, { x: GRAPH_RANGE, y: GRAPH_RANGE }],
    equationOffset: { x: -3.2, y: -2.45 },
    finalGuides: [
      {
        from: { x: 2, y: 4 },
        to: { x: 2, y: 0 },
        labelKey: "y",
        labelOffset: { x: 0.16, y: -0.28 },
      },
      {
        from: { x: 2, y: 4 },
        to: { x: 0, y: 4 },
        labelKey: "x",
        labelOffset: { x: -0.28, y: -0.16 },
      },
    ],
    resultTone: { x: "swap", y: "x" },
  },
  lineYNegX: {
    point: { x: 3, y: 2 },
    line: { a: 1, b: 1, c: 0 },
    segment: [{ x: -GRAPH_RANGE, y: GRAPH_RANGE }, { x: GRAPH_RANGE, y: -GRAPH_RANGE }],
    equationOffset: { x: -3.45, y: 2.72 },
    finalGuides: [
      {
        from: { x: -2, y: -3 },
        to: { x: -2, y: 0 },
        labelKey: "negativeY",
        labelOffset: { x: 0.18, y: -0.28 },
      },
      {
        from: { x: -2, y: -3 },
        to: { x: 0, y: -3 },
        labelKey: "negativeX",
        labelOffset: { x: -0.36, y: -0.16 },
      },
    ],
    resultTone: { x: "swap", y: "y" },
  },
};

const REFLECTION_CASES = Object.fromEntries(
  Object.entries(RAW_REFLECTION_CASES).map(([key, item]) => {
    const norm = Math.hypot(item.line.a, item.line.b);
    const line = {
      a: item.line.a / norm,
      b: item.line.b / norm,
      c: item.line.c / norm,
    };
    return [
      key,
      {
        ...item,
        line,
        reflected: reflectGraphPoint(line, item.point),
        foot: projectGraphPoint(line, item.point),
      },
    ];
  }),
);

function graphToSvg(point) {
  return {
    x: GRAPH_CENTER.x + point.x * GRAPH_SCALE,
    y: GRAPH_CENTER.y - point.y * GRAPH_SCALE,
  };
}

function signedGraphDistance(line, point) {
  return line.a * point.x + line.b * point.y + line.c;
}

function projectGraphPoint(line, point) {
  const distance = signedGraphDistance(line, point);
  return {
    x: point.x - distance * line.a,
    y: point.y - distance * line.b,
  };
}

function reflectGraphPoint(line, point) {
  const distance = signedGraphDistance(line, point);
  return {
    x: point.x - 2 * distance * line.a,
    y: point.y - 2 * distance * line.b,
  };
}

function foldGraphPoint(line, point, theta) {
  const distance = signedGraphDistance(line, point);
  const foot = projectGraphPoint(line, point);
  const foldedDistance = distance * Math.cos(theta);
  return {
    x: foot.x + foldedDistance * line.a,
    y: foot.y + foldedDistance * line.b,
  };
}

function interpolateGraphPoint(from, to, progress) {
  return {
    x: from.x + (to.x - from.x) * progress,
    y: from.y + (to.y - from.y) * progress,
  };
}

function clipSegmentToGraphHalf(p1, p2, line, side) {
  const d1 = side * signedGraphDistance(line, p1);
  const d2 = side * signedGraphDistance(line, p2);
  const keep1 = d1 >= -0.0001;
  const keep2 = d2 >= -0.0001;
  if (keep1 && keep2) return [p1, p2];
  if (!keep1 && !keep2) return null;
  const t = d1 / (d1 - d2);
  const hit = interpolateGraphPoint(p1, p2, t);
  return keep1 ? [p1, hit] : [hit, p2];
}

function clipPolygonToGraphHalf(poly, line, side) {
  const result = [];
  for (let i = 0; i < poly.length; i++) {
    const current = poly[i];
    const previous = poly[(i + poly.length - 1) % poly.length];
    const currentInside = side * signedGraphDistance(line, current) >= -0.0001;
    const previousInside = side * signedGraphDistance(line, previous) >= -0.0001;

    if (currentInside !== previousInside) {
      const dPrevious = side * signedGraphDistance(line, previous);
      const dCurrent = side * signedGraphDistance(line, current);
      const t = dPrevious / (dPrevious - dCurrent);
      result.push(interpolateGraphPoint(previous, current, t));
    }

    if (currentInside) result.push(current);
  }
  return result;
}

function buildFoldModel(caseConfig) {
  const line = caseConfig.line;
  const side = signedGraphDistance(line, caseConfig.point) >= 0 ? 1 : -1;
  const square = [
    { x: -GRAPH_RANGE, y: -GRAPH_RANGE },
    { x: GRAPH_RANGE, y: -GRAPH_RANGE },
    { x: GRAPH_RANGE, y: GRAPH_RANGE },
    { x: -GRAPH_RANGE, y: GRAPH_RANGE },
  ];
  const polygon = clipPolygonToGraphHalf(square, line, side);
  const segments = [];

  [
    [{ x: -GRAPH_RANGE, y: 0 }, { x: GRAPH_RANGE, y: 0 }, "axis"],
    [{ x: 0, y: -GRAPH_RANGE }, { x: 0, y: GRAPH_RANGE }, "axis"],
    [caseConfig.point, { x: caseConfig.point.x, y: 0 }, "guide"],
    [caseConfig.point, { x: 0, y: caseConfig.point.y }, "guide"],
    [caseConfig.point, caseConfig.foot, "projection"],
  ].forEach(([from, to, type]) => {
    const clipped = clipSegmentToGraphHalf(from, to, line, side);
    if (clipped) segments.push({ points: clipped, type });
  });

  return { polygon, segments };
}
