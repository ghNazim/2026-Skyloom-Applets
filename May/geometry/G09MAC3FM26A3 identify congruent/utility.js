const audioCache = {};
const sounds = ["correct", "wrong", "click", "congrats", "tick"];
sounds.forEach((name) => {
  const audio = new Audio(`sound/${name}.mp3`);
  audio.load();
  audioCache[name] = audio;
});

function playSound(filename) {
  if (!audioCache[filename]) {
    const audio = new Audio(`sound/${filename}.mp3`);
    audioCache[filename] = audio;
  }
  const sound = audioCache[filename].cloneNode();
  sound.play();
}

function handleComma(sentence) {
  if (current_language !== "id" || !sentence) {
    return sentence;
  }
  return sentence.replace(/,/g, "<cm>,</cm>");
}

function getShapeMatchType(shapeId) {
  if (shapeId === "congruent1" || shapeId === "congruent2") return "congruent";
  if (shapeId.startsWith("congruent")) return "congruent";
  if (shapeId.startsWith("side_match")) return "side_match";
  if (shapeId.startsWith("angle_match")) return "angle_match";
  if (shapeId.startsWith("no_match")) return "no_match";
  return "no_match";
}

function evaluateSelection(selectedIds, questionIndex) {
  if (selectedIds.length !== 2) return null;

  const types = selectedIds.map(getShapeMatchType);
  const hasCongruent1 = selectedIds.includes("congruent1");
  const hasCongruent2 = selectedIds.includes("congruent2");

  if (hasCongruent1 && hasCongruent2) return "correct";

  if (types.includes("congruent") && types.includes("side_match")) {
    return "side_match";
  }
  if (types.includes("congruent") && types.includes("angle_match")) {
    return "angle_match";
  }
  if (types.includes("congruent") && types.includes("no_match")) {
    return "no_match";
  }

  if (!hasCongruent1 && !hasCongruent2) {
    return "no_match";
  }

  return "no_match";
}

function pointsToPolygonString(points) {
  return points.map((p) => p.join(",")).join(" ");
}

function normalizeVector(v) {
  const len = Math.hypot(v.x, v.y) || 1;
  return { x: v.x / len, y: v.y / len };
}

function getRightAngleSquarePath(vertex, prev, next, size) {
  const vPrev = normalizeVector({
    x: prev.x - vertex.x,
    y: prev.y - vertex.y,
  });
  const vNext = normalizeVector({
    x: next.x - vertex.x,
    y: next.y - vertex.y,
  });

  const p0 = { x: vertex.x, y: vertex.y };
  const p1 = {
    x: vertex.x + vPrev.x * size,
    y: vertex.y + vPrev.y * size,
  };
  const p2 = {
    x: vertex.x + vPrev.x * size + vNext.x * size,
    y: vertex.y + vPrev.y * size + vNext.y * size,
  };
  const p3 = {
    x: vertex.x + vNext.x * size,
    y: vertex.y + vNext.y * size,
  };

  return [
    "M",
    p0.x,
    p0.y,
    "L",
    p1.x,
    p1.y,
    "L",
    p2.x,
    p2.y,
    "L",
    p3.x,
    p3.y,
    "Z",
  ].join(" ");
}

function isRightAngle(vertex, prev, next, toleranceDeg) {
  const tolerance = toleranceDeg !== undefined ? toleranceDeg : 8;
  const vPrev = normalizeVector({
    x: prev.x - vertex.x,
    y: prev.y - vertex.y,
  });
  const vNext = normalizeVector({
    x: next.x - vertex.x,
    y: next.y - vertex.y,
  });
  const dot = vPrev.x * vNext.x + vPrev.y * vNext.y;
  const angleDeg =
    (Math.acos(Math.max(-1, Math.min(1, dot))) * 180) / Math.PI;
  return Math.abs(angleDeg - 90) < tolerance;
}

function normalizeSweep(fromDeg, toDeg) {
  let sweep = toDeg - fromDeg;
  while (sweep <= -180) sweep += 360;
  while (sweep > 180) sweep -= 360;
  return sweep;
}

