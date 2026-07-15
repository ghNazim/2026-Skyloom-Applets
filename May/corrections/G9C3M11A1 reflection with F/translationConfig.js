const PROPERTY_IDS = ["size", "shape", "position", "orientation"];

const TRANSLATION_VIEW_W = 100;
const TRANSLATION_VIEW_H = 75;

// ── Pentagon size (radius in SVG viewBox units) ─────────────────────────────
// Increase/decrease these values to scale the pentagon in each step.
const PENTAGON_RADIUS_STEP1 = 16;
const PENTAGON_RADIUS_STEP2 = 16;

// ── Step 1 positions (center x,y of each pentagon) ──────────────────────────
// Edit PREIMAGE_CENTER for the starting (gray) position.
// Edit IMAGE_CENTER for where the yellow pentagon moves after translation.
const PREIMAGE_CENTER = { x: 22, y: 48 };
const IMAGE_CENTER = { x: 75, y: 36 };

// ── Step 2 positions ────────────────────────────────────────────────────────
// Both pentagons share the same y (vertical middle of the panel).
// Edit x values to move left/right; edit STEP2_PANEL_MID_Y to shift both up/down.
const STEP2_PANEL_MID_Y = TRANSLATION_VIEW_H / 2;
const STEP2_PREIMAGE_CENTER = { x: 22, y: STEP2_PANEL_MID_Y };
const STEP2_IMAGE_CENTER = { x: 82, y: STEP2_PANEL_MID_Y };
const STEP2_OVERLAP_CENTER = {
  x: (STEP2_PREIMAGE_CENTER.x + STEP2_IMAGE_CENTER.x) / 2,
  y: STEP2_PANEL_MID_Y,
};

const PENTAGON_LABELS = ["A", "B", "C", "D", "E"];
const PENTAGON_PRIME_LABELS = ["A\u2032", "B\u2032", "C\u2032", "D\u2032", "E\u2032"];

const TRANSLATION_MOVE_DURATION = 900;
const ARROW_GROW_DURATION = 700;
const ARROW_MERGE_DURATION = 800;
const ORIENTATION_ARROW_GROW_DURATION = 1200;
const ORIENTATION_ARROW_MERGE_DURATION = 1400;
const STEP2_INTRO_DURATION = 900;
const SIZE_OVERLAP_DURATION = 900;
const SIZE_HOLD_DURATION = 3000;
const SHAPE_CLONE_DURATION = 1000;
const POSITION_CALLOUT_HOLD = 3000;
const POSITION_MOVE_DURATION = 900;
const POSITION_INITIAL_DELAY = 500;
const POSITION_MARKER_FADE_DURATION = 400;
const PROPERTY_ANIM_DELAY = 500;
const ORIENTATION_RESET_DURATION = 600;

const COLORS = {
  yellow: "#f1c40f",
  yellowPoint: "#d4a80a",
  gray: "#4a5568",
  grayPoint: "#9ca3af",
  arrow: "#9ca3af",
  redStroke: "#e74c3c",
  angleMark: "#c084fc",
  purplePoint: "#c084fc",
  labelPill: "rgba(75, 85, 99, 0.85)",
};

function createRegularPentagon(cx, cy, radius) {
  const points = [];
  for (let i = 0; i < 5; i++) {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / 5;
    points.push({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    });
  }
  return points;
}

function translatePoints(points, dx, dy) {
  return points.map((p) => ({ x: p.x + dx, y: p.y + dy }));
}

function pointsToPath(points) {
  if (!points || !points.length) return "";
  return (
    "M " +
    points.map((p, i) => (i === 0 ? "" : "L ") + p.x + "," + p.y).join(" ") +
    " Z"
  );
}

function lerpPoint(a, b, t) {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  };
}

function lerpCenter(from, to, t) {
  return lerpPoint(from, to, t);
}

function getTranslationVector(from, to) {
  return { dx: to.x - from.x, dy: to.y - from.y };
}

function getPentagonAtCenter(center, radius) {
  return createRegularPentagon(center.x, center.y, radius);
}

function getAngleMarkRadius(pentagonRadius) {
  return pentagonRadius * 0.28;
}

function getCaptionOffset(pentagonRadius) {
  return pentagonRadius + 4;
}

const INITIAL_PREIMAGE_POINTS = getPentagonAtCenter(
  PREIMAGE_CENTER,
  PENTAGON_RADIUS_STEP1,
);
const INITIAL_IMAGE_POINTS = getPentagonAtCenter(
  IMAGE_CENTER,
  PENTAGON_RADIUS_STEP1,
);

function getArrowAngleDeg(x1, y1, x2, y2) {
  return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
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
  const r = radius !== undefined ? radius : 2.2;
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
