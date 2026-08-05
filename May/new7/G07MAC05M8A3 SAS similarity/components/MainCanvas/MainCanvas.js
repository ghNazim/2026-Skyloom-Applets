/* ── SSS Similarity – Main Canvas ── */

const VIEWBOX = "0 0 1000 430";
const SVG_W = 1000;
const SVG_H = 430;

const SCALE = 55;
const DRAG_RADIUS = 40;
const FINAL_SNAP_DISTANCE = 18; // Step 3: max px gap for two endpoints to count as one vertex
const DRAW_SNAP_DISTANCE = 24;

const COLOR_BLUE = "#5ec4e0";
const COLOR_YELLOW = "#ffc830";
const COLOR_WHITE = "#ffffff";
const BLUE_POINT_RADIUS = 8;
const YELLOW_POINT_RADIUS = 7;
const STROKE_WIDTH = 4;
const YELLOW_STROKE_WIDTH = 5;
const LABEL_FONT_SIZE = 22;
const YELLOW_LABEL_FONT_SIZE = LABEL_FONT_SIZE - 2;
const RATIO_BOX_NUM_FONT_SIZE = 19;
const MOVE_HANDLE_RADIUS = 16;
const ROT_HANDLE_SIZE = 50;
const ROT_HANDLE_SRC = "assets/rothandle.png";

/**
 * STEP 2 – Yellow line placement (SVG viewBox 0 0 1000 430)
 * ─────────────────────────────────────────────────────────────
 * Edit these values to reposition the three parallel yellow lines:
 *   centerX     – horizontal centre of each line
 *   startY      – Y of the first line (AC)
 *   lineSpacing – vertical gap between lines
 *   angleDeg    – shared tilt in degrees (0 = perfectly horizontal)
 *
 * Ratio box occupies roughly x 280–680, y 55–135 — keep lines below/right of that.
 */
const YELLOW_LINES_LAYOUT = {
  centerX: 730,
  startY: 268,
  lineSpacing: 58,
  angleDeg: 0,
};

function placeYellowLines(lines, layout = YELLOW_LINES_LAYOUT) {
  const rad = (layout.angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  lines.forEach((line, i) => {
    const halfLen = line.length / 2;
    const cx = layout.centerX;
    const cy = layout.startY + i * layout.lineSpacing;
    line.p1 = { x: cx - cos * halfLen, y: cy - sin * halfLen };
    line.p2 = { x: cx + cos * halfLen, y: cy + sin * halfLen };
  });
  return lines;
}

/**
 * STEP 2 – Ratio box layout (SVG viewBox 0 0 1000 430)
 * ─────────────────────────────────────────────────────────────
 * Edit boxX / boxY to move the ratio box; all clones and text follow automatically.
 */
const RATIO_BOX_LAYOUT = {
  boxX: 345,
  boxY: 55,
  boxW: 310,
  boxH: 80,
  fracSpacing: 95,
  fractionOffsetX: 75,
  proportionalTextY: 8,
  numOffsetY: -15,
  denOffsetY: 17,
  resultOffsetX: 65,
  proportionalLineHeight: 17,
};

function getRatioBoxPositions(layout = RATIO_BOX_LAYOUT) {
  const startX = layout.boxX + layout.fractionOffsetX;
  const centerY = layout.boxY + layout.boxH / 2;
  const centerX = layout.boxX + layout.boxW / 2;
  return {
    boxX: layout.boxX,
    boxY: layout.boxY,
    boxW: layout.boxW,
    boxH: layout.boxH,
    fracSpacing: layout.fracSpacing,
    startX,
    centerY,
    centerX,
    proportionalTextY: layout.proportionalTextY,
    numOffsetY: layout.numOffsetY,
    denOffsetY: layout.denOffsetY,
    resultOffsetX: layout.resultOffsetX,
    proportionalLineHeight: layout.proportionalLineHeight,
  };
}

const BASE_A = { x: 1.8, y: -2.64575 };
const BASE_B = { x: 0, y: 0 };
const BASE_C = { x: 4.8, y: 0 };

function getInitialTrianglePositions() {
  const cx = SVG_W / 2;
  const cy = SVG_H / 2;
  const triCenterX = (BASE_A.x + BASE_B.x + BASE_C.x) / 3;
  const triCenterY = (BASE_A.y + BASE_B.y + BASE_C.y) / 3;
  const offsetX = cx - triCenterX * SCALE;
  const offsetY = cy - triCenterY * SCALE;
  return {
    A: { x: BASE_A.x * SCALE + offsetX, y: BASE_A.y * SCALE + offsetY },
    B: { x: BASE_B.x * SCALE + offsetX, y: BASE_B.y * SCALE + offsetY },
    C: { x: BASE_C.x * SCALE + offsetX, y: BASE_C.y * SCALE + offsetY },
  };
}

function ptDist(p1, p2) {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

function clampVal(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function clampPointToViewBox(pt, padding = 0) {
  return {
    x: clampVal(pt.x, padding, SVG_W - padding),
    y: clampVal(pt.y, padding, SVG_H - padding),
  };
}

function pointInViewBox(pt, padding = 0) {
  return (
    pt.x >= padding &&
    pt.x <= SVG_W - padding &&
    pt.y >= padding &&
    pt.y <= SVG_H - padding
  );
}

function constrainSegmentDelta(p1, p2, dx, dy, padding = 0) {
  const minDx = padding - Math.min(p1.x, p2.x);
  const maxDx = SVG_W - padding - Math.max(p1.x, p2.x);
  const minDy = padding - Math.min(p1.y, p2.y);
  const maxDy = SVG_H - padding - Math.max(p1.y, p2.y);
  return {
    dx: clampVal(dx, minDx, maxDx),
    dy: clampVal(dy, minDy, maxDy),
  };
}

function ptMid(p1, p2) {
  return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
}

/** Left endpoint of a line segment (smaller x; if tied, smaller y). */
function getLeftEndpointKey(line) {
  if (line.p1.x < line.p2.x) return "p1";
  if (line.p1.x > line.p2.x) return "p2";
  return line.p1.y <= line.p2.y ? "p1" : "p2";
}

function sideLen(p1, p2) {
  return ptDist(p1, p2) / SCALE;
}

function fmtLen(len) {
  return (Math.round(len * 10) / 10).toFixed(1);
}

function getBlueDisplayedLengths(pts) {
  return {
    AB: parseFloat(fmtLen(sideLen(pts.A, pts.B))),
    AC: parseFloat(fmtLen(sideLen(pts.A, pts.C))),
    BC: parseFloat(fmtLen(sideLen(pts.B, pts.C))),
  };
}

/** Scaled label from blue side label (1 dp) × ratio — e.g. 4.8 × 0.5 → "2.4", 4.7 × 0.5 → "2.35" */
function fmtScaledDisplay(blueDisplayedVal, ratio) {
  const scaled = Math.round(blueDisplayedVal * ratio * 10000) / 10000;
  return scaled.toFixed(4).replace(/\.?0+$/, "");
}

function triCentroid(pts) {
  return {
    x: (pts.A.x + pts.B.x + pts.C.x) / 3,
    y: (pts.A.y + pts.B.y + pts.C.y) / 3,
  };
}

function labelOutward(mid, p1, p2, centroid, offset) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const toCent = { x: centroid.x - mid.x, y: centroid.y - mid.y };
  const dot = nx * toCent.x + ny * toCent.y;
  const sign = dot > 0 ? -1 : 1;
  return { x: mid.x + sign * nx * offset, y: mid.y + sign * ny * offset };
}

function sideAngleDeg(p1, p2) {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
}

function computeLeftShift(pts) {
  const minX = Math.min(pts.A.x, pts.B.x, pts.C.x);
  const padding = 60;
  return padding - minX;
}

function applyShift(pts, shiftX) {
  return {
    A: { x: pts.A.x + shiftX, y: pts.A.y },
    B: { x: pts.B.x + shiftX, y: pts.B.y },
    C: { x: pts.C.x + shiftX, y: pts.C.y },
  };
}

function lineCanMove(line) {
  return !line.locked;
}

function normalizeVec(v) {
  const d = Math.hypot(v.x, v.y) || 1;
  return { x: v.x / d, y: v.y / d };
}

function rotateVec(v, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x: v.x * c - v.y * s, y: v.x * s + v.y * c };
}

/** Build exact triangle from fixed side lengths, oriented by approximate vertex positions. */
function buildPerfectTriangle(approxX, approxY, approxZ, lenAB, lenBC, lenAC) {
  const X = { x: approxX.x, y: approxX.y };
  const toY = { x: approxY.x - X.x, y: approxY.y - X.y };
  const dirXY =
    Math.hypot(toY.x, toY.y) > 1 ? normalizeVec(toY) : { x: 1, y: 0 };
  const Y = { x: X.x + dirXY.x * lenAB, y: X.y + dirXY.y * lenAB };

  const cosX =
    (lenAB * lenAB + lenAC * lenAC - lenBC * lenBC) / (2 * lenAB * lenAC);
  const angleX = Math.acos(Math.max(-1, Math.min(1, cosX)));

  const dirXZ1 = rotateVec(dirXY, angleX);
  const dirXZ2 = rotateVec(dirXY, -angleX);
  const Z1 = { x: X.x + dirXZ1.x * lenAC, y: X.y + dirXZ1.y * lenAC };
  const Z2 = { x: X.x + dirXZ2.x * lenAC, y: X.y + dirXZ2.y * lenAC };
  const Z = ptDist(Z1, approxZ) <= ptDist(Z2, approxZ) ? Z1 : Z2;

  return { X, Y, Z };
}

function vertexForCluster(cluster, vertXCluster, vertYCluster, X, Y, Z) {
  if (cluster === vertXCluster) return { ...X };
  if (cluster === vertYCluster) return { ...Y };
  return { ...Z };
}

/**
 * When all 6 endpoints form 3 close pairs, snap to a perfect triangle
 * using each line's fixed length (scaled copy of the blue triangle).
 */
function tryCompleteTriangle(lines, tol) {
  if (lines.length !== 3) return null;

  const clusters = clusterEndpoints(lines, tol);
  if (clusters.length !== 3 || !clusters.every((c) => c.members.length === 2)) {
    return null;
  }

  for (const c of clusters) {
    const p0 = lines[c.members[0].lineIdx][c.members[0].ep];
    const p1 = lines[c.members[1].lineIdx][c.members[1].ep];
    if (ptDist(p0, p1) > tol) return null;
  }

  const bySide = {};
  lines.forEach((l) => {
    bySide[l.origSide] = l;
  });
  const ab = bySide.AB;
  const bc = bySide.BC;
  const ac = bySide.AC;
  if (!ab || !bc || !ac) return null;

  const vertXCluster = clusters.find((c) => {
    const sides = new Set(c.members.map((m) => lines[m.lineIdx].origSide));
    return sides.has("AB") && sides.has("AC");
  });
  const vertYCluster = clusters.find((c) => {
    const sides = new Set(c.members.map((m) => lines[m.lineIdx].origSide));
    return sides.has("AB") && sides.has("BC");
  });
  const vertZCluster = clusters.find((c) => {
    const sides = new Set(c.members.map((m) => lines[m.lineIdx].origSide));
    return sides.has("AC") && sides.has("BC");
  });
  if (!vertXCluster || !vertYCluster || !vertZCluster) return null;

  const { X, Y, Z } = buildPerfectTriangle(
    vertXCluster.pt,
    vertYCluster.pt,
    vertZCluster.pt,
    ab.length,
    bc.length,
    ac.length,
  );

  return lines.map((line, lineIdx) => {
    const p1Cluster = clusters.find((c) =>
      c.members.some((m) => m.lineIdx === lineIdx && m.ep === "p1"),
    );
    const p2Cluster = clusters.find((c) =>
      c.members.some((m) => m.lineIdx === lineIdx && m.ep === "p2"),
    );
    return {
      ...line,
      p1: vertexForCluster(p1Cluster, vertXCluster, vertYCluster, X, Y, Z),
      p2: vertexForCluster(p2Cluster, vertXCluster, vertYCluster, X, Y, Z),
      snappedP1: true,
      snappedP2: true,
      locked: true,
    };
  });
}

function snapTwoLineEndpoint(lines, movedIdx, tol) {
  if (!lines || lines.length !== 2) return lines;
  const moved = lines[movedIdx];
  const otherIdx = movedIdx === 0 ? 1 : 0;
  const other = lines[otherIdx];
  if (!moved || !other || moved.locked) return lines;

  let best = null;
  ["p1", "p2"].forEach((mEp) => {
    ["p1", "p2"].forEach((oEp) => {
      const d = ptDist(moved[mEp], other[oEp]);
      if (d <= tol && (!best || d < best.d)) {
        best = { mEp, oEp, d };
      }
    });
  });
  if (!best) return lines;

  const dx = other[best.oEp].x - moved[best.mEp].x;
  const dy = other[best.oEp].y - moved[best.mEp].y;
  return lines.map((line, idx) => {
    if (idx === movedIdx) {
      return {
        ...line,
        p1: { x: line.p1.x + dx, y: line.p1.y + dy },
        p2: { x: line.p2.x + dx, y: line.p2.y + dy },
        snappedP1: best.mEp === "p1",
        snappedP2: best.mEp === "p2",
        locked: true,
      };
    }
    return {
      ...line,
      snappedP1: best.oEp === "p1",
      snappedP2: best.oEp === "p2",
      locked: true,
    };
  });
}

function isEndpointSnapped(line, endpoint) {
  return endpoint === "p1" ? line.snappedP1 : line.snappedP2;
}

function canRotateEndpoint(line, endpoint, isJoined) {
  if (!line || line.origSide === "BC") return false;
  if (!isJoined) return !line.locked;
  if (!line.locked) return false;
  return !isEndpointSnapped(line, endpoint);
}

function clusterEndpoints(lines, tol) {
  const clusters = [];
  lines.forEach((line, lineIdx) => {
    ["p1", "p2"].forEach((ep) => {
      const pt = line[ep];
      let found = null;
      for (let i = 0; i < clusters.length; i++) {
        if (ptDist(clusters[i].pt, pt) < tol) {
          found = clusters[i];
          break;
        }
      }
      if (found) {
        found.members.push({ lineIdx, ep });
        const n = found.members.length;
        found.pt = {
          x: (found.pt.x * (n - 1) + pt.x) / n,
          y: (found.pt.y * (n - 1) + pt.y) / n,
        };
      } else {
        clusters.push({ pt: { x: pt.x, y: pt.y }, members: [{ lineIdx, ep }] });
      }
    });
  });
  return clusters;
}

function getFormedTriangleCentroid(lines) {
  let sx = 0;
  let sy = 0;
  lines.forEach((l) => {
    sx += l.p1.x + l.p2.x;
    sy += l.p1.y + l.p2.y;
  });
  return { x: sx / 6, y: sy / 6 };
}

function lerpPt(a, b, t) {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

function lerpTriangle(from, to, t) {
  return {
    A: lerpPt(from.A, to.A, t),
    B: lerpPt(from.B, to.B, t),
    C: lerpPt(from.C, to.C, t),
  };
}

function scaleTriangleFromTopVertex(pts, scale) {
  const anchor = [pts.A, pts.B, pts.C].reduce((top, pt) =>
    pt.y < top.y ? pt : top,
  );
  return {
    A: {
      x: anchor.x + (pts.A.x - anchor.x) * scale,
      y: anchor.y + (pts.A.y - anchor.y) * scale,
    },
    B: {
      x: anchor.x + (pts.B.x - anchor.x) * scale,
      y: anchor.y + (pts.B.y - anchor.y) * scale,
    },
    C: {
      x: anchor.x + (pts.C.x - anchor.x) * scale,
      y: anchor.y + (pts.C.y - anchor.y) * scale,
    },
  };
}

function centerTriangle(pts, cx, cy) {
  const c = triCentroid(pts);
  const dx = cx - c.x;
  const dy = cy - c.y;
  return {
    A: { x: pts.A.x + dx, y: pts.A.y + dy },
    B: { x: pts.B.x + dx, y: pts.B.y + dy },
    C: { x: pts.C.x + dx, y: pts.C.y + dy },
  };
}

function rotatePtAround(p, center, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = p.x - center.x;
  const dy = p.y - center.y;
  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dy * cos + dx * sin,
  };
}

/** Signed 2D cross (B−A)×(C−A); opposite sign ⇒ mirror image. */
function triangleWinding(A, B, C) {
  return (B.x - A.x) * (C.y - A.y) - (B.y - A.y) * (C.x - A.x);
}

function isYellowFlippedRelativeToBlue(bluePts, X, Y, Z) {
  const wBlue = triangleWinding(bluePts.A, bluePts.B, bluePts.C);
  const wYellow = triangleWinding(X, Y, Z);
  return wBlue * wYellow < 0;
}

function reflectPtAboutVertical(pt, cx) {
  return { x: 2 * cx - pt.x, y: pt.y };
}

/** Rigid Y-axis 3D rotation projected to 2D (180° flip through vertical axis at centroid). */
function perspectiveYAxisFlipPt(pt, centroid, t) {
  const dx = pt.x - centroid.x;
  const dy = pt.y - centroid.y;
  const theta = Math.PI * t;
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);
  const x = centroid.x + dx * cosT;
  const depthFactor = 1 - 0.1 * Math.abs(sinT);
  const y = centroid.y + dy * depthFactor;
  return { x, y };
}

