const CARD_IDS = ["positive", "negative", "zero", "nondefined"];

const CARD_IMAGES = {
  positive: "assets/positive.png",
  negative: "assets/negative.png",
  zero: "assets/zero.png",
  nondefined: "assets/nondefined.png",
};

const CARD_SEQUENCE = ["positive", "negative", "zero", "nondefined"];

const SLOPE_SCENE = {
  viewBox: {
    width: 1000,
    height: 520,
  },
  hill: {
    leftBase: { x: 0, y: 500 },
    peak: { x: 690, y: 120 },
    rightBase: { x: 1120, y: 520 },
  },
  ride: {
    startT: 0.25,
    endT: 0.9,
    cycleWidth: 150,
    cycleHeight: 120,
  },
};

function pointOnLine(a, b, t) {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  };
}

function getRidePoint(t) {
  return pointOnLine(SLOPE_SCENE.hill.leftBase, SLOPE_SCENE.hill.peak, t);
}

function getHillAngle() {
  const a = SLOPE_SCENE.hill.leftBase;
  const b = SLOPE_SCENE.hill.peak;
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
}
