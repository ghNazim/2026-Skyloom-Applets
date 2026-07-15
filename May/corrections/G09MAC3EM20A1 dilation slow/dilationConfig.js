const DILATION_GRID_COLS = 14;
const DILATION_GRID_ROWS = 10;

/**
 * Vertical offset for the triangle (math Y axis).
 * Decrease this value to move the triangle DOWN on screen.
 * Increase to move it UP.
 * The dilation center stays at the triangle centroid automatically.
 */
const TRIANGLE_Y_OFFSET = -1.2;

const TRIANGLE_BASE = [
  { x: 7, y: 8 },
  { x: 4.835, y: 4.25 },
  { x: 9.165, y: 4.25 },
];

function getDilationGeometry() {
  const triangle = TRIANGLE_BASE.map((p) => ({
    x: p.x,
    y: p.y + TRIANGLE_Y_OFFSET,
  }));
  const center = {
    x: (triangle[0].x + triangle[1].x + triangle[2].x) / 3,
    y: (triangle[0].y + triangle[1].y + triangle[2].y) / 3,
  };
  return { center, triangle };
}

const DILATION_GEOMETRY = getDilationGeometry();

const INTRO_SLIDER = { min: 0.3, max: 1.7, center: 1, default: 1 };
const SCALE_SLIDER = { min: 0.1, max: 2, center: 1, default: 1 };

const STEP8_DEFAULT_K = 1.5;

const PULSE_K_SEQUENCE = [0.1, 1, 1.9, 1, 0.1];