/** X↔A (AB∩AC), Y↔B (AB∩BC), Z↔C (AC∩BC) */
function mapYellowVertices(lines) {
  const bySide = {};
  lines.forEach((l) => {
    bySide[l.origSide] = l;
  });
  const ab = bySide.AB;
  const bc = bySide.BC;
  const ac = bySide.AC;
  if (!ab || !bc || !ac) return null;

  const tol = 12;
  const eq = (p, q) => ptDist(p, q) < tol;

  const findShared = (l1, l2) => {
    for (const p of [l1.p1, l1.p2]) {
      for (const q of [l2.p1, l2.p2]) {
        if (eq(p, q)) return { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
      }
    }
    return null;
  };

  const X = findShared(ab, ac);
  const Y = findShared(ab, bc);
  const Z = findShared(ac, bc);
  if (!X || !Y || !Z) return null;

  return {
    X,
    Y,
    Z,
    sides: {
      AB: ab.displayLength,
      BC: bc.displayLength,
      AC: ac.displayLength,
    },
  };
}

function angleDegAt(vertex, p1, p2) {
  const a1 = Math.atan2(p1.y - vertex.y, p1.x - vertex.x);
  const a2 = Math.atan2(p2.y - vertex.y, p2.x - vertex.x);
  let diff = Math.abs((a2 - a1) * (180 / Math.PI));
  if (diff > 180) diff = 360 - diff;
  return diff;
}

function signedAngleDelta(from, to) {
  let delta = to - from;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return delta;
}

function pointForAngleAtX(X, Y, currentZ, targetDeg) {
  const baseAngle = Math.atan2(Y.y - X.y, Y.x - X.x);
  const currentAngle = Math.atan2(currentZ.y - X.y, currentZ.x - X.x);
  const radius = ptDist(X, currentZ);
  const targetRad = (targetDeg * Math.PI) / 180;
  const candidates = [baseAngle + targetRad, baseAngle - targetRad];
  const chosen =
    Math.abs(signedAngleDelta(currentAngle, candidates[0])) <=
    Math.abs(signedAngleDelta(currentAngle, candidates[1]))
      ? candidates[0]
      : candidates[1];
  return {
    x: X.x + Math.cos(chosen) * radius,
    y: X.y + Math.sin(chosen) * radius,
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  let delta = signedAngleDelta(startAngle, endAngle);
  if (delta < 0) {
    const tmp = startAngle;
    startAngle = endAngle;
    endAngle = tmp;
    delta = -delta;
  }
  const start = {
    x: cx + Math.cos(startAngle) * r,
    y: cy + Math.sin(startAngle) * r,
  };
  const end = {
    x: cx + Math.cos(endAngle) * r,
    y: cy + Math.sin(endAngle) * r,
  };
  const largeArc = delta > Math.PI ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

function describeSector(cx, cy, r, startAngle, endAngle) {
  let delta = signedAngleDelta(startAngle, endAngle);
  if (delta < 0) {
    const tmp = startAngle;
    startAngle = endAngle;
    endAngle = tmp;
    delta = -delta;
  }
  const start = {
    x: cx + Math.cos(startAngle) * r,
    y: cy + Math.sin(startAngle) * r,
  };
  const end = {
    x: cx + Math.cos(endAngle) * r,
    y: cy + Math.sin(endAngle) * r,
  };
  const largeArc = delta > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

function mapTwoSideYellowVertices(lines) {
  const ab = lines.find((l) => l.origSide === "AB");
  const ac = lines.find((l) => l.origSide === "AC");
  const bc = lines.find((l) => l.origSide === "BC");
  if (!ab || !ac || !bc) return null;

  const tol = 12;
  const close = (p, q) => ptDist(p, q) < tol;
  let X = null;
  for (const p of [ab.p1, ab.p2]) {
    for (const q of [ac.p1, ac.p2]) {
      if (close(p, q)) X = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
    }
  }
  if (!X) return null;

  const farFrom = (line, point) => (close(line.p1, point) ? line.p2 : line.p1);
  const Y = farFrom(ab, X);
  const Z = farFrom(ac, X);
  return {
    X,
    Y,
    Z,
    sides: {
      AB: ab.displayLength,
      AC: ac.displayLength,
      BC: bc.displayLength,
    },
  };
}

function reflectPtAcrossLine(pt, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy || 1;
  const t = ((pt.x - a.x) * dx + (pt.y - a.y) * dy) / lenSq;
  const proj = { x: a.x + t * dx, y: a.y + t * dy };
  return { x: 2 * proj.x - pt.x, y: 2 * proj.y - pt.y };
}

function transformTriangleForSideMatch(source, targetA, targetB, targetC) {
  const srcLen = ptDist(source.X, source.Y) || 1;
  const targetLen = ptDist(targetA, targetB);
  const scale = targetLen / srcLen;
  const srcAngle = Math.atan2(source.Y.y - source.X.y, source.Y.x - source.X.x);
  const targetAngle = Math.atan2(targetB.y - targetA.y, targetB.x - targetA.x);
  const rot = targetAngle - srcAngle;
  const c = Math.cos(rot);
  const s = Math.sin(rot);
  const convert = (p) => {
    const dx = (p.x - source.X.x) * scale;
    const dy = (p.y - source.X.y) * scale;
    return {
      x: targetA.x + dx * c - dy * s,
      y: targetA.y + dx * s + dy * c,
    };
  };
  const transformed = {
    X: { ...targetA },
    Y: { ...targetB },
    Z: convert(source.Z),
  };
  if (
    targetC &&
    triangleWinding(targetA, targetB, transformed.Z) *
      triangleWinding(targetA, targetB, targetC) <
      0
  ) {
    transformed.Z = reflectPtAcrossLine(transformed.Z, targetA, targetB);
  }
  return transformed;
}

function orientTriangleToSideWithoutScaling(source, targetA, targetB, targetC) {
  const srcAngle = Math.atan2(source.Y.y - source.X.y, source.Y.x - source.X.x);
  const targetAngle = Math.atan2(targetB.y - targetA.y, targetB.x - targetA.x);
  const rot = targetAngle - srcAngle;
  const c = Math.cos(rot);
  const s = Math.sin(rot);
  const convert = (p) => {
    const dx = p.x - source.X.x;
    const dy = p.y - source.X.y;
    return {
      x: targetA.x + dx * c - dy * s,
      y: targetA.y + dx * s + dy * c,
    };
  };
  const transformed = {
    X: { ...targetA },
    Y: convert(source.Y),
    Z: convert(source.Z),
  };
  if (
    targetC &&
    triangleWinding(targetA, targetB, transformed.Z) *
      triangleWinding(targetA, targetB, targetC) <
      0
  ) {
    transformed.Z = reflectPtAcrossLine(transformed.Z, targetA, targetB);
  }
  return transformed;
}

function getYellowLabelPos(p1, p2, centroid, insideT, offset) {
  const mid = ptMid(p1, p2);
  const outward = labelOutward(mid, p1, p2, centroid, offset);
  const inward = { x: 2 * mid.x - outward.x, y: 2 * mid.y - outward.y };
  return {
    x: outward.x + (inward.x - outward.x) * insideT,
    y: outward.y + (inward.y - outward.y) * insideT,
  };
}

const MainCanvas = (props) => {
  const {
    step,
    onSetNextEnabled,
    onUpdateTexts,
    onSetNextLabel,
    onNext,
    onRegisterNudgeTarget,
    onHideNudge,
    onSetPrevDisabled,
    onStep1PointInteractionStart,
    onStep1PointInteractionEnd,
    onStep4Phase,
    onStep5NameReveal,
    onStep5Ready,
    onStep6Ready,
    onStep8NameReveal,
    step2ExitPending,
    onStep2FadeComplete,
  } = props;
  const { useState, useEffect, useRef, useCallback, useMemo } = React;

  const initialPositions = useMemo(() => getInitialTrianglePositions(), []);
  const [triPoints, setTriPoints] = useState(initialPositions);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [dragging, setDragging] = useState(null);
  const dragStartRef = useRef(null);
  const originalPosRef = useRef(null);

  // Animated shift for step 2 transition
  const [triShiftX, setTriShiftX] = useState(0);

  const [selectedRatio, setSelectedRatio] = useState(null);
  const [showButtons, setShowButtons] = useState(true);
  const [yellowLines, setYellowLines] = useState(null);
  const [ratioBoxVisible, setRatioBoxVisible] = useState(false);
  const [ratioAnimStep, setRatioAnimStep] = useState(0);
  const [proportionalTextVisible, setProportionalTextVisible] = useState(false);
  const [step2AnimDone, setStep2AnimDone] = useState(false);
  const [flyingClones, setFlyingClones] = useState([]);
  const [step2FadingOut, setStep2FadingOut] = useState(false);
  const [step2FadeOpacity, setStep2FadeOpacity] = useState(1);
  const step2FadeStartedRef = useRef(false);

  const [lineStates, setLineStates] = useState(null);
  const [triangleFormed, setTriangleFormed] = useState(false);
  const lineDragRef = useRef(null);
  const triangleFormedRef = useRef(false);
  const lineStatesRef = useRef(null);
  lineStatesRef.current = lineStates;

  const [animBluePts, setAnimBluePts] = useState(null);
  const [animYellow, setAnimYellow] = useState(null);
  const [drawDraft, setDrawDraft] = useState(null);
  const drawRef = useRef(null);
  const [step4DragStarted, setStep4DragStarted] = useState(false);
  const [step4BottomVisible, setStep4BottomVisible] = useState(false);
  const [step4ConcludeVisible, setStep4ConcludeVisible] = useState(false);
  const [step5NonSimilarVisible, setStep5NonSimilarVisible] = useState(false);
  const [step5ConcludeVisible, setStep5ConcludeVisible] = useState(false);
  const step4AnimRef = useRef(null);

  const [step5ShiftX, setStep5ShiftX] = useState(0);
  const [step5PanelVisible, setStep5PanelVisible] = useState(false);
  const [step5NameRevealed, setStep5NameRevealed] = useState(false);
  const [step5YellowScale, setStep5YellowScale] = useState(1);
  const [step6CtaVisible, setStep6CtaVisible] = useState(false);
  const [step7AngleMatched, setStep7AngleMatched] = useState(false);
  const [step7CheckVisible, setStep7CheckVisible] = useState(false);
  const [step7SimilarVisible, setStep7SimilarVisible] = useState(false);
  const [step7ConcludeVisible, setStep7ConcludeVisible] = useState(false);
  const [step8NameRevealed, setStep8NameRevealed] = useState(false);
  const step5AnimRef = useRef(null);
  const step5ScaleAnimRef = useRef(null);

  const svgRef = useRef(null);

  const playSnd = (snd) => {
    if (typeof playSound === "function") playSound(snd);
  };

  const currentTriPoints = useMemo(() => {
    return applyShift(triPoints, triShiftX);
  }, [triPoints, triShiftX]);

  const sideLengths = useMemo(
    () => ({
      AB: sideLen(currentTriPoints.A, currentTriPoints.B),
      AC: sideLen(currentTriPoints.A, currentTriPoints.C),
      BC: sideLen(currentTriPoints.B, currentTriPoints.C),
    }),
    [currentTriPoints],
  );

  const getSVGPoint = useCallback((e) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * SVG_W,
      y: ((clientY - rect.top) / rect.height) * SVG_H,
    };
  }, []);

  const triPointsRef = useRef(triPoints);
  triPointsRef.current = triPoints;

  // ── Step 1: Vertex dragging ──
  const handleVertexDown = useCallback(
    (vertex, e) => {
      if (step !== 1) return;
      e.preventDefault();
      if (onStep1PointInteractionStart) onStep1PointInteractionStart();
      const pt = getSVGPoint(e);
      dragStartRef.current = pt;
      originalPosRef.current = { ...triPointsRef.current[vertex] };
      setDragging(vertex);
    },
    [step, getSVGPoint, onStep1PointInteractionStart],
  );

  const hasInteractedRef = useRef(false);
  hasInteractedRef.current = hasInteracted;

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e) => {
      e.preventDefault();
      const pt = getSVGPoint(e);
      const orig = originalPosRef.current;
      const start = dragStartRef.current;
      if (!orig || !start) return;
      let newX = orig.x + (pt.x - start.x);
      let newY = orig.y + (pt.y - start.y);
      const dx = newX - initialPositions[dragging].x;
      const dy = newY - initialPositions[dragging].y;
      const d = Math.hypot(dx, dy);
      if (d > DRAG_RADIUS) {
        newX = initialPositions[dragging].x + (dx / d) * DRAG_RADIUS;
        newY = initialPositions[dragging].y + (dy / d) * DRAG_RADIUS;
      }
      const bounded = clampPointToViewBox(
        { x: newX, y: newY },
        BLUE_POINT_RADIUS,
      );
      setTriPoints((prev) => ({ ...prev, [dragging]: bounded }));
      if (!hasInteractedRef.current) {
        setHasInteracted(true);
        hasInteractedRef.current = true;
        onSetNextEnabled(true);
        onUpdateTexts(undefined, APP_DATA.steps[1].navInteracted);
      }
    };
    const handleUp = () => {
      setDragging(null);
      dragStartRef.current = null;
      originalPosRef.current = null;
      if (onStep1PointInteractionEnd) onStep1PointInteractionEnd();
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [
    dragging,
    getSVGPoint,
    initialPositions,
    onSetNextEnabled,
    onStep1PointInteractionEnd,
    onUpdateTexts,
  ]);

  useEffect(() => {
    if (step !== 1) return;
    setTriPoints(initialPositions);
    setTriShiftX(0);
    setHasInteracted(false);
    hasInteractedRef.current = false;
    setDragging(null);
    dragStartRef.current = null;
    originalPosRef.current = null;
    setSelectedRatio(null);
    setYellowLines(null);
    setRatioBoxVisible(false);
    setRatioAnimStep(0);
    setProportionalTextVisible(false);
    setStep2AnimDone(false);
    setFlyingClones([]);
    setStep2FadingOut(false);
    setStep2FadeOpacity(1);
    setLineStates(null);
    triangleFormedRef.current = false;
    setTriangleFormed(false);
    setDrawDraft(null);
    drawRef.current = null;
    setAnimBluePts(null);
    setAnimYellow(null);
    setStep5NonSimilarVisible(false);
    setStep5ConcludeVisible(false);
    setStep5PanelVisible(false);
    setStep5ShiftX(0);
    setStep5YellowScale(1);
    setStep6CtaVisible(false);
    setStep7AngleMatched(false);
    setStep7CheckVisible(false);
    setStep7SimilarVisible(false);
    setStep7ConcludeVisible(false);
    setStep8NameRevealed(false);
    if (onSetPrevDisabled) onSetPrevDisabled(false);
  }, [step, initialPositions, onSetPrevDisabled]);

  // ── Step 2 init: animate triangle left ──
  useEffect(() => {
    if (step === 1 || step === 3) {
      if (onSetPrevDisabled) onSetPrevDisabled(false);
    }
  }, [step, onSetPrevDisabled]);

  useEffect(() => {
    if (step === 2) {
      if (onSetPrevDisabled) onSetPrevDisabled(true);
      setShowButtons(true);
      setSelectedRatio(null);
      setYellowLines(null);
      setRatioBoxVisible(false);
      setRatioAnimStep(0);
      setProportionalTextVisible(false);
      setStep2AnimDone(false);
      setFlyingClones([]);
      setStep2FadingOut(false);
      setStep2FadeOpacity(1);
      step2FadeStartedRef.current = false;

      const targetShift = computeLeftShift(triPoints);
      const anim = { val: triShiftX };
      gsap.to(anim, {
        val: targetShift,
        duration: 0.8,
        ease: "power2.inOut",
        onUpdate: () => setTriShiftX(anim.val),
        onComplete: () => {
          setTriShiftX(targetShift);
          if (onSetPrevDisabled) onSetPrevDisabled(false);
        },
      });
    }
  }, [step, onSetPrevDisabled, triPoints]);

  // ── Step 2→3: fade overlays first, then advance step ──
  useEffect(() => {
    if (!step2ExitPending || step !== 2 || step2FadeStartedRef.current) return;
    step2FadeStartedRef.current = true;
    if (onSetPrevDisabled) onSetPrevDisabled(true);

    const finish = () => {
      setRatioBoxVisible(false);
      setProportionalTextVisible(false);
      setStep2FadingOut(false);
      setStep2FadeOpacity(1);
      step2FadeStartedRef.current = false;
      if (onStep2FadeComplete) onStep2FadeComplete();
    };

    if (!ratioBoxVisible && !proportionalTextVisible) {
      finish();
      return;
    }

    setStep2FadingOut(true);
    const anim = { o: 1 };
    const tween = gsap.to(anim, {
      o: 0,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => setStep2FadeOpacity(anim.o),
      onComplete: finish,
    });

    return () => {
      tween.kill();
      step2FadeStartedRef.current = false;
    };
  }, [step2ExitPending, step, onSetPrevDisabled, onStep2FadeComplete]);

  // ── Step 3 init: use same yellow line positions ──
  useEffect(() => {
    if (step !== 3) return;
    if (!yellowLines) return;

    setFlyingClones([]);
    triangleFormedRef.current = false;
    setTriangleFormed(false);

    const newStates = yellowLines.map((line) => ({
      id: line.id,
      length: line.length,
      displayLength: line.displayLength,
      origSide: line.origSide,
      p1: { ...line.p1 },
      p2: { ...line.p2 },
      snappedP1: false,
      snappedP2: false,
      locked: false,
    }));
    setLineStates(newStates);
  }, [step, yellowLines]);

  // ── Ratio button click ──
  const handleRatioClick = useCallback(
    (ratio) => {
      if (selectedRatio !== null) return;
      playSnd("click");
      if (onSetPrevDisabled) onSetPrevDisabled(true);
      setSelectedRatio(ratio);
      setShowButtons(false);

      const leftPts = applyShift(triPoints, computeLeftShift(triPoints));
      const lAB = sideLen(leftPts.A, leftPts.B);
      const lAC = sideLen(leftPts.A, leftPts.C);

      const blueDisplayed = getBlueDisplayedLengths(leftPts);
      const displayAB = fmtScaledDisplay(blueDisplayed.AB, ratio);
      const displayAC = fmtScaledDisplay(blueDisplayed.AC, ratio);

      const lines = [
        {
          id: "line-ab",
          length: lAB * ratio * SCALE,
          displayLength: displayAB,
          origSide: "AB",
        },
        {
          id: "line-ac",
          length: lAC * ratio * SCALE,
          displayLength: displayAC,
          origSide: "AC",
        },
      ];

      placeYellowLines(lines);

      setYellowLines(lines);

      setTimeout(() => {
        runRatioBoxAnimation(ratio, lines, leftPts);
      }, 1000);
    },
    [selectedRatio, triPoints, onSetPrevDisabled, onUpdateTexts],
  );

  const runRatioBoxAnimation = (ratio, lines, leftPts) => {
    setRatioBoxVisible(true);
    const pos = getRatioBoxPositions();
    const { startX, centerY, fracSpacing, numOffsetY, denOffsetY } = pos;

    const centroid = triCentroid(leftPts);
    const labelOffset = 18;

    const sideMap = {
      AB: { p1: leftPts.A, p2: leftPts.B },
      AC: { p1: leftPts.A, p2: leftPts.C },
    };
    const fractionOrder = ["AB", "AC"];

    let stepIdx = 0;
    const totalSteps = 7;

    const doStep = () => {
      stepIdx++;
      const fracIdx = Math.floor((stepIdx - 1) / 3);
      const subStep = (stepIdx - 1) % 3;

      if (stepIdx > 6) {
        setRatioAnimStep(totalSteps);
        setTimeout(() => {
          setFlyingClones([]);
          setProportionalTextVisible(true);
          setStep2AnimDone(true);
          onSetNextEnabled(true);
          if (onSetPrevDisabled) onSetPrevDisabled(false);
          onUpdateTexts(undefined, APP_DATA.steps[2].navAfterAnimation);
        }, 500);
        return;
      }

      const sideKey = fractionOrder[fracIdx];
      const fx = startX + fracIdx * fracSpacing;

      if (subStep === 0) {
        // Fly yellow line label (numerator) to ratio box
        const yellowLine = lines.find((l) => l.origSide === sideKey);
        const fromPt = ptMid(yellowLine.p1, yellowLine.p2);
        const toPt = { x: fx, y: centerY + numOffsetY };
        const cloneId = `fly-num-${fracIdx}`;
        setFlyingClones((prev) => [
          ...prev,
          {
            id: cloneId,
            text: String(yellowLine.displayLength),
            from: { x: fromPt.x, y: fromPt.y - 16 },
            to: toPt,
            color: COLOR_YELLOW,
            t: 0,
            fromFontSize: YELLOW_LABEL_FONT_SIZE,
            toFontSize: RATIO_BOX_NUM_FONT_SIZE,
          },
        ]);
        const anim = { t: 0 };
        gsap.to(anim, {
          t: 1,
          duration: 0.6,
          ease: "power2.inOut",
          onUpdate: () => {
            setFlyingClones((prev) =>
              prev.map((c) => (c.id === cloneId ? { ...c, t: anim.t } : c)),
            );
          },
          onComplete: () => {
            setFlyingClones((prev) => prev.filter((c) => c.id !== cloneId));
            setRatioAnimStep(stepIdx);
            setTimeout(doStep, 300);
          },
        });
      } else if (subStep === 1) {
        // Show fraction bar
        setRatioAnimStep(stepIdx);
        setTimeout(doStep, 300);
      } else if (subStep === 2) {
        // Fly blue triangle label (denominator) to ratio box
        const side = sideMap[sideKey];
        const mid = ptMid(side.p1, side.p2);
        const fromPt = labelOutward(
          mid,
          side.p1,
          side.p2,
          centroid,
          labelOffset,
        );
        const toPt = { x: fx, y: centerY + denOffsetY };
        const cloneId = `fly-den-${fracIdx}`;
        const sideLength = fmtLen(sideLen(side.p1, side.p2));
        setFlyingClones((prev) => [
          ...prev,
          {
            id: cloneId,
            text: sideLength,
            from: fromPt,
            to: toPt,
            color: COLOR_BLUE,
            t: 0,
            fromFontSize: LABEL_FONT_SIZE,
            toFontSize: RATIO_BOX_NUM_FONT_SIZE,
          },
        ]);
        const anim = { t: 0 };
        gsap.to(anim, {
          t: 1,
          duration: 0.6,
          ease: "power2.inOut",
          onUpdate: () => {
            setFlyingClones((prev) =>
              prev.map((c) => (c.id === cloneId ? { ...c, t: anim.t } : c)),
            );
          },
          onComplete: () => {
            setFlyingClones((prev) => prev.filter((c) => c.id !== cloneId));
            setRatioAnimStep(stepIdx);
            setTimeout(doStep, 400);
          },
        });
      }
    };

    setTimeout(doStep, 400);
  };

  // ── Step 3: Snapping logic ──
  const markTwoSidesJoined = useCallback(() => {
    if (triangleFormedRef.current) return;
    triangleFormedRef.current = true;
    setTriangleFormed(true);
    onSetNextEnabled(true);
    onUpdateTexts(APP_DATA.steps[3].questionText, APP_DATA.steps[3].navDone);
    playSnd("correct");
  }, [onSetNextEnabled, onUpdateTexts]);

  const doSnap = useCallback(
    (lines, movedIdx) => {
      if (triangleFormedRef.current) return lines;
      const snapped = snapTwoLineEndpoint(lines, movedIdx, FINAL_SNAP_DISTANCE);
      if (snapped !== lines) {
        markTwoSidesJoined();
        return snapped;
      }
      return lines;
    },
    [markTwoSidesJoined],
  );

  const applySnap = useCallback(
    (prev, movedIdx) => {
      if (!prev) return prev;
      return doSnap(prev, movedIdx);
    },
    [doSnap],
  );

  const handleLineMoveStart = useCallback(
    (lineIdx, e) => {
      if (step !== 3 || triangleFormedRef.current) return;
      const lines = lineStatesRef.current;
      if (!lines || lines[lineIdx].locked) return;
      e.preventDefault();
      e.stopPropagation();
      const pt = getSVGPoint(e);
      lineDragRef.current = {
        type: "move",
        lineIdx,
        startMouse: pt,
        startP1: { ...lines[lineIdx].p1 },
        startP2: { ...lines[lineIdx].p2 },
      };

      const handleMove = (ev) => {
        ev.preventDefault();
        const p = getSVGPoint(ev);
        const ref = lineDragRef.current;
        if (!ref || ref.type !== "move") return;
        const rawDx = p.x - ref.startMouse.x;
        const rawDy = p.y - ref.startMouse.y;
        const { dx, dy } = constrainSegmentDelta(
          ref.startP1,
          ref.startP2,
          rawDx,
          rawDy,
          YELLOW_POINT_RADIUS,
        );
        setLineStates((prev) => {
          if (!prev) return prev;
          const next = [...prev];
          next[ref.lineIdx] = {
            ...next[ref.lineIdx],
            p1: { x: ref.startP1.x + dx, y: ref.startP1.y + dy },
            p2: { x: ref.startP2.x + dx, y: ref.startP2.y + dy },
          };
          return next;
        });
      };
      const handleUp = () => {
        const movedIdx = lineDragRef.current
          ? lineDragRef.current.lineIdx
          : lineIdx;
        lineDragRef.current = null;
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
        window.removeEventListener("touchmove", handleMove);
        window.removeEventListener("touchend", handleUp);
        setLineStates((prev) => (prev ? applySnap(prev, movedIdx) : prev));
      };
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
      window.addEventListener("touchmove", handleMove, { passive: false });
      window.addEventListener("touchend", handleUp);
    },
    [step, getSVGPoint, applySnap],
  );

  const handleEndpointRotateStart = useCallback(
    (lineIdx, endpoint, e) => {
      if (step !== 3) return;
      const lines = lineStatesRef.current;
      if (
        !lines ||
        !canRotateEndpoint(lines[lineIdx], endpoint, triangleFormedRef.current)
      )
        return;
      e.preventDefault();
      e.stopPropagation();

      const line = lines[lineIdx];
      const anchor = endpoint === "p1" ? line.p2 : line.p1;
      lineDragRef.current = {
        type: "rotate",
        lineIdx,
        endpoint,
        anchor: { ...anchor },
        length: line.length,
      };

      const handleMove = (ev) => {
        ev.preventDefault();
        const p = getSVGPoint(ev);
        const ref = lineDragRef.current;
        if (!ref || ref.type !== "rotate") return;
        const angle = Math.atan2(p.y - ref.anchor.y, p.x - ref.anchor.x);
        const newPt = {
          x: ref.anchor.x + Math.cos(angle) * ref.length,
          y: ref.anchor.y + Math.sin(angle) * ref.length,
        };
        if (!pointInViewBox(newPt, YELLOW_POINT_RADIUS)) return;
        setLineStates((prev) => {
          if (!prev) return prev;
          const next = [...prev];
          next[ref.lineIdx] = { ...next[ref.lineIdx], [ref.endpoint]: newPt };
          return next;
        });
      };
      const handleUp = () => {
        const movedIdx = lineDragRef.current
          ? lineDragRef.current.lineIdx
          : lineIdx;
        lineDragRef.current = null;
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
        window.removeEventListener("touchmove", handleMove);
        window.removeEventListener("touchend", handleUp);
        setLineStates((prev) => (prev ? applySnap(prev, movedIdx) : prev));
      };
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
      window.addEventListener("touchmove", handleMove, { passive: false });
      window.addEventListener("touchend", handleUp);
    },
    [step, getSVGPoint, applySnap],
  );

  // ── Step 4: overlap animation ──
  const getOpenYellowEndpoints = useCallback((lines) => {
    const ab = lines ? lines.find((l) => l.origSide === "AB") : null;
    const ac = lines ? lines.find((l) => l.origSide === "AC") : null;
    if (!ab || !ac) return null;

    let shared = null;
    ["p1", "p2"].forEach((abEp) => {
      ["p1", "p2"].forEach((acEp) => {
        if (ptDist(ab[abEp], ac[acEp]) < 12) shared = { abEp, acEp };
      });
    });
    if (!shared) return null;
    return {
      y: shared.abEp === "p1" ? ab.p2 : ab.p1,
      z: shared.acEp === "p1" ? ac.p2 : ac.p1,
    };
  }, []);

  useEffect(() => {
    if (step !== 4 || !lineStates) return;
    if (onSetPrevDisabled) onSetPrevDisabled(false);
    onSetNextEnabled(lineStates.some((line) => line.origSide === "BC"));
    setDrawDraft(null);
    drawRef.current = null;
    setStep4DragStarted(false);
  }, [step, lineStates, onSetNextEnabled, onSetPrevDisabled]);

  const handleClosingDrawStart = useCallback(
    (which, e) => {
      if (step !== 4) return;
      const lines = lineStatesRef.current;
      if (!lines || lines.some((line) => line.origSide === "BC")) return;
      const endpoints = getOpenYellowEndpoints(lines);
      if (!endpoints) return;
      e.preventDefault();
      e.stopPropagation();
      setStep4DragStarted(true);
      const from = which === "y" ? endpoints.y : endpoints.z;
      const target = which === "y" ? endpoints.z : endpoints.y;
      drawRef.current = { from: { ...from }, target: { ...target } };
      setDrawDraft({ from: { ...from }, to: { ...from } });

      const handleMove = (ev) => {
        ev.preventDefault();
        const p = clampPointToViewBox(getSVGPoint(ev), YELLOW_POINT_RADIUS);
        setDrawDraft((prev) => (prev ? { ...prev, to: p } : prev));
      };
      const handleUp = (ev) => {
        ev.preventDefault();
        const p = clampPointToViewBox(getSVGPoint(ev), YELLOW_POINT_RADIUS);
        const ref = drawRef.current;
        drawRef.current = null;
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
        window.removeEventListener("touchmove", handleMove);
        window.removeEventListener("touchend", handleUp);
        if (ref && ptDist(p, ref.target) <= DRAW_SNAP_DISTANCE) {
          const newLine = {
            id: "line-bc",
            length: ptDist(ref.from, ref.target),
            displayLength: fmtLen(ptDist(ref.from, ref.target) / SCALE),
            origSide: "BC",
            p1: { ...ref.from },
            p2: { ...ref.target },
            snappedP1: true,
            snappedP2: true,
            locked: true,
            dehighlighted: true,
          };
          setLineStates((prev) => (prev ? [...prev, newLine] : prev));
          setDrawDraft(null);
          onUpdateTexts(undefined, APP_DATA.steps[4].navDone);
          onSetNextEnabled(true);
          playSnd("correct");
        } else {
          setDrawDraft(null);
        }
      };
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
      window.addEventListener("touchmove", handleMove, { passive: false });
      window.addEventListener("touchend", handleUp);
    },
    [
      step,
      getOpenYellowEndpoints,
      getSVGPoint,
      onSetNextEnabled,
      onUpdateTexts,
    ],
  );

  useEffect(() => {
    if (step !== 999 || !lineStates) return;
    if (onSetPrevDisabled) onSetPrevDisabled(true);

    setStep4BottomVisible(false);
    setStep4ConcludeVisible(false);
    onUpdateTexts("", "");

    const mapping = mapYellowVertices(lineStates);
    if (!mapping) return;

    const { X, Y, Z, sides } = mapping;
    const blueStart = applyShift(triPointsRef.current, triShiftX);
    const blueTarget = centerTriangle(blueStart, SVG_W / 2, SVG_H / 2);

    const yellowCentroid = triCentroid({ A: X, B: Y, C: Z });
    const needsFlip = isYellowFlippedRelativeToBlue(blueStart, X, Y, Z);

    let X0 = { ...X };
    let Y0 = { ...Y };
    let Z0 = { ...Z };

    const angBlue = Math.atan2(
      blueTarget.B.y - blueTarget.A.y,
      blueTarget.B.x - blueTarget.A.x,
    );
    let angYellow = Math.atan2(Y0.y - X0.y, Y0.x - X0.x);
    let rotAngle = angBlue - angYellow;

    setAnimBluePts({ ...blueStart });
    setAnimYellow({
      X: { ...X },
      Y: { ...Y },
      Z: { ...Z },
      sides,
      labelInside: 0,
    });

    let YPhase1End = { ...Y0 };
    let ZPhase1End = { ...Z0 };

    const computePhase1State = (p) => {
      const bluePts = lerpTriangle(blueStart, blueTarget, p);
      const currentX = lerpPt(X0, bluePts.A, p);
      const Yrot = rotatePtAround(Y0, X0, rotAngle * p);
      const Zrot = rotatePtAround(Z0, X0, rotAngle * p);
      return {
        bluePts,
        currentX,
        currentY: {
          x: currentX.x + (Yrot.x - X0.x),
          y: currentX.y + (Yrot.y - X0.y),
        },
        currentZ: {
          x: currentX.x + (Zrot.x - X0.x),
          y: currentX.y + (Zrot.y - X0.y),
        },
      };
    };

    const phase1 = { t: 0 };
    const phase2 = { t: 0 };

    const runRevealSequence = () => {
      if (onStep4Phase) onStep4Phase("question");
      setTimeout(() => setStep4BottomVisible(true), 500);
      setTimeout(() => setStep4ConcludeVisible(true), 1500);
      setTimeout(() => {
        if (onStep4Phase) onStep4Phase("nav");
        if (onSetPrevDisabled) onSetPrevDisabled(false);
      }, 2000);
    };

    const tl = gsap.timeline({ onComplete: runRevealSequence });

    if (needsFlip) {
      const flip = { t: 0 };
      tl.to(flip, {
        t: 1,
        duration: 0.9,
        ease: "power2.inOut",
        onUpdate: () => {
          setAnimBluePts(blueStart);
          setAnimYellow({
            X: perspectiveYAxisFlipPt(X, yellowCentroid, flip.t),
            Y: perspectiveYAxisFlipPt(Y, yellowCentroid, flip.t),
            Z: perspectiveYAxisFlipPt(Z, yellowCentroid, flip.t),
            sides,
            labelInside: 0,
          });
        },
      });
      tl.add(() => {
        X0 = reflectPtAboutVertical(X, yellowCentroid.x);
        Y0 = reflectPtAboutVertical(Y, yellowCentroid.x);
        Z0 = reflectPtAboutVertical(Z, yellowCentroid.x);
        angYellow = Math.atan2(Y0.y - X0.y, Y0.x - X0.x);
        rotAngle = angBlue - angYellow;
        YPhase1End = { ...Y0 };
        ZPhase1End = { ...Z0 };
        setAnimYellow({
          X: { ...X0 },
          Y: { ...Y0 },
          Z: { ...Z0 },
          sides,
          labelInside: 0,
        });
      });
    }

    tl.to(phase1, {
      t: 1,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: () => {
        const state = computePhase1State(phase1.t);
        setAnimBluePts(state.bluePts);
        setAnimYellow({
          X: state.currentX,
          Y: state.currentY,
          Z: state.currentZ,
          sides,
          labelInside: 0,
        });
      },
    });

    tl.add(() => {
      const endState = computePhase1State(1);
      YPhase1End = endState.currentY;
      ZPhase1End = endState.currentZ;
    });

    tl.to(phase2, {
      t: 1,
      duration: 1.0,
      ease: "power2.inOut",
      onUpdate: () => {
        const q = phase2.t;
        setAnimBluePts(blueTarget);
        setAnimYellow({
          X: blueTarget.A,
          Y: lerpPt(YPhase1End, blueTarget.B, q),
          Z: lerpPt(ZPhase1End, blueTarget.C, q),
          sides,
          labelInside: q,
        });
      },
    });

    step4AnimRef.current = tl;

    return () => {
      if (step4AnimRef.current) step4AnimRef.current.kill();
    };
  }, [
    step,
    lineStates,
    triShiftX,
    onSetPrevDisabled,
    onUpdateTexts,
    onStep4Phase,
  ]);

  useEffect(() => {
    if (!step4ConcludeVisible) return;
    const tid = setTimeout(() => {
      const btn = document.getElementById("conclude-button");
      if (btn && onRegisterNudgeTarget) {
        onRegisterNudgeTarget(btn.getBoundingClientRect());
      }
    }, 600);
    return () => clearTimeout(tid);
  }, [step4ConcludeVisible, onRegisterNudgeTarget]);

  useEffect(() => {
    if (step !== 5 || !lineStates) return;
    if (onSetPrevDisabled) onSetPrevDisabled(true);
    setStep5NonSimilarVisible(false);
    setStep5ConcludeVisible(false);
    setStep5PanelVisible(false);
    setStep5ShiftX(0);
    setStep5YellowScale(1);

    const mapping = mapTwoSideYellowVertices(lineStates);
    if (!mapping) return;

    const blueStart = applyShift(triPointsRef.current, triShiftX);
    const blueTarget = centerTriangle(blueStart, SVG_W / 2, SVG_H / 2);
    const yellowStart = {
      X: { ...mapping.X },
      Y: { ...mapping.Y },
      Z: { ...mapping.Z },
    };
    const yellowRigidTarget = orientTriangleToSideWithoutScaling(
      yellowStart,
      blueTarget.A,
      blueTarget.B,
      blueTarget.C,
    );
    const yellowScaledTarget = transformTriangleForSideMatch(
      yellowStart,
      blueTarget.A,
      blueTarget.B,
      blueTarget.C,
    );

    setAnimBluePts({ ...blueStart });
    setAnimYellow({ ...yellowStart, sides: mapping.sides, labelInside: 0 });

    const moveAnim = { t: 0 };
    const scaleAnim = { t: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        setAnimBluePts(blueTarget);
        setAnimYellow({
          ...yellowScaledTarget,
          sides: mapping.sides,
          labelInside: 1,
        });
        setStep5NonSimilarVisible(true);
        setTimeout(() => {
          setStep5ConcludeVisible(true);
          if (onSetPrevDisabled) onSetPrevDisabled(false);
          if (onStep5Ready) onStep5Ready();
        }, 650);
      },
    });

    tl.to(moveAnim, {
      t: 1,
      duration: 1.15,
      ease: "power2.inOut",
      onUpdate: () => {
        const t = moveAnim.t;
        setAnimBluePts(lerpTriangle(blueStart, blueTarget, t));
        setAnimYellow({
          X: lerpPt(yellowStart.X, yellowRigidTarget.X, t),
          Y: lerpPt(yellowStart.Y, yellowRigidTarget.Y, t),
          Z: lerpPt(yellowStart.Z, yellowRigidTarget.Z, t),
          sides: mapping.sides,
          labelInside: Math.min(1, t * 1.15),
        });
      },
    });

    tl.to(scaleAnim, {
      t: 1,
      duration: 0.75,
      ease: "power2.inOut",
      onUpdate: () => {
        const t = scaleAnim.t;
        setAnimBluePts(blueTarget);
        setAnimYellow({
          X: { ...blueTarget.A },
          Y: lerpPt(yellowRigidTarget.Y, yellowScaledTarget.Y, t),
          Z: lerpPt(yellowRigidTarget.Z, yellowScaledTarget.Z, t),
          sides: mapping.sides,
          labelInside: 1,
        });
      },
    });

    step4AnimRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [step, lineStates, triShiftX, onSetPrevDisabled, onStep5Ready]);

  useEffect(() => {
    if (!step5ConcludeVisible) return;
    const tid = setTimeout(() => {
      const btn = document.getElementById("conclude-button");
      if (btn && onRegisterNudgeTarget)
        onRegisterNudgeTarget(btn.getBoundingClientRect());
    }, 200);
    return () => clearTimeout(tid);
  }, [step5ConcludeVisible, onRegisterNudgeTarget]);

  // ── Step 5: shift triangles left + slide in panel ──
  useEffect(() => {
    if (step !== 999) return;
    if (onSetPrevDisabled) onSetPrevDisabled(true);

    setStep5NameRevealed(false);
    setStep5PanelVisible(false);
    setStep5ShiftX(0);
    setStep5YellowScale(1);
    if (step5ScaleAnimRef.current) {
      step5ScaleAnimRef.current.kill();
      step5ScaleAnimRef.current = null;
    }

    setAnimYellow((prev) => (prev ? { ...prev, labelInside: 1 } : prev));

    const shiftAnim = { x: 0 };
    const shiftTween = gsap.to(shiftAnim, {
      x: -120,
      duration: 0.85,
      ease: "power2.inOut",
      onUpdate: () => setStep5ShiftX(shiftAnim.x),
    });
    step5AnimRef.current = shiftTween;

    const panelTid = setTimeout(() => {
      setStep5PanelVisible(true);
      setTimeout(() => {
        if (onSetPrevDisabled) onSetPrevDisabled(false);
        const btn = document.getElementById("name-button");
        if (btn && onRegisterNudgeTarget) {
          onRegisterNudgeTarget(btn.getBoundingClientRect());
        }
      }, 800);
    }, 400);

    return () => {
      if (step5AnimRef.current) step5AnimRef.current.kill();
      if (step5ScaleAnimRef.current) {
        step5ScaleAnimRef.current.kill();
        step5ScaleAnimRef.current = null;
      }
      setStep5YellowScale(1);
      clearTimeout(panelTid);
    };
  }, [step, onRegisterNudgeTarget, onSetPrevDisabled]);

  useEffect(() => {
    if (step5ScaleAnimRef.current) {
      step5ScaleAnimRef.current.kill();
      step5ScaleAnimRef.current = null;
    }
    setStep5YellowScale(1);

    if (step !== 5 || !step5NameRevealed) return undefined;

    const scaleAnim = { scale: 1 };
    const updateScale = () => setStep5YellowScale(scaleAnim.scale);
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(scaleAnim, {
      scale: 0.7,
      duration: 2,
      ease: "power1.inOut",
      onUpdate: updateScale,
    })
      .to({}, { duration: 1 })
      .to(scaleAnim, {
        scale: 1,
        duration: 2,
        ease: "power1.inOut",
        onUpdate: updateScale,
      })
      .to({}, { duration: 1 })
      .to(scaleAnim, {
        scale: 1.35,
        duration: 2,
        ease: "power1.inOut",
        onUpdate: updateScale,
      })
      .to({}, { duration: 1 })
      .to(scaleAnim, {
        scale: 1,
        duration: 2,
        ease: "power1.inOut",
        onUpdate: updateScale,
      });

    step5ScaleAnimRef.current = tl;

    return () => {
      tl.kill();
      if (step5ScaleAnimRef.current === tl) {
        step5ScaleAnimRef.current = null;
      }
      setStep5YellowScale(1);
    };
  }, [step, step5NameRevealed]);

  const handleStep5NameClick = useCallback(() => {
    playSnd("click");
    setStep5NameRevealed(true);
    if (onHideNudge) onHideNudge();
    if (onStep5NameReveal) onStep5NameReveal();
  }, [onHideNudge, onStep5NameReveal]);

  // ── Rendering ──
  const handleSasNameClick = useCallback(() => {
    playSnd("click");
    setStep8NameRevealed(true);
    if (onHideNudge) onHideNudge();
    if (onStep8NameReveal) onStep8NameReveal();
  }, [onHideNudge, onStep8NameReveal]);

  useEffect(() => {
    if (step !== 8) return;
    if (onSetPrevDisabled) onSetPrevDisabled(true);
    setStep5PanelVisible(false);
    setStep5ShiftX(0);
    setStep8NameRevealed(false);
    const shiftAnim = { x: 0 };
    const tween = gsap.to(shiftAnim, {
      x: -120,
      duration: 0.85,
      ease: "power2.inOut",
      onUpdate: () => setStep5ShiftX(shiftAnim.x),
      onComplete: () => {
        setStep5PanelVisible(true);
        setTimeout(() => {
          if (onSetPrevDisabled) onSetPrevDisabled(false);
          const btn = document.getElementById("name-button");
          if (btn && onRegisterNudgeTarget)
            onRegisterNudgeTarget(btn.getBoundingClientRect());
        }, 600);
      },
    });
    return () => tween.kill();
  }, [step, onRegisterNudgeTarget, onSetPrevDisabled]);

  useEffect(() => {
    if (step !== 6 || !lineStates) return;
    if (onSetPrevDisabled) onSetPrevDisabled(true);
    setStep5NonSimilarVisible(false);
    setStep5ConcludeVisible(false);
    setStep5PanelVisible(false);
    setStep6CtaVisible(false);

    const mapping = mapTwoSideYellowVertices(lineStates);
    if (!mapping) return;

    const blueTarget = applyShift(
      triPointsRef.current,
      computeLeftShift(triPointsRef.current),
    );
    const yellowBase = { A: mapping.X, B: mapping.Y, C: mapping.Z };
    const yellowTargetTri = centerTriangle(yellowBase, 740, SVG_H / 2);
    const yellowTarget = {
      X: yellowTargetTri.A,
      Y: yellowTargetTri.B,
      Z: yellowTargetTri.C,
    };
    const blueStart =
      animBluePts || centerTriangle(blueTarget, SVG_W / 2, SVG_H / 2);
    const yellowStart = animYellow
      ? { X: animYellow.X, Y: animYellow.Y, Z: animYellow.Z }
      : yellowTarget;

    const anim = { t: 0 };
    const tween = gsap.to(anim, {
      t: 1,
      duration: 1.0,
      ease: "power2.inOut",
      onUpdate: () => {
        const t = anim.t;
        setAnimBluePts(lerpTriangle(blueStart, blueTarget, t));
        setAnimYellow({
          X: lerpPt(yellowStart.X, yellowTarget.X, t),
          Y: lerpPt(yellowStart.Y, yellowTarget.Y, t),
          Z: lerpPt(yellowStart.Z, yellowTarget.Z, t),
          sides: mapping.sides,
          labelInside: 0,
        });
      },
      onComplete: () => {
        setAnimBluePts(blueTarget);
        setAnimYellow({
          ...yellowTarget,
          sides: mapping.sides,
          labelInside: 0,
        });
        setTimeout(() => {
          setStep6CtaVisible(true);
          if (onSetPrevDisabled) onSetPrevDisabled(false);
          if (onStep6Ready) onStep6Ready();
        }, 500);
      },
    });

    return () => tween.kill();
  }, [step, lineStates, onSetPrevDisabled, onStep6Ready]);

  const getCurrentBlueForAngle = useCallback(() => {
    return (
      animBluePts ||
      applyShift(triPointsRef.current, computeLeftShift(triPointsRef.current))
    );
  }, [animBluePts]);

  const getCurrentYellowForAngle = useCallback(() => {
    if (!animYellow) return null;
    return { X: animYellow.X, Y: animYellow.Y, Z: animYellow.Z };
  }, [animYellow]);

  const finishStep7AngleMatch = useCallback(
    (endpoint, targetPoint) => {
      setAnimYellow((prev) => {
        if (!prev) return prev;
        const nextY = endpoint === "Y" ? targetPoint : prev.Y;
        const nextZ = endpoint === "Z" ? targetPoint : prev.Z;
        const nextSides = {
          ...prev.sides,
          BC: fmtLen(ptDist(nextY, nextZ) / SCALE),
        };
        return {
          ...prev,
          Y: nextY,
          Z: nextZ,
          sides: nextSides,
          labelInside: 0,
        };
      });
      setStep7AngleMatched(true);
      setStep7CheckVisible(true);
      onUpdateTexts(undefined, APP_DATA.steps[7].navCheck);
      playSnd("congrats");
      setTimeout(() => {
        const btn = document.getElementById("step7-check-button");
        if (btn && onRegisterNudgeTarget)
          onRegisterNudgeTarget(btn.getBoundingClientRect());
      }, 250);
    },
    [onRegisterNudgeTarget, onUpdateTexts],
  );

  const handleStep7RotateStart = useCallback(
    (endpoint, e) => {
      if (step !== 7 || step7AngleMatched) return;
      const blue = getCurrentBlueForAngle();
      const yellow = getCurrentYellowForAngle();
      if (!blue || !yellow) return;
      e.preventDefault();
      e.stopPropagation();

      const targetAngle = angleDegAt(blue.A, blue.B, blue.C);
      const movingStart = endpoint === "Y" ? yellow.Y : yellow.Z;
      const fixedPoint = endpoint === "Y" ? yellow.Z : yellow.Y;
      const radius = ptDist(yellow.X, movingStart);

      const handleMove = (ev) => {
        ev.preventDefault();
        const p = getSVGPoint(ev);
        const rawAngle = Math.atan2(p.y - yellow.X.y, p.x - yellow.X.x);
        const nextPoint = {
          x: yellow.X.x + Math.cos(rawAngle) * radius,
          y: yellow.X.y + Math.sin(rawAngle) * radius,
        };
        if (!pointInViewBox(nextPoint, YELLOW_POINT_RADIUS)) return;
        const nextY = endpoint === "Y" ? nextPoint : fixedPoint;
        const nextZ = endpoint === "Z" ? nextPoint : fixedPoint;
        const nextAngle = angleDegAt(yellow.X, nextY, nextZ);
        if (Math.abs(nextAngle - targetAngle) <= 3) {
          const snappedPoint = pointForAngleAtX(
            yellow.X,
            fixedPoint,
            nextPoint,
            targetAngle,
          );
          if (!pointInViewBox(snappedPoint, YELLOW_POINT_RADIUS)) return;
          window.removeEventListener("mousemove", handleMove);
          window.removeEventListener("mouseup", handleUp);
          window.removeEventListener("touchmove", handleMove);
          window.removeEventListener("touchend", handleUp);
          finishStep7AngleMatch(endpoint, snappedPoint);
          return;
        }
        setAnimYellow((prev) => {
          if (!prev) return prev;
          const updatedY = endpoint === "Y" ? nextPoint : prev.Y;
          const updatedZ = endpoint === "Z" ? nextPoint : prev.Z;
          return {
            ...prev,
            Y: updatedY,
            Z: updatedZ,
            sides: {
              ...prev.sides,
              BC: fmtLen(ptDist(updatedY, updatedZ) / SCALE),
            },
            labelInside: 0,
          };
        });
      };
      const handleUp = () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
        window.removeEventListener("touchmove", handleMove);
        window.removeEventListener("touchend", handleUp);
      };
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
      window.addEventListener("touchmove", handleMove, { passive: false });
      window.addEventListener("touchend", handleUp);
    },
    [
      step,
      step7AngleMatched,
      getCurrentBlueForAngle,
      getCurrentYellowForAngle,
      getSVGPoint,
      finishStep7AngleMatch,
    ],
  );

  const runStep7SimilarityCheck = useCallback(() => {
    const blueStart = getCurrentBlueForAngle();
    const yellowStart = getCurrentYellowForAngle();
    if (!blueStart || !yellowStart || !animYellow) return;
    playSnd("click");
    if (onHideNudge) onHideNudge();
    if (onSetPrevDisabled) onSetPrevDisabled(true);
    setStep7CheckVisible(false);

    const blueTarget = centerTriangle(blueStart, SVG_W / 2, SVG_H / 2);
    const yellowRigidTarget = orientTriangleToSideWithoutScaling(
      yellowStart,
      blueTarget.A,
      blueTarget.B,
      blueTarget.C,
    );
    const yellowScaledTarget = transformTriangleForSideMatch(
      yellowStart,
      blueTarget.A,
      blueTarget.B,
      blueTarget.C,
    );
    const moveAnim = { t: 0 };
    const scaleAnim = { t: 0 };
    const sides = { ...animYellow.sides };
    const tl = gsap.timeline({
      onComplete: () => {
        setAnimBluePts(blueTarget);
        setAnimYellow({ ...yellowScaledTarget, sides, labelInside: 1 });
        setStep7SimilarVisible(true);
        setTimeout(() => {
          setStep7ConcludeVisible(true);
          onUpdateTexts(
            APP_DATA.steps[7].questionFit,
            APP_DATA.steps[7].navConclude,
          );
          if (onSetPrevDisabled) onSetPrevDisabled(false);
          setTimeout(() => {
            const btn = document.getElementById("sas-conclude-button");
            if (btn && onRegisterNudgeTarget)
              onRegisterNudgeTarget(btn.getBoundingClientRect());
          }, 250);
        }, 500);
      },
    });

    tl.to(moveAnim, {
      t: 1,
      duration: 1.15,
      ease: "power2.inOut",
      onUpdate: () => {
        const t = moveAnim.t;
        setAnimBluePts(lerpTriangle(blueStart, blueTarget, t));
        setAnimYellow({
          X: lerpPt(yellowStart.X, yellowRigidTarget.X, t),
          Y: lerpPt(yellowStart.Y, yellowRigidTarget.Y, t),
          Z: lerpPt(yellowStart.Z, yellowRigidTarget.Z, t),
          sides,
          labelInside: Math.min(1, t * 1.15),
        });
      },
    });
    tl.to(scaleAnim, {
      t: 1,
      duration: 0.75,
      ease: "power2.inOut",
      onUpdate: () => {
        const t = scaleAnim.t;
        setAnimBluePts(blueTarget);
        setAnimYellow({
          X: { ...blueTarget.A },
          Y: lerpPt(yellowRigidTarget.Y, yellowScaledTarget.Y, t),
          Z: lerpPt(yellowRigidTarget.Z, yellowScaledTarget.Z, t),
          sides,
          labelInside: 1,
        });
      },
    });
  }, [
    animYellow,
    getCurrentBlueForAngle,
    getCurrentYellowForAngle,
    onHideNudge,
    onRegisterNudgeTarget,
    onSetPrevDisabled,
    onUpdateTexts,
  ]);

  useEffect(() => {
    if (step !== 7) return;
    setStep6CtaVisible(false);
    setStep7AngleMatched(false);
    setStep7CheckVisible(false);
    setStep7SimilarVisible(false);
    setStep7ConcludeVisible(false);
  }, [step]);

  const renderBlueTriangle = () => {
    const pts =
      (step === 4 || step === 5 || step === 6 || step === 7 || step === 8) &&
      animBluePts
        ? animBluePts
        : currentTriPoints;
    const centroid = triCentroid(pts);
    const labelOffset = 18;
    const sides = [
      { key: "AB", p1: pts.A, p2: pts.B, len: sideLengths.AB },
      { key: "AC", p1: pts.A, p2: pts.C, len: sideLengths.AC },
      { key: "BC", p1: pts.B, p2: pts.C, len: sideLengths.BC },
    ];

    return React.createElement(
      "g",
      { className: "blue-triangle-group" },
      sides.map((side) =>
        React.createElement("line", {
          key: `blue-side-${side.key}`,
          x1: side.p1.x,
          y1: side.p1.y,
          x2: side.p2.x,
          y2: side.p2.y,
          stroke: COLOR_BLUE,
          strokeWidth: STROKE_WIDTH,
          strokeLinecap: "round",
          style: { opacity: step >= 2 && side.key === "BC" ? 0.5 : 1 },
        }),
      ),
      ["A", "B", "C"].map((v) =>
        React.createElement("circle", {
          key: `blue-pt-${v}`,
          id: step === 1 && v === "A" ? "vertex-a-point" : undefined,
          cx: pts[v].x,
          cy: pts[v].y,
          r: BLUE_POINT_RADIUS,
          fill: COLOR_BLUE,
          className: step === 1 ? "draggable-vertex" : "",
          style: step === 1 ? { cursor: "grab" } : {},
          onMouseDown: step === 1 ? (e) => handleVertexDown(v, e) : undefined,
          onTouchStart: step === 1 ? (e) => handleVertexDown(v, e) : undefined,
        }),
      ),
      false &&
        ["A", "B", "C"].map((v) => {
          const dir = { x: pts[v].x - centroid.x, y: pts[v].y - centroid.y };
          const dLen = Math.hypot(dir.x, dir.y) || 1;
          const lp = {
            x: pts[v].x + (dir.x / dLen) * 22,
            y: pts[v].y + (dir.y / dLen) * 22,
          };
          return React.createElement(
            "text",
            {
              key: `vlabel-${v}`,
              x: lp.x,
              y: lp.y,
              fill: COLOR_BLUE,
              fontSize: LABEL_FONT_SIZE + 4,
              fontWeight: 700,
              textAnchor: "middle",
              dominantBaseline: "middle",
            },
            v,
          );
        }),
      sides.map((side) => {
        const mid = ptMid(side.p1, side.p2);
        const lPos = labelOutward(mid, side.p1, side.p2, centroid, labelOffset);
        const angle = sideAngleDeg(side.p1, side.p2);
        let textAngle = angle;
        if (textAngle > 90) textAngle -= 180;
        if (textAngle < -90) textAngle += 180;
        return React.createElement(
          "text",
          {
            key: `slabel-${side.key}`,
            x: lPos.x,
            y: lPos.y,
            fill: COLOR_BLUE,
            fontSize: LABEL_FONT_SIZE,
            fontWeight: 600,
            textAnchor: "middle",
            dominantBaseline: "middle",
            transform: `rotate(${textAngle}, ${lPos.x}, ${lPos.y})`,
            className: `side-label side-label-${side.key}`,
            style: { opacity: step >= 2 && side.key === "BC" ? 0.5 : 1 },
          },
          fmtLen(side.len) + " cm",
        );
      }),
    );
  };

  const renderYellowLines = () => {
    if (!yellowLines || step !== 2) return null;
    return React.createElement(
      "g",
      { className: "yellow-lines-group" },
      yellowLines.map((line) => {
        const mid = ptMid(line.p1, line.p2);
        const angle = sideAngleDeg(line.p1, line.p2);
        let textAngle = angle;
        if (textAngle > 90) textAngle -= 180;
        if (textAngle < -90) textAngle += 180;
        return React.createElement(
          "g",
          { key: line.id },
          React.createElement("line", {
            x1: line.p1.x,
            y1: line.p1.y,
            x2: line.p2.x,
            y2: line.p2.y,
            stroke: COLOR_YELLOW,
            strokeWidth: YELLOW_STROKE_WIDTH,
            strokeLinecap: "round",
          }),
          React.createElement("circle", {
            cx: line.p1.x,
            cy: line.p1.y,
            r: YELLOW_POINT_RADIUS,
            fill: COLOR_YELLOW,
          }),
          React.createElement("circle", {
            cx: line.p2.x,
            cy: line.p2.y,
            r: YELLOW_POINT_RADIUS,
            fill: COLOR_YELLOW,
          }),
          React.createElement(
            "text",
            {
              x: mid.x,
              y: mid.y - 16,
              fill: COLOR_YELLOW,
              fontSize: LABEL_FONT_SIZE - 2,
              fontWeight: 600,
              textAnchor: "middle",
              dominantBaseline: "middle",
              transform: `rotate(${textAngle}, ${mid.x}, ${mid.y - 16})`,
            },
            line.displayLength + " cm",
          ),
        );
      }),
    );
  };

  const renderRatioBox = () => {
    if (step !== 2 || !ratioBoxVisible || !yellowLines || !selectedRatio)
      return null;
    const leftPts = applyShift(triPoints, computeLeftShift(triPoints));
    const blueDisplayed = getBlueDisplayedLengths(leftPts);

    const yAB = yellowLines.find((l) => l.origSide === "AB");
    const yAC = yellowLines.find((l) => l.origSide === "AC");

    const fractions = [
      { num: yAB ? yAB.displayLength : "0", den: fmtLen(blueDisplayed.AB) },
      { num: yAC ? yAC.displayLength : "0", den: fmtLen(blueDisplayed.AC) },
    ];

    const pos = getRatioBoxPositions();
    const {
      boxX,
      boxY,
      boxW,
      boxH,
      fracSpacing,
      startX,
      centerY,
      resultOffsetX,
      numOffsetY,
      denOffsetY,
    } = pos;

    const vis = (needed) => (ratioAnimStep >= needed ? 1 : 0);

    return React.createElement(
      "g",
      {
        className: "ratio-box-group",
        style: {
          opacity: step2FadeOpacity,
          transition: step2FadingOut ? "none" : undefined,
        },
      },
      React.createElement("rect", {
        x: boxX,
        y: boxY,
        width: boxW,
        height: boxH,
        rx: 12,
        ry: 12,
        fill: "rgba(55, 65, 75, 0.9)",
        stroke: "rgba(255,255,255,0.15)",
        strokeWidth: 1.5,
      }),
      fractions.map((frac, i) => {
        const fx = startX + i * fracSpacing;
        const numStep = i * 3 + 1;
        const barStep = i * 3 + 2;
        const denStep = i * 3 + 3;
        return React.createElement(
          "g",
          { key: `frac-${i}` },
          React.createElement(
            "text",
            {
              x: fx,
              y: centerY + numOffsetY,
              fill: COLOR_YELLOW,
              fontSize: 19,
              fontWeight: 700,
              textAnchor: "middle",
              dominantBaseline: "middle",
              style: { opacity: vis(numStep), transition: "opacity 0.3s" },
            },
            String(frac.num),
          ),
          React.createElement("line", {
            x1: fx - 22,
            y1: centerY,
            x2: fx + 22,
            y2: centerY,
            stroke: COLOR_WHITE,
            strokeWidth: 2,
            style: { opacity: vis(barStep), transition: "opacity 0.3s" },
          }),
          React.createElement(
            "text",
            {
              x: fx,
              y: centerY + denOffsetY,
              fill: COLOR_BLUE,
              fontSize: 19,
              fontWeight: 700,
              textAnchor: "middle",
              dominantBaseline: "middle",
              style: { opacity: vis(denStep), transition: "opacity 0.3s" },
            },
            String(frac.den),
          ),
          i < fractions.length - 1 &&
            React.createElement(
              "text",
              {
                x: fx + fracSpacing / 2,
                y: centerY,
                fill: COLOR_WHITE,
                fontSize: 20,
                fontWeight: 700,
                textAnchor: "middle",
                dominantBaseline: "middle",
                style: { opacity: vis(denStep), transition: "opacity 0.3s" },
              },
              "=",
            ),
        );
      }),
      React.createElement(
        "text",
        {
          x: startX + (fractions.length - 1) * fracSpacing + resultOffsetX,
          y: centerY,
          fill: COLOR_WHITE,
          fontSize: 18,
          fontWeight: 700,
          textAnchor: "middle",
          dominantBaseline: "middle",
          style: { opacity: vis(7), transition: "opacity 0.3s" },
        },
        "= " + selectedRatio,
      ),
    );
  };

  const renderFlyingClones = () => {
    if (flyingClones.length === 0) return null;
    return React.createElement(
      "g",
      { className: "flying-clones-layer", style: { pointerEvents: "none" } },
      flyingClones.map((clone) => {
        const x = clone.from.x + (clone.to.x - clone.from.x) * clone.t;
        const y = clone.from.y + (clone.to.y - clone.from.y) * clone.t;
        const fromFs = clone.fromFontSize || RATIO_BOX_NUM_FONT_SIZE;
        const toFs = clone.toFontSize || RATIO_BOX_NUM_FONT_SIZE;
        const fontSize = fromFs + (toFs - fromFs) * clone.t;
        return React.createElement(
          "text",
          {
            key: clone.id,
            x: x,
            y: y,
            fill: clone.color,
            fontSize: fontSize,
            fontWeight: 600,
            textAnchor: "middle",
            dominantBaseline: "middle",
          },
          clone.text,
        );
      }),
    );
  };

  const renderProportionalText = () => {
    if (step !== 2 || !proportionalTextVisible) return null;
    const { centerX, proportionalTextY, proportionalLineHeight } =
      getRatioBoxPositions();
    const lines = APP_DATA.steps[2].proportionalText.split("\n");
    return React.createElement(
      "text",
      {
        x: centerX,
        y: proportionalTextY,
        fill: COLOR_YELLOW,
        fontSize: 20,
        fontWeight: 600,
        textAnchor: "middle",
        dominantBaseline: "hanging",
        fontStyle: "italic",
        className: "proportional-text",
        style: {
          opacity: step2FadeOpacity,
          transition: step2FadingOut ? "none" : undefined,
        },
      },
      lines.map((line, i) =>
        React.createElement(
          "tspan",
          { key: i, x: centerX, dy: i === 0 ? 0 : proportionalLineHeight },
          line,
        ),
      ),
    );
  };

  const renderStep3Lines = () => {
    if (!lineStates || (step !== 3 && step !== 4)) return null;
    const labelOffset = 18;
    const formedCentroid = triangleFormed
      ? {
          x:
            lineStates.reduce((sum, l) => sum + l.p1.x + l.p2.x, 0) /
            (lineStates.length * 2),
          y:
            lineStates.reduce((sum, l) => sum + l.p1.y + l.p2.y, 0) /
            (lineStates.length * 2),
        }
      : null;
    const openEndpoints =
      step === 4 && !lineStates.some((line) => line.origSide === "BC")
        ? getOpenYellowEndpoints(lineStates)
        : null;

    const getDrawEndpoint = (pt) => {
      if (!openEndpoints) return null;
      if (ptDist(pt, openEndpoints.y) < 1) return "y";
      if (ptDist(pt, openEndpoints.z) < 1) return "z";
      return null;
    };

    return React.createElement(
      "g",
      { className: "step3-lines-group" },
      lineStates
        .map((line, idx) => {
          const mid = ptMid(line.p1, line.p2);
          const angle = sideAngleDeg(line.p1, line.p2);
          let textAngle = angle;
          if (textAngle > 90) textAngle -= 180;
          if (textAngle < -90) textAngle += 180;

          const showMoveHandle = step === 3 && !triangleFormed && !line.locked;
          const canRotateP1 =
            step === 3 && canRotateEndpoint(line, "p1", triangleFormed);
          const canRotateP2 =
            step === 3 && canRotateEndpoint(line, "p2", triangleFormed);
          const rotHandleEp = canRotateP1 ? "p1" : canRotateP2 ? "p2" : null;
          const rotHandlePt = rotHandleEp ? line[rotHandleEp] : null;
          const leftEp = getLeftEndpointKey(line);
          const p1DrawEndpoint = getDrawEndpoint(line.p1);
          const p2DrawEndpoint = getDrawEndpoint(line.p2);
          const lineOpacity = line.dehighlighted ? 0.45 : 1;

          let labelX = mid.x;
          let labelY = mid.y - (showMoveHandle ? MOVE_HANDLE_RADIUS + 12 : 16);
          if (triangleFormed && formedCentroid) {
            const outward = labelOutward(
              mid,
              line.p1,
              line.p2,
              formedCentroid,
              labelOffset,
            );
            labelX = outward.x;
            labelY = outward.y;
          }

          return React.createElement(
            "g",
            { key: line.id },
            React.createElement("line", {
              x1: line.p1.x,
              y1: line.p1.y,
              x2: line.p2.x,
              y2: line.p2.y,
              stroke: COLOR_YELLOW,
              strokeWidth: YELLOW_STROKE_WIDTH,
              strokeLinecap: "round",
              style: { opacity: lineOpacity },
            }),
            React.createElement("circle", {
              cx: line.p1.x,
              cy: line.p1.y,
              r: YELLOW_POINT_RADIUS,
              fill: COLOR_YELLOW,
              style: {
                cursor: p1DrawEndpoint
                  ? "crosshair"
                  : canRotateP1
                    ? "grab"
                    : "default",
                pointerEvents: p1DrawEndpoint || canRotateP1 ? "auto" : "none",
                opacity: lineOpacity,
              },
              onMouseDown: p1DrawEndpoint
                ? (e) => handleClosingDrawStart(p1DrawEndpoint, e)
                : canRotateP1
                  ? (e) => handleEndpointRotateStart(idx, "p1", e)
                  : undefined,
              onTouchStart: p1DrawEndpoint
                ? (e) => handleClosingDrawStart(p1DrawEndpoint, e)
                : canRotateP1
                  ? (e) => handleEndpointRotateStart(idx, "p1", e)
                  : undefined,
            }),
            React.createElement("circle", {
              cx: line.p2.x,
              cy: line.p2.y,
              r: YELLOW_POINT_RADIUS,
              fill: COLOR_YELLOW,
              style: {
                cursor: p2DrawEndpoint
                  ? "crosshair"
                  : canRotateP2
                    ? "grab"
                    : "default",
                pointerEvents: p2DrawEndpoint || canRotateP2 ? "auto" : "none",
                opacity: lineOpacity,
              },
              onMouseDown: p2DrawEndpoint
                ? (e) => handleClosingDrawStart(p2DrawEndpoint, e)
                : canRotateP2
                  ? (e) => handleEndpointRotateStart(idx, "p2", e)
                  : undefined,
              onTouchStart: p2DrawEndpoint
                ? (e) => handleClosingDrawStart(p2DrawEndpoint, e)
                : canRotateP2
                  ? (e) => handleEndpointRotateStart(idx, "p2", e)
                  : undefined,
            }),
            rotHandleEp &&
              React.createElement("image", {
                href: ROT_HANDLE_SRC,
                x: rotHandlePt.x - ROT_HANDLE_SIZE / 2,
                y: rotHandlePt.y - ROT_HANDLE_SIZE / 2,
                width: ROT_HANDLE_SIZE,
                height: ROT_HANDLE_SIZE,
                className: "rot-handle-image",
                style: { cursor: "grab", pointerEvents: "all" },
                onMouseDown: (e) =>
                  handleEndpointRotateStart(idx, rotHandleEp, e),
                onTouchStart: (e) =>
                  handleEndpointRotateStart(idx, rotHandleEp, e),
              }),
            showMoveHandle &&
              React.createElement("circle", {
                cx: mid.x,
                cy: mid.y,
                r: MOVE_HANDLE_RADIUS,
                fill: "rgba(255,255,255,0.45)",
                style: { cursor: "move" },
                onMouseDown: (e) => handleLineMoveStart(idx, e),
                onTouchStart: (e) => handleLineMoveStart(idx, e),
              }),
            React.createElement(
              "text",
              {
                x: labelX,
                y: labelY,
                fill: COLOR_YELLOW,
                fontSize: YELLOW_LABEL_FONT_SIZE,
                fontWeight: 600,
                textAnchor: "middle",
                dominantBaseline: "middle",
                transform: `rotate(${textAngle}, ${labelX}, ${labelY})`,
                style: { pointerEvents: "none", opacity: lineOpacity },
              },
              line.displayLength + " cm",
            ),
          );
        })
        .concat(
          drawDraft
            ? [
                React.createElement("line", {
                  key: "draw-draft",
                  x1: drawDraft.from.x,
                  y1: drawDraft.from.y,
                  x2: drawDraft.to.x,
                  y2: drawDraft.to.y,
                  stroke: COLOR_YELLOW,
                  strokeWidth: YELLOW_STROKE_WIDTH / 2,
                  strokeLinecap: "round",
                  strokeDasharray: "8 6",
                }),
              ]
            : [],
        ),
    );
  };

  const renderOverlapYellow = () => {
    if ((step !== 5 && step !== 6 && step !== 7 && step !== 8) || !animYellow)
      return null;
    const { sides } = animYellow;
    const labelInside = animYellow.labelInside;
    const baseYellowPts = { A: animYellow.X, B: animYellow.Y, C: animYellow.Z };
    const yellowPts =
      step === 5
        ? scaleTriangleFromTopVertex(baseYellowPts, step5YellowScale)
        : baseYellowPts;
    const { A: X, B: Y, C: Z } = yellowPts;
    const centroid = triCentroid(yellowPts);
    const labelOffset = 18;
    const yellowSides = [
      { key: "AB", p1: X, p2: Y, yellowLen: sides.AB },
      { key: "BC", p1: Y, p2: Z, yellowLen: sides.BC },
      { key: "AC", p1: X, p2: Z, yellowLen: sides.AC },
    ];

    const displayLen = (side) => {
      if (step === 5 || step === 7 || step === 8) {
        return fmtLen(ptDist(side.p1, side.p2) / SCALE);
      }
      return side.yellowLen;
    };

    return React.createElement(
      "g",
      { className: "step4-yellow-group" },
      yellowSides.map((side) =>
        React.createElement("line", {
          key: `yellow-side-${side.key}`,
          x1: side.p1.x,
          y1: side.p1.y,
          x2: side.p2.x,
          y2: side.p2.y,
          stroke: COLOR_YELLOW,
          strokeWidth: YELLOW_STROKE_WIDTH,
          strokeLinecap: "round",
          style: { opacity: side.key === "BC" ? 0.45 : 1 },
        }),
      ),
      [X, Y, Z].map((pt, i) =>
        React.createElement("circle", {
          key: `y-pt-${i}`,
          cx: pt.x,
          cy: pt.y,
          r: YELLOW_POINT_RADIUS,
          fill: COLOR_YELLOW,
        }),
      ),
      step === 7 &&
        !step7AngleMatched &&
        ["Y", "Z"].map((endpoint) => {
          const pt = endpoint === "Y" ? Y : Z;
          return React.createElement("image", {
            key: `step7-rot-${endpoint}`,
            href: ROT_HANDLE_SRC,
            x: pt.x - ROT_HANDLE_SIZE / 2,
            y: pt.y - ROT_HANDLE_SIZE / 2,
            width: ROT_HANDLE_SIZE,
            height: ROT_HANDLE_SIZE,
            className: "rot-handle-image",
            style: { cursor: "grab", pointerEvents: "all" },
            onMouseDown: (e) => handleStep7RotateStart(endpoint, e),
            onTouchStart: (e) => handleStep7RotateStart(endpoint, e),
          });
        }),
      yellowSides.map((side) => {
        const lPos = getYellowLabelPos(
          side.p1,
          side.p2,
          centroid,
          labelInside,
          labelOffset,
        );
        const angle = sideAngleDeg(side.p1, side.p2);
        let textAngle = angle;
        if (textAngle > 90) textAngle -= 180;
        if (textAngle < -90) textAngle += 180;
        return React.createElement(
          "text",
          {
            key: `y-slabel-${side.key}`,
            x: lPos.x,
            y: lPos.y,
            fill: COLOR_YELLOW,
            fontSize: YELLOW_LABEL_FONT_SIZE,
            fontWeight: 600,
            textAnchor: "middle",
            dominantBaseline: "middle",
            transform: `rotate(${textAngle}, ${lPos.x}, ${lPos.y})`,
            className: "yellow-line-label",
            style: { opacity: side.key === "BC" ? 0.45 : 1 },
          },
          displayLen(side) + " cm",
        );
      }),
    );
  };

  const renderStep5Panel = () => {
    if (step !== 8) return null;
    const stepData = APP_DATA.steps[8];
    return React.createElement(
      "div",
      { className: "step5-panel" + (step5PanelVisible ? " visible" : "") },
      step8NameRevealed
        ? React.createElement(
            "div",
            { className: "step5-sss-box panel-fade-in" },
            stepData.sasName,
          )
        : React.createElement(
            "button",
            {
              id: "name-button",
              className: "step5-name-button",
              onClick: handleSasNameClick,
            },
            stepData.nameButtonText,
          ),
      React.createElement(
        "p",
        { className: "step5-panel-text" },
        stepData.panelText,
      ),
    );
  };

  const renderStep4Overlays = () => {
    const stepData = APP_DATA.steps[step];
    return React.createElement(
      React.Fragment,
      null,
      step === 5 &&
        step5NonSimilarVisible &&
        React.createElement(
          "div",
          { className: "non-similar-text panel-fade-in" },
          stepData.nonSimilarText,
        ),
      step === 5 &&
        step5ConcludeVisible &&
        React.createElement(
          "button",
          {
            id: "conclude-button",
            className: "conclude-button panel-fade-in",
            onClick: () => {
              playSnd("click");
              if (onHideNudge) onHideNudge();
              if (onNext) onNext(6);
            },
          },
          stepData.concludeText,
        ),
      step === 6 &&
        step6CtaVisible &&
        React.createElement("button", {
          id: "try-angle-button",
          className: "try-angle-button panel-fade-in",
          onClick: () => {
            playSnd("click");
            if (onHideNudge) onHideNudge();
            if (onNext) onNext(7);
          },
          dangerouslySetInnerHTML: { __html: stepData.tryAngleButtonText },
        }),
      step === 7 &&
        step7CheckVisible &&
        React.createElement(
          "button",
          {
            id: "step7-check-button",
            className: "try-angle-button panel-fade-in",
            onClick: runStep7SimilarityCheck,
          },
          stepData.checkButtonText,
        ),
      step === 7 &&
        step7SimilarVisible &&
        React.createElement(
          "div",
          { className: "similar-text panel-fade-in" },
          stepData.similarText,
        ),
      step === 7 &&
        step7ConcludeVisible &&
        React.createElement(
          "button",
          {
            id: "sas-conclude-button",
            className: "conclude-button panel-fade-in",
            onClick: () => {
              playSnd("click");
              if (onHideNudge) onHideNudge();
              if (onNext) onNext(8);
            },
          },
          stepData.concludeText,
        ),
    );
  };

  const renderAngleMeasurements = () => {
    if (step !== 7 && step !== 8) return null;
    const blue = getCurrentBlueForAngle();
    const yellow = getCurrentYellowForAngle();
    if (!blue || !yellow) return null;

    const blueAngle = angleDegAt(blue.A, blue.B, blue.C);
    const yellowAngle = angleDegAt(yellow.X, yellow.Y, yellow.Z);
    const blueStart = Math.atan2(blue.B.y - blue.A.y, blue.B.x - blue.A.x);
    const blueEnd = Math.atan2(blue.C.y - blue.A.y, blue.C.x - blue.A.x);
    const yellowStart = Math.atan2(
      yellow.Y.y - yellow.X.y,
      yellow.Y.x - yellow.X.x,
    );
    const yellowEnd = Math.atan2(
      yellow.Z.y - yellow.X.y,
      yellow.Z.x - yellow.X.x,
    );

    const blueLabelAngle = blueStart + signedAngleDelta(blueStart, blueEnd) / 2;
    const yellowLabelAngle =
      yellowStart + signedAngleDelta(yellowStart, yellowEnd) / 2;
    const blueLabel = {
      x: blue.A.x + Math.cos(blueLabelAngle) * 75,
      y: blue.A.y + Math.sin(blueLabelAngle) * 75,
    };
    const yellowLabel = {
      x: yellow.X.x + Math.cos(yellowLabelAngle) * 65,
      y: yellow.X.y + Math.sin(yellowLabelAngle) * 65,
    };

    return React.createElement(
      "g",
      {
        className: "angle-measurements-layer",
        style: { pointerEvents: "none" },
      },
      React.createElement("path", {
        d: describeSector(blue.A.x, blue.A.y, 52, blueStart, blueEnd),
        fill: COLOR_BLUE,
        fillOpacity: 0.28,
        stroke: COLOR_BLUE,
        strokeWidth: 2,
        opacity: 0.85,
      }),
      React.createElement("path", {
        d: describeSector(yellow.X.x, yellow.X.y, 44, yellowStart, yellowEnd),
        fill: COLOR_YELLOW,
        fillOpacity: 0.28,
        stroke: COLOR_YELLOW,
        strokeWidth: 2,
        opacity: 0.9,
      }),
      !(step === 8 || (step === 7 && step7SimilarVisible)) &&
        React.createElement(
          "text",
          {
            x: blueLabel.x,
            y: blueLabel.y,
            fill: COLOR_BLUE,
            fontSize: LABEL_FONT_SIZE,
            fontWeight: 700,
            textAnchor: "middle",
            dominantBaseline: "middle",
          },
          `${Math.round(blueAngle)}\u00B0`,
        ),
      React.createElement(
        "text",
        {
          x: yellowLabel.x,
          y: yellowLabel.y,
          fill: COLOR_YELLOW,
          fontSize: YELLOW_LABEL_FONT_SIZE + 2,
          fontWeight: 700,
          textAnchor: "middle",
          dominantBaseline: "middle",
        },
        `${Math.round(yellowAngle)}\u00B0`,
      ),
    );
  };

  const renderRatioButtons = () => {
    if (step !== 2 || !showButtons) return null;
    const ratios = [0.5, 0.75, 1.1, 1.2];
    return React.createElement(
      "div",
      { className: "ratio-buttons-container" },
      ratios.map((r) =>
        React.createElement(
          "button",
          {
            key: `ratio-${r}`,
            className: "ratio-button",
            onClick: () => handleRatioClick(r),
          },
          `Ratio = ${r}`,
        ),
      ),
    );
  };

  const renderTriangleLayers = () => {
    const layers = [
      renderBlueTriangle(),
      renderYellowLines(),
      renderRatioBox(),
      renderFlyingClones(),
      renderProportionalText(),
      renderStep3Lines(),
      renderOverlapYellow(),
      renderAngleMeasurements(),
    ];
    if (step === 5 || step === 8) {
      return React.createElement(
        "g",
        { transform: `translate(${step5ShiftX}, 0)` },
        layers,
      );
    }
    return layers;
  };

  const step4OpenEndpoints =
    step === 4 &&
    lineStates &&
    !lineStates.some((line) => line.origSide === "BC")
      ? getOpenYellowEndpoints(lineStates)
      : null;
  const showStep4DragNudge =
    step === 4 && step4OpenEndpoints && !step4DragStarted;

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "svg",
      {
        ref: svgRef,
        className: "main-svg",
        viewBox: VIEWBOX,
        preserveAspectRatio: "xMidYMid meet",
      },
      renderTriangleLayers(),
    ),
    showStep4DragNudge &&
      React.createElement(DragPathNudge, {
        show: true,
        svgRef,
        fromPt: step4OpenEndpoints.y,
        toPt: step4OpenEndpoints.z,
      }),
    renderRatioButtons(),
    renderStep4Overlays(),
    renderStep5Panel(),
  );
};
