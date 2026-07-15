const DILATION_GRID_COLS = 14;
const DILATION_GRID_ROWS = 10;

const DILATION_ORIGIN = {
  x: DILATION_GRID_COLS / 2,
  y: DILATION_GRID_ROWS / 2,
};

const PROPERTY_IDS = ["shape", "size", "orientation", "position"];

const RAY_LENGTH = 8;
const SHAPE_INTRO_TARGET_K = 1.8;
const INTRO_TARGET_K = 1.5;

const INITIAL_TRIANGLE = [
  { x: DILATION_ORIGIN.x + 1, y: DILATION_ORIGIN.y + 2.8 },
  { x: DILATION_ORIGIN.x + 1, y: DILATION_ORIGIN.y + 1 },
  { x: DILATION_ORIGIN.x + 2.7, y: DILATION_ORIGIN.y + 1 },
];

const INITIAL_TRIANGLE_LABELS = ["A", "B", "C"];
const INITIAL_TRIANGLE_PRIME_LABELS = ["A\u2032", "B\u2032", "C\u2032"];

const SQUARE_KLMN = [
  { x: DILATION_ORIGIN.x - 1.5, y: DILATION_ORIGIN.y - 1 },
  { x: DILATION_ORIGIN.x - 2.5, y: DILATION_ORIGIN.y - 1 },
  { x: DILATION_ORIGIN.x - 2.5, y: DILATION_ORIGIN.y - 2 },
  { x: DILATION_ORIGIN.x - 1.5, y: DILATION_ORIGIN.y - 2 },
];

const SQUARE_LABELS = ["K", "L", "M", "N"];
const SQUARE_PRIME_LABELS = ["K\u2032", "L\u2032", "M\u2032", "N\u2032"];

const TRAPEZIUM_PQRS = [
  { x: DILATION_ORIGIN.x + 2.5, y: DILATION_ORIGIN.y - 4.5 },
  { x: DILATION_ORIGIN.x + 6.5, y: DILATION_ORIGIN.y - 4.5 },
  { x: DILATION_ORIGIN.x + 5, y: DILATION_ORIGIN.y - 2 },
  { x: DILATION_ORIGIN.x + 3.5, y: DILATION_ORIGIN.y - 2 },
];

const TRAPEZIUM_LABELS = ["P", "Q", "R", "S"];
const TRAPEZIUM_PRIME_LABELS = ["P\u2032", "Q\u2032", "R\u2032", "S\u2032"];

const PROPERTY_SLIDER = {
  size: { min: 0.1, max: 1.8, default: 1 },
  orientation: { min: -1.8, max: 1.8, default: 1 },
  position: { min: 0.5, max: 1.8, default: 1 },
};

function rayEndpoint(center, point, length) {
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  return {
    x: center.x + (dx / dist) * length,
    y: center.y + (dy / dist) * length,
  };
}