function getInteriorAngleArc(vertex, prev, next, centroid) {
  const vPrev = normalizeVector({
    x: prev.x - vertex.x,
    y: prev.y - vertex.y,
  });
  const vNext = normalizeVector({
    x: next.x - vertex.x,
    y: next.y - vertex.y,
  });

  const startAngle = (Math.atan2(vPrev.y, vPrev.x) * 180) / Math.PI;
  const endAngle = (Math.atan2(vNext.y, vNext.x) * 180) / Math.PI;

  const sweepCW = normalizeSweep(startAngle, endAngle);
  const sweepCCW = sweepCW > 0 ? sweepCW - 360 : sweepCW + 360;

  const bisectorDist = (sweep) => {
    const midRad = ((startAngle + sweep / 2) * Math.PI) / 180;
    const probe = 40;
    const px = vertex.x + Math.cos(midRad) * probe;
    const py = vertex.y + Math.sin(midRad) * probe;
    return Math.hypot(px - centroid.x, py - centroid.y);
  };

  const sweep =
    bisectorDist(sweepCW) < bisectorDist(sweepCCW) ? sweepCW : sweepCCW;

  return {
    startAngle: startAngle,
    endAngle: startAngle + sweep,
  };
}

function describeArcSector(cx, cy, radius, startAngleDeg, endAngleDeg) {
  const startRad = (startAngleDeg * Math.PI) / 180;
  const endRad = (endAngleDeg * Math.PI) / 180;

  const x1 = cx + radius * Math.cos(startRad);
  const y1 = cy + radius * Math.sin(startRad);
  const x2 = cx + radius * Math.cos(endRad);
  const y2 = cy + radius * Math.sin(endRad);

  let sweep = endAngleDeg - startAngleDeg;
  while (sweep <= -360) sweep += 360;
  while (sweep > 360) sweep -= 360;

  const largeArcFlag = Math.abs(sweep) > 180 ? 1 : 0;
  const sweepFlag = sweep > 0 ? 1 : 0;

  return [
    "M",
    cx,
    cy,
    "L",
    x1,
    y1,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    sweepFlag,
    x2,
    y2,
    "Z",
  ].join(" ");
}

function dedupeClosingPoint(points) {
  if (points.length < 2) return points;
  const first = points[0];
  const last = points[points.length - 1];
  if (
    Math.hypot(first[0] - last[0], first[1] - last[1]) < 0.5 &&
    points.length > 3
  ) {
    return points.slice(0, -1);
  }
  return points;
}

function getCornerMarkerSize(vertex, prev, next, baseSize) {
  const lenPrev = Math.hypot(prev.x - vertex.x, prev.y - vertex.y);
  const lenNext = Math.hypot(next.x - vertex.x, next.y - vertex.y);
  const shorterEdge = Math.min(lenPrev, lenNext);
  const maxByEdge = shorterEdge * 0.22;
  return Math.max(20, Math.min(baseSize, maxByEdge));
}

function getCornerMarkers(points, color, baseSize) {
  const cleaned = dedupeClosingPoint(points);
  const n = cleaned.length;
  const markers = [];

  if (n < 3) return markers;

  const centroidPt = getShapeCentroid(cleaned);
  const centroid = { x: centroidPt[0], y: centroidPt[1] };

  for (let i = 0; i < n; i += 1) {
    const vertex = { x: cleaned[i][0], y: cleaned[i][1] };
    const prev = {
      x: cleaned[(i - 1 + n) % n][0],
      y: cleaned[(i - 1 + n) % n][1],
    };
    const next = {
      x: cleaned[(i + 1) % n][0],
      y: cleaned[(i + 1) % n][1],
    };

    const size = getCornerMarkerSize(vertex, prev, next, baseSize);

    if (isRightAngle(vertex, prev, next)) {
      markers.push({
        type: "square",
        d: getRightAngleSquarePath(vertex, prev, next, size),
        fill: color,
      });
    } else {
      const arc = getInteriorAngleArc(vertex, prev, next, centroid);
      markers.push({
        type: "arc",
        d: describeArcSector(
          vertex.x,
          vertex.y,
          size,
          arc.startAngle,
          arc.endAngle,
        ),
        fill: color,
      });
    }
  }

  return markers;
}

