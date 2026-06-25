const VIEW_W = 100;
const VIEW_H = 100;

const ANCHOR = { x: 50, y: 50 };

const TRI_GAP = 9;
const TRI_W = 15;
const TRI_H = 11;

const ROTATION_PERIOD_MS = 2500;

const COLORS = {
  orange: "#f59661",
  blue: "#4ec3ca",
  anchor: "#ffffff",
  guideLine: "rgba(255, 211, 77, 0.75)",
  yellow: "#fdd835",
  purple: "#e91e63",
  clockwiseArrow: "#fdd835",
};

function getTriangleInnerCorner() {
  return { x: ANCHOR.x - TRI_GAP, y: ANCHOR.y - TRI_GAP };
}

function getBaseTrianglePoints() {
  const inner = getTriangleInnerCorner();
  return [
    { x: inner.x - TRI_W, y: inner.y },
    { x: inner.x, y: inner.y },
    { x: inner.x - TRI_W, y: inner.y - TRI_H },
  ];
}

function getYellowTrackLocal() {
  const inner = getTriangleInnerCorner();
  return { x: inner.x - TRI_W, y: inner.y - TRI_H };
}

function getPurpleTrackLocal() {
  const inner = getTriangleInnerCorner();
  return {
    x: inner.x - TRI_W * 0.55,
    y: inner.y - TRI_H * 0.3,
  };
}

const YELLOW_TRACK_LOCAL = getYellowTrackLocal();
const PURPLE_TRACK_LOCAL = getPurpleTrackLocal();

const CLOCKWISE_ARC_RADIUS = 27;
const CLOCKWISE_ARC_START_DEG = 200;
const CLOCKWISE_ARC_SWEEP_DEG = 300;
const CLOCKWISE_ARROW_GROW_MS = 900;
const CLOCKWISE_ARROW_HOLD_MS = 200;

function getBaseRhombusPoints() {
  const cx = ANCHOR.x - TRI_GAP - TRI_W * 0.62;
  const cy = ANCHOR.y - TRI_GAP - TRI_H * 0.62;
  const hw = TRI_W * 0.48;
  const hh = TRI_H * 0.42;
  return [
    { x: cx, y: cy - hh },
    { x: cx + hw, y: cy },
    { x: cx, y: cy + hh },
    { x: cx - hw, y: cy },
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

function rotatePoints(points, center, angleDeg) {
  return points.map((p) => rotatePointAround(p, center, angleDeg));
}

function pointsToPolygonAttr(points) {
  return points.map((p) => p.x + "," + p.y).join(" ");
}

function distFromAnchor(point) {
  const dx = point.x - ANCHOR.x;
  const dy = point.y - ANCHOR.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function getYellowCircleRadius() {
  return distFromAnchor(YELLOW_TRACK_LOCAL);
}

function getPurpleCircleRadius() {
  return distFromAnchor(PURPLE_TRACK_LOCAL);
}

function getClockwiseArcPath(drawProgress) {
  const progress = drawProgress !== undefined ? drawProgress : 1;
  const cx = ANCHOR.x;
  const cy = ANCHOR.y;
  const radius = CLOCKWISE_ARC_RADIUS;
  const startRad = (CLOCKWISE_ARC_START_DEG * Math.PI) / 180;
  const sweepRad = ((CLOCKWISE_ARC_SWEEP_DEG * progress) * Math.PI) / 180;
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

function getContinuousAngle(elapsedMs) {
  return ((elapsedMs % ROTATION_PERIOD_MS) / ROTATION_PERIOD_MS) * 360;
}

const PARKING_CIRCLE_RADIUS = 28.8;
const CAR_IMG_W = 13;
const CAR_IMG_H = 22;
const OBSTACLE_IMG_W = 17;
const OBSTACLE_IMG_H = 14;
const PARKING_SPOT_W = 18;
const PARKING_SPOT_H = 11;
const CAR_ANIM_DURATION_MS = 1200;
const OBSTACLE_Y_ON_CIRCLE = 6;
const ANTICLOCKWISE_CRASH_ANGLE = 90;
const CRASH_CAR_ANGLE = -90;
const CAR_START_ANGLE = 0;
const STEP4_CORRECT_DIRECTION = "clockwise";
const STEP4_CORRECT_ANGLE = 90;

function getPointOnParkingCircle(angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: ANCHOR.x + PARKING_CIRCLE_RADIUS * Math.cos(rad),
    y: ANCHOR.y + PARKING_CIRCLE_RADIUS * Math.sin(rad),
  };
}

function getCarRotationDeg(positionAngleDeg) {
  return positionAngleDeg - 90;
}

function getObstacleTopLeft() {
  const topPt = getPointOnParkingCircle(-90);
  return {
    x: topPt.x - OBSTACLE_IMG_W / 2,
    y: topPt.y + OBSTACLE_Y_ON_CIRCLE - OBSTACLE_IMG_H,
  };
}

function getEffectiveRotationAngle(direction, angleDeg) {
  if (
    direction === "anticlockwise" &&
    angleDeg >= ANTICLOCKWISE_CRASH_ANGLE
  ) {
    return ANTICLOCKWISE_CRASH_ANGLE;
  }
  return angleDeg;
}

function isAnticlockwiseCrash(direction, angleDeg) {
  return (
    direction === "anticlockwise" && angleDeg >= ANTICLOCKWISE_CRASH_ANGLE
  );
}

function getTargetCarAngle(direction, angleDeg) {
  const effective = getEffectiveRotationAngle(direction, angleDeg);
  const signed = direction === "clockwise" ? effective : -effective;
  return CAR_START_ANGLE + signed;
}

function isStep4AnswerCorrect(direction, angleDeg) {
  return (
    direction === STEP4_CORRECT_DIRECTION && angleDeg === STEP4_CORRECT_ANGLE
  );
}

function animateCarAngle(fromAngle, toAngle, durationMs, onUpdate, onComplete) {
  const start = performance.now();
  let rafId = null;

  const tick = (now) => {
    const t = Math.min(1, (now - start) / durationMs);
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const current = fromAngle + (toAngle - fromAngle) * eased;
    onUpdate(current);
    if (t < 1) {
      rafId = requestAnimationFrame(tick);
    } else if (typeof onComplete === "function") {
      onComplete();
    }
  };

  rafId = requestAnimationFrame(tick);

  return () => {
    if (rafId) cancelAnimationFrame(rafId);
  };
}
