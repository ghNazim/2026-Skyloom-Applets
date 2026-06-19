// Path geometry and disfigurement config — tweak values here
//
// COORDINATE SYSTEM (basePoints + disfigurement offsets):
//   Math-style: x → right, y → up (bottom of shape sits on y = 0).
//   Converted to SVG (y → down) inside MainCanvas.getPathPoints().
//
// DISFIGUREMENT (pathConfig.disfigurementSteps):
//   An ordered list — each entry moves ONE vertex during the MCQ animation.
//   Steps run one after another; each step eases in over ~1 index unit of progress.
//   - point: vertex label A–H (see basePoints for positions)
//   - offsets.x: shift in math coords (+ = right, − = left)
//   - offsets.y: shift in math coords (+ = up,    − = down)
//   Strength: larger numbers = more distortion. Speed: disfigureDuration (seconds).
//   Logic that applies these: MainCanvas.buildDisfigurementSmooth()
//
const PATH_CONFIG = {
  basePoints: {
    A: { x: 3.88, y: 0.05 },
    B: { x: 11.97, y: 0.23 },
    C: { x: 19.94, y: 10.72 },
    D: { x: 17.61, y: 11.52 },
    E: { x: 13.82, y: 10.74 },
    F: { x: 13.5, y: 19.53 },
    G: { x: 2.28, y: 17.45 },
    H: { x: 0.03, y: 9.83 },
  },
  pointOrder: ["A", "B", "C", "D", "E", "F", "G", "H"],
  mathYMax: 19.53,
  shapeHeight: 300,
  leftOffset: { x: 300, y: 290 },
  rightOffset: { x: 1450, y: 290 },
  mcqGreyOffset: { x: 900, y: 310 },
  introPaper: {
    x: 1150,
    y: 200,
    scaleMultiplier: 1.68,
    // How far off-screen (to the right) the paper starts before sliding in
    enterFromXOffset: 550,
    enterDuration: 0.85,
  },
  snapThreshold: 120,
  disfigureDuration: 2.8,
  realignDuration: 0.9,
  greyPathFadeDuration: 0.5,
  rotate: {
    centerPoint: "C",
    targetAngle: 180,
    snapAngleThreshold: 20,
    guideCircleOpacity: 0.12,
    paperEnterDuration: 0.85,
    paperEnterFromXOffset: 550,
  },
  zoom: {
    anchorPoint: "A",
    scaleMin: 0.5,
    scaleMax: 1.4,
    scaleDefault: 1,
    sliderMarkers: [0.7, 0.5, 1.2, 1.4],
    snapThreshold: 0.04,
    revealTrackPoints: ["C", "F", "G", "H"],
    summaryScaleHigh: 1.4,
    summaryScaleLow: 0.5,
    pingPongDuration: 1.8,
    pingPongPause: 0.5,
    revealAnimDuration: 1.6,
    revealAnimPause: 0.5,
    scaleToOneDuration: 0.9,
  },
  mirror: {
    // Center-to-center distance (SVG px) from blue path to static yellow target.
    // Smaller = yellow + mirror sit closer to blue (less overlap with right summary).
    // Mirror snap line lands at blueCentroid.x + (this value / 2).
    staticYellowOffset: 480,
    // Extra shift for blue path + paper in mirror mode only (SVG px; negative = left).
    leftOffsetShiftX: -200,
    reflectorStartX: 1800,
    reflectorHeight: 600,
    reflectorWidth: 72,
    snapThreshold: 17.5,
    snapOverlapDuration: 1,
    viewboxWidth: 2000,
    guideLinePoints: ["C", "B", "F"],
    revealTrackPoints: ["B", "F", "H"],
    flipDuration: 1.4,
    revealRectDuration: 0.55,
    revealPauseBeforeFlip: 1.2,
    surroundRectPadding: 24,
    surroundRectRadius: 18,
    distanceRectHeight: 28,
    distanceRectRadius: 8,
    fLineExtension: 50,
  },
  disfigurementSteps: [
    { point: "H", offsets: { x: 5.0, y: 0 } },       // step 1: H moves right
    { point: "D", offsets: { x: -3.2, y: -0.9 } },   // step 2: D moves left & down
    { point: "E", offsets: { x: -3.0, y: -0.75 } },  // step 3: E moves left & down
    { point: "C", offsets: { x: 2.9, y: 0.65 } },    // step 4: C moves right & up
    { point: "G", offsets: { x: -2.65, y: 1.0 } },   // step 5: G moves left & up
    { point: "F", offsets: { x: 1.5, y: 0.4 } },     // step 6: F moves right & up
  ],
};

const DISFIGUREMENT_STEPS = PATH_CONFIG.disfigurementSteps;