function getSingleCornerMarker(points, cornerIndex, color, baseSize) {
  const cleaned = dedupeClosingPoint(points);
  const n = cleaned.length;
  if (n < 3 || cornerIndex < 0 || cornerIndex >= n) return null;

  const i = cornerIndex;
  const vertex = { x: cleaned[i][0], y: cleaned[i][1] };
  const prev = {
    x: cleaned[(i - 1 + n) % n][0],
    y: cleaned[(i - 1 + n) % n][1],
  };
  const next = {
    x: cleaned[(i + 1) % n][0],
    y: cleaned[(i + 1) % n][1],
  };
  const centroidPt = getShapeCentroid(cleaned);
  const centroid = { x: centroidPt[0], y: centroidPt[1] };
  const size = getCornerMarkerSize(vertex, prev, next, baseSize);

  let d;
  if (isRightAngle(vertex, prev, next)) {
    d = getRightAngleSquarePath(vertex, prev, next, size);
  } else {
    const arc = getInteriorAngleArc(vertex, prev, next, centroid);
    d = describeArcSector(
      vertex.x,
      vertex.y,
      size,
      arc.startAngle,
      arc.endAngle,
    );
  }

  return { d: d, fill: color, vertex: vertex, prev: prev, next: next, centroid: centroid };
}

function getAngleLabelPosition(vertex, prev, next, centroid, offset) {
  const arc = getInteriorAngleArc(vertex, prev, next, centroid);
  const midRad = (((arc.startAngle + arc.endAngle) / 2) * Math.PI) / 180;
  const dist = offset || 52;
  return {
    x: vertex.x + Math.cos(midRad) * dist,
    y: vertex.y + Math.sin(midRad) * dist,
  };
}

function getShapeCenter(shapeEl, svgRoot) {
  const points = getShapeCornerPoints(shapeEl, svgRoot);
  if (!points.length) return { x: 0, y: 0 };

  const cleaned = dedupeClosingPoint(points);
  const centroid = getShapeCentroid(cleaned);
  return { x: centroid[0], y: centroid[1] };
}

function ensureOverlayGroup(svgRoot, groupId) {
  let group = svgRoot.querySelector("#" + groupId);
  if (!group) {
    group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("id", groupId);
    group.setAttribute("pointer-events", "none");
    svgRoot.appendChild(group);
  }
  while (group.firstChild) {
    group.removeChild(group.firstChild);
  }
  return group;
}

function renderShapeNameLabels(svgRoot, shapes) {
  const group = ensureOverlayGroup(svgRoot, "shape-names-overlay");

  shapes.forEach((shape) => {
    if (!shape.nameKey || !APP_DATA.shapeNames) return;

    const shapeEl = svgRoot.getElementById(shape.id);
    const nameText = APP_DATA.shapeNames[shape.nameKey];
    if (!shapeEl || !nameText) return;

    const center = getShapeCenter(shapeEl, svgRoot);
    const textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textEl.setAttribute("x", String(center.x));
    textEl.setAttribute("y", String(center.y));
    textEl.setAttribute("fill", "#000000");
    textEl.setAttribute("font-family", "Roboto, system-ui, sans-serif");
    textEl.setAttribute("font-size", "28");
    textEl.setAttribute("font-weight", "700");
    textEl.setAttribute("text-anchor", "middle");
    textEl.setAttribute("dominant-baseline", "middle");
    textEl.setAttribute("pointer-events", "none");
    textEl.textContent = nameText;
    group.appendChild(textEl);
  });
}

function renderPermanentAngles(
  svgRoot,
  permanentAngles,
  hasChecked,
  checkResult,
  selectedIds,
) {
  if (!permanentAngles || !permanentAngles.length) return;

  ensureAngleLabelTextShadowFilter(svgRoot);

  const group = ensureOverlayGroup(svgRoot, "permanent-angles-overlay");
  const wrongResult =
    hasChecked &&
    (checkResult === "angle_match" || checkResult === "no_match");

  permanentAngles.forEach((angleConfig) => {
    const shapeEl = svgRoot.getElementById(angleConfig.shapeId);
    if (!shapeEl) return;

    const isSelected =
      selectedIds && selectedIds.includes(angleConfig.shapeId);
    const shouldUseRed = wrongResult && isSelected;
    const markerColor = shouldUseRed ? "#ff6b8a" : angleConfig.defaultColor;

    const points = getShapeCornerPoints(shapeEl, svgRoot);
    const marker = getSingleCornerMarker(
      points,
      angleConfig.cornerIndex,
      markerColor,
      36,
    );
    if (!marker) return;

    const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathEl.setAttribute("d", marker.d);
    pathEl.setAttribute("fill", marker.fill);
    group.appendChild(pathEl);

    const labelText = APP_DATA.angleLabels
      ? APP_DATA.angleLabels[angleConfig.labelKey]
      : "";
    if (!labelText) return;

    const labelDistance =
      angleConfig.labelDistance !== undefined ? angleConfig.labelDistance : 58;
    const labelPos = getAngleLabelPosition(
      marker.vertex,
      marker.prev,
      marker.next,
      marker.centroid,
      labelDistance,
    );

    const offsetX =
      angleConfig.labelOffset && angleConfig.labelOffset.x !== undefined
        ? angleConfig.labelOffset.x
        : 0;
    const offsetY =
      angleConfig.labelOffset && angleConfig.labelOffset.y !== undefined
        ? angleConfig.labelOffset.y
        : 0;

    const textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textEl.setAttribute("x", String(labelPos.x + offsetX));
    textEl.setAttribute("y", String(labelPos.y + offsetY));
    textEl.setAttribute("fill", markerColor);
    textEl.setAttribute("font-family", "Roboto, system-ui, sans-serif");
    textEl.setAttribute("font-size", "32");
    textEl.setAttribute("font-weight", "700");
    textEl.setAttribute("text-anchor", "middle");
    textEl.setAttribute("dominant-baseline", "middle");
    textEl.setAttribute("pointer-events", "none");
    textEl.setAttribute("filter", "url(#angle-label-text-shadow)");
    textEl.textContent = labelText;
    group.appendChild(textEl);
  });
}

