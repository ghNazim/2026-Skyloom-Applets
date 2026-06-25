const PROPERTY_IDS = ["size", "shape", "position", "orientation"];
const LABEL_IDS = ["image", "preimage"];
const TRANSFORMATION_IDS = ["translation", "rotation", "reflection", "dilation"];

const MCQ_STEPS = [1, 3, 5, 7];
const DND_STEPS = [2, 4, 6, 8];
const LABEL_STEP = 9;
const TRANSFORMATION_DND_STEP = 10;

const GRAPH_VIEW_W = 100;
const GRAPH_VIEW_H = 75;

const ANIM_INITIAL_PAUSE = 600;
const ANIM_DURATION = 900;

const MCQ_RESULT_DELAY = 500;
const DND_WRONG_RETURN_DELAY = 500;

const COLORS = {
  yellow: "#f1c40f",
  gray: "#4a5568",
  arrow: "#9ca3af",
  anchor: "#1e3a5f",
};

const DND_CORRECT_MAPS = {
  2: {
    position: "changed",
    size: "same",
    shape: "same",
    orientation: "same",
  },
  4: {
    position: "changed",
    orientation: "changed",
    size: "same",
    shape: "same",
  },
  6: {
    position: "changed",
    orientation: "changed",
    size: "same",
    shape: "same",
  },
  8: {
    position: "changed",
    size: "changed",
    shape: "same",
    orientation: "same",
  },
};

const LABEL_DND_MAP = {
  preimage: "preimage",
  image: "image",
};

const TRANSFORMATION_DND_MAP = {
  translation: "rigid",
  rotation: "rigid",
  reflection: "rigid",
  dilation: "nonrigid",
};

const HEXAGON_RADIUS = 14;
const HEXAGON_PREIMAGE_CENTER = { x: 18, y: 47 };
const HEXAGON_IMAGE_CENTER = { x: 80, y: 28 };
const PREIMAGE_CENTER = { x: 24, y: 52 };
const IMAGE_CENTER = { x: 74, y: 30 };
const RHOMBUS_RADIUS = 14;

const ROTATION_CENTER = { x: 50, y: 38 };
const RECT_WIDTH = 15.6;
const RECT_HEIGHT = 31.2;
const ROTATION_ANGLE = 90;

const REFLECTION_MIRROR_X = GRAPH_VIEW_W / 2;
const REFLECTION_TRIANGLE = [
  { x: 22, y: 14 },
  { x: 22, y: 42 },
  { x: REFLECTION_MIRROR_X, y: 42 },
];
const REFLECTION_MIRROR_Y1 = 8;
const REFLECTION_MIRROR_Y2 = 50;

const DILATION_CENTER = { x: 50, y: 38 };
const PENTAGON_RADIUS = 15;
const DILATION_SCALE = 1.6;

function isMcqStep(step) {
  return MCQ_STEPS.includes(step);
}

function isDndStep(step) {
  return DND_STEPS.includes(step);
}

function isLabelStep(step) {
  return step === LABEL_STEP;
}

function isTransformationDndStep(step) {
  return step === TRANSFORMATION_DND_STEP;
}

function getDndCorrectMap(step) {
  if (step === LABEL_STEP) return LABEL_DND_MAP;
  if (step === TRANSFORMATION_DND_STEP) return TRANSFORMATION_DND_MAP;
  return DND_CORRECT_MAPS[step] || DND_CORRECT_MAPS[2];
}

function getDndSourceIds(step) {
  if (step === LABEL_STEP) return LABEL_IDS;
  if (step === TRANSFORMATION_DND_STEP) return TRANSFORMATION_IDS;
  return PROPERTY_IDS;
}

function getEmptyPlacements(step) {
  if (step === LABEL_STEP) return { preimage: [], image: [] };
  if (step === TRANSFORMATION_DND_STEP) return { rigid: [], nonrigid: [] };
  return { changed: [], same: [] };
}

function createRegularHexagon(cx, cy, radius) {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / 6;
    points.push({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    });
  }
  return points;
}

function createRhombus(cx, cy, radius) {
  return [
    { x: cx, y: cy - radius },
    { x: cx + radius, y: cy },
    { x: cx, y: cy + radius },
    { x: cx - radius, y: cy },
  ];
}

function getRhombusAtCenter(center, radius) {
  return createRhombus(center.x, center.y, radius);
}

function getRectPoints(cx, cy, w, h, angleDeg) {
  const hw = w / 2;
  const hh = h / 2;
  const corners = [
    { x: -hw, y: -hh },
    { x: hw, y: -hh },
    { x: hw, y: hh },
    { x: -hw, y: hh },
  ];
  const rad = (angleDeg * Math.PI) / 180;
  return corners.map((p) => ({
    x: cx + p.x * Math.cos(rad) - p.y * Math.sin(rad),
    y: cy + p.x * Math.sin(rad) + p.y * Math.cos(rad),
  }));
}

function flipPointsAcrossVerticalAxis(points, mirrorX, progress) {
  const cosTheta = Math.cos(Math.PI * progress);
  return points.map((p) => ({
    x: mirrorX + (p.x - mirrorX) * cosTheta,
    y: p.y,
  }));
}

function rotatePointsAround(points, pivot, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return points.map((p) => {
    const dx = p.x - pivot.x;
    const dy = p.y - pivot.y;
    return {
      x: pivot.x + dx * cos - dy * sin,
      y: pivot.y + dx * sin + dy * cos,
    };
  });
}

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

function scalePointsFromCenter(points, center, scale) {
  return points.map((p) => ({
    x: center.x + (p.x - center.x) * scale,
    y: center.y + (p.y - center.y) * scale,
  }));
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

function pointsToPolygonAttr(points) {
  return points.map((p) => p.x + "," + p.y).join(" ");
}

// Set to any step (0–10) for local testing; keep at 0 for production.
const INITIAL_STEP = 0;

function getDndStepForStep(step) {
  if (isDndStep(step) || isLabelStep(step) || isTransformationDndStep(step)) {
    return step;
  }
  return 2;
}

function getInitialAppState(step) {
  const mcqState = {
    mcqSelectedIndex: null,
    mcqResultState: null,
    mcqShowFeedback: false,
    mcqFeedbackText: "",
    mcqFeedbackType: null,
    mcqAnsweredCorrectly: false,
  };

  const dndStep = getDndStepForStep(step);

  const base = {
    currentStep: step,
    showGray: true,
    animProgress: 0,
    animationDone: false,
    mcqUnlocked: false,
    showReplay: false,
    isAnimating: false,
    dndPlacements: getEmptyPlacements(dndStep),
    dndSourceItems: [...getDndSourceIds(dndStep)],
    dndWrongItemId: null,
    dndWrongZone: null,
    ...mcqState,
  };

  if (step === 0) {
    return { ...base, currentStep: 0 };
  }

  if (isMcqStep(step) || isLabelStep(step)) {
    return base;
  }

  if (isDndStep(step) || isTransformationDndStep(step)) {
    return { ...base, animationDone: true };
  }

  return getInitialAppState(0);
}

function shouldAutoRunAnimationOnMount(step) {
  return step > 0 && (isMcqStep(step) || isLabelStep(step));
}
