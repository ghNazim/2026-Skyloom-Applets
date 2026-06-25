const PROPERTY_IDS = ["size", "shape", "position", "orientation"];

const VIEW_W = 100;
const VIEW_H = 75;

const ANCHOR = { x: 52, y: 52 };
const TRI_SCALE = 1.4;
const TRI_W = 22 * TRI_SCALE;
const TRI_H = 14 * TRI_SCALE;

const ROTATION_DURATION = 900;
const PURPLE_ARROW_GROW_DURATION = 600;
const PROPERTY_ANIM_DELAY = 500;
const SIZE_OVERLAP_DURATION = 900;
const SHAPE_ROTATE_DURATION = 1000;
const POSITION_MARKER_FADE_DURATION = 400;
const POSITION_CALLOUT_HOLD = 2000;
const POSITION_MOVE_DURATION = 900;
const ORIENTATION_ROTATE_DURATION = 900;

const COLORS = {
  orange: "#f2994a",
  blue: "#76c4cf",
  anchor: "#ffffff",
  redStroke: "#e74c3c",
  redPoint: "#e74c3c",
  redArrow: "#e74c3c",
  angleMark: "#fc0000",
  purpleArrow: "#a569bd",
};

function getBaseTrianglePoints() {
  return [
    { x: ANCHOR.x - TRI_W, y: ANCHOR.y },
    { x: ANCHOR.x, y: ANCHOR.y },
    { x: ANCHOR.x - TRI_W, y: ANCHOR.y - TRI_H },
  ];
}

function rotatePointAround(point, center, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos,
  };
}

function rotateTriangle(points, center, angleDeg) {
  return points.map((p) => rotatePointAround(p, center, angleDeg));
}

function pointsToPolygonAttr(points) {
  return points.map((p) => p.x + "," + p.y).join(" ");
}

function getInteriorAngleMarkPath(vertex, prev, next, radius) {
  const v1x = prev.x - vertex.x;
  const v1y = prev.y - vertex.y;
  const v2x = next.x - vertex.x;
  const v2y = next.y - vertex.y;
  const len1 = Math.sqrt(v1x * v1x + v1y * v1y) || 1;
  const len2 = Math.sqrt(v2x * v2x + v2y * v2y) || 1;
  const a1 = Math.atan2(v1y / len1, v1x / len1);
  const a2 = Math.atan2(v2y / len2, v2x / len2);
  let start = a1;
  let end = a2;
  if (end < start) end += Math.PI * 2;
  if (end - start > Math.PI) {
    const tmp = start;
    start = end;
    end = tmp + Math.PI * 2;
  }
  const r = radius !== undefined ? radius : 2.4;
  const x1 = vertex.x + r * Math.cos(start);
  const y1 = vertex.y + r * Math.sin(start);
  const x2 = vertex.x + r * Math.cos(end);
  const y2 = vertex.y + r * Math.sin(end);
  const largeArc = end - start > Math.PI ? 1 : 0;
  return (
    "M " +
    vertex.x +
    "," +
    vertex.y +
    " L " +
    x1 +
    "," +
    y1 +
    " A " +
    r +
    "," +
    r +
    " 0 " +
    largeArc +
    " 1 " +
    x2 +
    "," +
    y2 +
    " Z"
  );
}

function getOrientationArrowPolygon(angleDeg) {
  const base = getBaseTrianglePoints();
  const bottomLeft = base[0];

  const off = 4.8;
  const margin = 1.0;
  const height = TRI_H * 0.9;
  const shaftHalfW = 1.2;
  const headHalfW = shaftHalfW * 2;
  const headH = height * 0.3;
  const shaftH = height - headH;

  const cx = bottomLeft.x - off;
  const bottomY = bottomLeft.y - margin;
  const shaftTopY = bottomY - shaftH;
  const tipY = bottomY - height;

  const localPoly = [
    { x: cx - shaftHalfW, y: bottomY },
    { x: cx - shaftHalfW, y: shaftTopY },
    { x: cx - headHalfW, y: shaftTopY },
    { x: cx, y: tipY },
    { x: cx + headHalfW, y: shaftTopY },
    { x: cx + shaftHalfW, y: shaftTopY },
    { x: cx + shaftHalfW, y: bottomY },
  ];

  if (!angleDeg) return localPoly;
  return localPoly.map((p) => rotatePointAround(p, ANCHOR, angleDeg));
}

function getOrientationArrowPathD(angleDeg) {
  const poly = getOrientationArrowPolygon(angleDeg);
  if (!poly.length) return "";
  return (
    "M " +
    poly.map((p, i) => (i === 0 ? "" : "L ") + p.x + "," + p.y).join(" ") +
    " Z"
  );
}

function getPurpleArcPath(cx, cy, radius, drawProgress) {
  const progress = drawProgress !== undefined ? drawProgress : 1;
  const startRad = (PURPLE_ARC_START_DEG * Math.PI) / 180;
  const sweepRad = ((PURPLE_ARC_SWEEP_DEG * progress) * Math.PI) / 180;
  if (sweepRad <= 0) return "";
  const endRad = startRad + sweepRad;
  const x1 = cx + radius * Math.cos(startRad);
  const y1 = cy + radius * Math.sin(startRad);
  const x2 = cx + radius * Math.cos(endRad);
  const y2 = cy + radius * Math.sin(endRad);
  const largeArc = sweepRad > Math.PI ? 1 : 0;
  return (
    "M " +
    x1 +
    "," +
    y1 +
    " A " +
    radius +
    "," +
    radius +
    " 0 " +
    largeArc +
    " 1 " +
    x2 +
    "," +
    y2
  );
}

const PURPLE_ARC_RADIUS = 9 * TRI_SCALE;
const PURPLE_ARC_START_DEG = 28;
const PURPLE_ARC_SWEEP_DEG = 330;
const ANGLE_MARK_RADIUS = 2.6 * TRI_SCALE;
const POINT_RADIUS = 1.1 * TRI_SCALE;