function getShapeCentroid(points) {
  const n = points.length;
  let sx = 0;
  let sy = 0;
  for (let i = 0; i < n; i += 1) {
    sx += points[i][0];
    sy += points[i][1];
  }
  return [sx / n, sy / n];
}

function parsePathPoints(d) {
  const points = [];
  const tokens =
    d.match(/[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?/g) || [];
  let i = 0;
  let cx = 0;
  let cy = 0;
  let sx = 0;
  let sy = 0;
  let cmd = "";

  while (i < tokens.length) {
    const token = tokens[i];
    if (/[a-zA-Z]/.test(token)) {
      cmd = token;
      i += 1;
      continue;
    }

    if (cmd === "M" || cmd === "L") {
      cx = parseFloat(tokens[i++]);
      cy = parseFloat(tokens[i++]);
      points.push([cx, cy]);
      if (cmd === "M") {
        sx = cx;
        sy = cy;
        cmd = "L";
      }
    } else if (cmd === "H") {
      cx = parseFloat(tokens[i++]);
      points.push([cx, cy]);
    } else if (cmd === "V") {
      cy = parseFloat(tokens[i++]);
      points.push([cx, cy]);
    } else if (cmd === "Z" || cmd === "z") {
      cx = sx;
      cy = sy;
      i += 1;
    } else {
      i += 1;
    }
  }

  return points;
}

function applyRotateTransform(points, angleDeg, originX, originY) {
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  return points.map(([x, y]) => {
    const dx = x - originX;
    const dy = y - originY;
    return [originX + dx * cos - dy * sin, originY + dx * sin + dy * cos];
  });
}

function parseTransformRotate(transform) {
  if (!transform) return null;
  const match = transform.match(/rotate\(([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\)/);
  if (!match) return null;
  return {
    angle: parseFloat(match[1]),
    cx: parseFloat(match[2]),
    cy: parseFloat(match[3]),
  };
}

function getRectCornerPoints(rectEl) {
  const x = parseFloat(rectEl.getAttribute("x") || "0");
  const y = parseFloat(rectEl.getAttribute("y") || "0");
  const w = parseFloat(rectEl.getAttribute("width") || "0");
  const h = parseFloat(rectEl.getAttribute("height") || "0");
  let points = [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ];

  const rotate = parseTransformRotate(rectEl.getAttribute("transform"));
  if (rotate) {
    points = applyRotateTransform(points, rotate.angle, rotate.cx, rotate.cy);
  }

  return points;
}

function getShapeCornerPoints(shapeEl, svgRoot) {
  if (!shapeEl) return [];

  if (shapeEl.tagName === "rect") {
    return getRectCornerPoints(shapeEl);
  }

  if (shapeEl.tagName === "path") {
    const d = shapeEl.getAttribute("d");
    return d ? parsePathPoints(d) : [];
  }

  if (typeof shapeEl.getBBox === "function" && svgRoot) {
    const bbox = shapeEl.getBBox();
    const ctm = shapeEl.getCTM();
    if (!ctm) {
      return [
        [bbox.x, bbox.y],
        [bbox.x + bbox.width, bbox.y],
        [bbox.x + bbox.width, bbox.y + bbox.height],
        [bbox.x, bbox.y + bbox.height],
      ];
    }

    const corners = [
      [bbox.x, bbox.y],
      [bbox.x + bbox.width, bbox.y],
      [bbox.x + bbox.width, bbox.y + bbox.height],
      [bbox.x, bbox.y + bbox.height],
    ];

    return corners.map(([px, py]) => {
      const pt = svgRoot.createSVGPoint();
      pt.x = px;
      pt.y = py;
      const transformed = pt.matrixTransform(ctm);
      return [transformed.x, transformed.y];
    });
  }

  return [];
}

function setLabelColor(svgRoot, labelIds, color) {
  if (!svgRoot || !labelIds) return;
  labelIds.forEach((labelId) => {
    const labelEl = svgRoot.getElementById
      ? svgRoot.getElementById(labelId)
      : svgRoot.querySelector("#" + labelId);
    if (labelEl) labelEl.setAttribute("fill", color);
  });
}

function applyShapeStroke(shapeEl, color, width) {
  if (!shapeEl) return;
  shapeEl.setAttribute("stroke", color);
  shapeEl.setAttribute("stroke-width", String(width));
}

function ensureAngleLabelTextShadowFilter(svgRoot) {
  if (!svgRoot || svgRoot.querySelector("#angle-label-text-shadow")) return;

  let defs = svgRoot.querySelector("defs");
  if (!defs) {
    defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    svgRoot.insertBefore(defs, svgRoot.firstChild);
  }

  const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
  filter.setAttribute("id", "angle-label-text-shadow");
  filter.setAttribute("x", "-40%");
  filter.setAttribute("y", "-40%");
  filter.setAttribute("width", "180%");
  filter.setAttribute("height", "180%");

  const shadow = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "feDropShadow",
  );
  shadow.setAttribute("dx", "0");
  shadow.setAttribute("dy", "2");
  shadow.setAttribute("stdDeviation", "2.5");
  shadow.setAttribute("flood-color", "#000000");
  shadow.setAttribute("flood-opacity", "0.75");

  filter.appendChild(shadow);
  defs.appendChild(filter);
}

function ensureSelectionGlowFilter(svgRoot) {
  if (!svgRoot || svgRoot.querySelector("#shape-selected-glow")) return;

  let defs = svgRoot.querySelector("defs");
  if (!defs) {
    defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    svgRoot.insertBefore(defs, svgRoot.firstChild);
  }

  const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
  filter.setAttribute("id", "shape-selected-glow");
  filter.setAttribute("x", "-60%");
  filter.setAttribute("y", "-60%");
  filter.setAttribute("width", "220%");
  filter.setAttribute("height", "220%");
  filter.setAttribute("color-interpolation-filters", "sRGB");

  const shadow1 = document.createElementNS("http://www.w3.org/2000/svg", "feDropShadow");
  shadow1.setAttribute("in", "SourceGraphic");
  shadow1.setAttribute("dx", "0");
  shadow1.setAttribute("dy", "0");
  shadow1.setAttribute("stdDeviation", "8");
  shadow1.setAttribute("flood-color", "#ffffff");
  shadow1.setAttribute("flood-opacity", "0.9");
  shadow1.setAttribute("result", "glowOuter");

  const shadow2 = document.createElementNS("http://www.w3.org/2000/svg", "feDropShadow");
  shadow2.setAttribute("in", "SourceGraphic");
  shadow2.setAttribute("dx", "0");
  shadow2.setAttribute("dy", "0");
  shadow2.setAttribute("stdDeviation", "4");
  shadow2.setAttribute("flood-color", "#ffffff");
  shadow2.setAttribute("flood-opacity", "1");
  shadow2.setAttribute("result", "glowInner");

  const merge = document.createElementNS("http://www.w3.org/2000/svg", "feMerge");
  ["glowOuter", "glowInner", "SourceGraphic"].forEach((inputName) => {
    const node = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
    node.setAttribute("in", inputName);
    merge.appendChild(node);
  });

  filter.appendChild(shadow1);
  filter.appendChild(shadow2);
  filter.appendChild(merge);
  defs.appendChild(filter);
}

function applyShapeSelectionGlow(shapeEl, enabled) {
  if (!shapeEl) return;
  if (enabled) {
    shapeEl.setAttribute("filter", "url(#shape-selected-glow)");
  } else {
    shapeEl.removeAttribute("filter");
  }
}
